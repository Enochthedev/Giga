import { Request, Response } from 'express';
import { z } from 'zod';
import { cacheService } from '../services/cache.service';
import { CartService } from '../services/cart.service';
import { InventoryService } from '../services/inventory.service';
import { ResponseOptimizationService, responseOptimizationService } from '../services/response-optimization.service';

// Validation schemas
const BatchCartUpdateSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(0),
    action: z.enum(['add', 'update', 'remove']).optional().default('update'),
  })).min(1).max(50),
  options: z.object({
    validateInventory: z.boolean().optional().default(true),
    continueOnError: z.boolean().optional().default(false),
    returnDetails: z.boolean().optional().default(true),
  }).optional(),
});

const BatchInventoryUpdateSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(0),
    operation: z.enum(['set', 'increment', 'decrement']).optional().default('set'),
  })).min(1).max(100),
  options: z.object({
    validateOnly: z.boolean().optional().default(false),
    notifyVendors: z.boolean().optional().default(true),
    updateCache: z.boolean().optional().default(true),
  }).optional(),
});

const BatchProductCacheSchema = z.object({
  productIds: z.array(z.string()).min(1).max(100),
  options: z.object({
    forceRefresh: z.boolean().optional().default(false),
    includePricing: z.boolean().optional().default(true),
    includeInventory: z.boolean().optional().default(true),
  }).optional(),
});

export class BatchController {
  constructor(
    private cartService: CartService,
    private inventoryService: InventoryService
  ) { }

  /**
   * Batch cart operations - add, update, or remove multiple items
   */
  async batchCartOperations(req: Request, res: Response) {
    try {
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(401).json(
          ResponseOptimizationService.createErrorResponse('Authentication required', 401)
        );
      }

      // Validate request
      const validation = BatchCartUpdateSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json(
          ResponseOptimizationService.createErrorResponse(
            'Invalid request data',
            400,
            validation.error.errors
          )
        );
      }

      const { items, options } = validation.data;
      const continueOnError = options?.continueOnError ?? false;
      const returnDetails = options?.returnDetails ?? true;

      // Process batch operations
      const results = await responseOptimizationService.handleBatchOperation(
        items,
        async (item) => {
          try {
            switch (item.action) {
              case 'add': {
                return await this.cartService.addItem(customerId, item.productId, item.quantity);
              }
              case 'update': {
                // Find the cart item ID first
                const cart = await this.cartService.getCart(customerId);
                const cartItem = cart.items.find(ci => ci.productId === item.productId);
                if (!cartItem) {
                  throw new Error(`Product ${item.productId} not found in cart`);
                }
                return await this.cartService.updateItemQuantity(customerId, cartItem.id, item.quantity);
              }
              case 'remove': {
                const cartForRemoval = await this.cartService.getCart(customerId);
                const itemToRemove = cartForRemoval.items.find(ci => ci.productId === item.productId);
                if (!itemToRemove) {
                  throw new Error(`Product ${item.productId} not found in cart`);
                }
                return await this.cartService.removeItem(customerId, itemToRemove.id);
              }
              default:
                throw new Error(`Unknown action: ${item.action}`);
            }
          } catch (error) {
            if (!continueOnError) throw error;
            return { error: error instanceof Error ? error.message : 'Unknown error' };
          }
        },
        {
          batchSize: 10,
          concurrency: 3,
        }
      );

      // Get final cart state
      const finalCart = await this.cartService.getCart(customerId);

      const response = {
        success: true,
        data: {
          cart: finalCart,
          operations: {
            total: items.length,
            successful: results.results.length,
            failed: results.errors.length,
          },
        },
        timestamp: new Date().toISOString(),
      };

      if (returnDetails) {
        (response.data as Record<string, unknown>).details = {
          results: results.results,
          errors: results.errors,
        };
      }

      res.json(response);
    } catch (error) {
      console.error('Batch cart operations error:', error);
      res.status(500).json(
        ResponseOptimizationService.createErrorResponse(
          'Failed to process batch cart operations',
          500
        )
      );
    }
  }

  /**
   * Batch inventory updates - update multiple product inventories
   */
  async batchInventoryUpdates(req: Request, res: Response) {
    try {
      // Check vendor permissions
      const vendorId = (req.user as any)?.vendorId;
      if (!vendorId) {
        return res.status(403).json(
          ResponseOptimizationService.createErrorResponse('Vendor access required', 403)
        );
      }

      // Validate request
      const validation = BatchInventoryUpdateSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json(
          ResponseOptimizationService.createErrorResponse(
            'Invalid request data',
            400,
            validation.error.errors
          )
        );
      }

      const { items, options } = validation.data;
      const validateOnly = options?.validateOnly ?? false;
      const updateCache = options?.updateCache ?? true;

      if (validateOnly) {
        // Validation mode - check if operations are valid without executing
        const validationResults = await Promise.all(
          items.map(async (item) => {
            try {
              const currentStatus = await this.inventoryService.getInventoryStatus(item.productId);
              if (!currentStatus) {
                return { productId: item.productId, valid: false, error: 'Product not found' };
              }

              // Check if product belongs to vendor
              const product = await req.prisma.product.findUnique({
                where: { id: item.productId },
                select: { vendorId: true },
              });

              if (!product || product.vendorId !== vendorId) {
                return { productId: item.productId, valid: false, error: 'Product not owned by vendor' };
              }

              return { productId: item.productId, valid: true };
            } catch (error) {
              return {
                productId: item.productId,
                valid: false,
                error: error instanceof Error ? error.message : 'Unknown error',
              };
            }
          })
        );

        return res.json({
          success: true,
          data: {
            validation: validationResults,
            summary: {
              total: items.length,
              valid: validationResults.filter(r => r.valid).length,
              invalid: validationResults.filter(r => !r.valid).length,
            },
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Execute batch inventory updates
      const results = await responseOptimizationService.handleBatchOperation(
        items,
        async (item) => {
          // Verify product ownership
          const product = await req.prisma.product.findUnique({
            where: { id: item.productId },
            select: { vendorId: true, name: true },
          });

          if (!product || product.vendorId !== vendorId) {
            throw new Error(`Product ${item.productId} not found or not owned by vendor`);
          }

          // Get current inventory
          const currentStatus = await this.inventoryService.getInventoryStatus(item.productId);
          if (!currentStatus) {
            throw new Error(`Inventory not found for product ${item.productId}`);
          }

          let newQuantity: number;
          switch (item.operation) {
            case 'set':
              newQuantity = item.quantity;
              break;
            case 'increment':
              newQuantity = currentStatus.availableQuantity + item.quantity;
              break;
            case 'decrement':
              newQuantity = Math.max(0, currentStatus.availableQuantity - item.quantity);
              break;
            default:
              throw new Error(`Unknown operation: ${item.operation}`);
          }

          // Update inventory
          await this.inventoryService.updateInventory(item.productId, newQuantity);

          // Invalidate cache if requested
          if (updateCache) {
            await cacheService.invalidateInventory(item.productId);
            await cacheService.invalidateProduct(item.productId);
          }

          return {
            productId: item.productId,
            productName: product.name,
            previousQuantity: currentStatus.availableQuantity,
            newQuantity,
            operation: item.operation,
          };
        },
        {
          batchSize: 20,
          concurrency: 5,
        }
      );

      res.json({
        success: true,
        data: {
          updates: results.results,
          summary: {
            total: items.length,
            successful: results.results.length,
            failed: results.errors.length,
          },
          errors: results.errors,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Batch inventory updates error:', error);
      res.status(500).json(
        ResponseOptimizationService.createErrorResponse(
          'Failed to process batch inventory updates',
          500
        )
      );
    }
  }

  /**
   * Batch product cache refresh
   */
  async batchCacheRefresh(req: Request, res: Response) {
    try {
      // Validate request
      const validation = BatchProductCacheSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json(
          ResponseOptimizationService.createErrorResponse(
            'Invalid request data',
            400,
            validation.error.errors
          )
        );
      }

      const { productIds, options } = validation.data;
      const forceRefresh = options?.forceRefresh ?? false;
      const includeInventory = options?.includeInventory ?? true;

      // Process batch cache operations
      const results = await responseOptimizationService.handleBatchOperation(
        productIds,
        async (productId) => {
          try {
            // Get product data
            const product = await req.prisma.product.findUnique({
              where: { id: productId },
              include: {
                inventory: includeInventory,
              },
            });

            if (!product) {
              throw new Error(`Product ${productId} not found`);
            }

            // Invalidate existing cache if force refresh
            if (forceRefresh) {
              await cacheService.invalidateProduct(productId);
              if (includeInventory) {
                await cacheService.invalidateInventory(productId);
              }
            }

            // Cache the product
            await cacheService.cacheProduct(productId, product);

            // Cache inventory if requested
            if (includeInventory && product.inventory) {
              await cacheService.cacheInventoryStatus(productId, {
                availableQuantity: product.inventory.quantity,
                reservedQuantity: product.inventory.reservedQuantity,
                trackQuantity: product.inventory.trackQuantity,
                lowStockThreshold: product.inventory.lowStockThreshold,
              });
            }

            return {
              productId,
              cached: true,
              includedInventory: includeInventory && !!product.inventory,
            };
          } catch (error) {
            throw new Error(`Failed to cache product ${productId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        },
        {
          batchSize: 25,
          concurrency: 10,
        }
      );

      res.json({
        success: true,
        data: {
          cached: results.results,
          summary: {
            total: productIds.length,
            successful: results.results.length,
            failed: results.errors.length,
          },
          errors: results.errors,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Batch cache refresh error:', error);
      res.status(500).json(
        ResponseOptimizationService.createErrorResponse(
          'Failed to process batch cache refresh',
          500
        )
      );
    }
  }

  /**
   * Batch search operations - search multiple queries at once
   */
  async batchSearch(req: Request, res: Response) {
    try {
      const { queries } = req.body;

      if (!Array.isArray(queries) || queries.length === 0) {
        return res.status(400).json(
          ResponseOptimizationService.createErrorResponse('Queries array is required', 400)
        );
      }

      if (queries.length > 10) {
        return res.status(400).json(
          ResponseOptimizationService.createErrorResponse('Maximum 10 queries allowed', 400)
        );
      }

      const results = await responseOptimizationService.handleBatchOperation(
        queries,
        async (query) => {
          const {
            search,
            category,
            subcategory,
            brand,
            minPrice,
            maxPrice,
            limit = 10,
          } = query;

          // Try cache first
          const cachedResults = await cacheService.getCachedSearchResults(query);
          if (cachedResults) {
            return { query, results: cachedResults, cached: true };
          }

          // Execute search
          const where: any = { isActive: true };

          if (search) {
            where.OR = [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { brand: { contains: search, mode: 'insensitive' } },
            ];
          }

          if (category) where.category = category;
          if (subcategory) where.subcategory = subcategory;
          if (brand) where.brand = brand;

          if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = minPrice;
            if (maxPrice) where.price.lte = maxPrice;
          }

          const products = await req.prisma.product.findMany({
            where,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              images: true,
              category: true,
              brand: true,
              rating: true,
              reviewCount: true,
            },
          });

          const searchResults = { products, total: products.length };

          // Cache results
          await cacheService.cacheSearchResults(query, searchResults);

          return { query, results: searchResults, cached: false };
        },
        {
          batchSize: 5,
          concurrency: 3,
        }
      );

      res.json({
        success: true,
        data: {
          searches: results.results,
          summary: {
            total: queries.length,
            successful: results.results.length,
            failed: results.errors.length,
          },
          errors: results.errors,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Batch search error:', error);
      res.status(500).json(
        ResponseOptimizationService.createErrorResponse(
          'Failed to process batch search',
          500
        )
      );
    }
  }

  /**
   * Get batch operation status
   */
  getBatchStatus(req: Request, res: Response) {
    try {
      const { batchId } = req.params;

      // In a real implementation, you would store batch operation status
      // For now, return a mock status
      res.json({
        success: true,
        data: {
          batchId,
          status: 'completed',
          progress: {
            total: 100,
            completed: 100,
            failed: 0,
          },
          startedAt: new Date(Date.now() - 60000).toISOString(),
          completedAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get batch status error:', error);
      res.status(500).json(
        ResponseOptimizationService.createErrorResponse(
          'Failed to get batch status',
          500
        )
      );
    }
  }
}

export default BatchController;