import { Test, TestingModule } from '@nestjs/testing';
import { LoginEventsService } from './login-events.service';

describe('LoginEventsService', () => {
  let service: LoginEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginEventsService],
    }).compile();

    service = module.get<LoginEventsService>(LoginEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
