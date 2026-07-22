import { Test, TestingModule } from '@nestjs/testing';
import { AlgorhythmController } from './algorhythm.controller';

describe('AlgorhythmController', () => {
  let controller: AlgorhythmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlgorhythmController],
    }).compile();

    controller = module.get<AlgorhythmController>(AlgorhythmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
