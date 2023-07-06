import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FuncionarioDocument = HydratedDocument<Funcionario>;

@Schema()
export class Funcionario {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true })
  celular: string;

  @Prop({ required: true })
  ci: string;

  @Prop({ required: true })
  correo: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  departamento: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const FuncionarioSchema = SchemaFactory.createForClass(Funcionario);
