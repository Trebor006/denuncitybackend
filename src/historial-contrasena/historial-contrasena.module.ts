import { Module } from '@nestjs/common';
import { HistorialContrasenaService } from './historial-contrasena.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HistorialContrasena,
  HistorialContrasenaSchema,
} from '../schemas/historial.contrasena.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HistorialContrasena.name, schema: HistorialContrasenaSchema },
    ]),
  ],
  providers: [HistorialContrasenaService],
})
export class HistorialContrasenaModule {}
