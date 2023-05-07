import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MailVerifierDocument = HydratedDocument<MailVerifier>;

@Schema()
export class MailVerifier {
  @Prop({ required: true })
  mail: string;

  @Prop({ required: true })
  code: string;
}

export const MailVerifierSchema = SchemaFactory.createForClass(MailVerifier);
