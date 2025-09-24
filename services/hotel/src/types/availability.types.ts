/**
 * Availability-related type definitions for the Hotel Service
 */

export interface AvailabilityRequest {
  propertyId?: string;
  location?: LocationFilter;
  checkInDate: Date;
  checkOutDate: Date;
  rooms: RoomRequirement[];
  filters?: SearchFilters;
}

export interface LocationFilter {
  city?: string;
  state?: string;
  country?: string;
  coordinates?: GeoCoordinates;
  radius?: number; // in kilometers
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface RoomRequirement {
  adults: number;
  children: number;
  childAges?: number[];
}

export interface SearchFilters {
  priceRange?: PriceRange;
  amenities?: string[];
  category?: string[];
  starRating?: number[];
  propertyTypes?: string[];
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface AvailabilityResult {
  properties: AvailableProperty[];
  searchId: string;
  totalResults: number;
  filters: AppliedFilters;
}

export interface AvailableProperty {
  property: any; // Property type from property.types.ts
  availableRooms: AvailableRoom[];
  totalPrice: number;
  averageNightlyRate: number;
  currency: string;
}

export interface AvailableRoom {
  roomType: any; // RoomType from room.types.ts
  availableQuantity: number;
  pricing: RoomPricing;
  policies: RoomPolicies;
  promotions?: Promotion[];
}

export interface RoomPricing {
  baseRate: number;
  totalRate: number;
  nightlyRates: NightlyRate[];
  taxes: number;
  fees: number;
  currency: string;
}

export interface NightlyRate {
  date: Date;
  rate: number;
  originalRate?: number;
  adjustmentReason?: string;
}

export interface RoomPolicies {
  cancellationPolicy: string;
  minimumStay?: number;
  maximumStay?: number;
  advanceBookingRequired?: number;
  restrictions?: string[];
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: PromotionType;
  discount: DiscountDetails;
  validFrom: Date;
  validTo: Date;
  conditions: PromotionConditions;
}

export interface DiscountDetails {
  type: 'percentage' | 'fixed_amount';
  value: number;
  maxDiscount?: number;
}

export interface PromotionConditions {
  minimumStay?: number;
  advanceBooking?: number;
  applicableRoomTypes?: string[];
  blackoutDates?: Date[];
  maxUsage?: number;
  userRestrictions?: string[];
}

export enum PromotionType {
  EARLY_BIRD = 'early_bird',
  LAST_MINUTE = 'last_minute',
  EXTENDED_STAY = 'extended_stay',
  SEASONAL = 'seasonal',
  LOYALTY = 'loyalty',
  CORPORATE = 'corporate',
  GROUP = 'group',
  FLASH_SALE = 'flash_sale'
}

export interface AppliedFilters {
  location?: LocationFilter;
  priceRange?: PriceRange;
  amenities?: string[];
  category?: string[];
  starRating?: number[];
}

// Inventory Management Types
export interface InventoryRecord {
  id: string;
  propertyId: string;
  roomTypeId: string;
  date: Date;
  totalRooms: number;
  availableRooms: number;
  reservedRooms: number;
  blockedRooms: number;
  overbookingLimit: number;
  minimumStay?: number;
  maximumStay?: number;
  closedToArrival: boolean;
  closedToDeparture: boolean;
  stopSell: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryReservation {
  id: string;
  propertyId: string;
  roomTypeId: string;
  checkInDate: Date;
  checkOutDate: Date;
  roomQuantity: number;
  status: InventoryReservationStatus;
  expiresAt: Date;
  bookingId?: string;
  createdAt: Date;
}

export enum InventoryReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  RELEASED = 'released'
}

export interface InventoryLock {
  id: string;
  propertyId: string;
  roomTypeId: string;
  checkInDate: Date;
  checkOutDate: Date;
  quantity: number;
  lockedBy: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface InventoryLockRequest {
  propertyId: string;
  roomTypeId: string;
  checkInDate: Date;
  checkOutDate: Date;
  quantity: number;
  lockDuration?: number; // in seconds, default 900 (15 minutes)
}

export interface InventoryUpdate {
  roomTypeId: string;
  date: Date;
  totalRooms?: number;
  blockedRooms?: number;
  minimumStay?: number;
  maximumStay?: number;
  closedToArrival?: boolean;
  closedToDeparture?: boolean;
  stopSell?: boolean;
}

export interface AvailabilityBlockRequest {
  propertyId: string;
  roomTypeId?: string; // If not provided, applies to all room types
  startDate: Date;
  endDate: Date;
  reason: BlockReason;
  description?: string;
  blockedBy: string;
}

export enum BlockReason {
  MAINTENANCE = 'maintenance',
  RENOVATION = 'renovation',
  PRIVATE_EVENT = 'private_event',
  SEASONAL_CLOSURE = 'seasonal_closure',
  STAFF_TRAINING = 'staff_training',
  INVENTORY_MANAGEMENT = 'inventory_management',
  OTHER = 'other'
}

export interface InventoryStatus {
  propertyId: string;
  roomTypes: RoomTypeInventoryStatus[];
  dateRange: DateRange;
  totalAvailable: number;
  totalReserved: number;
  totalBlocked: number;
  occupancyRate: number;
}

export interface RoomTypeInventoryStatus {
  roomTypeId: string;
  roomTypeName: string;
  totalRooms: number;
  availableRooms: number;
  reservedRooms: number;
  blockedRooms: number;
  occupancyRate: number;
  dailyInventory: DailyInventory[];
}

export interface DailyInventory {
  date: Date;
  totalRooms: number;
  availableRooms: number;
  reservedRooms: number;
  blockedRooms: number;
  rate?: number;
  restrictions?: InventoryRestrictions;
}

export interface InventoryRestrictions {
  minimumStay?: number;
  maximumStay?: number;
  closedToArrival: boolean;
  closedToDeparture: boolean;
  stopSell: boolean;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ConsistencyReport {
  propertyId: string;
  isConsistent: boolean;
  issues: ConsistencyIssue[];
  checkedAt: Date;
}

export interface ConsistencyIssue {
  type: ConsistencyIssueType;
  roomTypeId: string;
  date: Date;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestedAction?: string;
}

export enum ConsistencyIssueType {
  NEGATIVE_AVAILABILITY = 'negative_availability',
  OVERBOOKING_DETECTED = 'overbooking_detected',
  INVENTORY_MISMATCH = 'inventory_mismatch',
  ORPHANED_RESERVATION = 'orphaned_reservation',
  EXPIRED_LOCK = 'expired_lock',
  RATE_INCONSISTENCY = 'rate_inconsistency'
}