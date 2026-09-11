import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockStorage } from '../../services/mockStorage';
import { ServiceBooking } from '../../types';
import { Calendar, Clock, ArrowRight, Zap, CheckCircle2, Star, Sparkles } from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);

  useEffect(() => {
    if (currentUser) {
      setBookings(mockStorage.getCustomerBookings(currentUser.email));
    }
  }, [currentUser]);

  const upcoming = bookings.filter(b => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'RESCHEDULED');
  const past = bookings.filter(b => b.bookingStatus === 'COMPLETED');
  const nextAppt = upcoming[0];

  return (
    <div style={{ maxWidth: '1040px', margin: '36px auto', padding: '0 24px 80px' }}>
      {/* Welcome Banner */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--brand-primary)', fontWeight: 700, marginBottom: '8px' }}>
          <Sparkles size={14} /> Client Workspace
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Welcome back, {currentUser?.fullName || 'Alex'}!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          View upcoming appointments, review past visits, and rebook your favorite services in 1-tap.
        </p>
      </div>

      {/* Next Appointment Hero Card */}
      {nextAppt ? (
        <div className="glass-card glow-card" style={{
          background: 'linear-gradient(135deg, var(--brand-light) 0%, var(--bg-card) 100%)',
          border: '1px solid var(--brand-primary)',
          padding: '32px',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="badge badge-confirmed" style={{ marginBottom: '12px', padding: '4px 12px' }}>
                ✓ Confirmed Upcoming Appointment
              </span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '6px' }}>{nextAppt.serviceName}</h2>
              <div style={{ fontSize: '1.1rem', color: 'var(--brand-primary)', fontWeight: 800, marginBottom: '16px' }}>
                {nextAppt.businessName}
              </div>

              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <Calendar size={18} color="var(--brand-primary)" /> {nextAppt.date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <Clock size={18} color="var(--brand-primary)" /> {nextAppt.displayTime} ({nextAppt.serviceDuration} mins)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  Ref: <strong style={{ color: 'var(--text-main)', letterSpacing: '0.05em' }}>{nextAppt.bookingReference}</strong>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '200px' }}>
              <Link to="/customer/bookings" className="btn btn-primary" style={{ padding: '12px 20px', fontSize: '0.92rem' }}>
                Manage Appointment <ArrowRight size={16} />
              </Link>
              <Link to={`/business/${nextAppt.businessSlug}`} className="btn btn-secondary" style={{ padding: '12px 20px', fontSize: '0.92rem' }}>
                Book Another Service
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '10px' }}>No Active Appointments</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', marginBottom: '24px', maxWidth: '440px', margin: '0 auto 24px' }}>
            Ready to schedule your next styling, consultation, or wellness session?
          </p>
          <Link to="/business/luxe-grooming" className="btn btn-fast-book" style={{ display: 'inline-flex', padding: '14px 28px' }}>
            <Zap size={18} fill="#FFFFFF" /> Book in 5 Seconds
          </Link>
        </div>
      )}

      {/* Quick Rebook Cards */}
      <div style={{ marginBottom: '44px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>Fast Rebook Favorites</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="glass-card glow-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Luxe Grooming Lounge</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '6px 0 8px' }}>Executive Precision Haircut</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--brand-primary)', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>₦10,000 · 30 mins</p>
            </div>
            <Link to="/business/luxe-grooming" className="btn btn-primary" style={{ marginTop: '20px', fontSize: '0.88rem' }}>
              <Zap size={15} fill="#fff" /> 1-Tap Book Again
            </Link>
          </div>

          <div className="glass-card glow-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Luxe Grooming Lounge</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '6px 0 8px' }}>Hot Towel Beard Sculpt</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--brand-primary)', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>₦7,500 · 30 mins</p>
            </div>
            <Link to="/business/luxe-grooming" className="btn btn-primary" style={{ marginTop: '20px', fontSize: '0.88rem' }}>
              <Zap size={15} fill="#fff" /> 1-Tap Book Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
