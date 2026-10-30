import React from 'react';
import { FlightFilterState } from '../types';
import { formatINR } from '../utils/currencyUtils';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';

interface FlightFiltersProps {
  filters: FlightFilterState;
  minPrice: number;
  maxPriceLimit: number;
  availableAirlines: string[];
  onChange: (filters: FlightFilterState) => void;
  onReset: () => void;
}

export const FlightFilters: React.FC<FlightFiltersProps> = ({
  filters,
  minPrice,
  maxPriceLimit,
  availableAirlines,
  onChange,
  onReset,
}) => {
  const handlePriceChange = (val: number) => {
    onChange({ ...filters, maxPrice: val });
  };

  const handleAirlineToggle = (airline: string) => {
    const next = filters.airlines.includes(airline)
      ? filters.airlines.filter(a => a !== airline)
      : [...filters.airlines, airline];
    onChange({ ...filters, airlines: next });
  };

  const handleStopsToggle = (stops: number) => {
    const next = filters.stops.includes(stops)
      ? filters.stops.filter(s => s !== stops)
      : [...filters.stops, stops];
    onChange({ ...filters, stops: next });
  };

  const handleDepartureToggle = (timeSlot: string) => {
    const next = filters.departureTimes.includes(timeSlot)
      ? filters.departureTimes.filter(t => t !== timeSlot)
      : [...filters.departureTimes, timeSlot];
    onChange({ ...filters, departureTimes: next });
  };

  return (
    <div
      data-testid="flight-filters"
      className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6 shadow-sm sticky top-28"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-voyage-blue" />
          <h2 className="font-heading font-bold text-sm text-navy-900">Filters</h2>
        </div>
        <button
          type="button"
          data-testid="reset-filters"
          onClick={onReset}
          className="text-xs font-semibold text-voyage-blue hover:text-navy-900 flex items-center space-x-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Max Price Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-semibold text-navy-900">Max Base Price</label>
          <span className="text-xs font-bold text-voyage-blue">
            {formatINR(filters.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          data-testid="price-filter"
          min={minPrice}
          max={maxPriceLimit}
          step={200}
          value={filters.maxPrice}
          onChange={e => handlePriceChange(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-voyage-blue"
        />
        <div className="flex justify-between text-[11px] text-voyage-muted mt-1">
          <span>{formatINR(minPrice)}</span>
          <span>{formatINR(maxPriceLimit)}</span>
        </div>
      </div>

      {/* Stops */}
      <div>
        <label className="text-xs font-semibold text-navy-900 block mb-2.5">Stops</label>
        <div className="space-y-2" data-testid="stops-filter">
          <label className="flex items-center space-x-2.5 text-xs text-navy-900 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.stops.includes(0)}
              onChange={() => handleStopsToggle(0)}
              className="rounded border-slate-300 text-voyage-blue focus:ring-voyage-blue/30 w-4 h-4 cursor-pointer"
            />
            <span>Non-stop only</span>
          </label>
          <label className="flex items-center space-x-2.5 text-xs text-navy-900 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.stops.includes(1)}
              onChange={() => handleStopsToggle(1)}
              className="rounded border-slate-300 text-voyage-blue focus:ring-voyage-blue/30 w-4 h-4 cursor-pointer"
            />
            <span>1 Stop</span>
          </label>
        </div>
      </div>

      {/* Airlines */}
      <div>
        <label className="text-xs font-semibold text-navy-900 block mb-2.5">Airlines</label>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1" data-testid="airline-filter">
          {availableAirlines.map(airline => (
            <label
              key={airline}
              className="flex items-center justify-between text-xs text-navy-900 cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <input
                  type="checkbox"
                  checked={filters.airlines.includes(airline)}
                  onChange={() => handleAirlineToggle(airline)}
                  className="rounded border-slate-300 text-voyage-blue focus:ring-voyage-blue/30 w-4 h-4 cursor-pointer"
                />
                <span>{airline}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Departure Time */}
      <div>
        <label className="text-xs font-semibold text-navy-900 block mb-2.5">Departure Time</label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'morning', label: 'Morning', time: '05–12h' },
            { id: 'afternoon', label: 'Afternoon', time: '12–18h' },
            { id: 'evening', label: 'Evening', time: '18–24h' },
          ].map(slot => (
            <button
              key={slot.id}
              type="button"
              onClick={() => handleDepartureToggle(slot.id)}
              className={`p-2 rounded-xl text-center border transition-all ${
                filters.departureTimes.includes(slot.id)
                  ? 'border-voyage-blue bg-voyage-blue-light text-voyage-blue font-semibold'
                  : 'border-slate-200 bg-white text-navy-900 hover:bg-slate-50'
              }`}
            >
              <span className="block text-[11px] font-medium">{slot.label}</span>
              <span className="block text-[10px] text-voyage-muted">{slot.time}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
