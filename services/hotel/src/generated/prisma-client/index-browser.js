Object.defineProperty(exports, '__esModule', { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip,
} = require('./runtime/index-browser.js');

const Prisma = {};

exports.Prisma = Prisma;
exports.$Enums = {};

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: '5.22.0',
  engine: '605197351a3c8bdd595af2d2a9bc3025bca48ea2',
};

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.Decimal = Decimal;

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.validator = Public.validator;

/**
 * Extensions
 */
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull;
Prisma.JsonNull = objectEnumValues.instances.JsonNull;
Prisma.AnyNull = objectEnumValues.instances.AnyNull;

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull,
};

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable',
});

exports.Prisma.PropertyScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  category: 'category',
  address: 'address',
  coordinates: 'coordinates',
  timezone: 'timezone',
  starRating: 'starRating',
  amenities: 'amenities',
  policies: 'policies',
  contactInfo: 'contactInfo',
  images: 'images',
  virtualTour: 'virtualTour',
  ownerId: 'ownerId',
  chainId: 'chainId',
  brandId: 'brandId',
  status: 'status',
  settings: 'settings',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

exports.Prisma.RoomTypeScalarFieldEnum = {
  id: 'id',
  propertyId: 'propertyId',
  name: 'name',
  description: 'description',
  category: 'category',
  maxOccupancy: 'maxOccupancy',
  bedConfiguration: 'bedConfiguration',
  roomSize: 'roomSize',
  roomSizeUnit: 'roomSizeUnit',
  amenities: 'amenities',
  view: 'view',
  floor: 'floor',
  totalRooms: 'totalRooms',
  baseRate: 'baseRate',
  currency: 'currency',
  images: 'images',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

exports.Prisma.BookingScalarFieldEnum = {
  id: 'id',
  confirmationNumber: 'confirmationNumber',
  propertyId: 'propertyId',
  guestId: 'guestId',
  primaryGuest: 'primaryGuest',
  additionalGuests: 'additionalGuests',
  checkInDate: 'checkInDate',
  checkOutDate: 'checkOutDate',
  nights: 'nights',
  rooms: 'rooms',
  pricing: 'pricing',
  totalAmount: 'totalAmount',
  currency: 'currency',
  status: 'status',
  bookingSource: 'bookingSource',
  specialRequests: 'specialRequests',
  preferences: 'preferences',
  paymentStatus: 'paymentStatus',
  paymentMethod: 'paymentMethod',
  cancellationPolicy: 'cancellationPolicy',
  noShowPolicy: 'noShowPolicy',
  bookedAt: 'bookedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  metadata: 'metadata',
};

exports.Prisma.BookedRoomScalarFieldEnum = {
  id: 'id',
  bookingId: 'bookingId',
  roomTypeId: 'roomTypeId',
  roomNumber: 'roomNumber',
  quantity: 'quantity',
  guestCount: 'guestCount',
  rate: 'rate',
  totalPrice: 'totalPrice',
  guests: 'guests',
};

exports.Prisma.InventoryRecordScalarFieldEnum = {
  id: 'id',
  propertyId: 'propertyId',
  roomTypeId: 'roomTypeId',
  date: 'date',
  totalRooms: 'totalRooms',
  availableRooms: 'availableRooms',
  reservedRooms: 'reservedRooms',
  blockedRooms: 'blockedRooms',
  overbookingLimit: 'overbookingLimit',
  minimumStay: 'minimumStay',
  maximumStay: 'maximumStay',
  closedToArrival: 'closedToArrival',
  closedToDeparture: 'closedToDeparture',
  stopSell: 'stopSell',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

exports.Prisma.InventoryReservationScalarFieldEnum = {
  id: 'id',
  propertyId: 'propertyId',
  roomTypeId: 'roomTypeId',
  checkInDate: 'checkInDate',
  checkOutDate: 'checkOutDate',
  roomQuantity: 'roomQuantity',
  status: 'status',
  expiresAt: 'expiresAt',
  bookingId: 'bookingId',
  createdAt: 'createdAt',
};

exports.Prisma.InventoryLockScalarFieldEnum = {
  id: 'id',
  propertyId: 'propertyId',
  roomTypeId: 'roomTypeId',
  checkInDate: 'checkInDate',
  checkOutDate: 'checkOutDate',
  quantity: 'quantity',
  lockedBy: 'lockedBy',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt',
};

exports.Prisma.RateRecordScalarFieldEnum = {
  id: 'id',
  propertyId: 'propertyId',
  roomTypeId: 'roomTypeId',
  date: 'date',
  rate: 'rate',
  currency: 'currency',
  rateType: 'rateType',
  minimumStay: 'minimumStay',
  maximumStay: 'maximumStay',
  advanceBookingDays: 'advanceBookingDays',
  restrictions: 'restrictions',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

exports.Prisma.DynamicPricingRuleScalarFieldEnum = {
  id: 'id',
  propertyId: 'propertyId',
  name: 'name',
  description: 'description',
  type: 'type',
  isActive: 'isActive',
  priority: 'priority',
  conditions: 'conditions',
  adjustments: 'adjustments',
  validFrom: 'validFrom',
  validTo: 'validTo',
  applicableRoomTypes: 'applicableRoomTypes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

exports.Prisma.SeasonalRateScalarFieldEnum = {
  id: 'id',
  propertyId: 'propertyId',
  name: 'name',
  description: 'description',
  startDate: 'startDate',
  endDate: 'endDate',
  roomTypeRates: 'roomTypeRates',
  isActive: 'isActive',
  priority: 'priority',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

exports.Prisma.PromotionScalarFieldEnum = {
  id: 'id',
  propertyId: 'propertyId',
  code: 'code',
  name: 'name',
  description: 'description',
  type: 'type',
  discountType: 'discountType',
  discountValue: 'discountValue',
  maxDiscount: 'maxDiscount',
  validFrom: 'validFrom',
  validTo: 'validTo',
  conditions: 'conditions',
  usage: 'usage',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

exports.Prisma.GroupDiscountScalarFieldEnum = {
  id: 'id',
  propertyId: 'propertyId',
  name: 'name',
  description: 'description',
  minimumRooms: 'minimumRooms',
  discountType: 'discountType',
  discountValue: 'discountValue',
  validFrom: 'validFrom',
  validTo: 'validTo',
  applicableRoomTypes: 'applicableRoomTypes',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

exports.Prisma.TaxConfigurationScalarFieldEnum = {
  id: 'id',
  propertyId: 'propertyId',
  name: 'name',
  type: 'type',
  rate: 'rate',
  isPercentage: 'isPercentage',
  isInclusive: 'isInclusive',
  applicableRoomTypes: 'applicableRoomTypes',
  validFrom: 'validFrom',
  validTo: 'validTo',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

exports.Prisma.GuestProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  personalInfo: 'personalInfo',
  contactInfo: 'contactInfo',
  preferences: 'preferences',
  bookingHistory: 'bookingHistory',
  loyaltyStatus: 'loyaltyStatus',
  loyaltyPoints: 'loyaltyPoints',
  accessibility: 'accessibility',
  dietaryRestrictions: 'dietaryRestrictions',
  communicationPreferences: 'communicationPreferences',
  vipStatus: 'vipStatus',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  lastBookingDate: 'lastBookingDate',
  lastLoginDate: 'lastLoginDate',
};

exports.Prisma.GuestActivityLogScalarFieldEnum = {
  id: 'id',
  guestId: 'guestId',
  activityType: 'activityType',
  description: 'description',
  metadata: 'metadata',
  timestamp: 'timestamp',
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc',
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull,
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive',
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull,
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last',
};

exports.Prisma.ModelName = {
  Property: 'Property',
  RoomType: 'RoomType',
  Booking: 'Booking',
  BookedRoom: 'BookedRoom',
  InventoryRecord: 'InventoryRecord',
  InventoryReservation: 'InventoryReservation',
  InventoryLock: 'InventoryLock',
  RateRecord: 'RateRecord',
  DynamicPricingRule: 'DynamicPricingRule',
  SeasonalRate: 'SeasonalRate',
  Promotion: 'Promotion',
  GroupDiscount: 'GroupDiscount',
  TaxConfiguration: 'TaxConfiguration',
  GuestProfile: 'GuestProfile',
  GuestActivityLog: 'GuestActivityLog',
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message;
        const runtime = getRuntime();
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message =
            'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' +
            runtime.prettyName +
            '`).';
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`;

        throw new Error(message);
      },
    });
  }
}

exports.PrismaClient = PrismaClient;

Object.assign(exports, Prisma);
