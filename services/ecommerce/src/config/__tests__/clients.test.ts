/**
 * Tests for Supabase SDK Client Configuration
 *
 * These tests verify that SDK clients are properly initialized
 * and environment variables are validated correctly.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the SDK modules to avoid actual Supabase connections in tests
vi.mock('@giga/auth-sdk', () => ({
  AuthClient: vi.fn().mockImplementation(() => ({
    setTokens: vi.fn(),
    getCurrentUser: vi.fn(),
  })),
}));

vi.mock('@giga/file-storage-sdk', () => ({
  FileStorageClient: vi.fn().mockImplementation(() => ({
    uploadAndProcess: vi.fn(),
  })),
}));

vi.mock('@giga/notifications-sdk', () => ({
  NotificationClient: vi.fn().mockImplementation(() => ({
    sendOrderConfirmation: vi.fn(),
  })),
}));

import {
  getAuthClient,
  getFileStorageClient,
  getNotificationClient,
  getSupabaseClients,
  initializeSupabaseClients,
  validateSupabaseEnv,
} from '../clients';

describe('Supabase SDK Client Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment before each test
    process.env = { ...originalEnv };
    // Clear any cached clients
    vi.resetModules();
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('validateSupabaseEnv', () => {
    it('should validate when all required env vars are present', () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_ANON_KEY = 'test-anon-key';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

      const config = validateSupabaseEnv();

      expect(config).toEqual({
        url: 'https://test.supabase.co',
        anonKey: 'test-anon-key',
        serviceRoleKey: 'test-service-role-key',
      });
    });

    it('should throw error when SUPABASE_URL is missing', () => {
      delete process.env.SUPABASE_URL;
      process.env.SUPABASE_ANON_KEY = 'test-anon-key';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

      expect(() => validateSupabaseEnv()).toThrow(
        'Missing required Supabase environment variables: SUPABASE_URL'
      );
    });

    it('should throw error when SUPABASE_ANON_KEY is missing', () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      delete process.env.SUPABASE_ANON_KEY;
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

      expect(() => validateSupabaseEnv()).toThrow(
        'Missing required Supabase environment variables: SUPABASE_ANON_KEY'
      );
    });

    it('should throw error when SUPABASE_SERVICE_ROLE_KEY is missing', () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_ANON_KEY = 'test-anon-key';
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      expect(() => validateSupabaseEnv()).toThrow(
        'Missing required Supabase environment variables: SUPABASE_SERVICE_ROLE_KEY'
      );
    });

    it('should throw error when multiple env vars are missing', () => {
      delete process.env.SUPABASE_URL;
      delete process.env.SUPABASE_ANON_KEY;
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

      expect(() => validateSupabaseEnv()).toThrow(
        'Missing required Supabase environment variables: SUPABASE_URL, SUPABASE_ANON_KEY'
      );
    });
  });

  describe('initializeSupabaseClients', () => {
    beforeEach(() => {
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_ANON_KEY = 'test-anon-key';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
    });

    it('should initialize all three SDK clients', () => {
      const clients = initializeSupabaseClients();

      expect(clients).toHaveProperty('authClient');
      expect(clients).toHaveProperty('fileStorageClient');
      expect(clients).toHaveProperty('notificationClient');
    });

    it('should create AuthClient with correct config', () => {
      const clients = initializeSupabaseClients();

      expect(clients.authClient).toBeDefined();
      // AuthClient should be initialized with anon key
    });

    it('should create FileStorageClient with correct config', () => {
      const clients = initializeSupabaseClients();

      expect(clients.fileStorageClient).toBeDefined();
      // FileStorageClient should be initialized with anon key
    });

    it('should create NotificationClient with correct config', () => {
      const clients = initializeSupabaseClients();

      expect(clients.notificationClient).toBeDefined();
      // NotificationClient should be initialized with service role key
    });
  });

  describe('Client getters', () => {
    beforeEach(() => {
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_ANON_KEY = 'test-anon-key';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
    });

    it('should return singleton instances', () => {
      const clients1 = getSupabaseClients();
      const clients2 = getSupabaseClients();

      expect(clients1).toBe(clients2);
    });

    it('should return AuthClient instance', () => {
      const authClient = getAuthClient();

      expect(authClient).toBeDefined();
    });

    it('should return FileStorageClient instance', () => {
      const fileStorageClient = getFileStorageClient();

      expect(fileStorageClient).toBeDefined();
    });

    it('should return NotificationClient instance', () => {
      const notificationClient = getNotificationClient();

      expect(notificationClient).toBeDefined();
    });
  });
});
