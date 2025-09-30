import { Role, User, UserRole } from '../generated/prisma-client';
import { logger } from './logger.service';
import { metricsService } from './metrics.service';
import { redisService } from './redis.service';

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
  compress?: boolean;
}

interface UserCacheData {
  user: User;
  roles: (UserRole & { role: Role })[];
  profiles: {
    customer?: any;
    vendor?: any;
    driver?: any;
    host?: any;
    advertiser?: any;
  };
  lastCached: number;
}

class CacheService {
  private readonly DEFAULT_TTL = 3600; // 1 hour
  private readonly USER_PROFILE_TTL = 1800; // 30 minutes
  private readonly ROLE_TTL = 7200; // 2 hours
  private readonly SESSION_TTL = 86400; // 24 hours

  // User profile caching
  async cacheUserProfile(userId: string, userData: UserCacheData, options?: CacheOptions): Promise<void> {
    const key = this.getUserCacheKey(userId);
    const ttl = options?.ttl || this.USER_PROFILE_TTL;

    try {
      const cacheData = {
        ...userData,
        lastCached: Date.now()
      };

      await redisService.set(key, JSON.stringify(cacheData), ttl);

      logger.debug('User profile cached', {
        userId,
        ttl,
        profileTypes: Object.keys(userData.profiles)
      });

      metricsService.recordCacheOperation('SET', 'user_profile', true);
    } catch (error) {
      logger.error('Failed to cache user profile', error as Error, { userId });
      metricsService.recordCacheOperation('SET', 'user_profile', false);
    }
  }

  async getCachedUserProfile(_userId: string): Promise<UserCacheData | null> {
    const _key = this.getUserCacheKey(userId);

    try {
      const cached = await redisService.get(key);
      if (!cached) {
        metricsService.recordCacheOperation('GET', 'user_profile', false);
        return null;
      }

      const userData = JSON.parse(cached) as UserCacheData;

      // Check if cache is still fresh (additional validation)
      const cacheAge = Date.now() - userData.lastCached;
      if (cacheAge > this.USER_PROFILE_TTL * 1000) {
        await this.invalidateUserCache(userId);
        metricsService.recordCacheOperation('GET', 'user_profile', false);
        return null;
      }

      logger.debug('User profile cache hit', {
        userId,
        cacheAge: Math.round(cacheAge / 1000)
      });

      metricsService.recordCacheOperation('GET', 'user_profile', true);
      return userData;
    } catch (error) {
      logger.error('Failed to get cached user profile', error as Error, { userId });
      metricsService.recordCacheOperation('GET', 'user_profile', false);
      return null;
    }
  }

  async invalidateUserCache(_userId: string): Promise<void> {
    const _key = this.getUserCacheKey(userId);

    try {
      await redisService.del(key);
      logger.debug('User cache invalidated', { userId });
    } catch (error) {
      logger.error('Failed to invalidate user cache', error as Error, { userId });
    }
  }

  // Role-based caching
  async cacheUserRoles(_userId: string, roles: (UserRole & { role: Role })[], options?: CacheOptions): Promise<void> {
    const _key = this.getUserRolesKey(userId);
    const ttl = options?.ttl || this.ROLE_TTL;

    try {
      const cacheData = {
        roles,
        lastCached: Date.now()
      };

      await redisService.set(key, JSON.stringify(cacheData), ttl);

      logger.debug('User roles cached', {
        userId,
        roleCount: roles.length,
        ttl
      });

      metricsService.recordCacheOperation('SET', 'user_roles', true);
    } catch (error) {
      logger.error('Failed to cache user roles', error as Error, { userId });
      metricsService.recordCacheOperation('SET', 'user_roles', false);
    }
  }

  async getCachedUserRoles(_userId: string): Promise<(UserRole & { role: Role })[] | null> {
    const _key = this.getUserRolesKey(userId);

    try {
      const cached = await redisService.get(key);
      if (!cached) {
        metricsService.recordCacheOperation('GET', 'user_roles', false);
        return null;
      }

      const data = JSON.parse(cached);

      logger.debug('User roles cache hit', {
        userId,
        roleCount: data.roles.length
      });

      metricsService.recordCacheOperation('GET', 'user_roles', true);
      return data.roles;
    } catch (error) {
      logger.error('Failed to get cached user roles', error as Error, { userId });
      metricsService.recordCacheOperation('GET', 'user_roles', false);
      return null;
    }
  }

  // Frequently accessed data caching
  async cacheFrequentData(key: string, data: any, ttl?: number): Promise<void> {
    const cacheKey = `frequent:${key}`;
    const cacheTtl = ttl || this.DEFAULT_TTL;

    try {
      await redisService.set(cacheKey, JSON.stringify(data), cacheTtl);
      metricsService.recordCacheOperation('SET', 'frequent_data', true);
    } catch (error) {
      logger.error('Failed to cache frequent data', error as Error, { key });
      metricsService.recordCacheOperation('SET', 'frequent_data', false);
    }
  }

  async getFrequentData(key: string): Promise<any | null> {
    const cacheKey = `frequent:${key}`;

    try {
      const cached = await redisService.get(cacheKey);
      if (!cached) {
        metricsService.recordCacheOperation('GET', 'frequent_data', false);
        return null;
      }

      metricsService.recordCacheOperation('GET', 'frequent_data', true);
      return JSON.parse(cached);
    } catch (error) {
      logger.error('Failed to get frequent data', error as Error, { key });
      metricsService.recordCacheOperation('GET', 'frequent_data', false);
      return null;
    }
  }

  // Cache warming for frequently accessed data
  async warmCache(_userId: string, userData: UserCacheData): Promise<void> {
    try {
      // Cache user profile
      await this.cacheUserProfile(userId, userData);

      // Cache user roles separately for faster role checks
      await this.cacheUserRoles(userId, userData.roles);

      // Cache individual profile types for faster access
      for (const [profileType, profileData] of Object.entries(userData.profiles)) {
        if (profileData) {
          const profileKey = `profile:${profileType}:${userId}`;
          await this.cacheFrequentData(profileKey, profileData, this.USER_PROFILE_TTL);
        }
      }

      logger.debug('Cache warmed for user', {
        userId,
        profileTypes: Object.keys(userData.profiles)
      });
    } catch (error) {
      logger.error('Failed to warm cache', error as Error, { userId });
    }
  }

  // Batch cache operations
  async batchInvalidateUsers(userIds: string[]): Promise<void> {
    try {
      const keys = userIds.flatMap(userId => [
        this.getUserCacheKey(userId),
        this.getUserRolesKey(userId)
      ]);

      if (keys.length > 0) {
        await Promise.all(keys.map(key => redisService.del(key)));
        logger.debug('Batch invalidated user caches', { count: userIds.length });
      }
    } catch (error) {
      logger.error('Failed to batch invalidate user caches', error as Error, { userIds });
    }
  }

  // Cache statistics and monitoring
  async getCacheStats(): Promise<{
    hitRate: number;
    totalOperations: number;
    cacheSize: number;
  }> {
    try {
      // Get cache keys count
      const userKeys = await redisService.keys('user:*');
      const roleKeys = await redisService.keys('roles:*');
      const frequentKeys = await redisService.keys('frequent:*');

      const cacheSize = userKeys.length + roleKeys.length + frequentKeys.length;

      // Get metrics from metrics service
      const metrics = metricsService.getRedisMetrics();

      return {
        hitRate: metrics.cacheHitRate,
        totalOperations: metrics.operationCount,
        cacheSize
      };
    } catch (error) {
      logger.error('Failed to get cache stats', error as Error);
      return {
        hitRate: 0,
        totalOperations: 0,
        cacheSize: 0
      };
    }
  }

  // Cache cleanup and maintenance
  async cleanupExpiredCache(): Promise<void> {
    try {
      // This is handled by Redis TTL, but we can add custom cleanup logic
      const expiredKeys = await redisService.keys('*:expired:*');
      if (expiredKeys.length > 0) {
        await Promise.all(expiredKeys.map(key => redisService.del(key)));
        logger.info('Cleaned up expired cache entries', { count: expiredKeys.length });
      }
    } catch (error) {
      logger.error('Failed to cleanup expired cache', error as Error);
    }
  }

  // Helper methods for cache key generation
  private getUserCacheKey(_userId: string): string {
    return `user:${userId}`;
  }

  private getUserRolesKey(_userId: string): string {
    return `roles:${userId}`;
  }

  // Advanced caching strategies
  async cacheWithTags(key: string, data: any, ttl: number, tags: string[]): Promise<void> {
    try {
      // Store the main data
      await redisService.set(key, JSON.stringify(data), ttl);

      // Store tag associations for cache invalidation
      for (const tag of tags) {
        const tagKey = `tag:${tag}`;
        const taggedKeys = await redisService.get(tagKey);
        const keys = taggedKeys ? JSON.parse(taggedKeys) : [];

        if (!keys.includes(key)) {
          keys.push(key);
          await redisService.set(tagKey, JSON.stringify(keys), ttl + 300); // Tags live slightly longer
        }
      }

      logger.debug('Data cached with tags', { key, tags, ttl });
    } catch (error) {
      logger.error('Failed to cache with tags', error as Error, { key, tags });
    }
  }

  async invalidateByTag(tag: string): Promise<void> {
    try {
      const tagKey = `tag:${tag}`;
      const taggedKeys = await redisService.get(tagKey);

      if (taggedKeys) {
        const keys = JSON.parse(taggedKeys);
        await Promise.all([
          ...keys.map((key: string) => redisService.del(key)),
          redisService.del(tagKey)
        ]);

        logger.debug('Cache invalidated by tag', { tag, keysInvalidated: keys.length });
      }
    } catch (error) {
      logger.error('Failed to invalidate cache by tag', error as Error, { tag });
    }
  }

  // Cache invalidation patterns
  async invalidateUserRelatedCache(_userId: string): Promise<void> {
    try {
      await Promise.all([
        this.invalidateUserCache(userId),
        redisService.del(this.getUserRolesKey(userId)),
        redisService.deletePattern(`profile:*:${userId}`),
        redisService.deletePattern(`session:${userId}*`),
        this.invalidateByTag(`user:${userId}`)
      ]);

      logger.debug('Invalidated all user-related cache', { userId });
    } catch (error) {
      logger.error('Failed to invalidate user-related cache', error as Error, { userId });
    }
  }

  // Performance monitoring
  async monitorCachePerformance(): Promise<{
    avgResponseTime: number;
    hitRate: number;
    memoryUsage: number;
  }> {
    try {
      const _stats = await this.getCacheStats();

      // Get Redis memory info (if available)
      const client = await redisService.connect();
      const info = await client.info('memory');
      const memoryMatch = info.match(/used_memory:(\d+)/);
      const memoryUsage = memoryMatch ? parseInt(memoryMatch[1]) : 0;

      const redisMetrics = metricsService.getRedisMetrics();

      return {
        avgResponseTime: redisMetrics.averageOperationTime,
        hitRate: stats.hitRate,
        memoryUsage
      };
    } catch (error) {
      logger.error('Failed to monitor cache performance', error as Error);
      return {
        avgResponseTime: 0,
        hitRate: 0,
        memoryUsage: 0
      };
    }
  }

  // Cache preloading for frequently accessed data
  async preloadFrequentData(): Promise<void> {
    try {
      logger.info('Starting cache preload for frequent data');

      // Preload active user roles
      const activeUsers = await this.getActiveUserIds();
      const preloadPromises = activeUsers.slice(0, 100).map(async (userId) => {
        try {
          // This would typically fetch from database and cache
          // For now, we'll just warm the cache keys
          await this.cacheFrequentData(`user_active:${userId}`, { active: true }, 3600);
        } catch (error) {
          logger.warn('Failed to preload user data', { userId, error: (error as Error).message });
        }
      });

      await Promise.all(preloadPromises);
      logger.info('Cache preload completed', { usersPreloaded: activeUsers.length });
    } catch (error) {
      logger.error('Cache preload failed', error as Error);
    }
  }

  // Get list of active user IDs (placeholder implementation)
  private async getActiveUserIds(): Promise<string[]> {
    try {
      // In a real implementation, this would query the database
      // For now, return empty array
      return [];
    } catch (error) {
      logger.error('Failed to get active user IDs', error as Error);
      return [];
    }
  }

  // Cache compression for large objects
  async cacheCompressed(key: string, data: any, ttl: number): Promise<void> {
    try {
      const jsonString = JSON.stringify(data);

      // Only compress if data is large enough
      if (jsonString.length > 1024) {
        const zlib = require('zlib');
        const compressed = zlib.gzipSync(jsonString);
        await redisService.set(`${key}:compressed`, compressed.toString('base64'), ttl);
        await redisService.set(`${key}:meta`, JSON.stringify({ compressed: true, originalSize: jsonString.length }), ttl);

        logger.debug('Data cached with compression', {
          key,
          originalSize: jsonString.length,
          compressedSize: compressed.length,
          compressionRatio: (1 - compressed.length / jsonString.length) * 100
        });
      } else {
        await redisService.set(key, jsonString, ttl);
        await redisService.set(`${key}:meta`, JSON.stringify({ compressed: false }), ttl);
      }
    } catch (error) {
      logger.error('Failed to cache compressed data', error as Error, { key });
    }
  }

  async getCachedCompressed(key: string): Promise<unknown | null> {
    try {
      const meta = await redisService.get(`${key}:meta`);
      if (!meta) return null;

      const metadata = JSON.parse(meta);

      if (metadata.compressed) {
        const compressedData = await redisService.get(`${key}:compressed`);
        if (!compressedData) return null;

        const zlib = require('zlib');
        const buffer = Buffer.from(compressedData, 'base64');
        const decompressed = zlib.gunzipSync(buffer);
        return JSON.parse(decompressed.toString());
      } else {
        const data = await redisService.get(key);
        return data ? JSON.parse(data) : null;
      }
    } catch (error) {
      logger.error('Failed to get cached compressed data', error as Error, { key });
      return null;
    }
  }
}

export const cacheService = new CacheService();
export { CacheService };
