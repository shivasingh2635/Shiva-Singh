import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Star, MapPin, Check, ShoppingBag, Navigation } from 'lucide-react';
import { TourPackage, Currency } from '../types';
import { formatPrice } from '../data/packages';
import { getLocalizedPackage } from '../data/localizedPackages';

interface PackageCardProps {
  pkg: TourPackage;
  currency: Currency;
  onViewDetails: (pkg: TourPackage) => void;
  onBookNow: (pkg: TourPackage) => void;
  onAddToCart?: (pkg: TourPackage) => void;
  onOpenRouteMap?: (pkg: TourPackage) => void;
  isInCart?: boolean;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  pkg: rawPkg,
  currency,
  onViewDetails,
  onBookNow,
  onAddToCart,
  onOpenRouteMap,
  isInCart = false,
}) => {
  const { t, i18n } = useTranslation();
  const pkg = getLocalizedPackage(rawPkg, i18n.language);

  return (
    <div className="group bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Section */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={pkg.heroImage}
          alt={pkg.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Bottom image metadata */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white z-10 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {t('packagesSection.daysNights', { days: pkg.durationDays, nights: pkg.durationNights })} ·{' '}
              {pkg.region === 'domestic' ? t('packagesSection.indiaRegion') : t('packagesSection.intlRegion')}
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-300 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>{pkg.rating}</span>
            <span className="text-[11px] text-white/80 font-normal">({pkg.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1.5">
            <span className="flex items-center gap-1 font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              {pkg.destination}
            </span>
            <span className="text-[11px] font-medium shrink-0 ml-2">{pkg.theme}</span>
          </div>

          <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-snug line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {pkg.title}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">{pkg.subtitle}</p>

          <ul className="mt-3 space-y-1.5 border-t border-neutral-100 dark:border-neutral-800 pt-3">
            {pkg.highlights.slice(0, 2).map((highlight, index) => (
              <li
                key={index}
                className="text-xs text-neutral-600 dark:text-neutral-300 flex items-start gap-1.5 line-clamp-1"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="truncate">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing & Call-to-action Footer */}
        <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="flex items-baseline gap-1.5 font-mono-tabular">
                <span className="text-lg font-extrabold text-neutral-900 dark:text-white">
                  {formatPrice(pkg.basePriceINR, currency)}
                </span>
                {pkg.originalPriceINR && (
                  <span className="text-xs text-neutral-400 line-through">
                    {formatPrice(pkg.originalPriceINR, currency)}
                  </span>
                )}
              </div>
              <p
                data-i18n="packagesSection.perPerson"
                className="text-[10px] text-neutral-500 dark:text-neutral-400"
              >
                {t('packagesSection.perPerson')}
              </p>
            </div>
            {pkg.originalPriceINR && pkg.originalPriceINR > pkg.basePriceINR && (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                {t('packagesSection.savePercent', {
                  percent: Math.round(((pkg.originalPriceINR - pkg.basePriceINR) / pkg.originalPriceINR) * 100),
                })}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => onViewDetails(rawPkg)}
              data-i18n="packagesSection.viewItinerary"
              className="w-full py-2 px-2.5 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-center cursor-pointer whitespace-nowrap"
            >
              {t('packagesSection.viewItinerary')}
            </button>
            <button
              onClick={() => onBookNow(rawPkg)}
              data-i18n="packagesSection.customizeBook"
              className="w-full py-2 px-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors text-center cursor-pointer whitespace-nowrap"
            >
              {t('packagesSection.customizeBook')}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onAddToCart && (
              <button
                type="button"
                onClick={() => onAddToCart(rawPkg)}
                className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border cursor-pointer whitespace-nowrap ${
                  isInCart
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                    : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-emerald-50 border-neutral-200 dark:border-neutral-700'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span data-i18n={isInCart ? 'packagesSection.inCart' : 'packagesSection.addToCart'}>
                  {isInCart ? t('packagesSection.inCart') : t('packagesSection.addToCart')}
                </span>
              </button>
            )}
            {onOpenRouteMap && (
              <button
                type="button"
                onClick={() => onOpenRouteMap(rawPkg)}
                className="py-1.5 px-2.5 rounded-xl text-xs font-semibold border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                title="View Route Map, Hotels & Dining"
              >
                <Navigation className="w-3.5 h-3.5 text-teal-600" />
                <span data-i18n="packagesSection.route">{t('packagesSection.route')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
