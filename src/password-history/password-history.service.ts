import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PasswordHistory } from '../schemas/password.history.schema';
import { PasswordHistoryDto } from './dto/password-history.dto';

@Injectable()
export class PasswordHistoryService {
  constructor(
    @InjectModel(PasswordHistory.name)
    private passwordHistoryModel: Model<PasswordHistory>,
  ) {}

  async verifyNewPassword(mail: string, password: string): Promise<boolean> {
    const oldPassword = await this.passwordHistoryModel
      .findOne({
        mail: mail,
        password: password,
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
        mail: mail,
      })
      .sort({ createdAt: -1 })
      .exec();

    return oldPassword.createdAt;
  }
}
