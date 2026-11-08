import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { useGame } from '../../game/GameContext';
import { ScoreOutcome } from '../../domain/types';

export const ToastContainer: React.FC = () => {
  const { toasts } = useGame();

  if (toasts.length === 0) return null;

  const getOutcomeStyle = (outcome: ScoreOutcome) => {
    switch (outcome) {
      case 'optimal':
      case 'good':
      case 'partial':
        return {
          bg: '#eef9f2',
          border: '#107c41',
          text: '#107c41',
          icon: <CheckCircle size={18} color="#107c41" />,
        };
      case 'harmful':
      case 'critical':
        return {
          bg: '#fdf2f2',
          border: '#a80000',
          text: '#a80000',
          icon: <XCircle size={18} color="#a80000" />,
        };
      default:
        return {
          bg: '#eff6fc',
          border: '#0078d4',
          text: '#0078d4',
          icon: <Info size={18} color="#0078d4" />,
        };
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        pointerEvents: 'none',
      }}
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const style = getOutcomeStyle(toast.outcome);
        const ptsSign = toast.totalPoints > 0 ? `+${toast.totalPoints}` : `${toast.totalPoints}`;

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              background: style.bg,
              borderLeft: `4px solid ${style.border}`,
              borderRadius: '4px',
              padding: '12px 14px',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              animation: 'slideUp 0.18s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {style.icon}
                <span style={{ fontWeight: 700, fontSize: '14px', color: style.text }}>
                  {ptsSign} pts
                </span>
                {toast.streakBonus > 0 && (
                  <span style={{ fontSize: '11px', color: '#107c41', fontWeight: 600, background: '#dff6dd', padding: '1px 5px', borderRadius: '3px' }}>
                    +{toast.streakBonus} racha
                  </span>
                )}
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
              {toast.explanation}
            </div>

            {toast.storageEffectText && (
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px' }}>
                💾 {toast.storageEffectText}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

