
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
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

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
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

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  phone: 'phone',
  passwordHash: 'passwordHash',
  firstName: 'firstName',
  lastName: 'lastName',
  avatar: 'avatar',
  isEmailVerified: 'isEmailVerified',
  isPhoneVerified: 'isPhoneVerified',
  isActive: 'isActive',
  lastLoginAt: 'lastLoginAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  activeRole: 'activeRole'
};

exports.Prisma.RoleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PermissionScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  createdAt: 'createdAt'
};

exports.Prisma.UserRoleScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  roleId: 'roleId',
  assignedAt: 'assignedAt'
};

exports.Prisma.CustomerProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  preferences: 'preferences',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VendorProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  businessName: 'businessName',
  businessType: 'businessType',
  description: 'description',
  logo: 'logo',
  website: 'website',
  subscriptionTier: 'subscriptionTier',
  commissionRate: 'commissionRate',
  isVerified: 'isVerified',
  rating: 'rating',
  totalSales: 'totalSales',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DriverProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  licenseNumber: 'licenseNumber',
  vehicleInfo: 'vehicleInfo',
  isOnline: 'isOnline',
  currentLocation: 'currentLocation',
  rating: 'rating',
  totalRides: 'totalRides',
  isVerified: 'isVerified',
  subscriptionTier: 'subscriptionTier',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.HostProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  businessName: 'businessName',
  description: 'description',
  rating: 'rating',
  totalBookings: 'totalBookings',
  isVerified: 'isVerified',
  subscriptionTier: 'subscriptionTier',
  responseRate: 'responseRate',
  responseTime: 'responseTime',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AdvertiserProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  companyName: 'companyName',
  industry: 'industry',
  website: 'website',
  totalSpend: 'totalSpend',
  isVerified: 'isVerified',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AddressScalarFieldEnum = {
  id: 'id',
  customerProfileId: 'customerProfileId',
  label: 'label',
  address: 'address',
  city: 'city',
  country: 'country',
  isDefault: 'isDefault',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RefreshTokenScalarFieldEnum = {
  id: 'id',
  token: 'token',
  userId: 'userId',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt',
  deviceId: 'deviceId',
  sessionId: 'sessionId',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent'
};

exports.Prisma.EmailVerificationTokenScalarFieldEnum = {
  id: 'id',
  token: 'token',
  userId: 'userId',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.PasswordResetTokenScalarFieldEnum = {
  id: 'id',
  token: 'token',
  userId: 'userId',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.PasswordHistoryScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  passwordHash: 'passwordHash',
  createdAt: 'createdAt'
};

exports.Prisma.PhoneVerificationCodeScalarFieldEnum = {
  id: 'id',
  code: 'code',
  userId: 'userId',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  action: 'action',
  adminUserId: 'adminUserId',
  targetUserId: 'targetUserId',
  details: 'details',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  createdAt: 'createdAt'
};

exports.Prisma.TokenEventScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  eventType: 'eventType',
  deviceId: 'deviceId',
  sessionId: 'sessionId',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.DeviceSessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  deviceId: 'deviceId',
  sessionId: 'sessionId',
  deviceFingerprint: 'deviceFingerprint',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  isActive: 'isActive',
  lastUsed: 'lastUsed',
  createdAt: 'createdAt',
  expiresAt: 'expiresAt'
};

exports.Prisma.BlacklistedTokenScalarFieldEnum = {
  id: 'id',
  tokenHash: 'tokenHash',
  tokenType: 'tokenType',
  userId: 'userId',
  reason: 'reason',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.SecurityEventScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  eventType: 'eventType',
  deviceId: 'deviceId',
  ipAddress: 'ipAddress',
  deviceFingerprint: 'deviceFingerprint',
  riskScore: 'riskScore',
  riskLevel: 'riskLevel',
  riskFactors: 'riskFactors',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.RoleName = exports.$Enums.RoleName = {
  CUSTOMER: 'CUSTOMER',
  VENDOR: 'VENDOR',
  DRIVER: 'DRIVER',
  HOST: 'HOST',
  ADVERTISER: 'ADVERTISER',
  ADMIN: 'ADMIN'
};

exports.SubscriptionTier = exports.$Enums.SubscriptionTier = {
  BASIC: 'BASIC',
  PRO: 'PRO',
  ENTERPRISE: 'ENTERPRISE'
};

exports.DriverTier = exports.$Enums.DriverTier = {
  BASIC: 'BASIC',
  PRO: 'PRO'
};

exports.HostTier = exports.$Enums.HostTier = {
  BASIC: 'BASIC',
  PRO: 'PRO'
};

exports.Prisma.ModelName = {
  User: 'User',
  Role: 'Role',
  Permission: 'Permission',
  UserRole: 'UserRole',
  CustomerProfile: 'CustomerProfile',
  VendorProfile: 'VendorProfile',
  DriverProfile: 'DriverProfile',
  HostProfile: 'HostProfile',
  AdvertiserProfile: 'AdvertiserProfile',
  Address: 'Address',
  RefreshToken: 'RefreshToken',
  EmailVerificationToken: 'EmailVerificationToken',
  PasswordResetToken: 'PasswordResetToken',
  PasswordHistory: 'PasswordHistory',
  PhoneVerificationCode: 'PhoneVerificationCode',
  AuditLog: 'AuditLog',
  TokenEvent: 'TokenEvent',
  DeviceSession: 'DeviceSession',
  BlacklistedToken: 'BlacklistedToken',
  SecurityEvent: 'SecurityEvent'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
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
