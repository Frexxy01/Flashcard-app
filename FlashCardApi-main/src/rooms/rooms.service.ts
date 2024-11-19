import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';

import { Room } from './entities/room.entity';
import { v4 } from 'uuid';
import { studyCard } from 'src/cards';
import { studyCardsFALLBACK } from 'src/data/studyCardData';


@Injectable()
export class RoomsService {
  studyCards: studyCard[] = studyCardsFALLBACK
  create(CreateStudyCardDto: studyCard) {
    CreateStudyCardDto.id = v4();
    this.studyCards = [CreateStudyCardDto, ...this.studyCards];
    return this.studyCards; 
  }

  findAll() {
    return this.studyCards;
  }

  findOne(id: string) {
    return this.studyCards.find((card) => card.id === id);
  }

  update(argumentCard: studyCard): studyCard[] {
    this.studyCards = this.studyCards.map(studyCard => {
      if (studyCard.id == argumentCard.id) {
        return argumentCard;
      }
      return studyCard;
    });
    return this.studyCards
  }
  remove(id: string) {
    this.studyCards = this.studyCards.filter((card) => card.id !== id);
    return this.studyCards
  }
  }

  

