# Payment Service API Examples

The payment service is running on `http://localhost:3004`. Here are example API calls you can test:

## 1. Health Check

```bash
curl http://localhost:3004/health
```

## 2. Process a Payment

```bash
curl -X POST http://localhost:3004/api/payments/process \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.00,
    "currency": "USD",
    "description": "Test payment",
    "userId": "user_123",
    "paymentMethodData": {
      "type": "card",
      "card": {
        "number": "4242424242424242",
        "expiryMonth": 12,
        "expiryYear": 2025,
        "cvc": "123",
        "holderName": "John Doe"
      }
    }
  }'
```

## 3. Create a Payment Method

```bash
curl -X POST http://localhost:3004/api/payment-methods \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123",
    "type": "card",
    "card": {
      "number": "4242424242424242",
      "expiryMonth": 12,
      "expiryYear": 2025,
      "cvc": "123",
      "holderName": "John Doe"
    },
    "isDefault": true
  }'
```

## 4. Get User Payment Methods

```bash
curl http://localhost:3004/api/payment-methods/users/user_123
```

## 5. Get Gateway Status

```bash
curl http://localhost:3004/api/gateways/status
```

## 6. Capture a Payment

```bash
curl -X POST http://localhost:3004/api/payments/pi_template_123/capture \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.00
  }'
```

## 7. Refund a Payment

```bash
curl -X POST http://localhost:3004/api/payments/pi_template_123/refund \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50.00,
    "reason": "Customer request"
  }'
```

## Expected Responses

Since these are template implementations, you'll get mock responses like:

### Payment Processing Response:

```json
{
  "success": true,
  "data": {
    "id": "pi_template_1697456789123",
    "status": "pending",
    "amount": "100.00",
    "currency": "USD",
    "gatewayId": "stripe",
    "createdAt": "2024-10-16T11:38:39.000Z"
  }
}
```

### Payment Method Response:

```json
{
  "success": true,
  "data": {
    "id": "pm_template_1697456789123",
    "userId": "user_123",
    "type": "card",
    "provider": "stripe",
    "isDefault": true,
    "metadata": {
      "last4": "4242",
      "brand": "visa",
      "expiryMonth": 12,
      "expiryYear": 2025
    }
  }
}
```

## Notes

- All responses are currently mock/template data
- The service uses the first available gateway (Stripe by default)
- Failover will automatically try other gateways if one fails
- All payment data is logged for debugging
- No actual charges are made to real payment gateways yet
