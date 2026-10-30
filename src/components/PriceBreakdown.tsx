import React from 'react';
import { PriceBreakdownData } from '../types';
import { formatINR } from '../utils/currencyUtils';
import { Receipt, ShieldCheck } from 'lucide-react';

interface PriceBreakdownProps {
  pricing: PriceBreakdownData;
  type: 'flight' | 'hotel';
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({ pricing, type }) => {
  return (
    <div
      data-testid="price-breakdown"
      className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm"
    >
      <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
        <Receipt className="w-4 h-4 text-voyage-blue" />
        <h3 className="font-heading font-bold text-sm text-navy-900">Fare & Tax Breakdown</h3>
      </div>

      <div className="space-y-2.5 text-xs">
        {/* Base subtotal */}
        <div className="flex justify-between items-center text-slate-700">
          <span>
            {type === 'flight' ? 'Base Airfare Subtotal' : 'Room Charges Subtotal'}
          </span>
          <span data-testid="subtotal-amount" className="font-semibold text-navy-900">
            {formatINR(pricing.baseAmount)}
          </span>
        </div>

        {/* Return Flight (if applicable) */}
        {pricing.returnAmount && pricing.returnAmount > 0 && (
          <div className="flex justify-between items-center text-slate-700">
            <span>Return Airfare Subtotal</span>
            <span className="font-semibold text-navy-900">
              {formatINR(pricing.returnAmount)}
            </span>
          </div>
        )}

        {/* Taxes */}
        <div className="flex justify-between items-center text-slate-700">
          <span className="flex items-center space-x-1">
            <span>Goods & Services Tax (GST)</span>
            <span
              data-testid="tax-rate-percent"
              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold"
            >
              {pricing.taxRatePercent}%
            </span>
          </span>
          <span data-testid="tax-amount" className="font-semibold text-navy-900">
            {formatINR(pricing.taxAmount)}
          </span>
        </div>

        {/* Fees */}
        <div className="flex justify-between items-center text-slate-700">
          <span>{type === 'flight' ? 'Aviation Security & Handling' : 'Hospitality & Resort Service'}</span>
          <span data-testid="fee-amount" className="font-semibold text-navy-900">
            {formatINR(pricing.feeAmount)}
          </span>
        </div>
      </div>

      {/* Total Payable */}
      <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
        <div>
          <span className="font-heading font-extrabold text-sm text-navy-900 block">
            Total Payable
          </span>
          <span className="text-[11px] text-voyage-muted">
            All mandatory taxes and fees included
          </span>
        </div>
        <span
          data-testid="booking-total"
          className="font-heading font-black text-2xl text-voyage-blue tracking-tight"
        >
          {formatINR(pricing.totalAmount)}
        </span>
      </div>

      <div className="pt-1 flex items-center space-x-1.5 text-[11px] text-emerald-700 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Best Price Guarantee — Zero hidden payment gateway fees</span>
      </div>
    </div>
  );
};
