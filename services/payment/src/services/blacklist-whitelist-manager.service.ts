import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';
import { BlacklistEntry, WhitelistEntry } from '../types/fraud.types';
import { Transaction } from '../types/payment.types';

export interface ListManagerConfig {
  enableAutoExpiration: boolean;
  defaultExpirationDays: number;
  enableListMetrics: boolean;
  maxEntriesPerType: number;
}

export class BlacklistWhitelistManagerService {
  private prisma: PrismaClient;
  private config: ListManagerConfig;

  constructor(prisma: PrismaClient, config: ListManagerConfig) {
    this.prisma = prisma;
    this.config = config;
  }

  /**
   * Add entry to blacklist
   */
  async addToBlacklist(
    entry: Omit<BlacklistEntry, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<BlacklistEntry> {
    try {
      logger.info('Adding entry to blacklist', {
        type: entry.type,
        value: entry.value,
      });

      // Check if entry already exists
      const existingEntry = await this.prisma.blacklistEntry.findUnique({
        where: {
          type_value: {
            type: entry.type,
            value: entry.value,
          },
        },
      });

      if (existingEntry) {
        // Update existing entry
        const updatedEntry = await this.prisma.blacklistEntry.update({
          where: { id: existingEntry.id },
          data: {
            reason: entry.reason,
            isActive: entry.isActive,
            expiresAt: entry.expiresAt,
            metadata: entry.metadata || {},
          },
        });

        logger.info('Updated existing blacklist entry', {
          entryId: updatedEntry.id,
        });
        return this.mapPrismaBlacklistEntry(updatedEntry);
      }

      // Create new entry
      const createdEntry = await this.prisma.blacklistEntry.create({
        data: {
          type: entry.type,
          value: entry.value,
          reason: entry.reason,
          isActive: entry.isActive,
          expiresAt:
            entry.expiresAt ||
            (this.config.enableAutoExpiration
              ? new Date(
                  Date.now() +
                    this.config.defaultExpirationDays * 24 * 60 * 60 * 1000
                )
              : undefined),
          metadata: entry.metadata || {},
        },
      });

      logger.info('Added new blacklist entry', { entryId: createdEntry.id });
      return this.mapPrismaBlacklistEntry(createdEntry);
    } catch (error) {
      logger.error('Error adding to blacklist', {
        error: error instanceof Error ? error.message : 'Unknown error',
        type: entry.type,
        value: entry.value,
      });
      throw error;
    }
  }

  /**
   * Add entry to whitelist
   */
  async addToWhitelist(
    entry: Omit<WhitelistEntry, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<WhitelistEntry> {
    try {
      logger.info('Adding entry to whitelist', {
        type: entry.type,
        value: entry.value,
      });

      // Check if entry already exists
      const existingEntry = await this.prisma.whitelistEntry.findUnique({
        where: {
          type_value: {
            type: entry.type,
            value: entry.value,
          },
        },
      });

      if (existingEntry) {
        // Update existing entry
        const updatedEntry = await this.prisma.whitelistEntry.update({
          where: { id: existingEntry.id },
          data: {
            reason: entry.reason,
            isActive: entry.isActive,
            expiresAt: entry.expiresAt,
            metadata: entry.metadata || {},
          },
        });

        logger.info('Updated existing whitelist entry', {
          entryId: updatedEntry.id,
        });
        return this.mapPrismaWhitelistEntry(updatedEntry);
      }

      // Create new entry
      const createdEntry = await this.prisma.whitelistEntry.create({
        data: {
          type: entry.type,
          value: entry.value,
          reason: entry.reason,
          isActive: entry.isActive,
          expiresAt:
            entry.expiresAt ||
            (this.config.enableAutoExpiration
              ? new Date(
                  Date.now() +
                    this.config.defaultExpirationDays * 24 * 60 * 60 * 1000
                )
              : undefined),
          metadata: entry.metadata || {},
        },
      });

      logger.info('Added new whitelist entry', { entryId: createdEntry.id });
      return this.mapPrismaWhitelistEntry(createdEntry);
    } catch (error) {
      logger.error('Error adding to whitelist', {
        error: error instanceof Error ? error.message : 'Unknown error',
        type: entry.type,
        value: entry.value,
      });
      throw error;
    }
  }

  /**
   * Remove entry from blacklist
   */
  async removeFromBlacklist(type: string, value: string): Promise<void> {
    try {
      logger.info('Removing entry from blacklist', { type, value });

      await this.prisma.blacklistEntry.delete({
        where: {
          type_value: {
            type: type as any,
            value,
          },
        },
      });

      logger.info('Removed blacklist entry', { type, value });
    } catch (error) {
      logger.error('Error removing from blacklist', {
        error: error instanceof Error ? error.message : 'Unknown error',
        type,
        value,
      });
      throw error;
    }
  }

  /**
   * Remove entry from whitelist
   */
  async removeFromWhitelist(type: string, value: string): Promise<void> {
    try {
      logger.info('Removing entry from whitelist', { type, value });

      await this.prisma.whitelistEntry.delete({
        where: {
          type_value: {
            type: type as any,
            value,
          },
        },
      });

      logger.info('Removed whitelist entry', { type, value });
    } catch (error) {
      logger.error('Error removing from whitelist', {
        error: error instanceof Error ? error.message : 'Unknown error',
        type,
        value,
      });
      throw error;
    }
  }

  /**
   * Check if transaction matches any blacklist entries
   */
  async checkBlacklist(transaction: Transaction): Promise<{
    isBlacklisted: boolean;
    matches: Array<{ type: string; value: string; reason: string }>;
  }> {
    try {
      const matches: Array<{ type: string; value: string; reason: string }> =
        [];
      const now = new Date();

      // Prepare values to check
      const valuesToCheck = this.extractCheckableValues(transaction);

      for (const { type, value } of valuesToCheck) {
        if (!value) continue;

        const entry = await this.prisma.blacklistEntry.findFirst({
          where: {
            type: type as any,
            value,
            isActive: true,
            OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
          },
        });

        if (entry) {
          matches.push({
            type: entry.type,
            value: entry.value,
            reason: entry.reason,
          });
        }
      }

      const isBlacklisted = matches.length > 0;

      if (isBlacklisted) {
        logger.warn('Transaction matches blacklist entries', {
          transactionId: transaction.id,
          matches: matches.length,
        });
      }

      return { isBlacklisted, matches };
    } catch (error) {
      logger.error('Error checking blacklist', {
        error: error instanceof Error ? error.message : 'Unknown error',
        transactionId: transaction.id,
      });
      return { isBlacklisted: false, matches: [] };
    }
  }

  /**
   * Check if transaction matches any whitelist entries
   */
  async checkWhitelist(transaction: Transaction): Promise<{
    isWhitelisted: boolean;
    matches: Array<{ type: string; value: string; reason: string }>;
  }> {
    try {
      const matches: Array<{ type: string; value: string; reason: string }> =
        [];
      const now = new Date();

      // Prepare values to check
      const valuesToCheck = this.extractCheckableValues(transaction);

      for (const { type, value } of valuesToCheck) {
        if (!value) continue;

        const entry = await this.prisma.whitelistEntry.findFirst({
          where: {
            type: type as any,
            value,
            isActive: true,
            OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
          },
        });

        if (entry) {
          matches.push({
            type: entry.type,
            value: entry.value,
            reason: entry.reason,
          });
        }
      }

      const isWhitelisted = matches.length > 0;

      if (isWhitelisted) {
        logger.info('Transaction matches whitelist entries', {
          transactionId: transaction.id,
          matches: matches.length,
        });
      }

      return { isWhitelisted, matches };
    } catch (error) {
      logger.error('Error checking whitelist', {
        error: error instanceof Error ? error.message : 'Unknown error',
        transactionId: transaction.id,
      });
      return { isWhitelisted: false, matches: [] };
    }
  }

  /**
   * Get all blacklist entries with pagination
   */
  async getBlacklistEntries(
    options: {
      type?: string;
      isActive?: boolean;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{
    entries: BlacklistEntry[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const { type, isActive, page = 1, limit = 50 } = options;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (type) where.type = type;
      if (isActive !== undefined) where.isActive = isActive;

      const [entries, total] = await Promise.all([
        this.prisma.blacklistEntry.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.blacklistEntry.count({ where }),
      ]);

      return {
        entries: entries.map(entry => this.mapPrismaBlacklistEntry(entry)),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error('Error getting blacklist entries', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Get all whitelist entries with pagination
   */
  async getWhitelistEntries(
    options: {
      type?: string;
      isActive?: boolean;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{
    entries: WhitelistEntry[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const { type, isActive, page = 1, limit = 50 } = options;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (type) where.type = type;
      if (isActive !== undefined) where.isActive = isActive;

      const [entries, total] = await Promise.all([
        this.prisma.whitelistEntry.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.whitelistEntry.count({ where }),
      ]);

      return {
        entries: entries.map(entry => this.mapPrismaWhitelistEntry(entry)),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error('Error getting whitelist entries', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Bulk add entries to blacklist
   */
  async bulkAddToBlacklist(
    entries: Array<Omit<BlacklistEntry, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<number> {
    try {
      logger.info('Bulk adding entries to blacklist', {
        count: entries.length,
      });

      const results = await this.prisma.$transaction(
        entries.map(entry =>
          this.prisma.blacklistEntry.upsert({
            where: {
              type_value: {
                type: entry.type,
                value: entry.value,
              },
            },
            create: {
              type: entry.type,
              value: entry.value,
              reason: entry.reason,
              isActive: entry.isActive,
              expiresAt: entry.expiresAt,
              metadata: entry.metadata || {},
            },
            update: {
              reason: entry.reason,
              isActive: entry.isActive,
              expiresAt: entry.expiresAt,
              metadata: entry.metadata || {},
            },
          })
        )
      );

      logger.info('Bulk blacklist operation completed', {
        processed: results.length,
      });
      return results.length;
    } catch (error) {
      logger.error('Error bulk adding to blacklist', {
        error: error instanceof Error ? error.message : 'Unknown error',
        count: entries.length,
      });
      throw error;
    }
  }

  /**
   * Bulk add entries to whitelist
   */
  async bulkAddToWhitelist(
    entries: Array<Omit<WhitelistEntry, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<number> {
    try {
      logger.info('Bulk adding entries to whitelist', {
        count: entries.length,
      });

      const results = await this.prisma.$transaction(
        entries.map(entry =>
          this.prisma.whitelistEntry.upsert({
            where: {
              type_value: {
                type: entry.type,
                value: entry.value,
              },
            },
            create: {
              type: entry.type,
              value: entry.value,
              reason: entry.reason,
              isActive: entry.isActive,
              expiresAt: entry.expiresAt,
              metadata: entry.metadata || {},
            },
            update: {
              reason: entry.reason,
              isActive: entry.isActive,
              expiresAt: entry.expiresAt,
              metadata: entry.metadata || {},
            },
          })
        )
      );

      logger.info('Bulk whitelist operation completed', {
        processed: results.length,
      });
      return results.length;
    } catch (error) {
      logger.error('Error bulk adding to whitelist', {
        error: error instanceof Error ? error.message : 'Unknown error',
        count: entries.length,
      });
      throw error;
    }
  }

  /**
   * Clean up expired entries
   */
  async cleanupExpiredEntries(): Promise<{
    blacklistCleaned: number;
    whitelistCleaned: number;
  }> {
    try {
      logger.info('Cleaning up expired list entries');

      const now = new Date();

      const [blacklistResult, whitelistResult] = await Promise.all([
        this.prisma.blacklistEntry.deleteMany({
          where: {
            expiresAt: { lt: now },
          },
        }),
        this.prisma.whitelistEntry.deleteMany({
          where: {
            expiresAt: { lt: now },
          },
        }),
      ]);

      logger.info('Cleanup completed', {
        blacklistCleaned: blacklistResult.count,
        whitelistCleaned: whitelistResult.count,
      });

      return {
        blacklistCleaned: blacklistResult.count,
        whitelistCleaned: whitelistResult.count,
      };
    } catch (error) {
      logger.error('Error cleaning up expired entries', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Get list statistics
   */
  async getListStatistics(): Promise<{
    blacklist: { total: number; active: number; expired: number };
    whitelist: { total: number; active: number; expired: number };
  }> {
    try {
      const now = new Date();

      const [
        blacklistTotal,
        blacklistActive,
        blacklistExpired,
        whitelistTotal,
        whitelistActive,
        whitelistExpired,
      ] = await Promise.all([
        this.prisma.blacklistEntry.count(),
        this.prisma.blacklistEntry.count({ where: { isActive: true } }),
        this.prisma.blacklistEntry.count({ where: { expiresAt: { lt: now } } }),
        this.prisma.whitelistEntry.count(),
        this.prisma.whitelistEntry.count({ where: { isActive: true } }),
        this.prisma.whitelistEntry.count({ where: { expiresAt: { lt: now } } }),
      ]);

      return {
        blacklist: {
          total: blacklistTotal,
          active: blacklistActive,
          expired: blacklistExpired,
        },
        whitelist: {
          total: whitelistTotal,
          active: whitelistActive,
          expired: whitelistExpired,
        },
      };
    } catch (error) {
      logger.error('Error getting list statistics', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Auto-add to blacklist based on fraud patterns
   */
  async autoAddToBlacklist(
    type: 'USER' | 'EMAIL' | 'IP' | 'DEVICE' | 'CARD' | 'PHONE',
    value: string,
    reason: string,
    metadata?: Record<string, any>
  ): Promise<BlacklistEntry> {
    return this.addToBlacklist({
      type,
      value,
      reason: `Auto-added: ${reason}`,
      isActive: true,
      metadata: {
        ...metadata,
        autoAdded: true,
        addedAt: new Date().toISOString(),
      },
    });
  }

  /**
   * Extract checkable values from transaction
   */
  private extractCheckableValues(
    transaction: Transaction
  ): Array<{ type: string; value: string }> {
    const values: Array<{ type: string; value: string }> = [];

    // User ID
    if (transaction.userId) {
      values.push({ type: 'USER', value: transaction.userId });
    }

    // Email from metadata
    if (transaction.metadata?.email) {
      values.push({ type: 'EMAIL', value: transaction.metadata.email });
    }

    // IP Address from metadata
    if (transaction.metadata?.ipAddress) {
      values.push({ type: 'IP', value: transaction.metadata.ipAddress });
    }

    // Device fingerprint from metadata
    if (transaction.metadata?.deviceFingerprint) {
      values.push({
        type: 'DEVICE',
        value: transaction.metadata.deviceFingerprint,
      });
    }

    // Payment method (card) ID
    if (transaction.paymentMethodId) {
      values.push({ type: 'CARD', value: transaction.paymentMethodId });
    }

    // Phone from metadata
    if (transaction.metadata?.phone) {
      values.push({ type: 'PHONE', value: transaction.metadata.phone });
    }

    return values;
  }

  /**
   * Map Prisma blacklist entry to BlacklistEntry type
   */
  private mapPrismaBlacklistEntry(prismaEntry: any): BlacklistEntry {
    return {
      id: prismaEntry.id,
      type: prismaEntry.type,
      value: prismaEntry.value,
      reason: prismaEntry.reason,
      isActive: prismaEntry.isActive,
      expiresAt: prismaEntry.expiresAt,
      metadata: prismaEntry.metadata || {},
      createdAt: prismaEntry.createdAt,
      updatedAt: prismaEntry.updatedAt,
    };
  }

  /**
   * Map Prisma whitelist entry to WhitelistEntry type
   */
  private mapPrismaWhitelistEntry(prismaEntry: any): WhitelistEntry {
    return {
      id: prismaEntry.id,
      type: prismaEntry.type,
      value: prismaEntry.value,
      reason: prismaEntry.reason,
      isActive: prismaEntry.isActive,
      expiresAt: prismaEntry.expiresAt,
      metadata: prismaEntry.metadata || {},
      createdAt: prismaEntry.createdAt,
      updatedAt: prismaEntry.updatedAt,
    };
  }
}
