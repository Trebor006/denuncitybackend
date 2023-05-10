import { Injectable } from '@nestjs/common';
import { CreateVerificationCodeDto } from './dto/create-verification-code.dto';
import { CodeVerifierService } from '../code-verifier/code-verifier.service';

@Injectable()
export class VerificationCodeService {
  constructor(private readonly codeVerifierService: CodeVerifierService) {}

  generate(createVerificationCodeDto: CreateVerificationCodeDto) {
    this.codeVerifierService.generateCode(createVerificationCodeDto.mail);

    return '';
  }
}
