import { ChangeDetectionStrategy, Component, ElementRef, Inject, inject, Input, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
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


@Component({
  selector: 'app-testpage',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './testpage.component.html',
  styleUrl: './testpage.component.scss',
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestpageComponent implements OnInit, OnDestroy {

  constructor(
    private cardService: StudcardApiService, 
    private renderer: Renderer2, 
    private router: Router, 
    private testCardService: ProvideCardsService, 
    private activatedRoute : ActivatedRoute){
    this.$getAllcards = this.cardService.$getCards
  }

  isThisFirstInitialization: boolean = false

  $getAllcards : Observable<learningCard[]>

  subscription !: Subscription

  testCards!: any[]
  // We add properties after and the interface raises an error.

  random_indexes: number[] = []

  isFlipped = false;

  // flipCard(card: any ) {
  //   // I used any because we add the flipped property after.
  //   card.flipped = true
  // }

  redirectTo(url: string) {
    this.router.navigate([url])
  }



  ngOnInit(): void {

  
    //With this code the cards do not change on page reload.
  

    this.subscription = this.$getAllcards.subscribe((cards: learningCard[]) => {
      // We wait with the check until we get the response back.
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const initializedBefore = sessionStorage.getItem('componentInitialized');
  
        if (initializedBefore == 'true') {
          this.isThisFirstInitialization = false;
         
          const storedCardData = sessionStorage.getItem('cardData');
          if (storedCardData) {
            this.testCards = JSON.parse(storedCardData);
         
          } else {
            // Fallback or error handling if no data is found in sessionStorage
            this.testCards = [];
     
          }
        } else {
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
          const storedCardData = sessionStorage.getItem('cardData');
          if (storedCardData) {
            this.testCards = JSON.parse(storedCardData);

          } else {
            // Fallback or error handling if no data is found in sessionStorage
            this.testCards = [];
          }
      }}
    })
  }

  ngOnDestroy(): void {
      //With this code the cards do not change on page reload.
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem('componentInitialized');
    }
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
      // this.onDragStartDropZone(event, card); // Storing the card data.
      
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

    dropZoneCorrect: any[] = []
    dropZoneIncorrect: any[] = []
    
    onDragEnd(event: MouseEvent, card: any) {
      card.isDragging = false;

      card.ended = true
      
      console.log('OndragEND triggered! Data:', card.startX, card.startY, card.offsetX, card.offsetY)

      // Drop Zone Logic:

      const cardElement = this.getCardContainer(card.id)

      if (cardElement) {
        const cardRectangle = cardElement.getBoundingClientRect()

        let dropZone = document.querySelectorAll('.js-drop-zone-correct').forEach((zone) => {
          const zoneRect = zone.getBoundingClientRect()

          const isInDropZone =
          cardRectangle.left < zoneRect.right &&
          cardRectangle.right > zoneRect.left &&
          cardRectangle.top < zoneRect.bottom &&
          cardRectangle.bottom > zoneRect.top; 

          if (isInDropZone) {
            card.dropped = true
            this.dropZoneCorrect.push(card)
            this.renderer.addClass(cardElement, 'dropped')

            for (let i = 0; i < this.testCards.length; i++) {
              if (this.testCards[i].dropped == false) {
                return;
              }
            }
            console.log('All cards Dropped!')
            this.openDialog('0ms','0ms')
          }
        })

        let dropZones = document.querySelectorAll('.js-drop-zone-incorrect').forEach((zone) => {
          const zoneRect = zone.getBoundingClientRect()

          const isInDropZone =
          cardRectangle.left < zoneRect.right &&
          cardRectangle.right > zoneRect.left &&
          cardRectangle.top < zoneRect.bottom &&
          cardRectangle.bottom > zoneRect.top; 

          if (isInDropZone) {
            card.dropped = true
            this.dropZoneIncorrect.push(card)
            this.renderer.addClass(cardElement, 'dropped')

            // Check if all the cards have been dropped, if yes open the end dialog.
            for (let i = 0; i < this.testCards.length; i++) {
              if (this.testCards[i].dropped == false) {
                return;
              }
            }
            console.log('All cards Dropped!')
            this.openDialog('0ms','0ms')
          }
        })

      }
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

  constructor(
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any[]
  ) {
  }
  readonly dialogRef = inject(MatDialogRef<DialogResultsDialog>);

  redirectTo(url: string) {
    this.router.navigate([url])
  }
  
}

