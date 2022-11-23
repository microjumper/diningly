import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { Reservation, Restaurant, Timeslot } from '../../models/restaurant.model';
import { RestaurantService } from '../restaurant/restaurant.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly reservationsCollection: AngularFirestoreCollection<any>;

  constructor(private firestore: AngularFirestore, private restaurantService: RestaurantService) {
    this.reservationsCollection = firestore.collection<any>('reservations');
  }

  getReservations(ref: string): Observable<any> {
    return this.reservationsCollection.doc(ref).valueChanges();
  }

  async book(restaurant: Restaurant, reservation: Reservation): Promise<any> {
    // { early: [], ordinary: [], late: []}
    const timeslots = await this.getReservations(reservation.ref).pipe(take(1)).toPromise();
    const reservations: any[] = timeslots[reservation.timeslot];

    const item = {
      user: 'test3',
      people: reservation.people
    };

    const userIndex = reservations.findIndex(r => r.user === item.user);
    if (userIndex >= 0)
    {
      restaurant.availability[reservation.timeslot] += reservations[userIndex].people;
      reservations[userIndex] = item;
    }
    else {
      reservations.push(item);
    }

    restaurant.availability[reservation.timeslot] -= item.people;

    return Promise.all([
      this.reservationsCollection.doc(reservation.ref).update(timeslots),
      this.restaurantService.updateRestaurant(restaurant)
    ]);
  }
}
