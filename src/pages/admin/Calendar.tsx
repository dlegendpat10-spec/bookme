import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockStorage } from '../../services/mockStorage';
import { ServiceBooking } from '../../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, User } from 'lucide-react';

export const AdminCalendar: React.FC = () => {
  const { currentUser } = useAuth();
  const business = mockStorage.getActiveBusiness(currentUser?.businessId, currentUser?.businessSlug);
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);

  useEffect(() => {
    if (business) {
      setBookings(mockStorage.getBookings(business.id));
    }
  }, [business?.id]);

  // Generate 7 days for week view
  const startOfWeek = new Date(currentDate);
  const dayIndex = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - dayIndex);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  return (
    <div>
      {/* Calendar Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Interactive Schedule</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Visual timetable for managing daily appointments and team availability.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* View Mode Toggle */}
          <div style={{ background: 'var(--border-subtle)', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px' }}>
            {(['day', 'week', 'month'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  background: viewMode === mode ? 'var(--brand-primary)' : 'transparent',
                  color: viewMode === mode ? '#FFFFFF' : 'var(--text-muted)',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Date Navigator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              className="btn btn-secondary"
              style={{ padding: '6px 10px', minHeight: '34px' }}
              onClick={() => {
                const prev = new Date(currentDate);
                prev.setDate(prev.getDate() - (viewMode === 'day' ? 1 : 7));
                setCurrentDate(prev);
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="btn btn-secondary"
              style={{ padding: '6px 14px', minHeight: '34px', fontSize: '0.85rem' }}
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </button>
            <button
              className="btn btn-secondary"
              style={{ padding: '6px 10px', minHeight: '34px' }}
              onClick={() => {
                const next = new Date(currentDate);
                next.setDate(next.getDate() + (viewMode === 'day' ? 1 : 7));
                setCurrentDate(next);
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Week View Calendar Table */}
      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-card-hover)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ width: '80px', padding: '14px', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>Time</th>
              {weekDays.map(d => {
                const isToday = d.toDateString() === today.toDateString();
                return (
                  <th key={d.toISOString()} style={{ padding: '14px', textAlign: 'center', borderLeft: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.78rem', color: isToday ? 'var(--brand-primary)' : 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {d.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: isToday ? 'var(--brand-primary)' : 'var(--text-main)' }}>
                      {d.getDate()}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(time => {
              const hourNum = parseInt(time.split(':')[0], 10);
              const displayTime = `${hourNum > 12 ? hourNum - 12 : hourNum} ${hourNum >= 12 ? 'PM' : 'AM'}`;

              return (
                <tr key={time} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '16px 10px', fontSize: '0.75rem', color: 'var(--text-faint)', textAlign: 'center', verticalAlign: 'top', background: 'var(--bg-app)' }}>
                    {displayTime}
                  </td>
                  {weekDays.map(d => {
                    const dateStr = d.toISOString().split('T')[0];
                    // Find bookings matching this day and hour
                    const matchingBookings = bookings.filter(b => {
                      if (b.date !== dateStr) return false;
                      const bHour = parseInt(b.time.split(':')[0], 10);
                      return bHour === hourNum;
                    });

                    return (
                      <td key={dateStr} style={{ padding: '6px', borderLeft: '1px solid var(--border-subtle)', verticalAlign: 'top', minHeight: '60px', width: '13%' }}>
                        {matchingBookings.map(b => (
                          <div
                            key={b.id}
                            style={{
                              background: b.bookingStatus === 'CONFIRMED' ? 'var(--status-confirmed-bg)' : 'var(--status-completed-bg)',
                              borderLeft: '3px solid ' + (b.bookingStatus === 'CONFIRMED' ? 'var(--brand-primary)' : 'var(--status-completed-text)'),
                              borderRadius: '4px',
                              padding: '6px 8px',
                              marginBottom: '4px',
                              fontSize: '0.78rem'
                            }}
                          >
                            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{b.customerName}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{b.serviceName} ({b.displayTime})</div>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
