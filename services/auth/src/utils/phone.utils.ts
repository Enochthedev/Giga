import {
  CountryCode,
  isValidPhoneNumber,
  parsePhoneNumber,
} from 'libphonenumber-js';

export interface PhoneValidationResult {
  isValid: boolean;
  formatted?: string;
  country?: string;
  type?: string;
  errors: string[];
}

export class PhoneNumberValidator {
  /**
   * Validate and format phone number
   */
  static validate(
    phoneNumber: string,
    defaultCountry?: CountryCode
  ): PhoneValidationResult {
    const errors: string[] = [];

    if (!phoneNumber || phoneNumber.trim().length === 0) {
      errors.push('Phone number is required');
      return { isValid: false, errors };
    }

    // Remove any non-digit characters except + for initial validation
    const cleanPhone = phoneNumber.trim();

    try {
      // First check if it's a valid phone number format
      if (!isValidPhoneNumber(cleanPhone, defaultCountry)) {
        errors.push('Invalid phone number format');
        return { isValid: false, errors };
      }

      // Parse the phone number
      const parsed = parsePhoneNumber(cleanPhone, defaultCountry);

      if (!parsed) {
        errors.push('Unable to parse phone number');
        return { isValid: false, errors };
      }

      // Additional validations
      if (!parsed.isValid()) {
        errors.push('Phone number is not valid for the detected country');
        return { isValid: false, errors };
      }

      // Check if it's a mobile number (preferred for verification)
      const numberType = parsed.getType();
      if (
        numberType &&
        !['MOBILE', 'FIXED_LINE_OR_MOBILE'].includes(numberType)
      ) {
        // Warning but not blocking
        console.warn(
          `Phone number type ${numberType} may not support SMS verification`
        );
      }

      return {
        isValid: true,
        formatted: parsed.formatInternational(),
        country: parsed.country,
        type: numberType,
        errors: [],
      };
    } catch (error) {
      errors.push(
        `Phone validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      return { isValid: false, errors };
    }
  }

  /**
   * Format phone number for storage (E.164 format)
   */
  static formatForStorage(
    phoneNumber: string,
    defaultCountry?: CountryCode
  ): string | null {
    try {
      const parsed = parsePhoneNumber(phoneNumber, defaultCountry);
      return parsed?.format('E.164') || null;
    } catch {
      return null;
    }
  }

  /**
   * Format phone number for display
   */
  static formatForDisplay(
    phoneNumber: string,
    defaultCountry?: CountryCode
  ): string {
    try {
      const parsed = parsePhoneNumber(phoneNumber, defaultCountry);
      return parsed?.formatInternational() || phoneNumber;
    } catch {
      return phoneNumber;
    }
  }

  /**
   * Check if phone number can receive SMS
   */
  static canReceiveSMS(
    phoneNumber: string,
    defaultCountry?: CountryCode
  ): boolean {
    try {
      const parsed = parsePhoneNumber(phoneNumber, defaultCountry);
      if (!parsed) return false;

      const numberType = parsed.getType();
      return (
        !numberType || ['MOBILE', 'FIXED_LINE_OR_MOBILE'].includes(numberType)
      );
    } catch {
      return false;
    }
  }

  /**
   * Sanitize phone number input
   */
  static sanitize(phoneNumber: string): string {
    if (!phoneNumber) return '';

    // Remove any HTML tags and dangerous characters
    return phoneNumber
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[^\d+\-\s()]/g, '') // Keep only digits, +, -, spaces, parentheses
      .trim();
  }

  /**
   * Generate a masked version for display (privacy)
   */
  static mask(phoneNumber: string): string {
    try {
      const parsed = parsePhoneNumber(phoneNumber);
      if (!parsed) return phoneNumber;

      const formatted = parsed.formatInternational();
      // Mask middle digits: +1 234 ***-**56
      return formatted.replace(/(\d{3})\d{3}(\d{2})$/, '$1***-**$2');
    } catch {
      // Fallback masking
      return phoneNumber.replace(/(\d{3})\d{4}(\d{2})/, '$1****$2');
    }
  }
}

export default PhoneNumberValidator;
