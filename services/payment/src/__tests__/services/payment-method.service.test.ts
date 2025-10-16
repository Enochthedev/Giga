import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { encryptionService } from '../../lib/encryption';
import { prisma } from '../../lib/prisma';
import { PaymentMethodService } from '../../services/payment-method.service';
import {
  PaymentMethodNotFoundError,
  ValidationError,
} from '../../utils/errors';

// Mock dependencies
vi.mock('../../lib/prisma', () => ({
  prisma: {
    paymentMethod: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

vi.mock('../../lib/encryption', () => ({
  encryptionService: {
    generateToken: vi.fn(),
    encrypt: vi.fn(),
    decrypt: vi.fn(),
  },
}));

describe('PaymentMethodService', () => {
  let paymentMethodService: PaymentMethodService;
  const mockPrisma = prisma as any;
  const mockEncryption = encryptionService as any;

  beforeEach(() => {
    paymentMethodService = new PaymentMethodService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('create', () => {
    const validCardData = {
      userId: 'user123',
      type: 'card' as const,
      card: {
        number: '4242424242424242',
        expiryMonth: 12,
        expiryYear: 2025,
        cvc: '123',
        holderName: 'John Doe',
      },
      billingAddress: {
        line1: '123 Main St',
        city: 'New York',
        postalCode: '10001',
        country: 'US',
      },
      isDefault: true,
    };

    it('should create a payment method successfully', async () => {
      const mockToken = 'pm_test_token';
      const mockEncryptedData = {
        encrypted: 'encrypted_data',
        iv: 'iv_data',
        tag: 'tag_data',
        salt: 'salt_data',
      };

      const mockCreatedPaymentMethod = {
        id: 'pm_123',
        userId: 'user123',
        type: 'card',
        provider: 'stripe',
        token: mockToken,
        isDefault: true,
        isActive: true,
        metadata: {
          last4: '4242',
          brand: 'visa',
          expiryMonth: 12,
          expiryYear: 2025,
          holderName: 'John Doe',
          ...mockEncryptedData,
        },
        billingAddress: JSON.stringify(validCardData.billingAddress),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockEncryption.generateToken.mockReturnValue(mockToken);
      mockEncryption.encrypt.mockReturnValue(mockEncryptedData);
      mockPrisma.paymentMethod.updateMany.mockResolvedValue({ count: 0 });
      mockPrisma.paymentMethod.create.mockResolvedValue(
        mockCreatedPaymentMethod
      );

      const result = await paymentMethodService.create(validCardData);

      expect(mockEncryption.generateToken).toHaveBeenCalledWith('pm');
      expect(mockEncryption.encrypt).toHaveBeenCalled();
      expect(mockPrisma.paymentMethod.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user123', isDefault: true },
        data: { isDefault: false },
      });
      expect(mockPrisma.paymentMethod.create).toHaveBeenCalled();

      expect(result).toEqual({
        id: 'pm_123',
        userId: 'user123',
        type: 'card',
        provider: 'stripe',
        token: mockToken,
        isDefault: true,
        metadata: {
          last4: '4242',
          brand: 'visa',
          expiryMonth: 12,
          expiryYear: 2025,
          holderName: 'John Doe',
        },
        billingAddress: validCardData.billingAddress,
        isActive: true,
        createdAt: mockCreatedPaymentMethod.createdAt,
        updatedAt: mockCreatedPaymentMethod.updatedAt,
      });
    });

    it('should throw validation error for invalid card data', async () => {
      const invalidCardData = {
        userId: 'user123',
        type: 'card' as const,
        card: {
          number: '1234', // Invalid card number
          expiryMonth: 12,
          expiryYear: 2025,
          cvc: '123',
          holderName: 'John Doe',
        },
      };

      await expect(
        paymentMethodService.create(invalidCardData)
      ).rejects.toThrow();
    });

    it('should create bank account payment method', async () => {
      const bankAccountData = {
        userId: 'user123',
        type: 'bank_account' as const,
        bankAccount: {
          accountNumber: '123456789',
          routingNumber: '021000021',
          accountType: 'checking' as const,
          accountHolderName: 'John Doe',
          bankName: 'Test Bank',
        },
      };

      const mockToken = 'pm_bank_token';
      const mockEncryptedData = {
        encrypted: 'encrypted_data',
        iv: 'iv_data',
        tag: 'tag_data',
        salt: 'salt_data',
      };

      const mockCreatedPaymentMethod = {
        id: 'pm_bank_123',
        userId: 'user123',
        type: 'bank_account',
        provider: 'stripe',
        token: mockToken,
        isDefault: false,
        isActive: true,
        metadata: {
          last4: '6789',
          bankName: 'Test Bank',
          accountType: 'checking',
          ...mockEncryptedData,
        },
        billingAddress: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockEncryption.generateToken.mockReturnValue(mockToken);
      mockEncryption.encrypt.mockReturnValue(mockEncryptedData);
      mockPrisma.paymentMethod.create.mockResolvedValue(
        mockCreatedPaymentMethod
      );

      const result = await paymentMethodService.create(bankAccountData);

      expect(result.type).toBe('bank_account');
      expect(result.metadata.last4).toBe('6789');
      expect(result.metadata.bankName).toBe('Test Bank');
    });
  });

  describe('getById', () => {
    it('should get payment method by ID successfully', async () => {
      const mockPaymentMethod = {
        id: 'pm_123',
        userId: 'user123',
        type: 'card',
        provider: 'stripe',
        token: 'pm_token',
        isDefault: true,
        isActive: true,
        metadata: {
          last4: '4242',
          brand: 'visa',
          expiryMonth: 12,
          expiryYear: 2025,
        },
        billingAddress: JSON.stringify({
          line1: '123 Main St',
          city: 'New York',
          postalCode: '10001',
          country: 'US',
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.paymentMethod.findUnique.mockResolvedValue(mockPaymentMethod);

      const result = await paymentMethodService.getById('pm_123');

      expect(mockPrisma.paymentMethod.findUnique).toHaveBeenCalledWith({
        where: { id: 'pm_123' },
      });
      expect(result.id).toBe('pm_123');
      expect(result.metadata.last4).toBe('4242');
    });

    it('should throw PaymentMethodNotFoundError when payment method not found', async () => {
      mockPrisma.paymentMethod.findUnique.mockResolvedValue(null);

      await expect(paymentMethodService.getById('nonexistent')).rejects.toThrow(
        PaymentMethodNotFoundError
      );
    });
  });

  describe('getByUserId', () => {
    it('should get all payment methods for a user', async () => {
      const mockPaymentMethods = [
        {
          id: 'pm_1',
          userId: 'user123',
          type: 'card',
          provider: 'stripe',
          token: 'pm_token_1',
          isDefault: true,
          isActive: true,
          metadata: { last4: '4242', brand: 'visa' },
          billingAddress: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'pm_2',
          userId: 'user123',
          type: 'bank_account',
          provider: 'stripe',
          token: 'pm_token_2',
          isDefault: false,
          isActive: true,
          metadata: { last4: '6789', bankName: 'Test Bank' },
          billingAddress: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.paymentMethod.findMany.mockResolvedValue(mockPaymentMethods);

      const result = await paymentMethodService.getByUserId('user123');

      expect(mockPrisma.paymentMethod.findMany).toHaveBeenCalledWith({
        where: { userId: 'user123', isActive: true },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      });
      expect(result).toHaveLength(2);
      expect(result[0].isDefault).toBe(true);
    });
  });

  describe('update', () => {
    it('should update payment method successfully', async () => {
      const existingPaymentMethod = {
        id: 'pm_123',
        userId: 'user123',
        type: 'card',
        provider: 'stripe',
        token: 'pm_token',
        isDefault: false,
        isActive: true,
        metadata: { last4: '4242', brand: 'visa' },
        billingAddress: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedPaymentMethod = {
        ...existingPaymentMethod,
        isDefault: true,
        billingAddress: JSON.stringify({
          line1: '456 Oak St',
          city: 'Boston',
          postalCode: '02101',
          country: 'US',
        }),
      };

      mockPrisma.paymentMethod.findUnique.mockResolvedValue(
        existingPaymentMethod
      );
      mockPrisma.paymentMethod.updateMany.mockResolvedValue({ count: 0 });
      mockPrisma.paymentMethod.update.mockResolvedValue(updatedPaymentMethod);

      const updateData = {
        isDefault: true,
        billingAddress: {
          line1: '456 Oak St',
          city: 'Boston',
          postalCode: '02101',
          country: 'US',
        },
      };

      const result = await paymentMethodService.update('pm_123', updateData);

      expect(mockPrisma.paymentMethod.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user123', isDefault: true },
        data: { isDefault: false },
      });
      expect(result.isDefault).toBe(true);
    });

    it('should throw PaymentMethodNotFoundError when updating non-existent payment method', async () => {
      mockPrisma.paymentMethod.findUnique.mockResolvedValue(null);

      await expect(
        paymentMethodService.update('nonexistent', { isDefault: true })
      ).rejects.toThrow(PaymentMethodNotFoundError);
    });
  });

  describe('delete', () => {
    it('should soft delete payment method successfully', async () => {
      const existingPaymentMethod = {
        id: 'pm_123',
        userId: 'user123',
        type: 'card',
        provider: 'stripe',
        token: 'pm_token',
        isDefault: true,
        isActive: true,
        metadata: { last4: '4242' },
        billingAddress: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.paymentMethod.findUnique.mockResolvedValue(
        existingPaymentMethod
      );
      mockPrisma.paymentMethod.update.mockResolvedValue({
        ...existingPaymentMethod,
        isActive: false,
        isDefault: false,
      });

      await paymentMethodService.delete('pm_123');

      expect(mockPrisma.paymentMethod.update).toHaveBeenCalledWith({
        where: { id: 'pm_123' },
        data: { isActive: false, isDefault: false },
      });
    });

    it('should throw PaymentMethodNotFoundError when deleting non-existent payment method', async () => {
      mockPrisma.paymentMethod.findUnique.mockResolvedValue(null);

      await expect(paymentMethodService.delete('nonexistent')).rejects.toThrow(
        PaymentMethodNotFoundError
      );
    });
  });

  describe('setDefault', () => {
    it('should set payment method as default successfully', async () => {
      const existingPaymentMethod = {
        id: 'pm_123',
        userId: 'user123',
        type: 'card',
        provider: 'stripe',
        token: 'pm_token',
        isDefault: false,
        isActive: true,
        metadata: { last4: '4242' },
        billingAddress: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedPaymentMethod = {
        ...existingPaymentMethod,
        isDefault: true,
      };

      mockPrisma.paymentMethod.findUnique.mockResolvedValue(
        existingPaymentMethod
      );
      mockPrisma.paymentMethod.updateMany.mockResolvedValue({ count: 0 });
      mockPrisma.paymentMethod.update.mockResolvedValue(updatedPaymentMethod);

      const result = await paymentMethodService.setDefault('pm_123', 'user123');

      expect(mockPrisma.paymentMethod.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user123', isDefault: true },
        data: { isDefault: false },
      });
      expect(mockPrisma.paymentMethod.update).toHaveBeenCalledWith({
        where: { id: 'pm_123' },
        data: { isDefault: true },
      });
      expect(result.isDefault).toBe(true);
    });

    it('should throw ValidationError when payment method belongs to different user', async () => {
      const existingPaymentMethod = {
        id: 'pm_123',
        userId: 'different_user',
        type: 'card',
        provider: 'stripe',
        token: 'pm_token',
        isDefault: false,
        isActive: true,
        metadata: { last4: '4242' },
        billingAddress: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.paymentMethod.findUnique.mockResolvedValue(
        existingPaymentMethod
      );

      await expect(
        paymentMethodService.setDefault('pm_123', 'user123')
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('tokenize', () => {
    it('should tokenize payment method data successfully', async () => {
      const paymentMethodData = {
        userId: 'user123',
        type: 'card' as const,
        card: {
          number: '4242424242424242',
          expiryMonth: 12,
          expiryYear: 2025,
          cvc: '123',
          holderName: 'John Doe',
        },
      };

      const mockToken = 'pm_tokenized';
      const mockEncryptedData = {
        encrypted: 'encrypted_data',
        iv: 'iv_data',
        tag: 'tag_data',
        salt: 'salt_data',
      };

      mockEncryption.generateToken.mockReturnValue(mockToken);
      mockEncryption.encrypt.mockReturnValue(mockEncryptedData);

      const result = await paymentMethodService.tokenize(paymentMethodData);

      expect(mockEncryption.generateToken).toHaveBeenCalledWith('pm');
      expect(mockEncryption.encrypt).toHaveBeenCalled();
      expect(result).toBe(mockToken);
    });
  });

  describe('validateToken', () => {
    it('should return true for valid active token', async () => {
      const mockPaymentMethod = {
        id: 'pm_123',
        token: 'valid_token',
        isActive: true,
      };

      mockPrisma.paymentMethod.findUnique.mockResolvedValue(mockPaymentMethod);

      const result = await paymentMethodService.validateToken('valid_token');

      expect(mockPrisma.paymentMethod.findUnique).toHaveBeenCalledWith({
        where: { token: 'valid_token' },
      });
      expect(result).toBe(true);
    });

    it('should return false for invalid token', async () => {
      mockPrisma.paymentMethod.findUnique.mockResolvedValue(null);

      const result = await paymentMethodService.validateToken('invalid_token');

      expect(result).toBe(false);
    });

    it('should return false for inactive payment method', async () => {
      const mockPaymentMethod = {
        id: 'pm_123',
        token: 'inactive_token',
        isActive: false,
      };

      mockPrisma.paymentMethod.findUnique.mockResolvedValue(mockPaymentMethod);

      const result = await paymentMethodService.validateToken('inactive_token');

      expect(result).toBe(false);
    });
  });

  describe('getDecryptedData', () => {
    it('should return decrypted payment method data', async () => {
      const mockPaymentMethod = {
        id: 'pm_123',
        userId: 'user123',
        type: 'card',
        token: 'pm_token',
        isActive: true,
        metadata: {
          encrypted: 'encrypted_data',
          iv: 'iv_data',
          tag: 'tag_data',
          salt: 'salt_data',
        },
        billingAddress: JSON.stringify({
          line1: '123 Main St',
          city: 'New York',
          postalCode: '10001',
          country: 'US',
        }),
      };

      const mockDecryptedData = JSON.stringify({
        card: {
          number: '4242424242424242',
          expiryMonth: 12,
          expiryYear: 2025,
          cvc: '123',
          holderName: 'John Doe',
        },
      });

      mockPrisma.paymentMethod.findUnique.mockResolvedValue(mockPaymentMethod);
      mockEncryption.decrypt.mockReturnValue(mockDecryptedData);

      const result = await paymentMethodService.getDecryptedData('pm_123');

      expect(mockEncryption.decrypt).toHaveBeenCalledWith(
        {
          encrypted: 'encrypted_data',
          iv: 'iv_data',
          tag: 'tag_data',
          salt: 'salt_data',
        },
        'payment-method-pm_token'
      );
      expect(result?.userId).toBe('user123');
      expect(result?.type).toBe('card');
      expect(result?.card?.number).toBe('4242424242424242');
    });

    it('should return null for non-existent payment method', async () => {
      mockPrisma.paymentMethod.findUnique.mockResolvedValue(null);

      const result = await paymentMethodService.getDecryptedData('nonexistent');

      expect(result).toBeNull();
    });
  });
});
