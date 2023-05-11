import { Body, Controller, Post } from '@nestjs/common';
import { VerificationCodeService } from './verification-code.service';
import { GenerarCodigoVerificacionDto } from './dto/generar-codigo-verificacion.dto';
import { ValidarCodigoVerificacionDto } from './dto/validar-codigo-verificacion.dto';

@Controller('codigoVerificacion')
export class VerificationCodeController {
  constructor(
    private readonly verificationCodeService: VerificationCodeService,
  ) {}

  @Post('generar')
  generarCodigoDeVerificacion(
    @Body() createVerificationCodeDto: GenerarCodigoVerificacionDto,
  ) {
    this.verificationCodeService.generarCodigoDeVerificacion(
      createVerificationCodeDto,
    );
  }

  @Post('validar')
  async validarCodigoDeVerificacion(
    @Body() validarCodigoVerificacionDto: ValidarCodigoVerificacionDto,
  ) {
    const isValid =
      await this.verificationCodeService.validarCodigoDeVerificacion(
        validarCodigoVerificacionDto,
      );

    return isValid;
  }
}
