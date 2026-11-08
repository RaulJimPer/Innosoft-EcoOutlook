import React from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  Database,
  Flame,
  Info,
  Lightbulb,
  XCircle,
} from 'lucide-react';
import { useGame } from '../../game/GameContext';
import { formatBytes } from '../../domain/storage';

export const ContextPanel: React.FC = () => {
  const { session, storage, remainingMs, badge } = useGame();

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const timeProgressPercent = Math.min(100, Math.max(0, ((180 - totalSeconds) / 180) * 100));

  const capacityBytes = storage.capacityBytes;
  const usedPercent = Math.min(100, (storage.usedBytes / capacityBytes) * 100);
  const trashPercent = Math.min(100, (storage.trashBytes / capacityBytes) * 100);

  const ecoTips = [
    'Un enlace compartido evita clonar payloads pesados en múltiples buzones.',
    'La Papelera retiene los bytes hasta que se vacía definitivamente.',
    'Archivar organiza tus bandejas, pero no reduce el almacenamiento del centro.',
    'Antes de borrar un duplicado, verifica cuál es la versión canónica firmada.',
    'Las versiones intermedias de un archivo ocupan espacio acumulado en el historial.',
  ];

  const currentTip = ecoTips[Math.floor(session.casesResolved % ecoTips.length)];

  return (
    <aside
      style={{
        width: 'var(--right-panel-width)',
        backgroundColor: '#fff',
        borderLeft: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - var(--topbar-height))',
        overflowY: 'auto',
        padding: '16px',
        gap: '16px',
        flexShrink: 0,
      }}
    >
      {/* Time & Challenge Progress */}
      <div style={{ background: 'var(--bg-subtle)', padding: '12px 14px', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Reto en curso
          </span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
            {180 - totalSeconds}s transcurridos
          </span>
        </div>

        <div style={{ width: '100%', height: '6px', backgroundColor: '#e1dfdd', borderRadius: '3px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${timeProgressPercent}%`,
              height: '100%',
              backgroundColor: totalSeconds <= 30 ? 'var(--red)' : 'var(--primary)',
              transition: 'width 0.25s linear',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Casos evaluados:</span>
          <strong>{session.casesResolved} / 73</strong>
        </div>
      </div>

      {/* Storage Meter */}
      <div style={{ background: '#fff', padding: '12px 14px', borderRadius: '6px', border: '1px solid var(--border-default)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '12px', color: 'var(--text-primary)', marginBottom: '10px' }}>
          <Database size={15} color="var(--primary)" />
          <span>Almacenamiento (50 GB)</span>
        </div>

        {/* Stacked bar */}
        <div style={{ width: '100%', height: '12px', backgroundColor: '#e1dfdd', borderRadius: '4px', overflow: 'hidden', display: 'flex', marginBottom: '8px' }}>
          <div
            style={{
              width: `${usedPercent - trashPercent}%`,
              backgroundColor: 'var(--primary)',
            }}
            title="Almacenamiento activo"
          />
          <div
            style={{
              width: `${trashPercent}%`,
              backgroundColor: '#e5a903',
            }}
            title="En Papelera (sigue ocupando)"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
              Ocupación activa:
            </span>
            <strong>{formatBytes(storage.activeBytes)}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#e5a903' }} />
              En Papelera:
            </span>
            <strong style={{ color: '#b78103' }}>{formatBytes(storage.trashBytes)}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '6px' }}>
            <span style={{ color: 'var(--green)', fontWeight: 700 }}>
              Liberado efectivamente:
            </span>
            <strong style={{ color: 'var(--green)', fontWeight: 800 }}>
              {formatBytes(storage.freedBytes)}
            </strong>
          </div>
        </div>
      </div>

      {/* Feed of Recent Actions */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
          Últimas decisiones ({session.recentActions.length})
        </div>

        {session.recentActions.length === 0 ? (
          <div style={{ padding: '20px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
            Aún no has resuelto casos.<br />
            Explora las bandejas y toma decisiones.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
            {session.recentActions.map((act) => {
              const isPos = act.points !== undefined && act.points > 0;
              const isCrit = act.outcome === 'critical';
              const isHarm = act.outcome === 'harmful';

              return (
                <div
                  key={act.id}
                  style={{
                    background: isCrit ? '#fdf2f2' : isHarm ? '#fef7e6' : isPos ? '#f2f9f4' : 'var(--bg-subtle)',
                    padding: '8px 10px',
                    borderRadius: '4px',
                    border: `1px solid ${isCrit ? '#f5c6cb' : isHarm ? '#ffeeba' : isPos ? '#c3e6cb' : 'var(--border-light)'}`,
                    fontSize: '11.5px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: '2px' }}>
                    <span style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px' }}>
                      {act.title}
                    </span>
                    <span style={{ color: isCrit || isHarm ? 'var(--red)' : isPos ? 'var(--green)' : 'var(--text-muted)' }}>
                      {act.points !== undefined && act.points > 0 ? `+${act.points}` : act.points}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                    {act.description}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contextual Educational Tip */}
      <div
        style={{
          background: '#eff6fc',
          border: '1px solid #c7e0f4',
          borderRadius: '6px',
          padding: '10px 12px',
          display: 'flex',
          gap: '8px',
          fontSize: '11.5px',
          color: '#004578',
          lineHeight: 1.4,
        }}
      >
        <Lightbulb size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
        <div>
          <strong>Consejo ecológico:</strong> {currentTip}
        </div>
      </div>
    </aside>
  );
};

