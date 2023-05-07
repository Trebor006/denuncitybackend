import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailVerifier } from '../schemas/mail.verifier.schema';
import { MailVerifierDto } from './dto/mail-verifier.dto';

@Injectable()
export class CodeVerifierService {
  constructor(
    @InjectModel(MailVerifier.name)
    private mailVerifierModel: Model<MailVerifier>,
  ) {}

  async generateCode(mail: string): Promise<string> {
    let mailVerifierDto = new MailVerifierDto();
    mailVerifierDto.mail = mail;
    mailVerifierDto.code = this.generateNumber();

    const mailVerifier = new this.mailVerifierModel(mailVerifierDto);
    const responseMailVerifier = await mailVerifier.save();

    return responseMailVerifier.code;
  }

  private generateNumber(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
