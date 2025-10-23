import { v4 as uuidv4 } from 'uuid';
import { Decimal } from '../lib/decimal';
import { logger } from '../lib/logger';
import { prisma } from '../lib/prisma';
import {
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
  Transaction,
  TransactionType,
} from '../types';
import { PaymentError, ValidationError } from '../utils/errors';
import {
  validateAmount,
  validateCurrency,
  validatePaymentRequest,
} from '../utils/validation';
import { FraudDetectionService } from './fraud-detection.service';
import { GatewayManager } from './gateway-manager.service';
import { PaymentMethodManager } from './payment-method-manager.service';
import { TransactionService } from './transaction.service';

export interface TransactionProcessorConfig {
  maxRetries: number;
  retryDelayMs: number;
  timeoutMs: number;
  idempotencyTtlMs: number;
  enableFraudDetection: boolean;
  enableSplitPayments: boolean;
}

export interface ProcessingContext {
  transactionId: string;
  attempt: number;
  startTime: Date;
  idempotencyKey?: string;
  metadata: Record<string, any>;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  retryableErrors: string[];
}

export class TransactionProcessor {
  private transactionService: TransactionService;
  private gatewayManager: GatewayManager;
  private paymentMethodManager: PaymentMethodManager;
  private fraudDetectionService: FraudDetectionService;
  private config: TransactionProcessorConfig;
  private idempotencyCache: Map<string, string> = new Map();

  constructor(config?: Partial<TransactionProcessorConfig>) {
    this.transactionService = new TransactionService();
    this.gatewayManager = new GatewayManager();
    this.paymentMethodManager = new PaymentMethodManager();
    this.fraudDetectionService = new FraudDetectionService({
      enabled: true,
      riskThreshold: 70,
      reviewThreshold: 50,
      rules: {
        velocity: {
          enabled: true,
          limits: { transactions: 10, amount: 10000 },
        },
        geolocation: { enabled: true, allowedCountries: ['US', 'CA', 'GB'] },
        device: { enabled: true, maxDevicesPerUser: 5 },
        behavioral: { enabled: true, threshold: 0.8 },
      },
    });

    this.config = {
      maxRetries: 3,
      retryDelayMs: 1000,
      timeoutMs: 30000,
      idempotencyTtlMs: 24 * 60 * 60 * 1000, // 24 hours
      enableFraudDetection: true,
      enableSplitPayments: true,
      ...config,
    };

    // Clean up expired idempotency keys periodically
    this.startIdempotencyCleanup();
  }

  /**
   * Process a payment with full business logic, state management, and error handling
   */
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    const context = this.createProcessingContext(request);

    try {
      logger.info('Starting payment processing', {
        transactionId: context.transactionId,
        amount: request.amount,
        currency: request.currency,
        userId: request.userId,
        idempotencyKey: context.idempotencyKey,
      });

      // Step 1: Handle idempotency
      const existingResult = await this.checkIdempotency(
        context.idempotencyKey
      );
      if (existingResult) {
        logger.info('Returning cached result for idempotent request', {
          transactionId: context.transactionId,
          idempotencyKey: context.idempotencyKey,
        });
        return existingResult;
      }

      // Step 2: Validate request
      const validatedRequest = await this.validateRequest(request);

      // Step 3: Create transaction record
      const transaction = await this.createTransaction(
        validatedRequest,
        context
      );

      // Step 4: Fraud detection (if enabled)
      if (this.config.enableFraudDetection) {
        await this.performFraudDetection(transaction, validatedRequest);
      }

      // Step 5: Process payment with retry logic
      const result = await this.executePaymentWithRetry(
        transaction,
        validatedRequest,
        context
      );

      // Step 6: Handle post-processing
      await this.handlePostProcessing(transaction, result, context);

      // Step 7: Cache result for idempotency
      if (context.idempotencyKey) {
        this.cacheIdempotencyResult(context.idempotencyKey, result);
      }

      logger.info('Payment processing completed successfully', {
        transactionId: context.transactionId,
        status: result.status,
        processingTime: Date.now() - context.startTime.getTime(),
      });

      return result;
    } catch (error) {
      logger.error('Payment processing failed', {
        transactionId: context.transactionId,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - context.startTime.getTime(),
      });

      // Update transaction status to failed
      await this.handleProcessingFailure(context.transactionId, error as Error);
      throw error;
    }
  }

  /**
   * Capture a previously authorized payment
   */
  async capturePayment(
    transactionId: string,
    amount?: number,
    context?: Partial<ProcessingContext>
  ): Promise<PaymentResponse> {
    const processingContext = {
      transactionId,
      attempt: 1,
      startTime: new Date(),
      metadata: {},
      ...context,
    };

    try {
      logger.info('Starting payment capture', {
        transactionId,
        amount,
      });

      // Get transaction
      const transaction = await this.transactionService.getById(transactionId);

      // Validate capture eligibility
      await this.validateCaptureEligibility(transaction, amount);

      // Execute capture with retry logic
      const result = await this.executeCaptureWithRetry(
        transaction,
        amount,
        processingContext
      );

      logger.info('Payment capture completed successfully', {
        transactionId,
        status: result.status,
      });

      return result;
    } catch (error) {
      logger.error('Payment capture failed', {
        transactionId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Cancel a pending payment
   */
  async cancelPayment(
    transactionId: string,
    reason?: string,
    context?: Partial<ProcessingContext>
  ): Promise<PaymentResponse> {
    const processingContext = {
      transactionId,
      attempt: 1,
      startTime: new Date(),
      metadata: { reason },
      ...context,
    };

    try {
      logger.info('Starting payment cancellation', {
        transactionId,
        reason,
      });

      // Get transaction
      const transaction = await this.transactionService.getById(transactionId);

      // Validate cancellation eligibility
      await this.validateCancellationEligibility(transaction);

      // Execute cancellation with retry logic
      const result = await this.executeCancellationWithRetry(
        transaction,
        reason,
        processingContext
      );

      logger.info('Payment cancellation completed successfully', {
        transactionId,
        status: result.status,
      });

      return result;
    } catch (error) {
      logger.error('Payment cancellation failed', {
        transactionId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Update transaction status with proper state management
   */
  async updateTransactionStatus(
    transactionId: string,
    newStatus: PaymentStatus,
    metadata?: Record<string, any>
  ): Promise<Transaction> {
    try {
      logger.info('Updating transaction status', {
        transactionId,
        newStatus,
        metadata,
      });

      const transaction = await this.transactionService.getById(transactionId);

      // Validate state transition
      this.validateStatusTransition(transaction.status, newStatus);

      // Update transaction with proper timestamps
      const updateData: Partial<Transaction> = {
        status: newStatus,
        metadata: { ...transaction.metadata, ...metadata },
      };

      // Set appropriate timestamps based on status
      if (newStatus === 'PROCESSING' && !transaction.processedAt) {
        updateData.processedAt = new Date();
      } else if (newStatus === 'SUCCEEDED') {
        updateData.processedAt = updateData.processedAt || new Date();
        updateData.settledAt = new Date();
      } else if (newStatus === 'FAILED' || newStatus === 'cancelled') {
        updateData.processedAt = updateData.processedAt || new Date();
      }

      const updatedTransaction = await this.transactionService.update(
        transactionId,
        updateData
      );

      logger.info('Transaction status updated successfully', {
        transactionId,
        oldStatus: transaction.status,
        newStatus,
      });

      return updatedTransaction;
    } catch (error) {
      logger.error('Failed to update transaction status', {
        transactionId,
        newStatus,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  // Private helper methods

  private createProcessingContext(request: PaymentRequest): ProcessingContext {
    return {
      transactionId: uuidv4(),
      attempt: 1,
      startTime: new Date(),
      idempotencyKey:
        request.idempotencyKey || this.generateIdempotencyKey(request),
      metadata: {
        userAgent: request.metadata?.userAgent,
        ipAddress: request.metadata?.ipAddress,
        deviceId: request.metadata?.deviceId,
      },
    };
  }

  private generateIdempotencyKey(request: PaymentRequest): string {
    // Generate deterministic key based on request content
    const keyData = {
      userId: request.userId,
      amount: request.amount,
      currency: request.currency,
      paymentMethodId: request.paymentMethodId,
      timestamp: Math.floor(Date.now() / 60000), // 1-minute window
    };

    return `payment_${Buffer.from(JSON.stringify(keyData)).toString('base64')}`;
  }

  private async checkIdempotency(
    idempotencyKey?: string
  ): Promise<PaymentResponse | null> {
    if (!idempotencyKey) return null;

    const cachedResult = this.idempotencyCache.get(idempotencyKey);
    if (cachedResult) {
      return JSON.parse(cachedResult);
    }

    // Check database for existing transaction with this idempotency key
    try {
      const existingTransaction = await prisma.transaction.findFirst({
        where: {
          internalReference: idempotencyKey,
          createdAt: {
            gte: new Date(Date.now() - this.config.idempotencyTtlMs),
          },
        },
      });

      if (existingTransaction) {
        const result: PaymentResponse = {
          id: existingTransaction.id,
          status: existingTransaction.status as PaymentStatus,
          amount: existingTransaction.amount.toNumber(),
          currency: existingTransaction.currency,
          createdAt: existingTransaction.createdAt,
          metadata: existingTransaction.metadata as Record<string, any>,
        };

        // Cache the result
        this.cacheIdempotencyResult(idempotencyKey, result);
        return result;
      }
    } catch (error) {
      logger.warn('Failed to check idempotency in database', {
        idempotencyKey,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    return null;
  }

  private cacheIdempotencyResult(
    idempotencyKey: string,
    result: PaymentResponse
  ): void {
    this.idempotencyCache.set(idempotencyKey, JSON.stringify(result));

    // Set expiration
    setTimeout(() => {
      this.idempotencyCache.delete(idempotencyKey);
    }, this.config.idempotencyTtlMs);
  }

  private async validateRequest(
    request: PaymentRequest
  ): Promise<PaymentRequest> {
    // Basic validation
    const validatedRequest = validatePaymentRequest(request);

    // Currency validation
    if (!validateCurrency(validatedRequest.currency)) {
      throw new ValidationError(
        `Unsupported currency: ${validatedRequest.currency}`
      );
    }

    // Amount validation
    if (!validateAmount(validatedRequest.amount, validatedRequest.currency)) {
      throw new ValidationError(
        `Invalid amount: ${validatedRequest.amount} ${validatedRequest.currency}`
      );
    }

    // Additional business rule validations
    await this.validateBusinessRules(validatedRequest);

    return validatedRequest;
  }

  private async validateBusinessRules(request: PaymentRequest): Promise<void> {
    // Check daily transaction limits
    const dailyLimit = await this.checkDailyTransactionLimit(
      request.userId,
      request.amount,
      request.currency
    );

    if (!dailyLimit.allowed) {
      throw new ValidationError(
        `Daily transaction limit exceeded. Limit: ${dailyLimit.limit}, Current: ${dailyLimit.current}`
      );
    }

    // Check payment method validity
    if (request.paymentMethodId) {
      await this.validatePaymentMethod(request.paymentMethodId, request.userId);
    }

    // Check merchant/vendor validity
    if (request.merchantId) {
      await this.validateMerchant(request.merchantId);
    }
  }

  private async checkDailyTransactionLimit(
    userId: string,
    amount: number,
    currency: string
  ): Promise<{ allowed: boolean; limit: number; current: number }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dailyTransactions = await prisma.transaction.aggregate({
      where: {
        userId,
        currency,
        status: { in: ['succeeded', 'processing'] },
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const currentAmount = dailyTransactions._sum.amount?.toNumber() || 0;
    const dailyLimit = 10000; // $10,000 default limit
    const newTotal = currentAmount + amount;

    return {
      allowed: newTotal <= dailyLimit,
      limit: dailyLimit,
      current: currentAmount,
    };
  }

  private async validatePaymentMethod(
    paymentMethodId: string,
    userId: string
  ): Promise<void> {
    try {
      const paymentMethod =
        await this.paymentMethodManager.getById(paymentMethodId);

      if (paymentMethod.userId !== userId) {
        throw new ValidationError(
          `Payment method ${paymentMethodId} does not belong to user ${userId}`
        );
      }

      if (!paymentMethod.isActive) {
        throw new ValidationError(
          `Payment method ${paymentMethodId} is not active`
        );
      }

      // Check verification status for payment methods that require it
      const verificationStatus =
        await this.paymentMethodManager.getPaymentMethodVerificationStatus(
          paymentMethodId,
          userId
        );

      if (verificationStatus.status === 'FAILED') {
        throw new ValidationError(
          `Payment method ${paymentMethodId} verification failed`
        );
      }

      if (
        verificationStatus.status === 'pending' &&
        this.requiresVerification(paymentMethod.type)
      ) {
        throw new ValidationError(
          `Payment method ${paymentMethodId} requires verification before use`
        );
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(
        `Payment method ${paymentMethodId} not found or not accessible`
      );
    }
  }

  private requiresVerification(type: string): boolean {
    // Bank accounts typically require verification before first use
    return type === 'bank_account';
  }

  private async validateMerchant(merchantId: string): Promise<void> {
    // In a real implementation, this would check merchant validity
    // For now, we'll just log the validation
    logger.info('Validating merchant', { merchantId });
  }

  private async createTransaction(
    request: PaymentRequest,
    context: ProcessingContext
  ): Promise<Transaction> {
    const transactionData: Partial<Transaction> = {
      id: context.transactionId,
      type: 'payment' as TransactionType,
      status: 'pending' as PaymentStatus,
      amount: new Decimal(request.amount),
      currency: request.currency.toUpperCase(),
      description: request.description,
      userId: request.userId,
      merchantId: request.merchantId,
      vendorId: request.vendorId,
      paymentMethodId: request.paymentMethodId,
      internalReference: context.idempotencyKey,
      externalReference: request.externalReference,
      metadata: {
        ...request.metadata,
        ...context.metadata,
        processingStarted: context.startTime.toISOString(),
      },
    };

    return this.transactionService.create(transactionData);
  }

  private async performFraudDetection(
    transaction: Transaction,
    request: PaymentRequest
  ): Promise<void> {
    try {
      logger.info('Performing fraud detection', {
        transactionId: transaction.id,
      });

      const fraudAnalysis = await this.fraudDetectionService.analyzeTransaction(
        {
          ...transaction,
          paymentMethod: request.paymentMethod,
          billingAddress: request.billingAddress,
          deviceFingerprint: request.metadata?.deviceFingerprint,
          ipAddress: request.metadata?.ipAddress,
        }
      );

      // Update transaction with fraud analysis
      await this.transactionService.update(transaction.id, {
        riskScore: fraudAnalysis.riskScore,
        fraudFlags: fraudAnalysis.flags?.map(f => f.type) || [],
        metadata: {
          ...transaction.metadata,
          fraudAnalysis: {
            riskLevel: fraudAnalysis.riskLevel,
            recommendation: fraudAnalysis.recommendation,
            assessedAt: fraudAnalysis.assessedAt,
          },
        },
      });

      // Handle high-risk transactions
      if (fraudAnalysis.recommendation === 'decline') {
        throw new PaymentError(
          'Transaction declined due to high fraud risk',
          'FRAUD_DECLINED'
        );
      }

      if (fraudAnalysis.recommendation === 'review') {
        // Flag for manual review
        await this.flagForManualReview(transaction.id, fraudAnalysis);
      }
    } catch (error) {
      if (error instanceof PaymentError) {
        throw error;
      }

      logger.warn('Fraud detection failed, proceeding with payment', {
        transactionId: transaction.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private async flagForManualReview(
    transactionId: string,
    fraudAnalysis: any
  ): Promise<void> {
    logger.info('Flagging transaction for manual review', {
      transactionId,
      riskScore: fraudAnalysis.riskScore,
      riskLevel: fraudAnalysis.riskLevel,
    });

    await this.updateTransactionStatus(transactionId, 'pending', {
      requiresManualReview: true,
      fraudAnalysis,
      reviewReason: 'High fraud risk detected',
    });

    // In a real implementation, this would trigger a notification
    // to the fraud review team
  }

  private async executePaymentWithRetry(
    transaction: Transaction,
    request: PaymentRequest,
    context: ProcessingContext
  ): Promise<PaymentResponse> {
    const retryConfig: RetryConfig = {
      maxRetries: this.config.maxRetries,
      baseDelayMs: this.config.retryDelayMs,
      maxDelayMs: 30000,
      backoffMultiplier: 2,
      retryableErrors: [
        'NETWORK_ERROR',
        'TIMEOUT_ERROR',
        'GATEWAY_UNAVAILABLE',
        'RATE_LIMITED',
      ],
    };

    return this.executeWithRetry(
      () => this.executePayment(transaction, request, context),
      retryConfig,
      context
    );
  }

  private async executePayment(
    transaction: Transaction,
    request: PaymentRequest,
    context: ProcessingContext
  ): Promise<PaymentResponse> {
    // Update status to processing
    await this.updateTransactionStatus(transaction.id, 'processing');

    // Select optimal gateway
    const gateway = await this.gatewayManager.selectBestGateway(
      request.amount,
      request.currency
    );

    // Update transaction with selected gateway
    await this.transactionService.update(transaction.id, {
      gatewayId: gateway.getId(),
    });

    // Process payment through gateway
    const gatewayResponse = await gateway.processPayment({
      ...request,
      transactionId: transaction.id,
      idempotencyKey: context.idempotencyKey,
    });

    // Update transaction with gateway response
    await this.transactionService.update(transaction.id, {
      gatewayTransactionId: gatewayResponse.id,
      status: gatewayResponse.status as PaymentStatus,
      processedAt:
        gatewayResponse.status === 'SUCCEEDED' ? new Date() : undefined,
      settledAt:
        gatewayResponse.status === 'SUCCEEDED' ? new Date() : undefined,
      metadata: {
        ...transaction.metadata,
        gatewayResponse: {
          id: gatewayResponse.id,
          status: gatewayResponse.status,
          processedAt: new Date().toISOString(),
        },
      },
    });

    return {
      id: transaction.id,
      status: gatewayResponse.status as PaymentStatus,
      amount: gatewayResponse.amount,
      currency: gatewayResponse.currency,
      clientSecret: gatewayResponse.clientSecret,
      requiresAction: gatewayResponse.requiresAction,
      nextAction: gatewayResponse.nextAction,
      paymentMethod: gatewayResponse.paymentMethod,
      metadata: gatewayResponse.metadata,
      createdAt: transaction.createdAt,
    };
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    retryConfig: RetryConfig,
    context: ProcessingContext
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= retryConfig.maxRetries + 1; attempt++) {
      try {
        context.attempt = attempt;

        if (attempt > 1) {
          logger.info('Retrying operation', {
            transactionId: context.transactionId,
            attempt,
            maxRetries: retryConfig.maxRetries,
          });
        }

        return await this.executeWithTimeout(operation, this.config.timeoutMs);
      } catch (error) {
        lastError = error as Error;

        logger.warn('Operation failed', {
          transactionId: context.transactionId,
          attempt,
          error: lastError.message,
        });

        // Check if error is retryable
        if (
          attempt <= retryConfig.maxRetries &&
          this.isRetryableError(lastError, retryConfig)
        ) {
          const delay = Math.min(
            retryConfig.baseDelayMs *
              Math.pow(retryConfig.backoffMultiplier, attempt - 1),
            retryConfig.maxDelayMs
          );

          logger.info('Scheduling retry', {
            transactionId: context.transactionId,
            attempt: attempt + 1,
            delayMs: delay,
          });

          await this.sleep(delay);
          continue;
        }

        // Max retries reached or non-retryable error
        break;
      }
    }

    logger.error('Operation failed after all retries', {
      transactionId: context.transactionId,
      attempts: context.attempt,
      error: lastError.message,
    });

    throw lastError;
  }

  private async executeWithTimeout<T>(
    operation: () => Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    return Promise.race([
      operation(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Operation timeout')), timeoutMs)
      ),
    ]);
  }

  private isRetryableError(error: Error, retryConfig: RetryConfig): boolean {
    const errorMessage = error.message.toLowerCase();

    return retryConfig.retryableErrors.some(retryableError =>
      errorMessage.includes(retryableError.toLowerCase())
    );
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async handlePostProcessing(
    transaction: Transaction,
    result: PaymentResponse,
    context: ProcessingContext
  ): Promise<void> {
    try {
      // Handle split payments if configured
      if (this.config.enableSplitPayments && transaction.splits?.length) {
        await this.processSplitPayments(transaction.id);
      }

      // Send notifications
      await this.sendPaymentNotifications(transaction, result);

      // Update analytics
      await this.updateAnalytics(transaction, result, context);
    } catch (error) {
      logger.warn('Post-processing failed, but payment was successful', {
        transactionId: transaction.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private async processSplitPayments(transactionId: string): Promise<void> {
    logger.info('Processing split payments', { transactionId });
    await this.transactionService.processSplits(transactionId);
  }

  private async sendPaymentNotifications(
    transaction: Transaction,
    result: PaymentResponse
  ): Promise<void> {
    // In a real implementation, this would integrate with the notification service
    logger.info('Sending payment notifications', {
      transactionId: transaction.id,
      status: result.status,
      userId: transaction.userId,
    });
  }

  private async updateAnalytics(
    transaction: Transaction,
    result: PaymentResponse,
    context: ProcessingContext
  ): Promise<void> {
    const processingTime = Date.now() - context.startTime.getTime();

    logger.info('Updating payment analytics', {
      transactionId: transaction.id,
      status: result.status,
      processingTime,
      attempts: context.attempt,
    });

    // Record metrics with gateway manager
    if (transaction.gatewayId) {
      await this.gatewayManager.recordMetrics(transaction.gatewayId, {
        transactionCount: 1,
        successRate: result.status === 'SUCCEEDED' ? 1.0 : 0.0,
        errorRate: result.status === 'FAILED' ? 1.0 : 0.0,
        responseTime: processingTime,
      });
    }
  }

  private async handleProcessingFailure(
    transactionId: string,
    error: Error
  ): Promise<void> {
    try {
      await this.updateTransactionStatus(transactionId, 'failed', {
        errorMessage: error.message,
        errorType: error.constructor.name,
        failedAt: new Date().toISOString(),
      });
    } catch (updateError) {
      logger.error(
        'Failed to update transaction status after processing failure',
        {
          transactionId,
          originalError: error.message,
          updateError:
            updateError instanceof Error
              ? updateError.message
              : 'Unknown error',
        }
      );
    }
  }

  private async executeCaptureWithRetry(
    transaction: Transaction,
    amount: number | undefined,
    context: ProcessingContext
  ): Promise<PaymentResponse> {
    const retryConfig: RetryConfig = {
      maxRetries: this.config.maxRetries,
      baseDelayMs: this.config.retryDelayMs,
      maxDelayMs: 30000,
      backoffMultiplier: 2,
      retryableErrors: [
        'NETWORK_ERROR',
        'TIMEOUT_ERROR',
        'GATEWAY_UNAVAILABLE',
      ],
    };

    return this.executeWithRetry(
      () => this.executeCapture(transaction, amount, context),
      retryConfig,
      context
    );
  }

  private async executeCapture(
    transaction: Transaction,
    amount: number | undefined,
    context: ProcessingContext
  ): Promise<PaymentResponse> {
    const gateway = this.gatewayManager.getGateway(transaction.gatewayId);
    if (!gateway) {
      throw new ValidationError(`Gateway ${transaction.gatewayId} not found`);
    }

    const captureResult = await gateway.capturePayment(
      transaction.gatewayTransactionId || transaction.id,
      amount
    );

    // Update transaction status
    await this.updateTransactionStatus(
      transaction.id,
      captureResult.status as PaymentStatus
    );

    return {
      id: transaction.id,
      status: captureResult.status as PaymentStatus,
      amount: captureResult.amount,
      currency: captureResult.currency,
      metadata: captureResult.metadata,
      createdAt: transaction.createdAt,
    };
  }

  private async executeCancellationWithRetry(
    transaction: Transaction,
    reason: string | undefined,
    context: ProcessingContext
  ): Promise<PaymentResponse> {
    const retryConfig: RetryConfig = {
      maxRetries: this.config.maxRetries,
      baseDelayMs: this.config.retryDelayMs,
      maxDelayMs: 30000,
      backoffMultiplier: 2,
      retryableErrors: [
        'NETWORK_ERROR',
        'TIMEOUT_ERROR',
        'GATEWAY_UNAVAILABLE',
      ],
    };

    return this.executeWithRetry(
      () => this.executeCancellation(transaction, reason, context),
      retryConfig,
      context
    );
  }

  private async executeCancellation(
    transaction: Transaction,
    reason: string | undefined,
    context: ProcessingContext
  ): Promise<PaymentResponse> {
    const gateway = this.gatewayManager.getGateway(transaction.gatewayId);
    if (!gateway) {
      throw new ValidationError(`Gateway ${transaction.gatewayId} not found`);
    }

    const cancelResult = await gateway.cancelPayment(
      transaction.gatewayTransactionId || transaction.id
    );

    // Update transaction status
    await this.updateTransactionStatus(transaction.id, 'cancelled', {
      cancellationReason: reason,
      cancelledAt: new Date().toISOString(),
    });

    return {
      id: transaction.id,
      status: 'cancelled',
      amount: cancelResult.amount,
      currency: cancelResult.currency,
      metadata: { ...cancelResult.metadata, cancellationReason: reason },
      createdAt: transaction.createdAt,
    };
  }

  private validateCaptureEligibility(
    transaction: Transaction,
    amount?: number
  ): void {
    if (!['pending', 'processing'].includes(transaction.status)) {
      throw new ValidationError(
        `Cannot capture payment with status: ${transaction.status}`
      );
    }

    if (amount && amount > transaction.amount.toNumber()) {
      throw new ValidationError('Capture amount cannot exceed original amount');
    }
  }

  private validateCancellationEligibility(transaction: Transaction): void {
    if (!['pending', 'processing'].includes(transaction.status)) {
      throw new ValidationError(
        `Cannot cancel payment with status: ${transaction.status}`
      );
    }
  }

  private validateStatusTransition(
    currentStatus: PaymentStatus,
    newStatus: PaymentStatus
  ): void {
    const validTransitions: Record<PaymentStatus, PaymentStatus[]> = {
      pending: ['processing', 'cancelled', 'failed'],
      processing: ['succeeded', 'failed', 'cancelled', 'requires_action'],
      succeeded: ['refunded', 'partially_refunded', 'disputed'],
      failed: [], // Terminal state
      cancelled: [], // Terminal state
      refunded: ['disputed'], // Can still be disputed
      partially_refunded: ['refunded', 'disputed'],
      disputed: [], // Terminal state
      expired: [], // Terminal state
      requires_action: ['processing', 'failed', 'cancelled'],
    };

    const allowedTransitions = validTransitions[currentStatus] || [];

    if (!allowedTransitions.includes(newStatus)) {
      throw new ValidationError(
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }
  }

  private startIdempotencyCleanup(): void {
    // Clean up expired idempotency keys every hour
    setInterval(
      () => {
        const now = Date.now();
        for (const [key, value] of this.idempotencyCache.entries()) {
          try {
            const result = JSON.parse(value);
            const createdAt = new Date(result.createdAt).getTime();

            if (now - createdAt > this.config.idempotencyTtlMs) {
              this.idempotencyCache.delete(key);
            }
          } catch (error) {
            // Invalid cached data, remove it
            this.idempotencyCache.delete(key);
          }
        }
      },
      60 * 60 * 1000
    ); // 1 hour
  }
}
