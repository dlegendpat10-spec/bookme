import React from 'react';
import { mockStorage } from '../../services/mockStorage';
import { BarChart3, TrendingUp, Users, Clock, Calendar, CheckCircle } from 'lucide-react';

export const Analytics: React.FC = () => {
  const business = mockStorage.getBusinesses()[0];
  const bookings = business ? mockStorage.getBookings(business.id) : [];
  const services = business ? mockStorage.getServices(business.id) : [];

  const totalBookings = bookings.length;
  const completed = bookings.filter(b => b.bookingStatus === 'COMPLETED').length;
  const cancelled = bookings.filter(b => b.bookingStatus === 'CANCELLED').length;
  const grossRevenue = bookings
    .filter(b => b.paymentStatus === 'PAID')
    .reduce((a, c) => a + c.amount, 0);

  // Peak Hours Data Simulation
  const peakHours = [
    { hour: '10 AM', count: 12, pct: 45 },
    { hour: '12 PM', count: 24, pct: 85 },
    { hour: '2 PM', count: 18, pct: 60 },
    { hour: '4 PM', count: 32, pct: 100 },
    { hour: '6 PM', count: 28, pct: 90 },
    { hour: '8 PM', count: 10, pct: 35 }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Business Intelligence & Analytics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Measure scheduling velocity, service popularity, conversion, and peak hours.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="card">
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Total Bookings</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{totalBookings}</div>
          <div style={{ fontSize: '0.78rem', color: '#34D399', marginTop: '4px' }}>+18% from last month</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Gross Revenue</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34D399' }}>₦{grossRevenue.toLocaleString()}</div>
          <div style={{ fontSize: '0.78rem', color: '#34D399', marginTop: '4px' }}>Average Order Value: ₦12,500</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Booking Conversion</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#60A5FA' }}>68.4%</div>
          <div style={{ fontSize: '0.78rem', color: '#60A5FA', marginTop: '4px' }}>Visitors who completed booking</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Cancellation Rate</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FB7185' }}>2.1%</div>
          <div style={{ fontSize: '0.78rem', color: '#34D399', marginTop: '4px' }}>Reduced by WhatsApp reminders</div>
        </div>
      </div>

      {/* Service Leaderboard & Peak Hours */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Most Booked Services Leaderboard */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="#10B981" /> Most Booked Services
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {services.slice(0, 5).map((s, idx) => (
              <div key={s.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600 }}>{idx + 1}. {s.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{s.bookingCount} bookings</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(100, (s.bookingCount / 150) * 100)}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10B981, #34D399)',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Scheduling Hours Heatmap */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="#60A5FA" /> Peak Scheduling Hours
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {peakHours.map(ph => (
              <div key={ph.hour}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600 }}>{ph.hour}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{ph.count} appointments</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${ph.pct}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
