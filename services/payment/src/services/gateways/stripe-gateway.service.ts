<<<<<<< HEAD
// TODO: Install and import Stripe SDK
// import Stripe from 'stripe';
import { Decimal } from '../../lib/decimal';
import { logger } from '../../lib/logger';
import { GatewayConfig, WebhookEvent } from '../../types/gateway.types';
import {
  PaymentMethod,
=======
import Stripe from 'stripe';
import { Decimal } from '../../lib/decimal';
import { logger } from '../../lib/logger';
import {
  GatewayConfig,
  GatewayStatus,
  WebhookEvent,
} from '../../types/gateway.types';
import {
  PaymentMethod,
  PaymentMethodType,
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
  Refund,
} from '../../types/payment.types';
import { BaseGateway } from './base-gateway.service';

<<<<<<< HEAD
/**
 * Stripe Gateway Template Implementation
 *
 * TODO: Replace mock implementations with actual Stripe SDK integration
 * 1. Install Stripe SDK: pnpm add stripe
 * 2. Import Stripe types and client
 * 3. Implement real payment processing
 * 4. Add proper error handling for Stripe-specific errors
 * 5. Implement webhook signature verification
 */
export class StripeGateway extends BaseGateway {
  // TODO: Initialize actual Stripe client
  // private stripe: Stripe;
=======
export class StripeGateway extends BaseGateway {
  private stripe: Stripe;
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03

  constructor(config: GatewayConfig) {
    super(config);

<<<<<<< HEAD
    // TODO: Initialize Stripe with secret key
    // this.stripe = new Stripe(config.credentials.secretKey, {
    //   apiVersion: '2023-10-16',
    // });
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      logger.info('Processing Stripe payment (TEMPLATE)', {
        amount: request.amount,
        currency: request.currency,
      });

      // TODO: Replace with actual Stripe PaymentIntent creation
      const response: PaymentResponse = {
        id: `pi_template_${Date.now()}`,
        status: 'pending' as PaymentStatus,
        amount: new Decimal(request.amount),
        currency: request.currency.toUpperCase(),
        clientSecret: `pi_template_${Date.now()}_secret`,
        requiresAction: false,
        gatewayId: this.getId(),
        metadata: {
          template: true,
          note: 'Replace with actual Stripe implementation',
        },
        createdAt: new Date(),
      };

      return response;
    } catch (error) {
      logger.error('Stripe payment processing failed', { error });
      throw error;
    }
=======
    // Initialize Stripe client
    const secretKey = config.credentials.secretKey;
    if (!secretKey) {
      throw new Error('Stripe secret key is required');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    });

    logger.info('Stripe gateway initialized', {
      gatewayId: this.getId(),
      apiVersion: '2023-10-16',
    });
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    return this.executeWithRetry(async () => {
      this.validatePaymentRequest(request);

      this.logOperation('processPayment', {
        amount: request.amount,
        currency: request.currency,
        paymentMethodId: request.paymentMethodId,
      });

      try {
        // Convert amount to cents for Stripe
        const amountInCents = Math.round(request.amount * 100);

        // Create payment intent parameters
        const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
          amount: amountInCents,
          currency: request.currency.toLowerCase(),
          description: request.description,
          metadata: {
            userId: request.userId || '',
            merchantId: request.merchantId || '',
            internalReference: request.internalReference || '',
            externalReference: request.externalReference || '',
            ...request.metadata,
          },
        };

        // Handle payment method
        if (request.paymentMethodId) {
          paymentIntentParams.payment_method = request.paymentMethodId;
          paymentIntentParams.confirmation_method =
            request.options?.confirmationMethod || 'automatic';
          paymentIntentParams.confirm =
            request.options?.confirmationMethod !== 'manual';
        } else if (request.paymentMethodData?.card) {
          // Create payment method from card data
          const paymentMethod = await this.stripe.paymentMethods.create({
            type: 'card',
            card: {
              number: request.paymentMethodData.card.number,
              exp_month: request.paymentMethodData.card.expiryMonth,
              exp_year: request.paymentMethodData.card.expiryYear,
              cvc: request.paymentMethodData.card.cvc,
            },
            billing_details: {
              name: request.paymentMethodData.card.holderName,
              address: request.paymentMethodData.billingAddress
                ? {
                    line1: request.paymentMethodData.billingAddress.line1,
                    line2: request.paymentMethodData.billingAddress.line2,
                    city: request.paymentMethodData.billingAddress.city,
                    state: request.paymentMethodData.billingAddress.state,
                    postal_code:
                      request.paymentMethodData.billingAddress.postalCode,
                    country: request.paymentMethodData.billingAddress.country,
                  }
                : undefined,
            },
          });

          paymentIntentParams.payment_method = paymentMethod.id;
          paymentIntentParams.confirmation_method = 'automatic';
          paymentIntentParams.confirm = true;
        }

        // Set capture method
        if (request.options?.captureMethod) {
          paymentIntentParams.capture_method = request.options.captureMethod;
        }

        // Set setup future usage
        if (request.options?.setupFutureUsage) {
          paymentIntentParams.setup_future_usage =
            request.options.setupFutureUsage;
        }

        // Set statement descriptor
        if (request.options?.statementDescriptor) {
          paymentIntentParams.statement_descriptor =
            request.options.statementDescriptor;
        }

        // Create payment intent
        const paymentIntent =
          await this.stripe.paymentIntents.create(paymentIntentParams);

        // Map Stripe status to our status
        const status = this.mapStripeStatus(paymentIntent.status);

        const response: PaymentResponse = {
          id: paymentIntent.id,
          status,
          amount: new Decimal(paymentIntent.amount / 100),
          currency: paymentIntent.currency.toUpperCase(),
          clientSecret: paymentIntent.client_secret || undefined,
          requiresAction: paymentIntent.status === 'requires_action',
          nextAction: paymentIntent.next_action
            ? {
                type: paymentIntent.next_action.type,
                redirectUrl: paymentIntent.next_action.redirect_to_url?.url,
                useStripeSdk:
                  paymentIntent.next_action.use_stripe_sdk?.type ===
                  'three_d_secure_redirect',
              }
            : undefined,
          paymentMethod: paymentIntent.payment_method
            ? {
                id:
                  typeof paymentIntent.payment_method === 'string'
                    ? paymentIntent.payment_method
                    : paymentIntent.payment_method.id,
                type: 'card', // Default to card for now
                metadata: {},
              }
            : undefined,
          metadata: paymentIntent.metadata,
          createdAt: new Date(paymentIntent.created * 1000),
        };

        this.logOperation('processPayment completed', {
          paymentId: response.id,
          status: response.status,
          stripeStatus: paymentIntent.status,
        });

        return response;
      } catch (error) {
        this.logError(
          'processPayment',
          error instanceof Error ? error : new Error('Unknown error'),
          {
            amount: request.amount,
            currency: request.currency,
          }
        );
        throw this.createGatewayError(
          error instanceof Error ? error : new Error('Unknown error'),
          'processPayment'
        );
      }
    }, 'processPayment');
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
  }

  async capturePayment(
    transactionId: string,
    amount?: number
  ): Promise<PaymentResponse> {
<<<<<<< HEAD
    try {
      logger.info('Capturing Stripe payment (TEMPLATE)', {
=======
    return this.executeWithRetry(async () => {
      this.logOperation('capturePayment', {
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
        transactionId,
        amount,
      });

<<<<<<< HEAD
      // TODO: Implement actual Stripe payment capture
      const response: PaymentResponse = {
        id: transactionId,
        status: 'succeeded' as PaymentStatus,
        amount: new Decimal(amount || 100),
        currency: 'USD',
        gatewayId: this.getId(),
        createdAt: new Date(),
      };

      return response;
    } catch (error) {
      logger.error('Stripe payment capture failed', { error });
      throw error;
    }
  }

  async cancelPayment(transactionId: string): Promise<PaymentResponse> {
    try {
      logger.info('Canceling Stripe payment (TEMPLATE)', { transactionId });

      // TODO: Implement actual Stripe payment cancellation
      const response: PaymentResponse = {
        id: transactionId,
        status: 'cancelled' as PaymentStatus,
        amount: new Decimal(0),
        currency: 'USD',
        gatewayId: this.getId(),
        createdAt: new Date(),
      };

      return response;
    } catch (error) {
      logger.error('Stripe payment cancellation failed', { error });
      throw error;
    }
=======
      try {
        const captureParams: Stripe.PaymentIntentCaptureParams = {};

        if (amount !== undefined) {
          captureParams.amount_to_capture = Math.round(amount * 100);
        }

        const paymentIntent = await this.stripe.paymentIntents.capture(
          transactionId,
          captureParams
        );

        const response: PaymentResponse = {
          id: paymentIntent.id,
          status: this.mapStripeStatus(paymentIntent.status),
          amount: new Decimal(paymentIntent.amount / 100),
          currency: paymentIntent.currency.toUpperCase(),
          metadata: paymentIntent.metadata,
          createdAt: new Date(paymentIntent.created * 1000),
        };

        this.logOperation('capturePayment completed', {
          transactionId,
          status: response.status,
        });

        return response;
      } catch (error) {
        this.logError(
          'capturePayment',
          error instanceof Error ? error : new Error('Unknown error'),
          {
            transactionId,
            amount,
          }
        );
        throw this.createGatewayError(
          error instanceof Error ? error : new Error('Unknown error'),
          'capturePayment'
        );
      }
    }, 'capturePayment');
  }

  async cancelPayment(transactionId: string): Promise<PaymentResponse> {
    return this.executeWithRetry(async () => {
      this.logOperation('cancelPayment', {
        transactionId,
      });

      try {
        const paymentIntent =
          await this.stripe.paymentIntents.cancel(transactionId);

        const response: PaymentResponse = {
          id: paymentIntent.id,
          status: this.mapStripeStatus(paymentIntent.status),
          amount: new Decimal(paymentIntent.amount / 100),
          currency: paymentIntent.currency.toUpperCase(),
          metadata: paymentIntent.metadata,
          createdAt: new Date(paymentIntent.created * 1000),
        };

        this.logOperation('cancelPayment completed', {
          transactionId,
          status: response.status,
        });

        return response;
      } catch (error) {
        this.logError(
          'cancelPayment',
          error instanceof Error ? error : new Error('Unknown error'),
          {
            transactionId,
          }
        );
        throw this.createGatewayError(
          error instanceof Error ? error : new Error('Unknown error'),
          'cancelPayment'
        );
      }
    }, 'cancelPayment');
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
  }

  async refundPayment(
    transactionId: string,
    amount?: number,
    reason?: string
  ): Promise<Refund> {
<<<<<<< HEAD
    try {
      logger.info('Processing Stripe refund (TEMPLATE)', {
=======
    return this.executeWithRetry(async () => {
      this.logOperation('refundPayment', {
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
        transactionId,
        amount,
        reason,
      });

<<<<<<< HEAD
      // TODO: Implement actual Stripe refund
      const refund: Refund = {
        id: `re_template_${Date.now()}`,
        transactionId,
        amount: new Decimal(amount || 100),
        currency: 'USD',
        reason: reason || 'requested_by_customer',
        status: 'succeeded' as PaymentStatus,
        gatewayRefundId: `re_template_${Date.now()}`,
        metadata: {
          template: true,
          note: 'Replace with actual Stripe implementation',
        },
        processedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return refund;
    } catch (error) {
      logger.error('Stripe refund failed', { error });
      throw error;
    }
  }

  async createPaymentMethod(data: any): Promise<PaymentMethod> {
    try {
      logger.info('Creating Stripe payment method (TEMPLATE)', { data });

      // TODO: Implement actual Stripe PaymentMethod creation
      const paymentMethod: PaymentMethod = {
        id: `pm_template_${Date.now()}`,
        userId: data.userId || '',
        type: 'card',
        provider: 'stripe',
        token: `pm_template_${Date.now()}`,
        isDefault: data.isDefault || false,
        isActive: true,
        metadata: {
          last4: '4242',
          brand: 'visa',
          expiryMonth: 12,
          expiryYear: 2025,
          holderName: data.card?.holderName || 'Template User',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return paymentMethod;
    } catch (error) {
      logger.error('Stripe payment method creation failed', { error });
      throw error;
    }
  }

  async updatePaymentMethod(id: string, data: any): Promise<PaymentMethod> {
    try {
      logger.info('Updating Stripe payment method (TEMPLATE)', { id, data });

      // TODO: Implement actual Stripe PaymentMethod update
      const paymentMethod: PaymentMethod = {
        id,
        userId: data.userId || '',
        type: 'card',
        provider: 'stripe',
        token: `pm_template_${id}`,
        isDefault: data.isDefault || false,
        isActive: true,
        metadata: {
          last4: '4242',
          brand: 'visa',
          expiryMonth: 12,
          expiryYear: 2025,
          holderName: 'Updated Template User',
        },
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(),
      };

      return paymentMethod;
    } catch (error) {
      logger.error('Stripe payment method update failed', { error });
      throw error;
    }
  }

  async deletePaymentMethod(id: string): Promise<void> {
    try {
      logger.info('Deleting Stripe payment method (TEMPLATE)', { id });

      // TODO: Implement actual Stripe PaymentMethod deletion
      logger.info('Stripe payment method deleted (template)', { id });
    } catch (error) {
      logger.error('Stripe payment method deletion failed', { error });
      throw error;
    }
  }

  async getPaymentMethod(id: string): Promise<PaymentMethod> {
    try {
      logger.info('Retrieving Stripe payment method (TEMPLATE)', { id });

      // TODO: Implement actual Stripe PaymentMethod retrieval
      const paymentMethod: PaymentMethod = {
        id,
        userId: 'template_user_id',
        type: 'card',
        provider: 'stripe',
        token: `pm_template_${id}`,
        isDefault: false,
        isActive: true,
        metadata: {
          last4: '4242',
          brand: 'visa',
          expiryMonth: 12,
          expiryYear: 2025,
          holderName: 'Template User',
        },
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(),
      };

      return paymentMethod;
    } catch (error) {
      logger.error('Stripe payment method retrieval failed', { error });
      throw error;
    }
=======
      try {
        const refundParams: Stripe.RefundCreateParams = {
          payment_intent: transactionId,
          reason: this.mapRefundReason(reason),
        };

        if (amount !== undefined) {
          refundParams.amount = Math.round(amount * 100);
        }

        const stripeRefund = await this.stripe.refunds.create(refundParams);

        const refund: Refund = {
          id: stripeRefund.id,
          transactionId,
          amount: new Decimal(stripeRefund.amount / 100),
          currency: stripeRefund.currency.toUpperCase(),
          reason: reason || 'requested_by_customer',
          status: this.mapStripeRefundStatus(stripeRefund.status),
          gatewayRefundId: stripeRefund.id,
          metadata: stripeRefund.metadata,
          processedAt:
            stripeRefund.status === 'succeeded'
              ? new Date(stripeRefund.created * 1000)
              : undefined,
          createdAt: new Date(stripeRefund.created * 1000),
          updatedAt: new Date(),
        };

        this.logOperation('refundPayment completed', {
          refundId: refund.id,
          status: refund.status,
        });

        return refund;
      } catch (error) {
        this.logError(
          'refundPayment',
          error instanceof Error ? error : new Error('Unknown error'),
          {
            transactionId,
            amount,
            reason,
          }
        );
        throw this.createGatewayError(
          error instanceof Error ? error : new Error('Unknown error'),
          'refundPayment'
        );
      }
    }, 'refundPayment');
  }

  async createPaymentMethod(data: any): Promise<PaymentMethod> {
    return this.executeWithRetry(async () => {
      this.logOperation('createPaymentMethod', {
        type: data.type,
        userId: data.userId,
      });

      try {
        const paymentMethodParams: Stripe.PaymentMethodCreateParams = {
          type: data.type || 'card',
        };

        if (data.type === 'card' && data.card) {
          paymentMethodParams.card = {
            number: data.card.number,
            exp_month: data.card.expiryMonth,
            exp_year: data.card.expiryYear,
            cvc: data.card.cvc,
          };
        }

        if (data.billingDetails) {
          paymentMethodParams.billing_details = {
            name: data.billingDetails.name,
            email: data.billingDetails.email,
            phone: data.billingDetails.phone,
            address: data.billingDetails.address
              ? {
                  line1: data.billingDetails.address.line1,
                  line2: data.billingDetails.address.line2,
                  city: data.billingDetails.address.city,
                  state: data.billingDetails.address.state,
                  postal_code: data.billingDetails.address.postalCode,
                  country: data.billingDetails.address.country,
                }
              : undefined,
          };
        }

        const stripePaymentMethod =
          await this.stripe.paymentMethods.create(paymentMethodParams);

        // Attach to customer if provided
        if (data.customerId) {
          await this.stripe.paymentMethods.attach(stripePaymentMethod.id, {
            customer: data.customerId,
          });
        }

        const paymentMethod: PaymentMethod = {
          id: stripePaymentMethod.id,
          userId: data.userId,
          type: this.mapStripePaymentMethodType(stripePaymentMethod.type),
          provider: 'stripe',
          token: stripePaymentMethod.id,
          isDefault: data.isDefault || false,
          metadata: {
            last4: stripePaymentMethod.card?.last4,
            brand: stripePaymentMethod.card?.brand,
            expiryMonth: stripePaymentMethod.card?.exp_month,
            expiryYear: stripePaymentMethod.card?.exp_year,
            holderName: stripePaymentMethod.billing_details?.name,
          },
          billingAddress: stripePaymentMethod.billing_details?.address
            ? {
                line1: stripePaymentMethod.billing_details.address.line1 || '',
                line2:
                  stripePaymentMethod.billing_details.address.line2 ||
                  undefined,
                city: stripePaymentMethod.billing_details.address.city || '',
                state:
                  stripePaymentMethod.billing_details.address.state ||
                  undefined,
                postalCode:
                  stripePaymentMethod.billing_details.address.postal_code || '',
                country:
                  stripePaymentMethod.billing_details.address.country || '',
              }
            : undefined,
          isActive: true,
          createdAt: new Date(stripePaymentMethod.created * 1000),
          updatedAt: new Date(),
        };

        this.logOperation('createPaymentMethod completed', {
          paymentMethodId: paymentMethod.id,
          type: paymentMethod.type,
        });

        return paymentMethod;
      } catch (error) {
        this.logError(
          'createPaymentMethod',
          error instanceof Error ? error : new Error('Unknown error'),
          {
            type: data.type,
          }
        );
        throw this.createGatewayError(
          error instanceof Error ? error : new Error('Unknown error'),
          'createPaymentMethod'
        );
      }
    }, 'createPaymentMethod');
  }

  async updatePaymentMethod(id: string, data: unknown): Promise<PaymentMethod> {
    return this.executeWithRetry(async () => {
      this.logOperation('updatePaymentMethod', {
        paymentMethodId: id,
      });

      try {
        const updateParams: Stripe.PaymentMethodUpdateParams = {};

        if (data.billingDetails) {
          updateParams.billing_details = {
            name: data.billingDetails.name,
            email: data.billingDetails.email,
            phone: data.billingDetails.phone,
            address: data.billingDetails.address
              ? {
                  line1: data.billingDetails.address.line1,
                  line2: data.billingDetails.address.line2,
                  city: data.billingDetails.address.city,
                  state: data.billingDetails.address.state,
                  postal_code: data.billingDetails.address.postalCode,
                  country: data.billingDetails.address.country,
                }
              : undefined,
          };
        }

        if (data.metadata) {
          updateParams.metadata = data.metadata;
        }

        const stripePaymentMethod = await this.stripe.paymentMethods.update(
          id,
          updateParams
        );

        const paymentMethod: PaymentMethod = {
          id: stripePaymentMethod.id,
          userId: data.userId || '',
          type: this.mapStripePaymentMethodType(stripePaymentMethod.type),
          provider: 'stripe',
          token: stripePaymentMethod.id,
          isDefault: data.isDefault || false,
          metadata: {
            last4: stripePaymentMethod.card?.last4,
            brand: stripePaymentMethod.card?.brand,
            expiryMonth: stripePaymentMethod.card?.exp_month,
            expiryYear: stripePaymentMethod.card?.exp_year,
            holderName: stripePaymentMethod.billing_details?.name,
          },
          billingAddress: stripePaymentMethod.billing_details?.address
            ? {
                line1: stripePaymentMethod.billing_details.address.line1 || '',
                line2:
                  stripePaymentMethod.billing_details.address.line2 ||
                  undefined,
                city: stripePaymentMethod.billing_details.address.city || '',
                state:
                  stripePaymentMethod.billing_details.address.state ||
                  undefined,
                postalCode:
                  stripePaymentMethod.billing_details.address.postal_code || '',
                country:
                  stripePaymentMethod.billing_details.address.country || '',
              }
            : undefined,
          isActive: true,
          createdAt: new Date(stripePaymentMethod.created * 1000),
          updatedAt: new Date(),
        };

        this.logOperation('updatePaymentMethod completed', {
          paymentMethodId: id,
        });

        return paymentMethod;
      } catch (error) {
        this.logError(
          'updatePaymentMethod',
          error instanceof Error ? error : new Error('Unknown error'),
          {
            paymentMethodId: id,
          }
        );
        throw this.createGatewayError(
          error instanceof Error ? error : new Error('Unknown error'),
          'updatePaymentMethod'
        );
      }
    }, 'updatePaymentMethod');
  }

  async deletePaymentMethod(id: string): Promise<void> {
    return this.executeWithRetry(async () => {
      this.logOperation('deletePaymentMethod', {
        paymentMethodId: id,
      });

      try {
        await this.stripe.paymentMethods.detach(id);

        this.logOperation('deletePaymentMethod completed', {
          paymentMethodId: id,
        });
      } catch (error) {
        this.logError(
          'deletePaymentMethod',
          error instanceof Error ? error : new Error('Unknown error'),
          {
            paymentMethodId: id,
          }
        );
        throw this.createGatewayError(
          error instanceof Error ? error : new Error('Unknown error'),
          'deletePaymentMethod'
        );
      }
    }, 'deletePaymentMethod');
  }

  async getPaymentMethod(id: string): Promise<PaymentMethod> {
    return this.executeWithRetry(async () => {
      this.logOperation('getPaymentMethod', {
        paymentMethodId: id,
      });

      try {
        const stripePaymentMethod =
          await this.stripe.paymentMethods.retrieve(id);

        const paymentMethod: PaymentMethod = {
          id: stripePaymentMethod.id,
          userId: '', // This would need to be retrieved from our database
          type: this.mapStripePaymentMethodType(stripePaymentMethod.type),
          provider: 'stripe',
          token: stripePaymentMethod.id,
          isDefault: false, // This would need to be retrieved from our database
          metadata: {
            last4: stripePaymentMethod.card?.last4,
            brand: stripePaymentMethod.card?.brand,
            expiryMonth: stripePaymentMethod.card?.exp_month,
            expiryYear: stripePaymentMethod.card?.exp_year,
            holderName: stripePaymentMethod.billing_details?.name,
          },
          billingAddress: stripePaymentMethod.billing_details?.address
            ? {
                line1: stripePaymentMethod.billing_details.address.line1 || '',
                line2:
                  stripePaymentMethod.billing_details.address.line2 ||
                  undefined,
                city: stripePaymentMethod.billing_details.address.city || '',
                state:
                  stripePaymentMethod.billing_details.address.state ||
                  undefined,
                postalCode:
                  stripePaymentMethod.billing_details.address.postal_code || '',
                country:
                  stripePaymentMethod.billing_details.address.country || '',
              }
            : undefined,
          isActive: true,
          createdAt: new Date(stripePaymentMethod.created * 1000),
          updatedAt: new Date(),
        };

        this.logOperation('getPaymentMethod completed', {
          paymentMethodId: id,
          type: paymentMethod.type,
        });

        return paymentMethod;
      } catch (error) {
        this.logError(
          'getPaymentMethod',
          error instanceof Error ? error : new Error('Unknown error'),
          {
            paymentMethodId: id,
          }
        );
        throw this.createGatewayError(
          error instanceof Error ? error : new Error('Unknown error'),
          'getPaymentMethod'
        );
      }
    }, 'getPaymentMethod');
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
  }

  verifyWebhook(payload: string, signature: string): boolean {
    try {
<<<<<<< HEAD
      // TODO: Implement actual Stripe webhook verification
      logger.info('Stripe webhook verification (TEMPLATE)', { signature });
      return true;
    } catch (error) {
      logger.error('Stripe webhook verification failed', { error });
=======
      const webhookSecret = this.config.credentials.webhookSecret;
      if (!webhookSecret) {
        logger.error('Webhook secret not configured for Stripe gateway', {
          gatewayId: this.getId(),
        });
        return false;
      }

      // Use Stripe's built-in webhook signature verification
      this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);

      logger.debug('Stripe webhook signature verified successfully', {
        gatewayId: this.getId(),
      });

      return true;
    } catch (error) {
      logger.error('Stripe webhook verification failed', {
        gatewayId: this.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
      return false;
    }
  }

  parseWebhook(payload: string): WebhookEvent {
    try {
<<<<<<< HEAD
      // TODO: Implement actual Stripe webhook parsing
      const mockEvent = JSON.parse(payload);
      return {
        id: `evt_template_${Date.now()}`,
        type: mockEvent.type || 'payment_intent.succeeded',
        gatewayId: this.getId(),
        gatewayEventId: mockEvent.id || `evt_template_${Date.now()}`,
        data: mockEvent.data || {},
        timestamp: new Date(),
        processed: false,
        retryCount: 0,
      };
    } catch (error) {
      logger.error('Stripe webhook parsing failed', { error });
=======
      const webhookSecret = this.config.credentials.webhookSecret;
      if (!webhookSecret) {
        throw new Error('Webhook secret not configured');
      }

      // Parse the Stripe event
      const stripeEvent = JSON.parse(payload) as Stripe.Event;

      const webhookEvent: WebhookEvent = {
        id: `stripe_${stripeEvent.id}`,
        type: this.mapStripeEventType(stripeEvent.type),
        gatewayId: this.getId(),
        gatewayEventId: stripeEvent.id,
        data: stripeEvent.data.object,
        timestamp: new Date(stripeEvent.created * 1000),
        processed: false,
        retryCount: 0,
        metadata: {
          stripeEventType: stripeEvent.type,
          livemode: stripeEvent.livemode,
          apiVersion: stripeEvent.api_version,
        },
      };

      logger.info('Stripe webhook parsed successfully', {
        gatewayId: this.getId(),
        eventType: webhookEvent.type,
        stripeEventType: stripeEvent.type,
        eventId: webhookEvent.id,
      });

      return webhookEvent;
    } catch (error) {
      logger.error('Stripe webhook parsing failed', {
        gatewayId: this.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
<<<<<<< HEAD
      // TODO: Implement actual Stripe health check
      logger.info('Stripe health check (TEMPLATE)');
      return true;
    } catch (error) {
      logger.error('Stripe health check failed', { error });
=======
      logger.debug('Performing Stripe health check', {
        gatewayId: this.getId(),
      });

      // Perform a simple API call to check connectivity
      // We'll retrieve the account information as a health check
      await this.stripe.accounts.retrieve();

      logger.debug('Stripe health check completed successfully', {
        gatewayId: this.getId(),
      });

      return true;
    } catch (error) {
      logger.error('Stripe health check failed', {
        gatewayId: this.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
      return false;
    }
  }

<<<<<<< HEAD
  async getStatus(): Promise<'active' | 'inactive' | 'maintenance' | 'error'> {
=======
  async getStatus(): Promise<GatewayStatus> {
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
    try {
      const isHealthy = await this.healthCheck();
      return isHealthy ? 'active' : 'error';
    } catch (error) {
<<<<<<< HEAD
      logger.error('Stripe status check failed', { error });
      return 'error';
    }
  }
=======
      logger.error('Failed to get Stripe gateway status', {
        gatewayId: this.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return 'error';
    }
  }

  /**
   * Maps Stripe payment intent status to our payment status
   */
  private mapStripeStatus(stripeStatus: string): PaymentStatus {
    switch (stripeStatus) {
      case 'requires_payment_method':
      case 'requires_confirmation':
      case 'requires_action':
        return 'pending';
      case 'processing':
        return 'processing';
      case 'succeeded':
        return 'succeeded';
      case 'canceled':
        return 'cancelled';
      default:
        return 'failed';
    }
  }

  /**
   * Maps Stripe refund status to our payment status
   */
  private mapStripeRefundStatus(stripeStatus: string): PaymentStatus {
    switch (stripeStatus) {
      case 'pending':
        return 'processing';
      case 'succeeded':
        return 'succeeded';
      case 'failed':
        return 'failed';
      case 'canceled':
        return 'cancelled';
      default:
        return 'failed';
    }
  }

  /**
   * Maps Stripe payment method type to our payment method type
   */
  private mapStripePaymentMethodType(stripeType: string): PaymentMethodType {
    switch (stripeType) {
      case 'card':
        return 'card';
      case 'us_bank_account':
      case 'sepa_debit':
        return 'bank_account';
      case 'klarna':
      case 'afterpay_clearpay':
        return 'buy_now_pay_later';
      default:
        return 'card';
    }
  }

  /**
   * Maps our refund reason to Stripe refund reason
   */
  private mapRefundReason(reason?: string): Stripe.RefundCreateParams.Reason {
    if (!reason) return 'requested_by_customer';

    switch (reason.toLowerCase()) {
      case 'duplicate':
        return 'duplicate';
      case 'fraudulent':
        return 'fraudulent';
      case 'requested_by_customer':
      default:
        return 'requested_by_customer';
    }
  }

  /**
   * Maps Stripe event types to our webhook event types
   */
  private mapStripeEventType(stripeEventType: string): string {
    const eventMap: Record<string, string> = {
      'payment_intent.succeeded': 'payment.succeeded',
      'payment_intent.payment_failed': 'payment.failed',
      'payment_intent.canceled': 'payment.cancelled',
      'charge.dispute.created': 'payment.disputed',
      'payment_method.attached': 'payment_method.created',
      'payment_method.updated': 'payment_method.updated',
      'payment_method.detached': 'payment_method.deleted',
      'customer.created': 'customer.created',
      'customer.updated': 'customer.updated',
      'customer.deleted': 'customer.deleted',
      'invoice.created': 'invoice.created',
      'invoice.paid': 'invoice.paid',
      'invoice.payment_failed': 'invoice.payment_failed',
      'invoice.upcoming': 'invoice.upcoming',
    };

    return eventMap[stripeEventType] || stripeEventType;
  }
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
}
