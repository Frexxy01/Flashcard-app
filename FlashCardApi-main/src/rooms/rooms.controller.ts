import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, CreateStudyCardDto } from './dto/create-room.dto';

import { studyCard } from 'src/cards';

@Controller('/cards')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() CreateStudyCardDto: CreateStudyCardDto) {
    return this.roomsService.create(CreateStudyCardDto);
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() argumentCard: studyCard) {
    return this.roomsService.update(argumentCard);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }
}
