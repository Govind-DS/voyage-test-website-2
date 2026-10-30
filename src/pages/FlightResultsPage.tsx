import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../state/BookingContext';
import { filterFlights, searchFlights } from '../services/inventoryService';
import { Flight, FlightFilterState } from '../types';
import { FlightFilters } from '../components/FlightFilters';
import { FlightResults } from '../components/FlightResults';
import { FlightSearchForm } from '../components/FlightSearchForm';
import { formatFriendlyDate } from '../utils/dateUtils';
import { VERSION_CONFIG } from '../config/versionConfig';
import { Plane, Calendar, Users, Sliders, ChevronDown, ChevronUp } from 'lucide-react';

export const FlightResultsPage: React.FC = () => {
  const { state, version, selectFlight } = useBooking();
  const navigate = useNavigate();
  const [showModifyForm, setShowModifyForm] = useState(false);

  const prefix = VERSION_CONFIG[version]?.routePrefix || '/clean-version';
  const { origin, destination, departureDate, returnDate, tripType, passengers, cabinClass } = state.flightSearch;

  // Retrieve base flight search results
  const rawFlights = useMemo(() => {
    return searchFlights(state.flightSearch, version);
  }, [state.flightSearch, version]);

  // Extract airlines present in the raw results
  const availableAirlines = useMemo(() => {
    return Array.from(new Set(rawFlights.map(f => f.airline)));
  }, [rawFlights]);

  const minPrice = useMemo(() => {
    if (rawFlights.length === 0) return 2000;
    return Math.min(...rawFlights.map(f => f.baseFare));
  }, [rawFlights]);

  const maxPriceLimit = useMemo(() => {
    if (rawFlights.length === 0) return 20000;
    return Math.max(...rawFlights.map(f => f.baseFare));
  }, [rawFlights]);

  // Filter state
  const [filters, setFilters] = useState<FlightFilterState>({
    maxPrice: 25000,
    airlines: [],
    stops: [],
    departureTimes: [],
    cabinClass,
  });

  const handleResetFilters = () => {
    setFilters({
      maxPrice: maxPriceLimit,
      airlines: [],
      stops: [],
      departureTimes: [],
      cabinClass,
    });
  };

  // Filtered flights
  const filteredFlights = useMemo(() => {
    return filterFlights(rawFlights, filters, version);
  }, [rawFlights, filters, version]);

  const handleSelectFlight = (flight: Flight) => {
    // If round-trip, find corresponding return flight if available
    let returnFlight: Flight | null = null;
    if (tripType === 'round-trip') {
      const returnSearch = searchFlights(
        {
          ...state.flightSearch,
          origin: destination,
          destination: origin,
        },
        version
      );
      if (returnSearch.length > 0) {
        returnFlight = returnSearch[0];
      }
    }

    selectFlight(flight, returnFlight);
    navigate('/checkout');
  };

  const totalPax = passengers.adults + passengers.children + passengers.infants;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search Bar Overview with Modify toggle */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-voyage-blue-light flex items-center justify-center text-voyage-blue">
                <Plane className="w-4 h-4 -rotate-45" />
              </div>
              <div>
                <span className="text-[11px] text-voyage-muted block uppercase tracking-wider font-semibold">Route</span>
                <span className="font-heading font-extrabold text-navy-900 text-base">
                  {origin} → {destination}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-voyage-muted" />
              <div>
                <span className="text-[11px] text-voyage-muted block uppercase tracking-wider font-semibold">Dates</span>
                <span className="font-medium text-navy-900">
                  {formatFriendlyDate(departureDate)}
                  {tripType === 'round-trip' && returnDate ? ` – ${formatFriendlyDate(returnDate)}` : ' (One-way)'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-voyage-muted" />
              <div>
                <span className="text-[11px] text-voyage-muted block uppercase tracking-wider font-semibold">Travelers</span>
                <span className="font-medium text-navy-900">
                  {totalPax} {totalPax === 1 ? 'Traveler' : 'Travelers'}, {cabinClass}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            data-testid="modify-search-toggle"
            onClick={() => setShowModifyForm(!showModifyForm)}
            className="px-4 py-2 rounded-xl border border-slate-300 hover:border-voyage-blue text-xs font-heading font-bold text-navy-900 hover:text-voyage-blue flex items-center justify-center space-x-1.5 transition-all self-start md:self-auto"
          >
            <span>{showModifyForm ? 'Close Edit' : 'Modify Search'}</span>
            {showModifyForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Expandable Modify Form */}
        {showModifyForm && (
          <div className="mt-5 pt-5 border-t border-slate-200 animate-in fade-in duration-200">
            <FlightSearchForm />
          </div>
        )}
      </div>

      {/* Main Results Layout: Filters (Left) + Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3">
          <FlightFilters
            filters={filters}
            minPrice={minPrice}
            maxPriceLimit={maxPriceLimit}
            availableAirlines={availableAirlines}
            onChange={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Flight Results List */}
        <div className="lg:col-span-8 xl:col-span-9">
          <FlightResults
            flights={filteredFlights}
            onSelectFlight={handleSelectFlight}
            onModifySearch={() => setShowModifyForm(true)}
          />
        </div>
      </div>
    </div>
  );
};
