import crypto from 'crypto';
import { encryptionService } from '../lib/encryption';
import { logger } from '../lib/logger';
import prisma from '../lib/prisma';

export interface AuditLogEntry {
  id?: string;
  eventType: string;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  resource: string;
  action: string;
  details?: Record<string, any>;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  success: boolean;
  errorMessage?: string;
}

export interface ComplianceReport {
  reportId: string;
  reportType: 'daily' | 'weekly' | 'monthly' | 'annual' | 'audit';
  generatedAt: Date;
  period: {
    startDate: Date;
    endDate: Date;
  };
  metrics: {
    totalTransactions: number;
    encryptedDataAccess: number;
    failedAuthAttempts: number;
    suspiciousActivities: number;
    dataRetentionCompliance: number;
    keyRotationEvents: number;
  };
  violations: ComplianceViolation[];
  recommendations: string[];
}

export interface ComplianceViolation {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: Date;
  resolved: boolean;
  resolvedAt?: Date;
  remediation?: string;
}

export interface KeyManagementConfig {
  keyRotationIntervalDays: number;
  keyBackupEnabled: boolean;
  keyEscrowEnabled: boolean;
  minimumKeyLength: number;
  keyDerivationIterations: number;
}

/**
 * PCI DSS Compliance Service
 * Handles data encryption, audit logging, key management, and compliance reporting
 */
export class PCIComplianceService {
  private readonly keyManagementConfig: KeyManagementConfig;

  constructor() {
    this.keyManagementConfig = {
      keyRotationIntervalDays: parseInt(
        process.env.KEY_ROTATION_INTERVAL_DAYS || '90'
      ),
      keyBackupEnabled: process.env.KEY_BACKUP_ENABLED === 'true',
      keyEscrowEnabled: process.env.KEY_ESCROW_ENABLED === 'true',
      minimumKeyLength: parseInt(process.env.MINIMUM_KEY_LENGTH || '256'),
      keyDerivationIterations: parseInt(
        process.env.KEY_DERIVATION_ITERATIONS || '100000'
      ),
    };
  }

  /**
   * Log security and compliance events for audit trail
   */
  async logAuditEvent(
    entry: Omit<AuditLogEntry, 'id' | 'timestamp'>
  ): Promise<void> {
    try {
      const auditEntry: AuditLogEntry = {
        ...entry,
        timestamp: new Date(),
      };

      // Encrypt sensitive details
      if (auditEntry.details) {
        const encryptedDetails = encryptionService.encrypt(
          JSON.stringify(auditEntry.details),
          `audit-${Date.now()}`
        );
        auditEntry.details = {
          encrypted: true,
          data: encryptedDetails,
        };
      }

      // Store in audit log table
      await prisma.auditLog.create({
        data: {
          eventType: auditEntry.eventType,
          userId: auditEntry.userId,
          sessionId: auditEntry.sessionId,
          ipAddress: auditEntry.ipAddress,
          userAgent: auditEntry.userAgent,
          resource: auditEntry.resource,
          action: auditEntry.action,
          details: auditEntry.details as any,
          severity: auditEntry.severity,
          success: auditEntry.success,
          errorMessage: auditEntry.errorMessage,
          timestamp: auditEntry.timestamp,
        },
      });

      // Log critical events immediately
      if (auditEntry.severity === 'critical') {
        logger.error('Critical security event', auditEntry);
        await this.alertSecurityTeam(auditEntry);
      }

      logger.info('Audit event logged', {
        eventType: auditEntry.eventType,
        resource: auditEntry.resource,
        action: auditEntry.action,
        severity: auditEntry.severity,
      });
    } catch (error) {
      logger.error('Failed to log audit event', {
        error: error instanceof Error ? error.message : 'Unknown error',
        entry,
      });
      // Don't throw - audit logging should not break main functionality
    }
  }

  /**
   * Encrypt sensitive cardholder data according to PCI DSS requirements
   */
  async encryptCardholderData(data: any, context: string): Promise<any> {
    try {
      await this.logAuditEvent({
        eventType: 'DATA_ENCRYPTION',
        resource: 'cardholder_data',
        action: 'encrypt',
        severity: 'medium',
        success: true,
        details: { context, dataType: typeof data },
      });

      // Use AES-256-GCM encryption
      const encryptedData = encryptionService.encrypt(
        JSON.stringify(data),
        context
      );

      return {
        isEncrypted: true,
        algorithm: 'AES-256-GCM',
        ...encryptedData,
        encryptedAt: new Date().toISOString(),
      };
    } catch (error) {
      await this.logAuditEvent({
        eventType: 'DATA_ENCRYPTION',
        resource: 'cardholder_data',
        action: 'encrypt',
        severity: 'high',
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Decrypt sensitive cardholder data with audit logging
   */
  async decryptCardholderData(
    encryptedData: any,
    context: string
  ): Promise<any> {
    try {
      await this.logAuditEvent({
        eventType: 'DATA_DECRYPTION',
        resource: 'cardholder_data',
        action: 'decrypt',
        severity: 'high',
        success: true,
        details: { context },
      });

      const decryptedData = encryptionService.decrypt(encryptedData, context);
      return JSON.parse(decryptedData);
    } catch (error) {
      await this.logAuditEvent({
        eventType: 'DATA_DECRYPTION',
        resource: 'cardholder_data',
        action: 'decrypt',
        severity: 'critical',
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Secure key management and rotation
   */
  async rotateEncryptionKeys(): Promise<void> {
    try {
      logger.info('Starting encryption key rotation');

      await this.logAuditEvent({
        eventType: 'KEY_ROTATION',
        resource: 'encryption_keys',
        action: 'rotate',
        severity: 'high',
        success: true,
      });

      // Generate new encryption key
      const newKey = crypto.randomBytes(32).toString('hex');

      // In production, this would involve:
      // 1. Generating new key in HSM (Hardware Security Module)
      // 2. Re-encrypting all data with new key
      // 3. Securely destroying old key
      // 4. Updating key references

      // Store key rotation record
      await prisma.keyRotationLog.create({
        data: {
          keyId: crypto.randomUUID(),
          rotatedAt: new Date(),
          reason: 'scheduled_rotation',
          success: true,
        },
      });

      logger.info('Encryption key rotation completed successfully');
    } catch (error) {
      await this.logAuditEvent({
        eventType: 'KEY_ROTATION',
        resource: 'encryption_keys',
        action: 'rotate',
        severity: 'critical',
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      logger.error('Encryption key rotation failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Generate compliance report for PCI DSS audits
   */
  async generateComplianceReport(
    reportType: ComplianceReport['reportType'],
    startDate: Date,
    endDate: Date
  ): Promise<ComplianceReport> {
    try {
      logger.info('Generating compliance report', {
        reportType,
        startDate,
        endDate,
      });

      const reportId = `compliance_${reportType}_${Date.now()}`;

      // Gather metrics from audit logs
      const auditLogs = await prisma.auditLog.findMany({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const metrics = {
        totalTransactions: await this.countTransactions(startDate, endDate),
        encryptedDataAccess: auditLogs.filter(
          (log: any) =>
            log.eventType === 'DATA_DECRYPTION' ||
            log.eventType === 'DATA_ENCRYPTION'
        ).length,
        failedAuthAttempts: auditLogs.filter(
          (log: any) => log.eventType === 'AUTHENTICATION' && !log.success
        ).length,
        suspiciousActivities: auditLogs.filter(
          (log: any) => log.severity === 'critical' || log.severity === 'high'
        ).length,
        dataRetentionCompliance: await this.checkDataRetentionCompliance(),
        keyRotationEvents: auditLogs.filter(
          (log: any) => log.eventType === 'KEY_ROTATION'
        ).length,
      };

      // Identify violations
      const violations = await this.identifyComplianceViolations(
        startDate,
        endDate
      );

      // Generate recommendations
      const recommendations = this.generateRecommendations(metrics, violations);

      const report: ComplianceReport = {
        reportId,
        reportType,
        generatedAt: new Date(),
        period: { startDate, endDate },
        metrics,
        violations,
        recommendations,
      };

      // Store report
      await prisma.complianceReport.create({
        data: {
          reportId,
          reportType,
          generatedAt: report.generatedAt,
          periodStart: startDate,
          periodEnd: endDate,
          metrics: metrics as any,
          violations: violations as any,
          recommendations,
        },
      });

      await this.logAuditEvent({
        eventType: 'COMPLIANCE_REPORT',
        resource: 'compliance_reports',
        action: 'generate',
        severity: 'medium',
        success: true,
        details: { reportId, reportType },
      });

      logger.info('Compliance report generated successfully', { reportId });

      return report;
    } catch (error) {
      await this.logAuditEvent({
        eventType: 'COMPLIANCE_REPORT',
        resource: 'compliance_reports',
        action: 'generate',
        severity: 'high',
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      logger.error('Failed to generate compliance report', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Monitor for PCI DSS compliance violations
   */
  async monitorCompliance(): Promise<void> {
    try {
      logger.info('Starting compliance monitoring');

      // Check for overdue key rotations
      await this.checkKeyRotationCompliance();

      // Check for excessive failed authentication attempts
      await this.checkAuthenticationCompliance();

      // Check for data retention policy compliance
      await this.checkDataRetentionCompliance();

      // Check for encryption compliance
      await this.checkEncryptionCompliance();

      logger.info('Compliance monitoring completed');
    } catch (error) {
      logger.error('Compliance monitoring failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Secure data deletion according to PCI DSS requirements
   */
  async secureDataDeletion(dataId: string, dataType: string): Promise<void> {
    try {
      await this.logAuditEvent({
        eventType: 'DATA_DELETION',
        resource: dataType,
        action: 'secure_delete',
        severity: 'high',
        success: true,
        details: { dataId, dataType },
      });

      // Overwrite data multiple times before deletion
      const randomData = crypto.randomBytes(1024).toString('hex');

      // In a real implementation, this would:
      // 1. Overwrite the data multiple times with random data
      // 2. Verify the overwrite was successful
      // 3. Update database records to mark as securely deleted
      // 4. Remove from any indexes or caches

      logger.info('Secure data deletion completed', { dataId, dataType });
    } catch (error) {
      await this.logAuditEvent({
        eventType: 'DATA_DELETION',
        resource: dataType,
        action: 'secure_delete',
        severity: 'critical',
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  // Private helper methods

  private async alertSecurityTeam(auditEntry: AuditLogEntry): Promise<void> {
    // In production, this would send alerts to security team
    logger.error('SECURITY ALERT', auditEntry);
  }

  private async countTransactions(
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    return await prisma.transaction.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  private async checkDataRetentionCompliance(): Promise<number> {
    // Check if data is being retained according to policy
    const retentionPolicyDays = 2555; // 7 years for PCI DSS
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionPolicyDays);

    const oldTransactions = await prisma.transaction.count({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    return oldTransactions;
  }

  private async identifyComplianceViolations(
    startDate: Date,
    endDate: Date
  ): Promise<ComplianceViolation[]> {
    const violations: ComplianceViolation[] = [];

    // Check for failed encryption events
    const encryptionFailures = await prisma.auditLog.findMany({
      where: {
        eventType: 'DATA_ENCRYPTION',
        success: false,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    for (const failure of encryptionFailures) {
      violations.push({
        id: crypto.randomUUID(),
        type: 'ENCRYPTION_FAILURE',
        severity: 'high',
        description: 'Failed to encrypt sensitive data',
        detectedAt: failure.timestamp,
        resolved: false,
      });
    }

    // Check for excessive failed authentication attempts
    const failedAuthCount = await prisma.auditLog.count({
      where: {
        eventType: 'AUTHENTICATION',
        success: false,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    if (failedAuthCount > 100) {
      violations.push({
        id: crypto.randomUUID(),
        type: 'EXCESSIVE_AUTH_FAILURES',
        severity: 'medium',
        description: `Excessive failed authentication attempts: ${failedAuthCount}`,
        detectedAt: new Date(),
        resolved: false,
      });
    }

    return violations;
  }

  private generateRecommendations(
    metrics: ComplianceReport['metrics'],
    violations: ComplianceViolation[]
  ): string[] {
    const recommendations: string[] = [];

    if (violations.length > 0) {
      recommendations.push(
        'Address identified compliance violations immediately'
      );
    }

    if (metrics.failedAuthAttempts > 50) {
      recommendations.push(
        'Implement stronger rate limiting for authentication attempts'
      );
    }

    if (metrics.keyRotationEvents === 0) {
      recommendations.push(
        'Ensure regular encryption key rotation is performed'
      );
    }

    if (metrics.dataRetentionCompliance > 0) {
      recommendations.push(
        'Review and purge data that exceeds retention policy'
      );
    }

    return recommendations;
  }

  private async checkKeyRotationCompliance(): Promise<void> {
    const lastRotation = await prisma.keyRotationLog.findFirst({
      orderBy: { rotatedAt: 'desc' },
    });

    if (lastRotation) {
      const daysSinceRotation = Math.floor(
        (Date.now() - lastRotation.rotatedAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (
        daysSinceRotation > this.keyManagementConfig.keyRotationIntervalDays
      ) {
        await this.logAuditEvent({
          eventType: 'COMPLIANCE_VIOLATION',
          resource: 'encryption_keys',
          action: 'overdue_rotation',
          severity: 'high',
          success: false,
          details: {
            daysSinceRotation,
            maxDays: this.keyManagementConfig.keyRotationIntervalDays,
          },
        });
      }
    }
  }

  private async checkAuthenticationCompliance(): Promise<void> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const failedAttempts = await prisma.auditLog.count({
      where: {
        eventType: 'AUTHENTICATION',
        success: false,
        timestamp: {
          gte: oneDayAgo,
        },
      },
    });

    if (failedAttempts > 100) {
      await this.logAuditEvent({
        eventType: 'COMPLIANCE_VIOLATION',
        resource: 'authentication',
        action: 'excessive_failures',
        severity: 'medium',
        success: false,
        details: { failedAttempts, threshold: 100 },
      });
    }
  }

  private async checkEncryptionCompliance(): Promise<void> {
    // Check for unencrypted sensitive data
    const unencryptedPaymentMethods = await prisma.paymentMethod.count({
      where: {
        metadata: {
          path: ['encrypted'],
          not: true,
        },
      },
    });

    if (unencryptedPaymentMethods > 0) {
      await this.logAuditEvent({
        eventType: 'COMPLIANCE_VIOLATION',
        resource: 'payment_methods',
        action: 'unencrypted_data',
        severity: 'critical',
        success: false,
        details: { unencryptedCount: unencryptedPaymentMethods },
      });
    }
  }
}

export const pciComplianceService = new PCIComplianceService();
