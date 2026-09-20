import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { mockStorage } from '../../services/mockStorage';
import { ServiceBooking } from '../../types';
import { CheckCircle2, Calendar, Clock, MessageSquare, ArrowRight, Copy, Download, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BookingSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
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
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.55 }
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
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '20px' }}>
        <div className="animate-pulse" style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Retrieving booking confirmation…
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '660px', margin: '48px auto', padding: '0 20px 80px' }}>
      <div className="glass-card" style={{ textAlign: 'center', padding: '44px 32px', position: 'relative', overflow: 'hidden' }}>
        
        {/* Success Icon Badge */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'var(--brand-light)',
          border: '2px solid var(--brand-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 22px',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <CheckCircle2 size={48} color="var(--brand-primary)" />
        </div>

        <span className="badge badge-confirmed" style={{ marginBottom: '14px', fontSize: '0.78rem', padding: '5px 14px' }}>
          ✓ Verified & Confirmed
        </span>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '10px', letterSpacing: '-0.02em' }}>
          Booking Confirmed
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px' }}>
          Your appointment at <strong style={{ color: 'var(--text-main)' }}>{booking.businessName}</strong> is reserved and locked in our calendar.
        </p>

        {/* Reference Code Ticket Box */}
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px dashed var(--brand-primary)',
          borderRadius: '16px',
          padding: '14px 24px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontWeight: 600 }}>Reference Code:</span>
          <strong style={{ fontSize: '1.3rem', letterSpacing: '0.08em', color: 'var(--brand-primary)', fontFamily: 'Outfit, sans-serif' }}>
            {booking.bookingReference}
          </strong>
          <button
            onClick={handleCopyRef}
            title="Copy Reference Code"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
          >
            <Copy size={17} />
          </button>
          {copied && <span style={{ fontSize: '0.78rem', color: 'var(--brand-primary)', fontWeight: 700 }}>Copied!</span>}
        </div>

        {/* Details Grid */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '24px',
          textAlign: 'left',
          marginBottom: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Service Booked</span>
            <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{booking.serviceName}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Date & Time</span>
            <strong style={{ fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--brand-primary)' }}>
              <Calendar size={16} /> {booking.date} at {booking.displayTime}
            </strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Amount</span>
            <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>
              {booking.currency} {booking.amount.toLocaleString()}
            </strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Payment Method</span>
            {booking.paymentStatus === 'PAID' || searchParams.get('paid') === '1' ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 195, 247, 0.15)', color: '#00C3F7', padding: '4px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '0.82rem' }}>
                ✓ Paid in Full via Paystack
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', padding: '4px 10px', borderRadius: '6px', fontWeight: 700, fontSize: '0.82rem' }}>
                Pay on Arrival / In-Venue
              </span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Client Profile</span>
            <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>{booking.customerName} ({booking.customerPhone})</span>
          </div>
        </div>

        {/* Async Notifications Delivery Card */}
        <div style={{
          background: 'var(--brand-light)',
          border: '1px solid var(--brand-primary)',
          borderRadius: '14px',
          padding: '14px 18px',
          fontSize: '0.88rem',
          color: 'var(--text-main)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px',
          textAlign: 'left'
        }}>
          <MessageSquare size={22} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
          <div>
            A confirmation receipt, SMS reminder, and WhatsApp ticket have been dispatched asynchronously to your contact details.
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <Link to="/customer/bookings" className="btn btn-primary" style={{ flex: 1, minWidth: '190px', padding: '13px 20px' }}>
            My Bookings <ArrowRight size={16} />
          </Link>
          <Link to={`/business/${booking.businessSlug}`} className="btn btn-secondary" style={{ flex: 1, minWidth: '190px', padding: '13px 20px' }}>
            Book Another Service
          </Link>
        </div>

      </div>
    </div>
  );
};
