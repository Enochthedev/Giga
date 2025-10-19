import { ValidationResult } from '@/types';
import { z } from 'zod';

/**
 * Utility functions for data validation
 */

export const validateSchema = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult => {
  try {
    schema.parse(data);
    return {
      isValid: true,
      errors: [],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors: import('../types').ValidationError[] =
        error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
          value: err.path.length > 0 ? getNestedValue(data, err.path) : data,
        }));

      return {
        isValid: false,
        errors: validationErrors,
      };
    }

    return {
      isValid: false,
      errors: [
        {
          field: 'unknown',
          message: 'Validation failed with unknown error',
          code: 'unknown_error',
          value: data,
        },
      ],
    };
  }
};

export const getNestedValue = (obj: any, path: (string | number)[]): any => {
  return path.reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

// Common validation schemas
export const dateRangeSchema = z
  .object({
    start: z.date(),
    end: z.date(),
  })
  .refine(data => data.start < data.end, {
    message: 'Start date must be before end date',
    path: ['end'],
  });

export const paginationSchema = z.object({
  limit: z.number().min(1).max(100).optional().default(20),
  offset: z.number().min(0).optional().default(0),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const addressSchema = z.object({
  street: z.string().min(1).max(255),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  country: z.string().min(2).max(3), // ISO country codes
  postalCode: z.string().min(1).max(20),
  region: z.string().max(100).optional(),
});

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

export const emailSchema = z.string().email('Invalid email format');

export const currencySchema = z
  .string()
  .length(3, 'Currency must be a 3-letter ISO code');

export const priceSchema = z.number().min(0, 'Price must be non-negative');

// Validation helpers
export const isValidDate = (date: any): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const isValidDateString = (dateString: string): boolean => {
  const date = new Date(dateString);
  return isValidDate(date);
};

export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const normalizePhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

// Date validation helpers
export const isDateInFuture = (date: Date): boolean => {
  return date > new Date();
};

export const isDateInPast = (date: Date): boolean => {
  return date < new Date();
};

export const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
  return date >= start && date <= end;
};

export const getDaysBetween = (start: Date, end: Date): number => {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const formatDateForDB = (date: Date): string => {
  return date.toISOString();
};

export const parseDBDate = (dateString: string): Date => {
  return new Date(dateString);
};
