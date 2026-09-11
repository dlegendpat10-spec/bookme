/* ===================================================================
   BOOKME — Business Configuration
   Edit this file to white-label Bookme for any business.
   =================================================================== */

const BUSINESS_CONFIG = {
  /* ── Identity ───────────────────────────────────────── */
  name:        'Bookme Appointments',
  shortName:   'Bookme',
  tagline:     'Frictionless appointment booking & scheduling.',
  description: 'Bookme empowers service businesses to offer seamless 1-tap bookings and automated scheduling.',

  /* ── Branding ───────────────────────────────────────── */
  // primaryColor is applied via CSS custom properties if overriding
  logo:        null,          // URL string or null (shows initials)
  initials:    'BM',

  /* ── Locale ─────────────────────────────────────────── */
  currency:        'NGN',
  currencySymbol:  '₦',
  locale:          'en-NG',
  timezone:        'Africa/Lagos',
  dateFormat:      'DD MMM YYYY',   // display format
  timeFormat:      '12h',           // '12h' or '24h'

  /* ── Booking Rules ──────────────────────────────────── */
  bookingLeadTimeHours: 1,    // min hours ahead a booking can be made
  slotIntervalMinutes:  30,   // granularity of time-slot grid
  maxBookingDaysAhead:  60,   // how far into the future clients can book

  /* ── Contact ────────────────────────────────────────── */
  phone:   '+234 800 000 0000',
  email:   'hello@bookme.app',
  address: 'Lagos, Nigeria',

  /* ── API Connection ──────────────────────────────────── */
  apiBaseUrl: 'https://bookmerefreshed.onrender.com',

  /* ── Social (optional) ──────────────────────────────── */
  social: {
    instagram: null,
    twitter:   null,
    whatsapp:  null,
  },
};

// Make globally available
window.BUSINESS_CONFIG = BUSINESS_CONFIG;
