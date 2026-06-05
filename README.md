Tài liệu Luồng Nghiệp Vụ - ShopNest
Tài liệu này mô tả chi tiết các đối tượng sử dụng hệ thống và các luồng nghiệp vụ chính của nền tảng ShopNest.

1. Đối tượng sử dụng hệ thống (Actors)
Hệ thống được thiết kế để phục vụ 3 nhóm đối tượng chính, mỗi nhóm có các quyền hạn và chức năng riêng biệt:

Khách vãng lai (Guest)

Xem danh sách sản phẩm.

Tìm kiếm & lọc sản phẩm.

Xem chi tiết sản phẩm.

Chưa thực hiện giao dịch.

Người dùng đã đăng ký (User)

Đăng ký / Đăng nhập / Đăng xuất.

Mua hàng (từ giỏ hàng → đặt hàng → thanh toán).

Quản lý đơn hàng.

Cập nhật hồ sơ cá nhân.

Quản trị viên (Admin)

Quản lý danh mục sản phẩm.

Quản lý sản phẩm (Thêm, Đọc, Sửa, Xóa - CRUD).

Quản lý & xử lý đơn hàng.

Quản lý tài khoản người dùng.

2. Luồng nghiệp vụ chính (Main Workflows)
Luồng 1: Đăng ký tài khoản
API Endpoints: POST /auth/register

Truy cập trang đăng ký: Người dùng nhấn "Đăng ký" từ navbar hoặc trang đăng nhập.

Nhập thông tin: Yêu cầu các thông tin bao gồm Họ tên, Email, Mật khẩu, và Xác nhận mật khẩu.

Hệ thống kiểm tra validation: Đảm bảo Email đúng định dạng, mật khẩu dài từ 8 ký tự trở lên, và email chưa tồn tại trong hệ thống.

Kết quả: Nếu thành công, chuyển về trang chủ ở trạng thái đã đăng nhập. Nếu thất bại, hiển thị thông báo lỗi tại chỗ.

Luồng 2: Đăng nhập / Đăng xuất
API Endpoints: POST /auth/login · POST /auth/logout

Nhập Email + Mật khẩu: Thực hiện tại trang /login.html.

Hệ thống xác thực: Kiểm tra sự tồn tại của email và tính hợp lệ của mật khẩu. Nếu khớp, hệ thống cấp JWT token và lưu session.

Chuyển hướng sau đăng nhập: Nếu thành công, chuyển hướng về trang chủ (navbar hiển thị tên user, giỏ hàng được cập nhật). Nếu sai, hiển thị thông báo lỗi.

Đăng xuất: Khi nhấn "Đăng xuất", hệ thống xóa token và chuyển người dùng về trang chủ dưới tư cách khách vãng lai.

Luồng 3: Tìm kiếm & Xem sản phẩm
API Endpoints: GET /products · GET /products/:id

Tìm kiếm / duyệt danh mục: Nhập từ khóa vào thanh tìm kiếm hoặc chọn một danh mục cụ thể từ navbar/trang chủ.

Lọc & sắp xếp kết quả: Hỗ trợ lọc theo danh mục, mức giá, và đánh giá. Sắp xếp theo các tiêu chí: mới nhất, bán chạy, giá tăng/giảm.

Xem chi tiết sản phẩm: Hiển thị Tên, mô tả, giá, ảnh, đánh giá, và số lượng tồn kho của sản phẩm.

Hành động tiếp theo: Người dùng có thể thêm sản phẩm vào giỏ hàng hoặc tiếp tục quá trình duyệt sản phẩm.

Luồng 4: Giỏ hàng → Đặt hàng → Thanh toán
API Endpoints: POST /cart/add · POST /orders

Thêm vào giỏ hàng: Chọn số lượng mong muốn và nhấn "Thêm vào giỏ". Badge giỏ hàng trên navbar sẽ tự động cập nhật.

Xem & chỉnh sửa giỏ hàng: Cho phép thay đổi số lượng, xóa sản phẩm khỏi giỏ, và xem tổng tiền tạm tính.

Tiến hành thanh toán: Nhập thông tin địa chỉ giao hàng và chọn phương thức thanh toán (COD hoặc chuyển khoản).

Xác nhận đơn hàng: Hệ thống sẽ tiến hành tạo đơn, hiển thị mã đơn hàng và gửi thông báo xác nhận cho người dùng.

Luồng 5: Quản lý đơn hàng (Người dùng)
API Endpoints: GET /orders · PUT /orders/:id/cancel

Xem lịch sử đơn hàng: Hiển thị danh sách tất cả các đơn hàng kèm theo trạng thái: Chờ xác nhận, Đang xử lý, Đang giao, Đã giao, hoặc Đã hủy.

Xem chi tiết đơn hàng: Hiển thị chi tiết danh sách sản phẩm, tổng giá trị, địa chỉ giao hàng và timeline các trạng thái của đơn.

Hủy đơn hàng: Chỉ được phép hủy khi đơn hàng đang ở trạng thái "Chờ xác nhận". Hệ thống sẽ xác nhận và tiến hành cập nhật lại trạng thái đơn.

Luồng 6: Quản trị Admin (Tổng quan)
API Endpoints: /admin/* (Yêu cầu quyền admin)

Dashboard tổng quan: Cung cấp số liệu thống kê về doanh thu, tổng số đơn hàng, số sản phẩm hiện có và số lượng tài khoản đăng ký.

Quản lý sản phẩm & danh mục: Hỗ trợ các tác vụ Thêm, Sửa, Xóa cho sản phẩm/danh mục và cập nhật số lượng tồn kho.

Xử lý đơn hàng: Cho phép Admin xem danh sách đơn hàng và cập nhật quy trình trạng thái: Xác nhận → Đang giao → Đã giao.

Quản lý tài khoản: Cho phép xem danh sách toàn bộ người dùng và thực hiện khoá/mở khoá đối với các tài khoản vi phạm.