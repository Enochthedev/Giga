import {
  Driver,
  DriverMatch,
  DriverResponse,
  MatchResult,
  NearbyDriver,
  RideRequest,
} from '@/types';
import { GeoLocation, TimeWindow } from '@/types/common.types';

/**
 * Driver matching engine interface
 */
export interface MatchingEngine {
  // Core matching functionality
  findOptimalDriver(request: RideRequest): Promise<DriverMatch>;
  calculateMatchScore(driver: Driver, request: RideRequest): Promise<number>;
  handleDriverResponse(
    driverId: string,
    rideId: string,
    response: DriverResponse
  ): Promise<MatchResult>;

  // Advanced matching
  findAlternativeDrivers(
    request: RideRequest,
    excludeDriverIds: string[]
  ): Promise<DriverMatch[]>;
  optimizeMatching(
    activeRequests: RideRequest[]
  ): Promise<MatchingOptimization>;

  // Demand prediction
  predictDemand(
    location: GeoLocation,
    timeWindow: TimeWindow
  ): Promise<DemandPrediction>;
  balanceSupplyDemand(area: GeoArea): Promise<SupplyDemandBalance>;

  // Matching configuration
  updateMatchingRules(rules: MatchingRule[]): Promise<void>;
  getMatchingMetrics(): Promise<MatchingMetrics>;
}

/**
 * Matching optimization results
 */
export interface MatchingOptimization {
  totalRequests: number;
  matchedRequests: number;
  averageMatchTime: number;
  optimizationScore: number;
  recommendations: OptimizationRecommendation[];
}

export interface OptimizationRecommendation {
  type: 'driver_relocation' | 'pricing_adjustment' | 'supply_increase';
  description: string;
  impact: number;
  location?: GeoLocation;
  parameters?: Record<string, any>;
}

/**
 * Demand prediction interface
 */
export interface DemandPrediction {
  location: GeoLocation;
  timeWindow: TimeWindow;
  predictedDemand: number;
  confidence: number;
  factors: DemandFactor[];
  historicalData: HistoricalDemandData[];
}

export interface DemandFactor {
  name: string;
  impact: number;
  confidence: number;
  description: string;
}

export interface HistoricalDemandData {
  timestamp: Date;
  demand: number;
  actualFulfillment: number;
}

/**
 * Supply and demand balance
 */
export interface SupplyDemandBalance {
  area: GeoArea;
  currentSupply: number;
  currentDemand: number;
  ratio: number;
  status: BalanceStatus;
  recommendations: BalanceRecommendation[];
}

export interface GeoArea {
  center: GeoLocation;
  radius: number;
  name?: string;
}

export enum BalanceStatus {
  BALANCED = 'balanced',
  OVERSUPPLY = 'oversupply',
  UNDERSUPPLY = 'undersupply',
  CRITICAL_SHORTAGE = 'critical_shortage',
}

export interface BalanceRecommendation {
  action:
    | 'increase_supply'
    | 'reduce_supply'
    | 'adjust_pricing'
    | 'redirect_drivers';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  expectedImpact: number;
}

/**
 * Matching rules and configuration
 */
export interface MatchingRule {
  id: string;
  name: string;
  description: string;
  conditions: MatchingCondition[];
  actions: MatchingAction[];
  priority: number;
  isActive: boolean;
}

export interface MatchingCondition {
  field: string;
  operator:
    | 'equals'
    | 'not_equals'
    | 'greater_than'
    | 'less_than'
    | 'in'
    | 'not_in';
  value: any;
  weight?: number;
}

export interface MatchingAction {
  type: 'boost_score' | 'penalty_score' | 'exclude' | 'prioritize';
  value: number;
  description: string;
}

/**
 * Matching metrics and analytics
 */
export interface MatchingMetrics {
  timeWindow: TimeWindow;
  totalMatches: number;
  successfulMatches: number;
  averageMatchTime: number;
  averageDriverDistance: number;
  driverAcceptanceRate: number;
  passengerCancellationRate: number;
  matchQualityScore: number;
  performanceByVehicleType: VehicleTypeMatchingMetrics[];
  performanceByTimeOfDay: TimeOfDayMatchingMetrics[];
}

export interface VehicleTypeMatchingMetrics {
  vehicleType: string;
  totalRequests: number;
  matchedRequests: number;
  averageMatchTime: number;
  successRate: number;
}

export interface TimeOfDayMatchingMetrics {
  hour: number;
  totalRequests: number;
  matchedRequests: number;
  averageMatchTime: number;
  averageWaitTime: number;
}

/**
 * Driver scoring and ranking
 */
export interface DriverScoring {
  calculateDriverScore(
    driver: Driver,
    request: RideRequest
  ): Promise<DriverScore>;
  updateDriverRanking(
    driverId: string,
    performance: DriverPerformance
  ): Promise<void>;
  getTopDrivers(location: GeoLocation, limit: number): Promise<RankedDriver[]>;
}

export interface DriverScore {
  driverId: string;
  totalScore: number;
  components: ScoreComponent[];
  rank: number;
  eligibility: DriverEligibility;
}

export interface ScoreComponent {
  name: string;
  score: number;
  weight: number;
  description: string;
}

export interface DriverEligibility {
  eligible: boolean;
  reasons?: string[];
  restrictions?: string[];
}

export interface DriverPerformance {
  acceptanceRate: number;
  completionRate: number;
  averageRating: number;
  responseTime: number;
  onTimePercentage: number;
  cancellationRate: number;
}

export interface RankedDriver {
  driver: Driver;
  score: number;
  rank: number;
  distance: number;
  estimatedArrival: number;
}

/**
 * Real-time matching events
 */
export interface MatchingEventHandler {
  onRideRequested(request: RideRequest): Promise<void>;
  onDriverFound(match: DriverMatch): Promise<void>;
  onDriverAccepted(driverId: string, rideId: string): Promise<void>;
  onDriverRejected(
    driverId: string,
    rideId: string,
    reason: string
  ): Promise<void>;
  onMatchTimeout(rideId: string): Promise<void>;
  onMatchFailed(rideId: string, reason: string): Promise<void>;
}

/**
 * Matching strategy interface
 */
export interface MatchingStrategy {
  name: string;
  description: string;
  execute(
    request: RideRequest,
    availableDrivers: NearbyDriver[]
  ): Promise<DriverMatch[]>;
  configure(parameters: Record<string, any>): void;
  getMetrics(): StrategyMetrics;
}

export interface StrategyMetrics {
  successRate: number;
  averageMatchTime: number;
  driverSatisfaction: number;
  passengerSatisfaction: number;
  efficiency: number;
}

/**
 * Batch matching for high-demand scenarios
 */
export interface BatchMatching {
  processBatch(requests: RideRequest[]): Promise<BatchMatchingResult>;
  optimizeBatchAssignment(
    matches: DriverMatch[]
  ): Promise<OptimizedBatchResult>;
}

export interface BatchMatchingResult {
  totalRequests: number;
  matchedRequests: number;
  unmatchedRequests: RideRequest[];
  matches: DriverMatch[];
  processingTime: number;
}

export interface OptimizedBatchResult {
  originalMatches: DriverMatch[];
  optimizedMatches: DriverMatch[];
  improvementScore: number;
  optimizationTime: number;
}
