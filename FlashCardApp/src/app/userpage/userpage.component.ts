import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox'
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-userpage',
  standalone: true,
  imports:  [MatCheckboxModule, FormsModule, MatFormFieldModule, MatInputModule, MatRippleModule],
  templateUrl: './userpage.component.html',
  styleUrl: './userpage.component.scss'
})
export class UserpageComponent {
  centered = true;
  disabled = false;
  unbounded = false;

  radius: number = 150;
  color: string = 'ligthgray';

  constructor(private router: Router,
    private authService: AuthService
  ) {

  }

  navigateTo(url: string) {
    return this.router.navigate([url])
  }

  backToLogin() {
    this.authService.signOut()
    this.navigateTo('login')
  }
  redirectToCategory() {
    this.router.navigate(['categories'])
  }
  redirectToAdminpage() {
    this.router.navigate(['admin'])
  }
}
