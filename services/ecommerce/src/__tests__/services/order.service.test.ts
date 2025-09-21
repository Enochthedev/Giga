import { OrderService } from '@/services/order.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { prisma } from '@tests/setup';
import { TestDataFactory, mockAuthServiceClient, mockNotificationServiceClient, mockPaymentServiceClient } from '@tests/utils/test-helpers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('OrderService', () => {
  let orderService: OrderService;
  let testFactory: TestDataFactory;

  beforeEach(() => {
    testFactory = new TestDataFactory(prisma);
    orderService = new OrderService(
      prisma,
      mockPaymentServiceClient as any,
      mockNotificationServiceClient as any,
      mockAuthServiceClient as any
    );

    // Reset mocks
    vi.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      const customerId = 'customer-1';
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, { price: 100.00 });

      const orderData = {
        items: [{
          productId: product.id,
          quantity: 2,
          price: 100.00
        }],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'US'
        },
        paymentMethodId: 'pm_test_123'
      };

      mockPaymentServiceClient.createPaymentIntent.mockResolvedValue({
        id: 'pi_test_123',
        clientSecret: 'pi_test_123_secret_test',
        status: 'requires_confirmation',
        amount: 21600, // $216.00 in cents
        currency: 'usd'
      });

      mockPaymentServiceClient.confirmPayment.mockResolvedValue({
        success: true,
        paymentIntentId: 'pi_test_123',
        status: 'succeeded'
      });

      mockNotificationServiceClient.sendOrderConfirmation.mockResolvedValue(undefined);

      const order = await orderService.createOrder(customerId, orderData);

      expect(order).toMatchObject({
        customerId,
        status: OrderStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
        subtotal: 200.00,
        tax: 16.00,
        total: 216.00
      });

      expect(order.items).toHaveLength(1);
      expect(order.vendorOrders).toHaveLength(1);
      expect(order.vendorOrders[0].vendorId).toBe(vendor.id);

      expect(mockPaymentServiceClient.createPaymentIntent).toHaveBeenCalledWith(
        21600,
        'usd',
        customerId
      );
      expect(mockPaymentServiceClient.confirmPayment).toHaveBeenCalledWith('pi_test_123');
      expect(mockNotificationServiceClient.sendOrderConfirmation).toHaveBeenCalledWith(
        customerId,
        expect.objectContaining({ id: order.id })
      );
    });

    it('should handle payment failure and rollback', async () => {
      const customerId = 'customer-1';
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id);

      const orderData = {
        items: [{
          productId: product.id,
          quantity: 1,
          price: 100.00
        }],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'US'
        },
        paymentMethodId: 'pm_test_123'
      };

      mockPaymentServiceClient.createPaymentIntent.mockResolvedValue({
        id: 'pi_test_123',
        clientSecret: 'pi_test_123_secret_test',
        status: 'requires_confirmation',
        amount: 10800,
        currency: 'usd'
      });

      mockPaymentServiceClient.confirmPayment.mockResolvedValue({
        success: false,
        paymentIntentId: 'pi_test_123',
        status: 'failed',
        error: 'Payment declined'
      });

      await expect(orderService.createOrder(customerId, orderData))
        .rejects.toThrow('Payment failed: Payment declined');

      // Verify no order was created in database
      const orders = await prisma.order.findMany({ where: { customerId } });
      expect(orders).toHaveLength(0);
    });

    it('should create separate vendor orders for multi-vendor cart', async () => {
      const customerId = 'customer-1';
      const vendor1 = await testFactory.createVendor({ name: 'Vendor 1' });
      const vendor2 = await testFactory.createVendor({ name: 'Vendor 2' });
      const product1 = await testFactory.createProduct(vendor1.id, { price: 50.00 });
      const product2 = await testFactory.createProduct(vendor2.id, { price: 75.00 });

      const orderData = {
        items: [
          { productId: product1.id, quantity: 1, price: 50.00 },
          { productId: product2.id, quantity: 2, price: 75.00 }
        ],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'US'
        },
        paymentMethodId: 'pm_test_123'
      };

      mockPaymentServiceClient.createPaymentIntent.mockResolvedValue({
        id: 'pi_test_123',
        clientSecret: 'pi_test_123_secret_test',
        status: 'requires_confirmation',
        amount: 21600, // $216.00 in cents
        currency: 'usd'
      });

      mockPaymentServiceClient.confirmPayment.mockResolvedValue({
        success: true,
        paymentIntentId: 'pi_test_123',
        status: 'succeeded'
      });

      mockNotificationServiceClient.sendOrderConfirmation.mockResolvedValue(undefined);
      mockNotificationServiceClient.sendVendorOrderNotification.mockResolvedValue(undefined);

      const order = await orderService.createOrder(customerId, orderData);

      expect(order.vendorOrders).toHaveLength(2);

      const vendor1Order = order.vendorOrders.find(vo => vo.vendorId === vendor1.id);
      const vendor2Order = order.vendorOrders.find(vo => vo.vendorId === vendor2.id);

      expect(vendor1Order).toBeDefined();
      expect(vendor1Order!.subtotal).toBe(50.00);
      expect(vendor1Order!.items).toHaveLength(1);

      expect(vendor2Order).toBeDefined();
      expect(vendor2Order!.subtotal).toBe(150.00);
      expect(vendor2Order!.items).toHaveLength(1);

      expect(mockNotificationServiceClient.sendVendorOrderNotification).toHaveBeenCalledTimes(2);
    });

    it('should validate inventory before creating order', async () => {
      const customerId = 'customer-1';
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, {
        inventory: { quantity: 2, trackQuantity: true }
      });

      const orderData = {
        items: [{
          productId: product.id,
          quantity: 5, // More than available
          price: 100.00
        }],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'US'
        },
        paymentMethodId: 'pm_test_123'
      };

      await expect(orderService.createOrder(customerId, orderData))
        .rejects.toThrow('Insufficient inventory');
    });
  });

  describe('getOrder', () => {
    it('should return order with all relations', async () => {
      const customerId = 'customer-1';
      const order = await testFactory.createOrder(customerId);

      const result = await orderService.getOrder(order.id, customerId);

      expect(result).toMatchObject({
        id: order.id,
        customerId,
        status: OrderStatus.PENDING
      });
    });

    it('should throw error for non-existent order', async () => {
      await expect(orderService.getOrder('non-existent', 'customer-1'))
        .rejects.toThrow('Order not found');
    });

    it('should throw error for unauthorized access', async () => {
      const order = await testFactory.createOrder('customer-1');

      await expect(orderService.getOrder(order.id, 'customer-2'))
        .rejects.toThrow('Order not found');
    });
  });

  describe('getOrderHistory', () => {
    it('should return paginated order history', async () => {
      const customerId = 'customer-1';

      // Create multiple orders
      await testFactory.createOrder(customerId, { status: OrderStatus.DELIVERED });
      await testFactory.createOrder(customerId, { status: OrderStatus.SHIPPED });
      await testFactory.createOrder(customerId, { status: OrderStatus.PENDING });

      const result = await orderService.getOrderHistory(customerId, {
        page: 1,
        limit: 2
      });

      expect(result.orders).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(2);
    });

    it('should filter orders by status', async () => {
      const customerId = 'customer-1';

      await testFactory.createOrder(customerId, { status: OrderStatus.DELIVERED });
      await testFactory.createOrder(customerId, { status: OrderStatus.SHIPPED });
      await testFactory.createOrder(customerId, { status: OrderStatus.PENDING });

      const result = await orderService.getOrderHistory(customerId, {
        status: OrderStatus.DELIVERED
      });

      expect(result.orders).toHaveLength(1);
      expect(result.orders[0].status).toBe(OrderStatus.DELIVERED);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status successfully', async () => {
      const customerId = 'customer-1';
      const order = await testFactory.createOrder(customerId, { status: OrderStatus.CONFIRMED });

      mockNotificationServiceClient.sendOrderStatusUpdate.mockResolvedValue(undefined);

      const updatedOrder = await orderService.updateOrderStatus(order.id, OrderStatus.PROCESSING);

      expect(updatedOrder.status).toBe(OrderStatus.PROCESSING);
      expect(mockNotificationServiceClient.sendOrderStatusUpdate).toHaveBeenCalledWith(
        customerId,
        expect.objectContaining({ status: OrderStatus.PROCESSING }),
        OrderStatus.CONFIRMED
      );
    });

    it('should validate status transitions', async () => {
      const customerId = 'customer-1';
      const order = await testFactory.createOrder(customerId, { status: OrderStatus.DELIVERED });

      await expect(orderService.updateOrderStatus(order.id, OrderStatus.PENDING))
        .rejects.toThrow('Invalid status transition');
    });
  });

  describe('cancelOrder', () => {
    it('should cancel order and restore inventory', async () => {
      const customerId = 'customer-1';
      const vendor = await testFactory.createVendor();
      const product = await testFactory.createProduct(vendor.id, {
        inventory: { quantity: 8, trackQuantity: true }
      });

      const order = await testFactory.createOrder(customerId, { status: OrderStatus.CONFIRMED });

      // Create order item
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity: 2,
          price: 100.00
        }
      });

      mockPaymentServiceClient.refundPayment.mockResolvedValue({
        success: true,
        refundId: 'rf_test_123',
        amount: 21600
      });

      mockNotificationServiceClient.sendOrderStatusUpdate.mockResolvedValue(undefined);

      const cancelledOrder = await orderService.cancelOrder(order.id, customerId);

      expect(cancelledOrder.status).toBe(OrderStatus.CANCELLED);

      // Verify inventory was restored
      const updatedProduct = await prisma.product.findUnique({ where: { id: product.id } });
      expect(updatedProduct!.inventory.quantity).toBe(10); // 8 + 2 restored

      expect(mockPaymentServiceClient.refundPayment).toHaveBeenCalledWith(order.paymentIntentId);
    });

    it('should not allow cancellation of delivered orders', async () => {
      const customerId = 'customer-1';
      const order = await testFactory.createOrder(customerId, { status: OrderStatus.DELIVERED });

      await expect(orderService.cancelOrder(order.id, customerId))
        .rejects.toThrow('Cannot cancel order in current status');
    });
  });
});