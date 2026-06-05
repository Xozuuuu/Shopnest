-- =============================================
-- SHOPNEST — Seed Data (dữ liệu mẫu)
-- Run: psql -U postgres -d shopnest -f seed.sql
-- =============================================

-- ── Categories ──────────────────────────────
INSERT INTO categories (name, slug, icon) VALUES
  ('Điện tử',     'dien-tu',     '📱'),
  ('Thời trang',  'thoi-trang',  '👗'),
  ('Gia dụng',    'gia-dung',    '🏠'),
  ('Sách',        'sach',        '📚'),
  ('Thể thao',    'the-thao',    '⚽'),
  ('Làm đẹp',     'lam-dep',     '💄'),
  ('Thực phẩm',   'thuc-pham',   '🍎')
ON CONFLICT (slug) DO NOTHING;

-- ── Admin User (password: admin123) ─────────
INSERT INTO users (name, email, password_hash, phone, address, role) VALUES
  ('Admin ShopNest', 'admin@shopnest.vn',
   '$2a$10$bcZ0lrcoJKzFek2VdsTwCuq/L.0PltYSUMfdiStBHZSGOWm7bEDD6',
   '0901234567', 'TP. Hồ Chí Minh, Việt Nam', 'admin')
ON CONFLICT (email) DO NOTHING;

-- ── Test Users (password: 123456) ───────────
INSERT INTO users (name, email, password_hash, phone, address, role) VALUES
  ('Nguyễn Văn An', 'an@test.com',
   '$2a$10$8beJbtjMYn7uIgv3A1xb2ekTeJuFGIZLXhm6N8uipXBODxMpUQI2q',
   '0912345678', '123 Nguyễn Huệ, Q.1, TP.HCM', 'user'),
  ('Trần Thị Bích', 'bich@test.com',
   '$2a$10$8beJbtjMYn7uIgv3A1xb2ekTeJuFGIZLXhm6N8uipXBODxMpUQI2q',
   '0923456789', '456 Lê Lợi, Q.3, TP.HCM', 'user')
ON CONFLICT (email) DO NOTHING;

-- ── Products ────────────────────────────────
INSERT INTO products (name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock) VALUES
  ('iPhone 15 Pro Max 256GB',     29990000, 33990000, 1, '📱', '#E8F4FD',
   'iPhone 15 Pro Max — chip A17 Pro mạnh mẽ, camera 48MP, pin trọn ngày. Sản phẩm chính hãng Apple.', 4.8, 1243, 50),
  
  ('Samsung Galaxy S24 Ultra',    24990000, 27990000, 1, '📱', '#EDE7F6',
   'Samsung Galaxy S24 Ultra — Galaxy AI, camera 200MP, bút S Pen tích hợp. Flagship Android đỉnh cao.', 4.7, 987, 35),
  
  ('Áo thun nam Polo Premium',    299000,   450000,   2, '👕', '#FEF9EF',
   'Áo thun Polo Premium — chất liệu cotton 100%, thoáng mát, phù hợp mọi phong cách.', 4.5, 3421, 200),
  
  ('Tai nghe Sony WH-1000XM5',   6990000,  8990000,  1, '🎧', '#FFF0F0',
   'Sony WH-1000XM5 — chống ồn hàng đầu thế giới, âm thanh Hi-Res, pin 30 giờ.', 4.9, 1543, 80),
  
  ('Nồi cơm điện Panasonic 1.8L', 890000,  1200000,  3, '🍚', '#FFF3E0',
   'Nồi cơm điện Panasonic 1.8L — công nghệ nấu Fuzzy Logic, giữ ấm 24h, bền bỉ.', 4.9, 756, 120),
  
  ('Bộ sách Đắc Nhân Tâm (Combo)', 85000,  120000,   4, '📖', '#F3E5F5',
   'Combo sách Đắc Nhân Tâm — Dale Carnegie. Sách self-help kinh điển, bản dịch mới nhất.', 4.8, 5632, 500),
  
  ('Giày thể thao Nike Air Max',  1890000, 2500000,  5, '👟', '#E8F5E9',
   'Nike Air Max — đệm khí Air Max, phong cách thể thao năng động, chính hãng Nike.', 4.7, 1876, 90),
  
  ('Kem dưỡng da Innisfree 50ml', 220000,  320000,   6, '🧴', '#FCE4EC',
   'Innisfree Green Tea Seed Cream — dưỡng ẩm sâu, chiết xuất trà xanh Jeju, da mịn màng.', 4.6, 4231, 300),
  
  ('Laptop Asus VivoBook 15 2024', 13990000, 16990000, 1, '💻', '#E3F2FD',
   'Asus VivoBook 15 2024 — Intel Core i5, 16GB RAM, 512GB SSD, màn hình FHD 15.6 inch.', 4.5, 432, 25),
  
  ('Quần jean nữ Skinny Hàn Quốc', 389000,  520000,  2, '👖', '#E0F7FA',
   'Quần jean nữ Skinny — phong cách Hàn Quốc, co giãn tốt, form chuẩn, nhiều size.', 4.6, 2108, 150),
  
  ('Máy xay sinh tố Philips 750W', 1290000, 1890000,  3, '🫙', '#F1F8E9',
   'Philips HR2221 750W — xay mịn nhanh, cối thủy tinh 2L, an toàn, bảo hành 2 năm.', 4.7, 654, 60),
  
  ('Váy hoa nữ Hàn Quốc Summer',  459000,  650000,   2, '👗', '#FCEEF8',
   'Váy hoa phong cách Hàn Quốc — chất vải mềm mại, thoáng mát mùa hè, dáng xòe nhẹ nhàng.', 4.5, 1876, 100);

-- ── Sample Reviews ──────────────────────────
INSERT INTO reviews (user_id, product_id, rating, text) VALUES
  (2, 1, 5, 'Sản phẩm rất tốt, đúng mô tả. Giao hàng nhanh, đóng gói cẩn thận. Rất hài lòng!'),
  (3, 1, 4, 'Chất lượng ổn so với giá tiền. Ship nhanh, hàng nguyên seal. Sẽ ủng hộ shop lần sau.'),
  (2, 1, 5, 'Mua lần thứ 2 rồi. Sản phẩm chính hãng, giá tốt hơn nhiều nơi khác. Recommend!'),
  (3, 1, 4, 'Hàng đẹp, màu sắc đúng hình. Chỉ hơi lâu giao hàng nhưng chấp nhận được.'),
  (2, 2, 5, 'Galaxy S24 Ultra quá đỉnh! Camera zoom 100x cực nét, Galaxy AI rất hữu ích.'),
  (3, 3, 4, 'Áo đẹp, chất vải mềm mại. Size hơi rộng một chút so với bảng size.'),
  (2, 4, 5, 'Chống ồn xuất sắc! Âm thanh rõ ràng, bass mạnh. Pin dùng cả tuần.'),
  (3, 6, 5, 'Sách hay, nội dung bổ ích. In ấn đẹp, giấy tốt. Nên đọc ít nhất 1 lần.');

-- ── Sample Orders ───────────────────────────
INSERT INTO orders (user_id, name, phone, address, note, payment_method, subtotal, shipping, total, status, created_at) VALUES
  (2, 'Nguyễn Văn An', '0912345678', '123 Nguyễn Huệ, Q.1, TP.HCM', 'Giao giờ hành chính', 'cod',
   36980000, 0, 36980000, 'pending', NOW() - INTERVAL '1 day'),
  (3, 'Trần Thị Bích', '0923456789', '456 Lê Lợi, Q.3, TP.HCM', '', 'bank',
   6990000, 0, 6990000, 'confirmed', NOW() - INTERVAL '1 day'),
  (2, 'Nguyễn Văn An', '0912345678', '123 Nguyễn Huệ, Q.1, TP.HCM', '', 'ewallet',
   598000, 0, 598000, 'shipping', NOW() - INTERVAL '2 days'),
  (3, 'Trần Thị Bích', '0923456789', '456 Lê Lợi, Q.3, TP.HCM', 'Giao tận tay', 'cod',
   29990000, 0, 29990000, 'delivered', NOW() - INTERVAL '2 days'),
  (2, 'Nguyễn Văn An', '0912345678', '123 Nguyễn Huệ, Q.1, TP.HCM', '', 'cod',
   1290000, 0, 1290000, 'pending', NOW() - INTERVAL '3 days');

-- ── Order Items ─────────────────────────────
INSERT INTO order_items (order_id, product_id, product_name, product_icon, product_bg, price, quantity) VALUES
  (1, 1, 'iPhone 15 Pro Max 256GB', '📱', '#E8F4FD', 29990000, 1),
  (1, 4, 'Tai nghe Sony WH-1000XM5', '🎧', '#FFF0F0', 6990000, 1),
  (2, 4, 'Tai nghe Sony WH-1000XM5', '🎧', '#FFF0F0', 6990000, 1),
  (3, 3, 'Áo thun nam Polo Premium', '👕', '#FEF9EF', 299000, 2),
  (4, 1, 'iPhone 15 Pro Max 256GB', '📱', '#E8F4FD', 29990000, 1),
  (5, 11, 'Máy xay sinh tố Philips 750W', '🫙', '#F1F8E9', 1290000, 1);
