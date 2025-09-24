import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ServiceRegistry } from '../services/service-registry.js';
import { ServiceDefinition } from '../types/index.js';

describe('ServiceRegistry', () => {
  let registry: ServiceRegistry;

  beforeEach(() => {
    registry = new ServiceRegistry();
  });

  afterEach(() => {
    registry.destroy();
  });

  describe('registerService', () => {
    it('should register a service successfully', () => {
      await Promise.resolve(); // Ensure async function has await
      const service: ServiceDefinition = {
        id: 'test-service',
        name: 'test',
        version: '1.0.0',
        endpoints: [
          { url: 'http://localhost:3001', weight: 1, metadata: {} },
        ],
        healthCheck: {
          enabled: false,
          path: '/health',
          interval: 30000,
          timeout: 5000,
          retries: 3,
          expectedStatus: [200],
        },
        metadata: {},
      };

      await registry.registerService(service);

      const registeredService = registry.getService('test-service');
      expect(registeredService).toBeDefined();
      expect(registeredService?.name).toBe('test');
      expect(registeredService?.version).toBe('1.0.0');
    });

    it('should create service instances from endpoints', () => {
      await Promise.resolve(); // Ensure async function has await
      const service: ServiceDefinition = {
        id: 'multi-instance-service',
        name: 'multi',
        version: '1.0.0',
        endpoints: [
          { url: 'http://localhost:3001', weight: 1, metadata: {} },
          { url: 'http://localhost:3002', weight: 2, metadata: {} },
        ],
        healthCheck: {
          enabled: false,
          path: '/health',
          interval: 30000,
          timeout: 5000,
          retries: 3,
          expectedStatus: [200],
        },
        metadata: {},
      };

      await registry.registerService(service);

      const instances = registry.getAllInstances('multi-instance-service');
      expect(instances).toHaveLength(2);
      expect(instances[0].url).toBe('http://localhost:3001');
      expect(instances[1].url).toBe('http://localhost:3002');
      expect(instances[1].weight).toBe(2);
    });

    it('should emit service_registered event', () => {
      await Promise.resolve(); // Ensure async function has await
      const eventSpy = vi.fn();
      registry.on('service_registered', eventSpy);

      const service: ServiceDefinition = {
        id: 'event-test-service',
        name: 'event-test',
        version: '1.0.0',
        endpoints: [
          { url: 'http://localhost:3001', weight: 1, metadata: {} },
        ],
        healthCheck: {
          enabled: false,
          path: '/health',
          interval: 30000,
          timeout: 5000,
          retries: 3,
          expectedStatus: [200],
        },
        metadata: {},
      };

      await registry.registerService(service);

      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'register',
          serviceId: 'event-test-service',
        })
      );
    });
  });

  describe('deregisterService', () => {
    it('should deregister a service successfully', () => {
      await Promise.resolve(); // Ensure async function has await
      await Promise.resolve(); // Ensure async function has await
      const service: ServiceDefinition = {
        id: 'temp-service',
        name: 'temp',
        version: '1.0.0',
        endpoints: [
          { url: 'http://localhost:3001', weight: 1, metadata: {} },
        ],
        healthCheck: {
          enabled: false,
          path: '/health',
          interval: 30000,
          timeout: 5000,
          retries: 3,
          expectedStatus: [200],
        },
        metadata: {},
      };

      registry.registerService(service);
      expect(registry.getService('temp-service')).toBeDefined();

      registry.deregisterService('temp-service');
      expect(registry.getService('temp-service')).toBeNull();
    });

    it('should throw error for non-existent service', () => {
      expect(() => registry.deregisterService('non-existent')).toThrow(
        'Service not found: non-existent'
      );
    });

    it('should emit service_deregistered event', () => {
      await Promise.resolve(); // Ensure async function has await
      const service: ServiceDefinition = {
        id: 'deregister-test',
        name: 'deregister-test',
        version: '1.0.0',
        endpoints: [
          { url: 'http://localhost:3001', weight: 1, metadata: {} },
        ],
        healthCheck: {
          enabled: false,
          path: '/health',
          interval: 30000,
          timeout: 5000,
          retries: 3,
          expectedStatus: [200],
        },
        metadata: {},
      };

      registry.registerService(service);

      const eventSpy = vi.fn();
      registry.on('service_deregistered', eventSpy);

      registry.deregisterService('deregister-test');

      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'deregister',
          serviceId: 'deregister-test',
        })
      );
    });
  });

  describe('getHealthyInstances', () => {
    it('should return only healthy instances', () => {
      await Promise.resolve(); // Ensure async function has await
      const service: ServiceDefinition = {
        id: 'health-test-service',
        name: 'health-test',
        version: '1.0.0',
        endpoints: [
          { url: 'http://localhost:3001', weight: 1, metadata: {} },
          { url: 'http://localhost:3002', weight: 1, metadata: {} },
        ],
        healthCheck: {
          enabled: false,
          path: '/health',
          interval: 30000,
          timeout: 5000,
          retries: 3,
          expectedStatus: [200],
        },
        metadata: {},
      };

      registry.registerService(service);

      const allInstances = registry.getAllInstances('health-test-service');
      expect(allInstances).toHaveLength(2);

      // Mark one instance as unhealthy
      registry.updateInstanceHealth('health-test-service', allInstances[0].id, false);

      const healthyInstances = registry.getHealthyInstances('health-test-service');
      expect(healthyInstances).toHaveLength(1);
      expect(healthyInstances[0].isHealthy).toBe(true);
    });
  });

  describe('updateInstanceHealth', () => {
    it('should update instance health status', () => {
      await Promise.resolve(); // Ensure async function has await
      const service: ServiceDefinition = {
        id: 'update-health-service',
        name: 'update-health',
        version: '1.0.0',
        endpoints: [
          { url: 'http://localhost:3001', weight: 1, metadata: {} },
        ],
        healthCheck: {
          enabled: false,
          path: '/health',
          interval: 30000,
          timeout: 5000,
          retries: 3,
          expectedStatus: [200],
        },
        metadata: {},
      };

      registry.registerService(service);

      const instances = registry.getAllInstances('update-health-service');
      const instanceId = instances[0].id;

      expect(instances[0].isHealthy).toBe(true);

      registry.updateInstanceHealth('update-health-service', instanceId, false);

      const updatedInstances = registry.getAllInstances('update-health-service');
      expect(updatedInstances[0].isHealthy).toBe(false);
    });

    it('should emit health_changed event when health status changes', () => {
      await Promise.resolve(); // Ensure async function has await
      const service: ServiceDefinition = {
        id: 'health-event-service',
        name: 'health-event',
        version: '1.0.0',
        endpoints: [
          { url: 'http://localhost:3001', weight: 1, metadata: {} },
        ],
        healthCheck: {
          enabled: false,
          path: '/health',
          interval: 30000,
          timeout: 5000,
          retries: 3,
          expectedStatus: [200],
        },
        metadata: {},
      };

      registry.registerService(service);

      const eventSpy = vi.fn();
      registry.on('health_changed', eventSpy);

      const instances = registry.getAllInstances('health-event-service');
      const instanceId = instances[0].id;

      registry.updateInstanceHealth('health-event-service', instanceId, false);

      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'health_change',
          serviceId: 'health-event-service',
          data: expect.objectContaining({
            instanceId,
            isHealthy: false,
            wasHealthy: true,
          }),
        })
      );
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      await Promise.resolve(); // Ensure async function has await
      const service1: ServiceDefinition = {
        id: 'stats-service-1',
        name: 'stats1',
        version: '1.0.0',
        endpoints: [
          { url: 'http://localhost:3001', weight: 1, metadata: {} },
          { url: 'http://localhost:3002', weight: 1, metadata: {} },
        ],
        healthCheck: {
          enabled: false,
          path: '/health',
          interval: 30000,
          timeout: 5000,
          retries: 3,
          expectedStatus: [200],
        },
        metadata: {},
      };

      const service2: ServiceDefinition = {
        id: 'stats-service-2',
        name: 'stats2',
        version: '1.0.0',
        endpoints: [
          { url: 'http://localhost:3003', weight: 1, metadata: {} },
        ],
        healthCheck: {
          enabled: false,
          path: '/health',
          interval: 30000,
          timeout: 5000,
          retries: 3,
          expectedStatus: [200],
        },
        metadata: {},
      };

      registry.registerService(service1);
      registry.registerService(service2);

      // Mark one instance as unhealthy
      const instances = registry.getAllInstances('stats-service-1');
      registry.updateInstanceHealth('stats-service-1', instances[0].id, false);

      const _stats = registry.getStats();

      expect(stats.totalServices).toBe(2);
      expect(stats.totalInstances).toBe(3);
      expect(stats.healthyInstances).toBe(2);
      expect(stats.unhealthyInstances).toBe(1);
    });
  });
});