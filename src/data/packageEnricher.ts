import { TourPackage, WeatherSeasonInfo, TransportRouteInfo } from '../types';
import heroKashmir from '../assets/images/hero_kashmir_dal_lake_1791214816138.jpg';
import pkgDubai from '../assets/images/pkg_dubai_luxury_skyline_1791214833588.jpg';
import pkgSwiss from '../assets/images/pkg_swiss_alps_scenic_1791214846108.jpg';
import pkgGoa from '../assets/images/pkg_goa_coastal_boutique_1791214857475.jpg';
import pkgKerala from '../assets/images/pkg_kerala_backwaters_tea_1791214869012.jpg';
import pkgSpiti from '../assets/images/pkg_spiti_expedition_valley_1791214880391.jpg';

export const PACKAGE_WEATHER_MAP: Record<string, WeatherSeasonInfo> = {
  'pkg-kashmir-paradise': {
    season: 'winter',
    tempCelsius: 4,
    condition: 'Snowfall & Crisp Alpine',
    bestMonths: 'Nov - Apr',
    badgeEmoji: '❄️',
  },
  'pkg-rajasthan-royal-heritage': {
    season: 'winter',
    tempCelsius: 21,
    condition: 'Pleasant & Royal Sun',
    bestMonths: 'Oct - Mar',
    badgeEmoji: '☀️',
  },
  'pkg-kerala-backwaters-munnar': {
    season: 'monsoon',
    tempCelsius: 23,
    condition: 'Misty Rain & Lush Greens',
    bestMonths: 'Jun - Jan',
    badgeEmoji: '🌿',
  },
  'pkg-himachal-snow-manali-shimla': {
    season: 'winter',
    tempCelsius: -2,
    condition: 'Frosty & Snow Covered',
    bestMonths: 'Dec - Mar',
    badgeEmoji: '🏔️',
  },
  'pkg-goa-sun-sand-luxury': {
    season: 'summer',
    tempCelsius: 29,
    condition: 'Tropical Sunshine & Breeze',
    bestMonths: 'Oct - May',
    badgeEmoji: '🏖️',
  },
  'pkg-spiti-valley-odyssey': {
    season: 'summer',
    tempCelsius: 15,
    condition: 'Crisp High-Altitude Clear',
    bestMonths: 'Jun - Sep',
    badgeEmoji: '⛰️',
  },
  'pkg-meghalaya-living-roots': {
    season: 'monsoon',
    tempCelsius: 19,
    condition: 'Mystic Clouds & Waterfalls',
    bestMonths: 'Jul - Nov',
    badgeEmoji: '🌧️',
  },
  'pkg-switzerland-alps-lakes': {
    season: 'spring',
    tempCelsius: 14,
    condition: 'Alpine Bloom & Fresh Breeze',
    bestMonths: 'May - Oct',
    badgeEmoji: '🏔️',
  },
  'pkg-dubai-luxury-desert-safari': {
    season: 'winter',
    tempCelsius: 24,
    condition: 'Mild Golden Sunshine',
    bestMonths: 'Nov - Mar',
    badgeEmoji: '🏜️',
  },
  'pkg-bali-tropical-honeymoon': {
    season: 'summer',
    tempCelsius: 28,
    condition: 'Warm Tropical Ocean Vibe',
    bestMonths: 'Apr - Oct',
    badgeEmoji: '🌺',
  },
  'pkg-japan-cherry-blossom': {
    season: 'spring',
    tempCelsius: 17,
    condition: 'Sakura Blossom Breeze',
    bestMonths: 'Mar - May',
    badgeEmoji: '🌸',
  },
  'pkg-thailand-explorer-islands': {
    season: 'summer',
    tempCelsius: 30,
    condition: 'Sunny Island Turquoise',
    bestMonths: 'Nov - Apr',
    badgeEmoji: '🏝️',
  },
};

export const PACKAGE_TRANSPORT_MAP: Record<string, TransportRouteInfo> = {
  'pkg-kashmir-paradise': {
    departureCity: 'New Delhi (DEL)',
    arrivalCity: 'Srinagar (SXR)',
    flight: {
      airline: 'Air India / IndiGo',
      flightNo: 'AI-825 / 6E-2124',
      duration: '1h 35m',
      transitType: 'Non-stop',
      altitudeKm: 9.8,
    },
    train: {
      trainName: 'Vande Bharat Express (Delhi to Katra)',
      trainNo: '22439',
      duration: '8h 00m',
      classType: 'Executive Chair Car',
      scenicHighlight: 'Traversing the Chenab Rail Bridge, highest arch bridge in the world',
    },
    bus: {
      coachType: 'Volvo 9600 Multi-Axle Sleeper',
      operator: 'JKSRTC Royal Express',
      duration: '14h 30m',
      routeVia: 'NH-44 Himalayan Mountain Pass & Jawahar Tunnel',
    },
    hotels: [
      {
        name: 'The Lalit Grand Palace Srinagar',
        tier: 'luxury',
        stars: 5,
        location: 'Gupkar Road, Dal Lake, Srinagar',
        rating: 4.9,
        highlights: ['Royal heritage palace overlooking Dal Lake', 'Heated indoor pool & Chinar gardens', 'Authentic Wazwan dining'],
        image: heroKashmir,
      },
      {
        name: 'The Khyber Himalayan Resort & Spa',
        tier: 'luxury',
        stars: 5,
        location: 'Gulmarg Pine Ridges',
        rating: 4.95,
        highlights: ['Ski-in, ski-out resort next to Gondola Phase 1', 'Panoramic glass-walled heated plunge pool', 'Himalayan pine views'],
        image: pkgSpiti,
      },
    ],
    restaurants: [
      {
        name: 'Ahdoos Heritage Restaurant',
        cuisine: 'Authentic Royal Kashmiri Wazwan',
        rating: 4.8,
        specialty: 'Rista, Rogan Josh, Gushtaba & Kashmiri Kahwa',
        specialtyDish: 'Rista, Rogan Josh, Gushtaba & Kashmiri Kahwa',
        costForTwoINR: 1800,
        priceLevel: '₹₹',
        location: 'Residency Road, Srinagar',
        image: heroKashmir,
      },
      {
        name: '1440 Highland Lounge',
        cuisine: 'Continental & Barbecue',
        rating: 4.7,
        specialty: 'Woodfired Trout fish & Hot Saffron Walnut Cake',
        specialtyDish: 'Woodfired Trout fish & Hot Saffron Walnut Cake',
        costForTwoINR: 2200,
        priceLevel: '₹₹₹',
        location: 'Gulmarg High Meadow',
        image: pkgSwiss,
      },
    ],
  },
  'pkg-goa-sun-sand-luxury': {
    departureCity: 'Mumbai / Bangalore (BOM/BLR)',
    arrivalCity: 'Goa Mopa / Dabolim (GOX/GOI)',
    flight: {
      airline: 'Akasa Air / IndiGo',
      flightNo: 'QP-1358 / 6E-6032',
      duration: '1h 15m',
      transitType: 'Non-stop',
      altitudeKm: 8.5,
    },
    train: {
      trainName: 'Tejas Superfast Express (CSMT - Madgaon)',
      trainNo: '22119',
      duration: '8h 30m',
      classType: 'First AC & Executive Chair',
      scenicHighlight: 'Passing over 2,000 scenic Konkan Railway waterfalls & tunnels',
    },
    bus: {
      coachType: 'Mercedes-Benz Multiaxle Sleeper',
      operator: 'Paulo Travels Executive Club',
      duration: '11h 00m',
      routeVia: 'Western Ghats Amboli Ghat Vista',
    },
    hotels: [
      {
        name: 'Taj Exotica Resort & Spa, Goa',
        tier: 'luxury',
        stars: 5,
        location: 'Benaulim Beach, South Goa',
        rating: 4.9,
        highlights: ['56 acres of Mediterranean landscaped gardens', 'Private beach access & 9-hole golf course', 'Jiva Spa holistic wellness'],
        image: pkgGoa,
      },
    ],
    restaurants: [
      {
        name: 'Fishermans Wharf',
        cuisine: 'Goan Coastal & Seafood Catch',
        rating: 4.9,
        specialty: 'Butter Garlic Crab, Kingfish Recheado & Bebinca',
        specialtyDish: 'Butter Garlic Crab, Kingfish Recheado & Bebinca',
        costForTwoINR: 2400,
        priceLevel: '₹₹₹',
        location: 'Cavelossim Riverside, Sal River',
        image: pkgGoa,
      },
    ],
  },
  'pkg-dubai-luxury-desert-safari': {
    departureCity: 'Mumbai / Delhi / Bangalore',
    arrivalCity: 'Dubai International Airport (DXB)',
    flight: {
      airline: 'Emirates / FlyDubai',
      flightNo: 'EK-501 / FZ-432',
      duration: '3h 40m',
      transitType: 'Non-stop',
      altitudeKm: 11.2,
    },
    train: {
      trainName: 'Dubai Metro Red Line Hyper-Express',
      trainNo: 'Line 1',
      duration: '0h 25m',
      classType: 'Gold Class Front Car',
      scenicHighlight: 'Elevated panoramic views over Sheikh Zayed Road skyscrapers',
    },
    bus: {
      coachType: 'VIP Tourist Chauffeur Coach',
      operator: 'Arabian Adventures Luxury Fleet',
      duration: '1h 30m',
      routeVia: 'Dubai Marina & Sheikh Zayed Boulevard',
    },
    hotels: [
      {
        name: 'Atlantis The Royal, Palm Jumeirah',
        tier: 'luxury',
        stars: 5,
        location: 'Crescent Road, Palm Jumeirah, Dubai',
        rating: 4.98,
        highlights: ['Cloud 22 rooftop sky pool 90 meters high', '17 celebrity chef restaurants', 'Complimentary Aquaventure Waterpark access'],
        image: pkgDubai,
      },
    ],
    restaurants: [
      {
        name: 'Ce La Vi Dubai',
        cuisine: 'Contemporary Asian Fine Dining',
        rating: 4.9,
        specialty: 'Wagyu Beef Striploin, Truffle Rice & Sky-High Cocktails',
        specialtyDish: 'Wagyu Beef Striploin, Truffle Rice & Sky-High Cocktails',
        costForTwoINR: 12500,
        priceLevel: '₹₹₹₹',
        location: 'Level 54, Address Sky View, Downtown Dubai',
        image: pkgDubai,
      },
    ],
  },
};

export function enrichTourPackage(pkg: TourPackage): TourPackage {
  const weather = PACKAGE_WEATHER_MAP[pkg.id] || {
    season: (pkg.season || 'summer') as any,
    tempCelsius: pkg.region === 'domestic' ? 24 : 20,
    condition: 'Pleasant & Picturesque',
    bestMonths: 'Year Round',
    badgeEmoji: '☀️',
  };

  const transport = PACKAGE_TRANSPORT_MAP[pkg.id] || {
    departureCity: 'Delhi / Mumbai (Hub)',
    arrivalCity: `${pkg.destination}`,
    flight: {
      airline: 'Premium Partner Airlines',
      flightNo: 'WL-702',
      duration: '2h 10m',
      transitType: 'Non-stop',
      altitudeKm: 9.5,
    },
    train: {
      trainName: 'Express Scenic Rail',
      trainNo: 'EXP-104',
      duration: '5h 30m',
      classType: 'Executive AC Coach',
      scenicHighlight: 'Passing river valleys and mountain lookouts',
    },
    bus: {
      coachType: 'Volvo AC Luxury Coach',
      operator: 'Wanderlust Chauffeur Fleet',
      duration: '4h 00m',
      routeVia: 'Expressway & Scenic Vista Byways',
    },
    hotels: [
      {
        name: `Grand Heritage Resort ${pkg.stateOrCity || pkg.destination}`,
        tier: 'luxury',
        stars: 5,
        location: `${pkg.destination} Scenic Point`,
        rating: 4.9,
        highlights: ['Panoramic suites with balcony', 'Infinity swimming pool', 'Full-service wellness spa'],
        image: pkg.gallery?.[0] || pkg.heroImage || pkgKerala,
      },
      {
        name: `The Royal Orchid Stay ${pkg.destination}`,
        tier: 'deluxe',
        stars: 4,
        location: `Central ${pkg.destination}`,
        rating: 4.8,
        highlights: ['Complimentary buffet breakfast', 'Chauffeur desk', 'Fitness centre'],
        image: pkg.gallery?.[1] || pkg.heroImage || pkgSwiss,
      },
    ],
    restaurants: [
      {
        name: `The Terrace Gourmet Bistro ${pkg.destination}`,
        cuisine: 'Multi-Cuisine & Regional Specialties',
        rating: 4.8,
        specialty: 'Chef Signature Tasting Platter & Refreshing Mocktails',
        specialtyDish: 'Chef Signature Tasting Platter & Refreshing Mocktails',
        costForTwoINR: 1500,
        priceLevel: '₹₹',
        location: `Central ${pkg.destination}`,
        image: pkg.heroImage,
      },
      {
        name: `Old Town Spice Kitchen`,
        cuisine: 'Authentic Local Flavors',
        rating: 4.75,
        specialty: 'Clay-oven slow cooked regional curries and artisan breads',
        specialtyDish: 'Clay-oven slow cooked regional curries and artisan breads',
        costForTwoINR: 1100,
        priceLevel: '₹₹',
        location: `Downtown ${pkg.destination}`,
        image: pkg.heroImage,
      },
    ],
  };

  return {
    ...pkg,
    season: weather.season,
    weather,
    weatherSeason: weather,
    transportRoute: transport,
  };
}
