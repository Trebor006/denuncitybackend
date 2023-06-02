export class CrearDenunciaRequestDto {
  usuario: string;

  titulo: string;
  descripcion: string;

  tipoDenuncia: string;
  lon: string;
  lat: string;
  imagen1: string;
  imagen2: string;
  imagen3: string;

  imagenes: string[];
}
