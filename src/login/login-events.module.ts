import { Module } from '@nestjs/common';
import { LoginEventsService } from './login-events.service';
import { LoginEventsController } from './login-events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { usuario, UsuarioSchema } from '../schemas/usuario.schema';
import { GeneradorCodigoService } from '../generador-codigo/generador-codigo.service';
import { GeneradorCodigoModule } from '../generador-codigo/generador-codigo.module';
import {
  CodigoVerificacion,
  CodigoVerificacionSchema,
} from '../schemas/codigo.verificacion.schema';
import { PasswordHistoryService } from '../password-history/password-history.service';
import {
  HistorialContrasena,
  HistorialContrasenaSchema,
} from '../schemas/historial.contrasena.schema';

@Module({
  imports: [
    GeneradorCodigoModule,
    MongooseModule.forFeature([
      { name: usuario.name, schema: UsuarioSchema },
      { name: CodigoVerificacion.name, schema: CodigoVerificacionSchema },
      { name: HistorialContrasena.name, schema: HistorialContrasenaSchema },
    ]),
  ],
  controllers: [LoginEventsController],
  providers: [LoginEventsService, GeneradorCodigoService, PasswordHistoryService],
})
export class LoginEventsModule {}
