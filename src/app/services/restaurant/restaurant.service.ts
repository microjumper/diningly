import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import { Observable } from 'rxjs';

import { Restaurant, Timeslot } from '../../models/restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private readonly restaurantsCollection: AngularFirestoreCollection<Restaurant>;
  private readonly restaurants: Observable<Restaurant[]>;

  constructor(private firestore: AngularFirestore) {
    this.restaurantsCollection = firestore.collection<Restaurant>('restaurants');
    this.restaurants = this.restaurantsCollection.valueChanges({idField : 'id'});
  }

  getRestaurants(): Observable<Restaurant[]> {
    return this.restaurants;
  }

  updateAvailability(restaurantId: string, timeslot: Timeslot, newAvailability: number) {
    return this.restaurantsCollection.doc(restaurantId).update({[`availability.${timeslot}`]: newAvailability});
  }
}
