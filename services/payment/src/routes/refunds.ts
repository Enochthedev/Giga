import { Router } from 'express';
import { RefundController } from '../controllers/refund.controller';
import { asyncHandler } from '../middleware/error.middleware';
import { validateRefundRequest } from '../utils/validation';

const router: Router = Router();
const refundController = new RefundController();

// Validation middleware for refund requests
const validateRefund = (req: any, res: any, next: any) => {
  try {
    req.body = validateRefundRequest(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * tags:
 *   name: Refunds
 *   description: Refund management endpoints
 */

/**
 * Process a refund
 */
router.post('/', validateRefund, asyncHandler(refundController.processRefund));

/**
 * Process a partial refund
 */
router.post(
  '/partial',
  validateRefund,
  asyncHandler(refundController.processPartialRefund)
);

/**
 * Process a full refund
 */
router.post(
  '/full',
  validateRefund,
  asyncHandler(refundController.processFullRefund)
);

/**
 * Get refund details
 */
router.get('/:refundId', asyncHandler(refundController.getRefund));

/**
 * Cancel a pending refund
 */
router.post('/:refundId/cancel', asyncHandler(refundController.cancelRefund));

export default router;
