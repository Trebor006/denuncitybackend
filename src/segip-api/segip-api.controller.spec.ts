import { Test, TestingModule } from '@nestjs/testing';
import { SegipApiController } from './segip-api.controller';
import { SegipApiService } from './segip-api.service';

describe('SegipApiController', () => {
  let controller: SegipApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SegipApiController],
      providers: [SegipApiService],
    }).compile();

    controller = module.get<SegipApiController>(SegipApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
