import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DropboxClientService } from './dropbox-client.service';
import { BufferUtilService } from '../../common/utils/buffer-util/buffer-util.service';
import { HashCodeService } from '../../common/utils/hash-code/hash-code.service';

@Module({
  providers: [
    DropboxClientService,
    ConfigService,
    BufferUtilService,
    HashCodeService,
  ],
})
export class DropboxApiModule {}
