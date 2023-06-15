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
import { TipoDenuncia } from '../common/dto/tipo-denuncia';

@Injectable()
export class DenunciasService {
  constructor(
    private hashCodeService: HashCodeService,
    private clarifaiService: ClarifaiService,
    private promptsService: PromptsService,
    private openaiService: OpenaiService,
    private dropboxClientService: DropboxClientService,
    @InjectModel(Denuncia.name)
    private denunciaModel: Model<Denuncia>,
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

    const denunciasDto = this.mapearDenuncias(denuncias);

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
      // @ts-ignore
      query = query.where('createdAt').lte(new Date(fechaFin));
    }

    if (tipoDenuncia) {
      query = query.where('tipoDenuncia', tipoDenuncia);
    }

    const denuncias = await query.exec();

    return denuncias;
  }

  private mapearDenuncias(denuncias: Denuncia[]): DenunciaDto[] {
    const tiposDenuncias: TipoDenuncia[] = [
      { tipo: 'Alumbrado', color: 'yellow' },
      { tipo: 'Basura acumulada', color: 'black' },
      { tipo: 'Baches', color: 'brown' },
      { tipo: 'Fugas de agua', color: 'blue' },
      { tipo: 'Plazas descuidadas', color: 'green' },
    ];

    return denuncias.map((denuncia) => {
      const tipoDenuncia = tiposDenuncias.find(
        (tipo) => tipo.tipo === denuncia.tipoDenuncia,
      );

      return {
        _id: denuncia.hash,
        correo: denuncia.correo,
        titulo: denuncia.titulo,
        descripcion: denuncia.descripcion,
        tipoDenuncia: denuncia.tipoDenuncia,
        colorMarker: tipoDenuncia ? tipoDenuncia.color : '', // Obtener el color del tipo de denuncia
        estado: denuncia.estado,
        imagenesUrls: denuncia.imagenesUrls,
        lon: denuncia.lon,
        lat: denuncia.lat,
        createdAt: this.parseDate(denuncia.createdAt),
      };
    });
  }

  parseDate(createdAt: Date): string {
    const fecha = new Date(createdAt);
    const dia = String(fecha.getUTCDate()).padStart(2, '0'); // Día del mes, de 1 a 31.
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // Los meses se cuentan de 0 a 11, por lo que sumamos 1.
    const ano = fecha.getUTCFullYear(); // Año (4 dígitos).

    return `${dia}/${mes}/${ano}`;
  }
}
