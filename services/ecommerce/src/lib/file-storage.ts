/**
 * File Storage Client
 *
 * Re-exports the FileStorageClient from centralized config
 * Use this for product image uploads and file management
 *
 * @deprecated Import from config/clients.ts instead
 */

import { getFileStorageClient } from '../config/clients';

export const fileStorage = getFileStorageClient();
