import { Module } from '@nestjs/common';
import { ClarifaiService } from './clarifai.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [ClarifaiService, ConfigService],
})
export class ClarifaiModule {}
