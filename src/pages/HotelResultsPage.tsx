import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../state/BookingContext';
import { searchHotels } from '../services/inventoryService';
import { Hotel, RoomType } from '../types';
import { HotelCard } from '../components/HotelCard';
import { RoomSelector } from '../components/RoomSelector';
import { HotelSearchForm } from '../components/HotelSearchForm';
import { formatFriendlyDate, calculateNights } from '../utils/dateUtils';
import { VERSION_CONFIG } from '../config/versionConfig';
import { Building2, Calendar, Users, ChevronDown, ChevronUp } from 'lucide-react';

export const HotelResultsPage: React.FC = () => {
  const { state, version, selectHotelAndRoom } = useBooking();
  const navigate = useNavigate();
  const [selectedHotelForRooms, setSelectedHotelForRooms] = useState<Hotel | null>(null);
  const [showModifyForm, setShowModifyForm] = useState(false);

  const prefix = VERSION_CONFIG[version]?.routePrefix || '/clean-version';
  const { destination, checkInDate, checkOutDate, guests, rooms } = state.hotelSearch;

  // Retrieve hotel properties matching destination
  const hotels = useMemo(() => {
    return searchHotels(state.hotelSearch);
  }, [state.hotelSearch]);

  const handleSelectRoom = (room: RoomType, quantity: number) => {
    if (!selectedHotelForRooms) return;
    selectHotelAndRoom(selectedHotelForRooms, room, quantity);
    setSelectedHotelForRooms(null);
    navigate('/checkout');
  };

  const nights = calculateNights(checkInDate, checkOutDate);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Search Overview Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-voyage-orange/10 flex items-center justify-center text-voyage-orange">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-voyage-muted block uppercase tracking-wider font-semibold">Destination</span>
                <span className="font-heading font-extrabold text-navy-900 text-base">
                  Stays in {destination}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-voyage-muted" />
              <div>
                <span className="text-[11px] text-voyage-muted block uppercase tracking-wider font-semibold">Duration</span>
                <span className="font-medium text-navy-900">
                  {formatFriendlyDate(checkInDate)} – {formatFriendlyDate(checkOutDate)} ({nights} {nights === 1 ? 'Night' : 'Nights'})
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-voyage-muted" />
              <div>
                <span className="text-[11px] text-voyage-muted block uppercase tracking-wider font-semibold">Occupancy</span>
                <span className="font-medium text-navy-900">
                  {guests} {guests === 1 ? 'Guest' : 'Guests'}, {rooms} {rooms === 1 ? 'Room' : 'Rooms'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            data-testid="modify-hotel-search-toggle"
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
            <HotelSearchForm />
          </div>
        )}
      </div>

      {/* Hotel Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-navy-900 tracking-tight">
            Curated Stays in {destination}
          </h1>
          <p className="text-xs text-voyage-muted mt-0.5">
            {hotels.length} verified luxury resort & boutique options available
          </p>
        </div>
      </div>

      {/* Hotel Cards List */}
      {hotels.length > 0 ? (
        <div className="space-y-5" data-testid="hotel-results">
          {hotels.map(hotel => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onViewRooms={setSelectedHotelForRooms}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div
          data-testid="no-hotels-empty-state"
          className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-voyage-orange/10 text-voyage-orange flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="font-heading font-bold text-lg text-navy-900">
            No properties found in {destination}
          </h2>
          <p className="text-sm text-voyage-muted max-w-md mx-auto mt-1 mb-6">
            We currently do not have simulated properties in this destination. Try searching for Goa, Bengaluru, New Delhi, Mumbai, Kochi, or Dubai.
          </p>
          <button
            type="button"
            onClick={() => setShowModifyForm(true)}
            className="px-6 py-2.5 rounded-xl bg-voyage-blue hover:bg-voyage-blue-hover text-white text-xs font-bold font-heading transition-all shadow-sm"
          >
            Choose Another Destination
          </button>
        </div>
      )}

      {/* Room Selection Modal */}
      {selectedHotelForRooms && (
        <RoomSelector
          hotel={selectedHotelForRooms}
          onSelectRoom={handleSelectRoom}
          onClose={() => setSelectedHotelForRooms(null)}
        />
      )}
    </div>
  );
};
