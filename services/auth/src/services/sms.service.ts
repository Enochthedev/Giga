import crypto from 'crypto';

export interface PhoneVerificationData {
  phone: string;
  firstName: string;
  verificationCode: string;
}

export interface SMSTemplate {
  message: string;
}

export class SMSService {
  private static instance: SMSService;

  private constructor() {}

  static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService();
    }
    return SMSService.instance;
  }

  /**
   * Generate a secure 6-digit verification code
   */
  generateVerificationCode(): string {
    // Generate cryptographically secure random 6-digit code
    const randomBytes = crypto.randomBytes(4);
    const randomNumber = randomBytes.readUInt32BE(0);
    const code = ((randomNumber % 900000) + 100000).toString();
    return code;
  }

  /**
   * Create SMS verification template
   */
  createVerificationSMSTemplate(data: PhoneVerificationData): SMSTemplate {
    const { firstName, verificationCode } = data;

    const message = `Hello ${firstName}! Your verification code is: ${verificationCode}. This code will expire in 10 minutes. Do not share this code with anyone. If you didn't request this, please ignore this message.`;

    return { message };
  }

  /**
   * Send SMS verification code (mock implementation)
   * In production, this would integrate with an SMS service like Twilio, AWS SNS, etc.
   */
  async sendVerificationSMS(data: PhoneVerificationData): Promise<void> {
    try {
      const template = this.createVerificationSMSTemplate(data);

      // Mock SMS sending - in production, integrate with actual SMS service
      console.log('📱 SMS Verification Sent:', {
        to: data.phone,
        message: template.message,
        code: data.verificationCode,
        timestamp: new Date().toISOString(),
      });

      // Simulate SMS service delay
      await new Promise(resolve => setTimeout(resolve, 200));

      // In production, you would do something like:
      // await this.smsProvider.send({
      //   to: data.phone,
      //   message: template.message
      // });
    } catch (error) {
      console.error('Failed to send verification SMS:', error);
      throw new Error('Failed to send verification SMS');
    }
  }

  /**
   * Send security alert SMS
   */
  async sendSecurityAlert(phone: string, message: string): Promise<void> {
    try {
      console.log('🔒 Security Alert SMS Sent:', {
        to: phone,
        message,
        timestamp: new Date().toISOString(),
      });

      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Failed to send security alert SMS:', error);
      // Don't throw error for security alert failure
    }
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phone: string): { isValid: boolean; error?: string } {
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');

    // Check if it's a valid length (10-15 digits)
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return {
        isValid: false,
        error: 'Phone number must be between 10 and 15 digits',
      };
    }

    // Check for valid international format patterns
    const validPatterns = [
      /^\+?1[2-9]\d{9}$/, // US/Canada
      /^\+?44[1-9]\d{8,9}$/, // UK
      /^\+?49[1-9]\d{7,11}$/, // Germany
      /^\+?33[1-9]\d{8}$/, // France
      /^\+?39[0-9]\d{6,11}$/, // Italy
      /^\+?34[6-9]\d{8}$/, // Spain
      /^\+?91[6-9]\d{9}$/, // India
      /^\+?86[1-9]\d{9,10}$/, // China
      /^\+?81[1-9]\d{8,9}$/, // Japan
      /^\+?82[1-9]\d{7,8}$/, // South Korea
      /^\+?61[2-9]\d{8}$/, // Australia
      /^\+?55[1-9]\d{8,10}$/, // Brazil
      /^\+?7[3-9]\d{9}$/, // Russia
      /^\+?[1-9]\d{7,14}$/, // Generic international format
    ];

    const isValidFormat = validPatterns.some(pattern => pattern.test(phone));

    if (!isValidFormat) {
      return {
        isValid: false,
        error: 'Invalid phone number format',
      };
    }

    return { isValid: true };
  }

  /**
   * Format phone number for storage
   */
  formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');

    // Ensure it starts with + for international format
    if (!cleaned.startsWith('+')) {
      // Assume US number if no country code
      return `+1${cleaned}`;
    }

    return cleaned;
  }
}
