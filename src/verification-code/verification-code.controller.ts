import { Body, Controller, Post } from '@nestjs/common';
import { VerificationCodeService } from './verification-code.service';
import { CreateVerificationCodeDto } from './dto/create-verification-code.dto';

@Controller('verification-code')
export class VerificationCodeController {
  constructor(
    private readonly verificationCodeService: VerificationCodeService,
  ) {}

  @Post()
  generar(@Body() createVerificationCodeDto: CreateVerificationCodeDto) {
    return this.verificationCodeService.generate(createVerificationCodeDto);
  }
}
