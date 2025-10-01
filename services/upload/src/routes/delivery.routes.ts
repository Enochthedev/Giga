import { Router } from 'express';
import { DeliveryController } from '../controllers/delivery.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { rateLimitMiddleware } from '../middleware/rate-limit.middleware';

export function createDeliveryRoutes(
  deliveryController: DeliveryController
): Router {
  const router = Router();

  // Apply rate limiting to all delivery routes
  router.use(rateLimitMiddleware);

  // File serving routes (public access with optional auth)
  router.get(
    '/files/:fileId',
    deliveryController.serveFile.bind(deliveryController)
  );

  // Authenticated delivery routes
  router.use(authMiddleware);

  // Presigned URL generation
  router.post(
    '/files/:fileId/presigned-url',
    deliveryController.generatePresignedUrl.bind(deliveryController)
  );

  // Responsive URLs
  router.get(
    '/files/:fileId/responsive-urls',
    deliveryController.getResponsiveUrls.bind(deliveryController)
  );

  // Delivery info (includes responsive URLs and presigned URL)
  router.get(
    '/files/:fileId/delivery-info',
    deliveryController.getDeliveryInfo.bind(deliveryController)
  );

  // Presigned URL validation
  router.post(
    '/validate-presigned-url',
    deliveryController.validatePresignedUrl.bind(deliveryController)
  );

  return router;
}
