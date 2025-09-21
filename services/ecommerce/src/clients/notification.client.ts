import axios, { AxiosInstance } from 'axios';
import type {
  CircuitBreakerConfig,
  RetryConfig,
  ServiceResponse,
} from './types';

export interface NotificationTemplate {
  type: 'EMAIL' | 'SMS' | 'PUSH';
  template: string;
  variables: Record<string, any>;
}

export interface OrderNotificationData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  orderTotal: number;
  orderItems: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    country: string;
  };
}

export interface VendorNotificationData {
  vendorId: string;
  vendorEmail: string;
  orderId: string;
  vendorOrderId: string;
  orderItems: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  customerName: string;
  orderTotal: number;
}

export interface InventoryAlertData {
  vendorId: string;
  vendorEmail: string;
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
}

export type NotificationServiceResponse<T> = ServiceResponse<T>;

export interface NotificationResult {
  notificationId: string;
  status: 'sent' | 'failed' | 'queued';
  error?: string;
}

export interface NotificationServiceClient {
  sendOrderConfirmation(
    data: OrderNotificationData
  ): Promise<NotificationResult>;

  sendVendorOrderNotification(
    data: VendorNotificationData
  ): Promise<NotificationResult>;
  sendInventoryAlert(data: InventoryAlertData): Promise<NotificationResult>;
  sendOrderCancellation(
    data: OrderNotificationData & { reason?: string }
  ): Promise<NotificationResult>;
  sendVendorOrderStatusUpdate(
    data: VendorNotificationData & { previousStatus: string; newStatus: string }
  ): Promise<NotificationResult>;
  sendBulkNotification(
    notifications: Array<{ type: string; data: any }>
  ): Promise<NotificationResult[]>;
  sendOrderStatusUpdate(
    orderId: string,
    data: {
      orderId: string;
      vendorOrderId?: string;
      previousStatus: string;
      newStatus: string;
      trackingNumber?: string;
      estimatedDelivery?: string;
    }
  ): Promise<NotificationResult>;
  sendVendorOrderCompletion(
    vendorId: string,
    data: {
      vendorOrderId: string;
      orderId: string;
      total: number;
      itemCount: number;
    }
  ): Promise<NotificationResult>;
}

export class HttpNotificationServiceClient
  implements NotificationServiceClient
{
  private client: AxiosInstance;
  private retryConfig: RetryConfig;
  private circuitBreakerConfig: CircuitBreakerConfig;
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private isCircuitOpen: boolean = false;

  constructor(
    baseURL: string,
    timeout: number = 5000,
    retryConfig?: RetryConfig,
    circuitBreakerConfig?: CircuitBreakerConfig
  ) {
    this.retryConfig = retryConfig || {
      maxRetries: 2, // Lower retries for notifications since they're not critical
      backoffStrategy: 'exponential',
      initialDelay: 500,
    };

    this.circuitBreakerConfig = circuitBreakerConfig || {
      failureThreshold: 3,
      resetTimeout: 30000,
      monitoringPeriod: 5000,
    };
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for correlation ID
    this.client.interceptors.request.use(config => {
      config.headers['X-Correlation-ID'] = this.generateCorrelationId();
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.code === 'ECONNREFUSED') {
          // Don't fail the main operation if notifications fail
          console.warn(
            'Notification service unavailable, continuing without notification'
          );
          return Promise.resolve({
            data: {
              success: false,
              data: {
                notificationId: 'failed',
                status: 'failed',
                error: 'Service unavailable',
              },
            },
          });
        }
        throw error;
      }
    );
  }

  // eslint-disable-next-line require-await
  // eslint-disable-next-line require-await
  async sendOrderConfirmation(
    data: OrderNotificationData
  ): Promise<NotificationResult> {
    const fallbackResult: NotificationResult = {
      notificationId: 'failed',
      status: 'failed',
      error: 'Notification service unavailable',
    };

    return this.executeWithRetry(async () => {
      const response = await this.client.post<
        NotificationServiceResponse<NotificationResult>
      >('/api/v1/notifications/order-confirmation', {
        type: 'EMAIL',
        recipient: data.customerEmail,
        template: 'order_confirmation',
        variables: data,
      });

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || 'Failed to send order confirmation'
        );
      }

      return response.data.data;
    }, fallbackResult);
  }

  // eslint-disable-next-line require-await
  async sendVendorOrderNotification(
    data: VendorNotificationData
  ): Promise<NotificationResult> {
    try {
      const response = await this.client.post<
        NotificationServiceResponse<NotificationResult>
      >('/api/v1/notifications/vendor-order', {
        type: 'EMAIL',
        recipient: data.vendorEmail,
        template: 'vendor_new_order',
        variables: data,
      });

      if (!response.data.success || !response.data.data) {
        return {
          notificationId: 'failed',
          status: 'failed',
          error:
            response.data.error?.message ||
            'Failed to send vendor order notification',
        };
      }

      return response.data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Failed to send vendor order notification: ${message}`);
      return {
        notificationId: 'failed',
        status: 'failed',
        error: message,
      };
    }
  }

  // eslint-disable-next-line require-await
  async sendInventoryAlert(
    data: InventoryAlertData
  ): Promise<NotificationResult> {
    try {
      const response = await this.client.post<
        NotificationServiceResponse<NotificationResult>
      >('/api/v1/notifications/inventory-alert', {
        type: 'EMAIL',
        recipient: data.vendorEmail,
        template: 'inventory_low_stock',
        variables: data,
      });

      if (!response.data.success || !response.data.data) {
        return {
          notificationId: 'failed',
          status: 'failed',
          error:
            response.data.error?.message || 'Failed to send inventory alert',
        };
      }

      return response.data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Failed to send inventory alert: ${message}`);
      return {
        notificationId: 'failed',
        status: 'failed',
        error: message,
      };
    }
  }

  // eslint-disable-next-line require-await
  async sendOrderCancellation(
    data: OrderNotificationData & { reason?: string }
  ): Promise<NotificationResult> {
    const fallbackResult: NotificationResult = {
      notificationId: 'failed',
      status: 'failed',
      error: 'Notification service unavailable',
    };

    return this.executeWithRetry(async () => {
      const response = await this.client.post<
        NotificationServiceResponse<NotificationResult>
      >('/api/v1/notifications/order-cancellation', {
        type: 'EMAIL',
        recipient: data.customerEmail,
        template: 'order_cancellation',
        variables: data,
      });

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message ||
            'Failed to send order cancellation notification'
        );
      }

      return response.data.data;
    }, fallbackResult);
  }

  // eslint-disable-next-line require-await
  async sendVendorOrderStatusUpdate(
    data: VendorNotificationData & { previousStatus: string; newStatus: string }
  ): Promise<NotificationResult> {
    const fallbackResult: NotificationResult = {
      notificationId: 'failed',
      status: 'failed',
      error: 'Notification service unavailable',
    };

    return this.executeWithRetry(async () => {
      const response = await this.client.post<
        NotificationServiceResponse<NotificationResult>
      >('/api/v1/notifications/vendor-order-status', {
        type: 'EMAIL',
        recipient: data.vendorEmail,
        template: 'vendor_order_status_update',
        variables: data,
      });

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message ||
            'Failed to send vendor order status update'
        );
      }

      return response.data.data;
    }, fallbackResult);
  }

  // eslint-disable-next-line require-await
  async sendBulkNotification(
    notifications: Array<{ type: string; data: any }>
  ): Promise<NotificationResult[]> {
    const fallbackResult: NotificationResult[] = notifications.map(() => ({
      notificationId: 'failed',
      status: 'failed',
      error: 'Notification service unavailable',
    }));

    return this.executeWithRetry(async () => {
      const response = await this.client.post<
        NotificationServiceResponse<NotificationResult[]>
      >('/api/v1/notifications/bulk', { notifications });

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || 'Failed to send bulk notifications'
        );
      }

      return response.data.data;
    }, fallbackResult);
  }

  // eslint-disable-next-line require-await
  async sendOrderStatusUpdate(
    orderId: string,
    data: {
      orderId: string;
      vendorOrderId?: string;
      previousStatus: string;
      newStatus: string;
      trackingNumber?: string;
      estimatedDelivery?: string;
    }
  ): Promise<NotificationResult> {
    const fallbackResult: NotificationResult = {
      notificationId: 'failed',
      status: 'failed',
      error: 'Notification service unavailable',
    };

    return this.executeWithRetry(async () => {
      const response = await this.client.post<
        NotificationServiceResponse<NotificationResult>
      >('/api/v1/notifications/order-status-update', {
        type: 'EMAIL',
        template: 'order_status_update',
        variables: data,
      });

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message || 'Failed to send order status update'
        );
      }

      return response.data.data;
    }, fallbackResult);
  }

  // eslint-disable-next-line require-await
  async sendVendorOrderCompletion(
    vendorId: string,
    data: {
      vendorOrderId: string;
      orderId: string;
      total: number;
      itemCount: number;
    }
  ): Promise<NotificationResult> {
    const fallbackResult: NotificationResult = {
      notificationId: 'failed',
      status: 'failed',
      error: 'Notification service unavailable',
    };

    return this.executeWithRetry(async () => {
      const response = await this.client.post<
        NotificationServiceResponse<NotificationResult>
      >('/api/v1/notifications/vendor-order-completion', {
        type: 'EMAIL',
        template: 'vendor_order_completion',
        variables: { vendorId, ...data },
      });

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error?.message ||
            'Failed to send vendor order completion notification'
        );
      }

      return response.data.data;
    }, fallbackResult);
  }

  private generateCorrelationId(): string {
    return `ecom-notification-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    fallbackResult: T
  ): Promise<T> {
    if (this.isCircuitOpen) {
      if (
        Date.now() - this.lastFailureTime >
        this.circuitBreakerConfig.resetTimeout
      ) {
        this.isCircuitOpen = false;
        this.failureCount = 0;
      } else {
        console.warn(
          'Notification circuit breaker is open, returning fallback result'
        );
        return fallbackResult;
      }
    }

    let lastError: Error;

    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        const result = await operation();
        // Reset failure count on success
        this.failureCount = 0;
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        // Increment failure count
        this.failureCount++;
        this.lastFailureTime = Date.now();

        // Check if circuit breaker should open
        if (this.failureCount >= this.circuitBreakerConfig.failureThreshold) {
          this.isCircuitOpen = true;
        }

        // Don't retry on the last attempt
        if (attempt === this.retryConfig.maxRetries) {
          break;
        }

        // Calculate delay for next retry
        const delay =
          this.retryConfig.backoffStrategy === 'exponential'
            ? this.retryConfig.initialDelay * Math.pow(2, attempt)
            : this.retryConfig.initialDelay * (attempt + 1);

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // For notifications, we don't want to fail the main operation
    console.warn(`Notification failed after retries: ${lastError!.message}`);
    return fallbackResult;
  }
}
