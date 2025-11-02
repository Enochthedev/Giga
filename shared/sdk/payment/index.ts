// shared/sdk/payment/index.ts
// Payment SDK for Giga Platform - Supports Stripe and Paystack

import { createClient, SupabaseClient } from '@supabase/supabase-js'

export type PaymentGateway = 'stripe' | 'paystack'
export type PaymentCurrency = 'NGN' | 'USD' | 'GHS' | 'ZAR' | 'KES'

export interface PaymentConfig {
  supabaseUrl: string
  supabaseAnonKey: string
  frontendUrl?: string
}

export interface CreatePaymentParams {
  cartId: string
  gateway: PaymentGateway
  callbackUrl?: string
  channels?: string[] // For Paystack: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
}

export interface PaymentResponse {
  success: boolean
  data?: {
    // Stripe response
    client_secret?: string
    payment_intent_id?: string
    // Paystack response
    authorization_url?: string
    access_code?: string
    reference?: string
    // Common
    amount: number
    currency: string
  }
  error?: string
}

export interface CartUpdateParams {
  gateway: PaymentGateway
}

export class PaymentClient {
  private supabase: SupabaseClient
  private frontendUrl: string

  constructor(config: PaymentConfig) {
    this.supabase = createClient(config.supabaseUrl, config.supabaseAnonKey)
    this.frontendUrl = config.frontendUrl || window?.location?.origin || 'http://localhost:3000'
  }

  /**
   * Update cart to set selected payment gateway
   */
  async setPaymentGateway(cartId: string, gateway: PaymentGateway): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('ecommerce_carts')
        .update({ payment_gateway: gateway })
        .eq('id', cartId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Create payment intent (Stripe or Paystack)
   */
  async createPayment(params: CreatePaymentParams): Promise<PaymentResponse> {
    try {
      // First, update cart with selected gateway
      await this.setPaymentGateway(params.cartId, params.gateway)

      // Determine which function to call
      const functionName = params.gateway === 'stripe'
        ? 'create-payment-intent'
        : 'create-paystack-payment'

      // Call the appropriate Edge Function
      const { data, error } = await this.supabase.functions.invoke(functionName, {
        body: {
          cart_id: params.cartId,
          callback_url: params.callbackUrl || `${this.frontendUrl}/checkout/callback`,
          channels: params.channels,
        },
      })

      if (error) {
        return {
          success: false,
          error: error.message || 'Failed to create payment',
        }
      }

      return {
        success: data.success,
        data: data.data,
        error: data.error,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(reference: string): Promise<{
    success: boolean
    data?: {
      status: string
      amount: number
      currency: string
      provider: string
    }
    error?: string
  }> {
    try {
      const { data, error } = await this.supabase
        .from('payment_intents')
        .select('*')
        .eq('provider_reference', reference)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return {
        success: true,
        data: {
          status: data.status,
          amount: data.amount,
          currency: data.currency,
          provider: data.provider,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Get user's payment history
   */
  async getPaymentHistory(limit = 10): Promise<{
    success: boolean
    data?: Array<{
      id: string
      provider: string
      amount: number
      currency: string
      status: string
      created_at: string
    }>
    error?: string
  }> {
    try {
      const { data, error } = await this.supabase
        .from('payment_intents')
        .select('id, provider, amount, currency, status, created_at')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Verify Paystack payment (after redirect)
   */
  async verifyPaystackPayment(reference: string): Promise<{
    success: boolean
    data?: {
      status: string
      amount: number
      message: string
    }
    error?: string
  }> {
    try {
      // Check payment intent status
      const status = await this.getPaymentStatus(reference)

      if (!status.success || !status.data) {
        return {
          success: false,
          error: status.error || 'Payment not found',
        }
      }

      return {
        success: true,
        data: {
          status: status.data.status,
          amount: status.data.amount,
          message: status.data.status === 'succeeded'
            ? 'Payment successful!'
            : 'Payment processing...',
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Get recommended payment gateway based on currency
   */
  static getRecommendedGateway(currency: PaymentCurrency): PaymentGateway {
    const paystackCurrencies: PaymentCurrency[] = ['NGN', 'GHS', 'ZAR', 'KES']

    if (paystackCurrencies.includes(currency)) {
      return 'paystack'
    }

    return 'stripe'
  }

  /**
   * Get supported gateways for a currency
   */
  static getSupportedGateways(currency: PaymentCurrency): PaymentGateway[] {
    const paystackCurrencies: PaymentCurrency[] = ['NGN', 'GHS', 'ZAR', 'KES']
    const stripeCurrencies: PaymentCurrency[] = ['USD', 'NGN'] // Stripe also supports NGN

    const gateways: PaymentGateway[] = []

    if (stripeCurrencies.includes(currency)) {
      gateways.push('stripe')
    }

    if (paystackCurrencies.includes(currency)) {
      gateways.push('paystack')
    }

    return gateways
  }
}

// Export convenience functions
export function createPaymentClient(config: PaymentConfig): PaymentClient {
  return new PaymentClient(config)
}

export { PaymentClient as default }
