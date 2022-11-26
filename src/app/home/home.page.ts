import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { RestaurantService } from '../services/restaurant/restaurant.service';

import { Restaurant } from '../models/restaurant.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  restaurants: Restaurant[];

  private subscription: Subscription;

  constructor(private restaurantService: RestaurantService) { }

  ngOnInit() {
    this.subscription = this.restaurantService.getRestaurants().subscribe(
      restaurants => this.restaurants = restaurants
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
