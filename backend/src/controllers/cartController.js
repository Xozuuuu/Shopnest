/* =============================================
   SHOPNEST — Cart Controller
   ============================================= */

const pool = require('../config/db');

/* ── GET /api/cart ────────────────────────────── */
exports.getCart = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ci.id, ci.quantity,
              p.id AS product_id, p.name, p.price, p.original_price,
              p.icon, p.bg_color, p.stock, p.image_url
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1
       ORDER BY ci.created_at DESC`,
      [req.user.id]
    );

    const items = result.rows.map(row => ({
      id:         row.id,
      productId:  row.product_id,
      name:       row.name,
      price:      row.price,
      original:   row.original_price,
      icon:       row.icon,
      bg:         row.bg_color,
      quantity:   row.quantity,
      stock:      row.stock,
      image_url:  row.image_url,
    }));

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({ items, total, count: items.length });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy giỏ hàng' });
  }
};

/* ── POST /api/cart/add ──────────────────────── */
exports.addItem = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Vui lòng chọn sản phẩm' });
    }

    // Check product exists
    const product = await pool.query('SELECT id, stock FROM products WHERE id = $1', [productId]);
    if (product.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    // Check stock availability
    const stock = product.rows[0].stock;
    if (!stock || stock <= 0) {
      return res.status(400).json({ message: 'Sản phẩm đã hết hàng' });
    }

    // Check if adding quantity exceeds stock (considering items already in cart)
    const existingCart = await pool.query(
      'SELECT quantity FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [req.user.id, productId]
    );
    const currentQtyInCart = existingCart.rows.length > 0 ? existingCart.rows[0].quantity : 0;
    if (currentQtyInCart + quantity > stock) {
      return res.status(400).json({
        message: `Số lượng vượt quá tồn kho. Còn lại: ${stock}, trong giỏ: ${currentQtyInCart}`,
      });
    }

    // Upsert: increment quantity if already in cart
    const result = await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + $3
       RETURNING *`,
      [req.user.id, productId, quantity]
    );

    res.status(201).json({
      message: 'Đã thêm vào giỏ hàng!',
      cartItem: result.rows[0],
    });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: 'Lỗi server khi thêm vào giỏ hàng' });
  }
};

/* ── PUT /api/cart/:id ───────────────────────── */
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Số lượng không hợp lệ' });
    }

    const result = await pool.query(
      `UPDATE cart_items SET quantity = $1
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [quantity, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ' });
    }

    res.json({
      message: 'Cập nhật giỏ hàng thành công!',
      cartItem: result.rows[0],
    });
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật giỏ hàng' });
  }
};

/* ── DELETE /api/cart/:id ─────────────────────── */
exports.removeItem = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ' });
    }

    res.json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ message: 'Lỗi server khi xóa sản phẩm khỏi giỏ' });
  }
};

/* ── DELETE /api/cart/clear ───────────────────── */
exports.clearCart = async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);
    res.json({ message: 'Đã xóa toàn bộ giỏ hàng' });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ message: 'Lỗi server khi xóa giỏ hàng' });
  }
};
