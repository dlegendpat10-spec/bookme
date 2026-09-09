import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockStorage } from '../../services/mockStorage';
import { UserCheck, RefreshCw, AlertTriangle, ShieldAlert, Sparkles, Bell } from 'lucide-react';
import { NotificationViewerModal } from '../shared/NotificationViewerModal';

export const DemoBar: React.FC = () => {
  const { currentUser, signInAs, usersList, signOut } = useAuth();
  const [simConflict, setSimConflict] = useState(mockStorage.getSimulateConflict());
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifCount, setNotifCount] = useState(mockStorage.getNotifications().length);

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
    if (window.confirm('Reset all demo data (bookings, services, customers) to default?')) {
      mockStorage.resetAll();
      window.location.reload();
    }
  };

  return (
    <>
      <aside aria-label="Interactive Demo Controls" className="demo-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#A7F3D0' }}>
            <Sparkles size={16} /> BookMe Interactive Prototype
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Active Persona:
          </span>
          <select
            value={currentUser ? currentUser.id : 'guest'}
            onChange={(e) => {
              if (e.target.value === 'guest') {
                signOut();
              } else {
                signInAs(e.target.value);
              }
            }}
            style={{
              background: '#1E293B',
              color: '#F8FAFC',
              border: '1px solid #334155',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <option value="user-customer-returning">👤 Alex Morgan (Returning Customer - 1-Tap Ready)</option>
            <option value="user-admin-1">💈 Marcus Vance (Admin: Luxe Grooming)</option>
            <option value="user-admin-2">🎓 Dr. Sarah Jenkins (Admin: Apex Advisory)</option>
            <option value="guest">🌐 Guest Visitor (New Customer)</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Double-Booking Simulation Toggle */}
          <button
            onClick={handleConflictToggle}
            title="When active, any booking attempt triggers a 409 Double-Booking Conflict to test error recovery"
            style={{
              background: simConflict ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.08)',
              border: simConflict ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.15)',
              color: simConflict ? '#FCA5A5' : '#E2E8F0',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <ShieldAlert size={14} color={simConflict ? '#EF4444' : '#94A3B8'} />
            Simulate Double-Booking Conflict: <strong>{simConflict ? 'ON (Fails 409)' : 'OFF (Normal)'}</strong>
          </button>

          {/* Live Notification Queue Inspector */}
          <button
            onClick={() => setShowNotifications(true)}
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              color: '#93C5FD',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Bell size={14} /> Async Logs ({notifCount})
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={handleResetData}
            title="Reset database to initial state"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem'
            }}
          >
            <RefreshCw size={13} /> Reset
          </button>
        </div>
      </aside>

      {showNotifications && (
        <NotificationViewerModal onClose={() => setShowNotifications(false)} />
      )}
    </>
  );
};
