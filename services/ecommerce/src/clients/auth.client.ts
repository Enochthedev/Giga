import {
  GracefulDegradation,
  HttpClient,
  HttpClientFactory,
} from '../lib/http-client';
import { RetryConfigurations } from '../lib/retry';
import type { ServiceResponse } from './types';

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  vendorId?: string;
  permissions: string[];
}

export type AuthServiceResponse<T> = ServiceResponse<T>;

export interface AuthServiceClient {
  validateToken(token: string): Promise<UserInfo>;
  getUserInfo(_userId: string): Promise<UserInfo>;
  getUserPermissions(_userId: string): Promise<string[]>;
  refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }>;
  checkUserPermission(_userId: string, permission: string): Promise<boolean>;
  getUsersByIds(userIds: string[]): Promise<UserInfo[]>;
  validateUserAccess(
    _userId: string,
    resource: string,
    action: string
  ): Promise<boolean>;
}

export class HttpAuthServiceClient implements AuthServiceClient {
  private client: HttpClient;

  constructor(baseURL: string, timeout: number = 5000) {
    this.client = HttpClientFactory.createClient({
      serviceName: 'auth-service',
      baseURL,
      timeout,
      retryOptions: RetryConfigurations.auth,
      circuitBreakerOptions: {
        failureThreshold: 5,
        resetTimeout: 60000,
        monitoringPeriod: 10000,
        successThreshold: 2,
      },
      defaultHeaders: {
        'Content-Type': 'application/json',
      },
    });
  }

  async validateToken(token: string): Promise<UserInfo> {
    const response = await this.client.post<UserInfo>('/api/v1/auth/validate', {
      token,
    });

    if (!response.success || !response.data) {
      throw new Error(
        response.error?.error.message || 'Token validation failed'
      );
    }

    return response.data;
  }

  async getUserInfo(_userId: string): Promise<UserInfo> {
    const response = await this.client.get<UserInfo>(`/api/v1/users/${userId}`);

    if (!response.success || !response.data) {
      throw new Error(
        response.error?.error.message || 'Failed to get user info'
      );
    }

    return response.data;
  }

  // eslint-disable-next-line require-await
  async getUserPermissions(_userId: string): Promise<string[]> {
    return GracefulDegradation.executeWithDefault(
      () => {
        const response = await this.client.get<string[]>(
          `/api/v1/users/${userId}/permissions`
        );

        if (!response.success || !response.data) {
          throw new Error(
            response.error?.error.message || 'Failed to get user permissions'
          );
        }

        return response.data;
      },
      [], // Default to empty permissions if service is unavailable
      'auth-service'
    );
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await this.client.post<{
      accessToken: string;
      refreshToken: string;
    }>('/api/v1/auth/refresh', { refreshToken });

    if (!response.success || !response.data) {
      throw new Error(response.error?.error.message || 'Token refresh failed');
    }

    return response.data;
  }

  // eslint-disable-next-line require-await
  async checkUserPermission(
    _userId: string,
    permission: string
  ): Promise<boolean> {
    return GracefulDegradation.executeWithDefault(
      () => {
        const response = await this.client.post<{ hasPermission: boolean }>(
          '/api/v1/auth/check-permission',
          { userId, permission }
        );

        if (!response.success || response.data === undefined) {
          return false;
        }

        return response.data.hasPermission;
      },
      false, // Default to no permission if service is unavailable
      'auth-service'
    );
  }

  async getUsersByIds(userIds: string[]): Promise<UserInfo[]> {
    const response = await this.client.post<UserInfo[]>('/api/v1/users/batch', {
      userIds,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.error.message || 'Failed to get users');
    }

    return response.data;
  }

  // eslint-disable-next-line require-await
  async validateUserAccess(
    _userId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    return GracefulDegradation.executeWithDefault(
      () => {
        const response = await this.client.post<{ hasAccess: boolean }>(
          '/api/v1/auth/validate-access',
          { userId, resource, action }
        );

        if (!response.success || response.data === undefined) {
          return false;
        }

        return response.data.hasAccess;
      },
      false, // Default to no access if service is unavailable
      'auth-service'
    );
  }

  // Health check method
  // eslint-disable-next-line require-await
  async healthCheck(): Promise<boolean> {
    return this.client.healthCheck();
  }

  // Get service metrics
  getMetrics() {
    return this.client.getMetrics();
  }
}
