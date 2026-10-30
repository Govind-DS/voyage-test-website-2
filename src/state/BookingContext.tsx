import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppVersion, BookingState, Flight, FlightSearchParams, GuestDetails, Hotel, HotelSearchParams, PriceBreakdownData, RoomType } from '../types';
import { getVersionDefects, getVersionFromPath } from '../config/versionConfig';
import { getFutureDateString, getTodayString } from '../utils/dateUtils';
import { calculateFlightPrice, calculateHotelPrice } from '../services/pricingService';
import { generateBookingReference, reserveRoomInventory, validateRoomAvailability } from '../services/inventoryService';

interface BookingContextType {
  state: BookingState;
  version: AppVersion;
  setFlightSearchParams: (params: Partial<FlightSearchParams>) => void;
  setHotelSearchParams: (params: Partial<HotelSearchParams>) => void;
  selectFlight: (flight: Flight, returnFlight?: Flight | null) => void;
  selectHotelAndRoom: (hotel: Hotel, room: RoomType, quantity?: number) => void;
  setGuestDetails: (details: Partial<GuestDetails>) => void;
  confirmBooking: () => Promise<boolean>;
  resetBooking: () => void;
  clearError: () => void;
}

const defaultFlightSearch: FlightSearchParams = {
  origin: 'Bengaluru',
  destination: 'Goa',
  departureDate: getFutureDateString(3),
  returnDate: getFutureDateString(7),
  tripType: 'round-trip',
  passengers: { adults: 1, children: 0, infants: 0 },
  cabinClass: 'Economy',
};

const defaultHotelSearch: HotelSearchParams = {
  destination: 'Goa',
  checkInDate: getFutureDateString(3),
  checkOutDate: getFutureDateString(7),
  guests: 2,
  rooms: 1,
};

const defaultGuestDetails: GuestDetails = {
  title: 'Mr',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  specialRequests: '',
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const STORAGE_KEY = 'voyage_booking_session_v1';

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeVersion = getVersionFromPath(location.pathname);

  const [state, setState] = useState<BookingState>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          version: activeVersion,
        };
      }
    } catch {
      // fallback
    }
    return {
      version: activeVersion,
      bookingType: null,
      flightSearch: defaultFlightSearch,
      hotelSearch: defaultHotelSearch,
      selectedFlight: null,
      selectedReturnFlight: null,
      selectedHotel: null,
      selectedRoom: null,
      roomQuantity: 1,
      guestDetails: defaultGuestDetails,
      priceBreakdown: null,
      bookingReference: null,
      bookingDate: null,
      status: 'idle',
      errorMessage: null,
    };
  });

  // Keep version synchronized with the current route
  useEffect(() => {
    setState(prev => {
      if (prev.version !== activeVersion) {
        return { ...prev, version: activeVersion };
      }
      return prev;
    });
  }, [activeVersion]);

  // Persist state to session storage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  }, [state]);

  const setFlightSearchParams = (params: Partial<FlightSearchParams>) => {
    setState(prev => {
      const updated: FlightSearchParams = { ...prev.flightSearch, ...params };
      const defects = getVersionDefects(prev.version);

      // BUG B01: changing departure date unexpectedly overwrites return date
      if (defects.unexpectedReturnDateOverwrite && params.departureDate && params.departureDate !== prev.flightSearch.departureDate) {
        // Overwrite return date with unexpected early date (+1 day from today or past)
        updated.returnDate = getFutureDateString(1);
      }

      return {
        ...prev,
        flightSearch: updated,
      };
    });
  };

  const setHotelSearchParams = (params: Partial<HotelSearchParams>) => {
    setState(prev => ({
      ...prev,
      hotelSearch: { ...prev.hotelSearch, ...params },
    }));
  };

  const selectFlight = (flight: Flight, returnFlight?: Flight | null) => {
    const pricing = calculateFlightPrice(flight, state.flightSearch, state.version, returnFlight);
    setState(prev => ({
      ...prev,
      bookingType: 'flight',
      selectedFlight: flight,
      selectedReturnFlight: returnFlight || null,
      priceBreakdown: pricing,
      status: 'reviewing',
      errorMessage: null,
    }));
  };

  const selectHotelAndRoom = (hotel: Hotel, room: RoomType, quantity = 1) => {
    const defects = getVersionDefects(state.version);
    let effectiveRoom = room;

    // BUG B11: selected room type displayed erroneously as another room
    if (defects.corruptSummaryRoomType && hotel.rooms.length > 0) {
      effectiveRoom = hotel.rooms[0]; // Force standard room
    }

    const pricing = calculateHotelPrice(effectiveRoom, state.hotelSearch, quantity, state.version);
    setState(prev => ({
      ...prev,
      bookingType: 'hotel',
      selectedHotel: hotel,
      selectedRoom: effectiveRoom,
      roomQuantity: quantity,
      priceBreakdown: pricing,
      status: 'reviewing',
      errorMessage: null,
    }));
  };

  const setGuestDetails = (details: Partial<GuestDetails>) => {
    setState(prev => ({
      ...prev,
      guestDetails: { ...prev.guestDetails, ...details },
    }));
  };

  const confirmBooking = async (): Promise<boolean> => {
    const defects = getVersionDefects(state.version);

    if (state.bookingType === 'hotel' && state.selectedHotel && state.selectedRoom) {
      const validation = validateRoomAvailability(
        state.selectedHotel.id,
        state.selectedRoom.id,
        state.roomQuantity,
        state.version
      );
      if (!validation.valid) {
        setState(prev => ({ ...prev, errorMessage: validation.error || 'Room unavailable.' }));
        return false;
      }

      reserveRoomInventory(state.selectedHotel.id, state.selectedRoom.id, state.roomQuantity);
    }

    const bookingRef = generateBookingReference(state.bookingType || 'flight');
    const today = getTodayString();

    let finalPrice = state.priceBreakdown;
    // BUG B05: confirmation total differs from booking review total (adds hidden fee)
    if (defects.confirmationTotalMismatch && finalPrice) {
      finalPrice = {
        ...finalPrice,
        totalAmount: finalPrice.totalAmount + 1500, // Injected mismatch
      };
    }

    let finalGuests = { ...state.guestDetails };
    // BUG A12: corrupt booking confirmation field
    if (defects.corruptBookingDetailsField) {
      finalGuests.email = 'undefined@corrupt.voyage.internal';
    }

    setState(prev => ({
      ...prev,
      priceBreakdown: finalPrice,
      guestDetails: finalGuests,
      bookingReference: bookingRef,
      bookingDate: today,
      status: 'confirmed',
      errorMessage: null,
    }));

    return true;
  };

  const resetBooking = () => {
    setState({
      version: activeVersion,
      bookingType: null,
      flightSearch: defaultFlightSearch,
      hotelSearch: defaultHotelSearch,
      selectedFlight: null,
      selectedReturnFlight: null,
      selectedHotel: null,
      selectedRoom: null,
      roomQuantity: 1,
      guestDetails: defaultGuestDetails,
      priceBreakdown: null,
      bookingReference: null,
      bookingDate: null,
      status: 'idle',
      errorMessage: null,
    });
  };

  const clearError = () => {
    setState(prev => ({ ...prev, errorMessage: null }));
  };

  return (
    <BookingContext.Provider
      value={{
        state,
        version: activeVersion,
        setFlightSearchParams,
        setHotelSearchParams,
        selectFlight,
        selectHotelAndRoom,
        setGuestDetails,
        confirmBooking,
        resetBooking,
        clearError,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
