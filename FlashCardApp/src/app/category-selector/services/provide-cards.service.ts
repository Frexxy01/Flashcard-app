import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StudcardApiService } from './studcard-api.service';
import { Observable, Subscription } from 'rxjs';
import { learningCard } from '../adminpage/admin';

@Injectable({
  providedIn: 'root'
})
export class ProvideCardsService {

  constructor(private router: Router){
  
  }

  generateRandomTestcards(max: number, limit: number, array: learningCard[]): learningCard[] {
    if (max < limit) {
      console.error("The limit has to be higher than the max!")
      return []
    }
    const uniqueNumbers = new Set<number>

    while (uniqueNumbers.size < limit) {
      const randomNum = Math.floor(Math.random() * max)
      uniqueNumbers.add(randomNum)
    }
    const randomIndexes = Array.from(uniqueNumbers)

    let returnarray = []

    for (let number of randomIndexes) {
      returnarray.push(array[number])
    }
    return returnarray
  }
  


}
