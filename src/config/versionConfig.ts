import { AppVersion } from '../types';

export interface VersionDefects {
  // Bug Set A (Test Website 1)
  allowReturnBeforeDeparture?: boolean;          // BUG A01
  omitPassengerCategoryInPricing?: boolean;      // BUG A02, A07
  injectInconsistentRouteResult?: boolean;       // BUG A03
  corruptFlightResultsHeading?: boolean;         // BUG A04
  corruptConfirmationDestination?: boolean;      // BUG A05
  corruptConfirmationPassengerCount?: boolean;   // BUG A06
  allowSoldOutRoomBooking?: boolean;             // BUG A08
  allowInvalidHotelDateRange?: boolean;          // BUG A09
  inconsistentRoomAvailabilityDisplay?: boolean; // BUG A10
  corruptHotelBookingSummary?: boolean;          // BUG A11
  corruptBookingDetailsField?: boolean;          // BUG A12

  // Bug Set B (Test Website 2)
  unexpectedReturnDateOverwrite?: boolean;       // BUG B01
  brokenFlightFilters?: boolean;                 // BUG B02
  flightCardPriceMismatch?: boolean;             // BUG B03
  incorrectFlightTaxRate?: boolean;              // BUG B04
  confirmationTotalMismatch?: boolean;           // BUG B05
  incorrectHotelTaxRate?: boolean;               // BUG B06
  allowUnavailableRoomBooking?: boolean;         // BUG B07
  staleSearchResults?: boolean;                  // BUG B08
  inconsistentBookingPricing?: boolean;          // BUG B09
  failRoomAvailabilityConstraint?: boolean;      // BUG B10
  corruptSummaryRoomType?: boolean;              // BUG B11
  allowPastDates?: boolean;                      // BUG B12
}

export const ACTIVE_VERSION: AppVersion = 'test-2';

export const VERSION_CONFIG: Record<AppVersion, { id: AppVersion; routePrefix: string; name: string; badge: string; description: string; isClean: boolean; defects: VersionDefects }> = {
  'clean': {
    id: 'clean',
    routePrefix: '',
    name: 'Voyage Clean Version',
    badge: 'Production / Verified Logic',
    description: 'Fully functional, validated travel reservation system with zero defects and accurate pricing.',
    isClean: true,
    defects: {},
  },
  'test-1': {
    id: 'test-1',
    routePrefix: '',
    name: 'Voyage Test Website 1',
    badge: 'Defect Set A Active',
    description: 'Autonomous QA Test Target exhibiting intentional defects A01 through A12.',
    isClean: false,
    defects: {
      allowReturnBeforeDeparture: true,
      omitPassengerCategoryInPricing: true,
      injectInconsistentRouteResult: true,
      corruptFlightResultsHeading: true,
      corruptConfirmationDestination: true,
      corruptConfirmationPassengerCount: true,
      allowSoldOutRoomBooking: true,
      allowInvalidHotelDateRange: true,
      inconsistentRoomAvailabilityDisplay: true,
      corruptHotelBookingSummary: true,
      corruptBookingDetailsField: true,
    },
  },
  'test-2': {
    id: 'test-2',
    routePrefix: '',
    name: 'Voyage Test Website 2',
    badge: 'Defect Set B Active',
    description: 'Autonomous QA Test Target exhibiting intentional defects B01 through B12.',
    isClean: false,
    defects: {
      unexpectedReturnDateOverwrite: true,
      brokenFlightFilters: true,
      flightCardPriceMismatch: true,
      incorrectFlightTaxRate: true,
      confirmationTotalMismatch: true,
      incorrectHotelTaxRate: true,
      allowUnavailableRoomBooking: true,
      staleSearchResults: true,
      inconsistentBookingPricing: true,
      failRoomAvailabilityConstraint: true,
      corruptSummaryRoomType: true,
      allowPastDates: true,
    },
  },
};

export function getVersionFromPath(_pathname: string): AppVersion {
  return ACTIVE_VERSION;
}

export function getVersionDefects(version: AppVersion = ACTIVE_VERSION): VersionDefects {
  return VERSION_CONFIG[version]?.defects || {};
}
