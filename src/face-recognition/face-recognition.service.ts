import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { BufferUtilService } from '../common/utils/buffer-util/buffer-util.service';

@Injectable()
export class FaceRecognitionService {
  constructor(
    private configService: ConfigService,
    private bufferUtilService: BufferUtilService,
  ) {}

  async validarUsuarioBiometricamente(
    photo1: string,
    photo2: string,
  ): Promise<boolean> {
    const BIOMETRIC_URL = this.configService.get<string>('BIOMETRIC_URL');
    const BIOMETRIC_TOKEN = this.configService.get<string>('BIOMETRIC_TOKEN');

    const url = BIOMETRIC_URL + 'compareFaces';
    const buffer1 = this.bufferUtilService.parseBase64ToBuffer(photo1);
    const buffer2 = this.bufferUtilService.parseBase64ToBuffer(photo2);
    let result: boolean = false;

    const formData = new FormData();
    formData.append('file1', buffer1, { filename: 'photo1.jpg' });
    formData.append('file2', buffer2, { filename: 'photo2.jpg' });

    await axios
      .post(url, formData, {
        headers: {
          Authorization: `Bearer ${BIOMETRIC_TOKEN}`,
          ...formData.getHeaders(),
        },
      })
      .then((response) => {
        if (response.data == 'SIMILARES') {
          result = true;
        }
        console.log(response.data);
      })
      .catch((error) => {
        result = false;
      });

    return result;
  }
}
