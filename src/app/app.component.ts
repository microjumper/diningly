import { Component } from '@angular/core';

import { MenuController } from '@ionic/angular';

import { Observable } from 'rxjs';

import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  isAuthenticated: Observable<boolean>;

  constructor(private menuController: MenuController, private authService: AuthService) {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  signOut(): void {
    this.menuController.close();

    this.authService.signOut();
  }
}
