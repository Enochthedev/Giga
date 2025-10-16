
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
 * Model Template
 * 
 */
export type Template = $Result.DefaultSelection<Prisma.$TemplatePayload>
/**
 * Model TemplateVersion
 * 
 */
export type TemplateVersion = $Result.DefaultSelection<Prisma.$TemplateVersionPayload>
/**
 * Model CompiledTemplate
 * 
 */
export type CompiledTemplate = $Result.DefaultSelection<Prisma.$CompiledTemplatePayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>
/**
 * Model NotificationDeliveryTracking
 * 
 */
export type NotificationDeliveryTracking = $Result.DefaultSelection<Prisma.$NotificationDeliveryTrackingPayload>
/**
 * Model UserNotificationPreferences
 * 
 */
export type UserNotificationPreferences = $Result.DefaultSelection<Prisma.$UserNotificationPreferencesPayload>
/**
 * Model NotificationSuppressionList
 * 
 */
export type NotificationSuppressionList = $Result.DefaultSelection<Prisma.$NotificationSuppressionListPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Templates
 * const templates = await prisma.template.findMany()
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
   * // Fetch zero or more Templates
   * const templates = await prisma.template.findMany()
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
   * `prisma.template`: Exposes CRUD operations for the **Template** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Templates
    * const templates = await prisma.template.findMany()
    * ```
    */
  get template(): Prisma.TemplateDelegate<ExtArgs>;

  /**
   * `prisma.templateVersion`: Exposes CRUD operations for the **TemplateVersion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TemplateVersions
    * const templateVersions = await prisma.templateVersion.findMany()
    * ```
    */
  get templateVersion(): Prisma.TemplateVersionDelegate<ExtArgs>;

  /**
   * `prisma.compiledTemplate`: Exposes CRUD operations for the **CompiledTemplate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CompiledTemplates
    * const compiledTemplates = await prisma.compiledTemplate.findMany()
    * ```
    */
  get compiledTemplate(): Prisma.CompiledTemplateDelegate<ExtArgs>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs>;

  /**
   * `prisma.notificationDeliveryTracking`: Exposes CRUD operations for the **NotificationDeliveryTracking** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NotificationDeliveryTrackings
    * const notificationDeliveryTrackings = await prisma.notificationDeliveryTracking.findMany()
    * ```
    */
  get notificationDeliveryTracking(): Prisma.NotificationDeliveryTrackingDelegate<ExtArgs>;

  /**
   * `prisma.userNotificationPreferences`: Exposes CRUD operations for the **UserNotificationPreferences** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserNotificationPreferences
    * const userNotificationPreferences = await prisma.userNotificationPreferences.findMany()
    * ```
    */
  get userNotificationPreferences(): Prisma.UserNotificationPreferencesDelegate<ExtArgs>;

  /**
   * `prisma.notificationSuppressionList`: Exposes CRUD operations for the **NotificationSuppressionList** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NotificationSuppressionLists
    * const notificationSuppressionLists = await prisma.notificationSuppressionList.findMany()
    * ```
    */
  get notificationSuppressionList(): Prisma.NotificationSuppressionListDelegate<ExtArgs>;
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
    Template: 'Template',
    TemplateVersion: 'TemplateVersion',
    CompiledTemplate: 'CompiledTemplate',
    Notification: 'Notification',
    NotificationDeliveryTracking: 'NotificationDeliveryTracking',
    UserNotificationPreferences: 'UserNotificationPreferences',
    NotificationSuppressionList: 'NotificationSuppressionList'
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
      modelProps: "template" | "templateVersion" | "compiledTemplate" | "notification" | "notificationDeliveryTracking" | "userNotificationPreferences" | "notificationSuppressionList"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Template: {
        payload: Prisma.$TemplatePayload<ExtArgs>
        fields: Prisma.TemplateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TemplateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TemplateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          findFirst: {
            args: Prisma.TemplateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TemplateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          findMany: {
            args: Prisma.TemplateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>[]
          }
          create: {
            args: Prisma.TemplateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          createMany: {
            args: Prisma.TemplateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TemplateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>[]
          }
          delete: {
            args: Prisma.TemplateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          update: {
            args: Prisma.TemplateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          deleteMany: {
            args: Prisma.TemplateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TemplateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TemplateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplatePayload>
          }
          aggregate: {
            args: Prisma.TemplateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTemplate>
          }
          groupBy: {
            args: Prisma.TemplateGroupByArgs<ExtArgs>
            result: $Utils.Optional<TemplateGroupByOutputType>[]
          }
          count: {
            args: Prisma.TemplateCountArgs<ExtArgs>
            result: $Utils.Optional<TemplateCountAggregateOutputType> | number
          }
        }
      }
      TemplateVersion: {
        payload: Prisma.$TemplateVersionPayload<ExtArgs>
        fields: Prisma.TemplateVersionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TemplateVersionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplateVersionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TemplateVersionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplateVersionPayload>
          }
          findFirst: {
            args: Prisma.TemplateVersionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplateVersionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TemplateVersionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplateVersionPayload>
          }
          findMany: {
            args: Prisma.TemplateVersionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplateVersionPayload>[]
          }
          create: {
            args: Prisma.TemplateVersionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplateVersionPayload>
          }
          createMany: {
            args: Prisma.TemplateVersionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TemplateVersionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplateVersionPayload>[]
          }
          delete: {
            args: Prisma.TemplateVersionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplateVersionPayload>
          }
          update: {
            args: Prisma.TemplateVersionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplateVersionPayload>
          }
          deleteMany: {
            args: Prisma.TemplateVersionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TemplateVersionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TemplateVersionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TemplateVersionPayload>
          }
          aggregate: {
            args: Prisma.TemplateVersionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTemplateVersion>
          }
          groupBy: {
            args: Prisma.TemplateVersionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TemplateVersionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TemplateVersionCountArgs<ExtArgs>
            result: $Utils.Optional<TemplateVersionCountAggregateOutputType> | number
          }
        }
      }
      CompiledTemplate: {
        payload: Prisma.$CompiledTemplatePayload<ExtArgs>
        fields: Prisma.CompiledTemplateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CompiledTemplateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompiledTemplatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CompiledTemplateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompiledTemplatePayload>
          }
          findFirst: {
            args: Prisma.CompiledTemplateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompiledTemplatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CompiledTemplateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompiledTemplatePayload>
          }
          findMany: {
            args: Prisma.CompiledTemplateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompiledTemplatePayload>[]
          }
          create: {
            args: Prisma.CompiledTemplateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompiledTemplatePayload>
          }
          createMany: {
            args: Prisma.CompiledTemplateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CompiledTemplateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompiledTemplatePayload>[]
          }
          delete: {
            args: Prisma.CompiledTemplateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompiledTemplatePayload>
          }
          update: {
            args: Prisma.CompiledTemplateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompiledTemplatePayload>
          }
          deleteMany: {
            args: Prisma.CompiledTemplateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CompiledTemplateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CompiledTemplateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompiledTemplatePayload>
          }
          aggregate: {
            args: Prisma.CompiledTemplateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompiledTemplate>
          }
          groupBy: {
            args: Prisma.CompiledTemplateGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompiledTemplateGroupByOutputType>[]
          }
          count: {
            args: Prisma.CompiledTemplateCountArgs<ExtArgs>
            result: $Utils.Optional<CompiledTemplateCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
      NotificationDeliveryTracking: {
        payload: Prisma.$NotificationDeliveryTrackingPayload<ExtArgs>
        fields: Prisma.NotificationDeliveryTrackingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationDeliveryTrackingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationDeliveryTrackingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationDeliveryTrackingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationDeliveryTrackingPayload>
          }
          findFirst: {
            args: Prisma.NotificationDeliveryTrackingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationDeliveryTrackingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationDeliveryTrackingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationDeliveryTrackingPayload>
          }
          findMany: {
            args: Prisma.NotificationDeliveryTrackingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationDeliveryTrackingPayload>[]
          }
          create: {
            args: Prisma.NotificationDeliveryTrackingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationDeliveryTrackingPayload>
          }
          createMany: {
            args: Prisma.NotificationDeliveryTrackingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationDeliveryTrackingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationDeliveryTrackingPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeliveryTrackingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationDeliveryTrackingPayload>
          }
          update: {
            args: Prisma.NotificationDeliveryTrackingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationDeliveryTrackingPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeliveryTrackingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationDeliveryTrackingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationDeliveryTrackingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationDeliveryTrackingPayload>
          }
          aggregate: {
            args: Prisma.NotificationDeliveryTrackingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotificationDeliveryTracking>
          }
          groupBy: {
            args: Prisma.NotificationDeliveryTrackingGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationDeliveryTrackingGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationDeliveryTrackingCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationDeliveryTrackingCountAggregateOutputType> | number
          }
        }
      }
      UserNotificationPreferences: {
        payload: Prisma.$UserNotificationPreferencesPayload<ExtArgs>
        fields: Prisma.UserNotificationPreferencesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserNotificationPreferencesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserNotificationPreferencesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserNotificationPreferencesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserNotificationPreferencesPayload>
          }
          findFirst: {
            args: Prisma.UserNotificationPreferencesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserNotificationPreferencesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserNotificationPreferencesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserNotificationPreferencesPayload>
          }
          findMany: {
            args: Prisma.UserNotificationPreferencesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserNotificationPreferencesPayload>[]
          }
          create: {
            args: Prisma.UserNotificationPreferencesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserNotificationPreferencesPayload>
          }
          createMany: {
            args: Prisma.UserNotificationPreferencesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserNotificationPreferencesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserNotificationPreferencesPayload>[]
          }
          delete: {
            args: Prisma.UserNotificationPreferencesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserNotificationPreferencesPayload>
          }
          update: {
            args: Prisma.UserNotificationPreferencesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserNotificationPreferencesPayload>
          }
          deleteMany: {
            args: Prisma.UserNotificationPreferencesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserNotificationPreferencesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserNotificationPreferencesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserNotificationPreferencesPayload>
          }
          aggregate: {
            args: Prisma.UserNotificationPreferencesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserNotificationPreferences>
          }
          groupBy: {
            args: Prisma.UserNotificationPreferencesGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserNotificationPreferencesGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserNotificationPreferencesCountArgs<ExtArgs>
            result: $Utils.Optional<UserNotificationPreferencesCountAggregateOutputType> | number
          }
        }
      }
      NotificationSuppressionList: {
        payload: Prisma.$NotificationSuppressionListPayload<ExtArgs>
        fields: Prisma.NotificationSuppressionListFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationSuppressionListFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationSuppressionListPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationSuppressionListFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationSuppressionListPayload>
          }
          findFirst: {
            args: Prisma.NotificationSuppressionListFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationSuppressionListPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationSuppressionListFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationSuppressionListPayload>
          }
          findMany: {
            args: Prisma.NotificationSuppressionListFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationSuppressionListPayload>[]
          }
          create: {
            args: Prisma.NotificationSuppressionListCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationSuppressionListPayload>
          }
          createMany: {
            args: Prisma.NotificationSuppressionListCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationSuppressionListCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationSuppressionListPayload>[]
          }
          delete: {
            args: Prisma.NotificationSuppressionListDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationSuppressionListPayload>
          }
          update: {
            args: Prisma.NotificationSuppressionListUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationSuppressionListPayload>
          }
          deleteMany: {
            args: Prisma.NotificationSuppressionListDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationSuppressionListUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationSuppressionListUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationSuppressionListPayload>
          }
          aggregate: {
            args: Prisma.NotificationSuppressionListAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotificationSuppressionList>
          }
          groupBy: {
            args: Prisma.NotificationSuppressionListGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationSuppressionListGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationSuppressionListCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationSuppressionListCountAggregateOutputType> | number
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
   * Count Type TemplateCountOutputType
   */

  export type TemplateCountOutputType = {
    versions: number
  }

  export type TemplateCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versions?: boolean | TemplateCountOutputTypeCountVersionsArgs
  }

  // Custom InputTypes
  /**
   * TemplateCountOutputType without action
   */
  export type TemplateCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemplateCountOutputType
     */
    select?: TemplateCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TemplateCountOutputType without action
   */
  export type TemplateCountOutputTypeCountVersionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TemplateVersionWhereInput
  }


  /**
   * Count Type NotificationCountOutputType
   */

  export type NotificationCountOutputType = {
    deliveryTracking: number
  }

  export type NotificationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deliveryTracking?: boolean | NotificationCountOutputTypeCountDeliveryTrackingArgs
  }

  // Custom InputTypes
  /**
   * NotificationCountOutputType without action
   */
  export type NotificationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationCountOutputType
     */
    select?: NotificationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * NotificationCountOutputType without action
   */
  export type NotificationCountOutputTypeCountDeliveryTrackingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationDeliveryTrackingWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Template
   */

  export type AggregateTemplate = {
    _count: TemplateCountAggregateOutputType | null
    _min: TemplateMinAggregateOutputType | null
    _max: TemplateMaxAggregateOutputType | null
  }

  export type TemplateMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    category: string | null
    activeVersion: string | null
    defaultLanguage: string | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    isActive: boolean | null
  }

  export type TemplateMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    category: string | null
    activeVersion: string | null
    defaultLanguage: string | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    isActive: boolean | null
  }

  export type TemplateCountAggregateOutputType = {
    id: number
    name: number
    description: number
    category: number
    channels: number
    activeVersion: number
    languages: number
    defaultLanguage: number
    requiredVariables: number
    optionalVariables: number
    variableSchema: number
    createdBy: number
    createdAt: number
    updatedAt: number
    isActive: number
    _all: number
  }


  export type TemplateMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    category?: true
    activeVersion?: true
    defaultLanguage?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    isActive?: true
  }

  export type TemplateMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    category?: true
    activeVersion?: true
    defaultLanguage?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    isActive?: true
  }

  export type TemplateCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    category?: true
    channels?: true
    activeVersion?: true
    languages?: true
    defaultLanguage?: true
    requiredVariables?: true
    optionalVariables?: true
    variableSchema?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    isActive?: true
    _all?: true
  }

  export type TemplateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Template to aggregate.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Templates
    **/
    _count?: true | TemplateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TemplateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TemplateMaxAggregateInputType
  }

  export type GetTemplateAggregateType<T extends TemplateAggregateArgs> = {
        [P in keyof T & keyof AggregateTemplate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTemplate[P]>
      : GetScalarType<T[P], AggregateTemplate[P]>
  }




  export type TemplateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TemplateWhereInput
    orderBy?: TemplateOrderByWithAggregationInput | TemplateOrderByWithAggregationInput[]
    by: TemplateScalarFieldEnum[] | TemplateScalarFieldEnum
    having?: TemplateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TemplateCountAggregateInputType | true
    _min?: TemplateMinAggregateInputType
    _max?: TemplateMaxAggregateInputType
  }

  export type TemplateGroupByOutputType = {
    id: string
    name: string
    description: string | null
    category: string
    channels: string[]
    activeVersion: string | null
    languages: string[]
    defaultLanguage: string
    requiredVariables: string[]
    optionalVariables: string[]
    variableSchema: JsonValue | null
    createdBy: string
    createdAt: Date
    updatedAt: Date
    isActive: boolean
    _count: TemplateCountAggregateOutputType | null
    _min: TemplateMinAggregateOutputType | null
    _max: TemplateMaxAggregateOutputType | null
  }

  type GetTemplateGroupByPayload<T extends TemplateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TemplateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TemplateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TemplateGroupByOutputType[P]>
            : GetScalarType<T[P], TemplateGroupByOutputType[P]>
        }
      >
    >


  export type TemplateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    channels?: boolean
    activeVersion?: boolean
    languages?: boolean
    defaultLanguage?: boolean
    requiredVariables?: boolean
    optionalVariables?: boolean
    variableSchema?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isActive?: boolean
    versions?: boolean | Template$versionsArgs<ExtArgs>
    _count?: boolean | TemplateCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["template"]>

  export type TemplateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    channels?: boolean
    activeVersion?: boolean
    languages?: boolean
    defaultLanguage?: boolean
    requiredVariables?: boolean
    optionalVariables?: boolean
    variableSchema?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isActive?: boolean
  }, ExtArgs["result"]["template"]>

  export type TemplateSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    channels?: boolean
    activeVersion?: boolean
    languages?: boolean
    defaultLanguage?: boolean
    requiredVariables?: boolean
    optionalVariables?: boolean
    variableSchema?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    isActive?: boolean
  }

  export type TemplateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versions?: boolean | Template$versionsArgs<ExtArgs>
    _count?: boolean | TemplateCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TemplateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TemplatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Template"
    objects: {
      versions: Prisma.$TemplateVersionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      category: string
      channels: string[]
      activeVersion: string | null
      languages: string[]
      defaultLanguage: string
      requiredVariables: string[]
      optionalVariables: string[]
      variableSchema: Prisma.JsonValue | null
      createdBy: string
      createdAt: Date
      updatedAt: Date
      isActive: boolean
    }, ExtArgs["result"]["template"]>
    composites: {}
  }

  type TemplateGetPayload<S extends boolean | null | undefined | TemplateDefaultArgs> = $Result.GetResult<Prisma.$TemplatePayload, S>

  type TemplateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TemplateFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TemplateCountAggregateInputType | true
    }

  export interface TemplateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Template'], meta: { name: 'Template' } }
    /**
     * Find zero or one Template that matches the filter.
     * @param {TemplateFindUniqueArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TemplateFindUniqueArgs>(args: SelectSubset<T, TemplateFindUniqueArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Template that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TemplateFindUniqueOrThrowArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TemplateFindUniqueOrThrowArgs>(args: SelectSubset<T, TemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Template that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateFindFirstArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TemplateFindFirstArgs>(args?: SelectSubset<T, TemplateFindFirstArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Template that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateFindFirstOrThrowArgs} args - Arguments to find a Template
     * @example
     * // Get one Template
     * const template = await prisma.template.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TemplateFindFirstOrThrowArgs>(args?: SelectSubset<T, TemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Templates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Templates
     * const templates = await prisma.template.findMany()
     * 
     * // Get first 10 Templates
     * const templates = await prisma.template.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const templateWithIdOnly = await prisma.template.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TemplateFindManyArgs>(args?: SelectSubset<T, TemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Template.
     * @param {TemplateCreateArgs} args - Arguments to create a Template.
     * @example
     * // Create one Template
     * const Template = await prisma.template.create({
     *   data: {
     *     // ... data to create a Template
     *   }
     * })
     * 
     */
    create<T extends TemplateCreateArgs>(args: SelectSubset<T, TemplateCreateArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Templates.
     * @param {TemplateCreateManyArgs} args - Arguments to create many Templates.
     * @example
     * // Create many Templates
     * const template = await prisma.template.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TemplateCreateManyArgs>(args?: SelectSubset<T, TemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Templates and returns the data saved in the database.
     * @param {TemplateCreateManyAndReturnArgs} args - Arguments to create many Templates.
     * @example
     * // Create many Templates
     * const template = await prisma.template.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Templates and only return the `id`
     * const templateWithIdOnly = await prisma.template.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TemplateCreateManyAndReturnArgs>(args?: SelectSubset<T, TemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Template.
     * @param {TemplateDeleteArgs} args - Arguments to delete one Template.
     * @example
     * // Delete one Template
     * const Template = await prisma.template.delete({
     *   where: {
     *     // ... filter to delete one Template
     *   }
     * })
     * 
     */
    delete<T extends TemplateDeleteArgs>(args: SelectSubset<T, TemplateDeleteArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Template.
     * @param {TemplateUpdateArgs} args - Arguments to update one Template.
     * @example
     * // Update one Template
     * const template = await prisma.template.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TemplateUpdateArgs>(args: SelectSubset<T, TemplateUpdateArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Templates.
     * @param {TemplateDeleteManyArgs} args - Arguments to filter Templates to delete.
     * @example
     * // Delete a few Templates
     * const { count } = await prisma.template.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TemplateDeleteManyArgs>(args?: SelectSubset<T, TemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Templates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Templates
     * const template = await prisma.template.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TemplateUpdateManyArgs>(args: SelectSubset<T, TemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Template.
     * @param {TemplateUpsertArgs} args - Arguments to update or create a Template.
     * @example
     * // Update or create a Template
     * const template = await prisma.template.upsert({
     *   create: {
     *     // ... data to create a Template
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Template we want to update
     *   }
     * })
     */
    upsert<T extends TemplateUpsertArgs>(args: SelectSubset<T, TemplateUpsertArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Templates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateCountArgs} args - Arguments to filter Templates to count.
     * @example
     * // Count the number of Templates
     * const count = await prisma.template.count({
     *   where: {
     *     // ... the filter for the Templates we want to count
     *   }
     * })
    **/
    count<T extends TemplateCountArgs>(
      args?: Subset<T, TemplateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TemplateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Template.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TemplateAggregateArgs>(args: Subset<T, TemplateAggregateArgs>): Prisma.PrismaPromise<GetTemplateAggregateType<T>>

    /**
     * Group by Template.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateGroupByArgs} args - Group by arguments.
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
      T extends TemplateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TemplateGroupByArgs['orderBy'] }
        : { orderBy?: TemplateGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Template model
   */
  readonly fields: TemplateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Template.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TemplateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    versions<T extends Template$versionsArgs<ExtArgs> = {}>(args?: Subset<T, Template$versionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplateVersionPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Template model
   */ 
  interface TemplateFieldRefs {
    readonly id: FieldRef<"Template", 'String'>
    readonly name: FieldRef<"Template", 'String'>
    readonly description: FieldRef<"Template", 'String'>
    readonly category: FieldRef<"Template", 'String'>
    readonly channels: FieldRef<"Template", 'String[]'>
    readonly activeVersion: FieldRef<"Template", 'String'>
    readonly languages: FieldRef<"Template", 'String[]'>
    readonly defaultLanguage: FieldRef<"Template", 'String'>
    readonly requiredVariables: FieldRef<"Template", 'String[]'>
    readonly optionalVariables: FieldRef<"Template", 'String[]'>
    readonly variableSchema: FieldRef<"Template", 'Json'>
    readonly createdBy: FieldRef<"Template", 'String'>
    readonly createdAt: FieldRef<"Template", 'DateTime'>
    readonly updatedAt: FieldRef<"Template", 'DateTime'>
    readonly isActive: FieldRef<"Template", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Template findUnique
   */
  export type TemplateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template findUniqueOrThrow
   */
  export type TemplateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template findFirst
   */
  export type TemplateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Templates.
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Templates.
     */
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Template findFirstOrThrow
   */
  export type TemplateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Template to fetch.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Templates.
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Templates.
     */
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Template findMany
   */
  export type TemplateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter, which Templates to fetch.
     */
    where?: TemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Templates to fetch.
     */
    orderBy?: TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Templates.
     */
    cursor?: TemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Templates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Templates.
     */
    skip?: number
    distinct?: TemplateScalarFieldEnum | TemplateScalarFieldEnum[]
  }

  /**
   * Template create
   */
  export type TemplateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * The data needed to create a Template.
     */
    data: XOR<TemplateCreateInput, TemplateUncheckedCreateInput>
  }

  /**
   * Template createMany
   */
  export type TemplateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Templates.
     */
    data: TemplateCreateManyInput | TemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Template createManyAndReturn
   */
  export type TemplateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Templates.
     */
    data: TemplateCreateManyInput | TemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Template update
   */
  export type TemplateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * The data needed to update a Template.
     */
    data: XOR<TemplateUpdateInput, TemplateUncheckedUpdateInput>
    /**
     * Choose, which Template to update.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template updateMany
   */
  export type TemplateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Templates.
     */
    data: XOR<TemplateUpdateManyMutationInput, TemplateUncheckedUpdateManyInput>
    /**
     * Filter which Templates to update
     */
    where?: TemplateWhereInput
  }

  /**
   * Template upsert
   */
  export type TemplateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * The filter to search for the Template to update in case it exists.
     */
    where: TemplateWhereUniqueInput
    /**
     * In case the Template found by the `where` argument doesn't exist, create a new Template with this data.
     */
    create: XOR<TemplateCreateInput, TemplateUncheckedCreateInput>
    /**
     * In case the Template was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TemplateUpdateInput, TemplateUncheckedUpdateInput>
  }

  /**
   * Template delete
   */
  export type TemplateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
    /**
     * Filter which Template to delete.
     */
    where: TemplateWhereUniqueInput
  }

  /**
   * Template deleteMany
   */
  export type TemplateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Templates to delete
     */
    where?: TemplateWhereInput
  }

  /**
   * Template.versions
   */
  export type Template$versionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemplateVersion
     */
    select?: TemplateVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateVersionInclude<ExtArgs> | null
    where?: TemplateVersionWhereInput
    orderBy?: TemplateVersionOrderByWithRelationInput | TemplateVersionOrderByWithRelationInput[]
    cursor?: TemplateVersionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TemplateVersionScalarFieldEnum | TemplateVersionScalarFieldEnum[]
  }

  /**
   * Template without action
   */
  export type TemplateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Template
     */
    select?: TemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateInclude<ExtArgs> | null
  }


  /**
   * Model TemplateVersion
   */

  export type AggregateTemplateVersion = {
    _count: TemplateVersionCountAggregateOutputType | null
    _min: TemplateVersionMinAggregateOutputType | null
    _max: TemplateVersionMaxAggregateOutputType | null
  }

  export type TemplateVersionMinAggregateOutputType = {
    id: string | null
    templateId: string | null
    version: string | null
    changelog: string | null
    createdAt: Date | null
    isActive: boolean | null
  }

  export type TemplateVersionMaxAggregateOutputType = {
    id: string | null
    templateId: string | null
    version: string | null
    changelog: string | null
    createdAt: Date | null
    isActive: boolean | null
  }

  export type TemplateVersionCountAggregateOutputType = {
    id: number
    templateId: number
    version: number
    content: number
    changelog: number
    createdAt: number
    isActive: number
    _all: number
  }


  export type TemplateVersionMinAggregateInputType = {
    id?: true
    templateId?: true
    version?: true
    changelog?: true
    createdAt?: true
    isActive?: true
  }

  export type TemplateVersionMaxAggregateInputType = {
    id?: true
    templateId?: true
    version?: true
    changelog?: true
    createdAt?: true
    isActive?: true
  }

  export type TemplateVersionCountAggregateInputType = {
    id?: true
    templateId?: true
    version?: true
    content?: true
    changelog?: true
    createdAt?: true
    isActive?: true
    _all?: true
  }

  export type TemplateVersionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TemplateVersion to aggregate.
     */
    where?: TemplateVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TemplateVersions to fetch.
     */
    orderBy?: TemplateVersionOrderByWithRelationInput | TemplateVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TemplateVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TemplateVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TemplateVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TemplateVersions
    **/
    _count?: true | TemplateVersionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TemplateVersionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TemplateVersionMaxAggregateInputType
  }

  export type GetTemplateVersionAggregateType<T extends TemplateVersionAggregateArgs> = {
        [P in keyof T & keyof AggregateTemplateVersion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTemplateVersion[P]>
      : GetScalarType<T[P], AggregateTemplateVersion[P]>
  }




  export type TemplateVersionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TemplateVersionWhereInput
    orderBy?: TemplateVersionOrderByWithAggregationInput | TemplateVersionOrderByWithAggregationInput[]
    by: TemplateVersionScalarFieldEnum[] | TemplateVersionScalarFieldEnum
    having?: TemplateVersionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TemplateVersionCountAggregateInputType | true
    _min?: TemplateVersionMinAggregateInputType
    _max?: TemplateVersionMaxAggregateInputType
  }

  export type TemplateVersionGroupByOutputType = {
    id: string
    templateId: string
    version: string
    content: JsonValue
    changelog: string | null
    createdAt: Date
    isActive: boolean
    _count: TemplateVersionCountAggregateOutputType | null
    _min: TemplateVersionMinAggregateOutputType | null
    _max: TemplateVersionMaxAggregateOutputType | null
  }

  type GetTemplateVersionGroupByPayload<T extends TemplateVersionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TemplateVersionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TemplateVersionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TemplateVersionGroupByOutputType[P]>
            : GetScalarType<T[P], TemplateVersionGroupByOutputType[P]>
        }
      >
    >


  export type TemplateVersionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    templateId?: boolean
    version?: boolean
    content?: boolean
    changelog?: boolean
    createdAt?: boolean
    isActive?: boolean
    template?: boolean | TemplateDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["templateVersion"]>

  export type TemplateVersionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    templateId?: boolean
    version?: boolean
    content?: boolean
    changelog?: boolean
    createdAt?: boolean
    isActive?: boolean
    template?: boolean | TemplateDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["templateVersion"]>

  export type TemplateVersionSelectScalar = {
    id?: boolean
    templateId?: boolean
    version?: boolean
    content?: boolean
    changelog?: boolean
    createdAt?: boolean
    isActive?: boolean
  }

  export type TemplateVersionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    template?: boolean | TemplateDefaultArgs<ExtArgs>
  }
  export type TemplateVersionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    template?: boolean | TemplateDefaultArgs<ExtArgs>
  }

  export type $TemplateVersionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TemplateVersion"
    objects: {
      template: Prisma.$TemplatePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      templateId: string
      version: string
      content: Prisma.JsonValue
      changelog: string | null
      createdAt: Date
      isActive: boolean
    }, ExtArgs["result"]["templateVersion"]>
    composites: {}
  }

  type TemplateVersionGetPayload<S extends boolean | null | undefined | TemplateVersionDefaultArgs> = $Result.GetResult<Prisma.$TemplateVersionPayload, S>

  type TemplateVersionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TemplateVersionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TemplateVersionCountAggregateInputType | true
    }

  export interface TemplateVersionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TemplateVersion'], meta: { name: 'TemplateVersion' } }
    /**
     * Find zero or one TemplateVersion that matches the filter.
     * @param {TemplateVersionFindUniqueArgs} args - Arguments to find a TemplateVersion
     * @example
     * // Get one TemplateVersion
     * const templateVersion = await prisma.templateVersion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TemplateVersionFindUniqueArgs>(args: SelectSubset<T, TemplateVersionFindUniqueArgs<ExtArgs>>): Prisma__TemplateVersionClient<$Result.GetResult<Prisma.$TemplateVersionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TemplateVersion that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TemplateVersionFindUniqueOrThrowArgs} args - Arguments to find a TemplateVersion
     * @example
     * // Get one TemplateVersion
     * const templateVersion = await prisma.templateVersion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TemplateVersionFindUniqueOrThrowArgs>(args: SelectSubset<T, TemplateVersionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TemplateVersionClient<$Result.GetResult<Prisma.$TemplateVersionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TemplateVersion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateVersionFindFirstArgs} args - Arguments to find a TemplateVersion
     * @example
     * // Get one TemplateVersion
     * const templateVersion = await prisma.templateVersion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TemplateVersionFindFirstArgs>(args?: SelectSubset<T, TemplateVersionFindFirstArgs<ExtArgs>>): Prisma__TemplateVersionClient<$Result.GetResult<Prisma.$TemplateVersionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TemplateVersion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateVersionFindFirstOrThrowArgs} args - Arguments to find a TemplateVersion
     * @example
     * // Get one TemplateVersion
     * const templateVersion = await prisma.templateVersion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TemplateVersionFindFirstOrThrowArgs>(args?: SelectSubset<T, TemplateVersionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TemplateVersionClient<$Result.GetResult<Prisma.$TemplateVersionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TemplateVersions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateVersionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TemplateVersions
     * const templateVersions = await prisma.templateVersion.findMany()
     * 
     * // Get first 10 TemplateVersions
     * const templateVersions = await prisma.templateVersion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const templateVersionWithIdOnly = await prisma.templateVersion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TemplateVersionFindManyArgs>(args?: SelectSubset<T, TemplateVersionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplateVersionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TemplateVersion.
     * @param {TemplateVersionCreateArgs} args - Arguments to create a TemplateVersion.
     * @example
     * // Create one TemplateVersion
     * const TemplateVersion = await prisma.templateVersion.create({
     *   data: {
     *     // ... data to create a TemplateVersion
     *   }
     * })
     * 
     */
    create<T extends TemplateVersionCreateArgs>(args: SelectSubset<T, TemplateVersionCreateArgs<ExtArgs>>): Prisma__TemplateVersionClient<$Result.GetResult<Prisma.$TemplateVersionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TemplateVersions.
     * @param {TemplateVersionCreateManyArgs} args - Arguments to create many TemplateVersions.
     * @example
     * // Create many TemplateVersions
     * const templateVersion = await prisma.templateVersion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TemplateVersionCreateManyArgs>(args?: SelectSubset<T, TemplateVersionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TemplateVersions and returns the data saved in the database.
     * @param {TemplateVersionCreateManyAndReturnArgs} args - Arguments to create many TemplateVersions.
     * @example
     * // Create many TemplateVersions
     * const templateVersion = await prisma.templateVersion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TemplateVersions and only return the `id`
     * const templateVersionWithIdOnly = await prisma.templateVersion.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TemplateVersionCreateManyAndReturnArgs>(args?: SelectSubset<T, TemplateVersionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TemplateVersionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TemplateVersion.
     * @param {TemplateVersionDeleteArgs} args - Arguments to delete one TemplateVersion.
     * @example
     * // Delete one TemplateVersion
     * const TemplateVersion = await prisma.templateVersion.delete({
     *   where: {
     *     // ... filter to delete one TemplateVersion
     *   }
     * })
     * 
     */
    delete<T extends TemplateVersionDeleteArgs>(args: SelectSubset<T, TemplateVersionDeleteArgs<ExtArgs>>): Prisma__TemplateVersionClient<$Result.GetResult<Prisma.$TemplateVersionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TemplateVersion.
     * @param {TemplateVersionUpdateArgs} args - Arguments to update one TemplateVersion.
     * @example
     * // Update one TemplateVersion
     * const templateVersion = await prisma.templateVersion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TemplateVersionUpdateArgs>(args: SelectSubset<T, TemplateVersionUpdateArgs<ExtArgs>>): Prisma__TemplateVersionClient<$Result.GetResult<Prisma.$TemplateVersionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TemplateVersions.
     * @param {TemplateVersionDeleteManyArgs} args - Arguments to filter TemplateVersions to delete.
     * @example
     * // Delete a few TemplateVersions
     * const { count } = await prisma.templateVersion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TemplateVersionDeleteManyArgs>(args?: SelectSubset<T, TemplateVersionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TemplateVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateVersionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TemplateVersions
     * const templateVersion = await prisma.templateVersion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TemplateVersionUpdateManyArgs>(args: SelectSubset<T, TemplateVersionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TemplateVersion.
     * @param {TemplateVersionUpsertArgs} args - Arguments to update or create a TemplateVersion.
     * @example
     * // Update or create a TemplateVersion
     * const templateVersion = await prisma.templateVersion.upsert({
     *   create: {
     *     // ... data to create a TemplateVersion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TemplateVersion we want to update
     *   }
     * })
     */
    upsert<T extends TemplateVersionUpsertArgs>(args: SelectSubset<T, TemplateVersionUpsertArgs<ExtArgs>>): Prisma__TemplateVersionClient<$Result.GetResult<Prisma.$TemplateVersionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TemplateVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateVersionCountArgs} args - Arguments to filter TemplateVersions to count.
     * @example
     * // Count the number of TemplateVersions
     * const count = await prisma.templateVersion.count({
     *   where: {
     *     // ... the filter for the TemplateVersions we want to count
     *   }
     * })
    **/
    count<T extends TemplateVersionCountArgs>(
      args?: Subset<T, TemplateVersionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TemplateVersionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TemplateVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateVersionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TemplateVersionAggregateArgs>(args: Subset<T, TemplateVersionAggregateArgs>): Prisma.PrismaPromise<GetTemplateVersionAggregateType<T>>

    /**
     * Group by TemplateVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TemplateVersionGroupByArgs} args - Group by arguments.
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
      T extends TemplateVersionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TemplateVersionGroupByArgs['orderBy'] }
        : { orderBy?: TemplateVersionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TemplateVersionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTemplateVersionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TemplateVersion model
   */
  readonly fields: TemplateVersionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TemplateVersion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TemplateVersionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    template<T extends TemplateDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TemplateDefaultArgs<ExtArgs>>): Prisma__TemplateClient<$Result.GetResult<Prisma.$TemplatePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the TemplateVersion model
   */ 
  interface TemplateVersionFieldRefs {
    readonly id: FieldRef<"TemplateVersion", 'String'>
    readonly templateId: FieldRef<"TemplateVersion", 'String'>
    readonly version: FieldRef<"TemplateVersion", 'String'>
    readonly content: FieldRef<"TemplateVersion", 'Json'>
    readonly changelog: FieldRef<"TemplateVersion", 'String'>
    readonly createdAt: FieldRef<"TemplateVersion", 'DateTime'>
    readonly isActive: FieldRef<"TemplateVersion", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * TemplateVersion findUnique
   */
  export type TemplateVersionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemplateVersion
     */
    select?: TemplateVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateVersionInclude<ExtArgs> | null
    /**
     * Filter, which TemplateVersion to fetch.
     */
    where: TemplateVersionWhereUniqueInput
  }

  /**
   * TemplateVersion findUniqueOrThrow
   */
  export type TemplateVersionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemplateVersion
     */
    select?: TemplateVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateVersionInclude<ExtArgs> | null
    /**
     * Filter, which TemplateVersion to fetch.
     */
    where: TemplateVersionWhereUniqueInput
  }

  /**
   * TemplateVersion findFirst
   */
  export type TemplateVersionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemplateVersion
     */
    select?: TemplateVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateVersionInclude<ExtArgs> | null
    /**
     * Filter, which TemplateVersion to fetch.
     */
    where?: TemplateVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TemplateVersions to fetch.
     */
    orderBy?: TemplateVersionOrderByWithRelationInput | TemplateVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TemplateVersions.
     */
    cursor?: TemplateVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TemplateVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TemplateVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TemplateVersions.
     */
    distinct?: TemplateVersionScalarFieldEnum | TemplateVersionScalarFieldEnum[]
  }

  /**
   * TemplateVersion findFirstOrThrow
   */
  export type TemplateVersionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemplateVersion
     */
    select?: TemplateVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateVersionInclude<ExtArgs> | null
    /**
     * Filter, which TemplateVersion to fetch.
     */
    where?: TemplateVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TemplateVersions to fetch.
     */
    orderBy?: TemplateVersionOrderByWithRelationInput | TemplateVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TemplateVersions.
     */
    cursor?: TemplateVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TemplateVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TemplateVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TemplateVersions.
     */
    distinct?: TemplateVersionScalarFieldEnum | TemplateVersionScalarFieldEnum[]
  }

  /**
   * TemplateVersion findMany
   */
  export type TemplateVersionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemplateVersion
     */
    select?: TemplateVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateVersionInclude<ExtArgs> | null
    /**
     * Filter, which TemplateVersions to fetch.
     */
    where?: TemplateVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TemplateVersions to fetch.
     */
    orderBy?: TemplateVersionOrderByWithRelationInput | TemplateVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TemplateVersions.
     */
    cursor?: TemplateVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TemplateVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TemplateVersions.
     */
    skip?: number
    distinct?: TemplateVersionScalarFieldEnum | TemplateVersionScalarFieldEnum[]
  }

  /**
   * TemplateVersion create
   */
  export type TemplateVersionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemplateVersion
     */
    select?: TemplateVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateVersionInclude<ExtArgs> | null
    /**
     * The data needed to create a TemplateVersion.
     */
    data: XOR<TemplateVersionCreateInput, TemplateVersionUncheckedCreateInput>
  }

  /**
   * TemplateVersion createMany
   */
  export type TemplateVersionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TemplateVersions.
     */
    data: TemplateVersionCreateManyInput | TemplateVersionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TemplateVersion createManyAndReturn
   */
  export type TemplateVersionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemplateVersion
     */
    select?: TemplateVersionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TemplateVersions.
     */
    data: TemplateVersionCreateManyInput | TemplateVersionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateVersionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TemplateVersion update
   */
  export type TemplateVersionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemplateVersion
     */
    select?: TemplateVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateVersionInclude<ExtArgs> | null
    /**
     * The data needed to update a TemplateVersion.
     */
    data: XOR<TemplateVersionUpdateInput, TemplateVersionUncheckedUpdateInput>
    /**
     * Choose, which TemplateVersion to update.
     */
    where: TemplateVersionWhereUniqueInput
  }

  /**
   * TemplateVersion updateMany
   */
  export type TemplateVersionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TemplateVersions.
     */
    data: XOR<TemplateVersionUpdateManyMutationInput, TemplateVersionUncheckedUpdateManyInput>
    /**
     * Filter which TemplateVersions to update
     */
    where?: TemplateVersionWhereInput
  }

  /**
   * TemplateVersion upsert
   */
  export type TemplateVersionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemplateVersion
     */
    select?: TemplateVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateVersionInclude<ExtArgs> | null
    /**
     * The filter to search for the TemplateVersion to update in case it exists.
     */
    where: TemplateVersionWhereUniqueInput
    /**
     * In case the TemplateVersion found by the `where` argument doesn't exist, create a new TemplateVersion with this data.
     */
    create: XOR<TemplateVersionCreateInput, TemplateVersionUncheckedCreateInput>
    /**
     * In case the TemplateVersion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TemplateVersionUpdateInput, TemplateVersionUncheckedUpdateInput>
  }

  /**
   * TemplateVersion delete
   */
  export type TemplateVersionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemplateVersion
     */
    select?: TemplateVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateVersionInclude<ExtArgs> | null
    /**
     * Filter which TemplateVersion to delete.
     */
    where: TemplateVersionWhereUniqueInput
  }

  /**
   * TemplateVersion deleteMany
   */
  export type TemplateVersionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TemplateVersions to delete
     */
    where?: TemplateVersionWhereInput
  }

  /**
   * TemplateVersion without action
   */
  export type TemplateVersionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TemplateVersion
     */
    select?: TemplateVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TemplateVersionInclude<ExtArgs> | null
  }


  /**
   * Model CompiledTemplate
   */

  export type AggregateCompiledTemplate = {
    _count: CompiledTemplateCountAggregateOutputType | null
    _min: CompiledTemplateMinAggregateOutputType | null
    _max: CompiledTemplateMaxAggregateOutputType | null
  }

  export type CompiledTemplateMinAggregateOutputType = {
    id: string | null
    templateId: string | null
    version: string | null
    language: string | null
    channel: string | null
    compiledAt: Date | null
    expiresAt: Date | null
  }

  export type CompiledTemplateMaxAggregateOutputType = {
    id: string | null
    templateId: string | null
    version: string | null
    language: string | null
    channel: string | null
    compiledAt: Date | null
    expiresAt: Date | null
  }

  export type CompiledTemplateCountAggregateOutputType = {
    id: number
    templateId: number
    version: number
    language: number
    channel: number
    compiledContent: number
    requiredVariables: number
    compiledAt: number
    expiresAt: number
    _all: number
  }


  export type CompiledTemplateMinAggregateInputType = {
    id?: true
    templateId?: true
    version?: true
    language?: true
    channel?: true
    compiledAt?: true
    expiresAt?: true
  }

  export type CompiledTemplateMaxAggregateInputType = {
    id?: true
    templateId?: true
    version?: true
    language?: true
    channel?: true
    compiledAt?: true
    expiresAt?: true
  }

  export type CompiledTemplateCountAggregateInputType = {
    id?: true
    templateId?: true
    version?: true
    language?: true
    channel?: true
    compiledContent?: true
    requiredVariables?: true
    compiledAt?: true
    expiresAt?: true
    _all?: true
  }

  export type CompiledTemplateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CompiledTemplate to aggregate.
     */
    where?: CompiledTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompiledTemplates to fetch.
     */
    orderBy?: CompiledTemplateOrderByWithRelationInput | CompiledTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CompiledTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompiledTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompiledTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CompiledTemplates
    **/
    _count?: true | CompiledTemplateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompiledTemplateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompiledTemplateMaxAggregateInputType
  }

  export type GetCompiledTemplateAggregateType<T extends CompiledTemplateAggregateArgs> = {
        [P in keyof T & keyof AggregateCompiledTemplate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompiledTemplate[P]>
      : GetScalarType<T[P], AggregateCompiledTemplate[P]>
  }




  export type CompiledTemplateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompiledTemplateWhereInput
    orderBy?: CompiledTemplateOrderByWithAggregationInput | CompiledTemplateOrderByWithAggregationInput[]
    by: CompiledTemplateScalarFieldEnum[] | CompiledTemplateScalarFieldEnum
    having?: CompiledTemplateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompiledTemplateCountAggregateInputType | true
    _min?: CompiledTemplateMinAggregateInputType
    _max?: CompiledTemplateMaxAggregateInputType
  }

  export type CompiledTemplateGroupByOutputType = {
    id: string
    templateId: string
    version: string
    language: string
    channel: string
    compiledContent: JsonValue
    requiredVariables: string[]
    compiledAt: Date
    expiresAt: Date | null
    _count: CompiledTemplateCountAggregateOutputType | null
    _min: CompiledTemplateMinAggregateOutputType | null
    _max: CompiledTemplateMaxAggregateOutputType | null
  }

  type GetCompiledTemplateGroupByPayload<T extends CompiledTemplateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompiledTemplateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompiledTemplateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompiledTemplateGroupByOutputType[P]>
            : GetScalarType<T[P], CompiledTemplateGroupByOutputType[P]>
        }
      >
    >


  export type CompiledTemplateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    templateId?: boolean
    version?: boolean
    language?: boolean
    channel?: boolean
    compiledContent?: boolean
    requiredVariables?: boolean
    compiledAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["compiledTemplate"]>

  export type CompiledTemplateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    templateId?: boolean
    version?: boolean
    language?: boolean
    channel?: boolean
    compiledContent?: boolean
    requiredVariables?: boolean
    compiledAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["compiledTemplate"]>

  export type CompiledTemplateSelectScalar = {
    id?: boolean
    templateId?: boolean
    version?: boolean
    language?: boolean
    channel?: boolean
    compiledContent?: boolean
    requiredVariables?: boolean
    compiledAt?: boolean
    expiresAt?: boolean
  }


  export type $CompiledTemplatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CompiledTemplate"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      templateId: string
      version: string
      language: string
      channel: string
      compiledContent: Prisma.JsonValue
      requiredVariables: string[]
      compiledAt: Date
      expiresAt: Date | null
    }, ExtArgs["result"]["compiledTemplate"]>
    composites: {}
  }

  type CompiledTemplateGetPayload<S extends boolean | null | undefined | CompiledTemplateDefaultArgs> = $Result.GetResult<Prisma.$CompiledTemplatePayload, S>

  type CompiledTemplateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CompiledTemplateFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CompiledTemplateCountAggregateInputType | true
    }

  export interface CompiledTemplateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CompiledTemplate'], meta: { name: 'CompiledTemplate' } }
    /**
     * Find zero or one CompiledTemplate that matches the filter.
     * @param {CompiledTemplateFindUniqueArgs} args - Arguments to find a CompiledTemplate
     * @example
     * // Get one CompiledTemplate
     * const compiledTemplate = await prisma.compiledTemplate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CompiledTemplateFindUniqueArgs>(args: SelectSubset<T, CompiledTemplateFindUniqueArgs<ExtArgs>>): Prisma__CompiledTemplateClient<$Result.GetResult<Prisma.$CompiledTemplatePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CompiledTemplate that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CompiledTemplateFindUniqueOrThrowArgs} args - Arguments to find a CompiledTemplate
     * @example
     * // Get one CompiledTemplate
     * const compiledTemplate = await prisma.compiledTemplate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CompiledTemplateFindUniqueOrThrowArgs>(args: SelectSubset<T, CompiledTemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CompiledTemplateClient<$Result.GetResult<Prisma.$CompiledTemplatePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CompiledTemplate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompiledTemplateFindFirstArgs} args - Arguments to find a CompiledTemplate
     * @example
     * // Get one CompiledTemplate
     * const compiledTemplate = await prisma.compiledTemplate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CompiledTemplateFindFirstArgs>(args?: SelectSubset<T, CompiledTemplateFindFirstArgs<ExtArgs>>): Prisma__CompiledTemplateClient<$Result.GetResult<Prisma.$CompiledTemplatePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CompiledTemplate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompiledTemplateFindFirstOrThrowArgs} args - Arguments to find a CompiledTemplate
     * @example
     * // Get one CompiledTemplate
     * const compiledTemplate = await prisma.compiledTemplate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CompiledTemplateFindFirstOrThrowArgs>(args?: SelectSubset<T, CompiledTemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma__CompiledTemplateClient<$Result.GetResult<Prisma.$CompiledTemplatePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CompiledTemplates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompiledTemplateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CompiledTemplates
     * const compiledTemplates = await prisma.compiledTemplate.findMany()
     * 
     * // Get first 10 CompiledTemplates
     * const compiledTemplates = await prisma.compiledTemplate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const compiledTemplateWithIdOnly = await prisma.compiledTemplate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CompiledTemplateFindManyArgs>(args?: SelectSubset<T, CompiledTemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompiledTemplatePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CompiledTemplate.
     * @param {CompiledTemplateCreateArgs} args - Arguments to create a CompiledTemplate.
     * @example
     * // Create one CompiledTemplate
     * const CompiledTemplate = await prisma.compiledTemplate.create({
     *   data: {
     *     // ... data to create a CompiledTemplate
     *   }
     * })
     * 
     */
    create<T extends CompiledTemplateCreateArgs>(args: SelectSubset<T, CompiledTemplateCreateArgs<ExtArgs>>): Prisma__CompiledTemplateClient<$Result.GetResult<Prisma.$CompiledTemplatePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CompiledTemplates.
     * @param {CompiledTemplateCreateManyArgs} args - Arguments to create many CompiledTemplates.
     * @example
     * // Create many CompiledTemplates
     * const compiledTemplate = await prisma.compiledTemplate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CompiledTemplateCreateManyArgs>(args?: SelectSubset<T, CompiledTemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CompiledTemplates and returns the data saved in the database.
     * @param {CompiledTemplateCreateManyAndReturnArgs} args - Arguments to create many CompiledTemplates.
     * @example
     * // Create many CompiledTemplates
     * const compiledTemplate = await prisma.compiledTemplate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CompiledTemplates and only return the `id`
     * const compiledTemplateWithIdOnly = await prisma.compiledTemplate.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CompiledTemplateCreateManyAndReturnArgs>(args?: SelectSubset<T, CompiledTemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompiledTemplatePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CompiledTemplate.
     * @param {CompiledTemplateDeleteArgs} args - Arguments to delete one CompiledTemplate.
     * @example
     * // Delete one CompiledTemplate
     * const CompiledTemplate = await prisma.compiledTemplate.delete({
     *   where: {
     *     // ... filter to delete one CompiledTemplate
     *   }
     * })
     * 
     */
    delete<T extends CompiledTemplateDeleteArgs>(args: SelectSubset<T, CompiledTemplateDeleteArgs<ExtArgs>>): Prisma__CompiledTemplateClient<$Result.GetResult<Prisma.$CompiledTemplatePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CompiledTemplate.
     * @param {CompiledTemplateUpdateArgs} args - Arguments to update one CompiledTemplate.
     * @example
     * // Update one CompiledTemplate
     * const compiledTemplate = await prisma.compiledTemplate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CompiledTemplateUpdateArgs>(args: SelectSubset<T, CompiledTemplateUpdateArgs<ExtArgs>>): Prisma__CompiledTemplateClient<$Result.GetResult<Prisma.$CompiledTemplatePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CompiledTemplates.
     * @param {CompiledTemplateDeleteManyArgs} args - Arguments to filter CompiledTemplates to delete.
     * @example
     * // Delete a few CompiledTemplates
     * const { count } = await prisma.compiledTemplate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CompiledTemplateDeleteManyArgs>(args?: SelectSubset<T, CompiledTemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CompiledTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompiledTemplateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CompiledTemplates
     * const compiledTemplate = await prisma.compiledTemplate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CompiledTemplateUpdateManyArgs>(args: SelectSubset<T, CompiledTemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CompiledTemplate.
     * @param {CompiledTemplateUpsertArgs} args - Arguments to update or create a CompiledTemplate.
     * @example
     * // Update or create a CompiledTemplate
     * const compiledTemplate = await prisma.compiledTemplate.upsert({
     *   create: {
     *     // ... data to create a CompiledTemplate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CompiledTemplate we want to update
     *   }
     * })
     */
    upsert<T extends CompiledTemplateUpsertArgs>(args: SelectSubset<T, CompiledTemplateUpsertArgs<ExtArgs>>): Prisma__CompiledTemplateClient<$Result.GetResult<Prisma.$CompiledTemplatePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CompiledTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompiledTemplateCountArgs} args - Arguments to filter CompiledTemplates to count.
     * @example
     * // Count the number of CompiledTemplates
     * const count = await prisma.compiledTemplate.count({
     *   where: {
     *     // ... the filter for the CompiledTemplates we want to count
     *   }
     * })
    **/
    count<T extends CompiledTemplateCountArgs>(
      args?: Subset<T, CompiledTemplateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompiledTemplateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CompiledTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompiledTemplateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CompiledTemplateAggregateArgs>(args: Subset<T, CompiledTemplateAggregateArgs>): Prisma.PrismaPromise<GetCompiledTemplateAggregateType<T>>

    /**
     * Group by CompiledTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompiledTemplateGroupByArgs} args - Group by arguments.
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
      T extends CompiledTemplateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CompiledTemplateGroupByArgs['orderBy'] }
        : { orderBy?: CompiledTemplateGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CompiledTemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompiledTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CompiledTemplate model
   */
  readonly fields: CompiledTemplateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CompiledTemplate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CompiledTemplateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the CompiledTemplate model
   */ 
  interface CompiledTemplateFieldRefs {
    readonly id: FieldRef<"CompiledTemplate", 'String'>
    readonly templateId: FieldRef<"CompiledTemplate", 'String'>
    readonly version: FieldRef<"CompiledTemplate", 'String'>
    readonly language: FieldRef<"CompiledTemplate", 'String'>
    readonly channel: FieldRef<"CompiledTemplate", 'String'>
    readonly compiledContent: FieldRef<"CompiledTemplate", 'Json'>
    readonly requiredVariables: FieldRef<"CompiledTemplate", 'String[]'>
    readonly compiledAt: FieldRef<"CompiledTemplate", 'DateTime'>
    readonly expiresAt: FieldRef<"CompiledTemplate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CompiledTemplate findUnique
   */
  export type CompiledTemplateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompiledTemplate
     */
    select?: CompiledTemplateSelect<ExtArgs> | null
    /**
     * Filter, which CompiledTemplate to fetch.
     */
    where: CompiledTemplateWhereUniqueInput
  }

  /**
   * CompiledTemplate findUniqueOrThrow
   */
  export type CompiledTemplateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompiledTemplate
     */
    select?: CompiledTemplateSelect<ExtArgs> | null
    /**
     * Filter, which CompiledTemplate to fetch.
     */
    where: CompiledTemplateWhereUniqueInput
  }

  /**
   * CompiledTemplate findFirst
   */
  export type CompiledTemplateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompiledTemplate
     */
    select?: CompiledTemplateSelect<ExtArgs> | null
    /**
     * Filter, which CompiledTemplate to fetch.
     */
    where?: CompiledTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompiledTemplates to fetch.
     */
    orderBy?: CompiledTemplateOrderByWithRelationInput | CompiledTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CompiledTemplates.
     */
    cursor?: CompiledTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompiledTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompiledTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CompiledTemplates.
     */
    distinct?: CompiledTemplateScalarFieldEnum | CompiledTemplateScalarFieldEnum[]
  }

  /**
   * CompiledTemplate findFirstOrThrow
   */
  export type CompiledTemplateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompiledTemplate
     */
    select?: CompiledTemplateSelect<ExtArgs> | null
    /**
     * Filter, which CompiledTemplate to fetch.
     */
    where?: CompiledTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompiledTemplates to fetch.
     */
    orderBy?: CompiledTemplateOrderByWithRelationInput | CompiledTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CompiledTemplates.
     */
    cursor?: CompiledTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompiledTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompiledTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CompiledTemplates.
     */
    distinct?: CompiledTemplateScalarFieldEnum | CompiledTemplateScalarFieldEnum[]
  }

  /**
   * CompiledTemplate findMany
   */
  export type CompiledTemplateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompiledTemplate
     */
    select?: CompiledTemplateSelect<ExtArgs> | null
    /**
     * Filter, which CompiledTemplates to fetch.
     */
    where?: CompiledTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompiledTemplates to fetch.
     */
    orderBy?: CompiledTemplateOrderByWithRelationInput | CompiledTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CompiledTemplates.
     */
    cursor?: CompiledTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompiledTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompiledTemplates.
     */
    skip?: number
    distinct?: CompiledTemplateScalarFieldEnum | CompiledTemplateScalarFieldEnum[]
  }

  /**
   * CompiledTemplate create
   */
  export type CompiledTemplateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompiledTemplate
     */
    select?: CompiledTemplateSelect<ExtArgs> | null
    /**
     * The data needed to create a CompiledTemplate.
     */
    data: XOR<CompiledTemplateCreateInput, CompiledTemplateUncheckedCreateInput>
  }

  /**
   * CompiledTemplate createMany
   */
  export type CompiledTemplateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CompiledTemplates.
     */
    data: CompiledTemplateCreateManyInput | CompiledTemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CompiledTemplate createManyAndReturn
   */
  export type CompiledTemplateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompiledTemplate
     */
    select?: CompiledTemplateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CompiledTemplates.
     */
    data: CompiledTemplateCreateManyInput | CompiledTemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CompiledTemplate update
   */
  export type CompiledTemplateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompiledTemplate
     */
    select?: CompiledTemplateSelect<ExtArgs> | null
    /**
     * The data needed to update a CompiledTemplate.
     */
    data: XOR<CompiledTemplateUpdateInput, CompiledTemplateUncheckedUpdateInput>
    /**
     * Choose, which CompiledTemplate to update.
     */
    where: CompiledTemplateWhereUniqueInput
  }

  /**
   * CompiledTemplate updateMany
   */
  export type CompiledTemplateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CompiledTemplates.
     */
    data: XOR<CompiledTemplateUpdateManyMutationInput, CompiledTemplateUncheckedUpdateManyInput>
    /**
     * Filter which CompiledTemplates to update
     */
    where?: CompiledTemplateWhereInput
  }

  /**
   * CompiledTemplate upsert
   */
  export type CompiledTemplateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompiledTemplate
     */
    select?: CompiledTemplateSelect<ExtArgs> | null
    /**
     * The filter to search for the CompiledTemplate to update in case it exists.
     */
    where: CompiledTemplateWhereUniqueInput
    /**
     * In case the CompiledTemplate found by the `where` argument doesn't exist, create a new CompiledTemplate with this data.
     */
    create: XOR<CompiledTemplateCreateInput, CompiledTemplateUncheckedCreateInput>
    /**
     * In case the CompiledTemplate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CompiledTemplateUpdateInput, CompiledTemplateUncheckedUpdateInput>
  }

  /**
   * CompiledTemplate delete
   */
  export type CompiledTemplateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompiledTemplate
     */
    select?: CompiledTemplateSelect<ExtArgs> | null
    /**
     * Filter which CompiledTemplate to delete.
     */
    where: CompiledTemplateWhereUniqueInput
  }

  /**
   * CompiledTemplate deleteMany
   */
  export type CompiledTemplateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CompiledTemplates to delete
     */
    where?: CompiledTemplateWhereInput
  }

  /**
   * CompiledTemplate without action
   */
  export type CompiledTemplateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompiledTemplate
     */
    select?: CompiledTemplateSelect<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    email: string | null
    phone: string | null
    templateId: string | null
    priority: string | null
    category: string | null
    subject: string | null
    status: string | null
    scheduledAt: Date | null
    sentAt: Date | null
    deliveredAt: Date | null
    trackingEnabled: boolean | null
    fromService: string | null
    fromUserId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    email: string | null
    phone: string | null
    templateId: string | null
    priority: string | null
    category: string | null
    subject: string | null
    status: string | null
    scheduledAt: Date | null
    sentAt: Date | null
    deliveredAt: Date | null
    trackingEnabled: boolean | null
    fromService: string | null
    fromUserId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    userId: number
    email: number
    phone: number
    templateId: number
    channels: number
    priority: number
    category: number
    subject: number
    content: number
    variables: number
    renderedContent: number
    status: number
    scheduledAt: number
    sentAt: number
    deliveredAt: number
    trackingEnabled: number
    trackingData: number
    fromService: number
    fromUserId: number
    metadata: number
    tags: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    id?: true
    userId?: true
    email?: true
    phone?: true
    templateId?: true
    priority?: true
    category?: true
    subject?: true
    status?: true
    scheduledAt?: true
    sentAt?: true
    deliveredAt?: true
    trackingEnabled?: true
    fromService?: true
    fromUserId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    userId?: true
    email?: true
    phone?: true
    templateId?: true
    priority?: true
    category?: true
    subject?: true
    status?: true
    scheduledAt?: true
    sentAt?: true
    deliveredAt?: true
    trackingEnabled?: true
    fromService?: true
    fromUserId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    userId?: true
    email?: true
    phone?: true
    templateId?: true
    channels?: true
    priority?: true
    category?: true
    subject?: true
    content?: true
    variables?: true
    renderedContent?: true
    status?: true
    scheduledAt?: true
    sentAt?: true
    deliveredAt?: true
    trackingEnabled?: true
    trackingData?: true
    fromService?: true
    fromUserId?: true
    metadata?: true
    tags?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    userId: string | null
    email: string | null
    phone: string | null
    templateId: string | null
    channels: string[]
    priority: string
    category: string
    subject: string | null
    content: JsonValue
    variables: JsonValue | null
    renderedContent: JsonValue | null
    status: string
    scheduledAt: Date | null
    sentAt: Date | null
    deliveredAt: Date | null
    trackingEnabled: boolean
    trackingData: JsonValue | null
    fromService: string
    fromUserId: string | null
    metadata: JsonValue | null
    tags: string[]
    createdAt: Date
    updatedAt: Date
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    email?: boolean
    phone?: boolean
    templateId?: boolean
    channels?: boolean
    priority?: boolean
    category?: boolean
    subject?: boolean
    content?: boolean
    variables?: boolean
    renderedContent?: boolean
    status?: boolean
    scheduledAt?: boolean
    sentAt?: boolean
    deliveredAt?: boolean
    trackingEnabled?: boolean
    trackingData?: boolean
    fromService?: boolean
    fromUserId?: boolean
    metadata?: boolean
    tags?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deliveryTracking?: boolean | Notification$deliveryTrackingArgs<ExtArgs>
    _count?: boolean | NotificationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    email?: boolean
    phone?: boolean
    templateId?: boolean
    channels?: boolean
    priority?: boolean
    category?: boolean
    subject?: boolean
    content?: boolean
    variables?: boolean
    renderedContent?: boolean
    status?: boolean
    scheduledAt?: boolean
    sentAt?: boolean
    deliveredAt?: boolean
    trackingEnabled?: boolean
    trackingData?: boolean
    fromService?: boolean
    fromUserId?: boolean
    metadata?: boolean
    tags?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    userId?: boolean
    email?: boolean
    phone?: boolean
    templateId?: boolean
    channels?: boolean
    priority?: boolean
    category?: boolean
    subject?: boolean
    content?: boolean
    variables?: boolean
    renderedContent?: boolean
    status?: boolean
    scheduledAt?: boolean
    sentAt?: boolean
    deliveredAt?: boolean
    trackingEnabled?: boolean
    trackingData?: boolean
    fromService?: boolean
    fromUserId?: boolean
    metadata?: boolean
    tags?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deliveryTracking?: boolean | Notification$deliveryTrackingArgs<ExtArgs>
    _count?: boolean | NotificationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      deliveryTracking: Prisma.$NotificationDeliveryTrackingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      email: string | null
      phone: string | null
      templateId: string | null
      channels: string[]
      priority: string
      category: string
      subject: string | null
      content: Prisma.JsonValue
      variables: Prisma.JsonValue | null
      renderedContent: Prisma.JsonValue | null
      status: string
      scheduledAt: Date | null
      sentAt: Date | null
      deliveredAt: Date | null
      trackingEnabled: boolean
      trackingData: Prisma.JsonValue | null
      fromService: string
      fromUserId: string | null
      metadata: Prisma.JsonValue | null
      tags: string[]
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
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
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    deliveryTracking<T extends Notification$deliveryTrackingArgs<ExtArgs> = {}>(args?: Subset<T, Notification$deliveryTrackingArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationDeliveryTrackingPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Notification model
   */ 
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly userId: FieldRef<"Notification", 'String'>
    readonly email: FieldRef<"Notification", 'String'>
    readonly phone: FieldRef<"Notification", 'String'>
    readonly templateId: FieldRef<"Notification", 'String'>
    readonly channels: FieldRef<"Notification", 'String[]'>
    readonly priority: FieldRef<"Notification", 'String'>
    readonly category: FieldRef<"Notification", 'String'>
    readonly subject: FieldRef<"Notification", 'String'>
    readonly content: FieldRef<"Notification", 'Json'>
    readonly variables: FieldRef<"Notification", 'Json'>
    readonly renderedContent: FieldRef<"Notification", 'Json'>
    readonly status: FieldRef<"Notification", 'String'>
    readonly scheduledAt: FieldRef<"Notification", 'DateTime'>
    readonly sentAt: FieldRef<"Notification", 'DateTime'>
    readonly deliveredAt: FieldRef<"Notification", 'DateTime'>
    readonly trackingEnabled: FieldRef<"Notification", 'Boolean'>
    readonly trackingData: FieldRef<"Notification", 'Json'>
    readonly fromService: FieldRef<"Notification", 'String'>
    readonly fromUserId: FieldRef<"Notification", 'String'>
    readonly metadata: FieldRef<"Notification", 'Json'>
    readonly tags: FieldRef<"Notification", 'String[]'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
    readonly updatedAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
  }

  /**
   * Notification.deliveryTracking
   */
  export type Notification$deliveryTrackingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDeliveryTracking
     */
    select?: NotificationDeliveryTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeliveryTrackingInclude<ExtArgs> | null
    where?: NotificationDeliveryTrackingWhereInput
    orderBy?: NotificationDeliveryTrackingOrderByWithRelationInput | NotificationDeliveryTrackingOrderByWithRelationInput[]
    cursor?: NotificationDeliveryTrackingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationDeliveryTrackingScalarFieldEnum | NotificationDeliveryTrackingScalarFieldEnum[]
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Model NotificationDeliveryTracking
   */

  export type AggregateNotificationDeliveryTracking = {
    _count: NotificationDeliveryTrackingCountAggregateOutputType | null
    _avg: NotificationDeliveryTrackingAvgAggregateOutputType | null
    _sum: NotificationDeliveryTrackingSumAggregateOutputType | null
    _min: NotificationDeliveryTrackingMinAggregateOutputType | null
    _max: NotificationDeliveryTrackingMaxAggregateOutputType | null
  }

  export type NotificationDeliveryTrackingAvgAggregateOutputType = {
    retryCount: number | null
  }

  export type NotificationDeliveryTrackingSumAggregateOutputType = {
    retryCount: number | null
  }

  export type NotificationDeliveryTrackingMinAggregateOutputType = {
    id: string | null
    notificationId: string | null
    channel: string | null
    provider: string | null
    status: string | null
    providerMessageId: string | null
    sentAt: Date | null
    deliveredAt: Date | null
    openedAt: Date | null
    clickedAt: Date | null
    bouncedAt: Date | null
    complainedAt: Date | null
    errorCode: string | null
    errorMessage: string | null
    retryCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NotificationDeliveryTrackingMaxAggregateOutputType = {
    id: string | null
    notificationId: string | null
    channel: string | null
    provider: string | null
    status: string | null
    providerMessageId: string | null
    sentAt: Date | null
    deliveredAt: Date | null
    openedAt: Date | null
    clickedAt: Date | null
    bouncedAt: Date | null
    complainedAt: Date | null
    errorCode: string | null
    errorMessage: string | null
    retryCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NotificationDeliveryTrackingCountAggregateOutputType = {
    id: number
    notificationId: number
    channel: number
    provider: number
    status: number
    providerMessageId: number
    sentAt: number
    deliveredAt: number
    openedAt: number
    clickedAt: number
    bouncedAt: number
    complainedAt: number
    errorCode: number
    errorMessage: number
    retryCount: number
    providerResponse: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type NotificationDeliveryTrackingAvgAggregateInputType = {
    retryCount?: true
  }

  export type NotificationDeliveryTrackingSumAggregateInputType = {
    retryCount?: true
  }

  export type NotificationDeliveryTrackingMinAggregateInputType = {
    id?: true
    notificationId?: true
    channel?: true
    provider?: true
    status?: true
    providerMessageId?: true
    sentAt?: true
    deliveredAt?: true
    openedAt?: true
    clickedAt?: true
    bouncedAt?: true
    complainedAt?: true
    errorCode?: true
    errorMessage?: true
    retryCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NotificationDeliveryTrackingMaxAggregateInputType = {
    id?: true
    notificationId?: true
    channel?: true
    provider?: true
    status?: true
    providerMessageId?: true
    sentAt?: true
    deliveredAt?: true
    openedAt?: true
    clickedAt?: true
    bouncedAt?: true
    complainedAt?: true
    errorCode?: true
    errorMessage?: true
    retryCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NotificationDeliveryTrackingCountAggregateInputType = {
    id?: true
    notificationId?: true
    channel?: true
    provider?: true
    status?: true
    providerMessageId?: true
    sentAt?: true
    deliveredAt?: true
    openedAt?: true
    clickedAt?: true
    bouncedAt?: true
    complainedAt?: true
    errorCode?: true
    errorMessage?: true
    retryCount?: true
    providerResponse?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type NotificationDeliveryTrackingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationDeliveryTracking to aggregate.
     */
    where?: NotificationDeliveryTrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationDeliveryTrackings to fetch.
     */
    orderBy?: NotificationDeliveryTrackingOrderByWithRelationInput | NotificationDeliveryTrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationDeliveryTrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationDeliveryTrackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationDeliveryTrackings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NotificationDeliveryTrackings
    **/
    _count?: true | NotificationDeliveryTrackingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NotificationDeliveryTrackingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NotificationDeliveryTrackingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationDeliveryTrackingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationDeliveryTrackingMaxAggregateInputType
  }

  export type GetNotificationDeliveryTrackingAggregateType<T extends NotificationDeliveryTrackingAggregateArgs> = {
        [P in keyof T & keyof AggregateNotificationDeliveryTracking]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotificationDeliveryTracking[P]>
      : GetScalarType<T[P], AggregateNotificationDeliveryTracking[P]>
  }




  export type NotificationDeliveryTrackingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationDeliveryTrackingWhereInput
    orderBy?: NotificationDeliveryTrackingOrderByWithAggregationInput | NotificationDeliveryTrackingOrderByWithAggregationInput[]
    by: NotificationDeliveryTrackingScalarFieldEnum[] | NotificationDeliveryTrackingScalarFieldEnum
    having?: NotificationDeliveryTrackingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationDeliveryTrackingCountAggregateInputType | true
    _avg?: NotificationDeliveryTrackingAvgAggregateInputType
    _sum?: NotificationDeliveryTrackingSumAggregateInputType
    _min?: NotificationDeliveryTrackingMinAggregateInputType
    _max?: NotificationDeliveryTrackingMaxAggregateInputType
  }

  export type NotificationDeliveryTrackingGroupByOutputType = {
    id: string
    notificationId: string
    channel: string
    provider: string
    status: string
    providerMessageId: string | null
    sentAt: Date | null
    deliveredAt: Date | null
    openedAt: Date | null
    clickedAt: Date | null
    bouncedAt: Date | null
    complainedAt: Date | null
    errorCode: string | null
    errorMessage: string | null
    retryCount: number
    providerResponse: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: NotificationDeliveryTrackingCountAggregateOutputType | null
    _avg: NotificationDeliveryTrackingAvgAggregateOutputType | null
    _sum: NotificationDeliveryTrackingSumAggregateOutputType | null
    _min: NotificationDeliveryTrackingMinAggregateOutputType | null
    _max: NotificationDeliveryTrackingMaxAggregateOutputType | null
  }

  type GetNotificationDeliveryTrackingGroupByPayload<T extends NotificationDeliveryTrackingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationDeliveryTrackingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationDeliveryTrackingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationDeliveryTrackingGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationDeliveryTrackingGroupByOutputType[P]>
        }
      >
    >


  export type NotificationDeliveryTrackingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    notificationId?: boolean
    channel?: boolean
    provider?: boolean
    status?: boolean
    providerMessageId?: boolean
    sentAt?: boolean
    deliveredAt?: boolean
    openedAt?: boolean
    clickedAt?: boolean
    bouncedAt?: boolean
    complainedAt?: boolean
    errorCode?: boolean
    errorMessage?: boolean
    retryCount?: boolean
    providerResponse?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    notification?: boolean | NotificationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notificationDeliveryTracking"]>

  export type NotificationDeliveryTrackingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    notificationId?: boolean
    channel?: boolean
    provider?: boolean
    status?: boolean
    providerMessageId?: boolean
    sentAt?: boolean
    deliveredAt?: boolean
    openedAt?: boolean
    clickedAt?: boolean
    bouncedAt?: boolean
    complainedAt?: boolean
    errorCode?: boolean
    errorMessage?: boolean
    retryCount?: boolean
    providerResponse?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    notification?: boolean | NotificationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notificationDeliveryTracking"]>

  export type NotificationDeliveryTrackingSelectScalar = {
    id?: boolean
    notificationId?: boolean
    channel?: boolean
    provider?: boolean
    status?: boolean
    providerMessageId?: boolean
    sentAt?: boolean
    deliveredAt?: boolean
    openedAt?: boolean
    clickedAt?: boolean
    bouncedAt?: boolean
    complainedAt?: boolean
    errorCode?: boolean
    errorMessage?: boolean
    retryCount?: boolean
    providerResponse?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type NotificationDeliveryTrackingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notification?: boolean | NotificationDefaultArgs<ExtArgs>
  }
  export type NotificationDeliveryTrackingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notification?: boolean | NotificationDefaultArgs<ExtArgs>
  }

  export type $NotificationDeliveryTrackingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NotificationDeliveryTracking"
    objects: {
      notification: Prisma.$NotificationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      notificationId: string
      channel: string
      provider: string
      status: string
      providerMessageId: string | null
      sentAt: Date | null
      deliveredAt: Date | null
      openedAt: Date | null
      clickedAt: Date | null
      bouncedAt: Date | null
      complainedAt: Date | null
      errorCode: string | null
      errorMessage: string | null
      retryCount: number
      providerResponse: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["notificationDeliveryTracking"]>
    composites: {}
  }

  type NotificationDeliveryTrackingGetPayload<S extends boolean | null | undefined | NotificationDeliveryTrackingDefaultArgs> = $Result.GetResult<Prisma.$NotificationDeliveryTrackingPayload, S>

  type NotificationDeliveryTrackingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NotificationDeliveryTrackingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NotificationDeliveryTrackingCountAggregateInputType | true
    }

  export interface NotificationDeliveryTrackingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NotificationDeliveryTracking'], meta: { name: 'NotificationDeliveryTracking' } }
    /**
     * Find zero or one NotificationDeliveryTracking that matches the filter.
     * @param {NotificationDeliveryTrackingFindUniqueArgs} args - Arguments to find a NotificationDeliveryTracking
     * @example
     * // Get one NotificationDeliveryTracking
     * const notificationDeliveryTracking = await prisma.notificationDeliveryTracking.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationDeliveryTrackingFindUniqueArgs>(args: SelectSubset<T, NotificationDeliveryTrackingFindUniqueArgs<ExtArgs>>): Prisma__NotificationDeliveryTrackingClient<$Result.GetResult<Prisma.$NotificationDeliveryTrackingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one NotificationDeliveryTracking that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NotificationDeliveryTrackingFindUniqueOrThrowArgs} args - Arguments to find a NotificationDeliveryTracking
     * @example
     * // Get one NotificationDeliveryTracking
     * const notificationDeliveryTracking = await prisma.notificationDeliveryTracking.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationDeliveryTrackingFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationDeliveryTrackingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationDeliveryTrackingClient<$Result.GetResult<Prisma.$NotificationDeliveryTrackingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first NotificationDeliveryTracking that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationDeliveryTrackingFindFirstArgs} args - Arguments to find a NotificationDeliveryTracking
     * @example
     * // Get one NotificationDeliveryTracking
     * const notificationDeliveryTracking = await prisma.notificationDeliveryTracking.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationDeliveryTrackingFindFirstArgs>(args?: SelectSubset<T, NotificationDeliveryTrackingFindFirstArgs<ExtArgs>>): Prisma__NotificationDeliveryTrackingClient<$Result.GetResult<Prisma.$NotificationDeliveryTrackingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first NotificationDeliveryTracking that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationDeliveryTrackingFindFirstOrThrowArgs} args - Arguments to find a NotificationDeliveryTracking
     * @example
     * // Get one NotificationDeliveryTracking
     * const notificationDeliveryTracking = await prisma.notificationDeliveryTracking.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationDeliveryTrackingFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationDeliveryTrackingFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationDeliveryTrackingClient<$Result.GetResult<Prisma.$NotificationDeliveryTrackingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more NotificationDeliveryTrackings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationDeliveryTrackingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NotificationDeliveryTrackings
     * const notificationDeliveryTrackings = await prisma.notificationDeliveryTracking.findMany()
     * 
     * // Get first 10 NotificationDeliveryTrackings
     * const notificationDeliveryTrackings = await prisma.notificationDeliveryTracking.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationDeliveryTrackingWithIdOnly = await prisma.notificationDeliveryTracking.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationDeliveryTrackingFindManyArgs>(args?: SelectSubset<T, NotificationDeliveryTrackingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationDeliveryTrackingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a NotificationDeliveryTracking.
     * @param {NotificationDeliveryTrackingCreateArgs} args - Arguments to create a NotificationDeliveryTracking.
     * @example
     * // Create one NotificationDeliveryTracking
     * const NotificationDeliveryTracking = await prisma.notificationDeliveryTracking.create({
     *   data: {
     *     // ... data to create a NotificationDeliveryTracking
     *   }
     * })
     * 
     */
    create<T extends NotificationDeliveryTrackingCreateArgs>(args: SelectSubset<T, NotificationDeliveryTrackingCreateArgs<ExtArgs>>): Prisma__NotificationDeliveryTrackingClient<$Result.GetResult<Prisma.$NotificationDeliveryTrackingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many NotificationDeliveryTrackings.
     * @param {NotificationDeliveryTrackingCreateManyArgs} args - Arguments to create many NotificationDeliveryTrackings.
     * @example
     * // Create many NotificationDeliveryTrackings
     * const notificationDeliveryTracking = await prisma.notificationDeliveryTracking.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationDeliveryTrackingCreateManyArgs>(args?: SelectSubset<T, NotificationDeliveryTrackingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NotificationDeliveryTrackings and returns the data saved in the database.
     * @param {NotificationDeliveryTrackingCreateManyAndReturnArgs} args - Arguments to create many NotificationDeliveryTrackings.
     * @example
     * // Create many NotificationDeliveryTrackings
     * const notificationDeliveryTracking = await prisma.notificationDeliveryTracking.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NotificationDeliveryTrackings and only return the `id`
     * const notificationDeliveryTrackingWithIdOnly = await prisma.notificationDeliveryTracking.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationDeliveryTrackingCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationDeliveryTrackingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationDeliveryTrackingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a NotificationDeliveryTracking.
     * @param {NotificationDeliveryTrackingDeleteArgs} args - Arguments to delete one NotificationDeliveryTracking.
     * @example
     * // Delete one NotificationDeliveryTracking
     * const NotificationDeliveryTracking = await prisma.notificationDeliveryTracking.delete({
     *   where: {
     *     // ... filter to delete one NotificationDeliveryTracking
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeliveryTrackingDeleteArgs>(args: SelectSubset<T, NotificationDeliveryTrackingDeleteArgs<ExtArgs>>): Prisma__NotificationDeliveryTrackingClient<$Result.GetResult<Prisma.$NotificationDeliveryTrackingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one NotificationDeliveryTracking.
     * @param {NotificationDeliveryTrackingUpdateArgs} args - Arguments to update one NotificationDeliveryTracking.
     * @example
     * // Update one NotificationDeliveryTracking
     * const notificationDeliveryTracking = await prisma.notificationDeliveryTracking.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationDeliveryTrackingUpdateArgs>(args: SelectSubset<T, NotificationDeliveryTrackingUpdateArgs<ExtArgs>>): Prisma__NotificationDeliveryTrackingClient<$Result.GetResult<Prisma.$NotificationDeliveryTrackingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more NotificationDeliveryTrackings.
     * @param {NotificationDeliveryTrackingDeleteManyArgs} args - Arguments to filter NotificationDeliveryTrackings to delete.
     * @example
     * // Delete a few NotificationDeliveryTrackings
     * const { count } = await prisma.notificationDeliveryTracking.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeliveryTrackingDeleteManyArgs>(args?: SelectSubset<T, NotificationDeliveryTrackingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NotificationDeliveryTrackings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationDeliveryTrackingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NotificationDeliveryTrackings
     * const notificationDeliveryTracking = await prisma.notificationDeliveryTracking.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationDeliveryTrackingUpdateManyArgs>(args: SelectSubset<T, NotificationDeliveryTrackingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one NotificationDeliveryTracking.
     * @param {NotificationDeliveryTrackingUpsertArgs} args - Arguments to update or create a NotificationDeliveryTracking.
     * @example
     * // Update or create a NotificationDeliveryTracking
     * const notificationDeliveryTracking = await prisma.notificationDeliveryTracking.upsert({
     *   create: {
     *     // ... data to create a NotificationDeliveryTracking
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NotificationDeliveryTracking we want to update
     *   }
     * })
     */
    upsert<T extends NotificationDeliveryTrackingUpsertArgs>(args: SelectSubset<T, NotificationDeliveryTrackingUpsertArgs<ExtArgs>>): Prisma__NotificationDeliveryTrackingClient<$Result.GetResult<Prisma.$NotificationDeliveryTrackingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of NotificationDeliveryTrackings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationDeliveryTrackingCountArgs} args - Arguments to filter NotificationDeliveryTrackings to count.
     * @example
     * // Count the number of NotificationDeliveryTrackings
     * const count = await prisma.notificationDeliveryTracking.count({
     *   where: {
     *     // ... the filter for the NotificationDeliveryTrackings we want to count
     *   }
     * })
    **/
    count<T extends NotificationDeliveryTrackingCountArgs>(
      args?: Subset<T, NotificationDeliveryTrackingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationDeliveryTrackingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NotificationDeliveryTracking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationDeliveryTrackingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NotificationDeliveryTrackingAggregateArgs>(args: Subset<T, NotificationDeliveryTrackingAggregateArgs>): Prisma.PrismaPromise<GetNotificationDeliveryTrackingAggregateType<T>>

    /**
     * Group by NotificationDeliveryTracking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationDeliveryTrackingGroupByArgs} args - Group by arguments.
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
      T extends NotificationDeliveryTrackingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationDeliveryTrackingGroupByArgs['orderBy'] }
        : { orderBy?: NotificationDeliveryTrackingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, NotificationDeliveryTrackingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationDeliveryTrackingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NotificationDeliveryTracking model
   */
  readonly fields: NotificationDeliveryTrackingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NotificationDeliveryTracking.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationDeliveryTrackingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    notification<T extends NotificationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, NotificationDefaultArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the NotificationDeliveryTracking model
   */ 
  interface NotificationDeliveryTrackingFieldRefs {
    readonly id: FieldRef<"NotificationDeliveryTracking", 'String'>
    readonly notificationId: FieldRef<"NotificationDeliveryTracking", 'String'>
    readonly channel: FieldRef<"NotificationDeliveryTracking", 'String'>
    readonly provider: FieldRef<"NotificationDeliveryTracking", 'String'>
    readonly status: FieldRef<"NotificationDeliveryTracking", 'String'>
    readonly providerMessageId: FieldRef<"NotificationDeliveryTracking", 'String'>
    readonly sentAt: FieldRef<"NotificationDeliveryTracking", 'DateTime'>
    readonly deliveredAt: FieldRef<"NotificationDeliveryTracking", 'DateTime'>
    readonly openedAt: FieldRef<"NotificationDeliveryTracking", 'DateTime'>
    readonly clickedAt: FieldRef<"NotificationDeliveryTracking", 'DateTime'>
    readonly bouncedAt: FieldRef<"NotificationDeliveryTracking", 'DateTime'>
    readonly complainedAt: FieldRef<"NotificationDeliveryTracking", 'DateTime'>
    readonly errorCode: FieldRef<"NotificationDeliveryTracking", 'String'>
    readonly errorMessage: FieldRef<"NotificationDeliveryTracking", 'String'>
    readonly retryCount: FieldRef<"NotificationDeliveryTracking", 'Int'>
    readonly providerResponse: FieldRef<"NotificationDeliveryTracking", 'Json'>
    readonly createdAt: FieldRef<"NotificationDeliveryTracking", 'DateTime'>
    readonly updatedAt: FieldRef<"NotificationDeliveryTracking", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NotificationDeliveryTracking findUnique
   */
  export type NotificationDeliveryTrackingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDeliveryTracking
     */
    select?: NotificationDeliveryTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeliveryTrackingInclude<ExtArgs> | null
    /**
     * Filter, which NotificationDeliveryTracking to fetch.
     */
    where: NotificationDeliveryTrackingWhereUniqueInput
  }

  /**
   * NotificationDeliveryTracking findUniqueOrThrow
   */
  export type NotificationDeliveryTrackingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDeliveryTracking
     */
    select?: NotificationDeliveryTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeliveryTrackingInclude<ExtArgs> | null
    /**
     * Filter, which NotificationDeliveryTracking to fetch.
     */
    where: NotificationDeliveryTrackingWhereUniqueInput
  }

  /**
   * NotificationDeliveryTracking findFirst
   */
  export type NotificationDeliveryTrackingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDeliveryTracking
     */
    select?: NotificationDeliveryTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeliveryTrackingInclude<ExtArgs> | null
    /**
     * Filter, which NotificationDeliveryTracking to fetch.
     */
    where?: NotificationDeliveryTrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationDeliveryTrackings to fetch.
     */
    orderBy?: NotificationDeliveryTrackingOrderByWithRelationInput | NotificationDeliveryTrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationDeliveryTrackings.
     */
    cursor?: NotificationDeliveryTrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationDeliveryTrackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationDeliveryTrackings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationDeliveryTrackings.
     */
    distinct?: NotificationDeliveryTrackingScalarFieldEnum | NotificationDeliveryTrackingScalarFieldEnum[]
  }

  /**
   * NotificationDeliveryTracking findFirstOrThrow
   */
  export type NotificationDeliveryTrackingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDeliveryTracking
     */
    select?: NotificationDeliveryTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeliveryTrackingInclude<ExtArgs> | null
    /**
     * Filter, which NotificationDeliveryTracking to fetch.
     */
    where?: NotificationDeliveryTrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationDeliveryTrackings to fetch.
     */
    orderBy?: NotificationDeliveryTrackingOrderByWithRelationInput | NotificationDeliveryTrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationDeliveryTrackings.
     */
    cursor?: NotificationDeliveryTrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationDeliveryTrackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationDeliveryTrackings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationDeliveryTrackings.
     */
    distinct?: NotificationDeliveryTrackingScalarFieldEnum | NotificationDeliveryTrackingScalarFieldEnum[]
  }

  /**
   * NotificationDeliveryTracking findMany
   */
  export type NotificationDeliveryTrackingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDeliveryTracking
     */
    select?: NotificationDeliveryTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeliveryTrackingInclude<ExtArgs> | null
    /**
     * Filter, which NotificationDeliveryTrackings to fetch.
     */
    where?: NotificationDeliveryTrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationDeliveryTrackings to fetch.
     */
    orderBy?: NotificationDeliveryTrackingOrderByWithRelationInput | NotificationDeliveryTrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NotificationDeliveryTrackings.
     */
    cursor?: NotificationDeliveryTrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationDeliveryTrackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationDeliveryTrackings.
     */
    skip?: number
    distinct?: NotificationDeliveryTrackingScalarFieldEnum | NotificationDeliveryTrackingScalarFieldEnum[]
  }

  /**
   * NotificationDeliveryTracking create
   */
  export type NotificationDeliveryTrackingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDeliveryTracking
     */
    select?: NotificationDeliveryTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeliveryTrackingInclude<ExtArgs> | null
    /**
     * The data needed to create a NotificationDeliveryTracking.
     */
    data: XOR<NotificationDeliveryTrackingCreateInput, NotificationDeliveryTrackingUncheckedCreateInput>
  }

  /**
   * NotificationDeliveryTracking createMany
   */
  export type NotificationDeliveryTrackingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NotificationDeliveryTrackings.
     */
    data: NotificationDeliveryTrackingCreateManyInput | NotificationDeliveryTrackingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NotificationDeliveryTracking createManyAndReturn
   */
  export type NotificationDeliveryTrackingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDeliveryTracking
     */
    select?: NotificationDeliveryTrackingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many NotificationDeliveryTrackings.
     */
    data: NotificationDeliveryTrackingCreateManyInput | NotificationDeliveryTrackingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeliveryTrackingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * NotificationDeliveryTracking update
   */
  export type NotificationDeliveryTrackingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDeliveryTracking
     */
    select?: NotificationDeliveryTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeliveryTrackingInclude<ExtArgs> | null
    /**
     * The data needed to update a NotificationDeliveryTracking.
     */
    data: XOR<NotificationDeliveryTrackingUpdateInput, NotificationDeliveryTrackingUncheckedUpdateInput>
    /**
     * Choose, which NotificationDeliveryTracking to update.
     */
    where: NotificationDeliveryTrackingWhereUniqueInput
  }

  /**
   * NotificationDeliveryTracking updateMany
   */
  export type NotificationDeliveryTrackingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NotificationDeliveryTrackings.
     */
    data: XOR<NotificationDeliveryTrackingUpdateManyMutationInput, NotificationDeliveryTrackingUncheckedUpdateManyInput>
    /**
     * Filter which NotificationDeliveryTrackings to update
     */
    where?: NotificationDeliveryTrackingWhereInput
  }

  /**
   * NotificationDeliveryTracking upsert
   */
  export type NotificationDeliveryTrackingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDeliveryTracking
     */
    select?: NotificationDeliveryTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeliveryTrackingInclude<ExtArgs> | null
    /**
     * The filter to search for the NotificationDeliveryTracking to update in case it exists.
     */
    where: NotificationDeliveryTrackingWhereUniqueInput
    /**
     * In case the NotificationDeliveryTracking found by the `where` argument doesn't exist, create a new NotificationDeliveryTracking with this data.
     */
    create: XOR<NotificationDeliveryTrackingCreateInput, NotificationDeliveryTrackingUncheckedCreateInput>
    /**
     * In case the NotificationDeliveryTracking was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationDeliveryTrackingUpdateInput, NotificationDeliveryTrackingUncheckedUpdateInput>
  }

  /**
   * NotificationDeliveryTracking delete
   */
  export type NotificationDeliveryTrackingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDeliveryTracking
     */
    select?: NotificationDeliveryTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeliveryTrackingInclude<ExtArgs> | null
    /**
     * Filter which NotificationDeliveryTracking to delete.
     */
    where: NotificationDeliveryTrackingWhereUniqueInput
  }

  /**
   * NotificationDeliveryTracking deleteMany
   */
  export type NotificationDeliveryTrackingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationDeliveryTrackings to delete
     */
    where?: NotificationDeliveryTrackingWhereInput
  }

  /**
   * NotificationDeliveryTracking without action
   */
  export type NotificationDeliveryTrackingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationDeliveryTracking
     */
    select?: NotificationDeliveryTrackingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationDeliveryTrackingInclude<ExtArgs> | null
  }


  /**
   * Model UserNotificationPreferences
   */

  export type AggregateUserNotificationPreferences = {
    _count: UserNotificationPreferencesCountAggregateOutputType | null
    _avg: UserNotificationPreferencesAvgAggregateOutputType | null
    _sum: UserNotificationPreferencesSumAggregateOutputType | null
    _min: UserNotificationPreferencesMinAggregateOutputType | null
    _max: UserNotificationPreferencesMaxAggregateOutputType | null
  }

  export type UserNotificationPreferencesAvgAggregateOutputType = {
    maxDailyNotifications: number | null
    maxWeeklyNotifications: number | null
  }

  export type UserNotificationPreferencesSumAggregateOutputType = {
    maxDailyNotifications: number | null
    maxWeeklyNotifications: number | null
  }

  export type UserNotificationPreferencesMinAggregateOutputType = {
    id: string | null
    userId: string | null
    emailEnabled: boolean | null
    smsEnabled: boolean | null
    pushEnabled: boolean | null
    inAppEnabled: boolean | null
    globalOptOut: boolean | null
    maxDailyNotifications: number | null
    maxWeeklyNotifications: number | null
    consentDate: Date | null
    optOutDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserNotificationPreferencesMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    emailEnabled: boolean | null
    smsEnabled: boolean | null
    pushEnabled: boolean | null
    inAppEnabled: boolean | null
    globalOptOut: boolean | null
    maxDailyNotifications: number | null
    maxWeeklyNotifications: number | null
    consentDate: Date | null
    optOutDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserNotificationPreferencesCountAggregateOutputType = {
    id: number
    userId: number
    emailEnabled: number
    smsEnabled: number
    pushEnabled: number
    inAppEnabled: number
    categoryPreferences: number
    globalOptOut: number
    quietHours: number
    maxDailyNotifications: number
    maxWeeklyNotifications: number
    consentDate: number
    optOutDate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserNotificationPreferencesAvgAggregateInputType = {
    maxDailyNotifications?: true
    maxWeeklyNotifications?: true
  }

  export type UserNotificationPreferencesSumAggregateInputType = {
    maxDailyNotifications?: true
    maxWeeklyNotifications?: true
  }

  export type UserNotificationPreferencesMinAggregateInputType = {
    id?: true
    userId?: true
    emailEnabled?: true
    smsEnabled?: true
    pushEnabled?: true
    inAppEnabled?: true
    globalOptOut?: true
    maxDailyNotifications?: true
    maxWeeklyNotifications?: true
    consentDate?: true
    optOutDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserNotificationPreferencesMaxAggregateInputType = {
    id?: true
    userId?: true
    emailEnabled?: true
    smsEnabled?: true
    pushEnabled?: true
    inAppEnabled?: true
    globalOptOut?: true
    maxDailyNotifications?: true
    maxWeeklyNotifications?: true
    consentDate?: true
    optOutDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserNotificationPreferencesCountAggregateInputType = {
    id?: true
    userId?: true
    emailEnabled?: true
    smsEnabled?: true
    pushEnabled?: true
    inAppEnabled?: true
    categoryPreferences?: true
    globalOptOut?: true
    quietHours?: true
    maxDailyNotifications?: true
    maxWeeklyNotifications?: true
    consentDate?: true
    optOutDate?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserNotificationPreferencesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserNotificationPreferences to aggregate.
     */
    where?: UserNotificationPreferencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserNotificationPreferences to fetch.
     */
    orderBy?: UserNotificationPreferencesOrderByWithRelationInput | UserNotificationPreferencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserNotificationPreferencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserNotificationPreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserNotificationPreferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserNotificationPreferences
    **/
    _count?: true | UserNotificationPreferencesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserNotificationPreferencesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserNotificationPreferencesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserNotificationPreferencesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserNotificationPreferencesMaxAggregateInputType
  }

  export type GetUserNotificationPreferencesAggregateType<T extends UserNotificationPreferencesAggregateArgs> = {
        [P in keyof T & keyof AggregateUserNotificationPreferences]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserNotificationPreferences[P]>
      : GetScalarType<T[P], AggregateUserNotificationPreferences[P]>
  }




  export type UserNotificationPreferencesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserNotificationPreferencesWhereInput
    orderBy?: UserNotificationPreferencesOrderByWithAggregationInput | UserNotificationPreferencesOrderByWithAggregationInput[]
    by: UserNotificationPreferencesScalarFieldEnum[] | UserNotificationPreferencesScalarFieldEnum
    having?: UserNotificationPreferencesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserNotificationPreferencesCountAggregateInputType | true
    _avg?: UserNotificationPreferencesAvgAggregateInputType
    _sum?: UserNotificationPreferencesSumAggregateInputType
    _min?: UserNotificationPreferencesMinAggregateInputType
    _max?: UserNotificationPreferencesMaxAggregateInputType
  }

  export type UserNotificationPreferencesGroupByOutputType = {
    id: string
    userId: string
    emailEnabled: boolean
    smsEnabled: boolean
    pushEnabled: boolean
    inAppEnabled: boolean
    categoryPreferences: JsonValue
    globalOptOut: boolean
    quietHours: JsonValue | null
    maxDailyNotifications: number | null
    maxWeeklyNotifications: number | null
    consentDate: Date | null
    optOutDate: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserNotificationPreferencesCountAggregateOutputType | null
    _avg: UserNotificationPreferencesAvgAggregateOutputType | null
    _sum: UserNotificationPreferencesSumAggregateOutputType | null
    _min: UserNotificationPreferencesMinAggregateOutputType | null
    _max: UserNotificationPreferencesMaxAggregateOutputType | null
  }

  type GetUserNotificationPreferencesGroupByPayload<T extends UserNotificationPreferencesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserNotificationPreferencesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserNotificationPreferencesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserNotificationPreferencesGroupByOutputType[P]>
            : GetScalarType<T[P], UserNotificationPreferencesGroupByOutputType[P]>
        }
      >
    >


  export type UserNotificationPreferencesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    emailEnabled?: boolean
    smsEnabled?: boolean
    pushEnabled?: boolean
    inAppEnabled?: boolean
    categoryPreferences?: boolean
    globalOptOut?: boolean
    quietHours?: boolean
    maxDailyNotifications?: boolean
    maxWeeklyNotifications?: boolean
    consentDate?: boolean
    optOutDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userNotificationPreferences"]>

  export type UserNotificationPreferencesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    emailEnabled?: boolean
    smsEnabled?: boolean
    pushEnabled?: boolean
    inAppEnabled?: boolean
    categoryPreferences?: boolean
    globalOptOut?: boolean
    quietHours?: boolean
    maxDailyNotifications?: boolean
    maxWeeklyNotifications?: boolean
    consentDate?: boolean
    optOutDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userNotificationPreferences"]>

  export type UserNotificationPreferencesSelectScalar = {
    id?: boolean
    userId?: boolean
    emailEnabled?: boolean
    smsEnabled?: boolean
    pushEnabled?: boolean
    inAppEnabled?: boolean
    categoryPreferences?: boolean
    globalOptOut?: boolean
    quietHours?: boolean
    maxDailyNotifications?: boolean
    maxWeeklyNotifications?: boolean
    consentDate?: boolean
    optOutDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $UserNotificationPreferencesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserNotificationPreferences"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      emailEnabled: boolean
      smsEnabled: boolean
      pushEnabled: boolean
      inAppEnabled: boolean
      categoryPreferences: Prisma.JsonValue
      globalOptOut: boolean
      quietHours: Prisma.JsonValue | null
      maxDailyNotifications: number | null
      maxWeeklyNotifications: number | null
      consentDate: Date | null
      optOutDate: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userNotificationPreferences"]>
    composites: {}
  }

  type UserNotificationPreferencesGetPayload<S extends boolean | null | undefined | UserNotificationPreferencesDefaultArgs> = $Result.GetResult<Prisma.$UserNotificationPreferencesPayload, S>

  type UserNotificationPreferencesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserNotificationPreferencesFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserNotificationPreferencesCountAggregateInputType | true
    }

  export interface UserNotificationPreferencesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserNotificationPreferences'], meta: { name: 'UserNotificationPreferences' } }
    /**
     * Find zero or one UserNotificationPreferences that matches the filter.
     * @param {UserNotificationPreferencesFindUniqueArgs} args - Arguments to find a UserNotificationPreferences
     * @example
     * // Get one UserNotificationPreferences
     * const userNotificationPreferences = await prisma.userNotificationPreferences.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserNotificationPreferencesFindUniqueArgs>(args: SelectSubset<T, UserNotificationPreferencesFindUniqueArgs<ExtArgs>>): Prisma__UserNotificationPreferencesClient<$Result.GetResult<Prisma.$UserNotificationPreferencesPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UserNotificationPreferences that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserNotificationPreferencesFindUniqueOrThrowArgs} args - Arguments to find a UserNotificationPreferences
     * @example
     * // Get one UserNotificationPreferences
     * const userNotificationPreferences = await prisma.userNotificationPreferences.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserNotificationPreferencesFindUniqueOrThrowArgs>(args: SelectSubset<T, UserNotificationPreferencesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserNotificationPreferencesClient<$Result.GetResult<Prisma.$UserNotificationPreferencesPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UserNotificationPreferences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserNotificationPreferencesFindFirstArgs} args - Arguments to find a UserNotificationPreferences
     * @example
     * // Get one UserNotificationPreferences
     * const userNotificationPreferences = await prisma.userNotificationPreferences.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserNotificationPreferencesFindFirstArgs>(args?: SelectSubset<T, UserNotificationPreferencesFindFirstArgs<ExtArgs>>): Prisma__UserNotificationPreferencesClient<$Result.GetResult<Prisma.$UserNotificationPreferencesPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UserNotificationPreferences that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserNotificationPreferencesFindFirstOrThrowArgs} args - Arguments to find a UserNotificationPreferences
     * @example
     * // Get one UserNotificationPreferences
     * const userNotificationPreferences = await prisma.userNotificationPreferences.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserNotificationPreferencesFindFirstOrThrowArgs>(args?: SelectSubset<T, UserNotificationPreferencesFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserNotificationPreferencesClient<$Result.GetResult<Prisma.$UserNotificationPreferencesPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UserNotificationPreferences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserNotificationPreferencesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserNotificationPreferences
     * const userNotificationPreferences = await prisma.userNotificationPreferences.findMany()
     * 
     * // Get first 10 UserNotificationPreferences
     * const userNotificationPreferences = await prisma.userNotificationPreferences.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userNotificationPreferencesWithIdOnly = await prisma.userNotificationPreferences.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserNotificationPreferencesFindManyArgs>(args?: SelectSubset<T, UserNotificationPreferencesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserNotificationPreferencesPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UserNotificationPreferences.
     * @param {UserNotificationPreferencesCreateArgs} args - Arguments to create a UserNotificationPreferences.
     * @example
     * // Create one UserNotificationPreferences
     * const UserNotificationPreferences = await prisma.userNotificationPreferences.create({
     *   data: {
     *     // ... data to create a UserNotificationPreferences
     *   }
     * })
     * 
     */
    create<T extends UserNotificationPreferencesCreateArgs>(args: SelectSubset<T, UserNotificationPreferencesCreateArgs<ExtArgs>>): Prisma__UserNotificationPreferencesClient<$Result.GetResult<Prisma.$UserNotificationPreferencesPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UserNotificationPreferences.
     * @param {UserNotificationPreferencesCreateManyArgs} args - Arguments to create many UserNotificationPreferences.
     * @example
     * // Create many UserNotificationPreferences
     * const userNotificationPreferences = await prisma.userNotificationPreferences.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserNotificationPreferencesCreateManyArgs>(args?: SelectSubset<T, UserNotificationPreferencesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserNotificationPreferences and returns the data saved in the database.
     * @param {UserNotificationPreferencesCreateManyAndReturnArgs} args - Arguments to create many UserNotificationPreferences.
     * @example
     * // Create many UserNotificationPreferences
     * const userNotificationPreferences = await prisma.userNotificationPreferences.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserNotificationPreferences and only return the `id`
     * const userNotificationPreferencesWithIdOnly = await prisma.userNotificationPreferences.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserNotificationPreferencesCreateManyAndReturnArgs>(args?: SelectSubset<T, UserNotificationPreferencesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserNotificationPreferencesPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UserNotificationPreferences.
     * @param {UserNotificationPreferencesDeleteArgs} args - Arguments to delete one UserNotificationPreferences.
     * @example
     * // Delete one UserNotificationPreferences
     * const UserNotificationPreferences = await prisma.userNotificationPreferences.delete({
     *   where: {
     *     // ... filter to delete one UserNotificationPreferences
     *   }
     * })
     * 
     */
    delete<T extends UserNotificationPreferencesDeleteArgs>(args: SelectSubset<T, UserNotificationPreferencesDeleteArgs<ExtArgs>>): Prisma__UserNotificationPreferencesClient<$Result.GetResult<Prisma.$UserNotificationPreferencesPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UserNotificationPreferences.
     * @param {UserNotificationPreferencesUpdateArgs} args - Arguments to update one UserNotificationPreferences.
     * @example
     * // Update one UserNotificationPreferences
     * const userNotificationPreferences = await prisma.userNotificationPreferences.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserNotificationPreferencesUpdateArgs>(args: SelectSubset<T, UserNotificationPreferencesUpdateArgs<ExtArgs>>): Prisma__UserNotificationPreferencesClient<$Result.GetResult<Prisma.$UserNotificationPreferencesPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UserNotificationPreferences.
     * @param {UserNotificationPreferencesDeleteManyArgs} args - Arguments to filter UserNotificationPreferences to delete.
     * @example
     * // Delete a few UserNotificationPreferences
     * const { count } = await prisma.userNotificationPreferences.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserNotificationPreferencesDeleteManyArgs>(args?: SelectSubset<T, UserNotificationPreferencesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserNotificationPreferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserNotificationPreferencesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserNotificationPreferences
     * const userNotificationPreferences = await prisma.userNotificationPreferences.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserNotificationPreferencesUpdateManyArgs>(args: SelectSubset<T, UserNotificationPreferencesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserNotificationPreferences.
     * @param {UserNotificationPreferencesUpsertArgs} args - Arguments to update or create a UserNotificationPreferences.
     * @example
     * // Update or create a UserNotificationPreferences
     * const userNotificationPreferences = await prisma.userNotificationPreferences.upsert({
     *   create: {
     *     // ... data to create a UserNotificationPreferences
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserNotificationPreferences we want to update
     *   }
     * })
     */
    upsert<T extends UserNotificationPreferencesUpsertArgs>(args: SelectSubset<T, UserNotificationPreferencesUpsertArgs<ExtArgs>>): Prisma__UserNotificationPreferencesClient<$Result.GetResult<Prisma.$UserNotificationPreferencesPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UserNotificationPreferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserNotificationPreferencesCountArgs} args - Arguments to filter UserNotificationPreferences to count.
     * @example
     * // Count the number of UserNotificationPreferences
     * const count = await prisma.userNotificationPreferences.count({
     *   where: {
     *     // ... the filter for the UserNotificationPreferences we want to count
     *   }
     * })
    **/
    count<T extends UserNotificationPreferencesCountArgs>(
      args?: Subset<T, UserNotificationPreferencesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserNotificationPreferencesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserNotificationPreferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserNotificationPreferencesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserNotificationPreferencesAggregateArgs>(args: Subset<T, UserNotificationPreferencesAggregateArgs>): Prisma.PrismaPromise<GetUserNotificationPreferencesAggregateType<T>>

    /**
     * Group by UserNotificationPreferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserNotificationPreferencesGroupByArgs} args - Group by arguments.
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
      T extends UserNotificationPreferencesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserNotificationPreferencesGroupByArgs['orderBy'] }
        : { orderBy?: UserNotificationPreferencesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserNotificationPreferencesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserNotificationPreferencesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserNotificationPreferences model
   */
  readonly fields: UserNotificationPreferencesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserNotificationPreferences.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserNotificationPreferencesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the UserNotificationPreferences model
   */ 
  interface UserNotificationPreferencesFieldRefs {
    readonly id: FieldRef<"UserNotificationPreferences", 'String'>
    readonly userId: FieldRef<"UserNotificationPreferences", 'String'>
    readonly emailEnabled: FieldRef<"UserNotificationPreferences", 'Boolean'>
    readonly smsEnabled: FieldRef<"UserNotificationPreferences", 'Boolean'>
    readonly pushEnabled: FieldRef<"UserNotificationPreferences", 'Boolean'>
    readonly inAppEnabled: FieldRef<"UserNotificationPreferences", 'Boolean'>
    readonly categoryPreferences: FieldRef<"UserNotificationPreferences", 'Json'>
    readonly globalOptOut: FieldRef<"UserNotificationPreferences", 'Boolean'>
    readonly quietHours: FieldRef<"UserNotificationPreferences", 'Json'>
    readonly maxDailyNotifications: FieldRef<"UserNotificationPreferences", 'Int'>
    readonly maxWeeklyNotifications: FieldRef<"UserNotificationPreferences", 'Int'>
    readonly consentDate: FieldRef<"UserNotificationPreferences", 'DateTime'>
    readonly optOutDate: FieldRef<"UserNotificationPreferences", 'DateTime'>
    readonly createdAt: FieldRef<"UserNotificationPreferences", 'DateTime'>
    readonly updatedAt: FieldRef<"UserNotificationPreferences", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserNotificationPreferences findUnique
   */
  export type UserNotificationPreferencesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotificationPreferences
     */
    select?: UserNotificationPreferencesSelect<ExtArgs> | null
    /**
     * Filter, which UserNotificationPreferences to fetch.
     */
    where: UserNotificationPreferencesWhereUniqueInput
  }

  /**
   * UserNotificationPreferences findUniqueOrThrow
   */
  export type UserNotificationPreferencesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotificationPreferences
     */
    select?: UserNotificationPreferencesSelect<ExtArgs> | null
    /**
     * Filter, which UserNotificationPreferences to fetch.
     */
    where: UserNotificationPreferencesWhereUniqueInput
  }

  /**
   * UserNotificationPreferences findFirst
   */
  export type UserNotificationPreferencesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotificationPreferences
     */
    select?: UserNotificationPreferencesSelect<ExtArgs> | null
    /**
     * Filter, which UserNotificationPreferences to fetch.
     */
    where?: UserNotificationPreferencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserNotificationPreferences to fetch.
     */
    orderBy?: UserNotificationPreferencesOrderByWithRelationInput | UserNotificationPreferencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserNotificationPreferences.
     */
    cursor?: UserNotificationPreferencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserNotificationPreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserNotificationPreferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserNotificationPreferences.
     */
    distinct?: UserNotificationPreferencesScalarFieldEnum | UserNotificationPreferencesScalarFieldEnum[]
  }

  /**
   * UserNotificationPreferences findFirstOrThrow
   */
  export type UserNotificationPreferencesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotificationPreferences
     */
    select?: UserNotificationPreferencesSelect<ExtArgs> | null
    /**
     * Filter, which UserNotificationPreferences to fetch.
     */
    where?: UserNotificationPreferencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserNotificationPreferences to fetch.
     */
    orderBy?: UserNotificationPreferencesOrderByWithRelationInput | UserNotificationPreferencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserNotificationPreferences.
     */
    cursor?: UserNotificationPreferencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserNotificationPreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserNotificationPreferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserNotificationPreferences.
     */
    distinct?: UserNotificationPreferencesScalarFieldEnum | UserNotificationPreferencesScalarFieldEnum[]
  }

  /**
   * UserNotificationPreferences findMany
   */
  export type UserNotificationPreferencesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotificationPreferences
     */
    select?: UserNotificationPreferencesSelect<ExtArgs> | null
    /**
     * Filter, which UserNotificationPreferences to fetch.
     */
    where?: UserNotificationPreferencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserNotificationPreferences to fetch.
     */
    orderBy?: UserNotificationPreferencesOrderByWithRelationInput | UserNotificationPreferencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserNotificationPreferences.
     */
    cursor?: UserNotificationPreferencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserNotificationPreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserNotificationPreferences.
     */
    skip?: number
    distinct?: UserNotificationPreferencesScalarFieldEnum | UserNotificationPreferencesScalarFieldEnum[]
  }

  /**
   * UserNotificationPreferences create
   */
  export type UserNotificationPreferencesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotificationPreferences
     */
    select?: UserNotificationPreferencesSelect<ExtArgs> | null
    /**
     * The data needed to create a UserNotificationPreferences.
     */
    data: XOR<UserNotificationPreferencesCreateInput, UserNotificationPreferencesUncheckedCreateInput>
  }

  /**
   * UserNotificationPreferences createMany
   */
  export type UserNotificationPreferencesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserNotificationPreferences.
     */
    data: UserNotificationPreferencesCreateManyInput | UserNotificationPreferencesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserNotificationPreferences createManyAndReturn
   */
  export type UserNotificationPreferencesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotificationPreferences
     */
    select?: UserNotificationPreferencesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UserNotificationPreferences.
     */
    data: UserNotificationPreferencesCreateManyInput | UserNotificationPreferencesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserNotificationPreferences update
   */
  export type UserNotificationPreferencesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotificationPreferences
     */
    select?: UserNotificationPreferencesSelect<ExtArgs> | null
    /**
     * The data needed to update a UserNotificationPreferences.
     */
    data: XOR<UserNotificationPreferencesUpdateInput, UserNotificationPreferencesUncheckedUpdateInput>
    /**
     * Choose, which UserNotificationPreferences to update.
     */
    where: UserNotificationPreferencesWhereUniqueInput
  }

  /**
   * UserNotificationPreferences updateMany
   */
  export type UserNotificationPreferencesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserNotificationPreferences.
     */
    data: XOR<UserNotificationPreferencesUpdateManyMutationInput, UserNotificationPreferencesUncheckedUpdateManyInput>
    /**
     * Filter which UserNotificationPreferences to update
     */
    where?: UserNotificationPreferencesWhereInput
  }

  /**
   * UserNotificationPreferences upsert
   */
  export type UserNotificationPreferencesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotificationPreferences
     */
    select?: UserNotificationPreferencesSelect<ExtArgs> | null
    /**
     * The filter to search for the UserNotificationPreferences to update in case it exists.
     */
    where: UserNotificationPreferencesWhereUniqueInput
    /**
     * In case the UserNotificationPreferences found by the `where` argument doesn't exist, create a new UserNotificationPreferences with this data.
     */
    create: XOR<UserNotificationPreferencesCreateInput, UserNotificationPreferencesUncheckedCreateInput>
    /**
     * In case the UserNotificationPreferences was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserNotificationPreferencesUpdateInput, UserNotificationPreferencesUncheckedUpdateInput>
  }

  /**
   * UserNotificationPreferences delete
   */
  export type UserNotificationPreferencesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotificationPreferences
     */
    select?: UserNotificationPreferencesSelect<ExtArgs> | null
    /**
     * Filter which UserNotificationPreferences to delete.
     */
    where: UserNotificationPreferencesWhereUniqueInput
  }

  /**
   * UserNotificationPreferences deleteMany
   */
  export type UserNotificationPreferencesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserNotificationPreferences to delete
     */
    where?: UserNotificationPreferencesWhereInput
  }

  /**
   * UserNotificationPreferences without action
   */
  export type UserNotificationPreferencesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotificationPreferences
     */
    select?: UserNotificationPreferencesSelect<ExtArgs> | null
  }


  /**
   * Model NotificationSuppressionList
   */

  export type AggregateNotificationSuppressionList = {
    _count: NotificationSuppressionListCountAggregateOutputType | null
    _min: NotificationSuppressionListMinAggregateOutputType | null
    _max: NotificationSuppressionListMaxAggregateOutputType | null
  }

  export type NotificationSuppressionListMinAggregateOutputType = {
    id: string | null
    identifier: string | null
    channel: string | null
    reason: string | null
    addedBy: string | null
    addedAt: Date | null
    expiresAt: Date | null
    isActive: boolean | null
  }

  export type NotificationSuppressionListMaxAggregateOutputType = {
    id: string | null
    identifier: string | null
    channel: string | null
    reason: string | null
    addedBy: string | null
    addedAt: Date | null
    expiresAt: Date | null
    isActive: boolean | null
  }

  export type NotificationSuppressionListCountAggregateOutputType = {
    id: number
    identifier: number
    channel: number
    reason: number
    addedBy: number
    addedAt: number
    expiresAt: number
    isActive: number
    _all: number
  }


  export type NotificationSuppressionListMinAggregateInputType = {
    id?: true
    identifier?: true
    channel?: true
    reason?: true
    addedBy?: true
    addedAt?: true
    expiresAt?: true
    isActive?: true
  }

  export type NotificationSuppressionListMaxAggregateInputType = {
    id?: true
    identifier?: true
    channel?: true
    reason?: true
    addedBy?: true
    addedAt?: true
    expiresAt?: true
    isActive?: true
  }

  export type NotificationSuppressionListCountAggregateInputType = {
    id?: true
    identifier?: true
    channel?: true
    reason?: true
    addedBy?: true
    addedAt?: true
    expiresAt?: true
    isActive?: true
    _all?: true
  }

  export type NotificationSuppressionListAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationSuppressionList to aggregate.
     */
    where?: NotificationSuppressionListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationSuppressionLists to fetch.
     */
    orderBy?: NotificationSuppressionListOrderByWithRelationInput | NotificationSuppressionListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationSuppressionListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationSuppressionLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationSuppressionLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NotificationSuppressionLists
    **/
    _count?: true | NotificationSuppressionListCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationSuppressionListMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationSuppressionListMaxAggregateInputType
  }

  export type GetNotificationSuppressionListAggregateType<T extends NotificationSuppressionListAggregateArgs> = {
        [P in keyof T & keyof AggregateNotificationSuppressionList]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotificationSuppressionList[P]>
      : GetScalarType<T[P], AggregateNotificationSuppressionList[P]>
  }




  export type NotificationSuppressionListGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationSuppressionListWhereInput
    orderBy?: NotificationSuppressionListOrderByWithAggregationInput | NotificationSuppressionListOrderByWithAggregationInput[]
    by: NotificationSuppressionListScalarFieldEnum[] | NotificationSuppressionListScalarFieldEnum
    having?: NotificationSuppressionListScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationSuppressionListCountAggregateInputType | true
    _min?: NotificationSuppressionListMinAggregateInputType
    _max?: NotificationSuppressionListMaxAggregateInputType
  }

  export type NotificationSuppressionListGroupByOutputType = {
    id: string
    identifier: string
    channel: string
    reason: string
    addedBy: string | null
    addedAt: Date
    expiresAt: Date | null
    isActive: boolean
    _count: NotificationSuppressionListCountAggregateOutputType | null
    _min: NotificationSuppressionListMinAggregateOutputType | null
    _max: NotificationSuppressionListMaxAggregateOutputType | null
  }

  type GetNotificationSuppressionListGroupByPayload<T extends NotificationSuppressionListGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationSuppressionListGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationSuppressionListGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationSuppressionListGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationSuppressionListGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSuppressionListSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    channel?: boolean
    reason?: boolean
    addedBy?: boolean
    addedAt?: boolean
    expiresAt?: boolean
    isActive?: boolean
  }, ExtArgs["result"]["notificationSuppressionList"]>

  export type NotificationSuppressionListSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    channel?: boolean
    reason?: boolean
    addedBy?: boolean
    addedAt?: boolean
    expiresAt?: boolean
    isActive?: boolean
  }, ExtArgs["result"]["notificationSuppressionList"]>

  export type NotificationSuppressionListSelectScalar = {
    id?: boolean
    identifier?: boolean
    channel?: boolean
    reason?: boolean
    addedBy?: boolean
    addedAt?: boolean
    expiresAt?: boolean
    isActive?: boolean
  }


  export type $NotificationSuppressionListPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NotificationSuppressionList"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      identifier: string
      channel: string
      reason: string
      addedBy: string | null
      addedAt: Date
      expiresAt: Date | null
      isActive: boolean
    }, ExtArgs["result"]["notificationSuppressionList"]>
    composites: {}
  }

  type NotificationSuppressionListGetPayload<S extends boolean | null | undefined | NotificationSuppressionListDefaultArgs> = $Result.GetResult<Prisma.$NotificationSuppressionListPayload, S>

  type NotificationSuppressionListCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NotificationSuppressionListFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NotificationSuppressionListCountAggregateInputType | true
    }

  export interface NotificationSuppressionListDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NotificationSuppressionList'], meta: { name: 'NotificationSuppressionList' } }
    /**
     * Find zero or one NotificationSuppressionList that matches the filter.
     * @param {NotificationSuppressionListFindUniqueArgs} args - Arguments to find a NotificationSuppressionList
     * @example
     * // Get one NotificationSuppressionList
     * const notificationSuppressionList = await prisma.notificationSuppressionList.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationSuppressionListFindUniqueArgs>(args: SelectSubset<T, NotificationSuppressionListFindUniqueArgs<ExtArgs>>): Prisma__NotificationSuppressionListClient<$Result.GetResult<Prisma.$NotificationSuppressionListPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one NotificationSuppressionList that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NotificationSuppressionListFindUniqueOrThrowArgs} args - Arguments to find a NotificationSuppressionList
     * @example
     * // Get one NotificationSuppressionList
     * const notificationSuppressionList = await prisma.notificationSuppressionList.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationSuppressionListFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationSuppressionListFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationSuppressionListClient<$Result.GetResult<Prisma.$NotificationSuppressionListPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first NotificationSuppressionList that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationSuppressionListFindFirstArgs} args - Arguments to find a NotificationSuppressionList
     * @example
     * // Get one NotificationSuppressionList
     * const notificationSuppressionList = await prisma.notificationSuppressionList.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationSuppressionListFindFirstArgs>(args?: SelectSubset<T, NotificationSuppressionListFindFirstArgs<ExtArgs>>): Prisma__NotificationSuppressionListClient<$Result.GetResult<Prisma.$NotificationSuppressionListPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first NotificationSuppressionList that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationSuppressionListFindFirstOrThrowArgs} args - Arguments to find a NotificationSuppressionList
     * @example
     * // Get one NotificationSuppressionList
     * const notificationSuppressionList = await prisma.notificationSuppressionList.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationSuppressionListFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationSuppressionListFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationSuppressionListClient<$Result.GetResult<Prisma.$NotificationSuppressionListPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more NotificationSuppressionLists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationSuppressionListFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NotificationSuppressionLists
     * const notificationSuppressionLists = await prisma.notificationSuppressionList.findMany()
     * 
     * // Get first 10 NotificationSuppressionLists
     * const notificationSuppressionLists = await prisma.notificationSuppressionList.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationSuppressionListWithIdOnly = await prisma.notificationSuppressionList.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationSuppressionListFindManyArgs>(args?: SelectSubset<T, NotificationSuppressionListFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationSuppressionListPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a NotificationSuppressionList.
     * @param {NotificationSuppressionListCreateArgs} args - Arguments to create a NotificationSuppressionList.
     * @example
     * // Create one NotificationSuppressionList
     * const NotificationSuppressionList = await prisma.notificationSuppressionList.create({
     *   data: {
     *     // ... data to create a NotificationSuppressionList
     *   }
     * })
     * 
     */
    create<T extends NotificationSuppressionListCreateArgs>(args: SelectSubset<T, NotificationSuppressionListCreateArgs<ExtArgs>>): Prisma__NotificationSuppressionListClient<$Result.GetResult<Prisma.$NotificationSuppressionListPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many NotificationSuppressionLists.
     * @param {NotificationSuppressionListCreateManyArgs} args - Arguments to create many NotificationSuppressionLists.
     * @example
     * // Create many NotificationSuppressionLists
     * const notificationSuppressionList = await prisma.notificationSuppressionList.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationSuppressionListCreateManyArgs>(args?: SelectSubset<T, NotificationSuppressionListCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NotificationSuppressionLists and returns the data saved in the database.
     * @param {NotificationSuppressionListCreateManyAndReturnArgs} args - Arguments to create many NotificationSuppressionLists.
     * @example
     * // Create many NotificationSuppressionLists
     * const notificationSuppressionList = await prisma.notificationSuppressionList.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NotificationSuppressionLists and only return the `id`
     * const notificationSuppressionListWithIdOnly = await prisma.notificationSuppressionList.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationSuppressionListCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationSuppressionListCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationSuppressionListPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a NotificationSuppressionList.
     * @param {NotificationSuppressionListDeleteArgs} args - Arguments to delete one NotificationSuppressionList.
     * @example
     * // Delete one NotificationSuppressionList
     * const NotificationSuppressionList = await prisma.notificationSuppressionList.delete({
     *   where: {
     *     // ... filter to delete one NotificationSuppressionList
     *   }
     * })
     * 
     */
    delete<T extends NotificationSuppressionListDeleteArgs>(args: SelectSubset<T, NotificationSuppressionListDeleteArgs<ExtArgs>>): Prisma__NotificationSuppressionListClient<$Result.GetResult<Prisma.$NotificationSuppressionListPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one NotificationSuppressionList.
     * @param {NotificationSuppressionListUpdateArgs} args - Arguments to update one NotificationSuppressionList.
     * @example
     * // Update one NotificationSuppressionList
     * const notificationSuppressionList = await prisma.notificationSuppressionList.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationSuppressionListUpdateArgs>(args: SelectSubset<T, NotificationSuppressionListUpdateArgs<ExtArgs>>): Prisma__NotificationSuppressionListClient<$Result.GetResult<Prisma.$NotificationSuppressionListPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more NotificationSuppressionLists.
     * @param {NotificationSuppressionListDeleteManyArgs} args - Arguments to filter NotificationSuppressionLists to delete.
     * @example
     * // Delete a few NotificationSuppressionLists
     * const { count } = await prisma.notificationSuppressionList.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationSuppressionListDeleteManyArgs>(args?: SelectSubset<T, NotificationSuppressionListDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NotificationSuppressionLists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationSuppressionListUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NotificationSuppressionLists
     * const notificationSuppressionList = await prisma.notificationSuppressionList.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationSuppressionListUpdateManyArgs>(args: SelectSubset<T, NotificationSuppressionListUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one NotificationSuppressionList.
     * @param {NotificationSuppressionListUpsertArgs} args - Arguments to update or create a NotificationSuppressionList.
     * @example
     * // Update or create a NotificationSuppressionList
     * const notificationSuppressionList = await prisma.notificationSuppressionList.upsert({
     *   create: {
     *     // ... data to create a NotificationSuppressionList
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NotificationSuppressionList we want to update
     *   }
     * })
     */
    upsert<T extends NotificationSuppressionListUpsertArgs>(args: SelectSubset<T, NotificationSuppressionListUpsertArgs<ExtArgs>>): Prisma__NotificationSuppressionListClient<$Result.GetResult<Prisma.$NotificationSuppressionListPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of NotificationSuppressionLists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationSuppressionListCountArgs} args - Arguments to filter NotificationSuppressionLists to count.
     * @example
     * // Count the number of NotificationSuppressionLists
     * const count = await prisma.notificationSuppressionList.count({
     *   where: {
     *     // ... the filter for the NotificationSuppressionLists we want to count
     *   }
     * })
    **/
    count<T extends NotificationSuppressionListCountArgs>(
      args?: Subset<T, NotificationSuppressionListCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationSuppressionListCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NotificationSuppressionList.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationSuppressionListAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NotificationSuppressionListAggregateArgs>(args: Subset<T, NotificationSuppressionListAggregateArgs>): Prisma.PrismaPromise<GetNotificationSuppressionListAggregateType<T>>

    /**
     * Group by NotificationSuppressionList.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationSuppressionListGroupByArgs} args - Group by arguments.
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
      T extends NotificationSuppressionListGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationSuppressionListGroupByArgs['orderBy'] }
        : { orderBy?: NotificationSuppressionListGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, NotificationSuppressionListGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationSuppressionListGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NotificationSuppressionList model
   */
  readonly fields: NotificationSuppressionListFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NotificationSuppressionList.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationSuppressionListClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the NotificationSuppressionList model
   */ 
  interface NotificationSuppressionListFieldRefs {
    readonly id: FieldRef<"NotificationSuppressionList", 'String'>
    readonly identifier: FieldRef<"NotificationSuppressionList", 'String'>
    readonly channel: FieldRef<"NotificationSuppressionList", 'String'>
    readonly reason: FieldRef<"NotificationSuppressionList", 'String'>
    readonly addedBy: FieldRef<"NotificationSuppressionList", 'String'>
    readonly addedAt: FieldRef<"NotificationSuppressionList", 'DateTime'>
    readonly expiresAt: FieldRef<"NotificationSuppressionList", 'DateTime'>
    readonly isActive: FieldRef<"NotificationSuppressionList", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * NotificationSuppressionList findUnique
   */
  export type NotificationSuppressionListFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationSuppressionList
     */
    select?: NotificationSuppressionListSelect<ExtArgs> | null
    /**
     * Filter, which NotificationSuppressionList to fetch.
     */
    where: NotificationSuppressionListWhereUniqueInput
  }

  /**
   * NotificationSuppressionList findUniqueOrThrow
   */
  export type NotificationSuppressionListFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationSuppressionList
     */
    select?: NotificationSuppressionListSelect<ExtArgs> | null
    /**
     * Filter, which NotificationSuppressionList to fetch.
     */
    where: NotificationSuppressionListWhereUniqueInput
  }

  /**
   * NotificationSuppressionList findFirst
   */
  export type NotificationSuppressionListFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationSuppressionList
     */
    select?: NotificationSuppressionListSelect<ExtArgs> | null
    /**
     * Filter, which NotificationSuppressionList to fetch.
     */
    where?: NotificationSuppressionListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationSuppressionLists to fetch.
     */
    orderBy?: NotificationSuppressionListOrderByWithRelationInput | NotificationSuppressionListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationSuppressionLists.
     */
    cursor?: NotificationSuppressionListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationSuppressionLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationSuppressionLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationSuppressionLists.
     */
    distinct?: NotificationSuppressionListScalarFieldEnum | NotificationSuppressionListScalarFieldEnum[]
  }

  /**
   * NotificationSuppressionList findFirstOrThrow
   */
  export type NotificationSuppressionListFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationSuppressionList
     */
    select?: NotificationSuppressionListSelect<ExtArgs> | null
    /**
     * Filter, which NotificationSuppressionList to fetch.
     */
    where?: NotificationSuppressionListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationSuppressionLists to fetch.
     */
    orderBy?: NotificationSuppressionListOrderByWithRelationInput | NotificationSuppressionListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationSuppressionLists.
     */
    cursor?: NotificationSuppressionListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationSuppressionLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationSuppressionLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationSuppressionLists.
     */
    distinct?: NotificationSuppressionListScalarFieldEnum | NotificationSuppressionListScalarFieldEnum[]
  }

  /**
   * NotificationSuppressionList findMany
   */
  export type NotificationSuppressionListFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationSuppressionList
     */
    select?: NotificationSuppressionListSelect<ExtArgs> | null
    /**
     * Filter, which NotificationSuppressionLists to fetch.
     */
    where?: NotificationSuppressionListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationSuppressionLists to fetch.
     */
    orderBy?: NotificationSuppressionListOrderByWithRelationInput | NotificationSuppressionListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NotificationSuppressionLists.
     */
    cursor?: NotificationSuppressionListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationSuppressionLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationSuppressionLists.
     */
    skip?: number
    distinct?: NotificationSuppressionListScalarFieldEnum | NotificationSuppressionListScalarFieldEnum[]
  }

  /**
   * NotificationSuppressionList create
   */
  export type NotificationSuppressionListCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationSuppressionList
     */
    select?: NotificationSuppressionListSelect<ExtArgs> | null
    /**
     * The data needed to create a NotificationSuppressionList.
     */
    data: XOR<NotificationSuppressionListCreateInput, NotificationSuppressionListUncheckedCreateInput>
  }

  /**
   * NotificationSuppressionList createMany
   */
  export type NotificationSuppressionListCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NotificationSuppressionLists.
     */
    data: NotificationSuppressionListCreateManyInput | NotificationSuppressionListCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NotificationSuppressionList createManyAndReturn
   */
  export type NotificationSuppressionListCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationSuppressionList
     */
    select?: NotificationSuppressionListSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many NotificationSuppressionLists.
     */
    data: NotificationSuppressionListCreateManyInput | NotificationSuppressionListCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NotificationSuppressionList update
   */
  export type NotificationSuppressionListUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationSuppressionList
     */
    select?: NotificationSuppressionListSelect<ExtArgs> | null
    /**
     * The data needed to update a NotificationSuppressionList.
     */
    data: XOR<NotificationSuppressionListUpdateInput, NotificationSuppressionListUncheckedUpdateInput>
    /**
     * Choose, which NotificationSuppressionList to update.
     */
    where: NotificationSuppressionListWhereUniqueInput
  }

  /**
   * NotificationSuppressionList updateMany
   */
  export type NotificationSuppressionListUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NotificationSuppressionLists.
     */
    data: XOR<NotificationSuppressionListUpdateManyMutationInput, NotificationSuppressionListUncheckedUpdateManyInput>
    /**
     * Filter which NotificationSuppressionLists to update
     */
    where?: NotificationSuppressionListWhereInput
  }

  /**
   * NotificationSuppressionList upsert
   */
  export type NotificationSuppressionListUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationSuppressionList
     */
    select?: NotificationSuppressionListSelect<ExtArgs> | null
    /**
     * The filter to search for the NotificationSuppressionList to update in case it exists.
     */
    where: NotificationSuppressionListWhereUniqueInput
    /**
     * In case the NotificationSuppressionList found by the `where` argument doesn't exist, create a new NotificationSuppressionList with this data.
     */
    create: XOR<NotificationSuppressionListCreateInput, NotificationSuppressionListUncheckedCreateInput>
    /**
     * In case the NotificationSuppressionList was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationSuppressionListUpdateInput, NotificationSuppressionListUncheckedUpdateInput>
  }

  /**
   * NotificationSuppressionList delete
   */
  export type NotificationSuppressionListDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationSuppressionList
     */
    select?: NotificationSuppressionListSelect<ExtArgs> | null
    /**
     * Filter which NotificationSuppressionList to delete.
     */
    where: NotificationSuppressionListWhereUniqueInput
  }

  /**
   * NotificationSuppressionList deleteMany
   */
  export type NotificationSuppressionListDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationSuppressionLists to delete
     */
    where?: NotificationSuppressionListWhereInput
  }

  /**
   * NotificationSuppressionList without action
   */
  export type NotificationSuppressionListDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationSuppressionList
     */
    select?: NotificationSuppressionListSelect<ExtArgs> | null
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


  export const TemplateScalarFieldEnum: {
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

  export type TemplateScalarFieldEnum = (typeof TemplateScalarFieldEnum)[keyof typeof TemplateScalarFieldEnum]


  export const TemplateVersionScalarFieldEnum: {
    id: 'id',
    templateId: 'templateId',
    version: 'version',
    content: 'content',
    changelog: 'changelog',
    createdAt: 'createdAt',
    isActive: 'isActive'
  };

  export type TemplateVersionScalarFieldEnum = (typeof TemplateVersionScalarFieldEnum)[keyof typeof TemplateVersionScalarFieldEnum]


  export const CompiledTemplateScalarFieldEnum: {
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

  export type CompiledTemplateScalarFieldEnum = (typeof CompiledTemplateScalarFieldEnum)[keyof typeof CompiledTemplateScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
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

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const NotificationDeliveryTrackingScalarFieldEnum: {
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

  export type NotificationDeliveryTrackingScalarFieldEnum = (typeof NotificationDeliveryTrackingScalarFieldEnum)[keyof typeof NotificationDeliveryTrackingScalarFieldEnum]


  export const UserNotificationPreferencesScalarFieldEnum: {
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

  export type UserNotificationPreferencesScalarFieldEnum = (typeof UserNotificationPreferencesScalarFieldEnum)[keyof typeof UserNotificationPreferencesScalarFieldEnum]


  export const NotificationSuppressionListScalarFieldEnum: {
    id: 'id',
    identifier: 'identifier',
    channel: 'channel',
    reason: 'reason',
    addedBy: 'addedBy',
    addedAt: 'addedAt',
    expiresAt: 'expiresAt',
    isActive: 'isActive'
  };

  export type NotificationSuppressionListScalarFieldEnum = (typeof NotificationSuppressionListScalarFieldEnum)[keyof typeof NotificationSuppressionListScalarFieldEnum]


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
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


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


  export type TemplateWhereInput = {
    AND?: TemplateWhereInput | TemplateWhereInput[]
    OR?: TemplateWhereInput[]
    NOT?: TemplateWhereInput | TemplateWhereInput[]
    id?: StringFilter<"Template"> | string
    name?: StringFilter<"Template"> | string
    description?: StringNullableFilter<"Template"> | string | null
    category?: StringFilter<"Template"> | string
    channels?: StringNullableListFilter<"Template">
    activeVersion?: StringNullableFilter<"Template"> | string | null
    languages?: StringNullableListFilter<"Template">
    defaultLanguage?: StringFilter<"Template"> | string
    requiredVariables?: StringNullableListFilter<"Template">
    optionalVariables?: StringNullableListFilter<"Template">
    variableSchema?: JsonNullableFilter<"Template">
    createdBy?: StringFilter<"Template"> | string
    createdAt?: DateTimeFilter<"Template"> | Date | string
    updatedAt?: DateTimeFilter<"Template"> | Date | string
    isActive?: BoolFilter<"Template"> | boolean
    versions?: TemplateVersionListRelationFilter
  }

  export type TemplateOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    category?: SortOrder
    channels?: SortOrder
    activeVersion?: SortOrderInput | SortOrder
    languages?: SortOrder
    defaultLanguage?: SortOrder
    requiredVariables?: SortOrder
    optionalVariables?: SortOrder
    variableSchema?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isActive?: SortOrder
    versions?: TemplateVersionOrderByRelationAggregateInput
  }

  export type TemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: TemplateWhereInput | TemplateWhereInput[]
    OR?: TemplateWhereInput[]
    NOT?: TemplateWhereInput | TemplateWhereInput[]
    description?: StringNullableFilter<"Template"> | string | null
    category?: StringFilter<"Template"> | string
    channels?: StringNullableListFilter<"Template">
    activeVersion?: StringNullableFilter<"Template"> | string | null
    languages?: StringNullableListFilter<"Template">
    defaultLanguage?: StringFilter<"Template"> | string
    requiredVariables?: StringNullableListFilter<"Template">
    optionalVariables?: StringNullableListFilter<"Template">
    variableSchema?: JsonNullableFilter<"Template">
    createdBy?: StringFilter<"Template"> | string
    createdAt?: DateTimeFilter<"Template"> | Date | string
    updatedAt?: DateTimeFilter<"Template"> | Date | string
    isActive?: BoolFilter<"Template"> | boolean
    versions?: TemplateVersionListRelationFilter
  }, "id" | "name">

  export type TemplateOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    category?: SortOrder
    channels?: SortOrder
    activeVersion?: SortOrderInput | SortOrder
    languages?: SortOrder
    defaultLanguage?: SortOrder
    requiredVariables?: SortOrder
    optionalVariables?: SortOrder
    variableSchema?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isActive?: SortOrder
    _count?: TemplateCountOrderByAggregateInput
    _max?: TemplateMaxOrderByAggregateInput
    _min?: TemplateMinOrderByAggregateInput
  }

  export type TemplateScalarWhereWithAggregatesInput = {
    AND?: TemplateScalarWhereWithAggregatesInput | TemplateScalarWhereWithAggregatesInput[]
    OR?: TemplateScalarWhereWithAggregatesInput[]
    NOT?: TemplateScalarWhereWithAggregatesInput | TemplateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Template"> | string
    name?: StringWithAggregatesFilter<"Template"> | string
    description?: StringNullableWithAggregatesFilter<"Template"> | string | null
    category?: StringWithAggregatesFilter<"Template"> | string
    channels?: StringNullableListFilter<"Template">
    activeVersion?: StringNullableWithAggregatesFilter<"Template"> | string | null
    languages?: StringNullableListFilter<"Template">
    defaultLanguage?: StringWithAggregatesFilter<"Template"> | string
    requiredVariables?: StringNullableListFilter<"Template">
    optionalVariables?: StringNullableListFilter<"Template">
    variableSchema?: JsonNullableWithAggregatesFilter<"Template">
    createdBy?: StringWithAggregatesFilter<"Template"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Template"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Template"> | Date | string
    isActive?: BoolWithAggregatesFilter<"Template"> | boolean
  }

  export type TemplateVersionWhereInput = {
    AND?: TemplateVersionWhereInput | TemplateVersionWhereInput[]
    OR?: TemplateVersionWhereInput[]
    NOT?: TemplateVersionWhereInput | TemplateVersionWhereInput[]
    id?: StringFilter<"TemplateVersion"> | string
    templateId?: StringFilter<"TemplateVersion"> | string
    version?: StringFilter<"TemplateVersion"> | string
    content?: JsonFilter<"TemplateVersion">
    changelog?: StringNullableFilter<"TemplateVersion"> | string | null
    createdAt?: DateTimeFilter<"TemplateVersion"> | Date | string
    isActive?: BoolFilter<"TemplateVersion"> | boolean
    template?: XOR<TemplateRelationFilter, TemplateWhereInput>
  }

  export type TemplateVersionOrderByWithRelationInput = {
    id?: SortOrder
    templateId?: SortOrder
    version?: SortOrder
    content?: SortOrder
    changelog?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    isActive?: SortOrder
    template?: TemplateOrderByWithRelationInput
  }

  export type TemplateVersionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    templateId_version?: TemplateVersionTemplateIdVersionCompoundUniqueInput
    AND?: TemplateVersionWhereInput | TemplateVersionWhereInput[]
    OR?: TemplateVersionWhereInput[]
    NOT?: TemplateVersionWhereInput | TemplateVersionWhereInput[]
    templateId?: StringFilter<"TemplateVersion"> | string
    version?: StringFilter<"TemplateVersion"> | string
    content?: JsonFilter<"TemplateVersion">
    changelog?: StringNullableFilter<"TemplateVersion"> | string | null
    createdAt?: DateTimeFilter<"TemplateVersion"> | Date | string
    isActive?: BoolFilter<"TemplateVersion"> | boolean
    template?: XOR<TemplateRelationFilter, TemplateWhereInput>
  }, "id" | "templateId_version">

  export type TemplateVersionOrderByWithAggregationInput = {
    id?: SortOrder
    templateId?: SortOrder
    version?: SortOrder
    content?: SortOrder
    changelog?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    isActive?: SortOrder
    _count?: TemplateVersionCountOrderByAggregateInput
    _max?: TemplateVersionMaxOrderByAggregateInput
    _min?: TemplateVersionMinOrderByAggregateInput
  }

  export type TemplateVersionScalarWhereWithAggregatesInput = {
    AND?: TemplateVersionScalarWhereWithAggregatesInput | TemplateVersionScalarWhereWithAggregatesInput[]
    OR?: TemplateVersionScalarWhereWithAggregatesInput[]
    NOT?: TemplateVersionScalarWhereWithAggregatesInput | TemplateVersionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TemplateVersion"> | string
    templateId?: StringWithAggregatesFilter<"TemplateVersion"> | string
    version?: StringWithAggregatesFilter<"TemplateVersion"> | string
    content?: JsonWithAggregatesFilter<"TemplateVersion">
    changelog?: StringNullableWithAggregatesFilter<"TemplateVersion"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TemplateVersion"> | Date | string
    isActive?: BoolWithAggregatesFilter<"TemplateVersion"> | boolean
  }

  export type CompiledTemplateWhereInput = {
    AND?: CompiledTemplateWhereInput | CompiledTemplateWhereInput[]
    OR?: CompiledTemplateWhereInput[]
    NOT?: CompiledTemplateWhereInput | CompiledTemplateWhereInput[]
    id?: StringFilter<"CompiledTemplate"> | string
    templateId?: StringFilter<"CompiledTemplate"> | string
    version?: StringFilter<"CompiledTemplate"> | string
    language?: StringFilter<"CompiledTemplate"> | string
    channel?: StringFilter<"CompiledTemplate"> | string
    compiledContent?: JsonFilter<"CompiledTemplate">
    requiredVariables?: StringNullableListFilter<"CompiledTemplate">
    compiledAt?: DateTimeFilter<"CompiledTemplate"> | Date | string
    expiresAt?: DateTimeNullableFilter<"CompiledTemplate"> | Date | string | null
  }

  export type CompiledTemplateOrderByWithRelationInput = {
    id?: SortOrder
    templateId?: SortOrder
    version?: SortOrder
    language?: SortOrder
    channel?: SortOrder
    compiledContent?: SortOrder
    requiredVariables?: SortOrder
    compiledAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
  }

  export type CompiledTemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    templateId_version_language_channel?: CompiledTemplateTemplateIdVersionLanguageChannelCompoundUniqueInput
    AND?: CompiledTemplateWhereInput | CompiledTemplateWhereInput[]
    OR?: CompiledTemplateWhereInput[]
    NOT?: CompiledTemplateWhereInput | CompiledTemplateWhereInput[]
    templateId?: StringFilter<"CompiledTemplate"> | string
    version?: StringFilter<"CompiledTemplate"> | string
    language?: StringFilter<"CompiledTemplate"> | string
    channel?: StringFilter<"CompiledTemplate"> | string
    compiledContent?: JsonFilter<"CompiledTemplate">
    requiredVariables?: StringNullableListFilter<"CompiledTemplate">
    compiledAt?: DateTimeFilter<"CompiledTemplate"> | Date | string
    expiresAt?: DateTimeNullableFilter<"CompiledTemplate"> | Date | string | null
  }, "id" | "templateId_version_language_channel">

  export type CompiledTemplateOrderByWithAggregationInput = {
    id?: SortOrder
    templateId?: SortOrder
    version?: SortOrder
    language?: SortOrder
    channel?: SortOrder
    compiledContent?: SortOrder
    requiredVariables?: SortOrder
    compiledAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    _count?: CompiledTemplateCountOrderByAggregateInput
    _max?: CompiledTemplateMaxOrderByAggregateInput
    _min?: CompiledTemplateMinOrderByAggregateInput
  }

  export type CompiledTemplateScalarWhereWithAggregatesInput = {
    AND?: CompiledTemplateScalarWhereWithAggregatesInput | CompiledTemplateScalarWhereWithAggregatesInput[]
    OR?: CompiledTemplateScalarWhereWithAggregatesInput[]
    NOT?: CompiledTemplateScalarWhereWithAggregatesInput | CompiledTemplateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CompiledTemplate"> | string
    templateId?: StringWithAggregatesFilter<"CompiledTemplate"> | string
    version?: StringWithAggregatesFilter<"CompiledTemplate"> | string
    language?: StringWithAggregatesFilter<"CompiledTemplate"> | string
    channel?: StringWithAggregatesFilter<"CompiledTemplate"> | string
    compiledContent?: JsonWithAggregatesFilter<"CompiledTemplate">
    requiredVariables?: StringNullableListFilter<"CompiledTemplate">
    compiledAt?: DateTimeWithAggregatesFilter<"CompiledTemplate"> | Date | string
    expiresAt?: DateTimeNullableWithAggregatesFilter<"CompiledTemplate"> | Date | string | null
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: StringFilter<"Notification"> | string
    userId?: StringNullableFilter<"Notification"> | string | null
    email?: StringNullableFilter<"Notification"> | string | null
    phone?: StringNullableFilter<"Notification"> | string | null
    templateId?: StringNullableFilter<"Notification"> | string | null
    channels?: StringNullableListFilter<"Notification">
    priority?: StringFilter<"Notification"> | string
    category?: StringFilter<"Notification"> | string
    subject?: StringNullableFilter<"Notification"> | string | null
    content?: JsonFilter<"Notification">
    variables?: JsonNullableFilter<"Notification">
    renderedContent?: JsonNullableFilter<"Notification">
    status?: StringFilter<"Notification"> | string
    scheduledAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    sentAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    deliveredAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    trackingEnabled?: BoolFilter<"Notification"> | boolean
    trackingData?: JsonNullableFilter<"Notification">
    fromService?: StringFilter<"Notification"> | string
    fromUserId?: StringNullableFilter<"Notification"> | string | null
    metadata?: JsonNullableFilter<"Notification">
    tags?: StringNullableListFilter<"Notification">
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    updatedAt?: DateTimeFilter<"Notification"> | Date | string
    deliveryTracking?: NotificationDeliveryTrackingListRelationFilter
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    templateId?: SortOrderInput | SortOrder
    channels?: SortOrder
    priority?: SortOrder
    category?: SortOrder
    subject?: SortOrderInput | SortOrder
    content?: SortOrder
    variables?: SortOrderInput | SortOrder
    renderedContent?: SortOrderInput | SortOrder
    status?: SortOrder
    scheduledAt?: SortOrderInput | SortOrder
    sentAt?: SortOrderInput | SortOrder
    deliveredAt?: SortOrderInput | SortOrder
    trackingEnabled?: SortOrder
    trackingData?: SortOrderInput | SortOrder
    fromService?: SortOrder
    fromUserId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    tags?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deliveryTracking?: NotificationDeliveryTrackingOrderByRelationAggregateInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    userId?: StringNullableFilter<"Notification"> | string | null
    email?: StringNullableFilter<"Notification"> | string | null
    phone?: StringNullableFilter<"Notification"> | string | null
    templateId?: StringNullableFilter<"Notification"> | string | null
    channels?: StringNullableListFilter<"Notification">
    priority?: StringFilter<"Notification"> | string
    category?: StringFilter<"Notification"> | string
    subject?: StringNullableFilter<"Notification"> | string | null
    content?: JsonFilter<"Notification">
    variables?: JsonNullableFilter<"Notification">
    renderedContent?: JsonNullableFilter<"Notification">
    status?: StringFilter<"Notification"> | string
    scheduledAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    sentAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    deliveredAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    trackingEnabled?: BoolFilter<"Notification"> | boolean
    trackingData?: JsonNullableFilter<"Notification">
    fromService?: StringFilter<"Notification"> | string
    fromUserId?: StringNullableFilter<"Notification"> | string | null
    metadata?: JsonNullableFilter<"Notification">
    tags?: StringNullableListFilter<"Notification">
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    updatedAt?: DateTimeFilter<"Notification"> | Date | string
    deliveryTracking?: NotificationDeliveryTrackingListRelationFilter
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    templateId?: SortOrderInput | SortOrder
    channels?: SortOrder
    priority?: SortOrder
    category?: SortOrder
    subject?: SortOrderInput | SortOrder
    content?: SortOrder
    variables?: SortOrderInput | SortOrder
    renderedContent?: SortOrderInput | SortOrder
    status?: SortOrder
    scheduledAt?: SortOrderInput | SortOrder
    sentAt?: SortOrderInput | SortOrder
    deliveredAt?: SortOrderInput | SortOrder
    trackingEnabled?: SortOrder
    trackingData?: SortOrderInput | SortOrder
    fromService?: SortOrder
    fromUserId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    tags?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Notification"> | string
    userId?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    email?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    templateId?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    channels?: StringNullableListFilter<"Notification">
    priority?: StringWithAggregatesFilter<"Notification"> | string
    category?: StringWithAggregatesFilter<"Notification"> | string
    subject?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    content?: JsonWithAggregatesFilter<"Notification">
    variables?: JsonNullableWithAggregatesFilter<"Notification">
    renderedContent?: JsonNullableWithAggregatesFilter<"Notification">
    status?: StringWithAggregatesFilter<"Notification"> | string
    scheduledAt?: DateTimeNullableWithAggregatesFilter<"Notification"> | Date | string | null
    sentAt?: DateTimeNullableWithAggregatesFilter<"Notification"> | Date | string | null
    deliveredAt?: DateTimeNullableWithAggregatesFilter<"Notification"> | Date | string | null
    trackingEnabled?: BoolWithAggregatesFilter<"Notification"> | boolean
    trackingData?: JsonNullableWithAggregatesFilter<"Notification">
    fromService?: StringWithAggregatesFilter<"Notification"> | string
    fromUserId?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"Notification">
    tags?: StringNullableListFilter<"Notification">
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type NotificationDeliveryTrackingWhereInput = {
    AND?: NotificationDeliveryTrackingWhereInput | NotificationDeliveryTrackingWhereInput[]
    OR?: NotificationDeliveryTrackingWhereInput[]
    NOT?: NotificationDeliveryTrackingWhereInput | NotificationDeliveryTrackingWhereInput[]
    id?: StringFilter<"NotificationDeliveryTracking"> | string
    notificationId?: StringFilter<"NotificationDeliveryTracking"> | string
    channel?: StringFilter<"NotificationDeliveryTracking"> | string
    provider?: StringFilter<"NotificationDeliveryTracking"> | string
    status?: StringFilter<"NotificationDeliveryTracking"> | string
    providerMessageId?: StringNullableFilter<"NotificationDeliveryTracking"> | string | null
    sentAt?: DateTimeNullableFilter<"NotificationDeliveryTracking"> | Date | string | null
    deliveredAt?: DateTimeNullableFilter<"NotificationDeliveryTracking"> | Date | string | null
    openedAt?: DateTimeNullableFilter<"NotificationDeliveryTracking"> | Date | string | null
    clickedAt?: DateTimeNullableFilter<"NotificationDeliveryTracking"> | Date | string | null
    bouncedAt?: DateTimeNullableFilter<"NotificationDeliveryTracking"> | Date | string | null
    complainedAt?: DateTimeNullableFilter<"NotificationDeliveryTracking"> | Date | string | null
    errorCode?: StringNullableFilter<"NotificationDeliveryTracking"> | string | null
    errorMessage?: StringNullableFilter<"NotificationDeliveryTracking"> | string | null
    retryCount?: IntFilter<"NotificationDeliveryTracking"> | number
    providerResponse?: JsonNullableFilter<"NotificationDeliveryTracking">
    createdAt?: DateTimeFilter<"NotificationDeliveryTracking"> | Date | string
    updatedAt?: DateTimeFilter<"NotificationDeliveryTracking"> | Date | string
    notification?: XOR<NotificationRelationFilter, NotificationWhereInput>
  }

  export type NotificationDeliveryTrackingOrderByWithRelationInput = {
    id?: SortOrder
    notificationId?: SortOrder
    channel?: SortOrder
    provider?: SortOrder
    status?: SortOrder
    providerMessageId?: SortOrderInput | SortOrder
    sentAt?: SortOrderInput | SortOrder
    deliveredAt?: SortOrderInput | SortOrder
    openedAt?: SortOrderInput | SortOrder
    clickedAt?: SortOrderInput | SortOrder
    bouncedAt?: SortOrderInput | SortOrder
    complainedAt?: SortOrderInput | SortOrder
    errorCode?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    retryCount?: SortOrder
    providerResponse?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    notification?: NotificationOrderByWithRelationInput
  }

  export type NotificationDeliveryTrackingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationDeliveryTrackingWhereInput | NotificationDeliveryTrackingWhereInput[]
    OR?: NotificationDeliveryTrackingWhereInput[]
    NOT?: NotificationDeliveryTrackingWhereInput | NotificationDeliveryTrackingWhereInput[]
    notificationId?: StringFilter<"NotificationDeliveryTracking"> | string
    channel?: StringFilter<"NotificationDeliveryTracking"> | string
    provider?: StringFilter<"NotificationDeliveryTracking"> | string
    status?: StringFilter<"NotificationDeliveryTracking"> | string
    providerMessageId?: StringNullableFilter<"NotificationDeliveryTracking"> | string | null
    sentAt?: DateTimeNullableFilter<"NotificationDeliveryTracking"> | Date | string | null
    deliveredAt?: DateTimeNullableFilter<"NotificationDeliveryTracking"> | Date | string | null
    openedAt?: DateTimeNullableFilter<"NotificationDeliveryTracking"> | Date | string | null
    clickedAt?: DateTimeNullableFilter<"NotificationDeliveryTracking"> | Date | string | null
    bouncedAt?: DateTimeNullableFilter<"NotificationDeliveryTracking"> | Date | string | null
    complainedAt?: DateTimeNullableFilter<"NotificationDeliveryTracking"> | Date | string | null
    errorCode?: StringNullableFilter<"NotificationDeliveryTracking"> | string | null
    errorMessage?: StringNullableFilter<"NotificationDeliveryTracking"> | string | null
    retryCount?: IntFilter<"NotificationDeliveryTracking"> | number
    providerResponse?: JsonNullableFilter<"NotificationDeliveryTracking">
    createdAt?: DateTimeFilter<"NotificationDeliveryTracking"> | Date | string
    updatedAt?: DateTimeFilter<"NotificationDeliveryTracking"> | Date | string
    notification?: XOR<NotificationRelationFilter, NotificationWhereInput>
  }, "id">

  export type NotificationDeliveryTrackingOrderByWithAggregationInput = {
    id?: SortOrder
    notificationId?: SortOrder
    channel?: SortOrder
    provider?: SortOrder
    status?: SortOrder
    providerMessageId?: SortOrderInput | SortOrder
    sentAt?: SortOrderInput | SortOrder
    deliveredAt?: SortOrderInput | SortOrder
    openedAt?: SortOrderInput | SortOrder
    clickedAt?: SortOrderInput | SortOrder
    bouncedAt?: SortOrderInput | SortOrder
    complainedAt?: SortOrderInput | SortOrder
    errorCode?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    retryCount?: SortOrder
    providerResponse?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: NotificationDeliveryTrackingCountOrderByAggregateInput
    _avg?: NotificationDeliveryTrackingAvgOrderByAggregateInput
    _max?: NotificationDeliveryTrackingMaxOrderByAggregateInput
    _min?: NotificationDeliveryTrackingMinOrderByAggregateInput
    _sum?: NotificationDeliveryTrackingSumOrderByAggregateInput
  }

  export type NotificationDeliveryTrackingScalarWhereWithAggregatesInput = {
    AND?: NotificationDeliveryTrackingScalarWhereWithAggregatesInput | NotificationDeliveryTrackingScalarWhereWithAggregatesInput[]
    OR?: NotificationDeliveryTrackingScalarWhereWithAggregatesInput[]
    NOT?: NotificationDeliveryTrackingScalarWhereWithAggregatesInput | NotificationDeliveryTrackingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"NotificationDeliveryTracking"> | string
    notificationId?: StringWithAggregatesFilter<"NotificationDeliveryTracking"> | string
    channel?: StringWithAggregatesFilter<"NotificationDeliveryTracking"> | string
    provider?: StringWithAggregatesFilter<"NotificationDeliveryTracking"> | string
    status?: StringWithAggregatesFilter<"NotificationDeliveryTracking"> | string
    providerMessageId?: StringNullableWithAggregatesFilter<"NotificationDeliveryTracking"> | string | null
    sentAt?: DateTimeNullableWithAggregatesFilter<"NotificationDeliveryTracking"> | Date | string | null
    deliveredAt?: DateTimeNullableWithAggregatesFilter<"NotificationDeliveryTracking"> | Date | string | null
    openedAt?: DateTimeNullableWithAggregatesFilter<"NotificationDeliveryTracking"> | Date | string | null
    clickedAt?: DateTimeNullableWithAggregatesFilter<"NotificationDeliveryTracking"> | Date | string | null
    bouncedAt?: DateTimeNullableWithAggregatesFilter<"NotificationDeliveryTracking"> | Date | string | null
    complainedAt?: DateTimeNullableWithAggregatesFilter<"NotificationDeliveryTracking"> | Date | string | null
    errorCode?: StringNullableWithAggregatesFilter<"NotificationDeliveryTracking"> | string | null
    errorMessage?: StringNullableWithAggregatesFilter<"NotificationDeliveryTracking"> | string | null
    retryCount?: IntWithAggregatesFilter<"NotificationDeliveryTracking"> | number
    providerResponse?: JsonNullableWithAggregatesFilter<"NotificationDeliveryTracking">
    createdAt?: DateTimeWithAggregatesFilter<"NotificationDeliveryTracking"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"NotificationDeliveryTracking"> | Date | string
  }

  export type UserNotificationPreferencesWhereInput = {
    AND?: UserNotificationPreferencesWhereInput | UserNotificationPreferencesWhereInput[]
    OR?: UserNotificationPreferencesWhereInput[]
    NOT?: UserNotificationPreferencesWhereInput | UserNotificationPreferencesWhereInput[]
    id?: StringFilter<"UserNotificationPreferences"> | string
    userId?: StringFilter<"UserNotificationPreferences"> | string
    emailEnabled?: BoolFilter<"UserNotificationPreferences"> | boolean
    smsEnabled?: BoolFilter<"UserNotificationPreferences"> | boolean
    pushEnabled?: BoolFilter<"UserNotificationPreferences"> | boolean
    inAppEnabled?: BoolFilter<"UserNotificationPreferences"> | boolean
    categoryPreferences?: JsonFilter<"UserNotificationPreferences">
    globalOptOut?: BoolFilter<"UserNotificationPreferences"> | boolean
    quietHours?: JsonNullableFilter<"UserNotificationPreferences">
    maxDailyNotifications?: IntNullableFilter<"UserNotificationPreferences"> | number | null
    maxWeeklyNotifications?: IntNullableFilter<"UserNotificationPreferences"> | number | null
    consentDate?: DateTimeNullableFilter<"UserNotificationPreferences"> | Date | string | null
    optOutDate?: DateTimeNullableFilter<"UserNotificationPreferences"> | Date | string | null
    createdAt?: DateTimeFilter<"UserNotificationPreferences"> | Date | string
    updatedAt?: DateTimeFilter<"UserNotificationPreferences"> | Date | string
  }

  export type UserNotificationPreferencesOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    emailEnabled?: SortOrder
    smsEnabled?: SortOrder
    pushEnabled?: SortOrder
    inAppEnabled?: SortOrder
    categoryPreferences?: SortOrder
    globalOptOut?: SortOrder
    quietHours?: SortOrderInput | SortOrder
    maxDailyNotifications?: SortOrderInput | SortOrder
    maxWeeklyNotifications?: SortOrderInput | SortOrder
    consentDate?: SortOrderInput | SortOrder
    optOutDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserNotificationPreferencesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: UserNotificationPreferencesWhereInput | UserNotificationPreferencesWhereInput[]
    OR?: UserNotificationPreferencesWhereInput[]
    NOT?: UserNotificationPreferencesWhereInput | UserNotificationPreferencesWhereInput[]
    emailEnabled?: BoolFilter<"UserNotificationPreferences"> | boolean
    smsEnabled?: BoolFilter<"UserNotificationPreferences"> | boolean
    pushEnabled?: BoolFilter<"UserNotificationPreferences"> | boolean
    inAppEnabled?: BoolFilter<"UserNotificationPreferences"> | boolean
    categoryPreferences?: JsonFilter<"UserNotificationPreferences">
    globalOptOut?: BoolFilter<"UserNotificationPreferences"> | boolean
    quietHours?: JsonNullableFilter<"UserNotificationPreferences">
    maxDailyNotifications?: IntNullableFilter<"UserNotificationPreferences"> | number | null
    maxWeeklyNotifications?: IntNullableFilter<"UserNotificationPreferences"> | number | null
    consentDate?: DateTimeNullableFilter<"UserNotificationPreferences"> | Date | string | null
    optOutDate?: DateTimeNullableFilter<"UserNotificationPreferences"> | Date | string | null
    createdAt?: DateTimeFilter<"UserNotificationPreferences"> | Date | string
    updatedAt?: DateTimeFilter<"UserNotificationPreferences"> | Date | string
  }, "id" | "userId">

  export type UserNotificationPreferencesOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    emailEnabled?: SortOrder
    smsEnabled?: SortOrder
    pushEnabled?: SortOrder
    inAppEnabled?: SortOrder
    categoryPreferences?: SortOrder
    globalOptOut?: SortOrder
    quietHours?: SortOrderInput | SortOrder
    maxDailyNotifications?: SortOrderInput | SortOrder
    maxWeeklyNotifications?: SortOrderInput | SortOrder
    consentDate?: SortOrderInput | SortOrder
    optOutDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserNotificationPreferencesCountOrderByAggregateInput
    _avg?: UserNotificationPreferencesAvgOrderByAggregateInput
    _max?: UserNotificationPreferencesMaxOrderByAggregateInput
    _min?: UserNotificationPreferencesMinOrderByAggregateInput
    _sum?: UserNotificationPreferencesSumOrderByAggregateInput
  }

  export type UserNotificationPreferencesScalarWhereWithAggregatesInput = {
    AND?: UserNotificationPreferencesScalarWhereWithAggregatesInput | UserNotificationPreferencesScalarWhereWithAggregatesInput[]
    OR?: UserNotificationPreferencesScalarWhereWithAggregatesInput[]
    NOT?: UserNotificationPreferencesScalarWhereWithAggregatesInput | UserNotificationPreferencesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserNotificationPreferences"> | string
    userId?: StringWithAggregatesFilter<"UserNotificationPreferences"> | string
    emailEnabled?: BoolWithAggregatesFilter<"UserNotificationPreferences"> | boolean
    smsEnabled?: BoolWithAggregatesFilter<"UserNotificationPreferences"> | boolean
    pushEnabled?: BoolWithAggregatesFilter<"UserNotificationPreferences"> | boolean
    inAppEnabled?: BoolWithAggregatesFilter<"UserNotificationPreferences"> | boolean
    categoryPreferences?: JsonWithAggregatesFilter<"UserNotificationPreferences">
    globalOptOut?: BoolWithAggregatesFilter<"UserNotificationPreferences"> | boolean
    quietHours?: JsonNullableWithAggregatesFilter<"UserNotificationPreferences">
    maxDailyNotifications?: IntNullableWithAggregatesFilter<"UserNotificationPreferences"> | number | null
    maxWeeklyNotifications?: IntNullableWithAggregatesFilter<"UserNotificationPreferences"> | number | null
    consentDate?: DateTimeNullableWithAggregatesFilter<"UserNotificationPreferences"> | Date | string | null
    optOutDate?: DateTimeNullableWithAggregatesFilter<"UserNotificationPreferences"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"UserNotificationPreferences"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserNotificationPreferences"> | Date | string
  }

  export type NotificationSuppressionListWhereInput = {
    AND?: NotificationSuppressionListWhereInput | NotificationSuppressionListWhereInput[]
    OR?: NotificationSuppressionListWhereInput[]
    NOT?: NotificationSuppressionListWhereInput | NotificationSuppressionListWhereInput[]
    id?: StringFilter<"NotificationSuppressionList"> | string
    identifier?: StringFilter<"NotificationSuppressionList"> | string
    channel?: StringFilter<"NotificationSuppressionList"> | string
    reason?: StringFilter<"NotificationSuppressionList"> | string
    addedBy?: StringNullableFilter<"NotificationSuppressionList"> | string | null
    addedAt?: DateTimeFilter<"NotificationSuppressionList"> | Date | string
    expiresAt?: DateTimeNullableFilter<"NotificationSuppressionList"> | Date | string | null
    isActive?: BoolFilter<"NotificationSuppressionList"> | boolean
  }

  export type NotificationSuppressionListOrderByWithRelationInput = {
    id?: SortOrder
    identifier?: SortOrder
    channel?: SortOrder
    reason?: SortOrder
    addedBy?: SortOrderInput | SortOrder
    addedAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    isActive?: SortOrder
  }

  export type NotificationSuppressionListWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    identifier_channel?: NotificationSuppressionListIdentifierChannelCompoundUniqueInput
    AND?: NotificationSuppressionListWhereInput | NotificationSuppressionListWhereInput[]
    OR?: NotificationSuppressionListWhereInput[]
    NOT?: NotificationSuppressionListWhereInput | NotificationSuppressionListWhereInput[]
    identifier?: StringFilter<"NotificationSuppressionList"> | string
    channel?: StringFilter<"NotificationSuppressionList"> | string
    reason?: StringFilter<"NotificationSuppressionList"> | string
    addedBy?: StringNullableFilter<"NotificationSuppressionList"> | string | null
    addedAt?: DateTimeFilter<"NotificationSuppressionList"> | Date | string
    expiresAt?: DateTimeNullableFilter<"NotificationSuppressionList"> | Date | string | null
    isActive?: BoolFilter<"NotificationSuppressionList"> | boolean
  }, "id" | "identifier_channel">

  export type NotificationSuppressionListOrderByWithAggregationInput = {
    id?: SortOrder
    identifier?: SortOrder
    channel?: SortOrder
    reason?: SortOrder
    addedBy?: SortOrderInput | SortOrder
    addedAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    isActive?: SortOrder
    _count?: NotificationSuppressionListCountOrderByAggregateInput
    _max?: NotificationSuppressionListMaxOrderByAggregateInput
    _min?: NotificationSuppressionListMinOrderByAggregateInput
  }

  export type NotificationSuppressionListScalarWhereWithAggregatesInput = {
    AND?: NotificationSuppressionListScalarWhereWithAggregatesInput | NotificationSuppressionListScalarWhereWithAggregatesInput[]
    OR?: NotificationSuppressionListScalarWhereWithAggregatesInput[]
    NOT?: NotificationSuppressionListScalarWhereWithAggregatesInput | NotificationSuppressionListScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"NotificationSuppressionList"> | string
    identifier?: StringWithAggregatesFilter<"NotificationSuppressionList"> | string
    channel?: StringWithAggregatesFilter<"NotificationSuppressionList"> | string
    reason?: StringWithAggregatesFilter<"NotificationSuppressionList"> | string
    addedBy?: StringNullableWithAggregatesFilter<"NotificationSuppressionList"> | string | null
    addedAt?: DateTimeWithAggregatesFilter<"NotificationSuppressionList"> | Date | string
    expiresAt?: DateTimeNullableWithAggregatesFilter<"NotificationSuppressionList"> | Date | string | null
    isActive?: BoolWithAggregatesFilter<"NotificationSuppressionList"> | boolean
  }

  export type TemplateCreateInput = {
    id?: string
    name: string
    description?: string | null
    category: string
    channels?: TemplateCreatechannelsInput | string[]
    activeVersion?: string | null
    languages?: TemplateCreatelanguagesInput | string[]
    defaultLanguage?: string
    requiredVariables?: TemplateCreaterequiredVariablesInput | string[]
    optionalVariables?: TemplateCreateoptionalVariablesInput | string[]
    variableSchema?: NullableJsonNullValueInput | InputJsonValue
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    versions?: TemplateVersionCreateNestedManyWithoutTemplateInput
  }

  export type TemplateUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    category: string
    channels?: TemplateCreatechannelsInput | string[]
    activeVersion?: string | null
    languages?: TemplateCreatelanguagesInput | string[]
    defaultLanguage?: string
    requiredVariables?: TemplateCreaterequiredVariablesInput | string[]
    optionalVariables?: TemplateCreateoptionalVariablesInput | string[]
    variableSchema?: NullableJsonNullValueInput | InputJsonValue
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
    versions?: TemplateVersionUncheckedCreateNestedManyWithoutTemplateInput
  }

  export type TemplateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    channels?: TemplateUpdatechannelsInput | string[]
    activeVersion?: NullableStringFieldUpdateOperationsInput | string | null
    languages?: TemplateUpdatelanguagesInput | string[]
    defaultLanguage?: StringFieldUpdateOperationsInput | string
    requiredVariables?: TemplateUpdaterequiredVariablesInput | string[]
    optionalVariables?: TemplateUpdateoptionalVariablesInput | string[]
    variableSchema?: NullableJsonNullValueInput | InputJsonValue
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    versions?: TemplateVersionUpdateManyWithoutTemplateNestedInput
  }

  export type TemplateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    channels?: TemplateUpdatechannelsInput | string[]
    activeVersion?: NullableStringFieldUpdateOperationsInput | string | null
    languages?: TemplateUpdatelanguagesInput | string[]
    defaultLanguage?: StringFieldUpdateOperationsInput | string
    requiredVariables?: TemplateUpdaterequiredVariablesInput | string[]
    optionalVariables?: TemplateUpdateoptionalVariablesInput | string[]
    variableSchema?: NullableJsonNullValueInput | InputJsonValue
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    versions?: TemplateVersionUncheckedUpdateManyWithoutTemplateNestedInput
  }

  export type TemplateCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    category: string
    channels?: TemplateCreatechannelsInput | string[]
    activeVersion?: string | null
    languages?: TemplateCreatelanguagesInput | string[]
    defaultLanguage?: string
    requiredVariables?: TemplateCreaterequiredVariablesInput | string[]
    optionalVariables?: TemplateCreateoptionalVariablesInput | string[]
    variableSchema?: NullableJsonNullValueInput | InputJsonValue
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
  }

  export type TemplateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    channels?: TemplateUpdatechannelsInput | string[]
    activeVersion?: NullableStringFieldUpdateOperationsInput | string | null
    languages?: TemplateUpdatelanguagesInput | string[]
    defaultLanguage?: StringFieldUpdateOperationsInput | string
    requiredVariables?: TemplateUpdaterequiredVariablesInput | string[]
    optionalVariables?: TemplateUpdateoptionalVariablesInput | string[]
    variableSchema?: NullableJsonNullValueInput | InputJsonValue
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TemplateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    channels?: TemplateUpdatechannelsInput | string[]
    activeVersion?: NullableStringFieldUpdateOperationsInput | string | null
    languages?: TemplateUpdatelanguagesInput | string[]
    defaultLanguage?: StringFieldUpdateOperationsInput | string
    requiredVariables?: TemplateUpdaterequiredVariablesInput | string[]
    optionalVariables?: TemplateUpdateoptionalVariablesInput | string[]
    variableSchema?: NullableJsonNullValueInput | InputJsonValue
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TemplateVersionCreateInput = {
    id?: string
    version: string
    content: JsonNullValueInput | InputJsonValue
    changelog?: string | null
    createdAt?: Date | string
    isActive?: boolean
    template: TemplateCreateNestedOneWithoutVersionsInput
  }

  export type TemplateVersionUncheckedCreateInput = {
    id?: string
    templateId: string
    version: string
    content: JsonNullValueInput | InputJsonValue
    changelog?: string | null
    createdAt?: Date | string
    isActive?: boolean
  }

  export type TemplateVersionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    changelog?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    template?: TemplateUpdateOneRequiredWithoutVersionsNestedInput
  }

  export type TemplateVersionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    changelog?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TemplateVersionCreateManyInput = {
    id?: string
    templateId: string
    version: string
    content: JsonNullValueInput | InputJsonValue
    changelog?: string | null
    createdAt?: Date | string
    isActive?: boolean
  }

  export type TemplateVersionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    changelog?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TemplateVersionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    changelog?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CompiledTemplateCreateInput = {
    id?: string
    templateId: string
    version: string
    language: string
    channel: string
    compiledContent: JsonNullValueInput | InputJsonValue
    requiredVariables?: CompiledTemplateCreaterequiredVariablesInput | string[]
    compiledAt?: Date | string
    expiresAt?: Date | string | null
  }

  export type CompiledTemplateUncheckedCreateInput = {
    id?: string
    templateId: string
    version: string
    language: string
    channel: string
    compiledContent: JsonNullValueInput | InputJsonValue
    requiredVariables?: CompiledTemplateCreaterequiredVariablesInput | string[]
    compiledAt?: Date | string
    expiresAt?: Date | string | null
  }

  export type CompiledTemplateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    compiledContent?: JsonNullValueInput | InputJsonValue
    requiredVariables?: CompiledTemplateUpdaterequiredVariablesInput | string[]
    compiledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CompiledTemplateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    compiledContent?: JsonNullValueInput | InputJsonValue
    requiredVariables?: CompiledTemplateUpdaterequiredVariablesInput | string[]
    compiledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CompiledTemplateCreateManyInput = {
    id?: string
    templateId: string
    version: string
    language: string
    channel: string
    compiledContent: JsonNullValueInput | InputJsonValue
    requiredVariables?: CompiledTemplateCreaterequiredVariablesInput | string[]
    compiledAt?: Date | string
    expiresAt?: Date | string | null
  }

  export type CompiledTemplateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    compiledContent?: JsonNullValueInput | InputJsonValue
    requiredVariables?: CompiledTemplateUpdaterequiredVariablesInput | string[]
    compiledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CompiledTemplateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    templateId?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    compiledContent?: JsonNullValueInput | InputJsonValue
    requiredVariables?: CompiledTemplateUpdaterequiredVariablesInput | string[]
    compiledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type NotificationCreateInput = {
    id?: string
    userId?: string | null
    email?: string | null
    phone?: string | null
    templateId?: string | null
    channels?: NotificationCreatechannelsInput | string[]
    priority: string
    category: string
    subject?: string | null
    content: JsonNullValueInput | InputJsonValue
    variables?: NullableJsonNullValueInput | InputJsonValue
    renderedContent?: NullableJsonNullValueInput | InputJsonValue
    status: string
    scheduledAt?: Date | string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    trackingEnabled?: boolean
    trackingData?: NullableJsonNullValueInput | InputJsonValue
    fromService: string
    fromUserId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: NotificationCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    deliveryTracking?: NotificationDeliveryTrackingCreateNestedManyWithoutNotificationInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    userId?: string | null
    email?: string | null
    phone?: string | null
    templateId?: string | null
    channels?: NotificationCreatechannelsInput | string[]
    priority: string
    category: string
    subject?: string | null
    content: JsonNullValueInput | InputJsonValue
    variables?: NullableJsonNullValueInput | InputJsonValue
    renderedContent?: NullableJsonNullValueInput | InputJsonValue
    status: string
    scheduledAt?: Date | string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    trackingEnabled?: boolean
    trackingData?: NullableJsonNullValueInput | InputJsonValue
    fromService: string
    fromUserId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: NotificationCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    deliveryTracking?: NotificationDeliveryTrackingUncheckedCreateNestedManyWithoutNotificationInput
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    channels?: NotificationUpdatechannelsInput | string[]
    priority?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    content?: JsonNullValueInput | InputJsonValue
    variables?: NullableJsonNullValueInput | InputJsonValue
    renderedContent?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trackingEnabled?: BoolFieldUpdateOperationsInput | boolean
    trackingData?: NullableJsonNullValueInput | InputJsonValue
    fromService?: StringFieldUpdateOperationsInput | string
    fromUserId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: NotificationUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveryTracking?: NotificationDeliveryTrackingUpdateManyWithoutNotificationNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    channels?: NotificationUpdatechannelsInput | string[]
    priority?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    content?: JsonNullValueInput | InputJsonValue
    variables?: NullableJsonNullValueInput | InputJsonValue
    renderedContent?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trackingEnabled?: BoolFieldUpdateOperationsInput | boolean
    trackingData?: NullableJsonNullValueInput | InputJsonValue
    fromService?: StringFieldUpdateOperationsInput | string
    fromUserId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: NotificationUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveryTracking?: NotificationDeliveryTrackingUncheckedUpdateManyWithoutNotificationNestedInput
  }

  export type NotificationCreateManyInput = {
    id?: string
    userId?: string | null
    email?: string | null
    phone?: string | null
    templateId?: string | null
    channels?: NotificationCreatechannelsInput | string[]
    priority: string
    category: string
    subject?: string | null
    content: JsonNullValueInput | InputJsonValue
    variables?: NullableJsonNullValueInput | InputJsonValue
    renderedContent?: NullableJsonNullValueInput | InputJsonValue
    status: string
    scheduledAt?: Date | string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    trackingEnabled?: boolean
    trackingData?: NullableJsonNullValueInput | InputJsonValue
    fromService: string
    fromUserId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: NotificationCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    channels?: NotificationUpdatechannelsInput | string[]
    priority?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    content?: JsonNullValueInput | InputJsonValue
    variables?: NullableJsonNullValueInput | InputJsonValue
    renderedContent?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trackingEnabled?: BoolFieldUpdateOperationsInput | boolean
    trackingData?: NullableJsonNullValueInput | InputJsonValue
    fromService?: StringFieldUpdateOperationsInput | string
    fromUserId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: NotificationUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    channels?: NotificationUpdatechannelsInput | string[]
    priority?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    content?: JsonNullValueInput | InputJsonValue
    variables?: NullableJsonNullValueInput | InputJsonValue
    renderedContent?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trackingEnabled?: BoolFieldUpdateOperationsInput | boolean
    trackingData?: NullableJsonNullValueInput | InputJsonValue
    fromService?: StringFieldUpdateOperationsInput | string
    fromUserId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: NotificationUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationDeliveryTrackingCreateInput = {
    id?: string
    channel: string
    provider: string
    status: string
    providerMessageId?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    openedAt?: Date | string | null
    clickedAt?: Date | string | null
    bouncedAt?: Date | string | null
    complainedAt?: Date | string | null
    errorCode?: string | null
    errorMessage?: string | null
    retryCount?: number
    providerResponse?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    notification: NotificationCreateNestedOneWithoutDeliveryTrackingInput
  }

  export type NotificationDeliveryTrackingUncheckedCreateInput = {
    id?: string
    notificationId: string
    channel: string
    provider: string
    status: string
    providerMessageId?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    openedAt?: Date | string | null
    clickedAt?: Date | string | null
    bouncedAt?: Date | string | null
    complainedAt?: Date | string | null
    errorCode?: string | null
    errorMessage?: string | null
    retryCount?: number
    providerResponse?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationDeliveryTrackingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    providerMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    clickedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    complainedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    providerResponse?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notification?: NotificationUpdateOneRequiredWithoutDeliveryTrackingNestedInput
  }

  export type NotificationDeliveryTrackingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    notificationId?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    providerMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    clickedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    complainedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    providerResponse?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationDeliveryTrackingCreateManyInput = {
    id?: string
    notificationId: string
    channel: string
    provider: string
    status: string
    providerMessageId?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    openedAt?: Date | string | null
    clickedAt?: Date | string | null
    bouncedAt?: Date | string | null
    complainedAt?: Date | string | null
    errorCode?: string | null
    errorMessage?: string | null
    retryCount?: number
    providerResponse?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationDeliveryTrackingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    providerMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    clickedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    complainedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    providerResponse?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationDeliveryTrackingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    notificationId?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    providerMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    clickedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    complainedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    providerResponse?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserNotificationPreferencesCreateInput = {
    id?: string
    userId: string
    emailEnabled?: boolean
    smsEnabled?: boolean
    pushEnabled?: boolean
    inAppEnabled?: boolean
    categoryPreferences?: JsonNullValueInput | InputJsonValue
    globalOptOut?: boolean
    quietHours?: NullableJsonNullValueInput | InputJsonValue
    maxDailyNotifications?: number | null
    maxWeeklyNotifications?: number | null
    consentDate?: Date | string | null
    optOutDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserNotificationPreferencesUncheckedCreateInput = {
    id?: string
    userId: string
    emailEnabled?: boolean
    smsEnabled?: boolean
    pushEnabled?: boolean
    inAppEnabled?: boolean
    categoryPreferences?: JsonNullValueInput | InputJsonValue
    globalOptOut?: boolean
    quietHours?: NullableJsonNullValueInput | InputJsonValue
    maxDailyNotifications?: number | null
    maxWeeklyNotifications?: number | null
    consentDate?: Date | string | null
    optOutDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserNotificationPreferencesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    emailEnabled?: BoolFieldUpdateOperationsInput | boolean
    smsEnabled?: BoolFieldUpdateOperationsInput | boolean
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    inAppEnabled?: BoolFieldUpdateOperationsInput | boolean
    categoryPreferences?: JsonNullValueInput | InputJsonValue
    globalOptOut?: BoolFieldUpdateOperationsInput | boolean
    quietHours?: NullableJsonNullValueInput | InputJsonValue
    maxDailyNotifications?: NullableIntFieldUpdateOperationsInput | number | null
    maxWeeklyNotifications?: NullableIntFieldUpdateOperationsInput | number | null
    consentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    optOutDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserNotificationPreferencesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    emailEnabled?: BoolFieldUpdateOperationsInput | boolean
    smsEnabled?: BoolFieldUpdateOperationsInput | boolean
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    inAppEnabled?: BoolFieldUpdateOperationsInput | boolean
    categoryPreferences?: JsonNullValueInput | InputJsonValue
    globalOptOut?: BoolFieldUpdateOperationsInput | boolean
    quietHours?: NullableJsonNullValueInput | InputJsonValue
    maxDailyNotifications?: NullableIntFieldUpdateOperationsInput | number | null
    maxWeeklyNotifications?: NullableIntFieldUpdateOperationsInput | number | null
    consentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    optOutDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserNotificationPreferencesCreateManyInput = {
    id?: string
    userId: string
    emailEnabled?: boolean
    smsEnabled?: boolean
    pushEnabled?: boolean
    inAppEnabled?: boolean
    categoryPreferences?: JsonNullValueInput | InputJsonValue
    globalOptOut?: boolean
    quietHours?: NullableJsonNullValueInput | InputJsonValue
    maxDailyNotifications?: number | null
    maxWeeklyNotifications?: number | null
    consentDate?: Date | string | null
    optOutDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserNotificationPreferencesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    emailEnabled?: BoolFieldUpdateOperationsInput | boolean
    smsEnabled?: BoolFieldUpdateOperationsInput | boolean
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    inAppEnabled?: BoolFieldUpdateOperationsInput | boolean
    categoryPreferences?: JsonNullValueInput | InputJsonValue
    globalOptOut?: BoolFieldUpdateOperationsInput | boolean
    quietHours?: NullableJsonNullValueInput | InputJsonValue
    maxDailyNotifications?: NullableIntFieldUpdateOperationsInput | number | null
    maxWeeklyNotifications?: NullableIntFieldUpdateOperationsInput | number | null
    consentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    optOutDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserNotificationPreferencesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    emailEnabled?: BoolFieldUpdateOperationsInput | boolean
    smsEnabled?: BoolFieldUpdateOperationsInput | boolean
    pushEnabled?: BoolFieldUpdateOperationsInput | boolean
    inAppEnabled?: BoolFieldUpdateOperationsInput | boolean
    categoryPreferences?: JsonNullValueInput | InputJsonValue
    globalOptOut?: BoolFieldUpdateOperationsInput | boolean
    quietHours?: NullableJsonNullValueInput | InputJsonValue
    maxDailyNotifications?: NullableIntFieldUpdateOperationsInput | number | null
    maxWeeklyNotifications?: NullableIntFieldUpdateOperationsInput | number | null
    consentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    optOutDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationSuppressionListCreateInput = {
    id?: string
    identifier: string
    channel: string
    reason: string
    addedBy?: string | null
    addedAt?: Date | string
    expiresAt?: Date | string | null
    isActive?: boolean
  }

  export type NotificationSuppressionListUncheckedCreateInput = {
    id?: string
    identifier: string
    channel: string
    reason: string
    addedBy?: string | null
    addedAt?: Date | string
    expiresAt?: Date | string | null
    isActive?: boolean
  }

  export type NotificationSuppressionListUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    addedBy?: NullableStringFieldUpdateOperationsInput | string | null
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type NotificationSuppressionListUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    addedBy?: NullableStringFieldUpdateOperationsInput | string | null
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type NotificationSuppressionListCreateManyInput = {
    id?: string
    identifier: string
    channel: string
    reason: string
    addedBy?: string | null
    addedAt?: Date | string
    expiresAt?: Date | string | null
    isActive?: boolean
  }

  export type NotificationSuppressionListUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    addedBy?: NullableStringFieldUpdateOperationsInput | string | null
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type NotificationSuppressionListUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    addedBy?: NullableStringFieldUpdateOperationsInput | string | null
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
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

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type TemplateVersionListRelationFilter = {
    every?: TemplateVersionWhereInput
    some?: TemplateVersionWhereInput
    none?: TemplateVersionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TemplateVersionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TemplateCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    channels?: SortOrder
    activeVersion?: SortOrder
    languages?: SortOrder
    defaultLanguage?: SortOrder
    requiredVariables?: SortOrder
    optionalVariables?: SortOrder
    variableSchema?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isActive?: SortOrder
  }

  export type TemplateMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    activeVersion?: SortOrder
    defaultLanguage?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isActive?: SortOrder
  }

  export type TemplateMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    activeVersion?: SortOrder
    defaultLanguage?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    isActive?: SortOrder
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type TemplateRelationFilter = {
    is?: TemplateWhereInput
    isNot?: TemplateWhereInput
  }

  export type TemplateVersionTemplateIdVersionCompoundUniqueInput = {
    templateId: string
    version: string
  }

  export type TemplateVersionCountOrderByAggregateInput = {
    id?: SortOrder
    templateId?: SortOrder
    version?: SortOrder
    content?: SortOrder
    changelog?: SortOrder
    createdAt?: SortOrder
    isActive?: SortOrder
  }

  export type TemplateVersionMaxOrderByAggregateInput = {
    id?: SortOrder
    templateId?: SortOrder
    version?: SortOrder
    changelog?: SortOrder
    createdAt?: SortOrder
    isActive?: SortOrder
  }

  export type TemplateVersionMinOrderByAggregateInput = {
    id?: SortOrder
    templateId?: SortOrder
    version?: SortOrder
    changelog?: SortOrder
    createdAt?: SortOrder
    isActive?: SortOrder
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

  export type CompiledTemplateTemplateIdVersionLanguageChannelCompoundUniqueInput = {
    templateId: string
    version: string
    language: string
    channel: string
  }

  export type CompiledTemplateCountOrderByAggregateInput = {
    id?: SortOrder
    templateId?: SortOrder
    version?: SortOrder
    language?: SortOrder
    channel?: SortOrder
    compiledContent?: SortOrder
    requiredVariables?: SortOrder
    compiledAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type CompiledTemplateMaxOrderByAggregateInput = {
    id?: SortOrder
    templateId?: SortOrder
    version?: SortOrder
    language?: SortOrder
    channel?: SortOrder
    compiledAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type CompiledTemplateMinOrderByAggregateInput = {
    id?: SortOrder
    templateId?: SortOrder
    version?: SortOrder
    language?: SortOrder
    channel?: SortOrder
    compiledAt?: SortOrder
    expiresAt?: SortOrder
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

  export type NotificationDeliveryTrackingListRelationFilter = {
    every?: NotificationDeliveryTrackingWhereInput
    some?: NotificationDeliveryTrackingWhereInput
    none?: NotificationDeliveryTrackingWhereInput
  }

  export type NotificationDeliveryTrackingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    templateId?: SortOrder
    channels?: SortOrder
    priority?: SortOrder
    category?: SortOrder
    subject?: SortOrder
    content?: SortOrder
    variables?: SortOrder
    renderedContent?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    sentAt?: SortOrder
    deliveredAt?: SortOrder
    trackingEnabled?: SortOrder
    trackingData?: SortOrder
    fromService?: SortOrder
    fromUserId?: SortOrder
    metadata?: SortOrder
    tags?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    templateId?: SortOrder
    priority?: SortOrder
    category?: SortOrder
    subject?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    sentAt?: SortOrder
    deliveredAt?: SortOrder
    trackingEnabled?: SortOrder
    fromService?: SortOrder
    fromUserId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    templateId?: SortOrder
    priority?: SortOrder
    category?: SortOrder
    subject?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    sentAt?: SortOrder
    deliveredAt?: SortOrder
    trackingEnabled?: SortOrder
    fromService?: SortOrder
    fromUserId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type NotificationRelationFilter = {
    is?: NotificationWhereInput
    isNot?: NotificationWhereInput
  }

  export type NotificationDeliveryTrackingCountOrderByAggregateInput = {
    id?: SortOrder
    notificationId?: SortOrder
    channel?: SortOrder
    provider?: SortOrder
    status?: SortOrder
    providerMessageId?: SortOrder
    sentAt?: SortOrder
    deliveredAt?: SortOrder
    openedAt?: SortOrder
    clickedAt?: SortOrder
    bouncedAt?: SortOrder
    complainedAt?: SortOrder
    errorCode?: SortOrder
    errorMessage?: SortOrder
    retryCount?: SortOrder
    providerResponse?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NotificationDeliveryTrackingAvgOrderByAggregateInput = {
    retryCount?: SortOrder
  }

  export type NotificationDeliveryTrackingMaxOrderByAggregateInput = {
    id?: SortOrder
    notificationId?: SortOrder
    channel?: SortOrder
    provider?: SortOrder
    status?: SortOrder
    providerMessageId?: SortOrder
    sentAt?: SortOrder
    deliveredAt?: SortOrder
    openedAt?: SortOrder
    clickedAt?: SortOrder
    bouncedAt?: SortOrder
    complainedAt?: SortOrder
    errorCode?: SortOrder
    errorMessage?: SortOrder
    retryCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NotificationDeliveryTrackingMinOrderByAggregateInput = {
    id?: SortOrder
    notificationId?: SortOrder
    channel?: SortOrder
    provider?: SortOrder
    status?: SortOrder
    providerMessageId?: SortOrder
    sentAt?: SortOrder
    deliveredAt?: SortOrder
    openedAt?: SortOrder
    clickedAt?: SortOrder
    bouncedAt?: SortOrder
    complainedAt?: SortOrder
    errorCode?: SortOrder
    errorMessage?: SortOrder
    retryCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NotificationDeliveryTrackingSumOrderByAggregateInput = {
    retryCount?: SortOrder
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

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserNotificationPreferencesCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    emailEnabled?: SortOrder
    smsEnabled?: SortOrder
    pushEnabled?: SortOrder
    inAppEnabled?: SortOrder
    categoryPreferences?: SortOrder
    globalOptOut?: SortOrder
    quietHours?: SortOrder
    maxDailyNotifications?: SortOrder
    maxWeeklyNotifications?: SortOrder
    consentDate?: SortOrder
    optOutDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserNotificationPreferencesAvgOrderByAggregateInput = {
    maxDailyNotifications?: SortOrder
    maxWeeklyNotifications?: SortOrder
  }

  export type UserNotificationPreferencesMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    emailEnabled?: SortOrder
    smsEnabled?: SortOrder
    pushEnabled?: SortOrder
    inAppEnabled?: SortOrder
    globalOptOut?: SortOrder
    maxDailyNotifications?: SortOrder
    maxWeeklyNotifications?: SortOrder
    consentDate?: SortOrder
    optOutDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserNotificationPreferencesMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    emailEnabled?: SortOrder
    smsEnabled?: SortOrder
    pushEnabled?: SortOrder
    inAppEnabled?: SortOrder
    globalOptOut?: SortOrder
    maxDailyNotifications?: SortOrder
    maxWeeklyNotifications?: SortOrder
    consentDate?: SortOrder
    optOutDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserNotificationPreferencesSumOrderByAggregateInput = {
    maxDailyNotifications?: SortOrder
    maxWeeklyNotifications?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NotificationSuppressionListIdentifierChannelCompoundUniqueInput = {
    identifier: string
    channel: string
  }

  export type NotificationSuppressionListCountOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    channel?: SortOrder
    reason?: SortOrder
    addedBy?: SortOrder
    addedAt?: SortOrder
    expiresAt?: SortOrder
    isActive?: SortOrder
  }

  export type NotificationSuppressionListMaxOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    channel?: SortOrder
    reason?: SortOrder
    addedBy?: SortOrder
    addedAt?: SortOrder
    expiresAt?: SortOrder
    isActive?: SortOrder
  }

  export type NotificationSuppressionListMinOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    channel?: SortOrder
    reason?: SortOrder
    addedBy?: SortOrder
    addedAt?: SortOrder
    expiresAt?: SortOrder
    isActive?: SortOrder
  }

  export type TemplateCreatechannelsInput = {
    set: string[]
  }

  export type TemplateCreatelanguagesInput = {
    set: string[]
  }

  export type TemplateCreaterequiredVariablesInput = {
    set: string[]
  }

  export type TemplateCreateoptionalVariablesInput = {
    set: string[]
  }

  export type TemplateVersionCreateNestedManyWithoutTemplateInput = {
    create?: XOR<TemplateVersionCreateWithoutTemplateInput, TemplateVersionUncheckedCreateWithoutTemplateInput> | TemplateVersionCreateWithoutTemplateInput[] | TemplateVersionUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: TemplateVersionCreateOrConnectWithoutTemplateInput | TemplateVersionCreateOrConnectWithoutTemplateInput[]
    createMany?: TemplateVersionCreateManyTemplateInputEnvelope
    connect?: TemplateVersionWhereUniqueInput | TemplateVersionWhereUniqueInput[]
  }

  export type TemplateVersionUncheckedCreateNestedManyWithoutTemplateInput = {
    create?: XOR<TemplateVersionCreateWithoutTemplateInput, TemplateVersionUncheckedCreateWithoutTemplateInput> | TemplateVersionCreateWithoutTemplateInput[] | TemplateVersionUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: TemplateVersionCreateOrConnectWithoutTemplateInput | TemplateVersionCreateOrConnectWithoutTemplateInput[]
    createMany?: TemplateVersionCreateManyTemplateInputEnvelope
    connect?: TemplateVersionWhereUniqueInput | TemplateVersionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type TemplateUpdatechannelsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type TemplateUpdatelanguagesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type TemplateUpdaterequiredVariablesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type TemplateUpdateoptionalVariablesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type TemplateVersionUpdateManyWithoutTemplateNestedInput = {
    create?: XOR<TemplateVersionCreateWithoutTemplateInput, TemplateVersionUncheckedCreateWithoutTemplateInput> | TemplateVersionCreateWithoutTemplateInput[] | TemplateVersionUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: TemplateVersionCreateOrConnectWithoutTemplateInput | TemplateVersionCreateOrConnectWithoutTemplateInput[]
    upsert?: TemplateVersionUpsertWithWhereUniqueWithoutTemplateInput | TemplateVersionUpsertWithWhereUniqueWithoutTemplateInput[]
    createMany?: TemplateVersionCreateManyTemplateInputEnvelope
    set?: TemplateVersionWhereUniqueInput | TemplateVersionWhereUniqueInput[]
    disconnect?: TemplateVersionWhereUniqueInput | TemplateVersionWhereUniqueInput[]
    delete?: TemplateVersionWhereUniqueInput | TemplateVersionWhereUniqueInput[]
    connect?: TemplateVersionWhereUniqueInput | TemplateVersionWhereUniqueInput[]
    update?: TemplateVersionUpdateWithWhereUniqueWithoutTemplateInput | TemplateVersionUpdateWithWhereUniqueWithoutTemplateInput[]
    updateMany?: TemplateVersionUpdateManyWithWhereWithoutTemplateInput | TemplateVersionUpdateManyWithWhereWithoutTemplateInput[]
    deleteMany?: TemplateVersionScalarWhereInput | TemplateVersionScalarWhereInput[]
  }

  export type TemplateVersionUncheckedUpdateManyWithoutTemplateNestedInput = {
    create?: XOR<TemplateVersionCreateWithoutTemplateInput, TemplateVersionUncheckedCreateWithoutTemplateInput> | TemplateVersionCreateWithoutTemplateInput[] | TemplateVersionUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: TemplateVersionCreateOrConnectWithoutTemplateInput | TemplateVersionCreateOrConnectWithoutTemplateInput[]
    upsert?: TemplateVersionUpsertWithWhereUniqueWithoutTemplateInput | TemplateVersionUpsertWithWhereUniqueWithoutTemplateInput[]
    createMany?: TemplateVersionCreateManyTemplateInputEnvelope
    set?: TemplateVersionWhereUniqueInput | TemplateVersionWhereUniqueInput[]
    disconnect?: TemplateVersionWhereUniqueInput | TemplateVersionWhereUniqueInput[]
    delete?: TemplateVersionWhereUniqueInput | TemplateVersionWhereUniqueInput[]
    connect?: TemplateVersionWhereUniqueInput | TemplateVersionWhereUniqueInput[]
    update?: TemplateVersionUpdateWithWhereUniqueWithoutTemplateInput | TemplateVersionUpdateWithWhereUniqueWithoutTemplateInput[]
    updateMany?: TemplateVersionUpdateManyWithWhereWithoutTemplateInput | TemplateVersionUpdateManyWithWhereWithoutTemplateInput[]
    deleteMany?: TemplateVersionScalarWhereInput | TemplateVersionScalarWhereInput[]
  }

  export type TemplateCreateNestedOneWithoutVersionsInput = {
    create?: XOR<TemplateCreateWithoutVersionsInput, TemplateUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: TemplateCreateOrConnectWithoutVersionsInput
    connect?: TemplateWhereUniqueInput
  }

  export type TemplateUpdateOneRequiredWithoutVersionsNestedInput = {
    create?: XOR<TemplateCreateWithoutVersionsInput, TemplateUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: TemplateCreateOrConnectWithoutVersionsInput
    upsert?: TemplateUpsertWithoutVersionsInput
    connect?: TemplateWhereUniqueInput
    update?: XOR<XOR<TemplateUpdateToOneWithWhereWithoutVersionsInput, TemplateUpdateWithoutVersionsInput>, TemplateUncheckedUpdateWithoutVersionsInput>
  }

  export type CompiledTemplateCreaterequiredVariablesInput = {
    set: string[]
  }

  export type CompiledTemplateUpdaterequiredVariablesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NotificationCreatechannelsInput = {
    set: string[]
  }

  export type NotificationCreatetagsInput = {
    set: string[]
  }

  export type NotificationDeliveryTrackingCreateNestedManyWithoutNotificationInput = {
    create?: XOR<NotificationDeliveryTrackingCreateWithoutNotificationInput, NotificationDeliveryTrackingUncheckedCreateWithoutNotificationInput> | NotificationDeliveryTrackingCreateWithoutNotificationInput[] | NotificationDeliveryTrackingUncheckedCreateWithoutNotificationInput[]
    connectOrCreate?: NotificationDeliveryTrackingCreateOrConnectWithoutNotificationInput | NotificationDeliveryTrackingCreateOrConnectWithoutNotificationInput[]
    createMany?: NotificationDeliveryTrackingCreateManyNotificationInputEnvelope
    connect?: NotificationDeliveryTrackingWhereUniqueInput | NotificationDeliveryTrackingWhereUniqueInput[]
  }

  export type NotificationDeliveryTrackingUncheckedCreateNestedManyWithoutNotificationInput = {
    create?: XOR<NotificationDeliveryTrackingCreateWithoutNotificationInput, NotificationDeliveryTrackingUncheckedCreateWithoutNotificationInput> | NotificationDeliveryTrackingCreateWithoutNotificationInput[] | NotificationDeliveryTrackingUncheckedCreateWithoutNotificationInput[]
    connectOrCreate?: NotificationDeliveryTrackingCreateOrConnectWithoutNotificationInput | NotificationDeliveryTrackingCreateOrConnectWithoutNotificationInput[]
    createMany?: NotificationDeliveryTrackingCreateManyNotificationInputEnvelope
    connect?: NotificationDeliveryTrackingWhereUniqueInput | NotificationDeliveryTrackingWhereUniqueInput[]
  }

  export type NotificationUpdatechannelsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NotificationUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NotificationDeliveryTrackingUpdateManyWithoutNotificationNestedInput = {
    create?: XOR<NotificationDeliveryTrackingCreateWithoutNotificationInput, NotificationDeliveryTrackingUncheckedCreateWithoutNotificationInput> | NotificationDeliveryTrackingCreateWithoutNotificationInput[] | NotificationDeliveryTrackingUncheckedCreateWithoutNotificationInput[]
    connectOrCreate?: NotificationDeliveryTrackingCreateOrConnectWithoutNotificationInput | NotificationDeliveryTrackingCreateOrConnectWithoutNotificationInput[]
    upsert?: NotificationDeliveryTrackingUpsertWithWhereUniqueWithoutNotificationInput | NotificationDeliveryTrackingUpsertWithWhereUniqueWithoutNotificationInput[]
    createMany?: NotificationDeliveryTrackingCreateManyNotificationInputEnvelope
    set?: NotificationDeliveryTrackingWhereUniqueInput | NotificationDeliveryTrackingWhereUniqueInput[]
    disconnect?: NotificationDeliveryTrackingWhereUniqueInput | NotificationDeliveryTrackingWhereUniqueInput[]
    delete?: NotificationDeliveryTrackingWhereUniqueInput | NotificationDeliveryTrackingWhereUniqueInput[]
    connect?: NotificationDeliveryTrackingWhereUniqueInput | NotificationDeliveryTrackingWhereUniqueInput[]
    update?: NotificationDeliveryTrackingUpdateWithWhereUniqueWithoutNotificationInput | NotificationDeliveryTrackingUpdateWithWhereUniqueWithoutNotificationInput[]
    updateMany?: NotificationDeliveryTrackingUpdateManyWithWhereWithoutNotificationInput | NotificationDeliveryTrackingUpdateManyWithWhereWithoutNotificationInput[]
    deleteMany?: NotificationDeliveryTrackingScalarWhereInput | NotificationDeliveryTrackingScalarWhereInput[]
  }

  export type NotificationDeliveryTrackingUncheckedUpdateManyWithoutNotificationNestedInput = {
    create?: XOR<NotificationDeliveryTrackingCreateWithoutNotificationInput, NotificationDeliveryTrackingUncheckedCreateWithoutNotificationInput> | NotificationDeliveryTrackingCreateWithoutNotificationInput[] | NotificationDeliveryTrackingUncheckedCreateWithoutNotificationInput[]
    connectOrCreate?: NotificationDeliveryTrackingCreateOrConnectWithoutNotificationInput | NotificationDeliveryTrackingCreateOrConnectWithoutNotificationInput[]
    upsert?: NotificationDeliveryTrackingUpsertWithWhereUniqueWithoutNotificationInput | NotificationDeliveryTrackingUpsertWithWhereUniqueWithoutNotificationInput[]
    createMany?: NotificationDeliveryTrackingCreateManyNotificationInputEnvelope
    set?: NotificationDeliveryTrackingWhereUniqueInput | NotificationDeliveryTrackingWhereUniqueInput[]
    disconnect?: NotificationDeliveryTrackingWhereUniqueInput | NotificationDeliveryTrackingWhereUniqueInput[]
    delete?: NotificationDeliveryTrackingWhereUniqueInput | NotificationDeliveryTrackingWhereUniqueInput[]
    connect?: NotificationDeliveryTrackingWhereUniqueInput | NotificationDeliveryTrackingWhereUniqueInput[]
    update?: NotificationDeliveryTrackingUpdateWithWhereUniqueWithoutNotificationInput | NotificationDeliveryTrackingUpdateWithWhereUniqueWithoutNotificationInput[]
    updateMany?: NotificationDeliveryTrackingUpdateManyWithWhereWithoutNotificationInput | NotificationDeliveryTrackingUpdateManyWithWhereWithoutNotificationInput[]
    deleteMany?: NotificationDeliveryTrackingScalarWhereInput | NotificationDeliveryTrackingScalarWhereInput[]
  }

  export type NotificationCreateNestedOneWithoutDeliveryTrackingInput = {
    create?: XOR<NotificationCreateWithoutDeliveryTrackingInput, NotificationUncheckedCreateWithoutDeliveryTrackingInput>
    connectOrCreate?: NotificationCreateOrConnectWithoutDeliveryTrackingInput
    connect?: NotificationWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NotificationUpdateOneRequiredWithoutDeliveryTrackingNestedInput = {
    create?: XOR<NotificationCreateWithoutDeliveryTrackingInput, NotificationUncheckedCreateWithoutDeliveryTrackingInput>
    connectOrCreate?: NotificationCreateOrConnectWithoutDeliveryTrackingInput
    upsert?: NotificationUpsertWithoutDeliveryTrackingInput
    connect?: NotificationWhereUniqueInput
    update?: XOR<XOR<NotificationUpdateToOneWithWhereWithoutDeliveryTrackingInput, NotificationUpdateWithoutDeliveryTrackingInput>, NotificationUncheckedUpdateWithoutDeliveryTrackingInput>
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type TemplateVersionCreateWithoutTemplateInput = {
    id?: string
    version: string
    content: JsonNullValueInput | InputJsonValue
    changelog?: string | null
    createdAt?: Date | string
    isActive?: boolean
  }

  export type TemplateVersionUncheckedCreateWithoutTemplateInput = {
    id?: string
    version: string
    content: JsonNullValueInput | InputJsonValue
    changelog?: string | null
    createdAt?: Date | string
    isActive?: boolean
  }

  export type TemplateVersionCreateOrConnectWithoutTemplateInput = {
    where: TemplateVersionWhereUniqueInput
    create: XOR<TemplateVersionCreateWithoutTemplateInput, TemplateVersionUncheckedCreateWithoutTemplateInput>
  }

  export type TemplateVersionCreateManyTemplateInputEnvelope = {
    data: TemplateVersionCreateManyTemplateInput | TemplateVersionCreateManyTemplateInput[]
    skipDuplicates?: boolean
  }

  export type TemplateVersionUpsertWithWhereUniqueWithoutTemplateInput = {
    where: TemplateVersionWhereUniqueInput
    update: XOR<TemplateVersionUpdateWithoutTemplateInput, TemplateVersionUncheckedUpdateWithoutTemplateInput>
    create: XOR<TemplateVersionCreateWithoutTemplateInput, TemplateVersionUncheckedCreateWithoutTemplateInput>
  }

  export type TemplateVersionUpdateWithWhereUniqueWithoutTemplateInput = {
    where: TemplateVersionWhereUniqueInput
    data: XOR<TemplateVersionUpdateWithoutTemplateInput, TemplateVersionUncheckedUpdateWithoutTemplateInput>
  }

  export type TemplateVersionUpdateManyWithWhereWithoutTemplateInput = {
    where: TemplateVersionScalarWhereInput
    data: XOR<TemplateVersionUpdateManyMutationInput, TemplateVersionUncheckedUpdateManyWithoutTemplateInput>
  }

  export type TemplateVersionScalarWhereInput = {
    AND?: TemplateVersionScalarWhereInput | TemplateVersionScalarWhereInput[]
    OR?: TemplateVersionScalarWhereInput[]
    NOT?: TemplateVersionScalarWhereInput | TemplateVersionScalarWhereInput[]
    id?: StringFilter<"TemplateVersion"> | string
    templateId?: StringFilter<"TemplateVersion"> | string
    version?: StringFilter<"TemplateVersion"> | string
    content?: JsonFilter<"TemplateVersion">
    changelog?: StringNullableFilter<"TemplateVersion"> | string | null
    createdAt?: DateTimeFilter<"TemplateVersion"> | Date | string
    isActive?: BoolFilter<"TemplateVersion"> | boolean
  }

  export type TemplateCreateWithoutVersionsInput = {
    id?: string
    name: string
    description?: string | null
    category: string
    channels?: TemplateCreatechannelsInput | string[]
    activeVersion?: string | null
    languages?: TemplateCreatelanguagesInput | string[]
    defaultLanguage?: string
    requiredVariables?: TemplateCreaterequiredVariablesInput | string[]
    optionalVariables?: TemplateCreateoptionalVariablesInput | string[]
    variableSchema?: NullableJsonNullValueInput | InputJsonValue
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
  }

  export type TemplateUncheckedCreateWithoutVersionsInput = {
    id?: string
    name: string
    description?: string | null
    category: string
    channels?: TemplateCreatechannelsInput | string[]
    activeVersion?: string | null
    languages?: TemplateCreatelanguagesInput | string[]
    defaultLanguage?: string
    requiredVariables?: TemplateCreaterequiredVariablesInput | string[]
    optionalVariables?: TemplateCreateoptionalVariablesInput | string[]
    variableSchema?: NullableJsonNullValueInput | InputJsonValue
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    isActive?: boolean
  }

  export type TemplateCreateOrConnectWithoutVersionsInput = {
    where: TemplateWhereUniqueInput
    create: XOR<TemplateCreateWithoutVersionsInput, TemplateUncheckedCreateWithoutVersionsInput>
  }

  export type TemplateUpsertWithoutVersionsInput = {
    update: XOR<TemplateUpdateWithoutVersionsInput, TemplateUncheckedUpdateWithoutVersionsInput>
    create: XOR<TemplateCreateWithoutVersionsInput, TemplateUncheckedCreateWithoutVersionsInput>
    where?: TemplateWhereInput
  }

  export type TemplateUpdateToOneWithWhereWithoutVersionsInput = {
    where?: TemplateWhereInput
    data: XOR<TemplateUpdateWithoutVersionsInput, TemplateUncheckedUpdateWithoutVersionsInput>
  }

  export type TemplateUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    channels?: TemplateUpdatechannelsInput | string[]
    activeVersion?: NullableStringFieldUpdateOperationsInput | string | null
    languages?: TemplateUpdatelanguagesInput | string[]
    defaultLanguage?: StringFieldUpdateOperationsInput | string
    requiredVariables?: TemplateUpdaterequiredVariablesInput | string[]
    optionalVariables?: TemplateUpdateoptionalVariablesInput | string[]
    variableSchema?: NullableJsonNullValueInput | InputJsonValue
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TemplateUncheckedUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    channels?: TemplateUpdatechannelsInput | string[]
    activeVersion?: NullableStringFieldUpdateOperationsInput | string | null
    languages?: TemplateUpdatelanguagesInput | string[]
    defaultLanguage?: StringFieldUpdateOperationsInput | string
    requiredVariables?: TemplateUpdaterequiredVariablesInput | string[]
    optionalVariables?: TemplateUpdateoptionalVariablesInput | string[]
    variableSchema?: NullableJsonNullValueInput | InputJsonValue
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type NotificationDeliveryTrackingCreateWithoutNotificationInput = {
    id?: string
    channel: string
    provider: string
    status: string
    providerMessageId?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    openedAt?: Date | string | null
    clickedAt?: Date | string | null
    bouncedAt?: Date | string | null
    complainedAt?: Date | string | null
    errorCode?: string | null
    errorMessage?: string | null
    retryCount?: number
    providerResponse?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationDeliveryTrackingUncheckedCreateWithoutNotificationInput = {
    id?: string
    channel: string
    provider: string
    status: string
    providerMessageId?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    openedAt?: Date | string | null
    clickedAt?: Date | string | null
    bouncedAt?: Date | string | null
    complainedAt?: Date | string | null
    errorCode?: string | null
    errorMessage?: string | null
    retryCount?: number
    providerResponse?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationDeliveryTrackingCreateOrConnectWithoutNotificationInput = {
    where: NotificationDeliveryTrackingWhereUniqueInput
    create: XOR<NotificationDeliveryTrackingCreateWithoutNotificationInput, NotificationDeliveryTrackingUncheckedCreateWithoutNotificationInput>
  }

  export type NotificationDeliveryTrackingCreateManyNotificationInputEnvelope = {
    data: NotificationDeliveryTrackingCreateManyNotificationInput | NotificationDeliveryTrackingCreateManyNotificationInput[]
    skipDuplicates?: boolean
  }

  export type NotificationDeliveryTrackingUpsertWithWhereUniqueWithoutNotificationInput = {
    where: NotificationDeliveryTrackingWhereUniqueInput
    update: XOR<NotificationDeliveryTrackingUpdateWithoutNotificationInput, NotificationDeliveryTrackingUncheckedUpdateWithoutNotificationInput>
    create: XOR<NotificationDeliveryTrackingCreateWithoutNotificationInput, NotificationDeliveryTrackingUncheckedCreateWithoutNotificationInput>
  }

  export type NotificationDeliveryTrackingUpdateWithWhereUniqueWithoutNotificationInput = {
    where: NotificationDeliveryTrackingWhereUniqueInput
    data: XOR<NotificationDeliveryTrackingUpdateWithoutNotificationInput, NotificationDeliveryTrackingUncheckedUpdateWithoutNotificationInput>
  }

  export type NotificationDeliveryTrackingUpdateManyWithWhereWithoutNotificationInput = {
    where: NotificationDeliveryTrackingScalarWhereInput
    data: XOR<NotificationDeliveryTrackingUpdateManyMutationInput, NotificationDeliveryTrackingUncheckedUpdateManyWithoutNotificationInput>
  }

  export type NotificationDeliveryTrackingScalarWhereInput = {
    AND?: NotificationDeliveryTrackingScalarWhereInput | NotificationDeliveryTrackingScalarWhereInput[]
    OR?: NotificationDeliveryTrackingScalarWhereInput[]
    NOT?: NotificationDeliveryTrackingScalarWhereInput | NotificationDeliveryTrackingScalarWhereInput[]
    id?: StringFilter<"NotificationDeliveryTracking"> | string
    notificationId?: StringFilter<"NotificationDeliveryTracking"> | string
    channel?: StringFilter<"NotificationDeliveryTracking"> | string
    provider?: StringFilter<"NotificationDeliveryTracking"> | string
    status?: StringFilter<"NotificationDeliveryTracking"> | string
    providerMessageId?: StringNullableFilter<"NotificationDeliveryTracking"> | string | null
    sentAt?: DateTimeNullableFilter<"NotificationDeliveryTracking"> | Date | string | null
    deliveredAt?: DateTimeNullableFilter<"NotificationDeliveryTracking"> | Date | string | null
    openedAt?: DateTimeNullableFilter<"NotificationDeliveryTracking"> | Date | string | null
    clickedAt?: DateTimeNullableFilter<"NotificationDeliveryTracking"> | Date | string | null
    bouncedAt?: DateTimeNullableFilter<"NotificationDeliveryTracking"> | Date | string | null
    complainedAt?: DateTimeNullableFilter<"NotificationDeliveryTracking"> | Date | string | null
    errorCode?: StringNullableFilter<"NotificationDeliveryTracking"> | string | null
    errorMessage?: StringNullableFilter<"NotificationDeliveryTracking"> | string | null
    retryCount?: IntFilter<"NotificationDeliveryTracking"> | number
    providerResponse?: JsonNullableFilter<"NotificationDeliveryTracking">
    createdAt?: DateTimeFilter<"NotificationDeliveryTracking"> | Date | string
    updatedAt?: DateTimeFilter<"NotificationDeliveryTracking"> | Date | string
  }

  export type NotificationCreateWithoutDeliveryTrackingInput = {
    id?: string
    userId?: string | null
    email?: string | null
    phone?: string | null
    templateId?: string | null
    channels?: NotificationCreatechannelsInput | string[]
    priority: string
    category: string
    subject?: string | null
    content: JsonNullValueInput | InputJsonValue
    variables?: NullableJsonNullValueInput | InputJsonValue
    renderedContent?: NullableJsonNullValueInput | InputJsonValue
    status: string
    scheduledAt?: Date | string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    trackingEnabled?: boolean
    trackingData?: NullableJsonNullValueInput | InputJsonValue
    fromService: string
    fromUserId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: NotificationCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationUncheckedCreateWithoutDeliveryTrackingInput = {
    id?: string
    userId?: string | null
    email?: string | null
    phone?: string | null
    templateId?: string | null
    channels?: NotificationCreatechannelsInput | string[]
    priority: string
    category: string
    subject?: string | null
    content: JsonNullValueInput | InputJsonValue
    variables?: NullableJsonNullValueInput | InputJsonValue
    renderedContent?: NullableJsonNullValueInput | InputJsonValue
    status: string
    scheduledAt?: Date | string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    trackingEnabled?: boolean
    trackingData?: NullableJsonNullValueInput | InputJsonValue
    fromService: string
    fromUserId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: NotificationCreatetagsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutDeliveryTrackingInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutDeliveryTrackingInput, NotificationUncheckedCreateWithoutDeliveryTrackingInput>
  }

  export type NotificationUpsertWithoutDeliveryTrackingInput = {
    update: XOR<NotificationUpdateWithoutDeliveryTrackingInput, NotificationUncheckedUpdateWithoutDeliveryTrackingInput>
    create: XOR<NotificationCreateWithoutDeliveryTrackingInput, NotificationUncheckedCreateWithoutDeliveryTrackingInput>
    where?: NotificationWhereInput
  }

  export type NotificationUpdateToOneWithWhereWithoutDeliveryTrackingInput = {
    where?: NotificationWhereInput
    data: XOR<NotificationUpdateWithoutDeliveryTrackingInput, NotificationUncheckedUpdateWithoutDeliveryTrackingInput>
  }

  export type NotificationUpdateWithoutDeliveryTrackingInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    channels?: NotificationUpdatechannelsInput | string[]
    priority?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    content?: JsonNullValueInput | InputJsonValue
    variables?: NullableJsonNullValueInput | InputJsonValue
    renderedContent?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trackingEnabled?: BoolFieldUpdateOperationsInput | boolean
    trackingData?: NullableJsonNullValueInput | InputJsonValue
    fromService?: StringFieldUpdateOperationsInput | string
    fromUserId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: NotificationUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateWithoutDeliveryTrackingInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    channels?: NotificationUpdatechannelsInput | string[]
    priority?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    content?: JsonNullValueInput | InputJsonValue
    variables?: NullableJsonNullValueInput | InputJsonValue
    renderedContent?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trackingEnabled?: BoolFieldUpdateOperationsInput | boolean
    trackingData?: NullableJsonNullValueInput | InputJsonValue
    fromService?: StringFieldUpdateOperationsInput | string
    fromUserId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tags?: NotificationUpdatetagsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TemplateVersionCreateManyTemplateInput = {
    id?: string
    version: string
    content: JsonNullValueInput | InputJsonValue
    changelog?: string | null
    createdAt?: Date | string
    isActive?: boolean
  }

  export type TemplateVersionUpdateWithoutTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    changelog?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TemplateVersionUncheckedUpdateWithoutTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    changelog?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TemplateVersionUncheckedUpdateManyWithoutTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    changelog?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type NotificationDeliveryTrackingCreateManyNotificationInput = {
    id?: string
    channel: string
    provider: string
    status: string
    providerMessageId?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    openedAt?: Date | string | null
    clickedAt?: Date | string | null
    bouncedAt?: Date | string | null
    complainedAt?: Date | string | null
    errorCode?: string | null
    errorMessage?: string | null
    retryCount?: number
    providerResponse?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationDeliveryTrackingUpdateWithoutNotificationInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    providerMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    clickedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    complainedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    providerResponse?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationDeliveryTrackingUncheckedUpdateWithoutNotificationInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    providerMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    clickedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    complainedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    providerResponse?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationDeliveryTrackingUncheckedUpdateManyWithoutNotificationInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    providerMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    openedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    clickedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bouncedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    complainedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    providerResponse?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use TemplateCountOutputTypeDefaultArgs instead
     */
    export type TemplateCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TemplateCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NotificationCountOutputTypeDefaultArgs instead
     */
    export type NotificationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NotificationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TemplateDefaultArgs instead
     */
    export type TemplateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TemplateDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TemplateVersionDefaultArgs instead
     */
    export type TemplateVersionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TemplateVersionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CompiledTemplateDefaultArgs instead
     */
    export type CompiledTemplateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CompiledTemplateDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NotificationDefaultArgs instead
     */
    export type NotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NotificationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NotificationDeliveryTrackingDefaultArgs instead
     */
    export type NotificationDeliveryTrackingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NotificationDeliveryTrackingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserNotificationPreferencesDefaultArgs instead
     */
    export type UserNotificationPreferencesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserNotificationPreferencesDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NotificationSuppressionListDefaultArgs instead
     */
    export type NotificationSuppressionListArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NotificationSuppressionListDefaultArgs<ExtArgs>

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