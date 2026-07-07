-- Run this once to create the database tables
CREATE DATABASE IF NOT EXISTS dressshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dressshop;

CREATE TABLE IF NOT EXISTS customers (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  phone       VARCHAR(20)  NOT NULL,
  password    VARCHAR(255) NOT NULL,
  address     TEXT,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(255)   NOT NULL,
  price           DECIMAL(10,2)  NOT NULL,
  image_url       TEXT,
  category        VARCHAR(100)   NOT NULL,
  in_stock        TINYINT(1)     NOT NULL DEFAULT 1,
  active          TINYINT(1)     NOT NULL DEFAULT 1,
  stock_quantity  INT,
  is_new_arrival  TINYINT(1)     NOT NULL DEFAULT 0,
  description     TEXT,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  customer_id      INT NOT NULL,
  total_amount     DECIMAL(10,2) NOT NULL,
  delivery_address TEXT NOT NULL,
  status           ENUM('PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  order_id      INT NOT NULL,
  product_id    INT NOT NULL,
  product_name  VARCHAR(255) NOT NULL,
  price         DECIMAL(10,2) NOT NULL,
  quantity      INT NOT NULL,
  image_url     TEXT,
  size          VARCHAR(20),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
