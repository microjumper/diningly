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
}

export type Availability = {
  early: number;
  ordinary: number;
  late: number;
};
