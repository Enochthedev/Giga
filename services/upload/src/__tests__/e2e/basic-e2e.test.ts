import { Application } from 'express';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../app';

describe('Basic E2E Tests', () => {
  let app: Application;

  beforeAll(async () => {
    app = createApp();
  });

  afterAll(async () => {
    // Cleanup if needed
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Metrics Endpoint', () => {
    it('should return metrics', async () => {
      const response = await request(app).get('/metrics').expect(200);

      expect(response.headers['content-type']).toMatch(/text\/plain/);
    });
  });

  describe('API Routes', () => {
    it('should handle 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/v1/unknown-route')
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'NOT_FOUND',
        },
      });
    });
  });

  describe('Upload Endpoint Basic Test', () => {
    it('should handle upload requests (may fail due to missing auth)', async () => {
      const response = await request(app)
        .post('/api/v1/uploads/profile-photo')
        .attach('file', Buffer.from('test content'), 'test.txt');

      // We expect this to fail with auth error, but the endpoint should exist
      expect([400, 401, 403, 500]).toContain(response.status);
    });
  });
});
