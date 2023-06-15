import { Module } from '@nestjs/common';
import { ConfigurationsService } from './configurations.service';
import { ConfigurationsController } from './configurations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Configuraciones,
  ConfiguracionesSchema,
} from '../schemas/configuracion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Configuraciones.name, schema: ConfiguracionesSchema },
    ]),
  ],
  controllers: [ConfigurationsController],
  providers: [ConfigurationsService],
})
export class ConfigurationsModule {}
