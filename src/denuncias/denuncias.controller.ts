import { Body, Controller, Post } from '@nestjs/common';
import { DenunciasService } from './denuncias.service';
import { CrearDenunciaRequestDto } from './dto/crear-denuncia.request.dto';
import { DenunciasValidatorService } from './denuncias.validator.service';

@Controller('denuncias')
export class DenunciasController {
  constructor(
    private readonly denunciasService: DenunciasService,
    private readonly denunciasValidatorService: DenunciasValidatorService,
  ) {}

  @Post()
  async crear(@Body() crearDenunciaDto: CrearDenunciaRequestDto) {
    const resultValidation =
      this.denunciasValidatorService.validarDTO(crearDenunciaDto);
    if (resultValidation.length > 0) {
      return {
        success: false,
        errores: resultValidation,
      };
    }

    const result = await this.denunciasService.crear(crearDenunciaDto);

    return result;
  }
}
