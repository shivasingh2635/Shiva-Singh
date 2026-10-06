import React, { useState } from 'react';
import { BarChart3, PieChart as PieChartIcon, Layers, ArrowUpRight, Download, CreditCard } from 'lucide-react';
import { BookingRecord, Currency } from '../types';
import { formatPrice } from '../data/packages';

interface AdminBarAndPieChartsProps {
  bookings: BookingRecord[];
  currency: Currency;
}

export const AdminBarAndPieCharts: React.FC<AdminBarAndPieChartsProps> = ({ bookings, currency }) => {
  const [chartViewMode, setChartViewMode] = useState<'all' | 'bar' | 'pie'>('all');

  const liveBookingsRevenue = bookings.reduce((sum, b) => sum + (b.totalAmountINR || 0), 0);

  const monthlyData = [
    { month: 'Oct', revenue: 780000, volume: 24 },
    { month: 'Nov', revenue: 690000, volume: 21 },
    { month: 'Dec', revenue: 940000, volume: 29 },
    { month: 'Jan', revenue: 620000, volume: 19 },
    { month: 'Feb', revenue: 580000, volume: 17 },
    { month: 'Mar', revenue: 840000 + liveBookingsRevenue, volume: 25 + bookings.length },
  ];

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  const destinationData = [
    { name: 'Kashmir Valley & Gulmarg', share: 29, colorClass: 'bg-emerald-500' },
    { name: 'Dubai & Abu Dhabi', share: 23, colorClass: 'bg-cyan-500' },
    { name: 'Goa Coastal & Heritage', share: 18, colorClass: 'bg-amber-500' },
    { name: 'Kerala Backwaters & Munnar', share: 14, colorClass: 'bg-teal-500' },
    { name: 'Swiss Alps & Zurich', share: 10, colorClass: 'bg-indigo-500' },
    { name: 'Spiti Valley Expedition', share: 6, colorClass: 'bg-purple-500' },
  ];

  const paymentMethodsPieData = [
    { name: 'PhonePe / UPI (8792658635@fam)', percent: 68, amountINR: 4680000 + liveBookingsRevenue, colorHex: '#8b5cf6' },
    { name: 'Net Banking & IMPS', percent: 18, amountINR: 1240000, colorHex: '#3b82f6' },
    { name: 'Credit & Debit Cards', percent: 10, amountINR: 690000, colorHex: '#10b981' },
    { name: 'Advance Deposit', percent: 4, amountINR: 280000, colorHex: '#64748b' },
  ];

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <h3 className="text-base font-black text-neutral-900 dark:text-white">
            Executive Bar & Pie Chart Analytics
          </h3>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs">
          <button
            onClick={() => setChartViewMode('all')}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
              chartViewMode === 'all' ? 'bg-purple-600 text-white' : 'text-neutral-600 dark:text-neutral-300'
            }`}
          >
            Both (Bar & Pie)
          </button>
          <button
            onClick={() => setChartViewMode('bar')}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
              chartViewMode === 'bar' ? 'bg-purple-600 text-white' : 'text-neutral-600 dark:text-neutral-300'
            }`}
          >
            Bar Charts
          </button>
          <button
            onClick={() => setChartViewMode('pie')}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
              chartViewMode === 'pie' ? 'bg-purple-600 text-white' : 'text-neutral-600 dark:text-neutral-300'
            }`}
          >
            Pie Charts
          </button>
        </div>
      </div>

      {(chartViewMode === 'all' || chartViewMode === 'bar') && (
        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-5">
          <h4 className="text-sm font-black">Monthly Gross Revenue Performance (Bar Chart)</h4>
          <div className="h-56 flex items-end justify-between gap-3 px-2 border-b border-neutral-200 dark:border-neutral-800">
            {monthlyData.map((item) => {
              const barHeightPercent = Math.max(12, Math.round((item.revenue / maxRevenue) * 100));
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center h-full justify-end">
                  <span className="text-[10px] font-mono font-bold mb-1 text-neutral-500">
                    {Math.round(item.revenue / 1000)}k
                  </span>
                  <div
                    className="w-full max-w-[44px] rounded-t-xl bg-gradient-to-t from-emerald-600 to-teal-400"
                    style={{ height: `${barHeightPercent}%` }}
                  />
                  <span className="mt-2 text-xs font-bold text-neutral-600 dark:text-neutral-400">{item.month}</span>
                </div>
              );
            })}
          </div>

          <div className="space-y-3 pt-2">
            {destinationData.map((dest) => (
              <div key={dest.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold">{dest.name}</span>
                  <span className="font-mono font-bold">{dest.share}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div className={`h-full rounded-full ${dest.colorClass}`} style={{ width: `${dest.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(chartViewMode === 'all' || chartViewMode === 'pie') && (
        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h4 className="text-sm font-black flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-purple-600" /> Payment Channels Share (PhonePe UPI 68%)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paymentMethodsPieData.map((item) => (
              <div
                key={item.name}
                className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.colorHex }} />
                  <div>
                    <strong className="block">{item.name}</strong>
                    <span className="text-[11px] text-neutral-500">{formatPrice(item.amountINR, currency)}</span>
                  </div>
                </div>
                <span className="font-mono font-black text-purple-600">{item.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
