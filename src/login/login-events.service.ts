import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { UserRegisterDto } from './dto/register-login-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { usuario } from '../schemas/usuario.schema';
import { Model } from 'mongoose';
import { LoginUserByTokenDto } from './dto/login-user-by-token.dto';
import { TokenBase, TokenGenerator } from 'ts-token-generator';
import * as CryptoJS from 'crypto-js';
import { MailService } from '../mail/mail.service';
import { GeneradorCodigoService } from '../generador-codigo/generador-codigo.service';
import { PasswordHistoryService } from '../password-history/password-history.service';

@Injectable()
export class LoginEventsService {
  constructor(
    @InjectModel(usuario.name) private userModel: Model<usuario>,
    private readonly codeVerifierService: GeneradorCodigoService,
    private readonly passwordHistoryService: PasswordHistoryService,
  ) {}

  async register(userRegisterDto: UserRegisterDto) {
    let responseUser: usuario;
    const newPassword = this.encrypt(userRegisterDto.password);
    const verification = await this.passwordHistoryService.verifyNewPassword(
      userRegisterDto.mail,
      newPassword,
    );

    if (!verification) {
      //todo retornar excepcion
      console.log('Excepcion por la contraseña!!');
      throw new Error('Excepcion por la contraseña!!');
    }

    userRegisterDto.password = newPassword;
    userRegisterDto.token = this.generateToken();
    const createdUser = new this.userModel(userRegisterDto);
    await createdUser.save().then(function (result) {
      responseUser = result;
    });

    this.passwordHistoryService.registerNewHistory(
      responseUser.mail,
      newPassword,
    );


    return responseUser;
  }

  async login(loginUserDto: LoginUsuarioDto) {
    let responseLogin: usuario;

    const user = await this.userModel
      .findOne({
        mail: loginUserDto.correo,
        password: this.encrypt(loginUserDto.contrasena),
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

  async loginByToken(loginUserByTokenDto: LoginUserByTokenDto) {
    let responseLogin: usuario;

    await this.userModel
      .findOne({
        token: loginUserByTokenDto.token,
      })
      .exec()
      .then(function (result) {
        console.log(result);

        if (result == null) {
          throw new NotFoundException('Usuario no encontrado');
        }

        responseLogin = result;
      });

    return responseLogin;
  }

  private generateToken() {
    const tokgen = new TokenGenerator({
      bitSize: 512,
      baseEncoding: TokenBase.BASE62,
    });
    return tokgen.generate();
  }

  private encrypt(password: string) {
    return CryptoJS.SHA256(password).toString();
  }
}
