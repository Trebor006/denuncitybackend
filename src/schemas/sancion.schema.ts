import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SancionesDocument = HydratedDocument<Sanciones>;

@Schema()
export class Sanciones {
  @Prop({ required: true })
  correo: string;

  @Prop({ required: true })
  motivo: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  fechaFinal: Date;
}

export const SancionesSchema = SchemaFactory.createForClass(Sanciones);
