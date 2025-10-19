/**
 * User-related type definitions for the Auth Service
 */

export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  maritalStatus?:
    | 'SINGLE'
    | 'MARRIED'
    | 'DIVORCED'
    | 'WIDOWED'
    | 'SEPARATED'
    | 'DOMESTIC_PARTNERSHIP'
    | 'PREFER_NOT_TO_SAY';
  bodyWeight?: number; // in kg
  height?: number; // in cm
  ageGroup?:
    | 'UNDER_18'
    | 'AGE_18_24'
    | 'AGE_25_34'
    | 'AGE_35_44'
    | 'AGE_45_54'
    | 'AGE_55_64'
    | 'AGE_65_PLUS'
    | 'PREFER_NOT_TO_SAY';
  areasOfInterest?: string[];
  profilePicture?: string;
  phone?: string;
}

export interface UpdateCustomerProfileRequest {
  occupation?: string;
  company?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
    bloodType?: string;
    doctorContact?: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  preferences?: Record<string, any>;
}

export interface CreateAddressRequest {
  label: string; // Home, Work, Other
  name?: string; // Recipient name
  buildingNumber?: string;
  street: string;
  address2?: string; // Apartment, suite, etc.
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface UpdateAddressRequest {
  label?: string;
  name?: string;
  buildingNumber?: string;
  street?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  isDefault?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: string;
  maritalStatus?: string;
  bodyWeight?: number;
  height?: number;
  ageGroup?: string;
  areasOfInterest?: string[];
  profilePicture?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  customerProfile?: {
    id: string;
    occupation?: string;
    company?: string;
    emergencyContact?: any;
    medicalInfo?: any;
    socialMedia?: any;
    preferences?: any;
    addresses: AddressResponse[];
    loyaltyPoints: number;
    membershipTier: string;
    totalOrders: number;
    totalSpent: number;
  };
}

export interface AddressResponse {
  id: string;
  label: string;
  name?: string;
  buildingNumber?: string;
  street: string;
  address2?: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSearchCriteria {
  email?: string;
  name?: string;
  phone?: string;
  role?: string;
  status?: 'active' | 'inactive';
  emailVerified?: boolean;
  phoneVerified?: boolean;
  ageGroup?: string;
  gender?: string;
  maritalStatus?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  lastLoginAfter?: Date;
  lastLoginBefore?: Date;
  sortBy?:
    | 'createdAt'
    | 'updatedAt'
    | 'lastLoginAt'
    | 'email'
    | 'firstName'
    | 'lastName';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UserSearchResult {
  users: UserProfileResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: UserSearchCriteria;
}
