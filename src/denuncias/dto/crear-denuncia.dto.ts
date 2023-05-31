export class CrearDenunciaDto {
  hash: string;
  correo: string;

  titulo: string;
  descripcion: string;

  tipoDenuncia: string;
  imagenesUrls: string[];
  createdAt: Date;
  estado: string;
}
