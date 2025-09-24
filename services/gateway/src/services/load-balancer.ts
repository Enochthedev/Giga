import { FastifyRequest } from 'fastify';
import { InstanceMetrics, LoadBalancingStrategy, ServiceInstance } from '../types/index.js';

export class LoadBalancer {
  private roundRobinCounters: Map<string, number> = new Map();
  private stickySessionMap: Map<string, string> = new Map();

  /**
   * Select an instance based on the load balancing strategy
   */
  selectInstance(
    serviceId: string,
    instances: ServiceInstance[],
    strategy: LoadBalancingStrategy,
    _request: FastifyRequest
  ): ServiceInstance | null {
    const healthyInstances = instances.filter(instance => instance.isHealthy);

    if (healthyInstances.length === 0) {
      return null;
    }

    if (healthyInstances.length === 1) {
      return healthyInstances[0];
    }

    switch (strategy.algorithm) {
      case 'round-robin':
        return this.roundRobin(serviceId, healthyInstances);

      case 'weighted':
        return this.weightedRoundRobin(serviceId, healthyInstances);

      case 'least-connections':
        return this.leastConnections(healthyInstances);

      case 'response-time':
        return this.responseTimeBased(healthyInstances);

      default:
        return this.roundRobin(serviceId, healthyInstances);
    }
  }

  /**
   * Round-robin load balancing
   */
  private roundRobin(serviceId: string, instances: ServiceInstance[]): ServiceInstance {
    const counter = this.roundRobinCounters.get(serviceId) || 0;
    const selectedIndex = counter % instances.length;

    this.roundRobinCounters.set(serviceId, counter + 1);

    return instances[selectedIndex];
  }

  /**
   * Weighted round-robin load balancing
   */
  private weightedRoundRobin(serviceId: string, instances: ServiceInstance[]): ServiceInstance {
    // Calculate total weight
    const totalWeight = instances.reduce((sum, instance) => sum + instance.weight, 0);

    if (totalWeight === 0) {
      return this.roundRobin(serviceId, instances);
    }

    // Get current counter and increment
    const counter = this.roundRobinCounters.get(serviceId) || 0;
    this.roundRobinCounters.set(serviceId, counter + 1);

    // Find instance based on weighted distribution
    const targetWeight = (counter % totalWeight) + 1;
    let currentWeight = 0;

    for (const instance of instances) {
      currentWeight += instance.weight;
      if (currentWeight >= targetWeight) {
        return instance;
      }
    }

    // Fallback to first instance
    return instances[0];
  }

  /**
   * Least connections load balancing
   */
  private leastConnections(instances: ServiceInstance[]): ServiceInstance {
    return instances.reduce((least, current) => {
      if (current.currentConnections < least.currentConnections) {
        return current;
      }
      // If connections are equal, prefer instance with better response time
      if (current.currentConnections === least.currentConnections) {
        return current.responseTime < least.responseTime ? current : least;
      }
      return least;
    });
  }

  /**
   * Response time based load balancing
   */
  private responseTimeBased(instances: ServiceInstance[]): ServiceInstance {
    // Find instance with best response time and low error rate
    return instances.reduce((best, current) => {
      // Prefer instances with lower error rates
      if (current.errorRate < best.errorRate) {
        return current;
      }
      if (current.errorRate === best.errorRate) {
        // If error rates are equal, prefer faster response time
        return current.responseTime < best.responseTime ? current : best;
      }
      return best;
    });
  }

  /**
   * Handle sticky sessions
   */
  selectInstanceWithStickySession(
    serviceId: string,
    instances: ServiceInstance[],
    strategy: LoadBalancingStrategy,
    request: FastifyRequest
  ): ServiceInstance | null {
    if (!strategy.stickySession || !strategy.sessionKey) {
      return this.selectInstance(serviceId, instances, strategy, request);
    }

    // Extract session identifier
    const sessionId = this.extractSessionId(request, strategy.sessionKey);
    if (!sessionId) {
      return this.selectInstance(serviceId, instances, strategy, request);
    }

    // Check if we have a sticky session mapping
    const stickyKey = `${serviceId}:${sessionId}`;
    const stickyInstanceId = this.stickySessionMap.get(stickyKey);

    if (stickyInstanceId) {
      // Find the sticky instance
      const stickyInstance = instances.find(
        instance => instance.id === stickyInstanceId && instance.isHealthy
      );

      if (stickyInstance) {
        return stickyInstance;
      } else {
        // Remove invalid sticky session mapping
        this.stickySessionMap.delete(stickyKey);
      }
    }

    // No valid sticky session, select new instance and create mapping
    const selectedInstance = this.selectInstance(serviceId, instances, strategy, request);
    if (selectedInstance) {
      this.stickySessionMap.set(stickyKey, selectedInstance.id);
    }

    return selectedInstance;
  }

  /**
   * Extract session ID from request
   */
  private extractSessionId(request: FastifyRequest, sessionKey: string): string | null {
    // Try to get session ID from different sources

    // 1. From headers
    const headerValue = request.headers[sessionKey.toLowerCase()];
    if (headerValue && typeof headerValue === 'string') {
      return headerValue;
    }

    // 2. From cookies
    const cookies = request.headers.cookie;
    if (cookies) {
// eslint-disable-next-line security/detect-unsafe-regex
      const cookieMatch = cookies.match(new RegExp(`${sessionKey}=([^;]+)`));
      if (cookieMatch) {
        return cookieMatch[1];
      }
    }

    // 3. From query parameters
    const queryValue = (request.query as any)?.[sessionKey];
    if (queryValue && typeof queryValue === 'string') {
      return queryValue;
    }

    // 4. From user context (if authenticated)
    const userId = (request as any).user?.userId;
    if (userId && sessionKey === 'userId') {
      return userId;
    }

    return null;
  }

  /**
   * Update instance metrics
   */
  updateInstanceMetrics(instanceId: string, metrics: InstanceMetrics): void {
    // This method would be called by the proxy layer to update metrics
    // The actual instance update would be handled by the ServiceRegistry
    console.log(`Updating metrics for instance ${instanceId}:`, {
      responseTime: metrics.responseTime,
      errorRate: metrics.errorCount / Math.max(metrics.requestCount, 1),
    });
  }

  /**
   * Increment connection count for an instance
   */
  incrementConnections(instanceId: string, instances: ServiceInstance[]): void {
    const instance = instances.find(inst => inst.id === instanceId);
    if (instance) {
      instance.currentConnections++;
    }
  }

  /**
   * Decrement connection count for an instance
   */
  decrementConnections(instanceId: string, instances: ServiceInstance[]): void {
    const instance = instances.find(inst => inst.id === instanceId);
    if (instance && instance.currentConnections > 0) {
      instance.currentConnections--;
    }
  }

  /**
   * Remove unhealthy instance from load balancing
   */
  removeUnhealthyInstance(serviceId: string, instanceId: string): void {
    // Remove from sticky session mappings
    const keysToRemove: string[] = [];
    for (const [key, mappedInstanceId] of this.stickySessionMap.entries()) {
      if (key.startsWith(`${serviceId}:`) && mappedInstanceId === instanceId) {
        keysToRemove.push(key);
      }
    }

    for (const key of keysToRemove) {
      this.stickySessionMap.delete(key);
    }

    console.log(`Removed unhealthy instance ${instanceId} from load balancing`);
  }

  /**
   * Clear sticky sessions for a service
   */
  clearStickySessionsForService(serviceId: string): void {
    const keysToRemove: string[] = [];
    for (const key of this.stickySessionMap.keys()) {
      if (key.startsWith(`${serviceId}:`)) {
        keysToRemove.push(key);
      }
    }

    for (const key of keysToRemove) {
      this.stickySessionMap.delete(key);
    }

    console.log(`Cleared sticky sessions for service: ${serviceId}`);
  }

  /**
   * Get load balancing statistics
   */
  getStats(): {
    roundRobinCounters: Record<string, number>;
    stickySessionCount: number;
    stickySessionsByService: Record<string, number>;
  } {
    const roundRobinCounters: Record<string, number> = {};
    for (const [serviceId, counter] of this.roundRobinCounters.entries()) {
      roundRobinCounters[serviceId] = counter;
    }

    const stickySessionsByService: Record<string, number> = {};
    for (const key of this.stickySessionMap.keys()) {
      const serviceId = key.split(':')[0];
      stickySessionsByService[serviceId] = (stickySessionsByService[serviceId] || 0) + 1;
    }

    return {
      roundRobinCounters,
      stickySessionCount: this.stickySessionMap.size,
      stickySessionsByService,
    };
  }

  /**
   * Reset load balancing state
   */
  reset(): void {
    this.roundRobinCounters.clear();
    this.stickySessionMap.clear();
    console.log('Load balancer state reset');
  }
}