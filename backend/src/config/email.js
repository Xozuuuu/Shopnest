/* =============================================
   SHOPNEST — Email Service (Nodemailer)
   Phiên bản: 2.0.0 | Ngày cập nhật: 03/09/2026
   ============================================= */

const nodemailer = require('nodemailer');

/* ── Tạo transporter ─────────────────────────── */
let transporter;

if (process.env.SMTP_HOST) {
  // Production: dùng SMTP thật (Gmail, Mailtrap, v.v.)
  transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  // Development: log email ra console (không cần SMTP)
  transporter = {
    sendMail: async (mailOptions) => {
      console.log('\n📧 ═══════════════════════════════════════');
      console.log('📧 EMAIL (Dev Mode — không gửi thật)');
      console.log('📧 ═══════════════════════════════════════');
      console.log(`📧 To:      ${mailOptions.to}`);
      console.log(`📧 Subject: ${mailOptions.subject}`);
      console.log(`📧 Body:    ${mailOptions.text || '(HTML email)'}`);
      if (mailOptions.html) {
        // Trích xuất link từ HTML nếu có
        const linkMatch = mailOptions.html.match(/href="([^"]+)"/);
        if (linkMatch) {
          console.log(`📧 Link:    ${linkMatch[1]}`);
        }
      }
      console.log('📧 ═══════════════════════════════════════\n');
      return { messageId: 'dev-' + Date.now() };
    },
  };
  console.log('📧 Email service running in DEV mode (console output only)');
}

/* ── Helper: gửi email ──────────────────────── */
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000/frontend';
const FROM_EMAIL   = process.env.FROM_EMAIL   || 'ShopNest <noreply@shopnest.vn>';

/**
 * Gửi email xác thực tài khoản
 */
async function sendVerifyEmail(email, token) {
  const verifyUrl = `${FRONTEND_URL}/verify-email.html?token=${token}`;
  
  await transporter.sendMail({
    from:    FROM_EMAIL,
    to:      email,
    subject: '🏠 ShopNest — Xác thực email của bạn',
    text:    `Chào bạn!\n\nVui lòng xác thực email bằng cách truy cập link sau:\n${verifyUrl}\n\nLink có hiệu lực trong 24 giờ.\n\nTrân trọng,\nShopNest Team`,
    html: `
      <div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="text-align:center;margin-bottom:24px;">
          <span style="font-size:32px;">🏠</span>
          <h1 style="font-family:'Nunito',sans-serif;color:#EE4D2D;margin:8px 0;">ShopNest</h1>
        </div>
        <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e8e8e8;">
          <h2 style="margin-top:0;">Xác thực email của bạn</h2>
          <p>Chào bạn! Cảm ơn bạn đã đăng ký tài khoản ShopNest.</p>
          <p>Vui lòng nhấn nút bên dưới để xác thực email:</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${verifyUrl}" style="background:#EE4D2D;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block;">
              ✅ Xác thực email
            </a>
          </div>
          <p style="font-size:13px;color:#999;">Link có hiệu lực trong 24 giờ. Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.</p>
        </div>
        <p style="text-align:center;font-size:12px;color:#999;margin-top:16px;">© 2024 ShopNest Vietnam</p>
      </div>
    `,
  });
}

/**
 * Gửi email reset mật khẩu
 */
async function sendResetPasswordEmail(email, token) {
  const resetUrl = `${FRONTEND_URL}/reset-password.html?token=${token}`;
  
  await transporter.sendMail({
    from:    FROM_EMAIL,
    to:      email,
    subject: '🔑 ShopNest — Đặt lại mật khẩu',
    text:    `Chào bạn!\n\nBạn đã yêu cầu đặt lại mật khẩu. Vui lòng truy cập link sau:\n${resetUrl}\n\nLink có hiệu lực trong 30 phút.\n\nNếu bạn không yêu cầu, vui lòng bỏ qua email này.\n\nTrân trọng,\nShopNest Team`,
    html: `
      <div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="text-align:center;margin-bottom:24px;">
          <span style="font-size:32px;">🏠</span>
          <h1 style="font-family:'Nunito',sans-serif;color:#EE4D2D;margin:8px 0;">ShopNest</h1>
        </div>
        <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e8e8e8;">
          <h2 style="margin-top:0;">Đặt lại mật khẩu</h2>
          <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản ShopNest.</p>
          <p>Nhấn nút bên dưới để tạo mật khẩu mới:</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${resetUrl}" style="background:#EE4D2D;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block;">
              🔑 Đặt lại mật khẩu
            </a>
          </div>
          <p style="font-size:13px;color:#999;">Link có hiệu lực trong 30 phút. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        </div>
        <p style="text-align:center;font-size:12px;color:#999;margin-top:16px;">© 2024 ShopNest Vietnam</p>
      </div>
    `,
  });
}

module.exports = {
  transporter,
  sendVerifyEmail,
  sendResetPasswordEmail,
  FRONTEND_URL,
};
