import React, { useState, useEffect } from 'react';
import { mockStorage } from '../../services/mockStorage';
import { NotificationLog } from '../../types';
import { X, MessageSquare, Mail, Smartphone, CheckCircle, RefreshCw } from 'lucide-react';

export const NotificationViewerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [logs, setLogs] = useState<NotificationLog[]>([]);

  const refreshLogs = () => {
    setLogs(mockStorage.getNotifications());
  };

  useEffect(() => {
    refreshLogs();
    const timer = setInterval(refreshLogs, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={20} color="#10B981" />
              Decoupled Notification Dispatch Queue
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Simulates asynchronous background delivery across WhatsApp, Email, and SMS.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <p>No notifications dispatched yet.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
              Book an appointment to see instantaneous asynchronous WhatsApp and Email dispatches!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '60vh', overflowY: 'auto' }}>
            {logs.map((log) => (
              <div
                key={log.id}
                style={{
                  background: log.channel === 'WHATSAPP' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(30, 41, 59, 0.6)',
                  border: log.channel === 'WHATSAPP' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '14px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {log.channel === 'WHATSAPP' && <span style={{ color: '#25D366', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, fontSize: '0.82rem' }}><MessageSquare size={14} /> WhatsApp Cloud API</span>}
                    {log.channel === 'EMAIL' && <span style={{ color: '#60A5FA', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, fontSize: '0.82rem' }}><Mail size={14} /> Postmark Transactional Email</span>}
                    {log.channel === 'SMS' && <span style={{ color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, fontSize: '0.82rem' }}><Smartphone size={14} /> SMS Gateway</span>}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>To: {log.recipient}</span>
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34D399', fontSize: '0.75rem', fontWeight: 600 }}>
                    <CheckCircle size={12} /> {log.status}
                  </span>
                </div>

                <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '4px' }}>
                  {log.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                  {log.message}
                </div>
                {log.message.includes('/auth/reset-password') && (
                  <div style={{ marginTop: '10px' }}>
                    <a
                      href={log.message.match(/https?:\/\/[^\s]+/)?.[0] || '#'}
                      onClick={onClose}
                      className="btn btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px 14px', textDecoration: 'none' }}
                    >
                      Open Password Reset Link &rarr;
                    </a>
                  </div>
                )}
                <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: '8px' }}>
                  Dispatched at: {new Date(log.sentAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
