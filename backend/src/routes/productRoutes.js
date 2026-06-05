/* =============================================
   SHOPNEST — Product Routes
   ============================================= */

const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const admin  = require('../middleware/adminMiddleware');
const ctrl   = require('../controllers/productController');

// Public
router.get('/search', ctrl.search);
router.get('/',       ctrl.getAll);
router.get('/:id',    ctrl.getById);

// Admin only
router.post('/',      auth, admin, ctrl.create);
router.put('/:id',    auth, admin, ctrl.update);
router.delete('/:id', auth, admin, ctrl.delete);

// Upload image (Admin only)
router.post('/upload', auth, admin, ctrl.uploadMiddleware, ctrl.uploadImage);

module.exports = router;
