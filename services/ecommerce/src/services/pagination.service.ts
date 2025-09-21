export interface PaginationOptions {
  page?: number;
  limit?: number;
  cursor?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page?: number;
    limit: number;
    total?: number;
    totalPages?: number;
    hasMore: boolean;
    nextCursor?: string;
    prevCursor?: string;
  };
}

export interface CursorPaginationOptions {
  cursor?: string;
  limit?: number;
  sortBy: string;
  sortOrder?: 'asc' | 'desc';
}

export class PaginationService {
  // Offset-based pagination (traditional page/limit)
  static createOffsetPagination(options: PaginationOptions): {
    skip: number;
    take: number;
    page: number;
    limit: number;
  } {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20)); // Max 100 items per page
    const skip = (page - 1) * limit;

    return {
      skip,
      take: limit,
      page,
      limit,
    };
  }

  // Cursor-based pagination (more efficient for large datasets)
  static createCursorPagination(options: CursorPaginationOptions): {
    cursor?: { [key: string]: any };
    take: number;
    skip?: number;
    orderBy: { [key: string]: 'asc' | 'desc' };
  } {
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const sortOrder = options.sortOrder || 'desc';

    const result: any = {
      take: limit + 1, // Get one extra to check if there are more
      orderBy: { [options.sortBy]: sortOrder },
    };

    if (options.cursor) {
      result.cursor = { [options.sortBy]: options.cursor };
      result.skip = 1; // Skip the cursor item
    }

    return result;
  }

  // Process cursor pagination results
  static processCursorResults<T extends Record<string, any>>(
    results: T[],
    limit: number,
    sortBy: string
  ): {
    data: T[];
    hasMore: boolean;
    nextCursor?: string;
  } {
    const hasMore = results.length > limit;
    const data = hasMore ? results.slice(0, limit) : results;
    const nextCursor =
      hasMore && data.length > 0 ? data[data.length - 1][sortBy] : undefined;

    return {
      data,
      hasMore,
      nextCursor,
    };
  }

  // Create paginated response for offset pagination
  static createPaginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
  ): PaginatedResult<T> {
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore,
      },
    };
  }

  // Create paginated response for cursor pagination
  static createCursorPaginatedResponse<T>(
    data: T[],
    hasMore: boolean,
    nextCursor?: string,
    limit: number = 20
  ): PaginatedResult<T> {
    return {
      data,
      pagination: {
        limit,
        hasMore,
        nextCursor,
      },
    };
  }

  // Efficient pagination for search results with facets
  static async paginateWithFacets<T>(
    queryFn: (options: any) => Promise<T[]>,
    countFn: (where: any) => Promise<number>,
    facetFn?: (where: any) => Promise<Record<string, any>>,
    where: any = {},
    options: PaginationOptions = {}
  ): Promise<{
    data: T[];
    pagination: PaginatedResult<T>['pagination'];
    facets?: Record<string, any>;
  }> {
    const { skip, take, page, limit } = this.createOffsetPagination(options);

    // Execute queries in parallel for better performance
    const promises: [
      Promise<T[]>,
      Promise<number>,
      Promise<Record<string, any>> | undefined,
    ] = [
      queryFn({ where, skip, take, ...options }),
      countFn(where),
      facetFn ? facetFn(where) : undefined,
    ];

    const [data, total, facets] = await Promise.all(promises);

    const pagination = this.createPaginatedResponse(
      data,
      total,
      page,
      limit
    ).pagination;

    return {
      data,
      pagination,
      facets: facets || undefined,
    };
  }

  // Optimized pagination for time-series data
  static createTimeSeriesPagination(options: {
    startDate?: Date;
    endDate?: Date;
    interval?: 'hour' | 'day' | 'week' | 'month';
    limit?: number;
    cursor?: string;
  }): {
    where: any;
    orderBy: any;
    take: number;
    cursor?: any;
    skip?: number;
  } {
    const { startDate, endDate, limit = 50, cursor } = options;

    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const result: any = {
      where,
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
    };

    if (cursor) {
      result.cursor = { createdAt: new Date(cursor) };
      result.skip = 1;
    }

    return result;
  }

  // Batch processing for large datasets
  static async processBatches<T, R>(
    items: T[],
    batchSize: number,
    processor: (batch: T[]) => Promise<R[]>
  ): Promise<R[]> {
    const results: R[] = [];

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await processor(batch);
      results.push(...batchResults);
    }

    return results;
  }

  // Efficient deep pagination using keyset pagination
  static createKeysetPagination(options: {
    lastId?: string;
    lastValue?: any;
    sortBy: string;
    sortOrder?: 'asc' | 'desc';
    limit?: number;
  }): {
    where: any;
    orderBy: any;
    take: number;
  } {
    const {
      lastId,
      lastValue,
      sortBy,
      sortOrder = 'desc',
      limit = 20,
    } = options;

    const where: any = {};
    const orderBy: any = { [sortBy]: sortOrder };

    if (lastId && lastValue !== undefined) {
      if (sortOrder === 'desc') {
        where.OR = [
          { [sortBy]: { lt: lastValue } },
          { [sortBy]: lastValue, id: { lt: lastId } },
        ];
      } else {
        where.OR = [
          { [sortBy]: { gt: lastValue } },
          { [sortBy]: lastValue, id: { gt: lastId } },
        ];
      }
    }

    return {
      where,
      orderBy,
      take: limit + 1,
    };
  }

  // Validate pagination parameters
  static validatePaginationOptions(options: PaginationOptions): {
    isValid: boolean;
    errors: string[];
    sanitized: PaginationOptions;
  } {
    const errors: string[] = [];
    const sanitized: PaginationOptions = { ...options };

    // Validate page
    if (options.page !== undefined) {
      if (!Number.isInteger(options.page) || options.page < 1) {
        errors.push('Page must be a positive integer');
        sanitized.page = 1;
      } else if (options.page > 10000) {
        errors.push('Page number too large (max 10000)');
        sanitized.page = 10000;
      }
    }

    // Validate limit
    if (options.limit !== undefined) {
      if (!Number.isInteger(options.limit) || options.limit < 1) {
        errors.push('Limit must be a positive integer');
        sanitized.limit = 20;
      } else if (options.limit > 100) {
        errors.push('Limit too large (max 100)');
        sanitized.limit = 100;
      }
    }

    // Validate sort order
    if (options.sortOrder && !['asc', 'desc'].includes(options.sortOrder)) {
      errors.push('Sort order must be "asc" or "desc"');
      sanitized.sortOrder = 'desc';
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitized,
    };
  }

  // Calculate pagination metadata
  static calculatePaginationMetadata(
    currentPage: number,
    totalItems: number,
    itemsPerPage: number
  ): {
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage?: number;
    prevPage?: number;
    startIndex: number;
    endIndex: number;
  } {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

    return {
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? currentPage + 1 : undefined,
      prevPage: hasPrevPage ? currentPage - 1 : undefined,
      startIndex,
      endIndex,
    };
  }

  // Generate pagination links for API responses
  static generatePaginationLinks(
    baseUrl: string,
    currentPage: number,
    totalPages: number,
    queryParams: Record<string, any> = {}
  ): {
    first?: string;
    prev?: string;
    next?: string;
    last?: string;
  } {
    const createUrl = (page: number) => {
      const params = new URLSearchParams({
        ...queryParams,
        page: page.toString(),
      });
      return `${baseUrl}?${params.toString()}`;
    };

    const links: unknown = {};

    if (currentPage > 1) {
      links.first = createUrl(1);
      links.prev = createUrl(currentPage - 1);
    }

    if (currentPage < totalPages) {
      links.next = createUrl(currentPage + 1);
      links.last = createUrl(totalPages);
    }

    return links;
  }
}

// Export utility functions
export const {
  createOffsetPagination,
  createCursorPagination,
  processCursorResults,
  createPaginatedResponse,
  createCursorPaginatedResponse,
  validatePaginationOptions,
} = PaginationService;
