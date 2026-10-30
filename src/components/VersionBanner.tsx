import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { VERSION_CONFIG } from '../config/versionConfig';
import { AppVersion } from '../types';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export const VersionBanner: React.FC<{ activeVersion: AppVersion }> = ({ activeVersion }) => {
  const location = useLocation();

  // Helper to maintain current subpage when switching versions
  const getSubPath = () => {
    const path = location.pathname;
    if (path.includes('/flights')) return '/flights';
    if (path.includes('/hotels')) return '/hotels';
    if (path.includes('/checkout')) return '/checkout';
    if (path.includes('/confirmation')) return '/confirmation';
    return '';
  };

  const currentConfig = VERSION_CONFIG[activeVersion];

  return (
    <aside 
      aria-label="Testing environment version switcher"
      className="bg-navy-900 border-b border-navy-700 text-white text-xs px-4 py-2 sticky top-0 z-50 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          {activeVersion === 'clean' ? (
            <span className="flex items-center text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-400" />
              <strong className="text-white">Active Environment:</strong>&nbsp;Clean Version (Zero Defects)
            </span>
          ) : activeVersion === 'test-1' ? (
            <span className="flex items-center text-amber-300 font-medium">
              <AlertCircle className="w-4 h-4 mr-1 text-amber-400" />
              <strong className="text-white">Active Environment:</strong>&nbsp;Test Website 1 (Defect Set A Active)
            </span>
          ) : (
            <span className="flex items-center text-rose-300 font-medium">
              <ShieldAlert className="w-4 h-4 mr-1 text-rose-400" />
              <strong className="text-white">Active Environment:</strong>&nbsp;Test Website 2 (Defect Set B Active)
            </span>
          )}
          <span className="hidden md:inline-block text-slate-400">|</span>
          <span className="hidden md:inline-block text-slate-300 font-normal">
            {currentConfig.description}
          </span>
        </div>

        <nav aria-label="Version selection" className="flex items-center space-x-1.5 bg-navy-800 p-1 rounded-lg border border-navy-700">
          <Link
            to={`/clean-version${getSubPath()}`}
            data-testid="switch-clean"
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeVersion === 'clean'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-navy-700'
            }`}
          >
            Clean Version
          </Link>
          <Link
            to={`/test-website-1${getSubPath()}`}
            data-testid="switch-test-1"
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeVersion === 'test-1'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-navy-700'
            }`}
          >
            Test Site 1 (Bug Set A)
          </Link>
          <Link
            to={`/test-website-2${getSubPath()}`}
            data-testid="switch-test-2"
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              activeVersion === 'test-2'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-navy-700'
            }`}
          >
            Test Site 2 (Bug Set B)
          </Link>
        </nav>
      </div>
    </aside>
  );
};
