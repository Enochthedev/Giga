import { HttpAuthServiceClient } from '../clients/auth.client';
import { HttpNotificationServiceClient } from '../clients/notification.client';
import { HttpPaymentServiceClient } from '../clients/payment.client';
import { PrismaClient } from '../generated/prisma-client';
import { CartService } from './cart.service';
import { EnhancedOrderService } from './enhanced-order.service';
import { InventoryService } from './inventory.service';
import { OrderService } from './order.service';

/**
 * Configuration for order service features
 */
export interface OrderServiceConfig {
  enableSagaPattern: boolean;
  enableDistributedTransactions: boolean;
  enableAdvancedRetry: boolean;
  enableTransactionLogging: boolean;
}

/**
 * Factory for creating order service instances with different capabilities
 */
export class OrderServiceFactory {
  /**
   * Create order service instance based on configuration
   */
  static create(
    config: OrderServiceConfig,
    _prisma: PrismaClient,
    cartService: CartService,
    inventoryService: InventoryService,
    authServiceClient: HttpAuthServiceClient,
    paymentServiceClient: HttpPaymentServiceClient,
    notificationServiceClient: HttpNotificationServiceClient
  ): OrderService {
    // If saga pattern or distributed transactions are enabled, use enhanced service
    if (config.enableSagaPattern || config.enableDistributedTransactions) {
      console.log(
        '[OrderServiceFactory] Creating enhanced order service with saga pattern and distributed transactions'
      );

      return new EnhancedOrderService(
        _prisma,
        cartService,
        inventoryService,
        authServiceClient,
        paymentServiceClient,
        notificationServiceClient
      );
    }

    // Otherwise, use the standard order service
    console.log('[OrderServiceFactory] Creating standard order service');

    return new OrderService(
      _prisma,
      cartService,
      inventoryService,
      authServiceClient,
      paymentServiceClient,
      notificationServiceClient
    );
  }

  /**
   * Get default configuration for production environment
   */
  static getProductionConfig(): OrderServiceConfig {
    return {
      enableSagaPattern: true,
      enableDistributedTransactions: true,
      enableAdvancedRetry: true,
      enableTransactionLogging: true,
    };
  }

  /**
   * Get configuration for development environment
   */
  static getDevelopmentConfig(): OrderServiceConfig {
    return {
      enableSagaPattern: process.env.ENABLE_SAGA_PATTERN === 'true',
      enableDistributedTransactions:
        process.env.ENABLE_DISTRIBUTED_TRANSACTIONS === 'true',
      enableAdvancedRetry: process.env.ENABLE_ADVANCED_RETRY === 'true',
      enableTransactionLogging:
        process.env.ENABLE_TRANSACTION_LOGGING === 'true',
    };
  }

  /**
   * Get configuration for testing environment
   */
  static getTestConfig(): OrderServiceConfig {
    return {
      enableSagaPattern: false,
      enableDistributedTransactions: false,
      enableAdvancedRetry: false,
      enableTransactionLogging: false,
    };
  }

  /**
   * Get configuration based on environment
   */
  static getConfigForEnvironment(
    environment: string = process.env.NODE_ENV || 'development'
  ): OrderServiceConfig {
    switch (environment.toLowerCase()) {
      case 'production':
        return this.getProductionConfig();
      case 'test':
      case 'testing':
        return this.getTestConfig();
      case 'development':
      default:
        return this.getDevelopmentConfig();
    }
  }
}
