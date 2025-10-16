<<<<<<< HEAD

Object.defineProperty(exports, "__esModule", { value: true });
=======
Object.defineProperty(exports, '__esModule', { value: true });
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
<<<<<<< HEAD
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}
=======
  skip,
} = require('./runtime/index-browser.js');

const Prisma = {};

exports.Prisma = Prisma;
exports.$Enums = {};
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
<<<<<<< HEAD
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}
=======
  client: '5.22.0',
  engine: '605197351a3c8bdd595af2d2a9bc3025bca48ea2',
};
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
<<<<<<< HEAD
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal
=======
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
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
<<<<<<< HEAD
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
=======
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
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03

/**
 * Shorthand utilities for JSON filtering
 */
<<<<<<< HEAD
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull
=======
Prisma.DbNull = objectEnumValues.instances.DbNull;
Prisma.JsonNull = objectEnumValues.instances.JsonNull;
Prisma.AnyNull = objectEnumValues.instances.AnyNull;
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
<<<<<<< HEAD
  AnyNull: objectEnumValues.classes.AnyNull
}


=======
  AnyNull: objectEnumValues.classes.AnyNull,
};
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
<<<<<<< HEAD
  Serializable: 'Serializable'
=======
  Serializable: 'Serializable',
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
});

exports.Prisma.PropertyScalarFieldEnum = {
  id: 'id',
<<<<<<< HEAD
  slug: 'slug',
=======
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
  name: 'name',
  description: 'description',
  category: 'category',
  address: 'address',
  coordinates: 'coordinates',
  timezone: 'timezone',
  starRating: 'starRating',
  amenities: 'amenities',
  policies: 'policies',
<<<<<<< HEAD
  email: 'email',
  phone: 'phone',
  website: 'website',
  contactInfo: 'contactInfo',
  checkInTime: 'checkInTime',
  checkOutTime: 'checkOutTime',
=======
  contactInfo: 'contactInfo',
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
  images: 'images',
  virtualTour: 'virtualTour',
  ownerId: 'ownerId',
  chainId: 'chainId',
  brandId: 'brandId',
<<<<<<< HEAD
  taxId: 'taxId',
  currency: 'currency',
  status: 'status',
  settings: 'settings',
  deletedAt: 'deletedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
=======
  status: 'status',
  settings: 'settings',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
};

exports.Prisma.RoomTypeScalarFieldEnum = {
  id: 'id',
  propertyId: 'propertyId',
  name: 'name',
  description: 'description',
  category: 'category',
  maxOccupancy: 'maxOccupancy',
<<<<<<< HEAD
  maxAdults: 'maxAdults',
  maxChildren: 'maxChildren',
=======
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
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
<<<<<<< HEAD
  updatedAt: 'updatedAt'
=======
  updatedAt: 'updatedAt',
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
};

exports.Prisma.BookingScalarFieldEnum = {
  id: 'id',
  confirmationNumber: 'confirmationNumber',
  propertyId: 'propertyId',
  guestId: 'guestId',
<<<<<<< HEAD
  guestProfileId: 'guestProfileId',
  guestName: 'guestName',
  guestEmail: 'guestEmail',
  guestPhone: 'guestPhone',
=======
  primaryGuest: 'primaryGuest',
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
  additionalGuests: 'additionalGuests',
  checkInDate: 'checkInDate',
  checkOutDate: 'checkOutDate',
  nights: 'nights',
<<<<<<< HEAD
  actualCheckInTime: 'actualCheckInTime',
  actualCheckOutTime: 'actualCheckOutTime',
  subtotal: 'subtotal',
  taxAmount: 'taxAmount',
  discountAmount: 'discountAmount',
  totalAmount: 'totalAmount',
  currency: 'currency',
  pricingDetails: 'pricingDetails',
=======
  rooms: 'rooms',
  pricing: 'pricing',
  totalAmount: 'totalAmount',
  currency: 'currency',
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
  status: 'status',
  bookingSource: 'bookingSource',
  specialRequests: 'specialRequests',
  preferences: 'preferences',
  paymentStatus: 'paymentStatus',
  paymentMethod: 'paymentMethod',
<<<<<<< HEAD
  cancellationPolicyId: 'cancellationPolicyId',
  cancellationDeadline: 'cancellationDeadline',
  noShowPolicy: 'noShowPolicy',
  bookedAt: 'bookedAt',
  cancelledAt: 'cancelledAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  metadata: 'metadata'
=======
  cancellationPolicy: 'cancellationPolicy',
  noShowPolicy: 'noShowPolicy',
  bookedAt: 'bookedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  metadata: 'metadata',
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
};

exports.Prisma.BookedRoomScalarFieldEnum = {
  id: 'id',
  bookingId: 'bookingId',
  roomTypeId: 'roomTypeId',
  roomNumber: 'roomNumber',
  quantity: 'quantity',
  guestCount: 'guestCount',
<<<<<<< HEAD
  ratePerNight: 'ratePerNight',
  nights: 'nights',
  subtotal: 'subtotal',
  taxAmount: 'taxAmount',
  totalPrice: 'totalPrice',
  guests: 'guests',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BookingHistoryScalarFieldEnum = {
  id: 'id',
  bookingId: 'bookingId',
  action: 'action',
  changedBy: 'changedBy',
  changeType: 'changeType',
  oldValue: 'oldValue',
  newValue: 'newValue',
  description: 'description',
  timestamp: 'timestamp'
=======
  rate: 'rate',
  totalPrice: 'totalPrice',
  guests: 'guests',
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
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
<<<<<<< HEAD
  updatedAt: 'updatedAt'
=======
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
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
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
<<<<<<< HEAD
  updatedAt: 'updatedAt'
=======
  updatedAt: 'updatedAt',
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
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
<<<<<<< HEAD
  updatedAt: 'updatedAt'
=======
  updatedAt: 'updatedAt',
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
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
<<<<<<< HEAD
  updatedAt: 'updatedAt'
=======
  updatedAt: 'updatedAt',
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
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
<<<<<<< HEAD
  usageLimit: 'usageLimit',
  usageCount: 'usageCount',
  perUserLimit: 'perUserLimit',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
=======
  usage: 'usage',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
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
<<<<<<< HEAD
  updatedAt: 'updatedAt'
};

exports.Prisma.CancellationPolicyScalarFieldEnum = {
  id: 'id',
  propertyId: 'propertyId',
  name: 'name',
  description: 'description',
  refundPercentage: 'refundPercentage',
  hoursBeforeCheckIn: 'hoursBeforeCheckIn',
  penaltyType: 'penaltyType',
  penaltyValue: 'penaltyValue',
  isActive: 'isActive',
  isDefault: 'isDefault',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
=======
  updatedAt: 'updatedAt',
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
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
<<<<<<< HEAD
  updatedAt: 'updatedAt'
};

exports.Prisma.PropertyHoursScalarFieldEnum = {
  id: 'id',
  propertyId: 'propertyId',
  type: 'type',
  name: 'name',
  hours: 'hours',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
=======
  updatedAt: 'updatedAt',
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
};

exports.Prisma.GuestProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
<<<<<<< HEAD
  firstName: 'firstName',
  lastName: 'lastName',
  dateOfBirth: 'dateOfBirth',
  nationality: 'nationality',
  passportNumber: 'passportNumber',
  email: 'email',
  phone: 'phone',
  alternatePhone: 'alternatePhone',
  address: 'address',
  roomPreferences: 'roomPreferences',
  amenityPreferences: 'amenityPreferences',
  languagePreference: 'languagePreference',
  loyaltyTier: 'loyaltyTier',
  loyaltyPoints: 'loyaltyPoints',
  totalSpent: 'totalSpent',
  bookingCount: 'bookingCount',
  accessibility: 'accessibility',
  dietaryRestrictions: 'dietaryRestrictions',
  allergies: 'allergies',
  emailNotifications: 'emailNotifications',
  smsNotifications: 'smsNotifications',
  marketingEmails: 'marketingEmails',
  isVip: 'isVip',
  vipNotes: 'vipNotes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  lastBookingDate: 'lastBookingDate'
=======
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
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
};

exports.Prisma.GuestActivityLogScalarFieldEnum = {
  id: 'id',
  guestId: 'guestId',
  activityType: 'activityType',
  description: 'description',
  metadata: 'metadata',
<<<<<<< HEAD
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  timestamp: 'timestamp'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  propertyId: 'propertyId',
  bookingId: 'bookingId',
  guestId: 'guestId',
  overallRating: 'overallRating',
  cleanlinessRating: 'cleanlinessRating',
  locationRating: 'locationRating',
  serviceRating: 'serviceRating',
  valueRating: 'valueRating',
  amenitiesRating: 'amenitiesRating',
  title: 'title',
  comment: 'comment',
  pros: 'pros',
  cons: 'cons',
  propertyResponse: 'propertyResponse',
  respondedAt: 'respondedAt',
  respondedBy: 'respondedBy',
  isVerified: 'isVerified',
  isPublished: 'isPublished',
  helpfulCount: 'helpfulCount',
  reportCount: 'reportCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
=======
  timestamp: 'timestamp',
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
};

exports.Prisma.SortOrder = {
  asc: 'asc',
<<<<<<< HEAD
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
=======
  desc: 'desc',
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull,
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
<<<<<<< HEAD
  JsonNull: Prisma.JsonNull
=======
  JsonNull: Prisma.JsonNull,
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
};

exports.Prisma.QueryMode = {
  default: 'default',
<<<<<<< HEAD
  insensitive: 'insensitive'
=======
  insensitive: 'insensitive',
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
<<<<<<< HEAD
  AnyNull: Prisma.AnyNull
=======
  AnyNull: Prisma.AnyNull,
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
};

exports.Prisma.NullsOrder = {
  first: 'first',
<<<<<<< HEAD
  last: 'last'
};


=======
  last: 'last',
};

>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
exports.Prisma.ModelName = {
  Property: 'Property',
  RoomType: 'RoomType',
  Booking: 'Booking',
  BookedRoom: 'BookedRoom',
<<<<<<< HEAD
  BookingHistory: 'BookingHistory',
  InventoryRecord: 'InventoryRecord',
=======
  InventoryRecord: 'InventoryRecord',
  InventoryReservation: 'InventoryReservation',
  InventoryLock: 'InventoryLock',
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
  RateRecord: 'RateRecord',
  DynamicPricingRule: 'DynamicPricingRule',
  SeasonalRate: 'SeasonalRate',
  Promotion: 'Promotion',
  GroupDiscount: 'GroupDiscount',
<<<<<<< HEAD
  CancellationPolicy: 'CancellationPolicy',
  TaxConfiguration: 'TaxConfiguration',
  PropertyHours: 'PropertyHours',
  GuestProfile: 'GuestProfile',
  GuestActivityLog: 'GuestActivityLog',
  Review: 'Review'
=======
  TaxConfiguration: 'TaxConfiguration',
  GuestProfile: 'GuestProfile',
  GuestActivityLog: 'GuestActivityLog',
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
<<<<<<< HEAD
        let message
        const runtime = getRuntime()
=======
        let message;
        const runtime = getRuntime();
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
<<<<<<< HEAD
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
=======
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
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
