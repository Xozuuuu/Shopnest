/* =============================================
   SHOPNEST — Wishlist Routes
   Phiên bản: 2.0.0 | Ngày cập nhật: 03/09/2026
   ============================================= */

const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const ctrl   = require('../controllers/wishlistController');

// All routes require authentication
router.use(auth);

router.get('/',               ctrl.getAll);
router.get('/ids',            ctrl.getIds);
router.post('/toggle',        ctrl.toggle);
router.get('/check/:productId', ctrl.check);

module.exports = router;
