import { Module } from '@nestjs/common';
import { LoginEventsService } from './login-events.service';
import { LoginEventsController } from './login-events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [LoginEventsController],
  providers: [LoginEventsService],
})
export class LoginEventsModule {}
