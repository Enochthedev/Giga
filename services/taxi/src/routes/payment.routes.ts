import express, { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { paymentSchemas } from '../schemas/payment.schema';

const router: express.Router = Router();
const paymentController = new PaymentController();

// Payment processing routes
router.post(
  '/rides/:rideId/payment',
  authenticate,
  validateRequest(paymentSchemas.processRidePayment),
  paymentController.processRidePayment
);

router.post(
  '/rides/:rideId/refund',
  authenticate,
  validateRequest(paymentSchemas.refundRidePayment),
  paymentController.refundRidePayment
);

// Transaction routes
router.get(
  '/transactions/:transactionId',
  authenticate,
  paymentController.getPaymentTransaction
);

// Driver earnings and payout routes
router.get(
  '/drivers/:driverId/earnings',
  authenticate,
  paymentController.getDriverEarningsSummary
);

router.post(
  '/drivers/:driverId/payouts',
  authenticate,
  validateRequest(paymentSchemas.createDriverPayout),
  paymentController.createDriverPayout
);

router.post(
  '/payouts/process',
  authenticate,
  paymentController.processDriverPayouts
);

// Webhook routes (no authentication for external webhooks)
router.post('/webhooks/payment', paymentController.handlePaymentWebhook);

export default router;
