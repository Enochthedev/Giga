/**
 * HTTP Client utility for external service communication
 */

import logger from '@/utils/logger';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  defaultHeaders?: Record<string, string>;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export class HttpClient {
  private client: AxiosInstance;
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 5000,
      headers: config.defaultHeaders || {},
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      config => {
        logger.debug('HTTP Request', {
          method: config.method,
          url: config.url,
          baseURL: config.baseURL,
        });
        return config;
      },
      error => {
        logger.error('HTTP Request Error', { error });
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      response => {
        logger.debug('HTTP Response', {
          status: response.status,
          url: response.config.url,
        });
        return response;
      },
      async error => {
        logger.error('HTTP Response Error', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
        });

        // Retry logic
        if (
          this.shouldRetry(error) &&
          this.config.retries &&
          this.config.retries > 0
        ) {
          return this.retryRequest(error);
        }

        return Promise.reject(error);
      }
    );
  }

  private shouldRetry(error: any): boolean {
    // Retry on network errors or 5xx status codes
    return (
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600) ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ENOTFOUND' ||
      error.code === 'ECONNRESET'
    );
  }

  private async retryRequest(error: any): Promise<AxiosResponse> {
    const config = error.config;
    config.__retryCount = config.__retryCount || 0;

    if (config.__retryCount >= (this.config.retries || 0)) {
      return Promise.reject(error);
    }

    config.__retryCount += 1;

    // Wait before retrying
    const delay = this.config.retryDelay || 1000;
    await new Promise(resolve =>
      setTimeout(resolve, delay * config.__retryCount)
    );

    logger.info('Retrying HTTP request', {
      url: config.url,
      attempt: config.__retryCount,
    });

    return this.client(config);
  }

  async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ServiceResponse<T>> {
    try {
      const response = await this.client.get<T>(url, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return this.handleError<T>(error);
    }
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ServiceResponse<T>> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return this.handleError<T>(error);
    }
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ServiceResponse<T>> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return this.handleError<T>(error);
    }
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ServiceResponse<T>> {
    try {
      const response = await this.client.delete<T>(url, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return this.handleError<T>(error);
    }
  }

  private handleError<T>(error: any): ServiceResponse<T> {
    const errorResponse: ServiceResponse<T> = {
      success: false,
      error: {
        code: error.response?.data?.code || error.code || 'UNKNOWN_ERROR',
        message:
          error.response?.data?.message ||
          error.message ||
          'An unknown error occurred',
        details: error.response?.data?.details || error.response?.data,
      },
    };

    logger.error('HTTP Client Error', errorResponse.error);
    return errorResponse;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  }
}
