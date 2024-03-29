import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { RestaurantComponent } from '../components/restaurant/restaurant.component';
import { SharedModule } from '../shared/shared.module';

import { TimeslotPipe } from '../pipes/timeslot.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        ReactiveFormsModule,
        SharedModule
    ],
  providers: [
    TimeslotPipe
  ],
  declarations: [HomePage, RestaurantComponent]
})
export class HomePageModule {}
