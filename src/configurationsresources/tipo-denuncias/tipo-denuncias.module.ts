import { Module } from '@nestjs/common';
import { TipoDenunciasService } from './tipo-denuncias.service';
import { TipoDenunciasController } from './tipo-denuncias.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HashCodeService } from '../../common/utils/hash-code/hash-code.service';
import {
  TipoDenuncias,
  TipoDenunciasSchema,
} from '../../schemas/tipo-denuncia.schema';
import { DepartamentosService } from '../departamentos/departamentos.service';
import {
  Departamento,
  DepartamentoSchema,
} from '../../schemas/departamento.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TipoDenuncias.name, schema: TipoDenunciasSchema },
      { name: Departamento.name, schema: DepartamentoSchema },
    ]),
  ],
  controllers: [TipoDenunciasController],
  providers: [TipoDenunciasService, DepartamentosService, HashCodeService],
})
export class TipoDenunciasModule {}
