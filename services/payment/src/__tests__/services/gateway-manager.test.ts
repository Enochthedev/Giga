import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GatewayFailoverManager } from '../../services/gateway-failover-manager.service';
import { GatewayHealthMonitor } from '../../services/gateway-health-monitor.service';
import { GatewayManager } from '../../services/gateway-manager.service';
import { GatewayMetricsCollector } from '../../services/gateway-metrics-collector.service';
import { PayPalGateway } from '../../services/gateways/paypal-gateway.service';
import { StripeGateway } from '../../services/gateways/stripe-gateway.service';
import {
  GatewayConfig,
  GatewaySelectionCriteria,
} from '../../types/gateway.types';

// Mock the dependencies
vi.mock('../../services/gateway-health-monitor.service');
vi.mock('../../services/gateway-metrics-collector.service');
vi.mock('../../services/gateway-failover-manager.service');
vi.mock('../../services/gateways/stripe-gateway.service');
vi.mock('../../services/gateways/paypal-gateway.service');

describe('GatewayManager', () => {
  let gatewayManager: GatewayManager;
  let mockHealthMonitor: vi.Mocked<GatewayHealthMonitor>;
  let mockMetricsCollector: vi.Mocked<GatewayMetricsCollector>;
  let mockFailoverManager: vi.Mocked<GatewayFailoverManager>;
  let mockStripeGateway: vi.Mocked<StripeGateway>;
  let mockPayPalGateway: vi.Mocked<PayPalGateway>;

  const createMockGatewayConfig = (
    overrides: Partial<GatewayConfig> = {}
  ): GatewayConfig => ({
    id: 'test-gateway',
    type: 'stripe',
    name: 'Test Gateway',
    status: 'active',
    priority: 100,
    credentials: { apiKey: 'test-key' },
    settings: {
      supportedCurrencies: ['USD', 'EUR'],
      supportedCountries: ['US', 'GB'],
      supportedPaymentMethods: ['card'],
      minAmount: 1,
      maxAmount: 10000,
      processingFee: { type: 'percentage', value: 2.9 },
    },
    healthCheck: {
      interval: 60000,
      timeout: 5000,
      retries: 3,
    },
    rateLimit: {
      requestsPerSecond: 10,
      burstLimit: 50,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Create mock instances
    mockHealthMonitor = {
      addGateway: vi.fn(),
      checkHealth: vi.fn(),
      getHealthStatus: vi.fn(),
      recordFailure: vi.fn(),
      recordSuccess: vi.fn(),
    } as any;

    mockMetricsCollector = {
      recordMetrics: vi.fn(),
      getMetrics: vi.fn(),
      getLatestMetrics: vi.fn(),
      recordError: vi.fn(),
    } as any;

    mockFailoverManager = {
      executeFailover: vi.fn(),
      enableFailover: vi.fn(),
      disableFailover: vi.fn(),
    } as any;

    // Mock constructors to return our mock instances
    vi.mocked(GatewayHealthMonitor).mockImplementation(() => mockHealthMonitor);
    vi.mocked(GatewayMetricsCollector).mockImplementation(
      () => mockMetricsCollector
    );
    vi.mocked(GatewayFailoverManager).mockImplementation(
      () => mockFailoverManager
    );

    // Create mock gateways
    mockStripeGateway = {
      getId: vi.fn().mockReturnValue('stripe-1'),
      getType: vi.fn().mockReturnValue('stripe'),
      getConfig: vi
        .fn()
        .mockReturnValue(
          createMockGatewayConfig({ id: 'stripe-1', type: 'stripe' })
        ),
      isActive: vi.fn().mockReturnValue(true),
      supportsCurrency: vi.fn().mockReturnValue(true),
      supportsAmount: vi.fn().mockReturnValue(true),
      healthCheck: vi.fn().mockResolvedValue(true),
    } as any;

    mockPayPalGateway = {
      getId: vi.fn().mockReturnValue('paypal-1'),
      getType: vi.fn().mockReturnValue('paypal'),
      getConfig: vi
        .fn()
        .mockReturnValue(
          createMockGatewayConfig({ id: 'paypal-1', type: 'paypal' })
        ),
      isActive: vi.fn().mockReturnValue(true),
      supportsCurrency: vi.fn().mockReturnValue(true),
      supportsAmount: vi.fn().mockReturnValue(true),
      healthCheck: vi.fn().mockResolvedValue(true),
    } as any;

    gatewayManager = new GatewayManager();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Gateway Registration', () => {
    it('should register a gateway successfully', () => {
      gatewayManager.registerGateway(mockStripeGateway);

      expect(gatewayManager.getGateway('stripe-1')).toBe(mockStripeGateway);
      expect(mockHealthMonitor.addGateway).toHaveBeenCalledWith(
        'stripe-1',
        mockStripeGateway.getConfig().healthCheck
      );
    });

    it('should get all registered gateways', () => {
      gatewayManager.registerGateway(mockStripeGateway);
      gatewayManager.registerGateway(mockPayPalGateway);

      const allGateways = gatewayManager.getAllGateways();
      expect(allGateways).toHaveLength(2);
      expect(allGateways).toContain(mockStripeGateway);
      expect(allGateways).toContain(mockPayPalGateway);
    });

    it('should get only active gateways', () => {
      mockPayPalGateway.isActive.mockReturnValue(false);

      gatewayManager.registerGateway(mockStripeGateway);
      gatewayManager.registerGateway(mockPayPalGateway);

      const activeGateways = gatewayManager.getActiveGateways();
      expect(activeGateways).toHaveLength(1);
      expect(activeGateways[0]).toBe(mockStripeGateway);
    });
  });

  describe('Gateway Selection', () => {
    beforeEach(() => {
      gatewayManager.registerGateway(mockStripeGateway);
      gatewayManager.registerGateway(mockPayPalGateway);

      // Mock health and metrics for scoring
      mockHealthMonitor.getHealthStatus.mockReturnValue({
        gatewayId: 'stripe-1',
        status: 'active',
        lastCheck: new Date(),
        consecutiveFailures: 0,
      });

      mockMetricsCollector.getLatestMetrics.mockResolvedValue({
        gatewayId: 'stripe-1',
        timestamp: new Date(),
        responseTime: 200,
        successRate: 0.95,
        errorRate: 0.05,
        transactionCount: 100,
        transactionVolume: { toNumber: () => 10000 } as any,
        statusCounts: { success: 95, error: 5 },
        errorTypes: {},
      });
    });

    it('should select gateway based on criteria', async () => {
      const criteria: GatewaySelectionCriteria = {
        amount: 100,
        currency: 'USD',
      };

      const selection = await gatewayManager.selectGateway(criteria);

      expect(selection.primary).toBeDefined();
      expect(selection.fallbacks).toBeDefined();
      expect(selection.reason).toContain('Selected based on score');
    });

    it('should select best gateway for amount and currency', async () => {
      const gateway = await gatewayManager.selectBestGateway(100, 'USD');

      expect(gateway).toBeDefined();
      expect([mockStripeGateway, mockPayPalGateway]).toContain(gateway);
    });

    it('should throw error when no eligible gateways available', async () => {
      const criteria: GatewaySelectionCriteria = {
        amount: 100,
        currency: 'JPY', // Not supported by mock gateways
      };

      mockStripeGateway.supportsCurrency.mockReturnValue(false);
      mockPayPalGateway.supportsCurrency.mockReturnValue(false);

      await expect(gatewayManager.selectGateway(criteria)).rejects.toThrow(
        'No eligible payment gateways available'
      );
    });
  });

  describe('Health Monitoring', () => {
    beforeEach(() => {
      gatewayManager.registerGateway(mockStripeGateway);
    });

    it('should check gateway health', async () => {
      const mockHealthStatus = {
        gatewayId: 'stripe-1',
        status: 'active' as const,
        lastCheck: new Date(),
        consecutiveFailures: 0,
      };

      mockHealthMonitor.checkHealth.mockResolvedValue(mockHealthStatus);

      const health = await gatewayManager.checkGatewayHealth('stripe-1');
      expect(health).toEqual(mockHealthStatus);
      expect(mockHealthMonitor.checkHealth).toHaveBeenCalledWith('stripe-1');
    });
  });

  describe('Failover Management', () => {
    beforeEach(() => {
      gatewayManager.registerGateway(mockStripeGateway);
      gatewayManager.registerGateway(mockPayPalGateway);
    });

    it('should handle gateway failure with successful failover', async () => {
      const error = new Error('Gateway timeout');
      mockFailoverManager.executeFailover.mockResolvedValue(mockPayPalGateway);

      const fallbackGateway = await gatewayManager.handleGatewayFailure(
        'stripe-1',
        error
      );

      expect(fallbackGateway).toBe(mockPayPalGateway);
      expect(mockMetricsCollector.recordError).toHaveBeenCalledWith(
        'stripe-1',
        'Error',
        'Gateway timeout'
      );
      expect(mockHealthMonitor.recordFailure).toHaveBeenCalledWith(
        'stripe-1',
        error
      );
      expect(mockFailoverManager.executeFailover).toHaveBeenCalledWith(
        'stripe-1',
        { error }
      );
    });

    it('should enable failover for gateway', async () => {
      await gatewayManager.enableFailover('stripe-1');
      expect(mockFailoverManager.enableFailover).toHaveBeenCalledWith(
        'stripe-1'
      );
    });

    it('should disable failover for gateway', async () => {
      await gatewayManager.disableFailover('stripe-1');
      expect(mockFailoverManager.disableFailover).toHaveBeenCalledWith(
        'stripe-1'
      );
    });
  });
});
