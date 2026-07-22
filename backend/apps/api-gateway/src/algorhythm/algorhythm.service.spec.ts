import { Test, TestingModule } from '@nestjs/testing';
import { AlgorhythmService } from './algorhythm.service';

describe('AlgorhythmService', () => {
  let service: AlgorhythmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlgorhythmService],
    }).compile();

    service = module.get<AlgorhythmService>(AlgorhythmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
