/* =============================================
   SHOPNEST — Express App Setup
   ============================================= */

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const authRoutes      = require('./routes/authRoutes');
const productRoutes   = require('./routes/productRoutes');
const cartRoutes      = require('./routes/cartRoutes');
const orderRoutes     = require('./routes/orderRoutes');
const reviewRoutes    = require('./routes/reviewRoutes');
const adminRoutes     = require('./routes/adminRoutes');
const addressRoutes   = require('./routes/addressRoutes');
const wishlistRoutes  = require('./routes/wishlistRoutes');

const app = express();

/* ── Middleware ─────────────────────────────── */
app.use(cors());
app.use(express.json());

/* ── Serve uploaded images ─────────────────── */
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

/* ── Serve frontend static files ───────────── */
app.use('/frontend', express.static(path.join(__dirname, '..', '..', 'frontend')));

/* ── API Routes ────────────────────────────── */
app.use('/api/auth',       authRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/cart',        cartRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/reviews',    reviewRoutes);
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/users',      require('./routes/userRoutes'));
app.use('/api/admin',      adminRoutes);
app.use('/api/addresses',  addressRoutes);
app.use('/api/wishlists',  wishlistRoutes);

/* ── Health Check ──────────────────────────── */
app.get('/api', (req, res) => {
  res.json({ message: '🚀 ShopNest API is running!', version: '1.0.0' });
});

/* ── Root redirect to frontend ─────────────── */
app.get('/', (req, res) => {
  res.redirect('/frontend/index.html');
});

/* ── 404 Handler ───────────────────────────── */
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

/* ── Global Error Handler ──────────────────── */
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
