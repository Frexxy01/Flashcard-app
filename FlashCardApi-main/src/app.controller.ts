import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { studyCard } from './cards';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() :  studyCard[] {
    return this.appService.getStudyCardList();
  }

  @Post()
  addRooms(@Body() argCard: studyCard): studyCard[] {
    return this.appService.addStudyCard(argCard);
  }

  @Put()
  editRooms(argCard: studyCard): studyCard[] {
    return this.appService.editCards(argCard);
  }

  @Delete()
  deleteRooms(argCard: studyCard): studyCard[] { 
    return this.appService.deleteCards(argCard.id);
  }

}
