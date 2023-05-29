import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DropboxClientService } from './dropbox-client.service';

@Module({
  providers: [DropboxClientService, ConfigService],
})
export class DropboxApiModule {}
