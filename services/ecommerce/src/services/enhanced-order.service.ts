import { Order } from '@platform/types';
import { HttpAuthServiceClient } from '../clients/auth.client';
import { HttpNotificationServiceClient } from '../clients/notification.client';
import { HttpPaymentServiceClient } from '../clients/payment.client';
import { OrderStatus, PrismaClient } from '../generated/prisma-client';
import { CartService } from './cart.service';
import { InventoryService } from './inventory.service';
import { OrderSagaOrchestrator, SagaResult } from './order-saga.service';
import { CreateOrderRequest, OrderService } from './order.service';
import {
  TransactionCoordinator,
  TransactionResult,
} from './transaction-coordinator.service';

/**
 * Enhanced order service that uses saga pattern and distributed transactions
 * for reliable order processing across multiple services
 */
export class EnhancedOrderService extends OrderService {
  private sagaOrchestrator: OrderSagaOrchestrator;
  private transactionCoordinator: TransactionCoordinator;

  constructor(
    prisma: PrismaClient,
    cartService: CartService,
    inventoryService: InventoryService,
    authServiceClient: HttpAuthServiceClient,
    paymentServiceClient: HttpPaymentServiceClient,
    notificationServiceClient: HttpNotificationServiceClient
  ) {
    super(
      prisma,
      cartService,
      inventoryService,
      authServiceClient,
      paymentServiceClient,
      notificationServiceClient
    );

    this.sagaOrchestrator = new OrderSagaOrchestrator(
      prisma,
      cartService,
      inventoryService,
      authServiceClient,
      paymentServiceClient,
      notificationServiceClient
    );

    this.transactionCoordinator = new TransactionCoordinator(
      prisma,
      authServiceClient,
      paymentServiceClient,
      notificationServiceClient
    );
  }

  /**
   * Create order using saga pattern for distributed transaction handling
   * This overrides the base implementation to use the saga orchestrator
   */
  async createOrder(
    customerId: string,
    orderData: CreateOrderRequest
  ): Promise<Order> {
    console.log(
      `[EnhancedOrderService] Creating order for customer ${customerId} using saga pattern`
    );

    try {
      // Execute order creation saga
      const sagaResult: SagaResult =
        await this.sagaOrchestrator.executeOrderCreation(customerId, orderData);

      if (!sagaResult.success) {
        throw new Error(sagaResult.error || 'Order creation saga failed');
      }

      if (!sagaResult.order) {
        throw new Error(
          'Order creation saga completed but no order was returned'
        );
      }

      console.log(
        `[EnhancedOrderService] Order created successfully: ${sagaResult.order.id}`
      );
      return sagaResult.order;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error(
        `[EnhancedOrderService] Order creation failed: ${errorMessage}`
      );
      throw error;
    }
  }

  /**
   * Update order status using distributed transactions
   */
  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    customerId?: string
  ): Promise<Order> {
    console.log(
      `[EnhancedOrderService] Updating order ${orderId} status to ${status}`
    );

    try {
      // For simple status updates, use the base implementation
      if (this.isSimpleStatusUpdate(status)) {
        return await super.updateOrderStatus(orderId, status, customerId);
      }

      // For complex status updates that involve multiple services, use distributed transactions
      const transactionResult = await this.executeStatusUpdateTransaction(
        orderId,
        status,
        customerId
      );

      if (!transactionResult.success) {
        throw new Error(
          transactionResult.error || 'Status update transaction failed'
        );
      }

      return transactionResult.results['order:update'] as Order;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error(
        `[EnhancedOrderService] Order status update failed: ${errorMessage}`
      );
      throw error;
    }
  }

  /**
   * Cancel order using distributed transactions with proper rollback
   */
  async cancelOrder(
    orderId: string,
    customerId: string,
    reason?: string
  ): Promise<Order> {
    console.log(
      `[EnhancedOrderService] Cancelling order ${orderId} for customer ${customerId}`
    );

    try {
      // Execute order cancellation as a distributed transaction
      const transactionResult = await this.executeCancellationTransaction(
        orderId,
        customerId,
        reason
      );

      if (!transactionResult.success) {
        throw new Error(
          transactionResult.error || 'Order cancellation transaction failed'
        );
      }

      return transactionResult.results['order:cancel'] as Order;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error(
        `[EnhancedOrderService] Order cancellation failed: ${errorMessage}`
      );
      throw error;
    }
  }

  /**
   * Process payment confirmation using distributed transactions
   */
  async confirmOrderPayment(
    orderId: string,
    customerId: string
  ): Promise<Order> {
    console.log(
      `[EnhancedOrderService] Confirming payment for order ${orderId}`
    );

    try {
      const order = await this.getOrder(orderId, customerId);

      if (!order.paymentIntentId) {
        throw new Error('No payment intent found for this order');
      }

      if (order.paymentStatus === 'PAID') {
        throw new Error('Payment already confirmed');
      }

      // Execute payment confirmation as a distributed transaction
      const transactionResult =
        await this.executePaymentConfirmationTransaction(order);

      if (!transactionResult.success) {
        throw new Error(
          transactionResult.error || 'Payment confirmation transaction failed'
        );
      }

      return transactionResult.results['order:update'] as Order;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error(
        `[EnhancedOrderService] Payment confirmation failed: ${errorMessage}`
      );
      throw error;
    }
  }

  /**
   * Execute status update as a distributed transaction
   */
  private executeStatusUpdateTransaction(
    orderId: string,
    status: OrderStatus,
    customerId?: string
  ): Promise<TransactionResult> {
    const operations = [
      {
        service: 'order',
        operation: 'update',
        payload: { orderId, status, customerId },
        maxRetries: 2,
      },
    ];

    // Add notification operation for customer-facing status updates
    if (customerId && this.shouldNotifyCustomer(status)) {
      operations.push({
        service: 'notification',
        operation: 'send_order_status_update',
        payload: {
          orderId,
          customerId,
          status,
        },
        maxRetries: 1, // Notifications are less critical
      });
    }

    return this.transactionCoordinator.executeTransaction(
      'order_status_update',
      operations,
      { orderId, status, customerId }
    );
  }

  /**
   * Execute order cancellation as a distributed transaction
   */
  private async executeCancellationTransaction(
    orderId: string,
    customerId: string,
    reason?: string
  ): Promise<TransactionResult> {
    const order = await this.getOrder(orderId, customerId);

    const operations = [
      // Cancel payment if pending
      ...(order.paymentIntentId && order.paymentStatus === 'PENDING'
        ? [
            {
              service: 'payment',
              operation: 'cancel_intent',
              payload: { paymentIntentId: order.paymentIntentId },
              maxRetries: 3,
            },
          ]
        : []),

      // Restore inventory
      {
        service: 'inventory',
        operation: 'restore',
        payload: {
          items: order.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
        maxRetries: 2,
      },

      // Update order status
      {
        service: 'order',
        operation: 'cancel',
        payload: { orderId, customerId, reason },
        maxRetries: 2,
      },

      // Send cancellation notification
      {
        service: 'notification',
        operation: 'send_order_cancellation',
        payload: {
          orderId,
          customerEmail: 'customer@example.com', // This should come from user service
          customerName: 'Customer', // This should come from user service
          orderTotal: order.total,
          orderItems: order.items.map(item => ({
            productName: item.product?.name || 'Unknown Product',
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: order.shippingAddress,
          reason,
        },
        maxRetries: 1,
      },
    ];

    return this.transactionCoordinator.executeTransaction(
      'order_cancellation',
      operations,
      { orderId, customerId, reason }
    );
  }

  /**
   * Execute payment confirmation as a distributed transaction
   */
  private executePaymentConfirmationTransaction(
    order: Order
  ): Promise<TransactionResult> {
    const operations = [
      // Confirm payment
      {
        service: 'payment',
        operation: 'confirm',
        payload: { paymentIntentId: order.paymentIntentId },
        maxRetries: 3,
      },

      // Update order status to confirmed
      {
        service: 'order',
        operation: 'update',
        payload: {
          orderId: order.id,
          status: OrderStatus.CONFIRMED,
          paymentStatus: 'PAID',
        },
        maxRetries: 2,
      },

      // Send payment confirmation notification
      {
        service: 'notification',
        operation: 'send_payment_confirmation',
        payload: {
          orderId: order.id,
          customerEmail: 'customer@example.com', // This should come from user service
          customerName: 'Customer', // This should come from user service
          orderTotal: order.total,
          paymentMethod: order.paymentMethod,
        },
        maxRetries: 1,
      },
    ];

    return this.transactionCoordinator.executeTransaction(
      'payment_confirmation',
      operations,
      { orderId: order.id, paymentIntentId: order.paymentIntentId }
    );
  }

  /**
   * Check if a status update is simple (doesn't require distributed transactions)
   */
  private isSimpleStatusUpdate(status: OrderStatus): boolean {
    // Simple status updates that don't involve external services
    const simpleStatuses: OrderStatus[] = [
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
    ];
    return simpleStatuses.includes(status);
  }

  /**
   * Check if customer should be notified for this status change
   */
  private shouldNotifyCustomer(status: OrderStatus): boolean {
    const notifiableStatuses: OrderStatus[] = [
      OrderStatus.CONFIRMED,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
    ];
    return notifiableStatuses.includes(status);
  }

  /**
   * Get saga execution status for monitoring
   */
  getSagaStatus(_sagaId: string): Promise<any> {
    // In production, this would query the saga state from database
    return Promise.resolve({
      sagaId: _sagaId,
      status: 'UNKNOWN',
      message:
        'Saga status tracking not implemented - requires persistent saga storage',
    });
  }

  /**
   * Get transaction status for monitoring
   */
  getTransactionStatus(transactionId: string): Promise<unknown> {
    return this.transactionCoordinator.getTransactionStatus(transactionId);
  }

  /**
   * Retry a failed saga
   */
  retrySaga(_sagaId: string): Promise<SagaResult> {
    // In production, this would load the saga state and retry from the failed step
    throw new Error(
      'Saga retry not implemented - requires persistent saga storage'
    );
  }

  /**
   * Retry a failed transaction
   */
  retryTransaction(transactionId: string): Promise<TransactionResult> {
    return this.transactionCoordinator.retryTransaction(transactionId);
  }

  /**
   * Get order processing metrics for monitoring
   */
  async getOrderProcessingMetrics(timeRange: {
    from: Date;
    to: Date;
  }): Promise<{
    totalOrders: number;
    successfulOrders: number;
    failedOrders: number;
    averageProcessingTime: number;
    sagaSuccessRate: number;
    transactionSuccessRate: number;
  }> {
    // In production, this would query order processing logs and calculate metrics
    const baseMetrics = {
      totalOrders: 0,
      successfulOrders: 0,
      failedOrders: 0,
      averageProcessingTime: 0,
    };

    const transactionMetrics =
      await this.transactionCoordinator.getTransactionMetrics(timeRange);

    return {
      ...baseMetrics,
      sagaSuccessRate: 0, // Would be calculated from saga logs
      transactionSuccessRate:
        transactionMetrics.totalTransactions > 0
          ? transactionMetrics.successfulTransactions /
            transactionMetrics.totalTransactions
          : 0,
    };
  }
}
