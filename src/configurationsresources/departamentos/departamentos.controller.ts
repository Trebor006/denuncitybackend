import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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

  @Get('buscar')
  async buscar(@Query('id') id: string) {
    const departamento = await this.departmentsService.buscar(id);

    return departamento;
  }
}
