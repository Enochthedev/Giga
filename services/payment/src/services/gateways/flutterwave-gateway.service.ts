import { Decimal } from '../../lib/decimal';
import { logger } from '../../lib/logger';
import { GatewayConfig, WebhookEvent } from '../../types/gateway.types';
import {
  PaymentMethod,
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
  Refund,
} from '../../types/payment.types';
import { BaseGateway } from './base-gateway.service';

/**
 * Flutterwave Gateway Template - TODO: Implement actual Flutterwave integration
 */
export class FlutterwaveGateway extends BaseGateway {
  constructor(config: GatewayConfig) {
    super(config);
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    logger.info('Flutterwave payment (TEMPLATE)', { amount: request.amount });

    return {
      id: `flw_template_${Date.now()}`,
      status: 'pending' as PaymentStatus,
      amount: new Decimal(request.amount),
      currency: request.currency.toUpperCase(),
      gatewayId: this.getId(),
      createdAt: new Date(),
    };
  }

  async capturePayment(
    transactionId: string,
    amount?: number
  ): Promise<PaymentResponse> {
    logger.info('Flutterwave capture (TEMPLATE)', { transactionId });

    return {
      id: transactionId,
      status: 'succeeded' as PaymentStatus,
      amount: new Decimal(amount || 100),
      currency: 'USD',
      gatewayId: this.getId(),
      createdAt: new Date(),
    };
  }

  async cancelPayment(transactionId: string): Promise<PaymentResponse> {
    logger.info('Flutterwave cancel (TEMPLATE)', { transactionId });

    return {
      id: transactionId,
      status: 'cancelled' as PaymentStatus,
      amount: new Decimal(0),
      currency: 'USD',
      gatewayId: this.getId(),
      createdAt: new Date(),
    };
  }

  async refundPayment(
    transactionId: string,
    amount?: number,
    reason?: string
  ): Promise<Refund> {
    logger.info('Flutterwave refund (TEMPLATE)', { transactionId });

    return {
      id: `flw_refund_${Date.now()}`,
      transactionId,
      amount: new Decimal(amount || 100),
      currency: 'USD',
      reason: reason || 'requested_by_customer',
      status: 'succeeded' as PaymentStatus,
      processedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async createPaymentMethod(data: any): Promise<PaymentMethod> {
    return {
      id: `flw_pm_${Date.now()}`,
      userId: data.userId || '',
      type: 'card',
      provider: 'flutterwave',
      token: `flw_token_${Date.now()}`,
      isDefault: false,
      isActive: true,
      metadata: { last4: '4187', brand: 'visa' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async updatePaymentMethod(id: string, data: any): Promise<PaymentMethod> {
    return this.createPaymentMethod({ ...data, id });
  }

  async deletePaymentMethod(id: string): Promise<void> {
    logger.info('Flutterwave delete PM (TEMPLATE)', { id });
  }

  async getPaymentMethod(id: string): Promise<PaymentMethod> {
    return this.createPaymentMethod({ id });
  }

  verifyWebhook(payload: string, signature: string): boolean {
    return true; // TODO: Implement actual verification
  }

  parseWebhook(payload: string): WebhookEvent {
    return {
      id: `flw_evt_${Date.now()}`,
      type: 'charge.completed',
      gatewayId: this.getId(),
      gatewayEventId: `flw_evt_${Date.now()}`,
      data: {},
      timestamp: new Date(),
      processed: false,
      retryCount: 0,
    };
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }

  async getStatus(): Promise<'active' | 'inactive' | 'maintenance' | 'error'> {
    return 'active';
  }
}
