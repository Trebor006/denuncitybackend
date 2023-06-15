import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DenunciaDocument = HydratedDocument<Denuncia>;

@Schema()
export class  Denuncia {
  @Prop({ required: true })
  hash: string;

  @Prop({ required: true })
  correo: string;

  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true })
  tipoDenuncia: string;

  @Prop({ required: true })
  estado: string;

  @Prop({ required: true })
  lon: string;

  @Prop({ required: true })
  lat: string;

  @Prop({ required: true })
  imagenesUrls: string[];

  @Prop({ required: true })
  createdAt: Date;
}

export const DenunciaSchema = SchemaFactory.createForClass(Denuncia);
