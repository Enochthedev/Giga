
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model FileMetadata
 * 
 */
export type FileMetadata = $Result.DefaultSelection<Prisma.$FileMetadataPayload>
/**
 * Model FileRelationship
 * 
 */
export type FileRelationship = $Result.DefaultSelection<Prisma.$FileRelationshipPayload>
/**
 * Model UploadSession
 * 
 */
export type UploadSession = $Result.DefaultSelection<Prisma.$UploadSessionPayload>
/**
 * Model UploadSessionFile
 * 
 */
export type UploadSessionFile = $Result.DefaultSelection<Prisma.$UploadSessionFilePayload>
/**
 * Model ProcessingJob
 * 
 */
export type ProcessingJob = $Result.DefaultSelection<Prisma.$ProcessingJobPayload>
/**
 * Model AccessLog
 * 
 */
export type AccessLog = $Result.DefaultSelection<Prisma.$AccessLogPayload>
/**
 * Model StorageQuota
 * 
 */
export type StorageQuota = $Result.DefaultSelection<Prisma.$StorageQuotaPayload>
/**
 * Model RetentionPolicy
 * 
 */
export type RetentionPolicy = $Result.DefaultSelection<Prisma.$RetentionPolicyPayload>
/**
 * Model RetentionPolicyRule
 * 
 */
export type RetentionPolicyRule = $Result.DefaultSelection<Prisma.$RetentionPolicyRulePayload>
/**
 * Model LegalHold
 * 
 */
export type LegalHold = $Result.DefaultSelection<Prisma.$LegalHoldPayload>
/**
 * Model DataDeletionRequest
 * 
 */
export type DataDeletionRequest = $Result.DefaultSelection<Prisma.$DataDeletionRequestPayload>
/**
 * Model RetentionAuditLog
 * 
 */
export type RetentionAuditLog = $Result.DefaultSelection<Prisma.$RetentionAuditLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const EntityType: {
  USER_PROFILE: 'USER_PROFILE',
  PRODUCT: 'PRODUCT',
  PROPERTY: 'PROPERTY',
  VEHICLE: 'VEHICLE',
  DOCUMENT: 'DOCUMENT',
  ADVERTISEMENT: 'ADVERTISEMENT'
};

export type EntityType = (typeof EntityType)[keyof typeof EntityType]


export const FileStatus: {
  UPLOADING: 'UPLOADING',
  PROCESSING: 'PROCESSING',
  READY: 'READY',
  FAILED: 'FAILED',
  DELETED: 'DELETED'
};

export type FileStatus = (typeof FileStatus)[keyof typeof FileStatus]


export const AccessLevel: {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  RESTRICTED: 'RESTRICTED'
};

export type AccessLevel = (typeof AccessLevel)[keyof typeof AccessLevel]


export const RelationshipType: {
  THUMBNAIL: 'THUMBNAIL',
  VARIANT: 'VARIANT',
  PROCESSED: 'PROCESSED',
  BACKUP: 'BACKUP',
  RELATED: 'RELATED'
};

export type RelationshipType = (typeof RelationshipType)[keyof typeof RelationshipType]


export const UploadStatus: {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

export type UploadStatus = (typeof UploadStatus)[keyof typeof UploadStatus]


export const ProcessingJobType: {
  IMAGE_RESIZE: 'IMAGE_RESIZE',
  THUMBNAIL_GENERATION: 'THUMBNAIL_GENERATION',
  FORMAT_CONVERSION: 'FORMAT_CONVERSION',
  METADATA_EXTRACTION: 'METADATA_EXTRACTION',
  VIRUS_SCAN: 'VIRUS_SCAN',
  CONTENT_ANALYSIS: 'CONTENT_ANALYSIS'
};

export type ProcessingJobType = (typeof ProcessingJobType)[keyof typeof ProcessingJobType]


export const JobStatus: {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus]


export const AccessOperation: {
  READ: 'READ',
  write: 'write',
  delete: 'delete',
  share: 'share'
};

export type AccessOperation = (typeof AccessOperation)[keyof typeof AccessOperation]


export const DataDeletionRequestType: {
  USER_REQUEST: 'USER_REQUEST',
  GDPR_REQUEST: 'GDPR_REQUEST',
  POLICY_EXPIRATION: 'POLICY_EXPIRATION',
  LEGAL_HOLD_RELEASE: 'LEGAL_HOLD_RELEASE'
};

export type DataDeletionRequestType = (typeof DataDeletionRequestType)[keyof typeof DataDeletionRequestType]


export const DeletionRequestStatus: {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

export type DeletionRequestStatus = (typeof DeletionRequestStatus)[keyof typeof DeletionRequestStatus]


export const RetentionAuditAction: {
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

export type RetentionAuditAction = (typeof RetentionAuditAction)[keyof typeof RetentionAuditAction]

}

export type EntityType = $Enums.EntityType

export const EntityType: typeof $Enums.EntityType

export type FileStatus = $Enums.FileStatus

export const FileStatus: typeof $Enums.FileStatus

export type AccessLevel = $Enums.AccessLevel

export const AccessLevel: typeof $Enums.AccessLevel

export type RelationshipType = $Enums.RelationshipType

export const RelationshipType: typeof $Enums.RelationshipType

export type UploadStatus = $Enums.UploadStatus

export const UploadStatus: typeof $Enums.UploadStatus

export type ProcessingJobType = $Enums.ProcessingJobType

export const ProcessingJobType: typeof $Enums.ProcessingJobType

export type JobStatus = $Enums.JobStatus

export const JobStatus: typeof $Enums.JobStatus

export type AccessOperation = $Enums.AccessOperation

export const AccessOperation: typeof $Enums.AccessOperation

export type DataDeletionRequestType = $Enums.DataDeletionRequestType

export const DataDeletionRequestType: typeof $Enums.DataDeletionRequestType

export type DeletionRequestStatus = $Enums.DeletionRequestStatus

export const DeletionRequestStatus: typeof $Enums.DeletionRequestStatus

export type RetentionAuditAction = $Enums.RetentionAuditAction

export const RetentionAuditAction: typeof $Enums.RetentionAuditAction

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more FileMetadata
 * const fileMetadata = await prisma.fileMetadata.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more FileMetadata
   * const fileMetadata = await prisma.fileMetadata.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.fileMetadata`: Exposes CRUD operations for the **FileMetadata** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FileMetadata
    * const fileMetadata = await prisma.fileMetadata.findMany()
    * ```
    */
  get fileMetadata(): Prisma.FileMetadataDelegate<ExtArgs>;

  /**
   * `prisma.fileRelationship`: Exposes CRUD operations for the **FileRelationship** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FileRelationships
    * const fileRelationships = await prisma.fileRelationship.findMany()
    * ```
    */
  get fileRelationship(): Prisma.FileRelationshipDelegate<ExtArgs>;

  /**
   * `prisma.uploadSession`: Exposes CRUD operations for the **UploadSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UploadSessions
    * const uploadSessions = await prisma.uploadSession.findMany()
    * ```
    */
  get uploadSession(): Prisma.UploadSessionDelegate<ExtArgs>;

  /**
   * `prisma.uploadSessionFile`: Exposes CRUD operations for the **UploadSessionFile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UploadSessionFiles
    * const uploadSessionFiles = await prisma.uploadSessionFile.findMany()
    * ```
    */
  get uploadSessionFile(): Prisma.UploadSessionFileDelegate<ExtArgs>;

  /**
   * `prisma.processingJob`: Exposes CRUD operations for the **ProcessingJob** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProcessingJobs
    * const processingJobs = await prisma.processingJob.findMany()
    * ```
    */
  get processingJob(): Prisma.ProcessingJobDelegate<ExtArgs>;

  /**
   * `prisma.accessLog`: Exposes CRUD operations for the **AccessLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AccessLogs
    * const accessLogs = await prisma.accessLog.findMany()
    * ```
    */
  get accessLog(): Prisma.AccessLogDelegate<ExtArgs>;

  /**
   * `prisma.storageQuota`: Exposes CRUD operations for the **StorageQuota** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StorageQuotas
    * const storageQuotas = await prisma.storageQuota.findMany()
    * ```
    */
  get storageQuota(): Prisma.StorageQuotaDelegate<ExtArgs>;

  /**
   * `prisma.retentionPolicy`: Exposes CRUD operations for the **RetentionPolicy** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RetentionPolicies
    * const retentionPolicies = await prisma.retentionPolicy.findMany()
    * ```
    */
  get retentionPolicy(): Prisma.RetentionPolicyDelegate<ExtArgs>;

  /**
   * `prisma.retentionPolicyRule`: Exposes CRUD operations for the **RetentionPolicyRule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RetentionPolicyRules
    * const retentionPolicyRules = await prisma.retentionPolicyRule.findMany()
    * ```
    */
  get retentionPolicyRule(): Prisma.RetentionPolicyRuleDelegate<ExtArgs>;

  /**
   * `prisma.legalHold`: Exposes CRUD operations for the **LegalHold** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LegalHolds
    * const legalHolds = await prisma.legalHold.findMany()
    * ```
    */
  get legalHold(): Prisma.LegalHoldDelegate<ExtArgs>;

  /**
   * `prisma.dataDeletionRequest`: Exposes CRUD operations for the **DataDeletionRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DataDeletionRequests
    * const dataDeletionRequests = await prisma.dataDeletionRequest.findMany()
    * ```
    */
  get dataDeletionRequest(): Prisma.DataDeletionRequestDelegate<ExtArgs>;

  /**
   * `prisma.retentionAuditLog`: Exposes CRUD operations for the **RetentionAuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RetentionAuditLogs
    * const retentionAuditLogs = await prisma.retentionAuditLog.findMany()
    * ```
    */
  get retentionAuditLog(): Prisma.RetentionAuditLogDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "fileMetadata" | "fileRelationship" | "uploadSession" | "uploadSessionFile" | "processingJob" | "accessLog" | "storageQuota" | "retentionPolicy" | "retentionPolicyRule" | "legalHold" | "dataDeletionRequest" | "retentionAuditLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      FileMetadata: {
        payload: Prisma.$FileMetadataPayload<ExtArgs>
        fields: Prisma.FileMetadataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FileMetadataFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileMetadataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FileMetadataFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileMetadataPayload>
          }
          findFirst: {
            args: Prisma.FileMetadataFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileMetadataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FileMetadataFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileMetadataPayload>
          }
          findMany: {
            args: Prisma.FileMetadataFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileMetadataPayload>[]
          }
          create: {
            args: Prisma.FileMetadataCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileMetadataPayload>
          }
          createMany: {
            args: Prisma.FileMetadataCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FileMetadataCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileMetadataPayload>[]
          }
          delete: {
            args: Prisma.FileMetadataDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileMetadataPayload>
          }
          update: {
            args: Prisma.FileMetadataUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileMetadataPayload>
          }
          deleteMany: {
            args: Prisma.FileMetadataDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FileMetadataUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FileMetadataUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileMetadataPayload>
          }
          aggregate: {
            args: Prisma.FileMetadataAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFileMetadata>
          }
          groupBy: {
            args: Prisma.FileMetadataGroupByArgs<ExtArgs>
            result: $Utils.Optional<FileMetadataGroupByOutputType>[]
          }
          count: {
            args: Prisma.FileMetadataCountArgs<ExtArgs>
            result: $Utils.Optional<FileMetadataCountAggregateOutputType> | number
          }
        }
      }
      FileRelationship: {
        payload: Prisma.$FileRelationshipPayload<ExtArgs>
        fields: Prisma.FileRelationshipFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FileRelationshipFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileRelationshipPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FileRelationshipFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileRelationshipPayload>
          }
          findFirst: {
            args: Prisma.FileRelationshipFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileRelationshipPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FileRelationshipFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileRelationshipPayload>
          }
          findMany: {
            args: Prisma.FileRelationshipFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileRelationshipPayload>[]
          }
          create: {
            args: Prisma.FileRelationshipCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileRelationshipPayload>
          }
          createMany: {
            args: Prisma.FileRelationshipCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FileRelationshipCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileRelationshipPayload>[]
          }
          delete: {
            args: Prisma.FileRelationshipDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileRelationshipPayload>
          }
          update: {
            args: Prisma.FileRelationshipUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileRelationshipPayload>
          }
          deleteMany: {
            args: Prisma.FileRelationshipDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FileRelationshipUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FileRelationshipUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileRelationshipPayload>
          }
          aggregate: {
            args: Prisma.FileRelationshipAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFileRelationship>
          }
          groupBy: {
            args: Prisma.FileRelationshipGroupByArgs<ExtArgs>
            result: $Utils.Optional<FileRelationshipGroupByOutputType>[]
          }
          count: {
            args: Prisma.FileRelationshipCountArgs<ExtArgs>
            result: $Utils.Optional<FileRelationshipCountAggregateOutputType> | number
          }
        }
      }
      UploadSession: {
        payload: Prisma.$UploadSessionPayload<ExtArgs>
        fields: Prisma.UploadSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UploadSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UploadSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionPayload>
          }
          findFirst: {
            args: Prisma.UploadSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UploadSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionPayload>
          }
          findMany: {
            args: Prisma.UploadSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionPayload>[]
          }
          create: {
            args: Prisma.UploadSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionPayload>
          }
          createMany: {
            args: Prisma.UploadSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UploadSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionPayload>[]
          }
          delete: {
            args: Prisma.UploadSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionPayload>
          }
          update: {
            args: Prisma.UploadSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionPayload>
          }
          deleteMany: {
            args: Prisma.UploadSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UploadSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UploadSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionPayload>
          }
          aggregate: {
            args: Prisma.UploadSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUploadSession>
          }
          groupBy: {
            args: Prisma.UploadSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<UploadSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.UploadSessionCountArgs<ExtArgs>
            result: $Utils.Optional<UploadSessionCountAggregateOutputType> | number
          }
        }
      }
      UploadSessionFile: {
        payload: Prisma.$UploadSessionFilePayload<ExtArgs>
        fields: Prisma.UploadSessionFileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UploadSessionFileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionFilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UploadSessionFileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionFilePayload>
          }
          findFirst: {
            args: Prisma.UploadSessionFileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionFilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UploadSessionFileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionFilePayload>
          }
          findMany: {
            args: Prisma.UploadSessionFileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionFilePayload>[]
          }
          create: {
            args: Prisma.UploadSessionFileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionFilePayload>
          }
          createMany: {
            args: Prisma.UploadSessionFileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UploadSessionFileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionFilePayload>[]
          }
          delete: {
            args: Prisma.UploadSessionFileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionFilePayload>
          }
          update: {
            args: Prisma.UploadSessionFileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionFilePayload>
          }
          deleteMany: {
            args: Prisma.UploadSessionFileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UploadSessionFileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UploadSessionFileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UploadSessionFilePayload>
          }
          aggregate: {
            args: Prisma.UploadSessionFileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUploadSessionFile>
          }
          groupBy: {
            args: Prisma.UploadSessionFileGroupByArgs<ExtArgs>
            result: $Utils.Optional<UploadSessionFileGroupByOutputType>[]
          }
          count: {
            args: Prisma.UploadSessionFileCountArgs<ExtArgs>
            result: $Utils.Optional<UploadSessionFileCountAggregateOutputType> | number
          }
        }
      }
      ProcessingJob: {
        payload: Prisma.$ProcessingJobPayload<ExtArgs>
        fields: Prisma.ProcessingJobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProcessingJobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessingJobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProcessingJobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessingJobPayload>
          }
          findFirst: {
            args: Prisma.ProcessingJobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessingJobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProcessingJobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessingJobPayload>
          }
          findMany: {
            args: Prisma.ProcessingJobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessingJobPayload>[]
          }
          create: {
            args: Prisma.ProcessingJobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessingJobPayload>
          }
          createMany: {
            args: Prisma.ProcessingJobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProcessingJobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessingJobPayload>[]
          }
          delete: {
            args: Prisma.ProcessingJobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessingJobPayload>
          }
          update: {
            args: Prisma.ProcessingJobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessingJobPayload>
          }
          deleteMany: {
            args: Prisma.ProcessingJobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProcessingJobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProcessingJobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessingJobPayload>
          }
          aggregate: {
            args: Prisma.ProcessingJobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProcessingJob>
          }
          groupBy: {
            args: Prisma.ProcessingJobGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProcessingJobGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProcessingJobCountArgs<ExtArgs>
            result: $Utils.Optional<ProcessingJobCountAggregateOutputType> | number
          }
        }
      }
      AccessLog: {
        payload: Prisma.$AccessLogPayload<ExtArgs>
        fields: Prisma.AccessLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccessLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccessLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessLogPayload>
          }
          findFirst: {
            args: Prisma.AccessLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccessLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessLogPayload>
          }
          findMany: {
            args: Prisma.AccessLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessLogPayload>[]
          }
          create: {
            args: Prisma.AccessLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessLogPayload>
          }
          createMany: {
            args: Prisma.AccessLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccessLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessLogPayload>[]
          }
          delete: {
            args: Prisma.AccessLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessLogPayload>
          }
          update: {
            args: Prisma.AccessLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessLogPayload>
          }
          deleteMany: {
            args: Prisma.AccessLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccessLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AccessLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessLogPayload>
          }
          aggregate: {
            args: Prisma.AccessLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccessLog>
          }
          groupBy: {
            args: Prisma.AccessLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccessLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccessLogCountArgs<ExtArgs>
            result: $Utils.Optional<AccessLogCountAggregateOutputType> | number
          }
        }
      }
      StorageQuota: {
        payload: Prisma.$StorageQuotaPayload<ExtArgs>
        fields: Prisma.StorageQuotaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StorageQuotaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageQuotaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StorageQuotaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageQuotaPayload>
          }
          findFirst: {
            args: Prisma.StorageQuotaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageQuotaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StorageQuotaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageQuotaPayload>
          }
          findMany: {
            args: Prisma.StorageQuotaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageQuotaPayload>[]
          }
          create: {
            args: Prisma.StorageQuotaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageQuotaPayload>
          }
          createMany: {
            args: Prisma.StorageQuotaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StorageQuotaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageQuotaPayload>[]
          }
          delete: {
            args: Prisma.StorageQuotaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageQuotaPayload>
          }
          update: {
            args: Prisma.StorageQuotaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageQuotaPayload>
          }
          deleteMany: {
            args: Prisma.StorageQuotaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StorageQuotaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StorageQuotaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageQuotaPayload>
          }
          aggregate: {
            args: Prisma.StorageQuotaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStorageQuota>
          }
          groupBy: {
            args: Prisma.StorageQuotaGroupByArgs<ExtArgs>
            result: $Utils.Optional<StorageQuotaGroupByOutputType>[]
          }
          count: {
            args: Prisma.StorageQuotaCountArgs<ExtArgs>
            result: $Utils.Optional<StorageQuotaCountAggregateOutputType> | number
          }
        }
      }
      RetentionPolicy: {
        payload: Prisma.$RetentionPolicyPayload<ExtArgs>
        fields: Prisma.RetentionPolicyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RetentionPolicyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionPolicyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RetentionPolicyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionPolicyPayload>
          }
          findFirst: {
            args: Prisma.RetentionPolicyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionPolicyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RetentionPolicyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionPolicyPayload>
          }
          findMany: {
            args: Prisma.RetentionPolicyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionPolicyPayload>[]
          }
          create: {
            args: Prisma.RetentionPolicyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionPolicyPayload>
          }
          createMany: {
            args: Prisma.RetentionPolicyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RetentionPolicyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionPolicyPayload>[]
          }
          delete: {
            args: Prisma.RetentionPolicyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionPolicyPayload>
          }
          update: {
            args: Prisma.RetentionPolicyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionPolicyPayload>
          }
          deleteMany: {
            args: Prisma.RetentionPolicyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RetentionPolicyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RetentionPolicyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionPolicyPayload>
          }
          aggregate: {
            args: Prisma.RetentionPolicyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRetentionPolicy>
          }
          groupBy: {
            args: Prisma.RetentionPolicyGroupByArgs<ExtArgs>
            result: $Utils.Optional<RetentionPolicyGroupByOutputType>[]
          }
          count: {
            args: Prisma.RetentionPolicyCountArgs<ExtArgs>
            result: $Utils.Optional<RetentionPolicyCountAggregateOutputType> | number
          }
        }
      }
      RetentionPolicyRule: {
        payload: Prisma.$RetentionPolicyRulePayload<ExtArgs>
        fields: Prisma.RetentionPolicyRuleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RetentionPolicyRuleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionPolicyRulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RetentionPolicyRuleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionPolicyRulePayload>
          }
          findFirst: {
            args: Prisma.RetentionPolicyRuleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionPolicyRulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RetentionPolicyRuleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionPolicyRulePayload>
          }
          findMany: {
            args: Prisma.RetentionPolicyRuleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionPolicyRulePayload>[]
          }
          create: {
            args: Prisma.RetentionPolicyRuleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionPolicyRulePayload>
          }
          createMany: {
            args: Prisma.RetentionPolicyRuleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RetentionPolicyRuleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionPolicyRulePayload>[]
          }
          delete: {
            args: Prisma.RetentionPolicyRuleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionPolicyRulePayload>
          }
          update: {
            args: Prisma.RetentionPolicyRuleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionPolicyRulePayload>
          }
          deleteMany: {
            args: Prisma.RetentionPolicyRuleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RetentionPolicyRuleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RetentionPolicyRuleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionPolicyRulePayload>
          }
          aggregate: {
            args: Prisma.RetentionPolicyRuleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRetentionPolicyRule>
          }
          groupBy: {
            args: Prisma.RetentionPolicyRuleGroupByArgs<ExtArgs>
            result: $Utils.Optional<RetentionPolicyRuleGroupByOutputType>[]
          }
          count: {
            args: Prisma.RetentionPolicyRuleCountArgs<ExtArgs>
            result: $Utils.Optional<RetentionPolicyRuleCountAggregateOutputType> | number
          }
        }
      }
      LegalHold: {
        payload: Prisma.$LegalHoldPayload<ExtArgs>
        fields: Prisma.LegalHoldFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LegalHoldFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegalHoldPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LegalHoldFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegalHoldPayload>
          }
          findFirst: {
            args: Prisma.LegalHoldFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegalHoldPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LegalHoldFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegalHoldPayload>
          }
          findMany: {
            args: Prisma.LegalHoldFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegalHoldPayload>[]
          }
          create: {
            args: Prisma.LegalHoldCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegalHoldPayload>
          }
          createMany: {
            args: Prisma.LegalHoldCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LegalHoldCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegalHoldPayload>[]
          }
          delete: {
            args: Prisma.LegalHoldDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegalHoldPayload>
          }
          update: {
            args: Prisma.LegalHoldUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegalHoldPayload>
          }
          deleteMany: {
            args: Prisma.LegalHoldDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LegalHoldUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LegalHoldUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegalHoldPayload>
          }
          aggregate: {
            args: Prisma.LegalHoldAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLegalHold>
          }
          groupBy: {
            args: Prisma.LegalHoldGroupByArgs<ExtArgs>
            result: $Utils.Optional<LegalHoldGroupByOutputType>[]
          }
          count: {
            args: Prisma.LegalHoldCountArgs<ExtArgs>
            result: $Utils.Optional<LegalHoldCountAggregateOutputType> | number
          }
        }
      }
      DataDeletionRequest: {
        payload: Prisma.$DataDeletionRequestPayload<ExtArgs>
        fields: Prisma.DataDeletionRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DataDeletionRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataDeletionRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DataDeletionRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataDeletionRequestPayload>
          }
          findFirst: {
            args: Prisma.DataDeletionRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataDeletionRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DataDeletionRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataDeletionRequestPayload>
          }
          findMany: {
            args: Prisma.DataDeletionRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataDeletionRequestPayload>[]
          }
          create: {
            args: Prisma.DataDeletionRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataDeletionRequestPayload>
          }
          createMany: {
            args: Prisma.DataDeletionRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DataDeletionRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataDeletionRequestPayload>[]
          }
          delete: {
            args: Prisma.DataDeletionRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataDeletionRequestPayload>
          }
          update: {
            args: Prisma.DataDeletionRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataDeletionRequestPayload>
          }
          deleteMany: {
            args: Prisma.DataDeletionRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DataDeletionRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DataDeletionRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataDeletionRequestPayload>
          }
          aggregate: {
            args: Prisma.DataDeletionRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDataDeletionRequest>
          }
          groupBy: {
            args: Prisma.DataDeletionRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<DataDeletionRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.DataDeletionRequestCountArgs<ExtArgs>
            result: $Utils.Optional<DataDeletionRequestCountAggregateOutputType> | number
          }
        }
      }
      RetentionAuditLog: {
        payload: Prisma.$RetentionAuditLogPayload<ExtArgs>
        fields: Prisma.RetentionAuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RetentionAuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionAuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RetentionAuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionAuditLogPayload>
          }
          findFirst: {
            args: Prisma.RetentionAuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionAuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RetentionAuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionAuditLogPayload>
          }
          findMany: {
            args: Prisma.RetentionAuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionAuditLogPayload>[]
          }
          create: {
            args: Prisma.RetentionAuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionAuditLogPayload>
          }
          createMany: {
            args: Prisma.RetentionAuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RetentionAuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionAuditLogPayload>[]
          }
          delete: {
            args: Prisma.RetentionAuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionAuditLogPayload>
          }
          update: {
            args: Prisma.RetentionAuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionAuditLogPayload>
          }
          deleteMany: {
            args: Prisma.RetentionAuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RetentionAuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RetentionAuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetentionAuditLogPayload>
          }
          aggregate: {
            args: Prisma.RetentionAuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRetentionAuditLog>
          }
          groupBy: {
            args: Prisma.RetentionAuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<RetentionAuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.RetentionAuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<RetentionAuditLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type FileMetadataCountOutputType
   */

  export type FileMetadataCountOutputType = {
    parentRelationships: number
    childRelationships: number
    sessionFiles: number
  }

  export type FileMetadataCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parentRelationships?: boolean | FileMetadataCountOutputTypeCountParentRelationshipsArgs
    childRelationships?: boolean | FileMetadataCountOutputTypeCountChildRelationshipsArgs
    sessionFiles?: boolean | FileMetadataCountOutputTypeCountSessionFilesArgs
  }

  // Custom InputTypes
  /**
   * FileMetadataCountOutputType without action
   */
  export type FileMetadataCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMetadataCountOutputType
     */
    select?: FileMetadataCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FileMetadataCountOutputType without action
   */
  export type FileMetadataCountOutputTypeCountParentRelationshipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileRelationshipWhereInput
  }

  /**
   * FileMetadataCountOutputType without action
   */
  export type FileMetadataCountOutputTypeCountChildRelationshipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileRelationshipWhereInput
  }

  /**
   * FileMetadataCountOutputType without action
   */
  export type FileMetadataCountOutputTypeCountSessionFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UploadSessionFileWhereInput
  }


  /**
   * Count Type UploadSessionCountOutputType
   */

  export type UploadSessionCountOutputType = {
    files: number
  }

  export type UploadSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    files?: boolean | UploadSessionCountOutputTypeCountFilesArgs
  }

  // Custom InputTypes
  /**
   * UploadSessionCountOutputType without action
   */
  export type UploadSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSessionCountOutputType
     */
    select?: UploadSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UploadSessionCountOutputType without action
   */
  export type UploadSessionCountOutputTypeCountFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UploadSessionFileWhereInput
  }


  /**
   * Count Type RetentionPolicyCountOutputType
   */

  export type RetentionPolicyCountOutputType = {
    rules: number
  }

  export type RetentionPolicyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rules?: boolean | RetentionPolicyCountOutputTypeCountRulesArgs
  }

  // Custom InputTypes
  /**
   * RetentionPolicyCountOutputType without action
   */
  export type RetentionPolicyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicyCountOutputType
     */
    select?: RetentionPolicyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RetentionPolicyCountOutputType without action
   */
  export type RetentionPolicyCountOutputTypeCountRulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RetentionPolicyRuleWhereInput
  }


  /**
   * Models
   */

  /**
   * Model FileMetadata
   */

  export type AggregateFileMetadata = {
    _count: FileMetadataCountAggregateOutputType | null
    _avg: FileMetadataAvgAggregateOutputType | null
    _sum: FileMetadataSumAggregateOutputType | null
    _min: FileMetadataMinAggregateOutputType | null
    _max: FileMetadataMaxAggregateOutputType | null
  }

  export type FileMetadataAvgAggregateOutputType = {
    size: number | null
  }

  export type FileMetadataSumAggregateOutputType = {
    size: number | null
  }

  export type FileMetadataMinAggregateOutputType = {
    id: string | null
    originalName: string | null
    fileName: string | null
    mimeType: string | null
    size: number | null
    path: string | null
    url: string | null
    cdnUrl: string | null
    uploadedBy: string | null
    entityType: $Enums.EntityType | null
    entityId: string | null
    status: $Enums.FileStatus | null
    accessLevel: $Enums.AccessLevel | null
    createdAt: Date | null
    updatedAt: Date | null
    expiresAt: Date | null
  }

  export type FileMetadataMaxAggregateOutputType = {
    id: string | null
    originalName: string | null
    fileName: string | null
    mimeType: string | null
    size: number | null
    path: string | null
    url: string | null
    cdnUrl: string | null
    uploadedBy: string | null
    entityType: $Enums.EntityType | null
    entityId: string | null
    status: $Enums.FileStatus | null
    accessLevel: $Enums.AccessLevel | null
    createdAt: Date | null
    updatedAt: Date | null
    expiresAt: Date | null
  }

  export type FileMetadataCountAggregateOutputType = {
    id: number
    originalName: number
    fileName: number
    mimeType: number
    size: number
    path: number
    url: number
    cdnUrl: number
    uploadedBy: number
    entityType: number
    entityId: number
    status: number
    processingResults: number
    thumbnails: number
    accessLevel: number
    permissions: number
    metadata: number
    tags: number
    createdAt: number
    updatedAt: number
    expiresAt: number
    _all: number
  }


  export type FileMetadataAvgAggregateInputType = {
    size?: true
  }

  export type FileMetadataSumAggregateInputType = {
    size?: true
  }

  export type FileMetadataMinAggregateInputType = {
    id?: true
    originalName?: true
    fileName?: true
    mimeType?: true
    size?: true
    path?: true
    url?: true
    cdnUrl?: true
    uploadedBy?: true
    entityType?: true
    entityId?: true
    status?: true
    accessLevel?: true
    createdAt?: true
    updatedAt?: true
    expiresAt?: true
  }

  export type FileMetadataMaxAggregateInputType = {
    id?: true
    originalName?: true
    fileName?: true
    mimeType?: true
    size?: true
    path?: true
    url?: true
    cdnUrl?: true
    uploadedBy?: true
    entityType?: true
    entityId?: true
    status?: true
    accessLevel?: true
    createdAt?: true
    updatedAt?: true
    expiresAt?: true
  }

  export type FileMetadataCountAggregateInputType = {
    id?: true
    originalName?: true
    fileName?: true
    mimeType?: true
    size?: true
    path?: true
    url?: true
    cdnUrl?: true
    uploadedBy?: true
    entityType?: true
    entityId?: true
    status?: true
    processingResults?: true
    thumbnails?: true
    accessLevel?: true
    permissions?: true
    metadata?: true
    tags?: true
    createdAt?: true
    updatedAt?: true
    expiresAt?: true
    _all?: true
  }

  export type FileMetadataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileMetadata to aggregate.
     */
    where?: FileMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileMetadata to fetch.
     */
    orderBy?: FileMetadataOrderByWithRelationInput | FileMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FileMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FileMetadata
    **/
    _count?: true | FileMetadataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FileMetadataAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FileMetadataSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FileMetadataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FileMetadataMaxAggregateInputType
  }

  export type GetFileMetadataAggregateType<T extends FileMetadataAggregateArgs> = {
        [P in keyof T & keyof AggregateFileMetadata]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFileMetadata[P]>
      : GetScalarType<T[P], AggregateFileMetadata[P]>
  }




  export type FileMetadataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileMetadataWhereInput
    orderBy?: FileMetadataOrderByWithAggregationInput | FileMetadataOrderByWithAggregationInput[]
    by: FileMetadataScalarFieldEnum[] | FileMetadataScalarFieldEnum
    having?: FileMetadataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FileMetadataCountAggregateInputType | true
    _avg?: FileMetadataAvgAggregateInputType
    _sum?: FileMetadataSumAggregateInputType
    _min?: FileMetadataMinAggregateInputType
    _max?: FileMetadataMaxAggregateInputType
  }

  export type FileMetadataGroupByOutputType = {
    id: string
    originalName: string
    fileName: string
    mimeType: string
    size: number
    path: string
    url: string
    cdnUrl: string | null
    uploadedBy: string
    entityType: $Enums.EntityType
    entityId: string
    status: $Enums.FileStatus
    processingResults: JsonValue | null
    thumbnails: JsonValue | null
    accessLevel: $Enums.AccessLevel
    permissions: JsonValue | null
    metadata: JsonValue | null
    tags: string[]
    createdAt: Date
    updatedAt: Date
    expiresAt: Date | null
    _count: FileMetadataCountAggregateOutputType | null
    _avg: FileMetadataAvgAggregateOutputType | null
    _sum: FileMetadataSumAggregateOutputType | null
    _min: FileMetadataMinAggregateOutputType | null
    _max: FileMetadataMaxAggregateOutputType | null
  }

  type GetFileMetadataGroupByPayload<T extends FileMetadataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FileMetadataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FileMetadataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FileMetadataGroupByOutputType[P]>
            : GetScalarType<T[P], FileMetadataGroupByOutputType[P]>
        }
      >
    >


  export type FileMetadataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    originalName?: boolean
    fileName?: boolean
    mimeType?: boolean
    size?: boolean
    path?: boolean
    url?: boolean
    cdnUrl?: boolean
    uploadedBy?: boolean
    entityType?: boolean
    entityId?: boolean
    status?: boolean
    processingResults?: boolean
    thumbnails?: boolean
    accessLevel?: boolean
    permissions?: boolean
    metadata?: boolean
    tags?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    expiresAt?: boolean
    parentRelationships?: boolean | FileMetadata$parentRelationshipsArgs<ExtArgs>
    childRelationships?: boolean | FileMetadata$childRelationshipsArgs<ExtArgs>
    sessionFiles?: boolean | FileMetadata$sessionFilesArgs<ExtArgs>
    _count?: boolean | FileMetadataCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fileMetadata"]>

  export type FileMetadataSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    originalName?: boolean
    fileName?: boolean
    mimeType?: boolean
    size?: boolean
    path?: boolean
    url?: boolean
    cdnUrl?: boolean
    uploadedBy?: boolean
    entityType?: boolean
    entityId?: boolean
    status?: boolean
    processingResults?: boolean
    thumbnails?: boolean
    accessLevel?: boolean
    permissions?: boolean
    metadata?: boolean
    tags?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["fileMetadata"]>

  export type FileMetadataSelectScalar = {
    id?: boolean
    originalName?: boolean
    fileName?: boolean
    mimeType?: boolean
    size?: boolean
    path?: boolean
    url?: boolean
    cdnUrl?: boolean
    uploadedBy?: boolean
    entityType?: boolean
    entityId?: boolean
    status?: boolean
    processingResults?: boolean
    thumbnails?: boolean
    accessLevel?: boolean
    permissions?: boolean
    metadata?: boolean
    tags?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    expiresAt?: boolean
  }

  export type FileMetadataInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parentRelationships?: boolean | FileMetadata$parentRelationshipsArgs<ExtArgs>
    childRelationships?: boolean | FileMetadata$childRelationshipsArgs<ExtArgs>
    sessionFiles?: boolean | FileMetadata$sessionFilesArgs<ExtArgs>
    _count?: boolean | FileMetadataCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FileMetadataIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $FileMetadataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FileMetadata"
    objects: {
      parentRelationships: Prisma.$FileRelationshipPayload<ExtArgs>[]
      childRelationships: Prisma.$FileRelationshipPayload<ExtArgs>[]
      sessionFiles: Prisma.$UploadSessionFilePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      originalName: string
      fileName: string
      mimeType: string
      size: number
      path: string
      url: string
      cdnUrl: string | null
      uploadedBy: string
      entityType: $Enums.EntityType
      entityId: string
      status: $Enums.FileStatus
      processingResults: Prisma.JsonValue | null
      thumbnails: Prisma.JsonValue | null
      accessLevel: $Enums.AccessLevel
      permissions: Prisma.JsonValue | null
      metadata: Prisma.JsonValue | null
      tags: string[]
      createdAt: Date
      updatedAt: Date
      expiresAt: Date | null
    }, ExtArgs["result"]["fileMetadata"]>
    composites: {}
  }

  type FileMetadataGetPayload<S extends boolean | null | undefined | FileMetadataDefaultArgs> = $Result.GetResult<Prisma.$FileMetadataPayload, S>

  type FileMetadataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FileMetadataFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FileMetadataCountAggregateInputType | true
    }

  export interface FileMetadataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FileMetadata'], meta: { name: 'FileMetadata' } }
    /**
     * Find zero or one FileMetadata that matches the filter.
     * @param {FileMetadataFindUniqueArgs} args - Arguments to find a FileMetadata
     * @example
     * // Get one FileMetadata
     * const fileMetadata = await prisma.fileMetadata.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FileMetadataFindUniqueArgs>(args: SelectSubset<T, FileMetadataFindUniqueArgs<ExtArgs>>): Prisma__FileMetadataClient<$Result.GetResult<Prisma.$FileMetadataPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one FileMetadata that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FileMetadataFindUniqueOrThrowArgs} args - Arguments to find a FileMetadata
     * @example
     * // Get one FileMetadata
     * const fileMetadata = await prisma.fileMetadata.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FileMetadataFindUniqueOrThrowArgs>(args: SelectSubset<T, FileMetadataFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FileMetadataClient<$Result.GetResult<Prisma.$FileMetadataPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first FileMetadata that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileMetadataFindFirstArgs} args - Arguments to find a FileMetadata
     * @example
     * // Get one FileMetadata
     * const fileMetadata = await prisma.fileMetadata.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FileMetadataFindFirstArgs>(args?: SelectSubset<T, FileMetadataFindFirstArgs<ExtArgs>>): Prisma__FileMetadataClient<$Result.GetResult<Prisma.$FileMetadataPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first FileMetadata that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileMetadataFindFirstOrThrowArgs} args - Arguments to find a FileMetadata
     * @example
     * // Get one FileMetadata
     * const fileMetadata = await prisma.fileMetadata.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FileMetadataFindFirstOrThrowArgs>(args?: SelectSubset<T, FileMetadataFindFirstOrThrowArgs<ExtArgs>>): Prisma__FileMetadataClient<$Result.GetResult<Prisma.$FileMetadataPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more FileMetadata that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileMetadataFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FileMetadata
     * const fileMetadata = await prisma.fileMetadata.findMany()
     * 
     * // Get first 10 FileMetadata
     * const fileMetadata = await prisma.fileMetadata.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fileMetadataWithIdOnly = await prisma.fileMetadata.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FileMetadataFindManyArgs>(args?: SelectSubset<T, FileMetadataFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileMetadataPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a FileMetadata.
     * @param {FileMetadataCreateArgs} args - Arguments to create a FileMetadata.
     * @example
     * // Create one FileMetadata
     * const FileMetadata = await prisma.fileMetadata.create({
     *   data: {
     *     // ... data to create a FileMetadata
     *   }
     * })
     * 
     */
    create<T extends FileMetadataCreateArgs>(args: SelectSubset<T, FileMetadataCreateArgs<ExtArgs>>): Prisma__FileMetadataClient<$Result.GetResult<Prisma.$FileMetadataPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many FileMetadata.
     * @param {FileMetadataCreateManyArgs} args - Arguments to create many FileMetadata.
     * @example
     * // Create many FileMetadata
     * const fileMetadata = await prisma.fileMetadata.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FileMetadataCreateManyArgs>(args?: SelectSubset<T, FileMetadataCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FileMetadata and returns the data saved in the database.
     * @param {FileMetadataCreateManyAndReturnArgs} args - Arguments to create many FileMetadata.
     * @example
     * // Create many FileMetadata
     * const fileMetadata = await prisma.fileMetadata.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FileMetadata and only return the `id`
     * const fileMetadataWithIdOnly = await prisma.fileMetadata.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FileMetadataCreateManyAndReturnArgs>(args?: SelectSubset<T, FileMetadataCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileMetadataPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a FileMetadata.
     * @param {FileMetadataDeleteArgs} args - Arguments to delete one FileMetadata.
     * @example
     * // Delete one FileMetadata
     * const FileMetadata = await prisma.fileMetadata.delete({
     *   where: {
     *     // ... filter to delete one FileMetadata
     *   }
     * })
     * 
     */
    delete<T extends FileMetadataDeleteArgs>(args: SelectSubset<T, FileMetadataDeleteArgs<ExtArgs>>): Prisma__FileMetadataClient<$Result.GetResult<Prisma.$FileMetadataPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one FileMetadata.
     * @param {FileMetadataUpdateArgs} args - Arguments to update one FileMetadata.
     * @example
     * // Update one FileMetadata
     * const fileMetadata = await prisma.fileMetadata.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FileMetadataUpdateArgs>(args: SelectSubset<T, FileMetadataUpdateArgs<ExtArgs>>): Prisma__FileMetadataClient<$Result.GetResult<Prisma.$FileMetadataPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more FileMetadata.
     * @param {FileMetadataDeleteManyArgs} args - Arguments to filter FileMetadata to delete.
     * @example
     * // Delete a few FileMetadata
     * const { count } = await prisma.fileMetadata.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FileMetadataDeleteManyArgs>(args?: SelectSubset<T, FileMetadataDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FileMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileMetadataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FileMetadata
     * const fileMetadata = await prisma.fileMetadata.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FileMetadataUpdateManyArgs>(args: SelectSubset<T, FileMetadataUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FileMetadata.
     * @param {FileMetadataUpsertArgs} args - Arguments to update or create a FileMetadata.
     * @example
     * // Update or create a FileMetadata
     * const fileMetadata = await prisma.fileMetadata.upsert({
     *   create: {
     *     // ... data to create a FileMetadata
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FileMetadata we want to update
     *   }
     * })
     */
    upsert<T extends FileMetadataUpsertArgs>(args: SelectSubset<T, FileMetadataUpsertArgs<ExtArgs>>): Prisma__FileMetadataClient<$Result.GetResult<Prisma.$FileMetadataPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of FileMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileMetadataCountArgs} args - Arguments to filter FileMetadata to count.
     * @example
     * // Count the number of FileMetadata
     * const count = await prisma.fileMetadata.count({
     *   where: {
     *     // ... the filter for the FileMetadata we want to count
     *   }
     * })
    **/
    count<T extends FileMetadataCountArgs>(
      args?: Subset<T, FileMetadataCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FileMetadataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FileMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileMetadataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FileMetadataAggregateArgs>(args: Subset<T, FileMetadataAggregateArgs>): Prisma.PrismaPromise<GetFileMetadataAggregateType<T>>

    /**
     * Group by FileMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileMetadataGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FileMetadataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FileMetadataGroupByArgs['orderBy'] }
        : { orderBy?: FileMetadataGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FileMetadataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFileMetadataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FileMetadata model
   */
  readonly fields: FileMetadataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FileMetadata.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FileMetadataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    parentRelationships<T extends FileMetadata$parentRelationshipsArgs<ExtArgs> = {}>(args?: Subset<T, FileMetadata$parentRelationshipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileRelationshipPayload<ExtArgs>, T, "findMany"> | Null>
    childRelationships<T extends FileMetadata$childRelationshipsArgs<ExtArgs> = {}>(args?: Subset<T, FileMetadata$childRelationshipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileRelationshipPayload<ExtArgs>, T, "findMany"> | Null>
    sessionFiles<T extends FileMetadata$sessionFilesArgs<ExtArgs> = {}>(args?: Subset<T, FileMetadata$sessionFilesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UploadSessionFilePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FileMetadata model
   */ 
  interface FileMetadataFieldRefs {
    readonly id: FieldRef<"FileMetadata", 'String'>
    readonly originalName: FieldRef<"FileMetadata", 'String'>
    readonly fileName: FieldRef<"FileMetadata", 'String'>
    readonly mimeType: FieldRef<"FileMetadata", 'String'>
    readonly size: FieldRef<"FileMetadata", 'Int'>
    readonly path: FieldRef<"FileMetadata", 'String'>
    readonly url: FieldRef<"FileMetadata", 'String'>
    readonly cdnUrl: FieldRef<"FileMetadata", 'String'>
    readonly uploadedBy: FieldRef<"FileMetadata", 'String'>
    readonly entityType: FieldRef<"FileMetadata", 'EntityType'>
    readonly entityId: FieldRef<"FileMetadata", 'String'>
    readonly status: FieldRef<"FileMetadata", 'FileStatus'>
    readonly processingResults: FieldRef<"FileMetadata", 'Json'>
    readonly thumbnails: FieldRef<"FileMetadata", 'Json'>
    readonly accessLevel: FieldRef<"FileMetadata", 'AccessLevel'>
    readonly permissions: FieldRef<"FileMetadata", 'Json'>
    readonly metadata: FieldRef<"FileMetadata", 'Json'>
    readonly tags: FieldRef<"FileMetadata", 'String[]'>
    readonly createdAt: FieldRef<"FileMetadata", 'DateTime'>
    readonly updatedAt: FieldRef<"FileMetadata", 'DateTime'>
    readonly expiresAt: FieldRef<"FileMetadata", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FileMetadata findUnique
   */
  export type FileMetadataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMetadata
     */
    select?: FileMetadataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMetadataInclude<ExtArgs> | null
    /**
     * Filter, which FileMetadata to fetch.
     */
    where: FileMetadataWhereUniqueInput
  }

  /**
   * FileMetadata findUniqueOrThrow
   */
  export type FileMetadataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMetadata
     */
    select?: FileMetadataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMetadataInclude<ExtArgs> | null
    /**
     * Filter, which FileMetadata to fetch.
     */
    where: FileMetadataWhereUniqueInput
  }

  /**
   * FileMetadata findFirst
   */
  export type FileMetadataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMetadata
     */
    select?: FileMetadataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMetadataInclude<ExtArgs> | null
    /**
     * Filter, which FileMetadata to fetch.
     */
    where?: FileMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileMetadata to fetch.
     */
    orderBy?: FileMetadataOrderByWithRelationInput | FileMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileMetadata.
     */
    cursor?: FileMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileMetadata.
     */
    distinct?: FileMetadataScalarFieldEnum | FileMetadataScalarFieldEnum[]
  }

  /**
   * FileMetadata findFirstOrThrow
   */
  export type FileMetadataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMetadata
     */
    select?: FileMetadataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMetadataInclude<ExtArgs> | null
    /**
     * Filter, which FileMetadata to fetch.
     */
    where?: FileMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileMetadata to fetch.
     */
    orderBy?: FileMetadataOrderByWithRelationInput | FileMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileMetadata.
     */
    cursor?: FileMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileMetadata.
     */
    distinct?: FileMetadataScalarFieldEnum | FileMetadataScalarFieldEnum[]
  }

  /**
   * FileMetadata findMany
   */
  export type FileMetadataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMetadata
     */
    select?: FileMetadataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMetadataInclude<ExtArgs> | null
    /**
     * Filter, which FileMetadata to fetch.
     */
    where?: FileMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileMetadata to fetch.
     */
    orderBy?: FileMetadataOrderByWithRelationInput | FileMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FileMetadata.
     */
    cursor?: FileMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileMetadata.
     */
    skip?: number
    distinct?: FileMetadataScalarFieldEnum | FileMetadataScalarFieldEnum[]
  }

  /**
   * FileMetadata create
   */
  export type FileMetadataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMetadata
     */
    select?: FileMetadataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMetadataInclude<ExtArgs> | null
    /**
     * The data needed to create a FileMetadata.
     */
    data: XOR<FileMetadataCreateInput, FileMetadataUncheckedCreateInput>
  }

  /**
   * FileMetadata createMany
   */
  export type FileMetadataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FileMetadata.
     */
    data: FileMetadataCreateManyInput | FileMetadataCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FileMetadata createManyAndReturn
   */
  export type FileMetadataCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMetadata
     */
    select?: FileMetadataSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many FileMetadata.
     */
    data: FileMetadataCreateManyInput | FileMetadataCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FileMetadata update
   */
  export type FileMetadataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMetadata
     */
    select?: FileMetadataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMetadataInclude<ExtArgs> | null
    /**
     * The data needed to update a FileMetadata.
     */
    data: XOR<FileMetadataUpdateInput, FileMetadataUncheckedUpdateInput>
    /**
     * Choose, which FileMetadata to update.
     */
    where: FileMetadataWhereUniqueInput
  }

  /**
   * FileMetadata updateMany
   */
  export type FileMetadataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FileMetadata.
     */
    data: XOR<FileMetadataUpdateManyMutationInput, FileMetadataUncheckedUpdateManyInput>
    /**
     * Filter which FileMetadata to update
     */
    where?: FileMetadataWhereInput
  }

  /**
   * FileMetadata upsert
   */
  export type FileMetadataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMetadata
     */
    select?: FileMetadataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMetadataInclude<ExtArgs> | null
    /**
     * The filter to search for the FileMetadata to update in case it exists.
     */
    where: FileMetadataWhereUniqueInput
    /**
     * In case the FileMetadata found by the `where` argument doesn't exist, create a new FileMetadata with this data.
     */
    create: XOR<FileMetadataCreateInput, FileMetadataUncheckedCreateInput>
    /**
     * In case the FileMetadata was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FileMetadataUpdateInput, FileMetadataUncheckedUpdateInput>
  }

  /**
   * FileMetadata delete
   */
  export type FileMetadataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMetadata
     */
    select?: FileMetadataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMetadataInclude<ExtArgs> | null
    /**
     * Filter which FileMetadata to delete.
     */
    where: FileMetadataWhereUniqueInput
  }

  /**
   * FileMetadata deleteMany
   */
  export type FileMetadataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileMetadata to delete
     */
    where?: FileMetadataWhereInput
  }

  /**
   * FileMetadata.parentRelationships
   */
  export type FileMetadata$parentRelationshipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRelationship
     */
    select?: FileRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileRelationshipInclude<ExtArgs> | null
    where?: FileRelationshipWhereInput
    orderBy?: FileRelationshipOrderByWithRelationInput | FileRelationshipOrderByWithRelationInput[]
    cursor?: FileRelationshipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FileRelationshipScalarFieldEnum | FileRelationshipScalarFieldEnum[]
  }

  /**
   * FileMetadata.childRelationships
   */
  export type FileMetadata$childRelationshipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRelationship
     */
    select?: FileRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileRelationshipInclude<ExtArgs> | null
    where?: FileRelationshipWhereInput
    orderBy?: FileRelationshipOrderByWithRelationInput | FileRelationshipOrderByWithRelationInput[]
    cursor?: FileRelationshipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FileRelationshipScalarFieldEnum | FileRelationshipScalarFieldEnum[]
  }

  /**
   * FileMetadata.sessionFiles
   */
  export type FileMetadata$sessionFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSessionFile
     */
    select?: UploadSessionFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionFileInclude<ExtArgs> | null
    where?: UploadSessionFileWhereInput
    orderBy?: UploadSessionFileOrderByWithRelationInput | UploadSessionFileOrderByWithRelationInput[]
    cursor?: UploadSessionFileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UploadSessionFileScalarFieldEnum | UploadSessionFileScalarFieldEnum[]
  }

  /**
   * FileMetadata without action
   */
  export type FileMetadataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMetadata
     */
    select?: FileMetadataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMetadataInclude<ExtArgs> | null
  }


  /**
   * Model FileRelationship
   */

  export type AggregateFileRelationship = {
    _count: FileRelationshipCountAggregateOutputType | null
    _min: FileRelationshipMinAggregateOutputType | null
    _max: FileRelationshipMaxAggregateOutputType | null
  }

  export type FileRelationshipMinAggregateOutputType = {
    id: string | null
    parentId: string | null
    childId: string | null
    relationshipType: $Enums.RelationshipType | null
    createdAt: Date | null
  }

  export type FileRelationshipMaxAggregateOutputType = {
    id: string | null
    parentId: string | null
    childId: string | null
    relationshipType: $Enums.RelationshipType | null
    createdAt: Date | null
  }

  export type FileRelationshipCountAggregateOutputType = {
    id: number
    parentId: number
    childId: number
    relationshipType: number
    createdAt: number
    _all: number
  }


  export type FileRelationshipMinAggregateInputType = {
    id?: true
    parentId?: true
    childId?: true
    relationshipType?: true
    createdAt?: true
  }

  export type FileRelationshipMaxAggregateInputType = {
    id?: true
    parentId?: true
    childId?: true
    relationshipType?: true
    createdAt?: true
  }

  export type FileRelationshipCountAggregateInputType = {
    id?: true
    parentId?: true
    childId?: true
    relationshipType?: true
    createdAt?: true
    _all?: true
  }

  export type FileRelationshipAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileRelationship to aggregate.
     */
    where?: FileRelationshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileRelationships to fetch.
     */
    orderBy?: FileRelationshipOrderByWithRelationInput | FileRelationshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FileRelationshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileRelationships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileRelationships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FileRelationships
    **/
    _count?: true | FileRelationshipCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FileRelationshipMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FileRelationshipMaxAggregateInputType
  }

  export type GetFileRelationshipAggregateType<T extends FileRelationshipAggregateArgs> = {
        [P in keyof T & keyof AggregateFileRelationship]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFileRelationship[P]>
      : GetScalarType<T[P], AggregateFileRelationship[P]>
  }




  export type FileRelationshipGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileRelationshipWhereInput
    orderBy?: FileRelationshipOrderByWithAggregationInput | FileRelationshipOrderByWithAggregationInput[]
    by: FileRelationshipScalarFieldEnum[] | FileRelationshipScalarFieldEnum
    having?: FileRelationshipScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FileRelationshipCountAggregateInputType | true
    _min?: FileRelationshipMinAggregateInputType
    _max?: FileRelationshipMaxAggregateInputType
  }

  export type FileRelationshipGroupByOutputType = {
    id: string
    parentId: string
    childId: string
    relationshipType: $Enums.RelationshipType
    createdAt: Date
    _count: FileRelationshipCountAggregateOutputType | null
    _min: FileRelationshipMinAggregateOutputType | null
    _max: FileRelationshipMaxAggregateOutputType | null
  }

  type GetFileRelationshipGroupByPayload<T extends FileRelationshipGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FileRelationshipGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FileRelationshipGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FileRelationshipGroupByOutputType[P]>
            : GetScalarType<T[P], FileRelationshipGroupByOutputType[P]>
        }
      >
    >


  export type FileRelationshipSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    parentId?: boolean
    childId?: boolean
    relationshipType?: boolean
    createdAt?: boolean
    parent?: boolean | FileMetadataDefaultArgs<ExtArgs>
    child?: boolean | FileMetadataDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fileRelationship"]>

  export type FileRelationshipSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    parentId?: boolean
    childId?: boolean
    relationshipType?: boolean
    createdAt?: boolean
    parent?: boolean | FileMetadataDefaultArgs<ExtArgs>
    child?: boolean | FileMetadataDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fileRelationship"]>

  export type FileRelationshipSelectScalar = {
    id?: boolean
    parentId?: boolean
    childId?: boolean
    relationshipType?: boolean
    createdAt?: boolean
  }

  export type FileRelationshipInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | FileMetadataDefaultArgs<ExtArgs>
    child?: boolean | FileMetadataDefaultArgs<ExtArgs>
  }
  export type FileRelationshipIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | FileMetadataDefaultArgs<ExtArgs>
    child?: boolean | FileMetadataDefaultArgs<ExtArgs>
  }

  export type $FileRelationshipPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FileRelationship"
    objects: {
      parent: Prisma.$FileMetadataPayload<ExtArgs>
      child: Prisma.$FileMetadataPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      parentId: string
      childId: string
      relationshipType: $Enums.RelationshipType
      createdAt: Date
    }, ExtArgs["result"]["fileRelationship"]>
    composites: {}
  }

  type FileRelationshipGetPayload<S extends boolean | null | undefined | FileRelationshipDefaultArgs> = $Result.GetResult<Prisma.$FileRelationshipPayload, S>

  type FileRelationshipCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FileRelationshipFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FileRelationshipCountAggregateInputType | true
    }

  export interface FileRelationshipDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FileRelationship'], meta: { name: 'FileRelationship' } }
    /**
     * Find zero or one FileRelationship that matches the filter.
     * @param {FileRelationshipFindUniqueArgs} args - Arguments to find a FileRelationship
     * @example
     * // Get one FileRelationship
     * const fileRelationship = await prisma.fileRelationship.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FileRelationshipFindUniqueArgs>(args: SelectSubset<T, FileRelationshipFindUniqueArgs<ExtArgs>>): Prisma__FileRelationshipClient<$Result.GetResult<Prisma.$FileRelationshipPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one FileRelationship that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FileRelationshipFindUniqueOrThrowArgs} args - Arguments to find a FileRelationship
     * @example
     * // Get one FileRelationship
     * const fileRelationship = await prisma.fileRelationship.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FileRelationshipFindUniqueOrThrowArgs>(args: SelectSubset<T, FileRelationshipFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FileRelationshipClient<$Result.GetResult<Prisma.$FileRelationshipPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first FileRelationship that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileRelationshipFindFirstArgs} args - Arguments to find a FileRelationship
     * @example
     * // Get one FileRelationship
     * const fileRelationship = await prisma.fileRelationship.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FileRelationshipFindFirstArgs>(args?: SelectSubset<T, FileRelationshipFindFirstArgs<ExtArgs>>): Prisma__FileRelationshipClient<$Result.GetResult<Prisma.$FileRelationshipPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first FileRelationship that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileRelationshipFindFirstOrThrowArgs} args - Arguments to find a FileRelationship
     * @example
     * // Get one FileRelationship
     * const fileRelationship = await prisma.fileRelationship.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FileRelationshipFindFirstOrThrowArgs>(args?: SelectSubset<T, FileRelationshipFindFirstOrThrowArgs<ExtArgs>>): Prisma__FileRelationshipClient<$Result.GetResult<Prisma.$FileRelationshipPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more FileRelationships that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileRelationshipFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FileRelationships
     * const fileRelationships = await prisma.fileRelationship.findMany()
     * 
     * // Get first 10 FileRelationships
     * const fileRelationships = await prisma.fileRelationship.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fileRelationshipWithIdOnly = await prisma.fileRelationship.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FileRelationshipFindManyArgs>(args?: SelectSubset<T, FileRelationshipFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileRelationshipPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a FileRelationship.
     * @param {FileRelationshipCreateArgs} args - Arguments to create a FileRelationship.
     * @example
     * // Create one FileRelationship
     * const FileRelationship = await prisma.fileRelationship.create({
     *   data: {
     *     // ... data to create a FileRelationship
     *   }
     * })
     * 
     */
    create<T extends FileRelationshipCreateArgs>(args: SelectSubset<T, FileRelationshipCreateArgs<ExtArgs>>): Prisma__FileRelationshipClient<$Result.GetResult<Prisma.$FileRelationshipPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many FileRelationships.
     * @param {FileRelationshipCreateManyArgs} args - Arguments to create many FileRelationships.
     * @example
     * // Create many FileRelationships
     * const fileRelationship = await prisma.fileRelationship.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FileRelationshipCreateManyArgs>(args?: SelectSubset<T, FileRelationshipCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FileRelationships and returns the data saved in the database.
     * @param {FileRelationshipCreateManyAndReturnArgs} args - Arguments to create many FileRelationships.
     * @example
     * // Create many FileRelationships
     * const fileRelationship = await prisma.fileRelationship.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FileRelationships and only return the `id`
     * const fileRelationshipWithIdOnly = await prisma.fileRelationship.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FileRelationshipCreateManyAndReturnArgs>(args?: SelectSubset<T, FileRelationshipCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileRelationshipPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a FileRelationship.
     * @param {FileRelationshipDeleteArgs} args - Arguments to delete one FileRelationship.
     * @example
     * // Delete one FileRelationship
     * const FileRelationship = await prisma.fileRelationship.delete({
     *   where: {
     *     // ... filter to delete one FileRelationship
     *   }
     * })
     * 
     */
    delete<T extends FileRelationshipDeleteArgs>(args: SelectSubset<T, FileRelationshipDeleteArgs<ExtArgs>>): Prisma__FileRelationshipClient<$Result.GetResult<Prisma.$FileRelationshipPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one FileRelationship.
     * @param {FileRelationshipUpdateArgs} args - Arguments to update one FileRelationship.
     * @example
     * // Update one FileRelationship
     * const fileRelationship = await prisma.fileRelationship.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FileRelationshipUpdateArgs>(args: SelectSubset<T, FileRelationshipUpdateArgs<ExtArgs>>): Prisma__FileRelationshipClient<$Result.GetResult<Prisma.$FileRelationshipPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more FileRelationships.
     * @param {FileRelationshipDeleteManyArgs} args - Arguments to filter FileRelationships to delete.
     * @example
     * // Delete a few FileRelationships
     * const { count } = await prisma.fileRelationship.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FileRelationshipDeleteManyArgs>(args?: SelectSubset<T, FileRelationshipDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FileRelationships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileRelationshipUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FileRelationships
     * const fileRelationship = await prisma.fileRelationship.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FileRelationshipUpdateManyArgs>(args: SelectSubset<T, FileRelationshipUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FileRelationship.
     * @param {FileRelationshipUpsertArgs} args - Arguments to update or create a FileRelationship.
     * @example
     * // Update or create a FileRelationship
     * const fileRelationship = await prisma.fileRelationship.upsert({
     *   create: {
     *     // ... data to create a FileRelationship
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FileRelationship we want to update
     *   }
     * })
     */
    upsert<T extends FileRelationshipUpsertArgs>(args: SelectSubset<T, FileRelationshipUpsertArgs<ExtArgs>>): Prisma__FileRelationshipClient<$Result.GetResult<Prisma.$FileRelationshipPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of FileRelationships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileRelationshipCountArgs} args - Arguments to filter FileRelationships to count.
     * @example
     * // Count the number of FileRelationships
     * const count = await prisma.fileRelationship.count({
     *   where: {
     *     // ... the filter for the FileRelationships we want to count
     *   }
     * })
    **/
    count<T extends FileRelationshipCountArgs>(
      args?: Subset<T, FileRelationshipCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FileRelationshipCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FileRelationship.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileRelationshipAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FileRelationshipAggregateArgs>(args: Subset<T, FileRelationshipAggregateArgs>): Prisma.PrismaPromise<GetFileRelationshipAggregateType<T>>

    /**
     * Group by FileRelationship.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileRelationshipGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FileRelationshipGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FileRelationshipGroupByArgs['orderBy'] }
        : { orderBy?: FileRelationshipGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FileRelationshipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFileRelationshipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FileRelationship model
   */
  readonly fields: FileRelationshipFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FileRelationship.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FileRelationshipClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    parent<T extends FileMetadataDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FileMetadataDefaultArgs<ExtArgs>>): Prisma__FileMetadataClient<$Result.GetResult<Prisma.$FileMetadataPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    child<T extends FileMetadataDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FileMetadataDefaultArgs<ExtArgs>>): Prisma__FileMetadataClient<$Result.GetResult<Prisma.$FileMetadataPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FileRelationship model
   */ 
  interface FileRelationshipFieldRefs {
    readonly id: FieldRef<"FileRelationship", 'String'>
    readonly parentId: FieldRef<"FileRelationship", 'String'>
    readonly childId: FieldRef<"FileRelationship", 'String'>
    readonly relationshipType: FieldRef<"FileRelationship", 'RelationshipType'>
    readonly createdAt: FieldRef<"FileRelationship", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FileRelationship findUnique
   */
  export type FileRelationshipFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRelationship
     */
    select?: FileRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileRelationshipInclude<ExtArgs> | null
    /**
     * Filter, which FileRelationship to fetch.
     */
    where: FileRelationshipWhereUniqueInput
  }

  /**
   * FileRelationship findUniqueOrThrow
   */
  export type FileRelationshipFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRelationship
     */
    select?: FileRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileRelationshipInclude<ExtArgs> | null
    /**
     * Filter, which FileRelationship to fetch.
     */
    where: FileRelationshipWhereUniqueInput
  }

  /**
   * FileRelationship findFirst
   */
  export type FileRelationshipFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRelationship
     */
    select?: FileRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileRelationshipInclude<ExtArgs> | null
    /**
     * Filter, which FileRelationship to fetch.
     */
    where?: FileRelationshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileRelationships to fetch.
     */
    orderBy?: FileRelationshipOrderByWithRelationInput | FileRelationshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileRelationships.
     */
    cursor?: FileRelationshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileRelationships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileRelationships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileRelationships.
     */
    distinct?: FileRelationshipScalarFieldEnum | FileRelationshipScalarFieldEnum[]
  }

  /**
   * FileRelationship findFirstOrThrow
   */
  export type FileRelationshipFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRelationship
     */
    select?: FileRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileRelationshipInclude<ExtArgs> | null
    /**
     * Filter, which FileRelationship to fetch.
     */
    where?: FileRelationshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileRelationships to fetch.
     */
    orderBy?: FileRelationshipOrderByWithRelationInput | FileRelationshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileRelationships.
     */
    cursor?: FileRelationshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileRelationships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileRelationships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileRelationships.
     */
    distinct?: FileRelationshipScalarFieldEnum | FileRelationshipScalarFieldEnum[]
  }

  /**
   * FileRelationship findMany
   */
  export type FileRelationshipFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRelationship
     */
    select?: FileRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileRelationshipInclude<ExtArgs> | null
    /**
     * Filter, which FileRelationships to fetch.
     */
    where?: FileRelationshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileRelationships to fetch.
     */
    orderBy?: FileRelationshipOrderByWithRelationInput | FileRelationshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FileRelationships.
     */
    cursor?: FileRelationshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileRelationships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileRelationships.
     */
    skip?: number
    distinct?: FileRelationshipScalarFieldEnum | FileRelationshipScalarFieldEnum[]
  }

  /**
   * FileRelationship create
   */
  export type FileRelationshipCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRelationship
     */
    select?: FileRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileRelationshipInclude<ExtArgs> | null
    /**
     * The data needed to create a FileRelationship.
     */
    data: XOR<FileRelationshipCreateInput, FileRelationshipUncheckedCreateInput>
  }

  /**
   * FileRelationship createMany
   */
  export type FileRelationshipCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FileRelationships.
     */
    data: FileRelationshipCreateManyInput | FileRelationshipCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FileRelationship createManyAndReturn
   */
  export type FileRelationshipCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRelationship
     */
    select?: FileRelationshipSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many FileRelationships.
     */
    data: FileRelationshipCreateManyInput | FileRelationshipCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileRelationshipIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FileRelationship update
   */
  export type FileRelationshipUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRelationship
     */
    select?: FileRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileRelationshipInclude<ExtArgs> | null
    /**
     * The data needed to update a FileRelationship.
     */
    data: XOR<FileRelationshipUpdateInput, FileRelationshipUncheckedUpdateInput>
    /**
     * Choose, which FileRelationship to update.
     */
    where: FileRelationshipWhereUniqueInput
  }

  /**
   * FileRelationship updateMany
   */
  export type FileRelationshipUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FileRelationships.
     */
    data: XOR<FileRelationshipUpdateManyMutationInput, FileRelationshipUncheckedUpdateManyInput>
    /**
     * Filter which FileRelationships to update
     */
    where?: FileRelationshipWhereInput
  }

  /**
   * FileRelationship upsert
   */
  export type FileRelationshipUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRelationship
     */
    select?: FileRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileRelationshipInclude<ExtArgs> | null
    /**
     * The filter to search for the FileRelationship to update in case it exists.
     */
    where: FileRelationshipWhereUniqueInput
    /**
     * In case the FileRelationship found by the `where` argument doesn't exist, create a new FileRelationship with this data.
     */
    create: XOR<FileRelationshipCreateInput, FileRelationshipUncheckedCreateInput>
    /**
     * In case the FileRelationship was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FileRelationshipUpdateInput, FileRelationshipUncheckedUpdateInput>
  }

  /**
   * FileRelationship delete
   */
  export type FileRelationshipDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRelationship
     */
    select?: FileRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileRelationshipInclude<ExtArgs> | null
    /**
     * Filter which FileRelationship to delete.
     */
    where: FileRelationshipWhereUniqueInput
  }

  /**
   * FileRelationship deleteMany
   */
  export type FileRelationshipDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileRelationships to delete
     */
    where?: FileRelationshipWhereInput
  }

  /**
   * FileRelationship without action
   */
  export type FileRelationshipDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRelationship
     */
    select?: FileRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileRelationshipInclude<ExtArgs> | null
  }


  /**
   * Model UploadSession
   */

  export type AggregateUploadSession = {
    _count: UploadSessionCountAggregateOutputType | null
    _avg: UploadSessionAvgAggregateOutputType | null
    _sum: UploadSessionSumAggregateOutputType | null
    _min: UploadSessionMinAggregateOutputType | null
    _max: UploadSessionMaxAggregateOutputType | null
  }

  export type UploadSessionAvgAggregateOutputType = {
    totalFiles: number | null
    uploadedFiles: number | null
    failedFiles: number | null
  }

  export type UploadSessionSumAggregateOutputType = {
    totalFiles: number | null
    uploadedFiles: number | null
    failedFiles: number | null
  }

  export type UploadSessionMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    uploadedBy: string | null
    status: $Enums.UploadStatus | null
    totalFiles: number | null
    uploadedFiles: number | null
    failedFiles: number | null
    createdAt: Date | null
    updatedAt: Date | null
    expiresAt: Date | null
  }

  export type UploadSessionMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    uploadedBy: string | null
    status: $Enums.UploadStatus | null
    totalFiles: number | null
    uploadedFiles: number | null
    failedFiles: number | null
    createdAt: Date | null
    updatedAt: Date | null
    expiresAt: Date | null
  }

  export type UploadSessionCountAggregateOutputType = {
    id: number
    sessionId: number
    uploadedBy: number
    status: number
    totalFiles: number
    uploadedFiles: number
    failedFiles: number
    metadata: number
    createdAt: number
    updatedAt: number
    expiresAt: number
    _all: number
  }


  export type UploadSessionAvgAggregateInputType = {
    totalFiles?: true
    uploadedFiles?: true
    failedFiles?: true
  }

  export type UploadSessionSumAggregateInputType = {
    totalFiles?: true
    uploadedFiles?: true
    failedFiles?: true
  }

  export type UploadSessionMinAggregateInputType = {
    id?: true
    sessionId?: true
    uploadedBy?: true
    status?: true
    totalFiles?: true
    uploadedFiles?: true
    failedFiles?: true
    createdAt?: true
    updatedAt?: true
    expiresAt?: true
  }

  export type UploadSessionMaxAggregateInputType = {
    id?: true
    sessionId?: true
    uploadedBy?: true
    status?: true
    totalFiles?: true
    uploadedFiles?: true
    failedFiles?: true
    createdAt?: true
    updatedAt?: true
    expiresAt?: true
  }

  export type UploadSessionCountAggregateInputType = {
    id?: true
    sessionId?: true
    uploadedBy?: true
    status?: true
    totalFiles?: true
    uploadedFiles?: true
    failedFiles?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    expiresAt?: true
    _all?: true
  }

  export type UploadSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UploadSession to aggregate.
     */
    where?: UploadSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UploadSessions to fetch.
     */
    orderBy?: UploadSessionOrderByWithRelationInput | UploadSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UploadSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UploadSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UploadSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UploadSessions
    **/
    _count?: true | UploadSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UploadSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UploadSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UploadSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UploadSessionMaxAggregateInputType
  }

  export type GetUploadSessionAggregateType<T extends UploadSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateUploadSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUploadSession[P]>
      : GetScalarType<T[P], AggregateUploadSession[P]>
  }




  export type UploadSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UploadSessionWhereInput
    orderBy?: UploadSessionOrderByWithAggregationInput | UploadSessionOrderByWithAggregationInput[]
    by: UploadSessionScalarFieldEnum[] | UploadSessionScalarFieldEnum
    having?: UploadSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UploadSessionCountAggregateInputType | true
    _avg?: UploadSessionAvgAggregateInputType
    _sum?: UploadSessionSumAggregateInputType
    _min?: UploadSessionMinAggregateInputType
    _max?: UploadSessionMaxAggregateInputType
  }

  export type UploadSessionGroupByOutputType = {
    id: string
    sessionId: string
    uploadedBy: string
    status: $Enums.UploadStatus
    totalFiles: number
    uploadedFiles: number
    failedFiles: number
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    expiresAt: Date
    _count: UploadSessionCountAggregateOutputType | null
    _avg: UploadSessionAvgAggregateOutputType | null
    _sum: UploadSessionSumAggregateOutputType | null
    _min: UploadSessionMinAggregateOutputType | null
    _max: UploadSessionMaxAggregateOutputType | null
  }

  type GetUploadSessionGroupByPayload<T extends UploadSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UploadSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UploadSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UploadSessionGroupByOutputType[P]>
            : GetScalarType<T[P], UploadSessionGroupByOutputType[P]>
        }
      >
    >


  export type UploadSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    uploadedBy?: boolean
    status?: boolean
    totalFiles?: boolean
    uploadedFiles?: boolean
    failedFiles?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    expiresAt?: boolean
    files?: boolean | UploadSession$filesArgs<ExtArgs>
    _count?: boolean | UploadSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["uploadSession"]>

  export type UploadSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    uploadedBy?: boolean
    status?: boolean
    totalFiles?: boolean
    uploadedFiles?: boolean
    failedFiles?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["uploadSession"]>

  export type UploadSessionSelectScalar = {
    id?: boolean
    sessionId?: boolean
    uploadedBy?: boolean
    status?: boolean
    totalFiles?: boolean
    uploadedFiles?: boolean
    failedFiles?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    expiresAt?: boolean
  }

  export type UploadSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    files?: boolean | UploadSession$filesArgs<ExtArgs>
    _count?: boolean | UploadSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UploadSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UploadSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UploadSession"
    objects: {
      files: Prisma.$UploadSessionFilePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      uploadedBy: string
      status: $Enums.UploadStatus
      totalFiles: number
      uploadedFiles: number
      failedFiles: number
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
      expiresAt: Date
    }, ExtArgs["result"]["uploadSession"]>
    composites: {}
  }

  type UploadSessionGetPayload<S extends boolean | null | undefined | UploadSessionDefaultArgs> = $Result.GetResult<Prisma.$UploadSessionPayload, S>

  type UploadSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UploadSessionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UploadSessionCountAggregateInputType | true
    }

  export interface UploadSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UploadSession'], meta: { name: 'UploadSession' } }
    /**
     * Find zero or one UploadSession that matches the filter.
     * @param {UploadSessionFindUniqueArgs} args - Arguments to find a UploadSession
     * @example
     * // Get one UploadSession
     * const uploadSession = await prisma.uploadSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UploadSessionFindUniqueArgs>(args: SelectSubset<T, UploadSessionFindUniqueArgs<ExtArgs>>): Prisma__UploadSessionClient<$Result.GetResult<Prisma.$UploadSessionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UploadSession that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UploadSessionFindUniqueOrThrowArgs} args - Arguments to find a UploadSession
     * @example
     * // Get one UploadSession
     * const uploadSession = await prisma.uploadSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UploadSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, UploadSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UploadSessionClient<$Result.GetResult<Prisma.$UploadSessionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UploadSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadSessionFindFirstArgs} args - Arguments to find a UploadSession
     * @example
     * // Get one UploadSession
     * const uploadSession = await prisma.uploadSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UploadSessionFindFirstArgs>(args?: SelectSubset<T, UploadSessionFindFirstArgs<ExtArgs>>): Prisma__UploadSessionClient<$Result.GetResult<Prisma.$UploadSessionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UploadSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadSessionFindFirstOrThrowArgs} args - Arguments to find a UploadSession
     * @example
     * // Get one UploadSession
     * const uploadSession = await prisma.uploadSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UploadSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, UploadSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__UploadSessionClient<$Result.GetResult<Prisma.$UploadSessionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UploadSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UploadSessions
     * const uploadSessions = await prisma.uploadSession.findMany()
     * 
     * // Get first 10 UploadSessions
     * const uploadSessions = await prisma.uploadSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const uploadSessionWithIdOnly = await prisma.uploadSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UploadSessionFindManyArgs>(args?: SelectSubset<T, UploadSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UploadSessionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UploadSession.
     * @param {UploadSessionCreateArgs} args - Arguments to create a UploadSession.
     * @example
     * // Create one UploadSession
     * const UploadSession = await prisma.uploadSession.create({
     *   data: {
     *     // ... data to create a UploadSession
     *   }
     * })
     * 
     */
    create<T extends UploadSessionCreateArgs>(args: SelectSubset<T, UploadSessionCreateArgs<ExtArgs>>): Prisma__UploadSessionClient<$Result.GetResult<Prisma.$UploadSessionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UploadSessions.
     * @param {UploadSessionCreateManyArgs} args - Arguments to create many UploadSessions.
     * @example
     * // Create many UploadSessions
     * const uploadSession = await prisma.uploadSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UploadSessionCreateManyArgs>(args?: SelectSubset<T, UploadSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UploadSessions and returns the data saved in the database.
     * @param {UploadSessionCreateManyAndReturnArgs} args - Arguments to create many UploadSessions.
     * @example
     * // Create many UploadSessions
     * const uploadSession = await prisma.uploadSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UploadSessions and only return the `id`
     * const uploadSessionWithIdOnly = await prisma.uploadSession.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UploadSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, UploadSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UploadSessionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UploadSession.
     * @param {UploadSessionDeleteArgs} args - Arguments to delete one UploadSession.
     * @example
     * // Delete one UploadSession
     * const UploadSession = await prisma.uploadSession.delete({
     *   where: {
     *     // ... filter to delete one UploadSession
     *   }
     * })
     * 
     */
    delete<T extends UploadSessionDeleteArgs>(args: SelectSubset<T, UploadSessionDeleteArgs<ExtArgs>>): Prisma__UploadSessionClient<$Result.GetResult<Prisma.$UploadSessionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UploadSession.
     * @param {UploadSessionUpdateArgs} args - Arguments to update one UploadSession.
     * @example
     * // Update one UploadSession
     * const uploadSession = await prisma.uploadSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UploadSessionUpdateArgs>(args: SelectSubset<T, UploadSessionUpdateArgs<ExtArgs>>): Prisma__UploadSessionClient<$Result.GetResult<Prisma.$UploadSessionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UploadSessions.
     * @param {UploadSessionDeleteManyArgs} args - Arguments to filter UploadSessions to delete.
     * @example
     * // Delete a few UploadSessions
     * const { count } = await prisma.uploadSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UploadSessionDeleteManyArgs>(args?: SelectSubset<T, UploadSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UploadSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UploadSessions
     * const uploadSession = await prisma.uploadSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UploadSessionUpdateManyArgs>(args: SelectSubset<T, UploadSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UploadSession.
     * @param {UploadSessionUpsertArgs} args - Arguments to update or create a UploadSession.
     * @example
     * // Update or create a UploadSession
     * const uploadSession = await prisma.uploadSession.upsert({
     *   create: {
     *     // ... data to create a UploadSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UploadSession we want to update
     *   }
     * })
     */
    upsert<T extends UploadSessionUpsertArgs>(args: SelectSubset<T, UploadSessionUpsertArgs<ExtArgs>>): Prisma__UploadSessionClient<$Result.GetResult<Prisma.$UploadSessionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UploadSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadSessionCountArgs} args - Arguments to filter UploadSessions to count.
     * @example
     * // Count the number of UploadSessions
     * const count = await prisma.uploadSession.count({
     *   where: {
     *     // ... the filter for the UploadSessions we want to count
     *   }
     * })
    **/
    count<T extends UploadSessionCountArgs>(
      args?: Subset<T, UploadSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UploadSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UploadSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UploadSessionAggregateArgs>(args: Subset<T, UploadSessionAggregateArgs>): Prisma.PrismaPromise<GetUploadSessionAggregateType<T>>

    /**
     * Group by UploadSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UploadSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UploadSessionGroupByArgs['orderBy'] }
        : { orderBy?: UploadSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UploadSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUploadSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UploadSession model
   */
  readonly fields: UploadSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UploadSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UploadSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    files<T extends UploadSession$filesArgs<ExtArgs> = {}>(args?: Subset<T, UploadSession$filesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UploadSessionFilePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UploadSession model
   */ 
  interface UploadSessionFieldRefs {
    readonly id: FieldRef<"UploadSession", 'String'>
    readonly sessionId: FieldRef<"UploadSession", 'String'>
    readonly uploadedBy: FieldRef<"UploadSession", 'String'>
    readonly status: FieldRef<"UploadSession", 'UploadStatus'>
    readonly totalFiles: FieldRef<"UploadSession", 'Int'>
    readonly uploadedFiles: FieldRef<"UploadSession", 'Int'>
    readonly failedFiles: FieldRef<"UploadSession", 'Int'>
    readonly metadata: FieldRef<"UploadSession", 'Json'>
    readonly createdAt: FieldRef<"UploadSession", 'DateTime'>
    readonly updatedAt: FieldRef<"UploadSession", 'DateTime'>
    readonly expiresAt: FieldRef<"UploadSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UploadSession findUnique
   */
  export type UploadSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSession
     */
    select?: UploadSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionInclude<ExtArgs> | null
    /**
     * Filter, which UploadSession to fetch.
     */
    where: UploadSessionWhereUniqueInput
  }

  /**
   * UploadSession findUniqueOrThrow
   */
  export type UploadSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSession
     */
    select?: UploadSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionInclude<ExtArgs> | null
    /**
     * Filter, which UploadSession to fetch.
     */
    where: UploadSessionWhereUniqueInput
  }

  /**
   * UploadSession findFirst
   */
  export type UploadSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSession
     */
    select?: UploadSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionInclude<ExtArgs> | null
    /**
     * Filter, which UploadSession to fetch.
     */
    where?: UploadSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UploadSessions to fetch.
     */
    orderBy?: UploadSessionOrderByWithRelationInput | UploadSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UploadSessions.
     */
    cursor?: UploadSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UploadSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UploadSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UploadSessions.
     */
    distinct?: UploadSessionScalarFieldEnum | UploadSessionScalarFieldEnum[]
  }

  /**
   * UploadSession findFirstOrThrow
   */
  export type UploadSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSession
     */
    select?: UploadSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionInclude<ExtArgs> | null
    /**
     * Filter, which UploadSession to fetch.
     */
    where?: UploadSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UploadSessions to fetch.
     */
    orderBy?: UploadSessionOrderByWithRelationInput | UploadSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UploadSessions.
     */
    cursor?: UploadSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UploadSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UploadSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UploadSessions.
     */
    distinct?: UploadSessionScalarFieldEnum | UploadSessionScalarFieldEnum[]
  }

  /**
   * UploadSession findMany
   */
  export type UploadSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSession
     */
    select?: UploadSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionInclude<ExtArgs> | null
    /**
     * Filter, which UploadSessions to fetch.
     */
    where?: UploadSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UploadSessions to fetch.
     */
    orderBy?: UploadSessionOrderByWithRelationInput | UploadSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UploadSessions.
     */
    cursor?: UploadSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UploadSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UploadSessions.
     */
    skip?: number
    distinct?: UploadSessionScalarFieldEnum | UploadSessionScalarFieldEnum[]
  }

  /**
   * UploadSession create
   */
  export type UploadSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSession
     */
    select?: UploadSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a UploadSession.
     */
    data: XOR<UploadSessionCreateInput, UploadSessionUncheckedCreateInput>
  }

  /**
   * UploadSession createMany
   */
  export type UploadSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UploadSessions.
     */
    data: UploadSessionCreateManyInput | UploadSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UploadSession createManyAndReturn
   */
  export type UploadSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSession
     */
    select?: UploadSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UploadSessions.
     */
    data: UploadSessionCreateManyInput | UploadSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UploadSession update
   */
  export type UploadSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSession
     */
    select?: UploadSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a UploadSession.
     */
    data: XOR<UploadSessionUpdateInput, UploadSessionUncheckedUpdateInput>
    /**
     * Choose, which UploadSession to update.
     */
    where: UploadSessionWhereUniqueInput
  }

  /**
   * UploadSession updateMany
   */
  export type UploadSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UploadSessions.
     */
    data: XOR<UploadSessionUpdateManyMutationInput, UploadSessionUncheckedUpdateManyInput>
    /**
     * Filter which UploadSessions to update
     */
    where?: UploadSessionWhereInput
  }

  /**
   * UploadSession upsert
   */
  export type UploadSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSession
     */
    select?: UploadSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the UploadSession to update in case it exists.
     */
    where: UploadSessionWhereUniqueInput
    /**
     * In case the UploadSession found by the `where` argument doesn't exist, create a new UploadSession with this data.
     */
    create: XOR<UploadSessionCreateInput, UploadSessionUncheckedCreateInput>
    /**
     * In case the UploadSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UploadSessionUpdateInput, UploadSessionUncheckedUpdateInput>
  }

  /**
   * UploadSession delete
   */
  export type UploadSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSession
     */
    select?: UploadSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionInclude<ExtArgs> | null
    /**
     * Filter which UploadSession to delete.
     */
    where: UploadSessionWhereUniqueInput
  }

  /**
   * UploadSession deleteMany
   */
  export type UploadSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UploadSessions to delete
     */
    where?: UploadSessionWhereInput
  }

  /**
   * UploadSession.files
   */
  export type UploadSession$filesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSessionFile
     */
    select?: UploadSessionFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionFileInclude<ExtArgs> | null
    where?: UploadSessionFileWhereInput
    orderBy?: UploadSessionFileOrderByWithRelationInput | UploadSessionFileOrderByWithRelationInput[]
    cursor?: UploadSessionFileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UploadSessionFileScalarFieldEnum | UploadSessionFileScalarFieldEnum[]
  }

  /**
   * UploadSession without action
   */
  export type UploadSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSession
     */
    select?: UploadSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionInclude<ExtArgs> | null
  }


  /**
   * Model UploadSessionFile
   */

  export type AggregateUploadSessionFile = {
    _count: UploadSessionFileCountAggregateOutputType | null
    _avg: UploadSessionFileAvgAggregateOutputType | null
    _sum: UploadSessionFileSumAggregateOutputType | null
    _min: UploadSessionFileMinAggregateOutputType | null
    _max: UploadSessionFileMaxAggregateOutputType | null
  }

  export type UploadSessionFileAvgAggregateOutputType = {
    processingOrder: number | null
  }

  export type UploadSessionFileSumAggregateOutputType = {
    processingOrder: number | null
  }

  export type UploadSessionFileMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    fileId: string | null
    originalName: string | null
    status: $Enums.FileStatus | null
    errorMessage: string | null
    processingOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UploadSessionFileMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    fileId: string | null
    originalName: string | null
    status: $Enums.FileStatus | null
    errorMessage: string | null
    processingOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UploadSessionFileCountAggregateOutputType = {
    id: number
    sessionId: number
    fileId: number
    originalName: number
    status: number
    errorMessage: number
    processingOrder: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UploadSessionFileAvgAggregateInputType = {
    processingOrder?: true
  }

  export type UploadSessionFileSumAggregateInputType = {
    processingOrder?: true
  }

  export type UploadSessionFileMinAggregateInputType = {
    id?: true
    sessionId?: true
    fileId?: true
    originalName?: true
    status?: true
    errorMessage?: true
    processingOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UploadSessionFileMaxAggregateInputType = {
    id?: true
    sessionId?: true
    fileId?: true
    originalName?: true
    status?: true
    errorMessage?: true
    processingOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UploadSessionFileCountAggregateInputType = {
    id?: true
    sessionId?: true
    fileId?: true
    originalName?: true
    status?: true
    errorMessage?: true
    processingOrder?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UploadSessionFileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UploadSessionFile to aggregate.
     */
    where?: UploadSessionFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UploadSessionFiles to fetch.
     */
    orderBy?: UploadSessionFileOrderByWithRelationInput | UploadSessionFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UploadSessionFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UploadSessionFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UploadSessionFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UploadSessionFiles
    **/
    _count?: true | UploadSessionFileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UploadSessionFileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UploadSessionFileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UploadSessionFileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UploadSessionFileMaxAggregateInputType
  }

  export type GetUploadSessionFileAggregateType<T extends UploadSessionFileAggregateArgs> = {
        [P in keyof T & keyof AggregateUploadSessionFile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUploadSessionFile[P]>
      : GetScalarType<T[P], AggregateUploadSessionFile[P]>
  }




  export type UploadSessionFileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UploadSessionFileWhereInput
    orderBy?: UploadSessionFileOrderByWithAggregationInput | UploadSessionFileOrderByWithAggregationInput[]
    by: UploadSessionFileScalarFieldEnum[] | UploadSessionFileScalarFieldEnum
    having?: UploadSessionFileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UploadSessionFileCountAggregateInputType | true
    _avg?: UploadSessionFileAvgAggregateInputType
    _sum?: UploadSessionFileSumAggregateInputType
    _min?: UploadSessionFileMinAggregateInputType
    _max?: UploadSessionFileMaxAggregateInputType
  }

  export type UploadSessionFileGroupByOutputType = {
    id: string
    sessionId: string
    fileId: string | null
    originalName: string
    status: $Enums.FileStatus
    errorMessage: string | null
    processingOrder: number
    createdAt: Date
    updatedAt: Date
    _count: UploadSessionFileCountAggregateOutputType | null
    _avg: UploadSessionFileAvgAggregateOutputType | null
    _sum: UploadSessionFileSumAggregateOutputType | null
    _min: UploadSessionFileMinAggregateOutputType | null
    _max: UploadSessionFileMaxAggregateOutputType | null
  }

  type GetUploadSessionFileGroupByPayload<T extends UploadSessionFileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UploadSessionFileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UploadSessionFileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UploadSessionFileGroupByOutputType[P]>
            : GetScalarType<T[P], UploadSessionFileGroupByOutputType[P]>
        }
      >
    >


  export type UploadSessionFileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    fileId?: boolean
    originalName?: boolean
    status?: boolean
    errorMessage?: boolean
    processingOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    session?: boolean | UploadSessionDefaultArgs<ExtArgs>
    file?: boolean | UploadSessionFile$fileArgs<ExtArgs>
  }, ExtArgs["result"]["uploadSessionFile"]>

  export type UploadSessionFileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    fileId?: boolean
    originalName?: boolean
    status?: boolean
    errorMessage?: boolean
    processingOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    session?: boolean | UploadSessionDefaultArgs<ExtArgs>
    file?: boolean | UploadSessionFile$fileArgs<ExtArgs>
  }, ExtArgs["result"]["uploadSessionFile"]>

  export type UploadSessionFileSelectScalar = {
    id?: boolean
    sessionId?: boolean
    fileId?: boolean
    originalName?: boolean
    status?: boolean
    errorMessage?: boolean
    processingOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UploadSessionFileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | UploadSessionDefaultArgs<ExtArgs>
    file?: boolean | UploadSessionFile$fileArgs<ExtArgs>
  }
  export type UploadSessionFileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | UploadSessionDefaultArgs<ExtArgs>
    file?: boolean | UploadSessionFile$fileArgs<ExtArgs>
  }

  export type $UploadSessionFilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UploadSessionFile"
    objects: {
      session: Prisma.$UploadSessionPayload<ExtArgs>
      file: Prisma.$FileMetadataPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      fileId: string | null
      originalName: string
      status: $Enums.FileStatus
      errorMessage: string | null
      processingOrder: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["uploadSessionFile"]>
    composites: {}
  }

  type UploadSessionFileGetPayload<S extends boolean | null | undefined | UploadSessionFileDefaultArgs> = $Result.GetResult<Prisma.$UploadSessionFilePayload, S>

  type UploadSessionFileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UploadSessionFileFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UploadSessionFileCountAggregateInputType | true
    }

  export interface UploadSessionFileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UploadSessionFile'], meta: { name: 'UploadSessionFile' } }
    /**
     * Find zero or one UploadSessionFile that matches the filter.
     * @param {UploadSessionFileFindUniqueArgs} args - Arguments to find a UploadSessionFile
     * @example
     * // Get one UploadSessionFile
     * const uploadSessionFile = await prisma.uploadSessionFile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UploadSessionFileFindUniqueArgs>(args: SelectSubset<T, UploadSessionFileFindUniqueArgs<ExtArgs>>): Prisma__UploadSessionFileClient<$Result.GetResult<Prisma.$UploadSessionFilePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UploadSessionFile that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UploadSessionFileFindUniqueOrThrowArgs} args - Arguments to find a UploadSessionFile
     * @example
     * // Get one UploadSessionFile
     * const uploadSessionFile = await prisma.uploadSessionFile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UploadSessionFileFindUniqueOrThrowArgs>(args: SelectSubset<T, UploadSessionFileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UploadSessionFileClient<$Result.GetResult<Prisma.$UploadSessionFilePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UploadSessionFile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadSessionFileFindFirstArgs} args - Arguments to find a UploadSessionFile
     * @example
     * // Get one UploadSessionFile
     * const uploadSessionFile = await prisma.uploadSessionFile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UploadSessionFileFindFirstArgs>(args?: SelectSubset<T, UploadSessionFileFindFirstArgs<ExtArgs>>): Prisma__UploadSessionFileClient<$Result.GetResult<Prisma.$UploadSessionFilePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UploadSessionFile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadSessionFileFindFirstOrThrowArgs} args - Arguments to find a UploadSessionFile
     * @example
     * // Get one UploadSessionFile
     * const uploadSessionFile = await prisma.uploadSessionFile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UploadSessionFileFindFirstOrThrowArgs>(args?: SelectSubset<T, UploadSessionFileFindFirstOrThrowArgs<ExtArgs>>): Prisma__UploadSessionFileClient<$Result.GetResult<Prisma.$UploadSessionFilePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UploadSessionFiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadSessionFileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UploadSessionFiles
     * const uploadSessionFiles = await prisma.uploadSessionFile.findMany()
     * 
     * // Get first 10 UploadSessionFiles
     * const uploadSessionFiles = await prisma.uploadSessionFile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const uploadSessionFileWithIdOnly = await prisma.uploadSessionFile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UploadSessionFileFindManyArgs>(args?: SelectSubset<T, UploadSessionFileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UploadSessionFilePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UploadSessionFile.
     * @param {UploadSessionFileCreateArgs} args - Arguments to create a UploadSessionFile.
     * @example
     * // Create one UploadSessionFile
     * const UploadSessionFile = await prisma.uploadSessionFile.create({
     *   data: {
     *     // ... data to create a UploadSessionFile
     *   }
     * })
     * 
     */
    create<T extends UploadSessionFileCreateArgs>(args: SelectSubset<T, UploadSessionFileCreateArgs<ExtArgs>>): Prisma__UploadSessionFileClient<$Result.GetResult<Prisma.$UploadSessionFilePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UploadSessionFiles.
     * @param {UploadSessionFileCreateManyArgs} args - Arguments to create many UploadSessionFiles.
     * @example
     * // Create many UploadSessionFiles
     * const uploadSessionFile = await prisma.uploadSessionFile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UploadSessionFileCreateManyArgs>(args?: SelectSubset<T, UploadSessionFileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UploadSessionFiles and returns the data saved in the database.
     * @param {UploadSessionFileCreateManyAndReturnArgs} args - Arguments to create many UploadSessionFiles.
     * @example
     * // Create many UploadSessionFiles
     * const uploadSessionFile = await prisma.uploadSessionFile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UploadSessionFiles and only return the `id`
     * const uploadSessionFileWithIdOnly = await prisma.uploadSessionFile.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UploadSessionFileCreateManyAndReturnArgs>(args?: SelectSubset<T, UploadSessionFileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UploadSessionFilePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UploadSessionFile.
     * @param {UploadSessionFileDeleteArgs} args - Arguments to delete one UploadSessionFile.
     * @example
     * // Delete one UploadSessionFile
     * const UploadSessionFile = await prisma.uploadSessionFile.delete({
     *   where: {
     *     // ... filter to delete one UploadSessionFile
     *   }
     * })
     * 
     */
    delete<T extends UploadSessionFileDeleteArgs>(args: SelectSubset<T, UploadSessionFileDeleteArgs<ExtArgs>>): Prisma__UploadSessionFileClient<$Result.GetResult<Prisma.$UploadSessionFilePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UploadSessionFile.
     * @param {UploadSessionFileUpdateArgs} args - Arguments to update one UploadSessionFile.
     * @example
     * // Update one UploadSessionFile
     * const uploadSessionFile = await prisma.uploadSessionFile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UploadSessionFileUpdateArgs>(args: SelectSubset<T, UploadSessionFileUpdateArgs<ExtArgs>>): Prisma__UploadSessionFileClient<$Result.GetResult<Prisma.$UploadSessionFilePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UploadSessionFiles.
     * @param {UploadSessionFileDeleteManyArgs} args - Arguments to filter UploadSessionFiles to delete.
     * @example
     * // Delete a few UploadSessionFiles
     * const { count } = await prisma.uploadSessionFile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UploadSessionFileDeleteManyArgs>(args?: SelectSubset<T, UploadSessionFileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UploadSessionFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadSessionFileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UploadSessionFiles
     * const uploadSessionFile = await prisma.uploadSessionFile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UploadSessionFileUpdateManyArgs>(args: SelectSubset<T, UploadSessionFileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UploadSessionFile.
     * @param {UploadSessionFileUpsertArgs} args - Arguments to update or create a UploadSessionFile.
     * @example
     * // Update or create a UploadSessionFile
     * const uploadSessionFile = await prisma.uploadSessionFile.upsert({
     *   create: {
     *     // ... data to create a UploadSessionFile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UploadSessionFile we want to update
     *   }
     * })
     */
    upsert<T extends UploadSessionFileUpsertArgs>(args: SelectSubset<T, UploadSessionFileUpsertArgs<ExtArgs>>): Prisma__UploadSessionFileClient<$Result.GetResult<Prisma.$UploadSessionFilePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UploadSessionFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadSessionFileCountArgs} args - Arguments to filter UploadSessionFiles to count.
     * @example
     * // Count the number of UploadSessionFiles
     * const count = await prisma.uploadSessionFile.count({
     *   where: {
     *     // ... the filter for the UploadSessionFiles we want to count
     *   }
     * })
    **/
    count<T extends UploadSessionFileCountArgs>(
      args?: Subset<T, UploadSessionFileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UploadSessionFileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UploadSessionFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadSessionFileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UploadSessionFileAggregateArgs>(args: Subset<T, UploadSessionFileAggregateArgs>): Prisma.PrismaPromise<GetUploadSessionFileAggregateType<T>>

    /**
     * Group by UploadSessionFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UploadSessionFileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UploadSessionFileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UploadSessionFileGroupByArgs['orderBy'] }
        : { orderBy?: UploadSessionFileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UploadSessionFileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUploadSessionFileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UploadSessionFile model
   */
  readonly fields: UploadSessionFileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UploadSessionFile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UploadSessionFileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends UploadSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UploadSessionDefaultArgs<ExtArgs>>): Prisma__UploadSessionClient<$Result.GetResult<Prisma.$UploadSessionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    file<T extends UploadSessionFile$fileArgs<ExtArgs> = {}>(args?: Subset<T, UploadSessionFile$fileArgs<ExtArgs>>): Prisma__FileMetadataClient<$Result.GetResult<Prisma.$FileMetadataPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UploadSessionFile model
   */ 
  interface UploadSessionFileFieldRefs {
    readonly id: FieldRef<"UploadSessionFile", 'String'>
    readonly sessionId: FieldRef<"UploadSessionFile", 'String'>
    readonly fileId: FieldRef<"UploadSessionFile", 'String'>
    readonly originalName: FieldRef<"UploadSessionFile", 'String'>
    readonly status: FieldRef<"UploadSessionFile", 'FileStatus'>
    readonly errorMessage: FieldRef<"UploadSessionFile", 'String'>
    readonly processingOrder: FieldRef<"UploadSessionFile", 'Int'>
    readonly createdAt: FieldRef<"UploadSessionFile", 'DateTime'>
    readonly updatedAt: FieldRef<"UploadSessionFile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UploadSessionFile findUnique
   */
  export type UploadSessionFileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSessionFile
     */
    select?: UploadSessionFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionFileInclude<ExtArgs> | null
    /**
     * Filter, which UploadSessionFile to fetch.
     */
    where: UploadSessionFileWhereUniqueInput
  }

  /**
   * UploadSessionFile findUniqueOrThrow
   */
  export type UploadSessionFileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSessionFile
     */
    select?: UploadSessionFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionFileInclude<ExtArgs> | null
    /**
     * Filter, which UploadSessionFile to fetch.
     */
    where: UploadSessionFileWhereUniqueInput
  }

  /**
   * UploadSessionFile findFirst
   */
  export type UploadSessionFileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSessionFile
     */
    select?: UploadSessionFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionFileInclude<ExtArgs> | null
    /**
     * Filter, which UploadSessionFile to fetch.
     */
    where?: UploadSessionFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UploadSessionFiles to fetch.
     */
    orderBy?: UploadSessionFileOrderByWithRelationInput | UploadSessionFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UploadSessionFiles.
     */
    cursor?: UploadSessionFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UploadSessionFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UploadSessionFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UploadSessionFiles.
     */
    distinct?: UploadSessionFileScalarFieldEnum | UploadSessionFileScalarFieldEnum[]
  }

  /**
   * UploadSessionFile findFirstOrThrow
   */
  export type UploadSessionFileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSessionFile
     */
    select?: UploadSessionFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionFileInclude<ExtArgs> | null
    /**
     * Filter, which UploadSessionFile to fetch.
     */
    where?: UploadSessionFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UploadSessionFiles to fetch.
     */
    orderBy?: UploadSessionFileOrderByWithRelationInput | UploadSessionFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UploadSessionFiles.
     */
    cursor?: UploadSessionFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UploadSessionFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UploadSessionFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UploadSessionFiles.
     */
    distinct?: UploadSessionFileScalarFieldEnum | UploadSessionFileScalarFieldEnum[]
  }

  /**
   * UploadSessionFile findMany
   */
  export type UploadSessionFileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSessionFile
     */
    select?: UploadSessionFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionFileInclude<ExtArgs> | null
    /**
     * Filter, which UploadSessionFiles to fetch.
     */
    where?: UploadSessionFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UploadSessionFiles to fetch.
     */
    orderBy?: UploadSessionFileOrderByWithRelationInput | UploadSessionFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UploadSessionFiles.
     */
    cursor?: UploadSessionFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UploadSessionFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UploadSessionFiles.
     */
    skip?: number
    distinct?: UploadSessionFileScalarFieldEnum | UploadSessionFileScalarFieldEnum[]
  }

  /**
   * UploadSessionFile create
   */
  export type UploadSessionFileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSessionFile
     */
    select?: UploadSessionFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionFileInclude<ExtArgs> | null
    /**
     * The data needed to create a UploadSessionFile.
     */
    data: XOR<UploadSessionFileCreateInput, UploadSessionFileUncheckedCreateInput>
  }

  /**
   * UploadSessionFile createMany
   */
  export type UploadSessionFileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UploadSessionFiles.
     */
    data: UploadSessionFileCreateManyInput | UploadSessionFileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UploadSessionFile createManyAndReturn
   */
  export type UploadSessionFileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSessionFile
     */
    select?: UploadSessionFileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UploadSessionFiles.
     */
    data: UploadSessionFileCreateManyInput | UploadSessionFileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionFileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UploadSessionFile update
   */
  export type UploadSessionFileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSessionFile
     */
    select?: UploadSessionFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionFileInclude<ExtArgs> | null
    /**
     * The data needed to update a UploadSessionFile.
     */
    data: XOR<UploadSessionFileUpdateInput, UploadSessionFileUncheckedUpdateInput>
    /**
     * Choose, which UploadSessionFile to update.
     */
    where: UploadSessionFileWhereUniqueInput
  }

  /**
   * UploadSessionFile updateMany
   */
  export type UploadSessionFileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UploadSessionFiles.
     */
    data: XOR<UploadSessionFileUpdateManyMutationInput, UploadSessionFileUncheckedUpdateManyInput>
    /**
     * Filter which UploadSessionFiles to update
     */
    where?: UploadSessionFileWhereInput
  }

  /**
   * UploadSessionFile upsert
   */
  export type UploadSessionFileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSessionFile
     */
    select?: UploadSessionFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionFileInclude<ExtArgs> | null
    /**
     * The filter to search for the UploadSessionFile to update in case it exists.
     */
    where: UploadSessionFileWhereUniqueInput
    /**
     * In case the UploadSessionFile found by the `where` argument doesn't exist, create a new UploadSessionFile with this data.
     */
    create: XOR<UploadSessionFileCreateInput, UploadSessionFileUncheckedCreateInput>
    /**
     * In case the UploadSessionFile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UploadSessionFileUpdateInput, UploadSessionFileUncheckedUpdateInput>
  }

  /**
   * UploadSessionFile delete
   */
  export type UploadSessionFileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSessionFile
     */
    select?: UploadSessionFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionFileInclude<ExtArgs> | null
    /**
     * Filter which UploadSessionFile to delete.
     */
    where: UploadSessionFileWhereUniqueInput
  }

  /**
   * UploadSessionFile deleteMany
   */
  export type UploadSessionFileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UploadSessionFiles to delete
     */
    where?: UploadSessionFileWhereInput
  }

  /**
   * UploadSessionFile.file
   */
  export type UploadSessionFile$fileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileMetadata
     */
    select?: FileMetadataSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileMetadataInclude<ExtArgs> | null
    where?: FileMetadataWhereInput
  }

  /**
   * UploadSessionFile without action
   */
  export type UploadSessionFileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UploadSessionFile
     */
    select?: UploadSessionFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UploadSessionFileInclude<ExtArgs> | null
  }


  /**
   * Model ProcessingJob
   */

  export type AggregateProcessingJob = {
    _count: ProcessingJobCountAggregateOutputType | null
    _avg: ProcessingJobAvgAggregateOutputType | null
    _sum: ProcessingJobSumAggregateOutputType | null
    _min: ProcessingJobMinAggregateOutputType | null
    _max: ProcessingJobMaxAggregateOutputType | null
  }

  export type ProcessingJobAvgAggregateOutputType = {
    priority: number | null
    attempts: number | null
    maxAttempts: number | null
  }

  export type ProcessingJobSumAggregateOutputType = {
    priority: number | null
    attempts: number | null
    maxAttempts: number | null
  }

  export type ProcessingJobMinAggregateOutputType = {
    id: string | null
    fileId: string | null
    jobType: $Enums.ProcessingJobType | null
    status: $Enums.JobStatus | null
    priority: number | null
    attempts: number | null
    maxAttempts: number | null
    errorMessage: string | null
    scheduledAt: Date | null
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProcessingJobMaxAggregateOutputType = {
    id: string | null
    fileId: string | null
    jobType: $Enums.ProcessingJobType | null
    status: $Enums.JobStatus | null
    priority: number | null
    attempts: number | null
    maxAttempts: number | null
    errorMessage: string | null
    scheduledAt: Date | null
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProcessingJobCountAggregateOutputType = {
    id: number
    fileId: number
    jobType: number
    status: number
    priority: number
    attempts: number
    maxAttempts: number
    payload: number
    result: number
    errorMessage: number
    scheduledAt: number
    startedAt: number
    completedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProcessingJobAvgAggregateInputType = {
    priority?: true
    attempts?: true
    maxAttempts?: true
  }

  export type ProcessingJobSumAggregateInputType = {
    priority?: true
    attempts?: true
    maxAttempts?: true
  }

  export type ProcessingJobMinAggregateInputType = {
    id?: true
    fileId?: true
    jobType?: true
    status?: true
    priority?: true
    attempts?: true
    maxAttempts?: true
    errorMessage?: true
    scheduledAt?: true
    startedAt?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProcessingJobMaxAggregateInputType = {
    id?: true
    fileId?: true
    jobType?: true
    status?: true
    priority?: true
    attempts?: true
    maxAttempts?: true
    errorMessage?: true
    scheduledAt?: true
    startedAt?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProcessingJobCountAggregateInputType = {
    id?: true
    fileId?: true
    jobType?: true
    status?: true
    priority?: true
    attempts?: true
    maxAttempts?: true
    payload?: true
    result?: true
    errorMessage?: true
    scheduledAt?: true
    startedAt?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProcessingJobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProcessingJob to aggregate.
     */
    where?: ProcessingJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcessingJobs to fetch.
     */
    orderBy?: ProcessingJobOrderByWithRelationInput | ProcessingJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProcessingJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcessingJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcessingJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProcessingJobs
    **/
    _count?: true | ProcessingJobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProcessingJobAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProcessingJobSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProcessingJobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProcessingJobMaxAggregateInputType
  }

  export type GetProcessingJobAggregateType<T extends ProcessingJobAggregateArgs> = {
        [P in keyof T & keyof AggregateProcessingJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProcessingJob[P]>
      : GetScalarType<T[P], AggregateProcessingJob[P]>
  }




  export type ProcessingJobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProcessingJobWhereInput
    orderBy?: ProcessingJobOrderByWithAggregationInput | ProcessingJobOrderByWithAggregationInput[]
    by: ProcessingJobScalarFieldEnum[] | ProcessingJobScalarFieldEnum
    having?: ProcessingJobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProcessingJobCountAggregateInputType | true
    _avg?: ProcessingJobAvgAggregateInputType
    _sum?: ProcessingJobSumAggregateInputType
    _min?: ProcessingJobMinAggregateInputType
    _max?: ProcessingJobMaxAggregateInputType
  }

  export type ProcessingJobGroupByOutputType = {
    id: string
    fileId: string
    jobType: $Enums.ProcessingJobType
    status: $Enums.JobStatus
    priority: number
    attempts: number
    maxAttempts: number
    payload: JsonValue
    result: JsonValue | null
    errorMessage: string | null
    scheduledAt: Date
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: ProcessingJobCountAggregateOutputType | null
    _avg: ProcessingJobAvgAggregateOutputType | null
    _sum: ProcessingJobSumAggregateOutputType | null
    _min: ProcessingJobMinAggregateOutputType | null
    _max: ProcessingJobMaxAggregateOutputType | null
  }

  type GetProcessingJobGroupByPayload<T extends ProcessingJobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProcessingJobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProcessingJobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProcessingJobGroupByOutputType[P]>
            : GetScalarType<T[P], ProcessingJobGroupByOutputType[P]>
        }
      >
    >


  export type ProcessingJobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileId?: boolean
    jobType?: boolean
    status?: boolean
    priority?: boolean
    attempts?: boolean
    maxAttempts?: boolean
    payload?: boolean
    result?: boolean
    errorMessage?: boolean
    scheduledAt?: boolean
    startedAt?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["processingJob"]>

  export type ProcessingJobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileId?: boolean
    jobType?: boolean
    status?: boolean
    priority?: boolean
    attempts?: boolean
    maxAttempts?: boolean
    payload?: boolean
    result?: boolean
    errorMessage?: boolean
    scheduledAt?: boolean
    startedAt?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["processingJob"]>

  export type ProcessingJobSelectScalar = {
    id?: boolean
    fileId?: boolean
    jobType?: boolean
    status?: boolean
    priority?: boolean
    attempts?: boolean
    maxAttempts?: boolean
    payload?: boolean
    result?: boolean
    errorMessage?: boolean
    scheduledAt?: boolean
    startedAt?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $ProcessingJobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProcessingJob"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fileId: string
      jobType: $Enums.ProcessingJobType
      status: $Enums.JobStatus
      priority: number
      attempts: number
      maxAttempts: number
      payload: Prisma.JsonValue
      result: Prisma.JsonValue | null
      errorMessage: string | null
      scheduledAt: Date
      startedAt: Date | null
      completedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["processingJob"]>
    composites: {}
  }

  type ProcessingJobGetPayload<S extends boolean | null | undefined | ProcessingJobDefaultArgs> = $Result.GetResult<Prisma.$ProcessingJobPayload, S>

  type ProcessingJobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProcessingJobFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProcessingJobCountAggregateInputType | true
    }

  export interface ProcessingJobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProcessingJob'], meta: { name: 'ProcessingJob' } }
    /**
     * Find zero or one ProcessingJob that matches the filter.
     * @param {ProcessingJobFindUniqueArgs} args - Arguments to find a ProcessingJob
     * @example
     * // Get one ProcessingJob
     * const processingJob = await prisma.processingJob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProcessingJobFindUniqueArgs>(args: SelectSubset<T, ProcessingJobFindUniqueArgs<ExtArgs>>): Prisma__ProcessingJobClient<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProcessingJob that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProcessingJobFindUniqueOrThrowArgs} args - Arguments to find a ProcessingJob
     * @example
     * // Get one ProcessingJob
     * const processingJob = await prisma.processingJob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProcessingJobFindUniqueOrThrowArgs>(args: SelectSubset<T, ProcessingJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProcessingJobClient<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProcessingJob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessingJobFindFirstArgs} args - Arguments to find a ProcessingJob
     * @example
     * // Get one ProcessingJob
     * const processingJob = await prisma.processingJob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProcessingJobFindFirstArgs>(args?: SelectSubset<T, ProcessingJobFindFirstArgs<ExtArgs>>): Prisma__ProcessingJobClient<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProcessingJob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessingJobFindFirstOrThrowArgs} args - Arguments to find a ProcessingJob
     * @example
     * // Get one ProcessingJob
     * const processingJob = await prisma.processingJob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProcessingJobFindFirstOrThrowArgs>(args?: SelectSubset<T, ProcessingJobFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProcessingJobClient<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProcessingJobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessingJobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProcessingJobs
     * const processingJobs = await prisma.processingJob.findMany()
     * 
     * // Get first 10 ProcessingJobs
     * const processingJobs = await prisma.processingJob.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const processingJobWithIdOnly = await prisma.processingJob.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProcessingJobFindManyArgs>(args?: SelectSubset<T, ProcessingJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProcessingJob.
     * @param {ProcessingJobCreateArgs} args - Arguments to create a ProcessingJob.
     * @example
     * // Create one ProcessingJob
     * const ProcessingJob = await prisma.processingJob.create({
     *   data: {
     *     // ... data to create a ProcessingJob
     *   }
     * })
     * 
     */
    create<T extends ProcessingJobCreateArgs>(args: SelectSubset<T, ProcessingJobCreateArgs<ExtArgs>>): Prisma__ProcessingJobClient<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProcessingJobs.
     * @param {ProcessingJobCreateManyArgs} args - Arguments to create many ProcessingJobs.
     * @example
     * // Create many ProcessingJobs
     * const processingJob = await prisma.processingJob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProcessingJobCreateManyArgs>(args?: SelectSubset<T, ProcessingJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProcessingJobs and returns the data saved in the database.
     * @param {ProcessingJobCreateManyAndReturnArgs} args - Arguments to create many ProcessingJobs.
     * @example
     * // Create many ProcessingJobs
     * const processingJob = await prisma.processingJob.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProcessingJobs and only return the `id`
     * const processingJobWithIdOnly = await prisma.processingJob.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProcessingJobCreateManyAndReturnArgs>(args?: SelectSubset<T, ProcessingJobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ProcessingJob.
     * @param {ProcessingJobDeleteArgs} args - Arguments to delete one ProcessingJob.
     * @example
     * // Delete one ProcessingJob
     * const ProcessingJob = await prisma.processingJob.delete({
     *   where: {
     *     // ... filter to delete one ProcessingJob
     *   }
     * })
     * 
     */
    delete<T extends ProcessingJobDeleteArgs>(args: SelectSubset<T, ProcessingJobDeleteArgs<ExtArgs>>): Prisma__ProcessingJobClient<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProcessingJob.
     * @param {ProcessingJobUpdateArgs} args - Arguments to update one ProcessingJob.
     * @example
     * // Update one ProcessingJob
     * const processingJob = await prisma.processingJob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProcessingJobUpdateArgs>(args: SelectSubset<T, ProcessingJobUpdateArgs<ExtArgs>>): Prisma__ProcessingJobClient<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProcessingJobs.
     * @param {ProcessingJobDeleteManyArgs} args - Arguments to filter ProcessingJobs to delete.
     * @example
     * // Delete a few ProcessingJobs
     * const { count } = await prisma.processingJob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProcessingJobDeleteManyArgs>(args?: SelectSubset<T, ProcessingJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProcessingJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessingJobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProcessingJobs
     * const processingJob = await prisma.processingJob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProcessingJobUpdateManyArgs>(args: SelectSubset<T, ProcessingJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProcessingJob.
     * @param {ProcessingJobUpsertArgs} args - Arguments to update or create a ProcessingJob.
     * @example
     * // Update or create a ProcessingJob
     * const processingJob = await prisma.processingJob.upsert({
     *   create: {
     *     // ... data to create a ProcessingJob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProcessingJob we want to update
     *   }
     * })
     */
    upsert<T extends ProcessingJobUpsertArgs>(args: SelectSubset<T, ProcessingJobUpsertArgs<ExtArgs>>): Prisma__ProcessingJobClient<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProcessingJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessingJobCountArgs} args - Arguments to filter ProcessingJobs to count.
     * @example
     * // Count the number of ProcessingJobs
     * const count = await prisma.processingJob.count({
     *   where: {
     *     // ... the filter for the ProcessingJobs we want to count
     *   }
     * })
    **/
    count<T extends ProcessingJobCountArgs>(
      args?: Subset<T, ProcessingJobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProcessingJobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProcessingJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessingJobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProcessingJobAggregateArgs>(args: Subset<T, ProcessingJobAggregateArgs>): Prisma.PrismaPromise<GetProcessingJobAggregateType<T>>

    /**
     * Group by ProcessingJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessingJobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProcessingJobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProcessingJobGroupByArgs['orderBy'] }
        : { orderBy?: ProcessingJobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProcessingJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProcessingJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProcessingJob model
   */
  readonly fields: ProcessingJobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProcessingJob.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProcessingJobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProcessingJob model
   */ 
  interface ProcessingJobFieldRefs {
    readonly id: FieldRef<"ProcessingJob", 'String'>
    readonly fileId: FieldRef<"ProcessingJob", 'String'>
    readonly jobType: FieldRef<"ProcessingJob", 'ProcessingJobType'>
    readonly status: FieldRef<"ProcessingJob", 'JobStatus'>
    readonly priority: FieldRef<"ProcessingJob", 'Int'>
    readonly attempts: FieldRef<"ProcessingJob", 'Int'>
    readonly maxAttempts: FieldRef<"ProcessingJob", 'Int'>
    readonly payload: FieldRef<"ProcessingJob", 'Json'>
    readonly result: FieldRef<"ProcessingJob", 'Json'>
    readonly errorMessage: FieldRef<"ProcessingJob", 'String'>
    readonly scheduledAt: FieldRef<"ProcessingJob", 'DateTime'>
    readonly startedAt: FieldRef<"ProcessingJob", 'DateTime'>
    readonly completedAt: FieldRef<"ProcessingJob", 'DateTime'>
    readonly createdAt: FieldRef<"ProcessingJob", 'DateTime'>
    readonly updatedAt: FieldRef<"ProcessingJob", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProcessingJob findUnique
   */
  export type ProcessingJobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelect<ExtArgs> | null
    /**
     * Filter, which ProcessingJob to fetch.
     */
    where: ProcessingJobWhereUniqueInput
  }

  /**
   * ProcessingJob findUniqueOrThrow
   */
  export type ProcessingJobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelect<ExtArgs> | null
    /**
     * Filter, which ProcessingJob to fetch.
     */
    where: ProcessingJobWhereUniqueInput
  }

  /**
   * ProcessingJob findFirst
   */
  export type ProcessingJobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelect<ExtArgs> | null
    /**
     * Filter, which ProcessingJob to fetch.
     */
    where?: ProcessingJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcessingJobs to fetch.
     */
    orderBy?: ProcessingJobOrderByWithRelationInput | ProcessingJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProcessingJobs.
     */
    cursor?: ProcessingJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcessingJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcessingJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProcessingJobs.
     */
    distinct?: ProcessingJobScalarFieldEnum | ProcessingJobScalarFieldEnum[]
  }

  /**
   * ProcessingJob findFirstOrThrow
   */
  export type ProcessingJobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelect<ExtArgs> | null
    /**
     * Filter, which ProcessingJob to fetch.
     */
    where?: ProcessingJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcessingJobs to fetch.
     */
    orderBy?: ProcessingJobOrderByWithRelationInput | ProcessingJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProcessingJobs.
     */
    cursor?: ProcessingJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcessingJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcessingJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProcessingJobs.
     */
    distinct?: ProcessingJobScalarFieldEnum | ProcessingJobScalarFieldEnum[]
  }

  /**
   * ProcessingJob findMany
   */
  export type ProcessingJobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelect<ExtArgs> | null
    /**
     * Filter, which ProcessingJobs to fetch.
     */
    where?: ProcessingJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcessingJobs to fetch.
     */
    orderBy?: ProcessingJobOrderByWithRelationInput | ProcessingJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProcessingJobs.
     */
    cursor?: ProcessingJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcessingJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcessingJobs.
     */
    skip?: number
    distinct?: ProcessingJobScalarFieldEnum | ProcessingJobScalarFieldEnum[]
  }

  /**
   * ProcessingJob create
   */
  export type ProcessingJobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelect<ExtArgs> | null
    /**
     * The data needed to create a ProcessingJob.
     */
    data: XOR<ProcessingJobCreateInput, ProcessingJobUncheckedCreateInput>
  }

  /**
   * ProcessingJob createMany
   */
  export type ProcessingJobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProcessingJobs.
     */
    data: ProcessingJobCreateManyInput | ProcessingJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProcessingJob createManyAndReturn
   */
  export type ProcessingJobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ProcessingJobs.
     */
    data: ProcessingJobCreateManyInput | ProcessingJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProcessingJob update
   */
  export type ProcessingJobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelect<ExtArgs> | null
    /**
     * The data needed to update a ProcessingJob.
     */
    data: XOR<ProcessingJobUpdateInput, ProcessingJobUncheckedUpdateInput>
    /**
     * Choose, which ProcessingJob to update.
     */
    where: ProcessingJobWhereUniqueInput
  }

  /**
   * ProcessingJob updateMany
   */
  export type ProcessingJobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProcessingJobs.
     */
    data: XOR<ProcessingJobUpdateManyMutationInput, ProcessingJobUncheckedUpdateManyInput>
    /**
     * Filter which ProcessingJobs to update
     */
    where?: ProcessingJobWhereInput
  }

  /**
   * ProcessingJob upsert
   */
  export type ProcessingJobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelect<ExtArgs> | null
    /**
     * The filter to search for the ProcessingJob to update in case it exists.
     */
    where: ProcessingJobWhereUniqueInput
    /**
     * In case the ProcessingJob found by the `where` argument doesn't exist, create a new ProcessingJob with this data.
     */
    create: XOR<ProcessingJobCreateInput, ProcessingJobUncheckedCreateInput>
    /**
     * In case the ProcessingJob was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProcessingJobUpdateInput, ProcessingJobUncheckedUpdateInput>
  }

  /**
   * ProcessingJob delete
   */
  export type ProcessingJobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelect<ExtArgs> | null
    /**
     * Filter which ProcessingJob to delete.
     */
    where: ProcessingJobWhereUniqueInput
  }

  /**
   * ProcessingJob deleteMany
   */
  export type ProcessingJobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProcessingJobs to delete
     */
    where?: ProcessingJobWhereInput
  }

  /**
   * ProcessingJob without action
   */
  export type ProcessingJobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelect<ExtArgs> | null
  }


  /**
   * Model AccessLog
   */

  export type AggregateAccessLog = {
    _count: AccessLogCountAggregateOutputType | null
    _min: AccessLogMinAggregateOutputType | null
    _max: AccessLogMaxAggregateOutputType | null
  }

  export type AccessLogMinAggregateOutputType = {
    id: string | null
    fileId: string | null
    operation: $Enums.AccessOperation | null
    userId: string | null
    serviceId: string | null
    ipAddress: string | null
    userAgent: string | null
    success: boolean | null
    errorCode: string | null
    createdAt: Date | null
  }

  export type AccessLogMaxAggregateOutputType = {
    id: string | null
    fileId: string | null
    operation: $Enums.AccessOperation | null
    userId: string | null
    serviceId: string | null
    ipAddress: string | null
    userAgent: string | null
    success: boolean | null
    errorCode: string | null
    createdAt: Date | null
  }

  export type AccessLogCountAggregateOutputType = {
    id: number
    fileId: number
    operation: number
    userId: number
    serviceId: number
    ipAddress: number
    userAgent: number
    success: number
    errorCode: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type AccessLogMinAggregateInputType = {
    id?: true
    fileId?: true
    operation?: true
    userId?: true
    serviceId?: true
    ipAddress?: true
    userAgent?: true
    success?: true
    errorCode?: true
    createdAt?: true
  }

  export type AccessLogMaxAggregateInputType = {
    id?: true
    fileId?: true
    operation?: true
    userId?: true
    serviceId?: true
    ipAddress?: true
    userAgent?: true
    success?: true
    errorCode?: true
    createdAt?: true
  }

  export type AccessLogCountAggregateInputType = {
    id?: true
    fileId?: true
    operation?: true
    userId?: true
    serviceId?: true
    ipAddress?: true
    userAgent?: true
    success?: true
    errorCode?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type AccessLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccessLog to aggregate.
     */
    where?: AccessLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccessLogs to fetch.
     */
    orderBy?: AccessLogOrderByWithRelationInput | AccessLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccessLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccessLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccessLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AccessLogs
    **/
    _count?: true | AccessLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccessLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccessLogMaxAggregateInputType
  }

  export type GetAccessLogAggregateType<T extends AccessLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAccessLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccessLog[P]>
      : GetScalarType<T[P], AggregateAccessLog[P]>
  }




  export type AccessLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccessLogWhereInput
    orderBy?: AccessLogOrderByWithAggregationInput | AccessLogOrderByWithAggregationInput[]
    by: AccessLogScalarFieldEnum[] | AccessLogScalarFieldEnum
    having?: AccessLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccessLogCountAggregateInputType | true
    _min?: AccessLogMinAggregateInputType
    _max?: AccessLogMaxAggregateInputType
  }

  export type AccessLogGroupByOutputType = {
    id: string
    fileId: string
    operation: $Enums.AccessOperation
    userId: string | null
    serviceId: string | null
    ipAddress: string | null
    userAgent: string | null
    success: boolean
    errorCode: string | null
    metadata: JsonValue | null
    createdAt: Date
    _count: AccessLogCountAggregateOutputType | null
    _min: AccessLogMinAggregateOutputType | null
    _max: AccessLogMaxAggregateOutputType | null
  }

  type GetAccessLogGroupByPayload<T extends AccessLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccessLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccessLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccessLogGroupByOutputType[P]>
            : GetScalarType<T[P], AccessLogGroupByOutputType[P]>
        }
      >
    >


  export type AccessLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileId?: boolean
    operation?: boolean
    userId?: boolean
    serviceId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    success?: boolean
    errorCode?: boolean
    metadata?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["accessLog"]>

  export type AccessLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileId?: boolean
    operation?: boolean
    userId?: boolean
    serviceId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    success?: boolean
    errorCode?: boolean
    metadata?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["accessLog"]>

  export type AccessLogSelectScalar = {
    id?: boolean
    fileId?: boolean
    operation?: boolean
    userId?: boolean
    serviceId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    success?: boolean
    errorCode?: boolean
    metadata?: boolean
    createdAt?: boolean
  }


  export type $AccessLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AccessLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fileId: string
      operation: $Enums.AccessOperation
      userId: string | null
      serviceId: string | null
      ipAddress: string | null
      userAgent: string | null
      success: boolean
      errorCode: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["accessLog"]>
    composites: {}
  }

  type AccessLogGetPayload<S extends boolean | null | undefined | AccessLogDefaultArgs> = $Result.GetResult<Prisma.$AccessLogPayload, S>

  type AccessLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AccessLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AccessLogCountAggregateInputType | true
    }

  export interface AccessLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AccessLog'], meta: { name: 'AccessLog' } }
    /**
     * Find zero or one AccessLog that matches the filter.
     * @param {AccessLogFindUniqueArgs} args - Arguments to find a AccessLog
     * @example
     * // Get one AccessLog
     * const accessLog = await prisma.accessLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccessLogFindUniqueArgs>(args: SelectSubset<T, AccessLogFindUniqueArgs<ExtArgs>>): Prisma__AccessLogClient<$Result.GetResult<Prisma.$AccessLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AccessLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AccessLogFindUniqueOrThrowArgs} args - Arguments to find a AccessLog
     * @example
     * // Get one AccessLog
     * const accessLog = await prisma.accessLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccessLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AccessLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccessLogClient<$Result.GetResult<Prisma.$AccessLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AccessLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessLogFindFirstArgs} args - Arguments to find a AccessLog
     * @example
     * // Get one AccessLog
     * const accessLog = await prisma.accessLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccessLogFindFirstArgs>(args?: SelectSubset<T, AccessLogFindFirstArgs<ExtArgs>>): Prisma__AccessLogClient<$Result.GetResult<Prisma.$AccessLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AccessLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessLogFindFirstOrThrowArgs} args - Arguments to find a AccessLog
     * @example
     * // Get one AccessLog
     * const accessLog = await prisma.accessLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccessLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AccessLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccessLogClient<$Result.GetResult<Prisma.$AccessLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AccessLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AccessLogs
     * const accessLogs = await prisma.accessLog.findMany()
     * 
     * // Get first 10 AccessLogs
     * const accessLogs = await prisma.accessLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accessLogWithIdOnly = await prisma.accessLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccessLogFindManyArgs>(args?: SelectSubset<T, AccessLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccessLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AccessLog.
     * @param {AccessLogCreateArgs} args - Arguments to create a AccessLog.
     * @example
     * // Create one AccessLog
     * const AccessLog = await prisma.accessLog.create({
     *   data: {
     *     // ... data to create a AccessLog
     *   }
     * })
     * 
     */
    create<T extends AccessLogCreateArgs>(args: SelectSubset<T, AccessLogCreateArgs<ExtArgs>>): Prisma__AccessLogClient<$Result.GetResult<Prisma.$AccessLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AccessLogs.
     * @param {AccessLogCreateManyArgs} args - Arguments to create many AccessLogs.
     * @example
     * // Create many AccessLogs
     * const accessLog = await prisma.accessLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccessLogCreateManyArgs>(args?: SelectSubset<T, AccessLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AccessLogs and returns the data saved in the database.
     * @param {AccessLogCreateManyAndReturnArgs} args - Arguments to create many AccessLogs.
     * @example
     * // Create many AccessLogs
     * const accessLog = await prisma.accessLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AccessLogs and only return the `id`
     * const accessLogWithIdOnly = await prisma.accessLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccessLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AccessLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccessLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AccessLog.
     * @param {AccessLogDeleteArgs} args - Arguments to delete one AccessLog.
     * @example
     * // Delete one AccessLog
     * const AccessLog = await prisma.accessLog.delete({
     *   where: {
     *     // ... filter to delete one AccessLog
     *   }
     * })
     * 
     */
    delete<T extends AccessLogDeleteArgs>(args: SelectSubset<T, AccessLogDeleteArgs<ExtArgs>>): Prisma__AccessLogClient<$Result.GetResult<Prisma.$AccessLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AccessLog.
     * @param {AccessLogUpdateArgs} args - Arguments to update one AccessLog.
     * @example
     * // Update one AccessLog
     * const accessLog = await prisma.accessLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccessLogUpdateArgs>(args: SelectSubset<T, AccessLogUpdateArgs<ExtArgs>>): Prisma__AccessLogClient<$Result.GetResult<Prisma.$AccessLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AccessLogs.
     * @param {AccessLogDeleteManyArgs} args - Arguments to filter AccessLogs to delete.
     * @example
     * // Delete a few AccessLogs
     * const { count } = await prisma.accessLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccessLogDeleteManyArgs>(args?: SelectSubset<T, AccessLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AccessLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AccessLogs
     * const accessLog = await prisma.accessLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccessLogUpdateManyArgs>(args: SelectSubset<T, AccessLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AccessLog.
     * @param {AccessLogUpsertArgs} args - Arguments to update or create a AccessLog.
     * @example
     * // Update or create a AccessLog
     * const accessLog = await prisma.accessLog.upsert({
     *   create: {
     *     // ... data to create a AccessLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AccessLog we want to update
     *   }
     * })
     */
    upsert<T extends AccessLogUpsertArgs>(args: SelectSubset<T, AccessLogUpsertArgs<ExtArgs>>): Prisma__AccessLogClient<$Result.GetResult<Prisma.$AccessLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AccessLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessLogCountArgs} args - Arguments to filter AccessLogs to count.
     * @example
     * // Count the number of AccessLogs
     * const count = await prisma.accessLog.count({
     *   where: {
     *     // ... the filter for the AccessLogs we want to count
     *   }
     * })
    **/
    count<T extends AccessLogCountArgs>(
      args?: Subset<T, AccessLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccessLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AccessLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccessLogAggregateArgs>(args: Subset<T, AccessLogAggregateArgs>): Prisma.PrismaPromise<GetAccessLogAggregateType<T>>

    /**
     * Group by AccessLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccessLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccessLogGroupByArgs['orderBy'] }
        : { orderBy?: AccessLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccessLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccessLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AccessLog model
   */
  readonly fields: AccessLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AccessLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccessLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AccessLog model
   */ 
  interface AccessLogFieldRefs {
    readonly id: FieldRef<"AccessLog", 'String'>
    readonly fileId: FieldRef<"AccessLog", 'String'>
    readonly operation: FieldRef<"AccessLog", 'AccessOperation'>
    readonly userId: FieldRef<"AccessLog", 'String'>
    readonly serviceId: FieldRef<"AccessLog", 'String'>
    readonly ipAddress: FieldRef<"AccessLog", 'String'>
    readonly userAgent: FieldRef<"AccessLog", 'String'>
    readonly success: FieldRef<"AccessLog", 'Boolean'>
    readonly errorCode: FieldRef<"AccessLog", 'String'>
    readonly metadata: FieldRef<"AccessLog", 'Json'>
    readonly createdAt: FieldRef<"AccessLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AccessLog findUnique
   */
  export type AccessLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessLog
     */
    select?: AccessLogSelect<ExtArgs> | null
    /**
     * Filter, which AccessLog to fetch.
     */
    where: AccessLogWhereUniqueInput
  }

  /**
   * AccessLog findUniqueOrThrow
   */
  export type AccessLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessLog
     */
    select?: AccessLogSelect<ExtArgs> | null
    /**
     * Filter, which AccessLog to fetch.
     */
    where: AccessLogWhereUniqueInput
  }

  /**
   * AccessLog findFirst
   */
  export type AccessLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessLog
     */
    select?: AccessLogSelect<ExtArgs> | null
    /**
     * Filter, which AccessLog to fetch.
     */
    where?: AccessLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccessLogs to fetch.
     */
    orderBy?: AccessLogOrderByWithRelationInput | AccessLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AccessLogs.
     */
    cursor?: AccessLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccessLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccessLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AccessLogs.
     */
    distinct?: AccessLogScalarFieldEnum | AccessLogScalarFieldEnum[]
  }

  /**
   * AccessLog findFirstOrThrow
   */
  export type AccessLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessLog
     */
    select?: AccessLogSelect<ExtArgs> | null
    /**
     * Filter, which AccessLog to fetch.
     */
    where?: AccessLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccessLogs to fetch.
     */
    orderBy?: AccessLogOrderByWithRelationInput | AccessLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AccessLogs.
     */
    cursor?: AccessLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccessLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccessLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AccessLogs.
     */
    distinct?: AccessLogScalarFieldEnum | AccessLogScalarFieldEnum[]
  }

  /**
   * AccessLog findMany
   */
  export type AccessLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessLog
     */
    select?: AccessLogSelect<ExtArgs> | null
    /**
     * Filter, which AccessLogs to fetch.
     */
    where?: AccessLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccessLogs to fetch.
     */
    orderBy?: AccessLogOrderByWithRelationInput | AccessLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AccessLogs.
     */
    cursor?: AccessLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccessLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccessLogs.
     */
    skip?: number
    distinct?: AccessLogScalarFieldEnum | AccessLogScalarFieldEnum[]
  }

  /**
   * AccessLog create
   */
  export type AccessLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessLog
     */
    select?: AccessLogSelect<ExtArgs> | null
    /**
     * The data needed to create a AccessLog.
     */
    data: XOR<AccessLogCreateInput, AccessLogUncheckedCreateInput>
  }

  /**
   * AccessLog createMany
   */
  export type AccessLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AccessLogs.
     */
    data: AccessLogCreateManyInput | AccessLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AccessLog createManyAndReturn
   */
  export type AccessLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessLog
     */
    select?: AccessLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AccessLogs.
     */
    data: AccessLogCreateManyInput | AccessLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AccessLog update
   */
  export type AccessLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessLog
     */
    select?: AccessLogSelect<ExtArgs> | null
    /**
     * The data needed to update a AccessLog.
     */
    data: XOR<AccessLogUpdateInput, AccessLogUncheckedUpdateInput>
    /**
     * Choose, which AccessLog to update.
     */
    where: AccessLogWhereUniqueInput
  }

  /**
   * AccessLog updateMany
   */
  export type AccessLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AccessLogs.
     */
    data: XOR<AccessLogUpdateManyMutationInput, AccessLogUncheckedUpdateManyInput>
    /**
     * Filter which AccessLogs to update
     */
    where?: AccessLogWhereInput
  }

  /**
   * AccessLog upsert
   */
  export type AccessLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessLog
     */
    select?: AccessLogSelect<ExtArgs> | null
    /**
     * The filter to search for the AccessLog to update in case it exists.
     */
    where: AccessLogWhereUniqueInput
    /**
     * In case the AccessLog found by the `where` argument doesn't exist, create a new AccessLog with this data.
     */
    create: XOR<AccessLogCreateInput, AccessLogUncheckedCreateInput>
    /**
     * In case the AccessLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccessLogUpdateInput, AccessLogUncheckedUpdateInput>
  }

  /**
   * AccessLog delete
   */
  export type AccessLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessLog
     */
    select?: AccessLogSelect<ExtArgs> | null
    /**
     * Filter which AccessLog to delete.
     */
    where: AccessLogWhereUniqueInput
  }

  /**
   * AccessLog deleteMany
   */
  export type AccessLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccessLogs to delete
     */
    where?: AccessLogWhereInput
  }

  /**
   * AccessLog without action
   */
  export type AccessLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessLog
     */
    select?: AccessLogSelect<ExtArgs> | null
  }


  /**
   * Model StorageQuota
   */

  export type AggregateStorageQuota = {
    _count: StorageQuotaCountAggregateOutputType | null
    _avg: StorageQuotaAvgAggregateOutputType | null
    _sum: StorageQuotaSumAggregateOutputType | null
    _min: StorageQuotaMinAggregateOutputType | null
    _max: StorageQuotaMaxAggregateOutputType | null
  }

  export type StorageQuotaAvgAggregateOutputType = {
    quotaBytes: number | null
    usedBytes: number | null
    fileCount: number | null
  }

  export type StorageQuotaSumAggregateOutputType = {
    quotaBytes: bigint | null
    usedBytes: bigint | null
    fileCount: number | null
  }

  export type StorageQuotaMinAggregateOutputType = {
    id: string | null
    entityType: $Enums.EntityType | null
    entityId: string | null
    quotaBytes: bigint | null
    usedBytes: bigint | null
    fileCount: number | null
    lastUpdated: Date | null
    createdAt: Date | null
  }

  export type StorageQuotaMaxAggregateOutputType = {
    id: string | null
    entityType: $Enums.EntityType | null
    entityId: string | null
    quotaBytes: bigint | null
    usedBytes: bigint | null
    fileCount: number | null
    lastUpdated: Date | null
    createdAt: Date | null
  }

  export type StorageQuotaCountAggregateOutputType = {
    id: number
    entityType: number
    entityId: number
    quotaBytes: number
    usedBytes: number
    fileCount: number
    lastUpdated: number
    createdAt: number
    _all: number
  }


  export type StorageQuotaAvgAggregateInputType = {
    quotaBytes?: true
    usedBytes?: true
    fileCount?: true
  }

  export type StorageQuotaSumAggregateInputType = {
    quotaBytes?: true
    usedBytes?: true
    fileCount?: true
  }

  export type StorageQuotaMinAggregateInputType = {
    id?: true
    entityType?: true
    entityId?: true
    quotaBytes?: true
    usedBytes?: true
    fileCount?: true
    lastUpdated?: true
    createdAt?: true
  }

  export type StorageQuotaMaxAggregateInputType = {
    id?: true
    entityType?: true
    entityId?: true
    quotaBytes?: true
    usedBytes?: true
    fileCount?: true
    lastUpdated?: true
    createdAt?: true
  }

  export type StorageQuotaCountAggregateInputType = {
    id?: true
    entityType?: true
    entityId?: true
    quotaBytes?: true
    usedBytes?: true
    fileCount?: true
    lastUpdated?: true
    createdAt?: true
    _all?: true
  }

  export type StorageQuotaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StorageQuota to aggregate.
     */
    where?: StorageQuotaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StorageQuotas to fetch.
     */
    orderBy?: StorageQuotaOrderByWithRelationInput | StorageQuotaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StorageQuotaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StorageQuotas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StorageQuotas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StorageQuotas
    **/
    _count?: true | StorageQuotaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StorageQuotaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StorageQuotaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StorageQuotaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StorageQuotaMaxAggregateInputType
  }

  export type GetStorageQuotaAggregateType<T extends StorageQuotaAggregateArgs> = {
        [P in keyof T & keyof AggregateStorageQuota]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStorageQuota[P]>
      : GetScalarType<T[P], AggregateStorageQuota[P]>
  }




  export type StorageQuotaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StorageQuotaWhereInput
    orderBy?: StorageQuotaOrderByWithAggregationInput | StorageQuotaOrderByWithAggregationInput[]
    by: StorageQuotaScalarFieldEnum[] | StorageQuotaScalarFieldEnum
    having?: StorageQuotaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StorageQuotaCountAggregateInputType | true
    _avg?: StorageQuotaAvgAggregateInputType
    _sum?: StorageQuotaSumAggregateInputType
    _min?: StorageQuotaMinAggregateInputType
    _max?: StorageQuotaMaxAggregateInputType
  }

  export type StorageQuotaGroupByOutputType = {
    id: string
    entityType: $Enums.EntityType
    entityId: string
    quotaBytes: bigint
    usedBytes: bigint
    fileCount: number
    lastUpdated: Date
    createdAt: Date
    _count: StorageQuotaCountAggregateOutputType | null
    _avg: StorageQuotaAvgAggregateOutputType | null
    _sum: StorageQuotaSumAggregateOutputType | null
    _min: StorageQuotaMinAggregateOutputType | null
    _max: StorageQuotaMaxAggregateOutputType | null
  }

  type GetStorageQuotaGroupByPayload<T extends StorageQuotaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StorageQuotaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StorageQuotaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StorageQuotaGroupByOutputType[P]>
            : GetScalarType<T[P], StorageQuotaGroupByOutputType[P]>
        }
      >
    >


  export type StorageQuotaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entityType?: boolean
    entityId?: boolean
    quotaBytes?: boolean
    usedBytes?: boolean
    fileCount?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["storageQuota"]>

  export type StorageQuotaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entityType?: boolean
    entityId?: boolean
    quotaBytes?: boolean
    usedBytes?: boolean
    fileCount?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["storageQuota"]>

  export type StorageQuotaSelectScalar = {
    id?: boolean
    entityType?: boolean
    entityId?: boolean
    quotaBytes?: boolean
    usedBytes?: boolean
    fileCount?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
  }


  export type $StorageQuotaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StorageQuota"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      entityType: $Enums.EntityType
      entityId: string
      quotaBytes: bigint
      usedBytes: bigint
      fileCount: number
      lastUpdated: Date
      createdAt: Date
    }, ExtArgs["result"]["storageQuota"]>
    composites: {}
  }

  type StorageQuotaGetPayload<S extends boolean | null | undefined | StorageQuotaDefaultArgs> = $Result.GetResult<Prisma.$StorageQuotaPayload, S>

  type StorageQuotaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<StorageQuotaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: StorageQuotaCountAggregateInputType | true
    }

  export interface StorageQuotaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StorageQuota'], meta: { name: 'StorageQuota' } }
    /**
     * Find zero or one StorageQuota that matches the filter.
     * @param {StorageQuotaFindUniqueArgs} args - Arguments to find a StorageQuota
     * @example
     * // Get one StorageQuota
     * const storageQuota = await prisma.storageQuota.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StorageQuotaFindUniqueArgs>(args: SelectSubset<T, StorageQuotaFindUniqueArgs<ExtArgs>>): Prisma__StorageQuotaClient<$Result.GetResult<Prisma.$StorageQuotaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one StorageQuota that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {StorageQuotaFindUniqueOrThrowArgs} args - Arguments to find a StorageQuota
     * @example
     * // Get one StorageQuota
     * const storageQuota = await prisma.storageQuota.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StorageQuotaFindUniqueOrThrowArgs>(args: SelectSubset<T, StorageQuotaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StorageQuotaClient<$Result.GetResult<Prisma.$StorageQuotaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first StorageQuota that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageQuotaFindFirstArgs} args - Arguments to find a StorageQuota
     * @example
     * // Get one StorageQuota
     * const storageQuota = await prisma.storageQuota.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StorageQuotaFindFirstArgs>(args?: SelectSubset<T, StorageQuotaFindFirstArgs<ExtArgs>>): Prisma__StorageQuotaClient<$Result.GetResult<Prisma.$StorageQuotaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first StorageQuota that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageQuotaFindFirstOrThrowArgs} args - Arguments to find a StorageQuota
     * @example
     * // Get one StorageQuota
     * const storageQuota = await prisma.storageQuota.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StorageQuotaFindFirstOrThrowArgs>(args?: SelectSubset<T, StorageQuotaFindFirstOrThrowArgs<ExtArgs>>): Prisma__StorageQuotaClient<$Result.GetResult<Prisma.$StorageQuotaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more StorageQuotas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageQuotaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StorageQuotas
     * const storageQuotas = await prisma.storageQuota.findMany()
     * 
     * // Get first 10 StorageQuotas
     * const storageQuotas = await prisma.storageQuota.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const storageQuotaWithIdOnly = await prisma.storageQuota.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StorageQuotaFindManyArgs>(args?: SelectSubset<T, StorageQuotaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorageQuotaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a StorageQuota.
     * @param {StorageQuotaCreateArgs} args - Arguments to create a StorageQuota.
     * @example
     * // Create one StorageQuota
     * const StorageQuota = await prisma.storageQuota.create({
     *   data: {
     *     // ... data to create a StorageQuota
     *   }
     * })
     * 
     */
    create<T extends StorageQuotaCreateArgs>(args: SelectSubset<T, StorageQuotaCreateArgs<ExtArgs>>): Prisma__StorageQuotaClient<$Result.GetResult<Prisma.$StorageQuotaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many StorageQuotas.
     * @param {StorageQuotaCreateManyArgs} args - Arguments to create many StorageQuotas.
     * @example
     * // Create many StorageQuotas
     * const storageQuota = await prisma.storageQuota.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StorageQuotaCreateManyArgs>(args?: SelectSubset<T, StorageQuotaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StorageQuotas and returns the data saved in the database.
     * @param {StorageQuotaCreateManyAndReturnArgs} args - Arguments to create many StorageQuotas.
     * @example
     * // Create many StorageQuotas
     * const storageQuota = await prisma.storageQuota.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StorageQuotas and only return the `id`
     * const storageQuotaWithIdOnly = await prisma.storageQuota.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StorageQuotaCreateManyAndReturnArgs>(args?: SelectSubset<T, StorageQuotaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorageQuotaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a StorageQuota.
     * @param {StorageQuotaDeleteArgs} args - Arguments to delete one StorageQuota.
     * @example
     * // Delete one StorageQuota
     * const StorageQuota = await prisma.storageQuota.delete({
     *   where: {
     *     // ... filter to delete one StorageQuota
     *   }
     * })
     * 
     */
    delete<T extends StorageQuotaDeleteArgs>(args: SelectSubset<T, StorageQuotaDeleteArgs<ExtArgs>>): Prisma__StorageQuotaClient<$Result.GetResult<Prisma.$StorageQuotaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one StorageQuota.
     * @param {StorageQuotaUpdateArgs} args - Arguments to update one StorageQuota.
     * @example
     * // Update one StorageQuota
     * const storageQuota = await prisma.storageQuota.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StorageQuotaUpdateArgs>(args: SelectSubset<T, StorageQuotaUpdateArgs<ExtArgs>>): Prisma__StorageQuotaClient<$Result.GetResult<Prisma.$StorageQuotaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more StorageQuotas.
     * @param {StorageQuotaDeleteManyArgs} args - Arguments to filter StorageQuotas to delete.
     * @example
     * // Delete a few StorageQuotas
     * const { count } = await prisma.storageQuota.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StorageQuotaDeleteManyArgs>(args?: SelectSubset<T, StorageQuotaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StorageQuotas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageQuotaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StorageQuotas
     * const storageQuota = await prisma.storageQuota.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StorageQuotaUpdateManyArgs>(args: SelectSubset<T, StorageQuotaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one StorageQuota.
     * @param {StorageQuotaUpsertArgs} args - Arguments to update or create a StorageQuota.
     * @example
     * // Update or create a StorageQuota
     * const storageQuota = await prisma.storageQuota.upsert({
     *   create: {
     *     // ... data to create a StorageQuota
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StorageQuota we want to update
     *   }
     * })
     */
    upsert<T extends StorageQuotaUpsertArgs>(args: SelectSubset<T, StorageQuotaUpsertArgs<ExtArgs>>): Prisma__StorageQuotaClient<$Result.GetResult<Prisma.$StorageQuotaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of StorageQuotas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageQuotaCountArgs} args - Arguments to filter StorageQuotas to count.
     * @example
     * // Count the number of StorageQuotas
     * const count = await prisma.storageQuota.count({
     *   where: {
     *     // ... the filter for the StorageQuotas we want to count
     *   }
     * })
    **/
    count<T extends StorageQuotaCountArgs>(
      args?: Subset<T, StorageQuotaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StorageQuotaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StorageQuota.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageQuotaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StorageQuotaAggregateArgs>(args: Subset<T, StorageQuotaAggregateArgs>): Prisma.PrismaPromise<GetStorageQuotaAggregateType<T>>

    /**
     * Group by StorageQuota.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageQuotaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StorageQuotaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StorageQuotaGroupByArgs['orderBy'] }
        : { orderBy?: StorageQuotaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StorageQuotaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStorageQuotaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StorageQuota model
   */
  readonly fields: StorageQuotaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StorageQuota.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StorageQuotaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StorageQuota model
   */ 
  interface StorageQuotaFieldRefs {
    readonly id: FieldRef<"StorageQuota", 'String'>
    readonly entityType: FieldRef<"StorageQuota", 'EntityType'>
    readonly entityId: FieldRef<"StorageQuota", 'String'>
    readonly quotaBytes: FieldRef<"StorageQuota", 'BigInt'>
    readonly usedBytes: FieldRef<"StorageQuota", 'BigInt'>
    readonly fileCount: FieldRef<"StorageQuota", 'Int'>
    readonly lastUpdated: FieldRef<"StorageQuota", 'DateTime'>
    readonly createdAt: FieldRef<"StorageQuota", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StorageQuota findUnique
   */
  export type StorageQuotaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageQuota
     */
    select?: StorageQuotaSelect<ExtArgs> | null
    /**
     * Filter, which StorageQuota to fetch.
     */
    where: StorageQuotaWhereUniqueInput
  }

  /**
   * StorageQuota findUniqueOrThrow
   */
  export type StorageQuotaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageQuota
     */
    select?: StorageQuotaSelect<ExtArgs> | null
    /**
     * Filter, which StorageQuota to fetch.
     */
    where: StorageQuotaWhereUniqueInput
  }

  /**
   * StorageQuota findFirst
   */
  export type StorageQuotaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageQuota
     */
    select?: StorageQuotaSelect<ExtArgs> | null
    /**
     * Filter, which StorageQuota to fetch.
     */
    where?: StorageQuotaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StorageQuotas to fetch.
     */
    orderBy?: StorageQuotaOrderByWithRelationInput | StorageQuotaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StorageQuotas.
     */
    cursor?: StorageQuotaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StorageQuotas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StorageQuotas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StorageQuotas.
     */
    distinct?: StorageQuotaScalarFieldEnum | StorageQuotaScalarFieldEnum[]
  }

  /**
   * StorageQuota findFirstOrThrow
   */
  export type StorageQuotaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageQuota
     */
    select?: StorageQuotaSelect<ExtArgs> | null
    /**
     * Filter, which StorageQuota to fetch.
     */
    where?: StorageQuotaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StorageQuotas to fetch.
     */
    orderBy?: StorageQuotaOrderByWithRelationInput | StorageQuotaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StorageQuotas.
     */
    cursor?: StorageQuotaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StorageQuotas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StorageQuotas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StorageQuotas.
     */
    distinct?: StorageQuotaScalarFieldEnum | StorageQuotaScalarFieldEnum[]
  }

  /**
   * StorageQuota findMany
   */
  export type StorageQuotaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageQuota
     */
    select?: StorageQuotaSelect<ExtArgs> | null
    /**
     * Filter, which StorageQuotas to fetch.
     */
    where?: StorageQuotaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StorageQuotas to fetch.
     */
    orderBy?: StorageQuotaOrderByWithRelationInput | StorageQuotaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StorageQuotas.
     */
    cursor?: StorageQuotaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StorageQuotas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StorageQuotas.
     */
    skip?: number
    distinct?: StorageQuotaScalarFieldEnum | StorageQuotaScalarFieldEnum[]
  }

  /**
   * StorageQuota create
   */
  export type StorageQuotaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageQuota
     */
    select?: StorageQuotaSelect<ExtArgs> | null
    /**
     * The data needed to create a StorageQuota.
     */
    data: XOR<StorageQuotaCreateInput, StorageQuotaUncheckedCreateInput>
  }

  /**
   * StorageQuota createMany
   */
  export type StorageQuotaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StorageQuotas.
     */
    data: StorageQuotaCreateManyInput | StorageQuotaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StorageQuota createManyAndReturn
   */
  export type StorageQuotaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageQuota
     */
    select?: StorageQuotaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many StorageQuotas.
     */
    data: StorageQuotaCreateManyInput | StorageQuotaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StorageQuota update
   */
  export type StorageQuotaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageQuota
     */
    select?: StorageQuotaSelect<ExtArgs> | null
    /**
     * The data needed to update a StorageQuota.
     */
    data: XOR<StorageQuotaUpdateInput, StorageQuotaUncheckedUpdateInput>
    /**
     * Choose, which StorageQuota to update.
     */
    where: StorageQuotaWhereUniqueInput
  }

  /**
   * StorageQuota updateMany
   */
  export type StorageQuotaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StorageQuotas.
     */
    data: XOR<StorageQuotaUpdateManyMutationInput, StorageQuotaUncheckedUpdateManyInput>
    /**
     * Filter which StorageQuotas to update
     */
    where?: StorageQuotaWhereInput
  }

  /**
   * StorageQuota upsert
   */
  export type StorageQuotaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageQuota
     */
    select?: StorageQuotaSelect<ExtArgs> | null
    /**
     * The filter to search for the StorageQuota to update in case it exists.
     */
    where: StorageQuotaWhereUniqueInput
    /**
     * In case the StorageQuota found by the `where` argument doesn't exist, create a new StorageQuota with this data.
     */
    create: XOR<StorageQuotaCreateInput, StorageQuotaUncheckedCreateInput>
    /**
     * In case the StorageQuota was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StorageQuotaUpdateInput, StorageQuotaUncheckedUpdateInput>
  }

  /**
   * StorageQuota delete
   */
  export type StorageQuotaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageQuota
     */
    select?: StorageQuotaSelect<ExtArgs> | null
    /**
     * Filter which StorageQuota to delete.
     */
    where: StorageQuotaWhereUniqueInput
  }

  /**
   * StorageQuota deleteMany
   */
  export type StorageQuotaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StorageQuotas to delete
     */
    where?: StorageQuotaWhereInput
  }

  /**
   * StorageQuota without action
   */
  export type StorageQuotaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageQuota
     */
    select?: StorageQuotaSelect<ExtArgs> | null
  }


  /**
   * Model RetentionPolicy
   */

  export type AggregateRetentionPolicy = {
    _count: RetentionPolicyCountAggregateOutputType | null
    _avg: RetentionPolicyAvgAggregateOutputType | null
    _sum: RetentionPolicySumAggregateOutputType | null
    _min: RetentionPolicyMinAggregateOutputType | null
    _max: RetentionPolicyMaxAggregateOutputType | null
  }

  export type RetentionPolicyAvgAggregateOutputType = {
    retentionPeriodDays: number | null
  }

  export type RetentionPolicySumAggregateOutputType = {
    retentionPeriodDays: number | null
  }

  export type RetentionPolicyMinAggregateOutputType = {
    id: string | null
    name: string | null
    entityType: $Enums.EntityType | null
    retentionPeriodDays: number | null
    jurisdiction: string | null
    isActive: boolean | null
    description: string | null
    legalBasis: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RetentionPolicyMaxAggregateOutputType = {
    id: string | null
    name: string | null
    entityType: $Enums.EntityType | null
    retentionPeriodDays: number | null
    jurisdiction: string | null
    isActive: boolean | null
    description: string | null
    legalBasis: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RetentionPolicyCountAggregateOutputType = {
    id: number
    name: number
    entityType: number
    retentionPeriodDays: number
    jurisdiction: number
    isActive: number
    description: number
    legalBasis: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RetentionPolicyAvgAggregateInputType = {
    retentionPeriodDays?: true
  }

  export type RetentionPolicySumAggregateInputType = {
    retentionPeriodDays?: true
  }

  export type RetentionPolicyMinAggregateInputType = {
    id?: true
    name?: true
    entityType?: true
    retentionPeriodDays?: true
    jurisdiction?: true
    isActive?: true
    description?: true
    legalBasis?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RetentionPolicyMaxAggregateInputType = {
    id?: true
    name?: true
    entityType?: true
    retentionPeriodDays?: true
    jurisdiction?: true
    isActive?: true
    description?: true
    legalBasis?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RetentionPolicyCountAggregateInputType = {
    id?: true
    name?: true
    entityType?: true
    retentionPeriodDays?: true
    jurisdiction?: true
    isActive?: true
    description?: true
    legalBasis?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RetentionPolicyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RetentionPolicy to aggregate.
     */
    where?: RetentionPolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetentionPolicies to fetch.
     */
    orderBy?: RetentionPolicyOrderByWithRelationInput | RetentionPolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RetentionPolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetentionPolicies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetentionPolicies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RetentionPolicies
    **/
    _count?: true | RetentionPolicyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RetentionPolicyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RetentionPolicySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RetentionPolicyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RetentionPolicyMaxAggregateInputType
  }

  export type GetRetentionPolicyAggregateType<T extends RetentionPolicyAggregateArgs> = {
        [P in keyof T & keyof AggregateRetentionPolicy]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRetentionPolicy[P]>
      : GetScalarType<T[P], AggregateRetentionPolicy[P]>
  }




  export type RetentionPolicyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RetentionPolicyWhereInput
    orderBy?: RetentionPolicyOrderByWithAggregationInput | RetentionPolicyOrderByWithAggregationInput[]
    by: RetentionPolicyScalarFieldEnum[] | RetentionPolicyScalarFieldEnum
    having?: RetentionPolicyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RetentionPolicyCountAggregateInputType | true
    _avg?: RetentionPolicyAvgAggregateInputType
    _sum?: RetentionPolicySumAggregateInputType
    _min?: RetentionPolicyMinAggregateInputType
    _max?: RetentionPolicyMaxAggregateInputType
  }

  export type RetentionPolicyGroupByOutputType = {
    id: string
    name: string
    entityType: $Enums.EntityType
    retentionPeriodDays: number
    jurisdiction: string
    isActive: boolean
    description: string | null
    legalBasis: string | null
    createdAt: Date
    updatedAt: Date
    _count: RetentionPolicyCountAggregateOutputType | null
    _avg: RetentionPolicyAvgAggregateOutputType | null
    _sum: RetentionPolicySumAggregateOutputType | null
    _min: RetentionPolicyMinAggregateOutputType | null
    _max: RetentionPolicyMaxAggregateOutputType | null
  }

  type GetRetentionPolicyGroupByPayload<T extends RetentionPolicyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RetentionPolicyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RetentionPolicyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RetentionPolicyGroupByOutputType[P]>
            : GetScalarType<T[P], RetentionPolicyGroupByOutputType[P]>
        }
      >
    >


  export type RetentionPolicySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    entityType?: boolean
    retentionPeriodDays?: boolean
    jurisdiction?: boolean
    isActive?: boolean
    description?: boolean
    legalBasis?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    rules?: boolean | RetentionPolicy$rulesArgs<ExtArgs>
    _count?: boolean | RetentionPolicyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["retentionPolicy"]>

  export type RetentionPolicySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    entityType?: boolean
    retentionPeriodDays?: boolean
    jurisdiction?: boolean
    isActive?: boolean
    description?: boolean
    legalBasis?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["retentionPolicy"]>

  export type RetentionPolicySelectScalar = {
    id?: boolean
    name?: boolean
    entityType?: boolean
    retentionPeriodDays?: boolean
    jurisdiction?: boolean
    isActive?: boolean
    description?: boolean
    legalBasis?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RetentionPolicyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rules?: boolean | RetentionPolicy$rulesArgs<ExtArgs>
    _count?: boolean | RetentionPolicyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RetentionPolicyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RetentionPolicyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RetentionPolicy"
    objects: {
      rules: Prisma.$RetentionPolicyRulePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      entityType: $Enums.EntityType
      retentionPeriodDays: number
      jurisdiction: string
      isActive: boolean
      description: string | null
      legalBasis: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["retentionPolicy"]>
    composites: {}
  }

  type RetentionPolicyGetPayload<S extends boolean | null | undefined | RetentionPolicyDefaultArgs> = $Result.GetResult<Prisma.$RetentionPolicyPayload, S>

  type RetentionPolicyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RetentionPolicyFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RetentionPolicyCountAggregateInputType | true
    }

  export interface RetentionPolicyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RetentionPolicy'], meta: { name: 'RetentionPolicy' } }
    /**
     * Find zero or one RetentionPolicy that matches the filter.
     * @param {RetentionPolicyFindUniqueArgs} args - Arguments to find a RetentionPolicy
     * @example
     * // Get one RetentionPolicy
     * const retentionPolicy = await prisma.retentionPolicy.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RetentionPolicyFindUniqueArgs>(args: SelectSubset<T, RetentionPolicyFindUniqueArgs<ExtArgs>>): Prisma__RetentionPolicyClient<$Result.GetResult<Prisma.$RetentionPolicyPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RetentionPolicy that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RetentionPolicyFindUniqueOrThrowArgs} args - Arguments to find a RetentionPolicy
     * @example
     * // Get one RetentionPolicy
     * const retentionPolicy = await prisma.retentionPolicy.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RetentionPolicyFindUniqueOrThrowArgs>(args: SelectSubset<T, RetentionPolicyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RetentionPolicyClient<$Result.GetResult<Prisma.$RetentionPolicyPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RetentionPolicy that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetentionPolicyFindFirstArgs} args - Arguments to find a RetentionPolicy
     * @example
     * // Get one RetentionPolicy
     * const retentionPolicy = await prisma.retentionPolicy.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RetentionPolicyFindFirstArgs>(args?: SelectSubset<T, RetentionPolicyFindFirstArgs<ExtArgs>>): Prisma__RetentionPolicyClient<$Result.GetResult<Prisma.$RetentionPolicyPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RetentionPolicy that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetentionPolicyFindFirstOrThrowArgs} args - Arguments to find a RetentionPolicy
     * @example
     * // Get one RetentionPolicy
     * const retentionPolicy = await prisma.retentionPolicy.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RetentionPolicyFindFirstOrThrowArgs>(args?: SelectSubset<T, RetentionPolicyFindFirstOrThrowArgs<ExtArgs>>): Prisma__RetentionPolicyClient<$Result.GetResult<Prisma.$RetentionPolicyPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RetentionPolicies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetentionPolicyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RetentionPolicies
     * const retentionPolicies = await prisma.retentionPolicy.findMany()
     * 
     * // Get first 10 RetentionPolicies
     * const retentionPolicies = await prisma.retentionPolicy.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const retentionPolicyWithIdOnly = await prisma.retentionPolicy.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RetentionPolicyFindManyArgs>(args?: SelectSubset<T, RetentionPolicyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RetentionPolicyPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RetentionPolicy.
     * @param {RetentionPolicyCreateArgs} args - Arguments to create a RetentionPolicy.
     * @example
     * // Create one RetentionPolicy
     * const RetentionPolicy = await prisma.retentionPolicy.create({
     *   data: {
     *     // ... data to create a RetentionPolicy
     *   }
     * })
     * 
     */
    create<T extends RetentionPolicyCreateArgs>(args: SelectSubset<T, RetentionPolicyCreateArgs<ExtArgs>>): Prisma__RetentionPolicyClient<$Result.GetResult<Prisma.$RetentionPolicyPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RetentionPolicies.
     * @param {RetentionPolicyCreateManyArgs} args - Arguments to create many RetentionPolicies.
     * @example
     * // Create many RetentionPolicies
     * const retentionPolicy = await prisma.retentionPolicy.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RetentionPolicyCreateManyArgs>(args?: SelectSubset<T, RetentionPolicyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RetentionPolicies and returns the data saved in the database.
     * @param {RetentionPolicyCreateManyAndReturnArgs} args - Arguments to create many RetentionPolicies.
     * @example
     * // Create many RetentionPolicies
     * const retentionPolicy = await prisma.retentionPolicy.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RetentionPolicies and only return the `id`
     * const retentionPolicyWithIdOnly = await prisma.retentionPolicy.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RetentionPolicyCreateManyAndReturnArgs>(args?: SelectSubset<T, RetentionPolicyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RetentionPolicyPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RetentionPolicy.
     * @param {RetentionPolicyDeleteArgs} args - Arguments to delete one RetentionPolicy.
     * @example
     * // Delete one RetentionPolicy
     * const RetentionPolicy = await prisma.retentionPolicy.delete({
     *   where: {
     *     // ... filter to delete one RetentionPolicy
     *   }
     * })
     * 
     */
    delete<T extends RetentionPolicyDeleteArgs>(args: SelectSubset<T, RetentionPolicyDeleteArgs<ExtArgs>>): Prisma__RetentionPolicyClient<$Result.GetResult<Prisma.$RetentionPolicyPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RetentionPolicy.
     * @param {RetentionPolicyUpdateArgs} args - Arguments to update one RetentionPolicy.
     * @example
     * // Update one RetentionPolicy
     * const retentionPolicy = await prisma.retentionPolicy.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RetentionPolicyUpdateArgs>(args: SelectSubset<T, RetentionPolicyUpdateArgs<ExtArgs>>): Prisma__RetentionPolicyClient<$Result.GetResult<Prisma.$RetentionPolicyPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RetentionPolicies.
     * @param {RetentionPolicyDeleteManyArgs} args - Arguments to filter RetentionPolicies to delete.
     * @example
     * // Delete a few RetentionPolicies
     * const { count } = await prisma.retentionPolicy.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RetentionPolicyDeleteManyArgs>(args?: SelectSubset<T, RetentionPolicyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RetentionPolicies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetentionPolicyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RetentionPolicies
     * const retentionPolicy = await prisma.retentionPolicy.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RetentionPolicyUpdateManyArgs>(args: SelectSubset<T, RetentionPolicyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RetentionPolicy.
     * @param {RetentionPolicyUpsertArgs} args - Arguments to update or create a RetentionPolicy.
     * @example
     * // Update or create a RetentionPolicy
     * const retentionPolicy = await prisma.retentionPolicy.upsert({
     *   create: {
     *     // ... data to create a RetentionPolicy
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RetentionPolicy we want to update
     *   }
     * })
     */
    upsert<T extends RetentionPolicyUpsertArgs>(args: SelectSubset<T, RetentionPolicyUpsertArgs<ExtArgs>>): Prisma__RetentionPolicyClient<$Result.GetResult<Prisma.$RetentionPolicyPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RetentionPolicies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetentionPolicyCountArgs} args - Arguments to filter RetentionPolicies to count.
     * @example
     * // Count the number of RetentionPolicies
     * const count = await prisma.retentionPolicy.count({
     *   where: {
     *     // ... the filter for the RetentionPolicies we want to count
     *   }
     * })
    **/
    count<T extends RetentionPolicyCountArgs>(
      args?: Subset<T, RetentionPolicyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RetentionPolicyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RetentionPolicy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetentionPolicyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RetentionPolicyAggregateArgs>(args: Subset<T, RetentionPolicyAggregateArgs>): Prisma.PrismaPromise<GetRetentionPolicyAggregateType<T>>

    /**
     * Group by RetentionPolicy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetentionPolicyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RetentionPolicyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RetentionPolicyGroupByArgs['orderBy'] }
        : { orderBy?: RetentionPolicyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RetentionPolicyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRetentionPolicyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RetentionPolicy model
   */
  readonly fields: RetentionPolicyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RetentionPolicy.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RetentionPolicyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    rules<T extends RetentionPolicy$rulesArgs<ExtArgs> = {}>(args?: Subset<T, RetentionPolicy$rulesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RetentionPolicyRulePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RetentionPolicy model
   */ 
  interface RetentionPolicyFieldRefs {
    readonly id: FieldRef<"RetentionPolicy", 'String'>
    readonly name: FieldRef<"RetentionPolicy", 'String'>
    readonly entityType: FieldRef<"RetentionPolicy", 'EntityType'>
    readonly retentionPeriodDays: FieldRef<"RetentionPolicy", 'Int'>
    readonly jurisdiction: FieldRef<"RetentionPolicy", 'String'>
    readonly isActive: FieldRef<"RetentionPolicy", 'Boolean'>
    readonly description: FieldRef<"RetentionPolicy", 'String'>
    readonly legalBasis: FieldRef<"RetentionPolicy", 'String'>
    readonly createdAt: FieldRef<"RetentionPolicy", 'DateTime'>
    readonly updatedAt: FieldRef<"RetentionPolicy", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RetentionPolicy findUnique
   */
  export type RetentionPolicyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicy
     */
    select?: RetentionPolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyInclude<ExtArgs> | null
    /**
     * Filter, which RetentionPolicy to fetch.
     */
    where: RetentionPolicyWhereUniqueInput
  }

  /**
   * RetentionPolicy findUniqueOrThrow
   */
  export type RetentionPolicyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicy
     */
    select?: RetentionPolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyInclude<ExtArgs> | null
    /**
     * Filter, which RetentionPolicy to fetch.
     */
    where: RetentionPolicyWhereUniqueInput
  }

  /**
   * RetentionPolicy findFirst
   */
  export type RetentionPolicyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicy
     */
    select?: RetentionPolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyInclude<ExtArgs> | null
    /**
     * Filter, which RetentionPolicy to fetch.
     */
    where?: RetentionPolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetentionPolicies to fetch.
     */
    orderBy?: RetentionPolicyOrderByWithRelationInput | RetentionPolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RetentionPolicies.
     */
    cursor?: RetentionPolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetentionPolicies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetentionPolicies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RetentionPolicies.
     */
    distinct?: RetentionPolicyScalarFieldEnum | RetentionPolicyScalarFieldEnum[]
  }

  /**
   * RetentionPolicy findFirstOrThrow
   */
  export type RetentionPolicyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicy
     */
    select?: RetentionPolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyInclude<ExtArgs> | null
    /**
     * Filter, which RetentionPolicy to fetch.
     */
    where?: RetentionPolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetentionPolicies to fetch.
     */
    orderBy?: RetentionPolicyOrderByWithRelationInput | RetentionPolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RetentionPolicies.
     */
    cursor?: RetentionPolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetentionPolicies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetentionPolicies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RetentionPolicies.
     */
    distinct?: RetentionPolicyScalarFieldEnum | RetentionPolicyScalarFieldEnum[]
  }

  /**
   * RetentionPolicy findMany
   */
  export type RetentionPolicyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicy
     */
    select?: RetentionPolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyInclude<ExtArgs> | null
    /**
     * Filter, which RetentionPolicies to fetch.
     */
    where?: RetentionPolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetentionPolicies to fetch.
     */
    orderBy?: RetentionPolicyOrderByWithRelationInput | RetentionPolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RetentionPolicies.
     */
    cursor?: RetentionPolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetentionPolicies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetentionPolicies.
     */
    skip?: number
    distinct?: RetentionPolicyScalarFieldEnum | RetentionPolicyScalarFieldEnum[]
  }

  /**
   * RetentionPolicy create
   */
  export type RetentionPolicyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicy
     */
    select?: RetentionPolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyInclude<ExtArgs> | null
    /**
     * The data needed to create a RetentionPolicy.
     */
    data: XOR<RetentionPolicyCreateInput, RetentionPolicyUncheckedCreateInput>
  }

  /**
   * RetentionPolicy createMany
   */
  export type RetentionPolicyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RetentionPolicies.
     */
    data: RetentionPolicyCreateManyInput | RetentionPolicyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RetentionPolicy createManyAndReturn
   */
  export type RetentionPolicyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicy
     */
    select?: RetentionPolicySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RetentionPolicies.
     */
    data: RetentionPolicyCreateManyInput | RetentionPolicyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RetentionPolicy update
   */
  export type RetentionPolicyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicy
     */
    select?: RetentionPolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyInclude<ExtArgs> | null
    /**
     * The data needed to update a RetentionPolicy.
     */
    data: XOR<RetentionPolicyUpdateInput, RetentionPolicyUncheckedUpdateInput>
    /**
     * Choose, which RetentionPolicy to update.
     */
    where: RetentionPolicyWhereUniqueInput
  }

  /**
   * RetentionPolicy updateMany
   */
  export type RetentionPolicyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RetentionPolicies.
     */
    data: XOR<RetentionPolicyUpdateManyMutationInput, RetentionPolicyUncheckedUpdateManyInput>
    /**
     * Filter which RetentionPolicies to update
     */
    where?: RetentionPolicyWhereInput
  }

  /**
   * RetentionPolicy upsert
   */
  export type RetentionPolicyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicy
     */
    select?: RetentionPolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyInclude<ExtArgs> | null
    /**
     * The filter to search for the RetentionPolicy to update in case it exists.
     */
    where: RetentionPolicyWhereUniqueInput
    /**
     * In case the RetentionPolicy found by the `where` argument doesn't exist, create a new RetentionPolicy with this data.
     */
    create: XOR<RetentionPolicyCreateInput, RetentionPolicyUncheckedCreateInput>
    /**
     * In case the RetentionPolicy was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RetentionPolicyUpdateInput, RetentionPolicyUncheckedUpdateInput>
  }

  /**
   * RetentionPolicy delete
   */
  export type RetentionPolicyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicy
     */
    select?: RetentionPolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyInclude<ExtArgs> | null
    /**
     * Filter which RetentionPolicy to delete.
     */
    where: RetentionPolicyWhereUniqueInput
  }

  /**
   * RetentionPolicy deleteMany
   */
  export type RetentionPolicyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RetentionPolicies to delete
     */
    where?: RetentionPolicyWhereInput
  }

  /**
   * RetentionPolicy.rules
   */
  export type RetentionPolicy$rulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicyRule
     */
    select?: RetentionPolicyRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyRuleInclude<ExtArgs> | null
    where?: RetentionPolicyRuleWhereInput
    orderBy?: RetentionPolicyRuleOrderByWithRelationInput | RetentionPolicyRuleOrderByWithRelationInput[]
    cursor?: RetentionPolicyRuleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RetentionPolicyRuleScalarFieldEnum | RetentionPolicyRuleScalarFieldEnum[]
  }

  /**
   * RetentionPolicy without action
   */
  export type RetentionPolicyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicy
     */
    select?: RetentionPolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyInclude<ExtArgs> | null
  }


  /**
   * Model RetentionPolicyRule
   */

  export type AggregateRetentionPolicyRule = {
    _count: RetentionPolicyRuleCountAggregateOutputType | null
    _avg: RetentionPolicyRuleAvgAggregateOutputType | null
    _sum: RetentionPolicyRuleSumAggregateOutputType | null
    _min: RetentionPolicyRuleMinAggregateOutputType | null
    _max: RetentionPolicyRuleMaxAggregateOutputType | null
  }

  export type RetentionPolicyRuleAvgAggregateOutputType = {
    priority: number | null
  }

  export type RetentionPolicyRuleSumAggregateOutputType = {
    priority: number | null
  }

  export type RetentionPolicyRuleMinAggregateOutputType = {
    id: string | null
    policyId: string | null
    priority: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RetentionPolicyRuleMaxAggregateOutputType = {
    id: string | null
    policyId: string | null
    priority: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RetentionPolicyRuleCountAggregateOutputType = {
    id: number
    policyId: number
    condition: number
    action: number
    priority: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RetentionPolicyRuleAvgAggregateInputType = {
    priority?: true
  }

  export type RetentionPolicyRuleSumAggregateInputType = {
    priority?: true
  }

  export type RetentionPolicyRuleMinAggregateInputType = {
    id?: true
    policyId?: true
    priority?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RetentionPolicyRuleMaxAggregateInputType = {
    id?: true
    policyId?: true
    priority?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RetentionPolicyRuleCountAggregateInputType = {
    id?: true
    policyId?: true
    condition?: true
    action?: true
    priority?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RetentionPolicyRuleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RetentionPolicyRule to aggregate.
     */
    where?: RetentionPolicyRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetentionPolicyRules to fetch.
     */
    orderBy?: RetentionPolicyRuleOrderByWithRelationInput | RetentionPolicyRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RetentionPolicyRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetentionPolicyRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetentionPolicyRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RetentionPolicyRules
    **/
    _count?: true | RetentionPolicyRuleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RetentionPolicyRuleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RetentionPolicyRuleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RetentionPolicyRuleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RetentionPolicyRuleMaxAggregateInputType
  }

  export type GetRetentionPolicyRuleAggregateType<T extends RetentionPolicyRuleAggregateArgs> = {
        [P in keyof T & keyof AggregateRetentionPolicyRule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRetentionPolicyRule[P]>
      : GetScalarType<T[P], AggregateRetentionPolicyRule[P]>
  }




  export type RetentionPolicyRuleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RetentionPolicyRuleWhereInput
    orderBy?: RetentionPolicyRuleOrderByWithAggregationInput | RetentionPolicyRuleOrderByWithAggregationInput[]
    by: RetentionPolicyRuleScalarFieldEnum[] | RetentionPolicyRuleScalarFieldEnum
    having?: RetentionPolicyRuleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RetentionPolicyRuleCountAggregateInputType | true
    _avg?: RetentionPolicyRuleAvgAggregateInputType
    _sum?: RetentionPolicyRuleSumAggregateInputType
    _min?: RetentionPolicyRuleMinAggregateInputType
    _max?: RetentionPolicyRuleMaxAggregateInputType
  }

  export type RetentionPolicyRuleGroupByOutputType = {
    id: string
    policyId: string
    condition: JsonValue
    action: JsonValue
    priority: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: RetentionPolicyRuleCountAggregateOutputType | null
    _avg: RetentionPolicyRuleAvgAggregateOutputType | null
    _sum: RetentionPolicyRuleSumAggregateOutputType | null
    _min: RetentionPolicyRuleMinAggregateOutputType | null
    _max: RetentionPolicyRuleMaxAggregateOutputType | null
  }

  type GetRetentionPolicyRuleGroupByPayload<T extends RetentionPolicyRuleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RetentionPolicyRuleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RetentionPolicyRuleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RetentionPolicyRuleGroupByOutputType[P]>
            : GetScalarType<T[P], RetentionPolicyRuleGroupByOutputType[P]>
        }
      >
    >


  export type RetentionPolicyRuleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    policyId?: boolean
    condition?: boolean
    action?: boolean
    priority?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    policy?: boolean | RetentionPolicyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["retentionPolicyRule"]>

  export type RetentionPolicyRuleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    policyId?: boolean
    condition?: boolean
    action?: boolean
    priority?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    policy?: boolean | RetentionPolicyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["retentionPolicyRule"]>

  export type RetentionPolicyRuleSelectScalar = {
    id?: boolean
    policyId?: boolean
    condition?: boolean
    action?: boolean
    priority?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RetentionPolicyRuleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    policy?: boolean | RetentionPolicyDefaultArgs<ExtArgs>
  }
  export type RetentionPolicyRuleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    policy?: boolean | RetentionPolicyDefaultArgs<ExtArgs>
  }

  export type $RetentionPolicyRulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RetentionPolicyRule"
    objects: {
      policy: Prisma.$RetentionPolicyPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      policyId: string
      condition: Prisma.JsonValue
      action: Prisma.JsonValue
      priority: number
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["retentionPolicyRule"]>
    composites: {}
  }

  type RetentionPolicyRuleGetPayload<S extends boolean | null | undefined | RetentionPolicyRuleDefaultArgs> = $Result.GetResult<Prisma.$RetentionPolicyRulePayload, S>

  type RetentionPolicyRuleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RetentionPolicyRuleFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RetentionPolicyRuleCountAggregateInputType | true
    }

  export interface RetentionPolicyRuleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RetentionPolicyRule'], meta: { name: 'RetentionPolicyRule' } }
    /**
     * Find zero or one RetentionPolicyRule that matches the filter.
     * @param {RetentionPolicyRuleFindUniqueArgs} args - Arguments to find a RetentionPolicyRule
     * @example
     * // Get one RetentionPolicyRule
     * const retentionPolicyRule = await prisma.retentionPolicyRule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RetentionPolicyRuleFindUniqueArgs>(args: SelectSubset<T, RetentionPolicyRuleFindUniqueArgs<ExtArgs>>): Prisma__RetentionPolicyRuleClient<$Result.GetResult<Prisma.$RetentionPolicyRulePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RetentionPolicyRule that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RetentionPolicyRuleFindUniqueOrThrowArgs} args - Arguments to find a RetentionPolicyRule
     * @example
     * // Get one RetentionPolicyRule
     * const retentionPolicyRule = await prisma.retentionPolicyRule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RetentionPolicyRuleFindUniqueOrThrowArgs>(args: SelectSubset<T, RetentionPolicyRuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RetentionPolicyRuleClient<$Result.GetResult<Prisma.$RetentionPolicyRulePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RetentionPolicyRule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetentionPolicyRuleFindFirstArgs} args - Arguments to find a RetentionPolicyRule
     * @example
     * // Get one RetentionPolicyRule
     * const retentionPolicyRule = await prisma.retentionPolicyRule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RetentionPolicyRuleFindFirstArgs>(args?: SelectSubset<T, RetentionPolicyRuleFindFirstArgs<ExtArgs>>): Prisma__RetentionPolicyRuleClient<$Result.GetResult<Prisma.$RetentionPolicyRulePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RetentionPolicyRule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetentionPolicyRuleFindFirstOrThrowArgs} args - Arguments to find a RetentionPolicyRule
     * @example
     * // Get one RetentionPolicyRule
     * const retentionPolicyRule = await prisma.retentionPolicyRule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RetentionPolicyRuleFindFirstOrThrowArgs>(args?: SelectSubset<T, RetentionPolicyRuleFindFirstOrThrowArgs<ExtArgs>>): Prisma__RetentionPolicyRuleClient<$Result.GetResult<Prisma.$RetentionPolicyRulePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RetentionPolicyRules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetentionPolicyRuleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RetentionPolicyRules
     * const retentionPolicyRules = await prisma.retentionPolicyRule.findMany()
     * 
     * // Get first 10 RetentionPolicyRules
     * const retentionPolicyRules = await prisma.retentionPolicyRule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const retentionPolicyRuleWithIdOnly = await prisma.retentionPolicyRule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RetentionPolicyRuleFindManyArgs>(args?: SelectSubset<T, RetentionPolicyRuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RetentionPolicyRulePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RetentionPolicyRule.
     * @param {RetentionPolicyRuleCreateArgs} args - Arguments to create a RetentionPolicyRule.
     * @example
     * // Create one RetentionPolicyRule
     * const RetentionPolicyRule = await prisma.retentionPolicyRule.create({
     *   data: {
     *     // ... data to create a RetentionPolicyRule
     *   }
     * })
     * 
     */
    create<T extends RetentionPolicyRuleCreateArgs>(args: SelectSubset<T, RetentionPolicyRuleCreateArgs<ExtArgs>>): Prisma__RetentionPolicyRuleClient<$Result.GetResult<Prisma.$RetentionPolicyRulePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RetentionPolicyRules.
     * @param {RetentionPolicyRuleCreateManyArgs} args - Arguments to create many RetentionPolicyRules.
     * @example
     * // Create many RetentionPolicyRules
     * const retentionPolicyRule = await prisma.retentionPolicyRule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RetentionPolicyRuleCreateManyArgs>(args?: SelectSubset<T, RetentionPolicyRuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RetentionPolicyRules and returns the data saved in the database.
     * @param {RetentionPolicyRuleCreateManyAndReturnArgs} args - Arguments to create many RetentionPolicyRules.
     * @example
     * // Create many RetentionPolicyRules
     * const retentionPolicyRule = await prisma.retentionPolicyRule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RetentionPolicyRules and only return the `id`
     * const retentionPolicyRuleWithIdOnly = await prisma.retentionPolicyRule.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RetentionPolicyRuleCreateManyAndReturnArgs>(args?: SelectSubset<T, RetentionPolicyRuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RetentionPolicyRulePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RetentionPolicyRule.
     * @param {RetentionPolicyRuleDeleteArgs} args - Arguments to delete one RetentionPolicyRule.
     * @example
     * // Delete one RetentionPolicyRule
     * const RetentionPolicyRule = await prisma.retentionPolicyRule.delete({
     *   where: {
     *     // ... filter to delete one RetentionPolicyRule
     *   }
     * })
     * 
     */
    delete<T extends RetentionPolicyRuleDeleteArgs>(args: SelectSubset<T, RetentionPolicyRuleDeleteArgs<ExtArgs>>): Prisma__RetentionPolicyRuleClient<$Result.GetResult<Prisma.$RetentionPolicyRulePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RetentionPolicyRule.
     * @param {RetentionPolicyRuleUpdateArgs} args - Arguments to update one RetentionPolicyRule.
     * @example
     * // Update one RetentionPolicyRule
     * const retentionPolicyRule = await prisma.retentionPolicyRule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RetentionPolicyRuleUpdateArgs>(args: SelectSubset<T, RetentionPolicyRuleUpdateArgs<ExtArgs>>): Prisma__RetentionPolicyRuleClient<$Result.GetResult<Prisma.$RetentionPolicyRulePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RetentionPolicyRules.
     * @param {RetentionPolicyRuleDeleteManyArgs} args - Arguments to filter RetentionPolicyRules to delete.
     * @example
     * // Delete a few RetentionPolicyRules
     * const { count } = await prisma.retentionPolicyRule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RetentionPolicyRuleDeleteManyArgs>(args?: SelectSubset<T, RetentionPolicyRuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RetentionPolicyRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetentionPolicyRuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RetentionPolicyRules
     * const retentionPolicyRule = await prisma.retentionPolicyRule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RetentionPolicyRuleUpdateManyArgs>(args: SelectSubset<T, RetentionPolicyRuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RetentionPolicyRule.
     * @param {RetentionPolicyRuleUpsertArgs} args - Arguments to update or create a RetentionPolicyRule.
     * @example
     * // Update or create a RetentionPolicyRule
     * const retentionPolicyRule = await prisma.retentionPolicyRule.upsert({
     *   create: {
     *     // ... data to create a RetentionPolicyRule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RetentionPolicyRule we want to update
     *   }
     * })
     */
    upsert<T extends RetentionPolicyRuleUpsertArgs>(args: SelectSubset<T, RetentionPolicyRuleUpsertArgs<ExtArgs>>): Prisma__RetentionPolicyRuleClient<$Result.GetResult<Prisma.$RetentionPolicyRulePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RetentionPolicyRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetentionPolicyRuleCountArgs} args - Arguments to filter RetentionPolicyRules to count.
     * @example
     * // Count the number of RetentionPolicyRules
     * const count = await prisma.retentionPolicyRule.count({
     *   where: {
     *     // ... the filter for the RetentionPolicyRules we want to count
     *   }
     * })
    **/
    count<T extends RetentionPolicyRuleCountArgs>(
      args?: Subset<T, RetentionPolicyRuleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RetentionPolicyRuleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RetentionPolicyRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetentionPolicyRuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RetentionPolicyRuleAggregateArgs>(args: Subset<T, RetentionPolicyRuleAggregateArgs>): Prisma.PrismaPromise<GetRetentionPolicyRuleAggregateType<T>>

    /**
     * Group by RetentionPolicyRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetentionPolicyRuleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RetentionPolicyRuleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RetentionPolicyRuleGroupByArgs['orderBy'] }
        : { orderBy?: RetentionPolicyRuleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RetentionPolicyRuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRetentionPolicyRuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RetentionPolicyRule model
   */
  readonly fields: RetentionPolicyRuleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RetentionPolicyRule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RetentionPolicyRuleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    policy<T extends RetentionPolicyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RetentionPolicyDefaultArgs<ExtArgs>>): Prisma__RetentionPolicyClient<$Result.GetResult<Prisma.$RetentionPolicyPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RetentionPolicyRule model
   */ 
  interface RetentionPolicyRuleFieldRefs {
    readonly id: FieldRef<"RetentionPolicyRule", 'String'>
    readonly policyId: FieldRef<"RetentionPolicyRule", 'String'>
    readonly condition: FieldRef<"RetentionPolicyRule", 'Json'>
    readonly action: FieldRef<"RetentionPolicyRule", 'Json'>
    readonly priority: FieldRef<"RetentionPolicyRule", 'Int'>
    readonly isActive: FieldRef<"RetentionPolicyRule", 'Boolean'>
    readonly createdAt: FieldRef<"RetentionPolicyRule", 'DateTime'>
    readonly updatedAt: FieldRef<"RetentionPolicyRule", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RetentionPolicyRule findUnique
   */
  export type RetentionPolicyRuleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicyRule
     */
    select?: RetentionPolicyRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyRuleInclude<ExtArgs> | null
    /**
     * Filter, which RetentionPolicyRule to fetch.
     */
    where: RetentionPolicyRuleWhereUniqueInput
  }

  /**
   * RetentionPolicyRule findUniqueOrThrow
   */
  export type RetentionPolicyRuleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicyRule
     */
    select?: RetentionPolicyRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyRuleInclude<ExtArgs> | null
    /**
     * Filter, which RetentionPolicyRule to fetch.
     */
    where: RetentionPolicyRuleWhereUniqueInput
  }

  /**
   * RetentionPolicyRule findFirst
   */
  export type RetentionPolicyRuleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicyRule
     */
    select?: RetentionPolicyRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyRuleInclude<ExtArgs> | null
    /**
     * Filter, which RetentionPolicyRule to fetch.
     */
    where?: RetentionPolicyRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetentionPolicyRules to fetch.
     */
    orderBy?: RetentionPolicyRuleOrderByWithRelationInput | RetentionPolicyRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RetentionPolicyRules.
     */
    cursor?: RetentionPolicyRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetentionPolicyRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetentionPolicyRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RetentionPolicyRules.
     */
    distinct?: RetentionPolicyRuleScalarFieldEnum | RetentionPolicyRuleScalarFieldEnum[]
  }

  /**
   * RetentionPolicyRule findFirstOrThrow
   */
  export type RetentionPolicyRuleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicyRule
     */
    select?: RetentionPolicyRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyRuleInclude<ExtArgs> | null
    /**
     * Filter, which RetentionPolicyRule to fetch.
     */
    where?: RetentionPolicyRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetentionPolicyRules to fetch.
     */
    orderBy?: RetentionPolicyRuleOrderByWithRelationInput | RetentionPolicyRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RetentionPolicyRules.
     */
    cursor?: RetentionPolicyRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetentionPolicyRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetentionPolicyRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RetentionPolicyRules.
     */
    distinct?: RetentionPolicyRuleScalarFieldEnum | RetentionPolicyRuleScalarFieldEnum[]
  }

  /**
   * RetentionPolicyRule findMany
   */
  export type RetentionPolicyRuleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicyRule
     */
    select?: RetentionPolicyRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyRuleInclude<ExtArgs> | null
    /**
     * Filter, which RetentionPolicyRules to fetch.
     */
    where?: RetentionPolicyRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetentionPolicyRules to fetch.
     */
    orderBy?: RetentionPolicyRuleOrderByWithRelationInput | RetentionPolicyRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RetentionPolicyRules.
     */
    cursor?: RetentionPolicyRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetentionPolicyRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetentionPolicyRules.
     */
    skip?: number
    distinct?: RetentionPolicyRuleScalarFieldEnum | RetentionPolicyRuleScalarFieldEnum[]
  }

  /**
   * RetentionPolicyRule create
   */
  export type RetentionPolicyRuleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicyRule
     */
    select?: RetentionPolicyRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyRuleInclude<ExtArgs> | null
    /**
     * The data needed to create a RetentionPolicyRule.
     */
    data: XOR<RetentionPolicyRuleCreateInput, RetentionPolicyRuleUncheckedCreateInput>
  }

  /**
   * RetentionPolicyRule createMany
   */
  export type RetentionPolicyRuleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RetentionPolicyRules.
     */
    data: RetentionPolicyRuleCreateManyInput | RetentionPolicyRuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RetentionPolicyRule createManyAndReturn
   */
  export type RetentionPolicyRuleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicyRule
     */
    select?: RetentionPolicyRuleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RetentionPolicyRules.
     */
    data: RetentionPolicyRuleCreateManyInput | RetentionPolicyRuleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyRuleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RetentionPolicyRule update
   */
  export type RetentionPolicyRuleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicyRule
     */
    select?: RetentionPolicyRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyRuleInclude<ExtArgs> | null
    /**
     * The data needed to update a RetentionPolicyRule.
     */
    data: XOR<RetentionPolicyRuleUpdateInput, RetentionPolicyRuleUncheckedUpdateInput>
    /**
     * Choose, which RetentionPolicyRule to update.
     */
    where: RetentionPolicyRuleWhereUniqueInput
  }

  /**
   * RetentionPolicyRule updateMany
   */
  export type RetentionPolicyRuleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RetentionPolicyRules.
     */
    data: XOR<RetentionPolicyRuleUpdateManyMutationInput, RetentionPolicyRuleUncheckedUpdateManyInput>
    /**
     * Filter which RetentionPolicyRules to update
     */
    where?: RetentionPolicyRuleWhereInput
  }

  /**
   * RetentionPolicyRule upsert
   */
  export type RetentionPolicyRuleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicyRule
     */
    select?: RetentionPolicyRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyRuleInclude<ExtArgs> | null
    /**
     * The filter to search for the RetentionPolicyRule to update in case it exists.
     */
    where: RetentionPolicyRuleWhereUniqueInput
    /**
     * In case the RetentionPolicyRule found by the `where` argument doesn't exist, create a new RetentionPolicyRule with this data.
     */
    create: XOR<RetentionPolicyRuleCreateInput, RetentionPolicyRuleUncheckedCreateInput>
    /**
     * In case the RetentionPolicyRule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RetentionPolicyRuleUpdateInput, RetentionPolicyRuleUncheckedUpdateInput>
  }

  /**
   * RetentionPolicyRule delete
   */
  export type RetentionPolicyRuleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicyRule
     */
    select?: RetentionPolicyRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyRuleInclude<ExtArgs> | null
    /**
     * Filter which RetentionPolicyRule to delete.
     */
    where: RetentionPolicyRuleWhereUniqueInput
  }

  /**
   * RetentionPolicyRule deleteMany
   */
  export type RetentionPolicyRuleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RetentionPolicyRules to delete
     */
    where?: RetentionPolicyRuleWhereInput
  }

  /**
   * RetentionPolicyRule without action
   */
  export type RetentionPolicyRuleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionPolicyRule
     */
    select?: RetentionPolicyRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RetentionPolicyRuleInclude<ExtArgs> | null
  }


  /**
   * Model LegalHold
   */

  export type AggregateLegalHold = {
    _count: LegalHoldCountAggregateOutputType | null
    _min: LegalHoldMinAggregateOutputType | null
    _max: LegalHoldMaxAggregateOutputType | null
  }

  export type LegalHoldMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    entityType: $Enums.EntityType | null
    isActive: boolean | null
    createdBy: string | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type LegalHoldMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    entityType: $Enums.EntityType | null
    isActive: boolean | null
    createdBy: string | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type LegalHoldCountAggregateOutputType = {
    id: number
    name: number
    description: number
    entityType: number
    entityIds: number
    fileIds: number
    isActive: number
    createdBy: number
    createdAt: number
    expiresAt: number
    _all: number
  }


  export type LegalHoldMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    entityType?: true
    isActive?: true
    createdBy?: true
    createdAt?: true
    expiresAt?: true
  }

  export type LegalHoldMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    entityType?: true
    isActive?: true
    createdBy?: true
    createdAt?: true
    expiresAt?: true
  }

  export type LegalHoldCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    entityType?: true
    entityIds?: true
    fileIds?: true
    isActive?: true
    createdBy?: true
    createdAt?: true
    expiresAt?: true
    _all?: true
  }

  export type LegalHoldAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LegalHold to aggregate.
     */
    where?: LegalHoldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LegalHolds to fetch.
     */
    orderBy?: LegalHoldOrderByWithRelationInput | LegalHoldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LegalHoldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LegalHolds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LegalHolds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LegalHolds
    **/
    _count?: true | LegalHoldCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LegalHoldMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LegalHoldMaxAggregateInputType
  }

  export type GetLegalHoldAggregateType<T extends LegalHoldAggregateArgs> = {
        [P in keyof T & keyof AggregateLegalHold]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLegalHold[P]>
      : GetScalarType<T[P], AggregateLegalHold[P]>
  }




  export type LegalHoldGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LegalHoldWhereInput
    orderBy?: LegalHoldOrderByWithAggregationInput | LegalHoldOrderByWithAggregationInput[]
    by: LegalHoldScalarFieldEnum[] | LegalHoldScalarFieldEnum
    having?: LegalHoldScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LegalHoldCountAggregateInputType | true
    _min?: LegalHoldMinAggregateInputType
    _max?: LegalHoldMaxAggregateInputType
  }

  export type LegalHoldGroupByOutputType = {
    id: string
    name: string
    description: string
    entityType: $Enums.EntityType | null
    entityIds: string[]
    fileIds: string[]
    isActive: boolean
    createdBy: string
    createdAt: Date
    expiresAt: Date | null
    _count: LegalHoldCountAggregateOutputType | null
    _min: LegalHoldMinAggregateOutputType | null
    _max: LegalHoldMaxAggregateOutputType | null
  }

  type GetLegalHoldGroupByPayload<T extends LegalHoldGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LegalHoldGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LegalHoldGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LegalHoldGroupByOutputType[P]>
            : GetScalarType<T[P], LegalHoldGroupByOutputType[P]>
        }
      >
    >


  export type LegalHoldSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    entityType?: boolean
    entityIds?: boolean
    fileIds?: boolean
    isActive?: boolean
    createdBy?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["legalHold"]>

  export type LegalHoldSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    entityType?: boolean
    entityIds?: boolean
    fileIds?: boolean
    isActive?: boolean
    createdBy?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["legalHold"]>

  export type LegalHoldSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    entityType?: boolean
    entityIds?: boolean
    fileIds?: boolean
    isActive?: boolean
    createdBy?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }


  export type $LegalHoldPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LegalHold"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string
      entityType: $Enums.EntityType | null
      entityIds: string[]
      fileIds: string[]
      isActive: boolean
      createdBy: string
      createdAt: Date
      expiresAt: Date | null
    }, ExtArgs["result"]["legalHold"]>
    composites: {}
  }

  type LegalHoldGetPayload<S extends boolean | null | undefined | LegalHoldDefaultArgs> = $Result.GetResult<Prisma.$LegalHoldPayload, S>

  type LegalHoldCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LegalHoldFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LegalHoldCountAggregateInputType | true
    }

  export interface LegalHoldDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LegalHold'], meta: { name: 'LegalHold' } }
    /**
     * Find zero or one LegalHold that matches the filter.
     * @param {LegalHoldFindUniqueArgs} args - Arguments to find a LegalHold
     * @example
     * // Get one LegalHold
     * const legalHold = await prisma.legalHold.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LegalHoldFindUniqueArgs>(args: SelectSubset<T, LegalHoldFindUniqueArgs<ExtArgs>>): Prisma__LegalHoldClient<$Result.GetResult<Prisma.$LegalHoldPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one LegalHold that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LegalHoldFindUniqueOrThrowArgs} args - Arguments to find a LegalHold
     * @example
     * // Get one LegalHold
     * const legalHold = await prisma.legalHold.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LegalHoldFindUniqueOrThrowArgs>(args: SelectSubset<T, LegalHoldFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LegalHoldClient<$Result.GetResult<Prisma.$LegalHoldPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first LegalHold that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LegalHoldFindFirstArgs} args - Arguments to find a LegalHold
     * @example
     * // Get one LegalHold
     * const legalHold = await prisma.legalHold.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LegalHoldFindFirstArgs>(args?: SelectSubset<T, LegalHoldFindFirstArgs<ExtArgs>>): Prisma__LegalHoldClient<$Result.GetResult<Prisma.$LegalHoldPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first LegalHold that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LegalHoldFindFirstOrThrowArgs} args - Arguments to find a LegalHold
     * @example
     * // Get one LegalHold
     * const legalHold = await prisma.legalHold.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LegalHoldFindFirstOrThrowArgs>(args?: SelectSubset<T, LegalHoldFindFirstOrThrowArgs<ExtArgs>>): Prisma__LegalHoldClient<$Result.GetResult<Prisma.$LegalHoldPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more LegalHolds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LegalHoldFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LegalHolds
     * const legalHolds = await prisma.legalHold.findMany()
     * 
     * // Get first 10 LegalHolds
     * const legalHolds = await prisma.legalHold.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const legalHoldWithIdOnly = await prisma.legalHold.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LegalHoldFindManyArgs>(args?: SelectSubset<T, LegalHoldFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LegalHoldPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a LegalHold.
     * @param {LegalHoldCreateArgs} args - Arguments to create a LegalHold.
     * @example
     * // Create one LegalHold
     * const LegalHold = await prisma.legalHold.create({
     *   data: {
     *     // ... data to create a LegalHold
     *   }
     * })
     * 
     */
    create<T extends LegalHoldCreateArgs>(args: SelectSubset<T, LegalHoldCreateArgs<ExtArgs>>): Prisma__LegalHoldClient<$Result.GetResult<Prisma.$LegalHoldPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many LegalHolds.
     * @param {LegalHoldCreateManyArgs} args - Arguments to create many LegalHolds.
     * @example
     * // Create many LegalHolds
     * const legalHold = await prisma.legalHold.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LegalHoldCreateManyArgs>(args?: SelectSubset<T, LegalHoldCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LegalHolds and returns the data saved in the database.
     * @param {LegalHoldCreateManyAndReturnArgs} args - Arguments to create many LegalHolds.
     * @example
     * // Create many LegalHolds
     * const legalHold = await prisma.legalHold.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LegalHolds and only return the `id`
     * const legalHoldWithIdOnly = await prisma.legalHold.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LegalHoldCreateManyAndReturnArgs>(args?: SelectSubset<T, LegalHoldCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LegalHoldPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a LegalHold.
     * @param {LegalHoldDeleteArgs} args - Arguments to delete one LegalHold.
     * @example
     * // Delete one LegalHold
     * const LegalHold = await prisma.legalHold.delete({
     *   where: {
     *     // ... filter to delete one LegalHold
     *   }
     * })
     * 
     */
    delete<T extends LegalHoldDeleteArgs>(args: SelectSubset<T, LegalHoldDeleteArgs<ExtArgs>>): Prisma__LegalHoldClient<$Result.GetResult<Prisma.$LegalHoldPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one LegalHold.
     * @param {LegalHoldUpdateArgs} args - Arguments to update one LegalHold.
     * @example
     * // Update one LegalHold
     * const legalHold = await prisma.legalHold.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LegalHoldUpdateArgs>(args: SelectSubset<T, LegalHoldUpdateArgs<ExtArgs>>): Prisma__LegalHoldClient<$Result.GetResult<Prisma.$LegalHoldPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more LegalHolds.
     * @param {LegalHoldDeleteManyArgs} args - Arguments to filter LegalHolds to delete.
     * @example
     * // Delete a few LegalHolds
     * const { count } = await prisma.legalHold.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LegalHoldDeleteManyArgs>(args?: SelectSubset<T, LegalHoldDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LegalHolds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LegalHoldUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LegalHolds
     * const legalHold = await prisma.legalHold.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LegalHoldUpdateManyArgs>(args: SelectSubset<T, LegalHoldUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LegalHold.
     * @param {LegalHoldUpsertArgs} args - Arguments to update or create a LegalHold.
     * @example
     * // Update or create a LegalHold
     * const legalHold = await prisma.legalHold.upsert({
     *   create: {
     *     // ... data to create a LegalHold
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LegalHold we want to update
     *   }
     * })
     */
    upsert<T extends LegalHoldUpsertArgs>(args: SelectSubset<T, LegalHoldUpsertArgs<ExtArgs>>): Prisma__LegalHoldClient<$Result.GetResult<Prisma.$LegalHoldPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of LegalHolds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LegalHoldCountArgs} args - Arguments to filter LegalHolds to count.
     * @example
     * // Count the number of LegalHolds
     * const count = await prisma.legalHold.count({
     *   where: {
     *     // ... the filter for the LegalHolds we want to count
     *   }
     * })
    **/
    count<T extends LegalHoldCountArgs>(
      args?: Subset<T, LegalHoldCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LegalHoldCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LegalHold.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LegalHoldAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LegalHoldAggregateArgs>(args: Subset<T, LegalHoldAggregateArgs>): Prisma.PrismaPromise<GetLegalHoldAggregateType<T>>

    /**
     * Group by LegalHold.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LegalHoldGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LegalHoldGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LegalHoldGroupByArgs['orderBy'] }
        : { orderBy?: LegalHoldGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LegalHoldGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLegalHoldGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LegalHold model
   */
  readonly fields: LegalHoldFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LegalHold.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LegalHoldClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LegalHold model
   */ 
  interface LegalHoldFieldRefs {
    readonly id: FieldRef<"LegalHold", 'String'>
    readonly name: FieldRef<"LegalHold", 'String'>
    readonly description: FieldRef<"LegalHold", 'String'>
    readonly entityType: FieldRef<"LegalHold", 'EntityType'>
    readonly entityIds: FieldRef<"LegalHold", 'String[]'>
    readonly fileIds: FieldRef<"LegalHold", 'String[]'>
    readonly isActive: FieldRef<"LegalHold", 'Boolean'>
    readonly createdBy: FieldRef<"LegalHold", 'String'>
    readonly createdAt: FieldRef<"LegalHold", 'DateTime'>
    readonly expiresAt: FieldRef<"LegalHold", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LegalHold findUnique
   */
  export type LegalHoldFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegalHold
     */
    select?: LegalHoldSelect<ExtArgs> | null
    /**
     * Filter, which LegalHold to fetch.
     */
    where: LegalHoldWhereUniqueInput
  }

  /**
   * LegalHold findUniqueOrThrow
   */
  export type LegalHoldFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegalHold
     */
    select?: LegalHoldSelect<ExtArgs> | null
    /**
     * Filter, which LegalHold to fetch.
     */
    where: LegalHoldWhereUniqueInput
  }

  /**
   * LegalHold findFirst
   */
  export type LegalHoldFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegalHold
     */
    select?: LegalHoldSelect<ExtArgs> | null
    /**
     * Filter, which LegalHold to fetch.
     */
    where?: LegalHoldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LegalHolds to fetch.
     */
    orderBy?: LegalHoldOrderByWithRelationInput | LegalHoldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LegalHolds.
     */
    cursor?: LegalHoldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LegalHolds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LegalHolds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LegalHolds.
     */
    distinct?: LegalHoldScalarFieldEnum | LegalHoldScalarFieldEnum[]
  }

  /**
   * LegalHold findFirstOrThrow
   */
  export type LegalHoldFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegalHold
     */
    select?: LegalHoldSelect<ExtArgs> | null
    /**
     * Filter, which LegalHold to fetch.
     */
    where?: LegalHoldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LegalHolds to fetch.
     */
    orderBy?: LegalHoldOrderByWithRelationInput | LegalHoldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LegalHolds.
     */
    cursor?: LegalHoldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LegalHolds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LegalHolds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LegalHolds.
     */
    distinct?: LegalHoldScalarFieldEnum | LegalHoldScalarFieldEnum[]
  }

  /**
   * LegalHold findMany
   */
  export type LegalHoldFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegalHold
     */
    select?: LegalHoldSelect<ExtArgs> | null
    /**
     * Filter, which LegalHolds to fetch.
     */
    where?: LegalHoldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LegalHolds to fetch.
     */
    orderBy?: LegalHoldOrderByWithRelationInput | LegalHoldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LegalHolds.
     */
    cursor?: LegalHoldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LegalHolds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LegalHolds.
     */
    skip?: number
    distinct?: LegalHoldScalarFieldEnum | LegalHoldScalarFieldEnum[]
  }

  /**
   * LegalHold create
   */
  export type LegalHoldCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegalHold
     */
    select?: LegalHoldSelect<ExtArgs> | null
    /**
     * The data needed to create a LegalHold.
     */
    data: XOR<LegalHoldCreateInput, LegalHoldUncheckedCreateInput>
  }

  /**
   * LegalHold createMany
   */
  export type LegalHoldCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LegalHolds.
     */
    data: LegalHoldCreateManyInput | LegalHoldCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LegalHold createManyAndReturn
   */
  export type LegalHoldCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegalHold
     */
    select?: LegalHoldSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many LegalHolds.
     */
    data: LegalHoldCreateManyInput | LegalHoldCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LegalHold update
   */
  export type LegalHoldUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegalHold
     */
    select?: LegalHoldSelect<ExtArgs> | null
    /**
     * The data needed to update a LegalHold.
     */
    data: XOR<LegalHoldUpdateInput, LegalHoldUncheckedUpdateInput>
    /**
     * Choose, which LegalHold to update.
     */
    where: LegalHoldWhereUniqueInput
  }

  /**
   * LegalHold updateMany
   */
  export type LegalHoldUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LegalHolds.
     */
    data: XOR<LegalHoldUpdateManyMutationInput, LegalHoldUncheckedUpdateManyInput>
    /**
     * Filter which LegalHolds to update
     */
    where?: LegalHoldWhereInput
  }

  /**
   * LegalHold upsert
   */
  export type LegalHoldUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegalHold
     */
    select?: LegalHoldSelect<ExtArgs> | null
    /**
     * The filter to search for the LegalHold to update in case it exists.
     */
    where: LegalHoldWhereUniqueInput
    /**
     * In case the LegalHold found by the `where` argument doesn't exist, create a new LegalHold with this data.
     */
    create: XOR<LegalHoldCreateInput, LegalHoldUncheckedCreateInput>
    /**
     * In case the LegalHold was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LegalHoldUpdateInput, LegalHoldUncheckedUpdateInput>
  }

  /**
   * LegalHold delete
   */
  export type LegalHoldDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegalHold
     */
    select?: LegalHoldSelect<ExtArgs> | null
    /**
     * Filter which LegalHold to delete.
     */
    where: LegalHoldWhereUniqueInput
  }

  /**
   * LegalHold deleteMany
   */
  export type LegalHoldDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LegalHolds to delete
     */
    where?: LegalHoldWhereInput
  }

  /**
   * LegalHold without action
   */
  export type LegalHoldDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegalHold
     */
    select?: LegalHoldSelect<ExtArgs> | null
  }


  /**
   * Model DataDeletionRequest
   */

  export type AggregateDataDeletionRequest = {
    _count: DataDeletionRequestCountAggregateOutputType | null
    _avg: DataDeletionRequestAvgAggregateOutputType | null
    _sum: DataDeletionRequestSumAggregateOutputType | null
    _min: DataDeletionRequestMinAggregateOutputType | null
    _max: DataDeletionRequestMaxAggregateOutputType | null
  }

  export type DataDeletionRequestAvgAggregateOutputType = {
    filesDeleted: number | null
  }

  export type DataDeletionRequestSumAggregateOutputType = {
    filesDeleted: number | null
  }

  export type DataDeletionRequestMinAggregateOutputType = {
    id: string | null
    requestType: $Enums.DataDeletionRequestType | null
    entityType: $Enums.EntityType | null
    entityId: string | null
    requestedBy: string | null
    status: $Enums.DeletionRequestStatus | null
    scheduledAt: Date | null
    processedAt: Date | null
    filesDeleted: number | null
    errorMessage: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DataDeletionRequestMaxAggregateOutputType = {
    id: string | null
    requestType: $Enums.DataDeletionRequestType | null
    entityType: $Enums.EntityType | null
    entityId: string | null
    requestedBy: string | null
    status: $Enums.DeletionRequestStatus | null
    scheduledAt: Date | null
    processedAt: Date | null
    filesDeleted: number | null
    errorMessage: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DataDeletionRequestCountAggregateOutputType = {
    id: number
    requestType: number
    entityType: number
    entityId: number
    requestedBy: number
    status: number
    scheduledAt: number
    processedAt: number
    filesDeleted: number
    errorMessage: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DataDeletionRequestAvgAggregateInputType = {
    filesDeleted?: true
  }

  export type DataDeletionRequestSumAggregateInputType = {
    filesDeleted?: true
  }

  export type DataDeletionRequestMinAggregateInputType = {
    id?: true
    requestType?: true
    entityType?: true
    entityId?: true
    requestedBy?: true
    status?: true
    scheduledAt?: true
    processedAt?: true
    filesDeleted?: true
    errorMessage?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DataDeletionRequestMaxAggregateInputType = {
    id?: true
    requestType?: true
    entityType?: true
    entityId?: true
    requestedBy?: true
    status?: true
    scheduledAt?: true
    processedAt?: true
    filesDeleted?: true
    errorMessage?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DataDeletionRequestCountAggregateInputType = {
    id?: true
    requestType?: true
    entityType?: true
    entityId?: true
    requestedBy?: true
    status?: true
    scheduledAt?: true
    processedAt?: true
    filesDeleted?: true
    errorMessage?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DataDeletionRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DataDeletionRequest to aggregate.
     */
    where?: DataDeletionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataDeletionRequests to fetch.
     */
    orderBy?: DataDeletionRequestOrderByWithRelationInput | DataDeletionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DataDeletionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataDeletionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataDeletionRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DataDeletionRequests
    **/
    _count?: true | DataDeletionRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DataDeletionRequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DataDeletionRequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DataDeletionRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DataDeletionRequestMaxAggregateInputType
  }

  export type GetDataDeletionRequestAggregateType<T extends DataDeletionRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateDataDeletionRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDataDeletionRequest[P]>
      : GetScalarType<T[P], AggregateDataDeletionRequest[P]>
  }




  export type DataDeletionRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DataDeletionRequestWhereInput
    orderBy?: DataDeletionRequestOrderByWithAggregationInput | DataDeletionRequestOrderByWithAggregationInput[]
    by: DataDeletionRequestScalarFieldEnum[] | DataDeletionRequestScalarFieldEnum
    having?: DataDeletionRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DataDeletionRequestCountAggregateInputType | true
    _avg?: DataDeletionRequestAvgAggregateInputType
    _sum?: DataDeletionRequestSumAggregateInputType
    _min?: DataDeletionRequestMinAggregateInputType
    _max?: DataDeletionRequestMaxAggregateInputType
  }

  export type DataDeletionRequestGroupByOutputType = {
    id: string
    requestType: $Enums.DataDeletionRequestType
    entityType: $Enums.EntityType
    entityId: string
    requestedBy: string
    status: $Enums.DeletionRequestStatus
    scheduledAt: Date
    processedAt: Date | null
    filesDeleted: number
    errorMessage: string | null
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: DataDeletionRequestCountAggregateOutputType | null
    _avg: DataDeletionRequestAvgAggregateOutputType | null
    _sum: DataDeletionRequestSumAggregateOutputType | null
    _min: DataDeletionRequestMinAggregateOutputType | null
    _max: DataDeletionRequestMaxAggregateOutputType | null
  }

  type GetDataDeletionRequestGroupByPayload<T extends DataDeletionRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DataDeletionRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DataDeletionRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DataDeletionRequestGroupByOutputType[P]>
            : GetScalarType<T[P], DataDeletionRequestGroupByOutputType[P]>
        }
      >
    >


  export type DataDeletionRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestType?: boolean
    entityType?: boolean
    entityId?: boolean
    requestedBy?: boolean
    status?: boolean
    scheduledAt?: boolean
    processedAt?: boolean
    filesDeleted?: boolean
    errorMessage?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["dataDeletionRequest"]>

  export type DataDeletionRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestType?: boolean
    entityType?: boolean
    entityId?: boolean
    requestedBy?: boolean
    status?: boolean
    scheduledAt?: boolean
    processedAt?: boolean
    filesDeleted?: boolean
    errorMessage?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["dataDeletionRequest"]>

  export type DataDeletionRequestSelectScalar = {
    id?: boolean
    requestType?: boolean
    entityType?: boolean
    entityId?: boolean
    requestedBy?: boolean
    status?: boolean
    scheduledAt?: boolean
    processedAt?: boolean
    filesDeleted?: boolean
    errorMessage?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $DataDeletionRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DataDeletionRequest"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      requestType: $Enums.DataDeletionRequestType
      entityType: $Enums.EntityType
      entityId: string
      requestedBy: string
      status: $Enums.DeletionRequestStatus
      scheduledAt: Date
      processedAt: Date | null
      filesDeleted: number
      errorMessage: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["dataDeletionRequest"]>
    composites: {}
  }

  type DataDeletionRequestGetPayload<S extends boolean | null | undefined | DataDeletionRequestDefaultArgs> = $Result.GetResult<Prisma.$DataDeletionRequestPayload, S>

  type DataDeletionRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DataDeletionRequestFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DataDeletionRequestCountAggregateInputType | true
    }

  export interface DataDeletionRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DataDeletionRequest'], meta: { name: 'DataDeletionRequest' } }
    /**
     * Find zero or one DataDeletionRequest that matches the filter.
     * @param {DataDeletionRequestFindUniqueArgs} args - Arguments to find a DataDeletionRequest
     * @example
     * // Get one DataDeletionRequest
     * const dataDeletionRequest = await prisma.dataDeletionRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DataDeletionRequestFindUniqueArgs>(args: SelectSubset<T, DataDeletionRequestFindUniqueArgs<ExtArgs>>): Prisma__DataDeletionRequestClient<$Result.GetResult<Prisma.$DataDeletionRequestPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DataDeletionRequest that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DataDeletionRequestFindUniqueOrThrowArgs} args - Arguments to find a DataDeletionRequest
     * @example
     * // Get one DataDeletionRequest
     * const dataDeletionRequest = await prisma.dataDeletionRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DataDeletionRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, DataDeletionRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DataDeletionRequestClient<$Result.GetResult<Prisma.$DataDeletionRequestPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DataDeletionRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataDeletionRequestFindFirstArgs} args - Arguments to find a DataDeletionRequest
     * @example
     * // Get one DataDeletionRequest
     * const dataDeletionRequest = await prisma.dataDeletionRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DataDeletionRequestFindFirstArgs>(args?: SelectSubset<T, DataDeletionRequestFindFirstArgs<ExtArgs>>): Prisma__DataDeletionRequestClient<$Result.GetResult<Prisma.$DataDeletionRequestPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DataDeletionRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataDeletionRequestFindFirstOrThrowArgs} args - Arguments to find a DataDeletionRequest
     * @example
     * // Get one DataDeletionRequest
     * const dataDeletionRequest = await prisma.dataDeletionRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DataDeletionRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, DataDeletionRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__DataDeletionRequestClient<$Result.GetResult<Prisma.$DataDeletionRequestPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DataDeletionRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataDeletionRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DataDeletionRequests
     * const dataDeletionRequests = await prisma.dataDeletionRequest.findMany()
     * 
     * // Get first 10 DataDeletionRequests
     * const dataDeletionRequests = await prisma.dataDeletionRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dataDeletionRequestWithIdOnly = await prisma.dataDeletionRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DataDeletionRequestFindManyArgs>(args?: SelectSubset<T, DataDeletionRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataDeletionRequestPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DataDeletionRequest.
     * @param {DataDeletionRequestCreateArgs} args - Arguments to create a DataDeletionRequest.
     * @example
     * // Create one DataDeletionRequest
     * const DataDeletionRequest = await prisma.dataDeletionRequest.create({
     *   data: {
     *     // ... data to create a DataDeletionRequest
     *   }
     * })
     * 
     */
    create<T extends DataDeletionRequestCreateArgs>(args: SelectSubset<T, DataDeletionRequestCreateArgs<ExtArgs>>): Prisma__DataDeletionRequestClient<$Result.GetResult<Prisma.$DataDeletionRequestPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DataDeletionRequests.
     * @param {DataDeletionRequestCreateManyArgs} args - Arguments to create many DataDeletionRequests.
     * @example
     * // Create many DataDeletionRequests
     * const dataDeletionRequest = await prisma.dataDeletionRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DataDeletionRequestCreateManyArgs>(args?: SelectSubset<T, DataDeletionRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DataDeletionRequests and returns the data saved in the database.
     * @param {DataDeletionRequestCreateManyAndReturnArgs} args - Arguments to create many DataDeletionRequests.
     * @example
     * // Create many DataDeletionRequests
     * const dataDeletionRequest = await prisma.dataDeletionRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DataDeletionRequests and only return the `id`
     * const dataDeletionRequestWithIdOnly = await prisma.dataDeletionRequest.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DataDeletionRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, DataDeletionRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataDeletionRequestPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DataDeletionRequest.
     * @param {DataDeletionRequestDeleteArgs} args - Arguments to delete one DataDeletionRequest.
     * @example
     * // Delete one DataDeletionRequest
     * const DataDeletionRequest = await prisma.dataDeletionRequest.delete({
     *   where: {
     *     // ... filter to delete one DataDeletionRequest
     *   }
     * })
     * 
     */
    delete<T extends DataDeletionRequestDeleteArgs>(args: SelectSubset<T, DataDeletionRequestDeleteArgs<ExtArgs>>): Prisma__DataDeletionRequestClient<$Result.GetResult<Prisma.$DataDeletionRequestPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DataDeletionRequest.
     * @param {DataDeletionRequestUpdateArgs} args - Arguments to update one DataDeletionRequest.
     * @example
     * // Update one DataDeletionRequest
     * const dataDeletionRequest = await prisma.dataDeletionRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DataDeletionRequestUpdateArgs>(args: SelectSubset<T, DataDeletionRequestUpdateArgs<ExtArgs>>): Prisma__DataDeletionRequestClient<$Result.GetResult<Prisma.$DataDeletionRequestPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DataDeletionRequests.
     * @param {DataDeletionRequestDeleteManyArgs} args - Arguments to filter DataDeletionRequests to delete.
     * @example
     * // Delete a few DataDeletionRequests
     * const { count } = await prisma.dataDeletionRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DataDeletionRequestDeleteManyArgs>(args?: SelectSubset<T, DataDeletionRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DataDeletionRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataDeletionRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DataDeletionRequests
     * const dataDeletionRequest = await prisma.dataDeletionRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DataDeletionRequestUpdateManyArgs>(args: SelectSubset<T, DataDeletionRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DataDeletionRequest.
     * @param {DataDeletionRequestUpsertArgs} args - Arguments to update or create a DataDeletionRequest.
     * @example
     * // Update or create a DataDeletionRequest
     * const dataDeletionRequest = await prisma.dataDeletionRequest.upsert({
     *   create: {
     *     // ... data to create a DataDeletionRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DataDeletionRequest we want to update
     *   }
     * })
     */
    upsert<T extends DataDeletionRequestUpsertArgs>(args: SelectSubset<T, DataDeletionRequestUpsertArgs<ExtArgs>>): Prisma__DataDeletionRequestClient<$Result.GetResult<Prisma.$DataDeletionRequestPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DataDeletionRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataDeletionRequestCountArgs} args - Arguments to filter DataDeletionRequests to count.
     * @example
     * // Count the number of DataDeletionRequests
     * const count = await prisma.dataDeletionRequest.count({
     *   where: {
     *     // ... the filter for the DataDeletionRequests we want to count
     *   }
     * })
    **/
    count<T extends DataDeletionRequestCountArgs>(
      args?: Subset<T, DataDeletionRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DataDeletionRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DataDeletionRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataDeletionRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DataDeletionRequestAggregateArgs>(args: Subset<T, DataDeletionRequestAggregateArgs>): Prisma.PrismaPromise<GetDataDeletionRequestAggregateType<T>>

    /**
     * Group by DataDeletionRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataDeletionRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DataDeletionRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DataDeletionRequestGroupByArgs['orderBy'] }
        : { orderBy?: DataDeletionRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DataDeletionRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDataDeletionRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DataDeletionRequest model
   */
  readonly fields: DataDeletionRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DataDeletionRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DataDeletionRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DataDeletionRequest model
   */ 
  interface DataDeletionRequestFieldRefs {
    readonly id: FieldRef<"DataDeletionRequest", 'String'>
    readonly requestType: FieldRef<"DataDeletionRequest", 'DataDeletionRequestType'>
    readonly entityType: FieldRef<"DataDeletionRequest", 'EntityType'>
    readonly entityId: FieldRef<"DataDeletionRequest", 'String'>
    readonly requestedBy: FieldRef<"DataDeletionRequest", 'String'>
    readonly status: FieldRef<"DataDeletionRequest", 'DeletionRequestStatus'>
    readonly scheduledAt: FieldRef<"DataDeletionRequest", 'DateTime'>
    readonly processedAt: FieldRef<"DataDeletionRequest", 'DateTime'>
    readonly filesDeleted: FieldRef<"DataDeletionRequest", 'Int'>
    readonly errorMessage: FieldRef<"DataDeletionRequest", 'String'>
    readonly metadata: FieldRef<"DataDeletionRequest", 'Json'>
    readonly createdAt: FieldRef<"DataDeletionRequest", 'DateTime'>
    readonly updatedAt: FieldRef<"DataDeletionRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DataDeletionRequest findUnique
   */
  export type DataDeletionRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataDeletionRequest
     */
    select?: DataDeletionRequestSelect<ExtArgs> | null
    /**
     * Filter, which DataDeletionRequest to fetch.
     */
    where: DataDeletionRequestWhereUniqueInput
  }

  /**
   * DataDeletionRequest findUniqueOrThrow
   */
  export type DataDeletionRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataDeletionRequest
     */
    select?: DataDeletionRequestSelect<ExtArgs> | null
    /**
     * Filter, which DataDeletionRequest to fetch.
     */
    where: DataDeletionRequestWhereUniqueInput
  }

  /**
   * DataDeletionRequest findFirst
   */
  export type DataDeletionRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataDeletionRequest
     */
    select?: DataDeletionRequestSelect<ExtArgs> | null
    /**
     * Filter, which DataDeletionRequest to fetch.
     */
    where?: DataDeletionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataDeletionRequests to fetch.
     */
    orderBy?: DataDeletionRequestOrderByWithRelationInput | DataDeletionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DataDeletionRequests.
     */
    cursor?: DataDeletionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataDeletionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataDeletionRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DataDeletionRequests.
     */
    distinct?: DataDeletionRequestScalarFieldEnum | DataDeletionRequestScalarFieldEnum[]
  }

  /**
   * DataDeletionRequest findFirstOrThrow
   */
  export type DataDeletionRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataDeletionRequest
     */
    select?: DataDeletionRequestSelect<ExtArgs> | null
    /**
     * Filter, which DataDeletionRequest to fetch.
     */
    where?: DataDeletionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataDeletionRequests to fetch.
     */
    orderBy?: DataDeletionRequestOrderByWithRelationInput | DataDeletionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DataDeletionRequests.
     */
    cursor?: DataDeletionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataDeletionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataDeletionRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DataDeletionRequests.
     */
    distinct?: DataDeletionRequestScalarFieldEnum | DataDeletionRequestScalarFieldEnum[]
  }

  /**
   * DataDeletionRequest findMany
   */
  export type DataDeletionRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataDeletionRequest
     */
    select?: DataDeletionRequestSelect<ExtArgs> | null
    /**
     * Filter, which DataDeletionRequests to fetch.
     */
    where?: DataDeletionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataDeletionRequests to fetch.
     */
    orderBy?: DataDeletionRequestOrderByWithRelationInput | DataDeletionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DataDeletionRequests.
     */
    cursor?: DataDeletionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataDeletionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataDeletionRequests.
     */
    skip?: number
    distinct?: DataDeletionRequestScalarFieldEnum | DataDeletionRequestScalarFieldEnum[]
  }

  /**
   * DataDeletionRequest create
   */
  export type DataDeletionRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataDeletionRequest
     */
    select?: DataDeletionRequestSelect<ExtArgs> | null
    /**
     * The data needed to create a DataDeletionRequest.
     */
    data: XOR<DataDeletionRequestCreateInput, DataDeletionRequestUncheckedCreateInput>
  }

  /**
   * DataDeletionRequest createMany
   */
  export type DataDeletionRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DataDeletionRequests.
     */
    data: DataDeletionRequestCreateManyInput | DataDeletionRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DataDeletionRequest createManyAndReturn
   */
  export type DataDeletionRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataDeletionRequest
     */
    select?: DataDeletionRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DataDeletionRequests.
     */
    data: DataDeletionRequestCreateManyInput | DataDeletionRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DataDeletionRequest update
   */
  export type DataDeletionRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataDeletionRequest
     */
    select?: DataDeletionRequestSelect<ExtArgs> | null
    /**
     * The data needed to update a DataDeletionRequest.
     */
    data: XOR<DataDeletionRequestUpdateInput, DataDeletionRequestUncheckedUpdateInput>
    /**
     * Choose, which DataDeletionRequest to update.
     */
    where: DataDeletionRequestWhereUniqueInput
  }

  /**
   * DataDeletionRequest updateMany
   */
  export type DataDeletionRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DataDeletionRequests.
     */
    data: XOR<DataDeletionRequestUpdateManyMutationInput, DataDeletionRequestUncheckedUpdateManyInput>
    /**
     * Filter which DataDeletionRequests to update
     */
    where?: DataDeletionRequestWhereInput
  }

  /**
   * DataDeletionRequest upsert
   */
  export type DataDeletionRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataDeletionRequest
     */
    select?: DataDeletionRequestSelect<ExtArgs> | null
    /**
     * The filter to search for the DataDeletionRequest to update in case it exists.
     */
    where: DataDeletionRequestWhereUniqueInput
    /**
     * In case the DataDeletionRequest found by the `where` argument doesn't exist, create a new DataDeletionRequest with this data.
     */
    create: XOR<DataDeletionRequestCreateInput, DataDeletionRequestUncheckedCreateInput>
    /**
     * In case the DataDeletionRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DataDeletionRequestUpdateInput, DataDeletionRequestUncheckedUpdateInput>
  }

  /**
   * DataDeletionRequest delete
   */
  export type DataDeletionRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataDeletionRequest
     */
    select?: DataDeletionRequestSelect<ExtArgs> | null
    /**
     * Filter which DataDeletionRequest to delete.
     */
    where: DataDeletionRequestWhereUniqueInput
  }

  /**
   * DataDeletionRequest deleteMany
   */
  export type DataDeletionRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DataDeletionRequests to delete
     */
    where?: DataDeletionRequestWhereInput
  }

  /**
   * DataDeletionRequest without action
   */
  export type DataDeletionRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataDeletionRequest
     */
    select?: DataDeletionRequestSelect<ExtArgs> | null
  }


  /**
   * Model RetentionAuditLog
   */

  export type AggregateRetentionAuditLog = {
    _count: RetentionAuditLogCountAggregateOutputType | null
    _min: RetentionAuditLogMinAggregateOutputType | null
    _max: RetentionAuditLogMaxAggregateOutputType | null
  }

  export type RetentionAuditLogMinAggregateOutputType = {
    id: string | null
    fileId: string | null
    entityType: $Enums.EntityType | null
    entityId: string | null
    action: $Enums.RetentionAuditAction | null
    performedBy: string | null
    createdAt: Date | null
  }

  export type RetentionAuditLogMaxAggregateOutputType = {
    id: string | null
    fileId: string | null
    entityType: $Enums.EntityType | null
    entityId: string | null
    action: $Enums.RetentionAuditAction | null
    performedBy: string | null
    createdAt: Date | null
  }

  export type RetentionAuditLogCountAggregateOutputType = {
    id: number
    fileId: number
    entityType: number
    entityId: number
    action: number
    details: number
    performedBy: number
    createdAt: number
    _all: number
  }


  export type RetentionAuditLogMinAggregateInputType = {
    id?: true
    fileId?: true
    entityType?: true
    entityId?: true
    action?: true
    performedBy?: true
    createdAt?: true
  }

  export type RetentionAuditLogMaxAggregateInputType = {
    id?: true
    fileId?: true
    entityType?: true
    entityId?: true
    action?: true
    performedBy?: true
    createdAt?: true
  }

  export type RetentionAuditLogCountAggregateInputType = {
    id?: true
    fileId?: true
    entityType?: true
    entityId?: true
    action?: true
    details?: true
    performedBy?: true
    createdAt?: true
    _all?: true
  }

  export type RetentionAuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RetentionAuditLog to aggregate.
     */
    where?: RetentionAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetentionAuditLogs to fetch.
     */
    orderBy?: RetentionAuditLogOrderByWithRelationInput | RetentionAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RetentionAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetentionAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetentionAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RetentionAuditLogs
    **/
    _count?: true | RetentionAuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RetentionAuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RetentionAuditLogMaxAggregateInputType
  }

  export type GetRetentionAuditLogAggregateType<T extends RetentionAuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateRetentionAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRetentionAuditLog[P]>
      : GetScalarType<T[P], AggregateRetentionAuditLog[P]>
  }




  export type RetentionAuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RetentionAuditLogWhereInput
    orderBy?: RetentionAuditLogOrderByWithAggregationInput | RetentionAuditLogOrderByWithAggregationInput[]
    by: RetentionAuditLogScalarFieldEnum[] | RetentionAuditLogScalarFieldEnum
    having?: RetentionAuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RetentionAuditLogCountAggregateInputType | true
    _min?: RetentionAuditLogMinAggregateInputType
    _max?: RetentionAuditLogMaxAggregateInputType
  }

  export type RetentionAuditLogGroupByOutputType = {
    id: string
    fileId: string | null
    entityType: $Enums.EntityType | null
    entityId: string | null
    action: $Enums.RetentionAuditAction
    details: JsonValue
    performedBy: string | null
    createdAt: Date
    _count: RetentionAuditLogCountAggregateOutputType | null
    _min: RetentionAuditLogMinAggregateOutputType | null
    _max: RetentionAuditLogMaxAggregateOutputType | null
  }

  type GetRetentionAuditLogGroupByPayload<T extends RetentionAuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RetentionAuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RetentionAuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RetentionAuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], RetentionAuditLogGroupByOutputType[P]>
        }
      >
    >


  export type RetentionAuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileId?: boolean
    entityType?: boolean
    entityId?: boolean
    action?: boolean
    details?: boolean
    performedBy?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["retentionAuditLog"]>

  export type RetentionAuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileId?: boolean
    entityType?: boolean
    entityId?: boolean
    action?: boolean
    details?: boolean
    performedBy?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["retentionAuditLog"]>

  export type RetentionAuditLogSelectScalar = {
    id?: boolean
    fileId?: boolean
    entityType?: boolean
    entityId?: boolean
    action?: boolean
    details?: boolean
    performedBy?: boolean
    createdAt?: boolean
  }


  export type $RetentionAuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RetentionAuditLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fileId: string | null
      entityType: $Enums.EntityType | null
      entityId: string | null
      action: $Enums.RetentionAuditAction
      details: Prisma.JsonValue
      performedBy: string | null
      createdAt: Date
    }, ExtArgs["result"]["retentionAuditLog"]>
    composites: {}
  }

  type RetentionAuditLogGetPayload<S extends boolean | null | undefined | RetentionAuditLogDefaultArgs> = $Result.GetResult<Prisma.$RetentionAuditLogPayload, S>

  type RetentionAuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RetentionAuditLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RetentionAuditLogCountAggregateInputType | true
    }

  export interface RetentionAuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RetentionAuditLog'], meta: { name: 'RetentionAuditLog' } }
    /**
     * Find zero or one RetentionAuditLog that matches the filter.
     * @param {RetentionAuditLogFindUniqueArgs} args - Arguments to find a RetentionAuditLog
     * @example
     * // Get one RetentionAuditLog
     * const retentionAuditLog = await prisma.retentionAuditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RetentionAuditLogFindUniqueArgs>(args: SelectSubset<T, RetentionAuditLogFindUniqueArgs<ExtArgs>>): Prisma__RetentionAuditLogClient<$Result.GetResult<Prisma.$RetentionAuditLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RetentionAuditLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RetentionAuditLogFindUniqueOrThrowArgs} args - Arguments to find a RetentionAuditLog
     * @example
     * // Get one RetentionAuditLog
     * const retentionAuditLog = await prisma.retentionAuditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RetentionAuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, RetentionAuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RetentionAuditLogClient<$Result.GetResult<Prisma.$RetentionAuditLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RetentionAuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetentionAuditLogFindFirstArgs} args - Arguments to find a RetentionAuditLog
     * @example
     * // Get one RetentionAuditLog
     * const retentionAuditLog = await prisma.retentionAuditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RetentionAuditLogFindFirstArgs>(args?: SelectSubset<T, RetentionAuditLogFindFirstArgs<ExtArgs>>): Prisma__RetentionAuditLogClient<$Result.GetResult<Prisma.$RetentionAuditLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RetentionAuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetentionAuditLogFindFirstOrThrowArgs} args - Arguments to find a RetentionAuditLog
     * @example
     * // Get one RetentionAuditLog
     * const retentionAuditLog = await prisma.retentionAuditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RetentionAuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, RetentionAuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__RetentionAuditLogClient<$Result.GetResult<Prisma.$RetentionAuditLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RetentionAuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetentionAuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RetentionAuditLogs
     * const retentionAuditLogs = await prisma.retentionAuditLog.findMany()
     * 
     * // Get first 10 RetentionAuditLogs
     * const retentionAuditLogs = await prisma.retentionAuditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const retentionAuditLogWithIdOnly = await prisma.retentionAuditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RetentionAuditLogFindManyArgs>(args?: SelectSubset<T, RetentionAuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RetentionAuditLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RetentionAuditLog.
     * @param {RetentionAuditLogCreateArgs} args - Arguments to create a RetentionAuditLog.
     * @example
     * // Create one RetentionAuditLog
     * const RetentionAuditLog = await prisma.retentionAuditLog.create({
     *   data: {
     *     // ... data to create a RetentionAuditLog
     *   }
     * })
     * 
     */
    create<T extends RetentionAuditLogCreateArgs>(args: SelectSubset<T, RetentionAuditLogCreateArgs<ExtArgs>>): Prisma__RetentionAuditLogClient<$Result.GetResult<Prisma.$RetentionAuditLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RetentionAuditLogs.
     * @param {RetentionAuditLogCreateManyArgs} args - Arguments to create many RetentionAuditLogs.
     * @example
     * // Create many RetentionAuditLogs
     * const retentionAuditLog = await prisma.retentionAuditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RetentionAuditLogCreateManyArgs>(args?: SelectSubset<T, RetentionAuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RetentionAuditLogs and returns the data saved in the database.
     * @param {RetentionAuditLogCreateManyAndReturnArgs} args - Arguments to create many RetentionAuditLogs.
     * @example
     * // Create many RetentionAuditLogs
     * const retentionAuditLog = await prisma.retentionAuditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RetentionAuditLogs and only return the `id`
     * const retentionAuditLogWithIdOnly = await prisma.retentionAuditLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RetentionAuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, RetentionAuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RetentionAuditLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RetentionAuditLog.
     * @param {RetentionAuditLogDeleteArgs} args - Arguments to delete one RetentionAuditLog.
     * @example
     * // Delete one RetentionAuditLog
     * const RetentionAuditLog = await prisma.retentionAuditLog.delete({
     *   where: {
     *     // ... filter to delete one RetentionAuditLog
     *   }
     * })
     * 
     */
    delete<T extends RetentionAuditLogDeleteArgs>(args: SelectSubset<T, RetentionAuditLogDeleteArgs<ExtArgs>>): Prisma__RetentionAuditLogClient<$Result.GetResult<Prisma.$RetentionAuditLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RetentionAuditLog.
     * @param {RetentionAuditLogUpdateArgs} args - Arguments to update one RetentionAuditLog.
     * @example
     * // Update one RetentionAuditLog
     * const retentionAuditLog = await prisma.retentionAuditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RetentionAuditLogUpdateArgs>(args: SelectSubset<T, RetentionAuditLogUpdateArgs<ExtArgs>>): Prisma__RetentionAuditLogClient<$Result.GetResult<Prisma.$RetentionAuditLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RetentionAuditLogs.
     * @param {RetentionAuditLogDeleteManyArgs} args - Arguments to filter RetentionAuditLogs to delete.
     * @example
     * // Delete a few RetentionAuditLogs
     * const { count } = await prisma.retentionAuditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RetentionAuditLogDeleteManyArgs>(args?: SelectSubset<T, RetentionAuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RetentionAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetentionAuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RetentionAuditLogs
     * const retentionAuditLog = await prisma.retentionAuditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RetentionAuditLogUpdateManyArgs>(args: SelectSubset<T, RetentionAuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RetentionAuditLog.
     * @param {RetentionAuditLogUpsertArgs} args - Arguments to update or create a RetentionAuditLog.
     * @example
     * // Update or create a RetentionAuditLog
     * const retentionAuditLog = await prisma.retentionAuditLog.upsert({
     *   create: {
     *     // ... data to create a RetentionAuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RetentionAuditLog we want to update
     *   }
     * })
     */
    upsert<T extends RetentionAuditLogUpsertArgs>(args: SelectSubset<T, RetentionAuditLogUpsertArgs<ExtArgs>>): Prisma__RetentionAuditLogClient<$Result.GetResult<Prisma.$RetentionAuditLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RetentionAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetentionAuditLogCountArgs} args - Arguments to filter RetentionAuditLogs to count.
     * @example
     * // Count the number of RetentionAuditLogs
     * const count = await prisma.retentionAuditLog.count({
     *   where: {
     *     // ... the filter for the RetentionAuditLogs we want to count
     *   }
     * })
    **/
    count<T extends RetentionAuditLogCountArgs>(
      args?: Subset<T, RetentionAuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RetentionAuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RetentionAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetentionAuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RetentionAuditLogAggregateArgs>(args: Subset<T, RetentionAuditLogAggregateArgs>): Prisma.PrismaPromise<GetRetentionAuditLogAggregateType<T>>

    /**
     * Group by RetentionAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetentionAuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RetentionAuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RetentionAuditLogGroupByArgs['orderBy'] }
        : { orderBy?: RetentionAuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RetentionAuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRetentionAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RetentionAuditLog model
   */
  readonly fields: RetentionAuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RetentionAuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RetentionAuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RetentionAuditLog model
   */ 
  interface RetentionAuditLogFieldRefs {
    readonly id: FieldRef<"RetentionAuditLog", 'String'>
    readonly fileId: FieldRef<"RetentionAuditLog", 'String'>
    readonly entityType: FieldRef<"RetentionAuditLog", 'EntityType'>
    readonly entityId: FieldRef<"RetentionAuditLog", 'String'>
    readonly action: FieldRef<"RetentionAuditLog", 'RetentionAuditAction'>
    readonly details: FieldRef<"RetentionAuditLog", 'Json'>
    readonly performedBy: FieldRef<"RetentionAuditLog", 'String'>
    readonly createdAt: FieldRef<"RetentionAuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RetentionAuditLog findUnique
   */
  export type RetentionAuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionAuditLog
     */
    select?: RetentionAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which RetentionAuditLog to fetch.
     */
    where: RetentionAuditLogWhereUniqueInput
  }

  /**
   * RetentionAuditLog findUniqueOrThrow
   */
  export type RetentionAuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionAuditLog
     */
    select?: RetentionAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which RetentionAuditLog to fetch.
     */
    where: RetentionAuditLogWhereUniqueInput
  }

  /**
   * RetentionAuditLog findFirst
   */
  export type RetentionAuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionAuditLog
     */
    select?: RetentionAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which RetentionAuditLog to fetch.
     */
    where?: RetentionAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetentionAuditLogs to fetch.
     */
    orderBy?: RetentionAuditLogOrderByWithRelationInput | RetentionAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RetentionAuditLogs.
     */
    cursor?: RetentionAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetentionAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetentionAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RetentionAuditLogs.
     */
    distinct?: RetentionAuditLogScalarFieldEnum | RetentionAuditLogScalarFieldEnum[]
  }

  /**
   * RetentionAuditLog findFirstOrThrow
   */
  export type RetentionAuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionAuditLog
     */
    select?: RetentionAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which RetentionAuditLog to fetch.
     */
    where?: RetentionAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetentionAuditLogs to fetch.
     */
    orderBy?: RetentionAuditLogOrderByWithRelationInput | RetentionAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RetentionAuditLogs.
     */
    cursor?: RetentionAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetentionAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetentionAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RetentionAuditLogs.
     */
    distinct?: RetentionAuditLogScalarFieldEnum | RetentionAuditLogScalarFieldEnum[]
  }

  /**
   * RetentionAuditLog findMany
   */
  export type RetentionAuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionAuditLog
     */
    select?: RetentionAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which RetentionAuditLogs to fetch.
     */
    where?: RetentionAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetentionAuditLogs to fetch.
     */
    orderBy?: RetentionAuditLogOrderByWithRelationInput | RetentionAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RetentionAuditLogs.
     */
    cursor?: RetentionAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetentionAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetentionAuditLogs.
     */
    skip?: number
    distinct?: RetentionAuditLogScalarFieldEnum | RetentionAuditLogScalarFieldEnum[]
  }

  /**
   * RetentionAuditLog create
   */
  export type RetentionAuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionAuditLog
     */
    select?: RetentionAuditLogSelect<ExtArgs> | null
    /**
     * The data needed to create a RetentionAuditLog.
     */
    data: XOR<RetentionAuditLogCreateInput, RetentionAuditLogUncheckedCreateInput>
  }

  /**
   * RetentionAuditLog createMany
   */
  export type RetentionAuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RetentionAuditLogs.
     */
    data: RetentionAuditLogCreateManyInput | RetentionAuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RetentionAuditLog createManyAndReturn
   */
  export type RetentionAuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionAuditLog
     */
    select?: RetentionAuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RetentionAuditLogs.
     */
    data: RetentionAuditLogCreateManyInput | RetentionAuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RetentionAuditLog update
   */
  export type RetentionAuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionAuditLog
     */
    select?: RetentionAuditLogSelect<ExtArgs> | null
    /**
     * The data needed to update a RetentionAuditLog.
     */
    data: XOR<RetentionAuditLogUpdateInput, RetentionAuditLogUncheckedUpdateInput>
    /**
     * Choose, which RetentionAuditLog to update.
     */
    where: RetentionAuditLogWhereUniqueInput
  }

  /**
   * RetentionAuditLog updateMany
   */
  export type RetentionAuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RetentionAuditLogs.
     */
    data: XOR<RetentionAuditLogUpdateManyMutationInput, RetentionAuditLogUncheckedUpdateManyInput>
    /**
     * Filter which RetentionAuditLogs to update
     */
    where?: RetentionAuditLogWhereInput
  }

  /**
   * RetentionAuditLog upsert
   */
  export type RetentionAuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionAuditLog
     */
    select?: RetentionAuditLogSelect<ExtArgs> | null
    /**
     * The filter to search for the RetentionAuditLog to update in case it exists.
     */
    where: RetentionAuditLogWhereUniqueInput
    /**
     * In case the RetentionAuditLog found by the `where` argument doesn't exist, create a new RetentionAuditLog with this data.
     */
    create: XOR<RetentionAuditLogCreateInput, RetentionAuditLogUncheckedCreateInput>
    /**
     * In case the RetentionAuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RetentionAuditLogUpdateInput, RetentionAuditLogUncheckedUpdateInput>
  }

  /**
   * RetentionAuditLog delete
   */
  export type RetentionAuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionAuditLog
     */
    select?: RetentionAuditLogSelect<ExtArgs> | null
    /**
     * Filter which RetentionAuditLog to delete.
     */
    where: RetentionAuditLogWhereUniqueInput
  }

  /**
   * RetentionAuditLog deleteMany
   */
  export type RetentionAuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RetentionAuditLogs to delete
     */
    where?: RetentionAuditLogWhereInput
  }

  /**
   * RetentionAuditLog without action
   */
  export type RetentionAuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetentionAuditLog
     */
    select?: RetentionAuditLogSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const FileMetadataScalarFieldEnum: {
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

  export type FileMetadataScalarFieldEnum = (typeof FileMetadataScalarFieldEnum)[keyof typeof FileMetadataScalarFieldEnum]


  export const FileRelationshipScalarFieldEnum: {
    id: 'id',
    parentId: 'parentId',
    childId: 'childId',
    relationshipType: 'relationshipType',
    createdAt: 'createdAt'
  };

  export type FileRelationshipScalarFieldEnum = (typeof FileRelationshipScalarFieldEnum)[keyof typeof FileRelationshipScalarFieldEnum]


  export const UploadSessionScalarFieldEnum: {
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

  export type UploadSessionScalarFieldEnum = (typeof UploadSessionScalarFieldEnum)[keyof typeof UploadSessionScalarFieldEnum]


  export const UploadSessionFileScalarFieldEnum: {
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

  export type UploadSessionFileScalarFieldEnum = (typeof UploadSessionFileScalarFieldEnum)[keyof typeof UploadSessionFileScalarFieldEnum]


  export const ProcessingJobScalarFieldEnum: {
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

  export type ProcessingJobScalarFieldEnum = (typeof ProcessingJobScalarFieldEnum)[keyof typeof ProcessingJobScalarFieldEnum]


  export const AccessLogScalarFieldEnum: {
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

  export type AccessLogScalarFieldEnum = (typeof AccessLogScalarFieldEnum)[keyof typeof AccessLogScalarFieldEnum]


  export const StorageQuotaScalarFieldEnum: {
    id: 'id',
    entityType: 'entityType',
    entityId: 'entityId',
    quotaBytes: 'quotaBytes',
    usedBytes: 'usedBytes',
    fileCount: 'fileCount',
    lastUpdated: 'lastUpdated',
    createdAt: 'createdAt'
  };

  export type StorageQuotaScalarFieldEnum = (typeof StorageQuotaScalarFieldEnum)[keyof typeof StorageQuotaScalarFieldEnum]


  export const RetentionPolicyScalarFieldEnum: {
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

  export type RetentionPolicyScalarFieldEnum = (typeof RetentionPolicyScalarFieldEnum)[keyof typeof RetentionPolicyScalarFieldEnum]


  export const RetentionPolicyRuleScalarFieldEnum: {
    id: 'id',
    policyId: 'policyId',
    condition: 'condition',
    action: 'action',
    priority: 'priority',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RetentionPolicyRuleScalarFieldEnum = (typeof RetentionPolicyRuleScalarFieldEnum)[keyof typeof RetentionPolicyRuleScalarFieldEnum]


  export const LegalHoldScalarFieldEnum: {
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

  export type LegalHoldScalarFieldEnum = (typeof LegalHoldScalarFieldEnum)[keyof typeof LegalHoldScalarFieldEnum]


  export const DataDeletionRequestScalarFieldEnum: {
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

  export type DataDeletionRequestScalarFieldEnum = (typeof DataDeletionRequestScalarFieldEnum)[keyof typeof DataDeletionRequestScalarFieldEnum]


  export const RetentionAuditLogScalarFieldEnum: {
    id: 'id',
    fileId: 'fileId',
    entityType: 'entityType',
    entityId: 'entityId',
    action: 'action',
    details: 'details',
    performedBy: 'performedBy',
    createdAt: 'createdAt'
  };

  export type RetentionAuditLogScalarFieldEnum = (typeof RetentionAuditLogScalarFieldEnum)[keyof typeof RetentionAuditLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'EntityType'
   */
  export type EnumEntityTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EntityType'>
    


  /**
   * Reference to a field of type 'EntityType[]'
   */
  export type ListEnumEntityTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EntityType[]'>
    


  /**
   * Reference to a field of type 'FileStatus'
   */
  export type EnumFileStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FileStatus'>
    


  /**
   * Reference to a field of type 'FileStatus[]'
   */
  export type ListEnumFileStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FileStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'AccessLevel'
   */
  export type EnumAccessLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccessLevel'>
    


  /**
   * Reference to a field of type 'AccessLevel[]'
   */
  export type ListEnumAccessLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccessLevel[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'RelationshipType'
   */
  export type EnumRelationshipTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RelationshipType'>
    


  /**
   * Reference to a field of type 'RelationshipType[]'
   */
  export type ListEnumRelationshipTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RelationshipType[]'>
    


  /**
   * Reference to a field of type 'UploadStatus'
   */
  export type EnumUploadStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UploadStatus'>
    


  /**
   * Reference to a field of type 'UploadStatus[]'
   */
  export type ListEnumUploadStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UploadStatus[]'>
    


  /**
   * Reference to a field of type 'ProcessingJobType'
   */
  export type EnumProcessingJobTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProcessingJobType'>
    


  /**
   * Reference to a field of type 'ProcessingJobType[]'
   */
  export type ListEnumProcessingJobTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProcessingJobType[]'>
    


  /**
   * Reference to a field of type 'JobStatus'
   */
  export type EnumJobStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JobStatus'>
    


  /**
   * Reference to a field of type 'JobStatus[]'
   */
  export type ListEnumJobStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JobStatus[]'>
    


  /**
   * Reference to a field of type 'AccessOperation'
   */
  export type EnumAccessOperationFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccessOperation'>
    


  /**
   * Reference to a field of type 'AccessOperation[]'
   */
  export type ListEnumAccessOperationFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccessOperation[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'DataDeletionRequestType'
   */
  export type EnumDataDeletionRequestTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DataDeletionRequestType'>
    


  /**
   * Reference to a field of type 'DataDeletionRequestType[]'
   */
  export type ListEnumDataDeletionRequestTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DataDeletionRequestType[]'>
    


  /**
   * Reference to a field of type 'DeletionRequestStatus'
   */
  export type EnumDeletionRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeletionRequestStatus'>
    


  /**
   * Reference to a field of type 'DeletionRequestStatus[]'
   */
  export type ListEnumDeletionRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeletionRequestStatus[]'>
    


  /**
   * Reference to a field of type 'RetentionAuditAction'
   */
  export type EnumRetentionAuditActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RetentionAuditAction'>
    


  /**
   * Reference to a field of type 'RetentionAuditAction[]'
   */
  export type ListEnumRetentionAuditActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RetentionAuditAction[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type FileMetadataWhereInput = {
    AND?: FileMetadataWhereInput | FileMetadataWhereInput[]
    OR?: FileMetadataWhereInput[]
    NOT?: FileMetadataWhereInput | FileMetadataWhereInput[]
    id?: StringFilter<"FileMetadata"> | string
    originalName?: StringFilter<"FileMetadata"> | string
    fileName?: StringFilter<"FileMetadata"> | string
    mimeType?: StringFilter<"FileMetadata"> | string
    size?: IntFilter<"FileMetadata"> | number
    path?: StringFilter<"FileMetadata"> | string
    url?: StringFilter<"FileMetadata"> | string
    cdnUrl?: StringNullableFilter<"FileMetadata"> | string | null
    uploadedBy?: StringFilter<"FileMetadata"> | string
    entityType?: EnumEntityTypeFilter<"FileMetadata"> | $Enums.EntityType
    entityId?: StringFilter<"FileMetadata"> | string
    status?: EnumFileStatusFilter<"FileMetadata"> | $Enums.FileStatus
    processingResults?: JsonNullableFilter<"FileMetadata">
    thumbnails?: JsonNullableFilter<"FileMetadata">
    accessLevel?: EnumAccessLevelFilter<"FileMetadata"> | $Enums.AccessLevel
    permissions?: JsonNullableFilter<"FileMetadata">
    metadata?: JsonNullableFilter<"FileMetadata">
    tags?: StringNullableListFilter<"FileMetadata">
    createdAt?: DateTimeFilter<"FileMetadata"> | Date | string
    updatedAt?: DateTimeFilter<"FileMetadata"> | Date | string
    expiresAt?: DateTimeNullableFilter<"FileMetadata"> | Date | string | null
    parentRelationships?: FileRelationshipListRelationFilter
    childRelationships?: FileRelationshipListRelationFilter
    sessionFiles?: UploadSessionFileListRelationFilter
  }

  export type FileMetadataOrderByWithRelationInput = {
    id?: SortOrder
    originalName?: SortOrder
    fileName?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    path?: SortOrder
    url?: SortOrder
    cdnUrl?: SortOrderInput | SortOrder
    uploadedBy?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    status?: SortOrder
    processingResults?: SortOrderInput | SortOrder
    thumbnails?: SortOrderInput | SortOrder
    accessLevel?: SortOrder
    permissions?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    tags?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    parentRelationships?: FileRelationshipOrderByRelationAggregateInput
    childRelationships?: FileRelationshipOrderByRelationAggregateInput
    sessionFiles?: UploadSessionFileOrderByRelationAggregateInput
  }

  export type FileMetadataWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    path?: string
    AND?: FileMetadataWhereInput | FileMetadataWhereInput[]
    OR?: FileMetadataWhereInput[]
    NOT?: FileMetadataWhereInput | FileMetadataWhereInput[]
    originalName?: StringFilter<"FileMetadata"> | string
    fileName?: StringFilter<"FileMetadata"> | string
    mimeType?: StringFilter<"FileMetadata"> | string
    size?: IntFilter<"FileMetadata"> | number
    url?: StringFilter<"FileMetadata"> | string
    cdnUrl?: StringNullableFilter<"FileMetadata"> | string | null
    uploadedBy?: StringFilter<"FileMetadata"> | string
    entityType?: EnumEntityTypeFilter<"FileMetadata"> | $Enums.EntityType
    entityId?: StringFilter<"FileMetadata"> | string
    status?: EnumFileStatusFilter<"FileMetadata"> | $Enums.FileStatus
    processingResults?: JsonNullableFilter<"FileMetadata">
    thumbnails?: JsonNullableFilter<"FileMetadata">
    accessLevel?: EnumAccessLevelFilter<"FileMetadata"> | $Enums.AccessLevel
    permissions?: JsonNullableFilter<"FileMetadata">
    metadata?: JsonNullableFilter<"FileMetadata">
    tags?: StringNullableListFilter<"FileMetadata">
    createdAt?: DateTimeFilter<"FileMetadata"> | Date | string
    updatedAt?: DateTimeFilter<"FileMetadata"> | Date | string
    expiresAt?: DateTimeNullableFilter<"FileMetadata"> | Date | string | null
    parentRelationships?: FileRelationshipListRelationFilter
    childRelationships?: FileRelationshipListRelationFilter
    sessionFiles?: UploadSessionFileListRelationFilter
  }, "id" | "path">

  export type FileMetadataOrderByWithAggregationInput = {
    id?: SortOrder
    originalName?: SortOrder
    fileName?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    path?: SortOrder
    url?: SortOrder
    cdnUrl?: SortOrderInput | SortOrder
    uploadedBy?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    status?: SortOrder
    processingResults?: SortOrderInput | SortOrder
    thumbnails?: SortOrderInput | SortOrder
    accessLevel?: SortOrder
    permissions?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    tags?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    _count?: FileMetadataCountOrderByAggregateInput
    _avg?: FileMetadataAvgOrderByAggregateInput
    _max?: FileMetadataMaxOrderByAggregateInput
    _min?: FileMetadataMinOrderByAggregateInput
    _sum?: FileMetadataSumOrderByAggregateInput
  }

  export type FileMetadataScalarWhereWithAggregatesInput = {
    AND?: FileMetadataScalarWhereWithAggregatesInput | FileMetadataScalarWhereWithAggregatesInput[]
    OR?: FileMetadataScalarWhereWithAggregatesInput[]
    NOT?: FileMetadataScalarWhereWithAggregatesInput | FileMetadataScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FileMetadata"> | string
    originalName?: StringWithAggregatesFilter<"FileMetadata"> | string
    fileName?: StringWithAggregatesFilter<"FileMetadata"> | string
    mimeType?: StringWithAggregatesFilter<"FileMetadata"> | string
    size?: IntWithAggregatesFilter<"FileMetadata"> | number
    path?: StringWithAggregatesFilter<"FileMetadata"> | string
    url?: StringWithAggregatesFilter<"FileMetadata"> | string
    cdnUrl?: StringNullableWithAggregatesFilter<"FileMetadata"> | string | null
    uploadedBy?: StringWithAggregatesFilter<"FileMetadata"> | string
    entityType?: EnumEntityTypeWithAggregatesFilter<"FileMetadata"> | $Enums.EntityType
    entityId?: StringWithAggregatesFilter<"FileMetadata"> | string
    status?: EnumFileStatusWithAggregatesFilter<"FileMetadata"> | $Enums.FileStatus
    processingResults?: JsonNullableWithAggregatesFilter<"FileMetadata">
    thumbnails?: JsonNullableWithAggregatesFilter<"FileMetadata">
    accessLevel?: EnumAccessLevelWithAggregatesFilter<"FileMetadata"> | $Enums.AccessLevel
    permissions?: JsonNullableWithAggregatesFilter<"FileMetadata">
    metadata?: JsonNullableWithAggregatesFilter<"FileMetadata">
    tags?: StringNullableListFilter<"FileMetadata">
    createdAt?: DateTimeWithAggregatesFilter<"FileMetadata"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FileMetadata"> | Date | string
    expiresAt?: DateTimeNullableWithAggregatesFilter<"FileMetadata"> | Date | string | null
  }

  export type FileRelationshipWhereInput = {
    AND?: FileRelationshipWhereInput | FileRelationshipWhereInput[]
    OR?: FileRelationshipWhereInput[]
    NOT?: FileRelationshipWhereInput | FileRelationshipWhereInput[]
    id?: StringFilter<"FileRelationship"> | string
    parentId?: StringFilter<"FileRelationship"> | string
    childId?: StringFilter<"FileRelationship"> | string
    relationshipType?: EnumRelationshipTypeFilter<"FileRelationship"> | $Enums.RelationshipType
    createdAt?: DateTimeFilter<"FileRelationship"> | Date | string
    parent?: XOR<FileMetadataRelationFilter, FileMetadataWhereInput>
    child?: XOR<FileMetadataRelationFilter, FileMetadataWhereInput>
  }

  export type FileRelationshipOrderByWithRelationInput = {
    id?: SortOrder
    parentId?: SortOrder
    childId?: SortOrder
    relationshipType?: SortOrder
    createdAt?: SortOrder
    parent?: FileMetadataOrderByWithRelationInput
    child?: FileMetadataOrderByWithRelationInput
  }

  export type FileRelationshipWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    parentId_childId_relationshipType?: FileRelationshipParentIdChildIdRelationshipTypeCompoundUniqueInput
    AND?: FileRelationshipWhereInput | FileRelationshipWhereInput[]
    OR?: FileRelationshipWhereInput[]
    NOT?: FileRelationshipWhereInput | FileRelationshipWhereInput[]
    parentId?: StringFilter<"FileRelationship"> | string
    childId?: StringFilter<"FileRelationship"> | string
    relationshipType?: EnumRelationshipTypeFilter<"FileRelationship"> | $Enums.RelationshipType
    createdAt?: DateTimeFilter<"FileRelationship"> | Date | string
    parent?: XOR<FileMetadataRelationFilter, FileMetadataWhereInput>
    child?: XOR<FileMetadataRelationFilter, FileMetadataWhereInput>
  }, "id" | "parentId_childId_relationshipType">

  export type FileRelationshipOrderByWithAggregationInput = {
    id?: SortOrder
    parentId?: SortOrder
    childId?: SortOrder
    relationshipType?: SortOrder
    createdAt?: SortOrder
    _count?: FileRelationshipCountOrderByAggregateInput
    _max?: FileRelationshipMaxOrderByAggregateInput
    _min?: FileRelationshipMinOrderByAggregateInput
  }

  export type FileRelationshipScalarWhereWithAggregatesInput = {
    AND?: FileRelationshipScalarWhereWithAggregatesInput | FileRelationshipScalarWhereWithAggregatesInput[]
    OR?: FileRelationshipScalarWhereWithAggregatesInput[]
    NOT?: FileRelationshipScalarWhereWithAggregatesInput | FileRelationshipScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FileRelationship"> | string
    parentId?: StringWithAggregatesFilter<"FileRelationship"> | string
    childId?: StringWithAggregatesFilter<"FileRelationship"> | string
    relationshipType?: EnumRelationshipTypeWithAggregatesFilter<"FileRelationship"> | $Enums.RelationshipType
    createdAt?: DateTimeWithAggregatesFilter<"FileRelationship"> | Date | string
  }

  export type UploadSessionWhereInput = {
    AND?: UploadSessionWhereInput | UploadSessionWhereInput[]
    OR?: UploadSessionWhereInput[]
    NOT?: UploadSessionWhereInput | UploadSessionWhereInput[]
    id?: StringFilter<"UploadSession"> | string
    sessionId?: StringFilter<"UploadSession"> | string
    uploadedBy?: StringFilter<"UploadSession"> | string
    status?: EnumUploadStatusFilter<"UploadSession"> | $Enums.UploadStatus
    totalFiles?: IntFilter<"UploadSession"> | number
    uploadedFiles?: IntFilter<"UploadSession"> | number
    failedFiles?: IntFilter<"UploadSession"> | number
    metadata?: JsonNullableFilter<"UploadSession">
    createdAt?: DateTimeFilter<"UploadSession"> | Date | string
    updatedAt?: DateTimeFilter<"UploadSession"> | Date | string
    expiresAt?: DateTimeFilter<"UploadSession"> | Date | string
    files?: UploadSessionFileListRelationFilter
  }

  export type UploadSessionOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    uploadedBy?: SortOrder
    status?: SortOrder
    totalFiles?: SortOrder
    uploadedFiles?: SortOrder
    failedFiles?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrder
    files?: UploadSessionFileOrderByRelationAggregateInput
  }

  export type UploadSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionId?: string
    AND?: UploadSessionWhereInput | UploadSessionWhereInput[]
    OR?: UploadSessionWhereInput[]
    NOT?: UploadSessionWhereInput | UploadSessionWhereInput[]
    uploadedBy?: StringFilter<"UploadSession"> | string
    status?: EnumUploadStatusFilter<"UploadSession"> | $Enums.UploadStatus
    totalFiles?: IntFilter<"UploadSession"> | number
    uploadedFiles?: IntFilter<"UploadSession"> | number
    failedFiles?: IntFilter<"UploadSession"> | number
    metadata?: JsonNullableFilter<"UploadSession">
    createdAt?: DateTimeFilter<"UploadSession"> | Date | string
    updatedAt?: DateTimeFilter<"UploadSession"> | Date | string
    expiresAt?: DateTimeFilter<"UploadSession"> | Date | string
    files?: UploadSessionFileListRelationFilter
  }, "id" | "sessionId">

  export type UploadSessionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    uploadedBy?: SortOrder
    status?: SortOrder
    totalFiles?: SortOrder
    uploadedFiles?: SortOrder
    failedFiles?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrder
    _count?: UploadSessionCountOrderByAggregateInput
    _avg?: UploadSessionAvgOrderByAggregateInput
    _max?: UploadSessionMaxOrderByAggregateInput
    _min?: UploadSessionMinOrderByAggregateInput
    _sum?: UploadSessionSumOrderByAggregateInput
  }

  export type UploadSessionScalarWhereWithAggregatesInput = {
    AND?: UploadSessionScalarWhereWithAggregatesInput | UploadSessionScalarWhereWithAggregatesInput[]
    OR?: UploadSessionScalarWhereWithAggregatesInput[]
    NOT?: UploadSessionScalarWhereWithAggregatesInput | UploadSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UploadSession"> | string
    sessionId?: StringWithAggregatesFilter<"UploadSession"> | string
    uploadedBy?: StringWithAggregatesFilter<"UploadSession"> | string
    status?: EnumUploadStatusWithAggregatesFilter<"UploadSession"> | $Enums.UploadStatus
    totalFiles?: IntWithAggregatesFilter<"UploadSession"> | number
    uploadedFiles?: IntWithAggregatesFilter<"UploadSession"> | number
    failedFiles?: IntWithAggregatesFilter<"UploadSession"> | number
    metadata?: JsonNullableWithAggregatesFilter<"UploadSession">
    createdAt?: DateTimeWithAggregatesFilter<"UploadSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UploadSession"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"UploadSession"> | Date | string
  }

  export type UploadSessionFileWhereInput = {
    AND?: UploadSessionFileWhereInput | UploadSessionFileWhereInput[]
    OR?: UploadSessionFileWhereInput[]
    NOT?: UploadSessionFileWhereInput | UploadSessionFileWhereInput[]
    id?: StringFilter<"UploadSessionFile"> | string
    sessionId?: StringFilter<"UploadSessionFile"> | string
    fileId?: StringNullableFilter<"UploadSessionFile"> | string | null
    originalName?: StringFilter<"UploadSessionFile"> | string
    status?: EnumFileStatusFilter<"UploadSessionFile"> | $Enums.FileStatus
    errorMessage?: StringNullableFilter<"UploadSessionFile"> | string | null
    processingOrder?: IntFilter<"UploadSessionFile"> | number
    createdAt?: DateTimeFilter<"UploadSessionFile"> | Date | string
    updatedAt?: DateTimeFilter<"UploadSessionFile"> | Date | string
    session?: XOR<UploadSessionRelationFilter, UploadSessionWhereInput>
    file?: XOR<FileMetadataNullableRelationFilter, FileMetadataWhereInput> | null
  }

  export type UploadSessionFileOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    fileId?: SortOrderInput | SortOrder
    originalName?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    processingOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    session?: UploadSessionOrderByWithRelationInput
    file?: FileMetadataOrderByWithRelationInput
  }

  export type UploadSessionFileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UploadSessionFileWhereInput | UploadSessionFileWhereInput[]
    OR?: UploadSessionFileWhereInput[]
    NOT?: UploadSessionFileWhereInput | UploadSessionFileWhereInput[]
    sessionId?: StringFilter<"UploadSessionFile"> | string
    fileId?: StringNullableFilter<"UploadSessionFile"> | string | null
    originalName?: StringFilter<"UploadSessionFile"> | string
    status?: EnumFileStatusFilter<"UploadSessionFile"> | $Enums.FileStatus
    errorMessage?: StringNullableFilter<"UploadSessionFile"> | string | null
    processingOrder?: IntFilter<"UploadSessionFile"> | number
    createdAt?: DateTimeFilter<"UploadSessionFile"> | Date | string
    updatedAt?: DateTimeFilter<"UploadSessionFile"> | Date | string
    session?: XOR<UploadSessionRelationFilter, UploadSessionWhereInput>
    file?: XOR<FileMetadataNullableRelationFilter, FileMetadataWhereInput> | null
  }, "id">

  export type UploadSessionFileOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    fileId?: SortOrderInput | SortOrder
    originalName?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    processingOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UploadSessionFileCountOrderByAggregateInput
    _avg?: UploadSessionFileAvgOrderByAggregateInput
    _max?: UploadSessionFileMaxOrderByAggregateInput
    _min?: UploadSessionFileMinOrderByAggregateInput
    _sum?: UploadSessionFileSumOrderByAggregateInput
  }

  export type UploadSessionFileScalarWhereWithAggregatesInput = {
    AND?: UploadSessionFileScalarWhereWithAggregatesInput | UploadSessionFileScalarWhereWithAggregatesInput[]
    OR?: UploadSessionFileScalarWhereWithAggregatesInput[]
    NOT?: UploadSessionFileScalarWhereWithAggregatesInput | UploadSessionFileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UploadSessionFile"> | string
    sessionId?: StringWithAggregatesFilter<"UploadSessionFile"> | string
    fileId?: StringNullableWithAggregatesFilter<"UploadSessionFile"> | string | null
    originalName?: StringWithAggregatesFilter<"UploadSessionFile"> | string
    status?: EnumFileStatusWithAggregatesFilter<"UploadSessionFile"> | $Enums.FileStatus
    errorMessage?: StringNullableWithAggregatesFilter<"UploadSessionFile"> | string | null
    processingOrder?: IntWithAggregatesFilter<"UploadSessionFile"> | number
    createdAt?: DateTimeWithAggregatesFilter<"UploadSessionFile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UploadSessionFile"> | Date | string
  }

  export type ProcessingJobWhereInput = {
    AND?: ProcessingJobWhereInput | ProcessingJobWhereInput[]
    OR?: ProcessingJobWhereInput[]
    NOT?: ProcessingJobWhereInput | ProcessingJobWhereInput[]
    id?: StringFilter<"ProcessingJob"> | string
    fileId?: StringFilter<"ProcessingJob"> | string
    jobType?: EnumProcessingJobTypeFilter<"ProcessingJob"> | $Enums.ProcessingJobType
    status?: EnumJobStatusFilter<"ProcessingJob"> | $Enums.JobStatus
    priority?: IntFilter<"ProcessingJob"> | number
    attempts?: IntFilter<"ProcessingJob"> | number
    maxAttempts?: IntFilter<"ProcessingJob"> | number
    payload?: JsonFilter<"ProcessingJob">
    result?: JsonNullableFilter<"ProcessingJob">
    errorMessage?: StringNullableFilter<"ProcessingJob"> | string | null
    scheduledAt?: DateTimeFilter<"ProcessingJob"> | Date | string
    startedAt?: DateTimeNullableFilter<"ProcessingJob"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"ProcessingJob"> | Date | string | null
    createdAt?: DateTimeFilter<"ProcessingJob"> | Date | string
    updatedAt?: DateTimeFilter<"ProcessingJob"> | Date | string
  }

  export type ProcessingJobOrderByWithRelationInput = {
    id?: SortOrder
    fileId?: SortOrder
    jobType?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
    payload?: SortOrder
    result?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    scheduledAt?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProcessingJobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProcessingJobWhereInput | ProcessingJobWhereInput[]
    OR?: ProcessingJobWhereInput[]
    NOT?: ProcessingJobWhereInput | ProcessingJobWhereInput[]
    fileId?: StringFilter<"ProcessingJob"> | string
    jobType?: EnumProcessingJobTypeFilter<"ProcessingJob"> | $Enums.ProcessingJobType
    status?: EnumJobStatusFilter<"ProcessingJob"> | $Enums.JobStatus
    priority?: IntFilter<"ProcessingJob"> | number
    attempts?: IntFilter<"ProcessingJob"> | number
    maxAttempts?: IntFilter<"ProcessingJob"> | number
    payload?: JsonFilter<"ProcessingJob">
    result?: JsonNullableFilter<"ProcessingJob">
    errorMessage?: StringNullableFilter<"ProcessingJob"> | string | null
    scheduledAt?: DateTimeFilter<"ProcessingJob"> | Date | string
    startedAt?: DateTimeNullableFilter<"ProcessingJob"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"ProcessingJob"> | Date | string | null
    createdAt?: DateTimeFilter<"ProcessingJob"> | Date | string
    updatedAt?: DateTimeFilter<"ProcessingJob"> | Date | string
  }, "id">

  export type ProcessingJobOrderByWithAggregationInput = {
    id?: SortOrder
    fileId?: SortOrder
    jobType?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
    payload?: SortOrder
    result?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    scheduledAt?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProcessingJobCountOrderByAggregateInput
    _avg?: ProcessingJobAvgOrderByAggregateInput
    _max?: ProcessingJobMaxOrderByAggregateInput
    _min?: ProcessingJobMinOrderByAggregateInput
    _sum?: ProcessingJobSumOrderByAggregateInput
  }

  export type ProcessingJobScalarWhereWithAggregatesInput = {
    AND?: ProcessingJobScalarWhereWithAggregatesInput | ProcessingJobScalarWhereWithAggregatesInput[]
    OR?: ProcessingJobScalarWhereWithAggregatesInput[]
    NOT?: ProcessingJobScalarWhereWithAggregatesInput | ProcessingJobScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProcessingJob"> | string
    fileId?: StringWithAggregatesFilter<"ProcessingJob"> | string
    jobType?: EnumProcessingJobTypeWithAggregatesFilter<"ProcessingJob"> | $Enums.ProcessingJobType
    status?: EnumJobStatusWithAggregatesFilter<"ProcessingJob"> | $Enums.JobStatus
    priority?: IntWithAggregatesFilter<"ProcessingJob"> | number
    attempts?: IntWithAggregatesFilter<"ProcessingJob"> | number
    maxAttempts?: IntWithAggregatesFilter<"ProcessingJob"> | number
    payload?: JsonWithAggregatesFilter<"ProcessingJob">
    result?: JsonNullableWithAggregatesFilter<"ProcessingJob">
    errorMessage?: StringNullableWithAggregatesFilter<"ProcessingJob"> | string | null
    scheduledAt?: DateTimeWithAggregatesFilter<"ProcessingJob"> | Date | string
    startedAt?: DateTimeNullableWithAggregatesFilter<"ProcessingJob"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"ProcessingJob"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ProcessingJob"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProcessingJob"> | Date | string
  }

  export type AccessLogWhereInput = {
    AND?: AccessLogWhereInput | AccessLogWhereInput[]
    OR?: AccessLogWhereInput[]
    NOT?: AccessLogWhereInput | AccessLogWhereInput[]
    id?: StringFilter<"AccessLog"> | string
    fileId?: StringFilter<"AccessLog"> | string
    operation?: EnumAccessOperationFilter<"AccessLog"> | $Enums.AccessOperation
    userId?: StringNullableFilter<"AccessLog"> | string | null
    serviceId?: StringNullableFilter<"AccessLog"> | string | null
    ipAddress?: StringNullableFilter<"AccessLog"> | string | null
    userAgent?: StringNullableFilter<"AccessLog"> | string | null
    success?: BoolFilter<"AccessLog"> | boolean
    errorCode?: StringNullableFilter<"AccessLog"> | string | null
    metadata?: JsonNullableFilter<"AccessLog">
    createdAt?: DateTimeFilter<"AccessLog"> | Date | string
  }

  export type AccessLogOrderByWithRelationInput = {
    id?: SortOrder
    fileId?: SortOrder
    operation?: SortOrder
    userId?: SortOrderInput | SortOrder
    serviceId?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    success?: SortOrder
    errorCode?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type AccessLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AccessLogWhereInput | AccessLogWhereInput[]
    OR?: AccessLogWhereInput[]
    NOT?: AccessLogWhereInput | AccessLogWhereInput[]
    fileId?: StringFilter<"AccessLog"> | string
    operation?: EnumAccessOperationFilter<"AccessLog"> | $Enums.AccessOperation
    userId?: StringNullableFilter<"AccessLog"> | string | null
    serviceId?: StringNullableFilter<"AccessLog"> | string | null
    ipAddress?: StringNullableFilter<"AccessLog"> | string | null
    userAgent?: StringNullableFilter<"AccessLog"> | string | null
    success?: BoolFilter<"AccessLog"> | boolean
    errorCode?: StringNullableFilter<"AccessLog"> | string | null
    metadata?: JsonNullableFilter<"AccessLog">
    createdAt?: DateTimeFilter<"AccessLog"> | Date | string
  }, "id">

  export type AccessLogOrderByWithAggregationInput = {
    id?: SortOrder
    fileId?: SortOrder
    operation?: SortOrder
    userId?: SortOrderInput | SortOrder
    serviceId?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    success?: SortOrder
    errorCode?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AccessLogCountOrderByAggregateInput
    _max?: AccessLogMaxOrderByAggregateInput
    _min?: AccessLogMinOrderByAggregateInput
  }

  export type AccessLogScalarWhereWithAggregatesInput = {
    AND?: AccessLogScalarWhereWithAggregatesInput | AccessLogScalarWhereWithAggregatesInput[]
    OR?: AccessLogScalarWhereWithAggregatesInput[]
    NOT?: AccessLogScalarWhereWithAggregatesInput | AccessLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AccessLog"> | string
    fileId?: StringWithAggregatesFilter<"AccessLog"> | string
    operation?: EnumAccessOperationWithAggregatesFilter<"AccessLog"> | $Enums.AccessOperation
    userId?: StringNullableWithAggregatesFilter<"AccessLog"> | string | null
    serviceId?: StringNullableWithAggregatesFilter<"AccessLog"> | string | null
    ipAddress?: StringNullableWithAggregatesFilter<"AccessLog"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"AccessLog"> | string | null
    success?: BoolWithAggregatesFilter<"AccessLog"> | boolean
    errorCode?: StringNullableWithAggregatesFilter<"AccessLog"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"AccessLog">
    createdAt?: DateTimeWithAggregatesFilter<"AccessLog"> | Date | string
  }

  export type StorageQuotaWhereInput = {
    AND?: StorageQuotaWhereInput | StorageQuotaWhereInput[]
    OR?: StorageQuotaWhereInput[]
    NOT?: StorageQuotaWhereInput | StorageQuotaWhereInput[]
    id?: StringFilter<"StorageQuota"> | string
    entityType?: EnumEntityTypeFilter<"StorageQuota"> | $Enums.EntityType
    entityId?: StringFilter<"StorageQuota"> | string
    quotaBytes?: BigIntFilter<"StorageQuota"> | bigint | number
    usedBytes?: BigIntFilter<"StorageQuota"> | bigint | number
    fileCount?: IntFilter<"StorageQuota"> | number
    lastUpdated?: DateTimeFilter<"StorageQuota"> | Date | string
    createdAt?: DateTimeFilter<"StorageQuota"> | Date | string
  }

  export type StorageQuotaOrderByWithRelationInput = {
    id?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    quotaBytes?: SortOrder
    usedBytes?: SortOrder
    fileCount?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
  }

  export type StorageQuotaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    entityType_entityId?: StorageQuotaEntityTypeEntityIdCompoundUniqueInput
    AND?: StorageQuotaWhereInput | StorageQuotaWhereInput[]
    OR?: StorageQuotaWhereInput[]
    NOT?: StorageQuotaWhereInput | StorageQuotaWhereInput[]
    entityType?: EnumEntityTypeFilter<"StorageQuota"> | $Enums.EntityType
    entityId?: StringFilter<"StorageQuota"> | string
    quotaBytes?: BigIntFilter<"StorageQuota"> | bigint | number
    usedBytes?: BigIntFilter<"StorageQuota"> | bigint | number
    fileCount?: IntFilter<"StorageQuota"> | number
    lastUpdated?: DateTimeFilter<"StorageQuota"> | Date | string
    createdAt?: DateTimeFilter<"StorageQuota"> | Date | string
  }, "id" | "entityType_entityId">

  export type StorageQuotaOrderByWithAggregationInput = {
    id?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    quotaBytes?: SortOrder
    usedBytes?: SortOrder
    fileCount?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
    _count?: StorageQuotaCountOrderByAggregateInput
    _avg?: StorageQuotaAvgOrderByAggregateInput
    _max?: StorageQuotaMaxOrderByAggregateInput
    _min?: StorageQuotaMinOrderByAggregateInput
    _sum?: StorageQuotaSumOrderByAggregateInput
  }

  export type StorageQuotaScalarWhereWithAggregatesInput = {
    AND?: StorageQuotaScalarWhereWithAggregatesInput | StorageQuotaScalarWhereWithAggregatesInput[]
    OR?: StorageQuotaScalarWhereWithAggregatesInput[]
    NOT?: StorageQuotaScalarWhereWithAggregatesInput | StorageQuotaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StorageQuota"> | string
    entityType?: EnumEntityTypeWithAggregatesFilter<"StorageQuota"> | $Enums.EntityType
    entityId?: StringWithAggregatesFilter<"StorageQuota"> | string
    quotaBytes?: BigIntWithAggregatesFilter<"StorageQuota"> | bigint | number
    usedBytes?: BigIntWithAggregatesFilter<"StorageQuota"> | bigint | number
    fileCount?: IntWithAggregatesFilter<"StorageQuota"> | number
    lastUpdated?: DateTimeWithAggregatesFilter<"StorageQuota"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"StorageQuota"> | Date | string
  }

  export type RetentionPolicyWhereInput = {
    AND?: RetentionPolicyWhereInput | RetentionPolicyWhereInput[]
    OR?: RetentionPolicyWhereInput[]
    NOT?: RetentionPolicyWhereInput | RetentionPolicyWhereInput[]
    id?: StringFilter<"RetentionPolicy"> | string
    name?: StringFilter<"RetentionPolicy"> | string
    entityType?: EnumEntityTypeFilter<"RetentionPolicy"> | $Enums.EntityType
    retentionPeriodDays?: IntFilter<"RetentionPolicy"> | number
    jurisdiction?: StringFilter<"RetentionPolicy"> | string
    isActive?: BoolFilter<"RetentionPolicy"> | boolean
    description?: StringNullableFilter<"RetentionPolicy"> | string | null
    legalBasis?: StringNullableFilter<"RetentionPolicy"> | string | null
    createdAt?: DateTimeFilter<"RetentionPolicy"> | Date | string
    updatedAt?: DateTimeFilter<"RetentionPolicy"> | Date | string
    rules?: RetentionPolicyRuleListRelationFilter
  }

  export type RetentionPolicyOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    entityType?: SortOrder
    retentionPeriodDays?: SortOrder
    jurisdiction?: SortOrder
    isActive?: SortOrder
    description?: SortOrderInput | SortOrder
    legalBasis?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    rules?: RetentionPolicyRuleOrderByRelationAggregateInput
  }

  export type RetentionPolicyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    entityType_jurisdiction?: RetentionPolicyEntityTypeJurisdictionCompoundUniqueInput
    AND?: RetentionPolicyWhereInput | RetentionPolicyWhereInput[]
    OR?: RetentionPolicyWhereInput[]
    NOT?: RetentionPolicyWhereInput | RetentionPolicyWhereInput[]
    name?: StringFilter<"RetentionPolicy"> | string
    entityType?: EnumEntityTypeFilter<"RetentionPolicy"> | $Enums.EntityType
    retentionPeriodDays?: IntFilter<"RetentionPolicy"> | number
    jurisdiction?: StringFilter<"RetentionPolicy"> | string
    isActive?: BoolFilter<"RetentionPolicy"> | boolean
    description?: StringNullableFilter<"RetentionPolicy"> | string | null
    legalBasis?: StringNullableFilter<"RetentionPolicy"> | string | null
    createdAt?: DateTimeFilter<"RetentionPolicy"> | Date | string
    updatedAt?: DateTimeFilter<"RetentionPolicy"> | Date | string
    rules?: RetentionPolicyRuleListRelationFilter
  }, "id" | "entityType_jurisdiction">

  export type RetentionPolicyOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    entityType?: SortOrder
    retentionPeriodDays?: SortOrder
    jurisdiction?: SortOrder
    isActive?: SortOrder
    description?: SortOrderInput | SortOrder
    legalBasis?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RetentionPolicyCountOrderByAggregateInput
    _avg?: RetentionPolicyAvgOrderByAggregateInput
    _max?: RetentionPolicyMaxOrderByAggregateInput
    _min?: RetentionPolicyMinOrderByAggregateInput
    _sum?: RetentionPolicySumOrderByAggregateInput
  }

  export type RetentionPolicyScalarWhereWithAggregatesInput = {
    AND?: RetentionPolicyScalarWhereWithAggregatesInput | RetentionPolicyScalarWhereWithAggregatesInput[]
    OR?: RetentionPolicyScalarWhereWithAggregatesInput[]
    NOT?: RetentionPolicyScalarWhereWithAggregatesInput | RetentionPolicyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RetentionPolicy"> | string
    name?: StringWithAggregatesFilter<"RetentionPolicy"> | string
    entityType?: EnumEntityTypeWithAggregatesFilter<"RetentionPolicy"> | $Enums.EntityType
    retentionPeriodDays?: IntWithAggregatesFilter<"RetentionPolicy"> | number
    jurisdiction?: StringWithAggregatesFilter<"RetentionPolicy"> | string
    isActive?: BoolWithAggregatesFilter<"RetentionPolicy"> | boolean
    description?: StringNullableWithAggregatesFilter<"RetentionPolicy"> | string | null
    legalBasis?: StringNullableWithAggregatesFilter<"RetentionPolicy"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"RetentionPolicy"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RetentionPolicy"> | Date | string
  }

  export type RetentionPolicyRuleWhereInput = {
    AND?: RetentionPolicyRuleWhereInput | RetentionPolicyRuleWhereInput[]
    OR?: RetentionPolicyRuleWhereInput[]
    NOT?: RetentionPolicyRuleWhereInput | RetentionPolicyRuleWhereInput[]
    id?: StringFilter<"RetentionPolicyRule"> | string
    policyId?: StringFilter<"RetentionPolicyRule"> | string
    condition?: JsonFilter<"RetentionPolicyRule">
    action?: JsonFilter<"RetentionPolicyRule">
    priority?: IntFilter<"RetentionPolicyRule"> | number
    isActive?: BoolFilter<"RetentionPolicyRule"> | boolean
    createdAt?: DateTimeFilter<"RetentionPolicyRule"> | Date | string
    updatedAt?: DateTimeFilter<"RetentionPolicyRule"> | Date | string
    policy?: XOR<RetentionPolicyRelationFilter, RetentionPolicyWhereInput>
  }

  export type RetentionPolicyRuleOrderByWithRelationInput = {
    id?: SortOrder
    policyId?: SortOrder
    condition?: SortOrder
    action?: SortOrder
    priority?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    policy?: RetentionPolicyOrderByWithRelationInput
  }

  export type RetentionPolicyRuleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RetentionPolicyRuleWhereInput | RetentionPolicyRuleWhereInput[]
    OR?: RetentionPolicyRuleWhereInput[]
    NOT?: RetentionPolicyRuleWhereInput | RetentionPolicyRuleWhereInput[]
    policyId?: StringFilter<"RetentionPolicyRule"> | string
    condition?: JsonFilter<"RetentionPolicyRule">
    action?: JsonFilter<"RetentionPolicyRule">
    priority?: IntFilter<"RetentionPolicyRule"> | number
    isActive?: BoolFilter<"RetentionPolicyRule"> | boolean
    createdAt?: DateTimeFilter<"RetentionPolicyRule"> | Date | string
    updatedAt?: DateTimeFilter<"RetentionPolicyRule"> | Date | string
    policy?: XOR<RetentionPolicyRelationFilter, RetentionPolicyWhereInput>
  }, "id">

  export type RetentionPolicyRuleOrderByWithAggregationInput = {
    id?: SortOrder
    policyId?: SortOrder
    condition?: SortOrder
    action?: SortOrder
    priority?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RetentionPolicyRuleCountOrderByAggregateInput
    _avg?: RetentionPolicyRuleAvgOrderByAggregateInput
    _max?: RetentionPolicyRuleMaxOrderByAggregateInput
    _min?: RetentionPolicyRuleMinOrderByAggregateInput
    _sum?: RetentionPolicyRuleSumOrderByAggregateInput
  }

  export type RetentionPolicyRuleScalarWhereWithAggregatesInput = {
    AND?: RetentionPolicyRuleScalarWhereWithAggregatesInput | RetentionPolicyRuleScalarWhereWithAggregatesInput[]
    OR?: RetentionPolicyRuleScalarWhereWithAggregatesInput[]
    NOT?: RetentionPolicyRuleScalarWhereWithAggregatesInput | RetentionPolicyRuleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RetentionPolicyRule"> | string
    policyId?: StringWithAggregatesFilter<"RetentionPolicyRule"> | string
    condition?: JsonWithAggregatesFilter<"RetentionPolicyRule">
    action?: JsonWithAggregatesFilter<"RetentionPolicyRule">
    priority?: IntWithAggregatesFilter<"RetentionPolicyRule"> | number
    isActive?: BoolWithAggregatesFilter<"RetentionPolicyRule"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"RetentionPolicyRule"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RetentionPolicyRule"> | Date | string
  }

  export type LegalHoldWhereInput = {
    AND?: LegalHoldWhereInput | LegalHoldWhereInput[]
    OR?: LegalHoldWhereInput[]
    NOT?: LegalHoldWhereInput | LegalHoldWhereInput[]
    id?: StringFilter<"LegalHold"> | string
    name?: StringFilter<"LegalHold"> | string
    description?: StringFilter<"LegalHold"> | string
    entityType?: EnumEntityTypeNullableFilter<"LegalHold"> | $Enums.EntityType | null
    entityIds?: StringNullableListFilter<"LegalHold">
    fileIds?: StringNullableListFilter<"LegalHold">
    isActive?: BoolFilter<"LegalHold"> | boolean
    createdBy?: StringFilter<"LegalHold"> | string
    createdAt?: DateTimeFilter<"LegalHold"> | Date | string
    expiresAt?: DateTimeNullableFilter<"LegalHold"> | Date | string | null
  }

  export type LegalHoldOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    entityType?: SortOrderInput | SortOrder
    entityIds?: SortOrder
    fileIds?: SortOrder
    isActive?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
  }

  export type LegalHoldWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LegalHoldWhereInput | LegalHoldWhereInput[]
    OR?: LegalHoldWhereInput[]
    NOT?: LegalHoldWhereInput | LegalHoldWhereInput[]
    name?: StringFilter<"LegalHold"> | string
    description?: StringFilter<"LegalHold"> | string
    entityType?: EnumEntityTypeNullableFilter<"LegalHold"> | $Enums.EntityType | null
    entityIds?: StringNullableListFilter<"LegalHold">
    fileIds?: StringNullableListFilter<"LegalHold">
    isActive?: BoolFilter<"LegalHold"> | boolean
    createdBy?: StringFilter<"LegalHold"> | string
    createdAt?: DateTimeFilter<"LegalHold"> | Date | string
    expiresAt?: DateTimeNullableFilter<"LegalHold"> | Date | string | null
  }, "id">

  export type LegalHoldOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    entityType?: SortOrderInput | SortOrder
    entityIds?: SortOrder
    fileIds?: SortOrder
    isActive?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    _count?: LegalHoldCountOrderByAggregateInput
    _max?: LegalHoldMaxOrderByAggregateInput
    _min?: LegalHoldMinOrderByAggregateInput
  }

  export type LegalHoldScalarWhereWithAggregatesInput = {
    AND?: LegalHoldScalarWhereWithAggregatesInput | LegalHoldScalarWhereWithAggregatesInput[]
    OR?: LegalHoldScalarWhereWithAggregatesInput[]
    NOT?: LegalHoldScalarWhereWithAggregatesInput | LegalHoldScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LegalHold"> | string
    name?: StringWithAggregatesFilter<"LegalHold"> | string
    description?: StringWithAggregatesFilter<"LegalHold"> | string
    entityType?: EnumEntityTypeNullableWithAggregatesFilter<"LegalHold"> | $Enums.EntityType | null
    entityIds?: StringNullableListFilter<"LegalHold">
    fileIds?: StringNullableListFilter<"LegalHold">
    isActive?: BoolWithAggregatesFilter<"LegalHold"> | boolean
    createdBy?: StringWithAggregatesFilter<"LegalHold"> | string
    createdAt?: DateTimeWithAggregatesFilter<"LegalHold"> | Date | string
    expiresAt?: DateTimeNullableWithAggregatesFilter<"LegalHold"> | Date | string | null
  }

  export type DataDeletionRequestWhereInput = {
    AND?: DataDeletionRequestWhereInput | DataDeletionRequestWhereInput[]
    OR?: DataDeletionRequestWhereInput[]
    NOT?: DataDeletionRequestWhereInput | DataDeletionRequestWhereInput[]
    id?: StringFilter<"DataDeletionRequest"> | string
    requestType?: EnumDataDeletionRequestTypeFilter<"DataDeletionRequest"> | $Enums.DataDeletionRequestType
    entityType?: EnumEntityTypeFilter<"DataDeletionRequest"> | $Enums.EntityType
    entityId?: StringFilter<"DataDeletionRequest"> | string
    requestedBy?: StringFilter<"DataDeletionRequest"> | string
    status?: EnumDeletionRequestStatusFilter<"DataDeletionRequest"> | $Enums.DeletionRequestStatus
    scheduledAt?: DateTimeFilter<"DataDeletionRequest"> | Date | string
    processedAt?: DateTimeNullableFilter<"DataDeletionRequest"> | Date | string | null
    filesDeleted?: IntFilter<"DataDeletionRequest"> | number
    errorMessage?: StringNullableFilter<"DataDeletionRequest"> | string | null
    metadata?: JsonNullableFilter<"DataDeletionRequest">
    createdAt?: DateTimeFilter<"DataDeletionRequest"> | Date | string
    updatedAt?: DateTimeFilter<"DataDeletionRequest"> | Date | string
  }

  export type DataDeletionRequestOrderByWithRelationInput = {
    id?: SortOrder
    requestType?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    requestedBy?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    filesDeleted?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DataDeletionRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DataDeletionRequestWhereInput | DataDeletionRequestWhereInput[]
    OR?: DataDeletionRequestWhereInput[]
    NOT?: DataDeletionRequestWhereInput | DataDeletionRequestWhereInput[]
    requestType?: EnumDataDeletionRequestTypeFilter<"DataDeletionRequest"> | $Enums.DataDeletionRequestType
    entityType?: EnumEntityTypeFilter<"DataDeletionRequest"> | $Enums.EntityType
    entityId?: StringFilter<"DataDeletionRequest"> | string
    requestedBy?: StringFilter<"DataDeletionRequest"> | string
    status?: EnumDeletionRequestStatusFilter<"DataDeletionRequest"> | $Enums.DeletionRequestStatus
    scheduledAt?: DateTimeFilter<"DataDeletionRequest"> | Date | string
    processedAt?: DateTimeNullableFilter<"DataDeletionRequest"> | Date | string | null
    filesDeleted?: IntFilter<"DataDeletionRequest"> | number
    errorMessage?: StringNullableFilter<"DataDeletionRequest"> | string | null
    metadata?: JsonNullableFilter<"DataDeletionRequest">
    createdAt?: DateTimeFilter<"DataDeletionRequest"> | Date | string
    updatedAt?: DateTimeFilter<"DataDeletionRequest"> | Date | string
  }, "id">

  export type DataDeletionRequestOrderByWithAggregationInput = {
    id?: SortOrder
    requestType?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    requestedBy?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    filesDeleted?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DataDeletionRequestCountOrderByAggregateInput
    _avg?: DataDeletionRequestAvgOrderByAggregateInput
    _max?: DataDeletionRequestMaxOrderByAggregateInput
    _min?: DataDeletionRequestMinOrderByAggregateInput
    _sum?: DataDeletionRequestSumOrderByAggregateInput
  }

  export type DataDeletionRequestScalarWhereWithAggregatesInput = {
    AND?: DataDeletionRequestScalarWhereWithAggregatesInput | DataDeletionRequestScalarWhereWithAggregatesInput[]
    OR?: DataDeletionRequestScalarWhereWithAggregatesInput[]
    NOT?: DataDeletionRequestScalarWhereWithAggregatesInput | DataDeletionRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DataDeletionRequest"> | string
    requestType?: EnumDataDeletionRequestTypeWithAggregatesFilter<"DataDeletionRequest"> | $Enums.DataDeletionRequestType
    entityType?: EnumEntityTypeWithAggregatesFilter<"DataDeletionRequest"> | $Enums.EntityType
    entityId?: StringWithAggregatesFilter<"DataDeletionRequest"> | string
    requestedBy?: StringWithAggregatesFilter<"DataDeletionRequest"> | string
    status?: EnumDeletionRequestStatusWithAggregatesFilter<"DataDeletionRequest"> | $Enums.DeletionRequestStatus
    scheduledAt?: DateTimeWithAggregatesFilter<"DataDeletionRequest"> | Date | string
    processedAt?: DateTimeNullableWithAggregatesFilter<"DataDeletionRequest"> | Date | string | null
    filesDeleted?: IntWithAggregatesFilter<"DataDeletionRequest"> | number
    errorMessage?: StringNullableWithAggregatesFilter<"DataDeletionRequest"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"DataDeletionRequest">
    createdAt?: DateTimeWithAggregatesFilter<"DataDeletionRequest"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DataDeletionRequest"> | Date | string
  }

  export type RetentionAuditLogWhereInput = {
    AND?: RetentionAuditLogWhereInput | RetentionAuditLogWhereInput[]
    OR?: RetentionAuditLogWhereInput[]
    NOT?: RetentionAuditLogWhereInput | RetentionAuditLogWhereInput[]
    id?: StringFilter<"RetentionAuditLog"> | string
    fileId?: StringNullableFilter<"RetentionAuditLog"> | string | null
    entityType?: EnumEntityTypeNullableFilter<"RetentionAuditLog"> | $Enums.EntityType | null
    entityId?: StringNullableFilter<"RetentionAuditLog"> | string | null
    action?: EnumRetentionAuditActionFilter<"RetentionAuditLog"> | $Enums.RetentionAuditAction
    details?: JsonFilter<"RetentionAuditLog">
    performedBy?: StringNullableFilter<"RetentionAuditLog"> | string | null
    createdAt?: DateTimeFilter<"RetentionAuditLog"> | Date | string
  }

  export type RetentionAuditLogOrderByWithRelationInput = {
    id?: SortOrder
    fileId?: SortOrderInput | SortOrder
    entityType?: SortOrderInput | SortOrder
    entityId?: SortOrderInput | SortOrder
    action?: SortOrder
    details?: SortOrder
    performedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type RetentionAuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RetentionAuditLogWhereInput | RetentionAuditLogWhereInput[]
    OR?: RetentionAuditLogWhereInput[]
    NOT?: RetentionAuditLogWhereInput | RetentionAuditLogWhereInput[]
    fileId?: StringNullableFilter<"RetentionAuditLog"> | string | null
    entityType?: EnumEntityTypeNullableFilter<"RetentionAuditLog"> | $Enums.EntityType | null
    entityId?: StringNullableFilter<"RetentionAuditLog"> | string | null
    action?: EnumRetentionAuditActionFilter<"RetentionAuditLog"> | $Enums.RetentionAuditAction
    details?: JsonFilter<"RetentionAuditLog">
    performedBy?: StringNullableFilter<"RetentionAuditLog"> | string | null
    createdAt?: DateTimeFilter<"RetentionAuditLog"> | Date | string
  }, "id">

  export type RetentionAuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    fileId?: SortOrderInput | SortOrder
    entityType?: SortOrderInput | SortOrder
    entityId?: SortOrderInput | SortOrder
    action?: SortOrder
    details?: SortOrder
    performedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: RetentionAuditLogCountOrderByAggregateInput
    _max?: RetentionAuditLogMaxOrderByAggregateInput
    _min?: RetentionAuditLogMinOrderByAggregateInput
  }

  export type RetentionAuditLogScalarWhereWithAggregatesInput = {
    AND?: RetentionAuditLogScalarWhereWithAggregatesInput | RetentionAuditLogScalarWhereWithAggregatesInput[]
    OR?: RetentionAuditLogScalarWhereWithAggregatesInput[]
    NOT?: RetentionAuditLogScalarWhereWithAggregatesInput | RetentionAuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RetentionAuditLog"> | string
    fileId?: StringNullableWithAggregatesFilter<"RetentionAuditLog"> | string | null
    entityType?: EnumEntityTypeNullableWithAggregatesFilter<"RetentionAuditLog"> | $Enums.EntityType | null
    entityId?: StringNullableWithAggregatesFilter<"RetentionAuditLog"> | string | null
    action?: EnumRetentionAuditActionWithAggregatesFilter<"RetentionAuditLog"> | $Enums.RetentionAuditAction
    details?: JsonWithAggregatesFilter<"RetentionAuditLog">
    performedBy?: StringNullableWithAggregatesFilter<"RetentionAuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"RetentionAuditLog"> | Date | string
  }

  export type FileMetadataCreateInput = {
    id?: string
    originalName: string
    fileName: string
    mimeType: string
    size: number
    path: string
    url: string
    cdnUrl?: string | null
    uploadedBy: string
    entityType: $Enums.EntityType
    entityId: string
    status: $Enums.FileStatus
    processingResults?: NullableJsonNullValueInput | InputJsonValue
    thumbnails?: NullableJsonNullValueInput | InputJsonValue
    accessLevel: $Enums.AccessLevel
    permissions?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: FileMetadataCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt?: Date | string | null
    parentRelationships?: FileRelationshipCreateNestedManyWithoutParentInput
    childRelationships?: FileRelationshipCreateNestedManyWithoutChildInput
    sessionFiles?: UploadSessionFileCreateNestedManyWithoutFileInput
  }

  export type FileMetadataUncheckedCreateInput = {
    id?: string
    originalName: string
    fileName: string
    mimeType: string
    size: number
    path: string
    url: string
    cdnUrl?: string | null
    uploadedBy: string
    entityType: $Enums.EntityType
    entityId: string
    status: $Enums.FileStatus
    processingResults?: NullableJsonNullValueInput | InputJsonValue
    thumbnails?: NullableJsonNullValueInput | InputJsonValue
    accessLevel: $Enums.AccessLevel
    permissions?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: FileMetadataCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt?: Date | string | null
    parentRelationships?: FileRelationshipUncheckedCreateNestedManyWithoutParentInput
    childRelationships?: FileRelationshipUncheckedCreateNestedManyWithoutChildInput
    sessionFiles?: UploadSessionFileUncheckedCreateNestedManyWithoutFileInput
  }

  export type FileMetadataUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    path?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    cdnUrl?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: StringFieldUpdateOperationsInput | string
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    entityId?: StringFieldUpdateOperationsInput | string
    status?: EnumFileStatusFieldUpdateOperationsInput | $Enums.FileStatus
    processingResults?: NullableJsonNullValueInput | InputJsonValue
    thumbnails?: NullableJsonNullValueInput | InputJsonValue
    accessLevel?: EnumAccessLevelFieldUpdateOperationsInput | $Enums.AccessLevel
    permissions?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: FileMetadataUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parentRelationships?: FileRelationshipUpdateManyWithoutParentNestedInput
    childRelationships?: FileRelationshipUpdateManyWithoutChildNestedInput
    sessionFiles?: UploadSessionFileUpdateManyWithoutFileNestedInput
  }

  export type FileMetadataUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    path?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    cdnUrl?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: StringFieldUpdateOperationsInput | string
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    entityId?: StringFieldUpdateOperationsInput | string
    status?: EnumFileStatusFieldUpdateOperationsInput | $Enums.FileStatus
    processingResults?: NullableJsonNullValueInput | InputJsonValue
    thumbnails?: NullableJsonNullValueInput | InputJsonValue
    accessLevel?: EnumAccessLevelFieldUpdateOperationsInput | $Enums.AccessLevel
    permissions?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: FileMetadataUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parentRelationships?: FileRelationshipUncheckedUpdateManyWithoutParentNestedInput
    childRelationships?: FileRelationshipUncheckedUpdateManyWithoutChildNestedInput
    sessionFiles?: UploadSessionFileUncheckedUpdateManyWithoutFileNestedInput
  }

  export type FileMetadataCreateManyInput = {
    id?: string
    originalName: string
    fileName: string
    mimeType: string
    size: number
    path: string
    url: string
    cdnUrl?: string | null
    uploadedBy: string
    entityType: $Enums.EntityType
    entityId: string
    status: $Enums.FileStatus
    processingResults?: NullableJsonNullValueInput | InputJsonValue
    thumbnails?: NullableJsonNullValueInput | InputJsonValue
    accessLevel: $Enums.AccessLevel
    permissions?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: FileMetadataCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt?: Date | string | null
  }

  export type FileMetadataUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    path?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    cdnUrl?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: StringFieldUpdateOperationsInput | string
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    entityId?: StringFieldUpdateOperationsInput | string
    status?: EnumFileStatusFieldUpdateOperationsInput | $Enums.FileStatus
    processingResults?: NullableJsonNullValueInput | InputJsonValue
    thumbnails?: NullableJsonNullValueInput | InputJsonValue
    accessLevel?: EnumAccessLevelFieldUpdateOperationsInput | $Enums.AccessLevel
    permissions?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: FileMetadataUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FileMetadataUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    path?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    cdnUrl?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: StringFieldUpdateOperationsInput | string
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    entityId?: StringFieldUpdateOperationsInput | string
    status?: EnumFileStatusFieldUpdateOperationsInput | $Enums.FileStatus
    processingResults?: NullableJsonNullValueInput | InputJsonValue
    thumbnails?: NullableJsonNullValueInput | InputJsonValue
    accessLevel?: EnumAccessLevelFieldUpdateOperationsInput | $Enums.AccessLevel
    permissions?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: FileMetadataUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FileRelationshipCreateInput = {
    id?: string
    relationshipType: $Enums.RelationshipType
    createdAt?: Date | string
    parent: FileMetadataCreateNestedOneWithoutParentRelationshipsInput
    child: FileMetadataCreateNestedOneWithoutChildRelationshipsInput
  }

  export type FileRelationshipUncheckedCreateInput = {
    id?: string
    parentId: string
    childId: string
    relationshipType: $Enums.RelationshipType
    createdAt?: Date | string
  }

  export type FileRelationshipUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    relationshipType?: EnumRelationshipTypeFieldUpdateOperationsInput | $Enums.RelationshipType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: FileMetadataUpdateOneRequiredWithoutParentRelationshipsNestedInput
    child?: FileMetadataUpdateOneRequiredWithoutChildRelationshipsNestedInput
  }

  export type FileRelationshipUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    parentId?: StringFieldUpdateOperationsInput | string
    childId?: StringFieldUpdateOperationsInput | string
    relationshipType?: EnumRelationshipTypeFieldUpdateOperationsInput | $Enums.RelationshipType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileRelationshipCreateManyInput = {
    id?: string
    parentId: string
    childId: string
    relationshipType: $Enums.RelationshipType
    createdAt?: Date | string
  }

  export type FileRelationshipUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    relationshipType?: EnumRelationshipTypeFieldUpdateOperationsInput | $Enums.RelationshipType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileRelationshipUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    parentId?: StringFieldUpdateOperationsInput | string
    childId?: StringFieldUpdateOperationsInput | string
    relationshipType?: EnumRelationshipTypeFieldUpdateOperationsInput | $Enums.RelationshipType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UploadSessionCreateInput = {
    id?: string
    sessionId: string
    uploadedBy: string
    status: $Enums.UploadStatus
    totalFiles?: number
    uploadedFiles?: number
    failedFiles?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt: Date | string
    files?: UploadSessionFileCreateNestedManyWithoutSessionInput
  }

  export type UploadSessionUncheckedCreateInput = {
    id?: string
    sessionId: string
    uploadedBy: string
    status: $Enums.UploadStatus
    totalFiles?: number
    uploadedFiles?: number
    failedFiles?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt: Date | string
    files?: UploadSessionFileUncheckedCreateNestedManyWithoutSessionInput
  }

  export type UploadSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    uploadedBy?: StringFieldUpdateOperationsInput | string
    status?: EnumUploadStatusFieldUpdateOperationsInput | $Enums.UploadStatus
    totalFiles?: IntFieldUpdateOperationsInput | number
    uploadedFiles?: IntFieldUpdateOperationsInput | number
    failedFiles?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: UploadSessionFileUpdateManyWithoutSessionNestedInput
  }

  export type UploadSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    uploadedBy?: StringFieldUpdateOperationsInput | string
    status?: EnumUploadStatusFieldUpdateOperationsInput | $Enums.UploadStatus
    totalFiles?: IntFieldUpdateOperationsInput | number
    uploadedFiles?: IntFieldUpdateOperationsInput | number
    failedFiles?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: UploadSessionFileUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type UploadSessionCreateManyInput = {
    id?: string
    sessionId: string
    uploadedBy: string
    status: $Enums.UploadStatus
    totalFiles?: number
    uploadedFiles?: number
    failedFiles?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt: Date | string
  }

  export type UploadSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    uploadedBy?: StringFieldUpdateOperationsInput | string
    status?: EnumUploadStatusFieldUpdateOperationsInput | $Enums.UploadStatus
    totalFiles?: IntFieldUpdateOperationsInput | number
    uploadedFiles?: IntFieldUpdateOperationsInput | number
    failedFiles?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UploadSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    uploadedBy?: StringFieldUpdateOperationsInput | string
    status?: EnumUploadStatusFieldUpdateOperationsInput | $Enums.UploadStatus
    totalFiles?: IntFieldUpdateOperationsInput | number
    uploadedFiles?: IntFieldUpdateOperationsInput | number
    failedFiles?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UploadSessionFileCreateInput = {
    id?: string
    originalName: string
    status: $Enums.FileStatus
    errorMessage?: string | null
    processingOrder: number
    createdAt?: Date | string
    updatedAt?: Date | string
    session: UploadSessionCreateNestedOneWithoutFilesInput
    file?: FileMetadataCreateNestedOneWithoutSessionFilesInput
  }

  export type UploadSessionFileUncheckedCreateInput = {
    id?: string
    sessionId: string
    fileId?: string | null
    originalName: string
    status: $Enums.FileStatus
    errorMessage?: string | null
    processingOrder: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UploadSessionFileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    status?: EnumFileStatusFieldUpdateOperationsInput | $Enums.FileStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    processingOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: UploadSessionUpdateOneRequiredWithoutFilesNestedInput
    file?: FileMetadataUpdateOneWithoutSessionFilesNestedInput
  }

  export type UploadSessionFileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    originalName?: StringFieldUpdateOperationsInput | string
    status?: EnumFileStatusFieldUpdateOperationsInput | $Enums.FileStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    processingOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UploadSessionFileCreateManyInput = {
    id?: string
    sessionId: string
    fileId?: string | null
    originalName: string
    status: $Enums.FileStatus
    errorMessage?: string | null
    processingOrder: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UploadSessionFileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    status?: EnumFileStatusFieldUpdateOperationsInput | $Enums.FileStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    processingOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UploadSessionFileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    originalName?: StringFieldUpdateOperationsInput | string
    status?: EnumFileStatusFieldUpdateOperationsInput | $Enums.FileStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    processingOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcessingJobCreateInput = {
    id?: string
    fileId: string
    jobType: $Enums.ProcessingJobType
    status: $Enums.JobStatus
    priority?: number
    attempts?: number
    maxAttempts?: number
    payload: JsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    scheduledAt?: Date | string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProcessingJobUncheckedCreateInput = {
    id?: string
    fileId: string
    jobType: $Enums.ProcessingJobType
    status: $Enums.JobStatus
    priority?: number
    attempts?: number
    maxAttempts?: number
    payload: JsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    scheduledAt?: Date | string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProcessingJobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    jobType?: EnumProcessingJobTypeFieldUpdateOperationsInput | $Enums.ProcessingJobType
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    priority?: IntFieldUpdateOperationsInput | number
    attempts?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
    payload?: JsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcessingJobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    jobType?: EnumProcessingJobTypeFieldUpdateOperationsInput | $Enums.ProcessingJobType
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    priority?: IntFieldUpdateOperationsInput | number
    attempts?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
    payload?: JsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcessingJobCreateManyInput = {
    id?: string
    fileId: string
    jobType: $Enums.ProcessingJobType
    status: $Enums.JobStatus
    priority?: number
    attempts?: number
    maxAttempts?: number
    payload: JsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    scheduledAt?: Date | string
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProcessingJobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    jobType?: EnumProcessingJobTypeFieldUpdateOperationsInput | $Enums.ProcessingJobType
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    priority?: IntFieldUpdateOperationsInput | number
    attempts?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
    payload?: JsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcessingJobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    jobType?: EnumProcessingJobTypeFieldUpdateOperationsInput | $Enums.ProcessingJobType
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    priority?: IntFieldUpdateOperationsInput | number
    attempts?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
    payload?: JsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessLogCreateInput = {
    id?: string
    fileId: string
    operation: $Enums.AccessOperation
    userId?: string | null
    serviceId?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    success: boolean
    errorCode?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AccessLogUncheckedCreateInput = {
    id?: string
    fileId: string
    operation: $Enums.AccessOperation
    userId?: string | null
    serviceId?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    success: boolean
    errorCode?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AccessLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    operation?: EnumAccessOperationFieldUpdateOperationsInput | $Enums.AccessOperation
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    serviceId?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    success?: BoolFieldUpdateOperationsInput | boolean
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    operation?: EnumAccessOperationFieldUpdateOperationsInput | $Enums.AccessOperation
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    serviceId?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    success?: BoolFieldUpdateOperationsInput | boolean
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessLogCreateManyInput = {
    id?: string
    fileId: string
    operation: $Enums.AccessOperation
    userId?: string | null
    serviceId?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    success: boolean
    errorCode?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AccessLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    operation?: EnumAccessOperationFieldUpdateOperationsInput | $Enums.AccessOperation
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    serviceId?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    success?: BoolFieldUpdateOperationsInput | boolean
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: StringFieldUpdateOperationsInput | string
    operation?: EnumAccessOperationFieldUpdateOperationsInput | $Enums.AccessOperation
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    serviceId?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    success?: BoolFieldUpdateOperationsInput | boolean
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StorageQuotaCreateInput = {
    id?: string
    entityType: $Enums.EntityType
    entityId: string
    quotaBytes: bigint | number
    usedBytes?: bigint | number
    fileCount?: number
    lastUpdated?: Date | string
    createdAt?: Date | string
  }

  export type StorageQuotaUncheckedCreateInput = {
    id?: string
    entityType: $Enums.EntityType
    entityId: string
    quotaBytes: bigint | number
    usedBytes?: bigint | number
    fileCount?: number
    lastUpdated?: Date | string
    createdAt?: Date | string
  }

  export type StorageQuotaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    entityId?: StringFieldUpdateOperationsInput | string
    quotaBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    usedBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    fileCount?: IntFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StorageQuotaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    entityId?: StringFieldUpdateOperationsInput | string
    quotaBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    usedBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    fileCount?: IntFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StorageQuotaCreateManyInput = {
    id?: string
    entityType: $Enums.EntityType
    entityId: string
    quotaBytes: bigint | number
    usedBytes?: bigint | number
    fileCount?: number
    lastUpdated?: Date | string
    createdAt?: Date | string
  }

  export type StorageQuotaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    entityId?: StringFieldUpdateOperationsInput | string
    quotaBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    usedBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    fileCount?: IntFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StorageQuotaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    entityId?: StringFieldUpdateOperationsInput | string
    quotaBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    usedBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    fileCount?: IntFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetentionPolicyCreateInput = {
    id?: string
    name: string
    entityType: $Enums.EntityType
    retentionPeriodDays: number
    jurisdiction: string
    isActive?: boolean
    description?: string | null
    legalBasis?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rules?: RetentionPolicyRuleCreateNestedManyWithoutPolicyInput
  }

  export type RetentionPolicyUncheckedCreateInput = {
    id?: string
    name: string
    entityType: $Enums.EntityType
    retentionPeriodDays: number
    jurisdiction: string
    isActive?: boolean
    description?: string | null
    legalBasis?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rules?: RetentionPolicyRuleUncheckedCreateNestedManyWithoutPolicyInput
  }

  export type RetentionPolicyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    retentionPeriodDays?: IntFieldUpdateOperationsInput | number
    jurisdiction?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    legalBasis?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rules?: RetentionPolicyRuleUpdateManyWithoutPolicyNestedInput
  }

  export type RetentionPolicyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    retentionPeriodDays?: IntFieldUpdateOperationsInput | number
    jurisdiction?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    legalBasis?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rules?: RetentionPolicyRuleUncheckedUpdateManyWithoutPolicyNestedInput
  }

  export type RetentionPolicyCreateManyInput = {
    id?: string
    name: string
    entityType: $Enums.EntityType
    retentionPeriodDays: number
    jurisdiction: string
    isActive?: boolean
    description?: string | null
    legalBasis?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RetentionPolicyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    retentionPeriodDays?: IntFieldUpdateOperationsInput | number
    jurisdiction?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    legalBasis?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetentionPolicyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    retentionPeriodDays?: IntFieldUpdateOperationsInput | number
    jurisdiction?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    legalBasis?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetentionPolicyRuleCreateInput = {
    id?: string
    condition: JsonNullValueInput | InputJsonValue
    action: JsonNullValueInput | InputJsonValue
    priority?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    policy: RetentionPolicyCreateNestedOneWithoutRulesInput
  }

  export type RetentionPolicyRuleUncheckedCreateInput = {
    id?: string
    policyId: string
    condition: JsonNullValueInput | InputJsonValue
    action: JsonNullValueInput | InputJsonValue
    priority?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RetentionPolicyRuleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    condition?: JsonNullValueInput | InputJsonValue
    action?: JsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    policy?: RetentionPolicyUpdateOneRequiredWithoutRulesNestedInput
  }

  export type RetentionPolicyRuleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    policyId?: StringFieldUpdateOperationsInput | string
    condition?: JsonNullValueInput | InputJsonValue
    action?: JsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetentionPolicyRuleCreateManyInput = {
    id?: string
    policyId: string
    condition: JsonNullValueInput | InputJsonValue
    action: JsonNullValueInput | InputJsonValue
    priority?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RetentionPolicyRuleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    condition?: JsonNullValueInput | InputJsonValue
    action?: JsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetentionPolicyRuleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    policyId?: StringFieldUpdateOperationsInput | string
    condition?: JsonNullValueInput | InputJsonValue
    action?: JsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LegalHoldCreateInput = {
    id?: string
    name: string
    description: string
    entityType?: $Enums.EntityType | null
    entityIds?: LegalHoldCreateentityIdsInput | string[]
    fileIds?: LegalHoldCreatefileIdsInput | string[]
    isActive?: boolean
    createdBy: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
  }

  export type LegalHoldUncheckedCreateInput = {
    id?: string
    name: string
    description: string
    entityType?: $Enums.EntityType | null
    entityIds?: LegalHoldCreateentityIdsInput | string[]
    fileIds?: LegalHoldCreatefileIdsInput | string[]
    isActive?: boolean
    createdBy: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
  }

  export type LegalHoldUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    entityType?: NullableEnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType | null
    entityIds?: LegalHoldUpdateentityIdsInput | string[]
    fileIds?: LegalHoldUpdatefileIdsInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LegalHoldUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    entityType?: NullableEnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType | null
    entityIds?: LegalHoldUpdateentityIdsInput | string[]
    fileIds?: LegalHoldUpdatefileIdsInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LegalHoldCreateManyInput = {
    id?: string
    name: string
    description: string
    entityType?: $Enums.EntityType | null
    entityIds?: LegalHoldCreateentityIdsInput | string[]
    fileIds?: LegalHoldCreatefileIdsInput | string[]
    isActive?: boolean
    createdBy: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
  }

  export type LegalHoldUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    entityType?: NullableEnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType | null
    entityIds?: LegalHoldUpdateentityIdsInput | string[]
    fileIds?: LegalHoldUpdatefileIdsInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LegalHoldUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    entityType?: NullableEnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType | null
    entityIds?: LegalHoldUpdateentityIdsInput | string[]
    fileIds?: LegalHoldUpdatefileIdsInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DataDeletionRequestCreateInput = {
    id?: string
    requestType: $Enums.DataDeletionRequestType
    entityType: $Enums.EntityType
    entityId: string
    requestedBy: string
    status?: $Enums.DeletionRequestStatus
    scheduledAt: Date | string
    processedAt?: Date | string | null
    filesDeleted?: number
    errorMessage?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DataDeletionRequestUncheckedCreateInput = {
    id?: string
    requestType: $Enums.DataDeletionRequestType
    entityType: $Enums.EntityType
    entityId: string
    requestedBy: string
    status?: $Enums.DeletionRequestStatus
    scheduledAt: Date | string
    processedAt?: Date | string | null
    filesDeleted?: number
    errorMessage?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DataDeletionRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestType?: EnumDataDeletionRequestTypeFieldUpdateOperationsInput | $Enums.DataDeletionRequestType
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    entityId?: StringFieldUpdateOperationsInput | string
    requestedBy?: StringFieldUpdateOperationsInput | string
    status?: EnumDeletionRequestStatusFieldUpdateOperationsInput | $Enums.DeletionRequestStatus
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    filesDeleted?: IntFieldUpdateOperationsInput | number
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataDeletionRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestType?: EnumDataDeletionRequestTypeFieldUpdateOperationsInput | $Enums.DataDeletionRequestType
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    entityId?: StringFieldUpdateOperationsInput | string
    requestedBy?: StringFieldUpdateOperationsInput | string
    status?: EnumDeletionRequestStatusFieldUpdateOperationsInput | $Enums.DeletionRequestStatus
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    filesDeleted?: IntFieldUpdateOperationsInput | number
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataDeletionRequestCreateManyInput = {
    id?: string
    requestType: $Enums.DataDeletionRequestType
    entityType: $Enums.EntityType
    entityId: string
    requestedBy: string
    status?: $Enums.DeletionRequestStatus
    scheduledAt: Date | string
    processedAt?: Date | string | null
    filesDeleted?: number
    errorMessage?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DataDeletionRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestType?: EnumDataDeletionRequestTypeFieldUpdateOperationsInput | $Enums.DataDeletionRequestType
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    entityId?: StringFieldUpdateOperationsInput | string
    requestedBy?: StringFieldUpdateOperationsInput | string
    status?: EnumDeletionRequestStatusFieldUpdateOperationsInput | $Enums.DeletionRequestStatus
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    filesDeleted?: IntFieldUpdateOperationsInput | number
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataDeletionRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestType?: EnumDataDeletionRequestTypeFieldUpdateOperationsInput | $Enums.DataDeletionRequestType
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    entityId?: StringFieldUpdateOperationsInput | string
    requestedBy?: StringFieldUpdateOperationsInput | string
    status?: EnumDeletionRequestStatusFieldUpdateOperationsInput | $Enums.DeletionRequestStatus
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    filesDeleted?: IntFieldUpdateOperationsInput | number
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetentionAuditLogCreateInput = {
    id?: string
    fileId?: string | null
    entityType?: $Enums.EntityType | null
    entityId?: string | null
    action: $Enums.RetentionAuditAction
    details: JsonNullValueInput | InputJsonValue
    performedBy?: string | null
    createdAt?: Date | string
  }

  export type RetentionAuditLogUncheckedCreateInput = {
    id?: string
    fileId?: string | null
    entityType?: $Enums.EntityType | null
    entityId?: string | null
    action: $Enums.RetentionAuditAction
    details: JsonNullValueInput | InputJsonValue
    performedBy?: string | null
    createdAt?: Date | string
  }

  export type RetentionAuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    entityType?: NullableEnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: EnumRetentionAuditActionFieldUpdateOperationsInput | $Enums.RetentionAuditAction
    details?: JsonNullValueInput | InputJsonValue
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetentionAuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    entityType?: NullableEnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: EnumRetentionAuditActionFieldUpdateOperationsInput | $Enums.RetentionAuditAction
    details?: JsonNullValueInput | InputJsonValue
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetentionAuditLogCreateManyInput = {
    id?: string
    fileId?: string | null
    entityType?: $Enums.EntityType | null
    entityId?: string | null
    action: $Enums.RetentionAuditAction
    details: JsonNullValueInput | InputJsonValue
    performedBy?: string | null
    createdAt?: Date | string
  }

  export type RetentionAuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    entityType?: NullableEnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: EnumRetentionAuditActionFieldUpdateOperationsInput | $Enums.RetentionAuditAction
    details?: JsonNullValueInput | InputJsonValue
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetentionAuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    entityType?: NullableEnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType | null
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: EnumRetentionAuditActionFieldUpdateOperationsInput | $Enums.RetentionAuditAction
    details?: JsonNullValueInput | InputJsonValue
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumEntityTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.EntityType | EnumEntityTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEntityTypeFilter<$PrismaModel> | $Enums.EntityType
  }

  export type EnumFileStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FileStatus | EnumFileStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FileStatus[] | ListEnumFileStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FileStatus[] | ListEnumFileStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFileStatusFilter<$PrismaModel> | $Enums.FileStatus
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumAccessLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.AccessLevel | EnumAccessLevelFieldRefInput<$PrismaModel>
    in?: $Enums.AccessLevel[] | ListEnumAccessLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccessLevel[] | ListEnumAccessLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumAccessLevelFilter<$PrismaModel> | $Enums.AccessLevel
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type FileRelationshipListRelationFilter = {
    every?: FileRelationshipWhereInput
    some?: FileRelationshipWhereInput
    none?: FileRelationshipWhereInput
  }

  export type UploadSessionFileListRelationFilter = {
    every?: UploadSessionFileWhereInput
    some?: UploadSessionFileWhereInput
    none?: UploadSessionFileWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type FileRelationshipOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UploadSessionFileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FileMetadataCountOrderByAggregateInput = {
    id?: SortOrder
    originalName?: SortOrder
    fileName?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    path?: SortOrder
    url?: SortOrder
    cdnUrl?: SortOrder
    uploadedBy?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    status?: SortOrder
    processingResults?: SortOrder
    thumbnails?: SortOrder
    accessLevel?: SortOrder
    permissions?: SortOrder
    metadata?: SortOrder
    tags?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type FileMetadataAvgOrderByAggregateInput = {
    size?: SortOrder
  }

  export type FileMetadataMaxOrderByAggregateInput = {
    id?: SortOrder
    originalName?: SortOrder
    fileName?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    path?: SortOrder
    url?: SortOrder
    cdnUrl?: SortOrder
    uploadedBy?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    status?: SortOrder
    accessLevel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type FileMetadataMinOrderByAggregateInput = {
    id?: SortOrder
    originalName?: SortOrder
    fileName?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    path?: SortOrder
    url?: SortOrder
    cdnUrl?: SortOrder
    uploadedBy?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    status?: SortOrder
    accessLevel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type FileMetadataSumOrderByAggregateInput = {
    size?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumEntityTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EntityType | EnumEntityTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEntityTypeWithAggregatesFilter<$PrismaModel> | $Enums.EntityType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEntityTypeFilter<$PrismaModel>
    _max?: NestedEnumEntityTypeFilter<$PrismaModel>
  }

  export type EnumFileStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FileStatus | EnumFileStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FileStatus[] | ListEnumFileStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FileStatus[] | ListEnumFileStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFileStatusWithAggregatesFilter<$PrismaModel> | $Enums.FileStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFileStatusFilter<$PrismaModel>
    _max?: NestedEnumFileStatusFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumAccessLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccessLevel | EnumAccessLevelFieldRefInput<$PrismaModel>
    in?: $Enums.AccessLevel[] | ListEnumAccessLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccessLevel[] | ListEnumAccessLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumAccessLevelWithAggregatesFilter<$PrismaModel> | $Enums.AccessLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccessLevelFilter<$PrismaModel>
    _max?: NestedEnumAccessLevelFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumRelationshipTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RelationshipType | EnumRelationshipTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RelationshipType[] | ListEnumRelationshipTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RelationshipType[] | ListEnumRelationshipTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRelationshipTypeFilter<$PrismaModel> | $Enums.RelationshipType
  }

  export type FileMetadataRelationFilter = {
    is?: FileMetadataWhereInput
    isNot?: FileMetadataWhereInput
  }

  export type FileRelationshipParentIdChildIdRelationshipTypeCompoundUniqueInput = {
    parentId: string
    childId: string
    relationshipType: $Enums.RelationshipType
  }

  export type FileRelationshipCountOrderByAggregateInput = {
    id?: SortOrder
    parentId?: SortOrder
    childId?: SortOrder
    relationshipType?: SortOrder
    createdAt?: SortOrder
  }

  export type FileRelationshipMaxOrderByAggregateInput = {
    id?: SortOrder
    parentId?: SortOrder
    childId?: SortOrder
    relationshipType?: SortOrder
    createdAt?: SortOrder
  }

  export type FileRelationshipMinOrderByAggregateInput = {
    id?: SortOrder
    parentId?: SortOrder
    childId?: SortOrder
    relationshipType?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumRelationshipTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RelationshipType | EnumRelationshipTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RelationshipType[] | ListEnumRelationshipTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RelationshipType[] | ListEnumRelationshipTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRelationshipTypeWithAggregatesFilter<$PrismaModel> | $Enums.RelationshipType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRelationshipTypeFilter<$PrismaModel>
    _max?: NestedEnumRelationshipTypeFilter<$PrismaModel>
  }

  export type EnumUploadStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UploadStatus | EnumUploadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UploadStatus[] | ListEnumUploadStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UploadStatus[] | ListEnumUploadStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUploadStatusFilter<$PrismaModel> | $Enums.UploadStatus
  }

  export type UploadSessionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    uploadedBy?: SortOrder
    status?: SortOrder
    totalFiles?: SortOrder
    uploadedFiles?: SortOrder
    failedFiles?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type UploadSessionAvgOrderByAggregateInput = {
    totalFiles?: SortOrder
    uploadedFiles?: SortOrder
    failedFiles?: SortOrder
  }

  export type UploadSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    uploadedBy?: SortOrder
    status?: SortOrder
    totalFiles?: SortOrder
    uploadedFiles?: SortOrder
    failedFiles?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type UploadSessionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    uploadedBy?: SortOrder
    status?: SortOrder
    totalFiles?: SortOrder
    uploadedFiles?: SortOrder
    failedFiles?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type UploadSessionSumOrderByAggregateInput = {
    totalFiles?: SortOrder
    uploadedFiles?: SortOrder
    failedFiles?: SortOrder
  }

  export type EnumUploadStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UploadStatus | EnumUploadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UploadStatus[] | ListEnumUploadStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UploadStatus[] | ListEnumUploadStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUploadStatusWithAggregatesFilter<$PrismaModel> | $Enums.UploadStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUploadStatusFilter<$PrismaModel>
    _max?: NestedEnumUploadStatusFilter<$PrismaModel>
  }

  export type UploadSessionRelationFilter = {
    is?: UploadSessionWhereInput
    isNot?: UploadSessionWhereInput
  }

  export type FileMetadataNullableRelationFilter = {
    is?: FileMetadataWhereInput | null
    isNot?: FileMetadataWhereInput | null
  }

  export type UploadSessionFileCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    fileId?: SortOrder
    originalName?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    processingOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UploadSessionFileAvgOrderByAggregateInput = {
    processingOrder?: SortOrder
  }

  export type UploadSessionFileMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    fileId?: SortOrder
    originalName?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    processingOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UploadSessionFileMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    fileId?: SortOrder
    originalName?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    processingOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UploadSessionFileSumOrderByAggregateInput = {
    processingOrder?: SortOrder
  }

  export type EnumProcessingJobTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ProcessingJobType | EnumProcessingJobTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProcessingJobType[] | ListEnumProcessingJobTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProcessingJobType[] | ListEnumProcessingJobTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumProcessingJobTypeFilter<$PrismaModel> | $Enums.ProcessingJobType
  }

  export type EnumJobStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.JobStatus | EnumJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumJobStatusFilter<$PrismaModel> | $Enums.JobStatus
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ProcessingJobCountOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    jobType?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
    payload?: SortOrder
    result?: SortOrder
    errorMessage?: SortOrder
    scheduledAt?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProcessingJobAvgOrderByAggregateInput = {
    priority?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
  }

  export type ProcessingJobMaxOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    jobType?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
    errorMessage?: SortOrder
    scheduledAt?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProcessingJobMinOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    jobType?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
    errorMessage?: SortOrder
    scheduledAt?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProcessingJobSumOrderByAggregateInput = {
    priority?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
  }

  export type EnumProcessingJobTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProcessingJobType | EnumProcessingJobTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProcessingJobType[] | ListEnumProcessingJobTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProcessingJobType[] | ListEnumProcessingJobTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumProcessingJobTypeWithAggregatesFilter<$PrismaModel> | $Enums.ProcessingJobType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProcessingJobTypeFilter<$PrismaModel>
    _max?: NestedEnumProcessingJobTypeFilter<$PrismaModel>
  }

  export type EnumJobStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JobStatus | EnumJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumJobStatusWithAggregatesFilter<$PrismaModel> | $Enums.JobStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJobStatusFilter<$PrismaModel>
    _max?: NestedEnumJobStatusFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumAccessOperationFilter<$PrismaModel = never> = {
    equals?: $Enums.AccessOperation | EnumAccessOperationFieldRefInput<$PrismaModel>
    in?: $Enums.AccessOperation[] | ListEnumAccessOperationFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccessOperation[] | ListEnumAccessOperationFieldRefInput<$PrismaModel>
    not?: NestedEnumAccessOperationFilter<$PrismaModel> | $Enums.AccessOperation
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type AccessLogCountOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    operation?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    success?: SortOrder
    errorCode?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type AccessLogMaxOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    operation?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    success?: SortOrder
    errorCode?: SortOrder
    createdAt?: SortOrder
  }

  export type AccessLogMinOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    operation?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    success?: SortOrder
    errorCode?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumAccessOperationWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccessOperation | EnumAccessOperationFieldRefInput<$PrismaModel>
    in?: $Enums.AccessOperation[] | ListEnumAccessOperationFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccessOperation[] | ListEnumAccessOperationFieldRefInput<$PrismaModel>
    not?: NestedEnumAccessOperationWithAggregatesFilter<$PrismaModel> | $Enums.AccessOperation
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccessOperationFilter<$PrismaModel>
    _max?: NestedEnumAccessOperationFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type StorageQuotaEntityTypeEntityIdCompoundUniqueInput = {
    entityType: $Enums.EntityType
    entityId: string
  }

  export type StorageQuotaCountOrderByAggregateInput = {
    id?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    quotaBytes?: SortOrder
    usedBytes?: SortOrder
    fileCount?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
  }

  export type StorageQuotaAvgOrderByAggregateInput = {
    quotaBytes?: SortOrder
    usedBytes?: SortOrder
    fileCount?: SortOrder
  }

  export type StorageQuotaMaxOrderByAggregateInput = {
    id?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    quotaBytes?: SortOrder
    usedBytes?: SortOrder
    fileCount?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
  }

  export type StorageQuotaMinOrderByAggregateInput = {
    id?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    quotaBytes?: SortOrder
    usedBytes?: SortOrder
    fileCount?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
  }

  export type StorageQuotaSumOrderByAggregateInput = {
    quotaBytes?: SortOrder
    usedBytes?: SortOrder
    fileCount?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type RetentionPolicyRuleListRelationFilter = {
    every?: RetentionPolicyRuleWhereInput
    some?: RetentionPolicyRuleWhereInput
    none?: RetentionPolicyRuleWhereInput
  }

  export type RetentionPolicyRuleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RetentionPolicyEntityTypeJurisdictionCompoundUniqueInput = {
    entityType: $Enums.EntityType
    jurisdiction: string
  }

  export type RetentionPolicyCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    entityType?: SortOrder
    retentionPeriodDays?: SortOrder
    jurisdiction?: SortOrder
    isActive?: SortOrder
    description?: SortOrder
    legalBasis?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RetentionPolicyAvgOrderByAggregateInput = {
    retentionPeriodDays?: SortOrder
  }

  export type RetentionPolicyMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    entityType?: SortOrder
    retentionPeriodDays?: SortOrder
    jurisdiction?: SortOrder
    isActive?: SortOrder
    description?: SortOrder
    legalBasis?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RetentionPolicyMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    entityType?: SortOrder
    retentionPeriodDays?: SortOrder
    jurisdiction?: SortOrder
    isActive?: SortOrder
    description?: SortOrder
    legalBasis?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RetentionPolicySumOrderByAggregateInput = {
    retentionPeriodDays?: SortOrder
  }

  export type RetentionPolicyRelationFilter = {
    is?: RetentionPolicyWhereInput
    isNot?: RetentionPolicyWhereInput
  }

  export type RetentionPolicyRuleCountOrderByAggregateInput = {
    id?: SortOrder
    policyId?: SortOrder
    condition?: SortOrder
    action?: SortOrder
    priority?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RetentionPolicyRuleAvgOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type RetentionPolicyRuleMaxOrderByAggregateInput = {
    id?: SortOrder
    policyId?: SortOrder
    priority?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RetentionPolicyRuleMinOrderByAggregateInput = {
    id?: SortOrder
    policyId?: SortOrder
    priority?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RetentionPolicyRuleSumOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type EnumEntityTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.EntityType | EnumEntityTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumEntityTypeNullableFilter<$PrismaModel> | $Enums.EntityType | null
  }

  export type LegalHoldCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    entityType?: SortOrder
    entityIds?: SortOrder
    fileIds?: SortOrder
    isActive?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type LegalHoldMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    entityType?: SortOrder
    isActive?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type LegalHoldMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    entityType?: SortOrder
    isActive?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type EnumEntityTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EntityType | EnumEntityTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumEntityTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.EntityType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumEntityTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumEntityTypeNullableFilter<$PrismaModel>
  }

  export type EnumDataDeletionRequestTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DataDeletionRequestType | EnumDataDeletionRequestTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DataDeletionRequestType[] | ListEnumDataDeletionRequestTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DataDeletionRequestType[] | ListEnumDataDeletionRequestTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDataDeletionRequestTypeFilter<$PrismaModel> | $Enums.DataDeletionRequestType
  }

  export type EnumDeletionRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DeletionRequestStatus | EnumDeletionRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeletionRequestStatus[] | ListEnumDeletionRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeletionRequestStatus[] | ListEnumDeletionRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDeletionRequestStatusFilter<$PrismaModel> | $Enums.DeletionRequestStatus
  }

  export type DataDeletionRequestCountOrderByAggregateInput = {
    id?: SortOrder
    requestType?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    requestedBy?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    processedAt?: SortOrder
    filesDeleted?: SortOrder
    errorMessage?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DataDeletionRequestAvgOrderByAggregateInput = {
    filesDeleted?: SortOrder
  }

  export type DataDeletionRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    requestType?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    requestedBy?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    processedAt?: SortOrder
    filesDeleted?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DataDeletionRequestMinOrderByAggregateInput = {
    id?: SortOrder
    requestType?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    requestedBy?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    processedAt?: SortOrder
    filesDeleted?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DataDeletionRequestSumOrderByAggregateInput = {
    filesDeleted?: SortOrder
  }

  export type EnumDataDeletionRequestTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DataDeletionRequestType | EnumDataDeletionRequestTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DataDeletionRequestType[] | ListEnumDataDeletionRequestTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DataDeletionRequestType[] | ListEnumDataDeletionRequestTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDataDeletionRequestTypeWithAggregatesFilter<$PrismaModel> | $Enums.DataDeletionRequestType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDataDeletionRequestTypeFilter<$PrismaModel>
    _max?: NestedEnumDataDeletionRequestTypeFilter<$PrismaModel>
  }

  export type EnumDeletionRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeletionRequestStatus | EnumDeletionRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeletionRequestStatus[] | ListEnumDeletionRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeletionRequestStatus[] | ListEnumDeletionRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDeletionRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.DeletionRequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeletionRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumDeletionRequestStatusFilter<$PrismaModel>
  }

  export type EnumRetentionAuditActionFilter<$PrismaModel = never> = {
    equals?: $Enums.RetentionAuditAction | EnumRetentionAuditActionFieldRefInput<$PrismaModel>
    in?: $Enums.RetentionAuditAction[] | ListEnumRetentionAuditActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.RetentionAuditAction[] | ListEnumRetentionAuditActionFieldRefInput<$PrismaModel>
    not?: NestedEnumRetentionAuditActionFilter<$PrismaModel> | $Enums.RetentionAuditAction
  }

  export type RetentionAuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    action?: SortOrder
    details?: SortOrder
    performedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type RetentionAuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    action?: SortOrder
    performedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type RetentionAuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    fileId?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    action?: SortOrder
    performedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumRetentionAuditActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RetentionAuditAction | EnumRetentionAuditActionFieldRefInput<$PrismaModel>
    in?: $Enums.RetentionAuditAction[] | ListEnumRetentionAuditActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.RetentionAuditAction[] | ListEnumRetentionAuditActionFieldRefInput<$PrismaModel>
    not?: NestedEnumRetentionAuditActionWithAggregatesFilter<$PrismaModel> | $Enums.RetentionAuditAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRetentionAuditActionFilter<$PrismaModel>
    _max?: NestedEnumRetentionAuditActionFilter<$PrismaModel>
  }

  export type FileMetadataCreatetagsInput = {
    set: string[]
  }

  export type FileRelationshipCreateNestedManyWithoutParentInput = {
    create?: XOR<FileRelationshipCreateWithoutParentInput, FileRelationshipUncheckedCreateWithoutParentInput> | FileRelationshipCreateWithoutParentInput[] | FileRelationshipUncheckedCreateWithoutParentInput[]
    connectOrCreate?: FileRelationshipCreateOrConnectWithoutParentInput | FileRelationshipCreateOrConnectWithoutParentInput[]
    createMany?: FileRelationshipCreateManyParentInputEnvelope
    connect?: FileRelationshipWhereUniqueInput | FileRelationshipWhereUniqueInput[]
  }

  export type FileRelationshipCreateNestedManyWithoutChildInput = {
    create?: XOR<FileRelationshipCreateWithoutChildInput, FileRelationshipUncheckedCreateWithoutChildInput> | FileRelationshipCreateWithoutChildInput[] | FileRelationshipUncheckedCreateWithoutChildInput[]
    connectOrCreate?: FileRelationshipCreateOrConnectWithoutChildInput | FileRelationshipCreateOrConnectWithoutChildInput[]
    createMany?: FileRelationshipCreateManyChildInputEnvelope
    connect?: FileRelationshipWhereUniqueInput | FileRelationshipWhereUniqueInput[]
  }

  export type UploadSessionFileCreateNestedManyWithoutFileInput = {
    create?: XOR<UploadSessionFileCreateWithoutFileInput, UploadSessionFileUncheckedCreateWithoutFileInput> | UploadSessionFileCreateWithoutFileInput[] | UploadSessionFileUncheckedCreateWithoutFileInput[]
    connectOrCreate?: UploadSessionFileCreateOrConnectWithoutFileInput | UploadSessionFileCreateOrConnectWithoutFileInput[]
    createMany?: UploadSessionFileCreateManyFileInputEnvelope
    connect?: UploadSessionFileWhereUniqueInput | UploadSessionFileWhereUniqueInput[]
  }

  export type FileRelationshipUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<FileRelationshipCreateWithoutParentInput, FileRelationshipUncheckedCreateWithoutParentInput> | FileRelationshipCreateWithoutParentInput[] | FileRelationshipUncheckedCreateWithoutParentInput[]
    connectOrCreate?: FileRelationshipCreateOrConnectWithoutParentInput | FileRelationshipCreateOrConnectWithoutParentInput[]
    createMany?: FileRelationshipCreateManyParentInputEnvelope
    connect?: FileRelationshipWhereUniqueInput | FileRelationshipWhereUniqueInput[]
  }

  export type FileRelationshipUncheckedCreateNestedManyWithoutChildInput = {
    create?: XOR<FileRelationshipCreateWithoutChildInput, FileRelationshipUncheckedCreateWithoutChildInput> | FileRelationshipCreateWithoutChildInput[] | FileRelationshipUncheckedCreateWithoutChildInput[]
    connectOrCreate?: FileRelationshipCreateOrConnectWithoutChildInput | FileRelationshipCreateOrConnectWithoutChildInput[]
    createMany?: FileRelationshipCreateManyChildInputEnvelope
    connect?: FileRelationshipWhereUniqueInput | FileRelationshipWhereUniqueInput[]
  }

  export type UploadSessionFileUncheckedCreateNestedManyWithoutFileInput = {
    create?: XOR<UploadSessionFileCreateWithoutFileInput, UploadSessionFileUncheckedCreateWithoutFileInput> | UploadSessionFileCreateWithoutFileInput[] | UploadSessionFileUncheckedCreateWithoutFileInput[]
    connectOrCreate?: UploadSessionFileCreateOrConnectWithoutFileInput | UploadSessionFileCreateOrConnectWithoutFileInput[]
    createMany?: UploadSessionFileCreateManyFileInputEnvelope
    connect?: UploadSessionFileWhereUniqueInput | UploadSessionFileWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumEntityTypeFieldUpdateOperationsInput = {
    set?: $Enums.EntityType
  }

  export type EnumFileStatusFieldUpdateOperationsInput = {
    set?: $Enums.FileStatus
  }

  export type EnumAccessLevelFieldUpdateOperationsInput = {
    set?: $Enums.AccessLevel
  }

  export type FileMetadataUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type FileRelationshipUpdateManyWithoutParentNestedInput = {
    create?: XOR<FileRelationshipCreateWithoutParentInput, FileRelationshipUncheckedCreateWithoutParentInput> | FileRelationshipCreateWithoutParentInput[] | FileRelationshipUncheckedCreateWithoutParentInput[]
    connectOrCreate?: FileRelationshipCreateOrConnectWithoutParentInput | FileRelationshipCreateOrConnectWithoutParentInput[]
    upsert?: FileRelationshipUpsertWithWhereUniqueWithoutParentInput | FileRelationshipUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: FileRelationshipCreateManyParentInputEnvelope
    set?: FileRelationshipWhereUniqueInput | FileRelationshipWhereUniqueInput[]
    disconnect?: FileRelationshipWhereUniqueInput | FileRelationshipWhereUniqueInput[]
    delete?: FileRelationshipWhereUniqueInput | FileRelationshipWhereUniqueInput[]
    connect?: FileRelationshipWhereUniqueInput | FileRelationshipWhereUniqueInput[]
    update?: FileRelationshipUpdateWithWhereUniqueWithoutParentInput | FileRelationshipUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: FileRelationshipUpdateManyWithWhereWithoutParentInput | FileRelationshipUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: FileRelationshipScalarWhereInput | FileRelationshipScalarWhereInput[]
  }

  export type FileRelationshipUpdateManyWithoutChildNestedInput = {
    create?: XOR<FileRelationshipCreateWithoutChildInput, FileRelationshipUncheckedCreateWithoutChildInput> | FileRelationshipCreateWithoutChildInput[] | FileRelationshipUncheckedCreateWithoutChildInput[]
    connectOrCreate?: FileRelationshipCreateOrConnectWithoutChildInput | FileRelationshipCreateOrConnectWithoutChildInput[]
    upsert?: FileRelationshipUpsertWithWhereUniqueWithoutChildInput | FileRelationshipUpsertWithWhereUniqueWithoutChildInput[]
    createMany?: FileRelationshipCreateManyChildInputEnvelope
    set?: FileRelationshipWhereUniqueInput | FileRelationshipWhereUniqueInput[]
    disconnect?: FileRelationshipWhereUniqueInput | FileRelationshipWhereUniqueInput[]
    delete?: FileRelationshipWhereUniqueInput | FileRelationshipWhereUniqueInput[]
    connect?: FileRelationshipWhereUniqueInput | FileRelationshipWhereUniqueInput[]
    update?: FileRelationshipUpdateWithWhereUniqueWithoutChildInput | FileRelationshipUpdateWithWhereUniqueWithoutChildInput[]
    updateMany?: FileRelationshipUpdateManyWithWhereWithoutChildInput | FileRelationshipUpdateManyWithWhereWithoutChildInput[]
    deleteMany?: FileRelationshipScalarWhereInput | FileRelationshipScalarWhereInput[]
  }

  export type UploadSessionFileUpdateManyWithoutFileNestedInput = {
    create?: XOR<UploadSessionFileCreateWithoutFileInput, UploadSessionFileUncheckedCreateWithoutFileInput> | UploadSessionFileCreateWithoutFileInput[] | UploadSessionFileUncheckedCreateWithoutFileInput[]
    connectOrCreate?: UploadSessionFileCreateOrConnectWithoutFileInput | UploadSessionFileCreateOrConnectWithoutFileInput[]
    upsert?: UploadSessionFileUpsertWithWhereUniqueWithoutFileInput | UploadSessionFileUpsertWithWhereUniqueWithoutFileInput[]
    createMany?: UploadSessionFileCreateManyFileInputEnvelope
    set?: UploadSessionFileWhereUniqueInput | UploadSessionFileWhereUniqueInput[]
    disconnect?: UploadSessionFileWhereUniqueInput | UploadSessionFileWhereUniqueInput[]
    delete?: UploadSessionFileWhereUniqueInput | UploadSessionFileWhereUniqueInput[]
    connect?: UploadSessionFileWhereUniqueInput | UploadSessionFileWhereUniqueInput[]
    update?: UploadSessionFileUpdateWithWhereUniqueWithoutFileInput | UploadSessionFileUpdateWithWhereUniqueWithoutFileInput[]
    updateMany?: UploadSessionFileUpdateManyWithWhereWithoutFileInput | UploadSessionFileUpdateManyWithWhereWithoutFileInput[]
    deleteMany?: UploadSessionFileScalarWhereInput | UploadSessionFileScalarWhereInput[]
  }

  export type FileRelationshipUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<FileRelationshipCreateWithoutParentInput, FileRelationshipUncheckedCreateWithoutParentInput> | FileRelationshipCreateWithoutParentInput[] | FileRelationshipUncheckedCreateWithoutParentInput[]
    connectOrCreate?: FileRelationshipCreateOrConnectWithoutParentInput | FileRelationshipCreateOrConnectWithoutParentInput[]
    upsert?: FileRelationshipUpsertWithWhereUniqueWithoutParentInput | FileRelationshipUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: FileRelationshipCreateManyParentInputEnvelope
    set?: FileRelationshipWhereUniqueInput | FileRelationshipWhereUniqueInput[]
    disconnect?: FileRelationshipWhereUniqueInput | FileRelationshipWhereUniqueInput[]
    delete?: FileRelationshipWhereUniqueInput | FileRelationshipWhereUniqueInput[]
    connect?: FileRelationshipWhereUniqueInput | FileRelationshipWhereUniqueInput[]
    update?: FileRelationshipUpdateWithWhereUniqueWithoutParentInput | FileRelationshipUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: FileRelationshipUpdateManyWithWhereWithoutParentInput | FileRelationshipUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: FileRelationshipScalarWhereInput | FileRelationshipScalarWhereInput[]
  }

  export type FileRelationshipUncheckedUpdateManyWithoutChildNestedInput = {
    create?: XOR<FileRelationshipCreateWithoutChildInput, FileRelationshipUncheckedCreateWithoutChildInput> | FileRelationshipCreateWithoutChildInput[] | FileRelationshipUncheckedCreateWithoutChildInput[]
    connectOrCreate?: FileRelationshipCreateOrConnectWithoutChildInput | FileRelationshipCreateOrConnectWithoutChildInput[]
    upsert?: FileRelationshipUpsertWithWhereUniqueWithoutChildInput | FileRelationshipUpsertWithWhereUniqueWithoutChildInput[]
    createMany?: FileRelationshipCreateManyChildInputEnvelope
    set?: FileRelationshipWhereUniqueInput | FileRelationshipWhereUniqueInput[]
    disconnect?: FileRelationshipWhereUniqueInput | FileRelationshipWhereUniqueInput[]
    delete?: FileRelationshipWhereUniqueInput | FileRelationshipWhereUniqueInput[]
    connect?: FileRelationshipWhereUniqueInput | FileRelationshipWhereUniqueInput[]
    update?: FileRelationshipUpdateWithWhereUniqueWithoutChildInput | FileRelationshipUpdateWithWhereUniqueWithoutChildInput[]
    updateMany?: FileRelationshipUpdateManyWithWhereWithoutChildInput | FileRelationshipUpdateManyWithWhereWithoutChildInput[]
    deleteMany?: FileRelationshipScalarWhereInput | FileRelationshipScalarWhereInput[]
  }

  export type UploadSessionFileUncheckedUpdateManyWithoutFileNestedInput = {
    create?: XOR<UploadSessionFileCreateWithoutFileInput, UploadSessionFileUncheckedCreateWithoutFileInput> | UploadSessionFileCreateWithoutFileInput[] | UploadSessionFileUncheckedCreateWithoutFileInput[]
    connectOrCreate?: UploadSessionFileCreateOrConnectWithoutFileInput | UploadSessionFileCreateOrConnectWithoutFileInput[]
    upsert?: UploadSessionFileUpsertWithWhereUniqueWithoutFileInput | UploadSessionFileUpsertWithWhereUniqueWithoutFileInput[]
    createMany?: UploadSessionFileCreateManyFileInputEnvelope
    set?: UploadSessionFileWhereUniqueInput | UploadSessionFileWhereUniqueInput[]
    disconnect?: UploadSessionFileWhereUniqueInput | UploadSessionFileWhereUniqueInput[]
    delete?: UploadSessionFileWhereUniqueInput | UploadSessionFileWhereUniqueInput[]
    connect?: UploadSessionFileWhereUniqueInput | UploadSessionFileWhereUniqueInput[]
    update?: UploadSessionFileUpdateWithWhereUniqueWithoutFileInput | UploadSessionFileUpdateWithWhereUniqueWithoutFileInput[]
    updateMany?: UploadSessionFileUpdateManyWithWhereWithoutFileInput | UploadSessionFileUpdateManyWithWhereWithoutFileInput[]
    deleteMany?: UploadSessionFileScalarWhereInput | UploadSessionFileScalarWhereInput[]
  }

  export type FileMetadataCreateNestedOneWithoutParentRelationshipsInput = {
    create?: XOR<FileMetadataCreateWithoutParentRelationshipsInput, FileMetadataUncheckedCreateWithoutParentRelationshipsInput>
    connectOrCreate?: FileMetadataCreateOrConnectWithoutParentRelationshipsInput
    connect?: FileMetadataWhereUniqueInput
  }

  export type FileMetadataCreateNestedOneWithoutChildRelationshipsInput = {
    create?: XOR<FileMetadataCreateWithoutChildRelationshipsInput, FileMetadataUncheckedCreateWithoutChildRelationshipsInput>
    connectOrCreate?: FileMetadataCreateOrConnectWithoutChildRelationshipsInput
    connect?: FileMetadataWhereUniqueInput
  }

  export type EnumRelationshipTypeFieldUpdateOperationsInput = {
    set?: $Enums.RelationshipType
  }

  export type FileMetadataUpdateOneRequiredWithoutParentRelationshipsNestedInput = {
    create?: XOR<FileMetadataCreateWithoutParentRelationshipsInput, FileMetadataUncheckedCreateWithoutParentRelationshipsInput>
    connectOrCreate?: FileMetadataCreateOrConnectWithoutParentRelationshipsInput
    upsert?: FileMetadataUpsertWithoutParentRelationshipsInput
    connect?: FileMetadataWhereUniqueInput
    update?: XOR<XOR<FileMetadataUpdateToOneWithWhereWithoutParentRelationshipsInput, FileMetadataUpdateWithoutParentRelationshipsInput>, FileMetadataUncheckedUpdateWithoutParentRelationshipsInput>
  }

  export type FileMetadataUpdateOneRequiredWithoutChildRelationshipsNestedInput = {
    create?: XOR<FileMetadataCreateWithoutChildRelationshipsInput, FileMetadataUncheckedCreateWithoutChildRelationshipsInput>
    connectOrCreate?: FileMetadataCreateOrConnectWithoutChildRelationshipsInput
    upsert?: FileMetadataUpsertWithoutChildRelationshipsInput
    connect?: FileMetadataWhereUniqueInput
    update?: XOR<XOR<FileMetadataUpdateToOneWithWhereWithoutChildRelationshipsInput, FileMetadataUpdateWithoutChildRelationshipsInput>, FileMetadataUncheckedUpdateWithoutChildRelationshipsInput>
  }

  export type UploadSessionFileCreateNestedManyWithoutSessionInput = {
    create?: XOR<UploadSessionFileCreateWithoutSessionInput, UploadSessionFileUncheckedCreateWithoutSessionInput> | UploadSessionFileCreateWithoutSessionInput[] | UploadSessionFileUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: UploadSessionFileCreateOrConnectWithoutSessionInput | UploadSessionFileCreateOrConnectWithoutSessionInput[]
    createMany?: UploadSessionFileCreateManySessionInputEnvelope
    connect?: UploadSessionFileWhereUniqueInput | UploadSessionFileWhereUniqueInput[]
  }

  export type UploadSessionFileUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<UploadSessionFileCreateWithoutSessionInput, UploadSessionFileUncheckedCreateWithoutSessionInput> | UploadSessionFileCreateWithoutSessionInput[] | UploadSessionFileUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: UploadSessionFileCreateOrConnectWithoutSessionInput | UploadSessionFileCreateOrConnectWithoutSessionInput[]
    createMany?: UploadSessionFileCreateManySessionInputEnvelope
    connect?: UploadSessionFileWhereUniqueInput | UploadSessionFileWhereUniqueInput[]
  }

  export type EnumUploadStatusFieldUpdateOperationsInput = {
    set?: $Enums.UploadStatus
  }

  export type UploadSessionFileUpdateManyWithoutSessionNestedInput = {
    create?: XOR<UploadSessionFileCreateWithoutSessionInput, UploadSessionFileUncheckedCreateWithoutSessionInput> | UploadSessionFileCreateWithoutSessionInput[] | UploadSessionFileUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: UploadSessionFileCreateOrConnectWithoutSessionInput | UploadSessionFileCreateOrConnectWithoutSessionInput[]
    upsert?: UploadSessionFileUpsertWithWhereUniqueWithoutSessionInput | UploadSessionFileUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: UploadSessionFileCreateManySessionInputEnvelope
    set?: UploadSessionFileWhereUniqueInput | UploadSessionFileWhereUniqueInput[]
    disconnect?: UploadSessionFileWhereUniqueInput | UploadSessionFileWhereUniqueInput[]
    delete?: UploadSessionFileWhereUniqueInput | UploadSessionFileWhereUniqueInput[]
    connect?: UploadSessionFileWhereUniqueInput | UploadSessionFileWhereUniqueInput[]
    update?: UploadSessionFileUpdateWithWhereUniqueWithoutSessionInput | UploadSessionFileUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: UploadSessionFileUpdateManyWithWhereWithoutSessionInput | UploadSessionFileUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: UploadSessionFileScalarWhereInput | UploadSessionFileScalarWhereInput[]
  }

  export type UploadSessionFileUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<UploadSessionFileCreateWithoutSessionInput, UploadSessionFileUncheckedCreateWithoutSessionInput> | UploadSessionFileCreateWithoutSessionInput[] | UploadSessionFileUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: UploadSessionFileCreateOrConnectWithoutSessionInput | UploadSessionFileCreateOrConnectWithoutSessionInput[]
    upsert?: UploadSessionFileUpsertWithWhereUniqueWithoutSessionInput | UploadSessionFileUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: UploadSessionFileCreateManySessionInputEnvelope
    set?: UploadSessionFileWhereUniqueInput | UploadSessionFileWhereUniqueInput[]
    disconnect?: UploadSessionFileWhereUniqueInput | UploadSessionFileWhereUniqueInput[]
    delete?: UploadSessionFileWhereUniqueInput | UploadSessionFileWhereUniqueInput[]
    connect?: UploadSessionFileWhereUniqueInput | UploadSessionFileWhereUniqueInput[]
    update?: UploadSessionFileUpdateWithWhereUniqueWithoutSessionInput | UploadSessionFileUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: UploadSessionFileUpdateManyWithWhereWithoutSessionInput | UploadSessionFileUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: UploadSessionFileScalarWhereInput | UploadSessionFileScalarWhereInput[]
  }

  export type UploadSessionCreateNestedOneWithoutFilesInput = {
    create?: XOR<UploadSessionCreateWithoutFilesInput, UploadSessionUncheckedCreateWithoutFilesInput>
    connectOrCreate?: UploadSessionCreateOrConnectWithoutFilesInput
    connect?: UploadSessionWhereUniqueInput
  }

  export type FileMetadataCreateNestedOneWithoutSessionFilesInput = {
    create?: XOR<FileMetadataCreateWithoutSessionFilesInput, FileMetadataUncheckedCreateWithoutSessionFilesInput>
    connectOrCreate?: FileMetadataCreateOrConnectWithoutSessionFilesInput
    connect?: FileMetadataWhereUniqueInput
  }

  export type UploadSessionUpdateOneRequiredWithoutFilesNestedInput = {
    create?: XOR<UploadSessionCreateWithoutFilesInput, UploadSessionUncheckedCreateWithoutFilesInput>
    connectOrCreate?: UploadSessionCreateOrConnectWithoutFilesInput
    upsert?: UploadSessionUpsertWithoutFilesInput
    connect?: UploadSessionWhereUniqueInput
    update?: XOR<XOR<UploadSessionUpdateToOneWithWhereWithoutFilesInput, UploadSessionUpdateWithoutFilesInput>, UploadSessionUncheckedUpdateWithoutFilesInput>
  }

  export type FileMetadataUpdateOneWithoutSessionFilesNestedInput = {
    create?: XOR<FileMetadataCreateWithoutSessionFilesInput, FileMetadataUncheckedCreateWithoutSessionFilesInput>
    connectOrCreate?: FileMetadataCreateOrConnectWithoutSessionFilesInput
    upsert?: FileMetadataUpsertWithoutSessionFilesInput
    disconnect?: FileMetadataWhereInput | boolean
    delete?: FileMetadataWhereInput | boolean
    connect?: FileMetadataWhereUniqueInput
    update?: XOR<XOR<FileMetadataUpdateToOneWithWhereWithoutSessionFilesInput, FileMetadataUpdateWithoutSessionFilesInput>, FileMetadataUncheckedUpdateWithoutSessionFilesInput>
  }

  export type EnumProcessingJobTypeFieldUpdateOperationsInput = {
    set?: $Enums.ProcessingJobType
  }

  export type EnumJobStatusFieldUpdateOperationsInput = {
    set?: $Enums.JobStatus
  }

  export type EnumAccessOperationFieldUpdateOperationsInput = {
    set?: $Enums.AccessOperation
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type RetentionPolicyRuleCreateNestedManyWithoutPolicyInput = {
    create?: XOR<RetentionPolicyRuleCreateWithoutPolicyInput, RetentionPolicyRuleUncheckedCreateWithoutPolicyInput> | RetentionPolicyRuleCreateWithoutPolicyInput[] | RetentionPolicyRuleUncheckedCreateWithoutPolicyInput[]
    connectOrCreate?: RetentionPolicyRuleCreateOrConnectWithoutPolicyInput | RetentionPolicyRuleCreateOrConnectWithoutPolicyInput[]
    createMany?: RetentionPolicyRuleCreateManyPolicyInputEnvelope
    connect?: RetentionPolicyRuleWhereUniqueInput | RetentionPolicyRuleWhereUniqueInput[]
  }

  export type RetentionPolicyRuleUncheckedCreateNestedManyWithoutPolicyInput = {
    create?: XOR<RetentionPolicyRuleCreateWithoutPolicyInput, RetentionPolicyRuleUncheckedCreateWithoutPolicyInput> | RetentionPolicyRuleCreateWithoutPolicyInput[] | RetentionPolicyRuleUncheckedCreateWithoutPolicyInput[]
    connectOrCreate?: RetentionPolicyRuleCreateOrConnectWithoutPolicyInput | RetentionPolicyRuleCreateOrConnectWithoutPolicyInput[]
    createMany?: RetentionPolicyRuleCreateManyPolicyInputEnvelope
    connect?: RetentionPolicyRuleWhereUniqueInput | RetentionPolicyRuleWhereUniqueInput[]
  }

  export type RetentionPolicyRuleUpdateManyWithoutPolicyNestedInput = {
    create?: XOR<RetentionPolicyRuleCreateWithoutPolicyInput, RetentionPolicyRuleUncheckedCreateWithoutPolicyInput> | RetentionPolicyRuleCreateWithoutPolicyInput[] | RetentionPolicyRuleUncheckedCreateWithoutPolicyInput[]
    connectOrCreate?: RetentionPolicyRuleCreateOrConnectWithoutPolicyInput | RetentionPolicyRuleCreateOrConnectWithoutPolicyInput[]
    upsert?: RetentionPolicyRuleUpsertWithWhereUniqueWithoutPolicyInput | RetentionPolicyRuleUpsertWithWhereUniqueWithoutPolicyInput[]
    createMany?: RetentionPolicyRuleCreateManyPolicyInputEnvelope
    set?: RetentionPolicyRuleWhereUniqueInput | RetentionPolicyRuleWhereUniqueInput[]
    disconnect?: RetentionPolicyRuleWhereUniqueInput | RetentionPolicyRuleWhereUniqueInput[]
    delete?: RetentionPolicyRuleWhereUniqueInput | RetentionPolicyRuleWhereUniqueInput[]
    connect?: RetentionPolicyRuleWhereUniqueInput | RetentionPolicyRuleWhereUniqueInput[]
    update?: RetentionPolicyRuleUpdateWithWhereUniqueWithoutPolicyInput | RetentionPolicyRuleUpdateWithWhereUniqueWithoutPolicyInput[]
    updateMany?: RetentionPolicyRuleUpdateManyWithWhereWithoutPolicyInput | RetentionPolicyRuleUpdateManyWithWhereWithoutPolicyInput[]
    deleteMany?: RetentionPolicyRuleScalarWhereInput | RetentionPolicyRuleScalarWhereInput[]
  }

  export type RetentionPolicyRuleUncheckedUpdateManyWithoutPolicyNestedInput = {
    create?: XOR<RetentionPolicyRuleCreateWithoutPolicyInput, RetentionPolicyRuleUncheckedCreateWithoutPolicyInput> | RetentionPolicyRuleCreateWithoutPolicyInput[] | RetentionPolicyRuleUncheckedCreateWithoutPolicyInput[]
    connectOrCreate?: RetentionPolicyRuleCreateOrConnectWithoutPolicyInput | RetentionPolicyRuleCreateOrConnectWithoutPolicyInput[]
    upsert?: RetentionPolicyRuleUpsertWithWhereUniqueWithoutPolicyInput | RetentionPolicyRuleUpsertWithWhereUniqueWithoutPolicyInput[]
    createMany?: RetentionPolicyRuleCreateManyPolicyInputEnvelope
    set?: RetentionPolicyRuleWhereUniqueInput | RetentionPolicyRuleWhereUniqueInput[]
    disconnect?: RetentionPolicyRuleWhereUniqueInput | RetentionPolicyRuleWhereUniqueInput[]
    delete?: RetentionPolicyRuleWhereUniqueInput | RetentionPolicyRuleWhereUniqueInput[]
    connect?: RetentionPolicyRuleWhereUniqueInput | RetentionPolicyRuleWhereUniqueInput[]
    update?: RetentionPolicyRuleUpdateWithWhereUniqueWithoutPolicyInput | RetentionPolicyRuleUpdateWithWhereUniqueWithoutPolicyInput[]
    updateMany?: RetentionPolicyRuleUpdateManyWithWhereWithoutPolicyInput | RetentionPolicyRuleUpdateManyWithWhereWithoutPolicyInput[]
    deleteMany?: RetentionPolicyRuleScalarWhereInput | RetentionPolicyRuleScalarWhereInput[]
  }

  export type RetentionPolicyCreateNestedOneWithoutRulesInput = {
    create?: XOR<RetentionPolicyCreateWithoutRulesInput, RetentionPolicyUncheckedCreateWithoutRulesInput>
    connectOrCreate?: RetentionPolicyCreateOrConnectWithoutRulesInput
    connect?: RetentionPolicyWhereUniqueInput
  }

  export type RetentionPolicyUpdateOneRequiredWithoutRulesNestedInput = {
    create?: XOR<RetentionPolicyCreateWithoutRulesInput, RetentionPolicyUncheckedCreateWithoutRulesInput>
    connectOrCreate?: RetentionPolicyCreateOrConnectWithoutRulesInput
    upsert?: RetentionPolicyUpsertWithoutRulesInput
    connect?: RetentionPolicyWhereUniqueInput
    update?: XOR<XOR<RetentionPolicyUpdateToOneWithWhereWithoutRulesInput, RetentionPolicyUpdateWithoutRulesInput>, RetentionPolicyUncheckedUpdateWithoutRulesInput>
  }

  export type LegalHoldCreateentityIdsInput = {
    set: string[]
  }

  export type LegalHoldCreatefileIdsInput = {
    set: string[]
  }

  export type NullableEnumEntityTypeFieldUpdateOperationsInput = {
    set?: $Enums.EntityType | null
  }

  export type LegalHoldUpdateentityIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type LegalHoldUpdatefileIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumDataDeletionRequestTypeFieldUpdateOperationsInput = {
    set?: $Enums.DataDeletionRequestType
  }

  export type EnumDeletionRequestStatusFieldUpdateOperationsInput = {
    set?: $Enums.DeletionRequestStatus
  }

  export type EnumRetentionAuditActionFieldUpdateOperationsInput = {
    set?: $Enums.RetentionAuditAction
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumEntityTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.EntityType | EnumEntityTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEntityTypeFilter<$PrismaModel> | $Enums.EntityType
  }

  export type NestedEnumFileStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FileStatus | EnumFileStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FileStatus[] | ListEnumFileStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FileStatus[] | ListEnumFileStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFileStatusFilter<$PrismaModel> | $Enums.FileStatus
  }

  export type NestedEnumAccessLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.AccessLevel | EnumAccessLevelFieldRefInput<$PrismaModel>
    in?: $Enums.AccessLevel[] | ListEnumAccessLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccessLevel[] | ListEnumAccessLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumAccessLevelFilter<$PrismaModel> | $Enums.AccessLevel
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumEntityTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EntityType | EnumEntityTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEntityTypeWithAggregatesFilter<$PrismaModel> | $Enums.EntityType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEntityTypeFilter<$PrismaModel>
    _max?: NestedEnumEntityTypeFilter<$PrismaModel>
  }

  export type NestedEnumFileStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FileStatus | EnumFileStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FileStatus[] | ListEnumFileStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FileStatus[] | ListEnumFileStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFileStatusWithAggregatesFilter<$PrismaModel> | $Enums.FileStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFileStatusFilter<$PrismaModel>
    _max?: NestedEnumFileStatusFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumAccessLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccessLevel | EnumAccessLevelFieldRefInput<$PrismaModel>
    in?: $Enums.AccessLevel[] | ListEnumAccessLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccessLevel[] | ListEnumAccessLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumAccessLevelWithAggregatesFilter<$PrismaModel> | $Enums.AccessLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccessLevelFilter<$PrismaModel>
    _max?: NestedEnumAccessLevelFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumRelationshipTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RelationshipType | EnumRelationshipTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RelationshipType[] | ListEnumRelationshipTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RelationshipType[] | ListEnumRelationshipTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRelationshipTypeFilter<$PrismaModel> | $Enums.RelationshipType
  }

  export type NestedEnumRelationshipTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RelationshipType | EnumRelationshipTypeFieldRefInput<$PrismaModel>
    in?: $Enums.RelationshipType[] | ListEnumRelationshipTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.RelationshipType[] | ListEnumRelationshipTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumRelationshipTypeWithAggregatesFilter<$PrismaModel> | $Enums.RelationshipType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRelationshipTypeFilter<$PrismaModel>
    _max?: NestedEnumRelationshipTypeFilter<$PrismaModel>
  }

  export type NestedEnumUploadStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UploadStatus | EnumUploadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UploadStatus[] | ListEnumUploadStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UploadStatus[] | ListEnumUploadStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUploadStatusFilter<$PrismaModel> | $Enums.UploadStatus
  }

  export type NestedEnumUploadStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UploadStatus | EnumUploadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UploadStatus[] | ListEnumUploadStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UploadStatus[] | ListEnumUploadStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUploadStatusWithAggregatesFilter<$PrismaModel> | $Enums.UploadStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUploadStatusFilter<$PrismaModel>
    _max?: NestedEnumUploadStatusFilter<$PrismaModel>
  }

  export type NestedEnumProcessingJobTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ProcessingJobType | EnumProcessingJobTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProcessingJobType[] | ListEnumProcessingJobTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProcessingJobType[] | ListEnumProcessingJobTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumProcessingJobTypeFilter<$PrismaModel> | $Enums.ProcessingJobType
  }

  export type NestedEnumJobStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.JobStatus | EnumJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumJobStatusFilter<$PrismaModel> | $Enums.JobStatus
  }

  export type NestedEnumProcessingJobTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProcessingJobType | EnumProcessingJobTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ProcessingJobType[] | ListEnumProcessingJobTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProcessingJobType[] | ListEnumProcessingJobTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumProcessingJobTypeWithAggregatesFilter<$PrismaModel> | $Enums.ProcessingJobType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProcessingJobTypeFilter<$PrismaModel>
    _max?: NestedEnumProcessingJobTypeFilter<$PrismaModel>
  }

  export type NestedEnumJobStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JobStatus | EnumJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumJobStatusWithAggregatesFilter<$PrismaModel> | $Enums.JobStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJobStatusFilter<$PrismaModel>
    _max?: NestedEnumJobStatusFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumAccessOperationFilter<$PrismaModel = never> = {
    equals?: $Enums.AccessOperation | EnumAccessOperationFieldRefInput<$PrismaModel>
    in?: $Enums.AccessOperation[] | ListEnumAccessOperationFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccessOperation[] | ListEnumAccessOperationFieldRefInput<$PrismaModel>
    not?: NestedEnumAccessOperationFilter<$PrismaModel> | $Enums.AccessOperation
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumAccessOperationWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccessOperation | EnumAccessOperationFieldRefInput<$PrismaModel>
    in?: $Enums.AccessOperation[] | ListEnumAccessOperationFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccessOperation[] | ListEnumAccessOperationFieldRefInput<$PrismaModel>
    not?: NestedEnumAccessOperationWithAggregatesFilter<$PrismaModel> | $Enums.AccessOperation
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccessOperationFilter<$PrismaModel>
    _max?: NestedEnumAccessOperationFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedEnumEntityTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.EntityType | EnumEntityTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumEntityTypeNullableFilter<$PrismaModel> | $Enums.EntityType | null
  }

  export type NestedEnumEntityTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EntityType | EnumEntityTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumEntityTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.EntityType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumEntityTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumEntityTypeNullableFilter<$PrismaModel>
  }

  export type NestedEnumDataDeletionRequestTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DataDeletionRequestType | EnumDataDeletionRequestTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DataDeletionRequestType[] | ListEnumDataDeletionRequestTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DataDeletionRequestType[] | ListEnumDataDeletionRequestTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDataDeletionRequestTypeFilter<$PrismaModel> | $Enums.DataDeletionRequestType
  }

  export type NestedEnumDeletionRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DeletionRequestStatus | EnumDeletionRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeletionRequestStatus[] | ListEnumDeletionRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeletionRequestStatus[] | ListEnumDeletionRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDeletionRequestStatusFilter<$PrismaModel> | $Enums.DeletionRequestStatus
  }

  export type NestedEnumDataDeletionRequestTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DataDeletionRequestType | EnumDataDeletionRequestTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DataDeletionRequestType[] | ListEnumDataDeletionRequestTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DataDeletionRequestType[] | ListEnumDataDeletionRequestTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDataDeletionRequestTypeWithAggregatesFilter<$PrismaModel> | $Enums.DataDeletionRequestType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDataDeletionRequestTypeFilter<$PrismaModel>
    _max?: NestedEnumDataDeletionRequestTypeFilter<$PrismaModel>
  }

  export type NestedEnumDeletionRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeletionRequestStatus | EnumDeletionRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeletionRequestStatus[] | ListEnumDeletionRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeletionRequestStatus[] | ListEnumDeletionRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDeletionRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.DeletionRequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeletionRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumDeletionRequestStatusFilter<$PrismaModel>
  }

  export type NestedEnumRetentionAuditActionFilter<$PrismaModel = never> = {
    equals?: $Enums.RetentionAuditAction | EnumRetentionAuditActionFieldRefInput<$PrismaModel>
    in?: $Enums.RetentionAuditAction[] | ListEnumRetentionAuditActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.RetentionAuditAction[] | ListEnumRetentionAuditActionFieldRefInput<$PrismaModel>
    not?: NestedEnumRetentionAuditActionFilter<$PrismaModel> | $Enums.RetentionAuditAction
  }

  export type NestedEnumRetentionAuditActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RetentionAuditAction | EnumRetentionAuditActionFieldRefInput<$PrismaModel>
    in?: $Enums.RetentionAuditAction[] | ListEnumRetentionAuditActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.RetentionAuditAction[] | ListEnumRetentionAuditActionFieldRefInput<$PrismaModel>
    not?: NestedEnumRetentionAuditActionWithAggregatesFilter<$PrismaModel> | $Enums.RetentionAuditAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRetentionAuditActionFilter<$PrismaModel>
    _max?: NestedEnumRetentionAuditActionFilter<$PrismaModel>
  }

  export type FileRelationshipCreateWithoutParentInput = {
    id?: string
    relationshipType: $Enums.RelationshipType
    createdAt?: Date | string
    child: FileMetadataCreateNestedOneWithoutChildRelationshipsInput
  }

  export type FileRelationshipUncheckedCreateWithoutParentInput = {
    id?: string
    childId: string
    relationshipType: $Enums.RelationshipType
    createdAt?: Date | string
  }

  export type FileRelationshipCreateOrConnectWithoutParentInput = {
    where: FileRelationshipWhereUniqueInput
    create: XOR<FileRelationshipCreateWithoutParentInput, FileRelationshipUncheckedCreateWithoutParentInput>
  }

  export type FileRelationshipCreateManyParentInputEnvelope = {
    data: FileRelationshipCreateManyParentInput | FileRelationshipCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type FileRelationshipCreateWithoutChildInput = {
    id?: string
    relationshipType: $Enums.RelationshipType
    createdAt?: Date | string
    parent: FileMetadataCreateNestedOneWithoutParentRelationshipsInput
  }

  export type FileRelationshipUncheckedCreateWithoutChildInput = {
    id?: string
    parentId: string
    relationshipType: $Enums.RelationshipType
    createdAt?: Date | string
  }

  export type FileRelationshipCreateOrConnectWithoutChildInput = {
    where: FileRelationshipWhereUniqueInput
    create: XOR<FileRelationshipCreateWithoutChildInput, FileRelationshipUncheckedCreateWithoutChildInput>
  }

  export type FileRelationshipCreateManyChildInputEnvelope = {
    data: FileRelationshipCreateManyChildInput | FileRelationshipCreateManyChildInput[]
    skipDuplicates?: boolean
  }

  export type UploadSessionFileCreateWithoutFileInput = {
    id?: string
    originalName: string
    status: $Enums.FileStatus
    errorMessage?: string | null
    processingOrder: number
    createdAt?: Date | string
    updatedAt?: Date | string
    session: UploadSessionCreateNestedOneWithoutFilesInput
  }

  export type UploadSessionFileUncheckedCreateWithoutFileInput = {
    id?: string
    sessionId: string
    originalName: string
    status: $Enums.FileStatus
    errorMessage?: string | null
    processingOrder: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UploadSessionFileCreateOrConnectWithoutFileInput = {
    where: UploadSessionFileWhereUniqueInput
    create: XOR<UploadSessionFileCreateWithoutFileInput, UploadSessionFileUncheckedCreateWithoutFileInput>
  }

  export type UploadSessionFileCreateManyFileInputEnvelope = {
    data: UploadSessionFileCreateManyFileInput | UploadSessionFileCreateManyFileInput[]
    skipDuplicates?: boolean
  }

  export type FileRelationshipUpsertWithWhereUniqueWithoutParentInput = {
    where: FileRelationshipWhereUniqueInput
    update: XOR<FileRelationshipUpdateWithoutParentInput, FileRelationshipUncheckedUpdateWithoutParentInput>
    create: XOR<FileRelationshipCreateWithoutParentInput, FileRelationshipUncheckedCreateWithoutParentInput>
  }

  export type FileRelationshipUpdateWithWhereUniqueWithoutParentInput = {
    where: FileRelationshipWhereUniqueInput
    data: XOR<FileRelationshipUpdateWithoutParentInput, FileRelationshipUncheckedUpdateWithoutParentInput>
  }

  export type FileRelationshipUpdateManyWithWhereWithoutParentInput = {
    where: FileRelationshipScalarWhereInput
    data: XOR<FileRelationshipUpdateManyMutationInput, FileRelationshipUncheckedUpdateManyWithoutParentInput>
  }

  export type FileRelationshipScalarWhereInput = {
    AND?: FileRelationshipScalarWhereInput | FileRelationshipScalarWhereInput[]
    OR?: FileRelationshipScalarWhereInput[]
    NOT?: FileRelationshipScalarWhereInput | FileRelationshipScalarWhereInput[]
    id?: StringFilter<"FileRelationship"> | string
    parentId?: StringFilter<"FileRelationship"> | string
    childId?: StringFilter<"FileRelationship"> | string
    relationshipType?: EnumRelationshipTypeFilter<"FileRelationship"> | $Enums.RelationshipType
    createdAt?: DateTimeFilter<"FileRelationship"> | Date | string
  }

  export type FileRelationshipUpsertWithWhereUniqueWithoutChildInput = {
    where: FileRelationshipWhereUniqueInput
    update: XOR<FileRelationshipUpdateWithoutChildInput, FileRelationshipUncheckedUpdateWithoutChildInput>
    create: XOR<FileRelationshipCreateWithoutChildInput, FileRelationshipUncheckedCreateWithoutChildInput>
  }

  export type FileRelationshipUpdateWithWhereUniqueWithoutChildInput = {
    where: FileRelationshipWhereUniqueInput
    data: XOR<FileRelationshipUpdateWithoutChildInput, FileRelationshipUncheckedUpdateWithoutChildInput>
  }

  export type FileRelationshipUpdateManyWithWhereWithoutChildInput = {
    where: FileRelationshipScalarWhereInput
    data: XOR<FileRelationshipUpdateManyMutationInput, FileRelationshipUncheckedUpdateManyWithoutChildInput>
  }

  export type UploadSessionFileUpsertWithWhereUniqueWithoutFileInput = {
    where: UploadSessionFileWhereUniqueInput
    update: XOR<UploadSessionFileUpdateWithoutFileInput, UploadSessionFileUncheckedUpdateWithoutFileInput>
    create: XOR<UploadSessionFileCreateWithoutFileInput, UploadSessionFileUncheckedCreateWithoutFileInput>
  }

  export type UploadSessionFileUpdateWithWhereUniqueWithoutFileInput = {
    where: UploadSessionFileWhereUniqueInput
    data: XOR<UploadSessionFileUpdateWithoutFileInput, UploadSessionFileUncheckedUpdateWithoutFileInput>
  }

  export type UploadSessionFileUpdateManyWithWhereWithoutFileInput = {
    where: UploadSessionFileScalarWhereInput
    data: XOR<UploadSessionFileUpdateManyMutationInput, UploadSessionFileUncheckedUpdateManyWithoutFileInput>
  }

  export type UploadSessionFileScalarWhereInput = {
    AND?: UploadSessionFileScalarWhereInput | UploadSessionFileScalarWhereInput[]
    OR?: UploadSessionFileScalarWhereInput[]
    NOT?: UploadSessionFileScalarWhereInput | UploadSessionFileScalarWhereInput[]
    id?: StringFilter<"UploadSessionFile"> | string
    sessionId?: StringFilter<"UploadSessionFile"> | string
    fileId?: StringNullableFilter<"UploadSessionFile"> | string | null
    originalName?: StringFilter<"UploadSessionFile"> | string
    status?: EnumFileStatusFilter<"UploadSessionFile"> | $Enums.FileStatus
    errorMessage?: StringNullableFilter<"UploadSessionFile"> | string | null
    processingOrder?: IntFilter<"UploadSessionFile"> | number
    createdAt?: DateTimeFilter<"UploadSessionFile"> | Date | string
    updatedAt?: DateTimeFilter<"UploadSessionFile"> | Date | string
  }

  export type FileMetadataCreateWithoutParentRelationshipsInput = {
    id?: string
    originalName: string
    fileName: string
    mimeType: string
    size: number
    path: string
    url: string
    cdnUrl?: string | null
    uploadedBy: string
    entityType: $Enums.EntityType
    entityId: string
    status: $Enums.FileStatus
    processingResults?: NullableJsonNullValueInput | InputJsonValue
    thumbnails?: NullableJsonNullValueInput | InputJsonValue
    accessLevel: $Enums.AccessLevel
    permissions?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: FileMetadataCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt?: Date | string | null
    childRelationships?: FileRelationshipCreateNestedManyWithoutChildInput
    sessionFiles?: UploadSessionFileCreateNestedManyWithoutFileInput
  }

  export type FileMetadataUncheckedCreateWithoutParentRelationshipsInput = {
    id?: string
    originalName: string
    fileName: string
    mimeType: string
    size: number
    path: string
    url: string
    cdnUrl?: string | null
    uploadedBy: string
    entityType: $Enums.EntityType
    entityId: string
    status: $Enums.FileStatus
    processingResults?: NullableJsonNullValueInput | InputJsonValue
    thumbnails?: NullableJsonNullValueInput | InputJsonValue
    accessLevel: $Enums.AccessLevel
    permissions?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: FileMetadataCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt?: Date | string | null
    childRelationships?: FileRelationshipUncheckedCreateNestedManyWithoutChildInput
    sessionFiles?: UploadSessionFileUncheckedCreateNestedManyWithoutFileInput
  }

  export type FileMetadataCreateOrConnectWithoutParentRelationshipsInput = {
    where: FileMetadataWhereUniqueInput
    create: XOR<FileMetadataCreateWithoutParentRelationshipsInput, FileMetadataUncheckedCreateWithoutParentRelationshipsInput>
  }

  export type FileMetadataCreateWithoutChildRelationshipsInput = {
    id?: string
    originalName: string
    fileName: string
    mimeType: string
    size: number
    path: string
    url: string
    cdnUrl?: string | null
    uploadedBy: string
    entityType: $Enums.EntityType
    entityId: string
    status: $Enums.FileStatus
    processingResults?: NullableJsonNullValueInput | InputJsonValue
    thumbnails?: NullableJsonNullValueInput | InputJsonValue
    accessLevel: $Enums.AccessLevel
    permissions?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: FileMetadataCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt?: Date | string | null
    parentRelationships?: FileRelationshipCreateNestedManyWithoutParentInput
    sessionFiles?: UploadSessionFileCreateNestedManyWithoutFileInput
  }

  export type FileMetadataUncheckedCreateWithoutChildRelationshipsInput = {
    id?: string
    originalName: string
    fileName: string
    mimeType: string
    size: number
    path: string
    url: string
    cdnUrl?: string | null
    uploadedBy: string
    entityType: $Enums.EntityType
    entityId: string
    status: $Enums.FileStatus
    processingResults?: NullableJsonNullValueInput | InputJsonValue
    thumbnails?: NullableJsonNullValueInput | InputJsonValue
    accessLevel: $Enums.AccessLevel
    permissions?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: FileMetadataCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt?: Date | string | null
    parentRelationships?: FileRelationshipUncheckedCreateNestedManyWithoutParentInput
    sessionFiles?: UploadSessionFileUncheckedCreateNestedManyWithoutFileInput
  }

  export type FileMetadataCreateOrConnectWithoutChildRelationshipsInput = {
    where: FileMetadataWhereUniqueInput
    create: XOR<FileMetadataCreateWithoutChildRelationshipsInput, FileMetadataUncheckedCreateWithoutChildRelationshipsInput>
  }

  export type FileMetadataUpsertWithoutParentRelationshipsInput = {
    update: XOR<FileMetadataUpdateWithoutParentRelationshipsInput, FileMetadataUncheckedUpdateWithoutParentRelationshipsInput>
    create: XOR<FileMetadataCreateWithoutParentRelationshipsInput, FileMetadataUncheckedCreateWithoutParentRelationshipsInput>
    where?: FileMetadataWhereInput
  }

  export type FileMetadataUpdateToOneWithWhereWithoutParentRelationshipsInput = {
    where?: FileMetadataWhereInput
    data: XOR<FileMetadataUpdateWithoutParentRelationshipsInput, FileMetadataUncheckedUpdateWithoutParentRelationshipsInput>
  }

  export type FileMetadataUpdateWithoutParentRelationshipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    path?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    cdnUrl?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: StringFieldUpdateOperationsInput | string
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    entityId?: StringFieldUpdateOperationsInput | string
    status?: EnumFileStatusFieldUpdateOperationsInput | $Enums.FileStatus
    processingResults?: NullableJsonNullValueInput | InputJsonValue
    thumbnails?: NullableJsonNullValueInput | InputJsonValue
    accessLevel?: EnumAccessLevelFieldUpdateOperationsInput | $Enums.AccessLevel
    permissions?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: FileMetadataUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    childRelationships?: FileRelationshipUpdateManyWithoutChildNestedInput
    sessionFiles?: UploadSessionFileUpdateManyWithoutFileNestedInput
  }

  export type FileMetadataUncheckedUpdateWithoutParentRelationshipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    path?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    cdnUrl?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: StringFieldUpdateOperationsInput | string
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    entityId?: StringFieldUpdateOperationsInput | string
    status?: EnumFileStatusFieldUpdateOperationsInput | $Enums.FileStatus
    processingResults?: NullableJsonNullValueInput | InputJsonValue
    thumbnails?: NullableJsonNullValueInput | InputJsonValue
    accessLevel?: EnumAccessLevelFieldUpdateOperationsInput | $Enums.AccessLevel
    permissions?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: FileMetadataUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    childRelationships?: FileRelationshipUncheckedUpdateManyWithoutChildNestedInput
    sessionFiles?: UploadSessionFileUncheckedUpdateManyWithoutFileNestedInput
  }

  export type FileMetadataUpsertWithoutChildRelationshipsInput = {
    update: XOR<FileMetadataUpdateWithoutChildRelationshipsInput, FileMetadataUncheckedUpdateWithoutChildRelationshipsInput>
    create: XOR<FileMetadataCreateWithoutChildRelationshipsInput, FileMetadataUncheckedCreateWithoutChildRelationshipsInput>
    where?: FileMetadataWhereInput
  }

  export type FileMetadataUpdateToOneWithWhereWithoutChildRelationshipsInput = {
    where?: FileMetadataWhereInput
    data: XOR<FileMetadataUpdateWithoutChildRelationshipsInput, FileMetadataUncheckedUpdateWithoutChildRelationshipsInput>
  }

  export type FileMetadataUpdateWithoutChildRelationshipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    path?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    cdnUrl?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: StringFieldUpdateOperationsInput | string
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    entityId?: StringFieldUpdateOperationsInput | string
    status?: EnumFileStatusFieldUpdateOperationsInput | $Enums.FileStatus
    processingResults?: NullableJsonNullValueInput | InputJsonValue
    thumbnails?: NullableJsonNullValueInput | InputJsonValue
    accessLevel?: EnumAccessLevelFieldUpdateOperationsInput | $Enums.AccessLevel
    permissions?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: FileMetadataUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parentRelationships?: FileRelationshipUpdateManyWithoutParentNestedInput
    sessionFiles?: UploadSessionFileUpdateManyWithoutFileNestedInput
  }

  export type FileMetadataUncheckedUpdateWithoutChildRelationshipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    path?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    cdnUrl?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: StringFieldUpdateOperationsInput | string
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    entityId?: StringFieldUpdateOperationsInput | string
    status?: EnumFileStatusFieldUpdateOperationsInput | $Enums.FileStatus
    processingResults?: NullableJsonNullValueInput | InputJsonValue
    thumbnails?: NullableJsonNullValueInput | InputJsonValue
    accessLevel?: EnumAccessLevelFieldUpdateOperationsInput | $Enums.AccessLevel
    permissions?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: FileMetadataUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parentRelationships?: FileRelationshipUncheckedUpdateManyWithoutParentNestedInput
    sessionFiles?: UploadSessionFileUncheckedUpdateManyWithoutFileNestedInput
  }

  export type UploadSessionFileCreateWithoutSessionInput = {
    id?: string
    originalName: string
    status: $Enums.FileStatus
    errorMessage?: string | null
    processingOrder: number
    createdAt?: Date | string
    updatedAt?: Date | string
    file?: FileMetadataCreateNestedOneWithoutSessionFilesInput
  }

  export type UploadSessionFileUncheckedCreateWithoutSessionInput = {
    id?: string
    fileId?: string | null
    originalName: string
    status: $Enums.FileStatus
    errorMessage?: string | null
    processingOrder: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UploadSessionFileCreateOrConnectWithoutSessionInput = {
    where: UploadSessionFileWhereUniqueInput
    create: XOR<UploadSessionFileCreateWithoutSessionInput, UploadSessionFileUncheckedCreateWithoutSessionInput>
  }

  export type UploadSessionFileCreateManySessionInputEnvelope = {
    data: UploadSessionFileCreateManySessionInput | UploadSessionFileCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type UploadSessionFileUpsertWithWhereUniqueWithoutSessionInput = {
    where: UploadSessionFileWhereUniqueInput
    update: XOR<UploadSessionFileUpdateWithoutSessionInput, UploadSessionFileUncheckedUpdateWithoutSessionInput>
    create: XOR<UploadSessionFileCreateWithoutSessionInput, UploadSessionFileUncheckedCreateWithoutSessionInput>
  }

  export type UploadSessionFileUpdateWithWhereUniqueWithoutSessionInput = {
    where: UploadSessionFileWhereUniqueInput
    data: XOR<UploadSessionFileUpdateWithoutSessionInput, UploadSessionFileUncheckedUpdateWithoutSessionInput>
  }

  export type UploadSessionFileUpdateManyWithWhereWithoutSessionInput = {
    where: UploadSessionFileScalarWhereInput
    data: XOR<UploadSessionFileUpdateManyMutationInput, UploadSessionFileUncheckedUpdateManyWithoutSessionInput>
  }

  export type UploadSessionCreateWithoutFilesInput = {
    id?: string
    sessionId: string
    uploadedBy: string
    status: $Enums.UploadStatus
    totalFiles?: number
    uploadedFiles?: number
    failedFiles?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt: Date | string
  }

  export type UploadSessionUncheckedCreateWithoutFilesInput = {
    id?: string
    sessionId: string
    uploadedBy: string
    status: $Enums.UploadStatus
    totalFiles?: number
    uploadedFiles?: number
    failedFiles?: number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt: Date | string
  }

  export type UploadSessionCreateOrConnectWithoutFilesInput = {
    where: UploadSessionWhereUniqueInput
    create: XOR<UploadSessionCreateWithoutFilesInput, UploadSessionUncheckedCreateWithoutFilesInput>
  }

  export type FileMetadataCreateWithoutSessionFilesInput = {
    id?: string
    originalName: string
    fileName: string
    mimeType: string
    size: number
    path: string
    url: string
    cdnUrl?: string | null
    uploadedBy: string
    entityType: $Enums.EntityType
    entityId: string
    status: $Enums.FileStatus
    processingResults?: NullableJsonNullValueInput | InputJsonValue
    thumbnails?: NullableJsonNullValueInput | InputJsonValue
    accessLevel: $Enums.AccessLevel
    permissions?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: FileMetadataCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt?: Date | string | null
    parentRelationships?: FileRelationshipCreateNestedManyWithoutParentInput
    childRelationships?: FileRelationshipCreateNestedManyWithoutChildInput
  }

  export type FileMetadataUncheckedCreateWithoutSessionFilesInput = {
    id?: string
    originalName: string
    fileName: string
    mimeType: string
    size: number
    path: string
    url: string
    cdnUrl?: string | null
    uploadedBy: string
    entityType: $Enums.EntityType
    entityId: string
    status: $Enums.FileStatus
    processingResults?: NullableJsonNullValueInput | InputJsonValue
    thumbnails?: NullableJsonNullValueInput | InputJsonValue
    accessLevel: $Enums.AccessLevel
    permissions?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: FileMetadataCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt?: Date | string | null
    parentRelationships?: FileRelationshipUncheckedCreateNestedManyWithoutParentInput
    childRelationships?: FileRelationshipUncheckedCreateNestedManyWithoutChildInput
  }

  export type FileMetadataCreateOrConnectWithoutSessionFilesInput = {
    where: FileMetadataWhereUniqueInput
    create: XOR<FileMetadataCreateWithoutSessionFilesInput, FileMetadataUncheckedCreateWithoutSessionFilesInput>
  }

  export type UploadSessionUpsertWithoutFilesInput = {
    update: XOR<UploadSessionUpdateWithoutFilesInput, UploadSessionUncheckedUpdateWithoutFilesInput>
    create: XOR<UploadSessionCreateWithoutFilesInput, UploadSessionUncheckedCreateWithoutFilesInput>
    where?: UploadSessionWhereInput
  }

  export type UploadSessionUpdateToOneWithWhereWithoutFilesInput = {
    where?: UploadSessionWhereInput
    data: XOR<UploadSessionUpdateWithoutFilesInput, UploadSessionUncheckedUpdateWithoutFilesInput>
  }

  export type UploadSessionUpdateWithoutFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    uploadedBy?: StringFieldUpdateOperationsInput | string
    status?: EnumUploadStatusFieldUpdateOperationsInput | $Enums.UploadStatus
    totalFiles?: IntFieldUpdateOperationsInput | number
    uploadedFiles?: IntFieldUpdateOperationsInput | number
    failedFiles?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UploadSessionUncheckedUpdateWithoutFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    uploadedBy?: StringFieldUpdateOperationsInput | string
    status?: EnumUploadStatusFieldUpdateOperationsInput | $Enums.UploadStatus
    totalFiles?: IntFieldUpdateOperationsInput | number
    uploadedFiles?: IntFieldUpdateOperationsInput | number
    failedFiles?: IntFieldUpdateOperationsInput | number
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileMetadataUpsertWithoutSessionFilesInput = {
    update: XOR<FileMetadataUpdateWithoutSessionFilesInput, FileMetadataUncheckedUpdateWithoutSessionFilesInput>
    create: XOR<FileMetadataCreateWithoutSessionFilesInput, FileMetadataUncheckedCreateWithoutSessionFilesInput>
    where?: FileMetadataWhereInput
  }

  export type FileMetadataUpdateToOneWithWhereWithoutSessionFilesInput = {
    where?: FileMetadataWhereInput
    data: XOR<FileMetadataUpdateWithoutSessionFilesInput, FileMetadataUncheckedUpdateWithoutSessionFilesInput>
  }

  export type FileMetadataUpdateWithoutSessionFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    path?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    cdnUrl?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: StringFieldUpdateOperationsInput | string
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    entityId?: StringFieldUpdateOperationsInput | string
    status?: EnumFileStatusFieldUpdateOperationsInput | $Enums.FileStatus
    processingResults?: NullableJsonNullValueInput | InputJsonValue
    thumbnails?: NullableJsonNullValueInput | InputJsonValue
    accessLevel?: EnumAccessLevelFieldUpdateOperationsInput | $Enums.AccessLevel
    permissions?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: FileMetadataUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parentRelationships?: FileRelationshipUpdateManyWithoutParentNestedInput
    childRelationships?: FileRelationshipUpdateManyWithoutChildNestedInput
  }

  export type FileMetadataUncheckedUpdateWithoutSessionFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    path?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    cdnUrl?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: StringFieldUpdateOperationsInput | string
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    entityId?: StringFieldUpdateOperationsInput | string
    status?: EnumFileStatusFieldUpdateOperationsInput | $Enums.FileStatus
    processingResults?: NullableJsonNullValueInput | InputJsonValue
    thumbnails?: NullableJsonNullValueInput | InputJsonValue
    accessLevel?: EnumAccessLevelFieldUpdateOperationsInput | $Enums.AccessLevel
    permissions?: NullableJsonNullValueInput | InputJsonValue
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: FileMetadataUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parentRelationships?: FileRelationshipUncheckedUpdateManyWithoutParentNestedInput
    childRelationships?: FileRelationshipUncheckedUpdateManyWithoutChildNestedInput
  }

  export type RetentionPolicyRuleCreateWithoutPolicyInput = {
    id?: string
    condition: JsonNullValueInput | InputJsonValue
    action: JsonNullValueInput | InputJsonValue
    priority?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RetentionPolicyRuleUncheckedCreateWithoutPolicyInput = {
    id?: string
    condition: JsonNullValueInput | InputJsonValue
    action: JsonNullValueInput | InputJsonValue
    priority?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RetentionPolicyRuleCreateOrConnectWithoutPolicyInput = {
    where: RetentionPolicyRuleWhereUniqueInput
    create: XOR<RetentionPolicyRuleCreateWithoutPolicyInput, RetentionPolicyRuleUncheckedCreateWithoutPolicyInput>
  }

  export type RetentionPolicyRuleCreateManyPolicyInputEnvelope = {
    data: RetentionPolicyRuleCreateManyPolicyInput | RetentionPolicyRuleCreateManyPolicyInput[]
    skipDuplicates?: boolean
  }

  export type RetentionPolicyRuleUpsertWithWhereUniqueWithoutPolicyInput = {
    where: RetentionPolicyRuleWhereUniqueInput
    update: XOR<RetentionPolicyRuleUpdateWithoutPolicyInput, RetentionPolicyRuleUncheckedUpdateWithoutPolicyInput>
    create: XOR<RetentionPolicyRuleCreateWithoutPolicyInput, RetentionPolicyRuleUncheckedCreateWithoutPolicyInput>
  }

  export type RetentionPolicyRuleUpdateWithWhereUniqueWithoutPolicyInput = {
    where: RetentionPolicyRuleWhereUniqueInput
    data: XOR<RetentionPolicyRuleUpdateWithoutPolicyInput, RetentionPolicyRuleUncheckedUpdateWithoutPolicyInput>
  }

  export type RetentionPolicyRuleUpdateManyWithWhereWithoutPolicyInput = {
    where: RetentionPolicyRuleScalarWhereInput
    data: XOR<RetentionPolicyRuleUpdateManyMutationInput, RetentionPolicyRuleUncheckedUpdateManyWithoutPolicyInput>
  }

  export type RetentionPolicyRuleScalarWhereInput = {
    AND?: RetentionPolicyRuleScalarWhereInput | RetentionPolicyRuleScalarWhereInput[]
    OR?: RetentionPolicyRuleScalarWhereInput[]
    NOT?: RetentionPolicyRuleScalarWhereInput | RetentionPolicyRuleScalarWhereInput[]
    id?: StringFilter<"RetentionPolicyRule"> | string
    policyId?: StringFilter<"RetentionPolicyRule"> | string
    condition?: JsonFilter<"RetentionPolicyRule">
    action?: JsonFilter<"RetentionPolicyRule">
    priority?: IntFilter<"RetentionPolicyRule"> | number
    isActive?: BoolFilter<"RetentionPolicyRule"> | boolean
    createdAt?: DateTimeFilter<"RetentionPolicyRule"> | Date | string
    updatedAt?: DateTimeFilter<"RetentionPolicyRule"> | Date | string
  }

  export type RetentionPolicyCreateWithoutRulesInput = {
    id?: string
    name: string
    entityType: $Enums.EntityType
    retentionPeriodDays: number
    jurisdiction: string
    isActive?: boolean
    description?: string | null
    legalBasis?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RetentionPolicyUncheckedCreateWithoutRulesInput = {
    id?: string
    name: string
    entityType: $Enums.EntityType
    retentionPeriodDays: number
    jurisdiction: string
    isActive?: boolean
    description?: string | null
    legalBasis?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RetentionPolicyCreateOrConnectWithoutRulesInput = {
    where: RetentionPolicyWhereUniqueInput
    create: XOR<RetentionPolicyCreateWithoutRulesInput, RetentionPolicyUncheckedCreateWithoutRulesInput>
  }

  export type RetentionPolicyUpsertWithoutRulesInput = {
    update: XOR<RetentionPolicyUpdateWithoutRulesInput, RetentionPolicyUncheckedUpdateWithoutRulesInput>
    create: XOR<RetentionPolicyCreateWithoutRulesInput, RetentionPolicyUncheckedCreateWithoutRulesInput>
    where?: RetentionPolicyWhereInput
  }

  export type RetentionPolicyUpdateToOneWithWhereWithoutRulesInput = {
    where?: RetentionPolicyWhereInput
    data: XOR<RetentionPolicyUpdateWithoutRulesInput, RetentionPolicyUncheckedUpdateWithoutRulesInput>
  }

  export type RetentionPolicyUpdateWithoutRulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    retentionPeriodDays?: IntFieldUpdateOperationsInput | number
    jurisdiction?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    legalBasis?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetentionPolicyUncheckedUpdateWithoutRulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    entityType?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    retentionPeriodDays?: IntFieldUpdateOperationsInput | number
    jurisdiction?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    legalBasis?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileRelationshipCreateManyParentInput = {
    id?: string
    childId: string
    relationshipType: $Enums.RelationshipType
    createdAt?: Date | string
  }

  export type FileRelationshipCreateManyChildInput = {
    id?: string
    parentId: string
    relationshipType: $Enums.RelationshipType
    createdAt?: Date | string
  }

  export type UploadSessionFileCreateManyFileInput = {
    id?: string
    sessionId: string
    originalName: string
    status: $Enums.FileStatus
    errorMessage?: string | null
    processingOrder: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileRelationshipUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    relationshipType?: EnumRelationshipTypeFieldUpdateOperationsInput | $Enums.RelationshipType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    child?: FileMetadataUpdateOneRequiredWithoutChildRelationshipsNestedInput
  }

  export type FileRelationshipUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    childId?: StringFieldUpdateOperationsInput | string
    relationshipType?: EnumRelationshipTypeFieldUpdateOperationsInput | $Enums.RelationshipType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileRelationshipUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    childId?: StringFieldUpdateOperationsInput | string
    relationshipType?: EnumRelationshipTypeFieldUpdateOperationsInput | $Enums.RelationshipType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileRelationshipUpdateWithoutChildInput = {
    id?: StringFieldUpdateOperationsInput | string
    relationshipType?: EnumRelationshipTypeFieldUpdateOperationsInput | $Enums.RelationshipType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: FileMetadataUpdateOneRequiredWithoutParentRelationshipsNestedInput
  }

  export type FileRelationshipUncheckedUpdateWithoutChildInput = {
    id?: StringFieldUpdateOperationsInput | string
    parentId?: StringFieldUpdateOperationsInput | string
    relationshipType?: EnumRelationshipTypeFieldUpdateOperationsInput | $Enums.RelationshipType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileRelationshipUncheckedUpdateManyWithoutChildInput = {
    id?: StringFieldUpdateOperationsInput | string
    parentId?: StringFieldUpdateOperationsInput | string
    relationshipType?: EnumRelationshipTypeFieldUpdateOperationsInput | $Enums.RelationshipType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UploadSessionFileUpdateWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    status?: EnumFileStatusFieldUpdateOperationsInput | $Enums.FileStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    processingOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: UploadSessionUpdateOneRequiredWithoutFilesNestedInput
  }

  export type UploadSessionFileUncheckedUpdateWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    status?: EnumFileStatusFieldUpdateOperationsInput | $Enums.FileStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    processingOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UploadSessionFileUncheckedUpdateManyWithoutFileInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    status?: EnumFileStatusFieldUpdateOperationsInput | $Enums.FileStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    processingOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UploadSessionFileCreateManySessionInput = {
    id?: string
    fileId?: string | null
    originalName: string
    status: $Enums.FileStatus
    errorMessage?: string | null
    processingOrder: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UploadSessionFileUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    status?: EnumFileStatusFieldUpdateOperationsInput | $Enums.FileStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    processingOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    file?: FileMetadataUpdateOneWithoutSessionFilesNestedInput
  }

  export type UploadSessionFileUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    originalName?: StringFieldUpdateOperationsInput | string
    status?: EnumFileStatusFieldUpdateOperationsInput | $Enums.FileStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    processingOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UploadSessionFileUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    originalName?: StringFieldUpdateOperationsInput | string
    status?: EnumFileStatusFieldUpdateOperationsInput | $Enums.FileStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    processingOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetentionPolicyRuleCreateManyPolicyInput = {
    id?: string
    condition: JsonNullValueInput | InputJsonValue
    action: JsonNullValueInput | InputJsonValue
    priority?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RetentionPolicyRuleUpdateWithoutPolicyInput = {
    id?: StringFieldUpdateOperationsInput | string
    condition?: JsonNullValueInput | InputJsonValue
    action?: JsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetentionPolicyRuleUncheckedUpdateWithoutPolicyInput = {
    id?: StringFieldUpdateOperationsInput | string
    condition?: JsonNullValueInput | InputJsonValue
    action?: JsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetentionPolicyRuleUncheckedUpdateManyWithoutPolicyInput = {
    id?: StringFieldUpdateOperationsInput | string
    condition?: JsonNullValueInput | InputJsonValue
    action?: JsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use FileMetadataCountOutputTypeDefaultArgs instead
     */
    export type FileMetadataCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FileMetadataCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UploadSessionCountOutputTypeDefaultArgs instead
     */
    export type UploadSessionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UploadSessionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RetentionPolicyCountOutputTypeDefaultArgs instead
     */
    export type RetentionPolicyCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RetentionPolicyCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FileMetadataDefaultArgs instead
     */
    export type FileMetadataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FileMetadataDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FileRelationshipDefaultArgs instead
     */
    export type FileRelationshipArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FileRelationshipDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UploadSessionDefaultArgs instead
     */
    export type UploadSessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UploadSessionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UploadSessionFileDefaultArgs instead
     */
    export type UploadSessionFileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UploadSessionFileDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProcessingJobDefaultArgs instead
     */
    export type ProcessingJobArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProcessingJobDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AccessLogDefaultArgs instead
     */
    export type AccessLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AccessLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StorageQuotaDefaultArgs instead
     */
    export type StorageQuotaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StorageQuotaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RetentionPolicyDefaultArgs instead
     */
    export type RetentionPolicyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RetentionPolicyDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RetentionPolicyRuleDefaultArgs instead
     */
    export type RetentionPolicyRuleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RetentionPolicyRuleDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LegalHoldDefaultArgs instead
     */
    export type LegalHoldArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LegalHoldDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DataDeletionRequestDefaultArgs instead
     */
    export type DataDeletionRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DataDeletionRequestDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RetentionAuditLogDefaultArgs instead
     */
    export type RetentionAuditLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RetentionAuditLogDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}