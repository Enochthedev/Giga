import { v4 as uuidv4 } from 'uuid';
import { vi } from 'vitest';
import {
  Order,
  OrderStatus,
  PaymentStatus,
  PrismaClient,
  Product,
  Vendor,
} from '../generated/prisma-client';

export class TestDataFactory {
  constructor(private _prisma: PrismaClient) { }

  createVendor(overrides: Partial<Vendor> = {}): Promise<Vendor> {
    return this.prisma.vendor.create({
      data: {
        id: uuidv4(),
        name: 'Test Vendor',
        email: 'vendor@test.com',
        isActive: true,
        ...overrides,
      },
    });
  }

  createProduct(
    vendorId: string,
    overrides: Partial<Product> = {}
  ): Promise<Product> {
    return this.prisma.product.create({
      data: {
        id: uuidv4(),
        name: 'Test Product',
        description: 'Test product description',
        price: 99.99,
        vendorId,
        isActive: true,
        inventory: {
          quantity: 100,
          trackQuantity: true,
        },
        images: ['https://example.com/image.jpg'],
        category: 'Electronics',
        ...overrides,
      },
    });
  }

  createOrder(
    customerId: string,
    overrides: Partial<Order> = {}
  ): Promise<Order> {
    return this.prisma.order.create({
      data: {
        id: uuidv4(),
        customerId,
        status: OrderStatus.PENDING,
        subtotal: 99.99,
        tax: 8.0,
        shipping: 10.0,
        total: 117.99,
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'US',
        },
        paymentMethod: 'card_test',
        paymentStatus: PaymentStatus.PENDING,
        ...overrides,
      },
    });
  }

  createCartItem(productId: string, quantity: number = 1) {
    return {
      id: uuidv4(),
      productId,
      quantity,
      price: 99.99,
      addedAt: new Date().toISOString(),
    };
  }

  createCart(customerId: string, items: any[] = []) {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    return {
      id: uuidv4(),
      customerId,
      items,
      subtotal,
      tax,
      total,
      updatedAt: new Date().toISOString(),
    };
  }
}

export const mockAuthServiceClient = {
  validateToken: vi.fn(),
  getUserInfo: vi.fn(),
  getUserPermissions: vi.fn(),
};

export const mockPaymentServiceClient = {
  createPaymentIntent: vi.fn(),
  confirmPayment: vi.fn(),
  refundPayment: vi.fn(),
  getPaymentMethods: vi.fn(),
};

export const mockNotificationServiceClient = {
  sendOrderConfirmation: vi.fn(),
  sendOrderStatusUpdate: vi.fn(),
  sendVendorOrderNotification: vi.fn(),
  sendInventoryAlert: vi.fn(),
};

export const createMockRedisClient = () => ({
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
  exists: vi.fn(),
  expire: vi.fn(),
  keys: vi.fn(),
  hget: vi.fn(),
  hset: vi.fn(),
  hdel: vi.fn(),
  hgetall: vi.fn(),
  connect: vi.fn(),
  quit: vi.fn(),
  isReady: true,
});

export const waitFor = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));
