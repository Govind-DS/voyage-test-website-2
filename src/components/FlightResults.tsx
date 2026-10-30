import React, { useState } from 'react';
import { Flight } from '../types';
import { useBooking } from '../state/BookingContext';
import { getVersionDefects } from '../config/versionConfig';
import { FlightCard } from './FlightCard';
import { Plane, AlertCircle, ArrowUpDown } from 'lucide-react';

interface FlightResultsProps {
  flights: Flight[];
  onSelectFlight: (flight: Flight) => void;
  onModifySearch: () => void;
}

export const FlightResults: React.FC<FlightResultsProps> = ({
  flights,
  onSelectFlight,
  onModifySearch,
}) => {
  const { state, version } = useBooking();
  const defects = getVersionDefects(version);
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');

  const { origin, destination } = state.flightSearch;

  // BUG A04: Incorrect Destination Heading in Test Website 1
  let displayHeadingDestination = destination;
  if (defects.corruptFlightResultsHeading) {
    displayHeadingDestination = 'New Delhi'; // Injected false heading
  }

  // Sorting
  const sortedFlights = [...flights].sort((a, b) => {
    if (sortBy === 'price') return a.baseFare - b.baseFare;
    if (sortBy === 'departure') return a.departureTime.localeCompare(b.departureTime);
    if (sortBy === 'duration') {
      const getMin = (dur: string) => {
        const h = parseInt(dur.split('h')[0] || '0', 10);
        const m = parseInt(dur.split('h')[1]?.replace('m', '') || '0', 10);
        return h * 60 + m;
      };
      return getMin(a.duration) - getMin(b.duration);
    }
    return 0;
  });

  return (
    <div data-testid="flight-results" className="space-y-4">
      {/* Results Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2
            data-testid="results-heading"
            className="font-heading font-extrabold text-xl text-navy-900 tracking-tight"
          >
            Flights from {origin} to {displayHeadingDestination}
          </h2>
          <p className="text-xs text-voyage-muted mt-0.5" data-testid="flight-count">
            Showing <strong className="text-navy-900">{flights.length}</strong> available flights
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center space-x-2">
          <ArrowUpDown className="w-4 h-4 text-voyage-blue shrink-0" />
          <span className="text-xs font-semibold text-voyage-muted">Sort by:</span>
          <select
            data-testid="sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="text-xs font-semibold text-navy-900 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:border-voyage-blue focus:ring-1 focus:ring-voyage-blue cursor-pointer"
          >
            <option value="price">Price (Lowest first)</option>
            <option value="departure">Departure time</option>
            <option value="duration">Fastest duration</option>
          </select>
        </div>
      </div>

      {/* Flight Cards List */}
      {sortedFlights.length > 0 ? (
        <div className="space-y-3.5">
          {sortedFlights.map(flight => (
            <FlightCard
              key={flight.id}
              flight={flight}
              onSelect={onSelectFlight}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div
          data-testid="no-flights-empty-state"
          className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-voyage-blue-light text-voyage-blue flex items-center justify-center mx-auto mb-4">
            <Plane className="w-8 h-8 -rotate-45" />
          </div>
          <h3 className="font-heading font-bold text-lg text-navy-900">
            No flights match your search
          </h3>
          <p className="text-sm text-voyage-muted max-w-md mx-auto mt-1 mb-6">
            We couldn't find any flights matching the selected route or active filter criteria. Try adjusting your dates or resetting your filters.
          </p>
          <button
            type="button"
            onClick={onModifySearch}
            className="px-6 py-2.5 rounded-xl bg-voyage-blue hover:bg-voyage-blue-hover text-white text-xs font-bold font-heading transition-all shadow-sm"
          >
            Modify Search Criteria
          </button>
        </div>
      )}
    </div>
  );
};
