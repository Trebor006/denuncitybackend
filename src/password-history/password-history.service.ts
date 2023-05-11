import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HistorialContrasena } from '../schemas/historial.contrasena.schema';
import { PasswordHistoryDto } from './dto/password-history.dto';

@Injectable()
export class PasswordHistoryService {
  constructor(
    @InjectModel(HistorialContrasena.name)
    private passwordHistoryModel: Model<HistorialContrasena>,
  ) {}

  async verifyNewPassword(mail: string, password: string): Promise<boolean> {
    const oldPassword = await this.passwordHistoryModel
      .findOne({
        correo: mail,
        contrasena: password,
      })
      .exec();

    return oldPassword == null;
  }

  registerNewHistory(mail: string, password: string) {
    let passwordHistoryDto = new PasswordHistoryDto();
    passwordHistoryDto.mail = mail;
    passwordHistoryDto.password = password;
    passwordHistoryDto.createdAt = new Date();

    const passwordHistory = new this.passwordHistoryModel(passwordHistoryDto);
    passwordHistory.save();
  }

  async verifyLastRenewPassword(mail: string): Promise<Date> {
    const oldPassword = await this.passwordHistoryModel
      .findOne({
        correo: mail,
      })
      .sort({ createdAt: -1 })
      .exec();

    return oldPassword.fechaCreacion;
  }
}
