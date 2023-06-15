import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DenunciasService } from './denuncias.service';
import { CrearDenunciaRequestDto } from './dto/crear-denuncia.request.dto';
import { DenunciasValidatorService } from './denuncias.validator.service';
import { CancelarDenunciaRequestDto } from './dto/cancelar-denuncia.request.dto';

@Controller('denuncias')
export class DenunciasController {
  constructor(
    private readonly denunciasService: DenunciasService,
    private readonly denunciasValidatorService: DenunciasValidatorService,
  ) {}

  convertirCadenaAArray(cadena: string): string[] {
    return JSON.parse(cadena.replace(/\\/g, ''));
  }

  @Post()
  async crear(@Body() crearDenunciaDto: CrearDenunciaRequestDto) {
    crearDenunciaDto.imagenesList = this.convertirCadenaAArray(
      crearDenunciaDto.imagenes,
    );

    // const resultValidation =
    //   this.denunciasValidatorService.validarDTO(crearDenunciaDto);
    // if (resultValidation.length > 0) {
    //   return BaseResponse.generateError(
    //     'Error al registrar la denuncia, Datos Incorrectos',
    //     resultValidation,
    //   );
    // }

    const result = await this.denunciasService.crear(crearDenunciaDto);

    return result;
  }

  @Get()
  async listarDenunciasPorUsuario(@Query('usuario') usuario: string) {
    const result = await this.denunciasService.obtenerListaDenuncias(usuario);

    return result;
  }

  @Get('/listarall')
  async listarAllDenuncias(
    @Query('estado') estado: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('tipoDenuncia') tipoDenuncia: string,
  ) {
    console.log('estado : ' + estado);
    console.log('fechaInicio : ' + fechaInicio);
    console.log('fechaFin : ' + fechaFin);
    console.log('tipoDenuncia : ' + tipoDenuncia);

    const result = await this.denunciasService.obtenerAllDenuncias(
      estado,
      fechaInicio,
      fechaFin,
      tipoDenuncia,
    );

    return result;
  }

  @Get('/listarportipo')
  async listarDenunciasPorGruposTipoDenuncia() {
    const result = await this.denunciasService.obtenerListaDenunciasPorTipo();

    return result;
  }

  @Post('/cancelar')
  async cancelarDenuncia(
    @Body() cancelarDenunciaRequestDto: CancelarDenunciaRequestDto,
  ) {
    const result = await this.denunciasService.cancelar(
      cancelarDenunciaRequestDto,
    );

    return result;
  }
}
