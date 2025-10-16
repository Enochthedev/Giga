
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

exports.Prisma.FileMetadataScalarFieldEnum = {
  id: 'id',
  originalName: 'originalName',
  fileName: 'fileName',
  mimeType: 'mimeType',
  size: 'size',
  path: 'path',
  url: 'url',
  cdnUrl: 'cdnUrl',
  uploadedBy: 'uploadedBy',
  entityType: 'entityType',
  entityId: 'entityId',
  status: 'status',
  processingResults: 'processingResults',
  thumbnails: 'thumbnails',
  accessLevel: 'accessLevel',
  permissions: 'permissions',
  metadata: 'metadata',
  tags: 'tags',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  expiresAt: 'expiresAt'
};

exports.Prisma.FileRelationshipScalarFieldEnum = {
  id: 'id',
  parentId: 'parentId',
  childId: 'childId',
  relationshipType: 'relationshipType',
  createdAt: 'createdAt'
};

exports.Prisma.UploadSessionScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  uploadedBy: 'uploadedBy',
  status: 'status',
  totalFiles: 'totalFiles',
  uploadedFiles: 'uploadedFiles',
  failedFiles: 'failedFiles',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  expiresAt: 'expiresAt'
};

exports.Prisma.UploadSessionFileScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  fileId: 'fileId',
  originalName: 'originalName',
  status: 'status',
  errorMessage: 'errorMessage',
  processingOrder: 'processingOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProcessingJobScalarFieldEnum = {
  id: 'id',
  fileId: 'fileId',
  jobType: 'jobType',
  status: 'status',
  priority: 'priority',
  attempts: 'attempts',
  maxAttempts: 'maxAttempts',
  payload: 'payload',
  result: 'result',
  errorMessage: 'errorMessage',
  scheduledAt: 'scheduledAt',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AccessLogScalarFieldEnum = {
  id: 'id',
  fileId: 'fileId',
  operation: 'operation',
  userId: 'userId',
  serviceId: 'serviceId',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  success: 'success',
  errorCode: 'errorCode',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.StorageQuotaScalarFieldEnum = {
  id: 'id',
  entityType: 'entityType',
  entityId: 'entityId',
  quotaBytes: 'quotaBytes',
  usedBytes: 'usedBytes',
  fileCount: 'fileCount',
  lastUpdated: 'lastUpdated',
  createdAt: 'createdAt'
};

exports.Prisma.RetentionPolicyScalarFieldEnum = {
  id: 'id',
  name: 'name',
  entityType: 'entityType',
  retentionPeriodDays: 'retentionPeriodDays',
  jurisdiction: 'jurisdiction',
  isActive: 'isActive',
  description: 'description',
  legalBasis: 'legalBasis',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RetentionPolicyRuleScalarFieldEnum = {
  id: 'id',
  policyId: 'policyId',
  condition: 'condition',
  action: 'action',
  priority: 'priority',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LegalHoldScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  entityType: 'entityType',
  entityIds: 'entityIds',
  fileIds: 'fileIds',
  isActive: 'isActive',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  expiresAt: 'expiresAt'
};

exports.Prisma.DataDeletionRequestScalarFieldEnum = {
  id: 'id',
  requestType: 'requestType',
  entityType: 'entityType',
  entityId: 'entityId',
  requestedBy: 'requestedBy',
  status: 'status',
  scheduledAt: 'scheduledAt',
  processedAt: 'processedAt',
  filesDeleted: 'filesDeleted',
  errorMessage: 'errorMessage',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RetentionAuditLogScalarFieldEnum = {
  id: 'id',
  fileId: 'fileId',
  entityType: 'entityType',
  entityId: 'entityId',
  action: 'action',
  details: 'details',
  performedBy: 'performedBy',
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

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.EntityType = exports.$Enums.EntityType = {
  USER_PROFILE: 'USER_PROFILE',
  PRODUCT: 'PRODUCT',
  PROPERTY: 'PROPERTY',
  VEHICLE: 'VEHICLE',
  DOCUMENT: 'DOCUMENT',
  ADVERTISEMENT: 'ADVERTISEMENT'
};

exports.FileStatus = exports.$Enums.FileStatus = {
  UPLOADING: 'UPLOADING',
  PROCESSING: 'PROCESSING',
  READY: 'READY',
  FAILED: 'FAILED',
  DELETED: 'DELETED'
};

exports.AccessLevel = exports.$Enums.AccessLevel = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  RESTRICTED: 'RESTRICTED'
};

exports.RelationshipType = exports.$Enums.RelationshipType = {
  THUMBNAIL: 'THUMBNAIL',
  VARIANT: 'VARIANT',
  PROCESSED: 'PROCESSED',
  BACKUP: 'BACKUP',
  RELATED: 'RELATED'
};

exports.UploadStatus = exports.$Enums.UploadStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

exports.ProcessingJobType = exports.$Enums.ProcessingJobType = {
  IMAGE_RESIZE: 'IMAGE_RESIZE',
  THUMBNAIL_GENERATION: 'THUMBNAIL_GENERATION',
  FORMAT_CONVERSION: 'FORMAT_CONVERSION',
  METADATA_EXTRACTION: 'METADATA_EXTRACTION',
  VIRUS_SCAN: 'VIRUS_SCAN',
  CONTENT_ANALYSIS: 'CONTENT_ANALYSIS'
};

exports.JobStatus = exports.$Enums.JobStatus = {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

exports.AccessOperation = exports.$Enums.AccessOperation = {
  READ: 'READ',
  write: 'write',
  delete: 'delete',
  share: 'share'
};

exports.DataDeletionRequestType = exports.$Enums.DataDeletionRequestType = {
  USER_REQUEST: 'USER_REQUEST',
  GDPR_REQUEST: 'GDPR_REQUEST',
  POLICY_EXPIRATION: 'POLICY_EXPIRATION',
  LEGAL_HOLD_RELEASE: 'LEGAL_HOLD_RELEASE'
};

exports.DeletionRequestStatus = exports.$Enums.DeletionRequestStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

exports.RetentionAuditAction = exports.$Enums.RetentionAuditAction = {
  POLICY_CREATED: 'POLICY_CREATED',
  POLICY_UPDATED: 'POLICY_UPDATED',
  POLICY_DELETED: 'POLICY_DELETED',
  LEGAL_HOLD_CREATED: 'LEGAL_HOLD_CREATED',
  LEGAL_HOLD_RELEASED: 'LEGAL_HOLD_RELEASED',
  FILE_EXPIRED: 'FILE_EXPIRED',
  FILE_DELETED: 'FILE_DELETED',
  FILE_ANONYMIZED: 'FILE_ANONYMIZED',
  DELETION_REQUEST_CREATED: 'DELETION_REQUEST_CREATED',
  DELETION_REQUEST_PROCESSED: 'DELETION_REQUEST_PROCESSED'
};

exports.Prisma.ModelName = {
  FileMetadata: 'FileMetadata',
  FileRelationship: 'FileRelationship',
  UploadSession: 'UploadSession',
  UploadSessionFile: 'UploadSessionFile',
  ProcessingJob: 'ProcessingJob',
  AccessLog: 'AccessLog',
  StorageQuota: 'StorageQuota',
  RetentionPolicy: 'RetentionPolicy',
  RetentionPolicyRule: 'RetentionPolicyRule',
  LegalHold: 'LegalHold',
  DataDeletionRequest: 'DataDeletionRequest',
  RetentionAuditLog: 'RetentionAuditLog'
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
