/* ===================================================================
   BOOKME — Mock API Layer
   All functions mirror the real REST API shape.
   Replace fetch stubs with real calls when backend is ready.
   =================================================================== */

const API_BASE_URL = (window.BUSINESS_CONFIG && window.BUSINESS_CONFIG.apiBaseUrl) || 'https://bookmerefreshed.onrender.com';

// ── Seed Data ─────────────────────────────────────────────────────

const today      = new Date();
const todayStr   = fmt(today);
const tom        = new Date(today); tom.setDate(today.getDate() + 1);
const tomorrowStr = fmt(tom);
const d3 = new Date(today); d3.setDate(today.getDate() + 3);
const d5 = new Date(today); d5.setDate(today.getDate() + 5);
const d7 = new Date(today); d7.setDate(today.getDate() + 7);
const d10 = new Date(today); d10.setDate(today.getDate() + 10);
const d14 = new Date(today); d14.setDate(today.getDate() + 14);
const m3 = new Date(today); m3.setDate(today.getDate() - 3);
const m5 = new Date(today); m5.setDate(today.getDate() - 5);
const m8 = new Date(today); m8.setDate(today.getDate() - 8);
const m12 = new Date(today); m12.setDate(today.getDate() - 12);
const m20 = new Date(today); m20.setDate(today.getDate() - 20);

function fmt(d) {
  return d.getFullYear() + '-' +
    String(d.getMonth()+1).padStart(2,'0') + '-' +
    String(d.getDate()).padStart(2,'0');
}

const SEED = {
  services: [
    {
      id: 'svc-001',
      name: 'Discovery Call',
      description: 'A free 30-minute introductory session to understand your educational needs and goals.',
      duration_minutes: 30,
      price: 0,
      is_active: true,
      icon: '🎯',
      category: 'intro',
      created_at: '2025-01-15T08:00:00Z',
    },
    {
      id: 'svc-002',
      name: 'Initial Consultation',
      description: 'A comprehensive 90-minute deep-dive session covering academic history, learning style, and a customised study plan.',
      duration_minutes: 90,
      price: 25000,
      is_active: true,
      icon: '📋',
      category: 'consultation',
      created_at: '2025-01-15T08:00:00Z',
    },
    {
      id: 'svc-003',
      name: 'Follow-up Session',
      description: 'A 45-minute progress review and strategy adjustment session for existing clients.',
      duration_minutes: 45,
      price: 10000,
      is_active: true,
      icon: '🔄',
      category: 'session',
      created_at: '2025-01-15T08:00:00Z',
    },
    {
      id: 'svc-004',
      name: 'Full Academic Assessment',
      description: 'An in-depth 2-hour assessment covering skill gaps, subject-by-subject analysis, and a detailed report with recommendations.',
      duration_minutes: 120,
      price: 45000,
      is_active: true,
      icon: '📊',
      category: 'assessment',
      created_at: '2025-01-15T08:00:00Z',
    },
    {
      id: 'svc-005',
      name: 'Group Study Workshop',
      description: 'A 60-minute interactive group session for up to 5 students focusing on exam techniques and collaborative learning.',
      duration_minutes: 60,
      price: 8000,
      is_active: true,
      icon: '👥',
      category: 'group',
      created_at: '2025-01-15T08:00:00Z',
    },
    {
      id: 'svc-006',
      name: 'Exam Prep Intensive',
      description: 'A focused 75-minute targeted preparation session for WAEC, JAMB, SAT, or other competitive examinations.',
      duration_minutes: 75,
      price: 18000,
      is_active: false,
      icon: '✏️',
      category: 'exam',
      created_at: '2025-01-15T08:00:00Z',
    },
  ],

  customers: [],

  bookings: [],

  businessHours: [
    { id: 'bh-0', day_of_week: 0, day_name: 'Sunday',    opening_time: '09:00', closing_time: '13:00', is_open: false },
    { id: 'bh-1', day_of_week: 1, day_name: 'Monday',    opening_time: '09:00', closing_time: '17:00', is_open: true  },
    { id: 'bh-2', day_of_week: 2, day_name: 'Tuesday',   opening_time: '09:00', closing_time: '17:00', is_open: true  },
    { id: 'bh-3', day_of_week: 3, day_name: 'Wednesday', opening_time: '09:00', closing_time: '17:00', is_open: true  },
    { id: 'bh-4', day_of_week: 4, day_name: 'Thursday',  opening_time: '09:00', closing_time: '17:00', is_open: true  },
    { id: 'bh-5', day_of_week: 5, day_name: 'Friday',    opening_time: '09:00', closing_time: '17:00', is_open: true  },
    { id: 'bh-6', day_of_week: 6, day_name: 'Saturday',  opening_time: '10:00', closing_time: '14:00', is_open: true  },
  ],

  blockedDates: (() => {
    const blocked = [];
    const base = new Date();
    [4, 11, 18].forEach(offset => {
      const d = new Date(base);
      d.setDate(base.getDate() + offset);
      const ds = fmt(d);
      blocked.push({
        id: 'bd-' + offset,
        blocked_date: ds,
        reason: offset === 4 ? 'Public Holiday' : offset === 11 ? 'Staff Training Day' : 'Scheduled Maintenance',
        created_at: fmt(base),
      });
    });
    return blocked;
  })(),
};

// ── Persistence: keep runtime changes in memory ────────────────────
let DB = JSON.parse(JSON.stringify(SEED)); // deep copy

// ── Utility helpers ────────────────────────────────────────────────
function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function genId(prefix) {
  return prefix + '-' + Math.random().toString(36).slice(2, 7).toUpperCase();
}
function genRef() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let r = 'BKM-';
  for (let i = 0; i < 4; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return r;
}
function toMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}
function addMinutes(timeStr, mins) {
  const total = toMinutes(timeStr) + mins;
  return String(Math.floor(total / 60)).padStart(2,'0') + ':' + String(total % 60).padStart(2,'0');
}
function timesOverlap(s1, e1, s2, e2) {
  return toMinutes(s1) < toMinutes(e2) && toMinutes(e1) > toMinutes(s2);
}

// ── API Functions ──────────────────────────────────────────────────

// Services
async function getServices(includeInactive = false) {
  await delay();
  const services = includeInactive ? DB.services : DB.services.filter(s => s.is_active);
  return { data: services, error: null };
}
async function getService(id) {
  await delay();
  const svc = DB.services.find(s => s.id === id);
  return svc ? { data: svc, error: null } : { data: null, error: 'Service not found' };
}
async function createService(payload) {
  await delay(400);
  const svc = { id: genId('svc'), ...payload, is_active: payload.is_active ?? true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  DB.services.push(svc);
  return { data: svc, error: null };
}
async function updateService(id, payload) {
  await delay(400);
  const idx = DB.services.findIndex(s => s.id === id);
  if (idx === -1) return { data: null, error: 'Service not found' };
  DB.services[idx] = { ...DB.services[idx], ...payload, updated_at: new Date().toISOString() };
  return { data: DB.services[idx], error: null };
}
async function deleteService(id) {
  await delay(400);
  DB.services = DB.services.filter(s => s.id !== id);
  return { data: null, error: null };
}

// Customers
async function getCustomers() {
  await delay();
  return { data: [...DB.customers], error: null };
}
async function getCustomer(id) {
  await delay();
  const cust = DB.customers.find(c => c.id === id);
  return cust ? { data: cust, error: null } : { data: null, error: 'Customer not found' };
}
async function createCustomer(payload) {
  await delay(400);
  const existing = DB.customers.find(c => c.email === payload.email);
  if (existing) return { data: existing, error: null }; // return existing on email match
  const cust = { id: genId('cst'), ...payload, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  DB.customers.push(cust);
  return { data: cust, error: null };
}
async function updateCustomer(id, payload) {
  await delay(400);
  const idx = DB.customers.findIndex(c => c.id === id);
  if (idx === -1) return { data: null, error: 'Customer not found' };
  DB.customers[idx] = { ...DB.customers[idx], ...payload, updated_at: new Date().toISOString() };
  return { data: DB.customers[idx], error: null };
}
async function deleteCustomer(id) {
  await delay(400);
  DB.customers = DB.customers.filter(c => c.id !== id);
  return { data: null, error: null };
}
async function getCustomerBookings(customerId) {
  await delay();
  const bookings = DB.bookings.filter(b => b.customer_id === customerId);
  return { data: bookings, error: null };
}

// Bookings
async function getBookings(filters = {}) {
  await delay();
  let bookings = [...DB.bookings];
  if (filters.status) bookings = bookings.filter(b => b.status === filters.status);
  if (filters.date)   bookings = bookings.filter(b => b.booking_date === filters.date);
  if (filters.customerId) bookings = bookings.filter(b => b.customer_id === filters.customerId);
  // Sort by date asc, then time asc
  bookings.sort((a, b) => {
    const d = a.booking_date.localeCompare(b.booking_date);
    return d !== 0 ? d : a.start_time.localeCompare(b.start_time);
  });
  return { data: bookings, error: null };
}
async function getBooking(id) {
  await delay();
  const bk = DB.bookings.find(b => b.id === id);
  return bk ? { data: bk, error: null } : { data: null, error: 'Booking not found' };
}
async function createBooking(payload) {
  await delay(500);
  const { customer_id, service_id, booking_date, start_time, notes } = payload;
  const svc = DB.services.find(s => s.id === service_id);
  if (!svc) return { data: null, error: 'Service not found' };

  const end_time = addMinutes(start_time, svc.duration_minutes);

  // Check for conflicts (skip CANCELLED)
  const conflict = DB.bookings.find(b =>
    b.service_id === service_id &&
    b.booking_date === booking_date &&
    b.status !== 'CANCELLED' &&
    timesOverlap(b.start_time, b.end_time, start_time, end_time)
  );
  if (conflict) return { data: null, error: 'This time slot is no longer available. Please choose another.' };

  const booking = {
    id: genId('bk'),
    customer_id,
    service_id,
    booking_date,
    start_time,
    end_time,
    status: 'PENDING',
    notes: notes || '',
    booking_reference: genRef(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  DB.bookings.push(booking);
  return { data: booking, error: null };
}
async function updateBookingStatus(id, status) {
  await delay(400);
  const idx = DB.bookings.findIndex(b => b.id === id);
  if (idx === -1) return { data: null, error: 'Booking not found' };
  DB.bookings[idx].status = status;
  DB.bookings[idx].updated_at = new Date().toISOString();
  return { data: DB.bookings[idx], error: null };
}

// Availability
async function getAvailableSlots(serviceId, dateStr) {
  await delay(200);
  const svc = DB.services.find(s => s.id === serviceId);
  if (!svc) return { data: [], error: 'Service not found' };

  const date = new Date(dateStr + 'T00:00:00');
  const dow  = date.getDay();
  const bh   = DB.businessHours.find(h => h.day_of_week === dow);

  if (!bh || !bh.is_open) return { data: [], error: null };

  // Check blocked
  const isBlocked = DB.blockedDates.some(bd => bd.blocked_date === dateStr);
  if (isBlocked) return { data: [], error: null };

  const slots = [];
  const intervalMinutes = 30;
  let cursor = toMinutes(bh.opening_time);
  const end  = toMinutes(bh.closing_time);

  const cfg = window.BUSINESS_CONFIG || {};
  const leadMins = (cfg.bookingLeadTimeHours || 1) * 60;
  const nowMins  = new Date().getHours() * 60 + new Date().getMinutes();
  const isToday  = dateStr === fmt(new Date());

  while (cursor + svc.duration_minutes <= end) {
    const slotEnd = cursor + svc.duration_minutes;
    const timeStr = String(Math.floor(cursor/60)).padStart(2,'0') + ':' + String(cursor%60).padStart(2,'0');
    const endStr  = String(Math.floor(slotEnd/60)).padStart(2,'0') + ':' + String(slotEnd%60).padStart(2,'0');

    const tooSoon = isToday && cursor < nowMins + leadMins;
    const taken   = DB.bookings.some(b =>
      b.service_id === serviceId &&
      b.booking_date === dateStr &&
      b.status !== 'CANCELLED' &&
      timesOverlap(b.start_time, b.end_time, timeStr, endStr)
    );

    slots.push({
      time: timeStr,
      end:  endStr,
      display: formatTime(timeStr),
      available: !tooSoon && !taken,
    });
    cursor += intervalMinutes;
  }
  return { data: slots, error: null };
}

// Business Hours
async function getBusinessHours() {
  await delay();
  return { data: [...DB.businessHours], error: null };
}
async function updateBusinessHours(dayOfWeek, payload) {
  await delay(400);
  const idx = DB.businessHours.findIndex(h => h.day_of_week === dayOfWeek);
  if (idx === -1) return { data: null, error: 'Day not found' };
  DB.businessHours[idx] = { ...DB.businessHours[idx], ...payload };
  return { data: DB.businessHours[idx], error: null };
}

// Blocked Dates
async function getBlockedDates() {
  await delay();
  return { data: [...DB.blockedDates], error: null };
}
async function addBlockedDate(payload) {
  await delay(400);
  const bd = { id: genId('bd'), ...payload, created_at: new Date().toISOString() };
  DB.blockedDates.push(bd);
  return { data: bd, error: null };
}
async function removeBlockedDate(id) {
  await delay(400);
  DB.blockedDates = DB.blockedDates.filter(bd => bd.id !== id);
  return { data: null, error: null };
}

// Dashboard Stats
async function getDashboardStats() {
  await delay(200);
  const allBookings = DB.bookings;
  const todayBookings = allBookings.filter(b => b.booking_date === fmt(new Date()));
  const pendingBookings = allBookings.filter(b => b.status === 'PENDING');

  const thisMonth = new Date();
  const monthStart = fmt(new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1));
  const monthBookings = allBookings.filter(b =>
    b.booking_date >= monthStart &&
    b.status !== 'CANCELLED'
  );

  let revenue = 0;
  monthBookings.forEach(b => {
    const svc = DB.services.find(s => s.id === b.service_id);
    if (svc) revenue += svc.price;
  });

  return {
    data: {
      todayCount:    todayBookings.length,
      totalCustomers: DB.customers.length,
      pendingCount:  pendingBookings.length,
      monthRevenue:  revenue,
      totalBookings: allBookings.length,
    },
    error: null,
  };
}

// Auth (mock)
async function login(email, password) {
  await delay(600);
  if (email === 'admin@bookme.app' && password === 'admin123') {
    const user = { id: 'usr-001', email, full_name: 'Deji Ayomide', role: 'ADMIN' };
    localStorage.setItem('bookme_user', JSON.stringify(user));
    return { data: user, error: null };
  }
  return { data: null, error: 'Invalid email or password.' };
}
function logout() {
  localStorage.removeItem('bookme_user');
  // Redirect to login — works for file:// and hosted servers
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
  const cfg = window.BUSINESS_CONFIG || {};
  const [h, m] = timeStr.split(':').map(Number);
  if (cfg.timeFormat === '24h') return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2,'0')} ${period}`;
}
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}
function formatCurrency(amount) {
  const cfg = window.BUSINESS_CONFIG || {};
  const sym = cfg.currencySymbol || '₦';
  if (amount === 0) return 'Free';
  return sym + Number(amount).toLocaleString('en-NG');
}
function enrichBooking(booking) {
  const customer = DB.customers.find(c => c.id === booking.customer_id) || {};
  const service  = DB.services.find(s => s.id === booking.service_id)   || {};
  return { ...booking, customer, service };
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
