import React, { useState } from 'react';
import {
  X,
  Plane,
  Train,
  Bus,
  Hotel,
  Utensils,
  Star,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { TourPackage, Currency } from '../types';
import { formatPrice } from '../data/packages';

interface TransportRouteMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: TourPackage;
  currency?: Currency;
  onBookNow: (pkg: TourPackage) => void;
}

export const TransportRouteMapModal: React.FC<TransportRouteMapModalProps> = ({
  isOpen,
  onClose,
  pkg,
  currency = 'INR',
  onBookNow,
}) => {
  if (!isOpen) return null;

  const [transitMode, setTransitMode] = useState<'flight' | 'train' | 'bus'>('flight');
  const route = pkg.transportRoute;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider">Travel Guide & Route Map</span>
              <h2 className="text-base sm:text-lg font-bold">How Youll Travel to {pkg.destination}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-white/80 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setTransitMode('flight')}
              className={`p-3 rounded-2xl border text-left cursor-pointer ${
                transitMode === 'flight' ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40' : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <Plane className="w-5 h-5 text-blue-600 mb-1" />
              <h4 className="font-bold text-xs">By Flight</h4>
              <p className="text-[11px] text-neutral-500">{route?.flight?.duration || '2h 15m'}</p>
            </button>
            <button
              type="button"
              onClick={() => setTransitMode('train')}
              className={`p-3 rounded-2xl border text-left cursor-pointer ${
                transitMode === 'train' ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40' : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <Train className="w-5 h-5 text-emerald-600 mb-1" />
              <h4 className="font-bold text-xs">By Train</h4>
              <p className="text-[11px] text-neutral-500">{route?.train?.duration || '6h 30m'}</p>
            </button>
            <button
              type="button"
              onClick={() => setTransitMode('bus')}
              className={`p-3 rounded-2xl border text-left cursor-pointer ${
                transitMode === 'bus' ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/40' : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <Bus className="w-5 h-5 text-amber-600 mb-1" />
              <h4 className="font-bold text-xs">Luxury Coach</h4>
              <p className="text-[11px] text-neutral-500">{route?.bus?.duration || '8h 00m'}</p>
            </button>
          </div>

          {/* Hotels */}
          {route?.hotels && route.hotels.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Hotel className="w-4 h-4 text-purple-600" /> Verified Partner Stays
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {route.hotels.map((hotel, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs">{hotel.name}</h4>
                      <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {hotel.rating}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-500" /> {hotel.location}
                    </p>
                    <div className="space-y-1">
                      {hotel.highlights.map((hl, i) => (
                        <p key={i} className="text-[11px] text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> {hl}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Restaurants */}
          {route?.restaurants && route.restaurants.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Utensils className="w-4 h-4 text-rose-600" /> Recommended Local Dining
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {route.restaurants.map((rest, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 space-y-1 text-xs"
                  >
                    <h4 className="font-bold">{rest.name}</h4>
                    <p className="text-rose-600 dark:text-rose-400">{rest.cuisine}</p>
                    <p className="text-neutral-500 text-[11px]">Must-try: {rest.specialty || rest.specialtyDish}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-800/90 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-500 block">Package Base Price:</span>
            <span className="text-lg font-extrabold">{formatPrice(pkg.basePriceINR, currency)}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onBookNow(pkg);
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 cursor-pointer"
          >
            <span>Book This Package Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
