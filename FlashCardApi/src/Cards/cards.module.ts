import { Module } from '@nestjs/common';
import { CardsService} from './cards.service';
import { CardController } from './cards.controller';

@Module({
  controllers: [CardController],
  providers: [CardsService]
})
export class CardModule {}
