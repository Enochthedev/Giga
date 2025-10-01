/**
 * Main type exports for the Hotel Service
 */

// Property types
export {
  CancellationPolicy,
  ChildPolicy,
  ImageType,
  PetPolicy,
  PropertyAmenity,
  PropertyCategory,
  PropertySortBy,
  PropertyStatus,
  SmokingPolicy,
  SortOrder,
} from './property.types';
export type {
  AppliedFilters,
  ContactInformation,
  CreatePropertyRequest,
  GeoCoordinates,
  LocationFilter,
  PriceRange,
  Property,
  PropertyAddress,
  PropertyImage,
  PropertyPolicies,
  PropertySearchCriteria,
  PropertySearchResult,
  PropertySettings,
  RoomRequirement,
  UpdatePropertyRequest,
} from './property.types';

// Room types
export {
  BedType,
  RoomAmenity,
  RoomCategory,
  RoomSizeUnit,
  RoomTypeSortBy,
  RoomView,
} from './room.types';
export type {
  BedConfiguration,
  CreateRoomTypeRequest,
  RoomImage,
  RoomType,
  RoomTypeSearchCriteria,
  RoomTypeSearchResult,
  UpdateRoomTypeRequest,
} from './room.types';

// Booking types
export {
  BookingSortBy,
  BookingSource,
  BookingStatus,
  DiscountType,
  FeeType,
  FloorPreference,
  HousekeepingPreference,
  NoShowPolicy,
  PaymentMethod,
  PaymentStatus,
  SmokingPreference,
  TaxType,
} from './booking.types';
export type {
  AccessibilityRequirements,
  BookedRoom,
  Booking,
  BookingPricing,
  BookingResult,
  BookingSearchCriteria,
  BookingSearchResult,
  CancellationRequest,
  CancellationResult,
  CreateBookingRequest,
  DiscountBreakdown,
  FeeBreakdown,
  GuestDetails,
  GuestPreferences,
  ModificationResult,
  PricingImpact,
  RoomPreferences,
  ServicePreferences,
  TaxBreakdown,
  UpdateBookingRequest,
} from './booking.types';

// Availability types
export type {
  AvailabilityRequest,
  AvailabilityResult,
  AvailableProperty,
  AvailableRoom,
  InventoryLock,
  InventoryRecord,
  InventoryReservation,
} from './availability.types';

// Pricing types
export type {
  AppliedPromotion,
  DiscountItem,
  FeeItem,
  NightlyRate,
  PriceBreakdown,
  PriceCalculation,
  PriceCalculationRequest,
  RateAdjustment,
  RoomCharge,
  TaxItem,
} from './pricing.types';

// Guest types
export type {
  CreateGuestProfileRequest,
  GuestProfile,
  GuestSearchCriteria,
  LoyaltyStatus,
  PersonalInformation,
  UpdateGuestProfileRequest,
  VIPStatus,
} from './guest.types';

// Common types
export interface ApiResponse<T = never> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: Date;
  requestId?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  field?: string;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
  page?: number;
  pageSize?: number;
}

export interface PaginationResult<T> {
  items: T[];
  totalCount: number;
  hasMore: boolean;
  currentPage?: number;
  totalPages?: number;
  limit: number;
  offset: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: unknown;
}

export interface SearchParams extends PaginationParams, SortParams {
  query?: string;
  filters?: FilterParams;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface TimeRange {
  startTime: string;
  endTime: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  region?: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  website?: string;
  fax?: string;
}

export interface MediaFile {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  alt?: string;
  caption?: string;
  order?: number;
}

export interface AuditInfo {
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
  version?: number;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: ValidationError[];
}

// Service interfaces
export interface HotelService {
  // Property management
  createProperty(property: any): Promise<any>;
  updateProperty(id: string, updates: any): Promise<any>;
  getProperty(id: string): Promise<any>;
  searchProperties(criteria: any): Promise<any>;

  // Room management
  createRoomType(propertyId: string, roomType: any): Promise<any>;
  updateRoomType(id: string, updates: any): Promise<any>;
  getRoomTypes(propertyId: string): Promise<unknown>;

  // Availability management
  checkAvailability(request: any): Promise<any>;
  updateAvailability(propertyId: string, updates: any[]): Promise<void>;
  blockAvailability(request: any): Promise<void>;

  // Booking management
  createBooking(booking: any): Promise<any>;
  updateBooking(id: string, updates: any): Promise<any>;
  cancelBooking(id: string, reason: any): Promise<any>;
  getBooking(id: string): Promise<any>;
  searchBookings(criteria: any): Promise<any>;
}

export interface AvailabilityEngine {
  checkRoomAvailability(request: any): Promise<any>;
  reserveInventory(booking: any): Promise<any>;
  releaseInventory(reservationId: string): Promise<void>;
  updateInventory(propertyId: string, updates: any[]): Promise<void>;
  getInventoryStatus(propertyId: string, dateRange: DateRange): Promise<any>;

  // Real-time inventory management
  lockInventory(request: any): Promise<any>;
  unlockInventory(lockId: string): Promise<void>;
  validateInventoryConsistency(propertyId: string): Promise<any>;
}

export interface PricingEngine {
  calculatePrice(request: any): Promise<any>;
  updateBaseRates(propertyId: string, rates: any[]): Promise<void>;
  applyDynamicPricing(propertyId: string, rules: any[]): Promise<void>;
  createPromotion(promotion: any): Promise<any>;
  validatePricing(booking: any): Promise<any>;

  // Rate management
  setSeasonalRates(propertyId: string, seasonalRates: any[]): Promise<void>;
  applyGroupDiscounts(request: any): Promise<any>;
  calculateTaxesAndFees(booking: any): Promise<any>;
}

export interface ReservationManager {
  processBooking(request: any): Promise<any>;
  modifyReservation(id: string, changes: any): Promise<any>;
  cancelReservation(id: string, policy: any): Promise<any>;
  confirmReservation(id: string): Promise<any>;

  // Booking workflow
  validateBookingRequest(request: any): Promise<ValidationResult>;
  processPayment(booking: any, payment: any): Promise<any>;
  sendConfirmation(booking: any): Promise<any>;
  handleNoShow(bookingId: string): Promise<any>;
}

// Configuration types
export interface HotelServiceConfig {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  redisUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  corsOrigin: string;
  logLevel: string;
  cacheConfig: CacheConfig;
  rateLimitConfig: RateLimitConfig;
  businessConfig: BusinessConfig;
}

export interface CacheConfig {
  ttl: number;
  availabilityTtl: number;
  pricingTtl: number;
  propertyTtl: number;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests: boolean;
}

export interface BusinessConfig {
  defaultCurrency: string;
  defaultTimezone: string;
  bookingHoldDuration: number;
  maxAdvanceBookingDays: number;
  minAdvanceBookingHours: number;
  defaultCancellationPolicy: string;
}

// Event types for integration
export interface HotelEvent {
  id: string;
  type: HotelEventType;
  entityId: string;
  entityType: string;
  data: unknown;
  timestamp: Date;
  source: string;
  version: string;
}

export enum HotelEventType {
  PROPERTY_CREATED = 'property.created',
  PROPERTY_UPDATED = 'property.updated',
  PROPERTY_DELETED = 'property.deleted',

  ROOM_TYPE_CREATED = 'room_type.created',
  ROOM_TYPE_UPDATED = 'room_type.updated',
  ROOM_TYPE_DELETED = 'room_type.deleted',

  BOOKING_CREATED = 'booking.created',
  BOOKING_UPDATED = 'booking.updated',
  BOOKING_CANCELLED = 'booking.cancelled',
  BOOKING_CONFIRMED = 'booking.confirmed',
  BOOKING_CHECKED_IN = 'booking.checked_in',
  BOOKING_CHECKED_OUT = 'booking.checked_out',
  BOOKING_NO_SHOW = 'booking.no_show',

  AVAILABILITY_UPDATED = 'availability.updated',
  INVENTORY_RESERVED = 'inventory.reserved',
  INVENTORY_RELEASED = 'inventory.released',

  PRICING_UPDATED = 'pricing.updated',
  PROMOTION_CREATED = 'promotion.created',
  PROMOTION_UPDATED = 'promotion.updated',

  GUEST_PROFILE_CREATED = 'guest_profile.created',
  GUEST_PROFILE_UPDATED = 'guest_profile.updated',
}
