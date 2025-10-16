import { StorageConfig, ValidationConfig } from '../interfaces';

export interface UploadServiceConfig {
  port: number;
  host: string;
  cors: {
    origin: string[];
    credentials: boolean;
  };
  upload: UploadConfig;
  storage: StorageConfig;
  validation: ValidationConfig;
  processing: ProcessingConfig;
  security: SecurityConfig;
  monitoring: MonitoringConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  cdn: CDNConfig;
  delivery: DeliveryConfig;
}

export interface UploadConfig {
  maxFileSize: number;
  maxFiles: number;
  allowedMimeTypes: string[];
  tempDirectory: string;
}

export interface ProcessingConfig {
  imageProcessing: {
    enabled: boolean;
    maxConcurrentJobs: number;
    defaultQuality: number;
    thumbnailSizes: Array<{
      name: string;
      width: number;
      height: number;
    }>;
    supportedFormats: string[];
  };
  asyncProcessing: {
    enabled: boolean;
    queueName: string;
    maxRetries: number;
    retryDelay: number;
  };
}

export interface SecurityConfig {
  authentication: {
    enabled: boolean;
    tokenValidation: {
      issuer: string;
      audience: string;
      algorithm: string;
    };
  };
  malwareScanning: {
    enabled: boolean;
    provider: 'clamav' | 'virustotal' | 'custom';
    apiKey?: string;
    timeout: number;
  };
  encryption: {
    enabled: boolean;
    algorithm: string;
    keyRotationInterval: number;
  };
}

export interface MonitoringConfig {
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: 'json' | 'pretty';
    destination: 'console' | 'file' | 'both';
  };
  metrics: {
    enabled: boolean;
    endpoint: string;
    interval: number;
  };
  healthCheck: {
    enabled: boolean;
    endpoint: string;
    timeout: number;
  };
}

export interface DatabaseConfig {
  url: string;
  maxConnections: number;
  connectionTimeout: number;
  queryTimeout: number;
  ssl: boolean;
}

export interface RedisConfig {
  url: string;
  maxConnections: number;
  retryAttempts: number;
  retryDelay: number;
  keyPrefix: string;
}

export interface CDNConfig {
  enabled: boolean;
  provider: 'cloudflare' | 'aws' | 'azure' | 'custom';
  baseUrl: string;
  customDomain?: string;
  cacheSettings: {
    defaultTtl: number;
    maxAge: number;
    staleWhileRevalidate: number;
  };
  optimization: {
    enableImageOptimization: boolean;
    enableCompression: boolean;
    enableWebP: boolean;
    enableAvif: boolean;
  };
  security: {
    enableSignedUrls: boolean;
    signedUrlExpiry: number;
    allowedOrigins: string[];
  };
}

export interface DeliveryConfig {
  enableCDN: boolean;
  enableCaching: boolean;
  enableCompression: boolean;
  enableRangeRequests: boolean;
  maxCacheAge: number;
}

// Default configuration
export const defaultConfig: UploadServiceConfig = {
  port: parseInt(process.env.PORT || '3005'),
  host: process.env.HOST || '0.0.0.0',
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800'), // 50MB default
    maxFiles: parseInt(process.env.MAX_FILES || '10'),
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'text/plain',
      'text/csv',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    tempDirectory: process.env.TEMP_DIRECTORY || './temp',
  },
  storage: {
    type: (process.env.STORAGE_TYPE as any) || 'local',
    basePath: process.env.STORAGE_BASE_PATH || './uploads',
    credentials: process.env.STORAGE_CREDENTIALS
      ? JSON.parse(process.env.STORAGE_CREDENTIALS)
      : undefined,
    options: process.env.STORAGE_OPTIONS
      ? JSON.parse(process.env.STORAGE_OPTIONS)
      : {},
  },
  validation: {
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    enableMalwareScanning: process.env.ENABLE_MALWARE_SCANNING === 'true',
    enableContentValidation: process.env.ENABLE_CONTENT_VALIDATION === 'true',
    enableIntegrityCheck: process.env.ENABLE_INTEGRITY_CHECK === 'true',
  },
  processing: {
    imageProcessing: {
      enabled: process.env.ENABLE_IMAGE_PROCESSING !== 'false',
      maxConcurrentJobs: parseInt(process.env.MAX_CONCURRENT_JOBS || '5'),
      defaultQuality: parseInt(process.env.DEFAULT_IMAGE_QUALITY || '80'),
      thumbnailSizes: [
        { name: 'small', width: 150, height: 150 },
        { name: 'medium', width: 300, height: 300 },
        { name: 'large', width: 600, height: 600 },
      ],
      supportedFormats: ['jpeg', 'png', 'webp'],
    },
    asyncProcessing: {
      enabled: process.env.ENABLE_ASYNC_PROCESSING === 'true',
      queueName: process.env.PROCESSING_QUEUE_NAME || 'upload-processing',
      maxRetries: parseInt(process.env.MAX_PROCESSING_RETRIES || '3'),
      retryDelay: parseInt(process.env.PROCESSING_RETRY_DELAY || '5000'),
    },
  },
  security: {
    authentication: {
      enabled: process.env.ENABLE_AUTH !== 'false',
      tokenValidation: {
        issuer: process.env.JWT_ISSUER || 'platform-auth',
        audience: process.env.JWT_AUDIENCE || 'platform-services',
        algorithm: process.env.JWT_ALGORITHM || 'HS256',
      },
    },
    malwareScanning: {
      enabled: process.env.ENABLE_MALWARE_SCANNING === 'true',
      provider: (process.env.MALWARE_SCANNER_PROVIDER as any) || 'clamav',
      apiKey: process.env.MALWARE_SCANNER_API_KEY,
      timeout: parseInt(process.env.MALWARE_SCAN_TIMEOUT || '30000'),
    },
    encryption: {
      enabled: process.env.ENABLE_ENCRYPTION === 'true',
      algorithm: process.env.ENCRYPTION_ALGORITHM || 'aes-256-gcm',
      keyRotationInterval: parseInt(
        process.env.KEY_ROTATION_INTERVAL || '86400000'
      ), // 24 hours
    },
  },
  monitoring: {
    logging: {
      level: (process.env.LOG_LEVEL as any) || 'info',
      format: (process.env.LOG_FORMAT as any) || 'json',
      destination: (process.env.LOG_DESTINATION as any) || 'console',
    },
    metrics: {
      enabled: process.env.ENABLE_METRICS === 'true',
      endpoint: process.env.METRICS_ENDPOINT || '/metrics',
      interval: parseInt(process.env.METRICS_INTERVAL || '60000'),
    },
    healthCheck: {
      enabled: process.env.ENABLE_HEALTH_CHECK !== 'false',
      endpoint: process.env.HEALTH_CHECK_ENDPOINT || '/health',
      timeout: parseInt(process.env.HEALTH_CHECK_TIMEOUT || '5000'),
    },
  },
  database: {
    url:
      process.env.DATABASE_URL || 'postgresql://localhost:5432/upload_service',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '10000'),
    queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT || '30000'),
    ssl: process.env.DB_SSL === 'true',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    maxConnections: parseInt(process.env.REDIS_MAX_CONNECTIONS || '10'),
    retryAttempts: parseInt(process.env.REDIS_RETRY_ATTEMPTS || '3'),
    retryDelay: parseInt(process.env.REDIS_RETRY_DELAY || '1000'),
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'upload:',
  },
  cdn: {
    enabled: process.env.CDN_ENABLED === 'true',
    provider: (process.env.CDN_PROVIDER as 'cloudflare' | 'aws' | 'azure' | 'custom') || 'custom',
    baseUrl: process.env.CDN_BASE_URL || 'https://cdn.example.com',
    customDomain: process.env.CDN_CUSTOM_DOMAIN,
    cacheSettings: {
      defaultTtl: parseInt(process.env.CDN_DEFAULT_TTL || '86400'), // 24 hours
      maxAge: parseInt(process.env.CDN_MAX_AGE || '31536000'), // 1 year
      staleWhileRevalidate: parseInt(
        process.env.CDN_STALE_WHILE_REVALIDATE || '86400'
      ), // 24 hours
    },
    optimization: {
      enableImageOptimization: process.env.CDN_IMAGE_OPTIMIZATION !== 'false',
      enableCompression: process.env.CDN_COMPRESSION !== 'false',
      enableWebP: process.env.CDN_WEBP !== 'false',
      enableAvif: process.env.CDN_AVIF === 'true',
    },
    security: {
      enableSignedUrls: process.env.CDN_SIGNED_URLS === 'true',
      signedUrlExpiry: parseInt(process.env.CDN_SIGNED_URL_EXPIRY || '3600'), // 1 hour
      allowedOrigins: process.env.CDN_ALLOWED_ORIGINS?.split(',') || ['*'],
    },
  },
  delivery: {
    enableCDN: process.env.DELIVERY_CDN_ENABLED === 'true',
    enableCaching: process.env.DELIVERY_CACHING !== 'false',
    enableCompression: process.env.DELIVERY_COMPRESSION !== 'false',
    enableRangeRequests: process.env.DELIVERY_RANGE_REQUESTS !== 'false',
    maxCacheAge: parseInt(process.env.DELIVERY_MAX_CACHE_AGE || '86400'), // 24 hours
  },
};

export function getConfig(): UploadServiceConfig {
  return defaultConfig;
}
