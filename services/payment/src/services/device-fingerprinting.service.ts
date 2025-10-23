import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';
import { FraudSignal } from '../types/fraud.types';
import { Transaction } from '../types/payment.types';

export interface DeviceFingerprint {
  id: string;
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
  cookiesEnabled: boolean;
  javaEnabled: boolean;
  plugins: string[];
  fonts: string[];
  canvas: string;
  webgl: string;
  audioContext: string;
  browserFeatures: Record<string, boolean>;
  hardwareSpecs: {
    cpuCores?: number;
    memory?: number;
    gpu?: string;
  };
  networkInfo: {
    connectionType?: string;
    downlink?: number;
    rtt?: number;
  };
  behavioralMetrics: {
    mouseMovements?: number;
    keystrokes?: number;
    scrollPatterns?: string;
    clickPatterns?: string;
  };
}

export interface DeviceRiskProfile {
  deviceId: string;
  riskScore: number;
  riskFactors: string[];
  userCount: number;
  transactionCount: number;
  fraudCount: number;
  firstSeen: Date;
  lastSeen: Date;
  reputation: 'good' | 'neutral' | 'suspicious' | 'malicious';
  isVpn: boolean;
  isProxy: boolean;
  isEmulator: boolean;
  isBotLikely: boolean;
}

export interface DeviceFingerprintingConfig {
  enableAdvancedFingerprinting: boolean;
  enableBehavioralAnalysis: boolean;
  enableDeviceReputation: boolean;
  fingerprintExpirationDays: number;
  maxDevicesPerUser: number;
  suspiciousDeviceThreshold: number;
}

export class DeviceFingerprintingService {
  private prisma: PrismaClient;
  private config: DeviceFingerprintingConfig;

  constructor(prisma: PrismaClient, config: DeviceFingerprintingConfig) {
    this.prisma = prisma;
    this.config = config;
  }

  /**
   * Generate device fingerprint from transaction metadata
   */
  generateFingerprint(metadata: Record<string, any>): string {
    try {
      const fingerprintData = {
        userAgent: metadata.userAgent || '',
        screenResolution: metadata.screenResolution || '',
        timezone: metadata.timezone || '',
        language: metadata.language || '',
        platform: metadata.platform || '',
        cookiesEnabled: metadata.cookiesEnabled || false,
        javaEnabled: metadata.javaEnabled || false,
        plugins: metadata.plugins || [],
        fonts: metadata.fonts || [],
        canvas: metadata.canvas || '',
        webgl: metadata.webgl || '',
        audioContext: metadata.audioContext || '',
      };

      // Create a hash of the fingerprint data
      const fingerprintString = JSON.stringify(fingerprintData);
      return this.hashFingerprint(fingerprintString);
    } catch (error) {
      logger.error('Error generating device fingerprint', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return 'unknown';
    }
  }

  /**
   * Analyze device fingerprint for fraud signals
   */
  async analyzeDeviceFingerprint(
    transaction: Transaction
  ): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];

    try {
      const deviceFingerprint = transaction.metadata?.deviceFingerprint;

      if (!deviceFingerprint) {
        signals.push({
          type: 'missing_device_fingerprint',
          value: null,
          riskContribution: 15,
          description:
            'Device fingerprint is missing or could not be generated',
        });
        return signals;
      }

      // Get device risk profile
      const deviceProfile = await this.getDeviceRiskProfile(deviceFingerprint);

      if (deviceProfile) {
        // High-risk device
        if (deviceProfile.reputation === 'malicious') {
          signals.push({
            type: 'malicious_device',
            value: deviceFingerprint,
            riskContribution: 50,
            description: 'Device has been flagged as malicious',
          });
        } else if (deviceProfile.reputation === 'suspicious') {
          signals.push({
            type: 'suspicious_device',
            value: deviceFingerprint,
            riskContribution: 30,
            description: 'Device has suspicious activity patterns',
          });
        }

        // Multiple users on same device
        if (deviceProfile.userCount > 5) {
          signals.push({
            type: 'shared_device',
            value: deviceProfile.userCount,
            riskContribution: 20,
            description: `Device used by ${deviceProfile.userCount} different users`,
          });
        }

        // High fraud rate on device
        const fraudRate =
          deviceProfile.fraudCount /
          Math.max(1, deviceProfile.transactionCount);
        if (fraudRate > 0.1) {
          signals.push({
            type: 'high_fraud_device',
            value: fraudRate,
            riskContribution: 35,
            description: `Device has ${(fraudRate * 100).toFixed(1)}% fraud rate`,
          });
        }

        // VPN/Proxy detection
        if (deviceProfile.isVpn) {
          signals.push({
            type: 'device_vpn_detected',
            value: true,
            riskContribution: 15,
            description: 'Device is using VPN connection',
          });
        }

        if (deviceProfile.isProxy) {
          signals.push({
            type: 'device_proxy_detected',
            value: true,
            riskContribution: 20,
            description: 'Device is using proxy connection',
          });
        }

        // Emulator detection
        if (deviceProfile.isEmulator) {
          signals.push({
            type: 'device_emulator_detected',
            value: true,
            riskContribution: 40,
            description: 'Device appears to be an emulator',
          });
        }

        // Bot detection
        if (deviceProfile.isBotLikely) {
          signals.push({
            type: 'device_bot_detected',
            value: true,
            riskContribution: 45,
            description: 'Device shows bot-like behavior patterns',
          });
        }
      }

      // Analyze device characteristics from metadata
      const deviceSignals = await this.analyzeDeviceCharacteristics(
        transaction.metadata || {}
      );
      signals.push(...deviceSignals);

      // Behavioral analysis if enabled
      if (this.config.enableBehavioralAnalysis) {
        const behavioralSignals =
          await this.analyzeBehavioralPatterns(transaction);
        signals.push(...behavioralSignals);
      }

      return signals;
    } catch (error) {
      logger.error('Error analyzing device fingerprint', {
        error: error instanceof Error ? error.message : 'Unknown error',
        transactionId: transaction.id,
      });
      return signals;
    }
  }

  /**
   * Get or create device risk profile
   */
  async getDeviceRiskProfile(
    deviceFingerprint: string
  ): Promise<DeviceRiskProfile | null> {
    try {
      // In a real implementation, this would query a device reputation database
      // For now, we'll simulate device analysis based on transaction history

      const deviceTransactions = await this.prisma.transaction.findMany({
        where: {
          metadata: {
            path: ['deviceFingerprint'],
            equals: deviceFingerprint,
          },
        },
        select: {
          userId: true,
          status: true,
          fraudFlags: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      if (deviceTransactions.length === 0) {
        return null;
      }

      const uniqueUsers = new Set(
        deviceTransactions.map(t => t.userId).filter(Boolean)
      );
      const fraudTransactions = deviceTransactions.filter(
        t => t.fraudFlags && t.fraudFlags.length > 0
      );

      const firstSeen = deviceTransactions[0].createdAt;
      const lastSeen =
        deviceTransactions[deviceTransactions.length - 1].createdAt;

      // Calculate risk score based on various factors
      let riskScore = 0;
      const riskFactors: string[] = [];

      // Multiple users
      if (uniqueUsers.size > 3) {
        riskScore += 20;
        riskFactors.push('multiple_users');
      }

      // High fraud rate
      const fraudRate = fraudTransactions.length / deviceTransactions.length;
      if (fraudRate > 0.1) {
        riskScore += 30;
        riskFactors.push('high_fraud_rate');
      }

      // New device with high activity
      const deviceAgeHours =
        (Date.now() - firstSeen.getTime()) / (1000 * 60 * 60);
      if (deviceAgeHours < 24 && deviceTransactions.length > 10) {
        riskScore += 25;
        riskFactors.push('new_high_activity');
      }

      // Determine reputation
      let reputation: 'good' | 'neutral' | 'suspicious' | 'malicious' =
        'neutral';
      if (riskScore >= 60) {
        reputation = 'malicious';
      } else if (riskScore >= 30) {
        reputation = 'suspicious';
      } else if (riskScore <= 10 && deviceTransactions.length >= 5) {
        reputation = 'good';
      }

      return {
        deviceId: deviceFingerprint,
        riskScore,
        riskFactors,
        userCount: uniqueUsers.size,
        transactionCount: deviceTransactions.length,
        fraudCount: fraudTransactions.length,
        firstSeen,
        lastSeen,
        reputation,
        isVpn: this.detectVPN(deviceFingerprint),
        isProxy: this.detectProxy(deviceFingerprint),
        isEmulator: this.detectEmulator(deviceFingerprint),
        isBotLikely: this.detectBot(deviceFingerprint),
      };
    } catch (error) {
      logger.error('Error getting device risk profile', {
        error: error instanceof Error ? error.message : 'Unknown error',
        deviceFingerprint,
      });
      return null;
    }
  }

  /**
   * Analyze device characteristics for suspicious patterns
   */
  private async analyzeDeviceCharacteristics(
    metadata: Record<string, any>
  ): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];

    try {
      // Suspicious user agent patterns
      const userAgent = metadata.userAgent || '';
      if (this.isSuspiciousUserAgent(userAgent)) {
        signals.push({
          type: 'suspicious_user_agent',
          value: userAgent,
          riskContribution: 20,
          description: 'User agent indicates potential automation or spoofing',
        });
      }

      // Inconsistent device characteristics
      if (this.hasInconsistentCharacteristics(metadata)) {
        signals.push({
          type: 'inconsistent_device_characteristics',
          value: true,
          riskContribution: 25,
          description: 'Device characteristics appear inconsistent or spoofed',
        });
      }

      // Headless browser detection
      if (this.isHeadlessBrowser(metadata)) {
        signals.push({
          type: 'headless_browser_detected',
          value: true,
          riskContribution: 35,
          description: 'Device appears to be using a headless browser',
        });
      }

      // Automation tools detection
      if (this.hasAutomationTools(metadata)) {
        signals.push({
          type: 'automation_tools_detected',
          value: true,
          riskContribution: 40,
          description: 'Device shows signs of automation tools',
        });
      }

      // Unusual screen resolution
      const screenResolution = metadata.screenResolution || '';
      if (this.isUnusualScreenResolution(screenResolution)) {
        signals.push({
          type: 'unusual_screen_resolution',
          value: screenResolution,
          riskContribution: 10,
          description: 'Unusual screen resolution detected',
        });
      }

      return signals;
    } catch (error) {
      logger.error('Error analyzing device characteristics', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return [];
    }
  }

  /**
   * Analyze behavioral patterns
   */
  private async analyzeBehavioralPatterns(
    transaction: Transaction
  ): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];

    try {
      const behavioralMetrics = transaction.metadata?.behavioralMetrics;

      if (!behavioralMetrics) {
        return signals;
      }

      // Lack of human-like mouse movements
      if (behavioralMetrics.mouseMovements === 0) {
        signals.push({
          type: 'no_mouse_movement',
          value: true,
          riskContribution: 20,
          description: 'No mouse movement detected during session',
        });
      }

      // Robotic keystroke patterns
      if (this.hasRoboticKeystrokes(behavioralMetrics.keystrokes)) {
        signals.push({
          type: 'robotic_keystrokes',
          value: true,
          riskContribution: 25,
          description: 'Keystroke patterns appear robotic',
        });
      }

      // Unusual scroll patterns
      if (this.hasUnusualScrollPatterns(behavioralMetrics.scrollPatterns)) {
        signals.push({
          type: 'unusual_scroll_patterns',
          value: true,
          riskContribution: 15,
          description: 'Scroll patterns appear non-human',
        });
      }

      // Rapid form completion
      if (this.hasRapidFormCompletion(behavioralMetrics)) {
        signals.push({
          type: 'rapid_form_completion',
          value: true,
          riskContribution: 30,
          description: 'Form completed unusually quickly',
        });
      }

      return signals;
    } catch (error) {
      logger.error('Error analyzing behavioral patterns', {
        error: error instanceof Error ? error.message : 'Unknown error',
        transactionId: transaction.id,
      });
      return [];
    }
  }

  /**
   * Update device reputation based on transaction outcome
   */
  async updateDeviceReputation(
    deviceFingerprint: string,
    isFraud: boolean,
    severity: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<void> {
    try {
      logger.info('Updating device reputation', {
        deviceFingerprint,
        isFraud,
        severity,
      });

      // In a real implementation, this would update a device reputation database
      // For now, we'll log the update for tracking purposes

      if (isFraud) {
        // Increase device risk score
        logger.warn('Device flagged for fraud', {
          deviceFingerprint,
          severity,
        });
      } else {
        // Decrease device risk score (positive feedback)
        logger.info('Device confirmed legitimate', {
          deviceFingerprint,
        });
      }
    } catch (error) {
      logger.error('Error updating device reputation', {
        error: error instanceof Error ? error.message : 'Unknown error',
        deviceFingerprint,
      });
    }
  }

  /**
   * Get device statistics
   */
  async getDeviceStatistics(days: number = 30): Promise<{
    totalDevices: number;
    newDevices: number;
    suspiciousDevices: number;
    maliciousDevices: number;
    avgDevicesPerUser: number;
    topRiskFactors: Array<{ factor: string; count: number }>;
  }> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get unique devices from transactions
      const deviceTransactions = await this.prisma.transaction.findMany({
        where: {
          createdAt: { gte: startDate },
          metadata: {
            path: ['deviceFingerprint'],
            not: null,
          },
        },
        select: {
          userId: true,
          metadata: true,
          createdAt: true,
          fraudFlags: true,
        },
      });

      const deviceMap = new Map<
        string,
        {
          users: Set<string>;
          firstSeen: Date;
          fraudCount: number;
          totalTransactions: number;
        }
      >();

      deviceTransactions.forEach(transaction => {
        const deviceId = transaction.metadata?.deviceFingerprint;
        if (!deviceId) return;

        if (!deviceMap.has(deviceId)) {
          deviceMap.set(deviceId, {
            users: new Set(),
            firstSeen: transaction.createdAt,
            fraudCount: 0,
            totalTransactions: 0,
          });
        }

        const device = deviceMap.get(deviceId)!;
        if (transaction.userId) {
          device.users.add(transaction.userId);
        }
        device.totalTransactions++;
        if (transaction.fraudFlags && transaction.fraudFlags.length > 0) {
          device.fraudCount++;
        }
        if (transaction.createdAt < device.firstSeen) {
          device.firstSeen = transaction.createdAt;
        }
      });

      const totalDevices = deviceMap.size;
      let newDevices = 0;
      let suspiciousDevices = 0;
      let maliciousDevices = 0;
      let totalUserDeviceRelations = 0;

      const riskFactorCounts = new Map<string, number>();

      deviceMap.forEach((device, deviceId) => {
        totalUserDeviceRelations += device.users.size;

        // Check if new device (created in the last 7 days)
        const deviceAge = Date.now() - device.firstSeen.getTime();
        if (deviceAge < 7 * 24 * 60 * 60 * 1000) {
          newDevices++;
        }

        // Calculate fraud rate
        const fraudRate =
          device.fraudCount / Math.max(1, device.totalTransactions);

        if (fraudRate > 0.3) {
          maliciousDevices++;
          riskFactorCounts.set(
            'high_fraud_rate',
            (riskFactorCounts.get('high_fraud_rate') || 0) + 1
          );
        } else if (fraudRate > 0.1 || device.users.size > 5) {
          suspiciousDevices++;
          if (device.users.size > 5) {
            riskFactorCounts.set(
              'multiple_users',
              (riskFactorCounts.get('multiple_users') || 0) + 1
            );
          }
        }
      });

      const avgDevicesPerUser =
        totalDevices > 0 ? totalUserDeviceRelations / totalDevices : 0;

      const topRiskFactors = Array.from(riskFactorCounts.entries())
        .map(([factor, count]) => ({ factor, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        totalDevices,
        newDevices,
        suspiciousDevices,
        maliciousDevices,
        avgDevicesPerUser,
        topRiskFactors,
      };
    } catch (error) {
      logger.error('Error getting device statistics', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Helper methods for device analysis
   */
  private hashFingerprint(fingerprintString: string): string {
    // Simple hash function - in production, use a proper cryptographic hash
    let hash = 0;
    for (let i = 0; i < fingerprintString.length; i++) {
      const char = fingerprintString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /phantom/i,
      /selenium/i,
      /webdriver/i,
      /headless/i,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  private hasInconsistentCharacteristics(
    metadata: Record<string, any>
  ): boolean {
    // Check for inconsistencies between reported characteristics
    const platform = metadata.platform || '';
    const userAgent = metadata.userAgent || '';

    // Example: Windows platform but Mac user agent
    if (
      platform.toLowerCase().includes('win') &&
      userAgent.toLowerCase().includes('mac')
    ) {
      return true;
    }

    // Example: Mobile platform but desktop screen resolution
    if (platform.toLowerCase().includes('mobile')) {
      const resolution = metadata.screenResolution || '';
      const [width] = resolution.split('x').map(Number);
      if (width > 1200) {
        return true;
      }
    }

    return false;
  }

  private isHeadlessBrowser(metadata: Record<string, any>): boolean {
    // Check for headless browser indicators
    const plugins = metadata.plugins || [];
    const webgl = metadata.webgl || '';

    // Headless browsers often have no plugins or limited WebGL support
    return plugins.length === 0 || webgl.includes('SwiftShader');
  }

  private hasAutomationTools(metadata: Record<string, any>): boolean {
    // Check for automation tool indicators
    const browserFeatures = metadata.browserFeatures || {};

    // Selenium WebDriver detection
    return (
      browserFeatures.webdriver === true ||
      browserFeatures.selenium === true ||
      browserFeatures.phantom === true
    );
  }

  private isUnusualScreenResolution(screenResolution: string): boolean {
    if (!screenResolution) return false;

    const [width, height] = screenResolution.split('x').map(Number);

    // Very small or very large resolutions are suspicious
    return width < 800 || width > 4000 || height < 600 || height > 3000;
  }

  private hasRoboticKeystrokes(keystrokes: any): boolean {
    // Analyze keystroke patterns for robotic behavior
    // This would require more detailed keystroke timing data
    return false; // Placeholder
  }

  private hasUnusualScrollPatterns(scrollPatterns: any): boolean {
    // Analyze scroll patterns for non-human behavior
    // This would require detailed scroll event data
    return false; // Placeholder
  }

  private hasRapidFormCompletion(behavioralMetrics: any): boolean {
    // Check if form was completed unusually quickly
    const completionTime = behavioralMetrics.formCompletionTime;
    return completionTime && completionTime < 5000; // Less than 5 seconds
  }

  private detectVPN(deviceFingerprint: string): boolean {
    // VPN detection logic - would integrate with VPN detection service
    return Math.random() < 0.1; // 10% chance for simulation
  }

  private detectProxy(deviceFingerprint: string): boolean {
    // Proxy detection logic
    return Math.random() < 0.05; // 5% chance for simulation
  }

  private detectEmulator(deviceFingerprint: string): boolean {
    // Emulator detection logic
    return Math.random() < 0.02; // 2% chance for simulation
  }

  private detectBot(deviceFingerprint: string): boolean {
    // Bot detection logic
    return Math.random() < 0.03; // 3% chance for simulation
  }
}
