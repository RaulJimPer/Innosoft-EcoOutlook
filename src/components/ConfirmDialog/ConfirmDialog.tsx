import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useGame } from '../../game/GameContext';

export const ConfirmDialog: React.FC = () => {
  const { confirmDialog, closeConfirmDialog } = useGame();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (confirmDialog) {
      cancelButtonRef.current?.focus();
    }
  }, [confirmDialog]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && confirmDialog) {
        closeConfirmDialog();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmDialog, closeConfirmDialog]);

  if (!confirmDialog) return null;

  const {
    title,
    message,
    details,
    warningNotice,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    isDanger = false,
    onConfirm,
  } = confirmDialog;

  return (
    <div className="modal-overlay" onClick={closeConfirmDialog} role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="modal-container" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isDanger && <AlertTriangle size={18} color="var(--red)" />}
            <h3 id="confirm-title">{title}</h3>
          </div>
          <button className="btn icon-only" onClick={closeConfirmDialog} aria-label="Cerrar confirmación">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ fontSize: '13.5px', lineHeight: 1.5 }}>
          <p style={{ margin: '0 0 12px 0', color: 'var(--text-primary)' }}>{message}</p>

          {details && details.length > 0 && (
            <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: '4px', marginBottom: '14px', border: '1px solid var(--border-light)' }}>
              <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-secondary)', fontSize: '12.5px' }}>
                {details.map((d, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{d}</li>
                ))}
              </ul>
            </div>
          )}

          {warningNotice && (
            <div style={{ display: 'flex', gap: '8px', padding: '10px 12px', background: 'var(--red-bg)', color: 'var(--red)', borderRadius: '4px', border: '1px solid #f5c6cb', fontSize: '12px', fontWeight: 500 }}>
              <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{warningNotice}</div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button ref={cancelButtonRef} className="btn" onClick={closeConfirmDialog}>
            {cancelLabel}
          </button>
          <button
            className={`btn ${isDanger ? 'danger-solid' : 'primary'}`}
            onClick={() => {
              onConfirm();
              closeConfirmDialog();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

