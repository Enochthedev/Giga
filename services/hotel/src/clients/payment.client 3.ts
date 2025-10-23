/**
 * Payment Service Client for Hotel Service
 * Integrates with the existing payment service
 */

import axios, { AxiosInstance } from 'axios';
import {
  PaymentRequest as HotelPaymentRequest,
  PaymentResult as HotelPaymentResult,
  PaymentStatus as HotelPaymentStatus,
  RefundRequest as HotelRefundRequest,
  RefundResult as HotelRefundResult,
  RefundReason,
  RefundStatus,
} from '../types/payment.types';

// Payment service types (imported from payment service)
interface PaymentServiceRequest {
  amount: number;
  currency: string;
  description?: string;
  userId?: string;
  merchantId?: string;
  paymentMethodId?: string;
  paymentMethodData?: {
    type: string;
    token?: string;
    card?: {
      number: string;
      expiryMonth: number;
      expiryYear: number;
      cvc: string;
      holderName: string;
    };
    billingAddress?: {
      line1: string;
      line2?: string;
      city: string;
      state?: string;
      postalCode: string;
      country: string;
    };
  };
  metadata?: Record<string, any>;
  internalReference?: string;
  externalReference?: string;
  options?: {
    captureMethod?: 'automatic' | 'manual';
    confirmationMethod?: 'automatic' | 'manual';
    savePaymentMethod?: boolean;
    setupFutureUsage?: 'on_session' | 'off_session';
    statementDescriptor?: string;
  };
}

interface PaymentServiceResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  clientSecret?: string;
  confirmationUrl?: string;
  requiresAction?: boolean;
  nextAction?: {
    type: string;
    redirectUrl?: string;
    useStripeSdk?: boolean;
  };
  paymentMethod?: {
    id: string;
    type: string;
    metadata: Record<string, any>;
  };
  gatewayId?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
}

interface RefundServiceRequest {
  amount?: number;
  reason?: string;
  metadata?: Record<string, any>;
}

interface RefundServiceResponse {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  reason: string;
  status: string;
  gatewayRefundId?: string;
  metadata?: Record<string, any>;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export class PaymentServiceClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl || process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004';

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      config => {
        console.log(
          `Payment Service Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      error => {
        console.error('Payment Service Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        console.error(
          'Payment Service Response Error:',
          error.response?.data || error.message
        );
        return Promise.reject(error);
      }
    );
  }

  /**
   * Process a payment through the payment service
   */
  async processPayment(
    request: HotelPaymentRequest
  ): Promise<HotelPaymentResult> {
    try {
      const paymentServiceRequest: PaymentServiceRequest = {
        amount: request.amount,
        currency: request.currency,
        description: request.description,
        userId: this.extractUserIdFromBooking(request.bookingId),
        merchantId: 'hotel-service', // Hotel service acts as merchant
        paymentMethodData: this.convertPaymentMethod(request.paymentMethod),
        metadata: {
          // Service identification
          service: 'hotel',
          serviceVersion: '1.0.0',

          // Hotel-specific information
          bookingId: request.bookingId,
          source: 'hotel-service',

          // Additional context
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',

          // Original metadata
          ...request.metadata,
        },
        internalReference: request.idempotencyKey,
        options: {
          captureMethod: 'automatic',
          savePaymentMethod: false,
          statementDescriptor: 'Hotel Booking',
        },
      };

      const response = await this.client.post<{
        success: boolean;
        data: PaymentServiceResponse;
      }>('/api/payments/process', paymentServiceRequest);

      if (!response.data.success) {
        throw new Error('Payment processing failed');
      }

      return this.convertToHotelPaymentResult(response.data.data);
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw new Error(
        `Payment processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Authorize a payment (without capturing)
   */
  async authorizePayment(
    request: HotelPaymentRequest
  ): Promise<HotelPaymentResult> {
    try {
      const paymentServiceRequest: PaymentServiceRequest = {
        amount: request.amount,
        currency: request.currency,
        description: request.description,
        userId: this.extractUserIdFromBooking(request.bookingId),
        merchantId: 'hotel-service',
        paymentMethodData: this.convertPaymentMethod(request.paymentMethod),
        metadata: {
          // Service identification
          service: 'hotel',
          serviceVersion: '1.0.0',

          // Hotel-specific information
          bookingId: request.bookingId,
          source: 'hotel-service',

          // Additional context
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',

          // Original metadata
          ...request.metadata,
        },
        internalReference: request.idempotencyKey,
        options: {
          captureMethod: 'manual', // Manual capture for authorization
          savePaymentMethod: false,
          statementDescriptor: 'Hotel Booking Auth',
        },
      };

      const response = await this.client.post<{
        success: boolean;
        data: PaymentServiceResponse;
      }>('/api/payments/process', paymentServiceRequest);

      if (!response.data.success) {
        throw new Error('Payment authorization failed');
      }

      return this.convertToHotelPaymentResult(response.data.data);
    } catch (error) {
      console.error('Payment authorization failed:', error);
      throw new Error(
        `Payment authorization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Capture a previously authorized payment
   */
  async capturePayment(
    paymentId: string,
    amount?: number
  ): Promise<HotelPaymentResult> {
    try {
      const captureRequest = amount ? { amount } : {};

      const response = await this.client.post<{
        success: boolean;
        data: PaymentServiceResponse;
      }>(`/api/payments/${paymentId}/capture`, captureRequest);

      if (!response.data.success) {
        throw new Error('Payment capture failed');
      }

      return this.convertToHotelPaymentResult(response.data.data);
    } catch (error) {
      console.error('Payment capture failed:', error);
      throw new Error(
        `Payment capture failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Void a payment
   */
  async voidPayment(paymentId: string): Promise<HotelPaymentResult> {
    try {
      const response = await this.client.post<{
        success: boolean;
        data: PaymentServiceResponse;
      }>(`/api/payments/${paymentId}/void`);

      if (!response.data.success) {
        throw new Error('Payment void failed');
      }

      return this.convertToHotelPaymentResult(response.data.data);
    } catch (error) {
      console.error('Payment void failed:', error);
      throw new Error(
        `Payment void failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<HotelPaymentResult> {
    try {
      const response = await this.client.get<{
        success: boolean;
        data: PaymentServiceResponse;
      }>(`/api/payments/${paymentId}`);

      if (!response.data.success) {
        throw new Error('Failed to get payment status');
      }

      return this.convertToHotelPaymentResult(response.data.data);
    } catch (error) {
      console.error('Get payment status failed:', error);
      throw new Error(
        `Get payment status failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Process a refund
   */
  async refundPayment(request: HotelRefundRequest): Promise<HotelRefundResult> {
    try {
      const refundServiceRequest: RefundServiceRequest = {
        amount: request.amount,
        reason: this.convertRefundReason(request.reason),
        metadata: {
          // Service identification
          service: 'hotel',
          serviceVersion: '1.0.0',

          // Hotel-specific information
          bookingId: request.bookingId,
          source: 'hotel-service',

          // Additional context
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',

          // Original metadata
          ...request.metadata,
        },
      };

      const response = await this.client.post<{
        success: boolean;
        data: RefundServiceResponse;
      }>(`/api/payments/${request.paymentId}/refund`, refundServiceRequest);

      if (!response.data.success) {
        throw new Error('Refund processing failed');
      }

      return this.convertToHotelRefundResult(
        response.data.data,
        request.paymentId
      );
    } catch (error) {
      console.error('Refund processing failed:', error);
      throw new Error(
        `Refund processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get refund status
   */
  async getRefundStatus(refundId: string): Promise<HotelRefundResult> {
    try {
      const response = await this.client.get<{
        success: boolean;
        data: RefundServiceResponse;
      }>(`/api/refunds/${refundId}`);

      if (!response.data.success) {
        throw new Error('Failed to get refund status');
      }

      return this.convertToHotelRefundResult(
        response.data.data,
        response.data.data.transactionId
      );
    } catch (error) {
      console.error('Get refund status failed:', error);
      throw new Error(
        `Get refund status failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Create a payment method for a user
   */
  async createPaymentMethod(
    userId: string,
    paymentMethodData: any
  ): Promise<any> {
    try {
      const response = await this.client.post<{ success: boolean; data: any }>(
        '/api/payment-methods',
        {
          userId,
          ...paymentMethodData,
        }
      );

      if (!response.data.success) {
        throw new Error('Payment method creation failed');
      }

      return response.data.data;
    } catch (error) {
      console.error('Payment method creation failed:', error);
      throw new Error(
        `Payment method creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get user payment methods
   */
  async getUserPaymentMethods(userId: string): Promise<any[]> {
    try {
      const response = await this.client.get<{ success: boolean; data: any[] }>(
        `/api/payment-methods/users/${userId}`
      );

      if (!response.data.success) {
        throw new Error('Failed to get user payment methods');
      }

      return response.data.data;
    } catch (error) {
      console.error('Get user payment methods failed:', error);
      throw new Error(
        `Get user payment methods failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Private helper methods
  private convertPaymentMethod(paymentMethod: any): any {
    if (paymentMethod.cardDetails) {
      return {
        type: 'card',
        card: {
          number: paymentMethod.cardDetails.cardNumber,
          expiryMonth: paymentMethod.cardDetails.expiryMonth,
          expiryYear: paymentMethod.cardDetails.expiryYear,
          cvc: paymentMethod.cardDetails.cvv,
          holderName: paymentMethod.cardDetails.cardholderName,
        },
        billingAddress: paymentMethod.cardDetails.billingAddress
          ? {
              line1: paymentMethod.cardDetails.billingAddress.street,
              city: paymentMethod.cardDetails.billingAddress.city,
              state: paymentMethod.cardDetails.billingAddress.state,
              postalCode: paymentMethod.cardDetails.billingAddress.postalCode,
              country: paymentMethod.cardDetails.billingAddress.country,
            }
          : undefined,
      };
    }

    // Handle other payment method types
    return {
      type: paymentMethod.type,
      token: paymentMethod.token,
    };
  }

  private convertToHotelPaymentResult(
    paymentResponse: PaymentServiceResponse
  ): HotelPaymentResult {
    return {
      id: paymentResponse.id,
      status: this.convertPaymentStatus(paymentResponse.status),
      amount:
        typeof paymentResponse.amount === 'number'
          ? paymentResponse.amount
          : parseFloat(String(paymentResponse.amount || 0)),
      currency: paymentResponse.currency,
      transactionId: paymentResponse.id,
      gatewayResponse: {
        gatewayId: paymentResponse.gatewayId || 'unknown',
        transactionId: paymentResponse.id,
        responseCode: '00',
        responseMessage: 'Success',
        rawResponse: paymentResponse,
      },
      processedAt: paymentResponse.createdAt
        ? new Date(paymentResponse.createdAt)
        : new Date(),
      metadata: paymentResponse.metadata,
    };
  }

  private convertToHotelRefundResult(
    refundResponse: RefundServiceResponse,
    paymentId: string
  ): HotelRefundResult {
    return {
      id: refundResponse.id,
      paymentId: paymentId,
      amount:
        typeof refundResponse.amount === 'number'
          ? refundResponse.amount
          : parseFloat(String(refundResponse.amount || 0)),
      currency: refundResponse.currency,
      status: this.convertRefundStatus(refundResponse.status),
      reason: this.convertToHotelRefundReason(refundResponse.reason),
      transactionId: refundResponse.gatewayRefundId,
      processedAt: refundResponse.processedAt
        ? new Date(refundResponse.processedAt)
        : undefined,
      estimatedArrival: this.calculateRefundArrivalDate(),
    };
  }

  private convertPaymentStatus(status: string): HotelPaymentStatus {
    const statusMap: Record<string, HotelPaymentStatus> = {
      pending: HotelPaymentStatus.PENDING,
      processing: HotelPaymentStatus.PROCESSING,
      succeeded: HotelPaymentStatus.SUCCEEDED,
      failed: HotelPaymentStatus.FAILED,
      cancelled: HotelPaymentStatus.CANCELLED,
      expired: HotelPaymentStatus.EXPIRED,
      requires_action: HotelPaymentStatus.REQUIRES_ACTION,
    };

    return statusMap[status] || HotelPaymentStatus.PENDING;
  }

  private convertRefundStatus(status: string): RefundStatus {
    const statusMap: Record<string, RefundStatus> = {
      pending: RefundStatus.PENDING,
      processing: RefundStatus.PROCESSING,
      succeeded: RefundStatus.SUCCEEDED,
      failed: RefundStatus.FAILED,
      cancelled: RefundStatus.CANCELLED,
      refunded: RefundStatus.SUCCEEDED,
    };

    return statusMap[status] || RefundStatus.PENDING;
  }

  private convertRefundReason(reason: RefundReason): string {
    const reasonMap: Record<RefundReason, string> = {
      [RefundReason.CANCELLATION]: 'Customer cancellation',
      [RefundReason.MODIFICATION]: 'Booking modification',
      [RefundReason.NO_SHOW_POLICY]: 'No-show policy',
      [RefundReason.OVERBOOKING]: 'Hotel overbooking',
      [RefundReason.SERVICE_ISSUE]: 'Service issue',
      [RefundReason.DUPLICATE_PAYMENT]: 'Duplicate payment',
      [RefundReason.FRAUD]: 'Fraud prevention',
      [RefundReason.CUSTOMER_REQUEST]: 'Customer request',
      [RefundReason.SYSTEM_ERROR]: 'System error',
    };

    return reasonMap[reason] || 'Customer request';
  }

  private convertToHotelRefundReason(reason: string): RefundReason {
    const reasonMap: Record<string, RefundReason> = {
      'Customer cancellation': RefundReason.CANCELLATION,
      'Booking modification': RefundReason.MODIFICATION,
      'No-show policy': RefundReason.NO_SHOW_POLICY,
      'Hotel overbooking': RefundReason.OVERBOOKING,
      'Service issue': RefundReason.SERVICE_ISSUE,
      'Duplicate payment': RefundReason.DUPLICATE_PAYMENT,
      'Fraud prevention': RefundReason.FRAUD,
      'Customer request': RefundReason.CUSTOMER_REQUEST,
      'System error': RefundReason.SYSTEM_ERROR,
    };

    return reasonMap[reason] || RefundReason.CUSTOMER_REQUEST;
  }

  private extractUserIdFromBooking(bookingId: string): string {
    // In a real implementation, you would fetch the booking and get the user ID
    // For now, we'll use a placeholder
    return `user_from_booking_${bookingId}`;
  }

  private calculateRefundArrivalDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 5); // 5 business days
    return date;
  }
}
