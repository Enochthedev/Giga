import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GracefulDegradationService } from '../services/graceful-degradation.service';

describe('GracefulDegradationService', () => {
  let service: GracefulDegradationService;

  beforeEach(() => {
    service = GracefulDegradationService.getInstance();
  });

  afterEach(() => {
    service.stopHealthMonitoring();
  });

  it('should register features correctly', () => {
    service.registerFeature({
      name: 'test-feature',
      enabled: true,
      critical: false,
      fallbackBehavior: 'mock',
    });

    const status = service.getFeatureStatus('test-feature');
    expect(status).toMatchObject({
      name: 'test-feature',
      enabled: true,
      critical: false,
      healthy: true,
      degraded: false,
      fallbackActive: false,
    });
  });

  it('should execute feature successfully', async () => {
    service.registerFeature({
      name: 'test-feature',
      enabled: true,
      critical: false,
      fallbackBehavior: 'mock',
    });

    const operation = vi.fn().mockResolvedValue('success');
    const result = await service.executeFeature('test-feature', operation);

    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('should use fallback for non-critical feature failures', async () => {
    service.registerFeature({
      name: 'test-feature',
      enabled: true,
      critical: false,
      fallbackBehavior: 'mock',
    });

    const operation = vi.fn().mockRejectedValue(new Error('Test failure'));
    const result = await service.executeFeature(
      'test-feature',
      operation,
      'fallback-value'
    );

    expect(result).toBe('fallback-value');

    const status = service.getFeatureStatus('test-feature');
    expect(status).toMatchObject({
      healthy: false,
      degraded: true,
      fallbackActive: true,
    });
  });

  it('should throw error for critical feature failures', async () => {
    service.registerFeature({
      name: 'critical-feature',
      enabled: true,
      critical: true,
      fallbackBehavior: 'mock',
    });

    const operation = vi.fn().mockRejectedValue(new Error('Critical failure'));

    await expect(
      service.executeFeature('critical-feature', operation)
    ).rejects.toThrow('Critical failure');
  });

  it('should provide system health summary', () => {
    service.registerFeature({
      name: 'healthy-feature',
      enabled: true,
      critical: false,
      fallbackBehavior: 'mock',
    });

    service.registerFeature({
      name: 'degraded-feature',
      enabled: true,
      critical: false,
      fallbackBehavior: 'mock',
    });

    // Simulate degraded feature
    const status = service.getFeatureStatus('degraded-feature');
    if (typeof status === 'object' && 'degraded' in status) {
      (status as any).degraded = true;
      (status as any).healthy = false;
    }

    const health = service.getSystemHealth();
    expect(health.totalFeatures).toBe(2);
    expect(health.overallHealth).toBe('degraded');
  });
});
