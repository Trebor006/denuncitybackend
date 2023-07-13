import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { NotificationDto } from '../common/dto/notificacion-dto';

export type NotificacionesDocument = HydratedDocument<Notificaciones>;

@Schema()
export class Notificaciones {
  @Prop({ required: true })
  usuario: string;

  @Prop({ required: true })
  idDenuncia: string;

  @Prop({ required: true })
  notification: NotificationDto;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  data: any;

  @Prop({ required: true })
  createdAt: Date;
}

export const NotificacionesSchema =
  SchemaFactory.createForClass(Notificaciones);
