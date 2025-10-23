import { IPaymentMethodService } from '../interfaces/payment.interface';
import { logger } from '../lib/logger';
import { prisma } from '../lib/prisma';
import { Address, PaymentMethod, PaymentMethodType } from '../types';
import { PaymentMethodNotFoundError, ValidationError } from '../utils/errors';
import { validateAddress } from '../utils/validation';
import {
  PaymentMethodTokenizationService,
  TokenizationRequest,
} from './payment-method-tokenization.service';
import {
  PaymentMethodVerificationService,
  VerificationMethod,
} from './payment-method-verification.service';

export interface CreatePaymentMethodRequest {
  userId: string;
  type: PaymentMethodType;
  sensitiveData: {
    card?: {
      number: string;
      expiryMonth: number;
      expiryYear: number;
      cvc: string;
      holderName: string;
    };
    bankAccount?: {
      accountNumber: string;
      routingNumber: string;
      accountType: 'checking' | 'savings';
      accountHolderName: string;
      bankName: string;
    };
    digitalWallet?: {
      walletType: 'paypal' | 'apple_pay' | 'google_pay' | 'amazon_pay';
      email?: string;
      phone?: string;
      walletId: string;
      accessToken?: string;
    };
  };
  billingAddress?: Address;
  isDefault?: boolean;
  autoVerify?: boolean;
  verificationMethod?: VerificationMethod;
  metadata?: Record<string, any>;
}

export interface PaymentMethodWithVerification extends PaymentMethod {
  verificationStatus: 'pending' | 'verified' | 'failed' | 'not_required';
  verificationMethod?: VerificationMethod;
  verificationWorkflowId?: string;
  lastVerificationAttempt?: Date;
}

/**
 * Comprehensive payment method management service
 * Integrates tokenization, verification, and CRUD operations
 */
export class PaymentMethodManager implements IPaymentMethodService {
  private tokenizationService: PaymentMethodTokenizationService;
  private verificationService: PaymentMethodVerificationService;

  constructor() {
    this.tokenizationService = new PaymentMethodTokenizationService();
    this.verificationService = new PaymentMethodVerificationService();
  }

  /**
   * Create a new payment method with tokenization and optional verification
   */
  async create(request: CreatePaymentMethodRequest): Promise<PaymentMethod> {
    try {
      logger.info('Creating payment method', {
        userId: request.userId,
        type: request.type,
        autoVerify: request.autoVerify,
      });

      // Validate billing address if provided
      if (request.billingAddress) {
        validateAddress(request.billingAddress);
      }

      // Tokenize sensitive data
      const tokenizationRequest: TokenizationRequest = {
        userId: request.userId,
        type: request.type,
        sensitiveData: request.sensitiveData,
        metadata: request.metadata,
      };

      const tokenizationResult =
        await this.tokenizationService.tokenize(tokenizationRequest);

      // If this is set as default, unset other default payment methods
      if (request.isDefault) {
        await this.unsetDefaultPaymentMethods(request.userId);
      }

      // Create payment method record
      const paymentMethod = await prisma.paymentMethod.create({
        data: {
          userId: request.userId,
          type: request.type,
          provider: this.getProviderForType(request.type),
          token: tokenizationResult.token,
          isDefault: request.isDefault || false,
          isActive: true,
          metadata: {
            ...tokenizationResult.displayData,
            fingerprint: tokenizationResult.fingerprint,
            encrypted: tokenizationResult.encryptedData.encrypted,
            iv: tokenizationResult.encryptedData.iv,
            tag: tokenizationResult.encryptedData.tag,
            salt: tokenizationResult.encryptedData.salt,
            createdAt: new Date().toISOString(),
            ...request.metadata,
          },
          billingAddress: request.billingAddress
            ? request.billingAddress
            : null,
        },
      });

      // Start verification if requested
      let verificationWorkflowId: string | undefined;
      if (request.autoVerify && request.verificationMethod) {
        try {
          const verificationWorkflow =
            await this.verificationService.startVerification(
              paymentMethod.id,
              request.userId,
              request.verificationMethod
            );
          verificationWorkflowId = verificationWorkflow.id;

          // Update payment method with verification workflow ID
          await prisma.paymentMethod.update({
            where: { id: paymentMethod.id },
            data: {
              metadata: {
                ...paymentMethod.metadata,
                verificationWorkflowId,
                verificationMethod: request.verificationMethod,
                verificationStarted: new Date().toISOString(),
              },
            },
          });
        } catch (verificationError) {
          logger.warn(
            'Failed to start verification, but payment method was created',
            {
              paymentMethodId: paymentMethod.id,
              error:
                verificationError instanceof Error
                  ? verificationError.message
                  : 'Unknown error',
            }
          );
        }
      }

      logger.info('Payment method created successfully', {
        paymentMethodId: paymentMethod.id,
        userId: request.userId,
        type: request.type,
        verificationWorkflowId,
      });

      return this.mapToPaymentMethod(paymentMethod);
    } catch (error) {
      logger.error('Failed to create payment method', {
        userId: request.userId,
        type: request.type,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Get payment method by ID
   */
  async getById(id: string): Promise<PaymentMethod> {
    try {
      const paymentMethod = await prisma.paymentMethod.findUnique({
        where: { id },
      });

      if (!paymentMethod) {
        throw new PaymentMethodNotFoundError(`Payment method ${id} not found`);
      }

      return this.mapToPaymentMethod(paymentMethod);
    } catch (error) {
      logger.error('Failed to get payment method', {
        error: error instanceof Error ? error.message : 'Unknown error',
        paymentMethodId: id,
      });
      throw error;
    }
  }

  /**
   * Get all payment methods for a user with verification status
   */
  async getByUserId(userId: string): Promise<PaymentMethodWithVerification[]> {
    try {
      const paymentMethods = await prisma.paymentMethod.findMany({
        where: {
          userId,
          isActive: true,
        },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      });

      const paymentMethodsWithVerification = await Promise.all(
        paymentMethods.map(async pm => {
          const basePaymentMethod = this.mapToPaymentMethod(pm);
          const verificationStatus = await this.getVerificationStatus(pm);

          return {
            ...basePaymentMethod,
            ...verificationStatus,
          } as PaymentMethodWithVerification;
        })
      );

      return paymentMethodsWithVerification;
    } catch (error) {
      logger.error('Failed to get user payment methods', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      throw error;
    }
  }

  /**
   * Update payment method
   */
  async update(
    id: string,
    data: Partial<CreatePaymentMethodRequest>
  ): Promise<PaymentMethod> {
    try {
      logger.info('Updating payment method', { paymentMethodId: id });

      const existingPaymentMethod = await prisma.paymentMethod.findUnique({
        where: { id },
      });

      if (!existingPaymentMethod) {
        throw new PaymentMethodNotFoundError(`Payment method ${id} not found`);
      }

      // Validate billing address if provided
      if (data.billingAddress) {
        validateAddress(data.billingAddress);
      }

      // If setting as default, unset other default payment methods
      if (data.isDefault) {
        await this.unsetDefaultPaymentMethods(existingPaymentMethod.userId);
      }

      const updateData: any = {};

      // Update billing address if provided
      if (data.billingAddress) {
        updateData.billingAddress = data.billingAddress;
      }

      // Update default status if provided
      if (data.isDefault !== undefined) {
        updateData.isDefault = data.isDefault;
      }

      // Update metadata if provided
      if (data.metadata) {
        const currentMetadata = existingPaymentMethod.metadata as any;
        updateData.metadata = {
          ...currentMetadata,
          ...data.metadata,
          updatedAt: new Date().toISOString(),
        };
      }

      const updatedPaymentMethod = await prisma.paymentMethod.update({
        where: { id },
        data: updateData,
      });

      logger.info('Payment method updated successfully', {
        paymentMethodId: id,
      });

      return this.mapToPaymentMethod(updatedPaymentMethod);
    } catch (error) {
      logger.error('Failed to update payment method', {
        error: error instanceof Error ? error.message : 'Unknown error',
        paymentMethodId: id,
      });
      throw error;
    }
  }

  /**
   * Delete (deactivate) payment method securely
   */
  async delete(id: string): Promise<void> {
    try {
      logger.info('Deleting payment method', { paymentMethodId: id });

      const paymentMethod = await prisma.paymentMethod.findUnique({
        where: { id },
      });

      if (!paymentMethod) {
        throw new PaymentMethodNotFoundError(`Payment method ${id} not found`);
      }

      // Securely delete tokenized data
      await this.tokenizationService.secureDelete(
        paymentMethod.token,
        paymentMethod.userId
      );

      logger.info('Payment method deleted successfully', {
        paymentMethodId: id,
      });
    } catch (error) {
      logger.error('Failed to delete payment method', {
        error: error instanceof Error ? error.message : 'Unknown error',
        paymentMethodId: id,
      });
      throw error;
    }
  }

  /**
   * Set payment method as default for user
   */
  async setDefault(id: string, userId: string): Promise<PaymentMethod> {
    try {
      logger.info('Setting default payment method', {
        paymentMethodId: id,
        userId,
      });

      const paymentMethod = await prisma.paymentMethod.findUnique({
        where: { id },
      });

      if (!paymentMethod) {
        throw new PaymentMethodNotFoundError(`Payment method ${id} not found`);
      }

      if (paymentMethod.userId !== userId) {
        throw new ValidationError('Payment method does not belong to user');
      }

      // Unset other default payment methods for this user
      await this.unsetDefaultPaymentMethods(userId);

      // Set this payment method as default
      const updatedPaymentMethod = await prisma.paymentMethod.update({
        where: { id },
        data: { isDefault: true },
      });

      logger.info('Default payment method set successfully', {
        paymentMethodId: id,
        userId,
      });

      return this.mapToPaymentMethod(updatedPaymentMethod);
    } catch (error) {
      logger.error('Failed to set default payment method', {
        error: error instanceof Error ? error.message : 'Unknown error',
        paymentMethodId: id,
        userId,
      });
      throw error;
    }
  }

  /**
   * Tokenize sensitive payment method data
   */
  async tokenize(data: any): Promise<string> {
    try {
      const tokenizationRequest: TokenizationRequest = {
        userId: data.userId,
        type: data.type,
        sensitiveData: data.sensitiveData,
        metadata: data.metadata,
      };

      const result =
        await this.tokenizationService.tokenize(tokenizationRequest);
      return result.token;
    } catch (error) {
      logger.error('Failed to tokenize payment method data', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new Error('Failed to tokenize payment method data');
    }
  }

  /**
   * Validate token
   */
  async validateToken(token: string): Promise<boolean> {
    return this.tokenizationService.validateToken(token);
  }

  /**
   * Start verification for a payment method
   */
  async startVerification(
    paymentMethodId: string,
    userId: string,
    method: VerificationMethod,
    data?: Record<string, any>
  ): Promise<string> {
    try {
      const workflow = await this.verificationService.startVerification(
        paymentMethodId,
        userId,
        method,
        data
      );

      // Update payment method with verification workflow ID
      await prisma.paymentMethod.update({
        where: { id: paymentMethodId },
        data: {
          metadata: {
            verificationWorkflowId: workflow.id,
            verificationMethod: method,
            verificationStarted: new Date().toISOString(),
          },
        },
      });

      return workflow.id;
    } catch (error) {
      logger.error('Failed to start verification', {
        paymentMethodId,
        userId,
        method,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Submit verification data
   */
  async submitVerificationData(
    workflowId: string,
    userId: string,
    data: Record<string, any>
  ): Promise<void> {
    await this.verificationService.submitVerificationData(
      workflowId,
      userId,
      data
    );
  }

  /**
   * Get verification status for a payment method
   */
  async getPaymentMethodVerificationStatus(
    paymentMethodId: string,
    userId: string
  ): Promise<{
    status: 'pending' | 'verified' | 'failed' | 'not_required';
    workflowId?: string;
    method?: VerificationMethod;
  }> {
    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: {
        id: paymentMethodId,
        userId,
        isActive: true,
      },
    });

    if (!paymentMethod) {
      throw new PaymentMethodNotFoundError('Payment method not found');
    }

    return this.getVerificationStatus(paymentMethod);
  }

  /**
   * Get decrypted payment method data for gateway processing
   */
  async getDecryptedData(id: string, userId: string): Promise<any> {
    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: {
        id,
        userId,
        isActive: true,
      },
    });

    if (!paymentMethod) {
      throw new PaymentMethodNotFoundError('Payment method not found');
    }

    return this.tokenizationService.detokenize(paymentMethod.token, userId);
  }

  /**
   * Rotate token for security purposes
   */
  async rotateToken(paymentMethodId: string, userId: string): Promise<string> {
    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: {
        id: paymentMethodId,
        userId,
        isActive: true,
      },
    });

    if (!paymentMethod) {
      throw new PaymentMethodNotFoundError('Payment method not found');
    }

    const newToken = await this.tokenizationService.rotateToken(
      paymentMethod.token,
      userId
    );

    await prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: { token: newToken },
    });

    return newToken;
  }

  // Private helper methods

  private async unsetDefaultPaymentMethods(userId: string): Promise<void> {
    await prisma.paymentMethod.updateMany({
      where: {
        userId,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });
  }

  private getProviderForType(type: PaymentMethodType): string {
    switch (type) {
      case 'card':
        return 'stripe';
      case 'bank_account':
        return 'stripe';
      case 'digital_wallet':
        return 'paypal';
      case 'crypto':
        return 'coinbase';
      case 'buy_now_pay_later':
        return 'klarna';
      default:
        return 'stripe';
    }
  }

  private mapToPaymentMethod(record: any): PaymentMethod {
    const metadata = record.metadata as any;

    return {
      id: record.id,
      userId: record.userId,
      type: record.type as PaymentMethodType,
      provider: record.provider,
      token: record.token,
      isDefault: record.isDefault,
      metadata: {
        last4: metadata.last4,
        brand: metadata.brand,
        expiryMonth: metadata.expiryMonth,
        expiryYear: metadata.expiryYear,
        holderName: metadata.holderName,
        bankName: metadata.bankName,
        accountType: metadata.accountType,
        walletType: metadata.walletType,
      },
      billingAddress: record.billingAddress || undefined,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private async getVerificationStatus(paymentMethod: any): Promise<{
    verificationStatus: 'pending' | 'verified' | 'failed' | 'not_required';
    verificationMethod?: VerificationMethod;
    verificationWorkflowId?: string;
    lastVerificationAttempt?: Date;
  }> {
    const metadata = paymentMethod.metadata as any;

    // Check if verification is required for this payment method type
    if (!this.requiresVerification(paymentMethod.type)) {
      return { verificationStatus: 'not_required' };
    }

    // Check if already verified
    if (metadata.verified) {
      return {
        verificationStatus: 'verified',
        verificationMethod: metadata.verificationMethod,
        lastVerificationAttempt: metadata.verifiedAt
          ? new Date(metadata.verifiedAt)
          : undefined,
      };
    }

    // Check if verification is in progress
    if (metadata.verificationWorkflowId) {
      try {
        const workflow = await this.verificationService.getVerificationStatus(
          metadata.verificationWorkflowId,
          paymentMethod.userId
        );

        return {
          verificationStatus:
            workflow.status === 'verified'
              ? 'verified'
              : workflow.status === 'FAILED'
                ? 'failed'
                : 'pending',
          verificationMethod: workflow.method,
          verificationWorkflowId: workflow.id,
          lastVerificationAttempt: workflow.updatedAt,
        };
      } catch (error) {
        logger.warn('Failed to get verification workflow status', {
          paymentMethodId: paymentMethod.id,
          workflowId: metadata.verificationWorkflowId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return { verificationStatus: 'pending' };
  }

  private requiresVerification(type: PaymentMethodType): boolean {
    // Bank accounts typically require verification
    // Cards may require verification based on risk assessment
    // Digital wallets may not require additional verification
    switch (type) {
      case 'bank_account':
        return true;
      case 'card':
        return false; // Can be enabled based on risk assessment
      case 'digital_wallet':
        return false;
      case 'crypto':
        return true;
      case 'buy_now_pay_later':
        return false;
      default:
        return false;
    }
  }
}
