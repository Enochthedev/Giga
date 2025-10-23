import { Decimal } from 'decimal.js';
import { logger } from '../lib/logger';
import {
  ComplianceCheck,
  ComplianceFlag,
  ComplianceRequirement,
  ComplianceResult,
  ComplianceStatus,
  LocalizationSettings,
} from '../types/localization.types';
import { Transaction } from '../types/payment.types';

export class ComplianceCheckingService {
  private settings: LocalizationSettings;
  private complianceChecks: Map<string, ComplianceCheck> = new Map();
  private complianceRequirements: Map<string, ComplianceRequirement[]> =
    new Map();

  constructor(settings: LocalizationSettings) {
    this.settings = settings;
    this.initializeComplianceRequirements();
  }

  private initializeComplianceRequirements(): void {
    // Initialize compliance requirements for different regions
    const requirements: Record<string, ComplianceRequirement[]> = {
      US: [
        {
          type: 'AML',
          description:
            'Anti-Money Laundering checks for transactions above $10,000',
          isRequired: true,
          applicableTransactionTypes: ['PAYMENT', 'TRANSFER'],
          minimumAmount: new Decimal(10000),
          documentationRequired: ['ID verification', 'Source of funds'],
          reportingFrequency: 'monthly',
          retentionPeriod: 60,
        },
        {
          type: 'KYC',
          description: 'Know Your Customer verification for new accounts',
          isRequired: true,
          applicableTransactionTypes: ['PAYMENT'],
          minimumAmount: new Decimal(3000),
          documentationRequired: ['Government ID', 'Address proof'],
          retentionPeriod: 84,
        },
        {
          type: 'PCI_DSS',
          description:
            'Payment Card Industry Data Security Standard compliance',
          isRequired: true,
          applicableTransactionTypes: ['PAYMENT'],
          documentationRequired: ['Security audit', 'Vulnerability scan'],
          reportingFrequency: 'annually',
          retentionPeriod: 36,
        },
      ],
      GB: [
        {
          type: 'PSD2',
          description:
            'Payment Services Directive 2 compliance for EU payments',
          isRequired: true,
          applicableTransactionTypes: ['PAYMENT'],
          minimumAmount: new Decimal(30), // EUR 30 for SCA
          documentationRequired: ['Strong Customer Authentication'],
          retentionPeriod: 60,
        },
        {
          type: 'GDPR',
          description: 'General Data Protection Regulation compliance',
          isRequired: true,
          applicableTransactionTypes: ['PAYMENT', 'REFUND'],
          documentationRequired: ['Data processing consent', 'Privacy policy'],
          retentionPeriod: 84,
        },
        {
          type: 'AML',
          description: 'Anti-Money Laundering checks',
          isRequired: true,
          applicableTransactionTypes: ['PAYMENT', 'TRANSFER'],
          minimumAmount: new Decimal(10000), // GBP 10,000
          documentationRequired: ['Enhanced due diligence'],
          reportingFrequency: 'monthly',
          retentionPeriod: 60,
        },
      ],
      NG: [
        {
          type: 'LOCAL_BANKING',
          description: 'Central Bank of Nigeria regulations',
          isRequired: true,
          applicableTransactionTypes: ['PAYMENT', 'TRANSFER'],
          minimumAmount: new Decimal(1000000), // NGN 1,000,000
          documentationRequired: ['BVN verification', 'Transaction purpose'],
          reportingFrequency: 'monthly',
          retentionPeriod: 60,
        },
        {
          type: 'KYC',
          description: 'Know Your Customer verification',
          isRequired: true,
          applicableTransactionTypes: ['PAYMENT'],
          minimumAmount: new Decimal(50000), // NGN 50,000
          documentationRequired: ['Valid ID', 'BVN', 'Address proof'],
          retentionPeriod: 84,
        },
        {
          type: 'AML',
          description: 'Anti-Money Laundering compliance',
          isRequired: true,
          applicableTransactionTypes: ['PAYMENT', 'TRANSFER'],
          minimumAmount: new Decimal(5000000), // NGN 5,000,000
          documentationRequired: ['Source of funds', 'Enhanced due diligence'],
          reportingFrequency: 'monthly',
          retentionPeriod: 60,
        },
      ],
      IN: [
        {
          type: 'LOCAL_BANKING',
          description: 'Reserve Bank of India regulations',
          isRequired: true,
          applicableTransactionTypes: ['PAYMENT', 'TRANSFER'],
          minimumAmount: new Decimal(200000), // INR 2,00,000
          documentationRequired: ['PAN verification', 'Transaction purpose'],
          reportingFrequency: 'monthly',
          retentionPeriod: 60,
        },
        {
          type: 'KYC',
          description: 'Know Your Customer verification',
          isRequired: true,
          applicableTransactionTypes: ['PAYMENT'],
          minimumAmount: new Decimal(50000), // INR 50,000
          documentationRequired: ['Aadhaar', 'PAN', 'Address proof'],
          retentionPeriod: 84,
        },
        {
          type: 'DATA_LOCALIZATION',
          description: 'Data localization requirements',
          isRequired: true,
          applicableTransactionTypes: ['PAYMENT', 'REFUND'],
          documentationRequired: ['Data residency compliance'],
          retentionPeriod: 60,
        },
      ],
    };

    for (const [region, reqs] of Object.entries(requirements)) {
      this.complianceRequirements.set(region, reqs);
    }

    logger.info('Compliance requirements initialized', {
      regionsCount: this.complianceRequirements.size,
      supportedRegions: Array.from(this.complianceRequirements.keys()),
    });
  }

  async performComplianceCheck(
    transaction: Transaction,
    region: string,
    customerData?: {
      type: 'individual' | 'business';
      verificationLevel: 'basic' | 'enhanced';
      riskScore?: number;
      previousFlags?: string[];
    }
  ): Promise<ComplianceCheck[]> {
    if (!this.settings.complianceCheckingEnabled) {
      logger.debug('Compliance checking disabled');
      return [];
    }

    logger.info('Performing compliance checks', {
      transactionId: transaction.id,
      region,
      amount: transaction.amount.toString(),
      currency: transaction.currency,
    });

    const requirements = this.complianceRequirements.get(region) || [];
    const checks: ComplianceCheck[] = [];

    for (const requirement of requirements) {
      if (this.isRequirementApplicable(transaction, requirement)) {
        const check = await this.performSpecificComplianceCheck(
          transaction,
          region,
          requirement,
          customerData
        );
        checks.push(check);
        this.complianceChecks.set(check.id, check);
      }
    }

    logger.info('Compliance checks completed', {
      transactionId: transaction.id,
      region,
      checksPerformed: checks.length,
      passedChecks: checks.filter(c => c.status === 'PASSED').length,
      failedChecks: checks.filter(c => c.status === 'FAILED').length,
    });

    return checks;
  }

  async getComplianceCheck(checkId: string): Promise<ComplianceCheck | null> {
    return this.complianceChecks.get(checkId) || null;
  }

  async getComplianceChecksForTransaction(
    transactionId: string
  ): Promise<ComplianceCheck[]> {
    return Array.from(this.complianceChecks.values()).filter(
      check => check.transactionId === transactionId
    );
  }

  async updateComplianceCheckStatus(
    checkId: string,
    status: ComplianceStatus,
    reviewedBy?: string,
    notes?: string
  ): Promise<ComplianceCheck | null> {
    const check = this.complianceChecks.get(checkId);
    if (!check) {
      return null;
    }

    check.status = status;
    check.reviewedBy = reviewedBy;
    check.reviewedAt = new Date();
    if (notes) {
      check.notes = notes;
    }

    logger.info('Compliance check status updated', {
      checkId,
      transactionId: check.transactionId,
      status,
      reviewedBy,
    });

    return check;
  }

  async getComplianceRequirements(
    region: string
  ): Promise<ComplianceRequirement[]> {
    return this.complianceRequirements.get(region) || [];
  }

  async validateComplianceDocumentation(
    checkId: string,
    documentation: string[]
  ): Promise<{
    isValid: boolean;
    missingDocuments: string[];
    validDocuments: string[];
  }> {
    const check = this.complianceChecks.get(checkId);
    if (!check) {
      throw new Error(`Compliance check ${checkId} not found`);
    }

    const requirements = this.complianceRequirements.get(check.region) || [];
    const requirement = requirements.find(r => r.type === check.complianceType);

    if (!requirement || !requirement.documentationRequired) {
      return {
        isValid: true,
        missingDocuments: [],
        validDocuments: documentation,
      };
    }

    const requiredDocs = requirement.documentationRequired;
    const missingDocuments = requiredDocs.filter(
      doc => !documentation.includes(doc)
    );
    const validDocuments = documentation.filter(doc =>
      requiredDocs.includes(doc)
    );

    const isValid = missingDocuments.length === 0;

    logger.debug('Compliance documentation validation', {
      checkId,
      requiredDocs: requiredDocs.length,
      providedDocs: documentation.length,
      validDocs: validDocuments.length,
      missingDocs: missingDocuments.length,
      isValid,
    });

    return {
      isValid,
      missingDocuments,
      validDocuments,
    };
  }

  private async performSpecificComplianceCheck(
    transaction: Transaction,
    region: string,
    requirement: ComplianceRequirement,
    customerData?: {
      type: 'individual' | 'business';
      verificationLevel: 'basic' | 'enhanced';
      riskScore?: number;
      previousFlags?: string[];
    }
  ): Promise<ComplianceCheck> {
    const checkId = this.generateCheckId();
    const flags: ComplianceFlag[] = [];
    let passed = true;
    let score = 100;

    // Perform specific checks based on compliance type
    switch (requirement.type) {
      case 'AML':
        ({
          passed,
          score,
          flags: flags,
        } = await this.performAMLCheck(transaction, customerData));
        break;
      case 'KYC':
        ({
          passed,
          score,
          flags: flags,
        } = await this.performKYCCheck(transaction, customerData));
        break;
      case 'PCI_DSS':
        ({
          passed,
          score,
          flags: flags,
        } = await this.performPCICheck(transaction));
        break;
      case 'PSD2':
        ({
          passed,
          score,
          flags: flags,
        } = await this.performPSD2Check(transaction));
        break;
      case 'GDPR':
        ({
          passed,
          score,
          flags: flags,
        } = await this.performGDPRCheck(transaction));
        break;
      case 'LOCAL_BANKING':
        ({
          passed,
          score,
          flags: flags,
        } = await this.performLocalBankingCheck(transaction, region));
        break;
      case 'DATA_LOCALIZATION':
        ({
          passed,
          score,
          flags: flags,
        } = await this.performDataLocalizationCheck(transaction, region));
        break;
      default:
        logger.warn('Unknown compliance type', { type: requirement.type });
    }

    const result: ComplianceResult = {
      passed,
      score,
      flags,
      recommendations: this.generateRecommendations(flags),
      requiredActions: this.generateRequiredActions(flags),
      nextReviewDate: this.calculateNextReviewDate(requirement),
    };

    const status: ComplianceStatus = passed
      ? 'PASSED'
      : flags.some(f => f.severity === 'CRITICAL')
        ? 'FAILED'
        : 'REQUIRES_REVIEW';

    return {
      id: checkId,
      transactionId: transaction.id,
      region,
      complianceType: requirement.type,
      status,
      checkPerformed: new Date(),
      result,
    };
  }

  private async performAMLCheck(
    transaction: Transaction,
    customerData?: any
  ): Promise<{ passed: boolean; score: number; flags: ComplianceFlag[] }> {
    const flags: ComplianceFlag[] = [];
    let score = 100;

    // Check transaction amount
    if (transaction.amount.gte(new Decimal(10000))) {
      flags.push({
        type: 'HIGH_VALUE_TRANSACTION',
        severity: 'MEDIUM',
        description: 'Transaction amount exceeds AML threshold',
        recommendation: 'Enhanced due diligence required',
        autoResolvable: false,
      });
      score -= 20;
    }

    // Check customer risk score
    if (customerData?.riskScore && customerData.riskScore > 70) {
      flags.push({
        type: 'HIGH_RISK_CUSTOMER',
        severity: 'HIGH',
        description: 'Customer has high risk score',
        recommendation: 'Manual review and additional verification required',
        autoResolvable: false,
      });
      score -= 30;
    }

    // Check for previous flags
    if (customerData?.previousFlags && customerData.previousFlags.length > 0) {
      flags.push({
        type: 'PREVIOUS_FLAGS',
        severity: 'MEDIUM',
        description: 'Customer has previous compliance flags',
        recommendation: 'Review previous flags and current transaction context',
        autoResolvable: false,
      });
      score -= 15;
    }

    const passed = score >= 70 && !flags.some(f => f.severity === 'CRITICAL');

    return { passed, score, flags };
  }

  private async performKYCCheck(
    transaction: Transaction,
    customerData?: any
  ): Promise<{ passed: boolean; score: number; flags: ComplianceFlag[] }> {
    const flags: ComplianceFlag[] = [];
    let score = 100;

    // Check verification level
    if (
      !customerData?.verificationLevel ||
      customerData.verificationLevel === 'basic'
    ) {
      if (transaction.amount.gte(new Decimal(5000))) {
        flags.push({
          type: 'INSUFFICIENT_VERIFICATION',
          severity: 'HIGH',
          description: 'Enhanced verification required for transaction amount',
          recommendation: 'Request additional identity documents',
          autoResolvable: false,
        });
        score -= 40;
      }
    }

    const passed = score >= 60 && !flags.some(f => f.severity === 'CRITICAL');

    return { passed, score, flags };
  }

  private async performPCICheck(
    transaction: Transaction
  ): Promise<{ passed: boolean; score: number; flags: ComplianceFlag[] }> {
    const flags: ComplianceFlag[] = [];
    let score = 100;

    // Basic PCI compliance checks (in a real implementation, this would be more comprehensive)
    if (
      transaction.paymentMethodId &&
      transaction.paymentMethodId.includes('card')
    ) {
      // Simulate PCI compliance validation
      const isPCICompliant = true; // This would be actual validation

      if (!isPCICompliant) {
        flags.push({
          type: 'PCI_NON_COMPLIANCE',
          severity: 'CRITICAL',
          description: 'PCI DSS compliance requirements not met',
          recommendation:
            'Ensure PCI DSS compliance before processing card transactions',
          autoResolvable: false,
        });
        score = 0;
      }
    }

    const passed = score >= 90;

    return { passed, score, flags };
  }

  private async performPSD2Check(
    transaction: Transaction
  ): Promise<{ passed: boolean; score: number; flags: ComplianceFlag[] }> {
    const flags: ComplianceFlag[] = [];
    let score = 100;

    // Check for Strong Customer Authentication (SCA) requirements
    if (transaction.amount.gte(new Decimal(30))) {
      // EUR 30 threshold
      // In a real implementation, check if SCA was performed
      const scaPerformed = transaction.metadata?.scaPerformed || false;

      if (!scaPerformed) {
        flags.push({
          type: 'SCA_REQUIRED',
          severity: 'HIGH',
          description:
            'Strong Customer Authentication required for this transaction',
          recommendation: 'Implement SCA before processing payment',
          autoResolvable: false,
        });
        score -= 50;
      }
    }

    const passed = score >= 70;

    return { passed, score, flags };
  }

  private async performGDPRCheck(
    transaction: Transaction
  ): Promise<{ passed: boolean; score: number; flags: ComplianceFlag[] }> {
    const flags: ComplianceFlag[] = [];
    let score = 100;

    // Check for data processing consent
    const hasConsent = transaction.metadata?.gdprConsent || false;

    if (!hasConsent) {
      flags.push({
        type: 'MISSING_CONSENT',
        severity: 'HIGH',
        description: 'GDPR consent not recorded for data processing',
        recommendation: 'Obtain explicit consent for data processing',
        autoResolvable: false,
      });
      score -= 40;
    }

    const passed = score >= 60;

    return { passed, score, flags };
  }

  private async performLocalBankingCheck(
    transaction: Transaction,
    region: string
  ): Promise<{ passed: boolean; score: number; flags: ComplianceFlag[] }> {
    const flags: ComplianceFlag[] = [];
    let score = 100;

    // Region-specific banking regulation checks
    if (region === 'NG' && transaction.amount.gte(new Decimal(1000000))) {
      // CBN regulations for high-value transactions
      const hasBVN = transaction.metadata?.bvnVerified || false;

      if (!hasBVN) {
        flags.push({
          type: 'BVN_VERIFICATION_REQUIRED',
          severity: 'HIGH',
          description: 'BVN verification required for high-value transactions',
          recommendation: 'Verify customer BVN before processing',
          autoResolvable: false,
        });
        score -= 40;
      }
    }

    const passed = score >= 70;

    return { passed, score, flags };
  }

  private async performDataLocalizationCheck(
    transaction: Transaction,
    region: string
  ): Promise<{ passed: boolean; score: number; flags: ComplianceFlag[] }> {
    const flags: ComplianceFlag[] = [];
    let score = 100;

    // Check if data is stored in the required region
    const dataLocation = transaction.metadata?.dataLocation || 'unknown';

    if (region === 'IN' && dataLocation !== 'IN') {
      flags.push({
        type: 'DATA_LOCALIZATION_VIOLATION',
        severity: 'CRITICAL',
        description: 'Payment data must be stored within India',
        recommendation: 'Ensure data residency compliance',
        autoResolvable: false,
      });
      score = 0;
    }

    const passed = score >= 90;

    return { passed, score, flags };
  }

  private isRequirementApplicable(
    transaction: Transaction,
    requirement: ComplianceRequirement
  ): boolean {
    // Check transaction type
    if (!requirement.applicableTransactionTypes.includes(transaction.type)) {
      return false;
    }

    // Check minimum amount
    if (
      requirement.minimumAmount &&
      transaction.amount.lt(requirement.minimumAmount)
    ) {
      return false;
    }

    // Check maximum amount
    if (
      requirement.maximumAmount &&
      transaction.amount.gt(requirement.maximumAmount)
    ) {
      return false;
    }

    return requirement.isRequired;
  }

  private generateRecommendations(flags: ComplianceFlag[]): string[] {
    return flags.map(flag => flag.recommendation);
  }

  private generateRequiredActions(flags: ComplianceFlag[]): string[] {
    return flags
      .filter(flag => flag.severity === 'HIGH' || flag.severity === 'CRITICAL')
      .map(flag => `Address ${flag.type}: ${flag.recommendation}`);
  }

  private calculateNextReviewDate(
    requirement: ComplianceRequirement
  ): Date | undefined {
    if (!requirement.reportingFrequency) {
      return undefined;
    }

    const now = new Date();
    switch (requirement.reportingFrequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      case 'quarterly':
        return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
      case 'annually':
        return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      default:
        return undefined;
    }
  }

  private generateCheckId(): string {
    return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
