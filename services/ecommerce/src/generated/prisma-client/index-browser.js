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

exports.Prisma.VendorScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  phone: 'phone',
  address: 'address',
  description: 'description',
  isActive: 'isActive',
  isVerified: 'isVerified',
  rating: 'rating',
  reviewCount: 'reviewCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  price: 'price',
  comparePrice: 'comparePrice',
  sku: 'sku',
  category: 'category',
  subcategory: 'subcategory',
  brand: 'brand',
  images: 'images',
  specifications: 'specifications',
  vendorId: 'vendorId',
  isActive: 'isActive',
  rating: 'rating',
  reviewCount: 'reviewCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

exports.Prisma.ProductInventoryScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  quantity: 'quantity',
  reservedQuantity: 'reservedQuantity',
  lowStockThreshold: 'lowStockThreshold',
  trackQuantity: 'trackQuantity',
  updatedAt: 'updatedAt',
};

exports.Prisma.InventoryReservationScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  quantity: 'quantity',
  customerId: 'customerId',
  orderId: 'orderId',
  sessionId: 'sessionId',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt',
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  parentId: 'parentId',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

exports.Prisma.ShoppingCartScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  updatedAt: 'updatedAt',
};

exports.Prisma.CartItemScalarFieldEnum = {
  id: 'id',
  cartId: 'cartId',
  productId: 'productId',
  quantity: 'quantity',
  price: 'price',
  addedAt: 'addedAt',
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  status: 'status',
  subtotal: 'subtotal',
  tax: 'tax',
  shipping: 'shipping',
  total: 'total',
  shippingAddress: 'shippingAddress',
  paymentMethod: 'paymentMethod',
  paymentStatus: 'paymentStatus',
  paymentIntentId: 'paymentIntentId',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

exports.Prisma.VendorOrderScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  vendorId: 'vendorId',
  status: 'status',
  subtotal: 'subtotal',
  shipping: 'shipping',
  total: 'total',
  trackingNumber: 'trackingNumber',
  estimatedDelivery: 'estimatedDelivery',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  vendorOrderId: 'vendorOrderId',
  productId: 'productId',
  quantity: 'quantity',
  price: 'price',
  createdAt: 'createdAt',
};

exports.Prisma.ProductReviewScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  customerId: 'customerId',
  rating: 'rating',
  title: 'title',
  review: 'review',
  isVerified: 'isVerified',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

exports.Prisma.WishlistScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

exports.Prisma.WishlistItemScalarFieldEnum = {
  id: 'id',
  wishlistId: 'wishlistId',
  productId: 'productId',
  addedAt: 'addedAt',
};

exports.Prisma.VendorAnalyticsScalarFieldEnum = {
  id: 'id',
  vendorId: 'vendorId',
  period: 'period',
  date: 'date',
  totalOrders: 'totalOrders',
  totalRevenue: 'totalRevenue',
  totalViews: 'totalViews',
  conversionRate: 'conversionRate',
  createdAt: 'createdAt',
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc',
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
};

exports.Prisma.JsonNullValueInput = {
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
exports.OrderStatus = exports.$Enums.OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

exports.Prisma.ModelName = {
  Vendor: 'Vendor',
  Product: 'Product',
  ProductInventory: 'ProductInventory',
  InventoryReservation: 'InventoryReservation',
  Category: 'Category',
  ShoppingCart: 'ShoppingCart',
  CartItem: 'CartItem',
  Order: 'Order',
  VendorOrder: 'VendorOrder',
  OrderItem: 'OrderItem',
  ProductReview: 'ProductReview',
  Wishlist: 'Wishlist',
  WishlistItem: 'WishlistItem',
  VendorAnalytics: 'VendorAnalytics',
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
