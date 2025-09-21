import { Order } from '@platform/types';
import { v4 as uuidv4 } from 'uuid';
import { HttpAuthServiceClient, UserInfo } from '../clients/auth.client';
import { HttpNotificationServiceClient } from '../clients/notification.client';
import {
  HttpPaymentServiceClient,
  PaymentIntent,
} from '../clients/payment.client';
import {
  OrderStatus,
  PaymentStatus,
  PrismaClient,
} from '../generated/prisma-client';
import { CartService } from './cart.service';
import { InventoryService, ReservationItem } from './inventory.service';
import { CreateOrderRequest } from './order.service';

/**
 * Saga step definition
 */
export interface SagaStep {
  name: string;
  execute: () => Promise<any>;
  compensate: () => Promise<void>;
  retryable: boolean;
  maxRetries: number;
}

/**
 * Saga execution context
 */
export interface SagaContext {
  sagaId: string;
  customerId: string;
  orderData: CreateOrderRequest;
  executedSteps: string[];
  compensationData: Record<string, any>;
  currentStep: number;
  status:
    | 'PENDING'
    | 'EXECUTING'
    | 'COMPLETED'
    | 'FAILED'
    | 'COMPENSATING'
    | 'COMPENSATED';
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Saga execution result
 */
export interface SagaResult {
  success: boolean;
  order?: Order;
  error?: string;
  compensationExecuted: boolean;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries: number;
  backoffStrategy: 'linear' | 'exponential';
  initialDelay: number;
  maxDelay: number;
}

/**
 * Order creation saga orchestrator implementing the saga pattern
 * for distributed transaction handling across multiple services
 */
export class OrderSagaOrchestrator {
  private readonly defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    backoffStrategy: 'exponential',
    initialDelay: 1000,
    maxDelay: 30000,
  };

  constructor(
    private prisma: PrismaClient,
    private cartService: CartService,
    private inventoryService: InventoryService,
    private authServiceClient: HttpAuthServiceClient,
    private paymentServiceClient: HttpPaymentServiceClient,
    private notificationServiceClient: HttpNotificationServiceClient
  ) {}

  /**
   * Execute order creation saga with full transaction coordination
   */
  async executeOrderCreation(
    customerId: string,
    orderData: CreateOrderRequest
  ): Promise<SagaResult> {
    const sagaId = `saga_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Initialize saga context
    const context: SagaContext = {
      sagaId,
      customerId,
      orderData,
      executedSteps: [],
      compensationData: {},
      currentStep: 0,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Log saga start
    await this.logSagaEvent(
      context,
      'SAGA_STARTED',
      'Order creation saga initiated'
    );

    try {
      context.status = 'EXECUTING';
      await this.updateSagaContext(context);

      // Define saga steps
      const steps = this.buildOrderCreationSteps(context);

      // Execute steps sequentially
      for (let i = 0; i < steps.length; i++) {
        context.currentStep = i;
        const step = steps[i];

        try {
          await this.logSagaEvent(
            context,
            'STEP_STARTED',
            `Executing step: ${step.name}`
          );

          // Execute step with retry logic
          const result = await this.executeStepWithRetry(step, context);

          // Store result for potential compensation
          context.compensationData[step.name] = result;
          context.executedSteps.push(step.name);

          await this.logSagaEvent(
            context,
            'STEP_COMPLETED',
            `Step completed: ${step.name}`
          );
          await this.updateSagaContext(context);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          context.error = errorMessage;
          context.status = 'FAILED';

          await this.logSagaEvent(
            context,
            'STEP_FAILED',
            `Step failed: ${step.name} - ${errorMessage}`
          );
          await this.updateSagaContext(context);

          // Execute compensation for all completed steps
          const compensationResult = await this.executeCompensation(
            context,
            steps
          );

          return {
            success: false,
            error: errorMessage,
            compensationExecuted: compensationResult,
          };
        }
      }

      // All steps completed successfully
      context.status = 'COMPLETED';
      await this.updateSagaContext(context);
      await this.logSagaEvent(
        context,
        'SAGA_COMPLETED',
        'Order creation saga completed successfully'
      );

      // Extract the created order from compensation data
      const order = context.compensationData['createOrder'] as Order;

      return {
        success: true,
        order,
        compensationExecuted: false,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      context.error = errorMessage;
      context.status = 'FAILED';

      await this.logSagaEvent(
        context,
        'SAGA_FAILED',
        `Saga failed: ${errorMessage}`
      );
      await this.updateSagaContext(context);

      return {
        success: false,
        error: errorMessage,
        compensationExecuted: false,
      };
    }
  }

  /**
   * Build the sequence of steps for order creation saga
   */
  private buildOrderCreationSteps(context: SagaContext): SagaStep[] {
    return [
      {
        name: 'validateCart',
        execute: () => this.validateCartStep(context),
        compensate: () => this.compensateValidateCart(context),
        retryable: true,
        maxRetries: 2,
      },
      {
        name: 'getUserInfo',
        execute: () => this.getUserInfoStep(context),
        compensate: () => this.compensateGetUserInfo(context),
        retryable: true,
        maxRetries: 3,
      },
      {
        name: 'reserveInventory',
        execute: () => this.reserveInventoryStep(context),
        compensate: () => this.compensateReserveInventory(context),
        retryable: true,
        maxRetries: 2,
      },
      {
        name: 'createPaymentIntent',
        execute: () => this.createPaymentIntentStep(context),
        compensate: () => this.compensateCreatePaymentIntent(context),
        retryable: true,
        maxRetries: 3,
      },
      {
        name: 'createOrder',
        execute: () => this.createOrderStep(context),
        compensate: () => this.compensateCreateOrder(context),
        retryable: true,
        maxRetries: 2,
      },
      {
        name: 'convertReservation',
        execute: () => this.convertReservationStep(context),
        compensate: () => this.compensateConvertReservation(context),
        retryable: true,
        maxRetries: 2,
      },
      {
        name: 'clearCart',
        execute: () => this.clearCartStep(context),
        compensate: () => this.compensateClearCart(context),
        retryable: true,
        maxRetries: 2,
      },
      {
        name: 'sendNotifications',
        execute: () => this.sendNotificationsStep(context),
        compensate: () => this.compensateSendNotifications(context),
        retryable: false, // Notifications are not critical for order success
        maxRetries: 1,
      },
    ];
  }

  /**
   * Execute a step with retry logic and exponential backoff
   */
  private async executeStepWithRetry(
    step: SagaStep,
    context: SagaContext,
    retryConfig: RetryConfig = this.defaultRetryConfig
  ): Promise<any> {
    const maxRetries = step.retryable
      ? Math.min(step.maxRetries, retryConfig.maxRetries)
      : 0;
    let lastError: Error = new Error('Unknown error occurred');

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await step.execute();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        await this.logSagaEvent(
          context,
          'STEP_RETRY',
          `Step ${step.name} failed (attempt ${attempt + 1}/${maxRetries + 1}): ${lastError.message}`
        );

        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          break;
        }

        // Calculate delay for next retry
        const delay = this.calculateRetryDelay(attempt, retryConfig);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private calculateRetryDelay(attempt: number, config: RetryConfig): number {
    let delay: number;

    if (config.backoffStrategy === 'exponential') {
      delay = config.initialDelay * Math.pow(2, attempt);
    } else {
      delay = config.initialDelay * (attempt + 1);
    }

    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * delay;
    delay += jitter;

    return Math.min(delay, config.maxDelay);
  }

  /**
   * Execute compensation for all completed steps in reverse order
   */
  private async executeCompensation(
    context: SagaContext,
    steps: SagaStep[]
  ): Promise<boolean> {
    context.status = 'COMPENSATING';
    await this.updateSagaContext(context);
    await this.logSagaEvent(
      context,
      'COMPENSATION_STARTED',
      'Starting compensation for failed saga'
    );

    let compensationSuccess = true;

    // Execute compensation in reverse order
    const completedSteps = context.executedSteps.slice().reverse();

    for (const stepName of completedSteps) {
      const step = steps.find(s => s.name === stepName);
      if (!step) continue;

      try {
        await this.logSagaEvent(
          context,
          'COMPENSATION_STEP_STARTED',
          `Compensating step: ${stepName}`
        );
        await step.compensate();
        await this.logSagaEvent(
          context,
          'COMPENSATION_STEP_COMPLETED',
          `Compensation completed for step: ${stepName}`
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        await this.logSagaEvent(
          context,
          'COMPENSATION_STEP_FAILED',
          `Compensation failed for step: ${stepName} - ${errorMessage}`
        );
        compensationSuccess = false;
        // Continue with other compensations even if one fails
      }
    }

    context.status = compensationSuccess ? 'COMPENSATED' : 'FAILED';
    await this.updateSagaContext(context);

    const message = compensationSuccess
      ? 'All compensations completed successfully'
      : 'Some compensations failed - manual intervention may be required';

    await this.logSagaEvent(context, 'COMPENSATION_COMPLETED', message);

    return compensationSuccess;
  }

  // Saga Steps Implementation

  /**
   * Step 1: Validate cart and ensure it's ready for checkout
   */
  private async validateCartStep(context: SagaContext): Promise<any> {
    const cart = await this.cartService.getCart(context.customerId);

    if (!cart.items || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    const validation = await this.cartService.validateCartForCheckout(
      context.customerId
    );
    if (!validation.isValid) {
      throw new Error(
        `Cart validation failed: ${validation.issues.map(i => i.message).join(', ')}`
      );
    }

    return { cart, validation };
  }

  private async compensateValidateCart(_context: SagaContext): Promise<void> {
    // No compensation needed for validation
  }

  /**
   * Step 2: Get user information from auth service
   */
  private getUserInfoStep(context: SagaContext): Promise<UserInfo> {
    return this.authServiceClient.getUserInfo(context.customerId);
  }

  private async compensateGetUserInfo(_context: SagaContext): Promise<void> {
    // No compensation needed for getting user info
  }

  /**
   * Step 3: Reserve inventory for all cart items
   */
  private async reserveInventoryStep(context: SagaContext): Promise<any> {
    const cartData = context.compensationData['validateCart'];
    const cart = cartData.cart;

    const reservationItems: ReservationItem[] = cart.items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const reservation = await this.inventoryService.reserveInventory(
      reservationItems,
      context.customerId,
      undefined,
      30 // 30 minutes reservation
    );

    if (!reservation.success) {
      throw new Error(
        `Inventory reservation failed: ${reservation.failures.map(f => f.reason).join(', ')}`
      );
    }

    return reservation;
  }

  private async compensateReserveInventory(
    context: SagaContext
  ): Promise<void> {
    const reservation = context.compensationData['reserveInventory'];
    if (reservation?.reservationId) {
      try {
        await this.inventoryService.releaseReservation(
          reservation.reservationId
        );
      } catch (error) {
        console.error(
          'Failed to release inventory reservation during compensation:',
          error
        );
      }
    }
  }

  /**
   * Step 4: Create payment intent
   */
  private async createPaymentIntentStep(
    context: SagaContext
  ): Promise<PaymentIntent> {
    const cartData = context.compensationData['validateCart'];
    const cart = cartData.cart;
    const reservation = context.compensationData['reserveInventory'];

    const paymentIntent = await this.paymentServiceClient.createPaymentIntent(
      Math.round(cart.total * 100), // Convert to cents
      'usd',
      context.customerId,
      {
        orderId: 'pending',
        reservationId: reservation.reservationId,
        sagaId: context.sagaId,
      }
    );

    return paymentIntent;
  }

  private async compensateCreatePaymentIntent(
    context: SagaContext
  ): Promise<void> {
    const paymentIntent = context.compensationData['createPaymentIntent'];
    if (paymentIntent?.id) {
      try {
        await this.paymentServiceClient.cancelPaymentIntent(paymentIntent.id);
      } catch (error) {
        console.error(
          'Failed to cancel payment intent during compensation:',
          error
        );
      }
    }
  }

  /**
   * Step 5: Create order in database
   */
  private async createOrderStep(context: SagaContext): Promise<Order> {
    const cartData = context.compensationData['validateCart'];
    const cart = cartData.cart;
    const paymentIntent = context.compensationData['createPaymentIntent'];

    // Calculate order totals (simplified version)
    const subtotal = cart.items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal >= 50 ? 0 : 5.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    const order = await this.prisma.$transaction(async tx => {
      // Create main order
      const newOrder = await tx.order.create({
        data: {
          id: uuidv4(),
          customerId: context.customerId,
          status: OrderStatus.PENDING,
          subtotal,
          tax,
          shipping,
          total,
          shippingAddress: context.orderData.shippingAddress,
          paymentMethod: context.orderData.paymentMethodId,
          paymentStatus: PaymentStatus.PENDING,
          paymentIntentId: paymentIntent.id,
          notes: context.orderData.notes,
        },
      });

      // Group items by vendor and create vendor orders
      const vendorGroups = this.groupItemsByVendor(cart.items);
      const vendorOrders = [];
      const allOrderItems = [];

      for (const [vendorId, items] of vendorGroups.entries()) {
        const vendorSubtotal = items.reduce(
          (sum: number, item: any) => sum + item.price * item.quantity,
          0
        );
        const vendorShipping = 0; // Simplified
        const vendorTotal = vendorSubtotal + vendorShipping;

        // Create vendor order
        const vendorOrder = await tx.vendorOrder.create({
          data: {
            id: uuidv4(),
            orderId: newOrder.id,
            vendorId,
            status: OrderStatus.PENDING,
            subtotal: vendorSubtotal,
            shipping: vendorShipping,
            total: vendorTotal,
          },
        });

        // Create order items
        const vendorOrderItems = await Promise.all(
          items.map(async (item: any) => {
            const orderItem = await tx.orderItem.create({
              data: {
                id: uuidv4(),
                orderId: newOrder.id,
                vendorOrderId: vendorOrder.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
              },
              include: {
                product: true,
              },
            });
            return orderItem;
          })
        );

        vendorOrders.push({
          id: vendorOrder.id,
          orderId: vendorOrder.orderId,
          vendorId: vendorOrder.vendorId,
          status: vendorOrder.status as any,
          items: vendorOrderItems.map(this.mapOrderItemToType),
          subtotal: vendorOrder.subtotal,
          shipping: vendorOrder.shipping,
          total: vendorOrder.total,
          trackingNumber: vendorOrder.trackingNumber || undefined,
          estimatedDelivery:
            vendorOrder.estimatedDelivery?.toISOString() || undefined,
          notes: vendorOrder.notes || undefined,
          createdAt: vendorOrder.createdAt.toISOString(),
          updatedAt: vendorOrder.updatedAt.toISOString(),
        });

        allOrderItems.push(...vendorOrderItems.map(this.mapOrderItemToType));
      }

      return {
        id: newOrder.id,
        customerId: newOrder.customerId,
        status: newOrder.status as any,
        items: allOrderItems,
        vendorOrders,
        subtotal: newOrder.subtotal,
        tax: newOrder.tax,
        shipping: newOrder.shipping,
        total: newOrder.total,
        shippingAddress: newOrder.shippingAddress as any,
        paymentMethod: newOrder.paymentMethod,
        paymentStatus: newOrder.paymentStatus as any,
        paymentIntentId: newOrder.paymentIntentId || undefined,
        notes: newOrder.notes || undefined,
        createdAt: newOrder.createdAt.toISOString(),
        updatedAt: newOrder.updatedAt.toISOString(),
      } as Order;
    });

    return order;
  }

  private async compensateCreateOrder(context: SagaContext): Promise<void> {
    const order = context.compensationData['createOrder'];
    if (order?.id) {
      try {
        // Delete the order and related records
        await this.prisma.$transaction(async tx => {
          await tx.orderItem.deleteMany({ where: { orderId: order.id } });
          await tx.vendorOrder.deleteMany({ where: { orderId: order.id } });
          await tx.order.delete({ where: { id: order.id } });
        });
      } catch (error) {
        console.error('Failed to delete order during compensation:', error);
      }
    }
  }

  /**
   * Step 6: Convert inventory reservation to order
   */
  private async convertReservationStep(context: SagaContext): Promise<void> {
    const reservation = context.compensationData['reserveInventory'];
    const order = context.compensationData['createOrder'];

    await this.inventoryService.convertReservationToOrder(
      reservation.reservationId,
      order.id
    );
  }

  private async compensateConvertReservation(
    _context: SagaContext
  ): Promise<void> {
    // Inventory will be restored when the order is deleted
    // No additional compensation needed
  }

  /**
   * Step 7: Clear customer cart
   */
  private async clearCartStep(context: SagaContext): Promise<any> {
    const cartData = context.compensationData['validateCart'];
    const originalCart = cartData.cart;

    await this.cartService.clearCart(context.customerId);

    return { originalCart };
  }

  private async compensateClearCart(context: SagaContext): Promise<void> {
    const clearCartData = context.compensationData['clearCart'];
    if (clearCartData?.originalCart) {
      try {
        // Restore cart items
        const cart = clearCartData.originalCart;
        for (const item of cart.items) {
          await this.cartService.addItem(
            context.customerId,
            item.productId,
            item.quantity
          );
        }
      } catch (error) {
        console.error('Failed to restore cart during compensation:', error);
      }
    }
  }

  /**
   * Step 8: Send notifications (non-critical)
   */
  private async sendNotificationsStep(context: SagaContext): Promise<void> {
    const order = context.compensationData['createOrder'];
    const userInfo = context.compensationData['getUserInfo'];

    try {
      // Send order confirmation to customer
      await this.notificationServiceClient.sendOrderConfirmation({
        orderId: order.id,
        customerEmail: userInfo.email,
        customerName: userInfo.name,
        orderTotal: order.total,
        orderItems: order.items.map((item: any) => ({
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: order.shippingAddress,
      });

      // Send vendor notifications
      for (const vendorOrder of order.vendorOrders) {
        await this.notificationServiceClient.sendVendorOrderNotification({
          vendorId: vendorOrder.vendorId,
          vendorEmail: `vendor-${vendorOrder.vendorId}@example.com`, // This should come from vendor service
          orderId: order.id,
          vendorOrderId: vendorOrder.id,
          orderItems: vendorOrder.items.map((item: any) => ({
            productName: item.product.name,
            quantity: item.quantity,
            price: item.price,
          })),
          customerName: userInfo.name,
          orderTotal: vendorOrder.total,
        });
      }
    } catch (error) {
      // Notifications are non-critical, log but don't fail the saga
      console.warn('Failed to send notifications:', error);
    }
  }

  private async compensateSendNotifications(
    _context: SagaContext
  ): Promise<void> {
    // No compensation needed for notifications
  }

  // Helper Methods

  /**
   * Group cart items by vendor
   */
  private groupItemsByVendor(items: any[]): Map<string, any[]> {
    const groups = new Map<string, any[]>();

    for (const item of items) {
      const vendorId = item.product?.vendorId || 'default';
      if (!groups.has(vendorId)) {
        groups.set(vendorId, []);
      }
      groups.get(vendorId)!.push(item);
    }

    return groups;
  }

  /**
   * Map order item to type
   */
  private mapOrderItemToType(orderItem: any): unknown {
    return {
      id: orderItem.id,
      productId: orderItem.productId,
      quantity: orderItem.quantity,
      price: orderItem.price,
      product: {
        id: orderItem.product.id,
        name: orderItem.product.name,
        description: orderItem.product.description,
        price: orderItem.product.price,
        comparePrice: orderItem.product.comparePrice || undefined,
        sku: orderItem.product.sku || undefined,
        category: orderItem.product.category,
        subcategory: orderItem.product.subcategory || undefined,
        brand: orderItem.product.brand || undefined,
        images: orderItem.product.images,
        specifications:
          (orderItem.product.specifications as Record<string, string>) ||
          undefined,
        vendorId: orderItem.product.vendorId,
        inventory: {
          quantity: 0,
          lowStockThreshold: 0,
          trackQuantity: true,
        },
        isActive: orderItem.product.isActive,
        rating: orderItem.product.rating || undefined,
        reviewCount: orderItem.product.reviewCount,
        createdAt: orderItem.product.createdAt.toISOString(),
        updatedAt: orderItem.product.updatedAt.toISOString(),
      },
    };
  }

  /**
   * Log saga events for monitoring and debugging
   */
  private logSagaEvent(
    context: SagaContext,
    eventType: string,
    message: string
  ): Promise<void> {
    try {
      // In a production system, this would log to a proper logging system
      console.log(`[SAGA ${context.sagaId}] ${eventType}: ${message}`, {
        sagaId: context.sagaId,
        customerId: context.customerId,
        currentStep: context.currentStep,
        status: context.status,
        timestamp: new Date().toISOString(),
      });

      // Could also store in database for audit trail
      // await this.prisma.sagaLog.create({
      //   data: {
      //     sagaId: context.sagaId,
      //     eventType,
      //     message,
      //     context: JSON.stringify(context),
      //   },
      // });
    } catch (error) {
      console.error('Failed to log saga event:', error);
    }

    return Promise.resolve();
  }

  /**
   * Update saga context (could be stored in database for persistence)
   */
  private updateSagaContext(context: SagaContext): Promise<void> {
    context.updatedAt = new Date();

    // In a production system, this would persist the context to database
    // for recovery and monitoring purposes
    // await this.prisma.sagaContext.upsert({
    //   where: { sagaId: context.sagaId },
    //   update: {
    //     status: context.status,
    //     currentStep: context.currentStep,
    //     executedSteps: context.executedSteps,
    //     compensationData: JSON.stringify(context.compensationData),
    //     error: context.error,
    //     updatedAt: context.updatedAt,
    //   },
    //   create: {
    //     sagaId: context.sagaId,
    //     customerId: context.customerId,
    //     orderData: JSON.stringify(context.orderData),
    //     status: context.status,
    //     currentStep: context.currentStep,
    //     executedSteps: context.executedSteps,
    //     compensationData: JSON.stringify(context.compensationData),
    //     error: context.error,
    //     createdAt: context.createdAt,
    //     updatedAt: context.updatedAt,
    //   },
    // });

    return Promise.resolve();
  }
}
