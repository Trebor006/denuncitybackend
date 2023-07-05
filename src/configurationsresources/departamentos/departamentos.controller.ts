import { Body, Controller, Get, Post } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { CrearDepartamentoDto } from './dto/crear-departamento.dto';

@Controller('departamentos')
export class DepartamentosController {
  constructor(private readonly departmentsService: DepartamentosService) {}

  @Post('registrar')
  async crear(@Body() crearDepartamentoDto: CrearDepartamentoDto) {
    const departamento = await this.departmentsService.registrar(
      crearDepartamentoDto,
    );

    return departamento;
  }

  @Get()
  async obtenerRegistros() {
    const departamentos = await this.departmentsService.obtenerRegistros();

    return departamentos;
  }
}
