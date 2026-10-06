import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { SupportedLanguage, applyDomTranslations } from '../i18n';

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language as SupportedLanguage) || 'en';

  const handleLanguageChange = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
    applyDomTranslations(lang);
  };

  return (
    <div className="inline-flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl border border-neutral-300 dark:border-neutral-700">
      <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 ml-1.5 hidden sm:inline" />
      {(
        [
          { code: 'en', label: 'EN', title: 'English' },
          { code: 'hi', label: 'हिंदी', title: 'Hindi (हिंदी)' },
          { code: 'kn', label: 'ಕನ್ನಡ', title: 'Kannada (ಕನ್ನಡ)' },
        ] as const
      ).map((item) => {
        const active = currentLang === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => handleLanguageChange(item.code)}
            title={item.title}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              active
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
