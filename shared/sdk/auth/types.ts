export type RoleName = 
  | 'CUSTOMER'
  | 'VENDOR'
  | 'DRIVER'
  | 'HOST'
  | 'ADVERTISER'
  | 'ADMIN'

export type Gender = 
  | 'MALE'
  | 'FEMALE'
  | 'OTHER'
  | 'PREFER_NOT_TO_SAY'

export type MaritalStatus =
  | 'SINGLE'
  | 'MARRIED'
  | 'DIVORCED'
  | 'WIDOWED'
  | 'SEPARATED'
  | 'DOMESTIC_PARTNERSHIP'
  | 'PREFER_NOT_TO_SAY'

export type AgeGroup =
  | 'UNDER_18'
  | 'AGE_18_24'
  | 'AGE_25_34'
  | 'AGE_35_44'
  | 'AGE_45_54'
  | 'AGE_55_64'
  | 'AGE_65_PLUS'
  | 'PREFER_NOT_TO_SAY'

export interface UserProfile {
  id: string
  email: string
  phone?: string
  first_name: string
  last_name: string
  avatar?: string
  date_of_birth?: string
  gender?: Gender
  marital_status?: MaritalStatus
  body_weight?: number
  height?: number
  age_group?: AgeGroup
  areas_of_interest?: string[]
  is_phone_verified: boolean
  is_active: boolean
  last_login_at?: string
  created_at: string
  updated_at: string
}

export interface UserAddress {
  id: string
  user_id: string
  label: string
  name?: string
  building_number?: string
  street: string
  address2?: string
  city: string
  state?: string
  zip_code?: string
  country: string
  phone?: string
  is_default: boolean
  latitude?: number
  longitude?: number
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  profile: UserProfile
  roles: RoleName[]
  active_role: RoleName
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  user: {
    id: string
    email: string
  }
}

export interface UpdateProfileData {
  first_name?: string
  last_name?: string
  phone?: string
  avatar?: string
  date_of_birth?: string
  gender?: Gender
  marital_status?: MaritalStatus
  body_weight?: number
  height?: number
  age_group?: AgeGroup
  areas_of_interest?: string[]
}

export interface CreateAddressData {
  label: string
  name?: string
  building_number?: string
  street: string
  address2?: string
  city: string
  state?: string
  zip_code?: string
  country: string
  phone?: string
  is_default?: boolean
  latitude?: number
  longitude?: number
}

export interface UpdateAddressData extends Partial<CreateAddressData> {}

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'AuthError'
  }
}