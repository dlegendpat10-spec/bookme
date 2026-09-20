import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { mockStorage } from '../../services/mockStorage';
import { Service, AdCampaign, BusinessTenant } from '../../types';
import {
  Search, Clock, Sparkles, Building2,
  ArrowRight, ShieldCheck, Filter, Megaphone, Tag,
  X, LayoutGrid, Store, ArrowUpDown, MapPin, Star, CheckCircle2
} from 'lucide-react';

export const ServicesDirectoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [services, setServices] = useState<Service[]>([]);
  const [ads, setAds] = useState<AdCampaign[]>([]);
  const [businesses, setBusinesses] = useState<BusinessTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<'SERVICES' | 'BUSINESSES'>('SERVICES');
  const [sortBy, setSortBy] = useState<'FEATURED' | 'PRICE_ASC' | 'PRICE_DESC' | 'DURATION_ASC'>('FEATURED');

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

      const allAds = mockStorage.getAds().filter(a => a.isActive);
      setAds(allAds);
      const allBiz = mockStorage.getBusinesses();
      setBusinesses(allBiz);

      setLoading(false);
    }
    loadAllServices();
  }, []);

  // Sync category param
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const categories = ['All', ...Array.from(new Set(services.map(s => s.category).filter(Boolean)))];

  const filteredServices = services
    .filter(s => {
      const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
      const matchesSearch =
        !searchTerm.trim() ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.businessName?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.price - b.price;
      if (sortBy === 'PRICE_DESC') return b.price - a.price;
      if (sortBy === 'DURATION_ASC') return a.durationMinutes - b.durationMinutes;
      return (b.bookingCount || 0) - (a.bookingCount || 0);
    });

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '36px 20px 80px' }}>
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 32px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '5px 14px', borderRadius: '99px',
          background: 'var(--brand-light)',
          color: 'var(--brand-primary)',
          fontSize: '0.82rem', fontWeight: 800,
          marginBottom: '14px',
        }}>
          <Sparkles size={14} /> Official Platform Directory
        </div>
        <h1 style={{ fontSize: 'clamp(2.1rem, 4vw, 2.75rem)', fontWeight: 900, marginBottom: '12px', letterSpacing: '-0.02em' }}>
          Explore Services & Businesses
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', lineHeight: 1.6 }}>
          Discover verified service businesses across Nigeria, browse advertised packages, and book live time slots with instant confirmation.
        </p>
      </div>

      {/* ── Key Platform Metrics Bar ───────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px',
        marginBottom: '32px'
      }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--brand-light)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>{businesses.length}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Verified Businesses</div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>{services.length}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Bookable Services</div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>100%</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Zero Double-Bookings</div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>Instant</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Calendar Sync</div>
          </div>
        </div>
      </div>

      {/* ── Controls: Search, Sort & View Mode Switcher ─────────────── */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          {/* Search input with Clear Icon */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search by service name, business, or keywords…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                paddingLeft: '42px',
                paddingRight: searchTerm ? '38px' : '14px',
                height: '44px',
                fontSize: '0.92rem',
                borderRadius: '10px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                width: '100%'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)', background: 'transparent',
                  border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                  padding: '2px'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-faint)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpDown size={14} /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="input-field"
              style={{
                height: '44px',
                fontSize: '0.86rem',
                borderRadius: '10px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                padding: '0 12px',
                cursor: 'pointer'
              }}
            >
              <option value="FEATURED">Most Popular / Featured</option>
              <option value="PRICE_ASC">Price: Low to High</option>
              <option value="PRICE_DESC">Price: High to Low</option>
              <option value="DURATION_ASC">Duration: Short to Long</option>
            </select>
          </div>

          {/* View Mode Toggle: Grid View vs By Business */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-elevated)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setViewMode('SERVICES')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '8px', border: 'none',
                background: viewMode === 'SERVICES' ? 'var(--brand-primary)' : 'transparent',
                color: viewMode === 'SERVICES' ? '#fff' : 'var(--text-muted)',
                fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
            >
              <LayoutGrid size={15} /> All Services ({filteredServices.length})
            </button>
            <button
              onClick={() => setViewMode('BUSINESSES')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '8px', border: 'none',
                background: viewMode === 'BUSINESSES' ? 'var(--brand-primary)' : 'transparent',
                color: viewMode === 'BUSINESSES' ? '#fff' : 'var(--text-muted)',
                fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
            >
              <Store size={15} /> By Business ({businesses.length})
            </button>
          </div>
        </div>

        {/* Category Filter Pills with Badges */}
        {categories.length > 1 && (
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            paddingTop: '8px',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            {categories.map(cat => {
              const count = cat === 'All'
                ? services.length
                : services.filter(s => s.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '99px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    border: activeCategory === cat ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                    background: activeCategory === cat ? 'var(--brand-primary)' : 'var(--bg-elevated)',
                    color: activeCategory === cat ? '#fff' : 'var(--text-muted)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{cat}</span>
                  <span style={{
                    fontSize: '0.72rem',
                    padding: '1px 6px',
                    borderRadius: '99px',
                    background: activeCategory === cat ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.06)',
                    color: activeCategory === cat ? '#fff' : 'var(--text-faint)'
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Featured Business Promotional Ads ──────────────────────── */}
      {ads.length > 0 && !searchTerm && activeCategory === 'All' && (
        <div style={{ marginBottom: '36px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: 'var(--brand-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <Megaphone size={15} /> Active Business Promotions
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '18px',
          }}>
            {ads.slice(0, 3).map(ad => {
              const biz = businesses.find(b => b.id === ad.businessId);
              const targetUrl = biz?.slug
                ? `/business/${biz.slug}${ad.targetServiceId ? `?service=${ad.targetServiceId}` : ''}`
                : '/services';

              return (
                <div
                  key={ad.id}
                  className="glass-card glow-card hover-lift"
                  style={{
                    borderRadius: '16px',
                    border: '1px solid var(--brand-primary)',
                    background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(124,58,237,0.08) 100%)',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    {ad.imageUrl && (
                      <img
                        src={ad.imageUrl}
                        alt={ad.headline}
                        style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
                      />
                    )}
                    <div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{ background: 'var(--brand-primary)', color: '#fff', fontSize: '0.66rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                          {ad.badgeText}
                        </span>
                        {ad.discountCode && (
                          <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-main)', background: 'var(--bg-elevated)', padding: '1px 6px', borderRadius: '4px' }}>
                            {ad.discountCode}
                          </span>
                        )}
                        {ad.discountPercent && (
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#EF4444', background: '#EF444422', padding: '1px 6px', borderRadius: '4px' }}>
                            {ad.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.98rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '4px' }}>
                        {ad.headline}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {ad.description}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)', fontWeight: 600 }}>
                      {biz?.name || 'Verified Provider'}
                    </span>
                    <Link
                      to={targetUrl}
                      onClick={() => mockStorage.recordAdClick(ad.id)}
                      className="btn btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '8px', fontWeight: 700 }}
                    >
                      {ad.ctaText} <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Main Content Views ───────────────────────────────────────── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div className="animate-pulse" style={{ fontSize: '1rem', fontWeight: 600 }}>Loading verified services directory…</div>
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
              ? 'Try adjusting your search query or selecting a different category filter.'
              : 'No businesses have published public services yet. Register your business to be the first!'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {(searchTerm || activeCategory !== 'All') && (
              <button
                className="btn btn-secondary"
                onClick={() => { setSearchTerm(''); handleCategoryChange('All'); }}
                style={{ fontSize: '0.9rem', padding: '10px 20px' }}
              >
                Clear All Filters
              </button>
            )}
            <Link to="/admin/onboarding" className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '10px 22px' }}>
              <Building2 size={16} /> Register Your Business
            </Link>
          </div>
        </div>
      ) : viewMode === 'SERVICES' ? (
        /* ── VIEW MODE 1: ALL SERVICES GRID ────────────────────────────── */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '22px',
        }}>
          {filteredServices.map(srv => {
            const biz = businesses.find(b => b.id === srv.businessId || b.slug === srv.businessSlug);
            const bizSlug = srv.businessSlug || biz?.slug || 'business';
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
                    <Link
                      to={`/business/${bizSlug}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: 'var(--brand-primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        textDecoration: 'none'
                      }}
                    >
                      {biz?.logoUrl ? (
                        <img
                          src={biz.logoUrl}
                          alt={srv.businessName || 'Logo'}
                          style={{ width: '20px', height: '20px', borderRadius: '4px', objectFit: 'cover' }}
                        />
                      ) : (
                        <Building2 size={14} />
                      )}
                      {srv.businessName || biz?.name || 'Verified Provider'}
                    </Link>
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
                      <ShieldCheck size={14} /> Verified Provider
                    </span>
                  </div>

                  {/* Booking CTA Button */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      to={bookingUrl}
                      className="btn btn-primary"
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        padding: '11px 16px',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        borderRadius: '10px',
                      }}
                    >
                      Book Appointment <ArrowRight size={15} />
                    </Link>
                    <Link
                      to={`/business/${bizSlug}`}
                      className="btn btn-secondary"
                      title="View business storefront"
                      style={{ padding: '11px', borderRadius: '10px' }}
                    >
                      <Store size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── VIEW MODE 2: GROUPED BY BUSINESS ──────────────────────────── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {businesses.map(biz => {
            const bizServices = filteredServices.filter(s => s.businessId === biz.id || s.businessSlug === biz.slug);
            if (bizServices.length === 0 && (searchTerm || activeCategory !== 'All')) return null;

            return (
              <div
                key={biz.id}
                className="glass-card"
                style={{
                  borderRadius: '18px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-card)',
                  overflow: 'hidden'
                }}
              >
                {/* Business Top Banner */}
                <div style={{
                  padding: '24px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  background: 'linear-gradient(to right, rgba(255,255,255,0.02), rgba(255,255,255,0))'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '58px',
                      height: '58px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-hover) 100%)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      {biz.logoUrl ? (
                        <img src={biz.logoUrl} alt={biz.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        biz.name.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0 }}>
                          {biz.name}
                        </h2>
                        <span style={{
                          background: 'var(--brand-light)', color: 'var(--brand-primary)',
                          fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px',
                          display: 'inline-flex', alignItems: 'center', gap: '3px'
                        }}>
                          <ShieldCheck size={12} /> Verified
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-faint)' }}>
                        <span>{biz.category}</span>
                        {biz.address && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} color="var(--brand-primary)" /> {biz.address}
                          </span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#F59E0B', fontWeight: 700 }}>
                          <Star size={12} fill="#F59E0B" /> {biz.rating || 4.9} ({biz.reviewCount || 90}+ reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/business/${biz.slug}`}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.86rem', padding: '8px 18px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Store size={15} /> Visit Storefront <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Business Services Catalog */}
                <div style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
                    Available Services from this Business ({bizServices.length})
                  </div>

                  {bizServices.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No services match the active search criteria.</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                      {bizServices.map(srv => (
                        <div
                          key={srv.id}
                          style={{
                            background: 'var(--bg-elevated)',
                            borderRadius: '12px',
                            padding: '16px',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '12px'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                              <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                                {srv.name}
                              </h4>
                              {srv.badge && (
                                <span style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--brand-primary)', background: 'var(--brand-light)', padding: '2px 6px', borderRadius: '4px' }}>
                                  {srv.badge}
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {srv.description}
                            </p>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                            <div>
                              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--brand-primary)' }}>
                                ₦{srv.price.toLocaleString()}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-faint)' }}>
                                {srv.durationMinutes} mins
                              </div>
                            </div>
                            <Link
                              to={`/business/${biz.slug}?service=${srv.id}`}
                              className="btn btn-primary"
                              style={{ padding: '8px 14px', fontSize: '0.82rem', borderRadius: '8px', fontWeight: 700 }}
                            >
                              Book Now <ArrowRight size={13} />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
