import { Module } from '@nestjs/common';
import { FuncionariosService } from './funcionarios.service';
import { FuncionariosController } from './funcionarios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Departamento,
  DepartamentoSchema,
} from '../../schemas/departamento.schema';
import {
  Funcionario,
  FuncionarioSchema,
} from '../../schemas/funcionario.schema';
import { DepartamentosService } from '../departamentos/departamentos.service';
import { HashCodeService } from '../../common/utils/hash-code/hash-code.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Funcionario.name, schema: FuncionarioSchema },
      { name: Departamento.name, schema: DepartamentoSchema },
    ]),
  ],
  controllers: [FuncionariosController],
  providers: [FuncionariosService, HashCodeService, DepartamentosService],
})
export class FuncionariosModule {}
