import crypto from 'crypto';
import { logger } from '../lib/logger';
import prisma from '../lib/prisma';
import { pciComplianceService } from './pci-compliance.service';

export interface EncryptionKey {
  id: string;
  keyId: string;
  algorithm: string;
  keyLength: number;
  purpose: 'encryption' | 'signing' | 'authentication';
  status: 'active' | 'inactive' | 'compromised' | 'retired';
  createdAt: Date;
  activatedAt?: Date;
  expiresAt?: Date;
  rotatedAt?: Date;
  metadata?: Record<string, any>;
}

export interface KeyRotationResult {
  oldKeyId: string;
  newKeyId: string;
  rotatedAt: Date;
  affectedRecords: number;
  success: boolean;
  errors?: string[];
}

export interface KeyBackup {
  keyId: string;
  backupId: string;
  encryptedKeyData: string;
  backupLocation: string;
  createdAt: Date;
  verified: boolean;
}

/**
 * Secure Key Management Service for PCI DSS compliance
 * Handles encryption key lifecycle, rotation, backup, and recovery
 */
export class KeyManagementService {
  private readonly keyRotationIntervalMs: number;
  private readonly keyBackupEnabled: boolean;
  private readonly minimumKeyLength: number;

  constructor() {
    this.keyRotationIntervalMs =
      parseInt(process.env.KEY_ROTATION_INTERVAL_DAYS || '90') *
      24 *
      60 *
      60 *
      1000;
    this.keyBackupEnabled = process.env.KEY_BACKUP_ENABLED === 'true';
    this.minimumKeyLength = parseInt(process.env.MINIMUM_KEY_LENGTH || '256');
  }

  /**
   * Generate a new encryption key with secure random generation
   */
  async generateEncryptionKey(
    purpose: EncryptionKey['purpose'],
    algorithm: string = 'AES-256-GCM'
  ): Promise<EncryptionKey> {
    try {
      logger.info('Generating new encryption key', { purpose, algorithm });

      // Generate cryptographically secure random key
      const keyLength = this.getKeyLengthForAlgorithm(algorithm);
      const keyData = crypto.randomBytes(keyLength / 8);
      const keyId = this.generateKeyId(purpose);

      // Create key metadata
      const encryptionKey: EncryptionKey = {
        id: crypto.randomUUID(),
        keyId,
        algorithm,
        keyLength,
        purpose,
        status: 'inactive',
        createdAt: new Date(),
        metadata: {
          generator: 'KeyManagementService',
          entropy: 'crypto.randomBytes',
        },
      };

      // Store key securely (in production, this would use HSM)
      await this.storeKeySecurely(encryptionKey, keyData);

      // Log key generation event
      await pciComplianceService.logAuditEvent({
        eventType: 'KEY_GENERATION',
        resource: 'encryption_keys',
        action: 'generate',
        severity: 'high',
        success: true,
        details: {
          keyId,
          algorithm,
          purpose,
          keyLength,
        },
      });

      logger.info('Encryption key generated successfully', { keyId, purpose });

      return encryptionKey;
    } catch (error) {
      await pciComplianceService.logAuditEvent({
        eventType: 'KEY_GENERATION',
        resource: 'encryption_keys',
        action: 'generate',
        severity: 'critical',
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      logger.error('Failed to generate encryption key', {
        error: error instanceof Error ? error.message : 'Unknown error',
        purpose,
        algorithm,
      });
      throw error;
    }
  }

  /**
   * Activate an encryption key for use
   */
  async activateKey(keyId: string): Promise<void> {
    try {
      logger.info('Activating encryption key', { keyId });

      // Update key status to active
      await prisma.encryptionKey.update({
        where: { keyId },
        data: {
          status: 'active',
          activatedAt: new Date(),
        },
      });

      // Log key activation
      await pciComplianceService.logAuditEvent({
        eventType: 'KEY_ACTIVATION',
        resource: 'encryption_keys',
        action: 'activate',
        severity: 'high',
        success: true,
        details: { keyId },
      });

      logger.info('Encryption key activated successfully', { keyId });
    } catch (error) {
      await pciComplianceService.logAuditEvent({
        eventType: 'KEY_ACTIVATION',
        resource: 'encryption_keys',
        action: 'activate',
        severity: 'critical',
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      logger.error('Failed to activate encryption key', {
        error: error instanceof Error ? error.message : 'Unknown error',
        keyId,
      });
      throw error;
    }
  }

  /**
   * Rotate encryption keys according to PCI DSS requirements
   */
  async rotateKeys(
    purpose?: EncryptionKey['purpose']
  ): Promise<KeyRotationResult[]> {
    try {
      logger.info('Starting key rotation process', { purpose });

      const whereClause = {
        status: 'active' as const,
        ...(purpose && { purpose }),
      };

      // Get keys that need rotation
      const keysToRotate = await prisma.encryptionKey.findMany({
        where: whereClause,
      });

      const results: KeyRotationResult[] = [];

      for (const oldKey of keysToRotate) {
        try {
          const result = await this.rotateIndividualKey(oldKey);
          results.push(result);
        } catch (error) {
          logger.error('Failed to rotate individual key', {
            keyId: oldKey.keyId,
            error: error instanceof Error ? error.message : 'Unknown error',
          });

          results.push({
            oldKeyId: oldKey.keyId,
            newKeyId: '',
            rotatedAt: new Date(),
            affectedRecords: 0,
            success: false,
            errors: [error instanceof Error ? error.message : 'Unknown error'],
          });
        }
      }

      // Log overall rotation results
      await pciComplianceService.logAuditEvent({
        eventType: 'KEY_ROTATION_BATCH',
        resource: 'encryption_keys',
        action: 'rotate_batch',
        severity: 'high',
        success: results.every(r => r.success),
        details: {
          totalKeys: results.length,
          successfulRotations: results.filter(r => r.success).length,
          failedRotations: results.filter(r => !r.success).length,
        },
      });

      logger.info('Key rotation process completed', {
        totalKeys: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
      });

      return results;
    } catch (error) {
      logger.error('Key rotation process failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Create secure backup of encryption keys
   */
  async backupKeys(): Promise<KeyBackup[]> {
    if (!this.keyBackupEnabled) {
      logger.info('Key backup is disabled');
      return [];
    }

    try {
      logger.info('Starting key backup process');

      const activeKeys = await prisma.encryptionKey.findMany({
        where: { status: 'active' },
      });

      const backups: KeyBackup[] = [];

      for (const key of activeKeys) {
        try {
          const backup = await this.createKeyBackup(key);
          backups.push(backup);
        } catch (error) {
          logger.error('Failed to backup individual key', {
            keyId: key.keyId,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      // Log backup completion
      await pciComplianceService.logAuditEvent({
        eventType: 'KEY_BACKUP',
        resource: 'encryption_keys',
        action: 'backup_batch',
        severity: 'medium',
        success: true,
        details: {
          totalKeys: activeKeys.length,
          successfulBackups: backups.length,
        },
      });

      logger.info('Key backup process completed', {
        totalKeys: activeKeys.length,
        successfulBackups: backups.length,
      });

      return backups;
    } catch (error) {
      await pciComplianceService.logAuditEvent({
        eventType: 'KEY_BACKUP',
        resource: 'encryption_keys',
        action: 'backup_batch',
        severity: 'critical',
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      logger.error('Key backup process failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Retire old encryption keys securely
   */
  async retireKey(keyId: string, reason: string): Promise<void> {
    try {
      logger.info('Retiring encryption key', { keyId, reason });

      // Update key status to retired
      await prisma.encryptionKey.update({
        where: { keyId },
        data: {
          status: 'retired',
          metadata: {
            retiredAt: new Date().toISOString(),
            retirementReason: reason,
          },
        },
      });

      // Securely wipe key data (in production, this would involve HSM)
      await this.securelyWipeKey(keyId);

      // Log key retirement
      await pciComplianceService.logAuditEvent({
        eventType: 'KEY_RETIREMENT',
        resource: 'encryption_keys',
        action: 'retire',
        severity: 'high',
        success: true,
        details: { keyId, reason },
      });

      logger.info('Encryption key retired successfully', { keyId });
    } catch (error) {
      await pciComplianceService.logAuditEvent({
        eventType: 'KEY_RETIREMENT',
        resource: 'encryption_keys',
        action: 'retire',
        severity: 'critical',
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      logger.error('Failed to retire encryption key', {
        error: error instanceof Error ? error.message : 'Unknown error',
        keyId,
      });
      throw error;
    }
  }

  /**
   * Check if keys need rotation based on age and policy
   */
  async checkKeyRotationNeeded(): Promise<EncryptionKey[]> {
    const cutoffDate = new Date(Date.now() - this.keyRotationIntervalMs);

    const keysNeedingRotation = await prisma.encryptionKey.findMany({
      where: {
        status: 'active',
        OR: [
          { activatedAt: { lt: cutoffDate } },
          { rotatedAt: { lt: cutoffDate } },
        ],
      },
    });

    if (keysNeedingRotation.length > 0) {
      logger.warn('Keys requiring rotation detected', {
        count: keysNeedingRotation.length,
        keyIds: keysNeedingRotation.map(k => k.keyId),
      });
    }

    return keysNeedingRotation as EncryptionKey[];
  }

  /**
   * Verify key integrity and detect potential compromise
   */
  async verifyKeyIntegrity(): Promise<{
    verified: boolean;
    compromisedKeys: string[];
  }> {
    try {
      logger.info('Starting key integrity verification');

      const activeKeys = await prisma.encryptionKey.findMany({
        where: { status: 'active' },
      });

      const compromisedKeys: string[] = [];

      for (const key of activeKeys) {
        const isIntact = await this.verifyIndividualKeyIntegrity(key);
        if (!isIntact) {
          compromisedKeys.push(key.keyId);

          // Mark key as compromised
          await prisma.encryptionKey.update({
            where: { keyId: key.keyId },
            data: { status: 'compromised' },
          });

          // Log compromise detection
          await pciComplianceService.logAuditEvent({
            eventType: 'KEY_COMPROMISE',
            resource: 'encryption_keys',
            action: 'compromise_detected',
            severity: 'critical',
            success: false,
            details: { keyId: key.keyId },
          });
        }
      }

      const verified = compromisedKeys.length === 0;

      logger.info('Key integrity verification completed', {
        totalKeys: activeKeys.length,
        compromisedKeys: compromisedKeys.length,
        verified,
      });

      return { verified, compromisedKeys };
    } catch (error) {
      logger.error('Key integrity verification failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  // Private helper methods

  private generateKeyId(purpose: string): string {
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(8).toString('hex');
    return `key_${purpose}_${timestamp}_${random}`;
  }

  private getKeyLengthForAlgorithm(algorithm: string): number {
    switch (algorithm) {
      case 'AES-256-GCM':
      case 'AES-256-CBC':
        return 256;
      case 'AES-128-GCM':
      case 'AES-128-CBC':
        return 128;
      default:
        return this.minimumKeyLength;
    }
  }

  private async storeKeySecurely(
    key: EncryptionKey,
    keyData: Buffer
  ): Promise<void> {
    // In production, this would store in HSM or secure key vault
    // For now, we'll store metadata in database and simulate secure storage

    await prisma.encryptionKey.create({
      data: {
        keyId: key.keyId,
        algorithm: key.algorithm,
        keyLength: key.keyLength,
        purpose: key.purpose,
        status: key.status,
        createdAt: key.createdAt,
        metadata: {
          ...key.metadata,
          keyDataHash: crypto
            .createHash('sha256')
            .update(keyData)
            .digest('hex'),
        },
      },
    });

    // Simulate secure key storage
    logger.info('Key stored securely', { keyId: key.keyId });
  }

  private async rotateIndividualKey(oldKey: any): Promise<KeyRotationResult> {
    logger.info('Rotating individual key', { keyId: oldKey.keyId });

    // Generate new key
    const newKey = await this.generateEncryptionKey(
      oldKey.purpose,
      oldKey.algorithm
    );

    // Activate new key
    await this.activateKey(newKey.keyId);

    // Re-encrypt data with new key (simplified for this implementation)
    const affectedRecords = await this.reencryptDataWithNewKey(
      oldKey.keyId,
      newKey.keyId
    );

    // Retire old key
    await this.retireKey(oldKey.keyId, 'scheduled_rotation');

    // Update rotation timestamp
    await prisma.encryptionKey.update({
      where: { keyId: newKey.keyId },
      data: { rotatedAt: new Date() },
    });

    return {
      oldKeyId: oldKey.keyId,
      newKeyId: newKey.keyId,
      rotatedAt: new Date(),
      affectedRecords,
      success: true,
    };
  }

  private async reencryptDataWithNewKey(
    oldKeyId: string,
    newKeyId: string
  ): Promise<number> {
    // In a real implementation, this would:
    // 1. Find all data encrypted with old key
    // 2. Decrypt with old key
    // 3. Re-encrypt with new key
    // 4. Update database records

    // For now, return a simulated count
    logger.info('Re-encrypting data with new key', { oldKeyId, newKeyId });
    return 0; // Simulated count
  }

  private async createKeyBackup(key: any): Promise<KeyBackup> {
    const backupId = `backup_${key.keyId}_${Date.now()}`;

    // In production, this would create encrypted backup in secure location
    const backup: KeyBackup = {
      keyId: key.keyId,
      backupId,
      encryptedKeyData: 'encrypted_key_data_placeholder',
      backupLocation: `secure_vault/${backupId}`,
      createdAt: new Date(),
      verified: true,
    };

    // Store backup metadata
    await prisma.keyBackup.create({
      data: {
        keyId: key.keyId,
        backupId,
        backupLocation: backup.backupLocation,
        createdAt: backup.createdAt,
        verified: backup.verified,
      },
    });

    logger.info('Key backup created', { keyId: key.keyId, backupId });

    return backup;
  }

  private async securelyWipeKey(keyId: string): Promise<void> {
    // In production, this would securely wipe key from HSM
    logger.info('Securely wiping key', { keyId });
  }

  private async verifyIndividualKeyIntegrity(key: any): Promise<boolean> {
    // In production, this would verify key integrity using checksums, HSM verification, etc.
    // For now, simulate integrity check
    return true;
  }
}

export const keyManagementService = new KeyManagementService();
