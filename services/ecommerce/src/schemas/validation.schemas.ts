import { z } from 'zod';

// Common validation patterns
const objectIdPattern = /^[0-9a-fA-F]{24}$|^[a-zA-Z0-9_-]{21,25}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[\d\s\-()]{10,}$/;

// Base schemas
export const ObjectIdSchema = z.string().regex(objectIdPattern, 'Invalid ID format');
export const EmailSchema = z.string().regex(emailPattern, 'Invalid email format');
export const PhoneSchema = z.string().regex(phonePattern, 'Invalid phone format').optional();

// Pagination schema
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Address schema
export const AddressSchema = z.object({
  street: z.string().min(1, 'Street is required').max(255, 'Street too long'),
  city: z.string().min(1, 'City is required').max(100, 'City too long'),
  state: z.string().min(1, 'State is required').max(100, 'State too long'),
  postalCode: z.string().min(1, 'Postal code is required').max(20, 'Postal code too long'),
  country: z.string().min(1, 'Country is required').max(100, 'Country too long'),
  isDefault: z.boolean().default(false),
});

// Cart validation schemas
export const AddToCartSchema = z.object({
  productId: ObjectIdSchema,
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(999, 'Quantity too large'),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(999, 'Quantity too large'),
});

export const CartItemParamsSchema = z.object({
  itemId: ObjectIdSchema,
});

// Order validation schemas
export const CreateOrderSchema = z.object({
  shippingAddress: AddressSchema,
  paymentMethodId: z.string().min(1, 'Payment method is required'),
  notes: z.string().max(500, 'Notes too long').optional(),
});

export const OrderParamsSchema = z.object({
  orderId: ObjectIdSchema,
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
  trackingNumber: z.string().max(100, 'Tracking number too long').optional(),
  notes: z.string().max(500, 'Notes too long').optional(),
});

export const OrderFiltersSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  vendorId: ObjectIdSchema.optional(),
}).merge(PaginationSchema);

// Product validation schemas
export const ProductParamsSchema = z.object({
  productId: ObjectIdSchema,
});

export const ProductFiltersSchema = z.object({
  category: z.string().max(100).optional(),
  vendorId: ObjectIdSchema.optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  inStock: z.coerce.boolean().optional(),
  search: z.string().max(255).optional(),
}).merge(PaginationSchema);

// Vendor validation schemas
export const VendorOrderFiltersSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
}).merge(PaginationSchema);

export const UpdateVendorOrderStatusSchema = z.object({
  status: z.enum(['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']),
  trackingNumber: z.string().max(100, 'Tracking number too long').optional(),
  estimatedDelivery: z.string().datetime().optional(),
  notes: z.string().max(500, 'Notes too long').optional(),
});

export const VendorOrderParamsSchema = z.object({
  vendorOrderId: ObjectIdSchema,
});

export const UpdateInventorySchema = z.object({
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
  trackQuantity: z.boolean().default(true),
});

// Sanitization functions
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

export function sanitizeHtml(input: string): string {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/<object[^>]*>.*?<\/object>/gi, '')
    .replace(/<embed[^>]*>.*?<\/embed>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}

export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[^\w\s\-_.]/g, '') // Allow only word characters, spaces, hyphens, underscores, dots
    .substring(0, 255); // Limit length
}

// Custom validation transforms
export const SanitizedStringSchema = z.string().transform(sanitizeString);
export const SanitizedHtmlSchema = z.string().transform(sanitizeHtml);
export const SanitizedSearchSchema = z.string().transform(sanitizeSearchQuery);

// Helper to create sanitized string with validation
const createSanitizedString = (minLength?: number, maxLength?: number) => {
  let schema = z.string();
  if (minLength !== undefined) {
    schema = schema.min(minLength, `Must be at least ${minLength} characters`);
  }
  if (maxLength !== undefined) {
    schema = schema.max(maxLength, `Must be at most ${maxLength} characters`);
  }
  return schema.transform(sanitizeString);
};

// Request validation schemas with sanitization
export const SanitizedAddToCartSchema = z.object({
  productId: ObjectIdSchema,
  quantity: z.number().int().min(1).max(999),
});

export const SanitizedCreateOrderSchema = z.object({
  shippingAddress: z.object({
    street: createSanitizedString(1, 255),
    city: createSanitizedString(1, 100),
    state: createSanitizedString(1, 100),
    postalCode: createSanitizedString(1, 20),
    country: createSanitizedString(1, 100),
    isDefault: z.boolean().default(false),
  }),
  paymentMethodId: createSanitizedString(1),
  notes: createSanitizedString(undefined, 500).optional(),
});

export const SanitizedProductFiltersSchema = z.object({
  category: createSanitizedString(undefined, 100).optional(),
  vendorId: ObjectIdSchema.optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  inStock: z.coerce.boolean().optional(),
  search: SanitizedSearchSchema.optional(),
}).merge(PaginationSchema);

// Type exports
export type AddToCartRequest = z.infer<typeof AddToCartSchema>;
export type UpdateCartItemRequest = z.infer<typeof UpdateCartItemSchema>;
export type CreateOrderRequest = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderStatusRequest = z.infer<typeof UpdateOrderStatusSchema>;
export type OrderFilters = z.infer<typeof OrderFiltersSchema>;
export type ProductFilters = z.infer<typeof ProductFiltersSchema>;
export type VendorOrderFilters = z.infer<typeof VendorOrderFiltersSchema>;
export type UpdateVendorOrderStatusRequest = z.infer<typeof UpdateVendorOrderStatusSchema>;
export type UpdateInventoryRequest = z.infer<typeof UpdateInventorySchema>;
export type PaginationParams = z.infer<typeof PaginationSchema>;
export type Address = z.infer<typeof AddressSchema>;