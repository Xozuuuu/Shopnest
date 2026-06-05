/* =============================================
   SHOPNEST — Product Controller
   ============================================= */

const pool   = require('../config/db');
const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

/* ── Multer Config ──────────────────────────── */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = 'product_' + Date.now() + '_' + Math.round(Math.random() * 1000) + ext;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (jpg, png, gif, webp)'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

exports.uploadMiddleware = upload.single('image');

/* ── POST /api/products/upload (Admin) ──────── */
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng chọn file ảnh' });
    }

    const imageUrl = '/uploads/' + req.file.filename;

    res.json({
      message: 'Upload ảnh thành công!',
      imageUrl,
      filename: req.file.filename,
    });
  } catch (err) {
    console.error('Upload image error:', err);
    res.status(500).json({ message: 'Lỗi server khi upload ảnh' });
  }
};

/* ── GET /api/products ───────────────────────── */
exports.getAll = async (req, res) => {
  try {
    const { category, page = 1, limit = 20, sort, search } = req.query;

    let query  = `
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    const params = [];
    const conditions = [];

    // Filter by category slug
    if (category) {
      conditions.push(`c.slug = $${params.length + 1}`);
      params.push(category);
    }

    // Search by name
    if (search) {
      conditions.push(`p.name ILIKE $${params.length + 1}`);
      params.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Sorting
    switch (sort) {
      case 'price_asc':  query += ' ORDER BY p.price ASC';  break;
      case 'price_desc': query += ' ORDER BY p.price DESC'; break;
      case 'newest':     query += ' ORDER BY p.created_at DESC'; break;
      case 'sold':       query += ' ORDER BY p.sold DESC';  break;
      default:           query += ' ORDER BY p.id ASC';
    }

    // Pagination
    const offset = (Number(page) - 1) * Number(limit);
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(Number(limit), offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.id';
    const countParams = [];
    const countConditions = [];
    if (category) {
      countConditions.push('c.slug = $' + (countParams.length + 1));
      countParams.push(category);
    }
    if (search) {
      countConditions.push('p.name ILIKE $' + (countParams.length + 1));
      countParams.push(`%${search}%`);
    }
    if (countConditions.length > 0) {
      countQuery += ' WHERE ' + countConditions.join(' AND ');
    }
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      products: result.rows,
      total,
      page:  Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách sản phẩm' });
  }
};

/* ── GET /api/products/search ────────────────── */
exports.search = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Vui lòng nhập từ khóa tìm kiếm' });
    }

    const result = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.name ILIKE $1
       ORDER BY p.sold DESC
       LIMIT 20`,
      [`%${q}%`]
    );

    res.json({ products: result.rows });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Lỗi server khi tìm kiếm' });
  }
};

/* ── GET /api/products/:id ───────────────────── */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json({ product: result.rows[0] });
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy sản phẩm' });
  }
};

/* ── POST /api/products (Admin) ──────────────── */
exports.create = async (req, res) => {
  try {
    const { name, price, original_price, category_id, icon, bg_color, description, stock, image_url } = req.body;

    if (!name || !price || !original_price) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin sản phẩm' });
    }

    const result = await pool.query(
      `INSERT INTO products (name, price, original_price, category_id, icon, bg_color, description, stock, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, price, original_price, category_id || null, icon || '📦', bg_color || '#F5F5F5', description || '', stock || 100, image_url || '']
    );

    res.status(201).json({
      message: 'Tạo sản phẩm thành công!',
      product: result.rows[0],
    });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ message: 'Lỗi server khi tạo sản phẩm' });
  }
};

/* ── PUT /api/products/:id (Admin) ───────────── */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, original_price, category_id, icon, bg_color, description, stock, image_url } = req.body;

    const result = await pool.query(
      `UPDATE products SET
        name           = COALESCE($1, name),
        price          = COALESCE($2, price),
        original_price = COALESCE($3, original_price),
        category_id    = COALESCE($4, category_id),
        icon           = COALESCE($5, icon),
        bg_color       = COALESCE($6, bg_color),
        description    = COALESCE($7, description),
        stock          = COALESCE($8, stock),
        image_url      = COALESCE($9, image_url)
       WHERE id = $10 RETURNING *`,
      [name, price, original_price, category_id, icon, bg_color, description, stock, image_url, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json({
      message: 'Cập nhật sản phẩm thành công!',
      product: result.rows[0],
    });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật sản phẩm' });
  }
};

/* ── DELETE /api/products/:id (Admin) ────────── */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    // Get image_url before deleting to clean up file
    const product = await pool.query('SELECT image_url FROM products WHERE id = $1', [id]);
    if (product.rows.length > 0 && product.rows[0].image_url) {
      const imgPath = path.join(__dirname, '..', '..', product.rows[0].image_url);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json({ message: 'Xóa sản phẩm thành công!' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Lỗi server khi xóa sản phẩm' });
  }
};

/* ── GET /api/categories ─────────────────────── */
exports.getCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    res.json({ categories: result.rows });
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh mục' });
  }
};

/* ── POST /api/categories (Admin) ────────────── */
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, icon } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: 'Vui lòng nhập tên và slug danh mục' });
    }

    const result = await pool.query(
      'INSERT INTO categories (name, slug, icon) VALUES ($1, $2, $3) RETURNING *',
      [name, slug, icon || '📦']
    );

    res.status(201).json({
      message: 'Tạo danh mục thành công!',
      category: result.rows[0],
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Slug danh mục đã tồn tại' });
    }
    console.error('Create category error:', err);
    res.status(500).json({ message: 'Lỗi server khi tạo danh mục' });
  }
};

/* ── PUT /api/categories/:id (Admin) ─────────── */
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, icon } = req.body;

    const result = await pool.query(
      `UPDATE categories SET
        name = COALESCE($1, name),
        slug = COALESCE($2, slug),
        icon = COALESCE($3, icon)
       WHERE id = $4 RETURNING *`,
      [name, slug, icon, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }

    res.json({
      message: 'Cập nhật danh mục thành công!',
      category: result.rows[0],
    });
  } catch (err) {
    console.error('Update category error:', err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật danh mục' });
  }
};

/* ── DELETE /api/categories/:id (Admin) ──────── */
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }

    res.json({ message: 'Xóa danh mục thành công!' });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ message: 'Lỗi server khi xóa danh mục' });
  }
};
