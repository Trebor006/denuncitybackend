import { Injectable } from '@nestjs/common';
import { CrearDepartamentoDto } from './dto/crear-departamento.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Departamento } from '../../schemas/departamento.schema';
import { HashCodeService } from '../../common/utils/hash-code/hash-code.service';

@Injectable()
export class DepartamentosService {
  constructor(
    @InjectModel(Departamento.name)
    private departamentoModel: Model<Departamento>,
    private hashCodeService: HashCodeService,
  ) {}

  async registrar(crearDepartamento: CrearDepartamentoDto) {
    const departamento = await this.departamentoModel
      .findOne({
        nombre: crearDepartamento.nombre,
      })
      .exec();

    if (departamento != null) {
      throw new Error(
        'No se puede registrar debido a que ya existe un departamento con ese nombre',
      );
    }

    let crearDepartamentoDto = new CrearDepartamentoDto();
    crearDepartamentoDto.id =
      this.hashCodeService.generarHashCode(crearDepartamento);
    crearDepartamentoDto.nombre = crearDepartamento.nombre;
    crearDepartamentoDto.descripcion = crearDepartamento.descripcion;
    crearDepartamentoDto.createdAt = new Date();

    const departamentoRepository = new this.departamentoModel(
      crearDepartamentoDto,
    );
    const departamentoSaved = await departamentoRepository.save();

    return departamentoSaved;
  }

  async obtenerRegistros() {
    const departamentos = await this.departamentoModel.find().exec();

    return departamentos;
  }

  async buscar(id: string) {
    const departamentos = await this.departamentoModel
      .findOne({
        id: id,
      })
      .exec();

    return departamentos;
  }
}
