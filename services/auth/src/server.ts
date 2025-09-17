import { app, prisma } from './app';

const PORT = parseInt(process.env.AUTH_PORT || '3001');
const HOST = process.env.HOST || '0.0.0.0';

async function start() {
  try {
    // Connect to Prisma
    await prisma.$connect();
    console.log('✅ Connected to database');

    // Start server
    app.listen(PORT, HOST, () => {
      console.log(`🔐 Auth Service running on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start auth service:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down auth service...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down auth service...');
  await prisma.$disconnect();
  process.exit(0);
});

if (require.main === module) {
  start();
}

export { start };
