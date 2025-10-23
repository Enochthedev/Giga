// shared/sdk/notifications/types.ts

export type NotificationCategory = 
  | 'auth'
  | 'order'
  | 'booking'
  | 'ride'
  | 'system'
  | 'marketing'

export type NotificationChannel = 
  | 'email'
  | 'sms'
  | 'push'
  | 'in_app'

export type NotificationStatus =
  | 'pending'
  | 'sent'
  | 'delivered'
  | 'failed'
  | 'bounced'

export type NotificationPriority = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export interface NotificationTemplate {
  id: string
  name: string
  description?: string
  category: NotificationCategory
  channels: NotificationChannel[]
  subject?: string
  email_body?: string
  sms_body?: string
  push_title?: string
  push_body?: string
  required_variables: string[]
  optional_variables: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface NotificationLog {
  id: string
  user_id?: string
  template_id?: string
  template_name?: string
  recipient_email?: string
  recipient_phone?: string
  subject?: string
  content?: string
  channels: NotificationChannel[]
  status: NotificationStatus
  email_status?: string
  sms_status?: string
  push_status?: string
  error_message?: string
  retry_count: number
  created_at: string
  sent_at?: string
  delivered_at?: string
  failed_at?: string
  metadata?: Record<string, any>
}

export interface NotificationPreferences {
  id: string
  user_id: string
  email_enabled: boolean
  sms_enabled: boolean
  push_enabled: boolean
  in_app_enabled: boolean
  category_preferences: Record<NotificationCategory, Record<NotificationChannel, boolean>>
  quiet_hours_enabled: boolean
  quiet_hours_start?: string
  quiet_hours_end?: string
  timezone: string
  language: string
  global_opt_out: boolean
  created_at: string
  updated_at: string
}

export interface SendNotificationRequest {
  user_id?: string
  template_name: string
  variables: Record<string, any>
  recipient_email?: string
  recipient_phone?: string
  recipient_device_token?: string
  channels?: NotificationChannel[]
  priority?: NotificationPriority
  delay_seconds?: number
  send_immediately?: boolean
}

export interface QueueNotificationResponse {
  success: boolean
  data: {
    queue_id: string
    status: 'queued'
    estimated_send_time: string
  }
}

export interface SendNotificationResponse {
  success: boolean
  data: {
    log_id: string
    channels: NotificationChannel[]
    results: Record<string, {
      success: boolean
      provider_id?: string
      error?: string
    }>
  }
}

export interface BatchRecipient {
  user_id?: string
  recipient_email?: string
  recipient_phone?: string
  recipient_device_token?: string
  variables?: Record<string, any>
}

export interface BatchNotificationRequest {
  recipients: BatchRecipient[]
  template_name: string
  variables_template?: Record<string, any>
  priority?: NotificationPriority
}

export interface BatchNotificationResponse {
  success: boolean
  data: {
    queued_count: number
    queue_ids: string[]
  }
}

export interface NotificationHistoryQuery {
  limit?: number
  offset?: number
  status?: NotificationStatus
}

export interface NotificationHistoryResponse {
  success: boolean
  data: {
    logs: NotificationLog[]
    total: number
    limit: number
    offset: number
  }
}

export interface UpdatePreferencesRequest {
  email_enabled?: boolean
  sms_enabled?: boolean
  push_enabled?: boolean
  in_app_enabled?: boolean
  category_preferences?: Record<string, Record<string, boolean>>
  quiet_hours_enabled?: boolean
  quiet_hours_start?: string
  quiet_hours_end?: string
  timezone?: string
  language?: string
  global_opt_out?: boolean
}

export class NotificationError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'NotificationError'
  }
}