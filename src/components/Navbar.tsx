import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Compass,
  Moon,
  Sun,
  Phone,
  Shield,
  Globe,
  Plane,
  Building2,
  Palmtree,
  Car,
  Tag,
  Sparkles,
  ShoppingBag,
  Ticket,
  Menu,
  X,
  BookOpen,
  Info,
  Headphones,
  Layers,
} from 'lucide-react';
import { Currency, AdminAnnouncement, CustomerUser, ServiceVertical } from '../types';
import { LanguageSelector } from './LanguageSelector';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  selectedCurrency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onOpenVisaGuide: () => void;
  onOpenCallbackModal: () => void;
  onOpenAdminPortal: () => void;
  onOpenDocs?: () => void;
  isAdminLoggedIn: boolean;
  onSelectRegion: (r: 'all' | 'domestic' | 'international') => void;
  activeRegion: 'all' | 'domestic' | 'international';
  cartCount?: number;
  onOpenCart?: () => void;
  activeAnnouncement?: AdminAnnouncement | null;
  currentUser?: CustomerUser | null;
  onOpenUserLogin?: () => void;
  onUserLogout?: () => void;
  activeVertical?: ServiceVertical;
  onSelectVertical?: (vertical: ServiceVertical) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  selectedCurrency,
  onCurrencyChange,
  onOpenVisaGuide,
  onOpenCallbackModal,
  onOpenAdminPortal,
  onOpenDocs,
  isAdminLoggedIn,
  onSelectRegion,
  cartCount = 0,
  onOpenCart,
  activeAnnouncement,
  onOpenUserLogin,
  activeVertical = 'holidays',
  onSelectVertical,
}) => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleNavClick = (vertical: ServiceVertical | undefined, anchorId?: string) => {
    if (vertical && onSelectVertical) {
      onSelectVertical(vertical);
    }
    if (anchorId) {
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-neutral-900/95 border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-200">
      {/* Announcement Strip */}
      <div
        className={`text-white text-xs py-1.5 px-4 transition-colors ${
          activeAnnouncement?.color === 'rose'
            ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700'
            : activeAnnouncement?.color === 'amber'
            ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700'
            : activeAnnouncement?.color === 'purple'
            ? 'bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800'
            : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              {activeAnnouncement ? activeAnnouncement.badge : 'Official 2026 Season'} ·
            </span>
            <span className="truncate">
              {activeAnnouncement ? (
                activeAnnouncement.title
              ) : (
                <>
                  Use coupon <strong className="underline underline-offset-2">WANDERLUST10</strong> for instant 10% off or{' '}
                  <strong className="underline underline-offset-2">FLYINDIA</strong> for flat ₹1,500 off flights!
                </>
              )}
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-[11px] shrink-0">
            <a href="tel:+918792658635" className="flex items-center gap-1.5 font-bold hover:underline">
              <Phone className="w-3.5 h-3.5" /> 24/7 Concierge: +91 87926 58635
            </a>
            <span className="opacity-40">|</span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> IATA Verified Agency
            </span>
          </div>
        </div>
      </div>

      {/* Main Top Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div
          onClick={() => {
            onSelectRegion('all');
            handleNavClick('holidays', 'home-section');
          }}
          className="flex items-center gap-2.5 cursor-pointer select-none flex-shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
            <Compass className="w-5 h-5" />
          </div>
          <span
            data-i18n="brand"
            className="text-lg sm:text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-['Playfair_Display',serif]"
          >
            {t('brand')}
          </span>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden xl:flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-700">
          <button
            type="button"
            onClick={() => handleNavClick('holidays', 'home-section')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeVertical === 'holidays'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Palmtree className="w-3.5 h-3.5" />
            <span data-i18n="nav.home">{t('nav.home')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick(undefined, 'about-section')}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Info className="w-3.5 h-3.5 text-emerald-500" />
            <span data-i18n="nav.about">{t('nav.about')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick(undefined, 'services-overview')}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Layers className="w-3.5 h-3.5 text-teal-500" />
            <span data-i18n="nav.services">{t('nav.services')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick(undefined, 'contact-section')}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Headphones className="w-3.5 h-3.5 text-amber-500" />
            <span data-i18n="nav.contact">{t('nav.contact')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('flights', 'flights-section')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeVertical === 'flights'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span data-i18n="nav.flights">{t('nav.flights')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('hotels', 'hotels-section')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeVertical === 'hotels'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span data-i18n="nav.hotels">{t('nav.hotels')}</span>
          </button>

          <button
            type="button"
            onClick={onOpenVisaGuide}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Globe className="w-3.5 h-3.5 text-teal-500" />
            <span data-i18n="nav.visaGuide">{t('nav.visaGuide')}</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Selector (EN / हिंदी / ಕನ್ನಡ) */}
          <LanguageSelector />

          {/* Currency Selector */}
          <select
            value={selectedCurrency}
            onChange={(e) => onCurrencyChange(e.target.value as Currency)}
            aria-label="Select currency"
            className="hidden sm:inline-block text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-xl px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
            <option value="GBP">£ GBP</option>
            <option value="AED">AED</option>
          </select>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label="Toggle Dark Mode"
            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>

          {/* My Trips Button */}
          {onOpenUserLogin && (
            <button
              type="button"
              onClick={onOpenUserLogin}
              className="hidden md:flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-bold px-2.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Ticket className="w-3.5 h-3.5 text-emerald-600" />
              <span data-i18n="nav.myTrips" className="hidden lg:inline">
                {t('nav.myTrips')}
              </span>
            </button>
          )}

          {/* Plan Custom Trip */}
          <button
            type="button"
            onClick={onOpenCallbackModal}
            className="hidden lg:inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span data-i18n="nav.planTrip">{t('nav.planTrip')}</span>
          </button>

          {/* Documentation & Feature Guide */}
          <a
            href="/feature-guide.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition-all cursor-pointer whitespace-nowrap"
            title="Documentation & Feature Guide"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span data-i18n="nav.docs" className="hidden lg:inline">
              {t('nav.docs')}
            </span>
          </a>

          {/* Cart Drawer Button */}
          {onOpenCart && (
            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-2.5 py-2 rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span data-i18n="nav.cart" className="hidden md:inline">
                {t('nav.cart')}
              </span>
              {cartCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-400 text-neutral-900 text-[10px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Admin Portal */}
          <button
            type="button"
            onClick={onOpenAdminPortal}
            className={`text-xs font-bold px-2.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
              isAdminLoggedIn
                ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800'
                : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            title="Administrator Portal"
          >
            <Shield className="w-3.5 h-3.5 text-purple-500" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleNavClick('holidays', 'home-section')}
              className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center gap-2"
            >
              <Palmtree className="w-4 h-4 text-emerald-600" />
              <span data-i18n="nav.home">{t('nav.home')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick(undefined, 'about-section')}
              className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center gap-2"
            >
              <Info className="w-4 h-4 text-emerald-500" />
              <span data-i18n="nav.about">{t('nav.about')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick(undefined, 'services-overview')}
              className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-teal-600" />
              <span data-i18n="nav.services">{t('nav.services')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick(undefined, 'contact-section')}
              className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center gap-2"
            >
              <Headphones className="w-4 h-4 text-amber-600" />
              <span data-i18n="nav.contact">{t('nav.contact')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('flights', 'flights-section')}
              className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center gap-2"
            >
              <Plane className="w-4 h-4 text-teal-600" />
              <span data-i18n="nav.flights">{t('nav.flights')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('hotels', 'hotels-section')}
              className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-amber-600" />
              <span data-i18n="nav.hotels">{t('nav.hotels')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('cabs', 'cabs-section')}
              className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center gap-2"
            >
              <Car className="w-4 h-4 text-cyan-600" />
              <span data-i18n="nav.cabs">{t('nav.cabs')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenVisaGuide();
              }}
              className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center gap-2"
            >
              <Globe className="w-4 h-4 text-teal-500" />
              <span data-i18n="nav.visaGuide">{t('nav.visaGuide')}</span>
            </button>
            <a
              href="/feature-guide.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="col-span-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span data-i18n="nav.docs">{t('nav.docs')}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
