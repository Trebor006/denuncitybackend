import { Module } from '@nestjs/common';
import { FaceRecognitionService } from './face-recognition.service';
import { ConfigService } from '@nestjs/config';
import { BufferUtilService } from '../common/utils/buffer-util/buffer-util.service';

@Module({
  providers: [FaceRecognitionService, ConfigService, BufferUtilService],
})
export class FaceRecognitionModule {}
