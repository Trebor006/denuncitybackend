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

  @Get('buscar')
  async buscar(@Query('id') id: string) {
    const tipoDenuncia = await this.tipoDenunciasService.buscar(id);

    return tipoDenuncia;
  }
}
