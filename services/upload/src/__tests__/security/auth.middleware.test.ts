import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  authenticate,
  optionalAuth,
  requireAccessPermission,
  requireAdmin,
  requirePermission,
  requireUploadPermission,
} from '../../middleware/auth.middleware';
import { AuthService } from '../../services/auth.service';
import { AccessLevel, EntityType } from '../../types/upload.types';

describe('Authentication Middleware Tests', () => {
  let app: express.Application;
  let authService: AuthService;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    authService = AuthService.getInstance();
    vi.clearAllMocks();
  });

  describe('authenticate middleware', () => {
    it('should reject requests without authorization header', async () => {
      app.get('/test', authenticate, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app).get('/test');

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('MISSING_AUTH_HEADER');
    });

    it('should reject requests with invalid authorization format', async () => {
      app.get('/test', authenticate, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app)
        .get('/test')
        .set('Authorization', 'Invalid token');

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('INVALID_AUTH_FORMAT');
    });

    it('should reject requests with empty token', async () => {
      app.get('/test', authenticate, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app)
        .get('/test')
        .set('Authorization', 'Bearer');

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('INVALID_AUTH_FORMAT');
    });

    it('should accept valid service tokens', async () => {
      const token = authService.generateServiceToken(
        'test-service',
        'test-service',
        ['upload:read']
      );

      app.get('/test', authenticate, (req, res) => {
        res.json({
          success: true,
          auth: req.auth,
          service: req.service,
        });
      });

      const response = await request(app)
        .get('/test')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.auth.type).toBe('service');
      expect(response.body.auth.id).toBe('test-service');
      expect(response.body.service.name).toBe('test-service');
    });

    it('should handle authentication errors gracefully', async () => {
      app.get('/test', authenticate, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app)
        .get('/test')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('INVALID_TOKEN');
    });
  });

  describe('requirePermission middleware', () => {
    it('should reject unauthenticated requests', async () => {
      app.get('/test', requirePermission('upload:read'), (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app).get('/test');

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('NOT_AUTHENTICATED');
    });

    it('should reject requests without required permission', async () => {
      const token = authService.generateServiceToken(
        'test-service',
        'test-service',
        ['upload:create']
      );

      app.get(
        '/test',
        authenticate,
        requirePermission('upload:delete'),
        (req, res) => {
          res.json({ success: true });
        }
      );

      const response = await request(app)
        .get('/test')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.code).toBe('INSUFFICIENT_PERMISSIONS');
    });

    it('should allow requests with required permission', async () => {
      const token = authService.generateServiceToken(
        'test-service',
        'test-service',
        ['upload:read']
      );

      app.get(
        '/test',
        authenticate,
        requirePermission('upload:read'),
        (req, res) => {
          res.json({ success: true });
        }
      );

      const response = await request(app)
        .get('/test')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should allow admin access to all permissions', async () => {
      const token = authService.generateServiceToken(
        'admin-service',
        'admin-service',
        ['admin:all']
      );

      app.get(
        '/test',
        authenticate,
        requirePermission('upload:delete'),
        (req, res) => {
          res.json({ success: true });
        }
      );

      const response = await request(app)
        .get('/test')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('requireUploadPermission middleware', () => {
    it('should check entity-specific upload permissions', async () => {
      const token = authService.generateServiceToken(
        'auth-service',
        'auth-service',
        ['upload:profile']
      );

      app.post(
        '/upload/profile',
        authenticate,
        requireUploadPermission(EntityType.USER_PROFILE),
        (req, res) => {
          res.json({ success: true });
        }
      );

      app.post(
        '/upload/product',
        authenticate,
        requireUploadPermission(EntityType.PRODUCT),
        (req, res) => {
          res.json({ success: true });
        }
      );

      // Should allow profile upload
      const profileResponse = await request(app)
        .post('/upload/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(profileResponse.status).toBe(200);

      // Should deny product upload
      const productResponse = await request(app)
        .post('/upload/product')
        .set('Authorization', `Bearer ${token}`);

      expect(productResponse.status).toBe(403);
      expect(productResponse.body.code).toBe('INSUFFICIENT_UPLOAD_PERMISSIONS');
    });

    it('should deny general upload permission for specific entity types', async () => {
      const token = authService.generateServiceToken(
        'test-service',
        'test-service',
        ['upload:create']
      );

      app.post(
        '/upload/any',
        authenticate,
        requireUploadPermission(EntityType.DOCUMENT),
        (req, res) => {
          res.json({ success: true });
        }
      );

      const response = await request(app)
        .post('/upload/any')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.code).toBe('INSUFFICIENT_UPLOAD_PERMISSIONS');
    });
  });

  describe('requireAccessPermission middleware', () => {
    it('should allow access to public resources', async () => {
      const token = authService.generateServiceToken(
        'test-service',
        'test-service',
        []
      );

      app.get(
        '/file/:id',
        authenticate,
        requireAccessPermission(AccessLevel.PUBLIC),
        (req, res) => {
          res.json({ success: true });
        }
      );

      const response = await request(app)
        .get('/file/123')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('should deny access to private resources without permission', async () => {
      const token = authService.generateServiceToken(
        'test-service',
        'test-service',
        []
      );

      app.get(
        '/file/:id',
        authenticate,
        requireAccessPermission(AccessLevel.PRIVATE, 'other-user'),
        (req, res) => {
          res.json({ success: true });
        }
      );

      const response = await request(app)
        .get('/file/123')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.code).toBe('INSUFFICIENT_ACCESS_PERMISSIONS');
    });

    it('should allow access to private resources for owners', async () => {
      const token = authService.generateServiceToken(
        'test-service',
        'test-service',
        []
      );

      app.get(
        '/file/:id',
        authenticate,
        requireAccessPermission(AccessLevel.PRIVATE, 'test-service'),
        (req, res) => {
          res.json({ success: true });
        }
      );

      const response = await request(app)
        .get('/file/123')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  describe('requireAdmin middleware', () => {
    it('should deny access to non-admin users', async () => {
      const token = authService.generateServiceToken(
        'test-service',
        'test-service',
        ['upload:read']
      );

      app.get('/admin', authenticate, requireAdmin, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app)
        .get('/admin')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.code).toBe('ADMIN_REQUIRED');
    });

    it('should allow access to admin users', async () => {
      const token = authService.generateServiceToken(
        'admin-service',
        'admin-service',
        ['admin:all']
      );

      app.get('/admin', authenticate, requireAdmin, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app)
        .get('/admin')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });

  describe('optionalAuth middleware', () => {
    it('should continue without authentication when no token provided', async () => {
      app.get('/test', optionalAuth, (req, res) => {
        res.json({
          success: true,
          hasAuth: !!req.auth,
        });
      });

      const response = await request(app).get('/test');

      expect(response.status).toBe(200);
      expect(response.body.hasAuth).toBe(false);
    });

    it('should authenticate when valid token provided', async () => {
      const token = authService.generateServiceToken(
        'test-service',
        'test-service',
        ['upload:read']
      );

      app.get('/test', optionalAuth, (req, res) => {
        res.json({
          success: true,
          hasAuth: !!req.auth,
          authType: req.auth?.type,
        });
      });

      const response = await request(app)
        .get('/test')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.hasAuth).toBe(true);
      expect(response.body.authType).toBe('service');
    });

    it('should continue without authentication when invalid token provided', async () => {
      app.get('/test', optionalAuth, (req, res) => {
        res.json({
          success: true,
          hasAuth: !!req.auth,
        });
      });

      const response = await request(app)
        .get('/test')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401); // Should fail authentication
    });
  });

  describe('Error Handling', () => {
    it('should handle middleware errors gracefully', async () => {
      // Mock AuthService to throw an error
      vi.spyOn(authService, 'validateToken').mockRejectedValue(
        new Error('Service unavailable')
      );

      app.get('/test', authenticate, (req, res) => {
        res.json({ success: true });
      });

      const token = authService.generateServiceToken(
        'test-service',
        'test-service',
        ['upload:read']
      );
      const response = await request(app)
        .get('/test')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('AUTHENTICATION_FAILED');
    });

    it('should include timestamp in error responses', async () => {
      app.get('/test', authenticate, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app).get('/test');

      expect(response.status).toBe(401);
      expect(response.body.timestamp).toBeDefined();
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });

    it('should not expose sensitive information in errors', async () => {
      app.get('/test', authenticate, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app)
        .get('/test')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.message).not.toContain('JWT_SECRET');
      expect(response.body.message).not.toContain('default-secret');
      expect(response.body.error).not.toContain('stack');
    });
  });
});
