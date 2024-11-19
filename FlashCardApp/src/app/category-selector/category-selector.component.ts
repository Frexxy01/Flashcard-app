import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { learningCard } from './adminpage/admin';
import { StudcardApiService } from './services/studcard-api.service';

@Component({
  selector: 'app-category-selector',
  standalone: true,
  imports: [MatRippleModule, MatButtonModule],
  templateUrl: './category-selector.component.html',
  styleUrl: './category-selector.component.scss'
})
export class CategorySelectorComponent {
  centered = true;
  disabled = false;
  unbounded = false;

  radius: number = 150;
  color: string = 'ligthgray';

  constructor(private router: Router){

  }

  redirectTo(url: string) {
    this.router.navigate([url])
  }

}
