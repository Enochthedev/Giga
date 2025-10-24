import { app, prisma } from './app';
import {
  initializeSupabaseClients,
  validateSupabaseEnv,
} from './config/clients';
import { cleanupService } from './services/cleanup.service';
import { redisService } from './services/redis.service';

const PORT = parseInt(process.env.ECOMMERCE_PORT || '3002');
const HOST = process.env.HOST || '0.0.0.0';

async function start() {
  try {
    // Validate Supabase environment variables
    console.log('🔍 Validating Supabase configuration...');
    validateSupabaseEnv();
    console.log('✅ Supabase environment variables validated');

    // Initialize Supabase SDK clients
    console.log('🔧 Initializing Supabase SDK clients...');
    initializeSupabaseClients();
    console.log(
      '✅ Supabase SDK clients initialized (Auth, FileStorage, Notifications)'
    );

    // Connect to Prisma and Redis
    await prisma.$connect();
    console.log('✅ Connected to database');

    await redisService.connect();
    console.log('✅ Connected to Redis');

    // Start cleanup service (runs every hour)
    cleanupService.startAutomaticCleanup(60);
    console.log('✅ Cleanup service started');

    // Start server
    app.listen(PORT, HOST, () => {
      console.log(`🛒 Ecommerce Service running on http://${HOST}:${PORT}`);
      console.log(`📚 API Documentation: http://${HOST}:${PORT}/docs`);
    });
  } catch (error) {
    console.error('❌ Failed to start ecommerce service:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down ecommerce service...');
  cleanupService.stopAutomaticCleanup();
  await prisma.$disconnect();
  await redisService.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down ecommerce service...');
  cleanupService.stopAutomaticCleanup();
  await prisma.$disconnect();
  await redisService.disconnect();
  process.exit(0);
});

if (require.main === module) {
  start();
}

export { start };
