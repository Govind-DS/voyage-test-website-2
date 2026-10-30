export type AppVersion = 'clean' | 'test-1' | 'test-2';

export type TripType = 'round-trip' | 'one-way';

export type CabinClass = 'Economy' | 'Premium Economy' | 'Business';

export interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  tripType: TripType;
  passengers: PassengerCounts;
  cabinClass: CabinClass;
}

export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  departureTime: string; // "06:30"
  arrivalTime: string;   // "09:15"
  duration: string;      // "2h 45m"
  stops: number;         // 0, 1, 2
  stopDetails?: string;  // "Non-stop" or "1 stop via BOM"
  baseFare: number;      // INR per adult passenger
  cabinAvailability: Record<CabinClass, boolean>;
  availableSeats: number;
  aircraft: string;
}

export interface FlightFilterState {
  maxPrice: number;
  airlines: string[];
  stops: number[]; // e.g. [0, 1]
  departureTimes: string[]; // ['morning', 'afternoon', 'evening']
  cabinClass?: CabinClass;
}

export interface HotelSearchParams {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  rooms: number;
}

export interface RoomType {
  id: string;
  name: string; // Standard Room, Deluxe Room, Executive Suite
  pricePerNight: number;
  capacity: number; // Max guests
  availableRooms: number;
  bedType: string;
  size: string;
  amenities: string[];
  cancellationPolicy: string;
  image: string;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  description: string;
  rating: number;
  reviewCount: number;
  location: string;
  images: string[];
  amenities: string[];
  rooms: RoomType[];
  cancellationPolicy: string;
}

export interface GuestDetails {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface PriceBreakdownData {
  baseAmount: number;
  returnAmount?: number;
  taxAmount: number;
  taxRatePercent: number;
  feeAmount: number;
  discountAmount: number;
  totalAmount: number;
  pricePerPassengerOrNight: number;
  quantityOrNights: number;
}

export interface BookingState {
  version: AppVersion;
  bookingType: 'flight' | 'hotel' | null;
  flightSearch: FlightSearchParams;
  hotelSearch: HotelSearchParams;
  selectedFlight: Flight | null;
  selectedReturnFlight: Flight | null;
  selectedHotel: Hotel | null;
  selectedRoom: RoomType | null;
  roomQuantity: number;
  guestDetails: GuestDetails;
  priceBreakdown: PriceBreakdownData | null;
  bookingReference: string | null;
  bookingDate: string | null;
  status: 'idle' | 'searching' | 'reviewing' | 'confirmed' | 'failed';
  errorMessage: string | null;
}
