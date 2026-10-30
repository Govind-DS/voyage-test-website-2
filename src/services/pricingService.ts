import { AppVersion, Flight, FlightSearchParams, Hotel, HotelSearchParams, PriceBreakdownData, RoomType } from '../types';
import { getVersionDefects } from '../config/versionConfig';
import { calculateNights } from '../utils/dateUtils';

export const STANDARD_TAX_RATE = 0.12; // 12% GST
export const FLIGHT_CONVENIENCE_FEE = 250;
export const HOTEL_RESORT_FEE = 300;

/**
 * Calculates pricing for flight reservations with centralized business logic
 * and isolated version defect injection.
 */
export function calculateFlightPrice(
  flight: Flight,
  searchParams: FlightSearchParams,
  version: AppVersion,
  returnFlight?: Flight | null
): PriceBreakdownData {
  const defects = getVersionDefects(version);
  const { adults, children, infants } = searchParams.passengers;

  const adultFare = flight.baseFare;
  const childFare = Math.round(flight.baseFare * 0.75); // 75% for children
  const infantFare = 1000; // Flat 1,000 INR for infants

  let baseAmount: number;
  let totalEligiblePassengers: number;

  if (defects.omitPassengerCategoryInPricing) {
    // BUG A02 & BUG A07: completely omit children and infants from passenger count and fare calculation
    baseAmount = adults * adultFare;
    totalEligiblePassengers = adults;
  } else {
    // Correct Clean Logic: account for all passenger tiers accurately
    baseAmount = (adults * adultFare) + (children * childFare) + (infants * infantFare);
    totalEligiblePassengers = adults + children + infants;
  }

  let returnAmount = 0;
  if (searchParams.tripType === 'round-trip' && returnFlight) {
    const retAdultFare = returnFlight.baseFare;
    const retChildFare = Math.round(returnFlight.baseFare * 0.75);
    const retInfantFare = 1000;

    if (defects.omitPassengerCategoryInPricing) {
      returnAmount = adults * retAdultFare;
    } else {
      returnAmount = (adults * retAdultFare) + (children * retChildFare) + (infants * retInfantFare);
    }
  }

  const taxableSubtotal = baseAmount + returnAmount;

  // Tax calculation
  let taxRate = STANDARD_TAX_RATE;
  if (defects.incorrectFlightTaxRate) {
    // BUG B04: Apply incorrect tax rate (25% instead of 12%)
    taxRate = 0.25;
  }

  const taxAmount = Math.round(taxableSubtotal * taxRate);
  const feeAmount = FLIGHT_CONVENIENCE_FEE;
  const discountAmount = 0;
  const totalAmount = taxableSubtotal + taxAmount + feeAmount - discountAmount;

  return {
    baseAmount,
    returnAmount: returnAmount > 0 ? returnAmount : undefined,
    taxAmount,
    taxRatePercent: Math.round(taxRate * 100),
    feeAmount,
    discountAmount,
    totalAmount,
    pricePerPassengerOrNight: adultFare,
    quantityOrNights: totalEligiblePassengers,
  };
}

/**
 * Calculates pricing for hotel reservations with centralized business logic
 * and isolated version defect injection.
 */
export function calculateHotelPrice(
  room: RoomType,
  hotelSearch: HotelSearchParams,
  roomQuantity: number,
  version: AppVersion
): PriceBreakdownData {
  const defects = getVersionDefects(version);
  let nights = calculateNights(hotelSearch.checkInDate, hotelSearch.checkOutDate);
  if (nights <= 0) nights = 1;

  if (defects.corruptHotelBookingSummary) {
    // BUG A11: summary mistakenly assumes only 1 night
    nights = 1;
  }

  const roomSubtotal = room.pricePerNight * nights * roomQuantity;

  let taxRate = STANDARD_TAX_RATE;
  if (defects.incorrectHotelTaxRate) {
    // BUG B06: Apply incorrect hotel tax rate (24% instead of 12%)
    taxRate = 0.24;
  }

  const taxAmount = Math.round(roomSubtotal * taxRate);
  const feeAmount = HOTEL_RESORT_FEE;
  const discountAmount = 0;
  const totalAmount = roomSubtotal + taxAmount + feeAmount - discountAmount;

  return {
    baseAmount: roomSubtotal,
    taxAmount,
    taxRatePercent: Math.round(taxRate * 100),
    feeAmount,
    discountAmount,
    totalAmount,
    pricePerPassengerOrNight: room.pricePerNight,
    quantityOrNights: nights,
  };
}
