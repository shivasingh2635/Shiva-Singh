import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Car,
  Users,
  Luggage,
  Check,
  X,
  PlaneTakeoff,
  PlaneLanding,
  CheckCircle2,
} from 'lucide-react';
import { CabVehicleOption, Currency, BookingRecord } from '../types';
import { SAMPLE_CABS } from '../data/travelServices';
import { formatPrice } from '../data/packages';

interface AirportCabEngineProps {
  currency: Currency;
  onBookCab: (booking: BookingRecord) => void;
  onOpenMyTrips: () => void;
}

export const AirportCabEngine: React.FC<AirportCabEngineProps> = ({
  currency,
  onBookCab,
  onOpenMyTrips,
}) => {
  const { t } = useTranslation();
  const [tripType, setTripType] = useState<'pickup' | 'drop' | 'outstation'>('pickup');
  const [selectedAirport, setSelectedAirport] = useState<string>('Delhi IGI Airport (DEL)');
  const [hotelOrCity, setHotelOrCity] = useState<string>('Central Connaught Place, New Delhi');
  const [pickupDate, setPickupDate] = useState<string>('2026-10-15');
  const [pickupTime, setPickupTime] = useState<string>('14:30');

  const [selectedCab, setSelectedCab] = useState<CabVehicleOption | null>(null);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [flightNumber, setFlightNumber] = useState<string>('6E-201');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string>('');

  const getFareINR = (cab: CabVehicleOption) => {
    if (tripType === 'pickup') return cab.flatAirportPickupINR;
    if (tripType === 'drop') return cab.flatAirportDropINR;
    return cab.baseRatePerKmINR * 120;
  };

  const handleConfirmCabBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCab || !customerName.trim() || !customerPhone.trim()) return;

    const fareINR = getFareINR(selectedCab);
    const bookingId = `CAB-${Date.now()}`;

    const newBooking: BookingRecord = {
      id: bookingId,
      serviceType: 'cab',
      packageId: selectedCab.id,
      packageTitle: `${selectedCab.category}: ${selectedCab.model}`,
      destination: tripType === 'pickup' ? hotelOrCity : selectedAirport,
      customerName,
      email: 'cabguest@wanderlust.com',
      phone: customerPhone,
      adultsCount: 2,
      childrenCount: 0,
      departureDate: `${pickupDate} ${pickupTime}`,
      hotelTier: 'standard',
      transportType: 'private_suv',
      addOns: [`Vehicle: ${selectedCab.model}`, '45-Min Flight Delay Protection'],
      discountINR: 0,
      totalAmountINR: fareINR,
      advancePaidINR: fareINR,
      balanceDueINR: 0,
      selectedCurrency: currency,
      status: 'Confirmed',
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      transactionRef: `CABTXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: new Date().toISOString(),
    };

    onBookCab(newBooking);
    setConfirmedBookingId(bookingId);
    setSelectedCab(null);
    setIsSuccessModalOpen(true);
  };

  return (
    <section id="cabs-section" className="scroll-mt-24 space-y-8">
      <div className="bg-gradient-to-r from-cyan-950 via-neutral-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-cyan-900/40">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Car className="w-3.5 h-3.5" />
            <span data-i18n="cabsEngine.kicker">{t('cabsEngine.kicker')}</span>
          </div>
          <h2
            data-i18n="cabsEngine.title"
            className="text-2xl sm:text-3xl font-black tracking-tight font-['Playfair_Display',serif]"
          >
            {t('cabsEngine.title')}
          </h2>
        </div>

        <div className="mt-6 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-2xl p-4 sm:p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setTripType('pickup')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                tripType === 'pickup' ? 'bg-cyan-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800'
              }`}
            >
              <PlaneLanding className="w-3.5 h-3.5" />
              <span data-i18n="cabsEngine.airportPickup">{t('cabsEngine.airportPickup')}</span>
            </button>
            <button
              type="button"
              onClick={() => setTripType('drop')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                tripType === 'drop' ? 'bg-cyan-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800'
              }`}
            >
              <PlaneTakeoff className="w-3.5 h-3.5" />
              <span data-i18n="cabsEngine.airportDrop">{t('cabsEngine.airportDrop')}</span>
            </button>
            <button
              type="button"
              onClick={() => setTripType('outstation')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                tripType === 'outstation' ? 'bg-cyan-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span data-i18n="cabsEngine.outstation">{t('cabsEngine.outstation')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-4">
            <div>
              <label
                data-i18n="cabsEngine.airport"
                className="text-[10px] font-bold uppercase tracking-wider text-neutral-500"
              >
                {t('cabsEngine.airport')}
              </label>
              <select
                value={selectedAirport}
                onChange={(e) => setSelectedAirport(e.target.value)}
                className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold"
              >
                <option value="Delhi IGI Airport (DEL)">Delhi IGI Airport (DEL)</option>
                <option value="Mumbai CSMIA (BOM)">Mumbai Airport (BOM)</option>
                <option value="Bengaluru Airport (BLR)">Bengaluru Airport (BLR)</option>
                <option value="Dubai International (DXB)">Dubai International (DXB)</option>
              </select>
            </div>
            <div>
              <label
                data-i18n="cabsEngine.dropCityAddress"
                className="text-[10px] font-bold uppercase tracking-wider text-neutral-500"
              >
                {t('cabsEngine.dropCityAddress')}
              </label>
              <input
                type="text"
                value={hotelOrCity}
                onChange={(e) => setHotelOrCity(e.target.value)}
                className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold"
              />
            </div>
            <div>
              <label
                data-i18n="cabsEngine.pickupDate"
                className="text-[10px] font-bold uppercase tracking-wider text-neutral-500"
              >
                {t('cabsEngine.pickupDate')}
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-semibold"
              />
            </div>
            <div>
              <label
                data-i18n="cabsEngine.pickupTime"
                className="text-[10px] font-bold uppercase tracking-wider text-neutral-500"
              >
                {t('cabsEngine.pickupTime')}
              </label>
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-semibold"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SAMPLE_CABS.map((cab) => (
          <div
            key={cab.id}
            className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 overflow-hidden">
                <img
                  src={cab.image}
                  alt={cab.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-base text-neutral-900 dark:text-white">{cab.name}</h3>
                  <p className="text-xs text-neutral-500">{cab.model}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-300">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-cyan-600" /> {cab.passengerCapacity}{' '}
                    <span data-i18n="cabsEngine.guests">{t('cabsEngine.guests')}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Luggage className="w-3.5 h-3.5 text-cyan-600" /> {cab.luggageCapacity}{' '}
                    <span data-i18n="cabsEngine.bags">{t('cabsEngine.bags')}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <span data-i18n="cabsEngine.fixedFare" className="text-[10px] text-neutral-400 font-medium">
                    {t('cabsEngine.fixedFare')}
                  </span>
                  <p className="text-xl font-black text-cyan-600 dark:text-cyan-400">
                    {formatPrice(getFareINR(cab), currency)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCab(cab)}
                  data-i18n="cabsEngine.bookRide"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  {t('cabsEngine.bookRide')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCab && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-cyan-950 text-white">
              <div>
                <h3 className="text-base font-bold">Schedule Airport Transfer</h3>
                <p className="text-xs text-cyan-200">
                  {selectedCab.name} · {selectedCab.model}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCab(null)}
                className="p-1.5 rounded-lg text-cyan-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmCabBooking} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold">Passenger Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Roy"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold">Flight No.</label>
                  <input
                    type="text"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs uppercase"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400">Total Fixed Fare</span>
                  <p className="text-xl font-black text-cyan-600">
                    {formatPrice(getFareINR(selectedCab), currency)}
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Confirm Chauffeur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <CheckCircle2 className="w-12 h-12 text-cyan-600 mx-auto" />
            <h3 className="text-xl font-bold">Chauffeur Dispatch Confirmed!</h3>
            <p className="text-lg font-mono font-bold text-cyan-600">{confirmedBookingId}</p>
            <button
              type="button"
              onClick={() => {
                setIsSuccessModalOpen(false);
                onOpenMyTrips();
              }}
              className="w-full py-2.5 bg-cyan-600 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              View in My Trips
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
