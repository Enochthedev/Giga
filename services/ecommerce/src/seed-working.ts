import {
  DiscountType,
  PrismaClient,
  PromotionType,
} from './generated/prisma-client';

const prisma = new PrismaClient();

async function seedWorkingDatabase() {
  console.log('🌱 Seeding working ecommerce database...');

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
        address: '123 Tech Street, Silicon Valley, CA 94000',
        isActive: true,
        rating: 4.8,
        commissionRate: 0.15,
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
        address: '456 Style Avenue, New York, NY 10001',
        isActive: true,
        rating: 4.6,
        commissionRate: 0.12,
      },
    });

    console.log('✅ Vendors created');

    // 2. Create Products with variants
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
          'https://example.com/tshirt-black.jpg',
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
    const tshirtVariants = [
      {
        color: 'Blue',
        size: 'S',
        price: 29.99,
        sku: 'TSHIRT-BLUE-S',
        quantity: 50,
      },
      {
        color: 'Blue',
        size: 'M',
        price: 29.99,
        sku: 'TSHIRT-BLUE-M',
        quantity: 75,
      },
      {
        color: 'Blue',
        size: 'L',
        price: 29.99,
        sku: 'TSHIRT-BLUE-L',
        quantity: 60,
      },
      {
        color: 'Red',
        size: 'S',
        price: 29.99,
        sku: 'TSHIRT-RED-S',
        quantity: 40,
      },
      {
        color: 'Red',
        size: 'M',
        price: 29.99,
        sku: 'TSHIRT-RED-M',
        quantity: 65,
      },
      {
        color: 'Black',
        size: 'M',
        price: 32.99,
        sku: 'TSHIRT-BLACK-M',
        quantity: 45,
      },
    ];

    for (const variant of tshirtVariants) {
      const productVariant = await prisma.productVariant.create({
        data: {
          productId: tshirtProduct.id,
          name: `${tshirtProduct.name} - ${variant.color} ${variant.size}`,
          sku: variant.sku,
          price: variant.price,
          attributes: {
            color: variant.color,
            size: variant.size,
          },
        },
      });

      await prisma.productVariantInventory.create({
        data: {
          variantId: productVariant.id,
          quantity: variant.quantity,
          lowStockThreshold: 10,
        },
      });
    }

    console.log('✅ Product variants created');

    // 4. Create Shipping Zones
    const usZone = await prisma.shippingZone.create({
      data: {
        name: 'United States',
        countries: ['US'],
        states: ['CA', 'NY', 'TX', 'FL', 'IL'],
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

    const expressShipping = await prisma.shippingMethod.create({
      data: {
        name: 'Express Shipping',
        description: 'Delivery in 2-3 business days',
        baseRate: 15.99,
        estimatedDays: 2,
        isActive: true,
        zoneId: usZone.id,
      },
    });

    console.log('✅ Shipping methods created');

    // 6. Create Shipping Rates
    await prisma.shippingRate.createMany({
      data: [
        {
          methodId: standardShipping.id,
          minWeight: 0,
          maxWeight: 1,
          cost: 5.99,
        },
        {
          methodId: standardShipping.id,
          minWeight: 1,
          maxWeight: 5,
          cost: 9.99,
        },
        {
          methodId: expressShipping.id,
          minWeight: 0,
          maxWeight: 10,
          cost: 15.99,
        },
      ],
    });

    console.log('✅ Shipping rates created');

    // 7. Create Promotions
    await prisma.promotion.createMany({
      data: [
        {
          id: 'promo-welcome10',
          name: 'Welcome 10% Off',
          description: 'Get 10% off your first order',
          code: 'WELCOME10',
          type: PromotionType.COUPON_CODE,
          discountType: DiscountType.PERCENTAGE,
          discountValue: 10,
          minOrderValue: 50,
          usedCount: 0,
          isActive: true,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
        },
        {
          id: 'promo-save20',
          name: 'Save $20',
          description: 'Save $20 on orders over $100',
          code: 'SAVE20',
          type: PromotionType.COUPON_CODE,
          discountType: DiscountType.FIXED_AMOUNT,
          discountValue: 20,
          minOrderValue: 100,
          usedCount: 0,
          isActive: true,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-06-30'),
        },
      ],
    });

    console.log('✅ Promotions created');

    console.log('🎉 Working database seeded successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log('- 2 Vendors created');
    console.log('- 1 Product with variants created');
    console.log('- 6 Product variants created');
    console.log('- 1 Shipping zone created');
    console.log('- 2 Shipping methods created');
    console.log('- 3 Shipping rates created');
    console.log('- 2 Promotions created');
  } catch (error) {
    console.error('❌ Error seeding working database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedWorkingDatabase().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

export { seedWorkingDatabase };
