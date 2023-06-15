import { Injectable } from '@nestjs/common';
import { Dropbox } from 'dropbox';
import { ConfigService } from '@nestjs/config';
import { BufferUtilService } from '../../common/utils/buffer-util/buffer-util.service';
import { CrearDenunciaRequestDto } from '../../denuncias/dto/crear-denuncia.request.dto';
import { HashCodeService } from '../../common/utils/hash-code/hash-code.service';

@Injectable()
export class DropboxClientService {
  private client: Dropbox;
  private readonly BASE_URL: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly bufferUtilService: BufferUtilService,
    private readonly hashCodeService: HashCodeService,
  ) {
    this.BASE_URL = this.configService.get<string>('DROPBOX_BASE_URL');
    this.client = new Dropbox({
      accessToken: process.env.DROPBOX_API_KEY,
    });
  }

  async crearFolder(path: string): Promise<void> {
    await this.client.filesCreateFolderV2({ path });
  }

  async subirImagenes(
    createDenunciaDto: CrearDenunciaRequestDto,
    hash: string,
  ) {
    const folderDenuncias = this.configService.get<string>(
      'DROPBOX_FOLDER_DENUNCIAS',
    );
    const folderName = this.BASE_URL + folderDenuncias + '/' + hash;
    const existeFolder = await this.verificarFolder(folderName);
    if (!existeFolder) {
      await this.crearFolder(folderName);
    }

    const urlImagenes: string[] = await Promise.all(
      createDenunciaDto.imagenesList.map(async (imagen) => {
        const url = await this.subirImagenBase64(
          imagen,
          this.hashCodeService.generarHashCode(imagen) + '.jpg',
          hash,
        );
        console.log('image url: ' + url);

        return url;
      }),
    );

    return urlImagenes;
  }

  async recuperarImagen(path: string): Promise<any> {
    const response = await this.client.filesDownload({ path });
    return response.result;
  }

  private async subirImagenBase64(
    photoData: string,
    fileName: string,
    folder: string,
  ): Promise<string> {
    const data = this.bufferUtilService.parseBase64ToBuffer(photoData);
    const url = await this.subirImagen(folder, fileName, data);

    return url;
  }

  private async subirImagen(
    folder: string,
    photoName: string,
    contents: Buffer,
  ): Promise<string> {
    const folderDenuncias = this.configService.get<string>(
      'DROPBOX_FOLDER_DENUNCIAS',
    );
    const folderName = this.BASE_URL + folderDenuncias + '/' + folder;
    const existeFolder = await this.verificarFolder(folderName);
    if (!existeFolder) {
      await this.crearFolder(folderName);
    }

    const finalPath = folderName + '/' + photoName;

    await this.client.filesUpload({
      path: finalPath,
      contents,
    });

    const sharedLink = await this.client.sharingCreateSharedLinkWithSettings({
      path: finalPath,
    });

    return sharedLink.result.url.replace('dl=0', 'raw=1');
  }

  private async verificarFolder(path: string) {
    try {
      const folder = await this.client.filesGetMetadata({ path });
      return true; // Si no hay error, la carpeta existe.
    } catch (error) {
      if (error.status === 409) {
        return false; // Si el error es 409, la carpeta no existe.
      } else {
        throw error; // Si hay otro tipo de error, lo lanzamos.
      }
    }
  }
}
