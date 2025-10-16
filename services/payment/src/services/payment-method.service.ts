<<<<<<< HEAD
// TODO: Install and configure actual Prisma client
// import { PrismaClient } from '@prisma/client';
=======
import { PrismaClient } from '@prisma/client';
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
import { IPaymentMethodService } from '../interfaces/payment.interface';
import { encryptionService } from '../lib/encryption';
import { logger } from '../lib/logger';
import { prisma } from '../lib/prisma';
import { Address, PaymentMethod, PaymentMethodType } from '../types';
import { PaymentMethodNotFoundError, ValidationError } from '../utils/errors';
import {
  validateAddress,
  validatePaymentMethodData,
} from '../utils/validation';

export interface PaymentMethodData {
  userId: string;
  type: PaymentMethodType;
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
  };
  billingAddress?: Address;
  isDefault?: boolean;
  metadata?: Record<string, any>;
}

export interface TokenizedPaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  token: string;
  provider: string;
  isDefault: boolean;
  metadata: {
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    holderName?: string;
    bankName?: string;
    accountType?: string;
    walletType?: string;
  };
  billingAddress?: Address;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class PaymentMethodService implements IPaymentMethodService {
<<<<<<< HEAD
  // TODO: Replace with actual PrismaClient when available
  private prisma: any;
=======
  private prisma: PrismaClient;
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03

  constructor() {
    this.prisma = prisma;
  }

  /**
   * Create a new payment method with PCI DSS compliant tokenization
   */
  async create(data: PaymentMethodData): Promise<PaymentMethod> {
    try {
      logger.info('Creating payment method', {
        userId: data.userId,
        type: data.type,
      });

      // Validate input data
      const validatedData = validatePaymentMethodData(data);

      // Validate billing address if provided
      if (validatedData.billingAddress) {
        validateAddress(validatedData.billingAddress);
      }

      // Generate secure token
      const token = encryptionService.generateToken('pm');

      // Tokenize and encrypt sensitive data
      const { encryptedData, metadata } =
        await this.tokenizeSensitiveData(validatedData);

      // If this is set as default, unset other default payment methods
      if (validatedData.isDefault) {
        await this.unsetDefaultPaymentMethods(validatedData.userId);
      }

      // Store tokenized payment method
      const paymentMethod = await this.prisma.paymentMethod.create({
        data: {
          userId: validatedData.userId,
          type: validatedData.type,
          provider: this.getProviderForType(validatedData.type),
          token,
          isDefault: validatedData.isDefault || false,
          isActive: true,
          metadata: {
            ...metadata,
            encrypted: encryptedData.encrypted,
            iv: encryptedData.iv,
            tag: encryptedData.tag,
            salt: encryptedData.salt,
          },
          billingAddress: validatedData.billingAddress
            ? JSON.stringify(validatedData.billingAddress)
            : null,
        },
      });

      logger.info('Payment method created successfully', {
        paymentMethodId: paymentMethod.id,
        userId: validatedData.userId,
        type: validatedData.type,
      });

      return this.mapToPaymentMethod(paymentMethod);
    } catch (error) {
      logger.error('Failed to create payment method', {
        error,
        userId: data.userId,
        type: data.type,
      });
      throw error;
    }
  }

  /**
   * Get payment method by ID
   */
  async getById(id: string): Promise<PaymentMethod> {
    try {
      const paymentMethod = await this.prisma.paymentMethod.findUnique({
        where: { id },
      });

      if (!paymentMethod) {
        throw new PaymentMethodNotFoundError(`Payment method ${id} not found`);
      }

      return this.mapToPaymentMethod(paymentMethod);
    } catch (error) {
      logger.error('Failed to get payment method', {
        error,
        paymentMethodId: id,
      });
      throw error;
    }
  }

  /**
   * Get all payment methods for a user
   */
  async getByUserId(userId: string): Promise<PaymentMethod[]> {
    try {
      const paymentMethods = await this.prisma.paymentMethod.findMany({
        where: {
          userId,
          isActive: true,
        },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      });

<<<<<<< HEAD
      return paymentMethods.map((pm: any) => this.mapToPaymentMethod(pm));
=======
      return paymentMethods.map(pm => this.mapToPaymentMethod(pm));
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
    } catch (error) {
      logger.error('Failed to get user payment methods', { error, userId });
      throw error;
    }
  }

  /**
   * Update payment method
   */
  async update(
    id: string,
    data: Partial<PaymentMethodData>
  ): Promise<PaymentMethod> {
    try {
      logger.info('Updating payment method', { paymentMethodId: id });

      const existingPaymentMethod = await this.prisma.paymentMethod.findUnique({
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
        updateData.billingAddress = JSON.stringify(data.billingAddress);
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
        };
      }

      const updatedPaymentMethod = await this.prisma.paymentMethod.update({
        where: { id },
        data: updateData,
      });

      logger.info('Payment method updated successfully', {
        paymentMethodId: id,
      });

      return this.mapToPaymentMethod(updatedPaymentMethod);
    } catch (error) {
      logger.error('Failed to update payment method', {
        error,
        paymentMethodId: id,
      });
      throw error;
    }
  }

  /**
   * Delete (deactivate) payment method
   */
  async delete(id: string): Promise<void> {
    try {
      logger.info('Deleting payment method', { paymentMethodId: id });

      const paymentMethod = await this.prisma.paymentMethod.findUnique({
        where: { id },
      });

      if (!paymentMethod) {
        throw new PaymentMethodNotFoundError(`Payment method ${id} not found`);
      }

      // Soft delete by setting isActive to false
      await this.prisma.paymentMethod.update({
        where: { id },
        data: {
          isActive: false,
          isDefault: false, // Remove default status when deleting
        },
      });

      logger.info('Payment method deleted successfully', {
        paymentMethodId: id,
      });
    } catch (error) {
      logger.error('Failed to delete payment method', {
        error,
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

      const paymentMethod = await this.prisma.paymentMethod.findUnique({
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
      const updatedPaymentMethod = await this.prisma.paymentMethod.update({
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
        error,
        paymentMethodId: id,
        userId,
      });
      throw error;
    }
  }

  /**
   * Tokenize sensitive payment method data
   */
  async tokenize(data: PaymentMethodData): Promise<string> {
    try {
      // Generate secure token
      const token = encryptionService.generateToken('pm');

      // Encrypt sensitive data
      const sensitiveData = JSON.stringify({
        card: data.card,
        bankAccount: data.bankAccount,
        digitalWallet: data.digitalWallet,
      });

      encryptionService.encrypt(sensitiveData, `payment-method-${token}`);

      return token;
    } catch (error) {
      logger.error('Failed to tokenize payment method data', { error });
      throw new Error('Failed to tokenize payment method data');
    }
  }

  /**
   * Validate token
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      const paymentMethod = await this.prisma.paymentMethod.findUnique({
        where: { token },
      });

      return paymentMethod !== null && paymentMethod.isActive;
    } catch (error) {
      logger.error('Failed to validate token', { error, token });
      return false;
    }
  }

  /**
   * Get decrypted payment method data (for gateway processing only)
   */
  async getDecryptedData(id: string): Promise<PaymentMethodData | null> {
    try {
      const paymentMethod = await this.prisma.paymentMethod.findUnique({
        where: { id },
      });

      if (!paymentMethod || !paymentMethod.isActive) {
        return null;
      }

      const metadata = paymentMethod.metadata as any;

      if (!metadata.encrypted) {
        return null;
      }

      // Decrypt sensitive data
      const decryptedData = encryptionService.decrypt(
        {
          encrypted: metadata.encrypted,
          iv: metadata.iv,
          tag: metadata.tag,
          salt: metadata.salt,
        },
        `payment-method-${paymentMethod.token}`
      );

      const sensitiveData = JSON.parse(decryptedData);

      return {
        userId: paymentMethod.userId,
        type: paymentMethod.type as PaymentMethodType,
        card: sensitiveData.card,
        bankAccount: sensitiveData.bankAccount,
        digitalWallet: sensitiveData.digitalWallet,
        billingAddress: paymentMethod.billingAddress
          ? JSON.parse(paymentMethod.billingAddress as string)
          : undefined,
      };
    } catch (error) {
      logger.error('Failed to get decrypted payment method data', {
        error,
        paymentMethodId: id,
      });
      return null;
    }
  }

  /**
   * Tokenize and encrypt sensitive payment method data
   */
  private async tokenizeSensitiveData(data: PaymentMethodData): Promise<{
    encryptedData: any;
    metadata: Record<string, any>;
  }> {
    const sensitiveData = {
      card: data.card,
      bankAccount: data.bankAccount,
      digitalWallet: data.digitalWallet,
    };

    // Encrypt sensitive data
    const encryptedData = encryptionService.encrypt(
      JSON.stringify(sensitiveData),
      `payment-method-${data.userId}`
    );

    // Create non-sensitive metadata for display purposes
    const metadata: Record<string, any> = {};

    if (data.card) {
      metadata.last4 = data.card.number.slice(-4);
      metadata.brand = this.detectCardBrand(data.card.number);
      metadata.expiryMonth = data.card.expiryMonth;
      metadata.expiryYear = data.card.expiryYear;
      metadata.holderName = data.card.holderName;
    }

    if (data.bankAccount) {
      metadata.last4 = data.bankAccount.accountNumber.slice(-4);
      metadata.bankName = data.bankAccount.bankName;
      metadata.accountType = data.bankAccount.accountType;
    }

    if (data.digitalWallet) {
      metadata.walletType = data.digitalWallet.walletType;
    }

    return { encryptedData, metadata };
  }

  /**
   * Unset default status for all user's payment methods
   */
  private async unsetDefaultPaymentMethods(userId: string): Promise<void> {
    await this.prisma.paymentMethod.updateMany({
      where: {
        userId,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });
  }

  /**
   * Get provider name for payment method type
   */
  private getProviderForType(type: PaymentMethodType): string {
    switch (type) {
      case 'card':
        return 'stripe'; // Default card provider
      case 'bank_account':
        return 'stripe'; // Default bank account provider
      case 'digital_wallet':
        return 'paypal'; // Default digital wallet provider
      case 'crypto':
        return 'coinbase'; // Default crypto provider
      case 'buy_now_pay_later':
        return 'klarna'; // Default BNPL provider
      default:
        return 'stripe';
    }
  }

  /**
   * Detect card brand from card number
   */
  private detectCardBrand(cardNumber: string): string {
    const number = cardNumber.replace(/\s/g, '');

    if (/^4/.test(number)) return 'visa';
    if (/^5[1-5]/.test(number)) return 'mastercard';
    if (/^3[47]/.test(number)) return 'amex';
    if (/^6(?:011|5)/.test(number)) return 'discover';
    if (/^(?:2131|1800|35\d{3})\d{11}$/.test(number)) return 'jcb';

    return 'unknown';
  }

  /**
   * Map database record to PaymentMethod type
   */
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
      billingAddress: record.billingAddress
        ? JSON.parse(record.billingAddress)
        : undefined,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
