import { Injectable } from '@nestjs/common';
import { CrearDenunciaRequestDto } from './dto/crear-denuncia.request.dto';

@Injectable()
export class DenunciasValidatorService {
  validarDTO(dto: CrearDenunciaRequestDto): string[] {
    const errores: string[] = [];

    // Validación del campo "descripcion"
    if (
      !dto.descripcion ||
      dto.descripcion.length < 64 ||
      dto.descripcion.length > 512
    ) {
      errores.push(
        'El campo "descripcion" debe tener entre 64 y 512 caracteres.',
      );
    }

    // Validación del campo "imagenesPrueba"
    if (!Array.isArray(dto.imagenesPrueba) || dto.imagenesPrueba.length === 0) {
      errores.push(
        'El campo "imagenesPrueba" debe ser un array y contener al menos una imagen.',
      );
    } else if (dto.imagenesPrueba.length > 3) {
      errores.push(
        'El campo "imagenesPrueba" debe contener como máximo tres imagenes.',
      );
    }

    return errores;
  }
}
