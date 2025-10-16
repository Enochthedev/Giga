/**
 * SMTP Email Provider Implementation
 */

import nodemailer, { SendMailOptions, Transporter } from 'nodemailer';
import {
  EmailProviderConfig,
  IEmailProvider,
} from '../interfaces/email.interface';
import logger from '../lib/logger';
import {
  EmailRequest,
  NotificationErrorCode,
  NotificationStatus,
  ProviderResponse,
} from '../types';

export class SMTPEmailProvider implements IEmailProvider {
  public readonly name: string;
  private transporter: Transporter | null = null;
  private config: EmailProviderConfig | null = null;
  private isConfigured = false;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Configure the SMTP provider
   */
  async configure(config: EmailProviderConfig): Promise<void> {
    try {
      if (!config.smtp) {
        throw new Error('SMTP configuration is required');
      }

      this.config = config;

      // Create nodemailer transporter
      this.transporter = nodemailer.createTransporter({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure,
        auth: config.smtp.auth,
        pool: config.smtp.pool || true,
        maxConnections: config.smtp.maxConnections || 5,
        maxMessages: config.smtp.maxMessages || 100,
        // Additional security options
        tls: {
          rejectUnauthorized: true,
        },
        // Connection timeout
        connectionTimeout: 60000,
        greetingTimeout: 30000,
        socketTimeout: 60000,
      });

      // Verify connection
      await this.transporter.verify();
      this.isConfigured = true;

      logger.info(`SMTP provider ${this.name} configured successfully`, {
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure,
      });
    } catch (error) {
      this.isConfigured = false;
      logger.error(`Failed to configure SMTP provider ${this.name}`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        config: {
          host: config.smtp?.host,
          port: config.smtp?.port,
        },
      });
      throw error;
    }
  }

  /**
   * Send a single email
   */
  async sendEmail(request: EmailRequest): Promise<ProviderResponse> {
    try {
      if (!this.isConfigured || !this.transporter) {
        throw new Error(`SMTP provider ${this.name} is not configured`);
      }

      // Validate email request
      const validation = await this.validateEmailRequest(request);
      if (!validation.isValid) {
        throw new Error(
          `Email validation failed: ${validation.errors.join(', ')}`
        );
      }

      // Prepare email options
      const mailOptions: SendMailOptions = {
        from: this.getFromAddress(),
        to: Array.isArray(request.to) ? request.to.join(', ') : request.to,
        subject: request.subject,
        html: request.htmlBody,
        text: request.textBody,
      };

      // Add optional fields
      if (request.cc && request.cc.length > 0) {
        mailOptions.cc = Array.isArray(request.cc)
          ? request.cc.join(', ')
          : request.cc;
      }

      if (request.bcc && request.bcc.length > 0) {
        mailOptions.bcc = Array.isArray(request.bcc)
          ? request.bcc.join(', ')
          : request.bcc;
      }

      // Add attachments if present
      if (request.attachments && request.attachments.length > 0) {
        mailOptions.attachments = request.attachments.map(attachment => ({
          filename: attachment.filename,
          content: attachment.content,
          contentType: attachment.contentType,
          cid: attachment.cid,
        }));
      }

      // Add tracking headers if enabled
      if (request.trackingEnabled) {
        if (!mailOptions.headers) {
          mailOptions.headers = {};
        }
        mailOptions.headers['X-Track-Opens'] = 'true';
        mailOptions.headers['X-Track-Clicks'] = 'true';
      }

      // Add priority headers
      if (request.priority) {
        const priorityMap = {
          low: '5',
          normal: '3',
          high: '2',
          urgent: '1',
        };
        if (!mailOptions.headers) {
          mailOptions.headers = {};
        }
        mailOptions.headers['X-Priority'] =
          priorityMap[request.priority] || '3';
        mailOptions.headers['X-MSMail-Priority'] =
          request.priority === 'urgent' ? 'High' : 'Normal';
      }

      // Add metadata as custom headers
      if (request.metadata) {
        if (!mailOptions.headers) {
          mailOptions.headers = {};
        }
        Object.entries(request.metadata).forEach(([key, value]) => {
          mailOptions.headers![`X-Metadata-${key}`] = String(value);
        });
      }

      // Send email
      const startTime = Date.now();
      const result = await this.transporter.sendMail(mailOptions);
      const responseTime = Date.now() - startTime;

      logger.info(`Email sent successfully via ${this.name}`, {
        messageId: result.messageId,
        to: request.to,
        subject: request.subject,
        responseTime,
      });

      return {
        messageId: result.messageId,
        status: NotificationStatus.SENT,
        provider: this.name,
        timestamp: new Date(),
        responseTime,
        metadata: {
          accepted: result.accepted,
          rejected: result.rejected,
          pending: result.pending,
          response: result.response,
        },
      };
    } catch (error) {
      logger.error(`Failed to send email via ${this.name}`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        to: request.to,
        subject: request.subject,
      });

      return {
        messageId: '',
        status: NotificationStatus.FAILED,
        provider: this.name,
        timestamp: new Date(),
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
   * Send multiple emails in bulk
   */
  async sendBulkEmails(requests: EmailRequest[]): Promise<ProviderResponse[]> {
    const results: ProviderResponse[] = [];

    // Process emails in batches to avoid overwhelming the SMTP server
    const batchSize = this.config?.smtp?.maxMessages || 10;

    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const batchPromises = batch.map(request => this.sendEmail(request));

      try {
        const batchResults = await Promise.allSettled(batchPromises);

        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          } else {
            results.push({
              messageId: '',
              status: NotificationStatus.FAILED,
              provider: this.name,
              timestamp: new Date(),
              error: {
                code: NotificationErrorCode.PROVIDER_ERROR,
                message:
                  result.reason instanceof Error
                    ? result.reason.message
                    : 'Bulk send failed',
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
            messageId: '',
            status: NotificationStatus.FAILED,
            provider: this.name,
            timestamp: new Date(),
            error: {
              code: NotificationErrorCode.PROVIDER_ERROR,
              message:
                error instanceof Error
                  ? error.message
                  : 'Batch processing failed',
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
   * Validate email address format
   */
  async validateEmailAddress(email: string): Promise<boolean> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get delivery status (not supported by SMTP)
   */
  async getDeliveryStatus(_messageId: string): Promise<string> {
    // SMTP doesn't provide delivery status tracking
    return 'sent';
  }

  /**
   * Handle bounce notifications (webhook-based)
   */
  async handleBounce(webhookData: any): Promise<void> {
    logger.info(`Bounce received for ${this.name}`, { webhookData });
    // Implementation depends on the specific SMTP provider's webhook format
  }

  /**
   * Handle complaint notifications (webhook-based)
   */
  async handleComplaint(webhookData: any): Promise<void> {
    logger.info(`Complaint received for ${this.name}`, { webhookData });
    // Implementation depends on the specific SMTP provider's webhook format
  }

  /**
   * Check provider health
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConfigured || !this.transporter) {
        return false;
      }

      await this.transporter.verify();
      return true;
    } catch (error) {
      logger.warn(`Health check failed for ${this.name}`, {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  /**
   * Get quota information (not supported by most SMTP providers)
   */
  async getQuota(): Promise<{
    limit: number;
    used: number;
    remaining: number;
  }> {
    // Most SMTP providers don't provide quota information
    return {
      limit: -1, // Unlimited or unknown
      used: 0,
      remaining: -1,
    };
  }

  /**
   * Private helper methods
   */

  private async validateEmailRequest(request: EmailRequest): Promise<{
    isValid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    // Validate recipients
    if (!request.to) {
      errors.push('Recipient email address is required');
    } else {
      const recipients = Array.isArray(request.to) ? request.to : [request.to];
      for (const email of recipients) {
        if (!(await this.validateEmailAddress(email))) {
          errors.push(`Invalid email address: ${email}`);
        }
      }
    }

    // Validate CC addresses
    if (request.cc) {
      const ccEmails = Array.isArray(request.cc) ? request.cc : [request.cc];
      for (const email of ccEmails) {
        if (!(await this.validateEmailAddress(email))) {
          errors.push(`Invalid CC email address: ${email}`);
        }
      }
    }

    // Validate BCC addresses
    if (request.bcc) {
      const bccEmails = Array.isArray(request.bcc)
        ? request.bcc
        : [request.bcc];
      for (const email of bccEmails) {
        if (!(await this.validateEmailAddress(email))) {
          errors.push(`Invalid BCC email address: ${email}`);
        }
      }
    }

    // Validate subject
    if (!request.subject || request.subject.trim().length === 0) {
      errors.push('Email subject is required');
    }

    // Validate content
    if (!request.htmlBody && !request.textBody) {
      errors.push('Either HTML body or text body is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private getFromAddress(): string {
    // Use configured from address or default
    return process.env.SMTP_FROM_ADDRESS || 'noreply@platform.com';
  }

  private mapErrorToCode(error: any): NotificationErrorCode {
    if (!error) return NotificationErrorCode.PROVIDER_ERROR;

    const errorMessage = error.message || error.toString();

    if (
      errorMessage.includes('Invalid login') ||
      errorMessage.includes('Authentication failed')
    ) {
      return NotificationErrorCode.AUTHENTICATION_FAILED;
    }

    if (
      errorMessage.includes('Invalid recipient') ||
      errorMessage.includes('Invalid email')
    ) {
      return NotificationErrorCode.INVALID_RECIPIENT;
    }

    if (
      errorMessage.includes('Rate limit') ||
      errorMessage.includes('Too many requests')
    ) {
      return NotificationErrorCode.RATE_LIMIT_EXCEEDED;
    }

    if (
      errorMessage.includes('SMTP connection') ||
      errorMessage.includes('Connection') ||
      errorMessage.includes('timeout')
    ) {
      return NotificationErrorCode.SERVICE_UNAVAILABLE;
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
