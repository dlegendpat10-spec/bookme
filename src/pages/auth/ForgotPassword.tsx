import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { mockStorage } from '../../services/mockStorage';
import { NotificationViewerModal } from '../../components/shared/NotificationViewerModal';
import { Mail, AlertCircle, CheckCircle2, Loader2, ArrowLeft, ExternalLink, Bell, RefreshCw } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetData, setResetData] = useState<{ email: string; resetUrl: string; resetToken: string } | null>(null);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);

    // 1. Generate token and fallback link
    const fallbackToken = 'rst_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    let resetToken = fallbackToken;
    let resetUrl = `${window.location.origin}/auth/reset-password?token=${fallbackToken}&email=${encodeURIComponent(cleanEmail)}`;

    try {
      const res = await api.forgotPassword(cleanEmail);
      if (res.data && res.data.reset_token) {
        resetToken = res.data.reset_token;
      }
      if (res.data && res.data.reset_url) {
        resetUrl = res.data.reset_url;
      }
    } catch (err) {
      console.warn('Backend forgotPassword call had an issue, falling back to local dispatch:', err);
    }

    // 2. Dispatch simulated email to local notification queue
    mockStorage.sendPasswordResetEmail({
      email: cleanEmail,
      resetToken,
      resetUrl,
    });

    setIsSubmitting(false);
    setResetData({
      email: cleanEmail,
      resetUrl,
      resetToken,
    });
  };

  return (
    <div style={{ maxWidth: '480px', margin: '50px auto', padding: '0 20px' }}>
      <div className="card" style={{ padding: '36px 32px' }}>
        {resetData ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <CheckCircle2 size={32} />
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '6px' }}>
                Reset Email Dispatched!
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                We sent password reset instructions to <br />
                <strong style={{ color: 'var(--brand-primary)' }}>{resetData.email}</strong>
              </p>
            </div>

            {/* Simulated Email Box / Direct Action */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '18px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '8px' }}>
                Instant Access for Testing
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.5 }}>
                Since this development environment does not connect to a public mail server, your reset link was logged to your local notification inbox. You can reset right now using the button below:
              </p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const url = new URL(resetData.resetUrl);
                  navigate(url.pathname + url.search);
                }}
                style={{
                  width: '100%',
                  minHeight: '44px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '10px'
                }}
              >
                <span>Reset Password Now</span>
                <ExternalLink size={16} />
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowNotifModal(true)}
                style={{
                  width: '100%',
                  minHeight: '40px',
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Bell size={16} color="#60A5FA" />
                <span>View Dispatched Email in Inbox Log</span>
              </button>
            </div>

            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setResetData(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <RefreshCw size={14} /> Send to a different email address
              </button>

              <Link
                to="/auth/customer/sign-in"
                style={{
                  fontSize: '0.86rem',
                  color: 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  textDecoration: 'none'
                }}
              >
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '6px' }}>Reset Your Password</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Enter your account email and we'll dispatch a secure link to reset your password.
              </p>
            </div>

            {errorMessage && (
              <div style={{
                background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#FB7185', padding: '12px 14px', borderRadius: 'var(--radius-md)',
                fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px',
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label className="field-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="var(--text-faint)" style={{ position: 'absolute', left: '14px', top: '13px' }} />
                  <input
                    type="email"
                    required
                    className="input-field"
                    style={{ paddingLeft: '40px' }}
                    placeholder="name@business.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{ width: '100%', minHeight: '44px', fontWeight: 700 }}
              >
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Loader2 size={18} className="animate-spin" /> Dispatching Link...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Link to="/auth/customer/sign-in" style={{ fontSize: '0.86rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>

      {showNotifModal && <NotificationViewerModal onClose={() => setShowNotifModal(false)} />}
    </div>
  );
};
