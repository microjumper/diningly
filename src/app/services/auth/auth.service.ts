import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';

import firebase from 'firebase/compat/app';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<User>(null);

  constructor(private auth: AngularFireAuth, private router: Router) {
    this.auth.user.pipe(
      map(firebaseUser => ({ name: firebaseUser.displayName, email: firebaseUser.email }))
    ).subscribe(user => this.userSubject.next(user));
  }

  signInWithGoogle(): void {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => this.router.navigate([''],{ replaceUrl: true }))
      .catch(err => console.log(`Error during login: ${err}`));
  }

  signOut(): void {
    this.auth.signOut()
      .then()
      .catch()
      .finally(() => this.router.navigate(['login', { replaceUrl: true }]));
  }

  isAuthenticated(): Observable<boolean> {
    return this.auth.authState.pipe(
      switchMap(authState => authState ? of(true) : of(false))
    );
  }

  getAuthenticatedUser(): User {
    return this.userSubject.value;
  }
}
