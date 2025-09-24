import { Router } from 'express';
import multer from 'multer';
import { UploadController } from '../controllers/upload.controller';

const router = Router();
const uploadController = new UploadController();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
    files: 10, // Maximum 10 files per request
  },
  fileFilter: (req, file, cb) => {
    // Basic file type filtering - detailed validation happens in the service
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
      'application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed`));
    }
  },
});

/**
 * @swagger
 * /api/v1/upload/profile-photo:
 *   post:
 *     summary: Upload profile photo
 *     tags: [Upload]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Photo uploaded successfully
 */
router.post('/profile-photo',
  upload.single('photo'),
  uploadController.uploadProfilePhoto.bind(uploadController)
);

/**
 * @swagger
 * /api/v1/upload/product-image:
 *   post:
 *     summary: Upload product image
 *     tags: [Upload]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               productId:
 *                 type: string
 *               vendorId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 */
router.post('/product-image',
  upload.single('image'),
  uploadController.uploadProductImage.bind(uploadController)
);

/**
 * @swagger
 * /api/v1/upload/property-photo:
 *   post:
 *     summary: Upload property photo
 *     tags: [Upload]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *               propertyId:
 *                 type: string
 *               hostId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Photo uploaded successfully
 */
router.post('/property-photo',
  upload.single('photo'),
  uploadController.uploadPropertyPhoto.bind(uploadController)
);

/**
 * @swagger
 * /api/v1/upload/vehicle-photo:
 *   post:
 *     summary: Upload vehicle photo
 *     tags: [Upload]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *               vehicleId:
 *                 type: string
 *               driverId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Photo uploaded successfully
 */
router.post('/vehicle-photo',
  upload.single('photo'),
  uploadController.uploadVehiclePhoto.bind(uploadController)
);

/**
 * @swagger
 * /api/v1/upload/document:
 *   post:
 *     summary: Upload document
 *     tags: [Upload]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *               entityId:
 *                 type: string
 *               entityType:
 *                 type: string
 *               uploadedBy:
 *                 type: string
 *     responses:
 *       200:
 *         description: Document uploaded successfully
 */
router.post('/document',
  upload.single('document'),
  uploadController.uploadDocument.bind(uploadController)
);

/**
 * @swagger
 * /api/v1/upload/multiple:
 *   post:
 *     summary: Upload multiple files
 *     tags: [Upload]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               entityId:
 *                 type: string
 *               entityType:
 *                 type: string
 *               uploadedBy:
 *                 type: string
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 */
router.post('/multiple',
  upload.array('files', 10),
  uploadController.uploadMultipleFiles.bind(uploadController)
);

/**
 * @swagger
 * /api/v1/upload/{fileId}:
 *   delete:
 *     summary: Delete uploaded file
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File deleted successfully
 */
router.delete('/:fileId',
  uploadController.deleteFile.bind(uploadController)
);

/**
 * @swagger
 * /api/v1/upload/stats:
 *   get:
 *     summary: Get upload service statistics
 *     tags: [Upload]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/stats',
  uploadController.getStats.bind(uploadController)
);

export { router as uploadRoutes };
