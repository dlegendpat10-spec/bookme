import React, { useState, useEffect } from 'react';
import { mockStorage } from '../../services/mockStorage';
import { BusinessHours, BlockedDate } from '../../types';
import { Clock, Calendar, Check, Save, Plus, Trash2 } from 'lucide-react';

export const Availability: React.FC = () => {
  const business = mockStorage.getBusinesses()[0];
  const [hours, setHours] = useState<BusinessHours[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Blocked Date Input
  const [blockStart, setBlockStart] = useState('');
  const [blockEnd, setBlockEnd] = useState('');
  const [blockReason, setBlockReason] = useState('');

  useEffect(() => {
    if (business) {
      setHours(business.hours);
      setBlockedDates(business.blockedDates || []);
    }
  }, [business]);

  const handleHourToggle = (dayOfWeek: number) => {
    setHours(prev => prev.map(h => {
      if (h.dayOfWeek === dayOfWeek) {
        return { ...h, isClosed: !h.isClosed };
      }
      return h;
    }));
  };

  const handleTimeChange = (dayOfWeek: number, field: 'openTime' | 'closeTime', val: string) => {
    setHours(prev => prev.map(h => {
      if (h.dayOfWeek === dayOfWeek) {
        return { ...h, [field]: val };
      }
      return h;
    }));
  };

  const handleSaveHours = () => {
    if (!business) return;
    mockStorage.updateBusiness(business.id, { hours, blockedDates });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddBlocked = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockStart || !blockEnd || !blockReason) return;
    const newBlock: BlockedDate = {
      id: 'blk-' + Date.now(),
      startDate: blockStart,
      endDate: blockEnd,
      reason: blockReason
    };
    const updated = [...blockedDates, newBlock];
    setBlockedDates(updated);
    setBlockStart('');
    setBlockEnd('');
    setBlockReason('');
    if (business) {
      mockStorage.updateBusiness(business.id, { blockedDates: updated });
    }
  };

  const handleRemoveBlocked = (id: string) => {
    const updated = blockedDates.filter(b => b.id !== id);
    setBlockedDates(updated);
    if (business) {
      mockStorage.updateBusiness(business.id, { blockedDates: updated });
    }
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Operating Hours & Shifts</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Configure standard working hours and block public holidays or vacation dates.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleSaveHours}>
          <Save size={16} /> Save Hours Changes
        </button>
      </div>

      {savedSuccess && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#34D399', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={18} /> Working hours successfully updated and synchronized across booking engines!
        </div>
      )}

      {/* Weekly Hours Table */}
      <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} color="#10B981" /> Weekly Schedule (Monday – Sunday)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {hours.map(h => (
            <div
              key={h.dayOfWeek}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: h.isClosed ? 'var(--bg-app)' : 'var(--bg-card-hover)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ width: '130px', fontWeight: 600, fontSize: '0.95rem' }}>
                {h.dayName}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={!h.isClosed}
                    onChange={() => handleHourToggle(h.dayOfWeek)}
                  />
                  <span>{h.isClosed ? 'Closed' : 'Open'}</span>
                </label>

                {!h.isClosed && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="time"
                      className="input-field"
                      style={{ padding: '4px 8px', minHeight: '34px', fontSize: '0.85rem' }}
                      value={h.openTime}
                      onChange={e => handleTimeChange(h.dayOfWeek, 'openTime', e.target.value)}
                    />
                    <span style={{ color: 'var(--text-faint)' }}>to</span>
                    <input
                      type="time"
                      className="input-field"
                      style={{ padding: '4px 8px', minHeight: '34px', fontSize: '0.85rem' }}
                      value={h.closeTime}
                      onChange={e => handleTimeChange(h.dayOfWeek, 'closeTime', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blocked Dates / Holidays Manager */}
      <div className="card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="#F59E0B" /> Blocked Holidays & Time Off
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '18px' }}>
          Dates added here will be automatically unavailable on your public booking page.
        </p>

        {/* Add Block Form */}
        <form onSubmit={handleAddBlocked} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px', marginBottom: '20px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Start Date</label>
            <input
              type="date"
              required
              className="input-field"
              value={blockStart}
              onChange={e => setBlockStart(e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>End Date</label>
            <input
              type="date"
              required
              className="input-field"
              value={blockEnd}
              onChange={e => setBlockEnd(e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Reason</label>
            <input
              type="text"
              required
              placeholder="e.g. Renovation"
              className="input-field"
              value={blockReason}
              onChange={e => setBlockReason(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary" style={{ minHeight: '42px' }}>
            <Plus size={16} /> Block Date
          </button>
        </form>

        {/* Blocked Dates List */}
        {blockedDates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            No upcoming blocked dates recorded.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {blockedDates.map(b => (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(15, 23, 42, 0.6)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.92rem' }}>{b.reason}</strong>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {b.startDate} to {b.endDate}
                  </div>
                </div>
                <button
                  className="btn btn-ghost"
                  style={{ color: '#FB7185', padding: '6px' }}
                  onClick={() => handleRemoveBlocked(b.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
