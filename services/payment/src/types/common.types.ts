export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FilterParams {
  startDate?: string;
  endDate?: string;
  status?: string;
  userId?: string;
  merchantId?: string;
  gateway?: string;
  currency?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  services: {
    database: 'healthy' | 'unhealthy';
    redis: 'healthy' | 'unhealthy';
    gateways: Record<string, 'healthy' | 'unhealthy'>;
  };
  metrics?: {
    memoryUsage: number;
    cpuUsage: number;
    activeConnections: number;
  };
}

export interface ServiceError extends Error {
  code: string;
  statusCode: number;
  details?: Record<string, any>;
  isOperational: boolean;
}
