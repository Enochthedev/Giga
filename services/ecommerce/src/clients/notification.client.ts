import axios, { AxiosInstance } from 'axios';

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

export interface NotificationServiceResponse<T> {
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

export interface NotificationResult {
  notificationId: string;
  status: 'sent' | 'failed' | 'queued';
  error?: string;
}

export interface NotificationServiceClient {
  sendOrderConfirmation(data: OrderNotificationData): Promise<NotificationResult>;
  sendOrderStatusUpdate(data: OrderNotificationData & { previousStatus: string; newStatus: string }): Promise<NotificationResult>;
  sendVendorOrderNotification(data: VendorNotificationData): Promise<NotificationResult>;
  sendInventoryAlert(data: InventoryAlertData): Promise<NotificationResult>;
  sendOrderCancellation(data: OrderNotificationData & { reason?: string }): Promise<NotificationResult>;
}

export class HttpNotificationServiceClient implements NotificationServiceClient {
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
        if (error.code === 'ECONNREFUSED') {
          // Don't fail the main operation if notifications fail
          console.warn('Notification service unavailable, continuing without notification');
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

  async sendOrderConfirmation(data: OrderNotificationData): Promise<NotificationResult> {
    try {
      const response = await this.client.post<NotificationServiceResponse<NotificationResult>>(
        '/api/v1/notifications/order-confirmation',
        {
          type: 'EMAIL',
          recipient: data.customerEmail,
          template: 'order_confirmation',
          variables: data,
        }
      );

      if (!response.data.success || !response.data.data) {
        return {
          notificationId: 'failed',
          status: 'failed',
          error: response.data.error?.message || 'Failed to send order confirmation',
        };
      }

      return response.data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Failed to send order confirmation: ${message}`);
      return {
        notificationId: 'failed',
        status: 'failed',
        error: message,
      };
    }
  }

  async sendOrderStatusUpdate(
    data: OrderNotificationData & { previousStatus: string; newStatus: string }
  ): Promise<NotificationResult> {
    try {
      const response = await this.client.post<NotificationServiceResponse<NotificationResult>>(
        '/api/v1/notifications/order-status-update',
        {
          type: 'EMAIL',
          recipient: data.customerEmail,
          template: 'order_status_update',
          variables: data,
        }
      );

      if (!response.data.success || !response.data.data) {
        return {
          notificationId: 'failed',
          status: 'failed',
          error: response.data.error?.message || 'Failed to send order status update',
        };
      }

      return response.data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Failed to send order status update: ${message}`);
      return {
        notificationId: 'failed',
        status: 'failed',
        error: message,
      };
    }
  }

  async sendVendorOrderNotification(data: VendorNotificationData): Promise<NotificationResult> {
    try {
      const response = await this.client.post<NotificationServiceResponse<NotificationResult>>(
        '/api/v1/notifications/vendor-order',
        {
          type: 'EMAIL',
          recipient: data.vendorEmail,
          template: 'vendor_new_order',
          variables: data,
        }
      );

      if (!response.data.success || !response.data.data) {
        return {
          notificationId: 'failed',
          status: 'failed',
          error: response.data.error?.message || 'Failed to send vendor order notification',
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

  async sendInventoryAlert(data: InventoryAlertData): Promise<NotificationResult> {
    try {
      const response = await this.client.post<NotificationServiceResponse<NotificationResult>>(
        '/api/v1/notifications/inventory-alert',
        {
          type: 'EMAIL',
          recipient: data.vendorEmail,
          template: 'inventory_low_stock',
          variables: data,
        }
      );

      if (!response.data.success || !response.data.data) {
        return {
          notificationId: 'failed',
          status: 'failed',
          error: response.data.error?.message || 'Failed to send inventory alert',
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

  async sendOrderCancellation(data: OrderNotificationData & { reason?: string }): Promise<NotificationResult> {
    try {
      const response = await this.client.post<NotificationServiceResponse<NotificationResult>>(
        '/api/v1/notifications/order-cancellation',
        {
          type: 'EMAIL',
          recipient: data.customerEmail,
          template: 'order_cancellation',
          variables: data,
        }
      );

      if (!response.data.success || !response.data.data) {
        return {
          notificationId: 'failed',
          status: 'failed',
          error: response.data.error?.message || 'Failed to send order cancellation notification',
        };
      }

      return response.data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Failed to send order cancellation notification: ${message}`);
      return {
        notificationId: 'failed',
        status: 'failed',
        error: message,
      };
    }
  }

  private generateCorrelationId(): string {
    return `ecom-notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}