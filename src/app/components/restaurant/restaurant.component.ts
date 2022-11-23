import { Component, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { Restaurant, Timeslot } from '../../models/restaurant.model';
import { ReservationService } from '../../services/reservation/reservation.service';

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

  constructor(private reservationService: ReservationService) {
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
      ref: this.restaurant.reservationsRef,
      timeslot: this.reservationForm.value.timeslotControl,
      user: 'test',
      people: this.reservationForm.value.peopleControl
    };

    this.reservationService.book(this.restaurant, reservation).then();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
