import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
    return this.restaurants.pipe(
      tap(restaurants => console.log(restaurants))
    );
  }
}
