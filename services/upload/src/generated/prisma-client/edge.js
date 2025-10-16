
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/edge.js')


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

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

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
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/Users/user/Documents/Giga/services/upload/src/generated/prisma-client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "darwin-arm64",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "/Users/user/Documents/Giga/services/upload/prisma/schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../../../prisma",
  "clientVersion": "5.22.0",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\ngenerator client {\n  provider = \"prisma-client-js\"\n  output   = \"../src/generated/prisma-client\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel FileMetadata {\n  id           String  @id @default(cuid())\n  originalName String\n  fileName     String\n  mimeType     String\n  size         Int\n  path         String  @unique\n  url          String\n  cdnUrl       String?\n\n  // Context information\n  uploadedBy String\n  entityType EntityType\n  entityId   String\n\n  // Processing information\n  status            FileStatus\n  processingResults Json?\n  thumbnails        Json?\n\n  // Security and access\n  accessLevel AccessLevel\n  permissions Json?\n\n  // Additional metadata\n  metadata Json?\n  tags     String[]\n\n  // Timestamps\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  expiresAt DateTime?\n\n  // Relationships\n  parentRelationships FileRelationship[]  @relation(\"ParentFile\")\n  childRelationships  FileRelationship[]  @relation(\"ChildFile\")\n  sessionFiles        UploadSessionFile[]\n\n  @@index([entityType, entityId])\n  @@index([uploadedBy])\n  @@index([status])\n  @@index([accessLevel])\n  @@index([createdAt])\n  @@map(\"file_metadata\")\n}\n\nmodel FileRelationship {\n  id               String           @id @default(cuid())\n  parentId         String\n  childId          String\n  relationshipType RelationshipType\n  createdAt        DateTime         @default(now())\n\n  parent FileMetadata @relation(\"ParentFile\", fields: [parentId], references: [id], onDelete: Cascade)\n  child  FileMetadata @relation(\"ChildFile\", fields: [childId], references: [id], onDelete: Cascade)\n\n  @@unique([parentId, childId, relationshipType])\n  @@map(\"file_relationships\")\n}\n\nmodel UploadSession {\n  id            String       @id @default(cuid())\n  sessionId     String       @unique\n  uploadedBy    String\n  status        UploadStatus\n  totalFiles    Int          @default(0)\n  uploadedFiles Int          @default(0)\n  failedFiles   Int          @default(0)\n  metadata      Json?\n  createdAt     DateTime     @default(now())\n  updatedAt     DateTime     @updatedAt\n  expiresAt     DateTime\n\n  files UploadSessionFile[]\n\n  @@index([uploadedBy])\n  @@index([status])\n  @@map(\"upload_sessions\")\n}\n\nmodel UploadSessionFile {\n  id              String     @id @default(cuid())\n  sessionId       String\n  fileId          String?\n  originalName    String\n  status          FileStatus\n  errorMessage    String?\n  processingOrder Int\n  createdAt       DateTime   @default(now())\n  updatedAt       DateTime   @updatedAt\n\n  session UploadSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)\n  file    FileMetadata? @relation(fields: [fileId], references: [id])\n\n  @@index([sessionId])\n  @@index([status])\n  @@map(\"upload_session_files\")\n}\n\nmodel ProcessingJob {\n  id           String            @id @default(cuid())\n  fileId       String\n  jobType      ProcessingJobType\n  status       JobStatus\n  priority     Int               @default(0)\n  attempts     Int               @default(0)\n  maxAttempts  Int               @default(3)\n  payload      Json\n  result       Json?\n  errorMessage String?\n  scheduledAt  DateTime          @default(now())\n  startedAt    DateTime?\n  completedAt  DateTime?\n  createdAt    DateTime          @default(now())\n  updatedAt    DateTime          @updatedAt\n\n  @@index([status, priority])\n  @@index([fileId])\n  @@index([jobType])\n  @@map(\"processing_jobs\")\n}\n\nmodel AccessLog {\n  id        String          @id @default(cuid())\n  fileId    String\n  operation AccessOperation\n  userId    String?\n  serviceId String?\n  ipAddress String?\n  userAgent String?\n  success   Boolean\n  errorCode String?\n  metadata  Json?\n  createdAt DateTime        @default(now())\n\n  @@index([fileId])\n  @@index([operation])\n  @@index([userId])\n  @@index([serviceId])\n  @@index([createdAt])\n  @@map(\"access_logs\")\n}\n\nmodel StorageQuota {\n  id          String     @id @default(cuid())\n  entityType  EntityType\n  entityId    String\n  quotaBytes  BigInt\n  usedBytes   BigInt     @default(0)\n  fileCount   Int        @default(0)\n  lastUpdated DateTime   @updatedAt\n  createdAt   DateTime   @default(now())\n\n  @@unique([entityType, entityId])\n  @@map(\"storage_quotas\")\n}\n\nmodel RetentionPolicy {\n  id                  String     @id @default(cuid())\n  name                String\n  entityType          EntityType\n  retentionPeriodDays Int\n  jurisdiction        String\n  isActive            Boolean    @default(true)\n  description         String?\n  legalBasis          String?\n  createdAt           DateTime   @default(now())\n  updatedAt           DateTime   @updatedAt\n\n  rules RetentionPolicyRule[]\n\n  @@unique([entityType, jurisdiction])\n  @@index([entityType])\n  @@index([isActive])\n  @@map(\"retention_policies\")\n}\n\nmodel RetentionPolicyRule {\n  id        String   @id @default(cuid())\n  policyId  String\n  condition Json\n  action    Json\n  priority  Int      @default(0)\n  isActive  Boolean  @default(true)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  policy RetentionPolicy @relation(fields: [policyId], references: [id], onDelete: Cascade)\n\n  @@index([policyId])\n  @@index([priority])\n  @@map(\"retention_policy_rules\")\n}\n\nmodel LegalHold {\n  id          String      @id @default(cuid())\n  name        String\n  description String\n  entityType  EntityType?\n  entityIds   String[]\n  fileIds     String[]\n  isActive    Boolean     @default(true)\n  createdBy   String\n  createdAt   DateTime    @default(now())\n  expiresAt   DateTime?\n\n  @@index([entityType])\n  @@index([isActive])\n  @@index([createdBy])\n  @@map(\"legal_holds\")\n}\n\nmodel DataDeletionRequest {\n  id           String                  @id @default(cuid())\n  requestType  DataDeletionRequestType\n  entityType   EntityType\n  entityId     String\n  requestedBy  String\n  status       DeletionRequestStatus   @default(PENDING)\n  scheduledAt  DateTime\n  processedAt  DateTime?\n  filesDeleted Int                     @default(0)\n  errorMessage String?\n  metadata     Json?\n  createdAt    DateTime                @default(now())\n  updatedAt    DateTime                @updatedAt\n\n  @@index([entityType, entityId])\n  @@index([status])\n  @@index([requestedBy])\n  @@index([scheduledAt])\n  @@map(\"data_deletion_requests\")\n}\n\nmodel RetentionAuditLog {\n  id          String               @id @default(cuid())\n  fileId      String?\n  entityType  EntityType?\n  entityId    String?\n  action      RetentionAuditAction\n  details     Json\n  performedBy String?\n  createdAt   DateTime             @default(now())\n\n  @@index([fileId])\n  @@index([entityType, entityId])\n  @@index([action])\n  @@index([createdAt])\n  @@map(\"retention_audit_logs\")\n}\n\n// Enums\nenum EntityType {\n  USER_PROFILE\n  PRODUCT\n  PROPERTY\n  VEHICLE\n  DOCUMENT\n  ADVERTISEMENT\n\n  @@map(\"entity_type\")\n}\n\nenum FileStatus {\n  UPLOADING\n  PROCESSING\n  READY\n  FAILED\n  DELETED\n\n  @@map(\"file_status\")\n}\n\nenum AccessLevel {\n  PUBLIC\n  PRIVATE\n  RESTRICTED\n\n  @@map(\"access_level\")\n}\n\nenum RelationshipType {\n  THUMBNAIL\n  VARIANT\n  PROCESSED\n  BACKUP\n  RELATED\n\n  @@map(\"relationship_type\")\n}\n\nenum UploadStatus {\n  PENDING\n  IN_PROGRESS\n  COMPLETED\n  FAILED\n  CANCELLED\n\n  @@map(\"upload_status\")\n}\n\nenum ProcessingJobType {\n  IMAGE_RESIZE\n  THUMBNAIL_GENERATION\n  FORMAT_CONVERSION\n  METADATA_EXTRACTION\n  VIRUS_SCAN\n  CONTENT_ANALYSIS\n\n  @@map(\"processing_job_type\")\n}\n\nenum JobStatus {\n  PENDING\n  RUNNING\n  COMPLETED\n  FAILED\n  CANCELLED\n\n  @@map(\"job_status\")\n}\n\nenum AccessOperation {\n  READ\n  write\n  delete\n  share\n\n  @@map(\"access_operation\")\n}\n\nenum DataDeletionRequestType {\n  USER_REQUEST\n  GDPR_REQUEST\n  POLICY_EXPIRATION\n  LEGAL_HOLD_RELEASE\n\n  @@map(\"data_deletion_request_type\")\n}\n\nenum DeletionRequestStatus {\n  PENDING\n  PROCESSING\n  COMPLETED\n  FAILED\n\n  @@map(\"deletion_request_status\")\n}\n\nenum RetentionAuditAction {\n  POLICY_CREATED\n  POLICY_UPDATED\n  POLICY_DELETED\n  LEGAL_HOLD_CREATED\n  LEGAL_HOLD_RELEASED\n  FILE_EXPIRED\n  FILE_DELETED\n  FILE_ANONYMIZED\n  DELETION_REQUEST_CREATED\n  DELETION_REQUEST_PROCESSED\n\n  @@map(\"retention_audit_action\")\n}\n",
  "inlineSchemaHash": "095dd4081c39106bbed87c893315c300da07c848b5ed5d06c0ce3987d07f1feb",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"FileMetadata\":{\"dbName\":\"file_metadata\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"originalName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fileName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mimeType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"size\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"path\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cdnUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"uploadedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entityType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EntityType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entityId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FileStatus\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"processingResults\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"thumbnails\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"accessLevel\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AccessLevel\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"permissions\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tags\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parentRelationships\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FileRelationship\",\"relationName\":\"ParentFile\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"childRelationships\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FileRelationship\",\"relationName\":\"ChildFile\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessionFiles\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UploadSessionFile\",\"relationName\":\"FileMetadataToUploadSessionFile\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"FileRelationship\":{\"dbName\":\"file_relationships\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"childId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"relationshipType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RelationshipType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parent\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FileMetadata\",\"relationName\":\"ParentFile\",\"relationFromFields\":[\"parentId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"child\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FileMetadata\",\"relationName\":\"ChildFile\",\"relationFromFields\":[\"childId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"parentId\",\"childId\",\"relationshipType\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"parentId\",\"childId\",\"relationshipType\"]}],\"isGenerated\":false},\"UploadSession\":{\"dbName\":\"upload_sessions\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"uploadedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UploadStatus\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalFiles\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"uploadedFiles\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"failedFiles\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"files\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UploadSessionFile\",\"relationName\":\"UploadSessionToUploadSessionFile\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"UploadSessionFile\":{\"dbName\":\"upload_session_files\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fileId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"originalName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FileStatus\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"errorMessage\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"processingOrder\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"session\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UploadSession\",\"relationName\":\"UploadSessionToUploadSessionFile\",\"relationFromFields\":[\"sessionId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"file\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FileMetadata\",\"relationName\":\"FileMetadataToUploadSessionFile\",\"relationFromFields\":[\"fileId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ProcessingJob\":{\"dbName\":\"processing_jobs\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fileId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jobType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ProcessingJobType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"JobStatus\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priority\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"attempts\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maxAttempts\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":3,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payload\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"result\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"errorMessage\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"scheduledAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AccessLog\":{\"dbName\":\"access_logs\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fileId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"operation\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AccessOperation\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serviceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ipAddress\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userAgent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"success\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Boolean\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"errorCode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"StorageQuota\":{\"dbName\":\"storage_quotas\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entityType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EntityType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entityId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quotaBytes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BigInt\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"usedBytes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"BigInt\",\"default\":\"0\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fileCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lastUpdated\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"entityType\",\"entityId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"entityType\",\"entityId\"]}],\"isGenerated\":false},\"RetentionPolicy\":{\"dbName\":\"retention_policies\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entityType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EntityType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"retentionPeriodDays\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"jurisdiction\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"legalBasis\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"rules\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RetentionPolicyRule\",\"relationName\":\"RetentionPolicyToRetentionPolicyRule\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"entityType\",\"jurisdiction\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"entityType\",\"jurisdiction\"]}],\"isGenerated\":false},\"RetentionPolicyRule\":{\"dbName\":\"retention_policy_rules\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"policyId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"condition\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"action\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priority\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"policy\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RetentionPolicy\",\"relationName\":\"RetentionPolicyToRetentionPolicyRule\",\"relationFromFields\":[\"policyId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"LegalHold\":{\"dbName\":\"legal_holds\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entityType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EntityType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entityIds\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fileIds\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"DataDeletionRequest\":{\"dbName\":\"data_deletion_requests\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requestType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DataDeletionRequestType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entityType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EntityType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entityId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requestedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DeletionRequestStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"scheduledAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"processedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"filesDeleted\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"errorMessage\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"RetentionAuditLog\":{\"dbName\":\"retention_audit_logs\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fileId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entityType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EntityType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entityId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"action\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RetentionAuditAction\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"details\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"performedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"EntityType\":{\"values\":[{\"name\":\"USER_PROFILE\",\"dbName\":null},{\"name\":\"PRODUCT\",\"dbName\":null},{\"name\":\"PROPERTY\",\"dbName\":null},{\"name\":\"VEHICLE\",\"dbName\":null},{\"name\":\"DOCUMENT\",\"dbName\":null},{\"name\":\"ADVERTISEMENT\",\"dbName\":null}],\"dbName\":\"entity_type\"},\"FileStatus\":{\"values\":[{\"name\":\"UPLOADING\",\"dbName\":null},{\"name\":\"PROCESSING\",\"dbName\":null},{\"name\":\"READY\",\"dbName\":null},{\"name\":\"FAILED\",\"dbName\":null},{\"name\":\"DELETED\",\"dbName\":null}],\"dbName\":\"file_status\"},\"AccessLevel\":{\"values\":[{\"name\":\"PUBLIC\",\"dbName\":null},{\"name\":\"PRIVATE\",\"dbName\":null},{\"name\":\"RESTRICTED\",\"dbName\":null}],\"dbName\":\"access_level\"},\"RelationshipType\":{\"values\":[{\"name\":\"THUMBNAIL\",\"dbName\":null},{\"name\":\"VARIANT\",\"dbName\":null},{\"name\":\"PROCESSED\",\"dbName\":null},{\"name\":\"BACKUP\",\"dbName\":null},{\"name\":\"RELATED\",\"dbName\":null}],\"dbName\":\"relationship_type\"},\"UploadStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"IN_PROGRESS\",\"dbName\":null},{\"name\":\"COMPLETED\",\"dbName\":null},{\"name\":\"FAILED\",\"dbName\":null},{\"name\":\"CANCELLED\",\"dbName\":null}],\"dbName\":\"upload_status\"},\"ProcessingJobType\":{\"values\":[{\"name\":\"IMAGE_RESIZE\",\"dbName\":null},{\"name\":\"THUMBNAIL_GENERATION\",\"dbName\":null},{\"name\":\"FORMAT_CONVERSION\",\"dbName\":null},{\"name\":\"METADATA_EXTRACTION\",\"dbName\":null},{\"name\":\"VIRUS_SCAN\",\"dbName\":null},{\"name\":\"CONTENT_ANALYSIS\",\"dbName\":null}],\"dbName\":\"processing_job_type\"},\"JobStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"RUNNING\",\"dbName\":null},{\"name\":\"COMPLETED\",\"dbName\":null},{\"name\":\"FAILED\",\"dbName\":null},{\"name\":\"CANCELLED\",\"dbName\":null}],\"dbName\":\"job_status\"},\"AccessOperation\":{\"values\":[{\"name\":\"READ\",\"dbName\":null},{\"name\":\"write\",\"dbName\":null},{\"name\":\"delete\",\"dbName\":null},{\"name\":\"share\",\"dbName\":null}],\"dbName\":\"access_operation\"},\"DataDeletionRequestType\":{\"values\":[{\"name\":\"USER_REQUEST\",\"dbName\":null},{\"name\":\"GDPR_REQUEST\",\"dbName\":null},{\"name\":\"POLICY_EXPIRATION\",\"dbName\":null},{\"name\":\"LEGAL_HOLD_RELEASE\",\"dbName\":null}],\"dbName\":\"data_deletion_request_type\"},\"DeletionRequestStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"PROCESSING\",\"dbName\":null},{\"name\":\"COMPLETED\",\"dbName\":null},{\"name\":\"FAILED\",\"dbName\":null}],\"dbName\":\"deletion_request_status\"},\"RetentionAuditAction\":{\"values\":[{\"name\":\"POLICY_CREATED\",\"dbName\":null},{\"name\":\"POLICY_UPDATED\",\"dbName\":null},{\"name\":\"POLICY_DELETED\",\"dbName\":null},{\"name\":\"LEGAL_HOLD_CREATED\",\"dbName\":null},{\"name\":\"LEGAL_HOLD_RELEASED\",\"dbName\":null},{\"name\":\"FILE_EXPIRED\",\"dbName\":null},{\"name\":\"FILE_DELETED\",\"dbName\":null},{\"name\":\"FILE_ANONYMIZED\",\"dbName\":null},{\"name\":\"DELETION_REQUEST_CREATED\",\"dbName\":null},{\"name\":\"DELETION_REQUEST_PROCESSED\",\"dbName\":null}],\"dbName\":\"retention_audit_action\"}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

