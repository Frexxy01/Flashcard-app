import { Component, OnInit } from '@angular/core';
import { learningCard } from '../adminpage/admin';
import { Observable, Subscription } from 'rxjs';
import { StudcardApiService } from '../services/studcard-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-learningpage',
  standalone: true,
  imports: [CommonModule, MatButtonModule,],
  templateUrl: './learningpage.component.html',
  animations: [
    trigger('cardChangeAnimation', [
      state('forward', style({ transform: 'translateX(0)' })),
      state('backward', style({ transform: 'translateX(0)' })),
      transition('* => forward', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition('* => backward', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
    ]),
  ],
  styleUrl: './learningpage.component.scss'
})
export class LearningpageComponent implements OnInit {

  currectTitle: string = '';
  currentCardIndex: number = 0; 
  learningCards: learningCard[] = []
  subscription !: Subscription 
  categories = [
    {value: 'ruhazat', viewValue: 'Ruházat'},
    {value: 'etel', viewValue: 'Étel'},
    {value: 'haztartas', viewValue: 'Háztartás'}
  ]
  animationState: 'forward' | 'backward' | null = null;

  private $getAllCards: Observable<learningCard[]>;

  constructor(
    private cardSevice: StudcardApiService,
    private router: Router, 
    private activatedRoute: ActivatedRoute) {
    this.$getAllCards = this.cardSevice.$getCards
  }

  ngOnInit(): void {
    this.subscription = this.$getAllCards.subscribe((cards: learningCard[]) => {
      const category = this.activatedRoute.snapshot.paramMap.get('category')
      this.learningCards = cards.filter((card) => {
      
       if (card.category === category) {
         return card
       }
       return null
       })
  
       const matchingCategory = this.categories.find(cat => cat.value === category);
      if (matchingCategory) {
        this.currectTitle = matchingCategory.viewValue;
      }
     })
  }

  redirectTo(url: string) {
    this.router.navigate([url])
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  goForward() {
    this.animationState = 'forward';
    this.currentCardIndex++;
  }
  goBackward() {
    this.animationState = 'backward'
    this.currentCardIndex--;
  }

  resetAnimationState() {
    this.animationState = null;
  }
}
