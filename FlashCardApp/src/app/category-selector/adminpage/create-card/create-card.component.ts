import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
export class CreateCardComponent {

  @Output() cardsUpdated = new EventEmitter<learningCard[]>()



  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cardService: StudcardApiService
  ) {
  }

  createCardForm !: FormGroup

  categories = [
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
      magyar : [''],
      nemet : [''],
      category: ['']
    })
  }

  securityCheckPOST() {
    const checks = Object.values(this.createCardForm.value)
    for (let i = 0; i < checks.length; i++) {
      if (checks[i] == '') {
        alert('Minden menő megadása kötelező')
        break
      }
    }
    

    this.pushtoBackend(this.createCardForm.value).subscribe((updatedCards: learningCard[]) => {
      this.cardsUpdated.emit(updatedCards)
      this.createCardForm.reset()
    })


   }

  pushtoBackend(newCard: learningCard) {
    return this.cardService.createNewCardService(newCard)
  }


}
