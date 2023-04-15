import { Test, TestingModule } from '@nestjs/testing';
import { LoginEventsController } from './login-events.controller';
import { LoginEventsService } from './login-events.service';

describe('LoginEventsController', () => {
  let controller: LoginEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginEventsController],
      providers: [LoginEventsService],
    }).compile();

    controller = module.get<LoginEventsController>(LoginEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
