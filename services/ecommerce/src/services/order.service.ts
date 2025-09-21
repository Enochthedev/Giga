import { Order, OrderItem, VendorOrder } from '@platform/types';
import { OrderStatus, PaymentStatus, PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { HttpAuthServiceClient, UserInfo } from '../clients/auth.client';
import {
  HttpNotificationServiceClient,
  OrderNotificationData,
  VendorNotificationData,
} from '../clients/notification.client';
import { HttpPaymentServiceClient } from '../clients/payment.client';
import { CartService } from './cart.service';
import { InventoryService } from './inventory.service';

export interface OrderFilters {
  status?: OrderStatus;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedOrders {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateOrderRequest {
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

export interface OrderValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class OrderService {
  constructor(
    private prisma: PrismaClient,
    private cartService: CartService,
    private inventoryService: InventoryService,
    private authServiceClient: HttpAuthServiceClient,
    private paymentServiceClient: HttpPaymentServiceClient,
    private notificationServiceClient: HttpNotificationServiceClient
  ) {}

  /**
   * Create order from cart with multi-vendor support
   */
  async createOrder(
    customerId: string,
    orderData: CreateOrderRequest
  ): Promise<Order> {
    // Comprehensive order validation
    const validationResult = await this.validateOrderForCreation(
      customerId,
      orderData
    );
    if (!validationResult.isValid) {
      throw new Error(
        `Order validation failed: ${validationResult.errors.join(', ')}`
      );
    }

    // Log warnings if any
    if (validationResult.warnings.length > 0) {
      console.warn('Order creation warnings:', validationResult.warnings);
    }

    // Get customer cart
    const cart = await this.cartService.getCart(customerId);

    // Get customer information
    const customer = await this.authServiceClient.getUserInfo(customerId);

    // Calculate comprehensive order totals
    const orderTotals = await this.calculateOrderTotals(
      cart.items,
      orderData.shippingAddress,
      customerId
    );

    // Reserve inventory for all cart items
    const reservationItems = cart.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const reservation = await this.inventoryService.reserveInventory(
      reservationItems,
      customerId,
      undefined,
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
        Math.round(orderTotals.total * 100), // Convert to cents
        'usd',
        customerId,
        {
          orderId: 'pending',
          reservationId: reservation.reservationId,
          breakdown: JSON.stringify(orderTotals.breakdown),
        }
      );

      // Create order in database transaction
      const order = await this.prisma.$transaction(async tx => {
        // Create main order
        const newOrder = await tx.order.create({
          data: {
            id: uuidv4(),
            customerId,
            status: OrderStatus.PENDING,
            subtotal: orderTotals.subtotal,
            tax: orderTotals.tax,
            shipping: orderTotals.shipping,
            total: orderTotals.total,
            shippingAddress: orderData.shippingAddress,
            paymentMethod: orderData.paymentMethodId,
            paymentStatus: PaymentStatus.PENDING,
            paymentIntentId: paymentIntent.id,
            notes: orderData.notes,
          },
        });

        // Group items by vendor
        const vendorGroups = this.groupItemsByVendor(cart.items);

        // Create vendor orders and order items
        const vendorOrders: VendorOrder[] = [];
        const allOrderItems: OrderItem[] = [];

        for (const [vendorId, items] of vendorGroups.entries()) {
          const vendorSubtotal = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          const vendorShipping = 0; // TODO: Calculate vendor-specific shipping
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

          // Create order items for this vendor
          const vendorOrderItems = await Promise.all(
            items.map(async item => {
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
                    (orderItem.product.specifications as Record<
                      string,
                      string
                    >) || undefined,
                  vendorId: orderItem.product.vendorId,
                  inventory: {
                    quantity: 0, // Will be populated from inventory service if needed
                    lowStockThreshold: 0,
                    trackQuantity: true,
                  },
                  isActive: orderItem.product.isActive,
                  rating: orderItem.product.rating || undefined,
                  reviewCount: orderItem.product.reviewCount,
                  createdAt: orderItem.product.createdAt.toISOString(),
                  updatedAt: orderItem.product.updatedAt.toISOString(),
                },
              } as OrderItem;
            })
          );

          allOrderItems.push(...vendorOrderItems);

          vendorOrders.push({
            id: vendorOrder.id,
            orderId: vendorOrder.orderId,
            vendorId: vendorOrder.vendorId,
            status: vendorOrder.status as any,
            items: vendorOrderItems,
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

      // Convert inventory reservation to order
      await this.inventoryService.convertReservationToOrder(
        reservation.reservationId,
        order.id
      );

      // Clear customer cart
      await this.cartService.clearCart(customerId);

      // Send notifications (non-blocking)
      this.sendOrderNotifications(order, customer).catch(error => {
        console.error('Failed to send order notifications:', error);
      });

      return order;
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
   * Get order by ID with customer validation
   */
  async getOrder(orderId: string, customerId: string): Promise<Order> {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        customerId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        vendorOrders: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return this.mapOrderToType(order);
  }

  /**
   * Get order history with pagination and filters
   */
  async getOrderHistory(
    customerId: string,
    filters: OrderFilters = {}
  ): Promise<PaginatedOrders> {
    const { status, dateFrom, dateTo, page = 1, limit = 10 } = filters;

    const skip = (page - 1) * limit;

    const where: any = {
      customerId,
    };

    if (status) {
      where.status = status;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: true,
            },
          },
          vendorOrders: {
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    const mappedOrders = orders.map(order => this.mapOrderToType(order));

    return {
      orders: mappedOrders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update order status with validation
   */
  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    customerId?: string
  ): Promise<Order> {
    // Get current order
    const currentOrder = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        vendorOrders: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!currentOrder) {
      throw new Error('Order not found');
    }

    // Validate customer access if provided
    if (customerId && currentOrder.customerId !== customerId) {
      throw new Error('Access denied');
    }

    // Validate status transition
    this.validateStatusTransition(currentOrder.status as OrderStatus, status);

    // Update order status
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        vendorOrders: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    const mappedOrder = this.mapOrderToType(updatedOrder);

    // Send status update notifications (non-blocking)
    if (customerId) {
      this.sendStatusUpdateNotifications(
        mappedOrder,
        currentOrder.status as OrderStatus,
        status
      ).catch(error => {
        console.error('Failed to send status update notifications:', error);
      });
    }

    return mappedOrder;
  }

  /**
   * Cancel order with inventory restoration
   */
  async cancelOrder(
    orderId: string,
    customerId: string,
    reason?: string
  ): Promise<Order> {
    // Validate cancellation eligibility
    const cancellationValidation = await this.validateOrderCancellation(
      orderId,
      customerId
    );
    if (!cancellationValidation.isValid) {
      throw new Error(
        `Order cancellation failed: ${cancellationValidation.errors.join(', ')}`
      );
    }

    // Log warnings if any
    if (cancellationValidation.warnings.length > 0) {
      console.warn(
        'Order cancellation warnings:',
        cancellationValidation.warnings
      );
    }

    const order = await this.getOrder(orderId, customerId);

    // Cancel payment if pending
    if (order.paymentIntentId && order.paymentStatus === 'PENDING') {
      try {
        await this.paymentServiceClient.cancelPaymentIntent(
          order.paymentIntentId
        );
      } catch (error) {
        console.error('Failed to cancel payment intent:', error);
      }
    }

    // Restore inventory
    const restoreItems = order.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    try {
      await this.inventoryService.restoreInventory(restoreItems);
    } catch (error) {
      console.error('Failed to restore inventory:', error);
    }

    // Update order status
    const cancelledOrder = await this.updateOrderStatus(
      orderId,
      OrderStatus.CANCELLED
    );

    // Send cancellation notifications (non-blocking)
    this.sendCancellationNotifications(cancelledOrder, reason).catch(error => {
      console.error('Failed to send cancellation notifications:', error);
    });

    return cancelledOrder;
  }

  /**
   * Get vendor orders with filtering
   */
  async getVendorOrders(
    vendorId: string,
    filters: OrderFilters = {}
  ): Promise<PaginatedOrders> {
    const { status, dateFrom, dateTo, page = 1, limit = 10 } = filters;

    const skip = (page - 1) * limit;

    const where: any = {
      vendorId,
    };

    if (status) {
      where.status = status;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }

    const [vendorOrders, total] = await Promise.all([
      this.prisma.vendorOrder.findMany({
        where,
        include: {
          order: true,
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.vendorOrder.count({ where }),
    ]);

    // Convert vendor orders to full orders
    const orders = await Promise.all(
      vendorOrders.map(async vendorOrder => {
        const fullOrder = await this.getOrder(
          vendorOrder.orderId,
          vendorOrder.order.customerId
        );
        return fullOrder;
      })
    );

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update vendor order status
   */
  async updateVendorOrderStatus(
    vendorOrderId: string,
    status: OrderStatus,
    trackingNumber?: string
  ): Promise<VendorOrder> {
    const vendorOrder = await this.prisma.vendorOrder.findUnique({
      where: { id: vendorOrderId },
      include: {
        order: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!vendorOrder) {
      throw new Error('Vendor order not found');
    }

    // Validate status transition
    this.validateStatusTransition(vendorOrder.status as OrderStatus, status);

    // Update vendor order
    const updatedVendorOrder = await this.prisma.vendorOrder.update({
      where: { id: vendorOrderId },
      data: {
        status,
        trackingNumber,
        updatedAt: new Date(),
      },
      include: {
        order: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Check if all vendor orders are complete to update main order
    await this.updateMainOrderStatusFromVendorOrders(vendorOrder.orderId);

    const mappedVendorOrder = this.mapVendorOrderToType(updatedVendorOrder);

    // Send vendor status update notifications (non-blocking)
    this.sendVendorStatusUpdateNotifications(
      mappedVendorOrder,
      vendorOrder.status as OrderStatus,
      status
    ).catch(error => {
      console.error(
        'Failed to send vendor status update notifications:',
        error
      );
    });

    return mappedVendorOrder;
  }

  /**
   * Comprehensive order validation with business rules
   */
  async validateOrderForCreation(
    customerId: string,
    orderData: CreateOrderRequest
  ): Promise<OrderValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Get customer cart
    const cart = await this.cartService.getCart(customerId);

    // Validate cart is not empty
    if (!cart.items || cart.items.length === 0) {
      errors.push('Cart is empty');
      return { isValid: false, errors, warnings };
    }

    // Validate cart items
    const cartValidation =
      await this.cartService.validateCartForCheckout(customerId);
    if (!cartValidation.isValid) {
      errors.push(...cartValidation.issues.map(issue => issue.message));
    }

    // Validate shipping address
    const shippingValidation = this.validateShippingAddress(
      orderData.shippingAddress
    );
    if (!shippingValidation.isValid) {
      errors.push(...shippingValidation.errors);
    }

    // Validate payment method
    if (!orderData.paymentMethodId?.trim()) {
      errors.push('Payment method is required');
    }

    // Validate order totals
    const totalValidation = this.validateOrderTotals(cart);
    if (!totalValidation.isValid) {
      errors.push(...totalValidation.errors);
    }
    warnings.push(...totalValidation.warnings);

    // Validate vendor availability
    const vendorValidation = await this.validateVendorAvailability(cart.items);
    if (!vendorValidation.isValid) {
      errors.push(...vendorValidation.errors);
    }

    // Business rule validations
    const businessValidation = await this.validateBusinessRules(
      customerId,
      cart
    );
    if (!businessValidation.isValid) {
      errors.push(...businessValidation.errors);
    }
    warnings.push(...businessValidation.warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate shipping address
   */
  private validateShippingAddress(address: any): OrderValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!address.name?.trim()) {
      errors.push('Shipping name is required');
    } else if (address.name.length < 2) {
      errors.push('Shipping name must be at least 2 characters');
    } else if (address.name.length > 100) {
      errors.push('Shipping name must be less than 100 characters');
    }

    if (!address.address?.trim()) {
      errors.push('Shipping address is required');
    } else if (address.address.length < 5) {
      errors.push('Shipping address must be at least 5 characters');
    } else if (address.address.length > 200) {
      errors.push('Shipping address must be less than 200 characters');
    }

    if (!address.city?.trim()) {
      errors.push('Shipping city is required');
    } else if (address.city.length < 2) {
      errors.push('Shipping city must be at least 2 characters');
    } else if (address.city.length > 50) {
      errors.push('Shipping city must be less than 50 characters');
    }

    if (!address.country?.trim()) {
      errors.push('Shipping country is required');
    } else if (address.country.length < 2) {
      errors.push('Shipping country must be at least 2 characters');
    } else if (address.country.length > 50) {
      errors.push('Shipping country must be less than 50 characters');
    }

    // Validate phone if provided
    if (address.phone && address.phone.trim()) {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(address.phone.replace(/[\s\-()]/g, ''))) {
        errors.push('Invalid phone number format');
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate order totals and calculations
   */
  private validateOrderTotals(cart: any): OrderValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate minimum order amount
    const minimumOrderAmount = 5.0; // $5 minimum
    if (cart.total < minimumOrderAmount) {
      errors.push(`Minimum order amount is $${minimumOrderAmount.toFixed(2)}`);
    }

    // Validate maximum order amount (fraud prevention)
    const maximumOrderAmount = 10000.0; // $10,000 maximum
    if (cart.total > maximumOrderAmount) {
      errors.push(`Maximum order amount is $${maximumOrderAmount.toFixed(2)}`);
    }

    // Validate cart calculations
    const expectedSubtotal = cart.items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    if (Math.abs(cart.subtotal - expectedSubtotal) > 0.01) {
      errors.push('Cart subtotal calculation error');
    }

    // Validate tax calculation (basic check)
    const expectedTax = expectedSubtotal * 0.08; // 8% tax rate
    if (Math.abs(cart.tax - expectedTax) > 0.01) {
      warnings.push('Tax calculation may be incorrect');
    }

    // Validate total calculation
    const expectedTotal = cart.subtotal + cart.tax;
    if (Math.abs(cart.total - expectedTotal) > 0.01) {
      errors.push('Cart total calculation error');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate vendor availability and status
   */
  private async validateVendorAvailability(
    cartItems: any[]
  ): Promise<OrderValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const vendorIds = [
      ...new Set(cartItems.map(item => item.product?.vendorId).filter(Boolean)),
    ];

    for (const vendorId of vendorIds) {
      try {
        // In a real implementation, you would check vendor status
        // For now, we'll assume all vendors are active
        // const vendor = await this.getVendorStatus(vendorId);
        // if (!vendor.isActive) {
        //   errors.push(`Vendor ${vendorId} is currently unavailable`);
        // }
        await Promise.resolve(); // Placeholder for actual implementation
      } catch (error) {
        warnings.push(`Could not verify vendor ${vendorId} status`);
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate business rules
   */
  private async validateBusinessRules(
    customerId: string,
    cart: any
  ): Promise<OrderValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check customer order limits (fraud prevention)
      const recentOrders = await this.prisma.order.count({
        where: {
          customerId,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      });

      const maxOrdersPerDay = 10;
      if (recentOrders >= maxOrdersPerDay) {
        errors.push('Daily order limit exceeded. Please try again tomorrow.');
      }

      // Check for suspicious order patterns
      const highValueThreshold = 1000;
      if (cart.total > highValueThreshold && recentOrders === 0) {
        warnings.push('High-value first-time order flagged for review');
      }

      // Validate quantity limits per product
      for (const item of cart.items) {
        const maxQuantityPerProduct = 100;
        if (item.quantity > maxQuantityPerProduct) {
          errors.push(
            `Maximum quantity per product is ${maxQuantityPerProduct}`
          );
        }
      }

      // Check for duplicate products (shouldn't happen with proper cart management)
      const productIds = cart.items.map((item: any) => item.productId);
      const uniqueProductIds = new Set(productIds);
      if (productIds.length !== uniqueProductIds.size) {
        errors.push('Duplicate products found in cart');
      }
    } catch (error) {
      console.error('Error validating business rules:', error);
      warnings.push('Could not validate all business rules');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Calculate comprehensive order totals with taxes and shipping
   */
  async calculateOrderTotals(
    cartItems: any[],
    shippingAddress: any,
    customerId: string
  ): Promise<{
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
  }> {
    // Calculate items subtotal
    const itemsTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Calculate tax based on shipping address
    const taxRate = this.calculateTaxRate(shippingAddress);
    const tax = itemsTotal * taxRate;

    // Calculate shipping cost
    const shippingCost = await this.calculateShippingCost(
      cartItems,
      shippingAddress
    );

    // Calculate any applicable discounts
    const discounts = await this.calculateDiscounts(customerId, cartItems);

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
   * Calculate tax rate based on shipping address
   */
  private calculateTaxRate(shippingAddress: any): number {
    // Simplified tax calculation - in reality, this would be much more complex
    const taxRates: Record<string, number> = {
      USA: 0.08,
      CA: 0.12, // Canada
      UK: 0.2, // United Kingdom
      DE: 0.19, // Germany
      FR: 0.2, // France
    };

    const country = shippingAddress.country?.toUpperCase();
    return taxRates[country] || 0.08; // Default 8% tax rate
  }

  /**
   * Calculate shipping cost based on items and destination
   */
  // eslint-disable-next-line require-await
  private async calculateShippingCost(
    cartItems: any[],
    shippingAddress: any
  ): Promise<number> {
    // Simplified shipping calculation
    const baseShippingCost = 5.99;
    const freeShippingThreshold = 50.0;

    const itemsTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Free shipping over threshold
    if (itemsTotal >= freeShippingThreshold) {
      return 0;
    }

    // International shipping surcharge
    const internationalCountries = ['CA', 'UK', 'DE', 'FR'];
    const country = shippingAddress.country?.toUpperCase();
    const internationalSurcharge = internationalCountries.includes(country)
      ? 10.0
      : 0;

    return baseShippingCost + internationalSurcharge;
  }

  /**
   * Calculate applicable discounts
   */
  private async calculateDiscounts(
    customerId: string,
    cartItems: any[]
  ): Promise<number> {
    // Simplified discount calculation
    // In reality, this would check for coupon codes, customer loyalty discounts, etc.

    let totalDiscount = 0;

    try {
      // Check for first-time customer discount
      const orderCount = await this.prisma.order.count({
        where: { customerId },
      });

      if (orderCount === 0) {
        // 10% discount for first-time customers, max $20
        const itemsTotal = cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const firstTimeDiscount = Math.min(itemsTotal * 0.1, 20.0);
        totalDiscount += firstTimeDiscount;
      }

      // Bulk order discount (5+ items of same product)
      for (const item of cartItems) {
        if (item.quantity >= 5) {
          const bulkDiscount = item.price * item.quantity * 0.05; // 5% bulk discount
          totalDiscount += bulkDiscount;
        }
      }
    } catch (error) {
      console.error('Error calculating discounts:', error);
    }

    return totalDiscount;
  }

  /**
   * Validate order cancellation eligibility
   */
  async validateOrderCancellation(
    orderId: string,
    customerId: string
  ): Promise<OrderValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const order = await this.getOrder(orderId, customerId);

      // Check order status
      if (order.status === 'CANCELLED' || order.status === 'REFUNDED') {
        errors.push('Order is already cancelled or refunded');
      }

      if (order.status === 'DELIVERED') {
        errors.push('Cannot cancel delivered order');
      }

      if (order.status === 'SHIPPED') {
        warnings.push(
          'Order has been shipped. Cancellation may result in return shipping charges.'
        );
      }

      // Check time limits
      const orderAge = Date.now() - new Date(order.createdAt).getTime();
      const maxCancellationTime = 24 * 60 * 60 * 1000; // 24 hours

      if (orderAge > maxCancellationTime && order.status !== 'PENDING') {
        errors.push('Order cancellation period has expired');
      }

      // Check payment status
      if (order.paymentStatus === 'PAID' && order.status === 'PROCESSING') {
        warnings.push(
          'Payment has been processed. Refund may take 3-5 business days.'
        );
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        errors.push('Order not found');
      } else {
        errors.push('Unable to validate order for cancellation');
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Private helper methods
   */

  private groupItemsByVendor(items: any[]): Map<string, any[]> {
    const vendorGroups = new Map<string, any[]>();

    for (const item of items) {
      const vendorId = item.product?.vendorId;
      if (!vendorId) {
        throw new Error(`Product ${item.productId} has no vendor ID`);
      }

      if (!vendorGroups.has(vendorId)) {
        vendorGroups.set(vendorId, []);
      }
      vendorGroups.get(vendorId)!.push(item);
    }

    return vendorGroups;
  }

  private validateStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus
  ): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [OrderStatus.REFUNDED],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.REFUNDED]: [],
    };

    const allowedTransitions = validTransitions[currentStatus] || [];
    if (!allowedTransitions.includes(newStatus)) {
      throw new Error(
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }
  }

  private async updateMainOrderStatusFromVendorOrders(
    orderId: string
  ): Promise<void> {
    const vendorOrders = await this.prisma.vendorOrder.findMany({
      where: { orderId },
    });

    if (vendorOrders.length === 0) return;

    // Determine main order status based on vendor order statuses
    const statuses = vendorOrders.map(vo => vo.status as OrderStatus);
    let newMainStatus: OrderStatus;

    if (statuses.every(s => s === OrderStatus.DELIVERED)) {
      newMainStatus = OrderStatus.DELIVERED;
    } else if (statuses.every(s => s === OrderStatus.CANCELLED)) {
      newMainStatus = OrderStatus.CANCELLED;
    } else if (statuses.some(s => s === OrderStatus.SHIPPED)) {
      newMainStatus = OrderStatus.SHIPPED;
    } else if (statuses.some(s => s === OrderStatus.PROCESSING)) {
      newMainStatus = OrderStatus.PROCESSING;
    } else if (statuses.every(s => s === OrderStatus.CONFIRMED)) {
      newMainStatus = OrderStatus.CONFIRMED;
    } else {
      return; // No change needed
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: newMainStatus },
    });
  }

  private mapOrderToType(order: any): Order {
    return {
      id: order.id,
      customerId: order.customerId,
      status: order.status,
      items: order.items.map((item: any) => this.mapOrderItemToType(item)),
      vendorOrders: order.vendorOrders.map((vo: any) =>
        this.mapVendorOrderToType(vo)
      ),
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      paymentIntentId: order.paymentIntentId || undefined,
      notes: order.notes || undefined,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }

  private mapVendorOrderToType(vendorOrder: any): VendorOrder {
    return {
      id: vendorOrder.id,
      orderId: vendorOrder.orderId,
      vendorId: vendorOrder.vendorId,
      status: vendorOrder.status,
      items: vendorOrder.items.map((item: any) =>
        this.mapOrderItemToType(item)
      ),
      subtotal: vendorOrder.subtotal,
      shipping: vendorOrder.shipping,
      total: vendorOrder.total,
      trackingNumber: vendorOrder.trackingNumber || undefined,
      estimatedDelivery:
        vendorOrder.estimatedDelivery?.toISOString() || undefined,
      notes: vendorOrder.notes || undefined,
      createdAt: vendorOrder.createdAt.toISOString(),
      updatedAt: vendorOrder.updatedAt.toISOString(),
    };
  }

  private mapOrderItemToType(item: any): OrderItem {
    return {
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      product: {
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        comparePrice: item.product.comparePrice || undefined,
        sku: item.product.sku || undefined,
        category: item.product.category,
        subcategory: item.product.subcategory || undefined,
        brand: item.product.brand || undefined,
        images: item.product.images,
        specifications:
          (item.product.specifications as Record<string, string>) || undefined,
        vendorId: item.product.vendorId,
        inventory: {
          quantity: 0, // Will be populated from inventory service if needed
          lowStockThreshold: 0,
          trackQuantity: true,
        },
        isActive: item.product.isActive,
        rating: item.product.rating || undefined,
        reviewCount: item.product.reviewCount,
        createdAt: item.product.createdAt.toISOString(),
        updatedAt: item.product.updatedAt.toISOString(),
      },
    };
  }

  private async sendOrderNotifications(
    order: Order,
    customer: UserInfo
  ): Promise<void> {
    try {
      // Send customer order confirmation
      const orderNotificationData: OrderNotificationData = {
        orderId: order.id,
        customerEmail: customer.email,
        customerName: customer.name,
        orderTotal: order.total,
        orderItems: order.items.map(item => ({
          productName: item.product?.name || 'Unknown Product',
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: order.shippingAddress,
      };

      await this.notificationServiceClient.sendOrderConfirmation(
        orderNotificationData
      );

      // Send vendor notifications for each vendor order
      for (const vendorOrder of order.vendorOrders) {
        try {
          // Get vendor info (simplified - in real implementation, you'd get vendor details)
          const vendorNotificationData: VendorNotificationData = {
            vendorId: vendorOrder.vendorId,
            vendorEmail: `vendor-${vendorOrder.vendorId}@example.com`, // TODO: Get real vendor email
            orderId: order.id,
            vendorOrderId: vendorOrder.id,
            orderItems: vendorOrder.items.map(item => ({
              productName: item.product?.name || 'Unknown Product',
              quantity: item.quantity,
              price: item.price,
            })),
            customerName: customer.name,
            orderTotal: vendorOrder.total,
          };

          await this.notificationServiceClient.sendVendorOrderNotification(
            vendorNotificationData
          );
        } catch (error) {
          console.error(
            `Failed to send vendor notification for vendor ${vendorOrder.vendorId}:`,
            error
          );
        }
      }
    } catch (error) {
      console.error('Failed to send order notifications:', error);
    }
  }

  private async sendStatusUpdateNotifications(
    order: Order,
    previousStatus: OrderStatus,
    newStatus: OrderStatus
  ): Promise<void> {
    try {
      // const customer = await this.authServiceClient.getUserInfo(
      //   order.customerId
      // );

      // Notification data preparation (currently unused)
      /*
      const orderNotificationData: OrderNotificationData & {
        previousStatus: string;
        newStatus: string;
      } = {
        orderId: order.id,
        customerEmail: customer.email,
        customerName: customer.name,
        orderTotal: order.total,
        orderItems: order.items.map(item => ({
          productName: item.product?.name || 'Unknown Product',
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: order.shippingAddress,
        previousStatus,
        newStatus,
      };
      */

      await this.notificationServiceClient.sendOrderStatusUpdate(order.id, {
        orderId: order.id,
        previousStatus,
        newStatus,
      });
    } catch (error) {
      console.error('Failed to send status update notifications:', error);
    }
  }

  private async sendVendorStatusUpdateNotifications(
    vendorOrder: VendorOrder,
    previousStatus: OrderStatus,
    newStatus: OrderStatus
  ): Promise<void> {
    try {
      const vendorNotificationData: VendorNotificationData & {
        previousStatus: string;
        newStatus: string;
      } = {
        vendorId: vendorOrder.vendorId,
        vendorEmail: `vendor-${vendorOrder.vendorId}@example.com`, // TODO: Get real vendor email
        orderId: vendorOrder.orderId,
        vendorOrderId: vendorOrder.id,
        orderItems: vendorOrder.items.map(item => ({
          productName: item.product?.name || 'Unknown Product',
          quantity: item.quantity,
          price: item.price,
        })),
        customerName: 'Customer', // TODO: Get real customer name
        orderTotal: vendorOrder.total,
        previousStatus,
        newStatus,
      };

      await this.notificationServiceClient.sendVendorOrderStatusUpdate(
        vendorNotificationData
      );
    } catch (error) {
      console.error(
        'Failed to send vendor status update notifications:',
        error
      );
    }
  }

  private async sendCancellationNotifications(
    order: Order,
    reason?: string
  ): Promise<void> {
    try {
      const customer = await this.authServiceClient.getUserInfo(
        order.customerId
      );

      const orderNotificationData: OrderNotificationData & { reason?: string } =
        {
          orderId: order.id,
          customerEmail: customer.email,
          customerName: customer.name,
          orderTotal: order.total,
          orderItems: order.items.map(item => ({
            productName: item.product?.name || 'Unknown Product',
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: order.shippingAddress,
          reason,
        };

      await this.notificationServiceClient.sendOrderCancellation(
        orderNotificationData
      );
    } catch (error) {
      console.error('Failed to send cancellation notifications:', error);
    }
  }
}
