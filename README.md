# Bookme — Multi-Tenant Appointment Booking Platform

Bookme is a modern, business-agnostic appointment booking and reservation management application built with React, TypeScript, and Vite.

## Features

- **Public Marketing & Business Directory**: Showcasing registered service businesses.
- **Customer Booking Engine**: Multi-step booking wizard with real-time slot selection, service choice, and instant reference generation.
- **Customer Portal**: View upcoming & past appointments, reschedule, or cancel bookings.
- **Business Admin Portal**: Interactive dashboard, calendar management, services management, business hours & blocked dates configuration, customer CRM, analytics, and business profile customization.
- **White-Label Ready**: Configurable business identity and branding.

## Configuration & API Connection

The application connects to the Render-hosted backend:
- **API Base URL**: `https://bookmerefreshed.onrender.com`
- **Environment Variable**: `VITE_API_BASE_URL` (configured in `.env` and `.env.production`)

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Access the app locally at `http://localhost:5173`.

3. **Build for production**:
   ```bash
   npm run build
   ```

## Architecture Documentation

- [FRONTEND_ARCHITECTURE.md](file:///c:/Users/USER/.gemini/antigravity-ide/scratch/bookme/FRONTEND_ARCHITECTURE.md) — Comprehensive frontend architecture, design system, and data flow.
- [BACKEND_SPECIFICATION.md](file:///c:/Users/USER/.gemini/antigravity-ide/scratch/bookme/BACKEND_SPECIFICATION.md) — Complete REST API specification, database DDL schema, and concurrency control details.
