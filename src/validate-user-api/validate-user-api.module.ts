import { Module } from '@nestjs/common';
import { ValidateUserApiService } from './validate-user-api.service';
import { ValidateUserApiController } from './validate-user-api.controller';
import { ConfigService } from '@nestjs/config';
import { FaceRecognitionService } from '../face-recognition/face-recognition.service';

@Module({
  controllers: [ValidateUserApiController],
  providers: [ValidateUserApiService, ConfigService, FaceRecognitionService],
})
export class ValidateUserApiModule {}
