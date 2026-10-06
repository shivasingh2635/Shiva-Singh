import React, { useState } from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import { BookingRecord, Currency } from '../types';

interface AdminEditBookingModalProps {
  booking: BookingRecord;
  currency: Currency;
  onSave: (updated: BookingRecord) => void;
  onClose: () => void;
}

export const AdminEditBookingModal: React.FC<AdminEditBookingModalProps> = ({
  booking,
  onSave,
  onClose,
}) => {
  const [customerName, setCustomerName] = useState(booking.customerName);
  const [phone, setPhone] = useState(booking.phone);
  const [email, setEmail] = useState(booking.email || '');
  const [packageTitle, setPackageTitle] = useState(booking.packageTitle);
  const [destination, setDestination] = useState(booking.destination);
  const [departureDate, setDepartureDate] = useState(booking.departureDate);
  const [status, setStatus] = useState<BookingRecord['status']>(booking.status);
  const [paymentStatus, setPaymentStatus] = useState(booking.paymentStatus);
  const [transactionRef, setTransactionRef] = useState(booking.transactionRef || '');
  const [totalAmountINR, setTotalAmountINR] = useState<number>(booking.totalAmountINR);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...booking,
      customerName,
      phone,
      email,
      packageTitle,
      destination,
      departureDate,
      status,
      paymentStatus,
      transactionRef,
      totalAmountINR: Number(totalAmountINR),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Edit3 className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-black">
              Edit Booking Record: <span className="font-mono text-purple-600">{booking.id}</span>
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-neutral-500 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Passenger Full Name</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Contact Mobile</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Departure Date</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1">Total Amount (₹)</label>
              <input
                type="number"
                value={totalAmountINR}
                onChange={(e) => setTotalAmountINR(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-bold"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Checked-In">Checked-In</option>
                <option value="Pending Payment">Pending Payment</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">UTR / Ref</label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
              />
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-neutral-300 font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Booking Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
