import { Module } from '@nestjs/common';
import { VerificationCodeService } from './verification-code.service';
import { VerificationCodeController } from './verification-code.controller';
import { CodeVerifierService } from '../code-verifier/code-verifier.service';

@Module({
  controllers: [VerificationCodeController],
  providers: [VerificationCodeService, CodeVerifierService],
})
export class VerificationCodeModule {}
