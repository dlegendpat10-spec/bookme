import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ExternalLink, ChevronDown, Palette, LogOut, User, LogIn } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, role, signOut, isAuthenticated } = useAuth();
  const { theme, setTheme, themes } = useTheme();
  const location = useLocation();
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isAdmin = role === 'BUSINESS_ADMIN';
  const activeColor = 'var(--brand-primary)';
  const isActive = (path: string) => location.pathname.startsWith(path);

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      style={{
        fontSize: '0.875rem',
        fontWeight: 500,
        color: isActive(to) ? activeColor : 'var(--text-muted)',
        padding: '6px 12px',
        borderRadius: '8px',
        transition: 'color 0.15s, background 0.15s',
        background: isActive(to) ? 'var(--brand-light)' : 'transparent',
      }}
    >
      {label}
    </Link>
  );

  return (
    <header style={{
      background: 'var(--navbar-bg)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 900,
      padding: '0 28px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
    }}>
      {/* ── Brand & Navigation Links ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', flexShrink: 0 }}>
          <div style={{
            width: '33px', height: '33px', borderRadius: '9px',
            background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-hover) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: '1.1rem', color: '#fff', fontFamily: 'Outfit, sans-serif',
          }}>B</div>
          <span className="brand-font" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.035em' }}>
            Book<span style={{ color: 'var(--brand-primary)' }}>Me</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navLink(`/business/${currentUser?.businessSlug || 'luxe-grooming'}`, 'Book Service')}
          {isAuthenticated && (
            <>
              {navLink('/admin/dashboard', 'Dashboard')}
              {navLink('/admin/calendar', 'Calendar')}
              {navLink('/admin/bookings', 'Bookings')}
              {navLink('/admin/services', 'Services')}
              {navLink('/admin/availability', 'Hours')}
            </>
          )}
        </nav>
      </div>

      {/* ── Right Controls & Auth Buttons ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        {/* Theme Picker */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowThemePicker(p => !p); setShowUserMenu(false); }}
            className="btn btn-ghost"
            style={{ padding: '6px 12px', minHeight: '36px', gap: '6px', fontSize: '0.84rem' }}
            title="Switch Theme"
          >
            <Palette size={16} color="var(--brand-primary)" />
            <span style={{ display: 'inline-block', fontWeight: 600, textTransform: 'capitalize' }}>
              {theme}
            </span>
            <ChevronDown size={13} style={{ opacity: 0.6 }} />
          </button>
          {showThemePicker && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              background: 'var(--bg-card)', border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-lg)', padding: '14px', zIndex: 1200,
              minWidth: '210px', boxShadow: 'var(--shadow-lg)',
              backdropFilter: 'blur(16px)',
              animation: 'slideUp 0.18s ease-out',
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Palette size={13} /> Active Color Theme
              </div>
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setTheme(t.id); setShowThemePicker(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                    background: theme === t.id ? 'var(--brand-light)' : 'transparent',
                    border: `1px solid ${theme === t.id ? 'var(--brand-primary)' : 'transparent'}`,
                    color: theme === t.id ? 'var(--brand-primary)' : 'var(--text-main)',
                    borderRadius: '8px', padding: '8px 10px', cursor: 'pointer',
                    fontSize: '0.86rem', fontWeight: 600, transition: 'all 0.15s',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: t.preview, border: '2px solid var(--border-strong)', flexShrink: 0,
                    boxShadow: theme === t.id ? '0 0 8px ' + t.preview : 'none',
                  }} />
                  {t.label}
                  {theme === t.id && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 800 }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Auth Buttons or Menu */}
        {isAuthenticated && currentUser ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowUserMenu(p => !p); setShowThemePicker(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                borderRadius: '10px', padding: '5px 10px 5px 5px', cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{
                width: '30px', height: '30px', borderRadius: '8px',
                background: 'var(--brand-primary)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.9rem', color: '#fff',
                fontFamily: 'Outfit, sans-serif',
              }}>
                {(currentUser.fullName || 'U').charAt(0).toUpperCase()}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.2 }}>
                  {(currentUser.fullName || 'User').split(' ')[0]}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-faint)', lineHeight: 1 }}>
                  {currentUser.role === 'BUSINESS_ADMIN' ? 'Business Admin' : 'Customer'}
                </div>
              </div>
              <ChevronDown size={13} style={{ color: 'var(--text-faint)' }} />
            </button>

            {showUserMenu && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                background: 'var(--bg-card)', border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-lg)', padding: '8px', zIndex: 1200,
                minWidth: '200px', boxShadow: 'var(--shadow-lg)',
                animation: 'slideUp 0.18s ease-out',
              }}>
                <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>{currentUser.fullName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '2px' }}>{currentUser.email}</div>
                </div>
                <button
                  onClick={() => { signOut(); setShowUserMenu(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                    background: 'transparent', border: 'none', color: '#FB7185',
                    borderRadius: '8px', padding: '8px 12px', cursor: 'pointer',
                    fontSize: '0.88rem', fontWeight: 600, textAlign: 'left',
                  }}
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link to="/auth/customer/sign-in" className="btn btn-secondary" style={{ fontSize: '0.84rem', padding: '7px 14px', minHeight: '36px' }}>
              <LogIn size={14} /> Sign In
            </Link>
            <Link to="/auth/register" className="btn btn-primary" style={{ fontSize: '0.84rem', padding: '7px 16px', minHeight: '36px' }}>
              Create Account
            </Link>
          </div>
        )}
      </div>

      {/* Overlay to close dropdowns */}
      {(showThemePicker || showUserMenu) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1100 }}
          onClick={() => { setShowThemePicker(false); setShowUserMenu(false); }}
        />
      )}
    </header>
  );
};
