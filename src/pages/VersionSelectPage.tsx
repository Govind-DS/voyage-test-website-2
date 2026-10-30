import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, CheckCircle2, AlertCircle, ShieldAlert, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

export const VersionSelectPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-voyage-bg text-voyage-text flex flex-col justify-between">
      {/* Top Header */}
      <header className="bg-navy-900 text-white py-6 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-voyage-blue flex items-center justify-center text-white shadow-md">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-white block">
                VOYAGE
              </span>
              <span className="text-[11px] font-medium tracking-wide text-slate-300 uppercase block -mt-1">
                Go places. Feel everything.
              </span>
            </div>
          </div>

          <div className="hidden sm:inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-xs text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-voyage-orange" />
            <span>Autonomous QA Evaluation Platform</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-navy-900 tracking-tight">
            Select Test Environment
          </h1>
          <p className="mt-4 text-base sm:text-lg text-voyage-muted">
            All three websites share identical visual branding, responsive layout, and sample inventory. Choose an environment below to test autonomous flight & hotel reservation flows.
          </p>
        </div>

        {/* 3 Version Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 1. CLEAN VERSION */}
          <div className="bg-white rounded-3xl border-2 border-emerald-500/80 p-6 sm:p-8 shadow-card flex flex-col justify-between relative group hover:-translate-y-1 transition-all duration-200">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Correct</span>
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-heading font-bold text-xl mb-5">
                01
              </div>

              <h2 className="font-heading font-extrabold text-xl text-navy-900">
                Clean Version
              </h2>
              <p className="text-xs text-voyage-muted font-mono mt-0.5">
                /clean-version
              </p>

              <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                Implements complete, verified business logic with zero defects. Transparent 12% GST, strict date validation, passenger reconciliation, and real-time inventory checks.
              </p>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Accurate date range enforcement</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Full passenger tier calculations</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Strict sold-out inventory guardrails</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <Link
                to="/clean-version"
                data-testid="enter-clean-version"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-sm shadow-sm transition-all flex items-center justify-center space-x-2"
              >
                <span>Launch Clean Version</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* 2. TEST WEBSITE 1 (Bug Set A) */}
          <div className="bg-white rounded-3xl border-2 border-amber-400 p-6 sm:p-8 shadow-card flex flex-col justify-between relative group hover:-translate-y-1 transition-all duration-200">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Defect Set A Active</span>
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-heading font-bold text-xl mb-5">
                02
              </div>

              <h2 className="font-heading font-extrabold text-xl text-navy-900">
                Test Website 1
              </h2>
              <p className="text-xs text-voyage-muted font-mono mt-0.5">
                /test-website-1
              </p>

              <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                Contains 12 intentional, reproducible defects (A01–A12) for automated browser testing validation.
              </p>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-amber-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>BUG A01: Invalid return date bypass</span>
                </div>
                <div className="flex items-center space-x-2 text-amber-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>BUG A02/A07: Passenger count omission</span>
                </div>
                <div className="flex items-center space-x-2 text-amber-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>BUG A08: Sold-out room selection bypass</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <Link
                to="/test-website-1"
                data-testid="enter-test-1"
                className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-heading font-bold text-sm shadow-sm transition-all flex items-center justify-center space-x-2"
              >
                <span>Launch Test Website 1</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* 3. TEST WEBSITE 2 (Bug Set B) */}
          <div className="bg-white rounded-3xl border-2 border-rose-400 p-6 sm:p-8 shadow-card flex flex-col justify-between relative group hover:-translate-y-1 transition-all duration-200">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Defect Set B Active</span>
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-heading font-bold text-xl mb-5">
                03
              </div>

              <h2 className="font-heading font-extrabold text-xl text-navy-900">
                Test Website 2
              </h2>
              <p className="text-xs text-voyage-muted font-mono mt-0.5">
                /test-website-2
              </p>

              <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                Contains 12 separate intentional defects (B01–B12) including filter leaks, card price mismatches, and inflated tax computations.
              </p>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-rose-700">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>BUG B01: Unexpected return date overwrite</span>
                </div>
                <div className="flex items-center space-x-2 text-rose-700">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>BUG B03: Flight card price mismatch</span>
                </div>
                <div className="flex items-center space-x-2 text-rose-700">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>BUG B04/B06: Incorrect tax rate application</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <Link
                to="/test-website-2"
                data-testid="enter-test-2"
                className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-heading font-bold text-sm shadow-sm transition-all flex items-center justify-center space-x-2"
              >
                <span>Launch Test Website 2</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="text-center py-6 text-xs text-voyage-muted border-t border-slate-200">
        <p>VOYAGE Multi-Version Autonomous QA Testing Harness • Built with React, TypeScript & Playwright</p>
      </footer>
    </div>
  );
};
