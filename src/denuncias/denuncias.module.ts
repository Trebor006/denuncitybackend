import { Module } from '@nestjs/common';
import { DenunciasService } from './denuncias.service';
import { DenunciasController } from './denuncias.controller';
import { OpenaiService } from '../components/openai/openai.service';
import { DropboxClientService } from '../components/dropbox-client/dropbox-client.service';
import { ClarifaiService } from '../components/clarifai/clarifai.service';
import { ConfigService } from '@nestjs/config';
import { PromptsService } from './prompts.service';
import { DenunciasValidatorService } from './denuncias.validator.service';
import { BufferUtilService } from '../common/utils/buffer-util/buffer-util.service';
import { HashCodeService } from '../common/utils/hash-code/hash-code.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Denuncia, DenunciaSchema } from '../schemas/denuncia.schema';
import { TipoDenunciasService } from '../configurationsresources/tipo-denuncias/tipo-denuncias.service';
import {
  TipoDenuncias,
  TipoDenunciasSchema,
} from '../schemas/tipo-denuncia.schema';
import {
  Departamento,
  DepartamentoSchema,
} from '../schemas/departamento.schema';
import { DepartamentosService } from '../configurationsresources/departamentos/departamentos.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Denuncia.name, schema: DenunciaSchema },
      { name: TipoDenuncias.name, schema: TipoDenunciasSchema },
      { name: Departamento.name, schema: DepartamentoSchema },
    ]),
  ],
  controllers: [DenunciasController],
  providers: [
    DenunciasService,
    DenunciasValidatorService,
    PromptsService,
    OpenaiService,
    DropboxClientService,
    ClarifaiService,
    ConfigService,
    BufferUtilService,
    HashCodeService,
    TipoDenunciasService,
    DepartamentosService,
    NotificacionesService,
  ],
})
export class DenunciasModule {}
