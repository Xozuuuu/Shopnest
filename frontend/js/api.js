/* =============================================
   SHOPNEST — API Utility
   Base URL: thay đổi khi có backend thật
   ============================================= */

const API_BASE = 'http://localhost:3000/api';

/* ── HTTP Helper ─────────────────────────── */
async function request(method, path, body = null, auth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('sn_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res  = await fetch(API_BASE + path, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Lỗi không xác định');
  return data;
}
const GET    = (path, auth)       => request('GET',    path, null, auth);
const POST   = (path, body, auth) => request('POST',   path, body, auth);
const PUT    = (path, body, auth) => request('PUT',    path, body, auth);
const DELETE = (path, auth)       => request('DELETE', path, null, auth);

/* ── Auth ────────────────────────────────── */
const authAPI = {
  login:    (email, password)     => POST('/auth/login',    { email, password }),
  register: (name, email, password) => POST('/auth/register', { name, email, password }),
  logout:   ()                    => POST('/auth/logout',   null, true),
  me:       ()                    => GET('/auth/me',        true),
};

/* ── Products ────────────────────────────── */
const productAPI = {
  getAll:  (params = {}) => GET('/products?' + new URLSearchParams(params)),
  getById: (id)          => GET(`/products/${id}`),
  search:  (q)           => GET(`/products/search?q=${encodeURIComponent(q)}`),
  getByCategory: (cat)   => GET(`/products?category=${cat}`),
  // Admin only
  create:  (data)        => POST('/products',      data, true),
  update:  (id, data)    => PUT(`/products/${id}`, data, true),
  delete:  (id)          => DELETE(`/products/${id}`, true),
};

/* ── Cart ────────────────────────────────── */
const cartAPI = {
  get:    ()               => GET('/cart',             true),
  add:    (productId, qty) => POST('/cart/add',   { productId, quantity: qty }, true),
  update: (cartItemId, qty)=> PUT(`/cart/${cartItemId}`, { quantity: qty }, true),
  remove: (cartItemId)     => DELETE(`/cart/${cartItemId}`, true),
  clear:  ()               => DELETE('/cart/clear',    true),
};

/* ── Orders ──────────────────────────────── */
const orderAPI = {
  getAll:   ()           => GET('/orders',          true),
  getById:  (id)         => GET(`/orders/${id}`,    true),
  create:   (data)       => POST('/orders',   data, true),
  cancel:   (id)         => PUT(`/orders/${id}/cancel`, {}, true),
  // Admin
  getAllAdmin: (params)   => GET('/admin/orders?' + new URLSearchParams(params), true),
  updateStatus: (id, status) => PUT(`/admin/orders/${id}/status`, { status }, true),
};

/* ── Users / Profile ─────────────────────── */
const userAPI = {
  updateProfile: (data)  => PUT('/users/profile',         data,   true),
  changePassword:(data)  => PUT('/users/change-password', data,   true),
  // Admin
  getAllAdmin:   (params) => GET('/admin/users?' + new URLSearchParams(params), true),
  blockUser:    (id)     => PUT(`/admin/users/${id}/block`, {}, true),
};

/* ── Categories ──────────────────────────── */
const categoryAPI = {
  getAll:  ()       => GET('/categories'),
  create:  (data)   => POST('/categories',      data, true),
  update:  (id, d)  => PUT(`/categories/${id}`, d,    true),
  delete:  (id)     => DELETE(`/categories/${id}`,    true),
};

/* ── Review ──────────────────────────────── */
const reviewAPI = {
  getByProduct: (productId) => GET(`/reviews?productId=${productId}`),
  create: (data)            => POST('/reviews', data, true),
};

/* ── Dashboard (Admin) ───────────────────── */
const dashboardAPI = {
  stats:         () => GET('/admin/dashboard/stats',   true),
  recentOrders:  () => GET('/admin/dashboard/orders',  true),
  topProducts:   () => GET('/admin/dashboard/products',true),
};

/* ── Auth State Helpers ───────────────────── */
const Auth = {
  save(token, user) {
    localStorage.setItem('sn_token', token);
    localStorage.setItem('sn_user',  JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem('sn_token');
    localStorage.removeItem('sn_user');
  },
  getToken() { return localStorage.getItem('sn_token'); },
  getUser()  {
    const u = localStorage.getItem('sn_user');
    return u ? JSON.parse(u) : null;
  },
  isLoggedIn() { return !!this.getToken(); },
  isAdmin()    {
    const u = this.getUser();
    return u && u.role === 'admin';
  },
  requireLogin(redirect = '/login.html') {
    if (!this.isLoggedIn()) { location.href = redirect; return false; }
    return true;
  },
  requireAdmin() {
    if (!this.isAdmin()) { location.href = '/index.html'; return false; }
    return true;
  },
};

/* ── Cart Local State ─────────────────────── */
const CartLocal = {
  _key: 'sn_cart',
  get()   { return JSON.parse(localStorage.getItem(this._key) || '[]'); },
  save(c) { localStorage.setItem(this._key, JSON.stringify(c)); },
  add(product, qty = 1) {
    const cart = this.get();
    const idx  = cart.findIndex(i => i.id === product.id);
    if (idx >= 0) cart[idx].quantity += qty;
    else cart.push({ ...product, quantity: qty });
    this.save(cart);
    updateCartBadge();
  },
  remove(id) {
    const cart = this.get().filter(i => i.id !== id);
    this.save(cart);
    updateCartBadge();
  },
  update(id, qty) {
    const cart = this.get();
    const item = cart.find(i => i.id === id);
    if (item) { item.quantity = qty; }
    if (qty <= 0) return this.remove(id);
    this.save(cart);
    updateCartBadge();
  },
  clear()  { localStorage.removeItem(this._key); updateCartBadge(); },
  count()  { return this.get().reduce((s, i) => s + i.quantity, 0); },
  total()  { return this.get().reduce((s, i) => s + i.price * i.quantity, 0); },
};

/* ── UI Helpers ──────────────────────────── */
function showToast(msg, type = 'info') {
  let c = document.getElementById('toast-container');
  if (!c) { c = document.createElement('div'); c.id = 'toast-container'; document.body.appendChild(c); }
  const t = document.createElement('div');
  const icons = { success: '✅', error: '❌', info: '🔔' };
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(100%)'; t.style.transition = '.3s'; setTimeout(() => t.remove(), 300); }, 3000);
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    const count = CartLocal.count();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function formatPrice(p) {
  return '₫' + Number(p).toLocaleString('vi-VN');
}

function calcDiscount(original, price) {
  return Math.round((1 - price / original) * 100);
}

function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

/* ── Init Navbar State ───────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  const user = Auth.getUser();
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      Auth.clear();
      CartLocal.clear();
      showToast('Đăng xuất thành công!', 'info');
      setTimeout(() => location.href = '/frontend/index.html', 800);
    });
  }
  // Hide/show nav links based on login state
  const loginLink   = document.querySelector('[data-show="guest"]');
  const profileLink = document.querySelector('[data-show="user"]');
  if (user) {
    if (loginLink)   loginLink.style.display   = 'none';
    if (profileLink) profileLink.style.display = 'block';
  }
});