import { Body, Controller, Post } from '@nestjs/common';
import { SegipApiService } from './segip-api.service';
import { ValidationRequest } from './dto/validation-request.dto';

@Controller('segip')
export class SegipApiController {
  constructor(private readonly segipApiService: SegipApiService) {}

  @Post('validateUser')
  async validarRegistroViaSegip(@Body() validationRequest: ValidationRequest) {
    const validate = await this.segipApiService.validate(validationRequest);
    return validate;
  }
}
