import {
  createGigaSupabaseClient,
  GigaSupabaseClient,
} from '@platform/supabase-client';

class SupabaseService {
  private client: GigaSupabaseClient;

  constructor() {
    this.client = createGigaSupabaseClient({
      url: process.env.SUPABASE_URL!,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    });
  }

  // User-related methods
  async getUserProfile(userId: string) {
    return await this.client.getUserProfile(userId);
  }

  async getUserAddresses(userId: string) {
    return await this.client.getUserAddresses(userId);
  }

  async getDefaultAddress(userId: string) {
    const addresses = await this.getUserAddresses(userId);
    return addresses.find(addr => addr.is_default) || addresses[0] || null;
  }

  // Notification methods
  async createOrderNotification(
    userId: string,
    orderId: string,
    status: string
  ) {
    const messages = {
      pending: 'Your order has been placed and is being processed.',
      confirmed: 'Your order has been confirmed and will be shipped soon.',
      shipped: 'Your order has been shipped and is on its way.',
      delivered: 'Your order has been delivered successfully.',
      cancelled: 'Your order has been cancelled.',
    };

    return await this.client.createNotification({
      user_id: userId,
      title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message:
        messages[status as keyof typeof messages] ||
        `Order status updated to ${status}`,
      type: 'in_app',
      status: 'pending',
      data: {
        order_id: orderId,
        order_status: status,
        type: 'order_update',
      },
    });
  }

  async createPromotionNotification(
    userId: string,
    promotionTitle: string,
    discount: number
  ) {
    return await this.client.createNotification({
      user_id: userId,
      title: 'Special Offer Available!',
      message: `${promotionTitle} - Save ${discount}% on your next purchase!`,
      type: 'in_app',
      status: 'pending',
      data: {
        promotion_title: promotionTitle,
        discount_percentage: discount,
        type: 'promotion',
      },
    });
  }

  // Job creation methods
  async createEmailJob(type: string, payload: any) {
    return await this.client.createJob({
      type: `email_${type}`,
      payload,
      status: 'pending',
      attempts: 0,
      max_attempts: 3,
    });
  }

  async createInventoryUpdateJob(productId: string, quantity: number) {
    return await this.client.createJob({
      type: 'inventory_update',
      payload: {
        product_id: productId,
        quantity,
        timestamp: new Date().toISOString(),
      },
      status: 'pending',
      attempts: 0,
      max_attempts: 3,
    });
  }

  async createOrderProcessingJob(orderId: string, orderData: any) {
    return await this.client.createJob({
      type: 'order_processing',
      payload: {
        order_id: orderId,
        order_data: orderData,
        timestamp: new Date().toISOString(),
      },
      status: 'pending',
      attempts: 0,
      max_attempts: 3,
    });
  }

  // Storage methods
  async getProductImageUrl(imagePath: string) {
    return await this.client.getPublicUrl('products', imagePath);
  }

  async getSignedUploadUrl(bucket: string, path: string, expiresIn = 3600) {
    return await this.client.getSignedUrl(bucket, path, expiresIn);
  }

  // Analytics and audit methods
  async logUserAction(
    userId: string,
    action: string,
    resourceType: string,
    resourceId: string,
    metadata?: any
  ) {
    // This would typically go to an audit log
    return await this.client.createJob({
      type: 'audit_log',
      payload: {
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        metadata,
        timestamp: new Date().toISOString(),
      },
      status: 'pending',
      attempts: 0,
      max_attempts: 1,
    });
  }

  // Real-time subscriptions
  subscribeToUserNotifications(
    userId: string,
    callback: (notification: any) => void
  ) {
    return this.client.subscribeToUserNotifications(userId, callback);
  }

  // Raw client access for advanced operations
  get rawClient() {
    return this.client.rawClient;
  }

  get serviceClient() {
    return this.client.serviceRawClient;
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService();
export default supabaseService;
