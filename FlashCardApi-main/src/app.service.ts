import { Injectable } from '@nestjs/common';
import { studyCard } from './cards';
import { studyCardsFALLBACK } from './data/studyCardData';



@Injectable()
export class AppService {
  getStudyCardList(): studyCard[] {
   return studyCardsFALLBACK
  }

  addStudyCard(rooms: studyCard): studyCard[] {
    return [
      ...this.getStudyCardList(),
      rooms,
    ];
  }

  deleteCards(id: string): studyCard[] {
    return this.getStudyCardList().filter(studycard => studycard.id !== id);
  }

  editCards(argumentCard: studyCard): studyCard[] {
    return this.getStudyCardList().map(studyCard => {
      if (studyCard.id == argumentCard.id) {
        return argumentCard;
      }
      return studyCard;
    });
  }
}