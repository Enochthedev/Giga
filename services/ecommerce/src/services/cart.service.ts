import { Cart, CartItem } from '@platform/types';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '../generated/prisma-client';
import {
  generateAnonymousCartId,
  isAnonymousCartId,
} from '../utils/cart-id.utils';
import { InventoryStatus, inventoryService } from './inventory.service';
import { redisService } from './redis.service';

export interface CartValidationResult {
  isValid: boolean;
  issues: CartIssue[];
  updatedCart?: Cart;
}

export interface CartIssue {
  itemId: string;
  type: 'UNAVAILABLE' | 'INSUFFICIENT_STOCK' | 'PRICE_CHANGED';
  message: string;
  currentValue?: any;
}

export interface ProductSummary {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  category: string;
  subcategory?: string;
  brand?: string;
  images: string[];
  specifications?: Record<string, string>;
  vendorId: string;
  inventory: {
    quantity: number;
    lowStockThreshold: number;
    trackQuantity: boolean;
  };
  isActive: boolean;
  rating?: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export class CartService {
  constructor(private _prisma: PrismaClient) {}

  /**
   * Get cart for a customer from Redis
   */
  async getCart(customerId: string): Promise<Cart> {
    try {
      const cartData = await redisService.getCart(customerId);

      if (!cartData) {
        // Create empty cart if none exists
        const emptyCart = this.createEmptyCart(customerId);
        await this.saveCart(emptyCart);
        return emptyCart;
      }

      // Validate and enrich cart items with current product data
      const validatedCart = await this.validateCartItems(cartData as Cart);

      if (!validatedCart.isValid && validatedCart.updatedCart) {
        // Save the updated cart if there were changes
        await this.saveCart(validatedCart.updatedCart);
        return validatedCart.updatedCart;
      }

      return cartData as Cart;
    } catch (error) {
      console.error('Error getting cart:', error);
      // Return empty cart on error
      return this.createEmptyCart(customerId);
    }
  }

  /**
   * Get or create cart for both authenticated and guest users
   * Handles cart merging when anonymous cart ID is provided for authenticated users
   *
   * @param customerId - User ID for authenticated users, or null for guests
   * @param anonymousCartId - Optional anonymous cart ID (format: cart_anonymous_{uuid})
   * @returns Cart for the user
   */
  async getOrCreateCart(
    customerId: string | null,
    anonymousCartId?: string
  ): Promise<Cart> {
    // Case 1: Authenticated user without anonymous cart
    if (customerId && !anonymousCartId) {
      return this.getCart(customerId);
    }

    // Case 2: Guest user with anonymous cart ID
    if (!customerId && anonymousCartId) {
      // Validate anonymous cart ID format
      if (!isAnonymousCartId(anonymousCartId)) {
        throw new Error('Invalid anonymous cart ID format');
      }
      return this.getCart(anonymousCartId);
    }

    // Case 3: Guest user without cart ID - create new anonymous cart
    if (!customerId && !anonymousCartId) {
      const newAnonymousCartId = generateAnonymousCartId();
      const cart = this.createEmptyCart(newAnonymousCartId);
      await this.saveCart(cart);
      return cart;
    }

    // Case 4: Authenticated user with anonymous cart - merge carts
    if (customerId && anonymousCartId) {
      // Validate anonymous cart ID format
      if (!isAnonymousCartId(anonymousCartId)) {
        throw new Error('Invalid anonymous cart ID format');
      }

      // Check if anonymous cart exists and has items
      const anonymousCart = await redisService.getCart(anonymousCartId);
      if (
        anonymousCart &&
        (anonymousCart as Cart).items &&
        (anonymousCart as Cart).items.length > 0
      ) {
        // Merge anonymous cart with user cart
        return this.mergeAnonymousCarts(anonymousCartId, customerId);
      }

      // No anonymous cart or empty cart - just return user cart
      return this.getCart(customerId);
    }

    // Fallback - should not reach here
    throw new Error('Invalid cart identification parameters');
  }

  /**
   * Add item to cart
   */
  async addItem(
    customerId: string,
    productId: string,
    quantity: number
  ): Promise<Cart> {
    // Validate product exists and is available
    const product = await this.getProductForCart(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (!product.isActive) {
      throw new Error('Product is not available');
    }

    // Get current cart
    const cart = await this.getCart(customerId);

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;

      // Validate inventory for new total quantity
      await this.validateInventoryAvailability(product, newQuantity);

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Validate inventory for new item
      await this.validateInventoryAvailability(product, quantity);

      // Add new item to cart
      const cartItem: CartItem = {
        id: uuidv4(),
        productId,
        quantity,
        price: product.price, // Store current price
        product: product,
      };
      cart.items.push(cartItem);
    }

    // Recalculate totals and save
    this.calculateCartTotals(cart);
    cart.updatedAt = new Date().toISOString();

    await this.saveCart(cart);
    return cart;
  }

  /**
   * Add multiple items to cart in bulk
   */
  async addBulkItems(
    customerId: string,
    items: Array<{ productId: string; quantity: number }>
  ): Promise<Cart> {
    // Get current cart
    const cart = await this.getCart(customerId);

    // Track results for logging
    const results = {
      processed: 0,
      added: 0,
      updated: 0,
      skipped: 0,
      errors: [] as string[],
    };

    // Process each item
    for (const item of items) {
      try {
        results.processed++;

        // Validate product exists and is available
        const product = await this.getProductForCart(item.productId);
        if (!product) {
          results.errors.push(`Product ${item.productId} not found`);
          results.skipped++;
          continue;
        }

        if (!product.isActive) {
          results.errors.push(`Product ${item.productId} is not available`);
          results.skipped++;
          continue;
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
          cartItem => cartItem.productId === item.productId
        );

        if (existingItemIndex >= 0) {
          // Update existing item quantity
          const newQuantity =
            cart.items[existingItemIndex].quantity + item.quantity;

          // Validate inventory for new total quantity
          try {
            await this.validateInventoryAvailability(product, newQuantity);
            cart.items[existingItemIndex].quantity = newQuantity;
            cart.items[existingItemIndex].product = product; // Update product data
            results.updated++;
          } catch (inventoryError) {
            results.errors.push(
              `Insufficient stock for ${item.productId}: ${inventoryError instanceof Error ? inventoryError.message : 'Unknown error'}`
            );
            results.skipped++;
          }
        } else {
          // Validate inventory for new item
          try {
            await this.validateInventoryAvailability(product, item.quantity);

            // Add new item to cart
            const cartItem: CartItem = {
              id: uuidv4(),
              productId: item.productId,
              quantity: item.quantity,
              price: product.price, // Store current price
              product: product,
            };
            cart.items.push(cartItem);
            results.added++;
          } catch (inventoryError) {
            results.errors.push(
              `Insufficient stock for ${item.productId}: ${inventoryError instanceof Error ? inventoryError.message : 'Unknown error'}`
            );
            results.skipped++;
          }
        }
      } catch (error) {
        console.error(
          `Error processing bulk cart item ${item.productId}:`,
          error
        );
        results.errors.push(
          `Error processing ${item.productId}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
        results.skipped++;
      }
    }

    // Log bulk operation results
    console.log('Bulk cart operation completed:', results);

    // If all items failed, throw an error
    if (results.skipped === results.processed) {
      throw new Error(
        `All items failed to be added: ${results.errors.join(', ')}`
      );
    }

    // Recalculate totals and save
    this.calculateCartTotals(cart);
    cart.updatedAt = new Date().toISOString();

    await this.saveCart(cart);
    return cart;
  }

  /**
   * Update item quantity in cart
   */
  async updateItemQuantity(
    customerId: string,
    itemId: string,
    quantity: number
  ): Promise<Cart> {
    const cart = await this.getCart(customerId);

    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Cart item not found');
    }

    const item = cart.items[itemIndex];

    // Validate product availability for new quantity
    const product = await this.getProductForCart(item.productId);
    if (!product) {
      throw new Error('Product not found');
    }

    await this.validateInventoryAvailability(product, quantity);

    // Update quantity
    cart.items[itemIndex].quantity = quantity;

    // Recalculate totals and save
    this.calculateCartTotals(cart);
    cart.updatedAt = new Date().toISOString();

    await this.saveCart(cart);
    return cart;
  }

  /**
   * Remove item from cart
   */
  async removeItem(customerId: string, itemId: string): Promise<Cart> {
    const cart = await this.getCart(customerId);

    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Cart item not found');
    }

    // Remove item
    cart.items.splice(itemIndex, 1);

    // Recalculate totals and save
    this.calculateCartTotals(cart);
    cart.updatedAt = new Date().toISOString();

    await this.saveCart(cart);
    return cart;
  }

  /**
   * Clear entire cart
   */
  async clearCart(customerId: string): Promise<void> {
    const emptyCart = this.createEmptyCart(customerId);
    await this.saveCart(emptyCart);
  }

  /**
   * Validate cart items against current product data
   */
  async validateCartItems(cart: Cart): Promise<CartValidationResult> {
    const issues: CartIssue[] = [];
    const updatedItems: CartItem[] = [];
    let hasChanges = false;

    for (const item of cart.items) {
      try {
        const product = await this.getProductForCart(item.productId);

        if (!product) {
          issues.push({
            itemId: item.id,
            type: 'UNAVAILABLE',
            message: 'Product is no longer available',
          });
          hasChanges = true;
          continue; // Skip this item
        }

        if (!product.isActive) {
          issues.push({
            itemId: item.id,
            type: 'UNAVAILABLE',
            message: 'Product is no longer active',
          });
          hasChanges = true;
          continue; // Skip this item
        }

        // Check inventory availability using real-time inventory service
        if (product.inventory.trackQuantity) {
          const isAvailable = await inventoryService.checkAvailability(
            product.id,
            item.quantity
          );
          if (!isAvailable) {
            const inventoryStatus = await inventoryService.getInventoryStatus(
              product.id
            );
            const availableQuantity = inventoryStatus
              ? inventoryStatus.availableQuantity
              : 0;

            issues.push({
              itemId: item.id,
              type: 'INSUFFICIENT_STOCK',
              message: `Only ${availableQuantity} items available`,
              currentValue: availableQuantity,
            });

            // Update quantity to available amount
            const updatedItem = {
              ...item,
              quantity: Math.max(0, availableQuantity),
              product: product,
            };

            if (updatedItem.quantity > 0) {
              updatedItems.push(updatedItem);
            }
            hasChanges = true;
            continue;
          }
        }

        // Check price changes
        if (Math.abs(item.price - product.price) > 0.01) {
          issues.push({
            itemId: item.id,
            type: 'PRICE_CHANGED',
            message: `Price changed from $${item.price.toFixed(2)} to $${product.price.toFixed(2)}`,
            currentValue: product.price,
          });

          // Update price
          const updatedItem = {
            ...item,
            price: product.price,
            product: product,
          };
          updatedItems.push(updatedItem);
          hasChanges = true;
          continue;
        }

        // Item is valid, add to updated items
        updatedItems.push({
          ...item,
          product: product,
        });
      } catch (error) {
        console.error(`Error validating cart item ${item.id}:`, error);
        issues.push({
          itemId: item.id,
          type: 'UNAVAILABLE',
          message: 'Error validating product availability',
        });
        hasChanges = true;
      }
    }

    const isValid = issues.length === 0;
    let updatedCart: Cart | undefined;

    if (hasChanges) {
      updatedCart = {
        ...cart,
        items: updatedItems,
        updatedAt: new Date().toISOString(),
      };
      this.calculateCartTotals(updatedCart);
    }

    return {
      isValid,
      issues,
      updatedCart,
    };
  }

  /**
   * Get product data for cart operations
   */
  private async getProductForCart(
    productId: string
  ): Promise<ProductSummary | null> {
    try {
      // Try to get from cache first
      const cachedProduct = await redisService.getCachedProduct(productId);
      if (cachedProduct && this.isValidProductSummary(cachedProduct)) {
        return cachedProduct as ProductSummary;
      }

      // Fetch from database
      const product = await this._prisma.product.findUnique({
        where: { id: productId },
        include: {
          inventory: true,
        },
      });

      if (!product || !product.inventory) {
        return null;
      }

      const productSummary: ProductSummary = {
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
          quantity: product.inventory.quantity,
          lowStockThreshold: product.inventory.lowStockThreshold,
          trackQuantity: product.inventory.trackQuantity,
        },
        isActive: product.isActive,
        rating: product.rating || undefined,
        reviewCount: product.reviewCount,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      };

      // Cache for future use
      await redisService.cacheProduct(productId, productSummary, 3600);

      return productSummary;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      return null;
    }
  }

  /**
   * Check if cached product has all required fields
   */
  private isValidProductSummary(product: any): boolean {
    return (
      product &&
      typeof product.id === 'string' &&
      typeof product.name === 'string' &&
      typeof product.description === 'string' &&
      typeof product.price === 'number' &&
      typeof product.category === 'string' &&
      typeof product.vendorId === 'string' &&
      Array.isArray(product.images) &&
      product.inventory &&
      typeof product.inventory.quantity === 'number' &&
      typeof product.inventory.trackQuantity === 'boolean'
    );
  }

  /**
   * Validate inventory availability using real-time inventory service
   */
  private async validateInventoryAvailability(
    product: ProductSummary,
    requestedQuantity: number
  ): Promise<void> {
    if (product.inventory.trackQuantity) {
      const isAvailable = await inventoryService.checkAvailability(
        product.id,
        requestedQuantity
      );
      if (!isAvailable) {
        const inventoryStatus = await inventoryService.getInventoryStatus(
          product.id
        );
        const availableQuantity = inventoryStatus
          ? inventoryStatus.availableQuantity
          : 0;
        throw new Error(`Only ${availableQuantity} items available in stock`);
      }
    }
  }

  /**
   * Calculate cart totals (subtotal, tax, total)
   */
  private calculateCartTotals(cart: Cart): void {
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Calculate tax (8% rate - this could be configurable)
    const taxRate = 0.08;
    const tax = subtotal * taxRate;

    // For now, shipping is free (could be calculated based on items/location)
    const shipping = 0;

    const total = subtotal + tax + shipping;

    cart.subtotal = Math.round(subtotal * 100) / 100;
    cart.tax = Math.round(tax * 100) / 100;
    cart.total = Math.round(total * 100) / 100;
  }

  /**
   * Create empty cart
   */
  private createEmptyCart(customerId: string): Cart {
    return {
      id: `cart_${customerId}`,
      customerId,
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Save cart to Redis
   */
  private async saveCart(cart: Cart): Promise<void> {
    await redisService.setCart(cart.customerId, cart, 86400); // 24 hours TTL
  }

  /**
   * Merge anonymous cart with user cart (for login scenarios)
   * This is the main method for merging carts with proper error handling
   *
   * @param anonymousCartId - Anonymous cart ID (format: cart_anonymous_{uuid})
   * @param authenticatedCustomerId - Authenticated user's customer ID
   * @returns Merged cart
   */
  async mergeAnonymousCarts(
    anonymousCartId: string,
    authenticatedCustomerId: string
  ): Promise<Cart> {
    // Validate anonymous cart ID format
    if (!isAnonymousCartId(anonymousCartId)) {
      throw new Error(
        'Invalid anonymous cart ID format. Expected: cart_anonymous_{uuid}'
      );
    }

    const anonymousCart = await redisService.getCart(anonymousCartId);
    const userCart = await this.getCart(authenticatedCustomerId);

    if (!anonymousCart || (anonymousCart as Cart).items.length === 0) {
      return userCart;
    }

    // Track merge results for logging
    const mergeResults = {
      itemsProcessed: 0,
      itemsAdded: 0,
      itemsUpdated: 0,
      itemsSkipped: 0,
      errors: [] as string[],
    };

    // Merge items from anonymous cart
    for (const anonymousItem of (anonymousCart as Cart).items) {
      try {
        mergeResults.itemsProcessed++;

        // Check if item already exists in user cart
        const existingItemIndex = userCart.items.findIndex(
          item => item.productId === anonymousItem.productId
        );

        if (existingItemIndex >= 0) {
          // Update existing item quantity (combine quantities)
          const newQuantity =
            userCart.items[existingItemIndex].quantity + anonymousItem.quantity;

          // Validate product availability for combined quantity
          const product = await this.getProductForCart(anonymousItem.productId);
          if (product && product.isActive) {
            try {
              await this.validateInventoryAvailability(product, newQuantity);
              userCart.items[existingItemIndex].quantity = newQuantity;
              userCart.items[existingItemIndex].product = product; // Update product data
              mergeResults.itemsUpdated++;
            } catch (inventoryError) {
              // Use maximum available quantity if requested exceeds stock
              if (product.inventory.trackQuantity) {
                const inventoryStatus =
                  await inventoryService.getInventoryStatus(product.id);
                const availableQuantity = inventoryStatus
                  ? inventoryStatus.availableQuantity
                  : 0;
                const maxQuantity = Math.max(
                  userCart.items[existingItemIndex].quantity,
                  Math.min(newQuantity, availableQuantity)
                );
                userCart.items[existingItemIndex].quantity = maxQuantity;
                userCart.items[existingItemIndex].product = product;
                mergeResults.itemsUpdated++;
                console.warn(
                  `Limited quantity for ${anonymousItem.productId} to ${maxQuantity} due to stock`
                );
              }
            }
          } else {
            mergeResults.itemsSkipped++;
            mergeResults.errors.push(
              `Product ${anonymousItem.productId} is no longer available`
            );
          }
        } else {
          // Add new item to user cart
          try {
            const product = await this.getProductForCart(
              anonymousItem.productId
            );
            if (product && product.isActive) {
              await this.validateInventoryAvailability(
                product,
                anonymousItem.quantity
              );

              const cartItem: CartItem = {
                id: uuidv4(),
                productId: anonymousItem.productId,
                quantity: anonymousItem.quantity,
                price: product.price, // Use current price
                product: product,
              };

              userCart.items.push(cartItem);
              mergeResults.itemsAdded++;
            } else {
              mergeResults.itemsSkipped++;
              mergeResults.errors.push(
                `Product ${anonymousItem.productId} is no longer available`
              );
            }
          } catch (error) {
            mergeResults.itemsSkipped++;
            mergeResults.errors.push(
              `Failed to add ${anonymousItem.productId}: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
          }
        }
      } catch (error) {
        console.error(
          `Error merging cart item ${anonymousItem.productId}:`,
          error
        );
        mergeResults.itemsSkipped++;
        mergeResults.errors.push(
          `Error processing ${anonymousItem.productId}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    // Recalculate totals and save merged cart
    this.calculateCartTotals(userCart);
    userCart.updatedAt = new Date().toISOString();
    await this.saveCart(userCart);

    // Delete anonymous cart after successful merge
    await redisService.deleteCart(anonymousCartId);

    // Log merge results
    console.log('Cart merge completed:', mergeResults);

    return userCart;
  }

  /**
   * Legacy method for backward compatibility
   * @deprecated Use mergeAnonymousCarts instead
   */
  async mergeCart(
    anonymousCustomerId: string,
    authenticatedCustomerId: string
  ): Promise<Cart> {
    return this.mergeAnonymousCarts(
      anonymousCustomerId,
      authenticatedCustomerId
    );
  }

  /**
   * Create anonymous cart with new cart_anonymous_{uuid} format
   */
  async createAnonymousCart(): Promise<Cart> {
    const anonymousCartId = generateAnonymousCartId();
    const cart = this.createEmptyCart(anonymousCartId);
    await this.saveCart(cart);
    return cart;
  }

  /**
   * Get cart by session ID (for anonymous users)
   * @deprecated Use getOrCreateCart with anonymousCartId instead
   */
  async getCartBySession(sessionId: string): Promise<Cart> {
    const anonymousCustomerId = `anonymous_${sessionId}`;
    return this.getCart(anonymousCustomerId);
  }

  /**
   * Transfer anonymous cart to authenticated user
   * @deprecated Use mergeAnonymousCarts with proper cart ID format instead
   */
  async transferAnonymousCart(
    sessionId: string,
    authenticatedCustomerId: string
  ): Promise<Cart> {
    const anonymousCustomerId = `anonymous_${sessionId}`;
    return this.mergeCart(anonymousCustomerId, authenticatedCustomerId);
  }

  /**
   * Set cart expiration (extend TTL)
   */
  async extendCartExpiration(
    customerId: string,
    ttlSeconds: number = 86400
  ): Promise<void> {
    const cart = await redisService.getCart(customerId);
    if (cart) {
      await redisService.setCart(customerId, cart, ttlSeconds);
    }
  }

  /**
   * Get cart expiration time
   */
  async getCartExpiration(customerId: string): Promise<number | null> {
    try {
      const client = await redisService.connect();
      const key = `cart:${customerId}`;
      const ttl = await client.ttl(key);
      return ttl > 0 ? ttl : null;
    } catch (error) {
      console.error('Error getting cart expiration:', error);
      return null;
    }
  }

  /**
   * Clean up expired carts and perform maintenance
   */
  async cleanupExpiredCarts(): Promise<{ cleaned: number; errors: number }> {
    let cleaned = 0;
    let errors = 0;

    try {
      const client = await redisService.connect();

      // Get all cart keys
      const cartKeys = await client.keys('cart:*');

      for (const key of cartKeys) {
        try {
          const ttl = await client.ttl(key);

          // If TTL is -1 (no expiration) or very old, clean up
          if (ttl === -1) {
            // Check if cart is old by looking at updatedAt
            const cartData = await client.get(key);
            if (cartData) {
              const cart = JSON.parse(cartData);
              const updatedAt = new Date(cart.updatedAt);
              const daysSinceUpdate =
                (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);

              // Clean up carts older than 7 days
              if (daysSinceUpdate > 7) {
                await client.del(key);
                cleaned++;
              }
            }
          }
        } catch (error) {
          console.error(`Error processing cart key ${key}:`, error);
          errors++;
        }
      }

      console.log(
        `Cart cleanup completed: ${cleaned} carts cleaned, ${errors} errors`
      );
      return { cleaned, errors };
    } catch (error) {
      console.error('Error during cart cleanup:', error);
      return { cleaned, errors: errors + 1 };
    }
  }

  /**
   * Get cart statistics for monitoring
   */
  async getCartStatistics(): Promise<{
    totalCarts: number;
    anonymousCarts: number;
    authenticatedCarts: number;
    averageItems: number;
    averageValue: number;
    expiringCarts: number;
  }> {
    try {
      const client = await redisService.connect();
      const cartKeys = await client.keys('cart:*');

      let totalCarts = 0;
      let anonymousCarts = 0;
      let authenticatedCarts = 0;
      let totalItems = 0;
      let totalValue = 0;
      let expiringCarts = 0;

      for (const key of cartKeys) {
        try {
          const cartData = await client.get(key);
          if (cartData) {
            const cart = JSON.parse(cartData);
            totalCarts++;

            if (cart.customerId.startsWith('anonymous_')) {
              anonymousCarts++;
            } else {
              authenticatedCarts++;
            }

            totalItems += cart.items.length;
            totalValue += cart.total || 0;

            // Check if cart is expiring soon (less than 2 hours TTL)
            const ttl = await client.ttl(key);
            if (ttl > 0 && ttl < 7200) {
              // 2 hours = 7200 seconds
              expiringCarts++;
            }
          }
        } catch (error) {
          console.error(`Error processing cart statistics for ${key}:`, error);
        }
      }

      return {
        totalCarts,
        anonymousCarts,
        authenticatedCarts,
        averageItems: totalCarts > 0 ? totalItems / totalCarts : 0,
        averageValue: totalCarts > 0 ? totalValue / totalCarts : 0,
        expiringCarts,
      };
    } catch (error) {
      console.error('Error getting cart statistics:', error);
      return {
        totalCarts: 0,
        anonymousCarts: 0,
        authenticatedCarts: 0,
        averageItems: 0,
        averageValue: 0,
        expiringCarts: 0,
      };
    }
  }

  /**
   * Get carts that are expiring soon (for reminder notifications)
   */
  async getExpiringCarts(hoursBeforeExpiry: number = 2): Promise<
    {
      customerId: string;
      cart: Cart;
      expiresInSeconds: number;
    }[]
  > {
    const expiringCarts: {
      customerId: string;
      cart: Cart;
      expiresInSeconds: number;
    }[] = [];

    try {
      const client = await redisService.connect();
      const cartKeys = await client.keys('cart:*');
      const thresholdSeconds = hoursBeforeExpiry * 3600;

      for (const key of cartKeys) {
        try {
          const ttl = await client.ttl(key);

          // Check if cart is expiring within the threshold and has items
          if (ttl > 0 && ttl < thresholdSeconds) {
            const cartData = await client.get(key);
            if (cartData) {
              const cart = JSON.parse(cartData);

              // Only include carts with items
              if (cart.items && cart.items.length > 0) {
                const customerId = key.replace('cart:', '');
                expiringCarts.push({
                  customerId,
                  cart,
                  expiresInSeconds: ttl,
                });
              }
            }
          }
        } catch (error) {
          console.error(`Error processing expiring cart ${key}:`, error);
        }
      }

      return expiringCarts;
    } catch (error) {
      console.error('Error getting expiring carts:', error);
      return [];
    }
  }

  /**
   * Extend cart expiration for active users
   */
  async extendCartExpirationForActiveUsers(): Promise<{
    extended: number;
    errors: number;
  }> {
    let extended = 0;
    let errors = 0;

    try {
      const client = await redisService.connect();
      const cartKeys = await client.keys('cart:*');

      for (const key of cartKeys) {
        try {
          const customerId = key.replace('cart:', '');

          // Only extend authenticated user carts (not anonymous)
          if (!customerId.startsWith('anonymous_')) {
            const ttl = await client.ttl(key);

            // If cart is expiring within 6 hours, extend it
            if (ttl > 0 && ttl < 21600) {
              // 6 hours = 21600 seconds
              await this.extendCartExpiration(customerId, 86400); // Extend to 24 hours
              extended++;
            }
          }
        } catch (error) {
          console.error(`Error extending cart expiration for ${key}:`, error);
          errors++;
        }
      }

      return { extended, errors };
    } catch (error) {
      console.error('Error extending cart expirations:', error);
      return { extended, errors: errors + 1 };
    }
  }

  /**
   * Reserve inventory for cart items during checkout process
   */
  async reserveCartInventory(
    customerId: string,
    sessionId?: string,
    expirationMinutes: number = 30
  ): Promise<{ reservationId: string; success: boolean; failures: any[] }> {
    const cart = await this.getCart(customerId);

    if (cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Prepare reservation items
    const reservationItems = cart.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    try {
      const result = await inventoryService.reserveInventory(
        reservationItems,
        customerId,
        sessionId,
        expirationMinutes
      );

      return result;
    } catch (error) {
      console.error('Error reserving cart inventory:', error);
      throw new Error('Failed to reserve inventory for checkout');
    }
  }

  /**
   * Release inventory reservation (for cancelled checkout)
   */
  async releaseCartReservation(reservationId: string): Promise<void> {
    try {
      await inventoryService.releaseReservation(reservationId);
    } catch (error) {
      console.error('Error releasing cart reservation:', error);
      throw new Error('Failed to release inventory reservation');
    }
  }

  /**
   * Convert cart reservation to order (mark as used)
   */
  async convertReservationToOrder(
    reservationId: string,
    orderId: string
  ): Promise<void> {
    try {
      await inventoryService.convertReservationToOrder(reservationId, orderId);
    } catch (error) {
      console.error('Error converting reservation to order:', error);
      throw new Error('Failed to convert reservation to order');
    }
  }

  /**
   * Validate cart for checkout with real-time inventory check
   */
  async validateCartForCheckout(customerId: string): Promise<{
    isValid: boolean;
    issues: CartIssue[];
    totalItems: number;
    totalValue: number;
  }> {
    const cart = await this.getCart(customerId);
    const validationResult = await this.validateCartItems(cart);

    if (!validationResult.isValid && validationResult.updatedCart) {
      // Save updated cart if there were changes
      await this.saveCart(validationResult.updatedCart);
    }

    const finalCart = validationResult.updatedCart || cart;

    return {
      isValid: validationResult.isValid,
      issues: validationResult.issues,
      totalItems: finalCart.items.reduce((sum, item) => sum + item.quantity, 0),
      totalValue: finalCart.total,
    };
  }

  /**
   * Get inventory status for all cart items
   */
  async getCartInventoryStatus(customerId: string): Promise<
    {
      productId: string;
      quantity: number;
      inventoryStatus: InventoryStatus | null;
      isAvailable: boolean;
    }[]
  > {
    const cart = await this.getCart(customerId);
    const inventoryStatuses = [];

    for (const item of cart.items) {
      try {
        const inventoryStatus = await inventoryService.getInventoryStatus(
          item.productId
        );
        const isAvailable = await inventoryService.checkAvailability(
          item.productId,
          item.quantity
        );

        inventoryStatuses.push({
          productId: item.productId,
          quantity: item.quantity,
          inventoryStatus,
          isAvailable,
        });
      } catch (error) {
        console.error(
          `Error getting inventory status for ${item.productId}:`,
          error
        );
        inventoryStatuses.push({
          productId: item.productId,
          quantity: item.quantity,
          inventoryStatus: null,
          isAvailable: false,
        });
      }
    }

    return inventoryStatuses;
  }

  /**
   * Update cart items based on inventory changes
   */
  async updateCartFromInventoryChanges(
    customerId: string,
    productId: string
  ): Promise<Cart> {
    const cart = await this.getCart(customerId);
    const itemIndex = cart.items.findIndex(
      item => item.productId === productId
    );

    if (itemIndex === -1) {
      return cart; // Product not in cart
    }

    const item = cart.items[itemIndex];
    const inventoryStatus =
      await inventoryService.getInventoryStatus(productId);

    if (!inventoryStatus) {
      // Product no longer has inventory tracking, remove from cart
      cart.items.splice(itemIndex, 1);
    } else if (inventoryStatus.trackQuantity) {
      if (inventoryStatus.availableQuantity === 0) {
        // Out of stock, remove from cart
        cart.items.splice(itemIndex, 1);
      } else if (inventoryStatus.availableQuantity < item.quantity) {
        // Reduce quantity to available amount
        cart.items[itemIndex].quantity = inventoryStatus.availableQuantity;
      }
    }

    // Recalculate totals and save
    this.calculateCartTotals(cart);
    cart.updatedAt = new Date().toISOString();
    await this.saveCart(cart);

    return cart;
  }

  /**
   * Validate TTL for cart expiration
   * Min: 1 hour, Max: 7 days
   */
  validateTtl(ttlSeconds: number): number {
    const MIN_TTL = 3600; // 1 hour
    const MAX_TTL = 7 * 24 * 60 * 60; // 7 days
    return Math.min(Math.max(ttlSeconds, MIN_TTL), MAX_TTL);
  }

  /**
   * Validate reservation expiration minutes
   * Min: 5 minutes, Max: 2 hours
   */
  validateReservationExpiration(expirationMinutes: number): number {
    const MIN_EXPIRATION = 5; // 5 minutes
    const MAX_EXPIRATION = 120; // 2 hours
    return Math.min(
      Math.max(expirationMinutes, MIN_EXPIRATION),
      MAX_EXPIRATION
    );
  }
}
