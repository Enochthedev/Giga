import { z } from 'zod';
import { RoleName } from './user';

// Authentication schemas
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional(),
});

export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  roles: z.array(z.nativeEnum(RoleName)).min(1),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Must accept terms and conditions',
  }),
});

export const AuthResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    roles: z.array(z.nativeEnum(RoleName)),
    activeRole: z.nativeEnum(RoleName),
    avatar: z.string().url().optional(),
  }),
  tokens: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresIn: z.number(),
  }),
});

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});

export const SwitchRoleRequestSchema = z.object({
  targetRole: z.nativeEnum(RoleName),
  targetService: z.string().optional(),
});

export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email(),
});

export const ResetPasswordRequestSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});

export const VerifyEmailRequestSchema = z.object({
  token: z.string(),
});

export const VerifyPhoneRequestSchema = z.object({
  phone: z.string(),
  code: z.string().length(6),
});

export const OAuthCallbackSchema = z.object({
  provider: z.enum(['google', 'apple']),
  code: z.string(),
  state: z.string().optional(),
});

// JWT payload
export const JWTPayloadSchema = z.object({
  sub: z.string(), // user id
  email: z.string().email(),
  roles: z.array(z.nativeEnum(RoleName)),
  activeRole: z.nativeEnum(RoleName),
  iat: z.number(),
  exp: z.number(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export type SwitchRoleRequest = z.infer<typeof SwitchRoleRequestSchema>;
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;
export type VerifyEmailRequest = z.infer<typeof VerifyEmailRequestSchema>;
export type VerifyPhoneRequest = z.infer<typeof VerifyPhoneRequestSchema>;
export type OAuthCallback = z.infer<typeof OAuthCallbackSchema>;
export type JWTPayload = z.infer<typeof JWTPayloadSchema>;
