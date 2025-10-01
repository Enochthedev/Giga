import * as fs from 'fs/promises';
import * as path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { StorageConfig } from '../../interfaces/storage.interface';
import { StorageManagerService } from '../../services/storage-manager.service';
import { FileData } from '../../types/upload.types';

describe('StorageManagerService', () => {
  let storageManager: StorageManagerService;
  let testConfig: StorageConfig;
  let testDir: string;

  beforeEach(async () => {
    // Create a temporary test directory
    testDir = path.join(process.cwd(), 'test-uploads');
    testConfig = {
      type: 'local',
      basePath: testDir,
      options: {
        baseUrl: 'http://localhost:3005',
      },
    };

    storageManager = new StorageManagerService(testConfig);

    // Ensure test directory exists
    try {
      await fs.mkdir(testDir, { recursive: true });
    } catch {
      // Directory might already exist
    }
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }
  });

  describe('constructor', () => {
    it('should create storage manager with local provider', () => {
      expect(storageManager).toBeDefined();
    });

    it('should throw error for unsupported storage type', () => {
      const invalidConfig: StorageConfig = {
        type: 's3' as any,
        basePath: '/tmp',
      };

      expect(() => new StorageManagerService(invalidConfig)).toThrow(
        'S3 storage provider not implemented yet'
      );
    });
  });

  describe('store', () => {
    it('should store a file successfully', async () => {
      const fileData: FileData = {
        buffer: Buffer.from('test file content'),
        originalName: 'test.txt',
        mimeType: 'text/plain',
        size: 17,
      };

      const result = await storageManager.store(fileData, 'test/test.txt');

      expect(result.success).toBe(true);
      expect(result.path).toBe('test/test.txt');
      expect(result.url).toBe('http://localhost:3005/files/test/test.txt');
      expect(result.size).toBe(17);

      // Verify file was actually created
      const filePath = path.join(testDir, 'test/test.txt');
      const fileExists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);
    });

    it('should handle storage errors gracefully', async () => {
      const fileData: FileData = {
        buffer: Buffer.from('test content'),
        originalName: 'test.txt',
        mimeType: 'text/plain',
        size: 12,
      };

      // Create a new storage manager with invalid path to trigger error
      const invalidConfig: StorageConfig = {
        type: 'local',
        basePath: '/invalid/readonly/path/that/should/not/exist',
        options: {},
      };

      const invalidStorageManager = new StorageManagerService(invalidConfig);
      const result = await invalidStorageManager.store(
        fileData,
        'test/error.txt'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('retrieve', () => {
    it('should retrieve a stored file', async () => {
      const originalContent = 'test file content for retrieval';
      const fileData: FileData = {
        buffer: Buffer.from(originalContent),
        originalName: 'retrieve-test.txt',
        mimeType: 'text/plain',
        size: originalContent.length,
      };

      // Store the file first
      await storageManager.store(fileData, 'test/retrieve-test.txt');

      // Retrieve the file
      const retrievedFile = await storageManager.retrieve(
        'test/retrieve-test.txt'
      );

      expect(retrievedFile.buffer.toString()).toBe(originalContent);
      expect(retrievedFile.originalName).toBe('retrieve-test.txt');
      expect(retrievedFile.mimeType).toBe('text/plain');
      expect(retrievedFile.size).toBe(originalContent.length);
    });

    it('should throw error for non-existent file', async () => {
      await expect(
        storageManager.retrieve('non-existent/file.txt')
      ).rejects.toThrow('File not found: non-existent/file.txt');
    });
  });

  describe('delete', () => {
    it('should delete a stored file', async () => {
      const fileData: FileData = {
        buffer: Buffer.from('file to delete'),
        originalName: 'delete-test.txt',
        mimeType: 'text/plain',
        size: 14,
      };

      // Store the file first
      await storageManager.store(fileData, 'test/delete-test.txt');

      // Verify file exists
      const existsBefore = await storageManager.exists('test/delete-test.txt');
      expect(existsBefore).toBe(true);

      // Delete the file
      const deleteResult = await storageManager.delete('test/delete-test.txt');
      expect(deleteResult).toBe(true);

      // Verify file no longer exists
      const existsAfter = await storageManager.exists('test/delete-test.txt');
      expect(existsAfter).toBe(false);
    });

    it('should return false for non-existent file deletion', async () => {
      const result = await storageManager.delete('non-existent/file.txt');
      expect(result).toBe(false);
    });
  });

  describe('exists', () => {
    it('should return true for existing file', async () => {
      const fileData: FileData = {
        buffer: Buffer.from('exists test'),
        originalName: 'exists-test.txt',
        mimeType: 'text/plain',
        size: 11,
      };

      await storageManager.store(fileData, 'test/exists-test.txt');
      const exists = await storageManager.exists('test/exists-test.txt');
      expect(exists).toBe(true);
    });

    it('should return false for non-existent file', async () => {
      const exists = await storageManager.exists('non-existent/file.txt');
      expect(exists).toBe(false);
    });
  });

  describe('generatePresignedUrl', () => {
    it('should generate presigned URL for read operation', async () => {
      const url = await storageManager.generatePresignedUrl(
        'test/file.txt',
        'read',
        3600
      );

      expect(url).toContain('http://localhost:3005/files/test/file.txt');
      expect(url).toContain('token=');
      expect(url).toContain('expires=');
    });

    it('should generate presigned URL for write operation', async () => {
      const url = await storageManager.generatePresignedUrl(
        'test/file.txt',
        'write',
        1800
      );

      expect(url).toContain('http://localhost:3005/files/test/file.txt');
      expect(url).toContain('token=');
      expect(url).toContain('expires=');
    });
  });

  describe('storeMultiple', () => {
    it('should store multiple files successfully', async () => {
      const files: FileData[] = [
        {
          buffer: Buffer.from('file 1 content'),
          originalName: 'file1.txt',
          mimeType: 'text/plain',
          size: 14,
        },
        {
          buffer: Buffer.from('file 2 content'),
          originalName: 'file2.txt',
          mimeType: 'text/plain',
          size: 14,
        },
      ];

      const paths = ['test/multi1.txt', 'test/multi2.txt'];
      const results = await storageManager.storeMultiple(files, paths);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
      expect(results[0].path).toBe('test/multi1.txt');
      expect(results[1].path).toBe('test/multi2.txt');

      // Verify both files exist
      const exists1 = await storageManager.exists('test/multi1.txt');
      const exists2 = await storageManager.exists('test/multi2.txt');
      expect(exists1).toBe(true);
      expect(exists2).toBe(true);
    });

    it('should throw error for mismatched arrays', async () => {
      const files: FileData[] = [
        {
          buffer: Buffer.from('test'),
          originalName: 'test.txt',
          mimeType: 'text/plain',
          size: 4,
        },
      ];
      const paths = ['path1.txt', 'path2.txt'];

      await expect(storageManager.storeMultiple(files, paths)).rejects.toThrow(
        'Files and paths arrays must have the same length'
      );
    });
  });

  describe('deleteMultiple', () => {
    it('should delete multiple files successfully', async () => {
      // Store files first
      const files: FileData[] = [
        {
          buffer: Buffer.from('delete me 1'),
          originalName: 'delete1.txt',
          mimeType: 'text/plain',
          size: 11,
        },
        {
          buffer: Buffer.from('delete me 2'),
          originalName: 'delete2.txt',
          mimeType: 'text/plain',
          size: 11,
        },
      ];

      const paths = ['test/delete1.txt', 'test/delete2.txt'];
      await storageManager.storeMultiple(files, paths);

      // Delete the files
      const results = await storageManager.deleteMultiple(paths);

      expect(results).toHaveLength(2);
      expect(results[0]).toBe(true);
      expect(results[1]).toBe(true);

      // Verify files no longer exist
      const exists1 = await storageManager.exists('test/delete1.txt');
      const exists2 = await storageManager.exists('test/delete2.txt');
      expect(exists1).toBe(false);
      expect(exists2).toBe(false);
    });
  });

  describe('getStorageInfo', () => {
    it('should return storage info for existing file', async () => {
      const fileData: FileData = {
        buffer: Buffer.from('info test content'),
        originalName: 'info-test.txt',
        mimeType: 'text/plain',
        size: 17,
      };

      await storageManager.store(fileData, 'test/info-test.txt');
      const info = await storageManager.getStorageInfo('test/info-test.txt');

      expect(info.path).toBe('test/info-test.txt');
      expect(info.size).toBe(17);
      expect(info.contentType).toBe('text/plain');
      expect(info.lastModified).toBeInstanceOf(Date);
    });

    it('should throw error for non-existent file', async () => {
      await expect(
        storageManager.getStorageInfo('non-existent/file.txt')
      ).rejects.toThrow('File not found: non-existent/file.txt');
    });
  });

  describe('listFiles', () => {
    it('should list files in directory', async () => {
      // Store multiple files
      const files: FileData[] = [
        {
          buffer: Buffer.from('list test 1'),
          originalName: 'list1.txt',
          mimeType: 'text/plain',
          size: 11,
        },
        {
          buffer: Buffer.from('list test 2'),
          originalName: 'list2.txt',
          mimeType: 'text/plain',
          size: 11,
        },
      ];

      await storageManager.storeMultiple(files, [
        'test/list/list1.txt',
        'test/list/list2.txt',
      ]);

      const result = await storageManager.listFiles('test/list');

      expect(result.files).toHaveLength(2);
      expect(result.hasMore).toBe(false);
      expect(result.files[0].path).toContain('list1.txt');
      expect(result.files[1].path).toContain('list2.txt');
    });

    it('should handle empty directory', async () => {
      const result = await storageManager.listFiles('empty/directory');

      expect(result.files).toHaveLength(0);
      expect(result.hasMore).toBe(false);
    });

    it('should respect limit parameter', async () => {
      // Store multiple files
      const files: FileData[] = Array.from({ length: 5 }, (_, i) => ({
        buffer: Buffer.from(`content ${i}`),
        originalName: `file${i}.txt`,
        mimeType: 'text/plain',
        size: 9,
      }));

      const paths = files.map((_, i) => `test/limit/file${i}.txt`);
      await storageManager.storeMultiple(files, paths);

      const result = await storageManager.listFiles('test/limit', 3);

      expect(result.files.length).toBeLessThanOrEqual(3);
    });
  });
});
