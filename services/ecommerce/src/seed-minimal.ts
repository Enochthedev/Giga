import {
  DiscountType,
  PrismaClient,
  PromotionType,
} from './generated/prisma-client';

const prisma = new PrismaClient();

async function seedMinimalDatabase() {
  console.log('🌱 Seeding minimal ecommerce database...');

  try {
    // 1. Create Vendors
    const vendor1 = await prisma.vendor.upsert({
      where: { id: 'vendor-1' },
      update: {},
      create: {
        id: 'vendor-1',
        name: 'TechGear Pro',
        email: 'contact@techgearpro.com',
        phone: '+1-555-0101',
        address: {
          street: '123 Tech Street',
          city: 'Silicon Valley',
          state: 'CA',
          zipCode: '94000',
        },
        description: 'Premium technology products',
        isActive: true,
        rating: 4.8,
        reviewCount: 150,
      },
    });

    const vendor2 = await prisma.vendor.upsert({
      where: { id: 'vendor-2' },
      update: {},
      create: {
        id: 'vendor-2',
        name: 'Fashion Forward',
        email: 'hello@fashionforward.com',
        phone: '+1-555-0102',
        address: {
          street: '456 Style Avenue',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
        },
        description: 'Trendy fashion and accessories',
        isActive: true,
        rating: 4.6,
        reviewCount: 89,
      },
    });

    console.log('✅ Vendors created');

    // 2. Create Products
    const tshirtProduct = await prisma.product.upsert({
      where: { id: 'product-tshirt-1' },
      update: {},
      create: {
        id: 'product-tshirt-1',
        name: 'Premium Cotton T-Shirt',
        description:
          'High-quality 100% cotton t-shirt available in multiple colors and sizes',
        price: 29.99,
        comparePrice: 39.99,
        sku: 'TSHIRT-PREMIUM-001',
        category: 'Fashion',
        subcategory: 'T-Shirts',
        brand: 'Fashion Forward',
        images: [
          'https://example.com/tshirt-blue.jpg',
          'https://example.com/tshirt-red.jpg',
        ],
        specifications: {
          material: '100% Cotton',
          care: 'Machine wash cold',
          origin: 'Made in USA',
        },
        vendorId: vendor2.id,
        isActive: true,
        rating: 4.5,
        reviewCount: 127,
        hasVariants: true,
        weight: 0.2,
        dimensions: { length: 25, width: 20, height: 1 },
      },
    });

    console.log('✅ Products created');

    // 3. Create Product Variants
    const blueShirtVariant = await prisma.productVariant.create({
      data: {
        productId: tshirtProduct.id,
        name: 'Premium Cotton T-Shirt - Blue M',
        sku: 'TSHIRT-BLUE-M',
        price: 29.99,
        attributes: {
          color: 'Blue',
          size: 'M',
        },
      },
    });

    await prisma.productVariantInventory.create({
      data: {
        variantId: blueShirtVariant.id,
        quantity: 75,
        lowStockThreshold: 10,
      },
    });

    const redShirtVariant = await prisma.productVariant.create({
      data: {
        productId: tshirtProduct.id,
        name: 'Premium Cotton T-Shirt - Red L',
        sku: 'TSHIRT-RED-L',
        price: 29.99,
        attributes: {
          color: 'Red',
          size: 'L',
        },
      },
    });

    await prisma.productVariantInventory.create({
      data: {
        variantId: redShirtVariant.id,
        quantity: 60,
        lowStockThreshold: 10,
      },
    });

    console.log('✅ Product variants created');

    // 4. Create Shipping Zone
    const usZone = await prisma.shippingZone.create({
      data: {
        name: 'United States',
        countries: ['US'],
        states: ['CA', 'NY', 'TX', 'FL'],
        isActive: true,
      },
    });

    console.log('✅ Shipping zones created');

    // 5. Create Shipping Methods
    const standardShipping = await prisma.shippingMethod.create({
      data: {
        name: 'Standard Shipping',
        description: 'Delivery in 5-7 business days',
        baseRate: 5.99,
        estimatedDays: 6,
        isActive: true,
        zoneId: usZone.id,
      },
    });

    console.log('✅ Shipping methods created');

    // 6. Create Promotions
    await prisma.promotion.create({
      data: {
        id: 'promo-welcome10',
        name: 'Welcome 10% Off',
        description: 'Get 10% off your first order',
        code: 'WELCOME10',
        type: PromotionType.COUPON_CODE,
        discountType: DiscountType.PERCENTAGE,
        discountValue: 10,
        minOrderValue: 50,
        usageCount: 0,
        isActive: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
      },
    });

    console.log('✅ Promotions created');

    console.log('🎉 Minimal database seeded successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log('- 2 Vendors created');
    console.log('- 1 Product with variants created');
    console.log('- 2 Product variants created');
    console.log('- 1 Shipping zone created');
    console.log('- 1 Shipping method created');
    console.log('- 1 Promotion created');
  } catch (error) {
    console.error('❌ Error seeding minimal database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedMinimalDatabase().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

export { seedMinimalDatabase };
