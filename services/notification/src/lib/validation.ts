/**
 * Validation utilities for notification service
 */

import Joi from 'joi';
import {
  NotificationCategory,
  NotificationChannel,
  NotificationPriority,
} from '../types';

// Common validation schemas
export const emailSchema = Joi.string().email().required();
export const phoneSchema = Joi.string()
  .pattern(/^\+[1-9]\d{1,14}$/)
  .required();
export const uuidSchema = Joi.string().uuid().required();

// Notification request validation schema
export const notificationRequestSchema = Joi.object({
  userId: Joi.string().optional(),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  deviceTokens: Joi.array().items(Joi.string()).optional(),

  templateId: uuidSchema.optional(),
  subject: Joi.string().max(200).optional(),
  content: Joi.object({
    subject: Joi.string().max(200).optional(),
    htmlBody: Joi.string().optional(),
    textBody: Joi.string().optional(),
    smsBody: Joi.string().max(1600).optional(),
    pushTitle: Joi.string().max(100).optional(),
    pushBody: Joi.string().max(500).optional(),
    inAppTitle: Joi.string().max(100).optional(),
    inAppBody: Joi.string().max(500).optional(),
    actionUrl: Joi.string().uri().optional(),
    imageUrl: Joi.string().uri().optional(),
  }).required(),

  variables: Joi.object().optional(),

  channels: Joi.array()
    .items(Joi.string().valid(...Object.values(NotificationChannel)))
    .min(1)
    .required(),

  priority: Joi.string()
    .valid(...Object.values(NotificationPriority))
    .required(),

  category: Joi.string()
    .valid(...Object.values(NotificationCategory))
    .required(),

  sendAt: Joi.date().optional(),
  timezone: Joi.string().optional(),

  trackingEnabled: Joi.boolean().optional(),
  metadata: Joi.object().optional(),
  tags: Joi.array().items(Joi.string()).optional(),

  fromService: Joi.string().required(),
  fromUserId: Joi.string().optional(),
});

// Template validation schema
export const templateSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).optional(),
  category: Joi.string()
    .valid(...Object.values(NotificationCategory))
    .required(),
  channels: Joi.array()
    .items(Joi.string().valid(...Object.values(NotificationChannel)))
    .min(1)
    .required(),
  content: Joi.object().required(),
  requiredVariables: Joi.array().items(Joi.string()).optional(),
  optionalVariables: Joi.array().items(Joi.string()).optional(),
  variableSchema: Joi.object().optional(),
  languages: Joi.array().items(Joi.string()).optional(),
  defaultLanguage: Joi.string().optional(),
});

// User preferences validation schema
export const userPreferencesSchema = Joi.object({
  channels: Joi.object({
    email: Joi.object({
      enabled: Joi.boolean().required(),
      optedOutAt: Joi.date().optional(),
      optedOutReason: Joi.string().optional(),
    }).optional(),
    sms: Joi.object({
      enabled: Joi.boolean().required(),
      optedOutAt: Joi.date().optional(),
      optedOutReason: Joi.string().optional(),
    }).optional(),
    push: Joi.object({
      enabled: Joi.boolean().required(),
      optedOutAt: Joi.date().optional(),
      optedOutReason: Joi.string().optional(),
    }).optional(),
    inApp: Joi.object({
      enabled: Joi.boolean().required(),
      optedOutAt: Joi.date().optional(),
      optedOutReason: Joi.string().optional(),
    }).optional(),
  }).optional(),

  categories: Joi.object().optional(),
  globalOptOut: Joi.boolean().optional(),

  quietHours: Joi.object({
    start: Joi.string()
      .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .required(),
    end: Joi.string()
      .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .required(),
    timezone: Joi.string().required(),
    enabled: Joi.boolean().required(),
  }).optional(),

  maxDailyNotifications: Joi.number().integer().min(0).optional(),
  maxWeeklyNotifications: Joi.number().integer().min(0).optional(),
});

// Validation helper functions
export const validateNotificationRequest = (data: unknown) => {
  return notificationRequestSchema.validate(data, { abortEarly: false });
};

export const validateTemplate = (data: unknown) => {
  return templateSchema.validate(data, { abortEarly: false });
};

export const validateUserPreferences = (data: unknown) => {
  return userPreferencesSchema.validate(data, { abortEarly: false });
};

export const validateEmail = (email: string): boolean => {
  const { error } = emailSchema.validate(email);
  return !error;
};

export const validatePhone = (phone: string): boolean => {
  const { error } = phoneSchema.validate(phone);
  return !error;
};

export const validateUuid = (uuid: string): boolean => {
  const { error } = uuidSchema.validate(uuid);
  return !error;
};
