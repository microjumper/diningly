export enum Timeslot {
  early = 'early',
  ordinary = 'ordinary',
  late = 'late',
}

export interface Restaurant {
  id: string;
  name: string;
  city: string;
  description: string;
  image: string;
  capacity: number;
  availability: Availability;
  reservationsRef: string;
}

export type Availability = {
  early: number;
  ordinary: number;
  late: number;
};

export type Reservation = {
  ref: string;
  user: string;
  timeslot: Timeslot;
  people: number;
};
