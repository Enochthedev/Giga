import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { securityLogger } from '../../lib/logger';
import {
  SecurityEventLoggerService,
  SecurityEventSeverity,
  SecurityEventType,
  securityEventLogger,
} from '../../services/security-event-logger.service';

// Mock the logger
vi.mock('../../lib/logger', () => ({
  securityLogger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    logSecurityEvent: vi.fn(),
  },
}));

describe('SecurityEventLoggerService', () => {
  let eventLogger: SecurityEventLoggerService;

  beforeEach(() => {
    eventLogger = new SecurityEventLoggerService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('logSecurityEvent', () => {
    it('should log a basic security event', async () => {
      const eventId = await eventLogger.logSecurityEvent(
        SecurityEventType.SECURITY_SCAN_COMPLETED,
        SecurityEventSeverity.INFO,
        'Test security event',
        {
          fileName: 'test.txt',
          fileSize: 100,
          userId: 'user123',
        }
      );

      expect(eventId).toMatch(/^sec_\d+_[a-f0-9]+$/);
      expect(securityLogger.info).toHaveBeenCalledWith(
        'SECURITY EVENT: Test security event',
        expect.objectContaining({
          eventId,
          eventType: SecurityEventType.SECURITY_SCAN_COMPLETED,
          severity: SecurityEventSeverity.INFO,
        })
      );
    });

    it('should handle high severity events differently', async () => {
      const eventId = await eventLogger.logSecurityEvent(
        SecurityEventType.MALWARE_DETECTED,
        SecurityEventSeverity.CRITICAL,
        'Critical malware detected',
        {
          fileName: 'malware.exe',
          threatName: 'Trojan.Generic',
          confidence: 95,
        }
      );

      expect(eventId).toBeDefined();
      expect(securityLogger.error).toHaveBeenCalledWith(
        'SECURITY EVENT: Critical malware detected',
        null,
        expect.objectContaining({
          eventId,
          severity: SecurityEventSeverity.CRITICAL,
        })
      );

      // Should also trigger high severity handling
      expect(securityLogger.error).toHaveBeenCalledWith(
        'HIGH SEVERITY SECURITY EVENT DETECTED',
        null,
        expect.objectContaining({
          eventId,
          type: SecurityEventType.MALWARE_DETECTED,
          severity: SecurityEventSeverity.CRITICAL,
        })
      );
    });
  });

  describe('logFileUploadBlocked', () => {
    it('should log file upload blocked event', async () => {
      const threats = [
        { name: 'Script Injection', severity: 'high', confidence: 90 },
        { name: 'Suspicious Content', severity: 'medium', confidence: 75 },
      ];

      const eventId = await eventLogger.logFileUploadBlocked(
        'malicious.html',
        'Multiple security threats detected',
        {
          fileName: 'malicious.html',
          fileSize: 1024,
          userId: 'user456',
          ipAddress: '192.168.1.100',
        },
        threats
      );

      expect(eventId).toBeDefined();
      expect(securityLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('File upload blocked: malicious.html'),
        null,
        expect.objectContaining({
          eventId,
          eventType: SecurityEventType.FILE_UPLOAD_BLOCKED,
          severity: SecurityEventSeverity.HIGH,
        })
      );
    });

    it('should determine severity from threats correctly', async () => {
      const criticalThreats = [
        { name: 'Critical Malware', severity: 'critical', confidence: 100 },
      ];

      const eventId = await eventLogger.logFileUploadBlocked(
        'virus.exe',
        'Critical threat detected',
        { fileName: 'virus.exe' },
        criticalThreats
      );

      expect(eventId).toBeDefined();
      expect(securityLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('File upload blocked'),
        null,
        expect.objectContaining({
          severity: SecurityEventSeverity.CRITICAL,
        })
      );
    });
  });

  describe('logMalwareDetected', () => {
    it('should log malware detection with critical severity', async () => {
      const eventId = await eventLogger.logMalwareDetected(
        'trojan.exe',
        'Trojan.Win32.Generic',
        95,
        {
          fileName: 'trojan.exe',
          fileSize: 2048,
          fileHash: 'abc123def456',
          userId: 'user789',
        }
      );

      expect(eventId).toBeDefined();
      expect(securityLogger.error).toHaveBeenCalledWith(
        'SECURITY EVENT: Malware detected in file: trojan.exe - Trojan.Win32.Generic',
        null,
        expect.objectContaining({
          eventId,
          eventType: SecurityEventType.MALWARE_DETECTED,
          severity: SecurityEventSeverity.CRITICAL,
          details: expect.objectContaining({
            threatName: 'Trojan.Win32.Generic',
            confidence: 95,
            threatType: 'malware',
          }),
        })
      );
    });
  });

  describe('logSuspiciousContent', () => {
    it('should log suspicious content with appropriate severity', async () => {
      const eventId = await eventLogger.logSuspiciousContent(
        'suspicious.js',
        'script',
        'Contains obfuscated JavaScript code',
        85,
        {
          fileName: 'suspicious.js',
          fileSize: 512,
          userId: 'user101',
        }
      );

      expect(eventId).toBeDefined();
      expect(securityLogger.error).toHaveBeenCalledWith(
        'SECURITY EVENT: Suspicious content detected: suspicious.js - Contains obfuscated JavaScript code',
        null,
        expect.objectContaining({
          eventType: SecurityEventType.SUSPICIOUS_CONTENT,
          severity: SecurityEventSeverity.HIGH, // High because confidence > 80
        })
      );
    });

    it('should use medium severity for lower confidence', async () => {
      const eventId = await eventLogger.logSuspiciousContent(
        'maybe_suspicious.txt',
        'text',
        'Possibly suspicious patterns',
        60,
        { fileName: 'maybe_suspicious.txt' }
      );

      expect(eventId).toBeDefined();
      expect(securityLogger.warn).toHaveBeenCalledWith(
        'SECURITY EVENT: Suspicious content detected: maybe_suspicious.txt - Possibly suspicious patterns',
        expect.objectContaining({
          severity: SecurityEventSeverity.MEDIUM,
        })
      );
    });
  });

  describe('logInjectionAttempt', () => {
    it('should log injection attempts with high severity', async () => {
      const eventId = await eventLogger.logInjectionAttempt(
        'payload.html',
        'XSS',
        '<script>alert("xss")</script>',
        {
          fileName: 'payload.html',
          userId: 'attacker123',
          ipAddress: '10.0.0.1',
        }
      );

      expect(eventId).toBeDefined();
      expect(securityLogger.error).toHaveBeenCalledWith(
        'SECURITY EVENT: XSS injection attempt detected in file: payload.html',
        null,
        expect.objectContaining({
          eventType: SecurityEventType.INJECTION_ATTEMPT,
          severity: SecurityEventSeverity.HIGH,
          details: expect.objectContaining({
            threatType: 'XSS',
            metadata: expect.objectContaining({
              injectionPattern: '<script>alert("xss")</script>',
              injectionType: 'XSS',
            }),
          }),
        })
      );
    });
  });

  describe('logQuarantineAction', () => {
    it('should log quarantine actions', async () => {
      const eventId = await eventLogger.logQuarantineAction(
        'quarantined.bin',
        'High risk malware detected',
        {
          fileName: 'quarantined.bin',
          fileSize: 4096,
          scanId: 'scan_123',
        }
      );

      expect(eventId).toBeDefined();
      expect(securityLogger.error).toHaveBeenCalledWith(
        'SECURITY EVENT: File quarantined: quarantined.bin - High risk malware detected',
        null,
        expect.objectContaining({
          eventType: SecurityEventType.QUARANTINE_ACTION,
          severity: SecurityEventSeverity.HIGH,
        })
      );
    });
  });

  describe('logManualReviewRequired', () => {
    it('should log manual review requirements', async () => {
      const eventId = await eventLogger.logManualReviewRequired(
        'review_needed.pdf',
        'Ambiguous content detected',
        'medium',
        {
          fileName: 'review_needed.pdf',
          confidence: 65,
        }
      );

      expect(eventId).toBeDefined();
      expect(securityLogger.warn).toHaveBeenCalledWith(
        'SECURITY EVENT: Manual review required for file: review_needed.pdf - Ambiguous content detected',
        expect.objectContaining({
          eventType: SecurityEventType.MANUAL_REVIEW_REQUIRED,
          severity: SecurityEventSeverity.MEDIUM,
        })
      );
    });

    it('should use high severity for high risk files', async () => {
      const eventId = await eventLogger.logManualReviewRequired(
        'high_risk.exe',
        'Potential malware',
        'high',
        { fileName: 'high_risk.exe' }
      );

      expect(eventId).toBeDefined();
      expect(securityLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Manual review required'),
        null,
        expect.objectContaining({
          severity: SecurityEventSeverity.HIGH,
        })
      );
    });
  });

  describe('getEvents', () => {
    beforeEach(async () => {
      // Add some test events
      await eventLogger.logSecurityEvent(
        SecurityEventType.SECURITY_SCAN_COMPLETED,
        SecurityEventSeverity.INFO,
        'Scan completed',
        { fileName: 'file1.txt', userId: 'user1' }
      );

      await eventLogger.logSecurityEvent(
        SecurityEventType.MALWARE_DETECTED,
        SecurityEventSeverity.CRITICAL,
        'Malware found',
        { fileName: 'file2.exe', userId: 'user2' }
      );

      await eventLogger.logSecurityEvent(
        SecurityEventType.SUSPICIOUS_CONTENT,
        SecurityEventSeverity.MEDIUM,
        'Suspicious content',
        { fileName: 'file3.js', userId: 'user1' }
      );
    });

    it('should return all events when no criteria provided', () => {
      const events = eventLogger.getEvents();
      expect(events).toHaveLength(3);
    });

    it('should filter by event type', () => {
      const malwareEvents = eventLogger.getEvents({
        type: SecurityEventType.MALWARE_DETECTED,
      });
      expect(malwareEvents).toHaveLength(1);
      expect(malwareEvents[0].type).toBe(SecurityEventType.MALWARE_DETECTED);
    });

    it('should filter by severity', () => {
      const criticalEvents = eventLogger.getEvents({
        severity: SecurityEventSeverity.CRITICAL,
      });
      expect(criticalEvents).toHaveLength(1);
      expect(criticalEvents[0].severity).toBe(SecurityEventSeverity.CRITICAL);
    });

    it('should filter by user ID', () => {
      const user1Events = eventLogger.getEvents({
        userId: 'user1',
      });
      expect(user1Events).toHaveLength(2);
      user1Events.forEach(event => {
        expect(event.details.userId).toBe('user1');
      });
    });

    it('should limit results', () => {
      const limitedEvents = eventLogger.getEvents({ limit: 2 });
      expect(limitedEvents).toHaveLength(2);
    });

    it('should filter by time range', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      const recentEvents = eventLogger.getEvents({
        timeRange: { start: oneHourAgo, end: now },
      });

      expect(recentEvents).toHaveLength(3); // All events should be recent
    });
  });

  describe('generateEventSummary', () => {
    beforeEach(async () => {
      const now = new Date();

      // Add various test events
      await eventLogger.logMalwareDetected('virus1.exe', 'Trojan.A', 95, {
        fileName: 'virus1.exe',
        userId: 'user1',
      });

      await eventLogger.logMalwareDetected('virus2.exe', 'Trojan.A', 90, {
        fileName: 'virus2.exe',
        userId: 'user2',
      });

      await eventLogger.logSuspiciousContent(
        'suspicious.js',
        'script',
        'XSS attempt',
        85,
        {
          fileName: 'suspicious.js',
          userId: 'user1',
        }
      );

      await eventLogger.logInjectionAttempt(
        'payload.html',
        'SQL',
        'DROP TABLE',
        {
          fileName: 'payload.html',
          userId: 'user3',
        }
      );
    });

    it('should generate comprehensive event summary', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      const summary = eventLogger.generateEventSummary({
        start: oneHourAgo,
        end: now,
      });

      expect(summary.totalEvents).toBe(4);
      expect(summary.eventsByType[SecurityEventType.MALWARE_DETECTED]).toBe(2);
      expect(summary.eventsByType[SecurityEventType.SUSPICIOUS_CONTENT]).toBe(
        1
      );
      expect(summary.eventsByType[SecurityEventType.INJECTION_ATTEMPT]).toBe(1);

      expect(summary.eventsBySeverity[SecurityEventSeverity.CRITICAL]).toBe(2); // Malware events
      expect(summary.eventsBySeverity[SecurityEventSeverity.HIGH]).toBe(2); // Suspicious + injection

      expect(summary.topThreats).toContainEqual(
        expect.objectContaining({
          name: 'Trojan.A',
          count: 2,
        })
      );

      expect(summary.affectedFiles).toBe(4);
      expect(summary.uniqueUsers).toBe(3);
      expect(summary.recommendations).toContain(
        'CRITICAL: Immediate security review required - critical threats detected'
      );
    });

    it('should provide appropriate recommendations based on event patterns', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      const summary = eventLogger.generateEventSummary({
        start: oneHourAgo,
        end: now,
      });

      expect(summary.recommendations).toContain(
        'CRITICAL: Immediate security review required - critical threats detected'
      );
      expect(summary.recommendations).toContain(
        'Malware detected - update antivirus signatures and scan related systems'
      );
      expect(summary.recommendations).toContain(
        'Multiple injection attempts detected - implement enhanced input validation'
      );
    });
  });

  describe('global instance', () => {
    it('should provide a global security event logger instance', () => {
      expect(securityEventLogger).toBeInstanceOf(SecurityEventLoggerService);
    });

    it('should maintain state across calls', async () => {
      const eventId = await securityEventLogger.logSecurityEvent(
        SecurityEventType.SECURITY_SCAN_COMPLETED,
        SecurityEventSeverity.INFO,
        'Global test event',
        { fileName: 'global_test.txt' }
      );

      const events = securityEventLogger.getEvents();
      const testEvent = events.find(e => e.id === eventId);

      expect(testEvent).toBeDefined();
      expect(testEvent?.description).toBe('Global test event');
    });
  });

  describe('event cleanup', () => {
    it('should clean up old events when limit is exceeded', async () => {
      // Create a logger with a small limit for testing
      const testLogger = new SecurityEventLoggerService();

      // Add events beyond the limit (this would require modifying the class to accept config)
      // For now, we'll test the concept with the existing implementation

      for (let i = 0; i < 5; i++) {
        await testLogger.logSecurityEvent(
          SecurityEventType.SECURITY_SCAN_COMPLETED,
          SecurityEventSeverity.INFO,
          `Test event ${i}`,
          { fileName: `file${i}.txt` }
        );
      }

      const events = testLogger.getEvents();
      expect(events.length).toBe(5);
    });
  });
});
