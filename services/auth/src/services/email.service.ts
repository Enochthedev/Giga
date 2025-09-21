import crypto from 'crypto';

export interface EmailVerificationData {
  email: string;
  firstName: string;
  verificationToken: string;
  verificationUrl: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  private static instance: EmailService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
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
   * Send email verification (mock implementation)
   * In production, this would integrate with an email service like SendGrid, AWS SES, etc.
   */
  async sendVerificationEmail(data: EmailVerificationData): Promise<void> {
    try {
      const template = this.createVerificationEmailTemplate(data);

      // Mock email sending - in production, integrate with actual email service
      console.log('📧 Email Verification Sent:', {
        to: data.email,
        subject: template.subject,
        verificationUrl: data.verificationUrl,
        timestamp: new Date().toISOString(),
      });

      // Simulate email service delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // In production, you would do something like:
      // await this.emailProvider.send({
      //   to: data.email,
      //   subject: template.subject,
      //   html: template.html,
      //   text: template.text
      // });
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  /**
   * Create verification URL
   */
  createVerificationUrl(token: string): string {
    return `${this.baseUrl}/verify-email?token=${token}`;
  }

  /**
   * Send welcome email after successful verification
   */
  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    try {
      const subject = 'Welcome to Our Platform!';

      console.log('📧 Welcome Email Sent:', {
        to: email,
        subject,
        firstName,
        timestamp: new Date().toISOString(),
      });

      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't throw error for welcome email failure
    }
  }
}
