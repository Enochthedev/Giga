import { NotificationClient } from '@giga/notifications-sdk'

export const notificationClient = new NotificationClient({
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
})
