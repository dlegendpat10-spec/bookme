/* ===================================================================
   BOOKME — Direct REST API Layer (PostgreSQL Connected)
   All calls perform real HTTP requests to the REST backend.
   =================================================================== */

const API_BASE_URL = ((window.BUSINESS_CONFIG && window.BUSINESS_CONFIG.apiBaseUrl) || 'https://bookmerefreshed.onrender.com').replace(/\/$/, '') + '/api/v1';

async function request(endpoint, options = {}) {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    
    // Attach auth token if present
    const user = getAuthUser();
    if (user && user.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }

    const resp = await fetch(url, { ...options, headers });
    const json = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      return { data: null, error: json.error || `HTTP ${resp.status}: ${resp.statusText}` };
    }

    return { data: json.data !== undefined ? json.data : json, error: null };
  } catch (err) {
    console.warn(`[API fetch error for ${endpoint}]:`, err.message);
    return { data: null, error: err.message };
  }
}

// ── Services API ──────────────────────────────────────────────────
async function getServices(includeInactive = false) {
  return await request(`/services?includeInactive=${includeInactive}`);
}

async function getService(id) {
  return await request(`/services/${id}`);
}

async function createService(payload) {
  return await request(`/admin/services`, { method: 'POST', body: JSON.stringify(payload) });
}

async function updateService(id, payload) {
  return await request(`/admin/services/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
}

async function deleteService(id) {
  return await request(`/admin/services/${id}`, { method: 'DELETE' });
}

// ── Time Slots API ────────────────────────────────────────────────
async function getAvailableSlots(serviceId, date) {
  return await request(`/slots?serviceId=${serviceId}&date=${date}`);
}

// ── Bookings API ──────────────────────────────────────────────────
async function createBooking(payload) {
  const body = {
    service_id: payload.service_id || payload.serviceId,
    customer_id: payload.customer_id || payload.customerId || '00000000-0000-0000-0000-000000000002',
    booking_date: payload.booking_date || payload.date,
    start_time: payload.start_time || payload.time,
    notes: payload.notes || payload.customer_notes || '',
  };

  return await request('/bookings', { method: 'POST', body: JSON.stringify(body) });
}

async function getBookings(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  return await request(`/admin/bookings?${params}`);
}

async function getBooking(id) {
  return await request(`/admin/bookings/${id}`);
}

async function updateBookingStatus(id, status) {
  return await request(`/admin/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

// ── Customers API ─────────────────────────────────────────────────
async function getCustomers() {
  return await request('/admin/customers');
}

async function getCustomer(id) {
  return await request(`/admin/customers/${id}`);
}

async function createCustomer(payload) {
  return await request('/admin/customers', { method: 'POST', body: JSON.stringify(payload) });
}

async function updateCustomer(id, payload) {
  return await request(`/admin/customers/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
}

async function deleteCustomer(id) {
  return await request(`/admin/customers/${id}`, { method: 'DELETE' });
}

async function getCustomerBookings(id) {
  return await request(`/admin/customers/${id}/bookings`);
}

// ── Business Availability & Rules ──────────────────────────────────
async function getBusinessHours() {
  return await request('/admin/availability/hours');
}

async function updateBusinessHours(hours) {
  return await request('/admin/availability/hours', { method: 'PUT', body: JSON.stringify({ hours }) });
}

async function getBlockedDates() {
  return await request('/admin/availability/blocked-dates');
}

async function addBlockedDate(date, reason) {
  return await request('/admin/availability/blocked-dates', { method: 'POST', body: JSON.stringify({ blocked_date: date, reason }) });
}

async function removeBlockedDate(id) {
  return await request(`/admin/availability/blocked-dates/${id}`, { method: 'DELETE' });
}

async function getDashboardStats() {
  return await request('/admin/dashboard/stats');
}

// ── Auth ─────────────────────────────────────────────────────────
async function login(email, password) {
  const res = await request('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  if (res.data) {
    localStorage.setItem('bookme_user', JSON.stringify(res.data));
    return res;
  }
  return { data: null, error: res.error || 'Invalid email or password.' };
}

function logout() {
  localStorage.removeItem('bookme_user');
  const base = window.location.pathname.includes('/admin/') ? '' : 'admin/';
  window.location.href = base + 'index.html';
}

function getAuthUser() {
  const raw = localStorage.getItem('bookme_user');
  return raw ? JSON.parse(raw) : null;
}

function requireAuth() {
  if (!getAuthUser()) {
    window.location.href = 'index.html';
  }
}

// ── Format helpers ─────────────────────────────────────────────────
function formatTime(timeStr) {
  if (!timeStr) return '—';
  const cfg = window.BUSINESS_CONFIG || {};
  const [h, m] = timeStr.split(':').map(Number);
  if (cfg.timeFormat === '24h') return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2,'0')} ${period}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

function formatCurrency(amount) {
  const cfg = window.BUSINESS_CONFIG || {};
  const sym = cfg.currencySymbol || '₦';
  if (amount === 0 || amount === '0' || amount === '0.00') return 'Free';
  return sym + Number(amount).toLocaleString('en-NG');
}

function enrichBooking(booking) {
  return booking;
}

function fmt(d) {
  return d.getFullYear() + '-' +
    String(d.getMonth()+1).padStart(2,'0') + '-' +
    String(d.getDate()).padStart(2,'0');
}

// Expose on window
window.API = {
  baseURL: API_BASE_URL,
  getServices, getService, createService, updateService, deleteService,
  getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer, getCustomerBookings,
  getBookings, getBooking, createBooking, updateBookingStatus,
  getAvailableSlots,
  getBusinessHours, updateBusinessHours,
  getBlockedDates, addBlockedDate, removeBlockedDate,
  getDashboardStats,
  login, logout, getAuthUser, requireAuth,
  formatTime, formatDate, formatCurrency, enrichBooking,
  fmt,
};
