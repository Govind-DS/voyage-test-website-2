import { AppVersion, FlightSearchParams, GuestDetails, HotelSearchParams } from '../types';
import { getVersionDefects } from '../config/versionConfig';
import { isDateInPast, isReturnBeforeDeparture } from './dateUtils';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateFlightSearch(
  params: FlightSearchParams,
  version: AppVersion
): ValidationResult {
  const defects = getVersionDefects(version);
  const errors: Record<string, string> = {};

  if (!params.origin) {
    errors.origin = 'Please select an origin city.';
  }

  if (!params.destination) {
    errors.destination = 'Please select a destination city.';
  }

  if (params.origin && params.destination && params.origin === params.destination) {
    errors.destination = 'Origin and destination cities cannot be the same.';
  }

  if (!params.departureDate) {
    errors.departureDate = 'Please select a departure date.';
  } else if (!defects.allowPastDates && isDateInPast(params.departureDate)) {
    // BUG B12: skips past date validation if active
    errors.departureDate = 'Departure date cannot be in the past.';
  }

  if (params.tripType === 'round-trip') {
    if (!params.returnDate) {
      errors.returnDate = 'Please select a return date for round-trip.';
    } else if (!defects.allowReturnBeforeDeparture && isReturnBeforeDeparture(params.departureDate, params.returnDate)) {
      // BUG A01: skips return before departure validation if active in Test 1
      errors.returnDate = 'Return date must be on or after departure date.';
    }
  }

  const totalPassengers = params.passengers.adults + params.passengers.children + params.passengers.infants;
  if (params.passengers.adults < 1) {
    errors.passengers = 'At least 1 adult passenger is required.';
  } else if (totalPassengers > 9) {
    errors.passengers = 'Maximum 9 passengers allowed per booking.';
  } else if (params.passengers.infants > params.passengers.adults) {
    errors.passengers = 'Number of infants cannot exceed number of adults.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateHotelSearch(
  params: HotelSearchParams,
  version: AppVersion
): ValidationResult {
  const defects = getVersionDefects(version);
  const errors: Record<string, string> = {};

  if (!params.destination) {
    errors.destination = 'Please choose a destination city.';
  }

  if (!params.checkInDate) {
    errors.checkInDate = 'Please select a check-in date.';
  } else if (!defects.allowPastDates && isDateInPast(params.checkInDate)) {
    // BUG B12: allows past check-in if defect active
    errors.checkInDate = 'Check-in date cannot be in the past.';
  }

  if (!params.checkOutDate) {
    errors.checkOutDate = 'Please select a check-out date.';
  } else if (!defects.allowInvalidHotelDateRange && params.checkOutDate <= params.checkInDate) {
    // BUG A09: allows check-out <= check-in if defect active in Test 1
    errors.checkOutDate = 'Check-out date must be after check-in date.';
  }

  if (params.guests < 1) {
    errors.guests = 'At least 1 guest is required.';
  }

  if (params.rooms < 1) {
    errors.rooms = 'At least 1 room is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateGuestDetails(details: GuestDetails): ValidationResult {
  const errors: Record<string, string> = {};

  if (!details.firstName.trim()) {
    errors.firstName = 'First name is required.';
  }

  if (!details.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!details.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!emailRegex.test(details.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!details.phone.trim()) {
    errors.phone = 'Contact phone number is required.';
  } else if (details.phone.replace(/[^0-9]/g, '').length < 8) {
    errors.phone = 'Please enter a valid phone number.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
