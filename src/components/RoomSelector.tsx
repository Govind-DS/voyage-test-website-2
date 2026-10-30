import React, { useState } from 'react';
import { Hotel, RoomType } from '../types';
import { useBooking } from '../state/BookingContext';
import { getVersionDefects } from '../config/versionConfig';
import { getDisplayedRoomAvailability } from '../services/inventoryService';
import { formatINR } from '../utils/currencyUtils';
import { Users, Bed, Check, ShieldCheck, AlertCircle, X, ChevronRight } from 'lucide-react';

interface RoomSelectorProps {
  hotel: Hotel;
  onSelectRoom: (room: RoomType, quantity: number) => void;
  onClose: () => void;
}

export const RoomSelector: React.FC<RoomSelectorProps> = ({
  hotel,
  onSelectRoom,
  onClose,
}) => {
  const { version, state } = useBooking();
  const defects = getVersionDefects(version);
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});

  const handleQuantityChange = (roomId: string, qty: number) => {
    setSelectedQuantities(prev => ({ ...prev, [roomId]: qty }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-floating border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="font-heading font-extrabold text-xl text-navy-900 tracking-tight">
              Select Room — {hotel.name}
            </h2>
            <p className="text-xs text-voyage-muted mt-0.5">
              {hotel.city} • {state.hotelSearch.guests} Guests • Dates: {state.hotelSearch.checkInDate} to {state.hotelSearch.checkOutDate}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-navy-900 hover:bg-slate-100 transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Rooms List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {hotel.rooms.map(room => {
            const displayedAvailable = getDisplayedRoomAvailability(room, version);
            const isSoldOut = displayedAvailable <= 0;

            // BUG A08 & B07: in test versions, allow selecting sold out rooms
            const canBook = !isSoldOut || defects.allowSoldOutRoomBooking || defects.allowUnavailableRoomBooking;

            const quantity = selectedQuantities[room.id] || 1;

            // BUG B10: in clean version, options are 1..availableRooms; in Test 2, options allow up to 4 regardless of availability
            const maxSelectable = defects.failRoomAvailabilityConstraint
              ? 4
              : Math.min(4, Math.max(1, room.availableRooms));

            return (
              <div
                key={room.id}
                data-testid="room-option"
                data-room-id={room.id}
                className={`rounded-2xl border p-5 transition-all ${
                  isSoldOut && !canBook
                    ? 'border-slate-200 bg-slate-50/70 opacity-75'
                    : 'border-slate-200 bg-white hover:border-voyage-blue/40 shadow-sm'
                }`}
              >
                <div className="flex flex-col md:flex-row gap-5 justify-between">
                  {/* Room Image & Specs */}
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="w-full sm:w-44 h-32 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-heading font-bold text-base text-navy-900">
                          {room.name}
                        </h3>
                        {isSoldOut ? (
                          <span
                            data-testid="sold-out-badge"
                            className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wider"
                          >
                            Sold Out
                          </span>
                        ) : (
                          <span
                            data-testid="room-availability"
                            className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold"
                          >
                            {displayedAvailable} {displayedAvailable === 1 ? 'room left' : 'rooms left'}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-voyage-muted mt-2">
                        <span className="flex items-center space-x-1">
                          <Users className="w-3.5 h-3.5 text-voyage-blue" />
                          <span>Max {room.capacity} guests</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Bed className="w-3.5 h-3.5 text-voyage-blue" />
                          <span>{room.bedType}</span>
                        </span>
                        <span>•</span>
                        <span>{room.size}</span>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {room.amenities.map(a => (
                          <span
                            key={a}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                          >
                            {a}
                          </span>
                        ))}
                      </div>

                      <p className="text-[11px] text-emerald-700 font-medium flex items-center space-x-1 mt-2.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{room.cancellationPolicy}</span>
                      </p>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="flex md:flex-col items-end justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 min-w-[160px] text-right">
                    <div>
                      <span className="font-heading font-extrabold text-2xl text-navy-900 text-voyage-blue block">
                        {formatINR(room.pricePerNight)}
                      </span>
                      <span className="text-[11px] text-voyage-muted block -mt-0.5">
                        per night (excl. tax)
                      </span>
                    </div>

                    <div className="mt-3 flex items-center space-x-2">
                      <select
                        data-testid="room-quantity-select"
                        value={quantity}
                        onChange={e => handleQuantityChange(room.id, Number(e.target.value))}
                        disabled={!canBook}
                        className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 focus:border-voyage-blue"
                      >
                        {Array.from({ length: maxSelectable }, (_, i) => i + 1).map(n => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'Room' : 'Rooms'}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        data-testid="select-room-btn"
                        disabled={!canBook}
                        onClick={() => onSelectRoom(room, quantity)}
                        className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all shadow-sm flex items-center space-x-1 ${
                          !canBook
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-navy-900 hover:bg-voyage-blue text-white'
                        }`}
                      >
                        <span>Select</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
