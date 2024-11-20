import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StudcardApiService } from '../../services/studcard-api.service';
import { learningCard } from '../admin';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule,  MatButtonModule, MatIconModule, MatSelectModule],
  templateUrl: './edit-card.component.html',
  styleUrl: './edit-card.component.scss'
})
export class EditCardComponent implements OnInit, OnDestroy {
  
  @Input() card !: learningCard;
  @Output() cardsUpdated = new EventEmitter<learningCard[]>()
  @Output() toggleEditCard = new EventEmitter()
  editCardForm !: FormGroup
  categories2 = [
    {value: 'ruhazat', viewValue: 'Ruházat'},
    {value: 'etel', viewValue: 'Étel'},
    {value: 'haztartas', viewValue: 'Háztartás'}
  ]

  private subscription !: Subscription;

 

  constructor(
    private fb: FormBuilder,
    private cardService: StudcardApiService
  ) {}

  ngOnInit(): void {
    this.editCardForm = this.fb.group({
      id: [this.card.id],
      magyar : [this.card.magyar, [Validators.required]],
      nemet : [this.card.nemet, [Validators.required]],
      category: [this.card.category, [Validators.required]]
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  trackByCategory(index: number, category: any): string {
    return category.value; // Using 'value' as the unique identifier
  }

  securityCheckPUT() {
    const checks = Object.values(this.editCardForm.value)
    for (let i = 0; i < checks.length; i++) {
      if (checks[i] == '') {
        alert('Minden menő megadása kötelező')
        break
      }
    }
    this.editCard(this.card.id, this.editCardForm.value).subscribe((updatedCards: learningCard[]) => {
      this.cardsUpdated.emit(updatedCards)
    })
   }

  editCard(id: string, newCard: learningCard) {
    return this.cardService.editCardService(id, newCard)
  }
  toggleOff() {
    this.toggleEditCard.emit()
  }
}
