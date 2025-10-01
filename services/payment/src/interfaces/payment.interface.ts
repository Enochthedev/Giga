import {
  FilterParams,
  PaginatedResponse,
  PaymentMethod,
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
  Refund,
  Transaction,
} from '../types';

export interface IPaymentService {
  // Core payment operations
  processPayment(request: PaymentRequest): Promise<PaymentResponse>;
  capturePayment(
    transactionId: string,
    amount?: number
  ): Promise<PaymentResponse>;
  cancelPayment(transactionId: string): Promise<PaymentResponse>;

  // Refund operations
  refundPayment(
    transactionId: string,
    amount?: number,
    reason?: string
  ): Promise<Refund>;
  getRefund(refundId: string): Promise<Refund>;

  // Transaction management
  getTransaction(transactionId: string): Promise<Transaction>;
  getTransactions(
    filters: FilterParams
  ): Promise<PaginatedResponse<Transaction>>;
  updateTransactionStatus(
    transactionId: string,
    status: PaymentStatus
  ): Promise<Transaction>;

  // Payment method management
  createPaymentMethod(data: any): Promise<PaymentMethod>;
  getPaymentMethod(id: string): Promise<PaymentMethod>;
  updatePaymentMethod(id: string, data: any): Promise<PaymentMethod>;
  deletePaymentMethod(id: string): Promise<void>;
  getUserPaymentMethods(userId: string): Promise<PaymentMethod[]>;
}

export interface IPaymentMethodService {
  create(data: any): Promise<PaymentMethod>;
  getById(id: string): Promise<PaymentMethod>;
  getByUserId(userId: string): Promise<PaymentMethod[]>;
  update(id: string, data: any): Promise<PaymentMethod>;
  delete(id: string): Promise<void>;
  setDefault(id: string, userId: string): Promise<PaymentMethod>;
  tokenize(data: any): Promise<string>;
  validateToken(token: string): Promise<boolean>;
}

export interface ITransactionService {
  create(data: Partial<Transaction>): Promise<Transaction>;
  getById(id: string): Promise<Transaction>;
  getByFilters(filters: FilterParams): Promise<PaginatedResponse<Transaction>>;
  update(id: string, data: Partial<Transaction>): Promise<Transaction>;
  updateStatus(id: string, status: PaymentStatus): Promise<Transaction>;
  addSplit(transactionId: string, split: any): Promise<void>;
  processSplits(transactionId: string): Promise<void>;
}

export interface IRefundService {
  create(
    transactionId: string,
    amount?: number,
    reason?: string
  ): Promise<Refund>;
  getById(id: string): Promise<Refund>;
  getByTransactionId(transactionId: string): Promise<Refund[]>;
  process(refundId: string): Promise<Refund>;
  cancel(refundId: string): Promise<Refund>;
}
