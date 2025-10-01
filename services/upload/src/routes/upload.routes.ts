import { Router } from 'express';
import { getConfig } from '../config';
import { UploadController } from '../controllers/upload.controller';
import {
  authenticate,
  optionalAuth,
  requirePermission,
  requireUploadPermission,
} from '../middleware/auth.middleware';
import {
  documentUpload,
  multipleFilesUpload,
  productImageUpload,
  profilePhotoUpload,
  propertyPhotoUpload,
  singleFileUpload,
  vehiclePhotoUpload,
} from '../middleware/multer.middleware';
import { AsyncProcessingService } from '../services/async-processing.service';
import { FileValidatorService } from '../services/file-validator.service';
import { MetadataService } from '../services/metadata.service';
import { ProcessingStatusService } from '../services/processing-status.service';
import { StorageManagerService } from '../services/storage-manager.service';
import { EntityType } from '../types/upload.types';

const config = getConfig();

// Initialize services
const fileValidator = new FileValidatorService(config.validation);
const storageManager = new StorageManagerService(config.storage);
const metadataService = new MetadataService();
const asyncProcessingService = new AsyncProcessingService();
const processingStatusService = new ProcessingStatusService();

// Initialize controller
const uploadController = new UploadController(
  fileValidator,
  storageManager,
  metadataService,
  asyncProcessingService,
  processingStatusService
);

const router: Router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UploadResult:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique file identifier
 *         url:
 *           type: string
 *           description: File access URL
 *         metadata:
 *           $ref: '#/components/schemas/FileMetadata'
 *         processingStatus:
 *           type: string
 *           enum: [pending, processing, completed, failed]
 *
 *     FileMetadata:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         originalName:
 *           type: string
 *         fileName:
 *           type: string
 *         mimeType:
 *           type: string
 *         size:
 *           type: integer
 *         path:
 *           type: string
 *         url:
 *           type: string
 *         entityType:
 *           type: string
 *           enum: [user_profile, product, property, vehicle, document, advertisement]
 *         entityId:
 *           type: string
 *         uploadedBy:
 *           type: string
 *         status:
 *           type: string
 *           enum: [uploading, processing, ready, failed, deleted]
 *         accessLevel:
 *           type: string
 *           enum: [public, private, restricted]
 *         metadata:
 *           type: object
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *             message:
 *               type: string
 */

/**
 * @swagger
 * /api/v1/uploads:
 *   post:
 *     summary: Upload a single file
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - entityType
 *               - entityId
 *               - uploadedBy
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               entityType:
 *                 type: string
 *                 enum: [user_profile, product, property, vehicle, document, advertisement]
 *               entityId:
 *                 type: string
 *               uploadedBy:
 *                 type: string
 *               accessLevel:
 *                 type: string
 *                 enum: [public, private, restricted]
 *                 default: private
 *               metadata:
 *                 type: string
 *                 description: JSON string of additional metadata
 *               tags:
 *                 type: string
 *                 description: Comma-separated list of tags
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UploadResult'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       413:
 *         description: File too large
 *       500:
 *         description: Internal server error
 */
router.post(
  '/',
  authenticate,
  requirePermission('upload:create'),
  singleFileUpload('file'),
  uploadController.uploadFile.bind(uploadController)
);

/**
 * @swagger
 * /api/v1/uploads/multiple:
 *   post:
 *     summary: Upload multiple files
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *               - uploadedBy
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               uploadedBy:
 *                 type: string
 *               files:
 *                 type: string
 *                 description: JSON string array of file metadata
 *     responses:
 *       201:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UploadResult'
 */
router.post(
  '/multiple',
  authenticate,
  requirePermission('upload:create'),
  multipleFilesUpload('files', 10),
  uploadController.uploadMultipleFiles.bind(uploadController)
);

/**
 * @swagger
 * /api/v1/uploads/profile/{userId}:
 *   post:
 *     summary: Upload profile photo
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Profile photo (images only, max 5MB)
 *               uploadedBy:
 *                 type: string
 *                 description: ID of the user uploading (defaults to userId)
 *     responses:
 *       201:
 *         description: Profile photo uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UploadResult'
 */
router.post(
  '/profile/:userId',
  authenticate,
  requireUploadPermission(EntityType.USER_PROFILE),
  profilePhotoUpload(),
  uploadController.uploadProfilePhoto.bind(uploadController)
);

/**
 * @swagger
 * /api/v1/uploads/product/{productId}:
 *   post:
 *     summary: Upload product image
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - uploadedBy
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Product image (images only, max 10MB)
 *               uploadedBy:
 *                 type: string
 *               isPrimary:
 *                 type: boolean
 *                 default: false
 *                 description: Whether this is the primary product image
 *     responses:
 *       201:
 *         description: Product image uploaded successfully
 */
router.post(
  '/product/:productId',
  authenticate,
  requireUploadPermission(EntityType.PRODUCT),
  productImageUpload(),
  uploadController.uploadProductImage.bind(uploadController)
);

/**
 * @swagger
 * /api/v1/uploads/property/{propertyId}:
 *   post:
 *     summary: Upload property photo
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - uploadedBy
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Property photo (images only, max 15MB)
 *               uploadedBy:
 *                 type: string
 *               roomType:
 *                 type: string
 *                 description: Type of room (e.g., bedroom, bathroom, kitchen)
 *               isPrimary:
 *                 type: boolean
 *                 default: false
 *                 description: Whether this is the primary property image
 *     responses:
 *       201:
 *         description: Property photo uploaded successfully
 */
router.post(
  '/property/:propertyId',
  authenticate,
  requireUploadPermission(EntityType.PROPERTY),
  propertyPhotoUpload(),
  uploadController.uploadPropertyPhoto.bind(uploadController)
);

/**
 * @swagger
 * /api/v1/uploads/vehicle/{vehicleId}:
 *   post:
 *     summary: Upload vehicle photo
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - uploadedBy
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Vehicle photo (images only, max 10MB)
 *               uploadedBy:
 *                 type: string
 *               photoType:
 *                 type: string
 *                 enum: [exterior, interior, dashboard, engine]
 *                 default: exterior
 *                 description: Type of vehicle photo
 *     responses:
 *       201:
 *         description: Vehicle photo uploaded successfully
 */
router.post(
  '/vehicle/:vehicleId',
  authenticate,
  requireUploadPermission(EntityType.VEHICLE),
  vehiclePhotoUpload(),
  uploadController.uploadVehiclePhoto.bind(uploadController)
);

/**
 * @swagger
 * /api/v1/uploads/document:
 *   post:
 *     summary: Upload document
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - entityType
 *               - entityId
 *               - uploadedBy
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Document file (PDF, DOC, XLS, TXT, CSV - max 25MB)
 *               entityType:
 *                 type: string
 *                 enum: [user_profile, product, property, vehicle, document, advertisement]
 *               entityId:
 *                 type: string
 *               uploadedBy:
 *                 type: string
 *               accessLevel:
 *                 type: string
 *                 enum: [public, private, restricted]
 *                 default: private
 *               metadata:
 *                 type: string
 *                 description: JSON string of additional metadata
 *               tags:
 *                 type: string
 *                 description: Comma-separated list of tags
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 */
router.post(
  '/document',
  authenticate,
  requireUploadPermission(EntityType.DOCUMENT),
  documentUpload(),
  uploadController.uploadDocument.bind(uploadController)
);

/**
 * @swagger
 * /api/v1/uploads/{fileId}:
 *   get:
 *     summary: Get file metadata
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID
 *     responses:
 *       200:
 *         description: File metadata retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/FileMetadata'
 *       404:
 *         description: File not found
 */
router.get(
  '/:fileId',
  optionalAuth,
  uploadController.getFile.bind(uploadController)
);

/**
 * @swagger
 * /api/v1/uploads/{fileId}:
 *   delete:
 *     summary: Delete file
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: File deleted successfully
 *       404:
 *         description: File not found
 */
router.delete(
  '/:fileId',
  authenticate,
  requirePermission('upload:delete'),
  uploadController.deleteFile.bind(uploadController)
);

/**
 * @swagger
 * /api/v1/uploads/{fileId}/status:
 *   get:
 *     summary: Get file processing status
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID
 *     responses:
 *       200:
 *         description: Processing status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       enum: [pending, processing, completed, failed]
 *                     progress:
 *                       type: number
 *                       minimum: 0
 *                       maximum: 100
 *                     message:
 *                       type: string
 *                     jobs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           jobId:
 *                             type: string
 *                           status:
 *                             type: string
 *                           progress:
 *                             type: number
 *                           message:
 *                             type: string
 */
router.get(
  '/:fileId/status',
  authenticate,
  requirePermission('upload:read'),
  uploadController.getProcessingStatus.bind(uploadController)
);

/**
 * @swagger
 * /api/v1/uploads/{fileId}/retry:
 *   post:
 *     summary: Retry failed file processing
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID
 *     responses:
 *       200:
 *         description: Processing retry initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Processing retry initiated
 */
router.post(
  '/:fileId/retry',
  authenticate,
  requirePermission('upload:retry'),
  uploadController.retryProcessing.bind(uploadController)
);

/**
 * @swagger
 * /api/v1/uploads/{fileId}/cancel:
 *   post:
 *     summary: Cancel file processing
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID
 *     responses:
 *       200:
 *         description: Processing cancellation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 cancelled:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post(
  '/:fileId/cancel',
  authenticate,
  requirePermission('upload:cancel'),
  uploadController.cancelProcessing.bind(uploadController)
);

/**
 * @swagger
 * /api/v1/uploads/health/queues:
 *   get:
 *     summary: Get queue health status
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Queue health status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     healthy:
 *                       type: boolean
 *                     queues:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           healthy:
 *                             type: boolean
 *                           stats:
 *                             type: object
 *                           issues:
 *                             type: array
 *                             items:
 *                               type: string
 */
router.get(
  '/health/queues',
  authenticate,
  requirePermission('upload:admin'),
  uploadController.getQueueHealth.bind(uploadController)
);

export default router;
