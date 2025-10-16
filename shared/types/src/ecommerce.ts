import { z } from 'zod';
import { PaginationSchema } from './common';

// Product schemas
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  sku: z.string().optional(),
  category: z.string(),
  subcategory: z.string().optional(),
  brand: z.string().optional(),
  images: z.array(z.string().url()),
  specifications: z.record(z.string()).optional(),
  vendorId: z.string(),
  inventory: z.object({
    quantity: z.number().min(0),
    lowStockThreshold: z.number().min(0).default(10),
    trackQuantity: z.boolean().default(true),
  }),
  isActive: z.boolean().default(true),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const ProductSearchSchema = PaginationSchema.extend({
  q: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  brand: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  inStock: z.boolean().optional(),
});

// Cart schemas
export const CartItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number().positive(),
  price: z.number().positive(),
  product: ProductSchema.optional(),
});

export const CartSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  items: z.array(CartItemSchema),
  subtotal: z.number(),
  tax: z.number(),
  total: z.number(),
  updatedAt: z.string().datetime(),
});

export const AddToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive(),
});

// Order schemas
export const OrderItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number().positive(),
  price: z.number().positive(),
  product: ProductSchema.optional(),
});

export const VendorOrderSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  vendorId: z.string(),
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED',
  ]),
  items: z.array(OrderItemSchema),
  subtotal: z.number(),
  shipping: z.number(),
  total: z.number(),
  trackingNumber: z.string().optional(),
  estimatedDelivery: z.string().datetime().optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const OrderSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  items: z.array(OrderItemSchema),
  vendorOrders: z.array(VendorOrderSchema),
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED',
  ]),
  subtotal: z.number(),
  tax: z.number(),
  shipping: z.number(),
  total: z.number(),
  shippingAddress: z.object({
    name: z.string(),
    address: z.string(),
    city: z.string(),
    country: z.string(),
    phone: z.string().optional(),
  }),
  paymentMethod: z.string(),
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']),
  paymentIntentId: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().positive(),
    })
  ),
  shippingAddress: z.object({
    name: z.string(),
    address: z.string(),
    city: z.string(),
    country: z.string(),
    phone: z.string().optional(),
  }),
  paymentMethodId: z.string(),
  notes: z.string().optional(),
});

// Inventory schemas
export const InventoryReservationSchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number().positive(),
  customerId: z.string(),
  orderId: z.string().optional(),
  sessionId: z.string().optional(),
  expiresAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export const ReservationRequestSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().positive(),
    })
  ),
  customerId: z.string(),
  sessionId: z.string().optional(),
  expirationMinutes: z.number().positive().default(30),
});

export const ReservationResultSchema = z.object({
  reservationId: z.string(),
  success: z.boolean(),
  failures: z.array(
    z.object({
      productId: z.string(),
      requested: z.number(),
      available: z.number(),
      reason: z.string(),
    })
  ),
});

// Vendor schemas
export const VendorDashboardSchema = z.object({
  totalProducts: z.number(),
  totalOrders: z.number(),
  totalRevenue: z.number(),
  pendingOrders: z.number(),
  lowStockProducts: z.number(),
  recentOrders: z.array(OrderSchema),
  topProducts: z.array(ProductSchema),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductSearch = z.infer<typeof ProductSearchSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type Cart = z.infer<typeof CartSchema>;
export type AddToCart = z.infer<typeof AddToCartSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type VendorOrder = z.infer<typeof VendorOrderSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type CreateOrder = z.infer<typeof CreateOrderSchema>;
export type InventoryReservation = z.infer<typeof InventoryReservationSchema>;
export type ReservationRequest = z.infer<typeof ReservationRequestSchema>;
export type ReservationResult = z.infer<typeof ReservationResultSchema>;
export type VendorDashboard = z.infer<typeof VendorDashboardSchema>;
