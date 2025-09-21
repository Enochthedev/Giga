/**
 * Client
 **/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model Vendor
 *
 */
export type Vendor = $Result.DefaultSelection<Prisma.$VendorPayload>;
/**
 * Model Product
 *
 */
export type Product = $Result.DefaultSelection<Prisma.$ProductPayload>;
/**
 * Model ProductInventory
 *
 */
export type ProductInventory =
  $Result.DefaultSelection<Prisma.$ProductInventoryPayload>;
/**
 * Model InventoryReservation
 *
 */
export type InventoryReservation =
  $Result.DefaultSelection<Prisma.$InventoryReservationPayload>;
/**
 * Model Category
 *
 */
export type Category = $Result.DefaultSelection<Prisma.$CategoryPayload>;
/**
 * Model ShoppingCart
 *
 */
export type ShoppingCart =
  $Result.DefaultSelection<Prisma.$ShoppingCartPayload>;
/**
 * Model CartItem
 *
 */
export type CartItem = $Result.DefaultSelection<Prisma.$CartItemPayload>;
/**
 * Model Order
 *
 */
export type Order = $Result.DefaultSelection<Prisma.$OrderPayload>;
/**
 * Model VendorOrder
 *
 */
export type VendorOrder = $Result.DefaultSelection<Prisma.$VendorOrderPayload>;
/**
 * Model OrderItem
 *
 */
export type OrderItem = $Result.DefaultSelection<Prisma.$OrderItemPayload>;
/**
 * Model ProductReview
 *
 */
export type ProductReview =
  $Result.DefaultSelection<Prisma.$ProductReviewPayload>;
/**
 * Model Wishlist
 *
 */
export type Wishlist = $Result.DefaultSelection<Prisma.$WishlistPayload>;
/**
 * Model WishlistItem
 *
 */
export type WishlistItem =
  $Result.DefaultSelection<Prisma.$WishlistItemPayload>;
/**
 * Model VendorAnalytics
 *
 */
export type VendorAnalytics =
  $Result.DefaultSelection<Prisma.$VendorAnalyticsPayload>;

/**
 * Enums
 */
export namespace $Enums {
  export const OrderStatus: {
    PENDING: 'PENDING';
    CONFIRMED: 'CONFIRMED';
    PROCESSING: 'PROCESSING';
    SHIPPED: 'SHIPPED';
    DELIVERED: 'DELIVERED';
    CANCELLED: 'CANCELLED';
    REFUNDED: 'REFUNDED';
  };

  export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

  export const PaymentStatus: {
    PENDING: 'PENDING';
    PAID: 'PAID';
    FAILED: 'FAILED';
    REFUNDED: 'REFUNDED';
  };

  export type PaymentStatus =
    (typeof PaymentStatus)[keyof typeof PaymentStatus];
}

export type OrderStatus = $Enums.OrderStatus;

export const OrderStatus: typeof $Enums.OrderStatus;

export type PaymentStatus = $Enums.PaymentStatus;

export const PaymentStatus: typeof $Enums.PaymentStatus;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Vendors
 * const vendors = await prisma.vendor.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions
    ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions['log']>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] };

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Vendors
   * const vendors = await prisma.vendor.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(
    optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>
  );
  $on<V extends U>(
    eventType: V,
    callback: (
      event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent
    ) => void
  ): void;

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
  $use(cb: Prisma.Middleware): void;

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

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
  $executeRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

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
  $queryRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

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
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: { isolationLevel?: Prisma.TransactionIsolationLevel }
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

  $transaction<R>(
    fn: (
      prisma: Omit<PrismaClient, runtime.ITXClientDenyList>
    ) => $Utils.JsPromise<R>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    }
  ): $Utils.JsPromise<R>;

  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>;

  /**
   * `prisma.vendor`: Exposes CRUD operations for the **Vendor** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Vendors
   * const vendors = await prisma.vendor.findMany()
   * ```
   */
  get vendor(): Prisma.VendorDelegate<ExtArgs>;

  /**
   * `prisma.product`: Exposes CRUD operations for the **Product** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Products
   * const products = await prisma.product.findMany()
   * ```
   */
  get product(): Prisma.ProductDelegate<ExtArgs>;

  /**
   * `prisma.productInventory`: Exposes CRUD operations for the **ProductInventory** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ProductInventories
   * const productInventories = await prisma.productInventory.findMany()
   * ```
   */
  get productInventory(): Prisma.ProductInventoryDelegate<ExtArgs>;

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
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Categories
   * const categories = await prisma.category.findMany()
   * ```
   */
  get category(): Prisma.CategoryDelegate<ExtArgs>;

  /**
   * `prisma.shoppingCart`: Exposes CRUD operations for the **ShoppingCart** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ShoppingCarts
   * const shoppingCarts = await prisma.shoppingCart.findMany()
   * ```
   */
  get shoppingCart(): Prisma.ShoppingCartDelegate<ExtArgs>;

  /**
   * `prisma.cartItem`: Exposes CRUD operations for the **CartItem** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more CartItems
   * const cartItems = await prisma.cartItem.findMany()
   * ```
   */
  get cartItem(): Prisma.CartItemDelegate<ExtArgs>;

  /**
   * `prisma.order`: Exposes CRUD operations for the **Order** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Orders
   * const orders = await prisma.order.findMany()
   * ```
   */
  get order(): Prisma.OrderDelegate<ExtArgs>;

  /**
   * `prisma.vendorOrder`: Exposes CRUD operations for the **VendorOrder** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more VendorOrders
   * const vendorOrders = await prisma.vendorOrder.findMany()
   * ```
   */
  get vendorOrder(): Prisma.VendorOrderDelegate<ExtArgs>;

  /**
   * `prisma.orderItem`: Exposes CRUD operations for the **OrderItem** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more OrderItems
   * const orderItems = await prisma.orderItem.findMany()
   * ```
   */
  get orderItem(): Prisma.OrderItemDelegate<ExtArgs>;

  /**
   * `prisma.productReview`: Exposes CRUD operations for the **ProductReview** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ProductReviews
   * const productReviews = await prisma.productReview.findMany()
   * ```
   */
  get productReview(): Prisma.ProductReviewDelegate<ExtArgs>;

  /**
   * `prisma.wishlist`: Exposes CRUD operations for the **Wishlist** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Wishlists
   * const wishlists = await prisma.wishlist.findMany()
   * ```
   */
  get wishlist(): Prisma.WishlistDelegate<ExtArgs>;

  /**
   * `prisma.wishlistItem`: Exposes CRUD operations for the **WishlistItem** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more WishlistItems
   * const wishlistItems = await prisma.wishlistItem.findMany()
   * ```
   */
  get wishlistItem(): Prisma.WishlistItemDelegate<ExtArgs>;

  /**
   * `prisma.vendorAnalytics`: Exposes CRUD operations for the **VendorAnalytics** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more VendorAnalytics
   * const vendorAnalytics = await prisma.vendorAnalytics.findMany()
   * ```
   */
  get vendorAnalytics(): Prisma.VendorAnalyticsDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF;

  export type PrismaPromise<T> = $Public.PrismaPromise<T>;

  /**
   * Validator
   */
  export import validator = runtime.Public.validator;

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
  export import PrismaClientValidationError = runtime.PrismaClientValidationError;
  export import NotFoundError = runtime.NotFoundError;

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag;
  export import empty = runtime.empty;
  export import join = runtime.join;
  export import raw = runtime.raw;
  export import Sql = runtime.Sql;

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal;

  export type DecimalJsLike = runtime.DecimalJsLike;

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics;
  export type Metric<T> = runtime.Metric<T>;
  export type MetricHistogram = runtime.MetricHistogram;
  export type MetricHistogramBucket = runtime.MetricHistogramBucket;

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs;
  export import getExtensionContext = runtime.Extensions.getExtensionContext;
  export import Args = $Public.Args;
  export import Payload = $Public.Payload;
  export import Result = $Public.Result;
  export import Exact = $Public.Exact;

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string;
  };

  export const prismaVersion: PrismaVersion;

  /**
   * Utility Types
   */

  export import JsonObject = runtime.JsonObject;
  export import JsonArray = runtime.JsonArray;
  export import JsonValue = runtime.JsonValue;
  export import InputJsonObject = runtime.InputJsonObject;
  export import InputJsonArray = runtime.InputJsonArray;
  export import InputJsonValue = runtime.InputJsonValue;

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
      private DbNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never;
      private constructor();
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull;

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull;

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull;

  type SelectAndInclude = {
    select: any;
    include: any;
  };

  type SelectAndOmit = {
    select: any;
    omit: any;
  };

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> =
    T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<
    T extends (...args: any) => $Utils.JsPromise<any>,
  > = PromiseType<ReturnType<T>>;

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
  }[keyof T];

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
  };

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

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
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {});

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & K;

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object
    ? U extends object
      ? (Without<T, U> & U) | (Without<U, T> & T)
      : U
    : T;

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> =
    T extends Array<any>
      ? False
      : T extends Date
        ? False
        : T extends Uint8Array
          ? False
          : T extends BigInt
            ? False
            : T extends object
              ? True
              : False;

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
    }[K];

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<
    __Either<O, K>
  >;

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
  }[strict];

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = O extends unknown ? _Either<O, K, strict> : never;

  export type Union = any;

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
  } & {};

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never;

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>;
      }
    >
  >;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O
    ? O[K]
    : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown
    ? AtStrict<O, K>
    : never;
  export type At<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
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
      ?
          | (K extends keyof O ? { [P in K]: O[P] } & O : O)
          | ({ [P in keyof O as P extends K ? K : never]-?: O[P] } & O)
      : never
  >;

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False;

  // /**
  // 1
  // */
  export type True = 1;

  /**
  0
  */
  export type False = 0;

  export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
  }[B];

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
      ? 1
      : 0;

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >;

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0;
      1: 1;
    };
    1: {
      0: 1;
      1: 1;
    };
  }[B1][B2];

  export type Keys<U extends Union> = U extends unknown ? keyof U : never;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never;
      }
    : never;

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>,
  > = IsObject<T> extends True ? U : T;

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<
            UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never
          >
        : never
      : {} extends FieldPaths<T[K]>
        ? never
        : K;
  }[keyof T];

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<
    T,
    K extends Enumerable<keyof T> | keyof T,
  > = Prisma__Pick<T, MaybeTupleToUnion<K>>;

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}`
    ? never
    : T;

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

  type FieldRefInputType<Model, FieldType> = Model extends never
    ? never
    : FieldRef<Model, FieldType>;

  export const ModelName: {
    Vendor: 'Vendor';
    Product: 'Product';
    ProductInventory: 'ProductInventory';
    InventoryReservation: 'InventoryReservation';
    Category: 'Category';
    ShoppingCart: 'ShoppingCart';
    CartItem: 'CartItem';
    Order: 'Order';
    VendorOrder: 'VendorOrder';
    OrderItem: 'OrderItem';
    ProductReview: 'ProductReview';
    Wishlist: 'Wishlist';
    WishlistItem: 'WishlistItem';
    VendorAnalytics: 'VendorAnalytics';
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName];

  export type Datasources = {
    db?: Datasource;
  };

  interface TypeMapCb
    extends $Utils.Fn<
      { extArgs: $Extensions.InternalArgs; clientOptions: PrismaClientOptions },
      $Utils.Record<string, any>
    > {
    returns: Prisma.TypeMap<
      this['params']['extArgs'],
      this['params']['clientOptions']
    >;
  }

  export type TypeMap<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    ClientOptions = {},
  > = {
    meta: {
      modelProps:
        | 'vendor'
        | 'product'
        | 'productInventory'
        | 'inventoryReservation'
        | 'category'
        | 'shoppingCart'
        | 'cartItem'
        | 'order'
        | 'vendorOrder'
        | 'orderItem'
        | 'productReview'
        | 'wishlist'
        | 'wishlistItem'
        | 'vendorAnalytics';
      txIsolationLevel: Prisma.TransactionIsolationLevel;
    };
    model: {
      Vendor: {
        payload: Prisma.$VendorPayload<ExtArgs>;
        fields: Prisma.VendorFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.VendorFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.VendorFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>;
          };
          findFirst: {
            args: Prisma.VendorFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.VendorFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>;
          };
          findMany: {
            args: Prisma.VendorFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>[];
          };
          create: {
            args: Prisma.VendorCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>;
          };
          createMany: {
            args: Prisma.VendorCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.VendorCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>[];
          };
          delete: {
            args: Prisma.VendorDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>;
          };
          update: {
            args: Prisma.VendorUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>;
          };
          deleteMany: {
            args: Prisma.VendorDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.VendorUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.VendorUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>;
          };
          aggregate: {
            args: Prisma.VendorAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateVendor>;
          };
          groupBy: {
            args: Prisma.VendorGroupByArgs<ExtArgs>;
            result: $Utils.Optional<VendorGroupByOutputType>[];
          };
          count: {
            args: Prisma.VendorCountArgs<ExtArgs>;
            result: $Utils.Optional<VendorCountAggregateOutputType> | number;
          };
        };
      };
      Product: {
        payload: Prisma.$ProductPayload<ExtArgs>;
        fields: Prisma.ProductFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.ProductFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>;
          };
          findFirst: {
            args: Prisma.ProductFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>;
          };
          findMany: {
            args: Prisma.ProductFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[];
          };
          create: {
            args: Prisma.ProductCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>;
          };
          createMany: {
            args: Prisma.ProductCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.ProductCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[];
          };
          delete: {
            args: Prisma.ProductDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>;
          };
          update: {
            args: Prisma.ProductUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>;
          };
          deleteMany: {
            args: Prisma.ProductDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.ProductUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.ProductUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>;
          };
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateProduct>;
          };
          groupBy: {
            args: Prisma.ProductGroupByArgs<ExtArgs>;
            result: $Utils.Optional<ProductGroupByOutputType>[];
          };
          count: {
            args: Prisma.ProductCountArgs<ExtArgs>;
            result: $Utils.Optional<ProductCountAggregateOutputType> | number;
          };
        };
      };
      ProductInventory: {
        payload: Prisma.$ProductInventoryPayload<ExtArgs>;
        fields: Prisma.ProductInventoryFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.ProductInventoryFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductInventoryPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.ProductInventoryFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductInventoryPayload>;
          };
          findFirst: {
            args: Prisma.ProductInventoryFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductInventoryPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.ProductInventoryFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductInventoryPayload>;
          };
          findMany: {
            args: Prisma.ProductInventoryFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductInventoryPayload>[];
          };
          create: {
            args: Prisma.ProductInventoryCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductInventoryPayload>;
          };
          createMany: {
            args: Prisma.ProductInventoryCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.ProductInventoryCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductInventoryPayload>[];
          };
          delete: {
            args: Prisma.ProductInventoryDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductInventoryPayload>;
          };
          update: {
            args: Prisma.ProductInventoryUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductInventoryPayload>;
          };
          deleteMany: {
            args: Prisma.ProductInventoryDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.ProductInventoryUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.ProductInventoryUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductInventoryPayload>;
          };
          aggregate: {
            args: Prisma.ProductInventoryAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateProductInventory>;
          };
          groupBy: {
            args: Prisma.ProductInventoryGroupByArgs<ExtArgs>;
            result: $Utils.Optional<ProductInventoryGroupByOutputType>[];
          };
          count: {
            args: Prisma.ProductInventoryCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<ProductInventoryCountAggregateOutputType>
              | number;
          };
        };
      };
      InventoryReservation: {
        payload: Prisma.$InventoryReservationPayload<ExtArgs>;
        fields: Prisma.InventoryReservationFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.InventoryReservationFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.InventoryReservationFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>;
          };
          findFirst: {
            args: Prisma.InventoryReservationFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.InventoryReservationFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>;
          };
          findMany: {
            args: Prisma.InventoryReservationFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>[];
          };
          create: {
            args: Prisma.InventoryReservationCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>;
          };
          createMany: {
            args: Prisma.InventoryReservationCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.InventoryReservationCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>[];
          };
          delete: {
            args: Prisma.InventoryReservationDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>;
          };
          update: {
            args: Prisma.InventoryReservationUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>;
          };
          deleteMany: {
            args: Prisma.InventoryReservationDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.InventoryReservationUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.InventoryReservationUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$InventoryReservationPayload>;
          };
          aggregate: {
            args: Prisma.InventoryReservationAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateInventoryReservation>;
          };
          groupBy: {
            args: Prisma.InventoryReservationGroupByArgs<ExtArgs>;
            result: $Utils.Optional<InventoryReservationGroupByOutputType>[];
          };
          count: {
            args: Prisma.InventoryReservationCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<InventoryReservationCountAggregateOutputType>
              | number;
          };
        };
      };
      Category: {
        payload: Prisma.$CategoryPayload<ExtArgs>;
        fields: Prisma.CategoryFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.CategoryFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>;
          };
          findFirst: {
            args: Prisma.CategoryFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>;
          };
          findMany: {
            args: Prisma.CategoryFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[];
          };
          create: {
            args: Prisma.CategoryCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>;
          };
          createMany: {
            args: Prisma.CategoryCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.CategoryCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[];
          };
          delete: {
            args: Prisma.CategoryDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>;
          };
          update: {
            args: Prisma.CategoryUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>;
          };
          deleteMany: {
            args: Prisma.CategoryDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.CategoryUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.CategoryUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>;
          };
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateCategory>;
          };
          groupBy: {
            args: Prisma.CategoryGroupByArgs<ExtArgs>;
            result: $Utils.Optional<CategoryGroupByOutputType>[];
          };
          count: {
            args: Prisma.CategoryCountArgs<ExtArgs>;
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number;
          };
        };
      };
      ShoppingCart: {
        payload: Prisma.$ShoppingCartPayload<ExtArgs>;
        fields: Prisma.ShoppingCartFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.ShoppingCartFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ShoppingCartPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.ShoppingCartFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ShoppingCartPayload>;
          };
          findFirst: {
            args: Prisma.ShoppingCartFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ShoppingCartPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.ShoppingCartFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ShoppingCartPayload>;
          };
          findMany: {
            args: Prisma.ShoppingCartFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ShoppingCartPayload>[];
          };
          create: {
            args: Prisma.ShoppingCartCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ShoppingCartPayload>;
          };
          createMany: {
            args: Prisma.ShoppingCartCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.ShoppingCartCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ShoppingCartPayload>[];
          };
          delete: {
            args: Prisma.ShoppingCartDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ShoppingCartPayload>;
          };
          update: {
            args: Prisma.ShoppingCartUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ShoppingCartPayload>;
          };
          deleteMany: {
            args: Prisma.ShoppingCartDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.ShoppingCartUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.ShoppingCartUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ShoppingCartPayload>;
          };
          aggregate: {
            args: Prisma.ShoppingCartAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateShoppingCart>;
          };
          groupBy: {
            args: Prisma.ShoppingCartGroupByArgs<ExtArgs>;
            result: $Utils.Optional<ShoppingCartGroupByOutputType>[];
          };
          count: {
            args: Prisma.ShoppingCartCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<ShoppingCartCountAggregateOutputType>
              | number;
          };
        };
      };
      CartItem: {
        payload: Prisma.$CartItemPayload<ExtArgs>;
        fields: Prisma.CartItemFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.CartItemFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.CartItemFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>;
          };
          findFirst: {
            args: Prisma.CartItemFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.CartItemFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>;
          };
          findMany: {
            args: Prisma.CartItemFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>[];
          };
          create: {
            args: Prisma.CartItemCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>;
          };
          createMany: {
            args: Prisma.CartItemCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.CartItemCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>[];
          };
          delete: {
            args: Prisma.CartItemDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>;
          };
          update: {
            args: Prisma.CartItemUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>;
          };
          deleteMany: {
            args: Prisma.CartItemDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.CartItemUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.CartItemUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>;
          };
          aggregate: {
            args: Prisma.CartItemAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateCartItem>;
          };
          groupBy: {
            args: Prisma.CartItemGroupByArgs<ExtArgs>;
            result: $Utils.Optional<CartItemGroupByOutputType>[];
          };
          count: {
            args: Prisma.CartItemCountArgs<ExtArgs>;
            result: $Utils.Optional<CartItemCountAggregateOutputType> | number;
          };
        };
      };
      Order: {
        payload: Prisma.$OrderPayload<ExtArgs>;
        fields: Prisma.OrderFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.OrderFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.OrderFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>;
          };
          findFirst: {
            args: Prisma.OrderFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OrderPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.OrderFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>;
          };
          findMany: {
            args: Prisma.OrderFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[];
          };
          create: {
            args: Prisma.OrderCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>;
          };
          createMany: {
            args: Prisma.OrderCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.OrderCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>[];
          };
          delete: {
            args: Prisma.OrderDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>;
          };
          update: {
            args: Prisma.OrderUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>;
          };
          deleteMany: {
            args: Prisma.OrderDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.OrderUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.OrderUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OrderPayload>;
          };
          aggregate: {
            args: Prisma.OrderAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateOrder>;
          };
          groupBy: {
            args: Prisma.OrderGroupByArgs<ExtArgs>;
            result: $Utils.Optional<OrderGroupByOutputType>[];
          };
          count: {
            args: Prisma.OrderCountArgs<ExtArgs>;
            result: $Utils.Optional<OrderCountAggregateOutputType> | number;
          };
        };
      };
      VendorOrder: {
        payload: Prisma.$VendorOrderPayload<ExtArgs>;
        fields: Prisma.VendorOrderFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.VendorOrderFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorOrderPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.VendorOrderFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorOrderPayload>;
          };
          findFirst: {
            args: Prisma.VendorOrderFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorOrderPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.VendorOrderFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorOrderPayload>;
          };
          findMany: {
            args: Prisma.VendorOrderFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorOrderPayload>[];
          };
          create: {
            args: Prisma.VendorOrderCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorOrderPayload>;
          };
          createMany: {
            args: Prisma.VendorOrderCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.VendorOrderCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorOrderPayload>[];
          };
          delete: {
            args: Prisma.VendorOrderDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorOrderPayload>;
          };
          update: {
            args: Prisma.VendorOrderUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorOrderPayload>;
          };
          deleteMany: {
            args: Prisma.VendorOrderDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.VendorOrderUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.VendorOrderUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorOrderPayload>;
          };
          aggregate: {
            args: Prisma.VendorOrderAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateVendorOrder>;
          };
          groupBy: {
            args: Prisma.VendorOrderGroupByArgs<ExtArgs>;
            result: $Utils.Optional<VendorOrderGroupByOutputType>[];
          };
          count: {
            args: Prisma.VendorOrderCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<VendorOrderCountAggregateOutputType>
              | number;
          };
        };
      };
      OrderItem: {
        payload: Prisma.$OrderItemPayload<ExtArgs>;
        fields: Prisma.OrderItemFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.OrderItemFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.OrderItemFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>;
          };
          findFirst: {
            args: Prisma.OrderItemFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.OrderItemFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>;
          };
          findMany: {
            args: Prisma.OrderItemFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>[];
          };
          create: {
            args: Prisma.OrderItemCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>;
          };
          createMany: {
            args: Prisma.OrderItemCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.OrderItemCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>[];
          };
          delete: {
            args: Prisma.OrderItemDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>;
          };
          update: {
            args: Prisma.OrderItemUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>;
          };
          deleteMany: {
            args: Prisma.OrderItemDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.OrderItemUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.OrderItemUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$OrderItemPayload>;
          };
          aggregate: {
            args: Prisma.OrderItemAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateOrderItem>;
          };
          groupBy: {
            args: Prisma.OrderItemGroupByArgs<ExtArgs>;
            result: $Utils.Optional<OrderItemGroupByOutputType>[];
          };
          count: {
            args: Prisma.OrderItemCountArgs<ExtArgs>;
            result: $Utils.Optional<OrderItemCountAggregateOutputType> | number;
          };
        };
      };
      ProductReview: {
        payload: Prisma.$ProductReviewPayload<ExtArgs>;
        fields: Prisma.ProductReviewFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.ProductReviewFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductReviewPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.ProductReviewFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductReviewPayload>;
          };
          findFirst: {
            args: Prisma.ProductReviewFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductReviewPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.ProductReviewFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductReviewPayload>;
          };
          findMany: {
            args: Prisma.ProductReviewFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductReviewPayload>[];
          };
          create: {
            args: Prisma.ProductReviewCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductReviewPayload>;
          };
          createMany: {
            args: Prisma.ProductReviewCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.ProductReviewCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductReviewPayload>[];
          };
          delete: {
            args: Prisma.ProductReviewDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductReviewPayload>;
          };
          update: {
            args: Prisma.ProductReviewUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductReviewPayload>;
          };
          deleteMany: {
            args: Prisma.ProductReviewDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.ProductReviewUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.ProductReviewUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProductReviewPayload>;
          };
          aggregate: {
            args: Prisma.ProductReviewAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateProductReview>;
          };
          groupBy: {
            args: Prisma.ProductReviewGroupByArgs<ExtArgs>;
            result: $Utils.Optional<ProductReviewGroupByOutputType>[];
          };
          count: {
            args: Prisma.ProductReviewCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<ProductReviewCountAggregateOutputType>
              | number;
          };
        };
      };
      Wishlist: {
        payload: Prisma.$WishlistPayload<ExtArgs>;
        fields: Prisma.WishlistFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.WishlistFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WishlistPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.WishlistFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WishlistPayload>;
          };
          findFirst: {
            args: Prisma.WishlistFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WishlistPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.WishlistFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WishlistPayload>;
          };
          findMany: {
            args: Prisma.WishlistFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WishlistPayload>[];
          };
          create: {
            args: Prisma.WishlistCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WishlistPayload>;
          };
          createMany: {
            args: Prisma.WishlistCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.WishlistCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WishlistPayload>[];
          };
          delete: {
            args: Prisma.WishlistDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WishlistPayload>;
          };
          update: {
            args: Prisma.WishlistUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WishlistPayload>;
          };
          deleteMany: {
            args: Prisma.WishlistDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.WishlistUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.WishlistUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WishlistPayload>;
          };
          aggregate: {
            args: Prisma.WishlistAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateWishlist>;
          };
          groupBy: {
            args: Prisma.WishlistGroupByArgs<ExtArgs>;
            result: $Utils.Optional<WishlistGroupByOutputType>[];
          };
          count: {
            args: Prisma.WishlistCountArgs<ExtArgs>;
            result: $Utils.Optional<WishlistCountAggregateOutputType> | number;
          };
        };
      };
      WishlistItem: {
        payload: Prisma.$WishlistItemPayload<ExtArgs>;
        fields: Prisma.WishlistItemFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.WishlistItemFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.WishlistItemFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>;
          };
          findFirst: {
            args: Prisma.WishlistItemFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.WishlistItemFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>;
          };
          findMany: {
            args: Prisma.WishlistItemFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>[];
          };
          create: {
            args: Prisma.WishlistItemCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>;
          };
          createMany: {
            args: Prisma.WishlistItemCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.WishlistItemCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>[];
          };
          delete: {
            args: Prisma.WishlistItemDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>;
          };
          update: {
            args: Prisma.WishlistItemUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>;
          };
          deleteMany: {
            args: Prisma.WishlistItemDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.WishlistItemUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.WishlistItemUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WishlistItemPayload>;
          };
          aggregate: {
            args: Prisma.WishlistItemAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateWishlistItem>;
          };
          groupBy: {
            args: Prisma.WishlistItemGroupByArgs<ExtArgs>;
            result: $Utils.Optional<WishlistItemGroupByOutputType>[];
          };
          count: {
            args: Prisma.WishlistItemCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<WishlistItemCountAggregateOutputType>
              | number;
          };
        };
      };
      VendorAnalytics: {
        payload: Prisma.$VendorAnalyticsPayload<ExtArgs>;
        fields: Prisma.VendorAnalyticsFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.VendorAnalyticsFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorAnalyticsPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.VendorAnalyticsFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorAnalyticsPayload>;
          };
          findFirst: {
            args: Prisma.VendorAnalyticsFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorAnalyticsPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.VendorAnalyticsFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorAnalyticsPayload>;
          };
          findMany: {
            args: Prisma.VendorAnalyticsFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorAnalyticsPayload>[];
          };
          create: {
            args: Prisma.VendorAnalyticsCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorAnalyticsPayload>;
          };
          createMany: {
            args: Prisma.VendorAnalyticsCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.VendorAnalyticsCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorAnalyticsPayload>[];
          };
          delete: {
            args: Prisma.VendorAnalyticsDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorAnalyticsPayload>;
          };
          update: {
            args: Prisma.VendorAnalyticsUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorAnalyticsPayload>;
          };
          deleteMany: {
            args: Prisma.VendorAnalyticsDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.VendorAnalyticsUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.VendorAnalyticsUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VendorAnalyticsPayload>;
          };
          aggregate: {
            args: Prisma.VendorAnalyticsAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateVendorAnalytics>;
          };
          groupBy: {
            args: Prisma.VendorAnalyticsGroupByArgs<ExtArgs>;
            result: $Utils.Optional<VendorAnalyticsGroupByOutputType>[];
          };
          count: {
            args: Prisma.VendorAnalyticsCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<VendorAnalyticsCountAggregateOutputType>
              | number;
          };
        };
      };
    };
  } & {
    other: {
      payload: any;
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
      };
    };
  };
  export const defineExtension: $Extensions.ExtendsHook<
    'define',
    Prisma.TypeMapCb,
    $Extensions.DefaultArgs
  >;
  export type DefaultPrismaClient = PrismaClient;
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources;
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string;
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
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
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    };
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error';
  export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
  };

  export type GetLogType<T extends LogLevel | LogDefinition> =
    T extends LogDefinition
      ? T['emit'] extends 'event'
        ? T['level']
        : never
      : never;
  export type GetEvents<T extends any> =
    T extends Array<LogLevel | LogDefinition>
      ?
          | GetLogType<T[0]>
          | GetLogType<T[1]>
          | GetLogType<T[2]>
          | GetLogType<T[3]>
      : never;

  export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
  };

  export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
  };
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
    | 'groupBy';

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName;
    action: PrismaAction;
    args: any;
    dataPath: string[];
    runInTransaction: boolean;
  };

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>
  ) => $Utils.JsPromise<T>;

  // tested in getLogLevel.test.ts
  export function getLogLevel(
    log: Array<LogLevel | LogDefinition>
  ): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<
    Prisma.DefaultPrismaClient,
    runtime.ITXClientDenyList
  >;

  export type Datasource = {
    url?: string;
  };

  /**
   * Count Types
   */

  /**
   * Count Type VendorCountOutputType
   */

  export type VendorCountOutputType = {
    products: number;
    analytics: number;
  };

  export type VendorCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    products?: boolean | VendorCountOutputTypeCountProductsArgs;
    analytics?: boolean | VendorCountOutputTypeCountAnalyticsArgs;
  };

  // Custom InputTypes
  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorCountOutputType
     */
    select?: VendorCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeCountProductsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProductWhereInput;
  };

  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeCountAnalyticsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: VendorAnalyticsWhereInput;
  };

  /**
   * Count Type ProductCountOutputType
   */

  export type ProductCountOutputType = {
    reservations: number;
    orderItems: number;
    reviews: number;
    cartItems: number;
    wishlistItems: number;
  };

  export type ProductCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    reservations?: boolean | ProductCountOutputTypeCountReservationsArgs;
    orderItems?: boolean | ProductCountOutputTypeCountOrderItemsArgs;
    reviews?: boolean | ProductCountOutputTypeCountReviewsArgs;
    cartItems?: boolean | ProductCountOutputTypeCountCartItemsArgs;
    wishlistItems?: boolean | ProductCountOutputTypeCountWishlistItemsArgs;
  };

  // Custom InputTypes
  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductCountOutputType
     */
    select?: ProductCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountReservationsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: InventoryReservationWhereInput;
  };

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountOrderItemsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: OrderItemWhereInput;
  };

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountReviewsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProductReviewWhereInput;
  };

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountCartItemsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: CartItemWhereInput;
  };

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountWishlistItemsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: WishlistItemWhereInput;
  };

  /**
   * Count Type CategoryCountOutputType
   */

  export type CategoryCountOutputType = {
    children: number;
  };

  export type CategoryCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    children?: boolean | CategoryCountOutputTypeCountChildrenArgs;
  };

  // Custom InputTypes
  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the CategoryCountOutputType
     */
    select?: CategoryCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountChildrenArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: CategoryWhereInput;
  };

  /**
   * Count Type ShoppingCartCountOutputType
   */

  export type ShoppingCartCountOutputType = {
    items: number;
  };

  export type ShoppingCartCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    items?: boolean | ShoppingCartCountOutputTypeCountItemsArgs;
  };

  // Custom InputTypes
  /**
   * ShoppingCartCountOutputType without action
   */
  export type ShoppingCartCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ShoppingCartCountOutputType
     */
    select?: ShoppingCartCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * ShoppingCartCountOutputType without action
   */
  export type ShoppingCartCountOutputTypeCountItemsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: CartItemWhereInput;
  };

  /**
   * Count Type OrderCountOutputType
   */

  export type OrderCountOutputType = {
    items: number;
    vendorOrders: number;
  };

  export type OrderCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    items?: boolean | OrderCountOutputTypeCountItemsArgs;
    vendorOrders?: boolean | OrderCountOutputTypeCountVendorOrdersArgs;
  };

  // Custom InputTypes
  /**
   * OrderCountOutputType without action
   */
  export type OrderCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the OrderCountOutputType
     */
    select?: OrderCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * OrderCountOutputType without action
   */
  export type OrderCountOutputTypeCountItemsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: OrderItemWhereInput;
  };

  /**
   * OrderCountOutputType without action
   */
  export type OrderCountOutputTypeCountVendorOrdersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: VendorOrderWhereInput;
  };

  /**
   * Count Type VendorOrderCountOutputType
   */

  export type VendorOrderCountOutputType = {
    items: number;
  };

  export type VendorOrderCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    items?: boolean | VendorOrderCountOutputTypeCountItemsArgs;
  };

  // Custom InputTypes
  /**
   * VendorOrderCountOutputType without action
   */
  export type VendorOrderCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorOrderCountOutputType
     */
    select?: VendorOrderCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * VendorOrderCountOutputType without action
   */
  export type VendorOrderCountOutputTypeCountItemsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: OrderItemWhereInput;
  };

  /**
   * Count Type WishlistCountOutputType
   */

  export type WishlistCountOutputType = {
    items: number;
  };

  export type WishlistCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    items?: boolean | WishlistCountOutputTypeCountItemsArgs;
  };

  // Custom InputTypes
  /**
   * WishlistCountOutputType without action
   */
  export type WishlistCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WishlistCountOutputType
     */
    select?: WishlistCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * WishlistCountOutputType without action
   */
  export type WishlistCountOutputTypeCountItemsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: WishlistItemWhereInput;
  };

  /**
   * Models
   */

  /**
   * Model Vendor
   */

  export type AggregateVendor = {
    _count: VendorCountAggregateOutputType | null;
    _avg: VendorAvgAggregateOutputType | null;
    _sum: VendorSumAggregateOutputType | null;
    _min: VendorMinAggregateOutputType | null;
    _max: VendorMaxAggregateOutputType | null;
  };

  export type VendorAvgAggregateOutputType = {
    rating: number | null;
    reviewCount: number | null;
  };

  export type VendorSumAggregateOutputType = {
    rating: number | null;
    reviewCount: number | null;
  };

  export type VendorMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    email: string | null;
    phone: string | null;
    description: string | null;
    isActive: boolean | null;
    isVerified: boolean | null;
    rating: number | null;
    reviewCount: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type VendorMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    email: string | null;
    phone: string | null;
    description: string | null;
    isActive: boolean | null;
    isVerified: boolean | null;
    rating: number | null;
    reviewCount: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type VendorCountAggregateOutputType = {
    id: number;
    name: number;
    email: number;
    phone: number;
    address: number;
    description: number;
    isActive: number;
    isVerified: number;
    rating: number;
    reviewCount: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type VendorAvgAggregateInputType = {
    rating?: true;
    reviewCount?: true;
  };

  export type VendorSumAggregateInputType = {
    rating?: true;
    reviewCount?: true;
  };

  export type VendorMinAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    phone?: true;
    description?: true;
    isActive?: true;
    isVerified?: true;
    rating?: true;
    reviewCount?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type VendorMaxAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    phone?: true;
    description?: true;
    isActive?: true;
    isVerified?: true;
    rating?: true;
    reviewCount?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type VendorCountAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    phone?: true;
    address?: true;
    description?: true;
    isActive?: true;
    isVerified?: true;
    rating?: true;
    reviewCount?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type VendorAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Vendor to aggregate.
     */
    where?: VendorWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: VendorWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Vendors.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Vendors
     **/
    _count?: true | VendorCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: VendorAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: VendorSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: VendorMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: VendorMaxAggregateInputType;
  };

  export type GetVendorAggregateType<T extends VendorAggregateArgs> = {
    [P in keyof T & keyof AggregateVendor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVendor[P]>
      : GetScalarType<T[P], AggregateVendor[P]>;
  };

  export type VendorGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: VendorWhereInput;
    orderBy?:
      | VendorOrderByWithAggregationInput
      | VendorOrderByWithAggregationInput[];
    by: VendorScalarFieldEnum[] | VendorScalarFieldEnum;
    having?: VendorScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VendorCountAggregateInputType | true;
    _avg?: VendorAvgAggregateInputType;
    _sum?: VendorSumAggregateInputType;
    _min?: VendorMinAggregateInputType;
    _max?: VendorMaxAggregateInputType;
  };

  export type VendorGroupByOutputType = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    address: JsonValue | null;
    description: string | null;
    isActive: boolean;
    isVerified: boolean;
    rating: number | null;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
    _count: VendorCountAggregateOutputType | null;
    _avg: VendorAvgAggregateOutputType | null;
    _sum: VendorSumAggregateOutputType | null;
    _min: VendorMinAggregateOutputType | null;
    _max: VendorMaxAggregateOutputType | null;
  };

  type GetVendorGroupByPayload<T extends VendorGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<VendorGroupByOutputType, T['by']> & {
          [P in keyof T & keyof VendorGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VendorGroupByOutputType[P]>
            : GetScalarType<T[P], VendorGroupByOutputType[P]>;
        }
      >
    >;

  export type VendorSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      email?: boolean;
      phone?: boolean;
      address?: boolean;
      description?: boolean;
      isActive?: boolean;
      isVerified?: boolean;
      rating?: boolean;
      reviewCount?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      products?: boolean | Vendor$productsArgs<ExtArgs>;
      analytics?: boolean | Vendor$analyticsArgs<ExtArgs>;
      _count?: boolean | VendorCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['vendor']
  >;

  export type VendorSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      email?: boolean;
      phone?: boolean;
      address?: boolean;
      description?: boolean;
      isActive?: boolean;
      isVerified?: boolean;
      rating?: boolean;
      reviewCount?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['vendor']
  >;

  export type VendorSelectScalar = {
    id?: boolean;
    name?: boolean;
    email?: boolean;
    phone?: boolean;
    address?: boolean;
    description?: boolean;
    isActive?: boolean;
    isVerified?: boolean;
    rating?: boolean;
    reviewCount?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type VendorInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    products?: boolean | Vendor$productsArgs<ExtArgs>;
    analytics?: boolean | Vendor$analyticsArgs<ExtArgs>;
    _count?: boolean | VendorCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type VendorIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $VendorPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Vendor';
    objects: {
      products: Prisma.$ProductPayload<ExtArgs>[];
      analytics: Prisma.$VendorAnalyticsPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        address: Prisma.JsonValue | null;
        description: string | null;
        isActive: boolean;
        isVerified: boolean;
        rating: number | null;
        reviewCount: number;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['vendor']
    >;
    composites: {};
  };

  type VendorGetPayload<
    S extends boolean | null | undefined | VendorDefaultArgs,
  > = $Result.GetResult<Prisma.$VendorPayload, S>;

  type VendorCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<VendorFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: VendorCountAggregateInputType | true;
  };

  export interface VendorDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Vendor'];
      meta: { name: 'Vendor' };
    };
    /**
     * Find zero or one Vendor that matches the filter.
     * @param {VendorFindUniqueArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VendorFindUniqueArgs>(
      args: SelectSubset<T, VendorFindUniqueArgs<ExtArgs>>
    ): Prisma__VendorClient<
      $Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one Vendor that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VendorFindUniqueOrThrowArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VendorFindUniqueOrThrowArgs>(
      args: SelectSubset<T, VendorFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__VendorClient<
      $Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first Vendor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorFindFirstArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VendorFindFirstArgs>(
      args?: SelectSubset<T, VendorFindFirstArgs<ExtArgs>>
    ): Prisma__VendorClient<
      $Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first Vendor that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorFindFirstOrThrowArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VendorFindFirstOrThrowArgs>(
      args?: SelectSubset<T, VendorFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__VendorClient<
      $Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more Vendors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Vendors
     * const vendors = await prisma.vendor.findMany()
     *
     * // Get first 10 Vendors
     * const vendors = await prisma.vendor.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const vendorWithIdOnly = await prisma.vendor.findMany({ select: { id: true } })
     *
     */
    findMany<T extends VendorFindManyArgs>(
      args?: SelectSubset<T, VendorFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a Vendor.
     * @param {VendorCreateArgs} args - Arguments to create a Vendor.
     * @example
     * // Create one Vendor
     * const Vendor = await prisma.vendor.create({
     *   data: {
     *     // ... data to create a Vendor
     *   }
     * })
     *
     */
    create<T extends VendorCreateArgs>(
      args: SelectSubset<T, VendorCreateArgs<ExtArgs>>
    ): Prisma__VendorClient<
      $Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many Vendors.
     * @param {VendorCreateManyArgs} args - Arguments to create many Vendors.
     * @example
     * // Create many Vendors
     * const vendor = await prisma.vendor.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends VendorCreateManyArgs>(
      args?: SelectSubset<T, VendorCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Vendors and returns the data saved in the database.
     * @param {VendorCreateManyAndReturnArgs} args - Arguments to create many Vendors.
     * @example
     * // Create many Vendors
     * const vendor = await prisma.vendor.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Vendors and only return the `id`
     * const vendorWithIdOnly = await prisma.vendor.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends VendorCreateManyAndReturnArgs>(
      args?: SelectSubset<T, VendorCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$VendorPayload<ExtArgs>,
        T,
        'createManyAndReturn'
      >
    >;

    /**
     * Delete a Vendor.
     * @param {VendorDeleteArgs} args - Arguments to delete one Vendor.
     * @example
     * // Delete one Vendor
     * const Vendor = await prisma.vendor.delete({
     *   where: {
     *     // ... filter to delete one Vendor
     *   }
     * })
     *
     */
    delete<T extends VendorDeleteArgs>(
      args: SelectSubset<T, VendorDeleteArgs<ExtArgs>>
    ): Prisma__VendorClient<
      $Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one Vendor.
     * @param {VendorUpdateArgs} args - Arguments to update one Vendor.
     * @example
     * // Update one Vendor
     * const vendor = await prisma.vendor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends VendorUpdateArgs>(
      args: SelectSubset<T, VendorUpdateArgs<ExtArgs>>
    ): Prisma__VendorClient<
      $Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more Vendors.
     * @param {VendorDeleteManyArgs} args - Arguments to filter Vendors to delete.
     * @example
     * // Delete a few Vendors
     * const { count } = await prisma.vendor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends VendorDeleteManyArgs>(
      args?: SelectSubset<T, VendorDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Vendors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Vendors
     * const vendor = await prisma.vendor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends VendorUpdateManyArgs>(
      args: SelectSubset<T, VendorUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one Vendor.
     * @param {VendorUpsertArgs} args - Arguments to update or create a Vendor.
     * @example
     * // Update or create a Vendor
     * const vendor = await prisma.vendor.upsert({
     *   create: {
     *     // ... data to create a Vendor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vendor we want to update
     *   }
     * })
     */
    upsert<T extends VendorUpsertArgs>(
      args: SelectSubset<T, VendorUpsertArgs<ExtArgs>>
    ): Prisma__VendorClient<
      $Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of Vendors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorCountArgs} args - Arguments to filter Vendors to count.
     * @example
     * // Count the number of Vendors
     * const count = await prisma.vendor.count({
     *   where: {
     *     // ... the filter for the Vendors we want to count
     *   }
     * })
     **/
    count<T extends VendorCountArgs>(
      args?: Subset<T, VendorCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VendorCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Vendor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VendorAggregateArgs>(
      args: Subset<T, VendorAggregateArgs>
    ): Prisma.PrismaPromise<GetVendorAggregateType<T>>;

    /**
     * Group by Vendor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorGroupByArgs} args - Group by arguments.
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
      T extends VendorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VendorGroupByArgs['orderBy'] }
        : { orderBy?: VendorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, VendorGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetVendorGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Vendor model
     */
    readonly fields: VendorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Vendor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VendorClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    products<T extends Vendor$productsArgs<ExtArgs> = {}>(
      args?: Subset<T, Vendor$productsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, 'findMany'> | Null
    >;
    analytics<T extends Vendor$analyticsArgs<ExtArgs> = {}>(
      args?: Subset<T, Vendor$analyticsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$VendorAnalyticsPayload<ExtArgs>,
          T,
          'findMany'
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Vendor model
   */
  interface VendorFieldRefs {
    readonly id: FieldRef<'Vendor', 'String'>;
    readonly name: FieldRef<'Vendor', 'String'>;
    readonly email: FieldRef<'Vendor', 'String'>;
    readonly phone: FieldRef<'Vendor', 'String'>;
    readonly address: FieldRef<'Vendor', 'Json'>;
    readonly description: FieldRef<'Vendor', 'String'>;
    readonly isActive: FieldRef<'Vendor', 'Boolean'>;
    readonly isVerified: FieldRef<'Vendor', 'Boolean'>;
    readonly rating: FieldRef<'Vendor', 'Float'>;
    readonly reviewCount: FieldRef<'Vendor', 'Int'>;
    readonly createdAt: FieldRef<'Vendor', 'DateTime'>;
    readonly updatedAt: FieldRef<'Vendor', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Vendor findUnique
   */
  export type VendorFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null;
    /**
     * Filter, which Vendor to fetch.
     */
    where: VendorWhereUniqueInput;
  };

  /**
   * Vendor findUniqueOrThrow
   */
  export type VendorFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null;
    /**
     * Filter, which Vendor to fetch.
     */
    where: VendorWhereUniqueInput;
  };

  /**
   * Vendor findFirst
   */
  export type VendorFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null;
    /**
     * Filter, which Vendor to fetch.
     */
    where?: VendorWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Vendors.
     */
    cursor?: VendorWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Vendors.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Vendors.
     */
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[];
  };

  /**
   * Vendor findFirstOrThrow
   */
  export type VendorFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null;
    /**
     * Filter, which Vendor to fetch.
     */
    where?: VendorWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Vendors.
     */
    cursor?: VendorWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Vendors.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Vendors.
     */
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[];
  };

  /**
   * Vendor findMany
   */
  export type VendorFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null;
    /**
     * Filter, which Vendors to fetch.
     */
    where?: VendorWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Vendors.
     */
    cursor?: VendorWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Vendors.
     */
    skip?: number;
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[];
  };

  /**
   * Vendor create
   */
  export type VendorCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null;
    /**
     * The data needed to create a Vendor.
     */
    data: XOR<VendorCreateInput, VendorUncheckedCreateInput>;
  };

  /**
   * Vendor createMany
   */
  export type VendorCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Vendors.
     */
    data: VendorCreateManyInput | VendorCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Vendor createManyAndReturn
   */
  export type VendorCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many Vendors.
     */
    data: VendorCreateManyInput | VendorCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Vendor update
   */
  export type VendorUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null;
    /**
     * The data needed to update a Vendor.
     */
    data: XOR<VendorUpdateInput, VendorUncheckedUpdateInput>;
    /**
     * Choose, which Vendor to update.
     */
    where: VendorWhereUniqueInput;
  };

  /**
   * Vendor updateMany
   */
  export type VendorUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Vendors.
     */
    data: XOR<VendorUpdateManyMutationInput, VendorUncheckedUpdateManyInput>;
    /**
     * Filter which Vendors to update
     */
    where?: VendorWhereInput;
  };

  /**
   * Vendor upsert
   */
  export type VendorUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null;
    /**
     * The filter to search for the Vendor to update in case it exists.
     */
    where: VendorWhereUniqueInput;
    /**
     * In case the Vendor found by the `where` argument doesn't exist, create a new Vendor with this data.
     */
    create: XOR<VendorCreateInput, VendorUncheckedCreateInput>;
    /**
     * In case the Vendor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VendorUpdateInput, VendorUncheckedUpdateInput>;
  };

  /**
   * Vendor delete
   */
  export type VendorDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null;
    /**
     * Filter which Vendor to delete.
     */
    where: VendorWhereUniqueInput;
  };

  /**
   * Vendor deleteMany
   */
  export type VendorDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Vendors to delete
     */
    where?: VendorWhereInput;
  };

  /**
   * Vendor.products
   */
  export type Vendor$productsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null;
    where?: ProductWhereInput;
    orderBy?:
      | ProductOrderByWithRelationInput
      | ProductOrderByWithRelationInput[];
    cursor?: ProductWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[];
  };

  /**
   * Vendor.analytics
   */
  export type Vendor$analyticsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorAnalytics
     */
    select?: VendorAnalyticsSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorAnalyticsInclude<ExtArgs> | null;
    where?: VendorAnalyticsWhereInput;
    orderBy?:
      | VendorAnalyticsOrderByWithRelationInput
      | VendorAnalyticsOrderByWithRelationInput[];
    cursor?: VendorAnalyticsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?:
      | VendorAnalyticsScalarFieldEnum
      | VendorAnalyticsScalarFieldEnum[];
  };

  /**
   * Vendor without action
   */
  export type VendorDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null;
  };

  /**
   * Model Product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null;
    _avg: ProductAvgAggregateOutputType | null;
    _sum: ProductSumAggregateOutputType | null;
    _min: ProductMinAggregateOutputType | null;
    _max: ProductMaxAggregateOutputType | null;
  };

  export type ProductAvgAggregateOutputType = {
    price: number | null;
    comparePrice: number | null;
    rating: number | null;
    reviewCount: number | null;
  };

  export type ProductSumAggregateOutputType = {
    price: number | null;
    comparePrice: number | null;
    rating: number | null;
    reviewCount: number | null;
  };

  export type ProductMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    description: string | null;
    price: number | null;
    comparePrice: number | null;
    sku: string | null;
    category: string | null;
    subcategory: string | null;
    brand: string | null;
    vendorId: string | null;
    isActive: boolean | null;
    rating: number | null;
    reviewCount: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type ProductMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    description: string | null;
    price: number | null;
    comparePrice: number | null;
    sku: string | null;
    category: string | null;
    subcategory: string | null;
    brand: string | null;
    vendorId: string | null;
    isActive: boolean | null;
    rating: number | null;
    reviewCount: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type ProductCountAggregateOutputType = {
    id: number;
    name: number;
    description: number;
    price: number;
    comparePrice: number;
    sku: number;
    category: number;
    subcategory: number;
    brand: number;
    images: number;
    specifications: number;
    vendorId: number;
    isActive: number;
    rating: number;
    reviewCount: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type ProductAvgAggregateInputType = {
    price?: true;
    comparePrice?: true;
    rating?: true;
    reviewCount?: true;
  };

  export type ProductSumAggregateInputType = {
    price?: true;
    comparePrice?: true;
    rating?: true;
    reviewCount?: true;
  };

  export type ProductMinAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    price?: true;
    comparePrice?: true;
    sku?: true;
    category?: true;
    subcategory?: true;
    brand?: true;
    vendorId?: true;
    isActive?: true;
    rating?: true;
    reviewCount?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type ProductMaxAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    price?: true;
    comparePrice?: true;
    sku?: true;
    category?: true;
    subcategory?: true;
    brand?: true;
    vendorId?: true;
    isActive?: true;
    rating?: true;
    reviewCount?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type ProductCountAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    price?: true;
    comparePrice?: true;
    sku?: true;
    category?: true;
    subcategory?: true;
    brand?: true;
    images?: true;
    specifications?: true;
    vendorId?: true;
    isActive?: true;
    rating?: true;
    reviewCount?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type ProductAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Product to aggregate.
     */
    where?: ProductWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Products to fetch.
     */
    orderBy?:
      | ProductOrderByWithRelationInput
      | ProductOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ProductWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Products from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Products.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Products
     **/
    _count?: true | ProductCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ProductAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ProductSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProductMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProductMaxAggregateInputType;
  };

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
    [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>;
  };

  export type ProductGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProductWhereInput;
    orderBy?:
      | ProductOrderByWithAggregationInput
      | ProductOrderByWithAggregationInput[];
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum;
    having?: ProductScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProductCountAggregateInputType | true;
    _avg?: ProductAvgAggregateInputType;
    _sum?: ProductSumAggregateInputType;
    _min?: ProductMinAggregateInputType;
    _max?: ProductMaxAggregateInputType;
  };

  export type ProductGroupByOutputType = {
    id: string;
    name: string;
    description: string;
    price: number;
    comparePrice: number | null;
    sku: string | null;
    category: string;
    subcategory: string | null;
    brand: string | null;
    images: string[];
    specifications: JsonValue | null;
    vendorId: string;
    isActive: boolean;
    rating: number | null;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
    _count: ProductCountAggregateOutputType | null;
    _avg: ProductAvgAggregateOutputType | null;
    _sum: ProductSumAggregateOutputType | null;
    _min: ProductMinAggregateOutputType | null;
    _max: ProductMaxAggregateOutputType | null;
  };

  type GetProductGroupByPayload<T extends ProductGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<ProductGroupByOutputType, T['by']> & {
          [P in keyof T & keyof ProductGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>;
        }
      >
    >;

  export type ProductSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      description?: boolean;
      price?: boolean;
      comparePrice?: boolean;
      sku?: boolean;
      category?: boolean;
      subcategory?: boolean;
      brand?: boolean;
      images?: boolean;
      specifications?: boolean;
      vendorId?: boolean;
      isActive?: boolean;
      rating?: boolean;
      reviewCount?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      vendor?: boolean | VendorDefaultArgs<ExtArgs>;
      inventory?: boolean | Product$inventoryArgs<ExtArgs>;
      reservations?: boolean | Product$reservationsArgs<ExtArgs>;
      orderItems?: boolean | Product$orderItemsArgs<ExtArgs>;
      reviews?: boolean | Product$reviewsArgs<ExtArgs>;
      cartItems?: boolean | Product$cartItemsArgs<ExtArgs>;
      wishlistItems?: boolean | Product$wishlistItemsArgs<ExtArgs>;
      _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['product']
  >;

  export type ProductSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      description?: boolean;
      price?: boolean;
      comparePrice?: boolean;
      sku?: boolean;
      category?: boolean;
      subcategory?: boolean;
      brand?: boolean;
      images?: boolean;
      specifications?: boolean;
      vendorId?: boolean;
      isActive?: boolean;
      rating?: boolean;
      reviewCount?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      vendor?: boolean | VendorDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['product']
  >;

  export type ProductSelectScalar = {
    id?: boolean;
    name?: boolean;
    description?: boolean;
    price?: boolean;
    comparePrice?: boolean;
    sku?: boolean;
    category?: boolean;
    subcategory?: boolean;
    brand?: boolean;
    images?: boolean;
    specifications?: boolean;
    vendorId?: boolean;
    isActive?: boolean;
    rating?: boolean;
    reviewCount?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type ProductInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    vendor?: boolean | VendorDefaultArgs<ExtArgs>;
    inventory?: boolean | Product$inventoryArgs<ExtArgs>;
    reservations?: boolean | Product$reservationsArgs<ExtArgs>;
    orderItems?: boolean | Product$orderItemsArgs<ExtArgs>;
    reviews?: boolean | Product$reviewsArgs<ExtArgs>;
    cartItems?: boolean | Product$cartItemsArgs<ExtArgs>;
    wishlistItems?: boolean | Product$wishlistItemsArgs<ExtArgs>;
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type ProductIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    vendor?: boolean | VendorDefaultArgs<ExtArgs>;
  };

  export type $ProductPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Product';
    objects: {
      vendor: Prisma.$VendorPayload<ExtArgs>;
      inventory: Prisma.$ProductInventoryPayload<ExtArgs> | null;
      reservations: Prisma.$InventoryReservationPayload<ExtArgs>[];
      orderItems: Prisma.$OrderItemPayload<ExtArgs>[];
      reviews: Prisma.$ProductReviewPayload<ExtArgs>[];
      cartItems: Prisma.$CartItemPayload<ExtArgs>[];
      wishlistItems: Prisma.$WishlistItemPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        name: string;
        description: string;
        price: number;
        comparePrice: number | null;
        sku: string | null;
        category: string;
        subcategory: string | null;
        brand: string | null;
        images: string[];
        specifications: Prisma.JsonValue | null;
        vendorId: string;
        isActive: boolean;
        rating: number | null;
        reviewCount: number;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['product']
    >;
    composites: {};
  };

  type ProductGetPayload<
    S extends boolean | null | undefined | ProductDefaultArgs,
  > = $Result.GetResult<Prisma.$ProductPayload, S>;

  type ProductCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: ProductCountAggregateInputType | true;
  };

  export interface ProductDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Product'];
      meta: { name: 'Product' };
    };
    /**
     * Find zero or one Product that matches the filter.
     * @param {ProductFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFindUniqueArgs>(
      args: SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>
    ): Prisma__ProductClient<
      $Result.GetResult<
        Prisma.$ProductPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ProductClient<
      $Result.GetResult<
        Prisma.$ProductPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFindFirstArgs>(
      args?: SelectSubset<T, ProductFindFirstArgs<ExtArgs>>
    ): Prisma__ProductClient<
      $Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ProductClient<
      $Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     *
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ProductFindManyArgs>(
      args?: SelectSubset<T, ProductFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a Product.
     * @param {ProductCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     *
     */
    create<T extends ProductCreateArgs>(
      args: SelectSubset<T, ProductCreateArgs<ExtArgs>>
    ): Prisma__ProductClient<
      $Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many Products.
     * @param {ProductCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ProductCreateManyArgs>(
      args?: SelectSubset<T, ProductCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Products and returns the data saved in the database.
     * @param {ProductCreateManyAndReturnArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Products and only return the `id`
     * const productWithIdOnly = await prisma.product.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ProductCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ProductCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProductPayload<ExtArgs>,
        T,
        'createManyAndReturn'
      >
    >;

    /**
     * Delete a Product.
     * @param {ProductDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     *
     */
    delete<T extends ProductDeleteArgs>(
      args: SelectSubset<T, ProductDeleteArgs<ExtArgs>>
    ): Prisma__ProductClient<
      $Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one Product.
     * @param {ProductUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ProductUpdateArgs>(
      args: SelectSubset<T, ProductUpdateArgs<ExtArgs>>
    ): Prisma__ProductClient<
      $Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more Products.
     * @param {ProductDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ProductDeleteManyArgs>(
      args?: SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ProductUpdateManyArgs>(
      args: SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one Product.
     * @param {ProductUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends ProductUpsertArgs>(
      args: SelectSubset<T, ProductUpsertArgs<ExtArgs>>
    ): Prisma__ProductClient<
      $Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
     **/
    count<T extends ProductCountArgs>(
      args?: Subset<T, ProductCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProductAggregateArgs>(
      args: Subset<T, ProductAggregateArgs>
    ): Prisma.PrismaPromise<GetProductAggregateType<T>>;

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductGroupByArgs} args - Group by arguments.
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
      T extends ProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductGroupByArgs['orderBy'] }
        : { orderBy?: ProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetProductGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Product model
     */
    readonly fields: ProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    vendor<T extends VendorDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, VendorDefaultArgs<ExtArgs>>
    ): Prisma__VendorClient<
      | $Result.GetResult<
          Prisma.$VendorPayload<ExtArgs>,
          T,
          'findUniqueOrThrow'
        >
      | Null,
      Null,
      ExtArgs
    >;
    inventory<T extends Product$inventoryArgs<ExtArgs> = {}>(
      args?: Subset<T, Product$inventoryArgs<ExtArgs>>
    ): Prisma__ProductInventoryClient<
      $Result.GetResult<
        Prisma.$ProductInventoryPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      > | null,
      null,
      ExtArgs
    >;
    reservations<T extends Product$reservationsArgs<ExtArgs> = {}>(
      args?: Subset<T, Product$reservationsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$InventoryReservationPayload<ExtArgs>,
          T,
          'findMany'
        >
      | Null
    >;
    orderItems<T extends Product$orderItemsArgs<ExtArgs> = {}>(
      args?: Subset<T, Product$orderItemsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, 'findMany'> | Null
    >;
    reviews<T extends Product$reviewsArgs<ExtArgs> = {}>(
      args?: Subset<T, Product$reviewsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$ProductReviewPayload<ExtArgs>, T, 'findMany'>
      | Null
    >;
    cartItems<T extends Product$cartItemsArgs<ExtArgs> = {}>(
      args?: Subset<T, Product$cartItemsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, 'findMany'> | Null
    >;
    wishlistItems<T extends Product$wishlistItemsArgs<ExtArgs> = {}>(
      args?: Subset<T, Product$wishlistItemsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, 'findMany'>
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Product model
   */
  interface ProductFieldRefs {
    readonly id: FieldRef<'Product', 'String'>;
    readonly name: FieldRef<'Product', 'String'>;
    readonly description: FieldRef<'Product', 'String'>;
    readonly price: FieldRef<'Product', 'Float'>;
    readonly comparePrice: FieldRef<'Product', 'Float'>;
    readonly sku: FieldRef<'Product', 'String'>;
    readonly category: FieldRef<'Product', 'String'>;
    readonly subcategory: FieldRef<'Product', 'String'>;
    readonly brand: FieldRef<'Product', 'String'>;
    readonly images: FieldRef<'Product', 'String[]'>;
    readonly specifications: FieldRef<'Product', 'Json'>;
    readonly vendorId: FieldRef<'Product', 'String'>;
    readonly isActive: FieldRef<'Product', 'Boolean'>;
    readonly rating: FieldRef<'Product', 'Float'>;
    readonly reviewCount: FieldRef<'Product', 'Int'>;
    readonly createdAt: FieldRef<'Product', 'DateTime'>;
    readonly updatedAt: FieldRef<'Product', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Product findUnique
   */
  export type ProductFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null;
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput;
  };

  /**
   * Product findUniqueOrThrow
   */
  export type ProductFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null;
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput;
  };

  /**
   * Product findFirst
   */
  export type ProductFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null;
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Products to fetch.
     */
    orderBy?:
      | ProductOrderByWithRelationInput
      | ProductOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Products from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Products.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[];
  };

  /**
   * Product findFirstOrThrow
   */
  export type ProductFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null;
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Products to fetch.
     */
    orderBy?:
      | ProductOrderByWithRelationInput
      | ProductOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Products from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Products.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[];
  };

  /**
   * Product findMany
   */
  export type ProductFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null;
    /**
     * Filter, which Products to fetch.
     */
    where?: ProductWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Products to fetch.
     */
    orderBy?:
      | ProductOrderByWithRelationInput
      | ProductOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Products.
     */
    cursor?: ProductWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Products from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Products.
     */
    skip?: number;
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[];
  };

  /**
   * Product create
   */
  export type ProductCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null;
    /**
     * The data needed to create a Product.
     */
    data: XOR<ProductCreateInput, ProductUncheckedCreateInput>;
  };

  /**
   * Product createMany
   */
  export type ProductCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Product createManyAndReturn
   */
  export type ProductCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Product update
   */
  export type ProductUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null;
    /**
     * The data needed to update a Product.
     */
    data: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>;
    /**
     * Choose, which Product to update.
     */
    where: ProductWhereUniqueInput;
  };

  /**
   * Product updateMany
   */
  export type ProductUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>;
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput;
  };

  /**
   * Product upsert
   */
  export type ProductUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null;
    /**
     * The filter to search for the Product to update in case it exists.
     */
    where: ProductWhereUniqueInput;
    /**
     * In case the Product found by the `where` argument doesn't exist, create a new Product with this data.
     */
    create: XOR<ProductCreateInput, ProductUncheckedCreateInput>;
    /**
     * In case the Product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>;
  };

  /**
   * Product delete
   */
  export type ProductDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null;
    /**
     * Filter which Product to delete.
     */
    where: ProductWhereUniqueInput;
  };

  /**
   * Product deleteMany
   */
  export type ProductDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Products to delete
     */
    where?: ProductWhereInput;
  };

  /**
   * Product.inventory
   */
  export type Product$inventoryArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductInventory
     */
    select?: ProductInventorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInventoryInclude<ExtArgs> | null;
    where?: ProductInventoryWhereInput;
  };

  /**
   * Product.reservations
   */
  export type Product$reservationsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationInclude<ExtArgs> | null;
    where?: InventoryReservationWhereInput;
    orderBy?:
      | InventoryReservationOrderByWithRelationInput
      | InventoryReservationOrderByWithRelationInput[];
    cursor?: InventoryReservationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?:
      | InventoryReservationScalarFieldEnum
      | InventoryReservationScalarFieldEnum[];
  };

  /**
   * Product.orderItems
   */
  export type Product$orderItemsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null;
    where?: OrderItemWhereInput;
    orderBy?:
      | OrderItemOrderByWithRelationInput
      | OrderItemOrderByWithRelationInput[];
    cursor?: OrderItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: OrderItemScalarFieldEnum | OrderItemScalarFieldEnum[];
  };

  /**
   * Product.reviews
   */
  export type Product$reviewsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductReview
     */
    select?: ProductReviewSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductReviewInclude<ExtArgs> | null;
    where?: ProductReviewWhereInput;
    orderBy?:
      | ProductReviewOrderByWithRelationInput
      | ProductReviewOrderByWithRelationInput[];
    cursor?: ProductReviewWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: ProductReviewScalarFieldEnum | ProductReviewScalarFieldEnum[];
  };

  /**
   * Product.cartItems
   */
  export type Product$cartItemsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null;
    where?: CartItemWhereInput;
    orderBy?:
      | CartItemOrderByWithRelationInput
      | CartItemOrderByWithRelationInput[];
    cursor?: CartItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[];
  };

  /**
   * Product.wishlistItems
   */
  export type Product$wishlistItemsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null;
    where?: WishlistItemWhereInput;
    orderBy?:
      | WishlistItemOrderByWithRelationInput
      | WishlistItemOrderByWithRelationInput[];
    cursor?: WishlistItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: WishlistItemScalarFieldEnum | WishlistItemScalarFieldEnum[];
  };

  /**
   * Product without action
   */
  export type ProductDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null;
  };

  /**
   * Model ProductInventory
   */

  export type AggregateProductInventory = {
    _count: ProductInventoryCountAggregateOutputType | null;
    _avg: ProductInventoryAvgAggregateOutputType | null;
    _sum: ProductInventorySumAggregateOutputType | null;
    _min: ProductInventoryMinAggregateOutputType | null;
    _max: ProductInventoryMaxAggregateOutputType | null;
  };

  export type ProductInventoryAvgAggregateOutputType = {
    quantity: number | null;
    reservedQuantity: number | null;
    lowStockThreshold: number | null;
  };

  export type ProductInventorySumAggregateOutputType = {
    quantity: number | null;
    reservedQuantity: number | null;
    lowStockThreshold: number | null;
  };

  export type ProductInventoryMinAggregateOutputType = {
    id: string | null;
    productId: string | null;
    quantity: number | null;
    reservedQuantity: number | null;
    lowStockThreshold: number | null;
    trackQuantity: boolean | null;
    updatedAt: Date | null;
  };

  export type ProductInventoryMaxAggregateOutputType = {
    id: string | null;
    productId: string | null;
    quantity: number | null;
    reservedQuantity: number | null;
    lowStockThreshold: number | null;
    trackQuantity: boolean | null;
    updatedAt: Date | null;
  };

  export type ProductInventoryCountAggregateOutputType = {
    id: number;
    productId: number;
    quantity: number;
    reservedQuantity: number;
    lowStockThreshold: number;
    trackQuantity: number;
    updatedAt: number;
    _all: number;
  };

  export type ProductInventoryAvgAggregateInputType = {
    quantity?: true;
    reservedQuantity?: true;
    lowStockThreshold?: true;
  };

  export type ProductInventorySumAggregateInputType = {
    quantity?: true;
    reservedQuantity?: true;
    lowStockThreshold?: true;
  };

  export type ProductInventoryMinAggregateInputType = {
    id?: true;
    productId?: true;
    quantity?: true;
    reservedQuantity?: true;
    lowStockThreshold?: true;
    trackQuantity?: true;
    updatedAt?: true;
  };

  export type ProductInventoryMaxAggregateInputType = {
    id?: true;
    productId?: true;
    quantity?: true;
    reservedQuantity?: true;
    lowStockThreshold?: true;
    trackQuantity?: true;
    updatedAt?: true;
  };

  export type ProductInventoryCountAggregateInputType = {
    id?: true;
    productId?: true;
    quantity?: true;
    reservedQuantity?: true;
    lowStockThreshold?: true;
    trackQuantity?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type ProductInventoryAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProductInventory to aggregate.
     */
    where?: ProductInventoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProductInventories to fetch.
     */
    orderBy?:
      | ProductInventoryOrderByWithRelationInput
      | ProductInventoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ProductInventoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProductInventories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProductInventories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ProductInventories
     **/
    _count?: true | ProductInventoryCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ProductInventoryAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ProductInventorySumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProductInventoryMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProductInventoryMaxAggregateInputType;
  };

  export type GetProductInventoryAggregateType<
    T extends ProductInventoryAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateProductInventory]: P extends
      | '_count'
      | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductInventory[P]>
      : GetScalarType<T[P], AggregateProductInventory[P]>;
  };

  export type ProductInventoryGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProductInventoryWhereInput;
    orderBy?:
      | ProductInventoryOrderByWithAggregationInput
      | ProductInventoryOrderByWithAggregationInput[];
    by: ProductInventoryScalarFieldEnum[] | ProductInventoryScalarFieldEnum;
    having?: ProductInventoryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProductInventoryCountAggregateInputType | true;
    _avg?: ProductInventoryAvgAggregateInputType;
    _sum?: ProductInventorySumAggregateInputType;
    _min?: ProductInventoryMinAggregateInputType;
    _max?: ProductInventoryMaxAggregateInputType;
  };

  export type ProductInventoryGroupByOutputType = {
    id: string;
    productId: string;
    quantity: number;
    reservedQuantity: number;
    lowStockThreshold: number;
    trackQuantity: boolean;
    updatedAt: Date;
    _count: ProductInventoryCountAggregateOutputType | null;
    _avg: ProductInventoryAvgAggregateOutputType | null;
    _sum: ProductInventorySumAggregateOutputType | null;
    _min: ProductInventoryMinAggregateOutputType | null;
    _max: ProductInventoryMaxAggregateOutputType | null;
  };

  type GetProductInventoryGroupByPayload<
    T extends ProductInventoryGroupByArgs,
  > = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductInventoryGroupByOutputType, T['by']> & {
        [P in keyof T &
          keyof ProductInventoryGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], ProductInventoryGroupByOutputType[P]>
          : GetScalarType<T[P], ProductInventoryGroupByOutputType[P]>;
      }
    >
  >;

  export type ProductInventorySelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      productId?: boolean;
      quantity?: boolean;
      reservedQuantity?: boolean;
      lowStockThreshold?: boolean;
      trackQuantity?: boolean;
      updatedAt?: boolean;
      product?: boolean | ProductDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['productInventory']
  >;

  export type ProductInventorySelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      productId?: boolean;
      quantity?: boolean;
      reservedQuantity?: boolean;
      lowStockThreshold?: boolean;
      trackQuantity?: boolean;
      updatedAt?: boolean;
      product?: boolean | ProductDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['productInventory']
  >;

  export type ProductInventorySelectScalar = {
    id?: boolean;
    productId?: boolean;
    quantity?: boolean;
    reservedQuantity?: boolean;
    lowStockThreshold?: boolean;
    trackQuantity?: boolean;
    updatedAt?: boolean;
  };

  export type ProductInventoryInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    product?: boolean | ProductDefaultArgs<ExtArgs>;
  };
  export type ProductInventoryIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    product?: boolean | ProductDefaultArgs<ExtArgs>;
  };

  export type $ProductInventoryPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'ProductInventory';
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        productId: string;
        quantity: number;
        reservedQuantity: number;
        lowStockThreshold: number;
        trackQuantity: boolean;
        updatedAt: Date;
      },
      ExtArgs['result']['productInventory']
    >;
    composites: {};
  };

  type ProductInventoryGetPayload<
    S extends boolean | null | undefined | ProductInventoryDefaultArgs,
  > = $Result.GetResult<Prisma.$ProductInventoryPayload, S>;

  type ProductInventoryCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<ProductInventoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: ProductInventoryCountAggregateInputType | true;
  };

  export interface ProductInventoryDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['ProductInventory'];
      meta: { name: 'ProductInventory' };
    };
    /**
     * Find zero or one ProductInventory that matches the filter.
     * @param {ProductInventoryFindUniqueArgs} args - Arguments to find a ProductInventory
     * @example
     * // Get one ProductInventory
     * const productInventory = await prisma.productInventory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductInventoryFindUniqueArgs>(
      args: SelectSubset<T, ProductInventoryFindUniqueArgs<ExtArgs>>
    ): Prisma__ProductInventoryClient<
      $Result.GetResult<
        Prisma.$ProductInventoryPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find one ProductInventory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductInventoryFindUniqueOrThrowArgs} args - Arguments to find a ProductInventory
     * @example
     * // Get one ProductInventory
     * const productInventory = await prisma.productInventory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductInventoryFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ProductInventoryFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ProductInventoryClient<
      $Result.GetResult<
        Prisma.$ProductInventoryPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find the first ProductInventory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductInventoryFindFirstArgs} args - Arguments to find a ProductInventory
     * @example
     * // Get one ProductInventory
     * const productInventory = await prisma.productInventory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductInventoryFindFirstArgs>(
      args?: SelectSubset<T, ProductInventoryFindFirstArgs<ExtArgs>>
    ): Prisma__ProductInventoryClient<
      $Result.GetResult<
        Prisma.$ProductInventoryPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first ProductInventory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductInventoryFindFirstOrThrowArgs} args - Arguments to find a ProductInventory
     * @example
     * // Get one ProductInventory
     * const productInventory = await prisma.productInventory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductInventoryFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ProductInventoryFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ProductInventoryClient<
      $Result.GetResult<
        Prisma.$ProductInventoryPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more ProductInventories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductInventoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductInventories
     * const productInventories = await prisma.productInventory.findMany()
     *
     * // Get first 10 ProductInventories
     * const productInventories = await prisma.productInventory.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const productInventoryWithIdOnly = await prisma.productInventory.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ProductInventoryFindManyArgs>(
      args?: SelectSubset<T, ProductInventoryFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ProductInventoryPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a ProductInventory.
     * @param {ProductInventoryCreateArgs} args - Arguments to create a ProductInventory.
     * @example
     * // Create one ProductInventory
     * const ProductInventory = await prisma.productInventory.create({
     *   data: {
     *     // ... data to create a ProductInventory
     *   }
     * })
     *
     */
    create<T extends ProductInventoryCreateArgs>(
      args: SelectSubset<T, ProductInventoryCreateArgs<ExtArgs>>
    ): Prisma__ProductInventoryClient<
      $Result.GetResult<Prisma.$ProductInventoryPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many ProductInventories.
     * @param {ProductInventoryCreateManyArgs} args - Arguments to create many ProductInventories.
     * @example
     * // Create many ProductInventories
     * const productInventory = await prisma.productInventory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ProductInventoryCreateManyArgs>(
      args?: SelectSubset<T, ProductInventoryCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many ProductInventories and returns the data saved in the database.
     * @param {ProductInventoryCreateManyAndReturnArgs} args - Arguments to create many ProductInventories.
     * @example
     * // Create many ProductInventories
     * const productInventory = await prisma.productInventory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ProductInventories and only return the `id`
     * const productInventoryWithIdOnly = await prisma.productInventory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ProductInventoryCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ProductInventoryCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProductInventoryPayload<ExtArgs>,
        T,
        'createManyAndReturn'
      >
    >;

    /**
     * Delete a ProductInventory.
     * @param {ProductInventoryDeleteArgs} args - Arguments to delete one ProductInventory.
     * @example
     * // Delete one ProductInventory
     * const ProductInventory = await prisma.productInventory.delete({
     *   where: {
     *     // ... filter to delete one ProductInventory
     *   }
     * })
     *
     */
    delete<T extends ProductInventoryDeleteArgs>(
      args: SelectSubset<T, ProductInventoryDeleteArgs<ExtArgs>>
    ): Prisma__ProductInventoryClient<
      $Result.GetResult<Prisma.$ProductInventoryPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one ProductInventory.
     * @param {ProductInventoryUpdateArgs} args - Arguments to update one ProductInventory.
     * @example
     * // Update one ProductInventory
     * const productInventory = await prisma.productInventory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ProductInventoryUpdateArgs>(
      args: SelectSubset<T, ProductInventoryUpdateArgs<ExtArgs>>
    ): Prisma__ProductInventoryClient<
      $Result.GetResult<Prisma.$ProductInventoryPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more ProductInventories.
     * @param {ProductInventoryDeleteManyArgs} args - Arguments to filter ProductInventories to delete.
     * @example
     * // Delete a few ProductInventories
     * const { count } = await prisma.productInventory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ProductInventoryDeleteManyArgs>(
      args?: SelectSubset<T, ProductInventoryDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more ProductInventories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductInventoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductInventories
     * const productInventory = await prisma.productInventory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ProductInventoryUpdateManyArgs>(
      args: SelectSubset<T, ProductInventoryUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one ProductInventory.
     * @param {ProductInventoryUpsertArgs} args - Arguments to update or create a ProductInventory.
     * @example
     * // Update or create a ProductInventory
     * const productInventory = await prisma.productInventory.upsert({
     *   create: {
     *     // ... data to create a ProductInventory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductInventory we want to update
     *   }
     * })
     */
    upsert<T extends ProductInventoryUpsertArgs>(
      args: SelectSubset<T, ProductInventoryUpsertArgs<ExtArgs>>
    ): Prisma__ProductInventoryClient<
      $Result.GetResult<Prisma.$ProductInventoryPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of ProductInventories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductInventoryCountArgs} args - Arguments to filter ProductInventories to count.
     * @example
     * // Count the number of ProductInventories
     * const count = await prisma.productInventory.count({
     *   where: {
     *     // ... the filter for the ProductInventories we want to count
     *   }
     * })
     **/
    count<T extends ProductInventoryCountArgs>(
      args?: Subset<T, ProductInventoryCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductInventoryCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a ProductInventory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductInventoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProductInventoryAggregateArgs>(
      args: Subset<T, ProductInventoryAggregateArgs>
    ): Prisma.PrismaPromise<GetProductInventoryAggregateType<T>>;

    /**
     * Group by ProductInventory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductInventoryGroupByArgs} args - Group by arguments.
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
      T extends ProductInventoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductInventoryGroupByArgs['orderBy'] }
        : { orderBy?: ProductInventoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ProductInventoryGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetProductInventoryGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ProductInventory model
     */
    readonly fields: ProductInventoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductInventory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductInventoryClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ProductDefaultArgs<ExtArgs>>
    ): Prisma__ProductClient<
      | $Result.GetResult<
          Prisma.$ProductPayload<ExtArgs>,
          T,
          'findUniqueOrThrow'
        >
      | Null,
      Null,
      ExtArgs
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the ProductInventory model
   */
  interface ProductInventoryFieldRefs {
    readonly id: FieldRef<'ProductInventory', 'String'>;
    readonly productId: FieldRef<'ProductInventory', 'String'>;
    readonly quantity: FieldRef<'ProductInventory', 'Int'>;
    readonly reservedQuantity: FieldRef<'ProductInventory', 'Int'>;
    readonly lowStockThreshold: FieldRef<'ProductInventory', 'Int'>;
    readonly trackQuantity: FieldRef<'ProductInventory', 'Boolean'>;
    readonly updatedAt: FieldRef<'ProductInventory', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * ProductInventory findUnique
   */
  export type ProductInventoryFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductInventory
     */
    select?: ProductInventorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInventoryInclude<ExtArgs> | null;
    /**
     * Filter, which ProductInventory to fetch.
     */
    where: ProductInventoryWhereUniqueInput;
  };

  /**
   * ProductInventory findUniqueOrThrow
   */
  export type ProductInventoryFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductInventory
     */
    select?: ProductInventorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInventoryInclude<ExtArgs> | null;
    /**
     * Filter, which ProductInventory to fetch.
     */
    where: ProductInventoryWhereUniqueInput;
  };

  /**
   * ProductInventory findFirst
   */
  export type ProductInventoryFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductInventory
     */
    select?: ProductInventorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInventoryInclude<ExtArgs> | null;
    /**
     * Filter, which ProductInventory to fetch.
     */
    where?: ProductInventoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProductInventories to fetch.
     */
    orderBy?:
      | ProductInventoryOrderByWithRelationInput
      | ProductInventoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProductInventories.
     */
    cursor?: ProductInventoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProductInventories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProductInventories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProductInventories.
     */
    distinct?:
      | ProductInventoryScalarFieldEnum
      | ProductInventoryScalarFieldEnum[];
  };

  /**
   * ProductInventory findFirstOrThrow
   */
  export type ProductInventoryFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductInventory
     */
    select?: ProductInventorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInventoryInclude<ExtArgs> | null;
    /**
     * Filter, which ProductInventory to fetch.
     */
    where?: ProductInventoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProductInventories to fetch.
     */
    orderBy?:
      | ProductInventoryOrderByWithRelationInput
      | ProductInventoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProductInventories.
     */
    cursor?: ProductInventoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProductInventories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProductInventories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProductInventories.
     */
    distinct?:
      | ProductInventoryScalarFieldEnum
      | ProductInventoryScalarFieldEnum[];
  };

  /**
   * ProductInventory findMany
   */
  export type ProductInventoryFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductInventory
     */
    select?: ProductInventorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInventoryInclude<ExtArgs> | null;
    /**
     * Filter, which ProductInventories to fetch.
     */
    where?: ProductInventoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProductInventories to fetch.
     */
    orderBy?:
      | ProductInventoryOrderByWithRelationInput
      | ProductInventoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ProductInventories.
     */
    cursor?: ProductInventoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProductInventories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProductInventories.
     */
    skip?: number;
    distinct?:
      | ProductInventoryScalarFieldEnum
      | ProductInventoryScalarFieldEnum[];
  };

  /**
   * ProductInventory create
   */
  export type ProductInventoryCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductInventory
     */
    select?: ProductInventorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInventoryInclude<ExtArgs> | null;
    /**
     * The data needed to create a ProductInventory.
     */
    data: XOR<
      ProductInventoryCreateInput,
      ProductInventoryUncheckedCreateInput
    >;
  };

  /**
   * ProductInventory createMany
   */
  export type ProductInventoryCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many ProductInventories.
     */
    data: ProductInventoryCreateManyInput | ProductInventoryCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * ProductInventory createManyAndReturn
   */
  export type ProductInventoryCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductInventory
     */
    select?: ProductInventorySelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many ProductInventories.
     */
    data: ProductInventoryCreateManyInput | ProductInventoryCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInventoryIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * ProductInventory update
   */
  export type ProductInventoryUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductInventory
     */
    select?: ProductInventorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInventoryInclude<ExtArgs> | null;
    /**
     * The data needed to update a ProductInventory.
     */
    data: XOR<
      ProductInventoryUpdateInput,
      ProductInventoryUncheckedUpdateInput
    >;
    /**
     * Choose, which ProductInventory to update.
     */
    where: ProductInventoryWhereUniqueInput;
  };

  /**
   * ProductInventory updateMany
   */
  export type ProductInventoryUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update ProductInventories.
     */
    data: XOR<
      ProductInventoryUpdateManyMutationInput,
      ProductInventoryUncheckedUpdateManyInput
    >;
    /**
     * Filter which ProductInventories to update
     */
    where?: ProductInventoryWhereInput;
  };

  /**
   * ProductInventory upsert
   */
  export type ProductInventoryUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductInventory
     */
    select?: ProductInventorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInventoryInclude<ExtArgs> | null;
    /**
     * The filter to search for the ProductInventory to update in case it exists.
     */
    where: ProductInventoryWhereUniqueInput;
    /**
     * In case the ProductInventory found by the `where` argument doesn't exist, create a new ProductInventory with this data.
     */
    create: XOR<
      ProductInventoryCreateInput,
      ProductInventoryUncheckedCreateInput
    >;
    /**
     * In case the ProductInventory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<
      ProductInventoryUpdateInput,
      ProductInventoryUncheckedUpdateInput
    >;
  };

  /**
   * ProductInventory delete
   */
  export type ProductInventoryDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductInventory
     */
    select?: ProductInventorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInventoryInclude<ExtArgs> | null;
    /**
     * Filter which ProductInventory to delete.
     */
    where: ProductInventoryWhereUniqueInput;
  };

  /**
   * ProductInventory deleteMany
   */
  export type ProductInventoryDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProductInventories to delete
     */
    where?: ProductInventoryWhereInput;
  };

  /**
   * ProductInventory without action
   */
  export type ProductInventoryDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductInventory
     */
    select?: ProductInventorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInventoryInclude<ExtArgs> | null;
  };

  /**
   * Model InventoryReservation
   */

  export type AggregateInventoryReservation = {
    _count: InventoryReservationCountAggregateOutputType | null;
    _avg: InventoryReservationAvgAggregateOutputType | null;
    _sum: InventoryReservationSumAggregateOutputType | null;
    _min: InventoryReservationMinAggregateOutputType | null;
    _max: InventoryReservationMaxAggregateOutputType | null;
  };

  export type InventoryReservationAvgAggregateOutputType = {
    quantity: number | null;
  };

  export type InventoryReservationSumAggregateOutputType = {
    quantity: number | null;
  };

  export type InventoryReservationMinAggregateOutputType = {
    id: string | null;
    productId: string | null;
    quantity: number | null;
    customerId: string | null;
    orderId: string | null;
    sessionId: string | null;
    expiresAt: Date | null;
    createdAt: Date | null;
  };

  export type InventoryReservationMaxAggregateOutputType = {
    id: string | null;
    productId: string | null;
    quantity: number | null;
    customerId: string | null;
    orderId: string | null;
    sessionId: string | null;
    expiresAt: Date | null;
    createdAt: Date | null;
  };

  export type InventoryReservationCountAggregateOutputType = {
    id: number;
    productId: number;
    quantity: number;
    customerId: number;
    orderId: number;
    sessionId: number;
    expiresAt: number;
    createdAt: number;
    _all: number;
  };

  export type InventoryReservationAvgAggregateInputType = {
    quantity?: true;
  };

  export type InventoryReservationSumAggregateInputType = {
    quantity?: true;
  };

  export type InventoryReservationMinAggregateInputType = {
    id?: true;
    productId?: true;
    quantity?: true;
    customerId?: true;
    orderId?: true;
    sessionId?: true;
    expiresAt?: true;
    createdAt?: true;
  };

  export type InventoryReservationMaxAggregateInputType = {
    id?: true;
    productId?: true;
    quantity?: true;
    customerId?: true;
    orderId?: true;
    sessionId?: true;
    expiresAt?: true;
    createdAt?: true;
  };

  export type InventoryReservationCountAggregateInputType = {
    id?: true;
    productId?: true;
    quantity?: true;
    customerId?: true;
    orderId?: true;
    sessionId?: true;
    expiresAt?: true;
    createdAt?: true;
    _all?: true;
  };

  export type InventoryReservationAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which InventoryReservation to aggregate.
     */
    where?: InventoryReservationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InventoryReservations to fetch.
     */
    orderBy?:
      | InventoryReservationOrderByWithRelationInput
      | InventoryReservationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: InventoryReservationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InventoryReservations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InventoryReservations.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned InventoryReservations
     **/
    _count?: true | InventoryReservationCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: InventoryReservationAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: InventoryReservationSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: InventoryReservationMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: InventoryReservationMaxAggregateInputType;
  };

  export type GetInventoryReservationAggregateType<
    T extends InventoryReservationAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateInventoryReservation]: P extends
      | '_count'
      | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventoryReservation[P]>
      : GetScalarType<T[P], AggregateInventoryReservation[P]>;
  };

  export type InventoryReservationGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: InventoryReservationWhereInput;
    orderBy?:
      | InventoryReservationOrderByWithAggregationInput
      | InventoryReservationOrderByWithAggregationInput[];
    by:
      | InventoryReservationScalarFieldEnum[]
      | InventoryReservationScalarFieldEnum;
    having?: InventoryReservationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: InventoryReservationCountAggregateInputType | true;
    _avg?: InventoryReservationAvgAggregateInputType;
    _sum?: InventoryReservationSumAggregateInputType;
    _min?: InventoryReservationMinAggregateInputType;
    _max?: InventoryReservationMaxAggregateInputType;
  };

  export type InventoryReservationGroupByOutputType = {
    id: string;
    productId: string;
    quantity: number;
    customerId: string;
    orderId: string | null;
    sessionId: string | null;
    expiresAt: Date;
    createdAt: Date;
    _count: InventoryReservationCountAggregateOutputType | null;
    _avg: InventoryReservationAvgAggregateOutputType | null;
    _sum: InventoryReservationSumAggregateOutputType | null;
    _min: InventoryReservationMinAggregateOutputType | null;
    _max: InventoryReservationMaxAggregateOutputType | null;
  };

  type GetInventoryReservationGroupByPayload<
    T extends InventoryReservationGroupByArgs,
  > = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryReservationGroupByOutputType, T['by']> & {
        [P in keyof T &
          keyof InventoryReservationGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], InventoryReservationGroupByOutputType[P]>
          : GetScalarType<T[P], InventoryReservationGroupByOutputType[P]>;
      }
    >
  >;

  export type InventoryReservationSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      productId?: boolean;
      quantity?: boolean;
      customerId?: boolean;
      orderId?: boolean;
      sessionId?: boolean;
      expiresAt?: boolean;
      createdAt?: boolean;
      product?: boolean | ProductDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['inventoryReservation']
  >;

  export type InventoryReservationSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      productId?: boolean;
      quantity?: boolean;
      customerId?: boolean;
      orderId?: boolean;
      sessionId?: boolean;
      expiresAt?: boolean;
      createdAt?: boolean;
      product?: boolean | ProductDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['inventoryReservation']
  >;

  export type InventoryReservationSelectScalar = {
    id?: boolean;
    productId?: boolean;
    quantity?: boolean;
    customerId?: boolean;
    orderId?: boolean;
    sessionId?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
  };

  export type InventoryReservationInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    product?: boolean | ProductDefaultArgs<ExtArgs>;
  };
  export type InventoryReservationIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    product?: boolean | ProductDefaultArgs<ExtArgs>;
  };

  export type $InventoryReservationPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'InventoryReservation';
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        productId: string;
        quantity: number;
        customerId: string;
        orderId: string | null;
        sessionId: string | null;
        expiresAt: Date;
        createdAt: Date;
      },
      ExtArgs['result']['inventoryReservation']
    >;
    composites: {};
  };

  type InventoryReservationGetPayload<
    S extends boolean | null | undefined | InventoryReservationDefaultArgs,
  > = $Result.GetResult<Prisma.$InventoryReservationPayload, S>;

  type InventoryReservationCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<
    InventoryReservationFindManyArgs,
    'select' | 'include' | 'distinct'
  > & {
    select?: InventoryReservationCountAggregateInputType | true;
  };

  export interface InventoryReservationDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['InventoryReservation'];
      meta: { name: 'InventoryReservation' };
    };
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
    findUnique<T extends InventoryReservationFindUniqueArgs>(
      args: SelectSubset<T, InventoryReservationFindUniqueArgs<ExtArgs>>
    ): Prisma__InventoryReservationClient<
      $Result.GetResult<
        Prisma.$InventoryReservationPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >;

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
    findUniqueOrThrow<T extends InventoryReservationFindUniqueOrThrowArgs>(
      args: SelectSubset<T, InventoryReservationFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__InventoryReservationClient<
      $Result.GetResult<
        Prisma.$InventoryReservationPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >;

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
    findFirst<T extends InventoryReservationFindFirstArgs>(
      args?: SelectSubset<T, InventoryReservationFindFirstArgs<ExtArgs>>
    ): Prisma__InventoryReservationClient<
      $Result.GetResult<
        Prisma.$InventoryReservationPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >;

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
    findFirstOrThrow<T extends InventoryReservationFindFirstOrThrowArgs>(
      args?: SelectSubset<T, InventoryReservationFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__InventoryReservationClient<
      $Result.GetResult<
        Prisma.$InventoryReservationPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >;

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
    findMany<T extends InventoryReservationFindManyArgs>(
      args?: SelectSubset<T, InventoryReservationFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$InventoryReservationPayload<ExtArgs>,
        T,
        'findMany'
      >
    >;

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
    create<T extends InventoryReservationCreateArgs>(
      args: SelectSubset<T, InventoryReservationCreateArgs<ExtArgs>>
    ): Prisma__InventoryReservationClient<
      $Result.GetResult<
        Prisma.$InventoryReservationPayload<ExtArgs>,
        T,
        'create'
      >,
      never,
      ExtArgs
    >;

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
    createMany<T extends InventoryReservationCreateManyArgs>(
      args?: SelectSubset<T, InventoryReservationCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

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
    createManyAndReturn<T extends InventoryReservationCreateManyAndReturnArgs>(
      args?: SelectSubset<
        T,
        InventoryReservationCreateManyAndReturnArgs<ExtArgs>
      >
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$InventoryReservationPayload<ExtArgs>,
        T,
        'createManyAndReturn'
      >
    >;

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
    delete<T extends InventoryReservationDeleteArgs>(
      args: SelectSubset<T, InventoryReservationDeleteArgs<ExtArgs>>
    ): Prisma__InventoryReservationClient<
      $Result.GetResult<
        Prisma.$InventoryReservationPayload<ExtArgs>,
        T,
        'delete'
      >,
      never,
      ExtArgs
    >;

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
    update<T extends InventoryReservationUpdateArgs>(
      args: SelectSubset<T, InventoryReservationUpdateArgs<ExtArgs>>
    ): Prisma__InventoryReservationClient<
      $Result.GetResult<
        Prisma.$InventoryReservationPayload<ExtArgs>,
        T,
        'update'
      >,
      never,
      ExtArgs
    >;

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
    deleteMany<T extends InventoryReservationDeleteManyArgs>(
      args?: SelectSubset<T, InventoryReservationDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

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
    updateMany<T extends InventoryReservationUpdateManyArgs>(
      args: SelectSubset<T, InventoryReservationUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

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
    upsert<T extends InventoryReservationUpsertArgs>(
      args: SelectSubset<T, InventoryReservationUpsertArgs<ExtArgs>>
    ): Prisma__InventoryReservationClient<
      $Result.GetResult<
        Prisma.$InventoryReservationPayload<ExtArgs>,
        T,
        'upsert'
      >,
      never,
      ExtArgs
    >;

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
      args?: Subset<T, InventoryReservationCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<
              T['select'],
              InventoryReservationCountAggregateOutputType
            >
        : number
    >;

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
    aggregate<T extends InventoryReservationAggregateArgs>(
      args: Subset<T, InventoryReservationAggregateArgs>
    ): Prisma.PrismaPromise<GetInventoryReservationAggregateType<T>>;

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
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, InventoryReservationGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetInventoryReservationGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
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
  export interface Prisma__InventoryReservationClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ProductDefaultArgs<ExtArgs>>
    ): Prisma__ProductClient<
      | $Result.GetResult<
          Prisma.$ProductPayload<ExtArgs>,
          T,
          'findUniqueOrThrow'
        >
      | Null,
      Null,
      ExtArgs
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the InventoryReservation model
   */
  interface InventoryReservationFieldRefs {
    readonly id: FieldRef<'InventoryReservation', 'String'>;
    readonly productId: FieldRef<'InventoryReservation', 'String'>;
    readonly quantity: FieldRef<'InventoryReservation', 'Int'>;
    readonly customerId: FieldRef<'InventoryReservation', 'String'>;
    readonly orderId: FieldRef<'InventoryReservation', 'String'>;
    readonly sessionId: FieldRef<'InventoryReservation', 'String'>;
    readonly expiresAt: FieldRef<'InventoryReservation', 'DateTime'>;
    readonly createdAt: FieldRef<'InventoryReservation', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * InventoryReservation findUnique
   */
  export type InventoryReservationFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationInclude<ExtArgs> | null;
    /**
     * Filter, which InventoryReservation to fetch.
     */
    where: InventoryReservationWhereUniqueInput;
  };

  /**
   * InventoryReservation findUniqueOrThrow
   */
  export type InventoryReservationFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationInclude<ExtArgs> | null;
    /**
     * Filter, which InventoryReservation to fetch.
     */
    where: InventoryReservationWhereUniqueInput;
  };

  /**
   * InventoryReservation findFirst
   */
  export type InventoryReservationFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationInclude<ExtArgs> | null;
    /**
     * Filter, which InventoryReservation to fetch.
     */
    where?: InventoryReservationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InventoryReservations to fetch.
     */
    orderBy?:
      | InventoryReservationOrderByWithRelationInput
      | InventoryReservationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for InventoryReservations.
     */
    cursor?: InventoryReservationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InventoryReservations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InventoryReservations.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of InventoryReservations.
     */
    distinct?:
      | InventoryReservationScalarFieldEnum
      | InventoryReservationScalarFieldEnum[];
  };

  /**
   * InventoryReservation findFirstOrThrow
   */
  export type InventoryReservationFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationInclude<ExtArgs> | null;
    /**
     * Filter, which InventoryReservation to fetch.
     */
    where?: InventoryReservationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InventoryReservations to fetch.
     */
    orderBy?:
      | InventoryReservationOrderByWithRelationInput
      | InventoryReservationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for InventoryReservations.
     */
    cursor?: InventoryReservationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InventoryReservations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InventoryReservations.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of InventoryReservations.
     */
    distinct?:
      | InventoryReservationScalarFieldEnum
      | InventoryReservationScalarFieldEnum[];
  };

  /**
   * InventoryReservation findMany
   */
  export type InventoryReservationFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationInclude<ExtArgs> | null;
    /**
     * Filter, which InventoryReservations to fetch.
     */
    where?: InventoryReservationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InventoryReservations to fetch.
     */
    orderBy?:
      | InventoryReservationOrderByWithRelationInput
      | InventoryReservationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing InventoryReservations.
     */
    cursor?: InventoryReservationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InventoryReservations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InventoryReservations.
     */
    skip?: number;
    distinct?:
      | InventoryReservationScalarFieldEnum
      | InventoryReservationScalarFieldEnum[];
  };

  /**
   * InventoryReservation create
   */
  export type InventoryReservationCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationInclude<ExtArgs> | null;
    /**
     * The data needed to create a InventoryReservation.
     */
    data: XOR<
      InventoryReservationCreateInput,
      InventoryReservationUncheckedCreateInput
    >;
  };

  /**
   * InventoryReservation createMany
   */
  export type InventoryReservationCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many InventoryReservations.
     */
    data:
      | InventoryReservationCreateManyInput
      | InventoryReservationCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * InventoryReservation createManyAndReturn
   */
  export type InventoryReservationCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many InventoryReservations.
     */
    data:
      | InventoryReservationCreateManyInput
      | InventoryReservationCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * InventoryReservation update
   */
  export type InventoryReservationUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationInclude<ExtArgs> | null;
    /**
     * The data needed to update a InventoryReservation.
     */
    data: XOR<
      InventoryReservationUpdateInput,
      InventoryReservationUncheckedUpdateInput
    >;
    /**
     * Choose, which InventoryReservation to update.
     */
    where: InventoryReservationWhereUniqueInput;
  };

  /**
   * InventoryReservation updateMany
   */
  export type InventoryReservationUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update InventoryReservations.
     */
    data: XOR<
      InventoryReservationUpdateManyMutationInput,
      InventoryReservationUncheckedUpdateManyInput
    >;
    /**
     * Filter which InventoryReservations to update
     */
    where?: InventoryReservationWhereInput;
  };

  /**
   * InventoryReservation upsert
   */
  export type InventoryReservationUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationInclude<ExtArgs> | null;
    /**
     * The filter to search for the InventoryReservation to update in case it exists.
     */
    where: InventoryReservationWhereUniqueInput;
    /**
     * In case the InventoryReservation found by the `where` argument doesn't exist, create a new InventoryReservation with this data.
     */
    create: XOR<
      InventoryReservationCreateInput,
      InventoryReservationUncheckedCreateInput
    >;
    /**
     * In case the InventoryReservation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<
      InventoryReservationUpdateInput,
      InventoryReservationUncheckedUpdateInput
    >;
  };

  /**
   * InventoryReservation delete
   */
  export type InventoryReservationDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationInclude<ExtArgs> | null;
    /**
     * Filter which InventoryReservation to delete.
     */
    where: InventoryReservationWhereUniqueInput;
  };

  /**
   * InventoryReservation deleteMany
   */
  export type InventoryReservationDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which InventoryReservations to delete
     */
    where?: InventoryReservationWhereInput;
  };

  /**
   * InventoryReservation without action
   */
  export type InventoryReservationDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the InventoryReservation
     */
    select?: InventoryReservationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryReservationInclude<ExtArgs> | null;
  };

  /**
   * Model Category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null;
    _min: CategoryMinAggregateOutputType | null;
    _max: CategoryMaxAggregateOutputType | null;
  };

  export type CategoryMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    slug: string | null;
    description: string | null;
    parentId: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type CategoryMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    slug: string | null;
    description: string | null;
    parentId: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type CategoryCountAggregateOutputType = {
    id: number;
    name: number;
    slug: number;
    description: number;
    parentId: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type CategoryMinAggregateInputType = {
    id?: true;
    name?: true;
    slug?: true;
    description?: true;
    parentId?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type CategoryMaxAggregateInputType = {
    id?: true;
    name?: true;
    slug?: true;
    description?: true;
    parentId?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type CategoryCountAggregateInputType = {
    id?: true;
    name?: true;
    slug?: true;
    description?: true;
    parentId?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type CategoryAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Category to aggregate.
     */
    where?: CategoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Categories to fetch.
     */
    orderBy?:
      | CategoryOrderByWithRelationInput
      | CategoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: CategoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Categories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Categories
     **/
    _count?: true | CategoryCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: CategoryMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: CategoryMaxAggregateInputType;
  };

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
    [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>;
  };

  export type CategoryGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: CategoryWhereInput;
    orderBy?:
      | CategoryOrderByWithAggregationInput
      | CategoryOrderByWithAggregationInput[];
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum;
    having?: CategoryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CategoryCountAggregateInputType | true;
    _min?: CategoryMinAggregateInputType;
    _max?: CategoryMaxAggregateInputType;
  };

  export type CategoryGroupByOutputType = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: CategoryCountAggregateOutputType | null;
    _min: CategoryMinAggregateOutputType | null;
    _max: CategoryMaxAggregateOutputType | null;
  };

  type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<CategoryGroupByOutputType, T['by']> & {
          [P in keyof T & keyof CategoryGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>;
        }
      >
    >;

  export type CategorySelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      slug?: boolean;
      description?: boolean;
      parentId?: boolean;
      isActive?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      parent?: boolean | Category$parentArgs<ExtArgs>;
      children?: boolean | Category$childrenArgs<ExtArgs>;
      _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['category']
  >;

  export type CategorySelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      slug?: boolean;
      description?: boolean;
      parentId?: boolean;
      isActive?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      parent?: boolean | Category$parentArgs<ExtArgs>;
    },
    ExtArgs['result']['category']
  >;

  export type CategorySelectScalar = {
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    description?: boolean;
    parentId?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type CategoryInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    parent?: boolean | Category$parentArgs<ExtArgs>;
    children?: boolean | Category$childrenArgs<ExtArgs>;
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type CategoryIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    parent?: boolean | Category$parentArgs<ExtArgs>;
  };

  export type $CategoryPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Category';
    objects: {
      parent: Prisma.$CategoryPayload<ExtArgs> | null;
      children: Prisma.$CategoryPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        parentId: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['category']
    >;
    composites: {};
  };

  type CategoryGetPayload<
    S extends boolean | null | undefined | CategoryDefaultArgs,
  > = $Result.GetResult<Prisma.$CategoryPayload, S>;

  type CategoryCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<CategoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: CategoryCountAggregateInputType | true;
  };

  export interface CategoryDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Category'];
      meta: { name: 'Category' };
    };
    /**
     * Find zero or one Category that matches the filter.
     * @param {CategoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryFindUniqueArgs>(
      args: SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>
    ): Prisma__CategoryClient<
      $Result.GetResult<
        Prisma.$CategoryPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(
      args: SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__CategoryClient<
      $Result.GetResult<
        Prisma.$CategoryPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryFindFirstArgs>(
      args?: SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>
    ): Prisma__CategoryClient<
      $Result.GetResult<
        Prisma.$CategoryPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(
      args?: SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__CategoryClient<
      $Result.GetResult<
        Prisma.$CategoryPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     *
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     *
     */
    findMany<T extends CategoryFindManyArgs>(
      args?: SelectSubset<T, CategoryFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a Category.
     * @param {CategoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     *
     */
    create<T extends CategoryCreateArgs>(
      args: SelectSubset<T, CategoryCreateArgs<ExtArgs>>
    ): Prisma__CategoryClient<
      $Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many Categories.
     * @param {CategoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends CategoryCreateManyArgs>(
      args?: SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Categories and returns the data saved in the database.
     * @param {CategoryCreateManyAndReturnArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends CategoryCreateManyAndReturnArgs>(
      args?: SelectSubset<T, CategoryCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CategoryPayload<ExtArgs>,
        T,
        'createManyAndReturn'
      >
    >;

    /**
     * Delete a Category.
     * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     *
     */
    delete<T extends CategoryDeleteArgs>(
      args: SelectSubset<T, CategoryDeleteArgs<ExtArgs>>
    ): Prisma__CategoryClient<
      $Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one Category.
     * @param {CategoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends CategoryUpdateArgs>(
      args: SelectSubset<T, CategoryUpdateArgs<ExtArgs>>
    ): Prisma__CategoryClient<
      $Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more Categories.
     * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends CategoryDeleteManyArgs>(
      args?: SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends CategoryUpdateManyArgs>(
      args: SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one Category.
     * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends CategoryUpsertArgs>(
      args: SelectSubset<T, CategoryUpsertArgs<ExtArgs>>
    ): Prisma__CategoryClient<
      $Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
     **/
    count<T extends CategoryCountArgs>(
      args?: Subset<T, CategoryCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CategoryAggregateArgs>(
      args: Subset<T, CategoryAggregateArgs>
    ): Prisma.PrismaPromise<GetCategoryAggregateType<T>>;

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryGroupByArgs} args - Group by arguments.
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
      T extends CategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryGroupByArgs['orderBy'] }
        : { orderBy?: CategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetCategoryGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Category model
     */
    readonly fields: CategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    parent<T extends Category$parentArgs<ExtArgs> = {}>(
      args?: Subset<T, Category$parentArgs<ExtArgs>>
    ): Prisma__CategoryClient<
      $Result.GetResult<
        Prisma.$CategoryPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      > | null,
      null,
      ExtArgs
    >;
    children<T extends Category$childrenArgs<ExtArgs> = {}>(
      args?: Subset<T, Category$childrenArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, 'findMany'> | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Category model
   */
  interface CategoryFieldRefs {
    readonly id: FieldRef<'Category', 'String'>;
    readonly name: FieldRef<'Category', 'String'>;
    readonly slug: FieldRef<'Category', 'String'>;
    readonly description: FieldRef<'Category', 'String'>;
    readonly parentId: FieldRef<'Category', 'String'>;
    readonly isActive: FieldRef<'Category', 'Boolean'>;
    readonly createdAt: FieldRef<'Category', 'DateTime'>;
    readonly updatedAt: FieldRef<'Category', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Category findUnique
   */
  export type CategoryFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput;
  };

  /**
   * Category findUniqueOrThrow
   */
  export type CategoryFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput;
  };

  /**
   * Category findFirst
   */
  export type CategoryFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Categories to fetch.
     */
    orderBy?:
      | CategoryOrderByWithRelationInput
      | CategoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Categories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[];
  };

  /**
   * Category findFirstOrThrow
   */
  export type CategoryFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Categories to fetch.
     */
    orderBy?:
      | CategoryOrderByWithRelationInput
      | CategoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Categories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[];
  };

  /**
   * Category findMany
   */
  export type CategoryFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Categories to fetch.
     */
    orderBy?:
      | CategoryOrderByWithRelationInput
      | CategoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Categories.
     */
    cursor?: CategoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Categories.
     */
    skip?: number;
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[];
  };

  /**
   * Category create
   */
  export type CategoryCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * The data needed to create a Category.
     */
    data: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>;
  };

  /**
   * Category createMany
   */
  export type CategoryCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Category createManyAndReturn
   */
  export type CategoryCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Category update
   */
  export type CategoryUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * The data needed to update a Category.
     */
    data: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>;
    /**
     * Choose, which Category to update.
     */
    where: CategoryWhereUniqueInput;
  };

  /**
   * Category updateMany
   */
  export type CategoryUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Categories.
     */
    data: XOR<
      CategoryUpdateManyMutationInput,
      CategoryUncheckedUpdateManyInput
    >;
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput;
  };

  /**
   * Category upsert
   */
  export type CategoryUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * The filter to search for the Category to update in case it exists.
     */
    where: CategoryWhereUniqueInput;
    /**
     * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
     */
    create: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>;
    /**
     * In case the Category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>;
  };

  /**
   * Category delete
   */
  export type CategoryDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * Filter which Category to delete.
     */
    where: CategoryWhereUniqueInput;
  };

  /**
   * Category deleteMany
   */
  export type CategoryDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoryWhereInput;
  };

  /**
   * Category.parent
   */
  export type Category$parentArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    where?: CategoryWhereInput;
  };

  /**
   * Category.children
   */
  export type Category$childrenArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    where?: CategoryWhereInput;
    orderBy?:
      | CategoryOrderByWithRelationInput
      | CategoryOrderByWithRelationInput[];
    cursor?: CategoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[];
  };

  /**
   * Category without action
   */
  export type CategoryDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
  };

  /**
   * Model ShoppingCart
   */

  export type AggregateShoppingCart = {
    _count: ShoppingCartCountAggregateOutputType | null;
    _min: ShoppingCartMinAggregateOutputType | null;
    _max: ShoppingCartMaxAggregateOutputType | null;
  };

  export type ShoppingCartMinAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    updatedAt: Date | null;
  };

  export type ShoppingCartMaxAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    updatedAt: Date | null;
  };

  export type ShoppingCartCountAggregateOutputType = {
    id: number;
    customerId: number;
    updatedAt: number;
    _all: number;
  };

  export type ShoppingCartMinAggregateInputType = {
    id?: true;
    customerId?: true;
    updatedAt?: true;
  };

  export type ShoppingCartMaxAggregateInputType = {
    id?: true;
    customerId?: true;
    updatedAt?: true;
  };

  export type ShoppingCartCountAggregateInputType = {
    id?: true;
    customerId?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type ShoppingCartAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ShoppingCart to aggregate.
     */
    where?: ShoppingCartWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ShoppingCarts to fetch.
     */
    orderBy?:
      | ShoppingCartOrderByWithRelationInput
      | ShoppingCartOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ShoppingCartWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ShoppingCarts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ShoppingCarts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ShoppingCarts
     **/
    _count?: true | ShoppingCartCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ShoppingCartMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ShoppingCartMaxAggregateInputType;
  };

  export type GetShoppingCartAggregateType<
    T extends ShoppingCartAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateShoppingCart]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShoppingCart[P]>
      : GetScalarType<T[P], AggregateShoppingCart[P]>;
  };

  export type ShoppingCartGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ShoppingCartWhereInput;
    orderBy?:
      | ShoppingCartOrderByWithAggregationInput
      | ShoppingCartOrderByWithAggregationInput[];
    by: ShoppingCartScalarFieldEnum[] | ShoppingCartScalarFieldEnum;
    having?: ShoppingCartScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ShoppingCartCountAggregateInputType | true;
    _min?: ShoppingCartMinAggregateInputType;
    _max?: ShoppingCartMaxAggregateInputType;
  };

  export type ShoppingCartGroupByOutputType = {
    id: string;
    customerId: string;
    updatedAt: Date;
    _count: ShoppingCartCountAggregateOutputType | null;
    _min: ShoppingCartMinAggregateOutputType | null;
    _max: ShoppingCartMaxAggregateOutputType | null;
  };

  type GetShoppingCartGroupByPayload<T extends ShoppingCartGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<ShoppingCartGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof ShoppingCartGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ShoppingCartGroupByOutputType[P]>
            : GetScalarType<T[P], ShoppingCartGroupByOutputType[P]>;
        }
      >
    >;

  export type ShoppingCartSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      customerId?: boolean;
      updatedAt?: boolean;
      items?: boolean | ShoppingCart$itemsArgs<ExtArgs>;
      _count?: boolean | ShoppingCartCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['shoppingCart']
  >;

  export type ShoppingCartSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      customerId?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['shoppingCart']
  >;

  export type ShoppingCartSelectScalar = {
    id?: boolean;
    customerId?: boolean;
    updatedAt?: boolean;
  };

  export type ShoppingCartInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    items?: boolean | ShoppingCart$itemsArgs<ExtArgs>;
    _count?: boolean | ShoppingCartCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type ShoppingCartIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $ShoppingCartPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'ShoppingCart';
    objects: {
      items: Prisma.$CartItemPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        customerId: string;
        updatedAt: Date;
      },
      ExtArgs['result']['shoppingCart']
    >;
    composites: {};
  };

  type ShoppingCartGetPayload<
    S extends boolean | null | undefined | ShoppingCartDefaultArgs,
  > = $Result.GetResult<Prisma.$ShoppingCartPayload, S>;

  type ShoppingCartCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<ShoppingCartFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: ShoppingCartCountAggregateInputType | true;
  };

  export interface ShoppingCartDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['ShoppingCart'];
      meta: { name: 'ShoppingCart' };
    };
    /**
     * Find zero or one ShoppingCart that matches the filter.
     * @param {ShoppingCartFindUniqueArgs} args - Arguments to find a ShoppingCart
     * @example
     * // Get one ShoppingCart
     * const shoppingCart = await prisma.shoppingCart.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShoppingCartFindUniqueArgs>(
      args: SelectSubset<T, ShoppingCartFindUniqueArgs<ExtArgs>>
    ): Prisma__ShoppingCartClient<
      $Result.GetResult<
        Prisma.$ShoppingCartPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find one ShoppingCart that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ShoppingCartFindUniqueOrThrowArgs} args - Arguments to find a ShoppingCart
     * @example
     * // Get one ShoppingCart
     * const shoppingCart = await prisma.shoppingCart.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShoppingCartFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ShoppingCartFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ShoppingCartClient<
      $Result.GetResult<
        Prisma.$ShoppingCartPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find the first ShoppingCart that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShoppingCartFindFirstArgs} args - Arguments to find a ShoppingCart
     * @example
     * // Get one ShoppingCart
     * const shoppingCart = await prisma.shoppingCart.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShoppingCartFindFirstArgs>(
      args?: SelectSubset<T, ShoppingCartFindFirstArgs<ExtArgs>>
    ): Prisma__ShoppingCartClient<
      $Result.GetResult<
        Prisma.$ShoppingCartPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first ShoppingCart that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShoppingCartFindFirstOrThrowArgs} args - Arguments to find a ShoppingCart
     * @example
     * // Get one ShoppingCart
     * const shoppingCart = await prisma.shoppingCart.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShoppingCartFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ShoppingCartFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ShoppingCartClient<
      $Result.GetResult<
        Prisma.$ShoppingCartPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more ShoppingCarts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShoppingCartFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ShoppingCarts
     * const shoppingCarts = await prisma.shoppingCart.findMany()
     *
     * // Get first 10 ShoppingCarts
     * const shoppingCarts = await prisma.shoppingCart.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const shoppingCartWithIdOnly = await prisma.shoppingCart.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ShoppingCartFindManyArgs>(
      args?: SelectSubset<T, ShoppingCartFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ShoppingCartPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a ShoppingCart.
     * @param {ShoppingCartCreateArgs} args - Arguments to create a ShoppingCart.
     * @example
     * // Create one ShoppingCart
     * const ShoppingCart = await prisma.shoppingCart.create({
     *   data: {
     *     // ... data to create a ShoppingCart
     *   }
     * })
     *
     */
    create<T extends ShoppingCartCreateArgs>(
      args: SelectSubset<T, ShoppingCartCreateArgs<ExtArgs>>
    ): Prisma__ShoppingCartClient<
      $Result.GetResult<Prisma.$ShoppingCartPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many ShoppingCarts.
     * @param {ShoppingCartCreateManyArgs} args - Arguments to create many ShoppingCarts.
     * @example
     * // Create many ShoppingCarts
     * const shoppingCart = await prisma.shoppingCart.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ShoppingCartCreateManyArgs>(
      args?: SelectSubset<T, ShoppingCartCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many ShoppingCarts and returns the data saved in the database.
     * @param {ShoppingCartCreateManyAndReturnArgs} args - Arguments to create many ShoppingCarts.
     * @example
     * // Create many ShoppingCarts
     * const shoppingCart = await prisma.shoppingCart.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ShoppingCarts and only return the `id`
     * const shoppingCartWithIdOnly = await prisma.shoppingCart.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ShoppingCartCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ShoppingCartCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ShoppingCartPayload<ExtArgs>,
        T,
        'createManyAndReturn'
      >
    >;

    /**
     * Delete a ShoppingCart.
     * @param {ShoppingCartDeleteArgs} args - Arguments to delete one ShoppingCart.
     * @example
     * // Delete one ShoppingCart
     * const ShoppingCart = await prisma.shoppingCart.delete({
     *   where: {
     *     // ... filter to delete one ShoppingCart
     *   }
     * })
     *
     */
    delete<T extends ShoppingCartDeleteArgs>(
      args: SelectSubset<T, ShoppingCartDeleteArgs<ExtArgs>>
    ): Prisma__ShoppingCartClient<
      $Result.GetResult<Prisma.$ShoppingCartPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one ShoppingCart.
     * @param {ShoppingCartUpdateArgs} args - Arguments to update one ShoppingCart.
     * @example
     * // Update one ShoppingCart
     * const shoppingCart = await prisma.shoppingCart.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ShoppingCartUpdateArgs>(
      args: SelectSubset<T, ShoppingCartUpdateArgs<ExtArgs>>
    ): Prisma__ShoppingCartClient<
      $Result.GetResult<Prisma.$ShoppingCartPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more ShoppingCarts.
     * @param {ShoppingCartDeleteManyArgs} args - Arguments to filter ShoppingCarts to delete.
     * @example
     * // Delete a few ShoppingCarts
     * const { count } = await prisma.shoppingCart.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ShoppingCartDeleteManyArgs>(
      args?: SelectSubset<T, ShoppingCartDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more ShoppingCarts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShoppingCartUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ShoppingCarts
     * const shoppingCart = await prisma.shoppingCart.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ShoppingCartUpdateManyArgs>(
      args: SelectSubset<T, ShoppingCartUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one ShoppingCart.
     * @param {ShoppingCartUpsertArgs} args - Arguments to update or create a ShoppingCart.
     * @example
     * // Update or create a ShoppingCart
     * const shoppingCart = await prisma.shoppingCart.upsert({
     *   create: {
     *     // ... data to create a ShoppingCart
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ShoppingCart we want to update
     *   }
     * })
     */
    upsert<T extends ShoppingCartUpsertArgs>(
      args: SelectSubset<T, ShoppingCartUpsertArgs<ExtArgs>>
    ): Prisma__ShoppingCartClient<
      $Result.GetResult<Prisma.$ShoppingCartPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of ShoppingCarts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShoppingCartCountArgs} args - Arguments to filter ShoppingCarts to count.
     * @example
     * // Count the number of ShoppingCarts
     * const count = await prisma.shoppingCart.count({
     *   where: {
     *     // ... the filter for the ShoppingCarts we want to count
     *   }
     * })
     **/
    count<T extends ShoppingCartCountArgs>(
      args?: Subset<T, ShoppingCartCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShoppingCartCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a ShoppingCart.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShoppingCartAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ShoppingCartAggregateArgs>(
      args: Subset<T, ShoppingCartAggregateArgs>
    ): Prisma.PrismaPromise<GetShoppingCartAggregateType<T>>;

    /**
     * Group by ShoppingCart.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShoppingCartGroupByArgs} args - Group by arguments.
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
      T extends ShoppingCartGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShoppingCartGroupByArgs['orderBy'] }
        : { orderBy?: ShoppingCartGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ShoppingCartGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetShoppingCartGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ShoppingCart model
     */
    readonly fields: ShoppingCartFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ShoppingCart.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShoppingCartClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    items<T extends ShoppingCart$itemsArgs<ExtArgs> = {}>(
      args?: Subset<T, ShoppingCart$itemsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, 'findMany'> | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the ShoppingCart model
   */
  interface ShoppingCartFieldRefs {
    readonly id: FieldRef<'ShoppingCart', 'String'>;
    readonly customerId: FieldRef<'ShoppingCart', 'String'>;
    readonly updatedAt: FieldRef<'ShoppingCart', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * ShoppingCart findUnique
   */
  export type ShoppingCartFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ShoppingCart
     */
    select?: ShoppingCartSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShoppingCartInclude<ExtArgs> | null;
    /**
     * Filter, which ShoppingCart to fetch.
     */
    where: ShoppingCartWhereUniqueInput;
  };

  /**
   * ShoppingCart findUniqueOrThrow
   */
  export type ShoppingCartFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ShoppingCart
     */
    select?: ShoppingCartSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShoppingCartInclude<ExtArgs> | null;
    /**
     * Filter, which ShoppingCart to fetch.
     */
    where: ShoppingCartWhereUniqueInput;
  };

  /**
   * ShoppingCart findFirst
   */
  export type ShoppingCartFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ShoppingCart
     */
    select?: ShoppingCartSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShoppingCartInclude<ExtArgs> | null;
    /**
     * Filter, which ShoppingCart to fetch.
     */
    where?: ShoppingCartWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ShoppingCarts to fetch.
     */
    orderBy?:
      | ShoppingCartOrderByWithRelationInput
      | ShoppingCartOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ShoppingCarts.
     */
    cursor?: ShoppingCartWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ShoppingCarts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ShoppingCarts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ShoppingCarts.
     */
    distinct?: ShoppingCartScalarFieldEnum | ShoppingCartScalarFieldEnum[];
  };

  /**
   * ShoppingCart findFirstOrThrow
   */
  export type ShoppingCartFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ShoppingCart
     */
    select?: ShoppingCartSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShoppingCartInclude<ExtArgs> | null;
    /**
     * Filter, which ShoppingCart to fetch.
     */
    where?: ShoppingCartWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ShoppingCarts to fetch.
     */
    orderBy?:
      | ShoppingCartOrderByWithRelationInput
      | ShoppingCartOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ShoppingCarts.
     */
    cursor?: ShoppingCartWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ShoppingCarts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ShoppingCarts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ShoppingCarts.
     */
    distinct?: ShoppingCartScalarFieldEnum | ShoppingCartScalarFieldEnum[];
  };

  /**
   * ShoppingCart findMany
   */
  export type ShoppingCartFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ShoppingCart
     */
    select?: ShoppingCartSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShoppingCartInclude<ExtArgs> | null;
    /**
     * Filter, which ShoppingCarts to fetch.
     */
    where?: ShoppingCartWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ShoppingCarts to fetch.
     */
    orderBy?:
      | ShoppingCartOrderByWithRelationInput
      | ShoppingCartOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ShoppingCarts.
     */
    cursor?: ShoppingCartWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ShoppingCarts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ShoppingCarts.
     */
    skip?: number;
    distinct?: ShoppingCartScalarFieldEnum | ShoppingCartScalarFieldEnum[];
  };

  /**
   * ShoppingCart create
   */
  export type ShoppingCartCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ShoppingCart
     */
    select?: ShoppingCartSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShoppingCartInclude<ExtArgs> | null;
    /**
     * The data needed to create a ShoppingCart.
     */
    data: XOR<ShoppingCartCreateInput, ShoppingCartUncheckedCreateInput>;
  };

  /**
   * ShoppingCart createMany
   */
  export type ShoppingCartCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many ShoppingCarts.
     */
    data: ShoppingCartCreateManyInput | ShoppingCartCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * ShoppingCart createManyAndReturn
   */
  export type ShoppingCartCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ShoppingCart
     */
    select?: ShoppingCartSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many ShoppingCarts.
     */
    data: ShoppingCartCreateManyInput | ShoppingCartCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * ShoppingCart update
   */
  export type ShoppingCartUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ShoppingCart
     */
    select?: ShoppingCartSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShoppingCartInclude<ExtArgs> | null;
    /**
     * The data needed to update a ShoppingCart.
     */
    data: XOR<ShoppingCartUpdateInput, ShoppingCartUncheckedUpdateInput>;
    /**
     * Choose, which ShoppingCart to update.
     */
    where: ShoppingCartWhereUniqueInput;
  };

  /**
   * ShoppingCart updateMany
   */
  export type ShoppingCartUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update ShoppingCarts.
     */
    data: XOR<
      ShoppingCartUpdateManyMutationInput,
      ShoppingCartUncheckedUpdateManyInput
    >;
    /**
     * Filter which ShoppingCarts to update
     */
    where?: ShoppingCartWhereInput;
  };

  /**
   * ShoppingCart upsert
   */
  export type ShoppingCartUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ShoppingCart
     */
    select?: ShoppingCartSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShoppingCartInclude<ExtArgs> | null;
    /**
     * The filter to search for the ShoppingCart to update in case it exists.
     */
    where: ShoppingCartWhereUniqueInput;
    /**
     * In case the ShoppingCart found by the `where` argument doesn't exist, create a new ShoppingCart with this data.
     */
    create: XOR<ShoppingCartCreateInput, ShoppingCartUncheckedCreateInput>;
    /**
     * In case the ShoppingCart was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShoppingCartUpdateInput, ShoppingCartUncheckedUpdateInput>;
  };

  /**
   * ShoppingCart delete
   */
  export type ShoppingCartDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ShoppingCart
     */
    select?: ShoppingCartSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShoppingCartInclude<ExtArgs> | null;
    /**
     * Filter which ShoppingCart to delete.
     */
    where: ShoppingCartWhereUniqueInput;
  };

  /**
   * ShoppingCart deleteMany
   */
  export type ShoppingCartDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ShoppingCarts to delete
     */
    where?: ShoppingCartWhereInput;
  };

  /**
   * ShoppingCart.items
   */
  export type ShoppingCart$itemsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null;
    where?: CartItemWhereInput;
    orderBy?:
      | CartItemOrderByWithRelationInput
      | CartItemOrderByWithRelationInput[];
    cursor?: CartItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[];
  };

  /**
   * ShoppingCart without action
   */
  export type ShoppingCartDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ShoppingCart
     */
    select?: ShoppingCartSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShoppingCartInclude<ExtArgs> | null;
  };

  /**
   * Model CartItem
   */

  export type AggregateCartItem = {
    _count: CartItemCountAggregateOutputType | null;
    _avg: CartItemAvgAggregateOutputType | null;
    _sum: CartItemSumAggregateOutputType | null;
    _min: CartItemMinAggregateOutputType | null;
    _max: CartItemMaxAggregateOutputType | null;
  };

  export type CartItemAvgAggregateOutputType = {
    quantity: number | null;
    price: number | null;
  };

  export type CartItemSumAggregateOutputType = {
    quantity: number | null;
    price: number | null;
  };

  export type CartItemMinAggregateOutputType = {
    id: string | null;
    cartId: string | null;
    productId: string | null;
    quantity: number | null;
    price: number | null;
    addedAt: Date | null;
  };

  export type CartItemMaxAggregateOutputType = {
    id: string | null;
    cartId: string | null;
    productId: string | null;
    quantity: number | null;
    price: number | null;
    addedAt: Date | null;
  };

  export type CartItemCountAggregateOutputType = {
    id: number;
    cartId: number;
    productId: number;
    quantity: number;
    price: number;
    addedAt: number;
    _all: number;
  };

  export type CartItemAvgAggregateInputType = {
    quantity?: true;
    price?: true;
  };

  export type CartItemSumAggregateInputType = {
    quantity?: true;
    price?: true;
  };

  export type CartItemMinAggregateInputType = {
    id?: true;
    cartId?: true;
    productId?: true;
    quantity?: true;
    price?: true;
    addedAt?: true;
  };

  export type CartItemMaxAggregateInputType = {
    id?: true;
    cartId?: true;
    productId?: true;
    quantity?: true;
    price?: true;
    addedAt?: true;
  };

  export type CartItemCountAggregateInputType = {
    id?: true;
    cartId?: true;
    productId?: true;
    quantity?: true;
    price?: true;
    addedAt?: true;
    _all?: true;
  };

  export type CartItemAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which CartItem to aggregate.
     */
    where?: CartItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of CartItems to fetch.
     */
    orderBy?:
      | CartItemOrderByWithRelationInput
      | CartItemOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: CartItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` CartItems from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` CartItems.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned CartItems
     **/
    _count?: true | CartItemCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: CartItemAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: CartItemSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: CartItemMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: CartItemMaxAggregateInputType;
  };

  export type GetCartItemAggregateType<T extends CartItemAggregateArgs> = {
    [P in keyof T & keyof AggregateCartItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCartItem[P]>
      : GetScalarType<T[P], AggregateCartItem[P]>;
  };

  export type CartItemGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: CartItemWhereInput;
    orderBy?:
      | CartItemOrderByWithAggregationInput
      | CartItemOrderByWithAggregationInput[];
    by: CartItemScalarFieldEnum[] | CartItemScalarFieldEnum;
    having?: CartItemScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CartItemCountAggregateInputType | true;
    _avg?: CartItemAvgAggregateInputType;
    _sum?: CartItemSumAggregateInputType;
    _min?: CartItemMinAggregateInputType;
    _max?: CartItemMaxAggregateInputType;
  };

  export type CartItemGroupByOutputType = {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    price: number;
    addedAt: Date;
    _count: CartItemCountAggregateOutputType | null;
    _avg: CartItemAvgAggregateOutputType | null;
    _sum: CartItemSumAggregateOutputType | null;
    _min: CartItemMinAggregateOutputType | null;
    _max: CartItemMaxAggregateOutputType | null;
  };

  type GetCartItemGroupByPayload<T extends CartItemGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<CartItemGroupByOutputType, T['by']> & {
          [P in keyof T & keyof CartItemGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CartItemGroupByOutputType[P]>
            : GetScalarType<T[P], CartItemGroupByOutputType[P]>;
        }
      >
    >;

  export type CartItemSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      cartId?: boolean;
      productId?: boolean;
      quantity?: boolean;
      price?: boolean;
      addedAt?: boolean;
      cart?: boolean | ShoppingCartDefaultArgs<ExtArgs>;
      product?: boolean | ProductDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['cartItem']
  >;

  export type CartItemSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      cartId?: boolean;
      productId?: boolean;
      quantity?: boolean;
      price?: boolean;
      addedAt?: boolean;
      cart?: boolean | ShoppingCartDefaultArgs<ExtArgs>;
      product?: boolean | ProductDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['cartItem']
  >;

  export type CartItemSelectScalar = {
    id?: boolean;
    cartId?: boolean;
    productId?: boolean;
    quantity?: boolean;
    price?: boolean;
    addedAt?: boolean;
  };

  export type CartItemInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    cart?: boolean | ShoppingCartDefaultArgs<ExtArgs>;
    product?: boolean | ProductDefaultArgs<ExtArgs>;
  };
  export type CartItemIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    cart?: boolean | ShoppingCartDefaultArgs<ExtArgs>;
    product?: boolean | ProductDefaultArgs<ExtArgs>;
  };

  export type $CartItemPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'CartItem';
    objects: {
      cart: Prisma.$ShoppingCartPayload<ExtArgs>;
      product: Prisma.$ProductPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        cartId: string;
        productId: string;
        quantity: number;
        price: number;
        addedAt: Date;
      },
      ExtArgs['result']['cartItem']
    >;
    composites: {};
  };

  type CartItemGetPayload<
    S extends boolean | null | undefined | CartItemDefaultArgs,
  > = $Result.GetResult<Prisma.$CartItemPayload, S>;

  type CartItemCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<CartItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: CartItemCountAggregateInputType | true;
  };

  export interface CartItemDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['CartItem'];
      meta: { name: 'CartItem' };
    };
    /**
     * Find zero or one CartItem that matches the filter.
     * @param {CartItemFindUniqueArgs} args - Arguments to find a CartItem
     * @example
     * // Get one CartItem
     * const cartItem = await prisma.cartItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CartItemFindUniqueArgs>(
      args: SelectSubset<T, CartItemFindUniqueArgs<ExtArgs>>
    ): Prisma__CartItemClient<
      $Result.GetResult<
        Prisma.$CartItemPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find one CartItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CartItemFindUniqueOrThrowArgs} args - Arguments to find a CartItem
     * @example
     * // Get one CartItem
     * const cartItem = await prisma.cartItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CartItemFindUniqueOrThrowArgs>(
      args: SelectSubset<T, CartItemFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__CartItemClient<
      $Result.GetResult<
        Prisma.$CartItemPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find the first CartItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemFindFirstArgs} args - Arguments to find a CartItem
     * @example
     * // Get one CartItem
     * const cartItem = await prisma.cartItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CartItemFindFirstArgs>(
      args?: SelectSubset<T, CartItemFindFirstArgs<ExtArgs>>
    ): Prisma__CartItemClient<
      $Result.GetResult<
        Prisma.$CartItemPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first CartItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemFindFirstOrThrowArgs} args - Arguments to find a CartItem
     * @example
     * // Get one CartItem
     * const cartItem = await prisma.cartItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CartItemFindFirstOrThrowArgs>(
      args?: SelectSubset<T, CartItemFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__CartItemClient<
      $Result.GetResult<
        Prisma.$CartItemPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more CartItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CartItems
     * const cartItems = await prisma.cartItem.findMany()
     *
     * // Get first 10 CartItems
     * const cartItems = await prisma.cartItem.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const cartItemWithIdOnly = await prisma.cartItem.findMany({ select: { id: true } })
     *
     */
    findMany<T extends CartItemFindManyArgs>(
      args?: SelectSubset<T, CartItemFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a CartItem.
     * @param {CartItemCreateArgs} args - Arguments to create a CartItem.
     * @example
     * // Create one CartItem
     * const CartItem = await prisma.cartItem.create({
     *   data: {
     *     // ... data to create a CartItem
     *   }
     * })
     *
     */
    create<T extends CartItemCreateArgs>(
      args: SelectSubset<T, CartItemCreateArgs<ExtArgs>>
    ): Prisma__CartItemClient<
      $Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many CartItems.
     * @param {CartItemCreateManyArgs} args - Arguments to create many CartItems.
     * @example
     * // Create many CartItems
     * const cartItem = await prisma.cartItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends CartItemCreateManyArgs>(
      args?: SelectSubset<T, CartItemCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many CartItems and returns the data saved in the database.
     * @param {CartItemCreateManyAndReturnArgs} args - Arguments to create many CartItems.
     * @example
     * // Create many CartItems
     * const cartItem = await prisma.cartItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many CartItems and only return the `id`
     * const cartItemWithIdOnly = await prisma.cartItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends CartItemCreateManyAndReturnArgs>(
      args?: SelectSubset<T, CartItemCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CartItemPayload<ExtArgs>,
        T,
        'createManyAndReturn'
      >
    >;

    /**
     * Delete a CartItem.
     * @param {CartItemDeleteArgs} args - Arguments to delete one CartItem.
     * @example
     * // Delete one CartItem
     * const CartItem = await prisma.cartItem.delete({
     *   where: {
     *     // ... filter to delete one CartItem
     *   }
     * })
     *
     */
    delete<T extends CartItemDeleteArgs>(
      args: SelectSubset<T, CartItemDeleteArgs<ExtArgs>>
    ): Prisma__CartItemClient<
      $Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one CartItem.
     * @param {CartItemUpdateArgs} args - Arguments to update one CartItem.
     * @example
     * // Update one CartItem
     * const cartItem = await prisma.cartItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends CartItemUpdateArgs>(
      args: SelectSubset<T, CartItemUpdateArgs<ExtArgs>>
    ): Prisma__CartItemClient<
      $Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more CartItems.
     * @param {CartItemDeleteManyArgs} args - Arguments to filter CartItems to delete.
     * @example
     * // Delete a few CartItems
     * const { count } = await prisma.cartItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends CartItemDeleteManyArgs>(
      args?: SelectSubset<T, CartItemDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more CartItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CartItems
     * const cartItem = await prisma.cartItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends CartItemUpdateManyArgs>(
      args: SelectSubset<T, CartItemUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one CartItem.
     * @param {CartItemUpsertArgs} args - Arguments to update or create a CartItem.
     * @example
     * // Update or create a CartItem
     * const cartItem = await prisma.cartItem.upsert({
     *   create: {
     *     // ... data to create a CartItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CartItem we want to update
     *   }
     * })
     */
    upsert<T extends CartItemUpsertArgs>(
      args: SelectSubset<T, CartItemUpsertArgs<ExtArgs>>
    ): Prisma__CartItemClient<
      $Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of CartItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemCountArgs} args - Arguments to filter CartItems to count.
     * @example
     * // Count the number of CartItems
     * const count = await prisma.cartItem.count({
     *   where: {
     *     // ... the filter for the CartItems we want to count
     *   }
     * })
     **/
    count<T extends CartItemCountArgs>(
      args?: Subset<T, CartItemCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CartItemCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a CartItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CartItemAggregateArgs>(
      args: Subset<T, CartItemAggregateArgs>
    ): Prisma.PrismaPromise<GetCartItemAggregateType<T>>;

    /**
     * Group by CartItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemGroupByArgs} args - Group by arguments.
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
      T extends CartItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CartItemGroupByArgs['orderBy'] }
        : { orderBy?: CartItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, CartItemGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetCartItemGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the CartItem model
     */
    readonly fields: CartItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CartItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CartItemClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    cart<T extends ShoppingCartDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ShoppingCartDefaultArgs<ExtArgs>>
    ): Prisma__ShoppingCartClient<
      | $Result.GetResult<
          Prisma.$ShoppingCartPayload<ExtArgs>,
          T,
          'findUniqueOrThrow'
        >
      | Null,
      Null,
      ExtArgs
    >;
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ProductDefaultArgs<ExtArgs>>
    ): Prisma__ProductClient<
      | $Result.GetResult<
          Prisma.$ProductPayload<ExtArgs>,
          T,
          'findUniqueOrThrow'
        >
      | Null,
      Null,
      ExtArgs
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the CartItem model
   */
  interface CartItemFieldRefs {
    readonly id: FieldRef<'CartItem', 'String'>;
    readonly cartId: FieldRef<'CartItem', 'String'>;
    readonly productId: FieldRef<'CartItem', 'String'>;
    readonly quantity: FieldRef<'CartItem', 'Int'>;
    readonly price: FieldRef<'CartItem', 'Float'>;
    readonly addedAt: FieldRef<'CartItem', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * CartItem findUnique
   */
  export type CartItemFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null;
    /**
     * Filter, which CartItem to fetch.
     */
    where: CartItemWhereUniqueInput;
  };

  /**
   * CartItem findUniqueOrThrow
   */
  export type CartItemFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null;
    /**
     * Filter, which CartItem to fetch.
     */
    where: CartItemWhereUniqueInput;
  };

  /**
   * CartItem findFirst
   */
  export type CartItemFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null;
    /**
     * Filter, which CartItem to fetch.
     */
    where?: CartItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of CartItems to fetch.
     */
    orderBy?:
      | CartItemOrderByWithRelationInput
      | CartItemOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for CartItems.
     */
    cursor?: CartItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` CartItems from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` CartItems.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of CartItems.
     */
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[];
  };

  /**
   * CartItem findFirstOrThrow
   */
  export type CartItemFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null;
    /**
     * Filter, which CartItem to fetch.
     */
    where?: CartItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of CartItems to fetch.
     */
    orderBy?:
      | CartItemOrderByWithRelationInput
      | CartItemOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for CartItems.
     */
    cursor?: CartItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` CartItems from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` CartItems.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of CartItems.
     */
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[];
  };

  /**
   * CartItem findMany
   */
  export type CartItemFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null;
    /**
     * Filter, which CartItems to fetch.
     */
    where?: CartItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of CartItems to fetch.
     */
    orderBy?:
      | CartItemOrderByWithRelationInput
      | CartItemOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing CartItems.
     */
    cursor?: CartItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` CartItems from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` CartItems.
     */
    skip?: number;
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[];
  };

  /**
   * CartItem create
   */
  export type CartItemCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null;
    /**
     * The data needed to create a CartItem.
     */
    data: XOR<CartItemCreateInput, CartItemUncheckedCreateInput>;
  };

  /**
   * CartItem createMany
   */
  export type CartItemCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many CartItems.
     */
    data: CartItemCreateManyInput | CartItemCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * CartItem createManyAndReturn
   */
  export type CartItemCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many CartItems.
     */
    data: CartItemCreateManyInput | CartItemCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * CartItem update
   */
  export type CartItemUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null;
    /**
     * The data needed to update a CartItem.
     */
    data: XOR<CartItemUpdateInput, CartItemUncheckedUpdateInput>;
    /**
     * Choose, which CartItem to update.
     */
    where: CartItemWhereUniqueInput;
  };

  /**
   * CartItem updateMany
   */
  export type CartItemUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update CartItems.
     */
    data: XOR<
      CartItemUpdateManyMutationInput,
      CartItemUncheckedUpdateManyInput
    >;
    /**
     * Filter which CartItems to update
     */
    where?: CartItemWhereInput;
  };

  /**
   * CartItem upsert
   */
  export type CartItemUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null;
    /**
     * The filter to search for the CartItem to update in case it exists.
     */
    where: CartItemWhereUniqueInput;
    /**
     * In case the CartItem found by the `where` argument doesn't exist, create a new CartItem with this data.
     */
    create: XOR<CartItemCreateInput, CartItemUncheckedCreateInput>;
    /**
     * In case the CartItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CartItemUpdateInput, CartItemUncheckedUpdateInput>;
  };

  /**
   * CartItem delete
   */
  export type CartItemDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null;
    /**
     * Filter which CartItem to delete.
     */
    where: CartItemWhereUniqueInput;
  };

  /**
   * CartItem deleteMany
   */
  export type CartItemDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which CartItems to delete
     */
    where?: CartItemWhereInput;
  };

  /**
   * CartItem without action
   */
  export type CartItemDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null;
  };

  /**
   * Model Order
   */

  export type AggregateOrder = {
    _count: OrderCountAggregateOutputType | null;
    _avg: OrderAvgAggregateOutputType | null;
    _sum: OrderSumAggregateOutputType | null;
    _min: OrderMinAggregateOutputType | null;
    _max: OrderMaxAggregateOutputType | null;
  };

  export type OrderAvgAggregateOutputType = {
    subtotal: number | null;
    tax: number | null;
    shipping: number | null;
    total: number | null;
  };

  export type OrderSumAggregateOutputType = {
    subtotal: number | null;
    tax: number | null;
    shipping: number | null;
    total: number | null;
  };

  export type OrderMinAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    status: $Enums.OrderStatus | null;
    subtotal: number | null;
    tax: number | null;
    shipping: number | null;
    total: number | null;
    paymentMethod: string | null;
    paymentStatus: $Enums.PaymentStatus | null;
    paymentIntentId: string | null;
    notes: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type OrderMaxAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    status: $Enums.OrderStatus | null;
    subtotal: number | null;
    tax: number | null;
    shipping: number | null;
    total: number | null;
    paymentMethod: string | null;
    paymentStatus: $Enums.PaymentStatus | null;
    paymentIntentId: string | null;
    notes: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type OrderCountAggregateOutputType = {
    id: number;
    customerId: number;
    status: number;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shippingAddress: number;
    paymentMethod: number;
    paymentStatus: number;
    paymentIntentId: number;
    notes: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type OrderAvgAggregateInputType = {
    subtotal?: true;
    tax?: true;
    shipping?: true;
    total?: true;
  };

  export type OrderSumAggregateInputType = {
    subtotal?: true;
    tax?: true;
    shipping?: true;
    total?: true;
  };

  export type OrderMinAggregateInputType = {
    id?: true;
    customerId?: true;
    status?: true;
    subtotal?: true;
    tax?: true;
    shipping?: true;
    total?: true;
    paymentMethod?: true;
    paymentStatus?: true;
    paymentIntentId?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type OrderMaxAggregateInputType = {
    id?: true;
    customerId?: true;
    status?: true;
    subtotal?: true;
    tax?: true;
    shipping?: true;
    total?: true;
    paymentMethod?: true;
    paymentStatus?: true;
    paymentIntentId?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type OrderCountAggregateInputType = {
    id?: true;
    customerId?: true;
    status?: true;
    subtotal?: true;
    tax?: true;
    shipping?: true;
    total?: true;
    shippingAddress?: true;
    paymentMethod?: true;
    paymentStatus?: true;
    paymentIntentId?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type OrderAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Order to aggregate.
     */
    where?: OrderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: OrderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Orders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Orders
     **/
    _count?: true | OrderCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: OrderAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: OrderSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: OrderMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: OrderMaxAggregateInputType;
  };

  export type GetOrderAggregateType<T extends OrderAggregateArgs> = {
    [P in keyof T & keyof AggregateOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrder[P]>
      : GetScalarType<T[P], AggregateOrder[P]>;
  };

  export type OrderGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: OrderWhereInput;
    orderBy?:
      | OrderOrderByWithAggregationInput
      | OrderOrderByWithAggregationInput[];
    by: OrderScalarFieldEnum[] | OrderScalarFieldEnum;
    having?: OrderScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OrderCountAggregateInputType | true;
    _avg?: OrderAvgAggregateInputType;
    _sum?: OrderSumAggregateInputType;
    _min?: OrderMinAggregateInputType;
    _max?: OrderMaxAggregateInputType;
  };

  export type OrderGroupByOutputType = {
    id: string;
    customerId: string;
    status: $Enums.OrderStatus;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shippingAddress: JsonValue;
    paymentMethod: string;
    paymentStatus: $Enums.PaymentStatus;
    paymentIntentId: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: OrderCountAggregateOutputType | null;
    _avg: OrderAvgAggregateOutputType | null;
    _sum: OrderSumAggregateOutputType | null;
    _min: OrderMinAggregateOutputType | null;
    _max: OrderMaxAggregateOutputType | null;
  };

  type GetOrderGroupByPayload<T extends OrderGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<OrderGroupByOutputType, T['by']> & {
          [P in keyof T & keyof OrderGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderGroupByOutputType[P]>
            : GetScalarType<T[P], OrderGroupByOutputType[P]>;
        }
      >
    >;

  export type OrderSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      customerId?: boolean;
      status?: boolean;
      subtotal?: boolean;
      tax?: boolean;
      shipping?: boolean;
      total?: boolean;
      shippingAddress?: boolean;
      paymentMethod?: boolean;
      paymentStatus?: boolean;
      paymentIntentId?: boolean;
      notes?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      items?: boolean | Order$itemsArgs<ExtArgs>;
      vendorOrders?: boolean | Order$vendorOrdersArgs<ExtArgs>;
      _count?: boolean | OrderCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['order']
  >;

  export type OrderSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      customerId?: boolean;
      status?: boolean;
      subtotal?: boolean;
      tax?: boolean;
      shipping?: boolean;
      total?: boolean;
      shippingAddress?: boolean;
      paymentMethod?: boolean;
      paymentStatus?: boolean;
      paymentIntentId?: boolean;
      notes?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['order']
  >;

  export type OrderSelectScalar = {
    id?: boolean;
    customerId?: boolean;
    status?: boolean;
    subtotal?: boolean;
    tax?: boolean;
    shipping?: boolean;
    total?: boolean;
    shippingAddress?: boolean;
    paymentMethod?: boolean;
    paymentStatus?: boolean;
    paymentIntentId?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type OrderInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    items?: boolean | Order$itemsArgs<ExtArgs>;
    vendorOrders?: boolean | Order$vendorOrdersArgs<ExtArgs>;
    _count?: boolean | OrderCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type OrderIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $OrderPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Order';
    objects: {
      items: Prisma.$OrderItemPayload<ExtArgs>[];
      vendorOrders: Prisma.$VendorOrderPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        customerId: string;
        status: $Enums.OrderStatus;
        subtotal: number;
        tax: number;
        shipping: number;
        total: number;
        shippingAddress: Prisma.JsonValue;
        paymentMethod: string;
        paymentStatus: $Enums.PaymentStatus;
        paymentIntentId: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['order']
    >;
    composites: {};
  };

  type OrderGetPayload<
    S extends boolean | null | undefined | OrderDefaultArgs,
  > = $Result.GetResult<Prisma.$OrderPayload, S>;

  type OrderCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<OrderFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: OrderCountAggregateInputType | true;
  };

  export interface OrderDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Order'];
      meta: { name: 'Order' };
    };
    /**
     * Find zero or one Order that matches the filter.
     * @param {OrderFindUniqueArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderFindUniqueArgs>(
      args: SelectSubset<T, OrderFindUniqueArgs<ExtArgs>>
    ): Prisma__OrderClient<
      $Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one Order that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrderFindUniqueOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderFindUniqueOrThrowArgs>(
      args: SelectSubset<T, OrderFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__OrderClient<
      $Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first Order that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderFindFirstArgs>(
      args?: SelectSubset<T, OrderFindFirstArgs<ExtArgs>>
    ): Prisma__OrderClient<
      $Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first Order that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderFindFirstOrThrowArgs>(
      args?: SelectSubset<T, OrderFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__OrderClient<
      $Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more Orders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Orders
     * const orders = await prisma.order.findMany()
     *
     * // Get first 10 Orders
     * const orders = await prisma.order.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const orderWithIdOnly = await prisma.order.findMany({ select: { id: true } })
     *
     */
    findMany<T extends OrderFindManyArgs>(
      args?: SelectSubset<T, OrderFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a Order.
     * @param {OrderCreateArgs} args - Arguments to create a Order.
     * @example
     * // Create one Order
     * const Order = await prisma.order.create({
     *   data: {
     *     // ... data to create a Order
     *   }
     * })
     *
     */
    create<T extends OrderCreateArgs>(
      args: SelectSubset<T, OrderCreateArgs<ExtArgs>>
    ): Prisma__OrderClient<
      $Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many Orders.
     * @param {OrderCreateManyArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends OrderCreateManyArgs>(
      args?: SelectSubset<T, OrderCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Orders and returns the data saved in the database.
     * @param {OrderCreateManyAndReturnArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Orders and only return the `id`
     * const orderWithIdOnly = await prisma.order.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends OrderCreateManyAndReturnArgs>(
      args?: SelectSubset<T, OrderCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, 'createManyAndReturn'>
    >;

    /**
     * Delete a Order.
     * @param {OrderDeleteArgs} args - Arguments to delete one Order.
     * @example
     * // Delete one Order
     * const Order = await prisma.order.delete({
     *   where: {
     *     // ... filter to delete one Order
     *   }
     * })
     *
     */
    delete<T extends OrderDeleteArgs>(
      args: SelectSubset<T, OrderDeleteArgs<ExtArgs>>
    ): Prisma__OrderClient<
      $Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one Order.
     * @param {OrderUpdateArgs} args - Arguments to update one Order.
     * @example
     * // Update one Order
     * const order = await prisma.order.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends OrderUpdateArgs>(
      args: SelectSubset<T, OrderUpdateArgs<ExtArgs>>
    ): Prisma__OrderClient<
      $Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more Orders.
     * @param {OrderDeleteManyArgs} args - Arguments to filter Orders to delete.
     * @example
     * // Delete a few Orders
     * const { count } = await prisma.order.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends OrderDeleteManyArgs>(
      args?: SelectSubset<T, OrderDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends OrderUpdateManyArgs>(
      args: SelectSubset<T, OrderUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one Order.
     * @param {OrderUpsertArgs} args - Arguments to update or create a Order.
     * @example
     * // Update or create a Order
     * const order = await prisma.order.upsert({
     *   create: {
     *     // ... data to create a Order
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Order we want to update
     *   }
     * })
     */
    upsert<T extends OrderUpsertArgs>(
      args: SelectSubset<T, OrderUpsertArgs<ExtArgs>>
    ): Prisma__OrderClient<
      $Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderCountArgs} args - Arguments to filter Orders to count.
     * @example
     * // Count the number of Orders
     * const count = await prisma.order.count({
     *   where: {
     *     // ... the filter for the Orders we want to count
     *   }
     * })
     **/
    count<T extends OrderCountArgs>(
      args?: Subset<T, OrderCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OrderAggregateArgs>(
      args: Subset<T, OrderAggregateArgs>
    ): Prisma.PrismaPromise<GetOrderAggregateType<T>>;

    /**
     * Group by Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderGroupByArgs} args - Group by arguments.
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
      T extends OrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderGroupByArgs['orderBy'] }
        : { orderBy?: OrderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, OrderGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetOrderGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Order model
     */
    readonly fields: OrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Order.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    items<T extends Order$itemsArgs<ExtArgs> = {}>(
      args?: Subset<T, Order$itemsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, 'findMany'> | Null
    >;
    vendorOrders<T extends Order$vendorOrdersArgs<ExtArgs> = {}>(
      args?: Subset<T, Order$vendorOrdersArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$VendorOrderPayload<ExtArgs>, T, 'findMany'>
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Order model
   */
  interface OrderFieldRefs {
    readonly id: FieldRef<'Order', 'String'>;
    readonly customerId: FieldRef<'Order', 'String'>;
    readonly status: FieldRef<'Order', 'OrderStatus'>;
    readonly subtotal: FieldRef<'Order', 'Float'>;
    readonly tax: FieldRef<'Order', 'Float'>;
    readonly shipping: FieldRef<'Order', 'Float'>;
    readonly total: FieldRef<'Order', 'Float'>;
    readonly shippingAddress: FieldRef<'Order', 'Json'>;
    readonly paymentMethod: FieldRef<'Order', 'String'>;
    readonly paymentStatus: FieldRef<'Order', 'PaymentStatus'>;
    readonly paymentIntentId: FieldRef<'Order', 'String'>;
    readonly notes: FieldRef<'Order', 'String'>;
    readonly createdAt: FieldRef<'Order', 'DateTime'>;
    readonly updatedAt: FieldRef<'Order', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Order findUnique
   */
  export type OrderFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null;
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput;
  };

  /**
   * Order findUniqueOrThrow
   */
  export type OrderFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null;
    /**
     * Filter, which Order to fetch.
     */
    where: OrderWhereUniqueInput;
  };

  /**
   * Order findFirst
   */
  export type OrderFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null;
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Orders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[];
  };

  /**
   * Order findFirstOrThrow
   */
  export type OrderFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null;
    /**
     * Filter, which Order to fetch.
     */
    where?: OrderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Orders.
     */
    cursor?: OrderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Orders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Orders.
     */
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[];
  };

  /**
   * Order findMany
   */
  export type OrderFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null;
    /**
     * Filter, which Orders to fetch.
     */
    where?: OrderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Orders to fetch.
     */
    orderBy?: OrderOrderByWithRelationInput | OrderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Orders.
     */
    cursor?: OrderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Orders.
     */
    skip?: number;
    distinct?: OrderScalarFieldEnum | OrderScalarFieldEnum[];
  };

  /**
   * Order create
   */
  export type OrderCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null;
    /**
     * The data needed to create a Order.
     */
    data: XOR<OrderCreateInput, OrderUncheckedCreateInput>;
  };

  /**
   * Order createMany
   */
  export type OrderCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Order createManyAndReturn
   */
  export type OrderCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many Orders.
     */
    data: OrderCreateManyInput | OrderCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Order update
   */
  export type OrderUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null;
    /**
     * The data needed to update a Order.
     */
    data: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>;
    /**
     * Choose, which Order to update.
     */
    where: OrderWhereUniqueInput;
  };

  /**
   * Order updateMany
   */
  export type OrderUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Orders.
     */
    data: XOR<OrderUpdateManyMutationInput, OrderUncheckedUpdateManyInput>;
    /**
     * Filter which Orders to update
     */
    where?: OrderWhereInput;
  };

  /**
   * Order upsert
   */
  export type OrderUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null;
    /**
     * The filter to search for the Order to update in case it exists.
     */
    where: OrderWhereUniqueInput;
    /**
     * In case the Order found by the `where` argument doesn't exist, create a new Order with this data.
     */
    create: XOR<OrderCreateInput, OrderUncheckedCreateInput>;
    /**
     * In case the Order was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderUpdateInput, OrderUncheckedUpdateInput>;
  };

  /**
   * Order delete
   */
  export type OrderDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null;
    /**
     * Filter which Order to delete.
     */
    where: OrderWhereUniqueInput;
  };

  /**
   * Order deleteMany
   */
  export type OrderDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Orders to delete
     */
    where?: OrderWhereInput;
  };

  /**
   * Order.items
   */
  export type Order$itemsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null;
    where?: OrderItemWhereInput;
    orderBy?:
      | OrderItemOrderByWithRelationInput
      | OrderItemOrderByWithRelationInput[];
    cursor?: OrderItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: OrderItemScalarFieldEnum | OrderItemScalarFieldEnum[];
  };

  /**
   * Order.vendorOrders
   */
  export type Order$vendorOrdersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorOrder
     */
    select?: VendorOrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorOrderInclude<ExtArgs> | null;
    where?: VendorOrderWhereInput;
    orderBy?:
      | VendorOrderOrderByWithRelationInput
      | VendorOrderOrderByWithRelationInput[];
    cursor?: VendorOrderWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: VendorOrderScalarFieldEnum | VendorOrderScalarFieldEnum[];
  };

  /**
   * Order without action
   */
  export type OrderDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null;
  };

  /**
   * Model VendorOrder
   */

  export type AggregateVendorOrder = {
    _count: VendorOrderCountAggregateOutputType | null;
    _avg: VendorOrderAvgAggregateOutputType | null;
    _sum: VendorOrderSumAggregateOutputType | null;
    _min: VendorOrderMinAggregateOutputType | null;
    _max: VendorOrderMaxAggregateOutputType | null;
  };

  export type VendorOrderAvgAggregateOutputType = {
    subtotal: number | null;
    shipping: number | null;
    total: number | null;
  };

  export type VendorOrderSumAggregateOutputType = {
    subtotal: number | null;
    shipping: number | null;
    total: number | null;
  };

  export type VendorOrderMinAggregateOutputType = {
    id: string | null;
    orderId: string | null;
    vendorId: string | null;
    status: $Enums.OrderStatus | null;
    subtotal: number | null;
    shipping: number | null;
    total: number | null;
    trackingNumber: string | null;
    estimatedDelivery: Date | null;
    notes: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type VendorOrderMaxAggregateOutputType = {
    id: string | null;
    orderId: string | null;
    vendorId: string | null;
    status: $Enums.OrderStatus | null;
    subtotal: number | null;
    shipping: number | null;
    total: number | null;
    trackingNumber: string | null;
    estimatedDelivery: Date | null;
    notes: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type VendorOrderCountAggregateOutputType = {
    id: number;
    orderId: number;
    vendorId: number;
    status: number;
    subtotal: number;
    shipping: number;
    total: number;
    trackingNumber: number;
    estimatedDelivery: number;
    notes: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type VendorOrderAvgAggregateInputType = {
    subtotal?: true;
    shipping?: true;
    total?: true;
  };

  export type VendorOrderSumAggregateInputType = {
    subtotal?: true;
    shipping?: true;
    total?: true;
  };

  export type VendorOrderMinAggregateInputType = {
    id?: true;
    orderId?: true;
    vendorId?: true;
    status?: true;
    subtotal?: true;
    shipping?: true;
    total?: true;
    trackingNumber?: true;
    estimatedDelivery?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type VendorOrderMaxAggregateInputType = {
    id?: true;
    orderId?: true;
    vendorId?: true;
    status?: true;
    subtotal?: true;
    shipping?: true;
    total?: true;
    trackingNumber?: true;
    estimatedDelivery?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type VendorOrderCountAggregateInputType = {
    id?: true;
    orderId?: true;
    vendorId?: true;
    status?: true;
    subtotal?: true;
    shipping?: true;
    total?: true;
    trackingNumber?: true;
    estimatedDelivery?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type VendorOrderAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which VendorOrder to aggregate.
     */
    where?: VendorOrderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of VendorOrders to fetch.
     */
    orderBy?:
      | VendorOrderOrderByWithRelationInput
      | VendorOrderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: VendorOrderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` VendorOrders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` VendorOrders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned VendorOrders
     **/
    _count?: true | VendorOrderCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: VendorOrderAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: VendorOrderSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: VendorOrderMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: VendorOrderMaxAggregateInputType;
  };

  export type GetVendorOrderAggregateType<T extends VendorOrderAggregateArgs> =
    {
      [P in keyof T & keyof AggregateVendorOrder]: P extends '_count' | 'count'
        ? T[P] extends true
          ? number
          : GetScalarType<T[P], AggregateVendorOrder[P]>
        : GetScalarType<T[P], AggregateVendorOrder[P]>;
    };

  export type VendorOrderGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: VendorOrderWhereInput;
    orderBy?:
      | VendorOrderOrderByWithAggregationInput
      | VendorOrderOrderByWithAggregationInput[];
    by: VendorOrderScalarFieldEnum[] | VendorOrderScalarFieldEnum;
    having?: VendorOrderScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VendorOrderCountAggregateInputType | true;
    _avg?: VendorOrderAvgAggregateInputType;
    _sum?: VendorOrderSumAggregateInputType;
    _min?: VendorOrderMinAggregateInputType;
    _max?: VendorOrderMaxAggregateInputType;
  };

  export type VendorOrderGroupByOutputType = {
    id: string;
    orderId: string;
    vendorId: string;
    status: $Enums.OrderStatus;
    subtotal: number;
    shipping: number;
    total: number;
    trackingNumber: string | null;
    estimatedDelivery: Date | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: VendorOrderCountAggregateOutputType | null;
    _avg: VendorOrderAvgAggregateOutputType | null;
    _sum: VendorOrderSumAggregateOutputType | null;
    _min: VendorOrderMinAggregateOutputType | null;
    _max: VendorOrderMaxAggregateOutputType | null;
  };

  type GetVendorOrderGroupByPayload<T extends VendorOrderGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<VendorOrderGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof VendorOrderGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VendorOrderGroupByOutputType[P]>
            : GetScalarType<T[P], VendorOrderGroupByOutputType[P]>;
        }
      >
    >;

  export type VendorOrderSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      orderId?: boolean;
      vendorId?: boolean;
      status?: boolean;
      subtotal?: boolean;
      shipping?: boolean;
      total?: boolean;
      trackingNumber?: boolean;
      estimatedDelivery?: boolean;
      notes?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      order?: boolean | OrderDefaultArgs<ExtArgs>;
      items?: boolean | VendorOrder$itemsArgs<ExtArgs>;
      _count?: boolean | VendorOrderCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['vendorOrder']
  >;

  export type VendorOrderSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      orderId?: boolean;
      vendorId?: boolean;
      status?: boolean;
      subtotal?: boolean;
      shipping?: boolean;
      total?: boolean;
      trackingNumber?: boolean;
      estimatedDelivery?: boolean;
      notes?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      order?: boolean | OrderDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['vendorOrder']
  >;

  export type VendorOrderSelectScalar = {
    id?: boolean;
    orderId?: boolean;
    vendorId?: boolean;
    status?: boolean;
    subtotal?: boolean;
    shipping?: boolean;
    total?: boolean;
    trackingNumber?: boolean;
    estimatedDelivery?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type VendorOrderInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    order?: boolean | OrderDefaultArgs<ExtArgs>;
    items?: boolean | VendorOrder$itemsArgs<ExtArgs>;
    _count?: boolean | VendorOrderCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type VendorOrderIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    order?: boolean | OrderDefaultArgs<ExtArgs>;
  };

  export type $VendorOrderPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'VendorOrder';
    objects: {
      order: Prisma.$OrderPayload<ExtArgs>;
      items: Prisma.$OrderItemPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        orderId: string;
        vendorId: string;
        status: $Enums.OrderStatus;
        subtotal: number;
        shipping: number;
        total: number;
        trackingNumber: string | null;
        estimatedDelivery: Date | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['vendorOrder']
    >;
    composites: {};
  };

  type VendorOrderGetPayload<
    S extends boolean | null | undefined | VendorOrderDefaultArgs,
  > = $Result.GetResult<Prisma.$VendorOrderPayload, S>;

  type VendorOrderCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<VendorOrderFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: VendorOrderCountAggregateInputType | true;
  };

  export interface VendorOrderDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['VendorOrder'];
      meta: { name: 'VendorOrder' };
    };
    /**
     * Find zero or one VendorOrder that matches the filter.
     * @param {VendorOrderFindUniqueArgs} args - Arguments to find a VendorOrder
     * @example
     * // Get one VendorOrder
     * const vendorOrder = await prisma.vendorOrder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VendorOrderFindUniqueArgs>(
      args: SelectSubset<T, VendorOrderFindUniqueArgs<ExtArgs>>
    ): Prisma__VendorOrderClient<
      $Result.GetResult<
        Prisma.$VendorOrderPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find one VendorOrder that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VendorOrderFindUniqueOrThrowArgs} args - Arguments to find a VendorOrder
     * @example
     * // Get one VendorOrder
     * const vendorOrder = await prisma.vendorOrder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VendorOrderFindUniqueOrThrowArgs>(
      args: SelectSubset<T, VendorOrderFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__VendorOrderClient<
      $Result.GetResult<
        Prisma.$VendorOrderPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find the first VendorOrder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorOrderFindFirstArgs} args - Arguments to find a VendorOrder
     * @example
     * // Get one VendorOrder
     * const vendorOrder = await prisma.vendorOrder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VendorOrderFindFirstArgs>(
      args?: SelectSubset<T, VendorOrderFindFirstArgs<ExtArgs>>
    ): Prisma__VendorOrderClient<
      $Result.GetResult<
        Prisma.$VendorOrderPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first VendorOrder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorOrderFindFirstOrThrowArgs} args - Arguments to find a VendorOrder
     * @example
     * // Get one VendorOrder
     * const vendorOrder = await prisma.vendorOrder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VendorOrderFindFirstOrThrowArgs>(
      args?: SelectSubset<T, VendorOrderFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__VendorOrderClient<
      $Result.GetResult<
        Prisma.$VendorOrderPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more VendorOrders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorOrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VendorOrders
     * const vendorOrders = await prisma.vendorOrder.findMany()
     *
     * // Get first 10 VendorOrders
     * const vendorOrders = await prisma.vendorOrder.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const vendorOrderWithIdOnly = await prisma.vendorOrder.findMany({ select: { id: true } })
     *
     */
    findMany<T extends VendorOrderFindManyArgs>(
      args?: SelectSubset<T, VendorOrderFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$VendorOrderPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a VendorOrder.
     * @param {VendorOrderCreateArgs} args - Arguments to create a VendorOrder.
     * @example
     * // Create one VendorOrder
     * const VendorOrder = await prisma.vendorOrder.create({
     *   data: {
     *     // ... data to create a VendorOrder
     *   }
     * })
     *
     */
    create<T extends VendorOrderCreateArgs>(
      args: SelectSubset<T, VendorOrderCreateArgs<ExtArgs>>
    ): Prisma__VendorOrderClient<
      $Result.GetResult<Prisma.$VendorOrderPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many VendorOrders.
     * @param {VendorOrderCreateManyArgs} args - Arguments to create many VendorOrders.
     * @example
     * // Create many VendorOrders
     * const vendorOrder = await prisma.vendorOrder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends VendorOrderCreateManyArgs>(
      args?: SelectSubset<T, VendorOrderCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many VendorOrders and returns the data saved in the database.
     * @param {VendorOrderCreateManyAndReturnArgs} args - Arguments to create many VendorOrders.
     * @example
     * // Create many VendorOrders
     * const vendorOrder = await prisma.vendorOrder.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many VendorOrders and only return the `id`
     * const vendorOrderWithIdOnly = await prisma.vendorOrder.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends VendorOrderCreateManyAndReturnArgs>(
      args?: SelectSubset<T, VendorOrderCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$VendorOrderPayload<ExtArgs>,
        T,
        'createManyAndReturn'
      >
    >;

    /**
     * Delete a VendorOrder.
     * @param {VendorOrderDeleteArgs} args - Arguments to delete one VendorOrder.
     * @example
     * // Delete one VendorOrder
     * const VendorOrder = await prisma.vendorOrder.delete({
     *   where: {
     *     // ... filter to delete one VendorOrder
     *   }
     * })
     *
     */
    delete<T extends VendorOrderDeleteArgs>(
      args: SelectSubset<T, VendorOrderDeleteArgs<ExtArgs>>
    ): Prisma__VendorOrderClient<
      $Result.GetResult<Prisma.$VendorOrderPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one VendorOrder.
     * @param {VendorOrderUpdateArgs} args - Arguments to update one VendorOrder.
     * @example
     * // Update one VendorOrder
     * const vendorOrder = await prisma.vendorOrder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends VendorOrderUpdateArgs>(
      args: SelectSubset<T, VendorOrderUpdateArgs<ExtArgs>>
    ): Prisma__VendorOrderClient<
      $Result.GetResult<Prisma.$VendorOrderPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more VendorOrders.
     * @param {VendorOrderDeleteManyArgs} args - Arguments to filter VendorOrders to delete.
     * @example
     * // Delete a few VendorOrders
     * const { count } = await prisma.vendorOrder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends VendorOrderDeleteManyArgs>(
      args?: SelectSubset<T, VendorOrderDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more VendorOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorOrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VendorOrders
     * const vendorOrder = await prisma.vendorOrder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends VendorOrderUpdateManyArgs>(
      args: SelectSubset<T, VendorOrderUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one VendorOrder.
     * @param {VendorOrderUpsertArgs} args - Arguments to update or create a VendorOrder.
     * @example
     * // Update or create a VendorOrder
     * const vendorOrder = await prisma.vendorOrder.upsert({
     *   create: {
     *     // ... data to create a VendorOrder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VendorOrder we want to update
     *   }
     * })
     */
    upsert<T extends VendorOrderUpsertArgs>(
      args: SelectSubset<T, VendorOrderUpsertArgs<ExtArgs>>
    ): Prisma__VendorOrderClient<
      $Result.GetResult<Prisma.$VendorOrderPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of VendorOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorOrderCountArgs} args - Arguments to filter VendorOrders to count.
     * @example
     * // Count the number of VendorOrders
     * const count = await prisma.vendorOrder.count({
     *   where: {
     *     // ... the filter for the VendorOrders we want to count
     *   }
     * })
     **/
    count<T extends VendorOrderCountArgs>(
      args?: Subset<T, VendorOrderCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VendorOrderCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a VendorOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorOrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VendorOrderAggregateArgs>(
      args: Subset<T, VendorOrderAggregateArgs>
    ): Prisma.PrismaPromise<GetVendorOrderAggregateType<T>>;

    /**
     * Group by VendorOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorOrderGroupByArgs} args - Group by arguments.
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
      T extends VendorOrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VendorOrderGroupByArgs['orderBy'] }
        : { orderBy?: VendorOrderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, VendorOrderGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetVendorOrderGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the VendorOrder model
     */
    readonly fields: VendorOrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VendorOrder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VendorOrderClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    order<T extends OrderDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, OrderDefaultArgs<ExtArgs>>
    ): Prisma__OrderClient<
      | $Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, 'findUniqueOrThrow'>
      | Null,
      Null,
      ExtArgs
    >;
    items<T extends VendorOrder$itemsArgs<ExtArgs> = {}>(
      args?: Subset<T, VendorOrder$itemsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, 'findMany'> | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the VendorOrder model
   */
  interface VendorOrderFieldRefs {
    readonly id: FieldRef<'VendorOrder', 'String'>;
    readonly orderId: FieldRef<'VendorOrder', 'String'>;
    readonly vendorId: FieldRef<'VendorOrder', 'String'>;
    readonly status: FieldRef<'VendorOrder', 'OrderStatus'>;
    readonly subtotal: FieldRef<'VendorOrder', 'Float'>;
    readonly shipping: FieldRef<'VendorOrder', 'Float'>;
    readonly total: FieldRef<'VendorOrder', 'Float'>;
    readonly trackingNumber: FieldRef<'VendorOrder', 'String'>;
    readonly estimatedDelivery: FieldRef<'VendorOrder', 'DateTime'>;
    readonly notes: FieldRef<'VendorOrder', 'String'>;
    readonly createdAt: FieldRef<'VendorOrder', 'DateTime'>;
    readonly updatedAt: FieldRef<'VendorOrder', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * VendorOrder findUnique
   */
  export type VendorOrderFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorOrder
     */
    select?: VendorOrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorOrderInclude<ExtArgs> | null;
    /**
     * Filter, which VendorOrder to fetch.
     */
    where: VendorOrderWhereUniqueInput;
  };

  /**
   * VendorOrder findUniqueOrThrow
   */
  export type VendorOrderFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorOrder
     */
    select?: VendorOrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorOrderInclude<ExtArgs> | null;
    /**
     * Filter, which VendorOrder to fetch.
     */
    where: VendorOrderWhereUniqueInput;
  };

  /**
   * VendorOrder findFirst
   */
  export type VendorOrderFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorOrder
     */
    select?: VendorOrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorOrderInclude<ExtArgs> | null;
    /**
     * Filter, which VendorOrder to fetch.
     */
    where?: VendorOrderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of VendorOrders to fetch.
     */
    orderBy?:
      | VendorOrderOrderByWithRelationInput
      | VendorOrderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for VendorOrders.
     */
    cursor?: VendorOrderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` VendorOrders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` VendorOrders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of VendorOrders.
     */
    distinct?: VendorOrderScalarFieldEnum | VendorOrderScalarFieldEnum[];
  };

  /**
   * VendorOrder findFirstOrThrow
   */
  export type VendorOrderFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorOrder
     */
    select?: VendorOrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorOrderInclude<ExtArgs> | null;
    /**
     * Filter, which VendorOrder to fetch.
     */
    where?: VendorOrderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of VendorOrders to fetch.
     */
    orderBy?:
      | VendorOrderOrderByWithRelationInput
      | VendorOrderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for VendorOrders.
     */
    cursor?: VendorOrderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` VendorOrders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` VendorOrders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of VendorOrders.
     */
    distinct?: VendorOrderScalarFieldEnum | VendorOrderScalarFieldEnum[];
  };

  /**
   * VendorOrder findMany
   */
  export type VendorOrderFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorOrder
     */
    select?: VendorOrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorOrderInclude<ExtArgs> | null;
    /**
     * Filter, which VendorOrders to fetch.
     */
    where?: VendorOrderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of VendorOrders to fetch.
     */
    orderBy?:
      | VendorOrderOrderByWithRelationInput
      | VendorOrderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing VendorOrders.
     */
    cursor?: VendorOrderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` VendorOrders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` VendorOrders.
     */
    skip?: number;
    distinct?: VendorOrderScalarFieldEnum | VendorOrderScalarFieldEnum[];
  };

  /**
   * VendorOrder create
   */
  export type VendorOrderCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorOrder
     */
    select?: VendorOrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorOrderInclude<ExtArgs> | null;
    /**
     * The data needed to create a VendorOrder.
     */
    data: XOR<VendorOrderCreateInput, VendorOrderUncheckedCreateInput>;
  };

  /**
   * VendorOrder createMany
   */
  export type VendorOrderCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many VendorOrders.
     */
    data: VendorOrderCreateManyInput | VendorOrderCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * VendorOrder createManyAndReturn
   */
  export type VendorOrderCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorOrder
     */
    select?: VendorOrderSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many VendorOrders.
     */
    data: VendorOrderCreateManyInput | VendorOrderCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorOrderIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * VendorOrder update
   */
  export type VendorOrderUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorOrder
     */
    select?: VendorOrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorOrderInclude<ExtArgs> | null;
    /**
     * The data needed to update a VendorOrder.
     */
    data: XOR<VendorOrderUpdateInput, VendorOrderUncheckedUpdateInput>;
    /**
     * Choose, which VendorOrder to update.
     */
    where: VendorOrderWhereUniqueInput;
  };

  /**
   * VendorOrder updateMany
   */
  export type VendorOrderUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update VendorOrders.
     */
    data: XOR<
      VendorOrderUpdateManyMutationInput,
      VendorOrderUncheckedUpdateManyInput
    >;
    /**
     * Filter which VendorOrders to update
     */
    where?: VendorOrderWhereInput;
  };

  /**
   * VendorOrder upsert
   */
  export type VendorOrderUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorOrder
     */
    select?: VendorOrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorOrderInclude<ExtArgs> | null;
    /**
     * The filter to search for the VendorOrder to update in case it exists.
     */
    where: VendorOrderWhereUniqueInput;
    /**
     * In case the VendorOrder found by the `where` argument doesn't exist, create a new VendorOrder with this data.
     */
    create: XOR<VendorOrderCreateInput, VendorOrderUncheckedCreateInput>;
    /**
     * In case the VendorOrder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VendorOrderUpdateInput, VendorOrderUncheckedUpdateInput>;
  };

  /**
   * VendorOrder delete
   */
  export type VendorOrderDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorOrder
     */
    select?: VendorOrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorOrderInclude<ExtArgs> | null;
    /**
     * Filter which VendorOrder to delete.
     */
    where: VendorOrderWhereUniqueInput;
  };

  /**
   * VendorOrder deleteMany
   */
  export type VendorOrderDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which VendorOrders to delete
     */
    where?: VendorOrderWhereInput;
  };

  /**
   * VendorOrder.items
   */
  export type VendorOrder$itemsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null;
    where?: OrderItemWhereInput;
    orderBy?:
      | OrderItemOrderByWithRelationInput
      | OrderItemOrderByWithRelationInput[];
    cursor?: OrderItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: OrderItemScalarFieldEnum | OrderItemScalarFieldEnum[];
  };

  /**
   * VendorOrder without action
   */
  export type VendorOrderDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorOrder
     */
    select?: VendorOrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorOrderInclude<ExtArgs> | null;
  };

  /**
   * Model OrderItem
   */

  export type AggregateOrderItem = {
    _count: OrderItemCountAggregateOutputType | null;
    _avg: OrderItemAvgAggregateOutputType | null;
    _sum: OrderItemSumAggregateOutputType | null;
    _min: OrderItemMinAggregateOutputType | null;
    _max: OrderItemMaxAggregateOutputType | null;
  };

  export type OrderItemAvgAggregateOutputType = {
    quantity: number | null;
    price: number | null;
  };

  export type OrderItemSumAggregateOutputType = {
    quantity: number | null;
    price: number | null;
  };

  export type OrderItemMinAggregateOutputType = {
    id: string | null;
    orderId: string | null;
    vendorOrderId: string | null;
    productId: string | null;
    quantity: number | null;
    price: number | null;
    createdAt: Date | null;
  };

  export type OrderItemMaxAggregateOutputType = {
    id: string | null;
    orderId: string | null;
    vendorOrderId: string | null;
    productId: string | null;
    quantity: number | null;
    price: number | null;
    createdAt: Date | null;
  };

  export type OrderItemCountAggregateOutputType = {
    id: number;
    orderId: number;
    vendorOrderId: number;
    productId: number;
    quantity: number;
    price: number;
    createdAt: number;
    _all: number;
  };

  export type OrderItemAvgAggregateInputType = {
    quantity?: true;
    price?: true;
  };

  export type OrderItemSumAggregateInputType = {
    quantity?: true;
    price?: true;
  };

  export type OrderItemMinAggregateInputType = {
    id?: true;
    orderId?: true;
    vendorOrderId?: true;
    productId?: true;
    quantity?: true;
    price?: true;
    createdAt?: true;
  };

  export type OrderItemMaxAggregateInputType = {
    id?: true;
    orderId?: true;
    vendorOrderId?: true;
    productId?: true;
    quantity?: true;
    price?: true;
    createdAt?: true;
  };

  export type OrderItemCountAggregateInputType = {
    id?: true;
    orderId?: true;
    vendorOrderId?: true;
    productId?: true;
    quantity?: true;
    price?: true;
    createdAt?: true;
    _all?: true;
  };

  export type OrderItemAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which OrderItem to aggregate.
     */
    where?: OrderItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OrderItems to fetch.
     */
    orderBy?:
      | OrderItemOrderByWithRelationInput
      | OrderItemOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: OrderItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OrderItems from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OrderItems.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned OrderItems
     **/
    _count?: true | OrderItemCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: OrderItemAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: OrderItemSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: OrderItemMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: OrderItemMaxAggregateInputType;
  };

  export type GetOrderItemAggregateType<T extends OrderItemAggregateArgs> = {
    [P in keyof T & keyof AggregateOrderItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrderItem[P]>
      : GetScalarType<T[P], AggregateOrderItem[P]>;
  };

  export type OrderItemGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: OrderItemWhereInput;
    orderBy?:
      | OrderItemOrderByWithAggregationInput
      | OrderItemOrderByWithAggregationInput[];
    by: OrderItemScalarFieldEnum[] | OrderItemScalarFieldEnum;
    having?: OrderItemScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OrderItemCountAggregateInputType | true;
    _avg?: OrderItemAvgAggregateInputType;
    _sum?: OrderItemSumAggregateInputType;
    _min?: OrderItemMinAggregateInputType;
    _max?: OrderItemMaxAggregateInputType;
  };

  export type OrderItemGroupByOutputType = {
    id: string;
    orderId: string | null;
    vendorOrderId: string | null;
    productId: string;
    quantity: number;
    price: number;
    createdAt: Date;
    _count: OrderItemCountAggregateOutputType | null;
    _avg: OrderItemAvgAggregateOutputType | null;
    _sum: OrderItemSumAggregateOutputType | null;
    _min: OrderItemMinAggregateOutputType | null;
    _max: OrderItemMaxAggregateOutputType | null;
  };

  type GetOrderItemGroupByPayload<T extends OrderItemGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<OrderItemGroupByOutputType, T['by']> & {
          [P in keyof T & keyof OrderItemGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderItemGroupByOutputType[P]>
            : GetScalarType<T[P], OrderItemGroupByOutputType[P]>;
        }
      >
    >;

  export type OrderItemSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      orderId?: boolean;
      vendorOrderId?: boolean;
      productId?: boolean;
      quantity?: boolean;
      price?: boolean;
      createdAt?: boolean;
      order?: boolean | OrderItem$orderArgs<ExtArgs>;
      vendorOrder?: boolean | OrderItem$vendorOrderArgs<ExtArgs>;
      product?: boolean | ProductDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['orderItem']
  >;

  export type OrderItemSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      orderId?: boolean;
      vendorOrderId?: boolean;
      productId?: boolean;
      quantity?: boolean;
      price?: boolean;
      createdAt?: boolean;
      order?: boolean | OrderItem$orderArgs<ExtArgs>;
      vendorOrder?: boolean | OrderItem$vendorOrderArgs<ExtArgs>;
      product?: boolean | ProductDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['orderItem']
  >;

  export type OrderItemSelectScalar = {
    id?: boolean;
    orderId?: boolean;
    vendorOrderId?: boolean;
    productId?: boolean;
    quantity?: boolean;
    price?: boolean;
    createdAt?: boolean;
  };

  export type OrderItemInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    order?: boolean | OrderItem$orderArgs<ExtArgs>;
    vendorOrder?: boolean | OrderItem$vendorOrderArgs<ExtArgs>;
    product?: boolean | ProductDefaultArgs<ExtArgs>;
  };
  export type OrderItemIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    order?: boolean | OrderItem$orderArgs<ExtArgs>;
    vendorOrder?: boolean | OrderItem$vendorOrderArgs<ExtArgs>;
    product?: boolean | ProductDefaultArgs<ExtArgs>;
  };

  export type $OrderItemPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'OrderItem';
    objects: {
      order: Prisma.$OrderPayload<ExtArgs> | null;
      vendorOrder: Prisma.$VendorOrderPayload<ExtArgs> | null;
      product: Prisma.$ProductPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        orderId: string | null;
        vendorOrderId: string | null;
        productId: string;
        quantity: number;
        price: number;
        createdAt: Date;
      },
      ExtArgs['result']['orderItem']
    >;
    composites: {};
  };

  type OrderItemGetPayload<
    S extends boolean | null | undefined | OrderItemDefaultArgs,
  > = $Result.GetResult<Prisma.$OrderItemPayload, S>;

  type OrderItemCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<OrderItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: OrderItemCountAggregateInputType | true;
  };

  export interface OrderItemDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['OrderItem'];
      meta: { name: 'OrderItem' };
    };
    /**
     * Find zero or one OrderItem that matches the filter.
     * @param {OrderItemFindUniqueArgs} args - Arguments to find a OrderItem
     * @example
     * // Get one OrderItem
     * const orderItem = await prisma.orderItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderItemFindUniqueArgs>(
      args: SelectSubset<T, OrderItemFindUniqueArgs<ExtArgs>>
    ): Prisma__OrderItemClient<
      $Result.GetResult<
        Prisma.$OrderItemPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find one OrderItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrderItemFindUniqueOrThrowArgs} args - Arguments to find a OrderItem
     * @example
     * // Get one OrderItem
     * const orderItem = await prisma.orderItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderItemFindUniqueOrThrowArgs>(
      args: SelectSubset<T, OrderItemFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__OrderItemClient<
      $Result.GetResult<
        Prisma.$OrderItemPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find the first OrderItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemFindFirstArgs} args - Arguments to find a OrderItem
     * @example
     * // Get one OrderItem
     * const orderItem = await prisma.orderItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderItemFindFirstArgs>(
      args?: SelectSubset<T, OrderItemFindFirstArgs<ExtArgs>>
    ): Prisma__OrderItemClient<
      $Result.GetResult<
        Prisma.$OrderItemPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first OrderItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemFindFirstOrThrowArgs} args - Arguments to find a OrderItem
     * @example
     * // Get one OrderItem
     * const orderItem = await prisma.orderItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderItemFindFirstOrThrowArgs>(
      args?: SelectSubset<T, OrderItemFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__OrderItemClient<
      $Result.GetResult<
        Prisma.$OrderItemPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more OrderItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OrderItems
     * const orderItems = await prisma.orderItem.findMany()
     *
     * // Get first 10 OrderItems
     * const orderItems = await prisma.orderItem.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const orderItemWithIdOnly = await prisma.orderItem.findMany({ select: { id: true } })
     *
     */
    findMany<T extends OrderItemFindManyArgs>(
      args?: SelectSubset<T, OrderItemFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a OrderItem.
     * @param {OrderItemCreateArgs} args - Arguments to create a OrderItem.
     * @example
     * // Create one OrderItem
     * const OrderItem = await prisma.orderItem.create({
     *   data: {
     *     // ... data to create a OrderItem
     *   }
     * })
     *
     */
    create<T extends OrderItemCreateArgs>(
      args: SelectSubset<T, OrderItemCreateArgs<ExtArgs>>
    ): Prisma__OrderItemClient<
      $Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many OrderItems.
     * @param {OrderItemCreateManyArgs} args - Arguments to create many OrderItems.
     * @example
     * // Create many OrderItems
     * const orderItem = await prisma.orderItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends OrderItemCreateManyArgs>(
      args?: SelectSubset<T, OrderItemCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many OrderItems and returns the data saved in the database.
     * @param {OrderItemCreateManyAndReturnArgs} args - Arguments to create many OrderItems.
     * @example
     * // Create many OrderItems
     * const orderItem = await prisma.orderItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many OrderItems and only return the `id`
     * const orderItemWithIdOnly = await prisma.orderItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends OrderItemCreateManyAndReturnArgs>(
      args?: SelectSubset<T, OrderItemCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$OrderItemPayload<ExtArgs>,
        T,
        'createManyAndReturn'
      >
    >;

    /**
     * Delete a OrderItem.
     * @param {OrderItemDeleteArgs} args - Arguments to delete one OrderItem.
     * @example
     * // Delete one OrderItem
     * const OrderItem = await prisma.orderItem.delete({
     *   where: {
     *     // ... filter to delete one OrderItem
     *   }
     * })
     *
     */
    delete<T extends OrderItemDeleteArgs>(
      args: SelectSubset<T, OrderItemDeleteArgs<ExtArgs>>
    ): Prisma__OrderItemClient<
      $Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one OrderItem.
     * @param {OrderItemUpdateArgs} args - Arguments to update one OrderItem.
     * @example
     * // Update one OrderItem
     * const orderItem = await prisma.orderItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends OrderItemUpdateArgs>(
      args: SelectSubset<T, OrderItemUpdateArgs<ExtArgs>>
    ): Prisma__OrderItemClient<
      $Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more OrderItems.
     * @param {OrderItemDeleteManyArgs} args - Arguments to filter OrderItems to delete.
     * @example
     * // Delete a few OrderItems
     * const { count } = await prisma.orderItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends OrderItemDeleteManyArgs>(
      args?: SelectSubset<T, OrderItemDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more OrderItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OrderItems
     * const orderItem = await prisma.orderItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends OrderItemUpdateManyArgs>(
      args: SelectSubset<T, OrderItemUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one OrderItem.
     * @param {OrderItemUpsertArgs} args - Arguments to update or create a OrderItem.
     * @example
     * // Update or create a OrderItem
     * const orderItem = await prisma.orderItem.upsert({
     *   create: {
     *     // ... data to create a OrderItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OrderItem we want to update
     *   }
     * })
     */
    upsert<T extends OrderItemUpsertArgs>(
      args: SelectSubset<T, OrderItemUpsertArgs<ExtArgs>>
    ): Prisma__OrderItemClient<
      $Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of OrderItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemCountArgs} args - Arguments to filter OrderItems to count.
     * @example
     * // Count the number of OrderItems
     * const count = await prisma.orderItem.count({
     *   where: {
     *     // ... the filter for the OrderItems we want to count
     *   }
     * })
     **/
    count<T extends OrderItemCountArgs>(
      args?: Subset<T, OrderItemCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderItemCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a OrderItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OrderItemAggregateArgs>(
      args: Subset<T, OrderItemAggregateArgs>
    ): Prisma.PrismaPromise<GetOrderItemAggregateType<T>>;

    /**
     * Group by OrderItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderItemGroupByArgs} args - Group by arguments.
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
      T extends OrderItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderItemGroupByArgs['orderBy'] }
        : { orderBy?: OrderItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, OrderItemGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetOrderItemGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the OrderItem model
     */
    readonly fields: OrderItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OrderItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderItemClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    order<T extends OrderItem$orderArgs<ExtArgs> = {}>(
      args?: Subset<T, OrderItem$orderArgs<ExtArgs>>
    ): Prisma__OrderClient<
      $Result.GetResult<
        Prisma.$OrderPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      > | null,
      null,
      ExtArgs
    >;
    vendorOrder<T extends OrderItem$vendorOrderArgs<ExtArgs> = {}>(
      args?: Subset<T, OrderItem$vendorOrderArgs<ExtArgs>>
    ): Prisma__VendorOrderClient<
      $Result.GetResult<
        Prisma.$VendorOrderPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      > | null,
      null,
      ExtArgs
    >;
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ProductDefaultArgs<ExtArgs>>
    ): Prisma__ProductClient<
      | $Result.GetResult<
          Prisma.$ProductPayload<ExtArgs>,
          T,
          'findUniqueOrThrow'
        >
      | Null,
      Null,
      ExtArgs
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the OrderItem model
   */
  interface OrderItemFieldRefs {
    readonly id: FieldRef<'OrderItem', 'String'>;
    readonly orderId: FieldRef<'OrderItem', 'String'>;
    readonly vendorOrderId: FieldRef<'OrderItem', 'String'>;
    readonly productId: FieldRef<'OrderItem', 'String'>;
    readonly quantity: FieldRef<'OrderItem', 'Int'>;
    readonly price: FieldRef<'OrderItem', 'Float'>;
    readonly createdAt: FieldRef<'OrderItem', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * OrderItem findUnique
   */
  export type OrderItemFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null;
    /**
     * Filter, which OrderItem to fetch.
     */
    where: OrderItemWhereUniqueInput;
  };

  /**
   * OrderItem findUniqueOrThrow
   */
  export type OrderItemFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null;
    /**
     * Filter, which OrderItem to fetch.
     */
    where: OrderItemWhereUniqueInput;
  };

  /**
   * OrderItem findFirst
   */
  export type OrderItemFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null;
    /**
     * Filter, which OrderItem to fetch.
     */
    where?: OrderItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OrderItems to fetch.
     */
    orderBy?:
      | OrderItemOrderByWithRelationInput
      | OrderItemOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for OrderItems.
     */
    cursor?: OrderItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OrderItems from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OrderItems.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OrderItems.
     */
    distinct?: OrderItemScalarFieldEnum | OrderItemScalarFieldEnum[];
  };

  /**
   * OrderItem findFirstOrThrow
   */
  export type OrderItemFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null;
    /**
     * Filter, which OrderItem to fetch.
     */
    where?: OrderItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OrderItems to fetch.
     */
    orderBy?:
      | OrderItemOrderByWithRelationInput
      | OrderItemOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for OrderItems.
     */
    cursor?: OrderItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OrderItems from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OrderItems.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OrderItems.
     */
    distinct?: OrderItemScalarFieldEnum | OrderItemScalarFieldEnum[];
  };

  /**
   * OrderItem findMany
   */
  export type OrderItemFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null;
    /**
     * Filter, which OrderItems to fetch.
     */
    where?: OrderItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OrderItems to fetch.
     */
    orderBy?:
      | OrderItemOrderByWithRelationInput
      | OrderItemOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing OrderItems.
     */
    cursor?: OrderItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OrderItems from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OrderItems.
     */
    skip?: number;
    distinct?: OrderItemScalarFieldEnum | OrderItemScalarFieldEnum[];
  };

  /**
   * OrderItem create
   */
  export type OrderItemCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null;
    /**
     * The data needed to create a OrderItem.
     */
    data: XOR<OrderItemCreateInput, OrderItemUncheckedCreateInput>;
  };

  /**
   * OrderItem createMany
   */
  export type OrderItemCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many OrderItems.
     */
    data: OrderItemCreateManyInput | OrderItemCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * OrderItem createManyAndReturn
   */
  export type OrderItemCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many OrderItems.
     */
    data: OrderItemCreateManyInput | OrderItemCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * OrderItem update
   */
  export type OrderItemUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null;
    /**
     * The data needed to update a OrderItem.
     */
    data: XOR<OrderItemUpdateInput, OrderItemUncheckedUpdateInput>;
    /**
     * Choose, which OrderItem to update.
     */
    where: OrderItemWhereUniqueInput;
  };

  /**
   * OrderItem updateMany
   */
  export type OrderItemUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update OrderItems.
     */
    data: XOR<
      OrderItemUpdateManyMutationInput,
      OrderItemUncheckedUpdateManyInput
    >;
    /**
     * Filter which OrderItems to update
     */
    where?: OrderItemWhereInput;
  };

  /**
   * OrderItem upsert
   */
  export type OrderItemUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null;
    /**
     * The filter to search for the OrderItem to update in case it exists.
     */
    where: OrderItemWhereUniqueInput;
    /**
     * In case the OrderItem found by the `where` argument doesn't exist, create a new OrderItem with this data.
     */
    create: XOR<OrderItemCreateInput, OrderItemUncheckedCreateInput>;
    /**
     * In case the OrderItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderItemUpdateInput, OrderItemUncheckedUpdateInput>;
  };

  /**
   * OrderItem delete
   */
  export type OrderItemDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null;
    /**
     * Filter which OrderItem to delete.
     */
    where: OrderItemWhereUniqueInput;
  };

  /**
   * OrderItem deleteMany
   */
  export type OrderItemDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which OrderItems to delete
     */
    where?: OrderItemWhereInput;
  };

  /**
   * OrderItem.order
   */
  export type OrderItem$orderArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: OrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderInclude<ExtArgs> | null;
    where?: OrderWhereInput;
  };

  /**
   * OrderItem.vendorOrder
   */
  export type OrderItem$vendorOrderArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorOrder
     */
    select?: VendorOrderSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorOrderInclude<ExtArgs> | null;
    where?: VendorOrderWhereInput;
  };

  /**
   * OrderItem without action
   */
  export type OrderItemDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the OrderItem
     */
    select?: OrderItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderItemInclude<ExtArgs> | null;
  };

  /**
   * Model ProductReview
   */

  export type AggregateProductReview = {
    _count: ProductReviewCountAggregateOutputType | null;
    _avg: ProductReviewAvgAggregateOutputType | null;
    _sum: ProductReviewSumAggregateOutputType | null;
    _min: ProductReviewMinAggregateOutputType | null;
    _max: ProductReviewMaxAggregateOutputType | null;
  };

  export type ProductReviewAvgAggregateOutputType = {
    rating: number | null;
  };

  export type ProductReviewSumAggregateOutputType = {
    rating: number | null;
  };

  export type ProductReviewMinAggregateOutputType = {
    id: string | null;
    productId: string | null;
    customerId: string | null;
    rating: number | null;
    title: string | null;
    review: string | null;
    isVerified: boolean | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type ProductReviewMaxAggregateOutputType = {
    id: string | null;
    productId: string | null;
    customerId: string | null;
    rating: number | null;
    title: string | null;
    review: string | null;
    isVerified: boolean | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type ProductReviewCountAggregateOutputType = {
    id: number;
    productId: number;
    customerId: number;
    rating: number;
    title: number;
    review: number;
    isVerified: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type ProductReviewAvgAggregateInputType = {
    rating?: true;
  };

  export type ProductReviewSumAggregateInputType = {
    rating?: true;
  };

  export type ProductReviewMinAggregateInputType = {
    id?: true;
    productId?: true;
    customerId?: true;
    rating?: true;
    title?: true;
    review?: true;
    isVerified?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type ProductReviewMaxAggregateInputType = {
    id?: true;
    productId?: true;
    customerId?: true;
    rating?: true;
    title?: true;
    review?: true;
    isVerified?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type ProductReviewCountAggregateInputType = {
    id?: true;
    productId?: true;
    customerId?: true;
    rating?: true;
    title?: true;
    review?: true;
    isVerified?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type ProductReviewAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProductReview to aggregate.
     */
    where?: ProductReviewWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProductReviews to fetch.
     */
    orderBy?:
      | ProductReviewOrderByWithRelationInput
      | ProductReviewOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ProductReviewWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProductReviews from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProductReviews.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ProductReviews
     **/
    _count?: true | ProductReviewCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ProductReviewAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ProductReviewSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProductReviewMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProductReviewMaxAggregateInputType;
  };

  export type GetProductReviewAggregateType<
    T extends ProductReviewAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateProductReview]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductReview[P]>
      : GetScalarType<T[P], AggregateProductReview[P]>;
  };

  export type ProductReviewGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProductReviewWhereInput;
    orderBy?:
      | ProductReviewOrderByWithAggregationInput
      | ProductReviewOrderByWithAggregationInput[];
    by: ProductReviewScalarFieldEnum[] | ProductReviewScalarFieldEnum;
    having?: ProductReviewScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProductReviewCountAggregateInputType | true;
    _avg?: ProductReviewAvgAggregateInputType;
    _sum?: ProductReviewSumAggregateInputType;
    _min?: ProductReviewMinAggregateInputType;
    _max?: ProductReviewMaxAggregateInputType;
  };

  export type ProductReviewGroupByOutputType = {
    id: string;
    productId: string;
    customerId: string;
    rating: number;
    title: string | null;
    review: string | null;
    isVerified: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: ProductReviewCountAggregateOutputType | null;
    _avg: ProductReviewAvgAggregateOutputType | null;
    _sum: ProductReviewSumAggregateOutputType | null;
    _min: ProductReviewMinAggregateOutputType | null;
    _max: ProductReviewMaxAggregateOutputType | null;
  };

  type GetProductReviewGroupByPayload<T extends ProductReviewGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<ProductReviewGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof ProductReviewGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductReviewGroupByOutputType[P]>
            : GetScalarType<T[P], ProductReviewGroupByOutputType[P]>;
        }
      >
    >;

  export type ProductReviewSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      productId?: boolean;
      customerId?: boolean;
      rating?: boolean;
      title?: boolean;
      review?: boolean;
      isVerified?: boolean;
      isActive?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      product?: boolean | ProductDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['productReview']
  >;

  export type ProductReviewSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      productId?: boolean;
      customerId?: boolean;
      rating?: boolean;
      title?: boolean;
      review?: boolean;
      isVerified?: boolean;
      isActive?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      product?: boolean | ProductDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['productReview']
  >;

  export type ProductReviewSelectScalar = {
    id?: boolean;
    productId?: boolean;
    customerId?: boolean;
    rating?: boolean;
    title?: boolean;
    review?: boolean;
    isVerified?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type ProductReviewInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    product?: boolean | ProductDefaultArgs<ExtArgs>;
  };
  export type ProductReviewIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    product?: boolean | ProductDefaultArgs<ExtArgs>;
  };

  export type $ProductReviewPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'ProductReview';
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        productId: string;
        customerId: string;
        rating: number;
        title: string | null;
        review: string | null;
        isVerified: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['productReview']
    >;
    composites: {};
  };

  type ProductReviewGetPayload<
    S extends boolean | null | undefined | ProductReviewDefaultArgs,
  > = $Result.GetResult<Prisma.$ProductReviewPayload, S>;

  type ProductReviewCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<ProductReviewFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: ProductReviewCountAggregateInputType | true;
  };

  export interface ProductReviewDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['ProductReview'];
      meta: { name: 'ProductReview' };
    };
    /**
     * Find zero or one ProductReview that matches the filter.
     * @param {ProductReviewFindUniqueArgs} args - Arguments to find a ProductReview
     * @example
     * // Get one ProductReview
     * const productReview = await prisma.productReview.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductReviewFindUniqueArgs>(
      args: SelectSubset<T, ProductReviewFindUniqueArgs<ExtArgs>>
    ): Prisma__ProductReviewClient<
      $Result.GetResult<
        Prisma.$ProductReviewPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find one ProductReview that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductReviewFindUniqueOrThrowArgs} args - Arguments to find a ProductReview
     * @example
     * // Get one ProductReview
     * const productReview = await prisma.productReview.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductReviewFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ProductReviewFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ProductReviewClient<
      $Result.GetResult<
        Prisma.$ProductReviewPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find the first ProductReview that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductReviewFindFirstArgs} args - Arguments to find a ProductReview
     * @example
     * // Get one ProductReview
     * const productReview = await prisma.productReview.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductReviewFindFirstArgs>(
      args?: SelectSubset<T, ProductReviewFindFirstArgs<ExtArgs>>
    ): Prisma__ProductReviewClient<
      $Result.GetResult<
        Prisma.$ProductReviewPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first ProductReview that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductReviewFindFirstOrThrowArgs} args - Arguments to find a ProductReview
     * @example
     * // Get one ProductReview
     * const productReview = await prisma.productReview.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductReviewFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ProductReviewFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ProductReviewClient<
      $Result.GetResult<
        Prisma.$ProductReviewPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more ProductReviews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductReviewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductReviews
     * const productReviews = await prisma.productReview.findMany()
     *
     * // Get first 10 ProductReviews
     * const productReviews = await prisma.productReview.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const productReviewWithIdOnly = await prisma.productReview.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ProductReviewFindManyArgs>(
      args?: SelectSubset<T, ProductReviewFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ProductReviewPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a ProductReview.
     * @param {ProductReviewCreateArgs} args - Arguments to create a ProductReview.
     * @example
     * // Create one ProductReview
     * const ProductReview = await prisma.productReview.create({
     *   data: {
     *     // ... data to create a ProductReview
     *   }
     * })
     *
     */
    create<T extends ProductReviewCreateArgs>(
      args: SelectSubset<T, ProductReviewCreateArgs<ExtArgs>>
    ): Prisma__ProductReviewClient<
      $Result.GetResult<Prisma.$ProductReviewPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many ProductReviews.
     * @param {ProductReviewCreateManyArgs} args - Arguments to create many ProductReviews.
     * @example
     * // Create many ProductReviews
     * const productReview = await prisma.productReview.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ProductReviewCreateManyArgs>(
      args?: SelectSubset<T, ProductReviewCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many ProductReviews and returns the data saved in the database.
     * @param {ProductReviewCreateManyAndReturnArgs} args - Arguments to create many ProductReviews.
     * @example
     * // Create many ProductReviews
     * const productReview = await prisma.productReview.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ProductReviews and only return the `id`
     * const productReviewWithIdOnly = await prisma.productReview.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ProductReviewCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ProductReviewCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProductReviewPayload<ExtArgs>,
        T,
        'createManyAndReturn'
      >
    >;

    /**
     * Delete a ProductReview.
     * @param {ProductReviewDeleteArgs} args - Arguments to delete one ProductReview.
     * @example
     * // Delete one ProductReview
     * const ProductReview = await prisma.productReview.delete({
     *   where: {
     *     // ... filter to delete one ProductReview
     *   }
     * })
     *
     */
    delete<T extends ProductReviewDeleteArgs>(
      args: SelectSubset<T, ProductReviewDeleteArgs<ExtArgs>>
    ): Prisma__ProductReviewClient<
      $Result.GetResult<Prisma.$ProductReviewPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one ProductReview.
     * @param {ProductReviewUpdateArgs} args - Arguments to update one ProductReview.
     * @example
     * // Update one ProductReview
     * const productReview = await prisma.productReview.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ProductReviewUpdateArgs>(
      args: SelectSubset<T, ProductReviewUpdateArgs<ExtArgs>>
    ): Prisma__ProductReviewClient<
      $Result.GetResult<Prisma.$ProductReviewPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more ProductReviews.
     * @param {ProductReviewDeleteManyArgs} args - Arguments to filter ProductReviews to delete.
     * @example
     * // Delete a few ProductReviews
     * const { count } = await prisma.productReview.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ProductReviewDeleteManyArgs>(
      args?: SelectSubset<T, ProductReviewDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more ProductReviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductReviewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductReviews
     * const productReview = await prisma.productReview.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ProductReviewUpdateManyArgs>(
      args: SelectSubset<T, ProductReviewUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one ProductReview.
     * @param {ProductReviewUpsertArgs} args - Arguments to update or create a ProductReview.
     * @example
     * // Update or create a ProductReview
     * const productReview = await prisma.productReview.upsert({
     *   create: {
     *     // ... data to create a ProductReview
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductReview we want to update
     *   }
     * })
     */
    upsert<T extends ProductReviewUpsertArgs>(
      args: SelectSubset<T, ProductReviewUpsertArgs<ExtArgs>>
    ): Prisma__ProductReviewClient<
      $Result.GetResult<Prisma.$ProductReviewPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of ProductReviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductReviewCountArgs} args - Arguments to filter ProductReviews to count.
     * @example
     * // Count the number of ProductReviews
     * const count = await prisma.productReview.count({
     *   where: {
     *     // ... the filter for the ProductReviews we want to count
     *   }
     * })
     **/
    count<T extends ProductReviewCountArgs>(
      args?: Subset<T, ProductReviewCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductReviewCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a ProductReview.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductReviewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProductReviewAggregateArgs>(
      args: Subset<T, ProductReviewAggregateArgs>
    ): Prisma.PrismaPromise<GetProductReviewAggregateType<T>>;

    /**
     * Group by ProductReview.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductReviewGroupByArgs} args - Group by arguments.
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
      T extends ProductReviewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductReviewGroupByArgs['orderBy'] }
        : { orderBy?: ProductReviewGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ProductReviewGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetProductReviewGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ProductReview model
     */
    readonly fields: ProductReviewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductReview.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductReviewClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ProductDefaultArgs<ExtArgs>>
    ): Prisma__ProductClient<
      | $Result.GetResult<
          Prisma.$ProductPayload<ExtArgs>,
          T,
          'findUniqueOrThrow'
        >
      | Null,
      Null,
      ExtArgs
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the ProductReview model
   */
  interface ProductReviewFieldRefs {
    readonly id: FieldRef<'ProductReview', 'String'>;
    readonly productId: FieldRef<'ProductReview', 'String'>;
    readonly customerId: FieldRef<'ProductReview', 'String'>;
    readonly rating: FieldRef<'ProductReview', 'Int'>;
    readonly title: FieldRef<'ProductReview', 'String'>;
    readonly review: FieldRef<'ProductReview', 'String'>;
    readonly isVerified: FieldRef<'ProductReview', 'Boolean'>;
    readonly isActive: FieldRef<'ProductReview', 'Boolean'>;
    readonly createdAt: FieldRef<'ProductReview', 'DateTime'>;
    readonly updatedAt: FieldRef<'ProductReview', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * ProductReview findUnique
   */
  export type ProductReviewFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductReview
     */
    select?: ProductReviewSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductReviewInclude<ExtArgs> | null;
    /**
     * Filter, which ProductReview to fetch.
     */
    where: ProductReviewWhereUniqueInput;
  };

  /**
   * ProductReview findUniqueOrThrow
   */
  export type ProductReviewFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductReview
     */
    select?: ProductReviewSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductReviewInclude<ExtArgs> | null;
    /**
     * Filter, which ProductReview to fetch.
     */
    where: ProductReviewWhereUniqueInput;
  };

  /**
   * ProductReview findFirst
   */
  export type ProductReviewFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductReview
     */
    select?: ProductReviewSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductReviewInclude<ExtArgs> | null;
    /**
     * Filter, which ProductReview to fetch.
     */
    where?: ProductReviewWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProductReviews to fetch.
     */
    orderBy?:
      | ProductReviewOrderByWithRelationInput
      | ProductReviewOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProductReviews.
     */
    cursor?: ProductReviewWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProductReviews from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProductReviews.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProductReviews.
     */
    distinct?: ProductReviewScalarFieldEnum | ProductReviewScalarFieldEnum[];
  };

  /**
   * ProductReview findFirstOrThrow
   */
  export type ProductReviewFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductReview
     */
    select?: ProductReviewSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductReviewInclude<ExtArgs> | null;
    /**
     * Filter, which ProductReview to fetch.
     */
    where?: ProductReviewWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProductReviews to fetch.
     */
    orderBy?:
      | ProductReviewOrderByWithRelationInput
      | ProductReviewOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ProductReviews.
     */
    cursor?: ProductReviewWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProductReviews from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProductReviews.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ProductReviews.
     */
    distinct?: ProductReviewScalarFieldEnum | ProductReviewScalarFieldEnum[];
  };

  /**
   * ProductReview findMany
   */
  export type ProductReviewFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductReview
     */
    select?: ProductReviewSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductReviewInclude<ExtArgs> | null;
    /**
     * Filter, which ProductReviews to fetch.
     */
    where?: ProductReviewWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ProductReviews to fetch.
     */
    orderBy?:
      | ProductReviewOrderByWithRelationInput
      | ProductReviewOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ProductReviews.
     */
    cursor?: ProductReviewWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ProductReviews from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ProductReviews.
     */
    skip?: number;
    distinct?: ProductReviewScalarFieldEnum | ProductReviewScalarFieldEnum[];
  };

  /**
   * ProductReview create
   */
  export type ProductReviewCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductReview
     */
    select?: ProductReviewSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductReviewInclude<ExtArgs> | null;
    /**
     * The data needed to create a ProductReview.
     */
    data: XOR<ProductReviewCreateInput, ProductReviewUncheckedCreateInput>;
  };

  /**
   * ProductReview createMany
   */
  export type ProductReviewCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many ProductReviews.
     */
    data: ProductReviewCreateManyInput | ProductReviewCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * ProductReview createManyAndReturn
   */
  export type ProductReviewCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductReview
     */
    select?: ProductReviewSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many ProductReviews.
     */
    data: ProductReviewCreateManyInput | ProductReviewCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductReviewIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * ProductReview update
   */
  export type ProductReviewUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductReview
     */
    select?: ProductReviewSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductReviewInclude<ExtArgs> | null;
    /**
     * The data needed to update a ProductReview.
     */
    data: XOR<ProductReviewUpdateInput, ProductReviewUncheckedUpdateInput>;
    /**
     * Choose, which ProductReview to update.
     */
    where: ProductReviewWhereUniqueInput;
  };

  /**
   * ProductReview updateMany
   */
  export type ProductReviewUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update ProductReviews.
     */
    data: XOR<
      ProductReviewUpdateManyMutationInput,
      ProductReviewUncheckedUpdateManyInput
    >;
    /**
     * Filter which ProductReviews to update
     */
    where?: ProductReviewWhereInput;
  };

  /**
   * ProductReview upsert
   */
  export type ProductReviewUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductReview
     */
    select?: ProductReviewSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductReviewInclude<ExtArgs> | null;
    /**
     * The filter to search for the ProductReview to update in case it exists.
     */
    where: ProductReviewWhereUniqueInput;
    /**
     * In case the ProductReview found by the `where` argument doesn't exist, create a new ProductReview with this data.
     */
    create: XOR<ProductReviewCreateInput, ProductReviewUncheckedCreateInput>;
    /**
     * In case the ProductReview was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductReviewUpdateInput, ProductReviewUncheckedUpdateInput>;
  };

  /**
   * ProductReview delete
   */
  export type ProductReviewDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductReview
     */
    select?: ProductReviewSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductReviewInclude<ExtArgs> | null;
    /**
     * Filter which ProductReview to delete.
     */
    where: ProductReviewWhereUniqueInput;
  };

  /**
   * ProductReview deleteMany
   */
  export type ProductReviewDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which ProductReviews to delete
     */
    where?: ProductReviewWhereInput;
  };

  /**
   * ProductReview without action
   */
  export type ProductReviewDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ProductReview
     */
    select?: ProductReviewSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductReviewInclude<ExtArgs> | null;
  };

  /**
   * Model Wishlist
   */

  export type AggregateWishlist = {
    _count: WishlistCountAggregateOutputType | null;
    _min: WishlistMinAggregateOutputType | null;
    _max: WishlistMaxAggregateOutputType | null;
  };

  export type WishlistMinAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type WishlistMaxAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type WishlistCountAggregateOutputType = {
    id: number;
    customerId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type WishlistMinAggregateInputType = {
    id?: true;
    customerId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type WishlistMaxAggregateInputType = {
    id?: true;
    customerId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type WishlistCountAggregateInputType = {
    id?: true;
    customerId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type WishlistAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Wishlist to aggregate.
     */
    where?: WishlistWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Wishlists to fetch.
     */
    orderBy?:
      | WishlistOrderByWithRelationInput
      | WishlistOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: WishlistWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Wishlists from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Wishlists.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Wishlists
     **/
    _count?: true | WishlistCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: WishlistMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: WishlistMaxAggregateInputType;
  };

  export type GetWishlistAggregateType<T extends WishlistAggregateArgs> = {
    [P in keyof T & keyof AggregateWishlist]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWishlist[P]>
      : GetScalarType<T[P], AggregateWishlist[P]>;
  };

  export type WishlistGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: WishlistWhereInput;
    orderBy?:
      | WishlistOrderByWithAggregationInput
      | WishlistOrderByWithAggregationInput[];
    by: WishlistScalarFieldEnum[] | WishlistScalarFieldEnum;
    having?: WishlistScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WishlistCountAggregateInputType | true;
    _min?: WishlistMinAggregateInputType;
    _max?: WishlistMaxAggregateInputType;
  };

  export type WishlistGroupByOutputType = {
    id: string;
    customerId: string;
    createdAt: Date;
    updatedAt: Date;
    _count: WishlistCountAggregateOutputType | null;
    _min: WishlistMinAggregateOutputType | null;
    _max: WishlistMaxAggregateOutputType | null;
  };

  type GetWishlistGroupByPayload<T extends WishlistGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<WishlistGroupByOutputType, T['by']> & {
          [P in keyof T & keyof WishlistGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WishlistGroupByOutputType[P]>
            : GetScalarType<T[P], WishlistGroupByOutputType[P]>;
        }
      >
    >;

  export type WishlistSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      customerId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      items?: boolean | Wishlist$itemsArgs<ExtArgs>;
      _count?: boolean | WishlistCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['wishlist']
  >;

  export type WishlistSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      customerId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['wishlist']
  >;

  export type WishlistSelectScalar = {
    id?: boolean;
    customerId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type WishlistInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    items?: boolean | Wishlist$itemsArgs<ExtArgs>;
    _count?: boolean | WishlistCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type WishlistIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $WishlistPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Wishlist';
    objects: {
      items: Prisma.$WishlistItemPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        customerId: string;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['wishlist']
    >;
    composites: {};
  };

  type WishlistGetPayload<
    S extends boolean | null | undefined | WishlistDefaultArgs,
  > = $Result.GetResult<Prisma.$WishlistPayload, S>;

  type WishlistCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<WishlistFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: WishlistCountAggregateInputType | true;
  };

  export interface WishlistDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Wishlist'];
      meta: { name: 'Wishlist' };
    };
    /**
     * Find zero or one Wishlist that matches the filter.
     * @param {WishlistFindUniqueArgs} args - Arguments to find a Wishlist
     * @example
     * // Get one Wishlist
     * const wishlist = await prisma.wishlist.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WishlistFindUniqueArgs>(
      args: SelectSubset<T, WishlistFindUniqueArgs<ExtArgs>>
    ): Prisma__WishlistClient<
      $Result.GetResult<
        Prisma.$WishlistPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find one Wishlist that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WishlistFindUniqueOrThrowArgs} args - Arguments to find a Wishlist
     * @example
     * // Get one Wishlist
     * const wishlist = await prisma.wishlist.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WishlistFindUniqueOrThrowArgs>(
      args: SelectSubset<T, WishlistFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__WishlistClient<
      $Result.GetResult<
        Prisma.$WishlistPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find the first Wishlist that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistFindFirstArgs} args - Arguments to find a Wishlist
     * @example
     * // Get one Wishlist
     * const wishlist = await prisma.wishlist.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WishlistFindFirstArgs>(
      args?: SelectSubset<T, WishlistFindFirstArgs<ExtArgs>>
    ): Prisma__WishlistClient<
      $Result.GetResult<
        Prisma.$WishlistPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first Wishlist that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistFindFirstOrThrowArgs} args - Arguments to find a Wishlist
     * @example
     * // Get one Wishlist
     * const wishlist = await prisma.wishlist.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WishlistFindFirstOrThrowArgs>(
      args?: SelectSubset<T, WishlistFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__WishlistClient<
      $Result.GetResult<
        Prisma.$WishlistPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more Wishlists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Wishlists
     * const wishlists = await prisma.wishlist.findMany()
     *
     * // Get first 10 Wishlists
     * const wishlists = await prisma.wishlist.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const wishlistWithIdOnly = await prisma.wishlist.findMany({ select: { id: true } })
     *
     */
    findMany<T extends WishlistFindManyArgs>(
      args?: SelectSubset<T, WishlistFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$WishlistPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a Wishlist.
     * @param {WishlistCreateArgs} args - Arguments to create a Wishlist.
     * @example
     * // Create one Wishlist
     * const Wishlist = await prisma.wishlist.create({
     *   data: {
     *     // ... data to create a Wishlist
     *   }
     * })
     *
     */
    create<T extends WishlistCreateArgs>(
      args: SelectSubset<T, WishlistCreateArgs<ExtArgs>>
    ): Prisma__WishlistClient<
      $Result.GetResult<Prisma.$WishlistPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many Wishlists.
     * @param {WishlistCreateManyArgs} args - Arguments to create many Wishlists.
     * @example
     * // Create many Wishlists
     * const wishlist = await prisma.wishlist.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends WishlistCreateManyArgs>(
      args?: SelectSubset<T, WishlistCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Wishlists and returns the data saved in the database.
     * @param {WishlistCreateManyAndReturnArgs} args - Arguments to create many Wishlists.
     * @example
     * // Create many Wishlists
     * const wishlist = await prisma.wishlist.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Wishlists and only return the `id`
     * const wishlistWithIdOnly = await prisma.wishlist.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends WishlistCreateManyAndReturnArgs>(
      args?: SelectSubset<T, WishlistCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$WishlistPayload<ExtArgs>,
        T,
        'createManyAndReturn'
      >
    >;

    /**
     * Delete a Wishlist.
     * @param {WishlistDeleteArgs} args - Arguments to delete one Wishlist.
     * @example
     * // Delete one Wishlist
     * const Wishlist = await prisma.wishlist.delete({
     *   where: {
     *     // ... filter to delete one Wishlist
     *   }
     * })
     *
     */
    delete<T extends WishlistDeleteArgs>(
      args: SelectSubset<T, WishlistDeleteArgs<ExtArgs>>
    ): Prisma__WishlistClient<
      $Result.GetResult<Prisma.$WishlistPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one Wishlist.
     * @param {WishlistUpdateArgs} args - Arguments to update one Wishlist.
     * @example
     * // Update one Wishlist
     * const wishlist = await prisma.wishlist.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends WishlistUpdateArgs>(
      args: SelectSubset<T, WishlistUpdateArgs<ExtArgs>>
    ): Prisma__WishlistClient<
      $Result.GetResult<Prisma.$WishlistPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more Wishlists.
     * @param {WishlistDeleteManyArgs} args - Arguments to filter Wishlists to delete.
     * @example
     * // Delete a few Wishlists
     * const { count } = await prisma.wishlist.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends WishlistDeleteManyArgs>(
      args?: SelectSubset<T, WishlistDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Wishlists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Wishlists
     * const wishlist = await prisma.wishlist.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends WishlistUpdateManyArgs>(
      args: SelectSubset<T, WishlistUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one Wishlist.
     * @param {WishlistUpsertArgs} args - Arguments to update or create a Wishlist.
     * @example
     * // Update or create a Wishlist
     * const wishlist = await prisma.wishlist.upsert({
     *   create: {
     *     // ... data to create a Wishlist
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Wishlist we want to update
     *   }
     * })
     */
    upsert<T extends WishlistUpsertArgs>(
      args: SelectSubset<T, WishlistUpsertArgs<ExtArgs>>
    ): Prisma__WishlistClient<
      $Result.GetResult<Prisma.$WishlistPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of Wishlists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistCountArgs} args - Arguments to filter Wishlists to count.
     * @example
     * // Count the number of Wishlists
     * const count = await prisma.wishlist.count({
     *   where: {
     *     // ... the filter for the Wishlists we want to count
     *   }
     * })
     **/
    count<T extends WishlistCountArgs>(
      args?: Subset<T, WishlistCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WishlistCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Wishlist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends WishlistAggregateArgs>(
      args: Subset<T, WishlistAggregateArgs>
    ): Prisma.PrismaPromise<GetWishlistAggregateType<T>>;

    /**
     * Group by Wishlist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistGroupByArgs} args - Group by arguments.
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
      T extends WishlistGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WishlistGroupByArgs['orderBy'] }
        : { orderBy?: WishlistGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, WishlistGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetWishlistGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Wishlist model
     */
    readonly fields: WishlistFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Wishlist.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WishlistClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    items<T extends Wishlist$itemsArgs<ExtArgs> = {}>(
      args?: Subset<T, Wishlist$itemsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, 'findMany'>
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Wishlist model
   */
  interface WishlistFieldRefs {
    readonly id: FieldRef<'Wishlist', 'String'>;
    readonly customerId: FieldRef<'Wishlist', 'String'>;
    readonly createdAt: FieldRef<'Wishlist', 'DateTime'>;
    readonly updatedAt: FieldRef<'Wishlist', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Wishlist findUnique
   */
  export type WishlistFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null;
    /**
     * Filter, which Wishlist to fetch.
     */
    where: WishlistWhereUniqueInput;
  };

  /**
   * Wishlist findUniqueOrThrow
   */
  export type WishlistFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null;
    /**
     * Filter, which Wishlist to fetch.
     */
    where: WishlistWhereUniqueInput;
  };

  /**
   * Wishlist findFirst
   */
  export type WishlistFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null;
    /**
     * Filter, which Wishlist to fetch.
     */
    where?: WishlistWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Wishlists to fetch.
     */
    orderBy?:
      | WishlistOrderByWithRelationInput
      | WishlistOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Wishlists.
     */
    cursor?: WishlistWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Wishlists from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Wishlists.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Wishlists.
     */
    distinct?: WishlistScalarFieldEnum | WishlistScalarFieldEnum[];
  };

  /**
   * Wishlist findFirstOrThrow
   */
  export type WishlistFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null;
    /**
     * Filter, which Wishlist to fetch.
     */
    where?: WishlistWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Wishlists to fetch.
     */
    orderBy?:
      | WishlistOrderByWithRelationInput
      | WishlistOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Wishlists.
     */
    cursor?: WishlistWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Wishlists from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Wishlists.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Wishlists.
     */
    distinct?: WishlistScalarFieldEnum | WishlistScalarFieldEnum[];
  };

  /**
   * Wishlist findMany
   */
  export type WishlistFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null;
    /**
     * Filter, which Wishlists to fetch.
     */
    where?: WishlistWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Wishlists to fetch.
     */
    orderBy?:
      | WishlistOrderByWithRelationInput
      | WishlistOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Wishlists.
     */
    cursor?: WishlistWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Wishlists from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Wishlists.
     */
    skip?: number;
    distinct?: WishlistScalarFieldEnum | WishlistScalarFieldEnum[];
  };

  /**
   * Wishlist create
   */
  export type WishlistCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null;
    /**
     * The data needed to create a Wishlist.
     */
    data: XOR<WishlistCreateInput, WishlistUncheckedCreateInput>;
  };

  /**
   * Wishlist createMany
   */
  export type WishlistCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Wishlists.
     */
    data: WishlistCreateManyInput | WishlistCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Wishlist createManyAndReturn
   */
  export type WishlistCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many Wishlists.
     */
    data: WishlistCreateManyInput | WishlistCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Wishlist update
   */
  export type WishlistUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null;
    /**
     * The data needed to update a Wishlist.
     */
    data: XOR<WishlistUpdateInput, WishlistUncheckedUpdateInput>;
    /**
     * Choose, which Wishlist to update.
     */
    where: WishlistWhereUniqueInput;
  };

  /**
   * Wishlist updateMany
   */
  export type WishlistUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Wishlists.
     */
    data: XOR<
      WishlistUpdateManyMutationInput,
      WishlistUncheckedUpdateManyInput
    >;
    /**
     * Filter which Wishlists to update
     */
    where?: WishlistWhereInput;
  };

  /**
   * Wishlist upsert
   */
  export type WishlistUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null;
    /**
     * The filter to search for the Wishlist to update in case it exists.
     */
    where: WishlistWhereUniqueInput;
    /**
     * In case the Wishlist found by the `where` argument doesn't exist, create a new Wishlist with this data.
     */
    create: XOR<WishlistCreateInput, WishlistUncheckedCreateInput>;
    /**
     * In case the Wishlist was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WishlistUpdateInput, WishlistUncheckedUpdateInput>;
  };

  /**
   * Wishlist delete
   */
  export type WishlistDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null;
    /**
     * Filter which Wishlist to delete.
     */
    where: WishlistWhereUniqueInput;
  };

  /**
   * Wishlist deleteMany
   */
  export type WishlistDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Wishlists to delete
     */
    where?: WishlistWhereInput;
  };

  /**
   * Wishlist.items
   */
  export type Wishlist$itemsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null;
    where?: WishlistItemWhereInput;
    orderBy?:
      | WishlistItemOrderByWithRelationInput
      | WishlistItemOrderByWithRelationInput[];
    cursor?: WishlistItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: WishlistItemScalarFieldEnum | WishlistItemScalarFieldEnum[];
  };

  /**
   * Wishlist without action
   */
  export type WishlistDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Wishlist
     */
    select?: WishlistSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistInclude<ExtArgs> | null;
  };

  /**
   * Model WishlistItem
   */

  export type AggregateWishlistItem = {
    _count: WishlistItemCountAggregateOutputType | null;
    _min: WishlistItemMinAggregateOutputType | null;
    _max: WishlistItemMaxAggregateOutputType | null;
  };

  export type WishlistItemMinAggregateOutputType = {
    id: string | null;
    wishlistId: string | null;
    productId: string | null;
    addedAt: Date | null;
  };

  export type WishlistItemMaxAggregateOutputType = {
    id: string | null;
    wishlistId: string | null;
    productId: string | null;
    addedAt: Date | null;
  };

  export type WishlistItemCountAggregateOutputType = {
    id: number;
    wishlistId: number;
    productId: number;
    addedAt: number;
    _all: number;
  };

  export type WishlistItemMinAggregateInputType = {
    id?: true;
    wishlistId?: true;
    productId?: true;
    addedAt?: true;
  };

  export type WishlistItemMaxAggregateInputType = {
    id?: true;
    wishlistId?: true;
    productId?: true;
    addedAt?: true;
  };

  export type WishlistItemCountAggregateInputType = {
    id?: true;
    wishlistId?: true;
    productId?: true;
    addedAt?: true;
    _all?: true;
  };

  export type WishlistItemAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which WishlistItem to aggregate.
     */
    where?: WishlistItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of WishlistItems to fetch.
     */
    orderBy?:
      | WishlistItemOrderByWithRelationInput
      | WishlistItemOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: WishlistItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` WishlistItems from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` WishlistItems.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned WishlistItems
     **/
    _count?: true | WishlistItemCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: WishlistItemMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: WishlistItemMaxAggregateInputType;
  };

  export type GetWishlistItemAggregateType<
    T extends WishlistItemAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateWishlistItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWishlistItem[P]>
      : GetScalarType<T[P], AggregateWishlistItem[P]>;
  };

  export type WishlistItemGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: WishlistItemWhereInput;
    orderBy?:
      | WishlistItemOrderByWithAggregationInput
      | WishlistItemOrderByWithAggregationInput[];
    by: WishlistItemScalarFieldEnum[] | WishlistItemScalarFieldEnum;
    having?: WishlistItemScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WishlistItemCountAggregateInputType | true;
    _min?: WishlistItemMinAggregateInputType;
    _max?: WishlistItemMaxAggregateInputType;
  };

  export type WishlistItemGroupByOutputType = {
    id: string;
    wishlistId: string;
    productId: string;
    addedAt: Date;
    _count: WishlistItemCountAggregateOutputType | null;
    _min: WishlistItemMinAggregateOutputType | null;
    _max: WishlistItemMaxAggregateOutputType | null;
  };

  type GetWishlistItemGroupByPayload<T extends WishlistItemGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<WishlistItemGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof WishlistItemGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WishlistItemGroupByOutputType[P]>
            : GetScalarType<T[P], WishlistItemGroupByOutputType[P]>;
        }
      >
    >;

  export type WishlistItemSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      wishlistId?: boolean;
      productId?: boolean;
      addedAt?: boolean;
      wishlist?: boolean | WishlistDefaultArgs<ExtArgs>;
      product?: boolean | ProductDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['wishlistItem']
  >;

  export type WishlistItemSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      wishlistId?: boolean;
      productId?: boolean;
      addedAt?: boolean;
      wishlist?: boolean | WishlistDefaultArgs<ExtArgs>;
      product?: boolean | ProductDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['wishlistItem']
  >;

  export type WishlistItemSelectScalar = {
    id?: boolean;
    wishlistId?: boolean;
    productId?: boolean;
    addedAt?: boolean;
  };

  export type WishlistItemInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    wishlist?: boolean | WishlistDefaultArgs<ExtArgs>;
    product?: boolean | ProductDefaultArgs<ExtArgs>;
  };
  export type WishlistItemIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    wishlist?: boolean | WishlistDefaultArgs<ExtArgs>;
    product?: boolean | ProductDefaultArgs<ExtArgs>;
  };

  export type $WishlistItemPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'WishlistItem';
    objects: {
      wishlist: Prisma.$WishlistPayload<ExtArgs>;
      product: Prisma.$ProductPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        wishlistId: string;
        productId: string;
        addedAt: Date;
      },
      ExtArgs['result']['wishlistItem']
    >;
    composites: {};
  };

  type WishlistItemGetPayload<
    S extends boolean | null | undefined | WishlistItemDefaultArgs,
  > = $Result.GetResult<Prisma.$WishlistItemPayload, S>;

  type WishlistItemCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<WishlistItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: WishlistItemCountAggregateInputType | true;
  };

  export interface WishlistItemDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['WishlistItem'];
      meta: { name: 'WishlistItem' };
    };
    /**
     * Find zero or one WishlistItem that matches the filter.
     * @param {WishlistItemFindUniqueArgs} args - Arguments to find a WishlistItem
     * @example
     * // Get one WishlistItem
     * const wishlistItem = await prisma.wishlistItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WishlistItemFindUniqueArgs>(
      args: SelectSubset<T, WishlistItemFindUniqueArgs<ExtArgs>>
    ): Prisma__WishlistItemClient<
      $Result.GetResult<
        Prisma.$WishlistItemPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find one WishlistItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WishlistItemFindUniqueOrThrowArgs} args - Arguments to find a WishlistItem
     * @example
     * // Get one WishlistItem
     * const wishlistItem = await prisma.wishlistItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WishlistItemFindUniqueOrThrowArgs>(
      args: SelectSubset<T, WishlistItemFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__WishlistItemClient<
      $Result.GetResult<
        Prisma.$WishlistItemPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find the first WishlistItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemFindFirstArgs} args - Arguments to find a WishlistItem
     * @example
     * // Get one WishlistItem
     * const wishlistItem = await prisma.wishlistItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WishlistItemFindFirstArgs>(
      args?: SelectSubset<T, WishlistItemFindFirstArgs<ExtArgs>>
    ): Prisma__WishlistItemClient<
      $Result.GetResult<
        Prisma.$WishlistItemPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first WishlistItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemFindFirstOrThrowArgs} args - Arguments to find a WishlistItem
     * @example
     * // Get one WishlistItem
     * const wishlistItem = await prisma.wishlistItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WishlistItemFindFirstOrThrowArgs>(
      args?: SelectSubset<T, WishlistItemFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__WishlistItemClient<
      $Result.GetResult<
        Prisma.$WishlistItemPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more WishlistItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WishlistItems
     * const wishlistItems = await prisma.wishlistItem.findMany()
     *
     * // Get first 10 WishlistItems
     * const wishlistItems = await prisma.wishlistItem.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const wishlistItemWithIdOnly = await prisma.wishlistItem.findMany({ select: { id: true } })
     *
     */
    findMany<T extends WishlistItemFindManyArgs>(
      args?: SelectSubset<T, WishlistItemFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a WishlistItem.
     * @param {WishlistItemCreateArgs} args - Arguments to create a WishlistItem.
     * @example
     * // Create one WishlistItem
     * const WishlistItem = await prisma.wishlistItem.create({
     *   data: {
     *     // ... data to create a WishlistItem
     *   }
     * })
     *
     */
    create<T extends WishlistItemCreateArgs>(
      args: SelectSubset<T, WishlistItemCreateArgs<ExtArgs>>
    ): Prisma__WishlistItemClient<
      $Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many WishlistItems.
     * @param {WishlistItemCreateManyArgs} args - Arguments to create many WishlistItems.
     * @example
     * // Create many WishlistItems
     * const wishlistItem = await prisma.wishlistItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends WishlistItemCreateManyArgs>(
      args?: SelectSubset<T, WishlistItemCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many WishlistItems and returns the data saved in the database.
     * @param {WishlistItemCreateManyAndReturnArgs} args - Arguments to create many WishlistItems.
     * @example
     * // Create many WishlistItems
     * const wishlistItem = await prisma.wishlistItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many WishlistItems and only return the `id`
     * const wishlistItemWithIdOnly = await prisma.wishlistItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends WishlistItemCreateManyAndReturnArgs>(
      args?: SelectSubset<T, WishlistItemCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$WishlistItemPayload<ExtArgs>,
        T,
        'createManyAndReturn'
      >
    >;

    /**
     * Delete a WishlistItem.
     * @param {WishlistItemDeleteArgs} args - Arguments to delete one WishlistItem.
     * @example
     * // Delete one WishlistItem
     * const WishlistItem = await prisma.wishlistItem.delete({
     *   where: {
     *     // ... filter to delete one WishlistItem
     *   }
     * })
     *
     */
    delete<T extends WishlistItemDeleteArgs>(
      args: SelectSubset<T, WishlistItemDeleteArgs<ExtArgs>>
    ): Prisma__WishlistItemClient<
      $Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one WishlistItem.
     * @param {WishlistItemUpdateArgs} args - Arguments to update one WishlistItem.
     * @example
     * // Update one WishlistItem
     * const wishlistItem = await prisma.wishlistItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends WishlistItemUpdateArgs>(
      args: SelectSubset<T, WishlistItemUpdateArgs<ExtArgs>>
    ): Prisma__WishlistItemClient<
      $Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more WishlistItems.
     * @param {WishlistItemDeleteManyArgs} args - Arguments to filter WishlistItems to delete.
     * @example
     * // Delete a few WishlistItems
     * const { count } = await prisma.wishlistItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends WishlistItemDeleteManyArgs>(
      args?: SelectSubset<T, WishlistItemDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more WishlistItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WishlistItems
     * const wishlistItem = await prisma.wishlistItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends WishlistItemUpdateManyArgs>(
      args: SelectSubset<T, WishlistItemUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one WishlistItem.
     * @param {WishlistItemUpsertArgs} args - Arguments to update or create a WishlistItem.
     * @example
     * // Update or create a WishlistItem
     * const wishlistItem = await prisma.wishlistItem.upsert({
     *   create: {
     *     // ... data to create a WishlistItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WishlistItem we want to update
     *   }
     * })
     */
    upsert<T extends WishlistItemUpsertArgs>(
      args: SelectSubset<T, WishlistItemUpsertArgs<ExtArgs>>
    ): Prisma__WishlistItemClient<
      $Result.GetResult<Prisma.$WishlistItemPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of WishlistItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemCountArgs} args - Arguments to filter WishlistItems to count.
     * @example
     * // Count the number of WishlistItems
     * const count = await prisma.wishlistItem.count({
     *   where: {
     *     // ... the filter for the WishlistItems we want to count
     *   }
     * })
     **/
    count<T extends WishlistItemCountArgs>(
      args?: Subset<T, WishlistItemCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WishlistItemCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a WishlistItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends WishlistItemAggregateArgs>(
      args: Subset<T, WishlistItemAggregateArgs>
    ): Prisma.PrismaPromise<GetWishlistItemAggregateType<T>>;

    /**
     * Group by WishlistItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WishlistItemGroupByArgs} args - Group by arguments.
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
      T extends WishlistItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WishlistItemGroupByArgs['orderBy'] }
        : { orderBy?: WishlistItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, WishlistItemGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetWishlistItemGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the WishlistItem model
     */
    readonly fields: WishlistItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WishlistItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WishlistItemClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    wishlist<T extends WishlistDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, WishlistDefaultArgs<ExtArgs>>
    ): Prisma__WishlistClient<
      | $Result.GetResult<
          Prisma.$WishlistPayload<ExtArgs>,
          T,
          'findUniqueOrThrow'
        >
      | Null,
      Null,
      ExtArgs
    >;
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ProductDefaultArgs<ExtArgs>>
    ): Prisma__ProductClient<
      | $Result.GetResult<
          Prisma.$ProductPayload<ExtArgs>,
          T,
          'findUniqueOrThrow'
        >
      | Null,
      Null,
      ExtArgs
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the WishlistItem model
   */
  interface WishlistItemFieldRefs {
    readonly id: FieldRef<'WishlistItem', 'String'>;
    readonly wishlistId: FieldRef<'WishlistItem', 'String'>;
    readonly productId: FieldRef<'WishlistItem', 'String'>;
    readonly addedAt: FieldRef<'WishlistItem', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * WishlistItem findUnique
   */
  export type WishlistItemFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null;
    /**
     * Filter, which WishlistItem to fetch.
     */
    where: WishlistItemWhereUniqueInput;
  };

  /**
   * WishlistItem findUniqueOrThrow
   */
  export type WishlistItemFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null;
    /**
     * Filter, which WishlistItem to fetch.
     */
    where: WishlistItemWhereUniqueInput;
  };

  /**
   * WishlistItem findFirst
   */
  export type WishlistItemFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null;
    /**
     * Filter, which WishlistItem to fetch.
     */
    where?: WishlistItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of WishlistItems to fetch.
     */
    orderBy?:
      | WishlistItemOrderByWithRelationInput
      | WishlistItemOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for WishlistItems.
     */
    cursor?: WishlistItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` WishlistItems from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` WishlistItems.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of WishlistItems.
     */
    distinct?: WishlistItemScalarFieldEnum | WishlistItemScalarFieldEnum[];
  };

  /**
   * WishlistItem findFirstOrThrow
   */
  export type WishlistItemFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null;
    /**
     * Filter, which WishlistItem to fetch.
     */
    where?: WishlistItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of WishlistItems to fetch.
     */
    orderBy?:
      | WishlistItemOrderByWithRelationInput
      | WishlistItemOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for WishlistItems.
     */
    cursor?: WishlistItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` WishlistItems from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` WishlistItems.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of WishlistItems.
     */
    distinct?: WishlistItemScalarFieldEnum | WishlistItemScalarFieldEnum[];
  };

  /**
   * WishlistItem findMany
   */
  export type WishlistItemFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null;
    /**
     * Filter, which WishlistItems to fetch.
     */
    where?: WishlistItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of WishlistItems to fetch.
     */
    orderBy?:
      | WishlistItemOrderByWithRelationInput
      | WishlistItemOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing WishlistItems.
     */
    cursor?: WishlistItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` WishlistItems from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` WishlistItems.
     */
    skip?: number;
    distinct?: WishlistItemScalarFieldEnum | WishlistItemScalarFieldEnum[];
  };

  /**
   * WishlistItem create
   */
  export type WishlistItemCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null;
    /**
     * The data needed to create a WishlistItem.
     */
    data: XOR<WishlistItemCreateInput, WishlistItemUncheckedCreateInput>;
  };

  /**
   * WishlistItem createMany
   */
  export type WishlistItemCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many WishlistItems.
     */
    data: WishlistItemCreateManyInput | WishlistItemCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * WishlistItem createManyAndReturn
   */
  export type WishlistItemCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many WishlistItems.
     */
    data: WishlistItemCreateManyInput | WishlistItemCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * WishlistItem update
   */
  export type WishlistItemUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null;
    /**
     * The data needed to update a WishlistItem.
     */
    data: XOR<WishlistItemUpdateInput, WishlistItemUncheckedUpdateInput>;
    /**
     * Choose, which WishlistItem to update.
     */
    where: WishlistItemWhereUniqueInput;
  };

  /**
   * WishlistItem updateMany
   */
  export type WishlistItemUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update WishlistItems.
     */
    data: XOR<
      WishlistItemUpdateManyMutationInput,
      WishlistItemUncheckedUpdateManyInput
    >;
    /**
     * Filter which WishlistItems to update
     */
    where?: WishlistItemWhereInput;
  };

  /**
   * WishlistItem upsert
   */
  export type WishlistItemUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null;
    /**
     * The filter to search for the WishlistItem to update in case it exists.
     */
    where: WishlistItemWhereUniqueInput;
    /**
     * In case the WishlistItem found by the `where` argument doesn't exist, create a new WishlistItem with this data.
     */
    create: XOR<WishlistItemCreateInput, WishlistItemUncheckedCreateInput>;
    /**
     * In case the WishlistItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WishlistItemUpdateInput, WishlistItemUncheckedUpdateInput>;
  };

  /**
   * WishlistItem delete
   */
  export type WishlistItemDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null;
    /**
     * Filter which WishlistItem to delete.
     */
    where: WishlistItemWhereUniqueInput;
  };

  /**
   * WishlistItem deleteMany
   */
  export type WishlistItemDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which WishlistItems to delete
     */
    where?: WishlistItemWhereInput;
  };

  /**
   * WishlistItem without action
   */
  export type WishlistItemDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WishlistItem
     */
    select?: WishlistItemSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WishlistItemInclude<ExtArgs> | null;
  };

  /**
   * Model VendorAnalytics
   */

  export type AggregateVendorAnalytics = {
    _count: VendorAnalyticsCountAggregateOutputType | null;
    _avg: VendorAnalyticsAvgAggregateOutputType | null;
    _sum: VendorAnalyticsSumAggregateOutputType | null;
    _min: VendorAnalyticsMinAggregateOutputType | null;
    _max: VendorAnalyticsMaxAggregateOutputType | null;
  };

  export type VendorAnalyticsAvgAggregateOutputType = {
    totalOrders: number | null;
    totalRevenue: number | null;
    totalViews: number | null;
    conversionRate: number | null;
  };

  export type VendorAnalyticsSumAggregateOutputType = {
    totalOrders: number | null;
    totalRevenue: number | null;
    totalViews: number | null;
    conversionRate: number | null;
  };

  export type VendorAnalyticsMinAggregateOutputType = {
    id: string | null;
    vendorId: string | null;
    period: string | null;
    date: Date | null;
    totalOrders: number | null;
    totalRevenue: number | null;
    totalViews: number | null;
    conversionRate: number | null;
    createdAt: Date | null;
  };

  export type VendorAnalyticsMaxAggregateOutputType = {
    id: string | null;
    vendorId: string | null;
    period: string | null;
    date: Date | null;
    totalOrders: number | null;
    totalRevenue: number | null;
    totalViews: number | null;
    conversionRate: number | null;
    createdAt: Date | null;
  };

  export type VendorAnalyticsCountAggregateOutputType = {
    id: number;
    vendorId: number;
    period: number;
    date: number;
    totalOrders: number;
    totalRevenue: number;
    totalViews: number;
    conversionRate: number;
    createdAt: number;
    _all: number;
  };

  export type VendorAnalyticsAvgAggregateInputType = {
    totalOrders?: true;
    totalRevenue?: true;
    totalViews?: true;
    conversionRate?: true;
  };

  export type VendorAnalyticsSumAggregateInputType = {
    totalOrders?: true;
    totalRevenue?: true;
    totalViews?: true;
    conversionRate?: true;
  };

  export type VendorAnalyticsMinAggregateInputType = {
    id?: true;
    vendorId?: true;
    period?: true;
    date?: true;
    totalOrders?: true;
    totalRevenue?: true;
    totalViews?: true;
    conversionRate?: true;
    createdAt?: true;
  };

  export type VendorAnalyticsMaxAggregateInputType = {
    id?: true;
    vendorId?: true;
    period?: true;
    date?: true;
    totalOrders?: true;
    totalRevenue?: true;
    totalViews?: true;
    conversionRate?: true;
    createdAt?: true;
  };

  export type VendorAnalyticsCountAggregateInputType = {
    id?: true;
    vendorId?: true;
    period?: true;
    date?: true;
    totalOrders?: true;
    totalRevenue?: true;
    totalViews?: true;
    conversionRate?: true;
    createdAt?: true;
    _all?: true;
  };

  export type VendorAnalyticsAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which VendorAnalytics to aggregate.
     */
    where?: VendorAnalyticsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of VendorAnalytics to fetch.
     */
    orderBy?:
      | VendorAnalyticsOrderByWithRelationInput
      | VendorAnalyticsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: VendorAnalyticsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` VendorAnalytics from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` VendorAnalytics.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned VendorAnalytics
     **/
    _count?: true | VendorAnalyticsCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: VendorAnalyticsAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: VendorAnalyticsSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: VendorAnalyticsMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: VendorAnalyticsMaxAggregateInputType;
  };

  export type GetVendorAnalyticsAggregateType<
    T extends VendorAnalyticsAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateVendorAnalytics]: P extends
      | '_count'
      | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVendorAnalytics[P]>
      : GetScalarType<T[P], AggregateVendorAnalytics[P]>;
  };

  export type VendorAnalyticsGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: VendorAnalyticsWhereInput;
    orderBy?:
      | VendorAnalyticsOrderByWithAggregationInput
      | VendorAnalyticsOrderByWithAggregationInput[];
    by: VendorAnalyticsScalarFieldEnum[] | VendorAnalyticsScalarFieldEnum;
    having?: VendorAnalyticsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VendorAnalyticsCountAggregateInputType | true;
    _avg?: VendorAnalyticsAvgAggregateInputType;
    _sum?: VendorAnalyticsSumAggregateInputType;
    _min?: VendorAnalyticsMinAggregateInputType;
    _max?: VendorAnalyticsMaxAggregateInputType;
  };

  export type VendorAnalyticsGroupByOutputType = {
    id: string;
    vendorId: string;
    period: string;
    date: Date;
    totalOrders: number;
    totalRevenue: number;
    totalViews: number;
    conversionRate: number;
    createdAt: Date;
    _count: VendorAnalyticsCountAggregateOutputType | null;
    _avg: VendorAnalyticsAvgAggregateOutputType | null;
    _sum: VendorAnalyticsSumAggregateOutputType | null;
    _min: VendorAnalyticsMinAggregateOutputType | null;
    _max: VendorAnalyticsMaxAggregateOutputType | null;
  };

  type GetVendorAnalyticsGroupByPayload<T extends VendorAnalyticsGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<VendorAnalyticsGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof VendorAnalyticsGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VendorAnalyticsGroupByOutputType[P]>
            : GetScalarType<T[P], VendorAnalyticsGroupByOutputType[P]>;
        }
      >
    >;

  export type VendorAnalyticsSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      vendorId?: boolean;
      period?: boolean;
      date?: boolean;
      totalOrders?: boolean;
      totalRevenue?: boolean;
      totalViews?: boolean;
      conversionRate?: boolean;
      createdAt?: boolean;
      vendor?: boolean | VendorDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['vendorAnalytics']
  >;

  export type VendorAnalyticsSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      vendorId?: boolean;
      period?: boolean;
      date?: boolean;
      totalOrders?: boolean;
      totalRevenue?: boolean;
      totalViews?: boolean;
      conversionRate?: boolean;
      createdAt?: boolean;
      vendor?: boolean | VendorDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['vendorAnalytics']
  >;

  export type VendorAnalyticsSelectScalar = {
    id?: boolean;
    vendorId?: boolean;
    period?: boolean;
    date?: boolean;
    totalOrders?: boolean;
    totalRevenue?: boolean;
    totalViews?: boolean;
    conversionRate?: boolean;
    createdAt?: boolean;
  };

  export type VendorAnalyticsInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    vendor?: boolean | VendorDefaultArgs<ExtArgs>;
  };
  export type VendorAnalyticsIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    vendor?: boolean | VendorDefaultArgs<ExtArgs>;
  };

  export type $VendorAnalyticsPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'VendorAnalytics';
    objects: {
      vendor: Prisma.$VendorPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        vendorId: string;
        period: string;
        date: Date;
        totalOrders: number;
        totalRevenue: number;
        totalViews: number;
        conversionRate: number;
        createdAt: Date;
      },
      ExtArgs['result']['vendorAnalytics']
    >;
    composites: {};
  };

  type VendorAnalyticsGetPayload<
    S extends boolean | null | undefined | VendorAnalyticsDefaultArgs,
  > = $Result.GetResult<Prisma.$VendorAnalyticsPayload, S>;

  type VendorAnalyticsCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<VendorAnalyticsFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: VendorAnalyticsCountAggregateInputType | true;
  };

  export interface VendorAnalyticsDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['VendorAnalytics'];
      meta: { name: 'VendorAnalytics' };
    };
    /**
     * Find zero or one VendorAnalytics that matches the filter.
     * @param {VendorAnalyticsFindUniqueArgs} args - Arguments to find a VendorAnalytics
     * @example
     * // Get one VendorAnalytics
     * const vendorAnalytics = await prisma.vendorAnalytics.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VendorAnalyticsFindUniqueArgs>(
      args: SelectSubset<T, VendorAnalyticsFindUniqueArgs<ExtArgs>>
    ): Prisma__VendorAnalyticsClient<
      $Result.GetResult<
        Prisma.$VendorAnalyticsPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find one VendorAnalytics that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VendorAnalyticsFindUniqueOrThrowArgs} args - Arguments to find a VendorAnalytics
     * @example
     * // Get one VendorAnalytics
     * const vendorAnalytics = await prisma.vendorAnalytics.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VendorAnalyticsFindUniqueOrThrowArgs>(
      args: SelectSubset<T, VendorAnalyticsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__VendorAnalyticsClient<
      $Result.GetResult<
        Prisma.$VendorAnalyticsPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find the first VendorAnalytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorAnalyticsFindFirstArgs} args - Arguments to find a VendorAnalytics
     * @example
     * // Get one VendorAnalytics
     * const vendorAnalytics = await prisma.vendorAnalytics.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VendorAnalyticsFindFirstArgs>(
      args?: SelectSubset<T, VendorAnalyticsFindFirstArgs<ExtArgs>>
    ): Prisma__VendorAnalyticsClient<
      $Result.GetResult<
        Prisma.$VendorAnalyticsPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first VendorAnalytics that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorAnalyticsFindFirstOrThrowArgs} args - Arguments to find a VendorAnalytics
     * @example
     * // Get one VendorAnalytics
     * const vendorAnalytics = await prisma.vendorAnalytics.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VendorAnalyticsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, VendorAnalyticsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__VendorAnalyticsClient<
      $Result.GetResult<
        Prisma.$VendorAnalyticsPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more VendorAnalytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorAnalyticsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VendorAnalytics
     * const vendorAnalytics = await prisma.vendorAnalytics.findMany()
     *
     * // Get first 10 VendorAnalytics
     * const vendorAnalytics = await prisma.vendorAnalytics.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const vendorAnalyticsWithIdOnly = await prisma.vendorAnalytics.findMany({ select: { id: true } })
     *
     */
    findMany<T extends VendorAnalyticsFindManyArgs>(
      args?: SelectSubset<T, VendorAnalyticsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$VendorAnalyticsPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a VendorAnalytics.
     * @param {VendorAnalyticsCreateArgs} args - Arguments to create a VendorAnalytics.
     * @example
     * // Create one VendorAnalytics
     * const VendorAnalytics = await prisma.vendorAnalytics.create({
     *   data: {
     *     // ... data to create a VendorAnalytics
     *   }
     * })
     *
     */
    create<T extends VendorAnalyticsCreateArgs>(
      args: SelectSubset<T, VendorAnalyticsCreateArgs<ExtArgs>>
    ): Prisma__VendorAnalyticsClient<
      $Result.GetResult<Prisma.$VendorAnalyticsPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many VendorAnalytics.
     * @param {VendorAnalyticsCreateManyArgs} args - Arguments to create many VendorAnalytics.
     * @example
     * // Create many VendorAnalytics
     * const vendorAnalytics = await prisma.vendorAnalytics.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends VendorAnalyticsCreateManyArgs>(
      args?: SelectSubset<T, VendorAnalyticsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many VendorAnalytics and returns the data saved in the database.
     * @param {VendorAnalyticsCreateManyAndReturnArgs} args - Arguments to create many VendorAnalytics.
     * @example
     * // Create many VendorAnalytics
     * const vendorAnalytics = await prisma.vendorAnalytics.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many VendorAnalytics and only return the `id`
     * const vendorAnalyticsWithIdOnly = await prisma.vendorAnalytics.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends VendorAnalyticsCreateManyAndReturnArgs>(
      args?: SelectSubset<T, VendorAnalyticsCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$VendorAnalyticsPayload<ExtArgs>,
        T,
        'createManyAndReturn'
      >
    >;

    /**
     * Delete a VendorAnalytics.
     * @param {VendorAnalyticsDeleteArgs} args - Arguments to delete one VendorAnalytics.
     * @example
     * // Delete one VendorAnalytics
     * const VendorAnalytics = await prisma.vendorAnalytics.delete({
     *   where: {
     *     // ... filter to delete one VendorAnalytics
     *   }
     * })
     *
     */
    delete<T extends VendorAnalyticsDeleteArgs>(
      args: SelectSubset<T, VendorAnalyticsDeleteArgs<ExtArgs>>
    ): Prisma__VendorAnalyticsClient<
      $Result.GetResult<Prisma.$VendorAnalyticsPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one VendorAnalytics.
     * @param {VendorAnalyticsUpdateArgs} args - Arguments to update one VendorAnalytics.
     * @example
     * // Update one VendorAnalytics
     * const vendorAnalytics = await prisma.vendorAnalytics.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends VendorAnalyticsUpdateArgs>(
      args: SelectSubset<T, VendorAnalyticsUpdateArgs<ExtArgs>>
    ): Prisma__VendorAnalyticsClient<
      $Result.GetResult<Prisma.$VendorAnalyticsPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more VendorAnalytics.
     * @param {VendorAnalyticsDeleteManyArgs} args - Arguments to filter VendorAnalytics to delete.
     * @example
     * // Delete a few VendorAnalytics
     * const { count } = await prisma.vendorAnalytics.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends VendorAnalyticsDeleteManyArgs>(
      args?: SelectSubset<T, VendorAnalyticsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more VendorAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorAnalyticsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VendorAnalytics
     * const vendorAnalytics = await prisma.vendorAnalytics.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends VendorAnalyticsUpdateManyArgs>(
      args: SelectSubset<T, VendorAnalyticsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one VendorAnalytics.
     * @param {VendorAnalyticsUpsertArgs} args - Arguments to update or create a VendorAnalytics.
     * @example
     * // Update or create a VendorAnalytics
     * const vendorAnalytics = await prisma.vendorAnalytics.upsert({
     *   create: {
     *     // ... data to create a VendorAnalytics
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VendorAnalytics we want to update
     *   }
     * })
     */
    upsert<T extends VendorAnalyticsUpsertArgs>(
      args: SelectSubset<T, VendorAnalyticsUpsertArgs<ExtArgs>>
    ): Prisma__VendorAnalyticsClient<
      $Result.GetResult<Prisma.$VendorAnalyticsPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of VendorAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorAnalyticsCountArgs} args - Arguments to filter VendorAnalytics to count.
     * @example
     * // Count the number of VendorAnalytics
     * const count = await prisma.vendorAnalytics.count({
     *   where: {
     *     // ... the filter for the VendorAnalytics we want to count
     *   }
     * })
     **/
    count<T extends VendorAnalyticsCountArgs>(
      args?: Subset<T, VendorAnalyticsCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VendorAnalyticsCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a VendorAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorAnalyticsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VendorAnalyticsAggregateArgs>(
      args: Subset<T, VendorAnalyticsAggregateArgs>
    ): Prisma.PrismaPromise<GetVendorAnalyticsAggregateType<T>>;

    /**
     * Group by VendorAnalytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorAnalyticsGroupByArgs} args - Group by arguments.
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
      T extends VendorAnalyticsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VendorAnalyticsGroupByArgs['orderBy'] }
        : { orderBy?: VendorAnalyticsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
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
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, VendorAnalyticsGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetVendorAnalyticsGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the VendorAnalytics model
     */
    readonly fields: VendorAnalyticsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VendorAnalytics.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VendorAnalyticsClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    vendor<T extends VendorDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, VendorDefaultArgs<ExtArgs>>
    ): Prisma__VendorClient<
      | $Result.GetResult<
          Prisma.$VendorPayload<ExtArgs>,
          T,
          'findUniqueOrThrow'
        >
      | Null,
      Null,
      ExtArgs
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the VendorAnalytics model
   */
  interface VendorAnalyticsFieldRefs {
    readonly id: FieldRef<'VendorAnalytics', 'String'>;
    readonly vendorId: FieldRef<'VendorAnalytics', 'String'>;
    readonly period: FieldRef<'VendorAnalytics', 'String'>;
    readonly date: FieldRef<'VendorAnalytics', 'DateTime'>;
    readonly totalOrders: FieldRef<'VendorAnalytics', 'Int'>;
    readonly totalRevenue: FieldRef<'VendorAnalytics', 'Float'>;
    readonly totalViews: FieldRef<'VendorAnalytics', 'Int'>;
    readonly conversionRate: FieldRef<'VendorAnalytics', 'Float'>;
    readonly createdAt: FieldRef<'VendorAnalytics', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * VendorAnalytics findUnique
   */
  export type VendorAnalyticsFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorAnalytics
     */
    select?: VendorAnalyticsSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorAnalyticsInclude<ExtArgs> | null;
    /**
     * Filter, which VendorAnalytics to fetch.
     */
    where: VendorAnalyticsWhereUniqueInput;
  };

  /**
   * VendorAnalytics findUniqueOrThrow
   */
  export type VendorAnalyticsFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorAnalytics
     */
    select?: VendorAnalyticsSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorAnalyticsInclude<ExtArgs> | null;
    /**
     * Filter, which VendorAnalytics to fetch.
     */
    where: VendorAnalyticsWhereUniqueInput;
  };

  /**
   * VendorAnalytics findFirst
   */
  export type VendorAnalyticsFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorAnalytics
     */
    select?: VendorAnalyticsSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorAnalyticsInclude<ExtArgs> | null;
    /**
     * Filter, which VendorAnalytics to fetch.
     */
    where?: VendorAnalyticsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of VendorAnalytics to fetch.
     */
    orderBy?:
      | VendorAnalyticsOrderByWithRelationInput
      | VendorAnalyticsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for VendorAnalytics.
     */
    cursor?: VendorAnalyticsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` VendorAnalytics from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` VendorAnalytics.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of VendorAnalytics.
     */
    distinct?:
      | VendorAnalyticsScalarFieldEnum
      | VendorAnalyticsScalarFieldEnum[];
  };

  /**
   * VendorAnalytics findFirstOrThrow
   */
  export type VendorAnalyticsFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorAnalytics
     */
    select?: VendorAnalyticsSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorAnalyticsInclude<ExtArgs> | null;
    /**
     * Filter, which VendorAnalytics to fetch.
     */
    where?: VendorAnalyticsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of VendorAnalytics to fetch.
     */
    orderBy?:
      | VendorAnalyticsOrderByWithRelationInput
      | VendorAnalyticsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for VendorAnalytics.
     */
    cursor?: VendorAnalyticsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` VendorAnalytics from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` VendorAnalytics.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of VendorAnalytics.
     */
    distinct?:
      | VendorAnalyticsScalarFieldEnum
      | VendorAnalyticsScalarFieldEnum[];
  };

  /**
   * VendorAnalytics findMany
   */
  export type VendorAnalyticsFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorAnalytics
     */
    select?: VendorAnalyticsSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorAnalyticsInclude<ExtArgs> | null;
    /**
     * Filter, which VendorAnalytics to fetch.
     */
    where?: VendorAnalyticsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of VendorAnalytics to fetch.
     */
    orderBy?:
      | VendorAnalyticsOrderByWithRelationInput
      | VendorAnalyticsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing VendorAnalytics.
     */
    cursor?: VendorAnalyticsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` VendorAnalytics from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` VendorAnalytics.
     */
    skip?: number;
    distinct?:
      | VendorAnalyticsScalarFieldEnum
      | VendorAnalyticsScalarFieldEnum[];
  };

  /**
   * VendorAnalytics create
   */
  export type VendorAnalyticsCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorAnalytics
     */
    select?: VendorAnalyticsSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorAnalyticsInclude<ExtArgs> | null;
    /**
     * The data needed to create a VendorAnalytics.
     */
    data: XOR<VendorAnalyticsCreateInput, VendorAnalyticsUncheckedCreateInput>;
  };

  /**
   * VendorAnalytics createMany
   */
  export type VendorAnalyticsCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many VendorAnalytics.
     */
    data: VendorAnalyticsCreateManyInput | VendorAnalyticsCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * VendorAnalytics createManyAndReturn
   */
  export type VendorAnalyticsCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorAnalytics
     */
    select?: VendorAnalyticsSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many VendorAnalytics.
     */
    data: VendorAnalyticsCreateManyInput | VendorAnalyticsCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorAnalyticsIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * VendorAnalytics update
   */
  export type VendorAnalyticsUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorAnalytics
     */
    select?: VendorAnalyticsSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorAnalyticsInclude<ExtArgs> | null;
    /**
     * The data needed to update a VendorAnalytics.
     */
    data: XOR<VendorAnalyticsUpdateInput, VendorAnalyticsUncheckedUpdateInput>;
    /**
     * Choose, which VendorAnalytics to update.
     */
    where: VendorAnalyticsWhereUniqueInput;
  };

  /**
   * VendorAnalytics updateMany
   */
  export type VendorAnalyticsUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update VendorAnalytics.
     */
    data: XOR<
      VendorAnalyticsUpdateManyMutationInput,
      VendorAnalyticsUncheckedUpdateManyInput
    >;
    /**
     * Filter which VendorAnalytics to update
     */
    where?: VendorAnalyticsWhereInput;
  };

  /**
   * VendorAnalytics upsert
   */
  export type VendorAnalyticsUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorAnalytics
     */
    select?: VendorAnalyticsSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorAnalyticsInclude<ExtArgs> | null;
    /**
     * The filter to search for the VendorAnalytics to update in case it exists.
     */
    where: VendorAnalyticsWhereUniqueInput;
    /**
     * In case the VendorAnalytics found by the `where` argument doesn't exist, create a new VendorAnalytics with this data.
     */
    create: XOR<
      VendorAnalyticsCreateInput,
      VendorAnalyticsUncheckedCreateInput
    >;
    /**
     * In case the VendorAnalytics was found with the provided `where` argument, update it with this data.
     */
    update: XOR<
      VendorAnalyticsUpdateInput,
      VendorAnalyticsUncheckedUpdateInput
    >;
  };

  /**
   * VendorAnalytics delete
   */
  export type VendorAnalyticsDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorAnalytics
     */
    select?: VendorAnalyticsSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorAnalyticsInclude<ExtArgs> | null;
    /**
     * Filter which VendorAnalytics to delete.
     */
    where: VendorAnalyticsWhereUniqueInput;
  };

  /**
   * VendorAnalytics deleteMany
   */
  export type VendorAnalyticsDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which VendorAnalytics to delete
     */
    where?: VendorAnalyticsWhereInput;
  };

  /**
   * VendorAnalytics without action
   */
  export type VendorAnalyticsDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VendorAnalytics
     */
    select?: VendorAnalyticsSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorAnalyticsInclude<ExtArgs> | null;
  };

  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted';
    ReadCommitted: 'ReadCommitted';
    RepeatableRead: 'RepeatableRead';
    Serializable: 'Serializable';
  };

  export type TransactionIsolationLevel =
    (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

  export const VendorScalarFieldEnum: {
    id: 'id';
    name: 'name';
    email: 'email';
    phone: 'phone';
    address: 'address';
    description: 'description';
    isActive: 'isActive';
    isVerified: 'isVerified';
    rating: 'rating';
    reviewCount: 'reviewCount';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type VendorScalarFieldEnum =
    (typeof VendorScalarFieldEnum)[keyof typeof VendorScalarFieldEnum];

  export const ProductScalarFieldEnum: {
    id: 'id';
    name: 'name';
    description: 'description';
    price: 'price';
    comparePrice: 'comparePrice';
    sku: 'sku';
    category: 'category';
    subcategory: 'subcategory';
    brand: 'brand';
    images: 'images';
    specifications: 'specifications';
    vendorId: 'vendorId';
    isActive: 'isActive';
    rating: 'rating';
    reviewCount: 'reviewCount';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type ProductScalarFieldEnum =
    (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum];

  export const ProductInventoryScalarFieldEnum: {
    id: 'id';
    productId: 'productId';
    quantity: 'quantity';
    reservedQuantity: 'reservedQuantity';
    lowStockThreshold: 'lowStockThreshold';
    trackQuantity: 'trackQuantity';
    updatedAt: 'updatedAt';
  };

  export type ProductInventoryScalarFieldEnum =
    (typeof ProductInventoryScalarFieldEnum)[keyof typeof ProductInventoryScalarFieldEnum];

  export const InventoryReservationScalarFieldEnum: {
    id: 'id';
    productId: 'productId';
    quantity: 'quantity';
    customerId: 'customerId';
    orderId: 'orderId';
    sessionId: 'sessionId';
    expiresAt: 'expiresAt';
    createdAt: 'createdAt';
  };

  export type InventoryReservationScalarFieldEnum =
    (typeof InventoryReservationScalarFieldEnum)[keyof typeof InventoryReservationScalarFieldEnum];

  export const CategoryScalarFieldEnum: {
    id: 'id';
    name: 'name';
    slug: 'slug';
    description: 'description';
    parentId: 'parentId';
    isActive: 'isActive';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type CategoryScalarFieldEnum =
    (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum];

  export const ShoppingCartScalarFieldEnum: {
    id: 'id';
    customerId: 'customerId';
    updatedAt: 'updatedAt';
  };

  export type ShoppingCartScalarFieldEnum =
    (typeof ShoppingCartScalarFieldEnum)[keyof typeof ShoppingCartScalarFieldEnum];

  export const CartItemScalarFieldEnum: {
    id: 'id';
    cartId: 'cartId';
    productId: 'productId';
    quantity: 'quantity';
    price: 'price';
    addedAt: 'addedAt';
  };

  export type CartItemScalarFieldEnum =
    (typeof CartItemScalarFieldEnum)[keyof typeof CartItemScalarFieldEnum];

  export const OrderScalarFieldEnum: {
    id: 'id';
    customerId: 'customerId';
    status: 'status';
    subtotal: 'subtotal';
    tax: 'tax';
    shipping: 'shipping';
    total: 'total';
    shippingAddress: 'shippingAddress';
    paymentMethod: 'paymentMethod';
    paymentStatus: 'paymentStatus';
    paymentIntentId: 'paymentIntentId';
    notes: 'notes';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type OrderScalarFieldEnum =
    (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum];

  export const VendorOrderScalarFieldEnum: {
    id: 'id';
    orderId: 'orderId';
    vendorId: 'vendorId';
    status: 'status';
    subtotal: 'subtotal';
    shipping: 'shipping';
    total: 'total';
    trackingNumber: 'trackingNumber';
    estimatedDelivery: 'estimatedDelivery';
    notes: 'notes';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type VendorOrderScalarFieldEnum =
    (typeof VendorOrderScalarFieldEnum)[keyof typeof VendorOrderScalarFieldEnum];

  export const OrderItemScalarFieldEnum: {
    id: 'id';
    orderId: 'orderId';
    vendorOrderId: 'vendorOrderId';
    productId: 'productId';
    quantity: 'quantity';
    price: 'price';
    createdAt: 'createdAt';
  };

  export type OrderItemScalarFieldEnum =
    (typeof OrderItemScalarFieldEnum)[keyof typeof OrderItemScalarFieldEnum];

  export const ProductReviewScalarFieldEnum: {
    id: 'id';
    productId: 'productId';
    customerId: 'customerId';
    rating: 'rating';
    title: 'title';
    review: 'review';
    isVerified: 'isVerified';
    isActive: 'isActive';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type ProductReviewScalarFieldEnum =
    (typeof ProductReviewScalarFieldEnum)[keyof typeof ProductReviewScalarFieldEnum];

  export const WishlistScalarFieldEnum: {
    id: 'id';
    customerId: 'customerId';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type WishlistScalarFieldEnum =
    (typeof WishlistScalarFieldEnum)[keyof typeof WishlistScalarFieldEnum];

  export const WishlistItemScalarFieldEnum: {
    id: 'id';
    wishlistId: 'wishlistId';
    productId: 'productId';
    addedAt: 'addedAt';
  };

  export type WishlistItemScalarFieldEnum =
    (typeof WishlistItemScalarFieldEnum)[keyof typeof WishlistItemScalarFieldEnum];

  export const VendorAnalyticsScalarFieldEnum: {
    id: 'id';
    vendorId: 'vendorId';
    period: 'period';
    date: 'date';
    totalOrders: 'totalOrders';
    totalRevenue: 'totalRevenue';
    totalViews: 'totalViews';
    conversionRate: 'conversionRate';
    createdAt: 'createdAt';
  };

  export type VendorAnalyticsScalarFieldEnum =
    (typeof VendorAnalyticsScalarFieldEnum)[keyof typeof VendorAnalyticsScalarFieldEnum];

  export const SortOrder: {
    asc: 'asc';
    desc: 'desc';
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull;
    JsonNull: typeof JsonNull;
  };

  export type NullableJsonNullValueInput =
    (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];

  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull;
  };

  export type JsonNullValueInput =
    (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];

  export const QueryMode: {
    default: 'default';
    insensitive: 'insensitive';
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

  export const JsonNullValueFilter: {
    DbNull: typeof DbNull;
    JsonNull: typeof JsonNull;
    AnyNull: typeof AnyNull;
  };

  export type JsonNullValueFilter =
    (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];

  export const NullsOrder: {
    first: 'first';
    last: 'last';
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'String'
  >;

  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'String[]'
  >;

  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Json'
  >;

  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Boolean'
  >;

  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Float'
  >;

  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Float[]'
  >;

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Int'
  >;

  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Int[]'
  >;

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime'
  >;

  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime[]'
  >;

  /**
   * Reference to a field of type 'OrderStatus'
   */
  export type EnumOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'OrderStatus'
  >;

  /**
   * Reference to a field of type 'OrderStatus[]'
   */
  export type ListEnumOrderStatusFieldRefInput<$PrismaModel> =
    FieldRefInputType<$PrismaModel, 'OrderStatus[]'>;

  /**
   * Reference to a field of type 'PaymentStatus'
   */
  export type EnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'PaymentStatus'
  >;

  /**
   * Reference to a field of type 'PaymentStatus[]'
   */
  export type ListEnumPaymentStatusFieldRefInput<$PrismaModel> =
    FieldRefInputType<$PrismaModel, 'PaymentStatus[]'>;

  /**
   * Deep Input Types
   */

  export type VendorWhereInput = {
    AND?: VendorWhereInput | VendorWhereInput[];
    OR?: VendorWhereInput[];
    NOT?: VendorWhereInput | VendorWhereInput[];
    id?: StringFilter<'Vendor'> | string;
    name?: StringFilter<'Vendor'> | string;
    email?: StringFilter<'Vendor'> | string;
    phone?: StringNullableFilter<'Vendor'> | string | null;
    address?: JsonNullableFilter<'Vendor'>;
    description?: StringNullableFilter<'Vendor'> | string | null;
    isActive?: BoolFilter<'Vendor'> | boolean;
    isVerified?: BoolFilter<'Vendor'> | boolean;
    rating?: FloatNullableFilter<'Vendor'> | number | null;
    reviewCount?: IntFilter<'Vendor'> | number;
    createdAt?: DateTimeFilter<'Vendor'> | Date | string;
    updatedAt?: DateTimeFilter<'Vendor'> | Date | string;
    products?: ProductListRelationFilter;
    analytics?: VendorAnalyticsListRelationFilter;
  };

  export type VendorOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    email?: SortOrder;
    phone?: SortOrderInput | SortOrder;
    address?: SortOrderInput | SortOrder;
    description?: SortOrderInput | SortOrder;
    isActive?: SortOrder;
    isVerified?: SortOrder;
    rating?: SortOrderInput | SortOrder;
    reviewCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    products?: ProductOrderByRelationAggregateInput;
    analytics?: VendorAnalyticsOrderByRelationAggregateInput;
  };

  export type VendorWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      email?: string;
      AND?: VendorWhereInput | VendorWhereInput[];
      OR?: VendorWhereInput[];
      NOT?: VendorWhereInput | VendorWhereInput[];
      name?: StringFilter<'Vendor'> | string;
      phone?: StringNullableFilter<'Vendor'> | string | null;
      address?: JsonNullableFilter<'Vendor'>;
      description?: StringNullableFilter<'Vendor'> | string | null;
      isActive?: BoolFilter<'Vendor'> | boolean;
      isVerified?: BoolFilter<'Vendor'> | boolean;
      rating?: FloatNullableFilter<'Vendor'> | number | null;
      reviewCount?: IntFilter<'Vendor'> | number;
      createdAt?: DateTimeFilter<'Vendor'> | Date | string;
      updatedAt?: DateTimeFilter<'Vendor'> | Date | string;
      products?: ProductListRelationFilter;
      analytics?: VendorAnalyticsListRelationFilter;
    },
    'id' | 'email'
  >;

  export type VendorOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    email?: SortOrder;
    phone?: SortOrderInput | SortOrder;
    address?: SortOrderInput | SortOrder;
    description?: SortOrderInput | SortOrder;
    isActive?: SortOrder;
    isVerified?: SortOrder;
    rating?: SortOrderInput | SortOrder;
    reviewCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: VendorCountOrderByAggregateInput;
    _avg?: VendorAvgOrderByAggregateInput;
    _max?: VendorMaxOrderByAggregateInput;
    _min?: VendorMinOrderByAggregateInput;
    _sum?: VendorSumOrderByAggregateInput;
  };

  export type VendorScalarWhereWithAggregatesInput = {
    AND?:
      | VendorScalarWhereWithAggregatesInput
      | VendorScalarWhereWithAggregatesInput[];
    OR?: VendorScalarWhereWithAggregatesInput[];
    NOT?:
      | VendorScalarWhereWithAggregatesInput
      | VendorScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Vendor'> | string;
    name?: StringWithAggregatesFilter<'Vendor'> | string;
    email?: StringWithAggregatesFilter<'Vendor'> | string;
    phone?: StringNullableWithAggregatesFilter<'Vendor'> | string | null;
    address?: JsonNullableWithAggregatesFilter<'Vendor'>;
    description?: StringNullableWithAggregatesFilter<'Vendor'> | string | null;
    isActive?: BoolWithAggregatesFilter<'Vendor'> | boolean;
    isVerified?: BoolWithAggregatesFilter<'Vendor'> | boolean;
    rating?: FloatNullableWithAggregatesFilter<'Vendor'> | number | null;
    reviewCount?: IntWithAggregatesFilter<'Vendor'> | number;
    createdAt?: DateTimeWithAggregatesFilter<'Vendor'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Vendor'> | Date | string;
  };

  export type ProductWhereInput = {
    AND?: ProductWhereInput | ProductWhereInput[];
    OR?: ProductWhereInput[];
    NOT?: ProductWhereInput | ProductWhereInput[];
    id?: StringFilter<'Product'> | string;
    name?: StringFilter<'Product'> | string;
    description?: StringFilter<'Product'> | string;
    price?: FloatFilter<'Product'> | number;
    comparePrice?: FloatNullableFilter<'Product'> | number | null;
    sku?: StringNullableFilter<'Product'> | string | null;
    category?: StringFilter<'Product'> | string;
    subcategory?: StringNullableFilter<'Product'> | string | null;
    brand?: StringNullableFilter<'Product'> | string | null;
    images?: StringNullableListFilter<'Product'>;
    specifications?: JsonNullableFilter<'Product'>;
    vendorId?: StringFilter<'Product'> | string;
    isActive?: BoolFilter<'Product'> | boolean;
    rating?: FloatNullableFilter<'Product'> | number | null;
    reviewCount?: IntFilter<'Product'> | number;
    createdAt?: DateTimeFilter<'Product'> | Date | string;
    updatedAt?: DateTimeFilter<'Product'> | Date | string;
    vendor?: XOR<VendorRelationFilter, VendorWhereInput>;
    inventory?: XOR<
      ProductInventoryNullableRelationFilter,
      ProductInventoryWhereInput
    > | null;
    reservations?: InventoryReservationListRelationFilter;
    orderItems?: OrderItemListRelationFilter;
    reviews?: ProductReviewListRelationFilter;
    cartItems?: CartItemListRelationFilter;
    wishlistItems?: WishlistItemListRelationFilter;
  };

  export type ProductOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    price?: SortOrder;
    comparePrice?: SortOrderInput | SortOrder;
    sku?: SortOrderInput | SortOrder;
    category?: SortOrder;
    subcategory?: SortOrderInput | SortOrder;
    brand?: SortOrderInput | SortOrder;
    images?: SortOrder;
    specifications?: SortOrderInput | SortOrder;
    vendorId?: SortOrder;
    isActive?: SortOrder;
    rating?: SortOrderInput | SortOrder;
    reviewCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    vendor?: VendorOrderByWithRelationInput;
    inventory?: ProductInventoryOrderByWithRelationInput;
    reservations?: InventoryReservationOrderByRelationAggregateInput;
    orderItems?: OrderItemOrderByRelationAggregateInput;
    reviews?: ProductReviewOrderByRelationAggregateInput;
    cartItems?: CartItemOrderByRelationAggregateInput;
    wishlistItems?: WishlistItemOrderByRelationAggregateInput;
  };

  export type ProductWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      sku?: string;
      AND?: ProductWhereInput | ProductWhereInput[];
      OR?: ProductWhereInput[];
      NOT?: ProductWhereInput | ProductWhereInput[];
      name?: StringFilter<'Product'> | string;
      description?: StringFilter<'Product'> | string;
      price?: FloatFilter<'Product'> | number;
      comparePrice?: FloatNullableFilter<'Product'> | number | null;
      category?: StringFilter<'Product'> | string;
      subcategory?: StringNullableFilter<'Product'> | string | null;
      brand?: StringNullableFilter<'Product'> | string | null;
      images?: StringNullableListFilter<'Product'>;
      specifications?: JsonNullableFilter<'Product'>;
      vendorId?: StringFilter<'Product'> | string;
      isActive?: BoolFilter<'Product'> | boolean;
      rating?: FloatNullableFilter<'Product'> | number | null;
      reviewCount?: IntFilter<'Product'> | number;
      createdAt?: DateTimeFilter<'Product'> | Date | string;
      updatedAt?: DateTimeFilter<'Product'> | Date | string;
      vendor?: XOR<VendorRelationFilter, VendorWhereInput>;
      inventory?: XOR<
        ProductInventoryNullableRelationFilter,
        ProductInventoryWhereInput
      > | null;
      reservations?: InventoryReservationListRelationFilter;
      orderItems?: OrderItemListRelationFilter;
      reviews?: ProductReviewListRelationFilter;
      cartItems?: CartItemListRelationFilter;
      wishlistItems?: WishlistItemListRelationFilter;
    },
    'id' | 'sku'
  >;

  export type ProductOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    price?: SortOrder;
    comparePrice?: SortOrderInput | SortOrder;
    sku?: SortOrderInput | SortOrder;
    category?: SortOrder;
    subcategory?: SortOrderInput | SortOrder;
    brand?: SortOrderInput | SortOrder;
    images?: SortOrder;
    specifications?: SortOrderInput | SortOrder;
    vendorId?: SortOrder;
    isActive?: SortOrder;
    rating?: SortOrderInput | SortOrder;
    reviewCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: ProductCountOrderByAggregateInput;
    _avg?: ProductAvgOrderByAggregateInput;
    _max?: ProductMaxOrderByAggregateInput;
    _min?: ProductMinOrderByAggregateInput;
    _sum?: ProductSumOrderByAggregateInput;
  };

  export type ProductScalarWhereWithAggregatesInput = {
    AND?:
      | ProductScalarWhereWithAggregatesInput
      | ProductScalarWhereWithAggregatesInput[];
    OR?: ProductScalarWhereWithAggregatesInput[];
    NOT?:
      | ProductScalarWhereWithAggregatesInput
      | ProductScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Product'> | string;
    name?: StringWithAggregatesFilter<'Product'> | string;
    description?: StringWithAggregatesFilter<'Product'> | string;
    price?: FloatWithAggregatesFilter<'Product'> | number;
    comparePrice?: FloatNullableWithAggregatesFilter<'Product'> | number | null;
    sku?: StringNullableWithAggregatesFilter<'Product'> | string | null;
    category?: StringWithAggregatesFilter<'Product'> | string;
    subcategory?: StringNullableWithAggregatesFilter<'Product'> | string | null;
    brand?: StringNullableWithAggregatesFilter<'Product'> | string | null;
    images?: StringNullableListFilter<'Product'>;
    specifications?: JsonNullableWithAggregatesFilter<'Product'>;
    vendorId?: StringWithAggregatesFilter<'Product'> | string;
    isActive?: BoolWithAggregatesFilter<'Product'> | boolean;
    rating?: FloatNullableWithAggregatesFilter<'Product'> | number | null;
    reviewCount?: IntWithAggregatesFilter<'Product'> | number;
    createdAt?: DateTimeWithAggregatesFilter<'Product'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Product'> | Date | string;
  };

  export type ProductInventoryWhereInput = {
    AND?: ProductInventoryWhereInput | ProductInventoryWhereInput[];
    OR?: ProductInventoryWhereInput[];
    NOT?: ProductInventoryWhereInput | ProductInventoryWhereInput[];
    id?: StringFilter<'ProductInventory'> | string;
    productId?: StringFilter<'ProductInventory'> | string;
    quantity?: IntFilter<'ProductInventory'> | number;
    reservedQuantity?: IntFilter<'ProductInventory'> | number;
    lowStockThreshold?: IntFilter<'ProductInventory'> | number;
    trackQuantity?: BoolFilter<'ProductInventory'> | boolean;
    updatedAt?: DateTimeFilter<'ProductInventory'> | Date | string;
    product?: XOR<ProductRelationFilter, ProductWhereInput>;
  };

  export type ProductInventoryOrderByWithRelationInput = {
    id?: SortOrder;
    productId?: SortOrder;
    quantity?: SortOrder;
    reservedQuantity?: SortOrder;
    lowStockThreshold?: SortOrder;
    trackQuantity?: SortOrder;
    updatedAt?: SortOrder;
    product?: ProductOrderByWithRelationInput;
  };

  export type ProductInventoryWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      productId?: string;
      AND?: ProductInventoryWhereInput | ProductInventoryWhereInput[];
      OR?: ProductInventoryWhereInput[];
      NOT?: ProductInventoryWhereInput | ProductInventoryWhereInput[];
      quantity?: IntFilter<'ProductInventory'> | number;
      reservedQuantity?: IntFilter<'ProductInventory'> | number;
      lowStockThreshold?: IntFilter<'ProductInventory'> | number;
      trackQuantity?: BoolFilter<'ProductInventory'> | boolean;
      updatedAt?: DateTimeFilter<'ProductInventory'> | Date | string;
      product?: XOR<ProductRelationFilter, ProductWhereInput>;
    },
    'id' | 'productId'
  >;

  export type ProductInventoryOrderByWithAggregationInput = {
    id?: SortOrder;
    productId?: SortOrder;
    quantity?: SortOrder;
    reservedQuantity?: SortOrder;
    lowStockThreshold?: SortOrder;
    trackQuantity?: SortOrder;
    updatedAt?: SortOrder;
    _count?: ProductInventoryCountOrderByAggregateInput;
    _avg?: ProductInventoryAvgOrderByAggregateInput;
    _max?: ProductInventoryMaxOrderByAggregateInput;
    _min?: ProductInventoryMinOrderByAggregateInput;
    _sum?: ProductInventorySumOrderByAggregateInput;
  };

  export type ProductInventoryScalarWhereWithAggregatesInput = {
    AND?:
      | ProductInventoryScalarWhereWithAggregatesInput
      | ProductInventoryScalarWhereWithAggregatesInput[];
    OR?: ProductInventoryScalarWhereWithAggregatesInput[];
    NOT?:
      | ProductInventoryScalarWhereWithAggregatesInput
      | ProductInventoryScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'ProductInventory'> | string;
    productId?: StringWithAggregatesFilter<'ProductInventory'> | string;
    quantity?: IntWithAggregatesFilter<'ProductInventory'> | number;
    reservedQuantity?: IntWithAggregatesFilter<'ProductInventory'> | number;
    lowStockThreshold?: IntWithAggregatesFilter<'ProductInventory'> | number;
    trackQuantity?: BoolWithAggregatesFilter<'ProductInventory'> | boolean;
    updatedAt?:
      | DateTimeWithAggregatesFilter<'ProductInventory'>
      | Date
      | string;
  };

  export type InventoryReservationWhereInput = {
    AND?: InventoryReservationWhereInput | InventoryReservationWhereInput[];
    OR?: InventoryReservationWhereInput[];
    NOT?: InventoryReservationWhereInput | InventoryReservationWhereInput[];
    id?: StringFilter<'InventoryReservation'> | string;
    productId?: StringFilter<'InventoryReservation'> | string;
    quantity?: IntFilter<'InventoryReservation'> | number;
    customerId?: StringFilter<'InventoryReservation'> | string;
    orderId?: StringNullableFilter<'InventoryReservation'> | string | null;
    sessionId?: StringNullableFilter<'InventoryReservation'> | string | null;
    expiresAt?: DateTimeFilter<'InventoryReservation'> | Date | string;
    createdAt?: DateTimeFilter<'InventoryReservation'> | Date | string;
    product?: XOR<ProductRelationFilter, ProductWhereInput>;
  };

  export type InventoryReservationOrderByWithRelationInput = {
    id?: SortOrder;
    productId?: SortOrder;
    quantity?: SortOrder;
    customerId?: SortOrder;
    orderId?: SortOrderInput | SortOrder;
    sessionId?: SortOrderInput | SortOrder;
    expiresAt?: SortOrder;
    createdAt?: SortOrder;
    product?: ProductOrderByWithRelationInput;
  };

  export type InventoryReservationWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: InventoryReservationWhereInput | InventoryReservationWhereInput[];
      OR?: InventoryReservationWhereInput[];
      NOT?: InventoryReservationWhereInput | InventoryReservationWhereInput[];
      productId?: StringFilter<'InventoryReservation'> | string;
      quantity?: IntFilter<'InventoryReservation'> | number;
      customerId?: StringFilter<'InventoryReservation'> | string;
      orderId?: StringNullableFilter<'InventoryReservation'> | string | null;
      sessionId?: StringNullableFilter<'InventoryReservation'> | string | null;
      expiresAt?: DateTimeFilter<'InventoryReservation'> | Date | string;
      createdAt?: DateTimeFilter<'InventoryReservation'> | Date | string;
      product?: XOR<ProductRelationFilter, ProductWhereInput>;
    },
    'id'
  >;

  export type InventoryReservationOrderByWithAggregationInput = {
    id?: SortOrder;
    productId?: SortOrder;
    quantity?: SortOrder;
    customerId?: SortOrder;
    orderId?: SortOrderInput | SortOrder;
    sessionId?: SortOrderInput | SortOrder;
    expiresAt?: SortOrder;
    createdAt?: SortOrder;
    _count?: InventoryReservationCountOrderByAggregateInput;
    _avg?: InventoryReservationAvgOrderByAggregateInput;
    _max?: InventoryReservationMaxOrderByAggregateInput;
    _min?: InventoryReservationMinOrderByAggregateInput;
    _sum?: InventoryReservationSumOrderByAggregateInput;
  };

  export type InventoryReservationScalarWhereWithAggregatesInput = {
    AND?:
      | InventoryReservationScalarWhereWithAggregatesInput
      | InventoryReservationScalarWhereWithAggregatesInput[];
    OR?: InventoryReservationScalarWhereWithAggregatesInput[];
    NOT?:
      | InventoryReservationScalarWhereWithAggregatesInput
      | InventoryReservationScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'InventoryReservation'> | string;
    productId?: StringWithAggregatesFilter<'InventoryReservation'> | string;
    quantity?: IntWithAggregatesFilter<'InventoryReservation'> | number;
    customerId?: StringWithAggregatesFilter<'InventoryReservation'> | string;
    orderId?:
      | StringNullableWithAggregatesFilter<'InventoryReservation'>
      | string
      | null;
    sessionId?:
      | StringNullableWithAggregatesFilter<'InventoryReservation'>
      | string
      | null;
    expiresAt?:
      | DateTimeWithAggregatesFilter<'InventoryReservation'>
      | Date
      | string;
    createdAt?:
      | DateTimeWithAggregatesFilter<'InventoryReservation'>
      | Date
      | string;
  };

  export type CategoryWhereInput = {
    AND?: CategoryWhereInput | CategoryWhereInput[];
    OR?: CategoryWhereInput[];
    NOT?: CategoryWhereInput | CategoryWhereInput[];
    id?: StringFilter<'Category'> | string;
    name?: StringFilter<'Category'> | string;
    slug?: StringFilter<'Category'> | string;
    description?: StringNullableFilter<'Category'> | string | null;
    parentId?: StringNullableFilter<'Category'> | string | null;
    isActive?: BoolFilter<'Category'> | boolean;
    createdAt?: DateTimeFilter<'Category'> | Date | string;
    updatedAt?: DateTimeFilter<'Category'> | Date | string;
    parent?: XOR<CategoryNullableRelationFilter, CategoryWhereInput> | null;
    children?: CategoryListRelationFilter;
  };

  export type CategoryOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    slug?: SortOrder;
    description?: SortOrderInput | SortOrder;
    parentId?: SortOrderInput | SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    parent?: CategoryOrderByWithRelationInput;
    children?: CategoryOrderByRelationAggregateInput;
  };

  export type CategoryWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      name?: string;
      slug?: string;
      AND?: CategoryWhereInput | CategoryWhereInput[];
      OR?: CategoryWhereInput[];
      NOT?: CategoryWhereInput | CategoryWhereInput[];
      description?: StringNullableFilter<'Category'> | string | null;
      parentId?: StringNullableFilter<'Category'> | string | null;
      isActive?: BoolFilter<'Category'> | boolean;
      createdAt?: DateTimeFilter<'Category'> | Date | string;
      updatedAt?: DateTimeFilter<'Category'> | Date | string;
      parent?: XOR<CategoryNullableRelationFilter, CategoryWhereInput> | null;
      children?: CategoryListRelationFilter;
    },
    'id' | 'name' | 'slug'
  >;

  export type CategoryOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    slug?: SortOrder;
    description?: SortOrderInput | SortOrder;
    parentId?: SortOrderInput | SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: CategoryCountOrderByAggregateInput;
    _max?: CategoryMaxOrderByAggregateInput;
    _min?: CategoryMinOrderByAggregateInput;
  };

  export type CategoryScalarWhereWithAggregatesInput = {
    AND?:
      | CategoryScalarWhereWithAggregatesInput
      | CategoryScalarWhereWithAggregatesInput[];
    OR?: CategoryScalarWhereWithAggregatesInput[];
    NOT?:
      | CategoryScalarWhereWithAggregatesInput
      | CategoryScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Category'> | string;
    name?: StringWithAggregatesFilter<'Category'> | string;
    slug?: StringWithAggregatesFilter<'Category'> | string;
    description?:
      | StringNullableWithAggregatesFilter<'Category'>
      | string
      | null;
    parentId?: StringNullableWithAggregatesFilter<'Category'> | string | null;
    isActive?: BoolWithAggregatesFilter<'Category'> | boolean;
    createdAt?: DateTimeWithAggregatesFilter<'Category'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Category'> | Date | string;
  };

  export type ShoppingCartWhereInput = {
    AND?: ShoppingCartWhereInput | ShoppingCartWhereInput[];
    OR?: ShoppingCartWhereInput[];
    NOT?: ShoppingCartWhereInput | ShoppingCartWhereInput[];
    id?: StringFilter<'ShoppingCart'> | string;
    customerId?: StringFilter<'ShoppingCart'> | string;
    updatedAt?: DateTimeFilter<'ShoppingCart'> | Date | string;
    items?: CartItemListRelationFilter;
  };

  export type ShoppingCartOrderByWithRelationInput = {
    id?: SortOrder;
    customerId?: SortOrder;
    updatedAt?: SortOrder;
    items?: CartItemOrderByRelationAggregateInput;
  };

  export type ShoppingCartWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      customerId?: string;
      AND?: ShoppingCartWhereInput | ShoppingCartWhereInput[];
      OR?: ShoppingCartWhereInput[];
      NOT?: ShoppingCartWhereInput | ShoppingCartWhereInput[];
      updatedAt?: DateTimeFilter<'ShoppingCart'> | Date | string;
      items?: CartItemListRelationFilter;
    },
    'id' | 'customerId'
  >;

  export type ShoppingCartOrderByWithAggregationInput = {
    id?: SortOrder;
    customerId?: SortOrder;
    updatedAt?: SortOrder;
    _count?: ShoppingCartCountOrderByAggregateInput;
    _max?: ShoppingCartMaxOrderByAggregateInput;
    _min?: ShoppingCartMinOrderByAggregateInput;
  };

  export type ShoppingCartScalarWhereWithAggregatesInput = {
    AND?:
      | ShoppingCartScalarWhereWithAggregatesInput
      | ShoppingCartScalarWhereWithAggregatesInput[];
    OR?: ShoppingCartScalarWhereWithAggregatesInput[];
    NOT?:
      | ShoppingCartScalarWhereWithAggregatesInput
      | ShoppingCartScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'ShoppingCart'> | string;
    customerId?: StringWithAggregatesFilter<'ShoppingCart'> | string;
    updatedAt?: DateTimeWithAggregatesFilter<'ShoppingCart'> | Date | string;
  };

  export type CartItemWhereInput = {
    AND?: CartItemWhereInput | CartItemWhereInput[];
    OR?: CartItemWhereInput[];
    NOT?: CartItemWhereInput | CartItemWhereInput[];
    id?: StringFilter<'CartItem'> | string;
    cartId?: StringFilter<'CartItem'> | string;
    productId?: StringFilter<'CartItem'> | string;
    quantity?: IntFilter<'CartItem'> | number;
    price?: FloatFilter<'CartItem'> | number;
    addedAt?: DateTimeFilter<'CartItem'> | Date | string;
    cart?: XOR<ShoppingCartRelationFilter, ShoppingCartWhereInput>;
    product?: XOR<ProductRelationFilter, ProductWhereInput>;
  };

  export type CartItemOrderByWithRelationInput = {
    id?: SortOrder;
    cartId?: SortOrder;
    productId?: SortOrder;
    quantity?: SortOrder;
    price?: SortOrder;
    addedAt?: SortOrder;
    cart?: ShoppingCartOrderByWithRelationInput;
    product?: ProductOrderByWithRelationInput;
  };

  export type CartItemWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      cartId_productId?: CartItemCartIdProductIdCompoundUniqueInput;
      AND?: CartItemWhereInput | CartItemWhereInput[];
      OR?: CartItemWhereInput[];
      NOT?: CartItemWhereInput | CartItemWhereInput[];
      cartId?: StringFilter<'CartItem'> | string;
      productId?: StringFilter<'CartItem'> | string;
      quantity?: IntFilter<'CartItem'> | number;
      price?: FloatFilter<'CartItem'> | number;
      addedAt?: DateTimeFilter<'CartItem'> | Date | string;
      cart?: XOR<ShoppingCartRelationFilter, ShoppingCartWhereInput>;
      product?: XOR<ProductRelationFilter, ProductWhereInput>;
    },
    'id' | 'cartId_productId'
  >;

  export type CartItemOrderByWithAggregationInput = {
    id?: SortOrder;
    cartId?: SortOrder;
    productId?: SortOrder;
    quantity?: SortOrder;
    price?: SortOrder;
    addedAt?: SortOrder;
    _count?: CartItemCountOrderByAggregateInput;
    _avg?: CartItemAvgOrderByAggregateInput;
    _max?: CartItemMaxOrderByAggregateInput;
    _min?: CartItemMinOrderByAggregateInput;
    _sum?: CartItemSumOrderByAggregateInput;
  };

  export type CartItemScalarWhereWithAggregatesInput = {
    AND?:
      | CartItemScalarWhereWithAggregatesInput
      | CartItemScalarWhereWithAggregatesInput[];
    OR?: CartItemScalarWhereWithAggregatesInput[];
    NOT?:
      | CartItemScalarWhereWithAggregatesInput
      | CartItemScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'CartItem'> | string;
    cartId?: StringWithAggregatesFilter<'CartItem'> | string;
    productId?: StringWithAggregatesFilter<'CartItem'> | string;
    quantity?: IntWithAggregatesFilter<'CartItem'> | number;
    price?: FloatWithAggregatesFilter<'CartItem'> | number;
    addedAt?: DateTimeWithAggregatesFilter<'CartItem'> | Date | string;
  };

  export type OrderWhereInput = {
    AND?: OrderWhereInput | OrderWhereInput[];
    OR?: OrderWhereInput[];
    NOT?: OrderWhereInput | OrderWhereInput[];
    id?: StringFilter<'Order'> | string;
    customerId?: StringFilter<'Order'> | string;
    status?: EnumOrderStatusFilter<'Order'> | $Enums.OrderStatus;
    subtotal?: FloatFilter<'Order'> | number;
    tax?: FloatFilter<'Order'> | number;
    shipping?: FloatFilter<'Order'> | number;
    total?: FloatFilter<'Order'> | number;
    shippingAddress?: JsonFilter<'Order'>;
    paymentMethod?: StringFilter<'Order'> | string;
    paymentStatus?: EnumPaymentStatusFilter<'Order'> | $Enums.PaymentStatus;
    paymentIntentId?: StringNullableFilter<'Order'> | string | null;
    notes?: StringNullableFilter<'Order'> | string | null;
    createdAt?: DateTimeFilter<'Order'> | Date | string;
    updatedAt?: DateTimeFilter<'Order'> | Date | string;
    items?: OrderItemListRelationFilter;
    vendorOrders?: VendorOrderListRelationFilter;
  };

  export type OrderOrderByWithRelationInput = {
    id?: SortOrder;
    customerId?: SortOrder;
    status?: SortOrder;
    subtotal?: SortOrder;
    tax?: SortOrder;
    shipping?: SortOrder;
    total?: SortOrder;
    shippingAddress?: SortOrder;
    paymentMethod?: SortOrder;
    paymentStatus?: SortOrder;
    paymentIntentId?: SortOrderInput | SortOrder;
    notes?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    items?: OrderItemOrderByRelationAggregateInput;
    vendorOrders?: VendorOrderOrderByRelationAggregateInput;
  };

  export type OrderWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: OrderWhereInput | OrderWhereInput[];
      OR?: OrderWhereInput[];
      NOT?: OrderWhereInput | OrderWhereInput[];
      customerId?: StringFilter<'Order'> | string;
      status?: EnumOrderStatusFilter<'Order'> | $Enums.OrderStatus;
      subtotal?: FloatFilter<'Order'> | number;
      tax?: FloatFilter<'Order'> | number;
      shipping?: FloatFilter<'Order'> | number;
      total?: FloatFilter<'Order'> | number;
      shippingAddress?: JsonFilter<'Order'>;
      paymentMethod?: StringFilter<'Order'> | string;
      paymentStatus?: EnumPaymentStatusFilter<'Order'> | $Enums.PaymentStatus;
      paymentIntentId?: StringNullableFilter<'Order'> | string | null;
      notes?: StringNullableFilter<'Order'> | string | null;
      createdAt?: DateTimeFilter<'Order'> | Date | string;
      updatedAt?: DateTimeFilter<'Order'> | Date | string;
      items?: OrderItemListRelationFilter;
      vendorOrders?: VendorOrderListRelationFilter;
    },
    'id'
  >;

  export type OrderOrderByWithAggregationInput = {
    id?: SortOrder;
    customerId?: SortOrder;
    status?: SortOrder;
    subtotal?: SortOrder;
    tax?: SortOrder;
    shipping?: SortOrder;
    total?: SortOrder;
    shippingAddress?: SortOrder;
    paymentMethod?: SortOrder;
    paymentStatus?: SortOrder;
    paymentIntentId?: SortOrderInput | SortOrder;
    notes?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: OrderCountOrderByAggregateInput;
    _avg?: OrderAvgOrderByAggregateInput;
    _max?: OrderMaxOrderByAggregateInput;
    _min?: OrderMinOrderByAggregateInput;
    _sum?: OrderSumOrderByAggregateInput;
  };

  export type OrderScalarWhereWithAggregatesInput = {
    AND?:
      | OrderScalarWhereWithAggregatesInput
      | OrderScalarWhereWithAggregatesInput[];
    OR?: OrderScalarWhereWithAggregatesInput[];
    NOT?:
      | OrderScalarWhereWithAggregatesInput
      | OrderScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Order'> | string;
    customerId?: StringWithAggregatesFilter<'Order'> | string;
    status?: EnumOrderStatusWithAggregatesFilter<'Order'> | $Enums.OrderStatus;
    subtotal?: FloatWithAggregatesFilter<'Order'> | number;
    tax?: FloatWithAggregatesFilter<'Order'> | number;
    shipping?: FloatWithAggregatesFilter<'Order'> | number;
    total?: FloatWithAggregatesFilter<'Order'> | number;
    shippingAddress?: JsonWithAggregatesFilter<'Order'>;
    paymentMethod?: StringWithAggregatesFilter<'Order'> | string;
    paymentStatus?:
      | EnumPaymentStatusWithAggregatesFilter<'Order'>
      | $Enums.PaymentStatus;
    paymentIntentId?:
      | StringNullableWithAggregatesFilter<'Order'>
      | string
      | null;
    notes?: StringNullableWithAggregatesFilter<'Order'> | string | null;
    createdAt?: DateTimeWithAggregatesFilter<'Order'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Order'> | Date | string;
  };

  export type VendorOrderWhereInput = {
    AND?: VendorOrderWhereInput | VendorOrderWhereInput[];
    OR?: VendorOrderWhereInput[];
    NOT?: VendorOrderWhereInput | VendorOrderWhereInput[];
    id?: StringFilter<'VendorOrder'> | string;
    orderId?: StringFilter<'VendorOrder'> | string;
    vendorId?: StringFilter<'VendorOrder'> | string;
    status?: EnumOrderStatusFilter<'VendorOrder'> | $Enums.OrderStatus;
    subtotal?: FloatFilter<'VendorOrder'> | number;
    shipping?: FloatFilter<'VendorOrder'> | number;
    total?: FloatFilter<'VendorOrder'> | number;
    trackingNumber?: StringNullableFilter<'VendorOrder'> | string | null;
    estimatedDelivery?:
      | DateTimeNullableFilter<'VendorOrder'>
      | Date
      | string
      | null;
    notes?: StringNullableFilter<'VendorOrder'> | string | null;
    createdAt?: DateTimeFilter<'VendorOrder'> | Date | string;
    updatedAt?: DateTimeFilter<'VendorOrder'> | Date | string;
    order?: XOR<OrderRelationFilter, OrderWhereInput>;
    items?: OrderItemListRelationFilter;
  };

  export type VendorOrderOrderByWithRelationInput = {
    id?: SortOrder;
    orderId?: SortOrder;
    vendorId?: SortOrder;
    status?: SortOrder;
    subtotal?: SortOrder;
    shipping?: SortOrder;
    total?: SortOrder;
    trackingNumber?: SortOrderInput | SortOrder;
    estimatedDelivery?: SortOrderInput | SortOrder;
    notes?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    order?: OrderOrderByWithRelationInput;
    items?: OrderItemOrderByRelationAggregateInput;
  };

  export type VendorOrderWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: VendorOrderWhereInput | VendorOrderWhereInput[];
      OR?: VendorOrderWhereInput[];
      NOT?: VendorOrderWhereInput | VendorOrderWhereInput[];
      orderId?: StringFilter<'VendorOrder'> | string;
      vendorId?: StringFilter<'VendorOrder'> | string;
      status?: EnumOrderStatusFilter<'VendorOrder'> | $Enums.OrderStatus;
      subtotal?: FloatFilter<'VendorOrder'> | number;
      shipping?: FloatFilter<'VendorOrder'> | number;
      total?: FloatFilter<'VendorOrder'> | number;
      trackingNumber?: StringNullableFilter<'VendorOrder'> | string | null;
      estimatedDelivery?:
        | DateTimeNullableFilter<'VendorOrder'>
        | Date
        | string
        | null;
      notes?: StringNullableFilter<'VendorOrder'> | string | null;
      createdAt?: DateTimeFilter<'VendorOrder'> | Date | string;
      updatedAt?: DateTimeFilter<'VendorOrder'> | Date | string;
      order?: XOR<OrderRelationFilter, OrderWhereInput>;
      items?: OrderItemListRelationFilter;
    },
    'id'
  >;

  export type VendorOrderOrderByWithAggregationInput = {
    id?: SortOrder;
    orderId?: SortOrder;
    vendorId?: SortOrder;
    status?: SortOrder;
    subtotal?: SortOrder;
    shipping?: SortOrder;
    total?: SortOrder;
    trackingNumber?: SortOrderInput | SortOrder;
    estimatedDelivery?: SortOrderInput | SortOrder;
    notes?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: VendorOrderCountOrderByAggregateInput;
    _avg?: VendorOrderAvgOrderByAggregateInput;
    _max?: VendorOrderMaxOrderByAggregateInput;
    _min?: VendorOrderMinOrderByAggregateInput;
    _sum?: VendorOrderSumOrderByAggregateInput;
  };

  export type VendorOrderScalarWhereWithAggregatesInput = {
    AND?:
      | VendorOrderScalarWhereWithAggregatesInput
      | VendorOrderScalarWhereWithAggregatesInput[];
    OR?: VendorOrderScalarWhereWithAggregatesInput[];
    NOT?:
      | VendorOrderScalarWhereWithAggregatesInput
      | VendorOrderScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'VendorOrder'> | string;
    orderId?: StringWithAggregatesFilter<'VendorOrder'> | string;
    vendorId?: StringWithAggregatesFilter<'VendorOrder'> | string;
    status?:
      | EnumOrderStatusWithAggregatesFilter<'VendorOrder'>
      | $Enums.OrderStatus;
    subtotal?: FloatWithAggregatesFilter<'VendorOrder'> | number;
    shipping?: FloatWithAggregatesFilter<'VendorOrder'> | number;
    total?: FloatWithAggregatesFilter<'VendorOrder'> | number;
    trackingNumber?:
      | StringNullableWithAggregatesFilter<'VendorOrder'>
      | string
      | null;
    estimatedDelivery?:
      | DateTimeNullableWithAggregatesFilter<'VendorOrder'>
      | Date
      | string
      | null;
    notes?: StringNullableWithAggregatesFilter<'VendorOrder'> | string | null;
    createdAt?: DateTimeWithAggregatesFilter<'VendorOrder'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'VendorOrder'> | Date | string;
  };

  export type OrderItemWhereInput = {
    AND?: OrderItemWhereInput | OrderItemWhereInput[];
    OR?: OrderItemWhereInput[];
    NOT?: OrderItemWhereInput | OrderItemWhereInput[];
    id?: StringFilter<'OrderItem'> | string;
    orderId?: StringNullableFilter<'OrderItem'> | string | null;
    vendorOrderId?: StringNullableFilter<'OrderItem'> | string | null;
    productId?: StringFilter<'OrderItem'> | string;
    quantity?: IntFilter<'OrderItem'> | number;
    price?: FloatFilter<'OrderItem'> | number;
    createdAt?: DateTimeFilter<'OrderItem'> | Date | string;
    order?: XOR<OrderNullableRelationFilter, OrderWhereInput> | null;
    vendorOrder?: XOR<
      VendorOrderNullableRelationFilter,
      VendorOrderWhereInput
    > | null;
    product?: XOR<ProductRelationFilter, ProductWhereInput>;
  };

  export type OrderItemOrderByWithRelationInput = {
    id?: SortOrder;
    orderId?: SortOrderInput | SortOrder;
    vendorOrderId?: SortOrderInput | SortOrder;
    productId?: SortOrder;
    quantity?: SortOrder;
    price?: SortOrder;
    createdAt?: SortOrder;
    order?: OrderOrderByWithRelationInput;
    vendorOrder?: VendorOrderOrderByWithRelationInput;
    product?: ProductOrderByWithRelationInput;
  };

  export type OrderItemWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: OrderItemWhereInput | OrderItemWhereInput[];
      OR?: OrderItemWhereInput[];
      NOT?: OrderItemWhereInput | OrderItemWhereInput[];
      orderId?: StringNullableFilter<'OrderItem'> | string | null;
      vendorOrderId?: StringNullableFilter<'OrderItem'> | string | null;
      productId?: StringFilter<'OrderItem'> | string;
      quantity?: IntFilter<'OrderItem'> | number;
      price?: FloatFilter<'OrderItem'> | number;
      createdAt?: DateTimeFilter<'OrderItem'> | Date | string;
      order?: XOR<OrderNullableRelationFilter, OrderWhereInput> | null;
      vendorOrder?: XOR<
        VendorOrderNullableRelationFilter,
        VendorOrderWhereInput
      > | null;
      product?: XOR<ProductRelationFilter, ProductWhereInput>;
    },
    'id'
  >;

  export type OrderItemOrderByWithAggregationInput = {
    id?: SortOrder;
    orderId?: SortOrderInput | SortOrder;
    vendorOrderId?: SortOrderInput | SortOrder;
    productId?: SortOrder;
    quantity?: SortOrder;
    price?: SortOrder;
    createdAt?: SortOrder;
    _count?: OrderItemCountOrderByAggregateInput;
    _avg?: OrderItemAvgOrderByAggregateInput;
    _max?: OrderItemMaxOrderByAggregateInput;
    _min?: OrderItemMinOrderByAggregateInput;
    _sum?: OrderItemSumOrderByAggregateInput;
  };

  export type OrderItemScalarWhereWithAggregatesInput = {
    AND?:
      | OrderItemScalarWhereWithAggregatesInput
      | OrderItemScalarWhereWithAggregatesInput[];
    OR?: OrderItemScalarWhereWithAggregatesInput[];
    NOT?:
      | OrderItemScalarWhereWithAggregatesInput
      | OrderItemScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'OrderItem'> | string;
    orderId?: StringNullableWithAggregatesFilter<'OrderItem'> | string | null;
    vendorOrderId?:
      | StringNullableWithAggregatesFilter<'OrderItem'>
      | string
      | null;
    productId?: StringWithAggregatesFilter<'OrderItem'> | string;
    quantity?: IntWithAggregatesFilter<'OrderItem'> | number;
    price?: FloatWithAggregatesFilter<'OrderItem'> | number;
    createdAt?: DateTimeWithAggregatesFilter<'OrderItem'> | Date | string;
  };

  export type ProductReviewWhereInput = {
    AND?: ProductReviewWhereInput | ProductReviewWhereInput[];
    OR?: ProductReviewWhereInput[];
    NOT?: ProductReviewWhereInput | ProductReviewWhereInput[];
    id?: StringFilter<'ProductReview'> | string;
    productId?: StringFilter<'ProductReview'> | string;
    customerId?: StringFilter<'ProductReview'> | string;
    rating?: IntFilter<'ProductReview'> | number;
    title?: StringNullableFilter<'ProductReview'> | string | null;
    review?: StringNullableFilter<'ProductReview'> | string | null;
    isVerified?: BoolFilter<'ProductReview'> | boolean;
    isActive?: BoolFilter<'ProductReview'> | boolean;
    createdAt?: DateTimeFilter<'ProductReview'> | Date | string;
    updatedAt?: DateTimeFilter<'ProductReview'> | Date | string;
    product?: XOR<ProductRelationFilter, ProductWhereInput>;
  };

  export type ProductReviewOrderByWithRelationInput = {
    id?: SortOrder;
    productId?: SortOrder;
    customerId?: SortOrder;
    rating?: SortOrder;
    title?: SortOrderInput | SortOrder;
    review?: SortOrderInput | SortOrder;
    isVerified?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    product?: ProductOrderByWithRelationInput;
  };

  export type ProductReviewWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      productId_customerId?: ProductReviewProductIdCustomerIdCompoundUniqueInput;
      AND?: ProductReviewWhereInput | ProductReviewWhereInput[];
      OR?: ProductReviewWhereInput[];
      NOT?: ProductReviewWhereInput | ProductReviewWhereInput[];
      productId?: StringFilter<'ProductReview'> | string;
      customerId?: StringFilter<'ProductReview'> | string;
      rating?: IntFilter<'ProductReview'> | number;
      title?: StringNullableFilter<'ProductReview'> | string | null;
      review?: StringNullableFilter<'ProductReview'> | string | null;
      isVerified?: BoolFilter<'ProductReview'> | boolean;
      isActive?: BoolFilter<'ProductReview'> | boolean;
      createdAt?: DateTimeFilter<'ProductReview'> | Date | string;
      updatedAt?: DateTimeFilter<'ProductReview'> | Date | string;
      product?: XOR<ProductRelationFilter, ProductWhereInput>;
    },
    'id' | 'productId_customerId'
  >;

  export type ProductReviewOrderByWithAggregationInput = {
    id?: SortOrder;
    productId?: SortOrder;
    customerId?: SortOrder;
    rating?: SortOrder;
    title?: SortOrderInput | SortOrder;
    review?: SortOrderInput | SortOrder;
    isVerified?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: ProductReviewCountOrderByAggregateInput;
    _avg?: ProductReviewAvgOrderByAggregateInput;
    _max?: ProductReviewMaxOrderByAggregateInput;
    _min?: ProductReviewMinOrderByAggregateInput;
    _sum?: ProductReviewSumOrderByAggregateInput;
  };

  export type ProductReviewScalarWhereWithAggregatesInput = {
    AND?:
      | ProductReviewScalarWhereWithAggregatesInput
      | ProductReviewScalarWhereWithAggregatesInput[];
    OR?: ProductReviewScalarWhereWithAggregatesInput[];
    NOT?:
      | ProductReviewScalarWhereWithAggregatesInput
      | ProductReviewScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'ProductReview'> | string;
    productId?: StringWithAggregatesFilter<'ProductReview'> | string;
    customerId?: StringWithAggregatesFilter<'ProductReview'> | string;
    rating?: IntWithAggregatesFilter<'ProductReview'> | number;
    title?: StringNullableWithAggregatesFilter<'ProductReview'> | string | null;
    review?:
      | StringNullableWithAggregatesFilter<'ProductReview'>
      | string
      | null;
    isVerified?: BoolWithAggregatesFilter<'ProductReview'> | boolean;
    isActive?: BoolWithAggregatesFilter<'ProductReview'> | boolean;
    createdAt?: DateTimeWithAggregatesFilter<'ProductReview'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'ProductReview'> | Date | string;
  };

  export type WishlistWhereInput = {
    AND?: WishlistWhereInput | WishlistWhereInput[];
    OR?: WishlistWhereInput[];
    NOT?: WishlistWhereInput | WishlistWhereInput[];
    id?: StringFilter<'Wishlist'> | string;
    customerId?: StringFilter<'Wishlist'> | string;
    createdAt?: DateTimeFilter<'Wishlist'> | Date | string;
    updatedAt?: DateTimeFilter<'Wishlist'> | Date | string;
    items?: WishlistItemListRelationFilter;
  };

  export type WishlistOrderByWithRelationInput = {
    id?: SortOrder;
    customerId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    items?: WishlistItemOrderByRelationAggregateInput;
  };

  export type WishlistWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      customerId?: string;
      AND?: WishlistWhereInput | WishlistWhereInput[];
      OR?: WishlistWhereInput[];
      NOT?: WishlistWhereInput | WishlistWhereInput[];
      createdAt?: DateTimeFilter<'Wishlist'> | Date | string;
      updatedAt?: DateTimeFilter<'Wishlist'> | Date | string;
      items?: WishlistItemListRelationFilter;
    },
    'id' | 'customerId'
  >;

  export type WishlistOrderByWithAggregationInput = {
    id?: SortOrder;
    customerId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: WishlistCountOrderByAggregateInput;
    _max?: WishlistMaxOrderByAggregateInput;
    _min?: WishlistMinOrderByAggregateInput;
  };

  export type WishlistScalarWhereWithAggregatesInput = {
    AND?:
      | WishlistScalarWhereWithAggregatesInput
      | WishlistScalarWhereWithAggregatesInput[];
    OR?: WishlistScalarWhereWithAggregatesInput[];
    NOT?:
      | WishlistScalarWhereWithAggregatesInput
      | WishlistScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Wishlist'> | string;
    customerId?: StringWithAggregatesFilter<'Wishlist'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'Wishlist'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Wishlist'> | Date | string;
  };

  export type WishlistItemWhereInput = {
    AND?: WishlistItemWhereInput | WishlistItemWhereInput[];
    OR?: WishlistItemWhereInput[];
    NOT?: WishlistItemWhereInput | WishlistItemWhereInput[];
    id?: StringFilter<'WishlistItem'> | string;
    wishlistId?: StringFilter<'WishlistItem'> | string;
    productId?: StringFilter<'WishlistItem'> | string;
    addedAt?: DateTimeFilter<'WishlistItem'> | Date | string;
    wishlist?: XOR<WishlistRelationFilter, WishlistWhereInput>;
    product?: XOR<ProductRelationFilter, ProductWhereInput>;
  };

  export type WishlistItemOrderByWithRelationInput = {
    id?: SortOrder;
    wishlistId?: SortOrder;
    productId?: SortOrder;
    addedAt?: SortOrder;
    wishlist?: WishlistOrderByWithRelationInput;
    product?: ProductOrderByWithRelationInput;
  };

  export type WishlistItemWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      wishlistId_productId?: WishlistItemWishlistIdProductIdCompoundUniqueInput;
      AND?: WishlistItemWhereInput | WishlistItemWhereInput[];
      OR?: WishlistItemWhereInput[];
      NOT?: WishlistItemWhereInput | WishlistItemWhereInput[];
      wishlistId?: StringFilter<'WishlistItem'> | string;
      productId?: StringFilter<'WishlistItem'> | string;
      addedAt?: DateTimeFilter<'WishlistItem'> | Date | string;
      wishlist?: XOR<WishlistRelationFilter, WishlistWhereInput>;
      product?: XOR<ProductRelationFilter, ProductWhereInput>;
    },
    'id' | 'wishlistId_productId'
  >;

  export type WishlistItemOrderByWithAggregationInput = {
    id?: SortOrder;
    wishlistId?: SortOrder;
    productId?: SortOrder;
    addedAt?: SortOrder;
    _count?: WishlistItemCountOrderByAggregateInput;
    _max?: WishlistItemMaxOrderByAggregateInput;
    _min?: WishlistItemMinOrderByAggregateInput;
  };

  export type WishlistItemScalarWhereWithAggregatesInput = {
    AND?:
      | WishlistItemScalarWhereWithAggregatesInput
      | WishlistItemScalarWhereWithAggregatesInput[];
    OR?: WishlistItemScalarWhereWithAggregatesInput[];
    NOT?:
      | WishlistItemScalarWhereWithAggregatesInput
      | WishlistItemScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'WishlistItem'> | string;
    wishlistId?: StringWithAggregatesFilter<'WishlistItem'> | string;
    productId?: StringWithAggregatesFilter<'WishlistItem'> | string;
    addedAt?: DateTimeWithAggregatesFilter<'WishlistItem'> | Date | string;
  };

  export type VendorAnalyticsWhereInput = {
    AND?: VendorAnalyticsWhereInput | VendorAnalyticsWhereInput[];
    OR?: VendorAnalyticsWhereInput[];
    NOT?: VendorAnalyticsWhereInput | VendorAnalyticsWhereInput[];
    id?: StringFilter<'VendorAnalytics'> | string;
    vendorId?: StringFilter<'VendorAnalytics'> | string;
    period?: StringFilter<'VendorAnalytics'> | string;
    date?: DateTimeFilter<'VendorAnalytics'> | Date | string;
    totalOrders?: IntFilter<'VendorAnalytics'> | number;
    totalRevenue?: FloatFilter<'VendorAnalytics'> | number;
    totalViews?: IntFilter<'VendorAnalytics'> | number;
    conversionRate?: FloatFilter<'VendorAnalytics'> | number;
    createdAt?: DateTimeFilter<'VendorAnalytics'> | Date | string;
    vendor?: XOR<VendorRelationFilter, VendorWhereInput>;
  };

  export type VendorAnalyticsOrderByWithRelationInput = {
    id?: SortOrder;
    vendorId?: SortOrder;
    period?: SortOrder;
    date?: SortOrder;
    totalOrders?: SortOrder;
    totalRevenue?: SortOrder;
    totalViews?: SortOrder;
    conversionRate?: SortOrder;
    createdAt?: SortOrder;
    vendor?: VendorOrderByWithRelationInput;
  };

  export type VendorAnalyticsWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      vendorId_period_date?: VendorAnalyticsVendorIdPeriodDateCompoundUniqueInput;
      AND?: VendorAnalyticsWhereInput | VendorAnalyticsWhereInput[];
      OR?: VendorAnalyticsWhereInput[];
      NOT?: VendorAnalyticsWhereInput | VendorAnalyticsWhereInput[];
      vendorId?: StringFilter<'VendorAnalytics'> | string;
      period?: StringFilter<'VendorAnalytics'> | string;
      date?: DateTimeFilter<'VendorAnalytics'> | Date | string;
      totalOrders?: IntFilter<'VendorAnalytics'> | number;
      totalRevenue?: FloatFilter<'VendorAnalytics'> | number;
      totalViews?: IntFilter<'VendorAnalytics'> | number;
      conversionRate?: FloatFilter<'VendorAnalytics'> | number;
      createdAt?: DateTimeFilter<'VendorAnalytics'> | Date | string;
      vendor?: XOR<VendorRelationFilter, VendorWhereInput>;
    },
    'id' | 'vendorId_period_date'
  >;

  export type VendorAnalyticsOrderByWithAggregationInput = {
    id?: SortOrder;
    vendorId?: SortOrder;
    period?: SortOrder;
    date?: SortOrder;
    totalOrders?: SortOrder;
    totalRevenue?: SortOrder;
    totalViews?: SortOrder;
    conversionRate?: SortOrder;
    createdAt?: SortOrder;
    _count?: VendorAnalyticsCountOrderByAggregateInput;
    _avg?: VendorAnalyticsAvgOrderByAggregateInput;
    _max?: VendorAnalyticsMaxOrderByAggregateInput;
    _min?: VendorAnalyticsMinOrderByAggregateInput;
    _sum?: VendorAnalyticsSumOrderByAggregateInput;
  };

  export type VendorAnalyticsScalarWhereWithAggregatesInput = {
    AND?:
      | VendorAnalyticsScalarWhereWithAggregatesInput
      | VendorAnalyticsScalarWhereWithAggregatesInput[];
    OR?: VendorAnalyticsScalarWhereWithAggregatesInput[];
    NOT?:
      | VendorAnalyticsScalarWhereWithAggregatesInput
      | VendorAnalyticsScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'VendorAnalytics'> | string;
    vendorId?: StringWithAggregatesFilter<'VendorAnalytics'> | string;
    period?: StringWithAggregatesFilter<'VendorAnalytics'> | string;
    date?: DateTimeWithAggregatesFilter<'VendorAnalytics'> | Date | string;
    totalOrders?: IntWithAggregatesFilter<'VendorAnalytics'> | number;
    totalRevenue?: FloatWithAggregatesFilter<'VendorAnalytics'> | number;
    totalViews?: IntWithAggregatesFilter<'VendorAnalytics'> | number;
    conversionRate?: FloatWithAggregatesFilter<'VendorAnalytics'> | number;
    createdAt?: DateTimeWithAggregatesFilter<'VendorAnalytics'> | Date | string;
  };

  export type VendorCreateInput = {
    id?: string;
    name: string;
    email: string;
    phone?: string | null;
    address?: NullableJsonNullValueInput | InputJsonValue;
    description?: string | null;
    isActive?: boolean;
    isVerified?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    products?: ProductCreateNestedManyWithoutVendorInput;
    analytics?: VendorAnalyticsCreateNestedManyWithoutVendorInput;
  };

  export type VendorUncheckedCreateInput = {
    id?: string;
    name: string;
    email: string;
    phone?: string | null;
    address?: NullableJsonNullValueInput | InputJsonValue;
    description?: string | null;
    isActive?: boolean;
    isVerified?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    products?: ProductUncheckedCreateNestedManyWithoutVendorInput;
    analytics?: VendorAnalyticsUncheckedCreateNestedManyWithoutVendorInput;
  };

  export type VendorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    phone?: NullableStringFieldUpdateOperationsInput | string | null;
    address?: NullableJsonNullValueInput | InputJsonValue;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isVerified?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    products?: ProductUpdateManyWithoutVendorNestedInput;
    analytics?: VendorAnalyticsUpdateManyWithoutVendorNestedInput;
  };

  export type VendorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    phone?: NullableStringFieldUpdateOperationsInput | string | null;
    address?: NullableJsonNullValueInput | InputJsonValue;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isVerified?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    products?: ProductUncheckedUpdateManyWithoutVendorNestedInput;
    analytics?: VendorAnalyticsUncheckedUpdateManyWithoutVendorNestedInput;
  };

  export type VendorCreateManyInput = {
    id?: string;
    name: string;
    email: string;
    phone?: string | null;
    address?: NullableJsonNullValueInput | InputJsonValue;
    description?: string | null;
    isActive?: boolean;
    isVerified?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type VendorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    phone?: NullableStringFieldUpdateOperationsInput | string | null;
    address?: NullableJsonNullValueInput | InputJsonValue;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isVerified?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type VendorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    phone?: NullableStringFieldUpdateOperationsInput | string | null;
    address?: NullableJsonNullValueInput | InputJsonValue;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isVerified?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProductCreateInput = {
    id?: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    sku?: string | null;
    category: string;
    subcategory?: string | null;
    brand?: string | null;
    images?: ProductCreateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    isActive?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor: VendorCreateNestedOneWithoutProductsInput;
    inventory?: ProductInventoryCreateNestedOneWithoutProductInput;
    reservations?: InventoryReservationCreateNestedManyWithoutProductInput;
    orderItems?: OrderItemCreateNestedManyWithoutProductInput;
    reviews?: ProductReviewCreateNestedManyWithoutProductInput;
    cartItems?: CartItemCreateNestedManyWithoutProductInput;
    wishlistItems?: WishlistItemCreateNestedManyWithoutProductInput;
  };

  export type ProductUncheckedCreateInput = {
    id?: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    sku?: string | null;
    category: string;
    subcategory?: string | null;
    brand?: string | null;
    images?: ProductCreateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    vendorId: string;
    isActive?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inventory?: ProductInventoryUncheckedCreateNestedOneWithoutProductInput;
    reservations?: InventoryReservationUncheckedCreateNestedManyWithoutProductInput;
    orderItems?: OrderItemUncheckedCreateNestedManyWithoutProductInput;
    reviews?: ProductReviewUncheckedCreateNestedManyWithoutProductInput;
    cartItems?: CartItemUncheckedCreateNestedManyWithoutProductInput;
    wishlistItems?: WishlistItemUncheckedCreateNestedManyWithoutProductInput;
  };

  export type ProductUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    comparePrice?: NullableFloatFieldUpdateOperationsInput | number | null;
    sku?: NullableStringFieldUpdateOperationsInput | string | null;
    category?: StringFieldUpdateOperationsInput | string;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    brand?: NullableStringFieldUpdateOperationsInput | string | null;
    images?: ProductUpdateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: VendorUpdateOneRequiredWithoutProductsNestedInput;
    inventory?: ProductInventoryUpdateOneWithoutProductNestedInput;
    reservations?: InventoryReservationUpdateManyWithoutProductNestedInput;
    orderItems?: OrderItemUpdateManyWithoutProductNestedInput;
    reviews?: ProductReviewUpdateManyWithoutProductNestedInput;
    cartItems?: CartItemUpdateManyWithoutProductNestedInput;
    wishlistItems?: WishlistItemUpdateManyWithoutProductNestedInput;
  };

  export type ProductUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    comparePrice?: NullableFloatFieldUpdateOperationsInput | number | null;
    sku?: NullableStringFieldUpdateOperationsInput | string | null;
    category?: StringFieldUpdateOperationsInput | string;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    brand?: NullableStringFieldUpdateOperationsInput | string | null;
    images?: ProductUpdateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    vendorId?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    inventory?: ProductInventoryUncheckedUpdateOneWithoutProductNestedInput;
    reservations?: InventoryReservationUncheckedUpdateManyWithoutProductNestedInput;
    orderItems?: OrderItemUncheckedUpdateManyWithoutProductNestedInput;
    reviews?: ProductReviewUncheckedUpdateManyWithoutProductNestedInput;
    cartItems?: CartItemUncheckedUpdateManyWithoutProductNestedInput;
    wishlistItems?: WishlistItemUncheckedUpdateManyWithoutProductNestedInput;
  };

  export type ProductCreateManyInput = {
    id?: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    sku?: string | null;
    category: string;
    subcategory?: string | null;
    brand?: string | null;
    images?: ProductCreateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    vendorId: string;
    isActive?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ProductUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    comparePrice?: NullableFloatFieldUpdateOperationsInput | number | null;
    sku?: NullableStringFieldUpdateOperationsInput | string | null;
    category?: StringFieldUpdateOperationsInput | string;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    brand?: NullableStringFieldUpdateOperationsInput | string | null;
    images?: ProductUpdateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProductUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    comparePrice?: NullableFloatFieldUpdateOperationsInput | number | null;
    sku?: NullableStringFieldUpdateOperationsInput | string | null;
    category?: StringFieldUpdateOperationsInput | string;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    brand?: NullableStringFieldUpdateOperationsInput | string | null;
    images?: ProductUpdateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    vendorId?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProductInventoryCreateInput = {
    id?: string;
    quantity?: number;
    reservedQuantity?: number;
    lowStockThreshold?: number;
    trackQuantity?: boolean;
    updatedAt?: Date | string;
    product: ProductCreateNestedOneWithoutInventoryInput;
  };

  export type ProductInventoryUncheckedCreateInput = {
    id?: string;
    productId: string;
    quantity?: number;
    reservedQuantity?: number;
    lowStockThreshold?: number;
    trackQuantity?: boolean;
    updatedAt?: Date | string;
  };

  export type ProductInventoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    reservedQuantity?: IntFieldUpdateOperationsInput | number;
    lowStockThreshold?: IntFieldUpdateOperationsInput | number;
    trackQuantity?: BoolFieldUpdateOperationsInput | boolean;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    product?: ProductUpdateOneRequiredWithoutInventoryNestedInput;
  };

  export type ProductInventoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productId?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    reservedQuantity?: IntFieldUpdateOperationsInput | number;
    lowStockThreshold?: IntFieldUpdateOperationsInput | number;
    trackQuantity?: BoolFieldUpdateOperationsInput | boolean;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProductInventoryCreateManyInput = {
    id?: string;
    productId: string;
    quantity?: number;
    reservedQuantity?: number;
    lowStockThreshold?: number;
    trackQuantity?: boolean;
    updatedAt?: Date | string;
  };

  export type ProductInventoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    reservedQuantity?: IntFieldUpdateOperationsInput | number;
    lowStockThreshold?: IntFieldUpdateOperationsInput | number;
    trackQuantity?: BoolFieldUpdateOperationsInput | boolean;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProductInventoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productId?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    reservedQuantity?: IntFieldUpdateOperationsInput | number;
    lowStockThreshold?: IntFieldUpdateOperationsInput | number;
    trackQuantity?: BoolFieldUpdateOperationsInput | boolean;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type InventoryReservationCreateInput = {
    id?: string;
    quantity: number;
    customerId: string;
    orderId?: string | null;
    sessionId?: string | null;
    expiresAt: Date | string;
    createdAt?: Date | string;
    product: ProductCreateNestedOneWithoutReservationsInput;
  };

  export type InventoryReservationUncheckedCreateInput = {
    id?: string;
    productId: string;
    quantity: number;
    customerId: string;
    orderId?: string | null;
    sessionId?: string | null;
    expiresAt: Date | string;
    createdAt?: Date | string;
  };

  export type InventoryReservationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    customerId?: StringFieldUpdateOperationsInput | string;
    orderId?: NullableStringFieldUpdateOperationsInput | string | null;
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    product?: ProductUpdateOneRequiredWithoutReservationsNestedInput;
  };

  export type InventoryReservationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productId?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    customerId?: StringFieldUpdateOperationsInput | string;
    orderId?: NullableStringFieldUpdateOperationsInput | string | null;
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type InventoryReservationCreateManyInput = {
    id?: string;
    productId: string;
    quantity: number;
    customerId: string;
    orderId?: string | null;
    sessionId?: string | null;
    expiresAt: Date | string;
    createdAt?: Date | string;
  };

  export type InventoryReservationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    customerId?: StringFieldUpdateOperationsInput | string;
    orderId?: NullableStringFieldUpdateOperationsInput | string | null;
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type InventoryReservationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productId?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    customerId?: StringFieldUpdateOperationsInput | string;
    orderId?: NullableStringFieldUpdateOperationsInput | string | null;
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CategoryCreateInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    parent?: CategoryCreateNestedOneWithoutChildrenInput;
    children?: CategoryCreateNestedManyWithoutParentInput;
  };

  export type CategoryUncheckedCreateInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    parentId?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    children?: CategoryUncheckedCreateNestedManyWithoutParentInput;
  };

  export type CategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    parent?: CategoryUpdateOneWithoutChildrenNestedInput;
    children?: CategoryUpdateManyWithoutParentNestedInput;
  };

  export type CategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    parentId?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    children?: CategoryUncheckedUpdateManyWithoutParentNestedInput;
  };

  export type CategoryCreateManyInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    parentId?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type CategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    parentId?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ShoppingCartCreateInput = {
    id?: string;
    customerId: string;
    updatedAt?: Date | string;
    items?: CartItemCreateNestedManyWithoutCartInput;
  };

  export type ShoppingCartUncheckedCreateInput = {
    id?: string;
    customerId: string;
    updatedAt?: Date | string;
    items?: CartItemUncheckedCreateNestedManyWithoutCartInput;
  };

  export type ShoppingCartUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    items?: CartItemUpdateManyWithoutCartNestedInput;
  };

  export type ShoppingCartUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    items?: CartItemUncheckedUpdateManyWithoutCartNestedInput;
  };

  export type ShoppingCartCreateManyInput = {
    id?: string;
    customerId: string;
    updatedAt?: Date | string;
  };

  export type ShoppingCartUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ShoppingCartUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CartItemCreateInput = {
    id?: string;
    quantity: number;
    price: number;
    addedAt?: Date | string;
    cart: ShoppingCartCreateNestedOneWithoutItemsInput;
    product: ProductCreateNestedOneWithoutCartItemsInput;
  };

  export type CartItemUncheckedCreateInput = {
    id?: string;
    cartId: string;
    productId: string;
    quantity: number;
    price: number;
    addedAt?: Date | string;
  };

  export type CartItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    cart?: ShoppingCartUpdateOneRequiredWithoutItemsNestedInput;
    product?: ProductUpdateOneRequiredWithoutCartItemsNestedInput;
  };

  export type CartItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    cartId?: StringFieldUpdateOperationsInput | string;
    productId?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CartItemCreateManyInput = {
    id?: string;
    cartId: string;
    productId: string;
    quantity: number;
    price: number;
    addedAt?: Date | string;
  };

  export type CartItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CartItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    cartId?: StringFieldUpdateOperationsInput | string;
    productId?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type OrderCreateInput = {
    id?: string;
    customerId: string;
    status?: $Enums.OrderStatus;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shippingAddress: JsonNullValueInput | InputJsonValue;
    paymentMethod: string;
    paymentStatus?: $Enums.PaymentStatus;
    paymentIntentId?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: OrderItemCreateNestedManyWithoutOrderInput;
    vendorOrders?: VendorOrderCreateNestedManyWithoutOrderInput;
  };

  export type OrderUncheckedCreateInput = {
    id?: string;
    customerId: string;
    status?: $Enums.OrderStatus;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shippingAddress: JsonNullValueInput | InputJsonValue;
    paymentMethod: string;
    paymentStatus?: $Enums.PaymentStatus;
    paymentIntentId?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: OrderItemUncheckedCreateNestedManyWithoutOrderInput;
    vendorOrders?: VendorOrderUncheckedCreateNestedManyWithoutOrderInput;
  };

  export type OrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotal?: FloatFieldUpdateOperationsInput | number;
    tax?: FloatFieldUpdateOperationsInput | number;
    shipping?: FloatFieldUpdateOperationsInput | number;
    total?: FloatFieldUpdateOperationsInput | number;
    shippingAddress?: JsonNullValueInput | InputJsonValue;
    paymentMethod?: StringFieldUpdateOperationsInput | string;
    paymentStatus?:
      | EnumPaymentStatusFieldUpdateOperationsInput
      | $Enums.PaymentStatus;
    paymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    items?: OrderItemUpdateManyWithoutOrderNestedInput;
    vendorOrders?: VendorOrderUpdateManyWithoutOrderNestedInput;
  };

  export type OrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotal?: FloatFieldUpdateOperationsInput | number;
    tax?: FloatFieldUpdateOperationsInput | number;
    shipping?: FloatFieldUpdateOperationsInput | number;
    total?: FloatFieldUpdateOperationsInput | number;
    shippingAddress?: JsonNullValueInput | InputJsonValue;
    paymentMethod?: StringFieldUpdateOperationsInput | string;
    paymentStatus?:
      | EnumPaymentStatusFieldUpdateOperationsInput
      | $Enums.PaymentStatus;
    paymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    items?: OrderItemUncheckedUpdateManyWithoutOrderNestedInput;
    vendorOrders?: VendorOrderUncheckedUpdateManyWithoutOrderNestedInput;
  };

  export type OrderCreateManyInput = {
    id?: string;
    customerId: string;
    status?: $Enums.OrderStatus;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shippingAddress: JsonNullValueInput | InputJsonValue;
    paymentMethod: string;
    paymentStatus?: $Enums.PaymentStatus;
    paymentIntentId?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type OrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotal?: FloatFieldUpdateOperationsInput | number;
    tax?: FloatFieldUpdateOperationsInput | number;
    shipping?: FloatFieldUpdateOperationsInput | number;
    total?: FloatFieldUpdateOperationsInput | number;
    shippingAddress?: JsonNullValueInput | InputJsonValue;
    paymentMethod?: StringFieldUpdateOperationsInput | string;
    paymentStatus?:
      | EnumPaymentStatusFieldUpdateOperationsInput
      | $Enums.PaymentStatus;
    paymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type OrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotal?: FloatFieldUpdateOperationsInput | number;
    tax?: FloatFieldUpdateOperationsInput | number;
    shipping?: FloatFieldUpdateOperationsInput | number;
    total?: FloatFieldUpdateOperationsInput | number;
    shippingAddress?: JsonNullValueInput | InputJsonValue;
    paymentMethod?: StringFieldUpdateOperationsInput | string;
    paymentStatus?:
      | EnumPaymentStatusFieldUpdateOperationsInput
      | $Enums.PaymentStatus;
    paymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type VendorOrderCreateInput = {
    id?: string;
    vendorId: string;
    status?: $Enums.OrderStatus;
    subtotal: number;
    shipping: number;
    total: number;
    trackingNumber?: string | null;
    estimatedDelivery?: Date | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    order: OrderCreateNestedOneWithoutVendorOrdersInput;
    items?: OrderItemCreateNestedManyWithoutVendorOrderInput;
  };

  export type VendorOrderUncheckedCreateInput = {
    id?: string;
    orderId: string;
    vendorId: string;
    status?: $Enums.OrderStatus;
    subtotal: number;
    shipping: number;
    total: number;
    trackingNumber?: string | null;
    estimatedDelivery?: Date | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: OrderItemUncheckedCreateNestedManyWithoutVendorOrderInput;
  };

  export type VendorOrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    vendorId?: StringFieldUpdateOperationsInput | string;
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotal?: FloatFieldUpdateOperationsInput | number;
    shipping?: FloatFieldUpdateOperationsInput | number;
    total?: FloatFieldUpdateOperationsInput | number;
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    estimatedDelivery?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    order?: OrderUpdateOneRequiredWithoutVendorOrdersNestedInput;
    items?: OrderItemUpdateManyWithoutVendorOrderNestedInput;
  };

  export type VendorOrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    orderId?: StringFieldUpdateOperationsInput | string;
    vendorId?: StringFieldUpdateOperationsInput | string;
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotal?: FloatFieldUpdateOperationsInput | number;
    shipping?: FloatFieldUpdateOperationsInput | number;
    total?: FloatFieldUpdateOperationsInput | number;
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    estimatedDelivery?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    items?: OrderItemUncheckedUpdateManyWithoutVendorOrderNestedInput;
  };

  export type VendorOrderCreateManyInput = {
    id?: string;
    orderId: string;
    vendorId: string;
    status?: $Enums.OrderStatus;
    subtotal: number;
    shipping: number;
    total: number;
    trackingNumber?: string | null;
    estimatedDelivery?: Date | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type VendorOrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    vendorId?: StringFieldUpdateOperationsInput | string;
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotal?: FloatFieldUpdateOperationsInput | number;
    shipping?: FloatFieldUpdateOperationsInput | number;
    total?: FloatFieldUpdateOperationsInput | number;
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    estimatedDelivery?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type VendorOrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    orderId?: StringFieldUpdateOperationsInput | string;
    vendorId?: StringFieldUpdateOperationsInput | string;
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotal?: FloatFieldUpdateOperationsInput | number;
    shipping?: FloatFieldUpdateOperationsInput | number;
    total?: FloatFieldUpdateOperationsInput | number;
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    estimatedDelivery?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type OrderItemCreateInput = {
    id?: string;
    quantity: number;
    price: number;
    createdAt?: Date | string;
    order?: OrderCreateNestedOneWithoutItemsInput;
    vendorOrder?: VendorOrderCreateNestedOneWithoutItemsInput;
    product: ProductCreateNestedOneWithoutOrderItemsInput;
  };

  export type OrderItemUncheckedCreateInput = {
    id?: string;
    orderId?: string | null;
    vendorOrderId?: string | null;
    productId: string;
    quantity: number;
    price: number;
    createdAt?: Date | string;
  };

  export type OrderItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    order?: OrderUpdateOneWithoutItemsNestedInput;
    vendorOrder?: VendorOrderUpdateOneWithoutItemsNestedInput;
    product?: ProductUpdateOneRequiredWithoutOrderItemsNestedInput;
  };

  export type OrderItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    orderId?: NullableStringFieldUpdateOperationsInput | string | null;
    vendorOrderId?: NullableStringFieldUpdateOperationsInput | string | null;
    productId?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type OrderItemCreateManyInput = {
    id?: string;
    orderId?: string | null;
    vendorOrderId?: string | null;
    productId: string;
    quantity: number;
    price: number;
    createdAt?: Date | string;
  };

  export type OrderItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type OrderItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    orderId?: NullableStringFieldUpdateOperationsInput | string | null;
    vendorOrderId?: NullableStringFieldUpdateOperationsInput | string | null;
    productId?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProductReviewCreateInput = {
    id?: string;
    customerId: string;
    rating: number;
    title?: string | null;
    review?: string | null;
    isVerified?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    product: ProductCreateNestedOneWithoutReviewsInput;
  };

  export type ProductReviewUncheckedCreateInput = {
    id?: string;
    productId: string;
    customerId: string;
    rating: number;
    title?: string | null;
    review?: string | null;
    isVerified?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ProductReviewUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    title?: NullableStringFieldUpdateOperationsInput | string | null;
    review?: NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    product?: ProductUpdateOneRequiredWithoutReviewsNestedInput;
  };

  export type ProductReviewUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productId?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    title?: NullableStringFieldUpdateOperationsInput | string | null;
    review?: NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProductReviewCreateManyInput = {
    id?: string;
    productId: string;
    customerId: string;
    rating: number;
    title?: string | null;
    review?: string | null;
    isVerified?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ProductReviewUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    title?: NullableStringFieldUpdateOperationsInput | string | null;
    review?: NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProductReviewUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productId?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    title?: NullableStringFieldUpdateOperationsInput | string | null;
    review?: NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type WishlistCreateInput = {
    id?: string;
    customerId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: WishlistItemCreateNestedManyWithoutWishlistInput;
  };

  export type WishlistUncheckedCreateInput = {
    id?: string;
    customerId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: WishlistItemUncheckedCreateNestedManyWithoutWishlistInput;
  };

  export type WishlistUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    items?: WishlistItemUpdateManyWithoutWishlistNestedInput;
  };

  export type WishlistUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    items?: WishlistItemUncheckedUpdateManyWithoutWishlistNestedInput;
  };

  export type WishlistCreateManyInput = {
    id?: string;
    customerId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type WishlistUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type WishlistUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type WishlistItemCreateInput = {
    id?: string;
    addedAt?: Date | string;
    wishlist: WishlistCreateNestedOneWithoutItemsInput;
    product: ProductCreateNestedOneWithoutWishlistItemsInput;
  };

  export type WishlistItemUncheckedCreateInput = {
    id?: string;
    wishlistId: string;
    productId: string;
    addedAt?: Date | string;
  };

  export type WishlistItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    wishlist?: WishlistUpdateOneRequiredWithoutItemsNestedInput;
    product?: ProductUpdateOneRequiredWithoutWishlistItemsNestedInput;
  };

  export type WishlistItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    wishlistId?: StringFieldUpdateOperationsInput | string;
    productId?: StringFieldUpdateOperationsInput | string;
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type WishlistItemCreateManyInput = {
    id?: string;
    wishlistId: string;
    productId: string;
    addedAt?: Date | string;
  };

  export type WishlistItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type WishlistItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    wishlistId?: StringFieldUpdateOperationsInput | string;
    productId?: StringFieldUpdateOperationsInput | string;
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type VendorAnalyticsCreateInput = {
    id?: string;
    period: string;
    date: Date | string;
    totalOrders?: number;
    totalRevenue?: number;
    totalViews?: number;
    conversionRate?: number;
    createdAt?: Date | string;
    vendor: VendorCreateNestedOneWithoutAnalyticsInput;
  };

  export type VendorAnalyticsUncheckedCreateInput = {
    id?: string;
    vendorId: string;
    period: string;
    date: Date | string;
    totalOrders?: number;
    totalRevenue?: number;
    totalViews?: number;
    conversionRate?: number;
    createdAt?: Date | string;
  };

  export type VendorAnalyticsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    period?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    totalOrders?: IntFieldUpdateOperationsInput | number;
    totalRevenue?: FloatFieldUpdateOperationsInput | number;
    totalViews?: IntFieldUpdateOperationsInput | number;
    conversionRate?: FloatFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: VendorUpdateOneRequiredWithoutAnalyticsNestedInput;
  };

  export type VendorAnalyticsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    vendorId?: StringFieldUpdateOperationsInput | string;
    period?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    totalOrders?: IntFieldUpdateOperationsInput | number;
    totalRevenue?: FloatFieldUpdateOperationsInput | number;
    totalViews?: IntFieldUpdateOperationsInput | number;
    conversionRate?: FloatFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type VendorAnalyticsCreateManyInput = {
    id?: string;
    vendorId: string;
    period: string;
    date: Date | string;
    totalOrders?: number;
    totalRevenue?: number;
    totalViews?: number;
    conversionRate?: number;
    createdAt?: Date | string;
  };

  export type VendorAnalyticsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    period?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    totalOrders?: IntFieldUpdateOperationsInput | number;
    totalRevenue?: FloatFieldUpdateOperationsInput | number;
    totalViews?: IntFieldUpdateOperationsInput | number;
    conversionRate?: FloatFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type VendorAnalyticsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    vendorId?: StringFieldUpdateOperationsInput | string;
    period?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    totalOrders?: IntFieldUpdateOperationsInput | number;
    totalRevenue?: FloatFieldUpdateOperationsInput | number;
    totalViews?: IntFieldUpdateOperationsInput | number;
    conversionRate?: FloatFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonNullableFilterBase<$PrismaModel>>,
          Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<
        Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>
      >;

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    path?: string[];
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
  };

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null;
  };

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type ProductListRelationFilter = {
    every?: ProductWhereInput;
    some?: ProductWhereInput;
    none?: ProductWhereInput;
  };

  export type VendorAnalyticsListRelationFilter = {
    every?: VendorAnalyticsWhereInput;
    some?: VendorAnalyticsWhereInput;
    none?: VendorAnalyticsWhereInput;
  };

  export type SortOrderInput = {
    sort: SortOrder;
    nulls?: NullsOrder;
  };

  export type ProductOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type VendorAnalyticsOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type VendorCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    email?: SortOrder;
    phone?: SortOrder;
    address?: SortOrder;
    description?: SortOrder;
    isActive?: SortOrder;
    isVerified?: SortOrder;
    rating?: SortOrder;
    reviewCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type VendorAvgOrderByAggregateInput = {
    rating?: SortOrder;
    reviewCount?: SortOrder;
  };

  export type VendorMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    email?: SortOrder;
    phone?: SortOrder;
    description?: SortOrder;
    isActive?: SortOrder;
    isVerified?: SortOrder;
    rating?: SortOrder;
    reviewCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type VendorMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    email?: SortOrder;
    phone?: SortOrder;
    description?: SortOrder;
    isActive?: SortOrder;
    isVerified?: SortOrder;
    rating?: SortOrder;
    reviewCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type VendorSumOrderByAggregateInput = {
    rating?: SortOrder;
    reviewCount?: SortOrder;
  };

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?:
      | NestedStringNullableWithAggregatesFilter<$PrismaModel>
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
          Exclude<
            keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
            'path'
          >
        >,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<
        Omit<
          Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
          'path'
        >
      >;

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    path?: string[];
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedJsonNullableFilter<$PrismaModel>;
    _max?: NestedJsonNullableFilter<$PrismaModel>;
  };

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedFloatNullableFilter<$PrismaModel>;
    _min?: NestedFloatNullableFilter<$PrismaModel>;
    _max?: NestedFloatNullableFilter<$PrismaModel>;
  };

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    has?: string | StringFieldRefInput<$PrismaModel> | null;
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>;
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>;
    isEmpty?: boolean;
  };

  export type VendorRelationFilter = {
    is?: VendorWhereInput;
    isNot?: VendorWhereInput;
  };

  export type ProductInventoryNullableRelationFilter = {
    is?: ProductInventoryWhereInput | null;
    isNot?: ProductInventoryWhereInput | null;
  };

  export type InventoryReservationListRelationFilter = {
    every?: InventoryReservationWhereInput;
    some?: InventoryReservationWhereInput;
    none?: InventoryReservationWhereInput;
  };

  export type OrderItemListRelationFilter = {
    every?: OrderItemWhereInput;
    some?: OrderItemWhereInput;
    none?: OrderItemWhereInput;
  };

  export type ProductReviewListRelationFilter = {
    every?: ProductReviewWhereInput;
    some?: ProductReviewWhereInput;
    none?: ProductReviewWhereInput;
  };

  export type CartItemListRelationFilter = {
    every?: CartItemWhereInput;
    some?: CartItemWhereInput;
    none?: CartItemWhereInput;
  };

  export type WishlistItemListRelationFilter = {
    every?: WishlistItemWhereInput;
    some?: WishlistItemWhereInput;
    none?: WishlistItemWhereInput;
  };

  export type InventoryReservationOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type OrderItemOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type ProductReviewOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type CartItemOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type WishlistItemOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type ProductCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    price?: SortOrder;
    comparePrice?: SortOrder;
    sku?: SortOrder;
    category?: SortOrder;
    subcategory?: SortOrder;
    brand?: SortOrder;
    images?: SortOrder;
    specifications?: SortOrder;
    vendorId?: SortOrder;
    isActive?: SortOrder;
    rating?: SortOrder;
    reviewCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ProductAvgOrderByAggregateInput = {
    price?: SortOrder;
    comparePrice?: SortOrder;
    rating?: SortOrder;
    reviewCount?: SortOrder;
  };

  export type ProductMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    price?: SortOrder;
    comparePrice?: SortOrder;
    sku?: SortOrder;
    category?: SortOrder;
    subcategory?: SortOrder;
    brand?: SortOrder;
    vendorId?: SortOrder;
    isActive?: SortOrder;
    rating?: SortOrder;
    reviewCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ProductMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    price?: SortOrder;
    comparePrice?: SortOrder;
    sku?: SortOrder;
    category?: SortOrder;
    subcategory?: SortOrder;
    brand?: SortOrder;
    vendorId?: SortOrder;
    isActive?: SortOrder;
    rating?: SortOrder;
    reviewCount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ProductSumOrderByAggregateInput = {
    price?: SortOrder;
    comparePrice?: SortOrder;
    rating?: SortOrder;
    reviewCount?: SortOrder;
  };

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedFloatFilter<$PrismaModel>;
    _min?: NestedFloatFilter<$PrismaModel>;
    _max?: NestedFloatFilter<$PrismaModel>;
  };

  export type ProductRelationFilter = {
    is?: ProductWhereInput;
    isNot?: ProductWhereInput;
  };

  export type ProductInventoryCountOrderByAggregateInput = {
    id?: SortOrder;
    productId?: SortOrder;
    quantity?: SortOrder;
    reservedQuantity?: SortOrder;
    lowStockThreshold?: SortOrder;
    trackQuantity?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ProductInventoryAvgOrderByAggregateInput = {
    quantity?: SortOrder;
    reservedQuantity?: SortOrder;
    lowStockThreshold?: SortOrder;
  };

  export type ProductInventoryMaxOrderByAggregateInput = {
    id?: SortOrder;
    productId?: SortOrder;
    quantity?: SortOrder;
    reservedQuantity?: SortOrder;
    lowStockThreshold?: SortOrder;
    trackQuantity?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ProductInventoryMinOrderByAggregateInput = {
    id?: SortOrder;
    productId?: SortOrder;
    quantity?: SortOrder;
    reservedQuantity?: SortOrder;
    lowStockThreshold?: SortOrder;
    trackQuantity?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ProductInventorySumOrderByAggregateInput = {
    quantity?: SortOrder;
    reservedQuantity?: SortOrder;
    lowStockThreshold?: SortOrder;
  };

  export type InventoryReservationCountOrderByAggregateInput = {
    id?: SortOrder;
    productId?: SortOrder;
    quantity?: SortOrder;
    customerId?: SortOrder;
    orderId?: SortOrder;
    sessionId?: SortOrder;
    expiresAt?: SortOrder;
    createdAt?: SortOrder;
  };

  export type InventoryReservationAvgOrderByAggregateInput = {
    quantity?: SortOrder;
  };

  export type InventoryReservationMaxOrderByAggregateInput = {
    id?: SortOrder;
    productId?: SortOrder;
    quantity?: SortOrder;
    customerId?: SortOrder;
    orderId?: SortOrder;
    sessionId?: SortOrder;
    expiresAt?: SortOrder;
    createdAt?: SortOrder;
  };

  export type InventoryReservationMinOrderByAggregateInput = {
    id?: SortOrder;
    productId?: SortOrder;
    quantity?: SortOrder;
    customerId?: SortOrder;
    orderId?: SortOrder;
    sessionId?: SortOrder;
    expiresAt?: SortOrder;
    createdAt?: SortOrder;
  };

  export type InventoryReservationSumOrderByAggregateInput = {
    quantity?: SortOrder;
  };

  export type CategoryNullableRelationFilter = {
    is?: CategoryWhereInput | null;
    isNot?: CategoryWhereInput | null;
  };

  export type CategoryListRelationFilter = {
    every?: CategoryWhereInput;
    some?: CategoryWhereInput;
    none?: CategoryWhereInput;
  };

  export type CategoryOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type CategoryCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    slug?: SortOrder;
    description?: SortOrder;
    parentId?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type CategoryMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    slug?: SortOrder;
    description?: SortOrder;
    parentId?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type CategoryMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    slug?: SortOrder;
    description?: SortOrder;
    parentId?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ShoppingCartCountOrderByAggregateInput = {
    id?: SortOrder;
    customerId?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ShoppingCartMaxOrderByAggregateInput = {
    id?: SortOrder;
    customerId?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ShoppingCartMinOrderByAggregateInput = {
    id?: SortOrder;
    customerId?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ShoppingCartRelationFilter = {
    is?: ShoppingCartWhereInput;
    isNot?: ShoppingCartWhereInput;
  };

  export type CartItemCartIdProductIdCompoundUniqueInput = {
    cartId: string;
    productId: string;
  };

  export type CartItemCountOrderByAggregateInput = {
    id?: SortOrder;
    cartId?: SortOrder;
    productId?: SortOrder;
    quantity?: SortOrder;
    price?: SortOrder;
    addedAt?: SortOrder;
  };

  export type CartItemAvgOrderByAggregateInput = {
    quantity?: SortOrder;
    price?: SortOrder;
  };

  export type CartItemMaxOrderByAggregateInput = {
    id?: SortOrder;
    cartId?: SortOrder;
    productId?: SortOrder;
    quantity?: SortOrder;
    price?: SortOrder;
    addedAt?: SortOrder;
  };

  export type CartItemMinOrderByAggregateInput = {
    id?: SortOrder;
    cartId?: SortOrder;
    productId?: SortOrder;
    quantity?: SortOrder;
    price?: SortOrder;
    addedAt?: SortOrder;
  };

  export type CartItemSumOrderByAggregateInput = {
    quantity?: SortOrder;
    price?: SortOrder;
  };

  export type EnumOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.OrderStatus[]
      | ListEnumOrderStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumOrderStatusFilter<$PrismaModel> | $Enums.OrderStatus;
  };
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonFilterBase<$PrismaModel>>,
          Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>;

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    path?: string[];
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
  };

  export type EnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.PaymentStatus
      | EnumPaymentStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus;
  };

  export type VendorOrderListRelationFilter = {
    every?: VendorOrderWhereInput;
    some?: VendorOrderWhereInput;
    none?: VendorOrderWhereInput;
  };

  export type VendorOrderOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type OrderCountOrderByAggregateInput = {
    id?: SortOrder;
    customerId?: SortOrder;
    status?: SortOrder;
    subtotal?: SortOrder;
    tax?: SortOrder;
    shipping?: SortOrder;
    total?: SortOrder;
    shippingAddress?: SortOrder;
    paymentMethod?: SortOrder;
    paymentStatus?: SortOrder;
    paymentIntentId?: SortOrder;
    notes?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type OrderAvgOrderByAggregateInput = {
    subtotal?: SortOrder;
    tax?: SortOrder;
    shipping?: SortOrder;
    total?: SortOrder;
  };

  export type OrderMaxOrderByAggregateInput = {
    id?: SortOrder;
    customerId?: SortOrder;
    status?: SortOrder;
    subtotal?: SortOrder;
    tax?: SortOrder;
    shipping?: SortOrder;
    total?: SortOrder;
    paymentMethod?: SortOrder;
    paymentStatus?: SortOrder;
    paymentIntentId?: SortOrder;
    notes?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type OrderMinOrderByAggregateInput = {
    id?: SortOrder;
    customerId?: SortOrder;
    status?: SortOrder;
    subtotal?: SortOrder;
    tax?: SortOrder;
    shipping?: SortOrder;
    total?: SortOrder;
    paymentMethod?: SortOrder;
    paymentStatus?: SortOrder;
    paymentIntentId?: SortOrder;
    notes?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type OrderSumOrderByAggregateInput = {
    subtotal?: SortOrder;
    tax?: SortOrder;
    shipping?: SortOrder;
    total?: SortOrder;
  };

  export type EnumOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.OrderStatus[]
      | ListEnumOrderStatusFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel>
      | $Enums.OrderStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumOrderStatusFilter<$PrismaModel>;
    _max?: NestedEnumOrderStatusFilter<$PrismaModel>;
  };
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonWithAggregatesFilterBase<$PrismaModel>>,
          Exclude<
            keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>,
            'path'
          >
        >,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<
        Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>
      >;

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    path?: string[];
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedJsonFilter<$PrismaModel>;
    _max?: NestedJsonFilter<$PrismaModel>;
  };

  export type EnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.PaymentStatus
      | EnumPaymentStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel>
      | $Enums.PaymentStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>;
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>;
  };

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type OrderRelationFilter = {
    is?: OrderWhereInput;
    isNot?: OrderWhereInput;
  };

  export type VendorOrderCountOrderByAggregateInput = {
    id?: SortOrder;
    orderId?: SortOrder;
    vendorId?: SortOrder;
    status?: SortOrder;
    subtotal?: SortOrder;
    shipping?: SortOrder;
    total?: SortOrder;
    trackingNumber?: SortOrder;
    estimatedDelivery?: SortOrder;
    notes?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type VendorOrderAvgOrderByAggregateInput = {
    subtotal?: SortOrder;
    shipping?: SortOrder;
    total?: SortOrder;
  };

  export type VendorOrderMaxOrderByAggregateInput = {
    id?: SortOrder;
    orderId?: SortOrder;
    vendorId?: SortOrder;
    status?: SortOrder;
    subtotal?: SortOrder;
    shipping?: SortOrder;
    total?: SortOrder;
    trackingNumber?: SortOrder;
    estimatedDelivery?: SortOrder;
    notes?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type VendorOrderMinOrderByAggregateInput = {
    id?: SortOrder;
    orderId?: SortOrder;
    vendorId?: SortOrder;
    status?: SortOrder;
    subtotal?: SortOrder;
    shipping?: SortOrder;
    total?: SortOrder;
    trackingNumber?: SortOrder;
    estimatedDelivery?: SortOrder;
    notes?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type VendorOrderSumOrderByAggregateInput = {
    subtotal?: SortOrder;
    shipping?: SortOrder;
    total?: SortOrder;
  };

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?:
      | NestedDateTimeNullableWithAggregatesFilter<$PrismaModel>
      | Date
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: NestedDateTimeNullableFilter<$PrismaModel>;
  };

  export type OrderNullableRelationFilter = {
    is?: OrderWhereInput | null;
    isNot?: OrderWhereInput | null;
  };

  export type VendorOrderNullableRelationFilter = {
    is?: VendorOrderWhereInput | null;
    isNot?: VendorOrderWhereInput | null;
  };

  export type OrderItemCountOrderByAggregateInput = {
    id?: SortOrder;
    orderId?: SortOrder;
    vendorOrderId?: SortOrder;
    productId?: SortOrder;
    quantity?: SortOrder;
    price?: SortOrder;
    createdAt?: SortOrder;
  };

  export type OrderItemAvgOrderByAggregateInput = {
    quantity?: SortOrder;
    price?: SortOrder;
  };

  export type OrderItemMaxOrderByAggregateInput = {
    id?: SortOrder;
    orderId?: SortOrder;
    vendorOrderId?: SortOrder;
    productId?: SortOrder;
    quantity?: SortOrder;
    price?: SortOrder;
    createdAt?: SortOrder;
  };

  export type OrderItemMinOrderByAggregateInput = {
    id?: SortOrder;
    orderId?: SortOrder;
    vendorOrderId?: SortOrder;
    productId?: SortOrder;
    quantity?: SortOrder;
    price?: SortOrder;
    createdAt?: SortOrder;
  };

  export type OrderItemSumOrderByAggregateInput = {
    quantity?: SortOrder;
    price?: SortOrder;
  };

  export type ProductReviewProductIdCustomerIdCompoundUniqueInput = {
    productId: string;
    customerId: string;
  };

  export type ProductReviewCountOrderByAggregateInput = {
    id?: SortOrder;
    productId?: SortOrder;
    customerId?: SortOrder;
    rating?: SortOrder;
    title?: SortOrder;
    review?: SortOrder;
    isVerified?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ProductReviewAvgOrderByAggregateInput = {
    rating?: SortOrder;
  };

  export type ProductReviewMaxOrderByAggregateInput = {
    id?: SortOrder;
    productId?: SortOrder;
    customerId?: SortOrder;
    rating?: SortOrder;
    title?: SortOrder;
    review?: SortOrder;
    isVerified?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ProductReviewMinOrderByAggregateInput = {
    id?: SortOrder;
    productId?: SortOrder;
    customerId?: SortOrder;
    rating?: SortOrder;
    title?: SortOrder;
    review?: SortOrder;
    isVerified?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ProductReviewSumOrderByAggregateInput = {
    rating?: SortOrder;
  };

  export type WishlistCountOrderByAggregateInput = {
    id?: SortOrder;
    customerId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type WishlistMaxOrderByAggregateInput = {
    id?: SortOrder;
    customerId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type WishlistMinOrderByAggregateInput = {
    id?: SortOrder;
    customerId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type WishlistRelationFilter = {
    is?: WishlistWhereInput;
    isNot?: WishlistWhereInput;
  };

  export type WishlistItemWishlistIdProductIdCompoundUniqueInput = {
    wishlistId: string;
    productId: string;
  };

  export type WishlistItemCountOrderByAggregateInput = {
    id?: SortOrder;
    wishlistId?: SortOrder;
    productId?: SortOrder;
    addedAt?: SortOrder;
  };

  export type WishlistItemMaxOrderByAggregateInput = {
    id?: SortOrder;
    wishlistId?: SortOrder;
    productId?: SortOrder;
    addedAt?: SortOrder;
  };

  export type WishlistItemMinOrderByAggregateInput = {
    id?: SortOrder;
    wishlistId?: SortOrder;
    productId?: SortOrder;
    addedAt?: SortOrder;
  };

  export type VendorAnalyticsVendorIdPeriodDateCompoundUniqueInput = {
    vendorId: string;
    period: string;
    date: Date | string;
  };

  export type VendorAnalyticsCountOrderByAggregateInput = {
    id?: SortOrder;
    vendorId?: SortOrder;
    period?: SortOrder;
    date?: SortOrder;
    totalOrders?: SortOrder;
    totalRevenue?: SortOrder;
    totalViews?: SortOrder;
    conversionRate?: SortOrder;
    createdAt?: SortOrder;
  };

  export type VendorAnalyticsAvgOrderByAggregateInput = {
    totalOrders?: SortOrder;
    totalRevenue?: SortOrder;
    totalViews?: SortOrder;
    conversionRate?: SortOrder;
  };

  export type VendorAnalyticsMaxOrderByAggregateInput = {
    id?: SortOrder;
    vendorId?: SortOrder;
    period?: SortOrder;
    date?: SortOrder;
    totalOrders?: SortOrder;
    totalRevenue?: SortOrder;
    totalViews?: SortOrder;
    conversionRate?: SortOrder;
    createdAt?: SortOrder;
  };

  export type VendorAnalyticsMinOrderByAggregateInput = {
    id?: SortOrder;
    vendorId?: SortOrder;
    period?: SortOrder;
    date?: SortOrder;
    totalOrders?: SortOrder;
    totalRevenue?: SortOrder;
    totalViews?: SortOrder;
    conversionRate?: SortOrder;
    createdAt?: SortOrder;
  };

  export type VendorAnalyticsSumOrderByAggregateInput = {
    totalOrders?: SortOrder;
    totalRevenue?: SortOrder;
    totalViews?: SortOrder;
    conversionRate?: SortOrder;
  };

  export type ProductCreateNestedManyWithoutVendorInput = {
    create?:
      | XOR<
          ProductCreateWithoutVendorInput,
          ProductUncheckedCreateWithoutVendorInput
        >
      | ProductCreateWithoutVendorInput[]
      | ProductUncheckedCreateWithoutVendorInput[];
    connectOrCreate?:
      | ProductCreateOrConnectWithoutVendorInput
      | ProductCreateOrConnectWithoutVendorInput[];
    createMany?: ProductCreateManyVendorInputEnvelope;
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[];
  };

  export type VendorAnalyticsCreateNestedManyWithoutVendorInput = {
    create?:
      | XOR<
          VendorAnalyticsCreateWithoutVendorInput,
          VendorAnalyticsUncheckedCreateWithoutVendorInput
        >
      | VendorAnalyticsCreateWithoutVendorInput[]
      | VendorAnalyticsUncheckedCreateWithoutVendorInput[];
    connectOrCreate?:
      | VendorAnalyticsCreateOrConnectWithoutVendorInput
      | VendorAnalyticsCreateOrConnectWithoutVendorInput[];
    createMany?: VendorAnalyticsCreateManyVendorInputEnvelope;
    connect?:
      | VendorAnalyticsWhereUniqueInput
      | VendorAnalyticsWhereUniqueInput[];
  };

  export type ProductUncheckedCreateNestedManyWithoutVendorInput = {
    create?:
      | XOR<
          ProductCreateWithoutVendorInput,
          ProductUncheckedCreateWithoutVendorInput
        >
      | ProductCreateWithoutVendorInput[]
      | ProductUncheckedCreateWithoutVendorInput[];
    connectOrCreate?:
      | ProductCreateOrConnectWithoutVendorInput
      | ProductCreateOrConnectWithoutVendorInput[];
    createMany?: ProductCreateManyVendorInputEnvelope;
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[];
  };

  export type VendorAnalyticsUncheckedCreateNestedManyWithoutVendorInput = {
    create?:
      | XOR<
          VendorAnalyticsCreateWithoutVendorInput,
          VendorAnalyticsUncheckedCreateWithoutVendorInput
        >
      | VendorAnalyticsCreateWithoutVendorInput[]
      | VendorAnalyticsUncheckedCreateWithoutVendorInput[];
    connectOrCreate?:
      | VendorAnalyticsCreateOrConnectWithoutVendorInput
      | VendorAnalyticsCreateOrConnectWithoutVendorInput[];
    createMany?: VendorAnalyticsCreateManyVendorInputEnvelope;
    connect?:
      | VendorAnalyticsWhereUniqueInput
      | VendorAnalyticsWhereUniqueInput[];
  };

  export type StringFieldUpdateOperationsInput = {
    set?: string;
  };

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
  };

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
  };

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
  };

  export type ProductUpdateManyWithoutVendorNestedInput = {
    create?:
      | XOR<
          ProductCreateWithoutVendorInput,
          ProductUncheckedCreateWithoutVendorInput
        >
      | ProductCreateWithoutVendorInput[]
      | ProductUncheckedCreateWithoutVendorInput[];
    connectOrCreate?:
      | ProductCreateOrConnectWithoutVendorInput
      | ProductCreateOrConnectWithoutVendorInput[];
    upsert?:
      | ProductUpsertWithWhereUniqueWithoutVendorInput
      | ProductUpsertWithWhereUniqueWithoutVendorInput[];
    createMany?: ProductCreateManyVendorInputEnvelope;
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[];
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[];
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[];
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[];
    update?:
      | ProductUpdateWithWhereUniqueWithoutVendorInput
      | ProductUpdateWithWhereUniqueWithoutVendorInput[];
    updateMany?:
      | ProductUpdateManyWithWhereWithoutVendorInput
      | ProductUpdateManyWithWhereWithoutVendorInput[];
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[];
  };

  export type VendorAnalyticsUpdateManyWithoutVendorNestedInput = {
    create?:
      | XOR<
          VendorAnalyticsCreateWithoutVendorInput,
          VendorAnalyticsUncheckedCreateWithoutVendorInput
        >
      | VendorAnalyticsCreateWithoutVendorInput[]
      | VendorAnalyticsUncheckedCreateWithoutVendorInput[];
    connectOrCreate?:
      | VendorAnalyticsCreateOrConnectWithoutVendorInput
      | VendorAnalyticsCreateOrConnectWithoutVendorInput[];
    upsert?:
      | VendorAnalyticsUpsertWithWhereUniqueWithoutVendorInput
      | VendorAnalyticsUpsertWithWhereUniqueWithoutVendorInput[];
    createMany?: VendorAnalyticsCreateManyVendorInputEnvelope;
    set?: VendorAnalyticsWhereUniqueInput | VendorAnalyticsWhereUniqueInput[];
    disconnect?:
      | VendorAnalyticsWhereUniqueInput
      | VendorAnalyticsWhereUniqueInput[];
    delete?:
      | VendorAnalyticsWhereUniqueInput
      | VendorAnalyticsWhereUniqueInput[];
    connect?:
      | VendorAnalyticsWhereUniqueInput
      | VendorAnalyticsWhereUniqueInput[];
    update?:
      | VendorAnalyticsUpdateWithWhereUniqueWithoutVendorInput
      | VendorAnalyticsUpdateWithWhereUniqueWithoutVendorInput[];
    updateMany?:
      | VendorAnalyticsUpdateManyWithWhereWithoutVendorInput
      | VendorAnalyticsUpdateManyWithWhereWithoutVendorInput[];
    deleteMany?:
      | VendorAnalyticsScalarWhereInput
      | VendorAnalyticsScalarWhereInput[];
  };

  export type ProductUncheckedUpdateManyWithoutVendorNestedInput = {
    create?:
      | XOR<
          ProductCreateWithoutVendorInput,
          ProductUncheckedCreateWithoutVendorInput
        >
      | ProductCreateWithoutVendorInput[]
      | ProductUncheckedCreateWithoutVendorInput[];
    connectOrCreate?:
      | ProductCreateOrConnectWithoutVendorInput
      | ProductCreateOrConnectWithoutVendorInput[];
    upsert?:
      | ProductUpsertWithWhereUniqueWithoutVendorInput
      | ProductUpsertWithWhereUniqueWithoutVendorInput[];
    createMany?: ProductCreateManyVendorInputEnvelope;
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[];
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[];
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[];
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[];
    update?:
      | ProductUpdateWithWhereUniqueWithoutVendorInput
      | ProductUpdateWithWhereUniqueWithoutVendorInput[];
    updateMany?:
      | ProductUpdateManyWithWhereWithoutVendorInput
      | ProductUpdateManyWithWhereWithoutVendorInput[];
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[];
  };

  export type VendorAnalyticsUncheckedUpdateManyWithoutVendorNestedInput = {
    create?:
      | XOR<
          VendorAnalyticsCreateWithoutVendorInput,
          VendorAnalyticsUncheckedCreateWithoutVendorInput
        >
      | VendorAnalyticsCreateWithoutVendorInput[]
      | VendorAnalyticsUncheckedCreateWithoutVendorInput[];
    connectOrCreate?:
      | VendorAnalyticsCreateOrConnectWithoutVendorInput
      | VendorAnalyticsCreateOrConnectWithoutVendorInput[];
    upsert?:
      | VendorAnalyticsUpsertWithWhereUniqueWithoutVendorInput
      | VendorAnalyticsUpsertWithWhereUniqueWithoutVendorInput[];
    createMany?: VendorAnalyticsCreateManyVendorInputEnvelope;
    set?: VendorAnalyticsWhereUniqueInput | VendorAnalyticsWhereUniqueInput[];
    disconnect?:
      | VendorAnalyticsWhereUniqueInput
      | VendorAnalyticsWhereUniqueInput[];
    delete?:
      | VendorAnalyticsWhereUniqueInput
      | VendorAnalyticsWhereUniqueInput[];
    connect?:
      | VendorAnalyticsWhereUniqueInput
      | VendorAnalyticsWhereUniqueInput[];
    update?:
      | VendorAnalyticsUpdateWithWhereUniqueWithoutVendorInput
      | VendorAnalyticsUpdateWithWhereUniqueWithoutVendorInput[];
    updateMany?:
      | VendorAnalyticsUpdateManyWithWhereWithoutVendorInput
      | VendorAnalyticsUpdateManyWithWhereWithoutVendorInput[];
    deleteMany?:
      | VendorAnalyticsScalarWhereInput
      | VendorAnalyticsScalarWhereInput[];
  };

  export type ProductCreateimagesInput = {
    set: string[];
  };

  export type VendorCreateNestedOneWithoutProductsInput = {
    create?: XOR<
      VendorCreateWithoutProductsInput,
      VendorUncheckedCreateWithoutProductsInput
    >;
    connectOrCreate?: VendorCreateOrConnectWithoutProductsInput;
    connect?: VendorWhereUniqueInput;
  };

  export type ProductInventoryCreateNestedOneWithoutProductInput = {
    create?: XOR<
      ProductInventoryCreateWithoutProductInput,
      ProductInventoryUncheckedCreateWithoutProductInput
    >;
    connectOrCreate?: ProductInventoryCreateOrConnectWithoutProductInput;
    connect?: ProductInventoryWhereUniqueInput;
  };

  export type InventoryReservationCreateNestedManyWithoutProductInput = {
    create?:
      | XOR<
          InventoryReservationCreateWithoutProductInput,
          InventoryReservationUncheckedCreateWithoutProductInput
        >
      | InventoryReservationCreateWithoutProductInput[]
      | InventoryReservationUncheckedCreateWithoutProductInput[];
    connectOrCreate?:
      | InventoryReservationCreateOrConnectWithoutProductInput
      | InventoryReservationCreateOrConnectWithoutProductInput[];
    createMany?: InventoryReservationCreateManyProductInputEnvelope;
    connect?:
      | InventoryReservationWhereUniqueInput
      | InventoryReservationWhereUniqueInput[];
  };

  export type OrderItemCreateNestedManyWithoutProductInput = {
    create?:
      | XOR<
          OrderItemCreateWithoutProductInput,
          OrderItemUncheckedCreateWithoutProductInput
        >
      | OrderItemCreateWithoutProductInput[]
      | OrderItemUncheckedCreateWithoutProductInput[];
    connectOrCreate?:
      | OrderItemCreateOrConnectWithoutProductInput
      | OrderItemCreateOrConnectWithoutProductInput[];
    createMany?: OrderItemCreateManyProductInputEnvelope;
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
  };

  export type ProductReviewCreateNestedManyWithoutProductInput = {
    create?:
      | XOR<
          ProductReviewCreateWithoutProductInput,
          ProductReviewUncheckedCreateWithoutProductInput
        >
      | ProductReviewCreateWithoutProductInput[]
      | ProductReviewUncheckedCreateWithoutProductInput[];
    connectOrCreate?:
      | ProductReviewCreateOrConnectWithoutProductInput
      | ProductReviewCreateOrConnectWithoutProductInput[];
    createMany?: ProductReviewCreateManyProductInputEnvelope;
    connect?: ProductReviewWhereUniqueInput | ProductReviewWhereUniqueInput[];
  };

  export type CartItemCreateNestedManyWithoutProductInput = {
    create?:
      | XOR<
          CartItemCreateWithoutProductInput,
          CartItemUncheckedCreateWithoutProductInput
        >
      | CartItemCreateWithoutProductInput[]
      | CartItemUncheckedCreateWithoutProductInput[];
    connectOrCreate?:
      | CartItemCreateOrConnectWithoutProductInput
      | CartItemCreateOrConnectWithoutProductInput[];
    createMany?: CartItemCreateManyProductInputEnvelope;
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[];
  };

  export type WishlistItemCreateNestedManyWithoutProductInput = {
    create?:
      | XOR<
          WishlistItemCreateWithoutProductInput,
          WishlistItemUncheckedCreateWithoutProductInput
        >
      | WishlistItemCreateWithoutProductInput[]
      | WishlistItemUncheckedCreateWithoutProductInput[];
    connectOrCreate?:
      | WishlistItemCreateOrConnectWithoutProductInput
      | WishlistItemCreateOrConnectWithoutProductInput[];
    createMany?: WishlistItemCreateManyProductInputEnvelope;
    connect?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[];
  };

  export type ProductInventoryUncheckedCreateNestedOneWithoutProductInput = {
    create?: XOR<
      ProductInventoryCreateWithoutProductInput,
      ProductInventoryUncheckedCreateWithoutProductInput
    >;
    connectOrCreate?: ProductInventoryCreateOrConnectWithoutProductInput;
    connect?: ProductInventoryWhereUniqueInput;
  };

  export type InventoryReservationUncheckedCreateNestedManyWithoutProductInput =
    {
      create?:
        | XOR<
            InventoryReservationCreateWithoutProductInput,
            InventoryReservationUncheckedCreateWithoutProductInput
          >
        | InventoryReservationCreateWithoutProductInput[]
        | InventoryReservationUncheckedCreateWithoutProductInput[];
      connectOrCreate?:
        | InventoryReservationCreateOrConnectWithoutProductInput
        | InventoryReservationCreateOrConnectWithoutProductInput[];
      createMany?: InventoryReservationCreateManyProductInputEnvelope;
      connect?:
        | InventoryReservationWhereUniqueInput
        | InventoryReservationWhereUniqueInput[];
    };

  export type OrderItemUncheckedCreateNestedManyWithoutProductInput = {
    create?:
      | XOR<
          OrderItemCreateWithoutProductInput,
          OrderItemUncheckedCreateWithoutProductInput
        >
      | OrderItemCreateWithoutProductInput[]
      | OrderItemUncheckedCreateWithoutProductInput[];
    connectOrCreate?:
      | OrderItemCreateOrConnectWithoutProductInput
      | OrderItemCreateOrConnectWithoutProductInput[];
    createMany?: OrderItemCreateManyProductInputEnvelope;
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
  };

  export type ProductReviewUncheckedCreateNestedManyWithoutProductInput = {
    create?:
      | XOR<
          ProductReviewCreateWithoutProductInput,
          ProductReviewUncheckedCreateWithoutProductInput
        >
      | ProductReviewCreateWithoutProductInput[]
      | ProductReviewUncheckedCreateWithoutProductInput[];
    connectOrCreate?:
      | ProductReviewCreateOrConnectWithoutProductInput
      | ProductReviewCreateOrConnectWithoutProductInput[];
    createMany?: ProductReviewCreateManyProductInputEnvelope;
    connect?: ProductReviewWhereUniqueInput | ProductReviewWhereUniqueInput[];
  };

  export type CartItemUncheckedCreateNestedManyWithoutProductInput = {
    create?:
      | XOR<
          CartItemCreateWithoutProductInput,
          CartItemUncheckedCreateWithoutProductInput
        >
      | CartItemCreateWithoutProductInput[]
      | CartItemUncheckedCreateWithoutProductInput[];
    connectOrCreate?:
      | CartItemCreateOrConnectWithoutProductInput
      | CartItemCreateOrConnectWithoutProductInput[];
    createMany?: CartItemCreateManyProductInputEnvelope;
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[];
  };

  export type WishlistItemUncheckedCreateNestedManyWithoutProductInput = {
    create?:
      | XOR<
          WishlistItemCreateWithoutProductInput,
          WishlistItemUncheckedCreateWithoutProductInput
        >
      | WishlistItemCreateWithoutProductInput[]
      | WishlistItemUncheckedCreateWithoutProductInput[];
    connectOrCreate?:
      | WishlistItemCreateOrConnectWithoutProductInput
      | WishlistItemCreateOrConnectWithoutProductInput[];
    createMany?: WishlistItemCreateManyProductInputEnvelope;
    connect?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[];
  };

  export type FloatFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type ProductUpdateimagesInput = {
    set?: string[];
    push?: string | string[];
  };

  export type VendorUpdateOneRequiredWithoutProductsNestedInput = {
    create?: XOR<
      VendorCreateWithoutProductsInput,
      VendorUncheckedCreateWithoutProductsInput
    >;
    connectOrCreate?: VendorCreateOrConnectWithoutProductsInput;
    upsert?: VendorUpsertWithoutProductsInput;
    connect?: VendorWhereUniqueInput;
    update?: XOR<
      XOR<
        VendorUpdateToOneWithWhereWithoutProductsInput,
        VendorUpdateWithoutProductsInput
      >,
      VendorUncheckedUpdateWithoutProductsInput
    >;
  };

  export type ProductInventoryUpdateOneWithoutProductNestedInput = {
    create?: XOR<
      ProductInventoryCreateWithoutProductInput,
      ProductInventoryUncheckedCreateWithoutProductInput
    >;
    connectOrCreate?: ProductInventoryCreateOrConnectWithoutProductInput;
    upsert?: ProductInventoryUpsertWithoutProductInput;
    disconnect?: ProductInventoryWhereInput | boolean;
    delete?: ProductInventoryWhereInput | boolean;
    connect?: ProductInventoryWhereUniqueInput;
    update?: XOR<
      XOR<
        ProductInventoryUpdateToOneWithWhereWithoutProductInput,
        ProductInventoryUpdateWithoutProductInput
      >,
      ProductInventoryUncheckedUpdateWithoutProductInput
    >;
  };

  export type InventoryReservationUpdateManyWithoutProductNestedInput = {
    create?:
      | XOR<
          InventoryReservationCreateWithoutProductInput,
          InventoryReservationUncheckedCreateWithoutProductInput
        >
      | InventoryReservationCreateWithoutProductInput[]
      | InventoryReservationUncheckedCreateWithoutProductInput[];
    connectOrCreate?:
      | InventoryReservationCreateOrConnectWithoutProductInput
      | InventoryReservationCreateOrConnectWithoutProductInput[];
    upsert?:
      | InventoryReservationUpsertWithWhereUniqueWithoutProductInput
      | InventoryReservationUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: InventoryReservationCreateManyProductInputEnvelope;
    set?:
      | InventoryReservationWhereUniqueInput
      | InventoryReservationWhereUniqueInput[];
    disconnect?:
      | InventoryReservationWhereUniqueInput
      | InventoryReservationWhereUniqueInput[];
    delete?:
      | InventoryReservationWhereUniqueInput
      | InventoryReservationWhereUniqueInput[];
    connect?:
      | InventoryReservationWhereUniqueInput
      | InventoryReservationWhereUniqueInput[];
    update?:
      | InventoryReservationUpdateWithWhereUniqueWithoutProductInput
      | InventoryReservationUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?:
      | InventoryReservationUpdateManyWithWhereWithoutProductInput
      | InventoryReservationUpdateManyWithWhereWithoutProductInput[];
    deleteMany?:
      | InventoryReservationScalarWhereInput
      | InventoryReservationScalarWhereInput[];
  };

  export type OrderItemUpdateManyWithoutProductNestedInput = {
    create?:
      | XOR<
          OrderItemCreateWithoutProductInput,
          OrderItemUncheckedCreateWithoutProductInput
        >
      | OrderItemCreateWithoutProductInput[]
      | OrderItemUncheckedCreateWithoutProductInput[];
    connectOrCreate?:
      | OrderItemCreateOrConnectWithoutProductInput
      | OrderItemCreateOrConnectWithoutProductInput[];
    upsert?:
      | OrderItemUpsertWithWhereUniqueWithoutProductInput
      | OrderItemUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: OrderItemCreateManyProductInputEnvelope;
    set?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    disconnect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    delete?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    update?:
      | OrderItemUpdateWithWhereUniqueWithoutProductInput
      | OrderItemUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?:
      | OrderItemUpdateManyWithWhereWithoutProductInput
      | OrderItemUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[];
  };

  export type ProductReviewUpdateManyWithoutProductNestedInput = {
    create?:
      | XOR<
          ProductReviewCreateWithoutProductInput,
          ProductReviewUncheckedCreateWithoutProductInput
        >
      | ProductReviewCreateWithoutProductInput[]
      | ProductReviewUncheckedCreateWithoutProductInput[];
    connectOrCreate?:
      | ProductReviewCreateOrConnectWithoutProductInput
      | ProductReviewCreateOrConnectWithoutProductInput[];
    upsert?:
      | ProductReviewUpsertWithWhereUniqueWithoutProductInput
      | ProductReviewUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: ProductReviewCreateManyProductInputEnvelope;
    set?: ProductReviewWhereUniqueInput | ProductReviewWhereUniqueInput[];
    disconnect?:
      | ProductReviewWhereUniqueInput
      | ProductReviewWhereUniqueInput[];
    delete?: ProductReviewWhereUniqueInput | ProductReviewWhereUniqueInput[];
    connect?: ProductReviewWhereUniqueInput | ProductReviewWhereUniqueInput[];
    update?:
      | ProductReviewUpdateWithWhereUniqueWithoutProductInput
      | ProductReviewUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?:
      | ProductReviewUpdateManyWithWhereWithoutProductInput
      | ProductReviewUpdateManyWithWhereWithoutProductInput[];
    deleteMany?:
      | ProductReviewScalarWhereInput
      | ProductReviewScalarWhereInput[];
  };

  export type CartItemUpdateManyWithoutProductNestedInput = {
    create?:
      | XOR<
          CartItemCreateWithoutProductInput,
          CartItemUncheckedCreateWithoutProductInput
        >
      | CartItemCreateWithoutProductInput[]
      | CartItemUncheckedCreateWithoutProductInput[];
    connectOrCreate?:
      | CartItemCreateOrConnectWithoutProductInput
      | CartItemCreateOrConnectWithoutProductInput[];
    upsert?:
      | CartItemUpsertWithWhereUniqueWithoutProductInput
      | CartItemUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: CartItemCreateManyProductInputEnvelope;
    set?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[];
    disconnect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[];
    delete?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[];
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[];
    update?:
      | CartItemUpdateWithWhereUniqueWithoutProductInput
      | CartItemUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?:
      | CartItemUpdateManyWithWhereWithoutProductInput
      | CartItemUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: CartItemScalarWhereInput | CartItemScalarWhereInput[];
  };

  export type WishlistItemUpdateManyWithoutProductNestedInput = {
    create?:
      | XOR<
          WishlistItemCreateWithoutProductInput,
          WishlistItemUncheckedCreateWithoutProductInput
        >
      | WishlistItemCreateWithoutProductInput[]
      | WishlistItemUncheckedCreateWithoutProductInput[];
    connectOrCreate?:
      | WishlistItemCreateOrConnectWithoutProductInput
      | WishlistItemCreateOrConnectWithoutProductInput[];
    upsert?:
      | WishlistItemUpsertWithWhereUniqueWithoutProductInput
      | WishlistItemUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: WishlistItemCreateManyProductInputEnvelope;
    set?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[];
    disconnect?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[];
    delete?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[];
    connect?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[];
    update?:
      | WishlistItemUpdateWithWhereUniqueWithoutProductInput
      | WishlistItemUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?:
      | WishlistItemUpdateManyWithWhereWithoutProductInput
      | WishlistItemUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: WishlistItemScalarWhereInput | WishlistItemScalarWhereInput[];
  };

  export type ProductInventoryUncheckedUpdateOneWithoutProductNestedInput = {
    create?: XOR<
      ProductInventoryCreateWithoutProductInput,
      ProductInventoryUncheckedCreateWithoutProductInput
    >;
    connectOrCreate?: ProductInventoryCreateOrConnectWithoutProductInput;
    upsert?: ProductInventoryUpsertWithoutProductInput;
    disconnect?: ProductInventoryWhereInput | boolean;
    delete?: ProductInventoryWhereInput | boolean;
    connect?: ProductInventoryWhereUniqueInput;
    update?: XOR<
      XOR<
        ProductInventoryUpdateToOneWithWhereWithoutProductInput,
        ProductInventoryUpdateWithoutProductInput
      >,
      ProductInventoryUncheckedUpdateWithoutProductInput
    >;
  };

  export type InventoryReservationUncheckedUpdateManyWithoutProductNestedInput =
    {
      create?:
        | XOR<
            InventoryReservationCreateWithoutProductInput,
            InventoryReservationUncheckedCreateWithoutProductInput
          >
        | InventoryReservationCreateWithoutProductInput[]
        | InventoryReservationUncheckedCreateWithoutProductInput[];
      connectOrCreate?:
        | InventoryReservationCreateOrConnectWithoutProductInput
        | InventoryReservationCreateOrConnectWithoutProductInput[];
      upsert?:
        | InventoryReservationUpsertWithWhereUniqueWithoutProductInput
        | InventoryReservationUpsertWithWhereUniqueWithoutProductInput[];
      createMany?: InventoryReservationCreateManyProductInputEnvelope;
      set?:
        | InventoryReservationWhereUniqueInput
        | InventoryReservationWhereUniqueInput[];
      disconnect?:
        | InventoryReservationWhereUniqueInput
        | InventoryReservationWhereUniqueInput[];
      delete?:
        | InventoryReservationWhereUniqueInput
        | InventoryReservationWhereUniqueInput[];
      connect?:
        | InventoryReservationWhereUniqueInput
        | InventoryReservationWhereUniqueInput[];
      update?:
        | InventoryReservationUpdateWithWhereUniqueWithoutProductInput
        | InventoryReservationUpdateWithWhereUniqueWithoutProductInput[];
      updateMany?:
        | InventoryReservationUpdateManyWithWhereWithoutProductInput
        | InventoryReservationUpdateManyWithWhereWithoutProductInput[];
      deleteMany?:
        | InventoryReservationScalarWhereInput
        | InventoryReservationScalarWhereInput[];
    };

  export type OrderItemUncheckedUpdateManyWithoutProductNestedInput = {
    create?:
      | XOR<
          OrderItemCreateWithoutProductInput,
          OrderItemUncheckedCreateWithoutProductInput
        >
      | OrderItemCreateWithoutProductInput[]
      | OrderItemUncheckedCreateWithoutProductInput[];
    connectOrCreate?:
      | OrderItemCreateOrConnectWithoutProductInput
      | OrderItemCreateOrConnectWithoutProductInput[];
    upsert?:
      | OrderItemUpsertWithWhereUniqueWithoutProductInput
      | OrderItemUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: OrderItemCreateManyProductInputEnvelope;
    set?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    disconnect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    delete?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    update?:
      | OrderItemUpdateWithWhereUniqueWithoutProductInput
      | OrderItemUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?:
      | OrderItemUpdateManyWithWhereWithoutProductInput
      | OrderItemUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[];
  };

  export type ProductReviewUncheckedUpdateManyWithoutProductNestedInput = {
    create?:
      | XOR<
          ProductReviewCreateWithoutProductInput,
          ProductReviewUncheckedCreateWithoutProductInput
        >
      | ProductReviewCreateWithoutProductInput[]
      | ProductReviewUncheckedCreateWithoutProductInput[];
    connectOrCreate?:
      | ProductReviewCreateOrConnectWithoutProductInput
      | ProductReviewCreateOrConnectWithoutProductInput[];
    upsert?:
      | ProductReviewUpsertWithWhereUniqueWithoutProductInput
      | ProductReviewUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: ProductReviewCreateManyProductInputEnvelope;
    set?: ProductReviewWhereUniqueInput | ProductReviewWhereUniqueInput[];
    disconnect?:
      | ProductReviewWhereUniqueInput
      | ProductReviewWhereUniqueInput[];
    delete?: ProductReviewWhereUniqueInput | ProductReviewWhereUniqueInput[];
    connect?: ProductReviewWhereUniqueInput | ProductReviewWhereUniqueInput[];
    update?:
      | ProductReviewUpdateWithWhereUniqueWithoutProductInput
      | ProductReviewUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?:
      | ProductReviewUpdateManyWithWhereWithoutProductInput
      | ProductReviewUpdateManyWithWhereWithoutProductInput[];
    deleteMany?:
      | ProductReviewScalarWhereInput
      | ProductReviewScalarWhereInput[];
  };

  export type CartItemUncheckedUpdateManyWithoutProductNestedInput = {
    create?:
      | XOR<
          CartItemCreateWithoutProductInput,
          CartItemUncheckedCreateWithoutProductInput
        >
      | CartItemCreateWithoutProductInput[]
      | CartItemUncheckedCreateWithoutProductInput[];
    connectOrCreate?:
      | CartItemCreateOrConnectWithoutProductInput
      | CartItemCreateOrConnectWithoutProductInput[];
    upsert?:
      | CartItemUpsertWithWhereUniqueWithoutProductInput
      | CartItemUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: CartItemCreateManyProductInputEnvelope;
    set?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[];
    disconnect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[];
    delete?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[];
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[];
    update?:
      | CartItemUpdateWithWhereUniqueWithoutProductInput
      | CartItemUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?:
      | CartItemUpdateManyWithWhereWithoutProductInput
      | CartItemUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: CartItemScalarWhereInput | CartItemScalarWhereInput[];
  };

  export type WishlistItemUncheckedUpdateManyWithoutProductNestedInput = {
    create?:
      | XOR<
          WishlistItemCreateWithoutProductInput,
          WishlistItemUncheckedCreateWithoutProductInput
        >
      | WishlistItemCreateWithoutProductInput[]
      | WishlistItemUncheckedCreateWithoutProductInput[];
    connectOrCreate?:
      | WishlistItemCreateOrConnectWithoutProductInput
      | WishlistItemCreateOrConnectWithoutProductInput[];
    upsert?:
      | WishlistItemUpsertWithWhereUniqueWithoutProductInput
      | WishlistItemUpsertWithWhereUniqueWithoutProductInput[];
    createMany?: WishlistItemCreateManyProductInputEnvelope;
    set?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[];
    disconnect?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[];
    delete?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[];
    connect?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[];
    update?:
      | WishlistItemUpdateWithWhereUniqueWithoutProductInput
      | WishlistItemUpdateWithWhereUniqueWithoutProductInput[];
    updateMany?:
      | WishlistItemUpdateManyWithWhereWithoutProductInput
      | WishlistItemUpdateManyWithWhereWithoutProductInput[];
    deleteMany?: WishlistItemScalarWhereInput | WishlistItemScalarWhereInput[];
  };

  export type ProductCreateNestedOneWithoutInventoryInput = {
    create?: XOR<
      ProductCreateWithoutInventoryInput,
      ProductUncheckedCreateWithoutInventoryInput
    >;
    connectOrCreate?: ProductCreateOrConnectWithoutInventoryInput;
    connect?: ProductWhereUniqueInput;
  };

  export type ProductUpdateOneRequiredWithoutInventoryNestedInput = {
    create?: XOR<
      ProductCreateWithoutInventoryInput,
      ProductUncheckedCreateWithoutInventoryInput
    >;
    connectOrCreate?: ProductCreateOrConnectWithoutInventoryInput;
    upsert?: ProductUpsertWithoutInventoryInput;
    connect?: ProductWhereUniqueInput;
    update?: XOR<
      XOR<
        ProductUpdateToOneWithWhereWithoutInventoryInput,
        ProductUpdateWithoutInventoryInput
      >,
      ProductUncheckedUpdateWithoutInventoryInput
    >;
  };

  export type ProductCreateNestedOneWithoutReservationsInput = {
    create?: XOR<
      ProductCreateWithoutReservationsInput,
      ProductUncheckedCreateWithoutReservationsInput
    >;
    connectOrCreate?: ProductCreateOrConnectWithoutReservationsInput;
    connect?: ProductWhereUniqueInput;
  };

  export type ProductUpdateOneRequiredWithoutReservationsNestedInput = {
    create?: XOR<
      ProductCreateWithoutReservationsInput,
      ProductUncheckedCreateWithoutReservationsInput
    >;
    connectOrCreate?: ProductCreateOrConnectWithoutReservationsInput;
    upsert?: ProductUpsertWithoutReservationsInput;
    connect?: ProductWhereUniqueInput;
    update?: XOR<
      XOR<
        ProductUpdateToOneWithWhereWithoutReservationsInput,
        ProductUpdateWithoutReservationsInput
      >,
      ProductUncheckedUpdateWithoutReservationsInput
    >;
  };

  export type CategoryCreateNestedOneWithoutChildrenInput = {
    create?: XOR<
      CategoryCreateWithoutChildrenInput,
      CategoryUncheckedCreateWithoutChildrenInput
    >;
    connectOrCreate?: CategoryCreateOrConnectWithoutChildrenInput;
    connect?: CategoryWhereUniqueInput;
  };

  export type CategoryCreateNestedManyWithoutParentInput = {
    create?:
      | XOR<
          CategoryCreateWithoutParentInput,
          CategoryUncheckedCreateWithoutParentInput
        >
      | CategoryCreateWithoutParentInput[]
      | CategoryUncheckedCreateWithoutParentInput[];
    connectOrCreate?:
      | CategoryCreateOrConnectWithoutParentInput
      | CategoryCreateOrConnectWithoutParentInput[];
    createMany?: CategoryCreateManyParentInputEnvelope;
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[];
  };

  export type CategoryUncheckedCreateNestedManyWithoutParentInput = {
    create?:
      | XOR<
          CategoryCreateWithoutParentInput,
          CategoryUncheckedCreateWithoutParentInput
        >
      | CategoryCreateWithoutParentInput[]
      | CategoryUncheckedCreateWithoutParentInput[];
    connectOrCreate?:
      | CategoryCreateOrConnectWithoutParentInput
      | CategoryCreateOrConnectWithoutParentInput[];
    createMany?: CategoryCreateManyParentInputEnvelope;
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[];
  };

  export type CategoryUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<
      CategoryCreateWithoutChildrenInput,
      CategoryUncheckedCreateWithoutChildrenInput
    >;
    connectOrCreate?: CategoryCreateOrConnectWithoutChildrenInput;
    upsert?: CategoryUpsertWithoutChildrenInput;
    disconnect?: CategoryWhereInput | boolean;
    delete?: CategoryWhereInput | boolean;
    connect?: CategoryWhereUniqueInput;
    update?: XOR<
      XOR<
        CategoryUpdateToOneWithWhereWithoutChildrenInput,
        CategoryUpdateWithoutChildrenInput
      >,
      CategoryUncheckedUpdateWithoutChildrenInput
    >;
  };

  export type CategoryUpdateManyWithoutParentNestedInput = {
    create?:
      | XOR<
          CategoryCreateWithoutParentInput,
          CategoryUncheckedCreateWithoutParentInput
        >
      | CategoryCreateWithoutParentInput[]
      | CategoryUncheckedCreateWithoutParentInput[];
    connectOrCreate?:
      | CategoryCreateOrConnectWithoutParentInput
      | CategoryCreateOrConnectWithoutParentInput[];
    upsert?:
      | CategoryUpsertWithWhereUniqueWithoutParentInput
      | CategoryUpsertWithWhereUniqueWithoutParentInput[];
    createMany?: CategoryCreateManyParentInputEnvelope;
    set?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[];
    disconnect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[];
    delete?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[];
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[];
    update?:
      | CategoryUpdateWithWhereUniqueWithoutParentInput
      | CategoryUpdateWithWhereUniqueWithoutParentInput[];
    updateMany?:
      | CategoryUpdateManyWithWhereWithoutParentInput
      | CategoryUpdateManyWithWhereWithoutParentInput[];
    deleteMany?: CategoryScalarWhereInput | CategoryScalarWhereInput[];
  };

  export type CategoryUncheckedUpdateManyWithoutParentNestedInput = {
    create?:
      | XOR<
          CategoryCreateWithoutParentInput,
          CategoryUncheckedCreateWithoutParentInput
        >
      | CategoryCreateWithoutParentInput[]
      | CategoryUncheckedCreateWithoutParentInput[];
    connectOrCreate?:
      | CategoryCreateOrConnectWithoutParentInput
      | CategoryCreateOrConnectWithoutParentInput[];
    upsert?:
      | CategoryUpsertWithWhereUniqueWithoutParentInput
      | CategoryUpsertWithWhereUniqueWithoutParentInput[];
    createMany?: CategoryCreateManyParentInputEnvelope;
    set?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[];
    disconnect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[];
    delete?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[];
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[];
    update?:
      | CategoryUpdateWithWhereUniqueWithoutParentInput
      | CategoryUpdateWithWhereUniqueWithoutParentInput[];
    updateMany?:
      | CategoryUpdateManyWithWhereWithoutParentInput
      | CategoryUpdateManyWithWhereWithoutParentInput[];
    deleteMany?: CategoryScalarWhereInput | CategoryScalarWhereInput[];
  };

  export type CartItemCreateNestedManyWithoutCartInput = {
    create?:
      | XOR<
          CartItemCreateWithoutCartInput,
          CartItemUncheckedCreateWithoutCartInput
        >
      | CartItemCreateWithoutCartInput[]
      | CartItemUncheckedCreateWithoutCartInput[];
    connectOrCreate?:
      | CartItemCreateOrConnectWithoutCartInput
      | CartItemCreateOrConnectWithoutCartInput[];
    createMany?: CartItemCreateManyCartInputEnvelope;
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[];
  };

  export type CartItemUncheckedCreateNestedManyWithoutCartInput = {
    create?:
      | XOR<
          CartItemCreateWithoutCartInput,
          CartItemUncheckedCreateWithoutCartInput
        >
      | CartItemCreateWithoutCartInput[]
      | CartItemUncheckedCreateWithoutCartInput[];
    connectOrCreate?:
      | CartItemCreateOrConnectWithoutCartInput
      | CartItemCreateOrConnectWithoutCartInput[];
    createMany?: CartItemCreateManyCartInputEnvelope;
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[];
  };

  export type CartItemUpdateManyWithoutCartNestedInput = {
    create?:
      | XOR<
          CartItemCreateWithoutCartInput,
          CartItemUncheckedCreateWithoutCartInput
        >
      | CartItemCreateWithoutCartInput[]
      | CartItemUncheckedCreateWithoutCartInput[];
    connectOrCreate?:
      | CartItemCreateOrConnectWithoutCartInput
      | CartItemCreateOrConnectWithoutCartInput[];
    upsert?:
      | CartItemUpsertWithWhereUniqueWithoutCartInput
      | CartItemUpsertWithWhereUniqueWithoutCartInput[];
    createMany?: CartItemCreateManyCartInputEnvelope;
    set?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[];
    disconnect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[];
    delete?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[];
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[];
    update?:
      | CartItemUpdateWithWhereUniqueWithoutCartInput
      | CartItemUpdateWithWhereUniqueWithoutCartInput[];
    updateMany?:
      | CartItemUpdateManyWithWhereWithoutCartInput
      | CartItemUpdateManyWithWhereWithoutCartInput[];
    deleteMany?: CartItemScalarWhereInput | CartItemScalarWhereInput[];
  };

  export type CartItemUncheckedUpdateManyWithoutCartNestedInput = {
    create?:
      | XOR<
          CartItemCreateWithoutCartInput,
          CartItemUncheckedCreateWithoutCartInput
        >
      | CartItemCreateWithoutCartInput[]
      | CartItemUncheckedCreateWithoutCartInput[];
    connectOrCreate?:
      | CartItemCreateOrConnectWithoutCartInput
      | CartItemCreateOrConnectWithoutCartInput[];
    upsert?:
      | CartItemUpsertWithWhereUniqueWithoutCartInput
      | CartItemUpsertWithWhereUniqueWithoutCartInput[];
    createMany?: CartItemCreateManyCartInputEnvelope;
    set?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[];
    disconnect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[];
    delete?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[];
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[];
    update?:
      | CartItemUpdateWithWhereUniqueWithoutCartInput
      | CartItemUpdateWithWhereUniqueWithoutCartInput[];
    updateMany?:
      | CartItemUpdateManyWithWhereWithoutCartInput
      | CartItemUpdateManyWithWhereWithoutCartInput[];
    deleteMany?: CartItemScalarWhereInput | CartItemScalarWhereInput[];
  };

  export type ShoppingCartCreateNestedOneWithoutItemsInput = {
    create?: XOR<
      ShoppingCartCreateWithoutItemsInput,
      ShoppingCartUncheckedCreateWithoutItemsInput
    >;
    connectOrCreate?: ShoppingCartCreateOrConnectWithoutItemsInput;
    connect?: ShoppingCartWhereUniqueInput;
  };

  export type ProductCreateNestedOneWithoutCartItemsInput = {
    create?: XOR<
      ProductCreateWithoutCartItemsInput,
      ProductUncheckedCreateWithoutCartItemsInput
    >;
    connectOrCreate?: ProductCreateOrConnectWithoutCartItemsInput;
    connect?: ProductWhereUniqueInput;
  };

  export type ShoppingCartUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<
      ShoppingCartCreateWithoutItemsInput,
      ShoppingCartUncheckedCreateWithoutItemsInput
    >;
    connectOrCreate?: ShoppingCartCreateOrConnectWithoutItemsInput;
    upsert?: ShoppingCartUpsertWithoutItemsInput;
    connect?: ShoppingCartWhereUniqueInput;
    update?: XOR<
      XOR<
        ShoppingCartUpdateToOneWithWhereWithoutItemsInput,
        ShoppingCartUpdateWithoutItemsInput
      >,
      ShoppingCartUncheckedUpdateWithoutItemsInput
    >;
  };

  export type ProductUpdateOneRequiredWithoutCartItemsNestedInput = {
    create?: XOR<
      ProductCreateWithoutCartItemsInput,
      ProductUncheckedCreateWithoutCartItemsInput
    >;
    connectOrCreate?: ProductCreateOrConnectWithoutCartItemsInput;
    upsert?: ProductUpsertWithoutCartItemsInput;
    connect?: ProductWhereUniqueInput;
    update?: XOR<
      XOR<
        ProductUpdateToOneWithWhereWithoutCartItemsInput,
        ProductUpdateWithoutCartItemsInput
      >,
      ProductUncheckedUpdateWithoutCartItemsInput
    >;
  };

  export type OrderItemCreateNestedManyWithoutOrderInput = {
    create?:
      | XOR<
          OrderItemCreateWithoutOrderInput,
          OrderItemUncheckedCreateWithoutOrderInput
        >
      | OrderItemCreateWithoutOrderInput[]
      | OrderItemUncheckedCreateWithoutOrderInput[];
    connectOrCreate?:
      | OrderItemCreateOrConnectWithoutOrderInput
      | OrderItemCreateOrConnectWithoutOrderInput[];
    createMany?: OrderItemCreateManyOrderInputEnvelope;
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
  };

  export type VendorOrderCreateNestedManyWithoutOrderInput = {
    create?:
      | XOR<
          VendorOrderCreateWithoutOrderInput,
          VendorOrderUncheckedCreateWithoutOrderInput
        >
      | VendorOrderCreateWithoutOrderInput[]
      | VendorOrderUncheckedCreateWithoutOrderInput[];
    connectOrCreate?:
      | VendorOrderCreateOrConnectWithoutOrderInput
      | VendorOrderCreateOrConnectWithoutOrderInput[];
    createMany?: VendorOrderCreateManyOrderInputEnvelope;
    connect?: VendorOrderWhereUniqueInput | VendorOrderWhereUniqueInput[];
  };

  export type OrderItemUncheckedCreateNestedManyWithoutOrderInput = {
    create?:
      | XOR<
          OrderItemCreateWithoutOrderInput,
          OrderItemUncheckedCreateWithoutOrderInput
        >
      | OrderItemCreateWithoutOrderInput[]
      | OrderItemUncheckedCreateWithoutOrderInput[];
    connectOrCreate?:
      | OrderItemCreateOrConnectWithoutOrderInput
      | OrderItemCreateOrConnectWithoutOrderInput[];
    createMany?: OrderItemCreateManyOrderInputEnvelope;
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
  };

  export type VendorOrderUncheckedCreateNestedManyWithoutOrderInput = {
    create?:
      | XOR<
          VendorOrderCreateWithoutOrderInput,
          VendorOrderUncheckedCreateWithoutOrderInput
        >
      | VendorOrderCreateWithoutOrderInput[]
      | VendorOrderUncheckedCreateWithoutOrderInput[];
    connectOrCreate?:
      | VendorOrderCreateOrConnectWithoutOrderInput
      | VendorOrderCreateOrConnectWithoutOrderInput[];
    createMany?: VendorOrderCreateManyOrderInputEnvelope;
    connect?: VendorOrderWhereUniqueInput | VendorOrderWhereUniqueInput[];
  };

  export type EnumOrderStatusFieldUpdateOperationsInput = {
    set?: $Enums.OrderStatus;
  };

  export type EnumPaymentStatusFieldUpdateOperationsInput = {
    set?: $Enums.PaymentStatus;
  };

  export type OrderItemUpdateManyWithoutOrderNestedInput = {
    create?:
      | XOR<
          OrderItemCreateWithoutOrderInput,
          OrderItemUncheckedCreateWithoutOrderInput
        >
      | OrderItemCreateWithoutOrderInput[]
      | OrderItemUncheckedCreateWithoutOrderInput[];
    connectOrCreate?:
      | OrderItemCreateOrConnectWithoutOrderInput
      | OrderItemCreateOrConnectWithoutOrderInput[];
    upsert?:
      | OrderItemUpsertWithWhereUniqueWithoutOrderInput
      | OrderItemUpsertWithWhereUniqueWithoutOrderInput[];
    createMany?: OrderItemCreateManyOrderInputEnvelope;
    set?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    disconnect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    delete?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    update?:
      | OrderItemUpdateWithWhereUniqueWithoutOrderInput
      | OrderItemUpdateWithWhereUniqueWithoutOrderInput[];
    updateMany?:
      | OrderItemUpdateManyWithWhereWithoutOrderInput
      | OrderItemUpdateManyWithWhereWithoutOrderInput[];
    deleteMany?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[];
  };

  export type VendorOrderUpdateManyWithoutOrderNestedInput = {
    create?:
      | XOR<
          VendorOrderCreateWithoutOrderInput,
          VendorOrderUncheckedCreateWithoutOrderInput
        >
      | VendorOrderCreateWithoutOrderInput[]
      | VendorOrderUncheckedCreateWithoutOrderInput[];
    connectOrCreate?:
      | VendorOrderCreateOrConnectWithoutOrderInput
      | VendorOrderCreateOrConnectWithoutOrderInput[];
    upsert?:
      | VendorOrderUpsertWithWhereUniqueWithoutOrderInput
      | VendorOrderUpsertWithWhereUniqueWithoutOrderInput[];
    createMany?: VendorOrderCreateManyOrderInputEnvelope;
    set?: VendorOrderWhereUniqueInput | VendorOrderWhereUniqueInput[];
    disconnect?: VendorOrderWhereUniqueInput | VendorOrderWhereUniqueInput[];
    delete?: VendorOrderWhereUniqueInput | VendorOrderWhereUniqueInput[];
    connect?: VendorOrderWhereUniqueInput | VendorOrderWhereUniqueInput[];
    update?:
      | VendorOrderUpdateWithWhereUniqueWithoutOrderInput
      | VendorOrderUpdateWithWhereUniqueWithoutOrderInput[];
    updateMany?:
      | VendorOrderUpdateManyWithWhereWithoutOrderInput
      | VendorOrderUpdateManyWithWhereWithoutOrderInput[];
    deleteMany?: VendorOrderScalarWhereInput | VendorOrderScalarWhereInput[];
  };

  export type OrderItemUncheckedUpdateManyWithoutOrderNestedInput = {
    create?:
      | XOR<
          OrderItemCreateWithoutOrderInput,
          OrderItemUncheckedCreateWithoutOrderInput
        >
      | OrderItemCreateWithoutOrderInput[]
      | OrderItemUncheckedCreateWithoutOrderInput[];
    connectOrCreate?:
      | OrderItemCreateOrConnectWithoutOrderInput
      | OrderItemCreateOrConnectWithoutOrderInput[];
    upsert?:
      | OrderItemUpsertWithWhereUniqueWithoutOrderInput
      | OrderItemUpsertWithWhereUniqueWithoutOrderInput[];
    createMany?: OrderItemCreateManyOrderInputEnvelope;
    set?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    disconnect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    delete?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    update?:
      | OrderItemUpdateWithWhereUniqueWithoutOrderInput
      | OrderItemUpdateWithWhereUniqueWithoutOrderInput[];
    updateMany?:
      | OrderItemUpdateManyWithWhereWithoutOrderInput
      | OrderItemUpdateManyWithWhereWithoutOrderInput[];
    deleteMany?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[];
  };

  export type VendorOrderUncheckedUpdateManyWithoutOrderNestedInput = {
    create?:
      | XOR<
          VendorOrderCreateWithoutOrderInput,
          VendorOrderUncheckedCreateWithoutOrderInput
        >
      | VendorOrderCreateWithoutOrderInput[]
      | VendorOrderUncheckedCreateWithoutOrderInput[];
    connectOrCreate?:
      | VendorOrderCreateOrConnectWithoutOrderInput
      | VendorOrderCreateOrConnectWithoutOrderInput[];
    upsert?:
      | VendorOrderUpsertWithWhereUniqueWithoutOrderInput
      | VendorOrderUpsertWithWhereUniqueWithoutOrderInput[];
    createMany?: VendorOrderCreateManyOrderInputEnvelope;
    set?: VendorOrderWhereUniqueInput | VendorOrderWhereUniqueInput[];
    disconnect?: VendorOrderWhereUniqueInput | VendorOrderWhereUniqueInput[];
    delete?: VendorOrderWhereUniqueInput | VendorOrderWhereUniqueInput[];
    connect?: VendorOrderWhereUniqueInput | VendorOrderWhereUniqueInput[];
    update?:
      | VendorOrderUpdateWithWhereUniqueWithoutOrderInput
      | VendorOrderUpdateWithWhereUniqueWithoutOrderInput[];
    updateMany?:
      | VendorOrderUpdateManyWithWhereWithoutOrderInput
      | VendorOrderUpdateManyWithWhereWithoutOrderInput[];
    deleteMany?: VendorOrderScalarWhereInput | VendorOrderScalarWhereInput[];
  };

  export type OrderCreateNestedOneWithoutVendorOrdersInput = {
    create?: XOR<
      OrderCreateWithoutVendorOrdersInput,
      OrderUncheckedCreateWithoutVendorOrdersInput
    >;
    connectOrCreate?: OrderCreateOrConnectWithoutVendorOrdersInput;
    connect?: OrderWhereUniqueInput;
  };

  export type OrderItemCreateNestedManyWithoutVendorOrderInput = {
    create?:
      | XOR<
          OrderItemCreateWithoutVendorOrderInput,
          OrderItemUncheckedCreateWithoutVendorOrderInput
        >
      | OrderItemCreateWithoutVendorOrderInput[]
      | OrderItemUncheckedCreateWithoutVendorOrderInput[];
    connectOrCreate?:
      | OrderItemCreateOrConnectWithoutVendorOrderInput
      | OrderItemCreateOrConnectWithoutVendorOrderInput[];
    createMany?: OrderItemCreateManyVendorOrderInputEnvelope;
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
  };

  export type OrderItemUncheckedCreateNestedManyWithoutVendorOrderInput = {
    create?:
      | XOR<
          OrderItemCreateWithoutVendorOrderInput,
          OrderItemUncheckedCreateWithoutVendorOrderInput
        >
      | OrderItemCreateWithoutVendorOrderInput[]
      | OrderItemUncheckedCreateWithoutVendorOrderInput[];
    connectOrCreate?:
      | OrderItemCreateOrConnectWithoutVendorOrderInput
      | OrderItemCreateOrConnectWithoutVendorOrderInput[];
    createMany?: OrderItemCreateManyVendorOrderInputEnvelope;
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
  };

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
  };

  export type OrderUpdateOneRequiredWithoutVendorOrdersNestedInput = {
    create?: XOR<
      OrderCreateWithoutVendorOrdersInput,
      OrderUncheckedCreateWithoutVendorOrdersInput
    >;
    connectOrCreate?: OrderCreateOrConnectWithoutVendorOrdersInput;
    upsert?: OrderUpsertWithoutVendorOrdersInput;
    connect?: OrderWhereUniqueInput;
    update?: XOR<
      XOR<
        OrderUpdateToOneWithWhereWithoutVendorOrdersInput,
        OrderUpdateWithoutVendorOrdersInput
      >,
      OrderUncheckedUpdateWithoutVendorOrdersInput
    >;
  };

  export type OrderItemUpdateManyWithoutVendorOrderNestedInput = {
    create?:
      | XOR<
          OrderItemCreateWithoutVendorOrderInput,
          OrderItemUncheckedCreateWithoutVendorOrderInput
        >
      | OrderItemCreateWithoutVendorOrderInput[]
      | OrderItemUncheckedCreateWithoutVendorOrderInput[];
    connectOrCreate?:
      | OrderItemCreateOrConnectWithoutVendorOrderInput
      | OrderItemCreateOrConnectWithoutVendorOrderInput[];
    upsert?:
      | OrderItemUpsertWithWhereUniqueWithoutVendorOrderInput
      | OrderItemUpsertWithWhereUniqueWithoutVendorOrderInput[];
    createMany?: OrderItemCreateManyVendorOrderInputEnvelope;
    set?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    disconnect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    delete?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    update?:
      | OrderItemUpdateWithWhereUniqueWithoutVendorOrderInput
      | OrderItemUpdateWithWhereUniqueWithoutVendorOrderInput[];
    updateMany?:
      | OrderItemUpdateManyWithWhereWithoutVendorOrderInput
      | OrderItemUpdateManyWithWhereWithoutVendorOrderInput[];
    deleteMany?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[];
  };

  export type OrderItemUncheckedUpdateManyWithoutVendorOrderNestedInput = {
    create?:
      | XOR<
          OrderItemCreateWithoutVendorOrderInput,
          OrderItemUncheckedCreateWithoutVendorOrderInput
        >
      | OrderItemCreateWithoutVendorOrderInput[]
      | OrderItemUncheckedCreateWithoutVendorOrderInput[];
    connectOrCreate?:
      | OrderItemCreateOrConnectWithoutVendorOrderInput
      | OrderItemCreateOrConnectWithoutVendorOrderInput[];
    upsert?:
      | OrderItemUpsertWithWhereUniqueWithoutVendorOrderInput
      | OrderItemUpsertWithWhereUniqueWithoutVendorOrderInput[];
    createMany?: OrderItemCreateManyVendorOrderInputEnvelope;
    set?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    disconnect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    delete?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    connect?: OrderItemWhereUniqueInput | OrderItemWhereUniqueInput[];
    update?:
      | OrderItemUpdateWithWhereUniqueWithoutVendorOrderInput
      | OrderItemUpdateWithWhereUniqueWithoutVendorOrderInput[];
    updateMany?:
      | OrderItemUpdateManyWithWhereWithoutVendorOrderInput
      | OrderItemUpdateManyWithWhereWithoutVendorOrderInput[];
    deleteMany?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[];
  };

  export type OrderCreateNestedOneWithoutItemsInput = {
    create?: XOR<
      OrderCreateWithoutItemsInput,
      OrderUncheckedCreateWithoutItemsInput
    >;
    connectOrCreate?: OrderCreateOrConnectWithoutItemsInput;
    connect?: OrderWhereUniqueInput;
  };

  export type VendorOrderCreateNestedOneWithoutItemsInput = {
    create?: XOR<
      VendorOrderCreateWithoutItemsInput,
      VendorOrderUncheckedCreateWithoutItemsInput
    >;
    connectOrCreate?: VendorOrderCreateOrConnectWithoutItemsInput;
    connect?: VendorOrderWhereUniqueInput;
  };

  export type ProductCreateNestedOneWithoutOrderItemsInput = {
    create?: XOR<
      ProductCreateWithoutOrderItemsInput,
      ProductUncheckedCreateWithoutOrderItemsInput
    >;
    connectOrCreate?: ProductCreateOrConnectWithoutOrderItemsInput;
    connect?: ProductWhereUniqueInput;
  };

  export type OrderUpdateOneWithoutItemsNestedInput = {
    create?: XOR<
      OrderCreateWithoutItemsInput,
      OrderUncheckedCreateWithoutItemsInput
    >;
    connectOrCreate?: OrderCreateOrConnectWithoutItemsInput;
    upsert?: OrderUpsertWithoutItemsInput;
    disconnect?: OrderWhereInput | boolean;
    delete?: OrderWhereInput | boolean;
    connect?: OrderWhereUniqueInput;
    update?: XOR<
      XOR<
        OrderUpdateToOneWithWhereWithoutItemsInput,
        OrderUpdateWithoutItemsInput
      >,
      OrderUncheckedUpdateWithoutItemsInput
    >;
  };

  export type VendorOrderUpdateOneWithoutItemsNestedInput = {
    create?: XOR<
      VendorOrderCreateWithoutItemsInput,
      VendorOrderUncheckedCreateWithoutItemsInput
    >;
    connectOrCreate?: VendorOrderCreateOrConnectWithoutItemsInput;
    upsert?: VendorOrderUpsertWithoutItemsInput;
    disconnect?: VendorOrderWhereInput | boolean;
    delete?: VendorOrderWhereInput | boolean;
    connect?: VendorOrderWhereUniqueInput;
    update?: XOR<
      XOR<
        VendorOrderUpdateToOneWithWhereWithoutItemsInput,
        VendorOrderUpdateWithoutItemsInput
      >,
      VendorOrderUncheckedUpdateWithoutItemsInput
    >;
  };

  export type ProductUpdateOneRequiredWithoutOrderItemsNestedInput = {
    create?: XOR<
      ProductCreateWithoutOrderItemsInput,
      ProductUncheckedCreateWithoutOrderItemsInput
    >;
    connectOrCreate?: ProductCreateOrConnectWithoutOrderItemsInput;
    upsert?: ProductUpsertWithoutOrderItemsInput;
    connect?: ProductWhereUniqueInput;
    update?: XOR<
      XOR<
        ProductUpdateToOneWithWhereWithoutOrderItemsInput,
        ProductUpdateWithoutOrderItemsInput
      >,
      ProductUncheckedUpdateWithoutOrderItemsInput
    >;
  };

  export type ProductCreateNestedOneWithoutReviewsInput = {
    create?: XOR<
      ProductCreateWithoutReviewsInput,
      ProductUncheckedCreateWithoutReviewsInput
    >;
    connectOrCreate?: ProductCreateOrConnectWithoutReviewsInput;
    connect?: ProductWhereUniqueInput;
  };

  export type ProductUpdateOneRequiredWithoutReviewsNestedInput = {
    create?: XOR<
      ProductCreateWithoutReviewsInput,
      ProductUncheckedCreateWithoutReviewsInput
    >;
    connectOrCreate?: ProductCreateOrConnectWithoutReviewsInput;
    upsert?: ProductUpsertWithoutReviewsInput;
    connect?: ProductWhereUniqueInput;
    update?: XOR<
      XOR<
        ProductUpdateToOneWithWhereWithoutReviewsInput,
        ProductUpdateWithoutReviewsInput
      >,
      ProductUncheckedUpdateWithoutReviewsInput
    >;
  };

  export type WishlistItemCreateNestedManyWithoutWishlistInput = {
    create?:
      | XOR<
          WishlistItemCreateWithoutWishlistInput,
          WishlistItemUncheckedCreateWithoutWishlistInput
        >
      | WishlistItemCreateWithoutWishlistInput[]
      | WishlistItemUncheckedCreateWithoutWishlistInput[];
    connectOrCreate?:
      | WishlistItemCreateOrConnectWithoutWishlistInput
      | WishlistItemCreateOrConnectWithoutWishlistInput[];
    createMany?: WishlistItemCreateManyWishlistInputEnvelope;
    connect?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[];
  };

  export type WishlistItemUncheckedCreateNestedManyWithoutWishlistInput = {
    create?:
      | XOR<
          WishlistItemCreateWithoutWishlistInput,
          WishlistItemUncheckedCreateWithoutWishlistInput
        >
      | WishlistItemCreateWithoutWishlistInput[]
      | WishlistItemUncheckedCreateWithoutWishlistInput[];
    connectOrCreate?:
      | WishlistItemCreateOrConnectWithoutWishlistInput
      | WishlistItemCreateOrConnectWithoutWishlistInput[];
    createMany?: WishlistItemCreateManyWishlistInputEnvelope;
    connect?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[];
  };

  export type WishlistItemUpdateManyWithoutWishlistNestedInput = {
    create?:
      | XOR<
          WishlistItemCreateWithoutWishlistInput,
          WishlistItemUncheckedCreateWithoutWishlistInput
        >
      | WishlistItemCreateWithoutWishlistInput[]
      | WishlistItemUncheckedCreateWithoutWishlistInput[];
    connectOrCreate?:
      | WishlistItemCreateOrConnectWithoutWishlistInput
      | WishlistItemCreateOrConnectWithoutWishlistInput[];
    upsert?:
      | WishlistItemUpsertWithWhereUniqueWithoutWishlistInput
      | WishlistItemUpsertWithWhereUniqueWithoutWishlistInput[];
    createMany?: WishlistItemCreateManyWishlistInputEnvelope;
    set?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[];
    disconnect?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[];
    delete?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[];
    connect?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[];
    update?:
      | WishlistItemUpdateWithWhereUniqueWithoutWishlistInput
      | WishlistItemUpdateWithWhereUniqueWithoutWishlistInput[];
    updateMany?:
      | WishlistItemUpdateManyWithWhereWithoutWishlistInput
      | WishlistItemUpdateManyWithWhereWithoutWishlistInput[];
    deleteMany?: WishlistItemScalarWhereInput | WishlistItemScalarWhereInput[];
  };

  export type WishlistItemUncheckedUpdateManyWithoutWishlistNestedInput = {
    create?:
      | XOR<
          WishlistItemCreateWithoutWishlistInput,
          WishlistItemUncheckedCreateWithoutWishlistInput
        >
      | WishlistItemCreateWithoutWishlistInput[]
      | WishlistItemUncheckedCreateWithoutWishlistInput[];
    connectOrCreate?:
      | WishlistItemCreateOrConnectWithoutWishlistInput
      | WishlistItemCreateOrConnectWithoutWishlistInput[];
    upsert?:
      | WishlistItemUpsertWithWhereUniqueWithoutWishlistInput
      | WishlistItemUpsertWithWhereUniqueWithoutWishlistInput[];
    createMany?: WishlistItemCreateManyWishlistInputEnvelope;
    set?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[];
    disconnect?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[];
    delete?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[];
    connect?: WishlistItemWhereUniqueInput | WishlistItemWhereUniqueInput[];
    update?:
      | WishlistItemUpdateWithWhereUniqueWithoutWishlistInput
      | WishlistItemUpdateWithWhereUniqueWithoutWishlistInput[];
    updateMany?:
      | WishlistItemUpdateManyWithWhereWithoutWishlistInput
      | WishlistItemUpdateManyWithWhereWithoutWishlistInput[];
    deleteMany?: WishlistItemScalarWhereInput | WishlistItemScalarWhereInput[];
  };

  export type WishlistCreateNestedOneWithoutItemsInput = {
    create?: XOR<
      WishlistCreateWithoutItemsInput,
      WishlistUncheckedCreateWithoutItemsInput
    >;
    connectOrCreate?: WishlistCreateOrConnectWithoutItemsInput;
    connect?: WishlistWhereUniqueInput;
  };

  export type ProductCreateNestedOneWithoutWishlistItemsInput = {
    create?: XOR<
      ProductCreateWithoutWishlistItemsInput,
      ProductUncheckedCreateWithoutWishlistItemsInput
    >;
    connectOrCreate?: ProductCreateOrConnectWithoutWishlistItemsInput;
    connect?: ProductWhereUniqueInput;
  };

  export type WishlistUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<
      WishlistCreateWithoutItemsInput,
      WishlistUncheckedCreateWithoutItemsInput
    >;
    connectOrCreate?: WishlistCreateOrConnectWithoutItemsInput;
    upsert?: WishlistUpsertWithoutItemsInput;
    connect?: WishlistWhereUniqueInput;
    update?: XOR<
      XOR<
        WishlistUpdateToOneWithWhereWithoutItemsInput,
        WishlistUpdateWithoutItemsInput
      >,
      WishlistUncheckedUpdateWithoutItemsInput
    >;
  };

  export type ProductUpdateOneRequiredWithoutWishlistItemsNestedInput = {
    create?: XOR<
      ProductCreateWithoutWishlistItemsInput,
      ProductUncheckedCreateWithoutWishlistItemsInput
    >;
    connectOrCreate?: ProductCreateOrConnectWithoutWishlistItemsInput;
    upsert?: ProductUpsertWithoutWishlistItemsInput;
    connect?: ProductWhereUniqueInput;
    update?: XOR<
      XOR<
        ProductUpdateToOneWithWhereWithoutWishlistItemsInput,
        ProductUpdateWithoutWishlistItemsInput
      >,
      ProductUncheckedUpdateWithoutWishlistItemsInput
    >;
  };

  export type VendorCreateNestedOneWithoutAnalyticsInput = {
    create?: XOR<
      VendorCreateWithoutAnalyticsInput,
      VendorUncheckedCreateWithoutAnalyticsInput
    >;
    connectOrCreate?: VendorCreateOrConnectWithoutAnalyticsInput;
    connect?: VendorWhereUniqueInput;
  };

  export type VendorUpdateOneRequiredWithoutAnalyticsNestedInput = {
    create?: XOR<
      VendorCreateWithoutAnalyticsInput,
      VendorUncheckedCreateWithoutAnalyticsInput
    >;
    connectOrCreate?: VendorCreateOrConnectWithoutAnalyticsInput;
    upsert?: VendorUpsertWithoutAnalyticsInput;
    connect?: VendorWhereUniqueInput;
    update?: XOR<
      XOR<
        VendorUpdateToOneWithWhereWithoutAnalyticsInput,
        VendorUpdateWithoutAnalyticsInput
      >,
      VendorUncheckedUpdateWithoutAnalyticsInput
    >;
  };

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?:
      | NestedStringNullableWithAggregatesFilter<$PrismaModel>
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<NestedJsonNullableFilterBase<$PrismaModel>>,
          Exclude<
            keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>,
            'path'
          >
        >,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<
        Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>
      >;

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    path?: string[];
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
  };

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedFloatNullableFilter<$PrismaModel>;
    _min?: NestedFloatNullableFilter<$PrismaModel>;
    _max?: NestedFloatNullableFilter<$PrismaModel>;
  };

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedFloatFilter<$PrismaModel>;
    _min?: NestedFloatFilter<$PrismaModel>;
    _max?: NestedFloatFilter<$PrismaModel>;
  };

  export type NestedEnumOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.OrderStatus[] | ListEnumOrderStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.OrderStatus[]
      | ListEnumOrderStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumOrderStatusFilter<$PrismaModel> | $Enums.OrderStatus;
  };

  export type NestedEnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.PaymentStatus
      | EnumPaymentStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus;
  };

  export type NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel = never> =
    {
      equals?: $Enums.OrderStatus | EnumOrderStatusFieldRefInput<$PrismaModel>;
      in?:
        | $Enums.OrderStatus[]
        | ListEnumOrderStatusFieldRefInput<$PrismaModel>;
      notIn?:
        | $Enums.OrderStatus[]
        | ListEnumOrderStatusFieldRefInput<$PrismaModel>;
      not?:
        | NestedEnumOrderStatusWithAggregatesFilter<$PrismaModel>
        | $Enums.OrderStatus;
      _count?: NestedIntFilter<$PrismaModel>;
      _min?: NestedEnumOrderStatusFilter<$PrismaModel>;
      _max?: NestedEnumOrderStatusFilter<$PrismaModel>;
    };
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<NestedJsonFilterBase<$PrismaModel>>,
          Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>;

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    path?: string[];
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
  };

  export type NestedEnumPaymentStatusWithAggregatesFilter<
    $PrismaModel = never,
  > = {
    equals?:
      | $Enums.PaymentStatus
      | EnumPaymentStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel>
      | $Enums.PaymentStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>;
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>;
  };

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> =
    {
      equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
      in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
      notIn?:
        | Date[]
        | string[]
        | ListDateTimeFieldRefInput<$PrismaModel>
        | null;
      lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      not?:
        | NestedDateTimeNullableWithAggregatesFilter<$PrismaModel>
        | Date
        | string
        | null;
      _count?: NestedIntNullableFilter<$PrismaModel>;
      _min?: NestedDateTimeNullableFilter<$PrismaModel>;
      _max?: NestedDateTimeNullableFilter<$PrismaModel>;
    };

  export type ProductCreateWithoutVendorInput = {
    id?: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    sku?: string | null;
    category: string;
    subcategory?: string | null;
    brand?: string | null;
    images?: ProductCreateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    isActive?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inventory?: ProductInventoryCreateNestedOneWithoutProductInput;
    reservations?: InventoryReservationCreateNestedManyWithoutProductInput;
    orderItems?: OrderItemCreateNestedManyWithoutProductInput;
    reviews?: ProductReviewCreateNestedManyWithoutProductInput;
    cartItems?: CartItemCreateNestedManyWithoutProductInput;
    wishlistItems?: WishlistItemCreateNestedManyWithoutProductInput;
  };

  export type ProductUncheckedCreateWithoutVendorInput = {
    id?: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    sku?: string | null;
    category: string;
    subcategory?: string | null;
    brand?: string | null;
    images?: ProductCreateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    isActive?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inventory?: ProductInventoryUncheckedCreateNestedOneWithoutProductInput;
    reservations?: InventoryReservationUncheckedCreateNestedManyWithoutProductInput;
    orderItems?: OrderItemUncheckedCreateNestedManyWithoutProductInput;
    reviews?: ProductReviewUncheckedCreateNestedManyWithoutProductInput;
    cartItems?: CartItemUncheckedCreateNestedManyWithoutProductInput;
    wishlistItems?: WishlistItemUncheckedCreateNestedManyWithoutProductInput;
  };

  export type ProductCreateOrConnectWithoutVendorInput = {
    where: ProductWhereUniqueInput;
    create: XOR<
      ProductCreateWithoutVendorInput,
      ProductUncheckedCreateWithoutVendorInput
    >;
  };

  export type ProductCreateManyVendorInputEnvelope = {
    data: ProductCreateManyVendorInput | ProductCreateManyVendorInput[];
    skipDuplicates?: boolean;
  };

  export type VendorAnalyticsCreateWithoutVendorInput = {
    id?: string;
    period: string;
    date: Date | string;
    totalOrders?: number;
    totalRevenue?: number;
    totalViews?: number;
    conversionRate?: number;
    createdAt?: Date | string;
  };

  export type VendorAnalyticsUncheckedCreateWithoutVendorInput = {
    id?: string;
    period: string;
    date: Date | string;
    totalOrders?: number;
    totalRevenue?: number;
    totalViews?: number;
    conversionRate?: number;
    createdAt?: Date | string;
  };

  export type VendorAnalyticsCreateOrConnectWithoutVendorInput = {
    where: VendorAnalyticsWhereUniqueInput;
    create: XOR<
      VendorAnalyticsCreateWithoutVendorInput,
      VendorAnalyticsUncheckedCreateWithoutVendorInput
    >;
  };

  export type VendorAnalyticsCreateManyVendorInputEnvelope = {
    data:
      | VendorAnalyticsCreateManyVendorInput
      | VendorAnalyticsCreateManyVendorInput[];
    skipDuplicates?: boolean;
  };

  export type ProductUpsertWithWhereUniqueWithoutVendorInput = {
    where: ProductWhereUniqueInput;
    update: XOR<
      ProductUpdateWithoutVendorInput,
      ProductUncheckedUpdateWithoutVendorInput
    >;
    create: XOR<
      ProductCreateWithoutVendorInput,
      ProductUncheckedCreateWithoutVendorInput
    >;
  };

  export type ProductUpdateWithWhereUniqueWithoutVendorInput = {
    where: ProductWhereUniqueInput;
    data: XOR<
      ProductUpdateWithoutVendorInput,
      ProductUncheckedUpdateWithoutVendorInput
    >;
  };

  export type ProductUpdateManyWithWhereWithoutVendorInput = {
    where: ProductScalarWhereInput;
    data: XOR<
      ProductUpdateManyMutationInput,
      ProductUncheckedUpdateManyWithoutVendorInput
    >;
  };

  export type ProductScalarWhereInput = {
    AND?: ProductScalarWhereInput | ProductScalarWhereInput[];
    OR?: ProductScalarWhereInput[];
    NOT?: ProductScalarWhereInput | ProductScalarWhereInput[];
    id?: StringFilter<'Product'> | string;
    name?: StringFilter<'Product'> | string;
    description?: StringFilter<'Product'> | string;
    price?: FloatFilter<'Product'> | number;
    comparePrice?: FloatNullableFilter<'Product'> | number | null;
    sku?: StringNullableFilter<'Product'> | string | null;
    category?: StringFilter<'Product'> | string;
    subcategory?: StringNullableFilter<'Product'> | string | null;
    brand?: StringNullableFilter<'Product'> | string | null;
    images?: StringNullableListFilter<'Product'>;
    specifications?: JsonNullableFilter<'Product'>;
    vendorId?: StringFilter<'Product'> | string;
    isActive?: BoolFilter<'Product'> | boolean;
    rating?: FloatNullableFilter<'Product'> | number | null;
    reviewCount?: IntFilter<'Product'> | number;
    createdAt?: DateTimeFilter<'Product'> | Date | string;
    updatedAt?: DateTimeFilter<'Product'> | Date | string;
  };

  export type VendorAnalyticsUpsertWithWhereUniqueWithoutVendorInput = {
    where: VendorAnalyticsWhereUniqueInput;
    update: XOR<
      VendorAnalyticsUpdateWithoutVendorInput,
      VendorAnalyticsUncheckedUpdateWithoutVendorInput
    >;
    create: XOR<
      VendorAnalyticsCreateWithoutVendorInput,
      VendorAnalyticsUncheckedCreateWithoutVendorInput
    >;
  };

  export type VendorAnalyticsUpdateWithWhereUniqueWithoutVendorInput = {
    where: VendorAnalyticsWhereUniqueInput;
    data: XOR<
      VendorAnalyticsUpdateWithoutVendorInput,
      VendorAnalyticsUncheckedUpdateWithoutVendorInput
    >;
  };

  export type VendorAnalyticsUpdateManyWithWhereWithoutVendorInput = {
    where: VendorAnalyticsScalarWhereInput;
    data: XOR<
      VendorAnalyticsUpdateManyMutationInput,
      VendorAnalyticsUncheckedUpdateManyWithoutVendorInput
    >;
  };

  export type VendorAnalyticsScalarWhereInput = {
    AND?: VendorAnalyticsScalarWhereInput | VendorAnalyticsScalarWhereInput[];
    OR?: VendorAnalyticsScalarWhereInput[];
    NOT?: VendorAnalyticsScalarWhereInput | VendorAnalyticsScalarWhereInput[];
    id?: StringFilter<'VendorAnalytics'> | string;
    vendorId?: StringFilter<'VendorAnalytics'> | string;
    period?: StringFilter<'VendorAnalytics'> | string;
    date?: DateTimeFilter<'VendorAnalytics'> | Date | string;
    totalOrders?: IntFilter<'VendorAnalytics'> | number;
    totalRevenue?: FloatFilter<'VendorAnalytics'> | number;
    totalViews?: IntFilter<'VendorAnalytics'> | number;
    conversionRate?: FloatFilter<'VendorAnalytics'> | number;
    createdAt?: DateTimeFilter<'VendorAnalytics'> | Date | string;
  };

  export type VendorCreateWithoutProductsInput = {
    id?: string;
    name: string;
    email: string;
    phone?: string | null;
    address?: NullableJsonNullValueInput | InputJsonValue;
    description?: string | null;
    isActive?: boolean;
    isVerified?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    analytics?: VendorAnalyticsCreateNestedManyWithoutVendorInput;
  };

  export type VendorUncheckedCreateWithoutProductsInput = {
    id?: string;
    name: string;
    email: string;
    phone?: string | null;
    address?: NullableJsonNullValueInput | InputJsonValue;
    description?: string | null;
    isActive?: boolean;
    isVerified?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    analytics?: VendorAnalyticsUncheckedCreateNestedManyWithoutVendorInput;
  };

  export type VendorCreateOrConnectWithoutProductsInput = {
    where: VendorWhereUniqueInput;
    create: XOR<
      VendorCreateWithoutProductsInput,
      VendorUncheckedCreateWithoutProductsInput
    >;
  };

  export type ProductInventoryCreateWithoutProductInput = {
    id?: string;
    quantity?: number;
    reservedQuantity?: number;
    lowStockThreshold?: number;
    trackQuantity?: boolean;
    updatedAt?: Date | string;
  };

  export type ProductInventoryUncheckedCreateWithoutProductInput = {
    id?: string;
    quantity?: number;
    reservedQuantity?: number;
    lowStockThreshold?: number;
    trackQuantity?: boolean;
    updatedAt?: Date | string;
  };

  export type ProductInventoryCreateOrConnectWithoutProductInput = {
    where: ProductInventoryWhereUniqueInput;
    create: XOR<
      ProductInventoryCreateWithoutProductInput,
      ProductInventoryUncheckedCreateWithoutProductInput
    >;
  };

  export type InventoryReservationCreateWithoutProductInput = {
    id?: string;
    quantity: number;
    customerId: string;
    orderId?: string | null;
    sessionId?: string | null;
    expiresAt: Date | string;
    createdAt?: Date | string;
  };

  export type InventoryReservationUncheckedCreateWithoutProductInput = {
    id?: string;
    quantity: number;
    customerId: string;
    orderId?: string | null;
    sessionId?: string | null;
    expiresAt: Date | string;
    createdAt?: Date | string;
  };

  export type InventoryReservationCreateOrConnectWithoutProductInput = {
    where: InventoryReservationWhereUniqueInput;
    create: XOR<
      InventoryReservationCreateWithoutProductInput,
      InventoryReservationUncheckedCreateWithoutProductInput
    >;
  };

  export type InventoryReservationCreateManyProductInputEnvelope = {
    data:
      | InventoryReservationCreateManyProductInput
      | InventoryReservationCreateManyProductInput[];
    skipDuplicates?: boolean;
  };

  export type OrderItemCreateWithoutProductInput = {
    id?: string;
    quantity: number;
    price: number;
    createdAt?: Date | string;
    order?: OrderCreateNestedOneWithoutItemsInput;
    vendorOrder?: VendorOrderCreateNestedOneWithoutItemsInput;
  };

  export type OrderItemUncheckedCreateWithoutProductInput = {
    id?: string;
    orderId?: string | null;
    vendorOrderId?: string | null;
    quantity: number;
    price: number;
    createdAt?: Date | string;
  };

  export type OrderItemCreateOrConnectWithoutProductInput = {
    where: OrderItemWhereUniqueInput;
    create: XOR<
      OrderItemCreateWithoutProductInput,
      OrderItemUncheckedCreateWithoutProductInput
    >;
  };

  export type OrderItemCreateManyProductInputEnvelope = {
    data: OrderItemCreateManyProductInput | OrderItemCreateManyProductInput[];
    skipDuplicates?: boolean;
  };

  export type ProductReviewCreateWithoutProductInput = {
    id?: string;
    customerId: string;
    rating: number;
    title?: string | null;
    review?: string | null;
    isVerified?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ProductReviewUncheckedCreateWithoutProductInput = {
    id?: string;
    customerId: string;
    rating: number;
    title?: string | null;
    review?: string | null;
    isVerified?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ProductReviewCreateOrConnectWithoutProductInput = {
    where: ProductReviewWhereUniqueInput;
    create: XOR<
      ProductReviewCreateWithoutProductInput,
      ProductReviewUncheckedCreateWithoutProductInput
    >;
  };

  export type ProductReviewCreateManyProductInputEnvelope = {
    data:
      | ProductReviewCreateManyProductInput
      | ProductReviewCreateManyProductInput[];
    skipDuplicates?: boolean;
  };

  export type CartItemCreateWithoutProductInput = {
    id?: string;
    quantity: number;
    price: number;
    addedAt?: Date | string;
    cart: ShoppingCartCreateNestedOneWithoutItemsInput;
  };

  export type CartItemUncheckedCreateWithoutProductInput = {
    id?: string;
    cartId: string;
    quantity: number;
    price: number;
    addedAt?: Date | string;
  };

  export type CartItemCreateOrConnectWithoutProductInput = {
    where: CartItemWhereUniqueInput;
    create: XOR<
      CartItemCreateWithoutProductInput,
      CartItemUncheckedCreateWithoutProductInput
    >;
  };

  export type CartItemCreateManyProductInputEnvelope = {
    data: CartItemCreateManyProductInput | CartItemCreateManyProductInput[];
    skipDuplicates?: boolean;
  };

  export type WishlistItemCreateWithoutProductInput = {
    id?: string;
    addedAt?: Date | string;
    wishlist: WishlistCreateNestedOneWithoutItemsInput;
  };

  export type WishlistItemUncheckedCreateWithoutProductInput = {
    id?: string;
    wishlistId: string;
    addedAt?: Date | string;
  };

  export type WishlistItemCreateOrConnectWithoutProductInput = {
    where: WishlistItemWhereUniqueInput;
    create: XOR<
      WishlistItemCreateWithoutProductInput,
      WishlistItemUncheckedCreateWithoutProductInput
    >;
  };

  export type WishlistItemCreateManyProductInputEnvelope = {
    data:
      | WishlistItemCreateManyProductInput
      | WishlistItemCreateManyProductInput[];
    skipDuplicates?: boolean;
  };

  export type VendorUpsertWithoutProductsInput = {
    update: XOR<
      VendorUpdateWithoutProductsInput,
      VendorUncheckedUpdateWithoutProductsInput
    >;
    create: XOR<
      VendorCreateWithoutProductsInput,
      VendorUncheckedCreateWithoutProductsInput
    >;
    where?: VendorWhereInput;
  };

  export type VendorUpdateToOneWithWhereWithoutProductsInput = {
    where?: VendorWhereInput;
    data: XOR<
      VendorUpdateWithoutProductsInput,
      VendorUncheckedUpdateWithoutProductsInput
    >;
  };

  export type VendorUpdateWithoutProductsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    phone?: NullableStringFieldUpdateOperationsInput | string | null;
    address?: NullableJsonNullValueInput | InputJsonValue;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isVerified?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    analytics?: VendorAnalyticsUpdateManyWithoutVendorNestedInput;
  };

  export type VendorUncheckedUpdateWithoutProductsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    phone?: NullableStringFieldUpdateOperationsInput | string | null;
    address?: NullableJsonNullValueInput | InputJsonValue;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isVerified?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    analytics?: VendorAnalyticsUncheckedUpdateManyWithoutVendorNestedInput;
  };

  export type ProductInventoryUpsertWithoutProductInput = {
    update: XOR<
      ProductInventoryUpdateWithoutProductInput,
      ProductInventoryUncheckedUpdateWithoutProductInput
    >;
    create: XOR<
      ProductInventoryCreateWithoutProductInput,
      ProductInventoryUncheckedCreateWithoutProductInput
    >;
    where?: ProductInventoryWhereInput;
  };

  export type ProductInventoryUpdateToOneWithWhereWithoutProductInput = {
    where?: ProductInventoryWhereInput;
    data: XOR<
      ProductInventoryUpdateWithoutProductInput,
      ProductInventoryUncheckedUpdateWithoutProductInput
    >;
  };

  export type ProductInventoryUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    reservedQuantity?: IntFieldUpdateOperationsInput | number;
    lowStockThreshold?: IntFieldUpdateOperationsInput | number;
    trackQuantity?: BoolFieldUpdateOperationsInput | boolean;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProductInventoryUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    reservedQuantity?: IntFieldUpdateOperationsInput | number;
    lowStockThreshold?: IntFieldUpdateOperationsInput | number;
    trackQuantity?: BoolFieldUpdateOperationsInput | boolean;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type InventoryReservationUpsertWithWhereUniqueWithoutProductInput = {
    where: InventoryReservationWhereUniqueInput;
    update: XOR<
      InventoryReservationUpdateWithoutProductInput,
      InventoryReservationUncheckedUpdateWithoutProductInput
    >;
    create: XOR<
      InventoryReservationCreateWithoutProductInput,
      InventoryReservationUncheckedCreateWithoutProductInput
    >;
  };

  export type InventoryReservationUpdateWithWhereUniqueWithoutProductInput = {
    where: InventoryReservationWhereUniqueInput;
    data: XOR<
      InventoryReservationUpdateWithoutProductInput,
      InventoryReservationUncheckedUpdateWithoutProductInput
    >;
  };

  export type InventoryReservationUpdateManyWithWhereWithoutProductInput = {
    where: InventoryReservationScalarWhereInput;
    data: XOR<
      InventoryReservationUpdateManyMutationInput,
      InventoryReservationUncheckedUpdateManyWithoutProductInput
    >;
  };

  export type InventoryReservationScalarWhereInput = {
    AND?:
      | InventoryReservationScalarWhereInput
      | InventoryReservationScalarWhereInput[];
    OR?: InventoryReservationScalarWhereInput[];
    NOT?:
      | InventoryReservationScalarWhereInput
      | InventoryReservationScalarWhereInput[];
    id?: StringFilter<'InventoryReservation'> | string;
    productId?: StringFilter<'InventoryReservation'> | string;
    quantity?: IntFilter<'InventoryReservation'> | number;
    customerId?: StringFilter<'InventoryReservation'> | string;
    orderId?: StringNullableFilter<'InventoryReservation'> | string | null;
    sessionId?: StringNullableFilter<'InventoryReservation'> | string | null;
    expiresAt?: DateTimeFilter<'InventoryReservation'> | Date | string;
    createdAt?: DateTimeFilter<'InventoryReservation'> | Date | string;
  };

  export type OrderItemUpsertWithWhereUniqueWithoutProductInput = {
    where: OrderItemWhereUniqueInput;
    update: XOR<
      OrderItemUpdateWithoutProductInput,
      OrderItemUncheckedUpdateWithoutProductInput
    >;
    create: XOR<
      OrderItemCreateWithoutProductInput,
      OrderItemUncheckedCreateWithoutProductInput
    >;
  };

  export type OrderItemUpdateWithWhereUniqueWithoutProductInput = {
    where: OrderItemWhereUniqueInput;
    data: XOR<
      OrderItemUpdateWithoutProductInput,
      OrderItemUncheckedUpdateWithoutProductInput
    >;
  };

  export type OrderItemUpdateManyWithWhereWithoutProductInput = {
    where: OrderItemScalarWhereInput;
    data: XOR<
      OrderItemUpdateManyMutationInput,
      OrderItemUncheckedUpdateManyWithoutProductInput
    >;
  };

  export type OrderItemScalarWhereInput = {
    AND?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[];
    OR?: OrderItemScalarWhereInput[];
    NOT?: OrderItemScalarWhereInput | OrderItemScalarWhereInput[];
    id?: StringFilter<'OrderItem'> | string;
    orderId?: StringNullableFilter<'OrderItem'> | string | null;
    vendorOrderId?: StringNullableFilter<'OrderItem'> | string | null;
    productId?: StringFilter<'OrderItem'> | string;
    quantity?: IntFilter<'OrderItem'> | number;
    price?: FloatFilter<'OrderItem'> | number;
    createdAt?: DateTimeFilter<'OrderItem'> | Date | string;
  };

  export type ProductReviewUpsertWithWhereUniqueWithoutProductInput = {
    where: ProductReviewWhereUniqueInput;
    update: XOR<
      ProductReviewUpdateWithoutProductInput,
      ProductReviewUncheckedUpdateWithoutProductInput
    >;
    create: XOR<
      ProductReviewCreateWithoutProductInput,
      ProductReviewUncheckedCreateWithoutProductInput
    >;
  };

  export type ProductReviewUpdateWithWhereUniqueWithoutProductInput = {
    where: ProductReviewWhereUniqueInput;
    data: XOR<
      ProductReviewUpdateWithoutProductInput,
      ProductReviewUncheckedUpdateWithoutProductInput
    >;
  };

  export type ProductReviewUpdateManyWithWhereWithoutProductInput = {
    where: ProductReviewScalarWhereInput;
    data: XOR<
      ProductReviewUpdateManyMutationInput,
      ProductReviewUncheckedUpdateManyWithoutProductInput
    >;
  };

  export type ProductReviewScalarWhereInput = {
    AND?: ProductReviewScalarWhereInput | ProductReviewScalarWhereInput[];
    OR?: ProductReviewScalarWhereInput[];
    NOT?: ProductReviewScalarWhereInput | ProductReviewScalarWhereInput[];
    id?: StringFilter<'ProductReview'> | string;
    productId?: StringFilter<'ProductReview'> | string;
    customerId?: StringFilter<'ProductReview'> | string;
    rating?: IntFilter<'ProductReview'> | number;
    title?: StringNullableFilter<'ProductReview'> | string | null;
    review?: StringNullableFilter<'ProductReview'> | string | null;
    isVerified?: BoolFilter<'ProductReview'> | boolean;
    isActive?: BoolFilter<'ProductReview'> | boolean;
    createdAt?: DateTimeFilter<'ProductReview'> | Date | string;
    updatedAt?: DateTimeFilter<'ProductReview'> | Date | string;
  };

  export type CartItemUpsertWithWhereUniqueWithoutProductInput = {
    where: CartItemWhereUniqueInput;
    update: XOR<
      CartItemUpdateWithoutProductInput,
      CartItemUncheckedUpdateWithoutProductInput
    >;
    create: XOR<
      CartItemCreateWithoutProductInput,
      CartItemUncheckedCreateWithoutProductInput
    >;
  };

  export type CartItemUpdateWithWhereUniqueWithoutProductInput = {
    where: CartItemWhereUniqueInput;
    data: XOR<
      CartItemUpdateWithoutProductInput,
      CartItemUncheckedUpdateWithoutProductInput
    >;
  };

  export type CartItemUpdateManyWithWhereWithoutProductInput = {
    where: CartItemScalarWhereInput;
    data: XOR<
      CartItemUpdateManyMutationInput,
      CartItemUncheckedUpdateManyWithoutProductInput
    >;
  };

  export type CartItemScalarWhereInput = {
    AND?: CartItemScalarWhereInput | CartItemScalarWhereInput[];
    OR?: CartItemScalarWhereInput[];
    NOT?: CartItemScalarWhereInput | CartItemScalarWhereInput[];
    id?: StringFilter<'CartItem'> | string;
    cartId?: StringFilter<'CartItem'> | string;
    productId?: StringFilter<'CartItem'> | string;
    quantity?: IntFilter<'CartItem'> | number;
    price?: FloatFilter<'CartItem'> | number;
    addedAt?: DateTimeFilter<'CartItem'> | Date | string;
  };

  export type WishlistItemUpsertWithWhereUniqueWithoutProductInput = {
    where: WishlistItemWhereUniqueInput;
    update: XOR<
      WishlistItemUpdateWithoutProductInput,
      WishlistItemUncheckedUpdateWithoutProductInput
    >;
    create: XOR<
      WishlistItemCreateWithoutProductInput,
      WishlistItemUncheckedCreateWithoutProductInput
    >;
  };

  export type WishlistItemUpdateWithWhereUniqueWithoutProductInput = {
    where: WishlistItemWhereUniqueInput;
    data: XOR<
      WishlistItemUpdateWithoutProductInput,
      WishlistItemUncheckedUpdateWithoutProductInput
    >;
  };

  export type WishlistItemUpdateManyWithWhereWithoutProductInput = {
    where: WishlistItemScalarWhereInput;
    data: XOR<
      WishlistItemUpdateManyMutationInput,
      WishlistItemUncheckedUpdateManyWithoutProductInput
    >;
  };

  export type WishlistItemScalarWhereInput = {
    AND?: WishlistItemScalarWhereInput | WishlistItemScalarWhereInput[];
    OR?: WishlistItemScalarWhereInput[];
    NOT?: WishlistItemScalarWhereInput | WishlistItemScalarWhereInput[];
    id?: StringFilter<'WishlistItem'> | string;
    wishlistId?: StringFilter<'WishlistItem'> | string;
    productId?: StringFilter<'WishlistItem'> | string;
    addedAt?: DateTimeFilter<'WishlistItem'> | Date | string;
  };

  export type ProductCreateWithoutInventoryInput = {
    id?: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    sku?: string | null;
    category: string;
    subcategory?: string | null;
    brand?: string | null;
    images?: ProductCreateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    isActive?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor: VendorCreateNestedOneWithoutProductsInput;
    reservations?: InventoryReservationCreateNestedManyWithoutProductInput;
    orderItems?: OrderItemCreateNestedManyWithoutProductInput;
    reviews?: ProductReviewCreateNestedManyWithoutProductInput;
    cartItems?: CartItemCreateNestedManyWithoutProductInput;
    wishlistItems?: WishlistItemCreateNestedManyWithoutProductInput;
  };

  export type ProductUncheckedCreateWithoutInventoryInput = {
    id?: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    sku?: string | null;
    category: string;
    subcategory?: string | null;
    brand?: string | null;
    images?: ProductCreateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    vendorId: string;
    isActive?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    reservations?: InventoryReservationUncheckedCreateNestedManyWithoutProductInput;
    orderItems?: OrderItemUncheckedCreateNestedManyWithoutProductInput;
    reviews?: ProductReviewUncheckedCreateNestedManyWithoutProductInput;
    cartItems?: CartItemUncheckedCreateNestedManyWithoutProductInput;
    wishlistItems?: WishlistItemUncheckedCreateNestedManyWithoutProductInput;
  };

  export type ProductCreateOrConnectWithoutInventoryInput = {
    where: ProductWhereUniqueInput;
    create: XOR<
      ProductCreateWithoutInventoryInput,
      ProductUncheckedCreateWithoutInventoryInput
    >;
  };

  export type ProductUpsertWithoutInventoryInput = {
    update: XOR<
      ProductUpdateWithoutInventoryInput,
      ProductUncheckedUpdateWithoutInventoryInput
    >;
    create: XOR<
      ProductCreateWithoutInventoryInput,
      ProductUncheckedCreateWithoutInventoryInput
    >;
    where?: ProductWhereInput;
  };

  export type ProductUpdateToOneWithWhereWithoutInventoryInput = {
    where?: ProductWhereInput;
    data: XOR<
      ProductUpdateWithoutInventoryInput,
      ProductUncheckedUpdateWithoutInventoryInput
    >;
  };

  export type ProductUpdateWithoutInventoryInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    comparePrice?: NullableFloatFieldUpdateOperationsInput | number | null;
    sku?: NullableStringFieldUpdateOperationsInput | string | null;
    category?: StringFieldUpdateOperationsInput | string;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    brand?: NullableStringFieldUpdateOperationsInput | string | null;
    images?: ProductUpdateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: VendorUpdateOneRequiredWithoutProductsNestedInput;
    reservations?: InventoryReservationUpdateManyWithoutProductNestedInput;
    orderItems?: OrderItemUpdateManyWithoutProductNestedInput;
    reviews?: ProductReviewUpdateManyWithoutProductNestedInput;
    cartItems?: CartItemUpdateManyWithoutProductNestedInput;
    wishlistItems?: WishlistItemUpdateManyWithoutProductNestedInput;
  };

  export type ProductUncheckedUpdateWithoutInventoryInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    comparePrice?: NullableFloatFieldUpdateOperationsInput | number | null;
    sku?: NullableStringFieldUpdateOperationsInput | string | null;
    category?: StringFieldUpdateOperationsInput | string;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    brand?: NullableStringFieldUpdateOperationsInput | string | null;
    images?: ProductUpdateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    vendorId?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    reservations?: InventoryReservationUncheckedUpdateManyWithoutProductNestedInput;
    orderItems?: OrderItemUncheckedUpdateManyWithoutProductNestedInput;
    reviews?: ProductReviewUncheckedUpdateManyWithoutProductNestedInput;
    cartItems?: CartItemUncheckedUpdateManyWithoutProductNestedInput;
    wishlistItems?: WishlistItemUncheckedUpdateManyWithoutProductNestedInput;
  };

  export type ProductCreateWithoutReservationsInput = {
    id?: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    sku?: string | null;
    category: string;
    subcategory?: string | null;
    brand?: string | null;
    images?: ProductCreateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    isActive?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor: VendorCreateNestedOneWithoutProductsInput;
    inventory?: ProductInventoryCreateNestedOneWithoutProductInput;
    orderItems?: OrderItemCreateNestedManyWithoutProductInput;
    reviews?: ProductReviewCreateNestedManyWithoutProductInput;
    cartItems?: CartItemCreateNestedManyWithoutProductInput;
    wishlistItems?: WishlistItemCreateNestedManyWithoutProductInput;
  };

  export type ProductUncheckedCreateWithoutReservationsInput = {
    id?: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    sku?: string | null;
    category: string;
    subcategory?: string | null;
    brand?: string | null;
    images?: ProductCreateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    vendorId: string;
    isActive?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inventory?: ProductInventoryUncheckedCreateNestedOneWithoutProductInput;
    orderItems?: OrderItemUncheckedCreateNestedManyWithoutProductInput;
    reviews?: ProductReviewUncheckedCreateNestedManyWithoutProductInput;
    cartItems?: CartItemUncheckedCreateNestedManyWithoutProductInput;
    wishlistItems?: WishlistItemUncheckedCreateNestedManyWithoutProductInput;
  };

  export type ProductCreateOrConnectWithoutReservationsInput = {
    where: ProductWhereUniqueInput;
    create: XOR<
      ProductCreateWithoutReservationsInput,
      ProductUncheckedCreateWithoutReservationsInput
    >;
  };

  export type ProductUpsertWithoutReservationsInput = {
    update: XOR<
      ProductUpdateWithoutReservationsInput,
      ProductUncheckedUpdateWithoutReservationsInput
    >;
    create: XOR<
      ProductCreateWithoutReservationsInput,
      ProductUncheckedCreateWithoutReservationsInput
    >;
    where?: ProductWhereInput;
  };

  export type ProductUpdateToOneWithWhereWithoutReservationsInput = {
    where?: ProductWhereInput;
    data: XOR<
      ProductUpdateWithoutReservationsInput,
      ProductUncheckedUpdateWithoutReservationsInput
    >;
  };

  export type ProductUpdateWithoutReservationsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    comparePrice?: NullableFloatFieldUpdateOperationsInput | number | null;
    sku?: NullableStringFieldUpdateOperationsInput | string | null;
    category?: StringFieldUpdateOperationsInput | string;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    brand?: NullableStringFieldUpdateOperationsInput | string | null;
    images?: ProductUpdateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: VendorUpdateOneRequiredWithoutProductsNestedInput;
    inventory?: ProductInventoryUpdateOneWithoutProductNestedInput;
    orderItems?: OrderItemUpdateManyWithoutProductNestedInput;
    reviews?: ProductReviewUpdateManyWithoutProductNestedInput;
    cartItems?: CartItemUpdateManyWithoutProductNestedInput;
    wishlistItems?: WishlistItemUpdateManyWithoutProductNestedInput;
  };

  export type ProductUncheckedUpdateWithoutReservationsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    comparePrice?: NullableFloatFieldUpdateOperationsInput | number | null;
    sku?: NullableStringFieldUpdateOperationsInput | string | null;
    category?: StringFieldUpdateOperationsInput | string;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    brand?: NullableStringFieldUpdateOperationsInput | string | null;
    images?: ProductUpdateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    vendorId?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    inventory?: ProductInventoryUncheckedUpdateOneWithoutProductNestedInput;
    orderItems?: OrderItemUncheckedUpdateManyWithoutProductNestedInput;
    reviews?: ProductReviewUncheckedUpdateManyWithoutProductNestedInput;
    cartItems?: CartItemUncheckedUpdateManyWithoutProductNestedInput;
    wishlistItems?: WishlistItemUncheckedUpdateManyWithoutProductNestedInput;
  };

  export type CategoryCreateWithoutChildrenInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    parent?: CategoryCreateNestedOneWithoutChildrenInput;
  };

  export type CategoryUncheckedCreateWithoutChildrenInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    parentId?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type CategoryCreateOrConnectWithoutChildrenInput = {
    where: CategoryWhereUniqueInput;
    create: XOR<
      CategoryCreateWithoutChildrenInput,
      CategoryUncheckedCreateWithoutChildrenInput
    >;
  };

  export type CategoryCreateWithoutParentInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    children?: CategoryCreateNestedManyWithoutParentInput;
  };

  export type CategoryUncheckedCreateWithoutParentInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    children?: CategoryUncheckedCreateNestedManyWithoutParentInput;
  };

  export type CategoryCreateOrConnectWithoutParentInput = {
    where: CategoryWhereUniqueInput;
    create: XOR<
      CategoryCreateWithoutParentInput,
      CategoryUncheckedCreateWithoutParentInput
    >;
  };

  export type CategoryCreateManyParentInputEnvelope = {
    data: CategoryCreateManyParentInput | CategoryCreateManyParentInput[];
    skipDuplicates?: boolean;
  };

  export type CategoryUpsertWithoutChildrenInput = {
    update: XOR<
      CategoryUpdateWithoutChildrenInput,
      CategoryUncheckedUpdateWithoutChildrenInput
    >;
    create: XOR<
      CategoryCreateWithoutChildrenInput,
      CategoryUncheckedCreateWithoutChildrenInput
    >;
    where?: CategoryWhereInput;
  };

  export type CategoryUpdateToOneWithWhereWithoutChildrenInput = {
    where?: CategoryWhereInput;
    data: XOR<
      CategoryUpdateWithoutChildrenInput,
      CategoryUncheckedUpdateWithoutChildrenInput
    >;
  };

  export type CategoryUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    parent?: CategoryUpdateOneWithoutChildrenNestedInput;
  };

  export type CategoryUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    parentId?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CategoryUpsertWithWhereUniqueWithoutParentInput = {
    where: CategoryWhereUniqueInput;
    update: XOR<
      CategoryUpdateWithoutParentInput,
      CategoryUncheckedUpdateWithoutParentInput
    >;
    create: XOR<
      CategoryCreateWithoutParentInput,
      CategoryUncheckedCreateWithoutParentInput
    >;
  };

  export type CategoryUpdateWithWhereUniqueWithoutParentInput = {
    where: CategoryWhereUniqueInput;
    data: XOR<
      CategoryUpdateWithoutParentInput,
      CategoryUncheckedUpdateWithoutParentInput
    >;
  };

  export type CategoryUpdateManyWithWhereWithoutParentInput = {
    where: CategoryScalarWhereInput;
    data: XOR<
      CategoryUpdateManyMutationInput,
      CategoryUncheckedUpdateManyWithoutParentInput
    >;
  };

  export type CategoryScalarWhereInput = {
    AND?: CategoryScalarWhereInput | CategoryScalarWhereInput[];
    OR?: CategoryScalarWhereInput[];
    NOT?: CategoryScalarWhereInput | CategoryScalarWhereInput[];
    id?: StringFilter<'Category'> | string;
    name?: StringFilter<'Category'> | string;
    slug?: StringFilter<'Category'> | string;
    description?: StringNullableFilter<'Category'> | string | null;
    parentId?: StringNullableFilter<'Category'> | string | null;
    isActive?: BoolFilter<'Category'> | boolean;
    createdAt?: DateTimeFilter<'Category'> | Date | string;
    updatedAt?: DateTimeFilter<'Category'> | Date | string;
  };

  export type CartItemCreateWithoutCartInput = {
    id?: string;
    quantity: number;
    price: number;
    addedAt?: Date | string;
    product: ProductCreateNestedOneWithoutCartItemsInput;
  };

  export type CartItemUncheckedCreateWithoutCartInput = {
    id?: string;
    productId: string;
    quantity: number;
    price: number;
    addedAt?: Date | string;
  };

  export type CartItemCreateOrConnectWithoutCartInput = {
    where: CartItemWhereUniqueInput;
    create: XOR<
      CartItemCreateWithoutCartInput,
      CartItemUncheckedCreateWithoutCartInput
    >;
  };

  export type CartItemCreateManyCartInputEnvelope = {
    data: CartItemCreateManyCartInput | CartItemCreateManyCartInput[];
    skipDuplicates?: boolean;
  };

  export type CartItemUpsertWithWhereUniqueWithoutCartInput = {
    where: CartItemWhereUniqueInput;
    update: XOR<
      CartItemUpdateWithoutCartInput,
      CartItemUncheckedUpdateWithoutCartInput
    >;
    create: XOR<
      CartItemCreateWithoutCartInput,
      CartItemUncheckedCreateWithoutCartInput
    >;
  };

  export type CartItemUpdateWithWhereUniqueWithoutCartInput = {
    where: CartItemWhereUniqueInput;
    data: XOR<
      CartItemUpdateWithoutCartInput,
      CartItemUncheckedUpdateWithoutCartInput
    >;
  };

  export type CartItemUpdateManyWithWhereWithoutCartInput = {
    where: CartItemScalarWhereInput;
    data: XOR<
      CartItemUpdateManyMutationInput,
      CartItemUncheckedUpdateManyWithoutCartInput
    >;
  };

  export type ShoppingCartCreateWithoutItemsInput = {
    id?: string;
    customerId: string;
    updatedAt?: Date | string;
  };

  export type ShoppingCartUncheckedCreateWithoutItemsInput = {
    id?: string;
    customerId: string;
    updatedAt?: Date | string;
  };

  export type ShoppingCartCreateOrConnectWithoutItemsInput = {
    where: ShoppingCartWhereUniqueInput;
    create: XOR<
      ShoppingCartCreateWithoutItemsInput,
      ShoppingCartUncheckedCreateWithoutItemsInput
    >;
  };

  export type ProductCreateWithoutCartItemsInput = {
    id?: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    sku?: string | null;
    category: string;
    subcategory?: string | null;
    brand?: string | null;
    images?: ProductCreateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    isActive?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor: VendorCreateNestedOneWithoutProductsInput;
    inventory?: ProductInventoryCreateNestedOneWithoutProductInput;
    reservations?: InventoryReservationCreateNestedManyWithoutProductInput;
    orderItems?: OrderItemCreateNestedManyWithoutProductInput;
    reviews?: ProductReviewCreateNestedManyWithoutProductInput;
    wishlistItems?: WishlistItemCreateNestedManyWithoutProductInput;
  };

  export type ProductUncheckedCreateWithoutCartItemsInput = {
    id?: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    sku?: string | null;
    category: string;
    subcategory?: string | null;
    brand?: string | null;
    images?: ProductCreateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    vendorId: string;
    isActive?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inventory?: ProductInventoryUncheckedCreateNestedOneWithoutProductInput;
    reservations?: InventoryReservationUncheckedCreateNestedManyWithoutProductInput;
    orderItems?: OrderItemUncheckedCreateNestedManyWithoutProductInput;
    reviews?: ProductReviewUncheckedCreateNestedManyWithoutProductInput;
    wishlistItems?: WishlistItemUncheckedCreateNestedManyWithoutProductInput;
  };

  export type ProductCreateOrConnectWithoutCartItemsInput = {
    where: ProductWhereUniqueInput;
    create: XOR<
      ProductCreateWithoutCartItemsInput,
      ProductUncheckedCreateWithoutCartItemsInput
    >;
  };

  export type ShoppingCartUpsertWithoutItemsInput = {
    update: XOR<
      ShoppingCartUpdateWithoutItemsInput,
      ShoppingCartUncheckedUpdateWithoutItemsInput
    >;
    create: XOR<
      ShoppingCartCreateWithoutItemsInput,
      ShoppingCartUncheckedCreateWithoutItemsInput
    >;
    where?: ShoppingCartWhereInput;
  };

  export type ShoppingCartUpdateToOneWithWhereWithoutItemsInput = {
    where?: ShoppingCartWhereInput;
    data: XOR<
      ShoppingCartUpdateWithoutItemsInput,
      ShoppingCartUncheckedUpdateWithoutItemsInput
    >;
  };

  export type ShoppingCartUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ShoppingCartUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProductUpsertWithoutCartItemsInput = {
    update: XOR<
      ProductUpdateWithoutCartItemsInput,
      ProductUncheckedUpdateWithoutCartItemsInput
    >;
    create: XOR<
      ProductCreateWithoutCartItemsInput,
      ProductUncheckedCreateWithoutCartItemsInput
    >;
    where?: ProductWhereInput;
  };

  export type ProductUpdateToOneWithWhereWithoutCartItemsInput = {
    where?: ProductWhereInput;
    data: XOR<
      ProductUpdateWithoutCartItemsInput,
      ProductUncheckedUpdateWithoutCartItemsInput
    >;
  };

  export type ProductUpdateWithoutCartItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    comparePrice?: NullableFloatFieldUpdateOperationsInput | number | null;
    sku?: NullableStringFieldUpdateOperationsInput | string | null;
    category?: StringFieldUpdateOperationsInput | string;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    brand?: NullableStringFieldUpdateOperationsInput | string | null;
    images?: ProductUpdateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: VendorUpdateOneRequiredWithoutProductsNestedInput;
    inventory?: ProductInventoryUpdateOneWithoutProductNestedInput;
    reservations?: InventoryReservationUpdateManyWithoutProductNestedInput;
    orderItems?: OrderItemUpdateManyWithoutProductNestedInput;
    reviews?: ProductReviewUpdateManyWithoutProductNestedInput;
    wishlistItems?: WishlistItemUpdateManyWithoutProductNestedInput;
  };

  export type ProductUncheckedUpdateWithoutCartItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    comparePrice?: NullableFloatFieldUpdateOperationsInput | number | null;
    sku?: NullableStringFieldUpdateOperationsInput | string | null;
    category?: StringFieldUpdateOperationsInput | string;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    brand?: NullableStringFieldUpdateOperationsInput | string | null;
    images?: ProductUpdateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    vendorId?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    inventory?: ProductInventoryUncheckedUpdateOneWithoutProductNestedInput;
    reservations?: InventoryReservationUncheckedUpdateManyWithoutProductNestedInput;
    orderItems?: OrderItemUncheckedUpdateManyWithoutProductNestedInput;
    reviews?: ProductReviewUncheckedUpdateManyWithoutProductNestedInput;
    wishlistItems?: WishlistItemUncheckedUpdateManyWithoutProductNestedInput;
  };

  export type OrderItemCreateWithoutOrderInput = {
    id?: string;
    quantity: number;
    price: number;
    createdAt?: Date | string;
    vendorOrder?: VendorOrderCreateNestedOneWithoutItemsInput;
    product: ProductCreateNestedOneWithoutOrderItemsInput;
  };

  export type OrderItemUncheckedCreateWithoutOrderInput = {
    id?: string;
    vendorOrderId?: string | null;
    productId: string;
    quantity: number;
    price: number;
    createdAt?: Date | string;
  };

  export type OrderItemCreateOrConnectWithoutOrderInput = {
    where: OrderItemWhereUniqueInput;
    create: XOR<
      OrderItemCreateWithoutOrderInput,
      OrderItemUncheckedCreateWithoutOrderInput
    >;
  };

  export type OrderItemCreateManyOrderInputEnvelope = {
    data: OrderItemCreateManyOrderInput | OrderItemCreateManyOrderInput[];
    skipDuplicates?: boolean;
  };

  export type VendorOrderCreateWithoutOrderInput = {
    id?: string;
    vendorId: string;
    status?: $Enums.OrderStatus;
    subtotal: number;
    shipping: number;
    total: number;
    trackingNumber?: string | null;
    estimatedDelivery?: Date | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: OrderItemCreateNestedManyWithoutVendorOrderInput;
  };

  export type VendorOrderUncheckedCreateWithoutOrderInput = {
    id?: string;
    vendorId: string;
    status?: $Enums.OrderStatus;
    subtotal: number;
    shipping: number;
    total: number;
    trackingNumber?: string | null;
    estimatedDelivery?: Date | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: OrderItemUncheckedCreateNestedManyWithoutVendorOrderInput;
  };

  export type VendorOrderCreateOrConnectWithoutOrderInput = {
    where: VendorOrderWhereUniqueInput;
    create: XOR<
      VendorOrderCreateWithoutOrderInput,
      VendorOrderUncheckedCreateWithoutOrderInput
    >;
  };

  export type VendorOrderCreateManyOrderInputEnvelope = {
    data: VendorOrderCreateManyOrderInput | VendorOrderCreateManyOrderInput[];
    skipDuplicates?: boolean;
  };

  export type OrderItemUpsertWithWhereUniqueWithoutOrderInput = {
    where: OrderItemWhereUniqueInput;
    update: XOR<
      OrderItemUpdateWithoutOrderInput,
      OrderItemUncheckedUpdateWithoutOrderInput
    >;
    create: XOR<
      OrderItemCreateWithoutOrderInput,
      OrderItemUncheckedCreateWithoutOrderInput
    >;
  };

  export type OrderItemUpdateWithWhereUniqueWithoutOrderInput = {
    where: OrderItemWhereUniqueInput;
    data: XOR<
      OrderItemUpdateWithoutOrderInput,
      OrderItemUncheckedUpdateWithoutOrderInput
    >;
  };

  export type OrderItemUpdateManyWithWhereWithoutOrderInput = {
    where: OrderItemScalarWhereInput;
    data: XOR<
      OrderItemUpdateManyMutationInput,
      OrderItemUncheckedUpdateManyWithoutOrderInput
    >;
  };

  export type VendorOrderUpsertWithWhereUniqueWithoutOrderInput = {
    where: VendorOrderWhereUniqueInput;
    update: XOR<
      VendorOrderUpdateWithoutOrderInput,
      VendorOrderUncheckedUpdateWithoutOrderInput
    >;
    create: XOR<
      VendorOrderCreateWithoutOrderInput,
      VendorOrderUncheckedCreateWithoutOrderInput
    >;
  };

  export type VendorOrderUpdateWithWhereUniqueWithoutOrderInput = {
    where: VendorOrderWhereUniqueInput;
    data: XOR<
      VendorOrderUpdateWithoutOrderInput,
      VendorOrderUncheckedUpdateWithoutOrderInput
    >;
  };

  export type VendorOrderUpdateManyWithWhereWithoutOrderInput = {
    where: VendorOrderScalarWhereInput;
    data: XOR<
      VendorOrderUpdateManyMutationInput,
      VendorOrderUncheckedUpdateManyWithoutOrderInput
    >;
  };

  export type VendorOrderScalarWhereInput = {
    AND?: VendorOrderScalarWhereInput | VendorOrderScalarWhereInput[];
    OR?: VendorOrderScalarWhereInput[];
    NOT?: VendorOrderScalarWhereInput | VendorOrderScalarWhereInput[];
    id?: StringFilter<'VendorOrder'> | string;
    orderId?: StringFilter<'VendorOrder'> | string;
    vendorId?: StringFilter<'VendorOrder'> | string;
    status?: EnumOrderStatusFilter<'VendorOrder'> | $Enums.OrderStatus;
    subtotal?: FloatFilter<'VendorOrder'> | number;
    shipping?: FloatFilter<'VendorOrder'> | number;
    total?: FloatFilter<'VendorOrder'> | number;
    trackingNumber?: StringNullableFilter<'VendorOrder'> | string | null;
    estimatedDelivery?:
      | DateTimeNullableFilter<'VendorOrder'>
      | Date
      | string
      | null;
    notes?: StringNullableFilter<'VendorOrder'> | string | null;
    createdAt?: DateTimeFilter<'VendorOrder'> | Date | string;
    updatedAt?: DateTimeFilter<'VendorOrder'> | Date | string;
  };

  export type OrderCreateWithoutVendorOrdersInput = {
    id?: string;
    customerId: string;
    status?: $Enums.OrderStatus;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shippingAddress: JsonNullValueInput | InputJsonValue;
    paymentMethod: string;
    paymentStatus?: $Enums.PaymentStatus;
    paymentIntentId?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: OrderItemCreateNestedManyWithoutOrderInput;
  };

  export type OrderUncheckedCreateWithoutVendorOrdersInput = {
    id?: string;
    customerId: string;
    status?: $Enums.OrderStatus;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shippingAddress: JsonNullValueInput | InputJsonValue;
    paymentMethod: string;
    paymentStatus?: $Enums.PaymentStatus;
    paymentIntentId?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: OrderItemUncheckedCreateNestedManyWithoutOrderInput;
  };

  export type OrderCreateOrConnectWithoutVendorOrdersInput = {
    where: OrderWhereUniqueInput;
    create: XOR<
      OrderCreateWithoutVendorOrdersInput,
      OrderUncheckedCreateWithoutVendorOrdersInput
    >;
  };

  export type OrderItemCreateWithoutVendorOrderInput = {
    id?: string;
    quantity: number;
    price: number;
    createdAt?: Date | string;
    order?: OrderCreateNestedOneWithoutItemsInput;
    product: ProductCreateNestedOneWithoutOrderItemsInput;
  };

  export type OrderItemUncheckedCreateWithoutVendorOrderInput = {
    id?: string;
    orderId?: string | null;
    productId: string;
    quantity: number;
    price: number;
    createdAt?: Date | string;
  };

  export type OrderItemCreateOrConnectWithoutVendorOrderInput = {
    where: OrderItemWhereUniqueInput;
    create: XOR<
      OrderItemCreateWithoutVendorOrderInput,
      OrderItemUncheckedCreateWithoutVendorOrderInput
    >;
  };

  export type OrderItemCreateManyVendorOrderInputEnvelope = {
    data:
      | OrderItemCreateManyVendorOrderInput
      | OrderItemCreateManyVendorOrderInput[];
    skipDuplicates?: boolean;
  };

  export type OrderUpsertWithoutVendorOrdersInput = {
    update: XOR<
      OrderUpdateWithoutVendorOrdersInput,
      OrderUncheckedUpdateWithoutVendorOrdersInput
    >;
    create: XOR<
      OrderCreateWithoutVendorOrdersInput,
      OrderUncheckedCreateWithoutVendorOrdersInput
    >;
    where?: OrderWhereInput;
  };

  export type OrderUpdateToOneWithWhereWithoutVendorOrdersInput = {
    where?: OrderWhereInput;
    data: XOR<
      OrderUpdateWithoutVendorOrdersInput,
      OrderUncheckedUpdateWithoutVendorOrdersInput
    >;
  };

  export type OrderUpdateWithoutVendorOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotal?: FloatFieldUpdateOperationsInput | number;
    tax?: FloatFieldUpdateOperationsInput | number;
    shipping?: FloatFieldUpdateOperationsInput | number;
    total?: FloatFieldUpdateOperationsInput | number;
    shippingAddress?: JsonNullValueInput | InputJsonValue;
    paymentMethod?: StringFieldUpdateOperationsInput | string;
    paymentStatus?:
      | EnumPaymentStatusFieldUpdateOperationsInput
      | $Enums.PaymentStatus;
    paymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    items?: OrderItemUpdateManyWithoutOrderNestedInput;
  };

  export type OrderUncheckedUpdateWithoutVendorOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotal?: FloatFieldUpdateOperationsInput | number;
    tax?: FloatFieldUpdateOperationsInput | number;
    shipping?: FloatFieldUpdateOperationsInput | number;
    total?: FloatFieldUpdateOperationsInput | number;
    shippingAddress?: JsonNullValueInput | InputJsonValue;
    paymentMethod?: StringFieldUpdateOperationsInput | string;
    paymentStatus?:
      | EnumPaymentStatusFieldUpdateOperationsInput
      | $Enums.PaymentStatus;
    paymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    items?: OrderItemUncheckedUpdateManyWithoutOrderNestedInput;
  };

  export type OrderItemUpsertWithWhereUniqueWithoutVendorOrderInput = {
    where: OrderItemWhereUniqueInput;
    update: XOR<
      OrderItemUpdateWithoutVendorOrderInput,
      OrderItemUncheckedUpdateWithoutVendorOrderInput
    >;
    create: XOR<
      OrderItemCreateWithoutVendorOrderInput,
      OrderItemUncheckedCreateWithoutVendorOrderInput
    >;
  };

  export type OrderItemUpdateWithWhereUniqueWithoutVendorOrderInput = {
    where: OrderItemWhereUniqueInput;
    data: XOR<
      OrderItemUpdateWithoutVendorOrderInput,
      OrderItemUncheckedUpdateWithoutVendorOrderInput
    >;
  };

  export type OrderItemUpdateManyWithWhereWithoutVendorOrderInput = {
    where: OrderItemScalarWhereInput;
    data: XOR<
      OrderItemUpdateManyMutationInput,
      OrderItemUncheckedUpdateManyWithoutVendorOrderInput
    >;
  };

  export type OrderCreateWithoutItemsInput = {
    id?: string;
    customerId: string;
    status?: $Enums.OrderStatus;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shippingAddress: JsonNullValueInput | InputJsonValue;
    paymentMethod: string;
    paymentStatus?: $Enums.PaymentStatus;
    paymentIntentId?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendorOrders?: VendorOrderCreateNestedManyWithoutOrderInput;
  };

  export type OrderUncheckedCreateWithoutItemsInput = {
    id?: string;
    customerId: string;
    status?: $Enums.OrderStatus;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shippingAddress: JsonNullValueInput | InputJsonValue;
    paymentMethod: string;
    paymentStatus?: $Enums.PaymentStatus;
    paymentIntentId?: string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendorOrders?: VendorOrderUncheckedCreateNestedManyWithoutOrderInput;
  };

  export type OrderCreateOrConnectWithoutItemsInput = {
    where: OrderWhereUniqueInput;
    create: XOR<
      OrderCreateWithoutItemsInput,
      OrderUncheckedCreateWithoutItemsInput
    >;
  };

  export type VendorOrderCreateWithoutItemsInput = {
    id?: string;
    vendorId: string;
    status?: $Enums.OrderStatus;
    subtotal: number;
    shipping: number;
    total: number;
    trackingNumber?: string | null;
    estimatedDelivery?: Date | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    order: OrderCreateNestedOneWithoutVendorOrdersInput;
  };

  export type VendorOrderUncheckedCreateWithoutItemsInput = {
    id?: string;
    orderId: string;
    vendorId: string;
    status?: $Enums.OrderStatus;
    subtotal: number;
    shipping: number;
    total: number;
    trackingNumber?: string | null;
    estimatedDelivery?: Date | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type VendorOrderCreateOrConnectWithoutItemsInput = {
    where: VendorOrderWhereUniqueInput;
    create: XOR<
      VendorOrderCreateWithoutItemsInput,
      VendorOrderUncheckedCreateWithoutItemsInput
    >;
  };

  export type ProductCreateWithoutOrderItemsInput = {
    id?: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    sku?: string | null;
    category: string;
    subcategory?: string | null;
    brand?: string | null;
    images?: ProductCreateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    isActive?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor: VendorCreateNestedOneWithoutProductsInput;
    inventory?: ProductInventoryCreateNestedOneWithoutProductInput;
    reservations?: InventoryReservationCreateNestedManyWithoutProductInput;
    reviews?: ProductReviewCreateNestedManyWithoutProductInput;
    cartItems?: CartItemCreateNestedManyWithoutProductInput;
    wishlistItems?: WishlistItemCreateNestedManyWithoutProductInput;
  };

  export type ProductUncheckedCreateWithoutOrderItemsInput = {
    id?: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    sku?: string | null;
    category: string;
    subcategory?: string | null;
    brand?: string | null;
    images?: ProductCreateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    vendorId: string;
    isActive?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inventory?: ProductInventoryUncheckedCreateNestedOneWithoutProductInput;
    reservations?: InventoryReservationUncheckedCreateNestedManyWithoutProductInput;
    reviews?: ProductReviewUncheckedCreateNestedManyWithoutProductInput;
    cartItems?: CartItemUncheckedCreateNestedManyWithoutProductInput;
    wishlistItems?: WishlistItemUncheckedCreateNestedManyWithoutProductInput;
  };

  export type ProductCreateOrConnectWithoutOrderItemsInput = {
    where: ProductWhereUniqueInput;
    create: XOR<
      ProductCreateWithoutOrderItemsInput,
      ProductUncheckedCreateWithoutOrderItemsInput
    >;
  };

  export type OrderUpsertWithoutItemsInput = {
    update: XOR<
      OrderUpdateWithoutItemsInput,
      OrderUncheckedUpdateWithoutItemsInput
    >;
    create: XOR<
      OrderCreateWithoutItemsInput,
      OrderUncheckedCreateWithoutItemsInput
    >;
    where?: OrderWhereInput;
  };

  export type OrderUpdateToOneWithWhereWithoutItemsInput = {
    where?: OrderWhereInput;
    data: XOR<
      OrderUpdateWithoutItemsInput,
      OrderUncheckedUpdateWithoutItemsInput
    >;
  };

  export type OrderUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotal?: FloatFieldUpdateOperationsInput | number;
    tax?: FloatFieldUpdateOperationsInput | number;
    shipping?: FloatFieldUpdateOperationsInput | number;
    total?: FloatFieldUpdateOperationsInput | number;
    shippingAddress?: JsonNullValueInput | InputJsonValue;
    paymentMethod?: StringFieldUpdateOperationsInput | string;
    paymentStatus?:
      | EnumPaymentStatusFieldUpdateOperationsInput
      | $Enums.PaymentStatus;
    paymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    vendorOrders?: VendorOrderUpdateManyWithoutOrderNestedInput;
  };

  export type OrderUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotal?: FloatFieldUpdateOperationsInput | number;
    tax?: FloatFieldUpdateOperationsInput | number;
    shipping?: FloatFieldUpdateOperationsInput | number;
    total?: FloatFieldUpdateOperationsInput | number;
    shippingAddress?: JsonNullValueInput | InputJsonValue;
    paymentMethod?: StringFieldUpdateOperationsInput | string;
    paymentStatus?:
      | EnumPaymentStatusFieldUpdateOperationsInput
      | $Enums.PaymentStatus;
    paymentIntentId?: NullableStringFieldUpdateOperationsInput | string | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    vendorOrders?: VendorOrderUncheckedUpdateManyWithoutOrderNestedInput;
  };

  export type VendorOrderUpsertWithoutItemsInput = {
    update: XOR<
      VendorOrderUpdateWithoutItemsInput,
      VendorOrderUncheckedUpdateWithoutItemsInput
    >;
    create: XOR<
      VendorOrderCreateWithoutItemsInput,
      VendorOrderUncheckedCreateWithoutItemsInput
    >;
    where?: VendorOrderWhereInput;
  };

  export type VendorOrderUpdateToOneWithWhereWithoutItemsInput = {
    where?: VendorOrderWhereInput;
    data: XOR<
      VendorOrderUpdateWithoutItemsInput,
      VendorOrderUncheckedUpdateWithoutItemsInput
    >;
  };

  export type VendorOrderUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    vendorId?: StringFieldUpdateOperationsInput | string;
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotal?: FloatFieldUpdateOperationsInput | number;
    shipping?: FloatFieldUpdateOperationsInput | number;
    total?: FloatFieldUpdateOperationsInput | number;
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    estimatedDelivery?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    order?: OrderUpdateOneRequiredWithoutVendorOrdersNestedInput;
  };

  export type VendorOrderUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    orderId?: StringFieldUpdateOperationsInput | string;
    vendorId?: StringFieldUpdateOperationsInput | string;
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotal?: FloatFieldUpdateOperationsInput | number;
    shipping?: FloatFieldUpdateOperationsInput | number;
    total?: FloatFieldUpdateOperationsInput | number;
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    estimatedDelivery?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProductUpsertWithoutOrderItemsInput = {
    update: XOR<
      ProductUpdateWithoutOrderItemsInput,
      ProductUncheckedUpdateWithoutOrderItemsInput
    >;
    create: XOR<
      ProductCreateWithoutOrderItemsInput,
      ProductUncheckedCreateWithoutOrderItemsInput
    >;
    where?: ProductWhereInput;
  };

  export type ProductUpdateToOneWithWhereWithoutOrderItemsInput = {
    where?: ProductWhereInput;
    data: XOR<
      ProductUpdateWithoutOrderItemsInput,
      ProductUncheckedUpdateWithoutOrderItemsInput
    >;
  };

  export type ProductUpdateWithoutOrderItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    comparePrice?: NullableFloatFieldUpdateOperationsInput | number | null;
    sku?: NullableStringFieldUpdateOperationsInput | string | null;
    category?: StringFieldUpdateOperationsInput | string;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    brand?: NullableStringFieldUpdateOperationsInput | string | null;
    images?: ProductUpdateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: VendorUpdateOneRequiredWithoutProductsNestedInput;
    inventory?: ProductInventoryUpdateOneWithoutProductNestedInput;
    reservations?: InventoryReservationUpdateManyWithoutProductNestedInput;
    reviews?: ProductReviewUpdateManyWithoutProductNestedInput;
    cartItems?: CartItemUpdateManyWithoutProductNestedInput;
    wishlistItems?: WishlistItemUpdateManyWithoutProductNestedInput;
  };

  export type ProductUncheckedUpdateWithoutOrderItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    comparePrice?: NullableFloatFieldUpdateOperationsInput | number | null;
    sku?: NullableStringFieldUpdateOperationsInput | string | null;
    category?: StringFieldUpdateOperationsInput | string;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    brand?: NullableStringFieldUpdateOperationsInput | string | null;
    images?: ProductUpdateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    vendorId?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    inventory?: ProductInventoryUncheckedUpdateOneWithoutProductNestedInput;
    reservations?: InventoryReservationUncheckedUpdateManyWithoutProductNestedInput;
    reviews?: ProductReviewUncheckedUpdateManyWithoutProductNestedInput;
    cartItems?: CartItemUncheckedUpdateManyWithoutProductNestedInput;
    wishlistItems?: WishlistItemUncheckedUpdateManyWithoutProductNestedInput;
  };

  export type ProductCreateWithoutReviewsInput = {
    id?: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    sku?: string | null;
    category: string;
    subcategory?: string | null;
    brand?: string | null;
    images?: ProductCreateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    isActive?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor: VendorCreateNestedOneWithoutProductsInput;
    inventory?: ProductInventoryCreateNestedOneWithoutProductInput;
    reservations?: InventoryReservationCreateNestedManyWithoutProductInput;
    orderItems?: OrderItemCreateNestedManyWithoutProductInput;
    cartItems?: CartItemCreateNestedManyWithoutProductInput;
    wishlistItems?: WishlistItemCreateNestedManyWithoutProductInput;
  };

  export type ProductUncheckedCreateWithoutReviewsInput = {
    id?: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    sku?: string | null;
    category: string;
    subcategory?: string | null;
    brand?: string | null;
    images?: ProductCreateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    vendorId: string;
    isActive?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inventory?: ProductInventoryUncheckedCreateNestedOneWithoutProductInput;
    reservations?: InventoryReservationUncheckedCreateNestedManyWithoutProductInput;
    orderItems?: OrderItemUncheckedCreateNestedManyWithoutProductInput;
    cartItems?: CartItemUncheckedCreateNestedManyWithoutProductInput;
    wishlistItems?: WishlistItemUncheckedCreateNestedManyWithoutProductInput;
  };

  export type ProductCreateOrConnectWithoutReviewsInput = {
    where: ProductWhereUniqueInput;
    create: XOR<
      ProductCreateWithoutReviewsInput,
      ProductUncheckedCreateWithoutReviewsInput
    >;
  };

  export type ProductUpsertWithoutReviewsInput = {
    update: XOR<
      ProductUpdateWithoutReviewsInput,
      ProductUncheckedUpdateWithoutReviewsInput
    >;
    create: XOR<
      ProductCreateWithoutReviewsInput,
      ProductUncheckedCreateWithoutReviewsInput
    >;
    where?: ProductWhereInput;
  };

  export type ProductUpdateToOneWithWhereWithoutReviewsInput = {
    where?: ProductWhereInput;
    data: XOR<
      ProductUpdateWithoutReviewsInput,
      ProductUncheckedUpdateWithoutReviewsInput
    >;
  };

  export type ProductUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    comparePrice?: NullableFloatFieldUpdateOperationsInput | number | null;
    sku?: NullableStringFieldUpdateOperationsInput | string | null;
    category?: StringFieldUpdateOperationsInput | string;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    brand?: NullableStringFieldUpdateOperationsInput | string | null;
    images?: ProductUpdateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: VendorUpdateOneRequiredWithoutProductsNestedInput;
    inventory?: ProductInventoryUpdateOneWithoutProductNestedInput;
    reservations?: InventoryReservationUpdateManyWithoutProductNestedInput;
    orderItems?: OrderItemUpdateManyWithoutProductNestedInput;
    cartItems?: CartItemUpdateManyWithoutProductNestedInput;
    wishlistItems?: WishlistItemUpdateManyWithoutProductNestedInput;
  };

  export type ProductUncheckedUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    comparePrice?: NullableFloatFieldUpdateOperationsInput | number | null;
    sku?: NullableStringFieldUpdateOperationsInput | string | null;
    category?: StringFieldUpdateOperationsInput | string;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    brand?: NullableStringFieldUpdateOperationsInput | string | null;
    images?: ProductUpdateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    vendorId?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    inventory?: ProductInventoryUncheckedUpdateOneWithoutProductNestedInput;
    reservations?: InventoryReservationUncheckedUpdateManyWithoutProductNestedInput;
    orderItems?: OrderItemUncheckedUpdateManyWithoutProductNestedInput;
    cartItems?: CartItemUncheckedUpdateManyWithoutProductNestedInput;
    wishlistItems?: WishlistItemUncheckedUpdateManyWithoutProductNestedInput;
  };

  export type WishlistItemCreateWithoutWishlistInput = {
    id?: string;
    addedAt?: Date | string;
    product: ProductCreateNestedOneWithoutWishlistItemsInput;
  };

  export type WishlistItemUncheckedCreateWithoutWishlistInput = {
    id?: string;
    productId: string;
    addedAt?: Date | string;
  };

  export type WishlistItemCreateOrConnectWithoutWishlistInput = {
    where: WishlistItemWhereUniqueInput;
    create: XOR<
      WishlistItemCreateWithoutWishlistInput,
      WishlistItemUncheckedCreateWithoutWishlistInput
    >;
  };

  export type WishlistItemCreateManyWishlistInputEnvelope = {
    data:
      | WishlistItemCreateManyWishlistInput
      | WishlistItemCreateManyWishlistInput[];
    skipDuplicates?: boolean;
  };

  export type WishlistItemUpsertWithWhereUniqueWithoutWishlistInput = {
    where: WishlistItemWhereUniqueInput;
    update: XOR<
      WishlistItemUpdateWithoutWishlistInput,
      WishlistItemUncheckedUpdateWithoutWishlistInput
    >;
    create: XOR<
      WishlistItemCreateWithoutWishlistInput,
      WishlistItemUncheckedCreateWithoutWishlistInput
    >;
  };

  export type WishlistItemUpdateWithWhereUniqueWithoutWishlistInput = {
    where: WishlistItemWhereUniqueInput;
    data: XOR<
      WishlistItemUpdateWithoutWishlistInput,
      WishlistItemUncheckedUpdateWithoutWishlistInput
    >;
  };

  export type WishlistItemUpdateManyWithWhereWithoutWishlistInput = {
    where: WishlistItemScalarWhereInput;
    data: XOR<
      WishlistItemUpdateManyMutationInput,
      WishlistItemUncheckedUpdateManyWithoutWishlistInput
    >;
  };

  export type WishlistCreateWithoutItemsInput = {
    id?: string;
    customerId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type WishlistUncheckedCreateWithoutItemsInput = {
    id?: string;
    customerId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type WishlistCreateOrConnectWithoutItemsInput = {
    where: WishlistWhereUniqueInput;
    create: XOR<
      WishlistCreateWithoutItemsInput,
      WishlistUncheckedCreateWithoutItemsInput
    >;
  };

  export type ProductCreateWithoutWishlistItemsInput = {
    id?: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    sku?: string | null;
    category: string;
    subcategory?: string | null;
    brand?: string | null;
    images?: ProductCreateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    isActive?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    vendor: VendorCreateNestedOneWithoutProductsInput;
    inventory?: ProductInventoryCreateNestedOneWithoutProductInput;
    reservations?: InventoryReservationCreateNestedManyWithoutProductInput;
    orderItems?: OrderItemCreateNestedManyWithoutProductInput;
    reviews?: ProductReviewCreateNestedManyWithoutProductInput;
    cartItems?: CartItemCreateNestedManyWithoutProductInput;
  };

  export type ProductUncheckedCreateWithoutWishlistItemsInput = {
    id?: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    sku?: string | null;
    category: string;
    subcategory?: string | null;
    brand?: string | null;
    images?: ProductCreateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    vendorId: string;
    isActive?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inventory?: ProductInventoryUncheckedCreateNestedOneWithoutProductInput;
    reservations?: InventoryReservationUncheckedCreateNestedManyWithoutProductInput;
    orderItems?: OrderItemUncheckedCreateNestedManyWithoutProductInput;
    reviews?: ProductReviewUncheckedCreateNestedManyWithoutProductInput;
    cartItems?: CartItemUncheckedCreateNestedManyWithoutProductInput;
  };

  export type ProductCreateOrConnectWithoutWishlistItemsInput = {
    where: ProductWhereUniqueInput;
    create: XOR<
      ProductCreateWithoutWishlistItemsInput,
      ProductUncheckedCreateWithoutWishlistItemsInput
    >;
  };

  export type WishlistUpsertWithoutItemsInput = {
    update: XOR<
      WishlistUpdateWithoutItemsInput,
      WishlistUncheckedUpdateWithoutItemsInput
    >;
    create: XOR<
      WishlistCreateWithoutItemsInput,
      WishlistUncheckedCreateWithoutItemsInput
    >;
    where?: WishlistWhereInput;
  };

  export type WishlistUpdateToOneWithWhereWithoutItemsInput = {
    where?: WishlistWhereInput;
    data: XOR<
      WishlistUpdateWithoutItemsInput,
      WishlistUncheckedUpdateWithoutItemsInput
    >;
  };

  export type WishlistUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type WishlistUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProductUpsertWithoutWishlistItemsInput = {
    update: XOR<
      ProductUpdateWithoutWishlistItemsInput,
      ProductUncheckedUpdateWithoutWishlistItemsInput
    >;
    create: XOR<
      ProductCreateWithoutWishlistItemsInput,
      ProductUncheckedCreateWithoutWishlistItemsInput
    >;
    where?: ProductWhereInput;
  };

  export type ProductUpdateToOneWithWhereWithoutWishlistItemsInput = {
    where?: ProductWhereInput;
    data: XOR<
      ProductUpdateWithoutWishlistItemsInput,
      ProductUncheckedUpdateWithoutWishlistItemsInput
    >;
  };

  export type ProductUpdateWithoutWishlistItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    comparePrice?: NullableFloatFieldUpdateOperationsInput | number | null;
    sku?: NullableStringFieldUpdateOperationsInput | string | null;
    category?: StringFieldUpdateOperationsInput | string;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    brand?: NullableStringFieldUpdateOperationsInput | string | null;
    images?: ProductUpdateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    vendor?: VendorUpdateOneRequiredWithoutProductsNestedInput;
    inventory?: ProductInventoryUpdateOneWithoutProductNestedInput;
    reservations?: InventoryReservationUpdateManyWithoutProductNestedInput;
    orderItems?: OrderItemUpdateManyWithoutProductNestedInput;
    reviews?: ProductReviewUpdateManyWithoutProductNestedInput;
    cartItems?: CartItemUpdateManyWithoutProductNestedInput;
  };

  export type ProductUncheckedUpdateWithoutWishlistItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    comparePrice?: NullableFloatFieldUpdateOperationsInput | number | null;
    sku?: NullableStringFieldUpdateOperationsInput | string | null;
    category?: StringFieldUpdateOperationsInput | string;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    brand?: NullableStringFieldUpdateOperationsInput | string | null;
    images?: ProductUpdateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    vendorId?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    inventory?: ProductInventoryUncheckedUpdateOneWithoutProductNestedInput;
    reservations?: InventoryReservationUncheckedUpdateManyWithoutProductNestedInput;
    orderItems?: OrderItemUncheckedUpdateManyWithoutProductNestedInput;
    reviews?: ProductReviewUncheckedUpdateManyWithoutProductNestedInput;
    cartItems?: CartItemUncheckedUpdateManyWithoutProductNestedInput;
  };

  export type VendorCreateWithoutAnalyticsInput = {
    id?: string;
    name: string;
    email: string;
    phone?: string | null;
    address?: NullableJsonNullValueInput | InputJsonValue;
    description?: string | null;
    isActive?: boolean;
    isVerified?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    products?: ProductCreateNestedManyWithoutVendorInput;
  };

  export type VendorUncheckedCreateWithoutAnalyticsInput = {
    id?: string;
    name: string;
    email: string;
    phone?: string | null;
    address?: NullableJsonNullValueInput | InputJsonValue;
    description?: string | null;
    isActive?: boolean;
    isVerified?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    products?: ProductUncheckedCreateNestedManyWithoutVendorInput;
  };

  export type VendorCreateOrConnectWithoutAnalyticsInput = {
    where: VendorWhereUniqueInput;
    create: XOR<
      VendorCreateWithoutAnalyticsInput,
      VendorUncheckedCreateWithoutAnalyticsInput
    >;
  };

  export type VendorUpsertWithoutAnalyticsInput = {
    update: XOR<
      VendorUpdateWithoutAnalyticsInput,
      VendorUncheckedUpdateWithoutAnalyticsInput
    >;
    create: XOR<
      VendorCreateWithoutAnalyticsInput,
      VendorUncheckedCreateWithoutAnalyticsInput
    >;
    where?: VendorWhereInput;
  };

  export type VendorUpdateToOneWithWhereWithoutAnalyticsInput = {
    where?: VendorWhereInput;
    data: XOR<
      VendorUpdateWithoutAnalyticsInput,
      VendorUncheckedUpdateWithoutAnalyticsInput
    >;
  };

  export type VendorUpdateWithoutAnalyticsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    phone?: NullableStringFieldUpdateOperationsInput | string | null;
    address?: NullableJsonNullValueInput | InputJsonValue;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isVerified?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    products?: ProductUpdateManyWithoutVendorNestedInput;
  };

  export type VendorUncheckedUpdateWithoutAnalyticsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    phone?: NullableStringFieldUpdateOperationsInput | string | null;
    address?: NullableJsonNullValueInput | InputJsonValue;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    isVerified?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    products?: ProductUncheckedUpdateManyWithoutVendorNestedInput;
  };

  export type ProductCreateManyVendorInput = {
    id?: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    sku?: string | null;
    category: string;
    subcategory?: string | null;
    brand?: string | null;
    images?: ProductCreateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    isActive?: boolean;
    rating?: number | null;
    reviewCount?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type VendorAnalyticsCreateManyVendorInput = {
    id?: string;
    period: string;
    date: Date | string;
    totalOrders?: number;
    totalRevenue?: number;
    totalViews?: number;
    conversionRate?: number;
    createdAt?: Date | string;
  };

  export type ProductUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    comparePrice?: NullableFloatFieldUpdateOperationsInput | number | null;
    sku?: NullableStringFieldUpdateOperationsInput | string | null;
    category?: StringFieldUpdateOperationsInput | string;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    brand?: NullableStringFieldUpdateOperationsInput | string | null;
    images?: ProductUpdateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    inventory?: ProductInventoryUpdateOneWithoutProductNestedInput;
    reservations?: InventoryReservationUpdateManyWithoutProductNestedInput;
    orderItems?: OrderItemUpdateManyWithoutProductNestedInput;
    reviews?: ProductReviewUpdateManyWithoutProductNestedInput;
    cartItems?: CartItemUpdateManyWithoutProductNestedInput;
    wishlistItems?: WishlistItemUpdateManyWithoutProductNestedInput;
  };

  export type ProductUncheckedUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    comparePrice?: NullableFloatFieldUpdateOperationsInput | number | null;
    sku?: NullableStringFieldUpdateOperationsInput | string | null;
    category?: StringFieldUpdateOperationsInput | string;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    brand?: NullableStringFieldUpdateOperationsInput | string | null;
    images?: ProductUpdateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    inventory?: ProductInventoryUncheckedUpdateOneWithoutProductNestedInput;
    reservations?: InventoryReservationUncheckedUpdateManyWithoutProductNestedInput;
    orderItems?: OrderItemUncheckedUpdateManyWithoutProductNestedInput;
    reviews?: ProductReviewUncheckedUpdateManyWithoutProductNestedInput;
    cartItems?: CartItemUncheckedUpdateManyWithoutProductNestedInput;
    wishlistItems?: WishlistItemUncheckedUpdateManyWithoutProductNestedInput;
  };

  export type ProductUncheckedUpdateManyWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    price?: FloatFieldUpdateOperationsInput | number;
    comparePrice?: NullableFloatFieldUpdateOperationsInput | number | null;
    sku?: NullableStringFieldUpdateOperationsInput | string | null;
    category?: StringFieldUpdateOperationsInput | string;
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null;
    brand?: NullableStringFieldUpdateOperationsInput | string | null;
    images?: ProductUpdateimagesInput | string[];
    specifications?: NullableJsonNullValueInput | InputJsonValue;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    reviewCount?: IntFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type VendorAnalyticsUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    period?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    totalOrders?: IntFieldUpdateOperationsInput | number;
    totalRevenue?: FloatFieldUpdateOperationsInput | number;
    totalViews?: IntFieldUpdateOperationsInput | number;
    conversionRate?: FloatFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type VendorAnalyticsUncheckedUpdateWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    period?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    totalOrders?: IntFieldUpdateOperationsInput | number;
    totalRevenue?: FloatFieldUpdateOperationsInput | number;
    totalViews?: IntFieldUpdateOperationsInput | number;
    conversionRate?: FloatFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type VendorAnalyticsUncheckedUpdateManyWithoutVendorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    period?: StringFieldUpdateOperationsInput | string;
    date?: DateTimeFieldUpdateOperationsInput | Date | string;
    totalOrders?: IntFieldUpdateOperationsInput | number;
    totalRevenue?: FloatFieldUpdateOperationsInput | number;
    totalViews?: IntFieldUpdateOperationsInput | number;
    conversionRate?: FloatFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type InventoryReservationCreateManyProductInput = {
    id?: string;
    quantity: number;
    customerId: string;
    orderId?: string | null;
    sessionId?: string | null;
    expiresAt: Date | string;
    createdAt?: Date | string;
  };

  export type OrderItemCreateManyProductInput = {
    id?: string;
    orderId?: string | null;
    vendorOrderId?: string | null;
    quantity: number;
    price: number;
    createdAt?: Date | string;
  };

  export type ProductReviewCreateManyProductInput = {
    id?: string;
    customerId: string;
    rating: number;
    title?: string | null;
    review?: string | null;
    isVerified?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type CartItemCreateManyProductInput = {
    id?: string;
    cartId: string;
    quantity: number;
    price: number;
    addedAt?: Date | string;
  };

  export type WishlistItemCreateManyProductInput = {
    id?: string;
    wishlistId: string;
    addedAt?: Date | string;
  };

  export type InventoryReservationUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    customerId?: StringFieldUpdateOperationsInput | string;
    orderId?: NullableStringFieldUpdateOperationsInput | string | null;
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type InventoryReservationUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    customerId?: StringFieldUpdateOperationsInput | string;
    orderId?: NullableStringFieldUpdateOperationsInput | string | null;
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type InventoryReservationUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    customerId?: StringFieldUpdateOperationsInput | string;
    orderId?: NullableStringFieldUpdateOperationsInput | string | null;
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type OrderItemUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    order?: OrderUpdateOneWithoutItemsNestedInput;
    vendorOrder?: VendorOrderUpdateOneWithoutItemsNestedInput;
  };

  export type OrderItemUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string;
    orderId?: NullableStringFieldUpdateOperationsInput | string | null;
    vendorOrderId?: NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type OrderItemUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string;
    orderId?: NullableStringFieldUpdateOperationsInput | string | null;
    vendorOrderId?: NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProductReviewUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    title?: NullableStringFieldUpdateOperationsInput | string | null;
    review?: NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProductReviewUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    title?: NullableStringFieldUpdateOperationsInput | string | null;
    review?: NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ProductReviewUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    rating?: IntFieldUpdateOperationsInput | number;
    title?: NullableStringFieldUpdateOperationsInput | string | null;
    review?: NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: BoolFieldUpdateOperationsInput | boolean;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CartItemUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    cart?: ShoppingCartUpdateOneRequiredWithoutItemsNestedInput;
  };

  export type CartItemUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string;
    cartId?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CartItemUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string;
    cartId?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type WishlistItemUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string;
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    wishlist?: WishlistUpdateOneRequiredWithoutItemsNestedInput;
  };

  export type WishlistItemUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string;
    wishlistId?: StringFieldUpdateOperationsInput | string;
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type WishlistItemUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string;
    wishlistId?: StringFieldUpdateOperationsInput | string;
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CategoryCreateManyParentInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type CategoryUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    children?: CategoryUpdateManyWithoutParentNestedInput;
  };

  export type CategoryUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    children?: CategoryUncheckedUpdateManyWithoutParentNestedInput;
  };

  export type CategoryUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CartItemCreateManyCartInput = {
    id?: string;
    productId: string;
    quantity: number;
    price: number;
    addedAt?: Date | string;
  };

  export type CartItemUpdateWithoutCartInput = {
    id?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    product?: ProductUpdateOneRequiredWithoutCartItemsNestedInput;
  };

  export type CartItemUncheckedUpdateWithoutCartInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productId?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CartItemUncheckedUpdateManyWithoutCartInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productId?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type OrderItemCreateManyOrderInput = {
    id?: string;
    vendorOrderId?: string | null;
    productId: string;
    quantity: number;
    price: number;
    createdAt?: Date | string;
  };

  export type VendorOrderCreateManyOrderInput = {
    id?: string;
    vendorId: string;
    status?: $Enums.OrderStatus;
    subtotal: number;
    shipping: number;
    total: number;
    trackingNumber?: string | null;
    estimatedDelivery?: Date | string | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type OrderItemUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    vendorOrder?: VendorOrderUpdateOneWithoutItemsNestedInput;
    product?: ProductUpdateOneRequiredWithoutOrderItemsNestedInput;
  };

  export type OrderItemUncheckedUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    vendorOrderId?: NullableStringFieldUpdateOperationsInput | string | null;
    productId?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type OrderItemUncheckedUpdateManyWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    vendorOrderId?: NullableStringFieldUpdateOperationsInput | string | null;
    productId?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type VendorOrderUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    vendorId?: StringFieldUpdateOperationsInput | string;
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotal?: FloatFieldUpdateOperationsInput | number;
    shipping?: FloatFieldUpdateOperationsInput | number;
    total?: FloatFieldUpdateOperationsInput | number;
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    estimatedDelivery?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    items?: OrderItemUpdateManyWithoutVendorOrderNestedInput;
  };

  export type VendorOrderUncheckedUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    vendorId?: StringFieldUpdateOperationsInput | string;
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotal?: FloatFieldUpdateOperationsInput | number;
    shipping?: FloatFieldUpdateOperationsInput | number;
    total?: FloatFieldUpdateOperationsInput | number;
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    estimatedDelivery?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    items?: OrderItemUncheckedUpdateManyWithoutVendorOrderNestedInput;
  };

  export type VendorOrderUncheckedUpdateManyWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    vendorId?: StringFieldUpdateOperationsInput | string;
    status?: EnumOrderStatusFieldUpdateOperationsInput | $Enums.OrderStatus;
    subtotal?: FloatFieldUpdateOperationsInput | number;
    shipping?: FloatFieldUpdateOperationsInput | number;
    total?: FloatFieldUpdateOperationsInput | number;
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    estimatedDelivery?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    notes?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type OrderItemCreateManyVendorOrderInput = {
    id?: string;
    orderId?: string | null;
    productId: string;
    quantity: number;
    price: number;
    createdAt?: Date | string;
  };

  export type OrderItemUpdateWithoutVendorOrderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    order?: OrderUpdateOneWithoutItemsNestedInput;
    product?: ProductUpdateOneRequiredWithoutOrderItemsNestedInput;
  };

  export type OrderItemUncheckedUpdateWithoutVendorOrderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    orderId?: NullableStringFieldUpdateOperationsInput | string | null;
    productId?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type OrderItemUncheckedUpdateManyWithoutVendorOrderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    orderId?: NullableStringFieldUpdateOperationsInput | string | null;
    productId?: StringFieldUpdateOperationsInput | string;
    quantity?: IntFieldUpdateOperationsInput | number;
    price?: FloatFieldUpdateOperationsInput | number;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type WishlistItemCreateManyWishlistInput = {
    id?: string;
    productId: string;
    addedAt?: Date | string;
  };

  export type WishlistItemUpdateWithoutWishlistInput = {
    id?: StringFieldUpdateOperationsInput | string;
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    product?: ProductUpdateOneRequiredWithoutWishlistItemsNestedInput;
  };

  export type WishlistItemUncheckedUpdateWithoutWishlistInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productId?: StringFieldUpdateOperationsInput | string;
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type WishlistItemUncheckedUpdateManyWithoutWishlistInput = {
    id?: StringFieldUpdateOperationsInput | string;
    productId?: StringFieldUpdateOperationsInput | string;
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  /**
   * Aliases for legacy arg types
   */
  /**
   * @deprecated Use VendorCountOutputTypeDefaultArgs instead
   */
  export type VendorCountOutputTypeArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = VendorCountOutputTypeDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use ProductCountOutputTypeDefaultArgs instead
   */
  export type ProductCountOutputTypeArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = ProductCountOutputTypeDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use CategoryCountOutputTypeDefaultArgs instead
   */
  export type CategoryCountOutputTypeArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = CategoryCountOutputTypeDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use ShoppingCartCountOutputTypeDefaultArgs instead
   */
  export type ShoppingCartCountOutputTypeArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = ShoppingCartCountOutputTypeDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use OrderCountOutputTypeDefaultArgs instead
   */
  export type OrderCountOutputTypeArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = OrderCountOutputTypeDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use VendorOrderCountOutputTypeDefaultArgs instead
   */
  export type VendorOrderCountOutputTypeArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = VendorOrderCountOutputTypeDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use WishlistCountOutputTypeDefaultArgs instead
   */
  export type WishlistCountOutputTypeArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = WishlistCountOutputTypeDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use VendorDefaultArgs instead
   */
  export type VendorArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = VendorDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use ProductDefaultArgs instead
   */
  export type ProductArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = ProductDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use ProductInventoryDefaultArgs instead
   */
  export type ProductInventoryArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = ProductInventoryDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use InventoryReservationDefaultArgs instead
   */
  export type InventoryReservationArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = InventoryReservationDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use CategoryDefaultArgs instead
   */
  export type CategoryArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = CategoryDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use ShoppingCartDefaultArgs instead
   */
  export type ShoppingCartArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = ShoppingCartDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use CartItemDefaultArgs instead
   */
  export type CartItemArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = CartItemDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use OrderDefaultArgs instead
   */
  export type OrderArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = OrderDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use VendorOrderDefaultArgs instead
   */
  export type VendorOrderArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = VendorOrderDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use OrderItemDefaultArgs instead
   */
  export type OrderItemArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = OrderItemDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use ProductReviewDefaultArgs instead
   */
  export type ProductReviewArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = ProductReviewDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use WishlistDefaultArgs instead
   */
  export type WishlistArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = WishlistDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use WishlistItemDefaultArgs instead
   */
  export type WishlistItemArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = WishlistItemDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use VendorAnalyticsDefaultArgs instead
   */
  export type VendorAnalyticsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = VendorAnalyticsDefaultArgs<ExtArgs>;

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number;
  };

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF;
}
