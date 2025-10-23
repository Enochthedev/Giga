import { Request, Response } from 'express';
import { logger } from '../lib/logger';
import { BehavioralPatternDetectionService } from '../services/behavioral-pattern-detection.service';
import { BlacklistWhitelistManagerService } from '../services/blacklist-whitelist-manager.service';
import { DeviceFingerprintingService } from '../services/device-fingerprinting.service';
import { FraudDetectionService } from '../services/fraud-detection.service';
import { FraudRulesEngineService } from '../services/fraud-rules-engine.service';
import { GeolocationAnalysisService } from '../services/geolocation-analysis.service';
import { ManualReviewWorkflowService } from '../services/manual-review-workflow.service';
import { RiskScoringService } from '../services/risk-scoring.service';
import { VelocityCheckerService } from '../services/velocity-checker.service';

export class FraudDetectionController {
  constructor(
    private fraudDetectionService: FraudDetectionService,
    private fraudRulesEngine: FraudRulesEngineService,
    private velocityChecker: VelocityCheckerService,
    private blacklistWhitelistManager: BlacklistWhitelistManagerService,
    private riskScoringService: RiskScoringService,
    private deviceFingerprintingService: DeviceFingerprintingService,
    private geolocationAnalysisService: GeolocationAnalysisService,
    private behavioralPatternDetectionService: BehavioralPatternDetectionService,
    private manualReviewWorkflowService: ManualReviewWorkflowService
  ) {}

  /**
   * Analyze transaction for fraud
   */
  async analyzeTransaction(req: Request, res: Response): Promise<void> {
    try {
      const { transaction } = req.body;

      if (!transaction) {
        res.status(400).json({
          success: false,
          error: 'Transaction data is required',
        });
        return;
      }

      logger.info('Analyzing transaction for fraud', {
        transactionId: transaction.id,
      });

      const assessment =
        await this.fraudDetectionService.analyzeTransaction(transaction);

      res.status(200).json({
        success: true,
        data: {
          assessment,
          recommendation: assessment.recommendation,
          riskScore: assessment.riskScore,
          riskLevel: assessment.riskLevel,
        },
      });
    } catch (error) {
      logger.error('Error analyzing transaction', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Internal server error during fraud analysis',
      });
    }
  }

  /**
   * Create fraud rule
   */
  async createFraudRule(req: Request, res: Response): Promise<void> {
    try {
      const ruleData = req.body;

      const rule = await this.fraudRulesEngine.createRule(ruleData);

      res.status(201).json({
        success: true,
        data: rule,
      });
    } catch (error) {
      logger.error('Error creating fraud rule', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to create fraud rule',
      });
    }
  }

  /**
   * Update fraud rule
   */
  async updateFraudRule(req: Request, res: Response): Promise<void> {
    try {
      const { ruleId } = req.params;
      const updates = req.body;

      if (!ruleId) {
        res.status(400).json({ success: false, error: 'Rule ID is required' });
        return;
      }
      const rule = await this.fraudRulesEngine.updateRule(ruleId, updates);

      res.status(200).json({
        success: true,
        data: rule,
      });
    } catch (error) {
      logger.error('Error updating fraud rule', {
        error: error instanceof Error ? error.message : 'Unknown error',
        ruleId: req.params.ruleId,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to update fraud rule',
      });
    }
  }

  /**
   * Delete fraud rule
   */
  async deleteFraudRule(req: Request, res: Response): Promise<void> {
    try {
      const { ruleId } = req.params;

      if (!ruleId) {
        res.status(400).json({ success: false, error: 'Rule ID is required' });
        return;
      }
      await this.fraudRulesEngine.deleteRule(ruleId);

      res.status(200).json({
        success: true,
        message: 'Fraud rule deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting fraud rule', {
        error: error instanceof Error ? error.message : 'Unknown error',
        ruleId: req.params.ruleId,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to delete fraud rule',
      });
    }
  }

  /**
   * Get active fraud rules
   */
  async getActiveFraudRules(req: Request, res: Response): Promise<void> {
    try {
      const rules = await this.fraudRulesEngine.getActiveRules();

      res.status(200).json({
        success: true,
        data: rules,
      });
    } catch (error) {
      logger.error('Error getting active fraud rules', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to get fraud rules',
      });
    }
  }

  /**
   * Test fraud rule
   */
  async testFraudRule(req: Request, res: Response): Promise<void> {
    try {
      const { rule, sampleTransaction } = req.body;

      const evaluation = await this.fraudRulesEngine.testRule(
        rule,
        sampleTransaction
      );

      res.status(200).json({
        success: true,
        data: evaluation,
      });
    } catch (error) {
      logger.error('Error testing fraud rule', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to test fraud rule',
      });
    }
  }

  /**
   * Add to blacklist
   */
  async addToBlacklist(req: Request, res: Response): Promise<void> {
    try {
      const entryData = req.body;

      const entry =
        await this.blacklistWhitelistManager.addToBlacklist(entryData);

      res.status(201).json({
        success: true,
        data: entry,
      });
    } catch (error) {
      logger.error('Error adding to blacklist', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to add to blacklist',
      });
    }
  }

  /**
   * Add to whitelist
   */
  async addToWhitelist(req: Request, res: Response): Promise<void> {
    try {
      const entryData = req.body;

      const entry =
        await this.blacklistWhitelistManager.addToWhitelist(entryData);

      res.status(201).json({
        success: true,
        data: entry,
      });
    } catch (error) {
      logger.error('Error adding to whitelist', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to add to whitelist',
      });
    }
  }

  /**
   * Get blacklist entries
   */
  async getBlacklistEntries(req: Request, res: Response): Promise<void> {
    try {
      const { type, isActive, page, limit } = req.query;

      const options = {
        type: type as string,
        isActive: isActive === 'true',
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      };

      const result =
        await this.blacklistWhitelistManager.getBlacklistEntries(options);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error getting blacklist entries', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to get blacklist entries',
      });
    }
  }

  /**
   * Get whitelist entries
   */
  async getWhitelistEntries(req: Request, res: Response): Promise<void> {
    try {
      const { type, isActive, page, limit } = req.query;

      const options = {
        type: type as string,
        isActive: isActive === 'true',
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      };

      const result =
        await this.blacklistWhitelistManager.getWhitelistEntries(options);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error getting whitelist entries', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to get whitelist entries',
      });
    }
  }

  /**
   * Check velocity for transaction
   */
  async checkVelocity(req: Request, res: Response): Promise<void> {
    try {
      const { transaction } = req.body;

      const velocityCheck =
        await this.velocityChecker.checkVelocity(transaction);
      const velocitySignals =
        await this.velocityChecker.generateVelocitySignals(transaction);

      res.status(200).json({
        success: true,
        data: {
          velocityCheck,
          signals: velocitySignals,
        },
      });
    } catch (error) {
      logger.error('Error checking velocity', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to check velocity',
      });
    }
  }

  /**
   * Analyze device fingerprint
   */
  async analyzeDeviceFingerprint(req: Request, res: Response): Promise<void> {
    try {
      const { transaction } = req.body;

      const signals =
        await this.deviceFingerprintingService.analyzeDeviceFingerprint(
          transaction
        );

      res.status(200).json({
        success: true,
        data: {
          signals,
          deviceFingerprint: transaction.metadata?.deviceFingerprint,
        },
      });
    } catch (error) {
      logger.error('Error analyzing device fingerprint', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to analyze device fingerprint',
      });
    }
  }

  /**
   * Analyze geolocation
   */
  async analyzeGeolocation(req: Request, res: Response): Promise<void> {
    try {
      const { transaction } = req.body;

      const signals =
        await this.geolocationAnalysisService.analyzeGeolocation(transaction);

      res.status(200).json({
        success: true,
        data: {
          signals,
          geolocation: transaction.metadata?.geolocation,
          ipAddress: transaction.metadata?.ipAddress,
        },
      });
    } catch (error) {
      logger.error('Error analyzing geolocation', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to analyze geolocation',
      });
    }
  }

  /**
   * Analyze behavioral patterns
   */
  async analyzeBehavioralPatterns(req: Request, res: Response): Promise<void> {
    try {
      const { transaction } = req.body;

      const signals =
        await this.behavioralPatternDetectionService.analyzeBehavioralPatterns(
          transaction
        );

      res.status(200).json({
        success: true,
        data: {
          signals,
          userId: transaction.userId,
        },
      });
    } catch (error) {
      logger.error('Error analyzing behavioral patterns', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to analyze behavioral patterns',
      });
    }
  }

  /**
   * Get user behavioral profile
   */
  async getUserBehavioralProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const profile =
        await this.behavioralPatternDetectionService.getUserBehavioralProfile(
          userId
        );

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      logger.error('Error getting behavioral profile', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.params.userId,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to get behavioral profile',
      });
    }
  }

  /**
   * Create manual review case
   */
  async createReviewCase(req: Request, res: Response): Promise<void> {
    try {
      const { transaction, assessment, priority } = req.body;

      const reviewCase =
        await this.manualReviewWorkflowService.createReviewCase(
          transaction,
          assessment,
          priority
        );

      res.status(201).json({
        success: true,
        data: reviewCase,
      });
    } catch (error) {
      logger.error('Error creating review case', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to create review case',
      });
    }
  }

  /**
   * Get review queue
   */
  async getReviewQueue(req: Request, res: Response): Promise<void> {
    try {
      const { reviewerId } = req.params;
      const { priority, status, overdue, limit } = req.query;

      const filters = {
        priority: priority ? (priority as string).split(',') : undefined,
        status: status ? (status as string).split(',') : undefined,
        overdue: overdue === 'true',
        limit: limit ? parseInt(limit as string) : undefined,
      };

      const queue = await this.manualReviewWorkflowService.getReviewQueue(
        reviewerId,
        filters
      );

      res.status(200).json({
        success: true,
        data: queue,
      });
    } catch (error) {
      logger.error('Error getting review queue', {
        error: error instanceof Error ? error.message : 'Unknown error',
        reviewerId: req.params.reviewerId,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to get review queue',
      });
    }
  }

  /**
   * Submit review decision
   */
  async submitReviewDecision(req: Request, res: Response): Promise<void> {
    try {
      const { caseId } = req.params;
      const { reviewerId, decision, reason, notes, evidence } = req.body;

      const review =
        await this.manualReviewWorkflowService.submitReviewDecision(
          caseId,
          reviewerId,
          decision,
          reason,
          notes,
          evidence
        );

      res.status(200).json({
        success: true,
        data: review,
      });
    } catch (error) {
      logger.error('Error submitting review decision', {
        error: error instanceof Error ? error.message : 'Unknown error',
        caseId: req.params.caseId,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to submit review decision',
      });
    }
  }

  /**
   * Get fraud detection statistics
   */
  async getFraudStatistics(req: Request, res: Response): Promise<void> {
    try {
      const { days } = req.query;
      const daysPeriod = days ? parseInt(days as string) : 30;

      const [
        riskScoringStats,
        deviceStats,
        geoStats,
        behavioralStats,
        reviewStats,
        listStats,
      ] = await Promise.all([
        this.riskScoringService.getRiskScoringStatistics(daysPeriod),
        this.deviceFingerprintingService.getDeviceStatistics(daysPeriod),
        this.geolocationAnalysisService.getGeolocationStatistics(daysPeriod),
        this.behavioralPatternDetectionService.getBehavioralStatistics(
          daysPeriod
        ),
        this.manualReviewWorkflowService.getReviewStatistics(
          undefined,
          daysPeriod
        ),
        this.blacklistWhitelistManager.getListStatistics(),
      ]);

      res.status(200).json({
        success: true,
        data: {
          period: `${daysPeriod} days`,
          riskScoring: riskScoringStats,
          deviceAnalysis: deviceStats,
          geolocation: geoStats,
          behavioral: behavioralStats,
          manualReview: reviewStats,
          lists: listStats,
        },
      });
    } catch (error) {
      logger.error('Error getting fraud statistics', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to get fraud statistics',
      });
    }
  }

  /**
   * Update risk thresholds
   */
  async updateRiskThresholds(req: Request, res: Response): Promise<void> {
    try {
      const thresholds = req.body;

      await this.riskScoringService.updateRiskThresholds(thresholds);

      res.status(200).json({
        success: true,
        message: 'Risk thresholds updated successfully',
      });
    } catch (error) {
      logger.error('Error updating risk thresholds', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to update risk thresholds',
      });
    }
  }

  /**
   * Cleanup expired list entries
   */
  async cleanupExpiredEntries(req: Request, res: Response): Promise<void> {
    try {
      const result =
        await this.blacklistWhitelistManager.cleanupExpiredEntries();

      res.status(200).json({
        success: true,
        data: result,
        message: 'Expired entries cleaned up successfully',
      });
    } catch (error) {
      logger.error('Error cleaning up expired entries', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to cleanup expired entries',
      });
    }
  }
}
