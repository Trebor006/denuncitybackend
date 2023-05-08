import { Test, TestingModule } from '@nestjs/testing';
import { PasswordHistoryService } from './password-history.service';

describe('PasswordHistoryService', () => {
  let service: PasswordHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordHistoryService],
    }).compile();

    service = module.get<PasswordHistoryService>(PasswordHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
