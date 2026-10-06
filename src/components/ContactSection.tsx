import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, QrCode, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { CustomerInquiry } from '../types';

interface ContactSectionProps {
  onSubmitInquiry: (inquiry: CustomerInquiry) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onSubmitInquiry }) => {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [destination, setDestination] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setSubmitting(true);
    const newInq: CustomerInquiry = {
      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: name.trim(),
      phone: phone.trim(),
      email: email.trim() || 'guest@wanderlust.com',
      destinationInterest: destination.trim() || 'General Holiday Inquiry',
      preferredMonth: 'Upcoming',
      travelersCount: 2,
      message: message.trim() || 'Requested callback from Contact section.',
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    onSubmitInquiry(newInq);

    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiries: [newInq], deviceRole: 'Contact Form' }),
      });
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
      setSubmitted(true);
      setName('');
      setPhone('');
      setEmail('');
      setDestination('');
      setMessage('');
    }
  };

  return (
    <section id="contact-section" className="scroll-mt-24">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-10 border border-neutral-200 dark:border-neutral-800 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span data-i18n="contact.kicker">{t('contact.kicker')}</span>
            </div>
            <h2
              data-i18n="contact.title"
              className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white font-['Playfair_Display',serif]"
            >
              {t('contact.title')}
            </h2>
            <p
              data-i18n="contact.subtitle"
              className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed"
            >
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-4 text-xs">
            <h3 data-i18n="contact.officeTitle" className="font-bold text-sm text-neutral-900 dark:text-white">
              {t('contact.officeTitle')}
            </h3>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span data-i18n="contact.officeAddress" className="text-neutral-600 dark:text-neutral-300">
                {t('contact.officeAddress')}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span data-i18n="contact.helplineLabel" className="block text-neutral-400 text-[11px]">
                  {t('contact.helplineLabel')}
                </span>
                <strong className="text-neutral-900 dark:text-white font-mono">
                  +91 87926 58635 / 6364848532
                </strong>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <QrCode className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span data-i18n="contact.upiLabel" className="block text-neutral-400 text-[11px]">
                  {t('contact.upiLabel')}
                </span>
                <strong className="text-purple-700 dark:text-purple-300 font-mono">
                  8792658635@fam · 6364848532@upi
                </strong>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
              <span className="text-neutral-600 dark:text-neutral-300">holidays@wanderlust.com</span>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7">
          {submitted && (
            <div className="mb-5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span data-i18n="contact.successMessage">{t('contact.successMessage')}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  data-i18n="contact.nameLabel"
                  className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  {t('contact.nameLabel')} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-i18n-placeholder="contact.namePlaceholder"
                  placeholder={t('contact.namePlaceholder')}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label
                  data-i18n="contact.phoneLabel"
                  className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  {t('contact.phoneLabel')} *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  data-i18n-placeholder="contact.phonePlaceholder"
                  placeholder={t('contact.phonePlaceholder')}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  data-i18n="contact.emailLabel"
                  className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  {t('contact.emailLabel')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-i18n-placeholder="contact.emailPlaceholder"
                  placeholder={t('contact.emailPlaceholder')}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label
                  data-i18n="contact.destinationLabel"
                  className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1"
                >
                  {t('contact.destinationLabel')}
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  data-i18n-placeholder="contact.destinationPlaceholder"
                  placeholder={t('contact.destinationPlaceholder')}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label
                data-i18n="contact.messageLabel"
                className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1"
              >
                {t('contact.messageLabel')}
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                data-i18n-placeholder="contact.messagePlaceholder"
                placeholder={t('contact.messagePlaceholder')}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span data-i18n="contact.submitButton">
                {submitting ? t('contact.submittingButton') : t('contact.submitButton')}
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
