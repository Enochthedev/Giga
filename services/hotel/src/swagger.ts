/**
 * Swagger configuration for Hotel Service API
 */

import { Application } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotel Service API',
      version: '1.0.0',
      description: 'Comprehensive hotel booking and management service API',
      contact: {
        name: 'Platform Team',
        email: 'platform@example.com',
      },
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3003',
        description: 'Hotel Service API Server',
      },
    ],
    components: {
      schemas: {
        // Payment Schemas
        PaymentRequest: {
          type: 'object',
          required: ['bookingId', 'amount', 'currency', 'paymentMethod'],
          properties: {
            bookingId: {
              type: 'string',
              description: 'Booking ID for the payment',
            },
            amount: {
              type: 'number',
              minimum: 0.01,
              description: 'Payment amount',
            },
            currency: {
              type: 'string',
              enum: ['USD', 'EUR', 'GBP', 'CAD'],
              description: 'Payment currency',
            },
            paymentMethod: {
              $ref: '#/components/schemas/PaymentMethodDetails',
            },
            description: {
              type: 'string',
              description: 'Payment description',
            },
            metadata: {
              type: 'object',
              description: 'Additional payment metadata',
            },
          },
        },
        PaymentMethodDetails: {
          type: 'object',
          required: ['type'],
          properties: {
            type: {
              type: 'string',
              enum: [
                'credit_card',
                'debit_card',
                'bank_transfer',
                'paypal',
                'apple_pay',
                'google_pay',
              ],
              description: 'Payment method type',
            },
            cardDetails: {
              $ref: '#/components/schemas/CardDetails',
            },
          },
        },
        CardDetails: {
          type: 'object',
          required: [
            'cardNumber',
            'expiryMonth',
            'expiryYear',
            'cvv',
            'cardholderName',
          ],
          properties: {
            cardNumber: {
              type: 'string',
              pattern: '^[0-9]{13,19}$',
              description: 'Credit card number',
            },
            expiryMonth: {
              type: 'integer',
              minimum: 1,
              maximum: 12,
              description: 'Card expiry month',
            },
            expiryYear: {
              type: 'integer',
              minimum: 2024,
              description: 'Card expiry year',
            },
            cvv: {
              type: 'string',
              pattern: '^[0-9]{3,4}$',
              description: 'Card CVV',
            },
            cardholderName: {
              type: 'string',
              description: 'Cardholder name',
            },
          },
        },
        PaymentResult: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Payment transaction ID',
            },
            status: {
              type: 'string',
              enum: [
                'pending',
                'processing',
                'authorized',
                'captured',
                'succeeded',
                'failed',
                'cancelled',
              ],
              description: 'Payment status',
            },
            amount: {
              type: 'number',
              description: 'Payment amount',
            },
            currency: {
              type: 'string',
              description: 'Payment currency',
            },
            transactionId: {
              type: 'string',
              description: 'Gateway transaction ID',
            },
            processedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Payment processing timestamp',
            },
            failureReason: {
              type: 'string',
              description: 'Failure reason if payment failed',
            },
          },
        },
        DepositRequest: {
          type: 'object',
          required: ['bookingId', 'depositType', 'paymentMethod'],
          properties: {
            bookingId: {
              type: 'string',
              description: 'Booking ID for the deposit',
            },
            depositType: {
              type: 'string',
              enum: [
                'fixed_amount',
                'percentage',
                'first_night',
                'full_amount',
                'no_deposit',
              ],
              description: 'Type of deposit calculation',
            },
            amount: {
              type: 'number',
              minimum: 0,
              description: 'Fixed deposit amount (for fixed_amount type)',
            },
            percentage: {
              type: 'number',
              minimum: 0,
              maximum: 100,
              description: 'Deposit percentage (for percentage type)',
            },
            paymentMethod: {
              $ref: '#/components/schemas/PaymentMethodDetails',
            },
            description: {
              type: 'string',
              description: 'Deposit description',
            },
          },
        },
        DepositCalculation: {
          type: 'object',
          properties: {
            amount: {
              type: 'number',
              description: 'Calculated deposit amount',
            },
            currency: {
              type: 'string',
              description: 'Deposit currency',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Deposit due date',
            },
            type: {
              type: 'string',
              enum: [
                'fixed_amount',
                'percentage',
                'first_night',
                'full_amount',
                'no_deposit',
              ],
              description: 'Deposit type used for calculation',
            },
            description: {
              type: 'string',
              description: 'Deposit description',
            },
          },
        },
        RefundRequest: {
          type: 'object',
          required: ['paymentId', 'bookingId', 'amount', 'reason'],
          properties: {
            paymentId: {
              type: 'string',
              description: 'Original payment ID to refund',
            },
            bookingId: {
              type: 'string',
              description: 'Booking ID for the refund',
            },
            amount: {
              type: 'number',
              minimum: 0.01,
              description: 'Refund amount',
            },
            reason: {
              type: 'string',
              enum: [
                'cancellation',
                'modification',
                'no_show_policy',
                'overbooking',
                'service_issue',
              ],
              description: 'Reason for refund',
            },
            description: {
              type: 'string',
              description: 'Refund description',
            },
          },
        },
        RefundResult: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Refund transaction ID',
            },
            paymentId: {
              type: 'string',
              description: 'Original payment ID',
            },
            amount: {
              type: 'number',
              description: 'Refund amount',
            },
            currency: {
              type: 'string',
              description: 'Refund currency',
            },
            status: {
              type: 'string',
              enum: [
                'pending',
                'processing',
                'succeeded',
                'failed',
                'cancelled',
              ],
              description: 'Refund status',
            },
            reason: {
              type: 'string',
              description: 'Refund reason',
            },
            processedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Refund processing timestamp',
            },
            estimatedArrival: {
              type: 'string',
              format: 'date-time',
              description: 'Estimated refund arrival date',
            },
          },
        },
        PaymentSchedule: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Payment schedule ID',
            },
            bookingId: {
              type: 'string',
              description: 'Associated booking ID',
            },
            totalAmount: {
              type: 'number',
              description: 'Total amount to be paid',
            },
            currency: {
              type: 'string',
              description: 'Payment currency',
            },
            status: {
              type: 'string',
              enum: ['active', 'completed', 'cancelled', 'overdue', 'failed'],
              description: 'Payment schedule status',
            },
            payments: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ScheduledPayment',
              },
            },
          },
        },
        ScheduledPayment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Scheduled payment ID',
            },
            amount: {
              type: 'number',
              description: 'Payment amount',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Payment due date',
            },
            type: {
              type: 'string',
              enum: [
                'deposit',
                'balance',
                'installment',
                'penalty',
                'fee',
                'tax',
              ],
              description: 'Payment type',
            },
            status: {
              type: 'string',
              enum: [
                'pending',
                'processing',
                'succeeded',
                'failed',
                'cancelled',
              ],
              description: 'Payment status',
            },
            description: {
              type: 'string',
              description: 'Payment description',
            },
          },
        },
        // Pricing Schemas
        PriceCalculation: {
          type: 'object',
          properties: {
            baseAmount: {
              type: 'number',
              description: 'Base amount before discounts and taxes',
            },
            discountAmount: {
              type: 'number',
              description: 'Total discount amount',
            },
            taxAmount: {
              type: 'number',
              description: 'Total tax amount',
            },
            feeAmount: {
              type: 'number',
              description: 'Total fee amount',
            },
            totalAmount: {
              type: 'number',
              description: 'Final total amount',
            },
            currency: {
              type: 'string',
              description: 'Currency code',
            },
            breakdown: {
              $ref: '#/components/schemas/PriceBreakdown',
            },
            nightlyRates: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/NightlyRate',
              },
            },
            appliedPromotions: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/AppliedPromotion',
              },
            },
            validUntil: {
              type: 'string',
              format: 'date-time',
              description: 'Price validity expiration',
            },
          },
        },
        PriceBreakdown: {
          type: 'object',
          properties: {
            roomCharges: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/RoomCharge',
              },
            },
            taxes: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/TaxItem',
              },
            },
            fees: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/FeeItem',
              },
            },
            discounts: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/DiscountItem',
              },
            },
            subtotal: {
              type: 'number',
            },
            total: {
              type: 'number',
            },
          },
        },
        RoomCharge: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              format: 'date',
            },
            roomTypeId: {
              type: 'string',
            },
            baseRate: {
              type: 'number',
            },
            adjustedRate: {
              type: 'number',
            },
            adjustmentReason: {
              type: 'string',
            },
            quantity: {
              type: 'integer',
            },
            totalAmount: {
              type: 'number',
            },
          },
        },
        TaxItem: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            type: {
              type: 'string',
              enum: [
                'city_tax',
                'tourism_tax',
                'vat',
                'gst',
                'service_tax',
                'occupancy_tax',
                'resort_tax',
              ],
            },
            rate: {
              type: 'number',
            },
            amount: {
              type: 'number',
            },
            isInclusive: {
              type: 'boolean',
            },
            description: {
              type: 'string',
            },
          },
        },
        FeeItem: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            type: {
              type: 'string',
              enum: [
                'resort_fee',
                'cleaning_fee',
                'service_fee',
                'booking_fee',
                'parking_fee',
                'wifi_fee',
                'pet_fee',
              ],
            },
            amount: {
              type: 'number',
            },
            isOptional: {
              type: 'boolean',
            },
            perNight: {
              type: 'boolean',
            },
            perRoom: {
              type: 'boolean',
            },
            description: {
              type: 'string',
            },
          },
        },
        DiscountItem: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            type: {
              type: 'string',
              enum: [
                'percentage',
                'fixed_amount',
                'early_bird',
                'last_minute',
                'extended_stay',
                'loyalty',
              ],
            },
            amount: {
              type: 'number',
            },
            percentage: {
              type: 'number',
            },
            code: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
          },
        },
        NightlyRate: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              format: 'date',
            },
            baseRate: {
              type: 'number',
            },
            adjustedRate: {
              type: 'number',
            },
            adjustments: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/RateAdjustment',
              },
            },
            finalRate: {
              type: 'number',
            },
          },
        },
        RateAdjustment: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: [
                'seasonal',
                'demand_based',
                'occupancy_based',
                'advance_booking',
                'length_of_stay',
              ],
            },
            name: {
              type: 'string',
            },
            amount: {
              type: 'number',
            },
            percentage: {
              type: 'number',
            },
            reason: {
              type: 'string',
            },
          },
        },
        AppliedPromotion: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            code: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            discountAmount: {
              type: 'number',
            },
            discountPercentage: {
              type: 'number',
            },
            conditions: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        // Seasonal Pricing Schemas
        CreateSeasonalRateRequest: {
          type: 'object',
          required: [
            'propertyId',
            'name',
            'description',
            'startDate',
            'endDate',
            'roomTypeRates',
          ],
          properties: {
            propertyId: {
              type: 'string',
              description: 'Property ID',
            },
            name: {
              type: 'string',
              description: 'Seasonal rate name',
            },
            description: {
              type: 'string',
              description: 'Seasonal rate description',
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Season start date',
            },
            endDate: {
              type: 'string',
              format: 'date',
              description: 'Season end date',
            },
            roomTypeRates: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/SeasonalRoomTypeRate',
              },
            },
            priority: {
              type: 'integer',
              minimum: 0,
              description: 'Priority level (higher number = higher priority)',
            },
          },
        },
        UpdateSeasonalRateRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            startDate: {
              type: 'string',
              format: 'date',
            },
            endDate: {
              type: 'string',
              format: 'date',
            },
            roomTypeRates: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/SeasonalRoomTypeRate',
              },
            },
            priority: {
              type: 'integer',
              minimum: 0,
            },
            isActive: {
              type: 'boolean',
            },
          },
        },
        SeasonalRoomTypeRate: {
          type: 'object',
          required: ['roomTypeId', 'adjustmentType', 'adjustmentValue'],
          properties: {
            roomTypeId: {
              type: 'string',
              description: 'Room type ID',
            },
            adjustmentType: {
              type: 'string',
              enum: ['percentage', 'fixed_amount', 'multiplier', 'set_rate'],
              description: 'Type of adjustment',
            },
            adjustmentValue: {
              type: 'number',
              description: 'Adjustment value',
            },
            minimumRate: {
              type: 'number',
              minimum: 0,
              description: 'Minimum rate after adjustment',
            },
            maximumRate: {
              type: 'number',
              minimum: 0,
              description: 'Maximum rate after adjustment',
            },
          },
        },
        // Dynamic Pricing Schemas
        CreateDynamicPricingRuleRequest: {
          type: 'object',
          required: [
            'propertyId',
            'name',
            'description',
            'type',
            'conditions',
            'adjustments',
            'validFrom',
            'validTo',
          ],
          properties: {
            propertyId: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            type: {
              type: 'string',
              enum: [
                'occupancy_based',
                'demand_based',
                'competitor_based',
                'seasonal',
                'event_based',
                'advance_booking',
                'length_of_stay',
                'day_of_week',
              ],
            },
            priority: {
              type: 'integer',
              minimum: 0,
            },
            conditions: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/PricingCondition',
              },
            },
            adjustments: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/PricingAdjustment',
              },
            },
            validFrom: {
              type: 'string',
              format: 'date-time',
            },
            validTo: {
              type: 'string',
              format: 'date-time',
            },
            applicableRoomTypes: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        PricingCondition: {
          type: 'object',
          required: ['type', 'operator', 'value'],
          properties: {
            type: {
              type: 'string',
              enum: [
                'occupancy_rate',
                'advance_booking_days',
                'length_of_stay',
                'day_of_week',
                'season',
                'demand_score',
                'competitor_rate',
                'booking_pace',
              ],
            },
            operator: {
              type: 'string',
              enum: [
                'equals',
                'not_equals',
                'greater_than',
                'greater_than_or_equal',
                'less_than',
                'less_than_or_equal',
                'in',
                'not_in',
                'between',
              ],
            },
            value: {
              oneOf: [
                { type: 'number' },
                { type: 'string' },
                { type: 'boolean' },
                { type: 'array' },
              ],
            },
            description: {
              type: 'string',
            },
          },
        },
        PricingAdjustment: {
          type: 'object',
          required: ['type', 'method', 'value'],
          properties: {
            type: {
              type: 'string',
              enum: [
                'seasonal',
                'demand_based',
                'occupancy_based',
                'advance_booking',
                'length_of_stay',
                'day_of_week',
              ],
            },
            method: {
              type: 'string',
              enum: ['percentage', 'fixed_amount', 'multiplier', 'set_rate'],
            },
            value: {
              type: 'number',
            },
            maxAdjustment: {
              type: 'number',
              description: 'Maximum adjustment percentage',
            },
            minRate: {
              type: 'number',
              minimum: 0,
            },
            maxRate: {
              type: 'number',
              minimum: 0,
            },
          },
        },
        // Promotion Schemas
        CreatePromotionRequest: {
          type: 'object',
          required: [
            'propertyId',
            'name',
            'description',
            'type',
            'discountType',
            'discountValue',
            'validFrom',
            'validTo',
            'conditions',
          ],
          properties: {
            propertyId: {
              type: 'string',
            },
            code: {
              type: 'string',
              description:
                'Promotion code (optional for auto-applicable promotions)',
            },
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            type: {
              type: 'string',
              enum: [
                'public',
                'private',
                'loyalty',
                'corporate',
                'group',
                'flash_sale',
              ],
            },
            discountType: {
              type: 'string',
              enum: ['percentage', 'fixed_amount'],
            },
            discountValue: {
              type: 'number',
              minimum: 0,
            },
            maxDiscount: {
              type: 'number',
              minimum: 0,
            },
            validFrom: {
              type: 'string',
              format: 'date-time',
            },
            validTo: {
              type: 'string',
              format: 'date-time',
            },
            conditions: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/PromotionCondition',
              },
            },
            maxTotalUsage: {
              type: 'integer',
              minimum: 1,
            },
            maxUsagePerGuest: {
              type: 'integer',
              minimum: 1,
            },
          },
        },
        PromotionCondition: {
          type: 'object',
          required: ['type', 'value'],
          properties: {
            type: {
              type: 'string',
              enum: [
                'minimum_stay',
                'advance_booking',
                'booking_window',
                'room_types',
                'guest_type',
                'booking_source',
                'minimum_amount',
                'blackout_dates',
              ],
            },
            value: {
              oneOf: [
                { type: 'number' },
                { type: 'string' },
                { type: 'array' },
              ],
            },
            description: {
              type: 'string',
            },
          },
        },
        // Error Schemas
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                },
                message: {
                  type: 'string',
                },
                details: {
                  type: 'object',
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Pricing',
        description: 'Price calculation and management',
      },
      {
        name: 'Seasonal Pricing',
        description: 'Seasonal rate management',
      },
      {
        name: 'Dynamic Pricing',
        description: 'Dynamic pricing rules management',
      },
      {
        name: 'Promotions',
        description: 'Promotion and discount management',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: Application): void {
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Hotel Service API Documentation',
    })
  );

  // Serve raw OpenAPI spec
  app.get('/api/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
}

export default specs;
