import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanMatch, GuardResult, MaybeAsync, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, Observable, take } from 'rxjs';
import { environment } from '../../environment/environment';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanMatch {

  constructor(private authService: AuthService, private router: Router, private auth: Auth) {}

  canMatch(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.auth.onAuthStateChanged((user) => {
        if (user?.uid == environment.adminUUID) {
          observer.next(true);
        } else {
          this.router.navigate(['homepage']);
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
