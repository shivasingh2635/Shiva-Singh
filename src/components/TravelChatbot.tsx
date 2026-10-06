import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  X,
  Bot,
  User,
  QrCode,
  ExternalLink,
  Check,
  Copy,
  RefreshCw,
  Mic,
  MicOff,
  Volume2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Currency } from '../types';
import { UpiQrCodeSvg } from './UpiQrCodeSvg';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isUpiPrompt?: boolean;
}

interface TravelChatbotProps {
  currency?: Currency;
  adminWhatsAppNumber?: string;
  onBookPackage?: (packageTitle: string) => void;
}

export const TravelChatbot: React.FC<TravelChatbotProps> = ({
  adminWhatsAppNumber = '918792658635',
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  // Voice Input states
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [autoSendVoice, setAutoSendVoice] = useState<boolean>(true);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessages: ChatMessage[] = [
    {
      id: 'msg-1',
      sender: 'bot',
      text: `Hello! I am your AI Travel Concierge for Wanderlust Voyages.\n\nI can help you discover our 9 hidden gem destinations (Ziro Valley, Gurez Valley, Chopta-Tungnath, Dhanushkodi, Meghalaya, Spiti Valley, Faroe Islands, Hallstatt & Cappadocia), customize hotel tiers & add-ons, explain payment & A4 e-tickets, or guide you through online web check-in.\n\nWould you like to see our hidden destinations?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  const getSpeechLocale = () => {
    const lang = i18n.language || 'en';
    if (lang === 'hi') return 'hi-IN';
    if (lang === 'kn') return 'kn-IN';
    return 'en-IN';
  };

  const handleToggleMic = () => {
    setVoiceError(null);

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setVoiceError('Voice input is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = getSpeechLocale();

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
        // 10 second silence safeguard
        silenceTimerRef.current = setTimeout(() => {
          stopListening();
          setVoiceError('I didn\'t catch that. Please try again.');
        }, 10000);
      };

      recognition.onresult = (event: any) => {
        // Reset silence timer on new speech activity
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        silenceTimerRef.current = setTimeout(() => {
          stopListening();
        }, 4000);

        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalText += event.results[i][0].transcript;
          } else {
            interimText += event.results[i][0].transcript;
          }
        }

        const combined = (finalText || interimText).trim();
        if (combined) {
          setInput(combined);
          if (finalText && autoSendVoice) {
            stopListening();
            setTimeout(() => {
              handleSendMessage(finalText.trim());
            }, 300);
          }
        }
      };

      recognition.onerror = (event: any) => {
        stopListening();
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceError('Please allow microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
          setVoiceError('I didn\'t catch that. Please try again.');
        } else if (event.error === 'network') {
          setVoiceError('Network error occurred during speech recognition. Please check your connection.');
        } else {
          setVoiceError('Could not process voice input. Please try again.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceError('Please allow microphone access in your browser settings.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    setIsListening(false);
  };

  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getSpeechLocale();
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText('8792658635@fam');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    if (isListening) stopListening();
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);
    setVoiceError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.reply || "I'm not sure about that. Please contact our support team.";
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isUpiPrompt:
              query.toLowerCase().includes('phonepe') ||
              query.toLowerCase().includes('upi') ||
              query.toLowerCase().includes('pay'),
          },
        ]);
      } else {
        throw new Error('Fallback');
      }
    } catch {
      const fallbackText = `Welcome to Wanderlust Voyages! You can discover our 9 hidden gem destinations, customize 3★/4★/5★ stays, pay via UPI QR / card / netbanking, get your A4 e-ticket with a PNR, and complete web check-in online. Would you like to see our hidden destinations?`;
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isUpiPrompt: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickChips = [
    { label: 'Quiet mountain trip', prompt: 'Find a quiet mountain trip.' },
    { label: '9 Hidden Gems', prompt: 'What are the 9 hidden gem destinations?' },
    { label: 'How to Web Check-in', prompt: 'How do I complete web check-in?' },
    { label: 'Pricing & Tiers', prompt: 'How do hotel tiers and custom trip pricing work?' },
  ];

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#059669] via-teal-600 to-[#059669] text-white font-bold rounded-2xl shadow-xl transition-all hover:scale-105 cursor-pointer"
          >
            <Bot className="w-5 h-5" />
            <div className="text-left leading-tight hidden sm:block">
              <span className="text-xs font-black block">AI Travel Concierge</span>
              <span className="text-[10px] text-emerald-100 block">Wanderlust Voyages · 24/7</span>
            </div>
          </button>
        )}

        {isOpen && (
          <div className="w-[92vw] sm:w-96 h-[560px] max-h-[85vh] bg-[#FFFFFF] dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden z-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#059669] via-teal-700 to-[#0F2A22] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bot className="w-5 h-5 text-emerald-200" />
                <div>
                  <h3 className="text-sm font-black">Wanderlust Voyages Concierge</h3>
                  <p className="text-[11px] text-emerald-100">24/7 Multilingual Travel Guide</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages(initialMessages)}
                  className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
                  title="Reset conversation"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* UPI Quick Banner */}
            <div className="bg-[#F6FBF8] dark:bg-neutral-850 px-3.5 py-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[#059669] font-bold">UPI:</span>
                <code className="font-mono text-[11px] font-bold text-[#0F2A22] dark:text-purple-300">
                  8792658635@fam
                </code>
                <button onClick={handleCopyUpi} className="p-1 cursor-pointer">
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-[#059669]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <button
                onClick={() => setShowQrModal(true)}
                className="px-2 py-1 bg-amber-100 dark:bg-purple-950/60 text-amber-800 dark:text-purple-300 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <QrCode className="w-3 h-3" /> UPI QR
              </button>
            </div>

            {/* Voice Error Banner */}
            {voiceError && (
              <div className="px-3.5 py-2 bg-red-50 text-red-700 text-[11px] font-bold border-b border-red-200 flex items-center justify-between">
                <span>{voiceError}</span>
                <button onClick={() => setVoiceError(null)} className="text-red-500 hover:text-red-800 font-bold">×</button>
              </div>
            )}

            {/* Messages Container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F6FBF8]/60 dark:bg-neutral-900/60 text-xs">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-xl bg-[#059669] text-white flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div className="max-w-[80%] space-y-1">
                    <div
                      className={`p-3 rounded-2xl whitespace-pre-line leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#059669] text-white'
                          : 'bg-[#FFFFFF] dark:bg-neutral-800 text-[#0F2A22] dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.sender === 'bot' && (
                      <div className="flex items-center gap-2 pl-1">
                        <button
                          type="button"
                          onClick={() => handleSpeakText(msg.text)}
                          className="text-[10px] font-bold text-[#4B6B60] hover:text-[#059669] flex items-center gap-1 cursor-pointer"
                          title="Read aloud"
                        >
                          <Volume2 className="w-3 h-3" /> Read Aloud
                        </button>
                      </div>
                    )}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-xl bg-[#0F2A22] text-white flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && <div className="text-[#4B6B60] text-xs italic pl-2">Concierge is typing...</div>}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Chips */}
            <div className="p-2 bg-[#FFFFFF] dark:bg-neutral-850 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-1.5 overflow-x-auto">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.prompt)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#F6FBF8] dark:bg-neutral-800 text-[#0F2A22] dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input & Mic Bar */}
            <div className="p-3 bg-[#FFFFFF] dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
              {isListening && (
                <div className="text-center py-1 text-xs font-black text-red-600 animate-pulse flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" /> Listening... Speak now ({getSpeechLocale()})
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? 'Listening...' : 'Ask in English, हिंदी, or ಕನ್ನಡ...'}
                  className="flex-1 px-3.5 py-2 text-xs bg-[#F6FBF8] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-[#0F2A22] dark:text-white"
                />

                {/* Mic Button */}
                <button
                  type="button"
                  onClick={handleToggleMic}
                  aria-label="Start voice input"
                  title="Start voice input"
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    isListening
                      ? 'bg-red-600 text-white animate-pulse shadow-lg ring-4 ring-red-400/30'
                      : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  aria-label="Send message"
                  className="p-2 bg-[#059669] hover:bg-[#047857] text-white rounded-xl cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-[#4B6B60]">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSendVoice}
                    onChange={(e) => setAutoSendVoice(e.target.checked)}
                    className="w-3 h-3 accent-[#059669] rounded"
                  />
                  Auto-send after speech
                </label>
                <a
                  href={`https://wa.me/${adminWhatsAppNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1 text-[#059669] font-bold"
                >
                  WhatsApp <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] dark:bg-neutral-900 rounded-3xl max-w-sm w-full p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
              <h4 className="text-sm font-bold text-[#0F2A22] dark:text-white">Scan UPI / PhonePe QR</h4>
              <button onClick={() => setShowQrModal(false)} className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-center py-2">
              <UpiQrCodeSvg upiId="8792658635@fam" payeeName="Wanderlust Tours" amountINR={29999} size={180} />
            </div>
            <p className="text-xs text-[#4B6B60]">
              VPA: <strong className="font-mono text-[#0F2A22] dark:text-white">8792658635@fam</strong>
            </p>
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#059669] text-white text-xs font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
