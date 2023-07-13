import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notificaciones,
  NotificacionesSchema,
} from '../schemas/notificaciones.schema';
import { NotificacionesService } from './notificaciones.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notificaciones.name, schema: NotificacionesSchema },
    ]),
  ],
  providers: [NotificacionesService],
})
export class NotificacionesModule {}
