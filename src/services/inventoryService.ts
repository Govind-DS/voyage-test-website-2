import { AppVersion, Flight, FlightFilterState, FlightSearchParams, Hotel, HotelSearchParams, RoomType } from '../types';
import { INITIAL_FLIGHTS } from '../data/flights';
import { INITIAL_HOTELS } from '../data/hotels';
import { getVersionDefects } from '../config/versionConfig';

// In-memory simulated inventory for the current session
let flightsInventory: Flight[] = JSON.parse(JSON.stringify(INITIAL_FLIGHTS));
let hotelsInventory: Hotel[] = JSON.parse(JSON.stringify(INITIAL_HOTELS));

export function resetInventory(): void {
  flightsInventory = JSON.parse(JSON.stringify(INITIAL_FLIGHTS));
  hotelsInventory = JSON.parse(JSON.stringify(INITIAL_HOTELS));
}

/**
 * Searches flights with origin/destination matching and version-specific bug injection.
 */
export function searchFlights(params: FlightSearchParams, version: AppVersion): Flight[] {
  const defects = getVersionDefects(version);
  const originClean = params.origin.trim().toLowerCase();
  const destClean = params.destination.trim().toLowerCase();

  // Stale search cache bug (BUG B08)
  if (defects.staleSearchResults && window.__staleFlightCache) {
    return window.__staleFlightCache;
  }

  let results = flightsInventory.filter(f => {
    const matchOrigin = f.origin.toLowerCase() === originClean || f.originCode.toLowerCase() === originClean;
    const matchDest = f.destination.toLowerCase() === destClean || f.destinationCode.toLowerCase() === destClean;
    return matchOrigin && matchDest;
  });

  // BUG A03: Inject an inconsistent route result
  if (defects.injectInconsistentRouteResult && results.length > 0) {
    const rogueFlight: Flight = {
      id: 'BUG-ROGUE-DXB-999',
      airline: 'Emirates',
      airlineCode: 'EK',
      flightNumber: 'EK-999',
      origin: 'Dubai',
      originCode: 'DXB',
      destination: 'New Delhi',
      destinationCode: 'DEL',
      departureTime: '23:55',
      arrivalTime: '04:30',
      duration: '4h 05m',
      stops: 0,
      stopDetails: 'Non-stop',
      baseFare: 18200,
      cabinAvailability: { Economy: true, 'Premium Economy': true, Business: true },
      availableSeats: 12,
      aircraft: 'Boeing 777-300ER',
    };
    results = [rogueFlight, ...results];
  }

  // Cache if Test 2 active for BUG B08
  if (defects.staleSearchResults && !window.__staleFlightCache && results.length > 0) {
    window.__staleFlightCache = results;
  }

  return results;
}

declare global {
  interface Window {
    __staleFlightCache?: Flight[];
  }
}

/**
 * Filters flights by price, airlines, stops, and departure times.
 */
export function filterFlights(
  flights: Flight[],
  filters: FlightFilterState,
  version: AppVersion
): Flight[] {
  const defects = getVersionDefects(version);

  return flights.filter(flight => {
    // BUG B02: Broken filter logic - returns flights that do not satisfy airline or stop filters
    if (defects.brokenFlightFilters) {
      // Intentionally leak flights even if airline doesn't match
      if (filters.airlines.length > 0 && Math.random() < 0.4) {
        return true;
      }
    }

    // 1. Max price
    if (flight.baseFare > filters.maxPrice) {
      return false;
    }

    // 2. Airline filter
    if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) {
      if (!defects.brokenFlightFilters) {
        return false;
      }
    }

    // 3. Stops filter
    if (filters.stops.length > 0 && !filters.stops.includes(flight.stops)) {
      if (!defects.brokenFlightFilters) {
        return false;
      }
    }

    // 4. Departure time filter (morning: 05-12, afternoon: 12-18, evening: 18-24)
    if (filters.departureTimes.length > 0) {
      const hour = parseInt(flight.departureTime.split(':')[0], 10);
      let timeSlot = 'morning';
      if (hour >= 12 && hour < 18) timeSlot = 'afternoon';
      else if (hour >= 18) timeSlot = 'evening';

      if (!filters.departureTimes.includes(timeSlot)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Searches hotels by destination city.
 */
export function searchHotels(params: HotelSearchParams): Hotel[] {
  const destClean = params.destination.trim().toLowerCase();
  return hotelsInventory.filter(h =>
    h.city.toLowerCase() === destClean ||
    h.name.toLowerCase().includes(destClean) ||
    h.location.toLowerCase().includes(destClean)
  );
}

/**
 * Gets a hotel by ID.
 */
export function getHotelById(id: string): Hotel | undefined {
  return hotelsInventory.find(h => h.id === id);
}

/**
 * Gets displayed room availability based on version defects.
 */
export function getDisplayedRoomAvailability(room: RoomType, version: AppVersion): number {
  const defects = getVersionDefects(version);
  if (defects.inconsistentRoomAvailabilityDisplay) {
    // BUG A10: Display false 5 rooms available even if 0 or 1
    return 5;
  }
  return room.availableRooms;
}

/**
 * Validates inventory availability before confirming booking.
 */
export function validateRoomAvailability(
  hotelId: string,
  roomId: string,
  requestedQuantity: number,
  version: AppVersion
): { valid: boolean; error?: string } {
  const defects = getVersionDefects(version);
  const hotel = hotelsInventory.find(h => h.id === hotelId);
  if (!hotel) return { valid: false, error: 'Hotel not found.' };

  const room = hotel.rooms.find(r => r.id === roomId);
  if (!room) return { valid: false, error: 'Room type not found.' };

  // BUG A08 & BUG B07: Bypass sold out check
  if (room.availableRooms <= 0 && !(defects.allowSoldOutRoomBooking || defects.allowUnavailableRoomBooking)) {
    return { valid: false, error: 'This room type is currently sold out.' };
  }

  // BUG B10: Fail to enforce quantity constraints
  if (requestedQuantity > room.availableRooms && !defects.failRoomAvailabilityConstraint) {
    return { valid: false, error: `Only ${room.availableRooms} rooms available for this selection.` };
  }

  return { valid: true };
}

/**
 * Updates simulated room inventory upon confirmed booking.
 */
export function reserveRoomInventory(hotelId: string, roomId: string, quantity: number): boolean {
  const hotel = hotelsInventory.find(h => h.id === hotelId);
  if (!hotel) return false;

  const room = hotel.rooms.find(r => r.id === roomId);
  if (!room) return false;

  if (room.availableRooms >= quantity) {
    room.availableRooms -= quantity;
    return true;
  }
  return false;
}

/**
 * Generates deterministic or unique simulated booking reference.
 */
export function generateBookingReference(type: 'flight' | 'hotel'): string {
  const prefix = type === 'flight' ? 'VYG-FLT' : 'VYG-HTL';
  const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${randomChars}`;
}
