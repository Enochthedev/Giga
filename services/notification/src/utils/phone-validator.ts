/**
 * Phone number validation utilities
 */

import { formatPhoneNumber, isValidPhoneNumber } from './helpers';

export interface PhoneValidationResult {
  isValid: boolean;
  formatted?: string;
  country?: string;
  type?: 'mobile' | 'landline' | 'voip' | 'unknown';
  errors: string[];
}

export interface CountryCode {
  code: string;
  name: string;
  dialCode: string;
  pattern: RegExp;
}

// Common country codes and patterns (simplified for broader compatibility)
const COUNTRY_CODES: CountryCode[] = [
  {
    code: 'US',
    name: 'United States',
    dialCode: '+1',
    pattern: /^\+1\d{10}$/,
  },
  {
    code: 'CA',
    name: 'Canada',
    dialCode: '+1',
    pattern: /^\+1\d{10}$/,
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    dialCode: '+44',
    pattern: /^\+44\d{10,11}$/,
  },
  {
    code: 'DE',
    name: 'Germany',
    dialCode: '+49',
    pattern: /^\+49\d{10,12}$/,
  },
  {
    code: 'FR',
    name: 'France',
    dialCode: '+33',
    pattern: /^\+33\d{9}$/,
  },
  {
    code: 'AU',
    name: 'Australia',
    dialCode: '+61',
    pattern: /^\+61\d{9}$/,
  },
  {
    code: 'IN',
    name: 'India',
    dialCode: '+91',
    pattern: /^\+91\d{10}$/,
  },
  {
    code: 'BR',
    name: 'Brazil',
    dialCode: '+55',
    pattern: /^\+55\d{10,11}$/,
  },
  {
    code: 'MX',
    name: 'Mexico',
    dialCode: '+52',
    pattern: /^\+52\d{10}$/,
  },
  {
    code: 'JP',
    name: 'Japan',
    dialCode: '+81',
    pattern: /^\+81\d{10,11}$/,
  },
];

/**
 * Comprehensive phone number validation
 */
export const validatePhoneNumber = (
  phoneNumber: string
): PhoneValidationResult => {
  const errors: string[] = [];

  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return {
      isValid: false,
      errors: ['Phone number is required'],
    };
  }

  // Clean and format the phone number
  let formatted: string;
  try {
    formatted = formatPhoneNumber(phoneNumber.trim());
  } catch (error) {
    return {
      isValid: false,
      errors: ['Invalid phone number format'],
    };
  }

  // Basic E.164 format validation
  if (!isValidPhoneNumber(formatted)) {
    errors.push('Phone number must be in valid E.164 format');
  }

  // Check length constraints
  if (formatted.length < 8 || formatted.length > 17) {
    errors.push('Phone number length must be between 8 and 17 digits');
  }

  // Detect country and validate against country-specific patterns
  const country = detectCountry(formatted);

  // For now, we'll be more lenient with country-specific validation
  // In a production system, you might want stricter validation

  // Check for common invalid patterns
  if (hasInvalidPatterns(formatted)) {
    errors.push('Phone number contains invalid patterns');
  }

  // Determine phone type (simplified heuristic)
  const type = determinePhoneType(formatted, country);

  return {
    isValid: errors.length === 0,
    formatted: errors.length === 0 ? formatted : undefined,
    country: country?.code,
    type,
    errors,
  };
};

/**
 * Validate multiple phone numbers
 */
export const validatePhoneNumbers = (
  phoneNumbers: string[]
): PhoneValidationResult[] => {
  return phoneNumbers.map(phone => validatePhoneNumber(phone));
};

/**
 * Check if phone number is likely a mobile number
 */
export const isMobileNumber = (phoneNumber: string): boolean => {
  const validation = validatePhoneNumber(phoneNumber);
  return validation.isValid && validation.type === 'mobile';
};

/**
 * Get country information for a phone number
 */
export const getPhoneNumberCountry = (
  phoneNumber: string
): CountryCode | null => {
  try {
    const formatted = formatPhoneNumber(phoneNumber);
    return detectCountry(formatted);
  } catch (error) {
    return null;
  }
};

/**
 * Format phone number for display
 */
export const formatPhoneForDisplay = (
  phoneNumber: string,
  country?: string
): string => {
  try {
    const formatted = formatPhoneNumber(phoneNumber);
    const countryInfo = country
      ? COUNTRY_CODES.find(c => c.code === country)
      : detectCountry(formatted);

    if (!countryInfo) {
      // Default formatting with spaces for unknown countries
      const match = formatted.match(/^(\+\d{1,3})(\d{3})(\d+)$/);
      if (match) {
        return `${match[1]} ${match[2]} ${match[3]}`;
      }
      return formatted;
    }

    // Apply country-specific formatting
    switch (countryInfo.code) {
      case 'US':
      case 'CA':
        // Format as +1 (XXX) XXX-XXXX
        const usMatch = formatted.match(/^\+1(\d{3})(\d{3})(\d{4})$/);
        if (usMatch) {
          return `+1 (${usMatch[1]}) ${usMatch[2]}-${usMatch[3]}`;
        }
        break;
      case 'GB':
        // Format as +44 XXXX XXXXXX
        const gbMatch = formatted.match(/^\+44(\d{4})(\d{6,7})$/);
        if (gbMatch) {
          return `+44 ${gbMatch[1]} ${gbMatch[2]}`;
        }
        break;
      default:
        // Default formatting with spaces
        const match = formatted.match(/^(\+\d{1,3})(\d{3})(\d+)$/);
        if (match) {
          return `${match[1]} ${match[2]} ${match[3]}`;
        }
        break;
    }

    return formatted;
  } catch (error) {
    return phoneNumber;
  }
};

/**
 * Private helper functions
 */

function detectCountry(phoneNumber: string): CountryCode | null {
  for (const country of COUNTRY_CODES) {
    if (phoneNumber.startsWith(country.dialCode)) {
      return country;
    }
  }
  return null;
}

function hasInvalidPatterns(phoneNumber: string): boolean {
  // Check for obviously invalid patterns
  const invalidPatterns = [
    /^\+0/, // Cannot start with +0
    /^(\+\d)\1{6,}/, // Too many repeated digits
    /^\+1234567/, // Sequential numbers
    /^\+1111111/, // All same digits
    /^\+9999999/, // All 9s
  ];

  return invalidPatterns.some(pattern => pattern.test(phoneNumber));
}

function determinePhoneType(
  phoneNumber: string,
  country: CountryCode | null
): 'mobile' | 'landline' | 'voip' | 'unknown' {
  if (!country) {
    return 'unknown';
  }

  // Simplified heuristics for phone type detection
  // In a real implementation, you might use a more comprehensive database
  switch (country.code) {
    case 'US':
    case 'CA':
      // In North America, mobile/landline distinction is not clear from number alone
      return 'unknown';
    case 'GB':
      // UK mobile numbers typically start with 7
      if (phoneNumber.match(/^\+447/)) {
        return 'mobile';
      }
      return 'landline';
    case 'DE':
      // German mobile numbers typically start with 15, 16, 17
      if (phoneNumber.match(/^\+49(15|16|17)/)) {
        return 'mobile';
      }
      return 'landline';
    case 'IN':
      // Indian mobile numbers start with 6, 7, 8, 9
      if (phoneNumber.match(/^\+91[6-9]/)) {
        return 'mobile';
      }
      return 'landline';
    default:
      return 'unknown';
  }
}

/**
 * Sanitize phone number input
 */
export const sanitizePhoneNumber = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove all characters except digits, +, and spaces
  return input.replace(/[^\d+\s()-]/g, '').trim();
};

/**
 * Extract phone numbers from text
 */
export const extractPhoneNumbers = (text: string): string[] => {
  const phoneRegex =
    /(\+\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;
  const matches = text.match(phoneRegex) || [];

  return matches
    .map(match => sanitizePhoneNumber(match))
    .filter(phone => {
      const validation = validatePhoneNumber(phone);
      return validation.isValid;
    });
};

/**
 * Check if phone number is in a suppression list format
 */
export const isSuppressionListFormat = (phoneNumber: string): boolean => {
  try {
    const formatted = formatPhoneNumber(phoneNumber);
    return isValidPhoneNumber(formatted);
  } catch (error) {
    return false;
  }
};
