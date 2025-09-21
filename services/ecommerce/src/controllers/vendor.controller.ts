import { Product } from '@platform/types';
import { OrderStatus, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { z } from 'zod';
import { HttpNotificationServiceClient } from '../clients/notification.client';
import { InventoryService } from '../services/inventory.service';
import {
  VendorOrderService,
  VendorOrderStatusUpdate,
} from '../services/vendor-order.service';

// Define types for better type safety
type PrismaProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice: number | null;
  sku: string | null;
  category: string;
  subcategory: string | null;
  brand: string | null;
  images: string[];
  specifications: any;
  vendorId: string;
  isActive: boolean;
  rating: number | null;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
};

type ProductWithInventory = PrismaProduct & {
  inventory: {
    quantity: number;
    lowStockThreshold: number;
    trackQuantity: boolean;
  } | null;
};

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
const VendorOrderFiltersSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
});

const UpdateVendorOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  trackingNumber: z.string().optional(),
  estimatedDelivery: z.string().datetime().optional(),
  notes: z.string().optional(),
});

const UpdateInventorySchema = z.object({
  quantity: z.number().min(0),
  lowStockThreshold: z.number().min(0).optional(),
  trackQuantity: z.boolean().optional(),
});

const BulkInventoryUpdateSchema = z.object({
  updates: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(0),
      lowStockThreshold: z.number().min(0).optional(),
    })
  ),
});

const ProductFiltersSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(20),
  status: z.enum(['active', 'inactive', 'all']).default('all'),
  category: z.string().optional(),
  search: z.string().optional(),
});

export class VendorController {
  constructor(
    private prisma: PrismaClient,
    private vendorOrderService: VendorOrderService,
    private inventoryService: InventoryService,
    private notificationServiceClient: HttpNotificationServiceClient
  ) {}

  /**
   * GET /api/v1/vendor/orders - Get vendor orders with filtering
   */
  async getVendorOrders(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user?.vendorId) {
        res.status(403).json({
          success: false,
          error: 'Vendor access required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Validate query parameters
      const validationResult = VendorOrderFiltersSchema.safeParse(req.query);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid query parameters',
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const filters = validationResult.data;
      const vendorId = req.user.vendorId;

      const result = await this.vendorOrderService.getVendorOrders(
        vendorId,
        filters
      );

      res.json({
        success: true,
        data: result,
        message: 'Vendor orders retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get vendor orders error:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to retrieve vendor orders';
      res.status(500).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * PUT /api/v1/vendor/orders/:id/status - Update vendor order status
   */
  async updateVendorOrderStatus(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user?.vendorId) {
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
      const validationResult = UpdateVendorOrderStatusSchema.safeParse(
        req.body
      );
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const updateData: VendorOrderStatusUpdate = validationResult.data;
      const vendorId = req.user.vendorId;

      const vendorOrder = await this.vendorOrderService.updateVendorOrderStatus(
        vendorOrderId,
        vendorId,
        updateData
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
      const statusCode =
        errorMessage.includes('not found') ||
        errorMessage.includes('access denied')
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
   * GET /api/v1/vendor/dashboard - Get vendor dashboard analytics
   */
  async getVendorDashboard(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user?.vendorId) {
        res.status(403).json({
          success: false,
          error: 'Vendor access required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const vendorId = req.user.vendorId;
      const dashboardData =
        await this.vendorOrderService.getVendorDashboard(vendorId);

      res.json({
        success: true,
        data: dashboardData,
        message: 'Vendor dashboard data retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get vendor dashboard error:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to retrieve vendor dashboard data';
      res.status(500).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/vendor/products - Get vendor products with filtering
   */
  async getVendorProducts(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      if (!req.user?.vendorId) {
        res.status(403).json({
          success: false,
          error: 'Vendor access required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Validate query parameters
      const validationResult = ProductFiltersSchema.safeParse(req.query);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid query parameters',
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const filters = validationResult.data;
      const vendorId = req.user.vendorId;

      const { page, limit, status, category, search } = filters;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: Record<string, any> = {
        vendorId,
      };

      if (status !== 'all') {
        where.isActive = status === 'active';
      }

      if (category) {
        where.category = category;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Get products with inventory
      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          include: {
            inventory: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
        }),
        this.prisma.product.count({ where }),
      ]);

      // Map products to type format
      const mappedProducts: Product[] = products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice || undefined,
        sku: product.sku || undefined,
        category: product.category,
        subcategory: product.subcategory || undefined,
        brand: product.brand || undefined,
        images: product.images,
        specifications:
          (product.specifications as Record<string, string>) || undefined,
        vendorId: product.vendorId,
        inventory: {
          quantity: product.inventory?.quantity || 0,
          lowStockThreshold: product.inventory?.lowStockThreshold || 10,
          trackQuantity: product.inventory?.trackQuantity || true,
        },
        isActive: product.isActive,
        rating: product.rating || undefined,
        reviewCount: product.reviewCount,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      }));

      res.json({
        success: true,
        data: {
          products: mappedProducts,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        message: 'Vendor products retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get vendor products error:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to retrieve vendor products';
      res.status(500).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * PUT /api/v1/vendor/products/:id/inventory - Update product inventory
   */
  async updateProductInventory(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const validationError = this.validateVendorAccess(req);
      if (validationError) {
        res.status(validationError.status).json(validationError.response);
        return;
      }

      const productId = req.params.id;
      if (!productId) {
        res.status(400).json({
          success: false,
          error: 'Product ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Validate request body
      const validationResult = UpdateInventorySchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid inventory data',
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { quantity, lowStockThreshold, trackQuantity } =
        validationResult.data;
      const vendorId = req.user!.vendorId!;

      const result = await this.updateSingleProductInventory(
        productId,
        vendorId,
        { quantity, lowStockThreshold, trackQuantity }
      );

      res.json({
        success: true,
        data: result,
        message: 'Product inventory updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.handleError(res, error, 'Failed to update product inventory');
    }
  }

  /**
   * PUT /api/v1/vendor/products/inventory/bulk - Bulk update product inventories
   */
  async bulkUpdateInventory(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const validationError = this.validateVendorAccess(req);
      if (validationError) {
        res.status(validationError.status).json(validationError.response);
        return;
      }

      // Validate request body
      const validationResult = BulkInventoryUpdateSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid bulk inventory data',
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { updates } = validationResult.data;
      const vendorId = req.user!.vendorId!;

      const result = await this.performBulkInventoryUpdate(vendorId, updates);

      res.json({
        success: true,
        data: result,
        message: 'Bulk inventory update completed successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.handleError(res, error, 'Failed to bulk update inventory');
    }
  }

  /**
   * GET /api/v1/vendor/products/low-stock - Get products with low stock
   */
  async getLowStockProducts(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const validationError = this.validateVendorAccess(req);
      if (validationError) {
        res.status(validationError.status).json(validationError.response);
        return;
      }

      const vendorId = req.user!.vendorId!;
      const lowStockProducts =
        await this.inventoryService.getLowStockProducts(vendorId);

      // Map to Product type format
      const mappedProducts: Product[] = lowStockProducts.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice || undefined,
        sku: product.sku || undefined,
        category: product.category,
        subcategory: product.subcategory || undefined,
        brand: product.brand || undefined,
        images: product.images,
        specifications:
          (product.specifications as Record<string, string>) || undefined,
        vendorId: product.vendorId,
        inventory: {
          quantity: product.inventory?.quantity || 0,
          lowStockThreshold: product.inventory?.lowStockThreshold || 10,
          trackQuantity: product.inventory?.trackQuantity || true,
        },
        isActive: product.isActive,
        rating: product.rating || undefined,
        reviewCount: product.reviewCount,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      }));

      res.json({
        success: true,
        data: {
          products: mappedProducts,
          count: mappedProducts.length,
        },
        message: 'Low stock products retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.handleError(res, error, 'Failed to retrieve low stock products');
    }
  }

  /**
   * Validate vendor access for requests
   */
  private validateVendorAccess(
    req: AuthenticatedRequest
  ): { status: number; response: unknown } | null {
    if (!req.user?.vendorId) {
      return {
        status: 403,
        response: {
          success: false,
          error: 'Vendor access required',
          timestamp: new Date().toISOString(),
        },
      };
    }
    return null;
  }

  /**
   * Handle errors consistently
   */
  private handleError(
    res: Response,
    error: unknown,
    defaultMessage: string
  ): void {
    console.error(`${defaultMessage}:`, error);
    const errorMessage =
      error instanceof Error ? error.message : defaultMessage;
    const statusCode =
      errorMessage.includes('not found') ||
      errorMessage.includes('access denied')
        ? 404
        : errorMessage.includes('Invalid')
          ? 400
          : 500;

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Update inventory for a single product
   */
  private async updateSingleProductInventory(
    productId: string,
    vendorId: string,
    updateData: {
      quantity: number;
      lowStockThreshold?: number;
      trackQuantity?: boolean;
    }
  ): Promise<{
    productId: string;
    inventory: {
      quantity: number;
      lowStockThreshold: number;
      trackQuantity: boolean;
    };
  }> {
    // Verify product belongs to vendor
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        vendorId,
      },
      include: {
        inventory: true,
      },
    });

    if (!product) {
      throw new Error('Product not found or access denied');
    }

    // Update inventory
    const updatedInventory = await this.prisma.productInventory.upsert({
      where: {
        productId,
      },
      update: {
        quantity: updateData.quantity,
        lowStockThreshold: updateData.lowStockThreshold ?? undefined,
        trackQuantity: updateData.trackQuantity ?? undefined,
        updatedAt: new Date(),
      },
      create: {
        productId,
        quantity: updateData.quantity,
        lowStockThreshold: updateData.lowStockThreshold || 10,
        trackQuantity:
          updateData.trackQuantity !== undefined
            ? updateData.trackQuantity
            : true,
      },
    });

    // Check for low stock alert
    if (
      updatedInventory.trackQuantity &&
      updatedInventory.quantity <= updatedInventory.lowStockThreshold
    ) {
      // Send low stock notification (non-blocking)
      this.sendLowStockAlert(
        vendorId,
        product,
        updatedInventory.quantity,
        updatedInventory.lowStockThreshold
      ).catch(error => {
        console.error('Failed to send low stock alert:', error);
      });
    }

    return {
      productId,
      inventory: {
        quantity: updatedInventory.quantity,
        lowStockThreshold: updatedInventory.lowStockThreshold,
        trackQuantity: updatedInventory.trackQuantity,
      },
    };
  }

  /**
   * Perform bulk inventory updates
   */
  private async performBulkInventoryUpdate(
    vendorId: string,
    updates: Array<{
      productId: string;
      quantity: number;
      lowStockThreshold?: number;
    }>
  ): Promise<{
    updatedCount: number;
    lowStockAlerts: number;
    results: Array<{
      productId: string;
      quantity: number;
      lowStockThreshold: number;
    }>;
  }> {
    // Verify all products belong to vendor
    const productIds = updates.map(update => update.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        vendorId,
      },
      include: {
        inventory: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new Error('Some products not found or access denied');
    }

    // Perform bulk updates in transaction
    const results = await this.prisma.$transaction(
      updates.map(update =>
        this.prisma.productInventory.upsert({
          where: {
            productId: update.productId,
          },
          update: {
            quantity: update.quantity,
            lowStockThreshold: update.lowStockThreshold ?? undefined,
            updatedAt: new Date(),
          },
          create: {
            productId: update.productId,
            quantity: update.quantity,
            lowStockThreshold: update.lowStockThreshold || 10,
            trackQuantity: true,
          },
        })
      )
    );

    // Check for low stock alerts
    const lowStockAlerts = this.identifyLowStockAlerts(results, products);

    // Send low stock alerts (non-blocking)
    if (lowStockAlerts.length > 0) {
      this.sendBulkLowStockAlerts(vendorId, lowStockAlerts).catch(error => {
        console.error('Failed to send low stock alerts:', error);
      });
    }

    return {
      updatedCount: results.length,
      lowStockAlerts: lowStockAlerts.length,
      results: results.map(result => ({
        productId: result.productId,
        quantity: result.quantity,
        lowStockThreshold: result.lowStockThreshold,
      })),
    };
  }

  /**
   * Identify products with low stock after bulk update
   */
  private identifyLowStockAlerts(
    results: Array<{
      productId: string;
      quantity: number;
      lowStockThreshold: number;
      trackQuantity: boolean;
    }>,
    products: ProductWithInventory[]
  ): Array<{
    product: PrismaProduct;
    currentStock: number;
    threshold: number;
  }> {
    const lowStockAlerts = [];

    for (const result of results) {
      const product = products.find(p => p.id === result.productId);

      if (
        result.trackQuantity &&
        result.quantity <= result.lowStockThreshold &&
        product
      ) {
        lowStockAlerts.push({
          product,
          currentStock: result.quantity,
          threshold: result.lowStockThreshold,
        });
      }
    }

    return lowStockAlerts;
  }

  /**
   * Send bulk low stock alerts
   */
  private async sendBulkLowStockAlerts(
    vendorId: string,
    alerts: Array<{
      product: PrismaProduct;
      currentStock: number;
      threshold: number;
    }>
  ): Promise<void> {
    await Promise.all(
      alerts.map(alert =>
        this.sendLowStockAlert(
          vendorId,
          alert.product,
          alert.currentStock,
          alert.threshold
        )
      )
    );
  }

  /**
   * Send low stock alert notification
   */
  private async sendLowStockAlert(
    vendorId: string,
    product: PrismaProduct,
    currentStock: number,
    threshold: number
  ): Promise<void> {
    try {
      await this.notificationServiceClient.sendInventoryAlert({
        vendorId,
        vendorEmail: 'vendor@example.com', // In real implementation, get from vendor service
        productId: product.id,
        productName: product.name,
        currentStock,
        threshold,
      });
    } catch (error) {
      console.error('Failed to send low stock alert:', error);
      // Don't throw error to avoid breaking the main flow
    }
  }
}
