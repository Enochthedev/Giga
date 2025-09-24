import { FastifyRequest } from 'fastify';
import { beforeEach, describe, expect, it } from 'vitest';
import { LoadBalancer } from '../services/load-balancer.js';
import { LoadBalancingStrategy, ServiceInstance } from '../types/index.js';

describe('LoadBalancer', () => {
  let loadBalancer: LoadBalancer;
  let mockInstances: ServiceInstance[];

  beforeEach(() => {
    loadBalancer = new LoadBalancer();

    mockInstances = [
      {
        id: 'instance-1',
        url: 'http://localhost:3001',
        weight: 1,
        currentConnections: 0,
        responseTime: 100,
        errorRate: 0.1,
        isHealthy: true,
        lastHealthCheck: new Date(),
        metadata: {},
      },
      {
        id: 'instance-2',
        url: 'http://localhost:3002',
        weight: 2,
        currentConnections: 5,
        responseTime: 150,
        errorRate: 0.05,
        isHealthy: true,
        lastHealthCheck: new Date(),
        metadata: {},
      },
      {
        id: 'instance-3',
        url: 'http://localhost:3003',
        weight: 1,
        currentConnections: 2,
        responseTime: 80,
        errorRate: 0.02,
        isHealthy: true,
        lastHealthCheck: new Date(),
        metadata: {},
      },
    ];
  });

  describe('selectInstance', () => {
    it('should return null when no healthy instances available', () => {
      const unhealthyInstances = mockInstances.map(instance => ({
        ...instance,
        isHealthy: false,
      }));

      const strategy: LoadBalancingStrategy = { algorithm: 'round-robin' };
      const mockRequest = {} as FastifyRequest;

      const selected = loadBalancer.selectInstance(
        'test-service',
        unhealthyInstances,
        strategy,
        mockRequest
      );

      expect(selected).toBeNull();
    });

    it('should return single healthy instance when only one available', () => {
      const singleInstance = [mockInstances[0]];
      const strategy: LoadBalancingStrategy = { algorithm: 'round-robin' };
      const mockRequest = {} as FastifyRequest;

      const selected = loadBalancer.selectInstance(
        'test-service',
        singleInstance,
        strategy,
        mockRequest
      );

      expect(selected).toBe(singleInstance[0]);
    });
  });

  describe('round-robin algorithm', () => {
    it('should distribute requests evenly across instances', () => {
      const strategy: LoadBalancingStrategy = { algorithm: 'round-robin' };
      const mockRequest = {} as FastifyRequest;
      const selections: string[] = [];

      // Make multiple selections
      for (let i = 0; i < 6; i++) {
        const selected = loadBalancer.selectInstance(
          'test-service',
          mockInstances,
          strategy,
          mockRequest
        );
        if (selected) {
          selections.push(selected.id);
        }
      }

      // Should cycle through instances
      expect(selections).toEqual([
        'instance-1',
        'instance-2',
        'instance-3',
        'instance-1',
        'instance-2',
        'instance-3',
      ]);
    });
  });

  describe('weighted round-robin algorithm', () => {
    it('should respect instance weights', () => {
      const strategy: LoadBalancingStrategy = { algorithm: 'weighted' };
      const mockRequest = {} as FastifyRequest;
      const selections: string[] = [];

      // Make selections equal to total weight (1 + 2 + 1 = 4)
      for (let i = 0; i < 8; i++) {
        const selected = loadBalancer.selectInstance(
          'test-service',
          mockInstances,
          strategy,
          mockRequest
        );
        if (selected) {
          selections.push(selected.id);
        }
      }

      // Count selections per instance
      const counts = selections.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Instance-2 should be selected twice as often due to weight=2
      expect(counts['instance-2']).toBeGreaterThan(counts['instance-1']);
      expect(counts['instance-2']).toBeGreaterThan(counts['instance-3']);
    });
  });

  describe('least-connections algorithm', () => {
    it('should select instance with fewest connections', () => {
      const strategy: LoadBalancingStrategy = { algorithm: 'least-connections' };
      const mockRequest = {} as FastifyRequest;

      const selected = loadBalancer.selectInstance(
        'test-service',
        mockInstances,
        strategy,
        mockRequest
      );

      // Should select instance-1 (0 connections)
      expect(selected?.id).toBe('instance-1');
    });

    it('should prefer better response time when connections are equal', () => {
      // Make all instances have same connection count
      const equalConnectionInstances = mockInstances.map(instance => ({
        ...instance,
        currentConnections: 3,
      }));

      const strategy: LoadBalancingStrategy = { algorithm: 'least-connections' };
      const mockRequest = {} as FastifyRequest;

      const selected = loadBalancer.selectInstance(
        'test-service',
        equalConnectionInstances,
        strategy,
        mockRequest
      );

      // Should select instance-3 (best response time: 80ms)
      expect(selected?.id).toBe('instance-3');
    });
  });

  describe('response-time algorithm', () => {
    it('should select instance with best response time and low error rate', () => {
      const strategy: LoadBalancingStrategy = { algorithm: 'response-time' };
      const mockRequest = {} as FastifyRequest;

      const selected = loadBalancer.selectInstance(
        'test-service',
        mockInstances,
        strategy,
        mockRequest
      );

      // Should select instance-3 (best response time: 80ms, low error rate: 0.02)
      expect(selected?.id).toBe('instance-3');
    });

    it('should prefer lower error rate over response time', () => {
      const modifiedInstances = [...mockInstances];
      // Make instance-1 have better response time but higher error rate
      modifiedInstances[0] = {
        ...modifiedInstances[0],
        responseTime: 50, // Better than instance-3
        errorRate: 0.5,   // Much worse error rate
      };

      const strategy: LoadBalancingStrategy = { algorithm: 'response-time' };
      const mockRequest = {} as FastifyRequest;

      const selected = loadBalancer.selectInstance(
        'test-service',
        modifiedInstances,
        strategy,
        mockRequest
      );

      // Should still select instance-3 due to lower error rate
      expect(selected?.id).toBe('instance-3');
    });
  });

  describe('sticky sessions', () => {
    it('should maintain sticky sessions based on session key', () => {
      const strategy: LoadBalancingStrategy = {
        algorithm: 'round-robin',
        stickySession: true,
        sessionKey: 'x-session-id',
      };

      const mockRequest = {
        headers: { 'x-session-id': 'session-123' },
      } as unknown as FastifyRequest;

      // First request should select an instance
      const firstSelection = loadBalancer.selectInstanceWithStickySession(
        'test-service',
        mockInstances,
        strategy,
        mockRequest
      );

      expect(firstSelection).toBeDefined();

      // Subsequent requests with same session should get same instance
      const secondSelection = loadBalancer.selectInstanceWithStickySession(
        'test-service',
        mockInstances,
        strategy,
        mockRequest
      );

      expect(secondSelection?.id).toBe(firstSelection?.id);
    });

    it('should extract session ID from cookies', () => {
      const strategy: LoadBalancingStrategy = {
        algorithm: 'round-robin',
        stickySession: true,
        sessionKey: 'sessionId',
      };

      const mockRequest = {
        headers: {
          cookie: 'sessionId=cookie-session-456; other=value',
        },
      } as FastifyRequest;

      const firstSelection = loadBalancer.selectInstanceWithStickySession(
        'test-service',
        mockInstances,
        strategy,
        mockRequest
      );

      const secondSelection = loadBalancer.selectInstanceWithStickySession(
        'test-service',
        mockInstances,
        strategy,
        mockRequest
      );

      expect(secondSelection?.id).toBe(firstSelection?.id);
    });

    it('should fall back to regular load balancing when sticky instance is unhealthy', () => {
      const strategy: LoadBalancingStrategy = {
        algorithm: 'round-robin',
        stickySession: true,
        sessionKey: 'x-session-id',
      };

      const mockRequest = {
        headers: { 'x-session-id': 'session-789' },
      } as unknown as FastifyRequest;

      // First selection
      const firstSelection = loadBalancer.selectInstanceWithStickySession(
        'test-service',
        mockInstances,
        strategy,
        mockRequest
      );

      expect(firstSelection).toBeDefined();

      // Make the sticky instance unhealthy
      const unhealthyInstances = mockInstances.map(instance => ({
        ...instance,
        isHealthy: instance.id === firstSelection?.id ? false : true,
      }));

      // Should select a different healthy instance
      const secondSelection = loadBalancer.selectInstanceWithStickySession(
        'test-service',
        unhealthyInstances,
        strategy,
        mockRequest
      );

      expect(secondSelection).toBeDefined();
      expect(secondSelection?.id).not.toBe(firstSelection?.id);
      expect(secondSelection?.isHealthy).toBe(true);
    });
  });

  describe('connection management', () => {
    it('should increment and decrement connection counts', () => {
      const instance = mockInstances[0];
      const initialConnections = instance.currentConnections;

      loadBalancer.incrementConnections(instance.id, mockInstances);
      expect(instance.currentConnections).toBe(initialConnections + 1);

      loadBalancer.decrementConnections(instance.id, mockInstances);
      expect(instance.currentConnections).toBe(initialConnections);
    });

    it('should not decrement connections below zero', () => {
      const instance = { ...mockInstances[0], currentConnections: 0 };
      const instances = [instance];

      loadBalancer.decrementConnections(instance.id, instances);
      expect(instance.currentConnections).toBe(0);
    });
  });

  describe('getStats', () => {
    it('should return load balancing statistics', () => {
      // Perform some operations to generate stats
      const strategy: LoadBalancingStrategy = { algorithm: 'round-robin' };
      const mockRequest = {} as FastifyRequest;

      loadBalancer.selectInstance('service-1', mockInstances, strategy, mockRequest);
      loadBalancer.selectInstance('service-2', mockInstances, strategy, mockRequest);

      const _stats = loadBalancer.getStats();

      expect(stats.roundRobinCounters).toHaveProperty('service-1');
      expect(stats.roundRobinCounters).toHaveProperty('service-2');
      expect(typeof stats.stickySessionCount).toBe('number');
      expect(typeof stats.stickySessionsByService).toBe('object');
    });
  });

  describe('reset', () => {
    it('should clear all load balancing state', () => {
      // Generate some state
      const strategy: LoadBalancingStrategy = { algorithm: 'round-robin' };
      const mockRequest = {} as FastifyRequest;

      loadBalancer.selectInstance('service-1', mockInstances, strategy, mockRequest);

      let stats = loadBalancer.getStats();
      expect(Object.keys(stats.roundRobinCounters)).toHaveLength(1);

      // Reset and verify state is cleared
      loadBalancer.reset();

      stats = loadBalancer.getStats();
      expect(Object.keys(stats.roundRobinCounters)).toHaveLength(0);
      expect(stats.stickySessionCount).toBe(0);
    });
  });
});