// Base repository
export * from './base.repository';

// Specific repositories
export * from './payment-method.repository';
export * from './transaction.repository';

// Repository factory for dependency injection
import { PaymentMethodRepository } from './payment-method.repository';
import { TransactionRepository } from './transaction.repository';

export class RepositoryFactory {
  private static transactionRepository: TransactionRepository;
  private static paymentMethodRepository: PaymentMethodRepository;

  static getTransactionRepository(): TransactionRepository {
    if (!this.transactionRepository) {
      this.transactionRepository = new TransactionRepository();
    }
    return this.transactionRepository;
  }

  static getPaymentMethodRepository(): PaymentMethodRepository {
    if (!this.paymentMethodRepository) {
      this.paymentMethodRepository = new PaymentMethodRepository();
    }
    return this.paymentMethodRepository;
  }

  // Reset repositories (useful for testing)
  static reset(): void {
    this.transactionRepository = null as any;
    this.paymentMethodRepository = null as any;
  }
}

// Convenience exports
export const transactionRepository =
  RepositoryFactory.getTransactionRepository();
export const paymentMethodRepository =
  RepositoryFactory.getPaymentMethodRepository();
