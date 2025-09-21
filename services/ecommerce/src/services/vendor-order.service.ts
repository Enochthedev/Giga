import { VendorOrder } from '@platform/types';
import { HttpNotificationServiceClient } from '../clients/notification.client';
import { OrderStatus, PrismaClient } from '../generated/prisma-client';
import { OrderFilters, PaginatedOrders } from './order.service';

export interface VendorOrderFilters extends OrderFilters {
  vendorId?: string;
}

export interface VendorDashboardMetrics {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  recentOrders: VendorOrder[];
  analytics: {
    salesThisMonth: number;
    ordersThisMonth: number;
    averageOrderValue: number;
    conversionRate: number;
    topSellingProducts: Array<{
      productId: string;
      productName: string;
      quantitySold: number;
      revenue: number;
    }>;
  };
}

export interface VendorOrderStatusUpdate {
  status: OrderStatus;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
}

export class VendorOrderService {
  constructor(
    private prisma: PrismaClient,
    private notificationServiceClient: HttpNotificationServiceClient
  ) {}

  /**
   * Get vendor orders with filtering and pagination
   */
  async getVendorOrders(
    vendorId: string,
    filters: VendorOrderFilters = {}
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
          order: {
            select: {
              id: true,
              customerId: true,
              status: true,
              shippingAddress: true,
              paymentStatus: true,
              createdAt: true,
              updatedAt: true,
            },
          },
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

    // Map vendor orders to full order format for consistency
    const orders = vendorOrders.map(vendorOrder => ({
      id: vendorOrder.order.id,
      customerId: vendorOrder.order.customerId,
      status: vendorOrder.status as any,
      items: vendorOrder.items.map(item => ({
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
            (item.product.specifications as Record<string, string>) ||
            undefined,
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
      })),
      vendorOrders: [
        {
          id: vendorOrder.id,
          orderId: vendorOrder.orderId,
          vendorId: vendorOrder.vendorId,
          status: vendorOrder.status as any,
          items: vendorOrder.items.map(item => ({
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
                (item.product.specifications as Record<string, string>) ||
                undefined,
              vendorId: item.product.vendorId,
              inventory: {
                quantity: 0,
                lowStockThreshold: 0,
                trackQuantity: true,
              },
              isActive: item.product.isActive,
              rating: item.product.rating || undefined,
              reviewCount: item.product.reviewCount,
              createdAt: item.product.createdAt.toISOString(),
              updatedAt: item.product.updatedAt.toISOString(),
            },
          })),
          subtotal: vendorOrder.subtotal,
          shipping: vendorOrder.shipping,
          total: vendorOrder.total,
          trackingNumber: vendorOrder.trackingNumber || undefined,
          estimatedDelivery:
            vendorOrder.estimatedDelivery?.toISOString() || undefined,
          notes: vendorOrder.notes || undefined,
          createdAt: vendorOrder.createdAt.toISOString(),
          updatedAt: vendorOrder.updatedAt.toISOString(),
        },
      ],
      subtotal: vendorOrder.subtotal,
      tax: 0, // Tax is calculated at main order level
      shipping: vendorOrder.shipping,
      total: vendorOrder.total,
      shippingAddress: vendorOrder.order.shippingAddress as any,
      paymentMethod: 'N/A', // Not relevant for vendor view
      paymentStatus: vendorOrder.order.paymentStatus as any,
      createdAt: vendorOrder.order.createdAt.toISOString(),
      updatedAt: vendorOrder.order.updatedAt.toISOString(),
    }));

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update vendor order status with validation
   */
  async updateVendorOrderStatus(
    vendorOrderId: string,
    vendorId: string,
    updateData: VendorOrderStatusUpdate
  ): Promise<VendorOrder> {
    // Get current vendor order
    const currentVendorOrder = await this.prisma.vendorOrder.findFirst({
      where: {
        id: vendorOrderId,
        vendorId,
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

    if (!currentVendorOrder) {
      throw new Error('Vendor order not found or access denied');
    }

    // Validate status transition
    this.validateVendorStatusTransition(
      currentVendorOrder.status as OrderStatus,
      updateData.status
    );

    // Update vendor order
    const updatedVendorOrder = await this.prisma.vendorOrder.update({
      where: { id: vendorOrderId },
      data: {
        status: updateData.status,
        trackingNumber: updateData.trackingNumber,
        estimatedDelivery: updateData.estimatedDelivery
          ? new Date(updateData.estimatedDelivery)
          : undefined,
        notes: updateData.notes,
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

    // Update main order status if all vendor orders are complete
    await this.updateMainOrderStatusFromVendorOrders(
      currentVendorOrder.orderId
    );

    const mappedVendorOrder = this.mapVendorOrderToType(updatedVendorOrder);

    // Send notifications (non-blocking)
    this.sendVendorStatusUpdateNotifications(
      mappedVendorOrder,
      currentVendorOrder.status as OrderStatus,
      updateData.status
    ).catch(error => {
      console.error(
        'Failed to send vendor status update notifications:',
        error
      );
    });

    return mappedVendorOrder;
  }

  /**
   * Get vendor dashboard analytics and metrics
   */
  async getVendorDashboard(vendorId: string): Promise<VendorDashboardMetrics> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    // const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get basic metrics
    const [
      totalProducts,
      totalOrders,
      pendingOrders,
      lowStockProducts,
      monthlyRevenue,
      monthlyOrders,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      // Total products
      this.prisma.product.count({
        where: { vendorId, isActive: true },
      }),

      // Total orders (all time)
      this.prisma.vendorOrder.count({
        where: { vendorId },
      }),

      // Pending orders
      this.prisma.vendorOrder.count({
        where: {
          vendorId,
          status: { in: [OrderStatus.PENDING, OrderStatus.CONFIRMED] },
        },
      }),

      // Low stock products
      this.prisma.product.count({
        where: {
          vendorId,
          isActive: true,
          inventory: {
            quantity: {
              lte: this.prisma.productInventory.fields.lowStockThreshold,
            },
            trackQuantity: true,
          },
        },
      }),

      // Monthly revenue
      this.prisma.vendorOrder.aggregate({
        where: {
          vendorId,
          createdAt: { gte: startOfMonth },
          status: {
            in: [
              OrderStatus.CONFIRMED,
              OrderStatus.PROCESSING,
              OrderStatus.SHIPPED,
              OrderStatus.DELIVERED,
            ],
          },
        },
        _sum: { total: true },
      }),

      // Monthly orders
      this.prisma.vendorOrder.count({
        where: {
          vendorId,
          createdAt: { gte: startOfMonth },
        },
      }),

      // Recent orders (last 10)
      this.prisma.vendorOrder.findMany({
        where: { vendorId },
        include: {
          order: true,
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),

      // Top selling products this month
      this.prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          vendorOrder: {
            vendorId,
            createdAt: { gte: startOfMonth },
            status: {
              in: [
                OrderStatus.CONFIRMED,
                OrderStatus.PROCESSING,
                OrderStatus.SHIPPED,
                OrderStatus.DELIVERED,
              ],
            },
          },
        },
        _sum: {
          quantity: true,
        },
        _count: {
          id: true,
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    // Calculate total revenue
    const totalRevenue = await this.prisma.vendorOrder.aggregate({
      where: {
        vendorId,
        status: {
          in: [
            OrderStatus.CONFIRMED,
            OrderStatus.PROCESSING,
            OrderStatus.SHIPPED,
            OrderStatus.DELIVERED,
          ],
        },
      },
      _sum: { total: true },
    });

    // Get product details for top products
    const topProductsWithDetails = await Promise.all(
      (topProducts as any[]).map(async (item: any) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });

        const revenue = await this.prisma.orderItem.aggregate({
          where: {
            productId: item.productId,
            vendorOrder: {
              vendorId,
              createdAt: { gte: startOfMonth },
              status: {
                in: [
                  OrderStatus.CONFIRMED,
                  OrderStatus.PROCESSING,
                  OrderStatus.SHIPPED,
                  OrderStatus.DELIVERED,
                ],
              },
            },
          },
          _sum: {
            price: true,
          },
        });

        return {
          productId: item.productId,
          productName: product?.name || 'Unknown Product',
          quantitySold: item._sum?.quantity || 0,
          revenue: (revenue._sum as any)?.price || 0,
        };
      })
    );

    // Calculate analytics
    const salesThisMonth = monthlyRevenue._sum.total || 0;
    const averageOrderValue =
      totalOrders > 0 ? (totalRevenue._sum.total || 0) / totalOrders : 0;

    // Simple conversion rate calculation (orders vs product views)
    // In a real implementation, you would track product views
    const conversionRate = 0.05; // Placeholder 5% conversion rate

    // Map recent orders
    const mappedRecentOrders = recentOrders.map((vendorOrder: any) =>
      this.mapVendorOrderToType(vendorOrder)
    );

    return {
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      pendingOrders,
      lowStockProducts,
      recentOrders: mappedRecentOrders,
      analytics: {
        salesThisMonth,
        ordersThisMonth: (monthlyOrders as any)._count || 0,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        conversionRate,
        topSellingProducts: topProductsWithDetails,
      },
    };
  }

  /**
   * Validate vendor order status transitions
   */
  private validateVendorStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus
  ): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [], // Final state
      [OrderStatus.CANCELLED]: [], // Final state
      [OrderStatus.REFUNDED]: [], // Final state
    };

    const allowedTransitions = validTransitions[currentStatus] || [];
    if (!allowedTransitions.includes(newStatus)) {
      throw new Error(
        `Invalid status transition from ${currentStatus} to ${newStatus}. ` +
          `Allowed transitions: ${allowedTransitions.join(', ')}`
      );
    }
  }

  /**
   * Update main order status based on vendor order statuses
   */
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

    if (statuses.every(status => status === OrderStatus.DELIVERED)) {
      newMainStatus = OrderStatus.DELIVERED;
    } else if (statuses.every(status => status === OrderStatus.CANCELLED)) {
      newMainStatus = OrderStatus.CANCELLED;
    } else if (statuses.some(status => status === OrderStatus.SHIPPED)) {
      newMainStatus = OrderStatus.SHIPPED;
    } else if (statuses.some(status => status === OrderStatus.PROCESSING)) {
      newMainStatus = OrderStatus.PROCESSING;
    } else if (statuses.every(status => status === OrderStatus.CONFIRMED)) {
      newMainStatus = OrderStatus.CONFIRMED;
    } else {
      newMainStatus = OrderStatus.PENDING;
    }

    // Update main order status if different
    const currentOrder = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (currentOrder && currentOrder.status !== newMainStatus) {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: newMainStatus, updatedAt: new Date() },
      });
    }
  }

  /**
   * Send vendor status update notifications
   */
  private async sendVendorStatusUpdateNotifications(
    vendorOrder: VendorOrder,
    previousStatus: OrderStatus,
    newStatus: OrderStatus
  ): Promise<void> {
    try {
      // Notify customer about status change
      await this.notificationServiceClient.sendOrderStatusUpdate(
        vendorOrder.orderId,
        {
          orderId: vendorOrder.orderId,
          vendorOrderId: vendorOrder.id,
          previousStatus,
          newStatus,
          trackingNumber: vendorOrder.trackingNumber,
          estimatedDelivery: vendorOrder.estimatedDelivery,
        }
      );

      // Send vendor-specific notifications if needed
      if (newStatus === OrderStatus.DELIVERED) {
        await this.notificationServiceClient.sendVendorOrderCompletion(
          vendorOrder.vendorId,
          {
            vendorOrderId: vendorOrder.id,
            orderId: vendorOrder.orderId,
            total: vendorOrder.total,
            itemCount: vendorOrder.items.length,
          }
        );
      }
    } catch (error) {
      console.error(
        'Failed to send vendor status update notifications:',
        error
      );
      // Don't throw error to avoid breaking the main flow
    }
  }

  /**
   * Map database vendor order to type
   */
  private mapVendorOrderToType(vendorOrder: any): VendorOrder {
    return {
      id: vendorOrder.id,
      orderId: vendorOrder.orderId,
      vendorId: vendorOrder.vendorId,
      status: vendorOrder.status as any,
      items: vendorOrder.items.map((item: any) => ({
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
            (item.product.specifications as Record<string, string>) ||
            undefined,
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
      })),
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
}
