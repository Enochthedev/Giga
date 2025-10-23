import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';
import {
  FraudAssessment,
  FraudEvidence,
  FraudReview,
} from '../types/fraud.types';
import { Transaction } from '../types/payment.types';

export interface ReviewCase {
  id: string;
  transactionId: string;
  assessmentId: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status:
    | 'pending'
    | 'in_review'
    | 'escalated'
    | 'approved'
    | 'declined'
    | 'needs_info';
  assignedTo?: string;
  assignedAt?: Date;
  reviewStartedAt?: Date;
  reviewCompletedAt?: Date;
  autoEscalationAt?: Date;

  // Case details
  riskScore: number;
  riskLevel: string;
  flaggedReasons: string[];
  customerInfo: {
    userId?: string;
    email?: string;
    accountAge?: number;
    previousFraudCases?: number;
  };

  // Transaction details
  transactionAmount: number;
  transactionCurrency: string;
  paymentMethod?: string;
  merchantInfo?: any;

  // Evidence and context
  evidence: FraudEvidence[];
  similarCases?: string[];
  relatedTransactions?: string[];

  // Review workflow
  reviewNotes: Array<{
    reviewerId: string;
    timestamp: Date;
    note: string;
    action?: string;
  }>;

  // SLA tracking
  slaDeadline: Date;
  isOverdue: boolean;

  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewerAssignment {
  reviewerId: string;
  name: string;
  email: string;
  specializations: string[];
  currentCaseload: number;
  maxCaseload: number;
  avgReviewTime: number;
  accuracy: number;
  isAvailable: boolean;
  workingHours: {
    timezone: string;
    start: string;
    end: string;
    workingDays: number[];
  };
}

export interface ManualReviewConfig {
  enableAutoAssignment: boolean;
  enableEscalation: boolean;
  slaHours: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  escalationRules: {
    overdueHours: number;
    highValueThreshold: number;
    repeatOffenderThreshold: number;
  };
  reviewerBalancing: {
    enableLoadBalancing: boolean;
    enableSpecializationMatching: boolean;
    maxCaseloadPerReviewer: number;
  };
  notifications: {
    enableSlackIntegration: boolean;
    enableEmailNotifications: boolean;
    escalationChannels: string[];
  };
}

export class ManualReviewWorkflowService {
  private prisma: PrismaClient;
  private config: ManualReviewConfig;
  private reviewers: Map<string, ReviewerAssignment> = new Map();

  constructor(prisma: PrismaClient, config: ManualReviewConfig) {
    this.prisma = prisma;
    this.config = config;
    this.initializeReviewers();
  }

  /**
   * Create a manual review case from fraud assessment
   */
  async createReviewCase(
    transaction: Transaction,
    assessment: FraudAssessment,
    priority?: 'low' | 'medium' | 'high' | 'critical'
  ): Promise<ReviewCase> {
    try {
      logger.info('Creating manual review case', {
        transactionId: transaction.id,
        assessmentId: assessment.id,
        riskScore: assessment.riskScore,
      });

      // Determine priority if not provided
      const casePriority =
        priority || this.determinePriority(transaction, assessment);

      // Calculate SLA deadline
      const slaHours = this.config.slaHours[casePriority];
      const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000);

      // Gather evidence
      const evidence = await this.gatherEvidence(transaction, assessment);

      // Find similar cases
      const similarCases = await this.findSimilarCases(transaction, assessment);

      // Get related transactions
      const relatedTransactions =
        await this.getRelatedTransactions(transaction);

      // Create review case
      const reviewCase: ReviewCase = {
        id: this.generateCaseId(),
        transactionId: transaction.id,
        assessmentId: assessment.id,
        priority: casePriority,
        status: 'pending',
        riskScore: assessment.riskScore,
        riskLevel: assessment.riskLevel,
        flaggedReasons: this.extractFlaggedReasons(assessment),
        customerInfo: await this.getCustomerInfo(transaction.userId),
        transactionAmount: Number(transaction.amount),
        transactionCurrency: transaction.currency,
        paymentMethod: transaction.paymentMethodId,
        merchantInfo: transaction.metadata?.merchantInfo,
        evidence,
        similarCases,
        relatedTransactions,
        reviewNotes: [],
        slaDeadline,
        isOverdue: false,
        metadata: {
          createdBy: 'fraud_detection_system',
          originalAssessment: assessment,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Auto-assign if enabled
      if (this.config.enableAutoAssignment) {
        await this.autoAssignReviewer(reviewCase);
      }

      // Send notifications
      await this.sendCaseNotifications(reviewCase, 'created');

      logger.info('Manual review case created', {
        caseId: reviewCase.id,
        priority: casePriority,
        assignedTo: reviewCase.assignedTo,
        slaDeadline,
      });

      return reviewCase;
    } catch (error) {
      logger.error('Error creating review case', {
        error: error instanceof Error ? error.message : 'Unknown error',
        transactionId: transaction.id,
      });
      throw error;
    }
  }

  /**
   * Assign reviewer to a case
   */
  async assignReviewer(
    caseId: string,
    reviewerId: string,
    assignedBy?: string
  ): Promise<void> {
    try {
      logger.info('Assigning reviewer to case', {
        caseId,
        reviewerId,
        assignedBy,
      });

      const reviewer = this.reviewers.get(reviewerId);
      if (!reviewer) {
        throw new Error(`Reviewer ${reviewerId} not found`);
      }

      if (!reviewer.isAvailable) {
        throw new Error(`Reviewer ${reviewerId} is not available`);
      }

      if (reviewer.currentCaseload >= reviewer.maxCaseload) {
        throw new Error(`Reviewer ${reviewerId} has reached maximum caseload`);
      }

      // Update reviewer caseload
      reviewer.currentCaseload++;
      this.reviewers.set(reviewerId, reviewer);

      // In a real implementation, this would update the database
      logger.info('Reviewer assigned successfully', { caseId, reviewerId });

      // Send assignment notification
      await this.sendAssignmentNotification(caseId, reviewerId);
    } catch (error) {
      logger.error('Error assigning reviewer', {
        error: error instanceof Error ? error.message : 'Unknown error',
        caseId,
        reviewerId,
      });
      throw error;
    }
  }

  /**
   * Submit review decision
   */
  async submitReviewDecision(
    caseId: string,
    reviewerId: string,
    decision: 'approve' | 'decline' | 'needs_more_info',
    reason: string,
    notes?: string,
    evidence?: FraudEvidence[]
  ): Promise<FraudReview> {
    try {
      logger.info('Submitting review decision', {
        caseId,
        reviewerId,
        decision,
        reason,
      });

      const review: FraudReview = {
        id: this.generateReviewId(),
        transactionId: '', // Would be populated from case
        assessmentId: '', // Would be populated from case
        reviewerId,
        decision,
        reason,
        notes,
        evidence: evidence || [],
        metadata: {
          submittedAt: new Date(),
          caseId,
        },
        reviewedAt: new Date(),
      };

      // Update reviewer caseload
      const reviewer = this.reviewers.get(reviewerId);
      if (reviewer) {
        reviewer.currentCaseload = Math.max(0, reviewer.currentCaseload - 1);
        this.reviewers.set(reviewerId, reviewer);
      }

      // Send decision notifications
      await this.sendDecisionNotifications(caseId, review);

      // Update case status based on decision
      await this.updateCaseStatus(caseId, this.mapDecisionToStatus(decision));

      logger.info('Review decision submitted successfully', {
        reviewId: review.id,
        caseId,
        decision,
      });

      return review;
    } catch (error) {
      logger.error('Error submitting review decision', {
        error: error instanceof Error ? error.message : 'Unknown error',
        caseId,
        reviewerId,
      });
      throw error;
    }
  }

  /**
   * Escalate case to senior reviewer or specialist
   */
  async escalateCase(
    caseId: string,
    escalatedBy: string,
    reason: string,
    targetReviewerId?: string
  ): Promise<void> {
    try {
      logger.info('Escalating case', {
        caseId,
        escalatedBy,
        reason,
        targetReviewerId,
      });

      // Find appropriate escalation target
      const escalationTarget =
        targetReviewerId || (await this.findEscalationTarget(caseId));

      if (!escalationTarget) {
        throw new Error('No available escalation target found');
      }

      // Update case priority and assignment
      await this.updateCaseStatus(caseId, 'escalated');
      await this.assignReviewer(caseId, escalationTarget, escalatedBy);

      // Send escalation notifications
      await this.sendEscalationNotifications(
        caseId,
        escalatedBy,
        escalationTarget,
        reason
      );

      logger.info('Case escalated successfully', {
        caseId,
        escalatedTo: escalationTarget,
        reason,
      });
    } catch (error) {
      logger.error('Error escalating case', {
        error: error instanceof Error ? error.message : 'Unknown error',
        caseId,
      });
      throw error;
    }
  }

  /**
   * Add note to review case
   */
  async addReviewNote(
    caseId: string,
    reviewerId: string,
    note: string,
    action?: string
  ): Promise<void> {
    try {
      logger.info('Adding review note', { caseId, reviewerId, action });

      // In a real implementation, this would update the database
      const noteEntry = {
        reviewerId,
        timestamp: new Date(),
        note,
        action,
      };

      logger.info('Review note added successfully', {
        caseId,
        noteId: noteEntry.timestamp,
      });
    } catch (error) {
      logger.error('Error adding review note', {
        error: error instanceof Error ? error.message : 'Unknown error',
        caseId,
      });
      throw error;
    }
  }

  /**
   * Get review queue for a reviewer
   */
  async getReviewQueue(
    reviewerId: string,
    filters?: {
      priority?: string[];
      status?: string[];
      overdue?: boolean;
      limit?: number;
    }
  ): Promise<ReviewCase[]> {
    try {
      // In a real implementation, this would query the database
      // For now, return mock data
      const mockCases: ReviewCase[] = [
        {
          id: 'case_001',
          transactionId: 'txn_001',
          assessmentId: 'assess_001',
          priority: 'high',
          status: 'pending',
          assignedTo: reviewerId,
          riskScore: 85,
          riskLevel: 'high',
          flaggedReasons: ['velocity_violation', 'suspicious_device'],
          customerInfo: {
            userId: 'user_001',
            email: 'user@example.com',
            accountAge: 30,
            previousFraudCases: 0,
          },
          transactionAmount: 1500,
          transactionCurrency: 'USD',
          evidence: [],
          reviewNotes: [],
          slaDeadline: new Date(Date.now() + 4 * 60 * 60 * 1000),
          isOverdue: false,
          metadata: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      return mockCases;
    } catch (error) {
      logger.error('Error getting review queue', {
        error: error instanceof Error ? error.message : 'Unknown error',
        reviewerId,
      });
      throw error;
    }
  }

  /**
   * Get review case details
   */
  async getReviewCase(caseId: string): Promise<ReviewCase | null> {
    try {
      // In a real implementation, this would query the database
      return null;
    } catch (error) {
      logger.error('Error getting review case', {
        error: error instanceof Error ? error.message : 'Unknown error',
        caseId,
      });
      throw error;
    }
  }

  /**
   * Get review statistics
   */
  async getReviewStatistics(
    reviewerId?: string,
    days: number = 30
  ): Promise<{
    totalCases: number;
    pendingCases: number;
    completedCases: number;
    overdueCases: number;
    avgReviewTime: number;
    accuracy: number;
    casesByPriority: Record<string, number>;
    casesByStatus: Record<string, number>;
    reviewerPerformance?: {
      reviewerId: string;
      casesReviewed: number;
      avgReviewTime: number;
      accuracy: number;
    }[];
  }> {
    try {
      // Mock statistics
      return {
        totalCases: 150,
        pendingCases: 25,
        completedCases: 120,
        overdueCases: 5,
        avgReviewTime: 45, // minutes
        accuracy: 0.92,
        casesByPriority: {
          low: 40,
          medium: 60,
          high: 35,
          critical: 15,
        },
        casesByStatus: {
          pending: 25,
          in_review: 15,
          approved: 85,
          declined: 20,
          escalated: 5,
        },
        reviewerPerformance: Array.from(this.reviewers.values()).map(
          reviewer => ({
            reviewerId: reviewer.reviewerId,
            casesReviewed: Math.floor(Math.random() * 50) + 10,
            avgReviewTime: reviewer.avgReviewTime,
            accuracy: reviewer.accuracy,
          })
        ),
      };
    } catch (error) {
      logger.error('Error getting review statistics', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Check for overdue cases and auto-escalate
   */
  async processOverdueCases(): Promise<void> {
    try {
      logger.info('Processing overdue cases');

      // In a real implementation, this would query for overdue cases
      // and auto-escalate them based on configuration

      const overdueCount = 0; // Mock count

      logger.info('Overdue cases processed', { overdueCount });
    } catch (error) {
      logger.error('Error processing overdue cases', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Private helper methods
   */
  private determinePriority(
    transaction: Transaction,
    assessment: FraudAssessment
  ): 'low' | 'medium' | 'high' | 'critical' {
    // Critical priority conditions
    if (assessment.riskScore >= 90 || assessment.riskLevel === 'critical') {
      return 'critical';
    }

    // High priority conditions
    if (
      assessment.riskScore >= 70 ||
      Number(transaction.amount) >
        this.config.escalationRules.highValueThreshold ||
      this.isRepeatOffender(transaction.userId)
    ) {
      return 'high';
    }

    // Medium priority conditions
    if (assessment.riskScore >= 50 || assessment.riskLevel === 'medium') {
      return 'medium';
    }

    return 'low';
  }

  private async autoAssignReviewer(reviewCase: ReviewCase): Promise<void> {
    try {
      const availableReviewers = Array.from(this.reviewers.values()).filter(
        reviewer =>
          reviewer.isAvailable &&
          reviewer.currentCaseload < reviewer.maxCaseload
      );

      if (availableReviewers.length === 0) {
        logger.warn('No available reviewers for auto-assignment', {
          caseId: reviewCase.id,
        });
        return;
      }

      // Find best reviewer based on specialization and workload
      let bestReviewer = availableReviewers[0];

      if (this.config.reviewerBalancing.enableSpecializationMatching) {
        const specializedReviewers = availableReviewers.filter(reviewer =>
          this.hasRelevantSpecialization(reviewer, reviewCase)
        );

        if (specializedReviewers.length > 0) {
          bestReviewer = specializedReviewers.reduce((best, current) =>
            current.currentCaseload < best.currentCaseload ? current : best
          );
        }
      }

      if (this.config.reviewerBalancing.enableLoadBalancing) {
        bestReviewer = availableReviewers.reduce((best, current) =>
          current.currentCaseload < best.currentCaseload ? current : best
        );
      }

      await this.assignReviewer(
        reviewCase.id,
        bestReviewer.reviewerId,
        'auto_assignment'
      );
      reviewCase.assignedTo = bestReviewer.reviewerId;
      reviewCase.assignedAt = new Date();
    } catch (error) {
      logger.error('Error in auto-assignment', {
        error: error instanceof Error ? error.message : 'Unknown error',
        caseId: reviewCase.id,
      });
    }
  }

  private async gatherEvidence(
    transaction: Transaction,
    assessment: FraudAssessment
  ): Promise<FraudEvidence[]> {
    const evidence: FraudEvidence[] = [];

    // Add signals as evidence
    assessment.signals?.forEach(signal => {
      evidence.push({
        type: 'fraud_signal',
        description: signal.description || `${signal.type} detected`,
        value: signal.value,
        source: 'fraud_detection_engine',
        confidence: 0.8,
      });
    });

    // Add rule evaluations as evidence
    assessment.ruleEvaluations?.forEach(rule => {
      if (rule.matched) {
        evidence.push({
          type: 'rule_match',
          description: `Rule "${rule.ruleName}" triggered`,
          value: rule.details,
          source: 'fraud_rules_engine',
          confidence: 0.9,
        });
      }
    });

    // Add transaction metadata as evidence
    if (transaction.metadata) {
      evidence.push({
        type: 'transaction_metadata',
        description: 'Transaction context and metadata',
        value: transaction.metadata,
        source: 'transaction_processor',
        confidence: 1.0,
      });
    }

    return evidence;
  }

  private async findSimilarCases(
    transaction: Transaction,
    assessment: FraudAssessment
  ): Promise<string[]> {
    // In a real implementation, this would use ML or similarity algorithms
    // to find cases with similar patterns
    return [];
  }

  private async getRelatedTransactions(
    transaction: Transaction
  ): Promise<string[]> {
    try {
      if (!transaction.userId) {
        return [];
      }

      // Get recent transactions from the same user
      const recentTransactions = await this.prisma.transaction.findMany({
        where: {
          userId: transaction.userId,
          id: { not: transaction.id },
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
        select: { id: true },
        take: 10,
      });

      return recentTransactions.map(t => t.id);
    } catch (error) {
      logger.error('Error getting related transactions', {
        error: error instanceof Error ? error.message : 'Unknown error',
        transactionId: transaction.id,
      });
      return [];
    }
  }

  private async getCustomerInfo(
    userId?: string
  ): Promise<ReviewCase['customerInfo']> {
    if (!userId) {
      return {};
    }

    try {
      // In a real implementation, this would query user data
      return {
        userId,
        email: 'user@example.com',
        accountAge: 90,
        previousFraudCases: 0,
      };
    } catch (error) {
      logger.error('Error getting customer info', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      return { userId };
    }
  }

  private extractFlaggedReasons(assessment: FraudAssessment): string[] {
    const reasons: string[] = [];

    // Extract from signals
    assessment.signals?.forEach(signal => {
      reasons.push(signal.type);
    });

    // Extract from rule evaluations
    assessment.ruleEvaluations?.forEach(rule => {
      if (rule.matched) {
        reasons.push(
          `rule_${rule.ruleName.toLowerCase().replace(/\s+/g, '_')}`
        );
      }
    });

    return [...new Set(reasons)]; // Remove duplicates
  }

  private isRepeatOffender(userId?: string): boolean {
    // In a real implementation, this would check fraud history
    return false;
  }

  private hasRelevantSpecialization(
    reviewer: ReviewerAssignment,
    reviewCase: ReviewCase
  ): boolean {
    // Check if reviewer has specializations relevant to the case
    const caseTypes = reviewCase.flaggedReasons;
    return reviewer.specializations.some(spec =>
      caseTypes.some(type => type.includes(spec))
    );
  }

  private async findEscalationTarget(caseId: string): Promise<string | null> {
    // Find senior reviewers or specialists for escalation
    const seniorReviewers = Array.from(this.reviewers.values()).filter(
      reviewer =>
        reviewer.specializations.includes('senior') && reviewer.isAvailable
    );

    if (seniorReviewers.length === 0) {
      return null;
    }

    // Return reviewer with lowest caseload
    const target = seniorReviewers.reduce((best, current) =>
      current.currentCaseload < best.currentCaseload ? current : best
    );

    return target.reviewerId;
  }

  private mapDecisionToStatus(decision: string): ReviewCase['status'] {
    switch (decision) {
      case 'approve':
        return 'approved';
      case 'decline':
        return 'declined';
      case 'needs_more_info':
        return 'needs_info';
      default:
        return 'pending';
    }
  }

  private async updateCaseStatus(
    caseId: string,
    status: ReviewCase['status']
  ): Promise<void> {
    // In a real implementation, this would update the database
    logger.info('Case status updated', { caseId, status });
  }

  private async sendCaseNotifications(
    reviewCase: ReviewCase,
    event: string
  ): Promise<void> {
    // Send notifications via configured channels
    logger.info('Case notification sent', {
      caseId: reviewCase.id,
      event,
      priority: reviewCase.priority,
    });
  }

  private async sendAssignmentNotification(
    caseId: string,
    reviewerId: string
  ): Promise<void> {
    logger.info('Assignment notification sent', { caseId, reviewerId });
  }

  private async sendDecisionNotifications(
    caseId: string,
    review: FraudReview
  ): Promise<void> {
    logger.info('Decision notification sent', {
      caseId,
      reviewId: review.id,
      decision: review.decision,
    });
  }

  private async sendEscalationNotifications(
    caseId: string,
    escalatedBy: string,
    escalatedTo: string,
    reason: string
  ): Promise<void> {
    logger.info('Escalation notification sent', {
      caseId,
      escalatedBy,
      escalatedTo,
      reason,
    });
  }

  private generateCaseId(): string {
    return `case_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateReviewId(): string {
    return `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeReviewers(): void {
    // Initialize mock reviewers
    const mockReviewers: ReviewerAssignment[] = [
      {
        reviewerId: 'reviewer_001',
        name: 'Alice Johnson',
        email: 'alice@company.com',
        specializations: ['high_value', 'velocity'],
        currentCaseload: 5,
        maxCaseload: 15,
        avgReviewTime: 30,
        accuracy: 0.95,
        isAvailable: true,
        workingHours: {
          timezone: 'UTC',
          start: '09:00',
          end: '17:00',
          workingDays: [1, 2, 3, 4, 5],
        },
      },
      {
        reviewerId: 'reviewer_002',
        name: 'Bob Smith',
        email: 'bob@company.com',
        specializations: ['device_fraud', 'senior'],
        currentCaseload: 8,
        maxCaseload: 20,
        avgReviewTime: 25,
        accuracy: 0.92,
        isAvailable: true,
        workingHours: {
          timezone: 'UTC',
          start: '08:00',
          end: '16:00',
          workingDays: [1, 2, 3, 4, 5],
        },
      },
    ];

    mockReviewers.forEach(reviewer => {
      this.reviewers.set(reviewer.reviewerId, reviewer);
    });
  }
}
