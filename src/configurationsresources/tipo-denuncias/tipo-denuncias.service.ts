import { Injectable } from '@nestjs/common';
import { CreateTipoDenunciaDto } from './dto/create-tipo-denuncia.dto';

@Injectable()
export class TipoDenunciasService {
  create(createTipoDenunciaDto: CreateTipoDenunciaDto) {
    return 'This action adds a new tipoDenuncia';
    //
    // throw new Error();
  }

  findAll() {
    return `This action returns all tipoDenuncias`;
  }
}
