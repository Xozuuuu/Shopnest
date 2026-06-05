-- =============================================
-- SHOPNEST — Database Schema (PostgreSQL)
-- Run: psql -U postgres -d shopnest -f schema.sql
-- =============================================

-- ── Users ───────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  phone         VARCHAR(20)   DEFAULT '',
  address       TEXT          DEFAULT '',
  role          VARCHAR(20)   DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_blocked    BOOLEAN       DEFAULT FALSE,
  created_at    TIMESTAMP     DEFAULT NOW()
);

-- ── Categories ──────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  slug       VARCHAR(100) NOT NULL UNIQUE,
  icon       VARCHAR(10)  DEFAULT '📦'
);

-- ── Products ────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(255)  NOT NULL,
  price          BIGINT        NOT NULL,
  original_price BIGINT        NOT NULL,
  category_id    INTEGER       REFERENCES categories(id) ON DELETE SET NULL,
  icon           VARCHAR(10)   DEFAULT '📦',
  bg_color       VARCHAR(20)   DEFAULT '#F5F5F5',
  description    TEXT          DEFAULT '',
  rating         DECIMAL(2,1)  DEFAULT 0,
  sold           INTEGER       DEFAULT 0,
  stock          INTEGER       DEFAULT 100,
  image_url      TEXT          DEFAULT '',
  created_at     TIMESTAMP     DEFAULT NOW()
);

-- ── Cart Items ──────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ── Orders ──────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name            VARCHAR(100) NOT NULL,
  phone           VARCHAR(20)  NOT NULL,
  address         TEXT         NOT NULL,
  note            TEXT         DEFAULT '',
  payment_method  VARCHAR(50)  DEFAULT 'cod',
  subtotal        BIGINT       NOT NULL,
  shipping        BIGINT       NOT NULL DEFAULT 0,
  total           BIGINT       NOT NULL,
  status          VARCHAR(20)  DEFAULT 'pending' 
                  CHECK (status IN ('pending','confirmed','shipping','delivered','cancelled')),
  created_at      TIMESTAMP    DEFAULT NOW()
);

-- ── Order Items ─────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id            SERIAL PRIMARY KEY,
  order_id      INTEGER      NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    INTEGER      REFERENCES products(id) ON DELETE SET NULL,
  product_name  VARCHAR(255) NOT NULL,
  product_icon  VARCHAR(10)  DEFAULT '📦',
  product_bg    VARCHAR(20)  DEFAULT '#F5F5F5',
  price         BIGINT       NOT NULL,
  quantity      INTEGER      NOT NULL DEFAULT 1
);

-- ── Reviews ─────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text        TEXT    DEFAULT '',
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ── Indexes ─────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_category   ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_name       ON products USING gin(to_tsvector('simple', name));
CREATE INDEX IF NOT EXISTS idx_cart_user           ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user         ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status       ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order   ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product     ON reviews(product_id);
