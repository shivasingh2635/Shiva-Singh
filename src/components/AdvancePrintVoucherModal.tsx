import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  Printer,
  Download,
  Edit3,
  Save,
  Compass,
  Calendar,
  MapPin,
  Users,
  ShieldCheck,
  Phone,
  Mail,
  QrCode,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { BookingRecord, Currency } from '../types';
import { formatPrice } from '../data/packages';
import { UpiQrCodeSvg } from './UpiQrCodeSvg';

interface AdvancePrintVoucherModalProps {
  booking: BookingRecord | null;
  currency: Currency;
  onClose: () => void;
  onSaveBooking?: (updated: BookingRecord) => void;
  adminWhatsAppNumber?: string;
}

export const AdvancePrintVoucherModal: React.FC<AdvancePrintVoucherModalProps> = ({
  booking,
  currency,
  onClose,
  onSaveBooking,
  adminWhatsAppNumber = '918792658635',
}) => {
  const { t } = useTranslation();
  if (!booking) return null;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    customerName: booking.customerName || '',
    phone: booking.phone || '',
    email: booking.email || '',
    packageTitle: booking.packageTitle || '',
    destination: booking.destination || '',
    departureDate: booking.departureDate || '',
    adultsCount: booking.adultsCount || 2,
    childrenCount: booking.childrenCount || 0,
    hotelTier: booking.hotelTier || 'deluxe',
    transportType: booking.transportType || 'private_suv',
    totalAmountINR: booking.totalAmountINR || 0,
    advancePaidINR:
      booking.advancePaidINR ||
      (booking.paymentStatus === 'Advance Paid' ? Math.round(booking.totalAmountINR * 0.25) : booking.totalAmountINR),
    discountINR: booking.discountINR || 0,
    paymentMethod: booking.paymentMethod || 'UPI',
    paymentStatus: booking.paymentStatus || 'Paid',
    transactionRef: booking.transactionRef || 'UPI-8792658635-8921',
    notes: booking.notes || 'Includes daily buffet breakfast, all inner-line permits, and private luxury transport.',
  });

  const balanceDueINR = Math.max(0, formData.totalAmountINR - formData.advancePaidINR);

  const handleSave = () => {
    const updated: BookingRecord = {
      ...booking,
      customerName: formData.customerName,
      phone: formData.phone,
      email: formData.email,
      packageTitle: formData.packageTitle,
      destination: formData.destination,
      departureDate: formData.departureDate,
      adultsCount: Number(formData.adultsCount),
      childrenCount: Number(formData.childrenCount),
      hotelTier: formData.hotelTier as any,
      transportType: formData.transportType as any,
      totalAmountINR: Number(formData.totalAmountINR),
      advancePaidINR: Number(formData.advancePaidINR),
      balanceDueINR,
      discountINR: Number(formData.discountINR),
      paymentMethod: formData.paymentMethod as any,
      paymentStatus: formData.paymentStatus as any,
      transactionRef: formData.transactionRef,
      notes: formData.notes,
    };
    if (onSaveBooking) {
      onSaveBooking(updated);
    }
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    const invoiceContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Wanderlust Tax Invoice - ${booking.id}</title>
  <style>
    body { font-family: sans-serif; margin: 40px; color: #111; line-height: 1.5; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 20px; }
    .brand { font-size: 22px; font-weight: bold; color: #065f46; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; }
    th { background: #f3f4f6; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">WANDERLUST TOURS & TRAVELS</div>
      <small>Helpline: +91 87926 58635 | PhonePe UPI: 8792658635@fam & 6364848532@upi</small>
    </div>
    <div>
      <strong>Booking Ref:</strong> ${booking.id}<br>
      <strong>Status:</strong> ${formData.paymentStatus}
    </div>
  </div>
  <p><strong>Passenger:</strong> ${formData.customerName} (${formData.phone})</p>
  <p><strong>Package:</strong> ${formData.packageTitle} — ${formData.destination}</p>
  <p><strong>Departure:</strong> ${formData.departureDate}</p>
  <table>
    <thead>
      <tr><th>Description</th><th>Total Amount</th></tr>
    </thead>
    <tbody>
      <tr><td>${formData.packageTitle}</td><td>₹${formData.totalAmountINR.toLocaleString('en-IN')}</td></tr>
      <tr><td>Paid Amount (${formData.paymentMethod} - Ref: ${formData.transactionRef})</td><td>₹${formData.advancePaidINR.toLocaleString('en-IN')}</td></tr>
      <tr><td>Remaining Balance Due</td><td>₹${balanceDueINR.toLocaleString('en-IN')}</td></tr>
    </tbody>
  </table>
</body>
</html>`;

    const blob = new Blob([invoiceContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Wanderlust_Voucher_${booking.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareWhatsApp = (sendToAdmin: boolean = true) => {
    const targetNumber = sendToAdmin
      ? adminWhatsAppNumber.replace(/[^0-9]/g, '') || '918792658635'
      : formData.phone.replace(/[^0-9]/g, '');

    const text = `*OFFICIAL TRAVEL VOUCHER & ACKNOWLEDGMENT*\nBooking ID: ${booking.id}\nPassenger: ${formData.customerName}\nPackage: ${formData.packageTitle}\nTravel Date: ${formData.departureDate}\nTotal Amount: ₹${formData.totalAmountINR.toLocaleString('en-IN')}\nUTR Ref: ${formData.transactionRef}`;
    const waUrl = targetNumber
      ? `https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.location.href = waUrl;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6">
      <div className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 bg-neutral-900 text-white border-b border-neutral-800 no-print">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-300" data-i18n="voucher.officialTitle">
              {t('voucher.officialTitle')}
            </span>
            <span className="text-[11px] text-neutral-400 block">
              <span data-i18n="voucher.bookingRef">{t('voucher.bookingRef')}</span>: <strong className="text-white font-mono">{booking.id}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                isEditing ? 'bg-purple-600 text-white' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? t('voucher.cancelEdit') : t('voucher.editVoucher')}</span>
            </button>

            {isEditing && (
              <button
                onClick={handleSave}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer"
                data-i18n="voucher.saveChanges"
              >
                <Save className="w-3.5 h-3.5" /> {t('voucher.saveChanges')}
              </button>
            )}

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              data-i18n="voucher.printSavePdf"
            >
              <Printer className="w-3.5 h-3.5" /> {t('voucher.printSavePdf')}
            </button>

            <button
              onClick={handleDownloadInvoice}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-neutral-700 cursor-pointer"
              data-i18n="voucher.exportFile"
            >
              <Download className="w-3.5 h-3.5" /> {t('voucher.exportFile')}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-white bg-neutral-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-6 py-2 flex items-center justify-center gap-2 no-print" data-i18n="voucher.savedSynced">
            <CheckCircle2 className="w-4 h-4" /> {t('voucher.savedSynced')}
          </div>
        )}

        {/* Printable Voucher Body */}
        <div
          id="printable-voucher"
          className="p-6 sm:p-8 overflow-y-auto space-y-6 text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-emerald-600 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight uppercase">
                  Wanderlust Tours & Travels
                </h1>
                <p className="text-xs text-neutral-500">
                  Govt. Regd. Tour Operator · IATA Accredited · GSTIN: 07AABCT2491Z1Z8
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-300 mt-1">
                  <span>
                    Helpline: <strong>+91 87926 58635</strong>
                  </span>
                  <span>·</span>
                  <span>
                    UPI ID: <strong className="font-mono">8792658635@fam / 6364848532@upi</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-500 text-emerald-800 dark:text-emerald-200 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {formData.paymentStatus.toUpperCase()}
              </div>
              <span className="text-[11px] text-neutral-500 mt-1 font-mono">INV: WL-{booking.id}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 space-y-2 text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5" data-i18n="voucher.primaryTraveler">
                <Users className="w-3.5 h-3.5" /> {t('voucher.primaryTraveler')}
              </span>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-300 rounded-lg font-bold"
                  />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-300 rounded-lg"
                  />
                </div>
              ) : (
                <>
                  <div className="text-base font-black text-neutral-900 dark:text-white">{formData.customerName}</div>
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{formData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{formData.email}</span>
                  </div>
                  <div className="pt-1 text-neutral-500">
                    <span data-i18n="voucher.totalTravelers">{t('voucher.totalTravelers')}</span>: <strong>{formData.adultsCount} {t('booking.adults')}</strong>,{' '}
                    <strong>{formData.childrenCount} {t('booking.children')}</strong>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 space-y-2 text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5" data-i18n="voucher.destinationSchedule">
                <MapPin className="w-3.5 h-3.5" /> {t('voucher.destinationSchedule')}
              </span>
              <div className="text-base font-black text-neutral-900 dark:text-white">{formData.packageTitle}</div>
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{formData.destination}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <span>
                  <span data-i18n="voucher.departureDate">{t('voucher.departureDate')}</span>: <strong>{formData.departureDate || 'Confirmed'}</strong>
                </span>
              </div>
              <div className="pt-1 text-neutral-500">
                <span data-i18n="voucher.stay">{t('voucher.stay')}</span>: <strong>{formData.hotelTier.toUpperCase()}</strong> · <span data-i18n="voucher.transport">{t('voucher.transport')}</span>:{' '}
                <strong>{formData.transportType === 'private_suv' ? 'Private SUV' : 'Shared Coach'}</strong>
              </div>
            </div>
          </div>

          {/* Financial Table */}
          <div className="border border-neutral-200 dark:border-neutral-700 rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300">
                <tr>
                  <th className="py-2.5 px-4 text-left" data-i18n="voucher.description">{t('voucher.description')}</th>
                  <th className="py-2.5 px-4 text-center" data-i18n="voucher.travelers">{t('voucher.travelers')}</th>
                  <th className="py-2.5 px-4 text-right" data-i18n="voucher.amount">{t('voucher.amount')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                <tr>
                  <td className="py-3 px-4">
                    <strong className="block text-neutral-900 dark:text-white">{formData.packageTitle}</strong>
                    <span className="text-[11px] text-neutral-500">
                      {formData.hotelTier.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold">
                    {formData.adultsCount + formData.childrenCount} Pax
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-neutral-900 dark:text-white">
                    {formatPrice(formData.totalAmountINR, currency)}
                  </td>
                </tr>
                <tr className="bg-emerald-50/50 dark:bg-emerald-950/20 font-bold">
                  <td className="py-2.5 px-4" colSpan={2}>
                    <span data-i18n="voucher.paidDeposit">{t('voucher.paidDeposit')}</span> ({formData.paymentMethod} · Ref: {formData.transactionRef})
                  </td>
                  <td className="py-2.5 px-4 text-right text-emerald-700 dark:text-emerald-400 font-black text-sm">
                    {formatPrice(formData.advancePaidINR, currency)}
                  </td>
                </tr>
                <tr className="bg-neutral-100 dark:bg-neutral-800 font-black text-sm">
                  <td className="py-3 px-4" colSpan={2} data-i18n="voucher.balanceDue">
                    {t('voucher.balanceDue')}
                  </td>
                  <td className="py-3 px-4 text-right text-amber-600 dark:text-amber-400">
                    {formatPrice(balanceDueINR, currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* QR Stamp */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1" data-i18n="voucher.scannableQr">
                <QrCode className="w-3.5 h-3.5" /> {t('voucher.scannableQr')}
              </span>
              <p>
                UPI ID: <code className="font-mono font-bold">8792658635@fam / 6364848532@upi</code>
              </p>
              <p className="text-neutral-500 text-[11px]">
                Helpline: <strong>+91 87926 58635</strong>
              </p>
            </div>
            <UpiQrCodeSvg
              upiId="8792658635@fam"
              payeeName="Wanderlust Tours"
              amountINR={balanceDueINR || formData.totalAmountINR}
              transactionNote={booking.id}
              size={96}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800 no-print">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleShareWhatsApp(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                data-i18n="voucher.sendToAgency"
              >
                {t('voucher.sendToAgency')} (8792658635)
              </button>
              <button
                onClick={() => handleShareWhatsApp(false)}
                className="px-3.5 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-200 cursor-pointer"
                data-i18n="voucher.shareWhatsApp"
              >
                {t('voucher.shareWhatsApp')}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer"
                data-i18n="voucher.printSavePdf"
              >
                <Printer className="w-4 h-4" /> {t('voucher.printSavePdf')}
              </button>
              <button
                onClick={onClose}
                className="px-3.5 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl text-xs font-bold cursor-pointer"
                data-i18n="voucher.close"
              >
                {t('voucher.close')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
