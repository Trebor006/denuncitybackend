import { Injectable } from '@nestjs/common';
import { CrearDenunciaRequestDto } from './dto/crear-denuncia.request.dto';
import { OpenaiService } from '../components/openai/openai.service';
import { DropboxClientService } from '../components/dropbox-client/dropbox-client.service';
import { ClarifaiService } from '../components/clarifai/clarifai.service';
import { PromptsService } from './prompts.service';
import { SHA256 } from 'crypto-js';

@Injectable()
export class DenunciasService {
  constructor(
    private clarifaiService: ClarifaiService,
    private promptsService: PromptsService,
    private openaiService: OpenaiService,
    private dropboxClientService: DropboxClientService,
  ) {}

  async crear(createDenunciaDto: CrearDenunciaRequestDto) {
    //todo verificar maximo denucias por tipo
    const permitirRegistrar: boolean =
      this.validarMaximoDenuncias(createDenunciaDto);
    if (!permitirRegistrar) {
      //todo devolver error por maxima cantidad de registros del usuario para el tipo de denuncia
      console.log(
        'error cantidad maximo de registros por tipo de denuncia : ' +
          createDenunciaDto.tipoDenuncia,
      );
      return false;
    }

    const hashGenerated: string = this.generarHashCode(createDenunciaDto);
    const permitirRegistro: boolean =
      this.permitirRegistroPorHash(hashGenerated);
    if (!permitirRegistro) {
      //todo agregar Error!!!
      console.log('error hash duplicado : ' + hashGenerated);
      return false;
    }

    //todo remove esto
    const imagenCorrespondeTipoDenuncia = true;
    // const imagenCorrespondeTipoDenuncia = await this.verificarImagenesCorrespondeTipoDenuncia(createDenunciaDto);
    if (!imagenCorrespondeTipoDenuncia) {
      //todo agregar logica para cuando la imagen no tiene nada que ver con lo que indica el tipo de denuncia
      console.log(
        'error imagen no corresponde a tipo de denuncia : ' +
          createDenunciaDto.tipoDenuncia,
      );
      return false;
    }

    //todo remove esto
    const denunciaContieneContenidoOfensivo = false;
    // const denunciaContieneContenidoOfensivo = await this.verificarDenunciaContenidoOfensivo(createDenunciaDto);
    if (denunciaContieneContenidoOfensivo) {
      this.registrarSancionContenidoOfensivo(createDenunciaDto);
      console.log('error titulo o descripcion contiene contenido ofensivo');
      return false;
    }

    this.procederRegistroDenuncia(createDenunciaDto, hashGenerated);

    return {
      contenidoImagen: imagenCorrespondeTipoDenuncia,
      contenidoOfensivo: denunciaContieneContenidoOfensivo,
    };
  }

  private validarMaximoDenuncias(createDenunciaDto: CrearDenunciaRequestDto) {
    //todo agregar validacion

    return true;
  }

  private generarHashCode(createDenunciaDto: CrearDenunciaRequestDto) {
    return SHA256(JSON.stringify(createDenunciaDto)).toString();
  }

  private generarHashCodeForImage(image: string) {
    return SHA256(JSON.stringify(image)).toString();
  }

  private permitirRegistroPorHash(hash: string) {
    //todo validar si existe el hash en la BD
    return true;
  }

  private async verificarImagenesCorrespondeTipoDenuncia(
    createDenunciaDto: CrearDenunciaRequestDto,
  ): Promise<boolean> {
    const resultados: boolean[] = await Promise.all(
      createDenunciaDto.imagenesPrueba.map((imagen) => {
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

    return !!resultadoContenidoOfensivo;
  }

  private async procederRegistroDenuncia(
    createDenunciaDto: CrearDenunciaRequestDto,
    hash: string,
  ) {
    //todo agregar la logica
    //// subir imagen de denuncia para poder verificar mediante el servicio de clarifai

    const urlImagenes: string[] = await Promise.all(
      createDenunciaDto.imagenesPrueba.map((imagen) => {
        return this.dropboxClientService.subirImagenBase64(
          imagen,
          this.generarHashCodeForImage(imagen),
          hash,
        );
      }),
    );
  }

  private async registrarSancionContenidoOfensivo(
    createDenunciaDto: CrearDenunciaRequestDto,
  ) {
    //todo agregar logica para sancionar por contenido ofensivo
    // se debe registrar la sanción y fecha
  }
}
