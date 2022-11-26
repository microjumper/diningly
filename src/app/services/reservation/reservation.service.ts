import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import { BehaviorSubject, Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';

import { Reservation, UserReservation } from '../../models/reservation.model';
import { Timeslot } from '../../models/restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly reservationsCollection: AngularFirestoreCollection<any>;

  private userReservations: UserReservation[] = [];
  private userReservationSubject = new BehaviorSubject<UserReservation[]>(this.userReservations);

  constructor(private firestore: AngularFirestore, private authService: AuthService) {
    this.reservationsCollection = firestore.collection<any>('reservations');
  }

  book(restaurantId: string, people: number, timeslot: Timeslot): Promise<any> {
    const reservation: Reservation = {
      restaurantRef: restaurantId,
      user: this.authService.getAuthenticatedUser(),
      people,
      timeslot
    };
    return this.reservationsCollection.doc(reservation.restaurantRef).collection('reservations').add(reservation);
  }

  cancelReservation(restaurantId: string, reservationId: string): Promise<void> {
    return this.reservationsCollection.doc(restaurantId).collection('reservations').doc(reservationId).delete();
  }

  getReservationsByRestaurant(restaurantId: string): Observable<any[]> {
    const user = this.authService.getAuthenticatedUser();
    return this.reservationsCollection.doc(restaurantId).collection('reservations',
      ref => ref.where('user.email', '==', user.email)).valueChanges({idField: 'id'});
  }

  addToUserReservations(userReservation: UserReservation) {
    this.userReservations.push(userReservation);
    this.userReservationSubject.next(this.userReservations);
  }

  getUserReservations(): Observable<UserReservation[]> {
    return this.userReservationSubject;
  }
}
