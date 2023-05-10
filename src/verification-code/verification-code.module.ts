import { Module } from '@nestjs/common';
import { VerificationCodeService } from './verification-code.service';
import { VerificationCodeController } from './verification-code.controller';
import { CodeVerifierService } from '../code-verifier/code-verifier.service';
import {CodeVerifierModule} from "../code-verifier/code-verifier.module";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../schemas/user.schema";
import {MailVerifier, MailVerifierSchema} from "../schemas/mail.verifier.schema";
import {PasswordHistory, PasswordHistorySchema} from "../schemas/password.history.schema";

@Module({
  imports: [
    CodeVerifierModule,
    MongooseModule.forFeature([
      { name: MailVerifier.name, schema: MailVerifierSchema },
    ]),
  ],
  controllers: [VerificationCodeController],
  providers: [VerificationCodeService, CodeVerifierService],
})
export class VerificationCodeModule {}
