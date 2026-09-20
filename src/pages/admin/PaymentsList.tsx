import React, { useState, useEffect } from 'react';
import { mockStorage } from '../../services/mockStorage';
import { ServiceBooking } from '../../types';
import { CreditCard, DollarSign, ArrowDownLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const PaymentsList: React.FC = () => {
  const business = mockStorage.getBusinesses()[0];
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);

  const refresh = () => {
    if (business) {
      setBookings(mockStorage.getBookings(business.id));
    }
  };

  useEffect(() => {
    refresh();
  }, [business]);

  const handleSimulateRefund = (id: string) => {
    if (window.confirm('Simulate issuing a full refund to this customer?')) {
      const all = mockStorage.getBookings();
      const target = all.find(b => b.id === id);
      if (target) {
        target.paymentStatus = 'REFUNDED';
        target.bookingStatus = 'CANCELLED';
        localStorage.setItem('bookme_bookings', JSON.stringify(all));
        refresh();
      }
    }
  };

  const totalCollected = bookings
    .filter(b => b.paymentStatus === 'PAID')
    .reduce((a, c) => a + c.amount, 0);

  const totalRefunded = bookings
    .filter(b => b.paymentStatus === 'REFUNDED')
    .reduce((a, c) => a + c.amount, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Payments & Transactions</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Audited financial ledger of all customer card payments, settlements, and refunds.
          </p>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="card">
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Settled Volume</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34D399' }}>₦{totalCollected.toLocaleString()}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>100% verified via payment gateway</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Total Refunded</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FB7185' }}>₦{totalRefunded.toLocaleString()}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Returned to client cards</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Processing Engine</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
            <ShieldCheck size={20} color="var(--brand-primary)" /> Tokenized Direct
          </div>
          <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: '4px' }}>PCI-DSS Tier 1 Simulated</div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-card-hover)', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px 18px' }}>Booking Ref</th>
              <th style={{ padding: '14px 18px' }}>Customer</th>
              <th style={{ padding: '14px 18px' }}>Amount</th>
              <th style={{ padding: '14px 18px' }}>Method</th>
              <th style={{ padding: '14px 18px' }}>Status</th>
              <th style={{ padding: '14px 18px' }}>Date</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No transaction records found.
                </td>
              </tr>
            ) : (
              bookings.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '14px 18px', fontFamily: 'monospace', fontWeight: 700, color: '#34D399' }}>
                    {b.bookingReference}
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 600 }}>
                    {b.customerName}
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 700 }}>
                    {b.currency} {b.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {b.paymentMethod}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span className="badge" style={{
                      background: b.paymentStatus === 'PAID' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: b.paymentStatus === 'PAID' ? '#34D399' : '#FB7185'
                    }}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    {b.paymentStatus === 'PAID' ? (
                      <button
                        className="btn btn-ghost"
                        style={{ padding: '4px 10px', fontSize: '0.75rem', minHeight: '30px', color: '#FB7185' }}
                        onClick={() => handleSimulateRefund(b.id)}
                      >
                        Refund
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>Refunded</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
