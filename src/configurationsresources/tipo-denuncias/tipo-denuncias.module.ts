import { Module } from '@nestjs/common';
import { TipoDenunciasService } from './tipo-denuncias.service';
import { TipoDenunciasController } from './tipo-denuncias.controller';

@Module({
  controllers: [TipoDenunciasController],
  providers: [TipoDenunciasService]
})
export class TipoDenunciasModule {}
