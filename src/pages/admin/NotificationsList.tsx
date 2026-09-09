import React, { useState, useEffect } from 'react';
import { mockStorage } from '../../services/mockStorage';
import { BusinessTenant } from '../../types';
import { MessageSquare, Mail, Smartphone, Clock, Check, Save } from 'lucide-react';

export const NotificationsList: React.FC = () => {
  const business = mockStorage.getBusinesses()[0];
  const [waEnabled, setWaEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [rem24Enabled, setRem24Enabled] = useState(true);
  const [rem2Enabled, setRem2Enabled] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (business) {
      setWaEnabled(business.notificationsEnabled?.whatsapp ?? true);
      setEmailEnabled(business.notificationsEnabled?.email ?? true);
      setSmsEnabled(business.notificationsEnabled?.sms ?? true);
    }
  }, [business]);

  const handleSave = () => {
    if (!business) return;
    mockStorage.updateBusiness(business.id, {
      notificationsEnabled: {
        whatsapp: waEnabled,
        email: emailEnabled,
        sms: smsEnabled
      }
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Multi-Channel Notifications & Reminders</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Automate booking confirmations and reduce no-shows across WhatsApp, Email, and SMS.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={16} /> Save Settings
        </button>
      </div>

      {saveSuccess && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#34D399', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={18} /> Notification routing rules updated!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* Left Column: Channels & Reminder Rules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Master Channel Switches */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Active Communication Channels</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(37, 211, 102, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageSquare size={20} color="#25D366" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>WhatsApp Business Cloud API</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Send branded interactive messages with 98% open rate</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  checked={waEnabled}
                  onChange={e => setWaEnabled(e.target.checked)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail size={20} color="#60A5FA" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>Transactional Email (Postmark)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Full calendar invite (.ics) and detailed receipts</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  checked={emailEnabled}
                  onChange={e => setEmailEnabled(e.target.checked)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Smartphone size={20} color="#F59E0B" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>SMS Gateway Alerts</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Immediate cellular text message confirmations</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  checked={smsEnabled}
                  onChange={e => setSmsEnabled(e.target.checked)}
                />
              </div>
            </div>
          </div>

          {/* Automated Reminders */}
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#10B981" /> Pre-Appointment Automated Reminders
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(30, 41, 59, 0.5)', padding: '14px', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>24 Hours Before Appointment</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sent via WhatsApp & Email</div>
                </div>
                <input
                  type="checkbox"
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  checked={rem24Enabled}
                  onChange={e => setRem24Enabled(e.target.checked)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(30, 41, 59, 0.5)', padding: '14px', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>2 Hours Before Appointment</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sent via WhatsApp Quick Alert</div>
                </div>
                <input
                  type="checkbox"
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  checked={rem2Enabled}
                  onChange={e => setRem2Enabled(e.target.checked)}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live WhatsApp Bubble Preview */}
        <div className="card" style={{ padding: '24px', background: '#0B0F19', border: '1px solid var(--border-strong)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px' }}>
            Live WhatsApp Message Preview
          </div>

          <div style={{
            background: '#075E54',
            borderRadius: '16px',
            padding: '16px',
            color: '#FFFFFF'
          }}>
            <div style={{
              background: '#0B2027',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '0.86rem',
              lineHeight: 1.45,
              position: 'relative',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{ fontWeight: 700, color: '#25D366', marginBottom: '6px' }}>
                Luxe Grooming Lounge
              </div>
              <div>
                Hello <strong>Alex Morgan</strong>! 👋
              </div>
              <div style={{ margin: '8px 0' }}>
                Your appointment for <strong>Executive Precision Haircut</strong> is confirmed for <strong>Today at 5:00 PM</strong>.
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                Ref: #BK-78412 • Total: ₦10,000 (Paid ✓)
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#A7F3D0' }}>
                📍 14 Admiralty Way, Lekki Phase 1
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#64748B', marginTop: '8px' }}>
                12:00 PM ✓✓
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
