import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RedirectService } from '../utils/redirect.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, MatInputModule,  MatButtonModule, MatIconModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerForm !: FormGroup
  hide = signal(true);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService : AuthService,
    private redirectService: RedirectService
  ) {}
  
 
  ngOnInit(): void {
    this.registerForm = this.fb.group({
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

  async registerUser() {
    const email = this.registerForm.get('email')?.value
    const password = this.registerForm.get('password')?.value
    if (email == ''  ||  password == '') {
      alert('Mindem mező megadása kötelező')
    }
    await this.authService.signUpwithEmail(email,password)
    this.registerForm.reset()
    this.redirectService.redirectTo('homepage')
  }
}
