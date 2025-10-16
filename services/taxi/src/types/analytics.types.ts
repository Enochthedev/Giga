import { Distance, Duration, GeoLocation, TimeWindow } from './common.types';
import { VehicleType } from './ride.types';

// Analytics and reporting types
export interface RideAnalytics {
  timeWindow: TimeWindow;
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  averageRideDistance: Distance;
  averageRideDuration: Duration;
  averageFare: number;
  totalRevenue: number;
  peakHours: PeakHourData[];
  popularRoutes: PopularRoute[];
  vehicleTypeDistribution: VehicleTypeStats[];
}

export interface PeakHourData {
  hour: number; // 0-23
  rideCount: number;
  averageWaitTime: Duration;
  surgeMultiplier: number;
}

export interface PopularRoute {
  origin: GeoLocation;
  destination: GeoLocation;
  rideCount: number;
  averageFare: number;
  averageDuration: Duration;
  rank: number;
}

export interface VehicleTypeStats {
  vehicleType: VehicleType;
  rideCount: number;
  revenue: number;
  averageFare: number;
  marketShare: number;
}

// Driver analytics
export interface DriverAnalytics {
  driverId: string;
  timeWindow: TimeWindow;
  performance: DriverPerformance;
  earnings: DriverEarningsAnalytics;
  efficiency: DriverEfficiency;
  safety: DriverSafetyAnalytics;
  customerSatisfaction: CustomerSatisfactionMetrics;
}

export interface DriverPerformance {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  acceptanceRate: number;
  completionRate: number;
  averageResponseTime: Duration;
  onTimePercentage: number;
  hoursOnline: number;
  hoursOnRide: number;
  utilizationRate: number;
}

export interface DriverEarningsAnalytics {
  totalEarnings: number;
  averageEarningsPerRide: number;
  averageEarningsPerHour: number;
  earningsBreakdown: {
    baseFares: number;
    tips: number;
    bonuses: number;
    surgeEarnings: number;
  };
  earningsTrend: EarningsTrendData[];
}

export interface EarningsTrendData {
  date: Date;
  earnings: number;
  rides: number;
  hours: number;
}

export interface DriverEfficiency {
  averagePickupTime: Duration;
  averageDropoffTime: Duration;
  fuelEfficiency?: number;
  routeOptimizationScore: number;
  idleTimePercentage: number;
  milesPerRide: number;
}

export interface DriverSafetyAnalytics {
  safetyScore: number;
  incidentCount: number;
  trafficViolations: number;
  speedingIncidents: number;
  harshBrakingEvents: number;
  rapidAccelerationEvents: number;
  safetyTrainingCompleted: number;
}

export interface CustomerSatisfactionMetrics {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: RatingDistribution[];
  compliments: ComplimentStats[];
  complaints: ComplaintStats[];
}

export interface RatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}

export interface ComplimentStats {
  type: string;
  count: number;
}

export interface ComplaintStats {
  type: string;
  count: number;
  resolved: number;
}

// Demand and supply analytics
export interface DemandSupplyAnalytics {
  area: string;
  timeWindow: TimeWindow;
  demandMetrics: DemandMetrics;
  supplyMetrics: SupplyMetrics;
  matchingEfficiency: MatchingEfficiency;
  priceElasticity: PriceElasticity;
}

export interface DemandMetrics {
  totalRequests: number;
  fulfilledRequests: number;
  unfulfilledRequests: number;
  averageWaitTime: Duration;
  peakDemandHours: number[];
  demandByVehicleType: VehicleTypeDemand[];
  demandHeatmap: DemandHeatmapData[];
}

export interface VehicleTypeDemand {
  vehicleType: VehicleType;
  requests: number;
  fulfillmentRate: number;
  averageWaitTime: Duration;
}

export interface DemandHeatmapData {
  location: GeoLocation;
  demandLevel: number;
  timeSlot: string;
}

export interface SupplyMetrics {
  activeDrivers: number;
  availableDrivers: number;
  busyDrivers: number;
  averageUtilization: number;
  supplyByVehicleType: VehicleTypeSupply[];
  supplyDistribution: SupplyDistributionData[];
}

export interface VehicleTypeSupply {
  vehicleType: VehicleType;
  activeDrivers: number;
  utilizationRate: number;
  averageEarnings: number;
}

export interface SupplyDistributionData {
  location: GeoLocation;
  driverCount: number;
  utilizationRate: number;
}

export interface MatchingEfficiency {
  averageMatchTime: Duration;
  matchSuccessRate: number;
  driverAcceptanceRate: number;
  passengerCancellationRate: number;
  optimalMatchPercentage: number;
}

export interface PriceElasticity {
  surgeMultiplier: number;
  demandChange: number;
  supplyChange: number;
  elasticityCoefficient: number;
}

// Financial analytics
export interface FinancialAnalytics {
  timeWindow: TimeWindow;
  revenue: RevenueAnalytics;
  costs: CostAnalytics;
  profitability: ProfitabilityAnalytics;
  payouts: PayoutAnalytics;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  revenueByVehicleType: VehicleTypeRevenue[];
  revenueByRegion: RegionRevenue[];
  revenueTrend: RevenueTrendData[];
  averageRevenuePerRide: number;
  surgeRevenue: number;
  surgePercentage: number;
}

export interface VehicleTypeRevenue {
  vehicleType: VehicleType;
  revenue: number;
  rideCount: number;
  marketShare: number;
}

export interface RegionRevenue {
  region: string;
  revenue: number;
  rideCount: number;
  averageFare: number;
}

export interface RevenueTrendData {
  date: Date;
  revenue: number;
  rideCount: number;
  averageFare: number;
}

export interface CostAnalytics {
  totalCosts: number;
  operationalCosts: number;
  marketingCosts: number;
  technologyCosts: number;
  supportCosts: number;
  costPerRide: number;
  costTrend: CostTrendData[];
}

export interface CostTrendData {
  date: Date;
  totalCosts: number;
  costPerRide: number;
}

export interface ProfitabilityAnalytics {
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  profitPerRide: number;
  profitByRegion: RegionProfitability[];
  profitTrend: ProfitTrendData[];
}

export interface RegionProfitability {
  region: string;
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
}

export interface ProfitTrendData {
  date: Date;
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
}

export interface PayoutAnalytics {
  totalPayouts: number;
  averagePayoutPerDriver: number;
  payoutsByVehicleType: VehicleTypePayout[];
  payoutTrend: PayoutTrendData[];
}

export interface VehicleTypePayout {
  vehicleType: VehicleType;
  totalPayouts: number;
  driverCount: number;
  averagePayout: number;
}

export interface PayoutTrendData {
  date: Date;
  totalPayouts: number;
  driverCount: number;
  averagePayout: number;
}

// Operational analytics
export interface OperationalAnalytics {
  timeWindow: TimeWindow;
  systemPerformance: SystemPerformance;
  serviceQuality: ServiceQuality;
  customerExperience: CustomerExperience;
  driverExperience: DriverExperience;
}

export interface SystemPerformance {
  averageResponseTime: Duration;
  systemUptime: number;
  errorRate: number;
  throughput: number;
  peakLoad: number;
  resourceUtilization: ResourceUtilization;
}

export interface ResourceUtilization {
  cpuUsage: number;
  memoryUsage: number;
  databaseConnections: number;
  cacheHitRate: number;
}

export interface ServiceQuality {
  averageWaitTime: Duration;
  onTimePerformance: number;
  serviceReliability: number;
  customerSatisfactionScore: number;
  complaintRate: number;
  resolutionTime: Duration;
}

export interface CustomerExperience {
  appUsageMetrics: AppUsageMetrics;
  bookingConversionRate: number;
  repeatCustomerRate: number;
  customerLifetimeValue: number;
  churnRate: number;
}

export interface AppUsageMetrics {
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  averageSessionDuration: Duration;
  screenViews: ScreenViewData[];
  featureUsage: FeatureUsageData[];
}

export interface ScreenViewData {
  screenName: string;
  viewCount: number;
  averageTimeSpent: Duration;
}

export interface FeatureUsageData {
  featureName: string;
  usageCount: number;
  userCount: number;
  adoptionRate: number;
}

export interface DriverExperience {
  driverSatisfactionScore: number;
  driverRetentionRate: number;
  averageDriverTenure: Duration;
  driverChurnRate: number;
  supportTicketVolume: number;
  averageResolutionTime: Duration;
}

// Predictive analytics
export interface PredictiveAnalytics {
  demandForecast: DemandForecast[];
  supplyOptimization: SupplyOptimization[];
  pricingRecommendations: PricingRecommendation[];
  riskAssessment: RiskAssessment;
}

export interface DemandForecast {
  location: GeoLocation;
  timeSlot: Date;
  predictedDemand: number;
  confidence: number;
  factors: ForecastFactor[];
}

export interface ForecastFactor {
  name: string;
  impact: number;
  confidence: number;
}

export interface SupplyOptimization {
  location: GeoLocation;
  timeSlot: Date;
  recommendedDrivers: number;
  currentDrivers: number;
  expectedUtilization: number;
}

export interface PricingRecommendation {
  location: GeoLocation;
  timeSlot: Date;
  recommendedMultiplier: number;
  expectedDemandChange: number;
  expectedRevenue: number;
  confidence: number;
}

export interface RiskAssessment {
  overallRiskScore: number;
  riskFactors: RiskFactor[];
  recommendations: string[];
  lastUpdated: Date;
}

export interface RiskFactor {
  category: string;
  description: string;
  probability: number;
  impact: number;
  riskScore: number;
  mitigation: string[];
}
