import { Module } from '@nestjs/common';
import { PasswordHistoryService } from './password-history.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PasswordHistory,
  PasswordHistorySchema,
} from '../schemas/password.history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PasswordHistory.name, schema: PasswordHistorySchema },
    ]),
  ],
  providers: [PasswordHistoryService],
})
export class PasswordHistoryModule {}
