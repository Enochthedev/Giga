-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE INDEX "order_items_vendorOrderId_idx" ON "order_items"("vendorOrderId");

-- CreateIndex
CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");

-- CreateIndex
CREATE INDEX "order_items_createdAt_idx" ON "order_items"("createdAt");

-- CreateIndex
CREATE INDEX "order_items_productId_createdAt_idx" ON "order_items"("productId", "createdAt");

-- CreateIndex
CREATE INDEX "order_items_orderId_productId_idx" ON "order_items"("orderId", "productId");

-- CreateIndex
CREATE INDEX "order_items_vendorOrderId_productId_idx" ON "order_items"("vendorOrderId", "productId");

-- CreateIndex
CREATE INDEX "orders_updatedAt_idx" ON "orders"("updatedAt");

-- CreateIndex
CREATE INDEX "orders_paymentStatus_idx" ON "orders"("paymentStatus");

-- CreateIndex
CREATE INDEX "orders_customerId_status_idx" ON "orders"("customerId", "status");

-- CreateIndex
CREATE INDEX "orders_customerId_createdAt_idx" ON "orders"("customerId", "createdAt");

-- CreateIndex
CREATE INDEX "orders_status_createdAt_idx" ON "orders"("status", "createdAt");

-- CreateIndex
CREATE INDEX "orders_customerId_status_createdAt_idx" ON "orders"("customerId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "orders_paymentStatus_status_idx" ON "orders"("paymentStatus", "status");

-- CreateIndex
CREATE INDEX "product_inventory_quantity_idx" ON "product_inventory"("quantity");

-- CreateIndex
CREATE INDEX "product_inventory_lowStockThreshold_idx" ON "product_inventory"("lowStockThreshold");

-- CreateIndex
CREATE INDEX "product_inventory_trackQuantity_idx" ON "product_inventory"("trackQuantity");

-- CreateIndex
CREATE INDEX "product_inventory_updatedAt_idx" ON "product_inventory"("updatedAt");

-- CreateIndex
CREATE INDEX "product_inventory_trackQuantity_quantity_idx" ON "product_inventory"("trackQuantity", "quantity");

-- CreateIndex
CREATE INDEX "product_inventory_quantity_lowStockThreshold_idx" ON "product_inventory"("quantity", "lowStockThreshold");

-- CreateIndex
CREATE INDEX "products_createdAt_idx" ON "products"("createdAt");

-- CreateIndex
CREATE INDEX "products_updatedAt_idx" ON "products"("updatedAt");

-- CreateIndex
CREATE INDEX "products_isActive_category_idx" ON "products"("isActive", "category");

-- CreateIndex
CREATE INDEX "products_isActive_vendorId_idx" ON "products"("isActive", "vendorId");

-- CreateIndex
CREATE INDEX "products_isActive_price_idx" ON "products"("isActive", "price");

-- CreateIndex
CREATE INDEX "products_isActive_rating_idx" ON "products"("isActive", "rating");

-- CreateIndex
CREATE INDEX "products_category_subcategory_idx" ON "products"("category", "subcategory");

-- CreateIndex
CREATE INDEX "products_category_brand_idx" ON "products"("category", "brand");

-- CreateIndex
CREATE INDEX "products_vendorId_isActive_createdAt_idx" ON "products"("vendorId", "isActive", "createdAt");

-- CreateIndex
CREATE INDEX "products_isActive_category_price_idx" ON "products"("isActive", "category", "price");

-- CreateIndex
CREATE INDEX "products_isActive_rating_createdAt_idx" ON "products"("isActive", "rating", "createdAt");

-- CreateIndex
CREATE INDEX "products_name_idx" ON "products"("name");

-- CreateIndex
CREATE INDEX "products_brand_idx" ON "products"("brand");

-- CreateIndex
CREATE INDEX "vendor_analytics_period_idx" ON "vendor_analytics"("period");

-- CreateIndex
CREATE INDEX "vendor_analytics_createdAt_idx" ON "vendor_analytics"("createdAt");

-- CreateIndex
CREATE INDEX "vendor_analytics_vendorId_period_idx" ON "vendor_analytics"("vendorId", "period");

-- CreateIndex
CREATE INDEX "vendor_analytics_vendorId_date_idx" ON "vendor_analytics"("vendorId", "date");

-- CreateIndex
CREATE INDEX "vendor_analytics_vendorId_period_date_idx" ON "vendor_analytics"("vendorId", "period", "date");

-- CreateIndex
CREATE INDEX "vendor_analytics_period_date_idx" ON "vendor_analytics"("period", "date");

-- CreateIndex
CREATE INDEX "vendor_orders_createdAt_idx" ON "vendor_orders"("createdAt");

-- CreateIndex
CREATE INDEX "vendor_orders_updatedAt_idx" ON "vendor_orders"("updatedAt");

-- CreateIndex
CREATE INDEX "vendor_orders_vendorId_status_idx" ON "vendor_orders"("vendorId", "status");

-- CreateIndex
CREATE INDEX "vendor_orders_vendorId_createdAt_idx" ON "vendor_orders"("vendorId", "createdAt");

-- CreateIndex
CREATE INDEX "vendor_orders_vendorId_status_createdAt_idx" ON "vendor_orders"("vendorId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "vendor_orders_status_createdAt_idx" ON "vendor_orders"("status", "createdAt");

-- CreateIndex
CREATE INDEX "vendor_orders_orderId_vendorId_idx" ON "vendor_orders"("orderId", "vendorId");
