export enum TimeSlot {
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
  reservations: string;
}
