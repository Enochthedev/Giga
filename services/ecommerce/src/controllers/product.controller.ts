import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

/**
 * ProductController handles HTTP requests for product operations
 * All business logic is delegated to ProductService
 */
export class ProductController {
  constructor(private productService: ProductService) {}

  /**
   * GET /api/v1/products - Get products with filtering and pagination
   */
  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        search: req.query.search as string | undefined,
        category: req.query.category as string | undefined,
        subcategory: req.query.subcategory as string | undefined,
        brand: req.query.brand as string | undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        sortBy: (req.query.sortBy as string) || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
      };

      const result = await this.productService.getProducts(filters);

      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch products',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/products/:id - Get product by ID
   */
  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Product ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const product = await this.productService.getProductById(id);

      res.json({
        success: true,
        data: { product },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get product error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch product';
      const statusCode = errorMessage.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/products/categories - Get product categories
   */
  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.productService.getCategories();

      res.json({
        success: true,
        data: { categories },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch categories',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/v1/products/featured - Get featured products
   */
  async getFeaturedProducts(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const products = await this.productService.getFeaturedProducts(limit);

      res.json({
        success: true,
        data: { products },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get featured products error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch featured products',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
