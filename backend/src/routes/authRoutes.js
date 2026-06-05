/* =============================================
   SHOPNEST — Auth Routes
   ============================================= */

const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const ctrl   = require('../controllers/authController');

// Public
router.post('/register', ctrl.register);
router.post('/login',    ctrl.login);

// Protected
router.post('/logout',   auth, ctrl.logout);
router.get('/me',        auth, ctrl.me);

module.exports = router;
