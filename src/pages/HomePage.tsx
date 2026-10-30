import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { FlightSearchForm } from '../components/FlightSearchForm';
import { HotelSearchForm } from '../components/HotelSearchForm';
import { Plane, Building2, MapPin, Sparkles, Shield, Compass, ArrowRight } from 'lucide-react';
import { useBooking } from '../state/BookingContext';
import { VERSION_CONFIG } from '../config/versionConfig';

export const HomePage: React.FC = () => {
  const { version, setFlightSearchParams, setHotelSearchParams } = useBooking();
  const [activeTab, setActiveTab] = useState<'flights' | 'stays'>('flights');
  const navigate = useNavigate();

  const prefix = VERSION_CONFIG[version]?.routePrefix || '/clean-version';

  const FEATURED_DESTINATIONS = [
    {
      name: 'Goa',
      country: 'India',
      tagline: 'Sun-drenched coasts & colonial heritage',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      flightFrom: '₹3,450',
      stayFrom: '₹3,800/night',
    },
    {
      name: 'Dubai',
      country: 'United Arab Emirates',
      tagline: 'Iconic architecture & desert oasis luxury',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      flightFrom: '₹14,200',
      stayFrom: '₹14,500/night',
    },
    {
      name: 'Bengaluru',
      country: 'India',
      tagline: 'Garden city with vibrant craft culinary hubs',
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
      flightFrom: '₹2,600',
      stayFrom: '₹7,500/night',
    },
    {
      name: 'Mumbai',
      country: 'India',
      tagline: 'The bustling Arabian sea gateway of dreams',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
      flightFrom: '₹3,100',
      stayFrom: '₹6,900/night',
    },
  ];

  const handleQuickFlight = (city: string) => {
    setFlightSearchParams({ destination: city });
    navigate('/flights');
  };

  const handleQuickStay = (city: string) => {
    setHotelSearchParams({ destination: city });
    navigate('/hotels');
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <Hero />

      {/* Booking Search Panel */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-floating border border-slate-200/80 p-6 sm:p-8 backdrop-blur-md">
          {/* Booking Tabs */}
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-5 mb-6">
            <button
              type="button"
              data-testid="tab-flights"
              onClick={() => setActiveTab('flights')}
              className={`flex items-center space-x-2.5 px-6 py-3 rounded-2xl text-sm font-heading font-bold transition-all ${
                activeTab === 'flights'
                  ? 'bg-navy-900 text-white shadow-md'
                  : 'bg-slate-50 text-voyage-muted hover:bg-slate-100 hover:text-navy-900'
              }`}
            >
              <Plane className="w-4 h-4 text-voyage-blue -rotate-45" />
              <span>Flights</span>
            </button>

            <button
              type="button"
              data-testid="tab-stays"
              onClick={() => setActiveTab('stays')}
              className={`flex items-center space-x-2.5 px-6 py-3 rounded-2xl text-sm font-heading font-bold transition-all ${
                activeTab === 'stays'
                  ? 'bg-navy-900 text-white shadow-md'
                  : 'bg-slate-50 text-voyage-muted hover:bg-slate-100 hover:text-navy-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-voyage-orange" />
              <span>Stays & Resorts</span>
            </button>
          </div>

          {/* Active Search Form */}
          {activeTab === 'flights' ? <FlightSearchForm /> : <HotelSearchForm />}
        </div>
      </div>

      {/* Featured Destinations */}
      <section id="explore" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-voyage-blue uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>Curated Escapes</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-navy-900 tracking-tight">
              Popular Destinations
            </h2>
            <p className="text-sm text-voyage-muted mt-1">
              Explore handpicked getaways with verified flight connectivity and luxury stays.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_DESTINATIONS.map(dest => (
            <div
              key={dest.name}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-navy-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">
                  {dest.country}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-navy-900 group-hover:text-voyage-blue transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-voyage-muted mt-1">
                    {dest.tagline}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-voyage-muted block">Flights from</span>
                    <strong className="text-navy-900 font-extrabold">{dest.flightFrom}</strong>
                  </div>
                  <div className="flex space-x-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickFlight(dest.name)}
                      className="px-2.5 py-1.5 rounded-lg bg-voyage-blue-light text-voyage-blue font-semibold hover:bg-voyage-blue hover:text-white transition-colors"
                      title="Search Flights"
                    >
                      Flights
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickStay(dest.name)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-navy-900 font-semibold hover:bg-navy-900 hover:text-white transition-colors"
                      title="Search Stays"
                    >
                      Stays
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Voyage Platform Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-voyage-orange">
              The Voyage Standard
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight mt-2 mb-4">
              Precision Engineering Meets World-Class Hospitality
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-8">
              VOYAGE is architected for transparency, instant seat confirmations, and seamless hotel reservations. Whether booking business hops across metropolitans or tranquil beachside villas, every interaction is validated.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="border-l-2 border-voyage-blue pl-4">
                <span className="font-heading font-extrabold text-2xl text-white block">100%</span>
                <span className="text-xs text-slate-300 mt-1 block">Deterministic simulated flight schedules</span>
              </div>
              <div className="border-l-2 border-voyage-orange pl-4">
                <span className="font-heading font-extrabold text-2xl text-white block">12%</span>
                <span className="text-xs text-slate-300 mt-1 block">Standard tax transparently itemized</span>
              </div>
              <div className="border-l-2 border-emerald-400 pl-4">
                <span className="font-heading font-extrabold text-2xl text-white block">Zero</span>
                <span className="text-xs text-slate-300 mt-1 block">Hidden fees at payment checkout</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
