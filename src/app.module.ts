import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginEventsModule } from './login-events/login-events.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CodeVerifierModule } from './code-verifier/code-verifier.module';
import { PasswordHistoryModule } from './password-history/password-history.module';
import { ConfigurationsService } from './configurations/configurations.service';
import { ConfigurationsModule } from './configurations/configurations.module';
import { SegipApiModule } from './segip-api/segip-api.module';
import { FaceRecognitionService } from './face-recognition/face-recognition.service';
import { FaceRecognitionModule } from './face-recognition/face-recognition.module';
import { VerificationCodeModule } from './verification-code/verification-code.module';

@Module({
  imports: [
    LoginEventsModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGODB_URL,
      }),
    }),
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
    CodeVerifierModule,
    PasswordHistoryModule,
    ConfigurationsModule,
    SegipApiModule,
    FaceRecognitionModule,
    VerificationCodeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    ConfigurationsService,
    FaceRecognitionService,
  ],
})
export class AppModule {}
