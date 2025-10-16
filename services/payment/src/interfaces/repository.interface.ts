import {
  FilterParams,
  FraudAssessment,
  GatewayConfig,
  Invoice,
  PaginatedResponse,
  PaymentMethod,
  Refund,
  Subscription,
  Transaction,
  WebhookEvent,
} from '../types';

export interface IBaseRepository<T> {
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findMany(filters?: Record<string, any>): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  count(filters?: Record<string, any>): Promise<number>;
}

export interface ITransactionRepository extends IBaseRepository<Transaction> {
  findByUserId(
    userId: string,
    filters?: FilterParams
  ): Promise<PaginatedResponse<Transaction>>;
  findByMerchantId(
    merchantId: string,
    filters?: FilterParams
  ): Promise<PaginatedResponse<Transaction>>;
  findByStatus(
    status: string,
    filters?: FilterParams
  ): Promise<PaginatedResponse<Transaction>>;
  findByGateway(
    gatewayId: string,
    filters?: FilterParams
  ): Promise<PaginatedResponse<Transaction>>;
  findByDateRange(
    startDate: Date,
    endDate: Date,
    filters?: FilterParams
  ): Promise<PaginatedResponse<Transaction>>;
  findByExternalReference(reference: string): Promise<Transaction | null>;
  updateStatus(id: string, status: string): Promise<Transaction>;
  getVolumeByPeriod(
    startDate: Date,
    endDate: Date,
    groupBy: 'day' | 'week' | 'month'
  ): Promise<any[]>;
}

export interface IPaymentMethodRepository
  extends IBaseRepository<PaymentMethod> {
  findByUserId(userId: string): Promise<PaymentMethod[]>;
  findByToken(token: string): Promise<PaymentMethod | null>;
  findDefault(userId: string): Promise<PaymentMethod | null>;
  setDefault(id: string, userId: string): Promise<PaymentMethod>;
  deactivate(id: string): Promise<PaymentMethod>;
}

export interface IRefundRepository extends IBaseRepository<Refund> {
  findByTransactionId(transactionId: string): Promise<Refund[]>;
  findByStatus(status: string): Promise<Refund[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Refund[]>;
}

export interface ISubscriptionRepository extends IBaseRepository<Subscription> {
  findByUserId(userId: string): Promise<Subscription[]>;
  findByStatus(status: string): Promise<Subscription[]>;
  findByPlanId(planId: string): Promise<Subscription[]>;
  findExpiring(days: number): Promise<Subscription[]>;
  findTrialEnding(days: number): Promise<Subscription[]>;
}

export interface IInvoiceRepository extends IBaseRepository<Invoice> {
  findBySubscriptionId(subscriptionId: string): Promise<Invoice[]>;
  findByUserId(userId: string): Promise<Invoice[]>;
  findByStatus(status: string): Promise<Invoice[]>;
  findOverdue(): Promise<Invoice[]>;
  findUpcoming(days: number): Promise<Invoice[]>;
}

export interface IGatewayConfigRepository
  extends IBaseRepository<GatewayConfig> {
  findByType(type: string): Promise<GatewayConfig[]>;
  findActive(): Promise<GatewayConfig[]>;
  findByPriority(): Promise<GatewayConfig[]>;
}

export interface IFraudAssessmentRepository
  extends IBaseRepository<FraudAssessment> {
  findByTransactionId(transactionId: string): Promise<FraudAssessment | null>;
  findByRiskLevel(riskLevel: string): Promise<FraudAssessment[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<FraudAssessment[]>;
}

export interface IWebhookEventRepository extends IBaseRepository<WebhookEvent> {
  findByType(type: string): Promise<WebhookEvent[]>;
  findByGatewayId(gatewayId: string): Promise<WebhookEvent[]>;
  findUnprocessed(): Promise<WebhookEvent[]>;
  markProcessed(id: string): Promise<WebhookEvent>;
}
