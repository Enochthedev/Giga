import { IGatewayService } from '../interfaces/gateway.interface';
import { logger } from '../lib/logger';
import { prisma } from '../lib/prisma';
import {
  GatewayConfig,
  GatewayResponse,
  GatewayStatus,
  GatewayType,
  PaymentGateway,
  WebhookEvent
} from '../types/gateway.types';
import { PayPalGateway } from './gateways/paypal-gateway.service';
import { SquareGateway } from './gateways/square-gateway.service';
import { StripeGateway } from './gateways/stripe-gateway.service';

export class GatewayService implements IGatewayService {
  private gatewayInstances: Map<string, PaymentGateway> = new Map();

  async createConfig(
    config: Omit<GatewayConfig, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<GatewayConfig> {
    try {
      logger.info('Creating gateway configuration', {
        type: config.type,
        name: config.name
      });

      const gatewayConfig = await prisma.gatewayConfig.create({
        data: {
          type: config.type,
          name: config.name,
          status: config.status || 'inactive',
          priority: config.priority || 50,
          credentials: config.credentials,
          settings: config.settings as any,
          healthCheck: config.healthCheck as any,
          rateLimit: config.rateLimit as any,
          metadata: config.metadata || {}
        }
      });

      const result = this.mapPrismaToGatewayConfig(gatewayConfig);

      logger.info('Gateway configuration created successfully', {
        id: result.id,
        type: result.type
      });

      return result;
    } catch (error) {
      logger.error('Failed to create gateway configuration', { error, config });
      throw error;
    }
  }

  async updateConfig(id: string, config: Partial<GatewayConfig>): Promise<GatewayConfig> {
    try {
      logger.info('Updating gateway configuration', { id, updates: config });

      const updateData: any = {};

      if (config.name) updateData.name = config.name;
      if (config.status) updateData.status = config.status;
      if (config.priority !== undefined) updateData.priority = config.priority;
      if (config.credentials) updateData.credentials = config.credentials;
      if (config.settings) updateData.settings = config.settings;
      if (config.healthCheck) updateData.healthCheck = config.healthCheck;
      if (config.rateLimit) updateData.rateLimit = config.rateLimit;
      if (config.metadata) updateData.metadata = config.metadata;

      const gatewayConfig = await prisma.gatewayConfig.update({
        where: { id },
        data: updateData
      });

      const result = this.mapPrismaToGatewayConfig(gatewayConfig);

      // Reinitialize gateway instance if it exists
      if (this.gatewayInstances.has(id)) {
        await this.initializeGateway(result);
      }

      logger.info('Gateway configuration updated successfully', { id });
      return result;
    } catch (error) {
      logger.error('Failed to update gateway configuration', { error, id, config });
      throw error;
    }
  }

  async getConfig(id: string): Promise<GatewayConfig> {
    try {
      const gatewayConfig = await prisma.gatewayConfig.findUnique({
        where: { id }
      });

      if (!gatewayConfig) {
        throw new Error(`Gateway configuration not found: ${id}`);
      }

      return this.mapPrismaToGatewayConfig(gatewayConfig);
    } catch (error) {
      logger.error('Failed to get gateway configuration', { error, id });
      throw error;
    }
  }

  async getAllConfigs(): Promise<GatewayConfig[]> {
    try {
      const gatewayConfigs = await prisma.gatewayConfig.findMany({
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'asc' }
        ]
      });

      return gatewayConfigs.map(this.mapPrismaToGatewayConfig);
    } catch (error) {
      logger.error('Failed to get all gateway configurations', { error });
      throw error;
    }
  }

  async deleteConfig(id: string): Promise<void> {
    try {
      logger.info('Deleting gateway configuration', { id });

      // Remove gateway instance if it exists
      this.gatewayInstances.delete(id);

      await prisma.gatewayConfig.delete({
        where: { id }
      });

      logger.info('Gateway configuration deleted successfully', { id });
    } catch (error) {
      logger.error('Failed to delete gateway configuration', { error, id });
      throw error;
    }
  }

  async initializeGateway(config: GatewayConfig): Promise<PaymentGateway> {
    try {
      logger.info('Initializing payment gateway', {
        id: config.id,
        type: config.type
      });

      let gateway: PaymentGateway;

      switch (config.type) {
        case 'stripe':
          gateway = new StripeGateway(config);
          break;
        case 'paypal':
          gateway = new PayPalGateway(config);
          break;
        case 'square':
          gateway = new SquareGateway(config);
          break;
        default:
          throw new Error(`Unsupported gateway type: ${config.type}`);
      }

      // Store the gateway instance
      this.gatewayInstances.set(config.id, gateway);

      logger.info('Payment gateway initialized successfully', {
        id: config.id,
        type: config.type
      });

      return gateway;
    } catch (error) {
      logger.error('Failed to initialize payment gateway', {
        error,
        configId: config.id,
        type: config.type
      });
      throw error;
    }
  }

  async testGateway(gatewayId: string): Promise<GatewayResponse> {
    try {
      logger.info('Testing gateway', { gatewayId });

      const gateway = this.gatewayInstances.get(gatewayId);
      if (!gateway) {
        const config = await this.getConfig(gatewayId);
        const initializedGateway = await this.initializeGateway(config);
        return this.performGatewayTest(initializedGateway);
      }

      return this.performGatewayTest(gateway);
    } catch (error) {
      logger.error('Gateway test failed', { error, gatewayId });
      return {
        success: false,
        error: {
          code: 'TEST_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  async processWebhook(
    gatewayId: string,
    payload: string,
    signature: string
  ): Promise<WebhookEvent> {
    try {
      logger.info('Processing webhook', { gatewayId });

      const gateway = this.gatewayInstances.get(gatewayId);
      if (!gateway) {
        throw new Error(`Gateway ${gatewayId} not initialized`);
      }

      // Verify webhook signature
      const isValid = gateway.verifyWebhook(payload, signature);
      if (!isValid) {
        throw new Error('Invalid webhook signature');
      }

      // Parse webhook event
      const webhookEvent = gateway.parseWebhook(payload);

      // Store webhook event
      const storedEvent = await this.storeWebhookEvent(webhookEvent);

      logger.info('Webhook processed successfully', {
        gatewayId,
        eventId: storedEvent.id,
        eventType: storedEvent.type
      });

      return storedEvent;
    } catch (error) {
      logger.error('Failed to process webhook', { error, gatewayId });
      throw error;
    }
  }

  async verifyWebhookSignature(
    gatewayId: string,
    payload: string,
    signature: string
  ): Promise<boolean> {
    try {
      const gateway = this.gatewayInstances.get(gatewayId);
      if (!gateway) {
        throw new Error(`Gateway ${gatewayId} not initialized`);
      }

      return gateway.verifyWebhook(payload, signature);
    } catch (error) {
      logger.error('Failed to verify webhook signature', { error, gatewayId });
      return false;
    }
  }

  getGatewayInstance(gatewayId: string): PaymentGateway | undefined {
    return this.gatewayInstances.get(gatewayId);
  }

  getAllGatewayInstances(): PaymentGateway[] {
    return Array.from(this.gatewayInstances.values());
  }

  async initializeAllGateways(): Promise<void> {
    try {
      logger.info('Initializing all gateways');

      const configs = await this.getAllConfigs();
      const activeConfigs = configs.filter(config => config.status === 'active');

      for (const config of activeConfigs) {
        try {
          await this.initializeGateway(config);
        } catch (error) {
          logger.error('Failed to initialize gateway during bulk initialization', {
            error,
            gatewayId: config.id,
            type: config.type
          });
          // Continue with other gateways even if one fails
        }
      }

      logger.info('Gateway initialization completed', {
        total: configs.length,
        active: activeConfigs.length,
        initialized: this.gatewayInstances.size
      });
    } catch (error) {
      logger.error('Failed to initialize all gateways', { error });
      throw error;
    }
  }

  private async performGatewayTest(gateway: PaymentGateway): Promise<GatewayResponse> {
    try {
      // Perform health check
      const isHealthy = await gateway.healthCheck();

      if (!isHealthy) {
        return {
          success: false,
          error: {
            code: 'HEALTH_CHECK_FAILED',
            message: 'Gateway health check failed'
          }
        };
      }

      // Get gateway status
      const status = await gateway.getStatus();

      return {
        success: true,
        data: {
          status,
          gatewayId: gateway.getId(),
          type: gateway.getType(),
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'TEST_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  private async storeWebhookEvent(event: WebhookEvent): Promise<WebhookEvent> {
    try {
      const storedEvent = await prisma.webhookEvent.create({
        data: {
          type: event.type,
          gatewayId: event.gatewayId,
          gatewayEventId: event.gatewayEventId,
          data: event.data as any,
          processed: event.processed || false,
          retryCount: event.retryCount || 0,
          metadata: event.metadata || {}
        }
      });

      return {
        id: storedEvent.id,
        type: storedEvent.type,
        gatewayId: storedEvent.gatewayId,
        gatewayEventId: storedEvent.gatewayEventId,
        data: storedEvent.data as Record<string, any>,
        timestamp: storedEvent.createdAt,
        processed: storedEvent.processed,
        retryCount: storedEvent.retryCount,
        metadata: storedEvent.metadata as Record<string, any>
      };
    } catch (error) {
      logger.error('Failed to store webhook event', { error, event });
      throw error;
    }
  }

  private mapPrismaToGatewayConfig(prismaConfig: any): GatewayConfig {
    return {
      id: prismaConfig.id,
      type: prismaConfig.type as GatewayType,
      name: prismaConfig.name,
      status: prismaConfig.status as GatewayStatus,
      priority: prismaConfig.priority,
      credentials: prismaConfig.credentials as Record<string, string>,
      settings: {
        supportedCurrencies: prismaConfig.settings.supportedCurrencies || [],
        supportedCountries: prismaConfig.settings.supportedCountries || [],
        supportedPaymentMethods: prismaConfig.settings.supportedPaymentMethods || [],
        minAmount: prismaConfig.settings.minAmount,
        maxAmount: prismaConfig.settings.maxAmount,
        processingFee: prismaConfig.settings.processingFee
      },
      healthCheck: {
        url: prismaConfig.healthCheck.url,
        interval: prismaConfig.healthCheck.interval || 60000,
        timeout: prismaConfig.healthCheck.timeout || 5000,
        retries: prismaConfig.healthCheck.retries || 3
      },
      rateLimit: {
        requestsPerSecond: prismaConfig.rateLimit.requestsPerSecond || 10,
        burstLimit: prismaConfig.rateLimit.burstLimit || 50
      },
      metadata: prismaConfig.metadata as Record<string, any>,
      createdAt: prismaConfig.createdAt,
      updatedAt: prismaConfig.updatedAt
    };
  }
}