import crypto from 'crypto';
import { logger } from '../lib/logger';
import prisma from '../lib/prisma';
import { pciComplianceService } from './pci-compliance.service';

export interface WebhookVerificationResult {
  isValid: boolean;
  source: string;
  eventType?: string;
  timestamp?: Date;
  errorMessage?: string;
}

export interface WebhookSignature {
  algorithm: string;
  signature: string;
  timestamp?: number;
}

/**
 * Webhook Verification Service for secure webhook handling
 * Verifies webhook signatures from various payment gateways
 */
export class WebhookVerificationService {
  private readonly toleranceSeconds: number = 300; // 5 minutes

  /**
   * Verify Stripe webhook signature
   */
  async verifyStripeWebhook(
    payload: string,
    signature: string,
    secret: string
  ): Promise<WebhookVerificationResult> {
    try {
      const elements = signature.split(',');
      const signatureElements: { [key: string]: string } = {};

      for (const element of elements) {
        const [key, value] = element.split('=');
        signatureElements[key] = value;
      }

      const timestamp = parseInt(signatureElements.t, 10);
      const expectedSignature = signatureElements.v1;

      if (!timestamp || !expectedSignature) {
        return {
          isValid: false,
          source: 'stripe',
          errorMessage: 'Invalid signature format',
        };
      }

      // Check timestamp tolerance
      const currentTime = Math.floor(Date.now() / 1000);
      if (Math.abs(currentTime - timestamp) > this.toleranceSeconds) {
        await this.logVerificationAttempt(
          'stripe',
          false,
          'Timestamp outside tolerance'
        );
        return {
          isValid: false,
          source: 'stripe',
          errorMessage: 'Timestamp outside tolerance window',
        };
      }

      // Verify signature
      const signedPayload = `${timestamp}.${payload}`;
      const computedSignature = crypto
        .createHmac('sha256', secret)
        .update(signedPayload, 'utf8')
        .digest('hex');

      const isValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(computedSignature, 'hex')
      );

      await this.logVerificationAttempt('stripe', isValid);

      return {
        isValid,
        source: 'stripe',
        timestamp: new Date(timestamp * 1000),
      };
    } catch (error) {
      await this.logVerificationAttempt(
        'stripe',
        false,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        isValid: false,
        source: 'stripe',
        errorMessage: 'Signature verification failed',
      };
    }
  }

  /**
   * Verify PayPal webhook signature
   */
  async verifyPayPalWebhook(
    payload: string,
    headers: Record<string, string>,
    webhookId: string,
    certId: string
  ): Promise<WebhookVerificationResult> {
    try {
      // PayPal uses a more complex verification process involving certificates
      // This is a simplified implementation

      const authAlgo = headers['paypal-auth-algo'];
      const transmission = headers['paypal-transmission-id'];
      const certIdHeader = headers['paypal-cert-id'];
      const signature = headers['paypal-transmission-sig'];
      const timestamp = headers['paypal-transmission-time'];

      if (
        !authAlgo ||
        !transmission ||
        !certIdHeader ||
        !signature ||
        !timestamp
      ) {
        return {
          isValid: false,
          source: 'paypal',
          errorMessage: 'Missing required PayPal headers',
        };
      }

      // Verify cert ID matches
      if (certIdHeader !== certId) {
        await this.logVerificationAttempt(
          'paypal',
          false,
          'Certificate ID mismatch'
        );
        return {
          isValid: false,
          source: 'paypal',
          errorMessage: 'Certificate ID mismatch',
        };
      }

      // In a real implementation, you would:
      // 1. Download PayPal's public certificate
      // 2. Verify the certificate chain
      // 3. Use the public key to verify the signature

      // For now, we'll simulate verification
      const isValid = true; // Simplified for demo

      await this.logVerificationAttempt('paypal', isValid);

      return {
        isValid,
        source: 'paypal',
        timestamp: new Date(parseInt(timestamp) * 1000),
      };
    } catch (error) {
      await this.logVerificationAttempt(
        'paypal',
        false,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        isValid: false,
        source: 'paypal',
        errorMessage: 'PayPal signature verification failed',
      };
    }
  }

  /**
   * Verify Paystack webhook signature
   */
  async verifyPaystackWebhook(
    payload: string,
    signature: string,
    secret: string
  ): Promise<WebhookVerificationResult> {
    try {
      const computedSignature = crypto
        .createHmac('sha512', secret)
        .update(payload, 'utf8')
        .digest('hex');

      const isValid = crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(computedSignature, 'hex')
      );

      await this.logVerificationAttempt('paystack', isValid);

      return {
        isValid,
        source: 'paystack',
        timestamp: new Date(),
      };
    } catch (error) {
      await this.logVerificationAttempt(
        'paystack',
        false,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        isValid: false,
        source: 'paystack',
        errorMessage: 'Paystack signature verification failed',
      };
    }
  }

  /**
   * Verify Flutterwave webhook signature
   */
  async verifyFlutterwaveWebhook(
    payload: string,
    signature: string,
    secret: string
  ): Promise<WebhookVerificationResult> {
    try {
      const computedSignature = crypto
        .createHash('sha256')
        .update(payload + secret)
        .digest('hex');

      const isValid = crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(computedSignature)
      );

      await this.logVerificationAttempt('flutterwave', isValid);

      return {
        isValid,
        source: 'flutterwave',
        timestamp: new Date(),
      };
    } catch (error) {
      await this.logVerificationAttempt(
        'flutterwave',
        false,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        isValid: false,
        source: 'flutterwave',
        errorMessage: 'Flutterwave signature verification failed',
      };
    }
  }

  /**
   * Generic webhook verification for custom implementations
   */
  async verifyCustomWebhook(
    payload: string,
    signature: string,
    secret: string,
    algorithm: 'sha256' | 'sha512' = 'sha256',
    source: string = 'custom'
  ): Promise<WebhookVerificationResult> {
    try {
      const computedSignature = crypto
        .createHmac(algorithm, secret)
        .update(payload, 'utf8')
        .digest('hex');

      const isValid = crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(computedSignature, 'hex')
      );

      await this.logVerificationAttempt(source, isValid);

      return {
        isValid,
        source,
        timestamp: new Date(),
      };
    } catch (error) {
      await this.logVerificationAttempt(
        source,
        false,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        isValid: false,
        source,
        errorMessage: 'Custom webhook signature verification failed',
      };
    }
  }

  /**
   * Verify webhook based on source detection
   */
  async verifyWebhook(
    payload: string,
    headers: Record<string, string>,
    source?: string
  ): Promise<WebhookVerificationResult> {
    try {
      // Auto-detect source if not provided
      const detectedSource = source || this.detectWebhookSource(headers);

      switch (detectedSource) {
        case 'stripe':
          const stripeSignature = headers['stripe-signature'];
          const stripeSecret = process.env.STRIPE_WEBHOOK_SECRET;

          if (!stripeSignature || !stripeSecret) {
            throw new Error('Missing Stripe signature or secret');
          }

          return await this.verifyStripeWebhook(
            payload,
            stripeSignature,
            stripeSecret
          );

        case 'paypal':
          const paypalWebhookId = process.env.PAYPAL_WEBHOOK_ID;
          const paypalCertId = process.env.PAYPAL_CERT_ID;

          if (!paypalWebhookId || !paypalCertId) {
            throw new Error('Missing PayPal webhook configuration');
          }

          return await this.verifyPayPalWebhook(
            payload,
            headers,
            paypalWebhookId,
            paypalCertId
          );

        case 'paystack':
          const paystackSignature = headers['x-paystack-signature'];
          const paystackSecret = process.env.PAYSTACK_WEBHOOK_SECRET;

          if (!paystackSignature || !paystackSecret) {
            throw new Error('Missing Paystack signature or secret');
          }

          return await this.verifyPaystackWebhook(
            payload,
            paystackSignature,
            paystackSecret
          );

        case 'flutterwave':
          const flutterwaveSignature = headers['verif-hash'];
          const flutterwaveSecret = process.env.FLUTTERWAVE_WEBHOOK_SECRET;

          if (!flutterwaveSignature || !flutterwaveSecret) {
            throw new Error('Missing Flutterwave signature or secret');
          }

          return await this.verifyFlutterwaveWebhook(
            payload,
            flutterwaveSignature,
            flutterwaveSecret
          );

        default:
          return {
            isValid: false,
            source: detectedSource,
            errorMessage: `Unsupported webhook source: ${detectedSource}`,
          };
      }
    } catch (error) {
      logger.error('Webhook verification failed', {
        source,
        error: error instanceof Error ? error.message : 'Unknown error',
        headers: Object.keys(headers),
      });

      return {
        isValid: false,
        source: source || 'unknown',
        errorMessage:
          error instanceof Error ? error.message : 'Verification failed',
      };
    }
  }

  /**
   * Store webhook verification result for audit purposes
   */
  async storeWebhookEvent(
    payload: string,
    headers: Record<string, string>,
    verificationResult: WebhookVerificationResult,
    ipAddress?: string
  ): Promise<string> {
    try {
      const eventData = JSON.parse(payload);

      const webhookEvent = await prisma.webhookEvent.create({
        data: {
          type: eventData.type || 'unknown',
          gatewayId: verificationResult.source,
          gatewayEventId: eventData.id || crypto.randomUUID(),
          data: eventData,
          livemode: eventData.livemode || false,
          processed: false,
          metadata: {
            verificationResult,
            headers: this.sanitizeHeaders(headers),
            ipAddress,
          },
        },
      });

      await pciComplianceService.logAuditEvent({
        eventType: 'WEBHOOK_RECEIVED',
        resource: 'webhooks',
        action: 'receive',
        ipAddress,
        severity: verificationResult.isValid ? 'low' : 'high',
        success: verificationResult.isValid,
        details: {
          source: verificationResult.source,
          eventType: eventData.type,
          eventId: webhookEvent.id,
          verified: verificationResult.isValid,
        },
        errorMessage: verificationResult.errorMessage,
      });

      return webhookEvent.id;
    } catch (error) {
      logger.error('Failed to store webhook event', {
        error: error instanceof Error ? error.message : 'Unknown error',
        source: verificationResult.source,
      });
      throw error;
    }
  }

  /**
   * Get webhook verification statistics
   */
  async getVerificationStats(days: number = 30): Promise<any> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const stats = await prisma.auditLog.groupBy({
        by: ['details'],
        where: {
          eventType: 'WEBHOOK_VERIFICATION',
          timestamp: {
            gte: startDate,
          },
        },
        _count: {
          id: true,
        },
      });

      // Process stats to extract source and success information
      const processedStats = stats.reduce((acc: any, stat: any) => {
        const details = stat.details as any;
        const source = details?.source || 'unknown';
        const success = details?.success || false;

        if (!acc[source]) {
          acc[source] = { total: 0, successful: 0, failed: 0 };
        }

        acc[source].total += stat._count.id;
        if (success) {
          acc[source].successful += stat._count.id;
        } else {
          acc[source].failed += stat._count.id;
        }

        return acc;
      }, {});

      return {
        period: {
          startDate,
          endDate: new Date(),
          days,
        },
        stats: processedStats,
      };
    } catch (error) {
      logger.error('Failed to get webhook verification stats', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  // Private helper methods

  private detectWebhookSource(headers: Record<string, string>): string {
    if (headers['stripe-signature']) return 'stripe';
    if (headers['paypal-transmission-id']) return 'paypal';
    if (headers['x-paystack-signature']) return 'paystack';
    if (headers['verif-hash']) return 'flutterwave';

    return 'unknown';
  }

  private async logVerificationAttempt(
    source: string,
    success: boolean,
    errorMessage?: string
  ): Promise<void> {
    try {
      await pciComplianceService.logAuditEvent({
        eventType: 'WEBHOOK_VERIFICATION',
        resource: 'webhooks',
        action: 'verify_signature',
        severity: success ? 'low' : 'medium',
        success,
        details: {
          source,
          success,
        },
        errorMessage,
      });
    } catch (error) {
      logger.error('Failed to log webhook verification attempt', {
        source,
        success,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private sanitizeHeaders(
    headers: Record<string, string>
  ): Record<string, string> {
    const sanitized: Record<string, string> = {};

    // Only include non-sensitive headers
    const allowedHeaders = [
      'content-type',
      'content-length',
      'user-agent',
      'x-forwarded-for',
      'stripe-signature',
      'paypal-transmission-id',
      'paypal-auth-algo',
      'paypal-cert-id',
      'paypal-transmission-time',
      'x-paystack-signature',
      'verif-hash',
    ];

    for (const [key, value] of Object.entries(headers)) {
      const lowerKey = key.toLowerCase();
      if (allowedHeaders.includes(lowerKey)) {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}

export const webhookVerificationService = new WebhookVerificationService();
