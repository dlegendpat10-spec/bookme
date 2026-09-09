import React, { useState, useEffect } from 'react';
import { mockStorage } from '../../services/mockStorage';
import { BusinessTenant } from '../../types';
import { Building2, Globe, Phone, Mail, MapPin, Palette, Check, Save } from 'lucide-react';

export const BusinessProfile: React.FC = () => {
  const business = mockStorage.getBusinesses()[0];
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [slug, setSlug] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [accentColor, setAccentColor] = useState('#10B981');
  const [saved, setSaved] = useState(false);

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
    }
  }, [business]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    mockStorage.updateBusiness(business.id, {
      name,
      category,
      slug,
      phone,
      email,
      address,
      description,
      accentColor
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Business Profile & Branding</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Customize your public booking link, business identity, and primary brand accent color.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={16} /> Save Changes
        </button>
      </div>

      {saved && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#34D399', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={18} /> Business profile updated! Changes are reflected immediately on your booking page.
        </div>
      )}

      <form onSubmit={handleSave} className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Business Name</label>
            <input
              type="text"
              required
              className="input-field"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Category</label>
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
          <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Public URL Slug</label>
          <div style={{ display: 'flex', alignItems: 'center', background: '#0B0F19', border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
            <span style={{ padding: '0 14px', color: 'var(--text-faint)', fontSize: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRight: '1px solid var(--border-subtle)' }}>
              bookme.io/business/
            </span>
            <input
              type="text"
              required
              style={{ border: 'none', background: 'transparent', flex: 1, padding: '10px 14px', color: '#F8FAFC', outline: 'none' }}
              value={slug}
              onChange={e => setSlug(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Bio & Description</label>
          <textarea
            className="input-field"
            style={{ minHeight: '80px', resize: 'vertical' }}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Contact Phone</label>
            <input
              type="tel"
              required
              className="input-field"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Public Contact Email</label>
            <input
              type="email"
              required
              className="input-field"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Physical Address</label>
          <input
            type="text"
            required
            className="input-field"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </div>

        {/* Accent Color Preset Selector */}
        <div>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Palette size={15} /> Brand Theme Accent Color
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {['#10B981', '#6366F1', '#0EA5E9', '#F59E0B', '#EC4899'].map(c => (
              <button
                type="button"
                key={c}
                onClick={() => setAccentColor(c)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: c,
                  border: accentColor === c ? '3px solid #FFFFFF' : 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                }}
              />
            ))}
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
              Selected: <strong style={{ color: accentColor }}>{accentColor}</strong>
            </span>
          </div>
        </div>

      </form>
    </div>
  );
};
