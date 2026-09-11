import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Mail, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    const res = await api.forgotPassword(email);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage('If an account exists for this email, password reset instructions have been sent.');
    } else {
      setErrorMessage(res.error || 'Failed to send reset link.');
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '60px auto', padding: '0 20px' }}>
      <div className="card" style={{ padding: '36px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '6px' }}>Reset Your Password</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Enter your account email and we'll send you instructions to reset your password.
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

        {successMessage && (
          <div style={{
            background: 'var(--brand-light)', border: '1px solid var(--brand-primary)',
            color: 'var(--brand-primary)', padding: '12px 14px', borderRadius: 'var(--radius-md)',
            fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px',
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
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
            style={{ width: '100%', minHeight: '44px' }}
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Send Reset Link'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link to="/auth/customer/sign-in" style={{ fontSize: '0.86rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
