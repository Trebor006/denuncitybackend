import { Injectable } from '@nestjs/common';
import { SHA256 } from 'crypto-js';

@Injectable()
export class HashCodeService {
  generarHashCode(object: any) {
    return SHA256(JSON.stringify(object)).toString();
  }
}
