import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dummy Payment Service API',
      version: '1.0.0',
      description:
        'Dummy payment processing service for frontend development and testing',
      contact: {
        name: 'Giga Platform Team',
        email: 'dev@giga.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3003',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        PaymentIntent: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique payment intent identifier',
              example: 'pi_1234567890abcdef',
            },
            clientSecret: {
              type: 'string',
              description: 'Client secret for frontend integration',
              example: 'pi_1234567890abcdef_secret_12345678',
            },
            amount: {
              type: 'integer',
              description: 'Amount in cents',
              example: 2000,
            },
            currency: {
              type: 'string',
              description: 'Currency code',
              example: 'usd',
            },
            status: {
              type: 'string',
              enum: [
                'requires_payment_method',
                'requires_confirmation',
                'requires_action',
                'processing',
                'succeeded',
                'canceled',
              ],
              description: 'Payment intent status',
              example: 'requires_payment_method',
            },
            customerId: {
              type: 'string',
              description: 'Customer identifier',
              example: 'cust_1234567890',
            },
            metadata: {
              type: 'object',
              additionalProperties: {
                type: 'string',
              },
              description: 'Additional metadata',
              example: {
                orderId: 'order_123',
                checkoutId: 'checkout_456',
              },
            },
            created: {
              type: 'integer',
              description: 'Creation timestamp',
              example: 1640995200,
            },
          },
        },
        PaymentMethod: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique payment method identifier',
              example: 'pm_1234567890abcdef',
            },
            type: {
              type: 'string',
              enum: ['card', 'bank_account', 'wallet'],
              description: 'Payment method type',
              example: 'card',
            },
            card: {
              type: 'object',
              properties: {
                brand: {
                  type: 'string',
                  description: 'Card brand',
                  example: 'visa',
                },
                last4: {
                  type: 'string',
                  description: 'Last 4 digits of card',
                  example: '4242',
                },
                exp_month: {
                  type: 'integer',
                  description: 'Expiration month',
                  example: 12,
                },
                exp_year: {
                  type: 'integer',
                  description: 'Expiration year',
                  example: 2025,
                },
              },
            },
            created: {
              type: 'integer',
              description: 'Creation timestamp',
              example: 1640995200,
            },
          },
        },
        PaymentConfirmationResult: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the payment was successful',
              example: true,
            },
            paymentIntentId: {
              type: 'string',
              description: 'Payment intent identifier',
              example: 'pi_1234567890abcdef',
            },
            status: {
              type: 'string',
              description: 'Payment status',
              example: 'succeeded',
            },
            transactionId: {
              type: 'string',
              description: 'Transaction identifier',
              example: 'txn_1234567890abcdef',
            },
            paymentMethodId: {
              type: 'string',
              description: 'Payment method used',
              example: 'pm_1234567890abcdef',
            },
            error: {
              type: 'string',
              description: 'Error message if payment failed',
              example: 'Your card was declined.',
            },
          },
        },
        RefundResult: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the refund was successful',
              example: true,
            },
            refundId: {
              type: 'string',
              description: 'Refund identifier',
              example: 're_1234567890abcdef',
            },
            amount: {
              type: 'integer',
              description: 'Refunded amount in cents',
              example: 1000,
            },
            status: {
              type: 'string',
              enum: ['succeeded', 'failed'],
              description: 'Refund status',
              example: 'succeeded',
            },
            error: {
              type: 'string',
              description: 'Error message if refund failed',
              example: 'Refund failed. Please try again later.',
            },
          },
        },
        PaymentStatistics: {
          type: 'object',
          properties: {
            totalPayments: {
              type: 'integer',
              description: 'Total number of payment intents',
              example: 150,
            },
            successfulPayments: {
              type: 'integer',
              description: 'Number of successful payments',
              example: 135,
            },
            failedPayments: {
              type: 'integer',
              description: 'Number of failed payments',
              example: 15,
            },
            totalAmount: {
              type: 'integer',
              description: 'Total amount processed in cents',
              example: 270000,
            },
            averageAmount: {
              type: 'number',
              description: 'Average payment amount in cents',
              example: 2000,
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the request was successful',
              example: true,
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Operation completed successfully',
            },
            error: {
              type: 'string',
              description: 'Error message if request failed',
              example: 'Invalid request data',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Response timestamp',
              example: '2024-01-01T12:00:00.000Z',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Payment',
        description: 'Payment processing operations',
      },
      {
        name: 'Testing',
        description: 'Development and testing utilities',
      },
    ],
  },
  apis: ['./src/routes/dummy-payment.routes.ts'], // Path to the API routes
};

export const specs = swaggerJSDoc(options);
