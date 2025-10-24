import { Request, Response } from 'express';
import { z } from 'zod';
import { HttpNotificationServiceClient } from '../clients/notification.client';
import { OrderStatus } from '../generated/prisma-client';
import { InventoryService } from '../services/inventory.service';
import {
  VendorOrderService,
  VendorOrderStatusUpdate,
} from '../services/vendor-order.service';
import { VendorProductService } from '../services/vendor-product.service';

// Use the global Request type with user from auth middleware
type AuthenticatedRequest = Request;

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

/**
 * VendorController handles HTTP requests for vendor operations
 * All business logic is delegated to services
 */
export class VendorController {
  constructor(
    private vendorOrderService: VendorOrderService,
    private vendorProductService: VendorProductService,
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

      const result = await this.vendorProductService.getVendorProducts(
        vendorId,
        filters
      );

      res.json({
        success: true,
        data: result,
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

      const result = await this.inventoryService.updateProductInventory(
        productId,
        vendorId,
        { quantity, lowStockThreshold, trackQuantity }
      );

      // Check if low stock alert needed
      if (this.inventoryService.isLowStock(result.inventory)) {
        // Send low stock notification (non-blocking)
        this.sendLowStockNotification(
          vendorId,
          productId,
          result.inventory
        ).catch(error => {
          console.error('Failed to send low stock alert:', error);
        });
      }

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

      const result = await this.inventoryService.bulkUpdateInventory(
        vendorId,
        updates
      );

      // Send low stock alerts if needed (non-blocking)
      if (result.lowStockAlerts > 0) {
        this.sendBulkLowStockNotifications(vendorId, result.results).catch(
          error => {
            console.error('Failed to send low stock alerts:', error);
          }
        );
      }

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

      res.json({
        success: true,
        data: {
          products: lowStockProducts,
          count: lowStockProducts.length,
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
   * Send low stock notification for a single product
   */
  private async sendLowStockNotification(
    vendorId: string,
    productId: string,
    inventory: {
      quantity: number;
      lowStockThreshold: number;
      trackQuantity: boolean;
    }
  ): Promise<void> {
    try {
      await this.notificationServiceClient.sendInventoryAlert({
        vendorId,
        vendorEmail: 'vendor@example.com', // In real implementation, get from vendor service
        productId,
        productName: 'Product', // Would fetch from product service
        currentStock: inventory.quantity,
        threshold: inventory.lowStockThreshold,
      });
    } catch (error) {
      console.error('Failed to send low stock notification:', error);
      // Don't throw error to avoid breaking the main flow
    }
  }

  /**
   * Send bulk low stock notifications
   */
  private async sendBulkLowStockNotifications(
    vendorId: string,
    results: Array<{
      productId: string;
      quantity: number;
      lowStockThreshold: number;
    }>
  ): Promise<void> {
    const lowStockResults = results.filter(
      result => result.quantity <= result.lowStockThreshold
    );

    await Promise.all(
      lowStockResults.map(result =>
        this.sendLowStockNotification(vendorId, result.productId, {
          quantity: result.quantity,
          lowStockThreshold: result.lowStockThreshold,
          trackQuantity: true,
        })
      )
    );
  }
}
