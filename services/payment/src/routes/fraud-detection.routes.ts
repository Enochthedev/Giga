import { Router } from 'express';
import { FraudDetectionController } from '../controllers/fraud-detection.controller';

export function createFraudDetectionRoutes(
  fraudDetectionController: FraudDetectionController
): Router {
  const router = Router();

  // Transaction analysis
  router.post(
    '/analyze',
    fraudDetectionController.analyzeTransaction.bind(fraudDetectionController)
  );
  router.post(
    '/velocity/check',
    fraudDetectionController.checkVelocity.bind(fraudDetectionController)
  );
  router.post(
    '/device/analyze',
    fraudDetectionController.analyzeDeviceFingerprint.bind(
      fraudDetectionController
    )
  );
  router.post(
    '/geolocation/analyze',
    fraudDetectionController.analyzeGeolocation.bind(fraudDetectionController)
  );
  router.post(
    '/behavioral/analyze',
    fraudDetectionController.analyzeBehavioralPatterns.bind(
      fraudDetectionController
    )
  );

  // Fraud rules management
  router.post(
    '/rules',
    fraudDetectionController.createFraudRule.bind(fraudDetectionController)
  );
  router.get(
    '/rules',
    fraudDetectionController.getActiveFraudRules.bind(fraudDetectionController)
  );
  router.put(
    '/rules/:ruleId',
    fraudDetectionController.updateFraudRule.bind(fraudDetectionController)
  );
  router.delete(
    '/rules/:ruleId',
    fraudDetectionController.deleteFraudRule.bind(fraudDetectionController)
  );
  router.post(
    '/rules/test',
    fraudDetectionController.testFraudRule.bind(fraudDetectionController)
  );

  // Blacklist/Whitelist management
  router.post(
    '/blacklist',
    fraudDetectionController.addToBlacklist.bind(fraudDetectionController)
  );
  router.get(
    '/blacklist',
    fraudDetectionController.getBlacklistEntries.bind(fraudDetectionController)
  );
  router.post(
    '/whitelist',
    fraudDetectionController.addToWhitelist.bind(fraudDetectionController)
  );
  router.get(
    '/whitelist',
    fraudDetectionController.getWhitelistEntries.bind(fraudDetectionController)
  );
  router.post(
    '/lists/cleanup',
    fraudDetectionController.cleanupExpiredEntries.bind(
      fraudDetectionController
    )
  );

  // Behavioral analysis
  router.get(
    '/behavioral/profile/:userId',
    fraudDetectionController.getUserBehavioralProfile.bind(
      fraudDetectionController
    )
  );

  // Manual review workflow
  router.post(
    '/review/cases',
    fraudDetectionController.createReviewCase.bind(fraudDetectionController)
  );
  router.get(
    '/review/queue/:reviewerId',
    fraudDetectionController.getReviewQueue.bind(fraudDetectionController)
  );
  router.post(
    '/review/cases/:caseId/decision',
    fraudDetectionController.submitReviewDecision.bind(fraudDetectionController)
  );

  // Statistics and monitoring
  router.get(
    '/statistics',
    fraudDetectionController.getFraudStatistics.bind(fraudDetectionController)
  );

  // Configuration
  router.put(
    '/config/risk-thresholds',
    fraudDetectionController.updateRiskThresholds.bind(fraudDetectionController)
  );

  return router;
}
