import { Injectable } from '@nestjs/common';
import { CrearDenunciaRequestDto } from './dto/crear-denuncia.request.dto';
import { OpenaiService } from '../components/openai/openai.service';
import { DropboxClientService } from '../components/dropbox-client/dropbox-client.service';
import { ClarifaiService } from '../components/clarifai/clarifai.service';
import { PromptsService } from './prompts.service';
import { HashCodeService } from '../common/utils/hash-code/hash-code.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Denuncia } from '../schemas/denuncia.schema';
import { CrearDenunciaDto } from './dto/crear-denuncia.dto';
import { CancelarDenunciaRequestDto } from './dto/cancelar-denuncia.request.dto';
import { ErrorResponse } from '../common/dto/base/error-response.dto';
import { ErrorCodes } from '../common/dto/base/ErrorCodes';
import { BaseResponse } from '../common/dto/base/base-response.dto';
import { DenunciaDto } from '../common/dto/denuncia-dto';
import { TipoDenunciasService } from '../configurationsresources/tipo-denuncias/tipo-denuncias.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { ActualizarEstadoDenunciaRequestDto } from './dto/actualizar-estado-denuncia.request.dto';
import { Usuario } from '../schemas/usuario.schema';
import { AgregarComentarioDenunciaRequestDto } from './dto/agregar-comentario-denuncia.request.dto';
import { ComentarioDto } from '../common/dto/comentario-dto';
import { ActualizarDepartamentoDenunciaRequestDto } from './dto/actualizar-departamento-denuncia.request.dto';
import { TokenDispositivo } from '../schemas/tokenDispositivo.schema';
import { DepartamentosService } from '../configurationsresources/departamentos/departamentos.service';
import { Departamento } from '../schemas/departamento.schema';
import { MyGateway } from '../MyGateway';
import { TipoDenuncia } from '../common/dto/tipo-denuncia';
import { TipoDenuncias } from '../schemas/tipo-denuncia.schema';

@Injectable()
export class DenunciasService {
  constructor(
    private hashCodeService: HashCodeService,
    private clarifaiService: ClarifaiService,
    private promptsService: PromptsService,
    private openaiService: OpenaiService,
    private dropboxClientService: DropboxClientService,
    private tipoDenunciasService: TipoDenunciasService,
    private notificacionesService: NotificacionesService,
    private departamentosService: DepartamentosService,
    @InjectModel(Usuario.name) private userModel: Model<Usuario>,
    @InjectModel(Denuncia.name) private denunciaModel: Model<Denuncia>,
    @InjectModel(TokenDispositivo.name)
    private tokenDispositivoModel: Model<TokenDispositivo>,
    @InjectModel(TipoDenuncias.name)
    private tipoDenunciaModel: Model<TipoDenuncias>,
    private myGateway: MyGateway,
  ) {}

  async crear(createDenunciaDto: CrearDenunciaRequestDto) {
    let errors: ErrorResponse[] = [];

    const permitirRegistrar: boolean = await this.validarMaximoDenuncias(
      createDenunciaDto,
    );
    if (!permitirRegistrar) {
      console.log(
        'error cantidad maximo de registros por tipo de denuncia : ' +
          createDenunciaDto.tipoDenuncia,
      );
      errors.push(
        ErrorResponse.generateError(
          ErrorCodes.ERROR_MAXIMO_DENUNCIA,
          'Maximo de denuncias permitidas excedido',
        ),
      );
    }

    const hashGenerated: string =
      this.hashCodeService.generarHashCode(createDenunciaDto);
    const permitirRegistro: boolean = await this.permitirRegistroPorHash(
      createDenunciaDto.usuario,
      hashGenerated,
    );
    if (!permitirRegistro) {
      console.log('error hash duplicado : ' + hashGenerated);
      errors.push(
        ErrorResponse.generateError(
          ErrorCodes.ERROR_DENUNCIA_DUPLICADA,
          'La denuncia ya se ha registrado',
        ),
      );
    }

    if (errors.length > 0) {
      return BaseResponse.generateError(
        'Error al registrar la denuncia',
        errors,
      );
    }

    const denunciaContieneContenidoOfensivo =
      await this.verificarDenunciaContenidoOfensivo(createDenunciaDto);
    if (denunciaContieneContenidoOfensivo) {
      console.log('error titulo o descripcion contiene contenido ofensivo');

      errors.push(
        ErrorResponse.generateError(
          ErrorCodes.ERROR_CONTENIDO_OFENSIVO,
          'Error titulo o descripcion contiene contenido ofensivo',
        ),
      );
    }

    const imagenCorrespondeTipoDenuncia =
      await this.verificarImagenesCorrespondeTipoDenuncia(createDenunciaDto);
    if (!imagenCorrespondeTipoDenuncia) {
      console.log(
        'Error imagen no corresponde a tipo de denuncia : ' +
          createDenunciaDto.tipoDenuncia,
      );

      errors.push(
        ErrorResponse.generateError(
          ErrorCodes.ERROR_IMAGEN_NO_CORRESPONDE,
          'Error imagen no corresponde a tipo de denuncia',
        ),
      );
    }

    const denunciaRegistrada = await this.procederRegistroDenuncia(
      createDenunciaDto,
      hashGenerated,
      denunciaContieneContenidoOfensivo || !imagenCorrespondeTipoDenuncia,
    );

    if (denunciaContieneContenidoOfensivo || !imagenCorrespondeTipoDenuncia) {
      this.myGateway.emitInsertEvent(
        await this.mapearDenuncia(denunciaRegistrada),
      );

      return BaseResponse.generateOkResponse(
        'La Denuncia ha sido registrada como Rechazada',
        {
          denuncia: denunciaRegistrada,
          errors: errors,
        },
      );
    } else {
      return BaseResponse.generateOkResponse(
        'Denuncia registrada satisfactoriamente',
        denunciaRegistrada,
      );
    }
  }

  async cancelar(cancelarDenunciaRequestDto: CancelarDenunciaRequestDto) {
    const denuncia = await this.denunciaModel
      .findOne({
        correo: cancelarDenunciaRequestDto.usuario,
        hash: cancelarDenunciaRequestDto.hash,
      })
      .exec();

    if (denuncia.estado !== 'PENDIENTE') {
      console.log('No se puede cancelar por el estado');
      return Error('No se puede cancelar por el estado');
    }

    denuncia.estado = 'CANCELADO';
    await denuncia.save();

    return true;
  }

  private async validarMaximoDenuncias(
    createDenunciaDto: CrearDenunciaRequestDto,
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to midnight for comparison

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Get the date for tomorrow

    const denunciasPorTipo = await this.denunciaModel
      .find({
        correo: createDenunciaDto.usuario,
        tipoDenuncia: createDenunciaDto.tipoDenuncia,
        estado: { $ne: 'CANCELADO' },
        createdAt: {
          $gte: today,
          $lt: tomorrow,
        },
      })
      .exec();

    return denunciasPorTipo.length < 2;
  }

  private async permitirRegistroPorHash(usuario: string, hash: string) {
    const denunciasHash = await this.denunciaModel
      .find({
        correo: usuario,
        hash: hash,
      })
      .exec();

    return denunciasHash.length == 0;
  }

  private async verificarImagenesCorrespondeTipoDenuncia(
    createDenunciaDto: CrearDenunciaRequestDto,
  ): Promise<boolean> {
    const resultados: boolean[] = await Promise.all(
      createDenunciaDto.imagenesList.map((imagen) => {
        return this.verificarImagenCorrespondeTipoDenuncia(
          createDenunciaDto.tipoDenuncia,
          imagen,
        );
      }),
    );

    return resultados.every((resultado) => resultado);
  }

  private async verificarImagenCorrespondeTipoDenuncia(
    tipoDenuncia: string,
    imagenPrueba: string,
  ) {
    const detalleImagen = await this.clarifaiService.recognitionImageDetail(
      imagenPrueba,
    );
    const promptVerificacionContenidoImagen =
      this.promptsService.getPromptByCode('VERIFICACION_CONTENIDO_IMAGEN');

    const promptVerificacionImagen = promptVerificacionContenidoImagen
      .replace('{0}', tipoDenuncia)
      .replace('{1}', detalleImagen);

    const resultadoVerificacionImagen: boolean = JSON.parse(
      await this.openaiService.generateRequest(promptVerificacionImagen),
    );

    console.log('resultadoVerificacionImagen : ' + resultadoVerificacionImagen);

    return resultadoVerificacionImagen;
  }

  private async verificarDenunciaContenidoOfensivo(
    createDenunciaDto: CrearDenunciaRequestDto,
  ) {
    const promptVerificacionContenidoOfensivo =
      this.promptsService.getPromptByCode('VERIFICACION_CONTENIDO_OFENSIVO');

    const promptContenidoDenuncia = promptVerificacionContenidoOfensivo.replace(
      '{0}',
      createDenunciaDto.titulo + ' : ' + createDenunciaDto.descripcion + ' ',
    );

    const resultadoContenidoOfensivo: boolean = JSON.parse(
      await this.openaiService.generateRequest(promptContenidoDenuncia),
    );

    console.log('resultadoContenidoOfensivo : ' + resultadoContenidoOfensivo);

    return resultadoContenidoOfensivo;
  }

  private async procederRegistroDenuncia(
    createDenunciaDto: CrearDenunciaRequestDto,
    hash: string,
    rechazarDenuncia: boolean,
  ) {
    const imageUrls = await this.dropboxClientService.subirImagenes(
      createDenunciaDto,
      hash,
    );

    const nuevaDenunciaDto: CrearDenunciaDto = new CrearDenunciaDto();
    nuevaDenunciaDto.hash = hash;
    nuevaDenunciaDto.correo = createDenunciaDto.usuario;
    nuevaDenunciaDto.titulo = createDenunciaDto.titulo;
    nuevaDenunciaDto.descripcion = createDenunciaDto.descripcion;
    nuevaDenunciaDto.tipoDenuncia = createDenunciaDto.tipoDenuncia;
    nuevaDenunciaDto.lon = createDenunciaDto.lon;
    nuevaDenunciaDto.lat = createDenunciaDto.lat;
    nuevaDenunciaDto.estado = rechazarDenuncia ? 'RECHAZADA' : 'PENDIENTE';
    nuevaDenunciaDto.imagenesUrls = imageUrls;
    nuevaDenunciaDto.createdAt = new Date();
    nuevaDenunciaDto.comentarios = [];

    const model = new this.denunciaModel(nuevaDenunciaDto);
    const denunciaAlmacenada = await model.save();

    return denunciaAlmacenada;
  }

  async obtenerListaDenuncias(usuario: string) {
    const denunciasPorUsuario = await this.denunciaModel
      .find({
        correo: usuario,
      })
      .exec();

    return denunciasPorUsuario;
  }

  async obtenerListaDenunciasPorTipo() {
    const denunciasPorTipo = await this.denunciaModel
      .aggregate([
        {
          $group: {
            _id: '$tipoDenuncia',
            total: { $sum: 1 },
            aceptadas: {
              $sum: { $cond: [{ $eq: ['$estado', 'ACEPTADA'] }, 1, 0] },
            },
          },
        },
        { $sort: { aceptadas: -1 } },
      ])
      .exec();

    return denunciasPorTipo;
  }

  async obtenerAllDenuncias(
    estado: string,
    fechaInicio: string,
    fechaFin: string,
    tipoDenuncia: string,
  ) {
    const denuncias = await this.obtenerAllDenunciasBD(
      estado,
      fechaInicio,
      fechaFin,
      tipoDenuncia,
    );

    const denunciasDto = await this.mapearDenuncias(denuncias);

    return denunciasDto;
  }

  async obtenerAllDenunciasBD(
    estado: string,
    fechaInicio: string,
    fechaFin: string,
    tipoDenuncia: string,
  ) {
    let query = this.denunciaModel.find();

    query = query.where('estado').nin(['RECHAZADA', 'CANCELADO', 'PENDIENTE']);

    if (estado) {
      query = query.where('estado', estado);
    }

    if (fechaInicio) {
      // @ts-ignore
      query = query.where('createdAt').gte(new Date(fechaInicio));
    }

    if (fechaFin) {
      const fecha = new Date(fechaFin);

      fecha.setHours(23);
      fecha.setMinutes(59);
      fecha.setSeconds(59);
      fecha.setMilliseconds(999);

      // @ts-ignore
      query = query.where('createdAt').lte(fecha);
    }

    if (tipoDenuncia) {
      query = query.where('tipoDenuncia', tipoDenuncia);
    }

    const denuncias = await query.exec();

    return denuncias;
  }

  async obtenerDenunciasPaginadas(
    estado: string,
    fechaInicio: string,
    fechaFin: string,
    tipoDenuncia: string,
    pagina: number,
    porPagina: number,
    ordenadoPor: string,
    ordenadoDir: number,
    departamento: string,
  ) {
    const skip = (pagina - 1) * porPagina;

    let query = this.denunciaModel.find();
    let queryCount = this.denunciaModel.find();

    if (estado) {
      query = query.where('estado', estado);
      queryCount = queryCount.where('estado', estado);
    }

    if (fechaInicio) {
      // @ts-ignore
      query = query.where('createdAt').gte(new Date(fechaInicio));
      // @ts-ignore
      queryCount = queryCount.where('createdAt').gte(new Date(fechaInicio));
    }

    if (fechaFin) {
      const fecha = new Date(fechaFin);

      fecha.setHours(23);
      fecha.setMinutes(59);
      fecha.setSeconds(59);
      fecha.setMilliseconds(999);

      // @ts-ignore
      query = query.where('createdAt').lte(fecha);
      // @ts-ignore
      queryCount = queryCount.where('createdAt').lte(fecha);
    }

    if (tipoDenuncia) {
      query = query.where('tipoDenuncia', tipoDenuncia);
      queryCount = queryCount.where('tipoDenuncia', tipoDenuncia);
    } else {
      const tpd = await this.tipoDenunciaModel.find({ departamento }).exec();
      const map: string[] = tpd.map((tp) => tp.nombre);

      query = query.where('tipoDenuncia').in(map);
      queryCount = queryCount.where('tipoDenuncia').in(map);
    }

    const sortField: string = ordenadoPor;
    const sortQuery: { [key: string]: any } = {};
    sortQuery[sortField] = ordenadoDir;

    const [denunciasSaved, totalDenuncias] = await Promise.all([
      query.sort(sortQuery).skip(skip).limit(porPagina).exec(),
      queryCount.countDocuments().exec(),
    ]);

    const totalPaginas = Math.ceil(totalDenuncias / porPagina);
    const denuncias = await this.mapearDenuncias(denunciasSaved);
    return { denuncias, totalPaginas };
  }

  // private async mapearDenuncias(denuncias: Denuncia[]): Promise<DenunciaDto[]> {
  //   const tiposDenuncias = await this.tipoDenunciasService.mapToTipoDenuncia();
  //
  //   return denuncias.map((denuncia) => {
  //     const tipoDenuncia = tiposDenuncias.find(
  //       (tipo) => tipo.tipo === denuncia.tipoDenuncia,
  //     );
  //
  //     return {
  //       _id: denuncia.hash,
  //       correo: denuncia.correo,
  //       titulo: denuncia.titulo,
  //       descripcion: denuncia.descripcion,
  //       tipoDenuncia: denuncia.tipoDenuncia,
  //       colorMarker: tipoDenuncia ? tipoDenuncia.color : '', // Obtener el color del tipo de denuncia
  //       estado: denuncia.estado,
  //       imagenesUrls: denuncia.imagenesUrls,
  //       lon: denuncia.lon,
  //       lat: denuncia.lat,
  //       createdAt: this.parseDate(denuncia.createdAt),
  //     };
  //   });
  // }

  private async mapearDenuncia(
    denuncia: Denuncia,
    tiposDenuncias?: TipoDenuncia[],
  ): Promise<DenunciaDto> {
    if (!tiposDenuncias) {
      const tiposDenuncias =
        await this.tipoDenunciasService.mapToTipoDenuncia();
    }

    const tipoDenuncia = tiposDenuncias.find(
      (tipo) => tipo.tipo === denuncia.tipoDenuncia,
    );

    return {
      _id: denuncia.hash,
      correo: denuncia.correo,
      titulo: denuncia.titulo,
      descripcion: denuncia.descripcion,
      tipoDenuncia: denuncia.tipoDenuncia,
      colorMarker: tipoDenuncia ? tipoDenuncia.color : '',
      estado: denuncia.estado,
      imagenesUrls: denuncia.imagenesUrls,
      lon: denuncia.lon,
      lat: denuncia.lat,
      createdAt: this.parseDate(denuncia.createdAt),
    };
  }

  private async mapearDenuncias(denuncias: Denuncia[]): Promise<DenunciaDto[]> {
    const denunciasMapeadas = [];
    const tiposDenuncias = await this.tipoDenunciasService.mapToTipoDenuncia();

    for (const denuncia of denuncias) {
      const denunciaMapeada = await this.mapearDenuncia(
        denuncia,
        tiposDenuncias,
      );
      denunciasMapeadas.push(denunciaMapeada);
    }

    return denunciasMapeadas;
  }

  parseDate(createdAt: Date): string {
    const fecha = new Date(createdAt);
    const dia = String(fecha.getUTCDate()).padStart(2, '0'); // Día del mes, de 1 a 31.
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // Los meses se cuentan de 0 a 11, por lo que sumamos 1.
    const ano = fecha.getUTCFullYear(); // Año (4 dígitos).

    return `${dia}/${mes}/${ano}`;
  }

  async buscar(id: string) {
    const denuncia = await this.denunciaModel
      .findOne({
        hash: id,
      })
      .exec();
    const departamentos = await this.departamentosService.obtenerRegistros();

    return {
      _id: denuncia.hash,
      correo: denuncia.correo,
      titulo: denuncia.titulo,
      descripcion: denuncia.descripcion,
      tipoDenuncia: denuncia.tipoDenuncia,
      estado: denuncia.estado,
      imagenesUrls: denuncia.imagenesUrls,
      lon: denuncia.lon,
      lat: denuncia.lat,
      createdAt: this.parseDate(denuncia.createdAt),
      comentarios: await this.parseComments(
        denuncia.comentarios,
        departamentos,
      ),
    };
  }

  async actualizarEstadoDenuncia(
    id: string,
    actualizarEstadoDenunciaRequestDto: ActualizarEstadoDenunciaRequestDto,
  ) {
    const denuncia = await this.denunciaModel.findOne({ hash: id }).exec();
    if (denuncia == null) {
      new Error('No existe la denuncia');
    }

    const estado = actualizarEstadoDenunciaRequestDto.estado;
    denuncia.estado = estado;

    let comentario = new ComentarioDto();
    comentario.funcionario = actualizarEstadoDenunciaRequestDto.funcionario;
    comentario.departamento = actualizarEstadoDenunciaRequestDto.departamento;
    comentario.comentario = actualizarEstadoDenunciaRequestDto.comentario;
    comentario.accion = 'Estado de denuncia Actualizado';
    comentario.createdAt = new Date();

    denuncia.comentarios.push(comentario);
    await denuncia.save();

    const user = await this.userModel
      .findOne({ correo: denuncia.correo })
      .exec();

    const tokensDocuments = await this.tokenDispositivoModel
      .find({ usuario: denuncia.correo })
      .exec();

    const tokens = await tokensDocuments.map(
      (tokensDocuments) => tokensDocuments.tokenDevice,
    );

    this.notificacionesService.sendNotification(
      tokens,
      'Estado de denuncia Actualizado',
      denuncia.titulo + '....',
      JSON.stringify(denuncia),
      denuncia.imagenesUrls[0],
      denuncia.hash,
      user.correo,
    );
    console.log(JSON.stringify(denuncia));
  }

  async agregarComentarioDenuncia(
    id: string,
    agregarComentarioDenunciaRequestDto: AgregarComentarioDenunciaRequestDto,
  ) {
    const denuncia = await this.denunciaModel.findOne({ hash: id }).exec();
    if (denuncia == null) {
      new Error('No existe la denuncia');
    }

    let comentario = new ComentarioDto();
    comentario.funcionario = agregarComentarioDenunciaRequestDto.funcionario;
    comentario.departamento = agregarComentarioDenunciaRequestDto.departamento;
    comentario.comentario = agregarComentarioDenunciaRequestDto.comentario;
    comentario.accion = 'Comentario';
    comentario.createdAt = new Date();

    denuncia.comentarios.push(comentario);
    await denuncia.save();

    const user = await this.userModel
      .findOne({ correo: denuncia.correo })
      .exec();

    const tokensDocuments = await this.tokenDispositivoModel
      .find({ usuario: denuncia.correo })
      .exec();

    const tokens = await tokensDocuments.map(
      (tokensDocuments) => tokensDocuments.tokenDevice,
    );

    this.notificacionesService.sendNotification(
      tokens,
      'Comentario añadido a Denuncia',
      denuncia.titulo + '....',
      JSON.stringify(denuncia),
      denuncia.imagenesUrls[0],
      denuncia.hash,
      user.correo,
    );

    console.log(JSON.stringify(denuncia));
  }

  async actualizarDepartamentoDenuncia(
    id: string,
    actualizarDepartamentoDenunciaRequestDto: ActualizarDepartamentoDenunciaRequestDto,
  ) {
    const denuncia = await this.denunciaModel.findOne({ hash: id }).exec();
    if (denuncia == null) {
      new Error('No existe la denuncia');
    }

    denuncia.tipoDenuncia =
      actualizarDepartamentoDenunciaRequestDto.departamentoNuevo;
    await denuncia.save();

    const user = await this.userModel
      .findOne({ usuario: denuncia.correo })
      .exec();

    const tokensDocuments = await this.tokenDispositivoModel
      .find({ usuario: denuncia.correo })
      .exec();

    const tokens = await tokensDocuments.map(
      (tokensDocuments) => tokensDocuments.tokenDevice,
    );

    this.notificacionesService.sendNotification(
      tokens,
      'Estado de denuncia Actualizado',
      denuncia.titulo + '....',
      JSON.stringify(denuncia),
      denuncia.imagenesUrls[0],
      denuncia.hash,
      user.correo,
    );

    console.log(JSON.stringify(denuncia));
  }

  private async parseComments(
    comentarios: ComentarioDto[],
    departamentos: Departamento[],
  ): Promise<ComentarioDto[]> {
    comentarios.forEach((comentario) => {
      const departamento = departamentos.find(
        (departamento) => departamento.id === comentario.departamento,
      );

      if (departamento) {
        // Realizar las operaciones que necesites con el departamento encontrado
        console.log(departamento);
        comentario.departamento = departamento.nombre;
      }
    });

    return comentarios;
  }
}
