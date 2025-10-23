/**
 * Guest Routes - Defines HTTP routes for guest profile management
 */

import { GuestController } from '@/controllers/guest.controller';
import { PrismaClient } from '@/generated/prisma-client';
import { Router } from 'express';

const router: Router = Router();
const prisma = new PrismaClient();
const guestController = new GuestController(prisma);

/**
 * @swagger
 * components:
 *   schemas:
 *     GuestProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the guest profile
 *         _userId:
 *           type: string
 *           description: Reference to Auth Service user ID
 *         personalInfo:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             middleName:
 *               type: string
 *             title:
 *               type: string
 *             dateOfBirth:
 *               type: string
 *               format: date
 *             nationality:
 *               type: string
 *             gender:
 *               type: string
 *               enum: [male, female, other, prefer_not_to_say]
 *         contactInfo:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             phone:
 *               type: string
 *             alternatePhone:
 *               type: string
 *             address:
 *               type: object
 *               properties:
 *                 street:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 country:
 *                   type: string
 *                 postalCode:
 *                   type: string
 *         preferences:
 *           type: object
 *           properties:
 *             roomPreferences:
 *               type: object
 *             servicePreferences:
 *               type: object
 *             communicationLanguage:
 *               type: string
 *             currency:
 *               type: string
 *             timezone:
 *               type: string
 *         bookingHistory:
 *           type: array
 *           items:
 *             type: object
 *         loyaltyPoints:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateGuestProfileRequest:
 *       type: object
 *       required:
 *         - _userId
 *         - personalInfo
 *         - contactInfo
 *       properties:
 *         _userId:
 *           type: string
 *           description: Reference to Auth Service user ID
 *         personalInfo:
 *           type: object
 *           required:
 *             - firstName
 *             - lastName
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             middleName:
 *               type: string
 *             title:
 *               type: string
 *             dateOfBirth:
 *               type: string
 *               format: date
 *             nationality:
 *               type: string
 *             gender:
 *               type: string
 *               enum: [male, female, other, prefer_not_to_say]
 *         contactInfo:
 *           type: object
 *           required:
 *             - email
 *             - phone
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             phone:
 *               type: string
 *             alternatePhone:
 *               type: string
 *             address:
 *               type: object
 *               properties:
 *                 street:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 country:
 *                   type: string
 *                 postalCode:
 *                   type: string
 *         preferences:
 *           type: object
 *         communicationPreferences:
 *           type: object
 *
 *     UpdateGuestProfileRequest:
 *       type: object
 *       properties:
 *         personalInfo:
 *           type: object
 *         contactInfo:
 *           type: object
 *         preferences:
 *           type: object
 *         communicationPreferences:
 *           type: object
 *         accessibility:
 *           type: object
 *         dietaryRestrictions:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/v1/guests:
 *   post:
 *     summary: Create a new guest profile
 *     tags: [Guests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGuestProfileRequest'
 *     responses:
 *       201:
 *         description: Guest profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/GuestProfile'
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *       409:
 *         description: Guest profile already exists
 *       500:
 *         description: Internal server error
 */
router.post('/', guestController.createGuestProfile.bind(guestController));

/**
 * @swagger
 * /api/v1/guests/search:
 *   get:
 *     summary: Search guest profiles
 *     tags: [Guests]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search by guest name
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Search by email
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Search by phone number
 *       - in: query
 *         name: nationality
 *         schema:
 *           type: string
 *         description: Filter by nationality
 *       - in: query
 *         name: registrationDateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by registration date from
 *       - in: query
 *         name: registrationDateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by registration date to
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, registration_date, last_booking_date, total_bookings, total_spent, loyalty_points]
 *         description: Sort by field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Guest profiles retrieved successfully
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
 *                     guests:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/GuestProfile'
 *                     totalCount:
 *                       type: integer
 *                     hasMore:
 *                       type: boolean
 *       500:
 *         description: Internal server error
 */
router.get(
  '/search',
  guestController.searchGuestProfiles.bind(guestController)
);

/**
 * @swagger
 * /api/v1/guests/user/{userId}:
 *   get:
 *     summary: Get guest profile by user ID
 *     tags: [Guests]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Auth Service user ID
 *     responses:
 *       200:
 *         description: Guest profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/GuestProfile'
 *       404:
 *         description: Guest profile not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/user/:userId',
  guestController.getGuestProfileByUserId.bind(guestController)
);

/**
 * @swagger
 * /api/v1/guests/{id}:
 *   get:
 *     summary: Get guest profile by ID
 *     tags: [Guests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Guest profile ID
 *     responses:
 *       200:
 *         description: Guest profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/GuestProfile'
 *       404:
 *         description: Guest profile not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', guestController.getGuestProfile.bind(guestController));

/**
 * @swagger
 * /api/v1/guests/{id}:
 *   put:
 *     summary: Update guest profile
 *     tags: [Guests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Guest profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateGuestProfileRequest'
 *     responses:
 *       200:
 *         description: Guest profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/GuestProfile'
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *       404:
 *         description: Guest profile not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', guestController.updateGuestProfile.bind(guestController));

/**
 * @swagger
 * /api/v1/guests/{id}/booking-history:
 *   post:
 *     summary: Update guest booking history
 *     tags: [Guests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Guest profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - propertyId
 *               - propertyName
 *               - checkInDate
 *               - checkOutDate
 *               - totalAmount
 *               - currency
 *               - status
 *             properties:
 *               bookingId:
 *                 type: string
 *               propertyId:
 *                 type: string
 *               propertyName:
 *                 type: string
 *               checkInDate:
 *                 type: string
 *                 format: date
 *               checkOutDate:
 *                 type: string
 *                 format: date
 *               totalAmount:
 *                 type: number
 *               currency:
 *                 type: string
 *               status:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               review:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking history updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *       404:
 *         description: Guest profile not found
 *       500:
 *         description: Internal server error
 */
router.post(
  '/:id/booking-history',
  guestController.updateBookingHistory.bind(guestController)
);

/**
 * @swagger
 * /api/v1/guests/{id}/loyalty-points:
 *   post:
 *     summary: Update guest loyalty points
 *     tags: [Guests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Guest profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - points
 *               - reason
 *             properties:
 *               points:
 *                 type: integer
 *                 description: Points to add (positive) or subtract (negative)
 *               reason:
 *                 type: string
 *                 description: Reason for the points change
 *     responses:
 *       200:
 *         description: Loyalty points updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *       404:
 *         description: Guest profile not found
 *       500:
 *         description: Internal server error
 */
router.post(
  '/:id/loyalty-points',
  guestController.updateLoyaltyPoints.bind(guestController)
);

/**
 * @swagger
 * /api/v1/guests/{id}/activity-log:
 *   get:
 *     summary: Get guest activity log
 *     tags: [Guests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Guest profile ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Activity log retrieved successfully
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
 *                     activities:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           guestId:
 *                             type: string
 *                           activityType:
 *                             type: string
 *                           description:
 *                             type: string
 *                           metadata:
 *                             type: object
 *                           timestamp:
 *                             type: string
 *                             format: date-time
 *                     totalCount:
 *                       type: integer
 *                     hasMore:
 *                       type: boolean
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:id/activity-log',
  guestController.getGuestActivityLog.bind(guestController)
);

/**
 * @swagger
 * /api/v1/guests/{id}:
 *   delete:
 *     summary: Delete guest profile
 *     tags: [Guests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Guest profile ID
 *     responses:
 *       200:
 *         description: Guest profile deleted successfully
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
 *         description: Guest profile not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', guestController.deleteGuestProfile.bind(guestController));

export default router;
