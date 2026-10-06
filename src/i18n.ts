import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';
import kn from './locales/kn.json';

export type SupportedLanguage = 'en' | 'hi' | 'kn';

export const TRANSLATIONS: Record<SupportedLanguage, typeof en> = {
  en,
  hi,
  kn,
};

const STORAGE_KEY = 'wanderlust_lang';

export function getSavedLanguage(): SupportedLanguage {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'hi' || saved === 'kn') {
      return saved;
    }
  }
  return 'en';
}

function resolveKey(obj: any, path: string): string | undefined {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

/**
 * Synchronizes all DOM elements that carry a `data-i18n` or `data-i18n-placeholder` attribute
 * and sets `<html lang="...">` + persists in `localStorage`.
 */
export function applyDomTranslations(lang: SupportedLanguage) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = lang;
  localStorage.setItem(STORAGE_KEY, lang);

  const dictionary = TRANSLATIONS[lang] || TRANSLATIONS.en;

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const translated = resolveKey(dictionary, key);
    if (typeof translated === 'string') {
      el.textContent = translated;
    }
  });

  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (!key) return;
    const translated = resolveKey(dictionary, key);
    if (typeof translated === 'string') {
      el.placeholder = translated;
    }
  });
}

const initialLang = getSavedLanguage();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    kn: { translation: kn },
  },
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLang;
}

i18n.on('languageChanged', (lng) => {
  const validLang: SupportedLanguage = lng === 'hi' || lng === 'kn' ? lng : 'en';
  applyDomTranslations(validLang);
});

export default i18n;
