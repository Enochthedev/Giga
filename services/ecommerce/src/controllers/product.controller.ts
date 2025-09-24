import { Request, Response } from 'express';
import { cacheService } from '../services/cache.service';

export class ProductController {
  async getProducts(req: Request, res: Response) {
    try {
      const {
        search,
        category,
        subcategory,
        brand,
        minPrice,
        maxPrice,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 20,
      } = req.query;

      // Create structured query object for better caching
      const queryParams = {
        search,
        category,
        subcategory,
        brand,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
        page: Number(page),
        limit: Number(limit),
      };

      // Try to get cached results with enhanced caching
      const cachedResults =
        await cacheService.getCachedSearchResults(queryParams);
      if (cachedResults) {
        return res.json({
          success: true,
          data: cachedResults,
          cached: true,
          timestamp: new Date().toISOString(),
        });
      }

      const skip = (queryParams.page - 1) * queryParams.limit;
      const where: any = { isActive: true };

      // Build search filters
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
          { brand: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      if (category) where.category = category;
      if (subcategory) where.subcategory = subcategory;
      if (brand) where.brand = brand;

      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = Number(minPrice);
        if (maxPrice) where.price.lte = Number(maxPrice);
      }

      // Build sort options
      const orderBy: any = {};
      orderBy[sortBy as string] = sortOrder;

      const [products, total] = await Promise.all([
        req._prisma.product.findMany({
          where,
          skip,
          take: queryParams.limit,
          orderBy,
          include: {
            inventory: true,
          },
        }),
        req._prisma.product.count({ where }),
      ]);

      const result = {
        products,
        pagination: {
          page: queryParams.page,
          limit: queryParams.limit,
          total,
          pages: Math.ceil(total / queryParams.limit),
        },
      };

      // Cache results with enhanced caching strategy
      await cacheService.cacheSearchResults(queryParams, result);

      // Also cache individual products for better performance
      if (products.length > 0) {
        await cacheService.cacheProductsBatch(products);
      }

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

  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Try to get cached product with enhanced caching
      const cachedProduct = await cacheService.getCachedProduct(id);
      if (cachedProduct) {
        return res.json({
          success: true,
          data: { product: cachedProduct },
          cached: true,
          timestamp: new Date().toISOString(),
        });
      }

      const product = await req._prisma.product.findUnique({
        where: { id, isActive: true },
        include: {
          inventory: true,
          reviews: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            // User info should be fetched from auth service in a real implementation
          },
        },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found',
          timestamp: new Date().toISOString(),
        });
      }

      // Cache product with enhanced strategy
      await cacheService.cacheProduct(id, product);

      res.json({
        success: true,
        data: { product },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch product',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      // Try to get cached categories
      const cachedCategories = await cacheService.getCachedCategories();
      if (cachedCategories) {
        return res.json({
          success: true,
          data: { categories: cachedCategories },
          cached: true,
          timestamp: new Date().toISOString(),
        });
      }

      const categories = await req._prisma.product.groupBy({
        by: ['category', 'subcategory'],
        where: { isActive: true },
        _count: {
          id: true,
        },
        orderBy: {
          category: 'asc',
        },
      });

      // Group by category
      const groupedCategories = categories.reduce((acc: any, item) => {
        if (!acc[item.category]) {
          acc[item.category] = {
            name: item.category,
            subcategories: [],
            totalProducts: 0,
          };
        }

        acc[item.category].subcategories.push({
          name: item.subcategory,
          productCount: item._count.id,
        });
        acc[item.category].totalProducts += item._count.id;

        return acc;
      }, {});

      const result = Object.values(groupedCategories);

      // Cache categories with enhanced strategy
      await cacheService.cacheCategories(result);

      res.json({
        success: true,
        data: {
          categories: result,
        },
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

  async getFeaturedProducts(req: Request, res: Response) {
    try {
      const { limit = 10 } = req.query;

      // Try to get cached featured products
      const cachedProducts = await cacheService.getCachedFeaturedProducts();
      if (cachedProducts) {
        // Filter by limit if cached result has more products
        const limitedProducts = cachedProducts.slice(0, Number(limit));
        return res.json({
          success: true,
          data: { products: limitedProducts },
          cached: true,
          timestamp: new Date().toISOString(),
        });
      }

      const products = await req._prisma.product.findMany({
        where: {
          isActive: true,
          // Featured products logic would be implemented differently
          // For now, just get active products with high ratings
          rating: {
            gte: 4.0,
          },
        },
        take: Number(limit),
        orderBy: {
          rating: 'desc',
        },
        include: {
          inventory: true,
        },
      });

      // Cache featured products with enhanced strategy
      await cacheService.cacheFeaturedProducts(products);

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
