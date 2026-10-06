import React from 'react';
import { Printer, CheckCircle2, ShieldCheck, Calendar, Users, MapPin, Phone, Mail, Download, X } from 'lucide-react';
import { BookingRecord, CurrencyCode, formatPrice } from '../data/travelData';
import { UpiQrCodeSvg } from './UpiQrCodeSvg';

interface VoucherModalProps {
  booking: BookingRecord;
  currency: CurrencyCode;
  onClose: () => void;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({
  booking,
  currency,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const payableShown = booking.advancePaidINR || booking.totalAmountINR;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Top Action Bar (Hidden in Print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium">
              Official Travel Voucher & Payment Receipt · {booking.id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              aria-label="Close voucher"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Brand + Status */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <p className="text-xs uppercase tracking-widest text-teal-700 font-semibold">
                Wanderlust Tours & Travels
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mt-1 font-serif-display">
                Confirmed Holiday E-Voucher
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                24/7 Concierge Desk: +91 87926 58635 · UPI Merchant: 6364848532@upi
              </p>
            </div>
            <div className="sm:text-right">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  {booking.status} · {booking.paymentStatus}
                </span>
              </div>
              <p className="font-mono-tabular text-lg font-bold text-slate-900 mt-1">
                Ref: {booking.id}
              </p>
              <p className="text-xs text-slate-500">
                Issued: {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Package & Guest Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Itinerary & Package Details
              </p>
              <h3 className="text-lg font-bold text-slate-900">
                {booking.packageTitle}
              </h3>
              <div className="space-y-1.5 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>{booking.destination}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Departure Date: {booking.departureDate}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>
                    {booking.adultsCount} Adults
                    {booking.childrenCount > 0 ? ` · ${booking.childrenCount} Children` : ''}
                  </span>
                </p>
              </div>
              <div className="pt-2 text-xs text-slate-500">
                <span>Stay Tier: {booking.hotelTier.toUpperCase()}</span>
                <span className="mx-2">·</span>
                <span>Transport: {booking.transportType.replace('_', ' ').toUpperCase()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Lead Traveler & Payment Record
              </p>
              <h3 className="text-lg font-bold text-slate-900">
                {booking.customerName}
              </h3>
              <div className="space-y-1.5 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>{booking.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>{booking.email}</span>
                </p>
              </div>
              <div className="pt-2 space-y-1 text-xs text-slate-600 font-mono-tabular">
                <p>Payment Mode: {booking.paymentMethod} ({booking.paymentStatus})</p>
                <p>UTR / Txn Ref: {booking.transactionRef || 'VERIFIED-COUNTER'}</p>
                {booking.upiNumber && <p>Merchant UPI Mobile: {booking.upiNumber}</p>}
              </div>
            </div>
          </div>

          {/* Financial Breakdown & QR Verification Stamp */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="space-y-2 w-full sm:w-auto">
              <div className="flex items-center justify-between sm:justify-start sm:gap-8 text-sm text-slate-600">
                <span>Package Gross Value:</span>
                <span className="font-mono-tabular font-medium">
                  {formatPrice(booking.totalAmountINR + (booking.discountINR || 0), currency)}
                </span>
              </div>
              {booking.discountINR > 0 && (
                <div className="flex items-center justify-between sm:justify-start sm:gap-8 text-sm text-emerald-700">
                  <span>Privilege Discount ({booking.couponCode}):</span>
                  <span className="font-mono-tabular font-medium">
                    -{formatPrice(booking.discountINR, currency)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between sm:justify-start sm:gap-8 text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Net Package Amount:</span>
                <span className="font-mono-tabular text-lg text-teal-800">
                  {formatPrice(booking.totalAmountINR, currency)} (₹{booking.totalAmountINR.toLocaleString('en-IN')})
                </span>
              </div>
              {booking.paymentMethod === 'Advance20' && (
                <p className="text-xs text-amber-800 font-mono-tabular">
                  20% Advance Paid: ₹{payableShown.toLocaleString('en-IN')} · Balance on Arrival: ₹
                  {(booking.totalAmountINR - payableShown).toLocaleString('en-IN')}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center shrink-0">
              <UpiQrCodeSvg
                upiId="6364848532@upi"
                payeeName="Wanderlust Tours"
                amountINR={payableShown}
                transactionNote={`Voucher ${booking.id}`}
                size={104}
              />
              <span className="text-[11px] font-mono-tabular text-slate-500 mt-1.5">
                Verified · 6364848532@upi
              </span>
            </div>
          </div>

          {booking.notes && (
            <div className="text-xs text-slate-600 border-t border-slate-200 pt-4">
              <span className="font-semibold text-slate-800">Special Concierge Notes: </span>
              {booking.notes}
            </div>
          )}

          {/* Footer Disclaimer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-slate-200 text-xs text-slate-500">
            <p>
              Please carry a valid government photo ID (Aadhaar / Passport) at airport & hotel check-in.
            </p>
            <button
              onClick={handlePrint}
              className="no-print inline-flex items-center gap-1 text-teal-700 font-semibold hover:underline cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download Printable Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
