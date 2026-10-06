import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, MessageCircle, Users } from 'lucide-react';
import { CartItem, Currency, TourPackage } from '../types';
import { formatPrice } from '../data/packages';

interface WhatsAppCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (packageId: string) => void;
  onUpdateTravelers: (packageId: string, count: number) => void;
  onClearCart: () => void;
  onBookDirect: (pkg: TourPackage) => void;
  currency: Currency;
  adminWhatsAppNumber?: string;
}

export const WhatsAppCartDrawer: React.FC<WhatsAppCartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems = [],
  onRemoveItem,
  onUpdateTravelers,
  onClearCart,
  onBookDirect,
  currency,
  adminWhatsAppNumber = '918792658635',
}) => {
  if (!isOpen) return null;

  const totalEstimateINR = cartItems.reduce((sum, item) => sum + item.package.basePriceINR * item.travelers, 0);

  const handleCheckoutViaWhatsApp = () => {
    if (cartItems.length === 0) return;
    let text = `*Namaste Wanderlust Travels!*\nI have selected the following holiday tour package(s):\n\n`;
    cartItems.forEach((item, index) => {
      text += `${index + 1}. ${item.package.title} (${item.travelers} Travelers) - ₹${(
        item.package.basePriceINR * item.travelers
      ).toLocaleString('en-IN')}\n`;
    });
    text += `\nTotal Estimate: ₹${totalEstimateINR.toLocaleString('en-IN')}\nPhonePe UPI: 8792658635@fam`;
    const cleanNumber = adminWhatsAppNumber.replace(/[^0-9]/g, '');
    window.location.href = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-neutral-900 shadow-2xl border-l border-neutral-200 dark:border-neutral-800 flex flex-col">
          <div className="p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5" />
              <div>
                <h2 className="text-base font-black">Holiday Wishlist Cart ({cartItems.length})</h2>
                <p className="text-xs text-emerald-100">Send directly to WhatsApp Concierge</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-emerald-100 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <ShoppingBag className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold">Your Cart is Empty</h3>
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Explore Holiday Packages
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800 text-xs">
                  <span className="font-bold text-neutral-500 uppercase text-[10px]">Saved Tour Packages</span>
                  <button onClick={onClearCart} className="text-rose-600 hover:underline text-[11px] font-semibold cursor-pointer">
                    Clear Wishlist
                  </button>
                </div>

                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.package.id}
                      className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 space-y-3"
                    >
                      <div className="flex gap-3">
                        <img
                          src={item.package.heroImage}
                          alt={item.package.title}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold truncate">{item.package.title}</h4>
                          <p className="text-[11px] text-neutral-500">
                            {item.package.durationDays}D / {item.package.durationNights}N · {item.package.destination}
                          </p>
                          <p className="text-xs font-black text-emerald-600 mt-0.5">
                            {formatPrice(item.package.basePriceINR, currency)} / person
                          </p>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.package.id)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 self-start cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-neutral-500 flex items-center gap-1 font-semibold">
                            <Users className="w-3.5 h-3.5" /> Travelers:
                          </span>
                          <div className="flex items-center border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900">
                            <button
                              type="button"
                              onClick={() => onUpdateTravelers(item.package.id, Math.max(1, item.travelers - 1))}
                              className="px-2 py-0.5 text-xs font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-2.5 py-0.5 text-xs font-black">{item.travelers}</span>
                            <button
                              type="button"
                              onClick={() => onUpdateTravelers(item.package.id, item.travelers + 1)}
                              className="px-2 py-0.5 text-xs font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            onBookDirect(item.package);
                          }}
                          className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          Direct Book <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-5 bg-neutral-50 dark:bg-neutral-850 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-neutral-500">Est. Total</span>
                  <p className="text-xl font-black">{formatPrice(totalEstimateINR, currency)}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-600">Best Group Rates</span>
              </div>

              <button
                type="button"
                onClick={handleCheckoutViaWhatsApp}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Send Cart to WhatsApp ({adminWhatsAppNumber})
              </button>
              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant response within 5 minutes</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
