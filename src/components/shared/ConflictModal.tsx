import React from 'react';
import { AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { TimeSlot } from '../../types';

interface ConflictModalProps {
  alternativeSlots: TimeSlot[];
  onSelectAlternative: (slot: TimeSlot) => void;
  onClose: () => void;
}

export const ConflictModal: React.FC<ConflictModalProps> = ({
  alternativeSlots,
  onSelectAlternative,
  onClose
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '480px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <AlertCircle size={30} color="#F87171" />
        </div>

        <h3 style={{ fontSize: '1.35rem', marginBottom: '8px', color: '#F8FAFC' }}>
          Time Slot No Longer Available
        </h3>

        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: '8px',
          padding: '14px',
          color: '#FECACA',
          fontSize: '0.95rem',
          lineHeight: 1.5,
          marginBottom: '20px'
        }}>
          This time was just booked by another customer.<br />
          <strong>Please select another available time.</strong>
        </div>

        {alternativeSlots.length > 0 && (
          <div style={{ marginBottom: '24px', textAlign: 'left' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} /> Recommended alternative slots today:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {alternativeSlots.slice(0, 6).map(slot => (
                <button
                  key={slot.time}
                  onClick={() => onSelectAlternative(slot)}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-strong)',
                    color: 'var(--text-main)',
                    borderRadius: '8px',
                    padding: '10px 6px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand-primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
                >
                  {slot.displayTime}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
            Close & Pick Date
          </button>
        </div>
      </div>
    </div>
  );
};
