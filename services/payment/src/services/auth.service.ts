import axios from 'axios';
import crypto from 'crypto';
import { config } from '../config';
import { logger } from '../lib/logger';
import prisma from '../lib/prisma';
import { pciComplianceService } from './pci-compliance.service';

export interface TokenValidationResponse {
  valid: boolean;
  userId?: string;
  email?: string;
  roles?: string[];
  permissions?: string[];
  sessionId?: string;
}

export interface APIKeyData {
  id: string;
  name: string;
  permissions: string[];
  serviceId: string;
  isActive: boolean;
  expiresAt?: Date;
}

export interface ResourceOwnershipCheck {
  userId: string;
  resourceId: string;
  resourceType: string;
  isOwner: boolean;
}

/**
 * Authentication Service for integrating with Auth Service and managing API keys
 */
export class AuthService {
  private readonly authServiceUrl: string;
  private readonly rateLimitWindow: number = 15 * 60 * 1000; // 15 minutes
  private readonly maxAuthAttempts: number = 10;

  constructor() {
    this.authServiceUrl = config.services.auth;
  }

  /**
   * Validate JWT token with Auth Service
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.authServiceUrl}/api/v1/auth/validate-token`,
        { token },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Service-Name': 'payment-service',
          },
          timeout: 5000,
        }
      );

      return response.data.success && response.data.data.valid;
    } catch (error) {
      logger.error('Token validation failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        authServiceUrl: this.authServiceUrl,
      });
      return false;
    }
  }

  /**
   * Get user details from Auth Service
   */
  async getUserDetails(
    userId: string
  ): Promise<TokenValidationResponse | null> {
    try {
      const response = await axios.get(
        `${this.authServiceUrl}/api/v1/users/${userId}`,
        {
          headers: {
            'X-Service-Name': 'payment-service',
            'X-API-Key': config.security.apiKeySecret,
          },
          timeout: 5000,
        }
      );

      if (response.data.success) {
        const user = response.data.data;
        return {
          valid: true,
          userId: user.id,
          email: user.email,
          roles: user.roles || [],
          permissions: user.permissions || [],
        };
      }

      return null;
    } catch (error) {
      logger.error('Failed to get user details', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  /**
   * Validate API key for service-to-service authentication
   */
  async validateAPIKey(apiKey: string): Promise<APIKeyData | null> {
    try {
      // Hash the API key for lookup
      const hashedKey = crypto
        .createHash('sha256')
        .update(apiKey)
        .digest('hex');

      // Look up API key in database
      const keyRecord = await prisma.apiKey.findFirst({
        where: {
          hashedKey,
          isActive: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      });

      if (!keyRecord) {
        await pciComplianceService.logAuditEvent({
          eventType: 'API_KEY_VALIDATION',
          resource: 'api_keys',
          action: 'validate',
          severity: 'medium',
          success: false,
          details: {
            reason: 'API key not found or expired',
            hashedKey: hashedKey.substring(0, 8) + '...',
          },
        });
        return null;
      }

      // Update last used timestamp
      await prisma.apiKey.update({
        where: { id: keyRecord.id },
        data: { lastUsedAt: new Date() },
      });

      await pciComplianceService.logAuditEvent({
        eventType: 'API_KEY_VALIDATION',
        resource: 'api_keys',
        action: 'validate',
        severity: 'low',
        success: true,
        details: {
          keyId: keyRecord.id,
          serviceName: keyRecord.name,
        },
      });

      return {
        id: keyRecord.id,
        name: keyRecord.name,
        permissions: keyRecord.permissions as string[],
        serviceId: keyRecord.serviceId,
        isActive: keyRecord.isActive,
        expiresAt: keyRecord.expiresAt,
      };
    } catch (error) {
      logger.error('API key validation failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  /**
   * Create a new API key for service authentication
   */
  async createAPIKey(
    name: string,
    serviceId: string,
    permissions: string[],
    expiresAt?: Date
  ): Promise<{ apiKey: string; keyData: APIKeyData }> {
    try {
      // Generate secure API key
      const apiKey = this.generateAPIKey();
      const hashedKey = crypto
        .createHash('sha256')
        .update(apiKey)
        .digest('hex');

      // Store in database
      const keyRecord = await prisma.apiKey.create({
        data: {
          name,
          serviceId,
          hashedKey,
          permissions,
          isActive: true,
          expiresAt,
          createdAt: new Date(),
        },
      });

      await pciComplianceService.logAuditEvent({
        eventType: 'API_KEY_CREATION',
        resource: 'api_keys',
        action: 'create',
        severity: 'high',
        success: true,
        details: {
          keyId: keyRecord.id,
          name,
          serviceId,
          permissions,
          expiresAt,
        },
      });

      const keyData: APIKeyData = {
        id: keyRecord.id,
        name: keyRecord.name,
        permissions: keyRecord.permissions as string[],
        serviceId: keyRecord.serviceId,
        isActive: keyRecord.isActive,
        expiresAt: keyRecord.expiresAt,
      };

      return { apiKey, keyData };
    } catch (error) {
      await pciComplianceService.logAuditEvent({
        eventType: 'API_KEY_CREATION',
        resource: 'api_keys',
        action: 'create',
        severity: 'high',
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      logger.error('Failed to create API key', {
        name,
        serviceId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Revoke an API key
   */
  async revokeAPIKey(keyId: string, reason: string): Promise<void> {
    try {
      await prisma.apiKey.update({
        where: { id: keyId },
        data: {
          isActive: false,
          revokedAt: new Date(),
          revokeReason: reason,
        },
      });

      await pciComplianceService.logAuditEvent({
        eventType: 'API_KEY_REVOCATION',
        resource: 'api_keys',
        action: 'revoke',
        severity: 'high',
        success: true,
        details: {
          keyId,
          reason,
        },
      });

      logger.info('API key revoked', { keyId, reason });
    } catch (error) {
      await pciComplianceService.logAuditEvent({
        eventType: 'API_KEY_REVOCATION',
        resource: 'api_keys',
        action: 'revoke',
        severity: 'high',
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      logger.error('Failed to revoke API key', {
        keyId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Check if user owns a specific resource
   */
  async checkResourceOwnership(
    userId: string,
    resourceId: string,
    resourcePath: string
  ): Promise<boolean> {
    try {
      // Determine resource type from path
      const resourceType = this.extractResourceType(resourcePath);

      let isOwner = false;

      switch (resourceType) {
        case 'transactions':
          const transaction = await prisma.transaction.findFirst({
            where: { id: resourceId, userId },
          });
          isOwner = !!transaction;
          break;

        case 'payment-methods':
          const paymentMethod = await prisma.paymentMethod.findFirst({
            where: { id: resourceId, userId },
          });
          isOwner = !!paymentMethod;
          break;

        case 'subscriptions':
          const subscription = await prisma.subscription.findFirst({
            where: { id: resourceId, userId },
          });
          isOwner = !!subscription;
          break;

        case 'refunds':
          const refund = await prisma.refund.findFirst({
            where: {
              id: resourceId,
              transaction: { userId },
            },
            include: { transaction: true },
          });
          isOwner = !!refund;
          break;

        default:
          logger.warn('Unknown resource type for ownership check', {
            resourceType,
            resourcePath,
          });
          isOwner = false;
      }

      await pciComplianceService.logAuditEvent({
        eventType: 'RESOURCE_OWNERSHIP_CHECK',
        userId,
        resource: resourceType,
        action: 'ownership_check',
        severity: 'low',
        success: true,
        details: {
          resourceId,
          resourceType,
          isOwner,
        },
      });

      return isOwner;
    } catch (error) {
      logger.error('Resource ownership check failed', {
        userId,
        resourceId,
        resourcePath,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  /**
   * Check authentication rate limit for IP address
   */
  async checkAuthRateLimit(ipAddress: string): Promise<boolean> {
    try {
      const windowStart = new Date(Date.now() - this.rateLimitWindow);

      // Count failed authentication attempts in the window
      const failedAttempts = await prisma.auditLog.count({
        where: {
          eventType: 'AUTHENTICATION',
          ipAddress,
          success: false,
          timestamp: {
            gte: windowStart,
          },
        },
      });

      const isAllowed = failedAttempts < this.maxAuthAttempts;

      if (!isAllowed) {
        await pciComplianceService.logAuditEvent({
          eventType: 'RATE_LIMIT_EXCEEDED',
          ipAddress,
          resource: 'authentication',
          action: 'rate_limit_check',
          severity: 'medium',
          success: false,
          details: {
            failedAttempts,
            maxAttempts: this.maxAuthAttempts,
            windowMinutes: this.rateLimitWindow / (60 * 1000),
          },
        });
      }

      return isAllowed;
    } catch (error) {
      logger.error('Auth rate limit check failed', {
        ipAddress,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return true; // Allow on error to avoid blocking legitimate requests
    }
  }

  /**
   * Get API key usage statistics
   */
  async getAPIKeyUsage(keyId: string, days: number = 30): Promise<any> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const usage = await prisma.auditLog.groupBy({
        by: ['eventType'],
        where: {
          details: {
            path: ['keyId'],
            equals: keyId,
          },
          timestamp: {
            gte: startDate,
          },
        },
        _count: {
          eventType: true,
        },
      });

      const keyDetails = await prisma.apiKey.findUnique({
        where: { id: keyId },
        select: {
          name: true,
          serviceId: true,
          createdAt: true,
          lastUsedAt: true,
          isActive: true,
        },
      });

      return {
        keyDetails,
        usage,
        period: {
          startDate,
          endDate: new Date(),
          days,
        },
      };
    } catch (error) {
      logger.error('Failed to get API key usage', {
        keyId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Rotate API key
   */
  async rotateAPIKey(keyId: string): Promise<string> {
    try {
      const existingKey = await prisma.apiKey.findUnique({
        where: { id: keyId },
      });

      if (!existingKey) {
        throw new Error('API key not found');
      }

      // Generate new API key
      const newApiKey = this.generateAPIKey();
      const hashedKey = crypto
        .createHash('sha256')
        .update(newApiKey)
        .digest('hex');

      // Update the key
      await prisma.apiKey.update({
        where: { id: keyId },
        data: {
          hashedKey,
          rotatedAt: new Date(),
        },
      });

      await pciComplianceService.logAuditEvent({
        eventType: 'API_KEY_ROTATION',
        resource: 'api_keys',
        action: 'rotate',
        severity: 'high',
        success: true,
        details: {
          keyId,
          serviceName: existingKey.name,
        },
      });

      logger.info('API key rotated successfully', { keyId });

      return newApiKey;
    } catch (error) {
      await pciComplianceService.logAuditEvent({
        eventType: 'API_KEY_ROTATION',
        resource: 'api_keys',
        action: 'rotate',
        severity: 'high',
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      logger.error('Failed to rotate API key', {
        keyId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  // Private helper methods

  private generateAPIKey(): string {
    // Generate a secure API key with prefix
    const prefix = 'pk_';
    const timestamp = Date.now().toString(36);
    const randomBytes = crypto.randomBytes(32).toString('hex');

    return `${prefix}${timestamp}_${randomBytes}`;
  }

  private extractResourceType(resourcePath: string): string {
    // Extract resource type from API path
    // e.g., "/api/v1/payments/123" -> "payments"
    const pathParts = resourcePath.split('/');
    const apiIndex = pathParts.findIndex(part => part === 'api');

    if (apiIndex >= 0 && pathParts.length > apiIndex + 2) {
      return pathParts[apiIndex + 2];
    }

    return 'unknown';
  }

  /**
   * Get API keys with filtering and pagination
   */
  async getAPIKeys(
    whereClause: any,
    skip: number,
    limit: number
  ): Promise<any[]> {
    try {
      return await prisma.apiKey.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          serviceId: true,
          permissions: true,
          isActive: true,
          expiresAt: true,
          lastUsedAt: true,
          createdAt: true,
        },
      });
    } catch (error) {
      logger.error('Failed to get API keys', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Count API keys with filtering
   */
  async countAPIKeys(whereClause: any): Promise<number> {
    try {
      return await prisma.apiKey.count({
        where: whereClause,
      });
    } catch (error) {
      logger.error('Failed to count API keys', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Update API key
   */
  async updateAPIKey(keyId: string, updates: any): Promise<any> {
    try {
      const updatedKey = await prisma.apiKey.update({
        where: { id: keyId },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
      });

      await pciComplianceService.logAuditEvent({
        eventType: 'API_KEY_UPDATE',
        resource: 'api_keys',
        action: 'update',
        severity: 'medium',
        success: true,
        details: {
          keyId,
          updates,
        },
      });

      return updatedKey;
    } catch (error) {
      await pciComplianceService.logAuditEvent({
        eventType: 'API_KEY_UPDATE',
        resource: 'api_keys',
        action: 'update',
        severity: 'medium',
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      logger.error('Failed to update API key', {
        keyId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }
}

export const authService = new AuthService();
