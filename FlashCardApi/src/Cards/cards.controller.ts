import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateStudyCardDto } from './dto/create-card.dto';

import { studyCard } from 'src/cards';

@Controller('/cards')
export class CardController {
  constructor(private readonly cardService: CardsService) {}

  @Post()
  create(@Body() CreateStudyCardDto: CreateStudyCardDto) {
    return this.cardService.create(CreateStudyCardDto);
  }

  @Get()
  findAll() {
    return this.cardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() argumentCard: studyCard) {
    return this.cardService.update(argumentCard);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardService.remove(id);
  }
}
