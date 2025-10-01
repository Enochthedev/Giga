import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller';
import { GatewayManager } from '../services/gateway-manager.service';

const router = Router();

// Initialize webhook controller
const gatewayManager = new GatewayManager();
const webhookController = new WebhookController(gatewayManager);

/**
 * @swagger
 * /webhooks/stripe:
 *   post:
 *     summary: Handle Stripe webhook events
 *     tags: [Webhooks]
 *     description: Endpoint for receiving Stripe webhook events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Stripe webhook event payload
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid webhook signature or payload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid signature"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Webhook processing failed"
 */
router.post('/stripe', (req, res) => {
  webhookController.handleStripeWebhook(req, res);
});

/**
 * @swagger
 * /webhooks/paypal:
 *   post:
 *     summary: Handle PayPal webhook events
 *     tags: [Webhooks]
 *     description: Endpoint for receiving PayPal webhook events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: PayPal webhook event payload
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid webhook signature or payload
 *       500:
 *         description: Internal server error
 */
router.post('/paypal', (req, res) => {
  webhookController.handlePayPalWebhook(req, res);
});

/**
 * @swagger
 * /webhooks/paystack:
 *   post:
 *     summary: Handle Paystack webhook events
 *     tags: [Webhooks]
 *     description: Endpoint for receiving Paystack webhook events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Paystack webhook event payload
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid webhook signature or payload
 *       500:
 *         description: Internal server error
 */
router.post('/paystack', (req, res) => {
  webhookController.handlePaystackWebhook(req, res);
});

/**
 * @swagger
 * /webhooks/flutterwave:
 *   post:
 *     summary: Handle Flutterwave webhook events
 *     tags: [Webhooks]
 *     description: Endpoint for receiving Flutterwave webhook events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Flutterwave webhook event payload
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid webhook signature or payload
 *       500:
 *         description: Internal server error
 */
router.post('/flutterwave', (req, res) => {
  webhookController.handleFlutterwaveWebhook(req, res);
});

/**
 * @swagger
 * /webhooks/{gatewayId}:
 *   post:
 *     summary: Handle webhook events for any gateway
 *     tags: [Webhooks]
 *     description: Generic endpoint for receiving webhook events from any payment gateway
 *     parameters:
 *       - in: path
 *         name: gatewayId
 *         required: true
 *         schema:
 *           type: string
 *           enum: [stripe, paypal, square, adyen, paystack, flutterwave]
 *         description: The payment gateway identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Webhook event payload
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid webhook signature or payload
 *       404:
 *         description: Gateway not found
 *       500:
 *         description: Internal server error
 */
router.post('/:gatewayId', (req, res) => {
  webhookController.handleWebhook(req, res);
});

export default router;
