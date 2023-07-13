import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DenunciasService } from './denuncias.service';
import { CrearDenunciaRequestDto } from './dto/crear-denuncia.request.dto';
import { DenunciasValidatorService } from './denuncias.validator.service';
import { CancelarDenunciaRequestDto } from './dto/cancelar-denuncia.request.dto';
import { ActualizarEstadoDenunciaRequestDto } from './dto/actualizar-estado-denuncia.request.dto';
import { AgregarComentarioDenunciaRequestDto } from './dto/agregar-comentario-denuncia.request.dto';
import { ActualizarDepartamentoDenunciaRequestDto } from './dto/actualizar-departamento-denuncia.request.dto';

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

  @Get('listarall')
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

  @Get('busquedaPaginada')
  async busquedaPaginada(
    @Query('estado') estado: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('tipoDenuncia') tipoDenuncia: string,
    @Query('pagina') pagina: number,
    @Query('porPagina') porPagina: number,
    @Query('ordenadoPor') ordenadoPor: string,
    @Query('ordenadoDir') ordenadoDir: number,
    @Query('departamento') departamento: string,
  ) {
    console.log('estado : ' + estado);
    console.log('fechaInicio : ' + fechaInicio);
    console.log('fechaFin : ' + fechaFin);
    console.log('tipoDenuncia : ' + tipoDenuncia);
    console.log('pagina : ' + pagina);
    console.log('porPagina : ' + porPagina);
    console.log('ordenadoPor : ' + ordenadoPor);
    console.log('ordenadoDir : ' + ordenadoDir);
    console.log('departamento : ' + departamento);

    const result = await this.denunciasService.obtenerDenunciasPaginadas(
      estado,
      fechaInicio,
      fechaFin,
      tipoDenuncia,
      pagina,
      porPagina,
      ordenadoPor,
      ordenadoDir,
      departamento,
    );

    return result;
  }

  @Get('buscar')
  async buscar(@Query('id') id: string) {
    console.log('id : ' + id);

    const result = await this.denunciasService.buscar(id);

    return result;
  }

  @Get('listarportipo')
  async listarDenunciasPorGruposTipoDenuncia() {
    const result = await this.denunciasService.obtenerListaDenunciasPorTipo();

    return result;
  }

  @Post('cancelar')
  async cancelarDenuncia(
    @Body() cancelarDenunciaRequestDto: CancelarDenunciaRequestDto,
  ) {
    const result = await this.denunciasService.cancelar(
      cancelarDenunciaRequestDto,
    );

    return result;
  }

  @Post('actualizarEstado')
  async actualizarEstado(
    @Query('id') id: string,
    @Body()
    actualizarEstadoDenunciaRequestDto: ActualizarEstadoDenunciaRequestDto,
  ) {
    const result = await this.denunciasService.actualizarEstadoDenuncia(
      id,
      actualizarEstadoDenunciaRequestDto,
    );

    return result;
  }

  @Post('agregarComentario')
  async agregarComentario(
    @Query('id') id: string,
    @Body()
    agregarComentarioDenunciaRequestDto: AgregarComentarioDenunciaRequestDto,
  ) {
    const result = await this.denunciasService.agregarComentarioDenuncia(
      id,
      agregarComentarioDenunciaRequestDto,
    );

    return result;
  }

  @Post('actualizarDepartamento')
  async actualizarDepartamento(
    @Query('id') id: string,
    @Body()
    ActualizarDepartamentoDenunciaRequestDto: ActualizarDepartamentoDenunciaRequestDto,
  ) {
    const result = await this.denunciasService.actualizarDepartamentoDenuncia(
      id,
      ActualizarDepartamentoDenunciaRequestDto,
    );

    return result;
  }
}
