import React, { useState, useEffect } from 'react';
import { mockStorage } from '../../services/mockStorage';
import { useAuth } from '../../context/AuthContext';
import { AdCampaign, Service } from '../../types';
import {
  Megaphone, Plus, Sparkles, Tag, Eye, MousePointerClick,
  Percent, Trash2, Edit2, CheckCircle2, Image as ImageIcon,
  ArrowRight, ToggleLeft, ToggleRight, AlertCircle, X, ExternalLink
} from 'lucide-react';

const PRESET_AD_IMAGES = [
  { label: 'Executive Advisory', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Luxury Spa & Stone', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80' },
  { label: 'Athletic Gym & Power', url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Studio Photography', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80' },
  { label: 'Cloud & Tech Systems', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80' },
  { label: 'Dental Aesthetic Care', url: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=800&q=80' },
];

export const AdCampaigns: React.FC = () => {
  const { currentUser } = useAuth();
  const business = mockStorage.getActiveBusiness(currentUser?.businessId, currentUser?.businessSlug);

  const [ads, setAds] = useState<AdCampaign[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAd, setEditingAd] = useState<AdCampaign | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [badgeText, setBadgeText] = useState('SPECIAL OFFER');
  const [ctaText, setCtaText] = useState('Claim Offer & Book');
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number | ''>(15);
  const [imageUrl, setImageUrl] = useState('');
  const [placement, setPlacement] = useState<'HERO_BANNER' | 'TOP_MARQUEE' | 'POPUP_CARD'>('HERO_BANNER');
  const [targetServiceId, setTargetServiceId] = useState('');
  const [isActive, setIsActive] = useState(true);

  const refreshAds = () => {
    if (business) {
      const bAds = mockStorage.getAds(business.id);
      setAds(bAds);
      const bServices = mockStorage.getServices(business.id);
      setServices(bServices);
    }
  };

  useEffect(() => {
    refreshAds();
  }, [business?.id]);

  const handleOpenAdd = () => {
    setEditingAd(null);
    setTitle('');
    setHeadline('Exclusive Deal: Book Your Session Today');
    setDescription('Enjoy personalized service, premium attention, and special discounts.');
    setBadgeText('LIMITED TIME OFFER');
    setCtaText('Claim Offer & Book');
    setDiscountCode('PROMO' + Math.floor(10 + Math.random() * 90));
    setDiscountPercent(20);
    setImageUrl(PRESET_AD_IMAGES[0].url);
    setPlacement('HERO_BANNER');
    setTargetServiceId(services[0]?.id || '');
    setIsActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (ad: AdCampaign) => {
    setEditingAd(ad);
    setTitle(ad.title);
    setHeadline(ad.headline);
    setDescription(ad.description);
    setBadgeText(ad.badgeText);
    setCtaText(ad.ctaText);
    setDiscountCode(ad.discountCode || '');
    setDiscountPercent(ad.discountPercent ?? '');
    setImageUrl(ad.imageUrl || '');
    setPlacement(ad.placement);
    setTargetServiceId(ad.targetServiceId || '');
    setIsActive(ad.isActive);
    setShowModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    const savedAd: AdCampaign = {
      id: editingAd ? editingAd.id : 'ad-' + Date.now(),
      businessId: business.id,
      title: title.trim() || 'Promotional Campaign',
      headline: headline.trim(),
      description: description.trim(),
      badgeText: badgeText.trim().toUpperCase() || 'OFFER',
      ctaText: ctaText.trim() || 'Book Now',
      discountCode: discountCode.trim().toUpperCase() || undefined,
      discountPercent: discountPercent ? Number(discountPercent) : undefined,
      imageUrl: imageUrl.trim() || undefined,
      placement,
      targetServiceId: targetServiceId || undefined,
      isActive,
      impressions: editingAd ? editingAd.impressions : 0,
      clicks: editingAd ? editingAd.clicks : 0,
      bookingsCount: editingAd ? editingAd.bookingsCount : 0,
      createdAt: editingAd ? editingAd.createdAt : new Date().toISOString()
    };

    mockStorage.saveAd(savedAd);
    setShowModal(false);
    refreshAds();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this personalized ad?')) {
      mockStorage.deleteAd(id);
      refreshAds();
    }
  };

  const handleToggleActive = (ad: AdCampaign) => {
    const updated = { ...ad, isActive: !ad.isActive };
    mockStorage.saveAd(updated);
    refreshAds();
  };

  const totalImpressions = ads.reduce((acc, a) => acc + (a.impressions || 0), 0);
  const totalClicks = ads.reduce((acc, a) => acc + (a.clicks || 0), 0);
  const totalBookings = ads.reduce((acc, a) => acc + (a.bookingsCount || 0), 0);
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0.0';

  return (
    <div style={{ padding: '32px 24px 80px', maxWidth: '1140px', margin: '0 auto' }}>
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '6px' }}>
            <Megaphone size={15} /> Marketing & Campaigns
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '6px' }}>
            Personalized Ads & Promotions
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem' }}>
            Create customized ads, banner specials, and flash sales to display on your booking page and the platform directory.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px' }}
        >
          <Plus size={18} /> Create New Ad
        </button>
      </div>

      {/* ── Metric Highlights ───────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>Active Campaigns</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--brand-primary)' }}>
            {ads.filter(a => a.isActive).length} <span style={{ fontSize: '0.9rem', color: 'var(--text-faint)', fontWeight: 500 }}>/ {ads.length} total</span>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>Total Ad Impressions</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>
            {totalImpressions.toLocaleString()}
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>Clicks (CTR)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>
            {totalClicks.toLocaleString()} <span style={{ fontSize: '0.9rem', color: '#10B981', fontWeight: 700 }}>({ctr}%)</span>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>Ad-Driven Bookings</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F59E0B' }}>
            {totalBookings}
          </div>
        </div>
      </div>

      {/* ── Campaigns Grid ──────────────────────────────────────────── */}
      {ads.length === 0 ? (
        <div className="glass-card" style={{
          textAlign: 'center',
          padding: '60px 24px',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--brand-light)',
            color: 'var(--brand-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Megaphone size={28} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>No Ads Created Yet</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 24px', fontSize: '0.95rem' }}>
            Boost your appointment bookings with personalized discount banners, season specials, and targeted service deals.
          </p>
          <button onClick={handleOpenAdd} className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '12px' }}>
            <Plus size={16} /> Create Your First Ad
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {ads.map(ad => {
            const targetSrv = services.find(s => s.id === ad.targetServiceId);

            return (
              <div
                key={ad.id}
                className="glass-card"
                style={{
                  borderRadius: '20px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-card)',
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateColumns: ad.imageUrl ? '240px 1fr auto' : '1fr auto',
                  gap: '24px',
                  alignItems: 'center',
                  padding: '24px',
                  opacity: ad.isActive ? 1 : 0.65,
                  transition: 'opacity 0.2s ease',
                }}
              >
                {/* Ad Image / Creative */}
                {ad.imageUrl && (
                  <div style={{
                    width: '100%',
                    height: '140px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    position: 'relative',
                    background: 'var(--bg-elevated)'
                  }}>
                    <img
                      src={ad.imageUrl}
                      alt={ad.headline}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      letterSpacing: '0.04em',
                    }}>
                      {ad.placement.replace('_', ' ')}
                    </div>
                  </div>
                )}

                {/* Ad Text & Offer Details */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      background: 'var(--brand-light)',
                      color: 'var(--brand-primary)',
                      border: '1px solid var(--brand-primary)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '6px',
                    }}>
                      {ad.badgeText}
                    </span>
                    {ad.discountPercent && (
                      <span style={{
                        background: '#DC262622',
                        color: '#EF4444',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}>
                        {ad.discountPercent}% OFF
                      </span>
                    )}
                    {ad.discountCode && (
                      <span style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        padding: '2px 8px',
                        background: 'var(--bg-elevated)',
                        borderRadius: '6px',
                        color: 'var(--text-main)',
                        border: '1px dashed var(--border-subtle)',
                      }}>
                        CODE: {ad.discountCode}
                      </span>
                    )}
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-faint)' }}>
                      • {ad.placement.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px', lineHeight: 1.3 }}>
                    {ad.headline}
                  </h3>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '12px' }}>
                    {ad.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--text-faint)', flexWrap: 'wrap' }}>
                    {targetSrv && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--brand-primary)', fontWeight: 600 }}>
                        <Tag size={13} /> Linked Service: {targetSrv.name}
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={13} /> {ad.impressions || 0} views
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MousePointerClick size={13} /> {ad.clicks || 0} clicks
                    </span>
                  </div>
                </div>

                {/* Actions & Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                  <button
                    onClick={() => handleToggleActive(ad)}
                    className="btn btn-ghost"
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      gap: '6px',
                      color: ad.isActive ? '#10B981' : 'var(--text-faint)'
                    }}
                  >
                    {ad.isActive ? <ToggleRight size={22} color="#10B981" /> : <ToggleLeft size={22} />}
                    {ad.isActive ? 'Active' : 'Paused'}
                  </button>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenEdit(ad)}
                      className="btn btn-secondary"
                      style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '0.82rem' }}
                      title="Edit Ad"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ad.id)}
                      className="btn btn-ghost"
                      style={{ padding: '8px 10px', borderRadius: '8px', color: '#EF4444' }}
                      title="Delete Ad"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit Modal ────────────────────────────────────────── */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: '24px',
            padding: '32px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900 }}>
                {editingAd ? 'Edit Personalized Ad' : 'Create Personalized Ad'}
              </h2>
              <button onClick={() => setShowModal(false)} className="btn btn-ghost" style={{ padding: '6px' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Campaign Title & Badge */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    Campaign Title (Internal Reference)
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. Summer Weekend Flash Sale"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 20% OFF"
                    value={badgeText}
                    onChange={e => setBadgeText(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px' }}
                  />
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Headline (Promotional Hook)
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. Get 20% Off Your First Session This Week"
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px' }}
                />
              </div>

              {/* Description */}
              <div>
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Offer Description
                </label>
                <textarea
                  required
                  rows={2}
                  className="input-field"
                  placeholder="Explain why clients should book this limited offer now…"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', resize: 'vertical' }}
                />
              </div>

              {/* Discount Code & % */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    Promo Code (Optional)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. RELAX20"
                    value={discountCode}
                    onChange={e => setDiscountCode(e.target.value.toUpperCase())}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', textTransform: 'uppercase' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="input-field"
                    placeholder="e.g. 20"
                    value={discountPercent}
                    onChange={e => setDiscountPercent(e.target.value ? Number(e.target.value) : '')}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px' }}
                  />
                </div>
              </div>

              {/* Placement & Target Service */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    Ad Placement
                  </label>
                  <select
                    className="input-field"
                    value={placement}
                    onChange={e => setPlacement(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px' }}
                  >
                    <option value="HERO_BANNER">Hero Banner (Top of Booking Page)</option>
                    <option value="TOP_MARQUEE">Top Marquee (High Visibility Bar)</option>
                    <option value="POPUP_CARD">Promotional Card / Spotlight</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    Link to Specific Service
                  </label>
                  <select
                    className="input-field"
                    value={targetServiceId}
                    onChange={e => setTargetServiceId(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px' }}
                  >
                    <option value="">All Services (General Promo)</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (₦{s.price.toLocaleString()})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CTA Button Text */}
              <div>
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Call-to-Action (CTA) Button Text
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Claim 20% Off & Book"
                  value={ctaText}
                  onChange={e => setCtaText(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px' }}
                />
              </div>

              {/* Ad Banner Picture */}
              <div>
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Ad Creative / Banner Picture
                </label>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Paste image URL (https://...)"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '10px' }}
                  />
                  <label className="btn btn-secondary" style={{ padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    <ImageIcon size={15} /> Upload File
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>

                {/* Preset image selector */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)', display: 'flex', alignItems: 'center' }}>Quick Presets:</span>
                  {PRESET_AD_IMAGES.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setImageUrl(preset.url)}
                      className="btn btn-ghost"
                      style={{ fontSize: '0.74rem', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Image Preview */}
                {imageUrl && (
                  <div style={{
                    width: '100%',
                    height: '130px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-subtle)',
                    position: 'relative'
                  }}>
                    <img src={imageUrl} alt="Ad Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      style={{
                        position: 'absolute', top: '8px', right: '8px',
                        background: 'rgba(0,0,0,0.6)', color: '#fff',
                        border: 'none', borderRadius: '50%', width: '26px', height: '26px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Live Preview Box */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(124,58,237,0.1) 100%)',
                border: '1px solid var(--brand-primary)',
                borderRadius: '16px',
                padding: '16px',
                marginTop: '8px'
              }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--brand-primary)', fontWeight: 800, marginBottom: '8px' }}>
                  Live Client Preview
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  {imageUrl && (
                    <img src={imageUrl} alt="creative" style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ background: 'var(--brand-primary)', color: '#fff', fontSize: '0.66rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                        {badgeText || 'SPECIAL'}
                      </span>
                      {discountCode && (
                        <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', fontWeight: 700 }}>
                          Code: {discountCode}
                        </span>
                      )}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.96rem' }}>
                      {headline || 'Your Headline Here'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {description || 'Your description will appear here…'}
                    </div>
                  </div>
                  <button type="button" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.82rem', borderRadius: '8px' }}>
                    {ctaText} <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                  style={{ padding: '10px 18px', borderRadius: '10px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '10px 22px', borderRadius: '10px' }}
                >
                  {editingAd ? 'Save Changes' : 'Publish Ad Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
