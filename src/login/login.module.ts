import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from '../schemas/usuario.schema';
import { GeneradorCodigoService } from '../generador-codigo/generador-codigo.service';
import { GeneradorCodigoModule } from '../generador-codigo/generador-codigo.module';
import {
  CodigoVerificacion,
  CodigoVerificacionSchema,
} from '../schemas/codigo.verificacion.schema';
import { HistorialContrasenaService } from '../historial-contrasena/historial-contrasena.service';
import {
  HistorialContrasena,
  HistorialContrasenaSchema,
} from '../schemas/historial.contrasena.schema';
import { ConfigurationsService } from '../configurations/configurations.service';
import {
  Configuraciones,
  ConfiguracionesSchema,
} from '../schemas/configuracion.schema';
import {
  TokenDispositivo,
  TokenDispositivoSchema,
} from '../schemas/tokenDispositivo.schema';
import {
  Notificaciones,
  NotificacionesSchema,
} from '../schemas/notificaciones.schema';

@Module({
  imports: [
    GeneradorCodigoModule,
    MongooseModule.forFeature([
      { name: Usuario.name, schema: UsuarioSchema },
      { name: Notificaciones.name, schema: NotificacionesSchema },
      { name: TokenDispositivo.name, schema: TokenDispositivoSchema },
      { name: CodigoVerificacion.name, schema: CodigoVerificacionSchema },
      { name: HistorialContrasena.name, schema: HistorialContrasenaSchema },
      { name: Configuraciones.name, schema: ConfiguracionesSchema },
    ]),
  ],
  controllers: [LoginController],
  providers: [
    LoginService,
    GeneradorCodigoService,
    HistorialContrasenaService,
    ConfigurationsService,
  ],
})
export class LoginModule {}
