/* =============================================
   SHOPNEST — Order Controller
   ============================================= */

const pool = require('../config/db');

/* ── GET /api/orders ─────────────────────────── */
exports.getAll = async (req, res) => {
  try {
    // Get user's orders
    const ordersResult = await pool.query(
      `SELECT * FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    // Get items for each order
    const orders = [];
    for (const order of ordersResult.rows) {
      const itemsResult = await pool.query(
        `SELECT * FROM order_items WHERE order_id = $1`,
        [order.id]
      );
      orders.push({
        ...order,
        items: itemsResult.rows,
      });
    }

    res.json({ orders });
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng' });
  }
};

/* ── GET /api/orders/:id ─────────────────────── */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    const itemsResult = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [id]
    );

    res.json({
      order: {
        ...orderResult.rows[0],
        items: itemsResult.rows,
      },
    });
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng' });
  }
};

/* ── POST /api/orders ────────────────────────── */
exports.create = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { name, phone, address, note, payment } = req.body;

    // Validation
    if (!name || !phone || !address) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin giao hàng' });
    }

    // Get user's cart items (include stock for validation)
    const cartResult = await client.query(
      `SELECT ci.quantity, p.id AS product_id, p.name AS product_name,
              p.price, p.icon, p.bg_color, p.image_url AS product_image, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [req.user.id]
    );

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Giỏ hàng trống' });
    }

    // Validate stock for all items
    const outOfStockItems = cartResult.rows.filter(item => !item.stock || item.stock <= 0);
    if (outOfStockItems.length > 0) {
      await client.query('ROLLBACK');
      const names = outOfStockItems.map(i => i.product_name).join(', ');
      return res.status(400).json({
        message: `Sản phẩm đã hết hàng: ${names}. Vui lòng xóa khỏi giỏ hàng.`,
      });
    }

    const insufficientStock = cartResult.rows.filter(item => item.quantity > item.stock);
    if (insufficientStock.length > 0) {
      await client.query('ROLLBACK');
      const details = insufficientStock.map(i => `${i.product_name} (yêu cầu: ${i.quantity}, còn: ${i.stock})`).join(', ');
      return res.status(400).json({
        message: `Số lượng vượt quá tồn kho: ${details}`,
      });
    }

    // Calculate totals
    const subtotal = cartResult.rows.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 300000 ? 0 : 30000;
    const total    = subtotal + shipping;

    // Payment method mapping
    const paymentLabels = {
      cod:     'Thanh toán khi nhận hàng',
      bank:    'Chuyển khoản ngân hàng',
      ewallet: 'Ví điện tử',
    };

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, name, phone, address, note, payment_method, subtotal, shipping, total)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [req.user.id, name, phone, address, note || '', paymentLabels[payment] || payment || 'COD', subtotal, shipping, total]
    );

    const order = orderResult.rows[0];

    // Create order items
    for (const item of cartResult.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_icon, product_bg, price, quantity, product_image)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [order.id, item.product_id, item.product_name, item.icon, item.bg_color, item.price, item.quantity, item.product_image || '']
      );

      // Update product sold count and deduct stock
      await client.query(
        'UPDATE products SET sold = sold + $1, stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);

    await client.query('COMMIT');

    // Fetch complete order with items
    const itemsResult = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [order.id]
    );

    res.status(201).json({
      message: 'Đặt hàng thành công! 🎉',
      order: {
        ...order,
        items: itemsResult.rows,
      },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Create order error:', err);
    res.status(500).json({ message: 'Lỗi server khi đặt hàng' });
  } finally {
    client.release();
  }
};

/* ── PUT /api/orders/:id/cancel ──────────────── */
exports.cancel = async (req, res) => {
  try {
    const { id } = req.params;

    // Only allow cancelling pending orders
    const result = await pool.query(
      `UPDATE orders SET status = 'cancelled'
       WHERE id = $1 AND user_id = $2 AND status = 'pending'
       RETURNING *`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: 'Không thể hủy đơn hàng. Đơn hàng không tồn tại hoặc đã được xử lý.',
      });
    }

    // Restore stock for cancelled order items
    const orderItems = await pool.query(
      'SELECT product_id, quantity FROM order_items WHERE order_id = $1',
      [id]
    );
    for (const item of orderItems.rows) {
      await pool.query(
        'UPDATE products SET stock = stock + $1, sold = GREATEST(0, sold - $1) WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    res.json({
      message: 'Đã hủy đơn hàng thành công',
      order: result.rows[0],
    });
  } catch (err) {
    console.error('Cancel order error:', err);
    res.status(500).json({ message: 'Lỗi server khi hủy đơn hàng' });
  }
};
