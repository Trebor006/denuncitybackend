import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TipoDenunciasService } from './tipo-denuncias.service';
import { CreateTipoDenunciaDto } from './dto/create-tipo-denuncia.dto';

@Controller('tipo-denuncias')
export class TipoDenunciasController {
  constructor(private readonly tipoDenunciasService: TipoDenunciasService) {}

  @Post('registrar')
  crear(@Body() createTipoDenunciaDto: CreateTipoDenunciaDto) {
    return this.tipoDenunciasService.registrar(createTipoDenunciaDto);
  }

  @Get()
  obtenerRegistros() {
    return this.tipoDenunciasService.obtenerRegistros();
  }

  @Get('porDepartamento')
  buscarTipoDenuncias(@Query('departamento') departamento: string) {
    return this.tipoDenunciasService.obtenerRegistrosFiltrados(departamento);
  }

  @Get('buscar')
  async buscar(@Query('id') id: string) {
    const tipoDenuncia = await this.tipoDenunciasService.buscar(id);

    return tipoDenuncia;
  }
}
