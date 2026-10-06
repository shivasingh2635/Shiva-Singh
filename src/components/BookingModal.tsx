import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  Calendar,
  Users,
  Building,
  Car,
  ShieldCheck,
  Tag,
  Check,
  Sparkles,
  ArrowRight,
  Info,
  QrCode,
  CreditCard,
  Landmark,
  Smartphone,
  Copy,
  CheckCheck,
  Clock,
  CheckCircle2,
  Plane,
} from 'lucide-react';
import { TourPackage, Currency, BookingRecord, PaymentMethod, CustomerUser } from '../types';
import { BOOKING_ADDONS, formatPrice } from '../data/packages';
import { getLocalizedPackage } from '../data/localizedPackages';
import { UpiQrCodeSvg } from './UpiQrCodeSvg';

interface BookingModalProps {
  pkg: TourPackage | null;
  currency: Currency;
  currentUser?: CustomerUser | null;
  onClose: () => void;
  onBookingConfirmed: (booking: BookingRecord) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  pkg: rawPkg,
  currency,
  currentUser,
  onClose,
  onBookingConfirmed,
}) => {
  const { t, i18n } = useTranslation();
  if (!rawPkg) return null;
  const pkg = getLocalizedPackage(rawPkg, i18n.language);

  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [departureDate, setDepartureDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [hotelTier, setHotelTier] = useState<'standard' | 'deluxe' | 'luxury'>('deluxe');
  const [transportType, setTransportType] = useState<'shared' | 'private_suv'>('private_suv');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(['travel_insurance']);

  // Bundled Flights
  const [includeFlights, setIncludeFlights] = useState<boolean>(false);
  const [flightDepartureCity, setFlightDepartureCity] = useState<string>('New Delhi (DEL)');
  const [flightCabinClass, setFlightCabinClass] = useState<'Economy' | 'Premium Economy' | 'Business'>('Economy');
  const [flightAirlinePref, setFlightAirlinePref] = useState<string>('Any (Cheapest Guaranteed)');

  // Bundled Car
  const [includeCar, setIncludeCar] = useState<boolean>(false);
  const [carVehicleType, setCarVehicleType] = useState<'Executive Sedan' | 'Prime SUV' | 'Luxury VIP'>('Prime SUV');

  // Coupon
  const [couponInput, setCouponInput] = useState<string>('WANDERLUST10');
  const [appliedCoupon, setAppliedCoupon] = useState<string>('WANDERLUST10');
  const [couponError, setCouponError] = useState<string>('');

  // Traveler Details
  const [fullName, setFullName] = useState<string>(currentUser?.name || '');
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [upiUtrInput, setUpiUtrInput] = useState<string>('326484859012');
  const [copiedNumber, setCopiedNumber] = useState<boolean>(false);
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 8921');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('489');
  const [selectedBank, setSelectedBank] = useState<string>('State Bank of India (SBI)');

  const upiNumber = '8792658635';
  const upiVpa = '8792658635@fam';

  const hotelTierMultiplier = {
    standard: 1.0,
    deluxe: 1.25,
    luxury: 1.6,
  }[hotelTier];

  const effectiveTravelersWeight = adults + children * 0.7;
  const baseCostPerPerson = Math.round(pkg.basePriceINR * hotelTierMultiplier);
  const packageTotalINR = Math.round(baseCostPerPerson * effectiveTravelersWeight);

  const transportCostINR = transportType === 'private_suv' && !includeCar ? 4500 : 0;

  const flightPerPersonCost = {
    Economy: 7500,
    'Premium Economy': 14000,
    Business: 28000,
  }[flightCabinClass];
  const bundledFlightCostINR = includeFlights ? flightPerPersonCost * (adults + children) : 0;

  const carPerDayRate = {
    'Executive Sedan': 2800,
    'Prime SUV': 4500,
    'Luxury VIP': 9500,
  }[carVehicleType];
  const bundledCarCostINR = includeCar ? carPerDayRate * pkg.durationDays : 0;

  const addOnsTotalINR = selectedAddOns.reduce((acc, addOnId) => {
    const addon = BOOKING_ADDONS.find((a) => a.id === addOnId);
    if (!addon) return acc;
    if (addon.id === 'travel_insurance') {
      return acc + addon.priceINR * (adults + children);
    }
    return acc + addon.priceINR;
  }, 0);

  const subtotalINR = packageTotalINR + transportCostINR + addOnsTotalINR + bundledFlightCostINR + bundledCarCostINR;

  let discountINR = 0;
  if (appliedCoupon === 'WANDERLUST10') {
    discountINR = Math.round(subtotalINR * 0.1);
  } else if (appliedCoupon === 'SUMMER2026') {
    discountINR = 2500;
  } else if (appliedCoupon === 'INDIAVIP') {
    discountINR = 3000;
  }

  const grandTotalINR = Math.max(0, subtotalINR - discountINR);
  const advanceAmountINR = Math.round(grandTotalINR * 0.25);
  const payableAmountINR = paymentMethod === 'PartialAdvance' ? advanceAmountINR : grandTotalINR;

  const toggleAddOn = (id: string) => {
    if (selectedAddOns.includes(id)) {
      setSelectedAddOns(selectedAddOns.filter((item) => item !== id));
    } else {
      setSelectedAddOns([...selectedAddOns, id]);
    }
  };

  const handleCopyUpiId = () => {
    navigator.clipboard?.writeText(upiVpa);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleCopyNumber = () => {
    navigator.clipboard?.writeText(upiNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const handleAutoFillUtr = () => {
    const randomUtr = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setUpiUtrInput(randomUtr);
  };

  const handleApplyCoupon = () => {
    const code = (couponInput || '').trim().toUpperCase();
    if (!code) {
      setAppliedCoupon('');
      setCouponError('');
      return;
    }
    if (['WANDERLUST10', 'SUMMER2026', 'INDIAVIP'].includes(code)) {
      setAppliedCoupon(code);
      setCouponError('');
    } else {
      setCouponError('Invalid promo code. Try WANDERLUST10 or SUMMER2026');
      setAppliedCoupon('');
    }
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setFormError('Please fill in your name, email, and phone number.');
      return;
    }
    if (paymentMethod === 'UPI' && !upiUtrInput.trim()) {
      setFormError('Please enter your 12-digit UPI / UTR Transaction Reference number.');
      return;
    }

    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: BookingRecord = {
      id: bookingId,
      packageId: pkg.id,
      packageTitle: pkg.title,
      destination: `${pkg.destination}, ${pkg.country}`,
      customerName: fullName,
      email,
      phone,
      adultsCount: adults,
      childrenCount: children,
      departureDate,
      hotelTier,
      transportType,
      addOns: selectedAddOns,
      couponCode: appliedCoupon || undefined,
      discountINR,
      totalAmountINR: grandTotalINR,
      selectedCurrency: currency,
      status: 'Confirmed',
      paymentMethod,
      paymentStatus: paymentMethod === 'PartialAdvance' ? 'Advance Paid' : 'Paid',
      transactionRef:
        paymentMethod === 'UPI'
          ? upiUtrInput
          : paymentMethod === 'Card'
          ? 'TXN-CARD-4532'
          : paymentMethod === 'NetBanking'
          ? 'TXN-NB-98124'
          : `ADV-${advanceAmountINR}`,
      upiNumber: paymentMethod === 'UPI' ? upiNumber : undefined,
      createdAt: new Date().toISOString(),
      notes: specialRequests,
      bundledFlight: includeFlights
        ? {
            included: true,
            departureCity: flightDepartureCity,
            cabinClass: flightCabinClass,
            airlinePreference: flightAirlinePref,
            perTravelerCostINR: flightPerPersonCost,
            totalFlightCostINR: bundledFlightCostINR,
          }
        : undefined,
      bundledCab: includeCar
        ? {
            included: true,
            vehicleType: carVehicleType,
            vehicleModel:
              carVehicleType === 'Executive Sedan'
                ? 'Swift Dzire / Toyota Etios'
                : carVehicleType === 'Prime SUV'
                ? 'Toyota Innova Crysta'
                : 'Toyota Fortuner / Mercedes-Benz',
            airportPickupDrop: true,
            durationDays: pkg.durationDays,
            perDayRateINR: carPerDayRate,
            totalCabCostINR: bundledCarCostINR,
          }
        : undefined,
    };

    onBookingConfirmed(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700/80">
          <div>
            <span
              data-i18n="bookingModal.kicker"
              className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
            >
              {t('bookingModal.kicker')}
            </span>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white line-clamp-1">
              {t('bookingModal.customizeTitle')}: {pkg.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-white dark:bg-neutral-700 shadow-sm transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleConfirmBooking} className="overflow-y-auto p-6 space-y-6">
          {formError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Section 1: Dates & Guests */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/60">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span data-i18n="bookingModal.departureDate">{t('bookingModal.departureDate')}</span>
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                <span data-i18n="bookingModal.adultsLabel">{t('bookingModal.adultsLabel')}</span>
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="w-8 h-8 rounded-l-xl bg-neutral-200 dark:bg-neutral-700 font-bold cursor-pointer"
                >
                  -
                </button>
                <div className="w-12 h-8 flex items-center justify-center bg-white dark:bg-neutral-800 border-y border-neutral-200 dark:border-neutral-700 font-bold text-xs">
                  {adults}
                </div>
                <button
                  type="button"
                  onClick={() => setAdults(adults + 1)}
                  className="w-8 h-8 rounded-r-xl bg-neutral-200 dark:bg-neutral-700 font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-600" />
                <span data-i18n="bookingModal.childrenLabel">{t('bookingModal.childrenLabel')}</span>
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  className="w-8 h-8 rounded-l-xl bg-neutral-200 dark:bg-neutral-700 font-bold cursor-pointer"
                >
                  -
                </button>
                <div className="w-12 h-8 flex items-center justify-center bg-white dark:bg-neutral-800 border-y border-neutral-200 dark:border-neutral-700 font-bold text-xs">
                  {children}
                </div>
                <button
                  type="button"
                  onClick={() => setChildren(children + 1)}
                  className="w-8 h-8 rounded-r-xl bg-neutral-200 dark:bg-neutral-700 font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Hotel Tier */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-emerald-600" />
              <span data-i18n="bookingModal.chooseHotelCategory">{t('bookingModal.chooseHotelCategory')}</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['standard', 'deluxe', 'luxury'] as const).map((tier) => (
                <div
                  key={tier}
                  onClick={() => setHotelTier(tier)}
                  className={`cursor-pointer p-3.5 rounded-xl border-2 transition-all ${
                    hotelTier === tier
                      ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30'
                      : 'border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold capitalize text-neutral-900 dark:text-white">
                      {tier === 'standard'
                        ? t('bookingModal.tierStandard')
                        : tier === 'deluxe'
                        ? t('bookingModal.tierDeluxe')
                        : t('bookingModal.tierLuxury')}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">
                      {tier === 'standard' ? t('bookingModal.baseTag') : tier === 'deluxe' ? '+25%' : '+60%'}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    {tier === 'standard'
                      ? t('bookingModal.tierStandardDesc')
                      : tier === 'deluxe'
                      ? t('bookingModal.tierDeluxeDesc')
                      : t('bookingModal.tierLuxuryDesc')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Include Flights */}
          <div className="p-4 rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/30 dark:bg-teal-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Plane className="w-5 h-5 text-teal-600" />
                <div>
                  <h4 data-i18n="bookingModal.includeFlightsTitle" className="text-xs font-bold text-neutral-900 dark:text-white">
                    {t('bookingModal.includeFlightsTitle')}
                  </h4>
                  <p data-i18n="bookingModal.includeFlightsSub" className="text-[11px] text-neutral-500">
                    {t('bookingModal.includeFlightsSub')}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={includeFlights}
                onChange={(e) => setIncludeFlights(e.target.checked)}
                className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
              />
            </div>

            {includeFlights && (
              <div className="mt-4 pt-4 border-t border-teal-200/60 dark:border-teal-800/50 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label data-i18n="bookingModal.departureCity" className="block text-[11px] font-semibold mb-1">
                    {t('bookingModal.departureCity')}
                  </label>
                  <select
                    value={flightDepartureCity}
                    onChange={(e) => setFlightDepartureCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  >
                    <option value="New Delhi (DEL)">New Delhi (DEL)</option>
                    <option value="Mumbai (BOM)">Mumbai (BOM)</option>
                    <option value="Bengaluru (BLR)">Bengaluru (BLR)</option>
                    <option value="Hyderabad (HYD)">Hyderabad (HYD)</option>
                  </select>
                </div>
                <div>
                  <label data-i18n="bookingModal.cabinClass" className="block text-[11px] font-semibold mb-1">
                    {t('bookingModal.cabinClass')}
                  </label>
                  <select
                    value={flightCabinClass}
                    onChange={(e) => setFlightCabinClass(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  >
                    <option value="Economy">{t('flightsEngine.economy')} (+₹7,500)</option>
                    <option value="Premium Economy">{t('flightsEngine.premiumEconomy')} (+₹14,000)</option>
                    <option value="Business">{t('flightsEngine.business')} (+₹28,000)</option>
                  </select>
                </div>
                <div>
                  <label data-i18n="bookingModal.preferredAirline" className="block text-[11px] font-semibold mb-1">
                    {t('bookingModal.preferredAirline')}
                  </label>
                  <select
                    value={flightAirlinePref}
                    onChange={(e) => setFlightAirlinePref(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  >
                    <option value="Any (Cheapest Guaranteed)">{t('bookingModal.anyBestSchedule')}</option>
                    <option value="IndiGo">IndiGo</option>
                    <option value="Air India">Air India</option>
                    <option value="Emirates">Emirates</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Dedicated Car */}
          <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Car className="w-5 h-5 text-amber-600" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                    {t('bookingModal.includeCarTitle')} ({pkg.durationDays}D)
                  </h4>
                  <p data-i18n="bookingModal.includeCarSub" className="text-[11px] text-neutral-500">
                    {t('bookingModal.includeCarSub')}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={includeCar}
                onChange={(e) => setIncludeCar(e.target.checked)}
                className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
              />
            </div>

            {includeCar && (
              <div className="mt-4 pt-4 border-t border-amber-200/60 dark:border-amber-800/50 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Executive Sedan', 'Prime SUV', 'Luxury VIP'] as const).map((vType) => (
                  <div
                    key={vType}
                    onClick={() => setCarVehicleType(vType)}
                    className={`cursor-pointer p-3 rounded-xl border-2 ${
                      carVehicleType === vType ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40' : 'border-neutral-200 dark:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>
                        {vType === 'Executive Sedan'
                          ? t('bookingModal.execSedan')
                          : vType === 'Prime SUV'
                          ? t('bookingModal.primeSuv')
                          : t('bookingModal.luxuryVip')}
                      </span>
                      <span className="text-amber-700">
                        {vType === 'Executive Sedan' ? '₹2,800/d' : vType === 'Prime SUV' ? '₹4,500/d' : '₹9,500/d'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Add-On Services */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span data-i18n="bookingModal.recommendedAddons">{t('bookingModal.recommendedAddons')}</span>
            </label>
            <div className="space-y-2">
              {BOOKING_ADDONS.map((addon) => {
                const isChecked = selectedAddOns.includes(addon.id);
                const addonKey = addon.id.replace(/-/g, '_');
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddOn(addon.id)}
                    className={`cursor-pointer flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isChecked
                        ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                        : 'border-neutral-200 dark:border-neutral-700/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-neutral-300 dark:border-neutral-600'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-900 dark:text-white">
                          {t(`bookingModal.addon_${addonKey}_name`, { defaultValue: addon.name })}
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          {t(`bookingModal.addon_${addonKey}_desc`, { defaultValue: addon.description })}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-neutral-900 dark:text-white shrink-0 ml-3">
                      +{formatPrice(addon.priceINR, currency)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 6: Coupon */}
          <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/60">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span data-i18n="bookingModal.applyCouponTitle">{t('bookingModal.applyCouponTitle')}</span>
              </label>
              <span data-i18n="bookingModal.tryCoupons" className="text-[10px] text-neutral-500 font-medium">
                {t('bookingModal.tryCoupons')}
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t('bookingModal.couponPlaceholder')}
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 uppercase px-3 py-2 text-xs font-bold bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                data-i18n="bookingModal.applyBtn"
                className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold rounded-xl cursor-pointer"
              >
                {t('bookingModal.applyBtn')}
              </button>
            </div>
            {appliedCoupon && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1.5">
                {t('bookingModal.couponApplied', {
                  code: appliedCoupon,
                  amount: formatPrice(discountINR, currency),
                })}
              </p>
            )}
            {couponError && <p className="text-xs text-rose-500 font-medium mt-1.5">{couponError}</p>}
          </div>

          {/* Section 7: Lead Traveler */}
          <div>
            <h4
              data-i18n="bookingModal.leadTravelerTitle"
              className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-3"
            >
              {t('bookingModal.leadTravelerTitle')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label
                  data-i18n="bookingModal.fullNameLabel"
                  className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1"
                >
                  {t('bookingModal.fullNameLabel')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('bookingModal.fullNamePlaceholder')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white"
                />
              </div>
              <div>
                <label
                  data-i18n="bookingModal.emailLabel"
                  className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1"
                >
                  {t('bookingModal.emailLabel')}
                </label>
                <input
                  type="email"
                  required
                  placeholder={t('bookingModal.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white"
                />
              </div>
              <div>
                <label
                  data-i18n="bookingModal.phoneLabel"
                  className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1"
                >
                  {t('bookingModal.phoneLabel')}
                </label>
                <input
                  type="tel"
                  required
                  placeholder={t('bookingModal.phonePlaceholder')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label
                data-i18n="bookingModal.specialRequestsLabel"
                className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1"
              >
                {t('bookingModal.specialRequestsLabel')}
              </label>
              <textarea
                rows={2}
                placeholder={t('bookingModal.specialRequestsPlaceholder')}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          {/* Section 8: Payment Mode & QR */}
          <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700/70 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span data-i18n="bookingModal.selectPaymentMode">{t('bookingModal.selectPaymentMode')}</span>
              </h3>
              <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span data-i18n="bookingModal.encryptedBadge">{t('bookingModal.encryptedBadge')}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'UPI'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span data-i18n="bookingModal.upiQr" className="text-xs font-bold">
                    {t('bookingModal.upiQr')}
                  </span>
                </div>
                <p data-i18n="bookingModal.upiApps" className="text-[10px] text-neutral-500">
                  {t('bookingModal.upiApps')}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'Card'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-4 h-4 text-teal-600" />
                  <span data-i18n="bookingModal.cards" className="text-xs font-bold">
                    {t('bookingModal.cards')}
                  </span>
                </div>
                <p data-i18n="bookingModal.cardTypes" className="text-[10px] text-neutral-500">
                  {t('bookingModal.cardTypes')}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NetBanking')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'NetBanking'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Landmark className="w-4 h-4 text-cyan-600" />
                  <span data-i18n="bookingModal.netBanking" className="text-xs font-bold">
                    {t('bookingModal.netBanking')}
                  </span>
                </div>
                <p data-i18n="bookingModal.banksList" className="text-[10px] text-neutral-500">
                  {t('bookingModal.banksList')}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('PartialAdvance')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'PartialAdvance'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span data-i18n="bookingModal.advance25" className="text-xs font-bold">
                    {t('bookingModal.advance25')}
                  </span>
                </div>
                <p data-i18n="bookingModal.pay75Checkin" className="text-[10px] text-neutral-500">
                  {t('bookingModal.pay75Checkin')}
                </p>
              </button>
            </div>

            {(paymentMethod === 'UPI' || paymentMethod === 'PartialAdvance') && (
              <div className="p-4 sm:p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                    <UpiQrCodeSvg
                      upiId={upiVpa}
                      payeeName="Wanderlust Tours and Travels"
                      amountINR={payableAmountINR}
                      transactionNote={`Booking-${pkg.id}`}
                      size={168}
                    />
                    <div className="mt-3 text-center space-y-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> PhonePe & UPI Verified
                      </span>
                      <p className="text-[10px] text-neutral-500">
                        Scan with PhonePe, GPay, Paytm, BHIM
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-3">
                    <div className="p-3 bg-neutral-50 dark:bg-neutral-800/70 rounded-xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-neutral-500">Primary UPI Mobile</p>
                        <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                          {upiNumber} / 6364848532
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyNumber}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedNumber ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedNumber ? 'Copied!' : 'Copy Number'}
                      </button>
                    </div>

                    <div className="p-3 bg-neutral-50 dark:bg-neutral-800/70 rounded-xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-neutral-500">Direct UPI VPA ID</p>
                        <p className="text-xs font-bold text-neutral-900 dark:text-white font-mono">
                          {upiVpa} (or 6364848532@upi)
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyUpiId}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedUpi ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedUpi ? 'Copied!' : 'Copy UPI ID'}
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300">
                          Enter 12-Digit UPI / UTR Transaction ID *
                        </label>
                        <button
                          type="button"
                          onClick={handleAutoFillUtr}
                          className="text-[10px] text-emerald-600 font-bold hover:underline cursor-pointer"
                        >
                          Auto-fill Test UTR
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. 326484859012"
                        value={upiUtrInput}
                        onChange={(e) => setUpiUtrInput(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono font-bold bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1">Expiry Date (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'NetBanking' && (
              <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-3">
                <label className="block text-xs font-bold">Select Your Indian Bank</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'State Bank of India (SBI)',
                    'HDFC Bank',
                    'ICICI Bank',
                    'Axis Bank',
                    'Kotak Mahindra',
                    'Punjab National Bank',
                  ].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left truncate cursor-pointer ${
                        selectedBank === bank
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                          : 'border-neutral-200 dark:border-neutral-700'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cost Breakdown */}
          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 space-y-2">
            <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-300">
              <span>
                {t('bookingModal.tourBaseSummary', {
                  adults,
                  children,
                  tier: hotelTier.toUpperCase(),
                })}
              </span>
              <span className="font-semibold">{formatPrice(packageTotalINR, currency)}</span>
            </div>
            {bundledFlightCostINR > 0 && (
              <div className="flex justify-between text-xs text-teal-600 dark:text-teal-400 font-bold">
                <span>{t('bookingModal.bundledFlightsSummary', { city: flightDepartureCity })}</span>
                <span>+{formatPrice(bundledFlightCostINR, currency)}</span>
              </div>
            )}
            {bundledCarCostINR > 0 && (
              <div className="flex justify-between text-xs text-amber-600 dark:text-amber-400 font-bold">
                <span>
                  {t('bookingModal.dedicatedCarSummary', {
                    car: carVehicleType,
                    days: pkg.durationDays,
                  })}
                </span>
                <span>+{formatPrice(bundledCarCostINR, currency)}</span>
              </div>
            )}
            {discountINR > 0 && (
              <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                <span>{t('bookingModal.couponDiscountSummary', { code: appliedCoupon })}</span>
                <span>-{formatPrice(discountINR, currency)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800 flex justify-between items-baseline">
              <span
                data-i18n="bookingModal.finalPayableAmount"
                className="text-sm font-bold text-neutral-900 dark:text-white"
              >
                {t('bookingModal.finalPayableAmount')}
              </span>
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                {formatPrice(grandTotalINR, currency)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              data-i18n="bookingModal.cancel"
              className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 cursor-pointer"
            >
              {t('bookingModal.cancel')}
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <span data-i18n="bookingModal.confirmProceed">{t('bookingModal.confirmProceed')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
