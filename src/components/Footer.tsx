import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, ShieldCheck } from 'lucide-react';
import { ACTIVE_VERSION } from '../config/versionConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-900 text-white pt-16 pb-12 mt-20 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-navy-800">
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-voyage-blue flex items-center justify-center text-white">
                <Plane className="w-4 h-4 -rotate-45" />
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight">
                VOYAGE
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              "Go places. Feel everything." Premium travel reservation platform built for autonomous quality engineering and precision flight/stay booking.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Simulated booking environment • Zero production card charges</span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-300">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Flight Search
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="hover:text-white transition-colors">
                  Hotel & Resort Stays
                </Link>
              </li>
              <li>
                <a href="#explore" className="hover:text-white transition-colors">
                  Popular Destinations
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-300">
              Environment Info
            </h4>
            <div className="text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-200 uppercase tracking-wider">{ACTIVE_VERSION.toUpperCase()}</p>
              <p>Standalone Repository ready for GitHub & Vercel deployment.</p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} VOYAGE Travel Technologies Inc. All simulated rights reserved.</p>
          <span>Engineered for Autonomous QA Testing</span>
        </div>
      </div>
    </footer>
  );
};
