import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CodigoVerificacion,
  CodigoVerificacionSchema,
} from '../schemas/codigo.verificacion.schema';
import { GeneradorCodigoService } from './generador-codigo.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CodigoVerificacion.name, schema: CodigoVerificacionSchema },
    ]),
  ],
  providers: [GeneradorCodigoService],
})
export class GeneradorCodigoModule {}
