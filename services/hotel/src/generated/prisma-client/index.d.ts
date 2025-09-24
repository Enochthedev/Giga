
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
 * Model Property
 * 
 */
export type Property = $Result.DefaultSelection<Prisma.$PropertyPayload>
/**
 * Model RoomType
 * 
 */
export type RoomType = $Result.DefaultSelection<Prisma.$RoomTypePayload>
/**
 * Model Booking
 * 
 */
export type Booking = $Result.DefaultSelection<Prisma.$BookingPayload>
/**
 * Model BookedRoom
 * 
 */
export type BookedRoom = $Result.DefaultSelection<Prisma.$BookedRoomPayload>
/**
 * Model InventoryRecord
 * 
 */
export type InventoryRecord = $Result.DefaultSelection<Prisma.$InventoryRecordPayload>
/**
 * Model InventoryReservation
 * 
 */
export type InventoryReservation = $Result.DefaultSelection<Prisma.$InventoryReservationPayload>
/**
 * Model InventoryLock
 * 
 */
export type InventoryLock = $Result.DefaultSelection<Prisma.$InventoryLockPayload>
/**
 * Model RateRecord
 * 
 */
export type RateRecord = $Result.DefaultSelection<Prisma.$RateRecordPayload>
/**
 * Model DynamicPricingRule
 * 
 */
export type DynamicPricingRule = $Result.DefaultSelection<Prisma.$DynamicPricingRulePayload>
/**
 * Model SeasonalRate
 * 
 */
export type SeasonalRate = $Result.DefaultSelection<Prisma.$SeasonalRatePayload>
/**
 * Model Promotion
 * 
 */
export type Promotion = $Result.DefaultSelection<Prisma.$PromotionPayload>
/**
 * Model GroupDiscount
 * 
 */
export type GroupDiscount = $Result.DefaultSelection<Prisma.$GroupDiscountPayload>
/**
 * Model TaxConfiguration
 * 
 */
export type TaxConfiguration = $Result.DefaultSelection<Prisma.$TaxConfigurationPayload>
/**
 * Model GuestProfile
 * 
 */
export type GuestProfile = $Result.DefaultSelection<Prisma.$GuestProfilePayload>
/**
 * Model GuestActivityLog
 * 
 */
export type GuestActivityLog = $Result.DefaultSelection<Prisma.$GuestActivityLogPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Properties
 * const properties = await prisma.property.findMany()
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
   * // Fetch zero or more Properties
   * const properties = await prisma.property.findMany()
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
   * `prisma.property`: Exposes CRUD operations for the **Property** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Properties
    * const properties = await prisma.property.findMany()
    * ```
    */
  get property(): Prisma.PropertyDelegate<ExtArgs>;

  /**
   * `prisma.roomType`: Exposes CRUD operations for the **RoomType** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RoomTypes
    * const roomTypes = await prisma.roomType.findMany()
    * ```
    */
  get roomType(): Prisma.RoomTypeDelegate<ExtArgs>;

  /**
   * `prisma.booking`: Exposes CRUD operations for the **Booking** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bookings
    * const bookings = await prisma.booking.findMany()
    * ```
    */
  get booking(): Prisma.BookingDelegate<ExtArgs>;

  /**
   * `prisma.bookedRoom`: Exposes CRUD operations for the **BookedRoom** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BookedRooms
    * const bookedRooms = await prisma.bookedRoom.findMany()
    * ```
    */
  get bookedRoom(): Prisma.BookedRoomDelegate<ExtArgs>;

  /**
   * `prisma.inventoryRecord`: Exposes CRUD operations for the **InventoryRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InventoryRecords
    * const inventoryRecords = await prisma.inventoryRecord.findMany()
    * ```
    */
  get inventoryRecord(): Prisma.InventoryRecordDelegate<ExtArgs>;

  /**
   * `prisma.inventoryReservation`: Exposes CRUD operations for the **InventoryReservation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InventoryReservations
    * const inventoryReservations = await prisma.inventoryReservation.findMany()
    * ```
    */
  get inventoryReservation(): Prisma.InventoryReservationDelegate<ExtArgs>;

  /**
   * `prisma.inventoryLock`: Exposes CRUD operations for the **InventoryLock** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InventoryLocks
    * const inventoryLocks = await prisma.inventoryLock.findMany()
    * ```
    */
  get inventoryLock(): Prisma.InventoryLockDelegate<ExtArgs>;

  /**
   * `prisma.rateRecord`: Exposes CRUD operations for the **RateRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RateRecords
    * const rateRecords = await prisma.rateRecord.findMany()
    * ```
    */
  get rateRecord(): Prisma.RateRecordDelegate<ExtArgs>;

  /**
   * `prisma.dynamicPricingRule`: Exposes CRUD operations for the **DynamicPricingRule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DynamicPricingRules
    * const dynamicPricingRules = await prisma.dynamicPricingRule.findMany()
    * ```
    */
  get dynamicPricingRule(): Prisma.DynamicPricingRuleDelegate<ExtArgs>;

  /**
   * `prisma.seasonalRate`: Exposes CRUD operations for the **SeasonalRate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SeasonalRates
    * const seasonalRates = await prisma.seasonalRate.findMany()
    * ```
    */
  get seasonalRate(): Prisma.SeasonalRateDelegate<ExtArgs>;

  /**
   * `prisma.promotion`: Exposes CRUD operations for the **Promotion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Promotions
    * const promotions = await prisma.promotion.findMany()
    * ```
    */
  get promotion(): Prisma.PromotionDelegate<ExtArgs>;

  /**
   * `prisma.groupDiscount`: Exposes CRUD operations for the **GroupDiscount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GroupDiscounts
    * const groupDiscounts = await prisma.groupDiscount.findMany()
    * ```
    */
  get groupDiscount(): Prisma.GroupDiscountDelegate<ExtArgs>;

  /**
   * `prisma.taxConfiguration`: Exposes CRUD operations for the **TaxConfiguration** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TaxConfigurations
    * const taxConfigurations = await prisma.taxConfiguration.findMany()
    * ```
    */
  get taxConfiguration(): Prisma.TaxConfigurationDelegate<ExtArgs>;

  /**
   * `prisma.guestProfile`: Exposes CRUD operations for the **GuestProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GuestProfiles
    * const guestProfiles = await prisma.guestProfile.findMany()
    * ```
    */
  get guestProfile(): Prisma.GuestProfileDelegate<ExtArgs>;

  /**
   * `prisma.guestActivityLog`: Exposes CRUD operations for the **GuestActivityLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GuestActivityLogs
    * const guestActivityLogs = await prisma.guestActivityLog.findMany()
    * ```
    */
  get guestActivityLog(): Prisma.GuestActivityLogDelegate<ExtArgs>;
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
    GuestActivityLog: 'GuestActivityLog'
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
      modelProps: "property" | "roomType" | "booking" | "bookedRoom" | "inventoryRecord" | "inventoryReservation" | "inventoryLock" | "rateRecord" | "dynamicPricingRule" | "seasonalRate" | "promotion" | "groupDiscount" | "taxConfiguration" | "guestProfile" | "guestActivityLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Property: {
        payload: Prisma.$PropertyPayload<ExtArgs>
        fields: Prisma.PropertyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PropertyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PropertyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          findFirst: {
            args: Prisma.PropertyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PropertyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          findMany: {
            args: Prisma.PropertyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>[]
          }
          create: {
            args: Prisma.PropertyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          createMany: {
            args: Prisma.PropertyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PropertyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>[]
          }
          delete: {
            args: Prisma.PropertyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          update: {
            args: Prisma.PropertyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          deleteMany: {
            args: Prisma.PropertyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PropertyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PropertyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          aggregate: {
            args: Prisma.PropertyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProperty>
          }
          groupBy: {
            args: Prisma.PropertyGroupByArgs<ExtArgs>
            result: $Utils.Optional<PropertyGroupByOutputType>[]
          }
          count: {
            args: Prisma.PropertyCountArgs<ExtArgs>
            result: $Utils.Optional<PropertyCountAggregateOutputType> | number
          }
        }
      }
      RoomType: {
        payload: Prisma.$RoomTypePayload<ExtArgs>
        fields: Prisma.RoomTypeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoomTypeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomTypePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoomTypeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomTypePayload>
          }
          findFirst: {
            args: Prisma.RoomTypeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomTypePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoomTypeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomTypePayload>
          }
          findMany: {
            args: Prisma.RoomTypeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomTypePayload>[]
          }
          create: {
            args: Prisma.RoomTypeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomTypePayload>
          }
          createMany: {
            args: Prisma.RoomTypeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoomTypeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomTypePayload>[]
          }
          delete: {
            args: Prisma.RoomTypeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomTypePayload>
          }
          update: {
            args: Prisma.RoomTypeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomTypePayload>
          }
          deleteMany: {
            args: Prisma.RoomTypeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoomTypeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RoomTypeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomTypePayload>
          }
          aggregate: {
            args: Prisma.RoomTypeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoomType>
          }
          groupBy: {
            args: Prisma.RoomTypeGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoomTypeGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoomTypeCountArgs<ExtArgs>
            result: $Utils.Optional<RoomTypeCountAggregateOutputType> | number
          }
        }
      }
      Booking: {
        payload: Prisma.$BookingPayload<ExtArgs>
        fields: Prisma.BookingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          findFirst: {
            args: Prisma.BookingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          findMany: {
            args: Prisma.BookingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          create: {
            args: Prisma.BookingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          createMany: {
            args: Prisma.BookingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          delete: {
            args: Prisma.BookingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          update: {
            args: Prisma.BookingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          deleteMany: {
            args: Prisma.BookingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BookingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          aggregate: {
            args: Prisma.BookingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBooking>
          }
          groupBy: {
            args: Prisma.BookingGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookingGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookingCountArgs<ExtArgs>
            result: $Utils.Optional<BookingCountAggregateOutputType> | number
          }
        }
      }
      BookedRoom: {
        payload: Prisma.$BookedRoomPayload<ExtArgs>
        fields: Prisma.BookedRoomFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookedRoomFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookedRoomPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookedRoomFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookedRoomPayload>
          }
          findFirst: {
            args: Prisma.BookedRoomFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookedRoomPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookedRoomFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookedRoomPayload>
          }
          findMany: {
            args: Prisma.BookedRoomFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookedRoomPayload>[]
          }
          create: {
            args: Prisma.BookedRoomCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookedRoomPayload>
          }
          createMany: {
            args: Prisma.BookedRoomCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookedRoomCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookedRoomPayload>[]
          }
          delete: {
            args: Prisma.BookedRoomDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookedRoomPayload>
          }
          update: {
            args: Prisma.BookedRoomUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookedRoomPayload>
          }
          deleteMany: {
            args: Prisma.BookedRoomDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookedRoomUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BookedRoomUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookedRoomPayload>
          }
          aggregate: {
            args: Prisma.BookedRoomAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBookedRoom>
          }
          groupBy: {
            args: Prisma.BookedRoomGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookedRoomGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookedRoomCountArgs<ExtArgs>
            result: $Utils.Optional<BookedRoomCountAggregateOutputType> | number
          }
        }
      }
      InventoryRecord: {
        payload: Prisma.$InventoryRecordPayload<ExtArgs>
        fields: Prisma.InventoryRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InventoryRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InventoryRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryRecordPayload>
          }
          findFirst: {
            args: Prisma.InventoryRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InventoryRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryRecordPayload>
          }
          findMany: {
            args: Prisma.InventoryRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryRecordPayload>[]
          }
          create: {
            args: Prisma.InventoryRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryRecordPayload>
          }
          createMany: {
            args: Prisma.InventoryRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InventoryRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryRecordPayload>[]
          }
          delete: {
            args: Prisma.InventoryRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryRecordPayload>
          }
          update: {
            args: Prisma.InventoryRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryRecordPayload>
          }
          deleteMany: {
            args: Prisma.InventoryRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InventoryRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InventoryRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryRecordPayload>
          }
          aggregate: {
            args: Prisma.InventoryRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventoryRecord>
          }
          groupBy: {
            args: Prisma.InventoryRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventoryRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.InventoryRecordCountArgs<ExtArgs>
            result: $Utils.Optional<InventoryRecordCountAggregateOutputType> | number
          }
        }
      }
      InventoryReservation: {
        payload: Prisma.$InventoryReservationPayload<ExtArgs>
        fields: Prisma.InventoryReservationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InventoryReservationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InventoryReservationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>
          }
          findFirst: {
            args: Prisma.InventoryReservationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InventoryReservationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>
          }
          findMany: {
            args: Prisma.InventoryReservationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>[]
          }
          create: {
            args: Prisma.InventoryReservationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>
          }
          createMany: {
            args: Prisma.InventoryReservationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InventoryReservationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>[]
          }
          delete: {
            args: Prisma.InventoryReservationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>
          }
          update: {
            args: Prisma.InventoryReservationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>
          }
          deleteMany: {
            args: Prisma.InventoryReservationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InventoryReservationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InventoryReservationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>
          }
          aggregate: {
            args: Prisma.InventoryReservationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventoryReservation>
          }
          groupBy: {
            args: Prisma.InventoryReservationGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventoryReservationGroupByOutputType>[]
          }
          count: {
            args: Prisma.InventoryReservationCountArgs<ExtArgs>
            result: $Utils.Optional<InventoryReservationCountAggregateOutputType> | number
          }
        }
      }
      InventoryLock: {
        payload: Prisma.$InventoryLockPayload<ExtArgs>
        fields: Prisma.InventoryLockFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InventoryLockFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLockPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InventoryLockFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLockPayload>
          }
          findFirst: {
            args: Prisma.InventoryLockFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLockPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InventoryLockFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLockPayload>
          }
          findMany: {
            args: Prisma.InventoryLockFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLockPayload>[]
          }
          create: {
            args: Prisma.InventoryLockCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLockPayload>
          }
          createMany: {
            args: Prisma.InventoryLockCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InventoryLockCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLockPayload>[]
          }
          delete: {
            args: Prisma.InventoryLockDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLockPayload>
          }
          update: {
            args: Prisma.InventoryLockUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLockPayload>
          }
          deleteMany: {
            args: Prisma.InventoryLockDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InventoryLockUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InventoryLockUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryLockPayload>
          }
          aggregate: {
            args: Prisma.InventoryLockAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventoryLock>
          }
          groupBy: {
            args: Prisma.InventoryLockGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventoryLockGroupByOutputType>[]
          }
          count: {
            args: Prisma.InventoryLockCountArgs<ExtArgs>
            result: $Utils.Optional<InventoryLockCountAggregateOutputType> | number
          }
        }
      }
      RateRecord: {
        payload: Prisma.$RateRecordPayload<ExtArgs>
        fields: Prisma.RateRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RateRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RateRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RateRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RateRecordPayload>
          }
          findFirst: {
            args: Prisma.RateRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RateRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RateRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RateRecordPayload>
          }
          findMany: {
            args: Prisma.RateRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RateRecordPayload>[]
          }
          create: {
            args: Prisma.RateRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RateRecordPayload>
          }
          createMany: {
            args: Prisma.RateRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RateRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RateRecordPayload>[]
          }
          delete: {
            args: Prisma.RateRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RateRecordPayload>
          }
          update: {
            args: Prisma.RateRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RateRecordPayload>
          }
          deleteMany: {
            args: Prisma.RateRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RateRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RateRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RateRecordPayload>
          }
          aggregate: {
            args: Prisma.RateRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRateRecord>
          }
          groupBy: {
            args: Prisma.RateRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<RateRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.RateRecordCountArgs<ExtArgs>
            result: $Utils.Optional<RateRecordCountAggregateOutputType> | number
          }
        }
      }
      DynamicPricingRule: {
        payload: Prisma.$DynamicPricingRulePayload<ExtArgs>
        fields: Prisma.DynamicPricingRuleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DynamicPricingRuleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DynamicPricingRulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DynamicPricingRuleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DynamicPricingRulePayload>
          }
          findFirst: {
            args: Prisma.DynamicPricingRuleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DynamicPricingRulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DynamicPricingRuleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DynamicPricingRulePayload>
          }
          findMany: {
            args: Prisma.DynamicPricingRuleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DynamicPricingRulePayload>[]
          }
          create: {
            args: Prisma.DynamicPricingRuleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DynamicPricingRulePayload>
          }
          createMany: {
            args: Prisma.DynamicPricingRuleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DynamicPricingRuleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DynamicPricingRulePayload>[]
          }
          delete: {
            args: Prisma.DynamicPricingRuleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DynamicPricingRulePayload>
          }
          update: {
            args: Prisma.DynamicPricingRuleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DynamicPricingRulePayload>
          }
          deleteMany: {
            args: Prisma.DynamicPricingRuleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DynamicPricingRuleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DynamicPricingRuleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DynamicPricingRulePayload>
          }
          aggregate: {
            args: Prisma.DynamicPricingRuleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDynamicPricingRule>
          }
          groupBy: {
            args: Prisma.DynamicPricingRuleGroupByArgs<ExtArgs>
            result: $Utils.Optional<DynamicPricingRuleGroupByOutputType>[]
          }
          count: {
            args: Prisma.DynamicPricingRuleCountArgs<ExtArgs>
            result: $Utils.Optional<DynamicPricingRuleCountAggregateOutputType> | number
          }
        }
      }
      SeasonalRate: {
        payload: Prisma.$SeasonalRatePayload<ExtArgs>
        fields: Prisma.SeasonalRateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SeasonalRateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeasonalRatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SeasonalRateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeasonalRatePayload>
          }
          findFirst: {
            args: Prisma.SeasonalRateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeasonalRatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SeasonalRateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeasonalRatePayload>
          }
          findMany: {
            args: Prisma.SeasonalRateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeasonalRatePayload>[]
          }
          create: {
            args: Prisma.SeasonalRateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeasonalRatePayload>
          }
          createMany: {
            args: Prisma.SeasonalRateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SeasonalRateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeasonalRatePayload>[]
          }
          delete: {
            args: Prisma.SeasonalRateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeasonalRatePayload>
          }
          update: {
            args: Prisma.SeasonalRateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeasonalRatePayload>
          }
          deleteMany: {
            args: Prisma.SeasonalRateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SeasonalRateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SeasonalRateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeasonalRatePayload>
          }
          aggregate: {
            args: Prisma.SeasonalRateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSeasonalRate>
          }
          groupBy: {
            args: Prisma.SeasonalRateGroupByArgs<ExtArgs>
            result: $Utils.Optional<SeasonalRateGroupByOutputType>[]
          }
          count: {
            args: Prisma.SeasonalRateCountArgs<ExtArgs>
            result: $Utils.Optional<SeasonalRateCountAggregateOutputType> | number
          }
        }
      }
      Promotion: {
        payload: Prisma.$PromotionPayload<ExtArgs>
        fields: Prisma.PromotionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PromotionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PromotionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionPayload>
          }
          findFirst: {
            args: Prisma.PromotionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PromotionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionPayload>
          }
          findMany: {
            args: Prisma.PromotionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionPayload>[]
          }
          create: {
            args: Prisma.PromotionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionPayload>
          }
          createMany: {
            args: Prisma.PromotionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PromotionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionPayload>[]
          }
          delete: {
            args: Prisma.PromotionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionPayload>
          }
          update: {
            args: Prisma.PromotionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionPayload>
          }
          deleteMany: {
            args: Prisma.PromotionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PromotionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PromotionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionPayload>
          }
          aggregate: {
            args: Prisma.PromotionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePromotion>
          }
          groupBy: {
            args: Prisma.PromotionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PromotionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PromotionCountArgs<ExtArgs>
            result: $Utils.Optional<PromotionCountAggregateOutputType> | number
          }
        }
      }
      GroupDiscount: {
        payload: Prisma.$GroupDiscountPayload<ExtArgs>
        fields: Prisma.GroupDiscountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GroupDiscountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupDiscountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GroupDiscountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupDiscountPayload>
          }
          findFirst: {
            args: Prisma.GroupDiscountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupDiscountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GroupDiscountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupDiscountPayload>
          }
          findMany: {
            args: Prisma.GroupDiscountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupDiscountPayload>[]
          }
          create: {
            args: Prisma.GroupDiscountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupDiscountPayload>
          }
          createMany: {
            args: Prisma.GroupDiscountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GroupDiscountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupDiscountPayload>[]
          }
          delete: {
            args: Prisma.GroupDiscountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupDiscountPayload>
          }
          update: {
            args: Prisma.GroupDiscountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupDiscountPayload>
          }
          deleteMany: {
            args: Prisma.GroupDiscountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GroupDiscountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GroupDiscountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupDiscountPayload>
          }
          aggregate: {
            args: Prisma.GroupDiscountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGroupDiscount>
          }
          groupBy: {
            args: Prisma.GroupDiscountGroupByArgs<ExtArgs>
            result: $Utils.Optional<GroupDiscountGroupByOutputType>[]
          }
          count: {
            args: Prisma.GroupDiscountCountArgs<ExtArgs>
            result: $Utils.Optional<GroupDiscountCountAggregateOutputType> | number
          }
        }
      }
      TaxConfiguration: {
        payload: Prisma.$TaxConfigurationPayload<ExtArgs>
        fields: Prisma.TaxConfigurationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaxConfigurationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaxConfigurationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaxConfigurationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaxConfigurationPayload>
          }
          findFirst: {
            args: Prisma.TaxConfigurationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaxConfigurationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaxConfigurationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaxConfigurationPayload>
          }
          findMany: {
            args: Prisma.TaxConfigurationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaxConfigurationPayload>[]
          }
          create: {
            args: Prisma.TaxConfigurationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaxConfigurationPayload>
          }
          createMany: {
            args: Prisma.TaxConfigurationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaxConfigurationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaxConfigurationPayload>[]
          }
          delete: {
            args: Prisma.TaxConfigurationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaxConfigurationPayload>
          }
          update: {
            args: Prisma.TaxConfigurationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaxConfigurationPayload>
          }
          deleteMany: {
            args: Prisma.TaxConfigurationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaxConfigurationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TaxConfigurationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaxConfigurationPayload>
          }
          aggregate: {
            args: Prisma.TaxConfigurationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTaxConfiguration>
          }
          groupBy: {
            args: Prisma.TaxConfigurationGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaxConfigurationGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaxConfigurationCountArgs<ExtArgs>
            result: $Utils.Optional<TaxConfigurationCountAggregateOutputType> | number
          }
        }
      }
      GuestProfile: {
        payload: Prisma.$GuestProfilePayload<ExtArgs>
        fields: Prisma.GuestProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GuestProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GuestProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestProfilePayload>
          }
          findFirst: {
            args: Prisma.GuestProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GuestProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestProfilePayload>
          }
          findMany: {
            args: Prisma.GuestProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestProfilePayload>[]
          }
          create: {
            args: Prisma.GuestProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestProfilePayload>
          }
          createMany: {
            args: Prisma.GuestProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GuestProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestProfilePayload>[]
          }
          delete: {
            args: Prisma.GuestProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestProfilePayload>
          }
          update: {
            args: Prisma.GuestProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestProfilePayload>
          }
          deleteMany: {
            args: Prisma.GuestProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GuestProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GuestProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestProfilePayload>
          }
          aggregate: {
            args: Prisma.GuestProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGuestProfile>
          }
          groupBy: {
            args: Prisma.GuestProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<GuestProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.GuestProfileCountArgs<ExtArgs>
            result: $Utils.Optional<GuestProfileCountAggregateOutputType> | number
          }
        }
      }
      GuestActivityLog: {
        payload: Prisma.$GuestActivityLogPayload<ExtArgs>
        fields: Prisma.GuestActivityLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GuestActivityLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestActivityLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GuestActivityLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestActivityLogPayload>
          }
          findFirst: {
            args: Prisma.GuestActivityLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestActivityLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GuestActivityLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestActivityLogPayload>
          }
          findMany: {
            args: Prisma.GuestActivityLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestActivityLogPayload>[]
          }
          create: {
            args: Prisma.GuestActivityLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestActivityLogPayload>
          }
          createMany: {
            args: Prisma.GuestActivityLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GuestActivityLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestActivityLogPayload>[]
          }
          delete: {
            args: Prisma.GuestActivityLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestActivityLogPayload>
          }
          update: {
            args: Prisma.GuestActivityLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestActivityLogPayload>
          }
          deleteMany: {
            args: Prisma.GuestActivityLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GuestActivityLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GuestActivityLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestActivityLogPayload>
          }
          aggregate: {
            args: Prisma.GuestActivityLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGuestActivityLog>
          }
          groupBy: {
            args: Prisma.GuestActivityLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<GuestActivityLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.GuestActivityLogCountArgs<ExtArgs>
            result: $Utils.Optional<GuestActivityLogCountAggregateOutputType> | number
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
   * Count Type PropertyCountOutputType
   */

  export type PropertyCountOutputType = {
    roomTypes: number
    bookings: number
    inventory: number
    rates: number
    promotions: number
  }

  export type PropertyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roomTypes?: boolean | PropertyCountOutputTypeCountRoomTypesArgs
    bookings?: boolean | PropertyCountOutputTypeCountBookingsArgs
    inventory?: boolean | PropertyCountOutputTypeCountInventoryArgs
    rates?: boolean | PropertyCountOutputTypeCountRatesArgs
    promotions?: boolean | PropertyCountOutputTypeCountPromotionsArgs
  }

  // Custom InputTypes
  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyCountOutputType
     */
    select?: PropertyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeCountRoomTypesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoomTypeWhereInput
  }

  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeCountBookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
  }

  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeCountInventoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryRecordWhereInput
  }

  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeCountRatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RateRecordWhereInput
  }

  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeCountPromotionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PromotionWhereInput
  }


  /**
   * Count Type RoomTypeCountOutputType
   */

  export type RoomTypeCountOutputType = {
    bookings: number
    inventory: number
    rates: number
  }

  export type RoomTypeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookings?: boolean | RoomTypeCountOutputTypeCountBookingsArgs
    inventory?: boolean | RoomTypeCountOutputTypeCountInventoryArgs
    rates?: boolean | RoomTypeCountOutputTypeCountRatesArgs
  }

  // Custom InputTypes
  /**
   * RoomTypeCountOutputType without action
   */
  export type RoomTypeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomTypeCountOutputType
     */
    select?: RoomTypeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RoomTypeCountOutputType without action
   */
  export type RoomTypeCountOutputTypeCountBookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookedRoomWhereInput
  }

  /**
   * RoomTypeCountOutputType without action
   */
  export type RoomTypeCountOutputTypeCountInventoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryRecordWhereInput
  }

  /**
   * RoomTypeCountOutputType without action
   */
  export type RoomTypeCountOutputTypeCountRatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RateRecordWhereInput
  }


  /**
   * Count Type BookingCountOutputType
   */

  export type BookingCountOutputType = {
    bookedRooms: number
  }

  export type BookingCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookedRooms?: boolean | BookingCountOutputTypeCountBookedRoomsArgs
  }

  // Custom InputTypes
  /**
   * BookingCountOutputType without action
   */
  export type BookingCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingCountOutputType
     */
    select?: BookingCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BookingCountOutputType without action
   */
  export type BookingCountOutputTypeCountBookedRoomsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookedRoomWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Property
   */

  export type AggregateProperty = {
    _count: PropertyCountAggregateOutputType | null
    _avg: PropertyAvgAggregateOutputType | null
    _sum: PropertySumAggregateOutputType | null
    _min: PropertyMinAggregateOutputType | null
    _max: PropertyMaxAggregateOutputType | null
  }

  export type PropertyAvgAggregateOutputType = {
    starRating: number | null
  }

  export type PropertySumAggregateOutputType = {
    starRating: number | null
  }

  export type PropertyMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    category: string | null
    timezone: string | null
    starRating: number | null
    virtualTour: string | null
    ownerId: string | null
    chainId: string | null
    brandId: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PropertyMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    category: string | null
    timezone: string | null
    starRating: number | null
    virtualTour: string | null
    ownerId: string | null
    chainId: string | null
    brandId: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PropertyCountAggregateOutputType = {
    id: number
    name: number
    description: number
    category: number
    address: number
    coordinates: number
    timezone: number
    starRating: number
    amenities: number
    policies: number
    contactInfo: number
    images: number
    virtualTour: number
    ownerId: number
    chainId: number
    brandId: number
    status: number
    settings: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PropertyAvgAggregateInputType = {
    starRating?: true
  }

  export type PropertySumAggregateInputType = {
    starRating?: true
  }

  export type PropertyMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    category?: true
    timezone?: true
    starRating?: true
    virtualTour?: true
    ownerId?: true
    chainId?: true
    brandId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PropertyMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    category?: true
    timezone?: true
    starRating?: true
    virtualTour?: true
    ownerId?: true
    chainId?: true
    brandId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PropertyCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    category?: true
    address?: true
    coordinates?: true
    timezone?: true
    starRating?: true
    amenities?: true
    policies?: true
    contactInfo?: true
    images?: true
    virtualTour?: true
    ownerId?: true
    chainId?: true
    brandId?: true
    status?: true
    settings?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PropertyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Property to aggregate.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Properties
    **/
    _count?: true | PropertyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PropertyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PropertySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PropertyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PropertyMaxAggregateInputType
  }

  export type GetPropertyAggregateType<T extends PropertyAggregateArgs> = {
        [P in keyof T & keyof AggregateProperty]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProperty[P]>
      : GetScalarType<T[P], AggregateProperty[P]>
  }




  export type PropertyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropertyWhereInput
    orderBy?: PropertyOrderByWithAggregationInput | PropertyOrderByWithAggregationInput[]
    by: PropertyScalarFieldEnum[] | PropertyScalarFieldEnum
    having?: PropertyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PropertyCountAggregateInputType | true
    _avg?: PropertyAvgAggregateInputType
    _sum?: PropertySumAggregateInputType
    _min?: PropertyMinAggregateInputType
    _max?: PropertyMaxAggregateInputType
  }

  export type PropertyGroupByOutputType = {
    id: string
    name: string
    description: string
    category: string
    address: JsonValue
    coordinates: JsonValue
    timezone: string
    starRating: number | null
    amenities: JsonValue
    policies: JsonValue
    contactInfo: JsonValue
    images: JsonValue
    virtualTour: string | null
    ownerId: string
    chainId: string | null
    brandId: string | null
    status: string
    settings: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: PropertyCountAggregateOutputType | null
    _avg: PropertyAvgAggregateOutputType | null
    _sum: PropertySumAggregateOutputType | null
    _min: PropertyMinAggregateOutputType | null
    _max: PropertyMaxAggregateOutputType | null
  }

  type GetPropertyGroupByPayload<T extends PropertyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PropertyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PropertyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PropertyGroupByOutputType[P]>
            : GetScalarType<T[P], PropertyGroupByOutputType[P]>
        }
      >
    >


  export type PropertySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    address?: boolean
    coordinates?: boolean
    timezone?: boolean
    starRating?: boolean
    amenities?: boolean
    policies?: boolean
    contactInfo?: boolean
    images?: boolean
    virtualTour?: boolean
    ownerId?: boolean
    chainId?: boolean
    brandId?: boolean
    status?: boolean
    settings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    roomTypes?: boolean | Property$roomTypesArgs<ExtArgs>
    bookings?: boolean | Property$bookingsArgs<ExtArgs>
    inventory?: boolean | Property$inventoryArgs<ExtArgs>
    rates?: boolean | Property$ratesArgs<ExtArgs>
    promotions?: boolean | Property$promotionsArgs<ExtArgs>
    _count?: boolean | PropertyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["property"]>

  export type PropertySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    address?: boolean
    coordinates?: boolean
    timezone?: boolean
    starRating?: boolean
    amenities?: boolean
    policies?: boolean
    contactInfo?: boolean
    images?: boolean
    virtualTour?: boolean
    ownerId?: boolean
    chainId?: boolean
    brandId?: boolean
    status?: boolean
    settings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["property"]>

  export type PropertySelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    address?: boolean
    coordinates?: boolean
    timezone?: boolean
    starRating?: boolean
    amenities?: boolean
    policies?: boolean
    contactInfo?: boolean
    images?: boolean
    virtualTour?: boolean
    ownerId?: boolean
    chainId?: boolean
    brandId?: boolean
    status?: boolean
    settings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PropertyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roomTypes?: boolean | Property$roomTypesArgs<ExtArgs>
    bookings?: boolean | Property$bookingsArgs<ExtArgs>
    inventory?: boolean | Property$inventoryArgs<ExtArgs>
    rates?: boolean | Property$ratesArgs<ExtArgs>
    promotions?: boolean | Property$promotionsArgs<ExtArgs>
    _count?: boolean | PropertyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PropertyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PropertyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Property"
    objects: {
      roomTypes: Prisma.$RoomTypePayload<ExtArgs>[]
      bookings: Prisma.$BookingPayload<ExtArgs>[]
      inventory: Prisma.$InventoryRecordPayload<ExtArgs>[]
      rates: Prisma.$RateRecordPayload<ExtArgs>[]
      promotions: Prisma.$PromotionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string
      category: string
      address: Prisma.JsonValue
      coordinates: Prisma.JsonValue
      timezone: string
      starRating: number | null
      amenities: Prisma.JsonValue
      policies: Prisma.JsonValue
      contactInfo: Prisma.JsonValue
      images: Prisma.JsonValue
      virtualTour: string | null
      ownerId: string
      chainId: string | null
      brandId: string | null
      status: string
      settings: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["property"]>
    composites: {}
  }

  type PropertyGetPayload<S extends boolean | null | undefined | PropertyDefaultArgs> = $Result.GetResult<Prisma.$PropertyPayload, S>

  type PropertyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PropertyFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PropertyCountAggregateInputType | true
    }

  export interface PropertyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Property'], meta: { name: 'Property' } }
    /**
     * Find zero or one Property that matches the filter.
     * @param {PropertyFindUniqueArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PropertyFindUniqueArgs>(args: SelectSubset<T, PropertyFindUniqueArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Property that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PropertyFindUniqueOrThrowArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PropertyFindUniqueOrThrowArgs>(args: SelectSubset<T, PropertyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Property that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFindFirstArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PropertyFindFirstArgs>(args?: SelectSubset<T, PropertyFindFirstArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Property that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFindFirstOrThrowArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PropertyFindFirstOrThrowArgs>(args?: SelectSubset<T, PropertyFindFirstOrThrowArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Properties that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Properties
     * const properties = await prisma.property.findMany()
     * 
     * // Get first 10 Properties
     * const properties = await prisma.property.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const propertyWithIdOnly = await prisma.property.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PropertyFindManyArgs>(args?: SelectSubset<T, PropertyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Property.
     * @param {PropertyCreateArgs} args - Arguments to create a Property.
     * @example
     * // Create one Property
     * const Property = await prisma.property.create({
     *   data: {
     *     // ... data to create a Property
     *   }
     * })
     * 
     */
    create<T extends PropertyCreateArgs>(args: SelectSubset<T, PropertyCreateArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Properties.
     * @param {PropertyCreateManyArgs} args - Arguments to create many Properties.
     * @example
     * // Create many Properties
     * const property = await prisma.property.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PropertyCreateManyArgs>(args?: SelectSubset<T, PropertyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Properties and returns the data saved in the database.
     * @param {PropertyCreateManyAndReturnArgs} args - Arguments to create many Properties.
     * @example
     * // Create many Properties
     * const property = await prisma.property.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Properties and only return the `id`
     * const propertyWithIdOnly = await prisma.property.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PropertyCreateManyAndReturnArgs>(args?: SelectSubset<T, PropertyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Property.
     * @param {PropertyDeleteArgs} args - Arguments to delete one Property.
     * @example
     * // Delete one Property
     * const Property = await prisma.property.delete({
     *   where: {
     *     // ... filter to delete one Property
     *   }
     * })
     * 
     */
    delete<T extends PropertyDeleteArgs>(args: SelectSubset<T, PropertyDeleteArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Property.
     * @param {PropertyUpdateArgs} args - Arguments to update one Property.
     * @example
     * // Update one Property
     * const property = await prisma.property.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PropertyUpdateArgs>(args: SelectSubset<T, PropertyUpdateArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Properties.
     * @param {PropertyDeleteManyArgs} args - Arguments to filter Properties to delete.
     * @example
     * // Delete a few Properties
     * const { count } = await prisma.property.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PropertyDeleteManyArgs>(args?: SelectSubset<T, PropertyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Properties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Properties
     * const property = await prisma.property.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PropertyUpdateManyArgs>(args: SelectSubset<T, PropertyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Property.
     * @param {PropertyUpsertArgs} args - Arguments to update or create a Property.
     * @example
     * // Update or create a Property
     * const property = await prisma.property.upsert({
     *   create: {
     *     // ... data to create a Property
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Property we want to update
     *   }
     * })
     */
    upsert<T extends PropertyUpsertArgs>(args: SelectSubset<T, PropertyUpsertArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Properties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyCountArgs} args - Arguments to filter Properties to count.
     * @example
     * // Count the number of Properties
     * const count = await prisma.property.count({
     *   where: {
     *     // ... the filter for the Properties we want to count
     *   }
     * })
    **/
    count<T extends PropertyCountArgs>(
      args?: Subset<T, PropertyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PropertyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Property.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PropertyAggregateArgs>(args: Subset<T, PropertyAggregateArgs>): Prisma.PrismaPromise<GetPropertyAggregateType<T>>

    /**
     * Group by Property.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyGroupByArgs} args - Group by arguments.
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
      T extends PropertyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PropertyGroupByArgs['orderBy'] }
        : { orderBy?: PropertyGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PropertyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPropertyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Property model
   */
  readonly fields: PropertyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Property.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PropertyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    roomTypes<T extends Property$roomTypesArgs<ExtArgs> = {}>(args?: Subset<T, Property$roomTypesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomTypePayload<ExtArgs>, T, "findMany"> | Null>
    bookings<T extends Property$bookingsArgs<ExtArgs> = {}>(args?: Subset<T, Property$bookingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany"> | Null>
    inventory<T extends Property$inventoryArgs<ExtArgs> = {}>(args?: Subset<T, Property$inventoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryRecordPayload<ExtArgs>, T, "findMany"> | Null>
    rates<T extends Property$ratesArgs<ExtArgs> = {}>(args?: Subset<T, Property$ratesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RateRecordPayload<ExtArgs>, T, "findMany"> | Null>
    promotions<T extends Property$promotionsArgs<ExtArgs> = {}>(args?: Subset<T, Property$promotionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromotionPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Property model
   */ 
  interface PropertyFieldRefs {
    readonly id: FieldRef<"Property", 'String'>
    readonly name: FieldRef<"Property", 'String'>
    readonly description: FieldRef<"Property", 'String'>
    readonly category: FieldRef<"Property", 'String'>
    readonly address: FieldRef<"Property", 'Json'>
    readonly coordinates: FieldRef<"Property", 'Json'>
    readonly timezone: FieldRef<"Property", 'String'>
    readonly starRating: FieldRef<"Property", 'Int'>
    readonly amenities: FieldRef<"Property", 'Json'>
    readonly policies: FieldRef<"Property", 'Json'>
    readonly contactInfo: FieldRef<"Property", 'Json'>
    readonly images: FieldRef<"Property", 'Json'>
    readonly virtualTour: FieldRef<"Property", 'String'>
    readonly ownerId: FieldRef<"Property", 'String'>
    readonly chainId: FieldRef<"Property", 'String'>
    readonly brandId: FieldRef<"Property", 'String'>
    readonly status: FieldRef<"Property", 'String'>
    readonly settings: FieldRef<"Property", 'Json'>
    readonly createdAt: FieldRef<"Property", 'DateTime'>
    readonly updatedAt: FieldRef<"Property", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Property findUnique
   */
  export type PropertyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property findUniqueOrThrow
   */
  export type PropertyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property findFirst
   */
  export type PropertyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Properties.
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Properties.
     */
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Property findFirstOrThrow
   */
  export type PropertyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Properties.
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Properties.
     */
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Property findMany
   */
  export type PropertyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Properties to fetch.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Properties.
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Property create
   */
  export type PropertyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * The data needed to create a Property.
     */
    data: XOR<PropertyCreateInput, PropertyUncheckedCreateInput>
  }

  /**
   * Property createMany
   */
  export type PropertyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Properties.
     */
    data: PropertyCreateManyInput | PropertyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Property createManyAndReturn
   */
  export type PropertyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Properties.
     */
    data: PropertyCreateManyInput | PropertyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Property update
   */
  export type PropertyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * The data needed to update a Property.
     */
    data: XOR<PropertyUpdateInput, PropertyUncheckedUpdateInput>
    /**
     * Choose, which Property to update.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property updateMany
   */
  export type PropertyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Properties.
     */
    data: XOR<PropertyUpdateManyMutationInput, PropertyUncheckedUpdateManyInput>
    /**
     * Filter which Properties to update
     */
    where?: PropertyWhereInput
  }

  /**
   * Property upsert
   */
  export type PropertyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * The filter to search for the Property to update in case it exists.
     */
    where: PropertyWhereUniqueInput
    /**
     * In case the Property found by the `where` argument doesn't exist, create a new Property with this data.
     */
    create: XOR<PropertyCreateInput, PropertyUncheckedCreateInput>
    /**
     * In case the Property was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PropertyUpdateInput, PropertyUncheckedUpdateInput>
  }

  /**
   * Property delete
   */
  export type PropertyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter which Property to delete.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property deleteMany
   */
  export type PropertyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Properties to delete
     */
    where?: PropertyWhereInput
  }

  /**
   * Property.roomTypes
   */
  export type Property$roomTypesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomType
     */
    select?: RoomTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomTypeInclude<ExtArgs> | null
    where?: RoomTypeWhereInput
    orderBy?: RoomTypeOrderByWithRelationInput | RoomTypeOrderByWithRelationInput[]
    cursor?: RoomTypeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoomTypeScalarFieldEnum | RoomTypeScalarFieldEnum[]
  }

  /**
   * Property.bookings
   */
  export type Property$bookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    cursor?: BookingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Property.inventory
   */
  export type Property$inventoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryRecord
     */
    select?: InventoryRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryRecordInclude<ExtArgs> | null
    where?: InventoryRecordWhereInput
    orderBy?: InventoryRecordOrderByWithRelationInput | InventoryRecordOrderByWithRelationInput[]
    cursor?: InventoryRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InventoryRecordScalarFieldEnum | InventoryRecordScalarFieldEnum[]
  }

  /**
   * Property.rates
   */
  export type Property$ratesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateRecord
     */
    select?: RateRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RateRecordInclude<ExtArgs> | null
    where?: RateRecordWhereInput
    orderBy?: RateRecordOrderByWithRelationInput | RateRecordOrderByWithRelationInput[]
    cursor?: RateRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RateRecordScalarFieldEnum | RateRecordScalarFieldEnum[]
  }

  /**
   * Property.promotions
   */
  export type Property$promotionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
    where?: PromotionWhereInput
    orderBy?: PromotionOrderByWithRelationInput | PromotionOrderByWithRelationInput[]
    cursor?: PromotionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PromotionScalarFieldEnum | PromotionScalarFieldEnum[]
  }

  /**
   * Property without action
   */
  export type PropertyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
  }


  /**
   * Model RoomType
   */

  export type AggregateRoomType = {
    _count: RoomTypeCountAggregateOutputType | null
    _avg: RoomTypeAvgAggregateOutputType | null
    _sum: RoomTypeSumAggregateOutputType | null
    _min: RoomTypeMinAggregateOutputType | null
    _max: RoomTypeMaxAggregateOutputType | null
  }

  export type RoomTypeAvgAggregateOutputType = {
    maxOccupancy: number | null
    roomSize: number | null
    totalRooms: number | null
    baseRate: number | null
  }

  export type RoomTypeSumAggregateOutputType = {
    maxOccupancy: number | null
    roomSize: number | null
    totalRooms: number | null
    baseRate: number | null
  }

  export type RoomTypeMinAggregateOutputType = {
    id: string | null
    propertyId: string | null
    name: string | null
    description: string | null
    category: string | null
    maxOccupancy: number | null
    roomSize: number | null
    roomSizeUnit: string | null
    view: string | null
    floor: string | null
    totalRooms: number | null
    baseRate: number | null
    currency: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoomTypeMaxAggregateOutputType = {
    id: string | null
    propertyId: string | null
    name: string | null
    description: string | null
    category: string | null
    maxOccupancy: number | null
    roomSize: number | null
    roomSizeUnit: string | null
    view: string | null
    floor: string | null
    totalRooms: number | null
    baseRate: number | null
    currency: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoomTypeCountAggregateOutputType = {
    id: number
    propertyId: number
    name: number
    description: number
    category: number
    maxOccupancy: number
    bedConfiguration: number
    roomSize: number
    roomSizeUnit: number
    amenities: number
    view: number
    floor: number
    totalRooms: number
    baseRate: number
    currency: number
    images: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RoomTypeAvgAggregateInputType = {
    maxOccupancy?: true
    roomSize?: true
    totalRooms?: true
    baseRate?: true
  }

  export type RoomTypeSumAggregateInputType = {
    maxOccupancy?: true
    roomSize?: true
    totalRooms?: true
    baseRate?: true
  }

  export type RoomTypeMinAggregateInputType = {
    id?: true
    propertyId?: true
    name?: true
    description?: true
    category?: true
    maxOccupancy?: true
    roomSize?: true
    roomSizeUnit?: true
    view?: true
    floor?: true
    totalRooms?: true
    baseRate?: true
    currency?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoomTypeMaxAggregateInputType = {
    id?: true
    propertyId?: true
    name?: true
    description?: true
    category?: true
    maxOccupancy?: true
    roomSize?: true
    roomSizeUnit?: true
    view?: true
    floor?: true
    totalRooms?: true
    baseRate?: true
    currency?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoomTypeCountAggregateInputType = {
    id?: true
    propertyId?: true
    name?: true
    description?: true
    category?: true
    maxOccupancy?: true
    bedConfiguration?: true
    roomSize?: true
    roomSizeUnit?: true
    amenities?: true
    view?: true
    floor?: true
    totalRooms?: true
    baseRate?: true
    currency?: true
    images?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RoomTypeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoomType to aggregate.
     */
    where?: RoomTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoomTypes to fetch.
     */
    orderBy?: RoomTypeOrderByWithRelationInput | RoomTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoomTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoomTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoomTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RoomTypes
    **/
    _count?: true | RoomTypeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoomTypeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoomTypeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoomTypeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoomTypeMaxAggregateInputType
  }

  export type GetRoomTypeAggregateType<T extends RoomTypeAggregateArgs> = {
        [P in keyof T & keyof AggregateRoomType]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoomType[P]>
      : GetScalarType<T[P], AggregateRoomType[P]>
  }




  export type RoomTypeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoomTypeWhereInput
    orderBy?: RoomTypeOrderByWithAggregationInput | RoomTypeOrderByWithAggregationInput[]
    by: RoomTypeScalarFieldEnum[] | RoomTypeScalarFieldEnum
    having?: RoomTypeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoomTypeCountAggregateInputType | true
    _avg?: RoomTypeAvgAggregateInputType
    _sum?: RoomTypeSumAggregateInputType
    _min?: RoomTypeMinAggregateInputType
    _max?: RoomTypeMaxAggregateInputType
  }

  export type RoomTypeGroupByOutputType = {
    id: string
    propertyId: string
    name: string
    description: string
    category: string
    maxOccupancy: number
    bedConfiguration: JsonValue
    roomSize: number
    roomSizeUnit: string
    amenities: JsonValue
    view: string | null
    floor: string | null
    totalRooms: number
    baseRate: number
    currency: string
    images: JsonValue
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: RoomTypeCountAggregateOutputType | null
    _avg: RoomTypeAvgAggregateOutputType | null
    _sum: RoomTypeSumAggregateOutputType | null
    _min: RoomTypeMinAggregateOutputType | null
    _max: RoomTypeMaxAggregateOutputType | null
  }

  type GetRoomTypeGroupByPayload<T extends RoomTypeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoomTypeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoomTypeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoomTypeGroupByOutputType[P]>
            : GetScalarType<T[P], RoomTypeGroupByOutputType[P]>
        }
      >
    >


  export type RoomTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    maxOccupancy?: boolean
    bedConfiguration?: boolean
    roomSize?: boolean
    roomSizeUnit?: boolean
    amenities?: boolean
    view?: boolean
    floor?: boolean
    totalRooms?: boolean
    baseRate?: boolean
    currency?: boolean
    images?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    bookings?: boolean | RoomType$bookingsArgs<ExtArgs>
    inventory?: boolean | RoomType$inventoryArgs<ExtArgs>
    rates?: boolean | RoomType$ratesArgs<ExtArgs>
    _count?: boolean | RoomTypeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roomType"]>

  export type RoomTypeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    maxOccupancy?: boolean
    bedConfiguration?: boolean
    roomSize?: boolean
    roomSizeUnit?: boolean
    amenities?: boolean
    view?: boolean
    floor?: boolean
    totalRooms?: boolean
    baseRate?: boolean
    currency?: boolean
    images?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roomType"]>

  export type RoomTypeSelectScalar = {
    id?: boolean
    propertyId?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    maxOccupancy?: boolean
    bedConfiguration?: boolean
    roomSize?: boolean
    roomSizeUnit?: boolean
    amenities?: boolean
    view?: boolean
    floor?: boolean
    totalRooms?: boolean
    baseRate?: boolean
    currency?: boolean
    images?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RoomTypeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    bookings?: boolean | RoomType$bookingsArgs<ExtArgs>
    inventory?: boolean | RoomType$inventoryArgs<ExtArgs>
    rates?: boolean | RoomType$ratesArgs<ExtArgs>
    _count?: boolean | RoomTypeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RoomTypeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }

  export type $RoomTypePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RoomType"
    objects: {
      property: Prisma.$PropertyPayload<ExtArgs>
      bookings: Prisma.$BookedRoomPayload<ExtArgs>[]
      inventory: Prisma.$InventoryRecordPayload<ExtArgs>[]
      rates: Prisma.$RateRecordPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      propertyId: string
      name: string
      description: string
      category: string
      maxOccupancy: number
      bedConfiguration: Prisma.JsonValue
      roomSize: number
      roomSizeUnit: string
      amenities: Prisma.JsonValue
      view: string | null
      floor: string | null
      totalRooms: number
      baseRate: number
      currency: string
      images: Prisma.JsonValue
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["roomType"]>
    composites: {}
  }

  type RoomTypeGetPayload<S extends boolean | null | undefined | RoomTypeDefaultArgs> = $Result.GetResult<Prisma.$RoomTypePayload, S>

  type RoomTypeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RoomTypeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RoomTypeCountAggregateInputType | true
    }

  export interface RoomTypeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RoomType'], meta: { name: 'RoomType' } }
    /**
     * Find zero or one RoomType that matches the filter.
     * @param {RoomTypeFindUniqueArgs} args - Arguments to find a RoomType
     * @example
     * // Get one RoomType
     * const roomType = await prisma.roomType.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoomTypeFindUniqueArgs>(args: SelectSubset<T, RoomTypeFindUniqueArgs<ExtArgs>>): Prisma__RoomTypeClient<$Result.GetResult<Prisma.$RoomTypePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RoomType that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RoomTypeFindUniqueOrThrowArgs} args - Arguments to find a RoomType
     * @example
     * // Get one RoomType
     * const roomType = await prisma.roomType.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoomTypeFindUniqueOrThrowArgs>(args: SelectSubset<T, RoomTypeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoomTypeClient<$Result.GetResult<Prisma.$RoomTypePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RoomType that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomTypeFindFirstArgs} args - Arguments to find a RoomType
     * @example
     * // Get one RoomType
     * const roomType = await prisma.roomType.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoomTypeFindFirstArgs>(args?: SelectSubset<T, RoomTypeFindFirstArgs<ExtArgs>>): Prisma__RoomTypeClient<$Result.GetResult<Prisma.$RoomTypePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RoomType that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomTypeFindFirstOrThrowArgs} args - Arguments to find a RoomType
     * @example
     * // Get one RoomType
     * const roomType = await prisma.roomType.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoomTypeFindFirstOrThrowArgs>(args?: SelectSubset<T, RoomTypeFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoomTypeClient<$Result.GetResult<Prisma.$RoomTypePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RoomTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomTypeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RoomTypes
     * const roomTypes = await prisma.roomType.findMany()
     * 
     * // Get first 10 RoomTypes
     * const roomTypes = await prisma.roomType.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roomTypeWithIdOnly = await prisma.roomType.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoomTypeFindManyArgs>(args?: SelectSubset<T, RoomTypeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomTypePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RoomType.
     * @param {RoomTypeCreateArgs} args - Arguments to create a RoomType.
     * @example
     * // Create one RoomType
     * const RoomType = await prisma.roomType.create({
     *   data: {
     *     // ... data to create a RoomType
     *   }
     * })
     * 
     */
    create<T extends RoomTypeCreateArgs>(args: SelectSubset<T, RoomTypeCreateArgs<ExtArgs>>): Prisma__RoomTypeClient<$Result.GetResult<Prisma.$RoomTypePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RoomTypes.
     * @param {RoomTypeCreateManyArgs} args - Arguments to create many RoomTypes.
     * @example
     * // Create many RoomTypes
     * const roomType = await prisma.roomType.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoomTypeCreateManyArgs>(args?: SelectSubset<T, RoomTypeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RoomTypes and returns the data saved in the database.
     * @param {RoomTypeCreateManyAndReturnArgs} args - Arguments to create many RoomTypes.
     * @example
     * // Create many RoomTypes
     * const roomType = await prisma.roomType.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RoomTypes and only return the `id`
     * const roomTypeWithIdOnly = await prisma.roomType.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoomTypeCreateManyAndReturnArgs>(args?: SelectSubset<T, RoomTypeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomTypePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RoomType.
     * @param {RoomTypeDeleteArgs} args - Arguments to delete one RoomType.
     * @example
     * // Delete one RoomType
     * const RoomType = await prisma.roomType.delete({
     *   where: {
     *     // ... filter to delete one RoomType
     *   }
     * })
     * 
     */
    delete<T extends RoomTypeDeleteArgs>(args: SelectSubset<T, RoomTypeDeleteArgs<ExtArgs>>): Prisma__RoomTypeClient<$Result.GetResult<Prisma.$RoomTypePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RoomType.
     * @param {RoomTypeUpdateArgs} args - Arguments to update one RoomType.
     * @example
     * // Update one RoomType
     * const roomType = await prisma.roomType.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoomTypeUpdateArgs>(args: SelectSubset<T, RoomTypeUpdateArgs<ExtArgs>>): Prisma__RoomTypeClient<$Result.GetResult<Prisma.$RoomTypePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RoomTypes.
     * @param {RoomTypeDeleteManyArgs} args - Arguments to filter RoomTypes to delete.
     * @example
     * // Delete a few RoomTypes
     * const { count } = await prisma.roomType.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoomTypeDeleteManyArgs>(args?: SelectSubset<T, RoomTypeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoomTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomTypeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RoomTypes
     * const roomType = await prisma.roomType.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoomTypeUpdateManyArgs>(args: SelectSubset<T, RoomTypeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RoomType.
     * @param {RoomTypeUpsertArgs} args - Arguments to update or create a RoomType.
     * @example
     * // Update or create a RoomType
     * const roomType = await prisma.roomType.upsert({
     *   create: {
     *     // ... data to create a RoomType
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RoomType we want to update
     *   }
     * })
     */
    upsert<T extends RoomTypeUpsertArgs>(args: SelectSubset<T, RoomTypeUpsertArgs<ExtArgs>>): Prisma__RoomTypeClient<$Result.GetResult<Prisma.$RoomTypePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RoomTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomTypeCountArgs} args - Arguments to filter RoomTypes to count.
     * @example
     * // Count the number of RoomTypes
     * const count = await prisma.roomType.count({
     *   where: {
     *     // ... the filter for the RoomTypes we want to count
     *   }
     * })
    **/
    count<T extends RoomTypeCountArgs>(
      args?: Subset<T, RoomTypeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoomTypeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RoomType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomTypeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RoomTypeAggregateArgs>(args: Subset<T, RoomTypeAggregateArgs>): Prisma.PrismaPromise<GetRoomTypeAggregateType<T>>

    /**
     * Group by RoomType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomTypeGroupByArgs} args - Group by arguments.
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
      T extends RoomTypeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoomTypeGroupByArgs['orderBy'] }
        : { orderBy?: RoomTypeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RoomTypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoomTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RoomType model
   */
  readonly fields: RoomTypeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RoomType.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoomTypeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    property<T extends PropertyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PropertyDefaultArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    bookings<T extends RoomType$bookingsArgs<ExtArgs> = {}>(args?: Subset<T, RoomType$bookingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookedRoomPayload<ExtArgs>, T, "findMany"> | Null>
    inventory<T extends RoomType$inventoryArgs<ExtArgs> = {}>(args?: Subset<T, RoomType$inventoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryRecordPayload<ExtArgs>, T, "findMany"> | Null>
    rates<T extends RoomType$ratesArgs<ExtArgs> = {}>(args?: Subset<T, RoomType$ratesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RateRecordPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the RoomType model
   */ 
  interface RoomTypeFieldRefs {
    readonly id: FieldRef<"RoomType", 'String'>
    readonly propertyId: FieldRef<"RoomType", 'String'>
    readonly name: FieldRef<"RoomType", 'String'>
    readonly description: FieldRef<"RoomType", 'String'>
    readonly category: FieldRef<"RoomType", 'String'>
    readonly maxOccupancy: FieldRef<"RoomType", 'Int'>
    readonly bedConfiguration: FieldRef<"RoomType", 'Json'>
    readonly roomSize: FieldRef<"RoomType", 'Float'>
    readonly roomSizeUnit: FieldRef<"RoomType", 'String'>
    readonly amenities: FieldRef<"RoomType", 'Json'>
    readonly view: FieldRef<"RoomType", 'String'>
    readonly floor: FieldRef<"RoomType", 'String'>
    readonly totalRooms: FieldRef<"RoomType", 'Int'>
    readonly baseRate: FieldRef<"RoomType", 'Float'>
    readonly currency: FieldRef<"RoomType", 'String'>
    readonly images: FieldRef<"RoomType", 'Json'>
    readonly isActive: FieldRef<"RoomType", 'Boolean'>
    readonly createdAt: FieldRef<"RoomType", 'DateTime'>
    readonly updatedAt: FieldRef<"RoomType", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RoomType findUnique
   */
  export type RoomTypeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomType
     */
    select?: RoomTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomTypeInclude<ExtArgs> | null
    /**
     * Filter, which RoomType to fetch.
     */
    where: RoomTypeWhereUniqueInput
  }

  /**
   * RoomType findUniqueOrThrow
   */
  export type RoomTypeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomType
     */
    select?: RoomTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomTypeInclude<ExtArgs> | null
    /**
     * Filter, which RoomType to fetch.
     */
    where: RoomTypeWhereUniqueInput
  }

  /**
   * RoomType findFirst
   */
  export type RoomTypeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomType
     */
    select?: RoomTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomTypeInclude<ExtArgs> | null
    /**
     * Filter, which RoomType to fetch.
     */
    where?: RoomTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoomTypes to fetch.
     */
    orderBy?: RoomTypeOrderByWithRelationInput | RoomTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoomTypes.
     */
    cursor?: RoomTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoomTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoomTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoomTypes.
     */
    distinct?: RoomTypeScalarFieldEnum | RoomTypeScalarFieldEnum[]
  }

  /**
   * RoomType findFirstOrThrow
   */
  export type RoomTypeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomType
     */
    select?: RoomTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomTypeInclude<ExtArgs> | null
    /**
     * Filter, which RoomType to fetch.
     */
    where?: RoomTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoomTypes to fetch.
     */
    orderBy?: RoomTypeOrderByWithRelationInput | RoomTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoomTypes.
     */
    cursor?: RoomTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoomTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoomTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoomTypes.
     */
    distinct?: RoomTypeScalarFieldEnum | RoomTypeScalarFieldEnum[]
  }

  /**
   * RoomType findMany
   */
  export type RoomTypeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomType
     */
    select?: RoomTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomTypeInclude<ExtArgs> | null
    /**
     * Filter, which RoomTypes to fetch.
     */
    where?: RoomTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoomTypes to fetch.
     */
    orderBy?: RoomTypeOrderByWithRelationInput | RoomTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RoomTypes.
     */
    cursor?: RoomTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoomTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoomTypes.
     */
    skip?: number
    distinct?: RoomTypeScalarFieldEnum | RoomTypeScalarFieldEnum[]
  }

  /**
   * RoomType create
   */
  export type RoomTypeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomType
     */
    select?: RoomTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomTypeInclude<ExtArgs> | null
    /**
     * The data needed to create a RoomType.
     */
    data: XOR<RoomTypeCreateInput, RoomTypeUncheckedCreateInput>
  }

  /**
   * RoomType createMany
   */
  export type RoomTypeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RoomTypes.
     */
    data: RoomTypeCreateManyInput | RoomTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RoomType createManyAndReturn
   */
  export type RoomTypeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomType
     */
    select?: RoomTypeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RoomTypes.
     */
    data: RoomTypeCreateManyInput | RoomTypeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomTypeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoomType update
   */
  export type RoomTypeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomType
     */
    select?: RoomTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomTypeInclude<ExtArgs> | null
    /**
     * The data needed to update a RoomType.
     */
    data: XOR<RoomTypeUpdateInput, RoomTypeUncheckedUpdateInput>
    /**
     * Choose, which RoomType to update.
     */
    where: RoomTypeWhereUniqueInput
  }

  /**
   * RoomType updateMany
   */
  export type RoomTypeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RoomTypes.
     */
    data: XOR<RoomTypeUpdateManyMutationInput, RoomTypeUncheckedUpdateManyInput>
    /**
     * Filter which RoomTypes to update
     */
    where?: RoomTypeWhereInput
  }

  /**
   * RoomType upsert
   */
  export type RoomTypeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomType
     */
    select?: RoomTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomTypeInclude<ExtArgs> | null
    /**
     * The filter to search for the RoomType to update in case it exists.
     */
    where: RoomTypeWhereUniqueInput
    /**
     * In case the RoomType found by the `where` argument doesn't exist, create a new RoomType with this data.
     */
    create: XOR<RoomTypeCreateInput, RoomTypeUncheckedCreateInput>
    /**
     * In case the RoomType was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoomTypeUpdateInput, RoomTypeUncheckedUpdateInput>
  }

  /**
   * RoomType delete
   */
  export type RoomTypeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomType
     */
    select?: RoomTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomTypeInclude<ExtArgs> | null
    /**
     * Filter which RoomType to delete.
     */
    where: RoomTypeWhereUniqueInput
  }

  /**
   * RoomType deleteMany
   */
  export type RoomTypeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoomTypes to delete
     */
    where?: RoomTypeWhereInput
  }

  /**
   * RoomType.bookings
   */
  export type RoomType$bookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookedRoom
     */
    select?: BookedRoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookedRoomInclude<ExtArgs> | null
    where?: BookedRoomWhereInput
    orderBy?: BookedRoomOrderByWithRelationInput | BookedRoomOrderByWithRelationInput[]
    cursor?: BookedRoomWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookedRoomScalarFieldEnum | BookedRoomScalarFieldEnum[]
  }

  /**
   * RoomType.inventory
   */
  export type RoomType$inventoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryRecord
     */
    select?: InventoryRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryRecordInclude<ExtArgs> | null
    where?: InventoryRecordWhereInput
    orderBy?: InventoryRecordOrderByWithRelationInput | InventoryRecordOrderByWithRelationInput[]
    cursor?: InventoryRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InventoryRecordScalarFieldEnum | InventoryRecordScalarFieldEnum[]
  }

  /**
   * RoomType.rates
   */
  export type RoomType$ratesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateRecord
     */
    select?: RateRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RateRecordInclude<ExtArgs> | null
    where?: RateRecordWhereInput
    orderBy?: RateRecordOrderByWithRelationInput | RateRecordOrderByWithRelationInput[]
    cursor?: RateRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RateRecordScalarFieldEnum | RateRecordScalarFieldEnum[]
  }

  /**
   * RoomType without action
   */
  export type RoomTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomType
     */
    select?: RoomTypeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomTypeInclude<ExtArgs> | null
  }


  /**
   * Model Booking
   */

  export type AggregateBooking = {
    _count: BookingCountAggregateOutputType | null
    _avg: BookingAvgAggregateOutputType | null
    _sum: BookingSumAggregateOutputType | null
    _min: BookingMinAggregateOutputType | null
    _max: BookingMaxAggregateOutputType | null
  }

  export type BookingAvgAggregateOutputType = {
    nights: number | null
    totalAmount: number | null
  }

  export type BookingSumAggregateOutputType = {
    nights: number | null
    totalAmount: number | null
  }

  export type BookingMinAggregateOutputType = {
    id: string | null
    confirmationNumber: string | null
    propertyId: string | null
    guestId: string | null
    checkInDate: Date | null
    checkOutDate: Date | null
    nights: number | null
    totalAmount: number | null
    currency: string | null
    status: string | null
    bookingSource: string | null
    specialRequests: string | null
    paymentStatus: string | null
    paymentMethod: string | null
    cancellationPolicy: string | null
    noShowPolicy: string | null
    bookedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BookingMaxAggregateOutputType = {
    id: string | null
    confirmationNumber: string | null
    propertyId: string | null
    guestId: string | null
    checkInDate: Date | null
    checkOutDate: Date | null
    nights: number | null
    totalAmount: number | null
    currency: string | null
    status: string | null
    bookingSource: string | null
    specialRequests: string | null
    paymentStatus: string | null
    paymentMethod: string | null
    cancellationPolicy: string | null
    noShowPolicy: string | null
    bookedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BookingCountAggregateOutputType = {
    id: number
    confirmationNumber: number
    propertyId: number
    guestId: number
    primaryGuest: number
    additionalGuests: number
    checkInDate: number
    checkOutDate: number
    nights: number
    rooms: number
    pricing: number
    totalAmount: number
    currency: number
    status: number
    bookingSource: number
    specialRequests: number
    preferences: number
    paymentStatus: number
    paymentMethod: number
    cancellationPolicy: number
    noShowPolicy: number
    bookedAt: number
    createdAt: number
    updatedAt: number
    metadata: number
    _all: number
  }


  export type BookingAvgAggregateInputType = {
    nights?: true
    totalAmount?: true
  }

  export type BookingSumAggregateInputType = {
    nights?: true
    totalAmount?: true
  }

  export type BookingMinAggregateInputType = {
    id?: true
    confirmationNumber?: true
    propertyId?: true
    guestId?: true
    checkInDate?: true
    checkOutDate?: true
    nights?: true
    totalAmount?: true
    currency?: true
    status?: true
    bookingSource?: true
    specialRequests?: true
    paymentStatus?: true
    paymentMethod?: true
    cancellationPolicy?: true
    noShowPolicy?: true
    bookedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BookingMaxAggregateInputType = {
    id?: true
    confirmationNumber?: true
    propertyId?: true
    guestId?: true
    checkInDate?: true
    checkOutDate?: true
    nights?: true
    totalAmount?: true
    currency?: true
    status?: true
    bookingSource?: true
    specialRequests?: true
    paymentStatus?: true
    paymentMethod?: true
    cancellationPolicy?: true
    noShowPolicy?: true
    bookedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BookingCountAggregateInputType = {
    id?: true
    confirmationNumber?: true
    propertyId?: true
    guestId?: true
    primaryGuest?: true
    additionalGuests?: true
    checkInDate?: true
    checkOutDate?: true
    nights?: true
    rooms?: true
    pricing?: true
    totalAmount?: true
    currency?: true
    status?: true
    bookingSource?: true
    specialRequests?: true
    preferences?: true
    paymentStatus?: true
    paymentMethod?: true
    cancellationPolicy?: true
    noShowPolicy?: true
    bookedAt?: true
    createdAt?: true
    updatedAt?: true
    metadata?: true
    _all?: true
  }

  export type BookingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Booking to aggregate.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Bookings
    **/
    _count?: true | BookingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookingMaxAggregateInputType
  }

  export type GetBookingAggregateType<T extends BookingAggregateArgs> = {
        [P in keyof T & keyof AggregateBooking]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBooking[P]>
      : GetScalarType<T[P], AggregateBooking[P]>
  }




  export type BookingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithAggregationInput | BookingOrderByWithAggregationInput[]
    by: BookingScalarFieldEnum[] | BookingScalarFieldEnum
    having?: BookingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookingCountAggregateInputType | true
    _avg?: BookingAvgAggregateInputType
    _sum?: BookingSumAggregateInputType
    _min?: BookingMinAggregateInputType
    _max?: BookingMaxAggregateInputType
  }

  export type BookingGroupByOutputType = {
    id: string
    confirmationNumber: string
    propertyId: string
    guestId: string
    primaryGuest: JsonValue
    additionalGuests: JsonValue
    checkInDate: Date
    checkOutDate: Date
    nights: number
    rooms: JsonValue
    pricing: JsonValue
    totalAmount: number
    currency: string
    status: string
    bookingSource: string
    specialRequests: string | null
    preferences: JsonValue
    paymentStatus: string
    paymentMethod: string | null
    cancellationPolicy: string
    noShowPolicy: string
    bookedAt: Date
    createdAt: Date
    updatedAt: Date
    metadata: JsonValue | null
    _count: BookingCountAggregateOutputType | null
    _avg: BookingAvgAggregateOutputType | null
    _sum: BookingSumAggregateOutputType | null
    _min: BookingMinAggregateOutputType | null
    _max: BookingMaxAggregateOutputType | null
  }

  type GetBookingGroupByPayload<T extends BookingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookingGroupByOutputType[P]>
            : GetScalarType<T[P], BookingGroupByOutputType[P]>
        }
      >
    >


  export type BookingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    confirmationNumber?: boolean
    propertyId?: boolean
    guestId?: boolean
    primaryGuest?: boolean
    additionalGuests?: boolean
    checkInDate?: boolean
    checkOutDate?: boolean
    nights?: boolean
    rooms?: boolean
    pricing?: boolean
    totalAmount?: boolean
    currency?: boolean
    status?: boolean
    bookingSource?: boolean
    specialRequests?: boolean
    preferences?: boolean
    paymentStatus?: boolean
    paymentMethod?: boolean
    cancellationPolicy?: boolean
    noShowPolicy?: boolean
    bookedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    metadata?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    bookedRooms?: boolean | Booking$bookedRoomsArgs<ExtArgs>
    _count?: boolean | BookingCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    confirmationNumber?: boolean
    propertyId?: boolean
    guestId?: boolean
    primaryGuest?: boolean
    additionalGuests?: boolean
    checkInDate?: boolean
    checkOutDate?: boolean
    nights?: boolean
    rooms?: boolean
    pricing?: boolean
    totalAmount?: boolean
    currency?: boolean
    status?: boolean
    bookingSource?: boolean
    specialRequests?: boolean
    preferences?: boolean
    paymentStatus?: boolean
    paymentMethod?: boolean
    cancellationPolicy?: boolean
    noShowPolicy?: boolean
    bookedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    metadata?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectScalar = {
    id?: boolean
    confirmationNumber?: boolean
    propertyId?: boolean
    guestId?: boolean
    primaryGuest?: boolean
    additionalGuests?: boolean
    checkInDate?: boolean
    checkOutDate?: boolean
    nights?: boolean
    rooms?: boolean
    pricing?: boolean
    totalAmount?: boolean
    currency?: boolean
    status?: boolean
    bookingSource?: boolean
    specialRequests?: boolean
    preferences?: boolean
    paymentStatus?: boolean
    paymentMethod?: boolean
    cancellationPolicy?: boolean
    noShowPolicy?: boolean
    bookedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    metadata?: boolean
  }

  export type BookingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    bookedRooms?: boolean | Booking$bookedRoomsArgs<ExtArgs>
    _count?: boolean | BookingCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BookingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }

  export type $BookingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Booking"
    objects: {
      property: Prisma.$PropertyPayload<ExtArgs>
      bookedRooms: Prisma.$BookedRoomPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      confirmationNumber: string
      propertyId: string
      guestId: string
      primaryGuest: Prisma.JsonValue
      additionalGuests: Prisma.JsonValue
      checkInDate: Date
      checkOutDate: Date
      nights: number
      rooms: Prisma.JsonValue
      pricing: Prisma.JsonValue
      totalAmount: number
      currency: string
      status: string
      bookingSource: string
      specialRequests: string | null
      preferences: Prisma.JsonValue
      paymentStatus: string
      paymentMethod: string | null
      cancellationPolicy: string
      noShowPolicy: string
      bookedAt: Date
      createdAt: Date
      updatedAt: Date
      metadata: Prisma.JsonValue | null
    }, ExtArgs["result"]["booking"]>
    composites: {}
  }

  type BookingGetPayload<S extends boolean | null | undefined | BookingDefaultArgs> = $Result.GetResult<Prisma.$BookingPayload, S>

  type BookingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BookingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BookingCountAggregateInputType | true
    }

  export interface BookingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Booking'], meta: { name: 'Booking' } }
    /**
     * Find zero or one Booking that matches the filter.
     * @param {BookingFindUniqueArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookingFindUniqueArgs>(args: SelectSubset<T, BookingFindUniqueArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Booking that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BookingFindUniqueOrThrowArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookingFindUniqueOrThrowArgs>(args: SelectSubset<T, BookingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Booking that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindFirstArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookingFindFirstArgs>(args?: SelectSubset<T, BookingFindFirstArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Booking that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindFirstOrThrowArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookingFindFirstOrThrowArgs>(args?: SelectSubset<T, BookingFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Bookings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bookings
     * const bookings = await prisma.booking.findMany()
     * 
     * // Get first 10 Bookings
     * const bookings = await prisma.booking.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookingWithIdOnly = await prisma.booking.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookingFindManyArgs>(args?: SelectSubset<T, BookingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Booking.
     * @param {BookingCreateArgs} args - Arguments to create a Booking.
     * @example
     * // Create one Booking
     * const Booking = await prisma.booking.create({
     *   data: {
     *     // ... data to create a Booking
     *   }
     * })
     * 
     */
    create<T extends BookingCreateArgs>(args: SelectSubset<T, BookingCreateArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Bookings.
     * @param {BookingCreateManyArgs} args - Arguments to create many Bookings.
     * @example
     * // Create many Bookings
     * const booking = await prisma.booking.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookingCreateManyArgs>(args?: SelectSubset<T, BookingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Bookings and returns the data saved in the database.
     * @param {BookingCreateManyAndReturnArgs} args - Arguments to create many Bookings.
     * @example
     * // Create many Bookings
     * const booking = await prisma.booking.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Bookings and only return the `id`
     * const bookingWithIdOnly = await prisma.booking.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookingCreateManyAndReturnArgs>(args?: SelectSubset<T, BookingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Booking.
     * @param {BookingDeleteArgs} args - Arguments to delete one Booking.
     * @example
     * // Delete one Booking
     * const Booking = await prisma.booking.delete({
     *   where: {
     *     // ... filter to delete one Booking
     *   }
     * })
     * 
     */
    delete<T extends BookingDeleteArgs>(args: SelectSubset<T, BookingDeleteArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Booking.
     * @param {BookingUpdateArgs} args - Arguments to update one Booking.
     * @example
     * // Update one Booking
     * const booking = await prisma.booking.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookingUpdateArgs>(args: SelectSubset<T, BookingUpdateArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Bookings.
     * @param {BookingDeleteManyArgs} args - Arguments to filter Bookings to delete.
     * @example
     * // Delete a few Bookings
     * const { count } = await prisma.booking.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookingDeleteManyArgs>(args?: SelectSubset<T, BookingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bookings
     * const booking = await prisma.booking.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookingUpdateManyArgs>(args: SelectSubset<T, BookingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Booking.
     * @param {BookingUpsertArgs} args - Arguments to update or create a Booking.
     * @example
     * // Update or create a Booking
     * const booking = await prisma.booking.upsert({
     *   create: {
     *     // ... data to create a Booking
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Booking we want to update
     *   }
     * })
     */
    upsert<T extends BookingUpsertArgs>(args: SelectSubset<T, BookingUpsertArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Bookings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingCountArgs} args - Arguments to filter Bookings to count.
     * @example
     * // Count the number of Bookings
     * const count = await prisma.booking.count({
     *   where: {
     *     // ... the filter for the Bookings we want to count
     *   }
     * })
    **/
    count<T extends BookingCountArgs>(
      args?: Subset<T, BookingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Booking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BookingAggregateArgs>(args: Subset<T, BookingAggregateArgs>): Prisma.PrismaPromise<GetBookingAggregateType<T>>

    /**
     * Group by Booking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingGroupByArgs} args - Group by arguments.
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
      T extends BookingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookingGroupByArgs['orderBy'] }
        : { orderBy?: BookingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BookingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Booking model
   */
  readonly fields: BookingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Booking.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    property<T extends PropertyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PropertyDefaultArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    bookedRooms<T extends Booking$bookedRoomsArgs<ExtArgs> = {}>(args?: Subset<T, Booking$bookedRoomsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookedRoomPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Booking model
   */ 
  interface BookingFieldRefs {
    readonly id: FieldRef<"Booking", 'String'>
    readonly confirmationNumber: FieldRef<"Booking", 'String'>
    readonly propertyId: FieldRef<"Booking", 'String'>
    readonly guestId: FieldRef<"Booking", 'String'>
    readonly primaryGuest: FieldRef<"Booking", 'Json'>
    readonly additionalGuests: FieldRef<"Booking", 'Json'>
    readonly checkInDate: FieldRef<"Booking", 'DateTime'>
    readonly checkOutDate: FieldRef<"Booking", 'DateTime'>
    readonly nights: FieldRef<"Booking", 'Int'>
    readonly rooms: FieldRef<"Booking", 'Json'>
    readonly pricing: FieldRef<"Booking", 'Json'>
    readonly totalAmount: FieldRef<"Booking", 'Float'>
    readonly currency: FieldRef<"Booking", 'String'>
    readonly status: FieldRef<"Booking", 'String'>
    readonly bookingSource: FieldRef<"Booking", 'String'>
    readonly specialRequests: FieldRef<"Booking", 'String'>
    readonly preferences: FieldRef<"Booking", 'Json'>
    readonly paymentStatus: FieldRef<"Booking", 'String'>
    readonly paymentMethod: FieldRef<"Booking", 'String'>
    readonly cancellationPolicy: FieldRef<"Booking", 'String'>
    readonly noShowPolicy: FieldRef<"Booking", 'String'>
    readonly bookedAt: FieldRef<"Booking", 'DateTime'>
    readonly createdAt: FieldRef<"Booking", 'DateTime'>
    readonly updatedAt: FieldRef<"Booking", 'DateTime'>
    readonly metadata: FieldRef<"Booking", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * Booking findUnique
   */
  export type BookingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking findUniqueOrThrow
   */
  export type BookingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking findFirst
   */
  export type BookingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookings.
     */
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking findFirstOrThrow
   */
  export type BookingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookings.
     */
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking findMany
   */
  export type BookingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Bookings to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking create
   */
  export type BookingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The data needed to create a Booking.
     */
    data: XOR<BookingCreateInput, BookingUncheckedCreateInput>
  }

  /**
   * Booking createMany
   */
  export type BookingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Bookings.
     */
    data: BookingCreateManyInput | BookingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Booking createManyAndReturn
   */
  export type BookingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Bookings.
     */
    data: BookingCreateManyInput | BookingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Booking update
   */
  export type BookingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The data needed to update a Booking.
     */
    data: XOR<BookingUpdateInput, BookingUncheckedUpdateInput>
    /**
     * Choose, which Booking to update.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking updateMany
   */
  export type BookingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Bookings.
     */
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyInput>
    /**
     * Filter which Bookings to update
     */
    where?: BookingWhereInput
  }

  /**
   * Booking upsert
   */
  export type BookingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The filter to search for the Booking to update in case it exists.
     */
    where: BookingWhereUniqueInput
    /**
     * In case the Booking found by the `where` argument doesn't exist, create a new Booking with this data.
     */
    create: XOR<BookingCreateInput, BookingUncheckedCreateInput>
    /**
     * In case the Booking was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookingUpdateInput, BookingUncheckedUpdateInput>
  }

  /**
   * Booking delete
   */
  export type BookingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter which Booking to delete.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking deleteMany
   */
  export type BookingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bookings to delete
     */
    where?: BookingWhereInput
  }

  /**
   * Booking.bookedRooms
   */
  export type Booking$bookedRoomsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookedRoom
     */
    select?: BookedRoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookedRoomInclude<ExtArgs> | null
    where?: BookedRoomWhereInput
    orderBy?: BookedRoomOrderByWithRelationInput | BookedRoomOrderByWithRelationInput[]
    cursor?: BookedRoomWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookedRoomScalarFieldEnum | BookedRoomScalarFieldEnum[]
  }

  /**
   * Booking without action
   */
  export type BookingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
  }


  /**
   * Model BookedRoom
   */

  export type AggregateBookedRoom = {
    _count: BookedRoomCountAggregateOutputType | null
    _avg: BookedRoomAvgAggregateOutputType | null
    _sum: BookedRoomSumAggregateOutputType | null
    _min: BookedRoomMinAggregateOutputType | null
    _max: BookedRoomMaxAggregateOutputType | null
  }

  export type BookedRoomAvgAggregateOutputType = {
    quantity: number | null
    guestCount: number | null
    rate: number | null
    totalPrice: number | null
  }

  export type BookedRoomSumAggregateOutputType = {
    quantity: number | null
    guestCount: number | null
    rate: number | null
    totalPrice: number | null
  }

  export type BookedRoomMinAggregateOutputType = {
    id: string | null
    bookingId: string | null
    roomTypeId: string | null
    roomNumber: string | null
    quantity: number | null
    guestCount: number | null
    rate: number | null
    totalPrice: number | null
  }

  export type BookedRoomMaxAggregateOutputType = {
    id: string | null
    bookingId: string | null
    roomTypeId: string | null
    roomNumber: string | null
    quantity: number | null
    guestCount: number | null
    rate: number | null
    totalPrice: number | null
  }

  export type BookedRoomCountAggregateOutputType = {
    id: number
    bookingId: number
    roomTypeId: number
    roomNumber: number
    quantity: number
    guestCount: number
    rate: number
    totalPrice: number
    guests: number
    _all: number
  }


  export type BookedRoomAvgAggregateInputType = {
    quantity?: true
    guestCount?: true
    rate?: true
    totalPrice?: true
  }

  export type BookedRoomSumAggregateInputType = {
    quantity?: true
    guestCount?: true
    rate?: true
    totalPrice?: true
  }

  export type BookedRoomMinAggregateInputType = {
    id?: true
    bookingId?: true
    roomTypeId?: true
    roomNumber?: true
    quantity?: true
    guestCount?: true
    rate?: true
    totalPrice?: true
  }

  export type BookedRoomMaxAggregateInputType = {
    id?: true
    bookingId?: true
    roomTypeId?: true
    roomNumber?: true
    quantity?: true
    guestCount?: true
    rate?: true
    totalPrice?: true
  }

  export type BookedRoomCountAggregateInputType = {
    id?: true
    bookingId?: true
    roomTypeId?: true
    roomNumber?: true
    quantity?: true
    guestCount?: true
    rate?: true
    totalPrice?: true
    guests?: true
    _all?: true
  }

  export type BookedRoomAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookedRoom to aggregate.
     */
    where?: BookedRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookedRooms to fetch.
     */
    orderBy?: BookedRoomOrderByWithRelationInput | BookedRoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookedRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookedRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookedRooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BookedRooms
    **/
    _count?: true | BookedRoomCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookedRoomAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookedRoomSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookedRoomMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookedRoomMaxAggregateInputType
  }

  export type GetBookedRoomAggregateType<T extends BookedRoomAggregateArgs> = {
        [P in keyof T & keyof AggregateBookedRoom]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBookedRoom[P]>
      : GetScalarType<T[P], AggregateBookedRoom[P]>
  }




  export type BookedRoomGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookedRoomWhereInput
    orderBy?: BookedRoomOrderByWithAggregationInput | BookedRoomOrderByWithAggregationInput[]
    by: BookedRoomScalarFieldEnum[] | BookedRoomScalarFieldEnum
    having?: BookedRoomScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookedRoomCountAggregateInputType | true
    _avg?: BookedRoomAvgAggregateInputType
    _sum?: BookedRoomSumAggregateInputType
    _min?: BookedRoomMinAggregateInputType
    _max?: BookedRoomMaxAggregateInputType
  }

  export type BookedRoomGroupByOutputType = {
    id: string
    bookingId: string
    roomTypeId: string
    roomNumber: string | null
    quantity: number
    guestCount: number
    rate: number
    totalPrice: number
    guests: JsonValue
    _count: BookedRoomCountAggregateOutputType | null
    _avg: BookedRoomAvgAggregateOutputType | null
    _sum: BookedRoomSumAggregateOutputType | null
    _min: BookedRoomMinAggregateOutputType | null
    _max: BookedRoomMaxAggregateOutputType | null
  }

  type GetBookedRoomGroupByPayload<T extends BookedRoomGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookedRoomGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookedRoomGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookedRoomGroupByOutputType[P]>
            : GetScalarType<T[P], BookedRoomGroupByOutputType[P]>
        }
      >
    >


  export type BookedRoomSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookingId?: boolean
    roomTypeId?: boolean
    roomNumber?: boolean
    quantity?: boolean
    guestCount?: boolean
    rate?: boolean
    totalPrice?: boolean
    guests?: boolean
    booking?: boolean | BookingDefaultArgs<ExtArgs>
    roomType?: boolean | RoomTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookedRoom"]>

  export type BookedRoomSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookingId?: boolean
    roomTypeId?: boolean
    roomNumber?: boolean
    quantity?: boolean
    guestCount?: boolean
    rate?: boolean
    totalPrice?: boolean
    guests?: boolean
    booking?: boolean | BookingDefaultArgs<ExtArgs>
    roomType?: boolean | RoomTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookedRoom"]>

  export type BookedRoomSelectScalar = {
    id?: boolean
    bookingId?: boolean
    roomTypeId?: boolean
    roomNumber?: boolean
    quantity?: boolean
    guestCount?: boolean
    rate?: boolean
    totalPrice?: boolean
    guests?: boolean
  }

  export type BookedRoomInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    booking?: boolean | BookingDefaultArgs<ExtArgs>
    roomType?: boolean | RoomTypeDefaultArgs<ExtArgs>
  }
  export type BookedRoomIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    booking?: boolean | BookingDefaultArgs<ExtArgs>
    roomType?: boolean | RoomTypeDefaultArgs<ExtArgs>
  }

  export type $BookedRoomPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BookedRoom"
    objects: {
      booking: Prisma.$BookingPayload<ExtArgs>
      roomType: Prisma.$RoomTypePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      bookingId: string
      roomTypeId: string
      roomNumber: string | null
      quantity: number
      guestCount: number
      rate: number
      totalPrice: number
      guests: Prisma.JsonValue
    }, ExtArgs["result"]["bookedRoom"]>
    composites: {}
  }

  type BookedRoomGetPayload<S extends boolean | null | undefined | BookedRoomDefaultArgs> = $Result.GetResult<Prisma.$BookedRoomPayload, S>

  type BookedRoomCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BookedRoomFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BookedRoomCountAggregateInputType | true
    }

  export interface BookedRoomDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BookedRoom'], meta: { name: 'BookedRoom' } }
    /**
     * Find zero or one BookedRoom that matches the filter.
     * @param {BookedRoomFindUniqueArgs} args - Arguments to find a BookedRoom
     * @example
     * // Get one BookedRoom
     * const bookedRoom = await prisma.bookedRoom.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookedRoomFindUniqueArgs>(args: SelectSubset<T, BookedRoomFindUniqueArgs<ExtArgs>>): Prisma__BookedRoomClient<$Result.GetResult<Prisma.$BookedRoomPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BookedRoom that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BookedRoomFindUniqueOrThrowArgs} args - Arguments to find a BookedRoom
     * @example
     * // Get one BookedRoom
     * const bookedRoom = await prisma.bookedRoom.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookedRoomFindUniqueOrThrowArgs>(args: SelectSubset<T, BookedRoomFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookedRoomClient<$Result.GetResult<Prisma.$BookedRoomPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BookedRoom that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookedRoomFindFirstArgs} args - Arguments to find a BookedRoom
     * @example
     * // Get one BookedRoom
     * const bookedRoom = await prisma.bookedRoom.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookedRoomFindFirstArgs>(args?: SelectSubset<T, BookedRoomFindFirstArgs<ExtArgs>>): Prisma__BookedRoomClient<$Result.GetResult<Prisma.$BookedRoomPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BookedRoom that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookedRoomFindFirstOrThrowArgs} args - Arguments to find a BookedRoom
     * @example
     * // Get one BookedRoom
     * const bookedRoom = await prisma.bookedRoom.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookedRoomFindFirstOrThrowArgs>(args?: SelectSubset<T, BookedRoomFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookedRoomClient<$Result.GetResult<Prisma.$BookedRoomPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BookedRooms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookedRoomFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BookedRooms
     * const bookedRooms = await prisma.bookedRoom.findMany()
     * 
     * // Get first 10 BookedRooms
     * const bookedRooms = await prisma.bookedRoom.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookedRoomWithIdOnly = await prisma.bookedRoom.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookedRoomFindManyArgs>(args?: SelectSubset<T, BookedRoomFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookedRoomPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BookedRoom.
     * @param {BookedRoomCreateArgs} args - Arguments to create a BookedRoom.
     * @example
     * // Create one BookedRoom
     * const BookedRoom = await prisma.bookedRoom.create({
     *   data: {
     *     // ... data to create a BookedRoom
     *   }
     * })
     * 
     */
    create<T extends BookedRoomCreateArgs>(args: SelectSubset<T, BookedRoomCreateArgs<ExtArgs>>): Prisma__BookedRoomClient<$Result.GetResult<Prisma.$BookedRoomPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BookedRooms.
     * @param {BookedRoomCreateManyArgs} args - Arguments to create many BookedRooms.
     * @example
     * // Create many BookedRooms
     * const bookedRoom = await prisma.bookedRoom.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookedRoomCreateManyArgs>(args?: SelectSubset<T, BookedRoomCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BookedRooms and returns the data saved in the database.
     * @param {BookedRoomCreateManyAndReturnArgs} args - Arguments to create many BookedRooms.
     * @example
     * // Create many BookedRooms
     * const bookedRoom = await prisma.bookedRoom.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BookedRooms and only return the `id`
     * const bookedRoomWithIdOnly = await prisma.bookedRoom.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookedRoomCreateManyAndReturnArgs>(args?: SelectSubset<T, BookedRoomCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookedRoomPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BookedRoom.
     * @param {BookedRoomDeleteArgs} args - Arguments to delete one BookedRoom.
     * @example
     * // Delete one BookedRoom
     * const BookedRoom = await prisma.bookedRoom.delete({
     *   where: {
     *     // ... filter to delete one BookedRoom
     *   }
     * })
     * 
     */
    delete<T extends BookedRoomDeleteArgs>(args: SelectSubset<T, BookedRoomDeleteArgs<ExtArgs>>): Prisma__BookedRoomClient<$Result.GetResult<Prisma.$BookedRoomPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BookedRoom.
     * @param {BookedRoomUpdateArgs} args - Arguments to update one BookedRoom.
     * @example
     * // Update one BookedRoom
     * const bookedRoom = await prisma.bookedRoom.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookedRoomUpdateArgs>(args: SelectSubset<T, BookedRoomUpdateArgs<ExtArgs>>): Prisma__BookedRoomClient<$Result.GetResult<Prisma.$BookedRoomPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BookedRooms.
     * @param {BookedRoomDeleteManyArgs} args - Arguments to filter BookedRooms to delete.
     * @example
     * // Delete a few BookedRooms
     * const { count } = await prisma.bookedRoom.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookedRoomDeleteManyArgs>(args?: SelectSubset<T, BookedRoomDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BookedRooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookedRoomUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BookedRooms
     * const bookedRoom = await prisma.bookedRoom.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookedRoomUpdateManyArgs>(args: SelectSubset<T, BookedRoomUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BookedRoom.
     * @param {BookedRoomUpsertArgs} args - Arguments to update or create a BookedRoom.
     * @example
     * // Update or create a BookedRoom
     * const bookedRoom = await prisma.bookedRoom.upsert({
     *   create: {
     *     // ... data to create a BookedRoom
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BookedRoom we want to update
     *   }
     * })
     */
    upsert<T extends BookedRoomUpsertArgs>(args: SelectSubset<T, BookedRoomUpsertArgs<ExtArgs>>): Prisma__BookedRoomClient<$Result.GetResult<Prisma.$BookedRoomPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BookedRooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookedRoomCountArgs} args - Arguments to filter BookedRooms to count.
     * @example
     * // Count the number of BookedRooms
     * const count = await prisma.bookedRoom.count({
     *   where: {
     *     // ... the filter for the BookedRooms we want to count
     *   }
     * })
    **/
    count<T extends BookedRoomCountArgs>(
      args?: Subset<T, BookedRoomCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookedRoomCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BookedRoom.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookedRoomAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BookedRoomAggregateArgs>(args: Subset<T, BookedRoomAggregateArgs>): Prisma.PrismaPromise<GetBookedRoomAggregateType<T>>

    /**
     * Group by BookedRoom.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookedRoomGroupByArgs} args - Group by arguments.
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
      T extends BookedRoomGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookedRoomGroupByArgs['orderBy'] }
        : { orderBy?: BookedRoomGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BookedRoomGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookedRoomGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BookedRoom model
   */
  readonly fields: BookedRoomFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BookedRoom.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookedRoomClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    booking<T extends BookingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BookingDefaultArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    roomType<T extends RoomTypeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoomTypeDefaultArgs<ExtArgs>>): Prisma__RoomTypeClient<$Result.GetResult<Prisma.$RoomTypePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the BookedRoom model
   */ 
  interface BookedRoomFieldRefs {
    readonly id: FieldRef<"BookedRoom", 'String'>
    readonly bookingId: FieldRef<"BookedRoom", 'String'>
    readonly roomTypeId: FieldRef<"BookedRoom", 'String'>
    readonly roomNumber: FieldRef<"BookedRoom", 'String'>
    readonly quantity: FieldRef<"BookedRoom", 'Int'>
    readonly guestCount: FieldRef<"BookedRoom", 'Int'>
    readonly rate: FieldRef<"BookedRoom", 'Float'>
    readonly totalPrice: FieldRef<"BookedRoom", 'Float'>
    readonly guests: FieldRef<"BookedRoom", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * BookedRoom findUnique
   */
  export type BookedRoomFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookedRoom
     */
    select?: BookedRoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookedRoomInclude<ExtArgs> | null
    /**
     * Filter, which BookedRoom to fetch.
     */
    where: BookedRoomWhereUniqueInput
  }

  /**
   * BookedRoom findUniqueOrThrow
   */
  export type BookedRoomFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookedRoom
     */
    select?: BookedRoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookedRoomInclude<ExtArgs> | null
    /**
     * Filter, which BookedRoom to fetch.
     */
    where: BookedRoomWhereUniqueInput
  }

  /**
   * BookedRoom findFirst
   */
  export type BookedRoomFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookedRoom
     */
    select?: BookedRoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookedRoomInclude<ExtArgs> | null
    /**
     * Filter, which BookedRoom to fetch.
     */
    where?: BookedRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookedRooms to fetch.
     */
    orderBy?: BookedRoomOrderByWithRelationInput | BookedRoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookedRooms.
     */
    cursor?: BookedRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookedRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookedRooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookedRooms.
     */
    distinct?: BookedRoomScalarFieldEnum | BookedRoomScalarFieldEnum[]
  }

  /**
   * BookedRoom findFirstOrThrow
   */
  export type BookedRoomFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookedRoom
     */
    select?: BookedRoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookedRoomInclude<ExtArgs> | null
    /**
     * Filter, which BookedRoom to fetch.
     */
    where?: BookedRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookedRooms to fetch.
     */
    orderBy?: BookedRoomOrderByWithRelationInput | BookedRoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookedRooms.
     */
    cursor?: BookedRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookedRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookedRooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookedRooms.
     */
    distinct?: BookedRoomScalarFieldEnum | BookedRoomScalarFieldEnum[]
  }

  /**
   * BookedRoom findMany
   */
  export type BookedRoomFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookedRoom
     */
    select?: BookedRoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookedRoomInclude<ExtArgs> | null
    /**
     * Filter, which BookedRooms to fetch.
     */
    where?: BookedRoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookedRooms to fetch.
     */
    orderBy?: BookedRoomOrderByWithRelationInput | BookedRoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BookedRooms.
     */
    cursor?: BookedRoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookedRooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookedRooms.
     */
    skip?: number
    distinct?: BookedRoomScalarFieldEnum | BookedRoomScalarFieldEnum[]
  }

  /**
   * BookedRoom create
   */
  export type BookedRoomCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookedRoom
     */
    select?: BookedRoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookedRoomInclude<ExtArgs> | null
    /**
     * The data needed to create a BookedRoom.
     */
    data: XOR<BookedRoomCreateInput, BookedRoomUncheckedCreateInput>
  }

  /**
   * BookedRoom createMany
   */
  export type BookedRoomCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BookedRooms.
     */
    data: BookedRoomCreateManyInput | BookedRoomCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BookedRoom createManyAndReturn
   */
  export type BookedRoomCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookedRoom
     */
    select?: BookedRoomSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BookedRooms.
     */
    data: BookedRoomCreateManyInput | BookedRoomCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookedRoomIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BookedRoom update
   */
  export type BookedRoomUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookedRoom
     */
    select?: BookedRoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookedRoomInclude<ExtArgs> | null
    /**
     * The data needed to update a BookedRoom.
     */
    data: XOR<BookedRoomUpdateInput, BookedRoomUncheckedUpdateInput>
    /**
     * Choose, which BookedRoom to update.
     */
    where: BookedRoomWhereUniqueInput
  }

  /**
   * BookedRoom updateMany
   */
  export type BookedRoomUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BookedRooms.
     */
    data: XOR<BookedRoomUpdateManyMutationInput, BookedRoomUncheckedUpdateManyInput>
    /**
     * Filter which BookedRooms to update
     */
    where?: BookedRoomWhereInput
  }

  /**
   * BookedRoom upsert
   */
  export type BookedRoomUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookedRoom
     */
    select?: BookedRoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookedRoomInclude<ExtArgs> | null
    /**
     * The filter to search for the BookedRoom to update in case it exists.
     */
    where: BookedRoomWhereUniqueInput
    /**
     * In case the BookedRoom found by the `where` argument doesn't exist, create a new BookedRoom with this data.
     */
    create: XOR<BookedRoomCreateInput, BookedRoomUncheckedCreateInput>
    /**
     * In case the BookedRoom was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookedRoomUpdateInput, BookedRoomUncheckedUpdateInput>
  }

  /**
   * BookedRoom delete
   */
  export type BookedRoomDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookedRoom
     */
    select?: BookedRoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookedRoomInclude<ExtArgs> | null
    /**
     * Filter which BookedRoom to delete.
     */
    where: BookedRoomWhereUniqueInput
  }

  /**
   * BookedRoom deleteMany
   */
  export type BookedRoomDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookedRooms to delete
     */
    where?: BookedRoomWhereInput
  }

  /**
   * BookedRoom without action
   */
  export type BookedRoomDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookedRoom
     */
    select?: BookedRoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookedRoomInclude<ExtArgs> | null
  }


  /**
   * Model InventoryRecord
   */

  export type AggregateInventoryRecord = {
    _count: InventoryRecordCountAggregateOutputType | null
    _avg: InventoryRecordAvgAggregateOutputType | null
    _sum: InventoryRecordSumAggregateOutputType | null
    _min: InventoryRecordMinAggregateOutputType | null
    _max: InventoryRecordMaxAggregateOutputType | null
  }

  export type InventoryRecordAvgAggregateOutputType = {
    totalRooms: number | null
    availableRooms: number | null
    reservedRooms: number | null
    blockedRooms: number | null
    overbookingLimit: number | null
    minimumStay: number | null
    maximumStay: number | null
  }

  export type InventoryRecordSumAggregateOutputType = {
    totalRooms: number | null
    availableRooms: number | null
    reservedRooms: number | null
    blockedRooms: number | null
    overbookingLimit: number | null
    minimumStay: number | null
    maximumStay: number | null
  }

  export type InventoryRecordMinAggregateOutputType = {
    id: string | null
    propertyId: string | null
    roomTypeId: string | null
    date: Date | null
    totalRooms: number | null
    availableRooms: number | null
    reservedRooms: number | null
    blockedRooms: number | null
    overbookingLimit: number | null
    minimumStay: number | null
    maximumStay: number | null
    closedToArrival: boolean | null
    closedToDeparture: boolean | null
    stopSell: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InventoryRecordMaxAggregateOutputType = {
    id: string | null
    propertyId: string | null
    roomTypeId: string | null
    date: Date | null
    totalRooms: number | null
    availableRooms: number | null
    reservedRooms: number | null
    blockedRooms: number | null
    overbookingLimit: number | null
    minimumStay: number | null
    maximumStay: number | null
    closedToArrival: boolean | null
    closedToDeparture: boolean | null
    stopSell: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InventoryRecordCountAggregateOutputType = {
    id: number
    propertyId: number
    roomTypeId: number
    date: number
    totalRooms: number
    availableRooms: number
    reservedRooms: number
    blockedRooms: number
    overbookingLimit: number
    minimumStay: number
    maximumStay: number
    closedToArrival: number
    closedToDeparture: number
    stopSell: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InventoryRecordAvgAggregateInputType = {
    totalRooms?: true
    availableRooms?: true
    reservedRooms?: true
    blockedRooms?: true
    overbookingLimit?: true
    minimumStay?: true
    maximumStay?: true
  }

  export type InventoryRecordSumAggregateInputType = {
    totalRooms?: true
    availableRooms?: true
    reservedRooms?: true
    blockedRooms?: true
    overbookingLimit?: true
    minimumStay?: true
    maximumStay?: true
  }

  export type InventoryRecordMinAggregateInputType = {
    id?: true
    propertyId?: true
    roomTypeId?: true
    date?: true
    totalRooms?: true
    availableRooms?: true
    reservedRooms?: true
    blockedRooms?: true
    overbookingLimit?: true
    minimumStay?: true
    maximumStay?: true
    closedToArrival?: true
    closedToDeparture?: true
    stopSell?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InventoryRecordMaxAggregateInputType = {
    id?: true
    propertyId?: true
    roomTypeId?: true
    date?: true
    totalRooms?: true
    availableRooms?: true
    reservedRooms?: true
    blockedRooms?: true
    overbookingLimit?: true
    minimumStay?: true
    maximumStay?: true
    closedToArrival?: true
    closedToDeparture?: true
    stopSell?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InventoryRecordCountAggregateInputType = {
    id?: true
    propertyId?: true
    roomTypeId?: true
    date?: true
    totalRooms?: true
    availableRooms?: true
    reservedRooms?: true
    blockedRooms?: true
    overbookingLimit?: true
    minimumStay?: true
    maximumStay?: true
    closedToArrival?: true
    closedToDeparture?: true
    stopSell?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InventoryRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryRecord to aggregate.
     */
    where?: InventoryRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryRecords to fetch.
     */
    orderBy?: InventoryRecordOrderByWithRelationInput | InventoryRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InventoryRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InventoryRecords
    **/
    _count?: true | InventoryRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InventoryRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InventoryRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventoryRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventoryRecordMaxAggregateInputType
  }

  export type GetInventoryRecordAggregateType<T extends InventoryRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateInventoryRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventoryRecord[P]>
      : GetScalarType<T[P], AggregateInventoryRecord[P]>
  }




  export type InventoryRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryRecordWhereInput
    orderBy?: InventoryRecordOrderByWithAggregationInput | InventoryRecordOrderByWithAggregationInput[]
    by: InventoryRecordScalarFieldEnum[] | InventoryRecordScalarFieldEnum
    having?: InventoryRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventoryRecordCountAggregateInputType | true
    _avg?: InventoryRecordAvgAggregateInputType
    _sum?: InventoryRecordSumAggregateInputType
    _min?: InventoryRecordMinAggregateInputType
    _max?: InventoryRecordMaxAggregateInputType
  }

  export type InventoryRecordGroupByOutputType = {
    id: string
    propertyId: string
    roomTypeId: string
    date: Date
    totalRooms: number
    availableRooms: number
    reservedRooms: number
    blockedRooms: number
    overbookingLimit: number
    minimumStay: number | null
    maximumStay: number | null
    closedToArrival: boolean
    closedToDeparture: boolean
    stopSell: boolean
    createdAt: Date
    updatedAt: Date
    _count: InventoryRecordCountAggregateOutputType | null
    _avg: InventoryRecordAvgAggregateOutputType | null
    _sum: InventoryRecordSumAggregateOutputType | null
    _min: InventoryRecordMinAggregateOutputType | null
    _max: InventoryRecordMaxAggregateOutputType | null
  }

  type GetInventoryRecordGroupByPayload<T extends InventoryRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventoryRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventoryRecordGroupByOutputType[P]>
            : GetScalarType<T[P], InventoryRecordGroupByOutputType[P]>
        }
      >
    >


  export type InventoryRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    roomTypeId?: boolean
    date?: boolean
    totalRooms?: boolean
    availableRooms?: boolean
    reservedRooms?: boolean
    blockedRooms?: boolean
    overbookingLimit?: boolean
    minimumStay?: boolean
    maximumStay?: boolean
    closedToArrival?: boolean
    closedToDeparture?: boolean
    stopSell?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    roomType?: boolean | RoomTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryRecord"]>

  export type InventoryRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    roomTypeId?: boolean
    date?: boolean
    totalRooms?: boolean
    availableRooms?: boolean
    reservedRooms?: boolean
    blockedRooms?: boolean
    overbookingLimit?: boolean
    minimumStay?: boolean
    maximumStay?: boolean
    closedToArrival?: boolean
    closedToDeparture?: boolean
    stopSell?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    roomType?: boolean | RoomTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventoryRecord"]>

  export type InventoryRecordSelectScalar = {
    id?: boolean
    propertyId?: boolean
    roomTypeId?: boolean
    date?: boolean
    totalRooms?: boolean
    availableRooms?: boolean
    reservedRooms?: boolean
    blockedRooms?: boolean
    overbookingLimit?: boolean
    minimumStay?: boolean
    maximumStay?: boolean
    closedToArrival?: boolean
    closedToDeparture?: boolean
    stopSell?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InventoryRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    roomType?: boolean | RoomTypeDefaultArgs<ExtArgs>
  }
  export type InventoryRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    roomType?: boolean | RoomTypeDefaultArgs<ExtArgs>
  }

  export type $InventoryRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InventoryRecord"
    objects: {
      property: Prisma.$PropertyPayload<ExtArgs>
      roomType: Prisma.$RoomTypePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      propertyId: string
      roomTypeId: string
      date: Date
      totalRooms: number
      availableRooms: number
      reservedRooms: number
      blockedRooms: number
      overbookingLimit: number
      minimumStay: number | null
      maximumStay: number | null
      closedToArrival: boolean
      closedToDeparture: boolean
      stopSell: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["inventoryRecord"]>
    composites: {}
  }

  type InventoryRecordGetPayload<S extends boolean | null | undefined | InventoryRecordDefaultArgs> = $Result.GetResult<Prisma.$InventoryRecordPayload, S>

  type InventoryRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InventoryRecordFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InventoryRecordCountAggregateInputType | true
    }

  export interface InventoryRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InventoryRecord'], meta: { name: 'InventoryRecord' } }
    /**
     * Find zero or one InventoryRecord that matches the filter.
     * @param {InventoryRecordFindUniqueArgs} args - Arguments to find a InventoryRecord
     * @example
     * // Get one InventoryRecord
     * const inventoryRecord = await prisma.inventoryRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryRecordFindUniqueArgs>(args: SelectSubset<T, InventoryRecordFindUniqueArgs<ExtArgs>>): Prisma__InventoryRecordClient<$Result.GetResult<Prisma.$InventoryRecordPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one InventoryRecord that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InventoryRecordFindUniqueOrThrowArgs} args - Arguments to find a InventoryRecord
     * @example
     * // Get one InventoryRecord
     * const inventoryRecord = await prisma.inventoryRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, InventoryRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InventoryRecordClient<$Result.GetResult<Prisma.$InventoryRecordPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first InventoryRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryRecordFindFirstArgs} args - Arguments to find a InventoryRecord
     * @example
     * // Get one InventoryRecord
     * const inventoryRecord = await prisma.inventoryRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryRecordFindFirstArgs>(args?: SelectSubset<T, InventoryRecordFindFirstArgs<ExtArgs>>): Prisma__InventoryRecordClient<$Result.GetResult<Prisma.$InventoryRecordPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first InventoryRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryRecordFindFirstOrThrowArgs} args - Arguments to find a InventoryRecord
     * @example
     * // Get one InventoryRecord
     * const inventoryRecord = await prisma.inventoryRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, InventoryRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__InventoryRecordClient<$Result.GetResult<Prisma.$InventoryRecordPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more InventoryRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InventoryRecords
     * const inventoryRecords = await prisma.inventoryRecord.findMany()
     * 
     * // Get first 10 InventoryRecords
     * const inventoryRecords = await prisma.inventoryRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventoryRecordWithIdOnly = await prisma.inventoryRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InventoryRecordFindManyArgs>(args?: SelectSubset<T, InventoryRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryRecordPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a InventoryRecord.
     * @param {InventoryRecordCreateArgs} args - Arguments to create a InventoryRecord.
     * @example
     * // Create one InventoryRecord
     * const InventoryRecord = await prisma.inventoryRecord.create({
     *   data: {
     *     // ... data to create a InventoryRecord
     *   }
     * })
     * 
     */
    create<T extends InventoryRecordCreateArgs>(args: SelectSubset<T, InventoryRecordCreateArgs<ExtArgs>>): Prisma__InventoryRecordClient<$Result.GetResult<Prisma.$InventoryRecordPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many InventoryRecords.
     * @param {InventoryRecordCreateManyArgs} args - Arguments to create many InventoryRecords.
     * @example
     * // Create many InventoryRecords
     * const inventoryRecord = await prisma.inventoryRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InventoryRecordCreateManyArgs>(args?: SelectSubset<T, InventoryRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InventoryRecords and returns the data saved in the database.
     * @param {InventoryRecordCreateManyAndReturnArgs} args - Arguments to create many InventoryRecords.
     * @example
     * // Create many InventoryRecords
     * const inventoryRecord = await prisma.inventoryRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InventoryRecords and only return the `id`
     * const inventoryRecordWithIdOnly = await prisma.inventoryRecord.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InventoryRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, InventoryRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryRecordPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a InventoryRecord.
     * @param {InventoryRecordDeleteArgs} args - Arguments to delete one InventoryRecord.
     * @example
     * // Delete one InventoryRecord
     * const InventoryRecord = await prisma.inventoryRecord.delete({
     *   where: {
     *     // ... filter to delete one InventoryRecord
     *   }
     * })
     * 
     */
    delete<T extends InventoryRecordDeleteArgs>(args: SelectSubset<T, InventoryRecordDeleteArgs<ExtArgs>>): Prisma__InventoryRecordClient<$Result.GetResult<Prisma.$InventoryRecordPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one InventoryRecord.
     * @param {InventoryRecordUpdateArgs} args - Arguments to update one InventoryRecord.
     * @example
     * // Update one InventoryRecord
     * const inventoryRecord = await prisma.inventoryRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InventoryRecordUpdateArgs>(args: SelectSubset<T, InventoryRecordUpdateArgs<ExtArgs>>): Prisma__InventoryRecordClient<$Result.GetResult<Prisma.$InventoryRecordPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more InventoryRecords.
     * @param {InventoryRecordDeleteManyArgs} args - Arguments to filter InventoryRecords to delete.
     * @example
     * // Delete a few InventoryRecords
     * const { count } = await prisma.inventoryRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InventoryRecordDeleteManyArgs>(args?: SelectSubset<T, InventoryRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InventoryRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InventoryRecords
     * const inventoryRecord = await prisma.inventoryRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InventoryRecordUpdateManyArgs>(args: SelectSubset<T, InventoryRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InventoryRecord.
     * @param {InventoryRecordUpsertArgs} args - Arguments to update or create a InventoryRecord.
     * @example
     * // Update or create a InventoryRecord
     * const inventoryRecord = await prisma.inventoryRecord.upsert({
     *   create: {
     *     // ... data to create a InventoryRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InventoryRecord we want to update
     *   }
     * })
     */
    upsert<T extends InventoryRecordUpsertArgs>(args: SelectSubset<T, InventoryRecordUpsertArgs<ExtArgs>>): Prisma__InventoryRecordClient<$Result.GetResult<Prisma.$InventoryRecordPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of InventoryRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryRecordCountArgs} args - Arguments to filter InventoryRecords to count.
     * @example
     * // Count the number of InventoryRecords
     * const count = await prisma.inventoryRecord.count({
     *   where: {
     *     // ... the filter for the InventoryRecords we want to count
     *   }
     * })
    **/
    count<T extends InventoryRecordCountArgs>(
      args?: Subset<T, InventoryRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventoryRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InventoryRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InventoryRecordAggregateArgs>(args: Subset<T, InventoryRecordAggregateArgs>): Prisma.PrismaPromise<GetInventoryRecordAggregateType<T>>

    /**
     * Group by InventoryRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryRecordGroupByArgs} args - Group by arguments.
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
      T extends InventoryRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InventoryRecordGroupByArgs['orderBy'] }
        : { orderBy?: InventoryRecordGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InventoryRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InventoryRecord model
   */
  readonly fields: InventoryRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InventoryRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InventoryRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    property<T extends PropertyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PropertyDefaultArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    roomType<T extends RoomTypeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoomTypeDefaultArgs<ExtArgs>>): Prisma__RoomTypeClient<$Result.GetResult<Prisma.$RoomTypePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the InventoryRecord model
   */ 
  interface InventoryRecordFieldRefs {
    readonly id: FieldRef<"InventoryRecord", 'String'>
    readonly propertyId: FieldRef<"InventoryRecord", 'String'>
    readonly roomTypeId: FieldRef<"InventoryRecord", 'String'>
    readonly date: FieldRef<"InventoryRecord", 'DateTime'>
    readonly totalRooms: FieldRef<"InventoryRecord", 'Int'>
    readonly availableRooms: FieldRef<"InventoryRecord", 'Int'>
    readonly reservedRooms: FieldRef<"InventoryRecord", 'Int'>
    readonly blockedRooms: FieldRef<"InventoryRecord", 'Int'>
    readonly overbookingLimit: FieldRef<"InventoryRecord", 'Int'>
    readonly minimumStay: FieldRef<"InventoryRecord", 'Int'>
    readonly maximumStay: FieldRef<"InventoryRecord", 'Int'>
    readonly closedToArrival: FieldRef<"InventoryRecord", 'Boolean'>
    readonly closedToDeparture: FieldRef<"InventoryRecord", 'Boolean'>
    readonly stopSell: FieldRef<"InventoryRecord", 'Boolean'>
    readonly createdAt: FieldRef<"InventoryRecord", 'DateTime'>
    readonly updatedAt: FieldRef<"InventoryRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InventoryRecord findUnique
   */
  export type InventoryRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryRecord
     */
    select?: InventoryRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryRecordInclude<ExtArgs> | null
    /**
     * Filter, which InventoryRecord to fetch.
     */
    where: InventoryRecordWhereUniqueInput
  }

  /**
   * InventoryRecord findUniqueOrThrow
   */
  export type InventoryRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryRecord
     */
    select?: InventoryRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryRecordInclude<ExtArgs> | null
    /**
     * Filter, which InventoryRecord to fetch.
     */
    where: InventoryRecordWhereUniqueInput
  }

  /**
   * InventoryRecord findFirst
   */
  export type InventoryRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryRecord
     */
    select?: InventoryRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryRecordInclude<ExtArgs> | null
    /**
     * Filter, which InventoryRecord to fetch.
     */
    where?: InventoryRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryRecords to fetch.
     */
    orderBy?: InventoryRecordOrderByWithRelationInput | InventoryRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryRecords.
     */
    cursor?: InventoryRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryRecords.
     */
    distinct?: InventoryRecordScalarFieldEnum | InventoryRecordScalarFieldEnum[]
  }

  /**
   * InventoryRecord findFirstOrThrow
   */
  export type InventoryRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryRecord
     */
    select?: InventoryRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryRecordInclude<ExtArgs> | null
    /**
     * Filter, which InventoryRecord to fetch.
     */
    where?: InventoryRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryRecords to fetch.
     */
    orderBy?: InventoryRecordOrderByWithRelationInput | InventoryRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryRecords.
     */
    cursor?: InventoryRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryRecords.
     */
    distinct?: InventoryRecordScalarFieldEnum | InventoryRecordScalarFieldEnum[]
  }

  /**
   * InventoryRecord findMany
   */
  export type InventoryRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryRecord
     */
    select?: InventoryRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryRecordInclude<ExtArgs> | null
    /**
     * Filter, which InventoryRecords to fetch.
     */
    where?: InventoryRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryRecords to fetch.
     */
    orderBy?: InventoryRecordOrderByWithRelationInput | InventoryRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InventoryRecords.
     */
    cursor?: InventoryRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryRecords.
     */
    skip?: number
    distinct?: InventoryRecordScalarFieldEnum | InventoryRecordScalarFieldEnum[]
  }

  /**
   * InventoryRecord create
   */
  export type InventoryRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryRecord
     */
    select?: InventoryRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a InventoryRecord.
     */
    data: XOR<InventoryRecordCreateInput, InventoryRecordUncheckedCreateInput>
  }

  /**
   * InventoryRecord createMany
   */
  export type InventoryRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InventoryRecords.
     */
    data: InventoryRecordCreateManyInput | InventoryRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InventoryRecord createManyAndReturn
   */
  export type InventoryRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryRecord
     */
    select?: InventoryRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many InventoryRecords.
     */
    data: InventoryRecordCreateManyInput | InventoryRecordCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InventoryRecord update
   */
  export type InventoryRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryRecord
     */
    select?: InventoryRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a InventoryRecord.
     */
    data: XOR<InventoryRecordUpdateInput, InventoryRecordUncheckedUpdateInput>
    /**
     * Choose, which InventoryRecord to update.
     */
    where: InventoryRecordWhereUniqueInput
  }

  /**
   * InventoryRecord updateMany
   */
  export type InventoryRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InventoryRecords.
     */
    data: XOR<InventoryRecordUpdateManyMutationInput, InventoryRecordUncheckedUpdateManyInput>
    /**
     * Filter which InventoryRecords to update
     */
    where?: InventoryRecordWhereInput
  }

  /**
   * InventoryRecord upsert
   */
  export type InventoryRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryRecord
     */
    select?: InventoryRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the InventoryRecord to update in case it exists.
     */
    where: InventoryRecordWhereUniqueInput
    /**
     * In case the InventoryRecord found by the `where` argument doesn't exist, create a new InventoryRecord with this data.
     */
    create: XOR<InventoryRecordCreateInput, InventoryRecordUncheckedCreateInput>
    /**
     * In case the InventoryRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InventoryRecordUpdateInput, InventoryRecordUncheckedUpdateInput>
  }

  /**
   * InventoryRecord delete
   */
  export type InventoryRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryRecord
     */
    select?: InventoryRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryRecordInclude<ExtArgs> | null
    /**
     * Filter which InventoryRecord to delete.
     */
    where: InventoryRecordWhereUniqueInput
  }

  /**
   * InventoryRecord deleteMany
   */
  export type InventoryRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryRecords to delete
     */
    where?: InventoryRecordWhereInput
  }

  /**
   * InventoryRecord without action
   */
  export type InventoryRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryRecord
     */
    select?: InventoryRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryRecordInclude<ExtArgs> | null
  }


  /**
   * Model InventoryReservation
   */

  export type AggregateInventoryReservation = {
    _count: InventoryReservationCountAggregateOutputType | null
    _avg: InventoryReservationAvgAggregateOutputType | null
    _sum: InventoryReservationSumAggregateOutputType | null
    _min: InventoryReservationMinAggregateOutputType | null
    _max: InventoryReservationMaxAggregateOutputType | null
  }

  export type InventoryReservationAvgAggregateOutputType = {
    roomQuantity: number | null
  }

  export type InventoryReservationSumAggregateOutputType = {
    roomQuantity: number | null
  }

  export type InventoryReservationMinAggregateOutputType = {
    id: string | null
    propertyId: string | null
    roomTypeId: string | null
    checkInDate: Date | null
    checkOutDate: Date | null
    roomQuantity: number | null
    status: string | null
    expiresAt: Date | null
    bookingId: string | null
    createdAt: Date | null
  }

  export type InventoryReservationMaxAggregateOutputType = {
    id: string | null
    propertyId: string | null
    roomTypeId: string | null
    checkInDate: Date | null
    checkOutDate: Date | null
    roomQuantity: number | null
    status: string | null
    expiresAt: Date | null
    bookingId: string | null
    createdAt: Date | null
  }

  export type InventoryReservationCountAggregateOutputType = {
    id: number
    propertyId: number
    roomTypeId: number
    checkInDate: number
    checkOutDate: number
    roomQuantity: number
    status: number
    expiresAt: number
    bookingId: number
    createdAt: number
    _all: number
  }


  export type InventoryReservationAvgAggregateInputType = {
    roomQuantity?: true
  }

  export type InventoryReservationSumAggregateInputType = {
    roomQuantity?: true
  }

  export type InventoryReservationMinAggregateInputType = {
    id?: true
    propertyId?: true
    roomTypeId?: true
    checkInDate?: true
    checkOutDate?: true
    roomQuantity?: true
    status?: true
    expiresAt?: true
    bookingId?: true
    createdAt?: true
  }

  export type InventoryReservationMaxAggregateInputType = {
    id?: true
    propertyId?: true
    roomTypeId?: true
    checkInDate?: true
    checkOutDate?: true
    roomQuantity?: true
    status?: true
    expiresAt?: true
    bookingId?: true
    createdAt?: true
  }

  export type InventoryReservationCountAggregateInputType = {
    id?: true
    propertyId?: true
    roomTypeId?: true
    checkInDate?: true
    checkOutDate?: true
    roomQuantity?: true
    status?: true
    expiresAt?: true
    bookingId?: true
    createdAt?: true
    _all?: true
  }

  export type InventoryReservationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryReservation to aggregate.
     */
    where?: InventoryReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryReservations to fetch.
     */
    orderBy?: InventoryReservationOrderByWithRelationInput | InventoryReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InventoryReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryReservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryReservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InventoryReservations
    **/
    _count?: true | InventoryReservationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InventoryReservationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InventoryReservationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventoryReservationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventoryReservationMaxAggregateInputType
  }

  export type GetInventoryReservationAggregateType<T extends InventoryReservationAggregateArgs> = {
        [P in keyof T & keyof AggregateInventoryReservation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventoryReservation[P]>
      : GetScalarType<T[P], AggregateInventoryReservation[P]>
  }




  export type InventoryReservationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryReservationWhereInput
    orderBy?: InventoryReservationOrderByWithAggregationInput | InventoryReservationOrderByWithAggregationInput[]
    by: InventoryReservationScalarFieldEnum[] | InventoryReservationScalarFieldEnum
    having?: InventoryReservationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventoryReservationCountAggregateInputType | true
    _avg?: InventoryReservationAvgAggregateInputType
    _sum?: InventoryReservationSumAggregateInputType
    _min?: InventoryReservationMinAggregateInputType
    _max?: InventoryReservationMaxAggregateInputType
  }

  export type InventoryReservationGroupByOutputType = {
    id: string
    propertyId: string
    roomTypeId: string
    checkInDate: Date
    checkOutDate: Date
    roomQuantity: number
    status: string
    expiresAt: Date
    bookingId: string | null
    createdAt: Date
    _count: InventoryReservationCountAggregateOutputType | null
    _avg: InventoryReservationAvgAggregateOutputType | null
    _sum: InventoryReservationSumAggregateOutputType | null
    _min: InventoryReservationMinAggregateOutputType | null
    _max: InventoryReservationMaxAggregateOutputType | null
  }

  type GetInventoryReservationGroupByPayload<T extends InventoryReservationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryReservationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventoryReservationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventoryReservationGroupByOutputType[P]>
            : GetScalarType<T[P], InventoryReservationGroupByOutputType[P]>
        }
      >
    >


  export type InventoryReservationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    roomTypeId?: boolean
    checkInDate?: boolean
    checkOutDate?: boolean
    roomQuantity?: boolean
    status?: boolean
    expiresAt?: boolean
    bookingId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["inventoryReservation"]>

  export type InventoryReservationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    roomTypeId?: boolean
    checkInDate?: boolean
    checkOutDate?: boolean
    roomQuantity?: boolean
    status?: boolean
    expiresAt?: boolean
    bookingId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["inventoryReservation"]>

  export type InventoryReservationSelectScalar = {
    id?: boolean
    propertyId?: boolean
    roomTypeId?: boolean
    checkInDate?: boolean
    checkOutDate?: boolean
    roomQuantity?: boolean
    status?: boolean
    expiresAt?: boolean
    bookingId?: boolean
    createdAt?: boolean
  }


  export type $InventoryReservationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InventoryReservation"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      propertyId: string
      roomTypeId: string
      checkInDate: Date
      checkOutDate: Date
      roomQuantity: number
      status: string
      expiresAt: Date
      bookingId: string | null
      createdAt: Date
    }, ExtArgs["result"]["inventoryReservation"]>
    composites: {}
  }

  type InventoryReservationGetPayload<S extends boolean | null | undefined | InventoryReservationDefaultArgs> = $Result.GetResult<Prisma.$InventoryReservationPayload, S>

  type InventoryReservationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InventoryReservationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InventoryReservationCountAggregateInputType | true
    }

  export interface InventoryReservationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InventoryReservation'], meta: { name: 'InventoryReservation' } }
    /**
     * Find zero or one InventoryReservation that matches the filter.
     * @param {InventoryReservationFindUniqueArgs} args - Arguments to find a InventoryReservation
     * @example
     * // Get one InventoryReservation
     * const inventoryReservation = await prisma.inventoryReservation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryReservationFindUniqueArgs>(args: SelectSubset<T, InventoryReservationFindUniqueArgs<ExtArgs>>): Prisma__InventoryReservationClient<$Result.GetResult<Prisma.$InventoryReservationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one InventoryReservation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InventoryReservationFindUniqueOrThrowArgs} args - Arguments to find a InventoryReservation
     * @example
     * // Get one InventoryReservation
     * const inventoryReservation = await prisma.inventoryReservation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryReservationFindUniqueOrThrowArgs>(args: SelectSubset<T, InventoryReservationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InventoryReservationClient<$Result.GetResult<Prisma.$InventoryReservationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first InventoryReservation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryReservationFindFirstArgs} args - Arguments to find a InventoryReservation
     * @example
     * // Get one InventoryReservation
     * const inventoryReservation = await prisma.inventoryReservation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryReservationFindFirstArgs>(args?: SelectSubset<T, InventoryReservationFindFirstArgs<ExtArgs>>): Prisma__InventoryReservationClient<$Result.GetResult<Prisma.$InventoryReservationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first InventoryReservation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryReservationFindFirstOrThrowArgs} args - Arguments to find a InventoryReservation
     * @example
     * // Get one InventoryReservation
     * const inventoryReservation = await prisma.inventoryReservation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryReservationFindFirstOrThrowArgs>(args?: SelectSubset<T, InventoryReservationFindFirstOrThrowArgs<ExtArgs>>): Prisma__InventoryReservationClient<$Result.GetResult<Prisma.$InventoryReservationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more InventoryReservations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryReservationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InventoryReservations
     * const inventoryReservations = await prisma.inventoryReservation.findMany()
     * 
     * // Get first 10 InventoryReservations
     * const inventoryReservations = await prisma.inventoryReservation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventoryReservationWithIdOnly = await prisma.inventoryReservation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InventoryReservationFindManyArgs>(args?: SelectSubset<T, InventoryReservationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryReservationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a InventoryReservation.
     * @param {InventoryReservationCreateArgs} args - Arguments to create a InventoryReservation.
     * @example
     * // Create one InventoryReservation
     * const InventoryReservation = await prisma.inventoryReservation.create({
     *   data: {
     *     // ... data to create a InventoryReservation
     *   }
     * })
     * 
     */
    create<T extends InventoryReservationCreateArgs>(args: SelectSubset<T, InventoryReservationCreateArgs<ExtArgs>>): Prisma__InventoryReservationClient<$Result.GetResult<Prisma.$InventoryReservationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many InventoryReservations.
     * @param {InventoryReservationCreateManyArgs} args - Arguments to create many InventoryReservations.
     * @example
     * // Create many InventoryReservations
     * const inventoryReservation = await prisma.inventoryReservation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InventoryReservationCreateManyArgs>(args?: SelectSubset<T, InventoryReservationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InventoryReservations and returns the data saved in the database.
     * @param {InventoryReservationCreateManyAndReturnArgs} args - Arguments to create many InventoryReservations.
     * @example
     * // Create many InventoryReservations
     * const inventoryReservation = await prisma.inventoryReservation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InventoryReservations and only return the `id`
     * const inventoryReservationWithIdOnly = await prisma.inventoryReservation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InventoryReservationCreateManyAndReturnArgs>(args?: SelectSubset<T, InventoryReservationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryReservationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a InventoryReservation.
     * @param {InventoryReservationDeleteArgs} args - Arguments to delete one InventoryReservation.
     * @example
     * // Delete one InventoryReservation
     * const InventoryReservation = await prisma.inventoryReservation.delete({
     *   where: {
     *     // ... filter to delete one InventoryReservation
     *   }
     * })
     * 
     */
    delete<T extends InventoryReservationDeleteArgs>(args: SelectSubset<T, InventoryReservationDeleteArgs<ExtArgs>>): Prisma__InventoryReservationClient<$Result.GetResult<Prisma.$InventoryReservationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one InventoryReservation.
     * @param {InventoryReservationUpdateArgs} args - Arguments to update one InventoryReservation.
     * @example
     * // Update one InventoryReservation
     * const inventoryReservation = await prisma.inventoryReservation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InventoryReservationUpdateArgs>(args: SelectSubset<T, InventoryReservationUpdateArgs<ExtArgs>>): Prisma__InventoryReservationClient<$Result.GetResult<Prisma.$InventoryReservationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more InventoryReservations.
     * @param {InventoryReservationDeleteManyArgs} args - Arguments to filter InventoryReservations to delete.
     * @example
     * // Delete a few InventoryReservations
     * const { count } = await prisma.inventoryReservation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InventoryReservationDeleteManyArgs>(args?: SelectSubset<T, InventoryReservationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InventoryReservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryReservationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InventoryReservations
     * const inventoryReservation = await prisma.inventoryReservation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InventoryReservationUpdateManyArgs>(args: SelectSubset<T, InventoryReservationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InventoryReservation.
     * @param {InventoryReservationUpsertArgs} args - Arguments to update or create a InventoryReservation.
     * @example
     * // Update or create a InventoryReservation
     * const inventoryReservation = await prisma.inventoryReservation.upsert({
     *   create: {
     *     // ... data to create a InventoryReservation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InventoryReservation we want to update
     *   }
     * })
     */
    upsert<T extends InventoryReservationUpsertArgs>(args: SelectSubset<T, InventoryReservationUpsertArgs<ExtArgs>>): Prisma__InventoryReservationClient<$Result.GetResult<Prisma.$InventoryReservationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of InventoryReservations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryReservationCountArgs} args - Arguments to filter InventoryReservations to count.
     * @example
     * // Count the number of InventoryReservations
     * const count = await prisma.inventoryReservation.count({
     *   where: {
     *     // ... the filter for the InventoryReservations we want to count
     *   }
     * })
    **/
    count<T extends InventoryReservationCountArgs>(
      args?: Subset<T, InventoryReservationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventoryReservationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InventoryReservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryReservationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InventoryReservationAggregateArgs>(args: Subset<T, InventoryReservationAggregateArgs>): Prisma.PrismaPromise<GetInventoryReservationAggregateType<T>>

    /**
     * Group by InventoryReservation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryReservationGroupByArgs} args - Group by arguments.
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
      T extends InventoryReservationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InventoryReservationGroupByArgs['orderBy'] }
        : { orderBy?: InventoryReservationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InventoryReservationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryReservationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InventoryReservation model
   */
  readonly fields: InventoryReservationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InventoryReservation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InventoryReservationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the InventoryReservation model
   */ 
  interface InventoryReservationFieldRefs {
    readonly id: FieldRef<"InventoryReservation", 'String'>
    readonly propertyId: FieldRef<"InventoryReservation", 'String'>
    readonly roomTypeId: FieldRef<"InventoryReservation", 'String'>
    readonly checkInDate: FieldRef<"InventoryReservation", 'DateTime'>
    readonly checkOutDate: FieldRef<"InventoryReservation", 'DateTime'>
    readonly roomQuantity: FieldRef<"InventoryReservation", 'Int'>
    readonly status: FieldRef<"InventoryReservation", 'String'>
    readonly expiresAt: FieldRef<"InventoryReservation", 'DateTime'>
    readonly bookingId: FieldRef<"InventoryReservation", 'String'>
    readonly createdAt: FieldRef<"InventoryReservation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InventoryReservation findUnique
   */
  export type InventoryReservationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null
    /**
     * Filter, which InventoryReservation to fetch.
     */
    where: InventoryReservationWhereUniqueInput
  }

  /**
   * InventoryReservation findUniqueOrThrow
   */
  export type InventoryReservationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null
    /**
     * Filter, which InventoryReservation to fetch.
     */
    where: InventoryReservationWhereUniqueInput
  }

  /**
   * InventoryReservation findFirst
   */
  export type InventoryReservationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null
    /**
     * Filter, which InventoryReservation to fetch.
     */
    where?: InventoryReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryReservations to fetch.
     */
    orderBy?: InventoryReservationOrderByWithRelationInput | InventoryReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryReservations.
     */
    cursor?: InventoryReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryReservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryReservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryReservations.
     */
    distinct?: InventoryReservationScalarFieldEnum | InventoryReservationScalarFieldEnum[]
  }

  /**
   * InventoryReservation findFirstOrThrow
   */
  export type InventoryReservationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null
    /**
     * Filter, which InventoryReservation to fetch.
     */
    where?: InventoryReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryReservations to fetch.
     */
    orderBy?: InventoryReservationOrderByWithRelationInput | InventoryReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryReservations.
     */
    cursor?: InventoryReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryReservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryReservations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryReservations.
     */
    distinct?: InventoryReservationScalarFieldEnum | InventoryReservationScalarFieldEnum[]
  }

  /**
   * InventoryReservation findMany
   */
  export type InventoryReservationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null
    /**
     * Filter, which InventoryReservations to fetch.
     */
    where?: InventoryReservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryReservations to fetch.
     */
    orderBy?: InventoryReservationOrderByWithRelationInput | InventoryReservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InventoryReservations.
     */
    cursor?: InventoryReservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryReservations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryReservations.
     */
    skip?: number
    distinct?: InventoryReservationScalarFieldEnum | InventoryReservationScalarFieldEnum[]
  }

  /**
   * InventoryReservation create
   */
  export type InventoryReservationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null
    /**
     * The data needed to create a InventoryReservation.
     */
    data: XOR<InventoryReservationCreateInput, InventoryReservationUncheckedCreateInput>
  }

  /**
   * InventoryReservation createMany
   */
  export type InventoryReservationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InventoryReservations.
     */
    data: InventoryReservationCreateManyInput | InventoryReservationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InventoryReservation createManyAndReturn
   */
  export type InventoryReservationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many InventoryReservations.
     */
    data: InventoryReservationCreateManyInput | InventoryReservationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InventoryReservation update
   */
  export type InventoryReservationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null
    /**
     * The data needed to update a InventoryReservation.
     */
    data: XOR<InventoryReservationUpdateInput, InventoryReservationUncheckedUpdateInput>
    /**
     * Choose, which InventoryReservation to update.
     */
    where: InventoryReservationWhereUniqueInput
  }

  /**
   * InventoryReservation updateMany
   */
  export type InventoryReservationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InventoryReservations.
     */
    data: XOR<InventoryReservationUpdateManyMutationInput, InventoryReservationUncheckedUpdateManyInput>
    /**
     * Filter which InventoryReservations to update
     */
    where?: InventoryReservationWhereInput
  }

  /**
   * InventoryReservation upsert
   */
  export type InventoryReservationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null
    /**
     * The filter to search for the InventoryReservation to update in case it exists.
     */
    where: InventoryReservationWhereUniqueInput
    /**
     * In case the InventoryReservation found by the `where` argument doesn't exist, create a new InventoryReservation with this data.
     */
    create: XOR<InventoryReservationCreateInput, InventoryReservationUncheckedCreateInput>
    /**
     * In case the InventoryReservation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InventoryReservationUpdateInput, InventoryReservationUncheckedUpdateInput>
  }

  /**
   * InventoryReservation delete
   */
  export type InventoryReservationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null
    /**
     * Filter which InventoryReservation to delete.
     */
    where: InventoryReservationWhereUniqueInput
  }

  /**
   * InventoryReservation deleteMany
   */
  export type InventoryReservationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryReservations to delete
     */
    where?: InventoryReservationWhereInput
  }

  /**
   * InventoryReservation without action
   */
  export type InventoryReservationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null
  }


  /**
   * Model InventoryLock
   */

  export type AggregateInventoryLock = {
    _count: InventoryLockCountAggregateOutputType | null
    _avg: InventoryLockAvgAggregateOutputType | null
    _sum: InventoryLockSumAggregateOutputType | null
    _min: InventoryLockMinAggregateOutputType | null
    _max: InventoryLockMaxAggregateOutputType | null
  }

  export type InventoryLockAvgAggregateOutputType = {
    quantity: number | null
  }

  export type InventoryLockSumAggregateOutputType = {
    quantity: number | null
  }

  export type InventoryLockMinAggregateOutputType = {
    id: string | null
    propertyId: string | null
    roomTypeId: string | null
    checkInDate: Date | null
    checkOutDate: Date | null
    quantity: number | null
    lockedBy: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type InventoryLockMaxAggregateOutputType = {
    id: string | null
    propertyId: string | null
    roomTypeId: string | null
    checkInDate: Date | null
    checkOutDate: Date | null
    quantity: number | null
    lockedBy: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type InventoryLockCountAggregateOutputType = {
    id: number
    propertyId: number
    roomTypeId: number
    checkInDate: number
    checkOutDate: number
    quantity: number
    lockedBy: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type InventoryLockAvgAggregateInputType = {
    quantity?: true
  }

  export type InventoryLockSumAggregateInputType = {
    quantity?: true
  }

  export type InventoryLockMinAggregateInputType = {
    id?: true
    propertyId?: true
    roomTypeId?: true
    checkInDate?: true
    checkOutDate?: true
    quantity?: true
    lockedBy?: true
    expiresAt?: true
    createdAt?: true
  }

  export type InventoryLockMaxAggregateInputType = {
    id?: true
    propertyId?: true
    roomTypeId?: true
    checkInDate?: true
    checkOutDate?: true
    quantity?: true
    lockedBy?: true
    expiresAt?: true
    createdAt?: true
  }

  export type InventoryLockCountAggregateInputType = {
    id?: true
    propertyId?: true
    roomTypeId?: true
    checkInDate?: true
    checkOutDate?: true
    quantity?: true
    lockedBy?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type InventoryLockAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryLock to aggregate.
     */
    where?: InventoryLockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryLocks to fetch.
     */
    orderBy?: InventoryLockOrderByWithRelationInput | InventoryLockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InventoryLockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryLocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryLocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InventoryLocks
    **/
    _count?: true | InventoryLockCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InventoryLockAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InventoryLockSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventoryLockMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventoryLockMaxAggregateInputType
  }

  export type GetInventoryLockAggregateType<T extends InventoryLockAggregateArgs> = {
        [P in keyof T & keyof AggregateInventoryLock]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventoryLock[P]>
      : GetScalarType<T[P], AggregateInventoryLock[P]>
  }




  export type InventoryLockGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryLockWhereInput
    orderBy?: InventoryLockOrderByWithAggregationInput | InventoryLockOrderByWithAggregationInput[]
    by: InventoryLockScalarFieldEnum[] | InventoryLockScalarFieldEnum
    having?: InventoryLockScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventoryLockCountAggregateInputType | true
    _avg?: InventoryLockAvgAggregateInputType
    _sum?: InventoryLockSumAggregateInputType
    _min?: InventoryLockMinAggregateInputType
    _max?: InventoryLockMaxAggregateInputType
  }

  export type InventoryLockGroupByOutputType = {
    id: string
    propertyId: string
    roomTypeId: string
    checkInDate: Date
    checkOutDate: Date
    quantity: number
    lockedBy: string
    expiresAt: Date
    createdAt: Date
    _count: InventoryLockCountAggregateOutputType | null
    _avg: InventoryLockAvgAggregateOutputType | null
    _sum: InventoryLockSumAggregateOutputType | null
    _min: InventoryLockMinAggregateOutputType | null
    _max: InventoryLockMaxAggregateOutputType | null
  }

  type GetInventoryLockGroupByPayload<T extends InventoryLockGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryLockGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventoryLockGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventoryLockGroupByOutputType[P]>
            : GetScalarType<T[P], InventoryLockGroupByOutputType[P]>
        }
      >
    >


  export type InventoryLockSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    roomTypeId?: boolean
    checkInDate?: boolean
    checkOutDate?: boolean
    quantity?: boolean
    lockedBy?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["inventoryLock"]>

  export type InventoryLockSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    roomTypeId?: boolean
    checkInDate?: boolean
    checkOutDate?: boolean
    quantity?: boolean
    lockedBy?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["inventoryLock"]>

  export type InventoryLockSelectScalar = {
    id?: boolean
    propertyId?: boolean
    roomTypeId?: boolean
    checkInDate?: boolean
    checkOutDate?: boolean
    quantity?: boolean
    lockedBy?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }


  export type $InventoryLockPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InventoryLock"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      propertyId: string
      roomTypeId: string
      checkInDate: Date
      checkOutDate: Date
      quantity: number
      lockedBy: string
      expiresAt: Date
      createdAt: Date
    }, ExtArgs["result"]["inventoryLock"]>
    composites: {}
  }

  type InventoryLockGetPayload<S extends boolean | null | undefined | InventoryLockDefaultArgs> = $Result.GetResult<Prisma.$InventoryLockPayload, S>

  type InventoryLockCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InventoryLockFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InventoryLockCountAggregateInputType | true
    }

  export interface InventoryLockDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InventoryLock'], meta: { name: 'InventoryLock' } }
    /**
     * Find zero or one InventoryLock that matches the filter.
     * @param {InventoryLockFindUniqueArgs} args - Arguments to find a InventoryLock
     * @example
     * // Get one InventoryLock
     * const inventoryLock = await prisma.inventoryLock.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryLockFindUniqueArgs>(args: SelectSubset<T, InventoryLockFindUniqueArgs<ExtArgs>>): Prisma__InventoryLockClient<$Result.GetResult<Prisma.$InventoryLockPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one InventoryLock that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InventoryLockFindUniqueOrThrowArgs} args - Arguments to find a InventoryLock
     * @example
     * // Get one InventoryLock
     * const inventoryLock = await prisma.inventoryLock.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryLockFindUniqueOrThrowArgs>(args: SelectSubset<T, InventoryLockFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InventoryLockClient<$Result.GetResult<Prisma.$InventoryLockPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first InventoryLock that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLockFindFirstArgs} args - Arguments to find a InventoryLock
     * @example
     * // Get one InventoryLock
     * const inventoryLock = await prisma.inventoryLock.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryLockFindFirstArgs>(args?: SelectSubset<T, InventoryLockFindFirstArgs<ExtArgs>>): Prisma__InventoryLockClient<$Result.GetResult<Prisma.$InventoryLockPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first InventoryLock that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLockFindFirstOrThrowArgs} args - Arguments to find a InventoryLock
     * @example
     * // Get one InventoryLock
     * const inventoryLock = await prisma.inventoryLock.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryLockFindFirstOrThrowArgs>(args?: SelectSubset<T, InventoryLockFindFirstOrThrowArgs<ExtArgs>>): Prisma__InventoryLockClient<$Result.GetResult<Prisma.$InventoryLockPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more InventoryLocks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLockFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InventoryLocks
     * const inventoryLocks = await prisma.inventoryLock.findMany()
     * 
     * // Get first 10 InventoryLocks
     * const inventoryLocks = await prisma.inventoryLock.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventoryLockWithIdOnly = await prisma.inventoryLock.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InventoryLockFindManyArgs>(args?: SelectSubset<T, InventoryLockFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryLockPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a InventoryLock.
     * @param {InventoryLockCreateArgs} args - Arguments to create a InventoryLock.
     * @example
     * // Create one InventoryLock
     * const InventoryLock = await prisma.inventoryLock.create({
     *   data: {
     *     // ... data to create a InventoryLock
     *   }
     * })
     * 
     */
    create<T extends InventoryLockCreateArgs>(args: SelectSubset<T, InventoryLockCreateArgs<ExtArgs>>): Prisma__InventoryLockClient<$Result.GetResult<Prisma.$InventoryLockPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many InventoryLocks.
     * @param {InventoryLockCreateManyArgs} args - Arguments to create many InventoryLocks.
     * @example
     * // Create many InventoryLocks
     * const inventoryLock = await prisma.inventoryLock.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InventoryLockCreateManyArgs>(args?: SelectSubset<T, InventoryLockCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InventoryLocks and returns the data saved in the database.
     * @param {InventoryLockCreateManyAndReturnArgs} args - Arguments to create many InventoryLocks.
     * @example
     * // Create many InventoryLocks
     * const inventoryLock = await prisma.inventoryLock.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InventoryLocks and only return the `id`
     * const inventoryLockWithIdOnly = await prisma.inventoryLock.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InventoryLockCreateManyAndReturnArgs>(args?: SelectSubset<T, InventoryLockCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryLockPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a InventoryLock.
     * @param {InventoryLockDeleteArgs} args - Arguments to delete one InventoryLock.
     * @example
     * // Delete one InventoryLock
     * const InventoryLock = await prisma.inventoryLock.delete({
     *   where: {
     *     // ... filter to delete one InventoryLock
     *   }
     * })
     * 
     */
    delete<T extends InventoryLockDeleteArgs>(args: SelectSubset<T, InventoryLockDeleteArgs<ExtArgs>>): Prisma__InventoryLockClient<$Result.GetResult<Prisma.$InventoryLockPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one InventoryLock.
     * @param {InventoryLockUpdateArgs} args - Arguments to update one InventoryLock.
     * @example
     * // Update one InventoryLock
     * const inventoryLock = await prisma.inventoryLock.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InventoryLockUpdateArgs>(args: SelectSubset<T, InventoryLockUpdateArgs<ExtArgs>>): Prisma__InventoryLockClient<$Result.GetResult<Prisma.$InventoryLockPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more InventoryLocks.
     * @param {InventoryLockDeleteManyArgs} args - Arguments to filter InventoryLocks to delete.
     * @example
     * // Delete a few InventoryLocks
     * const { count } = await prisma.inventoryLock.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InventoryLockDeleteManyArgs>(args?: SelectSubset<T, InventoryLockDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InventoryLocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLockUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InventoryLocks
     * const inventoryLock = await prisma.inventoryLock.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InventoryLockUpdateManyArgs>(args: SelectSubset<T, InventoryLockUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InventoryLock.
     * @param {InventoryLockUpsertArgs} args - Arguments to update or create a InventoryLock.
     * @example
     * // Update or create a InventoryLock
     * const inventoryLock = await prisma.inventoryLock.upsert({
     *   create: {
     *     // ... data to create a InventoryLock
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InventoryLock we want to update
     *   }
     * })
     */
    upsert<T extends InventoryLockUpsertArgs>(args: SelectSubset<T, InventoryLockUpsertArgs<ExtArgs>>): Prisma__InventoryLockClient<$Result.GetResult<Prisma.$InventoryLockPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of InventoryLocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLockCountArgs} args - Arguments to filter InventoryLocks to count.
     * @example
     * // Count the number of InventoryLocks
     * const count = await prisma.inventoryLock.count({
     *   where: {
     *     // ... the filter for the InventoryLocks we want to count
     *   }
     * })
    **/
    count<T extends InventoryLockCountArgs>(
      args?: Subset<T, InventoryLockCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventoryLockCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InventoryLock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLockAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InventoryLockAggregateArgs>(args: Subset<T, InventoryLockAggregateArgs>): Prisma.PrismaPromise<GetInventoryLockAggregateType<T>>

    /**
     * Group by InventoryLock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryLockGroupByArgs} args - Group by arguments.
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
      T extends InventoryLockGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InventoryLockGroupByArgs['orderBy'] }
        : { orderBy?: InventoryLockGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InventoryLockGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryLockGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InventoryLock model
   */
  readonly fields: InventoryLockFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InventoryLock.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InventoryLockClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the InventoryLock model
   */ 
  interface InventoryLockFieldRefs {
    readonly id: FieldRef<"InventoryLock", 'String'>
    readonly propertyId: FieldRef<"InventoryLock", 'String'>
    readonly roomTypeId: FieldRef<"InventoryLock", 'String'>
    readonly checkInDate: FieldRef<"InventoryLock", 'DateTime'>
    readonly checkOutDate: FieldRef<"InventoryLock", 'DateTime'>
    readonly quantity: FieldRef<"InventoryLock", 'Int'>
    readonly lockedBy: FieldRef<"InventoryLock", 'String'>
    readonly expiresAt: FieldRef<"InventoryLock", 'DateTime'>
    readonly createdAt: FieldRef<"InventoryLock", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InventoryLock findUnique
   */
  export type InventoryLockFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLock
     */
    select?: InventoryLockSelect<ExtArgs> | null
    /**
     * Filter, which InventoryLock to fetch.
     */
    where: InventoryLockWhereUniqueInput
  }

  /**
   * InventoryLock findUniqueOrThrow
   */
  export type InventoryLockFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLock
     */
    select?: InventoryLockSelect<ExtArgs> | null
    /**
     * Filter, which InventoryLock to fetch.
     */
    where: InventoryLockWhereUniqueInput
  }

  /**
   * InventoryLock findFirst
   */
  export type InventoryLockFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLock
     */
    select?: InventoryLockSelect<ExtArgs> | null
    /**
     * Filter, which InventoryLock to fetch.
     */
    where?: InventoryLockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryLocks to fetch.
     */
    orderBy?: InventoryLockOrderByWithRelationInput | InventoryLockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryLocks.
     */
    cursor?: InventoryLockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryLocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryLocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryLocks.
     */
    distinct?: InventoryLockScalarFieldEnum | InventoryLockScalarFieldEnum[]
  }

  /**
   * InventoryLock findFirstOrThrow
   */
  export type InventoryLockFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLock
     */
    select?: InventoryLockSelect<ExtArgs> | null
    /**
     * Filter, which InventoryLock to fetch.
     */
    where?: InventoryLockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryLocks to fetch.
     */
    orderBy?: InventoryLockOrderByWithRelationInput | InventoryLockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InventoryLocks.
     */
    cursor?: InventoryLockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryLocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryLocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InventoryLocks.
     */
    distinct?: InventoryLockScalarFieldEnum | InventoryLockScalarFieldEnum[]
  }

  /**
   * InventoryLock findMany
   */
  export type InventoryLockFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLock
     */
    select?: InventoryLockSelect<ExtArgs> | null
    /**
     * Filter, which InventoryLocks to fetch.
     */
    where?: InventoryLockWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InventoryLocks to fetch.
     */
    orderBy?: InventoryLockOrderByWithRelationInput | InventoryLockOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InventoryLocks.
     */
    cursor?: InventoryLockWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InventoryLocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InventoryLocks.
     */
    skip?: number
    distinct?: InventoryLockScalarFieldEnum | InventoryLockScalarFieldEnum[]
  }

  /**
   * InventoryLock create
   */
  export type InventoryLockCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLock
     */
    select?: InventoryLockSelect<ExtArgs> | null
    /**
     * The data needed to create a InventoryLock.
     */
    data: XOR<InventoryLockCreateInput, InventoryLockUncheckedCreateInput>
  }

  /**
   * InventoryLock createMany
   */
  export type InventoryLockCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InventoryLocks.
     */
    data: InventoryLockCreateManyInput | InventoryLockCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InventoryLock createManyAndReturn
   */
  export type InventoryLockCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLock
     */
    select?: InventoryLockSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many InventoryLocks.
     */
    data: InventoryLockCreateManyInput | InventoryLockCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InventoryLock update
   */
  export type InventoryLockUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLock
     */
    select?: InventoryLockSelect<ExtArgs> | null
    /**
     * The data needed to update a InventoryLock.
     */
    data: XOR<InventoryLockUpdateInput, InventoryLockUncheckedUpdateInput>
    /**
     * Choose, which InventoryLock to update.
     */
    where: InventoryLockWhereUniqueInput
  }

  /**
   * InventoryLock updateMany
   */
  export type InventoryLockUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InventoryLocks.
     */
    data: XOR<InventoryLockUpdateManyMutationInput, InventoryLockUncheckedUpdateManyInput>
    /**
     * Filter which InventoryLocks to update
     */
    where?: InventoryLockWhereInput
  }

  /**
   * InventoryLock upsert
   */
  export type InventoryLockUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLock
     */
    select?: InventoryLockSelect<ExtArgs> | null
    /**
     * The filter to search for the InventoryLock to update in case it exists.
     */
    where: InventoryLockWhereUniqueInput
    /**
     * In case the InventoryLock found by the `where` argument doesn't exist, create a new InventoryLock with this data.
     */
    create: XOR<InventoryLockCreateInput, InventoryLockUncheckedCreateInput>
    /**
     * In case the InventoryLock was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InventoryLockUpdateInput, InventoryLockUncheckedUpdateInput>
  }

  /**
   * InventoryLock delete
   */
  export type InventoryLockDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLock
     */
    select?: InventoryLockSelect<ExtArgs> | null
    /**
     * Filter which InventoryLock to delete.
     */
    where: InventoryLockWhereUniqueInput
  }

  /**
   * InventoryLock deleteMany
   */
  export type InventoryLockDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryLocks to delete
     */
    where?: InventoryLockWhereInput
  }

  /**
   * InventoryLock without action
   */
  export type InventoryLockDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryLock
     */
    select?: InventoryLockSelect<ExtArgs> | null
  }


  /**
   * Model RateRecord
   */

  export type AggregateRateRecord = {
    _count: RateRecordCountAggregateOutputType | null
    _avg: RateRecordAvgAggregateOutputType | null
    _sum: RateRecordSumAggregateOutputType | null
    _min: RateRecordMinAggregateOutputType | null
    _max: RateRecordMaxAggregateOutputType | null
  }

  export type RateRecordAvgAggregateOutputType = {
    rate: number | null
    minimumStay: number | null
    maximumStay: number | null
    advanceBookingDays: number | null
  }

  export type RateRecordSumAggregateOutputType = {
    rate: number | null
    minimumStay: number | null
    maximumStay: number | null
    advanceBookingDays: number | null
  }

  export type RateRecordMinAggregateOutputType = {
    id: string | null
    propertyId: string | null
    roomTypeId: string | null
    date: Date | null
    rate: number | null
    currency: string | null
    rateType: string | null
    minimumStay: number | null
    maximumStay: number | null
    advanceBookingDays: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RateRecordMaxAggregateOutputType = {
    id: string | null
    propertyId: string | null
    roomTypeId: string | null
    date: Date | null
    rate: number | null
    currency: string | null
    rateType: string | null
    minimumStay: number | null
    maximumStay: number | null
    advanceBookingDays: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RateRecordCountAggregateOutputType = {
    id: number
    propertyId: number
    roomTypeId: number
    date: number
    rate: number
    currency: number
    rateType: number
    minimumStay: number
    maximumStay: number
    advanceBookingDays: number
    restrictions: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RateRecordAvgAggregateInputType = {
    rate?: true
    minimumStay?: true
    maximumStay?: true
    advanceBookingDays?: true
  }

  export type RateRecordSumAggregateInputType = {
    rate?: true
    minimumStay?: true
    maximumStay?: true
    advanceBookingDays?: true
  }

  export type RateRecordMinAggregateInputType = {
    id?: true
    propertyId?: true
    roomTypeId?: true
    date?: true
    rate?: true
    currency?: true
    rateType?: true
    minimumStay?: true
    maximumStay?: true
    advanceBookingDays?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RateRecordMaxAggregateInputType = {
    id?: true
    propertyId?: true
    roomTypeId?: true
    date?: true
    rate?: true
    currency?: true
    rateType?: true
    minimumStay?: true
    maximumStay?: true
    advanceBookingDays?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RateRecordCountAggregateInputType = {
    id?: true
    propertyId?: true
    roomTypeId?: true
    date?: true
    rate?: true
    currency?: true
    rateType?: true
    minimumStay?: true
    maximumStay?: true
    advanceBookingDays?: true
    restrictions?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RateRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RateRecord to aggregate.
     */
    where?: RateRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RateRecords to fetch.
     */
    orderBy?: RateRecordOrderByWithRelationInput | RateRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RateRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RateRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RateRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RateRecords
    **/
    _count?: true | RateRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RateRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RateRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RateRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RateRecordMaxAggregateInputType
  }

  export type GetRateRecordAggregateType<T extends RateRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateRateRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRateRecord[P]>
      : GetScalarType<T[P], AggregateRateRecord[P]>
  }




  export type RateRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RateRecordWhereInput
    orderBy?: RateRecordOrderByWithAggregationInput | RateRecordOrderByWithAggregationInput[]
    by: RateRecordScalarFieldEnum[] | RateRecordScalarFieldEnum
    having?: RateRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RateRecordCountAggregateInputType | true
    _avg?: RateRecordAvgAggregateInputType
    _sum?: RateRecordSumAggregateInputType
    _min?: RateRecordMinAggregateInputType
    _max?: RateRecordMaxAggregateInputType
  }

  export type RateRecordGroupByOutputType = {
    id: string
    propertyId: string
    roomTypeId: string
    date: Date
    rate: number
    currency: string
    rateType: string
    minimumStay: number | null
    maximumStay: number | null
    advanceBookingDays: number | null
    restrictions: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: RateRecordCountAggregateOutputType | null
    _avg: RateRecordAvgAggregateOutputType | null
    _sum: RateRecordSumAggregateOutputType | null
    _min: RateRecordMinAggregateOutputType | null
    _max: RateRecordMaxAggregateOutputType | null
  }

  type GetRateRecordGroupByPayload<T extends RateRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RateRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RateRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RateRecordGroupByOutputType[P]>
            : GetScalarType<T[P], RateRecordGroupByOutputType[P]>
        }
      >
    >


  export type RateRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    roomTypeId?: boolean
    date?: boolean
    rate?: boolean
    currency?: boolean
    rateType?: boolean
    minimumStay?: boolean
    maximumStay?: boolean
    advanceBookingDays?: boolean
    restrictions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    roomType?: boolean | RoomTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rateRecord"]>

  export type RateRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    roomTypeId?: boolean
    date?: boolean
    rate?: boolean
    currency?: boolean
    rateType?: boolean
    minimumStay?: boolean
    maximumStay?: boolean
    advanceBookingDays?: boolean
    restrictions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    roomType?: boolean | RoomTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rateRecord"]>

  export type RateRecordSelectScalar = {
    id?: boolean
    propertyId?: boolean
    roomTypeId?: boolean
    date?: boolean
    rate?: boolean
    currency?: boolean
    rateType?: boolean
    minimumStay?: boolean
    maximumStay?: boolean
    advanceBookingDays?: boolean
    restrictions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RateRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    roomType?: boolean | RoomTypeDefaultArgs<ExtArgs>
  }
  export type RateRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    roomType?: boolean | RoomTypeDefaultArgs<ExtArgs>
  }

  export type $RateRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RateRecord"
    objects: {
      property: Prisma.$PropertyPayload<ExtArgs>
      roomType: Prisma.$RoomTypePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      propertyId: string
      roomTypeId: string
      date: Date
      rate: number
      currency: string
      rateType: string
      minimumStay: number | null
      maximumStay: number | null
      advanceBookingDays: number | null
      restrictions: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["rateRecord"]>
    composites: {}
  }

  type RateRecordGetPayload<S extends boolean | null | undefined | RateRecordDefaultArgs> = $Result.GetResult<Prisma.$RateRecordPayload, S>

  type RateRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RateRecordFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RateRecordCountAggregateInputType | true
    }

  export interface RateRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RateRecord'], meta: { name: 'RateRecord' } }
    /**
     * Find zero or one RateRecord that matches the filter.
     * @param {RateRecordFindUniqueArgs} args - Arguments to find a RateRecord
     * @example
     * // Get one RateRecord
     * const rateRecord = await prisma.rateRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RateRecordFindUniqueArgs>(args: SelectSubset<T, RateRecordFindUniqueArgs<ExtArgs>>): Prisma__RateRecordClient<$Result.GetResult<Prisma.$RateRecordPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RateRecord that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RateRecordFindUniqueOrThrowArgs} args - Arguments to find a RateRecord
     * @example
     * // Get one RateRecord
     * const rateRecord = await prisma.rateRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RateRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, RateRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RateRecordClient<$Result.GetResult<Prisma.$RateRecordPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RateRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RateRecordFindFirstArgs} args - Arguments to find a RateRecord
     * @example
     * // Get one RateRecord
     * const rateRecord = await prisma.rateRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RateRecordFindFirstArgs>(args?: SelectSubset<T, RateRecordFindFirstArgs<ExtArgs>>): Prisma__RateRecordClient<$Result.GetResult<Prisma.$RateRecordPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RateRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RateRecordFindFirstOrThrowArgs} args - Arguments to find a RateRecord
     * @example
     * // Get one RateRecord
     * const rateRecord = await prisma.rateRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RateRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, RateRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__RateRecordClient<$Result.GetResult<Prisma.$RateRecordPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RateRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RateRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RateRecords
     * const rateRecords = await prisma.rateRecord.findMany()
     * 
     * // Get first 10 RateRecords
     * const rateRecords = await prisma.rateRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rateRecordWithIdOnly = await prisma.rateRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RateRecordFindManyArgs>(args?: SelectSubset<T, RateRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RateRecordPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RateRecord.
     * @param {RateRecordCreateArgs} args - Arguments to create a RateRecord.
     * @example
     * // Create one RateRecord
     * const RateRecord = await prisma.rateRecord.create({
     *   data: {
     *     // ... data to create a RateRecord
     *   }
     * })
     * 
     */
    create<T extends RateRecordCreateArgs>(args: SelectSubset<T, RateRecordCreateArgs<ExtArgs>>): Prisma__RateRecordClient<$Result.GetResult<Prisma.$RateRecordPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RateRecords.
     * @param {RateRecordCreateManyArgs} args - Arguments to create many RateRecords.
     * @example
     * // Create many RateRecords
     * const rateRecord = await prisma.rateRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RateRecordCreateManyArgs>(args?: SelectSubset<T, RateRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RateRecords and returns the data saved in the database.
     * @param {RateRecordCreateManyAndReturnArgs} args - Arguments to create many RateRecords.
     * @example
     * // Create many RateRecords
     * const rateRecord = await prisma.rateRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RateRecords and only return the `id`
     * const rateRecordWithIdOnly = await prisma.rateRecord.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RateRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, RateRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RateRecordPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RateRecord.
     * @param {RateRecordDeleteArgs} args - Arguments to delete one RateRecord.
     * @example
     * // Delete one RateRecord
     * const RateRecord = await prisma.rateRecord.delete({
     *   where: {
     *     // ... filter to delete one RateRecord
     *   }
     * })
     * 
     */
    delete<T extends RateRecordDeleteArgs>(args: SelectSubset<T, RateRecordDeleteArgs<ExtArgs>>): Prisma__RateRecordClient<$Result.GetResult<Prisma.$RateRecordPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RateRecord.
     * @param {RateRecordUpdateArgs} args - Arguments to update one RateRecord.
     * @example
     * // Update one RateRecord
     * const rateRecord = await prisma.rateRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RateRecordUpdateArgs>(args: SelectSubset<T, RateRecordUpdateArgs<ExtArgs>>): Prisma__RateRecordClient<$Result.GetResult<Prisma.$RateRecordPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RateRecords.
     * @param {RateRecordDeleteManyArgs} args - Arguments to filter RateRecords to delete.
     * @example
     * // Delete a few RateRecords
     * const { count } = await prisma.rateRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RateRecordDeleteManyArgs>(args?: SelectSubset<T, RateRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RateRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RateRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RateRecords
     * const rateRecord = await prisma.rateRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RateRecordUpdateManyArgs>(args: SelectSubset<T, RateRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RateRecord.
     * @param {RateRecordUpsertArgs} args - Arguments to update or create a RateRecord.
     * @example
     * // Update or create a RateRecord
     * const rateRecord = await prisma.rateRecord.upsert({
     *   create: {
     *     // ... data to create a RateRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RateRecord we want to update
     *   }
     * })
     */
    upsert<T extends RateRecordUpsertArgs>(args: SelectSubset<T, RateRecordUpsertArgs<ExtArgs>>): Prisma__RateRecordClient<$Result.GetResult<Prisma.$RateRecordPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RateRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RateRecordCountArgs} args - Arguments to filter RateRecords to count.
     * @example
     * // Count the number of RateRecords
     * const count = await prisma.rateRecord.count({
     *   where: {
     *     // ... the filter for the RateRecords we want to count
     *   }
     * })
    **/
    count<T extends RateRecordCountArgs>(
      args?: Subset<T, RateRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RateRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RateRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RateRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RateRecordAggregateArgs>(args: Subset<T, RateRecordAggregateArgs>): Prisma.PrismaPromise<GetRateRecordAggregateType<T>>

    /**
     * Group by RateRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RateRecordGroupByArgs} args - Group by arguments.
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
      T extends RateRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RateRecordGroupByArgs['orderBy'] }
        : { orderBy?: RateRecordGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RateRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRateRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RateRecord model
   */
  readonly fields: RateRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RateRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RateRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    property<T extends PropertyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PropertyDefaultArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    roomType<T extends RoomTypeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoomTypeDefaultArgs<ExtArgs>>): Prisma__RoomTypeClient<$Result.GetResult<Prisma.$RoomTypePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the RateRecord model
   */ 
  interface RateRecordFieldRefs {
    readonly id: FieldRef<"RateRecord", 'String'>
    readonly propertyId: FieldRef<"RateRecord", 'String'>
    readonly roomTypeId: FieldRef<"RateRecord", 'String'>
    readonly date: FieldRef<"RateRecord", 'DateTime'>
    readonly rate: FieldRef<"RateRecord", 'Float'>
    readonly currency: FieldRef<"RateRecord", 'String'>
    readonly rateType: FieldRef<"RateRecord", 'String'>
    readonly minimumStay: FieldRef<"RateRecord", 'Int'>
    readonly maximumStay: FieldRef<"RateRecord", 'Int'>
    readonly advanceBookingDays: FieldRef<"RateRecord", 'Int'>
    readonly restrictions: FieldRef<"RateRecord", 'Json'>
    readonly createdAt: FieldRef<"RateRecord", 'DateTime'>
    readonly updatedAt: FieldRef<"RateRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RateRecord findUnique
   */
  export type RateRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateRecord
     */
    select?: RateRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RateRecordInclude<ExtArgs> | null
    /**
     * Filter, which RateRecord to fetch.
     */
    where: RateRecordWhereUniqueInput
  }

  /**
   * RateRecord findUniqueOrThrow
   */
  export type RateRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateRecord
     */
    select?: RateRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RateRecordInclude<ExtArgs> | null
    /**
     * Filter, which RateRecord to fetch.
     */
    where: RateRecordWhereUniqueInput
  }

  /**
   * RateRecord findFirst
   */
  export type RateRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateRecord
     */
    select?: RateRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RateRecordInclude<ExtArgs> | null
    /**
     * Filter, which RateRecord to fetch.
     */
    where?: RateRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RateRecords to fetch.
     */
    orderBy?: RateRecordOrderByWithRelationInput | RateRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RateRecords.
     */
    cursor?: RateRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RateRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RateRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RateRecords.
     */
    distinct?: RateRecordScalarFieldEnum | RateRecordScalarFieldEnum[]
  }

  /**
   * RateRecord findFirstOrThrow
   */
  export type RateRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateRecord
     */
    select?: RateRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RateRecordInclude<ExtArgs> | null
    /**
     * Filter, which RateRecord to fetch.
     */
    where?: RateRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RateRecords to fetch.
     */
    orderBy?: RateRecordOrderByWithRelationInput | RateRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RateRecords.
     */
    cursor?: RateRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RateRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RateRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RateRecords.
     */
    distinct?: RateRecordScalarFieldEnum | RateRecordScalarFieldEnum[]
  }

  /**
   * RateRecord findMany
   */
  export type RateRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateRecord
     */
    select?: RateRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RateRecordInclude<ExtArgs> | null
    /**
     * Filter, which RateRecords to fetch.
     */
    where?: RateRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RateRecords to fetch.
     */
    orderBy?: RateRecordOrderByWithRelationInput | RateRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RateRecords.
     */
    cursor?: RateRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RateRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RateRecords.
     */
    skip?: number
    distinct?: RateRecordScalarFieldEnum | RateRecordScalarFieldEnum[]
  }

  /**
   * RateRecord create
   */
  export type RateRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateRecord
     */
    select?: RateRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RateRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a RateRecord.
     */
    data: XOR<RateRecordCreateInput, RateRecordUncheckedCreateInput>
  }

  /**
   * RateRecord createMany
   */
  export type RateRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RateRecords.
     */
    data: RateRecordCreateManyInput | RateRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RateRecord createManyAndReturn
   */
  export type RateRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateRecord
     */
    select?: RateRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RateRecords.
     */
    data: RateRecordCreateManyInput | RateRecordCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RateRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RateRecord update
   */
  export type RateRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateRecord
     */
    select?: RateRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RateRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a RateRecord.
     */
    data: XOR<RateRecordUpdateInput, RateRecordUncheckedUpdateInput>
    /**
     * Choose, which RateRecord to update.
     */
    where: RateRecordWhereUniqueInput
  }

  /**
   * RateRecord updateMany
   */
  export type RateRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RateRecords.
     */
    data: XOR<RateRecordUpdateManyMutationInput, RateRecordUncheckedUpdateManyInput>
    /**
     * Filter which RateRecords to update
     */
    where?: RateRecordWhereInput
  }

  /**
   * RateRecord upsert
   */
  export type RateRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateRecord
     */
    select?: RateRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RateRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the RateRecord to update in case it exists.
     */
    where: RateRecordWhereUniqueInput
    /**
     * In case the RateRecord found by the `where` argument doesn't exist, create a new RateRecord with this data.
     */
    create: XOR<RateRecordCreateInput, RateRecordUncheckedCreateInput>
    /**
     * In case the RateRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RateRecordUpdateInput, RateRecordUncheckedUpdateInput>
  }

  /**
   * RateRecord delete
   */
  export type RateRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateRecord
     */
    select?: RateRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RateRecordInclude<ExtArgs> | null
    /**
     * Filter which RateRecord to delete.
     */
    where: RateRecordWhereUniqueInput
  }

  /**
   * RateRecord deleteMany
   */
  export type RateRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RateRecords to delete
     */
    where?: RateRecordWhereInput
  }

  /**
   * RateRecord without action
   */
  export type RateRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RateRecord
     */
    select?: RateRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RateRecordInclude<ExtArgs> | null
  }


  /**
   * Model DynamicPricingRule
   */

  export type AggregateDynamicPricingRule = {
    _count: DynamicPricingRuleCountAggregateOutputType | null
    _avg: DynamicPricingRuleAvgAggregateOutputType | null
    _sum: DynamicPricingRuleSumAggregateOutputType | null
    _min: DynamicPricingRuleMinAggregateOutputType | null
    _max: DynamicPricingRuleMaxAggregateOutputType | null
  }

  export type DynamicPricingRuleAvgAggregateOutputType = {
    priority: number | null
  }

  export type DynamicPricingRuleSumAggregateOutputType = {
    priority: number | null
  }

  export type DynamicPricingRuleMinAggregateOutputType = {
    id: string | null
    propertyId: string | null
    name: string | null
    description: string | null
    type: string | null
    isActive: boolean | null
    priority: number | null
    validFrom: Date | null
    validTo: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DynamicPricingRuleMaxAggregateOutputType = {
    id: string | null
    propertyId: string | null
    name: string | null
    description: string | null
    type: string | null
    isActive: boolean | null
    priority: number | null
    validFrom: Date | null
    validTo: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DynamicPricingRuleCountAggregateOutputType = {
    id: number
    propertyId: number
    name: number
    description: number
    type: number
    isActive: number
    priority: number
    conditions: number
    adjustments: number
    validFrom: number
    validTo: number
    applicableRoomTypes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DynamicPricingRuleAvgAggregateInputType = {
    priority?: true
  }

  export type DynamicPricingRuleSumAggregateInputType = {
    priority?: true
  }

  export type DynamicPricingRuleMinAggregateInputType = {
    id?: true
    propertyId?: true
    name?: true
    description?: true
    type?: true
    isActive?: true
    priority?: true
    validFrom?: true
    validTo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DynamicPricingRuleMaxAggregateInputType = {
    id?: true
    propertyId?: true
    name?: true
    description?: true
    type?: true
    isActive?: true
    priority?: true
    validFrom?: true
    validTo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DynamicPricingRuleCountAggregateInputType = {
    id?: true
    propertyId?: true
    name?: true
    description?: true
    type?: true
    isActive?: true
    priority?: true
    conditions?: true
    adjustments?: true
    validFrom?: true
    validTo?: true
    applicableRoomTypes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DynamicPricingRuleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DynamicPricingRule to aggregate.
     */
    where?: DynamicPricingRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DynamicPricingRules to fetch.
     */
    orderBy?: DynamicPricingRuleOrderByWithRelationInput | DynamicPricingRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DynamicPricingRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DynamicPricingRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DynamicPricingRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DynamicPricingRules
    **/
    _count?: true | DynamicPricingRuleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DynamicPricingRuleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DynamicPricingRuleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DynamicPricingRuleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DynamicPricingRuleMaxAggregateInputType
  }

  export type GetDynamicPricingRuleAggregateType<T extends DynamicPricingRuleAggregateArgs> = {
        [P in keyof T & keyof AggregateDynamicPricingRule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDynamicPricingRule[P]>
      : GetScalarType<T[P], AggregateDynamicPricingRule[P]>
  }




  export type DynamicPricingRuleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DynamicPricingRuleWhereInput
    orderBy?: DynamicPricingRuleOrderByWithAggregationInput | DynamicPricingRuleOrderByWithAggregationInput[]
    by: DynamicPricingRuleScalarFieldEnum[] | DynamicPricingRuleScalarFieldEnum
    having?: DynamicPricingRuleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DynamicPricingRuleCountAggregateInputType | true
    _avg?: DynamicPricingRuleAvgAggregateInputType
    _sum?: DynamicPricingRuleSumAggregateInputType
    _min?: DynamicPricingRuleMinAggregateInputType
    _max?: DynamicPricingRuleMaxAggregateInputType
  }

  export type DynamicPricingRuleGroupByOutputType = {
    id: string
    propertyId: string
    name: string
    description: string
    type: string
    isActive: boolean
    priority: number
    conditions: JsonValue
    adjustments: JsonValue
    validFrom: Date
    validTo: Date
    applicableRoomTypes: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: DynamicPricingRuleCountAggregateOutputType | null
    _avg: DynamicPricingRuleAvgAggregateOutputType | null
    _sum: DynamicPricingRuleSumAggregateOutputType | null
    _min: DynamicPricingRuleMinAggregateOutputType | null
    _max: DynamicPricingRuleMaxAggregateOutputType | null
  }

  type GetDynamicPricingRuleGroupByPayload<T extends DynamicPricingRuleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DynamicPricingRuleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DynamicPricingRuleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DynamicPricingRuleGroupByOutputType[P]>
            : GetScalarType<T[P], DynamicPricingRuleGroupByOutputType[P]>
        }
      >
    >


  export type DynamicPricingRuleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    isActive?: boolean
    priority?: boolean
    conditions?: boolean
    adjustments?: boolean
    validFrom?: boolean
    validTo?: boolean
    applicableRoomTypes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["dynamicPricingRule"]>

  export type DynamicPricingRuleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    isActive?: boolean
    priority?: boolean
    conditions?: boolean
    adjustments?: boolean
    validFrom?: boolean
    validTo?: boolean
    applicableRoomTypes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["dynamicPricingRule"]>

  export type DynamicPricingRuleSelectScalar = {
    id?: boolean
    propertyId?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    isActive?: boolean
    priority?: boolean
    conditions?: boolean
    adjustments?: boolean
    validFrom?: boolean
    validTo?: boolean
    applicableRoomTypes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $DynamicPricingRulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DynamicPricingRule"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      propertyId: string
      name: string
      description: string
      type: string
      isActive: boolean
      priority: number
      conditions: Prisma.JsonValue
      adjustments: Prisma.JsonValue
      validFrom: Date
      validTo: Date
      applicableRoomTypes: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["dynamicPricingRule"]>
    composites: {}
  }

  type DynamicPricingRuleGetPayload<S extends boolean | null | undefined | DynamicPricingRuleDefaultArgs> = $Result.GetResult<Prisma.$DynamicPricingRulePayload, S>

  type DynamicPricingRuleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DynamicPricingRuleFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DynamicPricingRuleCountAggregateInputType | true
    }

  export interface DynamicPricingRuleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DynamicPricingRule'], meta: { name: 'DynamicPricingRule' } }
    /**
     * Find zero or one DynamicPricingRule that matches the filter.
     * @param {DynamicPricingRuleFindUniqueArgs} args - Arguments to find a DynamicPricingRule
     * @example
     * // Get one DynamicPricingRule
     * const dynamicPricingRule = await prisma.dynamicPricingRule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DynamicPricingRuleFindUniqueArgs>(args: SelectSubset<T, DynamicPricingRuleFindUniqueArgs<ExtArgs>>): Prisma__DynamicPricingRuleClient<$Result.GetResult<Prisma.$DynamicPricingRulePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DynamicPricingRule that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DynamicPricingRuleFindUniqueOrThrowArgs} args - Arguments to find a DynamicPricingRule
     * @example
     * // Get one DynamicPricingRule
     * const dynamicPricingRule = await prisma.dynamicPricingRule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DynamicPricingRuleFindUniqueOrThrowArgs>(args: SelectSubset<T, DynamicPricingRuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DynamicPricingRuleClient<$Result.GetResult<Prisma.$DynamicPricingRulePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DynamicPricingRule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DynamicPricingRuleFindFirstArgs} args - Arguments to find a DynamicPricingRule
     * @example
     * // Get one DynamicPricingRule
     * const dynamicPricingRule = await prisma.dynamicPricingRule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DynamicPricingRuleFindFirstArgs>(args?: SelectSubset<T, DynamicPricingRuleFindFirstArgs<ExtArgs>>): Prisma__DynamicPricingRuleClient<$Result.GetResult<Prisma.$DynamicPricingRulePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DynamicPricingRule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DynamicPricingRuleFindFirstOrThrowArgs} args - Arguments to find a DynamicPricingRule
     * @example
     * // Get one DynamicPricingRule
     * const dynamicPricingRule = await prisma.dynamicPricingRule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DynamicPricingRuleFindFirstOrThrowArgs>(args?: SelectSubset<T, DynamicPricingRuleFindFirstOrThrowArgs<ExtArgs>>): Prisma__DynamicPricingRuleClient<$Result.GetResult<Prisma.$DynamicPricingRulePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DynamicPricingRules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DynamicPricingRuleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DynamicPricingRules
     * const dynamicPricingRules = await prisma.dynamicPricingRule.findMany()
     * 
     * // Get first 10 DynamicPricingRules
     * const dynamicPricingRules = await prisma.dynamicPricingRule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dynamicPricingRuleWithIdOnly = await prisma.dynamicPricingRule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DynamicPricingRuleFindManyArgs>(args?: SelectSubset<T, DynamicPricingRuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DynamicPricingRulePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DynamicPricingRule.
     * @param {DynamicPricingRuleCreateArgs} args - Arguments to create a DynamicPricingRule.
     * @example
     * // Create one DynamicPricingRule
     * const DynamicPricingRule = await prisma.dynamicPricingRule.create({
     *   data: {
     *     // ... data to create a DynamicPricingRule
     *   }
     * })
     * 
     */
    create<T extends DynamicPricingRuleCreateArgs>(args: SelectSubset<T, DynamicPricingRuleCreateArgs<ExtArgs>>): Prisma__DynamicPricingRuleClient<$Result.GetResult<Prisma.$DynamicPricingRulePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DynamicPricingRules.
     * @param {DynamicPricingRuleCreateManyArgs} args - Arguments to create many DynamicPricingRules.
     * @example
     * // Create many DynamicPricingRules
     * const dynamicPricingRule = await prisma.dynamicPricingRule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DynamicPricingRuleCreateManyArgs>(args?: SelectSubset<T, DynamicPricingRuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DynamicPricingRules and returns the data saved in the database.
     * @param {DynamicPricingRuleCreateManyAndReturnArgs} args - Arguments to create many DynamicPricingRules.
     * @example
     * // Create many DynamicPricingRules
     * const dynamicPricingRule = await prisma.dynamicPricingRule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DynamicPricingRules and only return the `id`
     * const dynamicPricingRuleWithIdOnly = await prisma.dynamicPricingRule.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DynamicPricingRuleCreateManyAndReturnArgs>(args?: SelectSubset<T, DynamicPricingRuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DynamicPricingRulePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DynamicPricingRule.
     * @param {DynamicPricingRuleDeleteArgs} args - Arguments to delete one DynamicPricingRule.
     * @example
     * // Delete one DynamicPricingRule
     * const DynamicPricingRule = await prisma.dynamicPricingRule.delete({
     *   where: {
     *     // ... filter to delete one DynamicPricingRule
     *   }
     * })
     * 
     */
    delete<T extends DynamicPricingRuleDeleteArgs>(args: SelectSubset<T, DynamicPricingRuleDeleteArgs<ExtArgs>>): Prisma__DynamicPricingRuleClient<$Result.GetResult<Prisma.$DynamicPricingRulePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DynamicPricingRule.
     * @param {DynamicPricingRuleUpdateArgs} args - Arguments to update one DynamicPricingRule.
     * @example
     * // Update one DynamicPricingRule
     * const dynamicPricingRule = await prisma.dynamicPricingRule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DynamicPricingRuleUpdateArgs>(args: SelectSubset<T, DynamicPricingRuleUpdateArgs<ExtArgs>>): Prisma__DynamicPricingRuleClient<$Result.GetResult<Prisma.$DynamicPricingRulePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DynamicPricingRules.
     * @param {DynamicPricingRuleDeleteManyArgs} args - Arguments to filter DynamicPricingRules to delete.
     * @example
     * // Delete a few DynamicPricingRules
     * const { count } = await prisma.dynamicPricingRule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DynamicPricingRuleDeleteManyArgs>(args?: SelectSubset<T, DynamicPricingRuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DynamicPricingRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DynamicPricingRuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DynamicPricingRules
     * const dynamicPricingRule = await prisma.dynamicPricingRule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DynamicPricingRuleUpdateManyArgs>(args: SelectSubset<T, DynamicPricingRuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DynamicPricingRule.
     * @param {DynamicPricingRuleUpsertArgs} args - Arguments to update or create a DynamicPricingRule.
     * @example
     * // Update or create a DynamicPricingRule
     * const dynamicPricingRule = await prisma.dynamicPricingRule.upsert({
     *   create: {
     *     // ... data to create a DynamicPricingRule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DynamicPricingRule we want to update
     *   }
     * })
     */
    upsert<T extends DynamicPricingRuleUpsertArgs>(args: SelectSubset<T, DynamicPricingRuleUpsertArgs<ExtArgs>>): Prisma__DynamicPricingRuleClient<$Result.GetResult<Prisma.$DynamicPricingRulePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DynamicPricingRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DynamicPricingRuleCountArgs} args - Arguments to filter DynamicPricingRules to count.
     * @example
     * // Count the number of DynamicPricingRules
     * const count = await prisma.dynamicPricingRule.count({
     *   where: {
     *     // ... the filter for the DynamicPricingRules we want to count
     *   }
     * })
    **/
    count<T extends DynamicPricingRuleCountArgs>(
      args?: Subset<T, DynamicPricingRuleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DynamicPricingRuleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DynamicPricingRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DynamicPricingRuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DynamicPricingRuleAggregateArgs>(args: Subset<T, DynamicPricingRuleAggregateArgs>): Prisma.PrismaPromise<GetDynamicPricingRuleAggregateType<T>>

    /**
     * Group by DynamicPricingRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DynamicPricingRuleGroupByArgs} args - Group by arguments.
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
      T extends DynamicPricingRuleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DynamicPricingRuleGroupByArgs['orderBy'] }
        : { orderBy?: DynamicPricingRuleGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DynamicPricingRuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDynamicPricingRuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DynamicPricingRule model
   */
  readonly fields: DynamicPricingRuleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DynamicPricingRule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DynamicPricingRuleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the DynamicPricingRule model
   */ 
  interface DynamicPricingRuleFieldRefs {
    readonly id: FieldRef<"DynamicPricingRule", 'String'>
    readonly propertyId: FieldRef<"DynamicPricingRule", 'String'>
    readonly name: FieldRef<"DynamicPricingRule", 'String'>
    readonly description: FieldRef<"DynamicPricingRule", 'String'>
    readonly type: FieldRef<"DynamicPricingRule", 'String'>
    readonly isActive: FieldRef<"DynamicPricingRule", 'Boolean'>
    readonly priority: FieldRef<"DynamicPricingRule", 'Int'>
    readonly conditions: FieldRef<"DynamicPricingRule", 'Json'>
    readonly adjustments: FieldRef<"DynamicPricingRule", 'Json'>
    readonly validFrom: FieldRef<"DynamicPricingRule", 'DateTime'>
    readonly validTo: FieldRef<"DynamicPricingRule", 'DateTime'>
    readonly applicableRoomTypes: FieldRef<"DynamicPricingRule", 'Json'>
    readonly createdAt: FieldRef<"DynamicPricingRule", 'DateTime'>
    readonly updatedAt: FieldRef<"DynamicPricingRule", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DynamicPricingRule findUnique
   */
  export type DynamicPricingRuleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DynamicPricingRule
     */
    select?: DynamicPricingRuleSelect<ExtArgs> | null
    /**
     * Filter, which DynamicPricingRule to fetch.
     */
    where: DynamicPricingRuleWhereUniqueInput
  }

  /**
   * DynamicPricingRule findUniqueOrThrow
   */
  export type DynamicPricingRuleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DynamicPricingRule
     */
    select?: DynamicPricingRuleSelect<ExtArgs> | null
    /**
     * Filter, which DynamicPricingRule to fetch.
     */
    where: DynamicPricingRuleWhereUniqueInput
  }

  /**
   * DynamicPricingRule findFirst
   */
  export type DynamicPricingRuleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DynamicPricingRule
     */
    select?: DynamicPricingRuleSelect<ExtArgs> | null
    /**
     * Filter, which DynamicPricingRule to fetch.
     */
    where?: DynamicPricingRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DynamicPricingRules to fetch.
     */
    orderBy?: DynamicPricingRuleOrderByWithRelationInput | DynamicPricingRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DynamicPricingRules.
     */
    cursor?: DynamicPricingRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DynamicPricingRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DynamicPricingRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DynamicPricingRules.
     */
    distinct?: DynamicPricingRuleScalarFieldEnum | DynamicPricingRuleScalarFieldEnum[]
  }

  /**
   * DynamicPricingRule findFirstOrThrow
   */
  export type DynamicPricingRuleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DynamicPricingRule
     */
    select?: DynamicPricingRuleSelect<ExtArgs> | null
    /**
     * Filter, which DynamicPricingRule to fetch.
     */
    where?: DynamicPricingRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DynamicPricingRules to fetch.
     */
    orderBy?: DynamicPricingRuleOrderByWithRelationInput | DynamicPricingRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DynamicPricingRules.
     */
    cursor?: DynamicPricingRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DynamicPricingRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DynamicPricingRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DynamicPricingRules.
     */
    distinct?: DynamicPricingRuleScalarFieldEnum | DynamicPricingRuleScalarFieldEnum[]
  }

  /**
   * DynamicPricingRule findMany
   */
  export type DynamicPricingRuleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DynamicPricingRule
     */
    select?: DynamicPricingRuleSelect<ExtArgs> | null
    /**
     * Filter, which DynamicPricingRules to fetch.
     */
    where?: DynamicPricingRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DynamicPricingRules to fetch.
     */
    orderBy?: DynamicPricingRuleOrderByWithRelationInput | DynamicPricingRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DynamicPricingRules.
     */
    cursor?: DynamicPricingRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DynamicPricingRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DynamicPricingRules.
     */
    skip?: number
    distinct?: DynamicPricingRuleScalarFieldEnum | DynamicPricingRuleScalarFieldEnum[]
  }

  /**
   * DynamicPricingRule create
   */
  export type DynamicPricingRuleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DynamicPricingRule
     */
    select?: DynamicPricingRuleSelect<ExtArgs> | null
    /**
     * The data needed to create a DynamicPricingRule.
     */
    data: XOR<DynamicPricingRuleCreateInput, DynamicPricingRuleUncheckedCreateInput>
  }

  /**
   * DynamicPricingRule createMany
   */
  export type DynamicPricingRuleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DynamicPricingRules.
     */
    data: DynamicPricingRuleCreateManyInput | DynamicPricingRuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DynamicPricingRule createManyAndReturn
   */
  export type DynamicPricingRuleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DynamicPricingRule
     */
    select?: DynamicPricingRuleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DynamicPricingRules.
     */
    data: DynamicPricingRuleCreateManyInput | DynamicPricingRuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DynamicPricingRule update
   */
  export type DynamicPricingRuleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DynamicPricingRule
     */
    select?: DynamicPricingRuleSelect<ExtArgs> | null
    /**
     * The data needed to update a DynamicPricingRule.
     */
    data: XOR<DynamicPricingRuleUpdateInput, DynamicPricingRuleUncheckedUpdateInput>
    /**
     * Choose, which DynamicPricingRule to update.
     */
    where: DynamicPricingRuleWhereUniqueInput
  }

  /**
   * DynamicPricingRule updateMany
   */
  export type DynamicPricingRuleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DynamicPricingRules.
     */
    data: XOR<DynamicPricingRuleUpdateManyMutationInput, DynamicPricingRuleUncheckedUpdateManyInput>
    /**
     * Filter which DynamicPricingRules to update
     */
    where?: DynamicPricingRuleWhereInput
  }

  /**
   * DynamicPricingRule upsert
   */
  export type DynamicPricingRuleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DynamicPricingRule
     */
    select?: DynamicPricingRuleSelect<ExtArgs> | null
    /**
     * The filter to search for the DynamicPricingRule to update in case it exists.
     */
    where: DynamicPricingRuleWhereUniqueInput
    /**
     * In case the DynamicPricingRule found by the `where` argument doesn't exist, create a new DynamicPricingRule with this data.
     */
    create: XOR<DynamicPricingRuleCreateInput, DynamicPricingRuleUncheckedCreateInput>
    /**
     * In case the DynamicPricingRule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DynamicPricingRuleUpdateInput, DynamicPricingRuleUncheckedUpdateInput>
  }

  /**
   * DynamicPricingRule delete
   */
  export type DynamicPricingRuleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DynamicPricingRule
     */
    select?: DynamicPricingRuleSelect<ExtArgs> | null
    /**
     * Filter which DynamicPricingRule to delete.
     */
    where: DynamicPricingRuleWhereUniqueInput
  }

  /**
   * DynamicPricingRule deleteMany
   */
  export type DynamicPricingRuleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DynamicPricingRules to delete
     */
    where?: DynamicPricingRuleWhereInput
  }

  /**
   * DynamicPricingRule without action
   */
  export type DynamicPricingRuleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DynamicPricingRule
     */
    select?: DynamicPricingRuleSelect<ExtArgs> | null
  }


  /**
   * Model SeasonalRate
   */

  export type AggregateSeasonalRate = {
    _count: SeasonalRateCountAggregateOutputType | null
    _avg: SeasonalRateAvgAggregateOutputType | null
    _sum: SeasonalRateSumAggregateOutputType | null
    _min: SeasonalRateMinAggregateOutputType | null
    _max: SeasonalRateMaxAggregateOutputType | null
  }

  export type SeasonalRateAvgAggregateOutputType = {
    priority: number | null
  }

  export type SeasonalRateSumAggregateOutputType = {
    priority: number | null
  }

  export type SeasonalRateMinAggregateOutputType = {
    id: string | null
    propertyId: string | null
    name: string | null
    description: string | null
    startDate: Date | null
    endDate: Date | null
    isActive: boolean | null
    priority: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SeasonalRateMaxAggregateOutputType = {
    id: string | null
    propertyId: string | null
    name: string | null
    description: string | null
    startDate: Date | null
    endDate: Date | null
    isActive: boolean | null
    priority: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SeasonalRateCountAggregateOutputType = {
    id: number
    propertyId: number
    name: number
    description: number
    startDate: number
    endDate: number
    roomTypeRates: number
    isActive: number
    priority: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SeasonalRateAvgAggregateInputType = {
    priority?: true
  }

  export type SeasonalRateSumAggregateInputType = {
    priority?: true
  }

  export type SeasonalRateMinAggregateInputType = {
    id?: true
    propertyId?: true
    name?: true
    description?: true
    startDate?: true
    endDate?: true
    isActive?: true
    priority?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SeasonalRateMaxAggregateInputType = {
    id?: true
    propertyId?: true
    name?: true
    description?: true
    startDate?: true
    endDate?: true
    isActive?: true
    priority?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SeasonalRateCountAggregateInputType = {
    id?: true
    propertyId?: true
    name?: true
    description?: true
    startDate?: true
    endDate?: true
    roomTypeRates?: true
    isActive?: true
    priority?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SeasonalRateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SeasonalRate to aggregate.
     */
    where?: SeasonalRateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeasonalRates to fetch.
     */
    orderBy?: SeasonalRateOrderByWithRelationInput | SeasonalRateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SeasonalRateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeasonalRates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeasonalRates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SeasonalRates
    **/
    _count?: true | SeasonalRateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SeasonalRateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SeasonalRateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SeasonalRateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SeasonalRateMaxAggregateInputType
  }

  export type GetSeasonalRateAggregateType<T extends SeasonalRateAggregateArgs> = {
        [P in keyof T & keyof AggregateSeasonalRate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSeasonalRate[P]>
      : GetScalarType<T[P], AggregateSeasonalRate[P]>
  }




  export type SeasonalRateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SeasonalRateWhereInput
    orderBy?: SeasonalRateOrderByWithAggregationInput | SeasonalRateOrderByWithAggregationInput[]
    by: SeasonalRateScalarFieldEnum[] | SeasonalRateScalarFieldEnum
    having?: SeasonalRateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SeasonalRateCountAggregateInputType | true
    _avg?: SeasonalRateAvgAggregateInputType
    _sum?: SeasonalRateSumAggregateInputType
    _min?: SeasonalRateMinAggregateInputType
    _max?: SeasonalRateMaxAggregateInputType
  }

  export type SeasonalRateGroupByOutputType = {
    id: string
    propertyId: string
    name: string
    description: string
    startDate: Date
    endDate: Date
    roomTypeRates: JsonValue
    isActive: boolean
    priority: number
    createdAt: Date
    updatedAt: Date
    _count: SeasonalRateCountAggregateOutputType | null
    _avg: SeasonalRateAvgAggregateOutputType | null
    _sum: SeasonalRateSumAggregateOutputType | null
    _min: SeasonalRateMinAggregateOutputType | null
    _max: SeasonalRateMaxAggregateOutputType | null
  }

  type GetSeasonalRateGroupByPayload<T extends SeasonalRateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SeasonalRateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SeasonalRateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SeasonalRateGroupByOutputType[P]>
            : GetScalarType<T[P], SeasonalRateGroupByOutputType[P]>
        }
      >
    >


  export type SeasonalRateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    name?: boolean
    description?: boolean
    startDate?: boolean
    endDate?: boolean
    roomTypeRates?: boolean
    isActive?: boolean
    priority?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["seasonalRate"]>

  export type SeasonalRateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    name?: boolean
    description?: boolean
    startDate?: boolean
    endDate?: boolean
    roomTypeRates?: boolean
    isActive?: boolean
    priority?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["seasonalRate"]>

  export type SeasonalRateSelectScalar = {
    id?: boolean
    propertyId?: boolean
    name?: boolean
    description?: boolean
    startDate?: boolean
    endDate?: boolean
    roomTypeRates?: boolean
    isActive?: boolean
    priority?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $SeasonalRatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SeasonalRate"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      propertyId: string
      name: string
      description: string
      startDate: Date
      endDate: Date
      roomTypeRates: Prisma.JsonValue
      isActive: boolean
      priority: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["seasonalRate"]>
    composites: {}
  }

  type SeasonalRateGetPayload<S extends boolean | null | undefined | SeasonalRateDefaultArgs> = $Result.GetResult<Prisma.$SeasonalRatePayload, S>

  type SeasonalRateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SeasonalRateFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SeasonalRateCountAggregateInputType | true
    }

  export interface SeasonalRateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SeasonalRate'], meta: { name: 'SeasonalRate' } }
    /**
     * Find zero or one SeasonalRate that matches the filter.
     * @param {SeasonalRateFindUniqueArgs} args - Arguments to find a SeasonalRate
     * @example
     * // Get one SeasonalRate
     * const seasonalRate = await prisma.seasonalRate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SeasonalRateFindUniqueArgs>(args: SelectSubset<T, SeasonalRateFindUniqueArgs<ExtArgs>>): Prisma__SeasonalRateClient<$Result.GetResult<Prisma.$SeasonalRatePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SeasonalRate that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SeasonalRateFindUniqueOrThrowArgs} args - Arguments to find a SeasonalRate
     * @example
     * // Get one SeasonalRate
     * const seasonalRate = await prisma.seasonalRate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SeasonalRateFindUniqueOrThrowArgs>(args: SelectSubset<T, SeasonalRateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SeasonalRateClient<$Result.GetResult<Prisma.$SeasonalRatePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SeasonalRate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonalRateFindFirstArgs} args - Arguments to find a SeasonalRate
     * @example
     * // Get one SeasonalRate
     * const seasonalRate = await prisma.seasonalRate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SeasonalRateFindFirstArgs>(args?: SelectSubset<T, SeasonalRateFindFirstArgs<ExtArgs>>): Prisma__SeasonalRateClient<$Result.GetResult<Prisma.$SeasonalRatePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SeasonalRate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonalRateFindFirstOrThrowArgs} args - Arguments to find a SeasonalRate
     * @example
     * // Get one SeasonalRate
     * const seasonalRate = await prisma.seasonalRate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SeasonalRateFindFirstOrThrowArgs>(args?: SelectSubset<T, SeasonalRateFindFirstOrThrowArgs<ExtArgs>>): Prisma__SeasonalRateClient<$Result.GetResult<Prisma.$SeasonalRatePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SeasonalRates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonalRateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SeasonalRates
     * const seasonalRates = await prisma.seasonalRate.findMany()
     * 
     * // Get first 10 SeasonalRates
     * const seasonalRates = await prisma.seasonalRate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const seasonalRateWithIdOnly = await prisma.seasonalRate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SeasonalRateFindManyArgs>(args?: SelectSubset<T, SeasonalRateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeasonalRatePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SeasonalRate.
     * @param {SeasonalRateCreateArgs} args - Arguments to create a SeasonalRate.
     * @example
     * // Create one SeasonalRate
     * const SeasonalRate = await prisma.seasonalRate.create({
     *   data: {
     *     // ... data to create a SeasonalRate
     *   }
     * })
     * 
     */
    create<T extends SeasonalRateCreateArgs>(args: SelectSubset<T, SeasonalRateCreateArgs<ExtArgs>>): Prisma__SeasonalRateClient<$Result.GetResult<Prisma.$SeasonalRatePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SeasonalRates.
     * @param {SeasonalRateCreateManyArgs} args - Arguments to create many SeasonalRates.
     * @example
     * // Create many SeasonalRates
     * const seasonalRate = await prisma.seasonalRate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SeasonalRateCreateManyArgs>(args?: SelectSubset<T, SeasonalRateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SeasonalRates and returns the data saved in the database.
     * @param {SeasonalRateCreateManyAndReturnArgs} args - Arguments to create many SeasonalRates.
     * @example
     * // Create many SeasonalRates
     * const seasonalRate = await prisma.seasonalRate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SeasonalRates and only return the `id`
     * const seasonalRateWithIdOnly = await prisma.seasonalRate.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SeasonalRateCreateManyAndReturnArgs>(args?: SelectSubset<T, SeasonalRateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeasonalRatePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SeasonalRate.
     * @param {SeasonalRateDeleteArgs} args - Arguments to delete one SeasonalRate.
     * @example
     * // Delete one SeasonalRate
     * const SeasonalRate = await prisma.seasonalRate.delete({
     *   where: {
     *     // ... filter to delete one SeasonalRate
     *   }
     * })
     * 
     */
    delete<T extends SeasonalRateDeleteArgs>(args: SelectSubset<T, SeasonalRateDeleteArgs<ExtArgs>>): Prisma__SeasonalRateClient<$Result.GetResult<Prisma.$SeasonalRatePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SeasonalRate.
     * @param {SeasonalRateUpdateArgs} args - Arguments to update one SeasonalRate.
     * @example
     * // Update one SeasonalRate
     * const seasonalRate = await prisma.seasonalRate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SeasonalRateUpdateArgs>(args: SelectSubset<T, SeasonalRateUpdateArgs<ExtArgs>>): Prisma__SeasonalRateClient<$Result.GetResult<Prisma.$SeasonalRatePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SeasonalRates.
     * @param {SeasonalRateDeleteManyArgs} args - Arguments to filter SeasonalRates to delete.
     * @example
     * // Delete a few SeasonalRates
     * const { count } = await prisma.seasonalRate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SeasonalRateDeleteManyArgs>(args?: SelectSubset<T, SeasonalRateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SeasonalRates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonalRateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SeasonalRates
     * const seasonalRate = await prisma.seasonalRate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SeasonalRateUpdateManyArgs>(args: SelectSubset<T, SeasonalRateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SeasonalRate.
     * @param {SeasonalRateUpsertArgs} args - Arguments to update or create a SeasonalRate.
     * @example
     * // Update or create a SeasonalRate
     * const seasonalRate = await prisma.seasonalRate.upsert({
     *   create: {
     *     // ... data to create a SeasonalRate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SeasonalRate we want to update
     *   }
     * })
     */
    upsert<T extends SeasonalRateUpsertArgs>(args: SelectSubset<T, SeasonalRateUpsertArgs<ExtArgs>>): Prisma__SeasonalRateClient<$Result.GetResult<Prisma.$SeasonalRatePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SeasonalRates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonalRateCountArgs} args - Arguments to filter SeasonalRates to count.
     * @example
     * // Count the number of SeasonalRates
     * const count = await prisma.seasonalRate.count({
     *   where: {
     *     // ... the filter for the SeasonalRates we want to count
     *   }
     * })
    **/
    count<T extends SeasonalRateCountArgs>(
      args?: Subset<T, SeasonalRateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SeasonalRateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SeasonalRate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonalRateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SeasonalRateAggregateArgs>(args: Subset<T, SeasonalRateAggregateArgs>): Prisma.PrismaPromise<GetSeasonalRateAggregateType<T>>

    /**
     * Group by SeasonalRate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeasonalRateGroupByArgs} args - Group by arguments.
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
      T extends SeasonalRateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SeasonalRateGroupByArgs['orderBy'] }
        : { orderBy?: SeasonalRateGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SeasonalRateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSeasonalRateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SeasonalRate model
   */
  readonly fields: SeasonalRateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SeasonalRate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SeasonalRateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the SeasonalRate model
   */ 
  interface SeasonalRateFieldRefs {
    readonly id: FieldRef<"SeasonalRate", 'String'>
    readonly propertyId: FieldRef<"SeasonalRate", 'String'>
    readonly name: FieldRef<"SeasonalRate", 'String'>
    readonly description: FieldRef<"SeasonalRate", 'String'>
    readonly startDate: FieldRef<"SeasonalRate", 'DateTime'>
    readonly endDate: FieldRef<"SeasonalRate", 'DateTime'>
    readonly roomTypeRates: FieldRef<"SeasonalRate", 'Json'>
    readonly isActive: FieldRef<"SeasonalRate", 'Boolean'>
    readonly priority: FieldRef<"SeasonalRate", 'Int'>
    readonly createdAt: FieldRef<"SeasonalRate", 'DateTime'>
    readonly updatedAt: FieldRef<"SeasonalRate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SeasonalRate findUnique
   */
  export type SeasonalRateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonalRate
     */
    select?: SeasonalRateSelect<ExtArgs> | null
    /**
     * Filter, which SeasonalRate to fetch.
     */
    where: SeasonalRateWhereUniqueInput
  }

  /**
   * SeasonalRate findUniqueOrThrow
   */
  export type SeasonalRateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonalRate
     */
    select?: SeasonalRateSelect<ExtArgs> | null
    /**
     * Filter, which SeasonalRate to fetch.
     */
    where: SeasonalRateWhereUniqueInput
  }

  /**
   * SeasonalRate findFirst
   */
  export type SeasonalRateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonalRate
     */
    select?: SeasonalRateSelect<ExtArgs> | null
    /**
     * Filter, which SeasonalRate to fetch.
     */
    where?: SeasonalRateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeasonalRates to fetch.
     */
    orderBy?: SeasonalRateOrderByWithRelationInput | SeasonalRateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SeasonalRates.
     */
    cursor?: SeasonalRateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeasonalRates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeasonalRates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SeasonalRates.
     */
    distinct?: SeasonalRateScalarFieldEnum | SeasonalRateScalarFieldEnum[]
  }

  /**
   * SeasonalRate findFirstOrThrow
   */
  export type SeasonalRateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonalRate
     */
    select?: SeasonalRateSelect<ExtArgs> | null
    /**
     * Filter, which SeasonalRate to fetch.
     */
    where?: SeasonalRateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeasonalRates to fetch.
     */
    orderBy?: SeasonalRateOrderByWithRelationInput | SeasonalRateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SeasonalRates.
     */
    cursor?: SeasonalRateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeasonalRates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeasonalRates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SeasonalRates.
     */
    distinct?: SeasonalRateScalarFieldEnum | SeasonalRateScalarFieldEnum[]
  }

  /**
   * SeasonalRate findMany
   */
  export type SeasonalRateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonalRate
     */
    select?: SeasonalRateSelect<ExtArgs> | null
    /**
     * Filter, which SeasonalRates to fetch.
     */
    where?: SeasonalRateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SeasonalRates to fetch.
     */
    orderBy?: SeasonalRateOrderByWithRelationInput | SeasonalRateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SeasonalRates.
     */
    cursor?: SeasonalRateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SeasonalRates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SeasonalRates.
     */
    skip?: number
    distinct?: SeasonalRateScalarFieldEnum | SeasonalRateScalarFieldEnum[]
  }

  /**
   * SeasonalRate create
   */
  export type SeasonalRateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonalRate
     */
    select?: SeasonalRateSelect<ExtArgs> | null
    /**
     * The data needed to create a SeasonalRate.
     */
    data: XOR<SeasonalRateCreateInput, SeasonalRateUncheckedCreateInput>
  }

  /**
   * SeasonalRate createMany
   */
  export type SeasonalRateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SeasonalRates.
     */
    data: SeasonalRateCreateManyInput | SeasonalRateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SeasonalRate createManyAndReturn
   */
  export type SeasonalRateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonalRate
     */
    select?: SeasonalRateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SeasonalRates.
     */
    data: SeasonalRateCreateManyInput | SeasonalRateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SeasonalRate update
   */
  export type SeasonalRateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonalRate
     */
    select?: SeasonalRateSelect<ExtArgs> | null
    /**
     * The data needed to update a SeasonalRate.
     */
    data: XOR<SeasonalRateUpdateInput, SeasonalRateUncheckedUpdateInput>
    /**
     * Choose, which SeasonalRate to update.
     */
    where: SeasonalRateWhereUniqueInput
  }

  /**
   * SeasonalRate updateMany
   */
  export type SeasonalRateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SeasonalRates.
     */
    data: XOR<SeasonalRateUpdateManyMutationInput, SeasonalRateUncheckedUpdateManyInput>
    /**
     * Filter which SeasonalRates to update
     */
    where?: SeasonalRateWhereInput
  }

  /**
   * SeasonalRate upsert
   */
  export type SeasonalRateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonalRate
     */
    select?: SeasonalRateSelect<ExtArgs> | null
    /**
     * The filter to search for the SeasonalRate to update in case it exists.
     */
    where: SeasonalRateWhereUniqueInput
    /**
     * In case the SeasonalRate found by the `where` argument doesn't exist, create a new SeasonalRate with this data.
     */
    create: XOR<SeasonalRateCreateInput, SeasonalRateUncheckedCreateInput>
    /**
     * In case the SeasonalRate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SeasonalRateUpdateInput, SeasonalRateUncheckedUpdateInput>
  }

  /**
   * SeasonalRate delete
   */
  export type SeasonalRateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonalRate
     */
    select?: SeasonalRateSelect<ExtArgs> | null
    /**
     * Filter which SeasonalRate to delete.
     */
    where: SeasonalRateWhereUniqueInput
  }

  /**
   * SeasonalRate deleteMany
   */
  export type SeasonalRateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SeasonalRates to delete
     */
    where?: SeasonalRateWhereInput
  }

  /**
   * SeasonalRate without action
   */
  export type SeasonalRateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeasonalRate
     */
    select?: SeasonalRateSelect<ExtArgs> | null
  }


  /**
   * Model Promotion
   */

  export type AggregatePromotion = {
    _count: PromotionCountAggregateOutputType | null
    _avg: PromotionAvgAggregateOutputType | null
    _sum: PromotionSumAggregateOutputType | null
    _min: PromotionMinAggregateOutputType | null
    _max: PromotionMaxAggregateOutputType | null
  }

  export type PromotionAvgAggregateOutputType = {
    discountValue: number | null
    maxDiscount: number | null
  }

  export type PromotionSumAggregateOutputType = {
    discountValue: number | null
    maxDiscount: number | null
  }

  export type PromotionMinAggregateOutputType = {
    id: string | null
    propertyId: string | null
    code: string | null
    name: string | null
    description: string | null
    type: string | null
    discountType: string | null
    discountValue: number | null
    maxDiscount: number | null
    validFrom: Date | null
    validTo: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PromotionMaxAggregateOutputType = {
    id: string | null
    propertyId: string | null
    code: string | null
    name: string | null
    description: string | null
    type: string | null
    discountType: string | null
    discountValue: number | null
    maxDiscount: number | null
    validFrom: Date | null
    validTo: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PromotionCountAggregateOutputType = {
    id: number
    propertyId: number
    code: number
    name: number
    description: number
    type: number
    discountType: number
    discountValue: number
    maxDiscount: number
    validFrom: number
    validTo: number
    conditions: number
    usage: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PromotionAvgAggregateInputType = {
    discountValue?: true
    maxDiscount?: true
  }

  export type PromotionSumAggregateInputType = {
    discountValue?: true
    maxDiscount?: true
  }

  export type PromotionMinAggregateInputType = {
    id?: true
    propertyId?: true
    code?: true
    name?: true
    description?: true
    type?: true
    discountType?: true
    discountValue?: true
    maxDiscount?: true
    validFrom?: true
    validTo?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PromotionMaxAggregateInputType = {
    id?: true
    propertyId?: true
    code?: true
    name?: true
    description?: true
    type?: true
    discountType?: true
    discountValue?: true
    maxDiscount?: true
    validFrom?: true
    validTo?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PromotionCountAggregateInputType = {
    id?: true
    propertyId?: true
    code?: true
    name?: true
    description?: true
    type?: true
    discountType?: true
    discountValue?: true
    maxDiscount?: true
    validFrom?: true
    validTo?: true
    conditions?: true
    usage?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PromotionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Promotion to aggregate.
     */
    where?: PromotionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Promotions to fetch.
     */
    orderBy?: PromotionOrderByWithRelationInput | PromotionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PromotionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Promotions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Promotions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Promotions
    **/
    _count?: true | PromotionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PromotionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PromotionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PromotionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PromotionMaxAggregateInputType
  }

  export type GetPromotionAggregateType<T extends PromotionAggregateArgs> = {
        [P in keyof T & keyof AggregatePromotion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePromotion[P]>
      : GetScalarType<T[P], AggregatePromotion[P]>
  }




  export type PromotionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PromotionWhereInput
    orderBy?: PromotionOrderByWithAggregationInput | PromotionOrderByWithAggregationInput[]
    by: PromotionScalarFieldEnum[] | PromotionScalarFieldEnum
    having?: PromotionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PromotionCountAggregateInputType | true
    _avg?: PromotionAvgAggregateInputType
    _sum?: PromotionSumAggregateInputType
    _min?: PromotionMinAggregateInputType
    _max?: PromotionMaxAggregateInputType
  }

  export type PromotionGroupByOutputType = {
    id: string
    propertyId: string
    code: string | null
    name: string
    description: string
    type: string
    discountType: string
    discountValue: number
    maxDiscount: number | null
    validFrom: Date
    validTo: Date
    conditions: JsonValue
    usage: JsonValue
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: PromotionCountAggregateOutputType | null
    _avg: PromotionAvgAggregateOutputType | null
    _sum: PromotionSumAggregateOutputType | null
    _min: PromotionMinAggregateOutputType | null
    _max: PromotionMaxAggregateOutputType | null
  }

  type GetPromotionGroupByPayload<T extends PromotionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PromotionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PromotionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PromotionGroupByOutputType[P]>
            : GetScalarType<T[P], PromotionGroupByOutputType[P]>
        }
      >
    >


  export type PromotionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    discountType?: boolean
    discountValue?: boolean
    maxDiscount?: boolean
    validFrom?: boolean
    validTo?: boolean
    conditions?: boolean
    usage?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["promotion"]>

  export type PromotionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    discountType?: boolean
    discountValue?: boolean
    maxDiscount?: boolean
    validFrom?: boolean
    validTo?: boolean
    conditions?: boolean
    usage?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["promotion"]>

  export type PromotionSelectScalar = {
    id?: boolean
    propertyId?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    discountType?: boolean
    discountValue?: boolean
    maxDiscount?: boolean
    validFrom?: boolean
    validTo?: boolean
    conditions?: boolean
    usage?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PromotionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }
  export type PromotionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
  }

  export type $PromotionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Promotion"
    objects: {
      property: Prisma.$PropertyPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      propertyId: string
      code: string | null
      name: string
      description: string
      type: string
      discountType: string
      discountValue: number
      maxDiscount: number | null
      validFrom: Date
      validTo: Date
      conditions: Prisma.JsonValue
      usage: Prisma.JsonValue
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["promotion"]>
    composites: {}
  }

  type PromotionGetPayload<S extends boolean | null | undefined | PromotionDefaultArgs> = $Result.GetResult<Prisma.$PromotionPayload, S>

  type PromotionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PromotionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PromotionCountAggregateInputType | true
    }

  export interface PromotionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Promotion'], meta: { name: 'Promotion' } }
    /**
     * Find zero or one Promotion that matches the filter.
     * @param {PromotionFindUniqueArgs} args - Arguments to find a Promotion
     * @example
     * // Get one Promotion
     * const promotion = await prisma.promotion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PromotionFindUniqueArgs>(args: SelectSubset<T, PromotionFindUniqueArgs<ExtArgs>>): Prisma__PromotionClient<$Result.GetResult<Prisma.$PromotionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Promotion that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PromotionFindUniqueOrThrowArgs} args - Arguments to find a Promotion
     * @example
     * // Get one Promotion
     * const promotion = await prisma.promotion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PromotionFindUniqueOrThrowArgs>(args: SelectSubset<T, PromotionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PromotionClient<$Result.GetResult<Prisma.$PromotionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Promotion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionFindFirstArgs} args - Arguments to find a Promotion
     * @example
     * // Get one Promotion
     * const promotion = await prisma.promotion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PromotionFindFirstArgs>(args?: SelectSubset<T, PromotionFindFirstArgs<ExtArgs>>): Prisma__PromotionClient<$Result.GetResult<Prisma.$PromotionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Promotion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionFindFirstOrThrowArgs} args - Arguments to find a Promotion
     * @example
     * // Get one Promotion
     * const promotion = await prisma.promotion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PromotionFindFirstOrThrowArgs>(args?: SelectSubset<T, PromotionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PromotionClient<$Result.GetResult<Prisma.$PromotionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Promotions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Promotions
     * const promotions = await prisma.promotion.findMany()
     * 
     * // Get first 10 Promotions
     * const promotions = await prisma.promotion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const promotionWithIdOnly = await prisma.promotion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PromotionFindManyArgs>(args?: SelectSubset<T, PromotionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromotionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Promotion.
     * @param {PromotionCreateArgs} args - Arguments to create a Promotion.
     * @example
     * // Create one Promotion
     * const Promotion = await prisma.promotion.create({
     *   data: {
     *     // ... data to create a Promotion
     *   }
     * })
     * 
     */
    create<T extends PromotionCreateArgs>(args: SelectSubset<T, PromotionCreateArgs<ExtArgs>>): Prisma__PromotionClient<$Result.GetResult<Prisma.$PromotionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Promotions.
     * @param {PromotionCreateManyArgs} args - Arguments to create many Promotions.
     * @example
     * // Create many Promotions
     * const promotion = await prisma.promotion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PromotionCreateManyArgs>(args?: SelectSubset<T, PromotionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Promotions and returns the data saved in the database.
     * @param {PromotionCreateManyAndReturnArgs} args - Arguments to create many Promotions.
     * @example
     * // Create many Promotions
     * const promotion = await prisma.promotion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Promotions and only return the `id`
     * const promotionWithIdOnly = await prisma.promotion.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PromotionCreateManyAndReturnArgs>(args?: SelectSubset<T, PromotionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromotionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Promotion.
     * @param {PromotionDeleteArgs} args - Arguments to delete one Promotion.
     * @example
     * // Delete one Promotion
     * const Promotion = await prisma.promotion.delete({
     *   where: {
     *     // ... filter to delete one Promotion
     *   }
     * })
     * 
     */
    delete<T extends PromotionDeleteArgs>(args: SelectSubset<T, PromotionDeleteArgs<ExtArgs>>): Prisma__PromotionClient<$Result.GetResult<Prisma.$PromotionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Promotion.
     * @param {PromotionUpdateArgs} args - Arguments to update one Promotion.
     * @example
     * // Update one Promotion
     * const promotion = await prisma.promotion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PromotionUpdateArgs>(args: SelectSubset<T, PromotionUpdateArgs<ExtArgs>>): Prisma__PromotionClient<$Result.GetResult<Prisma.$PromotionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Promotions.
     * @param {PromotionDeleteManyArgs} args - Arguments to filter Promotions to delete.
     * @example
     * // Delete a few Promotions
     * const { count } = await prisma.promotion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PromotionDeleteManyArgs>(args?: SelectSubset<T, PromotionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Promotions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Promotions
     * const promotion = await prisma.promotion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PromotionUpdateManyArgs>(args: SelectSubset<T, PromotionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Promotion.
     * @param {PromotionUpsertArgs} args - Arguments to update or create a Promotion.
     * @example
     * // Update or create a Promotion
     * const promotion = await prisma.promotion.upsert({
     *   create: {
     *     // ... data to create a Promotion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Promotion we want to update
     *   }
     * })
     */
    upsert<T extends PromotionUpsertArgs>(args: SelectSubset<T, PromotionUpsertArgs<ExtArgs>>): Prisma__PromotionClient<$Result.GetResult<Prisma.$PromotionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Promotions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionCountArgs} args - Arguments to filter Promotions to count.
     * @example
     * // Count the number of Promotions
     * const count = await prisma.promotion.count({
     *   where: {
     *     // ... the filter for the Promotions we want to count
     *   }
     * })
    **/
    count<T extends PromotionCountArgs>(
      args?: Subset<T, PromotionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PromotionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Promotion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PromotionAggregateArgs>(args: Subset<T, PromotionAggregateArgs>): Prisma.PrismaPromise<GetPromotionAggregateType<T>>

    /**
     * Group by Promotion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionGroupByArgs} args - Group by arguments.
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
      T extends PromotionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PromotionGroupByArgs['orderBy'] }
        : { orderBy?: PromotionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PromotionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPromotionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Promotion model
   */
  readonly fields: PromotionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Promotion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PromotionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    property<T extends PropertyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PropertyDefaultArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the Promotion model
   */ 
  interface PromotionFieldRefs {
    readonly id: FieldRef<"Promotion", 'String'>
    readonly propertyId: FieldRef<"Promotion", 'String'>
    readonly code: FieldRef<"Promotion", 'String'>
    readonly name: FieldRef<"Promotion", 'String'>
    readonly description: FieldRef<"Promotion", 'String'>
    readonly type: FieldRef<"Promotion", 'String'>
    readonly discountType: FieldRef<"Promotion", 'String'>
    readonly discountValue: FieldRef<"Promotion", 'Float'>
    readonly maxDiscount: FieldRef<"Promotion", 'Float'>
    readonly validFrom: FieldRef<"Promotion", 'DateTime'>
    readonly validTo: FieldRef<"Promotion", 'DateTime'>
    readonly conditions: FieldRef<"Promotion", 'Json'>
    readonly usage: FieldRef<"Promotion", 'Json'>
    readonly isActive: FieldRef<"Promotion", 'Boolean'>
    readonly createdAt: FieldRef<"Promotion", 'DateTime'>
    readonly updatedAt: FieldRef<"Promotion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Promotion findUnique
   */
  export type PromotionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
    /**
     * Filter, which Promotion to fetch.
     */
    where: PromotionWhereUniqueInput
  }

  /**
   * Promotion findUniqueOrThrow
   */
  export type PromotionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
    /**
     * Filter, which Promotion to fetch.
     */
    where: PromotionWhereUniqueInput
  }

  /**
   * Promotion findFirst
   */
  export type PromotionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
    /**
     * Filter, which Promotion to fetch.
     */
    where?: PromotionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Promotions to fetch.
     */
    orderBy?: PromotionOrderByWithRelationInput | PromotionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Promotions.
     */
    cursor?: PromotionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Promotions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Promotions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Promotions.
     */
    distinct?: PromotionScalarFieldEnum | PromotionScalarFieldEnum[]
  }

  /**
   * Promotion findFirstOrThrow
   */
  export type PromotionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
    /**
     * Filter, which Promotion to fetch.
     */
    where?: PromotionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Promotions to fetch.
     */
    orderBy?: PromotionOrderByWithRelationInput | PromotionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Promotions.
     */
    cursor?: PromotionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Promotions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Promotions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Promotions.
     */
    distinct?: PromotionScalarFieldEnum | PromotionScalarFieldEnum[]
  }

  /**
   * Promotion findMany
   */
  export type PromotionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
    /**
     * Filter, which Promotions to fetch.
     */
    where?: PromotionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Promotions to fetch.
     */
    orderBy?: PromotionOrderByWithRelationInput | PromotionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Promotions.
     */
    cursor?: PromotionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Promotions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Promotions.
     */
    skip?: number
    distinct?: PromotionScalarFieldEnum | PromotionScalarFieldEnum[]
  }

  /**
   * Promotion create
   */
  export type PromotionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
    /**
     * The data needed to create a Promotion.
     */
    data: XOR<PromotionCreateInput, PromotionUncheckedCreateInput>
  }

  /**
   * Promotion createMany
   */
  export type PromotionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Promotions.
     */
    data: PromotionCreateManyInput | PromotionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Promotion createManyAndReturn
   */
  export type PromotionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Promotions.
     */
    data: PromotionCreateManyInput | PromotionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Promotion update
   */
  export type PromotionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
    /**
     * The data needed to update a Promotion.
     */
    data: XOR<PromotionUpdateInput, PromotionUncheckedUpdateInput>
    /**
     * Choose, which Promotion to update.
     */
    where: PromotionWhereUniqueInput
  }

  /**
   * Promotion updateMany
   */
  export type PromotionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Promotions.
     */
    data: XOR<PromotionUpdateManyMutationInput, PromotionUncheckedUpdateManyInput>
    /**
     * Filter which Promotions to update
     */
    where?: PromotionWhereInput
  }

  /**
   * Promotion upsert
   */
  export type PromotionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
    /**
     * The filter to search for the Promotion to update in case it exists.
     */
    where: PromotionWhereUniqueInput
    /**
     * In case the Promotion found by the `where` argument doesn't exist, create a new Promotion with this data.
     */
    create: XOR<PromotionCreateInput, PromotionUncheckedCreateInput>
    /**
     * In case the Promotion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PromotionUpdateInput, PromotionUncheckedUpdateInput>
  }

  /**
   * Promotion delete
   */
  export type PromotionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
    /**
     * Filter which Promotion to delete.
     */
    where: PromotionWhereUniqueInput
  }

  /**
   * Promotion deleteMany
   */
  export type PromotionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Promotions to delete
     */
    where?: PromotionWhereInput
  }

  /**
   * Promotion without action
   */
  export type PromotionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionInclude<ExtArgs> | null
  }


  /**
   * Model GroupDiscount
   */

  export type AggregateGroupDiscount = {
    _count: GroupDiscountCountAggregateOutputType | null
    _avg: GroupDiscountAvgAggregateOutputType | null
    _sum: GroupDiscountSumAggregateOutputType | null
    _min: GroupDiscountMinAggregateOutputType | null
    _max: GroupDiscountMaxAggregateOutputType | null
  }

  export type GroupDiscountAvgAggregateOutputType = {
    minimumRooms: number | null
    discountValue: number | null
  }

  export type GroupDiscountSumAggregateOutputType = {
    minimumRooms: number | null
    discountValue: number | null
  }

  export type GroupDiscountMinAggregateOutputType = {
    id: string | null
    propertyId: string | null
    name: string | null
    description: string | null
    minimumRooms: number | null
    discountType: string | null
    discountValue: number | null
    validFrom: Date | null
    validTo: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GroupDiscountMaxAggregateOutputType = {
    id: string | null
    propertyId: string | null
    name: string | null
    description: string | null
    minimumRooms: number | null
    discountType: string | null
    discountValue: number | null
    validFrom: Date | null
    validTo: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GroupDiscountCountAggregateOutputType = {
    id: number
    propertyId: number
    name: number
    description: number
    minimumRooms: number
    discountType: number
    discountValue: number
    validFrom: number
    validTo: number
    applicableRoomTypes: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GroupDiscountAvgAggregateInputType = {
    minimumRooms?: true
    discountValue?: true
  }

  export type GroupDiscountSumAggregateInputType = {
    minimumRooms?: true
    discountValue?: true
  }

  export type GroupDiscountMinAggregateInputType = {
    id?: true
    propertyId?: true
    name?: true
    description?: true
    minimumRooms?: true
    discountType?: true
    discountValue?: true
    validFrom?: true
    validTo?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GroupDiscountMaxAggregateInputType = {
    id?: true
    propertyId?: true
    name?: true
    description?: true
    minimumRooms?: true
    discountType?: true
    discountValue?: true
    validFrom?: true
    validTo?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GroupDiscountCountAggregateInputType = {
    id?: true
    propertyId?: true
    name?: true
    description?: true
    minimumRooms?: true
    discountType?: true
    discountValue?: true
    validFrom?: true
    validTo?: true
    applicableRoomTypes?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GroupDiscountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroupDiscount to aggregate.
     */
    where?: GroupDiscountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupDiscounts to fetch.
     */
    orderBy?: GroupDiscountOrderByWithRelationInput | GroupDiscountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GroupDiscountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupDiscounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupDiscounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GroupDiscounts
    **/
    _count?: true | GroupDiscountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GroupDiscountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GroupDiscountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GroupDiscountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GroupDiscountMaxAggregateInputType
  }

  export type GetGroupDiscountAggregateType<T extends GroupDiscountAggregateArgs> = {
        [P in keyof T & keyof AggregateGroupDiscount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGroupDiscount[P]>
      : GetScalarType<T[P], AggregateGroupDiscount[P]>
  }




  export type GroupDiscountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GroupDiscountWhereInput
    orderBy?: GroupDiscountOrderByWithAggregationInput | GroupDiscountOrderByWithAggregationInput[]
    by: GroupDiscountScalarFieldEnum[] | GroupDiscountScalarFieldEnum
    having?: GroupDiscountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GroupDiscountCountAggregateInputType | true
    _avg?: GroupDiscountAvgAggregateInputType
    _sum?: GroupDiscountSumAggregateInputType
    _min?: GroupDiscountMinAggregateInputType
    _max?: GroupDiscountMaxAggregateInputType
  }

  export type GroupDiscountGroupByOutputType = {
    id: string
    propertyId: string
    name: string
    description: string
    minimumRooms: number
    discountType: string
    discountValue: number
    validFrom: Date
    validTo: Date
    applicableRoomTypes: JsonValue | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: GroupDiscountCountAggregateOutputType | null
    _avg: GroupDiscountAvgAggregateOutputType | null
    _sum: GroupDiscountSumAggregateOutputType | null
    _min: GroupDiscountMinAggregateOutputType | null
    _max: GroupDiscountMaxAggregateOutputType | null
  }

  type GetGroupDiscountGroupByPayload<T extends GroupDiscountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GroupDiscountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GroupDiscountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GroupDiscountGroupByOutputType[P]>
            : GetScalarType<T[P], GroupDiscountGroupByOutputType[P]>
        }
      >
    >


  export type GroupDiscountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    name?: boolean
    description?: boolean
    minimumRooms?: boolean
    discountType?: boolean
    discountValue?: boolean
    validFrom?: boolean
    validTo?: boolean
    applicableRoomTypes?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["groupDiscount"]>

  export type GroupDiscountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    name?: boolean
    description?: boolean
    minimumRooms?: boolean
    discountType?: boolean
    discountValue?: boolean
    validFrom?: boolean
    validTo?: boolean
    applicableRoomTypes?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["groupDiscount"]>

  export type GroupDiscountSelectScalar = {
    id?: boolean
    propertyId?: boolean
    name?: boolean
    description?: boolean
    minimumRooms?: boolean
    discountType?: boolean
    discountValue?: boolean
    validFrom?: boolean
    validTo?: boolean
    applicableRoomTypes?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $GroupDiscountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GroupDiscount"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      propertyId: string
      name: string
      description: string
      minimumRooms: number
      discountType: string
      discountValue: number
      validFrom: Date
      validTo: Date
      applicableRoomTypes: Prisma.JsonValue | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["groupDiscount"]>
    composites: {}
  }

  type GroupDiscountGetPayload<S extends boolean | null | undefined | GroupDiscountDefaultArgs> = $Result.GetResult<Prisma.$GroupDiscountPayload, S>

  type GroupDiscountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GroupDiscountFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GroupDiscountCountAggregateInputType | true
    }

  export interface GroupDiscountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GroupDiscount'], meta: { name: 'GroupDiscount' } }
    /**
     * Find zero or one GroupDiscount that matches the filter.
     * @param {GroupDiscountFindUniqueArgs} args - Arguments to find a GroupDiscount
     * @example
     * // Get one GroupDiscount
     * const groupDiscount = await prisma.groupDiscount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GroupDiscountFindUniqueArgs>(args: SelectSubset<T, GroupDiscountFindUniqueArgs<ExtArgs>>): Prisma__GroupDiscountClient<$Result.GetResult<Prisma.$GroupDiscountPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one GroupDiscount that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GroupDiscountFindUniqueOrThrowArgs} args - Arguments to find a GroupDiscount
     * @example
     * // Get one GroupDiscount
     * const groupDiscount = await prisma.groupDiscount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GroupDiscountFindUniqueOrThrowArgs>(args: SelectSubset<T, GroupDiscountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GroupDiscountClient<$Result.GetResult<Prisma.$GroupDiscountPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first GroupDiscount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupDiscountFindFirstArgs} args - Arguments to find a GroupDiscount
     * @example
     * // Get one GroupDiscount
     * const groupDiscount = await prisma.groupDiscount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GroupDiscountFindFirstArgs>(args?: SelectSubset<T, GroupDiscountFindFirstArgs<ExtArgs>>): Prisma__GroupDiscountClient<$Result.GetResult<Prisma.$GroupDiscountPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first GroupDiscount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupDiscountFindFirstOrThrowArgs} args - Arguments to find a GroupDiscount
     * @example
     * // Get one GroupDiscount
     * const groupDiscount = await prisma.groupDiscount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GroupDiscountFindFirstOrThrowArgs>(args?: SelectSubset<T, GroupDiscountFindFirstOrThrowArgs<ExtArgs>>): Prisma__GroupDiscountClient<$Result.GetResult<Prisma.$GroupDiscountPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more GroupDiscounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupDiscountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GroupDiscounts
     * const groupDiscounts = await prisma.groupDiscount.findMany()
     * 
     * // Get first 10 GroupDiscounts
     * const groupDiscounts = await prisma.groupDiscount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const groupDiscountWithIdOnly = await prisma.groupDiscount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GroupDiscountFindManyArgs>(args?: SelectSubset<T, GroupDiscountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupDiscountPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a GroupDiscount.
     * @param {GroupDiscountCreateArgs} args - Arguments to create a GroupDiscount.
     * @example
     * // Create one GroupDiscount
     * const GroupDiscount = await prisma.groupDiscount.create({
     *   data: {
     *     // ... data to create a GroupDiscount
     *   }
     * })
     * 
     */
    create<T extends GroupDiscountCreateArgs>(args: SelectSubset<T, GroupDiscountCreateArgs<ExtArgs>>): Prisma__GroupDiscountClient<$Result.GetResult<Prisma.$GroupDiscountPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many GroupDiscounts.
     * @param {GroupDiscountCreateManyArgs} args - Arguments to create many GroupDiscounts.
     * @example
     * // Create many GroupDiscounts
     * const groupDiscount = await prisma.groupDiscount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GroupDiscountCreateManyArgs>(args?: SelectSubset<T, GroupDiscountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GroupDiscounts and returns the data saved in the database.
     * @param {GroupDiscountCreateManyAndReturnArgs} args - Arguments to create many GroupDiscounts.
     * @example
     * // Create many GroupDiscounts
     * const groupDiscount = await prisma.groupDiscount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GroupDiscounts and only return the `id`
     * const groupDiscountWithIdOnly = await prisma.groupDiscount.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GroupDiscountCreateManyAndReturnArgs>(args?: SelectSubset<T, GroupDiscountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupDiscountPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a GroupDiscount.
     * @param {GroupDiscountDeleteArgs} args - Arguments to delete one GroupDiscount.
     * @example
     * // Delete one GroupDiscount
     * const GroupDiscount = await prisma.groupDiscount.delete({
     *   where: {
     *     // ... filter to delete one GroupDiscount
     *   }
     * })
     * 
     */
    delete<T extends GroupDiscountDeleteArgs>(args: SelectSubset<T, GroupDiscountDeleteArgs<ExtArgs>>): Prisma__GroupDiscountClient<$Result.GetResult<Prisma.$GroupDiscountPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one GroupDiscount.
     * @param {GroupDiscountUpdateArgs} args - Arguments to update one GroupDiscount.
     * @example
     * // Update one GroupDiscount
     * const groupDiscount = await prisma.groupDiscount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GroupDiscountUpdateArgs>(args: SelectSubset<T, GroupDiscountUpdateArgs<ExtArgs>>): Prisma__GroupDiscountClient<$Result.GetResult<Prisma.$GroupDiscountPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more GroupDiscounts.
     * @param {GroupDiscountDeleteManyArgs} args - Arguments to filter GroupDiscounts to delete.
     * @example
     * // Delete a few GroupDiscounts
     * const { count } = await prisma.groupDiscount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GroupDiscountDeleteManyArgs>(args?: SelectSubset<T, GroupDiscountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GroupDiscounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupDiscountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GroupDiscounts
     * const groupDiscount = await prisma.groupDiscount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GroupDiscountUpdateManyArgs>(args: SelectSubset<T, GroupDiscountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GroupDiscount.
     * @param {GroupDiscountUpsertArgs} args - Arguments to update or create a GroupDiscount.
     * @example
     * // Update or create a GroupDiscount
     * const groupDiscount = await prisma.groupDiscount.upsert({
     *   create: {
     *     // ... data to create a GroupDiscount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GroupDiscount we want to update
     *   }
     * })
     */
    upsert<T extends GroupDiscountUpsertArgs>(args: SelectSubset<T, GroupDiscountUpsertArgs<ExtArgs>>): Prisma__GroupDiscountClient<$Result.GetResult<Prisma.$GroupDiscountPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of GroupDiscounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupDiscountCountArgs} args - Arguments to filter GroupDiscounts to count.
     * @example
     * // Count the number of GroupDiscounts
     * const count = await prisma.groupDiscount.count({
     *   where: {
     *     // ... the filter for the GroupDiscounts we want to count
     *   }
     * })
    **/
    count<T extends GroupDiscountCountArgs>(
      args?: Subset<T, GroupDiscountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GroupDiscountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GroupDiscount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupDiscountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GroupDiscountAggregateArgs>(args: Subset<T, GroupDiscountAggregateArgs>): Prisma.PrismaPromise<GetGroupDiscountAggregateType<T>>

    /**
     * Group by GroupDiscount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupDiscountGroupByArgs} args - Group by arguments.
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
      T extends GroupDiscountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GroupDiscountGroupByArgs['orderBy'] }
        : { orderBy?: GroupDiscountGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GroupDiscountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGroupDiscountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GroupDiscount model
   */
  readonly fields: GroupDiscountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GroupDiscount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GroupDiscountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the GroupDiscount model
   */ 
  interface GroupDiscountFieldRefs {
    readonly id: FieldRef<"GroupDiscount", 'String'>
    readonly propertyId: FieldRef<"GroupDiscount", 'String'>
    readonly name: FieldRef<"GroupDiscount", 'String'>
    readonly description: FieldRef<"GroupDiscount", 'String'>
    readonly minimumRooms: FieldRef<"GroupDiscount", 'Int'>
    readonly discountType: FieldRef<"GroupDiscount", 'String'>
    readonly discountValue: FieldRef<"GroupDiscount", 'Float'>
    readonly validFrom: FieldRef<"GroupDiscount", 'DateTime'>
    readonly validTo: FieldRef<"GroupDiscount", 'DateTime'>
    readonly applicableRoomTypes: FieldRef<"GroupDiscount", 'Json'>
    readonly isActive: FieldRef<"GroupDiscount", 'Boolean'>
    readonly createdAt: FieldRef<"GroupDiscount", 'DateTime'>
    readonly updatedAt: FieldRef<"GroupDiscount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GroupDiscount findUnique
   */
  export type GroupDiscountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupDiscount
     */
    select?: GroupDiscountSelect<ExtArgs> | null
    /**
     * Filter, which GroupDiscount to fetch.
     */
    where: GroupDiscountWhereUniqueInput
  }

  /**
   * GroupDiscount findUniqueOrThrow
   */
  export type GroupDiscountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupDiscount
     */
    select?: GroupDiscountSelect<ExtArgs> | null
    /**
     * Filter, which GroupDiscount to fetch.
     */
    where: GroupDiscountWhereUniqueInput
  }

  /**
   * GroupDiscount findFirst
   */
  export type GroupDiscountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupDiscount
     */
    select?: GroupDiscountSelect<ExtArgs> | null
    /**
     * Filter, which GroupDiscount to fetch.
     */
    where?: GroupDiscountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupDiscounts to fetch.
     */
    orderBy?: GroupDiscountOrderByWithRelationInput | GroupDiscountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroupDiscounts.
     */
    cursor?: GroupDiscountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupDiscounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupDiscounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroupDiscounts.
     */
    distinct?: GroupDiscountScalarFieldEnum | GroupDiscountScalarFieldEnum[]
  }

  /**
   * GroupDiscount findFirstOrThrow
   */
  export type GroupDiscountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupDiscount
     */
    select?: GroupDiscountSelect<ExtArgs> | null
    /**
     * Filter, which GroupDiscount to fetch.
     */
    where?: GroupDiscountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupDiscounts to fetch.
     */
    orderBy?: GroupDiscountOrderByWithRelationInput | GroupDiscountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroupDiscounts.
     */
    cursor?: GroupDiscountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupDiscounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupDiscounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroupDiscounts.
     */
    distinct?: GroupDiscountScalarFieldEnum | GroupDiscountScalarFieldEnum[]
  }

  /**
   * GroupDiscount findMany
   */
  export type GroupDiscountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupDiscount
     */
    select?: GroupDiscountSelect<ExtArgs> | null
    /**
     * Filter, which GroupDiscounts to fetch.
     */
    where?: GroupDiscountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupDiscounts to fetch.
     */
    orderBy?: GroupDiscountOrderByWithRelationInput | GroupDiscountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GroupDiscounts.
     */
    cursor?: GroupDiscountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupDiscounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupDiscounts.
     */
    skip?: number
    distinct?: GroupDiscountScalarFieldEnum | GroupDiscountScalarFieldEnum[]
  }

  /**
   * GroupDiscount create
   */
  export type GroupDiscountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupDiscount
     */
    select?: GroupDiscountSelect<ExtArgs> | null
    /**
     * The data needed to create a GroupDiscount.
     */
    data: XOR<GroupDiscountCreateInput, GroupDiscountUncheckedCreateInput>
  }

  /**
   * GroupDiscount createMany
   */
  export type GroupDiscountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GroupDiscounts.
     */
    data: GroupDiscountCreateManyInput | GroupDiscountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GroupDiscount createManyAndReturn
   */
  export type GroupDiscountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupDiscount
     */
    select?: GroupDiscountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many GroupDiscounts.
     */
    data: GroupDiscountCreateManyInput | GroupDiscountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GroupDiscount update
   */
  export type GroupDiscountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupDiscount
     */
    select?: GroupDiscountSelect<ExtArgs> | null
    /**
     * The data needed to update a GroupDiscount.
     */
    data: XOR<GroupDiscountUpdateInput, GroupDiscountUncheckedUpdateInput>
    /**
     * Choose, which GroupDiscount to update.
     */
    where: GroupDiscountWhereUniqueInput
  }

  /**
   * GroupDiscount updateMany
   */
  export type GroupDiscountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GroupDiscounts.
     */
    data: XOR<GroupDiscountUpdateManyMutationInput, GroupDiscountUncheckedUpdateManyInput>
    /**
     * Filter which GroupDiscounts to update
     */
    where?: GroupDiscountWhereInput
  }

  /**
   * GroupDiscount upsert
   */
  export type GroupDiscountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupDiscount
     */
    select?: GroupDiscountSelect<ExtArgs> | null
    /**
     * The filter to search for the GroupDiscount to update in case it exists.
     */
    where: GroupDiscountWhereUniqueInput
    /**
     * In case the GroupDiscount found by the `where` argument doesn't exist, create a new GroupDiscount with this data.
     */
    create: XOR<GroupDiscountCreateInput, GroupDiscountUncheckedCreateInput>
    /**
     * In case the GroupDiscount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GroupDiscountUpdateInput, GroupDiscountUncheckedUpdateInput>
  }

  /**
   * GroupDiscount delete
   */
  export type GroupDiscountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupDiscount
     */
    select?: GroupDiscountSelect<ExtArgs> | null
    /**
     * Filter which GroupDiscount to delete.
     */
    where: GroupDiscountWhereUniqueInput
  }

  /**
   * GroupDiscount deleteMany
   */
  export type GroupDiscountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroupDiscounts to delete
     */
    where?: GroupDiscountWhereInput
  }

  /**
   * GroupDiscount without action
   */
  export type GroupDiscountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupDiscount
     */
    select?: GroupDiscountSelect<ExtArgs> | null
  }


  /**
   * Model TaxConfiguration
   */

  export type AggregateTaxConfiguration = {
    _count: TaxConfigurationCountAggregateOutputType | null
    _avg: TaxConfigurationAvgAggregateOutputType | null
    _sum: TaxConfigurationSumAggregateOutputType | null
    _min: TaxConfigurationMinAggregateOutputType | null
    _max: TaxConfigurationMaxAggregateOutputType | null
  }

  export type TaxConfigurationAvgAggregateOutputType = {
    rate: number | null
  }

  export type TaxConfigurationSumAggregateOutputType = {
    rate: number | null
  }

  export type TaxConfigurationMinAggregateOutputType = {
    id: string | null
    propertyId: string | null
    name: string | null
    type: string | null
    rate: number | null
    isPercentage: boolean | null
    isInclusive: boolean | null
    validFrom: Date | null
    validTo: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TaxConfigurationMaxAggregateOutputType = {
    id: string | null
    propertyId: string | null
    name: string | null
    type: string | null
    rate: number | null
    isPercentage: boolean | null
    isInclusive: boolean | null
    validFrom: Date | null
    validTo: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TaxConfigurationCountAggregateOutputType = {
    id: number
    propertyId: number
    name: number
    type: number
    rate: number
    isPercentage: number
    isInclusive: number
    applicableRoomTypes: number
    validFrom: number
    validTo: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TaxConfigurationAvgAggregateInputType = {
    rate?: true
  }

  export type TaxConfigurationSumAggregateInputType = {
    rate?: true
  }

  export type TaxConfigurationMinAggregateInputType = {
    id?: true
    propertyId?: true
    name?: true
    type?: true
    rate?: true
    isPercentage?: true
    isInclusive?: true
    validFrom?: true
    validTo?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TaxConfigurationMaxAggregateInputType = {
    id?: true
    propertyId?: true
    name?: true
    type?: true
    rate?: true
    isPercentage?: true
    isInclusive?: true
    validFrom?: true
    validTo?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TaxConfigurationCountAggregateInputType = {
    id?: true
    propertyId?: true
    name?: true
    type?: true
    rate?: true
    isPercentage?: true
    isInclusive?: true
    applicableRoomTypes?: true
    validFrom?: true
    validTo?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TaxConfigurationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaxConfiguration to aggregate.
     */
    where?: TaxConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaxConfigurations to fetch.
     */
    orderBy?: TaxConfigurationOrderByWithRelationInput | TaxConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaxConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaxConfigurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaxConfigurations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TaxConfigurations
    **/
    _count?: true | TaxConfigurationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TaxConfigurationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TaxConfigurationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaxConfigurationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaxConfigurationMaxAggregateInputType
  }

  export type GetTaxConfigurationAggregateType<T extends TaxConfigurationAggregateArgs> = {
        [P in keyof T & keyof AggregateTaxConfiguration]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTaxConfiguration[P]>
      : GetScalarType<T[P], AggregateTaxConfiguration[P]>
  }




  export type TaxConfigurationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaxConfigurationWhereInput
    orderBy?: TaxConfigurationOrderByWithAggregationInput | TaxConfigurationOrderByWithAggregationInput[]
    by: TaxConfigurationScalarFieldEnum[] | TaxConfigurationScalarFieldEnum
    having?: TaxConfigurationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaxConfigurationCountAggregateInputType | true
    _avg?: TaxConfigurationAvgAggregateInputType
    _sum?: TaxConfigurationSumAggregateInputType
    _min?: TaxConfigurationMinAggregateInputType
    _max?: TaxConfigurationMaxAggregateInputType
  }

  export type TaxConfigurationGroupByOutputType = {
    id: string
    propertyId: string
    name: string
    type: string
    rate: number
    isPercentage: boolean
    isInclusive: boolean
    applicableRoomTypes: JsonValue | null
    validFrom: Date
    validTo: Date | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: TaxConfigurationCountAggregateOutputType | null
    _avg: TaxConfigurationAvgAggregateOutputType | null
    _sum: TaxConfigurationSumAggregateOutputType | null
    _min: TaxConfigurationMinAggregateOutputType | null
    _max: TaxConfigurationMaxAggregateOutputType | null
  }

  type GetTaxConfigurationGroupByPayload<T extends TaxConfigurationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaxConfigurationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaxConfigurationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaxConfigurationGroupByOutputType[P]>
            : GetScalarType<T[P], TaxConfigurationGroupByOutputType[P]>
        }
      >
    >


  export type TaxConfigurationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    name?: boolean
    type?: boolean
    rate?: boolean
    isPercentage?: boolean
    isInclusive?: boolean
    applicableRoomTypes?: boolean
    validFrom?: boolean
    validTo?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["taxConfiguration"]>

  export type TaxConfigurationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    propertyId?: boolean
    name?: boolean
    type?: boolean
    rate?: boolean
    isPercentage?: boolean
    isInclusive?: boolean
    applicableRoomTypes?: boolean
    validFrom?: boolean
    validTo?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["taxConfiguration"]>

  export type TaxConfigurationSelectScalar = {
    id?: boolean
    propertyId?: boolean
    name?: boolean
    type?: boolean
    rate?: boolean
    isPercentage?: boolean
    isInclusive?: boolean
    applicableRoomTypes?: boolean
    validFrom?: boolean
    validTo?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $TaxConfigurationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TaxConfiguration"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      propertyId: string
      name: string
      type: string
      rate: number
      isPercentage: boolean
      isInclusive: boolean
      applicableRoomTypes: Prisma.JsonValue | null
      validFrom: Date
      validTo: Date | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["taxConfiguration"]>
    composites: {}
  }

  type TaxConfigurationGetPayload<S extends boolean | null | undefined | TaxConfigurationDefaultArgs> = $Result.GetResult<Prisma.$TaxConfigurationPayload, S>

  type TaxConfigurationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TaxConfigurationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TaxConfigurationCountAggregateInputType | true
    }

  export interface TaxConfigurationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TaxConfiguration'], meta: { name: 'TaxConfiguration' } }
    /**
     * Find zero or one TaxConfiguration that matches the filter.
     * @param {TaxConfigurationFindUniqueArgs} args - Arguments to find a TaxConfiguration
     * @example
     * // Get one TaxConfiguration
     * const taxConfiguration = await prisma.taxConfiguration.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaxConfigurationFindUniqueArgs>(args: SelectSubset<T, TaxConfigurationFindUniqueArgs<ExtArgs>>): Prisma__TaxConfigurationClient<$Result.GetResult<Prisma.$TaxConfigurationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TaxConfiguration that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TaxConfigurationFindUniqueOrThrowArgs} args - Arguments to find a TaxConfiguration
     * @example
     * // Get one TaxConfiguration
     * const taxConfiguration = await prisma.taxConfiguration.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaxConfigurationFindUniqueOrThrowArgs>(args: SelectSubset<T, TaxConfigurationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaxConfigurationClient<$Result.GetResult<Prisma.$TaxConfigurationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TaxConfiguration that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaxConfigurationFindFirstArgs} args - Arguments to find a TaxConfiguration
     * @example
     * // Get one TaxConfiguration
     * const taxConfiguration = await prisma.taxConfiguration.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaxConfigurationFindFirstArgs>(args?: SelectSubset<T, TaxConfigurationFindFirstArgs<ExtArgs>>): Prisma__TaxConfigurationClient<$Result.GetResult<Prisma.$TaxConfigurationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TaxConfiguration that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaxConfigurationFindFirstOrThrowArgs} args - Arguments to find a TaxConfiguration
     * @example
     * // Get one TaxConfiguration
     * const taxConfiguration = await prisma.taxConfiguration.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaxConfigurationFindFirstOrThrowArgs>(args?: SelectSubset<T, TaxConfigurationFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaxConfigurationClient<$Result.GetResult<Prisma.$TaxConfigurationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TaxConfigurations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaxConfigurationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TaxConfigurations
     * const taxConfigurations = await prisma.taxConfiguration.findMany()
     * 
     * // Get first 10 TaxConfigurations
     * const taxConfigurations = await prisma.taxConfiguration.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taxConfigurationWithIdOnly = await prisma.taxConfiguration.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaxConfigurationFindManyArgs>(args?: SelectSubset<T, TaxConfigurationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaxConfigurationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TaxConfiguration.
     * @param {TaxConfigurationCreateArgs} args - Arguments to create a TaxConfiguration.
     * @example
     * // Create one TaxConfiguration
     * const TaxConfiguration = await prisma.taxConfiguration.create({
     *   data: {
     *     // ... data to create a TaxConfiguration
     *   }
     * })
     * 
     */
    create<T extends TaxConfigurationCreateArgs>(args: SelectSubset<T, TaxConfigurationCreateArgs<ExtArgs>>): Prisma__TaxConfigurationClient<$Result.GetResult<Prisma.$TaxConfigurationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TaxConfigurations.
     * @param {TaxConfigurationCreateManyArgs} args - Arguments to create many TaxConfigurations.
     * @example
     * // Create many TaxConfigurations
     * const taxConfiguration = await prisma.taxConfiguration.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaxConfigurationCreateManyArgs>(args?: SelectSubset<T, TaxConfigurationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TaxConfigurations and returns the data saved in the database.
     * @param {TaxConfigurationCreateManyAndReturnArgs} args - Arguments to create many TaxConfigurations.
     * @example
     * // Create many TaxConfigurations
     * const taxConfiguration = await prisma.taxConfiguration.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TaxConfigurations and only return the `id`
     * const taxConfigurationWithIdOnly = await prisma.taxConfiguration.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaxConfigurationCreateManyAndReturnArgs>(args?: SelectSubset<T, TaxConfigurationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaxConfigurationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TaxConfiguration.
     * @param {TaxConfigurationDeleteArgs} args - Arguments to delete one TaxConfiguration.
     * @example
     * // Delete one TaxConfiguration
     * const TaxConfiguration = await prisma.taxConfiguration.delete({
     *   where: {
     *     // ... filter to delete one TaxConfiguration
     *   }
     * })
     * 
     */
    delete<T extends TaxConfigurationDeleteArgs>(args: SelectSubset<T, TaxConfigurationDeleteArgs<ExtArgs>>): Prisma__TaxConfigurationClient<$Result.GetResult<Prisma.$TaxConfigurationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TaxConfiguration.
     * @param {TaxConfigurationUpdateArgs} args - Arguments to update one TaxConfiguration.
     * @example
     * // Update one TaxConfiguration
     * const taxConfiguration = await prisma.taxConfiguration.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaxConfigurationUpdateArgs>(args: SelectSubset<T, TaxConfigurationUpdateArgs<ExtArgs>>): Prisma__TaxConfigurationClient<$Result.GetResult<Prisma.$TaxConfigurationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TaxConfigurations.
     * @param {TaxConfigurationDeleteManyArgs} args - Arguments to filter TaxConfigurations to delete.
     * @example
     * // Delete a few TaxConfigurations
     * const { count } = await prisma.taxConfiguration.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaxConfigurationDeleteManyArgs>(args?: SelectSubset<T, TaxConfigurationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaxConfigurations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaxConfigurationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TaxConfigurations
     * const taxConfiguration = await prisma.taxConfiguration.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaxConfigurationUpdateManyArgs>(args: SelectSubset<T, TaxConfigurationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TaxConfiguration.
     * @param {TaxConfigurationUpsertArgs} args - Arguments to update or create a TaxConfiguration.
     * @example
     * // Update or create a TaxConfiguration
     * const taxConfiguration = await prisma.taxConfiguration.upsert({
     *   create: {
     *     // ... data to create a TaxConfiguration
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TaxConfiguration we want to update
     *   }
     * })
     */
    upsert<T extends TaxConfigurationUpsertArgs>(args: SelectSubset<T, TaxConfigurationUpsertArgs<ExtArgs>>): Prisma__TaxConfigurationClient<$Result.GetResult<Prisma.$TaxConfigurationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TaxConfigurations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaxConfigurationCountArgs} args - Arguments to filter TaxConfigurations to count.
     * @example
     * // Count the number of TaxConfigurations
     * const count = await prisma.taxConfiguration.count({
     *   where: {
     *     // ... the filter for the TaxConfigurations we want to count
     *   }
     * })
    **/
    count<T extends TaxConfigurationCountArgs>(
      args?: Subset<T, TaxConfigurationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaxConfigurationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TaxConfiguration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaxConfigurationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TaxConfigurationAggregateArgs>(args: Subset<T, TaxConfigurationAggregateArgs>): Prisma.PrismaPromise<GetTaxConfigurationAggregateType<T>>

    /**
     * Group by TaxConfiguration.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaxConfigurationGroupByArgs} args - Group by arguments.
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
      T extends TaxConfigurationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaxConfigurationGroupByArgs['orderBy'] }
        : { orderBy?: TaxConfigurationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TaxConfigurationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaxConfigurationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TaxConfiguration model
   */
  readonly fields: TaxConfigurationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TaxConfiguration.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaxConfigurationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the TaxConfiguration model
   */ 
  interface TaxConfigurationFieldRefs {
    readonly id: FieldRef<"TaxConfiguration", 'String'>
    readonly propertyId: FieldRef<"TaxConfiguration", 'String'>
    readonly name: FieldRef<"TaxConfiguration", 'String'>
    readonly type: FieldRef<"TaxConfiguration", 'String'>
    readonly rate: FieldRef<"TaxConfiguration", 'Float'>
    readonly isPercentage: FieldRef<"TaxConfiguration", 'Boolean'>
    readonly isInclusive: FieldRef<"TaxConfiguration", 'Boolean'>
    readonly applicableRoomTypes: FieldRef<"TaxConfiguration", 'Json'>
    readonly validFrom: FieldRef<"TaxConfiguration", 'DateTime'>
    readonly validTo: FieldRef<"TaxConfiguration", 'DateTime'>
    readonly isActive: FieldRef<"TaxConfiguration", 'Boolean'>
    readonly createdAt: FieldRef<"TaxConfiguration", 'DateTime'>
    readonly updatedAt: FieldRef<"TaxConfiguration", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TaxConfiguration findUnique
   */
  export type TaxConfigurationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxConfiguration
     */
    select?: TaxConfigurationSelect<ExtArgs> | null
    /**
     * Filter, which TaxConfiguration to fetch.
     */
    where: TaxConfigurationWhereUniqueInput
  }

  /**
   * TaxConfiguration findUniqueOrThrow
   */
  export type TaxConfigurationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxConfiguration
     */
    select?: TaxConfigurationSelect<ExtArgs> | null
    /**
     * Filter, which TaxConfiguration to fetch.
     */
    where: TaxConfigurationWhereUniqueInput
  }

  /**
   * TaxConfiguration findFirst
   */
  export type TaxConfigurationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxConfiguration
     */
    select?: TaxConfigurationSelect<ExtArgs> | null
    /**
     * Filter, which TaxConfiguration to fetch.
     */
    where?: TaxConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaxConfigurations to fetch.
     */
    orderBy?: TaxConfigurationOrderByWithRelationInput | TaxConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaxConfigurations.
     */
    cursor?: TaxConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaxConfigurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaxConfigurations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaxConfigurations.
     */
    distinct?: TaxConfigurationScalarFieldEnum | TaxConfigurationScalarFieldEnum[]
  }

  /**
   * TaxConfiguration findFirstOrThrow
   */
  export type TaxConfigurationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxConfiguration
     */
    select?: TaxConfigurationSelect<ExtArgs> | null
    /**
     * Filter, which TaxConfiguration to fetch.
     */
    where?: TaxConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaxConfigurations to fetch.
     */
    orderBy?: TaxConfigurationOrderByWithRelationInput | TaxConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaxConfigurations.
     */
    cursor?: TaxConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaxConfigurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaxConfigurations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaxConfigurations.
     */
    distinct?: TaxConfigurationScalarFieldEnum | TaxConfigurationScalarFieldEnum[]
  }

  /**
   * TaxConfiguration findMany
   */
  export type TaxConfigurationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxConfiguration
     */
    select?: TaxConfigurationSelect<ExtArgs> | null
    /**
     * Filter, which TaxConfigurations to fetch.
     */
    where?: TaxConfigurationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaxConfigurations to fetch.
     */
    orderBy?: TaxConfigurationOrderByWithRelationInput | TaxConfigurationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TaxConfigurations.
     */
    cursor?: TaxConfigurationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaxConfigurations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaxConfigurations.
     */
    skip?: number
    distinct?: TaxConfigurationScalarFieldEnum | TaxConfigurationScalarFieldEnum[]
  }

  /**
   * TaxConfiguration create
   */
  export type TaxConfigurationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxConfiguration
     */
    select?: TaxConfigurationSelect<ExtArgs> | null
    /**
     * The data needed to create a TaxConfiguration.
     */
    data: XOR<TaxConfigurationCreateInput, TaxConfigurationUncheckedCreateInput>
  }

  /**
   * TaxConfiguration createMany
   */
  export type TaxConfigurationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TaxConfigurations.
     */
    data: TaxConfigurationCreateManyInput | TaxConfigurationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TaxConfiguration createManyAndReturn
   */
  export type TaxConfigurationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxConfiguration
     */
    select?: TaxConfigurationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TaxConfigurations.
     */
    data: TaxConfigurationCreateManyInput | TaxConfigurationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TaxConfiguration update
   */
  export type TaxConfigurationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxConfiguration
     */
    select?: TaxConfigurationSelect<ExtArgs> | null
    /**
     * The data needed to update a TaxConfiguration.
     */
    data: XOR<TaxConfigurationUpdateInput, TaxConfigurationUncheckedUpdateInput>
    /**
     * Choose, which TaxConfiguration to update.
     */
    where: TaxConfigurationWhereUniqueInput
  }

  /**
   * TaxConfiguration updateMany
   */
  export type TaxConfigurationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TaxConfigurations.
     */
    data: XOR<TaxConfigurationUpdateManyMutationInput, TaxConfigurationUncheckedUpdateManyInput>
    /**
     * Filter which TaxConfigurations to update
     */
    where?: TaxConfigurationWhereInput
  }

  /**
   * TaxConfiguration upsert
   */
  export type TaxConfigurationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxConfiguration
     */
    select?: TaxConfigurationSelect<ExtArgs> | null
    /**
     * The filter to search for the TaxConfiguration to update in case it exists.
     */
    where: TaxConfigurationWhereUniqueInput
    /**
     * In case the TaxConfiguration found by the `where` argument doesn't exist, create a new TaxConfiguration with this data.
     */
    create: XOR<TaxConfigurationCreateInput, TaxConfigurationUncheckedCreateInput>
    /**
     * In case the TaxConfiguration was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaxConfigurationUpdateInput, TaxConfigurationUncheckedUpdateInput>
  }

  /**
   * TaxConfiguration delete
   */
  export type TaxConfigurationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxConfiguration
     */
    select?: TaxConfigurationSelect<ExtArgs> | null
    /**
     * Filter which TaxConfiguration to delete.
     */
    where: TaxConfigurationWhereUniqueInput
  }

  /**
   * TaxConfiguration deleteMany
   */
  export type TaxConfigurationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaxConfigurations to delete
     */
    where?: TaxConfigurationWhereInput
  }

  /**
   * TaxConfiguration without action
   */
  export type TaxConfigurationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxConfiguration
     */
    select?: TaxConfigurationSelect<ExtArgs> | null
  }


  /**
   * Model GuestProfile
   */

  export type AggregateGuestProfile = {
    _count: GuestProfileCountAggregateOutputType | null
    _avg: GuestProfileAvgAggregateOutputType | null
    _sum: GuestProfileSumAggregateOutputType | null
    _min: GuestProfileMinAggregateOutputType | null
    _max: GuestProfileMaxAggregateOutputType | null
  }

  export type GuestProfileAvgAggregateOutputType = {
    loyaltyPoints: number | null
  }

  export type GuestProfileSumAggregateOutputType = {
    loyaltyPoints: number | null
  }

  export type GuestProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    loyaltyPoints: number | null
    createdAt: Date | null
    updatedAt: Date | null
    lastBookingDate: Date | null
    lastLoginDate: Date | null
  }

  export type GuestProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    loyaltyPoints: number | null
    createdAt: Date | null
    updatedAt: Date | null
    lastBookingDate: Date | null
    lastLoginDate: Date | null
  }

  export type GuestProfileCountAggregateOutputType = {
    id: number
    userId: number
    personalInfo: number
    contactInfo: number
    preferences: number
    bookingHistory: number
    loyaltyStatus: number
    loyaltyPoints: number
    accessibility: number
    dietaryRestrictions: number
    communicationPreferences: number
    vipStatus: number
    createdAt: number
    updatedAt: number
    lastBookingDate: number
    lastLoginDate: number
    _all: number
  }


  export type GuestProfileAvgAggregateInputType = {
    loyaltyPoints?: true
  }

  export type GuestProfileSumAggregateInputType = {
    loyaltyPoints?: true
  }

  export type GuestProfileMinAggregateInputType = {
    id?: true
    userId?: true
    loyaltyPoints?: true
    createdAt?: true
    updatedAt?: true
    lastBookingDate?: true
    lastLoginDate?: true
  }

  export type GuestProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    loyaltyPoints?: true
    createdAt?: true
    updatedAt?: true
    lastBookingDate?: true
    lastLoginDate?: true
  }

  export type GuestProfileCountAggregateInputType = {
    id?: true
    userId?: true
    personalInfo?: true
    contactInfo?: true
    preferences?: true
    bookingHistory?: true
    loyaltyStatus?: true
    loyaltyPoints?: true
    accessibility?: true
    dietaryRestrictions?: true
    communicationPreferences?: true
    vipStatus?: true
    createdAt?: true
    updatedAt?: true
    lastBookingDate?: true
    lastLoginDate?: true
    _all?: true
  }

  export type GuestProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuestProfile to aggregate.
     */
    where?: GuestProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuestProfiles to fetch.
     */
    orderBy?: GuestProfileOrderByWithRelationInput | GuestProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GuestProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuestProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuestProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GuestProfiles
    **/
    _count?: true | GuestProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GuestProfileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GuestProfileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GuestProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GuestProfileMaxAggregateInputType
  }

  export type GetGuestProfileAggregateType<T extends GuestProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateGuestProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGuestProfile[P]>
      : GetScalarType<T[P], AggregateGuestProfile[P]>
  }




  export type GuestProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuestProfileWhereInput
    orderBy?: GuestProfileOrderByWithAggregationInput | GuestProfileOrderByWithAggregationInput[]
    by: GuestProfileScalarFieldEnum[] | GuestProfileScalarFieldEnum
    having?: GuestProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GuestProfileCountAggregateInputType | true
    _avg?: GuestProfileAvgAggregateInputType
    _sum?: GuestProfileSumAggregateInputType
    _min?: GuestProfileMinAggregateInputType
    _max?: GuestProfileMaxAggregateInputType
  }

  export type GuestProfileGroupByOutputType = {
    id: string
    userId: string
    personalInfo: JsonValue
    contactInfo: JsonValue
    preferences: JsonValue
    bookingHistory: JsonValue
    loyaltyStatus: JsonValue | null
    loyaltyPoints: number | null
    accessibility: JsonValue | null
    dietaryRestrictions: JsonValue | null
    communicationPreferences: JsonValue
    vipStatus: JsonValue | null
    createdAt: Date
    updatedAt: Date
    lastBookingDate: Date | null
    lastLoginDate: Date | null
    _count: GuestProfileCountAggregateOutputType | null
    _avg: GuestProfileAvgAggregateOutputType | null
    _sum: GuestProfileSumAggregateOutputType | null
    _min: GuestProfileMinAggregateOutputType | null
    _max: GuestProfileMaxAggregateOutputType | null
  }

  type GetGuestProfileGroupByPayload<T extends GuestProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GuestProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GuestProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GuestProfileGroupByOutputType[P]>
            : GetScalarType<T[P], GuestProfileGroupByOutputType[P]>
        }
      >
    >


  export type GuestProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    personalInfo?: boolean
    contactInfo?: boolean
    preferences?: boolean
    bookingHistory?: boolean
    loyaltyStatus?: boolean
    loyaltyPoints?: boolean
    accessibility?: boolean
    dietaryRestrictions?: boolean
    communicationPreferences?: boolean
    vipStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastBookingDate?: boolean
    lastLoginDate?: boolean
  }, ExtArgs["result"]["guestProfile"]>

  export type GuestProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    personalInfo?: boolean
    contactInfo?: boolean
    preferences?: boolean
    bookingHistory?: boolean
    loyaltyStatus?: boolean
    loyaltyPoints?: boolean
    accessibility?: boolean
    dietaryRestrictions?: boolean
    communicationPreferences?: boolean
    vipStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastBookingDate?: boolean
    lastLoginDate?: boolean
  }, ExtArgs["result"]["guestProfile"]>

  export type GuestProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    personalInfo?: boolean
    contactInfo?: boolean
    preferences?: boolean
    bookingHistory?: boolean
    loyaltyStatus?: boolean
    loyaltyPoints?: boolean
    accessibility?: boolean
    dietaryRestrictions?: boolean
    communicationPreferences?: boolean
    vipStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastBookingDate?: boolean
    lastLoginDate?: boolean
  }


  export type $GuestProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GuestProfile"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      personalInfo: Prisma.JsonValue
      contactInfo: Prisma.JsonValue
      preferences: Prisma.JsonValue
      bookingHistory: Prisma.JsonValue
      loyaltyStatus: Prisma.JsonValue | null
      loyaltyPoints: number | null
      accessibility: Prisma.JsonValue | null
      dietaryRestrictions: Prisma.JsonValue | null
      communicationPreferences: Prisma.JsonValue
      vipStatus: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
      lastBookingDate: Date | null
      lastLoginDate: Date | null
    }, ExtArgs["result"]["guestProfile"]>
    composites: {}
  }

  type GuestProfileGetPayload<S extends boolean | null | undefined | GuestProfileDefaultArgs> = $Result.GetResult<Prisma.$GuestProfilePayload, S>

  type GuestProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GuestProfileFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GuestProfileCountAggregateInputType | true
    }

  export interface GuestProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GuestProfile'], meta: { name: 'GuestProfile' } }
    /**
     * Find zero or one GuestProfile that matches the filter.
     * @param {GuestProfileFindUniqueArgs} args - Arguments to find a GuestProfile
     * @example
     * // Get one GuestProfile
     * const guestProfile = await prisma.guestProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GuestProfileFindUniqueArgs>(args: SelectSubset<T, GuestProfileFindUniqueArgs<ExtArgs>>): Prisma__GuestProfileClient<$Result.GetResult<Prisma.$GuestProfilePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one GuestProfile that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GuestProfileFindUniqueOrThrowArgs} args - Arguments to find a GuestProfile
     * @example
     * // Get one GuestProfile
     * const guestProfile = await prisma.guestProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GuestProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, GuestProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GuestProfileClient<$Result.GetResult<Prisma.$GuestProfilePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first GuestProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestProfileFindFirstArgs} args - Arguments to find a GuestProfile
     * @example
     * // Get one GuestProfile
     * const guestProfile = await prisma.guestProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GuestProfileFindFirstArgs>(args?: SelectSubset<T, GuestProfileFindFirstArgs<ExtArgs>>): Prisma__GuestProfileClient<$Result.GetResult<Prisma.$GuestProfilePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first GuestProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestProfileFindFirstOrThrowArgs} args - Arguments to find a GuestProfile
     * @example
     * // Get one GuestProfile
     * const guestProfile = await prisma.guestProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GuestProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, GuestProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__GuestProfileClient<$Result.GetResult<Prisma.$GuestProfilePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more GuestProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GuestProfiles
     * const guestProfiles = await prisma.guestProfile.findMany()
     * 
     * // Get first 10 GuestProfiles
     * const guestProfiles = await prisma.guestProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const guestProfileWithIdOnly = await prisma.guestProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GuestProfileFindManyArgs>(args?: SelectSubset<T, GuestProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestProfilePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a GuestProfile.
     * @param {GuestProfileCreateArgs} args - Arguments to create a GuestProfile.
     * @example
     * // Create one GuestProfile
     * const GuestProfile = await prisma.guestProfile.create({
     *   data: {
     *     // ... data to create a GuestProfile
     *   }
     * })
     * 
     */
    create<T extends GuestProfileCreateArgs>(args: SelectSubset<T, GuestProfileCreateArgs<ExtArgs>>): Prisma__GuestProfileClient<$Result.GetResult<Prisma.$GuestProfilePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many GuestProfiles.
     * @param {GuestProfileCreateManyArgs} args - Arguments to create many GuestProfiles.
     * @example
     * // Create many GuestProfiles
     * const guestProfile = await prisma.guestProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GuestProfileCreateManyArgs>(args?: SelectSubset<T, GuestProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GuestProfiles and returns the data saved in the database.
     * @param {GuestProfileCreateManyAndReturnArgs} args - Arguments to create many GuestProfiles.
     * @example
     * // Create many GuestProfiles
     * const guestProfile = await prisma.guestProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GuestProfiles and only return the `id`
     * const guestProfileWithIdOnly = await prisma.guestProfile.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GuestProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, GuestProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestProfilePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a GuestProfile.
     * @param {GuestProfileDeleteArgs} args - Arguments to delete one GuestProfile.
     * @example
     * // Delete one GuestProfile
     * const GuestProfile = await prisma.guestProfile.delete({
     *   where: {
     *     // ... filter to delete one GuestProfile
     *   }
     * })
     * 
     */
    delete<T extends GuestProfileDeleteArgs>(args: SelectSubset<T, GuestProfileDeleteArgs<ExtArgs>>): Prisma__GuestProfileClient<$Result.GetResult<Prisma.$GuestProfilePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one GuestProfile.
     * @param {GuestProfileUpdateArgs} args - Arguments to update one GuestProfile.
     * @example
     * // Update one GuestProfile
     * const guestProfile = await prisma.guestProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GuestProfileUpdateArgs>(args: SelectSubset<T, GuestProfileUpdateArgs<ExtArgs>>): Prisma__GuestProfileClient<$Result.GetResult<Prisma.$GuestProfilePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more GuestProfiles.
     * @param {GuestProfileDeleteManyArgs} args - Arguments to filter GuestProfiles to delete.
     * @example
     * // Delete a few GuestProfiles
     * const { count } = await prisma.guestProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GuestProfileDeleteManyArgs>(args?: SelectSubset<T, GuestProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GuestProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GuestProfiles
     * const guestProfile = await prisma.guestProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GuestProfileUpdateManyArgs>(args: SelectSubset<T, GuestProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GuestProfile.
     * @param {GuestProfileUpsertArgs} args - Arguments to update or create a GuestProfile.
     * @example
     * // Update or create a GuestProfile
     * const guestProfile = await prisma.guestProfile.upsert({
     *   create: {
     *     // ... data to create a GuestProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GuestProfile we want to update
     *   }
     * })
     */
    upsert<T extends GuestProfileUpsertArgs>(args: SelectSubset<T, GuestProfileUpsertArgs<ExtArgs>>): Prisma__GuestProfileClient<$Result.GetResult<Prisma.$GuestProfilePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of GuestProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestProfileCountArgs} args - Arguments to filter GuestProfiles to count.
     * @example
     * // Count the number of GuestProfiles
     * const count = await prisma.guestProfile.count({
     *   where: {
     *     // ... the filter for the GuestProfiles we want to count
     *   }
     * })
    **/
    count<T extends GuestProfileCountArgs>(
      args?: Subset<T, GuestProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GuestProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GuestProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GuestProfileAggregateArgs>(args: Subset<T, GuestProfileAggregateArgs>): Prisma.PrismaPromise<GetGuestProfileAggregateType<T>>

    /**
     * Group by GuestProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestProfileGroupByArgs} args - Group by arguments.
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
      T extends GuestProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GuestProfileGroupByArgs['orderBy'] }
        : { orderBy?: GuestProfileGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GuestProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGuestProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GuestProfile model
   */
  readonly fields: GuestProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GuestProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GuestProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the GuestProfile model
   */ 
  interface GuestProfileFieldRefs {
    readonly id: FieldRef<"GuestProfile", 'String'>
    readonly userId: FieldRef<"GuestProfile", 'String'>
    readonly personalInfo: FieldRef<"GuestProfile", 'Json'>
    readonly contactInfo: FieldRef<"GuestProfile", 'Json'>
    readonly preferences: FieldRef<"GuestProfile", 'Json'>
    readonly bookingHistory: FieldRef<"GuestProfile", 'Json'>
    readonly loyaltyStatus: FieldRef<"GuestProfile", 'Json'>
    readonly loyaltyPoints: FieldRef<"GuestProfile", 'Int'>
    readonly accessibility: FieldRef<"GuestProfile", 'Json'>
    readonly dietaryRestrictions: FieldRef<"GuestProfile", 'Json'>
    readonly communicationPreferences: FieldRef<"GuestProfile", 'Json'>
    readonly vipStatus: FieldRef<"GuestProfile", 'Json'>
    readonly createdAt: FieldRef<"GuestProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"GuestProfile", 'DateTime'>
    readonly lastBookingDate: FieldRef<"GuestProfile", 'DateTime'>
    readonly lastLoginDate: FieldRef<"GuestProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GuestProfile findUnique
   */
  export type GuestProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestProfile
     */
    select?: GuestProfileSelect<ExtArgs> | null
    /**
     * Filter, which GuestProfile to fetch.
     */
    where: GuestProfileWhereUniqueInput
  }

  /**
   * GuestProfile findUniqueOrThrow
   */
  export type GuestProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestProfile
     */
    select?: GuestProfileSelect<ExtArgs> | null
    /**
     * Filter, which GuestProfile to fetch.
     */
    where: GuestProfileWhereUniqueInput
  }

  /**
   * GuestProfile findFirst
   */
  export type GuestProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestProfile
     */
    select?: GuestProfileSelect<ExtArgs> | null
    /**
     * Filter, which GuestProfile to fetch.
     */
    where?: GuestProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuestProfiles to fetch.
     */
    orderBy?: GuestProfileOrderByWithRelationInput | GuestProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuestProfiles.
     */
    cursor?: GuestProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuestProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuestProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuestProfiles.
     */
    distinct?: GuestProfileScalarFieldEnum | GuestProfileScalarFieldEnum[]
  }

  /**
   * GuestProfile findFirstOrThrow
   */
  export type GuestProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestProfile
     */
    select?: GuestProfileSelect<ExtArgs> | null
    /**
     * Filter, which GuestProfile to fetch.
     */
    where?: GuestProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuestProfiles to fetch.
     */
    orderBy?: GuestProfileOrderByWithRelationInput | GuestProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuestProfiles.
     */
    cursor?: GuestProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuestProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuestProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuestProfiles.
     */
    distinct?: GuestProfileScalarFieldEnum | GuestProfileScalarFieldEnum[]
  }

  /**
   * GuestProfile findMany
   */
  export type GuestProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestProfile
     */
    select?: GuestProfileSelect<ExtArgs> | null
    /**
     * Filter, which GuestProfiles to fetch.
     */
    where?: GuestProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuestProfiles to fetch.
     */
    orderBy?: GuestProfileOrderByWithRelationInput | GuestProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GuestProfiles.
     */
    cursor?: GuestProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuestProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuestProfiles.
     */
    skip?: number
    distinct?: GuestProfileScalarFieldEnum | GuestProfileScalarFieldEnum[]
  }

  /**
   * GuestProfile create
   */
  export type GuestProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestProfile
     */
    select?: GuestProfileSelect<ExtArgs> | null
    /**
     * The data needed to create a GuestProfile.
     */
    data: XOR<GuestProfileCreateInput, GuestProfileUncheckedCreateInput>
  }

  /**
   * GuestProfile createMany
   */
  export type GuestProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GuestProfiles.
     */
    data: GuestProfileCreateManyInput | GuestProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GuestProfile createManyAndReturn
   */
  export type GuestProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestProfile
     */
    select?: GuestProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many GuestProfiles.
     */
    data: GuestProfileCreateManyInput | GuestProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GuestProfile update
   */
  export type GuestProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestProfile
     */
    select?: GuestProfileSelect<ExtArgs> | null
    /**
     * The data needed to update a GuestProfile.
     */
    data: XOR<GuestProfileUpdateInput, GuestProfileUncheckedUpdateInput>
    /**
     * Choose, which GuestProfile to update.
     */
    where: GuestProfileWhereUniqueInput
  }

  /**
   * GuestProfile updateMany
   */
  export type GuestProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GuestProfiles.
     */
    data: XOR<GuestProfileUpdateManyMutationInput, GuestProfileUncheckedUpdateManyInput>
    /**
     * Filter which GuestProfiles to update
     */
    where?: GuestProfileWhereInput
  }

  /**
   * GuestProfile upsert
   */
  export type GuestProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestProfile
     */
    select?: GuestProfileSelect<ExtArgs> | null
    /**
     * The filter to search for the GuestProfile to update in case it exists.
     */
    where: GuestProfileWhereUniqueInput
    /**
     * In case the GuestProfile found by the `where` argument doesn't exist, create a new GuestProfile with this data.
     */
    create: XOR<GuestProfileCreateInput, GuestProfileUncheckedCreateInput>
    /**
     * In case the GuestProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GuestProfileUpdateInput, GuestProfileUncheckedUpdateInput>
  }

  /**
   * GuestProfile delete
   */
  export type GuestProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestProfile
     */
    select?: GuestProfileSelect<ExtArgs> | null
    /**
     * Filter which GuestProfile to delete.
     */
    where: GuestProfileWhereUniqueInput
  }

  /**
   * GuestProfile deleteMany
   */
  export type GuestProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuestProfiles to delete
     */
    where?: GuestProfileWhereInput
  }

  /**
   * GuestProfile without action
   */
  export type GuestProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestProfile
     */
    select?: GuestProfileSelect<ExtArgs> | null
  }


  /**
   * Model GuestActivityLog
   */

  export type AggregateGuestActivityLog = {
    _count: GuestActivityLogCountAggregateOutputType | null
    _min: GuestActivityLogMinAggregateOutputType | null
    _max: GuestActivityLogMaxAggregateOutputType | null
  }

  export type GuestActivityLogMinAggregateOutputType = {
    id: string | null
    guestId: string | null
    activityType: string | null
    description: string | null
    timestamp: Date | null
  }

  export type GuestActivityLogMaxAggregateOutputType = {
    id: string | null
    guestId: string | null
    activityType: string | null
    description: string | null
    timestamp: Date | null
  }

  export type GuestActivityLogCountAggregateOutputType = {
    id: number
    guestId: number
    activityType: number
    description: number
    metadata: number
    timestamp: number
    _all: number
  }


  export type GuestActivityLogMinAggregateInputType = {
    id?: true
    guestId?: true
    activityType?: true
    description?: true
    timestamp?: true
  }

  export type GuestActivityLogMaxAggregateInputType = {
    id?: true
    guestId?: true
    activityType?: true
    description?: true
    timestamp?: true
  }

  export type GuestActivityLogCountAggregateInputType = {
    id?: true
    guestId?: true
    activityType?: true
    description?: true
    metadata?: true
    timestamp?: true
    _all?: true
  }

  export type GuestActivityLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuestActivityLog to aggregate.
     */
    where?: GuestActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuestActivityLogs to fetch.
     */
    orderBy?: GuestActivityLogOrderByWithRelationInput | GuestActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GuestActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuestActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuestActivityLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GuestActivityLogs
    **/
    _count?: true | GuestActivityLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GuestActivityLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GuestActivityLogMaxAggregateInputType
  }

  export type GetGuestActivityLogAggregateType<T extends GuestActivityLogAggregateArgs> = {
        [P in keyof T & keyof AggregateGuestActivityLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGuestActivityLog[P]>
      : GetScalarType<T[P], AggregateGuestActivityLog[P]>
  }




  export type GuestActivityLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuestActivityLogWhereInput
    orderBy?: GuestActivityLogOrderByWithAggregationInput | GuestActivityLogOrderByWithAggregationInput[]
    by: GuestActivityLogScalarFieldEnum[] | GuestActivityLogScalarFieldEnum
    having?: GuestActivityLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GuestActivityLogCountAggregateInputType | true
    _min?: GuestActivityLogMinAggregateInputType
    _max?: GuestActivityLogMaxAggregateInputType
  }

  export type GuestActivityLogGroupByOutputType = {
    id: string
    guestId: string
    activityType: string
    description: string
    metadata: JsonValue | null
    timestamp: Date
    _count: GuestActivityLogCountAggregateOutputType | null
    _min: GuestActivityLogMinAggregateOutputType | null
    _max: GuestActivityLogMaxAggregateOutputType | null
  }

  type GetGuestActivityLogGroupByPayload<T extends GuestActivityLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GuestActivityLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GuestActivityLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GuestActivityLogGroupByOutputType[P]>
            : GetScalarType<T[P], GuestActivityLogGroupByOutputType[P]>
        }
      >
    >


  export type GuestActivityLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guestId?: boolean
    activityType?: boolean
    description?: boolean
    metadata?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["guestActivityLog"]>

  export type GuestActivityLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guestId?: boolean
    activityType?: boolean
    description?: boolean
    metadata?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["guestActivityLog"]>

  export type GuestActivityLogSelectScalar = {
    id?: boolean
    guestId?: boolean
    activityType?: boolean
    description?: boolean
    metadata?: boolean
    timestamp?: boolean
  }


  export type $GuestActivityLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GuestActivityLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      guestId: string
      activityType: string
      description: string
      metadata: Prisma.JsonValue | null
      timestamp: Date
    }, ExtArgs["result"]["guestActivityLog"]>
    composites: {}
  }

  type GuestActivityLogGetPayload<S extends boolean | null | undefined | GuestActivityLogDefaultArgs> = $Result.GetResult<Prisma.$GuestActivityLogPayload, S>

  type GuestActivityLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GuestActivityLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GuestActivityLogCountAggregateInputType | true
    }

  export interface GuestActivityLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GuestActivityLog'], meta: { name: 'GuestActivityLog' } }
    /**
     * Find zero or one GuestActivityLog that matches the filter.
     * @param {GuestActivityLogFindUniqueArgs} args - Arguments to find a GuestActivityLog
     * @example
     * // Get one GuestActivityLog
     * const guestActivityLog = await prisma.guestActivityLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GuestActivityLogFindUniqueArgs>(args: SelectSubset<T, GuestActivityLogFindUniqueArgs<ExtArgs>>): Prisma__GuestActivityLogClient<$Result.GetResult<Prisma.$GuestActivityLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one GuestActivityLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GuestActivityLogFindUniqueOrThrowArgs} args - Arguments to find a GuestActivityLog
     * @example
     * // Get one GuestActivityLog
     * const guestActivityLog = await prisma.guestActivityLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GuestActivityLogFindUniqueOrThrowArgs>(args: SelectSubset<T, GuestActivityLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GuestActivityLogClient<$Result.GetResult<Prisma.$GuestActivityLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first GuestActivityLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestActivityLogFindFirstArgs} args - Arguments to find a GuestActivityLog
     * @example
     * // Get one GuestActivityLog
     * const guestActivityLog = await prisma.guestActivityLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GuestActivityLogFindFirstArgs>(args?: SelectSubset<T, GuestActivityLogFindFirstArgs<ExtArgs>>): Prisma__GuestActivityLogClient<$Result.GetResult<Prisma.$GuestActivityLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first GuestActivityLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestActivityLogFindFirstOrThrowArgs} args - Arguments to find a GuestActivityLog
     * @example
     * // Get one GuestActivityLog
     * const guestActivityLog = await prisma.guestActivityLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GuestActivityLogFindFirstOrThrowArgs>(args?: SelectSubset<T, GuestActivityLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__GuestActivityLogClient<$Result.GetResult<Prisma.$GuestActivityLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more GuestActivityLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestActivityLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GuestActivityLogs
     * const guestActivityLogs = await prisma.guestActivityLog.findMany()
     * 
     * // Get first 10 GuestActivityLogs
     * const guestActivityLogs = await prisma.guestActivityLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const guestActivityLogWithIdOnly = await prisma.guestActivityLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GuestActivityLogFindManyArgs>(args?: SelectSubset<T, GuestActivityLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestActivityLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a GuestActivityLog.
     * @param {GuestActivityLogCreateArgs} args - Arguments to create a GuestActivityLog.
     * @example
     * // Create one GuestActivityLog
     * const GuestActivityLog = await prisma.guestActivityLog.create({
     *   data: {
     *     // ... data to create a GuestActivityLog
     *   }
     * })
     * 
     */
    create<T extends GuestActivityLogCreateArgs>(args: SelectSubset<T, GuestActivityLogCreateArgs<ExtArgs>>): Prisma__GuestActivityLogClient<$Result.GetResult<Prisma.$GuestActivityLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many GuestActivityLogs.
     * @param {GuestActivityLogCreateManyArgs} args - Arguments to create many GuestActivityLogs.
     * @example
     * // Create many GuestActivityLogs
     * const guestActivityLog = await prisma.guestActivityLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GuestActivityLogCreateManyArgs>(args?: SelectSubset<T, GuestActivityLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GuestActivityLogs and returns the data saved in the database.
     * @param {GuestActivityLogCreateManyAndReturnArgs} args - Arguments to create many GuestActivityLogs.
     * @example
     * // Create many GuestActivityLogs
     * const guestActivityLog = await prisma.guestActivityLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GuestActivityLogs and only return the `id`
     * const guestActivityLogWithIdOnly = await prisma.guestActivityLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GuestActivityLogCreateManyAndReturnArgs>(args?: SelectSubset<T, GuestActivityLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestActivityLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a GuestActivityLog.
     * @param {GuestActivityLogDeleteArgs} args - Arguments to delete one GuestActivityLog.
     * @example
     * // Delete one GuestActivityLog
     * const GuestActivityLog = await prisma.guestActivityLog.delete({
     *   where: {
     *     // ... filter to delete one GuestActivityLog
     *   }
     * })
     * 
     */
    delete<T extends GuestActivityLogDeleteArgs>(args: SelectSubset<T, GuestActivityLogDeleteArgs<ExtArgs>>): Prisma__GuestActivityLogClient<$Result.GetResult<Prisma.$GuestActivityLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one GuestActivityLog.
     * @param {GuestActivityLogUpdateArgs} args - Arguments to update one GuestActivityLog.
     * @example
     * // Update one GuestActivityLog
     * const guestActivityLog = await prisma.guestActivityLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GuestActivityLogUpdateArgs>(args: SelectSubset<T, GuestActivityLogUpdateArgs<ExtArgs>>): Prisma__GuestActivityLogClient<$Result.GetResult<Prisma.$GuestActivityLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more GuestActivityLogs.
     * @param {GuestActivityLogDeleteManyArgs} args - Arguments to filter GuestActivityLogs to delete.
     * @example
     * // Delete a few GuestActivityLogs
     * const { count } = await prisma.guestActivityLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GuestActivityLogDeleteManyArgs>(args?: SelectSubset<T, GuestActivityLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GuestActivityLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestActivityLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GuestActivityLogs
     * const guestActivityLog = await prisma.guestActivityLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GuestActivityLogUpdateManyArgs>(args: SelectSubset<T, GuestActivityLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GuestActivityLog.
     * @param {GuestActivityLogUpsertArgs} args - Arguments to update or create a GuestActivityLog.
     * @example
     * // Update or create a GuestActivityLog
     * const guestActivityLog = await prisma.guestActivityLog.upsert({
     *   create: {
     *     // ... data to create a GuestActivityLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GuestActivityLog we want to update
     *   }
     * })
     */
    upsert<T extends GuestActivityLogUpsertArgs>(args: SelectSubset<T, GuestActivityLogUpsertArgs<ExtArgs>>): Prisma__GuestActivityLogClient<$Result.GetResult<Prisma.$GuestActivityLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of GuestActivityLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestActivityLogCountArgs} args - Arguments to filter GuestActivityLogs to count.
     * @example
     * // Count the number of GuestActivityLogs
     * const count = await prisma.guestActivityLog.count({
     *   where: {
     *     // ... the filter for the GuestActivityLogs we want to count
     *   }
     * })
    **/
    count<T extends GuestActivityLogCountArgs>(
      args?: Subset<T, GuestActivityLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GuestActivityLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GuestActivityLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestActivityLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GuestActivityLogAggregateArgs>(args: Subset<T, GuestActivityLogAggregateArgs>): Prisma.PrismaPromise<GetGuestActivityLogAggregateType<T>>

    /**
     * Group by GuestActivityLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestActivityLogGroupByArgs} args - Group by arguments.
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
      T extends GuestActivityLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GuestActivityLogGroupByArgs['orderBy'] }
        : { orderBy?: GuestActivityLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GuestActivityLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGuestActivityLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GuestActivityLog model
   */
  readonly fields: GuestActivityLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GuestActivityLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GuestActivityLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the GuestActivityLog model
   */ 
  interface GuestActivityLogFieldRefs {
    readonly id: FieldRef<"GuestActivityLog", 'String'>
    readonly guestId: FieldRef<"GuestActivityLog", 'String'>
    readonly activityType: FieldRef<"GuestActivityLog", 'String'>
    readonly description: FieldRef<"GuestActivityLog", 'String'>
    readonly metadata: FieldRef<"GuestActivityLog", 'Json'>
    readonly timestamp: FieldRef<"GuestActivityLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GuestActivityLog findUnique
   */
  export type GuestActivityLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestActivityLog
     */
    select?: GuestActivityLogSelect<ExtArgs> | null
    /**
     * Filter, which GuestActivityLog to fetch.
     */
    where: GuestActivityLogWhereUniqueInput
  }

  /**
   * GuestActivityLog findUniqueOrThrow
   */
  export type GuestActivityLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestActivityLog
     */
    select?: GuestActivityLogSelect<ExtArgs> | null
    /**
     * Filter, which GuestActivityLog to fetch.
     */
    where: GuestActivityLogWhereUniqueInput
  }

  /**
   * GuestActivityLog findFirst
   */
  export type GuestActivityLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestActivityLog
     */
    select?: GuestActivityLogSelect<ExtArgs> | null
    /**
     * Filter, which GuestActivityLog to fetch.
     */
    where?: GuestActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuestActivityLogs to fetch.
     */
    orderBy?: GuestActivityLogOrderByWithRelationInput | GuestActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuestActivityLogs.
     */
    cursor?: GuestActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuestActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuestActivityLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuestActivityLogs.
     */
    distinct?: GuestActivityLogScalarFieldEnum | GuestActivityLogScalarFieldEnum[]
  }

  /**
   * GuestActivityLog findFirstOrThrow
   */
  export type GuestActivityLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestActivityLog
     */
    select?: GuestActivityLogSelect<ExtArgs> | null
    /**
     * Filter, which GuestActivityLog to fetch.
     */
    where?: GuestActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuestActivityLogs to fetch.
     */
    orderBy?: GuestActivityLogOrderByWithRelationInput | GuestActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuestActivityLogs.
     */
    cursor?: GuestActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuestActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuestActivityLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuestActivityLogs.
     */
    distinct?: GuestActivityLogScalarFieldEnum | GuestActivityLogScalarFieldEnum[]
  }

  /**
   * GuestActivityLog findMany
   */
  export type GuestActivityLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestActivityLog
     */
    select?: GuestActivityLogSelect<ExtArgs> | null
    /**
     * Filter, which GuestActivityLogs to fetch.
     */
    where?: GuestActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuestActivityLogs to fetch.
     */
    orderBy?: GuestActivityLogOrderByWithRelationInput | GuestActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GuestActivityLogs.
     */
    cursor?: GuestActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuestActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuestActivityLogs.
     */
    skip?: number
    distinct?: GuestActivityLogScalarFieldEnum | GuestActivityLogScalarFieldEnum[]
  }

  /**
   * GuestActivityLog create
   */
  export type GuestActivityLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestActivityLog
     */
    select?: GuestActivityLogSelect<ExtArgs> | null
    /**
     * The data needed to create a GuestActivityLog.
     */
    data: XOR<GuestActivityLogCreateInput, GuestActivityLogUncheckedCreateInput>
  }

  /**
   * GuestActivityLog createMany
   */
  export type GuestActivityLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GuestActivityLogs.
     */
    data: GuestActivityLogCreateManyInput | GuestActivityLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GuestActivityLog createManyAndReturn
   */
  export type GuestActivityLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestActivityLog
     */
    select?: GuestActivityLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many GuestActivityLogs.
     */
    data: GuestActivityLogCreateManyInput | GuestActivityLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GuestActivityLog update
   */
  export type GuestActivityLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestActivityLog
     */
    select?: GuestActivityLogSelect<ExtArgs> | null
    /**
     * The data needed to update a GuestActivityLog.
     */
    data: XOR<GuestActivityLogUpdateInput, GuestActivityLogUncheckedUpdateInput>
    /**
     * Choose, which GuestActivityLog to update.
     */
    where: GuestActivityLogWhereUniqueInput
  }

  /**
   * GuestActivityLog updateMany
   */
  export type GuestActivityLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GuestActivityLogs.
     */
    data: XOR<GuestActivityLogUpdateManyMutationInput, GuestActivityLogUncheckedUpdateManyInput>
    /**
     * Filter which GuestActivityLogs to update
     */
    where?: GuestActivityLogWhereInput
  }

  /**
   * GuestActivityLog upsert
   */
  export type GuestActivityLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestActivityLog
     */
    select?: GuestActivityLogSelect<ExtArgs> | null
    /**
     * The filter to search for the GuestActivityLog to update in case it exists.
     */
    where: GuestActivityLogWhereUniqueInput
    /**
     * In case the GuestActivityLog found by the `where` argument doesn't exist, create a new GuestActivityLog with this data.
     */
    create: XOR<GuestActivityLogCreateInput, GuestActivityLogUncheckedCreateInput>
    /**
     * In case the GuestActivityLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GuestActivityLogUpdateInput, GuestActivityLogUncheckedUpdateInput>
  }

  /**
   * GuestActivityLog delete
   */
  export type GuestActivityLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestActivityLog
     */
    select?: GuestActivityLogSelect<ExtArgs> | null
    /**
     * Filter which GuestActivityLog to delete.
     */
    where: GuestActivityLogWhereUniqueInput
  }

  /**
   * GuestActivityLog deleteMany
   */
  export type GuestActivityLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuestActivityLogs to delete
     */
    where?: GuestActivityLogWhereInput
  }

  /**
   * GuestActivityLog without action
   */
  export type GuestActivityLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestActivityLog
     */
    select?: GuestActivityLogSelect<ExtArgs> | null
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


  export const PropertyScalarFieldEnum: {
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
    updatedAt: 'updatedAt'
  };

  export type PropertyScalarFieldEnum = (typeof PropertyScalarFieldEnum)[keyof typeof PropertyScalarFieldEnum]


  export const RoomTypeScalarFieldEnum: {
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
    updatedAt: 'updatedAt'
  };

  export type RoomTypeScalarFieldEnum = (typeof RoomTypeScalarFieldEnum)[keyof typeof RoomTypeScalarFieldEnum]


  export const BookingScalarFieldEnum: {
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
    metadata: 'metadata'
  };

  export type BookingScalarFieldEnum = (typeof BookingScalarFieldEnum)[keyof typeof BookingScalarFieldEnum]


  export const BookedRoomScalarFieldEnum: {
    id: 'id',
    bookingId: 'bookingId',
    roomTypeId: 'roomTypeId',
    roomNumber: 'roomNumber',
    quantity: 'quantity',
    guestCount: 'guestCount',
    rate: 'rate',
    totalPrice: 'totalPrice',
    guests: 'guests'
  };

  export type BookedRoomScalarFieldEnum = (typeof BookedRoomScalarFieldEnum)[keyof typeof BookedRoomScalarFieldEnum]


  export const InventoryRecordScalarFieldEnum: {
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
    updatedAt: 'updatedAt'
  };

  export type InventoryRecordScalarFieldEnum = (typeof InventoryRecordScalarFieldEnum)[keyof typeof InventoryRecordScalarFieldEnum]


  export const InventoryReservationScalarFieldEnum: {
    id: 'id',
    propertyId: 'propertyId',
    roomTypeId: 'roomTypeId',
    checkInDate: 'checkInDate',
    checkOutDate: 'checkOutDate',
    roomQuantity: 'roomQuantity',
    status: 'status',
    expiresAt: 'expiresAt',
    bookingId: 'bookingId',
    createdAt: 'createdAt'
  };

  export type InventoryReservationScalarFieldEnum = (typeof InventoryReservationScalarFieldEnum)[keyof typeof InventoryReservationScalarFieldEnum]


  export const InventoryLockScalarFieldEnum: {
    id: 'id',
    propertyId: 'propertyId',
    roomTypeId: 'roomTypeId',
    checkInDate: 'checkInDate',
    checkOutDate: 'checkOutDate',
    quantity: 'quantity',
    lockedBy: 'lockedBy',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type InventoryLockScalarFieldEnum = (typeof InventoryLockScalarFieldEnum)[keyof typeof InventoryLockScalarFieldEnum]


  export const RateRecordScalarFieldEnum: {
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
    updatedAt: 'updatedAt'
  };

  export type RateRecordScalarFieldEnum = (typeof RateRecordScalarFieldEnum)[keyof typeof RateRecordScalarFieldEnum]


  export const DynamicPricingRuleScalarFieldEnum: {
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
    updatedAt: 'updatedAt'
  };

  export type DynamicPricingRuleScalarFieldEnum = (typeof DynamicPricingRuleScalarFieldEnum)[keyof typeof DynamicPricingRuleScalarFieldEnum]


  export const SeasonalRateScalarFieldEnum: {
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
    updatedAt: 'updatedAt'
  };

  export type SeasonalRateScalarFieldEnum = (typeof SeasonalRateScalarFieldEnum)[keyof typeof SeasonalRateScalarFieldEnum]


  export const PromotionScalarFieldEnum: {
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
    updatedAt: 'updatedAt'
  };

  export type PromotionScalarFieldEnum = (typeof PromotionScalarFieldEnum)[keyof typeof PromotionScalarFieldEnum]


  export const GroupDiscountScalarFieldEnum: {
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
    updatedAt: 'updatedAt'
  };

  export type GroupDiscountScalarFieldEnum = (typeof GroupDiscountScalarFieldEnum)[keyof typeof GroupDiscountScalarFieldEnum]


  export const TaxConfigurationScalarFieldEnum: {
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
    updatedAt: 'updatedAt'
  };

  export type TaxConfigurationScalarFieldEnum = (typeof TaxConfigurationScalarFieldEnum)[keyof typeof TaxConfigurationScalarFieldEnum]


  export const GuestProfileScalarFieldEnum: {
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
    lastLoginDate: 'lastLoginDate'
  };

  export type GuestProfileScalarFieldEnum = (typeof GuestProfileScalarFieldEnum)[keyof typeof GuestProfileScalarFieldEnum]


  export const GuestActivityLogScalarFieldEnum: {
    id: 'id',
    guestId: 'guestId',
    activityType: 'activityType',
    description: 'description',
    metadata: 'metadata',
    timestamp: 'timestamp'
  };

  export type GuestActivityLogScalarFieldEnum = (typeof GuestActivityLogScalarFieldEnum)[keyof typeof GuestActivityLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type PropertyWhereInput = {
    AND?: PropertyWhereInput | PropertyWhereInput[]
    OR?: PropertyWhereInput[]
    NOT?: PropertyWhereInput | PropertyWhereInput[]
    id?: StringFilter<"Property"> | string
    name?: StringFilter<"Property"> | string
    description?: StringFilter<"Property"> | string
    category?: StringFilter<"Property"> | string
    address?: JsonFilter<"Property">
    coordinates?: JsonFilter<"Property">
    timezone?: StringFilter<"Property"> | string
    starRating?: IntNullableFilter<"Property"> | number | null
    amenities?: JsonFilter<"Property">
    policies?: JsonFilter<"Property">
    contactInfo?: JsonFilter<"Property">
    images?: JsonFilter<"Property">
    virtualTour?: StringNullableFilter<"Property"> | string | null
    ownerId?: StringFilter<"Property"> | string
    chainId?: StringNullableFilter<"Property"> | string | null
    brandId?: StringNullableFilter<"Property"> | string | null
    status?: StringFilter<"Property"> | string
    settings?: JsonFilter<"Property">
    createdAt?: DateTimeFilter<"Property"> | Date | string
    updatedAt?: DateTimeFilter<"Property"> | Date | string
    roomTypes?: RoomTypeListRelationFilter
    bookings?: BookingListRelationFilter
    inventory?: InventoryRecordListRelationFilter
    rates?: RateRecordListRelationFilter
    promotions?: PromotionListRelationFilter
  }

  export type PropertyOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    address?: SortOrder
    coordinates?: SortOrder
    timezone?: SortOrder
    starRating?: SortOrderInput | SortOrder
    amenities?: SortOrder
    policies?: SortOrder
    contactInfo?: SortOrder
    images?: SortOrder
    virtualTour?: SortOrderInput | SortOrder
    ownerId?: SortOrder
    chainId?: SortOrderInput | SortOrder
    brandId?: SortOrderInput | SortOrder
    status?: SortOrder
    settings?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    roomTypes?: RoomTypeOrderByRelationAggregateInput
    bookings?: BookingOrderByRelationAggregateInput
    inventory?: InventoryRecordOrderByRelationAggregateInput
    rates?: RateRecordOrderByRelationAggregateInput
    promotions?: PromotionOrderByRelationAggregateInput
  }

  export type PropertyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PropertyWhereInput | PropertyWhereInput[]
    OR?: PropertyWhereInput[]
    NOT?: PropertyWhereInput | PropertyWhereInput[]
    name?: StringFilter<"Property"> | string
    description?: StringFilter<"Property"> | string
    category?: StringFilter<"Property"> | string
    address?: JsonFilter<"Property">
    coordinates?: JsonFilter<"Property">
    timezone?: StringFilter<"Property"> | string
    starRating?: IntNullableFilter<"Property"> | number | null
    amenities?: JsonFilter<"Property">
    policies?: JsonFilter<"Property">
    contactInfo?: JsonFilter<"Property">
    images?: JsonFilter<"Property">
    virtualTour?: StringNullableFilter<"Property"> | string | null
    ownerId?: StringFilter<"Property"> | string
    chainId?: StringNullableFilter<"Property"> | string | null
    brandId?: StringNullableFilter<"Property"> | string | null
    status?: StringFilter<"Property"> | string
    settings?: JsonFilter<"Property">
    createdAt?: DateTimeFilter<"Property"> | Date | string
    updatedAt?: DateTimeFilter<"Property"> | Date | string
    roomTypes?: RoomTypeListRelationFilter
    bookings?: BookingListRelationFilter
    inventory?: InventoryRecordListRelationFilter
    rates?: RateRecordListRelationFilter
    promotions?: PromotionListRelationFilter
  }, "id">

  export type PropertyOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    address?: SortOrder
    coordinates?: SortOrder
    timezone?: SortOrder
    starRating?: SortOrderInput | SortOrder
    amenities?: SortOrder
    policies?: SortOrder
    contactInfo?: SortOrder
    images?: SortOrder
    virtualTour?: SortOrderInput | SortOrder
    ownerId?: SortOrder
    chainId?: SortOrderInput | SortOrder
    brandId?: SortOrderInput | SortOrder
    status?: SortOrder
    settings?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PropertyCountOrderByAggregateInput
    _avg?: PropertyAvgOrderByAggregateInput
    _max?: PropertyMaxOrderByAggregateInput
    _min?: PropertyMinOrderByAggregateInput
    _sum?: PropertySumOrderByAggregateInput
  }

  export type PropertyScalarWhereWithAggregatesInput = {
    AND?: PropertyScalarWhereWithAggregatesInput | PropertyScalarWhereWithAggregatesInput[]
    OR?: PropertyScalarWhereWithAggregatesInput[]
    NOT?: PropertyScalarWhereWithAggregatesInput | PropertyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Property"> | string
    name?: StringWithAggregatesFilter<"Property"> | string
    description?: StringWithAggregatesFilter<"Property"> | string
    category?: StringWithAggregatesFilter<"Property"> | string
    address?: JsonWithAggregatesFilter<"Property">
    coordinates?: JsonWithAggregatesFilter<"Property">
    timezone?: StringWithAggregatesFilter<"Property"> | string
    starRating?: IntNullableWithAggregatesFilter<"Property"> | number | null
    amenities?: JsonWithAggregatesFilter<"Property">
    policies?: JsonWithAggregatesFilter<"Property">
    contactInfo?: JsonWithAggregatesFilter<"Property">
    images?: JsonWithAggregatesFilter<"Property">
    virtualTour?: StringNullableWithAggregatesFilter<"Property"> | string | null
    ownerId?: StringWithAggregatesFilter<"Property"> | string
    chainId?: StringNullableWithAggregatesFilter<"Property"> | string | null
    brandId?: StringNullableWithAggregatesFilter<"Property"> | string | null
    status?: StringWithAggregatesFilter<"Property"> | string
    settings?: JsonWithAggregatesFilter<"Property">
    createdAt?: DateTimeWithAggregatesFilter<"Property"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Property"> | Date | string
  }

  export type RoomTypeWhereInput = {
    AND?: RoomTypeWhereInput | RoomTypeWhereInput[]
    OR?: RoomTypeWhereInput[]
    NOT?: RoomTypeWhereInput | RoomTypeWhereInput[]
    id?: StringFilter<"RoomType"> | string
    propertyId?: StringFilter<"RoomType"> | string
    name?: StringFilter<"RoomType"> | string
    description?: StringFilter<"RoomType"> | string
    category?: StringFilter<"RoomType"> | string
    maxOccupancy?: IntFilter<"RoomType"> | number
    bedConfiguration?: JsonFilter<"RoomType">
    roomSize?: FloatFilter<"RoomType"> | number
    roomSizeUnit?: StringFilter<"RoomType"> | string
    amenities?: JsonFilter<"RoomType">
    view?: StringNullableFilter<"RoomType"> | string | null
    floor?: StringNullableFilter<"RoomType"> | string | null
    totalRooms?: IntFilter<"RoomType"> | number
    baseRate?: FloatFilter<"RoomType"> | number
    currency?: StringFilter<"RoomType"> | string
    images?: JsonFilter<"RoomType">
    isActive?: BoolFilter<"RoomType"> | boolean
    createdAt?: DateTimeFilter<"RoomType"> | Date | string
    updatedAt?: DateTimeFilter<"RoomType"> | Date | string
    property?: XOR<PropertyRelationFilter, PropertyWhereInput>
    bookings?: BookedRoomListRelationFilter
    inventory?: InventoryRecordListRelationFilter
    rates?: RateRecordListRelationFilter
  }

  export type RoomTypeOrderByWithRelationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    maxOccupancy?: SortOrder
    bedConfiguration?: SortOrder
    roomSize?: SortOrder
    roomSizeUnit?: SortOrder
    amenities?: SortOrder
    view?: SortOrderInput | SortOrder
    floor?: SortOrderInput | SortOrder
    totalRooms?: SortOrder
    baseRate?: SortOrder
    currency?: SortOrder
    images?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    property?: PropertyOrderByWithRelationInput
    bookings?: BookedRoomOrderByRelationAggregateInput
    inventory?: InventoryRecordOrderByRelationAggregateInput
    rates?: RateRecordOrderByRelationAggregateInput
  }

  export type RoomTypeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RoomTypeWhereInput | RoomTypeWhereInput[]
    OR?: RoomTypeWhereInput[]
    NOT?: RoomTypeWhereInput | RoomTypeWhereInput[]
    propertyId?: StringFilter<"RoomType"> | string
    name?: StringFilter<"RoomType"> | string
    description?: StringFilter<"RoomType"> | string
    category?: StringFilter<"RoomType"> | string
    maxOccupancy?: IntFilter<"RoomType"> | number
    bedConfiguration?: JsonFilter<"RoomType">
    roomSize?: FloatFilter<"RoomType"> | number
    roomSizeUnit?: StringFilter<"RoomType"> | string
    amenities?: JsonFilter<"RoomType">
    view?: StringNullableFilter<"RoomType"> | string | null
    floor?: StringNullableFilter<"RoomType"> | string | null
    totalRooms?: IntFilter<"RoomType"> | number
    baseRate?: FloatFilter<"RoomType"> | number
    currency?: StringFilter<"RoomType"> | string
    images?: JsonFilter<"RoomType">
    isActive?: BoolFilter<"RoomType"> | boolean
    createdAt?: DateTimeFilter<"RoomType"> | Date | string
    updatedAt?: DateTimeFilter<"RoomType"> | Date | string
    property?: XOR<PropertyRelationFilter, PropertyWhereInput>
    bookings?: BookedRoomListRelationFilter
    inventory?: InventoryRecordListRelationFilter
    rates?: RateRecordListRelationFilter
  }, "id">

  export type RoomTypeOrderByWithAggregationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    maxOccupancy?: SortOrder
    bedConfiguration?: SortOrder
    roomSize?: SortOrder
    roomSizeUnit?: SortOrder
    amenities?: SortOrder
    view?: SortOrderInput | SortOrder
    floor?: SortOrderInput | SortOrder
    totalRooms?: SortOrder
    baseRate?: SortOrder
    currency?: SortOrder
    images?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RoomTypeCountOrderByAggregateInput
    _avg?: RoomTypeAvgOrderByAggregateInput
    _max?: RoomTypeMaxOrderByAggregateInput
    _min?: RoomTypeMinOrderByAggregateInput
    _sum?: RoomTypeSumOrderByAggregateInput
  }

  export type RoomTypeScalarWhereWithAggregatesInput = {
    AND?: RoomTypeScalarWhereWithAggregatesInput | RoomTypeScalarWhereWithAggregatesInput[]
    OR?: RoomTypeScalarWhereWithAggregatesInput[]
    NOT?: RoomTypeScalarWhereWithAggregatesInput | RoomTypeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RoomType"> | string
    propertyId?: StringWithAggregatesFilter<"RoomType"> | string
    name?: StringWithAggregatesFilter<"RoomType"> | string
    description?: StringWithAggregatesFilter<"RoomType"> | string
    category?: StringWithAggregatesFilter<"RoomType"> | string
    maxOccupancy?: IntWithAggregatesFilter<"RoomType"> | number
    bedConfiguration?: JsonWithAggregatesFilter<"RoomType">
    roomSize?: FloatWithAggregatesFilter<"RoomType"> | number
    roomSizeUnit?: StringWithAggregatesFilter<"RoomType"> | string
    amenities?: JsonWithAggregatesFilter<"RoomType">
    view?: StringNullableWithAggregatesFilter<"RoomType"> | string | null
    floor?: StringNullableWithAggregatesFilter<"RoomType"> | string | null
    totalRooms?: IntWithAggregatesFilter<"RoomType"> | number
    baseRate?: FloatWithAggregatesFilter<"RoomType"> | number
    currency?: StringWithAggregatesFilter<"RoomType"> | string
    images?: JsonWithAggregatesFilter<"RoomType">
    isActive?: BoolWithAggregatesFilter<"RoomType"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"RoomType"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RoomType"> | Date | string
  }

  export type BookingWhereInput = {
    AND?: BookingWhereInput | BookingWhereInput[]
    OR?: BookingWhereInput[]
    NOT?: BookingWhereInput | BookingWhereInput[]
    id?: StringFilter<"Booking"> | string
    confirmationNumber?: StringFilter<"Booking"> | string
    propertyId?: StringFilter<"Booking"> | string
    guestId?: StringFilter<"Booking"> | string
    primaryGuest?: JsonFilter<"Booking">
    additionalGuests?: JsonFilter<"Booking">
    checkInDate?: DateTimeFilter<"Booking"> | Date | string
    checkOutDate?: DateTimeFilter<"Booking"> | Date | string
    nights?: IntFilter<"Booking"> | number
    rooms?: JsonFilter<"Booking">
    pricing?: JsonFilter<"Booking">
    totalAmount?: FloatFilter<"Booking"> | number
    currency?: StringFilter<"Booking"> | string
    status?: StringFilter<"Booking"> | string
    bookingSource?: StringFilter<"Booking"> | string
    specialRequests?: StringNullableFilter<"Booking"> | string | null
    preferences?: JsonFilter<"Booking">
    paymentStatus?: StringFilter<"Booking"> | string
    paymentMethod?: StringNullableFilter<"Booking"> | string | null
    cancellationPolicy?: StringFilter<"Booking"> | string
    noShowPolicy?: StringFilter<"Booking"> | string
    bookedAt?: DateTimeFilter<"Booking"> | Date | string
    createdAt?: DateTimeFilter<"Booking"> | Date | string
    updatedAt?: DateTimeFilter<"Booking"> | Date | string
    metadata?: JsonNullableFilter<"Booking">
    property?: XOR<PropertyRelationFilter, PropertyWhereInput>
    bookedRooms?: BookedRoomListRelationFilter
  }

  export type BookingOrderByWithRelationInput = {
    id?: SortOrder
    confirmationNumber?: SortOrder
    propertyId?: SortOrder
    guestId?: SortOrder
    primaryGuest?: SortOrder
    additionalGuests?: SortOrder
    checkInDate?: SortOrder
    checkOutDate?: SortOrder
    nights?: SortOrder
    rooms?: SortOrder
    pricing?: SortOrder
    totalAmount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    bookingSource?: SortOrder
    specialRequests?: SortOrderInput | SortOrder
    preferences?: SortOrder
    paymentStatus?: SortOrder
    paymentMethod?: SortOrderInput | SortOrder
    cancellationPolicy?: SortOrder
    noShowPolicy?: SortOrder
    bookedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    metadata?: SortOrderInput | SortOrder
    property?: PropertyOrderByWithRelationInput
    bookedRooms?: BookedRoomOrderByRelationAggregateInput
  }

  export type BookingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    confirmationNumber?: string
    AND?: BookingWhereInput | BookingWhereInput[]
    OR?: BookingWhereInput[]
    NOT?: BookingWhereInput | BookingWhereInput[]
    propertyId?: StringFilter<"Booking"> | string
    guestId?: StringFilter<"Booking"> | string
    primaryGuest?: JsonFilter<"Booking">
    additionalGuests?: JsonFilter<"Booking">
    checkInDate?: DateTimeFilter<"Booking"> | Date | string
    checkOutDate?: DateTimeFilter<"Booking"> | Date | string
    nights?: IntFilter<"Booking"> | number
    rooms?: JsonFilter<"Booking">
    pricing?: JsonFilter<"Booking">
    totalAmount?: FloatFilter<"Booking"> | number
    currency?: StringFilter<"Booking"> | string
    status?: StringFilter<"Booking"> | string
    bookingSource?: StringFilter<"Booking"> | string
    specialRequests?: StringNullableFilter<"Booking"> | string | null
    preferences?: JsonFilter<"Booking">
    paymentStatus?: StringFilter<"Booking"> | string
    paymentMethod?: StringNullableFilter<"Booking"> | string | null
    cancellationPolicy?: StringFilter<"Booking"> | string
    noShowPolicy?: StringFilter<"Booking"> | string
    bookedAt?: DateTimeFilter<"Booking"> | Date | string
    createdAt?: DateTimeFilter<"Booking"> | Date | string
    updatedAt?: DateTimeFilter<"Booking"> | Date | string
    metadata?: JsonNullableFilter<"Booking">
    property?: XOR<PropertyRelationFilter, PropertyWhereInput>
    bookedRooms?: BookedRoomListRelationFilter
  }, "id" | "confirmationNumber">

  export type BookingOrderByWithAggregationInput = {
    id?: SortOrder
    confirmationNumber?: SortOrder
    propertyId?: SortOrder
    guestId?: SortOrder
    primaryGuest?: SortOrder
    additionalGuests?: SortOrder
    checkInDate?: SortOrder
    checkOutDate?: SortOrder
    nights?: SortOrder
    rooms?: SortOrder
    pricing?: SortOrder
    totalAmount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    bookingSource?: SortOrder
    specialRequests?: SortOrderInput | SortOrder
    preferences?: SortOrder
    paymentStatus?: SortOrder
    paymentMethod?: SortOrderInput | SortOrder
    cancellationPolicy?: SortOrder
    noShowPolicy?: SortOrder
    bookedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    metadata?: SortOrderInput | SortOrder
    _count?: BookingCountOrderByAggregateInput
    _avg?: BookingAvgOrderByAggregateInput
    _max?: BookingMaxOrderByAggregateInput
    _min?: BookingMinOrderByAggregateInput
    _sum?: BookingSumOrderByAggregateInput
  }

  export type BookingScalarWhereWithAggregatesInput = {
    AND?: BookingScalarWhereWithAggregatesInput | BookingScalarWhereWithAggregatesInput[]
    OR?: BookingScalarWhereWithAggregatesInput[]
    NOT?: BookingScalarWhereWithAggregatesInput | BookingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Booking"> | string
    confirmationNumber?: StringWithAggregatesFilter<"Booking"> | string
    propertyId?: StringWithAggregatesFilter<"Booking"> | string
    guestId?: StringWithAggregatesFilter<"Booking"> | string
    primaryGuest?: JsonWithAggregatesFilter<"Booking">
    additionalGuests?: JsonWithAggregatesFilter<"Booking">
    checkInDate?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    checkOutDate?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    nights?: IntWithAggregatesFilter<"Booking"> | number
    rooms?: JsonWithAggregatesFilter<"Booking">
    pricing?: JsonWithAggregatesFilter<"Booking">
    totalAmount?: FloatWithAggregatesFilter<"Booking"> | number
    currency?: StringWithAggregatesFilter<"Booking"> | string
    status?: StringWithAggregatesFilter<"Booking"> | string
    bookingSource?: StringWithAggregatesFilter<"Booking"> | string
    specialRequests?: StringNullableWithAggregatesFilter<"Booking"> | string | null
    preferences?: JsonWithAggregatesFilter<"Booking">
    paymentStatus?: StringWithAggregatesFilter<"Booking"> | string
    paymentMethod?: StringNullableWithAggregatesFilter<"Booking"> | string | null
    cancellationPolicy?: StringWithAggregatesFilter<"Booking"> | string
    noShowPolicy?: StringWithAggregatesFilter<"Booking"> | string
    bookedAt?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    metadata?: JsonNullableWithAggregatesFilter<"Booking">
  }

  export type BookedRoomWhereInput = {
    AND?: BookedRoomWhereInput | BookedRoomWhereInput[]
    OR?: BookedRoomWhereInput[]
    NOT?: BookedRoomWhereInput | BookedRoomWhereInput[]
    id?: StringFilter<"BookedRoom"> | string
    bookingId?: StringFilter<"BookedRoom"> | string
    roomTypeId?: StringFilter<"BookedRoom"> | string
    roomNumber?: StringNullableFilter<"BookedRoom"> | string | null
    quantity?: IntFilter<"BookedRoom"> | number
    guestCount?: IntFilter<"BookedRoom"> | number
    rate?: FloatFilter<"BookedRoom"> | number
    totalPrice?: FloatFilter<"BookedRoom"> | number
    guests?: JsonFilter<"BookedRoom">
    booking?: XOR<BookingRelationFilter, BookingWhereInput>
    roomType?: XOR<RoomTypeRelationFilter, RoomTypeWhereInput>
  }

  export type BookedRoomOrderByWithRelationInput = {
    id?: SortOrder
    bookingId?: SortOrder
    roomTypeId?: SortOrder
    roomNumber?: SortOrderInput | SortOrder
    quantity?: SortOrder
    guestCount?: SortOrder
    rate?: SortOrder
    totalPrice?: SortOrder
    guests?: SortOrder
    booking?: BookingOrderByWithRelationInput
    roomType?: RoomTypeOrderByWithRelationInput
  }

  export type BookedRoomWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BookedRoomWhereInput | BookedRoomWhereInput[]
    OR?: BookedRoomWhereInput[]
    NOT?: BookedRoomWhereInput | BookedRoomWhereInput[]
    bookingId?: StringFilter<"BookedRoom"> | string
    roomTypeId?: StringFilter<"BookedRoom"> | string
    roomNumber?: StringNullableFilter<"BookedRoom"> | string | null
    quantity?: IntFilter<"BookedRoom"> | number
    guestCount?: IntFilter<"BookedRoom"> | number
    rate?: FloatFilter<"BookedRoom"> | number
    totalPrice?: FloatFilter<"BookedRoom"> | number
    guests?: JsonFilter<"BookedRoom">
    booking?: XOR<BookingRelationFilter, BookingWhereInput>
    roomType?: XOR<RoomTypeRelationFilter, RoomTypeWhereInput>
  }, "id">

  export type BookedRoomOrderByWithAggregationInput = {
    id?: SortOrder
    bookingId?: SortOrder
    roomTypeId?: SortOrder
    roomNumber?: SortOrderInput | SortOrder
    quantity?: SortOrder
    guestCount?: SortOrder
    rate?: SortOrder
    totalPrice?: SortOrder
    guests?: SortOrder
    _count?: BookedRoomCountOrderByAggregateInput
    _avg?: BookedRoomAvgOrderByAggregateInput
    _max?: BookedRoomMaxOrderByAggregateInput
    _min?: BookedRoomMinOrderByAggregateInput
    _sum?: BookedRoomSumOrderByAggregateInput
  }

  export type BookedRoomScalarWhereWithAggregatesInput = {
    AND?: BookedRoomScalarWhereWithAggregatesInput | BookedRoomScalarWhereWithAggregatesInput[]
    OR?: BookedRoomScalarWhereWithAggregatesInput[]
    NOT?: BookedRoomScalarWhereWithAggregatesInput | BookedRoomScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BookedRoom"> | string
    bookingId?: StringWithAggregatesFilter<"BookedRoom"> | string
    roomTypeId?: StringWithAggregatesFilter<"BookedRoom"> | string
    roomNumber?: StringNullableWithAggregatesFilter<"BookedRoom"> | string | null
    quantity?: IntWithAggregatesFilter<"BookedRoom"> | number
    guestCount?: IntWithAggregatesFilter<"BookedRoom"> | number
    rate?: FloatWithAggregatesFilter<"BookedRoom"> | number
    totalPrice?: FloatWithAggregatesFilter<"BookedRoom"> | number
    guests?: JsonWithAggregatesFilter<"BookedRoom">
  }

  export type InventoryRecordWhereInput = {
    AND?: InventoryRecordWhereInput | InventoryRecordWhereInput[]
    OR?: InventoryRecordWhereInput[]
    NOT?: InventoryRecordWhereInput | InventoryRecordWhereInput[]
    id?: StringFilter<"InventoryRecord"> | string
    propertyId?: StringFilter<"InventoryRecord"> | string
    roomTypeId?: StringFilter<"InventoryRecord"> | string
    date?: DateTimeFilter<"InventoryRecord"> | Date | string
    totalRooms?: IntFilter<"InventoryRecord"> | number
    availableRooms?: IntFilter<"InventoryRecord"> | number
    reservedRooms?: IntFilter<"InventoryRecord"> | number
    blockedRooms?: IntFilter<"InventoryRecord"> | number
    overbookingLimit?: IntFilter<"InventoryRecord"> | number
    minimumStay?: IntNullableFilter<"InventoryRecord"> | number | null
    maximumStay?: IntNullableFilter<"InventoryRecord"> | number | null
    closedToArrival?: BoolFilter<"InventoryRecord"> | boolean
    closedToDeparture?: BoolFilter<"InventoryRecord"> | boolean
    stopSell?: BoolFilter<"InventoryRecord"> | boolean
    createdAt?: DateTimeFilter<"InventoryRecord"> | Date | string
    updatedAt?: DateTimeFilter<"InventoryRecord"> | Date | string
    property?: XOR<PropertyRelationFilter, PropertyWhereInput>
    roomType?: XOR<RoomTypeRelationFilter, RoomTypeWhereInput>
  }

  export type InventoryRecordOrderByWithRelationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    roomTypeId?: SortOrder
    date?: SortOrder
    totalRooms?: SortOrder
    availableRooms?: SortOrder
    reservedRooms?: SortOrder
    blockedRooms?: SortOrder
    overbookingLimit?: SortOrder
    minimumStay?: SortOrderInput | SortOrder
    maximumStay?: SortOrderInput | SortOrder
    closedToArrival?: SortOrder
    closedToDeparture?: SortOrder
    stopSell?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    property?: PropertyOrderByWithRelationInput
    roomType?: RoomTypeOrderByWithRelationInput
  }

  export type InventoryRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    propertyId_roomTypeId_date?: InventoryRecordPropertyIdRoomTypeIdDateCompoundUniqueInput
    AND?: InventoryRecordWhereInput | InventoryRecordWhereInput[]
    OR?: InventoryRecordWhereInput[]
    NOT?: InventoryRecordWhereInput | InventoryRecordWhereInput[]
    propertyId?: StringFilter<"InventoryRecord"> | string
    roomTypeId?: StringFilter<"InventoryRecord"> | string
    date?: DateTimeFilter<"InventoryRecord"> | Date | string
    totalRooms?: IntFilter<"InventoryRecord"> | number
    availableRooms?: IntFilter<"InventoryRecord"> | number
    reservedRooms?: IntFilter<"InventoryRecord"> | number
    blockedRooms?: IntFilter<"InventoryRecord"> | number
    overbookingLimit?: IntFilter<"InventoryRecord"> | number
    minimumStay?: IntNullableFilter<"InventoryRecord"> | number | null
    maximumStay?: IntNullableFilter<"InventoryRecord"> | number | null
    closedToArrival?: BoolFilter<"InventoryRecord"> | boolean
    closedToDeparture?: BoolFilter<"InventoryRecord"> | boolean
    stopSell?: BoolFilter<"InventoryRecord"> | boolean
    createdAt?: DateTimeFilter<"InventoryRecord"> | Date | string
    updatedAt?: DateTimeFilter<"InventoryRecord"> | Date | string
    property?: XOR<PropertyRelationFilter, PropertyWhereInput>
    roomType?: XOR<RoomTypeRelationFilter, RoomTypeWhereInput>
  }, "id" | "propertyId_roomTypeId_date">

  export type InventoryRecordOrderByWithAggregationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    roomTypeId?: SortOrder
    date?: SortOrder
    totalRooms?: SortOrder
    availableRooms?: SortOrder
    reservedRooms?: SortOrder
    blockedRooms?: SortOrder
    overbookingLimit?: SortOrder
    minimumStay?: SortOrderInput | SortOrder
    maximumStay?: SortOrderInput | SortOrder
    closedToArrival?: SortOrder
    closedToDeparture?: SortOrder
    stopSell?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InventoryRecordCountOrderByAggregateInput
    _avg?: InventoryRecordAvgOrderByAggregateInput
    _max?: InventoryRecordMaxOrderByAggregateInput
    _min?: InventoryRecordMinOrderByAggregateInput
    _sum?: InventoryRecordSumOrderByAggregateInput
  }

  export type InventoryRecordScalarWhereWithAggregatesInput = {
    AND?: InventoryRecordScalarWhereWithAggregatesInput | InventoryRecordScalarWhereWithAggregatesInput[]
    OR?: InventoryRecordScalarWhereWithAggregatesInput[]
    NOT?: InventoryRecordScalarWhereWithAggregatesInput | InventoryRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InventoryRecord"> | string
    propertyId?: StringWithAggregatesFilter<"InventoryRecord"> | string
    roomTypeId?: StringWithAggregatesFilter<"InventoryRecord"> | string
    date?: DateTimeWithAggregatesFilter<"InventoryRecord"> | Date | string
    totalRooms?: IntWithAggregatesFilter<"InventoryRecord"> | number
    availableRooms?: IntWithAggregatesFilter<"InventoryRecord"> | number
    reservedRooms?: IntWithAggregatesFilter<"InventoryRecord"> | number
    blockedRooms?: IntWithAggregatesFilter<"InventoryRecord"> | number
    overbookingLimit?: IntWithAggregatesFilter<"InventoryRecord"> | number
    minimumStay?: IntNullableWithAggregatesFilter<"InventoryRecord"> | number | null
    maximumStay?: IntNullableWithAggregatesFilter<"InventoryRecord"> | number | null
    closedToArrival?: BoolWithAggregatesFilter<"InventoryRecord"> | boolean
    closedToDeparture?: BoolWithAggregatesFilter<"InventoryRecord"> | boolean
    stopSell?: BoolWithAggregatesFilter<"InventoryRecord"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"InventoryRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"InventoryRecord"> | Date | string
  }

  export type InventoryReservationWhereInput = {
    AND?: InventoryReservationWhereInput | InventoryReservationWhereInput[]
    OR?: InventoryReservationWhereInput[]
    NOT?: InventoryReservationWhereInput | InventoryReservationWhereInput[]
    id?: StringFilter<"InventoryReservation"> | string
    propertyId?: StringFilter<"InventoryReservation"> | string
    roomTypeId?: StringFilter<"InventoryReservation"> | string
    checkInDate?: DateTimeFilter<"InventoryReservation"> | Date | string
    checkOutDate?: DateTimeFilter<"InventoryReservation"> | Date | string
    roomQuantity?: IntFilter<"InventoryReservation"> | number
    status?: StringFilter<"InventoryReservation"> | string
    expiresAt?: DateTimeFilter<"InventoryReservation"> | Date | string
    bookingId?: StringNullableFilter<"InventoryReservation"> | string | null
    createdAt?: DateTimeFilter<"InventoryReservation"> | Date | string
  }

  export type InventoryReservationOrderByWithRelationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    roomTypeId?: SortOrder
    checkInDate?: SortOrder
    checkOutDate?: SortOrder
    roomQuantity?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    bookingId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type InventoryReservationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InventoryReservationWhereInput | InventoryReservationWhereInput[]
    OR?: InventoryReservationWhereInput[]
    NOT?: InventoryReservationWhereInput | InventoryReservationWhereInput[]
    propertyId?: StringFilter<"InventoryReservation"> | string
    roomTypeId?: StringFilter<"InventoryReservation"> | string
    checkInDate?: DateTimeFilter<"InventoryReservation"> | Date | string
    checkOutDate?: DateTimeFilter<"InventoryReservation"> | Date | string
    roomQuantity?: IntFilter<"InventoryReservation"> | number
    status?: StringFilter<"InventoryReservation"> | string
    expiresAt?: DateTimeFilter<"InventoryReservation"> | Date | string
    bookingId?: StringNullableFilter<"InventoryReservation"> | string | null
    createdAt?: DateTimeFilter<"InventoryReservation"> | Date | string
  }, "id">

  export type InventoryReservationOrderByWithAggregationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    roomTypeId?: SortOrder
    checkInDate?: SortOrder
    checkOutDate?: SortOrder
    roomQuantity?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    bookingId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: InventoryReservationCountOrderByAggregateInput
    _avg?: InventoryReservationAvgOrderByAggregateInput
    _max?: InventoryReservationMaxOrderByAggregateInput
    _min?: InventoryReservationMinOrderByAggregateInput
    _sum?: InventoryReservationSumOrderByAggregateInput
  }

  export type InventoryReservationScalarWhereWithAggregatesInput = {
    AND?: InventoryReservationScalarWhereWithAggregatesInput | InventoryReservationScalarWhereWithAggregatesInput[]
    OR?: InventoryReservationScalarWhereWithAggregatesInput[]
    NOT?: InventoryReservationScalarWhereWithAggregatesInput | InventoryReservationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InventoryReservation"> | string
    propertyId?: StringWithAggregatesFilter<"InventoryReservation"> | string
    roomTypeId?: StringWithAggregatesFilter<"InventoryReservation"> | string
    checkInDate?: DateTimeWithAggregatesFilter<"InventoryReservation"> | Date | string
    checkOutDate?: DateTimeWithAggregatesFilter<"InventoryReservation"> | Date | string
    roomQuantity?: IntWithAggregatesFilter<"InventoryReservation"> | number
    status?: StringWithAggregatesFilter<"InventoryReservation"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"InventoryReservation"> | Date | string
    bookingId?: StringNullableWithAggregatesFilter<"InventoryReservation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"InventoryReservation"> | Date | string
  }

  export type InventoryLockWhereInput = {
    AND?: InventoryLockWhereInput | InventoryLockWhereInput[]
    OR?: InventoryLockWhereInput[]
    NOT?: InventoryLockWhereInput | InventoryLockWhereInput[]
    id?: StringFilter<"InventoryLock"> | string
    propertyId?: StringFilter<"InventoryLock"> | string
    roomTypeId?: StringFilter<"InventoryLock"> | string
    checkInDate?: DateTimeFilter<"InventoryLock"> | Date | string
    checkOutDate?: DateTimeFilter<"InventoryLock"> | Date | string
    quantity?: IntFilter<"InventoryLock"> | number
    lockedBy?: StringFilter<"InventoryLock"> | string
    expiresAt?: DateTimeFilter<"InventoryLock"> | Date | string
    createdAt?: DateTimeFilter<"InventoryLock"> | Date | string
  }

  export type InventoryLockOrderByWithRelationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    roomTypeId?: SortOrder
    checkInDate?: SortOrder
    checkOutDate?: SortOrder
    quantity?: SortOrder
    lockedBy?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type InventoryLockWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InventoryLockWhereInput | InventoryLockWhereInput[]
    OR?: InventoryLockWhereInput[]
    NOT?: InventoryLockWhereInput | InventoryLockWhereInput[]
    propertyId?: StringFilter<"InventoryLock"> | string
    roomTypeId?: StringFilter<"InventoryLock"> | string
    checkInDate?: DateTimeFilter<"InventoryLock"> | Date | string
    checkOutDate?: DateTimeFilter<"InventoryLock"> | Date | string
    quantity?: IntFilter<"InventoryLock"> | number
    lockedBy?: StringFilter<"InventoryLock"> | string
    expiresAt?: DateTimeFilter<"InventoryLock"> | Date | string
    createdAt?: DateTimeFilter<"InventoryLock"> | Date | string
  }, "id">

  export type InventoryLockOrderByWithAggregationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    roomTypeId?: SortOrder
    checkInDate?: SortOrder
    checkOutDate?: SortOrder
    quantity?: SortOrder
    lockedBy?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    _count?: InventoryLockCountOrderByAggregateInput
    _avg?: InventoryLockAvgOrderByAggregateInput
    _max?: InventoryLockMaxOrderByAggregateInput
    _min?: InventoryLockMinOrderByAggregateInput
    _sum?: InventoryLockSumOrderByAggregateInput
  }

  export type InventoryLockScalarWhereWithAggregatesInput = {
    AND?: InventoryLockScalarWhereWithAggregatesInput | InventoryLockScalarWhereWithAggregatesInput[]
    OR?: InventoryLockScalarWhereWithAggregatesInput[]
    NOT?: InventoryLockScalarWhereWithAggregatesInput | InventoryLockScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InventoryLock"> | string
    propertyId?: StringWithAggregatesFilter<"InventoryLock"> | string
    roomTypeId?: StringWithAggregatesFilter<"InventoryLock"> | string
    checkInDate?: DateTimeWithAggregatesFilter<"InventoryLock"> | Date | string
    checkOutDate?: DateTimeWithAggregatesFilter<"InventoryLock"> | Date | string
    quantity?: IntWithAggregatesFilter<"InventoryLock"> | number
    lockedBy?: StringWithAggregatesFilter<"InventoryLock"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"InventoryLock"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"InventoryLock"> | Date | string
  }

  export type RateRecordWhereInput = {
    AND?: RateRecordWhereInput | RateRecordWhereInput[]
    OR?: RateRecordWhereInput[]
    NOT?: RateRecordWhereInput | RateRecordWhereInput[]
    id?: StringFilter<"RateRecord"> | string
    propertyId?: StringFilter<"RateRecord"> | string
    roomTypeId?: StringFilter<"RateRecord"> | string
    date?: DateTimeFilter<"RateRecord"> | Date | string
    rate?: FloatFilter<"RateRecord"> | number
    currency?: StringFilter<"RateRecord"> | string
    rateType?: StringFilter<"RateRecord"> | string
    minimumStay?: IntNullableFilter<"RateRecord"> | number | null
    maximumStay?: IntNullableFilter<"RateRecord"> | number | null
    advanceBookingDays?: IntNullableFilter<"RateRecord"> | number | null
    restrictions?: JsonNullableFilter<"RateRecord">
    createdAt?: DateTimeFilter<"RateRecord"> | Date | string
    updatedAt?: DateTimeFilter<"RateRecord"> | Date | string
    property?: XOR<PropertyRelationFilter, PropertyWhereInput>
    roomType?: XOR<RoomTypeRelationFilter, RoomTypeWhereInput>
  }

  export type RateRecordOrderByWithRelationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    roomTypeId?: SortOrder
    date?: SortOrder
    rate?: SortOrder
    currency?: SortOrder
    rateType?: SortOrder
    minimumStay?: SortOrderInput | SortOrder
    maximumStay?: SortOrderInput | SortOrder
    advanceBookingDays?: SortOrderInput | SortOrder
    restrictions?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    property?: PropertyOrderByWithRelationInput
    roomType?: RoomTypeOrderByWithRelationInput
  }

  export type RateRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    propertyId_roomTypeId_date_rateType?: RateRecordPropertyIdRoomTypeIdDateRateTypeCompoundUniqueInput
    AND?: RateRecordWhereInput | RateRecordWhereInput[]
    OR?: RateRecordWhereInput[]
    NOT?: RateRecordWhereInput | RateRecordWhereInput[]
    propertyId?: StringFilter<"RateRecord"> | string
    roomTypeId?: StringFilter<"RateRecord"> | string
    date?: DateTimeFilter<"RateRecord"> | Date | string
    rate?: FloatFilter<"RateRecord"> | number
    currency?: StringFilter<"RateRecord"> | string
    rateType?: StringFilter<"RateRecord"> | string
    minimumStay?: IntNullableFilter<"RateRecord"> | number | null
    maximumStay?: IntNullableFilter<"RateRecord"> | number | null
    advanceBookingDays?: IntNullableFilter<"RateRecord"> | number | null
    restrictions?: JsonNullableFilter<"RateRecord">
    createdAt?: DateTimeFilter<"RateRecord"> | Date | string
    updatedAt?: DateTimeFilter<"RateRecord"> | Date | string
    property?: XOR<PropertyRelationFilter, PropertyWhereInput>
    roomType?: XOR<RoomTypeRelationFilter, RoomTypeWhereInput>
  }, "id" | "propertyId_roomTypeId_date_rateType">

  export type RateRecordOrderByWithAggregationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    roomTypeId?: SortOrder
    date?: SortOrder
    rate?: SortOrder
    currency?: SortOrder
    rateType?: SortOrder
    minimumStay?: SortOrderInput | SortOrder
    maximumStay?: SortOrderInput | SortOrder
    advanceBookingDays?: SortOrderInput | SortOrder
    restrictions?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RateRecordCountOrderByAggregateInput
    _avg?: RateRecordAvgOrderByAggregateInput
    _max?: RateRecordMaxOrderByAggregateInput
    _min?: RateRecordMinOrderByAggregateInput
    _sum?: RateRecordSumOrderByAggregateInput
  }

  export type RateRecordScalarWhereWithAggregatesInput = {
    AND?: RateRecordScalarWhereWithAggregatesInput | RateRecordScalarWhereWithAggregatesInput[]
    OR?: RateRecordScalarWhereWithAggregatesInput[]
    NOT?: RateRecordScalarWhereWithAggregatesInput | RateRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RateRecord"> | string
    propertyId?: StringWithAggregatesFilter<"RateRecord"> | string
    roomTypeId?: StringWithAggregatesFilter<"RateRecord"> | string
    date?: DateTimeWithAggregatesFilter<"RateRecord"> | Date | string
    rate?: FloatWithAggregatesFilter<"RateRecord"> | number
    currency?: StringWithAggregatesFilter<"RateRecord"> | string
    rateType?: StringWithAggregatesFilter<"RateRecord"> | string
    minimumStay?: IntNullableWithAggregatesFilter<"RateRecord"> | number | null
    maximumStay?: IntNullableWithAggregatesFilter<"RateRecord"> | number | null
    advanceBookingDays?: IntNullableWithAggregatesFilter<"RateRecord"> | number | null
    restrictions?: JsonNullableWithAggregatesFilter<"RateRecord">
    createdAt?: DateTimeWithAggregatesFilter<"RateRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RateRecord"> | Date | string
  }

  export type DynamicPricingRuleWhereInput = {
    AND?: DynamicPricingRuleWhereInput | DynamicPricingRuleWhereInput[]
    OR?: DynamicPricingRuleWhereInput[]
    NOT?: DynamicPricingRuleWhereInput | DynamicPricingRuleWhereInput[]
    id?: StringFilter<"DynamicPricingRule"> | string
    propertyId?: StringFilter<"DynamicPricingRule"> | string
    name?: StringFilter<"DynamicPricingRule"> | string
    description?: StringFilter<"DynamicPricingRule"> | string
    type?: StringFilter<"DynamicPricingRule"> | string
    isActive?: BoolFilter<"DynamicPricingRule"> | boolean
    priority?: IntFilter<"DynamicPricingRule"> | number
    conditions?: JsonFilter<"DynamicPricingRule">
    adjustments?: JsonFilter<"DynamicPricingRule">
    validFrom?: DateTimeFilter<"DynamicPricingRule"> | Date | string
    validTo?: DateTimeFilter<"DynamicPricingRule"> | Date | string
    applicableRoomTypes?: JsonNullableFilter<"DynamicPricingRule">
    createdAt?: DateTimeFilter<"DynamicPricingRule"> | Date | string
    updatedAt?: DateTimeFilter<"DynamicPricingRule"> | Date | string
  }

  export type DynamicPricingRuleOrderByWithRelationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    conditions?: SortOrder
    adjustments?: SortOrder
    validFrom?: SortOrder
    validTo?: SortOrder
    applicableRoomTypes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DynamicPricingRuleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DynamicPricingRuleWhereInput | DynamicPricingRuleWhereInput[]
    OR?: DynamicPricingRuleWhereInput[]
    NOT?: DynamicPricingRuleWhereInput | DynamicPricingRuleWhereInput[]
    propertyId?: StringFilter<"DynamicPricingRule"> | string
    name?: StringFilter<"DynamicPricingRule"> | string
    description?: StringFilter<"DynamicPricingRule"> | string
    type?: StringFilter<"DynamicPricingRule"> | string
    isActive?: BoolFilter<"DynamicPricingRule"> | boolean
    priority?: IntFilter<"DynamicPricingRule"> | number
    conditions?: JsonFilter<"DynamicPricingRule">
    adjustments?: JsonFilter<"DynamicPricingRule">
    validFrom?: DateTimeFilter<"DynamicPricingRule"> | Date | string
    validTo?: DateTimeFilter<"DynamicPricingRule"> | Date | string
    applicableRoomTypes?: JsonNullableFilter<"DynamicPricingRule">
    createdAt?: DateTimeFilter<"DynamicPricingRule"> | Date | string
    updatedAt?: DateTimeFilter<"DynamicPricingRule"> | Date | string
  }, "id">

  export type DynamicPricingRuleOrderByWithAggregationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    conditions?: SortOrder
    adjustments?: SortOrder
    validFrom?: SortOrder
    validTo?: SortOrder
    applicableRoomTypes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DynamicPricingRuleCountOrderByAggregateInput
    _avg?: DynamicPricingRuleAvgOrderByAggregateInput
    _max?: DynamicPricingRuleMaxOrderByAggregateInput
    _min?: DynamicPricingRuleMinOrderByAggregateInput
    _sum?: DynamicPricingRuleSumOrderByAggregateInput
  }

  export type DynamicPricingRuleScalarWhereWithAggregatesInput = {
    AND?: DynamicPricingRuleScalarWhereWithAggregatesInput | DynamicPricingRuleScalarWhereWithAggregatesInput[]
    OR?: DynamicPricingRuleScalarWhereWithAggregatesInput[]
    NOT?: DynamicPricingRuleScalarWhereWithAggregatesInput | DynamicPricingRuleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DynamicPricingRule"> | string
    propertyId?: StringWithAggregatesFilter<"DynamicPricingRule"> | string
    name?: StringWithAggregatesFilter<"DynamicPricingRule"> | string
    description?: StringWithAggregatesFilter<"DynamicPricingRule"> | string
    type?: StringWithAggregatesFilter<"DynamicPricingRule"> | string
    isActive?: BoolWithAggregatesFilter<"DynamicPricingRule"> | boolean
    priority?: IntWithAggregatesFilter<"DynamicPricingRule"> | number
    conditions?: JsonWithAggregatesFilter<"DynamicPricingRule">
    adjustments?: JsonWithAggregatesFilter<"DynamicPricingRule">
    validFrom?: DateTimeWithAggregatesFilter<"DynamicPricingRule"> | Date | string
    validTo?: DateTimeWithAggregatesFilter<"DynamicPricingRule"> | Date | string
    applicableRoomTypes?: JsonNullableWithAggregatesFilter<"DynamicPricingRule">
    createdAt?: DateTimeWithAggregatesFilter<"DynamicPricingRule"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DynamicPricingRule"> | Date | string
  }

  export type SeasonalRateWhereInput = {
    AND?: SeasonalRateWhereInput | SeasonalRateWhereInput[]
    OR?: SeasonalRateWhereInput[]
    NOT?: SeasonalRateWhereInput | SeasonalRateWhereInput[]
    id?: StringFilter<"SeasonalRate"> | string
    propertyId?: StringFilter<"SeasonalRate"> | string
    name?: StringFilter<"SeasonalRate"> | string
    description?: StringFilter<"SeasonalRate"> | string
    startDate?: DateTimeFilter<"SeasonalRate"> | Date | string
    endDate?: DateTimeFilter<"SeasonalRate"> | Date | string
    roomTypeRates?: JsonFilter<"SeasonalRate">
    isActive?: BoolFilter<"SeasonalRate"> | boolean
    priority?: IntFilter<"SeasonalRate"> | number
    createdAt?: DateTimeFilter<"SeasonalRate"> | Date | string
    updatedAt?: DateTimeFilter<"SeasonalRate"> | Date | string
  }

  export type SeasonalRateOrderByWithRelationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    roomTypeRates?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SeasonalRateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SeasonalRateWhereInput | SeasonalRateWhereInput[]
    OR?: SeasonalRateWhereInput[]
    NOT?: SeasonalRateWhereInput | SeasonalRateWhereInput[]
    propertyId?: StringFilter<"SeasonalRate"> | string
    name?: StringFilter<"SeasonalRate"> | string
    description?: StringFilter<"SeasonalRate"> | string
    startDate?: DateTimeFilter<"SeasonalRate"> | Date | string
    endDate?: DateTimeFilter<"SeasonalRate"> | Date | string
    roomTypeRates?: JsonFilter<"SeasonalRate">
    isActive?: BoolFilter<"SeasonalRate"> | boolean
    priority?: IntFilter<"SeasonalRate"> | number
    createdAt?: DateTimeFilter<"SeasonalRate"> | Date | string
    updatedAt?: DateTimeFilter<"SeasonalRate"> | Date | string
  }, "id">

  export type SeasonalRateOrderByWithAggregationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    roomTypeRates?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SeasonalRateCountOrderByAggregateInput
    _avg?: SeasonalRateAvgOrderByAggregateInput
    _max?: SeasonalRateMaxOrderByAggregateInput
    _min?: SeasonalRateMinOrderByAggregateInput
    _sum?: SeasonalRateSumOrderByAggregateInput
  }

  export type SeasonalRateScalarWhereWithAggregatesInput = {
    AND?: SeasonalRateScalarWhereWithAggregatesInput | SeasonalRateScalarWhereWithAggregatesInput[]
    OR?: SeasonalRateScalarWhereWithAggregatesInput[]
    NOT?: SeasonalRateScalarWhereWithAggregatesInput | SeasonalRateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SeasonalRate"> | string
    propertyId?: StringWithAggregatesFilter<"SeasonalRate"> | string
    name?: StringWithAggregatesFilter<"SeasonalRate"> | string
    description?: StringWithAggregatesFilter<"SeasonalRate"> | string
    startDate?: DateTimeWithAggregatesFilter<"SeasonalRate"> | Date | string
    endDate?: DateTimeWithAggregatesFilter<"SeasonalRate"> | Date | string
    roomTypeRates?: JsonWithAggregatesFilter<"SeasonalRate">
    isActive?: BoolWithAggregatesFilter<"SeasonalRate"> | boolean
    priority?: IntWithAggregatesFilter<"SeasonalRate"> | number
    createdAt?: DateTimeWithAggregatesFilter<"SeasonalRate"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SeasonalRate"> | Date | string
  }

  export type PromotionWhereInput = {
    AND?: PromotionWhereInput | PromotionWhereInput[]
    OR?: PromotionWhereInput[]
    NOT?: PromotionWhereInput | PromotionWhereInput[]
    id?: StringFilter<"Promotion"> | string
    propertyId?: StringFilter<"Promotion"> | string
    code?: StringNullableFilter<"Promotion"> | string | null
    name?: StringFilter<"Promotion"> | string
    description?: StringFilter<"Promotion"> | string
    type?: StringFilter<"Promotion"> | string
    discountType?: StringFilter<"Promotion"> | string
    discountValue?: FloatFilter<"Promotion"> | number
    maxDiscount?: FloatNullableFilter<"Promotion"> | number | null
    validFrom?: DateTimeFilter<"Promotion"> | Date | string
    validTo?: DateTimeFilter<"Promotion"> | Date | string
    conditions?: JsonFilter<"Promotion">
    usage?: JsonFilter<"Promotion">
    isActive?: BoolFilter<"Promotion"> | boolean
    createdAt?: DateTimeFilter<"Promotion"> | Date | string
    updatedAt?: DateTimeFilter<"Promotion"> | Date | string
    property?: XOR<PropertyRelationFilter, PropertyWhereInput>
  }

  export type PromotionOrderByWithRelationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    code?: SortOrderInput | SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    maxDiscount?: SortOrderInput | SortOrder
    validFrom?: SortOrder
    validTo?: SortOrder
    conditions?: SortOrder
    usage?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    property?: PropertyOrderByWithRelationInput
  }

  export type PromotionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: PromotionWhereInput | PromotionWhereInput[]
    OR?: PromotionWhereInput[]
    NOT?: PromotionWhereInput | PromotionWhereInput[]
    propertyId?: StringFilter<"Promotion"> | string
    name?: StringFilter<"Promotion"> | string
    description?: StringFilter<"Promotion"> | string
    type?: StringFilter<"Promotion"> | string
    discountType?: StringFilter<"Promotion"> | string
    discountValue?: FloatFilter<"Promotion"> | number
    maxDiscount?: FloatNullableFilter<"Promotion"> | number | null
    validFrom?: DateTimeFilter<"Promotion"> | Date | string
    validTo?: DateTimeFilter<"Promotion"> | Date | string
    conditions?: JsonFilter<"Promotion">
    usage?: JsonFilter<"Promotion">
    isActive?: BoolFilter<"Promotion"> | boolean
    createdAt?: DateTimeFilter<"Promotion"> | Date | string
    updatedAt?: DateTimeFilter<"Promotion"> | Date | string
    property?: XOR<PropertyRelationFilter, PropertyWhereInput>
  }, "id" | "code">

  export type PromotionOrderByWithAggregationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    code?: SortOrderInput | SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    maxDiscount?: SortOrderInput | SortOrder
    validFrom?: SortOrder
    validTo?: SortOrder
    conditions?: SortOrder
    usage?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PromotionCountOrderByAggregateInput
    _avg?: PromotionAvgOrderByAggregateInput
    _max?: PromotionMaxOrderByAggregateInput
    _min?: PromotionMinOrderByAggregateInput
    _sum?: PromotionSumOrderByAggregateInput
  }

  export type PromotionScalarWhereWithAggregatesInput = {
    AND?: PromotionScalarWhereWithAggregatesInput | PromotionScalarWhereWithAggregatesInput[]
    OR?: PromotionScalarWhereWithAggregatesInput[]
    NOT?: PromotionScalarWhereWithAggregatesInput | PromotionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Promotion"> | string
    propertyId?: StringWithAggregatesFilter<"Promotion"> | string
    code?: StringNullableWithAggregatesFilter<"Promotion"> | string | null
    name?: StringWithAggregatesFilter<"Promotion"> | string
    description?: StringWithAggregatesFilter<"Promotion"> | string
    type?: StringWithAggregatesFilter<"Promotion"> | string
    discountType?: StringWithAggregatesFilter<"Promotion"> | string
    discountValue?: FloatWithAggregatesFilter<"Promotion"> | number
    maxDiscount?: FloatNullableWithAggregatesFilter<"Promotion"> | number | null
    validFrom?: DateTimeWithAggregatesFilter<"Promotion"> | Date | string
    validTo?: DateTimeWithAggregatesFilter<"Promotion"> | Date | string
    conditions?: JsonWithAggregatesFilter<"Promotion">
    usage?: JsonWithAggregatesFilter<"Promotion">
    isActive?: BoolWithAggregatesFilter<"Promotion"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Promotion"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Promotion"> | Date | string
  }

  export type GroupDiscountWhereInput = {
    AND?: GroupDiscountWhereInput | GroupDiscountWhereInput[]
    OR?: GroupDiscountWhereInput[]
    NOT?: GroupDiscountWhereInput | GroupDiscountWhereInput[]
    id?: StringFilter<"GroupDiscount"> | string
    propertyId?: StringFilter<"GroupDiscount"> | string
    name?: StringFilter<"GroupDiscount"> | string
    description?: StringFilter<"GroupDiscount"> | string
    minimumRooms?: IntFilter<"GroupDiscount"> | number
    discountType?: StringFilter<"GroupDiscount"> | string
    discountValue?: FloatFilter<"GroupDiscount"> | number
    validFrom?: DateTimeFilter<"GroupDiscount"> | Date | string
    validTo?: DateTimeFilter<"GroupDiscount"> | Date | string
    applicableRoomTypes?: JsonNullableFilter<"GroupDiscount">
    isActive?: BoolFilter<"GroupDiscount"> | boolean
    createdAt?: DateTimeFilter<"GroupDiscount"> | Date | string
    updatedAt?: DateTimeFilter<"GroupDiscount"> | Date | string
  }

  export type GroupDiscountOrderByWithRelationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    minimumRooms?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    validFrom?: SortOrder
    validTo?: SortOrder
    applicableRoomTypes?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GroupDiscountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GroupDiscountWhereInput | GroupDiscountWhereInput[]
    OR?: GroupDiscountWhereInput[]
    NOT?: GroupDiscountWhereInput | GroupDiscountWhereInput[]
    propertyId?: StringFilter<"GroupDiscount"> | string
    name?: StringFilter<"GroupDiscount"> | string
    description?: StringFilter<"GroupDiscount"> | string
    minimumRooms?: IntFilter<"GroupDiscount"> | number
    discountType?: StringFilter<"GroupDiscount"> | string
    discountValue?: FloatFilter<"GroupDiscount"> | number
    validFrom?: DateTimeFilter<"GroupDiscount"> | Date | string
    validTo?: DateTimeFilter<"GroupDiscount"> | Date | string
    applicableRoomTypes?: JsonNullableFilter<"GroupDiscount">
    isActive?: BoolFilter<"GroupDiscount"> | boolean
    createdAt?: DateTimeFilter<"GroupDiscount"> | Date | string
    updatedAt?: DateTimeFilter<"GroupDiscount"> | Date | string
  }, "id">

  export type GroupDiscountOrderByWithAggregationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    minimumRooms?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    validFrom?: SortOrder
    validTo?: SortOrder
    applicableRoomTypes?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GroupDiscountCountOrderByAggregateInput
    _avg?: GroupDiscountAvgOrderByAggregateInput
    _max?: GroupDiscountMaxOrderByAggregateInput
    _min?: GroupDiscountMinOrderByAggregateInput
    _sum?: GroupDiscountSumOrderByAggregateInput
  }

  export type GroupDiscountScalarWhereWithAggregatesInput = {
    AND?: GroupDiscountScalarWhereWithAggregatesInput | GroupDiscountScalarWhereWithAggregatesInput[]
    OR?: GroupDiscountScalarWhereWithAggregatesInput[]
    NOT?: GroupDiscountScalarWhereWithAggregatesInput | GroupDiscountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GroupDiscount"> | string
    propertyId?: StringWithAggregatesFilter<"GroupDiscount"> | string
    name?: StringWithAggregatesFilter<"GroupDiscount"> | string
    description?: StringWithAggregatesFilter<"GroupDiscount"> | string
    minimumRooms?: IntWithAggregatesFilter<"GroupDiscount"> | number
    discountType?: StringWithAggregatesFilter<"GroupDiscount"> | string
    discountValue?: FloatWithAggregatesFilter<"GroupDiscount"> | number
    validFrom?: DateTimeWithAggregatesFilter<"GroupDiscount"> | Date | string
    validTo?: DateTimeWithAggregatesFilter<"GroupDiscount"> | Date | string
    applicableRoomTypes?: JsonNullableWithAggregatesFilter<"GroupDiscount">
    isActive?: BoolWithAggregatesFilter<"GroupDiscount"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"GroupDiscount"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"GroupDiscount"> | Date | string
  }

  export type TaxConfigurationWhereInput = {
    AND?: TaxConfigurationWhereInput | TaxConfigurationWhereInput[]
    OR?: TaxConfigurationWhereInput[]
    NOT?: TaxConfigurationWhereInput | TaxConfigurationWhereInput[]
    id?: StringFilter<"TaxConfiguration"> | string
    propertyId?: StringFilter<"TaxConfiguration"> | string
    name?: StringFilter<"TaxConfiguration"> | string
    type?: StringFilter<"TaxConfiguration"> | string
    rate?: FloatFilter<"TaxConfiguration"> | number
    isPercentage?: BoolFilter<"TaxConfiguration"> | boolean
    isInclusive?: BoolFilter<"TaxConfiguration"> | boolean
    applicableRoomTypes?: JsonNullableFilter<"TaxConfiguration">
    validFrom?: DateTimeFilter<"TaxConfiguration"> | Date | string
    validTo?: DateTimeNullableFilter<"TaxConfiguration"> | Date | string | null
    isActive?: BoolFilter<"TaxConfiguration"> | boolean
    createdAt?: DateTimeFilter<"TaxConfiguration"> | Date | string
    updatedAt?: DateTimeFilter<"TaxConfiguration"> | Date | string
  }

  export type TaxConfigurationOrderByWithRelationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    rate?: SortOrder
    isPercentage?: SortOrder
    isInclusive?: SortOrder
    applicableRoomTypes?: SortOrderInput | SortOrder
    validFrom?: SortOrder
    validTo?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaxConfigurationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaxConfigurationWhereInput | TaxConfigurationWhereInput[]
    OR?: TaxConfigurationWhereInput[]
    NOT?: TaxConfigurationWhereInput | TaxConfigurationWhereInput[]
    propertyId?: StringFilter<"TaxConfiguration"> | string
    name?: StringFilter<"TaxConfiguration"> | string
    type?: StringFilter<"TaxConfiguration"> | string
    rate?: FloatFilter<"TaxConfiguration"> | number
    isPercentage?: BoolFilter<"TaxConfiguration"> | boolean
    isInclusive?: BoolFilter<"TaxConfiguration"> | boolean
    applicableRoomTypes?: JsonNullableFilter<"TaxConfiguration">
    validFrom?: DateTimeFilter<"TaxConfiguration"> | Date | string
    validTo?: DateTimeNullableFilter<"TaxConfiguration"> | Date | string | null
    isActive?: BoolFilter<"TaxConfiguration"> | boolean
    createdAt?: DateTimeFilter<"TaxConfiguration"> | Date | string
    updatedAt?: DateTimeFilter<"TaxConfiguration"> | Date | string
  }, "id">

  export type TaxConfigurationOrderByWithAggregationInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    rate?: SortOrder
    isPercentage?: SortOrder
    isInclusive?: SortOrder
    applicableRoomTypes?: SortOrderInput | SortOrder
    validFrom?: SortOrder
    validTo?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TaxConfigurationCountOrderByAggregateInput
    _avg?: TaxConfigurationAvgOrderByAggregateInput
    _max?: TaxConfigurationMaxOrderByAggregateInput
    _min?: TaxConfigurationMinOrderByAggregateInput
    _sum?: TaxConfigurationSumOrderByAggregateInput
  }

  export type TaxConfigurationScalarWhereWithAggregatesInput = {
    AND?: TaxConfigurationScalarWhereWithAggregatesInput | TaxConfigurationScalarWhereWithAggregatesInput[]
    OR?: TaxConfigurationScalarWhereWithAggregatesInput[]
    NOT?: TaxConfigurationScalarWhereWithAggregatesInput | TaxConfigurationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TaxConfiguration"> | string
    propertyId?: StringWithAggregatesFilter<"TaxConfiguration"> | string
    name?: StringWithAggregatesFilter<"TaxConfiguration"> | string
    type?: StringWithAggregatesFilter<"TaxConfiguration"> | string
    rate?: FloatWithAggregatesFilter<"TaxConfiguration"> | number
    isPercentage?: BoolWithAggregatesFilter<"TaxConfiguration"> | boolean
    isInclusive?: BoolWithAggregatesFilter<"TaxConfiguration"> | boolean
    applicableRoomTypes?: JsonNullableWithAggregatesFilter<"TaxConfiguration">
    validFrom?: DateTimeWithAggregatesFilter<"TaxConfiguration"> | Date | string
    validTo?: DateTimeNullableWithAggregatesFilter<"TaxConfiguration"> | Date | string | null
    isActive?: BoolWithAggregatesFilter<"TaxConfiguration"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"TaxConfiguration"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TaxConfiguration"> | Date | string
  }

  export type GuestProfileWhereInput = {
    AND?: GuestProfileWhereInput | GuestProfileWhereInput[]
    OR?: GuestProfileWhereInput[]
    NOT?: GuestProfileWhereInput | GuestProfileWhereInput[]
    id?: StringFilter<"GuestProfile"> | string
    userId?: StringFilter<"GuestProfile"> | string
    personalInfo?: JsonFilter<"GuestProfile">
    contactInfo?: JsonFilter<"GuestProfile">
    preferences?: JsonFilter<"GuestProfile">
    bookingHistory?: JsonFilter<"GuestProfile">
    loyaltyStatus?: JsonNullableFilter<"GuestProfile">
    loyaltyPoints?: IntNullableFilter<"GuestProfile"> | number | null
    accessibility?: JsonNullableFilter<"GuestProfile">
    dietaryRestrictions?: JsonNullableFilter<"GuestProfile">
    communicationPreferences?: JsonFilter<"GuestProfile">
    vipStatus?: JsonNullableFilter<"GuestProfile">
    createdAt?: DateTimeFilter<"GuestProfile"> | Date | string
    updatedAt?: DateTimeFilter<"GuestProfile"> | Date | string
    lastBookingDate?: DateTimeNullableFilter<"GuestProfile"> | Date | string | null
    lastLoginDate?: DateTimeNullableFilter<"GuestProfile"> | Date | string | null
  }

  export type GuestProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    personalInfo?: SortOrder
    contactInfo?: SortOrder
    preferences?: SortOrder
    bookingHistory?: SortOrder
    loyaltyStatus?: SortOrderInput | SortOrder
    loyaltyPoints?: SortOrderInput | SortOrder
    accessibility?: SortOrderInput | SortOrder
    dietaryRestrictions?: SortOrderInput | SortOrder
    communicationPreferences?: SortOrder
    vipStatus?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastBookingDate?: SortOrderInput | SortOrder
    lastLoginDate?: SortOrderInput | SortOrder
  }

  export type GuestProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: GuestProfileWhereInput | GuestProfileWhereInput[]
    OR?: GuestProfileWhereInput[]
    NOT?: GuestProfileWhereInput | GuestProfileWhereInput[]
    personalInfo?: JsonFilter<"GuestProfile">
    contactInfo?: JsonFilter<"GuestProfile">
    preferences?: JsonFilter<"GuestProfile">
    bookingHistory?: JsonFilter<"GuestProfile">
    loyaltyStatus?: JsonNullableFilter<"GuestProfile">
    loyaltyPoints?: IntNullableFilter<"GuestProfile"> | number | null
    accessibility?: JsonNullableFilter<"GuestProfile">
    dietaryRestrictions?: JsonNullableFilter<"GuestProfile">
    communicationPreferences?: JsonFilter<"GuestProfile">
    vipStatus?: JsonNullableFilter<"GuestProfile">
    createdAt?: DateTimeFilter<"GuestProfile"> | Date | string
    updatedAt?: DateTimeFilter<"GuestProfile"> | Date | string
    lastBookingDate?: DateTimeNullableFilter<"GuestProfile"> | Date | string | null
    lastLoginDate?: DateTimeNullableFilter<"GuestProfile"> | Date | string | null
  }, "id" | "userId">

  export type GuestProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    personalInfo?: SortOrder
    contactInfo?: SortOrder
    preferences?: SortOrder
    bookingHistory?: SortOrder
    loyaltyStatus?: SortOrderInput | SortOrder
    loyaltyPoints?: SortOrderInput | SortOrder
    accessibility?: SortOrderInput | SortOrder
    dietaryRestrictions?: SortOrderInput | SortOrder
    communicationPreferences?: SortOrder
    vipStatus?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastBookingDate?: SortOrderInput | SortOrder
    lastLoginDate?: SortOrderInput | SortOrder
    _count?: GuestProfileCountOrderByAggregateInput
    _avg?: GuestProfileAvgOrderByAggregateInput
    _max?: GuestProfileMaxOrderByAggregateInput
    _min?: GuestProfileMinOrderByAggregateInput
    _sum?: GuestProfileSumOrderByAggregateInput
  }

  export type GuestProfileScalarWhereWithAggregatesInput = {
    AND?: GuestProfileScalarWhereWithAggregatesInput | GuestProfileScalarWhereWithAggregatesInput[]
    OR?: GuestProfileScalarWhereWithAggregatesInput[]
    NOT?: GuestProfileScalarWhereWithAggregatesInput | GuestProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GuestProfile"> | string
    userId?: StringWithAggregatesFilter<"GuestProfile"> | string
    personalInfo?: JsonWithAggregatesFilter<"GuestProfile">
    contactInfo?: JsonWithAggregatesFilter<"GuestProfile">
    preferences?: JsonWithAggregatesFilter<"GuestProfile">
    bookingHistory?: JsonWithAggregatesFilter<"GuestProfile">
    loyaltyStatus?: JsonNullableWithAggregatesFilter<"GuestProfile">
    loyaltyPoints?: IntNullableWithAggregatesFilter<"GuestProfile"> | number | null
    accessibility?: JsonNullableWithAggregatesFilter<"GuestProfile">
    dietaryRestrictions?: JsonNullableWithAggregatesFilter<"GuestProfile">
    communicationPreferences?: JsonWithAggregatesFilter<"GuestProfile">
    vipStatus?: JsonNullableWithAggregatesFilter<"GuestProfile">
    createdAt?: DateTimeWithAggregatesFilter<"GuestProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"GuestProfile"> | Date | string
    lastBookingDate?: DateTimeNullableWithAggregatesFilter<"GuestProfile"> | Date | string | null
    lastLoginDate?: DateTimeNullableWithAggregatesFilter<"GuestProfile"> | Date | string | null
  }

  export type GuestActivityLogWhereInput = {
    AND?: GuestActivityLogWhereInput | GuestActivityLogWhereInput[]
    OR?: GuestActivityLogWhereInput[]
    NOT?: GuestActivityLogWhereInput | GuestActivityLogWhereInput[]
    id?: StringFilter<"GuestActivityLog"> | string
    guestId?: StringFilter<"GuestActivityLog"> | string
    activityType?: StringFilter<"GuestActivityLog"> | string
    description?: StringFilter<"GuestActivityLog"> | string
    metadata?: JsonNullableFilter<"GuestActivityLog">
    timestamp?: DateTimeFilter<"GuestActivityLog"> | Date | string
  }

  export type GuestActivityLogOrderByWithRelationInput = {
    id?: SortOrder
    guestId?: SortOrder
    activityType?: SortOrder
    description?: SortOrder
    metadata?: SortOrderInput | SortOrder
    timestamp?: SortOrder
  }

  export type GuestActivityLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GuestActivityLogWhereInput | GuestActivityLogWhereInput[]
    OR?: GuestActivityLogWhereInput[]
    NOT?: GuestActivityLogWhereInput | GuestActivityLogWhereInput[]
    guestId?: StringFilter<"GuestActivityLog"> | string
    activityType?: StringFilter<"GuestActivityLog"> | string
    description?: StringFilter<"GuestActivityLog"> | string
    metadata?: JsonNullableFilter<"GuestActivityLog">
    timestamp?: DateTimeFilter<"GuestActivityLog"> | Date | string
  }, "id">

  export type GuestActivityLogOrderByWithAggregationInput = {
    id?: SortOrder
    guestId?: SortOrder
    activityType?: SortOrder
    description?: SortOrder
    metadata?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    _count?: GuestActivityLogCountOrderByAggregateInput
    _max?: GuestActivityLogMaxOrderByAggregateInput
    _min?: GuestActivityLogMinOrderByAggregateInput
  }

  export type GuestActivityLogScalarWhereWithAggregatesInput = {
    AND?: GuestActivityLogScalarWhereWithAggregatesInput | GuestActivityLogScalarWhereWithAggregatesInput[]
    OR?: GuestActivityLogScalarWhereWithAggregatesInput[]
    NOT?: GuestActivityLogScalarWhereWithAggregatesInput | GuestActivityLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GuestActivityLog"> | string
    guestId?: StringWithAggregatesFilter<"GuestActivityLog"> | string
    activityType?: StringWithAggregatesFilter<"GuestActivityLog"> | string
    description?: StringWithAggregatesFilter<"GuestActivityLog"> | string
    metadata?: JsonNullableWithAggregatesFilter<"GuestActivityLog">
    timestamp?: DateTimeWithAggregatesFilter<"GuestActivityLog"> | Date | string
  }

  export type PropertyCreateInput = {
    id?: string
    name: string
    description: string
    category: string
    address: JsonNullValueInput | InputJsonValue
    coordinates: JsonNullValueInput | InputJsonValue
    timezone: string
    starRating?: number | null
    amenities: JsonNullValueInput | InputJsonValue
    policies: JsonNullValueInput | InputJsonValue
    contactInfo: JsonNullValueInput | InputJsonValue
    images: JsonNullValueInput | InputJsonValue
    virtualTour?: string | null
    ownerId: string
    chainId?: string | null
    brandId?: string | null
    status?: string
    settings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    roomTypes?: RoomTypeCreateNestedManyWithoutPropertyInput
    bookings?: BookingCreateNestedManyWithoutPropertyInput
    inventory?: InventoryRecordCreateNestedManyWithoutPropertyInput
    rates?: RateRecordCreateNestedManyWithoutPropertyInput
    promotions?: PromotionCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUncheckedCreateInput = {
    id?: string
    name: string
    description: string
    category: string
    address: JsonNullValueInput | InputJsonValue
    coordinates: JsonNullValueInput | InputJsonValue
    timezone: string
    starRating?: number | null
    amenities: JsonNullValueInput | InputJsonValue
    policies: JsonNullValueInput | InputJsonValue
    contactInfo: JsonNullValueInput | InputJsonValue
    images: JsonNullValueInput | InputJsonValue
    virtualTour?: string | null
    ownerId: string
    chainId?: string | null
    brandId?: string | null
    status?: string
    settings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    roomTypes?: RoomTypeUncheckedCreateNestedManyWithoutPropertyInput
    bookings?: BookingUncheckedCreateNestedManyWithoutPropertyInput
    inventory?: InventoryRecordUncheckedCreateNestedManyWithoutPropertyInput
    rates?: RateRecordUncheckedCreateNestedManyWithoutPropertyInput
    promotions?: PromotionUncheckedCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    address?: JsonNullValueInput | InputJsonValue
    coordinates?: JsonNullValueInput | InputJsonValue
    timezone?: StringFieldUpdateOperationsInput | string
    starRating?: NullableIntFieldUpdateOperationsInput | number | null
    amenities?: JsonNullValueInput | InputJsonValue
    policies?: JsonNullValueInput | InputJsonValue
    contactInfo?: JsonNullValueInput | InputJsonValue
    images?: JsonNullValueInput | InputJsonValue
    virtualTour?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    chainId?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roomTypes?: RoomTypeUpdateManyWithoutPropertyNestedInput
    bookings?: BookingUpdateManyWithoutPropertyNestedInput
    inventory?: InventoryRecordUpdateManyWithoutPropertyNestedInput
    rates?: RateRecordUpdateManyWithoutPropertyNestedInput
    promotions?: PromotionUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    address?: JsonNullValueInput | InputJsonValue
    coordinates?: JsonNullValueInput | InputJsonValue
    timezone?: StringFieldUpdateOperationsInput | string
    starRating?: NullableIntFieldUpdateOperationsInput | number | null
    amenities?: JsonNullValueInput | InputJsonValue
    policies?: JsonNullValueInput | InputJsonValue
    contactInfo?: JsonNullValueInput | InputJsonValue
    images?: JsonNullValueInput | InputJsonValue
    virtualTour?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    chainId?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roomTypes?: RoomTypeUncheckedUpdateManyWithoutPropertyNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutPropertyNestedInput
    inventory?: InventoryRecordUncheckedUpdateManyWithoutPropertyNestedInput
    rates?: RateRecordUncheckedUpdateManyWithoutPropertyNestedInput
    promotions?: PromotionUncheckedUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyCreateManyInput = {
    id?: string
    name: string
    description: string
    category: string
    address: JsonNullValueInput | InputJsonValue
    coordinates: JsonNullValueInput | InputJsonValue
    timezone: string
    starRating?: number | null
    amenities: JsonNullValueInput | InputJsonValue
    policies: JsonNullValueInput | InputJsonValue
    contactInfo: JsonNullValueInput | InputJsonValue
    images: JsonNullValueInput | InputJsonValue
    virtualTour?: string | null
    ownerId: string
    chainId?: string | null
    brandId?: string | null
    status?: string
    settings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PropertyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    address?: JsonNullValueInput | InputJsonValue
    coordinates?: JsonNullValueInput | InputJsonValue
    timezone?: StringFieldUpdateOperationsInput | string
    starRating?: NullableIntFieldUpdateOperationsInput | number | null
    amenities?: JsonNullValueInput | InputJsonValue
    policies?: JsonNullValueInput | InputJsonValue
    contactInfo?: JsonNullValueInput | InputJsonValue
    images?: JsonNullValueInput | InputJsonValue
    virtualTour?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    chainId?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    address?: JsonNullValueInput | InputJsonValue
    coordinates?: JsonNullValueInput | InputJsonValue
    timezone?: StringFieldUpdateOperationsInput | string
    starRating?: NullableIntFieldUpdateOperationsInput | number | null
    amenities?: JsonNullValueInput | InputJsonValue
    policies?: JsonNullValueInput | InputJsonValue
    contactInfo?: JsonNullValueInput | InputJsonValue
    images?: JsonNullValueInput | InputJsonValue
    virtualTour?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    chainId?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoomTypeCreateInput = {
    id?: string
    name: string
    description: string
    category: string
    maxOccupancy: number
    bedConfiguration: JsonNullValueInput | InputJsonValue
    roomSize: number
    roomSizeUnit: string
    amenities: JsonNullValueInput | InputJsonValue
    view?: string | null
    floor?: string | null
    totalRooms: number
    baseRate: number
    currency: string
    images: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    property: PropertyCreateNestedOneWithoutRoomTypesInput
    bookings?: BookedRoomCreateNestedManyWithoutRoomTypeInput
    inventory?: InventoryRecordCreateNestedManyWithoutRoomTypeInput
    rates?: RateRecordCreateNestedManyWithoutRoomTypeInput
  }

  export type RoomTypeUncheckedCreateInput = {
    id?: string
    propertyId: string
    name: string
    description: string
    category: string
    maxOccupancy: number
    bedConfiguration: JsonNullValueInput | InputJsonValue
    roomSize: number
    roomSizeUnit: string
    amenities: JsonNullValueInput | InputJsonValue
    view?: string | null
    floor?: string | null
    totalRooms: number
    baseRate: number
    currency: string
    images: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    bookings?: BookedRoomUncheckedCreateNestedManyWithoutRoomTypeInput
    inventory?: InventoryRecordUncheckedCreateNestedManyWithoutRoomTypeInput
    rates?: RateRecordUncheckedCreateNestedManyWithoutRoomTypeInput
  }

  export type RoomTypeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    maxOccupancy?: IntFieldUpdateOperationsInput | number
    bedConfiguration?: JsonNullValueInput | InputJsonValue
    roomSize?: FloatFieldUpdateOperationsInput | number
    roomSizeUnit?: StringFieldUpdateOperationsInput | string
    amenities?: JsonNullValueInput | InputJsonValue
    view?: NullableStringFieldUpdateOperationsInput | string | null
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    totalRooms?: IntFieldUpdateOperationsInput | number
    baseRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    images?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    property?: PropertyUpdateOneRequiredWithoutRoomTypesNestedInput
    bookings?: BookedRoomUpdateManyWithoutRoomTypeNestedInput
    inventory?: InventoryRecordUpdateManyWithoutRoomTypeNestedInput
    rates?: RateRecordUpdateManyWithoutRoomTypeNestedInput
  }

  export type RoomTypeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    maxOccupancy?: IntFieldUpdateOperationsInput | number
    bedConfiguration?: JsonNullValueInput | InputJsonValue
    roomSize?: FloatFieldUpdateOperationsInput | number
    roomSizeUnit?: StringFieldUpdateOperationsInput | string
    amenities?: JsonNullValueInput | InputJsonValue
    view?: NullableStringFieldUpdateOperationsInput | string | null
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    totalRooms?: IntFieldUpdateOperationsInput | number
    baseRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    images?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookings?: BookedRoomUncheckedUpdateManyWithoutRoomTypeNestedInput
    inventory?: InventoryRecordUncheckedUpdateManyWithoutRoomTypeNestedInput
    rates?: RateRecordUncheckedUpdateManyWithoutRoomTypeNestedInput
  }

  export type RoomTypeCreateManyInput = {
    id?: string
    propertyId: string
    name: string
    description: string
    category: string
    maxOccupancy: number
    bedConfiguration: JsonNullValueInput | InputJsonValue
    roomSize: number
    roomSizeUnit: string
    amenities: JsonNullValueInput | InputJsonValue
    view?: string | null
    floor?: string | null
    totalRooms: number
    baseRate: number
    currency: string
    images: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoomTypeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    maxOccupancy?: IntFieldUpdateOperationsInput | number
    bedConfiguration?: JsonNullValueInput | InputJsonValue
    roomSize?: FloatFieldUpdateOperationsInput | number
    roomSizeUnit?: StringFieldUpdateOperationsInput | string
    amenities?: JsonNullValueInput | InputJsonValue
    view?: NullableStringFieldUpdateOperationsInput | string | null
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    totalRooms?: IntFieldUpdateOperationsInput | number
    baseRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    images?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoomTypeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    maxOccupancy?: IntFieldUpdateOperationsInput | number
    bedConfiguration?: JsonNullValueInput | InputJsonValue
    roomSize?: FloatFieldUpdateOperationsInput | number
    roomSizeUnit?: StringFieldUpdateOperationsInput | string
    amenities?: JsonNullValueInput | InputJsonValue
    view?: NullableStringFieldUpdateOperationsInput | string | null
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    totalRooms?: IntFieldUpdateOperationsInput | number
    baseRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    images?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingCreateInput = {
    id?: string
    confirmationNumber: string
    guestId: string
    primaryGuest: JsonNullValueInput | InputJsonValue
    additionalGuests: JsonNullValueInput | InputJsonValue
    checkInDate: Date | string
    checkOutDate: Date | string
    nights: number
    rooms: JsonNullValueInput | InputJsonValue
    pricing: JsonNullValueInput | InputJsonValue
    totalAmount: number
    currency: string
    status?: string
    bookingSource: string
    specialRequests?: string | null
    preferences: JsonNullValueInput | InputJsonValue
    paymentStatus?: string
    paymentMethod?: string | null
    cancellationPolicy: string
    noShowPolicy: string
    bookedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    property: PropertyCreateNestedOneWithoutBookingsInput
    bookedRooms?: BookedRoomCreateNestedManyWithoutBookingInput
  }

  export type BookingUncheckedCreateInput = {
    id?: string
    confirmationNumber: string
    propertyId: string
    guestId: string
    primaryGuest: JsonNullValueInput | InputJsonValue
    additionalGuests: JsonNullValueInput | InputJsonValue
    checkInDate: Date | string
    checkOutDate: Date | string
    nights: number
    rooms: JsonNullValueInput | InputJsonValue
    pricing: JsonNullValueInput | InputJsonValue
    totalAmount: number
    currency: string
    status?: string
    bookingSource: string
    specialRequests?: string | null
    preferences: JsonNullValueInput | InputJsonValue
    paymentStatus?: string
    paymentMethod?: string | null
    cancellationPolicy: string
    noShowPolicy: string
    bookedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    bookedRooms?: BookedRoomUncheckedCreateNestedManyWithoutBookingInput
  }

  export type BookingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    confirmationNumber?: StringFieldUpdateOperationsInput | string
    guestId?: StringFieldUpdateOperationsInput | string
    primaryGuest?: JsonNullValueInput | InputJsonValue
    additionalGuests?: JsonNullValueInput | InputJsonValue
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    nights?: IntFieldUpdateOperationsInput | number
    rooms?: JsonNullValueInput | InputJsonValue
    pricing?: JsonNullValueInput | InputJsonValue
    totalAmount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    bookingSource?: StringFieldUpdateOperationsInput | string
    specialRequests?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: JsonNullValueInput | InputJsonValue
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationPolicy?: StringFieldUpdateOperationsInput | string
    noShowPolicy?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    property?: PropertyUpdateOneRequiredWithoutBookingsNestedInput
    bookedRooms?: BookedRoomUpdateManyWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    confirmationNumber?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    guestId?: StringFieldUpdateOperationsInput | string
    primaryGuest?: JsonNullValueInput | InputJsonValue
    additionalGuests?: JsonNullValueInput | InputJsonValue
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    nights?: IntFieldUpdateOperationsInput | number
    rooms?: JsonNullValueInput | InputJsonValue
    pricing?: JsonNullValueInput | InputJsonValue
    totalAmount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    bookingSource?: StringFieldUpdateOperationsInput | string
    specialRequests?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: JsonNullValueInput | InputJsonValue
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationPolicy?: StringFieldUpdateOperationsInput | string
    noShowPolicy?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    bookedRooms?: BookedRoomUncheckedUpdateManyWithoutBookingNestedInput
  }

  export type BookingCreateManyInput = {
    id?: string
    confirmationNumber: string
    propertyId: string
    guestId: string
    primaryGuest: JsonNullValueInput | InputJsonValue
    additionalGuests: JsonNullValueInput | InputJsonValue
    checkInDate: Date | string
    checkOutDate: Date | string
    nights: number
    rooms: JsonNullValueInput | InputJsonValue
    pricing: JsonNullValueInput | InputJsonValue
    totalAmount: number
    currency: string
    status?: string
    bookingSource: string
    specialRequests?: string | null
    preferences: JsonNullValueInput | InputJsonValue
    paymentStatus?: string
    paymentMethod?: string | null
    cancellationPolicy: string
    noShowPolicy: string
    bookedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type BookingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    confirmationNumber?: StringFieldUpdateOperationsInput | string
    guestId?: StringFieldUpdateOperationsInput | string
    primaryGuest?: JsonNullValueInput | InputJsonValue
    additionalGuests?: JsonNullValueInput | InputJsonValue
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    nights?: IntFieldUpdateOperationsInput | number
    rooms?: JsonNullValueInput | InputJsonValue
    pricing?: JsonNullValueInput | InputJsonValue
    totalAmount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    bookingSource?: StringFieldUpdateOperationsInput | string
    specialRequests?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: JsonNullValueInput | InputJsonValue
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationPolicy?: StringFieldUpdateOperationsInput | string
    noShowPolicy?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type BookingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    confirmationNumber?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    guestId?: StringFieldUpdateOperationsInput | string
    primaryGuest?: JsonNullValueInput | InputJsonValue
    additionalGuests?: JsonNullValueInput | InputJsonValue
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    nights?: IntFieldUpdateOperationsInput | number
    rooms?: JsonNullValueInput | InputJsonValue
    pricing?: JsonNullValueInput | InputJsonValue
    totalAmount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    bookingSource?: StringFieldUpdateOperationsInput | string
    specialRequests?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: JsonNullValueInput | InputJsonValue
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationPolicy?: StringFieldUpdateOperationsInput | string
    noShowPolicy?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type BookedRoomCreateInput = {
    id?: string
    roomNumber?: string | null
    quantity: number
    guestCount: number
    rate: number
    totalPrice: number
    guests: JsonNullValueInput | InputJsonValue
    booking: BookingCreateNestedOneWithoutBookedRoomsInput
    roomType: RoomTypeCreateNestedOneWithoutBookingsInput
  }

  export type BookedRoomUncheckedCreateInput = {
    id?: string
    bookingId: string
    roomTypeId: string
    roomNumber?: string | null
    quantity: number
    guestCount: number
    rate: number
    totalPrice: number
    guests: JsonNullValueInput | InputJsonValue
  }

  export type BookedRoomUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomNumber?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    guestCount?: IntFieldUpdateOperationsInput | number
    rate?: FloatFieldUpdateOperationsInput | number
    totalPrice?: FloatFieldUpdateOperationsInput | number
    guests?: JsonNullValueInput | InputJsonValue
    booking?: BookingUpdateOneRequiredWithoutBookedRoomsNestedInput
    roomType?: RoomTypeUpdateOneRequiredWithoutBookingsNestedInput
  }

  export type BookedRoomUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    roomTypeId?: StringFieldUpdateOperationsInput | string
    roomNumber?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    guestCount?: IntFieldUpdateOperationsInput | number
    rate?: FloatFieldUpdateOperationsInput | number
    totalPrice?: FloatFieldUpdateOperationsInput | number
    guests?: JsonNullValueInput | InputJsonValue
  }

  export type BookedRoomCreateManyInput = {
    id?: string
    bookingId: string
    roomTypeId: string
    roomNumber?: string | null
    quantity: number
    guestCount: number
    rate: number
    totalPrice: number
    guests: JsonNullValueInput | InputJsonValue
  }

  export type BookedRoomUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomNumber?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    guestCount?: IntFieldUpdateOperationsInput | number
    rate?: FloatFieldUpdateOperationsInput | number
    totalPrice?: FloatFieldUpdateOperationsInput | number
    guests?: JsonNullValueInput | InputJsonValue
  }

  export type BookedRoomUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    roomTypeId?: StringFieldUpdateOperationsInput | string
    roomNumber?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    guestCount?: IntFieldUpdateOperationsInput | number
    rate?: FloatFieldUpdateOperationsInput | number
    totalPrice?: FloatFieldUpdateOperationsInput | number
    guests?: JsonNullValueInput | InputJsonValue
  }

  export type InventoryRecordCreateInput = {
    id?: string
    date: Date | string
    totalRooms: number
    availableRooms: number
    reservedRooms: number
    blockedRooms?: number
    overbookingLimit?: number
    minimumStay?: number | null
    maximumStay?: number | null
    closedToArrival?: boolean
    closedToDeparture?: boolean
    stopSell?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    property: PropertyCreateNestedOneWithoutInventoryInput
    roomType: RoomTypeCreateNestedOneWithoutInventoryInput
  }

  export type InventoryRecordUncheckedCreateInput = {
    id?: string
    propertyId: string
    roomTypeId: string
    date: Date | string
    totalRooms: number
    availableRooms: number
    reservedRooms: number
    blockedRooms?: number
    overbookingLimit?: number
    minimumStay?: number | null
    maximumStay?: number | null
    closedToArrival?: boolean
    closedToDeparture?: boolean
    stopSell?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalRooms?: IntFieldUpdateOperationsInput | number
    availableRooms?: IntFieldUpdateOperationsInput | number
    reservedRooms?: IntFieldUpdateOperationsInput | number
    blockedRooms?: IntFieldUpdateOperationsInput | number
    overbookingLimit?: IntFieldUpdateOperationsInput | number
    minimumStay?: NullableIntFieldUpdateOperationsInput | number | null
    maximumStay?: NullableIntFieldUpdateOperationsInput | number | null
    closedToArrival?: BoolFieldUpdateOperationsInput | boolean
    closedToDeparture?: BoolFieldUpdateOperationsInput | boolean
    stopSell?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    property?: PropertyUpdateOneRequiredWithoutInventoryNestedInput
    roomType?: RoomTypeUpdateOneRequiredWithoutInventoryNestedInput
  }

  export type InventoryRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    roomTypeId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalRooms?: IntFieldUpdateOperationsInput | number
    availableRooms?: IntFieldUpdateOperationsInput | number
    reservedRooms?: IntFieldUpdateOperationsInput | number
    blockedRooms?: IntFieldUpdateOperationsInput | number
    overbookingLimit?: IntFieldUpdateOperationsInput | number
    minimumStay?: NullableIntFieldUpdateOperationsInput | number | null
    maximumStay?: NullableIntFieldUpdateOperationsInput | number | null
    closedToArrival?: BoolFieldUpdateOperationsInput | boolean
    closedToDeparture?: BoolFieldUpdateOperationsInput | boolean
    stopSell?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryRecordCreateManyInput = {
    id?: string
    propertyId: string
    roomTypeId: string
    date: Date | string
    totalRooms: number
    availableRooms: number
    reservedRooms: number
    blockedRooms?: number
    overbookingLimit?: number
    minimumStay?: number | null
    maximumStay?: number | null
    closedToArrival?: boolean
    closedToDeparture?: boolean
    stopSell?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalRooms?: IntFieldUpdateOperationsInput | number
    availableRooms?: IntFieldUpdateOperationsInput | number
    reservedRooms?: IntFieldUpdateOperationsInput | number
    blockedRooms?: IntFieldUpdateOperationsInput | number
    overbookingLimit?: IntFieldUpdateOperationsInput | number
    minimumStay?: NullableIntFieldUpdateOperationsInput | number | null
    maximumStay?: NullableIntFieldUpdateOperationsInput | number | null
    closedToArrival?: BoolFieldUpdateOperationsInput | boolean
    closedToDeparture?: BoolFieldUpdateOperationsInput | boolean
    stopSell?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    roomTypeId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalRooms?: IntFieldUpdateOperationsInput | number
    availableRooms?: IntFieldUpdateOperationsInput | number
    reservedRooms?: IntFieldUpdateOperationsInput | number
    blockedRooms?: IntFieldUpdateOperationsInput | number
    overbookingLimit?: IntFieldUpdateOperationsInput | number
    minimumStay?: NullableIntFieldUpdateOperationsInput | number | null
    maximumStay?: NullableIntFieldUpdateOperationsInput | number | null
    closedToArrival?: BoolFieldUpdateOperationsInput | boolean
    closedToDeparture?: BoolFieldUpdateOperationsInput | boolean
    stopSell?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryReservationCreateInput = {
    id?: string
    propertyId: string
    roomTypeId: string
    checkInDate: Date | string
    checkOutDate: Date | string
    roomQuantity: number
    status?: string
    expiresAt: Date | string
    bookingId?: string | null
    createdAt?: Date | string
  }

  export type InventoryReservationUncheckedCreateInput = {
    id?: string
    propertyId: string
    roomTypeId: string
    checkInDate: Date | string
    checkOutDate: Date | string
    roomQuantity: number
    status?: string
    expiresAt: Date | string
    bookingId?: string | null
    createdAt?: Date | string
  }

  export type InventoryReservationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    roomTypeId?: StringFieldUpdateOperationsInput | string
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    roomQuantity?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryReservationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    roomTypeId?: StringFieldUpdateOperationsInput | string
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    roomQuantity?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryReservationCreateManyInput = {
    id?: string
    propertyId: string
    roomTypeId: string
    checkInDate: Date | string
    checkOutDate: Date | string
    roomQuantity: number
    status?: string
    expiresAt: Date | string
    bookingId?: string | null
    createdAt?: Date | string
  }

  export type InventoryReservationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    roomTypeId?: StringFieldUpdateOperationsInput | string
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    roomQuantity?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryReservationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    roomTypeId?: StringFieldUpdateOperationsInput | string
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    roomQuantity?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookingId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryLockCreateInput = {
    id?: string
    propertyId: string
    roomTypeId: string
    checkInDate: Date | string
    checkOutDate: Date | string
    quantity: number
    lockedBy: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type InventoryLockUncheckedCreateInput = {
    id?: string
    propertyId: string
    roomTypeId: string
    checkInDate: Date | string
    checkOutDate: Date | string
    quantity: number
    lockedBy: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type InventoryLockUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    roomTypeId?: StringFieldUpdateOperationsInput | string
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
    lockedBy?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryLockUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    roomTypeId?: StringFieldUpdateOperationsInput | string
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
    lockedBy?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryLockCreateManyInput = {
    id?: string
    propertyId: string
    roomTypeId: string
    checkInDate: Date | string
    checkOutDate: Date | string
    quantity: number
    lockedBy: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type InventoryLockUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    roomTypeId?: StringFieldUpdateOperationsInput | string
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
    lockedBy?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryLockUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    roomTypeId?: StringFieldUpdateOperationsInput | string
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
    lockedBy?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RateRecordCreateInput = {
    id?: string
    date: Date | string
    rate: number
    currency: string
    rateType?: string
    minimumStay?: number | null
    maximumStay?: number | null
    advanceBookingDays?: number | null
    restrictions?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    property: PropertyCreateNestedOneWithoutRatesInput
    roomType: RoomTypeCreateNestedOneWithoutRatesInput
  }

  export type RateRecordUncheckedCreateInput = {
    id?: string
    propertyId: string
    roomTypeId: string
    date: Date | string
    rate: number
    currency: string
    rateType?: string
    minimumStay?: number | null
    maximumStay?: number | null
    advanceBookingDays?: number | null
    restrictions?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RateRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    rate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    rateType?: StringFieldUpdateOperationsInput | string
    minimumStay?: NullableIntFieldUpdateOperationsInput | number | null
    maximumStay?: NullableIntFieldUpdateOperationsInput | number | null
    advanceBookingDays?: NullableIntFieldUpdateOperationsInput | number | null
    restrictions?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    property?: PropertyUpdateOneRequiredWithoutRatesNestedInput
    roomType?: RoomTypeUpdateOneRequiredWithoutRatesNestedInput
  }

  export type RateRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    roomTypeId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    rate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    rateType?: StringFieldUpdateOperationsInput | string
    minimumStay?: NullableIntFieldUpdateOperationsInput | number | null
    maximumStay?: NullableIntFieldUpdateOperationsInput | number | null
    advanceBookingDays?: NullableIntFieldUpdateOperationsInput | number | null
    restrictions?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RateRecordCreateManyInput = {
    id?: string
    propertyId: string
    roomTypeId: string
    date: Date | string
    rate: number
    currency: string
    rateType?: string
    minimumStay?: number | null
    maximumStay?: number | null
    advanceBookingDays?: number | null
    restrictions?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RateRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    rate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    rateType?: StringFieldUpdateOperationsInput | string
    minimumStay?: NullableIntFieldUpdateOperationsInput | number | null
    maximumStay?: NullableIntFieldUpdateOperationsInput | number | null
    advanceBookingDays?: NullableIntFieldUpdateOperationsInput | number | null
    restrictions?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RateRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    roomTypeId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    rate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    rateType?: StringFieldUpdateOperationsInput | string
    minimumStay?: NullableIntFieldUpdateOperationsInput | number | null
    maximumStay?: NullableIntFieldUpdateOperationsInput | number | null
    advanceBookingDays?: NullableIntFieldUpdateOperationsInput | number | null
    restrictions?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DynamicPricingRuleCreateInput = {
    id?: string
    propertyId: string
    name: string
    description: string
    type: string
    isActive?: boolean
    priority?: number
    conditions: JsonNullValueInput | InputJsonValue
    adjustments: JsonNullValueInput | InputJsonValue
    validFrom: Date | string
    validTo: Date | string
    applicableRoomTypes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DynamicPricingRuleUncheckedCreateInput = {
    id?: string
    propertyId: string
    name: string
    description: string
    type: string
    isActive?: boolean
    priority?: number
    conditions: JsonNullValueInput | InputJsonValue
    adjustments: JsonNullValueInput | InputJsonValue
    validFrom: Date | string
    validTo: Date | string
    applicableRoomTypes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DynamicPricingRuleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    conditions?: JsonNullValueInput | InputJsonValue
    adjustments?: JsonNullValueInput | InputJsonValue
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validTo?: DateTimeFieldUpdateOperationsInput | Date | string
    applicableRoomTypes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DynamicPricingRuleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    conditions?: JsonNullValueInput | InputJsonValue
    adjustments?: JsonNullValueInput | InputJsonValue
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validTo?: DateTimeFieldUpdateOperationsInput | Date | string
    applicableRoomTypes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DynamicPricingRuleCreateManyInput = {
    id?: string
    propertyId: string
    name: string
    description: string
    type: string
    isActive?: boolean
    priority?: number
    conditions: JsonNullValueInput | InputJsonValue
    adjustments: JsonNullValueInput | InputJsonValue
    validFrom: Date | string
    validTo: Date | string
    applicableRoomTypes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DynamicPricingRuleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    conditions?: JsonNullValueInput | InputJsonValue
    adjustments?: JsonNullValueInput | InputJsonValue
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validTo?: DateTimeFieldUpdateOperationsInput | Date | string
    applicableRoomTypes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DynamicPricingRuleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    conditions?: JsonNullValueInput | InputJsonValue
    adjustments?: JsonNullValueInput | InputJsonValue
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validTo?: DateTimeFieldUpdateOperationsInput | Date | string
    applicableRoomTypes?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeasonalRateCreateInput = {
    id?: string
    propertyId: string
    name: string
    description: string
    startDate: Date | string
    endDate: Date | string
    roomTypeRates: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeasonalRateUncheckedCreateInput = {
    id?: string
    propertyId: string
    name: string
    description: string
    startDate: Date | string
    endDate: Date | string
    roomTypeRates: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeasonalRateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    roomTypeRates?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeasonalRateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    roomTypeRates?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeasonalRateCreateManyInput = {
    id?: string
    propertyId: string
    name: string
    description: string
    startDate: Date | string
    endDate: Date | string
    roomTypeRates: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    priority?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SeasonalRateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    roomTypeRates?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeasonalRateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    roomTypeRates?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionCreateInput = {
    id?: string
    code?: string | null
    name: string
    description: string
    type: string
    discountType: string
    discountValue: number
    maxDiscount?: number | null
    validFrom: Date | string
    validTo: Date | string
    conditions: JsonNullValueInput | InputJsonValue
    usage: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    property: PropertyCreateNestedOneWithoutPromotionsInput
  }

  export type PromotionUncheckedCreateInput = {
    id?: string
    propertyId: string
    code?: string | null
    name: string
    description: string
    type: string
    discountType: string
    discountValue: number
    maxDiscount?: number | null
    validFrom: Date | string
    validTo: Date | string
    conditions: JsonNullValueInput | InputJsonValue
    usage: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PromotionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: FloatFieldUpdateOperationsInput | number
    maxDiscount?: NullableFloatFieldUpdateOperationsInput | number | null
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validTo?: DateTimeFieldUpdateOperationsInput | Date | string
    conditions?: JsonNullValueInput | InputJsonValue
    usage?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    property?: PropertyUpdateOneRequiredWithoutPromotionsNestedInput
  }

  export type PromotionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: FloatFieldUpdateOperationsInput | number
    maxDiscount?: NullableFloatFieldUpdateOperationsInput | number | null
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validTo?: DateTimeFieldUpdateOperationsInput | Date | string
    conditions?: JsonNullValueInput | InputJsonValue
    usage?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionCreateManyInput = {
    id?: string
    propertyId: string
    code?: string | null
    name: string
    description: string
    type: string
    discountType: string
    discountValue: number
    maxDiscount?: number | null
    validFrom: Date | string
    validTo: Date | string
    conditions: JsonNullValueInput | InputJsonValue
    usage: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PromotionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: FloatFieldUpdateOperationsInput | number
    maxDiscount?: NullableFloatFieldUpdateOperationsInput | number | null
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validTo?: DateTimeFieldUpdateOperationsInput | Date | string
    conditions?: JsonNullValueInput | InputJsonValue
    usage?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: FloatFieldUpdateOperationsInput | number
    maxDiscount?: NullableFloatFieldUpdateOperationsInput | number | null
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validTo?: DateTimeFieldUpdateOperationsInput | Date | string
    conditions?: JsonNullValueInput | InputJsonValue
    usage?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupDiscountCreateInput = {
    id?: string
    propertyId: string
    name: string
    description: string
    minimumRooms: number
    discountType: string
    discountValue: number
    validFrom: Date | string
    validTo: Date | string
    applicableRoomTypes?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GroupDiscountUncheckedCreateInput = {
    id?: string
    propertyId: string
    name: string
    description: string
    minimumRooms: number
    discountType: string
    discountValue: number
    validFrom: Date | string
    validTo: Date | string
    applicableRoomTypes?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GroupDiscountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    minimumRooms?: IntFieldUpdateOperationsInput | number
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: FloatFieldUpdateOperationsInput | number
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validTo?: DateTimeFieldUpdateOperationsInput | Date | string
    applicableRoomTypes?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupDiscountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    minimumRooms?: IntFieldUpdateOperationsInput | number
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: FloatFieldUpdateOperationsInput | number
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validTo?: DateTimeFieldUpdateOperationsInput | Date | string
    applicableRoomTypes?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupDiscountCreateManyInput = {
    id?: string
    propertyId: string
    name: string
    description: string
    minimumRooms: number
    discountType: string
    discountValue: number
    validFrom: Date | string
    validTo: Date | string
    applicableRoomTypes?: NullableJsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GroupDiscountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    minimumRooms?: IntFieldUpdateOperationsInput | number
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: FloatFieldUpdateOperationsInput | number
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validTo?: DateTimeFieldUpdateOperationsInput | Date | string
    applicableRoomTypes?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupDiscountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    minimumRooms?: IntFieldUpdateOperationsInput | number
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: FloatFieldUpdateOperationsInput | number
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validTo?: DateTimeFieldUpdateOperationsInput | Date | string
    applicableRoomTypes?: NullableJsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaxConfigurationCreateInput = {
    id?: string
    propertyId: string
    name: string
    type: string
    rate: number
    isPercentage?: boolean
    isInclusive?: boolean
    applicableRoomTypes?: NullableJsonNullValueInput | InputJsonValue
    validFrom: Date | string
    validTo?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaxConfigurationUncheckedCreateInput = {
    id?: string
    propertyId: string
    name: string
    type: string
    rate: number
    isPercentage?: boolean
    isInclusive?: boolean
    applicableRoomTypes?: NullableJsonNullValueInput | InputJsonValue
    validFrom: Date | string
    validTo?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaxConfigurationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    rate?: FloatFieldUpdateOperationsInput | number
    isPercentage?: BoolFieldUpdateOperationsInput | boolean
    isInclusive?: BoolFieldUpdateOperationsInput | boolean
    applicableRoomTypes?: NullableJsonNullValueInput | InputJsonValue
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validTo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaxConfigurationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    rate?: FloatFieldUpdateOperationsInput | number
    isPercentage?: BoolFieldUpdateOperationsInput | boolean
    isInclusive?: BoolFieldUpdateOperationsInput | boolean
    applicableRoomTypes?: NullableJsonNullValueInput | InputJsonValue
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validTo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaxConfigurationCreateManyInput = {
    id?: string
    propertyId: string
    name: string
    type: string
    rate: number
    isPercentage?: boolean
    isInclusive?: boolean
    applicableRoomTypes?: NullableJsonNullValueInput | InputJsonValue
    validFrom: Date | string
    validTo?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaxConfigurationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    rate?: FloatFieldUpdateOperationsInput | number
    isPercentage?: BoolFieldUpdateOperationsInput | boolean
    isInclusive?: BoolFieldUpdateOperationsInput | boolean
    applicableRoomTypes?: NullableJsonNullValueInput | InputJsonValue
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validTo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaxConfigurationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    rate?: FloatFieldUpdateOperationsInput | number
    isPercentage?: BoolFieldUpdateOperationsInput | boolean
    isInclusive?: BoolFieldUpdateOperationsInput | boolean
    applicableRoomTypes?: NullableJsonNullValueInput | InputJsonValue
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validTo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestProfileCreateInput = {
    id?: string
    userId: string
    personalInfo: JsonNullValueInput | InputJsonValue
    contactInfo: JsonNullValueInput | InputJsonValue
    preferences: JsonNullValueInput | InputJsonValue
    bookingHistory: JsonNullValueInput | InputJsonValue
    loyaltyStatus?: NullableJsonNullValueInput | InputJsonValue
    loyaltyPoints?: number | null
    accessibility?: NullableJsonNullValueInput | InputJsonValue
    dietaryRestrictions?: NullableJsonNullValueInput | InputJsonValue
    communicationPreferences: JsonNullValueInput | InputJsonValue
    vipStatus?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    lastBookingDate?: Date | string | null
    lastLoginDate?: Date | string | null
  }

  export type GuestProfileUncheckedCreateInput = {
    id?: string
    userId: string
    personalInfo: JsonNullValueInput | InputJsonValue
    contactInfo: JsonNullValueInput | InputJsonValue
    preferences: JsonNullValueInput | InputJsonValue
    bookingHistory: JsonNullValueInput | InputJsonValue
    loyaltyStatus?: NullableJsonNullValueInput | InputJsonValue
    loyaltyPoints?: number | null
    accessibility?: NullableJsonNullValueInput | InputJsonValue
    dietaryRestrictions?: NullableJsonNullValueInput | InputJsonValue
    communicationPreferences: JsonNullValueInput | InputJsonValue
    vipStatus?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    lastBookingDate?: Date | string | null
    lastLoginDate?: Date | string | null
  }

  export type GuestProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    personalInfo?: JsonNullValueInput | InputJsonValue
    contactInfo?: JsonNullValueInput | InputJsonValue
    preferences?: JsonNullValueInput | InputJsonValue
    bookingHistory?: JsonNullValueInput | InputJsonValue
    loyaltyStatus?: NullableJsonNullValueInput | InputJsonValue
    loyaltyPoints?: NullableIntFieldUpdateOperationsInput | number | null
    accessibility?: NullableJsonNullValueInput | InputJsonValue
    dietaryRestrictions?: NullableJsonNullValueInput | InputJsonValue
    communicationPreferences?: JsonNullValueInput | InputJsonValue
    vipStatus?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastBookingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GuestProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    personalInfo?: JsonNullValueInput | InputJsonValue
    contactInfo?: JsonNullValueInput | InputJsonValue
    preferences?: JsonNullValueInput | InputJsonValue
    bookingHistory?: JsonNullValueInput | InputJsonValue
    loyaltyStatus?: NullableJsonNullValueInput | InputJsonValue
    loyaltyPoints?: NullableIntFieldUpdateOperationsInput | number | null
    accessibility?: NullableJsonNullValueInput | InputJsonValue
    dietaryRestrictions?: NullableJsonNullValueInput | InputJsonValue
    communicationPreferences?: JsonNullValueInput | InputJsonValue
    vipStatus?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastBookingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GuestProfileCreateManyInput = {
    id?: string
    userId: string
    personalInfo: JsonNullValueInput | InputJsonValue
    contactInfo: JsonNullValueInput | InputJsonValue
    preferences: JsonNullValueInput | InputJsonValue
    bookingHistory: JsonNullValueInput | InputJsonValue
    loyaltyStatus?: NullableJsonNullValueInput | InputJsonValue
    loyaltyPoints?: number | null
    accessibility?: NullableJsonNullValueInput | InputJsonValue
    dietaryRestrictions?: NullableJsonNullValueInput | InputJsonValue
    communicationPreferences: JsonNullValueInput | InputJsonValue
    vipStatus?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    lastBookingDate?: Date | string | null
    lastLoginDate?: Date | string | null
  }

  export type GuestProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    personalInfo?: JsonNullValueInput | InputJsonValue
    contactInfo?: JsonNullValueInput | InputJsonValue
    preferences?: JsonNullValueInput | InputJsonValue
    bookingHistory?: JsonNullValueInput | InputJsonValue
    loyaltyStatus?: NullableJsonNullValueInput | InputJsonValue
    loyaltyPoints?: NullableIntFieldUpdateOperationsInput | number | null
    accessibility?: NullableJsonNullValueInput | InputJsonValue
    dietaryRestrictions?: NullableJsonNullValueInput | InputJsonValue
    communicationPreferences?: JsonNullValueInput | InputJsonValue
    vipStatus?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastBookingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GuestProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    personalInfo?: JsonNullValueInput | InputJsonValue
    contactInfo?: JsonNullValueInput | InputJsonValue
    preferences?: JsonNullValueInput | InputJsonValue
    bookingHistory?: JsonNullValueInput | InputJsonValue
    loyaltyStatus?: NullableJsonNullValueInput | InputJsonValue
    loyaltyPoints?: NullableIntFieldUpdateOperationsInput | number | null
    accessibility?: NullableJsonNullValueInput | InputJsonValue
    dietaryRestrictions?: NullableJsonNullValueInput | InputJsonValue
    communicationPreferences?: JsonNullValueInput | InputJsonValue
    vipStatus?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastBookingDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GuestActivityLogCreateInput = {
    id?: string
    guestId: string
    activityType: string
    description: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: Date | string
  }

  export type GuestActivityLogUncheckedCreateInput = {
    id?: string
    guestId: string
    activityType: string
    description: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: Date | string
  }

  export type GuestActivityLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    guestId?: StringFieldUpdateOperationsInput | string
    activityType?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestActivityLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    guestId?: StringFieldUpdateOperationsInput | string
    activityType?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestActivityLogCreateManyInput = {
    id?: string
    guestId: string
    activityType: string
    description: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: Date | string
  }

  export type GuestActivityLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    guestId?: StringFieldUpdateOperationsInput | string
    activityType?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestActivityLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    guestId?: StringFieldUpdateOperationsInput | string
    activityType?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type RoomTypeListRelationFilter = {
    every?: RoomTypeWhereInput
    some?: RoomTypeWhereInput
    none?: RoomTypeWhereInput
  }

  export type BookingListRelationFilter = {
    every?: BookingWhereInput
    some?: BookingWhereInput
    none?: BookingWhereInput
  }

  export type InventoryRecordListRelationFilter = {
    every?: InventoryRecordWhereInput
    some?: InventoryRecordWhereInput
    none?: InventoryRecordWhereInput
  }

  export type RateRecordListRelationFilter = {
    every?: RateRecordWhereInput
    some?: RateRecordWhereInput
    none?: RateRecordWhereInput
  }

  export type PromotionListRelationFilter = {
    every?: PromotionWhereInput
    some?: PromotionWhereInput
    none?: PromotionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RoomTypeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BookingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InventoryRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RateRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PromotionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PropertyCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    address?: SortOrder
    coordinates?: SortOrder
    timezone?: SortOrder
    starRating?: SortOrder
    amenities?: SortOrder
    policies?: SortOrder
    contactInfo?: SortOrder
    images?: SortOrder
    virtualTour?: SortOrder
    ownerId?: SortOrder
    chainId?: SortOrder
    brandId?: SortOrder
    status?: SortOrder
    settings?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PropertyAvgOrderByAggregateInput = {
    starRating?: SortOrder
  }

  export type PropertyMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    timezone?: SortOrder
    starRating?: SortOrder
    virtualTour?: SortOrder
    ownerId?: SortOrder
    chainId?: SortOrder
    brandId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PropertyMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    timezone?: SortOrder
    starRating?: SortOrder
    virtualTour?: SortOrder
    ownerId?: SortOrder
    chainId?: SortOrder
    brandId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PropertySumOrderByAggregateInput = {
    starRating?: SortOrder
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

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type PropertyRelationFilter = {
    is?: PropertyWhereInput
    isNot?: PropertyWhereInput
  }

  export type BookedRoomListRelationFilter = {
    every?: BookedRoomWhereInput
    some?: BookedRoomWhereInput
    none?: BookedRoomWhereInput
  }

  export type BookedRoomOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoomTypeCountOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    maxOccupancy?: SortOrder
    bedConfiguration?: SortOrder
    roomSize?: SortOrder
    roomSizeUnit?: SortOrder
    amenities?: SortOrder
    view?: SortOrder
    floor?: SortOrder
    totalRooms?: SortOrder
    baseRate?: SortOrder
    currency?: SortOrder
    images?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoomTypeAvgOrderByAggregateInput = {
    maxOccupancy?: SortOrder
    roomSize?: SortOrder
    totalRooms?: SortOrder
    baseRate?: SortOrder
  }

  export type RoomTypeMaxOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    maxOccupancy?: SortOrder
    roomSize?: SortOrder
    roomSizeUnit?: SortOrder
    view?: SortOrder
    floor?: SortOrder
    totalRooms?: SortOrder
    baseRate?: SortOrder
    currency?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoomTypeMinOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    maxOccupancy?: SortOrder
    roomSize?: SortOrder
    roomSizeUnit?: SortOrder
    view?: SortOrder
    floor?: SortOrder
    totalRooms?: SortOrder
    baseRate?: SortOrder
    currency?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoomTypeSumOrderByAggregateInput = {
    maxOccupancy?: SortOrder
    roomSize?: SortOrder
    totalRooms?: SortOrder
    baseRate?: SortOrder
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

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type BookingCountOrderByAggregateInput = {
    id?: SortOrder
    confirmationNumber?: SortOrder
    propertyId?: SortOrder
    guestId?: SortOrder
    primaryGuest?: SortOrder
    additionalGuests?: SortOrder
    checkInDate?: SortOrder
    checkOutDate?: SortOrder
    nights?: SortOrder
    rooms?: SortOrder
    pricing?: SortOrder
    totalAmount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    bookingSource?: SortOrder
    specialRequests?: SortOrder
    preferences?: SortOrder
    paymentStatus?: SortOrder
    paymentMethod?: SortOrder
    cancellationPolicy?: SortOrder
    noShowPolicy?: SortOrder
    bookedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    metadata?: SortOrder
  }

  export type BookingAvgOrderByAggregateInput = {
    nights?: SortOrder
    totalAmount?: SortOrder
  }

  export type BookingMaxOrderByAggregateInput = {
    id?: SortOrder
    confirmationNumber?: SortOrder
    propertyId?: SortOrder
    guestId?: SortOrder
    checkInDate?: SortOrder
    checkOutDate?: SortOrder
    nights?: SortOrder
    totalAmount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    bookingSource?: SortOrder
    specialRequests?: SortOrder
    paymentStatus?: SortOrder
    paymentMethod?: SortOrder
    cancellationPolicy?: SortOrder
    noShowPolicy?: SortOrder
    bookedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookingMinOrderByAggregateInput = {
    id?: SortOrder
    confirmationNumber?: SortOrder
    propertyId?: SortOrder
    guestId?: SortOrder
    checkInDate?: SortOrder
    checkOutDate?: SortOrder
    nights?: SortOrder
    totalAmount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    bookingSource?: SortOrder
    specialRequests?: SortOrder
    paymentStatus?: SortOrder
    paymentMethod?: SortOrder
    cancellationPolicy?: SortOrder
    noShowPolicy?: SortOrder
    bookedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookingSumOrderByAggregateInput = {
    nights?: SortOrder
    totalAmount?: SortOrder
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

  export type BookingRelationFilter = {
    is?: BookingWhereInput
    isNot?: BookingWhereInput
  }

  export type RoomTypeRelationFilter = {
    is?: RoomTypeWhereInput
    isNot?: RoomTypeWhereInput
  }

  export type BookedRoomCountOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    roomTypeId?: SortOrder
    roomNumber?: SortOrder
    quantity?: SortOrder
    guestCount?: SortOrder
    rate?: SortOrder
    totalPrice?: SortOrder
    guests?: SortOrder
  }

  export type BookedRoomAvgOrderByAggregateInput = {
    quantity?: SortOrder
    guestCount?: SortOrder
    rate?: SortOrder
    totalPrice?: SortOrder
  }

  export type BookedRoomMaxOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    roomTypeId?: SortOrder
    roomNumber?: SortOrder
    quantity?: SortOrder
    guestCount?: SortOrder
    rate?: SortOrder
    totalPrice?: SortOrder
  }

  export type BookedRoomMinOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    roomTypeId?: SortOrder
    roomNumber?: SortOrder
    quantity?: SortOrder
    guestCount?: SortOrder
    rate?: SortOrder
    totalPrice?: SortOrder
  }

  export type BookedRoomSumOrderByAggregateInput = {
    quantity?: SortOrder
    guestCount?: SortOrder
    rate?: SortOrder
    totalPrice?: SortOrder
  }

  export type InventoryRecordPropertyIdRoomTypeIdDateCompoundUniqueInput = {
    propertyId: string
    roomTypeId: string
    date: Date | string
  }

  export type InventoryRecordCountOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    roomTypeId?: SortOrder
    date?: SortOrder
    totalRooms?: SortOrder
    availableRooms?: SortOrder
    reservedRooms?: SortOrder
    blockedRooms?: SortOrder
    overbookingLimit?: SortOrder
    minimumStay?: SortOrder
    maximumStay?: SortOrder
    closedToArrival?: SortOrder
    closedToDeparture?: SortOrder
    stopSell?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventoryRecordAvgOrderByAggregateInput = {
    totalRooms?: SortOrder
    availableRooms?: SortOrder
    reservedRooms?: SortOrder
    blockedRooms?: SortOrder
    overbookingLimit?: SortOrder
    minimumStay?: SortOrder
    maximumStay?: SortOrder
  }

  export type InventoryRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    roomTypeId?: SortOrder
    date?: SortOrder
    totalRooms?: SortOrder
    availableRooms?: SortOrder
    reservedRooms?: SortOrder
    blockedRooms?: SortOrder
    overbookingLimit?: SortOrder
    minimumStay?: SortOrder
    maximumStay?: SortOrder
    closedToArrival?: SortOrder
    closedToDeparture?: SortOrder
    stopSell?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventoryRecordMinOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    roomTypeId?: SortOrder
    date?: SortOrder
    totalRooms?: SortOrder
    availableRooms?: SortOrder
    reservedRooms?: SortOrder
    blockedRooms?: SortOrder
    overbookingLimit?: SortOrder
    minimumStay?: SortOrder
    maximumStay?: SortOrder
    closedToArrival?: SortOrder
    closedToDeparture?: SortOrder
    stopSell?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventoryRecordSumOrderByAggregateInput = {
    totalRooms?: SortOrder
    availableRooms?: SortOrder
    reservedRooms?: SortOrder
    blockedRooms?: SortOrder
    overbookingLimit?: SortOrder
    minimumStay?: SortOrder
    maximumStay?: SortOrder
  }

  export type InventoryReservationCountOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    roomTypeId?: SortOrder
    checkInDate?: SortOrder
    checkOutDate?: SortOrder
    roomQuantity?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    bookingId?: SortOrder
    createdAt?: SortOrder
  }

  export type InventoryReservationAvgOrderByAggregateInput = {
    roomQuantity?: SortOrder
  }

  export type InventoryReservationMaxOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    roomTypeId?: SortOrder
    checkInDate?: SortOrder
    checkOutDate?: SortOrder
    roomQuantity?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    bookingId?: SortOrder
    createdAt?: SortOrder
  }

  export type InventoryReservationMinOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    roomTypeId?: SortOrder
    checkInDate?: SortOrder
    checkOutDate?: SortOrder
    roomQuantity?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    bookingId?: SortOrder
    createdAt?: SortOrder
  }

  export type InventoryReservationSumOrderByAggregateInput = {
    roomQuantity?: SortOrder
  }

  export type InventoryLockCountOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    roomTypeId?: SortOrder
    checkInDate?: SortOrder
    checkOutDate?: SortOrder
    quantity?: SortOrder
    lockedBy?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type InventoryLockAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type InventoryLockMaxOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    roomTypeId?: SortOrder
    checkInDate?: SortOrder
    checkOutDate?: SortOrder
    quantity?: SortOrder
    lockedBy?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type InventoryLockMinOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    roomTypeId?: SortOrder
    checkInDate?: SortOrder
    checkOutDate?: SortOrder
    quantity?: SortOrder
    lockedBy?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type InventoryLockSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type RateRecordPropertyIdRoomTypeIdDateRateTypeCompoundUniqueInput = {
    propertyId: string
    roomTypeId: string
    date: Date | string
    rateType: string
  }

  export type RateRecordCountOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    roomTypeId?: SortOrder
    date?: SortOrder
    rate?: SortOrder
    currency?: SortOrder
    rateType?: SortOrder
    minimumStay?: SortOrder
    maximumStay?: SortOrder
    advanceBookingDays?: SortOrder
    restrictions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RateRecordAvgOrderByAggregateInput = {
    rate?: SortOrder
    minimumStay?: SortOrder
    maximumStay?: SortOrder
    advanceBookingDays?: SortOrder
  }

  export type RateRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    roomTypeId?: SortOrder
    date?: SortOrder
    rate?: SortOrder
    currency?: SortOrder
    rateType?: SortOrder
    minimumStay?: SortOrder
    maximumStay?: SortOrder
    advanceBookingDays?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RateRecordMinOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    roomTypeId?: SortOrder
    date?: SortOrder
    rate?: SortOrder
    currency?: SortOrder
    rateType?: SortOrder
    minimumStay?: SortOrder
    maximumStay?: SortOrder
    advanceBookingDays?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RateRecordSumOrderByAggregateInput = {
    rate?: SortOrder
    minimumStay?: SortOrder
    maximumStay?: SortOrder
    advanceBookingDays?: SortOrder
  }

  export type DynamicPricingRuleCountOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    conditions?: SortOrder
    adjustments?: SortOrder
    validFrom?: SortOrder
    validTo?: SortOrder
    applicableRoomTypes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DynamicPricingRuleAvgOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type DynamicPricingRuleMaxOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    validFrom?: SortOrder
    validTo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DynamicPricingRuleMinOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    validFrom?: SortOrder
    validTo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DynamicPricingRuleSumOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type SeasonalRateCountOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    roomTypeRates?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SeasonalRateAvgOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type SeasonalRateMaxOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SeasonalRateMinOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SeasonalRateSumOrderByAggregateInput = {
    priority?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type PromotionCountOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    maxDiscount?: SortOrder
    validFrom?: SortOrder
    validTo?: SortOrder
    conditions?: SortOrder
    usage?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PromotionAvgOrderByAggregateInput = {
    discountValue?: SortOrder
    maxDiscount?: SortOrder
  }

  export type PromotionMaxOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    maxDiscount?: SortOrder
    validFrom?: SortOrder
    validTo?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PromotionMinOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    maxDiscount?: SortOrder
    validFrom?: SortOrder
    validTo?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PromotionSumOrderByAggregateInput = {
    discountValue?: SortOrder
    maxDiscount?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type GroupDiscountCountOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    minimumRooms?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    validFrom?: SortOrder
    validTo?: SortOrder
    applicableRoomTypes?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GroupDiscountAvgOrderByAggregateInput = {
    minimumRooms?: SortOrder
    discountValue?: SortOrder
  }

  export type GroupDiscountMaxOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    minimumRooms?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    validFrom?: SortOrder
    validTo?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GroupDiscountMinOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    minimumRooms?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    validFrom?: SortOrder
    validTo?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GroupDiscountSumOrderByAggregateInput = {
    minimumRooms?: SortOrder
    discountValue?: SortOrder
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

  export type TaxConfigurationCountOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    rate?: SortOrder
    isPercentage?: SortOrder
    isInclusive?: SortOrder
    applicableRoomTypes?: SortOrder
    validFrom?: SortOrder
    validTo?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaxConfigurationAvgOrderByAggregateInput = {
    rate?: SortOrder
  }

  export type TaxConfigurationMaxOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    rate?: SortOrder
    isPercentage?: SortOrder
    isInclusive?: SortOrder
    validFrom?: SortOrder
    validTo?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaxConfigurationMinOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    type?: SortOrder
    rate?: SortOrder
    isPercentage?: SortOrder
    isInclusive?: SortOrder
    validFrom?: SortOrder
    validTo?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaxConfigurationSumOrderByAggregateInput = {
    rate?: SortOrder
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

  export type GuestProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    personalInfo?: SortOrder
    contactInfo?: SortOrder
    preferences?: SortOrder
    bookingHistory?: SortOrder
    loyaltyStatus?: SortOrder
    loyaltyPoints?: SortOrder
    accessibility?: SortOrder
    dietaryRestrictions?: SortOrder
    communicationPreferences?: SortOrder
    vipStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastBookingDate?: SortOrder
    lastLoginDate?: SortOrder
  }

  export type GuestProfileAvgOrderByAggregateInput = {
    loyaltyPoints?: SortOrder
  }

  export type GuestProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    loyaltyPoints?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastBookingDate?: SortOrder
    lastLoginDate?: SortOrder
  }

  export type GuestProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    loyaltyPoints?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastBookingDate?: SortOrder
    lastLoginDate?: SortOrder
  }

  export type GuestProfileSumOrderByAggregateInput = {
    loyaltyPoints?: SortOrder
  }

  export type GuestActivityLogCountOrderByAggregateInput = {
    id?: SortOrder
    guestId?: SortOrder
    activityType?: SortOrder
    description?: SortOrder
    metadata?: SortOrder
    timestamp?: SortOrder
  }

  export type GuestActivityLogMaxOrderByAggregateInput = {
    id?: SortOrder
    guestId?: SortOrder
    activityType?: SortOrder
    description?: SortOrder
    timestamp?: SortOrder
  }

  export type GuestActivityLogMinOrderByAggregateInput = {
    id?: SortOrder
    guestId?: SortOrder
    activityType?: SortOrder
    description?: SortOrder
    timestamp?: SortOrder
  }

  export type RoomTypeCreateNestedManyWithoutPropertyInput = {
    create?: XOR<RoomTypeCreateWithoutPropertyInput, RoomTypeUncheckedCreateWithoutPropertyInput> | RoomTypeCreateWithoutPropertyInput[] | RoomTypeUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: RoomTypeCreateOrConnectWithoutPropertyInput | RoomTypeCreateOrConnectWithoutPropertyInput[]
    createMany?: RoomTypeCreateManyPropertyInputEnvelope
    connect?: RoomTypeWhereUniqueInput | RoomTypeWhereUniqueInput[]
  }

  export type BookingCreateNestedManyWithoutPropertyInput = {
    create?: XOR<BookingCreateWithoutPropertyInput, BookingUncheckedCreateWithoutPropertyInput> | BookingCreateWithoutPropertyInput[] | BookingUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutPropertyInput | BookingCreateOrConnectWithoutPropertyInput[]
    createMany?: BookingCreateManyPropertyInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type InventoryRecordCreateNestedManyWithoutPropertyInput = {
    create?: XOR<InventoryRecordCreateWithoutPropertyInput, InventoryRecordUncheckedCreateWithoutPropertyInput> | InventoryRecordCreateWithoutPropertyInput[] | InventoryRecordUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: InventoryRecordCreateOrConnectWithoutPropertyInput | InventoryRecordCreateOrConnectWithoutPropertyInput[]
    createMany?: InventoryRecordCreateManyPropertyInputEnvelope
    connect?: InventoryRecordWhereUniqueInput | InventoryRecordWhereUniqueInput[]
  }

  export type RateRecordCreateNestedManyWithoutPropertyInput = {
    create?: XOR<RateRecordCreateWithoutPropertyInput, RateRecordUncheckedCreateWithoutPropertyInput> | RateRecordCreateWithoutPropertyInput[] | RateRecordUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: RateRecordCreateOrConnectWithoutPropertyInput | RateRecordCreateOrConnectWithoutPropertyInput[]
    createMany?: RateRecordCreateManyPropertyInputEnvelope
    connect?: RateRecordWhereUniqueInput | RateRecordWhereUniqueInput[]
  }

  export type PromotionCreateNestedManyWithoutPropertyInput = {
    create?: XOR<PromotionCreateWithoutPropertyInput, PromotionUncheckedCreateWithoutPropertyInput> | PromotionCreateWithoutPropertyInput[] | PromotionUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: PromotionCreateOrConnectWithoutPropertyInput | PromotionCreateOrConnectWithoutPropertyInput[]
    createMany?: PromotionCreateManyPropertyInputEnvelope
    connect?: PromotionWhereUniqueInput | PromotionWhereUniqueInput[]
  }

  export type RoomTypeUncheckedCreateNestedManyWithoutPropertyInput = {
    create?: XOR<RoomTypeCreateWithoutPropertyInput, RoomTypeUncheckedCreateWithoutPropertyInput> | RoomTypeCreateWithoutPropertyInput[] | RoomTypeUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: RoomTypeCreateOrConnectWithoutPropertyInput | RoomTypeCreateOrConnectWithoutPropertyInput[]
    createMany?: RoomTypeCreateManyPropertyInputEnvelope
    connect?: RoomTypeWhereUniqueInput | RoomTypeWhereUniqueInput[]
  }

  export type BookingUncheckedCreateNestedManyWithoutPropertyInput = {
    create?: XOR<BookingCreateWithoutPropertyInput, BookingUncheckedCreateWithoutPropertyInput> | BookingCreateWithoutPropertyInput[] | BookingUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutPropertyInput | BookingCreateOrConnectWithoutPropertyInput[]
    createMany?: BookingCreateManyPropertyInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type InventoryRecordUncheckedCreateNestedManyWithoutPropertyInput = {
    create?: XOR<InventoryRecordCreateWithoutPropertyInput, InventoryRecordUncheckedCreateWithoutPropertyInput> | InventoryRecordCreateWithoutPropertyInput[] | InventoryRecordUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: InventoryRecordCreateOrConnectWithoutPropertyInput | InventoryRecordCreateOrConnectWithoutPropertyInput[]
    createMany?: InventoryRecordCreateManyPropertyInputEnvelope
    connect?: InventoryRecordWhereUniqueInput | InventoryRecordWhereUniqueInput[]
  }

  export type RateRecordUncheckedCreateNestedManyWithoutPropertyInput = {
    create?: XOR<RateRecordCreateWithoutPropertyInput, RateRecordUncheckedCreateWithoutPropertyInput> | RateRecordCreateWithoutPropertyInput[] | RateRecordUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: RateRecordCreateOrConnectWithoutPropertyInput | RateRecordCreateOrConnectWithoutPropertyInput[]
    createMany?: RateRecordCreateManyPropertyInputEnvelope
    connect?: RateRecordWhereUniqueInput | RateRecordWhereUniqueInput[]
  }

  export type PromotionUncheckedCreateNestedManyWithoutPropertyInput = {
    create?: XOR<PromotionCreateWithoutPropertyInput, PromotionUncheckedCreateWithoutPropertyInput> | PromotionCreateWithoutPropertyInput[] | PromotionUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: PromotionCreateOrConnectWithoutPropertyInput | PromotionCreateOrConnectWithoutPropertyInput[]
    createMany?: PromotionCreateManyPropertyInputEnvelope
    connect?: PromotionWhereUniqueInput | PromotionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type RoomTypeUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<RoomTypeCreateWithoutPropertyInput, RoomTypeUncheckedCreateWithoutPropertyInput> | RoomTypeCreateWithoutPropertyInput[] | RoomTypeUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: RoomTypeCreateOrConnectWithoutPropertyInput | RoomTypeCreateOrConnectWithoutPropertyInput[]
    upsert?: RoomTypeUpsertWithWhereUniqueWithoutPropertyInput | RoomTypeUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: RoomTypeCreateManyPropertyInputEnvelope
    set?: RoomTypeWhereUniqueInput | RoomTypeWhereUniqueInput[]
    disconnect?: RoomTypeWhereUniqueInput | RoomTypeWhereUniqueInput[]
    delete?: RoomTypeWhereUniqueInput | RoomTypeWhereUniqueInput[]
    connect?: RoomTypeWhereUniqueInput | RoomTypeWhereUniqueInput[]
    update?: RoomTypeUpdateWithWhereUniqueWithoutPropertyInput | RoomTypeUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: RoomTypeUpdateManyWithWhereWithoutPropertyInput | RoomTypeUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: RoomTypeScalarWhereInput | RoomTypeScalarWhereInput[]
  }

  export type BookingUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<BookingCreateWithoutPropertyInput, BookingUncheckedCreateWithoutPropertyInput> | BookingCreateWithoutPropertyInput[] | BookingUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutPropertyInput | BookingCreateOrConnectWithoutPropertyInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutPropertyInput | BookingUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: BookingCreateManyPropertyInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutPropertyInput | BookingUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutPropertyInput | BookingUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type InventoryRecordUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<InventoryRecordCreateWithoutPropertyInput, InventoryRecordUncheckedCreateWithoutPropertyInput> | InventoryRecordCreateWithoutPropertyInput[] | InventoryRecordUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: InventoryRecordCreateOrConnectWithoutPropertyInput | InventoryRecordCreateOrConnectWithoutPropertyInput[]
    upsert?: InventoryRecordUpsertWithWhereUniqueWithoutPropertyInput | InventoryRecordUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: InventoryRecordCreateManyPropertyInputEnvelope
    set?: InventoryRecordWhereUniqueInput | InventoryRecordWhereUniqueInput[]
    disconnect?: InventoryRecordWhereUniqueInput | InventoryRecordWhereUniqueInput[]
    delete?: InventoryRecordWhereUniqueInput | InventoryRecordWhereUniqueInput[]
    connect?: InventoryRecordWhereUniqueInput | InventoryRecordWhereUniqueInput[]
    update?: InventoryRecordUpdateWithWhereUniqueWithoutPropertyInput | InventoryRecordUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: InventoryRecordUpdateManyWithWhereWithoutPropertyInput | InventoryRecordUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: InventoryRecordScalarWhereInput | InventoryRecordScalarWhereInput[]
  }

  export type RateRecordUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<RateRecordCreateWithoutPropertyInput, RateRecordUncheckedCreateWithoutPropertyInput> | RateRecordCreateWithoutPropertyInput[] | RateRecordUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: RateRecordCreateOrConnectWithoutPropertyInput | RateRecordCreateOrConnectWithoutPropertyInput[]
    upsert?: RateRecordUpsertWithWhereUniqueWithoutPropertyInput | RateRecordUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: RateRecordCreateManyPropertyInputEnvelope
    set?: RateRecordWhereUniqueInput | RateRecordWhereUniqueInput[]
    disconnect?: RateRecordWhereUniqueInput | RateRecordWhereUniqueInput[]
    delete?: RateRecordWhereUniqueInput | RateRecordWhereUniqueInput[]
    connect?: RateRecordWhereUniqueInput | RateRecordWhereUniqueInput[]
    update?: RateRecordUpdateWithWhereUniqueWithoutPropertyInput | RateRecordUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: RateRecordUpdateManyWithWhereWithoutPropertyInput | RateRecordUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: RateRecordScalarWhereInput | RateRecordScalarWhereInput[]
  }

  export type PromotionUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<PromotionCreateWithoutPropertyInput, PromotionUncheckedCreateWithoutPropertyInput> | PromotionCreateWithoutPropertyInput[] | PromotionUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: PromotionCreateOrConnectWithoutPropertyInput | PromotionCreateOrConnectWithoutPropertyInput[]
    upsert?: PromotionUpsertWithWhereUniqueWithoutPropertyInput | PromotionUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: PromotionCreateManyPropertyInputEnvelope
    set?: PromotionWhereUniqueInput | PromotionWhereUniqueInput[]
    disconnect?: PromotionWhereUniqueInput | PromotionWhereUniqueInput[]
    delete?: PromotionWhereUniqueInput | PromotionWhereUniqueInput[]
    connect?: PromotionWhereUniqueInput | PromotionWhereUniqueInput[]
    update?: PromotionUpdateWithWhereUniqueWithoutPropertyInput | PromotionUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: PromotionUpdateManyWithWhereWithoutPropertyInput | PromotionUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: PromotionScalarWhereInput | PromotionScalarWhereInput[]
  }

  export type RoomTypeUncheckedUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<RoomTypeCreateWithoutPropertyInput, RoomTypeUncheckedCreateWithoutPropertyInput> | RoomTypeCreateWithoutPropertyInput[] | RoomTypeUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: RoomTypeCreateOrConnectWithoutPropertyInput | RoomTypeCreateOrConnectWithoutPropertyInput[]
    upsert?: RoomTypeUpsertWithWhereUniqueWithoutPropertyInput | RoomTypeUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: RoomTypeCreateManyPropertyInputEnvelope
    set?: RoomTypeWhereUniqueInput | RoomTypeWhereUniqueInput[]
    disconnect?: RoomTypeWhereUniqueInput | RoomTypeWhereUniqueInput[]
    delete?: RoomTypeWhereUniqueInput | RoomTypeWhereUniqueInput[]
    connect?: RoomTypeWhereUniqueInput | RoomTypeWhereUniqueInput[]
    update?: RoomTypeUpdateWithWhereUniqueWithoutPropertyInput | RoomTypeUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: RoomTypeUpdateManyWithWhereWithoutPropertyInput | RoomTypeUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: RoomTypeScalarWhereInput | RoomTypeScalarWhereInput[]
  }

  export type BookingUncheckedUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<BookingCreateWithoutPropertyInput, BookingUncheckedCreateWithoutPropertyInput> | BookingCreateWithoutPropertyInput[] | BookingUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutPropertyInput | BookingCreateOrConnectWithoutPropertyInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutPropertyInput | BookingUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: BookingCreateManyPropertyInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutPropertyInput | BookingUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutPropertyInput | BookingUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type InventoryRecordUncheckedUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<InventoryRecordCreateWithoutPropertyInput, InventoryRecordUncheckedCreateWithoutPropertyInput> | InventoryRecordCreateWithoutPropertyInput[] | InventoryRecordUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: InventoryRecordCreateOrConnectWithoutPropertyInput | InventoryRecordCreateOrConnectWithoutPropertyInput[]
    upsert?: InventoryRecordUpsertWithWhereUniqueWithoutPropertyInput | InventoryRecordUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: InventoryRecordCreateManyPropertyInputEnvelope
    set?: InventoryRecordWhereUniqueInput | InventoryRecordWhereUniqueInput[]
    disconnect?: InventoryRecordWhereUniqueInput | InventoryRecordWhereUniqueInput[]
    delete?: InventoryRecordWhereUniqueInput | InventoryRecordWhereUniqueInput[]
    connect?: InventoryRecordWhereUniqueInput | InventoryRecordWhereUniqueInput[]
    update?: InventoryRecordUpdateWithWhereUniqueWithoutPropertyInput | InventoryRecordUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: InventoryRecordUpdateManyWithWhereWithoutPropertyInput | InventoryRecordUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: InventoryRecordScalarWhereInput | InventoryRecordScalarWhereInput[]
  }

  export type RateRecordUncheckedUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<RateRecordCreateWithoutPropertyInput, RateRecordUncheckedCreateWithoutPropertyInput> | RateRecordCreateWithoutPropertyInput[] | RateRecordUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: RateRecordCreateOrConnectWithoutPropertyInput | RateRecordCreateOrConnectWithoutPropertyInput[]
    upsert?: RateRecordUpsertWithWhereUniqueWithoutPropertyInput | RateRecordUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: RateRecordCreateManyPropertyInputEnvelope
    set?: RateRecordWhereUniqueInput | RateRecordWhereUniqueInput[]
    disconnect?: RateRecordWhereUniqueInput | RateRecordWhereUniqueInput[]
    delete?: RateRecordWhereUniqueInput | RateRecordWhereUniqueInput[]
    connect?: RateRecordWhereUniqueInput | RateRecordWhereUniqueInput[]
    update?: RateRecordUpdateWithWhereUniqueWithoutPropertyInput | RateRecordUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: RateRecordUpdateManyWithWhereWithoutPropertyInput | RateRecordUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: RateRecordScalarWhereInput | RateRecordScalarWhereInput[]
  }

  export type PromotionUncheckedUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<PromotionCreateWithoutPropertyInput, PromotionUncheckedCreateWithoutPropertyInput> | PromotionCreateWithoutPropertyInput[] | PromotionUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: PromotionCreateOrConnectWithoutPropertyInput | PromotionCreateOrConnectWithoutPropertyInput[]
    upsert?: PromotionUpsertWithWhereUniqueWithoutPropertyInput | PromotionUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: PromotionCreateManyPropertyInputEnvelope
    set?: PromotionWhereUniqueInput | PromotionWhereUniqueInput[]
    disconnect?: PromotionWhereUniqueInput | PromotionWhereUniqueInput[]
    delete?: PromotionWhereUniqueInput | PromotionWhereUniqueInput[]
    connect?: PromotionWhereUniqueInput | PromotionWhereUniqueInput[]
    update?: PromotionUpdateWithWhereUniqueWithoutPropertyInput | PromotionUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: PromotionUpdateManyWithWhereWithoutPropertyInput | PromotionUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: PromotionScalarWhereInput | PromotionScalarWhereInput[]
  }

  export type PropertyCreateNestedOneWithoutRoomTypesInput = {
    create?: XOR<PropertyCreateWithoutRoomTypesInput, PropertyUncheckedCreateWithoutRoomTypesInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutRoomTypesInput
    connect?: PropertyWhereUniqueInput
  }

  export type BookedRoomCreateNestedManyWithoutRoomTypeInput = {
    create?: XOR<BookedRoomCreateWithoutRoomTypeInput, BookedRoomUncheckedCreateWithoutRoomTypeInput> | BookedRoomCreateWithoutRoomTypeInput[] | BookedRoomUncheckedCreateWithoutRoomTypeInput[]
    connectOrCreate?: BookedRoomCreateOrConnectWithoutRoomTypeInput | BookedRoomCreateOrConnectWithoutRoomTypeInput[]
    createMany?: BookedRoomCreateManyRoomTypeInputEnvelope
    connect?: BookedRoomWhereUniqueInput | BookedRoomWhereUniqueInput[]
  }

  export type InventoryRecordCreateNestedManyWithoutRoomTypeInput = {
    create?: XOR<InventoryRecordCreateWithoutRoomTypeInput, InventoryRecordUncheckedCreateWithoutRoomTypeInput> | InventoryRecordCreateWithoutRoomTypeInput[] | InventoryRecordUncheckedCreateWithoutRoomTypeInput[]
    connectOrCreate?: InventoryRecordCreateOrConnectWithoutRoomTypeInput | InventoryRecordCreateOrConnectWithoutRoomTypeInput[]
    createMany?: InventoryRecordCreateManyRoomTypeInputEnvelope
    connect?: InventoryRecordWhereUniqueInput | InventoryRecordWhereUniqueInput[]
  }

  export type RateRecordCreateNestedManyWithoutRoomTypeInput = {
    create?: XOR<RateRecordCreateWithoutRoomTypeInput, RateRecordUncheckedCreateWithoutRoomTypeInput> | RateRecordCreateWithoutRoomTypeInput[] | RateRecordUncheckedCreateWithoutRoomTypeInput[]
    connectOrCreate?: RateRecordCreateOrConnectWithoutRoomTypeInput | RateRecordCreateOrConnectWithoutRoomTypeInput[]
    createMany?: RateRecordCreateManyRoomTypeInputEnvelope
    connect?: RateRecordWhereUniqueInput | RateRecordWhereUniqueInput[]
  }

  export type BookedRoomUncheckedCreateNestedManyWithoutRoomTypeInput = {
    create?: XOR<BookedRoomCreateWithoutRoomTypeInput, BookedRoomUncheckedCreateWithoutRoomTypeInput> | BookedRoomCreateWithoutRoomTypeInput[] | BookedRoomUncheckedCreateWithoutRoomTypeInput[]
    connectOrCreate?: BookedRoomCreateOrConnectWithoutRoomTypeInput | BookedRoomCreateOrConnectWithoutRoomTypeInput[]
    createMany?: BookedRoomCreateManyRoomTypeInputEnvelope
    connect?: BookedRoomWhereUniqueInput | BookedRoomWhereUniqueInput[]
  }

  export type InventoryRecordUncheckedCreateNestedManyWithoutRoomTypeInput = {
    create?: XOR<InventoryRecordCreateWithoutRoomTypeInput, InventoryRecordUncheckedCreateWithoutRoomTypeInput> | InventoryRecordCreateWithoutRoomTypeInput[] | InventoryRecordUncheckedCreateWithoutRoomTypeInput[]
    connectOrCreate?: InventoryRecordCreateOrConnectWithoutRoomTypeInput | InventoryRecordCreateOrConnectWithoutRoomTypeInput[]
    createMany?: InventoryRecordCreateManyRoomTypeInputEnvelope
    connect?: InventoryRecordWhereUniqueInput | InventoryRecordWhereUniqueInput[]
  }

  export type RateRecordUncheckedCreateNestedManyWithoutRoomTypeInput = {
    create?: XOR<RateRecordCreateWithoutRoomTypeInput, RateRecordUncheckedCreateWithoutRoomTypeInput> | RateRecordCreateWithoutRoomTypeInput[] | RateRecordUncheckedCreateWithoutRoomTypeInput[]
    connectOrCreate?: RateRecordCreateOrConnectWithoutRoomTypeInput | RateRecordCreateOrConnectWithoutRoomTypeInput[]
    createMany?: RateRecordCreateManyRoomTypeInputEnvelope
    connect?: RateRecordWhereUniqueInput | RateRecordWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type PropertyUpdateOneRequiredWithoutRoomTypesNestedInput = {
    create?: XOR<PropertyCreateWithoutRoomTypesInput, PropertyUncheckedCreateWithoutRoomTypesInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutRoomTypesInput
    upsert?: PropertyUpsertWithoutRoomTypesInput
    connect?: PropertyWhereUniqueInput
    update?: XOR<XOR<PropertyUpdateToOneWithWhereWithoutRoomTypesInput, PropertyUpdateWithoutRoomTypesInput>, PropertyUncheckedUpdateWithoutRoomTypesInput>
  }

  export type BookedRoomUpdateManyWithoutRoomTypeNestedInput = {
    create?: XOR<BookedRoomCreateWithoutRoomTypeInput, BookedRoomUncheckedCreateWithoutRoomTypeInput> | BookedRoomCreateWithoutRoomTypeInput[] | BookedRoomUncheckedCreateWithoutRoomTypeInput[]
    connectOrCreate?: BookedRoomCreateOrConnectWithoutRoomTypeInput | BookedRoomCreateOrConnectWithoutRoomTypeInput[]
    upsert?: BookedRoomUpsertWithWhereUniqueWithoutRoomTypeInput | BookedRoomUpsertWithWhereUniqueWithoutRoomTypeInput[]
    createMany?: BookedRoomCreateManyRoomTypeInputEnvelope
    set?: BookedRoomWhereUniqueInput | BookedRoomWhereUniqueInput[]
    disconnect?: BookedRoomWhereUniqueInput | BookedRoomWhereUniqueInput[]
    delete?: BookedRoomWhereUniqueInput | BookedRoomWhereUniqueInput[]
    connect?: BookedRoomWhereUniqueInput | BookedRoomWhereUniqueInput[]
    update?: BookedRoomUpdateWithWhereUniqueWithoutRoomTypeInput | BookedRoomUpdateWithWhereUniqueWithoutRoomTypeInput[]
    updateMany?: BookedRoomUpdateManyWithWhereWithoutRoomTypeInput | BookedRoomUpdateManyWithWhereWithoutRoomTypeInput[]
    deleteMany?: BookedRoomScalarWhereInput | BookedRoomScalarWhereInput[]
  }

  export type InventoryRecordUpdateManyWithoutRoomTypeNestedInput = {
    create?: XOR<InventoryRecordCreateWithoutRoomTypeInput, InventoryRecordUncheckedCreateWithoutRoomTypeInput> | InventoryRecordCreateWithoutRoomTypeInput[] | InventoryRecordUncheckedCreateWithoutRoomTypeInput[]
    connectOrCreate?: InventoryRecordCreateOrConnectWithoutRoomTypeInput | InventoryRecordCreateOrConnectWithoutRoomTypeInput[]
    upsert?: InventoryRecordUpsertWithWhereUniqueWithoutRoomTypeInput | InventoryRecordUpsertWithWhereUniqueWithoutRoomTypeInput[]
    createMany?: InventoryRecordCreateManyRoomTypeInputEnvelope
    set?: InventoryRecordWhereUniqueInput | InventoryRecordWhereUniqueInput[]
    disconnect?: InventoryRecordWhereUniqueInput | InventoryRecordWhereUniqueInput[]
    delete?: InventoryRecordWhereUniqueInput | InventoryRecordWhereUniqueInput[]
    connect?: InventoryRecordWhereUniqueInput | InventoryRecordWhereUniqueInput[]
    update?: InventoryRecordUpdateWithWhereUniqueWithoutRoomTypeInput | InventoryRecordUpdateWithWhereUniqueWithoutRoomTypeInput[]
    updateMany?: InventoryRecordUpdateManyWithWhereWithoutRoomTypeInput | InventoryRecordUpdateManyWithWhereWithoutRoomTypeInput[]
    deleteMany?: InventoryRecordScalarWhereInput | InventoryRecordScalarWhereInput[]
  }

  export type RateRecordUpdateManyWithoutRoomTypeNestedInput = {
    create?: XOR<RateRecordCreateWithoutRoomTypeInput, RateRecordUncheckedCreateWithoutRoomTypeInput> | RateRecordCreateWithoutRoomTypeInput[] | RateRecordUncheckedCreateWithoutRoomTypeInput[]
    connectOrCreate?: RateRecordCreateOrConnectWithoutRoomTypeInput | RateRecordCreateOrConnectWithoutRoomTypeInput[]
    upsert?: RateRecordUpsertWithWhereUniqueWithoutRoomTypeInput | RateRecordUpsertWithWhereUniqueWithoutRoomTypeInput[]
    createMany?: RateRecordCreateManyRoomTypeInputEnvelope
    set?: RateRecordWhereUniqueInput | RateRecordWhereUniqueInput[]
    disconnect?: RateRecordWhereUniqueInput | RateRecordWhereUniqueInput[]
    delete?: RateRecordWhereUniqueInput | RateRecordWhereUniqueInput[]
    connect?: RateRecordWhereUniqueInput | RateRecordWhereUniqueInput[]
    update?: RateRecordUpdateWithWhereUniqueWithoutRoomTypeInput | RateRecordUpdateWithWhereUniqueWithoutRoomTypeInput[]
    updateMany?: RateRecordUpdateManyWithWhereWithoutRoomTypeInput | RateRecordUpdateManyWithWhereWithoutRoomTypeInput[]
    deleteMany?: RateRecordScalarWhereInput | RateRecordScalarWhereInput[]
  }

  export type BookedRoomUncheckedUpdateManyWithoutRoomTypeNestedInput = {
    create?: XOR<BookedRoomCreateWithoutRoomTypeInput, BookedRoomUncheckedCreateWithoutRoomTypeInput> | BookedRoomCreateWithoutRoomTypeInput[] | BookedRoomUncheckedCreateWithoutRoomTypeInput[]
    connectOrCreate?: BookedRoomCreateOrConnectWithoutRoomTypeInput | BookedRoomCreateOrConnectWithoutRoomTypeInput[]
    upsert?: BookedRoomUpsertWithWhereUniqueWithoutRoomTypeInput | BookedRoomUpsertWithWhereUniqueWithoutRoomTypeInput[]
    createMany?: BookedRoomCreateManyRoomTypeInputEnvelope
    set?: BookedRoomWhereUniqueInput | BookedRoomWhereUniqueInput[]
    disconnect?: BookedRoomWhereUniqueInput | BookedRoomWhereUniqueInput[]
    delete?: BookedRoomWhereUniqueInput | BookedRoomWhereUniqueInput[]
    connect?: BookedRoomWhereUniqueInput | BookedRoomWhereUniqueInput[]
    update?: BookedRoomUpdateWithWhereUniqueWithoutRoomTypeInput | BookedRoomUpdateWithWhereUniqueWithoutRoomTypeInput[]
    updateMany?: BookedRoomUpdateManyWithWhereWithoutRoomTypeInput | BookedRoomUpdateManyWithWhereWithoutRoomTypeInput[]
    deleteMany?: BookedRoomScalarWhereInput | BookedRoomScalarWhereInput[]
  }

  export type InventoryRecordUncheckedUpdateManyWithoutRoomTypeNestedInput = {
    create?: XOR<InventoryRecordCreateWithoutRoomTypeInput, InventoryRecordUncheckedCreateWithoutRoomTypeInput> | InventoryRecordCreateWithoutRoomTypeInput[] | InventoryRecordUncheckedCreateWithoutRoomTypeInput[]
    connectOrCreate?: InventoryRecordCreateOrConnectWithoutRoomTypeInput | InventoryRecordCreateOrConnectWithoutRoomTypeInput[]
    upsert?: InventoryRecordUpsertWithWhereUniqueWithoutRoomTypeInput | InventoryRecordUpsertWithWhereUniqueWithoutRoomTypeInput[]
    createMany?: InventoryRecordCreateManyRoomTypeInputEnvelope
    set?: InventoryRecordWhereUniqueInput | InventoryRecordWhereUniqueInput[]
    disconnect?: InventoryRecordWhereUniqueInput | InventoryRecordWhereUniqueInput[]
    delete?: InventoryRecordWhereUniqueInput | InventoryRecordWhereUniqueInput[]
    connect?: InventoryRecordWhereUniqueInput | InventoryRecordWhereUniqueInput[]
    update?: InventoryRecordUpdateWithWhereUniqueWithoutRoomTypeInput | InventoryRecordUpdateWithWhereUniqueWithoutRoomTypeInput[]
    updateMany?: InventoryRecordUpdateManyWithWhereWithoutRoomTypeInput | InventoryRecordUpdateManyWithWhereWithoutRoomTypeInput[]
    deleteMany?: InventoryRecordScalarWhereInput | InventoryRecordScalarWhereInput[]
  }

  export type RateRecordUncheckedUpdateManyWithoutRoomTypeNestedInput = {
    create?: XOR<RateRecordCreateWithoutRoomTypeInput, RateRecordUncheckedCreateWithoutRoomTypeInput> | RateRecordCreateWithoutRoomTypeInput[] | RateRecordUncheckedCreateWithoutRoomTypeInput[]
    connectOrCreate?: RateRecordCreateOrConnectWithoutRoomTypeInput | RateRecordCreateOrConnectWithoutRoomTypeInput[]
    upsert?: RateRecordUpsertWithWhereUniqueWithoutRoomTypeInput | RateRecordUpsertWithWhereUniqueWithoutRoomTypeInput[]
    createMany?: RateRecordCreateManyRoomTypeInputEnvelope
    set?: RateRecordWhereUniqueInput | RateRecordWhereUniqueInput[]
    disconnect?: RateRecordWhereUniqueInput | RateRecordWhereUniqueInput[]
    delete?: RateRecordWhereUniqueInput | RateRecordWhereUniqueInput[]
    connect?: RateRecordWhereUniqueInput | RateRecordWhereUniqueInput[]
    update?: RateRecordUpdateWithWhereUniqueWithoutRoomTypeInput | RateRecordUpdateWithWhereUniqueWithoutRoomTypeInput[]
    updateMany?: RateRecordUpdateManyWithWhereWithoutRoomTypeInput | RateRecordUpdateManyWithWhereWithoutRoomTypeInput[]
    deleteMany?: RateRecordScalarWhereInput | RateRecordScalarWhereInput[]
  }

  export type PropertyCreateNestedOneWithoutBookingsInput = {
    create?: XOR<PropertyCreateWithoutBookingsInput, PropertyUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutBookingsInput
    connect?: PropertyWhereUniqueInput
  }

  export type BookedRoomCreateNestedManyWithoutBookingInput = {
    create?: XOR<BookedRoomCreateWithoutBookingInput, BookedRoomUncheckedCreateWithoutBookingInput> | BookedRoomCreateWithoutBookingInput[] | BookedRoomUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: BookedRoomCreateOrConnectWithoutBookingInput | BookedRoomCreateOrConnectWithoutBookingInput[]
    createMany?: BookedRoomCreateManyBookingInputEnvelope
    connect?: BookedRoomWhereUniqueInput | BookedRoomWhereUniqueInput[]
  }

  export type BookedRoomUncheckedCreateNestedManyWithoutBookingInput = {
    create?: XOR<BookedRoomCreateWithoutBookingInput, BookedRoomUncheckedCreateWithoutBookingInput> | BookedRoomCreateWithoutBookingInput[] | BookedRoomUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: BookedRoomCreateOrConnectWithoutBookingInput | BookedRoomCreateOrConnectWithoutBookingInput[]
    createMany?: BookedRoomCreateManyBookingInputEnvelope
    connect?: BookedRoomWhereUniqueInput | BookedRoomWhereUniqueInput[]
  }

  export type PropertyUpdateOneRequiredWithoutBookingsNestedInput = {
    create?: XOR<PropertyCreateWithoutBookingsInput, PropertyUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutBookingsInput
    upsert?: PropertyUpsertWithoutBookingsInput
    connect?: PropertyWhereUniqueInput
    update?: XOR<XOR<PropertyUpdateToOneWithWhereWithoutBookingsInput, PropertyUpdateWithoutBookingsInput>, PropertyUncheckedUpdateWithoutBookingsInput>
  }

  export type BookedRoomUpdateManyWithoutBookingNestedInput = {
    create?: XOR<BookedRoomCreateWithoutBookingInput, BookedRoomUncheckedCreateWithoutBookingInput> | BookedRoomCreateWithoutBookingInput[] | BookedRoomUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: BookedRoomCreateOrConnectWithoutBookingInput | BookedRoomCreateOrConnectWithoutBookingInput[]
    upsert?: BookedRoomUpsertWithWhereUniqueWithoutBookingInput | BookedRoomUpsertWithWhereUniqueWithoutBookingInput[]
    createMany?: BookedRoomCreateManyBookingInputEnvelope
    set?: BookedRoomWhereUniqueInput | BookedRoomWhereUniqueInput[]
    disconnect?: BookedRoomWhereUniqueInput | BookedRoomWhereUniqueInput[]
    delete?: BookedRoomWhereUniqueInput | BookedRoomWhereUniqueInput[]
    connect?: BookedRoomWhereUniqueInput | BookedRoomWhereUniqueInput[]
    update?: BookedRoomUpdateWithWhereUniqueWithoutBookingInput | BookedRoomUpdateWithWhereUniqueWithoutBookingInput[]
    updateMany?: BookedRoomUpdateManyWithWhereWithoutBookingInput | BookedRoomUpdateManyWithWhereWithoutBookingInput[]
    deleteMany?: BookedRoomScalarWhereInput | BookedRoomScalarWhereInput[]
  }

  export type BookedRoomUncheckedUpdateManyWithoutBookingNestedInput = {
    create?: XOR<BookedRoomCreateWithoutBookingInput, BookedRoomUncheckedCreateWithoutBookingInput> | BookedRoomCreateWithoutBookingInput[] | BookedRoomUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: BookedRoomCreateOrConnectWithoutBookingInput | BookedRoomCreateOrConnectWithoutBookingInput[]
    upsert?: BookedRoomUpsertWithWhereUniqueWithoutBookingInput | BookedRoomUpsertWithWhereUniqueWithoutBookingInput[]
    createMany?: BookedRoomCreateManyBookingInputEnvelope
    set?: BookedRoomWhereUniqueInput | BookedRoomWhereUniqueInput[]
    disconnect?: BookedRoomWhereUniqueInput | BookedRoomWhereUniqueInput[]
    delete?: BookedRoomWhereUniqueInput | BookedRoomWhereUniqueInput[]
    connect?: BookedRoomWhereUniqueInput | BookedRoomWhereUniqueInput[]
    update?: BookedRoomUpdateWithWhereUniqueWithoutBookingInput | BookedRoomUpdateWithWhereUniqueWithoutBookingInput[]
    updateMany?: BookedRoomUpdateManyWithWhereWithoutBookingInput | BookedRoomUpdateManyWithWhereWithoutBookingInput[]
    deleteMany?: BookedRoomScalarWhereInput | BookedRoomScalarWhereInput[]
  }

  export type BookingCreateNestedOneWithoutBookedRoomsInput = {
    create?: XOR<BookingCreateWithoutBookedRoomsInput, BookingUncheckedCreateWithoutBookedRoomsInput>
    connectOrCreate?: BookingCreateOrConnectWithoutBookedRoomsInput
    connect?: BookingWhereUniqueInput
  }

  export type RoomTypeCreateNestedOneWithoutBookingsInput = {
    create?: XOR<RoomTypeCreateWithoutBookingsInput, RoomTypeUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: RoomTypeCreateOrConnectWithoutBookingsInput
    connect?: RoomTypeWhereUniqueInput
  }

  export type BookingUpdateOneRequiredWithoutBookedRoomsNestedInput = {
    create?: XOR<BookingCreateWithoutBookedRoomsInput, BookingUncheckedCreateWithoutBookedRoomsInput>
    connectOrCreate?: BookingCreateOrConnectWithoutBookedRoomsInput
    upsert?: BookingUpsertWithoutBookedRoomsInput
    connect?: BookingWhereUniqueInput
    update?: XOR<XOR<BookingUpdateToOneWithWhereWithoutBookedRoomsInput, BookingUpdateWithoutBookedRoomsInput>, BookingUncheckedUpdateWithoutBookedRoomsInput>
  }

  export type RoomTypeUpdateOneRequiredWithoutBookingsNestedInput = {
    create?: XOR<RoomTypeCreateWithoutBookingsInput, RoomTypeUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: RoomTypeCreateOrConnectWithoutBookingsInput
    upsert?: RoomTypeUpsertWithoutBookingsInput
    connect?: RoomTypeWhereUniqueInput
    update?: XOR<XOR<RoomTypeUpdateToOneWithWhereWithoutBookingsInput, RoomTypeUpdateWithoutBookingsInput>, RoomTypeUncheckedUpdateWithoutBookingsInput>
  }

  export type PropertyCreateNestedOneWithoutInventoryInput = {
    create?: XOR<PropertyCreateWithoutInventoryInput, PropertyUncheckedCreateWithoutInventoryInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutInventoryInput
    connect?: PropertyWhereUniqueInput
  }

  export type RoomTypeCreateNestedOneWithoutInventoryInput = {
    create?: XOR<RoomTypeCreateWithoutInventoryInput, RoomTypeUncheckedCreateWithoutInventoryInput>
    connectOrCreate?: RoomTypeCreateOrConnectWithoutInventoryInput
    connect?: RoomTypeWhereUniqueInput
  }

  export type PropertyUpdateOneRequiredWithoutInventoryNestedInput = {
    create?: XOR<PropertyCreateWithoutInventoryInput, PropertyUncheckedCreateWithoutInventoryInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutInventoryInput
    upsert?: PropertyUpsertWithoutInventoryInput
    connect?: PropertyWhereUniqueInput
    update?: XOR<XOR<PropertyUpdateToOneWithWhereWithoutInventoryInput, PropertyUpdateWithoutInventoryInput>, PropertyUncheckedUpdateWithoutInventoryInput>
  }

  export type RoomTypeUpdateOneRequiredWithoutInventoryNestedInput = {
    create?: XOR<RoomTypeCreateWithoutInventoryInput, RoomTypeUncheckedCreateWithoutInventoryInput>
    connectOrCreate?: RoomTypeCreateOrConnectWithoutInventoryInput
    upsert?: RoomTypeUpsertWithoutInventoryInput
    connect?: RoomTypeWhereUniqueInput
    update?: XOR<XOR<RoomTypeUpdateToOneWithWhereWithoutInventoryInput, RoomTypeUpdateWithoutInventoryInput>, RoomTypeUncheckedUpdateWithoutInventoryInput>
  }

  export type PropertyCreateNestedOneWithoutRatesInput = {
    create?: XOR<PropertyCreateWithoutRatesInput, PropertyUncheckedCreateWithoutRatesInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutRatesInput
    connect?: PropertyWhereUniqueInput
  }

  export type RoomTypeCreateNestedOneWithoutRatesInput = {
    create?: XOR<RoomTypeCreateWithoutRatesInput, RoomTypeUncheckedCreateWithoutRatesInput>
    connectOrCreate?: RoomTypeCreateOrConnectWithoutRatesInput
    connect?: RoomTypeWhereUniqueInput
  }

  export type PropertyUpdateOneRequiredWithoutRatesNestedInput = {
    create?: XOR<PropertyCreateWithoutRatesInput, PropertyUncheckedCreateWithoutRatesInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutRatesInput
    upsert?: PropertyUpsertWithoutRatesInput
    connect?: PropertyWhereUniqueInput
    update?: XOR<XOR<PropertyUpdateToOneWithWhereWithoutRatesInput, PropertyUpdateWithoutRatesInput>, PropertyUncheckedUpdateWithoutRatesInput>
  }

  export type RoomTypeUpdateOneRequiredWithoutRatesNestedInput = {
    create?: XOR<RoomTypeCreateWithoutRatesInput, RoomTypeUncheckedCreateWithoutRatesInput>
    connectOrCreate?: RoomTypeCreateOrConnectWithoutRatesInput
    upsert?: RoomTypeUpsertWithoutRatesInput
    connect?: RoomTypeWhereUniqueInput
    update?: XOR<XOR<RoomTypeUpdateToOneWithWhereWithoutRatesInput, RoomTypeUpdateWithoutRatesInput>, RoomTypeUncheckedUpdateWithoutRatesInput>
  }

  export type PropertyCreateNestedOneWithoutPromotionsInput = {
    create?: XOR<PropertyCreateWithoutPromotionsInput, PropertyUncheckedCreateWithoutPromotionsInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutPromotionsInput
    connect?: PropertyWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PropertyUpdateOneRequiredWithoutPromotionsNestedInput = {
    create?: XOR<PropertyCreateWithoutPromotionsInput, PropertyUncheckedCreateWithoutPromotionsInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutPromotionsInput
    upsert?: PropertyUpsertWithoutPromotionsInput
    connect?: PropertyWhereUniqueInput
    update?: XOR<XOR<PropertyUpdateToOneWithWhereWithoutPromotionsInput, PropertyUpdateWithoutPromotionsInput>, PropertyUncheckedUpdateWithoutPromotionsInput>
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
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

  export type RoomTypeCreateWithoutPropertyInput = {
    id?: string
    name: string
    description: string
    category: string
    maxOccupancy: number
    bedConfiguration: JsonNullValueInput | InputJsonValue
    roomSize: number
    roomSizeUnit: string
    amenities: JsonNullValueInput | InputJsonValue
    view?: string | null
    floor?: string | null
    totalRooms: number
    baseRate: number
    currency: string
    images: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    bookings?: BookedRoomCreateNestedManyWithoutRoomTypeInput
    inventory?: InventoryRecordCreateNestedManyWithoutRoomTypeInput
    rates?: RateRecordCreateNestedManyWithoutRoomTypeInput
  }

  export type RoomTypeUncheckedCreateWithoutPropertyInput = {
    id?: string
    name: string
    description: string
    category: string
    maxOccupancy: number
    bedConfiguration: JsonNullValueInput | InputJsonValue
    roomSize: number
    roomSizeUnit: string
    amenities: JsonNullValueInput | InputJsonValue
    view?: string | null
    floor?: string | null
    totalRooms: number
    baseRate: number
    currency: string
    images: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    bookings?: BookedRoomUncheckedCreateNestedManyWithoutRoomTypeInput
    inventory?: InventoryRecordUncheckedCreateNestedManyWithoutRoomTypeInput
    rates?: RateRecordUncheckedCreateNestedManyWithoutRoomTypeInput
  }

  export type RoomTypeCreateOrConnectWithoutPropertyInput = {
    where: RoomTypeWhereUniqueInput
    create: XOR<RoomTypeCreateWithoutPropertyInput, RoomTypeUncheckedCreateWithoutPropertyInput>
  }

  export type RoomTypeCreateManyPropertyInputEnvelope = {
    data: RoomTypeCreateManyPropertyInput | RoomTypeCreateManyPropertyInput[]
    skipDuplicates?: boolean
  }

  export type BookingCreateWithoutPropertyInput = {
    id?: string
    confirmationNumber: string
    guestId: string
    primaryGuest: JsonNullValueInput | InputJsonValue
    additionalGuests: JsonNullValueInput | InputJsonValue
    checkInDate: Date | string
    checkOutDate: Date | string
    nights: number
    rooms: JsonNullValueInput | InputJsonValue
    pricing: JsonNullValueInput | InputJsonValue
    totalAmount: number
    currency: string
    status?: string
    bookingSource: string
    specialRequests?: string | null
    preferences: JsonNullValueInput | InputJsonValue
    paymentStatus?: string
    paymentMethod?: string | null
    cancellationPolicy: string
    noShowPolicy: string
    bookedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    bookedRooms?: BookedRoomCreateNestedManyWithoutBookingInput
  }

  export type BookingUncheckedCreateWithoutPropertyInput = {
    id?: string
    confirmationNumber: string
    guestId: string
    primaryGuest: JsonNullValueInput | InputJsonValue
    additionalGuests: JsonNullValueInput | InputJsonValue
    checkInDate: Date | string
    checkOutDate: Date | string
    nights: number
    rooms: JsonNullValueInput | InputJsonValue
    pricing: JsonNullValueInput | InputJsonValue
    totalAmount: number
    currency: string
    status?: string
    bookingSource: string
    specialRequests?: string | null
    preferences: JsonNullValueInput | InputJsonValue
    paymentStatus?: string
    paymentMethod?: string | null
    cancellationPolicy: string
    noShowPolicy: string
    bookedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    bookedRooms?: BookedRoomUncheckedCreateNestedManyWithoutBookingInput
  }

  export type BookingCreateOrConnectWithoutPropertyInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutPropertyInput, BookingUncheckedCreateWithoutPropertyInput>
  }

  export type BookingCreateManyPropertyInputEnvelope = {
    data: BookingCreateManyPropertyInput | BookingCreateManyPropertyInput[]
    skipDuplicates?: boolean
  }

  export type InventoryRecordCreateWithoutPropertyInput = {
    id?: string
    date: Date | string
    totalRooms: number
    availableRooms: number
    reservedRooms: number
    blockedRooms?: number
    overbookingLimit?: number
    minimumStay?: number | null
    maximumStay?: number | null
    closedToArrival?: boolean
    closedToDeparture?: boolean
    stopSell?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    roomType: RoomTypeCreateNestedOneWithoutInventoryInput
  }

  export type InventoryRecordUncheckedCreateWithoutPropertyInput = {
    id?: string
    roomTypeId: string
    date: Date | string
    totalRooms: number
    availableRooms: number
    reservedRooms: number
    blockedRooms?: number
    overbookingLimit?: number
    minimumStay?: number | null
    maximumStay?: number | null
    closedToArrival?: boolean
    closedToDeparture?: boolean
    stopSell?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryRecordCreateOrConnectWithoutPropertyInput = {
    where: InventoryRecordWhereUniqueInput
    create: XOR<InventoryRecordCreateWithoutPropertyInput, InventoryRecordUncheckedCreateWithoutPropertyInput>
  }

  export type InventoryRecordCreateManyPropertyInputEnvelope = {
    data: InventoryRecordCreateManyPropertyInput | InventoryRecordCreateManyPropertyInput[]
    skipDuplicates?: boolean
  }

  export type RateRecordCreateWithoutPropertyInput = {
    id?: string
    date: Date | string
    rate: number
    currency: string
    rateType?: string
    minimumStay?: number | null
    maximumStay?: number | null
    advanceBookingDays?: number | null
    restrictions?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    roomType: RoomTypeCreateNestedOneWithoutRatesInput
  }

  export type RateRecordUncheckedCreateWithoutPropertyInput = {
    id?: string
    roomTypeId: string
    date: Date | string
    rate: number
    currency: string
    rateType?: string
    minimumStay?: number | null
    maximumStay?: number | null
    advanceBookingDays?: number | null
    restrictions?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RateRecordCreateOrConnectWithoutPropertyInput = {
    where: RateRecordWhereUniqueInput
    create: XOR<RateRecordCreateWithoutPropertyInput, RateRecordUncheckedCreateWithoutPropertyInput>
  }

  export type RateRecordCreateManyPropertyInputEnvelope = {
    data: RateRecordCreateManyPropertyInput | RateRecordCreateManyPropertyInput[]
    skipDuplicates?: boolean
  }

  export type PromotionCreateWithoutPropertyInput = {
    id?: string
    code?: string | null
    name: string
    description: string
    type: string
    discountType: string
    discountValue: number
    maxDiscount?: number | null
    validFrom: Date | string
    validTo: Date | string
    conditions: JsonNullValueInput | InputJsonValue
    usage: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PromotionUncheckedCreateWithoutPropertyInput = {
    id?: string
    code?: string | null
    name: string
    description: string
    type: string
    discountType: string
    discountValue: number
    maxDiscount?: number | null
    validFrom: Date | string
    validTo: Date | string
    conditions: JsonNullValueInput | InputJsonValue
    usage: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PromotionCreateOrConnectWithoutPropertyInput = {
    where: PromotionWhereUniqueInput
    create: XOR<PromotionCreateWithoutPropertyInput, PromotionUncheckedCreateWithoutPropertyInput>
  }

  export type PromotionCreateManyPropertyInputEnvelope = {
    data: PromotionCreateManyPropertyInput | PromotionCreateManyPropertyInput[]
    skipDuplicates?: boolean
  }

  export type RoomTypeUpsertWithWhereUniqueWithoutPropertyInput = {
    where: RoomTypeWhereUniqueInput
    update: XOR<RoomTypeUpdateWithoutPropertyInput, RoomTypeUncheckedUpdateWithoutPropertyInput>
    create: XOR<RoomTypeCreateWithoutPropertyInput, RoomTypeUncheckedCreateWithoutPropertyInput>
  }

  export type RoomTypeUpdateWithWhereUniqueWithoutPropertyInput = {
    where: RoomTypeWhereUniqueInput
    data: XOR<RoomTypeUpdateWithoutPropertyInput, RoomTypeUncheckedUpdateWithoutPropertyInput>
  }

  export type RoomTypeUpdateManyWithWhereWithoutPropertyInput = {
    where: RoomTypeScalarWhereInput
    data: XOR<RoomTypeUpdateManyMutationInput, RoomTypeUncheckedUpdateManyWithoutPropertyInput>
  }

  export type RoomTypeScalarWhereInput = {
    AND?: RoomTypeScalarWhereInput | RoomTypeScalarWhereInput[]
    OR?: RoomTypeScalarWhereInput[]
    NOT?: RoomTypeScalarWhereInput | RoomTypeScalarWhereInput[]
    id?: StringFilter<"RoomType"> | string
    propertyId?: StringFilter<"RoomType"> | string
    name?: StringFilter<"RoomType"> | string
    description?: StringFilter<"RoomType"> | string
    category?: StringFilter<"RoomType"> | string
    maxOccupancy?: IntFilter<"RoomType"> | number
    bedConfiguration?: JsonFilter<"RoomType">
    roomSize?: FloatFilter<"RoomType"> | number
    roomSizeUnit?: StringFilter<"RoomType"> | string
    amenities?: JsonFilter<"RoomType">
    view?: StringNullableFilter<"RoomType"> | string | null
    floor?: StringNullableFilter<"RoomType"> | string | null
    totalRooms?: IntFilter<"RoomType"> | number
    baseRate?: FloatFilter<"RoomType"> | number
    currency?: StringFilter<"RoomType"> | string
    images?: JsonFilter<"RoomType">
    isActive?: BoolFilter<"RoomType"> | boolean
    createdAt?: DateTimeFilter<"RoomType"> | Date | string
    updatedAt?: DateTimeFilter<"RoomType"> | Date | string
  }

  export type BookingUpsertWithWhereUniqueWithoutPropertyInput = {
    where: BookingWhereUniqueInput
    update: XOR<BookingUpdateWithoutPropertyInput, BookingUncheckedUpdateWithoutPropertyInput>
    create: XOR<BookingCreateWithoutPropertyInput, BookingUncheckedCreateWithoutPropertyInput>
  }

  export type BookingUpdateWithWhereUniqueWithoutPropertyInput = {
    where: BookingWhereUniqueInput
    data: XOR<BookingUpdateWithoutPropertyInput, BookingUncheckedUpdateWithoutPropertyInput>
  }

  export type BookingUpdateManyWithWhereWithoutPropertyInput = {
    where: BookingScalarWhereInput
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyWithoutPropertyInput>
  }

  export type BookingScalarWhereInput = {
    AND?: BookingScalarWhereInput | BookingScalarWhereInput[]
    OR?: BookingScalarWhereInput[]
    NOT?: BookingScalarWhereInput | BookingScalarWhereInput[]
    id?: StringFilter<"Booking"> | string
    confirmationNumber?: StringFilter<"Booking"> | string
    propertyId?: StringFilter<"Booking"> | string
    guestId?: StringFilter<"Booking"> | string
    primaryGuest?: JsonFilter<"Booking">
    additionalGuests?: JsonFilter<"Booking">
    checkInDate?: DateTimeFilter<"Booking"> | Date | string
    checkOutDate?: DateTimeFilter<"Booking"> | Date | string
    nights?: IntFilter<"Booking"> | number
    rooms?: JsonFilter<"Booking">
    pricing?: JsonFilter<"Booking">
    totalAmount?: FloatFilter<"Booking"> | number
    currency?: StringFilter<"Booking"> | string
    status?: StringFilter<"Booking"> | string
    bookingSource?: StringFilter<"Booking"> | string
    specialRequests?: StringNullableFilter<"Booking"> | string | null
    preferences?: JsonFilter<"Booking">
    paymentStatus?: StringFilter<"Booking"> | string
    paymentMethod?: StringNullableFilter<"Booking"> | string | null
    cancellationPolicy?: StringFilter<"Booking"> | string
    noShowPolicy?: StringFilter<"Booking"> | string
    bookedAt?: DateTimeFilter<"Booking"> | Date | string
    createdAt?: DateTimeFilter<"Booking"> | Date | string
    updatedAt?: DateTimeFilter<"Booking"> | Date | string
    metadata?: JsonNullableFilter<"Booking">
  }

  export type InventoryRecordUpsertWithWhereUniqueWithoutPropertyInput = {
    where: InventoryRecordWhereUniqueInput
    update: XOR<InventoryRecordUpdateWithoutPropertyInput, InventoryRecordUncheckedUpdateWithoutPropertyInput>
    create: XOR<InventoryRecordCreateWithoutPropertyInput, InventoryRecordUncheckedCreateWithoutPropertyInput>
  }

  export type InventoryRecordUpdateWithWhereUniqueWithoutPropertyInput = {
    where: InventoryRecordWhereUniqueInput
    data: XOR<InventoryRecordUpdateWithoutPropertyInput, InventoryRecordUncheckedUpdateWithoutPropertyInput>
  }

  export type InventoryRecordUpdateManyWithWhereWithoutPropertyInput = {
    where: InventoryRecordScalarWhereInput
    data: XOR<InventoryRecordUpdateManyMutationInput, InventoryRecordUncheckedUpdateManyWithoutPropertyInput>
  }

  export type InventoryRecordScalarWhereInput = {
    AND?: InventoryRecordScalarWhereInput | InventoryRecordScalarWhereInput[]
    OR?: InventoryRecordScalarWhereInput[]
    NOT?: InventoryRecordScalarWhereInput | InventoryRecordScalarWhereInput[]
    id?: StringFilter<"InventoryRecord"> | string
    propertyId?: StringFilter<"InventoryRecord"> | string
    roomTypeId?: StringFilter<"InventoryRecord"> | string
    date?: DateTimeFilter<"InventoryRecord"> | Date | string
    totalRooms?: IntFilter<"InventoryRecord"> | number
    availableRooms?: IntFilter<"InventoryRecord"> | number
    reservedRooms?: IntFilter<"InventoryRecord"> | number
    blockedRooms?: IntFilter<"InventoryRecord"> | number
    overbookingLimit?: IntFilter<"InventoryRecord"> | number
    minimumStay?: IntNullableFilter<"InventoryRecord"> | number | null
    maximumStay?: IntNullableFilter<"InventoryRecord"> | number | null
    closedToArrival?: BoolFilter<"InventoryRecord"> | boolean
    closedToDeparture?: BoolFilter<"InventoryRecord"> | boolean
    stopSell?: BoolFilter<"InventoryRecord"> | boolean
    createdAt?: DateTimeFilter<"InventoryRecord"> | Date | string
    updatedAt?: DateTimeFilter<"InventoryRecord"> | Date | string
  }

  export type RateRecordUpsertWithWhereUniqueWithoutPropertyInput = {
    where: RateRecordWhereUniqueInput
    update: XOR<RateRecordUpdateWithoutPropertyInput, RateRecordUncheckedUpdateWithoutPropertyInput>
    create: XOR<RateRecordCreateWithoutPropertyInput, RateRecordUncheckedCreateWithoutPropertyInput>
  }

  export type RateRecordUpdateWithWhereUniqueWithoutPropertyInput = {
    where: RateRecordWhereUniqueInput
    data: XOR<RateRecordUpdateWithoutPropertyInput, RateRecordUncheckedUpdateWithoutPropertyInput>
  }

  export type RateRecordUpdateManyWithWhereWithoutPropertyInput = {
    where: RateRecordScalarWhereInput
    data: XOR<RateRecordUpdateManyMutationInput, RateRecordUncheckedUpdateManyWithoutPropertyInput>
  }

  export type RateRecordScalarWhereInput = {
    AND?: RateRecordScalarWhereInput | RateRecordScalarWhereInput[]
    OR?: RateRecordScalarWhereInput[]
    NOT?: RateRecordScalarWhereInput | RateRecordScalarWhereInput[]
    id?: StringFilter<"RateRecord"> | string
    propertyId?: StringFilter<"RateRecord"> | string
    roomTypeId?: StringFilter<"RateRecord"> | string
    date?: DateTimeFilter<"RateRecord"> | Date | string
    rate?: FloatFilter<"RateRecord"> | number
    currency?: StringFilter<"RateRecord"> | string
    rateType?: StringFilter<"RateRecord"> | string
    minimumStay?: IntNullableFilter<"RateRecord"> | number | null
    maximumStay?: IntNullableFilter<"RateRecord"> | number | null
    advanceBookingDays?: IntNullableFilter<"RateRecord"> | number | null
    restrictions?: JsonNullableFilter<"RateRecord">
    createdAt?: DateTimeFilter<"RateRecord"> | Date | string
    updatedAt?: DateTimeFilter<"RateRecord"> | Date | string
  }

  export type PromotionUpsertWithWhereUniqueWithoutPropertyInput = {
    where: PromotionWhereUniqueInput
    update: XOR<PromotionUpdateWithoutPropertyInput, PromotionUncheckedUpdateWithoutPropertyInput>
    create: XOR<PromotionCreateWithoutPropertyInput, PromotionUncheckedCreateWithoutPropertyInput>
  }

  export type PromotionUpdateWithWhereUniqueWithoutPropertyInput = {
    where: PromotionWhereUniqueInput
    data: XOR<PromotionUpdateWithoutPropertyInput, PromotionUncheckedUpdateWithoutPropertyInput>
  }

  export type PromotionUpdateManyWithWhereWithoutPropertyInput = {
    where: PromotionScalarWhereInput
    data: XOR<PromotionUpdateManyMutationInput, PromotionUncheckedUpdateManyWithoutPropertyInput>
  }

  export type PromotionScalarWhereInput = {
    AND?: PromotionScalarWhereInput | PromotionScalarWhereInput[]
    OR?: PromotionScalarWhereInput[]
    NOT?: PromotionScalarWhereInput | PromotionScalarWhereInput[]
    id?: StringFilter<"Promotion"> | string
    propertyId?: StringFilter<"Promotion"> | string
    code?: StringNullableFilter<"Promotion"> | string | null
    name?: StringFilter<"Promotion"> | string
    description?: StringFilter<"Promotion"> | string
    type?: StringFilter<"Promotion"> | string
    discountType?: StringFilter<"Promotion"> | string
    discountValue?: FloatFilter<"Promotion"> | number
    maxDiscount?: FloatNullableFilter<"Promotion"> | number | null
    validFrom?: DateTimeFilter<"Promotion"> | Date | string
    validTo?: DateTimeFilter<"Promotion"> | Date | string
    conditions?: JsonFilter<"Promotion">
    usage?: JsonFilter<"Promotion">
    isActive?: BoolFilter<"Promotion"> | boolean
    createdAt?: DateTimeFilter<"Promotion"> | Date | string
    updatedAt?: DateTimeFilter<"Promotion"> | Date | string
  }

  export type PropertyCreateWithoutRoomTypesInput = {
    id?: string
    name: string
    description: string
    category: string
    address: JsonNullValueInput | InputJsonValue
    coordinates: JsonNullValueInput | InputJsonValue
    timezone: string
    starRating?: number | null
    amenities: JsonNullValueInput | InputJsonValue
    policies: JsonNullValueInput | InputJsonValue
    contactInfo: JsonNullValueInput | InputJsonValue
    images: JsonNullValueInput | InputJsonValue
    virtualTour?: string | null
    ownerId: string
    chainId?: string | null
    brandId?: string | null
    status?: string
    settings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    bookings?: BookingCreateNestedManyWithoutPropertyInput
    inventory?: InventoryRecordCreateNestedManyWithoutPropertyInput
    rates?: RateRecordCreateNestedManyWithoutPropertyInput
    promotions?: PromotionCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUncheckedCreateWithoutRoomTypesInput = {
    id?: string
    name: string
    description: string
    category: string
    address: JsonNullValueInput | InputJsonValue
    coordinates: JsonNullValueInput | InputJsonValue
    timezone: string
    starRating?: number | null
    amenities: JsonNullValueInput | InputJsonValue
    policies: JsonNullValueInput | InputJsonValue
    contactInfo: JsonNullValueInput | InputJsonValue
    images: JsonNullValueInput | InputJsonValue
    virtualTour?: string | null
    ownerId: string
    chainId?: string | null
    brandId?: string | null
    status?: string
    settings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    bookings?: BookingUncheckedCreateNestedManyWithoutPropertyInput
    inventory?: InventoryRecordUncheckedCreateNestedManyWithoutPropertyInput
    rates?: RateRecordUncheckedCreateNestedManyWithoutPropertyInput
    promotions?: PromotionUncheckedCreateNestedManyWithoutPropertyInput
  }

  export type PropertyCreateOrConnectWithoutRoomTypesInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutRoomTypesInput, PropertyUncheckedCreateWithoutRoomTypesInput>
  }

  export type BookedRoomCreateWithoutRoomTypeInput = {
    id?: string
    roomNumber?: string | null
    quantity: number
    guestCount: number
    rate: number
    totalPrice: number
    guests: JsonNullValueInput | InputJsonValue
    booking: BookingCreateNestedOneWithoutBookedRoomsInput
  }

  export type BookedRoomUncheckedCreateWithoutRoomTypeInput = {
    id?: string
    bookingId: string
    roomNumber?: string | null
    quantity: number
    guestCount: number
    rate: number
    totalPrice: number
    guests: JsonNullValueInput | InputJsonValue
  }

  export type BookedRoomCreateOrConnectWithoutRoomTypeInput = {
    where: BookedRoomWhereUniqueInput
    create: XOR<BookedRoomCreateWithoutRoomTypeInput, BookedRoomUncheckedCreateWithoutRoomTypeInput>
  }

  export type BookedRoomCreateManyRoomTypeInputEnvelope = {
    data: BookedRoomCreateManyRoomTypeInput | BookedRoomCreateManyRoomTypeInput[]
    skipDuplicates?: boolean
  }

  export type InventoryRecordCreateWithoutRoomTypeInput = {
    id?: string
    date: Date | string
    totalRooms: number
    availableRooms: number
    reservedRooms: number
    blockedRooms?: number
    overbookingLimit?: number
    minimumStay?: number | null
    maximumStay?: number | null
    closedToArrival?: boolean
    closedToDeparture?: boolean
    stopSell?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    property: PropertyCreateNestedOneWithoutInventoryInput
  }

  export type InventoryRecordUncheckedCreateWithoutRoomTypeInput = {
    id?: string
    propertyId: string
    date: Date | string
    totalRooms: number
    availableRooms: number
    reservedRooms: number
    blockedRooms?: number
    overbookingLimit?: number
    minimumStay?: number | null
    maximumStay?: number | null
    closedToArrival?: boolean
    closedToDeparture?: boolean
    stopSell?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryRecordCreateOrConnectWithoutRoomTypeInput = {
    where: InventoryRecordWhereUniqueInput
    create: XOR<InventoryRecordCreateWithoutRoomTypeInput, InventoryRecordUncheckedCreateWithoutRoomTypeInput>
  }

  export type InventoryRecordCreateManyRoomTypeInputEnvelope = {
    data: InventoryRecordCreateManyRoomTypeInput | InventoryRecordCreateManyRoomTypeInput[]
    skipDuplicates?: boolean
  }

  export type RateRecordCreateWithoutRoomTypeInput = {
    id?: string
    date: Date | string
    rate: number
    currency: string
    rateType?: string
    minimumStay?: number | null
    maximumStay?: number | null
    advanceBookingDays?: number | null
    restrictions?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    property: PropertyCreateNestedOneWithoutRatesInput
  }

  export type RateRecordUncheckedCreateWithoutRoomTypeInput = {
    id?: string
    propertyId: string
    date: Date | string
    rate: number
    currency: string
    rateType?: string
    minimumStay?: number | null
    maximumStay?: number | null
    advanceBookingDays?: number | null
    restrictions?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RateRecordCreateOrConnectWithoutRoomTypeInput = {
    where: RateRecordWhereUniqueInput
    create: XOR<RateRecordCreateWithoutRoomTypeInput, RateRecordUncheckedCreateWithoutRoomTypeInput>
  }

  export type RateRecordCreateManyRoomTypeInputEnvelope = {
    data: RateRecordCreateManyRoomTypeInput | RateRecordCreateManyRoomTypeInput[]
    skipDuplicates?: boolean
  }

  export type PropertyUpsertWithoutRoomTypesInput = {
    update: XOR<PropertyUpdateWithoutRoomTypesInput, PropertyUncheckedUpdateWithoutRoomTypesInput>
    create: XOR<PropertyCreateWithoutRoomTypesInput, PropertyUncheckedCreateWithoutRoomTypesInput>
    where?: PropertyWhereInput
  }

  export type PropertyUpdateToOneWithWhereWithoutRoomTypesInput = {
    where?: PropertyWhereInput
    data: XOR<PropertyUpdateWithoutRoomTypesInput, PropertyUncheckedUpdateWithoutRoomTypesInput>
  }

  export type PropertyUpdateWithoutRoomTypesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    address?: JsonNullValueInput | InputJsonValue
    coordinates?: JsonNullValueInput | InputJsonValue
    timezone?: StringFieldUpdateOperationsInput | string
    starRating?: NullableIntFieldUpdateOperationsInput | number | null
    amenities?: JsonNullValueInput | InputJsonValue
    policies?: JsonNullValueInput | InputJsonValue
    contactInfo?: JsonNullValueInput | InputJsonValue
    images?: JsonNullValueInput | InputJsonValue
    virtualTour?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    chainId?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookings?: BookingUpdateManyWithoutPropertyNestedInput
    inventory?: InventoryRecordUpdateManyWithoutPropertyNestedInput
    rates?: RateRecordUpdateManyWithoutPropertyNestedInput
    promotions?: PromotionUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateWithoutRoomTypesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    address?: JsonNullValueInput | InputJsonValue
    coordinates?: JsonNullValueInput | InputJsonValue
    timezone?: StringFieldUpdateOperationsInput | string
    starRating?: NullableIntFieldUpdateOperationsInput | number | null
    amenities?: JsonNullValueInput | InputJsonValue
    policies?: JsonNullValueInput | InputJsonValue
    contactInfo?: JsonNullValueInput | InputJsonValue
    images?: JsonNullValueInput | InputJsonValue
    virtualTour?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    chainId?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookings?: BookingUncheckedUpdateManyWithoutPropertyNestedInput
    inventory?: InventoryRecordUncheckedUpdateManyWithoutPropertyNestedInput
    rates?: RateRecordUncheckedUpdateManyWithoutPropertyNestedInput
    promotions?: PromotionUncheckedUpdateManyWithoutPropertyNestedInput
  }

  export type BookedRoomUpsertWithWhereUniqueWithoutRoomTypeInput = {
    where: BookedRoomWhereUniqueInput
    update: XOR<BookedRoomUpdateWithoutRoomTypeInput, BookedRoomUncheckedUpdateWithoutRoomTypeInput>
    create: XOR<BookedRoomCreateWithoutRoomTypeInput, BookedRoomUncheckedCreateWithoutRoomTypeInput>
  }

  export type BookedRoomUpdateWithWhereUniqueWithoutRoomTypeInput = {
    where: BookedRoomWhereUniqueInput
    data: XOR<BookedRoomUpdateWithoutRoomTypeInput, BookedRoomUncheckedUpdateWithoutRoomTypeInput>
  }

  export type BookedRoomUpdateManyWithWhereWithoutRoomTypeInput = {
    where: BookedRoomScalarWhereInput
    data: XOR<BookedRoomUpdateManyMutationInput, BookedRoomUncheckedUpdateManyWithoutRoomTypeInput>
  }

  export type BookedRoomScalarWhereInput = {
    AND?: BookedRoomScalarWhereInput | BookedRoomScalarWhereInput[]
    OR?: BookedRoomScalarWhereInput[]
    NOT?: BookedRoomScalarWhereInput | BookedRoomScalarWhereInput[]
    id?: StringFilter<"BookedRoom"> | string
    bookingId?: StringFilter<"BookedRoom"> | string
    roomTypeId?: StringFilter<"BookedRoom"> | string
    roomNumber?: StringNullableFilter<"BookedRoom"> | string | null
    quantity?: IntFilter<"BookedRoom"> | number
    guestCount?: IntFilter<"BookedRoom"> | number
    rate?: FloatFilter<"BookedRoom"> | number
    totalPrice?: FloatFilter<"BookedRoom"> | number
    guests?: JsonFilter<"BookedRoom">
  }

  export type InventoryRecordUpsertWithWhereUniqueWithoutRoomTypeInput = {
    where: InventoryRecordWhereUniqueInput
    update: XOR<InventoryRecordUpdateWithoutRoomTypeInput, InventoryRecordUncheckedUpdateWithoutRoomTypeInput>
    create: XOR<InventoryRecordCreateWithoutRoomTypeInput, InventoryRecordUncheckedCreateWithoutRoomTypeInput>
  }

  export type InventoryRecordUpdateWithWhereUniqueWithoutRoomTypeInput = {
    where: InventoryRecordWhereUniqueInput
    data: XOR<InventoryRecordUpdateWithoutRoomTypeInput, InventoryRecordUncheckedUpdateWithoutRoomTypeInput>
  }

  export type InventoryRecordUpdateManyWithWhereWithoutRoomTypeInput = {
    where: InventoryRecordScalarWhereInput
    data: XOR<InventoryRecordUpdateManyMutationInput, InventoryRecordUncheckedUpdateManyWithoutRoomTypeInput>
  }

  export type RateRecordUpsertWithWhereUniqueWithoutRoomTypeInput = {
    where: RateRecordWhereUniqueInput
    update: XOR<RateRecordUpdateWithoutRoomTypeInput, RateRecordUncheckedUpdateWithoutRoomTypeInput>
    create: XOR<RateRecordCreateWithoutRoomTypeInput, RateRecordUncheckedCreateWithoutRoomTypeInput>
  }

  export type RateRecordUpdateWithWhereUniqueWithoutRoomTypeInput = {
    where: RateRecordWhereUniqueInput
    data: XOR<RateRecordUpdateWithoutRoomTypeInput, RateRecordUncheckedUpdateWithoutRoomTypeInput>
  }

  export type RateRecordUpdateManyWithWhereWithoutRoomTypeInput = {
    where: RateRecordScalarWhereInput
    data: XOR<RateRecordUpdateManyMutationInput, RateRecordUncheckedUpdateManyWithoutRoomTypeInput>
  }

  export type PropertyCreateWithoutBookingsInput = {
    id?: string
    name: string
    description: string
    category: string
    address: JsonNullValueInput | InputJsonValue
    coordinates: JsonNullValueInput | InputJsonValue
    timezone: string
    starRating?: number | null
    amenities: JsonNullValueInput | InputJsonValue
    policies: JsonNullValueInput | InputJsonValue
    contactInfo: JsonNullValueInput | InputJsonValue
    images: JsonNullValueInput | InputJsonValue
    virtualTour?: string | null
    ownerId: string
    chainId?: string | null
    brandId?: string | null
    status?: string
    settings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    roomTypes?: RoomTypeCreateNestedManyWithoutPropertyInput
    inventory?: InventoryRecordCreateNestedManyWithoutPropertyInput
    rates?: RateRecordCreateNestedManyWithoutPropertyInput
    promotions?: PromotionCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUncheckedCreateWithoutBookingsInput = {
    id?: string
    name: string
    description: string
    category: string
    address: JsonNullValueInput | InputJsonValue
    coordinates: JsonNullValueInput | InputJsonValue
    timezone: string
    starRating?: number | null
    amenities: JsonNullValueInput | InputJsonValue
    policies: JsonNullValueInput | InputJsonValue
    contactInfo: JsonNullValueInput | InputJsonValue
    images: JsonNullValueInput | InputJsonValue
    virtualTour?: string | null
    ownerId: string
    chainId?: string | null
    brandId?: string | null
    status?: string
    settings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    roomTypes?: RoomTypeUncheckedCreateNestedManyWithoutPropertyInput
    inventory?: InventoryRecordUncheckedCreateNestedManyWithoutPropertyInput
    rates?: RateRecordUncheckedCreateNestedManyWithoutPropertyInput
    promotions?: PromotionUncheckedCreateNestedManyWithoutPropertyInput
  }

  export type PropertyCreateOrConnectWithoutBookingsInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutBookingsInput, PropertyUncheckedCreateWithoutBookingsInput>
  }

  export type BookedRoomCreateWithoutBookingInput = {
    id?: string
    roomNumber?: string | null
    quantity: number
    guestCount: number
    rate: number
    totalPrice: number
    guests: JsonNullValueInput | InputJsonValue
    roomType: RoomTypeCreateNestedOneWithoutBookingsInput
  }

  export type BookedRoomUncheckedCreateWithoutBookingInput = {
    id?: string
    roomTypeId: string
    roomNumber?: string | null
    quantity: number
    guestCount: number
    rate: number
    totalPrice: number
    guests: JsonNullValueInput | InputJsonValue
  }

  export type BookedRoomCreateOrConnectWithoutBookingInput = {
    where: BookedRoomWhereUniqueInput
    create: XOR<BookedRoomCreateWithoutBookingInput, BookedRoomUncheckedCreateWithoutBookingInput>
  }

  export type BookedRoomCreateManyBookingInputEnvelope = {
    data: BookedRoomCreateManyBookingInput | BookedRoomCreateManyBookingInput[]
    skipDuplicates?: boolean
  }

  export type PropertyUpsertWithoutBookingsInput = {
    update: XOR<PropertyUpdateWithoutBookingsInput, PropertyUncheckedUpdateWithoutBookingsInput>
    create: XOR<PropertyCreateWithoutBookingsInput, PropertyUncheckedCreateWithoutBookingsInput>
    where?: PropertyWhereInput
  }

  export type PropertyUpdateToOneWithWhereWithoutBookingsInput = {
    where?: PropertyWhereInput
    data: XOR<PropertyUpdateWithoutBookingsInput, PropertyUncheckedUpdateWithoutBookingsInput>
  }

  export type PropertyUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    address?: JsonNullValueInput | InputJsonValue
    coordinates?: JsonNullValueInput | InputJsonValue
    timezone?: StringFieldUpdateOperationsInput | string
    starRating?: NullableIntFieldUpdateOperationsInput | number | null
    amenities?: JsonNullValueInput | InputJsonValue
    policies?: JsonNullValueInput | InputJsonValue
    contactInfo?: JsonNullValueInput | InputJsonValue
    images?: JsonNullValueInput | InputJsonValue
    virtualTour?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    chainId?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roomTypes?: RoomTypeUpdateManyWithoutPropertyNestedInput
    inventory?: InventoryRecordUpdateManyWithoutPropertyNestedInput
    rates?: RateRecordUpdateManyWithoutPropertyNestedInput
    promotions?: PromotionUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    address?: JsonNullValueInput | InputJsonValue
    coordinates?: JsonNullValueInput | InputJsonValue
    timezone?: StringFieldUpdateOperationsInput | string
    starRating?: NullableIntFieldUpdateOperationsInput | number | null
    amenities?: JsonNullValueInput | InputJsonValue
    policies?: JsonNullValueInput | InputJsonValue
    contactInfo?: JsonNullValueInput | InputJsonValue
    images?: JsonNullValueInput | InputJsonValue
    virtualTour?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    chainId?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roomTypes?: RoomTypeUncheckedUpdateManyWithoutPropertyNestedInput
    inventory?: InventoryRecordUncheckedUpdateManyWithoutPropertyNestedInput
    rates?: RateRecordUncheckedUpdateManyWithoutPropertyNestedInput
    promotions?: PromotionUncheckedUpdateManyWithoutPropertyNestedInput
  }

  export type BookedRoomUpsertWithWhereUniqueWithoutBookingInput = {
    where: BookedRoomWhereUniqueInput
    update: XOR<BookedRoomUpdateWithoutBookingInput, BookedRoomUncheckedUpdateWithoutBookingInput>
    create: XOR<BookedRoomCreateWithoutBookingInput, BookedRoomUncheckedCreateWithoutBookingInput>
  }

  export type BookedRoomUpdateWithWhereUniqueWithoutBookingInput = {
    where: BookedRoomWhereUniqueInput
    data: XOR<BookedRoomUpdateWithoutBookingInput, BookedRoomUncheckedUpdateWithoutBookingInput>
  }

  export type BookedRoomUpdateManyWithWhereWithoutBookingInput = {
    where: BookedRoomScalarWhereInput
    data: XOR<BookedRoomUpdateManyMutationInput, BookedRoomUncheckedUpdateManyWithoutBookingInput>
  }

  export type BookingCreateWithoutBookedRoomsInput = {
    id?: string
    confirmationNumber: string
    guestId: string
    primaryGuest: JsonNullValueInput | InputJsonValue
    additionalGuests: JsonNullValueInput | InputJsonValue
    checkInDate: Date | string
    checkOutDate: Date | string
    nights: number
    rooms: JsonNullValueInput | InputJsonValue
    pricing: JsonNullValueInput | InputJsonValue
    totalAmount: number
    currency: string
    status?: string
    bookingSource: string
    specialRequests?: string | null
    preferences: JsonNullValueInput | InputJsonValue
    paymentStatus?: string
    paymentMethod?: string | null
    cancellationPolicy: string
    noShowPolicy: string
    bookedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    property: PropertyCreateNestedOneWithoutBookingsInput
  }

  export type BookingUncheckedCreateWithoutBookedRoomsInput = {
    id?: string
    confirmationNumber: string
    propertyId: string
    guestId: string
    primaryGuest: JsonNullValueInput | InputJsonValue
    additionalGuests: JsonNullValueInput | InputJsonValue
    checkInDate: Date | string
    checkOutDate: Date | string
    nights: number
    rooms: JsonNullValueInput | InputJsonValue
    pricing: JsonNullValueInput | InputJsonValue
    totalAmount: number
    currency: string
    status?: string
    bookingSource: string
    specialRequests?: string | null
    preferences: JsonNullValueInput | InputJsonValue
    paymentStatus?: string
    paymentMethod?: string | null
    cancellationPolicy: string
    noShowPolicy: string
    bookedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type BookingCreateOrConnectWithoutBookedRoomsInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutBookedRoomsInput, BookingUncheckedCreateWithoutBookedRoomsInput>
  }

  export type RoomTypeCreateWithoutBookingsInput = {
    id?: string
    name: string
    description: string
    category: string
    maxOccupancy: number
    bedConfiguration: JsonNullValueInput | InputJsonValue
    roomSize: number
    roomSizeUnit: string
    amenities: JsonNullValueInput | InputJsonValue
    view?: string | null
    floor?: string | null
    totalRooms: number
    baseRate: number
    currency: string
    images: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    property: PropertyCreateNestedOneWithoutRoomTypesInput
    inventory?: InventoryRecordCreateNestedManyWithoutRoomTypeInput
    rates?: RateRecordCreateNestedManyWithoutRoomTypeInput
  }

  export type RoomTypeUncheckedCreateWithoutBookingsInput = {
    id?: string
    propertyId: string
    name: string
    description: string
    category: string
    maxOccupancy: number
    bedConfiguration: JsonNullValueInput | InputJsonValue
    roomSize: number
    roomSizeUnit: string
    amenities: JsonNullValueInput | InputJsonValue
    view?: string | null
    floor?: string | null
    totalRooms: number
    baseRate: number
    currency: string
    images: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    inventory?: InventoryRecordUncheckedCreateNestedManyWithoutRoomTypeInput
    rates?: RateRecordUncheckedCreateNestedManyWithoutRoomTypeInput
  }

  export type RoomTypeCreateOrConnectWithoutBookingsInput = {
    where: RoomTypeWhereUniqueInput
    create: XOR<RoomTypeCreateWithoutBookingsInput, RoomTypeUncheckedCreateWithoutBookingsInput>
  }

  export type BookingUpsertWithoutBookedRoomsInput = {
    update: XOR<BookingUpdateWithoutBookedRoomsInput, BookingUncheckedUpdateWithoutBookedRoomsInput>
    create: XOR<BookingCreateWithoutBookedRoomsInput, BookingUncheckedCreateWithoutBookedRoomsInput>
    where?: BookingWhereInput
  }

  export type BookingUpdateToOneWithWhereWithoutBookedRoomsInput = {
    where?: BookingWhereInput
    data: XOR<BookingUpdateWithoutBookedRoomsInput, BookingUncheckedUpdateWithoutBookedRoomsInput>
  }

  export type BookingUpdateWithoutBookedRoomsInput = {
    id?: StringFieldUpdateOperationsInput | string
    confirmationNumber?: StringFieldUpdateOperationsInput | string
    guestId?: StringFieldUpdateOperationsInput | string
    primaryGuest?: JsonNullValueInput | InputJsonValue
    additionalGuests?: JsonNullValueInput | InputJsonValue
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    nights?: IntFieldUpdateOperationsInput | number
    rooms?: JsonNullValueInput | InputJsonValue
    pricing?: JsonNullValueInput | InputJsonValue
    totalAmount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    bookingSource?: StringFieldUpdateOperationsInput | string
    specialRequests?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: JsonNullValueInput | InputJsonValue
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationPolicy?: StringFieldUpdateOperationsInput | string
    noShowPolicy?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    property?: PropertyUpdateOneRequiredWithoutBookingsNestedInput
  }

  export type BookingUncheckedUpdateWithoutBookedRoomsInput = {
    id?: StringFieldUpdateOperationsInput | string
    confirmationNumber?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    guestId?: StringFieldUpdateOperationsInput | string
    primaryGuest?: JsonNullValueInput | InputJsonValue
    additionalGuests?: JsonNullValueInput | InputJsonValue
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    nights?: IntFieldUpdateOperationsInput | number
    rooms?: JsonNullValueInput | InputJsonValue
    pricing?: JsonNullValueInput | InputJsonValue
    totalAmount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    bookingSource?: StringFieldUpdateOperationsInput | string
    specialRequests?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: JsonNullValueInput | InputJsonValue
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationPolicy?: StringFieldUpdateOperationsInput | string
    noShowPolicy?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type RoomTypeUpsertWithoutBookingsInput = {
    update: XOR<RoomTypeUpdateWithoutBookingsInput, RoomTypeUncheckedUpdateWithoutBookingsInput>
    create: XOR<RoomTypeCreateWithoutBookingsInput, RoomTypeUncheckedCreateWithoutBookingsInput>
    where?: RoomTypeWhereInput
  }

  export type RoomTypeUpdateToOneWithWhereWithoutBookingsInput = {
    where?: RoomTypeWhereInput
    data: XOR<RoomTypeUpdateWithoutBookingsInput, RoomTypeUncheckedUpdateWithoutBookingsInput>
  }

  export type RoomTypeUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    maxOccupancy?: IntFieldUpdateOperationsInput | number
    bedConfiguration?: JsonNullValueInput | InputJsonValue
    roomSize?: FloatFieldUpdateOperationsInput | number
    roomSizeUnit?: StringFieldUpdateOperationsInput | string
    amenities?: JsonNullValueInput | InputJsonValue
    view?: NullableStringFieldUpdateOperationsInput | string | null
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    totalRooms?: IntFieldUpdateOperationsInput | number
    baseRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    images?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    property?: PropertyUpdateOneRequiredWithoutRoomTypesNestedInput
    inventory?: InventoryRecordUpdateManyWithoutRoomTypeNestedInput
    rates?: RateRecordUpdateManyWithoutRoomTypeNestedInput
  }

  export type RoomTypeUncheckedUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    maxOccupancy?: IntFieldUpdateOperationsInput | number
    bedConfiguration?: JsonNullValueInput | InputJsonValue
    roomSize?: FloatFieldUpdateOperationsInput | number
    roomSizeUnit?: StringFieldUpdateOperationsInput | string
    amenities?: JsonNullValueInput | InputJsonValue
    view?: NullableStringFieldUpdateOperationsInput | string | null
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    totalRooms?: IntFieldUpdateOperationsInput | number
    baseRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    images?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventory?: InventoryRecordUncheckedUpdateManyWithoutRoomTypeNestedInput
    rates?: RateRecordUncheckedUpdateManyWithoutRoomTypeNestedInput
  }

  export type PropertyCreateWithoutInventoryInput = {
    id?: string
    name: string
    description: string
    category: string
    address: JsonNullValueInput | InputJsonValue
    coordinates: JsonNullValueInput | InputJsonValue
    timezone: string
    starRating?: number | null
    amenities: JsonNullValueInput | InputJsonValue
    policies: JsonNullValueInput | InputJsonValue
    contactInfo: JsonNullValueInput | InputJsonValue
    images: JsonNullValueInput | InputJsonValue
    virtualTour?: string | null
    ownerId: string
    chainId?: string | null
    brandId?: string | null
    status?: string
    settings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    roomTypes?: RoomTypeCreateNestedManyWithoutPropertyInput
    bookings?: BookingCreateNestedManyWithoutPropertyInput
    rates?: RateRecordCreateNestedManyWithoutPropertyInput
    promotions?: PromotionCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUncheckedCreateWithoutInventoryInput = {
    id?: string
    name: string
    description: string
    category: string
    address: JsonNullValueInput | InputJsonValue
    coordinates: JsonNullValueInput | InputJsonValue
    timezone: string
    starRating?: number | null
    amenities: JsonNullValueInput | InputJsonValue
    policies: JsonNullValueInput | InputJsonValue
    contactInfo: JsonNullValueInput | InputJsonValue
    images: JsonNullValueInput | InputJsonValue
    virtualTour?: string | null
    ownerId: string
    chainId?: string | null
    brandId?: string | null
    status?: string
    settings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    roomTypes?: RoomTypeUncheckedCreateNestedManyWithoutPropertyInput
    bookings?: BookingUncheckedCreateNestedManyWithoutPropertyInput
    rates?: RateRecordUncheckedCreateNestedManyWithoutPropertyInput
    promotions?: PromotionUncheckedCreateNestedManyWithoutPropertyInput
  }

  export type PropertyCreateOrConnectWithoutInventoryInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutInventoryInput, PropertyUncheckedCreateWithoutInventoryInput>
  }

  export type RoomTypeCreateWithoutInventoryInput = {
    id?: string
    name: string
    description: string
    category: string
    maxOccupancy: number
    bedConfiguration: JsonNullValueInput | InputJsonValue
    roomSize: number
    roomSizeUnit: string
    amenities: JsonNullValueInput | InputJsonValue
    view?: string | null
    floor?: string | null
    totalRooms: number
    baseRate: number
    currency: string
    images: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    property: PropertyCreateNestedOneWithoutRoomTypesInput
    bookings?: BookedRoomCreateNestedManyWithoutRoomTypeInput
    rates?: RateRecordCreateNestedManyWithoutRoomTypeInput
  }

  export type RoomTypeUncheckedCreateWithoutInventoryInput = {
    id?: string
    propertyId: string
    name: string
    description: string
    category: string
    maxOccupancy: number
    bedConfiguration: JsonNullValueInput | InputJsonValue
    roomSize: number
    roomSizeUnit: string
    amenities: JsonNullValueInput | InputJsonValue
    view?: string | null
    floor?: string | null
    totalRooms: number
    baseRate: number
    currency: string
    images: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    bookings?: BookedRoomUncheckedCreateNestedManyWithoutRoomTypeInput
    rates?: RateRecordUncheckedCreateNestedManyWithoutRoomTypeInput
  }

  export type RoomTypeCreateOrConnectWithoutInventoryInput = {
    where: RoomTypeWhereUniqueInput
    create: XOR<RoomTypeCreateWithoutInventoryInput, RoomTypeUncheckedCreateWithoutInventoryInput>
  }

  export type PropertyUpsertWithoutInventoryInput = {
    update: XOR<PropertyUpdateWithoutInventoryInput, PropertyUncheckedUpdateWithoutInventoryInput>
    create: XOR<PropertyCreateWithoutInventoryInput, PropertyUncheckedCreateWithoutInventoryInput>
    where?: PropertyWhereInput
  }

  export type PropertyUpdateToOneWithWhereWithoutInventoryInput = {
    where?: PropertyWhereInput
    data: XOR<PropertyUpdateWithoutInventoryInput, PropertyUncheckedUpdateWithoutInventoryInput>
  }

  export type PropertyUpdateWithoutInventoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    address?: JsonNullValueInput | InputJsonValue
    coordinates?: JsonNullValueInput | InputJsonValue
    timezone?: StringFieldUpdateOperationsInput | string
    starRating?: NullableIntFieldUpdateOperationsInput | number | null
    amenities?: JsonNullValueInput | InputJsonValue
    policies?: JsonNullValueInput | InputJsonValue
    contactInfo?: JsonNullValueInput | InputJsonValue
    images?: JsonNullValueInput | InputJsonValue
    virtualTour?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    chainId?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roomTypes?: RoomTypeUpdateManyWithoutPropertyNestedInput
    bookings?: BookingUpdateManyWithoutPropertyNestedInput
    rates?: RateRecordUpdateManyWithoutPropertyNestedInput
    promotions?: PromotionUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateWithoutInventoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    address?: JsonNullValueInput | InputJsonValue
    coordinates?: JsonNullValueInput | InputJsonValue
    timezone?: StringFieldUpdateOperationsInput | string
    starRating?: NullableIntFieldUpdateOperationsInput | number | null
    amenities?: JsonNullValueInput | InputJsonValue
    policies?: JsonNullValueInput | InputJsonValue
    contactInfo?: JsonNullValueInput | InputJsonValue
    images?: JsonNullValueInput | InputJsonValue
    virtualTour?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    chainId?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roomTypes?: RoomTypeUncheckedUpdateManyWithoutPropertyNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutPropertyNestedInput
    rates?: RateRecordUncheckedUpdateManyWithoutPropertyNestedInput
    promotions?: PromotionUncheckedUpdateManyWithoutPropertyNestedInput
  }

  export type RoomTypeUpsertWithoutInventoryInput = {
    update: XOR<RoomTypeUpdateWithoutInventoryInput, RoomTypeUncheckedUpdateWithoutInventoryInput>
    create: XOR<RoomTypeCreateWithoutInventoryInput, RoomTypeUncheckedCreateWithoutInventoryInput>
    where?: RoomTypeWhereInput
  }

  export type RoomTypeUpdateToOneWithWhereWithoutInventoryInput = {
    where?: RoomTypeWhereInput
    data: XOR<RoomTypeUpdateWithoutInventoryInput, RoomTypeUncheckedUpdateWithoutInventoryInput>
  }

  export type RoomTypeUpdateWithoutInventoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    maxOccupancy?: IntFieldUpdateOperationsInput | number
    bedConfiguration?: JsonNullValueInput | InputJsonValue
    roomSize?: FloatFieldUpdateOperationsInput | number
    roomSizeUnit?: StringFieldUpdateOperationsInput | string
    amenities?: JsonNullValueInput | InputJsonValue
    view?: NullableStringFieldUpdateOperationsInput | string | null
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    totalRooms?: IntFieldUpdateOperationsInput | number
    baseRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    images?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    property?: PropertyUpdateOneRequiredWithoutRoomTypesNestedInput
    bookings?: BookedRoomUpdateManyWithoutRoomTypeNestedInput
    rates?: RateRecordUpdateManyWithoutRoomTypeNestedInput
  }

  export type RoomTypeUncheckedUpdateWithoutInventoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    maxOccupancy?: IntFieldUpdateOperationsInput | number
    bedConfiguration?: JsonNullValueInput | InputJsonValue
    roomSize?: FloatFieldUpdateOperationsInput | number
    roomSizeUnit?: StringFieldUpdateOperationsInput | string
    amenities?: JsonNullValueInput | InputJsonValue
    view?: NullableStringFieldUpdateOperationsInput | string | null
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    totalRooms?: IntFieldUpdateOperationsInput | number
    baseRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    images?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookings?: BookedRoomUncheckedUpdateManyWithoutRoomTypeNestedInput
    rates?: RateRecordUncheckedUpdateManyWithoutRoomTypeNestedInput
  }

  export type PropertyCreateWithoutRatesInput = {
    id?: string
    name: string
    description: string
    category: string
    address: JsonNullValueInput | InputJsonValue
    coordinates: JsonNullValueInput | InputJsonValue
    timezone: string
    starRating?: number | null
    amenities: JsonNullValueInput | InputJsonValue
    policies: JsonNullValueInput | InputJsonValue
    contactInfo: JsonNullValueInput | InputJsonValue
    images: JsonNullValueInput | InputJsonValue
    virtualTour?: string | null
    ownerId: string
    chainId?: string | null
    brandId?: string | null
    status?: string
    settings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    roomTypes?: RoomTypeCreateNestedManyWithoutPropertyInput
    bookings?: BookingCreateNestedManyWithoutPropertyInput
    inventory?: InventoryRecordCreateNestedManyWithoutPropertyInput
    promotions?: PromotionCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUncheckedCreateWithoutRatesInput = {
    id?: string
    name: string
    description: string
    category: string
    address: JsonNullValueInput | InputJsonValue
    coordinates: JsonNullValueInput | InputJsonValue
    timezone: string
    starRating?: number | null
    amenities: JsonNullValueInput | InputJsonValue
    policies: JsonNullValueInput | InputJsonValue
    contactInfo: JsonNullValueInput | InputJsonValue
    images: JsonNullValueInput | InputJsonValue
    virtualTour?: string | null
    ownerId: string
    chainId?: string | null
    brandId?: string | null
    status?: string
    settings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    roomTypes?: RoomTypeUncheckedCreateNestedManyWithoutPropertyInput
    bookings?: BookingUncheckedCreateNestedManyWithoutPropertyInput
    inventory?: InventoryRecordUncheckedCreateNestedManyWithoutPropertyInput
    promotions?: PromotionUncheckedCreateNestedManyWithoutPropertyInput
  }

  export type PropertyCreateOrConnectWithoutRatesInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutRatesInput, PropertyUncheckedCreateWithoutRatesInput>
  }

  export type RoomTypeCreateWithoutRatesInput = {
    id?: string
    name: string
    description: string
    category: string
    maxOccupancy: number
    bedConfiguration: JsonNullValueInput | InputJsonValue
    roomSize: number
    roomSizeUnit: string
    amenities: JsonNullValueInput | InputJsonValue
    view?: string | null
    floor?: string | null
    totalRooms: number
    baseRate: number
    currency: string
    images: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    property: PropertyCreateNestedOneWithoutRoomTypesInput
    bookings?: BookedRoomCreateNestedManyWithoutRoomTypeInput
    inventory?: InventoryRecordCreateNestedManyWithoutRoomTypeInput
  }

  export type RoomTypeUncheckedCreateWithoutRatesInput = {
    id?: string
    propertyId: string
    name: string
    description: string
    category: string
    maxOccupancy: number
    bedConfiguration: JsonNullValueInput | InputJsonValue
    roomSize: number
    roomSizeUnit: string
    amenities: JsonNullValueInput | InputJsonValue
    view?: string | null
    floor?: string | null
    totalRooms: number
    baseRate: number
    currency: string
    images: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    bookings?: BookedRoomUncheckedCreateNestedManyWithoutRoomTypeInput
    inventory?: InventoryRecordUncheckedCreateNestedManyWithoutRoomTypeInput
  }

  export type RoomTypeCreateOrConnectWithoutRatesInput = {
    where: RoomTypeWhereUniqueInput
    create: XOR<RoomTypeCreateWithoutRatesInput, RoomTypeUncheckedCreateWithoutRatesInput>
  }

  export type PropertyUpsertWithoutRatesInput = {
    update: XOR<PropertyUpdateWithoutRatesInput, PropertyUncheckedUpdateWithoutRatesInput>
    create: XOR<PropertyCreateWithoutRatesInput, PropertyUncheckedCreateWithoutRatesInput>
    where?: PropertyWhereInput
  }

  export type PropertyUpdateToOneWithWhereWithoutRatesInput = {
    where?: PropertyWhereInput
    data: XOR<PropertyUpdateWithoutRatesInput, PropertyUncheckedUpdateWithoutRatesInput>
  }

  export type PropertyUpdateWithoutRatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    address?: JsonNullValueInput | InputJsonValue
    coordinates?: JsonNullValueInput | InputJsonValue
    timezone?: StringFieldUpdateOperationsInput | string
    starRating?: NullableIntFieldUpdateOperationsInput | number | null
    amenities?: JsonNullValueInput | InputJsonValue
    policies?: JsonNullValueInput | InputJsonValue
    contactInfo?: JsonNullValueInput | InputJsonValue
    images?: JsonNullValueInput | InputJsonValue
    virtualTour?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    chainId?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roomTypes?: RoomTypeUpdateManyWithoutPropertyNestedInput
    bookings?: BookingUpdateManyWithoutPropertyNestedInput
    inventory?: InventoryRecordUpdateManyWithoutPropertyNestedInput
    promotions?: PromotionUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateWithoutRatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    address?: JsonNullValueInput | InputJsonValue
    coordinates?: JsonNullValueInput | InputJsonValue
    timezone?: StringFieldUpdateOperationsInput | string
    starRating?: NullableIntFieldUpdateOperationsInput | number | null
    amenities?: JsonNullValueInput | InputJsonValue
    policies?: JsonNullValueInput | InputJsonValue
    contactInfo?: JsonNullValueInput | InputJsonValue
    images?: JsonNullValueInput | InputJsonValue
    virtualTour?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    chainId?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roomTypes?: RoomTypeUncheckedUpdateManyWithoutPropertyNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutPropertyNestedInput
    inventory?: InventoryRecordUncheckedUpdateManyWithoutPropertyNestedInput
    promotions?: PromotionUncheckedUpdateManyWithoutPropertyNestedInput
  }

  export type RoomTypeUpsertWithoutRatesInput = {
    update: XOR<RoomTypeUpdateWithoutRatesInput, RoomTypeUncheckedUpdateWithoutRatesInput>
    create: XOR<RoomTypeCreateWithoutRatesInput, RoomTypeUncheckedCreateWithoutRatesInput>
    where?: RoomTypeWhereInput
  }

  export type RoomTypeUpdateToOneWithWhereWithoutRatesInput = {
    where?: RoomTypeWhereInput
    data: XOR<RoomTypeUpdateWithoutRatesInput, RoomTypeUncheckedUpdateWithoutRatesInput>
  }

  export type RoomTypeUpdateWithoutRatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    maxOccupancy?: IntFieldUpdateOperationsInput | number
    bedConfiguration?: JsonNullValueInput | InputJsonValue
    roomSize?: FloatFieldUpdateOperationsInput | number
    roomSizeUnit?: StringFieldUpdateOperationsInput | string
    amenities?: JsonNullValueInput | InputJsonValue
    view?: NullableStringFieldUpdateOperationsInput | string | null
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    totalRooms?: IntFieldUpdateOperationsInput | number
    baseRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    images?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    property?: PropertyUpdateOneRequiredWithoutRoomTypesNestedInput
    bookings?: BookedRoomUpdateManyWithoutRoomTypeNestedInput
    inventory?: InventoryRecordUpdateManyWithoutRoomTypeNestedInput
  }

  export type RoomTypeUncheckedUpdateWithoutRatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    maxOccupancy?: IntFieldUpdateOperationsInput | number
    bedConfiguration?: JsonNullValueInput | InputJsonValue
    roomSize?: FloatFieldUpdateOperationsInput | number
    roomSizeUnit?: StringFieldUpdateOperationsInput | string
    amenities?: JsonNullValueInput | InputJsonValue
    view?: NullableStringFieldUpdateOperationsInput | string | null
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    totalRooms?: IntFieldUpdateOperationsInput | number
    baseRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    images?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookings?: BookedRoomUncheckedUpdateManyWithoutRoomTypeNestedInput
    inventory?: InventoryRecordUncheckedUpdateManyWithoutRoomTypeNestedInput
  }

  export type PropertyCreateWithoutPromotionsInput = {
    id?: string
    name: string
    description: string
    category: string
    address: JsonNullValueInput | InputJsonValue
    coordinates: JsonNullValueInput | InputJsonValue
    timezone: string
    starRating?: number | null
    amenities: JsonNullValueInput | InputJsonValue
    policies: JsonNullValueInput | InputJsonValue
    contactInfo: JsonNullValueInput | InputJsonValue
    images: JsonNullValueInput | InputJsonValue
    virtualTour?: string | null
    ownerId: string
    chainId?: string | null
    brandId?: string | null
    status?: string
    settings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    roomTypes?: RoomTypeCreateNestedManyWithoutPropertyInput
    bookings?: BookingCreateNestedManyWithoutPropertyInput
    inventory?: InventoryRecordCreateNestedManyWithoutPropertyInput
    rates?: RateRecordCreateNestedManyWithoutPropertyInput
  }

  export type PropertyUncheckedCreateWithoutPromotionsInput = {
    id?: string
    name: string
    description: string
    category: string
    address: JsonNullValueInput | InputJsonValue
    coordinates: JsonNullValueInput | InputJsonValue
    timezone: string
    starRating?: number | null
    amenities: JsonNullValueInput | InputJsonValue
    policies: JsonNullValueInput | InputJsonValue
    contactInfo: JsonNullValueInput | InputJsonValue
    images: JsonNullValueInput | InputJsonValue
    virtualTour?: string | null
    ownerId: string
    chainId?: string | null
    brandId?: string | null
    status?: string
    settings: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    roomTypes?: RoomTypeUncheckedCreateNestedManyWithoutPropertyInput
    bookings?: BookingUncheckedCreateNestedManyWithoutPropertyInput
    inventory?: InventoryRecordUncheckedCreateNestedManyWithoutPropertyInput
    rates?: RateRecordUncheckedCreateNestedManyWithoutPropertyInput
  }

  export type PropertyCreateOrConnectWithoutPromotionsInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutPromotionsInput, PropertyUncheckedCreateWithoutPromotionsInput>
  }

  export type PropertyUpsertWithoutPromotionsInput = {
    update: XOR<PropertyUpdateWithoutPromotionsInput, PropertyUncheckedUpdateWithoutPromotionsInput>
    create: XOR<PropertyCreateWithoutPromotionsInput, PropertyUncheckedCreateWithoutPromotionsInput>
    where?: PropertyWhereInput
  }

  export type PropertyUpdateToOneWithWhereWithoutPromotionsInput = {
    where?: PropertyWhereInput
    data: XOR<PropertyUpdateWithoutPromotionsInput, PropertyUncheckedUpdateWithoutPromotionsInput>
  }

  export type PropertyUpdateWithoutPromotionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    address?: JsonNullValueInput | InputJsonValue
    coordinates?: JsonNullValueInput | InputJsonValue
    timezone?: StringFieldUpdateOperationsInput | string
    starRating?: NullableIntFieldUpdateOperationsInput | number | null
    amenities?: JsonNullValueInput | InputJsonValue
    policies?: JsonNullValueInput | InputJsonValue
    contactInfo?: JsonNullValueInput | InputJsonValue
    images?: JsonNullValueInput | InputJsonValue
    virtualTour?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    chainId?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roomTypes?: RoomTypeUpdateManyWithoutPropertyNestedInput
    bookings?: BookingUpdateManyWithoutPropertyNestedInput
    inventory?: InventoryRecordUpdateManyWithoutPropertyNestedInput
    rates?: RateRecordUpdateManyWithoutPropertyNestedInput
  }

  export type PropertyUncheckedUpdateWithoutPromotionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    address?: JsonNullValueInput | InputJsonValue
    coordinates?: JsonNullValueInput | InputJsonValue
    timezone?: StringFieldUpdateOperationsInput | string
    starRating?: NullableIntFieldUpdateOperationsInput | number | null
    amenities?: JsonNullValueInput | InputJsonValue
    policies?: JsonNullValueInput | InputJsonValue
    contactInfo?: JsonNullValueInput | InputJsonValue
    images?: JsonNullValueInput | InputJsonValue
    virtualTour?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    chainId?: NullableStringFieldUpdateOperationsInput | string | null
    brandId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roomTypes?: RoomTypeUncheckedUpdateManyWithoutPropertyNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutPropertyNestedInput
    inventory?: InventoryRecordUncheckedUpdateManyWithoutPropertyNestedInput
    rates?: RateRecordUncheckedUpdateManyWithoutPropertyNestedInput
  }

  export type RoomTypeCreateManyPropertyInput = {
    id?: string
    name: string
    description: string
    category: string
    maxOccupancy: number
    bedConfiguration: JsonNullValueInput | InputJsonValue
    roomSize: number
    roomSizeUnit: string
    amenities: JsonNullValueInput | InputJsonValue
    view?: string | null
    floor?: string | null
    totalRooms: number
    baseRate: number
    currency: string
    images: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingCreateManyPropertyInput = {
    id?: string
    confirmationNumber: string
    guestId: string
    primaryGuest: JsonNullValueInput | InputJsonValue
    additionalGuests: JsonNullValueInput | InputJsonValue
    checkInDate: Date | string
    checkOutDate: Date | string
    nights: number
    rooms: JsonNullValueInput | InputJsonValue
    pricing: JsonNullValueInput | InputJsonValue
    totalAmount: number
    currency: string
    status?: string
    bookingSource: string
    specialRequests?: string | null
    preferences: JsonNullValueInput | InputJsonValue
    paymentStatus?: string
    paymentMethod?: string | null
    cancellationPolicy: string
    noShowPolicy: string
    bookedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type InventoryRecordCreateManyPropertyInput = {
    id?: string
    roomTypeId: string
    date: Date | string
    totalRooms: number
    availableRooms: number
    reservedRooms: number
    blockedRooms?: number
    overbookingLimit?: number
    minimumStay?: number | null
    maximumStay?: number | null
    closedToArrival?: boolean
    closedToDeparture?: boolean
    stopSell?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RateRecordCreateManyPropertyInput = {
    id?: string
    roomTypeId: string
    date: Date | string
    rate: number
    currency: string
    rateType?: string
    minimumStay?: number | null
    maximumStay?: number | null
    advanceBookingDays?: number | null
    restrictions?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PromotionCreateManyPropertyInput = {
    id?: string
    code?: string | null
    name: string
    description: string
    type: string
    discountType: string
    discountValue: number
    maxDiscount?: number | null
    validFrom: Date | string
    validTo: Date | string
    conditions: JsonNullValueInput | InputJsonValue
    usage: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoomTypeUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    maxOccupancy?: IntFieldUpdateOperationsInput | number
    bedConfiguration?: JsonNullValueInput | InputJsonValue
    roomSize?: FloatFieldUpdateOperationsInput | number
    roomSizeUnit?: StringFieldUpdateOperationsInput | string
    amenities?: JsonNullValueInput | InputJsonValue
    view?: NullableStringFieldUpdateOperationsInput | string | null
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    totalRooms?: IntFieldUpdateOperationsInput | number
    baseRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    images?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookings?: BookedRoomUpdateManyWithoutRoomTypeNestedInput
    inventory?: InventoryRecordUpdateManyWithoutRoomTypeNestedInput
    rates?: RateRecordUpdateManyWithoutRoomTypeNestedInput
  }

  export type RoomTypeUncheckedUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    maxOccupancy?: IntFieldUpdateOperationsInput | number
    bedConfiguration?: JsonNullValueInput | InputJsonValue
    roomSize?: FloatFieldUpdateOperationsInput | number
    roomSizeUnit?: StringFieldUpdateOperationsInput | string
    amenities?: JsonNullValueInput | InputJsonValue
    view?: NullableStringFieldUpdateOperationsInput | string | null
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    totalRooms?: IntFieldUpdateOperationsInput | number
    baseRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    images?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookings?: BookedRoomUncheckedUpdateManyWithoutRoomTypeNestedInput
    inventory?: InventoryRecordUncheckedUpdateManyWithoutRoomTypeNestedInput
    rates?: RateRecordUncheckedUpdateManyWithoutRoomTypeNestedInput
  }

  export type RoomTypeUncheckedUpdateManyWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    maxOccupancy?: IntFieldUpdateOperationsInput | number
    bedConfiguration?: JsonNullValueInput | InputJsonValue
    roomSize?: FloatFieldUpdateOperationsInput | number
    roomSizeUnit?: StringFieldUpdateOperationsInput | string
    amenities?: JsonNullValueInput | InputJsonValue
    view?: NullableStringFieldUpdateOperationsInput | string | null
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    totalRooms?: IntFieldUpdateOperationsInput | number
    baseRate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    images?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    confirmationNumber?: StringFieldUpdateOperationsInput | string
    guestId?: StringFieldUpdateOperationsInput | string
    primaryGuest?: JsonNullValueInput | InputJsonValue
    additionalGuests?: JsonNullValueInput | InputJsonValue
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    nights?: IntFieldUpdateOperationsInput | number
    rooms?: JsonNullValueInput | InputJsonValue
    pricing?: JsonNullValueInput | InputJsonValue
    totalAmount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    bookingSource?: StringFieldUpdateOperationsInput | string
    specialRequests?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: JsonNullValueInput | InputJsonValue
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationPolicy?: StringFieldUpdateOperationsInput | string
    noShowPolicy?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    bookedRooms?: BookedRoomUpdateManyWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    confirmationNumber?: StringFieldUpdateOperationsInput | string
    guestId?: StringFieldUpdateOperationsInput | string
    primaryGuest?: JsonNullValueInput | InputJsonValue
    additionalGuests?: JsonNullValueInput | InputJsonValue
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    nights?: IntFieldUpdateOperationsInput | number
    rooms?: JsonNullValueInput | InputJsonValue
    pricing?: JsonNullValueInput | InputJsonValue
    totalAmount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    bookingSource?: StringFieldUpdateOperationsInput | string
    specialRequests?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: JsonNullValueInput | InputJsonValue
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationPolicy?: StringFieldUpdateOperationsInput | string
    noShowPolicy?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    bookedRooms?: BookedRoomUncheckedUpdateManyWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateManyWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    confirmationNumber?: StringFieldUpdateOperationsInput | string
    guestId?: StringFieldUpdateOperationsInput | string
    primaryGuest?: JsonNullValueInput | InputJsonValue
    additionalGuests?: JsonNullValueInput | InputJsonValue
    checkInDate?: DateTimeFieldUpdateOperationsInput | Date | string
    checkOutDate?: DateTimeFieldUpdateOperationsInput | Date | string
    nights?: IntFieldUpdateOperationsInput | number
    rooms?: JsonNullValueInput | InputJsonValue
    pricing?: JsonNullValueInput | InputJsonValue
    totalAmount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    bookingSource?: StringFieldUpdateOperationsInput | string
    specialRequests?: NullableStringFieldUpdateOperationsInput | string | null
    preferences?: JsonNullValueInput | InputJsonValue
    paymentStatus?: StringFieldUpdateOperationsInput | string
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationPolicy?: StringFieldUpdateOperationsInput | string
    noShowPolicy?: StringFieldUpdateOperationsInput | string
    bookedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type InventoryRecordUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalRooms?: IntFieldUpdateOperationsInput | number
    availableRooms?: IntFieldUpdateOperationsInput | number
    reservedRooms?: IntFieldUpdateOperationsInput | number
    blockedRooms?: IntFieldUpdateOperationsInput | number
    overbookingLimit?: IntFieldUpdateOperationsInput | number
    minimumStay?: NullableIntFieldUpdateOperationsInput | number | null
    maximumStay?: NullableIntFieldUpdateOperationsInput | number | null
    closedToArrival?: BoolFieldUpdateOperationsInput | boolean
    closedToDeparture?: BoolFieldUpdateOperationsInput | boolean
    stopSell?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roomType?: RoomTypeUpdateOneRequiredWithoutInventoryNestedInput
  }

  export type InventoryRecordUncheckedUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomTypeId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalRooms?: IntFieldUpdateOperationsInput | number
    availableRooms?: IntFieldUpdateOperationsInput | number
    reservedRooms?: IntFieldUpdateOperationsInput | number
    blockedRooms?: IntFieldUpdateOperationsInput | number
    overbookingLimit?: IntFieldUpdateOperationsInput | number
    minimumStay?: NullableIntFieldUpdateOperationsInput | number | null
    maximumStay?: NullableIntFieldUpdateOperationsInput | number | null
    closedToArrival?: BoolFieldUpdateOperationsInput | boolean
    closedToDeparture?: BoolFieldUpdateOperationsInput | boolean
    stopSell?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryRecordUncheckedUpdateManyWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomTypeId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalRooms?: IntFieldUpdateOperationsInput | number
    availableRooms?: IntFieldUpdateOperationsInput | number
    reservedRooms?: IntFieldUpdateOperationsInput | number
    blockedRooms?: IntFieldUpdateOperationsInput | number
    overbookingLimit?: IntFieldUpdateOperationsInput | number
    minimumStay?: NullableIntFieldUpdateOperationsInput | number | null
    maximumStay?: NullableIntFieldUpdateOperationsInput | number | null
    closedToArrival?: BoolFieldUpdateOperationsInput | boolean
    closedToDeparture?: BoolFieldUpdateOperationsInput | boolean
    stopSell?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RateRecordUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    rate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    rateType?: StringFieldUpdateOperationsInput | string
    minimumStay?: NullableIntFieldUpdateOperationsInput | number | null
    maximumStay?: NullableIntFieldUpdateOperationsInput | number | null
    advanceBookingDays?: NullableIntFieldUpdateOperationsInput | number | null
    restrictions?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    roomType?: RoomTypeUpdateOneRequiredWithoutRatesNestedInput
  }

  export type RateRecordUncheckedUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomTypeId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    rate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    rateType?: StringFieldUpdateOperationsInput | string
    minimumStay?: NullableIntFieldUpdateOperationsInput | number | null
    maximumStay?: NullableIntFieldUpdateOperationsInput | number | null
    advanceBookingDays?: NullableIntFieldUpdateOperationsInput | number | null
    restrictions?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RateRecordUncheckedUpdateManyWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomTypeId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    rate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    rateType?: StringFieldUpdateOperationsInput | string
    minimumStay?: NullableIntFieldUpdateOperationsInput | number | null
    maximumStay?: NullableIntFieldUpdateOperationsInput | number | null
    advanceBookingDays?: NullableIntFieldUpdateOperationsInput | number | null
    restrictions?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: FloatFieldUpdateOperationsInput | number
    maxDiscount?: NullableFloatFieldUpdateOperationsInput | number | null
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validTo?: DateTimeFieldUpdateOperationsInput | Date | string
    conditions?: JsonNullValueInput | InputJsonValue
    usage?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionUncheckedUpdateWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: FloatFieldUpdateOperationsInput | number
    maxDiscount?: NullableFloatFieldUpdateOperationsInput | number | null
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validTo?: DateTimeFieldUpdateOperationsInput | Date | string
    conditions?: JsonNullValueInput | InputJsonValue
    usage?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionUncheckedUpdateManyWithoutPropertyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: FloatFieldUpdateOperationsInput | number
    maxDiscount?: NullableFloatFieldUpdateOperationsInput | number | null
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    validTo?: DateTimeFieldUpdateOperationsInput | Date | string
    conditions?: JsonNullValueInput | InputJsonValue
    usage?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookedRoomCreateManyRoomTypeInput = {
    id?: string
    bookingId: string
    roomNumber?: string | null
    quantity: number
    guestCount: number
    rate: number
    totalPrice: number
    guests: JsonNullValueInput | InputJsonValue
  }

  export type InventoryRecordCreateManyRoomTypeInput = {
    id?: string
    propertyId: string
    date: Date | string
    totalRooms: number
    availableRooms: number
    reservedRooms: number
    blockedRooms?: number
    overbookingLimit?: number
    minimumStay?: number | null
    maximumStay?: number | null
    closedToArrival?: boolean
    closedToDeparture?: boolean
    stopSell?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RateRecordCreateManyRoomTypeInput = {
    id?: string
    propertyId: string
    date: Date | string
    rate: number
    currency: string
    rateType?: string
    minimumStay?: number | null
    maximumStay?: number | null
    advanceBookingDays?: number | null
    restrictions?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookedRoomUpdateWithoutRoomTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomNumber?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    guestCount?: IntFieldUpdateOperationsInput | number
    rate?: FloatFieldUpdateOperationsInput | number
    totalPrice?: FloatFieldUpdateOperationsInput | number
    guests?: JsonNullValueInput | InputJsonValue
    booking?: BookingUpdateOneRequiredWithoutBookedRoomsNestedInput
  }

  export type BookedRoomUncheckedUpdateWithoutRoomTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    roomNumber?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    guestCount?: IntFieldUpdateOperationsInput | number
    rate?: FloatFieldUpdateOperationsInput | number
    totalPrice?: FloatFieldUpdateOperationsInput | number
    guests?: JsonNullValueInput | InputJsonValue
  }

  export type BookedRoomUncheckedUpdateManyWithoutRoomTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    roomNumber?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    guestCount?: IntFieldUpdateOperationsInput | number
    rate?: FloatFieldUpdateOperationsInput | number
    totalPrice?: FloatFieldUpdateOperationsInput | number
    guests?: JsonNullValueInput | InputJsonValue
  }

  export type InventoryRecordUpdateWithoutRoomTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalRooms?: IntFieldUpdateOperationsInput | number
    availableRooms?: IntFieldUpdateOperationsInput | number
    reservedRooms?: IntFieldUpdateOperationsInput | number
    blockedRooms?: IntFieldUpdateOperationsInput | number
    overbookingLimit?: IntFieldUpdateOperationsInput | number
    minimumStay?: NullableIntFieldUpdateOperationsInput | number | null
    maximumStay?: NullableIntFieldUpdateOperationsInput | number | null
    closedToArrival?: BoolFieldUpdateOperationsInput | boolean
    closedToDeparture?: BoolFieldUpdateOperationsInput | boolean
    stopSell?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    property?: PropertyUpdateOneRequiredWithoutInventoryNestedInput
  }

  export type InventoryRecordUncheckedUpdateWithoutRoomTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalRooms?: IntFieldUpdateOperationsInput | number
    availableRooms?: IntFieldUpdateOperationsInput | number
    reservedRooms?: IntFieldUpdateOperationsInput | number
    blockedRooms?: IntFieldUpdateOperationsInput | number
    overbookingLimit?: IntFieldUpdateOperationsInput | number
    minimumStay?: NullableIntFieldUpdateOperationsInput | number | null
    maximumStay?: NullableIntFieldUpdateOperationsInput | number | null
    closedToArrival?: BoolFieldUpdateOperationsInput | boolean
    closedToDeparture?: BoolFieldUpdateOperationsInput | boolean
    stopSell?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryRecordUncheckedUpdateManyWithoutRoomTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalRooms?: IntFieldUpdateOperationsInput | number
    availableRooms?: IntFieldUpdateOperationsInput | number
    reservedRooms?: IntFieldUpdateOperationsInput | number
    blockedRooms?: IntFieldUpdateOperationsInput | number
    overbookingLimit?: IntFieldUpdateOperationsInput | number
    minimumStay?: NullableIntFieldUpdateOperationsInput | number | null
    maximumStay?: NullableIntFieldUpdateOperationsInput | number | null
    closedToArrival?: BoolFieldUpdateOperationsInput | boolean
    closedToDeparture?: BoolFieldUpdateOperationsInput | boolean
    stopSell?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RateRecordUpdateWithoutRoomTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    rate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    rateType?: StringFieldUpdateOperationsInput | string
    minimumStay?: NullableIntFieldUpdateOperationsInput | number | null
    maximumStay?: NullableIntFieldUpdateOperationsInput | number | null
    advanceBookingDays?: NullableIntFieldUpdateOperationsInput | number | null
    restrictions?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    property?: PropertyUpdateOneRequiredWithoutRatesNestedInput
  }

  export type RateRecordUncheckedUpdateWithoutRoomTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    rate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    rateType?: StringFieldUpdateOperationsInput | string
    minimumStay?: NullableIntFieldUpdateOperationsInput | number | null
    maximumStay?: NullableIntFieldUpdateOperationsInput | number | null
    advanceBookingDays?: NullableIntFieldUpdateOperationsInput | number | null
    restrictions?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RateRecordUncheckedUpdateManyWithoutRoomTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    propertyId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    rate?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    rateType?: StringFieldUpdateOperationsInput | string
    minimumStay?: NullableIntFieldUpdateOperationsInput | number | null
    maximumStay?: NullableIntFieldUpdateOperationsInput | number | null
    advanceBookingDays?: NullableIntFieldUpdateOperationsInput | number | null
    restrictions?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookedRoomCreateManyBookingInput = {
    id?: string
    roomTypeId: string
    roomNumber?: string | null
    quantity: number
    guestCount: number
    rate: number
    totalPrice: number
    guests: JsonNullValueInput | InputJsonValue
  }

  export type BookedRoomUpdateWithoutBookingInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomNumber?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    guestCount?: IntFieldUpdateOperationsInput | number
    rate?: FloatFieldUpdateOperationsInput | number
    totalPrice?: FloatFieldUpdateOperationsInput | number
    guests?: JsonNullValueInput | InputJsonValue
    roomType?: RoomTypeUpdateOneRequiredWithoutBookingsNestedInput
  }

  export type BookedRoomUncheckedUpdateWithoutBookingInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomTypeId?: StringFieldUpdateOperationsInput | string
    roomNumber?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    guestCount?: IntFieldUpdateOperationsInput | number
    rate?: FloatFieldUpdateOperationsInput | number
    totalPrice?: FloatFieldUpdateOperationsInput | number
    guests?: JsonNullValueInput | InputJsonValue
  }

  export type BookedRoomUncheckedUpdateManyWithoutBookingInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomTypeId?: StringFieldUpdateOperationsInput | string
    roomNumber?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    guestCount?: IntFieldUpdateOperationsInput | number
    rate?: FloatFieldUpdateOperationsInput | number
    totalPrice?: FloatFieldUpdateOperationsInput | number
    guests?: JsonNullValueInput | InputJsonValue
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use PropertyCountOutputTypeDefaultArgs instead
     */
    export type PropertyCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PropertyCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RoomTypeCountOutputTypeDefaultArgs instead
     */
    export type RoomTypeCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RoomTypeCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BookingCountOutputTypeDefaultArgs instead
     */
    export type BookingCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BookingCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PropertyDefaultArgs instead
     */
    export type PropertyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PropertyDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RoomTypeDefaultArgs instead
     */
    export type RoomTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RoomTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BookingDefaultArgs instead
     */
    export type BookingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BookingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BookedRoomDefaultArgs instead
     */
    export type BookedRoomArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BookedRoomDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InventoryRecordDefaultArgs instead
     */
    export type InventoryRecordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InventoryRecordDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InventoryReservationDefaultArgs instead
     */
    export type InventoryReservationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InventoryReservationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InventoryLockDefaultArgs instead
     */
    export type InventoryLockArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InventoryLockDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RateRecordDefaultArgs instead
     */
    export type RateRecordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RateRecordDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DynamicPricingRuleDefaultArgs instead
     */
    export type DynamicPricingRuleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DynamicPricingRuleDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SeasonalRateDefaultArgs instead
     */
    export type SeasonalRateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SeasonalRateDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PromotionDefaultArgs instead
     */
    export type PromotionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PromotionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GroupDiscountDefaultArgs instead
     */
    export type GroupDiscountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GroupDiscountDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TaxConfigurationDefaultArgs instead
     */
    export type TaxConfigurationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TaxConfigurationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GuestProfileDefaultArgs instead
     */
    export type GuestProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GuestProfileDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GuestActivityLogDefaultArgs instead
     */
    export type GuestActivityLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GuestActivityLogDefaultArgs<ExtArgs>

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