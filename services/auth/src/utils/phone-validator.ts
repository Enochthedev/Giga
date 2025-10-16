export class PhoneNumberValidator {
  static sanitize(phone: string): string {
    if (!phone) return '';
    return phone.replace(/[^\d+]/g, '');
  }

  static validate(phone: string): {
    isValid: boolean;
    error?: string;
    errors?: string[];
    formatted?: string;
  } {
    if (!phone) {
      return {
        isValid: false,
        error: 'Phone number is required',
        errors: ['Phone number is required'],
      };
    }

    const sanitized = this.sanitize(phone);
    if (sanitized.length < 10) {
      return {
        isValid: false,
        error: 'Phone number is too short',
        errors: ['Phone number is too short'],
      };
    }

    return { isValid: true, formatted: this.formatForDisplay(sanitized) };
  }

  static formatForDisplay(phone: string): string {
    if (!phone) return '';
    const sanitized = this.sanitize(phone);
    if (sanitized.length === 10) {
      return `(${sanitized.slice(0, 3)}) ${sanitized.slice(3, 6)}-${sanitized.slice(6)}`;
    }
    return sanitized;
  }
}
