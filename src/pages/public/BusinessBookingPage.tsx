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
  ShieldCheck, Zap, CreditCard, ArrowRight, Tag,
  Calendar as CalendarIcon, CheckCircle2, User, Sparkles
} from 'lucide-react';

const BIZ_IMAGES: Record<string, string> = {
  'luxe-grooming': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=75',
  'serenity-wellness': 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1200&q=75',
  'apex-advisory': 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=1200&q=75',
};

export const BusinessBookingPage: React.FC = () => {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  const [business, setBusiness] = useState<BusinessTenant | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictSlots, setConflictSlots] = useState<TimeSlot[]>([]);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const slotAutoSelected = useRef(false);

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
  }, [businessSlug]);

  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.fullName);
      setCustomerEmail(currentUser.email);
      setCustomerPhone(currentUser.phone);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (!business || !selectedService) return;
    const slots = mockStorage.getAvailableSlots(business.id, selectedService.id, selectedDate);
    setAvailableSlots(slots);

    if (!slotAutoSelected.current) {
      const first = slots.find(s => s.isAvailable);
      if (first) {
        setSelectedSlot(first);
        slotAutoSelected.current = true;
      }
    }
  }, [business?.id, selectedService?.id, selectedDate]);

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

  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tmrw' : d.toLocaleDateString('en-US', { weekday: 'short' });
    return { dateStr, dayName, dayNum: d.getDate(), month: d.toLocaleDateString('en-US', { month: 'short' }) };
  });

  const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];
  const filteredServices = activeCategory === 'All' ? services : services.filter(s => s.category === activeCategory);

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
        confetti({ particleCount: 110, spread: 80, origin: { y: 0.55 } });
        navigate(`/business/${business.slug}/book/success?ref=${result.booking.bookingReference}`);
      }
    }, 180);
  };

  const businessAd = business ? INITIAL_ADS.find(a => a.businessId === business.id && a.placement === 'HERO_BANNER' && a.isActive) : null;

  if (!business) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
        <div className="animate-pulse" style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Loading business portal…
        </div>
      </div>
    );
  }

  const heroImage = BIZ_IMAGES[business.slug] || BIZ_IMAGES['luxe-grooming'];

  return (
    <div>
      {/* ── Hero Header ─────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: '290px', overflow: 'hidden' }}>
        <img
          src={heroImage}
          alt={business.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '32px', left: '32px', right: '32px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge" style={{
                background: 'var(--brand-light)', color: 'var(--brand-primary)',
                border: '1px solid var(--brand-primary)', backdropFilter: 'blur(6px)',
              }}>
                <ShieldCheck size={13} /> Verified Business
              </span>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
                {business.category}
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {business.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} style={{ color: 'var(--brand-primary)' }} /> {business.address}
              </span>
              <span style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} style={{ color: 'var(--brand-primary)' }} /> {business.phone}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#FBBF24', fontSize: '0.9rem', fontWeight: 800 }}>
                <Star size={15} fill="#FBBF24" /> {business.rating} <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>({business.reviewCount} reviews)</span>
              </span>
            </div>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-strong)', borderRadius: '14px',
            padding: '12px 20px', textAlign: 'center', boxShadow: 'var(--shadow-md)',
          }}>
            <div style={{ color: 'var(--brand-primary)', fontWeight: 800, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={16} fill="var(--brand-primary)" /> Instant Confirmation
            </div>
            <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>Automated slot locking</div>
          </div>
        </div>
      </div>

      {/* ── Promotion Banner ───────────────────────────────────────────── */}
      {businessAd && (
        <div style={{
          background: 'linear-gradient(135deg, var(--brand-light) 0%, transparent 100%)',
          borderBottom: '1px solid var(--brand-primary)',
          padding: '14px 32px',
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
            <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {businessAd.discountPercent}% OFF selected services
            </span>
          </div>
        </div>
      )}

      {/* ── Main Booking Layout ───────────────────────────────────────────── */}
      <div className="page-shell" style={{ paddingTop: '36px' }}>

        {/* 4-Step Progress Indicator */}
        <div className="step-indicator">
          <div className={`step-item ${selectedService ? 'completed' : 'active'}`}>
            <span className="step-number">{selectedService ? '✓' : '1'}</span> Select Service
          </div>
          <span style={{ color: 'var(--border-strong)' }}>→</span>
          <div className={`step-item ${selectedSlot ? 'completed' : selectedService ? 'active' : ''}`}>
            <span className="step-number">{selectedSlot ? '✓' : '2'}</span> Choose Date & Time
          </div>
          <span style={{ color: 'var(--border-strong)' }}>→</span>
          <div className={`step-item ${customerName ? 'completed' : selectedSlot ? 'active' : ''}`}>
            <span className="step-number">{customerName ? '✓' : '3'}</span> Customer Info
          </div>
          <span style={{ color: 'var(--border-strong)' }}>→</span>
          <div className={`step-item ${selectedService && selectedSlot ? 'active' : ''}`}>
            <span className="step-number">4</span> Confirm & Book
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'flex-start' }}>

          {/* ── LEFT: Service Selector ─────────────────────────────────── */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--brand-primary)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 900, flexShrink: 0 }}>1</span>
                Choose Service
              </h2>

              {/* Category Chips */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Service Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {filteredServices.map(srv => {
                  const isSel = selectedService?.id === srv.id;
                  return (
                    <button
                      key={srv.id}
                      onClick={() => handleSelectService(srv)}
                      className={`glass-card ${isSel ? 'glow-card' : ''}`}
                      style={{
                        cursor: 'pointer', textAlign: 'left', padding: '20px 22px',
                        borderColor: isSel ? 'var(--brand-primary)' : 'var(--border-subtle)',
                        background: isSel ? 'var(--brand-light)' : 'var(--bg-card)',
                        boxShadow: isSel ? 'var(--shadow-glow)' : 'none',
                        position: 'relative',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {srv.badge && (
                        <span style={{
                          position: 'absolute', top: '16px', right: '16px',
                          fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase',
                          letterSpacing: '0.06em', padding: '3px 10px', borderRadius: '99px',
                          background: 'var(--brand-light)', color: 'var(--brand-primary)',
                          border: '1px solid var(--brand-primary)',
                        }}>
                          {srv.badge}
                        </span>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', paddingRight: srv.badge ? '90px' : 0 }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: isSel ? 'var(--brand-primary)' : 'var(--text-main)' }}>
                          {srv.name}
                        </h3>
                        <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 900, flexShrink: 0, color: isSel ? 'var(--brand-primary)' : 'var(--text-main)' }}>
                          {srv.currency} {srv.price.toLocaleString()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '12px' }}>
                        {srv.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock size={13} /> {srv.durationMinutes} minutes
                        </span>
                        {isSel && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={15} /> Selected
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
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--brand-primary)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 900, flexShrink: 0 }}>2</span>
              Choose Date & Time
            </h2>

            {/* Date Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '22px' }}>
              {dateOptions.map(d => {
                const isDateSel = selectedDate === d.dateStr;
                return (
                  <button
                    key={d.dateStr}
                    onClick={() => handleSelectDate(d.dateStr)}
                    style={{
                      background: isDateSel ? 'var(--brand-primary)' : 'var(--bg-card)',
                      color: isDateSel ? '#fff' : 'var(--text-muted)',
                      border: `1px solid ${isDateSel ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                      borderRadius: '12px', padding: '12px 4px',
                      textAlign: 'center', cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      boxShadow: isDateSel ? 'var(--shadow-glow)' : 'none',
                    }}
                  >
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, opacity: isDateSel ? 0.95 : 0.65 }}>{d.dayName}</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, margin: '2px 0' }}>{d.dayNum}</div>
                    <div style={{ fontSize: '0.64rem', opacity: isDateSel ? 0.9 : 0.6 }}>{d.month}</div>
                  </button>
                );
              })}
            </div>

            {/* Time Slot Grid */}
            <div className="glass-card" style={{ marginBottom: '22px', padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} style={{ color: 'var(--brand-primary)' }} /> Available Slots
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)', fontWeight: 600 }}>
                  {availableSlots.filter(s => s.isAvailable).length} open slots
                </span>
              </div>

              {availableSlots.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No slots available on this date. Please select another day.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
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
                          borderRadius: '10px', padding: '12px 8px',
                          fontSize: '0.86rem', fontWeight: 700,
                          cursor: slot.isAvailable ? 'pointer' : 'not-allowed',
                          opacity: !slot.isAvailable ? 0.45 : 1,
                          transition: 'all 0.18s ease',
                          boxShadow: isSel ? 'var(--shadow-glow)' : 'none',
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
            <div className="glass-card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--brand-primary)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 900 }}>3</span>
                  Customer Information
                </span>
                {isAuthenticated && (
                  <span className="badge" style={{ background: 'var(--brand-light)', color: 'var(--brand-primary)', border: '1px solid var(--brand-primary)' }}>
                    Auto-Filled Profile
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label className="field-label">Full Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter your full name"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="field-label">Email Address</label>
                    <input type="email" className="input-field" placeholder="email@domain.com" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="field-label">Phone Number</label>
                    <input type="tel" className="input-field" placeholder="+1 234 567 890" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                  </div>
                </div>

                {/* Tokenized Payment Card View */}
                <div style={{
                  background: 'var(--brand-light)', border: '1px solid var(--brand-primary)',
                  borderRadius: '12px', padding: '12px 16px', marginTop: '6px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
                    <CreditCard size={18} style={{ color: 'var(--brand-primary)' }} />
                    <span>Mastercard <strong>•••• 4012</strong></span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--brand-primary)', fontWeight: 900, letterSpacing: '0.05em' }}>
                    1-TAP PAYMENT READY
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Confirm Bar ────────────────────────────────────────────── */}
      {selectedService && selectedSlot && (
        <div style={{
          position: 'fixed', bottom: '20px', left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 40px)', maxWidth: '840px',
          background: 'var(--bg-card)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--brand-primary)',
          borderRadius: '20px', padding: '16px 26px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.5), var(--shadow-glow)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap',
          zIndex: 800, animation: 'slideUp 0.22s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ fontWeight: 900, fontSize: '1.05rem', color: 'var(--text-main)' }}>{selectedService.name}</span>
              <span className="badge badge-confirmed" style={{ fontSize: '0.78rem' }}>{selectedSlot.displayTime}</span>
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              {selectedDate === todayStr ? 'Today' : selectedDate}
              &nbsp;·&nbsp;{selectedService.durationMinutes} min
              &nbsp;·&nbsp;<strong style={{ color: 'var(--brand-primary)', fontSize: '0.95rem' }}>{selectedService.currency} {selectedService.price.toLocaleString()}</strong>
            </div>
          </div>

          <button
            className="btn btn-fast-book"
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
            style={{ minWidth: '220px', fontSize: '0.96rem', padding: '14px 28px' }}
          >
            {isSubmitting ? (
              <span className="animate-pulse">Locking Slot & Confirming…</span>
            ) : (
              <><Zap size={18} fill="#fff" /> Complete Booking <ArrowRight size={16} /></>
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
