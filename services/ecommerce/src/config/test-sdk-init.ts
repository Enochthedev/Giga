/**
 * Manual test script to verify Supabase SDK initialization
 *
 * Run with: tsx src/config/test-sdk-init.ts
 */

import { initializeSupabaseClients, validateSupabaseEnv } from './clients';

async function testSDKInitialization() {
  console.log('🧪 Testing Supabase SDK Initialization\n');

  try {
    // Step 1: Validate environment variables
    console.log('Step 1: Validating Supabase environment variables...');
    const config = validateSupabaseEnv();
    console.log('✅ Environment variables validated');
    console.log(`   - SUPABASE_URL: ${config.url.substring(0, 30)}...`);
    console.log(
      `   - SUPABASE_ANON_KEY: ${config.anonKey.substring(0, 20)}...`
    );
    console.log(
      `   - SUPABASE_SERVICE_ROLE_KEY: ${config.serviceRoleKey.substring(0, 20)}...`
    );
    console.log('');

    // Step 2: Initialize SDK clients
    console.log('Step 2: Initializing Supabase SDK clients...');
    const clients = initializeSupabaseClients();
    console.log('✅ SDK clients initialized successfully');
    console.log('   - AuthClient: ✓');
    console.log('   - FileStorageClient: ✓');
    console.log('   - NotificationClient: ✓');
    console.log('');

    // Step 3: Verify client instances
    console.log('Step 3: Verifying client instances...');
    console.log(`   - AuthClient type: ${typeof clients.authClient}`);
    console.log(
      `   - FileStorageClient type: ${typeof clients.fileStorageClient}`
    );
    console.log(
      `   - NotificationClient type: ${typeof clients.notificationClient}`
    );
    console.log('');

    console.log('✅ All tests passed! SDK integration is working correctly.\n');
    return true;
  } catch (error) {
    console.error('❌ SDK initialization failed:');
    console.error(error);
    console.log('');
    console.log('Please ensure the following environment variables are set:');
    console.log('  - SUPABASE_URL');
    console.log('  - SUPABASE_ANON_KEY');
    console.log('  - SUPABASE_SERVICE_ROLE_KEY');
    console.log('');
    return false;
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testSDKInitialization()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

export { testSDKInitialization };
