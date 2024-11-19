import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, GuardResult, MaybeAsync, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { from, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanMatch {

  constructor(private auth: Auth, private router: Router) {

  }

  userLoggedIn = false

  canMatch(): Observable<boolean> {

    if(this.userLoggedIn){
      return from(
        new Promise<boolean>((resolve)=>{
          resolve(true)
        })
      )
    }
      
    // Wrap the onAuthStateChange in an observable
    return from(
      new Promise<boolean>((resolve) => {
        this.auth.onAuthStateChanged((user) => {
          if (user) {
            resolve(true)
          } else {
            this.router.navigate(['/login'])
            resolve(false)
          }
        })
      })
    )
  }
}
