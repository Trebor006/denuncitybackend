import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { RegistroUsuarioDto } from './dto/registro.usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from '../schemas/usuario.schema';
import { Model } from 'mongoose';
import * as CryptoJS from 'crypto-js';
import { GeneradorCodigoService } from '../generador-codigo/generador-codigo.service';
import { HistorialContrasenaService } from '../historial-contrasena/historial-contrasena.service';
import { VerificarLoginUsuarioDto } from './dto/verificar.login.usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar.usuario.dto';
import { ConfigurationsService } from '../configurations/configurations.service';
import { RegistarTokenDto } from './dto/registar-token.dto';
import { TokenDispositivo } from '../schemas/tokenDispositivo.schema';
import { TokenDispositivoDto } from '../common/dto/token-dispositivo-dto';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { Notificaciones } from '../schemas/notificaciones.schema';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(Usuario.name) private userModel: Model<Usuario>,
    @InjectModel(TokenDispositivo.name)
    private tokenDispositivoModel: Model<TokenDispositivo>,
    @InjectModel(Notificaciones.name)
    private notificacionesModel: Model<Notificaciones>,
    private readonly codeVerifierService: GeneradorCodigoService,
    private readonly passwordHistoryService: HistorialContrasenaService,
    private readonly configurationsService: ConfigurationsService,
  ) {}

  async registrar(registroUsuarioDto: RegistroUsuarioDto) {
    let usuarioAlmacenado: Usuario;
    const nuevaContrasena = this.encrypt(registroUsuarioDto.contrasena);

    registroUsuarioDto.contrasena = nuevaContrasena;
    const model = new this.userModel(registroUsuarioDto);
    await model.save().then(function (result) {
      usuarioAlmacenado = result;
    });

    this.passwordHistoryService.registrarNuevoHistorial(
      usuarioAlmacenado.correo,
      nuevaContrasena,
    );

    return usuarioAlmacenado;
  }

  async login(loginUserDto: LoginUsuarioDto) {
    let responseLogin: Usuario;

    const user = await this.userModel
      .findOne({
        correo: loginUserDto.correo,
        contrasena: this.encrypt(loginUserDto.contrasena),
      })
      .exec();
    // .then(function (result) {
    //   console.log(result);
    //
    //   if (result == null) {
    //     throw new NotFoundException('Usuario no encontrado');
    //   }

    //   responseLogin = result;
    // });

    if (user == null) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async validarValidezContrasena(
    verificarLoginUsuarioDto: VerificarLoginUsuarioDto,
  ) {
    //todo getConfiguration
    const configuracionValidacionContrasenaDto =
      await this.configurationsService.obtenerConfiguracionValidarContrasena();

    const fechaUltimaActualizacion =
      await this.passwordHistoryService.obtenerFechaDeUltimaActualizacion(
        verificarLoginUsuarioDto.correo,
      );

    const renovar = this.difiereTiempoMaximo(
      fechaUltimaActualizacion,
      configuracionValidacionContrasenaDto.limite,
      configuracionValidacionContrasenaDto.medida,
    );

    return renovar;
  }

  difiereTiempoMaximo(
    fechaUltimaActualizacion: Date,
    tiempoMaximo: number,
    unidadTiempo: string,
  ): boolean {
    const fechaActual = new Date();

    // Obtener la fecha límite basada en el tiempo máximo y la unidad de tiempo
    let fechaLimite: Date;
    if (unidadTiempo === 'semanas') {
      fechaLimite = new Date(
        fechaActual.getTime() - tiempoMaximo * 7 * 24 * 60 * 60 * 1000,
      );
    } else if (unidadTiempo === 'días') {
      fechaLimite = new Date(
        fechaActual.getTime() - tiempoMaximo * 24 * 60 * 60 * 1000,
      );
    } else if (unidadTiempo === 'horas') {
      fechaLimite = new Date(
        fechaActual.getTime() - tiempoMaximo * 60 * 60 * 1000,
      );
    } else if (unidadTiempo === 'minutos') {
      fechaLimite = new Date(fechaActual.getTime() - tiempoMaximo * 60 * 1000);
    } else {
      throw new Error('Unidad de tiempo no válida');
    }

    console.log('fecha Limite : ' + fechaLimite);
    console.log('fecha fechaUltimaActualizacion : ' + fechaUltimaActualizacion);

    // Comparar las fechas
    return fechaUltimaActualizacion.getTime() < fechaLimite.getTime();
  }

  async actualizarUsuario(verificarLoginUsuarioDto: ActualizarUsuarioDto) {
    const nuevaContrasena = this.encrypt(verificarLoginUsuarioDto.contrasena);

    const contrasenaValida = await this.validarContrasena(
      verificarLoginUsuarioDto.correo,
      nuevaContrasena,
    );
    if (!contrasenaValida) {
      throw new Error();
    }

    this.passwordHistoryService.registrarNuevoHistorial(
      verificarLoginUsuarioDto.correo,
      nuevaContrasena,
    );

    return contrasenaValida;
  }

  private encrypt(password: string) {
    return CryptoJS.SHA256(password).toString();
  }

  private async validarContrasena(correo: string, nuevaContrasena: string) {
    const contrasenaValida =
      await this.passwordHistoryService.verificarNuevaContrasena(
        correo,
        nuevaContrasena,
      );

    if (!contrasenaValida) {
      //todo retornar excepcion
      console.log('Excepcion por la contraseña!!');
      throw new Error('Excepcion por la contraseña!!');
    }

    return contrasenaValida;
  }

  async registrarToken(registarTokenDto: RegistarTokenDto) {
    let tokenDispositivoDto = new TokenDispositivoDto();
    tokenDispositivoDto.tokenDevice = registarTokenDto.token;
    tokenDispositivoDto.usuario = registarTokenDto.correo;
    tokenDispositivoDto.createdAt = new Date();

    const savedTokenDispotivo = new this.tokenDispositivoModel(
      tokenDispositivoDto,
    );

    savedTokenDispotivo.save();

    return savedTokenDispotivo;
  }

  async listarNotificaciones(correo: string) {
    const notificaciones = await this.notificacionesModel.find({
      usuario: correo,
    });

    return notificaciones;
  }
}
