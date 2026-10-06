import React, { useState, useRef } from 'react';
import {
  Laptop,
  RefreshCw,
  CheckCircle2,
  Download,
  Upload,
  Database,
  Wifi,
  Server,
} from 'lucide-react';
import { BookingRecord, CustomerInquiry, TourPackage } from '../types';

interface AdminCloudSyncHubProps {
  bookings: BookingRecord[];
  inquiries: CustomerInquiry[];
  packages: TourPackage[];
  onSyncPush: (deviceRole: string) => Promise<boolean>;
  onSyncPull: () => Promise<boolean>;
  onImportDatabase: (importedData: any) => void;
  lastSyncedTime: string | null;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  autoSyncEnabled: boolean;
  onToggleAutoSync: (enabled: boolean) => void;
}

export const AdminCloudSyncHub: React.FC<AdminCloudSyncHubProps> = ({
  bookings,
  inquiries,
  packages,
  onSyncPush,
  onSyncPull,
  onImportDatabase,
  lastSyncedTime,
  syncStatus,
  autoSyncEnabled,
  onToggleAutoSync,
}) => {
  const [deviceRole, setDeviceRole] = useState<string>('Laptop 1 (Front Desk / Booking Counter)');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportBackup = () => {
    const backup = {
      app: 'Wanderlust Tours & Travels',
      exportedAt: new Date().toISOString(),
      exportedFrom: deviceRole,
      bookings,
      inquiries,
      packages,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Wanderlust_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        if (data.bookings || data.inquiries) {
          onImportDatabase(data);
        }
      } catch {
        // ignore
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-neutral-950 text-white shadow-xl border border-indigo-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-300">2-Laptop Live Synchronization Active</span>
            <h2 className="text-2xl font-black tracking-tight">Multi-Laptop Data Synchronization Hub</h2>
            <p className="text-xs text-indigo-200/80 max-w-2xl">
              When User 1 enters booking or customer inquiries on Laptop 1, the data is automatically synced to the central server so it can be immediately accessed and edited from Laptop 2 in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSyncPull()}
              disabled={syncStatus === 'syncing'}
              className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              <span>{syncStatus === 'syncing' ? 'Synchronizing...' : 'Force Sync Both Laptops'}</span>
            </button>
            <button
              onClick={() => onSyncPush(deviceRole)}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Push Edits to Cloud</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-3">
          <div className="flex items-center gap-2">
            <Laptop className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-black">This Machine Identity</h3>
          </div>
          {[
            'Laptop 1 (Front Desk / Booking Counter)',
            'Laptop 2 (Back Office / Accounts Office)',
          ].map((role) => (
            <button
              key={role}
              onClick={() => setDeviceRole(role)}
              className={`w-full p-2.5 rounded-xl text-xs text-left font-bold flex items-center justify-between border cursor-pointer ${
                deviceRole === role ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500' : 'border-neutral-200 dark:border-neutral-700'
              }`}
            >
              <span>{role}</span>
              {deviceRole === role && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
            </button>
          ))}
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-3 text-xs">
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-black">Live Connection State</h3>
          </div>
          <div className="flex justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800">
            <span>Last Cloud Sync:</span>
            <span className="font-mono">{lastSyncedTime || 'Just now'}</span>
          </div>
          <div className="flex justify-between items-center p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800">
            <span>Auto-Sync:</span>
            <button
              onClick={() => onToggleAutoSync(!autoSyncEnabled)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                autoSyncEnabled ? 'bg-emerald-600 text-white' : 'bg-neutral-200 text-neutral-700'
              }`}
            >
              {autoSyncEnabled ? 'ENABLED' : 'PAUSED'}
            </button>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-black">Backup & Restore</h3>
          </div>
          <button
            onClick={handleExportBackup}
            className="w-full py-2 px-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-600" /> Export Full JSON Database
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 px-3 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4" /> Import & Merge Backup
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImportFile} accept=".json" className="hidden" />
        </div>
      </div>
    </div>
  );
};
