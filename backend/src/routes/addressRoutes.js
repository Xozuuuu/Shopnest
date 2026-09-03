/* =============================================
   SHOPNEST — Address Routes
   Phiên bản: 2.0.0 | Ngày cập nhật: 03/09/2026
   ============================================= */

const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const ctrl   = require('../controllers/addressController');

// All routes require authentication
router.use(auth);

router.get('/',              ctrl.getAll);
router.post('/',             ctrl.create);
router.put('/:id',           ctrl.update);
router.delete('/:id',        ctrl.delete);
router.put('/:id/default',  ctrl.setDefault);

module.exports = router;
