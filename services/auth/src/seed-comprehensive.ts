import * as bcrypt from 'bcryptjs';
import { PrismaClient, RoleName } from './generated/prisma-client';

const prisma = new PrismaClient();

interface SeedUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roles: RoleName[];
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
}

const seedUsers: SeedUser[] = [
  // Admin Users
  {
    email: 'admin@platform.com',
    password: 'AdminPassword123!',
    firstName: 'Platform',
    lastName: 'Admin',
    phone: '+1234567890',
    roles: [RoleName.ADMIN],
    isEmailVerified: true,
    isPhoneVerified: true,
  },
  {
    email: 'superadmin@platform.com',
    password: 'SuperAdminPassword123!',
    firstName: 'Super',
    lastName: 'Admin',
    phone: '+1234567891',
    roles: [RoleName.ADMIN],
    isEmailVerified: true,
    isPhoneVerified: true,
  },

  // Customer Users
  {
    email: 'john.customer@example.com',
    password: 'CustomerPassword123!',
    firstName: 'John',
    lastName: 'Customer',
    phone: '+1234567892',
    roles: [RoleName.CUSTOMER],
    isEmailVerified: true,
    isPhoneVerified: true,
  },
  {
    email: 'jane.customer@example.com',
    password: 'CustomerPassword123!',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1234567893',
    roles: [RoleName.CUSTOMER],
    isEmailVerified: true,
    isPhoneVerified: false,
  },

  // Vendor Users
  {
    email: 'vendor1@example.com',
    password: 'VendorPassword123!',
    firstName: 'Mike',
    lastName: 'Vendor',
    phone: '+1234567895',
    roles: [RoleName.VENDOR, RoleName.CUSTOMER],
    isEmailVerified: true,
    isPhoneVerified: true,
  },

  // Driver Users
  {
    email: 'driver1@example.com',
    password: 'DriverPassword123!',
    firstName: 'Carlos',
    lastName: 'Driver',
    phone: '+1234567897',
    roles: [RoleName.DRIVER, RoleName.CUSTOMER],
    isEmailVerified: true,
    isPhoneVerified: true,
  },

  // Host Users
  {
    email: 'host1@example.com',
    password: 'HostPassword123!',
    firstName: 'David',
    lastName: 'Host',
    phone: '+1234567899',
    roles: [RoleName.HOST, RoleName.CUSTOMER],
    isEmailVerified: true,
    isPhoneVerified: true,
  },

  // Advertiser Users
  {
    email: 'advertiser1@example.com',
    password: 'AdvertiserPassword123!',
    firstName: 'Robert',
    lastName: 'Marketing',
    phone: '+1234567801',
    roles: [RoleName.ADVERTISER, RoleName.CUSTOMER],
    isEmailVerified: true,
    isPhoneVerified: true,
  },
];

async function createRoles() {
  console.log('Creating roles...');

  const roles = [
    { name: RoleName.CUSTOMER },
    { name: RoleName.VENDOR },
    { name: RoleName.DRIVER },
    { name: RoleName.HOST },
    { name: RoleName.ADVERTISER },
    { name: RoleName.ADMIN },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  console.log('✅ Roles created successfully');
}

async function createUsers() {
  console.log('Creating users...');

  for (const userData of seedUsers) {
    try {
      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          passwordHash,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          isEmailVerified: userData.isEmailVerified || false,
          isPhoneVerified: userData.isPhoneVerified || false,
          activeRole: userData.roles[0], // First role as active
        },
      });

      // Create user roles
      for (const roleName of userData.roles) {
        const role = await prisma.role.findUnique({
          where: { name: roleName },
        });

        if (role) {
          await prisma.userRole.create({
            data: {
              userId: user.id,
              roleId: role.id,
            },
          });
        }
      }

      // Create role-specific profiles
      await createProfilesForUser(user.id, userData.roles);

      console.log(`✅ Created user: ${userData.email}`);
    } catch (error) {
      console.error(`❌ Failed to create user ${userData.email}:`, error);
    }
  }
}

async function createProfilesForUser(userId: string, roles: RoleName[]) {
  for (const role of roles) {
    switch (role) {
      case RoleName.CUSTOMER:
        await createCustomerProfile(userId);
        break;
      case RoleName.VENDOR:
        await createVendorProfile(userId);
        break;
      case RoleName.DRIVER:
        await createDriverProfile(userId);
        break;
      case RoleName.HOST:
        await createHostProfile(userId);
        break;
      case RoleName.ADVERTISER:
        await createAdvertiserProfile(userId);
        break;
    }
  }
}

async function createCustomerProfile(userId: string) {
  const profile = await prisma.customerProfile.create({
    data: {
      userId: userId,
      preferences: {
        newsletter: true,
        notifications: true,
        theme: 'light',
        language: 'en',
      },
    },
  });

  // Create sample addresses
  const addresses = [
    {
      label: 'Home',
      name: 'John Doe',
      address: '123 Main Street',
      address2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '+1234567890',
      isDefault: true,
    },
    {
      label: 'Work',
      name: 'John Doe',
      address: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'USA',
      phone: '+1234567890',
      isDefault: false,
    },
  ];

  for (const address of addresses) {
    await prisma.address.create({
      data: {
        ...address,
        customerProfileId: profile.id,
      },
    });
  }
}

async function createVendorProfile(userId: string) {
  const businessNames = [
    'Tech Solutions Inc',
    'Green Garden Supply',
    'Fashion Forward',
    'Home Essentials',
    'Sports Gear Pro',
  ];

  await prisma.vendorProfile.create({
    data: {
      userId: userId,
      businessName:
        businessNames[Math.floor(Math.random() * businessNames.length)],
      businessType: 'RETAIL',
      description:
        'A quality business providing excellent products and services to our customers.',
      website: 'https://example-business.com',
    },
  });
}

async function createDriverProfile(userId: string) {
  const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan'];
  const models = ['Camry', 'Civic', 'Focus', 'Malibu', 'Altima'];
  const colors = ['White', 'Black', 'Silver', 'Blue', 'Red'];

  await prisma.driverProfile.create({
    data: {
      userId: userId,
      licenseNumber: `DL${Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0')}`,
      vehicleInfo: {
        make: makes[Math.floor(Math.random() * makes.length)],
        model: models[Math.floor(Math.random() * models.length)],
        year: 2015 + Math.floor(Math.random() * 9), // 2015-2023
        color: colors[Math.floor(Math.random() * colors.length)],
        licensePlate: `ABC${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, '0')}`,
      },
    },
  });
}

async function createHostProfile(userId: string) {
  const businessNames = [
    'Cozy Stays',
    'Urban Retreats',
    'Luxury Accommodations',
    'Budget Friendly Rooms',
    'Executive Suites',
  ];

  await prisma.hostProfile.create({
    data: {
      userId: userId,
      businessName:
        businessNames[Math.floor(Math.random() * businessNames.length)],
      description:
        'Providing comfortable and clean accommodations for travelers.',
    },
  });
}

async function createAdvertiserProfile(userId: string) {
  const companies = [
    'Digital Marketing Pro',
    'Brand Boost Agency',
    'Creative Campaigns',
    'Performance Ads Co',
    'Social Media Masters',
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Retail',
    'Entertainment',
    'Education',
  ];

  await prisma.advertiserProfile.create({
    data: {
      userId: userId,
      companyName: companies[Math.floor(Math.random() * companies.length)],
      industry: industries[Math.floor(Math.random() * industries.length)],
      website: 'https://example-agency.com',
    },
  });
}

async function createSampleTokens() {
  console.log('Creating sample tokens and verification data...');

  const users = await prisma.user.findMany({
    take: 5,
    where: {
      isEmailVerified: false,
    },
  });

  for (const user of users) {
    // Create email verification token
    await prisma.emailVerificationToken.create({
      data: {
        token: Math.random().toString(36).substring(2, 15),
        userId: user.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Create phone verification code
    if (user.phone) {
      await prisma.phoneVerificationCode.create({
        data: {
          code: Math.floor(100000 + Math.random() * 900000).toString(), // 6-digit code
          userId: user.id,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        },
      });
    }
  }

  console.log('✅ Sample tokens created');
}

async function createSampleAuditLogs() {
  console.log('Creating sample audit logs...');

  const adminUsers = await prisma.user.findMany({
    where: {
      roles: {
        some: {
          role: {
            name: RoleName.ADMIN,
          },
        },
      },
    },
  });

  const regularUsers = await prisma.user.findMany({
    where: {
      roles: {
        none: {
          role: {
            name: RoleName.ADMIN,
          },
        },
      },
    },
    take: 10,
  });

  if (adminUsers.length > 0 && regularUsers.length > 0) {
    const actions = [
      'VIEW_USER',
      'UPDATE_USER_STATUS',
      'ASSIGN_ROLE',
      'REMOVE_ROLE',
      'VERIFY_PROFILE',
      'UPDATE_PROFILE_RATING',
    ];

    for (let i = 0; i < 20; i++) {
      await prisma.auditLog.create({
        data: {
          action: actions[Math.floor(Math.random() * actions.length)],
          adminUserId:
            adminUsers[Math.floor(Math.random() * adminUsers.length)].id,
          targetUserId:
            regularUsers[Math.floor(Math.random() * regularUsers.length)].id,
          details: {
            timestamp: new Date().toISOString(),
            changes: {
              field: 'status',
              oldValue: 'active',
              newValue: 'inactive',
            },
          },
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0 (Admin Dashboard)',
        },
      });
    }
  }

  console.log('✅ Sample audit logs created');
}

async function main() {
  try {
    console.log('🌱 Starting comprehensive database seeding...');

    // Clean existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Cleaning existing data...');
    await prisma.auditLog.deleteMany();
    await prisma.phoneVerificationCode.deleteMany();
    await prisma.emailVerificationToken.deleteMany();
    await prisma.passwordResetToken.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.address.deleteMany();
    await prisma.advertiserProfile.deleteMany();
    await prisma.hostProfile.deleteMany();
    await prisma.driverProfile.deleteMany();
    await prisma.vendorProfile.deleteMany();
    await prisma.customerProfile.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();

    // Create fresh data
    await createRoles();
    await createUsers();
    await createSampleTokens();
    await createSampleAuditLogs();

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');

    const userCount = await prisma.user.count();
    const customerCount = await prisma.customerProfile.count();
    const vendorCount = await prisma.vendorProfile.count();
    const driverCount = await prisma.driverProfile.count();
    const hostCount = await prisma.hostProfile.count();
    const advertiserCount = await prisma.advertiserProfile.count();
    const addressCount = await prisma.address.count();
    const auditLogCount = await prisma.auditLog.count();

    console.log(`👥 Users: ${userCount}`);
    console.log(`🛒 Customers: ${customerCount}`);
    console.log(`🏪 Vendors: ${vendorCount}`);
    console.log(`🚗 Drivers: ${driverCount}`);
    console.log(`🏠 Hosts: ${hostCount}`);
    console.log(`📢 Advertisers: ${advertiserCount}`);
    console.log(`📍 Addresses: ${addressCount}`);
    console.log(`📋 Audit Logs: ${auditLogCount}`);

    console.log('\n🔑 Test Accounts:');
    console.log('Admin: admin@platform.com / AdminPassword123!');
    console.log('Customer: john.customer@example.com / CustomerPassword123!');
    console.log('Vendor: vendor1@example.com / VendorPassword123!');
    console.log('Driver: driver1@example.com / DriverPassword123!');
    console.log('Host: host1@example.com / HostPassword123!');
    console.log('Advertiser: advertiser1@example.com / AdvertiserPassword123!');
    console.log('Multi-role: multirole@example.com / MultiRolePassword123!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
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
