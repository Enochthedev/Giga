import { GeoLocation, TimeWindow } from '@/types/common.types';
import {
  DriverEarningsCalculation,
  FareBreakdown,
  FareEstimate,
  FareEstimateRequest,
  PaymentRequest,
  PaymentResult,
  PricingConfig,
  Promotion,
  RefundRequest,
  RefundResult,
  SurgePricing,
} from '@/types/pricing.types';
import { VehicleType } from '@/types/ride.types';

/**
 * Core pricing engine interface
 */
export interface PricingEngine {
  // Fare calculation
  calculateBaseFare(
    distance: number,
    duration: number,
    vehicleType: VehicleType
  ): Promise<number>;
  estimateFare(request: FareEstimateRequest): Promise<FareEstimate>;
  calculateFinalFare(rideId: string): Promise<FareBreakdown>;

  // Dynamic pricing
  applySurgePricing(
    baseFare: number,
    location: GeoLocation,
    vehicleType: VehicleType
  ): Promise<number>;
  getCurrentSurgeMultiplier(
    location: GeoLocation,
    vehicleType: VehicleType
  ): Promise<number>;
  predictOptimalPricing(
    location: GeoLocation,
    timeWindow: TimeWindow
  ): Promise<PricingRecommendation>;

  // Promotions and discounts
  applyPromotions(fare: number, promotions: Promotion[]): Promise<number>;
  validatePromotion(
    promotionCode: string,
    userId: string,
    rideDetails: any
  ): Promise<boolean>;
  calculateDiscount(promotion: Promotion, fare: number): Promise<number>;

  // Driver earnings
  calculateDriverEarnings(
    fare: number,
    driverId: string
  ): Promise<DriverEarningsCalculation>;
  calculateCommission(fare: number, driverId: string): Promise<number>;

  // Configuration management
  updatePricingConfig(
    vehicleType: VehicleType,
    config: PricingConfig
  ): Promise<void>;
  getPricingConfig(vehicleType: VehicleType): Promise<PricingConfig>;
}

/**
 * Surge pricing management interface
 */
export interface SurgePricingManager {
  // Surge calculation
  calculateSurgeMultiplier(
    location: GeoLocation,
    vehicleType: VehicleType
  ): Promise<number>;
  activateSurge(
    area: string,
    multiplier: number,
    reason: string
  ): Promise<void>;
  deactivateSurge(area: string): Promise<void>;

  // Surge monitoring
  monitorDemandSupply(location: GeoLocation): Promise<DemandSupplyMetrics>;
  predictSurgeNeeds(
    location: GeoLocation,
    timeWindow: TimeWindow
  ): Promise<SurgePrediction>;

  // Surge configuration
  setSurgeRules(rules: SurgeRule[]): Promise<void>;
  getSurgeHistory(
    area: string,
    timeWindow: TimeWindow
  ): Promise<SurgePricing[]>;
}

export interface DemandSupplyMetrics {
  location: GeoLocation;
  currentDemand: number;
  currentSupply: number;
  ratio: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  recommendedAction:
    | 'increase_surge'
    | 'decrease_surge'
    | 'maintain'
    | 'no_action';
}

export interface SurgePrediction {
  location: GeoLocation;
  timeWindow: TimeWindow;
  predictedMultiplier: number;
  confidence: number;
  factors: SurgeFactor[];
}

export interface SurgeFactor {
  name: string;
  impact: number;
  description: string;
}

export interface SurgeRule {
  id: string;
  name: string;
  conditions: SurgeCondition[];
  multiplier: number;
  maxMultiplier: number;
  duration?: number; // minutes
  isActive: boolean;
}

export interface SurgeCondition {
  type: 'demand_ratio' | 'time_of_day' | 'day_of_week' | 'weather' | 'event';
  operator: 'greater_than' | 'less_than' | 'equals' | 'between';
  value: any;
}

export interface PricingRecommendation {
  location: GeoLocation;
  timeWindow: TimeWindow;
  recommendedMultiplier: number;
  expectedDemandChange: number;
  expectedRevenue: number;
  confidence: number;
  reasoning: string[];
}

/**
 * Promotion management interface
 */
export interface PromotionManager {
  // Promotion lifecycle
  createPromotion(
    promotion: Omit<Promotion, 'id' | 'usageCount'>
  ): Promise<Promotion>;
  updatePromotion(
    promotionId: string,
    updates: Partial<Promotion>
  ): Promise<Promotion>;
  deactivatePromotion(promotionId: string): Promise<void>;

  // Promotion validation and application
  validatePromotionCode(
    code: string,
    userId: string
  ): Promise<PromotionValidation>;
  applyPromotion(
    promotionId: string,
    userId: string,
    rideId: string
  ): Promise<PromotionApplication>;

  // Promotion analytics
  getPromotionUsage(promotionId: string): Promise<PromotionUsageStats>;
  getPromotionPerformance(promotionId: string): Promise<PromotionPerformance>;

  // User-specific promotions
  getAvailablePromotions(userId: string): Promise<Promotion[]>;
  getPersonalizedPromotions(userId: string): Promise<Promotion[]>;
}

export interface PromotionValidation {
  valid: boolean;
  promotion?: Promotion;
  discountAmount?: number;
  errors?: string[];
  restrictions?: string[];
}

export interface PromotionApplication {
  success: boolean;
  discountAmount: number;
  finalFare: number;
  usageId: string;
  appliedAt: Date;
}

export interface PromotionUsageStats {
  promotionId: string;
  totalUsage: number;
  uniqueUsers: number;
  totalDiscount: number;
  averageDiscount: number;
  usageByDay: DailyUsage[];
}

export interface DailyUsage {
  date: Date;
  usage: number;
  discount: number;
}

export interface PromotionPerformance {
  promotionId: string;
  roi: number;
  incrementalRides: number;
  customerAcquisition: number;
  customerRetention: number;
  revenueImpact: number;
}

/**
 * Payment processing interface
 */
export interface PaymentProcessor {
  // Payment processing
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
  processRefund(request: RefundRequest): Promise<RefundResult>;

  // Payment methods
  addPaymentMethod(userId: string, paymentMethod: any): Promise<string>;
  removePaymentMethod(userId: string, paymentMethodId: string): Promise<void>;
  getPaymentMethods(userId: string): Promise<any[]>;

  // Transaction management
  getTransaction(transactionId: string): Promise<Transaction>;
  getTransactionHistory(
    userId: string,
    timeWindow?: TimeWindow
  ): Promise<Transaction[]>;

  // Payout processing
  processDriverPayout(driverId: string, amount: number): Promise<PayoutResult>;
  getPayoutHistory(
    driverId: string,
    timeWindow?: TimeWindow
  ): Promise<Payout[]>;
}

export interface Transaction {
  id: string;
  userId: string;
  rideId: string;
  amount: number;
  currency: string;
  type: 'payment' | 'refund' | 'payout';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethodId?: string;
  processedAt?: Date;
  metadata?: Record<string, any>;
}

export interface PayoutResult {
  success: boolean;
  payoutId?: string;
  amount: number;
  estimatedArrival?: Date;
  error?: string;
}

export interface Payout {
  id: string;
  driverId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: string;
  processedAt?: Date;
  completedAt?: Date;
  error?: string;
}

/**
 * Pricing analytics interface
 */
export interface PricingAnalytics {
  // Revenue analytics
  getRevenueMetrics(timeWindow: TimeWindow): Promise<RevenueMetrics>;
  getRevenueByVehicleType(
    timeWindow: TimeWindow
  ): Promise<VehicleTypeRevenue[]>;
  getRevenueByRegion(timeWindow: TimeWindow): Promise<RegionRevenue[]>;

  // Pricing performance
  analyzePricingEffectiveness(
    timeWindow: TimeWindow
  ): Promise<PricingEffectiveness>;
  getSurgePerformance(timeWindow: TimeWindow): Promise<SurgePerformance>;
  getPromotionImpact(timeWindow: TimeWindow): Promise<PromotionImpact>;

  // Competitive analysis
  compareWithMarket(location: GeoLocation): Promise<MarketComparison>;
  analyzePriceElasticity(vehicleType: VehicleType): Promise<PriceElasticity>;

  // Forecasting
  forecastRevenue(timeWindow: TimeWindow): Promise<RevenueForecast>;
  forecastDemand(
    location: GeoLocation,
    priceChange: number
  ): Promise<DemandForecast>;
}

export interface RevenueMetrics {
  timeWindow: TimeWindow;
  totalRevenue: number;
  averageRevenue: number;
  revenueGrowth: number;
  rideCount: number;
  averageFare: number;
}

export interface VehicleTypeRevenue {
  vehicleType: VehicleType;
  revenue: number;
  rideCount: number;
  averageFare: number;
  marketShare: number;
}

export interface RegionRevenue {
  region: string;
  revenue: number;
  rideCount: number;
  averageFare: number;
  growth: number;
}

export interface PricingEffectiveness {
  overallScore: number;
  revenueOptimization: number;
  demandCapture: number;
  competitiveness: number;
  recommendations: string[];
}

export interface SurgePerformance {
  totalSurgeRevenue: number;
  surgePercentage: number;
  averageMultiplier: number;
  demandResponse: number;
  supplyResponse: number;
  effectiveness: number;
}

export interface PromotionImpact {
  totalDiscount: number;
  incrementalRevenue: number;
  customerAcquisition: number;
  roi: number;
  effectiveness: number;
}

export interface MarketComparison {
  location: GeoLocation;
  ourPricing: number;
  marketAverage: number;
  competitorPricing: CompetitorPrice[];
  positionRanking: number;
  recommendations: string[];
}

export interface CompetitorPrice {
  competitor: string;
  price: number;
  vehicleType: VehicleType;
  features: string[];
}

export interface PriceElasticity {
  vehicleType: VehicleType;
  elasticity: number;
  optimalPrice: number;
  demandCurve: DemandPoint[];
  recommendations: string[];
}

export interface DemandPoint {
  price: number;
  demand: number;
  revenue: number;
}

export interface RevenueForecast {
  timeWindow: TimeWindow;
  forecastedRevenue: number;
  confidence: number;
  factors: ForecastFactor[];
  scenarios: RevenueScenario[];
}

export interface ForecastFactor {
  name: string;
  impact: number;
  confidence: number;
}

export interface RevenueScenario {
  name: string;
  probability: number;
  revenue: number;
  description: string;
}

export interface DemandForecast {
  location: GeoLocation;
  priceChange: number;
  forecastedDemand: number;
  demandChange: number;
  confidence: number;
}
