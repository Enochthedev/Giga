#!/bin/bash

# Fix common enum value issues in TypeScript files

# Fix PaymentStatus enums
find src -name "*.ts" -exec sed -i '' "s/'pending'/'PENDING'/g" {} \;
find src -name "*.ts" -exec sed -i '' "s/'processing'/'PROCESSING'/g" {} \;
find src -name "*.ts" -exec sed -i '' "s/'succeeded'/'SUCCEEDED'/g" {} \;
find src -name "*.ts" -exec sed -i '' "s/'failed'/'FAILED'/g" {} \;
find src -name "*.ts" -exec sed -i '' "s/'cancelled'/'CANCELLED'/g" {} \;
find src -name "*.ts" -exec sed -i '' "s/'refunded'/'REFUNDED'/g" {} \;
find src -name "*.ts" -exec sed -i '' "s/'partially_refunded'/'PARTIALLY_REFUNDED'/g" {} \;

# Fix PaymentMethodType enums
find src -name "*.ts" -exec sed -i '' "s/'card'/'CARD'/g" {} \;
find src -name "*.ts" -exec sed -i '' "s/'bank_account'/'BANK_ACCOUNT'/g" {} \;
find src -name "*.ts" -exec sed -i '' "s/'digital_wallet'/'DIGITAL_WALLET'/g" {} \;
find src -name "*.ts" -exec sed -i '' "s/'crypto'/'CRYPTO'/g" {} \;
find src -name "*.ts" -exec sed -i '' "s/'buy_now_pay_later'/'BUY_NOW_PAY_LATER'/g" {} \;

# Fix TransactionType enums
find src -name "*.ts" -exec sed -i '' "s/'payment'/'PAYMENT'/g" {} \;
find src -name "*.ts" -exec sed -i '' "s/'refund'/'REFUND'/g" {} \;

# Fix FraudAction enums
find src -name "*.ts" -exec sed -i '' "s/'allow'/'ALLOW'/g" {} \;
find src -name "*.ts" -exec sed -i '' "s/'review'/'REVIEW'/g" {} \;
find src -name "*.ts" -exec sed -i '' "s/'decline'/'DECLINE'/g" {} \;
find src -name "*.ts" -exec sed -i '' "s/'challenge'/'CHALLENGE'/g" {} \;

# Fix RiskLevel enums
find src -name "*.ts" -exec sed -i '' "s/'low'/'LOW'/g" {} \;
find src -name "*.ts" -exec sed -i '' "s/'medium'/'MEDIUM'/g" {} \;
find src -name "*.ts" -exec sed -i '' "s/'high'/'HIGH'/g" {} \;
find src -name "*.ts" -exec sed -i '' "s/'critical'/'CRITICAL'/g" {} \;

echo "Enum fixes applied!"