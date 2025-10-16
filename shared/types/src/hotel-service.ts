/**
 * Hotel Service type definitions
 * These types are specific to the hotel booking and management service
 */

export interface HotelProperty {
  id: string;
  name: string;
  description: string;
  category: PropertyCategory;
  address: Address;
  coordinates: GeoCoordinates;
  timezone: string;
  starRating?: number;
  amenities: PropertyAmenity[];
  policies: PropertyPolicies;
  contactInfo: ContactInformation;
  images: PropertyImage[];
  virtualTour?: string;
  ownerId: string;
  chainId?: string;
  brandId?: string;
  status: PropertyStatus;
  settings: PropertySettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  region?: string;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface PropertyPolicies {
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: CancellationPolicy;
  childPolicy: ChildPolicy;
  petPolicy: PetPolicy;
  smokingPolicy: SmokingPolicy;
  minimumAge?: number;
}

export interface ContactInformation {
  phone: string;
  email: string;
  website?: string;
  fax?: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  order: number;
  type: ImageType;
}

export interface PropertySettings {
  currency: string;
  timezone: string;
  language: string;
  taxRate: number;
  serviceChargeRate: number;
  allowOnlineBooking: boolean;
  requireApproval: boolean;
  autoConfirmBookings: boolean;
}

export enum PropertyCategory {
  HOTEL = 'hotel',
  RESORT = 'resort',
  APARTMENT = 'apartment',
  VILLA = 'villa',
  HOSTEL = 'hostel',
  BED_AND_BREAKFAST = 'bed_and_breakfast',
  BOUTIQUE = 'boutique',
  BUSINESS = 'business',
  LUXURY = 'luxury',
  BUDGET = 'budget',
}

export enum PropertyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  PENDING_APPROVAL = 'pending_approval',
  SUSPENDED = 'suspended',
}

export enum PropertyAmenity {
  WIFI = 'wifi',
  PARKING = 'parking',
  POOL = 'pool',
  GYM = 'gym',
  SPA = 'spa',
  RESTAURANT = 'restaurant',
  BAR = 'bar',
  ROOM_SERVICE = 'room_service',
  CONCIERGE = 'concierge',
  LAUNDRY = 'laundry',
  BUSINESS_CENTER = 'business_center',
  MEETING_ROOMS = 'meeting_rooms',
  CONFERENCE_FACILITIES = 'conference_facilities',
  KIDS_CLUB = 'kids_club',
  BABYSITTING = 'babysitting',
  PLAYGROUND = 'playground',
  WHEELCHAIR_ACCESSIBLE = 'wheelchair_accessible',
  ELEVATOR = 'elevator',
  AIRPORT_SHUTTLE = 'airport_shuttle',
  PET_FRIENDLY = 'pet_friendly',
  NON_SMOKING = 'non_smoking',
  AIR_CONDITIONING = 'air_conditioning',
  HEATING = 'heating',
}

export enum ImageType {
  EXTERIOR = 'exterior',
  LOBBY = 'lobby',
  ROOM = 'room',
  AMENITY = 'amenity',
  DINING = 'dining',
  RECREATION = 'recreation',
  BUSINESS = 'business',
  OTHER = 'other',
}

export enum CancellationPolicy {
  FREE_CANCELLATION = 'free_cancellation',
  MODERATE = 'moderate',
  STRICT = 'strict',
  SUPER_STRICT = 'super_strict',
  NON_REFUNDABLE = 'non_refundable',
}

export enum ChildPolicy {
  CHILDREN_WELCOME = 'children_welcome',
  ADULTS_ONLY = 'adults_only',
  CHILDREN_WITH_RESTRICTIONS = 'children_with_restrictions',
}

export enum PetPolicy {
  PETS_ALLOWED = 'pets_allowed',
  NO_PETS = 'no_pets',
  PETS_WITH_RESTRICTIONS = 'pets_with_restrictions',
}

export enum SmokingPolicy {
  NON_SMOKING = 'non_smoking',
  SMOKING_ALLOWED = 'smoking_allowed',
  DESIGNATED_AREAS = 'designated_areas',
}

export interface HotelRoomType {
  id: string;
  propertyId: string;
  name: string;
  description: string;
  category: RoomCategory;
  maxOccupancy: number;
  bedConfiguration: BedConfiguration[];
  roomSize: number;
  roomSizeUnit: RoomSizeUnit;
  amenities: RoomAmenity[];
  view?: RoomView;
  floor?: string;
  totalRooms: number;
  baseRate: number;
  currency: string;
  images: RoomImage[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BedConfiguration {
  bedType: BedType;
  quantity: number;
}

export interface RoomImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  order: number;
}

export enum RoomCategory {
  STANDARD = 'standard',
  DELUXE = 'deluxe',
  SUITE = 'suite',
  EXECUTIVE = 'executive',
  PRESIDENTIAL = 'presidential',
  JUNIOR_SUITE = 'junior_suite',
  PENTHOUSE = 'penthouse',
  STUDIO = 'studio',
  FAMILY = 'family',
  ACCESSIBLE = 'accessible',
}

export enum BedType {
  SINGLE = 'single',
  DOUBLE = 'double',
  QUEEN = 'queen',
  KING = 'king',
  SOFA_BED = 'sofa_bed',
  BUNK_BED = 'bunk_bed',
  TWIN = 'twin',
  FULL = 'full',
  CALIFORNIA_KING = 'california_king',
}

export enum RoomSizeUnit {
  SQM = 'sqm',
  SQFT = 'sqft',
}

export enum RoomView {
  OCEAN = 'ocean',
  MOUNTAIN = 'mountain',
  CITY = 'city',
  GARDEN = 'garden',
  POOL = 'pool',
  COURTYARD = 'courtyard',
  STREET = 'street',
  INTERIOR = 'interior',
  PARTIAL_OCEAN = 'partial_ocean',
  PARTIAL_CITY = 'partial_city',
}

export enum RoomAmenity {
  WIFI = 'wifi',
  TV = 'tv',
  CABLE_TV = 'cable_tv',
  SMART_TV = 'smart_tv',
  PHONE = 'phone',
  SAFE = 'safe',
  PRIVATE_BATHROOM = 'private_bathroom',
  BATHTUB = 'bathtub',
  SHOWER = 'shower',
  HAIRDRYER = 'hairdryer',
  TOILETRIES = 'toiletries',
  BATHROBES = 'bathrobes',
  SLIPPERS = 'slippers',
  AIR_CONDITIONING = 'air_conditioning',
  HEATING = 'heating',
  MINIBAR = 'minibar',
  COFFEE_MAKER = 'coffee_maker',
  KETTLE = 'kettle',
  REFRIGERATOR = 'refrigerator',
  DESK = 'desk',
  CHAIR = 'chair',
  SOFA = 'sofa',
  BALCONY = 'balcony',
  TERRACE = 'terrace',
  WARDROBE = 'wardrobe',
  ROOM_SERVICE = 'room_service',
  DAILY_HOUSEKEEPING = 'daily_housekeeping',
  TURNDOWN_SERVICE = 'turndown_service',
  WAKE_UP_SERVICE = 'wake_up_service',
  WHEELCHAIR_ACCESSIBLE = 'wheelchair_accessible',
  GRAB_BARS = 'grab_bars',
  LOWERED_FIXTURES = 'lowered_fixtures',
  KITCHENETTE = 'kitchenette',
  FULL_KITCHEN = 'full_kitchen',
  MICROWAVE = 'microwave',
  DISHWASHER = 'dishwasher',
  SOUND_SYSTEM = 'sound_system',
  GAMING_CONSOLE = 'gaming_console',
  BOOKS = 'books',
  MAGAZINES = 'magazines',
}

export interface HotelBooking {
  id: string;
  confirmationNumber: string;
  propertyId: string;
  guestId: string;
  primaryGuest: GuestDetails;
  additionalGuests: GuestDetails[];
  checkInDate: Date;
  checkOutDate: Date;
  nights: number;
  rooms: BookedRoom[];
  pricing: BookingPricing;
  totalAmount: number;
  currency: string;
  status: BookingStatus;
  bookingSource: BookingSource;
  specialRequests?: string;
  preferences: GuestPreferences;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  cancellationPolicy: CancellationPolicy;
  noShowPolicy: NoShowPolicy;
  bookedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  nationality?: string;
  passportNumber?: string;
  specialRequests?: string;
}

export interface BookedRoom {
  roomTypeId: string;
  roomNumber?: string;
  quantity: number;
  guestCount: number;
  rate: number;
  totalPrice: number;
  guests: GuestDetails[];
}

export interface BookingPricing {
  roomTotal: number;
  taxes: TaxBreakdown[];
  fees: FeeBreakdown[];
  discounts: DiscountBreakdown[];
  subtotal: number;
  total: number;
}

export interface TaxBreakdown {
  name: string;
  rate: number;
  amount: number;
  type: TaxType;
}

export interface FeeBreakdown {
  name: string;
  amount: number;
  type: FeeType;
  isOptional: boolean;
}

export interface DiscountBreakdown {
  name: string;
  amount: number;
  type: DiscountType;
  code?: string;
}

export interface GuestPreferences {
  roomPreferences: RoomPreferences;
  servicePreferences: ServicePreferences;
  communicationLanguage: string;
  currency: string;
  timezone: string;
  dietaryRestrictions?: string[];
  accessibility?: AccessibilityRequirements;
}

export interface RoomPreferences {
  preferredFloor?: FloorPreference;
  preferredView?: string;
  bedType?: string;
  smokingPreference: SmokingPreference;
  quietRoom: boolean;
  accessibleRoom: boolean;
  connectingRooms?: boolean;
  highFloor?: boolean;
  lowFloor?: boolean;
}

export interface ServicePreferences {
  earlyCheckIn?: boolean;
  lateCheckOut?: boolean;
  roomService?: boolean;
  housekeeping?: HousekeepingPreference;
  wakeUpCall?: boolean;
  newspaperDelivery?: boolean;
  turndownService?: boolean;
}

export interface AccessibilityRequirements {
  wheelchairAccessible: boolean;
  hearingImpaired: boolean;
  visuallyImpaired: boolean;
  mobilityAssistance: boolean;
  other?: string;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  MODIFIED = 'modified',
  EXPIRED = 'expired',
}

export enum BookingSource {
  DIRECT = 'direct',
  OTA = 'ota',
  PHONE = 'phone',
  WALK_IN = 'walk_in',
  CORPORATE = 'corporate',
  GROUP = 'group',
  TRAVEL_AGENT = 'travel_agent',
  MOBILE_APP = 'mobile_app',
  PARTNER = 'partner',
}

export enum PaymentStatus {
  PENDING = 'pending',
  AUTHORIZED = 'authorized',
  CAPTURED = 'captured',
  PARTIALLY_PAID = 'partially_paid',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  CASH = 'cash',
  CORPORATE_ACCOUNT = 'corporate_account',
  VOUCHER = 'voucher',
  POINTS = 'points',
}

export enum NoShowPolicy {
  CHARGE_FIRST_NIGHT = 'charge_first_night',
  CHARGE_FULL_STAY = 'charge_full_stay',
  CHARGE_PENALTY = 'charge_penalty',
  NO_CHARGE = 'no_charge',
}

export enum TaxType {
  CITY_TAX = 'city_tax',
  TOURISM_TAX = 'tourism_tax',
  VAT = 'vat',
  SERVICE_TAX = 'service_tax',
  OCCUPANCY_TAX = 'occupancy_tax',
}

export enum FeeType {
  RESORT_FEE = 'resort_fee',
  CLEANING_FEE = 'cleaning_fee',
  SERVICE_FEE = 'service_fee',
  BOOKING_FEE = 'booking_fee',
  PARKING_FEE = 'parking_fee',
  WIFI_FEE = 'wifi_fee',
  PET_FEE = 'pet_fee',
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  EARLY_BIRD = 'early_bird',
  LAST_MINUTE = 'last_minute',
  LOYALTY = 'loyalty',
  CORPORATE = 'corporate',
  GROUP = 'group',
  PROMOTIONAL = 'promotional',
}

export enum FloorPreference {
  LOW = 'low',
  HIGH = 'high',
  MIDDLE = 'middle',
  GROUND = 'ground',
  TOP = 'top',
}

export enum SmokingPreference {
  SMOKING = 'smoking',
  NON_SMOKING = 'non_smoking',
  NO_PREFERENCE = 'no_preference',
}

export enum HousekeepingPreference {
  DAILY = 'daily',
  EVERY_OTHER_DAY = 'every_other_day',
  WEEKLY = 'weekly',
  ON_REQUEST = 'on_request',
  MINIMAL = 'minimal',
}

export interface HotelSearchCriteria {
  destination?: string;
  location?: LocationFilter;
  checkInDate: Date;
  checkOutDate: Date;
  rooms: RoomRequirement[];
  filters?: SearchFilters;
}

export interface LocationFilter {
  city?: string;
  state?: string;
  country?: string;
  coordinates?: GeoCoordinates;
  radius?: number;
}

export interface RoomRequirement {
  adults: number;
  children: number;
  childAges?: number[];
}

export interface SearchFilters {
  priceRange?: PriceRange;
  amenities?: string[];
  category?: string[];
  starRating?: number[];
  propertyTypes?: string[];
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}
