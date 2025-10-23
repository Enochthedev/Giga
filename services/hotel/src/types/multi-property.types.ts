/**
 * Multi-Property Management Types
 */

// Chain Management Types
export interface Chain {
  id: string;
  name: string;
  description?: string;
  code: string;
  contactInfo: ContactInformation;
  defaultCurrency: string;
  defaultTimezone: string;
  chainPolicies?: ChainPolicies;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  brands?: Brand[];
  properties?: Property[];
  _count?: {
    brands: number;
    properties: number;
  };
}

export interface CreateChainRequest {
  name: string;
  description?: string;
  code: string;
  contactInfo: ContactInformation;
  defaultCurrency?: string;
  defaultTimezone?: string;
  chainPolicies?: ChainPolicies;
}

export interface UpdateChainRequest {
  name?: string;
  description?: string;
  code?: string;
  contactInfo?: Partial<ContactInformation>;
  defaultCurrency?: string;
  defaultTimezone?: string;
  chainPolicies?: Partial<ChainPolicies>;
  isActive?: boolean;
}

export interface ChainPolicies {
  cancellationPolicy?: string;
  childPolicy?: string;
  petPolicy?: string;
  smokingPolicy?: string;
  loyaltyProgram?: string;
  standardAmenities?: string[];
  brandStandards?: Record<string, unknown>;
}

// Brand Management Types
export interface Brand {
  id: string;
  chainId: string;
  name: string;
  description?: string;
  code: string;
  brandStandards?: BrandStandards;
  amenityRequirements?: string[];
  logo?: string;
  colorScheme?: BrandColorScheme;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  chain?: Chain;
  properties?: Property[];
  _count?: {
    properties: number;
  };
}

export interface CreateBrandRequest {
  chainId: string;
  name: string;
  description?: string;
  code: string;
  brandStandards?: BrandStandards;
  amenityRequirements?: string[];
  logo?: string;
  colorScheme?: BrandColorScheme;
}

export interface UpdateBrandRequest {
  name?: string;
  description?: string;
  code?: string;
  brandStandards?: Partial<BrandStandards>;
  amenityRequirements?: string[];
  logo?: string;
  colorScheme?: BrandColorScheme;
  isActive?: boolean;
}

export interface BrandStandards {
  minimumStarRating?: number;
  requiredAmenities: string[];
  serviceStandards: ServiceStandard[];
  designStandards?: DesignStandard[];
  operationalStandards?: OperationalStandard[];
}

export interface ServiceStandard {
  category: string;
  requirement: string;
  description?: string;
  mandatory: boolean;
}

export interface DesignStandard {
  element: string;
  specification: string;
  mandatory: boolean;
}

export interface OperationalStandard {
  process: string;
  requirement: string;
  mandatory: boolean;
}

export interface BrandColorScheme {
  primary: string;
  secondary: string;
  accent?: string;
  background?: string;
  text?: string;
}

// Property Group Management
export interface PropertyGroup {
  id: string;
  name: string;
  description?: string;
  type: PropertyGroupType;
  properties: string[];
  settings?: PropertyGroupSettings;
  ownerId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum PropertyGroupType {
  CHAIN = 'chain',
  BRAND = 'brand',
  REGION = 'region',
  CUSTOM = 'custom',
}

export interface PropertyGroupSettings {
  consolidatedReporting: boolean;
  sharedInventory: boolean;
  crossPropertyTransfers: boolean;
  unifiedLoyalty: boolean;
  centralizedPricing: boolean;
}

export interface CreatePropertyGroupRequest {
  name: string;
  description?: string;
  type: PropertyGroupType;
  properties: string[];
  settings?: PropertyGroupSettings;
  ownerId: string;
}

export interface UpdatePropertyGroupRequest {
  name?: string;
  description?: string;
  properties?: string[];
  settings?: Partial<PropertyGroupSettings>;
  isActive?: boolean;
}

// Multi-Property Reporting Types
export interface MultiPropertyReport {
  id: string;
  name: string;
  description?: string;
  reportType: ReportType;
  properties: string[];
  dateRange: DateRange;
  metrics: ReportMetric[];
  filters?: ReportFilters;
  reportData?: ReportData;
  isScheduled: boolean;
  schedule?: ReportSchedule;
  createdBy: string;
  sharedWith?: string[];
  status: ReportStatus;
  lastGenerated?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum ReportType {
  OCCUPANCY = 'occupancy',
  REVENUE = 'revenue',
  PERFORMANCE = 'performance',
  GUEST_SATISFACTION = 'guest_satisfaction',
  OPERATIONAL = 'operational',
  CUSTOM = 'custom',
}

export enum ReportStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export interface ReportMetric {
  name: string;
  type: MetricType;
  aggregation: AggregationType;
  formula?: string;
}

export enum MetricType {
  OCCUPANCY_RATE = 'occupancy_rate',
  ADR = 'adr',
  REVPAR = 'revpar',
  TOTAL_REVENUE = 'total_revenue',
  BOOKING_COUNT = 'booking_count',
  CANCELLATION_RATE = 'cancellation_rate',
  AVERAGE_STAY = 'average_stay',
  GUEST_SATISFACTION = 'guest_satisfaction',
}

export enum AggregationType {
  SUM = 'sum',
  AVERAGE = 'average',
  COUNT = 'count',
  PERCENTAGE = 'percentage',
  RATIO = 'ratio',
}

export interface ReportFilters {
  roomTypes?: string[];
  bookingSources?: string[];
  guestTypes?: string[];
  customFilters?: Record<string, unknown>;
}

export interface ReportSchedule {
  frequency: ScheduleFrequency;
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  timezone: string;
  recipients: string[];
}

export enum ScheduleFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
}

export interface ReportData {
  summary: ReportSummary;
  propertyBreakdown: PropertyReportData[];
  trends: TrendData[];
  comparisons: ComparisonData[];
  generatedAt: Date;
}

export interface ReportSummary {
  totalProperties: number;
  totalRooms: number;
  totalBookings: number;
  totalRevenue: number;
  averageOccupancy: number;
  averageADR: number;
  averageRevPAR: number;
}

export interface PropertyReportData {
  propertyId: string;
  propertyName: string;
  metrics: Record<string, number>;
  trends: Record<string, number[]>;
}

export interface TrendData {
  metric: string;
  period: string;
  values: number[];
  labels: string[];
}

export interface ComparisonData {
  metric: string;
  currentPeriod: number;
  previousPeriod: number;
  change: number;
  changePercentage: number;
}

// Cross-Property Transfer Types
export interface CrossPropertyTransfer {
  id: string;
  fromPropertyId: string;
  toPropertyId: string;
  transferType: TransferType;
  entityId: string;
  entityType: string;
  reason: string;
  notes?: string;
  status: TransferStatus;
  approvedBy?: string;
  approvedAt?: Date;
  completedAt?: Date;
  transferData: TransferData;
  createdAt: Date;
  updatedAt: Date;
}

export enum TransferType {
  INVENTORY = 'inventory',
  BOOKING = 'booking',
  GUEST = 'guest',
  STAFF = 'staff',
}

export enum TransferStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface TransferData {
  originalData: Record<string, unknown>;
  transferredData: Record<string, unknown>;
  modifications?: Record<string, unknown>;
}

export interface CreateTransferRequest {
  fromPropertyId: string;
  toPropertyId: string;
  transferType: TransferType;
  entityId: string;
  entityType: string;
  reason: string;
  notes?: string;
  transferData: TransferData;
}

// Chain Loyalty Program Types
export interface ChainLoyaltyProgram {
  id: string;
  chainId: string;
  name: string;
  description?: string;
  tierStructure: LoyaltyTier[];
  pointsStructure: PointsStructure;
  benefits: LoyaltyBenefits;
  rules: LoyaltyRules;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoyaltyTier {
  name: string;
  level: number;
  minimumPoints: number;
  minimumStays?: number;
  benefits: string[];
  perks: LoyaltyPerk[];
}

export interface LoyaltyPerk {
  type: PerkType;
  value: string | number;
  description: string;
}

export enum PerkType {
  ROOM_UPGRADE = 'room_upgrade',
  LATE_CHECKOUT = 'late_checkout',
  EARLY_CHECKIN = 'early_checkin',
  FREE_WIFI = 'free_wifi',
  BREAKFAST = 'breakfast',
  PARKING = 'parking',
  POINTS_MULTIPLIER = 'points_multiplier',
  DISCOUNT = 'discount',
}

export interface PointsStructure {
  basePointsPerDollar: number;
  bonusCategories: BonusCategory[];
  redemptionRates: RedemptionRate[];
}

export interface BonusCategory {
  category: string;
  multiplier: number;
  conditions?: string[];
}

export interface RedemptionRate {
  type: RedemptionType;
  pointsRequired: number;
  value: number;
  description: string;
}

export enum RedemptionType {
  FREE_NIGHT = 'free_night',
  ROOM_UPGRADE = 'room_upgrade',
  CASH_CREDIT = 'cash_credit',
  EXPERIENCE = 'experience',
}

export interface LoyaltyBenefits {
  tierBenefits: Record<string, string[]>;
  globalBenefits: string[];
  partnerBenefits?: PartnerBenefit[];
}

export interface PartnerBenefit {
  partner: string;
  benefit: string;
  eligibleTiers: string[];
}

export interface LoyaltyRules {
  pointsExpiration: number; // months
  tierQualificationPeriod: number; // months
  minimumStayForPoints: number; // nights
  blackoutDates?: string[];
  restrictions?: string[];
}

// Search and Filter Types
export interface ChainSearchCriteria {
  query?: string;
  isActive?: boolean;
  country?: string;
}

export interface BrandSearchCriteria {
  query?: string;
  chainId?: string;
  isActive?: boolean;
}

export interface MultiPropertySearchCriteria {
  chainId?: string;
  brandId?: string;
  groupId?: string;
  region?: string;
  country?: string;
  city?: string;
  category?: string;
  starRating?: number;
  amenities?: string[];
}

// Common Types
export interface ContactInformation {
  email: string;
  phone: string;
  website?: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  email?: string;
  relationship: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// Import Property type (assuming it exists)
export interface Property {
  id: string;
  name: string;
  chainId?: string;
  brandId?: string;
  // ... other property fields
}
