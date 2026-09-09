import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockStorage } from '../../services/mockStorage';
import { ServiceBooking, TimeSlot } from '../../types';
import { Calendar, Clock, ArrowRight, RotateCcw, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export const MyBookings: React.FC = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  
  // Reschedule Modal State
  const [reschedulingBooking, setReschedulingBooking] = useState<ServiceBooking | null>(null);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Cancellation Modal State
  const [cancellingBooking, setCancellingBooking] = useState<ServiceBooking | null>(null);

  const refresh = () => {
    if (currentUser) {
      setBookings(mockStorage.getCustomerBookings(currentUser.email));
    }
  };

  useEffect(() => {
    refresh();
  }, [currentUser]);

  useEffect(() => {
    if (reschedulingBooking) {
      const slots = mockStorage.getAvailableSlots(
        reschedulingBooking.businessId,
        reschedulingBooking.serviceId,
        newDate
      );
      setAvailableSlots(slots);
      setSelectedSlot(null);
    }
  }, [reschedulingBooking, newDate]);

  const handleConfirmReschedule = () => {
    if (!reschedulingBooking || !selectedSlot) return;
    mockStorage.rescheduleBooking(
      reschedulingBooking.id,
      newDate,
      selectedSlot.time,
      selectedSlot.displayTime
    );
    setReschedulingBooking(null);
    refresh();
  };

  const handleConfirmCancel = () => {
    if (!cancellingBooking) return;
    mockStorage.updateBookingStatus(cancellingBooking.id, 'CANCELLED');
    setCancellingBooking(null);
    refresh();
  };

  const filtered = bookings.filter(b => {
    if (activeTab === 'UPCOMING') {
      return b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'RESCHEDULED';
    }
    if (activeTab === 'COMPLETED') {
      return b.bookingStatus === 'COMPLETED';
    }
    if (activeTab === 'CANCELLED') {
      return b.bookingStatus === 'CANCELLED';
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px 80px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>My Appointments</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          View, reschedule, or cancel your bookings with zero phone calls.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '24px' }}>
        {(['UPCOMING', 'COMPLETED', 'CANCELLED'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? '#10B981' : 'transparent',
              color: activeTab === tab ? '#FFFFFF' : 'var(--text-muted)',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()} ({bookings.filter(b => {
              if (tab === 'UPCOMING') return b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'RESCHEDULED';
              if (tab === 'COMPLETED') return b.bookingStatus === 'COMPLETED';
              return b.bookingStatus === 'CANCELLED';
            }).length})
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No appointments in this category.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(b => (
            <div key={b.id} className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className={`badge badge-${b.bookingStatus.toLowerCase()}`}>
                    {b.bookingStatus}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>Ref: {b.bookingReference}</span>
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{b.serviceName}</h3>
                <div style={{ fontSize: '0.92rem', color: '#A7F3D0', fontWeight: 600, marginBottom: '6px' }}>
                  {b.businessName}
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} color="#10B981" /> {b.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} color="#10B981" /> {b.displayTime} ({b.serviceDuration}m)
                  </span>
                  <span>Amount: {b.currency} {b.amount.toLocaleString()} ({b.paymentStatus})</span>
                </div>
              </div>

              {activeTab === 'UPCOMING' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '0.82rem', minHeight: '36px' }}
                    onClick={() => setReschedulingBooking(b)}
                  >
                    <RotateCcw size={14} /> Reschedule
                  </button>
                  <button
                    className="btn btn-destructive"
                    style={{ padding: '8px 14px', fontSize: '0.82rem', minHeight: '36px' }}
                    onClick={() => setCancellingBooking(b)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingBooking && (
        <div className="modal-overlay" onClick={() => setReschedulingBooking(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Reschedule Appointment</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
              Moving <strong>{reschedulingBooking.serviceName}</strong> with {reschedulingBooking.businessName}.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Select New Date</label>
              <input
                type="date"
                className="input-field"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Available Slots</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
                {availableSlots.map(slot => (
                  <button
                    key={slot.time}
                    disabled={!slot.isAvailable}
                    onClick={() => setSelectedSlot(slot)}
                    style={{
                      background: selectedSlot?.time === slot.time ? '#10B981' : '#1E293B',
                      color: selectedSlot?.time === slot.time ? '#FFFFFF' : slot.isAvailable ? '#F8FAFC' : 'var(--text-faint)',
                      border: '1px solid ' + (selectedSlot?.time === slot.time ? '#10B981' : 'var(--border-subtle)'),
                      padding: '8px 4px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: slot.isAvailable ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {slot.displayTime}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setReschedulingBooking(null)}>
                Keep Current Time
              </button>
              <button
                className="btn btn-primary"
                disabled={!selectedSlot}
                onClick={handleConfirmReschedule}
              >
                Confirm New Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancellingBooking && (
        <div className="modal-overlay" onClick={() => setCancellingBooking(null)}>
          <div className="modal-content" style={{ maxWidth: '440px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertTriangle size={28} color="#FB7185" />
            </div>

            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Cancel Appointment?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px', lineHeight: 1.4 }}>
              Are you sure you want to cancel your <strong>{cancellingBooking.serviceName}</strong> appointment on {cancellingBooking.date}? Your refund will be processed to your card automatically.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setCancellingBooking(null)}>
                Never Mind
              </button>
              <button className="btn btn-destructive" style={{ flex: 1 }} onClick={handleConfirmCancel}>
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
