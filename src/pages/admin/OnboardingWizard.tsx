import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Building2, Layers, CheckCircle2, ArrowRight, ArrowLeft, Loader2, Sparkles
} from 'lucide-react';

const CATEGORIES = [
  'Beauty & Personal Care',
  'Health & Wellness',
  'Education & Consulting',
  'Professional Services',
  'Hospitality',
  'Transport',
  'Events & Creative',
  'Fitness & Sports',
  'Home & Repair',
  'Other',
];

const TEMPLATES = [
  { id: 'salon', label: 'Salon', category: 'Beauty & Personal Care', icon: '💇‍♀️' },
  { id: 'barber', label: 'Barbershop', category: 'Beauty & Personal Care', icon: '💈' },
  { id: 'spa', label: 'Spa & Wellness', category: 'Health & Wellness', icon: '🧘‍♀️' },
  { id: 'clinic', label: 'Medical / Dental Clinic', category: 'Health & Wellness', icon: '🩺' },
  { id: 'tutor', label: 'Tutor / Education', category: 'Education & Consulting', icon: '🎓' },
  { id: 'consultant', label: 'Advisory / Consultant', category: 'Professional Services', icon: '📋' },
  { id: 'gym', label: 'Gym / Fitness Studio', category: 'Fitness & Sports', icon: '🏋️‍♂️' },
  { id: 'cleaning', label: 'Cleaning / Home Service', category: 'Home & Repair', icon: '🧹' },
  { id: 'custom', label: 'Custom Business', category: 'Other', icon: '⚡' },
];

export const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserBusiness } = useAuth();
  const [step, setStep] = useState(1);

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [selectedTemplate, setSelectedTemplate] = useState('custom');
  const [country, setCountry] = useState('Nigeria');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNext = () => {
    setErrorMessage('');
    if (step === 1) {
      if (!businessName.trim()) {
        setErrorMessage('Business name is required.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleFinish = async () => {
    setErrorMessage('');
    setIsSubmitting(true);

    const res = await api.createBusiness({
      name: businessName.trim(),
      category,
      template: selectedTemplate,
      country,
      address: address.trim(),
      description: description.trim(),
    });

    setIsSubmitting(false);

    if (res.success && res.data) {
      updateUserBusiness(res.data.id, res.data.name, res.data.slug);
      // Redirect to clean empty Dashboard
      navigate('/admin/dashboard');
    } else {
      setErrorMessage(res.error || 'Failed to create business.');
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '40px auto', padding: '0 20px 80px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '4px 14px', borderRadius: '99px',
          background: 'var(--brand-light)', color: 'var(--brand-primary)',
          fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px',
        }}>
          <Sparkles size={14} /> Step {step} of 3
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>Set Up Your Business</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem' }}>
          Configure your business details and template to launch your appointment booking page.
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)',
          color: '#FB7185', padding: '12px 16px', borderRadius: 'var(--radius-md)',
          fontSize: '0.88rem', marginBottom: '24px',
        }}>
          {errorMessage}
        </div>
      )}

      {/* Stepper Card */}
      <div className="card" style={{ padding: '36px' }}>

        {/* STEP 1: Business Details */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>
              1. General Business Information
            </h2>

            <div>
              <label className="field-label">Business Name *</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. Apex Wellness Studio"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label">Category / Industry</label>
              <select
                className="input-field"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label">Country</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Nigeria, United Kingdom, United States"
                value={country}
                onChange={e => setCountry(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label">Location / Address</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Suite 4B, Victoria Island, Lagos"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label">Short Description</label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Briefly describe the services your business offers..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNext}
              style={{ width: '100%', marginTop: '10px', minHeight: '44px' }}
            >
              Continue to Templates <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 2: Template Selection */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
              2. Choose a Business Template Preset
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
              Select a configuration template for your industry. You can customize services and rules later.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '28px' }}>
              {TEMPLATES.map(t => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: selectedTemplate === t.id ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                    background: selectedTemplate === t.id ? 'var(--brand-light)' : 'var(--bg-app)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{t.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>{t.label}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>{t.category}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep(1)}
                style={{ flex: 1 }}
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
                style={{ flex: 2 }}
              >
                Review & Confirm <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Review & Create */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>
              3. Review & Create Your Business
            </h2>

            <div style={{
              background: 'var(--bg-app)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)', padding: '20px', display: 'flex',
              flexDirection: 'column', gap: '10px', fontSize: '0.9rem',
            }}>
              <div><strong style={{ color: 'var(--text-muted)' }}>Business Name:</strong> {businessName}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Category:</strong> {category}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Template:</strong> {TEMPLATES.find(t => t.id === selectedTemplate)?.label}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Location:</strong> {address || country}</div>
              {description && <div><strong style={{ color: 'var(--text-muted)' }}>Description:</strong> {description}</div>}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep(2)}
                disabled={isSubmitting}
                style={{ flex: 1 }}
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleFinish}
                disabled={isSubmitting}
                style={{ flex: 2, minHeight: '44px' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Creating Business...
                  </>
                ) : (
                  <>
                    Launch Business Dashboard <CheckCircle2 size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
