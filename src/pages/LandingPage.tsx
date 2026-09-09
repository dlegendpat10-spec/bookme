import React from 'react';
import { Link } from 'react-router-dom';
import { mockStorage } from '../services/mockStorage';
import { INITIAL_ADS } from '../mock/initialData';
import {
  Zap, Calendar, ShieldCheck, MessageSquare,
  ArrowRight, Star, Building2, Sparkles, CheckCircle2
} from 'lucide-react';

// ─── Hero images: Unsplash CDN (works offline-free via CDN) ────────────────
const BIZ_IMAGES: Record<string, string> = {
  'luxe-grooming': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80',
  'serenity-wellness': 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80',
  'apex-advisory': 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&q=80',
};

const FEATURES = [
  {
    icon: <Zap size={22} color="#10B981" />,
    color: 'rgba(16,185,129,0.12)',
    title: '1-Tap Booking',
    desc: 'Returning customers confirm appointments in under 5 seconds using tokenized cards and saved profiles.',
  },
  {
    icon: <ShieldCheck size={22} color="#60A5FA" />,
    color: 'rgba(59,130,246,0.12)',
    title: 'Zero Double Bookings',
    desc: 'Atomic conflict detection prevents simultaneous slot clashes and surfaces alternatives instantly.',
  },
  {
    icon: <MessageSquare size={22} color="#C084FC" />,
    color: 'rgba(168,85,247,0.12)',
    title: 'Instant Notifications',
    desc: 'WhatsApp, SMS, and email confirmations queue asynchronously — no wait, no friction.',
  },
  {
    icon: <Calendar size={22} color="#FBBF24" />,
    color: 'rgba(245,158,11,0.12)',
    title: 'Smart Scheduling',
    desc: 'Business hours, buffers, blocked dates, and availability calculated in real-time.',
  },
];

const marqueeAd = INITIAL_ADS.find(a => a.placement === 'TOP_MARQUEE');
const heroBannerAd = INITIAL_ADS.find(a => a.placement === 'HERO_BANNER');

export const LandingPage: React.FC = () => {
  const businesses = mockStorage.getBusinesses();

  return (
    <div>
      {/* ── Promotional Marquee ───────────────────────────────────────────── */}
      {marqueeAd?.isActive && (
        <div className="marquee-track">
          <div className="marquee-inner">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="marquee-item">
                <Sparkles size={14} /> {marqueeAd.headline}
                &nbsp;&nbsp;·&nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="page-shell">
        {/* ── Hero Section ─────────────────────────────────────────────────── */}
        <section style={{
          textAlign: 'center',
          padding: '72px 0 56px',
          maxWidth: '760px',
          margin: '0 auto',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '5px 16px', borderRadius: '99px',
            background: 'var(--brand-light)',
            border: '1px solid var(--brand-primary)',
            color: 'var(--brand-primary)',
            fontSize: '0.82rem', fontWeight: 700,
            marginBottom: '24px',
          }}>
            <Zap size={14} fill="currentColor" /> Ultra-Fast Booking · &lt; 5 Second SLA
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
            fontWeight: 900, marginBottom: '20px',
            lineHeight: 1.12,
          }}>
            Appointments Booked{' '}
            <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-hover) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Faster than a WhatsApp message
            </span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            marginBottom: '36px',
            maxWidth: '580px',
            margin: '0 auto 36px',
          }}>
            BookMe is the modern scheduling platform for salons, barbershops, consultants, 
            and wellness providers. Accept online payments, prevent double bookings, 
            and automate reminders — all with zero friction.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/business/brain-teaser" className="btn btn-fast-book">
              <Zap size={18} fill="#fff" /> Book an Appointment
            </Link>
            <Link to="/admin/onboarding" className="btn btn-secondary" style={{ minHeight: '48px', padding: '13px 24px' }}>
              <Building2 size={18} /> Register Your Business
            </Link>
          </div>

          {/* Social proof mini-strip */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginTop: '40px', flexWrap: 'wrap' }}>
            {[
              { val: '3,200+', label: 'Bookings processed' },
              { val: '98%', label: 'On-time confirmation' },
              { val: '< 5s', label: 'Avg booking time' },
            ].map(stat => (
              <div key={stat.val} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-primary)' }}>{stat.val}</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-faint)', fontWeight: 500, marginTop: '2px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Hero Ad Banner (Promotion) ────────────────────────────────────── */}
        {heroBannerAd?.isActive && (
          <div className="ad-hero-banner">
            <div className="ad-hero-banner-bg" />
            <div className="ad-hero-banner-content">
              <div>
                <span style={{
                  display: 'inline-block', fontSize: '0.7rem', fontWeight: 800,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--brand-primary)', background: 'var(--brand-light)',
                  padding: '3px 10px', borderRadius: '99px',
                  border: '1px solid var(--brand-primary)',
                  marginBottom: '12px',
                }}>
                  {heroBannerAd.badgeText}
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', maxWidth: '500px' }}>
                  {heroBannerAd.headline}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '460px', lineHeight: 1.6 }}>
                  {heroBannerAd.description}
                </p>
                {heroBannerAd.discountCode && (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    marginTop: '14px', background: 'var(--bg-app)',
                    border: '1px dashed var(--brand-primary)', borderRadius: '8px',
                    padding: '8px 16px',
                  }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Promo code:</span>
                    <code style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--brand-primary)', letterSpacing: '0.05em' }}>
                      {heroBannerAd.discountCode}
                    </code>
                  </div>
                )}
              </div>
              <Link to="/business/luxe-grooming" className="btn btn-fast-book" style={{ flexShrink: 0, fontSize: '0.92rem' }}>
                {heroBannerAd.ctaText} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}

        {/* ── Features Grid ─────────────────────────────────────────────────── */}
        <section style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: '10px' }}>
              Built for Speed & Reliability
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Every feature is engineered around one goal: get the booking done in under 5 seconds.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {FEATURES.map(f => (
              <div key={f.title} className="card" style={{ padding: '28px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: f.color, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  marginBottom: '18px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Business Directory ────────────────────────────────────────────── */}
        <section style={{ marginBottom: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
            <div>
              <h2 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: '6px' }}>
                Featured Service Businesses
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Select a business to schedule your next appointment online.
              </p>
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-faint)', fontWeight: 600 }}>
              {businesses.length} businesses available
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px' }}>
            {businesses.map(biz => (
              <Link
                key={biz.id}
                to={`/business/${biz.slug}`}
                className="card card-hover"
                style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}
              >
                {/* Business Image */}
                <div style={{ position: 'relative', height: '185px', overflow: 'hidden' }}>
                  <img
                    src={BIZ_IMAGES[biz.slug] || BIZ_IMAGES['luxe-grooming']}
                    alt={biz.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.75) 100%)',
                  }} />
                  <div style={{
                    position: 'absolute', top: '14px', left: '14px',
                    display: 'flex', gap: '8px',
                  }}>
                    <span className="badge" style={{
                      background: 'rgba(0,0,0,0.55)', color: '#fff',
                      backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)',
                    }}>
                      {biz.category}
                    </span>
                  </div>
                  <div style={{
                    position: 'absolute', bottom: '14px', right: '14px',
                    display: 'flex', alignItems: 'center', gap: '4px',
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
                    borderRadius: '8px', padding: '4px 10px',
                    color: '#FBBF24', fontSize: '0.84rem', fontWeight: 700,
                  }}>
                    <Star size={13} fill="#FBBF24" /> {biz.rating} ({biz.reviewCount})
                  </div>
                </div>

                {/* Business Info */}
                <div style={{ padding: '20px 22px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>{biz.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.55, flex: 1 }}>
                    {biz.description}
                  </p>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', marginTop: '16px',
                  }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>{biz.address}</span>
                    <span style={{ color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Book Now <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Admin CTA ─────────────────────────────────────────────────────── */}
        <section style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '32px',
          flexWrap: 'wrap',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative blob */}
          <div style={{
            position: 'absolute', right: '-60px', top: '-60px',
            width: '280px', height: '280px', borderRadius: '50%',
            background: 'radial-gradient(circle, var(--brand-light) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.82rem',
              marginBottom: '12px',
            }}>
              <CheckCircle2 size={16} /> For Business Owners
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '10px' }}>
              Ready to streamline<br />your bookings?
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '460px', fontSize: '0.95rem', lineHeight: 1.65 }}>
              Launch your booking page in minutes. Manage schedules, automate reminders, 
              track revenue — all from one dashboard.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Link to="/admin/dashboard" className="btn btn-primary" style={{ minHeight: '48px', padding: '13px 24px', fontSize: '0.95rem' }}>
              Admin Dashboard
            </Link>
            <Link to="/admin/onboarding" className="btn btn-secondary" style={{ minHeight: '48px', padding: '13px 24px', fontSize: '0.95rem' }}>
              Start Onboarding
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
