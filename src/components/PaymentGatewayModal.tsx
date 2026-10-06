import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  Lock,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { BookingRecord, Currency } from '../types';
import { formatPrice } from '../data/packages';
import { UpiQrCodeSvg } from './UpiQrCodeSvg';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingRecord;
  currency: Currency;
  onPaymentSuccess: (
    bookingId: string,
    transactionDetails: {
      transactionRef: string;
      paymentMethod: 'UPI' | 'Card' | 'NetBanking';
      paymentStatus: 'Paid';
      paidAt: string;
    }
  ) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  booking,
  currency,
  onPaymentSuccess,
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState(booking.customerName || '');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [utrInput, setUtrInput] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const [stage, setStage] = useState<'idle' | 'processing' | 'otp_verify' | 'success'>('idle');
  const [bankOtp, setBankOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('482910');
  const [txRef, setTxRef] = useState('');

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText('8792658635@fam');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const initiatePayment = () => {
    setStage('processing');
    const randomTx =
      utrInput.trim() || `TXN-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    setTxRef(randomTx);
    setTimeout(() => {
      if (paymentMethod === 'Card') {
        const generated = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(generated);
        setStage('otp_verify');
      } else {
        completePayment(randomTx);
      }
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    completePayment(txRef);
  };

  const completePayment = (ref: string) => {
    const nowIso = new Date().toISOString();
    setStage('success');
    onPaymentSuccess(booking.id, {
      transactionRef: ref,
      paymentMethod,
      paymentStatus: 'Paid',
      paidAt: nowIso,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 text-white border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300" data-i18n="payment.encrypted">
                {t('payment.encrypted')} · Ref: {booking.id}
              </span>
              <h2 className="text-base font-bold text-white" data-i18n="payment.gatewayTitle">{t('payment.gatewayTitle')}</h2>
            </div>
          </div>
          {stage !== 'processing' && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {stage === 'idle' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-neutral-900 text-white border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold" data-i18n="payment.totalPayable">
                    {t('payment.totalPayable')}
                  </span>
                  <div className="text-2xl font-black text-white">
                    {formatPrice(booking.totalAmountINR, currency)}
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400" data-i18n="payment.instantConfirm">{t('payment.instantConfirm')}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                    paymentMethod === 'UPI' ? 'bg-white dark:bg-neutral-900 shadow-sm' : 'text-neutral-500'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-emerald-500" /> <span data-i18n="payment.upiQr">{t('payment.upiQr')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                    paymentMethod === 'Card' ? 'bg-white dark:bg-neutral-900 shadow-sm' : 'text-neutral-500'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-500" /> <span data-i18n="payment.card">{t('payment.card')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('NetBanking')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                    paymentMethod === 'NetBanking' ? 'bg-white dark:bg-neutral-900 shadow-sm' : 'text-neutral-500'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-purple-500" /> <span data-i18n="payment.netBanking">{t('payment.netBanking')}</span>
                </button>
              </div>

              {paymentMethod === 'UPI' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row items-center gap-6">
                    <UpiQrCodeSvg
                      upiId="8792658635@fam"
                      payeeName="Wanderlust Tours"
                      amountINR={booking.totalAmountINR}
                      transactionNote={booking.id}
                      size={148}
                    />
                    <div className="space-y-3 flex-1 text-center sm:text-left">
                      <div>
                        <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-bold" data-i18n="payment.merchantUpi">
                          {t('payment.merchantUpi')}
                        </span>
                        <div className="mt-1 flex items-center justify-center sm:justify-start gap-2">
                          <code className="text-sm font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 px-3 py-1 rounded-lg">
                            8792658635@fam
                          </code>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="p-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 cursor-pointer"
                          >
                            {copiedUpi ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">
                          Alt UPI: <strong>6364848532@upi</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      placeholder={t('payment.utrPlaceholder')}
                      value={utrInput}
                      onChange={(e) => setUtrInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
                    />
                    <button
                      type="button"
                      onClick={initiatePayment}
                      className="w-full sm:w-auto shrink-0 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" /> <span data-i18n="payment.authorizePay">{t('payment.authorizePay')}</span> {formatPrice(booking.totalAmountINR, currency)}
                    </button>
                  </div>
                </div>
              )}

              {paymentMethod === 'Card' && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder={t('payment.cardNumber')}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-mono"
                    />
                    <input
                      type="text"
                      placeholder={t('payment.cardholderName')}
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-mono"
                      />
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="CVV"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-mono"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={initiatePayment}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                    data-i18n="payment.proceed3d"
                  >
                    {t('payment.proceed3d')}
                  </button>
                </div>
              )}

              {paymentMethod === 'NetBanking' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-xl border text-xs font-bold cursor-pointer ${
                          selectedBank === bank
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700'
                            : 'border-neutral-200 dark:border-neutral-700'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={initiatePayment}
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
                  >
                    <span data-i18n="payment.authorizeWith">{t('payment.authorizeWith')}</span> {selectedBank}
                  </button>
                </div>
              )}
            </div>
          )}

          {stage === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
              <h3 className="text-base font-bold" data-i18n="payment.processing">{t('payment.processing')}</h3>
            </div>
          )}

          {stage === 'otp_verify' && (
            <form onSubmit={handleVerifyOtp} className="py-4 space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-xs">
                OTP: <strong>{generatedOtp}</strong>
              </div>
              <input
                type="text"
                maxLength={6}
                required
                placeholder={t('payment.enterOtp')}
                value={bankOtp}
                onChange={(e) => setBankOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-center font-mono text-lg"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
                data-i18n="payment.confirmPayment"
              >
                {t('payment.confirmPayment')}
              </button>
            </form>
          )}

          {stage === 'success' && (
            <div className="space-y-4 text-center py-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold" data-i18n="payment.paymentSuccess">{t('payment.paymentSuccess')}</h3>
              <p className="text-xs text-neutral-500">Transaction Reference: {txRef}</p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                data-i18n="payment.viewVoucher"
              >
                {t('payment.viewVoucher')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
