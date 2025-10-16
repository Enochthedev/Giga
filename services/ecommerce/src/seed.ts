import mockProducts from '../../../mock-data/ecommerce/products.json';
import { PrismaClient } from './generated/prisma-client';

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log('🌱 Seeding ecommerce database...');

  try {
    // Create categories first
    const categories = [
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
      },
      {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Clothing, shoes, and accessories',
      },
      {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home improvement and garden supplies',
      },
      {
        name: 'Sports',
        slug: 'sports',
        description: 'Sports equipment and fitness gear',
      },
    ];

    for (const category of categories) {
      await (prisma as any).category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category,
      });
    }

    console.log('✅ Categories created');

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
      {
        id: 'vendor_4',
        name: 'Sports World',
        email: 'vendor@sportsworld.com',
        phone: '+1234567893',
        description: 'Sports equipment and gear',
        isActive: true,
        isVerified: true,
        rating: 4.4,
        reviewCount: 127,
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

    // Create products from mock data
    for (const mockProduct of mockProducts) {
      // Map vendor ID to our created vendors or use default
      let vendorId = 'vendor_1'; // Default vendor

      // Map based on category to different vendors
      switch (mockProduct.category) {
        case 'electronics':
          vendorId = 'vendor_1';
          break;
        case 'fashion':
          vendorId = 'vendor_2';
          break;
        case 'home-garden':
          vendorId = 'vendor_3';
          break;
        case 'sports':
          vendorId = 'vendor_4';
          break;
        default:
          vendorId = 'vendor_1';
      }

      const product = await (prisma as any).product.upsert({
        where: { id: mockProduct.id },
        update: {},
        create: {
          id: mockProduct.id,
          name: mockProduct.name,
          description: mockProduct.description,
          price: mockProduct.price,
          comparePrice: mockProduct.comparePrice,
          sku: mockProduct.sku,
          category: mockProduct.category,
          subcategory: mockProduct.subcategory,
          brand: mockProduct.brand,
          images: mockProduct.images,
          specifications: mockProduct.specifications,
          vendorId: vendorId, // Use our mapped vendor ID
          isActive: mockProduct.isActive,
          rating: mockProduct.rating,
          reviewCount: mockProduct.reviewCount,
          inventory: {
            create: {
              quantity: mockProduct.inventory.quantity,
              lowStockThreshold: mockProduct.inventory.lowStockThreshold,
              trackQuantity: mockProduct.inventory.trackQuantity,
            },
          },
        },
      });

      console.log(`✅ Product created: ${product.name} (Vendor: ${vendorId})`);
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
