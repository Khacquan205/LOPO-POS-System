-- =============================================
-- LOPO POS System - Database Schema (9 bảng)
-- MongoDB/Mongoose - ERD Reference
-- Updated: 2026-03-08
-- =============================================

-- =============================================
-- 1. USERS - Tài khoản đăng nhập
-- =============================================
CREATE TABLE `Users` (
  `user_id` varchar(24),
  `store_id` varchar(24),
  `phone_number` varchar(20),
  `full_name` varchar(255),
  `password` varchar(255),
  `role` varchar(20),
  `status` varchar(20),
  `created_at` datetime,
  `updated_at` datetime,
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (`store_id`)
      REFERENCES `Stores`(`store_id`),
  KEY `AK` (`phone_number`),
  KEY `owner/staff` (`role`),
  KEY `active/inactive/blocked` (`status`)
);

-- =============================================
-- 2. STORES - Cửa hàng
-- =============================================
CREATE TABLE `Stores` (
  `store_id` varchar(24),
  `owner_id` varchar(24),
  `name` varchar(255),
  `phone` varchar(20),
  `is_active` tinyint,
  `created_at` datetime,
  `updated_at` datetime,
  PRIMARY KEY (`store_id`),
  FOREIGN KEY (`owner_id`)
      REFERENCES `Users`(`user_id`)
);

-- =============================================
-- 3. REFRESH_TOKENS - Phiên đăng nhập
-- =============================================
CREATE TABLE `Refresh_Tokens` (
  `refresh_token_id` varchar(24),
  `user_id` varchar(24),
  `token` varchar(255),
  `created_at` datetime,
  `updated_at` datetime,
  PRIMARY KEY (`refresh_token_id`),
  FOREIGN KEY (`user_id`)
      REFERENCES `Users`(`user_id`),
  KEY `AK` (`token`)
);

-- =============================================
-- 4. CATEGORIES - Nhóm sản phẩm
-- =============================================
CREATE TABLE `Categories` (
  `category_id` varchar(24),
  `store_id` varchar(24),
  `name` varchar(255),
  `is_active` tinyint,
  `sort_order` int,
  PRIMARY KEY (`category_id`),
  FOREIGN KEY (`store_id`)
      REFERENCES `Stores`(`store_id`)
);

-- =============================================
-- 5. PRODUCTS - Sản phẩm
-- =============================================
CREATE TABLE `Products` (
  `product_id` varchar(24),
  `store_id` varchar(24),
  `category_id` varchar(24),
  `name` varchar(255),
  `sku` varchar(50),
  `barcode` varchar(50),
  `price` decimal,
  `cost_price` decimal,
  `image_url` varchar(500),
  `track_inventory` tinyint,
  `is_active` tinyint,
  PRIMARY KEY (`product_id`),
  FOREIGN KEY (`store_id`)
      REFERENCES `Stores`(`store_id`),
  FOREIGN KEY (`category_id`)
      REFERENCES `Categories`(`category_id`),
  KEY `AK` (`sku`, `barcode`)
);

-- =============================================
-- 6. INVENTORY_STOCKS - Tồn kho
-- =============================================
CREATE TABLE `Inventory_Stocks` (
  `stock_id` varchar(24),
  `store_id` varchar(24),
  `product_id` varchar(24),
  `on_hand` int,
  PRIMARY KEY (`stock_id`),
  FOREIGN KEY (`store_id`)
      REFERENCES `Stores`(`store_id`),
  FOREIGN KEY (`product_id`)
      REFERENCES `Products`(`product_id`)
);

-- =============================================
-- 7. ORDERS - Đơn hàng
-- =============================================
CREATE TABLE `Orders` (
  `order_id` varchar(24),
  `store_id` varchar(24),
  `order_code` varchar(50),
  `cashier_user_id` varchar(24),
  `status` varchar(20),
  `grand_total` decimal,
  `note` text(65535),
  `completed_at` datetime,
  `cancelled_at` datetime,
  `created_at` datetime,
  `updated_at` datetime,
  PRIMARY KEY (`order_id`),
  FOREIGN KEY (`store_id`)
      REFERENCES `Stores`(`store_id`),
  FOREIGN KEY (`cashier_user_id`)
      REFERENCES `Users`(`user_id`),
  KEY `AK` (`order_code`),
  KEY `draft/completed/cancelled` (`status`)
);

-- =============================================
-- 8. ORDER_ITEMS - Chi tiết đơn hàng
-- =============================================
CREATE TABLE `Order_Items` (
  `order_item_id` varchar(24),
  `order_id` varchar(24),
  `product_id` varchar(24),
  `product_name_snapshot` varchar(255),
  `barcode_snapshot` varchar(50),
  `unit_price` decimal,
  `quantity` int,
  `line_total` decimal,
  `created_at` datetime,
  PRIMARY KEY (`order_item_id`),
  FOREIGN KEY (`order_id`)
      REFERENCES `Orders`(`order_id`),
  FOREIGN KEY (`product_id`)
      REFERENCES `Products`(`product_id`)
);

-- =============================================
-- 9. PAYMENTS - Thanh toán
-- =============================================
CREATE TABLE `Payments` (
  `payment_id` varchar(24),
  `order_id` varchar(24),
  `method` varchar(20),
  `amount` decimal,
  `status` varchar(20),
  `transaction_ref` varchar(255),
  `paid_at` datetime,
  `created_at` datetime,
  `updated_at` datetime,
  PRIMARY KEY (`payment_id`),
  FOREIGN KEY (`order_id`)
      REFERENCES `Orders`(`order_id`),
  KEY `cash/bank_transfer` (`method`),
  KEY `pending/paid/failed` (`status`),
  KEY `AK` (`transaction_ref`)
);

-- =============================================
-- QUAN HỆ DỮ LIỆU:
-- Users.store_id        → Stores.store_id     (staff thuộc store nào)
-- Stores.owner_id       → Users.user_id       (store do ai sở hữu)
-- Refresh_Tokens.user_id → Users.user_id
-- Categories.store_id   → Stores.store_id
-- Products.store_id     → Stores.store_id
-- Products.category_id  → Categories.category_id
-- Inventory_Stocks.store_id   → Stores.store_id
-- Inventory_Stocks.product_id → Products.product_id
-- Orders.store_id       → Stores.store_id
-- Orders.cashier_user_id → Users.user_id
-- Order_Items.order_id  → Orders.order_id
-- Order_Items.product_id → Products.product_id
-- Payments.order_id     → Orders.order_id
-- =============================================

-- =============================================
-- ENUM CHUẨN:
-- user.role:       owner | staff
-- user.status:     active | inactive | blocked
-- order.status:    draft | completed | cancelled
-- payment.method:  cash | bank_transfer | vietqr | ewallet
-- payment.status:  pending | paid | failed | refunded
-- =============================================
