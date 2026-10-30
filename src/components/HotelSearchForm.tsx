import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Calendar, MapPin, Search, Users, AlertTriangle, BedDouble } from 'lucide-react';
import { useBooking } from '../state/BookingContext';
import { validateHotelSearch } from '../utils/validation';
import { VERSION_CONFIG } from '../config/versionConfig';
import { getTodayString } from '../utils/dateUtils';

export const HotelSearchForm: React.FC = () => {
  const { state, version, setHotelSearchParams } = useBooking();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const prefix = VERSION_CONFIG[version]?.routePrefix || '/clean-version';
  const { destination, checkInDate, checkOutDate, guests, rooms } = state.hotelSearch;

  const HOTEL_CITIES = ['Goa', 'Bengaluru', 'New Delhi', 'Mumbai', 'Kochi', 'Dubai'];

  const handleDestinationChange = (val: string) => {
    setHotelSearchParams({ destination: val });
    setErrorMsg(null);
  };

  const handleCheckInChange = (date: string) => {
    setHotelSearchParams({ checkInDate: date });
    setErrorMsg(null);
  };

  const handleCheckOutChange = (date: string) => {
    setHotelSearchParams({ checkOutDate: date });
    setErrorMsg(null);
  };

  const handleGuestsChange = (val: number) => {
    setHotelSearchParams({ guests: val });
  };

  const handleRoomsChange = (val: number) => {
    setHotelSearchParams({ rooms: val });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateHotelSearch(state.hotelSearch, version);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setErrorMsg(firstError);
      return;
    }

    setErrorMsg(null);
    navigate('/hotels');
  };

  const todayStr = getTodayString();

  return (
    <form
      data-testid="hotel-search-form"
      onSubmit={handleSearchSubmit}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        {/* Destination */}
        <div className="md:col-span-4">
          <label className="block text-xs font-semibold text-voyage-muted uppercase tracking-wider mb-1.5">
            Destination City
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-voyage-blue">
              <MapPin className="w-4 h-4" />
            </div>
            <select
              data-testid="hotel-destination-select"
              value={destination}
              onChange={e => handleDestinationChange(e.target.value)}
              className="w-full pl-10 pr-8 py-3 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-navy-900 focus:border-voyage-blue focus:ring-2 focus:ring-voyage-blue/20 transition-all appearance-none cursor-pointer"
            >
              {HOTEL_CITIES.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Check-in Date */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-voyage-muted uppercase tracking-wider mb-1.5">
            Check-in
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-voyage-muted">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              type="date"
              data-testid="check-in-date"
              value={checkInDate}
              min={todayStr}
              onChange={e => handleCheckInChange(e.target.value)}
              className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-300 bg-white text-sm font-medium text-navy-900 focus:border-voyage-blue focus:ring-2 focus:ring-voyage-blue/20 transition-all cursor-pointer"
            />
          </div>
        </div>

        {/* Check-out Date */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-voyage-muted uppercase tracking-wider mb-1.5">
            Check-out
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-voyage-muted">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              type="date"
              data-testid="check-out-date"
              value={checkOutDate}
              onChange={e => handleCheckOutChange(e.target.value)}
              className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-300 bg-white text-sm font-medium text-navy-900 focus:border-voyage-blue focus:ring-2 focus:ring-voyage-blue/20 transition-all cursor-pointer"
            />
          </div>
        </div>

        {/* Guests & Rooms */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-voyage-muted uppercase tracking-wider mb-1.5">
            Guests
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-voyage-muted">
              <Users className="w-4 h-4" />
            </div>
            <select
              data-testid="guests-select"
              value={guests}
              onChange={e => handleGuestsChange(Number(e.target.value))}
              className="w-full pl-9 pr-6 py-3 rounded-xl border border-slate-300 bg-white text-sm font-medium text-navy-900 focus:border-voyage-blue transition-all cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-voyage-muted uppercase tracking-wider mb-1.5">
            Rooms
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-voyage-muted">
              <BedDouble className="w-4 h-4" />
            </div>
            <select
              data-testid="rooms-select"
              value={rooms}
              onChange={e => handleRoomsChange(Number(e.target.value))}
              className="w-full pl-9 pr-6 py-3 rounded-xl border border-slate-300 bg-white text-sm font-medium text-navy-900 focus:border-voyage-blue transition-all cursor-pointer"
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Room' : 'Rooms'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          data-testid="search-hotels-btn"
          className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-voyage-blue hover:bg-voyage-blue-hover text-white font-heading font-bold text-sm shadow-premium hover:shadow-lg transition-all flex items-center justify-center space-x-2"
        >
          <Search className="w-4 h-4" />
          <span>Search Stays</span>
        </button>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div
          data-testid="hotel-error-banner"
          className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2 animate-in fade-in duration-200"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}
    </form>
  );
};
