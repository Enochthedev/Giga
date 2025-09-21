import { CreateOrderSchema } from '@platform/types';
import { OrderStatus } from '@prisma/client';
import { Request, Response } from 'express';
import { z } from 'zod';
import { HttpAuthServiceClient } from '../clients/auth.client';
import { HttpNotificationServiceClient } from '../clients/notification.client';
import { HttpPaymentServiceClient } from '../clients/payment.client';
import { CartService } from '../services/cart.service';
import { EnhancedOrderService } from '../services/enhanced-order.service';
import { InventoryService } from '../services/inventory.service';
import { OrderFilters, OrderService } from '../services/order.service';

// Extend Request interface for user properties
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    sub: string;
    email: string;
    roles: string[];
    activeRole: string;
    vendorId?: string;
  };
}

// Request validation schemas
const OrderFiltersSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
});

const UpdateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  trackingNumber: z.string().optional(),
});

const CancelOrderSchema = z.object({
  reason: z.string().optional(),
});

export class OrderController {
  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private inventoryService: InventoryService,
    private authServiceClient: HttpAuthServiceClient,
    private paymentServiceClient: HttpPaymentServiceClient,
    private notificationServiceClient: HttpNotificationServiceClient
  ) {}

  /**
   * POST /api/v1/orders - Create order from cart
   */
  async createOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Validate request body
      const validationResult = CreateOrderSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid order data',
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const orderData = validationResult.data;
      const customerId = req.user.id;

      // Create order
      const order = await this.orderService.createOrder(customerId, {
        shippingAddress: orderData.shippingAddress,
        paymentMethodId: orderData.paymentMethodId,
        notes: orderData.notes,
      });

      res.status(201).json({
        success: true,
        data: { order },
        message: 'Order created successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Create order error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create order';
      const statusCode =
        errorMessage.includes('Cart is empty') ||
        errorMessage.includes('validation failed') ||
        errorMessage.includes('reservation failed')
          ? 400
          : 500;

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/orders - Get order history with pagination and filters
   */
  async getOrderHistory(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Validate query parameters
      const validationResult = OrderFiltersSchema.safeParse(req.query);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid query parameters',
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const filters: OrderFilters = validationResult.data;
      const customerId = req.user.id;

      const result = await this.orderService.getOrderHistory(
        customerId,
        filters
      );

      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get order history error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve order history',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/orders/:id - Get specific order details
   */
  async getOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const orderId = req.params.id;
      const customerId = req.user.id;

      if (!orderId) {
        res.status(400).json({
          success: false,
          error: 'Order ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const order = await this.orderService.getOrder(orderId, customerId);

      res.json({
        success: true,
        data: { order },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get order error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to retrieve order';
      const statusCode = errorMessage.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * PUT /api/v1/orders/:id/status - Update order status (admin only)
   */
  async updateOrderStatus(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if user has admin permissions
      const hasPermission = await this.authServiceClient.checkUserPermission(
        req.user.id,
        'orders:update_status'
      );

      if (!hasPermission) {
        res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const orderId = req.params.id;

      if (!orderId) {
        res.status(400).json({
          success: false,
          error: 'Order ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Validate request body
      const validationResult = UpdateOrderStatusSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid status update data',
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { status } = validationResult.data;

      const order = await this.orderService.updateOrderStatus(orderId, status);

      res.json({
        success: true,
        data: { order },
        message: 'Order status updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Update order status error:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update order status';
      const statusCode = errorMessage.includes('not found')
        ? 404
        : errorMessage.includes('Invalid status transition')
          ? 400
          : 500;

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * DELETE /api/v1/orders/:id/cancel - Cancel order
   */
  async cancelOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const orderId = req.params.id;
      const customerId = req.user.id;

      if (!orderId) {
        res.status(400).json({
          success: false,
          error: 'Order ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Validate request body (optional reason)
      const validationResult = CancelOrderSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid cancellation data',
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { reason } = validationResult.data;

      const order = await this.orderService.cancelOrder(
        orderId,
        customerId,
        reason
      );

      res.json({
        success: true,
        data: { order },
        message: 'Order cancelled successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Cancel order error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to cancel order';
      const statusCode = errorMessage.includes('not found')
        ? 404
        : errorMessage.includes('already cancelled') ||
            errorMessage.includes('Cannot cancel')
          ? 400
          : 500;

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/vendor/orders - Get vendor orders (vendor only)
   */
  async getVendorOrders(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if user is a vendor
      if (!req.user.vendorId) {
        res.status(403).json({
          success: false,
          error: 'Vendor access required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Validate query parameters
      const validationResult = OrderFiltersSchema.safeParse(req.query);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid query parameters',
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const filters: OrderFilters = validationResult.data;
      const vendorId = req.user.vendorId;

      const result = await this.orderService.getVendorOrders(vendorId, filters);

      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get vendor orders error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve vendor orders',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * PUT /api/v1/vendor/orders/:id/status - Update vendor order status (vendor only)
   */
  async updateVendorOrderStatus(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if user is a vendor
      if (!req.user.vendorId) {
        res.status(403).json({
          success: false,
          error: 'Vendor access required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const vendorOrderId = req.params.id;

      if (!vendorOrderId) {
        res.status(400).json({
          success: false,
          error: 'Vendor order ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Validate request body
      const validationResult = UpdateOrderStatusSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid status update data',
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { status, trackingNumber } = validationResult.data;

      const vendorOrder = await this.orderService.updateVendorOrderStatus(
        vendorOrderId,
        status,
        trackingNumber
      );

      res.json({
        success: true,
        data: { vendorOrder },
        message: 'Vendor order status updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Update vendor order status error:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update vendor order status';
      const statusCode = errorMessage.includes('not found')
        ? 404
        : errorMessage.includes('Invalid status transition')
          ? 400
          : 500;

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/orders/:id/payment-status - Get payment status for order
   */
  async getOrderPaymentStatus(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const orderId = req.params.id;
      const customerId = req.user.id;

      if (!orderId) {
        res.status(400).json({
          success: false,
          error: 'Order ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const order = await this.orderService.getOrder(orderId, customerId);

      if (!order.paymentIntentId) {
        res.status(404).json({
          success: false,
          error: 'No payment intent found for this order',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const paymentStatus = await this.paymentServiceClient.getPaymentStatus(
        order.paymentIntentId
      );

      res.json({
        success: true,
        data: {
          orderId: order.id,
          paymentStatus: order.paymentStatus,
          paymentIntentId: order.paymentIntentId,
          paymentDetails: paymentStatus,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get order payment status error:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to retrieve payment status';
      const statusCode = errorMessage.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /api/v1/orders/:id/confirm-payment - Confirm payment for order
   */
  async confirmOrderPayment(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const orderId = req.params.id;
      const customerId = req.user.id;

      if (!orderId) {
        res.status(400).json({
          success: false,
          error: 'Order ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Use enhanced order service if available for distributed transaction handling
      if (this.orderService instanceof EnhancedOrderService) {
        const updatedOrder = await this.orderService.confirmOrderPayment(
          orderId,
          customerId
        );

        res.json({
          success: true,
          data: { order: updatedOrder },
          message:
            'Payment confirmed successfully using distributed transactions',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Fallback to original implementation
      const order = await this.orderService.getOrder(orderId, customerId);

      if (!order.paymentIntentId) {
        res.status(400).json({
          success: false,
          error: 'No payment intent found for this order',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (order.paymentStatus === 'PAID') {
        res.status(400).json({
          success: false,
          error: 'Payment already confirmed',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Confirm payment with payment service
      const paymentResult = await this.paymentServiceClient.confirmPayment(
        order.paymentIntentId
      );

      if (paymentResult.success) {
        // Update order status to confirmed
        const updatedOrder = await this.orderService.updateOrderStatus(
          orderId,
          OrderStatus.CONFIRMED
        );

        res.json({
          success: true,
          data: {
            order: updatedOrder,
            paymentResult,
          },
          message: 'Payment confirmed successfully',
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(400).json({
          success: false,
          error: paymentResult.error || 'Payment confirmation failed',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Confirm order payment error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to confirm payment';
      const statusCode = errorMessage.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/orders/:id/saga-status - Get saga execution status (admin only)
   */
  async getSagaStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if user has admin permissions
      const hasPermission = await this.authServiceClient.checkUserPermission(
        req.user.id,
        'orders:view_saga_status'
      );

      if (!hasPermission) {
        res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const sagaId = req.params.id;

      if (!sagaId) {
        res.status(400).json({
          success: false,
          error: 'Saga ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (!(this.orderService instanceof EnhancedOrderService)) {
        res.status(501).json({
          success: false,
          error: 'Saga pattern not enabled',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const sagaStatus = await this.orderService.getSagaStatus(sagaId);

      res.json({
        success: true,
        data: { sagaStatus },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get saga status error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to get saga status';
      res.status(500).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/orders/:id/transaction-status - Get transaction status (admin only)
   */
  async getTransactionStatus(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if user has admin permissions
      const hasPermission = await this.authServiceClient.checkUserPermission(
        req.user.id,
        'orders:view_transaction_status'
      );

      if (!hasPermission) {
        res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const transactionId = req.params.id;

      if (!transactionId) {
        res.status(400).json({
          success: false,
          error: 'Transaction ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (!(this.orderService instanceof EnhancedOrderService)) {
        res.status(501).json({
          success: false,
          error: 'Distributed transactions not enabled',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const transactionStatus =
        await this.orderService.getTransactionStatus(transactionId);

      res.json({
        success: true,
        data: { transactionStatus },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get transaction status error:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to get transaction status';
      res.status(500).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /api/v1/orders/:id/retry-saga - Retry failed saga (admin only)
   */
  async retrySaga(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if user has admin permissions
      const hasPermission = await this.authServiceClient.checkUserPermission(
        req.user.id,
        'orders:retry_saga'
      );

      if (!hasPermission) {
        res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const sagaId = req.params.id;

      if (!sagaId) {
        res.status(400).json({
          success: false,
          error: 'Saga ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (!(this.orderService instanceof EnhancedOrderService)) {
        res.status(501).json({
          success: false,
          error: 'Saga pattern not enabled',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const sagaResult = await this.orderService.retrySaga(sagaId);

      res.json({
        success: true,
        data: { sagaResult },
        message: sagaResult.success
          ? 'Saga retried successfully'
          : 'Saga retry failed',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Retry saga error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to retry saga';
      res.status(500).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /api/v1/orders/:id/retry-transaction - Retry failed transaction (admin only)
   */
  async retryTransaction(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if user has admin permissions
      const hasPermission = await this.authServiceClient.checkUserPermission(
        req.user.id,
        'orders:retry_transaction'
      );

      if (!hasPermission) {
        res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const transactionId = req.params.id;

      if (!transactionId) {
        res.status(400).json({
          success: false,
          error: 'Transaction ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (!(this.orderService instanceof EnhancedOrderService)) {
        res.status(501).json({
          success: false,
          error: 'Distributed transactions not enabled',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const transactionResult =
        await this.orderService.retryTransaction(transactionId);

      res.json({
        success: true,
        data: { transactionResult },
        message: transactionResult.success
          ? 'Transaction retried successfully'
          : 'Transaction retry failed',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Retry transaction error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to retry transaction';
      res.status(500).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/orders/processing-metrics - Get order processing metrics (admin only)
   */
  async getOrderProcessingMetrics(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if user has admin permissions
      const hasPermission = await this.authServiceClient.checkUserPermission(
        req.user.id,
        'orders:view_metrics'
      );

      if (!hasPermission) {
        res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Parse time range from query parameters
      const fromDate = req.query.from
        ? new Date(req.query.from as string)
        : new Date(Date.now() - 24 * 60 * 60 * 1000);
      const toDate = req.query.to
        ? new Date(req.query.to as string)
        : new Date();

      if (!(this.orderService instanceof EnhancedOrderService)) {
        res.status(501).json({
          success: false,
          error: 'Enhanced order processing metrics not available',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const metrics = await this.orderService.getOrderProcessingMetrics({
        from: fromDate,
        to: toDate,
      });

      res.json({
        success: true,
        data: { metrics },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get order processing metrics error:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to get order processing metrics';
      res.status(500).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
