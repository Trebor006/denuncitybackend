import { Module } from '@nestjs/common';
import { SegipApiService } from './segip-api.service';
import { SegipApiController } from './segip-api.controller';
import {ConfigService} from "@nestjs/config";
import {FaceRecognitionService} from "../face-recognition/face-recognition.service";

@Module({
  controllers: [SegipApiController],
  providers: [SegipApiService, ConfigService, FaceRecognitionService],
})
export class SegipApiModule {}
