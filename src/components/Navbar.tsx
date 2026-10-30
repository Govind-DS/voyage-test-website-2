import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plane, Building2, Compass, HelpCircle, User, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-[33px] z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-voyage-orange shadow-md group-hover:bg-voyage-blue transition-colors">
                <Plane className="w-5 h-5 -rotate-45" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-2xl tracking-tight text-navy-900 group-hover:text-voyage-blue transition-colors">
                  VOYAGE
                </span>
                <span className="hidden sm:block text-[11px] font-medium tracking-wide text-voyage-muted uppercase -mt-1">
                  Go places. Feel everything.
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/' || location.pathname.includes('/flights')
                  ? 'bg-voyage-blue-light text-voyage-blue font-semibold'
                  : 'text-voyage-text hover:bg-slate-50'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>Flights</span>
            </Link>

            <Link
              to="/hotels"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname.includes('/hotels')
                  ? 'bg-voyage-blue-light text-voyage-blue font-semibold'
                  : 'text-voyage-text hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Stays</span>
            </Link>

            <a
              href="#explore"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-voyage-text hover:bg-slate-50 transition-all"
            >
              <Compass className="w-4 h-4 text-voyage-muted" />
              <span>Explore</span>
            </a>

            <a
              href="#help"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-voyage-text hover:bg-slate-50 transition-all"
            >
              <HelpCircle className="w-4 h-4 text-voyage-muted" />
              <span>Help</span>
            </a>
          </nav>

          {/* Right Action */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => setIsSignedIn(!isSignedIn)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-navy-900 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <User className="w-4 h-4 text-voyage-blue" />
              <span>{isSignedIn ? 'Alex Morgan' : 'Sign In'}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-navy-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium text-voyage-text hover:bg-voyage-blue-light"
          >
            <Plane className="w-5 h-5 text-voyage-blue" />
            <span>Flights</span>
          </Link>
          <Link
            to="/hotels"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium text-voyage-text hover:bg-voyage-blue-light"
          >
            <Building2 className="w-5 h-5 text-voyage-blue" />
            <span>Stays</span>
          </Link>
          <a
            href="#explore"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium text-voyage-text hover:bg-slate-50"
          >
            <Compass className="w-5 h-5 text-voyage-muted" />
            <span>Explore</span>
          </a>
          <button
            onClick={() => {
              setIsSignedIn(!isSignedIn);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center space-x-2 mt-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-voyage-blue hover:bg-voyage-blue-hover"
          >
            <User className="w-4 h-4" />
            <span>{isSignedIn ? 'Alex Morgan (Signed In)' : 'Sign In'}</span>
          </button>
        </div>
      )}
    </header>
  );
};
