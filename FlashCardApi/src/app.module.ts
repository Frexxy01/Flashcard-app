import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardModule } from './Cards/cards.module';

@Module({
  imports: [CardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
