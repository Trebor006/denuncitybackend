import { Module } from '@nestjs/common';
import { FaceRecognitionService } from './face-recognition.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [FaceRecognitionService, ConfigService],
})
export class FaceRecognitionModule {}
