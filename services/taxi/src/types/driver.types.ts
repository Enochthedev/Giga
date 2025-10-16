import { Address, EmergencyContact, GeoLocation } from './common.types';
import { Vehicle } from './vehicle.types';

// Core Driver interface
export interface Driver {
  id: string;
  userId: string; // Reference to Auth Service

  // Personal information
  personalInfo: DriverPersonalInfo;

  // Verification and documents
  verification: DriverVerification;
  documents: DriverDocument[];

  // Vehicle information
  vehicles: Vehicle[];
  activeVehicleId?: string;

  // Status and availability
  status: DriverStatus;
  availability: DriverAvailability;
  currentLocation?: GeoLocation;

  // Performance metrics
  metrics: DriverMetrics;

  // Financial information
  earnings: DriverEarnings;
  payoutInfo: PayoutInformation;

  // Safety and compliance
  safetyScore: number;
  backgroundCheck: BackgroundCheckStatus;

  // Preferences and settings
  preferences: DriverPreferences;

  // Timestamps
  registeredAt: Date;
  lastActiveAt: Date;
  approvedAt?: Date;
  suspendedAt?: Date;
  deactivatedAt?: Date;
}

export interface DriverPersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  email: string;
  address: Address;
  emergencyContact: EmergencyContact;
  profilePhotoUrl?: string;
  languages: string[];
}

export interface DriverVerification {
  licenseNumber: string;
  licenseExpiry: Date;
  licenseVerified: boolean;
  licenseClass: string;
  insuranceVerified: boolean;
  insuranceExpiry: Date;
  backgroundCheckStatus: BackgroundCheckStatus;
  verificationLevel: VerificationLevel;
  verifiedAt?: Date;
  verifiedBy?: string;
}

export interface DriverDocument {
  id: string;
  type: DocumentType;
  url: string;
  uploadedAt: Date;
  verifiedAt?: Date;
  expiryDate?: Date;
  status: DocumentStatus;
  notes?: string;
}

export enum DocumentType {
  DRIVERS_LICENSE = 'drivers_license',
  VEHICLE_REGISTRATION = 'vehicle_registration',
  INSURANCE_CERTIFICATE = 'insurance_certificate',
  BACKGROUND_CHECK = 'background_check',
  PROFILE_PHOTO = 'profile_photo',
  VEHICLE_INSPECTION = 'vehicle_inspection',
  COMMERCIAL_LICENSE = 'commercial_license',
}

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  REQUIRES_UPDATE = 'requires_update',
}

export enum DriverStatus {
  PENDING_APPROVAL = 'pending_approval',
  ACTIVE = 'active',
  OFFLINE = 'offline',
  ON_RIDE = 'on_ride',
  BREAK = 'break',
  SUSPENDED = 'suspended',
  DEACTIVATED = 'deactivated',
}

export interface DriverAvailability {
  isOnline: boolean;
  acceptingRides: boolean;
  workingHours: WorkingHours;
  preferredAreas: GeoLocation[];
  maxDistance: number; // km from current location
  vehicleTypes: string[];
}

export interface WorkingHours {
  monday?: TimeSlot[];
  tuesday?: TimeSlot[];
  wednesday?: TimeSlot[];
  thursday?: TimeSlot[];
  friday?: TimeSlot[];
  saturday?: TimeSlot[];
  sunday?: TimeSlot[];
}

export interface TimeSlot {
  start: string; // HH:MM format
  end: string; // HH:MM format
}

export interface DriverMetrics {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  averageRating: number;
  totalRatings: number;
  acceptanceRate: number;
  completionRate: number;
  responseTime: number; // average seconds to accept ride
  onTimePercentage: number;
  totalDistance: number; // km
  totalDrivingTime: number; // hours
  lastRideCompletedAt?: Date;
}

export interface DriverEarnings {
  totalEarnings: number;
  currentWeekEarnings: number;
  currentMonthEarnings: number;
  pendingPayouts: number;
  totalPayouts: number;
  lastPayoutAt?: Date;
  earningsBreakdown: DriverEarningsBreakdown;
}

export interface DriverEarningsBreakdown {
  baseFares: number;
  tips: number;
  bonuses: number;
  surgeEarnings: number;
  referralBonuses: number;
  commissionDeducted: number;
}

export interface PayoutInformation {
  bankAccountNumber?: string;
  routingNumber?: string;
  accountHolderName?: string;
  paypalEmail?: string;
  preferredMethod: 'bank_transfer' | 'paypal' | 'digital_wallet';
  payoutSchedule: 'daily' | 'weekly' | 'monthly';
  minimumPayout: number;
}

export enum BackgroundCheckStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  REQUIRES_RENEWAL = 'requires_renewal',
}

export enum VerificationLevel {
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium',
  COMMERCIAL = 'commercial',
}

export interface DriverPreferences {
  notifications: DriverNotificationPreferences;
  ridePreferences: RidePreferences;
  paymentPreferences: PaymentPreferences;
  privacySettings: PrivacySettings;
}

export interface DriverNotificationPreferences {
  rideRequests: boolean;
  earnings: boolean;
  promotions: boolean;
  safetyAlerts: boolean;
  systemUpdates: boolean;
  preferredChannels: string[];
}

export interface RidePreferences {
  maxRideDistance: number;
  preferredVehicleTypes: string[];
  acceptPoolRides: boolean;
  acceptScheduledRides: boolean;
  minimumFare: number;
  avoidTolls: boolean;
}

export interface PaymentPreferences {
  autoPayoutEnabled: boolean;
  payoutThreshold: number;
  taxDocumentDelivery: 'email' | 'mail';
}

export interface PrivacySettings {
  shareLocationWithPassengers: boolean;
  allowRatingComments: boolean;
  profileVisibility: 'public' | 'limited' | 'private';
}

// Driver registration and onboarding
export interface DriverRegistration {
  personalInfo: Omit<DriverPersonalInfo, 'profilePhotoUrl'>;
  licenseInfo: Pick<
    DriverVerification,
    'licenseNumber' | 'licenseExpiry' | 'licenseClass'
  >;
  vehicleInfo: Omit<Vehicle, 'id' | 'driverId' | 'status' | 'addedAt'>;
  documents: Omit<DriverDocument, 'id' | 'uploadedAt' | 'status'>[];
  agreesToTerms: boolean;
  referralCode?: string;
}

export interface DriverProfile {
  driver: Driver;
  activeVehicle?: Vehicle;
  recentRides: number;
  currentStatus: DriverStatus;
}

// Driver matching and filtering
export interface DriverFilters {
  vehicleTypes?: string[];
  minRating?: number;
  maxDistance?: number;
  availability?: boolean;
  verificationLevel?: VerificationLevel;
}

export interface NearbyDriver {
  driver: Driver;
  distance: number; // meters
  location: GeoLocation;
  estimatedArrival: number; // seconds
  matchScore?: number;
}

export interface DriverMatch {
  driver: Driver;
  estimatedArrival: Date;
  matchScore: number;
  distance: number;
}

export interface DriverResponse {
  accepted: boolean;
  reason?: string;
  estimatedArrival?: Date;
  respondedAt: Date;
}

export interface MatchResult {
  success: boolean;
  driver?: Driver;
  alternativeDrivers?: Driver[];
  waitTime?: number;
  message?: string;
}
