import React from 'react';
import { useTranslation } from 'react-i18next';
import { Palmtree, Plane, Building2, Car, Globe, QrCode, Sparkles } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { t } = useTranslation();

  const serviceItems = [
    {
      icon: Palmtree,
      titleKey: 'services.item1Title',
      descKey: 'services.item1Desc',
      anchor: 'packages',
    },
    {
      icon: Plane,
      titleKey: 'services.item2Title',
      descKey: 'services.item2Desc',
      anchor: 'flights-section',
    },
    {
      icon: Building2,
      titleKey: 'services.item3Title',
      descKey: 'services.item3Desc',
      anchor: 'hotels-section',
    },
    {
      icon: Car,
      titleKey: 'services.item4Title',
      descKey: 'services.item4Desc',
      anchor: 'cabs-section',
    },
    {
      icon: Globe,
      titleKey: 'services.item5Title',
      descKey: 'services.item5Desc',
      anchor: 'contact-section',
    },
    {
      icon: QrCode,
      titleKey: 'services.item6Title',
      descKey: 'services.item6Desc',
      anchor: 'packages',
    },
  ];

  return (
    <section id="services-overview" className="scroll-mt-24 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span data-i18n="services.kicker">{t('services.kicker')}</span>
        </div>
        <h2
          data-i18n="services.title"
          className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white font-['Playfair_Display',serif]"
        >
          {t('services.title')}
        </h2>
        <p data-i18n="services.subtitle" className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          {t('services.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => {
                const el = document.getElementById(item.anchor);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 data-i18n={item.titleKey} className="text-base font-bold text-neutral-900 dark:text-white">
                {t(item.titleKey)}
              </h3>
              <p data-i18n={item.descKey} className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {t(item.descKey)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
