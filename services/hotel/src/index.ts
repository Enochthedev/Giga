/**
 * Hotel Service Entry Point
 *
 * This file serves as the main entry point for the Hotel Service.
 * It exports the main application and key components for external use.
 */

export { default as app } from './app';
export { default as config } from './config';
export { default as prisma } from './lib/prisma';
export { redisClient } from './lib/redis';
export * from './types';
export { default as logger } from './utils/logger';

// Re-export utilities
export {
  camelToSnake,
  capitalizeFirst,
  chunk,
  clamp,
  formatCurrency,
  formatDate,
  formatDateTime,
  generateConfirmationNumber,
  generateId,
  groupBy,
  isEmpty,
  isNotEmpty,
  omit,
  parseJSON,
  pick,
  randomFloat,
  randomInt,
  retry,
  round,
  safeStringify,
  sleep,
  snakeToCamel,
  truncate,
  unique,
} from './utils';

// Version information
export const version = process.env.npm_package_version || '1.0.0';
export const serviceName = 'hotel-service';
