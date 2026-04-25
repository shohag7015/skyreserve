export interface Flight {
  flightId?: number;
  airlineId: number;
  originAirportId: number;
  destAirportId: number;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  durationMin: number;
  status: string;
  baseFare: number;
  economyFare?: number;
  businessFare?: number;
  availableSeats: number;
  fromCode?: string;
  toCode?: string;
  fromCity?: string;
  toCity?: string;
  airlineName?: string;
  airlineCode?: string;
}

export interface Passenger {
  passengerId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passportNo: string;
  nationality?: string;
  dateOfBirth?: string;
}

export interface PaymentDetails {
  method: 'card' | 'paypal';
  cardholderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface Booking {
  bookingId?: number;
  passengers?: Passenger[];
  flightId: number;
  bookingDate?: string;
  bookingStatus: string;
  totalFare: number;
  pnrNumber?: string;
  classType: string;
  userId: number;
  noOfPassengers: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  token?: string;
}
