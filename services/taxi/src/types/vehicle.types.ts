import { VehicleType } from './ride.types';

// Core Vehicle interface
export interface Vehicle {
  id: string;
  driverId: string;

  // Vehicle details
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vin?: string;

  // Classification
  type: VehicleType;
  category: VehicleCategory;
  capacity: number;

  // Documentation
  registration: VehicleRegistration;
  insurance: VehicleInsurance;
  inspection: VehicleInspection;

  // Features and amenities
  features: VehicleFeature[];
  accessibility: AccessibilityFeature[];

  // Status and condition
  status: VehicleStatus;
  isActive: boolean;
  condition: VehicleCondition;

  // Photos and media
  photos: VehiclePhoto[];

  // Timestamps
  addedAt: Date;
  approvedAt?: Date;
  lastInspectionAt?: Date;
  retiredAt?: Date;
}

export enum VehicleCategory {
  SEDAN = 'sedan',
  SUV = 'suv',
  HATCHBACK = 'hatchback',
  MOTORCYCLE = 'motorcycle',
  VAN = 'van',
  LUXURY = 'luxury',
  ELECTRIC = 'electric',
  HYBRID = 'hybrid',
}

export enum VehicleStatus {
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  NEEDS_INSPECTION = 'needs_inspection',
  SUSPENDED = 'suspended',
  RETIRED = 'retired',
  MAINTENANCE = 'maintenance',
}

export interface VehicleRegistration {
  registrationNumber: string;
  registrationExpiry: Date;
  registeredOwner: string;
  registrationState: string;
  verified: boolean;
  verifiedAt?: Date;
}

export interface VehicleInsurance {
  policyNumber: string;
  provider: string;
  policyExpiry: Date;
  coverageAmount: number;
  verified: boolean;
  verifiedAt?: Date;
}

export interface VehicleInspection {
  inspectionDate: Date;
  inspectionExpiry: Date;
  inspectorId?: string;
  certificateNumber?: string;
  passed: boolean;
  notes?: string;
  nextInspectionDue: Date;
}

export interface VehicleFeature {
  name: string;
  category: FeatureCategory;
  description?: string;
  available: boolean;
}

export enum FeatureCategory {
  COMFORT = 'comfort',
  SAFETY = 'safety',
  ENTERTAINMENT = 'entertainment',
  CONVENIENCE = 'convenience',
  TECHNOLOGY = 'technology',
}

export interface AccessibilityFeature {
  type: AccessibilityType;
  description: string;
  certified: boolean;
  certificationExpiry?: Date;
}

export enum AccessibilityType {
  WHEELCHAIR_ACCESSIBLE = 'wheelchair_accessible',
  HEARING_IMPAIRED_SUPPORT = 'hearing_impaired_support',
  VISUAL_IMPAIRED_SUPPORT = 'visual_impaired_support',
  MOBILITY_ASSISTANCE = 'mobility_assistance',
  SERVICE_ANIMAL_FRIENDLY = 'service_animal_friendly',
}

export interface VehicleCondition {
  overall: ConditionRating;
  exterior: ConditionRating;
  interior: ConditionRating;
  mechanical: ConditionRating;
  cleanliness: ConditionRating;
  lastAssessedAt: Date;
  assessedBy?: string;
  notes?: string;
}

export enum ConditionRating {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  NEEDS_ATTENTION = 'needs_attention',
}

export interface VehiclePhoto {
  id: string;
  url: string;
  type: PhotoType;
  uploadedAt: Date;
  verified: boolean;
  primary: boolean;
}

export enum PhotoType {
  EXTERIOR_FRONT = 'exterior_front',
  EXTERIOR_BACK = 'exterior_back',
  EXTERIOR_SIDE = 'exterior_side',
  INTERIOR_FRONT = 'interior_front',
  INTERIOR_BACK = 'interior_back',
  DASHBOARD = 'dashboard',
  LICENSE_PLATE = 'license_plate',
  REGISTRATION_DOCUMENT = 'registration_document',
}

// Vehicle specifications and requirements
export interface VehicleRequirements {
  minYear: number;
  maxAge: number;
  requiredFeatures: string[];
  prohibitedConditions: string[];
  inspectionRequired: boolean;
  commercialLicenseRequired: boolean;
}

export interface VehicleTypeConfig {
  type: VehicleType;
  requirements: VehicleRequirements;
  baseFareMultiplier: number;
  capacityRange: {
    min: number;
    max: number;
  };
  allowedCategories: VehicleCategory[];
}

// Vehicle performance and analytics
export interface VehicleMetrics {
  totalRides: number;
  totalDistance: number;
  totalRevenue: number;
  averageRating: number;
  maintenanceCosts: number;
  fuelEfficiency?: number;
  utilizationRate: number;
  lastServiceDate?: Date;
}

export interface VehicleMaintenanceRecord {
  id: string;
  vehicleId: string;
  type: MaintenanceType;
  description: string;
  cost: number;
  performedAt: Date;
  performedBy: string;
  nextDueAt?: Date;
  warrantyInfo?: string;
}

export enum MaintenanceType {
  ROUTINE_SERVICE = 'routine_service',
  REPAIR = 'repair',
  INSPECTION = 'inspection',
  TIRE_REPLACEMENT = 'tire_replacement',
  OIL_CHANGE = 'oil_change',
  BRAKE_SERVICE = 'brake_service',
  ENGINE_SERVICE = 'engine_service',
  TRANSMISSION_SERVICE = 'transmission_service',
  ELECTRICAL_REPAIR = 'electrical_repair',
  BODY_WORK = 'body_work',
}

// Fleet management (for fleet operators)
export interface Fleet {
  id: string;
  ownerId: string;
  name: string;
  vehicles: Vehicle[];
  drivers: string[]; // driver IDs
  totalVehicles: number;
  activeVehicles: number;
  metrics: FleetMetrics;
  createdAt: Date;
}

export interface FleetMetrics {
  totalRides: number;
  totalRevenue: number;
  averageUtilization: number;
  maintenanceCosts: number;
  fuelCosts: number;
  driverPayouts: number;
  netProfit: number;
}
