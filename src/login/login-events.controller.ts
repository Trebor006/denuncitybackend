import { Body, Controller, Post } from '@nestjs/common';
import { LoginEventsService } from './login-events.service';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { UserRegisterDto } from './dto/register-login-event.dto';
import { BaseRequest } from '../common/dto/base/base-request.dto';
import { LoginUserByTokenDto } from './dto/login-user-by-token.dto';
import { BaseResponse } from '../common/dto/base/base-response.dto';

@Controller('users')
export class LoginEventsController {
  constructor(private readonly loginEventsService: LoginEventsService) {}

  @Post('register')
  async register(@Body() request: BaseRequest) {
    let userRegisterDto: UserRegisterDto;
    let promise: any;

    userRegisterDto = request.data as UserRegisterDto;

    console.log('Register :: ', { userRegisterDto });

    await this.loginEventsService
      .register(userRegisterDto)
      .then(function (result) {
        promise = result;
      });

    return this.generateResponse(promise);
  }

  @Post('login')
  async login(@Body() request: BaseRequest) {
    let createLoginEventDto: LoginUsuarioDto;
    let promise: any;
    createLoginEventDto = request.data as LoginUsuarioDto;
    console.log('login :: ', { request });

    await this.loginEventsService
      .login(createLoginEventDto)
      .then(function (result) {
        promise = result;
      });
    return this.generateResponse(promise);
  }

  @Post('tokenlogin')
  async loginByToken(@Body() request: BaseRequest) {
    let loginUserByTokenDto: LoginUserByTokenDto;
    let promise: any;

    loginUserByTokenDto = request.data as LoginUserByTokenDto;
    console.log('login');

    await this.loginEventsService
      .loginByToken(loginUserByTokenDto)
      .then(function (result) {
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
