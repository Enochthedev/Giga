import { HttpAuthServiceClient } from '../clients/auth.client';
import { HttpNotificationServiceClient } from '../clients/notification.client';
import { HttpPaymentServiceClient } from '../clients/payment.client';
import { PrismaClient } from '../generated/prisma-client';

/**
 * Transaction operation definition
 */
export interface TransactionOperation {
  id: string;
  service: string;
  operation: string;
  payload: any;
  idempotencyKey: string;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'ROLLED_BACK';
  retryCount: number;
  maxRetries: number;
  result?: any;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Distributed transaction definition
 */
export interface DistributedTransaction {
  id: string;
  type: string;
  status:
    | 'PENDING'
    | 'EXECUTING'
    | 'COMPLETED'
    | 'FAILED'
    | 'ROLLING_BACK'
    | 'ROLLED_BACK';
  operations: TransactionOperation[];
  metadata: Record<string, any>;
  timeout: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

/**
 * Transaction result
 */
export interface TransactionResult {
  success: boolean;
  transactionId: string;
  results: Record<string, any>;
  error?: string;
  rollbackExecuted: boolean;
}

/**
 * Idempotency record for ensuring operations are not duplicated
 */
export interface IdempotencyRecord {
  key: string;
  operation: string;
  result: any;
  status: 'COMPLETED' | 'FAILED';
  createdAt: Date;
  expiresAt: Date;
}

/**
 * Service operation interface for standardized service calls
 */
export interface ServiceOperation {
  execute(payload: any, idempotencyKey: string): Promise<any>;
  rollback(payload: any, result: any): Promise<void>;
  isIdempotent: boolean;
}

/**
 * Distributed transaction coordinator for managing cross-service operations
 * with proper rollback mechanisms and idempotency handling
 */
export class TransactionCoordinator {
  private readonly transactionTimeout = 300000; // 5 minutes default timeout
  private readonly idempotencyTTL = 86400000; // 24 hours
  private readonly serviceOperations: Map<string, ServiceOperation> = new Map();

  constructor(
    private prisma: PrismaClient,
    private authServiceClient: HttpAuthServiceClient,
    private paymentServiceClient: HttpPaymentServiceClient,
    private notificationServiceClient: HttpNotificationServiceClient
  ) {
    this.initializeServiceOperations();
  }

  /**
   * Initialize service operations registry
   */
  private initializeServiceOperations(): void {
    // Payment service operations
    this.serviceOperations.set('payment:create_intent', {
      execute: (payload, idempotencyKey) => {
        return this.paymentServiceClient.createPaymentIntent(
          payload.amount,
          payload.currency,
          payload.customerId,
          { ...payload.metadata, idempotencyKey }
        );
      },
      rollback: async (payload, result) => {
        if (result?.id) {
          await this.paymentServiceClient.cancelPaymentIntent(result.id);
        }
      },
      isIdempotent: true,
    });

    this.serviceOperations.set('payment:confirm', {
      execute: (payload, _idempotencyKey) => {
        return this.paymentServiceClient.confirmPayment(
          payload.paymentIntentId
        );
      },
      rollback: async (payload, result) => {
        if (result?.success && payload.paymentIntentId) {
          await this.paymentServiceClient.refundPayment(
            payload.paymentIntentId
          );
        }
      },
      isIdempotent: true,
    });

    this.serviceOperations.set('payment:refund', {
      execute: (payload, _idempotencyKey) => {
        return this.paymentServiceClient.refundPayment(
          payload.paymentIntentId,
          payload.amount
        );
      },
      rollback: async () => {
        // Refunds cannot be rolled back
      },
      isIdempotent: true,
    });

    // Auth service operations
    this.serviceOperations.set('auth:get_user', {
      execute: (payload, _idempotencyKey) => {
        return this.authServiceClient.getUserInfo(payload.userId);
      },
      rollback: async () => {
        // Read operations don't need rollback
      },
      isIdempotent: true,
    });

    this.serviceOperations.set('auth:validate_permission', {
      execute: (payload, _idempotencyKey) => {
        return this.authServiceClient.checkUserPermission(
          payload.userId,
          payload.permission
        );
      },
      rollback: async () => {
        // Read operations don't need rollback
      },
      isIdempotent: true,
    });

    // Notification service operations
    this.serviceOperations.set('notification:send_order_confirmation', {
      execute: (payload, _idempotencyKey) => {
        return this.notificationServiceClient.sendOrderConfirmation(payload);
      },
      rollback: async () => {
        // Notifications cannot be rolled back, but we can send cancellation notice
      },
      isIdempotent: false, // Notifications should not be duplicated
    });

    this.serviceOperations.set('notification:send_vendor_notification', {
      execute: (payload, _idempotencyKey) => {
        return this.notificationServiceClient.sendVendorOrderNotification(
          payload
        );
      },
      rollback: async () => {
        // Notifications cannot be rolled back
      },
      isIdempotent: false,
    });
  }

  /**
   * Execute a distributed transaction with rollback capability
   */
  async executeTransaction(
    type: string,
    operations: Array<{
      service: string;
      operation: string;
      payload: any;
      maxRetries?: number;
    }>,
    metadata: Record<string, any> = {},
    timeout: number = this.transactionTimeout
  ): Promise<TransactionResult> {
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create distributed transaction record
    const transaction: DistributedTransaction = {
      id: transactionId,
      type,
      status: 'PENDING',
      operations: operations.map(op => ({
        id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        service: op.service,
        operation: op.operation,
        payload: op.payload,
        idempotencyKey: this.generateIdempotencyKey(
          op.service,
          op.operation,
          op.payload
        ),
        status: 'PENDING',
        retryCount: 0,
        maxRetries: op.maxRetries || 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      metadata,
      timeout,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.logTransaction(
      transaction,
      'TRANSACTION_STARTED',
      'Distributed transaction initiated'
    );

    try {
      transaction.status = 'EXECUTING';
      await this.updateTransaction(transaction);

      // Set timeout for the entire transaction
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Transaction timeout')), timeout);
      });

      // Execute operations with timeout
      const executionPromise = this.executeOperations(transaction);
      const results = await Promise.race([executionPromise, timeoutPromise]);

      transaction.status = 'COMPLETED';
      transaction.completedAt = new Date();
      await this.updateTransaction(transaction);
      await this.logTransaction(
        transaction,
        'TRANSACTION_COMPLETED',
        'All operations completed successfully'
      );

      return {
        success: true,
        transactionId,
        results,
        rollbackExecuted: false,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      transaction.status = 'FAILED';

      await this.logTransaction(
        transaction,
        'TRANSACTION_FAILED',
        `Transaction failed: ${errorMessage}`
      );
      await this.updateTransaction(transaction);

      // Execute rollback for completed operations
      const rollbackSuccess = await this.executeRollback(transaction);

      return {
        success: false,
        transactionId,
        results: {},
        error: errorMessage,
        rollbackExecuted: rollbackSuccess,
      };
    }
  }

  /**
   * Execute all operations in sequence with retry logic
   */
  private async executeOperations(
    transaction: DistributedTransaction
  ): Promise<Record<string, any>> {
    const results: Record<string, any> = {};

    for (const operation of transaction.operations) {
      try {
        operation.status = 'EXECUTING';
        await this.updateTransaction(transaction);
        await this.logTransaction(
          transaction,
          'OPERATION_STARTED',
          `Executing operation: ${operation.service}:${operation.operation}`
        );

        // Execute operation with retry logic
        const result = await this.executeOperationWithRetry(operation);

        operation.result = result;
        operation.status = 'COMPLETED';
        results[`${operation.service}:${operation.operation}`] = result;

        await this.logTransaction(
          transaction,
          'OPERATION_COMPLETED',
          `Operation completed: ${operation.service}:${operation.operation}`
        );
        await this.updateTransaction(transaction);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        operation.error = errorMessage;
        operation.status = 'FAILED';

        await this.logTransaction(
          transaction,
          'OPERATION_FAILED',
          `Operation failed: ${operation.service}:${operation.operation} - ${errorMessage}`
        );
        await this.updateTransaction(transaction);

        throw error;
      }
    }

    return results;
  }

  /**
   * Execute a single operation with retry logic and idempotency handling
   */
  private async executeOperationWithRetry(
    operation: TransactionOperation
  ): Promise<any> {
    const serviceOperation = this.serviceOperations.get(
      `${operation.service}:${operation.operation}`
    );

    if (!serviceOperation) {
      throw new Error(
        `Unknown service operation: ${operation.service}:${operation.operation}`
      );
    }

    // Check for existing idempotency record
    if (serviceOperation.isIdempotent) {
      const existingResult = await this.getIdempotencyRecord(
        operation.idempotencyKey
      );
      if (existingResult) {
        if (existingResult.status === 'COMPLETED') {
          return existingResult.result;
        } else if (existingResult.status === 'FAILED') {
          throw new Error(
            `Operation previously failed: ${existingResult.result?.error || 'Unknown error'}`
          );
        }
      }
    }

    let lastError: Error = new Error('Unknown error occurred');

    for (let attempt = 0; attempt <= operation.maxRetries; attempt++) {
      try {
        const result = await serviceOperation.execute(
          operation.payload,
          operation.idempotencyKey
        );

        // Store idempotency record for successful operations
        if (serviceOperation.isIdempotent) {
          await this.storeIdempotencyRecord(
            operation.idempotencyKey,
            operation.operation,
            result,
            'COMPLETED'
          );
        }

        operation.retryCount = attempt;
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        operation.retryCount = attempt + 1;

        // Don't retry on the last attempt
        if (attempt === operation.maxRetries) {
          break;
        }

        // Calculate delay for next retry with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt), 30000); // Max 30 seconds
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // Store idempotency record for failed operations
    if (serviceOperation.isIdempotent) {
      await this.storeIdempotencyRecord(
        operation.idempotencyKey,
        operation.operation,
        { error: lastError.message },
        'FAILED'
      );
    }

    throw lastError;
  }

  /**
   * Execute rollback for all completed operations in reverse order
   */
  private async executeRollback(
    transaction: DistributedTransaction
  ): Promise<boolean> {
    transaction.status = 'ROLLING_BACK';
    await this.updateTransaction(transaction);
    await this.logTransaction(
      transaction,
      'ROLLBACK_STARTED',
      'Starting rollback for failed transaction'
    );

    let rollbackSuccess = true;
    const completedOperations = transaction.operations
      .filter(op => op.status === 'COMPLETED')
      .reverse(); // Rollback in reverse order

    for (const operation of completedOperations) {
      try {
        await this.logTransaction(
          transaction,
          'ROLLBACK_OPERATION_STARTED',
          `Rolling back operation: ${operation.service}:${operation.operation}`
        );

        const serviceOperation = this.serviceOperations.get(
          `${operation.service}:${operation.operation}`
        );
        if (serviceOperation && operation.result) {
          await serviceOperation.rollback(operation.payload, operation.result);
        }

        operation.status = 'ROLLED_BACK';
        await this.logTransaction(
          transaction,
          'ROLLBACK_OPERATION_COMPLETED',
          `Rollback completed for operation: ${operation.service}:${operation.operation}`
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        await this.logTransaction(
          transaction,
          'ROLLBACK_OPERATION_FAILED',
          `Rollback failed for operation: ${operation.service}:${operation.operation} - ${errorMessage}`
        );
        rollbackSuccess = false;
        // Continue with other rollbacks even if one fails
      }
    }

    transaction.status = rollbackSuccess ? 'ROLLED_BACK' : 'FAILED';
    await this.updateTransaction(transaction);

    const message = rollbackSuccess
      ? 'All rollbacks completed successfully'
      : 'Some rollbacks failed - manual intervention may be required';

    await this.logTransaction(transaction, 'ROLLBACK_COMPLETED', message);

    return rollbackSuccess;
  }

  /**
   * Generate idempotency key for an operation
   */
  private generateIdempotencyKey(
    service: string,
    operation: string,
    payload: any
  ): string {
    const payloadHash = this.hashObject(payload);
    return `${service}:${operation}:${payloadHash}`;
  }

  /**
   * Hash an object to create a consistent key
   */
  private hashObject(obj: any): string {
    const str = JSON.stringify(obj, Object.keys(obj).sort());
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Store idempotency record
   */
  private storeIdempotencyRecord(
    key: string,
    operation: string,
    result: unknown,
    status: 'COMPLETED' | 'FAILED'
  ): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + this.idempotencyTTL);

      // In a production system, this would be stored in a database or cache
      // For now, we'll use an in-memory store (this should be replaced with Redis or database)
      const record: IdempotencyRecord = {
        key,
        operation,
        result,
        status,
        createdAt: new Date(),
        expiresAt,
      };

      // Store in memory (replace with persistent storage)
      this.idempotencyStore.set(key, record);

      // Clean up expired records periodically
      this.cleanupExpiredIdempotencyRecords();
    } catch (error) {
      console.error('Failed to store idempotency record:', error);
    }

    return Promise.resolve();
  }

  /**
   * Get idempotency record
   */
  private getIdempotencyRecord(key: string): Promise<IdempotencyRecord | null> {
    try {
      const record = this.idempotencyStore.get(key);

      if (!record) {
        return Promise.resolve(null);
      }

      // Check if record has expired
      if (record.expiresAt < new Date()) {
        this.idempotencyStore.delete(key);
        return Promise.resolve(null);
      }

      return Promise.resolve(record);
    } catch (error) {
      console.error('Failed to get idempotency record:', error);
      return Promise.resolve(null);
    }
  }

  // In-memory idempotency store (replace with Redis or database in production)
  private idempotencyStore: Map<string, IdempotencyRecord> = new Map();

  /**
   * Clean up expired idempotency records
   */
  private cleanupExpiredIdempotencyRecords(): void {
    const now = new Date();
    for (const [key, record] of this.idempotencyStore.entries()) {
      if (record.expiresAt < now) {
        this.idempotencyStore.delete(key);
      }
    }
  }

  /**
   * Log transaction events for monitoring and debugging
   */
  private logTransaction(
    transaction: DistributedTransaction,
    eventType: string,
    message: string
  ): Promise<void> {
    try {
      console.log(`[TX ${transaction.id}] ${eventType}: ${message}`, {
        transactionId: transaction.id,
        type: transaction.type,
        status: transaction.status,
        operationCount: transaction.operations.length,
        completedOperations: transaction.operations.filter(
          op => op.status === 'COMPLETED'
        ).length,
        timestamp: new Date().toISOString(),
      });

      // In production, this would log to a proper logging system
      // await this.prisma.transactionLog.create({
      //   data: {
      //     transactionId: transaction.id,
      //     eventType,
      //     message,
      //     context: JSON.stringify(transaction),
      //   },
      // });
    } catch (error) {
      console.error('Failed to log transaction event:', error);
    }

    return Promise.resolve();
  }

  /**
   * Update transaction state (could be stored in database for persistence)
   */
  private updateTransaction(
    transaction: DistributedTransaction
  ): Promise<void> {
    transaction.updatedAt = new Date();

    // In production, this would persist the transaction state to database
    // for recovery and monitoring purposes
    // await this.prisma.distributedTransaction.upsert({
    //   where: { id: transaction.id },
    //   update: {
    //     status: transaction.status,
    //     operations: JSON.stringify(transaction.operations),
    //     metadata: JSON.stringify(transaction.metadata),
    //     updatedAt: transaction.updatedAt,
    //     completedAt: transaction.completedAt,
    //   },
    //   create: {
    //     id: transaction.id,
    //     type: transaction.type,
    //     status: transaction.status,
    //     operations: JSON.stringify(transaction.operations),
    //     metadata: JSON.stringify(transaction.metadata),
    //     timeout: transaction.timeout,
    //     createdAt: transaction.createdAt,
    //     updatedAt: transaction.updatedAt,
    //     completedAt: transaction.completedAt,
    //   },
    // });

    return Promise.resolve();
  }

  /**
   * Get transaction status
   */
  getTransactionStatus(
    _transactionId: string
  ): Promise<DistributedTransaction | null> {
    // In production, this would query the database
    // return await this.prisma.distributedTransaction.findUnique({
    //   where: { id: transactionId },
    // });

    // For now, return null as we're not persisting transactions
    return Promise.resolve(null);
  }

  /**
   * Retry a failed transaction
   */
  retryTransaction(_transactionId: string): Promise<TransactionResult> {
    // In production, this would load the transaction from database and retry failed operations
    throw new Error(
      'Transaction retry not implemented - requires persistent transaction storage'
    );
  }

  /**
   * Cancel a pending transaction
   */
  cancelTransaction(_transactionId: string): Promise<boolean> {
    // In production, this would mark the transaction as cancelled and execute rollback
    throw new Error(
      'Transaction cancellation not implemented - requires persistent transaction storage'
    );
  }

  /**
   * Get transaction metrics for monitoring
   */
  getTransactionMetrics(_timeRange: { from: Date; to: Date }): Promise<{
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    averageExecutionTime: number;
    rollbackRate: number;
  }> {
    // In production, this would query transaction logs and calculate metrics
    return Promise.resolve({
      totalTransactions: 0,
      successfulTransactions: 0,
      failedTransactions: 0,
      averageExecutionTime: 0,
      rollbackRate: 0,
    });
  }
}
