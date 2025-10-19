/**
 * Booking-related type definitions for the Hotel Service
 */

export interface Booking {
  id: string;
  confirmationNumber: string;
  propertyId: string;

  // Guest information
  guestId: string;
  primaryGuest: GuestDetails;
  additionalGuests: GuestDetails[];

  // Booking details
  checkInDate: Date;
  checkOutDate: Date;
  nights: number;
  rooms: BookedRoom[];

  // Pricing
  pricing: BookingPricing;
  totalAmount: number;
  currency: string;

  // Status and workflow
  status: BookingStatus;
  bookingSource: BookingSource;

  // Special requests and preferences
  specialRequests?: string;
  preferences: GuestPreferences;

  // Payment information
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;

  // Policies applied
  cancellationPolicy: CancellationPolicy;
  noShowPolicy: NoShowPolicy;

  // Timestamps
  bookedAt: Date;
  createdAt: Date;
  updatedAt: Date;

  // Metadata
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

export enum CancellationPolicy {
  FREE_CANCELLATION = 'free_cancellation',
  MODERATE = 'moderate',
  STRICT = 'strict',
  SUPER_STRICT = 'super_strict',
  NON_REFUNDABLE = 'non_refundable',
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

// Request/Response types
export interface CreateBookingRequest {
  propertyId: string;
  checkInDate: Date;
  checkOutDate: Date;
  rooms: BookingRoomRequest[];
  primaryGuest: GuestDetails;
  additionalGuests?: GuestDetails[];
  specialRequests?: string;
  preferences?: Partial<GuestPreferences>;
  paymentMethod: PaymentMethod;
  bookingSource: BookingSource;
  promotionCodes?: string[];
  corporateCode?: string;
  metadata?: Record<string, any>;
}

export interface BookingRoomRequest {
  roomTypeId: string;
  quantity: number;
  guestCount: number;
  guests: GuestDetails[];
}

export interface UpdateBookingRequest {
  checkInDate?: Date;
  checkOutDate?: Date;
  rooms?: BookingRoomRequest[];
  specialRequests?: string;
  preferences?: Partial<GuestPreferences>;
  status?: BookingStatus;
}

export interface CancellationRequest {
  reason: string;
  requestedBy: string;
  refundAmount?: number;
  metadata?: Record<string, any>;
}

export interface BookingSearchCriteria {
  propertyId?: string;
  guestId?: string;
  confirmationNumber?: string;
  status?: BookingStatus[];
  bookingSource?: BookingSource[];
  checkInDateFrom?: Date;
  checkInDateTo?: Date;
  checkOutDateFrom?: Date;
  checkOutDateTo?: Date;
  bookedDateFrom?: Date;
  bookedDateTo?: Date;
  sortBy?: BookingSortBy;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export enum BookingSortBy {
  BOOKING_DATE = 'booking_date',
  CHECK_IN_DATE = 'check_in_date',
  CHECK_OUT_DATE = 'check_out_date',
  TOTAL_AMOUNT = 'total_amount',
  STATUS = 'status',
  GUEST_NAME = 'guest_name',
}

export interface BookingSearchResult {
  bookings: Booking[];
  totalCount: number;
  hasMore: boolean;
}

export interface BookingResult {
  booking: Booking;
  confirmationNumber: string;
  paymentResult?: any;
}

export interface CancellationResult {
  booking: Booking;
  refundAmount: number;
  refundStatus: string;
  cancellationFee: number;
}

export interface ModificationResult {
  booking: Booking;
  pricingImpact: PricingImpact;
  confirmationSent: boolean;
}

export interface PricingImpact {
  originalAmount: number;
  newAmount: number;
  difference: number;
  additionalPayment: number;
  refundAmount: number;
  fees: FeeBreakdown[];
}

// Enhanced modification and cancellation types
export interface BookingModificationRequest {
  checkInDate?: Date;
  checkOutDate?: Date;
  rooms?: BookingRoomRequest[];
  primaryGuest?: Partial<GuestDetails>;
  additionalGuests?: GuestDetails[];
  specialRequests?: string;
  preferences?: Partial<GuestPreferences>;
  reason: string;
  requestedBy: string;
  metadata?: Record<string, any>;
}

export interface CancellationPolicyDetails {
  id: string;
  name: string;
  description: string;
  refundPercentage: number;
  hoursBeforeCheckIn: number;
  penaltyType: CancellationPenaltyType;
  penaltyValue?: number;
  isActive: boolean;
  isDefault: boolean;
}

export enum CancellationPenaltyType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  NIGHTS = 'nights',
  NO_PENALTY = 'no_penalty',
}

export interface RefundCalculation {
  originalAmount: number;
  refundableAmount: number;
  cancellationFee: number;
  penaltyAmount: number;
  refundPercentage: number;
  hoursUntilCheckIn: number;
  policyApplied: CancellationPolicyDetails;
  breakdown: RefundBreakdown[];
}

export interface RefundBreakdown {
  description: string;
  amount: number;
  type: 'refund' | 'fee' | 'penalty';
}

export interface ModificationValidation {
  isValid: boolean;
  canModify: boolean;
  errors: import('../index').ValidationError[];
  warnings: import('../index').ValidationError[];
  pricingImpact?: PricingImpact;
  availabilityImpact?: AvailabilityImpact;
}

export interface AvailabilityImpact {
  originalRooms: BookedRoom[];
  newRooms: BookingRoomRequest[];
  roomsToRelease: BookedRoom[];
  roomsToReserve: BookingRoomRequest[];
  availabilityStatus: 'available' | 'partially_available' | 'unavailable';
}

export interface BookingHistoryEntry {
  id: string;
  bookingId: string;
  action: BookingHistoryAction;
  changedBy: string;
  changeType: string;
  oldValue?: any;
  newValue?: any;
  description?: string;
  timestamp: Date;
}

export enum BookingHistoryAction {
  CREATED = 'created',
  MODIFIED = 'modified',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  NO_SHOW = 'no_show',
  STATUS_CHANGED = 'status_changed',
  PAYMENT_PROCESSED = 'payment_processed',
  REFUND_PROCESSED = 'refund_processed',
}
