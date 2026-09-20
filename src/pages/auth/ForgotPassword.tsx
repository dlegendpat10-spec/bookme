import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Mail, AlertCircle, CheckCircle2, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetData, setResetData] = useState<{ email: string } | null>(null);
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

    try {
      await api.forgotPassword(cleanEmail);
    } catch (err) {
      console.warn('Backend forgotPassword call had an issue:', err);
    }

    setIsSubmitting(false);
    setResetData({
      email: cleanEmail
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
    </div>
  );
};
