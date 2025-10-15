import { PrismaClient } from './generated/prisma-client';

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log('🌱 Seeding ecommerce database...');

  try {
    // Create vendors first (required for products)
    const vendors = [
      {
        id: 'vendor_1',
        name: 'TechCorp Electronics',
        email: 'vendor@techcorp.com',
        phone: '+1234567890',
        description: 'Leading electronics vendor',
        isActive: true,
        isVerified: true,
        rating: 4.5,
        reviewCount: 150,
      },
      {
        id: 'vendor_2',
        name: 'Fashion Forward',
        email: 'vendor@fashionforward.com',
        phone: '+1234567891',
        description: 'Premium fashion retailer',
        isActive: true,
        isVerified: true,
        rating: 4.3,
        reviewCount: 89,
      },
      {
        id: 'vendor_3',
        name: 'Home & Garden Plus',
        email: 'vendor@homegardenplus.com',
        phone: '+1234567892',
        description: 'Home improvement specialists',
        isActive: true,
        isVerified: true,
        rating: 4.7,
        reviewCount: 203,
      },
    ];

    for (const vendor of vendors) {
      await (prisma as any).vendor.upsert({
        where: { id: vendor.id },
        update: {},
        create: vendor,
      });
    }

    console.log('✅ Vendors created');

    // Create sample products
    const products = [
      {
        id: 'product_1',
        name: 'iPhone 15 Pro',
        description: 'The latest iPhone with advanced camera system',
        price: 999.99,
        comparePrice: 1099.99,
        sku: 'IPH15PRO-128',
        category: 'electronics',
        subcategory: 'smartphones',
        brand: 'Apple',
        images: [
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
        ],
        specifications: {
          storage: '128GB',
          color: 'Blue Titanium',
          warranty: '1 year',
        },
        vendorId: 'vendor_1',
        isActive: true,
        rating: 4.8,
        reviewCount: 1247,
        inventory: {
          quantity: 50,
          lowStockThreshold: 5,
          trackQuantity: true,
        },
      },
      {
        id: 'product_2',
        name: 'Nike Air Max 270',
        description: 'Comfortable running shoes with Air Max technology',
        price: 149.99,
        comparePrice: null,
        sku: 'NIKE-AM270-BLK',
        category: 'fashion',
        subcategory: 'shoes',
        brand: 'Nike',
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        ],
        specifications: {
          size: 'US 10',
          color: 'Black',
          material: 'Synthetic',
        },
        vendorId: 'vendor_2',
        isActive: true,
        rating: 4.5,
        reviewCount: 892,
        inventory: {
          quantity: 25,
          lowStockThreshold: 3,
          trackQuantity: true,
        },
      },
      {
        id: 'product_3',
        name: 'Garden Tool Set',
        description:
          'Complete 10-piece garden tool set for all your gardening needs',
        price: 79.99,
        comparePrice: 99.99,
        sku: 'GTS-10PC-SET',
        category: 'home-garden',
        subcategory: 'tools',
        brand: 'GreenThumb',
        images: [
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500',
        ],
        specifications: {
          pieces: '10',
          material: 'Stainless Steel',
          warranty: '2 years',
        },
        vendorId: 'vendor_3',
        isActive: true,
        rating: 4.6,
        reviewCount: 234,
        inventory: {
          quantity: 15,
          lowStockThreshold: 2,
          trackQuantity: true,
        },
      },
    ];

    for (const productData of products) {
      const product = await (prisma as any).product.upsert({
        where: { id: productData.id },
        update: {},
        create: {
          id: productData.id,
          name: productData.name,
          description: productData.description,
          price: productData.price,
          comparePrice: productData.comparePrice,
          sku: productData.sku,
          category: productData.category,
          subcategory: productData.subcategory,
          brand: productData.brand,
          images: productData.images,
          specifications: productData.specifications,
          vendorId: productData.vendorId,
          isActive: productData.isActive,
          rating: productData.rating,
          reviewCount: productData.reviewCount,
          inventory: {
            create: {
              quantity: productData.inventory.quantity,
              lowStockThreshold: productData.inventory.lowStockThreshold,
              trackQuantity: productData.inventory.trackQuantity,
            },
          },
        },
      });

      console.log(`✅ Product created: ${product.name}`);
    }

    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Start seeding if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

export { seedDatabase };
