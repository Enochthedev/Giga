import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../../app';

describe('E2E: Basic Health Check', () => {
  it('should respond to health check', () => {
    const response = await request(app).get('/health').expect(200);

    expect(response.body).toHaveProperty('status');
  });

  it('should handle 404 for non-existent routes', () => {
    const response = await request(app).get('/non-existent-route').expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('not found');
  });
});
