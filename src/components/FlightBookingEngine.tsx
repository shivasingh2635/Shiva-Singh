import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plane,
  ArrowRightLeft,
  Users,
  Check,
  Luggage,
  Armchair,
  X,
  Ticket,
  CheckCircle2,
} from 'lucide-react';
import { FlightOffer, Currency, BookingRecord } from '../types';
import { AIRPORTS_LIST, SAMPLE_FLIGHTS } from '../data/travelServices';
import { formatPrice } from '../data/packages';

interface FlightBookingEngineProps {
  currency: Currency;
  onBookFlight: (booking: BookingRecord) => void;
  onOpenMyTrips: () => void;
}

export const FlightBookingEngine: React.FC<FlightBookingEngineProps> = ({
  currency,
  onBookFlight,
  onOpenMyTrips,
}) => {
  const { t } = useTranslation();
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('oneWay');
  const [fromAirportCode, setFromAirportCode] = useState<string>('DEL');
  const [toAirportCode, setToAirportCode] = useState<string>('DXB');
  const [departureDate, setDepartureDate] = useState<string>('2026-10-15');
  const [returnDate, setReturnDate] = useState<string>('2026-10-22');
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [cabinClass, setCabinClass] = useState<'Economy' | 'Premium Economy' | 'Business' | 'First'>('Economy');

  const [selectedAirline, setSelectedAirline] = useState<string>('all');
  const [selectedStops, setSelectedStops] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'cheapest' | 'fastest' | 'rating'>('cheapest');

  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string>('12F');
  const [seatPriceINR, setSeatPriceINR] = useState<number>(350);
  const [passengerName, setPassengerName] = useState<string>('');
  const [passengerEmail, setPassengerEmail] = useState<string>('');
  const [passengerPhone, setPassengerPhone] = useState<string>('');
  const [passportNumber, setPassportNumber] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('FLYINDIA');
  const [appliedDiscountINR, setAppliedDiscountINR] = useState<number>(1500);
  const [isConfirmedModalOpen, setIsConfirmedModalOpen] = useState<boolean>(false);
  const [generatedPNR, setGeneratedPNR] = useState<string>('');

  const handleSwapAirports = () => {
    const temp = fromAirportCode;
    setFromAirportCode(toAirportCode);
    setToAirportCode(temp);
  };

  const totalPassengers = adults + children;

  const filteredFlights = useMemo(() => {
    return SAMPLE_FLIGHTS.filter((flight) => {
      if (selectedAirline !== 'all' && flight.airline !== selectedAirline) return false;
      if (selectedStops === 'nonstop' && flight.stops !== 0) return false;
      if (selectedStops === '1stop' && flight.stops !== 1) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'cheapest') return a.priceINR - b.priceINR;
      if (sortBy === 'fastest') return parseFloat(a.duration) - parseFloat(b.duration);
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [selectedAirline, selectedStops, sortBy]);

  const handleConfirmFlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlight || !passengerName.trim() || !passengerPhone.trim()) return;

    const pnrCode = `WL-${Math.floor(100000 + Math.random() * 900000)}`;
    const baseAirfare = selectedFlight.priceINR * totalPassengers;
    const taxesAndFees = Math.round(baseAirfare * 0.12);
    const finalAmountINR = Math.max(1000, baseAirfare + taxesAndFees + seatPriceINR - appliedDiscountINR);

    const newBooking: BookingRecord = {
      id: `FLIGHT-${Date.now()}`,
      serviceType: 'flight',
      packageId: selectedFlight.id,
      packageTitle: `${selectedFlight.airline} (${selectedFlight.flightNumber}): ${selectedFlight.fromCode} → ${selectedFlight.toCode}`,
      destination: selectedFlight.toCity,
      customerName: passengerName,
      email: passengerEmail || 'guest@wanderlust.com',
      phone: passengerPhone,
      adultsCount: adults,
      childrenCount: children,
      departureDate,
      hotelTier: 'standard',
      transportType: 'shared',
      addOns: [`Aircraft Seat: ${selectedSeat}`, `Cabin Luggage: ${selectedFlight.cabinBaggage}`],
      couponCode: couponCode || undefined,
      discountINR: appliedDiscountINR,
      totalAmountINR: finalAmountINR,
      advancePaidINR: finalAmountINR,
      balanceDueINR: 0,
      selectedCurrency: currency,
      status: 'Confirmed',
      checkedIn: true,
      flightDetails: {
        pnr: pnrCode,
        airline: selectedFlight.airline,
        flightNumber: selectedFlight.flightNumber,
        fromAirport: `${selectedFlight.fromCity} (${selectedFlight.fromCode})`,
        toAirport: `${selectedFlight.toCity} (${selectedFlight.toCode})`,
        departureTime: selectedFlight.departureTime,
        arrivalTime: selectedFlight.arrivalTime,
        cabinClass,
        seatNumber: selectedSeat,
        cabinBaggage: selectedFlight.cabinBaggage,
        checkInBaggage: selectedFlight.checkInBaggage,
        isRoundTrip: tripType === 'roundTrip',
        returnDate: tripType === 'roundTrip' ? returnDate : undefined,
        passengers: [
          {
            name: passengerName,
            gender: 'Adult',
            ageGroup: 'Adult',
            passportNumber: passportNumber || undefined,
          },
        ],
      },
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      transactionRef: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: new Date().toISOString(),
    };

    onBookFlight(newBooking);
    setGeneratedPNR(pnrCode);
    setIsConfirmedModalOpen(true);
    setSelectedFlight(null);
  };

  return (
    <section id="flights-section" className="scroll-mt-24 space-y-8">
      <div className="bg-gradient-to-r from-teal-900 via-neutral-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-teal-800/40">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Plane className="w-3.5 h-3.5" />
            <span data-i18n="flightsEngine.kicker">{t('flightsEngine.kicker')}</span>
          </div>
          <h2
            data-i18n="flightsEngine.title"
            className="text-2xl sm:text-3xl font-black tracking-tight font-['Playfair_Display',serif]"
          >
            {t('flightsEngine.title')}
          </h2>
          <p data-i18n="flightsEngine.subtitle" className="text-xs sm:text-sm text-teal-100/80">
            {t('flightsEngine.subtitle')}
          </p>
        </div>

        <div className="mt-6 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-2xl p-4 sm:p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setTripType('oneWay')}
                data-i18n="flightsEngine.oneWay"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  tripType === 'oneWay' ? 'bg-emerald-600 text-white' : 'text-neutral-600 dark:text-neutral-300'
                }`}
              >
                {t('flightsEngine.oneWay')}
              </button>
              <button
                type="button"
                onClick={() => setTripType('roundTrip')}
                data-i18n="flightsEngine.roundTrip"
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  tripType === 'roundTrip' ? 'bg-emerald-600 text-white' : 'text-neutral-600 dark:text-neutral-300'
                }`}
              >
                {t('flightsEngine.roundTrip')}
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <Users className="w-4 h-4 text-emerald-600" />
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1.5 rounded-lg font-bold"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} {n > 1 ? t('flightsEngine.travelers') : t('flightsEngine.traveler')}
                  </option>
                ))}
              </select>
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value as any)}
                className="bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1.5 rounded-lg font-bold"
              >
                <option value="Economy">{t('flightsEngine.economy')}</option>
                <option value="Premium Economy">{t('flightsEngine.premiumEconomy')}</option>
                <option value="Business">{t('flightsEngine.business')}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4 items-center">
            <div className="md:col-span-4 space-y-1">
              <label
                data-i18n="flightsEngine.departureFrom"
                className="text-[10px] font-bold uppercase tracking-wider text-neutral-500"
              >
                {t('flightsEngine.departureFrom')}
              </label>
              <select
                value={fromAirportCode}
                onChange={(e) => setFromAirportCode(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-xs font-bold"
              >
                {AIRPORTS_LIST.map((ap) => (
                  <option key={ap.code} value={ap.code}>
                    {ap.city} ({ap.code}) - {ap.country}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-1 flex justify-center pt-2 md:pt-4">
              <button
                type="button"
                onClick={handleSwapAirports}
                className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-emerald-100 flex items-center justify-center border border-neutral-200 dark:border-neutral-700 cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="md:col-span-4 space-y-1">
              <label
                data-i18n="flightsEngine.arrivalDestination"
                className="text-[10px] font-bold uppercase tracking-wider text-neutral-500"
              >
                {t('flightsEngine.arrivalDestination')}
              </label>
              <select
                value={toAirportCode}
                onChange={(e) => setToAirportCode(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-xs font-bold"
              >
                {AIRPORTS_LIST.map((ap) => (
                  <option key={ap.code} value={ap.code}>
                    {ap.city} ({ap.code}) - {ap.country}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 space-y-1">
              <label
                data-i18n="flightsEngine.departureDate"
                className="text-[10px] font-bold uppercase tracking-wider text-neutral-500"
              >
                {t('flightsEngine.departureDate')}
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-semibold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <span className="text-sm font-bold text-neutral-900 dark:text-white">
            <span data-i18n="flightsEngine.availableFlights">{t('flightsEngine.availableFlights')}</span> ({filteredFlights.length})
          </span>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={selectedAirline}
              onChange={(e) => setSelectedAirline(e.target.value)}
              className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 rounded-xl font-semibold"
            >
              <option value="all">{t('flightsEngine.allAirlines')}</option>
              <option value="IndiGo">IndiGo</option>
              <option value="Air India">Air India</option>
              <option value="Emirates">Emirates</option>
              <option value="Vistara">Vistara</option>
              <option value="Singapore Airlines">Singapore Airlines</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold"
            >
              <option value="cheapest">{t('flightsEngine.sortCheapest')}</option>
              <option value="fastest">{t('flightsEngine.sortFastest')}</option>
              <option value="rating">{t('flightsEngine.sortRating')}</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredFlights.map((flight) => (
            <div
              key={flight.id}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-teal-600 dark:text-teal-400 font-black text-sm border border-neutral-200 dark:border-neutral-700">
                  {flight.airlineCode}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-neutral-900 dark:text-white">{flight.airline}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">{flight.flightNumber}</span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    {flight.aircraft} · {flight.cabinClass}
                  </p>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-between max-w-md">
                <div className="text-left">
                  <p className="text-lg font-black text-neutral-900 dark:text-white">{flight.departureTime}</p>
                  <p className="text-xs font-bold text-neutral-600 dark:text-neutral-300">{flight.fromCode}</p>
                </div>
                <div className="flex flex-col items-center px-4">
                  <span className="text-[11px] font-medium text-neutral-500">{flight.duration}</span>
                  <div className="w-24 h-0.5 bg-neutral-300 dark:bg-neutral-700 my-1.5 flex items-center justify-center">
                    <Plane className="w-3.5 h-3.5 text-emerald-600 rotate-90" />
                  </div>
                  <span data-i18n="flightsEngine.nonStop" className="text-[10px] font-bold text-emerald-600">
                    {t('flightsEngine.nonStop')}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-neutral-900 dark:text-white">{flight.arrivalTime}</p>
                  <p className="text-xs font-bold text-neutral-600 dark:text-neutral-300">{flight.toCode}</p>
                </div>
              </div>

              <div className="hidden lg:flex flex-col text-xs text-neutral-500 space-y-1">
                <span className="flex items-center gap-1">
                  <Luggage className="w-3.5 h-3.5 text-emerald-600" /> {t('flightsEngine.cabinBag')}: {flight.cabinBaggage}
                </span>
                <span className="flex items-center gap-1">
                  <Luggage className="w-3.5 h-3.5 text-teal-600" /> {t('flightsEngine.checkInBag')}: {flight.checkInBaggage}
                </span>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-neutral-100 dark:border-neutral-800">
                <div>
                  <span data-i18n="flightsEngine.totalPerTraveler" className="text-xs text-neutral-400">
                    {t('flightsEngine.totalPerTraveler')}
                  </span>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {formatPrice(flight.priceINR, currency)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFlight(flight)}
                  className="mt-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Armchair className="w-3.5 h-3.5" />
                  <span data-i18n="flightsEngine.selectSeatMap">{t('flightsEngine.selectSeatMap')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seat & Passenger Modal */}
      {selectedFlight && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-teal-900 text-white">
              <div>
                <h3 data-i18n="flightsEngine.configureTitle" className="text-base font-bold">
                  {t('flightsEngine.configureTitle')}
                </h3>
                <p className="text-xs text-teal-200">
                  {selectedFlight.airline} {selectedFlight.flightNumber} · {selectedFlight.fromCity} → {selectedFlight.toCity}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFlight(null)}
                className="p-1.5 rounded-lg text-teal-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmFlight} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label data-i18n="flightsEngine.fullPassengerName" className="text-xs font-semibold">
                    {t('flightsEngine.fullPassengerName')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Malhotra"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label data-i18n="flightsEngine.phoneNumber" className="text-xs font-semibold">
                    {t('flightsEngine.phoneNumber')}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label data-i18n="flightsEngine.seatSelection" className="text-xs font-semibold">
                    {t('flightsEngine.seatSelection')}
                  </label>
                  <select
                    value={selectedSeat}
                    onChange={(e) => setSelectedSeat(e.target.value)}
                    className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="12A">12A ({t('flightsEngine.windowSeat')})</option>
                    <option value="12C">12C ({t('flightsEngine.aisleSeat')})</option>
                    <option value="12F">12F ({t('flightsEngine.windowSeat')})</option>
                    <option value="10A">10A ({t('flightsEngine.extraLegroom')})</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <span data-i18n="flightsEngine.totalAirfareTaxes" className="text-xs text-neutral-500">
                    {t('flightsEngine.totalAirfareTaxes')}
                  </span>
                  <p className="text-2xl font-black text-emerald-600">
                    {formatPrice(
                      Math.max(
                        1000,
                        selectedFlight.priceINR * totalPassengers +
                          Math.round(selectedFlight.priceINR * totalPassengers * 0.12) +
                          seatPriceINR -
                          appliedDiscountINR
                      ),
                      currency
                    )}
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span data-i18n="flightsEngine.confirmIssueTicket">{t('flightsEngine.confirmIssueTicket')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isConfirmedModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 data-i18n="flightsEngine.bookingConfirmed" className="text-xl font-bold">
              {t('flightsEngine.bookingConfirmed')}
            </h3>
            <p className="text-2xl font-black font-mono text-emerald-600 tracking-widest">{generatedPNR}</p>
            <button
              type="button"
              onClick={() => {
                setIsConfirmedModalOpen(false);
                onOpenMyTrips();
              }}
              data-i18n="flightsEngine.viewInMyTrips"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              {t('flightsEngine.viewInMyTrips')}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
