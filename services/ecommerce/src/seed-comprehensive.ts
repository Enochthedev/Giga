import {
  OrderStatus,
  PaymentStatus,
  PrismaClient,
} from './generated/prisma-client';

const prisma = new PrismaClient();

// Sample product data
const sampleProducts = [
  // Electronics
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced camera system and A17 Pro chip',
    price: 999.99,
    category: 'Electronics',
    vendorId: 'vendor1-id', // Will be replaced with actual vendor ID
    isActive: true,
    images: ['https://example.com/iphone15pro.jpg'],
    specifications: {
      brand: 'Apple',
      model: 'iPhone 15 Pro',
      storage: '128GB',
      color: 'Natural Titanium',
      warranty: '1 year',
    },
    quantity: 50,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description:
      'Premium Android smartphone with S Pen and advanced AI features',
    price: 1199.99,
    category: 'Electronics',
    vendorId: 'vendor1-id',
    isActive: true,
    images: ['https://example.com/galaxys24ultra.jpg'],
    specifications: {
      brand: 'Samsung',
      model: 'Galaxy S24 Ultra',
      storage: '256GB',
      color: 'Titanium Black',
      warranty: '1 year',
    },
    quantity: 30,
  },
  {
    name: 'MacBook Air M3',
    description: '13-inch laptop with M3 chip, perfect for everyday computing',
    price: 1099.99,
    category: 'Electronics',
    vendorId: 'vendor2-id',
    isActive: true,
    images: ['https://example.com/macbookair.jpg'],
    specifications: {
      brand: 'Apple',
      model: 'MacBook Air',
      processor: 'M3',
      memory: '8GB',
      storage: '256GB SSD',
      screen: '13.6-inch Liquid Retina',
    },
    quantity: 25,
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling wireless headphones',
    price: 399.99,
    category: 'Electronics',
    vendorId: 'vendor1-id',
    isActive: true,
    images: ['https://example.com/sonywh1000xm5.jpg'],
    specifications: {
      brand: 'Sony',
      model: 'WH-1000XM5',
      type: 'Over-ear',
      connectivity: 'Bluetooth 5.2',
      batteryLife: '30 hours',
      noiseCanceling: true,
    },
    quantity: 75,
  },

  // Fashion
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Max Air cushioning',
    price: 150.0,
    category: 'Fashion',
    vendorId: 'vendor3-id',
    isActive: true,
    images: ['https://example.com/nikeairmax270.jpg'],
    specifications: {
      brand: 'Nike',
      model: 'Air Max 270',
      size: '10',
      color: 'Black/White',
      material: 'Mesh and synthetic',
    },
    quantity: 100,
  },
  {
    name: "Levi's 501 Original Jeans",
    description: 'Classic straight-leg jeans, the original blue jean',
    price: 89.99,
    category: 'Fashion',
    vendorId: 'vendor3-id',
    isActive: true,
    images: ['https://example.com/levis501.jpg'],
    specifications: {
      brand: "Levi's",
      model: '501 Original',
      size: '32x32',
      color: 'Medium Stonewash',
      material: '100% Cotton',
    },
    quantity: 80,
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'High-performance running shoes with Boost midsole',
    price: 180.0,
    category: 'Fashion',
    vendorId: 'vendor4-id',
    isActive: true,
    images: ['https://example.com/adidasultraboost.jpg'],
    specifications: {
      brand: 'Adidas',
      model: 'Ultraboost 22',
      size: '9.5',
      color: 'Core Black',
      technology: 'Boost midsole',
    },
    quantity: 60,
  },

  // Home & Garden
  {
    name: 'Dyson V15 Detect Vacuum',
    description: 'Cordless vacuum with laser dust detection',
    price: 749.99,
    category: 'Home & Garden',
    vendorId: 'vendor2-id',
    isActive: true,
    images: ['https://example.com/dysonv15.jpg'],
    specifications: {
      brand: 'Dyson',
      model: 'V15 Detect',
      type: 'Cordless stick vacuum',
      runtime: '60 minutes',
      features: ['Laser dust detection', 'LCD screen'],
    },
    quantity: 40,
  },
  {
    name: 'KitchenAid Stand Mixer',
    description: 'Professional 5-quart stand mixer for baking enthusiasts',
    price: 449.99,
    category: 'Home & Garden',
    vendorId: 'vendor5-id',
    isActive: true,
    images: ['https://example.com/kitchenaidmixer.jpg'],
    specifications: {
      brand: 'KitchenAid',
      model: 'Artisan Series',
      capacity: '5 quart',
      color: 'Empire Red',
      attachments: ['Dough hook', 'Wire whip', 'Flat beater'],
    },
    quantity: 35,
  },

  // Sports & Recreation
  {
    name: 'Peloton Bike+',
    description: 'Premium indoor cycling bike with rotating HD touchscreen',
    price: 2495.0,
    category: 'Sports & Recreation',
    vendorId: 'vendor4-id',
    isActive: true,
    images: ['https://example.com/pelotonbike.jpg'],
    specifications: {
      brand: 'Peloton',
      model: 'Bike+',
      screen: '23.8" HD touchscreen',
      resistance: 'Magnetic',
      connectivity: 'Wi-Fi, Bluetooth',
    },
    quantity: 15,
  },
  {
    name: 'Yeti Rambler Tumbler',
    description: '20oz insulated tumbler that keeps drinks hot or cold',
    price: 34.99,
    category: 'Sports & Recreation',
    vendorId: 'vendor5-id',
    isActive: true,
    images: ['https://example.com/yetirambler.jpg'],
    specifications: {
      brand: 'Yeti',
      model: 'Rambler',
      capacity: '20oz',
      material: 'Stainless steel',
      insulation: 'Double-wall vacuum',
    },
    quantity: 200,
  },

  // Books & Media
  {
    name: 'The Psychology of Money',
    description:
      'Timeless lessons on wealth, greed, and happiness by Morgan Housel',
    price: 16.99,
    category: 'Books & Media',
    vendorId: 'vendor6-id',
    isActive: true,
    images: ['https://example.com/psychologyofmoney.jpg'],
    specifications: {
      author: 'Morgan Housel',
      publisher: 'Harriman House',
      pages: 256,
      format: 'Paperback',
      isbn: '9780857197689',
    },
    quantity: 150,
  },
  {
    name: 'AirPods Pro (2nd Generation)',
    description:
      'Active noise cancellation wireless earbuds with spatial audio',
    price: 249.99,
    category: 'Electronics',
    vendorId: 'vendor1-id',
    isActive: true,
    images: ['https://example.com/airpodspro2.jpg'],
    specifications: {
      brand: 'Apple',
      model: 'AirPods Pro (2nd Gen)',
      features: [
        'Active Noise Cancellation',
        'Spatial Audio',
        'Transparency Mode',
      ],
      batteryLife: '6 hours (with ANC)',
      case: 'MagSafe charging case',
    },
    quantity: 90,
  },

  // Beauty & Personal Care
  {
    name: 'Olaplex Hair Perfector No. 3',
    description: 'At-home hair treatment to strengthen and repair damaged hair',
    price: 28.0,
    category: 'Beauty & Personal Care',
    vendorId: 'vendor7-id',
    isActive: true,
    images: ['https://example.com/olaplex3.jpg'],
    specifications: {
      brand: 'Olaplex',
      product: 'Hair Perfector No. 3',
      size: '3.3 fl oz',
      type: 'Hair treatment',
      suitableFor: 'All hair types',
    },
    quantity: 120,
  },
  {
    name: 'The Ordinary Niacinamide 10% + Zinc 1%',
    description: 'Serum to reduce appearance of blemishes and congestion',
    price: 7.9,
    category: 'Beauty & Personal Care',
    vendorId: 'vendor7-id',
    isActive: true,
    images: ['https://example.com/theordinaryniacinamide.jpg'],
    specifications: {
      brand: 'The Ordinary',
      product: 'Niacinamide 10% + Zinc 1%',
      size: '30ml',
      type: 'Serum',
      skinType: 'All skin types',
    },
    quantity: 180,
  },
];

// Sample vendor data (these should match auth service vendor IDs)
const sampleVendors = [
  { id: 'vendor1-id', name: 'Tech Solutions Inc', category: 'Electronics' },
  { id: 'vendor2-id', name: 'Premium Electronics', category: 'Electronics' },
  { id: 'vendor3-id', name: 'Fashion Forward', category: 'Fashion' },
  {
    id: 'vendor4-id',
    name: 'Sports Gear Pro',
    category: 'Sports & Recreation',
  },
  { id: 'vendor5-id', name: 'Home Essentials', category: 'Home & Garden' },
  { id: 'vendor6-id', name: 'Book Haven', category: 'Books & Media' },
  {
    id: 'vendor7-id',
    name: 'Beauty Boutique',
    category: 'Beauty & Personal Care',
  },
];

async function createProducts() {
  console.log('Creating products...');

  // First, create vendors in the database and get their actual IDs
  const vendorMapping: { [key: string]: string } = {};

  for (const vendorData of sampleVendors) {
    try {
      // Create vendor in database (simplified - in real scenario this would be in auth service)
      const vendor = await prisma.vendor.create({
        data: {
          id: vendorData.id,
          name: vendorData.name,
          email: `${vendorData.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
          phone: '+1234567890',
          address: {
            street: '123 Business St',
            city: 'City',
            state: 'State',
            zipCode: '12345',
            country: 'USA',
          },
          description: `${vendorData.name} - ${vendorData.category} specialist`,
          isActive: true,
          isVerified: true,
        },
      });
      vendorMapping[vendorData.id] = vendor.id;
      console.log(`✅ Created vendor: ${vendor.name}`);
    } catch (error) {
      console.log(
        `⚠️  Vendor ${vendorData.name} might already exist, using existing ID`
      );
      vendorMapping[vendorData.id] = vendorData.id;
    }
  }

  for (const productData of sampleProducts) {
    try {
      const actualVendorId =
        vendorMapping[productData.vendorId] || 'default-vendor-id';

      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category: productData.category,
          vendorId: actualVendorId,
          isActive: productData.isActive,
          images: productData.images,
          specifications: productData.specifications,
          inventory: {
            create: {
              quantity: productData.quantity,
              trackQuantity: true,
              lowStockThreshold: Math.max(
                5,
                Math.floor(productData.quantity * 0.1)
              ),
            },
          },
        },
        include: {
          inventory: true,
        },
      });

      console.log(`✅ Created product: ${product.name}`);
    } catch (error) {
      console.error(`❌ Failed to create product ${productData.name}:`, error);
    }
  }
}

async function createSampleOrders() {
  console.log('Creating sample orders...');

  const products = await prisma.product.findMany({
    include: { inventory: true },
    take: 10,
  });

  if (products.length === 0) {
    console.log('No products found, skipping order creation');
    return;
  }

  // Sample customer IDs (these should match auth service customer IDs)
  const customerIds = [
    'customer-1-sample',
    'customer-2-sample',
    'customer-3-sample',
    'customer-4-sample',
    'customer-5-sample',
  ];

  const orderStatuses = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
  ];

  const paymentStatuses = [
    PaymentStatus.PENDING,
    PaymentStatus.PAID,
    PaymentStatus.FAILED,
    PaymentStatus.REFUNDED,
  ];

  for (let i = 0; i < 25; i++) {
    try {
      const customerId =
        customerIds[Math.floor(Math.random() * customerIds.length)];
      const orderStatus =
        orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const paymentStatus =
        paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];

      // Select 1-4 random products for this order
      const numItems = Math.floor(Math.random() * 4) + 1;
      const selectedProducts = products
        .sort(() => 0.5 - Math.random())
        .slice(0, numItems);

      let subtotal = 0;
      const orderItems = [];

      for (const product of selectedProducts) {
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 items
        const itemTotal = product.price * quantity;
        subtotal += itemTotal;

        orderItems.push({
          productId: product.id,
          quantity,
          price: product.price,
          total: itemTotal,
        });
      }

      const tax = subtotal * 0.08; // 8% tax
      const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
      const total = subtotal + tax + shipping;

      const order = await prisma.order.create({
        data: {
          customerId,
          status: orderStatus,
          subtotal,
          tax,
          shipping,
          total,
          paymentMethod: 'card_' + Math.random().toString(36).substring(7),
          paymentStatus,
          shippingAddress: {
            name: 'John Doe',
            address: `${Math.floor(Math.random() * 9999)} Sample Street`,
            city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][
              Math.floor(Math.random() * 5)
            ],
            state: ['NY', 'CA', 'IL', 'TX', 'AZ'][
              Math.floor(Math.random() * 5)
            ],
            zipCode: Math.floor(Math.random() * 90000 + 10000).toString(),
            country: 'US',
          },
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
        },
      });

      // Create vendor orders for each vendor involved
      const vendorGroups = selectedProducts.reduce(
        (groups, product) => {
          if (!groups[product.vendorId]) {
            groups[product.vendorId] = [];
          }
          groups[product.vendorId].push(product);
          return groups;
        },
        {} as { [vendorId: string]: typeof selectedProducts }
      );

      for (const [vendorId, vendorProducts] of Object.entries(vendorGroups)) {
        const vendorItems = orderItems.filter(item =>
          vendorProducts.some(p => p.id === item.productId)
        );
        const vendorSubtotal = vendorItems.reduce(
          (sum, item) => sum + item.total,
          0
        );

        await prisma.vendorOrder.create({
          data: {
            orderId: order.id,
            vendorId,
            status: orderStatus,
            subtotal: vendorSubtotal,
            shipping: 0, // Add required fields
            total: vendorSubtotal,
          },
        });
      }

      console.log(
        `✅ Created order: ${order.id} (${orderItems.length} items, $${total.toFixed(2)})`
      );
    } catch (error) {
      console.error(`❌ Failed to create order ${i + 1}:`, error);
    }
  }
}

async function createInventoryReservations() {
  console.log('Creating sample inventory reservations...');

  const products = await prisma.product.findMany({
    include: { inventory: true },
    take: 5,
  });

  const customerIds = [
    'customer-1-sample',
    'customer-2-sample',
    'customer-3-sample',
  ];

  for (const product of products) {
    if (product.inventory && Math.random() > 0.5) {
      // 50% chance to create reservation
      try {
        const customerId =
          customerIds[Math.floor(Math.random() * customerIds.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

        await prisma.inventoryReservation.create({
          data: {
            productId: product.id,
            customerId,
            quantity,
            expiresAt,
          },
        });

        console.log(
          `✅ Created inventory reservation for product: ${product.name}`
        );
      } catch (error) {
        console.error(
          `❌ Failed to create reservation for ${product.name}:`,
          error
        );
      }
    }
  }
}

async function updateProductStats() {
  console.log('Updating product statistics...');

  const products = await prisma.product.findMany({
    include: {
      orderItems: {
        include: {
          order: true,
        },
      },
    },
  });

  for (const product of products) {
    try {
      // Calculate total sold and revenue
      const completedOrders = product.orderItems.filter(
        item => item.order && item.order.status === OrderStatus.DELIVERED
      );

      const totalSold = completedOrders.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      // Calculate total revenue for analytics (not used in current schema)
      // const totalRevenue = completedOrders.reduce((sum, item) => sum + item.total, 0);

      // Generate random rating and review count
      const rating = 3.5 + Math.random() * 1.5; // 3.5-5.0
      const reviewCount = Math.floor(Math.random() * 100);

      await prisma.product.update({
        where: { id: product.id },
        data: {
          rating,
          reviewCount,
          // Note: totalSold and totalRevenue would need to be added to the schema
          // totalSold,
        },
      });

      console.log(`✅ Updated stats for product: ${product.name}`);
    } catch (error) {
      console.error(`❌ Failed to update stats for ${product.name}:`, error);
    }
  }
}

async function main() {
  try {
    console.log('🌱 Starting comprehensive ecommerce database seeding...');

    // Clean existing data (optional)
    console.log('🧹 Cleaning existing data...');
    await prisma.inventoryReservation.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.vendorOrder.deleteMany();
    await prisma.order.deleteMany();
    await prisma.productInventory.deleteMany();
    await prisma.product.deleteMany();

    // Create fresh data
    await createProducts();
    await createSampleOrders();
    await createInventoryReservations();
    await updateProductStats();

    console.log('🎉 Ecommerce database seeding completed successfully!');
    console.log('\n📊 Summary:');

    const productCount = await prisma.product.count();
    const orderCount = await prisma.order.count();
    const vendorOrderCount = await prisma.vendorOrder.count();
    const inventoryCount = await prisma.productInventory.count();
    const reservationCount = await prisma.inventoryReservation.count();

    console.log(`📦 Products: ${productCount}`);
    console.log(`🛒 Orders: ${orderCount}`);
    console.log(`🏪 Vendor Orders: ${vendorOrderCount}`);
    console.log(`📊 Inventory Records: ${inventoryCount}`);
    console.log(`⏰ Active Reservations: ${reservationCount}`);

    // Show sample data
    console.log('\n🔍 Sample Products:');
    const sampleProductsList = await prisma.product.findMany({
      take: 5,
      include: { inventory: true },
    });

    sampleProductsList.forEach(product => {
      console.log(
        `  • ${product.name} - $${product.price} (${product.inventory?.quantity || 0} in stock)`
      );
    });

    console.log('\n📋 Sample Orders:');
    const sampleOrdersList = await prisma.order.findMany({
      take: 5,
      include: { items: true },
    });

    sampleOrdersList.forEach(order => {
      console.log(
        `  • Order ${order.id.substring(0, 8)}... - ${order.status} - $${order.total.toFixed(2)} (${order.items.length} items)`
      );
    });
  } catch (error) {
    console.error('❌ Ecommerce seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
if (require.main === module) {
  main().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

export default main;
