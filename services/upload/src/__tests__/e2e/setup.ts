import fs from 'fs/promises';
import path from 'path';
import { Application } from 'express';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import { createApp } from '../../app';
import { PrismaClient } from '../../generated/prisma-client';

// Global test state
let testApp: Application;
let testPrisma: PrismaClient;
let testServer: any;

// Test environment setup
beforeAll(async () => {
  console.log('Setting up E2E test environment...');

  // Initialize test database
  testPrisma = new PrismaClient({
    datasources: {
      db: {
        url:
          process.env.TEST_DATABASE_URL ||
          'postgresql://test:test@localhost:5432/upload_test_e2e',
      },
    },
  });

  // Connect to test database
  await testPrisma.$connect();

  // Run database migrations for test environment
  try {
    await testPrisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  } catch (error) {
    // Extension might already exist
  }

  // Create test app instance
  testApp = await createApp();

  // Create test upload directories
  const testUploadDir = path.join(process.cwd(), 'test-uploads');
  const testTempDir = path.join(testUploadDir, 'temp');
  const testProcessedDir = path.join(testUploadDir, 'processed');
  const testThumbnailsDir = path.join(testUploadDir, 'thumbnails');

  await fs.mkdir(testUploadDir, { recursive: true });
  await fs.mkdir(testTempDir, { recursive: true });
  await fs.mkdir(testProcessedDir, { recursive: true });
  await fs.mkdir(testThumbnailsDir, { recursive: true });

  // Create test fixtures directory if it doesn't exist
  const fixturesDir = path.join(__dirname, 'fixtures');
  await fs.mkdir(fixturesDir, { recursive: true });

  // Create a test image fixture if it doesn't exist
  const testImagePath = path.join(fixturesDir, 'test-image.jpg');
  try {
    await fs.access(testImagePath);
  } catch {
    // Create a minimal test image (1x1 pixel JPEG)
    const minimalJpeg = Buffer.from([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
      0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
      0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
      0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20,
      0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29,
      0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32,
      0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
      0xff, 0xc4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xff, 0xc4,
      0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xda, 0x00, 0x0c,
      0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3f, 0x00, 0x8a, 0x00,
      0xff, 0xd9,
    ]);
    await fs.writeFile(testImagePath, minimalJpeg);
  }

  console.log('E2E test environment setup complete');
});

// Test environment cleanup
afterAll(async () => {
  console.log('Cleaning up E2E test environment...');

  // Close server if running
  if (testServer && typeof testServer.close === 'function') {
    await new Promise<void>(resolve => {
      testServer.close(() => resolve());
    });
  }

  // Disconnect from test database
  if (testPrisma) {
    await testPrisma.$disconnect();
  }

  // Clean up test upload directories
  try {
    const testUploadDir = path.join(process.cwd(), 'test-uploads');
    await fs.rm(testUploadDir, { recursive: true, force: true });
  } catch (error) {
    // Directory might not exist
  }

  console.log('E2E test environment cleanup complete');
});

// Test case setup
beforeEach(async () => {
  // Clean up test data before each test
  if (testPrisma) {
    await testPrisma.processingJob.deleteMany();
    await testPrisma.accessLog.deleteMany();
    await testPrisma.fileMetadata.deleteMany();
  }

  // Clean up test upload files
  try {
    const testUploadDir = path.join(process.cwd(), 'test-uploads');
    const dirs = ['temp', 'processed', 'thumbnails'];

    for (const dir of dirs) {
      const dirPath = path.join(testUploadDir, dir);
      const files = await fs.readdir(dirPath);
      for (const file of files) {
        await fs.unlink(path.join(dirPath, file));
      }
    }
  } catch (error) {
    // Directories might not exist or be empty
  }
});

// Test case cleanup
afterEach(async () => {
  // Additional cleanup if needed
});

// Export test utilities
export { testApp, testPrisma };

// Helper functions for E2E tests
export const waitForProcessing = async (
  fileId: string,
  maxAttempts = 20
): Promise<boolean> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const file = await testPrisma.fileMetadata.findUnique({
      where: { id: fileId },
    });

    if (file && ['READY', 'FAILED'].includes(file.status)) {
      return file.status === 'READY';
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return false;
};

export const createTestFile = (content: string, filename: string): Buffer => {
  return Buffer.from(content, 'utf-8');
};

export const getTestImageBuffer = async (): Promise<Buffer> => {
  const testImagePath = path.join(__dirname, 'fixtures', 'test-image.jpg');
  return fs.readFile(testImagePath);
};

export const cleanupTestFiles = async (fileIds: string[]): Promise<void> => {
  await testPrisma.fileMetadata.deleteMany({
    where: {
      id: { in: fileIds },
    },
  });
};
