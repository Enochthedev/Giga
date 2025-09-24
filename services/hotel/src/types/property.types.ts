/**
 * Property-related type definitions for the Hotel Service
 */

export interface Property {
  id: string;
  name: string;
  description: string;
  category: PropertyCategory;

  // Location information
  address: PropertyAddress;
  coordinates: GeoCoordinates;
  timezone: string;

  // Property details
  starRating?: number;
  amenities: PropertyAmenity[];
  policies: PropertyPolicies;
  contactInfo: ContactInformation;

  // Media
  images: PropertyImage[];
  virtualTour?: string;

  // Business information
  ownerId: string;
  chainId?: string;
  brandId?: string;

  // Status and settings
  status: PropertyStatus;
  settings: PropertySettings;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyAddress {
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
  BUDGET = 'budget'
}

export enum PropertyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  PENDING_APPROVAL = 'pending_approval',
  SUSPENDED = 'suspended'
}

export enum PropertyAmenity {
  // General amenities
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

  // Business amenities
  BUSINESS_CENTER = 'business_center',
  MEETING_ROOMS = 'meeting_rooms',
  CONFERENCE_FACILITIES = 'conference_facilities',

  // Family amenities
  KIDS_CLUB = 'kids_club',
  BABYSITTING = 'babysitting',
  PLAYGROUND = 'playground',

  // Accessibility
  WHEELCHAIR_ACCESSIBLE = 'wheelchair_accessible',
  ELEVATOR = 'elevator',

  // Services
  AIRPORT_SHUTTLE = 'airport_shuttle',
  PET_FRIENDLY = 'pet_friendly',
  NON_SMOKING = 'non_smoking',
  AIR_CONDITIONING = 'air_conditioning',
  HEATING = 'heating'
}

export enum ImageType {
  EXTERIOR = 'exterior',
  LOBBY = 'lobby',
  ROOM = 'room',
  AMENITY = 'amenity',
  DINING = 'dining',
  RECREATION = 'recreation',
  BUSINESS = 'business',
  OTHER = 'other'
}

export enum CancellationPolicy {
  FREE_CANCELLATION = 'free_cancellation',
  MODERATE = 'moderate',
  STRICT = 'strict',
  SUPER_STRICT = 'super_strict',
  NON_REFUNDABLE = 'non_refundable'
}

export enum ChildPolicy {
  CHILDREN_WELCOME = 'children_welcome',
  ADULTS_ONLY = 'adults_only',
  CHILDREN_WITH_RESTRICTIONS = 'children_with_restrictions'
}

export enum PetPolicy {
  PETS_ALLOWED = 'pets_allowed',
  NO_PETS = 'no_pets',
  PETS_WITH_RESTRICTIONS = 'pets_with_restrictions'
}

export enum SmokingPolicy {
  NON_SMOKING = 'non_smoking',
  SMOKING_ALLOWED = 'smoking_allowed',
  DESIGNATED_AREAS = 'designated_areas'
}

// Request/Response types
export interface CreatePropertyRequest {
  name: string;
  description: string;
  category: PropertyCategory;
  address: PropertyAddress;
  coordinates: GeoCoordinates;
  timezone: string;
  starRating?: number;
  amenities: PropertyAmenity[];
  policies: PropertyPolicies;
  contactInfo: ContactInformation;
  settings: PropertySettings;
}

export interface UpdatePropertyRequest {
  name?: string;
  description?: string;
  category?: PropertyCategory;
  address?: Partial<PropertyAddress>;
  coordinates?: GeoCoordinates;
  timezone?: string;
  starRating?: number;
  amenities?: PropertyAmenity[];
  policies?: Partial<PropertyPolicies>;
  contactInfo?: Partial<ContactInformation>;
  settings?: Partial<PropertySettings>;
  status?: PropertyStatus;
}

export interface PropertySearchCriteria {
  location?: LocationFilter;
  checkInDate?: Date;
  checkOutDate?: Date;
  guestCount?: number;
  rooms?: RoomRequirement[];
  priceRange?: PriceRange;
  amenities?: PropertyAmenity[];
  category?: PropertyCategory[];
  starRating?: number[];
  sortBy?: PropertySortBy;
  sortOrder?: SortOrder;
  limit?: number;
  offset?: number;
}

export interface LocationFilter {
  city?: string;
  state?: string;
  country?: string;
  coordinates?: GeoCoordinates;
  radius?: number; // in kilometers
}

export interface RoomRequirement {
  adults: number;
  children: number;
  childAges?: number[];
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export enum PropertySortBy {
  NAME = 'name',
  PRICE = 'price',
  RATING = 'rating',
  DISTANCE = 'distance',
  POPULARITY = 'popularity',
  CREATED_DATE = 'created_date'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export interface PropertySearchResult {
  properties: Property[];
  totalCount: number;
  hasMore: boolean;
  filters: AppliedFilters;
}

export interface AppliedFilters {
  location?: LocationFilter;
  priceRange?: PriceRange;
  amenities?: PropertyAmenity[];
  category?: PropertyCategory[];
  starRating?: number[];
}