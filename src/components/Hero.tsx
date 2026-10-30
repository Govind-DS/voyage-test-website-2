import React from 'react';
import { Compass, ShieldCheck, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative pt-10 pb-8 sm:pt-14 sm:pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Curated Travel Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-voyage-blue-light/70 border border-voyage-blue/20 text-voyage-blue text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-voyage-orange" />
          <span>Curated Premium Travel Simulation</span>
        </div>

        {/* Hero Heading */}
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-navy-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Go places.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-voyage-blue to-voyage-orange">
            Feel everything.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-5 text-base sm:text-lg lg:text-xl text-voyage-muted max-w-2xl mx-auto font-normal leading-relaxed">
          Find your flight, discover your stay, and make room for the unexpected.
        </p>

        {/* Feature Highlights */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-voyage-text/80">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Guaranteed Transparent Fares</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center space-x-1.5">
            <Compass className="w-4 h-4 text-voyage-blue" />
            <span>Curated 5-Star Properties</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-voyage-orange inline-block"></span>
            <span>24/7 Priority Travel Assistance</span>
          </div>
        </div>
      </div>

      {/* Subtle Background Glow Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-voyage-blue/10 via-voyage-orange/10 to-transparent blur-3xl pointer-events-none -z-0" />
    </div>
  );
};
