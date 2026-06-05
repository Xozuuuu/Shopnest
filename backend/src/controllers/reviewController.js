/* =============================================
   SHOPNEST — Review Controller
   ============================================= */

const pool = require('../config/db');

/* ── GET /api/reviews?productId=... ──────────── */
exports.getByProduct = async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({ message: 'Vui lòng chỉ định productId' });
    }

    const result = await pool.query(
      `SELECT r.id, r.rating, r.text, r.created_at,
              u.name AS user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC`,
      [productId]
    );

    // Calculate average rating
    let avgRating = 0;
    if (result.rows.length > 0) {
      const sum = result.rows.reduce((s, r) => s + r.rating, 0);
      avgRating = Math.round((sum / result.rows.length) * 10) / 10;
    }

    res.json({
      reviews: result.rows,
      total:   result.rows.length,
      avgRating,
    });
  } catch (err) {
    console.error('Get reviews error:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy đánh giá' });
  }
};

/* ── POST /api/reviews ───────────────────────── */
exports.create = async (req, res) => {
  try {
    const { productId, rating, text } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({ message: 'Vui lòng chọn sản phẩm và đánh giá' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Đánh giá phải từ 1 đến 5 sao' });
    }

    // Check product exists
    const product = await pool.query('SELECT id FROM products WHERE id = $1', [productId]);
    if (product.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    // Insert review
    const result = await pool.query(
      `INSERT INTO reviews (user_id, product_id, rating, text)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.id, productId, rating, text || '']
    );

    // Update product average rating
    const avgResult = await pool.query(
      `SELECT ROUND(AVG(rating)::numeric, 1) AS avg_rating
       FROM reviews WHERE product_id = $1`,
      [productId]
    );
    if (avgResult.rows[0].avg_rating) {
      await pool.query(
        'UPDATE products SET rating = $1 WHERE id = $2',
        [avgResult.rows[0].avg_rating, productId]
      );
    }

    // Get user name for response
    const user = await pool.query('SELECT name FROM users WHERE id = $1', [req.user.id]);

    res.status(201).json({
      message: 'Đánh giá thành công!',
      review: {
        ...result.rows[0],
        user_name: user.rows[0]?.name || 'Ẩn danh',
      },
    });
  } catch (err) {
    console.error('Create review error:', err);
    res.status(500).json({ message: 'Lỗi server khi tạo đánh giá' });
  }
};
