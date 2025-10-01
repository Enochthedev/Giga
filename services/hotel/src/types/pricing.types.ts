/**
 * Pricing-related type definitions for the Hotel Service
 */

export interface PriceCalculationRequest {
  propertyId: string;
  roomTypeId: string;
  checkInDate: Date;
  checkOutDate: Date;
  guestCount: number;
  roomQuantity?: number;
  promotionCodes?: string[];
  corporateCode?: string;
  loyaltyMemberId?: string;
  bookingSource?: string;
}

export interface PriceCalculation {
  baseAmount: number;
  discountAmount: number;
  taxAmount: number;
  feeAmount: number;
  totalAmount: number;
  currency: string;
  breakdown: PriceBreakdown;
  nightlyRates: NightlyRate[];
  appliedPromotions: AppliedPromotion[];
  validUntil: Date;
}

export interface PriceBreakdown {
  roomCharges: RoomCharge[];
  taxes: TaxItem[];
  fees: FeeItem[];
  discounts: DiscountItem[];
  subtotal: number;
  total: number;
}

export interface RoomCharge {
  date: Date;
  roomTypeId: string;
  baseRate: number;
  adjustedRate: number;
  adjustmentReason?: string;
  quantity: number;
  totalAmount: number;
}

export interface TaxItem {
  name: string;
  type: TaxType;
  rate: number;
  amount: number;
  isInclusive: boolean;
  description?: string;
}

export interface FeeItem {
  name: string;
  type: FeeType;
  amount: number;
  isOptional: boolean;
  perNight: boolean;
  perRoom: boolean;
  description?: string;
}

export interface DiscountItem {
  name: string;
  type: DiscountType;
  amount: number;
  percentage?: number;
  code?: string;
  description?: string;
}

export interface NightlyRate {
  date: Date;
  baseRate: number;
  adjustedRate: number;
  adjustments: RateAdjustment[];
  finalRate: number;
}

export interface RateAdjustment {
  type: AdjustmentType;
  name: string;
  amount: number;
  percentage?: number;
  reason: string;
}

export interface AppliedPromotion {
  id: string;
  code?: string;
  name: string;
  description: string;
  discountAmount: number;
  discountPercentage?: number;
  conditions: string[];
}

export enum TaxType {
  CITY_TAX = 'city_tax',
  TOURISM_TAX = 'tourism_tax',
  VAT = 'vat',
  GST = 'gst',
  SERVICE_TAX = 'service_tax',
  OCCUPANCY_TAX = 'occupancy_tax',
  RESORT_TAX = 'resort_tax',
}

export enum FeeType {
  RESORT_FEE = 'resort_fee',
  CLEANING_FEE = 'cleaning_fee',
  SERVICE_FEE = 'service_fee',
  BOOKING_FEE = 'booking_fee',
  PARKING_FEE = 'parking_fee',
  WIFI_FEE = 'wifi_fee',
  PET_FEE = 'pet_fee',
  EXTRA_PERSON_FEE = 'extra_person_fee',
  EARLY_CHECKIN_FEE = 'early_checkin_fee',
  LATE_CHECKOUT_FEE = 'late_checkout_fee',
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  EARLY_BIRD = 'early_bird',
  LAST_MINUTE = 'last_minute',
  EXTENDED_STAY = 'extended_stay',
  LOYALTY = 'loyalty',
  CORPORATE = 'corporate',
  GROUP = 'group',
  SEASONAL = 'seasonal',
  PROMOTIONAL = 'promotional',
}

export enum AdjustmentType {
  SEASONAL = 'seasonal',
  DEMAND_BASED = 'demand_based',
  OCCUPANCY_BASED = 'occupancy_based',
  ADVANCE_BOOKING = 'advance_booking',
  LENGTH_OF_STAY = 'length_of_stay',
  DAY_OF_WEEK = 'day_of_week',
  SPECIAL_EVENT = 'special_event',
  COMPETITOR_BASED = 'competitor_based',
}

// Rate Management Types
export interface RateRecord {
  id: string;
  propertyId: string;
  roomTypeId: string;
  date: Date;
  rate: number;
  currency: string;
  rateType: RateType;
  minimumStay?: number;
  maximumStay?: number;
  advanceBookingDays?: number;
  restrictions?: RateRestriction[];
  createdAt: Date;
  updatedAt: Date;
}

export enum RateType {
  BASE = 'base',
  SEASONAL = 'seasonal',
  PROMOTIONAL = 'promotional',
  CORPORATE = 'corporate',
  GROUP = 'group',
  PACKAGE = 'package',
  LAST_MINUTE = 'last_minute',
}

export interface RateRestriction {
  type: RestrictionType;
  value: string | number | boolean;
  description?: string;
}

export enum RestrictionType {
  MINIMUM_STAY = 'minimum_stay',
  MAXIMUM_STAY = 'maximum_stay',
  ADVANCE_BOOKING = 'advance_booking',
  CLOSED_TO_ARRIVAL = 'closed_to_arrival',
  CLOSED_TO_DEPARTURE = 'closed_to_departure',
  BOOKING_WINDOW = 'booking_window',
  AGE_RESTRICTION = 'age_restriction',
}

export interface RateUpdate {
  roomTypeId: string;
  dateRange: DateRange;
  rate?: number;
  rateType?: RateType;
  minimumStay?: number;
  maximumStay?: number;
  restrictions?: RateRestriction[];
}

export interface DateRange {
  start: Date;
  end: Date;
}

// Dynamic Pricing Types
export interface DynamicPricingRule {
  id: string;
  propertyId: string;
  name: string;
  description: string;
  type: DynamicPricingType;
  isActive: boolean;
  priority: number;
  conditions: PricingCondition[];
  adjustments: PricingAdjustment[];
  validFrom: Date;
  validTo: Date;
  applicableRoomTypes?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum DynamicPricingType {
  OCCUPANCY_BASED = 'occupancy_based',
  DEMAND_BASED = 'demand_based',
  COMPETITOR_BASED = 'competitor_based',
  SEASONAL = 'seasonal',
  EVENT_BASED = 'event_based',
  ADVANCE_BOOKING = 'advance_booking',
  LENGTH_OF_STAY = 'length_of_stay',
  DAY_OF_WEEK = 'day_of_week',
}

export interface PricingCondition {
  type: ConditionType;
  operator: ConditionOperator;
  value: number | string | boolean;
  description?: string;
}

export enum ConditionType {
  OCCUPANCY_RATE = 'occupancy_rate',
  ADVANCE_BOOKING_DAYS = 'advance_booking_days',
  LENGTH_OF_STAY = 'length_of_stay',
  DAY_OF_WEEK = 'day_of_week',
  SEASON = 'season',
  DEMAND_SCORE = 'demand_score',
  COMPETITOR_RATE = 'competitor_rate',
  BOOKING_PACE = 'booking_pace',
}

export enum ConditionOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN = 'less_than',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',
  IN = 'in',
  NOT_IN = 'not_in',
  BETWEEN = 'between',
}

export interface PricingAdjustment {
  type: AdjustmentType;
  method: AdjustmentMethod;
  value: number;
  maxAdjustment?: number;
  minRate?: number;
  maxRate?: number;
}

export enum AdjustmentMethod {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  MULTIPLIER = 'multiplier',
  SET_RATE = 'set_rate',
}

// Seasonal Pricing Types
export interface SeasonalRate {
  id: string;
  propertyId: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  roomTypeRates: SeasonalRoomTypeRate[];
  isActive: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SeasonalRoomTypeRate {
  roomTypeId: string;
  adjustmentType: AdjustmentMethod;
  adjustmentValue: number;
  minimumRate?: number;
  maximumRate?: number;
}

// Promotion Types
export interface Promotion {
  id: string;
  propertyId: string;
  code?: string;
  name: string;
  description: string;
  type: PromotionType;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number;
  validFrom: Date;
  validTo: Date;
  conditions: PromotionCondition[];
  usage: PromotionUsage;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum PromotionType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  LOYALTY = 'loyalty',
  CORPORATE = 'corporate',
  GROUP = 'group',
  FLASH_SALE = 'flash_sale',
}

export interface PromotionCondition {
  type: PromotionConditionType;
  value: any;
  description?: string;
}

export enum PromotionConditionType {
  MINIMUM_STAY = 'minimum_stay',
  ADVANCE_BOOKING = 'advance_booking',
  BOOKING_WINDOW = 'booking_window',
  ROOM_TYPES = 'room_types',
  GUEST_TYPE = 'guest_type',
  BOOKING_SOURCE = 'booking_source',
  MINIMUM_AMOUNT = 'minimum_amount',
  BLACKOUT_DATES = 'blackout_dates',
}

export interface PromotionUsage {
  maxTotalUsage?: number;
  maxUsagePerGuest?: number;
  currentUsage: number;
  usageHistory: PromotionUsageRecord[];
}

export interface PromotionUsageRecord {
  bookingId: string;
  guestId: string;
  usedAt: Date;
  discountAmount: number;
}

// Group Pricing Types
export interface GroupDiscount {
  id: string;
  propertyId: string;
  name: string;
  description: string;
  minimumRooms: number;
  discountType: DiscountType;
  discountValue: number;
  validFrom: Date;
  validTo: Date;
  applicableRoomTypes?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupDiscountRequest {
  propertyId: string;
  roomQuantity: number;
  roomTypeId: string;
  checkInDate: Date;
  checkOutDate: Date;
  groupType?: string;
  corporateCode?: string;
}

// Price Validation Types
export interface PriceValidation {
  isValid: boolean;
  errors: PriceValidationError[];
  warnings: PriceValidationWarning[];
  validatedAt: Date;
}

export interface PriceValidationError {
  code: string;
  message: string;
  field?: string;
  value?: any;
}

export interface PriceValidationWarning {
  code: string;
  message: string;
  suggestion?: string;
}

// Tax Calculation Types
export interface TaxCalculation {
  taxes: TaxItem[];
  totalTaxAmount: number;
  taxInclusiveAmount: number;
  taxExclusiveAmount: number;
  currency: string;
}

export interface TaxConfiguration {
  id: string;
  propertyId: string;
  name: string;
  type: TaxType;
  rate: number;
  isPercentage: boolean;
  isInclusive: boolean;
  applicableRoomTypes?: string[];
  validFrom: Date;
  validTo?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
