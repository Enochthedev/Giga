/**
 * Booking Routes - Hotel booking/reservation API
 */

import {
  BookingController,
  bookingValidation,
} from '@/controllers/booking.controller';
import { PrismaClient } from '@/generated/prisma-client';
import { Router } from 'express';

export function createBookingRoutes(prisma: PrismaClient): Router {
  const router = Router();
  const bookingController = new BookingController(prisma);

  /**
   * @swagger
   * /api/v1/bookings:
   *   post:
   *     summary: Create new booking/reservation
   *     tags: [Bookings]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateBookingRequest'
   *     responses:
   *       201:
   *         description: Booking created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Booking'
   *       400:
   *         description: Invalid request data
   *       404:
   *         description: Property or room type not found
   */
  router.post(
    '/',
    bookingValidation.createBooking,
    bookingController.createBooking.bind(bookingController)
  );

  /**
   * @swagger
   * /api/v1/bookings/validate:
   *   post:
   *     summary: Validate booking details before confirmation
   *     tags: [Bookings]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               propertyId:
   *                 type: string
   *               checkInDate:
   *                 type: string
   *                 format: date
   *               checkOutDate:
   *                 type: string
   *                 format: date
   *               rooms:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     roomTypeId:
   *                       type: string
   *                     quantity:
   *                       type: integer
   *     responses:
   *       200:
   *         description: Validation results
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
   *                     isValid:
   *                       type: boolean
   *                     errors:
   *                       type: array
   *                       items:
   *                         type: string
   *                     warnings:
   *                       type: array
   *                       items:
   *                         type: string
   */
  router.post(
    '/validate',
    bookingValidation.validateBooking,
    bookingController.validateBooking.bind(bookingController)
  );

  /**
   * @swagger
   * /api/v1/bookings/{bookingId}:
   *   get:
   *     summary: Get booking details
   *     tags: [Bookings]
   *     parameters:
   *       - in: path
   *         name: bookingId
   *         required: true
   *         schema:
   *           type: string
   *         description: Booking ID
   *     responses:
   *       200:
   *         description: Booking details retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/BookingDetails'
   *       404:
   *         description: Booking not found
   */
  router.get(
    '/:bookingId',
    bookingValidation.getBooking,
    bookingController.getBooking.bind(bookingController)
  );

  /**
   * @swagger
   * /api/v1/bookings/{bookingId}:
   *   put:
   *     summary: Update booking
   *     tags: [Bookings]
   *     parameters:
   *       - in: path
   *         name: bookingId
   *         required: true
   *         schema:
   *           type: string
   *         description: Booking ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateBookingRequest'
   *     responses:
   *       200:
   *         description: Booking updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Booking'
   *       404:
   *         description: Booking not found
   *       409:
   *         description: Booking cannot be modified
   */
  router.put(
    '/:bookingId',
    bookingValidation.updateBooking,
    bookingController.updateBooking.bind(bookingController)
  );

  /**
   * @swagger
   * /api/v1/bookings/{bookingId}:
   *   delete:
   *     summary: Cancel booking
   *     tags: [Bookings]
   *     parameters:
   *       - in: path
   *         name: bookingId
   *         required: true
   *         schema:
   *           type: string
   *         description: Booking ID
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               reason:
   *                 type: string
   *                 description: Cancellation reason
   *     responses:
   *       200:
   *         description: Booking cancelled successfully
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
   *                     booking:
   *                       $ref: '#/components/schemas/Booking'
   *                     refundAmount:
   *                       type: number
   *                     refundEligible:
   *                       type: boolean
   *       404:
   *         description: Booking not found
   *       409:
   *         description: Booking cannot be cancelled
   */
  router.delete(
    '/:bookingId',
    bookingValidation.cancelBooking,
    bookingController.cancelBooking.bind(bookingController)
  );

  /**
   * @swagger
   * /api/v1/bookings/{bookingId}/confirm:
   *   post:
   *     summary: Confirm booking and process payment
   *     tags: [Bookings]
   *     parameters:
   *       - in: path
   *         name: bookingId
   *         required: true
   *         schema:
   *           type: string
   *         description: Booking ID
   *     responses:
   *       200:
   *         description: Booking confirmed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/BookingResult'
   *       404:
   *         description: Booking not found
   *       409:
   *         description: Booking cannot be confirmed
   */
  router.post(
    '/:bookingId/confirm',
    bookingValidation.processBookingConfirmation,
    bookingController.processBookingConfirmation.bind(bookingController)
  );

  /**
   * @swagger
   * /api/v1/bookings/{bookingId}/status:
   *   put:
   *     summary: Update booking status
   *     tags: [Bookings]
   *     parameters:
   *       - in: path
   *         name: bookingId
   *         required: true
   *         schema:
   *           type: string
   *         description: Booking ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [pending, confirmed, checked_in, checked_out, cancelled, no_show, modified, expired]
   *               changedBy:
   *                 type: string
   *     responses:
   *       200:
   *         description: Booking status updated successfully
   *       404:
   *         description: Booking not found
   *       409:
   *         description: Invalid status transition
   */
  router.put(
    '/:bookingId/status',
    bookingValidation.updateBookingStatus,
    bookingController.updateBookingStatus.bind(bookingController)
  );

  /**
   * @swagger
   * /api/v1/bookings/{bookingId}/special-requests:
   *   post:
   *     summary: Add special requests to booking
   *     tags: [Bookings]
   *     parameters:
   *       - in: path
   *         name: bookingId
   *         required: true
   *         schema:
   *           type: string
   *         description: Booking ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               requests:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: List of special requests
   *     responses:
   *       200:
   *         description: Special requests added successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Booking'
   */
  router.post(
    '/:bookingId/special-requests',
    bookingValidation.addSpecialRequests,
    bookingController.addSpecialRequests.bind(bookingController)
  );

  /**
   * @swagger
   * /api/v1/bookings/{bookingId}/modify:
   *   put:
   *     summary: Modify booking with comprehensive validation
   *     tags: [Bookings]
   *     parameters:
   *       - in: path
   *         name: bookingId
   *         required: true
   *         schema:
   *           type: string
   *         description: Booking ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/BookingModificationRequest'
   *     responses:
   *       200:
   *         description: Booking modified successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/ModificationResult'
   *       400:
   *         description: Invalid modification request
   *       404:
   *         description: Booking not found
   *       409:
   *         description: Booking cannot be modified
   */
  router.put(
    '/:bookingId/modify',
    bookingValidation.modifyBooking,
    bookingController.modifyBooking.bind(bookingController)
  );

  /**
   * @swagger
   * /api/v1/bookings/{bookingId}/validate-modification:
   *   post:
   *     summary: Validate booking modification before processing
   *     tags: [Bookings]
   *     parameters:
   *       - in: path
   *         name: bookingId
   *         required: true
   *         schema:
   *           type: string
   *         description: Booking ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/BookingModificationRequest'
   *     responses:
   *       200:
   *         description: Modification validation results
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/ModificationValidation'
   */
  router.post(
    '/:bookingId/validate-modification',
    bookingValidation.validateBookingModification,
    bookingController.validateBookingModification.bind(bookingController)
  );

  /**
   * @swagger
   * /api/v1/bookings/{bookingId}/modification-options:
   *   get:
   *     summary: Get available modification options for a booking
   *     tags: [Bookings]
   *     parameters:
   *       - in: path
   *         name: bookingId
   *         required: true
   *         schema:
   *           type: string
   *         description: Booking ID
   *     responses:
   *       200:
   *         description: Modification options retrieved successfully
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
   *                     canModifyDates:
   *                       type: boolean
   *                     canModifyRooms:
   *                       type: boolean
   *                     canModifyGuests:
   *                       type: boolean
   *                     restrictions:
   *                       type: array
   *                       items:
   *                         type: string
   */
  router.get(
    '/:bookingId/modification-options',
    bookingValidation.getBookingModificationOptions,
    bookingController.getBookingModificationOptions.bind(bookingController)
  );

  /**
   * @swagger
   * /api/v1/bookings/{bookingId}/cancellation-info:
   *   get:
   *     summary: Get cancellation policy and refund calculation
   *     tags: [Bookings]
   *     parameters:
   *       - in: path
   *         name: bookingId
   *         required: true
   *         schema:
   *           type: string
   *         description: Booking ID
   *     responses:
   *       200:
   *         description: Cancellation information retrieved successfully
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
   *                     canCancel:
   *                       type: boolean
   *                     refundCalculation:
   *                       $ref: '#/components/schemas/RefundCalculation'
   *                     policy:
   *                       $ref: '#/components/schemas/CancellationPolicyDetails'
   */
  router.get(
    '/:bookingId/cancellation-info',
    bookingValidation.getCancellationInfo,
    bookingController.getCancellationInfo.bind(bookingController)
  );

  return router;
}

/**
 * User Booking Routes - Get user's bookings
 */
export function createUserBookingRoutes(prisma: PrismaClient): Router {
  const router = Router();
  const bookingController = new BookingController(prisma);

  /**
   * @swagger
   * /api/v1/users/{userId}/bookings:
   *   get:
   *     summary: Get user's bookings
   *     tags: [User Bookings]
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [pending, confirmed, checked_in, checked_out, cancelled, no_show]
   *         description: Filter by booking status
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 20
   *     responses:
   *       200:
   *         description: User bookings retrieved successfully
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
   *                     $ref: '#/components/schemas/Booking'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   */
  router.get(
    '/:userId/bookings',
    bookingValidation.getUserBookings,
    bookingController.getUserBookings.bind(bookingController)
  );

  return router;
}
