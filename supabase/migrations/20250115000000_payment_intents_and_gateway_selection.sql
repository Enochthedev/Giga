-- Migration: Add payment_intents table and payment gateway selection
-- Description: Track payment intents and allow customers to choose payment gateway

-- Create payment_intents table
CREATE TABLE IF NOT EXISTS payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cart_id UUID REFERENCES ecommerce_carts(id) ON DELETE SET NULL,
  provider VARCHAR(50) NOT NULL, -- 'stripe' or 'paystack'
  provider_reference VARCHAR(255) NOT NULL UNIQUE, -- Stripe PaymentIntent ID or Paystack reference
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'NGN',
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, succeeded, failed, cancelled
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_payment_intents_user_id ON payment_intents(user_id);
CREATE INDEX idx_payment_intents_cart_id ON payment_intents(cart_id);
CREATE INDEX idx_payment_intents_provider_reference ON payment_intents(provider_reference);
CREATE INDEX idx_payment_intents_status ON payment_intents(status);
CREATE INDEX idx_payment_intents_created_at ON payment_intents(created_at DESC);

-- Add RLS policies
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment intents
CREATE POLICY "Users can view own payment intents"
  ON payment_intents
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can do everything (for Edge Functions)
CREATE POLICY "Service role has full access to payment intents"
  ON payment_intents
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Add payment_gateway column to ecommerce_carts (for customer selection)
ALTER TABLE ecommerce_carts
ADD COLUMN IF NOT EXISTS payment_gateway VARCHAR(50) DEFAULT 'paystack' CHECK (payment_gateway IN ('stripe', 'paystack'));

-- Add comment
COMMENT ON COLUMN ecommerce_carts.payment_gateway IS 'Customer selected payment gateway: stripe or paystack';

-- Add payment_gateway to existing carts (default to paystack for NGN)
UPDATE ecommerce_carts
SET payment_gateway = 'paystack'
WHERE payment_gateway IS NULL;

-- Add index
CREATE INDEX IF NOT EXISTS idx_ecommerce_carts_payment_gateway ON ecommerce_carts(payment_gateway);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for payment_intents
DROP TRIGGER IF EXISTS update_payment_intents_updated_at ON payment_intents;
CREATE TRIGGER update_payment_intents_updated_at
  BEFORE UPDATE ON payment_intents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add helper view for payment analytics
CREATE OR REPLACE VIEW payment_analytics AS
SELECT
  provider,
  status,
  currency,
  COUNT(*) as transaction_count,
  SUM(amount) as total_amount,
  AVG(amount) as average_amount,
  DATE_TRUNC('day', created_at) as transaction_date
FROM payment_intents
GROUP BY provider, status, currency, DATE_TRUNC('day', created_at)
ORDER BY transaction_date DESC;

-- Grant access to authenticated users for the view
GRANT SELECT ON payment_analytics TO authenticated;

-- Add comment
COMMENT ON TABLE payment_intents IS 'Tracks all payment intents from Stripe and Paystack';
COMMENT ON VIEW payment_analytics IS 'Payment analytics by provider, status, and date';
