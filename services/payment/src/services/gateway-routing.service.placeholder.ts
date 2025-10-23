// Placeholder for GatewayRoutingService
export class GatewayRoutingService {
  constructor(healthMonitor: any, metricsCollector: any, configManager: any) {
    // Placeholder implementation
  }
}

export class GatewayPerformanceOptimizerService {
  constructor(metricsCollector: any, healthMonitor: any) {
    // Placeholder implementation
  }
}

export type LoadBalancerStats = {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
};
