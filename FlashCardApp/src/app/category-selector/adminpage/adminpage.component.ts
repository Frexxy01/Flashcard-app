import { Component, ElementRef, OnDestroy, signal, ViewChild } from '@angular/core';
import { learningCard } from './admin';
import {MatTableModule} from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button';
import { StudcardApiService } from '../services/studcard-api.service';
import { map, Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterOutlet } from '@angular/router';
import { CreateCardComponent } from './create-card/create-card.component';
import { EditCardComponent } from './edit-card/edit-card.component';

@Component({
  selector: 'app-adminpage',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, CommonModule,RouterOutlet,CreateCardComponent, EditCardComponent],
  templateUrl: './adminpage.component.html',
  styleUrl: './adminpage.component.scss'
})
export class AdminpageComponent implements OnDestroy{

  hide = signal(false)
  hideEdit = signal(false)
  selectedCard: any = null;
  tableData: learningCard[] = []
  displayedColumns: string[] = ['id', 'magyar', 'nemet', 'category', 'operation', 'edit']

  private subscriptions: Subscription[] = []
  private $getAllCards: Observable<learningCard[]>;

  constructor(
    private cardService: StudcardApiService, 
    private router: Router,
   ) {
    this.$getAllCards = this.cardService.$getCards
    this.loadCards()
  }

  private loadCards(): void {
    const sub = this.cardService.$getCards.subscribe(cards => {
      this.tableData = cards;
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleAdd() {
    this.hide.set(!this.hide());
  }
  
  toggleEdit(element: learningCard) {
    this.selectedCard = element
    this.hideEdit.set(!this.hideEdit())
  }

  toggleEditOff() {
    this.hideEdit = signal(false)
  }
  
  redirectTo(url:string) {
    return this.router.navigate([url])
  }

  deleteOneCardComponent(id: number) {
    const sub = this.cardService.deleteOneCardService(id).subscribe(updatedCards => {
      this.tableData = updatedCards;
    });
    this.subscriptions.push(sub);
  }
  
  createNewCardComponent(learningCard: learningCard) {
    const sub = this.cardService.createNewCardService(learningCard).subscribe(updatedCards => {
      this.tableData = updatedCards;
    });
    this.subscriptions.push(sub);
  }

  handleCardsUpdated(): void {
    // After receiving the updated cards, make a GET request to refresh the list
    const sub = this.$getAllCards.subscribe((cards: learningCard[]) => {
      this.tableData = cards
    })
    this.hideEdit = signal(false)
    this.subscriptions.push(sub);
  }
}

  

