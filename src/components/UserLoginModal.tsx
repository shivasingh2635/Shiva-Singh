import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Ticket,
  LogOut,
  CheckCheck,
  QrCode,
  Plane,
  Search,
  Printer,
} from 'lucide-react';
import { CustomerUser, BookingRecord } from '../types';

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CustomerUser | null;
  onLoginSuccess: (user: CustomerUser) => void;
  onLogout: () => void;
  userBookings: BookingRecord[];
  onOpenPayment?: (booking: BookingRecord) => void;
  onCheckInBooking?: (
    bookingId: string,
    checkInDetails: { seat: string; meal: string; idType: string; idNumber: string; checkedInAt: string }
  ) => void;
}

export const UserLoginModal: React.FC<UserLoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  userBookings = [],
  onOpenPayment,
  onCheckInBooking,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [identifier, setIdentifier] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('519284');
  const [errorMsg, setErrorMsg] = useState('');

  const [checkingInBooking, setCheckingInBooking] = useState<BookingRecord | null>(null);
  const [seatPreference, setSeatPreference] = useState('Window Seat (12A)');
  const [mealPreference, setMealPreference] = useState('Pure Vegetarian (Jain / Indian)');
  const [govIdType, setGovIdType] = useState('Aadhaar Card');
  const [govIdNumber, setGovIdNumber] = useState('');
  const [viewingPassBooking, setViewingPassBooking] = useState<BookingRecord | null>(null);

  const [authMode, setAuthMode] = useState<'login' | 'lookup'>('login');
  const [directPnrQuery, setDirectPnrQuery] = useState('');
  const [pnrResults, setPnrResults] = useState<BookingRecord[]>([]);

  const handlePnrSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = directPnrQuery.trim();
    if (!query) return;
    const localMatches = userBookings.filter(
      (b) =>
        b.id.toLowerCase().includes(query.toLowerCase()) ||
        (b.phone || '').includes(query) ||
        (b.customerName || '').toLowerCase().includes(query.toLowerCase())
    );
    if (localMatches.length > 0) {
      setPnrResults(localMatches);
      return;
    }
    try {
      const res = await fetch(`/api/bookings/lookup?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setPnrResults(data.bookings || []);
    } catch {
      setPnrResults([]);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    const genOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtp(genOtp);
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim() !== simulatedOtp && otpCode.trim() !== '123456') {
      setErrorMsg(`Invalid code. Enter ${simulatedOtp}`);
      return;
    }
    const isEmail = identifier.includes('@');
    const newUser: CustomerUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: customerName.trim() || 'Valued Traveler',
      email: isEmail ? identifier.trim() : 'traveler@wanderlust.com',
      phone: !isEmail ? identifier.trim() : '+91 98765 43210',
      joinedDate: new Date().toISOString().slice(0, 10),
      loyaltyTier: 'Gold Explorer',
      loyaltyPoints: 1250,
      lastLoginAt: new Date().toLocaleString(),
      status: 'Active',
      totalBookings: userBookings.length,
    };
    onLoginSuccess(newUser);
  };

  const handleConfirmCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkingInBooking || !govIdNumber.trim()) return;
    const payload = {
      seat: seatPreference,
      meal: mealPreference,
      idType: govIdType,
      idNumber: govIdNumber.trim(),
      checkedInAt: new Date().toLocaleString(),
    };
    if (onCheckInBooking) {
      onCheckInBooking(checkingInBooking.id, payload);
    }
    setViewingPassBooking({
      ...checkingInBooking,
      status: 'Checked-In',
      checkedIn: true,
      checkInDetails: payload,
    });
    setCheckingInBooking(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 text-white border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Traveler Portal ("My Trips")
              </span>
              <h2 className="text-base font-bold text-white">
                {currentUser ? `Welcome back, ${currentUser.name}` : 'Login or Lookup Booking PNR'}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {currentUser ? (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm">{currentUser.name}</h3>
                  <p className="text-xs text-neutral-500">
                    {currentUser.email} · {currentUser.phone}
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl border border-neutral-300 text-xs font-semibold text-rose-600 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  My Bookings & E-Tickets ({userBookings.length})
                </h4>
                {userBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-neutral-500">PNR: {b.id}</span>
                        <h5 className="font-bold text-xs mt-0.5">{b.packageTitle}</h5>
                        <span className="text-[11px] text-neutral-500">
                          Departure: <strong>{b.departureDate}</strong> · {b.adultsCount} Adults
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-600">{b.status}</span>
                        <span className="block text-xs font-black mt-1">₹{b.totalAmountINR.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-neutral-500 text-[11px]">Payment: {b.paymentStatus}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setViewingPassBooking(b)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5" /> View E-Ticket
                        </button>
                        {!b.checkedIn && (
                          <button
                            type="button"
                            onClick={() => setCheckingInBooking(b)}
                            className="px-3 py-1.5 rounded-xl bg-teal-600 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Plane className="w-3.5 h-3.5" /> Web Check-In
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-1.5">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    authMode === 'login' ? 'bg-white dark:bg-neutral-900 shadow-sm' : 'text-neutral-500'
                  }`}
                >
                  Sign In with Mobile / Email
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('lookup')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    authMode === 'lookup' ? 'bg-white dark:bg-neutral-900 text-emerald-600 shadow-sm' : 'text-neutral-500'
                  }`}
                >
                  Quick PNR / Booking Lookup
                </button>
              </div>

              {errorMsg && <div className="p-3 rounded-xl bg-rose-50 text-xs text-rose-700">{errorMsg}</div>}

              {authMode === 'lookup' ? (
                <div className="space-y-4">
                  <form onSubmit={handlePnrSearch} className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        required
                        placeholder="Enter Booking ID (e.g. BK-8698) or Phone"
                        value={directPnrQuery}
                        onChange={(e) => setDirectPnrQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                    >
                      Find Trip
                    </button>
                  </form>

                  {pnrResults.map((b) => (
                    <div key={b.id} className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <span className="text-xs font-mono font-bold text-emerald-600">{b.id}</span>
                          <h4 className="text-sm font-bold">{b.packageTitle}</h4>
                          <p className="text-xs text-neutral-500">Guest: {b.customerName}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setViewingPassBooking(b)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold h-fit cursor-pointer"
                        >
                          View Pass
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : step === 'input' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">Mobile Number or Email</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +91 98765 43210 or aarav.sharma@gmail.com"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Send 6-Digit OTP Code <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-center space-y-2">
                    <span className="text-xs text-neutral-500">Simulation OTP Code:</span>
                    <div className="text-sm font-mono font-bold text-emerald-600">{simulatedOtp}</div>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="Enter 6-Digit Code"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-center font-mono text-lg"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOtpCode(simulatedOtp)}
                      className="px-3 py-2 rounded-xl border border-neutral-300 text-xs cursor-pointer"
                    >
                      Fill Code
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                    >
                      Verify & Access Trips
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Web Check-in Popup */}
      {checkingInBooking && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-3">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-md w-full p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h3 className="text-sm font-bold">Online Web Check-In: {checkingInBooking.packageTitle}</h3>
            <form onSubmit={handleConfirmCheckIn} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Seat Preference</label>
                <select
                  value={seatPreference}
                  onChange={(e) => setSeatPreference(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                >
                  <option value="Window Seat (12A)">Window Seat (12A)</option>
                  <option value="Aisle Seat (12C)">Aisle Seat (12C)</option>
                  <option value="Extra Legroom (1A)">Extra Legroom (1A)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Govt ID Number *</label>
                <input
                  type="text"
                  required
                  placeholder="Aadhaar / Passport Number"
                  value={govIdNumber}
                  onChange={(e) => setGovIdNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCheckingInBooking(null)}
                  className="px-3 py-2 rounded-xl border flex-1 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold flex-1 cursor-pointer"
                >
                  Confirm Check-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* E-Ticket Pass Popup */}
      {viewingPassBooking && (
        <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-3">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-600">Official Digital E-Ticket</span>
                <h3 className="text-sm font-bold">{viewingPassBooking.packageTitle}</h3>
              </div>
              <button onClick={() => setViewingPassBooking(null)} className="p-1 text-neutral-400 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 space-y-2 text-xs">
              <p>
                Passenger: <strong>{viewingPassBooking.customerName}</strong>
              </p>
              <p>
                Booking Ref / PNR: <strong className="font-mono">{viewingPassBooking.id}</strong>
              </p>
              <p>
                Departure Date: <strong>{viewingPassBooking.departureDate}</strong>
              </p>
              <p>
                Status: <strong className="text-emerald-600">{viewingPassBooking.status}</strong>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Ticket
              </button>
              <button
                type="button"
                onClick={() => setViewingPassBooking(null)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
