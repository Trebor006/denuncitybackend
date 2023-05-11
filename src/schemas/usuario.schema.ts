import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<usuario>;

@Schema()
export class usuario {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  mail: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  token: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(usuario);
