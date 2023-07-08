import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import { BehaviorSubject, Observable, zip } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

import { Reservation } from '../../models/reservation.model';
import { Timeslot } from '../../models/restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly reservationsCollection: AngularFirestoreCollection<any>;
  private readonly userReservations = new BehaviorSubject<Reservation[]>([]);

  constructor(private firestore: AngularFirestore, private authService: AuthService) {
    this.reservationsCollection = firestore.collection<any>('reservations');

    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.refreshUserReservations();
      }
    });
  }

  book(restaurantRef: string, restaurantName: string, people: number, timeslot: Timeslot): Promise<any> {
    const reservation: Reservation = {
      restaurantRef,
      restaurantName,
      user: this.authService.getAuthenticatedUser(),
      people,
      timeslot
    };
    return this.reservationsCollection.doc(reservation.restaurantRef).collection('reservations').add(reservation)
      .finally(() => this.refreshUserReservations());
  }

  cancelReservation(restaurantId: string, reservationId: string): Promise<void> {
    return this.reservationsCollection.doc(restaurantId).collection('reservations').doc(reservationId).delete().finally(() => this.refreshUserReservations());
  }

  getUserReservationsByRestaurant(restaurantId: string): Observable<Reservation[]> {
    return this.getUserReservations().pipe(
      map(reservations => reservations.filter(r => r.restaurantRef === restaurantId))
    );
  }

  getUserReservations(): Observable<Reservation[]> {
    return this.userReservations.asObservable();
  }

  checkForReservation(restaurantId: string, timeslot: Timeslot): Observable<Reservation> {
    return this.getUserReservationsByRestaurant(restaurantId).pipe(
      take(1),
      map(reservations => reservations.find(r => r.timeslot === timeslot))
    );
  }

  private fetchUserReservations(): Observable<Reservation[]> {
    return this.reservationsCollection.valueChanges({idField: 'restaurantRef'}).pipe(
      take(1),
      map(refs => refs.map(r => this.fetchReservationsByRestaurant(r.restaurantRef).pipe(take(1)))),
      switchMap(reservations => zip(...reservations)),
      map(reservations => [].concat(...reservations))
    );
  }

  private fetchReservationsByRestaurant(restaurantId: string): Observable<any[]> {
    const user = this.authService.getAuthenticatedUser();
    return this.reservationsCollection.doc(restaurantId).collection('reservations',
      ref => ref.where('user.email', '==', user.email)).valueChanges({idField: 'id'});
  }

  private refreshUserReservations(): void {
    this.fetchUserReservations().pipe(take(1)).subscribe(
      reservations => this.userReservations.next(reservations)
    );
  }
}
