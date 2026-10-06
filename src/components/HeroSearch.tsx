import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, Sparkles, Filter, CheckCircle2, Award, Headphones, CreditCard } from 'lucide-react';
import { RegionType, TravelTheme, SeasonType, Currency } from '../types';
import { formatPrice } from '../data/packages';
import heroKashmir from '../assets/images/hero_kashmir_dal_lake_1791214816138.jpg';

interface HeroSearchProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeRegion: RegionType;
  onRegionChange: (r: RegionType) => void;
  selectedTheme: TravelTheme;
  onThemeChange: (t: TravelTheme) => void;
  selectedSeason?: SeasonType;
  onSeasonChange?: (s: SeasonType) => void;
  maxBudgetINR: number;
  onBudgetChange: (b: number) => void;
  selectedDuration: string;
  onDurationChange: (d: string) => void;
  selectedCurrency: Currency;
  totalResultsCount: number;
  onResetFilters: () => void;
}

const THEMES: { id: TravelTheme; label: string }[] = [
  { id: 'All', label: 'All Themes' },
  { id: 'Beach', label: 'Beach' },
  { id: 'Hidden Gem', label: 'Hidden Gem' },
  { id: 'Nature', label: 'Nature' },
  { id: 'Honeymoon', label: 'Honeymoon' },
  { id: 'Luxury', label: 'Luxury' },
  { id: 'Adventure', label: 'Adventure' },
  { id: 'Family', label: 'Family' },
];

const SEASONS: { id: SeasonType; label: string }[] = [
  { id: 'all', label: 'All Seasons' },
  { id: 'summer', label: 'Summer Peak' },
  { id: 'monsoon', label: 'Monsoon Lush' },
  { id: 'winter', label: 'Winter & Snow' },
  { id: 'spring', label: 'Spring Bloom' },
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchQuery,
  onSearchChange,
  activeRegion,
  onRegionChange,
  selectedTheme,
  onThemeChange,
  selectedSeason = 'all',
  onSeasonChange,
  maxBudgetINR,
  onBudgetChange,
  selectedDuration,
  onDurationChange,
  selectedCurrency,
  totalResultsCount,
  onResetFilters,
}) => {
  const { t } = useTranslation();

  return (
    <section id="home-section" className="relative overflow-hidden bg-neutral-900 text-white pt-12 pb-16 lg:pt-16 lg:pb-20">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-35"
        style={{ backgroundImage: `url(${heroKashmir})` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/70 to-neutral-950" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span data-i18n="hero.kicker">{t('hero.kicker')}</span>
          </div>
          <h1
            data-i18n="hero.title"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight font-['Playfair_Display',serif]"
          >
            {t('hero.title')}
          </h1>
          <p
            data-i18n="hero.subtitle"
            className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
          >
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Search & Filter Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 text-neutral-800 dark:text-neutral-100">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onRegionChange('all')}
                data-i18n="hero.allPackages"
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeRegion === 'all'
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                {t('hero.allPackages')}
              </button>
              <button
                onClick={() => onRegionChange('domestic')}
                data-i18n="hero.domestic"
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeRegion === 'domestic'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                {t('hero.domestic')}
              </button>
              <button
                onClick={() => onRegionChange('international')}
                data-i18n="hero.international"
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeRegion === 'international'
                    ? 'bg-teal-600 text-white shadow'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                {t('hero.international')}
              </button>
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              Showing <strong className="text-emerald-600 dark:text-emerald-400">{totalResultsCount}</strong> curated holiday packages
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <label
                data-i18n="hero.searchLabel"
                className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1"
              >
                {t('hero.searchLabel')}
              </label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-3 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <input
                  type="text"
                  data-i18n-placeholder="hero.searchPlaceholder"
                  placeholder={t('hero.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-medium bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                data-i18n="hero.durationLabel"
                className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1"
              >
                {t('hero.durationLabel')}
              </label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-3 w-4 h-4 text-neutral-400" />
                <select
                  value={selectedDuration}
                  onChange={(e) => onDurationChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-medium bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-neutral-900 dark:text-white cursor-pointer"
                >
                  <option value="all" data-i18n="hero.anyDuration">
                    {t('hero.anyDuration')}
                  </option>
                  <option value="short" data-i18n="hero.shortBreak">
                    {t('hero.shortBreak')}
                  </option>
                  <option value="medium" data-i18n="hero.standardHoliday">
                    {t('hero.standardHoliday')}
                  </option>
                  <option value="long" data-i18n="hero.extendedJourney">
                    {t('hero.extendedJourney')}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  data-i18n="hero.maxBudgetLabel"
                  className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
                >
                  {t('hero.maxBudgetLabel')}
                </label>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span data-i18n="hero.upTo">{t('hero.upTo')}</span> {formatPrice(maxBudgetINR, selectedCurrency)}
                </span>
              </div>
              <input
                type="range"
                min={15000}
                max={250000}
                step={5000}
                value={maxBudgetINR}
                onChange={(e) => onBudgetChange(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg cursor-pointer mt-2"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={onResetFilters}
                data-i18n="hero.resetFilters"
                className="w-full py-2.5 px-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-xl transition-colors text-center cursor-pointer"
              >
                {t('hero.resetFilters')}
              </button>
            </div>
          </div>

          {/* Theme Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 border-t border-neutral-100 dark:border-neutral-800 pb-2">
            <span className="text-[11px] font-semibold text-neutral-400 whitespace-nowrap mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> <span data-i18n="hero.categories">{t('hero.categories')}</span>:
            </span>
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => onThemeChange(theme.id)}
                className={`text-xs px-3 py-1 rounded-lg whitespace-nowrap font-medium transition-all cursor-pointer ${
                  selectedTheme === theme.id
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>

          {onSeasonChange && (
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-neutral-100 dark:border-neutral-800 pb-1">
              <span className="text-[11px] font-semibold text-neutral-400 whitespace-nowrap mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> <span data-i18n="hero.season">{t('hero.season')}</span>:
              </span>
              {SEASONS.map((season) => (
                <button
                  key={season.id}
                  onClick={() => onSeasonChange(season.id)}
                  className={`text-xs px-3 py-1 rounded-lg whitespace-nowrap font-medium transition-all cursor-pointer ${
                    selectedSeason === season.id
                      ? 'bg-purple-600 text-white font-semibold shadow-sm'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  {season.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-4 border-t border-neutral-800/80 text-neutral-300">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-white">4.9/5 Rating</p>
              <p className="text-neutral-400 text-[11px]">45,000+ Happy Guests</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-white">Handpicked Hotels</p>
              <p className="text-neutral-400 text-[11px]">Strict 4★ & 5★ Hygiene</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Headphones className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-white">24x7 Ground Concierge</p>
              <p className="text-neutral-400 text-[11px]">Dedicated Trip Captain</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-white">Transparent Pricing</p>
              <p className="text-neutral-400 text-[11px]">No Hidden Fees & EMI</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
