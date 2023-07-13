import { ComentarioDto } from '../../common/dto/comentario-dto';

export class CrearDenunciaDto {
  hash: string;
  correo: string;

  titulo: string;
  descripcion: string;
  lon: string;
  lat: string;

  tipoDenuncia: string;
  imagenesUrls: string[];
  createdAt: Date;
  estado: string;
  comentarios: ComentarioDto[];
}
