import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockStorage } from '../../services/mockStorage';
import { BusinessTenant } from '../../types';
import {
  Building2, Clock, Layers, Bell, CreditCard, CheckCircle2,
  ArrowRight, ArrowLeft, Copy, ExternalLink, Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Form State
  const [adminName, setAdminName] = useState('New Partner');
  const [adminEmail, setAdminEmail] = useState('partner@example.com');
  const [businessName, setBusinessName] = useState('Apex Studio');
  const [category, setCategory] = useState('Creative & Design Services');
  const [address, setAddress] = useState('Lekki Phase 1, Lagos');
  const [serviceName, setServiceName] = useState('Initial Creative Consultation');
  const [serviceDuration, setServiceDuration] = useState(45);
  const [servicePrice, setServicePrice] = useState(15000);
  const [whatsappActive, setWhatsappActive] = useState(true);
  const [emailActive, setEmailActive] = useState(true);
  const [paymentOption, setPaymentOption] = useState('both');
  const [createdSlug, setCreatedSlug] = useState('apex-studio');
  const [copied, setCopied] = useState(false);

  const handleFinish = () => {
    // Generate slug
    const cleanSlug = businessName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    setCreatedSlug(cleanSlug);

    // Save as new tenant in mock storage
    const newBiz: BusinessTenant = {
      id: 'biz-' + Date.now(),
      name: businessName,
      slug: cleanSlug,
      category,
      description: `Premium appointments with ${businessName}.`,
      phone: '+234 800 111 2222',
      email: adminEmail,
      address,
      accentColor: '#10B981',
      ownerId: 'user-new-' + Date.now(),
      rating: 5.0,
      reviewCount: 1,
      notificationsEnabled: {
        email: emailActive,
        sms: true,
        whatsapp: whatsappActive
      },
      hours: [
        { dayOfWeek: 0, dayName: 'Sunday', isClosed: true, openTime: '10:00', closeTime: '17:00' },
        { dayOfWeek: 1, dayName: 'Monday', isClosed: false, openTime: '09:00', closeTime: '18:00' },
        { dayOfWeek: 2, dayName: 'Tuesday', isClosed: false, openTime: '09:00', closeTime: '18:00' },
        { dayOfWeek: 3, dayName: 'Wednesday', isClosed: false, openTime: '09:00', closeTime: '18:00' },
        { dayOfWeek: 4, dayName: 'Thursday', isClosed: false, openTime: '09:00', closeTime: '18:00' },
        { dayOfWeek: 5, dayName: 'Friday', isClosed: false, openTime: '09:00', closeTime: '18:00' },
        { dayOfWeek: 6, dayName: 'Saturday', isClosed: false, openTime: '10:00', closeTime: '16:00' }
      ],
      blockedDates: [],
      reminderRules: []
    };

    mockStorage.addBusiness(newBiz);

    // Add first service
    mockStorage.saveService({
      id: 'srv-' + Date.now(),
      businessId: newBiz.id,
      name: serviceName,
      category: 'Consulting',
      description: 'First service created during rapid onboarding.',
      durationMinutes: serviceDuration,
      bufferMinutes: 10,
      price: servicePrice,
      currency: 'NGN',
      isActive: true,
      bookingCount: 0
    });

    confetti({ particleCount: 70, spread: 80 });
    setStep(7);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://bookme.io/business/${createdSlug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '720px', margin: '40px auto', padding: '0 20px 80px' }}>
      
      {/* Progress Stepper */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <span>Step {step} of 7</span>
          <span>{Math.round((step / 7) * 100)}% Completed</span>
        </div>
        <div style={{ width: '100%', height: '6px', background: '#1E293B', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${(step / 7) * 100}%`, height: '100%', background: '#10B981', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      <div className="card" style={{ padding: '36px' }}>
        
        {/* STEP 1: Account Creation */}
        {step === 1 && (
          <div>
            <span className="badge badge-confirmed" style={{ marginBottom: '8px' }}>Step 1</span>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Create Your Administrator Account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Your credentials will allow you to manage appointments, staff, and payments.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Full Name</label>
                <input type="text" className="input-field" value={adminName} onChange={e => setAdminName(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Work Email</label>
                <input type="email" className="input-field" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Password</label>
                <input type="password" readOnly className="input-field" value="••••••••••••" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Business Information */}
        {step === 2 && (
          <div>
            <span className="badge badge-confirmed" style={{ marginBottom: '8px' }}>Step 2</span>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Tell Us About Your Business</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
              This appears at the top of your public booking page.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Business Name</label>
                <input type="text" className="input-field" value={businessName} onChange={e => setBusinessName(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Business Category</label>
                <input type="text" className="input-field" value={category} onChange={e => setCategory(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Location / Address</label>
                <input type="text" className="input-field" value={address} onChange={e => setAddress(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Business Hours */}
        {step === 3 && (
          <div>
            <span className="badge badge-confirmed" style={{ marginBottom: '8px' }}>Step 3</span>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Standard Operating Hours</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Set when customers are allowed to schedule slots with you.
            </p>

            <div style={{ background: '#0B0F19', padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Monday – Friday:</span>
                <strong>09:00 AM – 06:00 PM</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Saturday:</span>
                <strong>10:00 AM – 04:00 PM</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#FB7185' }}>
                <span>Sunday:</span>
                <strong>Closed</strong>
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-faint)', marginTop: '12px' }}>
              * You can fine-tune specific break times and blocked holiday dates later in Settings.
            </p>
          </div>
        )}

        {/* STEP 4: First Service */}
        {step === 4 && (
          <div>
            <span className="badge badge-confirmed" style={{ marginBottom: '8px' }}>Step 4</span>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Create Your First Service</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Add at least one service so your booking page can go live immediately.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Service Title</label>
                <input type="text" className="input-field" value={serviceName} onChange={e => setServiceName(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Duration (Mins)</label>
                  <input type="number" className="input-field" value={serviceDuration} onChange={e => setServiceDuration(Number(e.target.value))} />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Price (NGN)</label>
                  <input type="number" className="input-field" value={servicePrice} onChange={e => setServicePrice(Number(e.target.value))} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Notifications */}
        {step === 5 && (
          <div>
            <span className="badge badge-confirmed" style={{ marginBottom: '8px' }}>Step 5</span>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Multi-Channel Notifications</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Choose how BookMe will confirm bookings and remind your clients.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#0B0F19', padding: '14px', borderRadius: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={whatsappActive} onChange={e => setWhatsappActive(e.target.checked)} />
                <div>
                  <div style={{ fontWeight: 600 }}>WhatsApp Confirmation & Reminders</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Automated template alerts direct to client phones</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#0B0F19', padding: '14px', borderRadius: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={emailActive} onChange={e => setEmailActive(e.target.checked)} />
                <div>
                  <div style={{ fontWeight: 600 }}>Email Confirmations</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Full calendar invite (.ics) attached to every booking</div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* STEP 6: Payments */}
        {step === 6 && (
          <div>
            <span className="badge badge-confirmed" style={{ marginBottom: '8px' }}>Step 6</span>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Payment Preferences</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Determine how you collect revenue from clients.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { id: 'online', label: 'Require Full Online Payment', desc: 'Clients must pay by card before booking confirms' },
                { id: 'both', label: 'Allow Online & In-Venue (Recommended)', desc: 'Gives clients maximum flexibility to pay with card or at reception' },
                { id: 'venue', label: 'Pay at Venue Only', desc: 'No online cards required during booking' }
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setPaymentOption(opt.id)}
                  style={{
                    background: paymentOption === opt.id ? 'rgba(16, 185, 129, 0.1)' : '#0B0F19',
                    border: '1px solid ' + (paymentOption === opt.id ? '#10B981' : 'var(--border-subtle)'),
                    padding: '16px',
                    borderRadius: '10px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 600, color: paymentOption === opt.id ? '#34D399' : '#F8FAFC' }}>{opt.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{opt.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 7: Launch & Finish */}
        {step === 7 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={38} color="#10B981" />
            </div>

            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Setup Complete! You are Live!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
              Your business booking engine has been generated and is ready to accept appointments.
            </p>

            <div style={{
              background: '#0B0F19',
              border: '1px solid var(--border-strong)',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '28px'
            }}>
              <span style={{ fontSize: '0.95rem', color: '#34D399', fontWeight: 600, wordBreak: 'break-all' }}>
                bookme.io/business/{createdSlug}
              </span>
              <button
                onClick={handleCopy}
                className="btn btn-secondary"
                style={{ padding: '6px 14px', fontSize: '0.82rem', minHeight: '34px' }}
              >
                <Copy size={14} /> {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to={`/business/${createdSlug}`} target="_blank" className="btn btn-secondary">
                Preview Booking Page <ExternalLink size={15} />
              </Link>
              <Link to="/admin/dashboard" className="btn btn-primary">
                Open Admin Dashboard <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        {step < 7 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
            {step > 1 ? (
              <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={16} /> Back
              </button>
            ) : <div />}

            {step < 6 ? (
              <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
                Next Step <ArrowRight size={16} />
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleFinish}>
                <Sparkles size={16} /> Finish & Launch
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
