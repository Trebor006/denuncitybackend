import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FaceRecognitionService {
  constructor(private configService: ConfigService) {}

  async validateUser(photo1: string, photo2: string): Promise<boolean> {
    const BIOMETRIC_URL = this.configService.get<string>('BIOMETRIC_URL');
    const BIOMETRIC_TOKEN = this.configService.get<string>('BIOMETRIC_TOKEN');

    const url = BIOMETRIC_URL + 'compareFaces';
    const buffer1 = this.parseBase64ToBuffer(photo1);
    const buffer2 = this.parseBase64ToBuffer(photo2);
    let result: boolean = false;
    console.log(buffer1);

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
        console.log(response);
      })
      .catch((error) => {
        result = false;
      });

    return result;
  }

  private parseBase64ToBuffer(base64String: string): Buffer {
    const binaryString = atob(base64String);
    const buffer = new ArrayBuffer(binaryString.length);
    const bufferView = new Uint8Array(buffer);

    for (let i = 0; i < binaryString.length; i++) {
      bufferView[i] = binaryString.charCodeAt(i);
    }

    return Buffer.from(buffer);
  }
}
