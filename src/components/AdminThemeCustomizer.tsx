import React, { useState } from 'react';
import { Palette, Save, CheckCircle2, Sliders } from 'lucide-react';
import { WebsiteThemeConfig } from '../types';

interface AdminThemeCustomizerProps {
  themeConfig: WebsiteThemeConfig;
  onUpdateThemeConfig: (config: WebsiteThemeConfig) => void;
}

export const AdminThemeCustomizer: React.FC<AdminThemeCustomizerProps> = ({
  themeConfig,
  onUpdateThemeConfig,
}) => {
  const [localConfig, setLocalConfig] = useState<WebsiteThemeConfig>(themeConfig);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSave = () => {
    onUpdateThemeConfig(localConfig);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-600" />
          <h3 className="text-base font-bold">Customizable Website Theme & Feature Controls</h3>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" /> Save Changes
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Website theme and layout preferences updated!</span>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-500" /> Storefront Section Visibility Toggles
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: 'showFlightsBottom', label: 'Flights Booking Engine', checked: localConfig.showFlightsBottom },
            { id: 'showHotelsBottom', label: 'Hotels & Luxury Resorts Engine', checked: localConfig.showHotelsBottom },
            { id: 'showCabsBottom', label: 'Airport Cabs & Chauffeur Services', checked: localConfig.showCabsBottom },
            { id: 'showDiningBottom', label: 'Restaurants & Dining Experiences', checked: localConfig.showDiningBottom },
            { id: 'showOffersBottom', label: 'Deals & Promotional Coupons', checked: localConfig.showOffersBottom },
            { id: 'showTestimonials', label: 'Verified Traveler Reviews', checked: localConfig.showTestimonials },
          ].map((toggle) => (
            <label
              key={toggle.id}
              className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between cursor-pointer"
            >
              <strong className="text-xs font-bold">{toggle.label}</strong>
              <input
                type="checkbox"
                checked={toggle.checked}
                onChange={(e) => setLocalConfig({ ...localConfig, [toggle.id]: e.target.checked })}
                className="w-4 h-4 accent-purple-600 rounded"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
