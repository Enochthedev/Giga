import { Request, Response } from 'express';
import { logger } from '../lib/logger';
import { PERMISSIONS } from '../middleware/auth.middleware';
import { authService } from '../services/auth.service';
import { pciComplianceService } from '../services/pci-compliance.service';
import { ValidationError } from '../utils/errors';

/**
 * API Key Management Controller
 * Handles CRUD operations for API keys used in service-to-service authentication
 */
export class APIKeyController {
  /**
   * Create a new API key
   */
  async createAPIKey(req: Request, res: Response): Promise<void> {
    try {
      const { name, serviceId, permissions, expiresAt } = req.body;

      // Validate required fields
      if (!name || !serviceId || !permissions) {
        throw new ValidationError(
          'Name, serviceId, and permissions are required'
        );
      }

      if (!Array.isArray(permissions)) {
        throw new ValidationError('Permissions must be an array');
      }

      // Validate permissions
      const validPermissions = Object.values(PERMISSIONS);
      const invalidPermissions = permissions.filter(
        (permission: string) => !validPermissions.includes(permission as any)
      );

      if (invalidPermissions.length > 0) {
        throw new ValidationError(
          `Invalid permissions: ${invalidPermissions.join(', ')}`
        );
      }

      // Parse expiration date if provided
      let expirationDate: Date | undefined;
      if (expiresAt) {
        expirationDate = new Date(expiresAt);
        if (isNaN(expirationDate.getTime())) {
          throw new ValidationError('Invalid expiration date format');
        }
        if (expirationDate <= new Date()) {
          throw new ValidationError('Expiration date must be in the future');
        }
      }

      // Create API key
      const result = await authService.createAPIKey(
        name,
        serviceId,
        permissions,
        expirationDate
      );

      // Log API key creation
      await pciComplianceService.logAuditEvent({
        eventType: 'API_KEY_CREATED',
        userId: req.user?.id,
        sessionId: req.user?.sessionId,
        resource: 'api_keys',
        action: 'create',
        severity: 'high',
        success: true,
        details: {
          keyId: result.keyData.id,
          name,
          serviceId,
          permissions,
          expiresAt: expirationDate,
        },
      });

      res.status(201).json({
        success: true,
        data: {
          apiKey: result.apiKey,
          keyData: {
            id: result.keyData.id,
            name: result.keyData.name,
            serviceId: result.keyData.serviceId,
            permissions: result.keyData.permissions,
            isActive: result.keyData.isActive,
            expiresAt: result.keyData.expiresAt,
          },
        },
        message:
          'API key created successfully. Store the key securely as it will not be shown again.',
      });
    } catch (error) {
      logger.error('Failed to create API key', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.user?.id,
      });

      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'API_KEY_CREATION_FAILED',
          message: 'Failed to create API key',
        },
      });
    }
  }

  /**
   * List API keys for a service
   */
  async listAPIKeys(req: Request, res: Response): Promise<void> {
    try {
      const { serviceId } = req.query;
      const { page = 1, limit = 20 } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);

      if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
        throw new ValidationError('Invalid pagination parameters');
      }

      const skip = (pageNum - 1) * limitNum;

      const whereClause: any = {};
      if (serviceId) {
        whereClause.serviceId = serviceId;
      }

      const [apiKeys, total] = await Promise.all([
        authService.getAPIKeys(whereClause, skip, limitNum),
        authService.countAPIKeys(whereClause),
      ]);

      res.json({
        success: true,
        data: {
          apiKeys: apiKeys.map(key => ({
            id: key.id,
            name: key.name,
            serviceId: key.serviceId,
            permissions: key.permissions,
            isActive: key.isActive,
            expiresAt: key.expiresAt,
            lastUsedAt: key.lastUsedAt,
            createdAt: key.createdAt,
          })),
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum),
          },
        },
      });
    } catch (error) {
      logger.error('Failed to list API keys', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.user?.id,
      });

      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'API_KEY_LIST_FAILED',
          message: 'Failed to retrieve API keys',
        },
      });
    }
  }

  /**
   * Get API key details and usage statistics
   */
  async getAPIKey(req: Request, res: Response): Promise<void> {
    try {
      const { keyId } = req.params;
      const { days = 30 } = req.query;

      if (!keyId) {
        throw new ValidationError('API key ID is required');
      }

      const daysNum = parseInt(days as string);
      if (daysNum < 1 || daysNum > 365) {
        throw new ValidationError('Days must be between 1 and 365');
      }

      // Get API key usage statistics
      const usage = await authService.getAPIKeyUsage(keyId, daysNum);

      if (!usage.keyDetails) {
        res.status(404).json({
          success: false,
          error: {
            code: 'API_KEY_NOT_FOUND',
            message: 'API key not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: {
          keyDetails: {
            id: keyId,
            name: usage.keyDetails.name,
            serviceId: usage.keyDetails.serviceId,
            isActive: usage.keyDetails.isActive,
            createdAt: usage.keyDetails.createdAt,
            lastUsedAt: usage.keyDetails.lastUsedAt,
          },
          usage: usage.usage,
          period: usage.period,
        },
      });
    } catch (error) {
      logger.error('Failed to get API key details', {
        keyId: req.params.keyId,
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.user?.id,
      });

      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'API_KEY_DETAILS_FAILED',
          message: 'Failed to retrieve API key details',
        },
      });
    }
  }

  /**
   * Rotate an API key
   */
  async rotateAPIKey(req: Request, res: Response): Promise<void> {
    try {
      const { keyId } = req.params;

      if (!keyId) {
        throw new ValidationError('API key ID is required');
      }

      // Rotate the API key
      const newApiKey = await authService.rotateAPIKey(keyId);

      // Log API key rotation
      await pciComplianceService.logAuditEvent({
        eventType: 'API_KEY_ROTATED',
        userId: req.user?.id,
        sessionId: req.user?.sessionId,
        resource: 'api_keys',
        action: 'rotate',
        severity: 'high',
        success: true,
        details: {
          keyId,
        },
      });

      res.json({
        success: true,
        data: {
          apiKey: newApiKey,
        },
        message:
          'API key rotated successfully. Update your applications with the new key.',
      });
    } catch (error) {
      logger.error('Failed to rotate API key', {
        keyId: req.params.keyId,
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.user?.id,
      });

      if (error.message === 'API key not found') {
        res.status(404).json({
          success: false,
          error: {
            code: 'API_KEY_NOT_FOUND',
            message: 'API key not found',
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'API_KEY_ROTATION_FAILED',
          message: 'Failed to rotate API key',
        },
      });
    }
  }

  /**
   * Revoke an API key
   */
  async revokeAPIKey(req: Request, res: Response): Promise<void> {
    try {
      const { keyId } = req.params;
      const { reason } = req.body;

      if (!keyId) {
        throw new ValidationError('API key ID is required');
      }

      if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
        throw new ValidationError('Revocation reason is required');
      }

      // Revoke the API key
      await authService.revokeAPIKey(keyId, reason.trim());

      // Log API key revocation
      await pciComplianceService.logAuditEvent({
        eventType: 'API_KEY_REVOKED',
        userId: req.user?.id,
        sessionId: req.user?.sessionId,
        resource: 'api_keys',
        action: 'revoke',
        severity: 'high',
        success: true,
        details: {
          keyId,
          reason: reason.trim(),
        },
      });

      res.json({
        success: true,
        message: 'API key revoked successfully',
      });
    } catch (error) {
      logger.error('Failed to revoke API key', {
        keyId: req.params.keyId,
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.user?.id,
      });

      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'API_KEY_REVOCATION_FAILED',
          message: 'Failed to revoke API key',
        },
      });
    }
  }

  /**
   * Update API key permissions
   */
  async updateAPIKey(req: Request, res: Response): Promise<void> {
    try {
      const { keyId } = req.params;
      const { permissions, expiresAt } = req.body;

      if (!keyId) {
        throw new ValidationError('API key ID is required');
      }

      const updates: any = {};

      if (permissions) {
        if (!Array.isArray(permissions)) {
          throw new ValidationError('Permissions must be an array');
        }

        // Validate permissions
        const validPermissions = Object.values(PERMISSIONS);
        const invalidPermissions = permissions.filter(
          (permission: string) => !validPermissions.includes(permission as any)
        );

        if (invalidPermissions.length > 0) {
          throw new ValidationError(
            `Invalid permissions: ${invalidPermissions.join(', ')}`
          );
        }

        updates.permissions = permissions;
      }

      if (expiresAt !== undefined) {
        if (expiresAt === null) {
          updates.expiresAt = null;
        } else {
          const expirationDate = new Date(expiresAt);
          if (isNaN(expirationDate.getTime())) {
            throw new ValidationError('Invalid expiration date format');
          }
          if (expirationDate <= new Date()) {
            throw new ValidationError('Expiration date must be in the future');
          }
          updates.expiresAt = expirationDate;
        }
      }

      if (Object.keys(updates).length === 0) {
        throw new ValidationError('No valid updates provided');
      }

      // Update the API key
      const updatedKey = await authService.updateAPIKey(keyId, updates);

      // Log API key update
      await pciComplianceService.logAuditEvent({
        eventType: 'API_KEY_UPDATED',
        userId: req.user?.id,
        sessionId: req.user?.sessionId,
        resource: 'api_keys',
        action: 'update',
        severity: 'medium',
        success: true,
        details: {
          keyId,
          updates,
        },
      });

      res.json({
        success: true,
        data: {
          keyDetails: {
            id: updatedKey.id,
            name: updatedKey.name,
            serviceId: updatedKey.serviceId,
            permissions: updatedKey.permissions,
            isActive: updatedKey.isActive,
            expiresAt: updatedKey.expiresAt,
          },
        },
        message: 'API key updated successfully',
      });
    } catch (error) {
      logger.error('Failed to update API key', {
        keyId: req.params.keyId,
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.user?.id,
      });

      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message,
          },
        });
        return;
      }

      if (error.message === 'API key not found') {
        res.status(404).json({
          success: false,
          error: {
            code: 'API_KEY_NOT_FOUND',
            message: 'API key not found',
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'API_KEY_UPDATE_FAILED',
          message: 'Failed to update API key',
        },
      });
    }
  }
}

export const apiKeyController = new APIKeyController();
