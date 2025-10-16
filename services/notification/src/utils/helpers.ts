/**
 * Helper utilities for notification service
 */

import { v4 as uuidv4 } from 'uuid';
import { NotificationChannel, NotificationPriority } from '../types';

/**
 * Generate a unique notification ID
 */
export const generateNotificationId = (): string => {
  return uuidv4();
};

/**
 * Generate a unique message ID for providers
 */
export const generateMessageId = (prefix?: string): string => {
  const id = uuidv4();
  return prefix ? `${prefix}_${id}` : id;
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Format phone number to E.164 format
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Add + if not present
  if (!cleaned.startsWith('+')) {
    return `+${cleaned}`;
  }

  return cleaned;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (E.164)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

/**
 * Get priority weight for queue ordering
 */
export const getPriorityWeight = (priority: NotificationPriority): number => {
  switch (priority) {
    case NotificationPriority.URGENT:
      return 1;
    case NotificationPriority.HIGH:
      return 2;
    case NotificationPriority.NORMAL:
      return 3;
    case NotificationPriority.LOW:
      return 4;
    default:
      return 3;
  }
};

/**
 * Get channel display name
 */
export const getChannelDisplayName = (channel: NotificationChannel): string => {
  switch (channel) {
    case NotificationChannel.EMAIL:
      return 'Email';
    case NotificationChannel.SMS:
      return 'SMS';
    case NotificationChannel.PUSH:
      return 'Push Notification';
    case NotificationChannel.IN_APP:
      return 'In-App Notification';
    default:
      return 'Unknown';
  }
};

/**
 * Calculate estimated delivery time based on priority and channel
 */
export const calculateEstimatedDelivery = (
  priority: NotificationPriority,
  channel: NotificationChannel
): Date => {
  const now = new Date();
  let delayMinutes = 0;

  // Base delay by priority
  switch (priority) {
    case NotificationPriority.URGENT:
      delayMinutes = 0;
      break;
    case NotificationPriority.HIGH:
      delayMinutes = 1;
      break;
    case NotificationPriority.NORMAL:
      delayMinutes = 5;
      break;
    case NotificationPriority.LOW:
      delayMinutes = 15;
      break;
  }

  // Additional delay by channel
  switch (channel) {
    case NotificationChannel.EMAIL:
      delayMinutes += 2;
      break;
    case NotificationChannel.SMS:
      delayMinutes += 1;
      break;
    case NotificationChannel.PUSH:
      delayMinutes += 0;
      break;
    case NotificationChannel.IN_APP:
      delayMinutes += 0;
      break;
  }

  return new Date(now.getTime() + delayMinutes * 60 * 1000);
};

/**
 * Truncate text to specified length with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Convert object to query string
 */
export const objectToQueryString = (obj: Record<string, any>): string => {
  const params = new URLSearchParams();

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.append(key, String(value));
    }
  });

  return params.toString();
};

/**
 * Deep clone an object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Sleep for specified milliseconds
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      await sleep(delay);
    }
  }

  throw lastError!;
};
