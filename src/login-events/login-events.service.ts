import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRegisterDto } from './dto/register-login-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class LoginEventsService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(userRegisterDto: UserRegisterDto) {
    const createdUser = new this.userModel(userRegisterDto);
    const userSaved = await createdUser.save();

    return userSaved;
  }

  async login(loginUserDto: LoginUserDto) {
    let responseLogin: any;

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
}
