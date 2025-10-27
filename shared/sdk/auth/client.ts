import {
  AuthError,
  AuthResponse,
  AuthUser,
  CreateAddressData,
  LoginCredentials,
  RoleName,
  SignupCredentials,
  UpdateAddressData,
  UpdateProfileData,
  UserAddress,
  UserProfile,
} from './types';

export interface AuthClientConfig {
  supabaseUrl: string;
  supabaseKey: string;
  functionsUrl?: string;
}

export class AuthClient {
  private supabaseUrl: string;
  private supabaseKey: string;
  private functionsUrl: string;
  private accessToken?: string;
  private refreshToken?: string;

  constructor(config: AuthClientConfig) {
    this.supabaseUrl = config.supabaseUrl;
    this.supabaseKey = config.supabaseKey;
    this.functionsUrl =
      config.functionsUrl || `${config.supabaseUrl}/functions/v1`;
  }

  /**
   * Set authentication tokens
   */
  setTokens(accessToken: string, refreshToken?: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | undefined {
    return this.accessToken;
  }

  /**
   * Clear tokens (logout)
   */
  clearTokens(): void {
    this.accessToken = undefined;
    this.refreshToken = undefined;
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(
      `${this.supabaseUrl}/auth/v1/token?grant_type=password`,
      {
        method: 'POST',
        headers: {
          apikey: this.supabaseKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      }
    );

    const data = (await response.json()) as any;

    if (!response.ok) {
      throw new AuthError(
        data.error_description || data.msg || 'Login failed',
        response.status,
        data
      );
    }

    // Save tokens
    this.setTokens(data.access_token, data.refresh_token);

    return data as AuthResponse;
  }

  /**
   * Sign up new user
   */
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        apikey: this.supabaseKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.first_name,
            last_name: credentials.last_name,
            phone: credentials.phone,
          },
        },
      }),
    });

    const data = (await response.json()) as any;

    if (!response.ok) {
      throw new AuthError(
        data.error_description || data.msg || 'Signup failed',
        response.status,
        data
      );
    }

    // Save tokens if provided
    if (data.access_token) {
      this.setTokens(data.access_token, data.refresh_token);
    }

    return data as AuthResponse;
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    if (!this.accessToken) {
      throw new AuthError('No access token available', 401);
    }

    const response = await fetch(`${this.supabaseUrl}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        apikey: this.supabaseKey,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new AuthError('Logout failed', response.status, data);
    }

    this.clearTokens();
  }

  /**
   * Get current user profile with roles
   */
  async getCurrentUser(): Promise<AuthUser> {
    if (!this.accessToken) {
      throw new AuthError('Not authenticated. Please login first.', 401);
    }

    const response = await fetch(`${this.functionsUrl}/get-user-profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    const data = (await response.json()) as { error?: string; data?: AuthUser };

    if (!response.ok) {
      throw new AuthError(
        data.error || 'Failed to get user profile',
        response.status,
        data
      );
    }

    return data.data!;
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: UpdateProfileData): Promise<UserProfile> {
    if (!this.accessToken) {
      throw new AuthError('Not authenticated. Please login first.', 401);
    }

    const response = await fetch(`${this.functionsUrl}/update-user-profile`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const data = (await response.json()) as {
      error?: string;
      data?: UserProfile;
    };

    if (!response.ok) {
      throw new AuthError(
        data.error || 'Failed to update profile',
        response.status,
        data
      );
    }

    return data.data!;
  }

  /**
   * Switch active role
   */
  async switchRole(role: RoleName): Promise<{ active_role: RoleName }> {
    if (!this.accessToken) {
      throw new AuthError('Not authenticated. Please login first.', 401);
    }

    const response = await fetch(`${this.functionsUrl}/switch-role`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    });

    const data = (await response.json()) as {
      error?: string;
      data?: { active_role: RoleName };
    };

    if (!response.ok) {
      throw new AuthError(
        data.error || 'Failed to switch role',
        response.status,
        data
      );
    }

    return data.data!;
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch(`${this.supabaseUrl}/auth/v1/recover`, {
      method: 'POST',
      headers: {
        apikey: this.supabaseKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error_description?: string };
      throw new AuthError(
        data.error_description || 'Failed to request password reset',
        response.status,
        data
      );
    }
  }

  /**
   * Update password (when logged in)
   */
  async updatePassword(newPassword: string): Promise<void> {
    if (!this.accessToken) {
      throw new AuthError('Not authenticated. Please login first.', 401);
    }

    const response = await fetch(`${this.supabaseUrl}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        apikey: this.supabaseKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: newPassword }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error_description?: string };
      throw new AuthError(
        data.error_description || 'Failed to update password',
        response.status,
        data
      );
    }
  }

  /**
   * Refresh access token
   */
  async refreshSession(): Promise<AuthResponse> {
    if (!this.refreshToken) {
      throw new AuthError('No refresh token available', 401);
    }

    const response = await fetch(
      `${this.supabaseUrl}/auth/v1/token?grant_type=refresh_token`,
      {
        method: 'POST',
        headers: {
          apikey: this.supabaseKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      }
    );

    const data = (await response.json()) as AuthResponse & {
      error_description?: string;
    };

    if (!response.ok) {
      throw new AuthError(
        data.error_description || 'Failed to refresh session',
        response.status,
        data
      );
    }

    this.setTokens(data.access_token, data.refresh_token);

    return data;
  }

  // ===== ADDRESS MANAGEMENT =====

  /**
   * Get user addresses
   */
  async getAddresses(): Promise<UserAddress[]> {
    if (!this.accessToken) {
      throw new AuthError('Not authenticated. Please login first.', 401);
    }

    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/user_addresses?select=*&order=created_at.desc`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          apikey: this.supabaseKey,
        },
      }
    );

    const data = (await response.json()) as UserAddress[];

    if (!response.ok) {
      throw new AuthError('Failed to fetch addresses', response.status, data);
    }

    return data;
  }

  /**
   * Get default address
   */
  async getDefaultAddress(): Promise<UserAddress | null> {
    const addresses = await this.getAddresses();
    return addresses.find(addr => addr.is_default) || null;
  }

  /**
   * Create new address
   */
  async createAddress(addressData: CreateAddressData): Promise<UserAddress> {
    if (!this.accessToken) {
      throw new AuthError('Not authenticated. Please login first.', 401);
    }

    // Get user ID from current user
    const user = await this.getCurrentUser();

    const response = await fetch(`${this.supabaseUrl}/rest/v1/user_addresses`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        apikey: this.supabaseKey,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        user_id: user.id,
        ...addressData,
      }),
    });

    const data = (await response.json()) as UserAddress[];

    if (!response.ok) {
      throw new AuthError('Failed to create address', response.status, data);
    }

    return data[0];
  }

  /**
   * Update address
   */
  async updateAddress(
    addressId: string,
    updates: UpdateAddressData
  ): Promise<UserAddress> {
    if (!this.accessToken) {
      throw new AuthError('Not authenticated. Please login first.', 401);
    }

    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/user_addresses?id=eq.${addressId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          apikey: this.supabaseKey,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(updates),
      }
    );

    const data = (await response.json()) as UserAddress[];

    if (!response.ok) {
      throw new AuthError('Failed to update address', response.status, data);
    }

    return data[0];
  }

  /**
   * Delete address
   */
  async deleteAddress(addressId: string): Promise<void> {
    if (!this.accessToken) {
      throw new AuthError('Not authenticated. Please login first.', 401);
    }

    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/user_addresses?id=eq.${addressId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          apikey: this.supabaseKey,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new AuthError('Failed to delete address', response.status, data);
    }
  }

  /**
   * Set default address
   */
  async setDefaultAddress(addressId: string): Promise<void> {
    if (!this.accessToken) {
      throw new AuthError('Not authenticated. Please login first.', 401);
    }

    const user = await this.getCurrentUser();

    // First, unset all default addresses
    await fetch(
      `${this.supabaseUrl}/rest/v1/user_addresses?user_id=eq.${user.id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          apikey: this.supabaseKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_default: false }),
      }
    );

    // Then set the new default
    await this.updateAddress(addressId, { is_default: true });
  }
}
