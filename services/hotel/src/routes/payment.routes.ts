/**
 * Payment Routes for Hotel Service
 * Defines API endpoints for payment processing, deposits, and refunds
 */

import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';

const router: Router = Router();
const paymentController = new PaymentController();

// Payment processing routes
router.post(
  '/payments',
  paymentController.processPayment.bind(paymentController)
);
router.post(
  '/payments/authorize',
  paymentController.authorizePayment.bind(paymentController)
);
router.post(
  '/payments/:paymentId/capture',
  paymentController.capturePayment.bind(paymentController)
);
router.post(
  '/payments/:paymentId/void',
  paymentController.voidPayment.bind(paymentController)
);
router.get(
  '/payments/:paymentId/status',
  paymentController.getPaymentStatus.bind(paymentController)
);

// Deposit management routes
router.post(
  '/bookings/:bookingId/deposits/calculate',
  paymentController.calculateDeposit.bind(paymentController)
);
router.post(
  '/deposits',
  paymentController.processDeposit.bind(paymentController)
);

// Payment schedule routes
router.post(
  '/bookings/:bookingId/payment-schedules',
  paymentController.createPaymentSchedule.bind(paymentController)
);
router.post(
  '/scheduled-payments/:paymentId/process',
  paymentController.processScheduledPayment.bind(paymentController)
);

// Refund management routes
router.post(
  '/bookings/:bookingId/refunds/calculate',
  paymentController.calculateRefund.bind(paymentController)
);
router.post(
  '/refunds',
  paymentController.processRefund.bind(paymentController)
);
router.get(
  '/refunds/:refundId/status',
  paymentController.getRefundStatus.bind(paymentController)
);
router.get(
  '/payments/:paymentId/refund-eligibility',
  paymentController.validateRefundEligibility.bind(paymentController)
);

export default router;
