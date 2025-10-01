import {
  GatewayConfig,
  GatewayHealthStatus,
  GatewayMetrics,
  GatewayResponse,
  GatewaySelection,
  PaymentGateway,
  WebhookEvent,
} from '../types';

export interface IGatewayManager {
  // Gateway management
  registerGateway(gateway: PaymentGateway): void;
  getGateway(gatewayId: string): PaymentGateway | undefined;
  getAllGateways(): PaymentGateway[];
  getActiveGateways(): PaymentGateway[];

  // Gateway selection
  selectGateway(criteria: GatewaySelectionCriteria): Promise<GatewaySelection>;
  selectBestGateway(amount: number, currency: string): Promise<PaymentGateway>;

  // Health monitoring
  checkGatewayHealth(gatewayId: string): Promise<GatewayHealthStatus>;
  checkAllGatewaysHealth(): Promise<GatewayHealthStatus[]>;

  // Metrics
  recordMetrics(
    gatewayId: string,
    metrics: Partial<GatewayMetrics>
  ): Promise<void>;
  getGatewayMetrics(
    gatewayId: string,
    period?: { start: Date; end: Date }
  ): Promise<GatewayMetrics[]>;

  // Failover
  handleGatewayFailure(
    gatewayId: string,
    error: Error
  ): Promise<PaymentGateway | null>;
  enableFailover(gatewayId: string): Promise<void>;
  disableFailover(gatewayId: string): Promise<void>;
}

export interface IGatewayService {
  // Configuration
  createConfig(
    config: Omit<GatewayConfig, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<GatewayConfig>;
  updateConfig(
    id: string,
    config: Partial<GatewayConfig>
  ): Promise<GatewayConfig>;
  getConfig(id: string): Promise<GatewayConfig>;
  getAllConfigs(): Promise<GatewayConfig[]>;
  deleteConfig(id: string): Promise<void>;

  // Gateway operations
  initializeGateway(config: GatewayConfig): Promise<PaymentGateway>;
  testGateway(gatewayId: string): Promise<GatewayResponse>;

  // Webhook handling
  processWebhook(
    gatewayId: string,
    payload: string,
    signature: string
  ): Promise<WebhookEvent>;
  verifyWebhookSignature(
    gatewayId: string,
    payload: string,
    signature: string
  ): Promise<boolean>;
}

export interface IGatewayHealthMonitor {
  startMonitoring(): void;
  stopMonitoring(): void;
  checkHealth(gatewayId: string): Promise<GatewayHealthStatus>;
  getHealthStatus(gatewayId: string): GatewayHealthStatus | undefined;
  getAllHealthStatuses(): GatewayHealthStatus[];
  onHealthChange(callback: (status: GatewayHealthStatus) => void): void;
}

export interface IGatewayMetricsCollector {
  recordTransaction(
    gatewayId: string,
    success: boolean,
    responseTime: number,
    amount: number
  ): void;
  recordError(gatewayId: string, errorType: string, errorMessage: string): void;
  getMetrics(
    gatewayId: string,
    period?: { start: Date; end: Date }
  ): Promise<GatewayMetrics>;
  getAggregatedMetrics(period?: {
    start: Date;
    end: Date;
  }): Promise<Record<string, GatewayMetrics>>;
}

export interface GatewaySelectionCriteria {
  amount: number;
  currency: string;
  paymentMethodType?: string;
  country?: string;
  preferredGateways?: string[];
  excludeGateways?: string[];
  requireFeatures?: string[];
}

export interface IGatewayFailoverManager {
  // Failover configuration
  setFailoverChain(primary: string, fallbacks: string[]): void;
  getFailoverChain(gatewayId: string): string[];

  // Failover execution
  executeFailover(
    failedGatewayId: string,
    context: any
  ): Promise<PaymentGateway | null>;

  // Circuit breaker
  isCircuitOpen(gatewayId: string): boolean;
  openCircuit(gatewayId: string): void;
  closeCircuit(gatewayId: string): void;

  // Recovery
  attemptRecovery(gatewayId: string): Promise<boolean>;
  scheduleRecoveryCheck(gatewayId: string, delay: number): void;
}
