import React, { useState, useEffect } from 'react';
import { mockStorage } from '../../services/mockStorage';
import { Service } from '../../types';
import { Plus, Edit2, Trash2, Clock, Check, Layers } from 'lucide-react';

export const ServicesList: React.FC = () => {
  const business = mockStorage.getBusinesses()[0];
  const [services, setServices] = useState<Service[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('General');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [bufferMinutes, setBufferMinutes] = useState(5);
  const [price, setPrice] = useState(10000);
  const [isActive, setIsActive] = useState(true);

  const refresh = () => {
    if (business) {
      setServices(mockStorage.getServices(business.id));
    }
  };

  useEffect(() => {
    refresh();
  }, [business]);

  const handleOpenAdd = () => {
    setEditingService(null);
    setName('');
    setCategory('General');
    setDescription('');
    setDurationMinutes(30);
    setBufferMinutes(5);
    setPrice(10000);
    setIsActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingService(srv);
    setName(srv.name);
    setCategory(srv.category);
    setDescription(srv.description);
    setDurationMinutes(srv.durationMinutes);
    setBufferMinutes(srv.bufferMinutes);
    setPrice(srv.price);
    setIsActive(srv.isActive);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    const srv: Service = {
      id: editingService ? editingService.id : 'srv-' + Date.now(),
      businessId: business.id,
      name,
      category,
      description,
      durationMinutes: Number(durationMinutes),
      bufferMinutes: Number(bufferMinutes),
      price: Number(price),
      currency: 'NGN',
      isActive,
      bookingCount: editingService ? editingService.bookingCount : 0
    };

    mockStorage.saveService(srv);
    setShowModal(false);
    refresh();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      mockStorage.deleteService(id);
      refresh();
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Services & Pricing Catalog</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Configure services, appointment durations, pricing, and cleanup buffer times.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> + Add New Service
        </button>
      </div>

      {/* Services Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {services.map(srv => (
          <div key={srv.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-main)' }}>
                  {srv.category}
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC' }}>
                  {srv.currency} {srv.price.toLocaleString()}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{srv.name}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.4 }}>
                {srv.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.82rem', color: 'var(--text-faint)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> Duration: {srv.durationMinutes}m
                </span>
                <span>Buffer: {srv.bufferMinutes}m</span>
                <span>Status: <strong style={{ color: srv.isActive ? '#34D399' : '#FB7185' }}>{srv.isActive ? 'Active' : 'Inactive'}</strong></span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', marginTop: '16px' }}>
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: '32px' }}
                onClick={() => handleOpenEdit(srv)}
              >
                <Edit2 size={13} /> Edit
              </button>
              <button
                className="btn btn-ghost"
                style={{ padding: '6px 10px', fontSize: '0.8rem', minHeight: '32px', color: '#FB7185' }}
                onClick={() => handleDelete(srv.id)}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Service Editor Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Service Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Royal Hot Towel Shave"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Category</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    placeholder="e.g. Beard Care"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Price (NGN)</label>
                  <input
                    type="number"
                    required
                    className="input-field"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Description</label>
                <textarea
                  className="input-field"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Explain what the service entails..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    step="5"
                    className="input-field"
                    value={durationMinutes}
                    onChange={e => setDurationMinutes(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Cleanup Buffer (Minutes)</label>
                  <input
                    type="number"
                    step="5"
                    className="input-field"
                    value={bufferMinutes}
                    onChange={e => setBufferMinutes(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <input
                  type="checkbox"
                  id="activeToggle"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                />
                <label htmlFor="activeToggle" style={{ fontSize: '0.85rem' }}>Active on public booking page</label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
