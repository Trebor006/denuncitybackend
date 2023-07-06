import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FuncionariosService } from './funcionarios.service';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';

@Controller('funcionarios')
export class FuncionariosController {
  constructor(private readonly funcionariosService: FuncionariosService) {}

  @Post('registrar')
  create(@Body() createFuncionarioDto: CreateFuncionarioDto) {
    return this.funcionariosService.create(createFuncionarioDto);
  }

  @Get()
  findAll() {
    return this.funcionariosService.findAll();
  }

  @Get('buscar')
  buscar(@Query('id') id: string) {
    return this.funcionariosService.buscar(id);
  }

  @Post('login')
  login(@Body() createFuncionarioDto: CreateFuncionarioDto) {
    console.log('login funcionario!!!');
    return this.funcionariosService.login(createFuncionarioDto);
  }
}
