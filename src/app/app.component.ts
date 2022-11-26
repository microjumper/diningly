import { Component } from '@angular/core';

import { MenuController } from '@ionic/angular';

import { Observable } from 'rxjs';

import { AuthService } from './services/auth/auth.service';
import { ReservationService } from './services/reservation/reservation.service';

import { UserReservation } from './models/reservation.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  isAuthenticated: Observable<boolean>;
  reservations: Observable<UserReservation[]>;

  constructor(private menuController: MenuController, private authService: AuthService, private reservationService: ReservationService) {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.reservations = this.reservationService.getUserReservations();
  }

  signOut(): void {
    this.menuController.close();

    this.authService.signOut();
  }
}
