import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TipoDenunciasDocument = HydratedDocument<TipoDenuncias>;

@Schema()
export class TipoDenuncias {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  departamento: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const TipoDenunciasSchema = SchemaFactory.createForClass(TipoDenuncias);
