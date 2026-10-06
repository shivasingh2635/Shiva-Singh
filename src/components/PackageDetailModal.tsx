import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Share2,
  Heart,
  Award,
  Navigation,
} from 'lucide-react';
import { TourPackage, Currency } from '../types';
import { formatPrice } from '../data/packages';
import { getLocalizedPackage } from '../data/localizedPackages';

interface PackageDetailModalProps {
  pkg: TourPackage | null;
  currency: Currency;
  onClose: () => void;
  onBookNow: (pkg: TourPackage) => void;
  onOpenRouteMap?: (pkg: TourPackage) => void;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  pkg: rawPkg,
  currency,
  onClose,
  onBookNow,
  onOpenRouteMap,
}) => {
  const { t, i18n } = useTranslation();

  if (!rawPkg) return null;
  const pkg = getLocalizedPackage(rawPkg, i18n.language);

  const [selectedImage, setSelectedImage] = useState<string>(pkg.heroImage);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [savedWishlist, setSavedWishlist] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const toggleDay = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
            <span data-i18n={pkg.region === 'domestic' ? 'packageDetail.indianHoliday' : 'packageDetail.internationalTour'}>
              {pkg.region === 'domestic' ? t('packageDetail.indianHoliday') : t('packageDetail.internationalTour')}
            </span>
            <span>·</span>
            <span>{t('packageDetail.daysNightsFull', { days: pkg.durationDays, nights: pkg.durationNights })}</span>
          </div>
          <div className="flex items-center gap-2">
            {onOpenRouteMap && (
              <button
                onClick={() => onOpenRouteMap(rawPkg)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span data-i18n="packageDetail.routeStays">{t('packageDetail.routeStays')}</span>
              </button>
            )}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 transition-colors cursor-pointer"
              title="Share Tour"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copiedLink && (
              <span data-i18n="packageDetail.copied" className="text-xs text-emerald-600 font-medium">
                {t('packageDetail.copied')}
              </span>
            )}
            <button
              onClick={() => setSavedWishlist(!savedWishlist)}
              className="p-2 rounded-xl text-neutral-500 hover:text-rose-500 bg-neutral-100 dark:bg-neutral-800 transition-colors cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${savedWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {pkg.destination}, {pkg.country}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {pkg.rating} ({pkg.reviewsCount}{' '}
                <span data-i18n="packageDetail.verifiedReviews">{t('packageDetail.verifiedReviews')}</span>)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white leading-tight font-['Playfair_Display',serif]">
              {pkg.title}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{pkg.subtitle}</p>
          </div>

          <div className="space-y-3">
            <div className="h-72 sm:h-80 rounded-2xl overflow-hidden shadow-md">
              <img src={selectedImage} alt={pkg.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(pkg.gallery || []).map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    selectedImage === imgUrl
                      ? 'border-emerald-600 scale-95 shadow-md'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-800/60 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700/60">
            <h3
              data-i18n="packageDetail.tourOverview"
              className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-2"
            >
              {t('packageDetail.tourOverview')}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{pkg.overview}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span data-i18n="packageDetail.tourHighlights">{t('packageDetail.tourHighlights')}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(pkg.highlights || []).map((highlight, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-xs text-neutral-700 dark:text-neutral-300 font-medium"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span data-i18n="packageDetail.dayWiseItinerary">{t('packageDetail.dayWiseItinerary')}</span>
              </h3>
              <span className="text-xs text-neutral-500 font-medium">
                {t('packageDetail.daysSchedule', { count: (pkg.itinerary || []).length })}
              </span>
            </div>
            <div className="space-y-3">
              {(pkg.itinerary || []).map((dayItem) => {
                const isExpanded = expandedDay === dayItem.day;
                return (
                  <div
                    key={dayItem.day}
                    className="border border-neutral-200 dark:border-neutral-700/80 rounded-xl overflow-hidden bg-white dark:bg-neutral-800/40"
                  >
                    <button
                      onClick={() => toggleDay(dayItem.day)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          D{dayItem.day}
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">{dayItem.title}</h4>
                          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                            {dayItem.stayLocation} · {dayItem.mealsIncluded}
                          </span>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-neutral-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-neutral-500" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-neutral-100 dark:border-neutral-700/60 space-y-2">
                        <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                          {dayItem.description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50/40 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span data-i18n="packageDetail.whatsIncluded">{t('packageDetail.whatsIncluded')}</span>
              </h4>
              <ul className="space-y-2">
                {(pkg.inclusions || []).map((inc, i) => (
                  <li key={i} className="text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-50/40 dark:bg-rose-950/20 p-4 rounded-2xl border border-rose-200/60 dark:border-rose-900/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 mb-3 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span data-i18n="packageDetail.whatsNotIncluded">{t('packageDetail.whatsNotIncluded')}</span>
              </h4>
              <ul className="space-y-2">
                {(pkg.exclusions || []).map((exc, i) => (
                  <li key={i} className="text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2">
                    <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="flex items-baseline gap-2 font-mono-tabular">
              <span className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                {formatPrice(pkg.basePriceINR, currency)}
              </span>
              {pkg.originalPriceINR && (
                <span className="text-xs text-neutral-400 line-through">
                  {formatPrice(pkg.originalPriceINR, currency)}
                </span>
              )}
            </div>
            <span data-i18n="packageDetail.perPersonTwin" className="text-[11px] text-neutral-500">
              {t('packageDetail.perPersonTwin')}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              data-i18n="packageDetail.back"
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              {t('packageDetail.back')}
            </button>
            <button
              onClick={() => {
                onClose();
                onBookNow(rawPkg);
              }}
              data-i18n="packageDetail.customizeBook"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all cursor-pointer"
            >
              {t('packageDetail.customizeBook')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
