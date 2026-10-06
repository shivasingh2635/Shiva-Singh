import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tag, Copy, Check, Sparkles } from 'lucide-react';
import { SAMPLE_PROMO_COUPONS } from '../data/travelServices';

interface OffersSectionProps {
  onSelectServiceTab?: (tab: string) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = () => {
  const { t } = useTranslation();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const filteredCoupons = SAMPLE_PROMO_COUPONS.filter((c) => {
    if (activeCategory === 'all') return true;
    return c.serviceCategory === activeCategory || c.serviceCategory === 'all';
  });

  return (
    <section id="offers-section" className="scroll-mt-24 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1" data-i18n="offers.badge">
            <Sparkles className="w-3.5 h-3.5" /> {t('offers.badge')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-['Playfair_Display',serif]" data-i18n="offers.title">
            {t('offers.title')}
          </h2>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: t('offers.allDeals'), key: 'offers.allDeals' },
            { id: 'holidays', label: t('offers.holidays'), key: 'offers.holidays' },
            { id: 'flights', label: t('offers.flights'), key: 'offers.flights' },
            { id: 'hotels', label: t('offers.hotels'), key: 'offers.hotels' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              data-i18n={cat.key}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCoupons.map((coupon) => (
          <div
            key={coupon.code}
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                <span>{coupon.badge}</span>
                <span className="text-neutral-400">{t('offers.expires')}: {coupon.expiryDate}</span>
              </div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">{coupon.title}</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{coupon.description}</p>
            </div>

            <div className="pt-2 border-t border-dashed border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-1.5 font-mono text-xs font-black text-purple-700 dark:text-purple-300">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{coupon.code}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(coupon.code)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                    copiedCode === coupon.code ? 'bg-emerald-600 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="w-3 h-3" /> <span data-i18n="offers.copied">{t('offers.copied')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> <span data-i18n="offers.copy">{t('offers.copy')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
