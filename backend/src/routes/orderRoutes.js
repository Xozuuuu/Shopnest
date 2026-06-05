/* =============================================
   SHOPNEST — Order Routes
   ============================================= */

const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const ctrl   = require('../controllers/orderController');

// All routes require authentication
router.use(auth);

router.get('/',             ctrl.getAll);
router.get('/:id',          ctrl.getById);
router.post('/',            ctrl.create);
router.put('/:id/cancel',   ctrl.cancel);

module.exports = router;
