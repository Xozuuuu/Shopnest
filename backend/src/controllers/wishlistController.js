/* =============================================
   SHOPNEST — Wishlist Controller
   Phiên bản: 2.0.0 | Ngày cập nhật: 03/09/2026
   ============================================= */

const pool = require('../config/db');

/* ── GET /api/wishlists ──────────────────────── */
exports.getAll = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT w.id, w.created_at,
              p.id AS product_id, p.name, p.price, p.original_price,
              p.icon, p.bg_color, p.rating, p.sold, p.stock, p.image_url,
              c.name AS category_name, c.slug AS category_slug
       FROM wishlists w
       JOIN products p ON w.product_id = p.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [req.user.id]
    );

    res.json({
      wishlists: result.rows,
      total: result.rows.length,
    });
  } catch (err) {
    console.error('Get wishlists error:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách yêu thích' });
  }
};

/* ── POST /api/wishlists/toggle ──────────────── */
exports.toggle = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Vui lòng chọn sản phẩm' });
    }

    // Check product exists
    const product = await pool.query('SELECT id, name FROM products WHERE id = $1', [productId]);
    if (product.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    // Check if already in wishlist
    const existing = await pool.query(
      'SELECT id FROM wishlists WHERE user_id = $1 AND product_id = $2',
      [req.user.id, productId]
    );

    if (existing.rows.length > 0) {
      // Remove from wishlist
      await pool.query(
        'DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2',
        [req.user.id, productId]
      );
      res.json({
        message: 'Đã bỏ khỏi danh sách yêu thích',
        wishlisted: false,
      });
    } else {
      // Add to wishlist
      await pool.query(
        'INSERT INTO wishlists (user_id, product_id) VALUES ($1, $2)',
        [req.user.id, productId]
      );
      res.json({
        message: `Đã thêm "${product.rows[0].name}" vào yêu thích ❤️`,
        wishlisted: true,
      });
    }
  } catch (err) {
    console.error('Toggle wishlist error:', err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật yêu thích' });
  }
};

/* ── GET /api/wishlists/check/:productId ─────── */
exports.check = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await pool.query(
      'SELECT id FROM wishlists WHERE user_id = $1 AND product_id = $2',
      [req.user.id, productId]
    );

    res.json({ wishlisted: result.rows.length > 0 });
  } catch (err) {
    console.error('Check wishlist error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

/* ── GET /api/wishlists/ids ──────────────────── */
exports.getIds = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT product_id FROM wishlists WHERE user_id = $1',
      [req.user.id]
    );

    res.json({
      productIds: result.rows.map(r => r.product_id),
    });
  } catch (err) {
    console.error('Get wishlist ids error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
