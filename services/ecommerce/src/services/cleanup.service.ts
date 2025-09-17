import { prisma } from '../lib/prisma';
import { CartService } from './cart.service';
import { SessionService } from './session.service';

export class CleanupService {
  private cartService: CartService;
  private sessionService: SessionService;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.cartService = new CartService(prisma);
    this.sessionService = new SessionService();
  }

  /**
   * Start automatic cleanup process
   */
  startAutomaticCleanup(intervalMinutes: number = 60): void {
    if (this.cleanupInterval) {
      console.log('Cleanup service is already running');
      return;
    }

    const intervalMs = intervalMinutes * 60 * 1000;

    console.log(`Starting automatic cleanup service (interval: ${intervalMinutes} minutes)`);

    // Run initial cleanup
    this.runCleanup();

    // Schedule recurring cleanup
    this.cleanupInterval = setInterval(() => {
      this.runCleanup();
    }, intervalMs);
  }

  /**
   * Stop automatic cleanup process
   */
  stopAutomaticCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('Automatic cleanup service stopped');
    }
  }

  /**
   * Run cleanup manually
   */
  async runCleanup(): Promise<{
    cartCleanup: { cleaned: number; errors: number };
    sessionCleanup: { cleaned: number; errors: number };
    orphanedDataCleanup: { cleaned: number; errors: number };
    timestamp: string;
  }> {
    console.log('Starting cleanup process...');

    const startTime = Date.now();

    try {
      // Run cart and session cleanup in parallel
      const [cartCleanup, sessionCleanup] = await Promise.all([
        this.cartService.cleanupExpiredCarts(),
        this.sessionService.cleanupExpiredSessions(),
      ]);

      // Clean up orphaned data (carts without sessions, etc.)
      const orphanedDataCleanup = await this.cleanupOrphanedData();

      const duration = Date.now() - startTime;

      console.log(`Cleanup completed in ${duration}ms:`, {
        carts: cartCleanup,
        sessions: sessionCleanup,
        orphanedData: orphanedDataCleanup,
      });

      return {
        cartCleanup,
        sessionCleanup,
        orphanedDataCleanup,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error during cleanup process:', error);
      throw error;
    }
  }

  /**
   * Clean up orphaned data (carts without sessions, etc.)
   */
  private async cleanupOrphanedData(): Promise<{ cleaned: number; errors: number }> {
    let cleaned = 0;
    let errors = 0;

    try {
      const { redisService } = await import('./redis.service');
      const client = await redisService.connect();

      // Get all cart keys and session keys
      const [cartKeys, sessionKeys] = await Promise.all([
        client.keys('cart:*'),
        client.keys('session:*')
      ]);

      // Extract customer IDs from session keys
      const activeCustomerIds = new Set<string>();
      for (const sessionKey of sessionKeys) {
        try {
          const sessionData = await client.get(sessionKey);
          if (sessionData) {
            const session = JSON.parse(sessionData);
            if (session.customerId) {
              activeCustomerIds.add(session.customerId);
            }
          }
        } catch (error) {
          console.error(`Error processing session key ${sessionKey}:`, error);
          errors++;
        }
      }

      // Check for orphaned carts (carts without active sessions)
      for (const cartKey of cartKeys) {
        try {
          const customerId = cartKey.replace('cart:', '');

          // Skip authenticated user carts (they don't need active sessions)
          if (!customerId.startsWith('anonymous_')) {
            continue;
          }

          // Check if this anonymous cart has an active session
          if (!activeCustomerIds.has(customerId)) {
            // Check cart age before deleting
            const cartData = await client.get(cartKey);
            if (cartData) {
              const cart = JSON.parse(cartData);
              const updatedAt = new Date(cart.updatedAt);
              const hoursSinceUpdate = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60);

              // Delete anonymous carts older than 2 hours without active sessions
              if (hoursSinceUpdate > 2) {
                await client.del(cartKey);
                cleaned++;
                console.log(`Cleaned orphaned cart: ${cartKey}`);
              }
            }
          }
        } catch (error) {
          console.error(`Error processing orphaned cart ${cartKey}:`, error);
          errors++;
        }
      }

      return { cleaned, errors };
    } catch (error) {
      console.error('Error during orphaned data cleanup:', error);
      return { cleaned, errors: errors + 1 };
    }
  }

  /**
   * Get cleanup statistics
   */
  async getCleanupStatistics(): Promise<{
    cartStats: any;
    sessionStats: any;
    timestamp: string;
  }> {
    try {
      const [cartStats, sessionStats] = await Promise.all([
        this.cartService.getCartStatistics(),
        this.sessionService.getSessionStatistics(),
      ]);

      return {
        cartStats,
        sessionStats,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting cleanup statistics:', error);
      throw error;
    }
  }

  /**
   * Health check for cleanup service
   */
  isRunning(): boolean {
    return this.cleanupInterval !== null;
  }
}

// Create singleton instance
export const cleanupService = new CleanupService();