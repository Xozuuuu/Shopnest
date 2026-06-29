/* =============================================
   SHOPNEST — API Utility
   ============================================= */

/* ── Auto-detect API Base URL ────────────── */
const API_BASE = (function() {
  // Nếu mở qua HTTP/HTTPS (deployed hoặc localhost qua backend)
  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    return window.location.origin + '/api';
  }
  // Fallback cho file:// (dev local mở file trực tiếp)
  return 'http://localhost:3000/api';
})();

/* ── HTTP Helper ─────────────────────────── */
async function request(method, path, body = null, auth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('sn_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  let res;
  try {
    res = await fetch(API_BASE + path, opts);
  } catch (networkErr) {
    console.error('Network error:', networkErr);
    throw new Error(
      'Không thể kết nối đến server. Hãy đảm bảo:\n' +
      '1. Backend đang chạy (npm run dev trong thư mục backend)\n' +
      '2. Mở web qua http://localhost:3000/frontend/ thay vì mở file trực tiếp'
    );
  }

  // Safely parse JSON — handle empty or non-JSON responses
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (parseErr) {
    console.error('JSON parse error:', parseErr, 'Response text:', text.substring(0, 200));
    throw new Error(
      `Server trả về dữ liệu không hợp lệ (HTTP ${res.status}). ` +
      'Hãy kiểm tra backend đang chạy và database đã được cấu hình.'
    );
  }
  if (!res.ok) throw new Error(data.message || `Lỗi server (HTTP ${res.status})`);
  return data;
}
const GET    = (path, auth)       => request('GET',    path, null, auth);
const POST   = (path, body, auth) => request('POST',   path, body, auth);
const PUT    = (path, body, auth) => request('PUT',    path, body, auth);
const DELETE = (path, auth)       => request('DELETE', path, null, auth);

/* ── Upload Helper (multipart/form-data) ─── */
async function uploadFile(path, formData) {
  const headers = {};
  const token = localStorage.getItem('sn_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(API_BASE + path, {
      method: 'POST',
      headers,
      body: formData,
    });
  } catch (networkErr) {
    console.error('Upload network error:', networkErr);
    throw new Error('Không thể kết nối đến server để upload file');
  }

  // Safely parse JSON — handle empty or non-JSON responses
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (parseErr) {
    console.error('Upload JSON parse error:', parseErr);
    throw new Error(
      `Server trả về dữ liệu không hợp lệ (HTTP ${res.status}). ` +
      'Hãy kiểm tra backend đang chạy.'
    );
  }
  if (!res.ok) throw new Error(data.message || 'Lỗi upload');
  return data;
}

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
  uploadImage: (formData) => uploadFile('/products/upload', formData),
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
  requireLogin(redirect = null) {
    if (!this.isLoggedIn()) {
      location.href = redirect || getRelativePath('login');
      return false;
    }
    return true;
  },
  requireAdmin() {
    if (!this.isLoggedIn()) {
      location.href = getRelativePath('admin-login');
      return false;
    }
    if (!this.isAdmin()) {
      location.href = getRelativePath('index');
      return false;
    }
    return true;
  },
};

/* ── Path Helper for relative routing ─────── */
function getRelativePath(target) {
  const inAdmin = location.pathname.includes('/admin/');
  if (target === 'index') {
    return inAdmin ? '../index.html' : 'index.html';
  }
  if (target === 'admin-login') {
    return inAdmin ? 'admin-login.html' : 'admin/admin-login.html';
  }
  if (target === 'login') {
    return inAdmin ? '../login.html' : 'login.html';
  }
  if (target === 'admin-dashboard') {
    return inAdmin ? 'dashboard.html' : 'admin/dashboard.html';
  }
  return target;
}

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
  if (!badge) return;

  if (Auth.isLoggedIn()) {
    cartAPI.get()
      .then(data => {
        const count = data.items.reduce((s, i) => s + i.quantity, 0);
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
      })
      .catch(err => {
        console.error('Error fetching cart badge count:', err);
        const count = CartLocal.count();
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
      });
  } else {
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

/* ── Product Image Helper ──────────────────── */
/* ── Product Image Helper ──────────────────── */
function getProductImage(product) {
  if (product.image_url) {
    const src = getProductImageSrc(product);
    return `<img src="${src}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" onerror="this.parentElement.innerHTML='${product.icon || '📦'}'"/>`;
  }
  return product.icon || '📦';
}

function getProductImageSrc(product) {
  if (product.image_url) {
    if (product.image_url.startsWith('http')) return product.image_url;
    // Derive server origin from API_BASE (remove '/api' suffix)
    const serverOrigin = API_BASE.replace(/\/api$/, '');
    return serverOrigin + product.image_url;
  }
  return '';
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
      setTimeout(() => location.href = getRelativePath('index'), 800);
    });
  }
  // Hide/show nav links based on login state
  document.querySelectorAll('[data-show="guest"]').forEach(el => {
    el.style.display = user ? 'none' : 'block';
  });
  document.querySelectorAll('[data-show="user"]').forEach(el => {
    el.style.display = user ? 'block' : 'none';
  });
  
  // Show admin link if user is admin
  const dropdown = document.querySelector('.user-dropdown');
  if (dropdown) {
    let adminLink = dropdown.querySelector('[data-show="admin"]');
    if (user && user.role === 'admin') {
      if (!adminLink) {
        adminLink = document.createElement('a');
        adminLink.setAttribute('data-show', 'admin');
        adminLink.className = 'divider';
        adminLink.innerHTML = '👑 Quản trị Admin';
        const logoutBtnEl = dropdown.querySelector('#logoutBtn');
        if (logoutBtnEl) {
          dropdown.insertBefore(adminLink, logoutBtnEl);
        } else {
          dropdown.appendChild(adminLink);
        }
      }
      adminLink.href = getRelativePath('admin-dashboard');
      adminLink.style.display = 'block';
    } else if (adminLink) {
      adminLink.style.display = 'none';
    }
  }

  // Inject admin portal link to footer dynamically (column: Về ShopNest)
  const footerCol = document.querySelector('.footer-col:nth-child(3)');
  if (footerCol) {
    let adminFooterLink = footerCol.querySelector('.admin-footer-link');
    if (!adminFooterLink) {
      adminFooterLink = document.createElement('a');
      adminFooterLink.className = 'admin-footer-link';
      adminFooterLink.style.opacity = '0.5';
      adminFooterLink.style.fontSize = '12px';
      adminFooterLink.style.marginTop = '8px';
      adminFooterLink.style.display = 'block';
      footerCol.appendChild(adminFooterLink);
    }
    adminFooterLink.href = getRelativePath('admin-login');
    adminFooterLink.innerHTML = '🔒 Cổng Admin';
  }
});