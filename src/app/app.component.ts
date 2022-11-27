import { Component } from '@angular/core';

import { MenuController } from '@ionic/angular';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService } from './services/auth/auth.service';
import { ReservationService } from './services/reservation/reservation.service';
import { RestaurantService } from './services/restaurant/restaurant.service';

import { Reservation } from './models/reservation.model';
import { Timeslot } from './models/restaurant.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  isAuthenticated: Observable<boolean>;
  reservations: Observable<Reservation[]>;

  constructor(private menuController: MenuController, private authService: AuthService, private reservationService: ReservationService, private restaurantService: RestaurantService) {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.reservations = this.reservationService.getUserReservations();
  }

  signOut(): void {
    this.menuController.close();

    this.authService.signOut();
  }

  cancelReservation(restaurantId: string, reservationId: string, people: number, timeslot: Timeslot): void {
    this.restaurantService.getAvailability(restaurantId, timeslot).pipe(take(1)).subscribe(
      availability => {
        console.log('%ccancelling reservation', 'color: gray');
        this.reservationService.cancelReservation(restaurantId, reservationId)
          .then(() => {
            console.log('%creservation cancelled', 'color: green');
            console.log('%cupdating availability', 'color: gray');
            const newAvailability = availability + people;
            this.restaurantService.updateAvailability(restaurantId, timeslot, newAvailability)
              .then(() => console.log('%cavailability updated', 'color: green'));
          });
      }
    );
  }
}
