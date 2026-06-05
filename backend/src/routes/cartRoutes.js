/* =============================================
   SHOPNEST — Cart Routes
   ============================================= */

const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const ctrl   = require('../controllers/cartController');

// All routes require authentication
router.use(auth);

router.get('/',          ctrl.getCart);
router.post('/add',      ctrl.addItem);
router.delete('/clear',  ctrl.clearCart);
router.put('/:id',       ctrl.updateItem);
router.delete('/:id',    ctrl.removeItem);

module.exports = router;
