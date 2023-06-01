import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { RegistroUsuarioDto } from './dto/registro.usuario.dto';
import { BaseRequest } from '../common/dto/base/base-request.dto';
import { BaseResponse } from '../common/dto/base/base-response.dto';
import { VerificarLoginUsuarioDto } from './dto/verificar.login.usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar.usuario.dto';

@Controller('usuario')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('registrar')
  async registrar(@Body() registroUsuarioDto: RegistroUsuarioDto) {
    console.log('Registrar :: ', { ...registroUsuarioDto });

    const usuarioRegistrado = await this.loginService.registrar(
      registroUsuarioDto,
    );

    return usuarioRegistrado;
  }

  @Post('validar_validez_contrasena')
  async validarValidezContrasena(
    @Body() verificarLoginUsuarioDto: VerificarLoginUsuarioDto,
  ) {
    console.log('validarValidezContrasena :: ', {
      ...verificarLoginUsuarioDto,
    });

    const contrasenaValida = await this.loginService.validarValidezContrasena(
      verificarLoginUsuarioDto,
    );

    return contrasenaValida;
  }

  @Post('actualizar-usuario')
  async actualizarUsuario(@Body() actualizarUsuarioDto: ActualizarUsuarioDto) {
    console.log('actualizarUsuario :: ', { ...actualizarUsuarioDto });

    const usuarioActualizado = await this.loginService.actualizarUsuario(
      actualizarUsuarioDto,
    );

    return usuarioActualizado;
  }

  @Post('login')
  async login(@Body() loginUsuarioDto: LoginUsuarioDto) {
    let promise: any;
    console.log('login :: ', { loginUsuarioDto });

    await this.loginService.login(loginUsuarioDto).then(function (result) {
      promise = result;
    });
    return this.generateResponse(promise);
  }

  private generateResponse(promise: any) {
    let baseResponse = new BaseResponse();
    baseResponse.statusCode = 0;
    baseResponse.data = promise;
    baseResponse.message = 'OK';

    return baseResponse;
  }
}
