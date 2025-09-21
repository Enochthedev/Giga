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

    // Create products from mock data
    for (const mockProduct of mockProducts) {
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
          vendorId: mockProduct.vendorId,
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

if (require.main === module) {
  seedDatabase().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

export { seedDatabase };
