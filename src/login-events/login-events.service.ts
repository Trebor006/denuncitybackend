import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRegisterDto } from './dto/register-login-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { LoginUserByTokenDto } from './dto/login-user-by-token.dto';
import { TokenBase, TokenGenerator } from 'ts-token-generator';

@Injectable()
export class LoginEventsService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(userRegisterDto: UserRegisterDto) {
    let responseUser: User;

    userRegisterDto.token = this.generateToken();
    const createdUser = new this.userModel(userRegisterDto);
    await createdUser.save().then(function (result) {
      responseUser = result;
    });

    return responseUser;
  }

  async login(loginUserDto: LoginUserDto) {
    let responseLogin: User;

    await this.userModel
      .findOne({
        username: loginUserDto.username,
        password: loginUserDto.password,
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

  async loginByToken(loginUserByTokenDto: LoginUserByTokenDto) {
    let responseLogin: User;

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
}
