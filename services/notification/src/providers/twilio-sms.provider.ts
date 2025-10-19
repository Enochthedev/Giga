/**
 * Twilio SMS Provider Implementation
 */

import { Twilio } from 'twilio';
import { ISMSProvider } from '../interfaces/provider.interface';
import logger from '../lib/logger';
import {
  NotificationChannel,
  NotificationErrorCode,
  NotificationStatus,
  ProviderResponse,
  SMSProviderConfig,
  SMSRequest,
} from '../types';
import { formatPhoneNumber, isValidPhoneNumber } from '../utils/helpers';

export class TwilioSMSProvider implements ISMSProvider {
  public readonly name: string;
  public readonly channel = NotificationChannel.SMS;
  private client: Twilio | null = null;
  private config: SMSProviderConfig | null = null;
  private isConfigured = false;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Configure the Twilio SMS provider
   */
  async configure(config: SMSProviderConfig): Promise<void> {
    try {
      if (!config.credentials.accountSid || !config.credentials.authToken) {
        throw new Error('Twilio Account SID and Auth Token are required');
      }

      if (!config.settings.fromNumber) {
        throw new Error('Twilio from number is required');
      }

      this.config = config;

      // Initialize Twilio client
      this.client = new Twilio(
        config.credentials.accountSid,
        config.credentials.authToken
      );

      // Verify configuration by checking account details
      await this.client.api.accounts(config.credentials.accountSid).fetch();

      this.isConfigured = true;

      logger.info(`Twilio SMS provider ${this.name} configured successfully`, {
        accountSid: config.credentials.accountSid,
        fromNumber: config.settings.fromNumber,
      });
    } catch (error) {
      this.isConfigured = false;
      logger.error(`Failed to configure Twilio SMS provider ${this.name}`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        accountSid: config.credentials.accountSid,
      });
      throw error;
    }
  }

  /**
   * Send a single SMS
   */
  async sendSMS(request: SMSRequest): Promise<ProviderResponse> {
    const startTime = Date.now();
    try {
      if (!this.isConfigured || !this.client || !this.config) {
        throw new Error(`Twilio SMS provider ${this.name} is not configured`);
      }

      // Validate SMS request
      const validation = await this.validateSMSRequest(request);
      if (!validation.isValid) {
        throw new Error(
          `SMS validation failed: ${validation.errors.join(', ')}`
        );
      }

      // Format phone number
      const formattedTo = formatPhoneNumber(request.to);

      // Prepare SMS options
      const messageOptions: any = {
        to: formattedTo,
        from: this.config.settings.fromNumber,
        body: request.body,
      };

      // Add messaging service SID if configured
      if (this.config.settings.messagingServiceSid) {
        messageOptions.messagingServiceSid =
          this.config.settings.messagingServiceSid;
        delete messageOptions.from; // Use messaging service instead of from number
      }

      // Add status callback if configured
      if (this.config.settings.statusCallback) {
        messageOptions.statusCallback = this.config.settings.statusCallback;
      }

      // Add metadata if present
      if (request.metadata) {
        // Twilio doesn't support custom metadata directly, but we can use it for tracking
        logger.info(`SMS metadata for tracking`, {
          messageId: `twilio_${Date.now()}`,
          metadata: request.metadata,
        });
      }

      // Send SMS
      const result = await this.client.messages.create(messageOptions);
      const responseTime = Date.now() - startTime;

      logger.info(`SMS sent successfully via ${this.name}`, {
        messageId: result.sid,
        to: formattedTo,
        status: result.status,
        responseTime,
      });

      return {
        success: true,
        messageId: result.sid,
        status: this.mapTwilioStatusToNotificationStatus(result.status),
        provider: this.name,
        timestamp: new Date(),
        responseTime,
        metadata: {
          twilioStatus: result.status,
          direction: result.direction,
          price: result.price,
          priceUnit: result.priceUnit,
          uri: result.uri,
          accountSid: result.accountSid,
          numSegments: result.numSegments,
        },
      };
    } catch (error) {
      logger.error(`Failed to send SMS via ${this.name}`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        to: request.to,
        body: request.body.substring(0, 50) + '...',
      });

      return {
        success: false,
        messageId: '',
        status: NotificationStatus.FAILED,
        provider: this.name,
        timestamp: new Date(),
        responseTime: Date.now() - startTime,
        error: {
          code: this.mapErrorToCode(error),
          message: error instanceof Error ? error.message : 'Unknown error',
          details: { originalError: error },
          retryable: this.isRetryableError(error),
          retryAfter: this.getRetryDelay(error),
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Send multiple SMS messages in bulk
   */
  async sendBulkSMS(requests: SMSRequest[]): Promise<ProviderResponse[]> {
    const results: ProviderResponse[] = [];

    // Process SMS messages in batches to respect rate limits
    const batchSize = 10; // Twilio recommends smaller batches for SMS

    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const batchPromises = batch.map(request => this.sendSMS(request));

      try {
        const batchResults = await Promise.allSettled(batchPromises);

        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          } else {
            results.push({
              success: false,
              messageId: '',
              status: NotificationStatus.FAILED,
              provider: this.name,
              timestamp: new Date(),
              responseTime: 0,
              error: {
                code: NotificationErrorCode.PROVIDER_ERROR,
                message:
                  result.reason instanceof Error
                    ? result.reason.message
                    : 'Bulk SMS send failed',
                details: { batchIndex: i + index },
                retryable: true,
                retryAfter: 5000,
                timestamp: new Date(),
              },
            });
          }
        });
      } catch (error) {
        // Handle batch-level errors
        batch.forEach((_, index) => {
          results.push({
            success: false,
            messageId: '',
            status: NotificationStatus.FAILED,
            provider: this.name,
            timestamp: new Date(),
            responseTime: 0,
            error: {
              code: NotificationErrorCode.PROVIDER_ERROR,
              message:
                error instanceof Error
                  ? error.message
                  : 'Batch SMS processing failed',
              details: { batchIndex: i + index },
              retryable: true,
              retryAfter: 5000,
              timestamp: new Date(),
            },
          });
        });
      }

      // Add delay between batches to respect rate limits
      if (i + batchSize < requests.length) {
        await this.delay(1000); // 1 second delay between batches
      }
    }

    return results;
  }

  /**
   * Validate phone number format
   */
  async validatePhoneNumber(phoneNumber: string): Promise<boolean> {
    try {
      const formatted = formatPhoneNumber(phoneNumber);
      return isValidPhoneNumber(formatted);
    } catch (error) {
      return false;
    }
  }

  /**
   * Get delivery status from Twilio
   */
  async getDeliveryStatus(messageId: string): Promise<string> {
    try {
      if (!this.isConfigured || !this.client) {
        throw new Error(`Twilio SMS provider ${this.name} is not configured`);
      }

      const message = await this.client.messages(messageId).fetch();
      return message.status;
    } catch (error) {
      logger.error(`Failed to get delivery status for message ${messageId}`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: this.name,
      });
      return 'unknown';
    }
  }

  /**
   * Handle delivery receipt webhook
   */
  async handleDeliveryReceipt(webhookData: any): Promise<void> {
    try {
      logger.info(`SMS delivery receipt received for ${this.name}`, {
        messageId: webhookData.MessageSid,
        status: webhookData.MessageStatus,
        to: webhookData.To,
        from: webhookData.From,
      });

      // Process delivery receipt based on status
      const status = webhookData.MessageStatus;
      const messageId = webhookData.MessageSid;

      // You can emit events here for analytics tracking
      // Example: this.eventEmitter.emit('sms.delivery.receipt', { messageId, status, webhookData });
    } catch (error) {
      logger.error(`Failed to handle SMS delivery receipt for ${this.name}`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        webhookData,
      });
    }
  }

  /**
   * Check provider health
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConfigured || !this.client || !this.config) {
        return false;
      }

      // Check account status
      const account = await this.client.api
        .accounts(this.config.credentials.accountSid!)
        .fetch();
      return account.status === 'active';
    } catch (error) {
      logger.warn(`Health check failed for ${this.name}`, {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  /**
   * Get quota information from Twilio
   */
  async getQuota(): Promise<{
    limit: number;
    used: number;
    remaining: number;
  }> {
    try {
      if (!this.isConfigured || !this.client || !this.config) {
        return { limit: -1, used: 0, remaining: -1 };
      }

      // Twilio doesn't provide direct quota API, but we can check account balance
      const account = await this.client.api
        .accounts(this.config.credentials.accountSid!)
        .fetch();

      // Return balance information (this is a simplified implementation)
      return {
        limit: -1, // No specific limit
        used: 0, // Would need to calculate from usage records
        remaining: -1, // Based on account balance
      };
    } catch (error) {
      logger.error(`Failed to get quota for ${this.name}`, {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return { limit: -1, used: 0, remaining: -1 };
    }
  }

  /**
   * Private helper methods
   */

  private async validateSMSRequest(request: SMSRequest): Promise<{
    isValid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    // Validate phone number
    if (!request.to) {
      errors.push('Recipient phone number is required');
    } else {
      const isValid = await this.validatePhoneNumber(request.to);
      if (!isValid) {
        errors.push(`Invalid phone number format: ${request.to}`);
      }
    }

    // Validate message body
    if (!request.body || request.body.trim().length === 0) {
      errors.push('SMS message body is required');
    }

    // Check message length
    const maxLength = this.config?.settings.maxMessageLength || 1600; // Twilio's default limit
    if (request.body && request.body.length > maxLength) {
      errors.push(
        `SMS message body exceeds maximum length of ${maxLength} characters`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private mapTwilioStatusToNotificationStatus(
    twilioStatus: string
  ): NotificationStatus {
    switch (twilioStatus) {
      case 'queued':
      case 'accepted':
        return NotificationStatus.QUEUED;
      case 'sending':
        return NotificationStatus.PROCESSING;
      case 'sent':
        return NotificationStatus.SENT;
      case 'delivered':
        return NotificationStatus.DELIVERED;
      case 'failed':
      case 'undelivered':
        return NotificationStatus.FAILED;
      default:
        return NotificationStatus.PENDING;
    }
  }

  private mapErrorToCode(error: any): NotificationErrorCode {
    if (!error) return NotificationErrorCode.PROVIDER_ERROR;

    const errorMessage = error.message || error.toString();
    const errorCode = error.code;

    // Twilio-specific error codes
    if (errorCode) {
      switch (errorCode) {
        case 20003: // Authentication Error
        case 20404: // Account not found
          return NotificationErrorCode.AUTHENTICATION_FAILED;
        case 21211: // Invalid 'To' Phone Number
        case 21614: // 'To' phone number cannot be reached
          return NotificationErrorCode.INVALID_RECIPIENT;
        case 20429: // Too Many Requests
          return NotificationErrorCode.RATE_LIMIT_EXCEEDED;
        case 21610: // Message cannot be sent to landline
        case 30007: // Message delivery failed
          return NotificationErrorCode.DELIVERY_FAILED;
        default:
          return NotificationErrorCode.PROVIDER_ERROR;
      }
    }

    // Fallback to message-based detection
    if (
      errorMessage.includes('authentication') ||
      errorMessage.includes('unauthorized')
    ) {
      return NotificationErrorCode.AUTHENTICATION_FAILED;
    }

    if (
      errorMessage.includes('invalid phone') ||
      errorMessage.includes('invalid number')
    ) {
      return NotificationErrorCode.INVALID_RECIPIENT;
    }

    if (
      errorMessage.includes('rate limit') ||
      errorMessage.includes('too many requests')
    ) {
      return NotificationErrorCode.RATE_LIMIT_EXCEEDED;
    }

    return NotificationErrorCode.PROVIDER_ERROR;
  }

  private isRetryableError(error: any): boolean {
    const errorCode = this.mapErrorToCode(error);

    // These errors are typically retryable
    return [
      NotificationErrorCode.SERVICE_UNAVAILABLE,
      NotificationErrorCode.RATE_LIMIT_EXCEEDED,
      NotificationErrorCode.PROVIDER_ERROR,
    ].includes(errorCode);
  }

  private getRetryDelay(error: any): number {
    const errorCode = this.mapErrorToCode(error);

    switch (errorCode) {
      case NotificationErrorCode.RATE_LIMIT_EXCEEDED:
        return 60000; // 1 minute
      case NotificationErrorCode.SERVICE_UNAVAILABLE:
        return 30000; // 30 seconds
      default:
        return 5000; // 5 seconds
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
