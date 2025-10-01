import { Distance, Duration, GeoLocation } from './common.types';

// Location and tracking related types
export interface LocationUpdate {
  userId: string;
  location: GeoLocation;
  timestamp: Date;
  accuracy: number;
  source: LocationSource;
}

export enum LocationSource {
  GPS = 'gps',
  NETWORK = 'network',
  PASSIVE = 'passive',
  MANUAL = 'manual',
}

export interface LocationHistory {
  userId: string;
  locations: LocationUpdate[];
  totalDistance: Distance;
  averageSpeed: number;
  timeRange: {
    start: Date;
    end: Date;
  };
}

// Route and navigation types
export interface Route {
  id: string;
  origin: GeoLocation;
  destination: GeoLocation;
  waypoints: GeoLocation[];
  distance: Distance;
  duration: Duration;
  polyline: string;
  steps: RouteStep[];
  trafficConditions: TrafficInfo[];
  tollInfo?: TollInfo;
  createdAt: Date;
}

export interface RouteStep {
  instruction: string;
  distance: Distance;
  duration: Duration;
  startLocation: GeoLocation;
  endLocation: GeoLocation;
  maneuver: ManeuverType;
  streetName?: string;
}

export enum ManeuverType {
  TURN_LEFT = 'turn_left',
  TURN_RIGHT = 'turn_right',
  TURN_SLIGHT_LEFT = 'turn_slight_left',
  TURN_SLIGHT_RIGHT = 'turn_slight_right',
  TURN_SHARP_LEFT = 'turn_sharp_left',
  TURN_SHARP_RIGHT = 'turn_sharp_right',
  UTURN_LEFT = 'uturn_left',
  UTURN_RIGHT = 'uturn_right',
  CONTINUE = 'continue',
  MERGE = 'merge',
  FORK_LEFT = 'fork_left',
  FORK_RIGHT = 'fork_right',
  ROUNDABOUT_LEFT = 'roundabout_left',
  ROUNDABOUT_RIGHT = 'roundabout_right',
  RAMP_LEFT = 'ramp_left',
  RAMP_RIGHT = 'ramp_right',
  ARRIVE = 'arrive',
  DEPART = 'depart',
}

export interface TrafficInfo {
  location: GeoLocation;
  severity: TrafficSeverity;
  type: TrafficType;
  description: string;
  estimatedDelay: Duration;
  affectedLength: Distance;
  startTime?: Date;
  endTime?: Date;
}

export enum TrafficSeverity {
  LIGHT = 'light',
  MODERATE = 'moderate',
  HEAVY = 'heavy',
  SEVERE = 'severe',
}

export enum TrafficType {
  CONGESTION = 'congestion',
  ACCIDENT = 'accident',
  CONSTRUCTION = 'construction',
  ROAD_CLOSURE = 'road_closure',
  WEATHER = 'weather',
  EVENT = 'event',
}

export interface TollInfo {
  totalCost: number;
  currency: string;
  tollPoints: TollPoint[];
}

export interface TollPoint {
  location: GeoLocation;
  name: string;
  cost: number;
  paymentMethods: string[];
}

// Geofencing and service areas
export interface ServiceArea {
  id: string;
  name: string;
  type: ServiceAreaType;
  geometry: GeoFence;
  isActive: boolean;
  restrictions?: AreaRestrictions;
  pricing?: AreaPricing;
  createdAt: Date;
}

export enum ServiceAreaType {
  CITY = 'city',
  SUBURB = 'suburb',
  AIRPORT = 'airport',
  DOWNTOWN = 'downtown',
  RESTRICTED = 'restricted',
  PREMIUM = 'premium',
}

export interface GeoFence {
  type: 'circle' | 'polygon';
  center?: GeoLocation;
  radius?: number; // meters
  coordinates?: GeoLocation[];
}

export interface AreaRestrictions {
  vehicleTypes?: string[];
  timeRestrictions?: TimeRestriction[];
  driverRequirements?: string[];
  maxCapacity?: number;
}

export interface TimeRestriction {
  dayOfWeek: number; // 0-6, Sunday = 0
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  restricted: boolean;
}

export interface AreaPricing {
  baseFareMultiplier: number;
  surgeMultiplier: number;
  minimumFare: number;
  additionalFees: AreaFee[];
}

export interface AreaFee {
  type: string;
  amount: number;
  description: string;
}

// ETA and distance calculations
export interface ETACalculation {
  origin: GeoLocation;
  destination: GeoLocation;
  estimatedTime: Duration;
  estimatedDistance: Distance;
  confidence: number; // 0-1
  factors: ETAFactor[];
  calculatedAt: Date;
}

export interface ETAFactor {
  type: ETAFactorType;
  impact: number; // seconds added/removed
  description: string;
}

export enum ETAFactorType {
  TRAFFIC = 'traffic',
  WEATHER = 'weather',
  CONSTRUCTION = 'construction',
  EVENT = 'event',
  TIME_OF_DAY = 'time_of_day',
  DAY_OF_WEEK = 'day_of_week',
  DRIVER_BEHAVIOR = 'driver_behavior',
}

// Location-based search and discovery
export interface LocationSearch {
  query: string;
  location?: GeoLocation;
  radius?: number;
  types?: LocationType[];
  limit?: number;
}

export interface LocationResult {
  id: string;
  name: string;
  address: string;
  location: GeoLocation;
  type: LocationType;
  rating?: number;
  distance?: Distance;
  businessHours?: BusinessHours;
}

export enum LocationType {
  AIRPORT = 'airport',
  HOTEL = 'hotel',
  RESTAURANT = 'restaurant',
  SHOPPING = 'shopping',
  HOSPITAL = 'hospital',
  SCHOOL = 'school',
  OFFICE = 'office',
  RESIDENTIAL = 'residential',
  ENTERTAINMENT = 'entertainment',
  TRANSPORT_HUB = 'transport_hub',
}

export interface BusinessHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
  timezone: string;
}

// Heatmaps and demand analysis
export interface DemandHeatmap {
  area: ServiceArea;
  timeWindow: {
    start: Date;
    end: Date;
  };
  gridSize: number; // meters
  dataPoints: HeatmapPoint[];
  generatedAt: Date;
}

export interface HeatmapPoint {
  location: GeoLocation;
  demand: number;
  supply: number;
  ratio: number;
  averageWaitTime: Duration;
  averageFare: number;
}
