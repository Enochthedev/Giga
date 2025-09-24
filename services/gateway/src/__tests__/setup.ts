import { afterAll, beforeAll } from 'vitest';

// Global test setup
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.LOG_LEVEL = 'silent';

  // Mock console methods to reduce noise in tests
  global.console = {
    ...console,
    log: () => { },
    info: () => { },
    warn: () => { },
    error: () => { },
  };
});

afterAll(() => {
  // Cleanup after all tests
});

// Mock fetch for testing
global.fetch = async (url: string | URL | Request, init?: RequestInit): Promise<Response> => {
  await Promise.resolve(); // Ensure async function has await
  const urlString = typeof url === 'string' ? url : url.toString();

  // Mock health check responses
  if (urlString.includes('/health')) {
    return new Response(JSON.stringify({ status: 'healthy' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }

  // Mock service responses
  return new Response(JSON.stringify({ success: true, data: 'mock response' }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};