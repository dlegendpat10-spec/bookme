import React from 'react';
import { Link } from 'react-router-dom';
import { mockStorage } from '../services/mockStorage';
import {
  Zap, ShieldCheck, MessageSquare, ArrowRight, Clock, CheckCircle2, Building2
} from 'lucide-react';

const FEATURES = [
  {
    icon: <Zap size={22} color="var(--brand-primary)" />,
    title: 'Instant 1-Tap Booking',
    desc: 'Confirm appointments in seconds with saved client profiles and streamlined scheduling.',
  },
  {
    icon: <ShieldCheck size={22} color="var(--brand-primary)" />,
    title: 'Zero Double-Bookings',
    desc: 'Real-time conflict detection guarantees smooth calendar allocation across all staff.',
  },
  {
    icon: <MessageSquare size={22} color="var(--brand-primary)" />,
    title: 'Automated Reminders',
    desc: 'Reduce no-shows with instant SMS, email, and WhatsApp confirmation alerts.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Marcus Vance',
    role: 'Luxe Grooming Studio',
    quote: 'BookMe cut our scheduling overhead completely. Our clients appreciate the clean, instant checkout.',
  },
  {
    name: 'Elena Rostova',
    role: 'Serenity Spa & Wellness',
    quote: 'The minimalist booking experience aligns perfectly with our luxury brand standards.',
  },
  {
    name: 'Dr. Sarah Jenkins',
    role: 'Apex Advisory',
    quote: 'Managing client meetings across multiple advisors has never been easier or more reliable.',
  },
];

export const LandingPage: React.FC = () => {
  const services = mockStorage.getServices();
  const defaultBusiness = mockStorage.getBusinesses()[0];

  return (
    <div className="page-shell" style={{ paddingTop: '20px' }}>
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section style={{
        textAlign: 'center',
        padding: '90px 0 70px',
        maxWidth: '780px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '6px 16px', borderRadius: '99px',
          background: 'var(--brand-light)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--brand-primary)',
          fontSize: '0.82rem', fontWeight: 600,
          marginBottom: '28px',
        }}>
          Effortless Appointment Platform
        </div>

        <h1 style={{
          fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
          fontWeight: 800,
          marginBottom: '20px',
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          color: 'var(--text-main)',
        }}>
          Seamless Appointments,<br />Scheduled with Ease
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-muted)',
          lineHeight: 1.7,
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px',
          fontWeight: 400,
        }}>
          BookMe provides a clean, friction-free booking experience for premium services, consultations, and professional appointments.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link to={`/business/${defaultBusiness?.slug || 'luxe-grooming'}`} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
            Select Service & Book <ArrowRight size={16} />
          </Link>
          <Link to="/admin/onboarding" className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
            <Building2 size={16} /> Register Business
          </Link>
        </div>
      </section>

      {/* ── Direct Available Services ─────────────────────────────────────── */}
      <section style={{ marginBottom: '100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
            Available Services
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem' }}>
            Select a service below to view time slots and confirm your appointment.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {services.map(svc => (
            <div
              key={svc.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              className="card-hover"
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>{svc.name}</h3>
                  <span style={{
                    fontSize: '1rem', fontWeight: 800, color: 'var(--brand-primary)',
                    background: 'var(--brand-light)', padding: '4px 10px', borderRadius: '8px',
                  }}>
                    ₦{svc.price.toLocaleString()}
                  </span>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  {svc.description}
                </p>
              </div>

              <div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  color: 'var(--text-faint)', fontSize: '0.82rem', marginBottom: '20px',
                  borderTop: '1px solid var(--border-subtle)', paddingTop: '14px',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={14} /> {svc.durationMinutes} mins
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CheckCircle2 size={14} color="var(--brand-primary)" /> Instant Confirmation
                  </span>
                </div>

                <Link
                  to={`/business/${defaultBusiness?.slug || 'luxe-grooming'}`}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: '0.9rem' }}
                >
                  Book Service <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Highlights ────────────────────────────────────────────── */}
      <section style={{ marginBottom: '100px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
        }}>
          {FEATURES.map(f => (
            <div
              key={f.title}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 28px',
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px',
                background: 'var(--brand-light)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px',
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-main)' }}>
                {f.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section style={{ marginBottom: '100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
            Trusted by Professionals
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem' }}>
            Designed for businesses that prioritize speed, clarity, and convenience.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {TESTIMONIALS.map(t => (
            <div
              key={t.name}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px 26px',
              }}
            >
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '16px' }}>
                "{t.quote}"
              </p>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{t.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Minimalist Callout Banner ─────────────────────────────────────── */}
      <section style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 36px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '24px',
        flexWrap: 'wrap',
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)' }}>
            Are you a service provider?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '480px' }}>
            Set up your custom booking portal, manage slots, and take control of your schedule in minutes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/admin/onboarding" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
            Get Started
          </Link>
          <Link to="/admin/dashboard" className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
            Admin Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
};
