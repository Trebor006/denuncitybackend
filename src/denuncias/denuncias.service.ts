import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const permitirRegistrar: boolean = await this.validarMaximoDenuncias(
      createDenunciaDto,
    );
    if (!permitirRegistrar) {
      console.log(
        'error cantidad maximo de registros por tipo de denuncia : ' +
          createDenunciaDto.tipoDenuncia,
      );
      throw new BadRequestException('Maximo de denuncias permitidas excedido');
    }

    const hashGenerated: string =
      this.hashCodeService.generarHashCode(createDenunciaDto);
    const permitirRegistro: boolean = await this.permitirRegistroPorHash(
      createDenunciaDto.usuario,
      hashGenerated,
    );
    if (!permitirRegistro) {
      console.log('error hash duplicado : ' + hashGenerated);
      throw new BadRequestException('La denuncia ya se ha registrado');
    }

    const denunciaContieneContenidoOfensivo =
      await this.verificarDenunciaContenidoOfensivo(createDenunciaDto);
    if (denunciaContieneContenidoOfensivo) {
      console.log('error titulo o descripcion contiene contenido ofensivo');
    }

    const imagenCorrespondeTipoDenuncia =
      await this.verificarImagenesCorrespondeTipoDenuncia(createDenunciaDto);
    if (!imagenCorrespondeTipoDenuncia) {
      console.log(
        'error imagen no corresponde a tipo de denuncia : ' +
          createDenunciaDto.tipoDenuncia,
      );

      // return Error('error imagen no corresponde a tipo de denuncia');
    }

    const denunciaRegistrada = await this.procederRegistroDenuncia(
      createDenunciaDto,
      hashGenerated,
      denunciaContieneContenidoOfensivo || imagenCorrespondeTipoDenuncia,
    );

    return denunciaRegistrada;
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
      createDenunciaDto.imagenes.map((imagen) => {
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
}
