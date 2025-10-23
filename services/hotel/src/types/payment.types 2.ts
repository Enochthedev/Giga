/**
 * Payment-related type definitions for the Hotel Service
 */

export interface PaymentRequest {
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethodDetails;
  description?: string;
  metadata?: Record<string, any>;
  idempotencyKey?: string;
}

export interface PaymentMethodDetails {
  type: PaymentMethodType;
  cardDetails?: CardDetails;
  bankTransferDetails?: BankTransferDetails;
  digitalWalletDetails?: DigitalWalletDetails;
  corporateAccountDetails?: CorporateAccountDetails;
}

export interface CardDetails {
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  cardholderName: string;
  billingAddress?: BillingAddress;
}

export interface BankTransferDetails {
  accountNumber: string;
  routingNumber: string;
  accountHolderName: string;
  bankName: string;
}

export interface DigitalWalletDetails {
  walletType: DigitalWalletType;
  walletId: string;
  email?: string;
}

export interface CorporateAccountDetails {
  accountId: string;
  companyName: string;
  billingContact: string;
  purchaseOrderNumber?: string;
}

export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  CASH = 'cash',
  CORPORATE_ACCOUNT = 'corporate_account',
  VOUCHER = 'voucher',
  LOYALTY_POINTS = 'loyalty_points',
}

export enum DigitalWalletType {
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  SAMSUNG_PAY = 'samsung_pay',
}

export interface PaymentResult {
  id: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  transactionId?: string;
  gatewayResponse?: GatewayResponse;
  failureReason?: string;
  processedAt: Date;
  metadata?: Record<string, any>;
}

export interface GatewayResponse {
  gatewayId: string;
  transactionId: string;
  authorizationCode?: string;
  responseCode: string;
  responseMessage: string;
  rawResponse?: Record<string, any>;
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  AUTHORIZED = 'authorized',
  CAPTURED = 'captured',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  REQUIRES_ACTION = 'requires_action',
}

// Deposit and Payment Schedule Types
export interface DepositRequest {
  bookingId: string;
  depositType: DepositType;
  amount?: number;
  percentage?: number;
  dueDate?: Date;
  paymentMethod: PaymentMethodDetails;
  description?: string;
}

export interface PaymentSchedule {
  id: string;
  bookingId: string;
  totalAmount: number;
  currency: string;
  payments: ScheduledPayment[];
  status: PaymentScheduleStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduledPayment {
  id: string;
  scheduleId: string;
  amount: number;
  dueDate: Date;
  type: PaymentType;
  status: PaymentStatus;
  description?: string;
  paymentResult?: PaymentResult;
  processedAt?: Date;
}

export enum DepositType {
  FIXED_AMOUNT = 'fixed_amount',
  PERCENTAGE = 'percentage',
  FIRST_NIGHT = 'first_night',
  FULL_AMOUNT = 'full_amount',
  NO_DEPOSIT = 'no_deposit',
}

export enum PaymentType {
  DEPOSIT = 'deposit',
  BALANCE = 'balance',
  INSTALLMENT = 'installment',
  PENALTY = 'penalty',
  FEE = 'fee',
  TAX = 'tax',
}

export enum PaymentScheduleStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  OVERDUE = 'overdue',
  FAILED = 'failed',
}

// Refund Types
export interface RefundRequest {
  paymentId: string;
  bookingId: string;
  amount: number;
  reason: RefundReason;
  description?: string;
  metadata?: Record<string, any>;
}

export interface RefundResult {
  id: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: RefundStatus;
  reason: RefundReason;
  transactionId?: string;
  gatewayResponse?: GatewayResponse;
  processedAt?: Date;
  estimatedArrival?: Date;
  failureReason?: string;
}

export enum RefundReason {
  CANCELLATION = 'cancellation',
  MODIFICATION = 'modification',
  NO_SHOW_POLICY = 'no_show_policy',
  OVERBOOKING = 'overbooking',
  SERVICE_ISSUE = 'service_issue',
  DUPLICATE_PAYMENT = 'duplicate_payment',
  FRAUD = 'fraud',
  CUSTOMER_REQUEST = 'customer_request',
  SYSTEM_ERROR = 'system_error',
}

export enum RefundStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

// Payment Gateway Integration Types
export interface PaymentGateway {
  id: string;
  name: string;
  type: PaymentGatewayType;
  isActive: boolean;
  supportedMethods: PaymentMethodType[];
  supportedCurrencies: string[];
  configuration: PaymentGatewayConfig;
}

export enum PaymentGatewayType {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  SQUARE = 'square',
  ADYEN = 'adyen',
  BRAINTREE = 'braintree',
  AUTHORIZE_NET = 'authorize_net',
  WORLDPAY = 'worldpay',
}

export interface PaymentGatewayConfig {
  apiKey: string;
  secretKey: string;
  webhookSecret?: string;
  environment: 'sandbox' | 'production';
  merchantId?: string;
  additionalSettings?: Record<string, any>;
}

// Payment Processing Interfaces
export interface PaymentProcessor {
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
  authorizePayment(request: PaymentRequest): Promise<PaymentResult>;
  capturePayment(paymentId: string, amount?: number): Promise<PaymentResult>;
  voidPayment(paymentId: string): Promise<PaymentResult>;
  refundPayment(request: RefundRequest): Promise<RefundResult>;
  getPaymentStatus(paymentId: string): Promise<PaymentResult>;
}

export interface DepositManager {
  calculateDeposit(
    booking: any,
    depositType: DepositType,
    value?: number
  ): Promise<DepositCalculation>;
  processDeposit(request: DepositRequest): Promise<PaymentResult>;
  createPaymentSchedule(
    booking: any,
    scheduleType: PaymentScheduleType
  ): Promise<PaymentSchedule>;
  processScheduledPayment(paymentId: string): Promise<PaymentResult>;
  updatePaymentSchedule(
    scheduleId: string,
    updates: Partial<PaymentSchedule>
  ): Promise<PaymentSchedule>;
}

export interface RefundProcessor {
  calculateRefund(
    booking: any,
    cancellationPolicy: any
  ): Promise<RefundCalculation>;
  processRefund(request: RefundRequest): Promise<RefundResult>;
  getRefundStatus(refundId: string): Promise<RefundResult>;
  validateRefundEligibility(
    paymentId: string,
    amount: number
  ): Promise<RefundValidation>;
}

// Additional Types
export interface DepositCalculation {
  amount: number;
  currency: string;
  dueDate: Date;
  type: DepositType;
  description: string;
  breakdown: DepositBreakdown[];
}

export interface DepositBreakdown {
  description: string;
  amount: number;
  type: 'base' | 'tax' | 'fee';
}

export enum PaymentScheduleType {
  DEPOSIT_ONLY = 'deposit_only',
  DEPOSIT_AND_BALANCE = 'deposit_and_balance',
  INSTALLMENTS = 'installments',
  FULL_UPFRONT = 'full_upfront',
  PAY_AT_PROPERTY = 'pay_at_property',
}

export interface RefundValidation {
  isEligible: boolean;
  maxRefundAmount: number;
  restrictions: string[];
  processingTime: string;
  fees: RefundFee[];
}

export interface RefundFee {
  type: string;
  amount: number;
  description: string;
}

export interface RefundCalculation {
  totalRefund: number;
  currency: string;
  breakdown: RefundBreakdown[];
  penalties: RefundPenalty[];
  processingFees: RefundFee[];
  netRefund: number;
  estimatedProcessingTime: string;
}

export interface RefundBreakdown {
  description: string;
  amount: number;
  type: 'refund' | 'penalty' | 'fee';
}

export interface RefundPenalty {
  type: string;
  amount: number;
  description: string;
  percentage?: number;
}

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethodType;
  gatewayId: string;
  transactionId?: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date;
}

export enum TransactionType {
  PAYMENT = 'payment',
  REFUND = 'refund',
  AUTHORIZATION = 'authorization',
  CAPTURE = 'capture',
  VOID = 'void',
  CHARGEBACK = 'chargeback',
  DISPUTE = 'dispute',
}

export interface PaymentWebhook {
  id: string;
  gatewayId: string;
  eventType: string;
  paymentId?: string;
  transactionId?: string;
  status: WebhookStatus;
  payload: Record<string, any>;
  processedAt?: Date;
  retryCount: number;
  lastRetryAt?: Date;
  createdAt: Date;
}

export enum WebhookStatus {
  PENDING = 'pending',
  PROCESSED = 'processed',
  FAILED = 'failed',
  IGNORED = 'ignored',
}

// Service Configuration
export interface PaymentServiceConfig {
  defaultGateway: PaymentGatewayType;
  gateways: PaymentGateway[];
  depositSettings: DepositSettings;
  refundSettings: RefundSettings;
  securitySettings: PaymentSecuritySettings;
}

export interface DepositSettings {
  defaultType: DepositType;
  defaultPercentage: number;
  minimumAmount: number;
  maximumAmount: number;
  dueDateOffset: number; // days before check-in
}

export interface RefundSettings {
  automaticRefunds: boolean;
  maxRefundAmount: number;
  processingTime: number; // business days
  refundFeePercentage: number;
  minimumRefundAmount: number;
}

export interface PaymentSecuritySettings {
  enableFraudDetection: boolean;
  maxDailyAmount: number;
  maxTransactionAmount: number;
  requireCvv: boolean;
  require3DS: boolean;
  enableTokenization: boolean;
}
