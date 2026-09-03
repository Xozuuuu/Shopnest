/* =============================================
   SHOPNEST — Auth Routes
   Phiên bản: 2.0.0 | Ngày cập nhật: 03/09/2026
   ============================================= */

const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const ctrl   = require('../controllers/authController');

// Public
router.post('/register',        ctrl.register);
router.post('/login',           ctrl.login);
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password',  ctrl.resetPassword);
router.get('/verify-email',     ctrl.verifyEmail);

// Protected
router.post('/logout',          auth, ctrl.logout);
router.get('/me',               auth, ctrl.me);
router.post('/resend-verify',   auth, ctrl.resendVerify);

module.exports = router;
