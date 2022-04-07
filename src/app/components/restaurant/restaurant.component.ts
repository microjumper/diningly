import { Component, Input, OnInit } from '@angular/core';

import { Restaurant, TimeSlot } from '../../models/restaurant.model';
import { ReservationService } from '../../services/reservation/reservation.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss'],
})
export class RestaurantComponent implements OnInit {
  @Input() restaurant: Restaurant;

  availability: number;

  constructor(private reservationService: ReservationService) {
    this.availability = 0;
  }

  ngOnInit() {}

  checkAvailability(timeSlot: TimeSlot): any {
    console.log(timeSlot);
    this.reservationService.getReservation(this.restaurant.reservations).subscribe(
      reservations => {
        console.log(reservations);
        console.log(reservations.availability[timeSlot]);
        this.availability = reservations.availability[timeSlot];
      });
  }
}
