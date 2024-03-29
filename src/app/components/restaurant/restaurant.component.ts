import { Component, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AlertController } from '@ionic/angular';

import { Subscription } from 'rxjs';

import { ReservationService } from '../../services/reservation/reservation.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';

import { Restaurant, Timeslot } from '../../models/restaurant.model';

import { TimeslotPipe } from '../../pipes/timeslot.pipe';

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

  constructor(private reservationService: ReservationService, private restaurantService: RestaurantService,
              private alertController: AlertController, private timeslotPipe: TimeslotPipe) {
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

  checkForReservation(): void {
    this.reservationService.checkForReservation(this.restaurant.id, this.reservationForm.value.timeslotControl).subscribe(
      async reservation => {
        if (reservation) {
          const time = this.timeslotPipe.transform(this.reservationForm.value.timeslotControl);
          const alert = await this.alertController.create({
            header: 'Attenzione',
            subHeader: `Hai già una prenotazione per le ${time}`,
            message: 'Annullare la precedente se desideri effettuarne una nuova',
            buttons: [{ text: 'OK', role: 'cancel' }],
          });
          await alert.present();
        } else {
          await this.presentConfirmationAlert();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private async presentConfirmationAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Prenotazione',
      message: 'Vuoi procedere con la prenotazione?',
      buttons: [
        { text: 'ANNULLA', role: 'cancel' },
        { text: 'OK', role: 'confirm', handler: () => this.book() },
      ],
    });
    await alert.present();
  }

  private book(): void {
    const people = this.reservationForm.value.peopleControl;
    const timeslot = this.reservationForm.value.timeslotControl;

    console.log('%cbooking', 'color: gray');
    this.reservationService.book(this.restaurant.id, this.restaurant.name, people, timeslot)
      .then(() => {
        console.log('%cbooked', 'color: green');
        console.log('%cupdating availability', 'color: gray');
        const newAvailability = this.restaurant.availability[timeslot] - people;
        this.restaurantService.updateAvailability(this.restaurant.id, timeslot, newAvailability)
          .then(() => console.log('%cavailability updated', 'color: green'));
      });
  }
}
