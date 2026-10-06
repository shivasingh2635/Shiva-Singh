import React, { useState } from 'react';
import { X, Save, DollarSign } from 'lucide-react';
import { TourPackage, Currency, TravelTheme } from '../types';
import { formatPrice } from '../data/packages';

interface AdminEditPackageModalProps {
  pkg: TourPackage;
  currency: Currency;
  onSave: (updatedPackage: TourPackage) => void;
  onClose: () => void;
}

export const AdminEditPackageModal: React.FC<AdminEditPackageModalProps> = ({
  pkg,
  currency,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(pkg.title);
  const [subtitle, setSubtitle] = useState(pkg.subtitle || '');
  const [destination, setDestination] = useState(pkg.destination);
  const [region, setRegion] = useState<'domestic' | 'international'>(pkg.region || 'domestic');
  const [durationDays, setDurationDays] = useState(pkg.durationDays);
  const [durationNights, setDurationNights] = useState(pkg.durationNights);
  const [basePriceINR, setBasePriceINR] = useState(pkg.basePriceINR);
  const [originalPriceINR, setOriginalPriceINR] = useState(
    pkg.originalPriceINR || Math.round(pkg.basePriceINR * 1.25)
  );
  const [theme, setTheme] = useState<TravelTheme>(pkg.theme || 'Luxury');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...pkg,
      title: title.trim(),
      subtitle: subtitle.trim(),
      destination: destination.trim(),
      region,
      durationDays: Number(durationDays),
      durationNights: Number(durationNights),
      basePriceINR: Number(basePriceINR),
      originalPriceINR: Number(originalPriceINR) > Number(basePriceINR) ? Number(originalPriceINR) : undefined,
      theme,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-xl w-full p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black">Edit Tour Package Amount & Details</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-neutral-400 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/50 grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Selling Price (INR) *</label>
              <input
                type="number"
                required
                value={basePriceINR}
                onChange={(e) => setBasePriceINR(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white dark:bg-neutral-900 font-mono text-sm font-bold"
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">
                Live: {formatPrice(basePriceINR, currency)}
              </span>
            </div>
            <div>
              <label className="block font-semibold mb-1">Original Price (INR)</label>
              <input
                type="number"
                value={originalPriceINR}
                onChange={(e) => setOriginalPriceINR(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white dark:bg-neutral-900 font-mono text-sm font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Package Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Destination *</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
              >
                <option value="domestic">Domestic (India)</option>
                <option value="international">International</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-neutral-300 font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Package Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
