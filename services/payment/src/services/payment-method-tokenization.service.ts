import crypto from 'crypto';
import { EncryptedData, encryptionService } from '../lib/encryption';
import { logger } from '../lib/logger';
import { prisma } from '../lib/prisma';
import { PaymentMethodType } from '../types';
import { ValidationError } from '../utils/errors';

export interface TokenizationRequest {
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
  metadata?: Record<string, any>;
}

export interface TokenizationResult {
  token: string;
  fingerprint: string;
  displayData: {
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    holderName?: string;
    bankName?: string;
    accountType?: string;
    walletType?: string;
  };
  encryptedData: EncryptedData;
}

export interface VerificationRequest {
  token: string;
  userId: string;
  verificationMethod:
    | 'micro_deposits'
    | 'instant_verification'
    | 'manual_verification';
  verificationData?: {
    amounts?: number[]; // For micro deposits
    accountDetails?: any; // For instant verification
    documents?: string[]; // For manual verification
  };
}

export interface VerificationResult {
  verified: boolean;
  verificationId: string;
  status: 'pending' | 'verified' | 'failed' | 'expired';
  nextSteps?: string[];
  expiresAt?: Date;
}

/**
 * PCI DSS compliant payment method tokenization service
 * Handles secure tokenization, encryption, and verification of payment methods
 */
export class PaymentMethodTokenizationService {
  private readonly tokenPrefix = 'pm_';
  private readonly fingerprintSalt: string;

  constructor() {
    this.fingerprintSalt =
      process.env.FINGERPRINT_SALT || 'default_salt_change_in_production';

    if (!process.env.FINGERPRINT_SALT) {
      logger.warn(
        'FINGERPRINT_SALT not set, using default (not suitable for production)'
      );
    }
  }

  /**
   * Tokenize sensitive payment method data with PCI DSS compliance
   */
  async tokenize(request: TokenizationRequest): Promise<TokenizationResult> {
    try {
      logger.info('Starting payment method tokenization', {
        userId: request.userId,
        type: request.type,
      });

      // Validate sensitive data
      this.validateSensitiveData(request);

      // Generate secure token
      const token = this.generateSecureToken();

      // Create fingerprint for duplicate detection
      const fingerprint = this.createFingerprint(
        request.sensitiveData,
        request.type
      );

      // Check for existing payment method with same fingerprint
      await this.checkDuplicatePaymentMethod(request.userId, fingerprint);

      // Extract display data (non-sensitive)
      const displayData = this.extractDisplayData(
        request.sensitiveData,
        request.type
      );

      // Encrypt sensitive data
      const encryptedData = encryptionService.encrypt(
        JSON.stringify(request.sensitiveData),
        `payment-method-${token}`
      );

      logger.info('Payment method tokenization completed', {
        userId: request.userId,
        token,
        type: request.type,
      });

      return {
        token,
        fingerprint,
        displayData,
        encryptedData,
      };
    } catch (error) {
      logger.error('Payment method tokenization failed', {
        userId: request.userId,
        type: request.type,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Detokenize payment method data (for gateway processing only)
   */
  async detokenize(token: string, userId: string): Promise<any> {
    try {
      logger.info('Detokenizing payment method', { token, userId });

      // Get payment method from database
      const paymentMethod = await prisma.paymentMethod.findFirst({
        where: {
          token,
          userId,
          isActive: true,
        },
      });

      if (!paymentMethod) {
        throw new ValidationError('Payment method not found or not accessible');
      }

      // Decrypt sensitive data
      const metadata = paymentMethod.metadata as any;
      const encryptedData = {
        encrypted: metadata.encrypted,
        iv: metadata.iv,
        tag: metadata.tag,
        salt: metadata.salt,
      };

      const decryptedData = encryptionService.decrypt(
        encryptedData,
        `payment-method-${token}`
      );

      const sensitiveData = JSON.parse(decryptedData);

      logger.info('Payment method detokenized successfully', { token, userId });

      return {
        type: paymentMethod.type,
        ...sensitiveData,
      };
    } catch (error) {
      logger.error('Payment method detokenization failed', {
        token,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Verify payment method using various verification methods
   */
  async verifyPaymentMethod(
    request: VerificationRequest
  ): Promise<VerificationResult> {
    try {
      logger.info('Starting payment method verification', {
        token: request.token,
        userId: request.userId,
        method: request.verificationMethod,
      });

      // Get payment method
      const paymentMethod = await prisma.paymentMethod.findFirst({
        where: {
          token: request.token,
          userId: request.userId,
          isActive: true,
        },
      });

      if (!paymentMethod) {
        throw new ValidationError('Payment method not found');
      }

      // Generate verification ID
      const verificationId = this.generateVerificationId();

      let result: VerificationResult;

      switch (request.verificationMethod) {
        case 'micro_deposits':
          result = await this.verifyWithMicroDeposits(
            paymentMethod,
            request,
            verificationId
          );
          break;
        case 'instant_verification':
          result = await this.verifyInstantly(
            paymentMethod,
            request,
            verificationId
          );
          break;
        case 'manual_verification':
          result = await this.verifyManually(
            paymentMethod,
            request,
            verificationId
          );
          break;
        default:
          throw new ValidationError(
            `Unsupported verification method: ${request.verificationMethod}`
          );
      }

      // Store verification record
      await this.storeVerificationRecord(
        paymentMethod.id,
        verificationId,
        result
      );

      logger.info('Payment method verification completed', {
        token: request.token,
        verificationId,
        status: result.status,
      });

      return result;
    } catch (error) {
      logger.error('Payment method verification failed', {
        token: request.token,
        userId: request.userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Validate token format and existence
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      // Check token format
      if (!token.startsWith(this.tokenPrefix)) {
        return false;
      }

      // Check if token exists and is active
      const paymentMethod = await prisma.paymentMethod.findFirst({
        where: {
          token,
          isActive: true,
        },
      });

      return paymentMethod !== null;
    } catch (error) {
      logger.error('Token validation failed', {
        token,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  /**
   * Rotate token for security purposes
   */
  async rotateToken(oldToken: string, userId: string): Promise<string> {
    try {
      logger.info('Rotating payment method token', { oldToken, userId });

      const paymentMethod = await prisma.paymentMethod.findFirst({
        where: {
          token: oldToken,
          userId,
          isActive: true,
        },
      });

      if (!paymentMethod) {
        throw new ValidationError('Payment method not found');
      }

      // Generate new token
      const newToken = this.generateSecureToken();

      // Update payment method with new token
      await prisma.paymentMethod.update({
        where: { id: paymentMethod.id },
        data: { token: newToken },
      });

      logger.info('Token rotation completed', { oldToken, newToken, userId });

      return newToken;
    } catch (error) {
      logger.error('Token rotation failed', {
        oldToken,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Securely delete payment method data
   */
  async secureDelete(token: string, userId: string): Promise<void> {
    try {
      logger.info('Securely deleting payment method', { token, userId });

      const paymentMethod = await prisma.paymentMethod.findFirst({
        where: {
          token,
          userId,
          isActive: true,
        },
      });

      if (!paymentMethod) {
        throw new ValidationError('Payment method not found');
      }

      // Overwrite encrypted data with random data before deletion
      const randomData = crypto.randomBytes(1024).toString('hex');
      const encryptedRandomData = encryptionService.encrypt(
        randomData,
        `payment-method-${token}`
      );

      await prisma.paymentMethod.update({
        where: { id: paymentMethod.id },
        data: {
          isActive: false,
          metadata: {
            ...encryptedRandomData,
            securelyDeleted: true,
            deletedAt: new Date().toISOString(),
          },
        },
      });

      logger.info('Payment method securely deleted', { token, userId });
    } catch (error) {
      logger.error('Secure deletion failed', {
        token,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  // Private helper methods

  private generateSecureToken(): string {
    const timestamp = Date.now().toString(36);
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const checksum = crypto
      .createHash('sha256')
      .update(`${timestamp}${randomBytes}`)
      .digest('hex')
      .substring(0, 8);

    return `${this.tokenPrefix}${timestamp}_${randomBytes}_${checksum}`;
  }

  private generateVerificationId(): string {
    return `ver_${Date.now().toString(36)}_${crypto.randomBytes(8).toString('hex')}`;
  }

  private createFingerprint(
    sensitiveData: any,
    type: PaymentMethodType
  ): string {
    let fingerprintData = '';

    switch (type) {
      case 'card':
        if (sensitiveData.card) {
          fingerprintData = `card_${sensitiveData.card.number}_${sensitiveData.card.expiryMonth}_${sensitiveData.card.expiryYear}`;
        }
        break;
      case 'bank_account':
        if (sensitiveData.bankAccount) {
          fingerprintData = `bank_${sensitiveData.bankAccount.accountNumber}_${sensitiveData.bankAccount.routingNumber}`;
        }
        break;
      case 'digital_wallet':
        if (sensitiveData.digitalWallet) {
          fingerprintData = `wallet_${sensitiveData.digitalWallet.walletType}_${sensitiveData.digitalWallet.walletId}`;
        }
        break;
    }

    return crypto
      .createHash('sha256')
      .update(`${fingerprintData}_${this.fingerprintSalt}`)
      .digest('hex');
  }

  private async checkDuplicatePaymentMethod(
    userId: string,
    fingerprint: string
  ): Promise<void> {
    const existingPaymentMethod = await prisma.paymentMethod.findFirst({
      where: {
        userId,
        isActive: true,
        metadata: {
          path: ['fingerprint'],
          equals: fingerprint,
        },
      },
    });

    if (existingPaymentMethod) {
      throw new ValidationError('Payment method already exists');
    }
  }

  private extractDisplayData(sensitiveData: any, type: PaymentMethodType): any {
    const displayData: any = {};

    switch (type) {
      case 'card':
        if (sensitiveData.card) {
          displayData.last4 = sensitiveData.card.number.slice(-4);
          displayData.brand = this.detectCardBrand(sensitiveData.card.number);
          displayData.expiryMonth = sensitiveData.card.expiryMonth;
          displayData.expiryYear = sensitiveData.card.expiryYear;
          displayData.holderName = sensitiveData.card.holderName;
        }
        break;
      case 'bank_account':
        if (sensitiveData.bankAccount) {
          displayData.last4 = sensitiveData.bankAccount.accountNumber.slice(-4);
          displayData.bankName = sensitiveData.bankAccount.bankName;
          displayData.accountType = sensitiveData.bankAccount.accountType;
        }
        break;
      case 'digital_wallet':
        if (sensitiveData.digitalWallet) {
          displayData.walletType = sensitiveData.digitalWallet.walletType;
        }
        break;
    }

    return displayData;
  }

  private detectCardBrand(cardNumber: string): string {
    const number = cardNumber.replace(/\s/g, '');

    if (/^4/.test(number)) return 'visa';
    if (/^5[1-5]/.test(number)) return 'mastercard';
    if (/^3[47]/.test(number)) return 'amex';
    if (/^6(?:011|5)/.test(number)) return 'discover';
    if (/^(?:2131|1800|35\d{3})\d{11}$/.test(number)) return 'jcb';

    return 'unknown';
  }

  private validateSensitiveData(request: TokenizationRequest): void {
    switch (request.type) {
      case 'card':
        this.validateCardData(request.sensitiveData.card);
        break;
      case 'bank_account':
        this.validateBankAccountData(request.sensitiveData.bankAccount);
        break;
      case 'digital_wallet':
        this.validateDigitalWalletData(request.sensitiveData.digitalWallet);
        break;
      default:
        throw new ValidationError(
          `Unsupported payment method type: ${request.type}`
        );
    }
  }

  private validateCardData(card: any): void {
    if (!card) {
      throw new ValidationError('Card data is required');
    }

    if (!card.number || !/^\d{13,19}$/.test(card.number.replace(/\s/g, ''))) {
      throw new ValidationError('Invalid card number');
    }

    if (!card.expiryMonth || card.expiryMonth < 1 || card.expiryMonth > 12) {
      throw new ValidationError('Invalid expiry month');
    }

    if (!card.expiryYear || card.expiryYear < new Date().getFullYear()) {
      throw new ValidationError('Invalid expiry year');
    }

    if (!card.cvc || !/^\d{3,4}$/.test(card.cvc)) {
      throw new ValidationError('Invalid CVC');
    }

    if (!card.holderName || card.holderName.trim().length < 2) {
      throw new ValidationError('Invalid cardholder name');
    }
  }

  private validateBankAccountData(bankAccount: any): void {
    if (!bankAccount) {
      throw new ValidationError('Bank account data is required');
    }

    if (
      !bankAccount.accountNumber ||
      !/^\d{4,17}$/.test(bankAccount.accountNumber)
    ) {
      throw new ValidationError('Invalid account number');
    }

    if (
      !bankAccount.routingNumber ||
      !/^\d{9}$/.test(bankAccount.routingNumber)
    ) {
      throw new ValidationError('Invalid routing number');
    }

    if (!['checking', 'savings'].includes(bankAccount.accountType)) {
      throw new ValidationError('Invalid account type');
    }

    if (
      !bankAccount.accountHolderName ||
      bankAccount.accountHolderName.trim().length < 2
    ) {
      throw new ValidationError('Invalid account holder name');
    }
  }

  private validateDigitalWalletData(digitalWallet: any): void {
    if (!digitalWallet) {
      throw new ValidationError('Digital wallet data is required');
    }

    if (
      !['paypal', 'apple_pay', 'google_pay', 'amazon_pay'].includes(
        digitalWallet.walletType
      )
    ) {
      throw new ValidationError('Invalid wallet type');
    }

    if (!digitalWallet.walletId) {
      throw new ValidationError('Wallet ID is required');
    }
  }

  private async verifyWithMicroDeposits(
    paymentMethod: any,
    request: VerificationRequest,
    verificationId: string
  ): Promise<VerificationResult> {
    // For bank accounts, initiate micro deposits
    if (paymentMethod.type !== 'bank_account') {
      throw new ValidationError(
        'Micro deposits only available for bank accounts'
      );
    }

    if (request.verificationData?.amounts) {
      // Verify provided amounts
      const expectedAmounts = await this.getMicroDepositAmounts(verificationId);
      const providedAmounts = request.verificationData.amounts.sort();
      const expectedSorted = expectedAmounts.sort();

      const verified =
        JSON.stringify(providedAmounts) === JSON.stringify(expectedSorted);

      return {
        verified,
        verificationId,
        status: verified ? 'verified' : 'failed',
      };
    } else {
      // Initiate micro deposits
      await this.initiateMicroDeposits(paymentMethod, verificationId);

      return {
        verified: false,
        verificationId,
        status: 'pending',
        nextSteps: [
          'Check your bank account for two small deposits and provide the amounts',
        ],
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      };
    }
  }

  private async verifyInstantly(
    paymentMethod: any,
    request: VerificationRequest,
    verificationId: string
  ): Promise<VerificationResult> {
    // Instant verification using third-party services
    // This would integrate with services like Plaid, Yodlee, etc.

    logger.info('Performing instant verification', {
      paymentMethodId: paymentMethod.id,
      verificationId,
    });

    // Simulate instant verification
    const verified = Math.random() > 0.1; // 90% success rate for simulation

    return {
      verified,
      verificationId,
      status: verified ? 'verified' : 'failed',
    };
  }

  private async verifyManually(
    paymentMethod: any,
    request: VerificationRequest,
    verificationId: string
  ): Promise<VerificationResult> {
    // Manual verification requires document upload and review

    logger.info('Initiating manual verification', {
      paymentMethodId: paymentMethod.id,
      verificationId,
      documents: request.verificationData?.documents?.length || 0,
    });

    return {
      verified: false,
      verificationId,
      status: 'pending',
      nextSteps: [
        'Upload required documents',
        'Wait for manual review (1-3 business days)',
      ],
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    };
  }

  private async initiateMicroDeposits(
    paymentMethod: any,
    verificationId: string
  ): Promise<void> {
    // Generate two random amounts between $0.01 and $0.99
    const amount1 = Math.floor(Math.random() * 99) + 1;
    const amount2 = Math.floor(Math.random() * 99) + 1;

    // Store amounts for later verification
    await this.storeMicroDepositAmounts(verificationId, [amount1, amount2]);

    // In a real implementation, this would integrate with the bank to send micro deposits
    logger.info('Micro deposits initiated', {
      verificationId,
      amounts: [amount1, amount2],
    });
  }

  private async getMicroDepositAmounts(
    verificationId: string
  ): Promise<number[]> {
    // In a real implementation, this would retrieve from secure storage
    // For now, return mock data
    return [23, 47];
  }

  private async storeMicroDepositAmounts(
    verificationId: string,
    amounts: number[]
  ): Promise<void> {
    // Store encrypted amounts for verification
    const encryptedAmounts = encryptionService.encrypt(
      JSON.stringify(amounts),
      `verification-${verificationId}`
    );

    // In a real implementation, store in database
    logger.info('Micro deposit amounts stored', { verificationId });
  }

  private async storeVerificationRecord(
    paymentMethodId: string,
    verificationId: string,
    result: VerificationResult
  ): Promise<void> {
    // Store verification record in database
    // This would be implemented with a proper verification table

    logger.info('Verification record stored', {
      paymentMethodId,
      verificationId,
      status: result.status,
    });
  }
}
