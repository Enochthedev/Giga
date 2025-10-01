import { createLogger } from '../lib/logger';
import { FileMetadata } from '../types/upload.types';
import { connectionPoolService } from './connection-pool.service';

const logger = createLogger('CacheService');

export interface CacheConfig {
  defaultTtl: number;
  maxMemoryUsage: number;
  compressionEnabled: boolean;
  keyPrefix: string;
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  compressed?: boolean;
}

export class CacheService {
  private static instance: CacheService;
  private memoryCache: Map<string, CacheEntry> = new Map();
  private cacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    evictions: 0,
  };

  private config: CacheConfig = {
    defaultTtl: 3600, // 1 hour
    maxMemoryUsage: 100 * 1024 * 1024, // 100MB
    compressionEnabled: true,
    keyPrefix: 'upload:cache:',
  };

  private constructor() {
    // Start cache cleanup interval
    setInterval(() => this.cleanupExpiredEntries(), 60000); // Every minute
    setInterval(() => this.enforceMemoryLimit(), 300000); // Every 5 minutes
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Get value from cache (Redis first, then memory)
   */
  public async get<T = any>(key: string): Promise<T | null> {
    const fullKey = this.config.keyPrefix + key;

    try {
      // Try Redis first
      const redisValue = await connectionPoolService.executeRedisCommand(
        'get',
        fullKey
      );
      if (redisValue) {
        this.cacheStats.hits++;
        const parsed = JSON.parse(redisValue);

        // Store in memory cache for faster subsequent access
        this.memoryCache.set(fullKey, {
          data: parsed.data,
          timestamp: Date.now(),
          ttl: parsed.ttl || this.config.defaultTtl,
        });

        return parsed.data;
      }

      // Try memory cache
      const memoryEntry = this.memoryCache.get(fullKey);
      if (memoryEntry && !this.isExpired(memoryEntry)) {
        this.cacheStats.hits++;
        return memoryEntry.data;
      }

      this.cacheStats.misses++;
      return null;
    } catch (error) {
      logger.error('Cache get error', { key, error });

      // Fallback to memory cache only
      const memoryEntry = this.memoryCache.get(fullKey);
      if (memoryEntry && !this.isExpired(memoryEntry)) {
        this.cacheStats.hits++;
        return memoryEntry.data;
      }

      this.cacheStats.misses++;
      return null;
    }
  }

  /**
   * Set value in cache (both Redis and memory)
   */
  public async set<T = any>(
    key: string,
    value: T,
    ttl: number = this.config.defaultTtl
  ): Promise<void> {
    const fullKey = this.config.keyPrefix + key;
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      ttl,
    };

    try {
      // Store in Redis
      const serialized = JSON.stringify(entry);
      await connectionPoolService.executeRedisCommand(
        'setex',
        fullKey,
        ttl,
        serialized
      );

      // Store in memory cache
      this.memoryCache.set(fullKey, entry);
      this.cacheStats.sets++;

      logger.debug('Cache set', { key, ttl, size: serialized.length });
    } catch (error) {
      logger.error('Cache set error', { key, error });

      // Fallback to memory cache only
      this.memoryCache.set(fullKey, entry);
      this.cacheStats.sets++;
    }
  }

  /**
   * Delete value from cache
   */
  public async delete(key: string): Promise<void> {
    const fullKey = this.config.keyPrefix + key;

    try {
      // Delete from Redis
      await connectionPoolService.executeRedisCommand('del', fullKey);

      // Delete from memory cache
      this.memoryCache.delete(fullKey);
      this.cacheStats.deletes++;

      logger.debug('Cache delete', { key });
    } catch (error) {
      logger.error('Cache delete error', { key, error });

      // Fallback to memory cache only
      this.memoryCache.delete(fullKey);
      this.cacheStats.deletes++;
    }
  }

  /**
   * Get multiple values from cache
   */
  public async getMultiple<T = any>(
    keys: string[]
  ): Promise<Record<string, T | null>> {
    const result: Record<string, T | null> = {};

    // Use pipeline for Redis operations
    try {
      const fullKeys = keys.map(key => this.config.keyPrefix + key);
      const redisValues = await connectionPoolService.executeRedisCommand(
        'mget',
        ...fullKeys
      );

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const redisValue = redisValues[i];

        if (redisValue) {
          const parsed = JSON.parse(redisValue);
          result[key] = parsed.data;
          this.cacheStats.hits++;
        } else {
          // Try memory cache
          const memoryEntry = this.memoryCache.get(fullKeys[i]);
          if (memoryEntry && !this.isExpired(memoryEntry)) {
            result[key] = memoryEntry.data;
            this.cacheStats.hits++;
          } else {
            result[key] = null;
            this.cacheStats.misses++;
          }
        }
      }
    } catch (error) {
      logger.error('Cache getMultiple error', { keys, error });

      // Fallback to memory cache
      for (const key of keys) {
        const fullKey = this.config.keyPrefix + key;
        const memoryEntry = this.memoryCache.get(fullKey);
        if (memoryEntry && !this.isExpired(memoryEntry)) {
          result[key] = memoryEntry.data;
          this.cacheStats.hits++;
        } else {
          result[key] = null;
          this.cacheStats.misses++;
        }
      }
    }

    return result;
  }

  /**
   * Set multiple values in cache
   */
  public async setMultiple<T = any>(
    entries: Record<string, T>,
    ttl: number = this.config.defaultTtl
  ): Promise<void> {
    const pipeline: Array<[string, string, number]> = [];

    for (const [key, value] of Object.entries(entries)) {
      const fullKey = this.config.keyPrefix + key;
      const entry: CacheEntry<T> = {
        data: value,
        timestamp: Date.now(),
        ttl,
      };

      const serialized = JSON.stringify(entry);
      pipeline.push([fullKey, serialized, ttl]);

      // Store in memory cache
      this.memoryCache.set(fullKey, entry);
    }

    try {
      // Use Redis pipeline for batch operations
      const redis = connectionPoolService.getRedisConnection();
      const pipe = redis.pipeline();

      for (const [key, value, ttlValue] of pipeline) {
        pipe.setex(key, ttlValue, value);
      }

      await pipe.exec();
      this.cacheStats.sets += pipeline.length;

      logger.debug('Cache setMultiple', { count: pipeline.length, ttl });
    } catch (error) {
      logger.error('Cache setMultiple error', {
        count: pipeline.length,
        error,
      });
      this.cacheStats.sets += pipeline.length; // Still count memory cache sets
    }
  }

  /**
   * Cache file metadata with optimized key structure
   */
  public async cacheFileMetadata(metadata: FileMetadata): Promise<void> {
    const promises = [
      // Cache by file ID
      this.set(`file:${metadata.id}`, metadata, 3600),

      // Cache by entity for quick lookups
      this.set(
        `entity:${metadata.entityType}:${metadata.entityId}:${metadata.id}`,
        metadata,
        1800
      ),

      // Cache file list for entity
      this.addToEntityFileList(
        metadata.entityType,
        metadata.entityId,
        metadata.id
      ),
    ];

    await Promise.all(promises);
  }

  /**
   * Get cached file metadata
   */
  public async getCachedFileMetadata(
    fileId: string
  ): Promise<FileMetadata | null> {
    return this.get<FileMetadata>(`file:${fileId}`);
  }

  /**
   * Get cached files for entity
   */
  public async getCachedEntityFiles(
    entityType: string,
    entityId: string
  ): Promise<string[]> {
    const fileIds = await this.get<string[]>(
      `entity_files:${entityType}:${entityId}`
    );
    return fileIds || [];
  }

  /**
   * Add file ID to entity file list
   */
  private async addToEntityFileList(
    entityType: string,
    entityId: string,
    fileId: string
  ): Promise<void> {
    const key = `entity_files:${entityType}:${entityId}`;
    const existingIds = (await this.get<string[]>(key)) || [];

    if (!existingIds.includes(fileId)) {
      existingIds.push(fileId);
      await this.set(key, existingIds, 1800); // 30 minutes
    }
  }

  /**
   * Invalidate cache for entity
   */
  public async invalidateEntityCache(
    entityType: string,
    entityId: string
  ): Promise<void> {
    const fileIds = await this.getCachedEntityFiles(entityType, entityId);

    const deletePromises = [
      this.delete(`entity_files:${entityType}:${entityId}`),
      ...fileIds.map(fileId => this.delete(`file:${fileId}`)),
      ...fileIds.map(fileId =>
        this.delete(`entity:${entityType}:${entityId}:${fileId}`)
      ),
    ];

    await Promise.all(deletePromises);
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): typeof this.cacheStats & {
    memoryUsage: number;
    memoryCacheSize: number;
    hitRate: number;
  } {
    const total = this.cacheStats.hits + this.cacheStats.misses;
    const hitRate = total > 0 ? (this.cacheStats.hits / total) * 100 : 0;

    return {
      ...this.cacheStats,
      memoryUsage: this.getMemoryUsage(),
      memoryCacheSize: this.memoryCache.size,
      hitRate: Math.round(hitRate * 100) / 100,
    };
  }

  /**
   * Clear all cache
   */
  public async clear(): Promise<void> {
    try {
      // Clear Redis cache with pattern
      const redis = connectionPoolService.getRedisConnection();
      const keys = await redis.keys(this.config.keyPrefix + '*');

      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      logger.error('Failed to clear Redis cache', error);
    }

    // Clear memory cache
    this.memoryCache.clear();

    // Reset stats
    this.cacheStats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0,
    };

    logger.info('Cache cleared');
  }

  /**
   * Check if cache entry is expired
   */
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl * 1000;
  }

  /**
   * Clean up expired entries from memory cache
   */
  private cleanupExpiredEntries(): void {
    let cleaned = 0;

    for (const [key, entry] of this.memoryCache.entries()) {
      if (this.isExpired(entry)) {
        this.memoryCache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.cacheStats.evictions += cleaned;
      logger.debug('Cleaned up expired cache entries', { count: cleaned });
    }
  }

  /**
   * Enforce memory usage limits
   */
  private enforceMemoryLimit(): void {
    const currentUsage = this.getMemoryUsage();

    if (currentUsage > this.config.maxMemoryUsage) {
      const entries = Array.from(this.memoryCache.entries());

      // Sort by timestamp (oldest first)
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

      // Remove oldest entries until under limit
      let removed = 0;
      for (const [key] of entries) {
        this.memoryCache.delete(key);
        removed++;

        if (this.getMemoryUsage() <= this.config.maxMemoryUsage * 0.8) {
          break;
        }
      }

      this.cacheStats.evictions += removed;
      logger.info('Enforced memory limit', {
        removed,
        currentUsage: this.getMemoryUsage(),
        maxUsage: this.config.maxMemoryUsage,
      });
    }
  }

  /**
   * Estimate memory usage of cache
   */
  private getMemoryUsage(): number {
    let usage = 0;

    for (const [key, entry] of this.memoryCache.entries()) {
      usage += key.length * 2; // UTF-16 characters
      usage += JSON.stringify(entry).length * 2;
    }

    return usage;
  }
}

// Export singleton instance
export const cacheService = CacheService.getInstance();
