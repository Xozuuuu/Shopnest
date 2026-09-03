/* =============================================
   SHOPNEST — Auth Controller
   Phiên bản: 2.0.0 | Ngày cập nhật: 03/09/2026
   ============================================= */

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const pool   = require('../config/db');
const { sendVerifyEmail, sendResetPasswordEmail } = require('../config/email');

/* ── Helper: generate JWT ────────────────────── */
function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

/* ── Helper: sanitize user for response ──────── */
function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    role: user.role,
    created_at: user.created_at,
  };
}

/* ── POST /api/auth/register ─────────────────── */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu cần ít nhất 8 ký tự' });
    }

    // Check existing email
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email đã được sử dụng' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Generate email verification token
    const emailVerifyToken = crypto.randomBytes(32).toString('hex');

    // Insert user (email_verified = false for new users)
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, email_verified, email_verify_token)
       VALUES ($1, $2, $3, FALSE, $4) RETURNING *`,
      [name, email, password_hash, emailVerifyToken]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    // Send verification email (non-blocking)
    sendVerifyEmail(email, emailVerifyToken).catch(err => {
      console.error('Send verify email error:', err);
    });

    res.status(201).json({
      message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
};

/* ── POST /api/auth/login ────────────────────── */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
    }

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const user = result.rows[0];

    // Check if blocked
    if (user.is_blocked) {
      return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa' });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Đăng nhập thành công!',
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
};

/* ── POST /api/auth/logout ───────────────────── */
exports.logout = async (req, res) => {
  // JWT is stateless — client removes token
  res.json({ message: 'Đăng xuất thành công' });
};

/* ── GET /api/auth/me ────────────────────────── */
exports.me = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.json({ user: sanitizeUser(result.rows[0]) });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

/* ── PUT /api/users/profile ──────────────────── */
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const result = await pool.query(
      `UPDATE users SET
        name    = COALESCE($1, name),
        phone   = COALESCE($2, phone),
        address = COALESCE($3, address)
       WHERE id = $4 RETURNING *`,
      [name, phone, address, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.json({
      message: 'Cập nhật hồ sơ thành công!',
      user: sanitizeUser(result.rows[0]),
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật hồ sơ' });
  }
};

/* ── PUT /api/users/change-password ──────────── */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ mật khẩu' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới cần ít nhất 6 ký tự' });
    }

    // Get current password hash
    const result = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Verify current password
    const valid = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });
    }

    // Hash new password & update
    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, req.user.id]);

    res.json({ message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Lỗi server khi đổi mật khẩu' });
  }
};

/* ── POST /api/auth/forgot-password ────────────── */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Vui lòng nhập email' });
    }

    // Find user
    const result = await pool.query('SELECT id, name, email FROM users WHERE email = $1', [email]);
    
    // Luôn trả về thành công để tránh lộ thông tin email nào đã đăng ký
    if (result.rows.length === 0) {
      return res.json({ message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được link đặt lại mật khẩu.' });
    }

    const user = result.rows[0];

    // Generate reset token (expires in 30 minutes)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 phút

    await pool.query(
      'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3',
      [resetToken, resetExpires, user.id]
    );

    // Send email
    await sendResetPasswordEmail(user.email, resetToken);

    res.json({ message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được link đặt lại mật khẩu.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Lỗi server khi xử lý yêu cầu' });
  }
};

/* ── POST /api/auth/reset-password ─────────────── */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới cần ít nhất 6 ký tự' });
    }

    // Find user by reset token
    const result = await pool.query(
      'SELECT id FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn' });
    }

    const userId = result.rows[0].id;
    const newHash = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await pool.query(
      'UPDATE users SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2',
      [newHash, userId]
    );

    res.json({ message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Lỗi server khi đặt lại mật khẩu' });
  }
};

/* ── GET /api/auth/verify-email?token=... ────────── */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Thiếu token xác thực' });
    }

    const result = await pool.query(
      'UPDATE users SET email_verified = TRUE, email_verify_token = NULL WHERE email_verify_token = $1 RETURNING id, email',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Link xác thực không hợp lệ hoặc email đã được xác thực' });
    }

    res.json({ message: 'Xác thực email thành công! 🎉' });
  } catch (err) {
    console.error('Verify email error:', err);
    res.status(500).json({ message: 'Lỗi server khi xác thực email' });
  }
};

/* ── POST /api/auth/resend-verify ───────────────── */
exports.resendVerify = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT email, email_verified FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    if (result.rows[0].email_verified) {
      return res.json({ message: 'Email đã được xác thực rồi' });
    }

    // Generate new token
    const newToken = crypto.randomBytes(32).toString('hex');
    await pool.query(
      'UPDATE users SET email_verify_token = $1 WHERE id = $2',
      [newToken, userId]
    );

    await sendVerifyEmail(result.rows[0].email, newToken);

    res.json({ message: 'Đã gửi lại email xác thực!' });
  } catch (err) {
    console.error('Resend verify error:', err);
    res.status(500).json({ message: 'Lỗi server khi gửi lại email xác thực' });
  }
};
