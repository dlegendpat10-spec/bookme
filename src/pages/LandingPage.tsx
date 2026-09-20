import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockStorage } from '../services/mockStorage';
import { Service } from '../types';
import {
  Zap, ShieldCheck, MessageSquare, ArrowRight, Clock, CheckCircle2, Building2, Compass,
  Star, MapPin, Tag, ExternalLink, Sparkles
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
    role: 'Salon & Studio Director',
    quote: 'Bookmi cut our scheduling overhead completely. Our clients appreciate the clean, instant checkout.',
  },
  {
    name: 'Elena Rostova',
    role: 'Wellness & Spa Owner',
    quote: 'The minimalist booking experience aligns perfectly with our brand standards.',
  },
  {
    name: 'Dr. Sarah Jenkins',
    role: 'Managing Consultant',
    quote: 'Managing client meetings across multiple advisors has never been easier or more reliable.',
  },
];

export const LandingPage: React.FC = () => {
  const [businesses, setBusinesses] = useState(mockStorage.getBusinesses());
  const [services, setServices] = useState<Service[]>(mockStorage.getServices());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const fetched = await mockStorage.fetchRemoteServices();
        if (fetched && fetched.length > 0) {
          setServices(fetched);
        }
        setBusinesses(mockStorage.getBusinesses());
      } catch {
        // Fallback to local
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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
          Bookmi provides a clean, friction-free booking experience for premium services, consultations, and professional appointments.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link to="/services" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
            <Compass size={18} /> Explore Services
          </Link>
          <Link to="/admin/onboarding" className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
            <Building2 size={16} /> Register Business
          </Link>
        </div>
      </section>

      {/* ── Direct Available Services by Verified Businesses ────────────── */}
      <section style={{ marginBottom: '100px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 12px', borderRadius: '99px',
              background: 'var(--brand-light)', color: 'var(--brand-primary)',
              fontSize: '0.8rem', fontWeight: 800, marginBottom: '8px'
            }}>
              <Sparkles size={13} /> Verified Providers & Live Schedules
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 900, marginBottom: '6px', letterSpacing: '-0.02em' }}>
              Available Services
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', maxWidth: '600px' }}>
              Explore certified businesses and book their advertised services with guaranteed zero double-bookings.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              to="/services"
              className="btn btn-primary"
              style={{ fontSize: '0.9rem', padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Compass size={16} /> Open Full Directory (20 Services) <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Directory Access Shortcut Bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '28px'
        }}>
          {[
            { label: 'All Services (20)', path: '/services' },
            { label: 'Consulting & Strategy', path: '/services?category=Consulting+%26+Strategy' },
            { label: 'Wellness & Spa', path: '/services?category=Wellness+%26+Spa' },
            { label: 'Fitness & Training', path: '/services?category=Fitness+%26+Training' },
            { label: 'Creative & Design', path: '/services?category=Creative+%26+Design' },
            { label: 'Tech & Development', path: '/services?category=Tech+%26+Development' },
            { label: 'Healthcare & Dental', path: '/services?category=Healthcare+%26+Dental' },
          ].map(chip => (
            <Link
              key={chip.label}
              to={chip.path}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '6px 14px',
                borderRadius: '99px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                transition: 'all 0.18s ease'
              }}
            >
              {chip.label}
            </Link>
          ))}
        </div>

        {/* Business Showcase Cards with Advertised Services */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <p>Loading available services…</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '26px' }}>
            {businesses.map(biz => {
              const bizServices = services.filter(s => (s.businessId === biz.id || s.businessSlug === biz.slug) && s.isActive);
              if (bizServices.length === 0) return null;

              return (
                <div
                  key={biz.id}
                  className="glass-card glow-card"
                  style={{
                    padding: '24px',
                    borderRadius: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-card)'
                  }}
                >
                  <div>
                    {/* Business Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-hover) 100%)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        flexShrink: 0,
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}>
                        {biz.logoUrl ? (
                          <img src={biz.logoUrl} alt={biz.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          biz.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-primary)',
                            background: 'var(--brand-light)', padding: '2px 8px', borderRadius: '4px'
                          }}>
                            <ShieldCheck size={12} /> Verified
                          </span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-faint)' }}>
                            {biz.category}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {biz.name}
                        </h3>
                        {biz.address && (
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <MapPin size={12} color="var(--brand-primary)" /> {biz.address}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Advertised Services List */}
                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
                        Advertised Services ({bizServices.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {bizServices.slice(0, 3).map(svc => (
                          <div
                            key={svc.id}
                            style={{
                              background: 'var(--bg-elevated)',
                              borderRadius: '10px',
                              padding: '10px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '10px',
                              border: '1px solid var(--border-subtle)'
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {svc.name}
                                </span>
                                {svc.badge && (
                                  <span style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--brand-primary)', background: 'var(--brand-light)', padding: '1px 5px', borderRadius: '4px' }}>
                                    {svc.badge}
                                  </span>
                                )}
                              </div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)', display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                                <Clock size={11} /> {svc.durationMinutes} mins
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                                ₦{svc.price.toLocaleString()}
                              </span>
                              <Link
                                to={`/business/${biz.slug}?service=${svc.id}`}
                                className="btn btn-primary"
                                style={{ padding: '6px 10px', fontSize: '0.78rem', borderRadius: '6px', fontWeight: 700 }}
                              >
                                Book <ArrowRight size={12} />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Link */}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link
                      to={`/business/${biz.slug}`}
                      style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--brand-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      View Storefront & All Services <ArrowRight size={13} />
                    </Link>
                    <Link
                      to="/services"
                      style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'none' }}
                    >
                      Directory Index ↗
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Directory Callout Banner */}
        <div style={{
          marginTop: '36px',
          padding: '24px 28px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '4px' }}>
              Want to see all 20 services with advanced filtering?
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Filter by industry category, duration, pricing, and active promotions in our master directory.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link to="/services" className="btn btn-primary" style={{ padding: '9px 20px', fontSize: '0.88rem' }}>
              <Compass size={15} /> Access Directory
            </Link>
            <Link to="/admin/onboarding" className="btn btn-secondary" style={{ padding: '9px 18px', fontSize: '0.88rem' }}>
              <Building2 size={15} /> Add Your Business
            </Link>
          </div>
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
