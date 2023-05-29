import { Module } from '@nestjs/common';
import { ValidateUserApiService } from './validate-user-api.service';
import { ValidateUserApiController } from './validate-user-api.controller';
import { ConfigService } from '@nestjs/config';
import { FaceRecognitionService } from '../face-recognition/face-recognition.service';
import { BufferUtilService } from '../common/utils/buffer-util/buffer-util.service';

@Module({
  controllers: [ValidateUserApiController],
  providers: [
    ValidateUserApiService,
    ConfigService,
    FaceRecognitionService,
    BufferUtilService,
  ],
})
export class ValidateUserApiModule {}
