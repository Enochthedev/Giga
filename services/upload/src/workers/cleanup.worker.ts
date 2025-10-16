import { PrismaClient } from '../generated/prisma-client';
import { Logger } from '../lib/logger';
import { MetadataService } from '../services/metadata.service';
import { RetentionServiceImpl } from '../services/retention.service';
import { StorageManagerService } from '../services/storage-manager.service';

export interface CleanupJobData {
  type: 'expired_files' | 'orphaned_files' | 'temp_files' | 'failed_uploads';
  options?: {
    dryRun?: boolean;
    batchSize?: number;
    maxAge?: number; // in days
  };
}

export interface CleanupJobResult {
  success: boolean;
  processed: number;
  deleted: number;
  errors: string[];
  duration: number;
}

export class CleanupWorker {
  private prisma: PrismaClient;
  private logger: Logger;
  private retentionService: RetentionServiceImpl;
  private storageManager: StorageManagerService;
  private metadataService: MetadataService;

  constructor(
    prisma: PrismaClient,
    logger: Logger,
    storageManager: StorageManagerService,
    metadataService: MetadataService
  ) {
    this.prisma = prisma;
    this.logger = logger;
    this.storageManager = storageManager;
    this.metadataService = metadataService;
    this.retentionService = new RetentionServiceImpl(
      prisma,
      logger,
      storageManager,
      metadataService
    );
  }

  async processCleanupJob(data: CleanupJobData): Promise<CleanupJobResult> {
    const startTime = Date.now();
    this.logger.info('Starting cleanup job', {
      type: data.type,
      options: data.options,
    });

    try {
      let result: CleanupJobResult;

      switch (data.type) {
        case 'expired_files':
          result = await this.cleanupExpiredFiles(data.options);
          break;
        case 'orphaned_files':
          result = await this.cleanupOrphanedFiles(data.options);
          break;
        case 'temp_files':
          result = await this.cleanupTempFiles(data.options);
          break;
        case 'failed_uploads':
          result = await this.cleanupFailedUploads(data.options);
          break;
        default:
          throw new Error(`Unknown cleanup job type: ${data.type}`);
      }

      result.duration = Date.now() - startTime;
      this.logger.info('Cleanup job completed', {
        type: data.type,
        result: {
          processed: result.processed,
          deleted: result.deleted,
          errors: result.errors.length,
          duration: result.duration,
        },
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error('Cleanup job failed', {
        error,
        type: data.type,
        duration,
      });

      return {
        success: false,
        processed: 0,
        deleted: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        duration,
      };
    }
  }

  private async cleanupExpiredFiles(
    options?: CleanupJobData['options']
  ): Promise<CleanupJobResult> {
    const dryRun = options?.dryRun || false;
    const batchSize = options?.batchSize || 100;

    if (dryRun) {
      const expiredFileIds = await this.retentionService.identifyExpiredFiles();
      return {
        success: true,
        processed: expiredFileIds.length,
        deleted: 0,
        errors: [],
        duration: 0,
      };
    }

    const { deleted, errors } =
      await this.retentionService.cleanupExpiredFiles();

    return {
      success: errors.length === 0,
      processed: deleted + errors.length,
      deleted,
      errors,
      duration: 0,
    };
  }

  private async cleanupOrphanedFiles(
    options?: CleanupJobData['options']
  ): Promise<CleanupJobResult> {
    const dryRun = options?.dryRun || false;
    const batchSize = options?.batchSize || 100;

    // Find files in storage that don't have database records
    const orphanedFiles: string[] = [];
    let processed = 0;
    let deleted = 0;
    const errors: string[] = [];

    try {
      // This would require implementing a method to list all files in storage
      // and compare with database records. For now, we'll focus on database orphans.

      // Find database records without corresponding storage files
      const dbFiles = await this.prisma.fileMetadata.findMany({
        where: { status: { not: 'DELETED' } },
        select: { id: true, path: true },
        take: batchSize,
      });

      for (const file of dbFiles) {
        processed++;

        try {
          const exists = await this.storageManager.exists(file.path);
          if (!exists) {
            if (!dryRun) {
              // Mark as deleted in database since file doesn't exist in storage
              await this.prisma.fileMetadata.update({
                where: { id: file.id },
                data: { status: 'DELETED' },
              });
              deleted++;
            }
            orphanedFiles.push(file.path);
          }
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : 'Unknown error';
          errors.push(`File ${file.id}: ${errorMsg}`);
        }
      }

      this.logger.info('Orphaned files cleanup', {
        processed,
        orphaned: orphanedFiles.length,
        deleted: dryRun ? 0 : deleted,
      });

      return {
        success: errors.length === 0,
        processed,
        deleted: dryRun ? 0 : deleted,
        errors,
        duration: 0,
      };
    } catch (error) {
      this.logger.error('Failed to cleanup orphaned files', { error });
      return {
        success: false,
        processed,
        deleted,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        duration: 0,
      };
    }
  }

  private async cleanupTempFiles(
    options?: CleanupJobData['options']
  ): Promise<CleanupJobResult> {
    const dryRun = options?.dryRun || false;
    const maxAge = options?.maxAge || 1; // 1 day default
    const batchSize = options?.batchSize || 100;

    let processed = 0;
    let deleted = 0;
    const errors: string[] = [];

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - maxAge);

      // Find old upload sessions that are not completed
      const oldSessions = await this.prisma.uploadSession.findMany({
        where: {
          status: { in: ['PENDING', 'IN_PROGRESS'] },
          createdAt: { lt: cutoffDate },
        },
        take: batchSize,
        include: { files: true },
      });

      for (const session of oldSessions) {
        processed++;

        try {
          if (!dryRun) {
            // Delete associated files from storage
            for (const sessionFile of session.files) {
              if (sessionFile.fileId) {
                const file = await this.prisma.fileMetadata.findUnique({
                  where: { id: sessionFile.fileId },
                });
                if (file) {
                  await this.storageManager.delete(file.path);
                  await this.prisma.fileMetadata.update({
                    where: { id: file.id },
                    data: { status: 'DELETED' },
                  });
                }
              }
            }

            // Delete the session
            await this.prisma.uploadSession.delete({
              where: { id: session.id },
            });
            deleted++;
          }
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : 'Unknown error';
          errors.push(`Session ${session.id}: ${errorMsg}`);
        }
      }

      this.logger.info('Temp files cleanup', {
        processed,
        deleted: dryRun ? 0 : deleted,
      });

      return {
        success: errors.length === 0,
        processed,
        deleted: dryRun ? 0 : deleted,
        errors,
        duration: 0,
      };
    } catch (error) {
      this.logger.error('Failed to cleanup temp files', { error });
      return {
        success: false,
        processed,
        deleted,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        duration: 0,
      };
    }
  }

  private async cleanupFailedUploads(
    options?: CleanupJobData['options']
  ): Promise<CleanupJobResult> {
    const dryRun = options?.dryRun || false;
    const maxAge = options?.maxAge || 7; // 7 days default
    const batchSize = options?.batchSize || 100;

    let processed = 0;
    let deleted = 0;
    const errors: string[] = [];

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - maxAge);

      // Find old failed uploads
      const failedFiles = await this.prisma.fileMetadata.findMany({
        where: {
          status: 'FAILED',
          updatedAt: { lt: cutoffDate },
        },
        take: batchSize,
      });

      for (const file of failedFiles) {
        processed++;

        try {
          if (!dryRun) {
            // Try to delete from storage (might not exist)
            try {
              await this.storageManager.delete(file.path);
            } catch (storageError) {
              // Ignore storage errors for failed uploads
            }

            // Delete from database
            await this.prisma.fileMetadata.delete({
              where: { id: file.id },
            });
            deleted++;
          }
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : 'Unknown error';
          errors.push(`File ${file.id}: ${errorMsg}`);
        }
      }

      this.logger.info('Failed uploads cleanup', {
        processed,
        deleted: dryRun ? 0 : deleted,
      });

      return {
        success: errors.length === 0,
        processed,
        deleted: dryRun ? 0 : deleted,
        errors,
        duration: 0,
      };
    } catch (error) {
      this.logger.error('Failed to cleanup failed uploads', { error });
      return {
        success: false,
        processed,
        deleted,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        duration: 0,
      };
    }
  }

  // Schedule cleanup jobs
  async scheduleCleanupJobs(): Promise<void> {
    try {
      // Schedule different types of cleanup jobs
      const jobs = [
        { type: 'expired_files' as const, cron: '0 2 * * *' }, // Daily at 2 AM
        { type: 'orphaned_files' as const, cron: '0 3 * * 0' }, // Weekly on Sunday at 3 AM
        { type: 'temp_files' as const, cron: '0 1 * * *' }, // Daily at 1 AM
        { type: 'failed_uploads' as const, cron: '0 4 * * 0' }, // Weekly on Sunday at 4 AM
      ];

      for (const job of jobs) {
        // In a real implementation, you would use a job scheduler like node-cron
        // or integrate with a job queue system like Bull or Agenda
        this.logger.info('Cleanup job scheduled', {
          type: job.type,
          cron: job.cron,
        });
      }
    } catch (error) {
      this.logger.error('Failed to schedule cleanup jobs', { error });
    }
  }
}
