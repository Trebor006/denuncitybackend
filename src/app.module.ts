import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RepositoryModule } from './repository/repository.module';
import { LoginEventsModule } from './login-events/login-events.module';

@Module({
  imports: [RepositoryModule, LoginEventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
