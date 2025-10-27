// shared/sdk/notifications/client.ts

import {
  BatchNotificationRequest,
  BatchNotificationResponse,
  NotificationChannel,
  NotificationError,
  NotificationHistoryQuery,
  NotificationHistoryResponse,
  NotificationPreferences,
  NotificationPriority,
  NotificationTemplate,
  QueueNotificationResponse,
  SendNotificationRequest,
  SendNotificationResponse,
  UpdatePreferencesRequest,
} from './types';

export interface NotificationClientConfig {
  supabaseUrl: string;
  supabaseKey: string;
  functionsUrl?: string;
}

export class NotificationClient {
  private supabaseUrl: string;
  private supabaseKey: string;
  private functionsUrl: string;
  private userToken?: string;

  constructor(config: NotificationClientConfig) {
    this.supabaseUrl = config.supabaseUrl;
    this.supabaseKey = config.supabaseKey;
    this.functionsUrl =
      config.functionsUrl || `${config.supabaseUrl}/functions/v1`;
  }

  /**
   * Set user authentication token
   */
  setUserToken(token: string): void {
    this.userToken = token;
  }

  /**
   * Get current user token
   */
  getUserToken(): string | undefined {
    return this.userToken;
  }

  /**
   * Send notification (queued or immediate)
   */
  async sendNotification(
    request: SendNotificationRequest
  ): Promise<QueueNotificationResponse | SendNotificationResponse> {
    const response = await fetch(`${this.functionsUrl}/queue-notification`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = (await response.json()) as (
      | QueueNotificationResponse
      | SendNotificationResponse
    ) & { error?: string };

    if (!response.ok) {
      throw new NotificationError(
        data.error || 'Failed to send notification',
        response.status,
        data
      );
    }

    return data;
  }

  /**
   * Send immediate notification (for urgent cases)
   */
  async sendImmediately(
    template_name: string,
    variables: Record<string, any>,
    options?: {
      user_id?: string;
      recipient_email?: string;
      recipient_phone?: string;
      recipient_device_token?: string;
      channels?: NotificationChannel[];
    }
  ): Promise<SendNotificationResponse> {
    return this.sendNotification({
      template_name,
      variables,
      ...options,
      send_immediately: true,
    }) as Promise<SendNotificationResponse>;
  }

  /**
   * Queue notification (recommended)
   */
  async queueNotification(
    template_name: string,
    variables: Record<string, any>,
    options?: {
      user_id?: string;
      recipient_email?: string;
      recipient_phone?: string;
      recipient_device_token?: string;
      priority?: NotificationPriority;
      delay_seconds?: number;
    }
  ): Promise<QueueNotificationResponse> {
    return this.sendNotification({
      template_name,
      variables,
      ...options,
      send_immediately: false,
    }) as Promise<QueueNotificationResponse>;
  }

  /**
   * Send batch notifications
   */
  async sendBatch(
    request: BatchNotificationRequest
  ): Promise<BatchNotificationResponse> {
    const response = await fetch(
      `${this.functionsUrl}/batch-queue-notifications`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    );

    const data = (await response.json()) as BatchNotificationResponse & {
      error?: string;
    };

    if (!response.ok) {
      throw new NotificationError(
        data.error || 'Failed to send batch notifications',
        response.status,
        data
      );
    }

    return data;
  }

  /**
   * Get notification history (requires user token)
   */
  async getHistory(
    query?: NotificationHistoryQuery
  ): Promise<NotificationHistoryResponse> {
    if (!this.userToken) {
      throw new NotificationError('User token required', 401);
    }

    const params = new URLSearchParams();
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.offset) params.append('offset', query.offset.toString());
    if (query?.status) params.append('status', query.status);

    const response = await fetch(
      `${this.functionsUrl}/get-notification-history?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.userToken}`,
        },
      }
    );

    const data = (await response.json()) as NotificationHistoryResponse & {
      error?: string;
    };

    if (!response.ok) {
      throw new NotificationError(
        data.error || 'Failed to get notification history',
        response.status,
        data
      );
    }

    return data;
  }

  /**
   * Get user notification preferences (requires user token)
   */
  async getPreferences(): Promise<NotificationPreferences> {
    if (!this.userToken) {
      throw new NotificationError('User token required', 401);
    }

    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/notification_preferences?select=*`,
      {
        headers: {
          Authorization: `Bearer ${this.userToken}`,
          apikey: this.supabaseKey,
        },
      }
    );

    const data = (await response.json()) as NotificationPreferences[];

    if (!response.ok) {
      throw new NotificationError(
        'Failed to get preferences',
        response.status,
        data
      );
    }

    return data[0];
  }

  /**
   * Update user notification preferences (requires user token)
   */
  async updatePreferences(
    updates: UpdatePreferencesRequest
  ): Promise<NotificationPreferences> {
    if (!this.userToken) {
      throw new NotificationError('User token required', 401);
    }

    const response = await fetch(
      `${this.functionsUrl}/update-notification-preferences`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      }
    );

    const data = (await response.json()) as {
      error?: string;
      data?: NotificationPreferences;
    };

    if (!response.ok) {
      throw new NotificationError(
        data.error || 'Failed to update preferences',
        response.status,
        data
      );
    }

    return data.data!;
  }

  /**
   * Get all templates
   */
  async getTemplates(): Promise<NotificationTemplate[]> {
    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/notification_templates?is_active=eq.true&select=*`,
      {
        headers: {
          apikey: this.supabaseKey,
        },
      }
    );

    const data = (await response.json()) as NotificationTemplate[];

    if (!response.ok) {
      throw new NotificationError(
        'Failed to get templates',
        response.status,
        data
      );
    }

    return data;
  }

  /**
   * Get template by name
   */
  async getTemplate(name: string): Promise<NotificationTemplate> {
    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/notification_templates?name=eq.${name}&is_active=eq.true&select=*`,
      {
        headers: {
          apikey: this.supabaseKey,
        },
      }
    );

    const data = (await response.json()) as NotificationTemplate[];

    if (!response.ok || !data[0]) {
      throw new NotificationError('Template not found', 404, data);
    }

    return data[0];
  }

  // ===== CONVENIENCE METHODS =====

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(
    email: string,
    firstName: string,
    userId?: string
  ): Promise<QueueNotificationResponse> {
    return this.queueNotification(
      'welcome_email',
      {
        first_name: firstName,
        email,
      },
      {
        user_id: userId,
        recipient_email: email,
        priority: 7,
      }
    );
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(
    email: string,
    firstName: string,
    resetLink: string,
    userId?: string
  ): Promise<SendNotificationResponse> {
    return this.sendImmediately(
      'password_reset',
      {
        first_name: firstName,
        reset_link: resetLink,
      },
      {
        user_id: userId,
        recipient_email: email,
      }
    );
  }

  /**
   * Send order confirmation
   */
  async sendOrderConfirmation(
    userId: string,
    customerName: string,
    orderNumber: string,
    total: string,
    deliveryDate: string,
    trackingLink: string,
    email?: string,
    phone?: string
  ): Promise<QueueNotificationResponse> {
    return this.queueNotification(
      'order_confirmation',
      {
        customer_name: customerName,
        order_number: orderNumber,
        total,
        delivery_date: deliveryDate,
        tracking_link: trackingLink,
      },
      {
        user_id: userId,
        recipient_email: email,
        recipient_phone: phone,
        priority: 6,
      }
    );
  }

  /**
   * Send booking confirmation
   */
  async sendBookingConfirmation(
    userId: string,
    guestName: string,
    propertyName: string,
    checkinDate: string,
    checkoutDate: string,
    confirmationCode: string,
    email?: string,
    phone?: string
  ): Promise<QueueNotificationResponse> {
    return this.queueNotification(
      'booking_confirmation',
      {
        guest_name: guestName,
        property_name: propertyName,
        checkin_date: checkinDate,
        checkout_date: checkoutDate,
        confirmation_code: confirmationCode,
      },
      {
        user_id: userId,
        recipient_email: email,
        recipient_phone: phone,
        priority: 6,
      }
    );
  }

  /**
   * Send ride accepted notification (urgent)
   */
  async sendRideAccepted(
    userId: string,
    driverName: string,
    eta: string,
    trackingLink: string,
    phone?: string,
    deviceToken?: string
  ): Promise<SendNotificationResponse> {
    return this.sendImmediately(
      'ride_accepted',
      {
        driver_name: driverName,
        eta,
        tracking_link: trackingLink,
      },
      {
        user_id: userId,
        recipient_phone: phone,
        recipient_device_token: deviceToken,
        channels: ['sms', 'push'] as NotificationChannel[],
      }
    );
  }
}
