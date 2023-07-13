import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // // Configuración de CORS para permitir todos los orígenes
  // const corsOptions: CorsOptions = {
  //   origin: '*', // Reemplaza con la URL de tu frontend en producción
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   preflightContinue: false,
  //   optionsSuccessStatus: 204,
  //   allowedHeaders: '*', // Permitir todos los encabezados
  //   exposedHeaders: '*', // Exponer todos los encabezados
  // };
  // app.enableCors(corsOptions);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  await app.listen(port);
}

bootstrap();
