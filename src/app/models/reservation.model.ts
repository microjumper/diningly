import { User } from './user.model';
import { Timeslot } from './restaurant.model';

export type Reservation = {
  id?: string;
  restaurantRef: string;
  user: User;
  timeslot: Timeslot;
  people: number;
};
