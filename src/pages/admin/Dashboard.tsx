import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockStorage } from '../../services/mockStorage';
import { api } from '../../services/api';
import {
  Calendar, Users, DollarSign, Clock, Plus,
  ArrowRight, ExternalLink, CheckCircle2, Circle, Sparkles, FolderPlus,
  Copy, Check, Globe, QrCode, MessageCircle, X, Settings
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const business = mockStorage.getActiveBusiness(currentUser?.businessId, currentUser?.businessSlug);

  const businessName = currentUser?.businessName || business?.name || 'Your Business';
  const businessSlug = currentUser?.businessSlug || business?.slug || 'my-business';

  const [stats, setStats] = useState({
    total_bookings: 0,
    pending_bookings: 0,
    confirmed_bookings: 0,
    completed_bookings: 0,
    cancelled_bookings: 0,
    total_revenue: 0,
    total_customers: 0,
  });
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const shareUrl = `${window.location.origin}/business/${businessSlug}`;

  useEffect(() => {
    async function loadStats() {
      const res = await api.getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data as any);
      } else {
        // Fallback to local bookings count for active business
        const bookings = mockStorage.getBookings(business?.id);
        const customers = mockStorage.getCustomers(business?.id);
        const revenue = bookings
          .filter(b => b.bookingStatus !== 'CANCELLED')
          .reduce((acc, b) => acc + (b.amount || 0), 0);
        setStats({
          total_bookings: bookings.length,
          pending_bookings: bookings.filter(b => b.bookingStatus === 'PENDING').length,
          confirmed_bookings: bookings.filter(b => b.bookingStatus === 'CONFIRMED').length,
          completed_bookings: bookings.filter(b => b.bookingStatus === 'COMPLETED').length,
          cancelled_bookings: bookings.filter(b => b.bookingStatus === 'CANCELLED').length,
          total_revenue: revenue,
          total_customers: customers.length,
        });
      }
      setIsLoading(false);
    }
    loadStats();
  }, [business?.id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Book an appointment with ${businessName} online: ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '4px' }}>Business Workspace</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            {businessName} · Operational Overview
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/services" className="btn btn-primary" style={{ fontSize: '0.88rem' }}>
            <Plus size={15} /> Add Service
          </Link>
          <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '0.88rem' }}>
            Live Booking Page <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* ── Shareable Customer Booking Link Hero Banner ─────────────────── */}
      <div className="card" style={{
        padding: '20px 24px',
        marginBottom: '28px',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(16, 185, 129, 0.08) 100%)',
        border: '1px solid var(--brand-primary)',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: 'var(--shadow-glow)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} color="var(--brand-primary)" />
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Your Customer Booking URL
            </span>
            <span className="badge" style={{ background: 'var(--brand-light)', color: 'var(--brand-primary)', fontSize: '0.72rem', fontWeight: 700 }}>
              Live & Shareable
            </span>
          </div>

          <Link
            to="/admin/business"
            style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
          >
            <Settings size={13} /> Customize URL Slug
          </Link>
        </div>

        <div style={{
          background: 'var(--bg-app)',
          border: '1px solid var(--border-strong)',
          borderRadius: '10px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <code style={{ fontSize: '0.92rem', color: 'var(--brand-primary)', fontWeight: 700, wordBreak: 'break-all' }}>
            {shareUrl}
          </code>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleCopyLink}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px', minHeight: '32px', gap: '6px' }}
            >
              {copied ? <><Check size={14} color="#10B981" /> Copied!</> : <><Copy size={14} /> Copy Link</>}
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              title="Share on WhatsApp"
              style={{
                background: '#25D366', color: '#fff', border: 'none',
                borderRadius: '8px', padding: '6px 12px', fontSize: '0.8rem',
                fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px',
                cursor: 'pointer', minHeight: '32px',
              }}
            >
              <MessageCircle size={14} /> WhatsApp
            </button>

            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px', minHeight: '32px', gap: '5px' }}
            >
              <QrCode size={14} /> QR Code
            </button>

            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
              style={{ fontSize: '0.8rem', padding: '6px 10px', minHeight: '32px' }}
              title="Preview Customer View"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* ── KPI Stats Cards ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '36px' }}>
        {[
          {
            label: "Total Bookings",
            value: stats.total_bookings,
            sub: stats.total_bookings === 0 ? 'No bookings yet' : 'Real-time booking count',
            icon: <Calendar size={18} color="#60A5FA" />,
            color: 'rgba(59,130,246,0.12)',
            accent: '#60A5FA',
          },
          {
            label: 'Confirmed Bookings',
            value: stats.confirmed_bookings,
            sub: stats.confirmed_bookings === 0 ? 'No confirmed bookings' : 'Active reservations',
            icon: <Clock size={18} color="#10B981" />,
            color: 'rgba(16,185,129,0.12)',
            accent: '#10B981',
          },
          {
            label: 'Total Revenue',
            value: `₦${(stats.total_revenue || 0).toLocaleString()}`,
            sub: stats.total_revenue === 0 ? 'No revenue yet' : 'Settled payments',
            icon: <DollarSign size={18} color="#FBBF24" />,
            color: 'rgba(245,158,11,0.12)',
            accent: '#FBBF24',
          },
          {
            label: 'Customers',
            value: stats.total_customers || 0,
            sub: (stats.total_customers || 0) === 0 ? 'No customers yet' : 'Registered client profiles',
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

      {/* ── Dashboard Setup Checklist & Main Grid ─────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'flex-start' }}>

        {/* Left Column: Recent Bookings & Setup Guide */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Welcome & Setup Checklist for New Businesses */}
          {stats.total_bookings === 0 && (
            <div className="card" style={{ padding: '28px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Sparkles size={20} color="var(--brand-primary)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Welcome to BookMe!</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.6 }}>
                Your business portal is live. Share your link with customers or add custom services below.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { title: 'Share booking link with clients', desc: `Send ${shareUrl} to customers via WhatsApp or Instagram.`, link: shareUrl, isExternal: true, done: false },
                  { title: 'Create services catalog', desc: 'Define service names, prices, durations, and cleanup buffers.', link: '/admin/services', isExternal: false, done: false },
                  { title: 'Configure operating hours', desc: 'Set open and closing times per weekday.', link: '/admin/availability', isExternal: false, done: true },
                ].map(item => (
                  item.isExternal ? (
                    <a
                      key={item.title}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '12px',
                        padding: '14px 16px', borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-app)', border: '1px solid var(--border-subtle)',
                        transition: 'border-color 0.2s', textDecoration: 'none',
                      }}
                      className="hover-lift"
                    >
                      <Circle size={18} color="var(--text-faint)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {item.title} <ExternalLink size={13} color="var(--brand-primary)" />
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</div>
                      </div>
                    </a>
                  ) : (
                    <Link
                      key={item.title}
                      to={item.link}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '12px',
                        padding: '14px 16px', borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-app)', border: '1px solid var(--border-subtle)',
                        transition: 'border-color 0.2s',
                      }}
                      className="hover-lift"
                    >
                      {item.done ? (
                        <CheckCircle2 size={18} color="var(--brand-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      ) : (
                        <Circle size={18} color="var(--text-faint)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      )}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{item.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</div>
                      </div>
                    </Link>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Bookings Section */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 className="section-heading" style={{ margin: 0 }}>Recent Appointments</h2>
              <Link to="/admin/bookings" style={{ color: 'var(--brand-primary)', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ textAlign: 'center', padding: '44px 20px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <Calendar size={36} color="var(--text-faint)" style={{ margin: '0 auto 12px', display: 'block' }} />
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                No bookings yet
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', maxWidth: '380px', margin: '0 auto 16px' }}>
                When clients book appointments on your booking page, reservations will appear here automatically.
              </p>
              <Link to="/admin/services" className="btn btn-primary" style={{ fontSize: '0.84rem' }}>
                <FolderPlus size={14} /> Add Service & Get Started
              </Link>
            </div>
          </div>

        </div>

        {/* Right Column: Quick Links & Business Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>Business Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/admin/services" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                Catalog Services
              </Link>
              <Link to="/admin/availability" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                Business Hours & Schedule
              </Link>
              <Link to="/admin/customers" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                Client Directory (CRM)
              </Link>
              <Link to="/admin/business" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                Business Profile Settings
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="modal-overlay" onClick={() => setShowQrModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Customer QR Code</h3>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
              Clients can scan this QR code with their mobile phone to open your booking page directly.
            </p>

            <div style={{
              background: '#FFFFFF',
              padding: '16px',
              borderRadius: '16px',
              display: 'inline-block',
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
              marginBottom: '20px',
            }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(shareUrl)}`}
                alt={`QR code for ${businessName}`}
                style={{ width: '220px', height: '220px', display: 'block' }}
              />
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              <strong>{businessName}</strong>
              <br />
              <code style={{ color: 'var(--brand-primary)', fontSize: '0.78rem' }}>{shareUrl}</code>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => window.print()}
                style={{ flex: 1 }}
              >
                Print
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCopyLink}
                style={{ flex: 1 }}
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
