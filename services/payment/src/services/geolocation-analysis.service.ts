import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';
import { FraudSignal, Geolocation } from '../types/fraud.types';
import { Transaction } from '../types/payment.types';

export interface GeolocationConfig {
  enableVpnDetection: boolean;
  enableTorDetection: boolean;
  enableProxyDetection: boolean;
  enableVelocityChecks: boolean;
  countryBlacklist: string[];
  countryWhitelist: string[];
  highRiskCountries: string[];
  maxDistanceKm: number;
  maxVelocityKmh: number;
  ipReputationThreshold: number;
}

export interface IPReputation {
  ipAddress: string;
  riskScore: number;
  reputation: 'good' | 'neutral' | 'suspicious' | 'malicious';
  isVpn: boolean;
  isProxy: boolean;
  isTor: boolean;
  isDataCenter: boolean;
  isMalware: boolean;
  country: string;
  region: string;
  city: string;
  isp: string;
  asn: number;
  threatTypes: string[];
  lastUpdated: Date;
}

export interface LocationVelocity {
  userId: string;
  previousLocation: Geolocation;
  currentLocation: Geolocation;
  distanceKm: number;
  timeElapsedMinutes: number;
  velocityKmh: number;
  isImpossible: boolean;
  isUnlikely: boolean;
}

export class GeolocationAnalysisService {
  private prisma: PrismaClient;
  private config: GeolocationConfig;

  constructor(prisma: PrismaClient, config: GeolocationConfig) {
    this.prisma = prisma;
    this.config = config;
  }

  /**
   * Analyze geolocation and IP for fraud signals
   */
  async analyzeGeolocation(transaction: Transaction): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];

    try {
      const ipAddress = transaction.metadata?.ipAddress;
      const geolocation = transaction.metadata?.geolocation as Geolocation;

      if (!ipAddress && !geolocation) {
        signals.push({
          type: 'missing_location_data',
          value: null,
          riskContribution: 10,
          description: 'No IP address or geolocation data available',
        });
        return signals;
      }

      // IP reputation analysis
      if (ipAddress) {
        const ipSignals = await this.analyzeIPReputation(ipAddress);
        signals.push(...ipSignals);
      }

      // Geolocation analysis
      if (geolocation) {
        const geoSignals = await this.analyzeGeolocationData(
          geolocation,
          transaction
        );
        signals.push(...geoSignals);
      }

      // Velocity analysis
      if (
        this.config.enableVelocityChecks &&
        transaction.userId &&
        geolocation
      ) {
        const velocitySignals = await this.analyzeLocationVelocity(
          transaction.userId,
          geolocation
        );
        signals.push(...velocitySignals);
      }

      // Cross-reference IP and geolocation
      if (ipAddress && geolocation) {
        const consistencySignals = await this.analyzeIPGeolocationConsistency(
          ipAddress,
          geolocation
        );
        signals.push(...consistencySignals);
      }

      return signals;
    } catch (error) {
      logger.error('Error analyzing geolocation', {
        error: error instanceof Error ? error.message : 'Unknown error',
        transactionId: transaction.id,
      });
      return signals;
    }
  }

  /**
   * Analyze IP reputation and characteristics
   */
  private async analyzeIPReputation(ipAddress: string): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];

    try {
      const ipReputation = await this.getIPReputation(ipAddress);

      if (!ipReputation) {
        signals.push({
          type: 'unknown_ip_reputation',
          value: ipAddress,
          riskContribution: 5,
          description: 'IP reputation could not be determined',
        });
        return signals;
      }

      // High-risk IP
      if (ipReputation.riskScore >= this.config.ipReputationThreshold) {
        signals.push({
          type: 'high_risk_ip',
          value: ipReputation.riskScore,
          riskContribution: Math.min(40, ipReputation.riskScore),
          description: `IP has high risk score: ${ipReputation.riskScore}`,
        });
      }

      // Malicious IP
      if (ipReputation.reputation === 'malicious') {
        signals.push({
          type: 'malicious_ip',
          value: ipAddress,
          riskContribution: 50,
          description: 'IP address is flagged as malicious',
        });
      }

      // VPN detection
      if (this.config.enableVpnDetection && ipReputation.isVpn) {
        signals.push({
          type: 'vpn_detected',
          value: ipAddress,
          riskContribution: 20,
          description: 'Transaction originated from VPN',
        });
      }

      // Proxy detection
      if (this.config.enableProxyDetection && ipReputation.isProxy) {
        signals.push({
          type: 'proxy_detected',
          value: ipAddress,
          riskContribution: 25,
          description: 'Transaction originated from proxy server',
        });
      }

      // Tor detection
      if (this.config.enableTorDetection && ipReputation.isTor) {
        signals.push({
          type: 'tor_detected',
          value: ipAddress,
          riskContribution: 40,
          description: 'Transaction originated from Tor network',
        });
      }

      // Data center IP
      if (ipReputation.isDataCenter) {
        signals.push({
          type: 'datacenter_ip',
          value: ipAddress,
          riskContribution: 15,
          description: 'Transaction originated from data center',
        });
      }

      // Malware-infected IP
      if (ipReputation.isMalware) {
        signals.push({
          type: 'malware_ip',
          value: ipAddress,
          riskContribution: 45,
          description: 'IP address is associated with malware',
        });
      }

      // Threat types
      if (ipReputation.threatTypes.length > 0) {
        signals.push({
          type: 'ip_threat_indicators',
          value: ipReputation.threatTypes,
          riskContribution: ipReputation.threatTypes.length * 10,
          description: `IP has threat indicators: ${ipReputation.threatTypes.join(', ')}`,
        });
      }

      return signals;
    } catch (error) {
      logger.error('Error analyzing IP reputation', {
        error: error instanceof Error ? error.message : 'Unknown error',
        ipAddress,
      });
      return [];
    }
  }

  /**
   * Analyze geolocation data for suspicious patterns
   */
  private async analyzeGeolocationData(
    geolocation: Geolocation,
    transaction: Transaction
  ): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];

    try {
      // Country blacklist check
      if (this.config.countryBlacklist.includes(geolocation.country)) {
        signals.push({
          type: 'blacklisted_country',
          value: geolocation.country,
          riskContribution: 35,
          description: `Transaction from blacklisted country: ${geolocation.country}`,
        });
      }

      // High-risk country check
      if (this.config.highRiskCountries.includes(geolocation.country)) {
        signals.push({
          type: 'high_risk_country',
          value: geolocation.country,
          riskContribution: 20,
          description: `Transaction from high-risk country: ${geolocation.country}`,
        });
      }

      // Country whitelist (positive signal)
      if (this.config.countryWhitelist.includes(geolocation.country)) {
        signals.push({
          type: 'whitelisted_country',
          value: geolocation.country,
          riskContribution: -10,
          description: `Transaction from whitelisted country: ${geolocation.country}`,
        });
      }

      // Unusual location for user
      if (transaction.userId) {
        const isUnusualLocation = await this.isUnusualLocationForUser(
          transaction.userId,
          geolocation
        );
        if (isUnusualLocation) {
          signals.push({
            type: 'unusual_location',
            value: `${geolocation.city}, ${geolocation.country}`,
            riskContribution: 15,
            description: 'Transaction from unusual location for this user',
          });
        }
      }

      // Precision analysis
      if (geolocation.latitude && geolocation.longitude) {
        const precisionSignals = this.analyzeLocationPrecision(geolocation);
        signals.push(...precisionSignals);
      }

      return signals;
    } catch (error) {
      logger.error('Error analyzing geolocation data', {
        error: error instanceof Error ? error.message : 'Unknown error',
        geolocation,
      });
      return [];
    }
  }

  /**
   * Analyze location velocity for impossible travel
   */
  private async analyzeLocationVelocity(
    userId: string,
    currentLocation: Geolocation
  ): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];

    try {
      // Get user's last known location
      const lastTransaction = await this.prisma.transaction.findFirst({
        where: {
          userId,
          metadata: {
            path: ['geolocation'],
            not: null,
          },
          createdAt: {
            lt: new Date(), // Before current transaction
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          metadata: true,
          createdAt: true,
        },
      });

      if (!lastTransaction || !lastTransaction.metadata?.geolocation) {
        return signals;
      }

      const previousLocation = lastTransaction.metadata
        .geolocation as Geolocation;
      const timeElapsedMs = Date.now() - lastTransaction.createdAt.getTime();
      const timeElapsedMinutes = timeElapsedMs / (1000 * 60);

      // Calculate distance between locations
      const distanceKm = this.calculateDistance(
        previousLocation.latitude || 0,
        previousLocation.longitude || 0,
        currentLocation.latitude || 0,
        currentLocation.longitude || 0
      );

      if (distanceKm > 0 && timeElapsedMinutes > 0) {
        const velocityKmh = (distanceKm / timeElapsedMinutes) * 60;

        const velocity: LocationVelocity = {
          userId,
          previousLocation,
          currentLocation,
          distanceKm,
          timeElapsedMinutes,
          velocityKmh,
          isImpossible: velocityKmh > this.config.maxVelocityKmh,
          isUnlikely: velocityKmh > this.config.maxVelocityKmh * 0.7,
        };

        // Impossible travel
        if (velocity.isImpossible) {
          signals.push({
            type: 'impossible_travel',
            value: {
              distanceKm: Math.round(distanceKm),
              timeMinutes: Math.round(timeElapsedMinutes),
              velocityKmh: Math.round(velocityKmh),
            },
            riskContribution: 45,
            description: `Impossible travel: ${Math.round(distanceKm)}km in ${Math.round(timeElapsedMinutes)} minutes`,
          });
        }
        // Unlikely travel
        else if (velocity.isUnlikely) {
          signals.push({
            type: 'unlikely_travel',
            value: {
              distanceKm: Math.round(distanceKm),
              timeMinutes: Math.round(timeElapsedMinutes),
              velocityKmh: Math.round(velocityKmh),
            },
            riskContribution: 25,
            description: `Unlikely travel: ${Math.round(distanceKm)}km in ${Math.round(timeElapsedMinutes)} minutes`,
          });
        }
      }

      return signals;
    } catch (error) {
      logger.error('Error analyzing location velocity', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      return [];
    }
  }

  /**
   * Analyze consistency between IP geolocation and reported location
   */
  private async analyzeIPGeolocationConsistency(
    ipAddress: string,
    reportedLocation: Geolocation
  ): Promise<FraudSignal[]> {
    const signals: FraudSignal[] = [];

    try {
      const ipReputation = await this.getIPReputation(ipAddress);

      if (!ipReputation) {
        return signals;
      }

      // Country mismatch
      if (ipReputation.country !== reportedLocation.country) {
        signals.push({
          type: 'ip_location_mismatch',
          value: {
            ipCountry: ipReputation.country,
            reportedCountry: reportedLocation.country,
          },
          riskContribution: 20,
          description: `IP country (${ipReputation.country}) doesn't match reported location (${reportedLocation.country})`,
        });
      }

      // City/region mismatch (if available)
      if (ipReputation.city && reportedLocation.city) {
        const cityDistance = this.calculateCityDistance(
          ipReputation.city,
          ipReputation.country,
          reportedLocation.city,
          reportedLocation.country
        );

        if (cityDistance > 100) {
          // More than 100km apart
          signals.push({
            type: 'ip_city_mismatch',
            value: {
              ipCity: ipReputation.city,
              reportedCity: reportedLocation.city,
              distanceKm: cityDistance,
            },
            riskContribution: 15,
            description: `IP city (${ipReputation.city}) is ${cityDistance}km from reported city (${reportedLocation.city})`,
          });
        }
      }

      return signals;
    } catch (error) {
      logger.error('Error analyzing IP-geolocation consistency', {
        error: error instanceof Error ? error.message : 'Unknown error',
        ipAddress,
      });
      return [];
    }
  }

  /**
   * Get IP reputation from external service or cache
   */
  private async getIPReputation(
    ipAddress: string
  ): Promise<IPReputation | null> {
    try {
      // In a real implementation, this would query external IP reputation services
      // like MaxMind, IPQualityScore, VirusTotal, etc.

      // For simulation, we'll generate mock reputation data
      const mockReputation: IPReputation = {
        ipAddress,
        riskScore: Math.floor(Math.random() * 100),
        reputation: this.getRandomReputation(),
        isVpn: Math.random() < 0.1,
        isProxy: Math.random() < 0.05,
        isTor: Math.random() < 0.02,
        isDataCenter: Math.random() < 0.15,
        isMalware: Math.random() < 0.03,
        country: this.getRandomCountry(),
        region: 'Unknown',
        city: 'Unknown',
        isp: 'Unknown ISP',
        asn: Math.floor(Math.random() * 65535),
        threatTypes: this.getRandomThreatTypes(),
        lastUpdated: new Date(),
      };

      return mockReputation;
    } catch (error) {
      logger.error('Error getting IP reputation', {
        error: error instanceof Error ? error.message : 'Unknown error',
        ipAddress,
      });
      return null;
    }
  }

  /**
   * Check if location is unusual for user
   */
  private async isUnusualLocationForUser(
    userId: string,
    currentLocation: Geolocation
  ): Promise<boolean> {
    try {
      // Get user's historical locations
      const historicalTransactions = await this.prisma.transaction.findMany({
        where: {
          userId,
          metadata: {
            path: ['geolocation'],
            not: null,
          },
        },
        select: {
          metadata: true,
        },
        take: 20, // Last 20 transactions
      });

      if (historicalTransactions.length < 3) {
        return false; // Not enough data to determine
      }

      const historicalCountries = historicalTransactions
        .map(t => (t.metadata?.geolocation as Geolocation)?.country)
        .filter(Boolean);

      const uniqueCountries = new Set(historicalCountries);

      // If user has only transacted from one country and this is different
      if (
        uniqueCountries.size === 1 &&
        !uniqueCountries.has(currentLocation.country)
      ) {
        return true;
      }

      // If this country appears in less than 20% of transactions
      const countryFrequency =
        historicalCountries.filter(c => c === currentLocation.country).length /
        historicalCountries.length;
      return countryFrequency < 0.2;
    } catch (error) {
      logger.error('Error checking unusual location', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      return false;
    }
  }

  /**
   * Analyze location precision for spoofing indicators
   */
  private analyzeLocationPrecision(geolocation: Geolocation): FraudSignal[] {
    const signals: FraudSignal[] = [];

    if (!geolocation.latitude || !geolocation.longitude) {
      return signals;
    }

    // Check for exact coordinates (potential spoofing)
    const lat = geolocation.latitude;
    const lng = geolocation.longitude;

    // Coordinates with too many decimal places or too few (suspicious precision)
    const latStr = lat.toString();
    const lngStr = lng.toString();

    if (latStr.includes('.') && lngStr.includes('.')) {
      const latDecimals = latStr.split('.')[1].length;
      const lngDecimals = lngStr.split('.')[1].length;

      // Too precise (more than 6 decimal places) or not precise enough (less than 2)
      if (latDecimals > 6 || lngDecimals > 6) {
        signals.push({
          type: 'suspicious_location_precision',
          value: { latitude: lat, longitude: lng },
          riskContribution: 10,
          description: 'Location coordinates have suspicious precision',
        });
      } else if (latDecimals < 2 || lngDecimals < 2) {
        signals.push({
          type: 'low_location_precision',
          value: { latitude: lat, longitude: lng },
          riskContribution: 5,
          description: 'Location coordinates have unusually low precision',
        });
      }
    }

    // Check for common spoofed coordinates (0,0), (null island)
    if (lat === 0 && lng === 0) {
      signals.push({
        type: 'null_island_coordinates',
        value: { latitude: lat, longitude: lng },
        riskContribution: 30,
        description: 'Location coordinates point to Null Island (0,0)',
      });
    }

    return signals;
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Calculate distance between cities (simplified)
   */
  private calculateCityDistance(
    city1: string,
    country1: string,
    city2: string,
    country2: string
  ): number {
    // In a real implementation, this would use a geocoding service
    // For now, return a mock distance
    if (country1 !== country2) {
      return Math.random() * 5000 + 500; // 500-5500 km for different countries
    }
    return Math.random() * 500; // 0-500 km for same country
  }

  /**
   * Helper methods for mock data generation
   */
  private getRandomReputation():
    | 'good'
    | 'neutral'
    | 'suspicious'
    | 'malicious' {
    const rand = Math.random();
    if (rand < 0.7) return 'good';
    if (rand < 0.9) return 'neutral';
    if (rand < 0.98) return 'suspicious';
    return 'malicious';
  }

  private getRandomCountry(): string {
    const countries = [
      'US',
      'CA',
      'GB',
      'DE',
      'FR',
      'JP',
      'AU',
      'BR',
      'IN',
      'CN',
      'RU',
      'NG',
      'ZA',
    ];
    return countries[Math.floor(Math.random() * countries.length)];
  }

  private getRandomThreatTypes(): string[] {
    const threats = [
      'malware',
      'phishing',
      'spam',
      'botnet',
      'scanner',
      'tor_exit',
    ];
    const count = Math.floor(Math.random() * 3);
    const selected: string[] = [];

    for (let i = 0; i < count; i++) {
      const threat = threats[Math.floor(Math.random() * threats.length)];
      if (!selected.includes(threat)) {
        selected.push(threat);
      }
    }

    return selected;
  }

  /**
   * Get geolocation statistics
   */
  async getGeolocationStatistics(days: number = 30): Promise<{
    totalTransactions: number;
    uniqueCountries: number;
    topCountries: Array<{ country: string; count: number }>;
    vpnTransactions: number;
    torTransactions: number;
    impossibleTravelCases: number;
    highRiskIPs: number;
  }> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const transactions = await this.prisma.transaction.findMany({
        where: {
          createdAt: { gte: startDate },
          OR: [
            { metadata: { path: ['ipAddress'], not: null } },
            { metadata: { path: ['geolocation'], not: null } },
          ],
        },
        select: {
          metadata: true,
          fraudFlags: true,
        },
      });

      const countryCount = new Map<string, number>();
      let vpnCount = 0;
      let torCount = 0;
      let impossibleTravelCount = 0;
      let highRiskIPCount = 0;

      for (const transaction of transactions) {
        const geolocation = transaction.metadata?.geolocation as Geolocation;

        if (geolocation?.country) {
          countryCount.set(
            geolocation.country,
            (countryCount.get(geolocation.country) || 0) + 1
          );
        }

        // Count fraud flags
        if (transaction.fraudFlags) {
          if (transaction.fraudFlags.includes('vpn_detected')) vpnCount++;
          if (transaction.fraudFlags.includes('tor_detected')) torCount++;
          if (transaction.fraudFlags.includes('impossible_travel'))
            impossibleTravelCount++;
          if (transaction.fraudFlags.includes('high_risk_ip'))
            highRiskIPCount++;
        }
      }

      const topCountries = Array.from(countryCount.entries())
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return {
        totalTransactions: transactions.length,
        uniqueCountries: countryCount.size,
        topCountries,
        vpnTransactions: vpnCount,
        torTransactions: torCount,
        impossibleTravelCases: impossibleTravelCount,
        highRiskIPs: highRiskIPCount,
      };
    } catch (error) {
      logger.error('Error getting geolocation statistics', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }
}
