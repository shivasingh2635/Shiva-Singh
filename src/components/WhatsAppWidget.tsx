import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('Hi Wanderlust! I am planning a holiday and need quick assistance.');

  const handleSend = () => {
    const cleanNumber = '918792658635';
    const encoded = encodeURIComponent(message);
    window.location.href = `https://wa.me/${cleanNumber}?text=${encoded}`;
  };

  return (
    <div className="fixed bottom-5 left-5 z-40">
      {isOpen && (
        <div className="mb-3 w-80 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold">Wanderlust Holiday Concierge</p>
                <p className="text-[10px] text-emerald-100">Online · +91 87926 58635</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 bg-neutral-50 dark:bg-neutral-850 text-xs space-y-3">
            <div className="bg-white dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200">
              Namaste! Which destination are you looking to explore? (Kashmir, Dubai, Swiss Alps, Goa, Kerala, Spiti)
            </div>
            <div className="space-y-2">
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl"
              />
              <button
                onClick={handleSend}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Start WhatsApp Chat
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
};
