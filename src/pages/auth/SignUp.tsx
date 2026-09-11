import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export const SignUp: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const result = await register(fullName.trim(), email.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      // Redirect to Business Creation Onboarding Flow
      navigate('/admin/onboarding');
    } else {
      setErrorMessage(result.error || 'Failed to create account.');
    }
  };

  return (
    <div style={{ maxWidth: '460px', margin: '60px auto', padding: '0 20px' }}>
      <div className="card" style={{ padding: '36px 32px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'var(--brand-light)', color: 'var(--brand-primary)',
            fontWeight: 800, fontSize: '1.25rem', marginBottom: '14px',
            border: '1px solid var(--border-subtle)',
          }}>
            B
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>Create Your BookMe Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Start accepting appointments and managing your business in minutes.
          </p>
        </div>

        {/* Error Alert */}
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
          {/* Full Name */}
          <div>
            <label className="field-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-faint)" style={{ position: 'absolute', left: '14px', top: '13px' }} />
              <input
                type="text"
                required
                className="input-field"
                style={{ paddingLeft: '40px' }}
                placeholder="Jane Doe"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="field-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-faint)" style={{ position: 'absolute', left: '14px', top: '13px' }} />
              <input
                type="email"
                required
                className="input-field"
                style={{ paddingLeft: '40px' }}
                placeholder="jane@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="field-label">Password</label>
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
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: 'absolute', right: '12px', top: '11px',
                  background: 'transparent', border: 'none',
                  color: 'var(--text-muted)', cursor: 'pointer', padding: '2px',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="field-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-faint)" style={{ position: 'absolute', left: '14px', top: '13px' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="input-field"
                style={{ paddingLeft: '40px' }}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', marginTop: '6px', minHeight: '44px' }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Existing Account Link */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/auth/customer/sign-in" style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
