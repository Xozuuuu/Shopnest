/* =============================================
   SHOPNEST — Review Routes
   ============================================= */

const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const ctrl   = require('../controllers/reviewController');

// Public
router.get('/', ctrl.getByProduct);

// Protected
router.post('/', auth, ctrl.create);

module.exports = router;
