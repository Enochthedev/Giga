import { Router } from 'express';
import { PaymentMethodController } from '../controllers/payment-method.controller';
import { validateRequest } from '../middleware/validation.middleware';

<<<<<<< HEAD
const router: Router = Router();
=======
const router = Router();
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
const paymentMethodController = new PaymentMethodController();

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentMethod:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique payment method identifier
 *         userId:
 *           type: string
 *           description: User ID who owns this payment method
 *         type:
 *           type: string
 *           enum: [card, bank_account, digital_wallet, crypto, buy_now_pay_later]
 *           description: Type of payment method
 *         provider:
 *           type: string
 *           description: Payment provider (e.g., stripe, paypal)
 *         token:
 *           type: string
 *           description: Secure token for the payment method
 *         isDefault:
 *           type: boolean
 *           description: Whether this is the default payment method
 *         metadata:
 *           type: object
 *           properties:
 *             last4:
 *               type: string
 *               description: Last 4 digits of card/account
 *             brand:
 *               type: string
 *               description: Card brand (visa, mastercard, etc.)
 *             expiryMonth:
 *               type: integer
 *               description: Card expiry month
 *             expiryYear:
 *               type: integer
 *               description: Card expiry year
 *             holderName:
 *               type: string
 *               description: Cardholder name
 *             bankName:
 *               type: string
 *               description: Bank name for bank accounts
 *             accountType:
 *               type: string
 *               description: Account type (checking, savings)
 *             walletType:
 *               type: string
 *               description: Digital wallet type
 *         billingAddress:
 *           $ref: '#/components/schemas/Address'
 *         isActive:
 *           type: boolean
 *           description: Whether the payment method is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Address:
 *       type: object
 *       required:
 *         - line1
 *         - city
 *         - postalCode
 *         - country
 *       properties:
 *         line1:
 *           type: string
 *           description: Address line 1
 *         line2:
 *           type: string
 *           description: Address line 2
 *         city:
 *           type: string
 *           description: City
 *         state:
 *           type: string
 *           description: State or province
 *         postalCode:
 *           type: string
 *           description: Postal code
 *         country:
 *           type: string
 *           description: Country code (ISO 3166-1 alpha-2)
 *
 *     CreatePaymentMethodRequest:
 *       type: object
 *       required:
 *         - userId
 *         - type
 *       properties:
 *         userId:
 *           type: string
 *           description: User ID
 *         type:
 *           type: string
 *           enum: [card, bank_account, digital_wallet, crypto, buy_now_pay_later]
 *           description: Payment method type
 *         card:
 *           type: object
 *           properties:
 *             number:
 *               type: string
 *               description: Card number
 *             expiryMonth:
 *               type: integer
 *               minimum: 1
 *               maximum: 12
 *               description: Expiry month
 *             expiryYear:
 *               type: integer
 *               description: Expiry year
 *             cvc:
 *               type: string
 *               description: Card verification code
 *             holderName:
 *               type: string
 *               description: Cardholder name
 *         bankAccount:
 *           type: object
 *           properties:
 *             accountNumber:
 *               type: string
 *               description: Bank account number
 *             routingNumber:
 *               type: string
 *               description: Bank routing number
 *             accountType:
 *               type: string
 *               enum: [checking, savings]
 *               description: Account type
 *             accountHolderName:
 *               type: string
 *               description: Account holder name
 *             bankName:
 *               type: string
 *               description: Bank name
 *         digitalWallet:
 *           type: object
 *           properties:
 *             walletType:
 *               type: string
 *               enum: [paypal, apple_pay, google_pay, amazon_pay]
 *               description: Wallet type
 *             email:
 *               type: string
 *               format: email
 *               description: Email for wallet
 *             phone:
 *               type: string
 *               description: Phone for wallet
 *             walletId:
 *               type: string
 *               description: Wallet identifier
 *         billingAddress:
 *           $ref: '#/components/schemas/Address'
 *         isDefault:
 *           type: boolean
 *           description: Set as default payment method
 *         metadata:
 *           type: object
 *           description: Additional metadata
 */

/**
 * @swagger
 * /api/payment-methods:
 *   post:
 *     summary: Create a new payment method
 *     tags: [Payment Methods]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePaymentMethodRequest'
 *     responses:
 *       201:
 *         description: Payment method created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/PaymentMethod'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post(
  '/',
  validateRequest,
  paymentMethodController.createPaymentMethod.bind(paymentMethodController)
);

/**
 * @swagger
 * /api/payment-methods/{id}:
 *   get:
 *     summary: Get payment method by ID
 *     tags: [Payment Methods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment method ID
 *     responses:
 *       200:
 *         description: Payment method retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/PaymentMethod'
 *       404:
 *         description: Payment method not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:id',
  paymentMethodController.getPaymentMethod.bind(paymentMethodController)
);

/**
 * @swagger
 * /api/payment-methods/{id}:
 *   put:
 *     summary: Update payment method
 *     tags: [Payment Methods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment method ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               billingAddress:
 *                 $ref: '#/components/schemas/Address'
 *               isDefault:
 *                 type: boolean
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Payment method updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/PaymentMethod'
 *       404:
 *         description: Payment method not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/:id',
  validateRequest,
  paymentMethodController.updatePaymentMethod.bind(paymentMethodController)
);

/**
 * @swagger
 * /api/payment-methods/{id}:
 *   delete:
 *     summary: Delete payment method
 *     tags: [Payment Methods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment method ID
 *     responses:
 *       200:
 *         description: Payment method deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Payment method not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/:id',
  paymentMethodController.deletePaymentMethod.bind(paymentMethodController)
);

/**
 * @swagger
 * /api/payment-methods/users/{userId}:
 *   get:
 *     summary: Get all payment methods for a user
 *     tags: [Payment Methods]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User payment methods retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PaymentMethod'
 *                 count:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */
router.get(
  '/users/:userId',
  paymentMethodController.getUserPaymentMethods.bind(paymentMethodController)
);

/**
 * @swagger
 * /api/payment-methods/{id}/default:
 *   put:
 *     summary: Set payment method as default
 *     tags: [Payment Methods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment method ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID
 *     responses:
 *       200:
 *         description: Default payment method set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/PaymentMethod'
 *       404:
 *         description: Payment method not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/:id/default',
  validateRequest,
  paymentMethodController.setDefaultPaymentMethod.bind(paymentMethodController)
);

/**
 * @swagger
 * /api/payment-methods/tokenize:
 *   post:
 *     summary: Tokenize payment method data
 *     tags: [Payment Methods]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePaymentMethodRequest'
 *     responses:
 *       200:
 *         description: Payment method tokenized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post(
  '/tokenize',
  validateRequest,
  paymentMethodController.tokenizePaymentMethod.bind(paymentMethodController)
);

/**
 * @swagger
 * /api/payment-methods/validate/{token}:
 *   get:
 *     summary: Validate payment method token
 *     tags: [Payment Methods]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment method token
 *     responses:
 *       200:
 *         description: Token validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     valid:
 *                       type: boolean
 *       500:
 *         description: Internal server error
 */
router.get(
  '/validate/:token',
  paymentMethodController.validateToken.bind(paymentMethodController)
);

export default router;
