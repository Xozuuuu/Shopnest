/* =============================================
   SHOPNEST — Admin Routes
   ============================================= */

const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const admin  = require('../middleware/adminMiddleware');
const ctrl   = require('../controllers/adminController');

// All routes require admin
router.use(auth, admin);

// Users
router.get('/users',              ctrl.getUsers);
router.put('/users/:id/block',    ctrl.blockUser);

// Orders
router.get('/orders',             ctrl.getAllOrders);
router.put('/orders/:id/status',  ctrl.updateOrderStatus);

// Dashboard
router.get('/dashboard/stats',    ctrl.dashboardStats);
router.get('/dashboard/revenue-chart', ctrl.revenueChart);
router.get('/dashboard/orders',   ctrl.recentOrders);
router.get('/dashboard/products', ctrl.topProducts);

module.exports = router;
