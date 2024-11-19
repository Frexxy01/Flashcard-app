import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
export class EditCardComponent {
  
  @Input() card !: learningCard;

  @Output() cardsUpdated = new EventEmitter<learningCard[]>()

  @Output() toggleEditCard = new EventEmitter()

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cardService: StudcardApiService
  ) {
  }

  createCardForm !: FormGroup

  categories2 = [
    {
      value: 'ruhazat', viewValue: 'Ruházat'
    },
    {
      value: 'etel', viewValue: 'Étel'
    },
    {
      value: 'haztartas', viewValue: 'Háztartás'
    }
  ]

  subscription !: Subscription;

  trackByCategory(index: number, category: any): string {
    return category.value; // Using 'value' as the unique identifier
  }


  ngOnInit(): void {
    this.createCardForm = this.fb.group({
      id: [this.card.id],
      magyar : [this.card.magyar],
      nemet : [this.card.nemet],
      category: [this.card.category]
    })
  }

  securityCheckPUT() {
    const checks = Object.values(this.createCardForm.value)
    for (let i = 0; i < checks.length; i++) {
      if (checks[i] == '') {
        alert('Minden menő megadása kötelező')
        break
      }
    }
    
    console.log(this.createCardForm.value)
    this.editCard(this.card.id, this.createCardForm.value).subscribe((updatedCards: learningCard[]) => {
      console.log(updatedCards)
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
