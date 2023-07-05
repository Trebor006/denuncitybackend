import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TipoDenunciasService } from './tipo-denuncias.service';
import { CreateTipoDenunciaDto } from './dto/create-tipo-denuncia.dto';

@Controller('tipo-denuncias')
export class TipoDenunciasController {
  constructor(private readonly tipoDenunciasService: TipoDenunciasService) {}

  @Post('registrar')
  create(@Body() createTipoDenunciaDto: CreateTipoDenunciaDto) {
    return this.tipoDenunciasService.create(createTipoDenunciaDto);
  }

  @Get()
  findAll() {
    return [
      {
        id: '',
        nombre: 'string',
        descripcion: 'string;',
        color: '#000000',
        departamento: 'string;',
      },
    ];
  }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tipoDenunciasService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTipoDenunciaDto: UpdateTipoDenunciaDto) {
  //   return this.tipoDenunciasService.update(+id, updateTipoDenunciaDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tipoDenunciasService.remove(+id);
  // }
}
