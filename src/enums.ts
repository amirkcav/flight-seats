export class Passenger {
  id: string;
  name: string;
  seat: Seat;
}

export class Seat {
  id: string;
  status: SeatStatus;
  text: string;
  price: number;
  takenBy: string;
}

export enum SeatStatus {
  free = 'free',
  taken = 'taken',
  allocatedSuccessfully = 'allocated-successfully'
}
