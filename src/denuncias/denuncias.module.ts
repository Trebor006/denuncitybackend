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
import { Sanciones, SancionesSchema } from '../schemas/sancion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Denuncia.name, schema: DenunciaSchema },
      { name: Sanciones.name, schema: SancionesSchema },
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
  ],
})
export class DenunciasModule {}
