import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MailVerifier,
  MailVerifierSchema,
} from '../schemas/mail.verifier.schema';
import { CodeVerifierService } from './code-verifier.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MailVerifier.name, schema: MailVerifierSchema },
    ]),
  ],
  providers: [CodeVerifierService],
})
export class CodeVerifierModule {}
