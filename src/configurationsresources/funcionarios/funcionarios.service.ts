import { Injectable } from '@nestjs/common';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';

@Injectable()
export class FuncionariosService {
  create(createFuncionarioDto: CreateFuncionarioDto) {
    return 'This action adds a new funcionario';
  }

  findAll() {
    return [{}];
  }
}
