import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockStorage } from '../services/mockStorage';
import {
  Zap, ShieldCheck, MessageSquare, ArrowRight, Star, Building2, ChevronRight
} from 'lucide-react';

const BIZ_IMAGES: Record<string, string> = {
  'luxe-grooming': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80',
  'serenity-wellness': 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80',
  'apex-advisory': 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&q=80',
};

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
  const businesses = mockStorage.getBusinesses();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Barbershop', 'Wellness', 'Advisory'];

  const filteredBusinesses = activeCategory === 'All'
    ? businesses
    : businesses.filter(b => b.category.toLowerCase().includes(activeCategory.toLowerCase()));

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
          BookMe provides a clean, friction-free booking experience for premium services, wellness centers, and professional advisors.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link to="/business/luxe-grooming" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
            Book Appointment <ArrowRight size={16} />
          </Link>
          <Link to="/admin/onboarding" className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
            <Building2 size={16} /> Register Business
          </Link>
        </div>
      </section>

      {/* ── Feature Highlights ────────────────────────────────────────────── */}
      <section style={{ marginBottom: '100px', marginTop: '20px' }}>
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
                transition: 'border-color 0.2s ease',
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

      {/* ── Business Directory ────────────────────────────────────────────── */}
      <section style={{ marginBottom: '100px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
              Service Partners
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem' }}>
              Select a business to view available time slots and book.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '24px',
        }}>
          {filteredBusinesses.map(biz => (
            <Link
              key={biz.id}
              to={`/business/${biz.slug}`}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'border-color 0.2s ease, transform 0.2s ease',
              }}
              className="card-hover"
            >
              {/* Business Image */}
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img
                  src={BIZ_IMAGES[biz.slug] || BIZ_IMAGES['luxe-grooming']}
                  alt={biz.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute', top: '12px', left: '12px',
                }}>
                  <span className="badge" style={{
                    background: 'rgba(15, 23, 42, 0.75)', color: '#fff',
                    backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)',
                    fontSize: '0.7rem',
                  }}>
                    {biz.category}
                  </span>
                </div>
              </div>

              {/* Business Details */}
              <div style={{ padding: '20px 22px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>{biz.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.84rem', color: '#FBBF24', fontWeight: 700 }}>
                    <Star size={13} fill="#FBBF24" /> {biz.rating}
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.6, flex: 1, marginBottom: '20px' }}>
                  {biz.description}
                </p>

                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)', paddingTop: '14px',
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>{biz.address}</span>
                  <span style={{ color: 'var(--brand-primary)', fontWeight: 600, fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    Book <ChevronRight size={15} />
                  </span>
                </div>
              </div>
            </Link>
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
