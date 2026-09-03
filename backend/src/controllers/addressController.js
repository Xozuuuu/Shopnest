/* =============================================
   SHOPNEST — Address Controller
   Phiên bản: 2.0.0 | Ngày cập nhật: 03/09/2026
   ============================================= */

const pool = require('../config/db');

/* ── GET /api/addresses ──────────────────────── */
exports.getAll = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM addresses
       WHERE user_id = $1
       ORDER BY is_default DESC, created_at DESC`,
      [req.user.id]
    );

    res.json({ addresses: result.rows });
  } catch (err) {
    console.error('Get addresses error:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy sổ địa chỉ' });
  }
};

/* ── POST /api/addresses ─────────────────────── */
exports.create = async (req, res) => {
  try {
    const { name, phone, address, city, is_default } = req.body;

    if (!name || !phone || !address) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    // Nếu đặt làm mặc định → bỏ default của các địa chỉ khác
    if (is_default) {
      await pool.query(
        'UPDATE addresses SET is_default = FALSE WHERE user_id = $1',
        [req.user.id]
      );
    }

    // Nếu đây là địa chỉ đầu tiên → tự động đặt làm mặc định
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM addresses WHERE user_id = $1',
      [req.user.id]
    );
    const isFirst = parseInt(countResult.rows[0].count) === 0;

    const result = await pool.query(
      `INSERT INTO addresses (user_id, name, phone, address, city, is_default)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, name, phone, address, city || '', is_default || isFirst]
    );

    res.status(201).json({
      message: 'Thêm địa chỉ thành công!',
      address: result.rows[0],
    });
  } catch (err) {
    console.error('Create address error:', err);
    res.status(500).json({ message: 'Lỗi server khi thêm địa chỉ' });
  }
};

/* ── PUT /api/addresses/:id ──────────────────── */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address, city, is_default } = req.body;

    // Nếu đặt làm mặc định → bỏ default của các địa chỉ khác
    if (is_default) {
      await pool.query(
        'UPDATE addresses SET is_default = FALSE WHERE user_id = $1',
        [req.user.id]
      );
    }

    const result = await pool.query(
      `UPDATE addresses SET
        name       = COALESCE($1, name),
        phone      = COALESCE($2, phone),
        address    = COALESCE($3, address),
        city       = COALESCE($4, city),
        is_default = COALESCE($5, is_default)
       WHERE id = $6 AND user_id = $7 RETURNING *`,
      [name, phone, address, city, is_default, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }

    res.json({
      message: 'Cập nhật địa chỉ thành công!',
      address: result.rows[0],
    });
  } catch (err) {
    console.error('Update address error:', err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật địa chỉ' });
  }
};

/* ── DELETE /api/addresses/:id ───────────────── */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id, is_default',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }

    // Nếu xóa địa chỉ mặc định → đặt địa chỉ đầu tiên còn lại làm mặc định
    if (result.rows[0].is_default) {
      await pool.query(
        `UPDATE addresses SET is_default = TRUE
         WHERE user_id = $1 AND id = (
           SELECT id FROM addresses WHERE user_id = $1 ORDER BY created_at ASC LIMIT 1
         )`,
        [req.user.id]
      );
    }

    res.json({ message: 'Đã xóa địa chỉ' });
  } catch (err) {
    console.error('Delete address error:', err);
    res.status(500).json({ message: 'Lỗi server khi xóa địa chỉ' });
  }
};

/* ── PUT /api/addresses/:id/default ──────────── */
exports.setDefault = async (req, res) => {
  try {
    const { id } = req.params;

    // Bỏ default tất cả
    await pool.query(
      'UPDATE addresses SET is_default = FALSE WHERE user_id = $1',
      [req.user.id]
    );

    // Set default cho địa chỉ này
    const result = await pool.query(
      'UPDATE addresses SET is_default = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }

    res.json({
      message: 'Đã đặt làm địa chỉ mặc định',
      address: result.rows[0],
    });
  } catch (err) {
    console.error('Set default address error:', err);
    res.status(500).json({ message: 'Lỗi server khi đặt địa chỉ mặc định' });
  }
};
