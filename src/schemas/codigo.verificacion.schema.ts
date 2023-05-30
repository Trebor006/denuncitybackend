import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MailVerifierDocument = HydratedDocument<CodigoVerificacion>;

@Schema()
export class CodigoVerificacion {
  @Prop({ required: true })
  correo: string;

  @Prop({ required: true })
  codigo: string;
}

export const CodigoVerificacionSchema =
  SchemaFactory.createForClass(CodigoVerificacion);
