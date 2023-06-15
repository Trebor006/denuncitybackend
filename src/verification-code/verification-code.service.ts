import { Injectable } from '@nestjs/common';
import { GenerarCodigoVerificacionDto } from './dto/generar-codigo-verificacion.dto';
import { GeneradorCodigoService } from '../generador-codigo/generador-codigo.service';
import { MailService } from '../mail/mail.service';
import { ValidarCodigoVerificacionDto } from './dto/validar-codigo-verificacion.dto';

@Injectable()
export class VerificationCodeService {
  constructor(
    private readonly codeVerifierService: GeneradorCodigoService,
    private readonly mailService: MailService,
  ) {}

  async generarCodigoDeVerificacion(
    createVerificationCodeDto: GenerarCodigoVerificacionDto,
  ) {
    await this.codeVerifierService.eliminarCodigosExistentes(
      createVerificationCodeDto.correo,
    );

    const codigo = await this.codeVerifierService.generarCodigo(
      createVerificationCodeDto.correo,
    );

    this.mailService.sendMail(createVerificationCodeDto.correo, codigo);
  }

  async validarCodigoDeVerificacion(
    validarCodigoVerificacionDto: ValidarCodigoVerificacionDto,
  ) {
    const codigoActual = await this.codeVerifierService.obtenerCodigoActual(
      validarCodigoVerificacionDto.correo,
    );

    const codigoCorrecto = codigoActual === validarCodigoVerificacionDto.codigo;
    if (codigoCorrecto) {
      await this.codeVerifierService.eliminarCodigosExistentes(
        validarCodigoVerificacionDto.correo,
      );
    }

    return codigoCorrecto;
  }
}
