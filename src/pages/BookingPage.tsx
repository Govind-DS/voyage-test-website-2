import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../state/BookingContext';
import { BookingSummary } from '../components/BookingSummary';
import { validateGuestDetails } from '../utils/validation';
import { VERSION_CONFIG } from '../config/versionConfig';
import { User, Mail, Phone, ArrowLeft, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';

export const BookingPage: React.FC = () => {
  const { state, version, setGuestDetails, confirmBooking, clearError } = useBooking();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const prefix = VERSION_CONFIG[version]?.routePrefix || '/clean-version';
  const { guestDetails, bookingType, selectedFlight, selectedHotel, errorMessage } = state;

  if (!selectedFlight && !selectedHotel) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        <h2 className="font-heading font-bold text-lg text-navy-900">No Booking Selection Active</h2>
        <p className="text-xs text-voyage-muted mt-1 mb-6">
          Please select a flight or hotel stay before proceeding to the checkout review.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl bg-voyage-blue text-white text-xs font-bold"
        >
          Browse Flights & Stays
        </button>
      </div>
    );
  }

  const handleChange = (field: keyof typeof guestDetails, val: string) => {
    setGuestDetails({ [field]: val });
    if (formErrors[field]) {
      setFormErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Validate guest details
    const validation = validateGuestDetails(guestDetails);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    const success = await confirmBooking();
    setIsSubmitting(false);

    if (success) {
      navigate('/confirmation');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-voyage-muted hover:text-navy-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Results</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Guest Details Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center space-x-3 pb-5 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-voyage-blue-light text-voyage-blue flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-heading font-extrabold text-xl text-navy-900 tracking-tight">
                  Lead Guest & Passenger Details
                </h1>
                <p className="text-xs text-voyage-muted">
                  Booking vouchers and confirmation will be issued to this traveler.
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmSubmit} className="mt-6 space-y-4">
              {/* Title & Names */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-voyage-muted uppercase tracking-wider mb-1.5">
                    Title
                  </label>
                  <select
                    value={guestDetails.title}
                    onChange={e => handleChange('title', e.target.value)}
                    className="w-full px-3 py-3 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-navy-900 focus:border-voyage-blue focus:ring-1 focus:ring-voyage-blue"
                  >
                    <option value="Mr">Mr.</option>
                    <option value="Ms">Ms.</option>
                    <option value="Mrs">Mrs.</option>
                    <option value="Dr">Dr.</option>
                  </select>
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-semibold text-voyage-muted uppercase tracking-wider mb-1.5">
                    First Name *
                  </label>
                  <input
                    type="text"
                    data-testid="guest-first-name"
                    value={guestDetails.firstName}
                    placeholder="e.g. Rahul"
                    onChange={e => handleChange('firstName', e.target.value)}
                    className={`w-full px-3.5 py-3 rounded-xl border text-sm font-medium text-navy-900 focus:ring-2 focus:ring-voyage-blue/20 transition-all ${
                      formErrors.firstName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.firstName && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.firstName}</span>
                  )}
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-xs font-semibold text-voyage-muted uppercase tracking-wider mb-1.5">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    data-testid="guest-last-name"
                    value={guestDetails.lastName}
                    placeholder="e.g. Sharma"
                    onChange={e => handleChange('lastName', e.target.value)}
                    className={`w-full px-3.5 py-3 rounded-xl border text-sm font-medium text-navy-900 focus:ring-2 focus:ring-voyage-blue/20 transition-all ${
                      formErrors.lastName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.lastName && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.lastName}</span>
                  )}
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-voyage-muted uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-voyage-muted">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      data-testid="guest-email"
                      value={guestDetails.email}
                      placeholder="rahul.sharma@example.com"
                      onChange={e => handleChange('email', e.target.value)}
                      className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm font-medium text-navy-900 focus:ring-2 focus:ring-voyage-blue/20 transition-all ${
                        formErrors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {formErrors.email && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.email}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-voyage-muted uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-voyage-muted">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      data-testid="guest-phone"
                      value={guestDetails.phone}
                      placeholder="+91 98765 43210"
                      onChange={e => handleChange('phone', e.target.value)}
                      className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm font-medium text-navy-900 focus:ring-2 focus:ring-voyage-blue/20 transition-all ${
                        formErrors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {formErrors.phone && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.phone}</span>
                  )}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-semibold text-voyage-muted uppercase tracking-wider mb-1.5">
                  Special Requests (Optional)
                </label>
                <textarea
                  rows={2}
                  value={guestDetails.specialRequests || ''}
                  placeholder="e.g. Vegetarian meal, high floor room, quiet room..."
                  onChange={e => handleChange('specialRequests', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-navy-900 focus:border-voyage-blue focus:ring-2 focus:ring-voyage-blue/20 transition-all"
                />
              </div>

              {/* Error Message Alert */}
              {errorMessage && (
                <div
                  data-testid="booking-error-banner"
                  className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2 animate-in fade-in duration-200"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Simulated Notice */}
              <div className="p-4 rounded-2xl bg-voyage-blue-light/60 border border-voyage-blue/20 text-xs text-voyage-blue flex items-center space-x-2.5">
                <ShieldCheck className="w-5 h-5 shrink-0 text-voyage-blue" />
                <span>
                  <strong>Simulated Checkout:</strong> No credit card or live payment information is required. Clicking confirm will issue a simulated reservation ticket.
                </span>
              </div>

              {/* Confirm CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  data-testid="confirm-booking"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-voyage-blue hover:bg-voyage-blue-hover text-white font-heading font-extrabold text-base shadow-premium hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>{isSubmitting ? 'Confirming Reservation...' : 'Confirm Simulated Booking'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Summary & Breakdown */}
        <div className="lg:col-span-5 sticky top-28">
          <BookingSummary />
        </div>
      </div>
    </div>
  );
};
