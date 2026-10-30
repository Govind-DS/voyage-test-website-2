import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, Calendar, MapPin, PlaneTakeoff, Search, AlertTriangle } from 'lucide-react';
import { useBooking } from '../state/BookingContext';
import { CITIES } from '../data/flights';
import { CabinClass, PassengerCounts, TripType } from '../types';
import { PassengerSelector } from './PassengerSelector';
import { validateFlightSearch } from '../utils/validation';
import { VERSION_CONFIG } from '../config/versionConfig';
import { getTodayString } from '../utils/dateUtils';

export const FlightSearchForm: React.FC = () => {
  const { state, version, setFlightSearchParams } = useBooking();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const prefix = VERSION_CONFIG[version]?.routePrefix || '/clean-version';
  const { origin, destination, departureDate, returnDate, tripType, passengers, cabinClass } = state.flightSearch;

  const handleTripTypeChange = (newType: TripType) => {
    setFlightSearchParams({ tripType: newType });
  };

  const handleSwapCities = () => {
    setFlightSearchParams({
      origin: destination,
      destination: origin,
    });
  };

  const handleOriginChange = (val: string) => {
    setFlightSearchParams({ origin: val });
    setErrorMsg(null);
  };

  const handleDestinationChange = (val: string) => {
    setFlightSearchParams({ destination: val });
    setErrorMsg(null);
  };

  const handleDepartureChange = (date: string) => {
    setFlightSearchParams({ departureDate: date });
    setErrorMsg(null);
  };

  const handleReturnChange = (date: string) => {
    setFlightSearchParams({ returnDate: date });
    setErrorMsg(null);
  };

  const handlePassengerChange = (counts: PassengerCounts, cabin: CabinClass) => {
    setFlightSearchParams({ passengers: counts, cabinClass: cabin });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateFlightSearch(state.flightSearch, version);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setErrorMsg(firstError);
      return;
    }

    setErrorMsg(null);
    navigate('/flights');
  };

  const todayStr = getTodayString();

  return (
    <form
      data-testid="flight-search-form"
      onSubmit={handleSearchSubmit}
      className="space-y-4"
    >
      {/* Trip Type Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
          <button
            type="button"
            data-testid="trip-type-round"
            onClick={() => handleTripTypeChange('round-trip')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tripType === 'round-trip'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-voyage-muted hover:text-navy-900'
            }`}
          >
            Round-trip
          </button>
          <button
            type="button"
            data-testid="trip-type-oneway"
            onClick={() => handleTripTypeChange('one-way')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tripType === 'one-way'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-voyage-muted hover:text-navy-900'
            }`}
          >
            One-way
          </button>
        </div>

        <span className="text-xs text-voyage-muted hidden sm:inline-block">
          All flights simulated with verified scheduled carrier data
        </span>
      </div>

      {/* Main Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        {/* Origin City */}
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-voyage-muted uppercase tracking-wider mb-1.5">
            Flying From
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-voyage-blue">
              <PlaneTakeoff className="w-4 h-4" />
            </div>
            <select
              data-testid="origin-select"
              value={origin}
              onChange={e => handleOriginChange(e.target.value)}
              className="w-full pl-10 pr-8 py-3 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-navy-900 focus:border-voyage-blue focus:ring-2 focus:ring-voyage-blue/20 transition-all appearance-none cursor-pointer"
            >
              {CITIES.map(c => (
                <option key={c.code} value={c.name}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="hidden md:flex md:col-span-1 items-center justify-center pb-2">
          <button
            type="button"
            data-testid="swap-cities-btn"
            onClick={handleSwapCities}
            title="Swap Origin and Destination"
            className="w-9 h-9 rounded-full border border-slate-300 bg-white hover:bg-voyage-blue-light hover:text-voyage-blue text-navy-900 flex items-center justify-center transition-all shadow-sm"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* Destination City */}
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-voyage-muted uppercase tracking-wider mb-1.5">
            Flying To
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-voyage-orange">
              <MapPin className="w-4 h-4" />
            </div>
            <select
              data-testid="destination-select"
              value={destination}
              onChange={e => handleDestinationChange(e.target.value)}
              className="w-full pl-10 pr-8 py-3 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-navy-900 focus:border-voyage-blue focus:ring-2 focus:ring-voyage-blue/20 transition-all appearance-none cursor-pointer"
            >
              {CITIES.map(c => (
                <option key={c.code} value={c.name}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Departure Date */}
        <div className={tripType === 'round-trip' ? 'md:col-span-2' : 'md:col-span-3'}>
          <label className="block text-xs font-semibold text-voyage-muted uppercase tracking-wider mb-1.5">
            Departure
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-voyage-muted">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              type="date"
              data-testid="departure-date"
              value={departureDate}
              min={todayStr}
              onChange={e => handleDepartureChange(e.target.value)}
              className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-300 bg-white text-sm font-medium text-navy-900 focus:border-voyage-blue focus:ring-2 focus:ring-voyage-blue/20 transition-all cursor-pointer"
            />
          </div>
        </div>

        {/* Return Date (if round-trip) */}
        {tripType === 'round-trip' && (
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-voyage-muted uppercase tracking-wider mb-1.5">
              Return
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-voyage-muted">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                data-testid="return-date"
                value={returnDate || ''}
                onChange={e => handleReturnChange(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-300 bg-white text-sm font-medium text-navy-900 focus:border-voyage-blue focus:ring-2 focus:ring-voyage-blue/20 transition-all cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Secondary Row: Passengers & Action */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end pt-1">
        <div className="md:col-span-6 lg:col-span-5">
          <PassengerSelector
            passengers={passengers}
            cabinClass={cabinClass}
            onChange={handlePassengerChange}
          />
        </div>

        <div className="md:col-span-6 lg:col-span-7 flex justify-end">
          <button
            type="submit"
            data-testid="search-flights-btn"
            className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-voyage-blue hover:bg-voyage-blue-hover text-white font-heading font-bold text-sm shadow-premium hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Search Flights</span>
          </button>
        </div>
      </div>

      {/* Error Message Alert */}
      {errorMsg && (
        <div
          data-testid="search-error-banner"
          className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2 animate-in fade-in duration-200"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}
    </form>
  );
};
