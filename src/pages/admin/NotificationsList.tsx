import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockStorage } from '../../services/mockStorage';
import { BusinessTenant, NotificationLog } from '../../types';
import { MessageSquare, Mail, Smartphone, Clock, Check, Save, Send, RefreshCw } from 'lucide-react';

export const NotificationsList: React.FC = () => {
  const { currentUser } = useAuth();
  const business = mockStorage.getActiveBusiness(currentUser?.businessId, currentUser?.businessSlug);
  const [waEnabled, setWaEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [rem24Enabled, setRem24Enabled] = useState(true);
  const [rem2Enabled, setRem2Enabled] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testSentMsg, setTestSentMsg] = useState<string | null>(null);
  const [logs, setLogs] = useState<NotificationLog[]>([]);

  const refreshLogs = () => {
    setLogs(mockStorage.getNotifications());
  };

  useEffect(() => {
    if (business) {
      setWaEnabled(business.notificationsEnabled?.whatsapp ?? true);
      setEmailEnabled(business.notificationsEnabled?.email ?? true);
      setSmsEnabled(business.notificationsEnabled?.sms ?? true);
    }
    refreshLogs();
  }, [business?.id]);

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

  const handleSendTestEmail = () => {
    const adminEmail = business?.email || currentUser?.email || 'admin@example.com';
    const clientEmail = 'client.demo@example.com';

    // Dispatched to client
    mockStorage.logNotification({
      channel: 'EMAIL',
      recipient: clientEmail,
      title: `[Verified Dispatch] Booking Confirmed with ${business?.name || 'Bookmi'}`,
      message: `Hi Valued Client,\n\nYour appointment with ${business?.name || 'Bookmi Business'} has been scheduled. Both client and admin email channels are verified and operational!`,
      status: 'DELIVERED',
    });

    // Dispatched to admin
    mockStorage.logNotification({
      channel: 'EMAIL',
      recipient: adminEmail,
      title: `[Verified Dispatch] Admin Booking Alert - ${business?.name || 'Bookmi'}`,
      message: `Hello ${business?.name || 'Business'} Admin,\n\nTest dispatch confirmed. Clients and admins automatically receive formatted email notifications for all bookings, status updates, and responses.`,
      status: 'DELIVERED',
    });

    refreshLogs();
    setTestSentMsg(`Test emails successfully dispatched to Client (${clientEmail}) and Admin (${adminEmail})!`);
    setTimeout(() => setTestSentMsg(null), 5000);
  };

  const handleSendRegistrationEmail = () => {
    const email = business?.email || currentUser?.email || 'admin@bookmi.local';
    const name = currentUser?.fullName || business?.name || 'Valued Partner';

    mockStorage.sendRegistrationConfirmationEmail({
      fullName: name,
      email,
      role: 'BUSINESS_ADMIN',
      businessName: business?.name || 'Your Business',
    });

    refreshLogs();
    setTestSentMsg(`Registration welcome confirmation email dispatched to ${email}! View delivery log below.`);
    setTimeout(() => setTestSentMsg(null), 5000);
  };

  return (
    <div style={{ maxWidth: '1080px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Multi-Channel Notifications & Client Emails</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Automate booking confirmations, registration welcomes, and status alerts sent to clients and business admins.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleSendRegistrationEmail} title="Send Registration Confirmation Email">
            <Mail size={15} color="#10B981" /> Resend Registration Email
          </button>
          <button className="btn btn-secondary" onClick={handleSendTestEmail} title="Fire test emails to client & admin">
            <Send size={15} color="#60A5FA" /> Test Booking Email
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} /> Save Rules
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#34D399', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={18} /> Notification routing rules updated!
        </div>
      )}

      {testSentMsg && (
        <div style={{ background: 'rgba(96, 165, 250, 0.15)', border: '1px solid #60A5FA', color: '#93C5FD', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={18} /> {testSentMsg}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)', padding: '14px', borderRadius: '8px' }}>
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

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)', padding: '14px', borderRadius: '8px' }}>
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
                {business.name || 'Your Business'}
              </div>
              <div>
                Hello <strong>Customer Name</strong>! 👋
              </div>
              <div style={{ margin: '8px 0' }}>
                Your appointment for <strong>Service Appointment</strong> is confirmed for <strong>Today at 5:00 PM</strong>.
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                Ref: #BK-78412 • Total: ₦15,000 (Paid ✓)
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#A7F3D0' }}>
                📍 {business.address || 'Business Location'}
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#64748B', marginTop: '8px' }}>
                12:00 PM ✓✓
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── Dispatched Communication Ledger ────────────────────────────── */}
      <div className="card" style={{ marginTop: '32px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={18} color="#60A5FA" /> Audited Communication & Email Dispatch Ledger
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginTop: '2px' }}>
              Real-time audit of all transaction emails and messages dispatched to clients and admins.
            </p>
          </div>

          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={refreshLogs}>
            <RefreshCw size={13} /> Refresh Log
          </button>
        </div>

        {logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No communication dispatches recorded yet. Use the <strong>Test Email Dispatch</strong> button above to test.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 14px' }}>Channel</th>
                  <th style={{ padding: '10px 14px' }}>Recipient</th>
                  <th style={{ padding: '10px 14px' }}>Subject / Headline</th>
                  <th style={{ padding: '10px 14px' }}>Status</th>
                  <th style={{ padding: '10px 14px' }}>Sent At</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const isClient = !log.recipient.toLowerCase().includes('admin');
                  return (
                    <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.86rem' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px',
                          background: log.channel === 'EMAIL' ? 'rgba(96, 165, 250, 0.12)' : 'rgba(37, 211, 102, 0.12)',
                          color: log.channel === 'EMAIL' ? '#60A5FA' : '#25D366',
                        }}>
                          {log.channel === 'EMAIL' ? <Mail size={12} /> : <MessageSquare size={12} />}
                          {log.channel}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600, color: '#F8FAFC' }}>{log.recipient}</div>
                        <span style={{ fontSize: '0.72rem', color: isClient ? '#38BDF8' : '#FBBF24', fontWeight: 700 }}>
                          {isClient ? 'CLIENT EMAIL' : 'ADMIN EMAIL'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', maxWidth: '340px' }}>
                        <div style={{ fontWeight: 600, color: '#E2E8F0' }}>{log.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                          {log.message.replace(/\n/g, ' ')}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: '0.74rem' }}>
                          <Check size={11} /> {log.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: 'var(--text-faint)' }}>
                        {new Date(log.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(log.sentAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
