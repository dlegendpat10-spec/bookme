-- ============================================================================
-- BOOKME DATABASE DDL SCHEMA & SEED DATA (SUPABASE / POSTGRESQL)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 1. USERS & ROLES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('CUSTOMER', 'BUSINESS_ADMIN', 'PLATFORM_ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    encrypted_password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BUSINESS TENANTS
CREATE TABLE IF NOT EXISTS businesses (
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

CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);

-- 3. BUSINESS OPERATING HOURS
CREATE TABLE IF NOT EXISTS business_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    is_closed BOOLEAN DEFAULT FALSE,
    opening_time TIME NOT NULL,
    closing_time TIME NOT NULL,
    UNIQUE(business_id, day_of_week)
);

-- 4. BLOCKED DATES
CREATE TABLE IF NOT EXISTS blocked_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason VARCHAR(255)
);

-- 5. SERVICE CATALOG
CREATE TABLE IF NOT EXISTS services (
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

CREATE INDEX IF NOT EXISTS idx_services_business ON services(business_id);

-- 6. CUSTOMER PROFILES
CREATE TABLE IF NOT EXISTS customers (
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

-- 7. SERVICE BOOKINGS
DO $$ BEGIN
    CREATE TYPE booking_status_type AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_type AS ENUM ('UNPAID', 'PENDING', 'PAID', 'FAILED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS service_bookings (
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
    CONSTRAINT prevent_double_booking 
    EXCLUDE USING gist (
        business_id WITH =,
        tstzrange(start_time, end_time) WITH &&
    ) WHERE (booking_status NOT IN ('CANCELLED'))
);

-- 8. SEED DATA FOR DEMO BUSINESS & SERVICES
INSERT INTO businesses (id, name, slug, category, description, phone_number, email, address)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Brain Teaser Educational Consults',
    'brain-teaser',
    'Educational Consulting',
    'Professional educational guidance and tutoring sessions.',
    '+234 800 000 0000',
    'hello@brainteaser.ng',
    'Lagos, Nigeria'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO services (business_id, name, description, duration_minutes, price, currency, is_active)
VALUES 
('00000000-0000-0000-0000-000000000001', 'Discovery Call', 'A free 30-minute introductory session to understand your educational needs.', 30, 0.00, 'NGN', true),
('00000000-0000-0000-0000-000000000001', 'Initial Consultation', 'A comprehensive 90-minute deep-dive session covering academic history and study plan.', 90, 25000.00, 'NGN', true),
('00000000-0000-0000-0000-000000000001', 'Follow-up Session', 'A 45-minute progress review and strategy adjustment session.', 45, 10000.00, 'NGN', true),
('00000000-0000-0000-0000-000000000001', 'Full Academic Assessment', 'An in-depth 2-hour assessment covering skill gaps and subject analysis.', 120, 45000.00, 'NGN', true)
ON CONFLICT DO NOTHING;
