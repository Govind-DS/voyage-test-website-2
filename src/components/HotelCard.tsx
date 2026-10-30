import React from 'react';
import { Hotel } from '../types';
import { formatINR } from '../utils/currencyUtils';
import { Star, MapPin, ChevronRight, Check } from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
  onViewRooms: (hotel: Hotel) => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onViewRooms }) => {
  // Lowest starting price among rooms
  const minPrice = Math.min(...hotel.rooms.map(r => r.pricePerNight));

  return (
    <div
      data-testid="hotel-card"
      data-hotel-id={hotel.id}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-card hover:border-voyage-blue/40 transition-all duration-200 flex flex-col md:flex-row group"
    >
      {/* Property Image with Rating Overlay */}
      <div className="relative md:w-80 h-56 md:h-auto shrink-0 overflow-hidden bg-slate-100">
        <img
          src={hotel.images[0]}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-xl shadow-sm flex items-center space-x-1.5 border border-slate-100">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-navy-900" data-testid="hotel-rating">
            {hotel.rating}
          </span>
          <span className="text-[10px] text-voyage-muted">({hotel.reviewCount})</span>
        </div>
        <div className="absolute bottom-3 left-3 bg-navy-900/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
          {hotel.city}
        </div>
      </div>

      {/* Property Information */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3
                data-testid="hotel-name"
                className="font-heading font-extrabold text-lg text-navy-900 group-hover:text-voyage-blue transition-colors"
              >
                {hotel.name}
              </h3>
              <p className="text-xs text-voyage-muted flex items-center space-x-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-voyage-orange shrink-0" />
                <span>{hotel.location}</span>
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
            {hotel.description}
          </p>

          {/* Amenities tags */}
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            {hotel.amenities.slice(0, 4).map(amenity => (
              <span
                key={amenity}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-voyage-text text-[11px] font-medium flex items-center space-x-1"
              >
                <Check className="w-3 h-3 text-emerald-600" />
                <span>{amenity}</span>
              </span>
            ))}
            {hotel.amenities.length > 4 && (
              <span className="px-2 py-1 rounded-lg bg-slate-50 text-voyage-muted text-[10px] font-medium">
                +{hotel.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Footer: Price & CTA */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-voyage-muted block">Rates starting from</span>
            <span
              data-testid="hotel-price"
              className="font-heading font-black text-2xl text-navy-900 tracking-tight"
            >
              {formatINR(minPrice)}
              <span className="text-xs font-normal text-voyage-muted ml-1">/ night</span>
            </span>
          </div>

          <button
            type="button"
            data-testid="view-rooms-btn"
            onClick={() => onViewRooms(hotel)}
            className="px-5 py-2.5 rounded-xl bg-voyage-blue hover:bg-voyage-blue-hover text-white text-xs font-heading font-bold shadow-sm transition-all flex items-center space-x-1.5 group/btn"
          >
            <span>View Rooms</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
