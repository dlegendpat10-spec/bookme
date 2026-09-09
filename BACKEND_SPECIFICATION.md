# BOOKME — BACKEND ARCHITECTURE & SPECIFICATION

This document provides the complete, authoritative specification for the BookMe backend service. It is designed to be implemented on **Render** (Node.js/Express or Fastify) backed by **Supabase PostgreSQL** and **Redis (BullMQ)** for asynchronous decoupled job queues.

---

## 1. System Architecture Overview

```mermaid
graph TD
    Client["Frontend Clients (Web & Mobile)"] --> CDN["Cloudflare / Reverse Proxy"]
    CDN --> API["Render Web Service (Node.js + Express / Fastify)"]
    
    %% Sync Operations
    API --> Auth["Supabase GoTrue (JWT Authentication)"]
    API --> DB[("Supabase PostgreSQL (ACID Transactions + RLS)")]
    
    %% Concurrency Guard
    DB --> Lock["PostgreSQL GIST Exclusion Constraint (Double-Booking Prevention)"]
    
    %% Async Decoupled Flow
    API -.-> EventBus["Redis Instance (BullMQ Queue)"]
    EventBus -.-> EmailWorker["Worker: Postmark / SendGrid (Emails)"]
    EventBus -.-> SMSWorker["Worker: Twilio / Termii (SMS)"]
    EventBus -.-> WAWorker["Worker: Meta WhatsApp Cloud API"]
    EventBus -.-> ReminderWorker["Worker: Pre-Appointment Cron (T-24h, T-2h)"]
    EventBus -.-> AnalyticsWorker["Worker: Aggregation Rollup Engine"]
```

### Core Architectural Principles
1. **Ultra-Fast Synchronous Path**: The booking creation endpoint must return HTTP 201 Created in **< 200ms**. It writes directly to PostgreSQL and returns immediately.
2. **Asynchronous Secondary Operations**: Non-essential tasks (Email dispatch, SMS delivery, WhatsApp messaging, reminder scheduling, and analytics counters) are pushed to BullMQ and processed by background worker threads.
3. **Double-Booking Prevention at Database Level**: Never rely on application-level checks alone. An atomic PostgreSQL exclusion constraint guarantees that no two overlapping active appointments can be created for the same business/specialist.

---

## 2. PostgreSQL Database Schema (DDL)

```sql
-- Extensions required for UUID and Concurrency Time Range Exclusions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ============================================================================
-- 1. USERS & ROLES
-- ============================================================================
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'BUSINESS_ADMIN', 'PLATFORM_ADMIN');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    encrypted_password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. BUSINESS TENANTS
-- ============================================================================
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    logo_url TEXT,
    phone_number VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    accent_color VARCHAR(20) DEFAULT '#6366F1',
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_businesses_slug ON businesses(slug);

-- ============================================================================
-- 3. BUSINESS OPERATING HOURS
-- ============================================================================
CREATE TABLE business_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 6=Sat
    is_closed BOOLEAN DEFAULT FALSE,
    opening_time TIME NOT NULL,
    closing_time TIME NOT NULL,
    UNIQUE(business_id, day_of_week)
);

-- ============================================================================
-- 4. BLOCKED DATES (HOLIDAYS & VACATIONS)
-- ============================================================================
CREATE TABLE blocked_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason VARCHAR(255)
);

-- ============================================================================
-- 5. SERVICE CATALOG
-- ============================================================================
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
    buffer_minutes INT DEFAULT 0,
    price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'NGN',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_business ON services(business_id);

-- ============================================================================
-- 6. CUSTOMER PROFILES (CRM)
-- ============================================================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(business_id, email)
);

CREATE INDEX idx_customers_search ON customers(business_id, phone_number, email);

-- ============================================================================
-- 7. SERVICE BOOKINGS (CONCURRENCY-SAFE EXCLUSION CONSTRAINT)
-- ============================================================================
CREATE TYPE booking_status_type AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');
CREATE TYPE payment_status_type AS ENUM ('UNPAID', 'PENDING', 'PAID', 'FAILED', 'REFUNDED');

CREATE TABLE service_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE RESTRICT,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    booking_status booking_status_type DEFAULT 'CONFIRMED',
    payment_status payment_status_type DEFAULT 'UNPAID',
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NGN',
    customer_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- PREVENTS OVERLAPPING BOOKINGS FOR THE SAME TENANT
    CONSTRAINT prevent_double_booking 
    EXCLUDE USING gist (
        business_id WITH =,
        tstzrange(start_time, end_time) WITH &&
    ) WHERE (booking_status NOT IN ('CANCELLED'))
);

CREATE INDEX idx_bookings_schedule ON service_bookings(business_id, start_time, end_time);

-- ============================================================================
-- 8. PAYMENTS & TRANSACTIONS
-- ============================================================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES service_bookings(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NGN',
    payment_method VARCHAR(50) NOT NULL,
    gateway_reference VARCHAR(255) UNIQUE,
    status payment_status_type DEFAULT 'PENDING',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 9. NOTIFICATIONS & REMINDER SCHEDULER
-- ============================================================================
CREATE TABLE notification_dispatches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES service_bookings(id) ON DELETE CASCADE,
    channel VARCHAR(20) NOT NULL, -- 'EMAIL', 'SMS', 'WHATSAPP'
    recipient VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    sent_at TIMESTAMPTZ,
    error_message TEXT
);

CREATE TABLE scheduled_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES service_bookings(id) ON DELETE CASCADE,
    remind_at TIMESTAMPTZ NOT NULL,
    channel VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    dispatched_at TIMESTAMPTZ
);

CREATE INDEX idx_reminders_due ON scheduled_reminders(remind_at, status);

-- ============================================================================
-- 10. IDEMPOTENCY KEYS (FOR SAFE RE-TRIES & PAYMENT WEBHOOKS)
-- ============================================================================
CREATE TABLE idempotency_keys (
    key VARCHAR(255) PRIMARY KEY,
    response_body JSONB NOT NULL,
    status_code INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. Double-Booking Concurrency Algorithm

When a booking request arrives at `POST /api/v1/bookings`:

```typescript
// backend/src/controllers/bookingController.ts
import { Request, Response } from 'express';
import { db } from '../db';
import { queueNotificationJobs } from '../queues/notificationQueue';

export async function createBookingHandler(req: Request, res: Response) {
  const { business_id, service_id, customer_data, start_time } = req.body;
  
  const client = await db.getClient();
  try {
    await client.query('BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED');

    // 1. Fetch Service duration
    const serviceRes = await client.query(
      'SELECT duration_minutes, buffer_minutes, price, currency FROM services WHERE id = $1',
      [service_id]
    );
    if (!serviceRes.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Service not found' });
    }
    const service = serviceRes.rows[0];
    const totalMinutes = service.duration_minutes + (service.buffer_minutes || 0);
    const endTime = new Date(new Date(start_time).getTime() + totalMinutes * 60000);

    // 2. Upsert customer profile
    let customerId = customer_data.id;
    if (!customerId) {
      const custRes = await client.query(
        `INSERT INTO customers (business_id, full_name, email, phone_number)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (business_id, email) DO UPDATE SET full_name = EXCLUDED.full_name
         RETURNING id`,
        [business_id, customer_data.full_name, customer_data.email, customer_data.phone_number]
      );
      customerId = custRes.rows[0].id;
    }

    // 3. Generate unique booking reference
    const bookingReference = 'BK-' + Math.floor(100000 + Math.random() * 900000);

    // 4. ATOMIC INSERT WITH GIST EXCLUSION ENFORCEMENT
    const bookingRes = await client.query(
      `INSERT INTO service_bookings 
       (booking_reference, business_id, service_id, customer_id, start_time, end_time, amount, currency, booking_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'CONFIRMED')
       RETURNING *`,
      [bookingReference, business_id, service_id, customerId, start_time, endTime.toISOString(), service.price, service.currency]
    );
    const newBooking = bookingRes.rows[0];

    // Commit transaction immediately
    await client.query('COMMIT');

    // 5. ASYNCHRONOUS DECOUPLED EVENT EMISSION
    // Do NOT await notification delivery before sending response!
    setImmediate(() => {
      queueNotificationJobs(newBooking);
    });

    // 6. INSTANT CLIENT CONFIRMATION (< 200ms)
    return res.status(201).json({
      success: true,
      booking: newBooking
    });

  } catch (err: any) {
    await client.query('ROLLBACK');

    // Handle exclusion constraint violation (23P01)
    if (err.code === '23P01') {
      return res.status(409).json({
        error: 'CONFLICT',
        message: 'This time was just booked by another customer. Please select another available time.'
      });
    }

    console.error('Booking error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
}
```

---

## 4. RESTful API Specification

### Authentication
- `POST /api/v1/auth/register` — Create business admin or customer account.
- `POST /api/v1/auth/login` — Authenticate and return JWT + Refresh Token.
- `POST /api/v1/auth/refresh` — Rotate refresh token.
- `POST /api/v1/auth/forgot-password` — Send password reset link.

### Business & Availability
- `GET /api/v1/businesses/:slug` — Retrieve public tenant profile, services, and branding.
- `PATCH /api/v1/admin/business` — Update business profile, hours, and branding (Admin).
- `GET /api/v1/availability/:businessId/slots?serviceId=...&date=YYYY-MM-DD` — Compute real-time open slots (opening hours minus active bookings minus blocked dates).
- `PUT /api/v1/admin/availability/hours` — Update weekly operating hours.
- `POST /api/v1/admin/availability/blocked-dates` — Add blocked vacation/holiday range.

### Services
- `GET /api/v1/businesses/:businessId/services` — Public service catalog.
- `POST /api/v1/admin/services` — Create new service.
- `PUT /api/v1/admin/services/:id` — Update service title, duration, price, buffer.
- `DELETE /api/v1/admin/services/:id` — Archive or delete service.

### Bookings
- `POST /api/v1/bookings` — Create booking with concurrency lock.
- `GET /api/v1/customer/bookings` — Fetch customer's upcoming and past appointments.
- `GET /api/v1/admin/bookings` — Search, filter, and paginate all tenant appointments.
- `POST /api/v1/bookings/:id/reschedule` — Atomic slot swap for rescheduling.
- `POST /api/v1/bookings/:id/cancel` — Cancel appointment and trigger policy refund.

### Payments
- `POST /api/v1/payments/initialize` — Generate Paystack/Stripe checkout session or charge tokenized card.
- `POST /api/v1/payments/webhook` — Verify webhook HMAC signature and update payment status to `PAID`.
- `POST /api/v1/payments/:id/refund` — Issue full or partial refund.

---

## 5. Asynchronous Job Queue (BullMQ)

```typescript
// backend/src/queues/notificationQueue.ts
import { Queue, Worker } from 'bullmq';
import { redisConnection } from '../redis';
import { sendEmailConfirmation } from '../services/emailService';
import { sendWhatsAppConfirmation } from '../services/whatsappService';
import { sendSMSConfirmation } from '../services/smsService';
import { scheduleRemindersInDB } from '../services/reminderService';

export const notificationQueue = new Queue('notifications', { connection: redisConnection });

export async function queueNotificationJobs(booking: any) {
  // 1. Queue Confirmation Email
  await notificationQueue.add('send_email', { bookingId: booking.id });
  
  // 2. Queue WhatsApp Confirmation
  await notificationQueue.add('send_whatsapp', { bookingId: booking.id });

  // 3. Queue SMS Confirmation (if enabled)
  await notificationQueue.add('send_sms', { bookingId: booking.id });

  // 4. Schedule Pre-appointment reminders in DB
  await scheduleRemindersInDB(booking);
}

// Background Worker Processor
export const notificationWorker = new Worker('notifications', async (job) => {
  switch (job.name) {
    case 'send_email':
      await sendEmailConfirmation(job.data.bookingId);
      break;
    case 'send_whatsapp':
      await sendWhatsAppConfirmation(job.data.bookingId);
      break;
    case 'send_sms':
      await sendSMSConfirmation(job.data.bookingId);
      break;
  }
}, { connection: redisConnection });
```

---

## 6. Deployment on Render

1. Create a **Web Service** on Render pointing to the backend repository.
2. Build Command: `npm install && npm run build`
3. Start Command: `npm run start:prod`
4. Attach a **Render Managed Redis** instance.
5. Set the environment variables:
   ```bash
   PORT=5000
   NODE_ENV=production
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   REDIS_URL=redis://default:[PASSWORD]@[REDIS-HOST]:6379
   JWT_SECRET=[SECURE_SECRET]
   PAYSTACK_SECRET_KEY=sk_live_...
   WHATSAPP_CLOUD_API_TOKEN=EAA...
   ```
