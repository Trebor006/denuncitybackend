import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DepartamentoDocument = HydratedDocument<Departamento>;

@Schema()
export class Departamento {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const DepartamentoSchema = SchemaFactory.createForClass(Departamento);
