import { logger } from '../lib/logger';
import { prisma } from '../lib/prisma';

export interface RefundAuditEvent {
  refundId: string;
  transactionId: string;
  amount: number;
  reason: string;
  requestedBy?: string;
  status: string;
  gatewayRefundId?: string;
  metadata?: Record<string, any>;
}

export interface DisputeAuditEvent {
  disputeId: string;
  transactionId: string;
  amount: number;
  reason: string;
  status: string;
  evidenceSubmitted?: boolean;
  gatewayDisputeId?: string;
  metadata?: Record<string, any>;
}

export class AuditService {
  /**
   * Log refund-related audit event
   */
  async logRefundEvent(event: RefundAuditEvent): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          eventType: 'REFUND_PROCESSED',
          entityType: 'refund',
          entityId: event.refundId,
          action: 'REFUND',
          resource: `refund/${event.refundId}`,
          details: {
            transactionId: event.transactionId,
            amount: event.amount,
            reason: event.reason,
            requestedBy: event.requestedBy,
            status: event.status,
            gatewayRefundId: event.gatewayRefundId,
            ...event.metadata,
          },
          severity: this.getRefundSeverity(event.amount, event.status),
          success: event.status === 'SUCCEEDED',
          errorMessage:
            event.status === 'FAILED' ? 'Refund processing failed' : null,
          pciCompliant: true,
          gdprRelevant: true,
        },
      });

      logger.info('Refund audit event logged', {
        refundId: event.refundId,
        transactionId: event.transactionId,
        status: event.status,
      });
    } catch (error) {
      logger.error('Failed to log refund audit event', { error, event });
      // Don't throw here as audit logging shouldn't break the main flow
    }
  }

  /**
   * Log dispute-related audit event
   */
  async logDisputeEvent(event: DisputeAuditEvent): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          eventType: 'DISPUTE_PROCESSED',
          entityType: 'dispute',
          entityId: event.disputeId,
          action: 'DISPUTE',
          resource: `dispute/${event.disputeId}`,
          details: {
            transactionId: event.transactionId,
            amount: event.amount,
            reason: event.reason,
            status: event.status,
            evidenceSubmitted: event.evidenceSubmitted,
            gatewayDisputeId: event.gatewayDisputeId,
            ...event.metadata,
          },
          severity: this.getDisputeSeverity(event.amount, event.status),
          success: ['won', 'warning_closed'].includes(event.status),
          errorMessage: event.status === 'lost' ? 'Dispute lost' : null,
          pciCompliant: true,
          gdprRelevant: true,
        },
      });

      logger.info('Dispute audit event logged', {
        disputeId: event.disputeId,
        transactionId: event.transactionId,
        status: event.status,
      });
    } catch (error) {
      logger.error('Failed to log dispute audit event', { error, event });
      // Don't throw here as audit logging shouldn't break the main flow
    }
  }

  /**
   * Log general payment audit event
   */
  async logPaymentEvent(
    eventType: string,
    entityType: string,
    entityId: string,
    action: string,
    details: Record<string, any>,
    success: boolean = true,
    errorMessage?: string
  ): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          eventType,
          entityType,
          entityId,
          action,
          resource: `${entityType}/${entityId}`,
          details,
          severity: this.getEventSeverity(eventType, success),
          success,
          errorMessage,
          pciCompliant: true,
          gdprRelevant: this.isGdprRelevant(eventType),
        },
      });

      logger.info('Payment audit event logged', {
        eventType,
        entityId,
        success,
      });
    } catch (error) {
      logger.error('Failed to log payment audit event', {
        error,
        eventType,
        entityId,
      });
      // Don't throw here as audit logging shouldn't break the main flow
    }
  }

  /**
   * Get audit logs for a specific entity
   */
  async getAuditLogs(
    entityType: string,
    entityId: string,
    limit: number = 50
  ): Promise<any[]> {
    try {
      const logs = await prisma.auditLog.findMany({
        where: {
          entityType,
          entityId,
        },
        orderBy: {
          timestamp: 'desc',
        },
        take: limit,
      });

      return logs;
    } catch (error) {
      logger.error('Failed to get audit logs', { error, entityType, entityId });
      throw error;
    }
  }

  /**
   * Get audit logs by date range
   */
  async getAuditLogsByDateRange(
    startDate: Date,
    endDate: Date,
    eventType?: string,
    limit: number = 100
  ): Promise<any[]> {
    try {
      const where: any = {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      };

      if (eventType) {
        where.eventType = eventType;
      }

      const logs = await prisma.auditLog.findMany({
        where,
        orderBy: {
          timestamp: 'desc',
        },
        take: limit,
      });

      return logs;
    } catch (error) {
      logger.error('Failed to get audit logs by date range', {
        error,
        startDate,
        endDate,
        eventType,
      });
      throw error;
    }
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(
    startDate: Date,
    endDate: Date,
    reportType: string = 'daily'
  ): Promise<any> {
    try {
      const logs = await this.getAuditLogsByDateRange(startDate, endDate);

      const report = {
        reportId: `compliance_${reportType}_${Date.now()}`,
        reportType,
        generatedAt: new Date(),
        periodStart: startDate,
        periodEnd: endDate,
        metrics: {
          totalEvents: logs.length,
          successfulEvents: logs.filter(log => log.success).length,
          failedEvents: logs.filter(log => !log.success).length,
          refundEvents: logs.filter(log => log.eventType === 'REFUND_PROCESSED')
            .length,
          disputeEvents: logs.filter(
            log => log.eventType === 'DISPUTE_PROCESSED'
          ).length,
          highSeverityEvents: logs.filter(log => log.severity === 'high')
            .length,
          criticalSeverityEvents: logs.filter(
            log => log.severity === 'critical'
          ).length,
        },
        violations: this.identifyViolations(logs),
        recommendations: this.generateRecommendations(logs),
      };

      // Store compliance report
      await prisma.complianceReport.create({
        data: {
          reportId: report.reportId,
          reportType,
          generatedAt: report.generatedAt,
          periodStart: startDate,
          periodEnd: endDate,
          metrics: report.metrics,
          violations: report.violations,
          recommendations: report.recommendations,
        },
      });

      return report;
    } catch (error) {
      logger.error('Failed to generate compliance report', {
        error,
        startDate,
        endDate,
        reportType,
      });
      throw error;
    }
  }

  /**
   * Determine refund event severity
   */
  private getRefundSeverity(amount: number, status: string): string {
    if (status === 'FAILED') return 'high';
    if (amount > 10000) return 'high';
    if (amount > 1000) return 'medium';
    return 'low';
  }

  /**
   * Determine dispute event severity
   */
  private getDisputeSeverity(amount: number, status: string): string {
    if (status === 'lost') return 'critical';
    if (amount > 10000) return 'high';
    if (amount > 1000) return 'medium';
    return 'low';
  }

  /**
   * Determine general event severity
   */
  private getEventSeverity(eventType: string, success: boolean): string {
    if (!success) return 'high';
    if (eventType.includes('DISPUTE')) return 'medium';
    if (eventType.includes('REFUND')) return 'medium';
    return 'low';
  }

  /**
   * Check if event is GDPR relevant
   */
  private isGdprRelevant(eventType: string): boolean {
    const gdprRelevantEvents = [
      'REFUND_PROCESSED',
      'DISPUTE_PROCESSED',
      'PAYMENT_METHOD_CREATED',
      'PAYMENT_METHOD_DELETED',
      'USER_DATA_ACCESS',
    ];
    return gdprRelevantEvents.includes(eventType);
  }

  /**
   * Identify compliance violations from audit logs
   */
  private identifyViolations(logs: any[]): string[] {
    const violations: string[] = [];

    // Check for excessive failed events
    const failedEvents = logs.filter(log => !log.success);
    if (failedEvents.length > logs.length * 0.1) {
      violations.push('HIGH_FAILURE_RATE');
    }

    // Check for missing audit trails
    const refundEvents = logs.filter(
      log => log.eventType === 'REFUND_PROCESSED'
    );
    const refundsWithoutAudit = refundEvents.filter(log => !log.details);
    if (refundsWithoutAudit.length > 0) {
      violations.push('INCOMPLETE_AUDIT_TRAIL');
    }

    // Check for suspicious patterns
    const highValueEvents = logs.filter(
      log => log.details?.amount && log.details.amount > 10000
    );
    if (highValueEvents.length > 10) {
      violations.push('HIGH_VALUE_TRANSACTION_PATTERN');
    }

    return violations;
  }

  /**
   * Generate compliance recommendations
   */
  private generateRecommendations(logs: any[]): string[] {
    const recommendations: string[] = [];

    const failureRate = logs.filter(log => !log.success).length / logs.length;
    if (failureRate > 0.05) {
      recommendations.push('Review and improve error handling processes');
    }

    const disputeEvents = logs.filter(
      log => log.eventType === 'DISPUTE_PROCESSED'
    );
    if (disputeEvents.length > 5) {
      recommendations.push('Implement enhanced fraud detection measures');
    }

    const highValueRefunds = logs.filter(
      log =>
        log.eventType === 'REFUND_PROCESSED' &&
        log.details?.amount &&
        log.details.amount > 5000
    );
    if (highValueRefunds.length > 3) {
      recommendations.push(
        'Implement additional approval workflows for high-value refunds'
      );
    }

    return recommendations;
  }
}
