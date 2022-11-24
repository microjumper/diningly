import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';

import firebase from 'firebase/compat/app';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth, private router: Router) { }

  signInWithGoogle(): void {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(user => {
        console.log(user);
        this.router.navigate(['']);
      })
      .catch(err => console.log(`Error during login: ${err}`));
  }

  signOut(): void {
    this.auth.signOut()
      .then()
      .catch()
      .finally(() => this.router.navigate(['login']));
  }

  isAuthenticated(): Observable<boolean> {
    return this.auth.authState.pipe(
      switchMap(authState => authState ? of(true) : of(false))
    );
  }
}
