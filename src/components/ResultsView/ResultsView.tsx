import React from 'react';
import {
  AlertCircle,
  Archive,
  Award,
  Calendar,
  CheckCircle,
  Database,
  FileText,
  Mail,
  RefreshCw,
  Shield,
  Trash2,
  Users,
  XCircle,
} from 'lucide-react';
import { useGame } from '../../game/GameContext';
import { formatBytes } from '../../domain/storage';

export const ResultsView: React.FC = () => {
  const { session, storage, badge, ranking, resetGame, dataset } = useGame();

  const mailResolved = dataset.scoringCases.filter((c) => c.module === 'mail' && c.status === 'resolved').length;
  const filesResolved = dataset.scoringCases.filter((c) => c.module === 'files' && c.status === 'resolved').length;
  const calResolved = dataset.scoringCases.filter((c) => c.module === 'calendar' && c.status === 'resolved').length;
  const conResolved = dataset.scoringCases.filter((c) => c.module === 'contacts' && c.status === 'resolved').length;

  const positiveDecisions = session.actionLedger.filter((e) => ['optimal', 'good', 'partial'].includes(e.outcome)).length;
  const harmfulDecisions = session.harmfulDeletions;
  const criticalDecisions = session.criticalDeletions;

  return (
    <div
      style={{
        height: '100vh',
        overflowY: 'auto',
        backgroundColor: '#f3f2f1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px 20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1040px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Results Header Card */}
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '28px 36px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span
                style={{
                  background: badge.color,
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {badge.title}
              </span>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                {session.alias ? `Participante: ${session.alias}` : 'Participante anónimo'}
              </span>
            </div>

            <h2 style={{ margin: '0 0 8px 0', fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Resultado final de la partida
            </h2>

            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {badge.description}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'var(--bg-subtle)',
              padding: '16px 28px',
              borderRadius: '8px',
              border: '1px solid var(--border-default)',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Puntuación total
            </div>
            <div
              style={{
                fontSize: '48px',
                fontWeight: 900,
                color: session.score >= 600 ? 'var(--primary)' : session.score < 0 ? 'var(--red)' : 'var(--text-primary)',
                lineHeight: 1.1,
              }}
            >
              {session.score}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Racha máxima: <strong>+{session.bestStreak * 10} pts</strong>
            </div>
          </div>
        </div>

        {/* Storage Accounting Breakdown */}
        <div
          style={{
            background: '#fff',
            borderRadius: '10px',
            padding: '24px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={18} color="var(--primary)" /> Balance real de almacenamiento
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: '#eef9f2', padding: '16px', borderRadius: '8px', border: '1px solid #c3e6cb' }}>
              <div style={{ fontSize: '12px', color: '#107c41', fontWeight: 700 }}>
                LIBERADO DEFINITIVAMENTE
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#107c41', margin: '4px 0' }}>
                {formatBytes(storage.freedBytes)}
              </div>
              <div style={{ fontSize: '11px', color: '#107c41' }}>
                Unidades físicas sin referencias eliminadas
              </div>
            </div>

            <div style={{ background: '#fef7e6', padding: '16px', borderRadius: '8px', border: '1px solid #ffeeba' }}>
              <div style={{ fontSize: '12px', color: '#b78103', fontWeight: 700 }}>
                PENDIENTE EN PAPELERA
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#b78103', margin: '4px 0' }}>
                {formatBytes(storage.trashBytes)}
              </div>
              <div style={{ fontSize: '11px', color: '#b78103' }}>
                Sigue ocupando espacio hasta vaciarla
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 700 }}>
                USO FINAL ACTIVO
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>
                {formatBytes(storage.activeBytes)}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                De 50 GB de capacidad asignada
              </div>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-subtle)', padding: '12px 16px', borderRadius: '6px', lineHeight: 1.5 }}>
            💡 <strong>Reflexión educativa sobre la huella digital:</strong> Mantener información redundante, versiones intermedias o archivos en la papelera requiere almacenamiento continuo en centros de datos, replicación entre servidores y energía permanente de alimentación y refrigeración. Liberar duplicados sin borrar lo importante reduce esta carga física sin pérdidas documentales.
          </div>
        </div>

        {/* Modules & Decisions Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Resolved Cases by Module */}
          <div style={{ background: '#fff', borderRadius: '10px', padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: 700 }}>
              Casos resueltos por módulo ({session.casesResolved} de 73)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '13px' }}>
                  <Mail size={16} color="var(--primary)" /> Correo
                </span>
                <span style={{ fontWeight: 700 }}>{mailResolved} / 30</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '13px' }}>
                  <FileText size={16} color="#107c41" /> Archivos / OneDrive
                </span>
                <span style={{ fontWeight: 700 }}>{filesResolved} / 25</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '13px' }}>
                  <Calendar size={16} color="#8764b8" /> Calendario
                </span>
                <span style={{ fontWeight: 700 }}>{calResolved} / 8</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '13px' }}>
                  <Users size={16} color="#008272" /> Contactos
                </span>
                <span style={{ fontWeight: 700 }}>{conResolved} / 10</span>
              </div>
            </div>
          </div>

          {/* Decisions Distribution */}
          <div style={{ background: '#fff', borderRadius: '10px', padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: 700 }}>
              Balance de calidad en las decisiones
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#eef9f2', borderRadius: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--green)', fontWeight: 600, fontSize: '13px' }}>
                  <CheckCircle size={16} /> Decisiones positivas (+100 / +60 / +30)
                </span>
                <strong style={{ color: 'var(--green)', fontSize: '15px' }}>{positiveDecisions}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#fef7e6', borderRadius: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--amber)', fontWeight: 600, fontSize: '13px' }}>
                  <AlertCircle size={16} /> Decisiones perjudiciales (-100)
                </span>
                <strong style={{ color: 'var(--amber)', fontSize: '15px' }}>{harmfulDecisions}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#fdf2f2', borderRadius: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--red)', fontWeight: 600, fontSize: '13px' }}>
                  <XCircle size={16} /> Eliminaciones críticas (-200)
                </span>
                <strong style={{ color: 'var(--red)', fontSize: '15px' }}>{criticalDecisions}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Local Ranking Top 10 Card */}
        <div
          style={{
            background: '#fff',
            borderRadius: '10px',
            padding: '24px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} color="#e5a903" /> Clasificación Top 10 del stand
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Guardado localmente en este ordenador</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-default)' }}>
                <th style={{ padding: '8px 12px' }}>Puesto</th>
                <th style={{ padding: '8px 12px' }}>Participante</th>
                <th style={{ padding: '8px 12px' }}>Casos</th>
                <th style={{ padding: '8px 12px' }}>Espacio liberado</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Puntuación</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((entry, index) => {
                const isCurrent = entry.id === session.id;
                return (
                  <tr
                    key={entry.id + index}
                    style={{
                      borderBottom: '1px solid var(--border-light)',
                      backgroundColor: isCurrent ? '#edf5fc' : 'transparent',
                      fontWeight: isCurrent ? 700 : 400,
                    }}
                  >
                    <td style={{ padding: '8px 12px' }}>
                      <span style={{ fontWeight: 800, color: index === 0 ? '#e5a903' : 'var(--text-muted)' }}>
                        #{index + 1}
                      </span>
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      {entry.alias} {isCurrent && <span style={{ fontSize: '11px', color: 'var(--primary)' }}>(Tú)</span>}
                    </td>
                    <td style={{ padding: '8px 12px' }}>{entry.casesResolved}</td>
                    <td style={{ padding: '8px 12px', color: 'var(--green)', fontWeight: 600 }}>
                      {formatBytes(entry.freedBytes)}
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 800, color: 'var(--primary)' }}>
                      {entry.score} pts
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Action Button: Nueva Partida */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 20px 0' }}>
          <button
            className="btn primary"
            onClick={resetGame}
            style={{
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: 700,
              borderRadius: '6px',
              boxShadow: '0 4px 14px rgba(0, 120, 212, 0.35)',
            }}
          >
            <RefreshCw size={18} /> Nueva partida (Siguiente participante)
          </button>
        </div>
      </div>
    </div>
  );
};

