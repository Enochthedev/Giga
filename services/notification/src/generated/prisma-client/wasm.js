
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

exports.Prisma.TemplateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  category: 'category',
  channels: 'channels',
  activeVersion: 'activeVersion',
  languages: 'languages',
  defaultLanguage: 'defaultLanguage',
  requiredVariables: 'requiredVariables',
  optionalVariables: 'optionalVariables',
  variableSchema: 'variableSchema',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isActive: 'isActive'
};

exports.Prisma.TemplateVersionScalarFieldEnum = {
  id: 'id',
  templateId: 'templateId',
  version: 'version',
  content: 'content',
  changelog: 'changelog',
  createdAt: 'createdAt',
  isActive: 'isActive'
};

exports.Prisma.CompiledTemplateScalarFieldEnum = {
  id: 'id',
  templateId: 'templateId',
  version: 'version',
  language: 'language',
  channel: 'channel',
  compiledContent: 'compiledContent',
  requiredVariables: 'requiredVariables',
  compiledAt: 'compiledAt',
  expiresAt: 'expiresAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  email: 'email',
  phone: 'phone',
  templateId: 'templateId',
  channels: 'channels',
  priority: 'priority',
  category: 'category',
  subject: 'subject',
  content: 'content',
  variables: 'variables',
  renderedContent: 'renderedContent',
  status: 'status',
  scheduledAt: 'scheduledAt',
  sentAt: 'sentAt',
  deliveredAt: 'deliveredAt',
  trackingEnabled: 'trackingEnabled',
  trackingData: 'trackingData',
  fromService: 'fromService',
  fromUserId: 'fromUserId',
  metadata: 'metadata',
  tags: 'tags',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationDeliveryTrackingScalarFieldEnum = {
  id: 'id',
  notificationId: 'notificationId',
  channel: 'channel',
  provider: 'provider',
  status: 'status',
  providerMessageId: 'providerMessageId',
  sentAt: 'sentAt',
  deliveredAt: 'deliveredAt',
  openedAt: 'openedAt',
  clickedAt: 'clickedAt',
  bouncedAt: 'bouncedAt',
  complainedAt: 'complainedAt',
  errorCode: 'errorCode',
  errorMessage: 'errorMessage',
  retryCount: 'retryCount',
  providerResponse: 'providerResponse',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserNotificationPreferencesScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  emailEnabled: 'emailEnabled',
  smsEnabled: 'smsEnabled',
  pushEnabled: 'pushEnabled',
  inAppEnabled: 'inAppEnabled',
  categoryPreferences: 'categoryPreferences',
  globalOptOut: 'globalOptOut',
  quietHours: 'quietHours',
  maxDailyNotifications: 'maxDailyNotifications',
  maxWeeklyNotifications: 'maxWeeklyNotifications',
  consentDate: 'consentDate',
  optOutDate: 'optOutDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationSuppressionListScalarFieldEnum = {
  id: 'id',
  identifier: 'identifier',
  channel: 'channel',
  reason: 'reason',
  addedBy: 'addedBy',
  addedAt: 'addedAt',
  expiresAt: 'expiresAt',
  isActive: 'isActive'
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

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  Template: 'Template',
  TemplateVersion: 'TemplateVersion',
  CompiledTemplate: 'CompiledTemplate',
  Notification: 'Notification',
  NotificationDeliveryTracking: 'NotificationDeliveryTracking',
  UserNotificationPreferences: 'UserNotificationPreferences',
  NotificationSuppressionList: 'NotificationSuppressionList'
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
