import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { ReservationService } from '../../services/reservation/reservation.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';

import { Restaurant, Timeslot } from '../../models/restaurant.model';
import { Reservation, UserReservation } from '../../models/reservation.model';

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

  constructor(private reservationService: ReservationService, private restaurantService: RestaurantService) {
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
    const people = this.reservationForm.value.peopleControl;
    const timeslot = this.reservationForm.value.timeslotControl;

    if(this.restaurant.availability[timeslot] >= people) {
      this.reservationService.book(this.restaurant.id, people, timeslot).then();
      const newAvailability = this.restaurant.availability[timeslot] - people;
      this.restaurantService.updateAvailability(this.restaurant.id, timeslot, newAvailability).then();
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
    this.subscriptions.push(this.reservationService.getReservationsByRestaurant(this.restaurant.id)
      .subscribe(reservations => {
        this.reservations = reservations;
        this.reservations.forEach(r => this.reservationService.addToUserReservations(this.toUserReservation(r)));
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private toUserReservation(reservation: Reservation): UserReservation {
    return {
      restaurantId: this.restaurant.id,
      restaurantName: this.restaurant.name,
      reservationId: reservation.id,
      people: reservation.people,
      timeslot: reservation.timeslot
    };
  }
}
