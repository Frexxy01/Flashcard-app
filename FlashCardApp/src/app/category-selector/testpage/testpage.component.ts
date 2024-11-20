import { Component, Inject, inject, OnDestroy, OnInit, Renderer2,} from '@angular/core';
import { StudcardApiService } from '../services/studcard-api.service';
import { CommonModule } from '@angular/common';
import { learningCard } from '../adminpage/admin';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ProvideCardsService } from '../services/provide-cards.service';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { RedirectService } from '../../utils/redirect.service';

@Component({
  selector: 'app-testpage',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './testpage.component.html',
  styleUrl: './testpage.component.scss',
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestpageComponent implements OnInit, OnDestroy {

  isThisFirstInitialization: boolean = false
  testCards!: any[]
  random_indexes: number[] = []
  isFlipped = false;
  dropZoneCorrect: any[] = []
  dropZoneIncorrect: any[] = []

  private $getAllcards : Observable<learningCard[]>
  private subscription !: Subscription


  constructor(
    private cardService: StudcardApiService, 
    private renderer: Renderer2, 
    private router: Router, 
    private testCardService: ProvideCardsService, 
    private activatedRoute : ActivatedRoute,
    private redirectService: RedirectService
  ){
    this.$getAllcards = this.cardService.$getCards
  }

  ngOnInit(): void {

    //With this code the cards do not change on page reload.
    this.subscription = this.$getAllcards.subscribe((cards: learningCard[]) => {
      if (!this.isSessionAvailable) {
        return
      }
      
      const initializedBefore = sessionStorage.getItem('componentInitialized');

      if (initializedBefore == 'true') {
        this.isThisFirstInitialization = false;
        //If we generated random cards before.
        this.initializeFromSession()
      } else {
          this.initializeNewCards(cards)
        }
    })
  }

  private isSessionAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.sessionStorage;
  }
  private initializeFromSession(): void {
    const storedCardData = sessionStorage.getItem('cardData');
        
    if (storedCardData) {
      this.testCards = JSON.parse(storedCardData);
    } else {
      // Fallback or error handling if no data is found in sessionStorage
      this.testCards = [];
    }
  }
  private initializeNewCards(cards: learningCard[]) {
    // Filter through the cards based on the category (param inside URL)
    const category = this.activatedRoute.snapshot.paramMap.get('category')
    this.testCards = cards.filter((card) => card.category === category).map((card) => ({
      ...card,
      flipped: false, // Set default flipped value to false
      isDragging: false, // Add the properties for the Dragging
      startX: 0, 
      startY: 0, 
      offsetX: 0, 
      offsetY: 0,
      ended: false,
      dropped: false
    }));

    this.isThisFirstInitialization = true;
    sessionStorage.setItem('componentInitialized', 'true');
    // store in sessionstorage
    sessionStorage.setItem('cardData', JSON.stringify(this.testCardService.generateRandomTestcards(this.testCards.length, 10, this.testCards)))
    // check sessionStorage (go around possible null err)
    this.initializeFromSession()
  }

  ngOnDestroy(): void {
      //With this code the cards do not change on page reload.
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem('componentInitialized');
    }
  }
  
  redirectTo(url: string) {
    this.redirectService.redirectTo(url)
  }

  // New approach click toggles the card on/off
  flipCard(card: any, event: MouseEvent) {

      if (!card.flipped) {
        card.flipped = true;
        return;
      }
      // If we're already dragging, don't start a new drag
      if (card.isDragging) {
        return;
      }

      if (card.ended) {
        if (card.dragHandler) {
          document.removeEventListener('mousemove', card.dragHandler);
        }
        if (card.dragEndHandler) {
          document.removeEventListener('mouseup', card.dragEndHandler);
        }
        card.ended = false
        return
      }

      card.isDragging = true;
      this.onDragStart(event, card);
      
      // Store the bound event handlers so we can remove them later
      card.dragHandler = (e: MouseEvent) => this.onDrag(e, card);
      card.dragEndHandler = (e: MouseEvent) => {
        this.onDragEnd(e, card);
        // Remove the event listeners using the stored handlers
        document.removeEventListener('mousemove', card.dragHandler);
        document.removeEventListener('mouseup', card.dragEndHandler);
      };
  
      document.addEventListener('mousemove', card.dragHandler);
      document.addEventListener('mouseup', card.dragEndHandler);
    }
    
  onDragStart(event: MouseEvent, card: any) {
    const cardElement = this.getCardContainer(card.id);

    if (cardElement && card.isDragging) {
      card.startX = event.clientX  - card.offsetX;
      card.startY = event.clientY  - card.offsetY;
    }
  }
    
  onDrag(event: MouseEvent, card: any) {
    if (card.isDragging) {
      event.preventDefault();
      
      card.offsetX = event.clientX - card.startX;
      card.offsetY = event.clientY - card.startY;
  
      const cardElement = this.getCardContainer(card.id);
      if (cardElement) {
        this.renderer.setStyle(
          cardElement,
          'transform',
          `translate(${card.offsetX}px, ${card.offsetY}px)`
        );
      }
    }
  }

    
    
  onDragEnd(event: MouseEvent, card: any) {

    card.isDragging = false;
    card.ended = true
    
    // Drop Zone Logic:
    const cardElement = this.getCardContainer(card.id)

    if (cardElement) {
      const cardRectangle = cardElement.getBoundingClientRect()

      let dropZoneCorrect = document.querySelector('.js-drop-zone-correct')
      let dropZoneIncorrect = document.querySelector('.js-drop-zone-incorrect')

      if (dropZoneCorrect && this.isInDropZone(cardRectangle, dropZoneCorrect)) {
        this.handleDrop(card, this.dropZoneCorrect);
      } else if (dropZoneIncorrect && this.isInDropZone(cardRectangle, dropZoneIncorrect)) {
        this.handleDrop(card, this.dropZoneIncorrect);
      }
    }
  }

  private isInDropZone(cardRect: DOMRect, zone: Element): boolean {
    const zoneRect = zone.getBoundingClientRect();
    return (
      cardRect.left < zoneRect.right &&
      cardRect.right > zoneRect.left &&
      cardRect.top < zoneRect.bottom &&
      cardRect.bottom > zoneRect.top
    );
  }

  private handleDrop(card: any, dropZone: any[]) {
    card.dropped = true;
    dropZone.push(card);
    const allDropped = this.testCards.every((c) => c.dropped);
    if (allDropped) this.openDialog('0ms', '0ms');
  }

  getCardContainer(cardId: number): HTMLElement | null {
    return document.querySelector(`.card-container[data-id='${cardId}']`);
  }

  //Dialog Logic:
  dialog = inject(MatDialog);

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string) {
    this.dialog.open(DialogResultsDialog, {
      width: '450px',
      data: this.dropZoneIncorrect,
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}


//Dialog Component:

@Component({
  selector: 'dialog-results-dialog',
  templateUrl: 'dialog-results.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, CommonModule],
})
export class DialogResultsDialog {
  
  readonly dialogRef = inject(MatDialogRef<DialogResultsDialog>);

  constructor(
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any[]
  ) {
  }

  redirectTo(url: string) {
    this.router.navigate([url])
  }
}

