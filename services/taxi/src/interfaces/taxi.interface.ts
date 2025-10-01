import { GeoLocation } from '@/types/common.types';
import {
  Driver,
  DriverFilters,
  DriverProfile,
  DriverRegistration,
  DriverStatus,
  NearbyDriver,
} from '@/types/driver.types';
import { FareEstimate, FareEstimateRequest } from '@/types/pricing.types';
import {
  CancellationReason,
  CancellationResult,
  Ride,
  RideFilters,
  RideHistory,
  RideRequest,
  RideResponse,
  RideStatus,
  RideTracking,
  ScheduledRide,
} from '@/types/ride.types';
import { Vehicle } from '@/types/vehicle.types';

/**
 * Main Taxi Service interface defining core functionality
 */
export interface TaxiService {
  // Ride management
  requestRide(request: RideRequest): Promise<RideResponse>;
  cancelRide(
    rideId: string,
    reason: CancellationReason
  ): Promise<CancellationResult>;
  getRideStatus(rideId: string): Promise<RideStatus>;
  getRideDetails(rideId: string): Promise<Ride>;
  getRideHistory(userId: string, filters?: RideFilters): Promise<RideHistory>;
  updateRideStatus(rideId: string, status: RideStatus): Promise<void>;

  // Scheduled rides
  scheduleRide(request: RideRequest): Promise<ScheduledRide>;
  getScheduledRides(userId: string): Promise<ScheduledRide[]>;
  cancelScheduledRide(
    rideId: string,
    reason: CancellationReason
  ): Promise<CancellationResult>;

  // Driver management
  registerDriver(driver: DriverRegistration): Promise<DriverProfile>;
  updateDriverStatus(driverId: string, status: DriverStatus): Promise<void>;
  getDriverProfile(driverId: string): Promise<DriverProfile>;
  getAvailableDrivers(
    location: GeoLocation,
    filters?: DriverFilters
  ): Promise<NearbyDriver[]>;
  approveDriver(driverId: string): Promise<void>;
  suspendDriver(driverId: string, reason: string): Promise<void>;

  // Vehicle management
  addVehicle(
    driverId: string,
    vehicle: Omit<Vehicle, 'id' | 'driverId'>
  ): Promise<Vehicle>;
  updateVehicle(vehicleId: string, updates: Partial<Vehicle>): Promise<Vehicle>;
  removeVehicle(vehicleId: string): Promise<void>;
  getDriverVehicles(driverId: string): Promise<Vehicle[]>;

  // Real-time tracking
  updateLocation(userId: string, location: GeoLocation): Promise<void>;
  trackRide(rideId: string): Promise<RideTracking>;

  // Pricing
  estimateFare(request: FareEstimateRequest): Promise<FareEstimate>;
  calculateFinalFare(rideId: string): Promise<number>;
}

/**
 * Driver-specific service interface
 */
export interface DriverService {
  // Profile management
  getProfile(driverId: string): Promise<DriverProfile>;
  updateProfile(
    driverId: string,
    updates: Partial<Driver>
  ): Promise<DriverProfile>;
  uploadDocument(
    driverId: string,
    documentType: string,
    file: Buffer
  ): Promise<string>;

  // Availability management
  goOnline(driverId: string): Promise<void>;
  goOffline(driverId: string): Promise<void>;
  updateAvailability(driverId: string, availability: any): Promise<void>;

  // Ride management
  acceptRide(driverId: string, rideId: string): Promise<void>;
  rejectRide(driverId: string, rideId: string, reason: string): Promise<void>;
  startRide(driverId: string, rideId: string): Promise<void>;
  completeRide(driverId: string, rideId: string): Promise<void>;

  // Earnings
  getEarnings(driverId: string, timeWindow?: any): Promise<any>;
  requestPayout(driverId: string, amount: number): Promise<void>;
}

/**
 * Passenger-specific service interface
 */
export interface PassengerService {
  // Ride booking
  bookRide(passengerId: string, request: RideRequest): Promise<RideResponse>;
  cancelRide(
    passengerId: string,
    rideId: string,
    reason: CancellationReason
  ): Promise<CancellationResult>;

  // Ride tracking
  trackCurrentRide(passengerId: string): Promise<RideTracking | null>;
  shareRide(
    passengerId: string,
    rideId: string,
    contacts: string[]
  ): Promise<void>;

  // History and preferences
  getRideHistory(
    passengerId: string,
    filters?: RideFilters
  ): Promise<RideHistory>;
  getFavoriteLocations(passengerId: string): Promise<GeoLocation[]>;
  addFavoriteLocation(
    passengerId: string,
    location: GeoLocation,
    name: string
  ): Promise<void>;

  // Ratings and feedback
  rateRide(
    passengerId: string,
    rideId: string,
    rating: number,
    comment?: string
  ): Promise<void>;
  reportIssue(
    passengerId: string,
    rideId: string,
    issue: string
  ): Promise<void>;
}

/**
 * Admin service interface for platform management
 */
export interface AdminService {
  // Driver management
  getPendingDrivers(): Promise<Driver[]>;
  approveDriver(driverId: string, adminId: string): Promise<void>;
  rejectDriver(
    driverId: string,
    adminId: string,
    reason: string
  ): Promise<void>;
  suspendDriver(
    driverId: string,
    adminId: string,
    reason: string
  ): Promise<void>;

  // Ride monitoring
  getActiveRides(): Promise<Ride[]>;
  getRidesByStatus(status: RideStatus): Promise<Ride[]>;
  interveneInRide(
    rideId: string,
    adminId: string,
    action: string
  ): Promise<void>;

  // Analytics and reporting
  getSystemMetrics(): Promise<any>;
  generateReport(type: string, parameters: any): Promise<any>;

  // Configuration management
  updatePricingConfig(config: any): Promise<void>;
  updateServiceAreas(areas: any[]): Promise<void>;
  manageSurgePricing(area: string, multiplier: number): Promise<void>;
}

/**
 * Integration interfaces for external services
 */
export interface ExternalServiceIntegration {
  // Auth service integration
  validateUser(userId: string, token: string): Promise<boolean>;
  getUserProfile(userId: string): Promise<any>;

  // Payment service integration
  processPayment(
    rideId: string,
    amount: number,
    paymentMethodId: string
  ): Promise<any>;
  refundPayment(transactionId: string, amount: number): Promise<any>;

  // Notification service integration
  sendNotification(userId: string, type: string, data: any): Promise<void>;
  sendBulkNotification(
    userIds: string[],
    type: string,
    data: any
  ): Promise<void>;

  // Upload service integration
  uploadFile(file: Buffer, metadata: any): Promise<string>;
  getFileUrl(fileId: string): Promise<string>;
  deleteFile(fileId: string): Promise<void>;
}

/**
 * Repository interfaces for data access
 */
export interface RideRepository {
  create(ride: Omit<Ride, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ride>;
  findById(id: string): Promise<Ride | null>;
  findByPassengerId(
    passengerId: string,
    filters?: RideFilters
  ): Promise<Ride[]>;
  findByDriverId(driverId: string, filters?: RideFilters): Promise<Ride[]>;
  update(id: string, updates: Partial<Ride>): Promise<Ride>;
  delete(id: string): Promise<void>;
  findActiveRides(): Promise<Ride[]>;
  findByStatus(status: RideStatus): Promise<Ride[]>;
}

export interface DriverRepository {
  create(driver: Omit<Driver, 'id' | 'registeredAt'>): Promise<Driver>;
  findById(id: string): Promise<Driver | null>;
  findByUserId(userId: string): Promise<Driver | null>;
  update(id: string, updates: Partial<Driver>): Promise<Driver>;
  delete(id: string): Promise<void>;
  findAvailableDrivers(
    location: GeoLocation,
    radius: number
  ): Promise<Driver[]>;
  findByStatus(status: DriverStatus): Promise<Driver[]>;
  findPendingApproval(): Promise<Driver[]>;
}

export interface VehicleRepository {
  create(vehicle: Omit<Vehicle, 'id' | 'addedAt'>): Promise<Vehicle>;
  findById(id: string): Promise<Vehicle | null>;
  findByDriverId(driverId: string): Promise<Vehicle[]>;
  update(id: string, updates: Partial<Vehicle>): Promise<Vehicle>;
  delete(id: string): Promise<void>;
  findByStatus(status: any): Promise<Vehicle[]>;
}
