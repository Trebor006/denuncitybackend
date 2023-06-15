import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HistorialContrasena } from '../schemas/historial.contrasena.schema';
import { HistorialContrasenaDto } from './dto/historial.contrasena.dto';

@Injectable()
export class HistorialContrasenaService {
  constructor(
    @InjectModel(HistorialContrasena.name)
    private historialContrasenaModel: Model<HistorialContrasena>,
  ) {}

  async verificarNuevaContrasena(
    correo: string,
    contrasena: string,
  ): Promise<boolean> {
    const oldPassword = await this.historialContrasenaModel
      .findOne({
        correo: correo,
        contrasena: contrasena,
      })
      .exec();

    return oldPassword == null;
  }

  registrarNuevoHistorial(correo: string, contrasena: string) {
    let passwordHistoryDto = new HistorialContrasenaDto();
    passwordHistoryDto.correo = correo;
    passwordHistoryDto.contrasena = contrasena;
    passwordHistoryDto.fechaCreacion = new Date();

    const passwordHistory = new this.historialContrasenaModel(
      passwordHistoryDto,
    );
    passwordHistory.save();
  }

  async obtenerFechaDeUltimaActualizacion(correo: string): Promise<Date> {
    const oldPassword = await this.historialContrasenaModel
      .findOne({
        correo: correo,
      })
      .sort({ fechaCreacion: -1 })
      .exec();

    return oldPassword.fechaCreacion;
  }
}
