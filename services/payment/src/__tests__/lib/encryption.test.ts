import crypto from 'crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EncryptionService } from '../../lib/encryption';

// Mock crypto module
vi.mock('crypto', () => {
  const mockBuffer = (size: number, fill: string = 'a') => {
    const buffer = Buffer.alloc(size, fill);
    buffer.toString = vi.fn().mockReturnValue(fill.repeat(size * 2));
    return buffer;
  };

  return {
    default: {
      randomBytes: vi
        .fn()
        .mockImplementation((size: number) => mockBuffer(size)),
      pbkdf2Sync: vi.fn().mockImplementation(() => mockBuffer(32, 'b')),
      createCipherGCM: vi.fn(),
      createDecipherGCM: vi.fn(),
      timingSafeEqual: vi.fn(),
      randomFillSync: vi.fn(),
    },
  };
});

describe('EncryptionService', () => {
  let encryptionService: EncryptionService;
  const mockCrypto = crypto as any;

  beforeEach(() => {
    // Set up environment variable
    process.env.PAYMENT_ENCRYPTION_KEY = 'test_master_key_32_characters_long';

    // Reset mocks
    vi.clearAllMocks();

    // Reset crypto function implementations
    mockCrypto.randomBytes.mockClear();
    mockCrypto.pbkdf2Sync.mockClear();

    const mockCipher = {
      setAAD: vi.fn(),
      update: vi.fn().mockReturnValue('encrypted_part'),
      final: vi.fn().mockReturnValue('_final'),
      getAuthTag: vi.fn().mockReturnValue(Buffer.alloc(16, 'c')),
    };

    const mockDecipher = {
      setAAD: vi.fn(),
      setAuthTag: vi.fn(),
      update: vi.fn().mockReturnValue('decrypted_part'),
      final: vi.fn().mockReturnValue('_final'),
    };

    mockCrypto.createCipherGCM.mockReturnValue(mockCipher);
    mockCrypto.createDecipherGCM.mockReturnValue(mockDecipher);
    mockCrypto.timingSafeEqual.mockReturnValue(true);

    encryptionService = new EncryptionService();
  });

  afterEach(() => {
    delete process.env.PAYMENT_ENCRYPTION_KEY;
    vi.resetAllMocks();
  });

  describe('encrypt', () => {
    it('should encrypt data successfully', async () => {
      const testData = 'sensitive payment data';
      const context = 'test-context';

      const result = await encryptionService.encrypt(testData, context);

      expect(result).toHaveProperty('encrypted');
      expect(result).toHaveProperty('iv');
      expect(result).toHaveProperty('tag');
      expect(result).toHaveProperty('salt');

      // Verify crypto functions were called
      expect(mockCrypto.randomBytes).toHaveBeenCalledWith(32); // salt
      expect(mockCrypto.randomBytes).toHaveBeenCalledWith(16); // iv
      expect(mockCrypto.pbkdf2Sync).toHaveBeenCalled();
      expect(mockCrypto.createCipherGCM).toHaveBeenCalled();
    });

    it('should use default context when none provided', async () => {
      const testData = 'sensitive payment data';

      await encryptionService.encrypt(testData);

      const mockCipher = mockCrypto.createCipherGCM.mock.results[0].value;
      expect(mockCipher.setAAD).toHaveBeenCalledWith(
        Buffer.from('payment-data', 'utf8')
      );
    });

    it('should handle encryption errors gracefully', async () => {
      mockCrypto.createCipherGCM.mockImplementation(() => {
        throw new Error('Cipher creation failed');
      });

      await expect(encryptionService.encrypt('test data')).rejects.toThrow(
        'Failed to encrypt sensitive data'
      );
    });
  });

  describe('decrypt', () => {
    it('should decrypt data successfully', async () => {
      const encryptedData = {
        encrypted: 'encrypted_data',
        iv: 'aaaaaaaaaaaaaaaa', // 16 bytes of 'a'
        tag: 'cccccccccccccccccccccccccccccccc', // 16 bytes of 'c'
        salt: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', // 32 bytes of 'a'
      };

      const result = await encryptionService.decrypt(encryptedData);

      expect(result).toBe('decrypted_part_final');
      expect(mockCrypto.createDecipherGCM).toHaveBeenCalled();
    });

    it('should handle decryption errors gracefully', async () => {
      mockCrypto.createDecipherGCM.mockImplementation(() => {
        throw new Error('Decipher creation failed');
      });

      const encryptedData = {
        encrypted: 'encrypted_data',
        iv: 'iv_data',
        tag: 'tag_data',
        salt: 'salt_data',
      };

      await expect(encryptionService.decrypt(encryptedData)).rejects.toThrow(
        'Failed to decrypt sensitive data'
      );
    });
  });

  describe('generateToken', () => {
    it('should generate token with default prefix', () => {
      const token = encryptionService.generateToken();

      expect(token).toMatch(/^pm_[a-z0-9]+_[a-f0-9]{32}$/);
    });

    it('should generate token with custom prefix', () => {
      const token = encryptionService.generateToken('custom');

      expect(token).toMatch(/^custom_[a-z0-9]+_[a-f0-9]{32}$/);
    });

    it('should generate unique tokens', () => {
      const token1 = encryptionService.generateToken();
      const token2 = encryptionService.generateToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('hash', () => {
    it('should hash data with generated salt', () => {
      const testData = 'password123';

      const result = encryptionService.hash(testData);

      expect(result).toHaveProperty('hash');
      expect(result).toHaveProperty('salt');
      expect(typeof result.hash).toBe('string');
      expect(typeof result.salt).toBe('string');
      expect(mockCrypto.pbkdf2Sync).toHaveBeenCalled();
    });

    it('should hash data with provided salt', () => {
      const testData = 'password123';
      const providedSalt = 'existing_salt';

      const result = encryptionService.hash(testData, providedSalt);

      expect(result.salt).toBe(providedSalt);
      expect(mockCrypto.pbkdf2Sync).toHaveBeenCalledWith(
        testData,
        providedSalt,
        100000,
        64,
        'sha256'
      );
    });
  });

  describe('verifyHash', () => {
    it('should verify hash successfully', () => {
      const testData = 'password123';
      const testHash = 'test_hash';
      const testSalt = 'test_salt';

      // Mock pbkdf2Sync to return the same hash for verification
      mockCrypto.pbkdf2Sync.mockReturnValue(Buffer.from(testHash, 'hex'));

      const result = encryptionService.verifyHash(testData, testHash, testSalt);

      expect(result).toBe(true);
      expect(mockCrypto.timingSafeEqual).toHaveBeenCalled();
    });

    it('should return false for invalid hash', () => {
      mockCrypto.timingSafeEqual.mockReturnValue(false);

      const result = encryptionService.verifyHash(
        'password123',
        'wrong_hash',
        'salt'
      );

      expect(result).toBe(false);
    });
  });

  describe('secureWipe', () => {
    it('should attempt to wipe string data', () => {
      const sensitiveData = 'sensitive_data';

      // This should not throw an error
      expect(() => {
        encryptionService.secureWipe(sensitiveData);
      }).not.toThrow();

      expect(mockCrypto.randomFillSync).toHaveBeenCalled();
    });

    it('should handle non-string data gracefully', () => {
      expect(() => {
        encryptionService.secureWipe(null as any);
      }).not.toThrow();

      expect(() => {
        encryptionService.secureWipe(undefined as any);
      }).not.toThrow();

      expect(() => {
        encryptionService.secureWipe(123 as any);
      }).not.toThrow();
    });
  });

  describe('constructor', () => {
    it('should use environment variable for master key', () => {
      process.env.PAYMENT_ENCRYPTION_KEY = 'custom_master_key';

      const service = new EncryptionService();

      // The service should be created without errors
      expect(service).toBeInstanceOf(EncryptionService);
    });

    it('should generate master key when environment variable not set', () => {
      delete process.env.PAYMENT_ENCRYPTION_KEY;

      const service = new EncryptionService();

      // The service should be created without errors
      expect(service).toBeInstanceOf(EncryptionService);
    });
  });
});
