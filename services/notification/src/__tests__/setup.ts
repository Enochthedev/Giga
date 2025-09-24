/**
 * Test setup configuration for notification service
 */

import dotenv from 'dotenv';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Global test setup
beforeAll(() => {
  // Set test environment
  process.env.NODE_ENV = 'test';

  // Initialize test database connection
  // TODO: Initialize test database when Prisma is set up

  // Initialize test Redis connection
  // TODO: Initialize test Redis when Redis service is set up

  console.log('Test environment initialized');
});

// Global test cleanup
afterAll(() => {
  // Clean up database connections
  // TODO: Close database connections when Prisma is set up

  // Clean up Redis connections
  // TODO: Close Redis connections when Redis service is set up

  console.log('Test environment cleaned up');
});

// Per-test setup
beforeEach(() => {
  // Clear test data before each test
  // TODO: Clear test data when database is set up
});

// Per-test cleanup
afterEach(() => {
  // Clean up any test artifacts
  // TODO: Clean up test artifacts when needed
});

// Mock external services for testing
export const mockEmailProvider = {
  sendEmail: vi.fn().mockResolvedValue({
    success: true,
    messageId: 'test-message-id',
    status: 'sent'
  })
};

export const mockSMSProvider = {
  sendSMS: vi.fn().mockResolvedValue({
    success: true,
    messageId: 'test-sms-id',
    status: 'sent'
  })
};

export const mockPushProvider = {
  sendPushNotification: vi.fn().mockResolvedValue({
    success: true,
    messageId: 'test-push-id',
    status: 'sent'
  })
};

// Test utilities
export const createTestNotificationRequest = (overrides = {}) => ({
  userId: 'test-user-123',
  channels: ['email'],
  content: {
    subject: 'Test Notification',
    htmlBody: '<p>Test message</p>',
    textBody: 'Test message'
  },
  category: 'transactional',
  priority: 'normal',
  fromService: 'test-service',
  ...overrides
});

export const createTestTemplate = (overrides = {}) => ({
  name: 'test-template',
  category: 'transactional',
  channels: ['email'],
  content: {
    en: {
      email: {
        subject: 'Test Subject {{name}}',
        htmlBody: '<p>Hello {{name}}</p>',
        textBody: 'Hello {{name}}'
      }
    }
  },
  requiredVariables: ['name'],
  defaultLanguage: 'en',
  languages: ['en'],
  ...overrides
});

export const createTestUserPreferences = (overrides = {}) => ({
  userId: 'test-user-123',
  channels: {
    email: { enabled: true },
    sms: { enabled: true },
    push: { enabled: true },
    inApp: { enabled: true }
  },
  categories: {
    transactional: { enabled: true, channels: ['email'], frequency: 'immediate' },
    marketing: { enabled: false, channels: [], frequency: 'never' },
    security: { enabled: true, channels: ['email', 'sms'], frequency: 'immediate' },
    system: { enabled: true, channels: ['email'], frequency: 'immediate' },
    social: { enabled: true, channels: ['push', 'in_app'], frequency: 'immediate' },
    authentication: { enabled: true, channels: ['email'], frequency: 'immediate' }
  },
  globalOptOut: false,
  updatedAt: new Date(),
  ...overrides
});

// Helper to wait for async operations in tests
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to generate test IDs
export const generateTestId = () => `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Mock console methods to reduce test noise
const originalConsole = { ...console };
export const mockConsole = () => {
  console.log = vi.fn();
  console.warn = vi.fn();
  console.error = vi.fn();
  console.info = vi.fn();
};

export const restoreConsole = () => {
  Object.assign(console, originalConsole);
};