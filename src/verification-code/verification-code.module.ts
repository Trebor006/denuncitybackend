import { Module } from '@nestjs/common';
import { VerificationCodeService } from './verification-code.service';
import { VerificationCodeController } from './verification-code.controller';
import { GeneradorCodigoService } from '../generador-codigo/generador-codigo.service';
import { GeneradorCodigoModule } from '../generador-codigo/generador-codigo.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CodigoVerificacion,
  CodigoVerificacionSchema,
} from '../schemas/codigo.verificacion.schema';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    GeneradorCodigoModule,
    MongooseModule.forFeature([
      { name: CodigoVerificacion.name, schema: CodigoVerificacionSchema },
    ]),
  ],
  controllers: [VerificationCodeController],
  providers: [VerificationCodeService, MailService, GeneradorCodigoService],
})
export class VerificationCodeModule {}
