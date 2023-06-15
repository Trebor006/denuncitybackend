import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsuarioDocument = HydratedDocument<Usuario>;

@Schema()
export class Usuario {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true })
  direccion: string;

  @Prop({ required: true })
  telefono: string;

  @Prop({ required: true })
  carnet: string;

  @Prop({ required: true })
  fechaNacimiento: string;

  @Prop({ required: true })
  correo: string;

  @Prop({ required: true })
  contrasena: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
