/**
 * Supabase SDK Client Configuration
 *
 * This module initializes and exports configured instances of Supabase SDKs:
 * - AuthClient: For authentication and user management
 * - FileStorageClient: For product image uploads and file management
 * - NotificationClient: For order notifications and customer communications
 */

import { AuthClient } from '@giga/auth-sdk';
import { FileStorageClient } from '@giga/file-storage-sdk';
import { NotificationClient } from '@giga/notifications-sdk';

/**
 * Supabase configuration interface
 */
export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
}

/**
 * Validates that all required Supabase environment variables are present
 * @throws Error if any required environment variable is missing
 */
export function validateSupabaseEnv(): SupabaseConfig {
  const requiredVars = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Supabase environment variables: ${missingVars.join(', ')}\n` +
        'Please ensure these are set in your .env file.'
    );
  }

  return {
    url: requiredVars.SUPABASE_URL!,
    anonKey: requiredVars.SUPABASE_ANON_KEY!,
    serviceRoleKey: requiredVars.SUPABASE_SERVICE_ROLE_KEY!,
  };
}

/**
 * Initialize Supabase SDK clients
 * This function should be called during service startup
 */
export function initializeSupabaseClients() {
  const config = validateSupabaseEnv();

  // Initialize Auth Client
  const authClient = new AuthClient({
    supabaseUrl: config.url,
    supabaseKey: config.anonKey,
  });

  // Initialize File Storage Client for product images
  const fileStorageClient = new FileStorageClient({
    supabaseUrl: config.url,
    supabaseKey: config.anonKey,
  });

  // Initialize Notification Client for order notifications
  // Uses service role key for server-side operations
  const notificationClient = new NotificationClient({
    supabaseUrl: config.url,
    supabaseKey: config.serviceRoleKey,
  });

  return {
    authClient,
    fileStorageClient,
    notificationClient,
  };
}

// Export singleton instances for use throughout the application
let clients: ReturnType<typeof initializeSupabaseClients> | null = null;

/**
 * Get initialized Supabase SDK clients
 * Lazily initializes clients on first call
 */
export function getSupabaseClients() {
  if (!clients) {
    clients = initializeSupabaseClients();
  }
  return clients;
}

/**
 * Individual client getters for convenience
 */
export function getAuthClient(): AuthClient {
  return getSupabaseClients().authClient;
}

export function getFileStorageClient(): FileStorageClient {
  return getSupabaseClients().fileStorageClient;
}

export function getNotificationClient(): NotificationClient {
  return getSupabaseClients().notificationClient;
}

// Export types for use in other modules
export type { AuthClient, FileStorageClient, NotificationClient };
