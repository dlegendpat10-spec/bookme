import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { mockStorage } from '../../services/mockStorage';
import { useAuth } from '../../context/AuthContext';
import { Service, BusinessTenant, TimeSlot } from '../../types';
import { ConflictModal } from '../../components/shared/ConflictModal';
import confetti from 'canvas-confetti';
import {
  Clock, MapPin, Phone, ShieldCheck, ArrowRight,
  CheckCircle2, User, Calendar as CalendarIcon,
  Sparkles, Mail, MessageSquare
} from 'lucide-react';

export const BusinessBookingPage: React.FC = () => {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const [searchParams] = useSearchParams();
  const preselectedServiceId = searchParams.get('service');
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
  const [notFound, setNotFound] = useState(false);

  const slotAutoSelected = useRef(false);

  // Load business & ONLY its services
  useEffect(() => {
    async function loadBusinessAndServices() {
      if (!businessSlug) {
        setNotFound(true);
        return;
      }

      // 1. Locate business
      let biz = mockStorage.getBusinessBySlug(businessSlug);
      if (!biz) {
        const allBiz = mockStorage.getBusinesses();
        biz = allBiz.find(b => b.slug.toLowerCase() === businessSlug.toLowerCase());
      }

      if (!biz) {
        setNotFound(true);
        return;
      }

      setBusiness(biz);
      setNotFound(false);

      // 2. Fetch services specifically for this business
      const remote = await mockStorage.fetchRemoteServices(businessSlug);
      const local = mockStorage.getServices(biz.id);

      const map = new Map<string, Service>();
      local.forEach(s => {
        if (s.businessId === biz!.id && s.isActive) map.set(s.id, s);
      });
      remote.forEach(s => {
        if ((s.businessId === biz!.id || s.businessSlug === businessSlug) && s.isActive) {
          map.set(s.id, s);
        }
      });

      const bizServices = Array.from(map.values());
      setServices(bizServices);

      // Preselect service if query param matches, or pick first
      if (preselectedServiceId) {
        const matched = bizServices.find(s => s.id === preselectedServiceId);
        if (matched) setSelectedService(matched);
        else if (bizServices.length > 0) setSelectedService(bizServices[0]);
      } else if (bizServices.length > 0) {
        setSelectedService(bizServices[0]);
      }
    }

    loadBusinessAndServices();
  }, [businessSlug, preselectedServiceId]);

  // Autofill if logged in
  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.fullName);
      if (!customerEmail) setCustomerEmail(currentUser.email);
      if (!customerPhone) setCustomerPhone((currentUser as any).phone || '');
    }
  }, [currentUser?.id]);

  // Available slots for selected service & date
  useEffect(() => {
    if (!business || !selectedService) return;
    const slots = mockStorage.getAvailableSlots(business.id, selectedService.id, selectedDate);
    setAvailableSlots(slots);

    if (!slotAutoSelected.current) {
      const firstAvailable = slots.find(s => s.isAvailable);
      if (firstAvailable) {
        setSelectedSlot(firstAvailable);
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

  const handleConfirmBooking = () => {
    if (!business || !selectedService || !selectedSlot) return;

    if (!customerName.trim()) {
      alert('Please enter your name to complete the appointment.');
      return;
    }
    if (!customerEmail.trim()) {
      alert('Please enter your email so we can send your appointment confirmation.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = mockStorage.createBooking({
        businessId: business.id,
        serviceId: selectedService.id,
        date: selectedDate,
        time: selectedSlot.time,
        displayTime: selectedSlot.displayTime,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        customerNotes: notes.trim(),
        paymentMethod: 'Pay on Arrival / Appointment',
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
    }, 200);
  };

  if (notFound) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="card" style={{ maxWidth: '460px', width: '100%', textAlign: 'center', padding: '36px 28px', borderRadius: '16px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'var(--brand-light)', color: 'var(--brand-primary)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px', fontSize: '1.4rem', fontWeight: 800
          }}>
            !
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '8px' }}>Business Portal Not Found</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '24px' }}>
            We couldn't locate a booking portal for <strong>"{businessSlug}"</strong>. Please verify the URL provided by the business.
          </p>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/services')}>
            Explore Other Services
          </button>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '45vh' }}>
        <div className="animate-pulse" style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 600 }}>
          Loading business details…
        </div>
      </div>
    );
  }

  const initials = (business.name ? business.name.slice(0, 2).toUpperCase() : 'BM');

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '28px 20px 90px' }}>
      
      {/* ── Friendly Business Welcome Banner ────────────────────────────── */}
      <div className="glass-card glow-card" style={{
        padding: '28px',
        borderRadius: '20px',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-elevated) 100%)',
        border: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {/* Logo / Initials Avatar */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-hover) 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            fontWeight: 900,
            fontFamily: 'Outfit, sans-serif',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            flexShrink: 0,
          }}>
            {initials}
          </div>

          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge" style={{
                background: 'var(--brand-light)',
                color: 'var(--brand-primary)',
                border: '1px solid var(--brand-primary)',
                fontSize: '0.74rem',
                fontWeight: 700,
                padding: '2px 8px'
              }}>
                <ShieldCheck size={13} /> Verified Business
              </span>
              {business.category && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {business.category}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.9rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '6px' }}>
              {business.name}
            </h1>

            {business.description && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '8px', maxWidth: '640px' }}>
                {business.description}
              </p>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-faint)' }}>
              {business.address && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={14} color="var(--brand-primary)" /> {business.address}
                </span>
              )}
              {business.phone && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Phone size={14} color="var(--brand-primary)" /> {business.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main 3-Step Booking Wizard ───────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* STEP 1: Choose Service */}
        <section className="glass-card" style={{ padding: '26px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <span style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: selectedService ? 'var(--brand-primary)' : 'var(--bg-elevated)',
              color: selectedService ? '#fff' : 'var(--text-muted)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: '0.85rem'
            }}>
              {selectedService ? '✓' : '1'}
            </span>
            <h2 style={{ fontSize: '1.18rem', fontWeight: 800 }}>
              1. Select a Service
            </h2>
          </div>

          {services.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.94rem', marginBottom: '8px' }}>
                {business.name} has not published any bookable services yet.
              </p>
              {business.phone && (
                <p style={{ fontSize: '0.86rem', color: 'var(--text-faint)' }}>
                  Feel free to contact them directly at <strong>{business.phone}</strong>.
                </p>
              )}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '14px'
            }}>
              {services.map(srv => {
                const isSelected = selectedService?.id === srv.id;
                return (
                  <button
                    key={srv.id}
                    onClick={() => handleSelectService(srv)}
                    type="button"
                    style={{
                      cursor: 'pointer',
                      textAlign: 'left',
                      padding: '18px 20px',
                      borderRadius: '14px',
                      border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'var(--brand-light)' : 'var(--bg-card)',
                      boxShadow: isSelected ? 'var(--shadow-glow)' : 'none',
                      transition: 'all 0.18s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                        <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: isSelected ? 'var(--brand-primary)' : 'var(--text-main)' }}>
                          {srv.name}
                        </h3>
                        <span style={{
                          fontFamily: 'Outfit, sans-serif',
                          fontWeight: 800,
                          fontSize: '1.15rem',
                          color: isSelected ? 'var(--brand-primary)' : 'var(--text-main)',
                          flexShrink: 0
                        }}>
                          {srv.currency || 'NGN'} {Number(srv.price).toLocaleString()}
                        </span>
                      </div>
                      {srv.description && (
                        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                          {srv.description}
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-faint)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} /> {srv.durationMinutes} mins
                      </span>
                      {isSelected ? (
                        <span style={{ color: 'var(--brand-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={15} /> Selected
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Tap to select</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* STEP 2: Choose Date & Time */}
        {selectedService && (
          <section className="glass-card" style={{ padding: '26px', borderRadius: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <span style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: selectedSlot ? 'var(--brand-primary)' : 'var(--bg-elevated)',
                color: selectedSlot ? '#fff' : 'var(--text-muted)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '0.85rem'
              }}>
                {selectedSlot ? '✓' : '2'}
              </span>
              <h2 style={{ fontSize: '1.18rem', fontWeight: 800 }}>
                2. Pick Date & Time
              </h2>
            </div>

            {/* Date selection strip */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px' }}>
                Select a day:
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(68px, 1fr))',
                gap: '8px',
              }}>
                {dateOptions.map(d => {
                  const isSel = selectedDate === d.dateStr;
                  return (
                    <button
                      key={d.dateStr}
                      type="button"
                      onClick={() => handleSelectDate(d.dateStr)}
                      style={{
                        padding: '12px 6px',
                        borderRadius: '12px',
                        border: isSel ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                        background: isSel ? 'var(--brand-primary)' : 'var(--bg-card)',
                        color: isSel ? '#FFFFFF' : 'var(--text-main)',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.16s ease',
                      }}
                    >
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, opacity: isSel ? 0.95 : 0.65 }}>{d.dayName}</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, margin: '2px 0' }}>{d.dayNum}</div>
                      <div style={{ fontSize: '0.68rem', opacity: isSel ? 0.9 : 0.6 }}>{d.month}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px' }}>
                Select an open time slot:
              </div>

              {availableSlots.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No available time slots on this day. Please pick another date above.
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                  gap: '10px'
                }}>
                  {availableSlots.map(slot => {
                    const isSlotSelected = selectedSlot?.time === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.isAvailable}
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          padding: '12px 10px',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          cursor: slot.isAvailable ? 'pointer' : 'not-allowed',
                          border: !slot.isAvailable
                            ? '1px solid var(--border-subtle)'
                            : isSlotSelected
                              ? '2px solid var(--brand-primary)'
                              : '1px solid var(--border-subtle)',
                          background: !slot.isAvailable
                            ? 'transparent'
                            : isSlotSelected
                              ? 'var(--brand-primary)'
                              : 'var(--bg-elevated)',
                          color: !slot.isAvailable
                            ? 'var(--text-faint)'
                            : isSlotSelected
                              ? '#FFFFFF'
                              : 'var(--text-main)',
                          opacity: !slot.isAvailable ? 0.4 : 1,
                          textDecoration: !slot.isAvailable ? 'line-through' : 'none',
                          transition: 'all 0.16s ease',
                        }}
                      >
                        {slot.displayTime}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* STEP 3: Simple Contact Details & Confirmation */}
        {selectedService && selectedSlot && (
          <section className="glass-card glow-card" style={{ padding: '26px', borderRadius: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <span style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'var(--brand-primary)',
                color: '#fff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '0.85rem'
              }}>
                3
              </span>
              <h2 style={{ fontSize: '1.18rem', fontWeight: 800 }}>
                3. Your Information
              </h2>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '18px' }}>
              We'll send your booking confirmation and reminders to these contact details.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '560px' }}>
              <div>
                <label className="field-label" style={{ marginBottom: '6px', display: 'block', fontSize: '0.84rem', fontWeight: 600 }}>
                  Your Full Name *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Samuel Adeleke"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  style={{ height: '44px', borderRadius: '10px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="field-label" style={{ marginBottom: '6px', display: 'block', fontSize: '0.84rem', fontWeight: 600 }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="you@domain.com"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    style={{ height: '44px', borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <label className="field-label" style={{ marginBottom: '6px', display: 'block', fontSize: '0.84rem', fontWeight: 600 }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="+234 800 000 0000"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    style={{ height: '44px', borderRadius: '10px' }}
                  />
                </div>
              </div>

              <div>
                <label className="field-label" style={{ marginBottom: '6px', display: 'block', fontSize: '0.84rem', fontWeight: 600 }}>
                  Special Request or Note (Optional)
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Any preference or note for the provider"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  style={{ height: '44px', borderRadius: '10px' }}
                />
              </div>

              {/* Gentle Payment Reassurance Notice */}
              <div style={{
                background: 'var(--brand-light)',
                border: '1px solid var(--brand-primary)',
                borderRadius: '12px',
                padding: '14px 16px',
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.86rem',
                color: 'var(--text-main)',
              }}>
                <CheckCircle2 size={18} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                <span>
                  <strong>No online charge today.</strong> You can pay with card or cash when you arrive for your appointment ({selectedService.currency} {Number(selectedService.price).toLocaleString()}).
                </span>
              </div>

              {/* Confirm Action Button */}
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                style={{
                  padding: '14px 24px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  borderRadius: '12px',
                  marginTop: '8px',
                  justifyContent: 'center',
                }}
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Confirming your appointment…</span>
                ) : (
                  <>Confirm Appointment with {business.name} <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          </section>
        )}

      </div>

      {/* Conflict Modal if slot was concurrently taken */}
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
