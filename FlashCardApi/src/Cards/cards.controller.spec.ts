import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './cards.controller';
import { CardsService } from './cards.service';

describe('RoomsController', () => {
  let controller: CardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [CardsService],
    }).compile();

    controller = module.get<CardController>(CardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
