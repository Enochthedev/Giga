import { EventEmitter } from 'events';
import {
  InstanceMetrics,
  PathRewriteRule,
  ServiceConfig,
  ServiceDefinition,
  ServiceDiscoveryConfig,
  ServiceEndpoint,
  ServiceEvent,
  ServiceInstance,
  ServiceVersionConfig,
} from '../types/index.js';

export class ServiceRegistry extends EventEmitter {
  private services: Map<string, ServiceConfig> = new Map();
  private instances: Map<string, ServiceInstance[]> = new Map();
  private healthCheckIntervals: Map<string, NodeJS.Timeout> = new Map();
  private serviceVersions: Map<string, ServiceVersionConfig[]> = new Map();
  private discoveryConfig: ServiceDiscoveryConfig | null = null;
  private discoveryInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.setupEventHandlers();
  }

  /**
   * Configure service discovery
   */
  configureDiscovery(config: ServiceDiscoveryConfig): void {
    this.discoveryConfig = config;

    if (config.enabled) {
      this.startServiceDiscovery();
    } else {
      this.stopServiceDiscovery();
    }
  }

  /**
   * Start automatic service discovery
   */
  private startServiceDiscovery(): void {
    if (!this.discoveryConfig || this.discoveryInterval) {
      return;
    }

    this.discoveryInterval = setInterval(async () => {
      try {
        await this.discoverServices();
      } catch (error) {
        console.error('Service discovery failed:', error);
        this.emit('discovery_error', {
          type: 'discovery_error',
          serviceId: 'all',
          timestamp: new Date(),
          data: {
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        } as ServiceEvent);
      }
    }, this.discoveryConfig.interval);

    console.log('Service discovery started');
  }

  /**
   * Stop automatic service discovery
   */
  private stopServiceDiscovery(): void {
    if (this.discoveryInterval) {
      clearInterval(this.discoveryInterval);
      this.discoveryInterval = null;
      console.log('Service discovery stopped');
    }
  }

  /**
   * Discover services from configured provider
   */
  async discoverServices(): Promise<ServiceDefinition[]> {
    if (!this.discoveryConfig) {
      return [];
    }

    try {
      let discoveredServices: ServiceDefinition[] = [];

      switch (this.discoveryConfig.provider) {
        case 'dns':
          discoveredServices = await this.discoverFromDNS();
          break;
        case 'consul':
          discoveredServices = await this.discoverFromConsul();
          break;
        case 'kubernetes':
          discoveredServices = await this.discoverFromKubernetes();
          break;
        case 'static':
          discoveredServices = await this.discoverFromStatic();
          break;
        default:
          console.warn(
            `Unsupported discovery provider: ${this.discoveryConfig.provider}`
          );
      }

      // Update registry with discovered services
      for (const service of discoveredServices) {
        this.registerOrUpdateService(service);
      }

      return discoveredServices;
    } catch (error) {
      console.error('Service discovery failed:', error);
      throw error;
    }
  }

  /**
   * Register or update a service (used by discovery)
   */
  private registerOrUpdateService(service: ServiceDefinition): void {
    const existingService = this.services.get(service.id);

    if (existingService) {
      // Update existing service if endpoints have changed
      const newUpstream = service.endpoints.map(ep => ep.url);
      if (
        JSON.stringify(existingService.upstream) !== JSON.stringify(newUpstream)
      ) {
        this.updateServiceEndpoints(service.id, service.endpoints);
      }
    } else {
      // Register new service
      this.registerService(service);
    }
  }

  /**
   * Update service endpoints
   */
  updateServiceEndpoints(
    serviceId: string,
    endpoints: ServiceEndpoint[]
  ): void {
    const service = this.services.get(serviceId);
    if (!service) {
      throw new Error(`Service not found: ${serviceId}`);
    }

    // Update service config
    service.upstream = endpoints.map(ep => ep.url);

    // Create new instances
    const newInstances: ServiceInstance[] = endpoints.map(
      (endpoint, index) => ({
        id: `${serviceId}-${index}`,
        url: endpoint.url,
        weight: endpoint.weight || 1,
        currentConnections: 0,
        responseTime: 0,
        errorRate: 0,
        isHealthy: true,
        lastHealthCheck: new Date(),
        metadata: endpoint.metadata || {},
      })
    );

    // Replace instances
    this.instances.set(serviceId, newInstances);

    this.emit('endpoints_updated', {
      type: 'endpoints_update',
      serviceId,
      timestamp: new Date(),
      data: { endpoints, instances: newInstances },
    } as ServiceEvent);

    console.log(`Updated endpoints for service: ${serviceId}`);
  }

  /**
   * Discover services from DNS
   */
  private discoverFromDNS(): Promise<ServiceDefinition[]> {
    // Implementation for DNS-based service discovery
    // This would typically query SRV records or A records
    return Promise.resolve([]);
  }

  /**
   * Discover services from Consul
   */
  private async discoverFromConsul(): Promise<ServiceDefinition[]> {
    if (!this.discoveryConfig?.endpoint) {
      throw new Error('Consul endpoint not configured');
    }

    try {
      const response = await fetch(
        `${this.discoveryConfig.endpoint}/v1/catalog/services`
      );
      const services = await response.json();

      const discoveredServices: ServiceDefinition[] = [];

      for (const [serviceName, tags] of Object.entries(
        services as Record<string, string[]>
      )) {
        // Skip if tags don't match filter
        if (this.discoveryConfig.tags && this.discoveryConfig.tags.length > 0) {
          const serviceTags = tags as string[];
          const hasMatchingTag = this.discoveryConfig.tags.some((tag: string) =>
            serviceTags.includes(tag)
          );
          if (!hasMatchingTag) continue;
        }

        // Get service instances
        const instancesResponse = await fetch(
          `${this.discoveryConfig.endpoint}/v1/catalog/service/${serviceName}`
        );
        const instances = await instancesResponse.json();

        const endpoints: ServiceEndpoint[] = (instances as any[]).map(
          (instance: any) => ({
            url: `http://${instance.ServiceAddress || instance.Address}:${instance.ServicePort}`,
            weight: 1,
            metadata: instance.ServiceMeta || {},
          })
        );

        discoveredServices.push({
          id: serviceName,
          name: serviceName,
          version: '1.0.0',
          endpoints,
          healthCheck: {
            enabled: true,
            path: '/health',
            interval: 30000,
            timeout: 5000,
            retries: 3,
            expectedStatus: [200],
          },
          metadata: {
            discoveredFrom: 'consul',
            tags: tags as string[],
          },
        });
      }

      return discoveredServices;
    } catch (error) {
      console.error('Consul discovery failed:', error);
      return [];
    }
  }

  /**
   * Discover services from Kubernetes
   */
  private discoverFromKubernetes(): Promise<ServiceDefinition[]> {
    // Implementation for Kubernetes service discovery
    // This would typically use the Kubernetes API to discover services
    return Promise.resolve([]);
  }

  /**
   * Discover services from static configuration
   */
  private discoverFromStatic(): Promise<ServiceDefinition[]> {
    // Implementation for static service discovery
    // This would read from a configuration file or environment variables
    return Promise.resolve([]);
  }

  /**
   * Register a new service with the registry
   */
  registerService(service: ServiceDefinition): void {
    const serviceConfig: ServiceConfig = {
      id: service.id,
      name: service.name,
      version: service.version,
      upstream: service.endpoints.map(ep => ep.url),
      prefix: `/${service.name}`,
      pathRewriteRules: [],
      timeout: 30000,
      retries: 3,
      healthCheck: service.healthCheck,
      loadBalancing: {
        algorithm: 'round-robin',
      },
      failover: {
        enabled: true,
        maxRetries: 3,
        retryDelay: 1000,
        backoffMultiplier: 2,
      },
      versioning: {
        enabled: false,
        strategy: 'header',
        headerName: 'X-API-Version',
      },
      metadata: service.metadata,
    };

    // Create service instances
    const instances: ServiceInstance[] = service.endpoints.map(
      (endpoint, index) => ({
        id: `${service.id}-${index}`,
        url: endpoint.url,
        weight: endpoint.weight || 1,
        currentConnections: 0,
        responseTime: 0,
        errorRate: 0,
        isHealthy: true,
        lastHealthCheck: new Date(),
        metadata: endpoint.metadata || {},
      })
    );

    this.services.set(service.id, serviceConfig);
    this.instances.set(service.id, instances);

    // Start health checks if enabled
    if (service.healthCheck.enabled) {
      this.startHealthChecks(service.id);
    }

    this.emit('service_registered', {
      type: 'register',
      serviceId: service.id,
      timestamp: new Date(),
      data: serviceConfig,
    } as ServiceEvent);

    console.log(`Service registered: ${service.name} (${service.id})`);
  }

  /**
   * Deregister a service from the registry
   */
  deregisterService(serviceId: string): void {
    const service = this.services.get(serviceId);
    if (!service) {
      throw new Error(`Service not found: ${serviceId}`);
    }

    // Stop health checks
    this.stopHealthChecks(serviceId);

    // Remove from registry
    this.services.delete(serviceId);
    this.instances.delete(serviceId);

    this.emit('service_deregistered', {
      type: 'deregister',
      serviceId,
      timestamp: new Date(),
      data: service,
    } as ServiceEvent);

    console.log(`Service deregistered: ${service.name} (${serviceId})`);
  }

  /**
   * Get all registered services
   */
  getServices(): ServiceConfig[] {
    return Array.from(this.services.values());
  }

  /**
   * Get a specific service by ID
   */
  getService(serviceId: string): ServiceConfig | null {
    return this.services.get(serviceId) || null;
  }

  /**
   * Get healthy instances for a service
   */
  getHealthyInstances(serviceId: string): ServiceInstance[] {
    const instances = this.instances.get(serviceId) || [];
    return instances.filter(instance => instance.isHealthy);
  }

  /**
   * Get all instances for a service
   */
  getAllInstances(serviceId: string): ServiceInstance[] {
    return this.instances.get(serviceId) || [];
  }

  /**
   * Update instance health status
   */
  updateInstanceHealth(
    serviceId: string,
    instanceId: string,
    isHealthy: boolean
  ): void {
    const instances = this.instances.get(serviceId);
    if (!instances) return;

    const instance = instances.find(inst => inst.id === instanceId);
    if (!instance) return;

    const wasHealthy = instance.isHealthy;
    instance.isHealthy = isHealthy;
    instance.lastHealthCheck = new Date();

    if (wasHealthy !== isHealthy) {
      this.emit('health_changed', {
        type: 'health_change',
        serviceId,
        timestamp: new Date(),
        data: { instanceId, isHealthy, wasHealthy },
      } as ServiceEvent);

      console.log(
        `Instance health changed: ${instanceId} - ${isHealthy ? 'healthy' : 'unhealthy'}`
      );
    }
  }

  /**
   * Update instance metrics
   */
  updateInstanceMetrics(
    serviceId: string,
    instanceId: string,
    metrics: InstanceMetrics
  ): void {
    const instances = this.instances.get(serviceId);
    if (!instances) return;

    const instance = instances.find(inst => inst.id === instanceId);
    if (!instance) return;

    instance.responseTime = metrics.responseTime;
    instance.errorRate = metrics.errorCount / Math.max(metrics.requestCount, 1);
  }

  /**
   * Update service configuration
   */
  updateServiceConfig(
    serviceId: string,
    updates: Partial<ServiceConfig>
  ): void {
    const service = this.services.get(serviceId);
    if (!service) {
      throw new Error(`Service not found: ${serviceId}`);
    }

    const updatedService = { ...service, ...updates };
    this.services.set(serviceId, updatedService);

    this.emit('config_updated', {
      type: 'config_update',
      serviceId,
      timestamp: new Date(),
      data: { old: service, new: updatedService },
    } as ServiceEvent);

    console.log(`Service config updated: ${serviceId}`);
  }

  /**
   * Register a service version
   */
  registerServiceVersion(
    serviceId: string,
    versionConfig: ServiceVersionConfig
  ): void {
    const versions = this.serviceVersions.get(serviceId) || [];

    // Remove existing version if it exists
    const existingIndex = versions.findIndex(
      v => v.version === versionConfig.version
    );
    if (existingIndex >= 0) {
      versions.splice(existingIndex, 1);
    }

    // If this is set as default, unset other defaults
    if (versionConfig.isDefault) {
      versions.forEach(v => (v.isDefault = false));
    }

    versions.push(versionConfig);
    this.serviceVersions.set(serviceId, versions);

    this.emit('version_registered', {
      type: 'version_register',
      serviceId,
      timestamp: new Date(),
      data: versionConfig,
    } as ServiceEvent);

    console.log(
      `Registered version ${versionConfig.version} for service: ${serviceId}`
    );
  }

  /**
   * Get service version by version string
   */
  getServiceVersion(
    serviceId: string,
    version: string
  ): ServiceVersionConfig | null {
    const versions = this.serviceVersions.get(serviceId) || [];
    return versions.find(v => v.version === version && v.isActive) || null;
  }

  /**
   * Get default service version
   */
  getDefaultServiceVersion(serviceId: string): ServiceVersionConfig | null {
    const versions = this.serviceVersions.get(serviceId) || [];
    return versions.find(v => v.isDefault && v.isActive) || null;
  }

  /**
   * Get all versions for a service
   */
  getServiceVersions(serviceId: string): ServiceVersionConfig[] {
    return this.serviceVersions.get(serviceId) || [];
  }

  /**
   * Deprecate a service version
   */
  deprecateServiceVersion(
    serviceId: string,
    version: string,
    deprecationDate?: Date
  ): void {
    const versions = this.serviceVersions.get(serviceId) || [];
    const versionConfig = versions.find(v => v.version === version);

    if (!versionConfig) {
      throw new Error(`Version ${version} not found for service ${serviceId}`);
    }

    versionConfig.deprecationDate = deprecationDate || new Date();

    this.emit('version_deprecated', {
      type: 'version_deprecate',
      serviceId,
      timestamp: new Date(),
      data: { version, deprecationDate: versionConfig.deprecationDate },
    } as ServiceEvent);

    console.log(`Deprecated version ${version} for service: ${serviceId}`);
  }

  /**
   * Add path rewrite rule to service
   */
  addPathRewriteRule(serviceId: string, rule: PathRewriteRule): void {
    const service = this.services.get(serviceId);
    if (!service) {
      throw new Error(`Service not found: ${serviceId}`);
    }

    if (!service.pathRewriteRules) {
      service.pathRewriteRules = [];
    }

    service.pathRewriteRules.push(rule);

    this.emit('rewrite_rule_added', {
      type: 'rewrite_rule_add',
      serviceId,
      timestamp: new Date(),
      data: rule,
    } as ServiceEvent);

    console.log(`Added path rewrite rule for service: ${serviceId}`);
  }

  /**
   * Remove path rewrite rule from service
   */
  removePathRewriteRule(serviceId: string, pattern: string): void {
    const service = this.services.get(serviceId);
    if (!service || !service.pathRewriteRules) {
      return;
    }

    const ruleIndex = service.pathRewriteRules.findIndex(
      rule => rule.pattern === pattern
    );
    if (ruleIndex >= 0) {
      const removedRule = service.pathRewriteRules.splice(ruleIndex, 1)[0];

      this.emit('rewrite_rule_removed', {
        type: 'rewrite_rule_remove',
        serviceId,
        timestamp: new Date(),
        data: removedRule,
      } as ServiceEvent);

      console.log(`Removed path rewrite rule for service: ${serviceId}`);
    }
  }

  /**
   * Start health checks for a service
   */
  private startHealthChecks(serviceId: string): void {
    const service = this.services.get(serviceId);
    const instances = this.instances.get(serviceId);

    if (!service || !instances || !service.healthCheck.enabled) {
      return;
    }

    const interval = setInterval(async () => {
      await this.performHealthChecks(serviceId);
    }, service.healthCheck.interval);

    this.healthCheckIntervals.set(serviceId, interval);
    console.log(`Health checks started for service: ${serviceId}`);
  }

  /**
   * Stop health checks for a service
   */
  private stopHealthChecks(serviceId: string): void {
    const interval = this.healthCheckIntervals.get(serviceId);
    if (interval) {
      clearInterval(interval);
      this.healthCheckIntervals.delete(serviceId);
      console.log(`Health checks stopped for service: ${serviceId}`);
    }
  }

  /**
   * Perform health checks for all instances of a service
   */
  private async performHealthChecks(serviceId: string): Promise<void> {
    const service = this.services.get(serviceId);
    const instances = this.instances.get(serviceId);

    if (!service || !instances) return;

    const healthCheckPromises = instances.map(instance => {
      try {
        const healthUrl = `${instance.url}${service.healthCheck.path}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          service.healthCheck.timeout
        );

        const startTime = Date.now();
        const response = await fetch(healthUrl, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'User-Agent': 'Gateway-HealthCheck/1.0',
          },
        });

        clearTimeout(timeoutId);
        const responseTime = Date.now() - startTime;

        const isHealthy = service.healthCheck.expectedStatus.includes(
          response.status
        );

        // Update metrics
        instance.responseTime = responseTime;
        this.updateInstanceHealth(serviceId, instance.id, isHealthy);
      } catch (error) {
        console.error(`Health check failed for ${instance.id}:`, error);
        this.updateInstanceHealth(serviceId, instance.id, false);
      }
    });

    await Promise.allSettled(healthCheckPromises);
  }

  /**
   * Setup event handlers for monitoring
   */
  private setupEventHandlers(): void {
    this.on('service_registered', (event: ServiceEvent) => {
      console.log(`[ServiceRegistry] Service registered: ${event.serviceId}`);
    });

    this.on('service_deregistered', (event: ServiceEvent) => {
      console.log(`[ServiceRegistry] Service deregistered: ${event.serviceId}`);
    });

    this.on('health_changed', (event: ServiceEvent) => {
      const { instanceId, isHealthy } = event.data;
      console.log(
        `[ServiceRegistry] Health changed: ${instanceId} -> ${isHealthy ? 'healthy' : 'unhealthy'}`
      );
    });

    this.on('config_updated', (event: ServiceEvent) => {
      console.log(`[ServiceRegistry] Config updated: ${event.serviceId}`);
    });
  }

  /**
   * Get registry statistics
   */
  getStats(): {
    totalServices: number;
    totalInstances: number;
    healthyInstances: number;
    unhealthyInstances: number;
  } {
    let totalInstances = 0;
    let healthyInstances = 0;
    let unhealthyInstances = 0;

    for (const instances of this.instances.values()) {
      totalInstances += instances.length;
      for (const instance of instances) {
        if (instance.isHealthy) {
          healthyInstances++;
        } else {
          unhealthyInstances++;
        }
      }
    }

    return {
      totalServices: this.services.size,
      totalInstances,
      healthyInstances,
      unhealthyInstances,
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    // Stop service discovery
    this.stopServiceDiscovery();

    // Stop all health check intervals
    for (const interval of this.healthCheckIntervals.values()) {
      clearInterval(interval);
    }
    this.healthCheckIntervals.clear();

    // Clear all data
    this.services.clear();
    this.instances.clear();
    this.serviceVersions.clear();

    // Remove all listeners
    this.removeAllListeners();

    console.log('ServiceRegistry destroyed');
  }
}
