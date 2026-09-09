import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { mockStorage } from '../../services/mockStorage';
import { ServiceBooking } from '../../types';
import { CheckCircle2, Calendar, Clock, MapPin, MessageSquare, ArrowRight, Share2, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BookingSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingRef = searchParams.get('ref') || '';
  const [booking, setBooking] = useState<ServiceBooking | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (bookingRef) {
      const found = mockStorage.getBookingByReference(bookingRef);
      if (found) {
        setBooking(found);
      }
    }
    // Launch celebratory confetti burst
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.5 }
    });
  }, [bookingRef]);

  const handleCopyRef = () => {
    if (booking) {
      navigator.clipboard.writeText(booking.bookingReference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!booking) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center', padding: '20px' }}>
        <h2>Loading confirmation...</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          Retrieving booking reference: {bookingRef}
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '640px', margin: '40px auto', padding: '0 20px 80px' }}>
      <div className="card" style={{ textAlign: 'center', padding: '36px 28px', background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, rgba(19, 27, 46, 0.95) 100%)' }}>
        
        {/* Animated Checkmark */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '2px solid #10B981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
        }}>
          <CheckCircle2 size={44} color="#10B981" />
        </div>

        <span className="badge badge-confirmed" style={{ marginBottom: '12px' }}>
          Payment Verified & Confirmed
        </span>

        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
          Booking Confirmed ✓
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
          Your appointment at <strong>{booking.businessName}</strong> has been secured.
        </p>

        {/* Reference Code Pill */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid var(--border-strong)',
          borderRadius: '12px',
          padding: '12px 20px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '28px'
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Booking Reference:</span>
          <strong style={{ fontSize: '1.2rem', letterSpacing: '0.05em', color: '#34D399' }}>
            {booking.bookingReference}
          </strong>
          <button
            onClick={handleCopyRef}
            title="Copy Reference"
            style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <Copy size={16} />
          </button>
          {copied && <span style={{ fontSize: '0.75rem', color: '#34D399' }}>Copied!</span>}
        </div>

        {/* Appointment Details Grid */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'left',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Service</span>
            <strong style={{ fontSize: '0.95rem' }}>{booking.serviceName}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Schedule</span>
            <strong style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={15} color="#10B981" /> {booking.date} at {booking.displayTime}
            </strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Total Amount Paid</span>
            <strong style={{ fontSize: '1.05rem', color: '#F8FAFC' }}>
              {booking.currency} {booking.amount.toLocaleString()}
            </strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Customer</span>
            <span style={{ fontSize: '0.92rem' }}>{booking.customerName} ({booking.customerPhone})</span>
          </div>
        </div>

        {/* Asynchronous Notification Notice */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '10px',
          padding: '12px 16px',
          fontSize: '0.85rem',
          color: '#A7F3D0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '28px',
          textAlign: 'left'
        }}>
          <MessageSquare size={20} color="#34D399" style={{ flexShrink: 0 }} />
          <div>
            A confirmation email and WhatsApp message have been sent asynchronously to your contact info.
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/customer/bookings" className="btn btn-primary" style={{ flex: 1, minWidth: '180px' }}>
            View in My Bookings <ArrowRight size={16} />
          </Link>
          <Link to={`/business/${booking.businessSlug}`} className="btn btn-secondary" style={{ flex: 1, minWidth: '180px' }}>
            Book Another Service
          </Link>
        </div>

      </div>
    </div>
  );
};
