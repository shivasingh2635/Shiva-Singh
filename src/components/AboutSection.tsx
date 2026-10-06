import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Headphones, HeartHandshake, Sparkles } from 'lucide-react';
import heroKashmir from '../assets/images/hero_kashmir_dal_lake_1791214816138.jpg';

export const AboutSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="about-section" className="scroll-mt-24 space-y-12">
      {/* Main Story Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-10 border border-neutral-200 dark:border-neutral-800 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span data-i18n="about.kicker">{t('about.kicker')}</span>
          </div>
          <h2
            data-i18n="about.title"
            className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white font-['Playfair_Display',serif]"
          >
            {t('about.title')}
          </h2>
          <p
            data-i18n="about.paragraph1"
            className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed"
          >
            {t('about.paragraph1')}
          </p>
          <p
            data-i18n="about.paragraph2"
            className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed"
          >
            {t('about.paragraph2')}
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <div>
              <p
                data-i18n="about.stat1Value"
                className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono-tabular"
              >
                {t('about.stat1Value')}
              </p>
              <p data-i18n="about.stat1Label" className="text-xs text-neutral-500 mt-0.5">
                {t('about.stat1Label')}
              </p>
            </div>
            <div>
              <p
                data-i18n="about.stat2Value"
                className="text-xl sm:text-2xl font-black text-teal-600 dark:text-teal-400 font-mono-tabular"
              >
                {t('about.stat2Value')}
              </p>
              <p data-i18n="about.stat2Label" className="text-xs text-neutral-500 mt-0.5">
                {t('about.stat2Label')}
              </p>
            </div>
            <div>
              <p
                data-i18n="about.stat3Value"
                className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-mono-tabular"
              >
                {t('about.stat3Value')}
              </p>
              <p data-i18n="about.stat3Label" className="text-xs text-neutral-500 mt-0.5">
                {t('about.stat3Label')}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-md h-72 sm:h-80">
            <img
              src={heroKashmir}
              alt="Wanderlust Travels Kashmir Houseboat"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Why Travelers Choose Us */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-10 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
        <h3
          data-i18n="about.whyTitle"
          className="text-xl sm:text-2xl font-extrabold text-center text-neutral-900 dark:text-white font-['Playfair_Display',serif]"
        >
          {t('about.whyTitle')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 data-i18n="about.why1Title" className="text-sm font-bold text-neutral-900 dark:text-white">
              {t('about.why1Title')}
            </h4>
            <p data-i18n="about.why1Desc" className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {t('about.why1Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <h4 data-i18n="about.why2Title" className="text-sm font-bold text-neutral-900 dark:text-white">
              {t('about.why2Title')}
            </h4>
            <p data-i18n="about.why2Desc" className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {t('about.why2Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h4 data-i18n="about.why3Title" className="text-sm font-bold text-neutral-900 dark:text-white">
              {t('about.why3Title')}
            </h4>
            <p data-i18n="about.why3Desc" className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {t('about.why3Desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
