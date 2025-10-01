/**
 * Guest-related type definitions for the Hotel Service
 */

export interface GuestProfile {
  id: string;
  _userId: string; // Reference to Auth Service

  // Personal information
  personalInfo: PersonalInformation;
  contactInfo: ContactInformation;

  // Preferences
  preferences: GuestPreferences;

  // Booking history
  bookingHistory: BookingHistorySummary[];

  // Loyalty information
  loyaltyStatus?: LoyaltyStatus;
  loyaltyPoints?: number;

  // Special requirements
  accessibility?: AccessibilityRequirements;
  dietaryRestrictions?: string[];

  // Communication preferences
  communicationPreferences: CommunicationPreferences;

  // VIP status
  vipStatus?: VIPStatus;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastBookingDate?: Date;
  lastLoginDate?: Date;
}

export interface PersonalInformation {
  firstName: string;
  lastName: string;
  middleName?: string;
  title?: string;
  dateOfBirth?: Date;
  nationality?: string;
  passportNumber?: string;
  passportExpiryDate?: Date;
  idNumber?: string;
  idType?: IdentificationType;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
}

export interface ContactInformation {
  email: string;
  phone: string;
  alternatePhone?: string;
  address: Address;
  emergencyContact?: EmergencyContact;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  region?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface GuestPreferences {
  roomPreferences: RoomPreferences;
  servicePreferences: ServicePreferences;
  communicationLanguage: string;
  currency: string;
  timezone: string;
  dietaryRestrictions?: string[];
  accessibility?: AccessibilityRequirements;
  specialRequests?: string[];
}

export interface RoomPreferences {
  preferredFloor?: FloorPreference;
  preferredView?: RoomView;
  bedType?: BedType;
  smokingPreference: SmokingPreference;
  quietRoom: boolean;
  accessibleRoom: boolean;
  connectingRooms?: boolean;
  highFloor?: boolean;
  lowFloor?: boolean;
  roomSize?: RoomSizePreference;
  amenityPreferences?: string[];
}

export interface ServicePreferences {
  earlyCheckIn?: boolean;
  lateCheckOut?: boolean;
  roomService?: boolean;
  housekeeping?: HousekeepingPreference;
  wakeUpCall?: boolean;
  newspaperDelivery?: boolean;
  turndownService?: boolean;
  conciergeServices?: boolean;
  vipTreatment?: boolean;
  loyaltyProgramParticipation?: boolean;
}

export interface AccessibilityRequirements {
  wheelchairAccessible: boolean;
  hearingImpaired: boolean;
  visuallyImpaired: boolean;
  mobilityAssistance: boolean;
  serviceAnimal: boolean;
  other?: string;
  specificNeeds?: string[];
}

export interface CommunicationPreferences {
  preferredMethod: CommunicationMethod;
  marketingEmails: boolean;
  promotionalSms: boolean;
  bookingNotifications: boolean;
  loyaltyUpdates: boolean;
  surveyParticipation: boolean;
  language: string;
  timezone: string;
}

export interface BookingHistorySummary {
  bookingId: string;
  propertyId: string;
  propertyName: string;
  checkInDate: Date;
  checkOutDate: Date;
  totalAmount: number;
  currency: string;
  status: string;
  rating?: number;
  review?: string;
}

export interface LoyaltyStatus {
  programId: string;
  programName: string;
  tier: LoyaltyTier;
  points: number;
  lifetimePoints: number;
  tierProgress: TierProgress;
  benefits: LoyaltyBenefit[];
  expirationDate?: Date;
  joinDate: Date;
}

export interface TierProgress {
  currentTier: LoyaltyTier;
  nextTier?: LoyaltyTier;
  pointsToNextTier?: number;
  staysToNextTier?: number;
  nightsToNextTier?: number;
}

export interface LoyaltyBenefit {
  id: string;
  name: string;
  description: string;
  type: BenefitType;
  value?: string;
  isActive: boolean;
  expirationDate?: Date;
}

export interface VIPStatus {
  level: VIPLevel;
  assignedDate: Date;
  assignedBy: string;
  reason: string;
  specialInstructions?: string;
  benefits: VIPBenefit[];
  isActive: boolean;
}

export interface VIPBenefit {
  id: string;
  name: string;
  description: string;
  type: BenefitType;
  value?: string;
}

export enum IdentificationType {
  PASSPORT = 'passport',
  DRIVERS_LICENSE = 'drivers_license',
  NATIONAL_ID = 'national_id',
  OTHER = 'other',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  SEPARATED = 'separated',
  DOMESTIC_PARTNERSHIP = 'domestic_partnership',
}

export enum FloorPreference {
  LOW = 'low',
  HIGH = 'high',
  MIDDLE = 'middle',
  GROUND = 'ground',
  TOP = 'top',
}

export enum RoomView {
  OCEAN = 'ocean',
  MOUNTAIN = 'mountain',
  CITY = 'city',
  GARDEN = 'garden',
  POOL = 'pool',
  COURTYARD = 'courtyard',
  STREET = 'street',
  INTERIOR = 'interior',
}

export enum BedType {
  SINGLE = 'single',
  DOUBLE = 'double',
  QUEEN = 'queen',
  KING = 'king',
  TWIN = 'twin',
}

export enum SmokingPreference {
  SMOKING = 'smoking',
  NON_SMOKING = 'non_smoking',
  NO_PREFERENCE = 'no_preference',
}

export enum RoomSizePreference {
  COMPACT = 'compact',
  STANDARD = 'standard',
  LARGE = 'large',
  SUITE = 'suite',
}

export enum HousekeepingPreference {
  DAILY = 'daily',
  EVERY_OTHER_DAY = 'every_other_day',
  WEEKLY = 'weekly',
  ON_REQUEST = 'on_request',
  MINIMAL = 'minimal',
}

export enum CommunicationMethod {
  EMAIL = 'email',
  SMS = 'sms',
  PHONE = 'phone',
  PUSH_NOTIFICATION = 'push_notification',
  MAIL = 'mail',
}

export enum LoyaltyTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond',
}

export enum BenefitType {
  ROOM_UPGRADE = 'room_upgrade',
  LATE_CHECKOUT = 'late_checkout',
  EARLY_CHECKIN = 'early_checkin',
  FREE_WIFI = 'free_wifi',
  FREE_BREAKFAST = 'free_breakfast',
  LOUNGE_ACCESS = 'lounge_access',
  PRIORITY_SUPPORT = 'priority_support',
  BONUS_POINTS = 'bonus_points',
  DISCOUNT = 'discount',
  FREE_PARKING = 'free_parking',
  WELCOME_AMENITY = 'welcome_amenity',
}

export enum VIPLevel {
  VIP = 'vip',
  SUPER_VIP = 'super_vip',
  CELEBRITY = 'celebrity',
  CORPORATE_VIP = 'corporate_vip',
  REPEAT_GUEST = 'repeat_guest',
}

// Request/Response types
export interface CreateGuestProfileRequest {
  _userId: string;
  personalInfo: PersonalInformation;
  contactInfo: ContactInformation;
  preferences?: Partial<GuestPreferences>;
  communicationPreferences?: Partial<CommunicationPreferences>;
}

export interface UpdateGuestProfileRequest {
  personalInfo?: Partial<PersonalInformation>;
  contactInfo?: Partial<ContactInformation>;
  preferences?: Partial<GuestPreferences>;
  communicationPreferences?: Partial<CommunicationPreferences>;
  accessibility?: Partial<AccessibilityRequirements>;
  dietaryRestrictions?: string[];
}

export interface GuestSearchCriteria {
  name?: string;
  email?: string;
  phone?: string;
  loyaltyTier?: LoyaltyTier;
  vipLevel?: VIPLevel;
  nationality?: string;
  registrationDateFrom?: Date;
  registrationDateTo?: Date;
  lastBookingDateFrom?: Date;
  lastBookingDateTo?: Date;
  totalBookings?: number;
  totalSpent?: number;
  sortBy?: GuestSortBy;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export enum GuestSortBy {
  NAME = 'name',
  REGISTRATION_DATE = 'registration_date',
  LAST_BOOKING_DATE = 'last_booking_date',
  TOTAL_BOOKINGS = 'total_bookings',
  TOTAL_SPENT = 'total_spent',
  LOYALTY_POINTS = 'loyalty_points',
}

export interface GuestSearchResult {
  guests: GuestProfile[];
  totalCount: number;
  hasMore: boolean;
}

export interface GuestStatistics {
  totalGuests: number;
  newGuestsThisMonth: number;
  returningGuestsThisMonth: number;
  averageBookingsPerGuest: number;
  averageSpendPerGuest: number;
  loyaltyDistribution: LoyaltyDistribution;
  topNationalities: NationalityStatistic[];
  guestSatisfactionScore?: number;
}

export interface LoyaltyDistribution {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
  diamond: number;
}

export interface NationalityStatistic {
  nationality: string;
  count: number;
  percentage: number;
}

export interface GuestActivityLog {
  id: string;
  guestId: string;
  activityType: ActivityType;
  description: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export enum ActivityType {
  PROFILE_CREATED = 'profile_created',
  PROFILE_UPDATED = 'profile_updated',
  BOOKING_CREATED = 'booking_created',
  BOOKING_MODIFIED = 'booking_modified',
  BOOKING_CANCELLED = 'booking_cancelled',
  CHECK_IN = 'check_in',
  CHECK_OUT = 'check_out',
  LOYALTY_POINTS_EARNED = 'loyalty_points_earned',
  LOYALTY_POINTS_REDEEMED = 'loyalty_points_redeemed',
  TIER_UPGRADED = 'tier_upgraded',
  VIP_STATUS_ASSIGNED = 'vip_status_assigned',
  REVIEW_SUBMITTED = 'review_submitted',
  COMPLAINT_FILED = 'complaint_filed',
  PREFERENCE_UPDATED = 'preference_updated',
}
