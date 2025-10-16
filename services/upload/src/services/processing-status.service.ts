import { Job } from 'bull';
import { QueueName } from '../interfaces/queue.interface';
import { logger } from '../lib/logger';
import { prisma } from '../lib/prisma';
import { JobProgress } from '../types/job.types';
import { queueManager } from './queue-manager.service';

export class ProcessingStatusService {
  async getFileProcessingStatus(fileId: string): Promise<JobProgress[]> {
    try {
      // Get all jobs related to this file from different queues
      const jobStatuses: JobProgress[] = [];

      for (const queueName of Object.values(QueueName)) {
        const jobs = await this.findJobsForFile(queueName, fileId);

        for (const job of jobs) {
          const status = await this.getJobProgress(job, queueName);
          if (status) {
            jobStatuses.push(status);
          }
        }
      }

      return jobStatuses;
    } catch (error) {
      logger.error(
        `Error getting processing status for file ${fileId}:`,
        error
      );
      return [];
    }
  }

  async getJobProgress(
    job: Job,
    queueName: string
  ): Promise<JobProgress | null> {
    try {
      const state = await job.getState();
      const progress = job.progress();

      let status: JobProgress['status'];
      switch (state) {
        case 'waiting':
        case 'delayed':
          status = 'queued';
          break;
        case 'active':
          status = 'processing';
          break;
        case 'completed':
          status = 'completed';
          break;
        case 'failed':
          status = 'failed';
          break;
        default:
          status = 'queued';
      }

      return {
        jobId: job.id!.toString(),
        status,
        progress: typeof progress === 'number' ? progress : 0,
        message: this.getStatusMessage(queueName, status, progress),
        startedAt: job.processedOn ? new Date(job.processedOn) : undefined,
        completedAt: job.finishedOn ? new Date(job.finishedOn) : undefined,
        error: job.failedReason || undefined,
      };
    } catch (error) {
      logger.error(`Error getting job progress for job ${job.id}:`, error);
      return null;
    }
  }

  private async findJobsForFile(
    queueName: string,
    fileId: string
  ): Promise<Job[]> {
    try {
      // Get jobs from all states
      const allJobs = await Promise.all([
        queueManager.getQueue(queueName).getJobs(['waiting']),
        queueManager.getQueue(queueName).getJobs(['active']),
        queueManager.getQueue(queueName).getJobs(['completed']),
        queueManager.getQueue(queueName).getJobs(['failed']),
        queueManager.getQueue(queueName).getJobs(['delayed']),
      ]);

      const jobs = allJobs.flat();

      // Filter jobs that belong to this file
      return jobs.filter(job => {
        return job.data && job.data.fileId === fileId;
      });
    } catch (error) {
      logger.error(
        `Error finding jobs for file ${fileId} in queue ${queueName}:`,
        error
      );
      return [];
    }
  }

  private getStatusMessage(
    queueName: string,
    status: JobProgress['status'],
    progress: number | object
  ): string {
    const progressNum = typeof progress === 'number' ? progress : 0;

    switch (queueName) {
      case QueueName.FILE_VALIDATION:
        switch (status) {
          case 'queued':
            return 'File validation queued';
          case 'processing':
            return `Validating file... ${progressNum}%`;
          case 'completed':
            return 'File validation completed';
          case 'failed':
            return 'File validation failed';
        }
        break;

      case QueueName.IMAGE_PROCESSING:
        switch (status) {
          case 'queued':
            return 'Image processing queued';
          case 'processing':
            if (progressNum < 30) return `Analyzing image... ${progressNum}%`;
            if (progressNum < 50) return `Processing image... ${progressNum}%`;
            if (progressNum < 80)
              return `Generating thumbnails... ${progressNum}%`;
            return `Finalizing... ${progressNum}%`;
          case 'completed':
            return 'Image processing completed';
          case 'failed':
            return 'Image processing failed';
        }
        break;

      case QueueName.METADATA_EXTRACTION:
        switch (status) {
          case 'queued':
            return 'Metadata extraction queued';
          case 'processing':
            return `Extracting metadata... ${progressNum}%`;
          case 'completed':
            return 'Metadata extraction completed';
          case 'failed':
            return 'Metadata extraction failed';
        }
        break;

      default:
        return `${status} (${progressNum}%)`;
    }

    return `${status}`;
  }

  async updateFileProcessingStatus(
    fileId: string,
    overallStatus: string,
    details?: any
  ): Promise<void> {
    try {
      await prisma.fileMetadata.update({
        where: { id: fileId },
        data: {
          status: overallStatus as any,
          metadata: {
            processing: {
              status: overallStatus,
              updatedAt: new Date().toISOString(),
              ...details,
            },
          },
        },
      });
    } catch (error) {
      logger.error(
        `Error updating processing status for file ${fileId}:`,
        error
      );
    }
  }

  async getOverallProcessingStatus(fileId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    message: string;
    jobs: JobProgress[];
  }> {
    const jobs = await this.getFileProcessingStatus(fileId);

    if (jobs.length === 0) {
      return {
        status: 'pending',
        progress: 0,
        message: 'No processing jobs found',
        jobs: [],
      };
    }

    // Determine overall status
    const hasFailedJobs = jobs.some(job => job.status === 'failed');
    const hasProcessingJobs = jobs.some(job => job.status === 'processing');
    const allCompleted = jobs.every(job => job.status === 'completed');

    let overallStatus: 'pending' | 'processing' | 'completed' | 'failed';
    if (hasFailedJobs) {
      overallStatus = 'failed';
    } else if (allCompleted) {
      overallStatus = 'completed';
    } else if (hasProcessingJobs) {
      overallStatus = 'processing';
    } else {
      overallStatus = 'pending';
    }

    // Calculate overall progress
    const totalProgress = jobs.reduce((sum, job) => sum + job.progress, 0);
    const averageProgress =
      jobs.length > 0 ? Math.round(totalProgress / jobs.length) : 0;

    // Generate overall message
    let message: string;
    if (overallStatus === 'failed') {
      const failedJob = jobs.find(job => job.status === 'failed');
      message = failedJob?.error || 'Processing failed';
    } else if (overallStatus === 'completed') {
      message = 'All processing completed successfully';
    } else if (overallStatus === 'processing') {
      const processingJob = jobs.find(job => job.status === 'processing');
      message = processingJob?.message || 'Processing in progress';
    } else {
      message = 'Processing queued';
    }

    return {
      status: overallStatus,
      progress: averageProgress,
      message,
      jobs,
    };
  }

  async cancelFileProcessing(fileId: string): Promise<boolean> {
    try {
      let cancelledAny = false;

      for (const queueName of Object.values(QueueName)) {
        const jobs = await this.findJobsForFile(queueName, fileId);

        for (const job of jobs) {
          const state = await job.getState();
          if (
            state === 'waiting' ||
            state === 'delayed' ||
            state === 'active'
          ) {
            await job.remove();
            cancelledAny = true;
            logger.info(
              `Cancelled job ${job.id} for file ${fileId} in queue ${queueName}`
            );
          }
        }
      }

      if (cancelledAny) {
        await this.updateFileProcessingStatus(fileId, 'cancelled');
      }

      return cancelledAny;
    } catch (error) {
      logger.error(`Error cancelling processing for file ${fileId}:`, error);
      return false;
    }
  }
}

export const processingStatusService = new ProcessingStatusService();
