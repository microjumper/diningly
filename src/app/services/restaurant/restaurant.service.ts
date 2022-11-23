import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import { Observable } from 'rxjs';

import { Restaurant } from '../../models/restaurant.model';

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

  updateRestaurant(restaurant: Restaurant): Promise<void> {
    return this.restaurantsCollection.doc(restaurant.id).update(restaurant);
  }
}
