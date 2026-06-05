/* =============================================
   SHOPNEST — User Routes (profile)
   ============================================= */

const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const ctrl   = require('../controllers/authController');

// All routes require authentication
router.use(auth);

router.put('/profile',         ctrl.updateProfile);
router.put('/change-password', ctrl.changePassword);

module.exports = router;
