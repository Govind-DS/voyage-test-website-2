import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../state/BookingContext';
import { getVersionDefects } from '../config/versionConfig';
import { formatINR } from '../utils/currencyUtils';
import { formatFriendlyDate } from '../utils/dateUtils';
import { CheckCircle2, Plane, Building2, Calendar, Mail, Phone, ArrowLeft, Printer, ShieldAlert } from 'lucide-react';
import { VERSION_CONFIG } from '../config/versionConfig';

export const BookingConfirmation: React.FC = () => {
  const { state, version, resetBooking } = useBooking();
  const navigate = useNavigate();
  const defects = getVersionDefects(version);

  const prefix = VERSION_CONFIG[version]?.routePrefix || '/clean-version';

  const {
    bookingType,
    bookingReference,
    bookingDate,
    selectedFlight,
    selectedHotel,
    selectedRoom,
    flightSearch,
    hotelSearch,
    guestDetails,
    priceBreakdown,
  } = state;

  if (!bookingReference || !priceBreakdown) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="font-heading font-bold text-lg text-navy-900">No Confirmed Booking Found</h2>
        <p className="text-xs text-voyage-muted mt-1 mb-6">
          You don't have an active confirmed reservation in this session.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl bg-voyage-blue text-white text-xs font-bold"
        >
          Return to Search
        </button>
      </div>
    );
  }

  // BUG A05: Incorrect Confirmation Destination
  let displayDestination = bookingType === 'flight' ? flightSearch.destination : selectedHotel?.city;
  if (defects.corruptConfirmationDestination) {
    displayDestination = 'Mumbai'; // Injected false destination
  }

  // BUG A06: Incorrect Confirmation Passenger Count
  let displayPassengers = flightSearch.passengers.adults + flightSearch.passengers.children + flightSearch.passengers.infants;
  if (defects.corruptConfirmationPassengerCount) {
    displayPassengers = 1; // Injected false count
  }

  const handleBookAnother = () => {
    resetBooking();
    navigate('/');
  };

  return (
    <div
      data-testid="booking-confirmation"
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Success Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4 shadow-md">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
          Booking Confirmed
        </span>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-navy-900 tracking-tight mt-3">
          Your reservation is confirmed!
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
          We’ve dispatched full booking credentials and simulated ticket vouchers to your email.
        </p>

        {/* Reference Code Box */}
        <div className="mt-6 inline-block bg-white border border-emerald-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-voyage-muted uppercase tracking-wider block">
            Booking Reference ID
          </span>
          <span
            data-testid="booking-reference"
            className="font-heading font-black text-2xl sm:text-3xl text-voyage-blue tracking-wider block mt-0.5"
          >
            {bookingReference}
          </span>
          <span className="text-[11px] text-voyage-muted block mt-1">
            Issued on {bookingDate}
          </span>
        </div>
      </div>

      {/* Booking Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="font-heading font-bold text-lg text-navy-900">
            Reservation Overview
          </h2>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-voyage-blue-light text-voyage-blue">
            {bookingType === 'flight' ? 'Flight Booking' : 'Hotel Stay'}
          </span>
        </div>

        {/* Itinerary Details */}
        {bookingType === 'flight' && selectedFlight && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold text-voyage-muted uppercase tracking-wider block">
                  Route
                </span>
                <span
                  data-testid="confirmation-destination"
                  className="font-heading font-extrabold text-base text-navy-900 block mt-0.5"
                >
                  {flightSearch.origin} → {displayDestination}
                </span>
                <span className="text-xs text-voyage-muted">
                  {selectedFlight.airline} ({selectedFlight.flightNumber})
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-voyage-muted uppercase tracking-wider block">
                  Travelers
                </span>
                <span
                  data-testid="confirmation-passengers"
                  className="font-heading font-extrabold text-base text-navy-900 block mt-0.5"
                >
                  {displayPassengers} {displayPassengers === 1 ? 'Passenger' : 'Passengers'}
                </span>
                <span className="text-xs text-voyage-muted">{flightSearch.cabinClass}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Departure:</span>
                <span className="font-semibold text-navy-900">
                  {formatFriendlyDate(flightSearch.departureDate)} • {selectedFlight.departureTime}
                </span>
              </div>
              {flightSearch.tripType === 'round-trip' && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Return:</span>
                  <span className="font-semibold text-navy-900">
                    {formatFriendlyDate(flightSearch.returnDate || '')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hotel Details */}
        {bookingType === 'hotel' && selectedHotel && selectedRoom && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold text-voyage-muted uppercase tracking-wider block">
                  Property
                </span>
                <span className="font-heading font-extrabold text-base text-navy-900 block mt-0.5">
                  {selectedHotel.name}
                </span>
                <span
                  data-testid="confirmation-destination"
                  className="text-xs text-voyage-muted block"
                >
                  {displayDestination}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-voyage-muted uppercase tracking-wider block">
                  Room Reserved
                </span>
                <span className="font-heading font-extrabold text-base text-navy-900 block mt-0.5">
                  {selectedRoom.name}
                </span>
                <span className="text-xs text-voyage-muted">
                  {state.roomQuantity} {state.roomQuantity === 1 ? 'Room' : 'Rooms'} • {hotelSearch.guests} Guests
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl flex justify-between text-xs">
              <div>
                <span className="text-voyage-muted block text-[11px]">Check-in</span>
                <span className="font-semibold text-navy-900">{formatFriendlyDate(hotelSearch.checkInDate)}</span>
              </div>
              <div className="text-right">
                <span className="text-voyage-muted block text-[11px]">Check-out</span>
                <span className="font-semibold text-navy-900">{formatFriendlyDate(hotelSearch.checkOutDate)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Guest Credentials */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-xs font-semibold text-voyage-muted uppercase tracking-wider block mb-2">
            Lead Guest Information
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-slate-500">Name:</span>
              <span data-testid="confirmation-guest-name" className="font-bold text-navy-900">
                {guestDetails.title} {guestDetails.firstName} {guestDetails.lastName}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-voyage-blue shrink-0" />
              <span data-testid="confirmation-email" className="font-bold text-navy-900">
                {guestDetails.email}
              </span>
            </div>
          </div>
        </div>

        {/* Total Price Paid */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-voyage-muted block">
              Simulated Total Paid
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">
              Payment Status: Confirmed (Simulated)
            </span>
          </div>
          <span
            data-testid="confirmation-total"
            className="font-heading font-black text-2xl text-navy-900 text-voyage-blue"
          >
            {formatINR(priceBreakdown.totalAmount)}
          </span>
        </div>
      </div>

      {/* Simulated Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center space-x-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
        <p>
          <strong>Simulation Notice:</strong> This is a flight and hotel booking test harness. No real airlines or payment cards were charged. All flight routes and properties are simulated for automated testing.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-navy-900 text-xs font-heading font-bold transition-all flex items-center justify-center space-x-2 shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Print Voucher</span>
        </button>

        <button
          type="button"
          onClick={handleBookAnother}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-voyage-blue hover:bg-voyage-blue-hover text-white text-xs font-heading font-bold shadow-premium transition-all flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Book Another Trip</span>
        </button>
      </div>
    </div>
  );
};
