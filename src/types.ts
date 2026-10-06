export type RegionType = 'all' | 'domestic' | 'international';

export type TravelTheme =
  | 'All'
  | 'Beach'
  | 'Hidden Gem'
  | 'Nature'
  | 'City'
  | 'Hidden'
  | 'Honeymoon'
  | 'Family'
  | 'Adventure'
  | 'Luxury'
  | 'Heritage';

export type SeasonType = 'all' | 'summer' | 'monsoon' | 'winter' | 'spring' | 'autumn';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export type ServiceVertical = 'holidays' | 'flights' | 'hotels' | 'cabs' | 'dining' | 'visa' | 'offers';

export interface WeatherSeasonInfo {
  season: 'summer' | 'monsoon' | 'winter' | 'spring' | 'autumn';
  tempCelsius: number;
  condition: string;
  bestMonths: string;
  badgeEmoji: string;
}

export interface CuratedHotel {
  name: string;
  tier: 'standard' | 'deluxe' | 'luxury';
  stars: number;
  location: string;
  rating: number;
  highlights: string[];
  image: string;
}

export interface CuratedRestaurant {
  name: string;
  cuisine: string;
  rating: number;
  specialty?: string;
  specialtyDish?: string;
  costForTwoINR?: number;
  priceLevel?: string;
  location: string;
  image?: string;
}

export interface TransportRouteInfo {
  departureCity: string;
  arrivalCity: string;
  flight?: {
    airline: string;
    flightNo: string;
    duration: string;
    transitType: string;
    altitudeKm: number;
  };
  train?: {
    trainName: string;
    trainNo: string;
    duration: string;
    classType: string;
    scenicHighlight: string;
  };
  bus?: {
    coachType: string;
    operator: string;
    duration: string;
    routeVia: string;
  };
  hotels: CuratedHotel[];
  restaurants: CuratedRestaurant[];
}

export interface DayItinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  mealsIncluded: string;
  stayLocation: string;
}

export interface TourPackage {
  id: string;
  title: string;
  subtitle: string;
  region: 'domestic' | 'international';
  destination: string;
  country: string;
  stateOrCity: string;
  durationDays: number;
  durationNights: number;
  basePriceINR: number;
  originalPriceINR?: number;
  rating: number;
  reviewsCount: number;
  theme: TravelTheme;
  season?: 'summer' | 'monsoon' | 'winter' | 'spring' | 'autumn';
  weather?: WeatherSeasonInfo;
  weatherSeason?: WeatherSeasonInfo;
  transportRoute?: TransportRouteInfo;
  heroImage: string;
  gallery: string[];
  galleryImages?: string[];
  overview: string;
  highlights: string[];
  itinerary: DayItinerary[];
  inclusions: string[];
  exclusions: string[];
  flightIncluded: boolean;
  visaAssistance: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  seatsLeft?: number;
  featuredOrder?: number;
}

export interface BookingAddOn {
  id: string;
  name: string;
  priceINR: number;
  description: string;
  iconName: string;
}

export type PaymentMethod = 'UPI' | 'Card' | 'NetBanking' | 'PartialAdvance';

export interface FlightBookingDetails {
  pnr: string;
  airline: string;
  flightNumber: string;
  fromAirport: string;
  toAirport: string;
  departureTime: string;
  arrivalTime: string;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  seatNumber?: string;
  cabinBaggage: string;
  checkInBaggage: string;
  isRoundTrip?: boolean;
  returnDate?: string;
  passengers: Array<{
    name: string;
    gender: string;
    ageGroup: 'Adult' | 'Child' | 'Infant';
    passportNumber?: string;
  }>;
}

export interface HotelBookingDetails {
  hotelName: string;
  city: string;
  checkInDate: string;
  checkOutDate: string;
  nightsCount: number;
  roomsCount: number;
  roomType: string;
  mealPlan: string;
  starRating: number;
  guestNames: string;
  specialRequests?: string;
}

export interface CabBookingDetails {
  tripType: 'pickup' | 'drop' | 'outstation';
  vehicleType: string;
  vehicleModel: string;
  pickupLocation: string;
  dropLocation: string;
  pickupDateTime: string;
  flightNumber?: string;
  placardName?: string;
  passengerCount: number;
  luggageCount: number;
}

export interface BundledFlightDetails {
  included: boolean;
  departureCity: string;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business';
  airlinePreference: string;
  perTravelerCostINR: number;
  totalFlightCostINR: number;
}

export interface BundledCabDetails {
  included: boolean;
  vehicleType: 'Executive Sedan' | 'Prime SUV' | 'Luxury VIP';
  vehicleModel: string;
  airportPickupDrop: boolean;
  durationDays: number;
  perDayRateINR: number;
  totalCabCostINR: number;
}

export interface WebsiteThemeConfig {
  accentColor: 'emerald' | 'blue' | 'indigo' | 'amber' | 'rose' | 'teal';
  themeColor?: 'emerald' | 'indigo' | 'amber' | 'ruby' | 'slate' | 'cyan';
  borderRadius: 'rounded-lg' | 'rounded-2xl' | 'rounded-3xl';
  showFlightsBottom: boolean;
  showHotelsBottom: boolean;
  showCabsBottom: boolean;
  showDiningBottom: boolean;
  showOffersBottom: boolean;
  showTestimonials: boolean;
  showFloatingWhatsApp: boolean;
  brandTagline: string;
  primaryPhone: string;
  agencyName?: string;
  tagline?: string;
  phoneHotline?: string;
  showFlightsVertical?: boolean;
  showHotelsVertical?: boolean;
  showCabsVertical?: boolean;
  showOffersVertical?: boolean;
}

export interface BookingRecord {
  id: string;
  serviceType?: 'package' | 'flight' | 'hotel' | 'cab' | 'holiday' | 'dining';
  packageId: string;
  packageTitle: string;
  destination: string;
  customerName: string;
  email: string;
  phone: string;
  adultsCount: number;
  childrenCount: number;
  departureDate: string;
  hotelTier: 'standard' | 'deluxe' | 'luxury';
  transportType: 'shared' | 'private_suv';
  addOns: string[];
  couponCode?: string;
  discountINR: number;
  totalAmountINR: number;
  advancePaidINR?: number;
  balanceDueINR?: number;
  selectedCurrency: Currency;
  status: 'Confirmed' | 'Pending Payment' | 'Under Review' | 'Cancelled' | 'Checked-In';
  checkedIn?: boolean;
  checkInDetails?: {
    seat?: string;
    meal?: string;
    idType?: string;
    idNumber?: string;
    checkedInAt?: string;
  };
  flightDetails?: FlightBookingDetails;
  hotelDetails?: HotelBookingDetails;
  cabDetails?: CabBookingDetails;
  bundledFlight?: BundledFlightDetails;
  bundledCab?: BundledCabDetails;
  paymentMethod: PaymentMethod | string;
  paymentStatus: 'Paid' | 'Advance Paid' | 'Pending Verification' | string;
  transactionRef?: string;
  upiNumber?: string;
  upiId?: string;
  createdAt: string;
  notes?: string;
  deviceRole?: string;
}

export interface CartItem {
  package: TourPackage;
  travelers: number;
  addedAt: string;
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  badge: string;
  active: boolean;
  color: 'emerald' | 'amber' | 'rose' | 'purple' | 'cyan';
  updatedAt: string;
}

export interface CustomerInquiry {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  destinationInterest: string;
  preferredMonth: string;
  travelersCount: number;
  budgetPerPersonINR?: number;
  message: string;
  status: 'New' | 'Called' | 'Quote Sent' | 'Converted' | 'Closed' | 'Contacted' | 'Resolved';
  createdAt: string;
}

export interface VisaInfo {
  country: string;
  flag: string;
  visaType: string;
  processingTime: string;
  stayDuration: string;
  feeEstimate: string;
  requirements: string[];
  tips: string;
}

export interface FlightOffer {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  aircraft: string;
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: 0 | 1 | 2;
  stopCity?: string;
  priceINR: number;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  rating: number;
  seatsLeft: number;
  cabinBaggage: string;
  checkInBaggage: string;
}

export interface HotelProperty {
  id: string;
  name: string;
  city: string;
  stars: 3 | 4 | 5;
  category: 'Beach Resort' | 'Heritage Palace' | 'Private Pool Villa' | 'Mountain Cottage' | 'Business Hotel';
  rating: number;
  reviewsCount: number;
  locationProximity: string;
  heroImage: string;
  gallery: string[];
  basePricePerNightINR: number;
  amenities: string[];
  roomTypes: Array<{
    id: string;
    name: string;
    description: string;
    pricePerNightINR: number;
    maxGuests: number;
    bedType: string;
    image: string;
  }>;
  mealPlans: Array<{
    code: 'EP' | 'CP' | 'MAP';
    name: string;
    description: string;
    pricePerNightINR: number;
  }>;
  cancellationPolicy: string;
}

export interface CabVehicleOption {
  id: string;
  name: string;
  model: string;
  category: 'Hatchback / Compact' | 'Executive Sedan' | 'Prime SUV' | 'Luxury Chauffeur' | 'Tempo Traveler';
  passengerCapacity: number;
  luggageCapacity: number;
  ac: boolean;
  baseRatePerKmINR: number;
  flatAirportPickupINR: number;
  flatAirportDropINR: number;
  image: string;
  features: string[];
}

export interface PromoCoupon {
  code: string;
  title: string;
  description: string;
  discountType: 'flat' | 'percentage';
  discountValue: number;
  minBookingValueINR: number;
  maxDiscountINR: number;
  serviceCategory: 'all' | 'flights' | 'hotels' | 'holidays' | 'cabs';
  expiryDate: string;
  badge: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  joinedDate: string;
  loyaltyTier?: string;
  loyaltyPoints?: number;
  lastLoginAt?: string;
  totalBookings?: number;
  status?: 'Active' | 'Inactive';
}
