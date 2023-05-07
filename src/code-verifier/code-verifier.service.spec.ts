import { Test, TestingModule } from '@nestjs/testing';
import { CodeVerifierService } from './code-verifier.service';

describe('CodeVerifierService', () => {
  let service: CodeVerifierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodeVerifierService],
    }).compile();

    service = module.get<CodeVerifierService>(CodeVerifierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
