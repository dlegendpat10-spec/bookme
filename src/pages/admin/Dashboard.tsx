import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockStorage } from '../../services/mockStorage';
import { ServiceBooking } from '../../types';
import { INITIAL_ADS } from '../../mock/initialData';
import {
  Calendar, Users, DollarSign, Clock, Plus,
  ArrowRight, ExternalLink, ShieldCheck, BarChart3,
  Megaphone, TrendingUp, Eye, MousePointerClick
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const business = mockStorage.getBusinesses()[0];
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);

  useEffect(() => {
    if (business) {
      setBookings(mockStorage.getBookings(business.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business?.id]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.date === todayStr);
  const confirmedCount = bookings.filter(b => b.bookingStatus === 'CONFIRMED').length;
  const totalRevenue = bookings.filter(b => b.paymentStatus === 'PAID').reduce((a, c) => a + c.amount, 0);
  const customersCount = mockStorage.getCustomers(business?.id).length;

  const businessAds = business ? INITIAL_ADS.filter(a => a.businessId === business.id) : [];

  return (
    <div>
      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '4px' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            {business?.name} · Real-time overview
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/bookings" className="btn btn-primary" style={{ fontSize: '0.88rem' }}>
            <Plus size={15} /> New Booking
          </Link>
          <Link to={`/business/${business?.slug || 'luxe-grooming'}`} target="_blank" className="btn btn-secondary" style={{ fontSize: '0.88rem' }}>
            Live Page <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {/* ── KPI Stats ──────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '36px' }}>
        {[
          {
            label: "Today's Appointments",
            value: todayBookings.length,
            sub: 'Scheduled today',
            icon: <Clock size={18} color="#10B981" />,
            color: 'rgba(16,185,129,0.12)',
            accent: '#10B981',
          },
          {
            label: 'Confirmed Bookings',
            value: confirmedCount,
            sub: 'Active & upcoming',
            icon: <Calendar size={18} color="#60A5FA" />,
            color: 'rgba(59,130,246,0.12)',
            accent: '#60A5FA',
          },
          {
            label: 'Total Revenue',
            value: `₦${totalRevenue.toLocaleString()}`,
            sub: 'All settled payments',
            icon: <DollarSign size={18} color="#FBBF24" />,
            color: 'rgba(245,158,11,0.12)',
            accent: '#FBBF24',
          },
          {
            label: 'CRM Customers',
            value: customersCount,
            sub: 'Unique clients served',
            icon: <Users size={18} color="#C084FC" />,
            color: 'rgba(168,85,247,0.12)',
            accent: '#C084FC',
          },
        ].map(stat => (
          <div key={stat.label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stat-card-label">{stat.label}</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
            </div>
            <div className="stat-card-value" style={{ color: stat.accent }}>{stat.value}</div>
            <div className="stat-card-sub">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Main Content Grid ──────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'flex-start' }}>

        {/* ── Upcoming Appointments ─────────────────────────────────── */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="section-heading" style={{ margin: 0 }}>Upcoming Appointments</h2>
            <Link to="/admin/bookings" style={{ color: 'var(--brand-primary)', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all ({bookings.length}) <ArrowRight size={13} />
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
              <Calendar size={40} style={{ color: 'var(--text-faint)', margin: '0 auto 14px', display: 'block' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No bookings yet. Share your booking link to start!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {bookings.slice(0, 6).map(b => (
                <div key={b.id} style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px', padding: '14px 16px',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      background: 'var(--bg-card)', border: '1px solid var(--border-strong)',
                      borderRadius: '8px', padding: '7px 10px',
                      textAlign: 'center', minWidth: '64px',
                    }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>{b.displayTime}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-faint)', marginTop: '1px' }}>
                        {b.date === todayStr ? 'Today' : b.date.slice(5)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{b.customerName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {b.serviceName} · {b.serviceDuration}m
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)', marginTop: '1px' }}>#{b.bookingReference}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={`badge badge-${b.bookingStatus.toLowerCase()}`}>{b.bookingStatus}</span>
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.95rem' }}>
                      {b.currency} {b.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right Sidebar ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Quick Actions */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 className="section-heading">Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { to: '/admin/bookings', icon: <Plus size={15} color="var(--brand-primary)" />, label: 'Add Walk-In Booking' },
                { to: '/admin/services', icon: <Plus size={15} color="var(--brand-primary)" />, label: 'Add New Service' },
                { to: '/admin/availability', icon: <Clock size={15} color="var(--brand-primary)" />, label: 'Manage Working Hours' },
                { to: '/admin/analytics', icon: <BarChart3 size={15} color="var(--brand-primary)" />, label: 'View Analytics Report' },
              ].map(a => (
                <Link key={a.to} to={a.to} className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '10px', fontSize: '0.85rem' }}>
                  {a.icon} {a.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Booking Link */}
          <div className="card" style={{ padding: '20px', background: 'var(--brand-light)', border: '1px solid var(--brand-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '8px' }}>
              <ShieldCheck size={16} /> Your Booking Link
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.5 }}>
              Share on WhatsApp, Instagram Bio, or SMS for instant bookings.
            </p>
            <div style={{
              background: 'var(--bg-app)', padding: '8px 12px', borderRadius: '8px',
              fontSize: '0.8rem', color: 'var(--brand-primary)', fontFamily: 'monospace',
              marginBottom: '12px', wordBreak: 'break-all',
              border: '1px solid var(--brand-primary)',
            }}>
              bookme.io/business/{business?.slug}
            </div>
            <Link to={`/business/${business?.slug}`} target="_blank" className="btn btn-primary" style={{ width: '100%', fontSize: '0.85rem' }}>
              Open Live Page
            </Link>
          </div>
        </div>
      </div>

      {/* ── Ad Campaign Manager ────────────────────────────────────────── */}
      <div style={{ marginTop: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="section-heading">Ad Campaigns & Promotions</h2>
          <button className="btn btn-secondary" style={{ fontSize: '0.84rem', gap: '6px' }}>
            <Plus size={14} /> Create Campaign
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {businessAds.map(ad => (
            <div key={ad.id} className="card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Megaphone size={16} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--brand-primary)' }}>
                      {ad.badgeText}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>{ad.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{ad.description}</p>
                </div>
                <span style={{
                  padding: '3px 10px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700,
                  background: ad.isActive ? 'rgba(16,185,129,0.12)' : 'rgba(100,116,139,0.12)',
                  color: ad.isActive ? '#34D399' : 'var(--text-faint)',
                  border: `1px solid ${ad.isActive ? 'rgba(16,185,129,0.3)' : 'transparent'}`,
                  flexShrink: 0, marginLeft: '12px',
                }}>
                  {ad.isActive ? 'LIVE' : 'PAUSED'}
                </span>
              </div>

              {ad.discountCode && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px',
                  background: 'var(--bg-elevated)', borderRadius: '7px', padding: '6px 12px',
                  border: '1px dashed var(--border-strong)',
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>Code:</span>
                  <code style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--brand-primary)', letterSpacing: '0.05em' }}>{ad.discountCode}</code>
                  {ad.discountPercent && (
                    <span style={{ fontSize: '0.75rem', color: '#FBBF24', fontWeight: 700 }}>{ad.discountPercent}% OFF</span>
                  )}
                </div>
              )}

              {/* Ad Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                {[
                  { icon: <Eye size={13} />, label: 'Impressions', val: ad.impressions.toLocaleString(), color: '#60A5FA' },
                  { icon: <MousePointerClick size={13} />, label: 'Clicks', val: ad.clicks.toLocaleString(), color: '#C084FC' },
                  { icon: <TrendingUp size={13} />, label: 'Bookings', val: ad.bookingsCount.toLocaleString(), color: '#34D399' },
                ].map(m => (
                  <div key={m.label} style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: m.color, marginBottom: '4px' }}>
                      {m.icon}
                      <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: 800 }}>{m.val}</span>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{m.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.82rem', minHeight: '36px' }}>Edit Campaign</button>
                <button className="btn btn-ghost" style={{ fontSize: '0.82rem', minHeight: '36px', color: ad.isActive ? '#FB7185' : 'var(--brand-primary)' }}>
                  {ad.isActive ? 'Pause' : 'Activate'}
                </button>
              </div>
            </div>
          ))}

          {/* New Campaign CTA */}
          <div className="card" style={{
            padding: '24px', border: '1px dashed var(--border-strong)',
            background: 'transparent', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', textAlign: 'center',
            minHeight: '180px', cursor: 'pointer',
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <Plus size={22} style={{ color: 'var(--brand-primary)' }} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>Launch New Campaign</div>
            <p style={{ color: 'var(--text-faint)', fontSize: '0.82rem', lineHeight: 1.5 }}>
              Create promo banners, flash sales, or marquee announcements for your booking page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
