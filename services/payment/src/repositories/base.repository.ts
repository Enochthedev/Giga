import { PrismaClient } from '@prisma/client';
import prisma from '../lib/prisma';

/**
 * Base repository class with common database operations
 */
export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  protected prisma: PrismaClient;
  protected modelName: string;

  constructor(modelName: string) {
    this.prisma = prisma;
    this.modelName = modelName;
  }

  /**
   * Find a record by ID
   */
  abstract findById(id: string): Promise<T | null>;

  /**
   * Find multiple records with optional filtering
   */
  abstract findMany(options?: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
    include?: any;
  }): Promise<T[]>;

  /**
   * Create a new record
   */
  abstract create(data: CreateInput): Promise<T>;

  /**
   * Update a record by ID
   */
  abstract update(id: string, data: UpdateInput): Promise<T>;

  /**
   * Delete a record by ID
   */
  abstract delete(id: string): Promise<T>;

  /**
   * Count records with optional filtering
   */
  abstract count(where?: any): Promise<number>;

  /**
   * Check if a record exists
   */
  async exists(id: string): Promise<boolean> {
    const count = await this.count({ id });
    return count > 0;
  }

  /**
   * Find first record matching criteria
   */
  abstract findFirst(options: {
    where?: any;
    orderBy?: any;
    include?: any;
  }): Promise<T | null>;

  /**
   * Upsert (create or update) a record
   */
  abstract upsert(options: {
    where: any;
    create: CreateInput;
    update: UpdateInput;
  }): Promise<T>;

  /**
   * Batch create multiple records
   */
  abstract createMany(data: CreateInput[]): Promise<{ count: number }>;

  /**
   * Batch update multiple records
   */
  abstract updateMany(options: {
    where: any;
    data: Partial<UpdateInput>;
  }): Promise<{ count: number }>;

  /**
   * Batch delete multiple records
   */
  abstract deleteMany(where: any): Promise<{ count: number }>;
}

/**
 * Pagination helper
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
  orderBy?: any;
}

export interface PaginatedResult<T> {
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

/**
 * Apply pagination to a query
 */
export function applyPagination(options: PaginationOptions) {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 20));
  const skip = (page - 1) * limit;

  return {
    skip,
    take: limit,
    page,
    limit,
  };
}

/**
 * Create paginated result
 */
export function createPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * Database error handling
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

/**
 * Handle Prisma errors and convert to application errors
 */
export function handleDatabaseError(error: any): never {
  if (error.code === 'P2002') {
    throw new DatabaseError(
      'A record with this data already exists',
      'UNIQUE_CONSTRAINT_VIOLATION',
      error
    );
  }

  if (error.code === 'P2003') {
    throw new DatabaseError(
      'Foreign key constraint violation',
      'FOREIGN_KEY_CONSTRAINT_VIOLATION',
      error
    );
  }

  if (error.code === 'P2025') {
    throw new DatabaseError('Record not found', 'RECORD_NOT_FOUND', error);
  }

  if (error.code === 'P2014') {
    throw new DatabaseError('Invalid ID provided', 'INVALID_ID', error);
  }

  // Generic database error
  throw new DatabaseError(
    error.message || 'Database operation failed',
    error.code,
    error
  );
}
