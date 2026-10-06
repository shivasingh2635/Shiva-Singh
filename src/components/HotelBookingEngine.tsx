import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  MapPin,
  Star,
  Check,
  X,
  ShieldCheck,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { HotelProperty, Currency, BookingRecord } from '../types';
import { SAMPLE_HOTELS } from '../data/travelServices';
import { formatPrice } from '../data/packages';

interface HotelBookingEngineProps {
  currency: Currency;
  onBookHotel: (booking: BookingRecord) => void;
  onOpenMyTrips: () => void;
}

export const HotelBookingEngine: React.FC<HotelBookingEngineProps> = ({
  currency,
  onBookHotel,
  onOpenMyTrips,
}) => {
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [checkInDate, setCheckInDate] = useState<string>('2026-11-10');
  const [checkOutDate, setCheckOutDate] = useState<string>('2026-11-14');
  const [roomsCount, setRoomsCount] = useState<number>(1);
  const [adultsCount, setAdultsCount] = useState<number>(2);

  const [selectedHotel, setSelectedHotel] = useState<HotelProperty | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [selectedMealPlanCode, setSelectedMealPlanCode] = useState<'EP' | 'CP' | 'MAP'>('CP');
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [confirmedHotelName, setConfirmedHotelName] = useState<string>('');

  const nightsCount = useMemo(() => {
    try {
      const d1 = new Date(checkInDate);
      const d2 = new Date(checkOutDate);
      const diffDays = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  }, [checkInDate, checkOutDate]);

  const filteredHotels = useMemo(() => {
    return SAMPLE_HOTELS.filter((hotel) => {
      if (selectedCity !== 'all' && hotel.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
      return true;
    });
  }, [selectedCity]);

  const handleOpenHotelDetail = (hotel: HotelProperty) => {
    setSelectedHotel(hotel);
    setSelectedRoomId(hotel.roomTypes[0]?.id || '');
    setSelectedMealPlanCode('CP');
  };

  const activeRoom = selectedHotel?.roomTypes.find((r) => r.id === selectedRoomId) || selectedHotel?.roomTypes[0];
  const activeMealPlan = selectedHotel?.mealPlans.find((m) => m.code === selectedMealPlanCode) || selectedHotel?.mealPlans[0];

  const totalPriceINR = useMemo(() => {
    if (!selectedHotel || !activeRoom) return 0;
    const roomRate = activeRoom.pricePerNightINR;
    const mealRate = activeMealPlan ? activeMealPlan.pricePerNightINR * adultsCount : 0;
    return (roomRate + mealRate) * nightsCount * roomsCount;
  }, [selectedHotel, activeRoom, activeMealPlan, nightsCount, roomsCount, adultsCount]);

  const handleConfirmHotelBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel || !activeRoom || !guestName.trim() || !guestPhone.trim()) return;

    const newBooking: BookingRecord = {
      id: `HOTEL-${Date.now()}`,
      serviceType: 'hotel',
      packageId: selectedHotel.id,
      packageTitle: `${selectedHotel.name} (${activeRoom.name})`,
      destination: selectedHotel.city,
      customerName: guestName,
      email: guestEmail || 'guest@wanderlust.com',
      phone: guestPhone,
      adultsCount,
      childrenCount: 0,
      departureDate: checkInDate,
      hotelTier: selectedHotel.stars === 5 ? 'luxury' : 'deluxe',
      transportType: 'shared',
      addOns: [`Room: ${activeRoom.name}`, `Meal Plan: ${activeMealPlan?.name || 'CP'}`, `${nightsCount} Night(s) Stay`],
      discountINR: 0,
      totalAmountINR: totalPriceINR,
      advancePaidINR: Math.round(totalPriceINR * 0.2),
      balanceDueINR: Math.round(totalPriceINR * 0.8),
      selectedCurrency: currency,
      status: 'Confirmed',
      paymentMethod: 'PartialAdvance',
      paymentStatus: 'Advance Paid',
      transactionRef: `HTXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: new Date().toISOString(),
    };

    onBookHotel(newBooking);
    setConfirmedHotelName(selectedHotel.name);
    setSelectedHotel(null);
    setIsSuccessModalOpen(true);
  };

  return (
    <section id="hotels-section" className="scroll-mt-24 space-y-8">
      <div className="bg-gradient-to-r from-amber-950 via-neutral-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-amber-900/40">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span data-i18n="hotelsEngine.kicker">{t('hotelsEngine.kicker')}</span>
          </div>
          <h2
            data-i18n="hotelsEngine.title"
            className="text-2xl sm:text-3xl font-black tracking-tight font-['Playfair_Display',serif]"
          >
            {t('hotelsEngine.title')}
          </h2>
        </div>

        <div className="mt-6 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-2xl p-4 sm:p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label
              data-i18n="hotelsEngine.destination"
              className="text-[10px] font-bold uppercase tracking-wider text-neutral-500"
            >
              {t('hotelsEngine.destination')}
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold"
            >
              <option value="all">{t('hotelsEngine.allTopDestinations')}</option>
              <option value="Goa">Goa</option>
              <option value="Dubai">Dubai</option>
              <option value="Manali">Manali</option>
            </select>
          </div>
          <div>
            <label
              data-i18n="hotelsEngine.checkIn"
              className="text-[10px] font-bold uppercase tracking-wider text-neutral-500"
            >
              {t('hotelsEngine.checkIn')}
            </label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-semibold"
            />
          </div>
          <div>
            <label
              data-i18n="hotelsEngine.checkOut"
              className="text-[10px] font-bold uppercase tracking-wider text-neutral-500"
            >
              {t('hotelsEngine.checkOut')}
            </label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-semibold"
            />
          </div>
          <div>
            <label
              data-i18n="hotelsEngine.guests"
              className="text-[10px] font-bold uppercase tracking-wider text-neutral-500"
            >
              {t('hotelsEngine.guests')}
            </label>
            <select
              value={adultsCount}
              onChange={(e) => setAdultsCount(Number(e.target.value))}
              className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-semibold"
            >
              <option value={1}>1 {t('hotelsEngine.guest')}</option>
              <option value={2}>2 {t('hotelsEngine.guests')}</option>
              <option value={3}>3 {t('hotelsEngine.guests')}</option>
              <option value={4}>4 {t('hotelsEngine.guests')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col group"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src={hotel.heroImage}
                alt={hotel.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{hotel.city}</span>
              </div>
              <div className="absolute top-3 right-3 bg-amber-500 text-neutral-950 text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{hotel.stars}★</span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-bold text-base text-neutral-900 dark:text-white line-clamp-1">{hotel.name}</h3>
                <p className="text-xs text-neutral-500 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="line-clamp-1">{hotel.locationProximity}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <span data-i18n="hotelsEngine.startingFrom" className="text-[10px] text-neutral-400 font-medium">
                    {t('hotelsEngine.startingFrom')}
                  </span>
                  <p className="text-lg font-black text-amber-600 dark:text-amber-400">
                    {formatPrice(hotel.basePricePerNightINR, currency)}
                    <span data-i18n="hotelsEngine.perNight" className="text-xs font-normal text-neutral-400">
                      {' '}
                      {t('hotelsEngine.perNight')}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenHotelDetail(hotel)}
                  data-i18n="hotelsEngine.selectRoom"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  {t('hotelsEngine.selectRoom')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedHotel && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-amber-950 text-white">
              <div>
                <h3 className="text-base font-bold">{selectedHotel.name}</h3>
                <p className="text-xs text-amber-200">
                  {selectedHotel.stars}★ Luxury {selectedHotel.category} · {selectedHotel.city}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHotel(null)}
                className="p-1.5 rounded-lg text-amber-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmHotelBooking} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold">Guest Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shalini Singhania"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{selectedHotel.cancellationPolicy}</span>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-amber-600">
                    {formatPrice(totalPriceINR, currency)}
                  </span>
                  <p className="text-[11px] text-emerald-600 font-bold">
                    20% Advance now: {formatPrice(Math.round(totalPriceINR * 0.2), currency)}
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Book Stay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <CheckCircle2 className="w-12 h-12 text-amber-600 mx-auto" />
            <h3 className="text-xl font-bold">Hotel Reservation Confirmed!</h3>
            <p className="text-xs text-neutral-500">Your stay at {confirmedHotelName} is confirmed.</p>
            <button
              type="button"
              onClick={() => {
                setIsSuccessModalOpen(false);
                onOpenMyTrips();
              }}
              className="w-full py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              View in My Trips
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
