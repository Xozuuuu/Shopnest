/* =============================================
   SHOPNEST — Category Routes
   ============================================= */

const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const admin  = require('../middleware/adminMiddleware');
const ctrl   = require('../controllers/productController');

// Public
router.get('/', ctrl.getCategories);

// Admin only
router.post('/',      auth, admin, ctrl.createCategory);
router.put('/:id',    auth, admin, ctrl.updateCategory);
router.delete('/:id', auth, admin, ctrl.deleteCategory);

module.exports = router;
