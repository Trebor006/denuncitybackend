import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PasswordHistoryDocument = HydratedDocument<HistorialContrasena>;

@Schema()
export class HistorialContrasena {
  @Prop({ required: true })
  correo: string;

  @Prop({ required: true })
  contrasena: string;

  @Prop({ required: true })
  fechaCreacion: Date;
}

export const HistorialContrasenaSchema =
  SchemaFactory.createForClass(HistorialContrasena);
