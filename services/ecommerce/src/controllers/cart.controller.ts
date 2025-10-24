import { Request, Response } from 'express';
import { z } from 'zod';
import { CartService } from '../services/cart.service';
import { SessionData } from '../services/session.service';

// Extend Request interface for session properties
// Note: user is already defined in Express.Request via auth.middleware.ts
interface SessionRequest extends Request {
  session?: SessionData;
  sessionId?: string;
}

// Request validation schemas
const UpdateCartItemSchema = z.object({
  quantity: z.number().positive().int(),
});

export class CartController {
  constructor(private cartService: CartService) {}

  /**
   * GET /api/v1/cart - Get current user shopping cart with product enrichment
   * Supports both authenticated and guest users via X-Cart-Id header
   */
  async getCart(req: SessionRequest, res: Response): Promise<void> {
    try {
      // Get customerId from authenticated user
      const customerId = req.user?.id || null;

      // Get anonymous cart ID from X-Cart-Id header
      const anonymousCartId = req.headers['x-cart-id'] as string | undefined;

      // Validate that guest users provide X-Cart-Id header
      if (!customerId && !anonymousCartId) {
        res.status(400).json({
          success: false,
          error:
            'X-Cart-Id header is required for guest users. Generate a cart ID using format: cart_anonymous_{uuid}',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Get or create cart using the new method
      const cart = await this.cartService.getOrCreateCart(
        customerId,
        anonymousCartId
      );

      res.json({
        success: true,
        data: { cart },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get cart error:', error);

      // Handle specific error cases
      if (
        error instanceof Error &&
        error.message.includes('Invalid anonymous cart ID')
      ) {
        res.status(400).json({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve cart',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /api/v1/cart/add - Add item(s) to shopping cart with inventory validation
   * Supports both single item and bulk operations in one endpoint
   * Supports both authenticated and guest users via X-Cart-Id header
   */
  async addItems(req: SessionRequest, res: Response): Promise<void> {
    try {
      // Unified schema that accepts both single item and array of items
      const UnifiedAddToCartSchema = z.union([
        // Single item format: { productId, quantity }
        z.object({
          productId: z.string().min(1),
          quantity: z.number().positive().int(),
        }),
        // Bulk format: { items: [{ productId, quantity }] }
        z.object({
          items: z
            .array(
              z.object({
                productId: z.string().min(1),
                quantity: z.number().positive().int(),
              })
            )
            .min(1)
            .max(50), // Limit to 50 items per bulk request
        }),
      ]);

      const validationResult = UnifiedAddToCartSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const data = validationResult.data;

      // Get customerId from authenticated user
      const customerId = req.user?.id || null;

      // Get anonymous cart ID from X-Cart-Id header
      const anonymousCartId = req.headers['x-cart-id'] as string | undefined;

      // Validate that guest users provide X-Cart-Id header
      if (!customerId && !anonymousCartId) {
        res.status(400).json({
          success: false,
          error:
            'X-Cart-Id header is required for guest users. Generate a cart ID using format: cart_anonymous_{uuid}',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Get or create cart
      const existingCart = await this.cartService.getOrCreateCart(
        customerId,
        anonymousCartId
      );

      // Determine the cart ID to use for operations
      const cartId = existingCart.customerId;

      let cart;
      let message;

      // Check if it's single item or bulk operation
      if ('items' in data) {
        // Bulk operation
        cart = await this.cartService.addBulkItems(cartId, data.items);
        message = `${data.items.length} items added to cart successfully`;
      } else {
        // Single item operation
        cart = await this.cartService.addItem(
          cartId,
          data.productId,
          data.quantity
        );
        message = 'Item added to cart successfully';
      }

      res.json({
        success: true,
        data: { cart },
        message,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Add to cart error:', error);

      // Handle specific business logic errors
      if (error instanceof Error) {
        if (error.message.includes('Invalid anonymous cart ID')) {
          res.status(400).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
          });
          return;
        }

        if (error.message.includes('not found')) {
          res.status(404).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
          });
          return;
        }

        if (
          error.message.includes('not available') ||
          error.message.includes('stock') ||
          error.message.includes('items available')
        ) {
          res.status(400).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        error: 'Failed to add item(s) to cart',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * PUT /api/v1/cart/items/:itemId - Update cart item quantity
   * Supports both authenticated and guest users via X-Cart-Id header
   */
  async updateItemQuantity(req: SessionRequest, res: Response): Promise<void> {
    try {
      const { itemId } = req.params;

      // Validate request body
      const validationResult = UpdateCartItemSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { quantity } = validationResult.data;

      // Get customerId from authenticated user
      const customerId = req.user?.id || null;

      // Get anonymous cart ID from X-Cart-Id header
      const anonymousCartId = req.headers['x-cart-id'] as string | undefined;

      // Validate that guest users provide X-Cart-Id header
      if (!customerId && !anonymousCartId) {
        res.status(400).json({
          success: false,
          error: 'X-Cart-Id header is required for guest users',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Get cart to determine cart ID
      const existingCart = await this.cartService.getOrCreateCart(
        customerId,
        anonymousCartId
      );
      const cartId = existingCart.customerId;

      const cart = await this.cartService.updateItemQuantity(
        cartId,
        itemId,
        quantity
      );

      res.json({
        success: true,
        data: { cart },
        message: 'Cart item updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Update cart item error:', error);

      // Handle specific business logic errors
      if (error instanceof Error) {
        if (error.message.includes('Invalid anonymous cart ID')) {
          res.status(400).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
          });
          return;
        }

        if (error.message.includes('not found')) {
          res.status(404).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
          });
          return;
        }

        if (
          error.message.includes('stock') ||
          error.message.includes('items available')
        ) {
          res.status(400).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        error: 'Failed to update cart item',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * DELETE /api/v1/cart/items/:itemId - Remove item from cart
   * Supports both authenticated and guest users via X-Cart-Id header
   */
  async removeItem(req: SessionRequest, res: Response): Promise<void> {
    try {
      const { itemId } = req.params;

      // Get customerId from authenticated user
      const customerId = req.user?.id || null;

      // Get anonymous cart ID from X-Cart-Id header
      const anonymousCartId = req.headers['x-cart-id'] as string | undefined;

      // Validate that guest users provide X-Cart-Id header
      if (!customerId && !anonymousCartId) {
        res.status(400).json({
          success: false,
          error: 'X-Cart-Id header is required for guest users',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Get cart to determine cart ID
      const existingCart = await this.cartService.getOrCreateCart(
        customerId,
        anonymousCartId
      );
      const cartId = existingCart.customerId;

      const cart = await this.cartService.removeItem(cartId, itemId);

      res.json({
        success: true,
        data: { cart },
        message: 'Item removed from cart successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Remove cart item error:', error);

      // Handle specific business logic errors
      if (error instanceof Error) {
        if (error.message.includes('Invalid anonymous cart ID')) {
          res.status(400).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
          });
          return;
        }

        if (error.message.includes('not found')) {
          res.status(404).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        error: 'Failed to remove cart item',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * DELETE /api/v1/cart - Clear entire cart
   * Supports both authenticated and guest users via X-Cart-Id header
   */
  async clearCart(req: SessionRequest, res: Response): Promise<void> {
    try {
      // Get customerId from authenticated user
      const customerId = req.user?.id || null;

      // Get anonymous cart ID from X-Cart-Id header
      const anonymousCartId = req.headers['x-cart-id'] as string | undefined;

      // Validate that guest users provide X-Cart-Id header
      if (!customerId && !anonymousCartId) {
        res.status(400).json({
          success: false,
          error: 'X-Cart-Id header is required for guest users',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Get cart to determine cart ID
      const existingCart = await this.cartService.getOrCreateCart(
        customerId,
        anonymousCartId
      );
      const cartId = existingCart.customerId;

      await this.cartService.clearCart(cartId);

      // Get the empty cart to return
      const cart = await this.cartService.getCart(cartId);

      res.json({
        success: true,
        data: { cart },
        message: 'Cart cleared successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Clear cart error:', error);

      if (
        error instanceof Error &&
        error.message.includes('Invalid anonymous cart ID')
      ) {
        res.status(400).json({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Failed to clear cart',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/cart/validate - Validate cart items and return issues
   * Supports both authenticated and guest users via X-Cart-Id header
   */
  async validateCart(req: SessionRequest, res: Response): Promise<void> {
    try {
      // Get customerId from authenticated user
      const customerId = req.user?.id || null;

      // Get anonymous cart ID from X-Cart-Id header
      const anonymousCartId = req.headers['x-cart-id'] as string | undefined;

      // Validate that guest users provide X-Cart-Id header
      if (!customerId && !anonymousCartId) {
        res.status(400).json({
          success: false,
          error: 'X-Cart-Id header is required for guest users',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Get cart
      const cart = await this.cartService.getOrCreateCart(
        customerId,
        anonymousCartId
      );
      const validationResult = await this.cartService.validateCartItems(cart);

      res.json({
        success: true,
        data: {
          cart: validationResult.updatedCart || cart,
          validation: {
            isValid: validationResult.isValid,
            issues: validationResult.issues,
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Validate cart error:', error);

      if (
        error instanceof Error &&
        error.message.includes('Invalid anonymous cart ID')
      ) {
        res.status(400).json({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Failed to validate cart',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /api/v1/cart/merge - Merge anonymous cart with authenticated user cart
   * Expects anonymousCartId in request body with format: cart_anonymous_{uuid}
   */
  async mergeCart(req: SessionRequest, res: Response): Promise<void> {
    try {
      const { anonymousCartId } = req.body;
      const authenticatedCustomerId = req.user?.id;

      if (!authenticatedCustomerId) {
        res.status(401).json({
          success: false,
          error: 'User must be authenticated to merge cart',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (!anonymousCartId) {
        res.status(400).json({
          success: false,
          error:
            'anonymousCartId is required in request body (format: cart_anonymous_{uuid})',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const mergedCart = await this.cartService.mergeAnonymousCarts(
        anonymousCartId,
        authenticatedCustomerId
      );

      res.json({
        success: true,
        data: { cart: mergedCart },
        message: 'Cart merged successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Merge cart error:', error);

      if (
        error instanceof Error &&
        error.message.includes('Invalid anonymous cart ID')
      ) {
        res.status(400).json({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Failed to merge cart',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /api/v1/cart/merge-on-auth - Automatically merge cart after authentication
   */
  async mergeCartOnAuth(req: SessionRequest, res: Response): Promise<void> {
    try {
      const authenticatedCustomerId = req.user?.id;
      const previousAnonymousCustomerId =
        req.session?.previousAnonymousCustomerId;

      if (!authenticatedCustomerId) {
        res.status(401).json({
          success: false,
          error: 'User must be authenticated',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // If there's no previous anonymous customer ID, just return current cart
      if (!previousAnonymousCustomerId) {
        const cart = await this.cartService.getCart(authenticatedCustomerId);
        res.json({
          success: true,
          data: { cart },
          message: 'No anonymous cart to merge',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Merge the anonymous cart with the authenticated user's cart
      const mergedCart = await this.cartService.mergeCart(
        previousAnonymousCustomerId,
        authenticatedCustomerId
      );

      res.json({
        success: true,
        data: { cart: mergedCart },
        message: 'Cart merged successfully after authentication',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Auto merge cart error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to merge cart after authentication',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/cart/stats - Get cart statistics (admin endpoint)
   */
  async getCartStatistics(req: SessionRequest, res: Response): Promise<void> {
    try {
      // This would typically require admin authentication
      const stats = await this.cartService.getCartStatistics();

      res.json({
        success: true,
        data: { statistics: stats },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get cart statistics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get cart statistics',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/cart/expiration - Get cart expiration information
   */
  async getCartExpiration(req: SessionRequest, res: Response): Promise<void> {
    try {
      const customerId = req.session?.customerId || req.user?.id;

      if (!customerId) {
        res.status(401).json({
          success: false,
          error: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const expirationSeconds =
        await this.cartService.getCartExpiration(customerId);

      res.json({
        success: true,
        data: {
          customerId,
          expiresInSeconds: expirationSeconds,
          expiresAt: expirationSeconds
            ? new Date(Date.now() + expirationSeconds * 1000).toISOString()
            : null,
          isExpired: expirationSeconds === null || expirationSeconds <= 0,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get cart expiration error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get cart expiration',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /api/v1/cart/extend - Extend cart expiration
   */
  async extendCartExpiration(
    req: SessionRequest,
    res: Response
  ): Promise<void> {
    try {
      const customerId = req.session?.customerId || req.user?.id;
      const { ttlSeconds = 86400 } = req.body; // Default 24 hours

      if (!customerId) {
        res.status(401).json({
          success: false,
          error: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Validate TTL using service method
      const validTtl = this.cartService.validateTtl(ttlSeconds);

      await this.cartService.extendCartExpiration(customerId, validTtl);

      const newExpirationSeconds =
        await this.cartService.getCartExpiration(customerId);

      res.json({
        success: true,
        data: {
          customerId,
          expiresInSeconds: newExpirationSeconds,
          expiresAt: newExpirationSeconds
            ? new Date(Date.now() + newExpirationSeconds * 1000).toISOString()
            : null,
          extendedBy: validTtl,
        },
        message: 'Cart expiration extended successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Extend cart expiration error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to extend cart expiration',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /api/v1/cart/reserve - Reserve inventory for cart items during checkout
   */
  async reserveInventory(req: SessionRequest, res: Response): Promise<void> {
    try {
      const customerId = req.session?.customerId || req.user?.id;
      const { expirationMinutes = 30 } = req.body;

      if (!customerId) {
        res.status(401).json({
          success: false,
          error: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Validate expiration minutes using service method
      const validExpiration =
        this.cartService.validateReservationExpiration(expirationMinutes);

      const result = await this.cartService.reserveCartInventory(
        customerId,
        req.sessionId,
        validExpiration
      );

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: 'Failed to reserve inventory',
          details: result.failures,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.json({
        success: true,
        data: {
          reservationId: result.reservationId,
          expiresInMinutes: validExpiration,
          expiresAt: new Date(
            Date.now() + validExpiration * 60 * 1000
          ).toISOString(),
        },
        message: 'Inventory reserved successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Reserve inventory error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reserve inventory',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * DELETE /api/v1/cart/reserve/:reservationId - Release inventory reservation
   */
  async releaseReservation(req: SessionRequest, res: Response): Promise<void> {
    try {
      const { reservationId } = req.params;

      if (!reservationId) {
        res.status(400).json({
          success: false,
          error: 'Reservation ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      await this.cartService.releaseCartReservation(reservationId);

      res.json({
        success: true,
        message: 'Inventory reservation released successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Release reservation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to release inventory reservation',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/cart/checkout/validate - Validate cart for checkout with inventory check
   */
  async validateForCheckout(req: SessionRequest, res: Response): Promise<void> {
    try {
      const customerId = req.session?.customerId || req.user?.id;

      if (!customerId) {
        res.status(401).json({
          success: false,
          error: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const validation =
        await this.cartService.validateCartForCheckout(customerId);

      res.json({
        success: true,
        data: {
          validation: {
            isValid: validation.isValid,
            issues: validation.issues,
            totalItems: validation.totalItems,
            totalValue: validation.totalValue,
            canProceedToCheckout:
              validation.isValid && validation.totalItems > 0,
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Validate for checkout error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to validate cart for checkout',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/cart/inventory - Get inventory status for all cart items
   */
  async getInventoryStatus(req: SessionRequest, res: Response): Promise<void> {
    try {
      const customerId = req.session?.customerId || req.user?.id;

      if (!customerId) {
        res.status(401).json({
          success: false,
          error: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const inventoryStatuses =
        await this.cartService.getCartInventoryStatus(customerId);

      res.json({
        success: true,
        data: {
          inventoryStatuses,
          summary: {
            totalItems: inventoryStatuses.length,
            availableItems: inventoryStatuses.filter(item => item.isAvailable)
              .length,
            unavailableItems: inventoryStatuses.filter(
              item => !item.isAvailable
            ).length,
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get inventory status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get inventory status',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
