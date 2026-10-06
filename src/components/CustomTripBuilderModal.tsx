import React, { useState } from 'react';
import {
  X,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  Heart,
  Check,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import { CustomerInquiry } from '../types';

interface CustomTripBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitInquiry: (inquiry: CustomerInquiry) => void;
}

export const CustomTripBuilderModal: React.FC<CustomTripBuilderModalProps> = ({
  isOpen,
  onClose,
  onSubmitInquiry,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [destination, setDestination] = useState<string>('Switzerland & Paris');
  const [departureDate, setDepartureDate] = useState<string>('2026-10-15');
  const [durationDays, setDurationDays] = useState<number>(7);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [budgetTier, setBudgetTier] = useState<string>('Comfort & Deluxe (4-Star)');
  const [specialFocuses, setSpecialFocuses] = useState<string[]>([
    'Private Chauffeur & Vehicle',
    'Pure Vegetarian / Jain / Halal Meals',
  ]);
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const focusOptions = [
    'Honeymoon Setup & Flowers',
    'Candlelight Seaside Dinners',
    'Pure Vegetarian / Jain / Halal Meals',
    'Private Chauffeur & Vehicle',
    'Senior Citizen / Wheelchair Support',
    'Adventure Sports & Scuba Diving',
    'English/Hindi Speaking Local Guide',
    'Luxury Palace / Castle Stays',
  ];

  const toggleFocus = (opt: string) => {
    if (specialFocuses.includes(opt)) {
      setSpecialFocuses(specialFocuses.filter((f) => f !== opt));
    } else {
      setSpecialFocuses([...specialFocuses, opt]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    const inquiry: CustomerInquiry = {
      id: `CUSTOM-${Date.now()}`,
      customerName: fullName,
      phone,
      email: email || 'concierge@wanderlust.com',
      destinationInterest: destination,
      preferredMonth: departureDate,
      travelersCount: adults + children,
      message: `[Bespoke Trip Builder] Duration: ${durationDays} days. Budget Tier: ${budgetTier}. Special Focus: ${specialFocuses.join(', ')}. Notes: ${notes}`,
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    onSubmitInquiry(inquiry);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold">Bespoke Custom Trip Designer</h3>
              <p className="text-xs text-emerald-200">Step {currentStep} of 4 · Handcrafted by Personal Travel Concierges</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-emerald-300 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 flex">
          <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${(currentStep / 4) * 100}%` }} />
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-xl font-bold">Bespoke Itinerary Request Received!</h4>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Thank you, <strong>{fullName}</strong>. Our senior holiday designer has received your preferences for {destination} and will reach out on WhatsApp/Call within 30 minutes.
            </p>
            <div className="pt-3 flex justify-center gap-3">
              <a
                href={`https://wa.me/918792658635?text=${encodeURIComponent(`Hi Wanderlust, I submitted a custom trip request for ${destination} (${durationDays} days).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" /> Open WhatsApp Concierge
              </a>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setCurrentStep(1);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Where would you like to travel? *
                  </label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Approx. Departure Date
                    </label>
                    <input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold mb-1 block">Duration: {durationDays} Days</label>
                    <input
                      type="range"
                      min={3}
                      max={21}
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      className="w-full accent-emerald-600 mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold flex items-center gap-1 mb-1">
                      <Users className="w-3.5 h-3.5 text-emerald-600" /> Adults
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold mb-1 block">Children</label>
                    <input
                      type="number"
                      min={0}
                      max={15}
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold flex items-center gap-1 mb-2">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> Preferred Accommodation Tier
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      'Standard (3-Star)',
                      'Comfort & Deluxe (4-Star)',
                      'Luxury & Palaces (5-Star)',
                      'Ultra-Luxury Bespoke VIP',
                    ].map((tier) => (
                      <div
                        key={tier}
                        onClick={() => setBudgetTier(tier)}
                        className={`p-3 rounded-xl border cursor-pointer font-bold ${
                          budgetTier === tier ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30' : 'border-neutral-200 dark:border-neutral-800'
                        }`}
                      >
                        {tier}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-3">
                <label className="text-xs font-bold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-emerald-600" /> Special Experiences & Trip Focuses
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {focusOptions.map((opt) => (
                    <div
                      key={opt}
                      onClick={() => toggleFocus(opt)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${
                        specialFocuses.includes(opt) ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 font-semibold' : 'border-neutral-200 dark:border-neutral-800'
                      }`}
                    >
                      <span>{opt}</span>
                      {specialFocuses.includes(opt) && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Email Address</label>
                    <input
                      type="email"
                      placeholder="ananya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold">Any Specific Wishes or Notes?</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Generate Bespoke Itinerary
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
