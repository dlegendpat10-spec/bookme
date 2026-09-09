import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockStorage } from '../../services/mockStorage';
import { useAuth } from '../../context/AuthContext';
import { Service, BusinessTenant, TimeSlot } from '../../types';
import { ConflictModal } from '../../components/shared/ConflictModal';
import { INITIAL_ADS } from '../../mock/initialData';
import confetti from 'canvas-confetti';
import {
  Check, Clock, MapPin, Phone, Star,
  ShieldCheck, Zap, CreditCard, ArrowRight, Tag
} from 'lucide-react';

// Unsplash images per business slug
const BIZ_IMAGES: Record<string, string> = {
  'luxe-grooming': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=75',
  'serenity-wellness': 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1200&q=75',
  'apex-advisory': 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=1200&q=75',
};

export const BusinessBookingPage: React.FC = () => {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  // ── Core state ──────────────────────────────────────────────────────────
  const [business, setBusiness] = useState<BusinessTenant | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');

  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictSlots, setConflictSlots] = useState<TimeSlot[]>([]);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Ref to prevent slot re-selection on every re-render
  const slotAutoSelected = useRef(false);

  // ── Load business + services once ───────────────────────────────────────
  useEffect(() => {
    const slug = businessSlug || 'luxe-grooming';
    const biz = mockStorage.getBusinessBySlug(slug) || mockStorage.getBusinesses()[0];
    if (biz) {
      setBusiness(biz);
      const srvs = mockStorage.getServices(biz.id).filter(s => s.isActive);
      setServices(srvs);
      if (srvs.length > 0) {
        setSelectedService(srvs[0]);
      }
    }
    // Only run when slug changes
  }, [businessSlug]);

  // ── Sync customer details when persona switches ──────────────────────────
  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.fullName);
      setCustomerEmail(currentUser.email);
      setCustomerPhone(currentUser.phone);
    }
  }, [currentUser?.id]); // Only re-run when actual user ID changes (not object reference)

  // ── Load availability slots (fixed: stable deps) ─────────────────────────
  useEffect(() => {
    if (!business || !selectedService) return;
    const slots = mockStorage.getAvailableSlots(business.id, selectedService.id, selectedDate);
    setAvailableSlots(slots);

    // Auto-select first available on service/date change, but not on every render
    if (!slotAutoSelected.current) {
      const first = slots.find(s => s.isAvailable);
      if (first) {
        setSelectedSlot(first);
        slotAutoSelected.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business?.id, selectedService?.id, selectedDate]);

  // Reset auto-select flag when service or date changes (so new date/service gets auto-pick)
  const handleSelectService = (srv: Service) => {
    setSelectedService(srv);
    setSelectedSlot(null);
    slotAutoSelected.current = false;
  };

  const handleSelectDate = (d: string) => {
    setSelectedDate(d);
    setSelectedSlot(null);
    slotAutoSelected.current = false;
  };

  // ── Date strip ───────────────────────────────────────────────────────────
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tmrw' : d.toLocaleDateString('en-US', { weekday: 'short' });
    return { dateStr, dayName, dayNum: d.getDate(), month: d.toLocaleDateString('en-US', { month: 'short' }) };
  });

  // ── Service categories ───────────────────────────────────────────────────
  const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];
  const filteredServices = activeCategory === 'All' ? services : services.filter(s => s.category === activeCategory);

  // ── Booking submission ───────────────────────────────────────────────────
  const handleConfirmBooking = () => {
    if (!business || !selectedService || !selectedSlot) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const result = mockStorage.createBooking({
        businessId: business.id,
        serviceId: selectedService.id,
        date: selectedDate,
        time: selectedSlot.time,
        displayTime: selectedSlot.displayTime,
        customerName: customerName || 'Alex Morgan',
        customerEmail: customerEmail || 'alex.morgan@example.com',
        customerPhone: customerPhone || '+234 809 111 2233',
        customerNotes: notes,
        paymentMethod: 'Mastercard •••• 4012 (Tokenized)',
      });

      setIsSubmitting(false);

      if (!result.success && result.code === 'CONFLICT_409') {
        const refreshed = mockStorage.getAvailableSlots(business.id, selectedService.id, selectedDate);
        setAvailableSlots(refreshed);
        setConflictSlots(refreshed.filter(s => s.isAvailable));
        setShowConflictModal(true);
        setSelectedSlot(null);
        return;
      }

      if (result.success && result.booking) {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        navigate(`/business/${business.slug}/book/success?ref=${result.booking.bookingReference}`);
      }
    }, 180);
  };

  // ── Ad for this business ─────────────────────────────────────────────────
  const businessAd = business ? INITIAL_ADS.find(a => a.businessId === business.id && a.placement === 'HERO_BANNER' && a.isActive) : null;

  if (!business) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
        <div className="animate-pulse" style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Loading business profile…
        </div>
      </div>
    );
  }

  const heroImage = BIZ_IMAGES[business.slug] || BIZ_IMAGES['luxe-grooming'];

  return (
    <div>
      {/* ── Hero Banner with Business Photo ──────────────────────────────── */}
      <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
        <img
          src={heroImage}
          alt={business.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.75) 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '28px', left: '28px', right: '28px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge" style={{
                background: 'rgba(16,185,129,0.2)', color: '#34D399',
                border: '1px solid rgba(16,185,129,0.4)', backdropFilter: 'blur(4px)',
              }}>
                <ShieldCheck size={12} /> Verified
              </span>
              <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>{business.category}</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', lineHeight: 1.15 }}>{business.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={13} style={{ color: '#34D399' }} /> {business.address}
              </span>
              <span style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Phone size={13} style={{ color: '#34D399' }} /> {business.phone}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FBBF24', fontSize: '0.88rem', fontWeight: 700 }}>
                <Star size={14} fill="#FBBF24" /> {business.rating} <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>({business.reviewCount} reviews)</span>
              </span>
            </div>
          </div>

          <div style={{
            background: 'rgba(16,185,129,0.15)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(16,185,129,0.35)', borderRadius: '12px',
            padding: '10px 18px', textAlign: 'center',
          }}>
            <div style={{ color: '#34D399', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Zap size={15} fill="#34D399" /> Fast Booking
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>Book in &lt; 5 seconds</div>
          </div>
        </div>
      </div>

      {/* ── Ad Promotion Banner ───────────────────────────────────────────── */}
      {businessAd && (
        <div style={{
          background: 'linear-gradient(135deg, var(--brand-light) 0%, transparent 100%)',
          borderBottom: '1px solid var(--brand-primary)',
          padding: '14px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '16px', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Tag size={18} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brand-primary)' }}>
                {businessAd.badgeText}
              </span>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '1px' }}>{businessAd.headline}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {businessAd.discountCode && (
              <div style={{
                background: 'var(--bg-app)', border: '1px dashed var(--brand-primary)',
                borderRadius: '7px', padding: '5px 12px', fontSize: '0.9rem',
                fontWeight: 800, color: 'var(--brand-primary)', letterSpacing: '0.05em',
              }}>
                {businessAd.discountCode}
              </div>
            )}
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {businessAd.discountPercent}% OFF selected services
            </span>
          </div>
        </div>
      )}

      {/* ── Main Booking Layout ───────────────────────────────────────────── */}
      <div className="page-shell" style={{ paddingTop: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'flex-start' }}>

          {/* ── LEFT: Service Selector ─────────────────────────────────── */}
          <div>
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--brand-primary)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900, flexShrink: 0 }}>1</span>
                Select a Service
              </h2>

              {/* Category Chips */}
              <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      background: activeCategory === cat ? 'var(--brand-primary)' : 'var(--bg-elevated)',
                      color: activeCategory === cat ? '#fff' : 'var(--text-muted)',
                      border: `1px solid ${activeCategory === cat ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                      padding: '5px 14px', borderRadius: '99px',
                      fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Service Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredServices.map(srv => {
                  const isSel = selectedService?.id === srv.id;
                  return (
                    <button
                      key={srv.id}
                      onClick={() => handleSelectService(srv)}
                      className="card"
                      style={{
                        cursor: 'pointer', textAlign: 'left', padding: '18px 20px',
                        borderColor: isSel ? 'var(--brand-primary)' : 'var(--border-subtle)',
                        background: isSel ? 'var(--brand-light)' : 'var(--bg-card)',
                        boxShadow: isSel ? 'var(--shadow-glow)' : 'none',
                        position: 'relative',
                        transition: 'all 0.18s',
                      }}
                    >
                      {srv.badge && (
                        <span style={{
                          position: 'absolute', top: '14px', right: '14px',
                          fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase',
                          letterSpacing: '0.06em', padding: '3px 9px', borderRadius: '99px',
                          background: 'var(--brand-light)', color: 'var(--brand-primary)',
                          border: '1px solid var(--brand-primary)',
                        }}>
                          {srv.badge}
                        </span>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px', paddingRight: srv.badge ? '90px' : 0 }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: isSel ? 'var(--brand-primary)' : 'var(--text-main)' }}>
                          {srv.name}
                        </h3>
                        <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: 800, flexShrink: 0 }}>
                          {srv.currency} {srv.price.toLocaleString()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '10px' }}>
                        {srv.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {srv.durationMinutes} min
                        </span>
                        {isSel && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--brand-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Check size={13} /> Selected
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Date + Time + Customer Info ────────────────────── */}
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--brand-primary)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900, flexShrink: 0 }}>2</span>
              Choose Date & Time
            </h2>

            {/* Date Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '20px' }}>
              {dateOptions.map(d => {
                const isDateSel = selectedDate === d.dateStr;
                return (
                  <button
                    key={d.dateStr}
                    onClick={() => handleSelectDate(d.dateStr)}
                    style={{
                      background: isDateSel ? 'var(--brand-primary)' : 'var(--bg-elevated)',
                      color: isDateSel ? '#fff' : 'var(--text-muted)',
                      border: `1px solid ${isDateSel ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                      borderRadius: '10px', padding: '10px 4px',
                      textAlign: 'center', cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize: '0.66rem', fontWeight: 600, opacity: isDateSel ? 0.9 : 0.65 }}>{d.dayName}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, margin: '2px 0' }}>{d.dayNum}</div>
                    <div style={{ fontSize: '0.62rem', opacity: isDateSel ? 0.85 : 0.55 }}>{d.month}</div>
                  </button>
                );
              })}
            </div>

            {/* Time Slot Grid */}
            <div className="card" style={{ marginBottom: '20px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} style={{ color: 'var(--brand-primary)' }} /> Available Slots
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)', fontWeight: 600 }}>
                  {availableSlots.filter(s => s.isAvailable).length} open
                </span>
              </div>

              {availableSlots.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '28px 12px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  No slots available. Try another date.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {availableSlots.map(slot => {
                    const isSel = selectedSlot?.time === slot.time;
                    return (
                      <button
                        key={slot.time}
                        disabled={!slot.isAvailable}
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          background: !slot.isAvailable ? 'transparent' : isSel ? 'var(--brand-primary)' : 'var(--bg-elevated)',
                          color: !slot.isAvailable ? 'var(--text-faint)' : isSel ? '#fff' : 'var(--text-main)',
                          border: `1px solid ${!slot.isAvailable ? 'var(--border-subtle)' : isSel ? 'var(--brand-primary)' : 'var(--border-strong)'}`,
                          textDecoration: !slot.isAvailable ? 'line-through' : 'none',
                          borderRadius: '8px', padding: '10px 6px',
                          fontSize: '0.84rem', fontWeight: 600,
                          cursor: slot.isAvailable ? 'pointer' : 'not-allowed',
                          opacity: !slot.isAvailable ? 0.45 : 1,
                          transition: 'all 0.15s',
                        }}
                      >
                        {slot.displayTime}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Customer Details */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--brand-primary)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900 }}>3</span>
                  Your Details
                </span>
                {isAuthenticated && (
                  <span className="badge" style={{ background: 'rgba(59,130,246,0.12)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.25)' }}>
                    Auto-filled
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Full Name"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input type="email" className="input-field" placeholder="Email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />
                  <input type="tel" className="input-field" placeholder="Phone" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                </div>

                {/* Saved card display */}
                <div style={{
                  background: 'var(--brand-light)', border: '1px solid var(--brand-primary)',
                  borderRadius: '8px', padding: '10px 14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                    <CreditCard size={16} style={{ color: 'var(--brand-primary)' }} />
                    <span>Mastercard <strong>•••• 4012</strong></span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--brand-primary)', fontWeight: 700 }}>1-TAP READY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Confirm Bar ────────────────────────────────────────────── */}
      {selectedService && selectedSlot && (
        <div style={{
          position: 'fixed', bottom: '16px', left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 40px)', maxWidth: '820px',
          background: 'var(--bg-card)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--brand-primary)',
          borderRadius: '16px', padding: '14px 22px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.5), var(--shadow-glow)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap',
          zIndex: 800, animation: 'slideUp 0.2s ease-out',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3px' }}>
              <span style={{ fontWeight: 800, fontSize: '1rem' }}>{selectedService.name}</span>
              <span className="badge badge-confirmed">{selectedSlot.displayTime}</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {selectedDate === todayStr ? 'Today' : selectedDate}
              &nbsp;·&nbsp;{selectedService.durationMinutes} min
              &nbsp;·&nbsp;<strong style={{ color: 'var(--text-main)' }}>{selectedService.currency} {selectedService.price.toLocaleString()}</strong>
            </div>
          </div>

          <button
            className="btn btn-fast-book"
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
            style={{ minWidth: '200px', fontSize: '0.92rem' }}
          >
            {isSubmitting ? (
              <span className="animate-pulse">Confirming…</span>
            ) : (
              <><Zap size={17} fill="#fff" /> Confirm Booking <ArrowRight size={15} /></>
            )}
          </button>
        </div>
      )}

      {/* ── Conflict Modal ────────────────────────────────────────────────── */}
      {showConflictModal && (
        <ConflictModal
          alternativeSlots={conflictSlots}
          onSelectAlternative={slot => { setSelectedSlot(slot); setShowConflictModal(false); }}
          onClose={() => setShowConflictModal(false)}
        />
      )}
    </div>
  );
};
