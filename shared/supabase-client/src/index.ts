import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  serviceRoleKey: string;
  anonKey?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  date_of_birth?: string;
  role:
    | 'user'
    | 'admin'
    | 'moderator'
    | 'driver'
    | 'merchant'
    | 'hotel_manager';
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  preferences: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  type: string;
  street_address: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read';
  data: Record<string, any>;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  type: string;
  payload: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  max_attempts: number;
  error_message?: string;
  scheduled_at: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export class GigaSupabaseClient {
  private client: SupabaseClient;
  private serviceClient: SupabaseClient;

  constructor(config: SupabaseConfig) {
    // Client for user operations (with RLS)
    this.client = createClient(
      config.url,
      config.anonKey || config.serviceRoleKey
    );

    // Service client for admin operations (bypasses RLS)
    this.serviceClient = createClient(config.url, config.serviceRoleKey);
  }

  // Auth methods
  async verifyToken(token: string): Promise<UserProfile | null> {
    try {
      const {
        data: { user },
        error,
      } = await this.client.auth.getUser(token);

      if (error || !user) {
        return null;
      }

      const { data: profile, error: profileError } = await this.serviceClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return null;
      }

      return profile as UserProfile;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.serviceClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Get user profile error:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.serviceClient
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Update user profile error:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Update user profile error:', error);
      return null;
    }
  }

  // Address methods
  async getUserAddresses(userId: string): Promise<Address[]> {
    try {
      const { data, error } = await this.serviceClient
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });

      if (error) {
        console.error('Get user addresses error:', error);
        return [];
      }

      return data as Address[];
    } catch (error) {
      console.error('Get user addresses error:', error);
      return [];
    }
  }

  async createAddress(
    address: Omit<Address, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Address | null> {
    try {
      const { data, error } = await this.serviceClient
        .from('addresses')
        .insert(address)
        .select()
        .single();

      if (error) {
        console.error('Create address error:', error);
        return null;
      }

      return data as Address;
    } catch (error) {
      console.error('Create address error:', error);
      return null;
    }
  }

  // Notification methods
  async createNotification(
    notification: Omit<Notification, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Notification | null> {
    try {
      const { data, error } = await this.serviceClient
        .from('notifications')
        .insert(notification)
        .select()
        .single();

      if (error) {
        console.error('Create notification error:', error);
        return null;
      }

      return data as Notification;
    } catch (error) {
      console.error('Create notification error:', error);
      return null;
    }
  }

  async getUserNotifications(
    userId: string,
    limit = 20,
    offset = 0
  ): Promise<Notification[]> {
    try {
      const { data, error } = await this.serviceClient
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Get user notifications error:', error);
        return [];
      }

      return data as Notification[];
    } catch (error) {
      console.error('Get user notifications error:', error);
      return [];
    }
  }

  // Job methods
  async createJob(
    job: Omit<Job, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Job | null> {
    try {
      const { data, error } = await this.serviceClient
        .from('jobs')
        .insert(job)
        .select()
        .single();

      if (error) {
        console.error('Create job error:', error);
        return null;
      }

      return data as Job;
    } catch (error) {
      console.error('Create job error:', error);
      return null;
    }
  }

  async updateJob(jobId: string, updates: Partial<Job>): Promise<Job | null> {
    try {
      const { data, error } = await this.serviceClient
        .from('jobs')
        .update(updates)
        .eq('id', jobId)
        .select()
        .single();

      if (error) {
        console.error('Update job error:', error);
        return null;
      }

      return data as Job;
    } catch (error) {
      console.error('Update job error:', error);
      return null;
    }
  }

  async getPendingJobs(type?: string, limit = 10): Promise<Job[]> {
    try {
      let query = this.serviceClient
        .from('jobs')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(limit);

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Get pending jobs error:', error);
        return [];
      }

      return data as Job[];
    } catch (error) {
      console.error('Get pending jobs error:', error);
      return [];
    }
  }

  // Storage methods
  async getSignedUrl(
    bucket: string,
    path: string,
    expiresIn = 3600
  ): Promise<string | null> {
    try {
      const { data, error } = await this.serviceClient.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) {
        console.error('Get signed URL error:', error);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Get signed URL error:', error);
      return null;
    }
  }

  async getPublicUrl(bucket: string, path: string): Promise<string | null> {
    try {
      const { data } = this.serviceClient.storage
        .from(bucket)
        .getPublicUrl(path);

      return data.publicUrl;
    } catch (error) {
      console.error('Get public URL error:', error);
      return null;
    }
  }

  // Realtime subscriptions
  subscribeToUserNotifications(
    userId: string,
    callback: (notification: Notification) => void
  ) {
    return this.client
      .channel(`user-notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        payload => callback(payload.new as Notification)
      )
      .subscribe();
  }

  // Raw client access for advanced operations
  get rawClient(): SupabaseClient {
    return this.client;
  }

  get serviceRawClient(): SupabaseClient {
    return this.serviceClient;
  }
}

// Factory function for easy instantiation
export function createGigaSupabaseClient(
  config: SupabaseConfig
): GigaSupabaseClient {
  return new GigaSupabaseClient(config);
}

// Export types
export * from '@supabase/supabase-js';
