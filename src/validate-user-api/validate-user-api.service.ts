import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ValidationRequest } from './dto/validation-request.dto';
import { PersonDto } from './dto/person.dto';
import { SegipResponseDto } from './dto/segip-response.dto';
import { FaceRecognitionService } from '../face-recognition/face-recognition.service';
import { UserDto } from '../common/dto/user.dto';

@Injectable()
export class ValidateUserApiService {
  constructor(
    private configService: ConfigService,
    private faceRecognitionService: FaceRecognitionService,
  ) {}

  async obtenerRegistroDeSegip(ci: string) {
    const SEGIP_URL = this.configService.get<string>('SEGIP_URL');
    const SEGIP_TOKEN = this.configService.get<string>('SEGIP_TOKEN');
    let personResult: PersonDto = null;

    const url = SEGIP_URL + 'persons/' + ci;
    await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${SEGIP_TOKEN}`,
        },
      })
      .then(function (response) {
        const segipResponseDto: SegipResponseDto =
          response.data as SegipResponseDto;
        const person: PersonDto = segipResponseDto.data as PersonDto;

        personResult = person;
      })
      .catch(function (error) {})
      .finally(function () {});

    return personResult;
  }

  async validar(validationRequest: ValidationRequest): Promise<UserDto> {
    const person = await this.obtenerRegistroDeSegip(validationRequest.ci);

    console.log(
      'person :: name:' +
        person.name +
        'lastName ' +
        person.lastname +
        'identification' +
        person.identification,
    );

    const validUser =
      await this.faceRecognitionService.validarUsuarioBiometricamente(
        person.photo,
        validationRequest.photo,
      );

    if (!validUser) {
      return null;
    }

    const userDto: UserDto = {
      nombre: person.name,
      apellido: person.lastname,
      direccion: person.address,
      telefono: person.phone,
      carnet: person.identification,
      fechaNacimiento: person.dateOfBirth,
    };

    return userDto;
  }
}
