import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CanMatch, Router } from '@angular/router';
import { catchError, from, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanMatch {

  constructor(private auth: Auth, private router: Router) {}

  canMatch(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          observer.next(true);
        } else {
          this.router.navigate(['/login']);
          observer.next(false);
        }
      });
    }).pipe(
      catchError((error) => {
        console.error('Error checking auth state:', error);
        this.router.navigate(['/login']);
        return [false];
      })
    )
  }
}
