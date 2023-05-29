import { Injectable } from '@nestjs/common';

@Injectable()
export class BufferUtilService {
  parseBase64ToBuffer(base64String: string): Buffer {
    const binaryString = atob(base64String);
    const buffer = new ArrayBuffer(binaryString.length);
    const bufferView = new Uint8Array(buffer);

    for (let i = 0; i < binaryString.length; i++) {
      bufferView[i] = binaryString.charCodeAt(i);
    }

    return Buffer.from(buffer);
  }
}
