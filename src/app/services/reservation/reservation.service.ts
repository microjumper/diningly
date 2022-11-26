import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import { Observable } from 'rxjs';

import { Reservation } from '../../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly reservationsCollection: AngularFirestoreCollection<any>;

  constructor(private firestore: AngularFirestore) {
    this.reservationsCollection = firestore.collection<any>('reservations');
  }

  book(reservation: Reservation): Promise<any> {
    return this.reservationsCollection.doc(reservation.restaurantRef).collection('reservations').add(reservation);
  }

  cancelReservation(restaurantId: string, reservationId: string): Promise<void> {
    return this.reservationsCollection.doc(restaurantId).collection('reservations').doc(reservationId).delete();
  }

  getReservationsByUser(email: string, restaurantId: string): Observable<any[]> {
    return this.reservationsCollection.doc(restaurantId).collection('reservations',
      ref => ref.where('user.email', '==', email)).valueChanges({idField: 'id'});
  }
}
