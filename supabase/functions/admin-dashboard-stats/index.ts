// supabase/functions/admin-dashboard-stats/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify admin
    const authHeader = req.headers.get('Authorization')!
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Check if admin
    const { data: adminRole } = await supabaseAdmin
      .from('user_roles')
      .select('role_name')
      .eq('user_id', user.id)
      .eq('role_name', 'ADMIN')
      .single()

    if (!adminRole) throw new Error('Forbidden')

    // Get stats
    const [orderStats, revenueData, productStats, userStats, lowStock] = await Promise.all([
      supabaseAdmin.rpc('get_order_stats'),
      supabaseAdmin.rpc('get_revenue_by_period', {
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0]
      }),
      supabaseAdmin.rpc('get_top_products', { limit_count: 10 }),
      supabaseAdmin.from('user_profiles').select('id', { count: 'exact', head: true }),
      supabaseAdmin.rpc('get_low_stock_products')
    ])

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          orders: orderStats.data,
          revenue: revenueData.data,
          products: productStats.data,
          users: userStats.count,
          low_stock: lowStock.data
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})