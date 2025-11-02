// supabase/functions/paystack-webhook/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts"

interface PaystackWebhookEvent {
  event: string
  data: {
    id: number
    reference: string
    amount: number
    currency: string
    status: string
    paid_at: string
    created_at: string
    channel: string
    gateway_response: string
    customer: {
      id: number
      email: string
      customer_code: string
    }
    metadata: {
      user_id: string
      cart_id: string
      [key: string]: any
    }
  }
}

serve(async (req) => {
  try {
    // Get webhook signature from headers
    const signature = req.headers.get('x-paystack-signature')
    if (!signature) {
      console.error('No signature provided')
      return new Response(
        JSON.stringify({ error: 'No signature provided' }),
        { status: 400 }
      )
    }

    // Get raw body for signature verification
    const body = await req.text()

    // Verify webhook signature
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')
    if (!paystackSecretKey) {
      console.error('Paystack secret key not configured')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500 }
      )
    }

    const hash = createHmac('sha512', paystackSecretKey)
      .update(body)
      .digest('hex')

    if (hash !== signature) {
      console.error('Invalid signature', {
        expected: hash,
        received: signature,
      })
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400 }
      )
    }

    // Parse webhook event
    const event: PaystackWebhookEvent = JSON.parse(body)

    console.log('Paystack webhook received:', {
      event: event.event,
      reference: event.data.reference,
      status: event.data.status,
    })

    // Initialize Supabase Admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Handle different event types
    switch (event.event) {
      case 'charge.success': {
        await handleChargeSuccess(supabaseAdmin, event)
        break
      }

      case 'charge.failed': {
        await handleChargeFailed(supabaseAdmin, event)
        break
      }

      case 'refund.processed': {
        await handleRefundProcessed(supabaseAdmin, event)
        break
      }

      case 'refund.failed': {
        console.log('Refund failed:', event.data.reference)
        // Update refund status if tracking refunds
        break
      }

      default:
        console.log('Unhandled Paystack event type:', event.event)
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200 }
    )

  } catch (error) {
    console.error('Paystack webhook handler error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    )
  }
})

/**
 * Handle successful payment
 */
async function handleChargeSuccess(supabaseAdmin: any, event: PaystackWebhookEvent) {
  const { user_id, cart_id } = event.data.metadata

  console.log('Processing successful payment:', {
    reference: event.data.reference,
    user_id,
    cart_id,
  })

  try {
    // Get cart items
    const { data: cartItems, error: cartItemsError } = await supabaseAdmin
      .from('ecommerce_cart_items')
      .select(`
        *,
        product:ecommerce_products(*)
      `)
      .eq('cart_id', cart_id)

    if (cartItemsError) {
      throw new Error(`Failed to fetch cart items: ${cartItemsError.message}`)
    }

    // Get cart
    const { data: cart, error: cartError } = await supabaseAdmin
      .from('ecommerce_carts')
      .select('*')
      .eq('id', cart_id)
      .single()

    if (cartError) {
      throw new Error(`Failed to fetch cart: ${cartError.message}`)
    }

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('ecommerce_orders')
      .insert({
        user_id,
        subtotal: cart.subtotal,
        discount_amount: cart.discount_amount || 0,
        tax_amount: cart.tax_amount || 0,
        total_amount: event.data.amount / 100, // Convert from kobo to naira
        payment_method: event.data.channel,
        payment_status: 'paid',
        payment_provider: 'paystack',
        payment_id: event.data.reference,
        paid_at: event.data.paid_at,
        status: 'confirmed',
        promo_code_id: cart.promo_code_id,
        metadata: {
          paystack_id: event.data.id,
          gateway_response: event.data.gateway_response,
          channel: event.data.channel,
        },
      })
      .select()
      .single()

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`)
    }

    console.log('Order created:', order.order_number)

    // Create order items
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      vendor_id: item.product.vendor_id,
      product_name: item.product.name,
      product_slug: item.product.slug,
      sku: item.product.sku,
      quantity: item.quantity,
      price_per_unit: item.price_per_unit,
      subtotal: item.subtotal,
      product_snapshot: item.product,
    }))

    const { error: orderItemsError } = await supabaseAdmin
      .from('ecommerce_order_items')
      .insert(orderItems)

    if (orderItemsError) {
      throw new Error(`Failed to create order items: ${orderItemsError.message}`)
    }

    // Update product inventory
    for (const item of cartItems) {
      const { error: inventoryError } = await supabaseAdmin
        .from('ecommerce_products')
        .update({
          stock_quantity: supabaseAdmin.raw(`stock_quantity - ${item.quantity}`),
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.product_id)

      if (inventoryError) {
        console.error('Failed to update inventory for product:', item.product_id, inventoryError)
      }
    }

    // Clear cart items
    await supabaseAdmin
      .from('ecommerce_cart_items')
      .delete()
      .eq('cart_id', cart_id)

    // Update payment intent status
    await supabaseAdmin
      .from('payment_intents')
      .update({
        status: 'succeeded',
        updated_at: new Date().toISOString(),
      })
      .eq('provider_reference', event.data.reference)

    // Send order confirmation email
    try {
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-order-confirmation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_id: order.id }),
      })
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError)
      // Don't fail the webhook - order was created successfully
    }

    console.log('Payment processed successfully:', {
      order_id: order.id,
      order_number: order.order_number,
    })

  } catch (error) {
    console.error('Error processing successful payment:', error)
    throw error
  }
}

/**
 * Handle failed payment
 */
async function handleChargeFailed(supabaseAdmin: any, event: PaystackWebhookEvent) {
  console.log('Payment failed:', {
    reference: event.data.reference,
    gateway_response: event.data.gateway_response,
  })

  // Update payment intent status
  await supabaseAdmin
    .from('payment_intents')
    .update({
      status: 'failed',
      error_message: event.data.gateway_response,
      updated_at: new Date().toISOString(),
    })
    .eq('provider_reference', event.data.reference)

  // Optionally notify user of payment failure
  const { user_id } = event.data.metadata
  if (user_id) {
    try {
      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id,
          type: 'payment_failed',
          title: 'Payment Failed',
          message: `Your payment of ₦${(event.data.amount / 100).toFixed(2)} failed. ${event.data.gateway_response}`,
          metadata: {
            reference: event.data.reference,
            amount: event.data.amount / 100,
          },
        })
    } catch (notificationError) {
      console.error('Failed to create failure notification:', notificationError)
    }
  }
}

/**
 * Handle refund processed
 */
async function handleRefundProcessed(supabaseAdmin: any, event: PaystackWebhookEvent) {
  console.log('Refund processed:', event.data.reference)

  // Update order payment status
  await supabaseAdmin
    .from('ecommerce_orders')
    .update({
      payment_status: 'refunded',
      status: 'refunded',
      updated_at: new Date().toISOString(),
    })
    .eq('payment_id', event.data.reference)

  // Optionally restore inventory
  const { data: order } = await supabaseAdmin
    .from('ecommerce_orders')
    .select(`
      *,
      items:ecommerce_order_items(*)
    `)
    .eq('payment_id', event.data.reference)
    .single()

  if (order && order.items) {
    for (const item of order.items) {
      await supabaseAdmin
        .from('ecommerce_products')
        .update({
          stock_quantity: supabaseAdmin.raw(`stock_quantity + ${item.quantity}`),
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.product_id)
    }
  }
}
