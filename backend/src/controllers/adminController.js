/* =============================================
   SHOPNEST — Admin Controller
   ============================================= */

const pool = require('../config/db');

/* ── GET /api/admin/users ────────────────────── */
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = 'SELECT id, name, email, phone, role, is_blocked, created_at FROM users';
    const params = [];

    if (search) {
      query += ` WHERE name ILIKE $1 OR email ILIKE $1`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY created_at DESC';
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(Number(limit), offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM users';
    const countParams = [];
    if (search) {
      countQuery += ' WHERE name ILIKE $1 OR email ILIKE $1';
      countParams.push(`%${search}%`);
    }
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      users: result.rows,
      total,
      page:  Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng' });
  }
};

/* ── PUT /api/admin/users/:id/block ──────────── */
exports.blockUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Toggle is_blocked
    const result = await pool.query(
      `UPDATE users SET is_blocked = NOT is_blocked
       WHERE id = $1 AND role != 'admin'
       RETURNING id, name, email, is_blocked`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng hoặc không thể khóa admin' });
    }

    const user = result.rows[0];
    res.json({
      message: user.is_blocked ? `Đã khóa tài khoản ${user.name}` : `Đã mở khóa tài khoản ${user.name}`,
      user,
    });
  } catch (err) {
    console.error('Block user error:', err);
    res.status(500).json({ message: 'Lỗi server khi khóa/mở khóa người dùng' });
  }
};

/* ── GET /api/admin/orders ───────────────────── */
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = `
      SELECT o.*, u.name AS customer_name, u.email AS customer_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
    `;
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push(`o.status = $${params.length + 1}`);
      params.push(status);
    }

    if (search) {
      conditions.push(`(u.name ILIKE $${params.length + 1} OR o.name ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY o.created_at DESC';
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(Number(limit), offset);

    const result = await pool.query(query, params);

    // Get items count for each order
    const orders = [];
    for (const order of result.rows) {
      const itemsCount = await pool.query(
        'SELECT COUNT(*) FROM order_items WHERE order_id = $1',
        [order.id]
      );
      orders.push({
        ...order,
        items_count: parseInt(itemsCount.rows[0].count),
      });
    }

    // Total count
    let countQuery = 'SELECT COUNT(*) FROM orders o JOIN users u ON o.user_id = u.id';
    const countParams = [];
    const countConditions = [];
    if (status) {
      countConditions.push(`o.status = $${countParams.length + 1}`);
      countParams.push(status);
    }
    if (search) {
      countConditions.push(`(u.name ILIKE $${countParams.length + 1} OR o.name ILIKE $${countParams.length + 1})`);
      countParams.push(`%${search}%`);
    }
    if (countConditions.length > 0) {
      countQuery += ' WHERE ' + countConditions.join(' AND ');
    }
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      orders,
      total,
      page:  Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error('Get all orders error:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng' });
  }
};

/* ── PUT /api/admin/orders/:id/status ────────── */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    const statusLabels = {
      pending:   'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      shipping:  'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy',
    };

    res.json({
      message: `Đã cập nhật trạng thái thành "${statusLabels[status]}"`,
      order: result.rows[0],
    });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái' });
  }
};

/* ── GET /api/admin/dashboard/stats ──────────── */
exports.dashboardStats = async (req, res) => {
  try {
    // Total revenue (this month)
    const revenueResult = await pool.query(
      `SELECT COALESCE(SUM(total), 0) AS revenue
       FROM orders
       WHERE status != 'cancelled'
       AND created_at >= date_trunc('month', NOW())`
    );

    // Total orders
    const ordersResult = await pool.query('SELECT COUNT(*) FROM orders');

    // Total products
    const productsResult = await pool.query('SELECT COUNT(*) FROM products');

    // Total users
    const usersResult = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'user'");

    res.json({
      stats: {
        revenue:  parseInt(revenueResult.rows[0].revenue),
        orders:   parseInt(ordersResult.rows[0].count),
        products: parseInt(productsResult.rows[0].count),
        users:    parseInt(usersResult.rows[0].count),
      },
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy thống kê' });
  }
};

/* ── GET /api/admin/dashboard/orders ─────────── */
exports.recentOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.id, o.total, o.status, o.created_at,
              o.name AS customer,
              (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS items_count
       FROM orders o
       ORDER BY o.created_at DESC
       LIMIT 10`
    );

    res.json({ orders: result.rows });
  } catch (err) {
    console.error('Recent orders error:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng gần đây' });
  }
};

/* ── GET /api/admin/dashboard/revenue-chart ───── */
exports.revenueChart = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d::date AS date,
              COALESCE(SUM(o.total), 0) AS revenue
       FROM generate_series(
              (CURRENT_DATE - INTERVAL '6 days'),
              CURRENT_DATE,
              '1 day'
            ) AS d
       LEFT JOIN orders o
         ON o.created_at::date = d::date
         AND o.status != 'cancelled'
       GROUP BY d::date
       ORDER BY d::date ASC`
    );

    // Map to day labels (T2-CN) and revenue values
    const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const chart = result.rows.map(row => {
      const dayOfWeek = new Date(row.date).getDay(); // 0=Sun,1=Mon...
      return {
        day: dayLabels[dayOfWeek],
        date: row.date,
        value: parseInt(row.revenue),
      };
    });

    res.json({ chart });
  } catch (err) {
    console.error('Revenue chart error:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu biểu đồ doanh thu' });
  }
};

/* ── GET /api/admin/dashboard/products ────────── */
exports.topProducts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.name, p.icon, p.bg_color, p.sold, p.price,
              (p.sold * p.price) AS revenue
       FROM products p
       ORDER BY p.sold DESC
       LIMIT 5`
    );

    res.json({ products: result.rows });
  } catch (err) {
    console.error('Top products error:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy sản phẩm bán chạy' });
  }
};
