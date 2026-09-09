import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, UserCheck, Zap, ArrowRight } from 'lucide-react';

export const CustomerSignIn: React.FC = () => {
  const { signInAs, usersList } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleQuickLogin = (userId: string) => {
    signInAs(userId);
    navigate('/customer/dashboard');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default to Alex Morgan if credentials match or generic
    signInAs('user-customer-returning');
    navigate('/customer/dashboard');
  };

  return (
    <div style={{ maxWidth: '440px', margin: '60px auto', padding: '0 20px' }}>
      <div className="card" style={{ padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Sign in to BookMe</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Access 1-tap fast booking, saved payment cards, and appointment history.
          </p>
        </div>

        {/* 1-Click Fast Persona Switcher for Instant Testing */}
        <div style={{ background: '#0B0F19', padding: '14px', borderRadius: '10px', marginBottom: '24px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.78rem', color: '#34D399', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={13} /> 1-Click Instant Demo Login
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '8px 12px', minHeight: '34px', justifyContent: 'flex-start' }}
              onClick={() => handleQuickLogin('user-customer-returning')}
            >
              👤 Alex Morgan (Returning Customer)
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '8px 12px', minHeight: '34px', justifyContent: 'flex-start' }}
              onClick={() => {
                signInAs('user-admin-1');
                navigate('/admin/dashboard');
              }}
            >
              💈 Marcus Vance (Business Admin)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Email Address</label>
            <input
              type="email"
              required
              className="input-field"
              placeholder="alex.morgan@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Password</label>
            <input
              type="password"
              required
              className="input-field"
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '6px' }}>
            Sign In to Account
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account yet?{' '}
          <Link to="/business/luxe-grooming" style={{ color: '#10B981', fontWeight: 600 }}>
            Book as Guest
          </Link>
        </div>
      </div>
    </div>
  );
};
