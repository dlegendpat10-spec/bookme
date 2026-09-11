import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockStorage } from '../../services/mockStorage';
import { RefreshCw, ShieldAlert, Sparkles, Bell, X, SlidersHorizontal } from 'lucide-react';
import { NotificationViewerModal } from '../shared/NotificationViewerModal';

export const DemoBar: React.FC = () => {
  const { currentUser, signInAs, signOut } = useAuth();
  const [simConflict, setSimConflict] = useState(mockStorage.getSimulateConflict());
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifCount, setNotifCount] = useState(mockStorage.getNotifications().length);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifCount(mockStorage.getNotifications().length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleConflictToggle = () => {
    const next = !simConflict;
    setSimConflict(next);
    mockStorage.setSimulateConflict(next);
  };

  const handleResetData = () => {
    if (window.confirm('Reset application data (bookings, services, customers) to default?')) {
      mockStorage.resetAll();
      window.location.reload();
    }
  };

  return (
    <>
      {/* Floating Quick Switcher Pill (Fixed Bottom Left) */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 1050,
        }}
      >
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-main)',
              padding: '8px 14px',
              borderRadius: '99px',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-lg)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title="Quick Role & Testing Controls"
          >
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: simConflict ? '#EF4444' : 'var(--brand-primary)',
              boxShadow: simConflict ? '0 0 8px #EF4444' : 'var(--shadow-glow)',
            }} />
            <SlidersHorizontal size={14} color="var(--brand-primary)" />
            <span>Switch Role / Tools</span>
          </button>
        ) : (
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-xl)',
              padding: '20px',
              width: '320px',
              boxShadow: 'var(--shadow-lg)',
              backdropFilter: 'blur(16px)',
              animation: 'slideUp 0.2s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                <Sparkles size={16} color="var(--brand-primary)" /> Platform Control Panel
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Persona Picker */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active User Persona
              </label>
              <select
                value={currentUser ? currentUser.id : 'guest'}
                onChange={(e) => {
                  if (e.target.value === 'guest') {
                    signOut();
                  } else {
                    signInAs(e.target.value);
                  }
                }}
                className="input-field"
                style={{ fontSize: '0.84rem', padding: '8px 10px' }}
              >
                <option value="user-customer-returning">👤 Alex Morgan (Customer)</option>
                <option value="user-admin-1">💈 Marcus Vance (Admin: Luxe Grooming)</option>
                <option value="user-admin-2">🎓 Dr. Sarah Jenkins (Admin: Apex Advisory)</option>
                <option value="guest">🌐 Guest Visitor (Logged Out)</option>
              </select>
            </div>

            {/* Conflict Simulation Toggle */}
            <div style={{ marginBottom: '14px' }}>
              <button
                onClick={handleConflictToggle}
                style={{
                  width: '100%',
                  background: simConflict ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-elevated)',
                  border: simConflict ? '1px solid #EF4444' : '1px solid var(--border-subtle)',
                  color: simConflict ? '#FCA5A5' : 'var(--text-main)',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={15} color={simConflict ? '#EF4444' : 'var(--text-muted)'} />
                  Simulate Conflict (409)
                </span>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 800, padding: '2px 7px', borderRadius: '4px',
                  background: simConflict ? '#EF4444' : 'var(--border-strong)', color: '#fff',
                }}>
                  {simConflict ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowNotifications(true)}
                style={{
                  flex: 1,
                  background: 'var(--brand-light)',
                  border: '1px solid var(--brand-primary)',
                  color: 'var(--brand-primary)',
                  padding: '8px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Bell size={14} /> Async Logs ({notifCount})
              </button>

              <button
                onClick={handleResetData}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                }}
                title="Reset local state to defaults"
              >
                <RefreshCw size={13} /> Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {showNotifications && (
        <NotificationViewerModal onClose={() => setShowNotifications(false)} />
      )}
    </>
  );
};
