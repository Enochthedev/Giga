import { Distance, Duration, GeoLocation, TimeWindow } from './common.types';
import { FareBreakdown } from './pricing.types';
import { SafetyFeature } from './safety.types';

// Core Ride interface
export interface Ride {
  id: string;
  passengerId: string;
  driverId?: string;

  // Location details
  pickupLocation: GeoLocation;
  dropoffLocation: GeoLocation;
  actualPickupLocation?: GeoLocation;
  actualDropoffLocation?: GeoLocation;

  // Timing
  requestedAt: Date;
  scheduledFor?: Date;
  acceptedAt?: Date;
  arrivedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;

  // Ride details
  vehicleType: VehicleType;
  passengerCount: number;
  specialRequests?: string[];
  notes?: string;

  // Pricing
  estimatedFare: FareBreakdown;
  finalFare?: FareBreakdown;

  // Status and tracking
  status: RideStatus;
  route?: RouteInfo;

  // Safety and quality
  safetyFeatures: SafetyFeature[];
  rating?: RideRating;

  // Metadata
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export enum RideStatus {
  REQUESTED = 'requested',
  DRIVER_ASSIGNED = 'driver_assigned',
  DRIVER_ARRIVING = 'driver_arriving',
  DRIVER_ARRIVED = 'driver_arrived',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum VehicleType {
  ECONOMY = 'economy',
  COMFORT = 'comfort',
  PREMIUM = 'premium',
  SUV = 'suv',
  MOTORCYCLE = 'motorcycle',
  ACCESSIBLE = 'accessible',
}

export interface RideRequest {
  passengerId: string;
  pickupLocation: GeoLocation;
  dropoffLocation: GeoLocation;
  vehicleType: VehicleType;
  passengerCount: number;
  scheduledFor?: Date;
  specialRequests?: string[];
  paymentMethodId?: string;
  preferredDriverId?: string;
}

export interface RideResponse {
  ride: Ride;
  estimatedArrival?: Date;
  estimatedFare: FareBreakdown;
  availableDrivers: number;
}

export interface RouteInfo {
  distance: Distance;
  duration: Duration;
  polyline: string; // encoded polyline
  waypoints: GeoLocation[];
  trafficConditions: TrafficCondition[];
  alternativeRoutes?: AlternativeRoute[];
}

export interface TrafficCondition {
  location: GeoLocation;
  severity: 'light' | 'moderate' | 'heavy' | 'severe';
  description: string;
  estimatedDelay: Duration;
}

export interface AlternativeRoute {
  route: RouteInfo;
  reason: string;
  timeSaving: Duration;
  distanceDifference: Distance;
}

export interface RideTracking {
  rideId: string;
  driverLocation: GeoLocation;
  passengerLocation?: GeoLocation;
  route: RouteInfo;
  eta: Duration;
  distanceRemaining: Distance;
  currentSpeed?: number;
  lastUpdated: Date;
}

export interface RideRating {
  passengerId: string;
  driverId: string;
  rideId: string;
  passengerRating?: number; // 1-5 stars
  driverRating?: number; // 1-5 stars
  passengerComment?: string;
  driverComment?: string;
  safetyRating?: number;
  vehicleRating?: number;
  ratedAt: Date;
}

export interface RideHistory {
  rides: Ride[];
  totalRides: number;
  totalDistance: Distance;
  totalFare: number;
  averageRating: number;
  favoriteDestinations: GeoLocation[];
}

export interface RideFilters {
  status?: RideStatus[];
  vehicleType?: VehicleType[];
  dateRange?: TimeWindow;
  minFare?: number;
  maxFare?: number;
  driverId?: string;
  passengerId?: string;
}

export interface CancellationReason {
  code: string;
  description: string;
  category: 'passenger' | 'driver' | 'system';
  refundEligible: boolean;
}

export interface CancellationResult {
  success: boolean;
  refundAmount?: number;
  cancellationFee?: number;
  reason: CancellationReason;
  processedAt: Date;
}

// Scheduled ride types
export interface ScheduledRide extends Omit<Ride, 'status'> {
  status: ScheduledRideStatus;
  recurrence?: RideRecurrence;
  reminderSent: boolean;
  driverAssignedAt?: Date;
}

export enum ScheduledRideStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  DRIVER_ASSIGNED = 'driver_assigned',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export interface RideRecurrence {
  pattern: 'daily' | 'weekly' | 'monthly';
  daysOfWeek?: number[]; // 0-6, Sunday = 0
  endDate?: Date;
  maxOccurrences?: number;
}

// Multi-stop ride support
export interface MultiStopRide extends Ride {
  stops: RideStop[];
  currentStopIndex: number;
}

export interface RideStop {
  location: GeoLocation;
  description?: string;
  estimatedArrival?: Date;
  actualArrival?: Date;
  waitTime?: Duration;
  completed: boolean;
}
