import React, { useState, useEffect } from 'react';
import { mockStorage } from '../../services/mockStorage';
import { ServiceBooking, BookingStatus } from '../../types';
import { Search, Filter, Plus, Calendar, Clock, Eye, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

export const BookingsList: React.FC = () => {
  const business = mockStorage.getBusinesses()[0];
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(null);

  // Manual Booking Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualServiceId, setManualServiceId] = useState('');
  const [manualTime, setManualTime] = useState('16:00');
  const services = business ? mockStorage.getServices(business.id) : [];

  const refresh = () => {
    if (business) {
      setBookings(mockStorage.getBookings(business.id));
    }
  };

  useEffect(() => {
    refresh();
    if (services.length > 0 && !manualServiceId) {
      setManualServiceId(services[0].id);
    }
  }, [business]);

  const handleStatusChange = (id: string, newStatus: BookingStatus) => {
    mockStorage.updateBookingStatus(id, newStatus);
    refresh();
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking({ ...selectedBooking, bookingStatus: newStatus });
    }
  };

  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !manualServiceId) return;

    const srv = services.find(s => s.id === manualServiceId);
    if (!srv) return;

    const hour = parseInt(manualTime.split(':')[0], 10);
    const minute = manualTime.split(':')[1];
    const displayTime = `${hour > 12 ? hour - 12 : hour}:${minute} ${hour >= 12 ? 'PM' : 'AM'}`;

    mockStorage.createBooking({
      businessId: business.id,
      serviceId: srv.id,
      date: new Date().toISOString().split('T')[0],
      time: manualTime,
      displayTime,
      customerName: manualName || 'Walk-in Client',
      customerEmail: manualEmail || 'walkin@example.com',
      customerPhone: manualPhone || '+234 800 000 0000',
      paymentMethod: 'In-Venue Cash / POS'
    });

    setShowAddModal(false);
    setManualName('');
    setManualPhone('');
    refresh();
  };

  const filtered = bookings.filter(b => {
    const matchesSearch = 
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerPhone.includes(searchTerm) ||
      b.bookingReference.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Bookings Ledger</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Comprehensive filterable directory of all customer appointments.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> + New Walk-in Booking
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="card" style={{ padding: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            className="input-field"
            placeholder="Search customer, phone, email, or reference (e.g. BK-78412)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ minHeight: '38px', padding: '6px 12px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
          {['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                background: statusFilter === st ? 'var(--brand-primary)' : 'var(--bg-elevated)',
                color: statusFilter === st ? '#FFFFFF' : 'var(--text-muted)',
                border: '1px solid ' + (statusFilter === st ? 'var(--brand-primary)' : 'var(--border-subtle)'),
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-card-hover)', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px 16px' }}>Reference</th>
              <th style={{ padding: '14px 16px' }}>Customer</th>
              <th style={{ padding: '14px 16px' }}>Service</th>
              <th style={{ padding: '14px 16px' }}>Date & Time</th>
              <th style={{ padding: '14px 16px' }}>Amount</th>
              <th style={{ padding: '14px 16px' }}>Payment</th>
              <th style={{ padding: '14px 16px' }}>Status</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No bookings found matching criteria.
                </td>
              </tr>
            ) : (
              filtered.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#34D399' }}>
                    {b.bookingReference}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600 }}>{b.customerName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.customerPhone}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div>{b.serviceName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.serviceDuration} mins</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div>{b.date}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.displayTime}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                    {b.currency} {b.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge badge-${b.bookingStatus.toLowerCase()}`}>
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.78rem', minHeight: '30px' }}
                      onClick={() => setSelectedBooking(b)}
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Booking Details Drawer / Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span className="badge badge-confirmed">Booking Record</span>
                <h3 style={{ fontSize: '1.4rem', marginTop: '6px' }}>Ref: {selectedBooking.bookingReference}</h3>
              </div>
              <button className="btn btn-ghost" onClick={() => setSelectedBooking(null)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div style={{ background: '#0B0F19', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customer Information</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>{selectedBooking.customerName}</div>
                <div style={{ fontSize: '0.85rem' }}>{selectedBooking.customerEmail} • {selectedBooking.customerPhone}</div>
              </div>

              <div style={{ background: '#0B0F19', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Service & Schedule</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>{selectedBooking.serviceName}</div>
                <div style={{ fontSize: '0.85rem' }}>
                  {selectedBooking.date} at {selectedBooking.displayTime} ({selectedBooking.serviceDuration} mins)
                </div>
              </div>

              <div style={{ background: '#0B0F19', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Financial Summary</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>
                  {selectedBooking.currency} {selectedBooking.amount.toLocaleString()} ({selectedBooking.paymentStatus})
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Method: {selectedBooking.paymentMethod}</div>
              </div>
            </div>

            {/* Quick Status Modifiers */}
            <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1, fontSize: '0.85rem' }}
                onClick={() => handleStatusChange(selectedBooking.id, 'COMPLETED')}
              >
                <CheckCircle2 size={16} /> Mark Completed
              </button>
              <button
                className="btn btn-destructive"
                style={{ flex: 1, fontSize: '0.85rem' }}
                onClick={() => handleStatusChange(selectedBooking.id, 'CANCELLED')}
              >
                <XCircle size={16} /> Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Booking Creation Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Add Manual Walk-In Booking</h3>
            <form onSubmit={handleCreateManualBooking} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Customer Full Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. David Okon"
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Email</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="david@example.com"
                    value={manualEmail}
                    onChange={e => setManualEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Phone</label>
                  <input
                    type="tel"
                    required
                    className="input-field"
                    placeholder="+234 801 234 5678"
                    value={manualPhone}
                    onChange={e => setManualPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Select Service</label>
                <select
                  className="input-field"
                  value={manualServiceId}
                  onChange={e => setManualServiceId(e.target.value)}
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.durationMinutes}m) - ₦{s.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Time Slot (Today)</label>
                <input
                  type="time"
                  className="input-field"
                  value={manualTime}
                  onChange={e => setManualTime(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
