-- =============================================
-- SHOPNEST — Render Import Script
-- Xóa data cũ (seed) và import data thật từ local
-- =============================================

-- Thêm cột product_image nếu chưa có
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_image TEXT DEFAULT '';

-- Xóa data cũ (theo thứ tự FK constraints)
DELETE FROM reviews;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM cart_items;
DELETE FROM products;
DELETE FROM users;
DELETE FROM categories;


--
-- PostgreSQL database dump
--



-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13












--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.categories (id, name, slug, icon) VALUES (1, 'Điện tử', 'dien-tu', '📱');
INSERT INTO public.categories (id, name, slug, icon) VALUES (3, 'Gia dụng', 'gia-dung', '🏠');
INSERT INTO public.categories (id, name, slug, icon) VALUES (4, 'Sách', 'sach', '📚');
INSERT INTO public.categories (id, name, slug, icon) VALUES (5, 'Thể thao', 'the-thao', '⚽');
INSERT INTO public.categories (id, name, slug, icon) VALUES (6, 'Làm đẹp', 'lam-dep', '💄');
INSERT INTO public.categories (id, name, slug, icon) VALUES (7, 'Thực phẩm', 'thuc-pham', '🍎');


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (19, 'Ấm siêu tốc Philips HD9303', 485000, 350000, 3, '📦', '#E8F4FD', 'Ấm siêu tốc Philips HD9303 (dung tích 1.2L, công suất 1800W) là lựa chọn hoàn hảo cho nhu cầu cá nhân hoặc gia đình nhỏ từ 2-4 người. Nổi bật với thiết kế nhỏ gọn, thân bình làm bằng Inox SUS 304 cao cấp an toàn cho sức khỏe, thiết bị đun sôi nước nhanh chóng chỉ trong 5-7 phút', 0.0, 0, 35, '2026-06-15 10:37:03.196611', '/uploads/product_1781494552978_435.jpg');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (16, 'Xiaomi 17 Pro Max', 22500000, 25450000, 1, '📦', '#E8F4FD', 'Xiaomi 17 Pro Max là mẫu smartphone đầu bảng, nổi bật nhờ công nghệ chống nhìn trộm Privacy Display và hiệu năng vượt trội từ Snapdragon 8 Elite Gen 5 for Galaxy. Máy sở hữu camera zoom 200MP đỉnh cao, sạc nhanh 60W cùng bút S Pen tích hợp, mang đến trải nghiệm toàn diện cho công việc và giải trí.', 0.0, 0, 100, '2026-06-09 23:58:22.021146', '/uploads/product_1781024268665_419.png');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (20, 'Nồi chiên không dầu Philips 6.2 lít NA130/00', 1420000, 1350000, 3, '📦', '#E8F4FD', 'Nồi chiên không dầu Philips NA130/00 có dung tích lớn 6.2 lít cùng công suất 1700W mạnh mẽ, điều khiển đơn giản bằng nút xoay với 2 chức năng chính: chiên, nướng không dầu.', 0.0, 0, 100, '2026-06-15 10:38:25.173292', '/uploads/product_1781494644519_278.webp');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (13, 'Iphone 15 - 128 GB', 13500000, 14999999, 1, '📦', '#E8F4FD', 'iPhone 15 sở hữu thiết kế mặt lưng kính pha màu cùng khung viền nhôm bo cong mềm mại. Máy được trang bị màn hình Super Retina XDR 6.1 inch có Dynamic Island, chip Apple A16 Bionic, camera chính 48MP sắc nét và chuyển sang sử dụng cổng sạc USB-C.', 4.4, 1, 20, '2026-06-09 23:39:00.046398', '/uploads/product_1781023074830_161.webp');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (21, 'Máy pha cà phê Bosch TKA3M133', 2200000, 1850000, 3, '📦', '#E8F4FD', 'Máy pha cà phê Bosch TKA3M133 là mẫu máy pha cà phê nhỏ giọt điển hình dành cho những ai yêu thích sự gọn gàng và tinh tế trong không gian sống. Sở hữu kích thước chỉ 231 x 295 x 347 mm, chiếc máy này cực kỳ nhỏ gọn, dễ dàng bố trí tại nhiều vị trí như góc bếp, bàn ăn sáng, quầy pha cà phê nhỏ tại văn phòng hay khu vực tiếp khách mà không hề chiếm diện tích đáng kể. Đây là lựa chọn lý tưởng cho các không gian vừa và nhỏ, nơi mà tính tối giản và tiện lợi luôn được ưu tiên hàng đầu', 0.0, 0, 100, '2026-06-15 10:39:07.708563', '/uploads/product_1781494720536_963.webp');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (22, 'Bàn Ủi Hơi Nước Philips DST3040/70', 1100000, 900000, 3, '📦', '#E8F4FD', 'Bàn ủi hơi nước Philips DST3040/70 sở hữu thiết kế đầu mũi nhọn, dễ dàng di chuyển vào các rãnh nút cho hiệu quả chính xác gấp 3 lần, cho phép bạn ủi đến những chỗ khó nhất, ví dụ như quanh nút áo hoặc giữa các nếp ly. Đồng thời, phần mặt đế bằng gốm giúp trượt êm ái trên mọi bề mặt vải, cộng thêm bề mặt chống dính, chống xước và dễ lau sạch.', 0.0, 0, 100, '2026-06-15 10:39:41.842437', '/uploads/product_1781494754266_125.webp');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (23, 'Sự Im Lặng Của Bầy Cừu (Tái Bản 2019)', 150000, 105000, 4, '📦', '#E8F4FD', 'Sự im lặng của bầy cừu hội tụ đầy đủ những yếu tố làm nên một cuốn tiểu thuyết trinh thám kinh dị xuất sắc nhất: không một dấu vết lúng túng trong những chi tiết thuộc lĩnh vực chuyên môn, với các tình tiết giật gân, cái chết luôn lơ lửng, với cuộc so găng của những bộ óc lớn mà không có chỗ cho kẻ ngu ngốc để cuộc chơi trí tuệ trở nên dễ dàng', 0.0, 0, 100, '2026-06-15 10:40:54.63063', '/uploads/product_1781494827685_357.jpg');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (24, 'Làm Chủ Tuổi 20', 130000, 100000, 4, '📦', '#E8F4FD', 'Làm chủ tuổi 20 được viết lại dựa trên những trải nghiệm trong cuộc sống của tác giả Dương Duy Bách – một người sớm tự lập và đạt được nhiều thành công ở tuổi 20. Ngoài câu chuyện của chính mình, tác giả còn ghi lại những bài học mà anh học được từ những người trẻ thành công khác và phân tích lý do khách quan khiến họ đạt được mục tiêu khi tuổi đời còn rất trẻ.', 0.0, 0, 100, '2026-06-15 10:41:21.461966', '/uploads/product_1781494858526_604.jpg');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (15, 'Samsung Galaxy S26 Ultra', 25550000, 29550000, 1, '📦', '#E8F4FD', 'Samsung Galaxy S26 Ultra là mẫu smartphone đầu bảng, nổi bật nhờ công nghệ chống nhìn trộm Privacy Display và hiệu năng vượt trội từ Snapdragon 8 Elite Gen 5 for Galaxy. Máy sở hữu camera zoom 200MP đỉnh cao, sạc nhanh 60W cùng bút S Pen tích hợp, mang đến trải nghiệm toàn diện cho công việc và giải trí.', 0.0, 1, 100, '2026-06-09 23:57:44.147743', '/uploads/product_1781024209703_31.png');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (17, 'Set Áo Buộc Nơ Cổ Tàu Kèm Quần Short KaKi Ông Rộng Trẻ Siêu Xinh Phong Cách Hàn Quốc', 200000, 150000, NULL, '👗', '#E8F4FD', '- Chất liệu áo đũi sần kèm quần kaki
- Sản phẩm 100% giống mô tả. Hình ảnh sản phẩm là ảnh thật do shop tự chụp và giữ bản quyền hình ảnh
- Xuất xứ:
- Bạn cũng có thể trả lại hàng nếu không thích mua nữa, shop cam kết hoàn 100% tiền sản phẩm cho bạn. 
- Hàng có sẵn nên thời gian giao hàng sẽ là tối ưu nhất
-Do màn hình và điều kiện ánh sáng khác nhau, màu sắc thực tế của sản phẩm có thể chênh lệch khoảng 3-5%', 0.0, 3, 50, '2026-06-15 10:33:11.884266', '/uploads/product_1781494315158_704.webp');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (25, 'Luật Tâm Thức – Vũ Trụ Nhất Nguyên Luận – Phần 2', 220000, 300000, 4, '📦', '#E8F4FD', 'Hãy hiểu luật tâm thức để thực sự thức tỉnh trong “thời đại tỉnh thức”.

Con người, dù là theo phái duy vật hay duy tâm, ăn chay hay ăn mặn, có tìm hiểu tâm linh hay không,… thì điều cuối cùng chúng ta hướng đến vẫn giống nhau – hạnh phúc, viên mãn, không đói khổ. Vậy nên có thể nói cuộc sống là một cuộc truy cầu hạnh phúc. Nhưng không phải ai cũng có một hành trình thuận lợi, có thể đến đích an toàn, thậm chí rất nhiều người đã gục ngã thê thảm, vì đa phần không vượt qua được những trở ngại tâm thức, cũng là bài học lớn nhất trong cuộc đời.

Tiếp nối những kiến thức từ cuốn sách đầu tiên, tác giả Ngô Sa Thạch mang đến “Luật Tâm Thức – Vũ trụ nhất nguyên luận”, bản nâng cấp với nhiều kiến giải sâu sắc hơn về quy luật vũ trụ và số mệnh con người:', 0.0, 0, 100, '2026-06-15 10:43:10.192836', '/uploads/product_1781494886933_848.jpg');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (26, 'Trụ bóng rổ gia đình BS 810 có thể điều chỉnh độ cao', 1850000, 1500000, 5, '📦', '#E8F4FD', 'Chiều cao trụ bóng rổ: Điều chỉnh được từ 1.6 m đến 2,1m.
Trụ bóng rổ có bánh xe di chuyển.
Đối trọng trụ là đối trọng rời (Bạn có thể để bao cát, cục bê tông … đè lên để làm đối trọng cho trụ).
Trụ bóng rổ gia đình, trường học được làm từ sắt vuông 40 x 40 mm, được thiết kế chắc chắn và sơn tĩnh điện bền đẹp, chống han gỉ.
Sản phẩm được thiết kế chắc chắn nhưng nhỏ gọn, di chuyển dễ dàng.
Trụ bóng rổ gia đình BS 810 được dùng trong tập luyện ở các trường hoặc chơi bóng rổ tại nhà.
Bảng rổ làm bằng nhựa cao cấp, chịu lực tốt và được thiết kế hình quạt.', 0.0, 0, 50, '2026-06-15 10:44:27.393624', '/uploads/product_1781495033481_112.webp');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (27, 'All Court 3.0 Ball', 700000, 500000, 5, '📦', '#E8F4FD', '100% polyurethane
Indoor/outdoor use
Durable cover
Durable rubber bladder
adidas Badge of Sport print', 0.0, 0, 100, '2026-06-15 10:45:16.484488', '/uploads/product_1781495077887_88.webp');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (28, 'Ba lô Adidas Black NS', 780000, 400000, 5, '📦', '#E8F4FD', 'Kích thước: 19 cm x 30 cm x 46 cm
Dung tích: 24 L
Vải ripstop làm từ 100% polyester tái chế
Các quai đeo vai tùy chỉnh và đai ngang ngực
AEROREADY
Các ngăn khóa kéo phía trước và phía trên', 0.0, 0, 100, '2026-06-15 10:46:42.348484', '/uploads/product_1781495133649_891.webp');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (29, 'Nike Air Zoom Mercurial Vapor 16 Pro TF - Xanh Dương/Bạc - FQ8687-446', 2700000, 2500000, 5, '📦', '#E8F4FD', 'Nike Mercurial Vapor 16 Pro TF - Giày đá bóng cỏ nhân tạo
Phiên bản cao cấp thuộc thế hệ mới nhất của dòng Mercurial Vapor
Chất liệu Flyknit cải tiến giúp giảm độ dày 30%, làm giày nhẹ và dễ uốn hơn
Tích hợp công nghệ Nike Zoom Air hỗ trợ tối đa cho việc phản hồi lực và tăng tốc.
Hệ thống đinh dăm kiểu mới giúp bám sân tốt hơn và vô cùng bền bỉ', 0.0, 0, 100, '2026-06-15 10:47:08.585601', '/uploads/product_1781495206376_405.webp');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (30, 'Máy Rửa Mặt Havatek Sóng Siêu Âm & Liệu Pháp Ánh Sáng Màu Xanh', 730000, 500000, 6, '📦', '#E8F4FD', 'Máy Rửa Mặt Havatek Cho Da Nhạy Cảm Ultrasonic Facial Cleansing Brush là thiết bị chăm sóc da cao cấp đến từ thương hiệu Havatek - Việt Nam, ứng dụng công nghệ Ultrasonic đầu tiên với tốc độ rung cao nhất 24.000 nhịp/phút và chuyển động đa chiều, giúp làm sạch sâu lỗ chân lông nhưng vẫn dịu nhẹ trên da. Kết hợp đèn LED 3 chế độ hỗ trợ chăm sóc và phục hồi da ngay khi rửa mặt. Với thiết kế nhỏ gọn, an toàn cho da nhạy cảm với cùng lông silicone đạt chuẩn FDA, chính sách bảo hành 2 năm 1 đổi 1, cam kết sản phẩm mới 100%.', 0.0, 0, 100, '2026-06-15 10:49:19.374005', '/uploads/product_1781495335592_448.webp');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (31, 'Máy massage mặt nóng lạnh công nghệ Nhật Bản Bimix BM10', 1360000, 1000000, 6, '📦', '#E8F4FD', 'Cho dù quy trình làm đẹp của bạn diễn ra trong vài phút hay lên đến nửa giờ, Máy massage mặt nóng lạnh Bimix BM10 chắc chắn là sự bổ sung hoàn hảo để bạn nâng cấp quy trình chăm sóc da hàng ngày của mình.', 0.0, 0, 100, '2026-06-15 10:49:42.570359', '/uploads/product_1781495363663_113.webp');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (32, 'Kem dưỡng làm đầy làn da mặt Valmont V-FIRM CREAM', 14840000, 15000000, 6, '📦', '#E8F4FD', 'Kem dưỡng làm đầy da mặt, tăng độ đàn hồi cho làn da

Kem dưỡng làm đầy da mặt V-FIRM Cream | Lý tưởng cho làn da bị chảy xệ, thiếu độ đàn hồi và căng mọng. Phù hợp cho mọi độ tuổi và mọi loại da, đặc biệt là da khô.

86% phụ nữ đã sử dụng cho biết sắc diện và đường nét khuôn mặt được cải thiện sau khi dùng sản phẩm.

**bao gồm sự thoải mái kén da và các thành phần tương thích sinh học, V-FIRM Cream củng cố hàng rào bảo vệ tự nhiên của da, giúp lấy lại mật độ da và đường nét khuôn mặt.', 0.0, 0, 100, '2026-06-15 10:51:35.527216', '/uploads/product_1781495470270_389.png');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (33, 'Combo 2 Kem chống nắng nâng tông cho da tối màu Sunplay Skin Aqua Tone Up UV Essence Lavender SPF 50+ PA++++ 50g', 337000, 250000, 6, '📦', '#E8F4FD', '"[VB] Combo 2 Kem chống nắng nâng tông cho da tối màu Sunplay Skin Aqua Tone Up UV Essence Lavender SPF 50+ PA++++ 50g



Tên model: Tinh chất chống nắng hiệu chỉnh sắc da Sunplay Skin Aqua Tone Up UV Essence SPF50+ PA++++ 50g - Lavender



Hiệu chỉnh màu da là một kỹ thuật trang điểm thú vị, được các nghệ sĩ trang điểm chuyên nghiệp sử dụng trong nhiều năm qua. Bằng việc áp dụng các màu sắc đối lập sẽ giúp trung hoà, hiệu chỉnh các nhược điểm trên gương mặt. Ứng dụng kỹ thuật này, Skin Aqua đã cho ra mắt dòng sản phảẩm Kem chống nắng nâng tông Skin Aqua Tone up UV mới; vừa chống nắng hàng ngày cho da mặt với chỉ số chống UV cao, vừa giúp nâng tông hiệu chỉnh sắc da như 1 sản phẩm kem lót trang điểm.', 0.0, 0, 40, '2026-06-15 10:52:16.046063', '/uploads/product_1781495507904_342.webp');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (34, 'Sữa ensure Vanille-Geschmack 400g', 425000, 350000, 7, '📦', '#E8F4FD', 'Sữa Ensure Vani 400g từ Đức, bổ sung 24 vitamin và khoáng chất, tăng cường sức khỏe toàn diện. Dành cho mọi lứa tuổi, hỗ trợ hệ miễn dịch, tiêu hóa, tim mạch. Hương vị thơm ngon, dễ uống.', 0.0, 0, 64, '2026-06-15 10:53:40.963593', '/uploads/product_1781495594467_722.webp');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (35, 'Sữa bột Nutifood GrowPLUS+ Suy Dinh Dưỡng (Đỏ) 1+ - Tăng Cân, Tăng Chiều Cao (Lon 1,65 Kg)', 650769, 458999, 7, '📦', '#E8F4FD', 'Nutifood GrowPLUS+ mới với công thức FDI(1) từ Viện nghiên cứu dinh dưỡng Nutifood Thụy Điển, nay tăng cường hàm lượng FOS(3) và gấp 4 lần HMO(3) xây dựng nền tảng “Đề Kháng khỏe, Tiêu Hóa tốt”, hỗ trợ hấp thu tốt các dưỡng chất. Bổ sung chất béo chuyển hóa nhanh MCT và Canxi, Kẽm, Lysin, Vitamin D3 hỗ trợ phát triển cân nặng và chiều cao cho trẻ. GrowPLUS+ với hàm lượng DHA, kết hợp cùng Cholin, Taurin giúp trẻ hoàn thiện và phát triển não bộ, tăng khả năng học hỏi, ghi nhớ. 
(1): Foundation Of Digestion & Immunity 
(2): Human Milk Oligosaccharide 
(3): So với TPDCCDADB GrowPLUS+ 2+ (Đỏ) cho trẻ suy dinh dưỡng, thấp còi', 0.0, 0, 100, '2026-06-15 10:54:18.502508', '/uploads/product_1781495624180_32.webp');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (36, 'Trà Đinh Tân Cương Tiến Vua 500gram', 2075600, 1500000, 7, '📦', '#E8F4FD', 'Trà tân cương nổi tiếng cả nước về hương vị thơm ngon, tiền chát hậu ngọt danh bất hư truyền nên từ lâu còn được gọi là đệ nhất danh trà. Tuy nhiên đứng đầu về hương vị thơm ngon nhất của trà tân cương thì đó chính là trà đinh tiến vua, hương vị thơm ngon của trà đinh tiến vua danh bất hư truyền và là quốc bảo tại Thái Nguyên
Nguyên liệu để làm ra trà đinh tiến vua Tân Cương cần tới 10kg nguyên liệu trà búp nõn được hái từ lúc sáng sớm khi lá trà còn đang ngậm sương, búp trà còn chưa hé ra trông như chiếc đinh nhỏ. Nên được gọi là trà đinh, cũng chính bởi sản lượng không cao, thu hái và chế biến cầu kì, sao trà thủ công và đánh hương bằng lấy lửa từ nhiên đặc biệt công phu đó đã cho ra đời một sản phẩm trà đinh tiến vua Tân Cương Xanh đặc biệt thơm ngon không có loại trà nào có thể sánh được', 0.0, 0, 35, '2026-06-15 10:54:49.089712', '/uploads/product_1781495661691_810.webp');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (37, 'Tổ Yến Tinh Chế Vip Pro', 2550000, 2000000, 7, '📦', '#E8F4FD', 'Tổ yến tinh chế vip pro sản phẩm được dùng cho vua cho ngày xưa thưởng thức có giá trị dinh dưỡng cao cho người gia trẻ em và phụ nữ mang thai.

Tổ yến tinh chế vip pro đã được xử lý làm sạch thủ công, sợi phồng, trắng.
Giữ nguyên được giá trị dinh dưỡng của yến.
Tiện lợi để sử dụng ngay, tiết kiệm thời gian và lượng hao hụt trong quá trình xử lý là rất ít.
Có các sản phẩm tặng đi kèm', 0.0, 0, 100, '2026-06-15 10:55:30.872104', '/uploads/product_1781495696876_821.webp');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (38, 'Cốc nước', 20000, 123123, 3, '📦', '#E8F4FD', '', 0.0, 0, -5, '2026-06-18 17:06:24.353602', '/uploads/product_1781776944024_53.png');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (14, 'Iphone 17 Pro Max', 30000000, 35990000, 1, '📦', '#E8F4FD', 'iPhone 17 Pro Max là mẫu smartphone cao cấp nhất của Apple, nổi bật với thiết kế nhôm nguyên khối bền bỉ, màn hình lớn 6,9 inch chống phản chiếu và sức mạnh vượt trội từ chip A19 Pro. Thiết bị cung cấp thời lượng pin dài nhất từ trước đến nay cùng hệ thống camera 48MP nâng cấp toàn diện.', 0.0, 2, 100, '2026-06-09 23:46:03.820455', '/uploads/product_1781023483664_711.jpeg');
INSERT INTO public.products (id, name, price, original_price, category_id, icon, bg_color, description, rating, sold, stock, created_at, image_url) VALUES (18, 'Áo Sơ Mi Linen Nữ Cổ Trụ Dài Tay Thiết Kế Cổ Tàu Thắt Dây Eo Dáng Phong Cách Nhẹ Nhàng Nữ Tính', 150000, 120000, NULL, '👗', '#E8F4FD', 'Áo Sơ Mi Linen Nữ Cổ Trụ Dài Tay Thiết Kế Cổ Tàu Thắt Dây Eo Dáng Phong Cách Nhẹ Nhàng Nữ Tính
Size XL: 1m70- 1m78 (65-75kg) 
Size XXL: 1m75- 1m85 (80-90kg) 
(Bảng áo khoác hoodie chỉ mang tính chất tham khảo, chọn mặc form vừa vặn thoải mái, lên xuống size tuỳ theo sở thích ăn mặc của bạn)
Hướng dẫn sử dụng :
- Giặt tay riêng trong 3 lần đầu tiên
 Không giặt máy trong 10 ngày đầu
Hướng dẫn sản phẩm
Nên giặt tay và lộn trái áo khi giặt
Không xử dụng các hoá chất tẩy mạnh, chà lên hình in, phơi thẳng dưới tia nắng mặt trời
Có thẻ giặt máy với những vật phẩm cùng màu', 0.0, 2, 20, '2026-06-15 10:35:01.648716', '/uploads/product_1781494429113_261.webp');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users (id, name, email, password_hash, phone, address, role, is_blocked, created_at) VALUES (1, 'Admin ShopNest', 'admin@shopnest.vn', '$2a$10$bcZ0lrcoJKzFek2VdsTwCuq/L.0PltYSUMfdiStBHZSGOWm7bEDD6', '0901234567', 'TP. Hồ Chí Minh, Việt Nam', 'admin', false, '2026-05-31 01:07:42.131256');
INSERT INTO public.users (id, name, email, password_hash, phone, address, role, is_blocked, created_at) VALUES (2, 'Nguyễn Văn An', 'an@test.com', '$2a$10$8beJbtjMYn7uIgv3A1xb2ekTeJuFGIZLXhm6N8uipXBODxMpUQI2q', '0912345678', '123 Nguyễn Huệ, Q.1, TP.HCM', 'user', false, '2026-05-31 01:07:42.131256');
INSERT INTO public.users (id, name, email, password_hash, phone, address, role, is_blocked, created_at) VALUES (5, 'Test User', 'testuser@example.com', '$2a$10$pR.uIcRGbV79tSjAWaI0lebLm0HA.8tYIzqdsH2QAg6rmsdi7UEwC', '', '', 'user', false, '2026-06-09 09:40:02.591968');
INSERT INTO public.users (id, name, email, password_hash, phone, address, role, is_blocked, created_at) VALUES (6, 'NguyNguyen Van Test', 'nguyenvantest@gmail.com', '$2a$10$m49eFuL5OHS0sHblyGVoa.in0QhK/v4tbtmD68DwNKXTR.JHuKx5u', '', '', 'user', false, '2026-06-09 09:42:18.687491');
INSERT INTO public.users (id, name, email, password_hash, phone, address, role, is_blocked, created_at) VALUES (7, 'Phạm Minh Đức', 'phamminhduc@gmail.com', '$2a$10$RJcbqVEF5xPtwyRFdf.7q.LRrsz.ig1cLdk6cqJ20x..zROp3j2h6', '', '', 'user', false, '2026-06-09 09:44:50.419504');
INSERT INTO public.users (id, name, email, password_hash, phone, address, role, is_blocked, created_at) VALUES (8, 'Test User', 'testcheck123@example.com', '$2a$10$FMBV8rkEysnZ1NTSKnd4Vevtw7ByQRo2kJ9x6FeGYRUbR4BSSEsq2', '', '', 'user', false, '2026-06-09 22:55:13.838145');
INSERT INTO public.users (id, name, email, password_hash, phone, address, role, is_blocked, created_at) VALUES (9, 'Nguyễn Đắc Huy', 'matkhau10h@gmail.com', '$2a$10$ZFF4jgGzQDTwNwPg3vTzv.MXAcL.ICTS0BbcfpCHLwx50dhiUSnju', '', '', 'user', false, '2026-06-09 22:57:49.273639');
INSERT INTO public.users (id, name, email, password_hash, phone, address, role, is_blocked, created_at) VALUES (3, 'Trần Thị Bích', 'bich@test.com', '$2a$10$8beJbtjMYn7uIgv3A1xb2ekTeJuFGIZLXhm6N8uipXBODxMpUQI2q', '0923456789', '456 Lê Lợi, Q.3, TP.HCM', 'user', true, '2026-05-31 01:07:42.131256');
INSERT INTO public.users (id, name, email, password_hash, phone, address, role, is_blocked, created_at) VALUES (4, 'Huy', 'synonlysavezone@gmail.com', '$2a$10$ekrsqLJ5pZdULkiNAzqUIeREx3COlql3WeaAQzR8HhdIjTgnA7SA6', '0123123123', '', 'user', false, '2026-06-04 22:45:28.32453');


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.cart_items (id, user_id, product_id, quantity, created_at) VALUES (2, 1, 16, 1, '2026-06-15 16:41:44.301039');
INSERT INTO public.cart_items (id, user_id, product_id, quantity, created_at) VALUES (3, 1, 18, 2, '2026-06-15 16:41:49.278589');
INSERT INTO public.cart_items (id, user_id, product_id, quantity, created_at) VALUES (4, 1, 24, 3, '2026-06-15 16:41:55.765019');


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.orders (id, user_id, name, phone, address, note, payment_method, subtotal, shipping, total, status, created_at) VALUES (1, 2, 'Nguyễn Văn An', '0912345678', '123 Nguyễn Huệ, Q.1, TP.HCM', 'Giao giờ hành chính', 'cod', 36980000, 0, 36980000, 'pending', '2026-05-30 01:07:42.131256');
INSERT INTO public.orders (id, user_id, name, phone, address, note, payment_method, subtotal, shipping, total, status, created_at) VALUES (2, 3, 'Trần Thị Bích', '0923456789', '456 Lê Lợi, Q.3, TP.HCM', '', 'bank', 6990000, 0, 6990000, 'confirmed', '2026-05-30 01:07:42.131256');
INSERT INTO public.orders (id, user_id, name, phone, address, note, payment_method, subtotal, shipping, total, status, created_at) VALUES (3, 2, 'Nguyễn Văn An', '0912345678', '123 Nguyễn Huệ, Q.1, TP.HCM', '', 'ewallet', 598000, 0, 598000, 'shipping', '2026-05-29 01:07:42.131256');
INSERT INTO public.orders (id, user_id, name, phone, address, note, payment_method, subtotal, shipping, total, status, created_at) VALUES (4, 3, 'Trần Thị Bích', '0923456789', '456 Lê Lợi, Q.3, TP.HCM', 'Giao tận tay', 'cod', 29990000, 0, 29990000, 'delivered', '2026-05-29 01:07:42.131256');
INSERT INTO public.orders (id, user_id, name, phone, address, note, payment_method, subtotal, shipping, total, status, created_at) VALUES (5, 2, 'Nguyễn Văn An', '0912345678', '123 Nguyễn Huệ, Q.1, TP.HCM', '', 'cod', 1290000, 0, 1290000, 'pending', '2026-05-28 01:07:42.131256');
INSERT INTO public.orders (id, user_id, name, phone, address, note, payment_method, subtotal, shipping, total, status, created_at) VALUES (6, 4, 'Huy', '0123123123', 'asd', 'asd', 'Thanh toán khi nhận hàng', 13500000, 0, 13500000, 'delivered', '2026-06-15 09:55:26.129257');
INSERT INTO public.orders (id, user_id, name, phone, address, note, payment_method, subtotal, shipping, total, status, created_at) VALUES (7, 4, 'Huy', '0123123123', 'Hà Nội', 'Hàng dễ vỡ , shop nhớ đóng gói kỹ', 'Thanh toán khi nhận hàng', 55550000, 0, 55550000, 'delivered', '2026-06-17 10:50:10.606683');
INSERT INTO public.orders (id, user_id, name, phone, address, note, payment_method, subtotal, shipping, total, status, created_at) VALUES (8, 4, 'Huy', '0123123123', 'Hà Nội', '', 'Chuyển khoản ngân hàng', 200000, 30000, 230000, 'pending', '2026-06-17 17:14:51.501468');
INSERT INTO public.orders (id, user_id, name, phone, address, note, payment_method, subtotal, shipping, total, status, created_at) VALUES (9, 4, 'Huy', '0123123123', 'ok', 'ok', 'Thanh toán khi nhận hàng', 150000, 30000, 180000, 'cancelled', '2026-06-18 17:16:25.656904');
INSERT INTO public.orders (id, user_id, name, phone, address, note, payment_method, subtotal, shipping, total, status, created_at) VALUES (10, 4, 'Huy', '0123123123', 'ââ', 'aa', 'Thanh toán khi nhận hàng', 30550000, 0, 30550000, 'pending', '2026-06-29 20:19:45.703062');


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.order_items (id, order_id, product_id, product_name, product_icon, product_bg, price, quantity, product_image) VALUES (1, 1, NULL, 'iPhone 15 Pro Max 256GB', '📱', '#E8F4FD', 29990000, 1, '');
INSERT INTO public.order_items (id, order_id, product_id, product_name, product_icon, product_bg, price, quantity, product_image) VALUES (5, 4, NULL, 'iPhone 15 Pro Max 256GB', '📱', '#E8F4FD', 29990000, 1, '');
INSERT INTO public.order_items (id, order_id, product_id, product_name, product_icon, product_bg, price, quantity, product_image) VALUES (4, 3, NULL, 'Áo thun nam Polo Premium', '👕', '#FEF9EF', 299000, 2, '');
INSERT INTO public.order_items (id, order_id, product_id, product_name, product_icon, product_bg, price, quantity, product_image) VALUES (2, 1, NULL, 'Tai nghe Sony WH-1000XM5', '🎧', '#FFF0F0', 6990000, 1, '');
INSERT INTO public.order_items (id, order_id, product_id, product_name, product_icon, product_bg, price, quantity, product_image) VALUES (3, 2, NULL, 'Tai nghe Sony WH-1000XM5', '🎧', '#FFF0F0', 6990000, 1, '');
INSERT INTO public.order_items (id, order_id, product_id, product_name, product_icon, product_bg, price, quantity, product_image) VALUES (6, 5, NULL, 'Máy xay sinh tố Philips 750W', '🫙', '#F1F8E9', 1290000, 1, '');
INSERT INTO public.order_items (id, order_id, product_id, product_name, product_icon, product_bg, price, quantity, product_image) VALUES (7, 6, 13, 'Iphone 15 - 128 GB', '📦', '#E8F4FD', 13500000, 1, '/uploads/product_1781023074830_161.webp');
INSERT INTO public.order_items (id, order_id, product_id, product_name, product_icon, product_bg, price, quantity, product_image) VALUES (8, 7, 15, 'Samsung Galaxy S26 Ultra', '📦', '#E8F4FD', 25550000, 1, '/uploads/product_1781024209703_31.png');
INSERT INTO public.order_items (id, order_id, product_id, product_name, product_icon, product_bg, price, quantity, product_image) VALUES (9, 7, 14, 'Iphone 17 Pro Max', '📦', '#E8F4FD', 30000000, 1, '/uploads/product_1781023483664_711.jpeg');
INSERT INTO public.order_items (id, order_id, product_id, product_name, product_icon, product_bg, price, quantity, product_image) VALUES (10, 8, 17, 'Set Áo Buộc Nơ Cổ Tàu Kèm Quần Short KaKi Ông Rộng Trẻ Siêu Xinh Phong Cách Hàn Quốc', '👗', '#E8F4FD', 200000, 1, '/uploads/product_1781494315158_704.webp');
INSERT INTO public.order_items (id, order_id, product_id, product_name, product_icon, product_bg, price, quantity, product_image) VALUES (11, 9, 18, 'Áo Sơ Mi Linen Nữ Cổ Trụ Dài Tay Thiết Kế Cổ Tàu Thắt Dây Eo Dáng Phong Cách Nhẹ Nhàng Nữ Tính', '👗', '#E8F4FD', 150000, 1, '/uploads/product_1781494429113_261.webp');
INSERT INTO public.order_items (id, order_id, product_id, product_name, product_icon, product_bg, price, quantity, product_image) VALUES (12, 10, 17, 'Set Áo Buộc Nơ Cổ Tàu Kèm Quần Short KaKi Ông Rộng Trẻ Siêu Xinh Phong Cách Hàn Quốc', '👗', '#E8F4FD', 200000, 2, '/uploads/product_1781494315158_704.webp');
INSERT INTO public.order_items (id, order_id, product_id, product_name, product_icon, product_bg, price, quantity, product_image) VALUES (13, 10, 14, 'Iphone 17 Pro Max', '📦', '#E8F4FD', 30000000, 1, '/uploads/product_1781023483664_711.jpeg');
INSERT INTO public.order_items (id, order_id, product_id, product_name, product_icon, product_bg, price, quantity, product_image) VALUES (14, 10, 18, 'Áo Sơ Mi Linen Nữ Cổ Trụ Dài Tay Thiết Kế Cổ Tàu Thắt Dây Eo Dáng Phong Cách Nhẹ Nhàng Nữ Tính', '👗', '#E8F4FD', 150000, 1, '/uploads/product_1781494429113_261.webp');


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.reviews (id, user_id, product_id, rating, text, created_at) VALUES (9, 4, 13, 5, 'Tuyet voi !', '2026-06-15 09:58:29.496467');
INSERT INTO public.reviews (id, user_id, product_id, rating, text, created_at) VALUES (10, 4, 13, 2, 'Xấu quá', '2026-06-15 20:57:20.696967');
INSERT INTO public.reviews (id, user_id, product_id, rating, text, created_at) VALUES (11, 4, 13, 5, '', '2026-06-15 20:58:51.933934');
INSERT INTO public.reviews (id, user_id, product_id, rating, text, created_at) VALUES (12, 4, 13, 5, '', '2026-06-15 23:38:27.804164');
INSERT INTO public.reviews (id, user_id, product_id, rating, text, created_at) VALUES (13, 4, 13, 5, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '2026-06-15 23:38:56.662776');


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 18, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 10, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_items_id_seq', 14, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 10, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 38, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reviews_id_seq', 13, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 9, true);


--
-- PostgreSQL database dump complete
--



