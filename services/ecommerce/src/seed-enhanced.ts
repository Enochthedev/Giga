import {
  DeliveryStatus,
  DiscountType,
  PrismaClient,
  PromotionType,
  ShippingType,
} from './generated/prisma-client';

const prisma = new PrismaClient();

async function seedEnhancedDatabase() {
  console.log('🌱 Seeding enhanced ecommerce database...');

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
        totalSales: 150000,
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
        totalSales: 89000,
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

    const laptopProduct = await prisma.product.upsert({
      where: { id: 'product-laptop-1' },
      update: {},
      create: {
        id: 'product-laptop-1',
        name: 'UltraBook Pro 15"',
        description:
          'High-performance laptop with latest processor and graphics',
        price: 1299.99,
        comparePrice: 1499.99,
        sku: 'LAPTOP-ULTRA-001',
        category: 'Electronics',
        subcategory: 'Laptops',
        brand: 'TechGear Pro',
        images: [
          'https://example.com/laptop-silver.jpg',
          'https://example.com/laptop-black.jpg',
        ],
        specifications: {
          processor: 'Intel i7-12700H',
          memory: '16GB DDR4',
          storage: '512GB SSD',
          display: '15.6" 4K IPS',
        },
        vendorId: vendor1.id,
        isActive: true,
        rating: 4.8,
        reviewCount: 89,
        hasVariants: true,
        weight: 2.1,
        dimensions: { length: 35, width: 24, height: 2 },
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
        color: 'Red',
        size: 'L',
        price: 29.99,
        sku: 'TSHIRT-RED-L',
        quantity: 55,
      },
      {
        color: 'Black',
        size: 'S',
        price: 32.99,
        sku: 'TSHIRT-BLACK-S',
        quantity: 30,
      },
      {
        color: 'Black',
        size: 'M',
        price: 32.99,
        sku: 'TSHIRT-BLACK-M',
        quantity: 45,
      },
      {
        color: 'Black',
        size: 'L',
        price: 32.99,
        sku: 'TSHIRT-BLACK-L',
        quantity: 35,
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

    const laptopVariants = [
      {
        storage: '512GB',
        color: 'Silver',
        price: 1299.99,
        sku: 'LAPTOP-512-SILVER',
        quantity: 15,
      },
      {
        storage: '512GB',
        color: 'Space Gray',
        price: 1299.99,
        sku: 'LAPTOP-512-GRAY',
        quantity: 12,
      },
      {
        storage: '1TB',
        color: 'Silver',
        price: 1499.99,
        sku: 'LAPTOP-1TB-SILVER',
        quantity: 8,
      },
      {
        storage: '1TB',
        color: 'Space Gray',
        price: 1499.99,
        sku: 'LAPTOP-1TB-GRAY',
        quantity: 10,
      },
    ];

    for (const variant of laptopVariants) {
      const productVariant = await prisma.productVariant.create({
        data: {
          productId: laptopProduct.id,
          name: `${laptopProduct.name} - ${variant.storage} ${variant.color}`,
          sku: variant.sku,
          price: variant.price,
          attributes: {
            storage: variant.storage,
            color: variant.color,
          },
        },
      });

      await prisma.productVariantInventory.create({
        data: {
          variantId: productVariant.id,
          quantity: variant.quantity,
          lowStockThreshold: 5,
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

    const intlZone = await prisma.shippingZone.create({
      data: {
        name: 'International',
        countries: ['CA', 'GB', 'AU', 'DE', 'FR'],
        states: [],
        isActive: true,
      },
    });

    console.log('✅ Shipping zones created');

    // 5. Create Shipping Methods
    const standardShipping = await prisma.shippingMethod.create({
      data: {
        name: 'Standard Shipping',
        description: 'Delivery in 5-7 business days',
        estimatedDays: 6,
        isActive: true,
        zoneId: usZone.id,
      },
    });

    const expressShipping = await prisma.shippingMethod.create({
      data: {
        name: 'Express Shipping',
        description: 'Delivery in 2-3 business days',
        estimatedDays: 2,
        isActive: true,
        zoneId: usZone.id,
      },
    });

    const intlShipping = await prisma.shippingMethod.create({
      data: {
        name: 'International Shipping',
        description: 'Delivery in 10-14 business days',
        estimatedDays: 12,
        isActive: true,
        zoneId: intlZone.id,
      },
    });

    console.log('✅ Shipping methods created');

    // 6. Create Shipping Rates
    await prisma.shippingRate.createMany({
      data: [
        // Standard shipping rates
        {
          methodId: standardShipping.id,
          type: ShippingType.WEIGHT_BASED,
          minWeight: 0,
          maxWeight: 1,
          cost: 5.99,
        },
        {
          methodId: standardShipping.id,
          type: ShippingType.WEIGHT_BASED,
          minWeight: 1,
          maxWeight: 5,
          cost: 9.99,
        },
        {
          methodId: standardShipping.id,
          type: ShippingType.VALUE_BASED,
          minOrderValue: 100,
          cost: 0, // Free shipping over $100
        },
        // Express shipping rates
        {
          methodId: expressShipping.id,
          type: ShippingType.FLAT_RATE,
          cost: 15.99,
        },
        // International shipping rates
        {
          methodId: intlShipping.id,
          type: ShippingType.WEIGHT_BASED,
          minWeight: 0,
          maxWeight: 2,
          cost: 25.99,
        },
        {
          methodId: intlShipping.id,
          type: ShippingType.WEIGHT_BASED,
          minWeight: 2,
          maxWeight: 10,
          cost: 45.99,
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
          maxUses: 1000,
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
          maxUses: 500,
          usedCount: 0,
          isActive: true,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-06-30'),
        },
        {
          id: 'promo-freeship',
          name: 'Free Shipping',
          description: 'Free shipping on all orders',
          code: 'FREESHIP',
          type: PromotionType.AUTOMATIC,
          discountType: DiscountType.FREE_SHIPPING,
          discountValue: 0,
          minOrderValue: 75,
          maxUses: null,
          usedCount: 0,
          isActive: true,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
        },
      ],
    });

    console.log('✅ Promotions created');

    // 8. Create sample orders with delivery tracking
    const sampleOrder = await prisma.order.create({
      data: {
        id: 'order-sample-1',
        customerId: 'customer-1',
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        subtotal: 89.97,
        shippingCost: 9.99,
        tax: 7.2,
        total: 107.16,
        shippingAddress: {
          name: 'John Doe',
          address: '123 Main St',
          city: 'San Francisco',
          country: 'US',
          phone: '+1-555-0123',
        },
        billingAddress: {
          name: 'John Doe',
          address: '123 Main St',
          city: 'San Francisco',
          country: 'US',
          phone: '+1-555-0123',
        },
        shippingMethodId: standardShipping.id,
        promotionId: 'promo-welcome10',
        discount: 8.99,
      },
    });

    // Create delivery tracking for the sample order
    const deliveryTracking = await prisma.deliveryTracking.create({
      data: {
        orderId: sampleOrder.id,
        trackingNumber: '1Z999AA1234567890',
        carrier: 'UPS',
        status: DeliveryStatus.IN_TRANSIT,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        currentLocation: 'Oakland, CA Distribution Center',
      },
    });

    // Add tracking events
    await prisma.trackingEvent.createMany({
      data: [
        {
          trackingId: deliveryTracking.id,
          status: DeliveryStatus.PENDING,
          location: 'San Francisco, CA',
          description: 'Order processed and ready for pickup',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        },
        {
          trackingId: deliveryTracking.id,
          status: DeliveryStatus.PICKED_UP,
          location: 'San Francisco, CA',
          description: 'Package picked up by carrier',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        },
        {
          trackingId: deliveryTracking.id,
          status: DeliveryStatus.IN_TRANSIT,
          location: 'Oakland, CA Distribution Center',
          description: 'Package in transit to destination',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        },
      ],
    });

    console.log('✅ Sample order and delivery tracking created');

    console.log('🎉 Enhanced database seeded successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log('- 2 Vendors created');
    console.log('- 2 Products with variants created');
    console.log('- 13 Product variants created');
    console.log('- 2 Shipping zones created');
    console.log('- 3 Shipping methods created');
    console.log('- 6 Shipping rates created');
    console.log('- 3 Promotions created');
    console.log('- 1 Sample order with delivery tracking created');
  } catch (error) {
    console.error('❌ Error seeding enhanced database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedEnhancedDatabase().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

export { seedEnhancedDatabase };
