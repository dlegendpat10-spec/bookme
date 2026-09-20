import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockStorage } from '../../services/mockStorage';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { BusinessTenant } from '../../types';
import {
  Building2, Globe, Phone, Mail, MapPin, Palette, Check, Save,
  Copy, ExternalLink, Share2, QrCode, MessageCircle, Send, X, AlertCircle,
  Image as ImageIcon, Upload, Trash2, Plus, Sparkles, Megaphone, ArrowRight
} from 'lucide-react';

const PRESET_LOGOS = [
  { label: 'Corporate Executive', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=200&h=200&q=80' },
  { label: 'Wellness Botanical', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=200&h=200&q=80' },
  { label: 'Athletic Gym', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=200&h=200&q=80' },
  { label: 'Creative Aperture', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=200&h=200&q=80' },
  { label: 'Tech Cyber Node', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=200&h=200&q=80' },
  { label: 'Dental Aesthetic', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=200&h=200&q=80' },
];

const PRESET_COVERS = [
  { label: 'Modern Boardroom', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&h=450&q=80' },
  { label: 'Luxury Spa Resort', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&h=450&q=80' },
  { label: 'High-Tech Gym', url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&h=450&q=80' },
  { label: 'Lighting Studio', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&h=450&q=80' },
  { label: 'Cloud Data Center', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&h=450&q=80' },
  { label: 'Clinical Suite', url: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1200&h=450&q=80' },
];

export const BusinessProfile: React.FC = () => {
  const { currentUser, updateUserBusiness } = useAuth();
  const business = mockStorage.getActiveBusiness(currentUser?.businessId, currentUser?.businessSlug);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [slug, setSlug] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [accentColor, setAccentColor] = useState('#10B981');
  const [logoUrl, setLogoUrl] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [pictures, setPictures] = useState<string[]>([]);
  const [newPictureUrl, setNewPictureUrl] = useState('');

  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [slugError, setSlugError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (business) {
      setName(business.name);
      setCategory(business.category);
      setSlug(business.slug);
      setPhone(business.phone);
      setEmail(business.email);
      setAddress(business.address);
      setDescription(business.description);
      setAccentColor(business.accentColor || '#10B981');
      setLogoUrl(business.logoUrl || '');
      setHeroImageUrl(business.heroImageUrl || '');
      setPictures(business.pictures || []);
    }
  }, [business?.id, business?.slug]);

  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-');
  const shareUrl = `${window.location.origin}/business/${cleanSlug || 'your-business'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Book your appointment with ${name || 'us'} online: ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Book an appointment with ${name || 'our business'}`);
    const body = encodeURIComponent(`Hello,\n\nYou can easily book your next appointment online using our direct booking link:\n\n${shareUrl}\n\nWe look forward to seeing you!`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  // Image Upload Helpers
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') setLogoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') setHeroImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPictures(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPictureUrl = () => {
    if (newPictureUrl.trim()) {
      setPictures(prev => [...prev, newPictureUrl.trim()]);
      setNewPictureUrl('');
    }
  };

  const handleRemovePicture = (idx: number) => {
    setPictures(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSlugError('');

    const formattedSlug = cleanSlug.replace(/^-+|-+$/g, '');
    if (!formattedSlug) {
      setSlugError('URL slug cannot be empty.');
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formattedSlug)) {
      setSlugError('Slug may only contain lowercase letters, numbers, and single hyphens.');
      return;
    }

    setIsSaving(true);

    // 1. Update in local storage
    if (business) {
      mockStorage.updateBusiness(business.id, {
        name: name.trim(),
        category,
        slug: formattedSlug,
        phone,
        email,
        address,
        description,
        accentColor,
        logoUrl: logoUrl.trim(),
        heroImageUrl: heroImageUrl.trim(),
        pictures,
      });
    }

    // 2. Sync to Backend REST API
    try {
      const res = await api.updateMyBusiness({
        name: name.trim(),
        slug: formattedSlug,
        category,
        phone,
        email,
        address,
        description,
        accentColor,
        logoUrl: logoUrl.trim(),
        heroImageUrl: heroImageUrl.trim(),
        pictures,
      });

      if (!res.success && res.error) {
        if (res.error.includes('already in use')) {
          setSlugError('This URL slug is already taken by another business. Please pick another one.');
          setIsSaving(false);
          return;
        }
      }
    } catch (apiErr) {
      console.warn('Backend update notice (working in resilient mode):', apiErr);
    }

    // 3. Update Auth context
    if (business) {
      updateUserBusiness(business.id, name.trim(), formattedSlug);
    }

    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const activeAdsCount = business ? mockStorage.getAds(business.id).filter(a => a.isActive).length : 0;

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '4px' }}>Business Profile & Branding</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Customize your logo, venue pictures, personalized ads, branding identity, and contact info.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
          <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {saved && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#34D399', padding: '14px 18px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 14px rgba(16,185,129,0.1)' }}>
          <Check size={20} color="#34D399" />
          <span style={{ fontWeight: 600 }}>Business profile, pictures, and logo updated successfully!</span>
        </div>
      )}

      {slugError && (
        <div style={{ background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.4)', color: '#FB7185', padding: '14px 18px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={20} color="#FB7185" />
          <span>{slugError}</span>
        </div>
      )}

      {/* ── MARKETING ADS BANNER PROMPT ──────────────────────────────────── */}
      <div className="card glow-card" style={{
        padding: '20px 24px',
        borderRadius: '16px',
        marginBottom: '26px',
        background: 'linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(124,58,237,0.12) 100%)',
        border: '1px solid var(--brand-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--brand-primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Megaphone size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '2px' }}>
              Personalized Ads & Campaign Promotions
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              You currently have <strong style={{ color: 'var(--brand-primary)' }}>{activeAdsCount} active ad{activeAdsCount !== 1 ? 's' : ''}</strong> boosting bookings on your page.
            </p>
          </div>
        </div>

        <Link to="/admin/ads" className="btn btn-primary" style={{ padding: '9px 18px', fontSize: '0.88rem' }}>
          Manage Ads & Campaigns <ArrowRight size={15} />
        </Link>
      </div>

      {/* ── 1. CUSTOMER SHAREABLE URL HERO CARD ──────────────────────────── */}
      <div className="card" style={{
        padding: '26px',
        marginBottom: '26px',
        background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(16, 185, 129, 0.05) 100%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge" style={{ background: 'var(--brand-light)', color: 'var(--brand-primary)', border: '1px solid var(--brand-primary)', fontSize: '0.75rem', fontWeight: 800 }}>
                CUSTOMER BOOKING LINK
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Share this URL with clients</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Your Public Booking Link
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCopyLink}
              style={{ fontSize: '0.84rem', padding: '8px 14px', gap: '6px' }}
            >
              {copied ? <><Check size={15} color="#10B981" /> Copied!</> : <><Copy size={15} /> Copy URL</>}
            </button>

            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ fontSize: '0.84rem', padding: '8px 14px', gap: '6px' }}
            >
              <ExternalLink size={15} /> Open Page
            </a>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowQrModal(true)}
              style={{ fontSize: '0.84rem', padding: '8px 14px', gap: '6px' }}
            >
              <QrCode size={15} /> QR Code
            </button>
          </div>
        </div>

        {/* Live URL Pill Display */}
        <div style={{
          background: 'var(--bg-app)',
          border: '1px solid var(--border-strong)',
          borderRadius: '12px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <Globe size={18} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
            <code style={{
              fontSize: '0.94rem',
              color: 'var(--text-main)',
              fontWeight: 700,
              fontFamily: 'monospace',
              wordBreak: 'break-all',
            }}>
              {shareUrl}
            </code>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              title="Share on WhatsApp"
              style={{
                background: '#25D366', color: '#fff', border: 'none',
                borderRadius: '8px', padding: '7px 14px', fontSize: '0.82rem',
                fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px',
                cursor: 'pointer',
              }}
            >
              <MessageCircle size={15} /> WhatsApp
            </button>

            <button
              type="button"
              onClick={handleShareEmail}
              title="Share via Email"
              style={{
                background: 'var(--bg-elevated)', color: 'var(--text-main)', border: '1px solid var(--border-subtle)',
                borderRadius: '8px', padding: '7px 14px', fontSize: '0.82rem',
                fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Send size={15} /> Email
            </button>
          </div>
        </div>

        {/* Slug Customizer Input */}
        <div>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block', fontWeight: 600 }}>
            Customize Public URL Slug:
          </label>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-app)', border: '1px solid var(--border-strong)', borderRadius: '10px', overflow: 'hidden' }}>
            <span style={{ padding: '0 14px', color: 'var(--text-faint)', fontSize: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRight: '1px solid var(--border-subtle)', whiteSpace: 'nowrap', userSelect: 'none' }}>
              {window.location.host}/business/
            </span>
            <input
              type="text"
              required
              style={{ border: 'none', background: 'transparent', flex: 1, padding: '10px 14px', color: 'var(--text-main)', outline: 'none', fontSize: '0.92rem', fontWeight: 600 }}
              value={slug}
              placeholder="your-custom-slug"
              onChange={e => {
                setSlugError('');
                setSlug(e.target.value);
              }}
            />
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-faint)', marginTop: '4px', display: 'block' }}>
            Lowercase letters, numbers, and hyphens only (e.g. <code>my-barbershop</code> or <code>lagos-tutors</code>).
          </span>
        </div>
      </div>

      {/* ── 2. BRAND ASSETS & PICTURES (LOGO & HERO & GALLERY) ─────────── */}
      <div className="card" style={{ padding: '28px', marginBottom: '26px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ImageIcon size={20} color="var(--brand-primary)" /> Business Pictures & Logo
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Upload your official brand logo, venue cover picture, and showcase photos to build trust with customers.
          </p>
        </div>

        {/* 2A. LOGO UPLOAD & PRESETS */}
        <div style={{
          padding: '20px',
          background: 'var(--bg-elevated)',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)'
        }}>
          <label style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '8px', display: 'block' }}>
            Business Logo
          </label>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Logo Preview */}
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-hover) 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
              position: 'relative',
              fontSize: '1.8rem',
              fontWeight: 900
            }}>
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                (name ? name.slice(0, 2).toUpperCase() : 'BM')
              )}
            </div>

            {/* Logo Controls */}
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter logo image URL (https://...)"
                  value={logoUrl}
                  onChange={e => setLogoUrl(e.target.value)}
                  style={{ flex: 1, padding: '9px 12px', fontSize: '0.88rem' }}
                />
                <label className="btn btn-secondary" style={{ padding: '9px 14px', fontSize: '0.84rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <Upload size={14} /> Upload
                  <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                </label>
                {logoUrl && (
                  <button type="button" onClick={() => setLogoUrl('')} className="btn btn-ghost" style={{ padding: '8px', color: '#EF4444' }} title="Remove logo">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Logo Quick Presets */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-faint)', alignSelf: 'center' }}>Presets:</span>
                {PRESET_LOGOS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLogoUrl(p.url)}
                    className="btn btn-ghost"
                    style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2B. HERO / COVER PICTURE */}
        <div style={{
          padding: '20px',
          background: 'var(--bg-elevated)',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)'
        }}>
          <label style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '8px', display: 'block' }}>
            Hero / Cover Picture (Header Banner)
          </label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Enter cover image URL (https://...)"
              value={heroImageUrl}
              onChange={e => setHeroImageUrl(e.target.value)}
              style={{ flex: 1, padding: '9px 12px', fontSize: '0.88rem' }}
            />
            <label className="btn btn-secondary" style={{ padding: '9px 14px', fontSize: '0.84rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <Upload size={14} /> Upload
              <input type="file" accept="image/*" onChange={handleHeroUpload} style={{ display: 'none' }} />
            </label>
            {heroImageUrl && (
              <button type="button" onClick={() => setHeroImageUrl('')} className="btn btn-ghost" style={{ padding: '8px', color: '#EF4444' }} title="Remove cover">
                <Trash2 size={16} />
              </button>
            )}
          </div>

          {/* Cover Presets */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-faint)', alignSelf: 'center' }}>Presets:</span>
            {PRESET_COVERS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setHeroImageUrl(p.url)}
                className="btn btn-ghost"
                style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Cover Banner Preview */}
          {heroImageUrl && (
            <div style={{
              width: '100%',
              height: '160px',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid var(--border-subtle)'
            }}>
              <img src={heroImageUrl} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute', bottom: '10px', left: '12px',
                background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: '0.74rem',
                padding: '3px 8px', borderRadius: '6px', fontWeight: 600
              }}>
                Cover Banner Preview
              </div>
            </div>
          )}
        </div>

        {/* 2C. PHOTO GALLERY & WORK PICTURES */}
        <div style={{
          padding: '20px',
          background: 'var(--bg-elevated)',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <label style={{ fontSize: '0.92rem', fontWeight: 700, display: 'block' }}>
                Venue & Work Picture Gallery
              </label>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Display pictures of your space, team, and past work on your public booking page.
              </span>
            </div>

            <label className="btn btn-secondary" style={{ padding: '7px 14px', fontSize: '0.82rem', cursor: 'pointer' }}>
              <Plus size={14} /> Add Photo
              <input type="file" accept="image/*" onChange={handlePictureUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Add via URL input */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Or paste picture URL to add to gallery…"
              value={newPictureUrl}
              onChange={e => setNewPictureUrl(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.84rem' }}
            />
            <button type="button" onClick={handleAddPictureUrl} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.84rem' }}>
              Add URL
            </button>
          </div>

          {/* Gallery Thumbnails Grid */}
          {pictures.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '28px 16px',
              border: '1px dashed var(--border-subtle)',
              borderRadius: '12px',
              color: 'var(--text-faint)',
              fontSize: '0.84rem'
            }}>
              No gallery pictures added yet. Upload pictures of your venue, team, or past work.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
              {pictures.map((pic, idx) => (
                <div key={idx} style={{
                  height: '100px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-app)'
                }}>
                  <img src={pic} alt={`Gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => handleRemovePicture(idx)}
                    style={{
                      position: 'absolute', top: '6px', right: '6px',
                      background: 'rgba(239, 68, 68, 0.85)', color: '#fff',
                      border: 'none', borderRadius: '50%', width: '22px', height: '22px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    title="Remove picture"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── 3. GENERAL PROFILE & BRANDING FORM ────────────────────────────── */}
      <form onSubmit={handleSave} className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '26px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          Business Identity & Contact Details
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label className="field-label">Business Name *</label>
            <input
              type="text"
              required
              className="input-field"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="field-label">Category / Tagline</label>
            <input
              type="text"
              required
              className="input-field"
              value={category}
              onChange={e => setCategory(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="field-label">Bio & Business Description</label>
          <textarea
            className="input-field"
            style={{ minHeight: '84px', resize: 'vertical' }}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Tell clients about your services, certifications, or house rules..."
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label className="field-label">Contact Phone</label>
            <input
              type="tel"
              className="input-field"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+234 800 000 0000"
            />
          </div>

          <div>
            <label className="field-label">Contact Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="contact@business.com"
            />
          </div>
        </div>

        <div>
          <label className="field-label">Physical Address / Studio Location</label>
          <input
            type="text"
            className="input-field"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="e.g. 12 Adeola Odeku, Victoria Island, Lagos"
          />
        </div>

        {/* Accent Color Preset Selector */}
        <div>
          <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Palette size={15} /> Brand Accent Color
          </label>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px' }}>
            {['#10B981', '#2563EB', '#7C3AED', '#0EA5E9', '#F59E0B', '#EC4899', '#DC2626'].map(c => (
              <button
                type="button"
                key={c}
                onClick={() => setAccentColor(c)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: c,
                  border: accentColor === c ? '3px solid #FFFFFF' : '2px solid transparent',
                  cursor: 'pointer',
                  boxShadow: accentColor === c ? '0 0 12px ' + c : '0 2px 6px rgba(0,0,0,0.3)',
                  transition: 'transform 0.15s',
                }}
              />
            ))}
            <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
              Selected: <strong style={{ color: accentColor }}>{accentColor}</strong>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
          <button type="submit" className="btn btn-primary" style={{ minWidth: '180px' }} disabled={isSaving}>
            <Save size={16} /> {isSaving ? 'Saving Changes...' : 'Save All Changes'}
          </button>
        </div>
      </form>

      {/* ── 4. QR CODE MODAL ──────────────────────────────────────────────── */}
      {showQrModal && (
        <div className="modal-overlay" onClick={() => setShowQrModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'center', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Customer QR Code</h3>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
              Clients can scan this QR code with their phone camera to open your booking page directly.
            </p>

            <div style={{
              background: '#FFFFFF',
              padding: '20px',
              borderRadius: '16px',
              display: 'inline-block',
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
              marginBottom: '20px',
            }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(shareUrl)}`}
                alt={`QR code for ${name} booking link`}
                style={{ width: '220px', height: '220px', display: 'block' }}
              />
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              <strong>{name || 'Your Business'}</strong>
              <br />
              <code style={{ color: 'var(--brand-primary)', fontSize: '0.78rem' }}>{shareUrl}</code>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  window.print();
                }}
                style={{ flex: 1 }}
              >
                Print QR Code
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCopyLink}
                style={{ flex: 1 }}
              >
                {copied ? 'Copied Link!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
