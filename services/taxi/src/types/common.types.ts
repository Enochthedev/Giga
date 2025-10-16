// Common types used across the taxi service

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates?: GeoLocation;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: Date;
}

export interface TimeWindow {
  start: Date;
  end: Date;
}

export interface GeoArea {
  center: GeoLocation;
  radius: number; // in meters
  polygon?: GeoLocation[]; // Alternative to radius for complex shapes
}

export interface Distance {
  meters: number;
  kilometers: number;
  miles: number;
}

export interface Duration {
  seconds: number;
  minutes: number;
  hours: number;
}

export interface EmergencyContact {
  name: string;
  phoneNumber: string;
  email?: string;
  relationship: string;
}

export interface ContactInfo {
  phoneNumber: string;
  email: string;
  preferredContactMethod: 'phone' | 'email' | 'push';
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
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

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: Date;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
  details?: Record<string, any>;
  timestamp: Date;
}

// Enums for common status values
export enum ServiceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  SUSPENDED = 'suspended',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum NotificationChannel {
  PUSH = 'push',
  SMS = 'sms',
  EMAIL = 'email',
  IN_APP = 'in_app',
}
