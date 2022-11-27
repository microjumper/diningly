import { User } from './user.model';
import { Timeslot } from './restaurant.model';

export interface Reservation {
  id?: string;
  restaurantRef: string;
  restaurantName: string;
  user: User;
  timeslot: Timeslot;
  people: number;
}
