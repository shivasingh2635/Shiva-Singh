import React from 'react';
import { useTranslation } from 'react-i18next';
import { Compass, ShieldCheck, MapPin, Phone, Mail, Award } from 'lucide-react';

interface FooterProps {
  onSelectRegion: (r: 'all' | 'domestic' | 'international') => void;
  onOpenVisaGuide: () => void;
  onOpenCallbackModal: () => void;
  onOpenAdminPortal: () => void;
  onOpenDocs?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectRegion,
  onOpenVisaGuide,
  onOpenCallbackModal,
  onOpenAdminPortal,
}) => {
  const { t } = useTranslation();

  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                <Compass className="w-6 h-6" />
              </div>
              <span data-i18n="brand" className="text-xl font-bold tracking-tight text-white">
                {t('brand')}
              </span>
            </div>
            <p data-i18n="footer.description" className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              {t('footer.description')}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-semibold">
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span data-i18n="footer.ministryRecognized">{t('footer.ministryRecognized')}</span>
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5 text-teal-400">
                <Award className="w-3.5 h-3.5" />
                <span data-i18n="footer.iataCertified">{t('footer.iataCertified')}</span>
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 data-i18n="footer.indianDestinations" className="text-xs font-bold uppercase tracking-wider text-white">
              {t('footer.indianDestinations')}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button onClick={() => onSelectRegion('domestic')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Kashmir Houseboats &amp; Gulmarg
                </button>
              </li>
              <li>
                <button onClick={() => onSelectRegion('domestic')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Kerala Tea Gardens &amp; Backwaters
                </button>
              </li>
              <li>
                <button onClick={() => onSelectRegion('domestic')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Goa Beaches &amp; Mandovi Cruise
                </button>
              </li>
              <li>
                <button onClick={() => onSelectRegion('domestic')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Spiti Valley 4x4 Expedition
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 data-i18n="footer.internationalTours" className="text-xs font-bold uppercase tracking-wider text-white">
              {t('footer.internationalTours')}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button onClick={() => onSelectRegion('international')} className="hover:text-teal-400 transition-colors cursor-pointer">
                  Swiss Alps &amp; Scenic Railways
                </button>
              </li>
              <li>
                <button onClick={() => onSelectRegion('international')} className="hover:text-teal-400 transition-colors cursor-pointer">
                  Dubai Desert Safari &amp; Burj Khalifa
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenVisaGuide}
                  data-i18n="footer.checkVisa"
                  className="text-teal-400 font-semibold hover:underline cursor-pointer"
                >
                  {t('footer.checkVisa')}
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 data-i18n="footer.headquartersSupport" className="text-xs font-bold uppercase tracking-wider text-white">
              {t('footer.headquartersSupport')}
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span data-i18n="contact.officeAddress">{t('contact.officeAddress')}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+91 87926 58635 (24x7 Support)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>holidays@wanderlust.com</span>
              </p>
              <div className="pt-2">
                <button
                  onClick={onOpenCallbackModal}
                  data-i18n="footer.requestCallback"
                  className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {t('footer.requestCallback')}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-900 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            © {new Date().getFullYear()} <span data-i18n="brand">{t('brand')}</span>.{' '}
            <span data-i18n="footer.rightsReserved">{t('footer.rightsReserved')}</span>
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={onOpenVisaGuide}
              data-i18n="footer.visaInfo"
              className="hover:text-neutral-300 transition-colors cursor-pointer"
            >
              {t('footer.visaInfo')}
            </button>
            <span>·</span>
            <button
              onClick={onOpenCallbackModal}
              data-i18n="footer.customItineraries"
              className="hover:text-neutral-300 transition-colors cursor-pointer"
            >
              {t('footer.customItineraries')}
            </button>
            <span>·</span>
            <a
              href="/feature-guide.html"
              target="_blank"
              rel="noopener noreferrer"
              data-i18n="nav.docs"
              className="text-amber-400 font-semibold hover:underline cursor-pointer"
            >
              {t('nav.docs')}
            </a>
            <span>·</span>
            <button
              onClick={onOpenAdminPortal}
              data-i18n="footer.adminLogin"
              className="text-purple-400 font-semibold hover:underline cursor-pointer"
            >
              {t('footer.adminLogin')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
