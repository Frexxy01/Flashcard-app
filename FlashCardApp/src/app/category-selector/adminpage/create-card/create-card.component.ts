import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { learningCard } from '../admin';
import { StudcardApiService } from '../../services/studcard-api.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-create-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule,  MatButtonModule, MatIconModule, MatSelectModule],
  templateUrl: './create-card.component.html',
  styleUrl: './create-card.component.scss'
})
export class CreateCardComponent implements OnInit, OnDestroy{

  @Output() cardsUpdated = new EventEmitter<learningCard[]>()
  subscription !: Subscription;
  createCardForm !: FormGroup
  categories = [
    {value: 'ruhazat', viewValue: 'Ruházat'},
    {value: 'etel', viewValue: 'Étel'},
    {value: 'haztartas', viewValue: 'Háztartás'}
  ]

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cardService: StudcardApiService
  ) {
  }

  ngOnInit(): void {
    this.createCardForm = this.fb.group({
      magyar : ['', [Validators.required]],
      nemet : ['', [Validators.required]],
      category: ['', [Validators.required]]
    })
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  trackByCategory(index: number, category: any): string {
    return category.value; 
  }

  securityCheckPOST() {
      if (this.createCardForm.invalid) {
        alert('Minden mező kötelező')
        return;
      }
    
    this.pushtoBackend(this.createCardForm.value).subscribe({
      next: (updatedCards: learningCard[]) => {
        this.cardsUpdated.emit(updatedCards);
        this.createCardForm.reset();
      },
      error: err => {
        alert('Hiba! Kérlek próbáld újra.');
        console.error('Error:', err);
      }
    })
   }

  pushtoBackend(newCard: learningCard) {
    return this.cardService.createNewCardService(newCard)
  }
}
