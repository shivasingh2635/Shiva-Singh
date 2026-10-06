import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Utensils,
  MapPin,
  Star,
  Clock,
  ChefHat,
  CheckCircle2,
  Search,
  X,
} from 'lucide-react';
import { Currency, BookingRecord } from '../types';
import { formatPrice } from '../data/packages';
import heroKashmir from '../assets/images/hero_kashmir_dal_lake_1791214816138.jpg';
import pkgDubai from '../assets/images/pkg_dubai_luxury_skyline_1791214833588.jpg';
import pkgGoa from '../assets/images/pkg_goa_coastal_boutique_1791214857475.jpg';

interface RestaurantItem {
  id: string;
  name: string;
  destination: string;
  cuisine: string;
  category: string;
  rating: number;
  reviewsCount: number;
  approxCostPerCoupleINR: number;
  timings: string;
  location: string;
  image: string;
  specialtyDishes: string[];
}

const CURATED_RESTAURANTS: RestaurantItem[] = [
  {
    id: 'rest-1',
    name: 'Ahdoos Heritage Wazwan Pavilion',
    destination: 'Srinagar, Kashmir',
    cuisine: 'Authentic Kashmiri Wazwan',
    category: 'Authentic Local',
    rating: 4.9,
    reviewsCount: 3100,
    approxCostPerCoupleINR: 2200,
    timings: '11:00 AM - 10:30 PM',
    location: 'Residency Road, Regal Chowk, Srinagar',
    image: heroKashmir,
    specialtyDishes: ['Gushtaba', 'Rogan Josh', 'Traditional Saffron Kehwa'],
  },
  {
    id: 'rest-2',
    name: 'Fishermans Wharf - Riverside Seafood',
    destination: 'Cavelossim, Goa',
    cuisine: 'Goan Coastal & Seafood',
    category: 'Seafood Special',
    rating: 4.8,
    reviewsCount: 2890,
    approxCostPerCoupleINR: 2600,
    timings: '12:00 PM - 11:30 PM',
    location: 'At The River Sal, Mobor Beach Road, Cavelossim, Goa',
    image: pkgGoa,
    specialtyDishes: ['Butter Garlic Tiger Prawns', 'Goan Fish Curry Thali', 'Bebinca'],
  },
  {
    id: 'rest-3',
    name: 'Ossiano - Underwater Fine Dining',
    destination: 'Dubai, UAE',
    cuisine: 'Progressive Seafood & French',
    category: 'Michelin Star Experience',
    rating: 4.9,
    reviewsCount: 940,
    approxCostPerCoupleINR: 28000,
    timings: '6:00 PM - 11:00 PM',
    location: 'Atlantis The Palm, Crescent Road, Dubai',
    image: pkgDubai,
    specialtyDishes: ['Brittany Sea Bass', 'Imperial Oscietra Caviar', 'Gold Soufflé'],
  },
];

interface RestaurantDiningEngineProps {
  currency: Currency;
  onBookDining?: (booking: BookingRecord) => void;
  onOpenCallback?: () => void;
}

export const RestaurantDiningEngine: React.FC<RestaurantDiningEngineProps> = ({
  currency,
  onBookDining,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookingSuccessModal, setBookingSuccessModal] = useState<RestaurantItem | null>(null);
  const [tableBookingForm, setTableBookingForm] = useState<{
    restaurant: RestaurantItem | null;
    guestName: string;
    phone: string;
    guestsCount: number;
    date: string;
    timeSlot: string;
  }>({
    restaurant: null,
    guestName: '',
    phone: '',
    guestsCount: 2,
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    timeSlot: '08:00 PM (Dinner)',
  });

  const filteredRestaurants = CURATED_RESTAURANTS.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.destination.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q)
    );
  });

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableBookingForm.restaurant || !tableBookingForm.guestName || !tableBookingForm.phone) return;
    const rest = tableBookingForm.restaurant;
    if (onBookDining) {
      onBookDining({
        id: `DINING-${Date.now()}`,
        serviceType: 'dining',
        packageId: rest.id,
        packageTitle: `Table Reservation: ${rest.name}`,
        destination: rest.destination,
        customerName: tableBookingForm.guestName,
        email: 'dining@wanderlust.com',
        phone: tableBookingForm.phone,
        adultsCount: tableBookingForm.guestsCount,
        childrenCount: 0,
        departureDate: `${tableBookingForm.date} (${tableBookingForm.timeSlot})`,
        hotelTier: 'luxury',
        transportType: 'shared',
        addOns: [rest.cuisine],
        discountINR: 0,
        totalAmountINR: rest.approxCostPerCoupleINR,
        selectedCurrency: currency,
        status: 'Confirmed',
        paymentMethod: 'UPI',
        paymentStatus: 'Paid',
        transactionRef: `TBL-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString(),
      });
    }
    setTableBookingForm({ ...tableBookingForm, restaurant: null });
    setBookingSuccessModal(rest);
  };

  return (
    <section id="dining-section" className="scroll-mt-24 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1" data-i18n="dining.badge">
            <ChefHat className="w-4 h-4" /> {t('dining.badge')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-['Playfair_Display',serif]" data-i18n="dining.title">
            {t('dining.title')}
          </h2>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder={t('dining.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-white/95 dark:bg-neutral-900/95 text-xs font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{restaurant.rating}</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-[11px] font-medium text-neutral-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" /> {restaurant.destination}
                </p>
                <h3 className="text-base font-bold text-white line-clamp-1">{restaurant.name}</h3>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2 text-xs text-neutral-500">
                <p className="font-semibold text-amber-700 dark:text-amber-400">
                  {restaurant.specialtyDishes.join(' · ')}
                </p>
                <p className="flex items-center gap-1.5 text-[11px]">
                  <Clock className="w-3.5 h-3.5 shrink-0" /> {restaurant.timings}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-medium" data-i18n="dining.costForTwo">{t('dining.costForTwo')}</span>
                  <span className="text-base font-extrabold text-neutral-900 dark:text-white">
                    {formatPrice(restaurant.approxCostPerCoupleINR, currency)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setTableBookingForm({ ...tableBookingForm, restaurant })}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span data-i18n="dining.reserveTable">{t('dining.reserveTable')}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tableBookingForm.restaurant && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-600 block" data-i18n="dining.priorityTable">{t('dining.priorityTable')}</span>
                <h3 className="text-base font-bold">{tableBookingForm.restaurant.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setTableBookingForm({ ...tableBookingForm, restaurant: null })}
                className="p-1.5 rounded-lg text-neutral-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReservation} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1" data-i18n="dining.guestName">{t('dining.guestName')} *</label>
                <input
                  type="text"
                  required
                  value={tableBookingForm.guestName}
                  onChange={(e) => setTableBookingForm({ ...tableBookingForm, guestName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1" data-i18n="dining.phone">{t('dining.phone')} *</label>
                <input
                  type="tel"
                  required
                  value={tableBookingForm.phone}
                  onChange={(e) => setTableBookingForm({ ...tableBookingForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                data-i18n="dining.confirmReservation"
              >
                <CheckCircle2 className="w-4 h-4" /> {t('dining.confirmReservation')}
              </button>
            </form>
          </div>
        </div>
      )}

      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold" data-i18n="dining.tableReserved">{t('dining.tableReserved')}</h3>
            <p className="text-xs text-neutral-500">
              <strong>{bookingSuccessModal.name}</strong> — {bookingSuccessModal.destination}
            </p>
            <button
              type="button"
              onClick={() => setBookingSuccessModal(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
              data-i18n="dining.done"
            >
              {t('dining.done')}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
