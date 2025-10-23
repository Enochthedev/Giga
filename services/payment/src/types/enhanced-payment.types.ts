/**
 * Enhanced Payment Types - Aligned with Payment Service Specifications
 */

// Core Enums
export enum TransactionType {
  PAYMENT = 'payment',
  REFUND = 'refund',
  TRANSFER = 'transfer',
  PAYOUT = 'payout',
  FEE = 'fee',
}

export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REQUIRES_ACTION = 'requires_action',
  DISPUTED = 'disputed',
}

export enum PaymentMethodType {
  CARD = 'card',
  BANK_ACCOUNT = 'bank_account',
  DIGITAL_WALLET = 'digital_wallet',
  CRYPTOCURRENCY = 'cryptocurrency',
  BUY_NOW_PAY_LATER = 'buy_now_pay_later',
}

export enum WalletType {
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  AMAZON_PAY = 'amazon_pay',
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum FraudRecommendation {
  APPROVE = 'approve',
  REVIEW = 'review',
  DECLINE = 'decline',
  CHALLENGE = 'challenge',
}

export enum FraudCheckType {
  VELOCITY = 'velocity',
  GEOLOCATION = 'geolocation',
  DEVICE_FINGERPRINT = 'device_fingerprint',
  EMAIL_VERIFICATION = 'email_verification',
  PHONE_VERIFICATION = 'phone_verification',
  ADDRESS_VERIFICATION = 'address_verification',
  CVV_CHECK = 'cvv_check',
  BLACKLIST = 'blacklist',
}

export enum CheckResult {
  PASS = 'pass',
  FAIL = 'fail',
  WARNING = 'warning',
}

// Core Interfaces
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface PaymentMethodInfo {
  id: string;
  type: PaymentMethodType;

  // Card details (tokenized)
  card?: {
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
    fingerprint: string;
  };

  // Bank account details (tokenized)
  bankAccount?: {
    last4: string;
    bankName: string;
    accountType: string;
    routingNumber?: string;
  };

  // Digital wallet info
  wallet?: {
    type: WalletType;
    email?: string;
    phone?: string;
  };

  // Verification status
  verified: boolean;
  verificationMethod?: string;

  // Metadata
  isDefault: boolean;
  customerId: string;
  createdAt: Date;
}

export interface PaymentSplit {
  vendorId: string;
  amount: number;
  currency: string;
  platformFee: number;
  description?: string;
}

export interface FraudCheck {
  type: FraudCheckType;
  result: CheckResult;
  score: number;
  details?: Record<string, any>;
}

export interface FraudFlag {
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  details?: Record<string, any>;
}

export interface FraudAnalysis {
  transactionId: string;
  riskScore: number; // 0-100
  riskLevel: RiskLevel;

  // Analysis results
  checks: FraudCheck[];
  flags: FraudFlag[];

  // Decision
  recommendation: FraudRecommendation;
  requiresReview: boolean;

  // Analysis metadata
  model: string;
  version: string;
  analyzedAt: Date;
}

export interface Refund {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  reason: string;
  status: string;
  processedAt?: Date;
  createdAt: Date;
}

export interface Dispute {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  reason: string;
  status: string;
  evidenceRequired?: string[];
  dueDate?: Date;
  createdAt: Date;
}

// Enhanced Transaction Model
export interface EnhancedTransaction {
  id: string;
  externalId?: string; // Gateway transaction ID

  // Basic transaction info
  amount: number;
  currency: string;
  description: string;

  // Customer information
  customerId: string;
  customerEmail?: string;
  billingAddress?: Address;

  // Payment method
  paymentMethod: PaymentMethodInfo;

  // Transaction details
  type: TransactionType;
  status: TransactionStatus;
  gatewayUsed: string;

  // Marketplace features
  splits?: PaymentSplit[];
  platformFee?: number;

  // Risk and fraud
  riskScore?: number;
  fraudAnalysis?: FraudAnalysis;

  // Enhanced metadata with service identification
  metadata: {
    // Service identification (required)
    service: string;
    serviceVersion: string;
    source: string;

    // Context information
    timestamp: string;
    environment: string;

    // Service-specific data
    orderId?: string;
    bookingId?: string;
    subscriptionId?: string;

    // Additional metadata
    [key: string]: any;
  };

  // Timestamps
  createdAt: Date;
  processedAt?: Date;
  settledAt?: Date;

  // Related transactions
  refunds?: Refund[];
  disputes?: Dispute[];
}

// Payment Request/Response Types
export interface EnhancedPaymentRequest {
  amount: number;
  currency: string;
  description?: string;

  // Customer information
  customerId: string;
  customerEmail?: string;
  billingAddress?: Address;

  // Payment method
  paymentMethodId?: string;
  paymentMethodData?: PaymentMethodData;

  // Transaction options
  captureMethod?: 'automatic' | 'manual';
  confirmationMethod?: 'automatic' | 'manual';
  savePaymentMethod?: boolean;

  // Marketplace features
  splits?: PaymentSplit[];
  platformFee?: number;

  // Service identification (required)
  metadata: {
    service: string;
    serviceVersion: string;
    source: string;
    timestamp: string;
    environment: string;
    [key: string]: any;
  };

  // Idempotency
  idempotencyKey?: string;
}

export interface PaymentMethodData {
  type: PaymentMethodType;

  // Card data
  card?: {
    number: string;
    expiryMonth: number;
    expiryYear: number;
    cvc: string;
    holderName: string;
  };

  // Bank account data
  bankAccount?: {
    accountNumber: string;
    routingNumber: string;
    accountType: 'checking' | 'savings';
    holderName: string;
  };

  // Wallet data
  wallet?: {
    type: WalletType;
    token?: string;
    email?: string;
  };

  // Billing address
  billingAddress?: Address;
}

export interface EnhancedPaymentResult {
  id: string;
  status: TransactionStatus;
  amount: number;
  currency: string;

  // Client interaction
  clientSecret?: string;
  confirmationUrl?: string;
  requiresAction?: boolean;
  nextAction?: {
    type: string;
    redirectUrl?: string;
    useStripeSdk?: boolean;
  };

  // Payment method
  paymentMethod?: PaymentMethodInfo;

  // Gateway information
  gatewayId: string;
  gatewayTransactionId?: string;

  // Risk assessment
  riskScore?: number;
  riskLevel?: RiskLevel;
  fraudAnalysis?: FraudAnalysis;

  // Marketplace
  splits?: PaymentSplit[];
  platformFee?: number;

  // Metadata
  metadata: Record<string, any>;

  // Timestamps
  createdAt: Date;
  processedAt?: Date;
}

// Gateway Types
export interface GatewayConfig {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;

  // Configuration
  apiKey: string;
  secretKey: string;
  webhookSecret?: string;

  // Features
  supportedPaymentMethods: PaymentMethodType[];
  supportedCurrencies: string[];
  supportedCountries: string[];

  // Limits
  minAmount?: number;
  maxAmount?: number;

  // Fees
  fixedFee?: number;
  percentageFee?: number;
}

export interface GatewayResponse {
  success: boolean;
  transactionId: string;
  gatewayTransactionId?: string;
  status: TransactionStatus;

  // Gateway-specific data
  rawResponse: any;
  responseCode?: string;
  responseMessage?: string;

  // Client interaction
  clientSecret?: string;
  confirmationUrl?: string;
  requiresAction?: boolean;

  // Error information
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  lastCheck: Date;
  responseTime?: number;
  errorRate?: number;
  uptime?: number;
}

export interface GatewayMetrics {
  successRate: number;
  averageResponseTime: number;
  errorRate: number;
  transactionVolume: number;
  lastUpdated: Date;
}

// Service Interfaces
export interface PaymentGateway {
  id: string;
  name: string;

  processPayment(request: EnhancedPaymentRequest): Promise<GatewayResponse>;
  capturePayment(
    transactionId: string,
    amount?: number
  ): Promise<GatewayResponse>;
  voidPayment(transactionId: string): Promise<GatewayResponse>;
  refundPayment(
    transactionId: string,
    amount?: number,
    reason?: string
  ): Promise<GatewayResponse>;

  getTransactionStatus(transactionId: string): Promise<GatewayResponse>;

  // Health and monitoring
  checkHealth(): Promise<HealthStatus>;
  getMetrics(): Promise<GatewayMetrics>;

  // Configuration
  supportsPaymentMethod(type: PaymentMethodType): boolean;
  supportsCurrency(currency: string): boolean;
  supportsCountry(country: string): boolean;
}

export interface EnhancedPaymentService {
  // Payment processing
  processPayment(
    request: EnhancedPaymentRequest
  ): Promise<EnhancedPaymentResult>;
  processRefund(refundRequest: RefundRequest): Promise<RefundResult>;
  capturePayment(paymentId: string, amount?: number): Promise<CaptureResult>;
  voidPayment(paymentId: string): Promise<VoidResult>;

  // Payment methods
  savePaymentMethod(
    customerId: string,
    paymentMethod: PaymentMethodData
  ): Promise<PaymentMethodInfo>;
  deletePaymentMethod(paymentMethodId: string): Promise<void>;
  getPaymentMethods(customerId: string): Promise<PaymentMethodInfo[]>;

  // Transaction management
  getTransaction(transactionId: string): Promise<EnhancedTransaction>;
  getTransactionHistory(
    filters: TransactionFilters
  ): Promise<EnhancedTransaction[]>;

  // Health and monitoring
  getServiceHealth(): Promise<HealthStatus>;
  getGatewayStatus(): Promise<Record<string, HealthStatus>>;
  getServiceMetrics(): Promise<ServiceMetrics>;
}

// Additional Types
export interface RefundRequest {
  paymentId: string;
  amount?: number;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface RefundResult {
  id: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: string;
  reason?: string;
  processedAt?: Date;
  estimatedArrival?: Date;
}

export interface CaptureResult {
  id: string;
  status: TransactionStatus;
  amount: number;
  currency: string;
  capturedAt: Date;
}

export interface VoidResult {
  id: string;
  status: TransactionStatus;
  voidedAt: Date;
}

export interface TransactionFilters {
  customerId?: string;
  status?: TransactionStatus;
  type?: TransactionType;
  gatewayId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
  currency?: string;
  page?: number;
  limit?: number;
}

export interface ServiceMetrics {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalAmount: number;
  averageAmount: number;
  averageResponseTime: number;

  // Service breakdown
  serviceBreakdown: Record<
    string,
    {
      count: number;
      amount: number;
      successRate: number;
    }
  >;

  // Gateway breakdown
  gatewayBreakdown: Record<
    string,
    {
      count: number;
      amount: number;
      successRate: number;
      averageResponseTime: number;
    }
  >;

  // Time period
  periodStart: Date;
  periodEnd: Date;
}

export interface PaymentServiceConfig {
  service: {
    name: string;
    version: string;
    environment: string;
  };
  gateways: {
    primary: string;
    fallbacks: string[];
    configs: Record<string, GatewayConfig>;
  };
  fraud: {
    enabled: boolean;
    riskThreshold: number;
    reviewThreshold: number;
  };
  features: {
    splits: boolean;
    subscriptions: boolean;
    marketplace: boolean;
  };
}
