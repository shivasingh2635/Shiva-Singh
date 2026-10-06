import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Copy,
  Check,
  Printer,
  Plane,
  CreditCard,
  Shield,
  RefreshCw,
  CheckCircle2,
  Globe,
  Download,
} from 'lucide-react';
import { generateWordDocumentHtml } from '../data/documentationHtml';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdminPortal?: () => void;
}

type DocCategory = 'overview' | 'verticals' | 'checkout' | 'admin' | 'sync' | 'checklist';

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<DocCategory>('overview');
  const [copied, setCopied] = useState(false);
  const [downloadedWord, setDownloadedWord] = useState(false);

  if (!isOpen) return null;

  const fullMarkdownDocumentation = `# Wanderlust Tours & Travels — Official System & Feature Documentation
- Holidays & Tours: Curated domestic & international packages with dynamic currency converter.
- Flight, Hotel, Airport Cab & Dining Engines: Complete travel suite.
- UPI Instant Payment: 8792658635@fam & 6364848532@upi with scannable QR code & UTR verification.
- Multi-Device Real-Time Cloud Sync: Sub-second SSE sync across phones and laptops.`;

  const handleCopyMarkdown = () => {
    navigator.clipboard?.writeText(fullMarkdownDocumentation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadWordDoc = () => {
    const docHtml = generateWordDocumentHtml();
    const blob = new Blob(['\ufeff' + docHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Wanderlust_Full_Documentation.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadedWord(true);
    setTimeout(() => setDownloadedWord(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-5xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[92vh]">
        <div className="px-6 py-4 bg-neutral-900 text-white border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-black text-white">Documentation & Feature Guide</h2>
              <p className="text-xs text-neutral-400">Complete operational manual, booking workflows & cloud sync</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadWordDoc}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {downloadedWord ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span>{downloadedWord ? 'Downloaded!' : 'Download Word (.doc)'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print</span>
            </button>
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy MD'}</span>
            </button>
            <button onClick={onClose} className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'overview', label: '1. Overview', icon: Globe },
            { id: 'verticals', label: '2. Travel Verticals', icon: Plane },
            { id: 'checkout', label: '3. Booking & Payments', icon: CreditCard },
            { id: 'admin', label: '4. Admin Portal', icon: Shield },
            { id: 'sync', label: '5. Cloud Sync & API', icon: RefreshCw },
            { id: 'checklist', label: '6. Features Checklist', icon: CheckCircle2 },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as DocCategory)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-white'
                    : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs text-neutral-700 dark:text-neutral-300">
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Wanderlust Tours & Travels — Full-Stack Architecture
            </h3>
            <p>
              Built with React 19, TypeScript, Vite, Tailwind CSS, and an Express.js backend on Port 3000 with Server-Sent Events (SSE) real-time synchronization across laptops and smartphones.
            </p>
            <ul className="list-disc list-inside space-y-1 pt-2">
              <li>
                <strong>Curated Holiday Packages:</strong> Kashmir, Dubai, Swiss Alps, Goa, Kerala, and Spiti Valley.
              </li>
              <li>
                <strong>Complete Travel Suite:</strong> Flights, Hotels, Airport Cabs, Dining Reservations, and Deals.
              </li>
              <li>
                <strong>UPI & QR Payment Gateway:</strong> Supports 8792658635@fam and 6364848532@upi with 12-digit UTR verification.
              </li>
              <li>
                <strong>Admin & Operations Console:</strong> Bar & Pie charts, 2-Laptop Cloud Sync Hub, and Theme Customizer.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
