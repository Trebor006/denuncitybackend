import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CodigoVerificacion } from '../schemas/codigo.verificacion.schema';
import { VerificadorCorreoDto } from './dto/verificador-correo.dto';

@Injectable()
export class GeneradorCodigoService {
  constructor(
    @InjectModel(CodigoVerificacion.name)
    private mailVerifierModel: Model<CodigoVerificacion>,
  ) {}

  async generarCodigo(correo: string): Promise<string> {
    let mailVerifierDto = new VerificadorCorreoDto();
    mailVerifierDto.correo = correo;
    mailVerifierDto.codigo = this.obtenerNuevoCodigo();

    const mailVerifier = new this.mailVerifierModel(mailVerifierDto);
    const responseMailVerifier = await mailVerifier.save();

    return responseMailVerifier.codigo;
  }

  async eliminarCodigosExistentes(mail: string) {
    await this.mailVerifierModel.deleteMany({
      correo: mail,
    });
  }

  async obtenerCodigoActual(correo) {
    const codigoVerificacionActual = await this.mailVerifierModel
      .findOne({
        correo: correo,
      })
      .exec();

    if (codigoVerificacionActual == null) {
      throw new Error('Codigo No encontrado');
    }

    return codigoVerificacionActual.codigo;
  }

  private obtenerNuevoCodigo(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
