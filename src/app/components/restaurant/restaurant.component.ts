import { Component, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { forkJoin, Subscription } from 'rxjs';

import { Restaurant, Timeslot } from '../../models/restaurant.model';

import { ReservationService } from '../../services/reservation/reservation.service';
import { AuthService } from '../../services/auth/auth.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss'],
})
export class RestaurantComponent implements OnDestroy {
  @Input() restaurant: Restaurant;

  timeslot = Timeslot;

  reservationForm: FormGroup;

  private subscription: Subscription;

  constructor(private reservationService: ReservationService, private restaurantService: RestaurantService, private authService: AuthService) {
    this.reservationForm = new FormGroup({
      timeslotControl: new FormControl('', Validators.required),
      peopleControl: new FormControl('')
    });

    this.subscription = this.reservationForm.controls.timeslotControl.valueChanges.subscribe(
      value => {
        const availability = this.restaurant.availability[value];
        const peopleControl = this.reservationForm.controls.peopleControl;
        peopleControl.setValidators([Validators.required, Validators.min(1), Validators.max(availability)]);
        peopleControl.enable();
      }
    );

    this.reservationForm.controls.peopleControl.disable();
  }

  onSubmit(): void {
    const reservation = {
      restaurantRef: this.restaurant.id,
      user: this.authService.getAuthenticatedUser(),
      timeslot: this.reservationForm.value.timeslotControl,
      people: this.reservationForm.value.peopleControl
    };

    if(this.restaurant.availability[reservation.timeslot] >= reservation.people) {
      this.reservationService.book(reservation).then();
      const newAvailability = this.restaurant.availability[reservation.timeslot] - reservation.people;
      this.restaurantService.updateAvailability(this.restaurant.id, reservation.timeslot, newAvailability).then();
    } else {
      console.log('Numero di posti disponibili insufficiente a soddisfare la richiesta');
    }
  }

  cancelReservation(): void {

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
