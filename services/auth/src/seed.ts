import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding auth database...');

  // Create roles
  const roles = ['CUSTOMER', 'VENDOR', 'DRIVER', 'HOST', 'ADVERTISER', 'ADMIN'];

  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName as any },
      update: {},
      create: { name: roleName as any },
    });
    console.log(`✓ Role ${roleName} created/updated`);
  }

  // Create basic permissions
  const permissions = [
    'read:profile',
    'write:profile',
    'read:orders',
    'write:orders',
    'read:products',
    'write:products',
    'admin:users',
    'admin:system',
  ];

  for (const permissionName of permissions) {
    await prisma.permission.upsert({
      where: { name: permissionName },
      update: {},
      create: {
        name: permissionName,
        description: `Permission to ${permissionName.replace(':', ' ')}`,
      },
    });
    console.log(`✓ Permission ${permissionName} created/updated`);
  }

  console.log('✅ Auth database seeded successfully!');
}

main()
  .catch(e => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
