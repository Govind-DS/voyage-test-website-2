import React from 'react';
import { Flight } from '../types';
import { useBooking } from '../state/BookingContext';
import { getVersionDefects } from '../config/versionConfig';
import { formatINR } from '../utils/currencyUtils';
import { Plane, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

interface FlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight, onSelect }) => {
  const { version, state } = useBooking();
  const defects = getVersionDefects(version);

  // BUG B03: Flight Price Mismatch - displays lower artificial price on the card that jumps in review
  let displayedPrice = flight.baseFare;
  if (defects.flightCardPriceMismatch) {
    displayedPrice = Math.round(flight.baseFare * 0.8); // 20% lower false price displayed on card
  }

  const totalPax = state.flightSearch.passengers.adults + state.flightSearch.passengers.children + state.flightSearch.passengers.infants;

  return (
    <div
      data-testid="flight-card"
      data-flight-id={flight.id}
      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 hover:shadow-card hover:border-voyage-blue/40 transition-all duration-200 relative group"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Airline Branding & Aircraft */}
        <div className="flex items-center space-x-4 min-w-[200px]">
          <div className="w-12 h-12 rounded-2xl bg-voyage-blue-light flex items-center justify-center text-voyage-blue font-heading font-black text-base shadow-sm group-hover:scale-105 transition-transform">
            {flight.airlineCode}
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-navy-900 flex items-center space-x-1.5">
              <span>{flight.airline}</span>
              <span className="text-xs text-voyage-muted font-normal">({flight.flightNumber})</span>
            </h3>
            <p className="text-xs text-voyage-muted flex items-center space-x-1 mt-0.5">
              <span>{flight.aircraft}</span>
              <span>•</span>
              <span className="text-emerald-700 font-medium">On-time 92%</span>
            </p>
          </div>
        </div>

        {/* Center: Itinerary Timeline */}
        <div className="flex-1 grid grid-cols-7 items-center max-w-md mx-auto w-full text-center">
          {/* Departure */}
          <div className="col-span-2 text-left sm:text-center">
            <span className="block font-heading font-extrabold text-xl text-navy-900 tracking-tight">
              {flight.departureTime}
            </span>
            <span className="block text-xs font-semibold text-voyage-blue uppercase">
              {flight.originCode}
            </span>
            <span className="block text-[11px] text-voyage-muted truncate max-w-[90px] mx-auto">
              {flight.origin}
            </span>
          </div>

          {/* Timeline graphic */}
          <div className="col-span-3 px-2 flex flex-col items-center">
            <span className="text-[11px] font-medium text-voyage-muted flex items-center space-x-1 mb-1">
              <Clock className="w-3 h-3 text-voyage-muted" />
              <span>{flight.duration}</span>
            </span>
            <div className="w-full relative flex items-center">
              <div className="h-0.5 w-full bg-slate-200"></div>
              <div className="absolute left-1/2 -translate-x-1/2 bg-white px-1">
                <Plane className="w-3.5 h-3.5 text-voyage-blue rotate-90" />
              </div>
            </div>
            <span className={`text-[11px] font-semibold mt-1 ${flight.stops === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {flight.stopDetails || (flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`)}
            </span>
          </div>

          {/* Arrival */}
          <div className="col-span-2 text-right sm:text-center">
            <span className="block font-heading font-extrabold text-xl text-navy-900 tracking-tight">
              {flight.arrivalTime}
            </span>
            <span className="block text-xs font-semibold text-voyage-blue uppercase">
              {flight.destinationCode}
            </span>
            <span className="block text-[11px] text-voyage-muted truncate max-w-[90px] mx-auto">
              {flight.destination}
            </span>
          </div>
        </div>

        {/* Right: Pricing & CTA */}
        <div className="flex sm:flex-row lg:flex-col items-end sm:items-center lg:items-end justify-between sm:justify-end gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 min-w-[170px]">
          <div className="text-right">
            <span className="text-xs text-voyage-muted block">Starting from</span>
            <span
              data-testid="flight-price"
              className="font-heading font-extrabold text-2xl text-navy-900 tracking-tight text-voyage-blue block"
            >
              {formatINR(displayedPrice)}
            </span>
            <span className="text-[11px] text-voyage-muted block">
              per passenger ({totalPax} {totalPax === 1 ? 'traveler' : 'travelers'})
            </span>
          </div>

          <button
            type="button"
            data-testid="select-flight"
            onClick={() => onSelect(flight)}
            className="px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-voyage-blue text-white font-heading font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center space-x-1.5 group/btn"
          >
            <span>Select Flight</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
