/**
 * Auth Service Client for Hotel Service
 */

import logger from '@/utils/logger';
import { HttpClient } from './http-client';

export interface UserInfo {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthServiceClient {
  validateToken(token: string): Promise<UserInfo>;
  getUserInfo(userId: string): Promise<UserInfo>;
  getUserPermissions(userId: string): Promise<string[]>;
  checkUserPermission(userId: string, permission: string): Promise<boolean>;
  getUsersByIds(userIds: string[]): Promise<UserInfo[]>;
  validateUserAccess(
    userId: string,
    resource: string,
    action: string
  ): Promise<boolean>;
  healthCheck(): Promise<boolean>;
}

export class HttpAuthServiceClient implements AuthServiceClient {
  private client: HttpClient;

  constructor() {
    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

    this.client = new HttpClient({
      baseURL: authServiceUrl,
      timeout: 5000,
      retries: 3,
      retryDelay: 1000,
      defaultHeaders: {
        'Content-Type': 'application/json',
      },
    });

    logger.info('Auth Service Client initialized', { baseURL: authServiceUrl });
  }

  async validateToken(token: string): Promise<UserInfo> {
    logger.debug('Validating token with Auth Service');

    const response = await this.client.post<{ user: UserInfo }>(
      '/api/v1/auth/validate',
      {
        token,
      }
    );

    if (!response.success || !response.data) {
      const error = response.error?.message || 'Token validation failed';
      logger.error('Token validation failed', { error });
      throw new Error(error);
    }

    logger.debug('Token validated successfully', {
      userId: response.data.user.id,
    });
    return response.data.user;
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    logger.debug('Getting user info from Auth Service', { userId });

    const response = await this.client.get<UserInfo>(`/api/v1/users/${userId}`);

    if (!response.success || !response.data) {
      const error = response.error?.message || 'Failed to get user info';
      logger.error('Failed to get user info', { error, userId });
      throw new Error(error);
    }

    logger.debug('User info retrieved successfully', { userId });
    return response.data;
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    logger.debug('Getting user permissions from Auth Service', { userId });

    try {
      const response = await this.client.get<string[]>(
        `/api/v1/users/${userId}/permissions`
      );

      if (!response.success || !response.data) {
        logger.warn('Failed to get user permissions, returning empty array', {
          userId,
        });
        return [];
      }

      logger.debug('User permissions retrieved successfully', {
        userId,
        permissionCount: response.data.length,
      });
      return response.data;
    } catch (error) {
      logger.warn('Error getting user permissions, returning empty array', {
        userId,
        error,
      });
      return [];
    }
  }

  async checkUserPermission(
    userId: string,
    permission: string
  ): Promise<boolean> {
    logger.debug('Checking user permission', { userId, permission });

    try {
      const response = await this.client.post<{ hasPermission: boolean }>(
        '/api/v1/auth/check-permission',
        { userId, permission }
      );

      if (!response.success || response.data === undefined) {
        logger.warn('Permission check failed, defaulting to false', {
          userId,
          permission,
        });
        return false;
      }

      const hasPermission = response.data.hasPermission;
      logger.debug('Permission check completed', {
        userId,
        permission,
        hasPermission,
      });
      return hasPermission;
    } catch (error) {
      logger.warn('Error checking user permission, defaulting to false', {
        userId,
        permission,
        error,
      });
      return false;
    }
  }

  async getUsersByIds(userIds: string[]): Promise<UserInfo[]> {
    logger.debug('Getting users by IDs from Auth Service', {
      userCount: userIds.length,
    });

    const response = await this.client.post<UserInfo[]>('/api/v1/users/batch', {
      userIds,
    });

    if (!response.success || !response.data) {
      const error = response.error?.message || 'Failed to get users';
      logger.error('Failed to get users by IDs', { error, userIds });
      throw new Error(error);
    }

    logger.debug('Users retrieved successfully', {
      requestedCount: userIds.length,
      retrievedCount: response.data.length,
    });
    return response.data;
  }

  async validateUserAccess(
    userId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    logger.debug('Validating user access', { userId, resource, action });

    try {
      const response = await this.client.post<{ hasAccess: boolean }>(
        '/api/v1/auth/validate-access',
        { userId, resource, action }
      );

      if (!response.success || response.data === undefined) {
        logger.warn('Access validation failed, defaulting to false', {
          userId,
          resource,
          action,
        });
        return false;
      }

      const hasAccess = response.data.hasAccess;
      logger.debug('Access validation completed', {
        userId,
        resource,
        action,
        hasAccess,
      });
      return hasAccess;
    } catch (error) {
      logger.warn('Error validating user access, defaulting to false', {
        userId,
        resource,
        action,
        error,
      });
      return false;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const isHealthy = await this.client.healthCheck();
      logger.debug('Auth Service health check', { isHealthy });
      return isHealthy;
    } catch (error) {
      logger.error('Auth Service health check failed', { error });
      return false;
    }
  }
}

// Singleton instance
let authClientInstance: AuthServiceClient | null = null;

export function getAuthClient(): AuthServiceClient {
  if (!authClientInstance) {
    authClientInstance = new HttpAuthServiceClient();
  }
  return authClientInstance;
}
