import { Distance, Duration, GeoLocation } from './common.types';
import { VehicleType } from './ride.types';

// Core pricing interfaces
export interface FareBreakdown {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  surgeFare: number;
  tolls: number;
  fees: FareComponent[];
  discounts: FareComponent[];
  tips: number;
  taxes: number;
  total: number;
  currency: string;
}

export interface FareComponent {
  type: string;
  amount: number;
  description: string;
  percentage?: number;
}

export interface FareEstimate {
  estimatedFare: FareBreakdown;
  fareRange: {
    min: number;
    max: number;
  };
  surgeMultiplier: number;
  estimatedDuration: Duration;
  estimatedDistance: Distance;
  validUntil: Date;
  routeHash: string;
}

export interface FareEstimateRequest {
  pickupLocation: GeoLocation;
  dropoffLocation: GeoLocation;
  vehicleType: VehicleType;
  scheduledTime?: Date;
  promoCode?: string;
  passengerCount?: number;
}

// Pricing configuration
export interface PricingConfig {
  vehicleType: VehicleType;
  baseFare: number;
  ratePerKilometer: number;
  ratePerMinute: number;
  minimumFare: number;
  maximumFare?: number;
  cancellationFee: number;
  currency: string;
  timezone: string;
}

export interface SurgePricing {
  area: string;
  multiplier: number;
  startTime: Date;
  endTime?: Date;
  reason: SurgeReason;
  demandLevel: DemandLevel;
  affectedVehicleTypes: VehicleType[];
}

export enum SurgeReason {
  HIGH_DEMAND = 'high_demand',
  LOW_SUPPLY = 'low_supply',
  WEATHER = 'weather',
  EVENT = 'event',
  PEAK_HOURS = 'peak_hours',
  HOLIDAY = 'holiday',
  EMERGENCY = 'emergency',
}

export enum DemandLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
  EXTREME = 'extreme',
}

// Dynamic pricing
export interface DynamicPricingRule {
  id: string;
  name: string;
  conditions: PricingCondition[];
  actions: PricingAction[];
  priority: number;
  isActive: boolean;
  validFrom: Date;
  validUntil?: Date;
}

export interface PricingCondition {
  type: ConditionType;
  operator: ConditionOperator;
  value: any;
  field: string;
}

export enum ConditionType {
  TIME_OF_DAY = 'time_of_day',
  DAY_OF_WEEK = 'day_of_week',
  WEATHER = 'weather',
  DEMAND_RATIO = 'demand_ratio',
  DISTANCE = 'distance',
  DURATION = 'duration',
  LOCATION = 'location',
  VEHICLE_TYPE = 'vehicle_type',
  USER_TYPE = 'user_type',
}

export enum ConditionOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',
  IN = 'in',
  NOT_IN = 'not_in',
  CONTAINS = 'contains',
  BETWEEN = 'between',
}

export interface PricingAction {
  type: ActionType;
  value: number;
  description: string;
}

export enum ActionType {
  MULTIPLY_BASE_FARE = 'multiply_base_fare',
  ADD_FIXED_AMOUNT = 'add_fixed_amount',
  MULTIPLY_TOTAL = 'multiply_total',
  SET_MINIMUM_FARE = 'set_minimum_fare',
  ADD_PERCENTAGE = 'add_percentage',
  APPLY_DISCOUNT = 'apply_discount',
}

// Promotions and discounts
export interface Promotion {
  id: string;
  code: string;
  name: string;
  description: string;
  type: PromotionType;
  discountValue: number;
  discountType: DiscountType;
  conditions: PromotionCondition[];
  usageLimit?: number;
  usageCount: number;
  userLimit?: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  applicableVehicleTypes: VehicleType[];
  minimumFare?: number;
  maximumDiscount?: number;
}

export enum PromotionType {
  FIRST_RIDE = 'first_ride',
  REFERRAL = 'referral',
  LOYALTY = 'loyalty',
  SEASONAL = 'seasonal',
  EVENT = 'event',
  GENERAL = 'general',
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  FREE_RIDE = 'free_ride',
}

export interface PromotionCondition {
  type: string;
  value: any;
  description: string;
}

export interface PromotionUsage {
  id: string;
  promotionId: string;
  userId: string;
  rideId: string;
  discountAmount: number;
  usedAt: Date;
}

// Driver earnings
export interface DriverEarningsCalculation {
  grossFare: number;
  platformCommission: number;
  netEarnings: number;
  tips: number;
  bonuses: number;
  totalEarnings: number;
  breakdown: EarningsBreakdown;
}

export interface EarningsBreakdown {
  baseFareEarnings: number;
  distanceEarnings: number;
  timeEarnings: number;
  surgeEarnings: number;
  peakHourBonus: number;
  qualityBonus: number;
  referralBonus: number;
  completionBonus: number;
}

export interface CommissionStructure {
  vehicleType: VehicleType;
  baseCommissionRate: number;
  tieredRates?: CommissionTier[];
  minimumCommission?: number;
  maximumCommission?: number;
}

export interface CommissionTier {
  minRides: number;
  maxRides?: number;
  commissionRate: number;
}

// Pricing analytics
export interface PricingAnalytics {
  timeWindow: {
    start: Date;
    end: Date;
  };
  totalRides: number;
  averageFare: number;
  totalRevenue: number;
  surgePercentage: number;
  discountPercentage: number;
  fareDistribution: FareDistribution[];
  demandSupplyRatio: number;
}

export interface FareDistribution {
  fareRange: {
    min: number;
    max: number;
  };
  rideCount: number;
  percentage: number;
}

// Payment processing
export interface PaymentRequest {
  rideId: string;
  passengerId: string;
  amount: number;
  currency: string;
  paymentMethodId: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  amount: number;
  currency: string;
  processedAt: Date;
  error?: string;
  refundable: boolean;
}

export interface RefundRequest {
  rideId: string;
  amount: number;
  reason: RefundReason;
  requestedBy: string;
  notes?: string;
}

export enum RefundReason {
  RIDE_CANCELLED = 'ride_cancelled',
  DRIVER_NO_SHOW = 'driver_no_show',
  POOR_SERVICE = 'poor_service',
  OVERCHARGE = 'overcharge',
  TECHNICAL_ERROR = 'technical_error',
  CUSTOMER_REQUEST = 'customer_request',
}

export interface RefundResult {
  success: boolean;
  refundId?: string;
  amount: number;
  processedAt: Date;
  estimatedArrival?: Date;
  error?: string;
}

// Toll and fee management
export interface TollCalculation {
  route: string;
  totalTolls: number;
  tollPoints: PricingTollPoint[];
  currency: string;
  calculatedAt: Date;
}

export interface PricingTollPoint {
  location: GeoLocation;
  name: string;
  cost: number;
  operator: string;
  paymentMethods: string[];
}

export interface AdditionalFee {
  type: FeeType;
  amount: number;
  description: string;
  applicableConditions: string[];
  isRefundable: boolean;
}

export enum FeeType {
  AIRPORT_FEE = 'airport_fee',
  CLEANING_FEE = 'cleaning_fee',
  CANCELLATION_FEE = 'cancellation_fee',
  WAITING_FEE = 'waiting_fee',
  TOLL_FEE = 'toll_fee',
  BOOKING_FEE = 'booking_fee',
  SERVICE_FEE = 'service_fee',
  PEAK_HOUR_FEE = 'peak_hour_fee',
}
