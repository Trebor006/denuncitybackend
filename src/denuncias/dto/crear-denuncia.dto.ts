export class CrearDenunciaDto {
  hashCode: string;
  correo: string;

  titulo: string;
  descripcion: string;

  tipoDenuncia: string;
  imagenesUrls: string[];
  createdAt: Date;
  estado: string;
}
