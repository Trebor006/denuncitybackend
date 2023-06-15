import { Injectable } from '@nestjs/common';
import { RegistroConfiguracionValidacionContrasenaDto } from './dto/RegistroConfiguracionValidacionContrasena.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Configuraciones } from '../schemas/configuracion.schema';
import { ConfiguracionDto } from './dto/Configuracion.dto';

@Injectable()
export class ConfigurationsService {
  constructor(
    @InjectModel(Configuraciones.name)
    private configurationModel: Model<Configuraciones>,
  ) {}

  async registrarConfiguracion(
    createConfigurationDto: RegistroConfiguracionValidacionContrasenaDto,
  ) {
    let configuracionDto: ConfiguracionDto = new ConfiguracionDto();
    configuracionDto.nombre = 'validar_duracion_contrasena';
    configuracionDto.configuracion = createConfigurationDto;

    await this.configurationModel
      .deleteMany({
        nombre: configuracionDto.nombre,
      })
      .exec();

    const model = new this.configurationModel(configuracionDto);
    const configuracionAlmacenada = await model.save();

    return configuracionAlmacenada;
  }

  async obtenerConfiguracionValidarContrasena() {
    const configuracionAlmacenada = await this.configurationModel
      .findOne({
        nombre: 'validar_duracion_contrasena',
      })
      .exec();

    const configuracion =
      configuracionAlmacenada.configuracion as RegistroConfiguracionValidacionContrasenaDto;

    return configuracion;
  }
}
