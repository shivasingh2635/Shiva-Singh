import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const DB_FILE_PATH = path.join(process.cwd(), 'wanderlust_cloud_db.json');

interface CloudSyncStore {
  bookings?: any[];
  inquiries?: any[];
  packages?: any[];
  announcements?: any[];
  themeConfig?: any;
  adminWhatsAppNumber?: string;
  lastUpdated: string;
  lastUpdatedBy?: string;
  version: number;
}

let serverStore: CloudSyncStore = {
  lastUpdated: new Date().toISOString(),
  lastUpdatedBy: 'System Initialization',
  adminWhatsAppNumber: '918792658635',
  version: 1,
  bookings: [],
  inquiries: [],
};

try {
  if (fs.existsSync(DB_FILE_PATH)) {
    const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    serverStore = JSON.parse(raw);
  }
} catch (err) {
  console.warn('Initializing fresh server cloud sync database:', err);
}

const sseClients = new Set<express.Response>();

function broadcastSync(eventType: string, extraData: any = {}) {
  const payload = {
    type: eventType,
    bookings: serverStore.bookings || [],
    packages: serverStore.packages || [],
    inquiries: serverStore.inquiries || [],
    announcements: serverStore.announcements || [],
    themeConfig: serverStore.themeConfig || null,
    adminWhatsAppNumber: serverStore.adminWhatsAppNumber || '918792658635',
    version: serverStore.version || 1,
    lastUpdated: serverStore.lastUpdated,
    lastUpdatedBy: serverStore.lastUpdatedBy,
    timestamp: new Date().toISOString(),
    ...extraData,
  };
  const message = `data: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(message);
    } catch {
      sseClients.delete(client);
    }
  }
}

function saveStoreToDisk() {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(serverStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing cloud database to disk:', err);
  }
}

function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return null;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '20mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Wanderlust Cloud Sync & AI API',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/sync', (_req, res) => {
    res.json({
      success: true,
      data: serverStore,
      bookings: serverStore.bookings || [],
      packages: serverStore.packages || [],
      inquiries: serverStore.inquiries || [],
      announcements: serverStore.announcements || [],
      themeConfig: serverStore.themeConfig || null,
      adminWhatsAppNumber: serverStore.adminWhatsAppNumber || '918792658635',
      version: serverStore.version || 1,
      lastUpdated: serverStore.lastUpdated,
      lastUpdatedBy: serverStore.lastUpdatedBy,
      serverTime: new Date().toISOString(),
    });
  });

  app.get('/api/sync/stream', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    const initialPayload = {
      type: 'connected',
      bookings: serverStore.bookings || [],
      packages: serverStore.packages || [],
      inquiries: serverStore.inquiries || [],
      version: serverStore.version || 1,
      lastUpdated: serverStore.lastUpdated,
      lastUpdatedBy: serverStore.lastUpdatedBy,
    };
    res.write(`data: ${JSON.stringify(initialPayload)}\n\n`);

    sseClients.add(res);

    const heartbeat = setInterval(() => {
      try {
        res.write(': heartbeat\n\n');
      } catch {
        clearInterval(heartbeat);
        sseClients.delete(res);
      }
    }, 15000);

    req.on('close', () => {
      clearInterval(heartbeat);
      sseClients.delete(res);
    });
  });

  app.post('/api/sync', (req, res) => {
    try {
      const { bookings, inquiries, packages, announcements, themeConfig, adminWhatsAppNumber, deviceName, deviceRole } =
        req.body || {};

      let hasChanges = false;

      if (Array.isArray(bookings) && bookings.length > 0) {
        const existingMap = new Map<string, any>((serverStore.bookings || []).map((b: any) => [b.id, b]));
        for (const incoming of bookings) {
          if (!incoming || !incoming.id) continue;
          if (existingMap.has(incoming.id)) {
            const existing = existingMap.get(incoming.id);
            existingMap.set(incoming.id, {
              ...existing,
              ...incoming,
              updatedAt: new Date().toISOString(),
            });
          } else {
            existingMap.set(incoming.id, incoming);
          }
        }
        serverStore.bookings = Array.from(existingMap.values());
        hasChanges = true;
      }

      if (Array.isArray(inquiries)) {
        serverStore.inquiries = inquiries;
        hasChanges = true;
      }

      if (Array.isArray(packages) && packages.length > 0) {
        serverStore.packages = packages;
        hasChanges = true;
      }

      if (Array.isArray(announcements)) {
        serverStore.announcements = announcements;
        hasChanges = true;
      }

      if (themeConfig && typeof themeConfig === 'object') {
        serverStore.themeConfig = themeConfig;
        hasChanges = true;
      }

      if (adminWhatsAppNumber) {
        serverStore.adminWhatsAppNumber = adminWhatsAppNumber;
        hasChanges = true;
      }

      if (hasChanges) {
        serverStore.version = (serverStore.version || 1) + 1;
        serverStore.lastUpdated = new Date().toISOString();
        serverStore.lastUpdatedBy = deviceRole || deviceName || 'Connected Device';
        saveStoreToDisk();
        broadcastSync('sync-update', { source: 'post-sync' });
      }

      res.json({
        success: true,
        version: serverStore.version,
        lastUpdated: serverStore.lastUpdated,
        lastUpdatedBy: serverStore.lastUpdatedBy,
        bookingsCount: serverStore.bookings?.length || 0,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Sync failed' });
    }
  });

  app.post('/api/bookings', (req, res) => {
    try {
      const booking = req.body;
      if (!booking || !booking.id) {
        res.status(400).json({ error: 'Valid booking object with id is required' });
        return;
      }
      if (!Array.isArray(serverStore.bookings)) {
        serverStore.bookings = [];
      }

      const existingIndex = serverStore.bookings.findIndex((b: any) => b.id === booking.id);
      if (existingIndex >= 0) {
        serverStore.bookings[existingIndex] = {
          ...serverStore.bookings[existingIndex],
          ...booking,
          updatedAt: new Date().toISOString(),
        };
      } else {
        serverStore.bookings = [
          {
            ...booking,
            createdAt: booking.createdAt || new Date().toISOString(),
          },
          ...serverStore.bookings,
        ];
      }

      serverStore.version = (serverStore.version || 1) + 1;
      serverStore.lastUpdated = new Date().toISOString();
      serverStore.lastUpdatedBy = req.body.deviceRole || 'Mobile / Client Device';

      saveStoreToDisk();
      broadcastSync('booking-created', { newBooking: booking });

      res.json({
        success: true,
        booking,
        version: serverStore.version,
        totalBookings: serverStore.bookings.length,
        lastUpdated: serverStore.lastUpdated,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed to save booking' });
    }
  });

  app.get('/api/bookings', (_req, res) => {
    res.json({
      success: true,
      bookings: serverStore.bookings || [],
      version: serverStore.version || 1,
      lastUpdated: serverStore.lastUpdated,
    });
  });

  app.delete('/api/bookings/:id', (req, res) => {
    try {
      const bookingId = req.params.id;
      if (Array.isArray(serverStore.bookings)) {
        serverStore.bookings = serverStore.bookings.filter((b: any) => b.id !== bookingId);
        serverStore.version = (serverStore.version || 1) + 1;
        serverStore.lastUpdated = new Date().toISOString();
        serverStore.lastUpdatedBy = 'Admin Deletion';
        saveStoreToDisk();
        broadcastSync('booking-deleted', { bookingId });
      }
      res.json({ success: true, version: serverStore.version, bookings: serverStore.bookings });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.get('/api/bookings/lookup', (req, res) => {
    try {
      const query = ((req.query.q as string) || '').trim().toLowerCase();
      if (!query) {
        res.json({ success: true, bookings: [] });
        return;
      }
      const cleanDigits = query.replace(/[^0-9]/g, '');
      const all = serverStore.bookings || [];
      const matches = all.filter((b: any) => {
        const idMatch = (b.id || '').toLowerCase().includes(query);
        const emailMatch = (b.email || '').toLowerCase().includes(query);
        const nameMatch = (b.customerName || '').toLowerCase().includes(query);
        const phoneDigits = (b.phone || '').replace(/[^0-9]/g, '');
        const phoneMatch = cleanDigits.length >= 5 && phoneDigits.includes(cleanDigits);
        return idMatch || emailMatch || nameMatch || phoneMatch;
      });
      res.json({ success: true, bookings: matches, totalFound: matches.length });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.get('/feature-guide.html', (_req, res) => {
    const publicGuide = path.join(process.cwd(), 'public', 'feature-guide.html');
    if (fs.existsSync(publicGuide)) {
      res.sendFile(publicGuide);
    } else {
      res.status(404).send('Feature guide not found');
    }
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { message } = req.body || {};
      if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const systemInstruction = `You are the AI Travel Concierge for Wanderlust Voyages, a connected travel platform for discovering hidden destinations, customizing trips, paying, getting documents, and checking in online.

HOW TO ANSWER (user-friendly documentation style)
- Reply in the same language the user writes in.
- Be warm, clear and simple. Avoid technical words unless the user asks.
- Give the direct answer first in 1-3 sentences, then offer steps or details.
- For "how do I..." questions, answer in short numbered steps.
- End with one helpful next step, such as "Would you like to see our hidden destinations?"
- If a question is unclear, ask ONE short clarifying question.
- Use ONLY the information below. If something is not covered, say: "I'm not sure about that. Please contact our support team," and never invent prices, dates or policies.
- Politely steer away from topics unrelated to travel with Wanderlust Voyages.

THE JOURNEY (6 steps)
1. Discover: search destinations.
2. Customize: choose guests, travel date, hotel tier, insurance, airport cab and experiences.
3. Price: see a clear price breakdown.
4. Pay: UPI QR, credit/debit card, or netbanking.
5. Confirm: get your e-ticket/voucher with a PNR.
6. Travel: web check-in before arrival.

HIDDEN GEM DESTINATIONS (9)
Domestic (6):
- Ziro Valley, Arunachal Pradesh: Apatani culture, pine groves, bamboo architecture, rice-fish terraces, Kardo rock Shiva monolith.
- Gurez Valley, Kashmir: Razdan Pass, Habba Khatoon peak, Dard-Shina log cabins, turquoise Kishanganga River.
- Chopta, Tungnath and Chandrashila, Garhwal: alpine landscapes, high Shiva temple, summit panorama, Deoriatal.
- Dhanushkodi, Rameshwaram, Tamil Nadu: ghost-island landscape, Ram Setu shoals, Pamban bridge.
- Meghalaya (Living Roots and Dawki): living root bridges, Mawlynnong, the glass-clear Umngot River.
- Spiti Valley: Kaza moonscapes, Hikkim, Tabo monastery, crescent-shaped Chandratal lake.
International (3):
- Faroe Islands: Mulafossur, turf-roofed cottages, sea cliffs near Kallur lighthouse.
- Hallstatt, Austria: ancient salt heritage, Dachstein 5-Fingers, glacier-fed Gosausee.
- Cappadocia, Turkey: Derinkuyu underground city, Rose Valley rock churches, sunrise balloons, cave suites.

SEARCH AND FILTERS
Users can search by text and filter by: Domestic, International, Beach, Hidden Gems, Hidden Spots, Honeymoon, Season and Budget.

PACKAGES
Each destination card opens a detail view with itinerary, stays, restaurants, routes and inclusions, then continues to booking.

CUSTOM TRIP AND PRICING
- Hotel tiers: 3-star Standard (core stay and route), 4-star Deluxe (upgraded stay and extras), 5-star Luxury (premium stay and concierge).
- Optional add-ons: insurance, airport cab, experiences. Coupons can reduce the price.
- Example breakdown shown in our guide: base package about Rs 58K, add-ons about Rs 7K, coupon about Rs 3K off. Insurance +Rs 2,500, airport cab +Rs 4,000, experience +Rs 3,500, coupon -Rs 3,000. These are examples; always say the final price is shown clearly before payment.

PAYMENT
UPI QR (scan to pay), credit/debit card, and netbanking. Payment is secure and encrypted.

E-TICKET / VOUCHER
After payment the user gets a printable A4-style digital voucher and invoice with a PNR, passenger list and a verification QR code.

WEB CHECK-IN
1. Enter your Booking ID / PNR.
2. Choose Window or Aisle seat.
3. Choose a meal: Vegetarian, Halal or Jain.
4. Tap Complete Check-in.

MORE SERVICES
Flights, hotels, airport cabs, dining, offers, and this 24/7 AI concierge.

PLATFORM FEATURES
- Theme colors: 12 palettes; click a color to change the website accent, and it is remembered.
- Presentation guide controls: arrow keys to move, Space for next, F for fullscreen.

AGENCY / ADMIN INFO (share only if the user is clearly an agency staff member or developer)
- Admin console: booking status changes, package price editing, inquiries (CRM leads), analytics.
- Real-time sync: booking changes appear on agency screens without refreshing.
- Tech stack: React 18 + TypeScript frontend, Node.js + Express backend, cloud storage with browser cache failover, SQL database, Gemini 2.5 AI via Google GenAI SDK.`;

      const client = getAIClient();
      if (client) {
        try {
          const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `${systemInstruction}\n\nUser: ${message}`,
          });

          const replyText = response.text?.trim();
          if (replyText) {
            res.json({ reply: replyText });
            return;
          }
        } catch (geminiError) {
          console.warn('Gemini API fallback:', geminiError);
        }
      }

      const lower = String(message).toLowerCase();
      let fallbackReply = '';
      if (lower.includes('mountain') || lower.includes('quiet') || lower.includes('hill') || lower.includes('trek')) {
        fallbackReply = `Great choice! Three hidden mountain destinations might suit you: Spiti Valley, Gurez Valley and Chopta-Tungnath.\n\n• Spiti Valley: Kaza moonscapes, Hikkim, Tabo monastery, and crescent-shaped Chandratal lake.\n• Gurez Valley, Kashmir: Razdan Pass, Habba Khatoon peak, Dard-Shina log cabins, and the turquoise Kishanganga River.\n• Chopta, Tungnath and Chandrashila: alpine landscapes, high Shiva temple, summit panorama, and Deoriatal.\n\nWould you like details on one of them, or should I filter by your budget or season?`;
      } else if (lower.includes('check-in') || lower.includes('check in') || lower.includes('seat') || lower.includes('meal')) {
        fallbackReply = `You can complete your online web check-in quickly before arrival. Here is how to do it:\n\n1. Enter your Booking ID / PNR.\n2. Choose a Window or Aisle seat.\n3. Choose a meal: Vegetarian, Halal or Jain.\n4. Tap Complete Check-in.\n\nWould you like help finding your Booking ID / PNR on your e-ticket?`;
      } else if (lower.includes('pay') || lower.includes('upi') || lower.includes('card') || lower.includes('price') || lower.includes('cost') || lower.includes('tier')) {
        fallbackReply = `Wanderlust Voyages shows a clear price breakdown before you pay using secure, encrypted UPI QR (scan to pay), credit/debit card, or netbanking.\n\n• Hotel Tiers: 3-star Standard (core stay & route), 4-star Deluxe (upgraded stay & extras), or 5-star Luxury (premium stay & concierge).\n• Example Breakdown: Base package ~₹58K, optional add-ons (insurance +₹2,500, airport cab +₹4,000, experience +₹3,500), and coupon (-₹3,000). Your final price is always shown clearly before payment.\n\nWould you like to customize a trip or see our hidden destinations?`;
      } else if (lower.includes('destination') || lower.includes('hidden') || lower.includes('gem') || lower.includes('where')) {
        fallbackReply = `We offer 9 curated hidden gem destinations—6 domestic and 3 international:\n\nDomestic (6):\n1. Ziro Valley, Arunachal Pradesh\n2. Gurez Valley, Kashmir\n3. Chopta, Tungnath & Chandrashila, Garhwal\n4. Dhanushkodi, Rameshwaram, Tamil Nadu\n5. Meghalaya (Living Roots & Dawki)\n6. Spiti Valley\n\nInternational (3):\n7. Faroe Islands\n8. Hallstatt, Austria\n9. Cappadocia, Turkey\n\nWould you like to explore a domestic or international destination first?`;
      } else if (lower.includes('admin') || lower.includes('agency') || lower.includes('tech') || lower.includes('stack') || lower.includes('developer')) {
        fallbackReply = `For agency staff and developers, Wanderlust Voyages includes an integrated Admin Console and real-time sync architecture:\n\n• Admin Console: booking status changes, package price editing, inquiries (CRM leads), and analytics.\n• Real-Time Sync: booking changes appear on agency screens without refreshing.\n• Tech Stack: React 18 + TypeScript frontend, Node.js + Express backend, cloud storage with browser cache failover, SQL database, and Gemini 2.5 AI via Google GenAI SDK.\n\nWould you like to open the Feature Guide presentation or test a booking flow?`;
      } else {
        fallbackReply = `Welcome to Wanderlust Voyages! We make travel simple in 6 connected steps:\n\n1. Discover: search & filter our 9 hidden destinations.\n2. Customize: choose guests, travel date, 3★/4★/5★ hotel tier, insurance, airport cab, and experiences.\n3. Price: see a clear price breakdown before paying.\n4. Pay: UPI QR, credit/debit card, or netbanking.\n5. Confirm: get your printable A4 e-ticket/voucher with a PNR.\n6. Travel: complete web check-in (seat & meal) before arrival.\n\nWould you like to see our hidden destinations?`;
      }
      res.json({ reply: fallbackReply });
    } catch (err: any) {
      res.status(500).json({
        error: 'Chat service error',
        reply: "I'm not sure about that. Please contact our support team.",
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
