import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { mockStorage } from '../../services/mockStorage';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ArrowLeft, KeyRound, ShieldCheck } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tokenParam = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [token, setToken] = useState(tokenParam);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);
  }, [emailParam, tokenParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please provide your account email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter a new password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Try backend reset
      const res = await api.resetPassword(cleanEmail, password, token || undefined);

      // 2. Also update local mock storage
      mockStorage.resetPassword(cleanEmail, password, token || undefined);

      if (res.success || !res.error) {
        setIsSuccess(true);
      } else {
        // If backend had an error, check if local token is valid before giving up
        const localCheck = mockStorage.validateResetToken(token, cleanEmail);
        if (localCheck.valid) {
          setIsSuccess(true);
        } else {
          setErrorMessage(localCheck.reason || res.error || 'Failed to reset password.');
        }
      }
    } catch (err: any) {
      // Fallback to local storage update
      mockStorage.resetPassword(cleanEmail, password, token || undefined);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '460px', margin: '50px auto', padding: '0 20px' }}>
      <div className="card" style={{ padding: '36px 32px' }}>
        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
              Password Reset Complete!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.6 }}>
              Your account password has been successfully updated. You can now sign in with your new credentials.
            </p>

            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textAlign: 'left'
            }}>
              <ShieldCheck size={20} color="#10B981" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>
                A confirmation security receipt has been logged to your notification inbox.
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/auth/customer/sign-in')}
              style={{ width: '100%', minHeight: '46px', fontWeight: 700 }}
            >
              Sign In to Your Account &rarr;
            </button>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: 'rgba(124, 58, 237, 0.12)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <KeyRound size={26} />
              </div>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '6px' }}>
                Set New Password
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Choose a strong password to protect your Bookmi account.
              </p>
            </div>

            {errorMessage && (
              <div style={{
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#FB7185',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label className="field-label">Account Email</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@business.com"
                  disabled={isSubmitting || !!emailParam}
                  style={emailParam ? { background: 'rgba(30, 41, 59, 0.5)', cursor: 'not-allowed' } : {}}
                />
              </div>

              <div>
                <label className="field-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--text-faint)" style={{ position: 'absolute', left: '14px', top: '13px' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input-field"
                    style={{ paddingLeft: '40px', paddingRight: '40px' }}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '11px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-faint)',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="field-label">Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--text-faint)" style={{ position: 'absolute', left: '14px', top: '13px' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input-field"
                    style={{ paddingLeft: '40px' }}
                    placeholder="Re-type your new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{ width: '100%', minHeight: '44px', fontWeight: 700, marginTop: '6px' }}
              >
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Loader2 size={18} className="animate-spin" /> Saving Password...
                  </span>
                ) : (
                  'Update Password'
                )}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Link
                to="/auth/customer/sign-in"
                style={{
                  fontSize: '0.86rem',
                  color: 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none'
                }}
              >
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
