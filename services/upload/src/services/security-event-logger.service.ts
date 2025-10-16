import { securityLogger } from '../lib/logger';
import { SecurityUtils } from '../utils/security-utils';

/**
 * Security event types for comprehensive logging
 */
export enum SecurityEventType {
  FILE_UPLOAD_BLOCKED = 'file_upload_blocked',
  MALWARE_DETECTED = 'malware_detected',
  SUSPICIOUS_CONTENT = 'suspicious_content',
  INJECTION_ATTEMPT = 'injection_attempt',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  SECURITY_SCAN_COMPLETED = 'security_scan_completed',
  QUARANTINE_ACTION = 'quarantine_action',
  MANUAL_REVIEW_REQUIRED = 'manual_review_required',
  SECURITY_POLICY_VIOLATION = 'security_policy_violation',
  THREAT_INTELLIGENCE_MATCH = 'threat_intelligence_match',
}

/**
 * Security event severity levels
 */
export enum SecurityEventSeverity {
  INFO = 'info',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Security event data structure
 */
export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: SecurityEventSeverity;
  timestamp: Date;
  source: string;
  description: string;
  details: SecurityEventDetails;
  remediation?: string[];
  references?: string[];
}

/**
 * Detailed security event information
 */
export interface SecurityEventDetails {
  // File information
  fileName?: string;
  fileSize?: number;
  fileHash?: string;
  mimeType?: string;

  // User/Request context
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;

  // Threat information
  threatType?: string;
  threatName?: string;
  confidence?: number;
  scanId?: string;

  // System information
  serviceVersion?: string;
  scannerVersion?: string;

  // Additional context
  uploadContext?: any;
  metadata?: Record<string, any>;
}

/**
 * Security event aggregation for reporting
 */
export interface SecurityEventSummary {
  timeRange: {
    start: Date;
    end: Date;
  };
  totalEvents: number;
  eventsByType: Record<SecurityEventType, number>;
  eventsBySeverity: Record<SecurityEventSeverity, number>;
  topThreats: Array<{
    name: string;
    count: number;
    severity: SecurityEventSeverity;
  }>;
  affectedFiles: number;
  uniqueUsers: number;
  recommendations: string[];
}

/**
 * Security event logging and management service
 */
export class SecurityEventLoggerService {
  private events: Map<string, SecurityEvent> = new Map();
  private readonly maxStoredEvents = 10000;
  private readonly eventRetentionMs = 7 * 24 * 60 * 60 * 1000; // 7 days

  /**
   * Log a security event
   */
  async logSecurityEvent(
    type: SecurityEventType,
    severity: SecurityEventSeverity,
    description: string,
    details: SecurityEventDetails,
    remediation?: string[]
  ): Promise<string> {
    const eventId = this.generateEventId();
    const timestamp = new Date();

    const event: SecurityEvent = {
      id: eventId,
      type,
      severity,
      timestamp,
      source: 'upload-service',
      description,
      details: {
        ...details,
        serviceVersion: process.env.SERVICE_VERSION || '1.0.0',
      },
      remediation,
    };

    // Store event in memory (in production, this would go to a database)
    this.events.set(eventId, event);

    // Clean up old events if we exceed the limit
    this.cleanupOldEvents();

    // Log to structured logger
    await this.writeToLogger(event);

    // Handle high-severity events
    if (
      severity === SecurityEventSeverity.HIGH ||
      severity === SecurityEventSeverity.CRITICAL
    ) {
      await this.handleHighSeverityEvent(event);
    }

    return eventId;
  }

  /**
   * Log file upload blocked event
   */
  async logFileUploadBlocked(
    fileName: string,
    reason: string,
    details: SecurityEventDetails,
    threats: Array<{ name: string; severity: string; confidence: number }>
  ): Promise<string> {
    const severity = this.determineSeverityFromThreats(threats);

    return this.logSecurityEvent(
      SecurityEventType.FILE_UPLOAD_BLOCKED,
      severity,
      `File upload blocked: ${fileName} - ${reason}`,
      {
        ...details,
        fileName,
        metadata: {
          blockReason: reason,
          threats: threats,
        },
      },
      [
        'Review file content and upload context',
        'Verify user account for suspicious activity',
        'Consider updating security policies if needed',
      ]
    );
  }

  /**
   * Log malware detection event
   */
  async logMalwareDetected(
    fileName: string,
    malwareName: string,
    confidence: number,
    details: SecurityEventDetails
  ): Promise<string> {
    return this.logSecurityEvent(
      SecurityEventType.MALWARE_DETECTED,
      SecurityEventSeverity.CRITICAL,
      `Malware detected in file: ${fileName} - ${malwareName}`,
      {
        ...details,
        fileName,
        threatName: malwareName,
        confidence,
        threatType: 'malware',
      },
      [
        'IMMEDIATE: Quarantine file and block user access',
        'Alert security team for incident response',
        'Scan related files from same user/session',
        'Review user account and recent activities',
      ]
    );
  }

  /**
   * Log suspicious content detection
   */
  async logSuspiciousContent(
    fileName: string,
    contentType: string,
    description: string,
    confidence: number,
    details: SecurityEventDetails
  ): Promise<string> {
    const severity =
      confidence > 80
        ? SecurityEventSeverity.HIGH
        : SecurityEventSeverity.MEDIUM;

    return this.logSecurityEvent(
      SecurityEventType.SUSPICIOUS_CONTENT,
      severity,
      `Suspicious content detected: ${fileName} - ${description}`,
      {
        ...details,
        fileName,
        threatType: contentType,
        confidence,
        metadata: {
          contentDescription: description,
        },
      },
      [
        'Review file content manually',
        'Consider additional security scanning',
        'Monitor user for further suspicious activity',
      ]
    );
  }

  /**
   * Log injection attempt
   */
  async logInjectionAttempt(
    fileName: string,
    injectionType: string,
    pattern: string,
    details: SecurityEventDetails
  ): Promise<string> {
    return this.logSecurityEvent(
      SecurityEventType.INJECTION_ATTEMPT,
      SecurityEventSeverity.HIGH,
      `${injectionType} injection attempt detected in file: ${fileName}`,
      {
        ...details,
        fileName,
        threatType: injectionType,
        metadata: {
          injectionPattern: pattern,
          injectionType,
        },
      },
      [
        'Block file upload immediately',
        'Alert security team',
        'Review user account for malicious intent',
        'Consider IP-based blocking if pattern continues',
      ]
    );
  }

  /**
   * Log security scan completion
   */
  async logSecurityScanCompleted(
    fileName: string,
    scanId: string,
    isSecure: boolean,
    threatCount: number,
    scanTime: number,
    details: SecurityEventDetails
  ): Promise<string> {
    const severity = isSecure
      ? SecurityEventSeverity.INFO
      : threatCount > 0
        ? SecurityEventSeverity.MEDIUM
        : SecurityEventSeverity.LOW;

    return this.logSecurityEvent(
      SecurityEventType.SECURITY_SCAN_COMPLETED,
      severity,
      `Security scan completed for file: ${fileName} - ${isSecure ? 'CLEAN' : 'THREATS DETECTED'}`,
      {
        ...details,
        fileName,
        scanId,
        metadata: {
          isSecure,
          threatCount,
          scanTime,
        },
      }
    );
  }

  /**
   * Log quarantine action
   */
  async logQuarantineAction(
    fileName: string,
    reason: string,
    details: SecurityEventDetails
  ): Promise<string> {
    return this.logSecurityEvent(
      SecurityEventType.QUARANTINE_ACTION,
      SecurityEventSeverity.HIGH,
      `File quarantined: ${fileName} - ${reason}`,
      {
        ...details,
        fileName,
        metadata: {
          quarantineReason: reason,
        },
      },
      [
        'File has been isolated for security analysis',
        'Security team notified for review',
        'User access blocked until review complete',
      ]
    );
  }

  /**
   * Log manual review requirement
   */
  async logManualReviewRequired(
    fileName: string,
    reason: string,
    riskLevel: string,
    details: SecurityEventDetails
  ): Promise<string> {
    const severity =
      riskLevel === 'high'
        ? SecurityEventSeverity.HIGH
        : SecurityEventSeverity.MEDIUM;

    return this.logSecurityEvent(
      SecurityEventType.MANUAL_REVIEW_REQUIRED,
      severity,
      `Manual review required for file: ${fileName} - ${reason}`,
      {
        ...details,
        fileName,
        metadata: {
          reviewReason: reason,
          riskLevel,
        },
      },
      [
        'File flagged for manual security review',
        'Security analyst should examine file content',
        'Decision required on file acceptance/rejection',
      ]
    );
  }

  /**
   * Get security events by criteria
   */
  getEvents(criteria?: {
    type?: SecurityEventType;
    severity?: SecurityEventSeverity;
    timeRange?: { start: Date; end: Date };
    userId?: string;
    limit?: number;
  }): SecurityEvent[] {
    let events = Array.from(this.events.values());

    if (criteria) {
      if (criteria.type) {
        events = events.filter(e => e.type === criteria.type);
      }
      if (criteria.severity) {
        events = events.filter(e => e.severity === criteria.severity);
      }
      if (criteria.timeRange) {
        events = events.filter(
          e =>
            e.timestamp >= criteria.timeRange!.start &&
            e.timestamp <= criteria.timeRange!.end
        );
      }
      if (criteria.userId) {
        events = events.filter(e => e.details.userId === criteria.userId);
      }
      if (criteria.limit) {
        events = events.slice(0, criteria.limit);
      }
    }

    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Generate security event summary
   */
  generateEventSummary(timeRange: {
    start: Date;
    end: Date;
  }): SecurityEventSummary {
    const events = this.getEvents({ timeRange });

    const eventsByType: Record<SecurityEventType, number> = {} as any;
    const eventsBySeverity: Record<SecurityEventSeverity, number> = {} as any;
    const threatCounts: Map<
      string,
      { count: number; severity: SecurityEventSeverity }
    > = new Map();
    const uniqueUsers = new Set<string>();
    const affectedFiles = new Set<string>();

    // Initialize counters
    Object.values(SecurityEventType).forEach(type => {
      eventsByType[type] = 0;
    });
    Object.values(SecurityEventSeverity).forEach(severity => {
      eventsBySeverity[severity] = 0;
    });

    // Process events
    events.forEach(event => {
      eventsByType[event.type]++;
      eventsBySeverity[event.severity]++;

      if (event.details.userId) {
        uniqueUsers.add(event.details.userId);
      }
      if (event.details.fileName) {
        affectedFiles.add(event.details.fileName);
      }
      if (event.details.threatName) {
        const existing = threatCounts.get(event.details.threatName);
        if (existing) {
          existing.count++;
        } else {
          threatCounts.set(event.details.threatName, {
            count: 1,
            severity: event.severity,
          });
        }
      }
    });

    // Generate top threats
    const topThreats = Array.from(threatCounts.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Generate recommendations
    const recommendations = this.generateSummaryRecommendations(
      events,
      eventsBySeverity
    );

    return {
      timeRange,
      totalEvents: events.length,
      eventsByType,
      eventsBySeverity,
      topThreats,
      affectedFiles: affectedFiles.size,
      uniqueUsers: uniqueUsers.size,
      recommendations,
    };
  }

  /**
   * Private helper methods
   */
  private generateEventId(): string {
    return `sec_${Date.now()}_${SecurityUtils.generateSecureToken(8)}`;
  }

  private async writeToLogger(event: SecurityEvent): Promise<void> {
    const logData = {
      eventId: event.id,
      eventType: event.type,
      severity: event.severity,
      description: event.description,
      details: event.details,
      remediation: event.remediation,
      timestamp: event.timestamp.toISOString(),
    };

    switch (event.severity) {
      case SecurityEventSeverity.CRITICAL:
      case SecurityEventSeverity.HIGH:
        securityLogger.error(
          `SECURITY EVENT: ${event.description}`,
          null,
          logData
        );
        break;
      case SecurityEventSeverity.MEDIUM:
        securityLogger.warn(`SECURITY EVENT: ${event.description}`, logData);
        break;
      default:
        securityLogger.info(`SECURITY EVENT: ${event.description}`, logData);
    }
  }

  private async handleHighSeverityEvent(event: SecurityEvent): Promise<void> {
    // In production, this would trigger alerts, notifications, etc.
    securityLogger.error('HIGH SEVERITY SECURITY EVENT DETECTED', null, {
      eventId: event.id,
      type: event.type,
      severity: event.severity,
      description: event.description,
      fileName: event.details.fileName,
      userId: event.details.userId,
      ipAddress: event.details.ipAddress,
      timestamp: event.timestamp.toISOString(),
    });

    // Additional alerting logic would go here
    // - Send to SIEM
    // - Trigger incident response
    // - Send notifications to security team
    // - Update threat intelligence feeds
  }

  private determineSeverityFromThreats(
    threats: Array<{ severity: string }>
  ): SecurityEventSeverity {
    const severities = threats.map(t => t.severity);

    if (severities.includes('critical')) return SecurityEventSeverity.CRITICAL;
    if (severities.includes('high')) return SecurityEventSeverity.HIGH;
    if (severities.includes('medium')) return SecurityEventSeverity.MEDIUM;
    return SecurityEventSeverity.LOW;
  }

  private cleanupOldEvents(): void {
    if (this.events.size <= this.maxStoredEvents) return;

    const cutoffTime = Date.now() - this.eventRetentionMs;
    const eventsToDelete: string[] = [];

    for (const [id, event] of this.events.entries()) {
      if (event.timestamp.getTime() < cutoffTime) {
        eventsToDelete.push(id);
      }
    }

    // Delete oldest events if we still exceed the limit
    if (this.events.size - eventsToDelete.length > this.maxStoredEvents) {
      const sortedEvents = Array.from(this.events.entries()).sort(
        ([, a], [, b]) => a.timestamp.getTime() - b.timestamp.getTime()
      );

      const additionalToDelete =
        this.events.size - eventsToDelete.length - this.maxStoredEvents;
      for (let i = 0; i < additionalToDelete; i++) {
        eventsToDelete.push(sortedEvents[i][0]);
      }
    }

    eventsToDelete.forEach(id => this.events.delete(id));
  }

  private generateSummaryRecommendations(
    events: SecurityEvent[],
    eventsBySeverity: Record<SecurityEventSeverity, number>
  ): string[] {
    const recommendations: string[] = [];

    if (eventsBySeverity[SecurityEventSeverity.CRITICAL] > 0) {
      recommendations.push(
        'CRITICAL: Immediate security review required - critical threats detected'
      );
      recommendations.push('Activate incident response procedures');
      recommendations.push('Review and strengthen security controls');
    }

    if (eventsBySeverity[SecurityEventSeverity.HIGH] > 5) {
      recommendations.push(
        'High number of high-severity events - investigate potential attack patterns'
      );
      recommendations.push(
        'Consider implementing additional security measures'
      );
    }

    if (eventsBySeverity[SecurityEventSeverity.MEDIUM] > 20) {
      recommendations.push(
        'Elevated medium-risk activity - monitor for escalation'
      );
      recommendations.push('Review security policies and user training');
    }

    const injectionEvents = events.filter(
      e => e.type === SecurityEventType.INJECTION_ATTEMPT
    );
    if (injectionEvents.length > 3) {
      recommendations.push(
        'Multiple injection attempts detected - implement enhanced input validation'
      );
    }

    const malwareEvents = events.filter(
      e => e.type === SecurityEventType.MALWARE_DETECTED
    );
    if (malwareEvents.length > 0) {
      recommendations.push(
        'Malware detected - update antivirus signatures and scan related systems'
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Security posture appears stable - continue monitoring'
      );
    }

    return recommendations;
  }
}

/**
 * Global security event logger instance
 */
export const securityEventLogger = new SecurityEventLoggerService();
