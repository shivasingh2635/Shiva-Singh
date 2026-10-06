import React, { useState, useMemo } from 'react';
import {
  X,
  Lock,
  LayoutDashboard,
  Briefcase,
  CalendarCheck,
  MessageSquare,
  Plus,
  Trash2,
  Edit3,
  Search,
  ShieldCheck,
  DollarSign,
  Users,
  Sparkles,
  Save,
  Pencil,
  BarChart3,
  Shield,
  Plane,
  RefreshCw,
  Palette,
  Laptop,
  Printer,
  BookOpen,
} from 'lucide-react';
import {
  TourPackage,
  BookingRecord,
  CustomerInquiry,
  Currency,
  AdminAnnouncement,
  CustomerUser,
  WebsiteThemeConfig,
} from '../types';
import { formatPrice } from '../data/packages';
import { AdminBarAndPieCharts } from './AdminBarAndPieCharts';
import { AdminThemeCustomizer } from './AdminThemeCustomizer';
import { AdminEditBookingModal } from './AdminEditModal';
import { AdminEditPackageModal } from './AdminEditPackageModal';
import { AdminCloudSyncHub } from './AdminCloudSyncHub';
import { AdvancePrintVoucherModal } from './AdvancePrintVoucherModal';
import heroKashmir from '../assets/images/hero_kashmir_dal_lake_1791214816138.jpg';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
  packages: TourPackage[];
  bookings: BookingRecord[];
  inquiries: CustomerInquiry[];
  travelers?: CustomerUser[];
  onAddPackage: (newPkg: TourPackage) => void;
  onUpdatePackage?: (updatedPkg: TourPackage) => void;
  onUpdatePackageAmount?: (packageId: string, newBasePriceINR: number, originalPriceINR?: number) => void;
  onDeletePackage: (id: string) => void;
  onUpdateBookingStatus: (id: string, status: BookingRecord['status']) => void;
  onUpdateBookingAmount?: (id: string, newTotalAmountINR: number) => void;
  onSaveBooking?: (updatedBooking: BookingRecord) => void;
  onDeleteBooking?: (id: string) => void;
  onUpdateInquiryStatus: (id: string, status: CustomerInquiry['status']) => void;
  onCheckInBooking?: (bookingId: string, details: any) => void;
  currency: Currency;
  announcements?: AdminAnnouncement[];
  onAddAnnouncement?: (ann: AdminAnnouncement) => void;
  onToggleAnnouncement?: (id: string) => void;
  onDeleteAnnouncement?: (id: string) => void;
  whatsappContact?: string;
  onUpdateWhatsAppContact?: (num: string) => void;
  themeConfig?: WebsiteThemeConfig;
  onUpdateThemeConfig?: (config: WebsiteThemeConfig) => void;
  onSyncPush?: (deviceRole: string) => Promise<boolean>;
  onSyncPull?: () => Promise<boolean>;
  onImportDatabase?: (importedData: any) => void;
  lastSyncedTime?: string | null;
  syncStatus?: 'idle' | 'syncing' | 'synced' | 'error';
  autoSyncEnabled?: boolean;
  onToggleAutoSync?: (enabled: boolean) => void;
  onOpenDocs?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  onLoginSuccess,
  onLogout,
  packages = [],
  bookings = [],
  inquiries = [],
  travelers = [],
  onAddPackage,
  onUpdatePackage,
  onUpdatePackageAmount,
  onDeletePackage,
  onUpdateBookingStatus,
  onUpdateBookingAmount,
  onSaveBooking,
  onDeleteBooking,
  onUpdateInquiryStatus,
  currency,
  whatsappContact = '918792658635',
  themeConfig,
  onUpdateThemeConfig,
  onSyncPush,
  onSyncPull,
  onImportDatabase,
  lastSyncedTime: propLastSyncedTime,
  syncStatus: propSyncStatus,
  autoSyncEnabled: propAutoSyncEnabled,
  onToggleAutoSync,
  onOpenDocs,
}) => {
  if (!isOpen) return null;

  const [adminIdentifier, setAdminIdentifier] = useState<string>('');
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'charts' | 'cloud_sync' | 'bookings' | 'travelers' | 'packages' | 'inquiries' | 'theme_customizer'
  >('dashboard');

  const [searchFilter, setSearchFilter] = useState<string>('');
  const [voucherModalBooking, setVoucherModalBooking] = useState<BookingRecord | null>(null);
  const [editingFullBooking, setEditingFullBooking] = useState<BookingRecord | null>(null);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [editingBookingAmount, setEditingBookingAmount] = useState<number>(0);
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);

  const [showAddPackageModal, setShowAddPackageModal] = useState<boolean>(false);
  const [newPkgTitle, setNewPkgTitle] = useState<string>('');
  const [newPkgDestination, setNewPkgDestination] = useState<string>('');
  const [newPkgRegion, setNewPkgRegion] = useState<'domestic' | 'international'>('domestic');
  const [newPkgDays, setNewPkgDays] = useState<number>(6);
  const [newPkgPrice, setNewPkgPrice] = useState<number>(29999);

  const settledRevenue = bookings.reduce((sum, b) => sum + (b.totalAmountINR || 0), 0);

  const filteredBookings = useMemo(() => {
    if (!searchFilter.trim()) return bookings;
    const q = searchFilter.toLowerCase();
    return bookings.filter(
      (b) =>
        b.id.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.phone.includes(q) ||
        b.packageTitle.toLowerCase().includes(q)
    );
  }, [bookings, searchFilter]);

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgTitle || !newPkgDestination) return;
    const newPackage: TourPackage = {
      id: `pkg-${Date.now()}`,
      title: newPkgTitle,
      subtitle: `${newPkgDestination} Holiday Tour`,
      region: newPkgRegion,
      destination: newPkgDestination,
      country: newPkgRegion === 'domestic' ? 'India' : newPkgDestination,
      stateOrCity: newPkgDestination,
      durationDays: newPkgDays,
      durationNights: newPkgDays - 1,
      basePriceINR: newPkgPrice,
      originalPriceINR: Math.round(newPkgPrice * 1.25),
      rating: 4.9,
      reviewsCount: 12,
      theme: 'Luxury',
      season: 'summer',
      heroImage: heroKashmir,
      gallery: [heroKashmir],
      overview: `A handpicked journey to ${newPkgDestination} crafted with verified hotel accommodations.`,
      highlights: ['All transfers in private vehicle', '4-star & 5-star hotels', '24/7 dedicated support'],
      itinerary: [
        {
          day: 1,
          title: `Arrival in ${newPkgDestination}`,
          description: 'Airport pickup and hotel check-in.',
          activities: ['Airport pickup', 'Welcome dinner'],
          mealsIncluded: 'Dinner Included',
          stayLocation: `Grand Hotel, ${newPkgDestination}`,
        },
      ],
      inclusions: ['Verified Hotel Stay', 'Daily breakfast & dinner', 'Private transfers'],
      exclusions: ['Personal expenses'],
      flightIncluded: false,
      visaAssistance: newPkgRegion === 'international',
      isTrending: true,
      seatsLeft: 8,
    };
    onAddPackage(newPackage);
    setShowAddPackageModal(false);
    setNewPkgTitle('');
    setNewPkgDestination('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col w-full max-w-6xl max-h-[92vh] rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 text-white border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                Admin Executive Workspace · Live Sync Active
              </span>
              <h2 className="text-base font-bold text-white">Wanderlust Travel Bureau Admin</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenDocs && (
              <button
                onClick={onOpenDocs}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-950/50 border border-amber-800/60 flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Docs</span>
              </button>
            )}
            {onSyncPull && (
              <button
                onClick={() => onSyncPull()}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sync Cloud Now</span>
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-800 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isLoggedIn ? (
          <div className="p-8 max-w-md mx-auto w-full my-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Admin Console Authentication</h3>
              <p className="text-xs text-neutral-500">
                Verify UPI UTR numbers (8792658635@fam / 6364848532@upi), manage bookings, and edit packages.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onLoginSuccess();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                  Administrator ID or Mobile
                </label>
                <input
                  type="text"
                  placeholder="admin@wanderlust.com"
                  value={adminIdentifier}
                  onChange={(e) => setAdminIdentifier(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" /> One-Click Demo Admin Login
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Nav Tabs */}
            <div className="flex flex-wrap items-center justify-between px-6 py-2.5 bg-neutral-100 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-800 gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'dashboard' ? 'bg-purple-600 text-white' : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Overview
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'bookings' ? 'bg-purple-600 text-white' : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <CalendarCheck className="w-3.5 h-3.5" /> Bookings ({bookings.length})
                </button>
                <button
                  onClick={() => setActiveTab('packages')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'packages' ? 'bg-purple-600 text-white' : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" /> Tours ({packages.length})
                </button>
                <button
                  onClick={() => setActiveTab('charts')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'charts' ? 'bg-purple-600 text-white' : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-cyan-400" /> Bar & Pie Charts
                </button>
                <button
                  onClick={() => setActiveTab('cloud_sync')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'cloud_sync' ? 'bg-indigo-600 text-white' : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5 text-indigo-400" /> 2-Laptop Cloud Sync
                </button>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'inquiries' ? 'bg-purple-600 text-white' : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Leads ({inquiries.length})
                </button>
                <button
                  onClick={() => setActiveTab('theme_customizer')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'theme_customizer' ? 'bg-purple-600 text-white' : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5 text-pink-400" /> Theme & Features
                </button>
              </div>

              <button onClick={onLogout} className="text-xs font-bold text-rose-600 hover:underline cursor-pointer">
                Log Out
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                      <span className="text-xs font-bold uppercase text-neutral-500">Total Bookings</span>
                      <p className="text-2xl font-black mt-1">{bookings.length}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                      <span className="text-xs font-bold uppercase text-neutral-500">Active Tour Packages</span>
                      <p className="text-2xl font-black mt-1">{packages.length}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                      <span className="text-xs font-bold uppercase text-neutral-500">Gross Settled Revenue</span>
                      <p className="text-2xl font-black text-emerald-600 mt-1">
                        {formatPrice(settledRevenue, currency)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <CalendarCheck className="w-4 h-4" /> Manage Bookings ({bookings.length})
                    </button>
                    <button
                      onClick={() => setShowAddPackageModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add New Tour Package
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <h3 className="text-sm font-bold">Customer Bookings & Passenger Dispatch ({bookings.length})</h3>
                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Search bookings..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-700">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-100 dark:bg-neutral-800 text-[11px] uppercase font-bold border-b border-neutral-200 dark:border-neutral-700">
                        <tr>
                          <th className="p-3">Ref ID</th>
                          <th className="p-3">Lead Passenger</th>
                          <th className="p-3">Package</th>
                          <th className="p-3">Departure</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                        {filteredBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                            <td className="p-3 font-mono font-bold">{b.id}</td>
                            <td className="p-3">
                              <strong className="block">{b.customerName}</strong>
                              <span className="text-[10px] text-neutral-500">
                                {b.phone} · {b.email}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="font-semibold block">{b.packageTitle}</span>
                              <span className="text-[10px] text-neutral-500">UTR: {b.transactionRef || 'N/A'}</span>
                            </td>
                            <td className="p-3">{b.departureDate}</td>
                            <td className="p-3 font-mono font-bold">
                              {editingBookingId === b.id ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    value={editingBookingAmount}
                                    onChange={(e) => setEditingBookingAmount(Number(e.target.value))}
                                    className="w-20 px-2 py-1 bg-white dark:bg-neutral-800 border rounded text-xs"
                                  />
                                  <button
                                    onClick={() => {
                                      if (onUpdateBookingAmount) onUpdateBookingAmount(b.id, editingBookingAmount);
                                      setEditingBookingId(null);
                                    }}
                                    className="p-1 text-emerald-600 cursor-pointer"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <span>{formatPrice(b.totalAmountINR, currency)}</span>
                                  <button
                                    onClick={() => {
                                      setEditingBookingId(b.id);
                                      setEditingBookingAmount(b.totalAmountINR);
                                    }}
                                    className="text-neutral-400 hover:text-purple-600 cursor-pointer"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </td>
                            <td className="p-3">
                              <select
                                value={b.status}
                                onChange={(e) => onUpdateBookingStatus(b.id, e.target.value as any)}
                                className="px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 border text-xs font-semibold"
                              >
                                <option value="Confirmed">Confirmed</option>
                                <option value="Checked-In">Checked-In</option>
                                <option value="Pending Payment">Pending Payment</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="p-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setVoucherModalBooking(b)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1 border border-emerald-200 cursor-pointer"
                                >
                                  <Printer className="w-3 h-3" /> Voucher
                                </button>
                                <button
                                  onClick={() => setEditingFullBooking(b)}
                                  className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[11px] font-bold flex items-center gap-1 border cursor-pointer"
                                >
                                  <Edit3 className="w-3 h-3 text-purple-500" /> Edit
                                </button>
                                {onDeleteBooking && (
                                  <button
                                    onClick={() => onDeleteBooking(b.id)}
                                    className="p-1.5 rounded-lg bg-red-50 text-red-600 cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'packages' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold">Tour Package Inventory ({packages.length})</h3>
                    <button
                      onClick={() => setShowAddPackageModal(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Package
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="h-32 rounded-xl overflow-hidden mb-2">
                            <img src={pkg.heroImage} alt={pkg.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          </div>
                          <h4 className="font-bold text-xs line-clamp-1">{pkg.title}</h4>
                          <span className="text-[11px] text-neutral-500">
                            {pkg.destination} · {pkg.durationDays}D/{pkg.durationNights}N
                          </span>
                        </div>
                        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                          <span className="font-bold text-sm font-mono">{formatPrice(pkg.basePriceINR, currency)}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingPackage(pkg)}
                              className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeletePackage(pkg.id)}
                              className="p-1.5 text-neutral-400 hover:text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'charts' && <AdminBarAndPieCharts bookings={bookings} currency={currency} />}

              {activeTab === 'cloud_sync' && (
                <AdminCloudSyncHub
                  bookings={bookings}
                  inquiries={inquiries}
                  packages={packages}
                  onSyncPush={onSyncPush || (async () => true)}
                  onSyncPull={onSyncPull || (async () => true)}
                  onImportDatabase={onImportDatabase || (() => {})}
                  lastSyncedTime={propLastSyncedTime || null}
                  syncStatus={propSyncStatus || 'idle'}
                  autoSyncEnabled={propAutoSyncEnabled ?? true}
                  onToggleAutoSync={onToggleAutoSync || (() => {})}
                />
              )}

              {activeTab === 'inquiries' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold">Traveler Leads & Inquiries ({inquiries.length})</h3>
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 flex items-start justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <strong className="text-sm block">
                          {inq.customerName} ({inq.phone})
                        </strong>
                        <p className="text-neutral-600 dark:text-neutral-300 italic">“{inq.message}”</p>
                      </div>
                      <select
                        value={inq.status}
                        onChange={(e) => onUpdateInquiryStatus(inq.id, e.target.value as any)}
                        className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-800 border text-xs font-semibold"
                      >
                        <option value="New">New</option>
                        <option value="Quote Sent">Quote Sent</option>
                        <option value="Converted">Converted</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'theme_customizer' && (
                <AdminThemeCustomizer
                  themeConfig={
                    themeConfig || {
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
                    }
                  }
                  onUpdateThemeConfig={onUpdateThemeConfig || (() => {})}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {editingFullBooking && (
        <AdminEditBookingModal
          booking={editingFullBooking}
          currency={currency}
          onSave={(updated) => {
            if (onSaveBooking) onSaveBooking(updated);
            setEditingFullBooking(null);
          }}
          onClose={() => setEditingFullBooking(null)}
        />
      )}

      {voucherModalBooking && (
        <AdvancePrintVoucherModal
          booking={voucherModalBooking}
          currency={currency}
          onClose={() => setVoucherModalBooking(null)}
          onSaveBooking={(updated) => {
            if (onSaveBooking) onSaveBooking(updated);
            setVoucherModalBooking(updated);
          }}
          adminWhatsAppNumber={whatsappContact}
        />
      )}

      {editingPackage && (
        <AdminEditPackageModal
          pkg={editingPackage}
          currency={currency}
          onSave={(updated) => {
            if (onUpdatePackage) onUpdatePackage(updated);
            if (onUpdatePackageAmount) {
              onUpdatePackageAmount(updated.id, updated.basePriceINR, updated.originalPriceINR);
            }
            setEditingPackage(null);
          }}
          onClose={() => setEditingPackage(null)}
        />
      )}

      {showAddPackageModal && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-3">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-md w-full p-6 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h3 className="text-sm font-bold">Add New Tour Package</h3>
            <form onSubmit={handleCreatePackage} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Package Title *</label>
                <input
                  type="text"
                  required
                  value={newPkgTitle}
                  onChange={(e) => setNewPkgTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Destination *</label>
                <input
                  type="text"
                  required
                  value={newPkgDestination}
                  onChange={(e) => setNewPkgDestination(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Base Price (INR)</label>
                  <input
                    type="number"
                    value={newPkgPrice}
                    onChange={(e) => setNewPkgPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={newPkgDays}
                    onChange={(e) => setNewPkgDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPackageModal(false)}
                  className="px-4 py-2 rounded-xl border cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold cursor-pointer"
                >
                  Publish Tour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
