import { Module } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { DepartamentosController } from './departamentos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Departamento,
  DepartamentoSchema,
} from '../../schemas/departamento.schema';
import { HashCodeService } from '../../common/utils/hash-code/hash-code.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Departamento.name, schema: DepartamentoSchema },
    ]),
  ],
  controllers: [DepartamentosController],
  providers: [DepartamentosService, HashCodeService],
})
export class DepartamentosModule {}
