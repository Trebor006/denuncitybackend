import { Module } from '@nestjs/common';
import { LoginEventsService } from './login-events.service';
import { LoginEventsController } from './login-events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { MailingService } from '../mailing/mailing.service';
import { CodeVerifierService } from '../code-verifier/code-verifier.service';
import { CodeVerifierModule } from '../code-verifier/code-verifier.module';
import {
  MailVerifier,
  MailVerifierSchema,
} from '../schemas/mail.verifier.schema';
import { PasswordHistoryService } from '../password-history/password-history.service';
import {
  PasswordHistory,
  PasswordHistorySchema,
} from '../schemas/password.history.schema';

@Module({
  imports: [
    CodeVerifierModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: MailVerifier.name, schema: MailVerifierSchema },
      { name: PasswordHistory.name, schema: PasswordHistorySchema },
    ]),
  ],
  controllers: [LoginEventsController],
  providers: [
    LoginEventsService,
    MailingService,
    CodeVerifierService,
    PasswordHistoryService,
  ],
})
export class LoginEventsModule {}
