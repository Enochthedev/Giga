export interface ProcessingResult {
  success: boolean;
  fileId: string;
  originalPath: string;
  processedFiles?: ProcessedFile[];
  error?: string;
  metadata?: Record<string, any>;
}

export interface ProcessedFile {
  type: 'original' | 'thumbnail' | 'optimized';
  name: string;
  path: string;
  url: string;
  width?: number;
  height?: number;
  size: number;
  format: string;
}

export interface ValidationResult {
  valid: boolean;
  fileId: string;
  issues?: ValidationIssue[];
  metadata?: {
    actualMimeType?: string;
    virusScanResult?: 'clean' | 'infected' | 'suspicious';
    fileSignature?: string;
  };
}

export interface ValidationIssue {
  type:
    | 'mime_type_mismatch'
    | 'virus_detected'
    | 'invalid_signature'
    | 'size_exceeded';
  message: string;
  severity: 'error' | 'warning';
}

export interface JobProgress {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  message?: string;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export interface BackpressureConfig {
  maxConcurrentJobs: number;
  maxQueueSize: number;
  pauseThreshold: number;
  resumeThreshold: number;
}

export interface QueueMetrics {
  queueName: string;
  totalJobs: number;
  activeJobs: number;
  waitingJobs: number;
  completedJobs: number;
  failedJobs: number;
  avgProcessingTime: number;
  throughput: number; // jobs per minute
  errorRate: number; // percentage
}
