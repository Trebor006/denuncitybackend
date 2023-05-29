import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { GeneradorCodigoModule } from './generador-codigo/generador-codigo.module';
import { HistorialContrasenaModule } from './historial-contrasena/historial-contrasena.module';
import { ConfigurationsService } from './configurations/configurations.service';
import { ConfigurationsModule } from './configurations/configurations.module';
import { ValidateUserApiModule } from './validate-user-api/validate-user-api.module';
import { FaceRecognitionService } from './face-recognition/face-recognition.service';
import { FaceRecognitionModule } from './face-recognition/face-recognition.module';
import { VerificationCodeModule } from './verification-code/verification-code.module';
import {
  Configuraciones,
  ConfiguracionesSchema,
} from './schemas/configuracion.schema';
import { DropboxClientService } from './components/dropbox-client/dropbox-client.service';
import { DropboxApiModule } from './components/dropbox-client/dropbox-api.module';
import { BufferUtilService } from './common/utils/buffer-util/buffer-util.service';
import { ClarifaiModule } from './components/clarifai/clarifai.module';
import { OpenaiModule } from './components/openai/openai.module';
import { DenunciasModule } from './denuncias/denuncias.module';

@Module({
  imports: [
    LoginModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGODB_URL,
      }),
    }),
    MongooseModule.forFeature([
      { name: Configuraciones.name, schema: ConfiguracionesSchema },
    ]),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT),
          secure: true,
          auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
          },
        },
        defaults: {
          from: '"Denuncity" <Denuncias Vecinales>',
        },
        template: {
          dir: process.cwd() + '/public/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
    GeneradorCodigoModule,
    HistorialContrasenaModule,
    ConfigurationsModule,
    ValidateUserApiModule,
    FaceRecognitionModule,
    VerificationCodeModule,
    DropboxApiModule,
    ClarifaiModule,
    OpenaiModule,
    DenunciasModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    ConfigurationsService,
    FaceRecognitionService,
    DropboxClientService,
    BufferUtilService,
  ],
})
export class AppModule {}
