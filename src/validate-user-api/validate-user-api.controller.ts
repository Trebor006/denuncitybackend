import { Body, Controller, Post } from '@nestjs/common';
import { ValidateUserApiService } from './validate-user-api.service';
import { ValidationRequest } from './dto/validation-request.dto';

@Controller('usuario')
export class ValidateUserApiController {
  constructor(private readonly segipApiService: ValidateUserApiService) {}

  @Post('validar')
  async validarRegistroViaSegip(@Body() validationRequest: ValidationRequest) {
    console.log('validarRegistroViaSegip :: ', { ...validationRequest });

    const userDto = await this.segipApiService.validar(validationRequest);
    return userDto;
  }
}
