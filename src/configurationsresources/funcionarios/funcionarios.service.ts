import { Injectable } from '@nestjs/common';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashCodeService } from '../../common/utils/hash-code/hash-code.service';
import { DepartamentosService } from '../departamentos/departamentos.service';
import { Funcionario } from '../../schemas/funcionario.schema';
import { LoginFuncionarioDto } from './dto/login-funcionario.dto';

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

  async login(loginFuncionarioDto: LoginFuncionarioDto) {
    const funcionario = await this.funcionarioModel
      .findOne({
        correo: loginFuncionarioDto.correo,
        ci: loginFuncionarioDto.contrasena,
      })
      .exec();

    if (funcionario != null) {
      const departamentos = await this.departamentosService.obtenerRegistros();
      const departamento = departamentos.find(
        (departamento) => departamento.id === funcionario.departamento,
      );

      return {
        success: true,
        data: {
          id: funcionario.id,
          apellido: funcionario.apellido,
          celular: funcionario.celular,
          ci: funcionario.ci,
          correo: funcionario.correo,
          nombre: funcionario.nombre,
          departamento: funcionario.departamento,
          createdAt: funcionario.createdAt,
          nombreDepartamento: departamento.nombre,
        },
      };
    } else {
      return {
        success: false,
      };
    }
  }
}
