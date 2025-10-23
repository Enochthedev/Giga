import { logger } from '../lib/logger';
import { prisma } from '../lib/prisma';
import { PaymentMethodType } from '../types';
import { ValidationError } from '../utils/errors';

export interface VerificationWorkflow {
  id: string;
  paymentMethodId: string;
  userId: string;
  type: PaymentMethodType;
  method: VerificationMethod;
  status: VerificationStatus;
  attempts: number;
  maxAttempts: number;
  data: Record<string, any>;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type VerificationMethod =
  | 'INSTANT'
  | 'MICRO_DEPOSITS'
  | 'MANUAL'
  | 'DOCUMENT_UPLOAD';

export type VerificationStatus =
  | 'pending'
  | 'in_progress'
  | 'verified'
  | 'failed'
  | 'expired'
  | 'cancelled';

export interface VerificationConfig {
  method: VerificationMethod;
  maxAttempts: number;
  expirationHours: number;
  requiredDocuments?: string[];
  autoVerify?: boolean;
}

export interface VerificationAttempt {
  id: string;
  workflowId: string;
  attemptNumber: number;
  data: Record<string, any>;
  result: 'success' | 'failure' | 'pending';
  errorMessage?: string;
  createdAt: Date;
}

/**
 * Comprehensive payment method verification service
 * Handles various verification workflows and methods
 */
export class PaymentMethodVerificationService {
  private readonly verificationConfigs: Map<
    VerificationMethod,
    VerificationConfig
  > = new Map([
    [
      'micro_deposits',
      {
        method: 'micro_deposits',
        maxAttempts: 3,
        expirationHours: 168, // 7 days
        autoVerify: false,
      },
    ],
    [
      'instant_verification',
      {
        method: 'instant_verification',
        maxAttempts: 1,
        expirationHours: 1,
        autoVerify: true,
      },
    ],
    [
      'manual_verification',
      {
        method: 'manual_verification',
        maxAttempts: 1,
        expirationHours: 336, // 14 days
        requiredDocuments: ['bank_statement', 'id_document'],
        autoVerify: false,
      },
    ],
    [
      'address_verification',
      {
        method: 'address_verification',
        maxAttempts: 3,
        expirationHours: 24,
        autoVerify: true,
      },
    ],
    [
      'phone_verification',
      {
        method: 'phone_verification',
        maxAttempts: 3,
        expirationHours: 24,
        autoVerify: false,
      },
    ],
    [
      'email_verification',
      {
        method: 'email_verification',
        maxAttempts: 3,
        expirationHours: 24,
        autoVerify: false,
      },
    ],
  ]);

  /**
   * Start verification workflow for a payment method
   */
  async startVerification(
    paymentMethodId: string,
    userId: string,
    method: VerificationMethod,
    initialData?: Record<string, any>
  ): Promise<VerificationWorkflow> {
    try {
      logger.info('Starting payment method verification', {
        paymentMethodId,
        userId,
        method,
      });

      // Get payment method
      const paymentMethod = await prisma.paymentMethod.findFirst({
        where: {
          id: paymentMethodId,
          userId,
          isActive: true,
        },
      });

      if (!paymentMethod) {
        throw new ValidationError('Payment method not found');
      }

      // Check if verification is already in progress
      const existingWorkflow =
        await this.getActiveVerificationWorkflow(paymentMethodId);
      if (existingWorkflow) {
        throw new ValidationError('Verification already in progress');
      }

      // Get verification config
      const config = this.verificationConfigs.get(method);
      if (!config) {
        throw new ValidationError(`Unsupported verification method: ${method}`);
      }

      // Create verification workflow
      const workflow = await this.createVerificationWorkflow(
        paymentMethodId,
        userId,
        paymentMethod.type as PaymentMethodType,
        config,
        initialData
      );

      // Start the verification process
      await this.executeVerificationMethod(workflow, initialData);

      logger.info('Verification workflow started', {
        workflowId: workflow.id,
        method,
        status: workflow.status,
      });

      return workflow;
    } catch (error) {
      logger.error('Failed to start verification', {
        paymentMethodId,
        userId,
        method,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Submit verification data for an ongoing workflow
   */
  async submitVerificationData(
    workflowId: string,
    userId: string,
    data: Record<string, any>
  ): Promise<VerificationWorkflow> {
    try {
      logger.info('Submitting verification data', {
        workflowId,
        userId,
      });

      // Get workflow
      const workflow = await this.getVerificationWorkflow(workflowId, userId);
      if (!workflow) {
        throw new ValidationError('Verification workflow not found');
      }

      // Check if workflow is still active
      if (!['pending', 'in_progress'].includes(workflow.status)) {
        throw new ValidationError(
          `Cannot submit data for workflow with status: ${workflow.status}`
        );
      }

      // Check expiration
      if (new Date() > workflow.expiresAt) {
        await this.expireWorkflow(workflowId);
        throw new ValidationError('Verification workflow has expired');
      }

      // Check attempt limits
      if (workflow.attempts >= workflow.maxAttempts) {
        await this.failWorkflow(workflowId, 'Maximum attempts exceeded');
        throw new ValidationError('Maximum verification attempts exceeded');
      }

      // Create verification attempt
      const attempt = await this.createVerificationAttempt(
        workflowId,
        workflow.attempts + 1,
        data
      );

      // Process verification based on method
      const result = await this.processVerificationData(workflow, data);

      // Update attempt with result
      await this.updateVerificationAttempt(attempt.id, result);

      // Update workflow based on result
      const updatedWorkflow = await this.updateWorkflowStatus(
        workflowId,
        result
      );

      logger.info('Verification data processed', {
        workflowId,
        attemptId: attempt.id,
        result: result.result,
        status: updatedWorkflow.status,
      });

      return updatedWorkflow;
    } catch (error) {
      logger.error('Failed to submit verification data', {
        workflowId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Get verification workflow status
   */
  async getVerificationStatus(
    workflowId: string,
    userId: string
  ): Promise<VerificationWorkflow> {
    const workflow = await this.getVerificationWorkflow(workflowId, userId);
    if (!workflow) {
      throw new ValidationError('Verification workflow not found');
    }

    return workflow;
  }

  /**
   * Cancel verification workflow
   */
  async cancelVerification(
    workflowId: string,
    userId: string,
    reason?: string
  ): Promise<void> {
    try {
      logger.info('Cancelling verification workflow', {
        workflowId,
        userId,
        reason,
      });

      const workflow = await this.getVerificationWorkflow(workflowId, userId);
      if (!workflow) {
        throw new ValidationError('Verification workflow not found');
      }

      if (!['pending', 'in_progress'].includes(workflow.status)) {
        throw new ValidationError(
          `Cannot cancel workflow with status: ${workflow.status}`
        );
      }

      // Update workflow status
      await this.updateWorkflowData(workflowId, {
        status: 'cancelled',
        data: {
          ...workflow.data,
          cancellationReason: reason,
          cancelledAt: new Date().toISOString(),
        },
      });

      logger.info('Verification workflow cancelled', { workflowId, reason });
    } catch (error) {
      logger.error('Failed to cancel verification', {
        workflowId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Get verification history for a payment method
   */
  async getVerificationHistory(
    paymentMethodId: string,
    userId: string
  ): Promise<VerificationWorkflow[]> {
    try {
      // In a real implementation, this would query the verification workflows table
      // For now, return empty array
      return [];
    } catch (error) {
      logger.error('Failed to get verification history', {
        paymentMethodId,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  // Private helper methods

  private async createVerificationWorkflow(
    paymentMethodId: string,
    userId: string,
    type: PaymentMethodType,
    config: VerificationConfig,
    initialData?: Record<string, any>
  ): Promise<VerificationWorkflow> {
    const workflowId = `vw_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const expiresAt = new Date(
      Date.now() + config.expirationHours * 60 * 60 * 1000
    );

    const workflow: VerificationWorkflow = {
      id: workflowId,
      paymentMethodId,
      userId,
      type,
      method: config.method,
      status: 'pending',
      attempts: 0,
      maxAttempts: config.maxAttempts,
      data: {
        config,
        initialData,
        createdAt: new Date().toISOString(),
      },
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In a real implementation, this would be stored in the database
    logger.info('Verification workflow created', { workflowId });

    return workflow;
  }

  private async executeVerificationMethod(
    workflow: VerificationWorkflow,
    data?: Record<string, any>
  ): Promise<void> {
    switch (workflow.method) {
      case 'micro_deposits':
        await this.executeMicroDepositsVerification(workflow, data);
        break;
      case 'instant_verification':
        await this.executeInstantVerification(workflow, data);
        break;
      case 'manual_verification':
        await this.executeManualVerification(workflow, data);
        break;
      case 'address_verification':
        await this.executeAddressVerification(workflow, data);
        break;
      case 'phone_verification':
        await this.executePhoneVerification(workflow, data);
        break;
      case 'email_verification':
        await this.executeEmailVerification(workflow, data);
        break;
      default:
        throw new ValidationError(
          `Unsupported verification method: ${workflow.method}`
        );
    }
  }

  private async executeMicroDepositsVerification(
    workflow: VerificationWorkflow,
    data?: Record<string, any>
  ): Promise<void> {
    logger.info('Executing micro deposits verification', {
      workflowId: workflow.id,
    });

    // Generate two random amounts between $0.01 and $0.99
    const amount1 = Math.floor(Math.random() * 99) + 1;
    const amount2 = Math.floor(Math.random() * 99) + 1;

    // Update workflow with deposit information
    await this.updateWorkflowData(workflow.id, {
      status: 'in_progress',
      data: {
        ...workflow.data,
        microDeposits: {
          amounts: [amount1, amount2],
          initiatedAt: new Date().toISOString(),
          expectedVerificationBy: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      },
    });

    // In a real implementation, this would integrate with banking APIs to send micro deposits
    logger.info('Micro deposits initiated', {
      workflowId: workflow.id,
      amounts: [amount1, amount2],
    });
  }

  private async executeInstantVerification(
    workflow: VerificationWorkflow,
    data?: Record<string, any>
  ): Promise<void> {
    logger.info('Executing instant verification', { workflowId: workflow.id });

    // Simulate instant verification with third-party service
    const verified = Math.random() > 0.1; // 90% success rate

    await this.updateWorkflowData(workflow.id, {
      status: verified ? 'verified' : 'failed',
      data: {
        ...workflow.data,
        instantVerification: {
          verified,
          verifiedAt: new Date().toISOString(),
          provider: 'plaid', // Example provider
        },
      },
    });

    if (verified) {
      await this.markPaymentMethodAsVerified(workflow.paymentMethodId);
    }
  }

  private async executeManualVerification(
    workflow: VerificationWorkflow,
    data?: Record<string, any>
  ): Promise<void> {
    logger.info('Executing manual verification', { workflowId: workflow.id });

    await this.updateWorkflowData(workflow.id, {
      status: 'in_progress',
      data: {
        ...workflow.data,
        manualVerification: {
          documentsRequired: ['bank_statement', 'id_document'],
          submittedDocuments: data?.documents || [],
          reviewStartedAt: new Date().toISOString(),
          estimatedCompletionDate: new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      },
    });
  }

  private async executeAddressVerification(
    workflow: VerificationWorkflow,
    data?: Record<string, any>
  ): Promise<void> {
    logger.info('Executing address verification', { workflowId: workflow.id });

    // Simulate address verification service
    const verified = Math.random() > 0.2; // 80% success rate

    await this.updateWorkflowData(workflow.id, {
      status: verified ? 'verified' : 'failed',
      data: {
        ...workflow.data,
        addressVerification: {
          verified,
          verifiedAt: new Date().toISOString(),
          service: 'address_validation_service',
        },
      },
    });

    if (verified) {
      await this.markPaymentMethodAsVerified(workflow.paymentMethodId);
    }
  }

  private async executePhoneVerification(
    workflow: VerificationWorkflow,
    data?: Record<string, any>
  ): Promise<void> {
    logger.info('Executing phone verification', { workflowId: workflow.id });

    // Generate verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await this.updateWorkflowData(workflow.id, {
      status: 'in_progress',
      data: {
        ...workflow.data,
        phoneVerification: {
          code: verificationCode,
          sentAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
        },
      },
    });

    // In a real implementation, this would send SMS
    logger.info('Phone verification code sent', {
      workflowId: workflow.id,
      code: verificationCode,
    });
  }

  private async executeEmailVerification(
    workflow: VerificationWorkflow,
    data?: Record<string, any>
  ): Promise<void> {
    logger.info('Executing email verification', { workflowId: workflow.id });

    // Generate verification token
    const verificationToken =
      Math.random().toString(36).substring(2) + Date.now().toString(36);

    await this.updateWorkflowData(workflow.id, {
      status: 'in_progress',
      data: {
        ...workflow.data,
        emailVerification: {
          token: verificationToken,
          sentAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        },
      },
    });

    // In a real implementation, this would send email
    logger.info('Email verification sent', {
      workflowId: workflow.id,
      token: verificationToken,
    });
  }

  private async processVerificationData(
    workflow: VerificationWorkflow,
    data: Record<string, any>
  ): Promise<{
    result: 'success' | 'failure' | 'pending';
    errorMessage?: string;
  }> {
    switch (workflow.method) {
      case 'micro_deposits':
        return this.processMicroDepositsData(workflow, data);
      case 'phone_verification':
        return this.processPhoneVerificationData(workflow, data);
      case 'email_verification':
        return this.processEmailVerificationData(workflow, data);
      case 'manual_verification':
        return this.processManualVerificationData(workflow, data);
      default:
        return {
          result: 'failure',
          errorMessage: 'Unsupported verification method',
        };
    }
  }

  private processMicroDepositsData(
    workflow: VerificationWorkflow,
    data: Record<string, any>
  ): { result: 'success' | 'failure'; errorMessage?: string } {
    const expectedAmounts = workflow.data.microDeposits?.amounts || [];
    const providedAmounts = data.amounts || [];

    if (providedAmounts.length !== 2) {
      return { result: 'failure', errorMessage: 'Two amounts are required' };
    }

    const expectedSorted = expectedAmounts.sort(
      (a: number, b: number) => a - b
    );
    const providedSorted = providedAmounts.sort(
      (a: number, b: number) => a - b
    );

    const match = expectedSorted.every(
      (amount: number, index: number) => amount === providedSorted[index]
    );

    return {
      result: match ? 'success' : 'failure',
      errorMessage: match ? undefined : 'Amounts do not match',
    };
  }

  private processPhoneVerificationData(
    workflow: VerificationWorkflow,
    data: Record<string, any>
  ): { result: 'success' | 'failure'; errorMessage?: string } {
    const expectedCode = workflow.data.phoneVerification?.code;
    const providedCode = data.code;

    if (!providedCode) {
      return {
        result: 'failure',
        errorMessage: 'Verification code is required',
      };
    }

    const match = expectedCode === providedCode;

    return {
      result: match ? 'success' : 'failure',
      errorMessage: match ? undefined : 'Invalid verification code',
    };
  }

  private processEmailVerificationData(
    workflow: VerificationWorkflow,
    data: Record<string, any>
  ): { result: 'success' | 'failure'; errorMessage?: string } {
    const expectedToken = workflow.data.emailVerification?.token;
    const providedToken = data.token;

    if (!providedToken) {
      return {
        result: 'failure',
        errorMessage: 'Verification token is required',
      };
    }

    const match = expectedToken === providedToken;

    return {
      result: match ? 'success' : 'failure',
      errorMessage: match ? undefined : 'Invalid verification token',
    };
  }

  private processManualVerificationData(
    workflow: VerificationWorkflow,
    data: Record<string, any>
  ): { result: 'pending' } {
    // Manual verification always returns pending as it requires human review
    return { result: 'pending' };
  }

  private async getActiveVerificationWorkflow(
    paymentMethodId: string
  ): Promise<VerificationWorkflow | null> {
    // In a real implementation, this would query the database
    return null;
  }

  private async getVerificationWorkflow(
    workflowId: string,
    userId: string
  ): Promise<VerificationWorkflow | null> {
    // In a real implementation, this would query the database
    return null;
  }

  private async createVerificationAttempt(
    workflowId: string,
    attemptNumber: number,
    data: Record<string, any>
  ): Promise<VerificationAttempt> {
    const attempt: VerificationAttempt = {
      id: `va_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      workflowId,
      attemptNumber,
      data,
      result: 'pending',
      createdAt: new Date(),
    };

    // In a real implementation, this would be stored in the database
    logger.info('Verification attempt created', { attemptId: attempt.id });

    return attempt;
  }

  private async updateVerificationAttempt(
    attemptId: string,
    result: { result: 'success' | 'failure' | 'pending'; errorMessage?: string }
  ): Promise<void> {
    // In a real implementation, this would update the database
    logger.info('Verification attempt updated', {
      attemptId,
      result: result.result,
    });
  }

  private async updateWorkflowStatus(
    workflowId: string,
    result: { result: 'success' | 'failure' | 'pending'; errorMessage?: string }
  ): Promise<VerificationWorkflow> {
    let status: VerificationStatus;

    switch (result.result) {
      case 'success':
        status = 'verified';
        break;
      case 'failure':
        status = 'failed';
        break;
      case 'pending':
        status = 'in_progress';
        break;
    }

    // In a real implementation, this would update the database and return the updated workflow
    logger.info('Workflow status updated', { workflowId, status });

    // Return mock workflow for now
    return {
      id: workflowId,
      paymentMethodId: '',
      userId: '',
      type: 'CARD',
      method: 'micro_deposits',
      status,
      attempts: 1,
      maxAttempts: 3,
      data: {},
      expiresAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private async updateWorkflowData(
    workflowId: string,
    updates: Partial<VerificationWorkflow>
  ): Promise<void> {
    // In a real implementation, this would update the database
    logger.info('Workflow data updated', { workflowId, updates });
  }

  private async expireWorkflow(workflowId: string): Promise<void> {
    await this.updateWorkflowData(workflowId, {
      status: 'expired',
      updatedAt: new Date(),
    });
  }

  private async failWorkflow(
    workflowId: string,
    reason: string
  ): Promise<void> {
    await this.updateWorkflowData(workflowId, {
      status: 'failed',
      data: { failureReason: reason },
      updatedAt: new Date(),
    });
  }

  private async markPaymentMethodAsVerified(
    paymentMethodId: string
  ): Promise<void> {
    try {
      await prisma.paymentMethod.update({
        where: { id: paymentMethodId },
        data: {
          metadata: {
            verified: true,
            verifiedAt: new Date().toISOString(),
          },
        },
      });

      logger.info('Payment method marked as verified', { paymentMethodId });
    } catch (error) {
      logger.error('Failed to mark payment method as verified', {
        paymentMethodId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
