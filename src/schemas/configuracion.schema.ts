import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ConfiguracionesDocument = HydratedDocument<Configuraciones>;

@Schema()
export class Configuraciones {
  @Prop({ required: true })
  nombre: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  configuracion: any;
}

export const ConfiguracionesSchema =
  SchemaFactory.createForClass(Configuraciones);
