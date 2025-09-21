Object.defineProperty(exports, '__esModule', { value: true });

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
  getRuntime,
} = require('./runtime/edge.js');

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

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError;
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError;
Prisma.PrismaClientInitializationError = PrismaClientInitializationError;
Prisma.PrismaClientValidationError = PrismaClientValidationError;
Prisma.NotFoundError = NotFoundError;
Prisma.Decimal = Decimal;

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag;
Prisma.empty = empty;
Prisma.join = join;
Prisma.raw = raw;
Prisma.validator = Public.validator;

/**
 * Extensions
 */
Prisma.getExtensionContext = Extensions.getExtensionContext;
Prisma.defineExtension = Extensions.defineExtension;

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
 * Create the Client
 */
const config = {
  generator: {
    name: 'client',
    provider: {
      fromEnvVar: null,
      value: 'prisma-client-js',
    },
    output: {
      value:
        '/Users/user/Documents/Giga/services/ecommerce/src/generated/prisma-client',
      fromEnvVar: null,
    },
    config: {
      engineType: 'library',
    },
    binaryTargets: [
      {
        fromEnvVar: null,
        value: 'darwin-arm64',
        native: true,
      },
    ],
    previewFeatures: [],
    sourceFilePath:
      '/Users/user/Documents/Giga/services/ecommerce/prisma/schema.prisma',
    isCustomOutput: true,
  },
  relativeEnvPaths: {
    rootEnvPath: '../../../.env',
    schemaEnvPath: '../../../.env',
  },
  relativePath: '../../../prisma',
  clientVersion: '5.22.0',
  engineVersion: '605197351a3c8bdd595af2d2a9bc3025bca48ea2',
  datasourceNames: ['db'],
  activeProvider: 'postgresql',
  postinstall: false,
  inlineDatasources: {
    db: {
      url: {
        fromEnvVar: 'DATABASE_URL',
        value: null,
      },
    },
  },
  inlineSchema:
    '// Ecommerce service database schema\ngenerator client {\n  provider = "prisma-client-js"\n  output   = "../src/generated/prisma-client"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\n// Vendor Management\nmodel Vendor {\n  id          String   @id @default(cuid())\n  name        String\n  email       String   @unique\n  phone       String?\n  address     Json?\n  description String?\n  isActive    Boolean  @default(true)\n  isVerified  Boolean  @default(false)\n  rating      Float?\n  reviewCount Int      @default(0)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  // Relationships\n  products  Product[]\n  analytics VendorAnalytics[]\n\n  @@index([isActive])\n  @@index([isVerified])\n  @@index([rating])\n  @@index([createdAt])\n  @@map("vendors")\n}\n\n// Product Management\nmodel Product {\n  id             String   @id @default(cuid())\n  name           String\n  description    String\n  price          Float\n  comparePrice   Float?\n  sku            String?  @unique\n  category       String\n  subcategory    String?\n  brand          String?\n  images         String[] // Array of image URLs\n  specifications Json?\n  vendorId       String\n  isActive       Boolean  @default(true)\n  rating         Float?\n  reviewCount    Int      @default(0)\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @updatedAt\n\n  // Relationships\n  vendor        Vendor                 @relation(fields: [vendorId], references: [id])\n  inventory     ProductInventory?\n  reservations  InventoryReservation[]\n  orderItems    OrderItem[]\n  reviews       ProductReview[]\n  cartItems     CartItem[]\n  wishlistItems WishlistItem[]\n\n  // Strategic indexes for performance optimization\n  @@index([category])\n  @@index([vendorId])\n  @@index([isActive])\n  @@index([price])\n  @@index([rating])\n  @@index([createdAt])\n  @@index([updatedAt])\n  // Composite indexes for common query patterns\n  @@index([isActive, category])\n  @@index([isActive, vendorId])\n  @@index([isActive, price])\n  @@index([isActive, rating])\n  @@index([category, subcategory])\n  @@index([category, brand])\n  @@index([vendorId, isActive, createdAt])\n  @@index([isActive, category, price])\n  @@index([isActive, rating, createdAt])\n  // Full-text search optimization (for PostgreSQL)\n  @@index([name])\n  @@index([brand])\n  @@map("products")\n}\n\nmodel ProductInventory {\n  id                String   @id @default(cuid())\n  productId         String   @unique\n  product           Product  @relation(fields: [productId], references: [id], onDelete: Cascade)\n  quantity          Int      @default(0)\n  reservedQuantity  Int      @default(0)\n  lowStockThreshold Int      @default(10)\n  trackQuantity     Boolean  @default(true)\n  updatedAt         DateTime @updatedAt\n\n  // Indexes for inventory management and low stock alerts\n  @@index([quantity])\n  @@index([lowStockThreshold])\n  @@index([trackQuantity])\n  @@index([updatedAt])\n  // Composite indexes for inventory monitoring\n  @@index([trackQuantity, quantity])\n  @@index([quantity, lowStockThreshold])\n  @@map("product_inventory")\n}\n\nmodel InventoryReservation {\n  id         String   @id @default(cuid())\n  productId  String\n  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)\n  quantity   Int\n  customerId String\n  orderId    String?\n  sessionId  String?\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n\n  @@index([productId])\n  @@index([customerId])\n  @@index([sessionId])\n  @@index([expiresAt])\n  @@map("inventory_reservations")\n}\n\nmodel Category {\n  id          String     @id @default(cuid())\n  name        String     @unique\n  slug        String     @unique\n  description String?\n  parentId    String?\n  parent      Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])\n  children    Category[] @relation("CategoryHierarchy")\n  isActive    Boolean    @default(true)\n  createdAt   DateTime   @default(now())\n  updatedAt   DateTime   @updatedAt\n\n  @@map("categories")\n}\n\n// Shopping Cart\nmodel ShoppingCart {\n  id         String     @id @default(cuid())\n  customerId String     @unique\n  items      CartItem[]\n  updatedAt  DateTime   @updatedAt\n\n  @@map("shopping_carts")\n}\n\nmodel CartItem {\n  id        String       @id @default(cuid())\n  cartId    String\n  cart      ShoppingCart @relation(fields: [cartId], references: [id], onDelete: Cascade)\n  productId String\n  product   Product      @relation(fields: [productId], references: [id], onDelete: Cascade)\n  quantity  Int\n  price     Float // Price at time of adding to cart\n  addedAt   DateTime     @default(now())\n\n  @@unique([cartId, productId])\n  @@map("cart_items")\n}\n\n// Order Management\nmodel Order {\n  id              String        @id @default(cuid())\n  customerId      String\n  status          OrderStatus   @default(PENDING)\n  items           OrderItem[]\n  vendorOrders    VendorOrder[]\n  subtotal        Float\n  tax             Float\n  shipping        Float\n  total           Float\n  shippingAddress Json\n  paymentMethod   String\n  paymentStatus   PaymentStatus @default(PENDING)\n  paymentIntentId String?\n  notes           String?\n  createdAt       DateTime      @default(now())\n  updatedAt       DateTime      @updatedAt\n\n  // Optimized indexes for order queries\n  @@index([customerId])\n  @@index([status])\n  @@index([createdAt])\n  @@index([updatedAt])\n  @@index([paymentStatus])\n  // Composite indexes for common query patterns\n  @@index([customerId, status])\n  @@index([customerId, createdAt])\n  @@index([status, createdAt])\n  @@index([customerId, status, createdAt])\n  @@index([paymentStatus, status])\n  @@map("orders")\n}\n\nmodel VendorOrder {\n  id                String      @id @default(cuid())\n  orderId           String\n  order             Order       @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  vendorId          String\n  status            OrderStatus @default(PENDING)\n  items             OrderItem[]\n  subtotal          Float\n  shipping          Float\n  total             Float\n  trackingNumber    String?\n  estimatedDelivery DateTime?\n  notes             String?\n  createdAt         DateTime    @default(now())\n  updatedAt         DateTime    @updatedAt\n\n  // Optimized indexes for vendor order queries\n  @@index([vendorId])\n  @@index([status])\n  @@index([orderId])\n  @@index([createdAt])\n  @@index([updatedAt])\n  // Composite indexes for vendor analytics and filtering\n  @@index([vendorId, status])\n  @@index([vendorId, createdAt])\n  @@index([vendorId, status, createdAt])\n  @@index([status, createdAt])\n  @@index([orderId, vendorId])\n  @@map("vendor_orders")\n}\n\nmodel OrderItem {\n  id            String       @id @default(cuid())\n  orderId       String?\n  order         Order?       @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  vendorOrderId String?\n  vendorOrder   VendorOrder? @relation(fields: [vendorOrderId], references: [id], onDelete: Cascade)\n  productId     String\n  product       Product      @relation(fields: [productId], references: [id])\n  quantity      Int\n  price         Float // Price at time of order\n  createdAt     DateTime     @default(now())\n\n  // Indexes for order item queries and analytics\n  @@index([orderId])\n  @@index([vendorOrderId])\n  @@index([productId])\n  @@index([createdAt])\n  // Composite indexes for analytics\n  @@index([productId, createdAt])\n  @@index([orderId, productId])\n  @@index([vendorOrderId, productId])\n  @@map("order_items")\n}\n\n// Reviews and Ratings\nmodel ProductReview {\n  id         String   @id @default(cuid())\n  productId  String\n  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)\n  customerId String\n  rating     Int // 1-5 stars\n  title      String?\n  review     String?\n  isVerified Boolean  @default(false) // Verified purchase\n  isActive   Boolean  @default(true)\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@unique([productId, customerId])\n  @@index([productId])\n  @@index([rating])\n  @@map("product_reviews")\n}\n\n// Wishlist\nmodel Wishlist {\n  id         String         @id @default(cuid())\n  customerId String         @unique\n  items      WishlistItem[]\n  createdAt  DateTime       @default(now())\n  updatedAt  DateTime       @updatedAt\n\n  @@map("wishlists")\n}\n\nmodel WishlistItem {\n  id         String   @id @default(cuid())\n  wishlistId String\n  wishlist   Wishlist @relation(fields: [wishlistId], references: [id], onDelete: Cascade)\n  productId  String\n  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)\n  addedAt    DateTime @default(now())\n\n  @@unique([wishlistId, productId])\n  @@map("wishlist_items")\n}\n\n// Vendor Analytics\nmodel VendorAnalytics {\n  id             String   @id @default(cuid())\n  vendorId       String\n  vendor         Vendor   @relation(fields: [vendorId], references: [id])\n  period         String // \'daily\', \'weekly\', \'monthly\'\n  date           DateTime\n  totalOrders    Int      @default(0)\n  totalRevenue   Float    @default(0)\n  totalViews     Int      @default(0)\n  conversionRate Float    @default(0)\n  createdAt      DateTime @default(now())\n\n  @@unique([vendorId, period, date])\n  // Optimized indexes for analytics queries\n  @@index([vendorId])\n  @@index([date])\n  @@index([period])\n  @@index([createdAt])\n  // Composite indexes for analytics reporting\n  @@index([vendorId, period])\n  @@index([vendorId, date])\n  @@index([vendorId, period, date])\n  @@index([period, date])\n  @@map("vendor_analytics")\n}\n\n// Enums\nenum OrderStatus {\n  PENDING\n  CONFIRMED\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n  REFUNDED\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  REFUNDED\n}\n',
  inlineSchemaHash:
    '000822f3f8930dc1c57c70c78084a2e629e063f8ec0416a342a42b021c79ee22',
  copyEngine: true,
};
config.dirname = '/';

config.runtimeDataModel = JSON.parse(
  '{"models":{"Vendor":{"dbName":"vendors","fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"email","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"phone","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"address","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"isActive","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"isVerified","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"rating","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"reviewCount","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"products","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Product","relationName":"ProductToVendor","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"analytics","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"VendorAnalytics","relationName":"VendorToVendorAnalytics","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Product":{"dbName":"products","fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"price","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"comparePrice","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"sku","kind":"scalar","isList":false,"isRequired":false,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"category","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"subcategory","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"brand","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"images","kind":"scalar","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"specifications","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","isGenerated":false,"isUpdatedAt":false},{"name":"vendorId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"isActive","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"rating","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"reviewCount","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"vendor","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Vendor","relationName":"ProductToVendor","relationFromFields":["vendorId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"inventory","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ProductInventory","relationName":"ProductToProductInventory","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"reservations","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"InventoryReservation","relationName":"InventoryReservationToProduct","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"orderItems","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"OrderItem","relationName":"OrderItemToProduct","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"reviews","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ProductReview","relationName":"ProductToProductReview","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"cartItems","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"CartItem","relationName":"CartItemToProduct","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"wishlistItems","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"WishlistItem","relationName":"ProductToWishlistItem","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"ProductInventory":{"dbName":"product_inventory","fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"productId","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"product","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Product","relationName":"ProductToProductInventory","relationFromFields":["productId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"quantity","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"reservedQuantity","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"lowStockThreshold","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":10,"isGenerated":false,"isUpdatedAt":false},{"name":"trackQuantity","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"InventoryReservation":{"dbName":"inventory_reservations","fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"productId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"product","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Product","relationName":"InventoryReservationToProduct","relationFromFields":["productId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"quantity","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"customerId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"orderId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"sessionId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"expiresAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Category":{"dbName":"categories","fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"slug","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"parentId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"parent","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Category","relationName":"CategoryHierarchy","relationFromFields":["parentId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"children","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Category","relationName":"CategoryHierarchy","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"isActive","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"ShoppingCart":{"dbName":"shopping_carts","fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"customerId","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"items","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"CartItem","relationName":"CartItemToShoppingCart","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"CartItem":{"dbName":"cart_items","fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"cartId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"cart","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ShoppingCart","relationName":"CartItemToShoppingCart","relationFromFields":["cartId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"productId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"product","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Product","relationName":"CartItemToProduct","relationFromFields":["productId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"quantity","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"price","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"addedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["cartId","productId"]],"uniqueIndexes":[{"name":null,"fields":["cartId","productId"]}],"isGenerated":false},"Order":{"dbName":"orders","fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"customerId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"OrderStatus","default":"PENDING","isGenerated":false,"isUpdatedAt":false},{"name":"items","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"OrderItem","relationName":"OrderToOrderItem","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"vendorOrders","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"VendorOrder","relationName":"OrderToVendorOrder","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"subtotal","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"tax","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"shipping","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"total","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"shippingAddress","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","isGenerated":false,"isUpdatedAt":false},{"name":"paymentMethod","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"paymentStatus","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"PaymentStatus","default":"PENDING","isGenerated":false,"isUpdatedAt":false},{"name":"paymentIntentId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"notes","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"VendorOrder":{"dbName":"vendor_orders","fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"orderId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"order","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Order","relationName":"OrderToVendorOrder","relationFromFields":["orderId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"vendorId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"OrderStatus","default":"PENDING","isGenerated":false,"isUpdatedAt":false},{"name":"items","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"OrderItem","relationName":"OrderItemToVendorOrder","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"subtotal","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"shipping","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"total","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"trackingNumber","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"estimatedDelivery","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"notes","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"OrderItem":{"dbName":"order_items","fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"orderId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"order","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Order","relationName":"OrderToOrderItem","relationFromFields":["orderId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"vendorOrderId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"vendorOrder","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"VendorOrder","relationName":"OrderItemToVendorOrder","relationFromFields":["vendorOrderId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"productId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"product","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Product","relationName":"OrderItemToProduct","relationFromFields":["productId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"quantity","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"price","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"ProductReview":{"dbName":"product_reviews","fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"productId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"product","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Product","relationName":"ProductToProductReview","relationFromFields":["productId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"customerId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"rating","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"title","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"review","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"isVerified","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"isActive","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[["productId","customerId"]],"uniqueIndexes":[{"name":null,"fields":["productId","customerId"]}],"isGenerated":false},"Wishlist":{"dbName":"wishlists","fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"customerId","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"items","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"WishlistItem","relationName":"WishlistToWishlistItem","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"WishlistItem":{"dbName":"wishlist_items","fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"wishlistId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"wishlist","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Wishlist","relationName":"WishlistToWishlistItem","relationFromFields":["wishlistId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"productId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"product","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Product","relationName":"ProductToWishlistItem","relationFromFields":["productId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"addedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["wishlistId","productId"]],"uniqueIndexes":[{"name":null,"fields":["wishlistId","productId"]}],"isGenerated":false},"VendorAnalytics":{"dbName":"vendor_analytics","fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"cuid","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"vendorId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"vendor","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Vendor","relationName":"VendorToVendorAnalytics","relationFromFields":["vendorId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"period","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"date","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"totalOrders","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"totalRevenue","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Float","default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"totalViews","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"conversionRate","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Float","default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["vendorId","period","date"]],"uniqueIndexes":[{"name":null,"fields":["vendorId","period","date"]}],"isGenerated":false}},"enums":{"OrderStatus":{"values":[{"name":"PENDING","dbName":null},{"name":"CONFIRMED","dbName":null},{"name":"PROCESSING","dbName":null},{"name":"SHIPPED","dbName":null},{"name":"DELIVERED","dbName":null},{"name":"CANCELLED","dbName":null},{"name":"REFUNDED","dbName":null}],"dbName":null},"PaymentStatus":{"values":[{"name":"PENDING","dbName":null},{"name":"PAID","dbName":null},{"name":"FAILED","dbName":null},{"name":"REFUNDED","dbName":null}],"dbName":null}},"types":{}}'
);
defineDmmfProperty(exports.Prisma, config.runtimeDataModel);
config.engineWasm = undefined;

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL:
      (typeof globalThis !== 'undefined' && globalThis['DATABASE_URL']) ||
      (typeof process !== 'undefined' &&
        process.env &&
        process.env.DATABASE_URL) ||
      undefined,
  },
});

if (
  (typeof globalThis !== 'undefined' && globalThis['DEBUG']) ||
  (typeof process !== 'undefined' && process.env && process.env.DEBUG) ||
  undefined
) {
  Debug.enable(
    (typeof globalThis !== 'undefined' && globalThis['DEBUG']) ||
      (typeof process !== 'undefined' && process.env && process.env.DEBUG) ||
      undefined
  );
}

const PrismaClient = getPrismaClient(config);
exports.PrismaClient = PrismaClient;
Object.assign(exports, Prisma);
