import {
  Distance,
  Duration,
  ETACalculation,
  GeoLocation,
  LocationResult,
  LocationSearch,
  LocationUpdate,
  Route,
  ServiceArea,
  TimeWindow,
} from '@/types';
import { NearbyDriver } from '@/types/driver.types';
import { RideTracking } from '@/types/ride.types';

/**
 * Location service interface for managing geospatial operations
 */
export interface LocationService {
  // Location tracking
  updateLocation(userId: string, location: GeoLocation): Promise<void>;
  getLocation(userId: string): Promise<GeoLocation | null>;
  getLocationHistory(
    userId: string,
    timeWindow: TimeWindow
  ): Promise<LocationUpdate[]>;

  // Distance and route calculations
  calculateDistance(from: GeoLocation, to: GeoLocation): Promise<Distance>;
  calculateRoute(
    from: GeoLocation,
    to: GeoLocation,
    options?: RouteOptions
  ): Promise<Route>;
  calculateETA(from: GeoLocation, to: GeoLocation): Promise<ETACalculation>;

  // Geospatial queries
  findNearbyDrivers(
    location: GeoLocation,
    radius: number
  ): Promise<NearbyDriver[]>;
  findNearbyLocations(
    location: GeoLocation,
    type: string,
    radius: number
  ): Promise<LocationResult[]>;
  isWithinServiceArea(location: GeoLocation): Promise<boolean>;
  getServiceArea(location: GeoLocation): Promise<ServiceArea | null>;

  // Real-time tracking
  startTracking(rideId: string): Promise<void>;
  stopTracking(rideId: string): Promise<void>;
  getRideTracking(rideId: string): Promise<RideTracking | null>;

  // Location search and geocoding
  searchLocations(query: LocationSearch): Promise<LocationResult[]>;
  geocodeAddress(address: string): Promise<GeoLocation>;
  reverseGeocode(location: GeoLocation): Promise<string>;
}

/**
 * Route optimization interface
 */
export interface RouteOptimization {
  // Route planning
  findOptimalRoute(
    from: GeoLocation,
    to: GeoLocation,
    options?: RouteOptions
  ): Promise<Route>;
  findAlternativeRoutes(
    from: GeoLocation,
    to: GeoLocation,
    count: number
  ): Promise<Route[]>;
  optimizeMultiStopRoute(stops: GeoLocation[]): Promise<Route>;

  // Traffic and conditions
  getTrafficConditions(route: Route): Promise<TrafficInfo[]>;
  adjustRouteForTraffic(route: Route): Promise<Route>;
  predictTrafficConditions(
    route: Route,
    departureTime: Date
  ): Promise<TrafficPrediction>;

  // Route monitoring
  monitorRouteProgress(rideId: string, route: Route): Promise<RouteProgress>;
  detectRouteDeviation(
    rideId: string,
    expectedRoute: Route
  ): Promise<RouteDeviation | null>;
  suggestRouteCorrection(
    currentLocation: GeoLocation,
    targetRoute: Route
  ): Promise<Route>;
}

export interface RouteOptions {
  avoidTolls?: boolean;
  avoidHighways?: boolean;
  optimizeFor?: 'time' | 'distance' | 'fuel';
  vehicleType?: string;
  departureTime?: Date;
  trafficModel?: 'best_guess' | 'pessimistic' | 'optimistic';
}

export interface TrafficInfo {
  location: GeoLocation;
  severity: 'light' | 'moderate' | 'heavy' | 'severe';
  type: 'congestion' | 'accident' | 'construction' | 'closure';
  description: string;
  estimatedDelay: Duration;
  startTime?: Date;
  endTime?: Date;
}

export interface TrafficPrediction {
  route: Route;
  predictedConditions: TrafficInfo[];
  confidence: number;
  alternativeRoutes: Route[];
}

export interface RouteProgress {
  rideId: string;
  currentLocation: GeoLocation;
  completedDistance: Distance;
  remainingDistance: Distance;
  completedTime: Duration;
  estimatedRemainingTime: Duration;
  progressPercentage: number;
  onSchedule: boolean;
}

export interface RouteDeviation {
  rideId: string;
  deviationPoint: GeoLocation;
  deviationDistance: Distance;
  deviationType: 'minor' | 'major' | 'significant';
  possibleReasons: string[];
  suggestedAction: string;
}

/**
 * Geofencing interface
 */
export interface GeofencingService {
  // Geofence management
  createGeofence(area: ServiceArea): Promise<string>;
  updateGeofence(geofenceId: string, area: ServiceArea): Promise<void>;
  deleteGeofence(geofenceId: string): Promise<void>;
  getGeofence(geofenceId: string): Promise<ServiceArea | null>;

  // Geofence monitoring
  checkGeofenceEntry(
    userId: string,
    location: GeoLocation
  ): Promise<GeofenceEvent[]>;
  checkGeofenceExit(
    userId: string,
    location: GeoLocation
  ): Promise<GeofenceEvent[]>;
  monitorGeofences(userId: string): Promise<void>;
  stopMonitoring(userId: string): Promise<void>;

  // Geofence queries
  findGeofencesContaining(location: GeoLocation): Promise<ServiceArea[]>;
  findNearbyGeofences(
    location: GeoLocation,
    radius: number
  ): Promise<ServiceArea[]>;
}

export interface GeofenceEvent {
  geofenceId: string;
  userId: string;
  eventType: 'entry' | 'exit';
  location: GeoLocation;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Location analytics interface
 */
export interface LocationAnalytics {
  // Demand analysis
  analyzeDemandPatterns(
    area: ServiceArea,
    timeWindow: TimeWindow
  ): Promise<DemandAnalysis>;
  generateHeatmap(
    area: ServiceArea,
    timeWindow: TimeWindow
  ): Promise<DemandHeatmap>;
  identifyHotspots(area: ServiceArea): Promise<Hotspot[]>;

  // Supply analysis
  analyzeDriverDistribution(area: ServiceArea): Promise<SupplyAnalysis>;
  identifySupplyGaps(area: ServiceArea): Promise<SupplyGap[]>;
  optimizeDriverPositioning(
    area: ServiceArea
  ): Promise<PositioningRecommendation[]>;

  // Route analysis
  analyzePopularRoutes(timeWindow: TimeWindow): Promise<PopularRoute[]>;
  identifyTrafficPatterns(area: ServiceArea): Promise<TrafficPattern[]>;
  calculateRouteEfficiency(routes: Route[]): Promise<RouteEfficiencyMetrics>;
}

export interface DemandAnalysis {
  area: ServiceArea;
  timeWindow: TimeWindow;
  totalDemand: number;
  peakHours: PeakHour[];
  demandDistribution: DemandDistribution[];
  trends: DemandTrend[];
}

export interface PeakHour {
  hour: number;
  demandLevel: number;
  averageWaitTime: Duration;
}

export interface DemandDistribution {
  location: GeoLocation;
  demandCount: number;
  percentage: number;
}

export interface DemandTrend {
  date: Date;
  demand: number;
  growth: number;
}

export interface DemandHeatmap {
  area: ServiceArea;
  gridSize: number;
  dataPoints: HeatmapPoint[];
  intensity: 'low' | 'medium' | 'high' | 'extreme';
}

export interface HeatmapPoint {
  location: GeoLocation;
  intensity: number;
  demandCount: number;
  supplyCount: number;
}

export interface Hotspot {
  location: GeoLocation;
  radius: number;
  demandLevel: number;
  supplyLevel: number;
  imbalanceScore: number;
  recommendations: string[];
}

export interface SupplyAnalysis {
  area: ServiceArea;
  totalDrivers: number;
  activeDrivers: number;
  utilizationRate: number;
  distribution: SupplyDistribution[];
  coverage: CoverageMetrics;
}

export interface SupplyDistribution {
  location: GeoLocation;
  driverCount: number;
  utilizationRate: number;
}

export interface CoverageMetrics {
  totalArea: number;
  coveredArea: number;
  coveragePercentage: number;
  averageResponseTime: Duration;
}

export interface SupplyGap {
  location: GeoLocation;
  gapSize: number;
  estimatedDemand: number;
  recommendedDrivers: number;
  priority: 'low' | 'medium' | 'high';
}

export interface PositioningRecommendation {
  driverId: string;
  currentLocation: GeoLocation;
  recommendedLocation: GeoLocation;
  expectedBenefit: number;
  reasoning: string;
}

export interface PopularRoute {
  origin: GeoLocation;
  destination: GeoLocation;
  frequency: number;
  averageDuration: Duration;
  averageDistance: Distance;
  peakTimes: string[];
}

export interface TrafficPattern {
  location: GeoLocation;
  timeOfDay: string;
  dayOfWeek: string;
  averageSpeed: number;
  congestionLevel: number;
  predictability: number;
}

export interface RouteEfficiencyMetrics {
  totalRoutes: number;
  averageEfficiency: number;
  optimalRoutePercentage: number;
  timeWasted: Duration;
  distanceWasted: Distance;
  improvementOpportunities: string[];
}

/**
 * Location data management
 */
export interface LocationDataManager {
  // Data storage and retrieval
  storeLocationData(userId: string, location: GeoLocation): Promise<void>;
  getLocationData(
    userId: string,
    timeWindow?: TimeWindow
  ): Promise<LocationUpdate[]>;
  cleanupOldLocationData(retentionPeriod: Duration): Promise<number>;

  // Data aggregation
  aggregateLocationData(
    area: ServiceArea,
    timeWindow: TimeWindow
  ): Promise<LocationAggregation>;
  generateLocationSummary(
    userId: string,
    timeWindow: TimeWindow
  ): Promise<LocationSummary>;

  // Privacy and compliance
  anonymizeLocationData(userId: string): Promise<void>;
  exportLocationData(userId: string): Promise<LocationExport>;
  deleteLocationData(userId: string): Promise<void>;
}

export interface LocationAggregation {
  area: ServiceArea;
  timeWindow: TimeWindow;
  totalDataPoints: number;
  uniqueUsers: number;
  averageAccuracy: number;
  dataQuality: number;
}

export interface LocationSummary {
  userId: string;
  timeWindow: TimeWindow;
  totalDistance: Distance;
  totalTime: Duration;
  averageSpeed: number;
  frequentLocations: GeoLocation[];
  travelPatterns: TravelPattern[];
}

export interface TravelPattern {
  origin: GeoLocation;
  destination: GeoLocation;
  frequency: number;
  averageTime: Duration;
  preferredTimes: string[];
}

export interface LocationExport {
  userId: string;
  exportedAt: Date;
  dataPoints: LocationUpdate[];
  summary: LocationSummary;
  format: 'json' | 'csv' | 'gpx';
}
