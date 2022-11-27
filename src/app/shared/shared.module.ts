import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeslotPipe } from '../pipes/timeslot.pipe';

@NgModule({
  declarations: [
    TimeslotPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TimeslotPipe
  ]
})
export class SharedModule { }
