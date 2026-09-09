import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockStorage } from '../../services/mockStorage';
import {
  LayoutDashboard, Calendar as CalendarIcon, BookOpen, Layers,
  Clock, Users, CreditCard, Bell, BarChart3, Settings,
  ExternalLink, Plus, CheckCircle2
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const business = mockStorage.getBusinesses()[0]; // Default to Luxe Grooming

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Calendar', path: '/admin/calendar', icon: CalendarIcon },
    { label: 'Bookings', path: '/admin/bookings', icon: BookOpen },
    { label: 'Services', path: '/admin/services', icon: Layers },
    { label: 'Availability', path: '/admin/availability', icon: Clock },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Business Profile', path: '/admin/business', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
      {/* Admin Sidebar */}
      <aside style={{
        width: '220px',
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border-subtle)',
        padding: '20px 14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div>
          {/* Business Tenant Header Badge */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '24px'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Workspace
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '2px', color: '#F8FAFC' }}>
              {business?.name || 'Luxe Grooming Lounge'}
            </div>
            <Link
              to={`/business/${business?.slug || 'luxe-grooming'}`}
              target="_blank"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                color: '#10B981',
                marginTop: '6px',
                fontWeight: 600
              }}
            >
              Public Page <ExternalLink size={12} />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)',
                    background: isActive ? 'var(--brand-light)' : 'transparent',
                    border: `1px solid ${isActive ? 'var(--brand-primary)' : 'transparent'}`,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', fontSize: '0.75rem', color: 'var(--text-faint)' }}>
          <div>BookMe Multi-Tenant Core</div>
          <div>v2.4.0 • Local Mock Engine</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '32px 28px', maxWidth: '1400px', overflowX: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  );
};
