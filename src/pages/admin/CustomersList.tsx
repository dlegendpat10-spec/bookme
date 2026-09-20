import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockStorage } from '../../services/mockStorage';
import { Customer } from '../../types';
import { Search, User, Phone, Mail, DollarSign, Calendar, MessageSquare } from 'lucide-react';

export const CustomersList: React.FC = () => {
  const { currentUser } = useAuth();
  const business = mockStorage.getActiveBusiness(currentUser?.businessId, currentUser?.businessSlug);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);

  useEffect(() => {
    if (business) {
      setCustomers(mockStorage.getCustomers(business.id));
    }
  }, [business?.id]);

  const filtered = customers.filter(c => 
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Customer Directory (CRM)</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Track client booking histories, lifetime spend, and personalized service preferences.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          className="input-field"
          style={{ minHeight: '38px', border: 'none', background: 'transparent' }}
          placeholder="Search by customer name, email, or phone number..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Customers Table */}
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-card-hover)', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px 18px' }}>Customer Name</th>
              <th style={{ padding: '14px 18px' }}>Contact</th>
              <th style={{ padding: '14px 18px' }}>Total Bookings</th>
              <th style={{ padding: '14px 18px' }}>Lifetime Spend</th>
              <th style={{ padding: '14px 18px' }}>Last Visit</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No customer records found.
                </td>
              </tr>
            ) : (
              filtered.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                        {c.fullName.charAt(0)}
                      </div>
                      <span>{c.fullName}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div>{c.phone}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.email}</div>
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 600 }}>
                    {c.totalBookings}
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: 700, color: '#34D399' }}>
                    ₦{c.totalSpend.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {c.lastVisit || 'N/A'}
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 12px', fontSize: '0.78rem', minHeight: '30px' }}
                      onClick={() => setSelectedCust(c)}
                    >
                      Profile & Notes
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Profile & Notes Modal */}
      {selectedCust && (
        <div className="modal-overlay" onClick={() => setSelectedCust(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem' }}>Customer Details</h3>
              <button className="btn btn-ghost" onClick={() => setSelectedCust(null)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div style={{ background: '#0B0F19', padding: '16px', borderRadius: '10px' }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedCust.fullName}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {selectedCust.email} • {selectedCust.phone}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: '#0B0F19', padding: '14px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Appointments</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{selectedCust.totalBookings}</div>
                </div>
                <div style={{ background: '#0B0F19', padding: '14px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Lifetime Spend</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34D399' }}>₦{selectedCust.totalSpend.toLocaleString()}</div>
                </div>
              </div>

              <div style={{ background: '#0B0F19', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Private Staff Notes</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontStyle: selectedCust.notes ? 'normal' : 'italic' }}>
                  {selectedCust.notes || 'No notes added for this customer yet.'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedCust(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
