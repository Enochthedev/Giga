/**
 * Email Processing Service
 * Handles email notifications with template rendering and provider management
 */

import {
  EmailProviderConfig,
  IEmailProcessor,
  IEmailProvider,
} from '../interfaces/email.interface';
import { ITemplateEngine } from '../interfaces/template.interface';
import logger from '../lib/logger';
import { SMTPEmailProvider } from '../providers/smtp-email.provider';
import {
  EmailRequest,
  EmailResult,
  NotificationErrorCode,
  NotificationStatus,
  TemplateVariables,
} from '../types';
import { TemplateEngineService } from './template.service';

export class EmailProcessorService implements IEmailProcessor {
  private providers: Map<string, IEmailProvider> = new Map();
  private templateEngine: ITemplateEngine;
  private defaultProvider: string | null = null;

  constructor() {
    this.templateEngine = new TemplateEngineService();
    // Initialize providers asynchronously
    this.initializeProviders().catch(error => {
      logger.error('Failed to initialize email providers during construction', {
        error,
      });
    });
  }

  /**
   * Initialize email providers from configuration
   */
  private async initializeProviders(): Promise<void> {
    try {
      // Initialize SMTP provider with environment configuration
      const smtpConfig: EmailProviderConfig = {
        name: 'smtp-primary',
        type: 'smtp',
        enabled: true,
        priority: 1,
        smtp: {
          host: process.env.SMTP_HOST || 'localhost',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || '',
          },
          pool: true,
          maxConnections: parseInt(process.env.SMTP_MAX_CONNECTIONS || '5'),
          maxMessages: parseInt(process.env.SMTP_MAX_MESSAGES || '100'),
        },
        rateLimit: {
          maxPerSecond: parseInt(
            process.env.SMTP_RATE_LIMIT_PER_SECOND || '10'
          ),
          maxPerMinute: parseInt(
            process.env.SMTP_RATE_LIMIT_PER_MINUTE || '100'
          ),
          maxPerHour: parseInt(process.env.SMTP_RATE_LIMIT_PER_HOUR || '1000'),
          maxPerDay: parseInt(process.env.SMTP_RATE_LIMIT_PER_DAY || '10000'),
        },
        failover: {
          enabled: true,
          retryAttempts: 3,
          retryDelay: 5000,
          backupProviders: [],
        },
      };

      // Only initialize if SMTP is configured
      if (smtpConfig.smtp?.host && smtpConfig.smtp?.auth.user) {
        const smtpProvider = new SMTPEmailProvider('smtp-primary');
        await smtpProvider.configure(smtpConfig);
        this.providers.set('smtp-primary', smtpProvider);
        this.defaultProvider = 'smtp-primary';

        logger.info('Email processor initialized with SMTP provider', {
          provider: 'smtp-primary',
          host: smtpConfig.smtp.host,
          port: smtpConfig.smtp.port,
        });
      } else {
        logger.warn(
          'SMTP provider not configured - email functionality will be limited'
        );
      }
    } catch (error) {
      logger.error('Failed to initialize email providers', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Process a single email request
   */
  async processEmail(request: EmailRequest): Promise<EmailResult> {
    try {
      // Validate email request
      const validation = await this.validateEmailContent(request);
      if (!validation.isValid) {
        throw new Error(
          `Email validation failed: ${validation.errors.join(', ')}`
        );
      }

      // Render template if templateId is provided
      let processedRequest = request;
      if (request.templateId && request.variables) {
        processedRequest = await this.renderEmailTemplate(request);
      }

      // Select provider
      const providerName = await this.selectProvider(processedRequest);
      const provider = this.providers.get(providerName);

      if (!provider) {
        throw new Error(`Email provider not found: ${providerName}`);
      }

      // Send email through provider
      const providerResponse = await provider.sendEmail(processedRequest);

      // Map provider response to EmailResult
      return {
        messageId: providerResponse.messageId,
        status: providerResponse.status,
        provider: providerName,
        estimatedDelivery: this.calculateEstimatedDelivery(),
        error: providerResponse.error,
      };
    } catch (error) {
      logger.error('Failed to process email', {
        error: error instanceof Error ? error.message : 'Unknown error',
        to: request.to,
        subject: request.subject,
        templateId: request.templateId,
      });

      return {
        messageId: '',
        status: NotificationStatus.FAILED,
        provider: this.defaultProvider || 'unknown',
        error: {
          code: NotificationErrorCode.DELIVERY_FAILED,
          message:
            error instanceof Error ? error.message : 'Email processing failed',
          details: { originalError: error },
          retryable: true,
          retryAfter: 5000,
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Process multiple emails in bulk
   */
  async processBulkEmails(requests: EmailRequest[]): Promise<EmailResult[]> {
    const results: EmailResult[] = [];

    // Group requests by provider for efficient processing
    const providerGroups = new Map<string, EmailRequest[]>();

    for (const request of requests) {
      try {
        const providerName = await this.selectProvider(request);
        if (!providerGroups.has(providerName)) {
          providerGroups.set(providerName, []);
        }
        providerGroups.get(providerName)!.push(request);
      } catch (error) {
        // Handle provider selection errors
        results.push({
          messageId: '',
          status: NotificationStatus.FAILED,
          provider: 'unknown',
          error: {
            code: NotificationErrorCode.PROVIDER_ERROR,
            message:
              error instanceof Error
                ? error.message
                : 'Provider selection failed',
            details: { request },
            retryable: false,
            retryAfter: 0,
            timestamp: new Date(),
          },
        });
      }
    }

    // Process each provider group
    for (const [providerName, providerRequests] of providerGroups) {
      const provider = this.providers.get(providerName);
      if (!provider) {
        // Handle missing provider
        providerRequests.forEach(() => {
          results.push({
            messageId: '',
            status: NotificationStatus.FAILED,
            provider: providerName,
            error: {
              code: NotificationErrorCode.PROVIDER_ERROR,
              message: `Provider not found: ${providerName}`,
              details: {},
              retryable: false,
              retryAfter: 0,
              timestamp: new Date(),
            },
          });
        });
        continue;
      }

      try {
        // Process template rendering for requests that need it
        const processedRequests = await Promise.all(
          providerRequests.map(async request => {
            if (request.templateId && request.variables) {
              return await this.renderEmailTemplate(request);
            }
            return request;
          })
        );

        // Send bulk emails through provider
        const providerResponses =
          await provider.sendBulkEmails(processedRequests);

        // Map provider responses to EmailResults
        providerResponses.forEach(response => {
          results.push({
            messageId: response.messageId,
            status: response.status,
            provider: providerName,
            estimatedDelivery: this.calculateEstimatedDelivery(),
            error: response.error,
          });
        });
      } catch (error) {
        // Handle provider-level errors
        providerRequests.forEach(() => {
          results.push({
            messageId: '',
            status: NotificationStatus.FAILED,
            provider: providerName,
            error: {
              code: NotificationErrorCode.PROVIDER_ERROR,
              message:
                error instanceof Error
                  ? error.message
                  : 'Bulk email processing failed',
              details: { providerName },
              retryable: true,
              retryAfter: 10000,
              timestamp: new Date(),
            },
          });
        });
      }
    }

    return results;
  }

  /**
   * Render template and send email
   */
  async renderAndSendEmail(
    templateId: string,
    variables: TemplateVariables,
    recipient: string | string[],
    options?: {
      cc?: string[];
      bcc?: string[];
      attachments?: any[];
      priority?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<EmailResult> {
    try {
      // Render email template
      const renderedTemplate = await this.templateEngine.renderEmailTemplate(
        templateId,
        variables
      );

      // Create email request
      const emailRequest: EmailRequest = {
        to: recipient,
        subject: renderedTemplate.subject,
        htmlBody: renderedTemplate.htmlBody,
        textBody: renderedTemplate.textBody,
        cc: options?.cc,
        bcc: options?.bcc,
        attachments: options?.attachments,
        priority: options?.priority as any,
        metadata: options?.metadata,
        trackingEnabled: true,
      };

      // Process the email
      return await this.processEmail(emailRequest);
    } catch (error) {
      logger.error('Failed to render and send email', {
        templateId,
        recipient,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return {
        messageId: '',
        status: NotificationStatus.FAILED,
        provider: this.defaultProvider || 'unknown',
        error: {
          code: NotificationErrorCode.TEMPLATE_RENDER_ERROR,
          message:
            error instanceof Error
              ? error.message
              : 'Template rendering failed',
          details: { templateId, variables },
          retryable: false,
          retryAfter: 0,
          timestamp: new Date(),
        },
      };
    }
  }

  /**
   * Validate email address format
   */
  async validateEmailAddress(email: string): Promise<boolean> {
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return false;
    }

    const trimmedEmail = email.trim();

    // More strict email validation
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    // Additional checks for invalid patterns
    if (
      trimmedEmail.includes('..') ||
      trimmedEmail.startsWith('.') ||
      trimmedEmail.endsWith('.') ||
      trimmedEmail.startsWith('@') ||
      trimmedEmail.endsWith('@') ||
      !trimmedEmail.includes('@') ||
      trimmedEmail.split('@').length !== 2
    ) {
      return false;
    }

    return emailRegex.test(trimmedEmail);
  }

  /**
   * Validate email content
   */
  async validateEmailContent(request: EmailRequest): Promise<{
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

    // Validate template requirements
    if (request.templateId && !request.variables) {
      errors.push('Template variables are required when using a template');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Select the best provider for the request
   */
  async selectProvider(request: EmailRequest): Promise<string> {
    // Simple provider selection - use default provider if available
    if (this.defaultProvider && this.providers.has(this.defaultProvider)) {
      const provider = this.providers.get(this.defaultProvider)!;
      const isHealthy = await provider.healthCheck();

      if (isHealthy) {
        return this.defaultProvider;
      }
    }

    // Fallback to any available healthy provider
    for (const [name, provider] of this.providers) {
      const isHealthy = await provider.healthCheck();
      if (isHealthy) {
        return name;
      }
    }

    throw new Error('No healthy email providers available');
  }

  /**
   * Get provider health status
   */
  async getProviderHealth(providerName: string): Promise<boolean> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      return false;
    }

    return await provider.healthCheck();
  }

  /**
   * Add a new email provider
   */
  async addProvider(name: string, config: EmailProviderConfig): Promise<void> {
    try {
      let provider: IEmailProvider;

      switch (config.type) {
        case 'smtp':
          provider = new SMTPEmailProvider(name);
          break;
        default:
          throw new Error(`Unsupported provider type: ${config.type}`);
      }

      await provider.configure(config);
      this.providers.set(name, provider);

      // Set as default if it's the first provider
      if (!this.defaultProvider) {
        this.defaultProvider = name;
      }

      logger.info(`Email provider added: ${name}`, { type: config.type });
    } catch (error) {
      logger.error(`Failed to add email provider: ${name}`, {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Remove an email provider
   */
  removeProvider(name: string): void {
    this.providers.delete(name);

    if (this.defaultProvider === name) {
      // Set new default provider
      const availableProviders = Array.from(this.providers.keys());
      this.defaultProvider =
        availableProviders.length > 0 ? availableProviders[0] : null;
    }

    logger.info(`Email provider removed: ${name}`);
  }

  /**
   * Get list of available providers
   */
  getProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Private helper methods
   */

  private async renderEmailTemplate(
    request: EmailRequest
  ): Promise<EmailRequest> {
    if (!request.templateId || !request.variables) {
      return request;
    }

    try {
      const renderedTemplate = await this.templateEngine.renderEmailTemplate(
        request.templateId,
        request.variables
      );

      return {
        ...request,
        subject: renderedTemplate.subject,
        htmlBody: renderedTemplate.htmlBody,
        textBody: renderedTemplate.textBody,
      };
    } catch (error) {
      logger.error('Failed to render email template', {
        templateId: request.templateId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  private calculateEstimatedDelivery(): Date {
    // Estimate delivery time based on provider type and current load
    // For SMTP, typically 30 seconds to 2 minutes
    const estimatedSeconds = 30 + Math.random() * 90; // 30-120 seconds
    return new Date(Date.now() + estimatedSeconds * 1000);
  }
}
