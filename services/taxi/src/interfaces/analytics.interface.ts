import {
  DemandSupplyAnalytics,
  DriverAnalytics,
  FinancialAnalytics,
  OperationalAnalytics,
  PredictiveAnalytics,
  RideAnalytics,
} from '@/types/analytics.types';
import { GeoLocation, TimeWindow } from '@/types/common.types';
import { VehicleType } from '@/types/ride.types';

/**
 * Core analytics service interface
 */
export interface AnalyticsService {
  // Ride analytics
  getRideAnalytics(
    timeWindow: TimeWindow,
    filters?: AnalyticsFilters
  ): Promise<RideAnalytics>;
  getDriverAnalytics(
    driverId: string,
    timeWindow: TimeWindow
  ): Promise<DriverAnalytics>;

  // Business analytics
  getDemandSupplyAnalytics(
    area?: GeoLocation,
    timeWindow?: TimeWindow
  ): Promise<DemandSupplyAnalytics>;
  getFinancialAnalytics(timeWindow: TimeWindow): Promise<FinancialAnalytics>;
  getOperationalAnalytics(
    timeWindow: TimeWindow
  ): Promise<OperationalAnalytics>;

  // Predictive analytics
  getPredictiveAnalytics(
    area?: GeoLocation,
    timeWindow?: TimeWindow
  ): Promise<PredictiveAnalytics>;

  // Custom reports
  generateCustomReport(reportConfig: ReportConfig): Promise<CustomReport>;
  scheduleReport(
    reportConfig: ReportConfig,
    schedule: ReportSchedule
  ): Promise<string>;
}

export interface AnalyticsFilters {
  vehicleTypes?: VehicleType[];
  regions?: string[];
  driverIds?: string[];
  passengerIds?: string[];
  minFare?: number;
  maxFare?: number;
  rideStatuses?: string[];
}

/**
 * Real-time analytics interface
 */
export interface RealTimeAnalytics {
  // Live metrics
  getLiveMetrics(): Promise<LiveMetrics>;
  getDashboardData(): Promise<DashboardData>;
  getAlerts(): Promise<AnalyticsAlert[]>;

  // Real-time monitoring
  monitorKPIs(kpis: string[]): Promise<void>;
  setAlertThresholds(thresholds: AlertThreshold[]): Promise<void>;

  // Live data streams
  subscribeToMetrics(
    metrics: string[],
    callback: (data: any) => void
  ): Promise<string>;
  unsubscribeFromMetrics(subscriptionId: string): Promise<void>;
}

export interface LiveMetrics {
  timestamp: Date;
  activeRides: number;
  availableDrivers: number;
  requestsPerMinute: number;
  averageWaitTime: number;
  systemLoad: number;
  revenue: LiveRevenueMetrics;
}

export interface LiveRevenueMetrics {
  hourly: number;
  daily: number;
  monthly: number;
  growth: number;
}

export interface DashboardData {
  summary: MetricsSummary;
  charts: ChartData[];
  tables: TableData[];
  maps: MapData[];
}

export interface MetricsSummary {
  totalRides: number;
  totalRevenue: number;
  activeDrivers: number;
  customerSatisfaction: number;
  systemUptime: number;
}

export interface ChartData {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'area';
  title: string;
  data: any[];
  config: ChartConfig;
}

export interface ChartConfig {
  xAxis?: string;
  yAxis?: string;
  colors?: string[];
  legend?: boolean;
  responsive?: boolean;
}

export interface TableData {
  id: string;
  title: string;
  headers: string[];
  rows: any[][];
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
}

export interface MapData {
  id: string;
  title: string;
  center: GeoLocation;
  zoom: number;
  layers: MapLayer[];
}

export interface MapLayer {
  type: 'heatmap' | 'markers' | 'polygons';
  data: any[];
  style: any;
}

export interface AnalyticsAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  metric: string;
  threshold: number;
  currentValue: number;
  timestamp: Date;
  acknowledged: boolean;
}

export interface AlertThreshold {
  metric: string;
  operator: 'greater_than' | 'less_than' | 'equals';
  value: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Business intelligence interface
 */
export interface BusinessIntelligence {
  // Market analysis
  analyzeMarketTrends(timeWindow: TimeWindow): Promise<MarketTrends>;
  getCompetitiveAnalysis(area?: GeoLocation): Promise<CompetitiveAnalysis>;

  // Customer analytics
  analyzeCustomerBehavior(timeWindow: TimeWindow): Promise<CustomerBehavior>;
  getCustomerSegmentation(): Promise<CustomerSegmentation>;
  calculateCustomerLifetimeValue(customerId?: string): Promise<CustomerLTV>;

  // Driver analytics
  analyzeDriverPerformance(
    timeWindow: TimeWindow
  ): Promise<DriverPerformanceAnalysis>;
  getDriverRetentionAnalysis(timeWindow: TimeWindow): Promise<DriverRetention>;

  // Operational efficiency
  analyzeOperationalEfficiency(
    timeWindow: TimeWindow
  ): Promise<OperationalEfficiency>;
  identifyBottlenecks(): Promise<SystemBottleneck[]>;

  // Financial insights
  getFinancialInsights(timeWindow: TimeWindow): Promise<FinancialInsights>;
  analyzeProfitability(
    dimension: 'region' | 'vehicle_type' | 'time'
  ): Promise<ProfitabilityAnalysis>;
}

export interface MarketTrends {
  timeWindow: TimeWindow;
  demandTrend: TrendData;
  pricingTrend: TrendData;
  competitionTrend: TrendData;
  marketShare: number;
  growthRate: number;
  seasonality: SeasonalityData[];
}

export interface TrendData {
  direction: 'up' | 'down' | 'stable';
  magnitude: number;
  confidence: number;
  dataPoints: DataPoint[];
}

export interface DataPoint {
  timestamp: Date;
  value: number;
}

export interface SeasonalityData {
  period: string;
  pattern: 'weekly' | 'monthly' | 'yearly';
  strength: number;
  peaks: Date[];
  troughs: Date[];
}

export interface CompetitiveAnalysis {
  marketPosition: number;
  competitors: CompetitorData[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface CompetitorData {
  name: string;
  marketShare: number;
  pricing: number;
  serviceQuality: number;
  coverage: number;
}

export interface CustomerBehavior {
  timeWindow: TimeWindow;
  averageRidesPerUser: number;
  averageSpendPerUser: number;
  retentionRate: number;
  churnRate: number;
  usagePatterns: UsagePattern[];
  preferences: CustomerPreference[];
}

export interface UsagePattern {
  pattern: string;
  frequency: number;
  timeOfDay: string[];
  dayOfWeek: string[];
  locations: GeoLocation[];
}

export interface CustomerPreference {
  category: string;
  preference: string;
  percentage: number;
}

export interface CustomerSegmentation {
  segments: CustomerSegment[];
  segmentationCriteria: string[];
  totalCustomers: number;
}

export interface CustomerSegment {
  id: string;
  name: string;
  size: number;
  percentage: number;
  characteristics: SegmentCharacteristic[];
  value: number;
  growth: number;
}

export interface SegmentCharacteristic {
  attribute: string;
  value: any;
  importance: number;
}

export interface CustomerLTV {
  customerId?: string;
  averageLTV: number;
  ltv: number;
  acquisitionCost: number;
  retentionRate: number;
  averageLifespan: number;
  projectedValue: number;
}

export interface DriverPerformanceAnalysis {
  timeWindow: TimeWindow;
  totalDrivers: number;
  activeDrivers: number;
  averagePerformanceScore: number;
  topPerformers: DriverPerformanceMetric[];
  underperformers: DriverPerformanceMetric[];
  performanceDistribution: PerformanceDistribution[];
}

export interface DriverPerformanceMetric {
  driverId: string;
  name: string;
  score: number;
  rides: number;
  earnings: number;
  rating: number;
  efficiency: number;
}

export interface PerformanceDistribution {
  scoreRange: string;
  driverCount: number;
  percentage: number;
}

export interface DriverRetention {
  timeWindow: TimeWindow;
  retentionRate: number;
  churnRate: number;
  averageTenure: number;
  retentionBySegment: RetentionSegment[];
  churnReasons: ChurnReason[];
}

export interface RetentionSegment {
  segment: string;
  retentionRate: number;
  driverCount: number;
}

export interface ChurnReason {
  reason: string;
  frequency: number;
  percentage: number;
}

export interface OperationalEfficiency {
  timeWindow: TimeWindow;
  overallEfficiency: number;
  matchingEfficiency: number;
  routeEfficiency: number;
  resourceUtilization: number;
  systemPerformance: SystemPerformanceMetrics;
  recommendations: EfficiencyRecommendation[];
}

export interface SystemPerformanceMetrics {
  uptime: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
  scalability: number;
}

export interface EfficiencyRecommendation {
  area: string;
  recommendation: string;
  impact: number;
  effort: number;
  priority: 'low' | 'medium' | 'high';
}

export interface SystemBottleneck {
  component: string;
  severity: number;
  impact: string;
  cause: string;
  solution: string;
  estimatedResolution: number;
}

export interface FinancialInsights {
  timeWindow: TimeWindow;
  revenueGrowth: number;
  profitMargin: number;
  costStructure: CostBreakdown[];
  revenueStreams: RevenueStream[];
  financialHealth: FinancialHealthMetric[];
  recommendations: FinancialRecommendation[];
}

export interface CostBreakdown {
  category: string;
  amount: number;
  percentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface RevenueStream {
  source: string;
  amount: number;
  percentage: number;
  growth: number;
}

export interface FinancialHealthMetric {
  metric: string;
  value: number;
  benchmark: number;
  status: 'good' | 'warning' | 'poor';
}

export interface FinancialRecommendation {
  category: string;
  recommendation: string;
  impact: number;
  timeframe: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ProfitabilityAnalysis {
  dimension: string;
  segments: ProfitabilitySegment[];
  totalProfit: number;
  averageMargin: number;
  mostProfitable: string;
  leastProfitable: string;
}

export interface ProfitabilitySegment {
  segment: string;
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
  volume: number;
}

/**
 * Report generation interface
 */
export interface ReportGenerator {
  // Report creation
  createReport(config: ReportConfig): Promise<Report>;
  generateScheduledReports(): Promise<void>;

  // Report management
  getReport(reportId: string): Promise<Report>;
  getReportHistory(userId: string): Promise<Report[]>;
  deleteReport(reportId: string): Promise<void>;

  // Report sharing
  shareReport(reportId: string, recipients: string[]): Promise<void>;
  exportReport(
    reportId: string,
    format: 'pdf' | 'excel' | 'csv'
  ): Promise<string>;
}

export interface ReportConfig {
  name: string;
  description?: string;
  type: 'operational' | 'financial' | 'driver' | 'customer' | 'custom';
  timeWindow: TimeWindow;
  filters?: AnalyticsFilters;
  metrics: string[];
  visualizations: VisualizationConfig[];
  format: 'dashboard' | 'pdf' | 'excel';
}

export interface VisualizationConfig {
  type: 'chart' | 'table' | 'map' | 'kpi';
  title: string;
  data: string;
  config: any;
}

export interface Report {
  id: string;
  name: string;
  type: string;
  generatedAt: Date;
  generatedBy: string;
  data: ReportData;
  metadata: ReportMetadata;
}

export interface ReportData {
  summary: any;
  sections: ReportSection[];
  appendices?: any[];
}

export interface ReportSection {
  title: string;
  content: any;
  visualizations: any[];
}

export interface ReportMetadata {
  timeWindow: TimeWindow;
  filters: AnalyticsFilters;
  dataPoints: number;
  accuracy: number;
  generationTime: number;
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  time: string;
  timezone: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'dashboard_link';
}

export interface CustomReport {
  id: string;
  config: ReportConfig;
  data: unknown;
  generatedAt: Date;
  downloadUrl?: string;
}
