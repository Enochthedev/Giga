import { z } from 'zod';

// Role definitions
export enum RoleName {
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  DRIVER = 'DRIVER',
  HOST = 'HOST',
  ADVERTISER = 'ADVERTISER',
  ADMIN = 'ADMIN',
}

export const RoleSchema = z.object({
  id: z.string(),
  name: z.nativeEnum(RoleName),
  permissions: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Role = z.infer<typeof RoleSchema>;

// User schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  avatar: z.string().url().optional(),
  roles: z.array(z.nativeEnum(RoleName)),
  activeRole: z.nativeEnum(RoleName),
  isEmailVerified: z.boolean().default(false),
  isPhoneVerified: z.boolean().default(false),
  isActive: z.boolean().default(true),
  lastLoginAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

// Profile schemas for different roles
export const CustomerProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  preferences: z.record(z.any()).optional(),
  addresses: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      address: z.string(),
      city: z.string(),
      country: z.string(),
      isDefault: z.boolean(),
    })
  ),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const VendorProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  businessName: z.string(),
  businessType: z.string(),
  description: z.string().optional(),
  logo: z.string().url().optional(),
  website: z.string().url().optional(),
  subscriptionTier: z.enum(['basic', 'pro', 'enterprise']).default('basic'),
  commissionRate: z.number().min(0).max(1),
  isVerified: z.boolean().default(false),
  rating: z.number().min(0).max(5).optional(),
  totalSales: z.number().default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const DriverProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  licenseNumber: z.string(),
  vehicleInfo: z.object({
    make: z.string(),
    model: z.string(),
    year: z.number(),
    color: z.string(),
    plateNumber: z.string(),
  }),
  isOnline: z.boolean().default(false),
  currentLocation: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
  rating: z.number().min(0).max(5).optional(),
  totalRides: z.number().default(0),
  isVerified: z.boolean().default(false),
  subscriptionTier: z.enum(['basic', 'pro']).default('basic'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const HostProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  businessName: z.string().optional(),
  description: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  totalBookings: z.number().default(0),
  isVerified: z.boolean().default(false),
  subscriptionTier: z.enum(['basic', 'pro']).default('basic'),
  responseRate: z.number().min(0).max(1).optional(),
  responseTime: z.number().optional(), // in minutes
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const AdvertiserProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  companyName: z.string(),
  industry: z.string(),
  website: z.string().url().optional(),
  totalSpend: z.number().default(0),
  isVerified: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CustomerProfile = z.infer<typeof CustomerProfileSchema>;
export type VendorProfile = z.infer<typeof VendorProfileSchema>;
export type DriverProfile = z.infer<typeof DriverProfileSchema>;
export type HostProfile = z.infer<typeof HostProfileSchema>;
export type AdvertiserProfile = z.infer<typeof AdvertiserProfileSchema>;
