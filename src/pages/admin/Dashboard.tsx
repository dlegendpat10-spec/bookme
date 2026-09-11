import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Calendar, Users, DollarSign, Clock, Plus,
  ArrowRight, ExternalLink, CheckCircle2, Circle, Sparkles, FolderPlus
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    total_bookings: 0,
    pending_bookings: 0,
    confirmed_bookings: 0,
    completed_bookings: 0,
    cancelled_bookings: 0,
    total_revenue: 0,
    total_customers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const res = await api.getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data as any);
      }
      setIsLoading(false);
    }
    loadStats();
  }, []);

  const businessName = currentUser?.businessName || 'Your Business';
  const businessSlug = currentUser?.businessSlug || 'luxe-grooming';

  return (
    <div>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
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
          <Link to={`/business/${businessSlug}`} target="_blank" className="btn btn-secondary" style={{ fontSize: '0.88rem' }}>
            Live Booking Page <ExternalLink size={14} />
          </Link>
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
                Your business portal is ready. Complete the recommended setup steps below to start taking client appointments.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { title: 'Create your first service', desc: 'Define service name, price, duration, and buffer times.', link: '/admin/services', done: false },
                  { title: 'Configure operating hours', desc: 'Set days of week and daily opening/closing schedules.', link: '/admin/availability', done: true },
                  { title: 'Share booking link with clients', desc: 'Direct clients to your branded online booking URL.', link: `/business/${businessSlug}`, done: false },
                ].map(item => (
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
    </div>
  );
};
