import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { applyDomTranslations, SupportedLanguage } from './i18n';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { PackageCard } from './components/PackageCard';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ContactSection } from './components/ContactSection';
import { PackageDetailModal } from './components/PackageDetailModal';
import { BookingModal } from './components/BookingModal';
import { VisaGuideModal } from './components/VisaGuideModal';
import { CustomTripBuilderModal } from './components/CustomTripBuilderModal';
import { AdminPortal } from './components/AdminPortal';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { WhatsAppCartDrawer } from './components/WhatsAppCartDrawer';
import { TransportRouteMapModal } from './components/TransportRouteMapModal';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { UserLoginModal } from './components/UserLoginModal';
import { FlightBookingEngine } from './components/FlightBookingEngine';
import { HotelBookingEngine } from './components/HotelBookingEngine';
import { AirportCabEngine } from './components/AirportCabEngine';
import { RestaurantDiningEngine } from './components/RestaurantDiningEngine';
import { OffersSection } from './components/OffersSection';
import { Footer } from './components/Footer';
import { TravelChatbot } from './components/TravelChatbot';
import { AdvancePrintVoucherModal } from './components/AdvancePrintVoucherModal';
import { DocumentationModal } from './components/DocumentationModal';

import {
  TourPackage,
  BookingRecord,
  CustomerInquiry,
  RegionType,
  TravelTheme,
  SeasonType,
  Currency,
  CartItem,
  AdminAnnouncement,
  CustomerUser,
  ServiceVertical,
  WebsiteThemeConfig,
} from './types';
import {
  INITIAL_PACKAGES,
  INITIAL_BOOKINGS,
  INITIAL_INQUIRIES,
} from './data/packages';
import {
  Compass,
  ShieldCheck,
  HeartHandshake,
  Headphones,
  Plane,
  Star,
  Sparkles,
  Building2,
  Palmtree,
  Car,
  Tag,
  UtensilsCrossed,
  Globe,
} from 'lucide-react';

export function App() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const lang = (i18n.language === 'hi' || i18n.language === 'kn' ? i18n.language : 'en') as SupportedLanguage;
    applyDomTranslations(lang);
  }, [i18n.language]);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('wanderlust_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark', 'bg-neutral-950', 'text-neutral-100');
      document.body.classList.remove('bg-neutral-50', 'text-neutral-900');
      localStorage.setItem('wanderlust_theme', 'dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark', 'bg-neutral-950', 'text-neutral-100');
      document.body.classList.add('bg-neutral-50', 'text-neutral-900');
      localStorage.setItem('wanderlust_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const [themeConfig, setThemeConfig] = useState<WebsiteThemeConfig>(() => {
    const saved = localStorage.getItem('wanderlust_theme_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      accentColor: 'emerald',
      borderRadius: 'rounded-2xl',
      showFlightsBottom: true,
      showHotelsBottom: true,
      showCabsBottom: true,
      showDiningBottom: true,
      showOffersBottom: true,
      showTestimonials: true,
      showFloatingWhatsApp: true,
      brandTagline: 'Handcrafted Tours & Bespoke Journeys',
      primaryPhone: '+91 87926 58635',
    };
  });

  useEffect(() => {
    localStorage.setItem('wanderlust_theme_config', JSON.stringify(themeConfig));
  }, [themeConfig]);

  const [activeVertical, setActiveVertical] = useState<ServiceVertical>('holidays');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('INR');

  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem('wanderlust_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isUserLoginOpen, setIsUserLoginOpen] = useState<boolean>(false);
  const [registeredUsers, setRegisteredUsers] = useState<CustomerUser[]>([]);

  const [packages, setPackages] = useState<TourPackage[]>(() => {
    const saved = localStorage.getItem('wanderlust_packages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        return INITIAL_PACKAGES;
      }
    }
    return INITIAL_PACKAGES;
  });

  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    const saved = localStorage.getItem('wanderlust_bookings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        return INITIAL_BOOKINGS;
      }
    }
    return INITIAL_BOOKINGS;
  });

  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => {
    const saved = localStorage.getItem('wanderlust_inquiries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return INITIAL_INQUIRIES;
      }
    }
    return INITIAL_INQUIRIES;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const [announcements] = useState<AdminAnnouncement[]>([
    {
      id: 'ann-default-1',
      title: 'Festival Bonanza: Instant 10% Off on Kashmir, Spiti & Dubai packages with Code WANDERLUST10',
      badge: 'Live Deal',
      active: true,
      color: 'emerald',
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [adminWhatsAppNumber, setAdminWhatsAppNumber] = useState<string>('918792658635');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState<boolean>(false);

  // Filters
  const [activeRegion, setActiveRegion] = useState<RegionType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<TravelTheme>('All');
  const [selectedSeason, setSelectedSeason] = useState<SeasonType>('all');
  const [maxBudgetINR, setMaxBudgetINR] = useState<number>(250000);
  const [selectedDuration, setSelectedDuration] = useState<string>('all');

  // Modals
  const [selectedPackageForDetail, setSelectedPackageForDetail] = useState<TourPackage | null>(null);
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState<TourPackage | null>(null);
  const [confirmedBookingVoucher, setConfirmedBookingVoucher] = useState<BookingRecord | null>(null);
  const [isVisaGuideOpen, setIsVisaGuideOpen] = useState<boolean>(false);
  const [isCustomTripBuilderOpen, setIsCustomTripBuilderOpen] = useState<boolean>(false);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [selectedPackageForRouteMap, setSelectedPackageForRouteMap] = useState<TourPackage | null>(null);
  const [pendingBookingPayment, setPendingBookingPayment] = useState<BookingRecord | null>(null);

  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(true);
  const [liveSyncNotification, setLiveSyncNotification] = useState<{ id: string; text: string } | null>(null);

  const activeAnnouncement = useMemo(() => announcements.find((a) => a.active) || null, [announcements]);

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      if (activeRegion !== 'all' && pkg.region !== activeRegion) return false;
      if (selectedTheme !== 'All' && pkg.theme !== selectedTheme) return false;
      if (selectedSeason !== 'all' && pkg.season && pkg.season !== selectedSeason) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          pkg.title.toLowerCase().includes(q) ||
          pkg.destination.toLowerCase().includes(q) ||
          pkg.country.toLowerCase().includes(q) ||
          pkg.subtitle.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (pkg.basePriceINR > maxBudgetINR) return false;
      if (selectedDuration === 'short' && (pkg.durationDays < 4 || pkg.durationDays > 5)) return false;
      if (selectedDuration === 'medium' && (pkg.durationDays < 6 || pkg.durationDays > 7)) return false;
      if (selectedDuration === 'long' && pkg.durationDays < 8) return false;
      return true;
    });
  }, [packages, activeRegion, selectedTheme, selectedSeason, searchQuery, maxBudgetINR, selectedDuration]);

  const handleResetFilters = () => {
    setActiveRegion('all');
    setSearchQuery('');
    setSelectedTheme('All');
    setSelectedSeason('all');
    setMaxBudgetINR(250000);
    setSelectedDuration('all');
  };

  const syncBookingToCloud = async (booking: BookingRecord, deviceRole: string = 'Device Booking') => {
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...booking, deviceRole }),
      });
      setLastSyncedTime(new Date().toLocaleTimeString());
    } catch {
      // ignore
    }
  };

  const handleBookingConfirmed = (newBooking: BookingRecord) => {
    setBookings((prev) => {
      const updated = [newBooking, ...prev];
      localStorage.setItem('wanderlust_bookings', JSON.stringify(updated));
      return updated;
    });
    syncBookingToCloud(newBooking, 'Mobile / Web Booking Step 1');
    setSelectedPackageForBooking(null);
    setPendingBookingPayment(newBooking);
  };

  const handleUnifiedServiceBooking = (newBooking: BookingRecord) => {
    setBookings((prev) => {
      const updated = [newBooking, ...prev];
      localStorage.setItem('wanderlust_bookings', JSON.stringify(updated));
      return updated;
    });
    syncBookingToCloud(newBooking, 'Service Booking');
  };

  const handlePaymentCompleted = (
    bookingId: string,
    details: {
      transactionRef: string;
      paymentMethod: 'UPI' | 'Card' | 'NetBanking';
      paymentStatus: 'Paid';
      paidAt: string;
    }
  ) => {
    setBookings((prev) => {
      let finalBooking: BookingRecord | null = null;
      const updated = prev.map((b) => {
        if (b.id === bookingId) {
          finalBooking = {
            ...b,
            ...details,
            status: 'Confirmed',
            paymentStatus: 'Paid',
          };
          return finalBooking;
        }
        return b;
      });
      if (finalBooking) {
        localStorage.setItem('wanderlust_bookings', JSON.stringify(updated));
        syncBookingToCloud(finalBooking, 'Payment Completed');
        setConfirmedBookingVoucher(finalBooking);
      }
      return updated;
    });
    setPendingBookingPayment(null);
  };

  const handleCheckInBooking = (bookingId: string, details: any) => {
    setBookings((prev) => {
      const updated = prev.map((b) => {
        if (b.id === bookingId) {
          const patched: BookingRecord = {
            ...b,
            status: 'Checked-In',
            checkedIn: true,
            checkInDetails: {
              ...details,
              checkedInAt: details?.checkedInAt || new Date().toLocaleString(),
            },
          };
          syncBookingToCloud(patched, 'Passenger Web Check-In');
          return patched;
        }
        return b;
      });
      localStorage.setItem('wanderlust_bookings', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddToCart = (pkg: TourPackage) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.package.id === pkg.id);
      if (existing) {
        return prev.map((item) =>
          item.package.id === pkg.id ? { ...item, travelers: item.travelers + 1 } : item
        );
      }
      return [...prev, { package: pkg, travelers: 2, addedAt: new Date().toISOString() }];
    });
    setIsCartOpen(true);
  };

  const handleSyncPull = async (): Promise<boolean> => {
    try {
      setSyncStatus('syncing');
      const res = await fetch('/api/sync');
      if (!res.ok) throw new Error('Sync pull failed');
      const data = await res.json();
      if (data && Array.isArray(data.bookings) && data.bookings.length > 0) {
        setBookings(data.bookings);
        localStorage.setItem('wanderlust_bookings', JSON.stringify(data.bookings));
      }
      setLastSyncedTime(new Date().toLocaleTimeString());
      setSyncStatus('synced');
      return true;
    } catch {
      setSyncStatus('error');
      return false;
    }
  };

  const handleSyncPush = async (deviceRole: string = 'Active Session'): Promise<boolean> => {
    try {
      setSyncStatus('syncing');
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookings, inquiries, packages, lastUpdatedBy: deviceRole }),
      });
      if (!res.ok) throw new Error('Sync push failed');
      setLastSyncedTime(new Date().toLocaleTimeString());
      setSyncStatus('synced');
      return true;
    } catch {
      setSyncStatus('error');
      return false;
    }
  };

  useEffect(() => {
    handleSyncPull();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200 flex flex-col">
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
        onOpenVisaGuide={() => setIsVisaGuideOpen(true)}
        onOpenCallbackModal={() => setIsCustomTripBuilderOpen(true)}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onSelectRegion={setActiveRegion}
        activeRegion={activeRegion}
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        activeAnnouncement={activeAnnouncement}
        currentUser={currentUser}
        onOpenUserLogin={() => setIsUserLoginOpen(true)}
        onUserLogout={() => setCurrentUser(null)}
        activeVertical={activeVertical}
        onSelectVertical={setActiveVertical}
      />

      {/* Quick Travel Vertical Switcher Bar */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-xs py-2 px-4 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[
              { id: 'holidays', label: 'Holiday Packages', icon: Palmtree },
              { id: 'flights', label: 'Flight Tickets', icon: Plane },
              { id: 'hotels', label: 'Hotels & Resorts', icon: Building2 },
              { id: 'cabs', label: 'Airport Cabs', icon: Car },
              { id: 'dining', label: 'Dining & Tables', icon: UtensilsCrossed },
              { id: 'offers', label: 'Deals & Coupons', icon: Tag },
            ].map((tab) => {
              const isActive = activeVertical === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveVertical(tab.id as ServiceVertical);
                    const el = document.getElementById(
                      tab.id === 'holidays'
                        ? 'packages'
                        : tab.id === 'flights'
                        ? 'flights-section'
                        : tab.id === 'hotels'
                        ? 'hotels-section'
                        : tab.id === 'cabs'
                        ? 'cabs-section'
                        : tab.id === 'dining'
                        ? 'dining-section'
                        : 'offers-section'
                    );
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-neutral-500">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Instant Confirmation
            </span>
            <span>·</span>
            <button
              type="button"
              onClick={() => setIsCustomTripBuilderOpen(true)}
              className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Bespoke Trip Builder
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section & Search Engine */}
      <HeroSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeRegion={activeRegion}
        onRegionChange={setActiveRegion}
        selectedTheme={selectedTheme}
        onThemeChange={setSelectedTheme}
        selectedSeason={selectedSeason}
        onSeasonChange={setSelectedSeason}
        maxBudgetINR={maxBudgetINR}
        onBudgetChange={setMaxBudgetINR}
        selectedDuration={selectedDuration}
        onDurationChange={setSelectedDuration}
        selectedCurrency={selectedCurrency}
        totalResultsCount={filteredPackages.length}
        onResetFilters={handleResetFilters}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-16">
        {/* 1. Tour & Travel Packages Showcase */}
        <div id="packages" className="scroll-mt-24 space-y-8">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span data-i18n="packagesSection.kicker">{t('packagesSection.kicker')}</span>
                </div>
                <h2
                  data-i18n="packagesSection.title"
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-['Playfair_Display',serif]"
                >
                  {t('packagesSection.title')}
                </h2>
                <p
                  data-i18n="packagesSection.subtitle"
                  className="text-xs text-neutral-500 dark:text-neutral-400 mt-1"
                >
                  {t('packagesSection.subtitle')}
                </p>
              </div>

              <div className="inline-flex p-1.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 self-start md:self-center">
                <button
                  type="button"
                  onClick={() => setActiveRegion('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    activeRegion === 'all'
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span data-i18n="packagesSection.globalAll">{t('packagesSection.globalAll')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRegion('international')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    activeRegion === 'international'
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span data-i18n="packagesSection.international">{t('packagesSection.international')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRegion('domestic')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    activeRegion === 'domestic'
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span data-i18n="packagesSection.localIndia">{t('packagesSection.localIndia')}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
              <span>
                Showing <strong className="text-emerald-600 font-bold">{filteredPackages.length}</strong> verified tour packages
              </span>
              <span className="text-[11px] font-medium text-neutral-400">
                Includes in-package flights & cab booking options
              </span>
            </div>
          </div>

          {filteredPackages.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 space-y-4">
              <Compass className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="text-lg font-bold">No tour packages matched your criteria</h3>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  currency={selectedCurrency}
                  onViewDetails={(item) => setSelectedPackageForDetail(item)}
                  onBookNow={(item) => setSelectedPackageForBooking(item)}
                  onAddToCart={handleAddToCart}
                  onOpenRouteMap={(item) => setSelectedPackageForRouteMap(item)}
                  isInCart={cartItems.some((i) => i.package.id === pkg.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* 2. About Section (Multi-language EN/HI/KN with data-i18n) */}
        <AboutSection />

        {/* 3. Services Overview Section (Multi-language EN/HI/KN with data-i18n) */}
        <ServicesSection />

        {/* 4. Testimonials */}
        {themeConfig.showTestimonials !== false && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Verified Guest Stories
                </span>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Memories Crafted with Care</h3>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-500 font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>4.9 / 5 Overall Traveler Rating</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 italic leading-relaxed">
                  "Our family expedition to Kashmir and Gulmarg was exceptionally well-organized! The heated private cab transfers, punctual guides, and 5-star mountain stays made the entire journey comfortable and relaxing."
                </p>
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <span className="font-bold">Col. Rajesh & Sunita Verma</span>
                  <span className="text-neutral-400 text-[11px]">Kashmir Valley Expedition</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 italic leading-relaxed">
                  "Traveling with two young kids to Dubai could have been hectic, but Wanderlust handled every transfer smoothly. The Red Dune safari and Burj Khalifa tickets with skip-the-line were fantastic!"
                </p>
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <span className="font-bold">Dr. Amitesh Mukherjee</span>
                  <span className="text-neutral-400 text-[11px]">Dubai Sky-High Marvels</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 italic leading-relaxed">
                  "The Swiss Alps itinerary was flawless. First-class train passes made moving between Zurich, Lucerne and Interlaken effortless. The Mount Titlis cable car was breathtaking. Highly recommend!"
                </p>
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <span className="font-bold">Vikramaditya & Shalini</span>
                  <span className="text-neutral-400 text-[11px]">Swiss Alps Grand Tour</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4. Complete Travel Suite Bottom Engines */}
        <section className="space-y-12 border-t border-neutral-200 dark:border-neutral-800 pt-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Complete Travel Suite
            </span>
            <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-white font-['Playfair_Display',serif]">
              Flights, Hotels, Dining & Transfers
            </h3>
            <p className="text-xs text-neutral-500">
              Book individual travel components or bundle them directly inside your holiday package.
            </p>
          </div>

          {themeConfig.showFlightsBottom !== false && (
            <FlightBookingEngine
              currency={selectedCurrency}
              onBookFlight={handleUnifiedServiceBooking}
              onOpenMyTrips={() => setIsUserLoginOpen(true)}
            />
          )}

          {themeConfig.showHotelsBottom !== false && (
            <HotelBookingEngine
              currency={selectedCurrency}
              onBookHotel={handleUnifiedServiceBooking}
              onOpenMyTrips={() => setIsUserLoginOpen(true)}
            />
          )}

          {themeConfig.showCabsBottom !== false && (
            <AirportCabEngine
              currency={selectedCurrency}
              onBookCab={handleUnifiedServiceBooking}
              onOpenMyTrips={() => setIsUserLoginOpen(true)}
            />
          )}

          {themeConfig.showDiningBottom !== false && (
            <RestaurantDiningEngine
              currency={selectedCurrency}
              onBookDining={handleUnifiedServiceBooking}
            />
          )}

          {themeConfig.showOffersBottom !== false && <OffersSection />}
        </section>

        {/* 5. Contact Section (Multi-language EN/HI/KN with data-i18n) */}
        <ContactSection onSubmitInquiry={(inq) => setInquiries((prev) => [inq, ...prev])} />
      </main>

      {themeConfig.showFloatingWhatsApp !== false && <WhatsAppWidget />}

      <Footer
        onSelectRegion={setActiveRegion}
        onOpenVisaGuide={() => setIsVisaGuideOpen(true)}
        onOpenCallbackModal={() => setIsCustomTripBuilderOpen(true)}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
      />

      {/* Modals */}
      {selectedPackageForDetail && (
        <PackageDetailModal
          pkg={selectedPackageForDetail}
          currency={selectedCurrency}
          onClose={() => setSelectedPackageForDetail(null)}
          onBookNow={(pkg) => {
            setSelectedPackageForDetail(null);
            setSelectedPackageForBooking(pkg);
          }}
          onOpenRouteMap={(pkg) => {
            setSelectedPackageForDetail(null);
            setSelectedPackageForRouteMap(pkg);
          }}
        />
      )}

      {selectedPackageForBooking && (
        <BookingModal
          pkg={selectedPackageForBooking}
          currency={selectedCurrency}
          currentUser={currentUser}
          onClose={() => setSelectedPackageForBooking(null)}
          onBookingConfirmed={handleBookingConfirmed}
        />
      )}

      {pendingBookingPayment && (
        <PaymentGatewayModal
          isOpen={Boolean(pendingBookingPayment)}
          booking={pendingBookingPayment}
          currency={selectedCurrency}
          onClose={() => setPendingBookingPayment(null)}
          onPaymentSuccess={handlePaymentCompleted}
        />
      )}

      {confirmedBookingVoucher && (
        <AdvancePrintVoucherModal
          booking={confirmedBookingVoucher}
          currency={selectedCurrency}
          onClose={() => setConfirmedBookingVoucher(null)}
          onSaveBooking={(updated) => {
            setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
          }}
          adminWhatsAppNumber={adminWhatsAppNumber}
        />
      )}

      {selectedPackageForRouteMap && (
        <TransportRouteMapModal
          isOpen={Boolean(selectedPackageForRouteMap)}
          pkg={selectedPackageForRouteMap}
          currency={selectedCurrency}
          onClose={() => setSelectedPackageForRouteMap(null)}
          onBookNow={(pkg) => {
            setSelectedPackageForRouteMap(null);
            setSelectedPackageForBooking(pkg);
          }}
        />
      )}

      <UserLoginModal
        isOpen={isUserLoginOpen}
        onClose={() => setIsUserLoginOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsUserLoginOpen(false);
        }}
        onLogout={() => setCurrentUser(null)}
        userBookings={bookings}
        onOpenPayment={(b) => setPendingBookingPayment(b)}
        onCheckInBooking={handleCheckInBooking}
      />

      {isVisaGuideOpen && (
        <VisaGuideModal
          onClose={() => setIsVisaGuideOpen(false)}
          onRequestHelp={() => {
            setIsVisaGuideOpen(false);
            setIsCustomTripBuilderOpen(true);
          }}
        />
      )}

      <CustomTripBuilderModal
        isOpen={isCustomTripBuilderOpen}
        onClose={() => setIsCustomTripBuilderOpen(false)}
        onSubmitInquiry={(inq) => setInquiries((prev) => [inq, ...prev])}
      />

      <AdminPortal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
        isLoggedIn={isAdminLoggedIn}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          handleSyncPull();
        }}
        onLogout={() => setIsAdminLoggedIn(false)}
        packages={packages}
        bookings={bookings}
        inquiries={inquiries}
        travelers={registeredUsers}
        onAddPackage={(newPkg) => setPackages((prev) => [newPkg, ...prev])}
        onUpdatePackage={(updatedPkg) =>
          setPackages((prev) => prev.map((p) => (p.id === updatedPkg.id ? updatedPkg : p)))
        }
        onUpdatePackageAmount={(id, newBasePriceINR, originalPriceINR) =>
          setPackages((prev) =>
            prev.map((p) =>
              p.id === id
                ? { ...p, basePriceINR: newBasePriceINR, originalPriceINR: originalPriceINR ?? p.originalPriceINR }
                : p
            )
          )
        }
        onDeletePackage={(id) => setPackages((prev) => prev.filter((p) => p.id !== id))}
        onUpdateBookingStatus={(id, status) =>
          setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
        }
        onUpdateBookingAmount={(id, newTotalAmountINR) =>
          setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, totalAmountINR: newTotalAmountINR } : b)))
        }
        onSaveBooking={(updated) =>
          setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))
        }
        onDeleteBooking={(id) => {
          setBookings((prev) => prev.filter((b) => b.id !== id));
          fetch(`/api/bookings/${id}`, { method: 'DELETE' }).catch(() => {});
        }}
        onUpdateInquiryStatus={(id, status) =>
          setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
        }
        onCheckInBooking={handleCheckInBooking}
        currency={selectedCurrency}
        whatsappContact={adminWhatsAppNumber}
        onUpdateWhatsAppContact={setAdminWhatsAppNumber}
        themeConfig={themeConfig}
        onUpdateThemeConfig={setThemeConfig}
        onSyncPush={handleSyncPush}
        onSyncPull={handleSyncPull}
        onImportDatabase={(imported) => {
          if (imported.bookings) setBookings(imported.bookings);
        }}
        lastSyncedTime={lastSyncedTime}
        syncStatus={syncStatus}
        autoSyncEnabled={autoSyncEnabled}
        onToggleAutoSync={setAutoSyncEnabled}
        onOpenDocs={() => setIsDocsOpen(true)}
      />

      <DocumentationModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
      />

      <WhatsAppCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={(id) => setCartItems((prev) => prev.filter((i) => i.package.id !== id))}
        onUpdateTravelers={(id, count) =>
          setCartItems((prev) =>
            prev.map((i) => (i.package.id === id ? { ...i, travelers: Math.max(1, count) } : i))
          )
        }
        onClearCart={() => setCartItems([])}
        onBookDirect={(pkg) => setSelectedPackageForBooking(pkg)}
        currency={selectedCurrency}
        adminWhatsAppNumber={adminWhatsAppNumber}
      />

      <TravelChatbot
        currency={selectedCurrency}
        adminWhatsAppNumber={adminWhatsAppNumber}
      />

      {liveSyncNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-2xl bg-neutral-900 text-white border border-emerald-500/50 shadow-2xl flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-emerald-400">Multi-Device Cloud Sync</p>
            <p className="text-neutral-200">{liveSyncNotification.text}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
