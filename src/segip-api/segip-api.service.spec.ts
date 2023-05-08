import { Test, TestingModule } from '@nestjs/testing';
import { SegipApiService } from './segip-api.service';

describe('SegipApiService', () => {
  let service: SegipApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SegipApiService],
    }).compile();

    service = module.get<SegipApiService>(SegipApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
