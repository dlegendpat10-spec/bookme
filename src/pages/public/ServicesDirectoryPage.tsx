import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockStorage } from '../../services/mockStorage';
import { Service } from '../../types';
import {
  Search, Clock, Sparkles, Building2,
  ArrowRight, ShieldCheck, Filter
} from 'lucide-react';

export const ServicesDirectoryPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    async function loadAllServices() {
      setLoading(true);
      // Fetch platform-wide services (across all registered businesses)
      const remote = await mockStorage.fetchRemoteServices();
      const local = mockStorage.getServices();
      
      // Combine and deduplicate
      const map = new Map<string, Service>();
      local.forEach(s => map.set(s.id, s));
      remote.forEach(s => map.set(s.id, s));

      const all = Array.from(map.values()).filter(s => s.isActive);
      setServices(all);
      setLoading(false);
    }
    loadAllServices();
  }, []);

  const categories = ['All', ...Array.from(new Set(services.map(s => s.category).filter(Boolean)))];

  const filteredServices = services.filter(s => {
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    const matchesSearch =
      !searchTerm.trim() ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.businessName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '36px 24px 80px' }}>
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 36px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '5px 14px', borderRadius: '99px',
          background: 'var(--brand-light)',
          color: 'var(--brand-primary)',
          fontSize: '0.82rem', fontWeight: 700,
          marginBottom: '14px',
        }}>
          <Sparkles size={14} /> Platform Directory
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 900, marginBottom: '12px', letterSpacing: '-0.02em' }}>
          Explore Services
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
          Discover available appointments, consultations, and professional services across businesses on Bookmi.
        </p>
      </div>

      {/* ── Search & Filters ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '32px',
      }}>
        {/* Search input */}
        <div style={{ position: 'relative', maxWidth: '540px', margin: '0 auto', width: '100%' }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search by service or business name…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              paddingLeft: '44px',
              paddingRight: '16px',
              height: '48px',
              fontSize: '0.95rem',
              borderRadius: '12px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
            }}
          />
        </div>

        {/* Category Pills */}
        {categories.length > 1 && (
          <div style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                style={{
                  padding: '8px 18px',
                  borderRadius: '99px',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  border: activeCategory === cat ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                  background: activeCategory === cat ? 'var(--brand-primary)' : 'var(--bg-card)',
                  color: activeCategory === cat ? '#fff' : 'var(--text-muted)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Services Grid ───────────────────────────────────────────── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div className="animate-pulse" style={{ fontSize: '1rem', fontWeight: 600 }}>Loading available services…</div>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="glass-card" style={{
          textAlign: 'center',
          padding: '60px 24px',
          maxWidth: '560px',
          margin: '0 auto',
          borderRadius: '16px',
        }}>
          <div style={{
            width: '54px', height: '54px', borderRadius: '50%',
            background: 'var(--brand-light)', color: 'var(--brand-primary)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px',
          }}>
            <Filter size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
            No Services Found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '24px' }}>
            {searchTerm || activeCategory !== 'All'
              ? 'Try changing your search keywords or category filters.'
              : 'No businesses have published public services yet. Register your business to be the first!'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {(searchTerm || activeCategory !== 'All') && (
              <button
                className="btn btn-secondary"
                onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                style={{ fontSize: '0.9rem', padding: '10px 20px' }}
              >
                Clear Filters
              </button>
            )}
            <Link to="/admin/onboarding" className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '10px 22px' }}>
              <Building2 size={16} /> Register Your Business
            </Link>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '22px',
        }}>
          {filteredServices.map(srv => {
            const bizSlug = srv.businessSlug || 'business';
            const bookingUrl = `/business/${bizSlug}?service=${srv.id}`;

            return (
              <div
                key={srv.id}
                className="glass-card glow-card"
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-card)',
                  transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                }}
              >
                <div>
                  {/* Business info header pill */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    marginBottom: '12px',
                  }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--brand-primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}>
                      <Building2 size={13} />
                      {srv.businessName || 'Verified Business'}
                    </span>
                    <span style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-faint)',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: 'var(--bg-elevated)',
                    }}>
                      {srv.category || 'General'}
                    </span>
                  </div>

                  {/* Service Title & Price */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.18rem', fontWeight: 800, lineHeight: 1.3 }}>
                      {srv.name}
                    </h3>
                    <span style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      color: 'var(--brand-primary)',
                      flexShrink: 0,
                    }}>
                      {srv.currency || 'NGN'} {Number(srv.price).toLocaleString()}
                    </span>
                  </div>

                  {/* Description */}
                  {srv.description && (
                    <p style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.55,
                      marginBottom: '16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {srv.description}
                    </p>
                  )}
                </div>

                <div>
                  {/* Meta: Duration & Verification */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    color: 'var(--text-faint)',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '14px',
                    marginBottom: '16px',
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={14} /> {srv.durationMinutes} mins
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--brand-primary)', fontWeight: 600 }}>
                      <ShieldCheck size={14} /> Instant Confirmation
                    </span>
                  </div>

                  {/* Booking CTA Button */}
                  <Link
                    to={bookingUrl}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '11px 16px',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      borderRadius: '10px',
                    }}
                  >
                    Book Appointment <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
