/**
 * SMS Service that integrates with the notification service
 */
export class SmsService {
  private notificationServiceUrl: string;

  constructor() {
    this.notificationServiceUrl =
      process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3002';
  }

  async sendVerificationCode(phoneNumber: string, code: string): Promise<void> {
    try {
      await this.sendSMS(phoneNumber, {
        template: 'verification_code',
        data: { code },
        priority: 'high',
      });

      if (process.env.NODE_ENV === 'development') {
        console.log(`[DEV] SMS Verification Code for ${phoneNumber}: ${code}`);
      }
    } catch (error) {
      console.error('Failed to send SMS verification code:', error);
      throw new Error('Failed to send SMS verification code');
    }
  }

  async sendPasswordResetCode(
    phoneNumber: string,
    code: string
  ): Promise<void> {
    try {
      await this.sendSMS(phoneNumber, {
        template: 'password_reset_code',
        data: { code },
        priority: 'high',
      });

      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[DEV] SMS Password Reset Code for ${phoneNumber}: ${code}`
        );
      }
    } catch (error) {
      console.error('Failed to send password reset SMS:', error);
      throw new Error('Failed to send password reset SMS');
    }
  }

  async sendSecurityAlert(phoneNumber: string, message: string): Promise<void> {
    try {
      await this.sendSMS(phoneNumber, {
        template: 'security_alert',
        data: { message },
        priority: 'urgent',
      });

      if (process.env.NODE_ENV === 'development') {
        console.log(`[DEV] SMS Security Alert for ${phoneNumber}: ${message}`);
      }
    } catch (error) {
      console.error('Failed to send security alert SMS:', error);
      throw new Error('Failed to send security alert SMS');
    }
  }

  private async sendSMS(
    phoneNumber: string,
    options: {
      template: string;
      data: Record<string, unknown>;
      priority: 'low' | 'normal' | 'high' | 'urgent';
    }
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.notificationServiceUrl}/api/notifications/sms`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.INTERNAL_SERVICE_TOKEN || 'dev-token'}`,
          },
          body: JSON.stringify({
            recipient: phoneNumber,
            template: options.template,
            data: options.data,
            priority: options.priority,
            source: 'auth-service',
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `SMS service responded with status: ${response.status}`
        );
      }

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };
      if (!result.success) {
        throw new Error(result.error || 'SMS sending failed');
      }
    } catch (error) {
      // Fallback to console logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[FALLBACK] SMS to ${phoneNumber}: ${JSON.stringify(options.data)}`
        );
        return;
      }
      throw error;
    }
  }
}

export const smsService = new SmsService();
