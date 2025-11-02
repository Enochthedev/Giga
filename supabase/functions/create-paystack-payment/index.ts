// supabase/functions/create-paystack-payment/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaystackInitializeResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get authenticated user
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    // Parse request body
    const { cart_id, callback_url, channels } = await req.json()

    if (!cart_id) {
      throw new Error('cart_id is required')
    }

    // Get cart with items
    const { data: cart, error: cartError } = await supabaseClient
      .from('ecommerce_carts')
      .select(`
        *,
        items:ecommerce_cart_items(
          *,
          product:ecommerce_products(name, images, vendor_id)
        )
      `)
      .eq('id', cart_id)
      .eq('user_id', user.id)
      .single()

    if (cartError || !cart) {
      throw new Error('Cart not found or does not belong to user')
    }

    if (!cart.items || cart.items.length === 0) {
      throw new Error('Cart is empty')
    }

    // Calculate amount in kobo (Paystack uses kobo for NGN)
    const amountInKobo = Math.round(cart.total_amount * 100)

    // Generate unique reference
    const reference = `ps_${cart_id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Get user profile for email
    const { data: profile } = await supabaseClient
      .from('user_profiles')
      .select('email, first_name, last_name, phone')
      .eq('id', user.id)
      .single()

    const customerEmail = profile?.email || user.email || `customer-${user.id}@example.com`

    // Prepare Paystack initialization parameters
    const paystackParams = {
      email: customerEmail,
      amount: amountInKobo,
      currency: 'NGN',
      reference,
      callback_url: callback_url || `${Deno.env.get('FRONTEND_URL')}/checkout/callback`,
      metadata: {
        user_id: user.id,
        cart_id: cart.id,
        customer_name: profile ? `${profile.first_name} ${profile.last_name}` : 'Customer',
        phone: profile?.phone,
        items_count: cart.items.length,
      },
      channels: channels || ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
    }

    // Initialize Paystack transaction
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')
    if (!paystackSecretKey) {
      throw new Error('Paystack secret key not configured')
    }

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paystackParams),
    })

    if (!paystackResponse.ok) {
      const errorData = await paystackResponse.json()
      console.error('Paystack initialization failed:', errorData)
      throw new Error(errorData.message || 'Failed to initialize Paystack transaction')
    }

    const paystackData: PaystackInitializeResponse = await paystackResponse.json()

    if (!paystackData.status) {
      throw new Error(paystackData.message || 'Paystack transaction initialization failed')
    }

    // Store payment intent in database for tracking
    const { error: paymentIntentError } = await supabaseClient
      .from('payment_intents')
      .insert({
        user_id: user.id,
        cart_id: cart.id,
        provider: 'paystack',
        provider_reference: paystackData.data.reference,
        amount: cart.total_amount,
        currency: 'NGN',
        status: 'pending',
        metadata: {
          access_code: paystackData.data.access_code,
          authorization_url: paystackData.data.authorization_url,
        },
      })

    if (paymentIntentError) {
      console.error('Failed to store payment intent:', paymentIntentError)
      // Don't fail the request, just log the error
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          authorization_url: paystackData.data.authorization_url,
          access_code: paystackData.data.access_code,
          reference: paystackData.data.reference,
          amount: amountInKobo,
          currency: 'NGN',
        },
        message: 'Payment initialized successfully. Redirect customer to authorization_url',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in create-paystack-payment:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An error occurred while initializing payment',
      }),
      {
        status: error.message === 'Unauthorized' ? 401 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
