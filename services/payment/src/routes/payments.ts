import express, { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { asyncHandler } from '../middleware/error.middleware';
import {
  validateCaptureRequest,
  validatePaymentBusinessRules,
  validatePaymentRequest,
  validateRefundRequest,
  validateStatusUpdate,
  validateTransactionFilters,
  validateTransactionId,
} from '../middleware/validation.middleware';

const router: express.Router = Router();
const paymentController = new PaymentController();

// Payment processing routes
router.post(
  '/',
  validatePaymentRequest,
  validatePaymentBusinessRules,
  asyncHandler(paymentController.processPayment)
);

router.post(
  '/:transactionId/capture',
  validateCaptureRequest,
  asyncHandler(paymentController.capturePayment)
);

router.post(
  '/:transactionId/cancel',
  validateTransactionId,
  asyncHandler(paymentController.cancelPayment)
);

router.post(
  '/:transactionId/refund',
  validateRefundRequest,
  asyncHandler(paymentController.refundPayment)
);

// Transaction management routes
router.get(
  '/:transactionId',
  validateTransactionId,
  asyncHandler(paymentController.getTransaction)
);

router.get(
  '/',
  validateTransactionFilters,
  asyncHandler(paymentController.getTransactions)
);

router.patch(
  '/:transactionId/status',
  validateStatusUpdate,
  asyncHandler(paymentController.updateTransactionStatus)
);

export default router;
