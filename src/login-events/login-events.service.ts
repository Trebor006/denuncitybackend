import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRegisterDto } from './dto/register-login-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { LoginUserByTokenDto } from './dto/login-user-by-token.dto';
import { TokenBase, TokenGenerator } from 'ts-token-generator';
import * as CryptoJS from 'crypto-js';
import { MailingService } from '../mailing/mailing.service';
import { CodeVerifierService } from '../code-verifier/code-verifier.service';

@Injectable()
export class LoginEventsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailingService: MailingService,
    private readonly codeVerifierService: CodeVerifierService,
  ) {}

  async register(userRegisterDto: UserRegisterDto) {
    let responseUser: User;

    userRegisterDto.password = this.encrypt(userRegisterDto.password);
    userRegisterDto.token = this.generateToken();
    const createdUser = new this.userModel(userRegisterDto);
    await createdUser.save().then(function (result) {
      responseUser = result;
    });

    const code = await this.codeVerifierService.generateCode(
      userRegisterDto.mail,
    );

    this.mailingService.sendMail(responseUser.name, responseUser.mail, code);

    return responseUser;
  }

  async login(loginUserDto: LoginUserDto) {
    let responseLogin: User;

    const user = await this.userModel
      .findOne({
        username: loginUserDto.username,
        password: this.encrypt(loginUserDto.password),
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

  private encrypt(password: string) {
    return CryptoJS.SHA256(password).toString();
  }
}
