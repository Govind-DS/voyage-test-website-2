import React from 'react';
import { useBooking } from '../state/BookingContext';
import { getVersionDefects } from '../config/versionConfig';
import { PriceBreakdown } from './PriceBreakdown';
import { formatFriendlyDate, calculateNights } from '../utils/dateUtils';
import { Plane, Building2, Calendar, Users, MapPin, BedDouble } from 'lucide-react';

export const BookingSummary: React.FC = () => {
  const { state, version } = useBooking();
  const defects = getVersionDefects(version);

  const {
    bookingType,
    selectedFlight,
    selectedReturnFlight,
    selectedHotel,
    selectedRoom,
    roomQuantity,
    flightSearch,
    hotelSearch,
    priceBreakdown,
  } = state;

  if (!priceBreakdown) return null;

  // Passenger count for summary display
  let displayedPassengers = flightSearch.passengers.adults + flightSearch.passengers.children + flightSearch.passengers.infants;
  if (defects.omitPassengerCategoryInPricing) {
    // BUG A02 & A07: displays only adults
    displayedPassengers = flightSearch.passengers.adults;
  }

  // Nights calculation for summary display
  let displayedNights = calculateNights(hotelSearch.checkInDate, hotelSearch.checkOutDate);
  if (defects.corruptHotelBookingSummary) {
    // BUG A11: calculates 1 night
    displayedNights = 1;
  }

  // Room type for summary display
  let displayedRoomName = selectedRoom?.name || 'Selected Room';
  if (defects.corruptSummaryRoomType) {
    // BUG B11: mismatched room type
    displayedRoomName = 'Standard Room';
  }

  return (
    <div data-testid="booking-summary" className="space-y-5">
      {/* Flight Reservation Summary Card */}
      {bookingType === 'flight' && selectedFlight && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Plane className="w-4 h-4 text-voyage-blue -rotate-45" />
            <h3 className="font-heading font-bold text-sm text-navy-900">Flight Itinerary</h3>
          </div>

          {/* Outbound */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-navy-900">
                {selectedFlight.origin} ({selectedFlight.originCode}) → {selectedFlight.destination} ({selectedFlight.destinationCode})
              </span>
              <span className="text-voyage-blue font-semibold">{selectedFlight.airline} {selectedFlight.flightNumber}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-voyage-muted">
              <Calendar className="w-3.5 h-3.5 text-voyage-blue" />
              <span>{formatFriendlyDate(flightSearch.departureDate)}</span>
              <span>•</span>
              <span>{selectedFlight.departureTime} – {selectedFlight.arrivalTime} ({selectedFlight.duration})</span>
            </div>
          </div>

          {/* Return flight (if round trip) */}
          {flightSearch.tripType === 'round-trip' && (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-navy-900">
                  {selectedFlight.destination} ({selectedFlight.destinationCode}) → {selectedFlight.origin} ({selectedFlight.originCode})
                </span>
                <span className="text-voyage-blue font-semibold">
                  {selectedReturnFlight ? `${selectedReturnFlight.airline} ${selectedReturnFlight.flightNumber}` : 'Return Scheduled'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-voyage-muted">
                <Calendar className="w-3.5 h-3.5 text-voyage-blue" />
                <span>{formatFriendlyDate(flightSearch.returnDate || '')}</span>
                <span>•</span>
                <span>Confirmed Return Segment</span>
              </div>
            </div>
          )}

          {/* Passengers & Cabin */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-voyage-blue" />
              <span data-testid="summary-passengers">
                <strong>{displayedPassengers}</strong> {displayedPassengers === 1 ? 'Passenger' : 'Passengers'}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium">
              {flightSearch.cabinClass}
            </span>
          </div>
        </div>
      )}

      {/* Hotel Reservation Summary Card */}
      {bookingType === 'hotel' && selectedHotel && selectedRoom && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-voyage-blue" />
            <h3 className="font-heading font-bold text-sm text-navy-900">Stay Itinerary</h3>
          </div>

          <div>
            <h4 className="font-heading font-bold text-base text-navy-900">
              {selectedHotel.name}
            </h4>
            <p className="text-xs text-voyage-muted flex items-center space-x-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-voyage-orange" />
              <span>{selectedHotel.location}, {selectedHotel.city}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 py-2 bg-slate-50 p-3 rounded-xl text-xs">
            <div>
              <span className="text-voyage-muted block text-[11px]">Check-in</span>
              <span className="font-semibold text-navy-900 block">
                {formatFriendlyDate(hotelSearch.checkInDate)}
              </span>
            </div>
            <div>
              <span className="text-voyage-muted block text-[11px]">Check-out</span>
              <span className="font-semibold text-navy-900 block">
                {formatFriendlyDate(hotelSearch.checkOutDate)}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between items-center">
              <span className="flex items-center space-x-1">
                <BedDouble className="w-3.5 h-3.5 text-voyage-blue" />
                <span data-testid="summary-room-type">{displayedRoomName}</span>
              </span>
              <span className="font-semibold">{roomQuantity} {roomQuantity === 1 ? 'Room' : 'Rooms'}</span>
            </div>
            <div className="flex justify-between items-center text-voyage-muted">
              <span>Duration</span>
              <span data-testid="summary-nights">{displayedNights} {displayedNights === 1 ? 'Night' : 'Nights'}</span>
            </div>
            <div className="flex justify-between items-center text-voyage-muted">
              <span>Guests</span>
              <span>{hotelSearch.guests} Guests</span>
            </div>
          </div>
        </div>
      )}

      {/* Itemized Price Breakdown */}
      <PriceBreakdown pricing={priceBreakdown} type={bookingType || 'flight'} />
    </div>
  );
};
