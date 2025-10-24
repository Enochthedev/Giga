/*
  Warnings:

  - A unique constraint covering the columns `[orderNumber]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderNumber` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- Step 1: Add the column as nullable first
ALTER TABLE "orders" ADD COLUMN "orderNumber" TEXT;

-- Step 2: Generate order numbers for existing orders using a simpler approach
-- Format: ORD-YYYYMMDD-XXXX where XXXX is based on the order ID
UPDATE "orders"
SET "orderNumber" = CONCAT(
  'ORD-',
  TO_CHAR("createdAt", 'YYYYMMDD'),
  '-',
  LPAD(SUBSTRING(id FROM 1 FOR 4), 4, '0')
)
WHERE "orderNumber" IS NULL;

-- Step 3: Make the column NOT NULL
ALTER TABLE "orders" ALTER COLUMN "orderNumber" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_orderNumber_idx" ON "orders"("orderNumber");
