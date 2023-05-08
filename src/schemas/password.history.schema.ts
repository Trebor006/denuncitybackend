import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PasswordHistoryDocument = HydratedDocument<PasswordHistory>;

@Schema()
export class PasswordHistory {
  @Prop({ required: true })
  mail: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const PasswordHistorySchema =
  SchemaFactory.createForClass(PasswordHistory);
