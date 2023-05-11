import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public sendMail(mail: string, code: string): void {
    this.mailerService
      .sendMail({
        to: mail,
        // from: 'test@pablostudios.com',
        subject: 'Codigo de Verificacion',
        template: 'verifyemail',
        context: {
          // Data to be sent to template engine.
          code: code,
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
