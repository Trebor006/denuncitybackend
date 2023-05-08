import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ValidationRequest } from './dto/validation-request.dto';
import { PersonDto } from './dto/person.dto';
import { SegipResponseDto } from './dto/segip-response.dto';
import { FaceRecognitionService } from '../face-recognition/face-recognition.service';

// import { Buffer } from 'buffer';

@Injectable()
export class SegipApiService {
  constructor(
    private configService: ConfigService,
    private faceRecognitionService: FaceRecognitionService,
  ) {}

  async getPerson(ci: string) {
    const SEGIP_URL = this.configService.get<string>('SEGIP_URL');
    const SEGIP_TOKEN = this.configService.get<string>('SEGIP_TOKEN');
    let personResult = null;

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

  async validate(validationRequest: ValidationRequest): Promise<boolean> {
    const person = await this.getPerson(validationRequest.ci);
    const person2 = await this.getPerson(validationRequest.ci2);
    if (person == null) {
      return false;
    }

    const validUser = await this.faceRecognitionService.validateUser(
      person.photo,
      person2.photo,
      // validationRequest.photo,
    );

    return validUser;
  }
}
