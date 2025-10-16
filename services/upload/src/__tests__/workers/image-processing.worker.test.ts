import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ImageProcessingJobData } from '../../interfaces/queue.interface';
import { ImageProcessingWorker } from '../../workers/image-processing.worker';

// Mock dependencies
vi.mock('sharp', () => {
  const mockSharp = {
    metadata: vi.fn(),
    resize: vi.fn(),
    webp: vi.fn(),
    jpeg: vi.fn(),
    png: vi.fn(),
    toFile: vi.fn(),
  };

  // Chain methods
  mockSharp.resize.mockReturnValue(mockSharp);
  mockSharp.webp.mockReturnValue(mockSharp);
  mockSharp.jpeg.mockReturnValue(mockSharp);
  mockSharp.png.mockReturnValue(mockSharp);

  return {
    default: vi.fn(() => mockSharp),
  };
});

vi.mock('fs/promises', () => ({
  stat: vi.fn(),
  access: vi.fn(),
}));

vi.mock('../../lib/prisma', () => ({
  prisma: {
    file: {
      update: vi.fn(),
    },
  },
}));

vi.mock('../../services/storage-manager.service', () => ({
  storageManager: {
    // Mock if needed
  },
}));

describe('ImageProcessingWorker', () => {
  let worker: ImageProcessingWorker;
  let mockJob: any;
  let mockSharp: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    worker = new ImageProcessingWorker();

    mockJob = {
      id: 'job-123',
      data: {
        fileId: 'file-123',
        filePath: '/uploads/file-123.jpg',
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        entityType: 'product',
        entityId: 'product-123',
        processingOptions: {
          resize: { width: 800, height: 600, fit: 'cover' },
          format: 'webp',
          quality: 80,
          generateThumbnails: [
            { name: 'small', width: 200, height: 150 },
            { name: 'medium', width: 400, height: 300 },
          ],
        },
      } as ImageProcessingJobData,
      progress: vi.fn(),
    };

    const sharp = await import('sharp');
    mockSharp = sharp.default();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('process', () => {
    it('should successfully process an image with all options', async () => {
      const fs = await import('fs/promises');
      const { prisma } = await import('../../lib/prisma');

      // Mock file system operations
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.stat).mockResolvedValue({ size: 1024000 } as any);

      // Mock Sharp operations
      mockSharp.metadata.mockResolvedValue({
        width: 1200,
        height: 800,
        format: 'jpeg',
        space: 'srgb',
        hasAlpha: false,
      });

      mockSharp.toFile.mockResolvedValue({
        width: 800,
        height: 600,
        size: 512000,
      });

      // Mock database operations
      vi.mocked(prisma.file.update).mockResolvedValue({} as any);

      const result = await worker.process(mockJob);

      expect(result.success).toBe(true);
      expect(result.fileId).toBe('file-123');
      expect(result.processedFiles).toBeDefined();
      expect(result.metadata).toEqual({
        originalWidth: 1200,
        originalHeight: 800,
        format: 'jpeg',
        colorSpace: 'srgb',
        hasAlpha: false,
      });

      // Verify job progress updates
      expect(mockJob.progress).toHaveBeenCalledWith(10);
      expect(mockJob.progress).toHaveBeenCalledWith(20);
      expect(mockJob.progress).toHaveBeenCalledWith(100);
    });

    it('should handle file not found error', async () => {
      const fs = await import('fs/promises');
      const { prisma } = await import('../../lib/prisma');

      // Mock file not found
      vi.mocked(fs.access).mockRejectedValue(new Error('File not found'));
      vi.mocked(prisma.file.update).mockResolvedValue({} as any);

      const result = await worker.process(mockJob);

      expect(result.success).toBe(false);
      expect(result.error).toContain('File not found');

      // Should update file status to failed
      expect(prisma.file.update).toHaveBeenCalledWith({
        where: { id: 'file-123' },
        data: { status: 'failed' },
      });
    });

    it('should handle Sharp processing errors', async () => {
      const fs = await import('fs/promises');
      const { prisma } = await import('../../lib/prisma');

      // Mock file exists
      vi.mocked(fs.access).mockResolvedValue(undefined);

      // Mock Sharp error
      mockSharp.metadata.mockRejectedValue(new Error('Invalid image format'));
      vi.mocked(prisma.file.update).mockResolvedValue({} as any);

      const result = await worker.process(mockJob);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid image format');
    });

    it('should process image without resize options', async () => {
      const fs = await import('fs/promises');
      const { prisma } = await import('../../lib/prisma');

      // Modify job data to not include resize
      mockJob.data.processingOptions = {
        format: 'webp',
        quality: 80,
        generateThumbnails: [],
      };

      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.stat).mockResolvedValue({ size: 1024000 } as any);

      mockSharp.metadata.mockResolvedValue({
        width: 1200,
        height: 800,
        format: 'jpeg',
      });

      vi.mocked(prisma.file.update).mockResolvedValue({} as any);

      const result = await worker.process(mockJob);

      expect(result.success).toBe(true);
      expect(mockSharp.resize).not.toHaveBeenCalled();
    });

    it('should generate thumbnails correctly', async () => {
      const fs = await import('fs/promises');
      const { prisma } = await import('../../lib/prisma');

      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.stat).mockResolvedValue({ size: 1024000 } as any);

      mockSharp.metadata.mockResolvedValue({
        width: 1200,
        height: 800,
        format: 'jpeg',
      });

      // Mock thumbnail generation
      mockSharp.toFile.mockResolvedValue({
        width: 200,
        height: 150,
        size: 50000,
      });

      vi.mocked(prisma.file.update).mockResolvedValue({} as any);

      const result = await worker.process(mockJob);

      expect(result.success).toBe(true);
      expect(
        result.processedFiles?.filter(f => f.type === 'thumbnail')
      ).toHaveLength(2);

      // Verify Sharp was called for thumbnails
      expect(mockSharp.resize).toHaveBeenCalledWith(200, 150, {
        fit: 'cover',
        withoutEnlargement: true,
      });
      expect(mockSharp.resize).toHaveBeenCalledWith(400, 300, {
        fit: 'cover',
        withoutEnlargement: true,
      });
    });

    it('should handle different image formats', async () => {
      const fs = await import('fs/promises');
      const { prisma } = await import('../../lib/prisma');

      // Test JPEG format
      mockJob.data.processingOptions.format = 'jpeg';

      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.stat).mockResolvedValue({ size: 1024000 } as any);

      mockSharp.metadata.mockResolvedValue({
        width: 1200,
        height: 800,
        format: 'jpeg',
      });

      mockSharp.toFile.mockResolvedValue({
        width: 800,
        height: 600,
        size: 512000,
      });

      vi.mocked(prisma.file.update).mockResolvedValue({} as any);

      await worker.process(mockJob);

      expect(mockSharp.jpeg).toHaveBeenCalledWith({ quality: 80 });
    });

    it('should update database with processed file information', async () => {
      const fs = await import('fs/promises');
      const { prisma } = await import('../../lib/prisma');

      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.stat).mockResolvedValue({ size: 1024000 } as any);

      mockSharp.metadata.mockResolvedValue({
        width: 1200,
        height: 800,
        format: 'jpeg',
      });

      mockSharp.toFile.mockResolvedValue({
        width: 800,
        height: 600,
        size: 512000,
      });

      vi.mocked(prisma.file.update).mockResolvedValue({} as any);

      await worker.process(mockJob);

      // Verify database updates
      expect(prisma.file.update).toHaveBeenCalledWith({
        where: { id: 'file-123' },
        data: { status: 'processing' },
      });

      expect(prisma.file.update).toHaveBeenCalledWith({
        where: { id: 'file-123' },
        data: { status: 'ready' },
      });

      expect(prisma.file.update).toHaveBeenCalledWith({
        where: { id: 'file-123' },
        data: expect.objectContaining({
          url: expect.any(String),
          metadata: expect.objectContaining({
            originalWidth: 1200,
            originalHeight: 800,
            processedFiles: expect.any(Array),
            thumbnails: expect.any(Array),
          }),
        }),
      });
    });
  });

  describe('generateFileUrl', () => {
    it('should generate correct file URL', async () => {
      const url = await (worker as any).generateFileUrl(
        '/uploads/test/file.jpg'
      );
      expect(url).toMatch(/^\/files\//);
    });
  });

  describe('fileExists', () => {
    it('should return true when file exists', async () => {
      const fs = await import('fs/promises');
      vi.mocked(fs.access).mockResolvedValue(undefined);

      const exists = await (worker as any).fileExists('/uploads/test.jpg');
      expect(exists).toBe(true);
    });

    it('should return false when file does not exist', async () => {
      const fs = await import('fs/promises');
      vi.mocked(fs.access).mockRejectedValue(new Error('File not found'));

      const exists = await (worker as any).fileExists('/uploads/test.jpg');
      expect(exists).toBe(false);
    });
  });
});
