import { Injectable } from '@nestjs/common';
import { CreateTipoDenunciaDto } from './dto/create-tipo-denuncia.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashCodeService } from '../../common/utils/hash-code/hash-code.service';
import { TipoDenuncias } from '../../schemas/tipo-denuncia.schema';
import { TipoDenuncia } from '../../common/dto/tipo-denuncia';
import { DepartamentosService } from '../departamentos/departamentos.service';

@Injectable()
export class TipoDenunciasService {
  constructor(
    @InjectModel(TipoDenuncias.name)
    private tipoDenunciaModel: Model<TipoDenuncias>,
    private hashCodeService: HashCodeService,
    private departamentosService: DepartamentosService,
  ) {}

  async registrar(createTipoDenunciaDto: CreateTipoDenunciaDto) {
    const tipoDenuncia = await this.tipoDenunciaModel
      .findOne({
        nombre: createTipoDenunciaDto.nombre,
      })
      .exec();

    if (tipoDenuncia != null) {
      throw new Error(
        'No se puede registrar debido a que ya existe un tipoDenuncia con ese nombre',
      );
    }

    createTipoDenunciaDto.id = this.hashCodeService.generarHashCode(
      createTipoDenunciaDto,
    );
    createTipoDenunciaDto.createdAt = new Date();

    const tipoDenunciaRepository = new this.tipoDenunciaModel(
      createTipoDenunciaDto,
    );
    const tipoDenunciaSaved = await tipoDenunciaRepository.save();

    return tipoDenunciaSaved;
  }

  async obtenerRegistros() {
    let departamentos = await this.departamentosService.obtenerRegistros();

    const tipoDenuncias = await this.tipoDenunciaModel.find().exec();

    tipoDenuncias.forEach((tipoDenuncia) => {
      const departamento = departamentos.find(
        (departamento) => departamento.id === tipoDenuncia.departamento,
      );

      if (departamento) {
        // Realizar las operaciones que necesites con el departamento encontrado
        console.log(departamento);
        tipoDenuncia.departamento = departamento.nombre;
      }
    });

    return tipoDenuncias;
  }

  async mapToTipoDenuncia(): Promise<TipoDenuncia[]> {
    const denuncias = await this.obtenerRegistros();
    const tiposDenuncias = denuncias.map((denuncia) => ({
      tipo: denuncia.nombre,
      color: denuncia.color,
    }));

    return tiposDenuncias;
  }

  async buscar(id: string) {
    const tipoDenuncia = await this.tipoDenunciaModel
      .findOne({
        id: id,
      })
      .exec();

    return tipoDenuncia;
  }
}
