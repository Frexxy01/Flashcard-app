import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, MatInputModule,  MatButtonModule, MatIconModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService : AuthService
  ) {
  }
  signInForm !: FormGroup

  redirectTo(url: string) {
    this.router.navigate(['login'])
  }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  registerUser() {
    const email = this.signInForm.get('email')?.value
    const password = this.signInForm.get('password')?.value
    if (email == ''  ||  password == '') {
      alert('Mindem mező megadása kötelező')
    }
    const credentials = this.authService.signUpwithEmail(email,password)
    console.log(credentials)
    //console.log(this.authService)
  }

}
