import axios, { AxiosInstance } from 'axios';

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  vendorId?: string;
  permissions: string[];
}

export interface AuthServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    service: string;
    version: string;
    timestamp: string;
    correlationId: string;
  };
}

export interface AuthServiceClient {
  validateToken(token: string): Promise<UserInfo>;
  getUserInfo(userId: string): Promise<UserInfo>;
  getUserPermissions(userId: string): Promise<string[]>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }>;
}

export class HttpAuthServiceClient implements AuthServiceClient {
  private client: AxiosInstance;

  constructor(baseURL: string, timeout: number = 5000) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for correlation ID
    this.client.interceptors.request.use((config) => {
      config.headers['X-Correlation-ID'] = this.generateCorrelationId();
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          throw new Error('Authentication failed');
        }
        if (error.response?.status === 403) {
          throw new Error('Insufficient permissions');
        }
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Auth service unavailable');
        }
        throw error;
      }
    );
  }

  async validateToken(token: string): Promise<UserInfo> {
    try {
      const response = await this.client.post<AuthServiceResponse<UserInfo>>('/api/v1/auth/validate', {
        token,
      });

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Token validation failed');
      }

      return response.data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to validate token: ${message}`);
    }
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    try {
      const response = await this.client.get<AuthServiceResponse<UserInfo>>(`/api/v1/users/${userId}`);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to get user info');
      }

      return response.data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get user info: ${message}`);
    }
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    try {
      const response = await this.client.get<AuthServiceResponse<string[]>>(`/api/v1/users/${userId}/permissions`);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Failed to get user permissions');
      }

      return response.data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get user permissions: ${message}`);
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const response = await this.client.post<AuthServiceResponse<{ accessToken: string; refreshToken: string }>>('/api/v1/auth/refresh', {
        refreshToken,
      });

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Token refresh failed');
      }

      return response.data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to refresh token: ${message}`);
    }
  }

  private generateCorrelationId(): string {
    return `ecom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}