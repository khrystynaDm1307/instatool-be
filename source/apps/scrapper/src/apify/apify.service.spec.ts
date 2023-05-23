import { Test, TestingModule } from '@nestjs/testing';
import { ApifyService } from './apify.service';

describe('ApifyService', () => {
  let service: ApifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApifyService],
    }).compile();

    service = module.get<ApifyService>(ApifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
