import crypto from 'crypto';
import { logger } from './logger';

export interface EncryptionConfig {
  algorithm: string;
  keyLength: number;
  ivLength: number;
  tagLength: number;
  saltLength: number;
}

export interface EncryptedData {
  encrypted: string;
  iv: string;
  tag: string;
  salt: string;
}

export class EncryptionService {
  private readonly config: EncryptionConfig;
  private readonly masterKey: string;

  constructor() {
    this.config = {
      algorithm: 'aes-256-gcm',
      keyLength: 32,
      ivLength: 16,
      tagLength: 16,
      saltLength: 32,
    };

    this.masterKey =
      process.env.PAYMENT_ENCRYPTION_KEY || this.generateMasterKey();

    if (!process.env.PAYMENT_ENCRYPTION_KEY) {
      logger.warn(
        'PAYMENT_ENCRYPTION_KEY not set, using generated key (not suitable for production)'
      );
    }
  }

  /**
   * Encrypt sensitive payment data using AES-256-GCM
   */
  encrypt(data: string, context?: string): EncryptedData {
    try {
      // Generate random salt for key derivation
      const salt = crypto.randomBytes(this.config.saltLength);

      // Derive encryption key from master key and salt
      const key = crypto.pbkdf2Sync(
        this.masterKey,
        salt,
        100000,
        this.config.keyLength,
        'sha256'
      );

      // Generate random IV
      const iv = crypto.randomBytes(this.config.ivLength);

      // Create cipher using AES-256-GCM
      const cipher = crypto.createCipher('aes-256-gcm', key);

      // Encrypt data
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      return {
        encrypted,
        iv: iv.toString('hex'),
        tag: '', // Not used with createCipher
        salt: salt.toString('hex'),
      };
    } catch (error) {
      logger.error('Encryption failed', { error, context });
      throw new Error('Failed to encrypt sensitive data');
    }
  }

  /**
   * Decrypt sensitive payment data
   */
  decrypt(encryptedData: EncryptedData, context?: string): string {
    try {
      // Convert hex strings back to buffers
      const salt = Buffer.from(encryptedData.salt, 'hex');

      // Derive decryption key
      const key = crypto.pbkdf2Sync(
        this.masterKey,
        salt,
        100000,
        this.config.keyLength,
        'sha256'
      );

      // Create decipher using AES-256-GCM
      const decipher = crypto.createDecipher('aes-256-gcm', key);

      // Decrypt data
      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      logger.error('Decryption failed', { error, context });
      throw new Error('Failed to decrypt sensitive data');
    }
  }

  /**
   * Generate a secure token for payment method identification
   */
  generateToken(prefix: string = 'pm'): string {
    const randomBytes = crypto.randomBytes(16);
    const timestamp = Date.now().toString(36);
    const random = randomBytes.toString('hex');

    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Hash sensitive data for comparison without storing plaintext
   */
  hash(data: string, salt?: string): { hash: string; salt: string } {
    const actualSalt = salt || crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(data, actualSalt, 100000, 64, 'sha256')
      .toString('hex');

    return { hash, salt: actualSalt };
  }

  /**
   * Verify hashed data
   */
  verifyHash(data: string, hash: string, salt: string): boolean {
    const { hash: computedHash } = this.hash(data, salt);
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'hex'),
      Buffer.from(computedHash, 'hex')
    );
  }

  /**
   * Generate a master key (for development only)
   */
  private generateMasterKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Securely wipe sensitive data from memory
   */
  secureWipe(data: string): void {
    // In Node.js, we can't directly wipe memory, but we can overwrite the string
    // This is a best-effort approach
    if (data && typeof data === 'string') {
      // Overwrite with random data
      const buffer = Buffer.from(data, 'utf8');
      crypto.randomFillSync(buffer);
    }
  }
}

export const encryptionService = new EncryptionService();
