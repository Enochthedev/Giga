import crypto from 'crypto';
import { securityLogger } from '../lib/logger';
import { FileData } from '../types/upload.types';
import { SecurityUtils } from '../utils/security-utils';

// Import security event logger with fallback handling
let securityEventLogger: any;
let SecurityEventType: any;
let SecurityEventSeverity: any;

try {
  const securityEventModule = require('./security-event-logger.service');
  securityEventLogger = securityEventModule.securityEventLogger;
  SecurityEventType = securityEventModule.SecurityEventType;
  SecurityEventSeverity = securityEventModule.SecurityEventSeverity;
} catch (error) {
  // Fallback if security event logger is not available
  securityEventLogger = null;
  SecurityEventType = {};
  SecurityEventSeverity = {};
}

/**
 * Enhanced security scanning service for comprehensive file security validation
 */
export interface SecurityScanResult {
  isSecure: boolean;
  threats: SecurityThreat[];
  scanTime: number;
  scanId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export interface SecurityThreat {
  id: string;
  type:
    | 'malware'
    | 'virus'
    | 'trojan'
    | 'suspicious_content'
    | 'injection_attempt'
    | 'data_exfiltration'
    | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  name: string;
  description: string;
  confidence: number; // 0-100
  mitigation?: string;
  references?: string[];
}

export interface SecurityScanConfig {
  enableMalwareScanning: boolean;
  enableContentAnalysis: boolean;
  enableBehaviorAnalysis: boolean;
  enableThreatIntelligence: boolean;
  maxScanTime: number; // milliseconds
  quarantineThreats: boolean;
  alertOnHighRisk: boolean;
}

export class SecurityScannerService {
  private config: SecurityScanConfig;
  private scanHistory: Map<string, SecurityScanResult> = new Map();

  constructor(config: SecurityScanConfig) {
    this.config = config;
  }

  /**
   * Perform comprehensive security scan on file
   */
  async scanFile(
    file: FileData,
    uploadContext?: any
  ): Promise<SecurityScanResult> {
    const scanId = this.generateScanId();
    const startTime = Date.now();

    securityLogger.info('Starting security scan', {
      scanId,
      fileName: file.originalName,
      fileSize: file.size,
      mimeType: file.mimeType,
      uploadContext,
    });

    try {
      const threats: SecurityThreat[] = [];

      // 1. Basic security validation
      const basicThreats = await this.performBasicSecurityChecks(file);
      threats.push(...basicThreats);

      // 2. Malware scanning
      if (this.config.enableMalwareScanning) {
        const malwareThreats = await this.scanForMalware(file);
        threats.push(...malwareThreats);
      }

      // 3. Content analysis
      if (this.config.enableContentAnalysis) {
        const contentThreats = await this.analyzeContent(file);
        threats.push(...contentThreats);
      }

      // 4. Behavioral analysis
      if (this.config.enableBehaviorAnalysis) {
        const behaviorThreats = await this.analyzeBehavior(file);
        threats.push(...behaviorThreats);
      }

      // 5. Threat intelligence check
      if (this.config.enableThreatIntelligence) {
        const intelThreats = await this.checkThreatIntelligence(file);
        threats.push(...intelThreats);
      }

      const scanTime = Date.now() - startTime;
      const riskLevel = this.calculateRiskLevel(threats);
      const recommendations = this.generateRecommendations(threats);

      const result: SecurityScanResult = {
        isSecure:
          threats.length === 0 ||
          !threats.some(
            t => t.severity === 'high' || t.severity === 'critical'
          ),
        threats,
        scanTime,
        scanId,
        riskLevel,
        recommendations,
      };

      // Store scan result
      this.scanHistory.set(scanId, result);

      // Log security events
      await this.logSecurityEvents(result, file, uploadContext);

      // Handle high-risk files
      if (riskLevel === 'high' || riskLevel === 'critical') {
        await this.handleHighRiskFile(result, file, uploadContext);
      }

      securityLogger.info('Security scan completed', {
        scanId,
        isSecure: result.isSecure,
        threatCount: threats.length,
        riskLevel,
        scanTime,
      });

      return result;
    } catch (error) {
      const scanTime = Date.now() - startTime;
      const errorResult: SecurityScanResult = {
        isSecure: false,
        threats: [
          {
            id: `error_${scanId}`,
            type: 'unknown',
            severity: 'medium',
            name: 'Scan Error',
            description: `Security scan failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            confidence: 100,
          },
        ],
        scanTime,
        scanId,
        riskLevel: 'medium',
        recommendations: ['Retry security scan', 'Manual review recommended'],
      };

      securityLogger.error('Security scan failed', error, {
        scanId,
        fileName: file.originalName,
        scanTime,
      });

      return errorResult;
    }
  }

  /**
   * Perform basic security checks
   */
  private async performBasicSecurityChecks(
    file: FileData
  ): Promise<SecurityThreat[]> {
    const threats: SecurityThreat[] = [];

    // Check file name security
    const fileNameCheck = SecurityUtils.validateSecureFileName(
      file.originalName
    );
    if (!fileNameCheck.isSecure) {
      threats.push({
        id: `filename_${Date.now()}`,
        type: 'suspicious_content',
        severity: 'medium',
        name: 'Insecure File Name',
        description: `File name contains security issues: ${fileNameCheck.issues.join(', ')}`,
        confidence: 95,
        mitigation: 'Sanitize file name before processing',
      });
    }

    // Check for suspicious patterns
    const patternCheck = SecurityUtils.checkSuspiciousPatterns(file);
    if (patternCheck.isSuspicious) {
      threats.push({
        id: `patterns_${Date.now()}`,
        type: 'injection_attempt',
        severity: 'high',
        name: 'Suspicious Content Patterns',
        description: `File contains suspicious patterns: ${patternCheck.reasons.join(', ')}`,
        confidence: 85,
        mitigation: 'Block file upload and alert security team',
      });
    }

    // Check file size anomalies
    if (file.size === 0) {
      threats.push({
        id: `empty_${Date.now()}`,
        type: 'suspicious_content',
        severity: 'low',
        name: 'Empty File',
        description:
          'File appears to be empty, which may indicate corruption or manipulation',
        confidence: 70,
      });
    }

    // Check for polyglot files (files that are valid in multiple formats)
    const polyglotCheck = await this.checkForPolyglotFile(file);
    if (polyglotCheck.isPolyglot) {
      threats.push({
        id: `polyglot_${Date.now()}`,
        type: 'suspicious_content',
        severity: 'high',
        name: 'Polyglot File Detected',
        description:
          'File appears to be valid in multiple formats, which may be used to bypass security controls',
        confidence: 90,
        mitigation: 'Reject file or perform additional validation',
      });
    }

    return threats;
  }

  /**
   * Enhanced malware scanning
   */
  private async scanForMalware(file: FileData): Promise<SecurityThreat[]> {
    const threats: SecurityThreat[] = [];

    // Signature-based detection
    const signatures = await this.checkMalwareSignatures(file);
    threats.push(...signatures);

    // Heuristic analysis
    const heuristics = await this.performHeuristicAnalysis(file);
    threats.push(...heuristics);

    // Entropy analysis (detect packed/encrypted malware)
    const entropyCheck = await this.analyzeEntropy(file);
    if (entropyCheck.isSuspicious) {
      threats.push({
        id: `entropy_${Date.now()}`,
        type: 'suspicious_content',
        severity: 'medium',
        name: 'High Entropy Content',
        description:
          'File contains high entropy content that may indicate encryption or packing',
        confidence: 75,
        mitigation: 'Additional analysis recommended',
      });
    }

    return threats;
  }

  /**
   * Content analysis for security threats
   */
  private async analyzeContent(file: FileData): Promise<SecurityThreat[]> {
    const threats: SecurityThreat[] = [];
    const content = file.buffer.toString(
      'utf8',
      0,
      Math.min(file.buffer.length, 32768)
    );

    // Check for embedded scripts
    const scriptPatterns = [
      { pattern: /<script[^>]*>.*?<\/script>/gis, name: 'HTML Script Tags' },
      { pattern: /javascript:/gi, name: 'JavaScript Protocol' },
      { pattern: /vbscript:/gi, name: 'VBScript Protocol' },
      { pattern: /data:text\/html/gi, name: 'HTML Data URI' },
      { pattern: /eval\s*\(/gi, name: 'JavaScript Eval' },
      { pattern: /document\.write/gi, name: 'Document Write' },
      { pattern: /innerHTML\s*=/gi, name: 'InnerHTML Assignment' },
    ];

    for (const { pattern, name } of scriptPatterns) {
      if (pattern.test(content)) {
        threats.push({
          id: `script_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          type: 'injection_attempt',
          severity: 'high',
          name: `Script Injection: ${name}`,
          description: `File contains ${name.toLowerCase()} which may be used for code injection`,
          confidence: 90,
          mitigation: 'Strip script content or reject file',
        });
      }
    }

    // Check for SQL injection patterns
    const sqlPatterns = [
      /union\s+select/gi,
      /drop\s+table/gi,
      /insert\s+into/gi,
      /delete\s+from/gi,
      /update\s+.*\s+set/gi,
      /exec\s*\(/gi,
      /xp_cmdshell/gi,
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(content)) {
        threats.push({
          id: `sql_${Date.now()}`,
          type: 'injection_attempt',
          severity: 'high',
          name: 'SQL Injection Pattern',
          description: 'File contains SQL injection patterns',
          confidence: 85,
          mitigation: 'Sanitize content or reject file',
        });
        break;
      }
    }

    // Check for command injection patterns
    const commandPatterns = [
      /\$\([^)]*\)/g,
      /`[^`]*`/g,
      /\|\s*[a-zA-Z]/g,
      /;\s*[a-zA-Z]/g,
      /&&\s*[a-zA-Z]/g,
      /\|\|\s*[a-zA-Z]/g,
    ];

    for (const pattern of commandPatterns) {
      if (pattern.test(content)) {
        threats.push({
          id: `cmd_${Date.now()}`,
          type: 'injection_attempt',
          severity: 'high',
          name: 'Command Injection Pattern',
          description: 'File contains command injection patterns',
          confidence: 80,
          mitigation: 'Sanitize content or reject file',
        });
        break;
      }
    }

    // Check for data exfiltration patterns
    const exfiltrationPatterns = [
      /https?:\/\/[^\s]*\.(tk|ml|ga|cf|bit\.ly|tinyurl|t\.co)/gi,
      /base64[,;][A-Za-z0-9+/=]+/gi,
      /btoa\s*\(/gi,
      /atob\s*\(/gi,
    ];

    for (const pattern of exfiltrationPatterns) {
      if (pattern.test(content)) {
        threats.push({
          id: `exfil_${Date.now()}`,
          type: 'data_exfiltration',
          severity: 'medium',
          name: 'Data Exfiltration Pattern',
          description:
            'File contains patterns commonly used for data exfiltration',
          confidence: 70,
          mitigation: 'Review file content and block suspicious URLs',
        });
        break;
      }
    }

    return threats;
  }

  /**
   * Behavioral analysis
   */
  private async analyzeBehavior(file: FileData): Promise<SecurityThreat[]> {
    const threats: SecurityThreat[] = [];

    // Check for file format confusion
    const formatConfusion = await this.checkFormatConfusion(file);
    if (formatConfusion.isConfused) {
      threats.push({
        id: `format_${Date.now()}`,
        type: 'suspicious_content',
        severity: 'medium',
        name: 'File Format Confusion',
        description: 'File extension does not match actual file content',
        confidence: 85,
        mitigation:
          'Validate file format and reject if mismatch is intentional',
      });
    }

    // Check for steganography indicators
    const steganographyCheck = await this.checkForSteganography(file);
    if (steganographyCheck.isSuspicious) {
      threats.push({
        id: `stego_${Date.now()}`,
        type: 'suspicious_content',
        severity: 'medium',
        name: 'Possible Steganography',
        description:
          'File may contain hidden data using steganographic techniques',
        confidence: 60,
        mitigation: 'Perform steganography analysis',
      });
    }

    return threats;
  }

  /**
   * Threat intelligence check
   */
  private async checkThreatIntelligence(
    file: FileData
  ): Promise<SecurityThreat[]> {
    const threats: SecurityThreat[] = [];

    // Generate file hash for threat intelligence lookup
    const fileHash = SecurityUtils.generateFileHash(file.buffer, 'sha256');

    // Check against known malware hashes (simulated)
    const knownThreats = await this.checkKnownThreatHashes(fileHash);
    threats.push(...knownThreats);

    // Check file metadata against threat intelligence
    const metadataThreats = await this.checkMetadataThreatIntelligence(file);
    threats.push(...metadataThreats);

    return threats;
  }

  /**
   * Check for malware signatures
   */
  private async checkMalwareSignatures(
    file: FileData
  ): Promise<SecurityThreat[]> {
    const threats: SecurityThreat[] = [];

    // Common malware signatures (simplified for demonstration)
    const signatures = [
      {
        pattern: Buffer.from('4D5A'),
        name: 'PE Executable Header',
        severity: 'high' as const,
      },
      {
        pattern: Buffer.from('7F454C46'),
        name: 'ELF Executable Header',
        severity: 'high' as const,
      },
      {
        pattern: Buffer.from('504B0304'),
        name: 'ZIP Archive',
        severity: 'low' as const,
      },
      {
        pattern: Buffer.from('CAFEBABE'),
        name: 'Java Class File',
        severity: 'medium' as const,
      },
    ];

    for (const signature of signatures) {
      if (this.bufferContains(file.buffer, signature.pattern)) {
        // Only flag as threat if it's an executable in a non-executable context
        if (
          signature.severity === 'high' &&
          !file.mimeType.includes('application/')
        ) {
          threats.push({
            id: `sig_${Date.now()}`,
            type: 'malware',
            severity: signature.severity,
            name: `Executable Signature: ${signature.name}`,
            description: `File contains ${signature.name} but is not declared as executable`,
            confidence: 95,
            mitigation: 'Block executable files in non-executable contexts',
          });
        }
      }
    }

    return threats;
  }

  /**
   * Perform heuristic analysis
   */
  private async performHeuristicAnalysis(
    file: FileData
  ): Promise<SecurityThreat[]> {
    const threats: SecurityThreat[] = [];

    // Check for suspicious API calls in content
    const content = file.buffer.toString(
      'utf8',
      0,
      Math.min(file.buffer.length, 16384)
    );
    const suspiciousAPIs = [
      'CreateProcess',
      'WriteProcessMemory',
      'VirtualAlloc',
      'LoadLibrary',
      'GetProcAddress',
      'RegSetValue',
      'WinExec',
      'ShellExecute',
    ];

    for (const api of suspiciousAPIs) {
      if (content.includes(api)) {
        threats.push({
          id: `api_${Date.now()}`,
          type: 'suspicious_content',
          severity: 'medium',
          name: `Suspicious API Call: ${api}`,
          description: `File contains reference to potentially dangerous API: ${api}`,
          confidence: 70,
          mitigation: 'Review file content for malicious intent',
        });
      }
    }

    return threats;
  }

  /**
   * Analyze file entropy
   */
  private async analyzeEntropy(
    file: FileData
  ): Promise<{ isSuspicious: boolean; entropy: number }> {
    const buffer = file.buffer;
    const frequencies = new Array(256).fill(0);

    // Calculate byte frequencies
    for (let i = 0; i < buffer.length; i++) {
      frequencies[buffer[i]]++;
    }

    // Calculate Shannon entropy
    let entropy = 0;
    for (const freq of frequencies) {
      if (freq > 0) {
        const probability = freq / buffer.length;
        entropy -= probability * Math.log2(probability);
      }
    }

    // High entropy (> 7.5) may indicate encryption or compression
    return {
      isSuspicious: entropy > 7.5,
      entropy,
    };
  }

  /**
   * Check for polyglot files
   */
  private async checkForPolyglotFile(
    file: FileData
  ): Promise<{ isPolyglot: boolean; formats: string[] }> {
    const formats: string[] = [];
    const buffer = file.buffer;

    // Check for multiple file format signatures
    const signatures = [
      { pattern: Buffer.from([0xff, 0xd8, 0xff]), format: 'JPEG' },
      { pattern: Buffer.from([0x89, 0x50, 0x4e, 0x47]), format: 'PNG' },
      { pattern: Buffer.from([0x47, 0x49, 0x46, 0x38]), format: 'GIF' },
      { pattern: Buffer.from([0x25, 0x50, 0x44, 0x46]), format: 'PDF' },
      { pattern: Buffer.from([0x50, 0x4b, 0x03, 0x04]), format: 'ZIP' },
      { pattern: Buffer.from([0x4d, 0x5a]), format: 'PE' },
    ];

    for (const signature of signatures) {
      if (buffer.length >= signature.pattern.length) {
        if (
          buffer.subarray(0, signature.pattern.length).equals(signature.pattern)
        ) {
          formats.push(signature.format);
        }
      }
    }

    return {
      isPolyglot: formats.length > 1,
      formats,
    };
  }

  /**
   * Check for format confusion
   */
  private async checkFormatConfusion(file: FileData): Promise<{
    isConfused: boolean;
    declaredType: string;
    actualType: string;
  }> {
    // This is a simplified implementation
    const declaredType = file.mimeType;
    const buffer = file.buffer;

    let actualType = 'unknown';

    // Detect actual file type based on magic bytes
    if (buffer.length >= 4) {
      if (buffer.subarray(0, 2).equals(Buffer.from([0xff, 0xd8]))) {
        actualType = 'image/jpeg';
      } else if (
        buffer.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))
      ) {
        actualType = 'image/png';
      } else if (
        buffer.subarray(0, 4).equals(Buffer.from([0x47, 0x49, 0x46, 0x38]))
      ) {
        actualType = 'image/gif';
      } else if (
        buffer.subarray(0, 4).equals(Buffer.from([0x25, 0x50, 0x44, 0x46]))
      ) {
        actualType = 'application/pdf';
      }
    }

    return {
      isConfused: actualType !== 'unknown' && actualType !== declaredType,
      declaredType,
      actualType,
    };
  }

  /**
   * Check for steganography indicators
   */
  private async checkForSteganography(
    file: FileData
  ): Promise<{ isSuspicious: boolean; indicators: string[] }> {
    const indicators: string[] = [];

    // Check for unusual file size for the format
    if (file.mimeType.startsWith('image/')) {
      const expectedSize = this.estimateImageSize(file);
      if (file.size > expectedSize * 2) {
        indicators.push('File size unusually large for image format');
      }
    }

    // Check for hidden data patterns in LSBs (simplified)
    if (file.mimeType.startsWith('image/') && file.buffer.length > 1000) {
      const lsbEntropy = this.calculateLSBEntropy(file.buffer);
      if (lsbEntropy > 0.7) {
        indicators.push('High entropy in least significant bits');
      }
    }

    return {
      isSuspicious: indicators.length > 0,
      indicators,
    };
  }

  /**
   * Check known threat hashes
   */
  private async checkKnownThreatHashes(
    fileHash: string
  ): Promise<SecurityThreat[]> {
    // This would typically query a threat intelligence database
    // For now, we'll simulate with a small list of known bad hashes
    const knownBadHashes = new Set([
      // These are example hashes - in production, this would be a real threat intelligence feed
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // Empty file hash
    ]);

    if (knownBadHashes.has(fileHash)) {
      return [
        {
          id: `threat_intel_${Date.now()}`,
          type: 'malware',
          severity: 'critical',
          name: 'Known Malware Hash',
          description:
            'File hash matches known malware in threat intelligence database',
          confidence: 100,
          mitigation: 'Block file immediately and alert security team',
          references: ['Threat Intelligence Database'],
        },
      ];
    }

    return [];
  }

  /**
   * Check metadata against threat intelligence
   */
  private async checkMetadataThreatIntelligence(
    file: FileData
  ): Promise<SecurityThreat[]> {
    const threats: SecurityThreat[] = [];

    // Check for suspicious file names
    const suspiciousNames = [
      'invoice.exe',
      'document.scr',
      'photo.bat',
      'update.com',
    ];

    if (
      suspiciousNames.some(name =>
        file.originalName.toLowerCase().includes(name.toLowerCase())
      )
    ) {
      threats.push({
        id: `suspicious_name_${Date.now()}`,
        type: 'suspicious_content',
        severity: 'high',
        name: 'Suspicious File Name',
        description: 'File name matches patterns commonly used by malware',
        confidence: 85,
        mitigation: 'Block file and alert security team',
      });
    }

    return threats;
  }

  /**
   * Calculate risk level based on threats
   */
  private calculateRiskLevel(
    threats: SecurityThreat[]
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (threats.length === 0) return 'low';

    const hasCritical = threats.some(t => t.severity === 'critical');
    const hasHigh = threats.some(t => t.severity === 'high');
    const hasMedium = threats.some(t => t.severity === 'medium');

    if (hasCritical) return 'critical';
    if (hasHigh) return 'high';
    if (hasMedium) return 'medium';
    return 'low';
  }

  /**
   * Generate security recommendations
   */
  private generateRecommendations(threats: SecurityThreat[]): string[] {
    const recommendations: string[] = [];

    if (threats.length === 0) {
      recommendations.push(
        'File appears secure, proceed with normal processing'
      );
      return recommendations;
    }

    const criticalThreats = threats.filter(t => t.severity === 'critical');
    const highThreats = threats.filter(t => t.severity === 'high');

    if (criticalThreats.length > 0) {
      recommendations.push(
        'CRITICAL: Block file immediately and alert security team'
      );
      recommendations.push('Quarantine file for further analysis');
      recommendations.push('Review upload source and user account');
    } else if (highThreats.length > 0) {
      recommendations.push('HIGH RISK: Consider blocking file upload');
      recommendations.push('Perform additional manual review');
      recommendations.push('Monitor user account for suspicious activity');
    } else {
      recommendations.push('Medium/Low risk detected - proceed with caution');
      recommendations.push('Apply additional security controls');
      recommendations.push('Log security event for monitoring');
    }

    // Add specific mitigations from threats
    threats.forEach(threat => {
      if (threat.mitigation) {
        recommendations.push(`${threat.name}: ${threat.mitigation}`);
      }
    });

    return [...new Set(recommendations)]; // Remove duplicates
  }

  /**
   * Log security events
   */
  private async logSecurityEvents(
    result: SecurityScanResult,
    file: FileData,
    uploadContext?: any
  ): Promise<void> {
    const fileHash = SecurityUtils.generateFileHash(file.buffer, 'sha256');

    try {
      // Log overall scan completion
      if (securityEventLogger) {
        await securityEventLogger.logSecurityScanCompleted(
          file.originalName,
          result.scanId,
          result.isSecure,
          result.threats.length,
          result.scanTime,
          {
            fileName: file.originalName,
            fileSize: file.size,
            fileHash,
            mimeType: file.mimeType,
            scanId: result.scanId,
            userId: uploadContext?.userId,
            sessionId: uploadContext?.sessionId,
            ipAddress: uploadContext?.ipAddress,
            userAgent: uploadContext?.userAgent,
            requestId: uploadContext?.requestId,
            uploadContext,
          }
        );

        // Log individual threats with appropriate event types
        for (const threat of result.threats) {
          const eventDetails = {
            fileName: file.originalName,
            fileSize: file.size,
            fileHash,
            mimeType: file.mimeType,
            scanId: result.scanId,
            threatType: threat.type,
            threatName: threat.name,
            confidence: threat.confidence,
            userId: uploadContext?.userId,
            sessionId: uploadContext?.sessionId,
            ipAddress: uploadContext?.ipAddress,
            userAgent: uploadContext?.userAgent,
            requestId: uploadContext?.requestId,
            uploadContext,
          };

          // Log specific event types based on threat type
          if (securityEventLogger) {
            switch (threat.type) {
              case 'malware':
              case 'virus':
              case 'trojan':
                await securityEventLogger.logMalwareDetected(
                  file.originalName,
                  threat.name,
                  threat.confidence,
                  eventDetails
                );
                break;

              case 'injection_attempt': {
                const injectionType = threat.name.includes('SQL')
                  ? 'SQL'
                  : threat.name.includes('Script')
                    ? 'Script'
                    : threat.name.includes('Command')
                      ? 'Command'
                      : 'Unknown';
                await securityEventLogger.logInjectionAttempt(
                  file.originalName,
                  injectionType,
                  threat.description,
                  eventDetails
                );
                break;
              }

              case 'suspicious_content':
                await securityEventLogger.logSuspiciousContent(
                  file.originalName,
                  threat.type,
                  threat.description,
                  threat.confidence,
                  eventDetails
                );
                break;

              default: {
                // Log as general security event
                const severity = this.mapThreatSeverityToEventSeverity(
                  threat.severity
                );
                await securityEventLogger.logSecurityEvent(
                  SecurityEventType.SECURITY_POLICY_VIOLATION,
                  severity,
                  `Security threat detected: ${threat.name}`,
                  eventDetails,
                  threat.mitigation ? [threat.mitigation] : undefined
                );
                break;
              }
            }
          }
        }

        // Log legacy format for backward compatibility
        securityLogger.logSecurityEvent(
          'file_security_scan',
          result.riskLevel,
          {
            scanId: result.scanId,
            fileName: file.originalName,
            fileSize: file.size,
            mimeType: file.mimeType,
            isSecure: result.isSecure,
            threatCount: result.threats.length,
            riskLevel: result.riskLevel,
            scanTime: result.scanTime,
            uploadContext,
          }
        );
      }
    } catch (error) {
      // Fallback to basic logging if security event logger is not available
      securityLogger.warn('Security event logging failed, using fallback', {
        error: error instanceof Error ? error.message : 'Unknown error',
        scanId: result.scanId,
        fileName: file.originalName,
      });

      // Log legacy format for backward compatibility
      securityLogger.logSecurityEvent('file_security_scan', result.riskLevel, {
        scanId: result.scanId,
        fileName: file.originalName,
        fileSize: file.size,
        mimeType: file.mimeType,
        isSecure: result.isSecure,
        threatCount: result.threats.length,
        riskLevel: result.riskLevel,
        scanTime: result.scanTime,
        uploadContext,
      });
    }
  }

  /**
   * Handle high-risk files
   */
  private async handleHighRiskFile(
    result: SecurityScanResult,
    file: FileData,
    uploadContext?: unknown
  ): Promise<void> {
    const fileHash = SecurityUtils.generateFileHash(file.buffer, 'sha256');
    const eventDetails = {
      fileName: file.originalName,
      fileSize: file.size,
      fileHash,
      mimeType: file.mimeType,
      scanId: result.scanId,
      userId: (uploadContext as any)?.userId,
      sessionId: (uploadContext as any)?.sessionId,
      ipAddress: (uploadContext as any)?.ipAddress,
      userAgent: (uploadContext as any)?.userAgent,
      requestId: (uploadContext as any)?.requestId,
      uploadContext,
    };

    try {
      if (securityEventLogger) {
        if (this.config.quarantineThreats) {
          // Log quarantine action
          await securityEventLogger.logQuarantineAction(
            file.originalName,
            `High risk file detected (${result.riskLevel}) with ${result.threats.length} threats`,
            eventDetails
          );
        }

        if (this.config.alertOnHighRisk) {
          // Log file upload blocked event
          await securityEventLogger.logFileUploadBlocked(
            file.originalName,
            `High risk detected: ${result.riskLevel} with ${result.threats.length} security threats`,
            eventDetails,
            result.threats.map(t => ({
              name: t.name,
              severity: t.severity,
              confidence: t.confidence,
            }))
          );
        }
      }
    } catch (error) {
      // Fallback to basic logging if security event logger is not available
      securityLogger.warn(
        'Security event logging failed in high-risk handler, using fallback',
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          scanId: result.scanId,
          fileName: file.originalName,
        }
      );
    }

    // Legacy logging (always execute)
    if (this.config.quarantineThreats) {
      securityLogger.warn('File quarantined due to high risk', {
        scanId: result.scanId,
        fileName: file.originalName,
        riskLevel: result.riskLevel,
        threatCount: result.threats.length,
      });
    }

    if (this.config.alertOnHighRisk) {
      // Legacy logging
      securityLogger.error('HIGH RISK FILE DETECTED - SECURITY ALERT', null, {
        scanId: result.scanId,
        fileName: file.originalName,
        fileSize: file.size,
        riskLevel: result.riskLevel,
        threats: result.threats.map(t => ({
          type: t.type,
          severity: t.severity,
          name: t.name,
          confidence: t.confidence,
        })),
        uploadContext,
      });
    }
  }

  /**
   * Utility methods
   */
  private generateScanId(): string {
    return `scan_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  }

  private bufferContains(haystack: Buffer, needle: Buffer): boolean {
    return haystack.indexOf(needle) !== -1;
  }

  private estimateImageSize(file: FileData): number {
    // Simplified image size estimation
    if (file.mimeType === 'image/jpeg') return file.buffer.length * 0.8;
    if (file.mimeType === 'image/png') return file.buffer.length * 0.9;
    return file.buffer.length;
  }

  private calculateLSBEntropy(buffer: Buffer): number {
    // Simplified LSB entropy calculation
    const lsbs: number[] = [];
    for (let i = 0; i < Math.min(buffer.length, 1000); i++) {
      lsbs.push(buffer[i] & 1);
    }

    const ones = lsbs.filter(bit => bit === 1).length;
    const zeros = lsbs.length - ones;

    if (ones === 0 || zeros === 0) return 0;

    const pOnes = ones / lsbs.length;
    const pZeros = zeros / lsbs.length;

    return -(pOnes * Math.log2(pOnes) + pZeros * Math.log2(pZeros));
  }

  /**
   * Get scan history
   */
  getScanHistory(scanId: string): SecurityScanResult | undefined {
    return this.scanHistory.get(scanId);
  }

  /**
   * Clear old scan history
   */
  clearOldScanHistory(maxAge: number = 24 * 60 * 60 * 1000): void {
    const cutoff = Date.now() - maxAge;
    for (const [scanId, result] of this.scanHistory.entries()) {
      if (result.scanTime < cutoff) {
        this.scanHistory.delete(scanId);
      }
    }
  }

  /**
   * Map threat severity to security event severity
   */
  private mapThreatSeverityToEventSeverity(
    threatSeverity: 'low' | 'medium' | 'high' | 'critical'
  ): (typeof SecurityEventSeverity)[keyof typeof SecurityEventSeverity] {
    switch (threatSeverity) {
      case 'critical':
        return SecurityEventSeverity.CRITICAL;
      case 'high':
        return SecurityEventSeverity.HIGH;
      case 'medium':
        return SecurityEventSeverity.MEDIUM;
      case 'low':
        return SecurityEventSeverity.LOW;
      default:
        return SecurityEventSeverity.MEDIUM;
    }
  }
}

/**
 * Default security scan configuration
 */
export const DEFAULT_SECURITY_SCAN_CONFIG: SecurityScanConfig = {
  enableMalwareScanning: true,
  enableContentAnalysis: true,
  enableBehaviorAnalysis: true,
  enableThreatIntelligence: true,
  maxScanTime: 30000, // 30 seconds
  quarantineThreats: true,
  alertOnHighRisk: true,
};

/**
 * Create a SecurityScanner instance with default configuration
 */
export function createSecurityScanner(
  config?: Partial<SecurityScanConfig>
): SecurityScannerService {
  const finalConfig = { ...DEFAULT_SECURITY_SCAN_CONFIG, ...config };
  return new SecurityScannerService(finalConfig);
}
