import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  constructor(private router: Router) {}

  redirectTo(url: string) {
    this.router.navigate([url])
  }
}
