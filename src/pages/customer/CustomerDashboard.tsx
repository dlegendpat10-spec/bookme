import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockStorage } from '../../services/mockStorage';
import { ServiceBooking } from '../../types';
import { Calendar, Clock, MapPin, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

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
    <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px 80px' }}>
      {/* Welcome Banner */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>
          Welcome back, {currentUser?.fullName || 'Alex'}!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Manage your upcoming appointments and 1-tap rebook your favorite services.
        </p>
      </div>

      {/* Next Appointment Hero Card */}
      {nextAppt ? (
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(19, 27, 46, 0.95) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '28px',
          marginBottom: '36px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="badge badge-confirmed" style={{ marginBottom: '10px' }}>
                Next Upcoming Appointment
              </span>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{nextAppt.serviceName}</h2>
              <div style={{ fontSize: '1.05rem', color: '#A7F3D0', fontWeight: 600, marginBottom: '14px' }}>
                {nextAppt.businessName}
              </div>

              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} color="#10B981" /> {nextAppt.date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} color="#10B981" /> {nextAppt.displayTime} ({nextAppt.serviceDuration} mins)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Ref: <strong style={{ color: '#F8FAFC' }}>{nextAppt.bookingReference}</strong>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '180px' }}>
              <Link to="/customer/bookings" className="btn btn-primary" style={{ fontSize: '0.88rem' }}>
                Manage Booking <ArrowRight size={15} />
              </Link>
              <Link to={`/business/${nextAppt.businessSlug}`} className="btn btn-secondary" style={{ fontSize: '0.88rem' }}>
                Book Another Service
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '36px', textAlign: 'center', marginBottom: '36px' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No Upcoming Appointments</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '20px' }}>
            Ready for your next styling session or advisory consultation?
          </p>
          <Link to="/business/luxe-grooming" className="btn btn-fast-book" style={{ display: 'inline-flex' }}>
            <Zap size={18} fill="#FFFFFF" /> Book in 5 Seconds
          </Link>
        </div>
      )}

      {/* Quick Rebook Carousel */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Frequently Booked Services</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Luxe Grooming Lounge</div>
              <h3 style={{ fontSize: '1.15rem', margin: '4px 0 8px' }}>Executive Precision Haircut</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>₦10,000 • 30 mins</p>
            </div>
            <Link to="/business/luxe-grooming" className="btn btn-secondary" style={{ marginTop: '16px', fontSize: '0.82rem' }}>
              1-Tap Book Again
            </Link>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Luxe Grooming Lounge</div>
              <h3 style={{ fontSize: '1.15rem', margin: '4px 0 8px' }}>Hot Towel Beard Sculpt</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>₦7,500 • 30 mins</p>
            </div>
            <Link to="/business/luxe-grooming" className="btn btn-secondary" style={{ marginTop: '16px', fontSize: '0.82rem' }}>
              1-Tap Book Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
