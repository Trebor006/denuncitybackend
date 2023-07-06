import { Injectable } from '@nestjs/common';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashCodeService } from '../../common/utils/hash-code/hash-code.service';
import { DepartamentosService } from '../departamentos/departamentos.service';
import { Funcionario } from '../../schemas/funcionario.schema';

@Injectable()
export class FuncionariosService {
  constructor(
    @InjectModel(Funcionario.name)
    private funcionarioModel: Model<Funcionario>,
    private hashCodeService: HashCodeService,
    private departamentosService: DepartamentosService,
  ) {}

  async create(createFuncionarioDto: CreateFuncionarioDto) {
    const funcionario = await this.funcionarioModel
      .findOne({
        ci: createFuncionarioDto.ci,
      })
      .exec();

    if (funcionario != null) {
      throw new Error(
        'No se puede registrar debido a que ya existe un funcionario con ese ci',
      );
    }

    createFuncionarioDto.id =
      this.hashCodeService.generarHashCode(createFuncionarioDto);
    createFuncionarioDto.createdAt = new Date();

    const funcionarioRepository = new this.funcionarioModel(
      createFuncionarioDto,
    );
    const funcionarioSaved = await funcionarioRepository.save();

    return funcionarioSaved;
  }

  async findAll() {
    const funcionarios = await this.funcionarioModel.find().exec();

    return funcionarios;
  }

  async buscar(id: string) {
    const funcionario = await this.funcionarioModel
      .findOne({
        id: id,
      })
      .exec();

    return funcionario;
  }

  login(createFuncionarioDto: CreateFuncionarioDto) {
    return {
      success: true,
    };
  }
}
