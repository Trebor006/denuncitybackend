import { Module } from '@nestjs/common';
import { PasswordHistoryService } from './password-history.service';
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
  providers: [PasswordHistoryService],
})
export class PasswordHistoryModule {}
