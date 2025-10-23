import { Decimal } from 'decimal.js';

export interface Region {
  code: string; // ISO 3166-1 alpha-2 country code
  name: string;
  currency: string;
  timezone: string;
  locale: string;
  isActive: boolean;
  supportedPaymentMethods: PaymentMethodSupport[];
  taxConfiguration: TaxConfiguration;
  complianceRequirements: ComplianceRequirement[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethodSupport {
  type: string; // CARD, BANK_ACCOUNT, DIGITAL_WALLET, etc.
  subTypes: string[]; // Visa, MasterCard, PayPal, etc.
  isSupported: boolean;
  minimumAmount?: Decimal;
  maximumAmount?: Decimal;
  processingFee?: Decimal;
  processingFeePercentage?: Decimal;
  settlementTime?: number; // in hours
  restrictions?: string[];
}

export interface TaxConfiguration {
  vatRate?: Decimal; // VAT/GST rate as percentage
  salesTaxRate?: Decimal; // Sales tax rate as percentage
  witholdingTaxRate?: Decimal; // Withholding tax rate as percentage
  taxInclusivePricing: boolean; // Whether prices include tax
  taxCalculationMethod: 'inclusive' | 'exclusive' | 'compound';
  exemptCategories?: string[]; // Categories exempt from tax
  taxIdRequired: boolean; // Whether tax ID is required for transactions
  reverseChargeApplicable: boolean; // For B2B transactions in EU
}

export interface ComplianceRequirement {
  type: ComplianceType;
  description: string;
  isRequired: boolean;
  applicableTransactionTypes: string[];
  minimumAmount?: Decimal;
  maximumAmount?: Decimal;
  documentationRequired?: string[];
  reportingFrequency?:
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'quarterly'
    | 'annually';
  retentionPeriod?: number; // in months
}

export type ComplianceType =
  | 'KYC' // Know Your Customer
  | 'AML' // Anti-Money Laundering
  | 'PCI_DSS' // Payment Card Industry Data Security Standard
  | 'PSD2' // Payment Services Directive 2 (EU)
  | 'GDPR' // General Data Protection Regulation
  | 'SOX' // Sarbanes-Oxley Act
  | 'FATCA' // Foreign Account Tax Compliance Act
  | 'CRS' // Common Reporting Standard
  | 'LOCAL_BANKING' // Local banking regulations
  | 'CONSUMER_PROTECTION' // Consumer protection laws
  | 'DATA_LOCALIZATION'; // Data localization requirements

export interface TaxCalculationRequest {
  amount: Decimal;
  currency: string;
  region: string;
  transactionType: string;
  merchantCategory?: string;
  customerType?: 'individual' | 'business';
  customerTaxId?: string;
  merchantTaxId?: string;
  isExempt?: boolean;
  exemptionReason?: string;
}

export interface TaxCalculationResult {
  originalAmount: Decimal;
  taxAmount: Decimal;
  totalAmount: Decimal;
  taxRate: Decimal;
  taxType: string;
  breakdown: TaxBreakdown[];
  isExempt: boolean;
  exemptionReason?: string;
  calculatedAt: Date;
}

export interface TaxBreakdown {
  type: string; // VAT, Sales Tax, Withholding Tax, etc.
  rate: Decimal;
  amount: Decimal;
  description: string;
}

export interface RegionalPaymentMethod {
  region: string;
  paymentMethods: {
    type: string;
    name: string;
    localName: string;
    description: string;
    isPopular: boolean;
    supportedCurrencies: string[];
    processingTime: string;
    fees: {
      fixed?: Decimal;
      percentage?: Decimal;
      minimum?: Decimal;
      maximum?: Decimal;
    };
    requirements: string[];
    restrictions: string[];
  }[];
}

export interface ComplianceCheck {
  id: string;
  transactionId: string;
  region: string;
  complianceType: ComplianceType;
  status: ComplianceStatus;
  checkPerformed: Date;
  result: ComplianceResult;
  documentation?: string[];
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
}

export type ComplianceStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'PASSED'
  | 'FAILED'
  | 'REQUIRES_REVIEW'
  | 'EXEMPTED';

export interface ComplianceResult {
  passed: boolean;
  score?: number; // Risk score 0-100
  flags: ComplianceFlag[];
  recommendations: string[];
  requiredActions: string[];
  nextReviewDate?: Date;
}

export interface ComplianceFlag {
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  recommendation: string;
  autoResolvable: boolean;
}

export interface RegionalReport {
  region: string;
  period: {
    start: Date;
    end: Date;
  };
  transactionMetrics: {
    totalTransactions: number;
    totalVolume: Decimal;
    averageTransactionAmount: Decimal;
    paymentMethodBreakdown: Record<
      string,
      {
        count: number;
        volume: Decimal;
        percentage: number;
      }
    >;
  };
  taxMetrics: {
    totalTaxCollected: Decimal;
    taxByType: Record<string, Decimal>;
    exemptTransactions: number;
    exemptVolume: Decimal;
  };
  complianceMetrics: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    pendingChecks: number;
    complianceRate: number;
    flagsByType: Record<string, number>;
  };
}

export interface LocalizationSettings {
  defaultRegion: string;
  supportedRegions: string[];
  autoDetectRegion: boolean;
  fallbackRegion: string;
  taxCalculationEnabled: boolean;
  complianceCheckingEnabled: boolean;
  regionalPaymentMethodsEnabled: boolean;
  dataLocalizationEnabled: boolean;
}
