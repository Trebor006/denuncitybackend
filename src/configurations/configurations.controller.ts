import { Body, Controller, Post } from '@nestjs/common';
import { ConfigurationsService } from './configurations.service';
import { RegistroConfiguracionValidacionContrasenaDto } from './dto/RegistroConfiguracionValidacionContrasena.dto';

@Controller('configuraciones')
export class ConfigurationsController {
  constructor(private readonly configurationsService: ConfigurationsService) {}

  @Post('registrar')
  registrarConfiguracion(
    @Body()
    createConfigurationDto: RegistroConfiguracionValidacionContrasenaDto,
  ) {
    const promise = this.configurationsService.registrarConfiguracion(
      createConfigurationDto,
    );
    return promise;
  }
}
