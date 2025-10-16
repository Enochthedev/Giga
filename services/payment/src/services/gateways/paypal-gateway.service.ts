import { Decimal } from '../../lib/decimal';
import { logger } from '../../lib/logger';
import {
  GatewayConfig,
  GatewayStatus,
  PaymentGateway,
  WebhookEvent,
} from '../../types/gateway.types';
import {
  PaymentMethod,
  PaymentRequest,
  PaymentResponse,
  Refund,
} from '../../types/payment.types';

export class PayPalGateway extends PaymentGateway {
  constructor(config: GatewayConfig) {
    super(config);
    logger.info('PayPal gateway initialized', { gatewayId: this.getId() });
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      logger.info('Processing PayPal payment', {
        gatewayId: this.getId(),
        amount: request.amount,
        currency: request.currency,
      });

      await this.simulateApiCall();

      const response: PaymentResponse = {
        id: `paypal_${Date.now()}`,
        status: 'succeeded',
        amount: new Decimal(request.amount),
        currency: request.currency,
        confirmationUrl: `https://www.paypal.com/checkoutnow?token=EC${Date.now()}`,
        requiresAction: false,
        metadata: request.metadata || {},
        createdAt: new Date(),
      };

      logger.info('PayPal payment processed successfully', {
        gatewayId: this.getId(),
        paymentId: response.id,
      });

      return response;
    } catch (error) {
      logger.error('PayPal payment processing failed', {
        gatewayId: this.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async capturePayment(
    transactionId: string,
    amount?: number
  ): Promise<PaymentResponse> {
    try {
      logger.info('Capturing PayPal payment', {
        gatewayId: this.getId(),
        transactionId,
        amount,
      });

      await this.simulateApiCall();

      const response: PaymentResponse = {
        id: transactionId,
        status: 'succeeded',
        amount: new Decimal(amount || 0),
        currency: 'USD',
        metadata: {},
        createdAt: new Date(),
      };

      logger.info('PayPal payment captured successfully', {
        gatewayId: this.getId(),
        transactionId,
      });

      return response;
    } catch (error) {
      logger.error('PayPal payment capture failed', {
        gatewayId: this.getId(),
        transactionId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async cancelPayment(transactionId: string): Promise<PaymentResponse> {
    try {
      logger.info('Canceling PayPal payment', {
        gatewayId: this.getId(),
        transactionId,
      });

      await this.simulateApiCall();

      const response: PaymentResponse = {
        id: transactionId,
        status: 'cancelled',
        amount: new Decimal(0),
        currency: 'USD',
        metadata: {},
        createdAt: new Date(),
      };

      logger.info('PayPal payment canceled successfully', {
        gatewayId: this.getId(),
        transactionId,
      });

      return response;
    } catch (error) {
      logger.error('PayPal payment cancellation failed', {
        gatewayId: this.getId(),
        transactionId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async refundPayment(
    transactionId: string,
    amount?: number,
    reason?: string
  ): Promise<Refund> {
    try {
      logger.info('Processing PayPal refund', {
        gatewayId: this.getId(),
        transactionId,
        amount,
        reason,
      });

      await this.simulateApiCall();

      const refund: Refund = {
        id: `paypal_refund_${Date.now()}`,
        transactionId,
        amount: new Decimal(amount || 0),
        currency: 'USD',
        reason: reason || 'requested_by_customer',
        status: 'succeeded',
        processedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      logger.info('PayPal refund processed successfully', {
        gatewayId: this.getId(),
        refundId: refund.id,
      });

      return refund;
    } catch (error) {
      logger.error('PayPal refund processing failed', {
        gatewayId: this.getId(),
        transactionId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async createPaymentMethod(data: any): Promise<PaymentMethod> {
    try {
      logger.info('Creating PayPal payment method', {
        gatewayId: this.getId(),
        type: data.type,
      });

      await this.simulateApiCall();

      const paymentMethod: PaymentMethod = {
        id: `paypal_pm_${Date.now()}`,
<<<<<<< HEAD
        userId: data.userId || '',
        type: 'digital_wallet',
        provider: 'paypal',
        token: `paypal_token_${Date.now()}`,
        isDefault: data.isDefault || false,
        isActive: true,
        metadata: {
          walletType: 'paypal',
          ...data.metadata,
        },
=======
        type: 'digital_wallet',
        customerId: data.customerId,
        isDefault: data.isDefault || false,
        metadata: { ...data.metadata, provider: 'paypal' },
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      logger.info('PayPal payment method created successfully', {
        gatewayId: this.getId(),
        paymentMethodId: paymentMethod.id,
      });

      return paymentMethod;
    } catch (error) {
      logger.error('PayPal payment method creation failed', {
        gatewayId: this.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async updatePaymentMethod(id: string, data: any): Promise<PaymentMethod> {
    try {
      logger.info('Updating PayPal payment method', {
        gatewayId: this.getId(),
        paymentMethodId: id,
      });

      await this.simulateApiCall();

      const paymentMethod: PaymentMethod = {
        id,
<<<<<<< HEAD
        userId: data.userId || '',
        type: 'digital_wallet',
        provider: 'paypal',
        token: `paypal_token_${id}`,
        isDefault: data.isDefault || false,
        isActive: true,
        metadata: {
          walletType: 'paypal',
          ...data.metadata,
        },
=======
        type: 'digital_wallet',
        customerId: data.customerId,
        isDefault: data.isDefault || false,
        metadata: { ...data.metadata, provider: 'paypal' },
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(),
      };

      logger.info('PayPal payment method updated successfully', {
        gatewayId: this.getId(),
        paymentMethodId: id,
      });

      return paymentMethod;
    } catch (error) {
      logger.error('PayPal payment method update failed', {
        gatewayId: this.getId(),
        paymentMethodId: id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async deletePaymentMethod(id: string): Promise<void> {
    try {
      logger.info('Deleting PayPal payment method', {
        gatewayId: this.getId(),
        paymentMethodId: id,
      });

      await this.simulateApiCall();

      logger.info('PayPal payment method deleted successfully', {
        gatewayId: this.getId(),
        paymentMethodId: id,
      });
    } catch (error) {
      logger.error('PayPal payment method deletion failed', {
        gatewayId: this.getId(),
        paymentMethodId: id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async getPaymentMethod(id: string): Promise<PaymentMethod> {
    try {
      logger.info('Retrieving PayPal payment method', {
        gatewayId: this.getId(),
        paymentMethodId: id,
      });

      await this.simulateApiCall();

      const paymentMethod: PaymentMethod = {
        id,
<<<<<<< HEAD
        userId: 'paypal_user_example',
        type: 'digital_wallet',
        provider: 'paypal',
        token: `paypal_token_${id}`,
        isDefault: false,
        isActive: true,
        metadata: { walletType: 'paypal' },
=======
        type: 'digital_wallet',
        customerId: 'paypal_customer_example',
        isDefault: false,
        metadata: { provider: 'paypal' },
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(),
      };

      logger.info('PayPal payment method retrieved successfully', {
        gatewayId: this.getId(),
        paymentMethodId: id,
      });

      return paymentMethod;
    } catch (error) {
      logger.error('PayPal payment method retrieval failed', {
        gatewayId: this.getId(),
        paymentMethodId: id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  verifyWebhook(payload: string, signature: string): boolean {
    try {
      // Simulate PayPal webhook signature verification
      // In a real implementation, this would use PayPal's webhook verification
      return signature.length > 10 && payload.length > 0;
    } catch (error) {
      logger.error('PayPal webhook verification failed', {
        gatewayId: this.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  parseWebhook(payload: string): WebhookEvent {
    try {
      const data = JSON.parse(payload);

      const webhookEvent: WebhookEvent = {
        id: `paypal_evt_${Date.now()}`,
        type: data.event_type || 'PAYMENT.CAPTURE.COMPLETED',
        gatewayId: this.getId(),
        gatewayEventId: data.id || `paypal_${Date.now()}`,
        data: data.resource || {},
        timestamp: new Date(),
        processed: false,
        retryCount: 0,
        metadata: { source: 'paypal' },
      };

      logger.info('PayPal webhook parsed successfully', {
        gatewayId: this.getId(),
        eventType: webhookEvent.type,
        eventId: webhookEvent.id,
      });

      return webhookEvent;
    } catch (error) {
      logger.error('PayPal webhook parsing failed', {
        gatewayId: this.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      logger.debug('Performing PayPal health check', {
        gatewayId: this.getId(),
      });

      await this.simulateApiCall(150);

      // Simulate 93% success rate (slightly lower than Stripe)
      const isHealthy = Math.random() > 0.07;

      logger.debug('PayPal health check completed', {
        gatewayId: this.getId(),
        isHealthy,
      });

      return isHealthy;
    } catch (error) {
      logger.error('PayPal health check failed', {
        gatewayId: this.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  async getStatus(): Promise<GatewayStatus> {
    try {
      const isHealthy = await this.healthCheck();
      return isHealthy ? 'active' : 'error';
    } catch (error) {
      logger.error('Failed to get PayPal gateway status', {
        gatewayId: this.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return 'error';
    }
  }

  private async simulateApiCall(delay = 250): Promise<void> {
    // Simulate network delay (PayPal typically slower than Stripe)
    await new Promise(resolve =>
      setTimeout(resolve, delay + Math.random() * 150)
    );

    // Simulate occasional API errors (7% failure rate)
    if (Math.random() < 0.07) {
      throw new Error('Simulated PayPal API error');
    }
  }
}
