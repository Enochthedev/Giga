import { AddToCartSchema } from '@platform/types';
import { Request, Response } from 'express';
import { z } from 'zod';
import { CartService } from '../services/cart.service';

import { SessionData } from '../services/session.service';

// Extend Request interface for user and session properties
interface SessionRequest extends Request {
  user?: {
    id: string;
    sub: string;
    email: string;
    roles: string[];
    activeRole: string;
  };
  session?: SessionData;
  sessionId?: string;
}

// Request validation schemas
const UpdateCartItemSchema = z.object({
  quantity: z.number().positive().int(),
});

export class CartController {
  constructor(private cartService: CartService) { }

  /**
   * GET /api/v1/cart - Get current user shopping cart with product enrichment
   */
  async getCart(req: SessionRequest, res: Response): Promise<void> {
    try {
      // Get customerId from session (supports both authenticated and anonymous users)
      const customerId = req.session?.customerId || req.user?.id || 'clr123customer';

      const cart = await this.cartService.getCart(customerId);

      res.json({
        success: true,
        data: { cart },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get cart error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve cart',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /api/v1/cart/add - Add item to shopping cart with inventory validation
   */
  async addItem(req: SessionRequest, res: Response): Promise<void> {
    try {
      // Validate request body
      const validationResult = AddToCartSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: validationResult.error.errors,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { productId, quantity } = validationResult.data;
      // Get customerId from session (supports both authenticated and anonymous users)
      const customerId = req.session?.customerId || req.user?.id || 'clr123customer';

      const cart = await this.cartService.addItem(customerId, productId, quantity);

      res.json({
        success: true,
        data: { cart },
        message: 'Item added to cart successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Add to cart error:', error);

      // Handle specific business logic errors
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
          });
          return;
        }

        if (error.message.includes('not available') ||
          error.message.includes('stock') ||
          error.message.includes('items available')) {
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
        error: 'Failed to add item to cart',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * PUT /api/v1/cart/items/:itemId - Update cart item quantity
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
      // Get customerId from session (supports both authenticated and anonymous users)
      const customerId = req.session?.customerId || req.user?.id || 'clr123customer';

      const cart = await this.cartService.updateItemQuantity(customerId, itemId, quantity);

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
        if (error.message.includes('not found')) {
          res.status(404).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
          });
          return;
        }

        if (error.message.includes('stock') || error.message.includes('items available')) {
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
   */
  async removeItem(req: SessionRequest, res: Response): Promise<void> {
    try {
      const { itemId } = req.params;
      // Get customerId from session (supports both authenticated and anonymous users)
      const customerId = req.session?.customerId || req.user?.id || 'clr123customer';

      const cart = await this.cartService.removeItem(customerId, itemId);

      res.json({
        success: true,
        data: { cart },
        message: 'Item removed from cart successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Remove cart item error:', error);

      // Handle specific business logic errors
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        return;
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
   */
  async clearCart(req: SessionRequest, res: Response): Promise<void> {
    try {
      // Get customerId from session (supports both authenticated and anonymous users)
      const customerId = req.session?.customerId || req.user?.id || 'clr123customer';

      await this.cartService.clearCart(customerId);

      // Get the empty cart to return
      const cart = await this.cartService.getCart(customerId);

      res.json({
        success: true,
        data: { cart },
        message: 'Cart cleared successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Clear cart error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to clear cart',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/cart/validate - Validate cart items and return issues
   */
  async validateCart(req: SessionRequest, res: Response): Promise<void> {
    try {
      // Get customerId from session (supports both authenticated and anonymous users)
      const customerId = req.session?.customerId || req.user?.id || 'clr123customer';

      const cart = await this.cartService.getCart(customerId);
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
      res.status(500).json({
        success: false,
        error: 'Failed to validate cart',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /api/v1/cart/merge - Merge anonymous cart with authenticated user cart
   */
  async mergeCart(req: SessionRequest, res: Response): Promise<void> {
    try {
      const { anonymousSessionId } = req.body;
      const authenticatedCustomerId = req.user?.id;

      if (!authenticatedCustomerId) {
        res.status(401).json({
          success: false,
          error: 'User must be authenticated to merge cart',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (!anonymousSessionId) {
        res.status(400).json({
          success: false,
          error: 'Anonymous session ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const mergedCart = await this.cartService.transferAnonymousCart(
        anonymousSessionId,
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
      const previousAnonymousCustomerId = req.session?.previousAnonymousCustomerId;

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

      const expirationSeconds = await this.cartService.getCartExpiration(customerId);

      res.json({
        success: true,
        data: {
          customerId,
          expiresInSeconds: expirationSeconds,
          expiresAt: expirationSeconds ? new Date(Date.now() + (expirationSeconds * 1000)).toISOString() : null,
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
  async extendCartExpiration(req: SessionRequest, res: Response): Promise<void> {
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

      // Validate TTL (max 7 days for security)
      const maxTtl = 7 * 24 * 60 * 60; // 7 days
      const validTtl = Math.min(Math.max(ttlSeconds, 3600), maxTtl); // Min 1 hour, max 7 days

      await this.cartService.extendCartExpiration(customerId, validTtl);

      const newExpirationSeconds = await this.cartService.getCartExpiration(customerId);

      res.json({
        success: true,
        data: {
          customerId,
          expiresInSeconds: newExpirationSeconds,
          expiresAt: newExpirationSeconds ? new Date(Date.now() + (newExpirationSeconds * 1000)).toISOString() : null,
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
}