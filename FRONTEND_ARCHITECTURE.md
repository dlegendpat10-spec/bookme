# Bookme — Frontend Architecture

> **Version:** 1.0 (MVP)  
> **Stack:** Vanilla HTML · Vanilla CSS · Vanilla JavaScript (ES2022)  
> **Backend target:** Supabase (PostgreSQL) + Render-hosted REST API  
> **Last updated:** 2026-09-08

---

## Table of Contents

1. [Overview](#1-overview)
2. [Project Structure](#2-project-structure)
3. [Design System](#3-design-system)
4. [JavaScript Layer](#4-javascript-layer)
5. [Page Inventory](#5-page-inventory)
6. [Data Flow](#6-data-flow)
7. [Authentication](#7-authentication)
8. [Business Configuration](#8-business-configuration)
9. [Booking Logic](#9-booking-logic)
10. [Naming Conventions](#10-naming-conventions)
11. [Backend Integration Roadmap](#11-backend-integration-roadmap)
12. [Known Constraints & Decisions](#12-known-constraints--decisions)

---

## 1. Overview

Bookme is a **business-agnostic** booking and reservation management platform. The frontend is intentionally built as a zero-dependency, zero-framework HTML/CSS/JS application for maximum portability and minimal infrastructure requirements during the MVP phase.

### Design Philosophy

| Principle | Implementation |
|---|---|
| **Business-agnostic** | All business identity lives in `js/config.js` — swap it to white-label for any client |
| **API-first shape** | All `window.API.*` functions mirror real REST endpoints so backend swap-in is surgical |
| **Progressive enhancement** | Pages are semantic HTML first; JS enhances them after load |
| **Accessible by default** | ARIA roles, live regions, keyboard navigation, and focus management are built in |
| **Dark-mode first** | All colour tokens are dark-mode; no light-mode toggle needed for MVP |

---

## 2. Project Structure

```
bookme/
├── index.html                  # Public landing page
├── book.html                   # Customer booking wizard (4 steps)
├── confirmation.html           # Post-booking success page
│
├── admin/
│   ├── index.html              # Admin login
│   ├── dashboard.html          # Stats + today/upcoming view
│   ├── bookings.html           # Full bookings management
│   ├── customers.html          # Customer directory + profiles
│   ├── services.html           # Service CRUD
│   └── availability.html       # Business hours + blocked dates
│
├── styles/
│   ├── global.css              # Design tokens, resets, keyframes
│   └── components.css          # All reusable UI components
│
└── js/
    ├── config.js               # Business identity & booking rules
    ├── api.js                  # Mock API / data service layer
    └── app.js                  # Shared utilities (toasts, auth helpers, etc.)
```

> **Script load order on every page:**
> ```html
> <script src="[../]js/config.js"></script>   <!-- 1. Business config -->
> <script src="[../]js/api.js"></script>       <!-- 2. Data service -->
> <script src="[../]js/app.js"></script>       <!-- 3. Shared utilities -->
> <script>/* page-specific logic */</script>   <!-- 4. Inline page script -->
> ```

---

## 3. Design System

### 3.1 `global.css` — Design Tokens

All design decisions are expressed as CSS custom properties on `:root`. This makes theming and white-labelling a single-file change.

#### Colour Palette

```css
/* Core surfaces (dark-mode) */
--bg:         #07070F   /* Page background       */
--surface-1:  #0E0E1A   /* Cards, sidebars        */
--surface-2:  #13131F   /* Table headers, inputs  */
--surface-3:  #1A1A28   /* Hover states           */
--surface-4:  #222233   /* Active/selected states */

/* Accent (purple) */
--accent:     #7C3AED
--accent-lt:  #A78BFA   /* Lighter variant for text */
--accent-dim: rgba(124 58 237 / .12)  /* Subtle backgrounds */
--accent-glow:rgba(124 58 237 / .35)  /* Glow/shadow */

/* Semantic colours */
--success:  #10B981    --success-bg: rgba(16 185 129 / .1)
--warning:  #F59E0B    --warning-bg: rgba(245 158 11 / .1)
--danger:   #EF4444    --danger-bg:  rgba(239 68 68 / .1)
--info:     #3B82F6    --info-bg:    rgba(59 130 246 / .1)
```

#### Typography

```css
--font-sans: 'Inter', system-ui, sans-serif   /* All UI text      */
--font-mono: 'JetBrains Mono', monospace      /* Refs, codes, IDs */
```

#### Spacing & Radius

```css
/* Border radii */
--r-xs: 4px  --r-sm: 6px  --r-md: 8px  --r-lg: 12px
--r-xl: 16px --r-2xl: 20px --r-full: 9999px

/* Layout widths */
--sidebar-w: 240px
--header-h:  60px
--container: 1200px
```

#### Animation Tokens

```css
--ease-fast:   150ms ease
--ease-base:   250ms ease
--ease-spring: 400ms cubic-bezier(.34, 1.56, .64, 1)
```

### 3.2 `components.css` — Component Library

All reusable components are defined here. No inline styles or ad-hoc utilities are written on pages.

| Category | Classes |
|---|---|
| **Buttons** | `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, `.btn-outline` |
| **Sizes** | `.btn-sm`, `.btn-lg`, `.btn-xl`, `.btn-icon` |
| **Button states** | `.btn.loading` (spinner overlay via `::before`) |
| **Forms** | `.form-group`, `.form-label`, `.form-input`, `.form-select`, `.form-textarea`, `.form-hint`, `.form-error` |
| **Input wrapper** | `.input-wrapper`, `.input-icon`, `.input-icon-right` |
| **Toggle** | `.toggle`, `.toggle-track`, `.toggle-label` |
| **Badges** | `.badge`, `.badge-pending`, `.badge-confirmed`, `.badge-completed`, `.badge-cancelled`, `.badge-active`, `.badge-inactive` |
| **Tags** | `.tag` (no dot variant of badge) |
| **Stat card** | `.stat-card`, `.stat-card-icon`, `.stat-card-value`, `.stat-card-trend` |
| **Table** | `.table-wrapper`, `table`, `thead`, `th`, `td` |
| **Modal** | `dialog`, `.modal-header`, `.modal-body`, `.modal-footer`, `.modal-close` |
| **Step wizard** | `.step-indicator`, `.step`, `.step-circle`, `.step-label` |
| **Service card** | `.service-card`, `.service-card-check`, `.service-icon`, `.service-name`, `.service-price` |
| **Calendar** | `.calendar-wrapper`, `.calendar-day`, `.calendar-day.selected`, `.calendar-day.blocked` |
| **Time slots** | `.time-slots`, `.time-slot`, `.time-slot.taken`, `.time-slot.selected` |
| **Admin layout** | `.admin-layout`, `.sidebar`, `.admin-main`, `.admin-header`, `.admin-content` |
| **Navigation** | `.nav-item`, `.nav-item.active`, `.nav-badge` |
| **Animations** | `.animate-scale-in`, `.animate-fade-up`, `.delay-{100-600}` |
| **Utilities** | `.text-sm`, `.text-muted`, `.text-faint`, `.text-accent`, `.empty-state`, `.spinner`, `.card` |
| **Toast** | `#toast-container`, `.toast`, `.toast.success/error/warning` |
| **Search** | `.search-bar` |

---

## 4. JavaScript Layer

### 4.1 `js/config.js` — Business Configuration

Exposes `window.BUSINESS_CONFIG`. This is the **only file that changes** when deploying Bookme for a different business.

```js
window.BUSINESS_CONFIG = {
  name:                 'Bookmi Appointments',
  shortName:            'Bookmi',
  tagline:              '...',
  initials:             'BM',
  logo:                 null,           // URL or null -> initials fallback

  currency:             'NGN',
  currencySymbol:       'N',
  locale:               'en-NG',
  timezone:             'Africa/Lagos',
  timeFormat:           '12h',          // '12h' | '24h'

  bookingLeadTimeHours: 1,              // min advance booking time
  slotIntervalMinutes:  30,             // time slot grid granularity
  maxBookingDaysAhead:  60,             // calendar upper bound

  phone:   '+234 800 000 0000',
  email:   'hello@brainteaser.ng',
  address: 'Lagos, Nigeria',
  social:  { instagram: null, twitter: null, whatsapp: null },
};
```

> **DOM binding:** Any element with `data-business-name`, `data-business-tagline`, or `data-business-initials` is auto-populated by `app.js` on `DOMContentLoaded`.

---

### 4.2 `js/api.js` — Mock Data Service

The API layer is the most critical file for the backend transition. Every function:

- Is `async` and returns `{ data, error }` — the same shape a real REST/Supabase call would return.
- Simulates network latency via `delay(ms)`.
- Operates on an in-memory `DB` object seeded from `SEED` (a deep copy, so mutations don't affect the seed).

#### Exposed on `window.API`

| Namespace | Methods |
|---|---|
| **Services** | `getServices(includeInactive?)`, `getService(id)`, `createService(payload)`, `updateService(id, payload)`, `deleteService(id)` |
| **Customers** | `getCustomers()`, `getCustomer(id)`, `createCustomer(payload)`, `updateCustomer(id, payload)`, `deleteCustomer(id)`, `getCustomerBookings(customerId)` |
| **Bookings** | `getBookings(filters?)`, `getBooking(id)`, `createBooking(payload)`, `updateBookingStatus(id, status)` |
| **Availability** | `getAvailableSlots(serviceId, date)`, `getBusinessHours()`, `updateBusinessHours(dow, payload)`, `getBlockedDates()`, `addBlockedDate(payload)`, `removeBlockedDate(id)` |
| **Stats** | `getDashboardStats()` |
| **Auth** | `login(email, password)`, `logout()`, `getAuthUser()`, `requireAuth()` |
| **Formatters** | `formatTime(timeStr)`, `formatDate(dateStr)`, `formatCurrency(amount)`, `fmt(Date)` |

#### Booking Conflict Detection

`createBooking` runs an overlap check before inserting:

```
timesOverlap(s1, e1, s2, e2)
  -> true if toMinutes(s1) < toMinutes(e2) AND toMinutes(e1) > toMinutes(s2)
```

Any existing booking on the same date whose time range overlaps the requested window returns `{ data: null, error: 'This time slot is no longer available.' }`.

#### Slot Generation

`getAvailableSlots(serviceId, date)` generates slots dynamically:

1. Fetch the day's business hours from `DB.businessHours`.
2. Check if the date is in `DB.blockedDates` — return empty if blocked.
3. Walk from `opening_time` to `closing_time` in `slotIntervalMinutes` increments.
4. For each slot, check whether the service duration fits before closing time.
5. Mark slot as `available: false` if it overlaps any confirmed/pending booking.

---

### 4.3 `js/app.js` — Shared Utilities

Exposes `window.APP`.

| Function | Purpose |
|---|---|
| `APP.showToast(message, type, duration)` | Renders animated toast (success / error / warning / info) |
| `APP.setButtonLoading(btn, bool)` | Toggles spinner overlay on any `.btn`; restores original HTML on `false` |
| `APP.showSkeleton(container, rows)` | Renders shimmer skeleton placeholder rows |
| `APP.escapeHtml(str)` | XSS-safe HTML string escaping |
| `APP.statusBadge(status)` | Returns badge HTML string for PENDING / CONFIRMED / COMPLETED / CANCELLED |
| `APP.openModal(id)` / `APP.closeModal(id)` | `<dialog>.showModal()` / `.close()` wrappers; backdrop click auto-closes |
| `APP.copyToClipboard(text, feedbackEl)` | Clipboard API with fallback and toast feedback |
| `APP.isToday(dateStr)` / `APP.isFuture(dateStr)` | Date comparison helpers |
| `initSidebar()` | Wires mobile sidebar toggle, overlay, active nav highlight, and user info injection |
| `applyBusinessConfig()` | Hydrates `[data-business-*]` DOM elements from `BUSINESS_CONFIG` |

---

## 5. Page Inventory

### Public Pages

#### `index.html` — Landing Page

- **Purpose:** Marketing and entry point, drives traffic to `book.html`.
- **Sections:** Floating navbar · Hero with booking preview card · Live stats strip · Services grid (dynamic from `API.getServices()`) · How It Works · Footer.
- **Key behaviour:** Services grid renders on `DOMContentLoaded`. Clicking a service card passes `?service={id}` to `book.html` for pre-selection.

---

#### `book.html` — Booking Wizard

A 4-step linear wizard with a persistent sidebar booking summary.

```
Step 1: Select Service  ->  Step 2: Date & Time  ->  Step 3: Your Details  ->  Step 4: Review & Confirm
```

| Step | Key Components | Validation |
|---|---|---|
| 1 — Service | `.service-card` radio-like grid | Next disabled until a card is selected |
| 2 — Date & Time | Custom calendar + time slot grid | Next disabled until date and time both chosen |
| 3 — Details | HTML5 form (name, email, phone, notes) | `form.checkValidity()` + `:user-invalid` CSS feedback |
| 4 — Confirm | Read-only summary grid | `API.createBooking()` -> redirect to `confirmation.html` |

**Wizard state object:**

```js
const state = {
  step:         1,
  service:      null,    // selected service object
  date:         null,    // 'YYYY-MM-DD'
  time:         null,    // 'HH:MM'
  customer:     {},      // { first_name, last_name, email, phone, notes }
  calMonth,              // calendar navigation
  calYear,
  blockedDates: [],      // pre-loaded on init
  businessHours: [],     // pre-loaded on init
};
```

---

#### `confirmation.html` — Booking Confirmed

- Reads booking details from URL query params (`?ref=&name=&service=&date=&time=&price=`).
- Displays animated success icon, reference card with copy-to-clipboard, appointment detail rows, and a next-steps guide.

---

### Admin Pages

All admin pages call `API.requireAuth()` immediately and share the same sidebar markup. Sidebar behaviour is wired automatically by `app.js initSidebar()`.

#### `admin/index.html` — Login

- Demo credentials: `admin@bookme.app` / `admin123`
- Stores user as JSON in `localStorage` (`bookme_user`) and redirects to `dashboard.html` on success.

#### `admin/dashboard.html` — Dashboard

- Stats cards: Today's bookings · Total customers · Pending bookings · Month revenue.
- Today's appointments (filtered by `booking_date === today`).
- Upcoming appointments (next 7 days, non-cancelled).
- Recent customers (last 6 added).

#### `admin/bookings.html` — Bookings

- Live search across name, email, and booking reference.
- Status filter chips (All / Pending / Confirmed / Completed / Cancelled).
- Date picker filter.
- Inline `<dialog>` modal for status transitions.
- Local state mutated optimistically after update; no re-fetch required.

#### `admin/customers.html` — Customers

- Responsive card grid (auto-fill, min 320px per card).
- Add/edit via `<dialog>` modal form.
- Detail panel (second `<dialog>`) shows full profile and booking history list.
- `createCustomer` upserts by email — returns existing record if email already exists.

#### `admin/services.html` — Services

- Card grid with active/inactive badge and inline toggle switch per service.
- Add/edit via `<dialog>` modal; delete via confirmation `<dialog>`.
- Toggle switch calls `API.updateService(id, { is_active })` without full re-render.
- Live count: "X active / Y total" in header bar.

#### `admin/availability.html` — Availability

**Business Hours panel:**
- One row per day of week (0=Sunday through 6=Saturday).
- Each row: open/closed toggle + opening time + closing time.
- Batch save via single "Save Hours" button.

**Blocked Dates panel:**
- Lists all blocked dates sorted ascending; past dates shown at 50% opacity.
- Add via modal (date picker + optional reason text).
- Remove inline with individual buttons.

---

## 6. Data Flow

```
Browser
  HTML page
    └── inline <script>
         ├── window.BUSINESS_CONFIG  (config.js)
         ├── window.API.*            (api.js)
         └── window.APP.*           (app.js)

  window.API.someFunction()
    [MVP]   reads/writes in-memory DB object
    [v2]    fetch() -> Render / Supabase REST API

  Return shape: { data: T | null, error: string | null }
```

### Customer Booking Flow (end-to-end)

```
index.html --(click service)--> book.html?service=svc-001
  |
  |-- Step 1: API.getServices()
  |-- Step 2: API.getAvailableSlots(serviceId, date)
  |             |-- API.getBusinessHours()
  |             |-- API.getBlockedDates()
  |-- Step 3: Native HTML5 form validation
  |-- Step 4: API.createCustomer(payload)    [upsert by email]
              API.createBooking(payload)     [conflict check]
                   |-- window.location -> confirmation.html?ref=BKM-XXXX&...
```

---

## 7. Authentication

| Item | Detail |
|---|---|
| **Mechanism** | Mock: hardcoded credentials. Real target: Supabase Auth JWT. |
| **Session storage** | `localStorage` key `bookme_user` → JSON `{ id, email, full_name, role }` |
| **Auth guard** | `API.requireAuth()` at top of every admin page; redirects if no session |
| **Logout** | `API.logout()` clears `localStorage` and redirects to `admin/index.html` |
| **Sidebar user** | `initSidebar()` reads session and injects name and initials avatar |

> **v2 note:** Replace `login()` with `supabase.auth.signInWithPassword()`. The session object shape adjusts to `user.user_metadata.full_name`.

---

## 8. Business Configuration

The platform is white-label ready. To deploy for a new business:

1. Edit `js/config.js` — update name, tagline, initials, currency, timezone, booking rules, and contact.
2. Optionally override `--accent` and `--accent-lt` in `global.css` to change the brand colour.
3. Seed `api.js` with the new business's services, hours, and blocked dates — or connect to Supabase.

All pages pick up the config automatically via:
- `window.BUSINESS_CONFIG.*` references in JS
- `[data-business-name]`, `[data-business-tagline]`, `[data-business-initials]` DOM attributes

---

## 9. Booking Logic

### Time Slot Generation Algorithm

```
For date D, service S with duration_minutes = M:
  1. Get businessHours[dayOfWeek(D)]
  2. If !is_open OR D in blockedDates -> return []
  3. Walk t = opening_time to closing_time, step = slotIntervalMinutes
     - Skip if (t + M) > closing_time  (slot doesn't fit before close)
     - end_t = t + M
     - available = !any existing booking on D where
                   timesOverlap(t, end_t, b.start_time, b.end_time)
                   AND b.status IN ('PENDING', 'CONFIRMED')
  4. Return [{ time: t, display: formatTime(t), available }]
```

### Booking Conflict Check

```
createBooking({ booking_date, start_time, service_id }):
  end_time = start_time + service.duration_minutes
  conflict = DB.bookings.find(b =>
    b.booking_date === booking_date
    && b.status in ['PENDING', 'CONFIRMED']
    && timesOverlap(start_time, end_time, b.start_time, b.end_time)
  )
  if conflict -> return { data: null, error: 'This time slot is no longer available.' }
```

### Status State Machine

```
PENDING --confirm--> CONFIRMED --complete--> COMPLETED
   |                     |
   +----cancel-----------+--> CANCELLED
```

All transitions are manual (admin-initiated via the Bookings page status modal).

---

## 10. Naming Conventions

| Concern | Convention | Example |
|---|---|---|
| **IDs (seed data)** | `{entity}-{3-digit number}` | `svc-001`, `cst-010`, `bk-004` |
| **Generated IDs** | `{prefix}-{5-char alphanumeric}` | `svc-3XK7P` |
| **Booking references** | `BKM-{4-char}` (uppercase, no ambiguous chars) | `BKM-8K2L` |
| **CSS BEM-lite** | Block plus modifier via dash | `.service-card`, `.service-card.selected` |
| **CSS custom props** | Double-dash, kebab-case | `--accent-lt`, `--r-xl` |
| **JS API functions** | camelCase verb + entity | `getServices`, `createBooking`, `updateBookingStatus` |
| **JS state** | camelCase | `state.service`, `state.calMonth` |
| **HTML data attrs** | `data-{entity}-{prop}` | `data-business-name`, `data-id` |
| **localStorage keys** | `bookme_{key}` | `bookme_user` |

---

## 11. Backend Integration Roadmap

Every `window.API.*` function is a drop-in replacement point. The `{ data, error }` return shape is already aligned with Supabase JS client responses.

### Phase Plan

```
Phase 1 (current):  Mock API — in-memory DB + localStorage auth
Phase 2 (next):     Supabase REST / JS client for real persistence
Phase 3 (future):   Transport module (vehicles, routes, pricing)
```

### Key Swap Points

| Current (Mock) | Target (Supabase) |
|---|---|
| `DB.services.filter(...)` | `supabase.from('services').select('*').eq('is_active', true)` |
| `DB.customers.find(...)` | `supabase.from('customers').select('*').eq('id', id).single()` |
| `DB.bookings.push(...)` | `supabase.from('bookings').insert(payload)` |
| `localStorage bookme_user` | `supabase.auth.getSession()` |
| `API.login(email, pw)` | `supabase.auth.signInWithPassword({ email, password })` |
| `API.requireAuth()` | Async check of `supabase.auth.getSession()`, redirect if null |

### Environment Variables (when hosted)

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_BASE_URL=https://bookmerefreshed.onrender.com
```

---

## 12. Known Constraints & Decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | No bundler or framework for MVP | Fastest time-to-demo; zero npm install for static file serving |
| 2 | Sidebar duplicated per admin page | No server-side includes; avoids iframe or JS component complexity in MVP |
| 3 | `localStorage` for mock auth | Real auth deferred to backend integration phase |
| 4 | In-memory `DB` resets on page reload | Intentional for demo; Supabase will provide real persistence |
| 5 | Staff selection skipped | PRD lists this as a post-MVP feature |
| 6 | Default currency NGN | Default currency set to NGN (Lagos). Overridable via `config.js` |
| 7 | No payment gateway | Payments out of scope for MVP; "Pay on the day" UX copy used |
| 8 | `file://` protocol compatible | Paths use relative URLs; `requireAuth` uses relative redirect |
| 9 | Conflict detection is client-side only | Sufficient for mock; real backend must enforce uniqueness at DB level via row-locking or unique constraints |

---

*Generated by Antigravity IDE · Bookme MVP Frontend · September 2026*
