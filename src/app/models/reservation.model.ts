import { User } from './user.model';
import { Timeslot } from './restaurant.model';

export interface Reservation {
  id?: string;
  restaurantRef: string;
  user: User;
  timeslot: Timeslot;
  people: number;
}

export interface UserReservation {
  restaurantId: string;
  restaurantName: string;
  reservationId: string;
  people: number;
  timeslot: Timeslot;
}
