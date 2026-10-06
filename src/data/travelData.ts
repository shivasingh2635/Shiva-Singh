import heroKashmir from './assets/images/hero_kashmir_dal_lake_1791214816138.jpg';
import pkgDubai from './assets/images/pkg_dubai_luxury_skyline_1791214833588.jpg';
import pkgSwiss from './assets/images/pkg_swiss_alps_scenic_1791214846108.jpg';
import pkgGoa from './assets/images/pkg_goa_coastal_boutique_1791214857475.jpg';
import pkgKerala from './assets/images/pkg_kerala_backwaters_tea_1791214869012.jpg';
import pkgSpiti from './assets/images/pkg_spiti_expedition_valley_1791214880391.jpg';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateFromINR: number;
  label: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', rateFromINR: 1, label: 'INR (₹)' },
  USD: { code: 'USD', symbol: '$', rateFromINR: 0.0119, label: 'USD ($)' },
  EUR: { code: 'EUR', symbol: '€', rateFromINR: 0.0109, label: 'EUR (€)' },
  AED: { code: 'AED', symbol: 'AED ', rateFromINR: 0.0437, label: 'AED' }
};

export function formatPrice(amountINR: number, currency: CurrencyCode): string {
  const cfg = CURRENCIES[currency] || CURRENCIES.INR;
  const converted = Math.round(amountINR * cfg.rateFromINR);
  if (currency === 'INR') {
    return `${cfg.symbol}${converted.toLocaleString('en-IN')}`;
  }
  return `${cfg.symbol}${converted.toLocaleString('en-US')}`;
}

export interface ItineraryDay {
  day: number;
  title: string;
  summary: string;
  meals: string;
  stay: string;
}

export interface TourPackage {
  id: string;
  title: string;
  destination: string;
  regionTag: string;
  duration: string;
  days: number;
  nights: number;
  basePrice: number;
  category: 'Domestic' | 'International' | 'Adventure';
  rating: number;
  reviewsCount: number;
  image: string;
  fallbackGradient: string;
  tagline: string;
  highlights: string[];
  inclusions: string[];
  itinerary: ItineraryDay[];
  bestSeason: string;
  altitudeOrClimate: string;
}

export const SEED_PACKAGES: TourPackage[] = [
  {
    id: 'kashmir-paradise',
    title: 'Kashmir Paradise: Valley of Romance & Snow',
    destination: 'Srinagar, Gulmarg & Pahalgam, India',
    regionTag: 'Kashmir',
    duration: '6D/5N',
    days: 6,
    nights: 5,
    basePrice: 24999,
    category: 'Domestic',
    rating: 4.9,
    reviewsCount: 342,
    image: heroKashmir,
    fallbackGradient: 'from-slate-800 via-teal-950 to-slate-900',
    tagline: 'Private Dal Lake heritage houseboat, Gulmarg Gondola Phase 1 & Betaab Valley.',
    highlights: [
      '1 Night on a hand-carved cedarwood Heritage Houseboat on Dal Lake',
      'Private Shikara sunset cruise with Kashmiri Kahwa & saffron almonds',
      'Gulmarg Gondola cable car ride to Kongdoori Mountain meadow',
      'Pahalgam Lidder River drive through Aru, Betaab & Chandanwari valleys'
    ],
    inclusions: ['Boutique Stays & Houseboat', 'Breakfast & Dinner', 'Private Heated SUV', 'Shikara Cruise', 'Airport Transfers'],
    bestSeason: 'March – November & Winter Snow',
    altitudeOrClimate: '1,585m – 2,650m · Crisp Alpine',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Srinagar & Sunset Shikara Ride',
        summary: 'Warm airport welcome and transfer to your luxury cedar houseboat on Dal Lake. Evening 90-minute private Shikara glide past floating gardens.',
        meals: 'Welcome Kahwa & Dinner',
        stay: 'Luxury Heritage Houseboat, Dal Lake'
      },
      {
        day: 2,
        title: 'Mughal Gardens & Artisanal Old Srinagar',
        summary: 'Guided walk through Nishat Bagh, Shalimar Bagh, and Chashme Shahi, followed by a visit to a 4th-generation Pashmina loom.',
        meals: 'Breakfast & Dinner',
        stay: 'Boutique Retreat, Srinagar'
      },
      {
        day: 3,
        title: 'Srinagar to Gulmarg Meadow of Flowers',
        summary: 'Ascend through Tangmarg pine forests to Gulmarg. Board the Asia-renowned Gondola to Phase 1 and enjoy snow or meadow trails.',
        meals: 'Breakfast & Dinner',
        stay: 'Alpine Highlands Resort, Gulmarg'
      },
      {
        day: 4,
        title: 'Gulmarg to Pahalgam via Pampore Saffron Fields',
        summary: 'Scenic drive along the Jhelum River stopping at Awantipora 9th-century ruins and Pampore saffron terraces before reaching Pahalgam.',
        meals: 'Breakfast & Dinner',
        stay: 'Riverside Pine Resort, Pahalgam'
      },
      {
        day: 5,
        title: 'Betaab Valley, Aru Village & Return to Srinagar',
        summary: 'Local union cab excursion to Aru and Betaab valleys framed by Himalayan glaciers, returning to Srinagar for a Wazwan farewell dinner.',
        meals: 'Breakfast & Wazwan Dinner',
        stay: 'Boutique Retreat, Srinagar'
      },
      {
        day: 6,
        title: 'Departure from Sheikh ul-Alam International Airport',
        summary: 'Morning leisure overlooking the Zabarwan Range before private chauffeur transfer to Srinagar Airport.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  },
  {
    id: 'dubai-luxury',
    title: 'Dubai Luxury & Desert Safari Marvels',
    destination: 'Downtown Dubai, Marina & Arabian Desert, UAE',
    regionTag: 'Dubai',
    duration: '5D/4N',
    days: 5,
    nights: 4,
    basePrice: 39999,
    category: 'International',
    rating: 4.8,
    reviewsCount: 289,
    image: pkgDubai,
    fallbackGradient: 'from-amber-950 via-slate-900 to-neutral-950',
    tagline: 'Burj Khalifa 124th Floor sunset access, private Marina yacht cruise & Red Dune safari.',
    highlights: [
      'At The Top Burj Khalifa Level 124 & 125 prime sunset slot tickets',
      'Dubai Marina luxury dhow & yacht dinner cruise with illuminated skyline views',
      'Lahbab Red Dunes 4x4 desert safari with private Bedouin majlis dining',
      'Museum of the Future photo stop, Palm Jumeirah & Miracle Garden entry'
    ],
    inclusions: ['4-Star Downtown Stay', 'Daily Breakfast & 2 Dinners', 'Burj Khalifa Tickets', '4x4 Desert Safari', 'Airport Chauffeur'],
    bestSeason: 'October – April',
    altitudeOrClimate: 'Coastal Oasis · Warm & Sunny',
    itinerary: [
      {
        day: 1,
        title: 'Touchdown in Dubai & Marina Illuminated Yacht Cruise',
        summary: 'VIP meet-and-greet at Dubai International Airport (DXB), hotel check-in, and an evening gourmet dinner cruise through Dubai Marina.',
        meals: 'Buffet Cruise Dinner',
        stay: 'Downtown / Business Bay 4-Star Hotel'
      },
      {
        day: 2,
        title: 'Modern Dubai Architectural Tour & Burj Khalifa Sunset',
        summary: 'Explore Jumeirah Mosque, Souk Madinat, Palm Jumeirah Pointe, Dubai Mall Aquarium facade, and ascend Burj Khalifa at golden hour.',
        meals: 'Breakfast',
        stay: 'Downtown / Business Bay 4-Star Hotel'
      },
      {
        day: 3,
        title: 'Lahbab Red Dunes 4x4 Safari & Bedouin Stargazing',
        summary: 'Afternoon Land Cruiser dune bashing across crimson sands, camel trek, sandboarding, Tanoura performance, and Arabic barbecue under the stars.',
        meals: 'Breakfast & Desert BBQ Dinner',
        stay: 'Downtown / Business Bay 4-Star Hotel'
      },
      {
        day: 4,
        title: 'Old Dubai Creek Abra Ride, Gold Souk & Future Museum',
        summary: 'Cross Dubai Creek on a traditional wooden Abra to the Spice and Gold Souks, followed by afternoon leisure or optional Abu Dhabi Grand Mosque tour.',
        meals: 'Breakfast',
        stay: 'Downtown / Business Bay 4-Star Hotel'
      },
      {
        day: 5,
        title: 'Last-Minute Duty Free Shopping & Departure',
        summary: 'Relaxed morning breakfast and private transfer to Dubai International Airport.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  },
  {
    id: 'swiss-alps-tour',
    title: 'Swiss Alps Grand Tour: Zurich & Lucerne',
    destination: 'Zurich, Lucerne, Interlaken & Jungfraujoch, Switzerland',
    regionTag: 'Switzerland',
    duration: '7D/6N',
    days: 7,
    nights: 6,
    basePrice: 89999,
    category: 'International',
    rating: 4.9,
    reviewsCount: 198,
    image: pkgSwiss,
    fallbackGradient: 'from-sky-950 via-slate-900 to-indigo-950',
    tagline: 'First-class Swiss Travel Pass, Jungfraujoch Top of Europe & Mt. Titlis Rotair.',
    highlights: [
      'Unlimited Swiss Travel Pass covering panoramic trains, lake steamers & trams',
      'Jungfraujoch — Top of Europe cogwheel excursion (3,454m) & Ice Palace',
      'Mt. Titlis 360° revolving Rotair cable car & Cliff Walk suspension bridge',
      'Lake Lucerne historic paddle steamer cruise & Rhine Falls boat tour'
    ],
    inclusions: ['Boutique Alpine Hotels', 'Daily Swiss Breakfast', 'Swiss Travel Pass', 'Jungfrau & Titlis Excursions', 'Visa Documentation Support'],
    bestSeason: 'Year-Round (May–Oct Greens / Nov–Apr Ski)',
    altitudeOrClimate: '408m – 3,454m · High Alpine',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Zurich & Lake Promenade Walk',
        summary: 'Arrive at Zurich Airport, activate your Swiss Travel Pass, and board a 12-minute direct train to Zurich HB. Stroll Bahnhofstrasse and Old Town.',
        meals: 'Breakfast',
        stay: 'Central Boutique Hotel, Zurich'
      },
      {
        day: 2,
        title: 'Zurich to Lucerne & Lake Lucerne Steamer Cruise',
        summary: 'Morning rail journey to Lucerne. Walk the 14th-century Chapel Bridge, Lion Monument, and embark on a 1-hour panoramic yacht/steamer cruise.',
        meals: 'Breakfast',
        stay: 'Heritage Lakeview Hotel, Lucerne'
      },
      {
        day: 3,
        title: 'Mount Titlis Eternal Glacier & Engelberg Valley',
        summary: 'Ascend to 3,020m aboard the Titlis Rotair revolving cable car. Walk Europe’s highest suspension bridge and explore the illuminated glacier cave.',
        meals: 'Breakfast',
        stay: 'Heritage Lakeview Hotel, Lucerne'
      },
      {
        day: 4,
        title: 'GoldenPass Panoramic Express from Lucerne to Interlaken',
        summary: 'Board the floor-to-ceiling glass Luzern-Interlaken Express winding past five crystal-clear alpine lakes and Brünig Pass.',
        meals: 'Breakfast',
        stay: 'Alpine Chalet Hotel, Interlaken'
      },
      {
        day: 5,
        title: 'Jungfraujoch — Top of Europe & Lauterbrunnen 72 Waterfalls',
        summary: 'Ride the Eiger Express tricable gondola and historic cogwheel train to Jungfraujoch at 3,454m overlooking the Aletsch Glacier.',
        meals: 'Breakfast',
        stay: 'Alpine Chalet Hotel, Interlaken'
      },
      {
        day: 6,
        title: 'Grindelwald First, Rhine Falls & Return to Zurich',
        summary: 'Morning visit to Grindelwald village before returning north to Schaffhausen to witness the thundering Rhine Falls.',
        meals: 'Breakfast',
        stay: 'Central Boutique Hotel, Zurich'
      },
      {
        day: 7,
        title: 'Lindt Home of Chocolate & Zurich Departure',
        summary: 'Morning visit to Kilchberg lakeside chocolaterie before boarding your train to Zurich Airport.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  },
  {
    id: 'goa-beach-delight',
    title: 'Goa Coastal & Heritage Boutique Stay',
    destination: 'Fontainhas, Candolim & South Goa Cavelossim, India',
    regionTag: 'Goa',
    duration: '4D/3N',
    days: 4,
    nights: 3,
    basePrice: 14999,
    category: 'Domestic',
    rating: 4.7,
    reviewsCount: 415,
    image: pkgGoa,
    fallbackGradient: 'from-orange-950 via-amber-900 to-slate-900',
    tagline: 'Indo-Portuguese heritage villa stay, Mandovi sunset yacht & spice plantation lunch.',
    highlights: [
      'Stay in a restored Indo-Portuguese boutique property near tranquil beaches',
      'Guided Latin Quarter walk through Fontainhas with traditional bakery tasting',
      'Private Mandovi River sunset cruise & Old Goa UNESCO basilicas',
      'Sahakari Spice Plantation guided walk with authentic Goan Saraswat lunch'
    ],
    inclusions: ['Heritage Villa Stay', 'Daily Breakfast & 1 Goan Lunch', 'AC Chauffeur Sedan/SUV', 'Fontainhas Walk', 'Mopa / Dabolim Transfers'],
    bestSeason: 'October – April & Monsoon Lush',
    altitudeOrClimate: 'Sea Level · Tropical Coastal Breeze',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Goa & Sundowner by the Arabian Sea',
        summary: 'Private pickup from Mopa (GOX) or Dabolim (GOI) airport. Check into your Portuguese-inspired boutique resort and unwind at the beach shack.',
        meals: 'Welcome Drink',
        stay: 'Coastal Boutique Villa, Goa'
      },
      {
        day: 2,
        title: 'Fontainhas Latin Quarter, Old Goa & Mandovi Sunset Cruise',
        summary: 'Explore pastel-painted Portuguese lanes in Panjim, Basilica of Bom Jesus, and sail into the Arabian Sea mouth at sunset.',
        meals: 'Breakfast',
        stay: 'Coastal Boutique Villa, Goa'
      },
      {
        day: 3,
        title: 'Tropical Spice Plantation & South Goa Pristine Coves',
        summary: 'Tour aromatic cardamom and vanilla groves in Ponda with a traditional clay-pot lunch, followed by Palolem and Cabo de Rama cliff sunset.',
        meals: 'Breakfast & Traditional Spice Lunch',
        stay: 'Coastal Boutique Villa, Goa'
      },
      {
        day: 4,
        title: 'Artisanal Azulejos Tile Souvenir Stop & Departure',
        summary: 'Leisurely coastal breakfast before private airport drop-off.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  },
  {
    id: 'kerala-backwaters',
    title: 'Kerala Backwaters & Munnar Tea Estates',
    destination: 'Munnar, Thekkady & Alleppey Backwaters, India',
    regionTag: 'Kerala',
    duration: '6D/5N',
    days: 6,
    nights: 5,
    basePrice: 21999,
    category: 'Domestic',
    rating: 4.9,
    reviewsCount: 376,
    image: pkgKerala,
    fallbackGradient: 'from-emerald-950 via-teal-900 to-slate-900',
    tagline: 'Misty Munnar tea bungalows, Periyar wildlife boat safari & private Alleppey Kettuvallam.',
    highlights: [
      'Private air-conditioned luxury Kettuvallam houseboat in Alleppey with personal chef',
      'Eravikulam National Park & Kolukkumalai sunrise tea estate trail in Munnar',
      'Periyar Lake bamboo wildlife safari & Kathakali classical dance evening',
      'Complimentary 60-minute authentic Ayurvedic Abhyanga rejuvenation therapy'
    ],
    inclusions: ['Tea Resort & Private Houseboat', 'All Meals on Houseboat + Breakfast', 'Private Chauffeur Vehicle', 'Kathakali Show', 'Cochin Transfers'],
    bestSeason: 'September – May',
    altitudeOrClimate: 'Sea Level – 1,600m · Misty Hills & Palms',
    itinerary: [
      {
        day: 1,
        title: 'Cochin Arrival & Scenic Ascent to Munnar Tea Hills',
        summary: 'Pickup at Cochin Airport (COK). Drive past Cheeyappara and Valara waterfalls into the rolling emerald tea carpets of Munnar.',
        meals: 'Breakfast',
        stay: 'Misty Valley Tea Resort, Munnar'
      },
      {
        day: 2,
        title: 'Eravikulam Park, Mattupetty Dam & Tea Museum Tasting',
        summary: 'Spot the Nilgiri Tahr in Eravikulam, visit the century-old Tata Tea Museum for orthodox tea tasting, and echo point lakeside walk.',
        meals: 'Breakfast',
        stay: 'Misty Valley Tea Resort, Munnar'
      },
      {
        day: 3,
        title: 'Munnar to Thekkady Cardamom Hills & Kathakali Performance',
        summary: 'Descend through spice-scented hills to Periyar. Afternoon Lake Periyar boat cruise and evening Kalaripayattu & Kathakali theatre.',
        meals: 'Breakfast',
        stay: 'Spice Forest Retreat, Thekkady'
      },
      {
        day: 4,
        title: 'Board Private Kettuvallam Houseboat in Alleppey',
        summary: 'Drive to Alleppey jetty and board your private thatched houseboat. Cruise narrow canals, paddy fields below sea level, and Vembanad Lake.',
        meals: 'Breakfast, Pearl Spot Fish Lunch & Dinner',
        stay: 'Private Luxury Houseboat, Alleppey'
      },
      {
        day: 5,
        title: 'Alleppey to Fort Kochi Chinese Fishing Nets & Jew Town',
        summary: 'Disembark after breakfast and head to historic Fort Kochi. Visit St. Francis Church, Mattancherry Palace, and Paradesi Synagogue.',
        meals: 'Breakfast',
        stay: 'Heritage Harbour Hotel, Fort Kochi'
      },
      {
        day: 6,
        title: 'Departure from Cochin International Airport',
        summary: 'Morning coffee overlooking the Arabian Sea before airport transfer.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  },
  {
    id: 'spiti-expedition',
    title: 'Spiti Valley High-Altitude 4x4 Expedition',
    destination: 'Shimla, Kalpa, Tabo, Kaza & Chandratal Lake, Himachal',
    regionTag: 'Himachal',
    duration: '8D/7N',
    days: 8,
    nights: 7,
    basePrice: 28499,
    category: 'Adventure',
    rating: 4.9,
    reviewsCount: 224,
    image: pkgSpiti,
    fallbackGradient: 'from-slate-900 via-sky-950 to-zinc-900',
    tagline: 'Trans-Himalayan 4x4 circuit across Key Monastery, Hikkim highest post office & Chandratal.',
    highlights: [
      'Expedition-grade 4x4 / Toyota Innova Crysta with experienced Himalayan terrain pilot',
      'Send a postcard from Hikkim (4,400m) — the world’s highest post office',
      '1,000-year-old Tabo mud monastery, Key Monastery & Chicham Bridge',
      'Stargazing camp near crescent-shaped Chandratal glacial lake (4,300m)'
    ],
    inclusions: ['Boutique Homestays & Glamping', 'Breakfast & Dinner Daily', '4x4 SUV & Oxygen Cylinder Backup', 'Inner Line Permits', 'Expedition Captain'],
    bestSeason: 'May – October (Full Circuit)',
    altitudeOrClimate: '2,200m – 4,590m · High Desert Cold',
    itinerary: [
      {
        day: 1,
        title: 'Shimla to Sangla / Chitkul — Last Village of India',
        summary: 'Drive along the Hindustan-Tibet Highway beside the Sutlej and Baspa rivers to Chitkul overlooking Kinnaur Kailash.',
        meals: 'Dinner',
        stay: 'Riverview Wooden Chalet, Sangla/Chitkul'
      },
      {
        day: 2,
        title: 'Chitkul to Kalpa — Golden Sunrise on Kinner Kailash',
        summary: 'Morning walk by the Baspa river, then ascend to Kalpa village at 2,960m facing the 6,050m sacred Kinner Kailash massif.',
        meals: 'Breakfast & Dinner',
        stay: 'Himalayan Crest Resort, Kalpa'
      },
      {
        day: 3,
        title: 'Kalpa to Tabo via Khab Confluence & Nako Lake',
        summary: 'Witness the confluence of Spiti and Sutlej rivers at Khab, visit Nako high-altitude lake, and reach 996 AD Tabo Monastery.',
        meals: 'Breakfast & Dinner',
        stay: 'Boutique Mud Homestay, Tabo'
      },
      {
        day: 4,
        title: 'Tabo to Kaza via Dhankar Cliff Monastery & Pin Valley',
        summary: 'Hike or drive to the dramatic 1,200-year-old Dhankar Gompa perched above the Spiti-Pin river confluence before arriving in Kaza.',
        meals: 'Breakfast & Dinner',
        stay: 'Spiti Sarai Boutique Stay, Kaza'
      },
      {
        day: 5,
        title: 'Key Monastery, Kibber, Chicham Bridge & Langza',
        summary: 'Explore iconic Key Monastery, cross Asia’s highest suspension bridge at Chicham, hunt for marine fossils in Langza, and post letters from Hikkim.',
        meals: 'Breakfast & Dinner',
        stay: 'Spiti Sarai Boutique Stay, Kaza'
      },
      {
        day: 6,
        title: 'Kaza to Chandratal Moon Lake via Kunzum La Pass (4,590m)',
        summary: 'Cross snow-draped Kunzum Pass to reach the turquoise crescent of Chandratal Lake. Settle into heated Swiss alpine tents.',
        meals: 'Breakfast & Camp Dinner',
        stay: 'Deluxe Alpine Camp, Chandratal'
      },
      {
        day: 7,
        title: 'Chandratal to Manali via Atal Tunnel',
        summary: 'Navigate Batal and Gramphu terrain before emerging into the lush Solang Valley via the 9.02km Atal Tunnel.',
        meals: 'Breakfast & Farewell Dinner',
        stay: 'Orchard Spa Resort, Manali'
      },
      {
        day: 8,
        title: 'Manali Cafe Hopping & Departure',
        summary: 'Explore Old Manali cedar cafes and Hadimba Temple before departure transfer.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  }
];

export interface VisaRequirement {
  id: string;
  country: string;
  region: string;
  visaType: string;
  processingTime: string;
  validity: string;
  feeINR: number;
  documents: string[];
  notes: string;
}

export const VISA_GUIDE_DATA: VisaRequirement[] = [
  {
    id: 'visa-uae',
    country: 'United Arab Emirates (Dubai / Abu Dhabi)',
    region: 'Middle East',
    visaType: '30-Day Tourist e-Visa / Visa on Arrival (Eligible US/UK/Schengen Holders)',
    processingTime: '24 – 48 Hours Express',
    validity: '60 Days from issue · 30 Days stay',
    feeINR: 6800,
    documents: [
      'Passport front & last page scan (minimum 6 months validity)',
      'Recent studio passport-size photograph with white background',
      'Confirmed return flight ticket & hotel voucher (included in Wanderlust package)'
    ],
    notes: 'Indian passport holders with valid US, UK, or Schengen visa/residency qualify for instant 14-day Visa on Arrival at DXB.'
  },
  {
    id: 'visa-swiss',
    country: 'Switzerland (Schengen Area)',
    region: 'Europe',
    visaType: 'Short-Stay Schengen Type C Tourist Visa',
    processingTime: '10 – 15 Working Days',
    validity: 'Up to 90 Days within 180-Day period',
    feeINR: 8400,
    documents: [
      'Original Passport with at least 2 blank pages & 6 months validity',
      'VFS Biometric appointment confirmation & Schengen application form',
      'Last 3 months bank statement, ITR & travel medical insurance (€30,000 coverage)',
      'Day-by-day Swiss Travel Pass & hotel confirmation issued by Wanderlust'
    ],
    notes: 'Our Visa Concierge team schedules priority VFS appointments in Bengaluru, Mumbai, Delhi, Chennai, and Hyderabad.'
  },
  {
    id: 'visa-spiti-ilp',
    country: 'Inner Line Permit — Himachal & Kashmir Border Zones',
    region: 'Domestic High-Altitude',
    visaType: 'Domestic Protected Area / Inner Line Pass (Sumdo – Khab Stretch)',
    processingTime: 'Instant On-Spot via Expedition Captain',
    validity: 'Duration of Expedition',
    feeINR: 400,
    documents: [
      'Aadhaar Card, Voter ID, or Passport original + 2 photocopies',
      '2 Passport-size photographs for Reckong Peo SDM checkpoint'
    ],
    notes: 'Included automatically at zero extra hassle for all guests booked on our Spiti Valley 4x4 Expedition.'
  },
  {
    id: 'visa-singapore',
    country: 'Singapore & Southeast Asia',
    region: 'Asia Pacific',
    visaType: 'Multiple-Entry Electronic Visa (e-Visa)',
    processingTime: '3 – 4 Working Days',
    validity: 'Up to 2 Years (30 days per entry)',
    feeINR: 3200,
    documents: [
      'Completed Form 14A signed by applicant',
      'Matte-finish white background photo (35mm x 45mm)',
      'Confirmed itinerary and hotel vouchers'
    ],
    notes: 'SG Arrival Card (SGAC) must be submitted online within 3 days prior to arrival.'
  }
];

export interface AddOnOption {
  id: string;
  label: string;
  description: string;
  priceINR: number;
}

export const BOOKING_ADDONS: AddOnOption[] = [
  {
    id: 'travel_insurance',
    label: 'Comprehensive Travel & Medical Protection',
    description: 'Zero-deductible coverage for trip delays, baggage, and emergency medical evacuation.',
    priceINR: 1200
  },
  {
    id: 'airport_lounge',
    label: 'VIP Departure Airport Lounge Access',
    description: 'Complimentary gourmet buffet, shower suites, and priority terminal assistance.',
    priceINR: 1800
  },
  {
    id: 'private_photoshoot',
    label: '2-Hour Candid Vacation Photographer',
    description: 'Local portrait photographer at one landmark destination with 40 edited high-res photos.',
    priceINR: 3500
  }
];

export const HOTEL_TIERS = [
  { id: 'standard', label: 'Boutique 3-Star', multiplier: 1.0, note: 'Handpicked clean & central stays' },
  { id: 'deluxe', label: 'Deluxe 4-Star', multiplier: 1.18, note: 'Upgraded view rooms & lounge perks' },
  { id: 'luxury', label: 'Signature 5-Star', multiplier: 1.42, note: 'Palace hotels, suites & butler service' }
] as const;

export const TRANSPORT_TYPES = [
  { id: 'shared_coach', label: 'Luxury Volvo / Tempo', additionalINR: 0 },
  { id: 'private_sedan', label: 'Private Chauffeur Sedan', additionalINR: 3500 },
  { id: 'private_suv', label: 'Private Toyota Innova Crysta / SUV', additionalINR: 6800 }
] as const;

export interface BookingRecord {
  id: string;
  packageId: string;
  packageTitle: string;
  destination: string;
  customerName: string;
  email: string;
  phone: string;
  adultsCount: number;
  childrenCount: number;
  departureDate: string;
  hotelTier: string;
  transportType: string;
  addOns: string[];
  couponCode: string;
  discountINR: number;
  totalAmountINR: number;
  advancePaidINR?: number;
  selectedCurrency: CurrencyCode;
  status: 'Confirmed' | 'Pending Verification' | 'Cancelled';
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Advance20';
  paymentStatus: 'Paid' | '20% Advance Paid' | 'Pending';
  transactionRef: string;
  upiNumber: string;
  createdAt: string;
  notes?: string;
  deviceRole?: string;
}

export interface InquiryRecord {
  id: string | number;
  customerName: string;
  phone: string;
  email: string;
  destination: string;
  travelers?: number;
  message: string;
  status?: 'Pending' | 'Replied';
  adminReply?: string;
  createdAt: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  loyaltyTier: string;
  loyaltyPoints: number;
}
