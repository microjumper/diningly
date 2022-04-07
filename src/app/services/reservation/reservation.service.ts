import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly reservationsCollection: AngularFirestoreCollection<any>;

  constructor(private firestore: AngularFirestore) {
    this.reservationsCollection = firestore.collection<any>('reservations');
  }

  getReservation(id: string): Observable<any> {
    return this.reservationsCollection.doc(id).valueChanges();
  }
}
