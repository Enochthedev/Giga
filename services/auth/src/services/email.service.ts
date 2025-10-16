import crypto from 'crypto';
import { logger } from './logger.service';
import {
  ExternalServiceManager,
  ResilientExternalService,
} from './resilient-external-service';

export interface EmailVerificationData {
  email: string;
  firstName: string;
  verificationToken: string;
  verificationUrl: string;
}

export interface PasswordResetData {
  email: string;
  firstName: string;
  resetToken: string;
  resetUrl: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  private static instance: EmailService;
  private baseUrl: string;
  private resilientService: ResilientExternalService;

  private constructor() {
    this.baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // Initialize resilient external service for email
    const serviceManager = ExternalServiceManager.getInstance();
    this.resilientService = serviceManager.register({
      name: 'email-service',
      baseUrl: process.env.EMAIL_SERVICE_URL,
      timeout: 10000,
      circuitBreaker: {
        failureThreshold: 5,
        recoveryTimeout: 60000,
        monitoringPeriod: 300000,
      },
      retry: {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 10000,
      },
      fallback: {
        enabled: true,
        handler: async () => {
          // Fallback: log email instead of sending
          logger.warn('Email service unavailable, logging email instead');
          return { success: true, fallback: true };
        },
      },
    });
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Generate a secure email verification token
   */
  generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Create email verification template
   */
  createVerificationEmailTemplate(data: EmailVerificationData): EmailTemplate {
    const { firstName, verificationUrl } = data;

    const subject = 'Verify Your Email Address';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9f9f9; }
            .button { 
              display: inline-block; 
              padding: 12px 30px; 
              background: #007bff; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0; 
            }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verification</h1>
            </div>
            <div class="content">
              <h2>Hello ${firstName}!</h2>
              <p>Thank you for registering with our platform. To complete your registration and secure your account, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #f1f1f1; padding: 10px; border-radius: 3px;">
                ${verificationUrl}
              </p>
              
              <div class="warning">
                <strong>Security Notice:</strong>
                <ul>
                  <li>This verification link will expire in 24 hours</li>
                  <li>If you didn't create an account, please ignore this email</li>
                  <li>Never share this verification link with others</li>
                </ul>
              </div>
              
              <p>If you have any questions or need assistance, please contact our support team.</p>
              
              <p>Best regards,<br>The Platform Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Hello ${firstName}!

Thank you for registering with our platform. To complete your registration and secure your account, please verify your email address by visiting this link:

${verificationUrl}

Security Notice:
- This verification link will expire in 24 hours
- If you didn't create an account, please ignore this email
- Never share this verification link with others

If you have any questions or need assistance, please contact our support team.

Best regards,
The Platform Team

This is an automated message. Please do not reply to this email.
© ${new Date().getFullYear()} Platform. All rights reserved.
    `;

    return { subject, html, text };
  }

  /**
   * Send email verification with resilience and fallback
   */
  async sendVerificationEmail(data: EmailVerificationData): Promise<void> {
    const template = this.createVerificationEmailTemplate(data);

    await this.resilientService.execute(
      async () => {
        // In production, this would call the actual email service
        // For now, we'll simulate the email sending with potential failures
        if (Math.random() < 0.1) {
          // 10% chance of failure for testing
          throw new Error('Email service temporarily unavailable');
        }

        console.log('📧 Email Verification Sent:', {
          to: data.email,
          subject: template.subject,
          verificationUrl: data.verificationUrl,
          timestamp: new Date().toISOString(),
        });

        // Simulate email service delay
        await new Promise(resolve => setTimeout(resolve, 100));

        return { success: true };
      },
      'send-verification-email',
      { success: true } // Fallback value
    );
  }

  /**
   * Create verification URL
   */
  createVerificationUrl(token: string): string {
    return `${this.baseUrl}/verify-email?token=${token}`;
  }

  /**
   * Create password reset email template
   */
  createPasswordResetEmailTemplate(data: PasswordResetData): EmailTemplate {
    const { firstName, resetUrl } = data;

    const subject = 'Password Reset Request';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9f9f9; }
            .button { 
              display: inline-block; 
              padding: 12px 30px; 
              background: #dc3545; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0; 
            }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            .warning { background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .security { background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; margin: 20px 0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hello ${firstName}!</h2>
              <p>We received a request to reset the password for your account. If you made this request, click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #f1f1f1; padding: 10px; border-radius: 3px;">
                ${resetUrl}
              </p>
              
              <div class="warning">
                <strong>⚠️ Security Alert:</strong>
                <ul>
                  <li>This password reset link will expire in 1 hour</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Your password will remain unchanged if you don't click the link</li>
                  <li>Never share this reset link with others</li>
                </ul>
              </div>
              
              <div class="security">
                <strong>🛡️ Password Security Requirements:</strong>
                <ul>
                  <li>At least 8 characters long</li>
                  <li>Contains uppercase and lowercase letters</li>
                  <li>Contains at least one number</li>
                  <li>Contains at least one special character</li>
                  <li>Cannot reuse your last 5 passwords</li>
                </ul>
              </div>
              
              <p>If you continue to have problems or didn't request this reset, please contact our support team immediately.</p>
              
              <p>Best regards,<br>The Platform Security Team</p>
            </div>
            <div class="footer">
              <p>This is an automated security message. Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Hello ${firstName}!

We received a request to reset the password for your account. If you made this request, visit this link to reset your password:

${resetUrl}

⚠️ Security Alert:
- This password reset link will expire in 1 hour
- If you didn't request this reset, please ignore this email
- Your password will remain unchanged if you don't click the link
- Never share this reset link with others

🛡️ Password Security Requirements:
- At least 8 characters long
- Contains uppercase and lowercase letters
- Contains at least one number
- Contains at least one special character
- Cannot reuse your last 5 passwords

If you continue to have problems or didn't request this reset, please contact our support team immediately.

Best regards,
The Platform Security Team

This is an automated security message. Please do not reply to this email.
© ${new Date().getFullYear()} Platform. All rights reserved.
    `;

    return { subject, html, text };
  }

  /**
   * Send password reset email with resilience and fallback
   */
  async sendPasswordResetEmail(data: PasswordResetData): Promise<void> {
    const template = this.createPasswordResetEmailTemplate(data);

    await this.resilientService.execute(
      async () => {
        // In production, this would call the actual email service
        if (Math.random() < 0.1) {
          // 10% chance of failure for testing
          throw new Error('Email service temporarily unavailable');
        }

        console.log('📧 Password Reset Email Sent:', {
          to: data.email,
          subject: template.subject,
          resetUrl: data.resetUrl,
          timestamp: new Date().toISOString(),
        });

        // Simulate email service delay
        await new Promise(resolve => setTimeout(resolve, 100));

        return { success: true };
      },
      'send-password-reset-email',
      { success: true }
    );
  }

  /**
   * Create password reset URL
   */
  createPasswordResetUrl(token: string): string {
    return `${this.baseUrl}/reset-password?token=${token}`;
  }

  /**
   * Send welcome email after successful verification with graceful degradation
   */
  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    try {
      await this.resilientService.execute(
        async () => {
          const subject = 'Welcome to Our Platform!';

          console.log('📧 Welcome Email Sent:', {
            to: email,
            subject,
            firstName,
            timestamp: new Date().toISOString(),
          });

          // Simulate async operation
          await new Promise(resolve => setTimeout(resolve, 50));
          return { success: true };
        },
        'send-welcome-email',
        { success: true }
      );
    } catch (error) {
      // Graceful degradation: log error but don't fail the operation
      logger.warn(
        'Failed to send welcome email, continuing with graceful degradation',
        {
          email,
          firstName,
          errorMessage: (error as Error).message,
        }
      );
    }
  }

  /**
   * Get email service health status
   */
  getServiceHealth() {
    return this.resilientService.getHealth();
  }

  /**
   * Get email service statistics
   */
  getServiceStats() {
    return this.resilientService.getStats();
  }
}
