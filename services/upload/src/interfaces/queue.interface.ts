import { Job } from 'bull';

export interface QueueJob<T = any> {
  id: string;
  data: T;
  priority?: number;
  delay?: number;
  attempts?: number;
  backoff?: {
    type: 'fixed' | 'exponential';
    delay: number;
  };
}

export interface QueueProcessor<T = any> {
  process(job: Job<T>): Promise<any>;
}

export interface QueueManager {
  addJob<T>(
    queueName: string,
    jobData: T,
    options?: QueueJobOptions
  ): Promise<Job<T>>;
  getJob(queueName: string, jobId: string): Promise<Job | null>;
  getJobStatus(queueName: string, jobId: string): Promise<JobStatus>;
  removeJob(queueName: string, jobId: string): Promise<boolean>;
  pauseQueue(queueName: string): Promise<void>;
  resumeQueue(queueName: string): Promise<void>;
  getQueueStats(queueName: string): Promise<QueueStats>;
}

export interface QueueJobOptions {
  priority?: number;
  delay?: number;
  attempts?: number;
  backoff?: {
    type: 'fixed' | 'exponential';
    delay: number;
  };
  removeOnComplete?: number;
  removeOnFail?: number;
}

export interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: boolean;
}

export enum JobStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
  DELAYED = 'delayed',
  STUCK = 'stuck',
}

export enum QueueName {
  IMAGE_PROCESSING = 'image-processing',
  FILE_VALIDATION = 'file-validation',
  METADATA_EXTRACTION = 'metadata-extraction',
  CLEANUP = 'cleanup',
}

// Job data interfaces
export interface ImageProcessingJobData {
  fileId: string;
  filePath: string;
  originalName: string;
  mimeType: string;
  entityType: string;
  entityId: string;
  processingOptions: {
    resize?: {
      width: number;
      height: number;
      fit: 'cover' | 'contain' | 'fill';
    };
    format?: 'webp' | 'jpeg' | 'png';
    quality?: number;
    generateThumbnails?: Array<{
      name: string;
      width: number;
      height: number;
    }>;
  };
}

export interface FileValidationJobData {
  fileId: string;
  filePath: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface MetadataExtractionJobData {
  fileId: string;
  filePath: string;
  mimeType: string;
}

export interface CleanupJobData {
  fileId: string;
  filePath: string;
  reason: 'expired' | 'deleted' | 'failed';
}
