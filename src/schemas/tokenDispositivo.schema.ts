import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TokenDispositivoDocument = HydratedDocument<TokenDispositivo>;

@Schema()
export class TokenDispositivo {
  @Prop({ required: true })
  usuario: string;

  @Prop({ required: true })
  tokenDevice: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const TokenDispositivoSchema =
  SchemaFactory.createForClass(TokenDispositivo);
