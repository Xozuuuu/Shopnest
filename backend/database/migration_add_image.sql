-- =============================================
-- SHOPNEST — Migration: Add image_url to products
-- Run: psql -U postgres -d shopnest -f migration_add_image.sql
-- =============================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';
