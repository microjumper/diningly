import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { Restaurant, Timeslot } from '../../models/restaurant.model';

import { ReservationService } from '../../services/reservation/reservation.service';
import { AuthService } from '../../services/auth/auth.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { Reservation } from '../../models/reservation.model';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss'],
})
export class RestaurantComponent implements OnInit, OnDestroy {
  @Input() restaurant: Restaurant;

  timeslot = Timeslot;

  reservationForm: FormGroup;

  private subscriptions: Subscription[];
  private reservations: Reservation[];

  constructor(private reservationService: ReservationService, private restaurantService: RestaurantService, private authService: AuthService) {
    this.subscriptions = [];

    this.reservationForm = new FormGroup({
      timeslotControl: new FormControl('', Validators.required),
      peopleControl: new FormControl('')
    });

    this.subscriptions.push(this.reservationForm.controls.timeslotControl.valueChanges.subscribe(
      value => {
        const availability = this.restaurant.availability[value];
        const peopleControl = this.reservationForm.controls.peopleControl;
        peopleControl.setValidators([Validators.required, Validators.min(1), Validators.max(availability)]);
        peopleControl.enable();
      }
    ));

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
    const index = this.reservations.findIndex(r => r.timeslot === this.reservationForm.value.timeslotControl);

    if(index >= 0) {
      const newAvailability = this.restaurant.availability[this.reservations[index].timeslot] + this.reservations[index].people;
      this.restaurantService.updateAvailability(this.restaurant.id, this.reservations[index].timeslot, newAvailability).then();
      this.reservationService.cancelReservation(this.restaurant.id, this.reservations[index].id)
        .then()
        .catch();
    } else {
      console.log('Nessuna prenotazione da annullare');
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(this.reservationService.getReservationsByUser(this.authService.getAuthenticatedUser().email, this.restaurant.id).subscribe(reservations => this.reservations = reservations));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
