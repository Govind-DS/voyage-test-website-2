import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { BookingProvider } from './state/BookingContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { FlightResultsPage } from './pages/FlightResultsPage';
import { HotelResultsPage } from './pages/HotelResultsPage';
import { BookingPage } from './pages/BookingPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { ACTIVE_VERSION, VERSION_CONFIG } from './config/versionConfig';
import { CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

const StandaloneBanner: React.FC = () => {
  const config = VERSION_CONFIG[ACTIVE_VERSION];

  return (
    <aside
      aria-label="Environment Indicator"
      className="bg-navy-900 border-b border-navy-700 text-white text-xs px-4 py-2 sticky top-0 z-50 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          {ACTIVE_VERSION === 'clean' ? (
            <span className="flex items-center text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-400" />
              <strong className="text-white">Environment:</strong>&nbsp;Clean Version (Zero Defects)
            </span>
          ) : ACTIVE_VERSION === 'test-1' ? (
            <span className="flex items-center text-amber-300 font-medium">
              <AlertCircle className="w-4 h-4 mr-1 text-amber-400" />
              <strong className="text-white">Environment:</strong>&nbsp;Test Website 1 (Defect Set A Active)
            </span>
          ) : (
            <span className="flex items-center text-rose-300 font-medium">
              <ShieldAlert className="w-4 h-4 mr-1 text-rose-400" />
              <strong className="text-white">Environment:</strong>&nbsp;Test Website 2 (Defect Set B Active)
            </span>
          )}
          <span className="hidden md:inline-block text-slate-400">|</span>
          <span className="hidden md:inline-block text-slate-300 font-normal">
            {config.description}
          </span>
        </div>
        <div className="text-[11px] font-mono px-2 py-0.5 rounded bg-navy-800 text-slate-300 border border-navy-700">
          Standalone Vercel Build
        </div>
      </div>
    </aside>
  );
};

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-voyage-bg text-voyage-text selection:bg-voyage-blue selection:text-white">
      <StandaloneBanner />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <BookingProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="flights" element={<FlightResultsPage />} />
            <Route path="hotels" element={<HotelResultsPage />} />
            <Route path="checkout" element={<BookingPage />} />
            <Route path="confirmation" element={<ConfirmationPage />} />
          </Route>
          <Route path="*" element={<Layout />}>
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </BookingProvider>
    </BrowserRouter>
  );
};

export default App;
