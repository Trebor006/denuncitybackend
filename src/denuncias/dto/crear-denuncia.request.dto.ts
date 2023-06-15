export class CrearDenunciaRequestDto {
  usuario: string;

  titulo: string;
  descripcion: string;

  tipoDenuncia: string;
  lon: string;
  lat: string;
  imagenes: string;
  imagenesList: string[];
}
