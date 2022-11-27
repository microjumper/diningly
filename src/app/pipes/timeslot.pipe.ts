import { Pipe, PipeTransform } from '@angular/core';

import { Timeslot } from '../models/restaurant.model';

@Pipe({
  name: 'timeslot'
})
export class TimeslotPipe implements PipeTransform {

  transform(timeslot: Timeslot): string {
    switch (timeslot) {
      case Timeslot.early:
        return '19:30';
      case Timeslot.ordinary:
        return '21:00';
      case Timeslot.late:
        return '22:30';
      default:
        return 'unknow timeslot';
    }
  }
}
