import { Component, OnDestroy, signal } from '@angular/core';
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

  toggleAdd() {
    this.hide.set(!this.hide());
  }
  toggleEdit(element: learningCard) {
    this.selectedCard = element
    this.hideEdit.set(!this.hideEdit())
  }

  $getAllCards: Observable<learningCard[]>;

  tableData: learningCard[] = []

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'operation', 'edit']

  subscription !: Subscription

  constructor(private cardSevice: StudcardApiService, private router: Router) {
    this.$getAllCards = this.cardSevice.$getCards.pipe(
      //map((cards)=> this.tableData)
    )
    this.subscription = this.$getAllCards.subscribe((cards: learningCard[]) => {
      this.tableData = cards
      console.log(this.tableData)
    })

  }

  deleteOneCardComponent(id: number) {
    this.subscription = this.cardSevice.deleteOneCardService(id).subscribe((updatedCards: learningCard[]) => {
      this.tableData = updatedCards
      console.log(this.tableData)
    })
  }
  
  createNewCardComponent(learningCard: learningCard) {

    this.subscription = this.cardSevice.createNewCardService(learningCard).subscribe((updatedCards: learningCard[]) => {
      this.tableData = updatedCards
      console.log(this.tableData)
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  handleCardsUpdated(): void {
    // After receiving the updated cards, make a GET request to refresh the list
    console.log('Logging from parent!')
    this.subscription = this.$getAllCards.subscribe((cards: learningCard[]) => {
      this.tableData = cards
      console.log(this.tableData)
    })
    this.hideEdit = signal(false)
  }
  toggleEditOff() {
    this.hideEdit = signal(false)
  }
  redirectTo(url:string) {
    return this.router.navigate([url])
  }

  }

  

