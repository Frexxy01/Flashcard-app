import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { RedirectService } from '../utils/redirect.service';

@Component({
  selector: 'app-notfound',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.scss'
})
export class NotfoundComponent {

  constructor(private redirectService: RedirectService ) {}

  backToHome() {
    this.redirectService.redirectTo('homepage')
  }
}
