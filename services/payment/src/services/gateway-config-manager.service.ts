import { logger } from '../lib/logger';
import { prisma } from '../lib/prisma';
import {
  GatewayConfig,
  GatewayStatus,
  GatewayType,
} from '../types/gateway.types';

/**
 * Enhanced Gateway Configuration Manager
 * Provides advanced configuration management with validation and caching
 */
export class GatewayConfigManager {
  private configCache: Map<string, GatewayConfig> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly cacheTimeout = 300000; // 5 minutes

  /**
   * Creates a new gateway configuration with validation
   */
  async createConfig(
    config: Omit<GatewayConfig, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<GatewayConfig> {
    try {
      logger.info('Creating gateway configuration', {
        type: config.type,
        name: config.name,
      });

      // Validate configuration
      this.validateGatewayConfig(config);

      // Check for duplicate names
      await this.checkDuplicateName(config.name);

      const gatewayConfig = await prisma.gatewayConfig.create({
        data: {
          type: config.type,
          name: config.name,
          status: config.status || 'INACTIVE',
          priority: config.priority || 50,
          credentials: config.credentials,
          settings: config.settings as any,
          healthCheck: config.healthCheck as any,
          rateLimit: config.rateLimit as any,
          metadata: config.metadata || {},
        },
      });

      const result = this.mapPrismaToGatewayConfig(gatewayConfig);

      // Cache the new configuration
      this.cacheConfig(result);

      logger.info('Gateway configuration created successfully', {
        id: result.id,
        type: result.type,
      });

      return result;
    } catch (error) {
      logger.error('Failed to create gateway configuration', { error, config });
      throw error;
    }
  }

  /**
   * Updates gateway configuration with validation
   */
  async updateConfig(
    id: string,
    updates: Partial<GatewayConfig>
  ): Promise<GatewayConfig> {
    try {
      logger.info('Updating gateway configuration', { id, updates });

      // Get existing config for validation
      const existingConfig = await this.getConfig(id);

      // Validate updates
      if (updates.name && updates.name !== existingConfig.name) {
        await this.checkDuplicateName(updates.name, id);
      }

      const updateData: any = {};
      if (updates.name) updateData.name = updates.name;
      if (updates.status) updateData.status = updates.status;
      if (updates.priority !== undefined)
        updateData.priority = updates.priority;
      if (updates.credentials) {
        this.validateCredentials(
          updates.type || existingConfig.type,
          updates.credentials
        );
        updateData.credentials = updates.credentials;
      }
      if (updates.settings) {
        this.validateSettings(updates.settings);
        updateData.settings = updates.settings;
      }
      if (updates.healthCheck) {
        this.validateHealthCheck(updates.healthCheck);
        updateData.healthCheck = updates.healthCheck;
      }
      if (updates.rateLimit) {
        this.validateRateLimit(updates.rateLimit);
        updateData.rateLimit = updates.rateLimit;
      }
      if (updates.metadata) updateData.metadata = updates.metadata;

      const gatewayConfig = await prisma.gatewayConfig.update({
        where: { id },
        data: updateData,
      });

      const result = this.mapPrismaToGatewayConfig(gatewayConfig);

      // Update cache
      this.cacheConfig(result);

      logger.info('Gateway configuration updated successfully', { id });
      return result;
    } catch (error) {
      logger.error('Failed to update gateway configuration', {
        error,
        id,
        updates,
      });
      throw error;
    }
  }

  /**
   * Gets gateway configuration with caching
   */
  async getConfig(id: string): Promise<GatewayConfig> {
    try {
      // Check cache first
      const cached = this.getCachedConfig(id);
      if (cached) {
        return cached;
      }

      const gatewayConfig = await prisma.gatewayConfig.findUnique({
        where: { id },
      });

      if (!gatewayConfig) {
        throw new Error(`Gateway configuration not found: ${id}`);
      }

      const result = this.mapPrismaToGatewayConfig(gatewayConfig);
      this.cacheConfig(result);

      return result;
    } catch (error) {
      logger.error('Failed to get gateway configuration', { error, id });
      throw error;
    }
  }

  /**
   * Gets all gateway configurations with filtering
   */
  async getAllConfigs(filters?: {
    status?: GatewayStatus;
    type?: GatewayType;
    isActive?: boolean;
  }): Promise<GatewayConfig[]> {
    try {
      const where: any = {};

      if (filters?.status) {
        where.status = filters.status;
      }
      if (filters?.type) {
        where.type = filters.type;
      }

      const gatewayConfigs = await prisma.gatewayConfig.findMany({
        where,
        orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
      });

      let results = gatewayConfigs.map(this.mapPrismaToGatewayConfig);

      // Apply additional filters
      if (filters?.isActive !== undefined) {
        results = results.filter(config =>
          filters.isActive
            ? config.status === 'ACTIVE'
            : config.status !== 'ACTIVE'
        );
      }

      // Cache all results
      results.forEach(config => this.cacheConfig(config));

      return results;
    } catch (error) {
      logger.error('Failed to get all gateway configurations', {
        error,
        filters,
      });
      throw error;
    }
  }

  /**
   * Gets active gateway configurations sorted by priority
   */
  async getActiveConfigs(): Promise<GatewayConfig[]> {
    return this.getAllConfigs({ status: 'ACTIVE' });
  }

  /**
   * Gets gateway configurations by type
   */
  async getConfigsByType(type: GatewayType): Promise<GatewayConfig[]> {
    return this.getAllConfigs({ type });
  }

  /**
   * Deletes gateway configuration
   */
  async deleteConfig(id: string): Promise<void> {
    try {
      logger.info('Deleting gateway configuration', { id });

      // Check if gateway has active transactions
      const activeTransactions = await prisma.transaction.count({
        where: {
          gatewayId: id,
          status: {
            in: ['PENDING', 'PROCESSING'],
          },
        },
      });

      if (activeTransactions > 0) {
        throw new Error(
          `Cannot delete gateway with ${activeTransactions} active transactions`
        );
      }

      await prisma.gatewayConfig.delete({
        where: { id },
      });

      // Remove from cache
      this.configCache.delete(id);
      this.cacheExpiry.delete(id);

      logger.info('Gateway configuration deleted successfully', { id });
    } catch (error) {
      logger.error('Failed to delete gateway configuration', { error, id });
      throw error;
    }
  }

  /**
   * Activates a gateway configuration
   */
  async activateGateway(id: string): Promise<GatewayConfig> {
    logger.info('Activating gateway', { id });
    return this.updateConfig(id, { status: 'ACTIVE' });
  }

  /**
   * Deactivates a gateway configuration
   */
  async deactivateGateway(id: string): Promise<GatewayConfig> {
    logger.info('Deactivating gateway', { id });
    return this.updateConfig(id, { status: 'INACTIVE' });
  }

  /**
   * Sets gateway to maintenance mode
   */
  async setMaintenanceMode(id: string): Promise<GatewayConfig> {
    logger.info('Setting gateway to maintenance mode', { id });
    return this.updateConfig(id, { status: 'MAINTENANCE' });
  }

  /**
   * Updates gateway priority
   */
  async updatePriority(id: string, priority: number): Promise<GatewayConfig> {
    if (priority < 0 || priority > 100) {
      throw new Error('Priority must be between 0 and 100');
    }
    return this.updateConfig(id, { priority });
  }

  /**
   * Clears configuration cache
   */
  clearCache(id?: string): void {
    if (id) {
      this.configCache.delete(id);
      this.cacheExpiry.delete(id);
      logger.debug('Cleared cache for gateway', { id });
    } else {
      this.configCache.clear();
      this.cacheExpiry.clear();
      logger.debug('Cleared all gateway configuration cache');
    }
  }

  /**
   * Gets cache statistics
   */
  getCacheStats(): {
    size: number;
    hitRate: number;
    entries: Array<{ id: string; expiresAt: Date }>;
  } {
    const entries = Array.from(this.cacheExpiry.entries()).map(
      ([id, expiry]) => ({
        id,
        expiresAt: new Date(expiry),
      })
    );

    return {
      size: this.configCache.size,
      hitRate: 0, // Would need to track hits/misses for accurate calculation
      entries,
    };
  }

  private validateGatewayConfig(
    config: Omit<GatewayConfig, 'id' | 'createdAt' | 'updatedAt'>
  ): void {
    if (!config.name || config.name.trim().length === 0) {
      throw new Error('Gateway name is required');
    }

    if (!config.type) {
      throw new Error('Gateway type is required');
    }

    this.validateCredentials(config.type, config.credentials);
    this.validateSettings(config.settings);
    this.validateHealthCheck(config.healthCheck);
    this.validateRateLimit(config.rateLimit);
  }

  private validateCredentials(
    type: GatewayType,
    credentials: Record<string, string>
  ): void {
    const requiredFields: Record<GatewayType, string[]> = {
      STRIPE: ['secretKey', 'publishableKey'],
      PAYPAL: ['clientId', 'clientSecret'],
      SQUARE: ['accessToken', 'applicationId'],
      ADYEN: ['apiKey', 'merchantAccount'],
      BRAINTREE: ['merchantId', 'publicKey', 'privateKey'],
      PAYSTACK: ['secretKey', 'publicKey'],
      FLUTTERWAVE: ['secretKey', 'publicKey'],
      DUMMY: [], // No credentials required for dummy gateway
    };

    const required = requiredFields[type] || [];
    const missing = required.filter(field => !credentials[field]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required credentials for ${type}: ${missing.join(', ')}`
      );
    }
  }

  private validateSettings(settings: GatewayConfig['settings']): void {
    if (
      !settings.supportedCurrencies ||
      settings.supportedCurrencies.length === 0
    ) {
      throw new Error('At least one supported currency is required');
    }

    if (
      !settings.supportedCountries ||
      settings.supportedCountries.length === 0
    ) {
      throw new Error('At least one supported country is required');
    }

    if (
      !settings.supportedPaymentMethods ||
      settings.supportedPaymentMethods.length === 0
    ) {
      throw new Error('At least one supported payment method is required');
    }

    if (settings.minAmount !== undefined && settings.minAmount < 0) {
      throw new Error('Minimum amount cannot be negative');
    }

    if (settings.maxAmount !== undefined && settings.maxAmount <= 0) {
      throw new Error('Maximum amount must be positive');
    }

    if (
      settings.minAmount !== undefined &&
      settings.maxAmount !== undefined &&
      settings.minAmount >= settings.maxAmount
    ) {
      throw new Error('Minimum amount must be less than maximum amount');
    }
  }

  private validateHealthCheck(healthCheck: GatewayConfig['healthCheck']): void {
    if (healthCheck.interval < 10000) {
      throw new Error('Health check interval must be at least 10 seconds');
    }

    if (healthCheck.timeout < 1000) {
      throw new Error('Health check timeout must be at least 1 second');
    }

    if (healthCheck.timeout >= healthCheck.interval) {
      throw new Error('Health check timeout must be less than interval');
    }

    if (healthCheck.retries < 1 || healthCheck.retries > 10) {
      throw new Error('Health check retries must be between 1 and 10');
    }
  }

  private validateRateLimit(rateLimit: GatewayConfig['rateLimit']): void {
    if (rateLimit.requestsPerSecond < 1) {
      throw new Error('Requests per second must be at least 1');
    }

    if (rateLimit.burstLimit < rateLimit.requestsPerSecond) {
      throw new Error(
        'Burst limit must be at least equal to requests per second'
      );
    }
  }

  private async checkDuplicateName(
    name: string,
    excludeId?: string
  ): Promise<void> {
    const existing = await prisma.gatewayConfig.findFirst({
      where: {
        name,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    if (existing) {
      throw new Error(`Gateway with name '${name}' already exists`);
    }
  }

  private getCachedConfig(id: string): GatewayConfig | null {
    const expiry = this.cacheExpiry.get(id);
    if (!expiry || Date.now() > expiry) {
      this.configCache.delete(id);
      this.cacheExpiry.delete(id);
      return null;
    }

    return this.configCache.get(id) || null;
  }

  private cacheConfig(config: GatewayConfig): void {
    this.configCache.set(config.id, config);
    this.cacheExpiry.set(config.id, Date.now() + this.cacheTimeout);
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
        supportedPaymentMethods:
          prismaConfig.settings.supportedPaymentMethods || [],
        minAmount: prismaConfig.settings.minAmount,
        maxAmount: prismaConfig.settings.maxAmount,
        processingFee: prismaConfig.settings.processingFee,
      },
      healthCheck: {
        url: prismaConfig.healthCheck.url,
        interval: prismaConfig.healthCheck.interval || 60000,
        timeout: prismaConfig.healthCheck.timeout || 5000,
        retries: prismaConfig.healthCheck.retries || 3,
      },
      rateLimit: {
        requestsPerSecond: prismaConfig.rateLimit.requestsPerSecond || 10,
        burstLimit: prismaConfig.rateLimit.burstLimit || 50,
      },
      metadata: prismaConfig.metadata as Record<string, any>,
      createdAt: prismaConfig.createdAt,
      updatedAt: prismaConfig.updatedAt,
    };
  }
}
