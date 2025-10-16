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

export class SquareGateway extends PaymentGateway {
  constructor(config: GatewayConfig) {
    super(config);
    logger.info('Square gateway initialized', { gatewayId: this.getId() });
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      logger.info('Processing Square payment', {
        gatewayId: this.getId(),
        amount: request.amount,
        currency: request.currency,
      });

      await this.simulateApiCall();

      const response: PaymentResponse = {
        id: `square_${Date.now()}`,
        status: 'succeeded',
        amount: new Decimal(request.amount),
        currency: request.currency,
        metadata: request.metadata || {},
        createdAt: new Date(),
      };

      logger.info('Square payment processed successfully', {
        gatewayId: this.getId(),
        paymentId: response.id,
      });

      return response;
    } catch (error) {
      logger.error('Square payment processing failed', {
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
      logger.info('Capturing Square payment', {
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

      logger.info('Square payment captured successfully', {
        gatewayId: this.getId(),
        transactionId,
      });

      return response;
    } catch (error) {
      logger.error('Square payment capture failed', {
        gatewayId: this.getId(),
        transactionId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async cancelPayment(transactionId: string): Promise<PaymentResponse> {
    try {
      logger.info('Canceling Square payment', {
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

      logger.info('Square payment canceled successfully', {
        gatewayId: this.getId(),
        transactionId,
      });

      return response;
    } catch (error) {
      logger.error('Square payment cancellation failed', {
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
      logger.info('Processing Square refund', {
        gatewayId: this.getId(),
        transactionId,
        amount,
        reason,
      });

      await this.simulateApiCall();

      const refund: Refund = {
        id: `square_refund_${Date.now()}`,
        transactionId,
        amount: new Decimal(amount || 0),
        currency: 'USD',
        reason: reason || 'requested_by_customer',
        status: 'succeeded',
        processedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      logger.info('Square refund processed successfully', {
        gatewayId: this.getId(),
        refundId: refund.id,
      });

      return refund;
    } catch (error) {
      logger.error('Square refund processing failed', {
        gatewayId: this.getId(),
        transactionId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async createPaymentMethod(data: any): Promise<PaymentMethod> {
    try {
      logger.info('Creating Square payment method', {
        gatewayId: this.getId(),
        type: data.type,
      });

      await this.simulateApiCall();

      const paymentMethod: PaymentMethod = {
        id: `square_pm_${Date.now()}`,
<<<<<<< HEAD
        userId: data.userId || '',
        type: data.type || 'card',
        provider: 'square',
        token: `square_token_${Date.now()}`,
        isDefault: data.isDefault || false,
        isActive: true,
        metadata: {
          brand: 'visa',
          last4: '4242',
          ...data.metadata,
        },
=======
        type: data.type || 'card',
        customerId: data.customerId,
        isDefault: data.isDefault || false,
        metadata: { ...data.metadata, provider: 'square' },
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      logger.info('Square payment method created successfully', {
        gatewayId: this.getId(),
        paymentMethodId: paymentMethod.id,
      });

      return paymentMethod;
    } catch (error) {
      logger.error('Square payment method creation failed', {
        gatewayId: this.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async updatePaymentMethod(id: string, data: any): Promise<PaymentMethod> {
    try {
      logger.info('Updating Square payment method', {
        gatewayId: this.getId(),
        paymentMethodId: id,
      });

      await this.simulateApiCall();

      const paymentMethod: PaymentMethod = {
        id,
<<<<<<< HEAD
        userId: data.userId || '',
        type: data.type || 'card',
        provider: 'square',
        token: `square_token_${id}`,
        isDefault: data.isDefault || false,
        isActive: true,
=======
        type: data.type || 'card',
        customerId: data.customerId,
        isDefault: data.isDefault || false,
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
        metadata: { ...data.metadata, provider: 'square' },
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(),
      };

      logger.info('Square payment method updated successfully', {
        gatewayId: this.getId(),
        paymentMethodId: id,
      });

      return paymentMethod;
    } catch (error) {
      logger.error('Square payment method update failed', {
        gatewayId: this.getId(),
        paymentMethodId: id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async deletePaymentMethod(id: string): Promise<void> {
    try {
      logger.info('Deleting Square payment method', {
        gatewayId: this.getId(),
        paymentMethodId: id,
      });

      await this.simulateApiCall();

      logger.info('Square payment method deleted successfully', {
        gatewayId: this.getId(),
        paymentMethodId: id,
      });
    } catch (error) {
      logger.error('Square payment method deletion failed', {
        gatewayId: this.getId(),
        paymentMethodId: id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async getPaymentMethod(id: string): Promise<PaymentMethod> {
    try {
      logger.info('Retrieving Square payment method', {
        gatewayId: this.getId(),
        paymentMethodId: id,
      });

      await this.simulateApiCall();

      const paymentMethod: PaymentMethod = {
        id,
<<<<<<< HEAD
        userId: 'square_user_example',
        type: 'card',
        provider: 'square',
        token: `square_token_${id}`,
        isDefault: false,
        isActive: true,
        metadata: {
          brand: 'visa',
          last4: '4242',
        },
=======
        type: 'card',
        customerId: 'square_customer_example',
        isDefault: false,
        metadata: { provider: 'square' },
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(),
      };

      logger.info('Square payment method retrieved successfully', {
        gatewayId: this.getId(),
        paymentMethodId: id,
      });

      return paymentMethod;
    } catch (error) {
      logger.error('Square payment method retrieval failed', {
        gatewayId: this.getId(),
        paymentMethodId: id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  verifyWebhook(payload: string, signature: string): boolean {
    try {
      // Simulate Square webhook signature verification
      // In a real implementation, this would use Square's webhook verification
      return (
        signature.length > 10 &&
        payload.length > 0 &&
        signature.startsWith('square_')
      );
    } catch (error) {
      logger.error('Square webhook verification failed', {
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
        id: `square_evt_${Date.now()}`,
        type: data.type || 'payment.updated',
        gatewayId: this.getId(),
        gatewayEventId: data.event_id || `square_${Date.now()}`,
        data: data.data || {},
        timestamp: new Date(),
        processed: false,
        retryCount: 0,
        metadata: { source: 'square' },
      };

      logger.info('Square webhook parsed successfully', {
        gatewayId: this.getId(),
        eventType: webhookEvent.type,
        eventId: webhookEvent.id,
      });

      return webhookEvent;
    } catch (error) {
      logger.error('Square webhook parsing failed', {
        gatewayId: this.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      logger.debug('Performing Square health check', {
        gatewayId: this.getId(),
      });

      await this.simulateApiCall(180);

      // Simulate 91% success rate
      const isHealthy = Math.random() > 0.09;

      logger.debug('Square health check completed', {
        gatewayId: this.getId(),
        isHealthy,
      });

      return isHealthy;
    } catch (error) {
      logger.error('Square health check failed', {
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
      logger.error('Failed to get Square gateway status', {
        gatewayId: this.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return 'error';
    }
  }

  private async simulateApiCall(delay = 220): Promise<void> {
    // Simulate network delay
    await new Promise(resolve =>
      setTimeout(resolve, delay + Math.random() * 120)
    );

    // Simulate occasional API errors (9% failure rate)
    if (Math.random() < 0.09) {
      throw new Error('Simulated Square API error');
    }
  }
}
