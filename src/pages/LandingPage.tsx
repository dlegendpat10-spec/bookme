import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockStorage } from '../services/mockStorage';
import { INITIAL_ADS } from '../mock/initialData';
import {
  Zap, Calendar, ShieldCheck, MessageSquare,
  ArrowRight, Star, Building2, Sparkles, CheckCircle2,
  Users, Award, TrendingUp, ChevronRight
} from 'lucide-react';

const BIZ_IMAGES: Record<string, string> = {
  'luxe-grooming': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80',
  'serenity-wellness': 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80',
  'apex-advisory': 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&q=80',
};

const FEATURES = [
  {
    icon: <Zap size={24} color="var(--brand-primary)" />,
    color: 'var(--brand-light)',
    title: '1-Tap Express Booking',
    desc: 'Returning customers confirm appointments in under 5 seconds with tokenized cards and saved profiles.',
  },
  {
    icon: <ShieldCheck size={24} color="#60A5FA" />,
    color: 'rgba(59,130,246,0.14)',
    title: 'Zero Double Bookings',
    desc: 'Atomic conflict detection prevents slot clashes and surfaces smart alternatives instantly.',
  },
  {
    icon: <MessageSquare size={24} color="#C084FC" />,
    color: 'rgba(168,85,247,0.14)',
    title: 'Instant Reminders',
    desc: 'Automated WhatsApp, SMS, and email confirmations queue asynchronously with zero delay.',
  },
  {
    icon: <Calendar size={24} color="#FBBF24" />,
    color: 'rgba(245,158,11,0.14)',
    title: 'Smart Availability',
    desc: 'Business hours, custom buffers, blocked dates, and staff calendars sync in real-time.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Marcus Vance',
    role: 'Owner, Luxe Grooming Studio',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    quote: 'BookMe cut our appointment scheduling overhead by 90%. Clients love the 1-tap checkout, and no-shows dropped to nearly zero.',
    rating: 5,
  },
  {
    name: 'Elena Rostova',
    role: 'Founder, Serenity Spa & Wellness',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80',
    quote: 'The multi-theme design and instant WhatsApp notifications feel custom-built for our luxury clientele. Absolutely indispensable.',
    rating: 5,
  },
  {
    name: 'Dr. Sarah Jenkins',
    role: 'Managing Partner, Apex Advisory',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80',
    quote: 'Managing calendar conflicts across multiple partners was a nightmare before BookMe. The real-time slot lock is flawless.',
    rating: 5,
  },
];

const marqueeAd = INITIAL_ADS.find(a => a.placement === 'TOP_MARQUEE');
const heroBannerAd = INITIAL_ADS.find(a => a.placement === 'HERO_BANNER');

export const LandingPage: React.FC = () => {
  const businesses = mockStorage.getBusinesses();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Barbershop', 'Wellness', 'Advisory'];

  const filteredBusinesses = activeCategory === 'All'
    ? businesses
    : businesses.filter(b => b.category.toLowerCase().includes(activeCategory.toLowerCase()));

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
          padding: '80px 0 64px',
          maxWidth: '820px',
          margin: '0 auto',
          position: 'relative',
        }}>
          {/* Subtle Background Radial Glow */}
          <div style={{
            position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '500px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(circle, var(--brand-light) 0%, transparent 70%)',
            pointerEvents: 'none', zIndex: 0,
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 18px', borderRadius: '99px',
              background: 'var(--brand-light)',
              border: '1px solid var(--brand-primary)',
              color: 'var(--brand-primary)',
              fontSize: '0.84rem', fontWeight: 700,
              marginBottom: '24px',
              boxShadow: 'var(--shadow-glow)',
            }}>
              <Zap size={15} fill="currentColor" /> Next-Gen Enterprise Appointment Platform
            </div>

            <h1 style={{
              fontSize: 'clamp(2.6rem, 5.5vw, 4rem)',
              fontWeight: 900, marginBottom: '22px',
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
            }}>
              Appointments Booked{' '}
              <br />
              <span style={{
                background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--text-main) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                With Effortless Speed & Elegance
              </span>
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              marginBottom: '38px',
              maxWidth: '640px',
              margin: '0 auto 38px',
            }}>
              BookMe empowers premium salons, advisory firms, and wellness centers to deliver 
              frictionless 1-tap bookings, eliminate double-bookings, and automate notifications.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/business/luxe-grooming" className="btn btn-fast-book" style={{ minHeight: '50px', padding: '14px 32px', fontSize: '1rem' }}>
                <Zap size={20} fill="#fff" /> Book an Appointment
              </Link>
              <Link to="/admin/onboarding" className="btn btn-secondary" style={{ minHeight: '50px', padding: '14px 28px', fontSize: '0.96rem' }}>
                <Building2 size={18} /> Register Your Business
              </Link>
            </div>

            {/* Social proof mini-strip */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '36px', marginTop: '48px', flexWrap: 'wrap',
              padding: '16px 24px', background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)',
            }}>
              {[
                { val: '12,400+', label: 'Bookings Completed' },
                { val: '99.4%', label: 'On-Time SLA Rate' },
                { val: '< 4.2s', label: 'Average Booking Time' },
                { val: '4.9 ★', label: 'Customer Satisfaction' },
              ].map(stat => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.45rem', fontWeight: 900, color: 'var(--brand-primary)' }}>{stat.val}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
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
        <section style={{ marginBottom: '90px' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 900, marginBottom: '12px' }}>
              Engineered For Modern Service Excellence
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              Designed from the ground up to give service providers peace of mind and clients a delightful booking experience.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '22px' }}>
            {FEATURES.map(f => (
              <div key={f.title} className="glass-card glow-card" style={{ padding: '30px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: f.color, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Business Directory ────────────────────────────────────────────── */}
        <section style={{ marginBottom: '90px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '6px' }}>
                Featured Service Partners
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Discover top-rated barbers, wellness spas, and advisors near you.
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {filteredBusinesses.map(biz => (
              <Link
                key={biz.id}
                to={`/business/${biz.slug}`}
                className="glass-card glow-card"
                style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}
              >
                {/* Business Image */}
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                  <img
                    src={BIZ_IMAGES[biz.slug] || BIZ_IMAGES['luxe-grooming']}
                    alt={biz.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    loading="lazy"
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.8) 100%)',
                  }} />
                  <div style={{
                    position: 'absolute', top: '14px', left: '14px',
                    display: 'flex', gap: '8px',
                  }}>
                    <span className="badge" style={{
                      background: 'rgba(15, 23, 42, 0.8)', color: '#fff',
                      backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)',
                    }}>
                      {biz.category}
                    </span>
                  </div>
                  <div style={{
                    position: 'absolute', bottom: '14px', right: '14px',
                    display: 'flex', alignItems: 'center', gap: '5px',
                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                    borderRadius: '8px', padding: '5px 12px',
                    color: '#FBBF24', fontSize: '0.85rem', fontWeight: 800,
                  }}>
                    <Star size={14} fill="#FBBF24" /> {biz.rating} ({biz.reviewCount} reviews)
                  </div>
                </div>

                {/* Business Info */}
                <div style={{ padding: '22px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>{biz.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, flex: 1 }}>
                    {biz.description}
                  </p>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '18px',
                  }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-faint)' }}>{biz.address}</span>
                    <span style={{ color: 'var(--brand-primary)', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Book Now <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Testimonials Section ─────────────────────────────────────────── */}
        <section style={{ marginBottom: '90px' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 900, marginBottom: '10px' }}>
              Trusted By Industry Leaders
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem' }}>
              Here is what top business owners and clients say about BookMe.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="glass-card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '14px', color: '#FBBF24' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#FBBF24" />
                  ))}
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '20px' }}>
                  "{t.quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Admin CTA ─────────────────────────────────────────────────────── */}
        <section style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-xl)',
          padding: '52px 44px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '32px',
          flexWrap: 'wrap',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <div style={{
            position: 'absolute', right: '-60px', top: '-60px',
            width: '320px', height: '320px', borderRadius: '50%',
            background: 'radial-gradient(circle, var(--brand-light) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.84rem',
              marginBottom: '12px',
            }}>
              <CheckCircle2 size={16} /> For Growing Businesses
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '12px' }}>
              Scale Your Appointments<br />Without The Hassle
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '480px', fontSize: '0.98rem', lineHeight: 1.65 }}>
              Create your branded booking page in under 3 minutes. Manage schedules, accept payments, 
              and reduce no-shows effortlessly.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Link to="/admin/dashboard" className="btn btn-primary" style={{ minHeight: '50px', padding: '14px 28px', fontSize: '0.98rem' }}>
              Admin Workspace
            </Link>
            <Link to="/admin/onboarding" className="btn btn-secondary" style={{ minHeight: '50px', padding: '14px 28px', fontSize: '0.98rem' }}>
              Register Business
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
