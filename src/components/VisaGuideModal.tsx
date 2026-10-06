import React, { useState } from 'react';
import { X, Globe, FileText, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { VISA_GUIDE_DATA } from '../data/packages';

interface VisaGuideModalProps {
  onClose: () => void;
  onRequestHelp: () => void;
}

export const VisaGuideModal: React.FC<VisaGuideModalProps> = ({ onClose, onRequestHelp }) => {
  const [selectedCountryIndex, setSelectedCountryIndex] = useState<number>(0);
  const selectedInfo = VISA_GUIDE_DATA[selectedCountryIndex];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 bg-teal-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-800 flex items-center justify-center">
              <Globe className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">International Visa & Entry Guidelines</h2>
              <p className="text-xs text-teal-200">Official checklist for Indian passport holders (2026 Regulations)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-teal-300 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex overflow-x-auto p-3 bg-neutral-100 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700 gap-2">
          {VISA_GUIDE_DATA.map((info, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCountryIndex(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                selectedCountryIndex === idx
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              <span>{info.flag}</span>
              <span>{info.country}</span>
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-neutral-900 dark:text-neutral-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Visa Category</span>
              <p className="text-sm font-bold mt-1">{selectedInfo.visaType}</p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-600" /> Processing Speed
              </span>
              <p className="text-sm font-bold mt-1">{selectedInfo.processingTime}</p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Maximum Stay Allowed</span>
              <p className="text-sm font-bold mt-1">{selectedInfo.stayDuration}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-600" /> Mandatory Document Checklist
            </h3>
            <div className="space-y-2">
              {selectedInfo.requirements.map((req, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 text-xs font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">Wanderlust Visa Concierge Advice:</p>
              <p className="leading-relaxed">{selectedInfo.tips}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-teal-950 dark:text-teal-200">Need End-to-End Visa Assistance?</p>
              <p className="text-[11px] text-teal-800 dark:text-teal-300">
                Our documentation team prepares your flight reservations, hotel vouchers, and VFS appointments.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onRequestHelp();
              }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Request Visa Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
