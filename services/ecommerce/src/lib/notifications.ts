/**
 * Notification Client
 *
 * Re-exports the NotificationClient from centralized config
 * Use this for order notifications and customer communications
 *
 * @deprecated Import from config/clients.ts instead
 */

import { getNotificationClient } from '../config/clients';

export const notificationClient = getNotificationClient();
