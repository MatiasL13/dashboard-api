import { Test, TestingModule } from '@nestjs/testing';
import { RatesController } from './rates.controller';

describe('Rates Controller', () => {
  let controller: RatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatesController],
    }).compile();

    controller = module.get<RatesController>(RatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
