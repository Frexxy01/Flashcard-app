import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, User, UserCredential } from '@angular/fire/auth';
import { environment } from '../../environment/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor (private auth: Auth) { }
  
  //Google Login
  signInwithGoogle() {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(this.auth, provider)
  }

  signOut() {
    return this.auth.signOut()
  }

  async signUpwithEmail(email: string, password: string) {
      try {
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password)
        return userCredential
      } catch (err) {
        console.error("Error signing up:", err)
        return null
      }  
    }

  async signInWithEmail(email:string, password: string) {

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password)
      return userCredential
    } catch (err) {
      alert('Nem megfelelő felhasználónév/jelszó.')
      console.error("Error signing up:", err)
      return null
    }  
   } 
}
