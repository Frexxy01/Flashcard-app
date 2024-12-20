import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from "@angular/material/input"
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RedirectService } from '../utils/redirect.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule,  MatButtonModule, MatIconModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm !: FormGroup
  hide = signal(true);
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private redirectService: RedirectService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }
 
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  
  redirectTo(url: string) {
    this.redirectService.redirectTo(url)
  }

  // Google Login
  loginWithGoogle() {
    this.authService.signInwithGoogle()
    .then((result) =>  this.redirectService.redirectTo('homepage'))
    .catch((err) => console.error('Error signing in', err))
  }

  logout() {
    this.authService.signOut()
    .then(() => console.log('User signed out'))
    .catch((err) => console.error('Error signing out:', err))
  }

  async loginWithEmail() {
    const email = this.loginForm.get('email')?.value
    const password = this.loginForm.get('password')?.value
    if (email == ''  ||  password == '') {
      alert('Mindem mező megadása kötelező')
      return;
    }
    const credentials = await this.authService.signInWithEmail(email,password)
    if (credentials) {
      this.redirectService.redirectTo('homepage');
    } else {
      this.loginForm.reset()
      return;
    }
  }
}
