/**
 * Temporary mock for Prisma models that don't exist yet
 * This will be replaced once prisma generate is run
 */

export const createMockPrismaExtension = (prisma: any) => {
  // Add mock methods for new models
  if (!prisma.chain) {
    prisma.chain = {
      create: async () => {
        throw new Error('Chain model not generated. Run prisma generate.');
      },
      findUnique: async () => {
        throw new Error('Chain model not generated. Run prisma generate.');
      },
      findMany: async () => {
        throw new Error('Chain model not generated. Run prisma generate.');
      },
      findFirst: async () => {
        throw new Error('Chain model not generated. Run prisma generate.');
      },
      update: async () => {
        throw new Error('Chain model not generated. Run prisma generate.');
      },
      count: async () => {
        throw new Error('Chain model not generated. Run prisma generate.');
      },
    };
  }

  if (!prisma.brand) {
    prisma.brand = {
      create: async () => {
        throw new Error('Brand model not generated. Run prisma generate.');
      },
      findUnique: async () => {
        throw new Error('Brand model not generated. Run prisma generate.');
      },
      findMany: async () => {
        throw new Error('Brand model not generated. Run prisma generate.');
      },
      findFirst: async () => {
        throw new Error('Brand model not generated. Run prisma generate.');
      },
      update: async () => {
        throw new Error('Brand model not generated. Run prisma generate.');
      },
      count: async () => {
        throw new Error('Brand model not generated. Run prisma generate.');
      },
    };
  }

  if (!prisma.crossPropertyTransfer) {
    prisma.crossPropertyTransfer = {
      create: async () => {
        throw new Error(
          'CrossPropertyTransfer model not generated. Run prisma generate.'
        );
      },
      findUnique: async () => {
        throw new Error(
          'CrossPropertyTransfer model not generated. Run prisma generate.'
        );
      },
      findMany: async () => {
        throw new Error(
          'CrossPropertyTransfer model not generated. Run prisma generate.'
        );
      },
      update: async () => {
        throw new Error(
          'CrossPropertyTransfer model not generated. Run prisma generate.'
        );
      },
      count: async () => {
        throw new Error(
          'CrossPropertyTransfer model not generated. Run prisma generate.'
        );
      },
    };
  }

  if (!prisma.multiPropertyReport) {
    prisma.multiPropertyReport = {
      create: async () => {
        throw new Error(
          'MultiPropertyReport model not generated. Run prisma generate.'
        );
      },
      findUnique: async () => {
        throw new Error(
          'MultiPropertyReport model not generated. Run prisma generate.'
        );
      },
      update: async () => {
        throw new Error(
          'MultiPropertyReport model not generated. Run prisma generate.'
        );
      },
    };
  }

  return prisma;
};
