import React, { useState, useRef, useEffect } from 'react';
import { CabinClass, PassengerCounts } from '../types';
import { Users, Plus, Minus, Check } from 'lucide-react';

interface PassengerSelectorProps {
  passengers: PassengerCounts;
  cabinClass: CabinClass;
  onChange: (passengers: PassengerCounts, cabinClass: CabinClass) => void;
}

export const PassengerSelector: React.FC<PassengerSelectorProps> = ({
  passengers,
  cabinClass,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  const handleUpdate = (field: keyof PassengerCounts, delta: number) => {
    const updated = { ...passengers };
    const nextVal = updated[field] + delta;

    if (field === 'adults') {
      if (nextVal >= 1 && nextVal <= 9) updated.adults = nextVal;
    } else if (field === 'children') {
      if (nextVal >= 0 && nextVal <= 8) updated.children = nextVal;
    } else if (field === 'infants') {
      if (nextVal >= 0 && nextVal <= updated.adults) updated.infants = nextVal;
    }

    onChange(updated, cabinClass);
  };

  const handleCabinChange = (newCabin: CabinClass) => {
    onChange(passengers, newCabin);
  };

  const passengerLabel = `${totalPassengers} ${totalPassengers === 1 ? 'Traveler' : 'Travelers'}, ${cabinClass}`;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-voyage-muted uppercase tracking-wider mb-1.5">
        Passengers & Cabin
      </label>
      <button
        type="button"
        data-testid="passenger-selector"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl border border-slate-300 bg-white hover:border-voyage-blue focus:border-voyage-blue focus:ring-2 focus:ring-voyage-blue/20 transition-all text-left"
      >
        <div className="flex items-center space-x-2.5 truncate">
          <Users className="w-4 h-4 text-voyage-blue shrink-0" />
          <span className="text-sm font-medium text-navy-900 truncate" data-testid="passenger-label">
            {passengerLabel}
          </span>
        </div>
      </button>

      {isOpen && (
        <div
          data-testid="passenger-dropdown-panel"
          className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-floating border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="space-y-4">
            {/* Adults */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <p className="text-sm font-semibold text-navy-900">Adults</p>
                <p className="text-xs text-voyage-muted">Age 12+ years</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  data-testid="adults-dec"
                  disabled={passengers.adults <= 1}
                  onClick={() => handleUpdate('adults', -1)}
                  className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-navy-900 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-5 text-center text-sm font-bold text-navy-900" data-testid="adults-count">
                  {passengers.adults}
                </span>
                <button
                  type="button"
                  data-testid="adults-inc"
                  disabled={totalPassengers >= 9}
                  onClick={() => handleUpdate('adults', 1)}
                  className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-navy-900 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <p className="text-sm font-semibold text-navy-900">Children</p>
                <p className="text-xs text-voyage-muted">Age 2–11 years</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  data-testid="children-dec"
                  disabled={passengers.children <= 0}
                  onClick={() => handleUpdate('children', -1)}
                  className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-navy-900 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-5 text-center text-sm font-bold text-navy-900" data-testid="children-count">
                  {passengers.children}
                </span>
                <button
                  type="button"
                  data-testid="children-inc"
                  disabled={totalPassengers >= 9}
                  onClick={() => handleUpdate('children', 1)}
                  className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-navy-900 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Infants */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <p className="text-sm font-semibold text-navy-900">Infants</p>
                <p className="text-xs text-voyage-muted">Under 2 years (on lap)</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  data-testid="infants-dec"
                  disabled={passengers.infants <= 0}
                  onClick={() => handleUpdate('infants', -1)}
                  className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-navy-900 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-5 text-center text-sm font-bold text-navy-900" data-testid="infants-count">
                  {passengers.infants}
                </span>
                <button
                  type="button"
                  data-testid="infants-inc"
                  disabled={passengers.infants >= passengers.adults}
                  onClick={() => handleUpdate('infants', 1)}
                  className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-navy-900 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Cabin Class */}
            <div>
              <p className="text-xs font-semibold text-voyage-muted uppercase tracking-wider mb-2">
                Cabin Class
              </p>
              <div className="grid grid-cols-3 gap-1.5" data-testid="cabin-selector">
                {(['Economy', 'Premium Economy', 'Business'] as CabinClass[]).map(cabin => (
                  <button
                    key={cabin}
                    type="button"
                    onClick={() => handleCabinChange(cabin)}
                    className={`px-2 py-2 text-xs font-medium rounded-lg text-center transition-all ${
                      cabinClass === cabin
                        ? 'bg-voyage-blue text-white shadow-sm font-semibold'
                        : 'bg-slate-100 text-voyage-text hover:bg-slate-200'
                    }`}
                  >
                    {cabin}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full mt-2 py-2.5 rounded-xl bg-navy-900 text-white text-xs font-semibold hover:bg-navy-800 transition-colors flex items-center justify-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
