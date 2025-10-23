import { Cart, Order } from '@platform/types';
import { v4 as uuidv4 } from 'uuid';
import { HttpPaymentServiceClient } from '../clients/payment.client';
import { PrismaClient } from '../generated/prisma-client';
import { CartService } from './cart.service';
import { InventoryService } from './inventory.service';
import { OrderService } from './order.service';

export interface CheckoutData {
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    country: string;
    phone?: string;
  };
  paymentMethodId: string;
  notes?: string;
}

export interface CheckoutContext {
  userInfo?: {
    id: string;
    email: string;
    roles: string[];
  };
  sessionId?: string;
  isAuthenticated: boolean;
}

export interface CheckoutResult {
  checkoutId: string;
  customerId: string;
  cart: Cart;
  paymentIntent: {
    id: string;
    clientSecret: string;
    amount: number;
    currency: string;
    status: string;
  };
  shippingAddress: CheckoutData['shippingAddress'];
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
  expiresAt: string;
}

export interface PaymentConfirmationResult {
  order: Order;
  paymentResult: {
    success: boolean;
    paymentIntentId: string;
    status: string;
    transactionId?: string;
  };
}

export interface CheckoutSummary {
  customerId: string;
  cart: Cart;
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    breakdown: {
      itemsTotal: number;
      taxRate: number;
      shippingCost: number;
      discounts: number;
    };
  };
  validation: {
    isValid: boolean;
    issues: string[];
    canProceedToCheckout: boolean;
  };
  customerInfo: {
    isAuthenticated: boolean;
    email?: string;
    previousOrders: number;
  };
}

export class CheckoutService {
  constructor(
    private _prisma: PrismaClient,
    private cartService: CartService,
    private orderService: OrderService,
    private inventoryService: InventoryService,
    private paymentServiceClient: HttpPaymentServiceClient
  ) {}

  /**
   * Initiate checkout process with payment intent creation
   */
  async initiateCheckout(
    customerId: string,
    checkoutData: CheckoutData,
    context: CheckoutContext
  ): Promise<CheckoutResult> {
    // Validate cart and get checkout summary
    const summary = await this.getCheckoutSummary(customerId);

    if (!summary.validation.canProceedToCheckout) {
      throw new Error(
        `Checkout validation failed: ${summary.validation.issues.join(', ')}`
      );
    }

    // Reserve inventory for checkout
    const reservationItems = summary.cart.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const reservation = await this.inventoryService.reserveInventory(
      reservationItems,
      customerId,
      context.sessionId,
      30 // 30 minutes reservation
    );

    if (!reservation.success) {
      throw new Error(
        `Inventory reservation failed: ${reservation.failures.map(f => f.reason).join(', ')}`
      );
    }

    try {
      // Create payment intent
      const paymentIntent = await this.paymentServiceClient.createPaymentIntent(
        Math.round(summary.totals.total * 100), // Convert to cents
        'usd',
        customerId,
        {
          // Service identification
          service: 'ecommerce',
          serviceVersion: '1.0.0',

          // Checkout information
          checkoutId: uuidv4(),
          reservationId: reservation.reservationId,
          breakdown: JSON.stringify(summary.totals.breakdown),

          // Customer information
          customerEmail: context.userInfo?.email || '',
          isAuthenticated: context.isAuthenticated.toString(),

          // Additional context
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',
        }
      );

      // Store checkout session for tracking
      const checkoutId = uuidv4();
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

      // In a production system, you'd store this in Redis or database
      // For now, we'll rely on the payment intent and reservation expiration

      return {
        checkoutId,
        customerId,
        cart: summary.cart,
        paymentIntent: {
          id: paymentIntent.id,
          clientSecret: paymentIntent.clientSecret,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
        },
        shippingAddress: checkoutData.shippingAddress,
        totals: {
          subtotal: summary.totals.subtotal,
          tax: summary.totals.tax,
          shipping: summary.totals.shipping,
          total: summary.totals.total,
        },
        expiresAt: expiresAt.toISOString(),
      };
    } catch (error) {
      // Release inventory reservation on failure
      try {
        await this.inventoryService.releaseReservation(
          reservation.reservationId
        );
      } catch (releaseError) {
        console.error('Failed to release inventory reservation:', releaseError);
      }
      throw error;
    }
  }

  /**
   * Confirm payment and complete order
   */
  async confirmPayment(
    customerId: string,
    paymentIntentId: string,
    context: CheckoutContext
  ): Promise<PaymentConfirmationResult> {
    // Get payment status to ensure it's ready for confirmation
    const paymentStatus =
      await this.paymentServiceClient.getPaymentStatus(paymentIntentId);

    if (
      paymentStatus.status !== 'requires_confirmation' &&
      paymentStatus.status !== 'succeeded'
    ) {
      throw new Error(
        `Payment cannot be confirmed. Current status: ${paymentStatus.status}`
      );
    }

    // Confirm payment with payment service
    const paymentResult =
      await this.paymentServiceClient.confirmPayment(paymentIntentId);

    if (!paymentResult.success) {
      throw new Error(`Payment confirmation failed: ${paymentResult.error}`);
    }

    // For now, use default shipping address since PaymentResult doesn't include metadata
    // In a real implementation, you'd store checkout data separately
    const shippingAddress = {
      name: 'Customer',
      address: 'Address not provided',
      city: 'City not provided',
      country: 'Country not provided',
      phone: undefined,
    };

    // Create order using the order service
    const order = await this.orderService.createOrder(customerId, {
      shippingAddress,
      paymentMethodId: 'confirmed_payment',
      notes: undefined,
    });

    return {
      order,
      paymentResult: {
        success: true,
        paymentIntentId,
        status: paymentResult.status,
        transactionId: paymentResult.transactionId,
      },
    };
  }

  /**
   * Cancel payment intent and release reservations
   */
  async cancelPayment(
    customerId: string,
    paymentIntentId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Get payment status to check if cancellation is possible
      const paymentStatus =
        await this.paymentServiceClient.getPaymentStatus(paymentIntentId);

      if (paymentStatus.status === 'succeeded') {
        throw new Error('Cannot cancel a succeeded payment');
      }

      // Cancel payment intent
      await this.paymentServiceClient.cancelPaymentIntent(paymentIntentId);

      // In a real implementation, you'd track reservations separately
      // For now, we'll skip the reservation release since PaymentResult doesn't include metadata

      return {
        success: true,
        message: 'Payment cancelled successfully',
      };
    } catch (error) {
      console.error('Cancel payment error:', error);
      throw new Error(
        `Failed to cancel payment: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get comprehensive checkout summary
   */
  async getCheckoutSummary(customerId: string): Promise<CheckoutSummary> {
    // Get current cart
    const cart = await this.cartService.getCart(customerId);

    // Validate cart for checkout
    const validation =
      await this.cartService.validateCartForCheckout(customerId);

    // Calculate comprehensive totals
    const totals = await this.calculateCheckoutTotals(cart, customerId);

    // Get customer information
    const customerInfo = await this.getCustomerInfo(customerId);

    return {
      customerId,
      cart,
      totals,
      validation: {
        isValid: validation.isValid,
        issues: validation.issues.map(issue => issue.message),
        canProceedToCheckout: validation.isValid && cart.items.length > 0,
      },
      customerInfo,
    };
  }

  /**
   * Calculate comprehensive checkout totals
   */
  private async calculateCheckoutTotals(
    cart: Cart,
    customerId: string
  ): Promise<CheckoutSummary['totals']> {
    // Calculate items subtotal
    const itemsTotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Calculate tax (simplified - 8% rate)
    const taxRate = 0.08;
    const tax = itemsTotal * taxRate;

    // Calculate shipping (simplified - free over $50)
    const freeShippingThreshold = 50.0;
    const baseShippingCost = 5.99;
    const shippingCost =
      itemsTotal >= freeShippingThreshold ? 0 : baseShippingCost;

    // Calculate discounts (simplified - first-time customer discount)
    let discounts = 0;
    try {
      const orderCount = await this._prisma.order.count({
        where: { customerId },
      });
      if (orderCount === 0) {
        discounts = Math.min(itemsTotal * 0.1, 20.0); // 10% discount, max $20
      }
    } catch (error) {
      console.error('Error calculating discounts:', error);
    }

    const subtotal = itemsTotal - discounts;
    const total = subtotal + tax + shippingCost;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      shipping: Math.round(shippingCost * 100) / 100,
      total: Math.round(total * 100) / 100,
      breakdown: {
        itemsTotal: Math.round(itemsTotal * 100) / 100,
        taxRate,
        shippingCost: Math.round(shippingCost * 100) / 100,
        discounts: Math.round(discounts * 100) / 100,
      },
    };
  }

  /**
   * Get customer information for checkout
   */
  private async getCustomerInfo(
    customerId: string
  ): Promise<CheckoutSummary['customerInfo']> {
    const isAuthenticated = !customerId.startsWith('anonymous_');

    if (!isAuthenticated) {
      return {
        isAuthenticated: false,
        previousOrders: 0,
      };
    }

    try {
      // Get previous order count
      const previousOrders = await this._prisma.order.count({
        where: { customerId },
      });

      // In a real implementation, you'd get user info from auth service
      // For now, we'll return basic info
      return {
        isAuthenticated: true,
        email: undefined, // Would be fetched from auth service
        previousOrders,
      };
    } catch (error) {
      console.error('Error getting customer info:', error);
      return {
        isAuthenticated: true,
        previousOrders: 0,
      };
    }
  }
}
