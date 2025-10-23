import { Router } from 'express';
import { DisputeController } from '../controllers/dispute.controller';
import { asyncHandler } from '../middleware/error.middleware';

const router: Router = Router();
const disputeController = new DisputeController();

/**
 * @swagger
 * tags:
 *   name: Disputes
 *   description: Dispute management endpoints
 */

/**
 * Create a new dispute
 */
router.post('/', asyncHandler(disputeController.createDispute));

/**
 * Get dispute analytics
 */
router.get('/analytics', asyncHandler(disputeController.getDisputeAnalytics));

/**
 * Get dispute details
 */
router.get('/:disputeId', asyncHandler(disputeController.getDispute));

/**
 * Submit evidence for a dispute
 */
router.post(
  '/:disputeId/evidence',
  asyncHandler(disputeController.submitEvidence)
);

/**
 * Respond to a dispute
 */
router.post(
  '/:disputeId/respond',
  asyncHandler(disputeController.respondToDispute)
);

/**
 * Update dispute status
 */
router.patch(
  '/:disputeId/status',
  asyncHandler(disputeController.updateDisputeStatus)
);

export default router;
