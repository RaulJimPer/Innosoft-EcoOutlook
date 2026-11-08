import React, { useState } from 'react';
import {
  Archive,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Database,
  FileText,
  HelpCircle,
  Mail,
  Play,
  RotateCcw,
  Shield,
  Trash2,
  Users,
} from 'lucide-react';
import { useGame } from '../../game/GameContext';
import { formatBytes } from '../../domain/storage';

export const WelcomeView: React.FC = () => {
  const { startNewGame, ranking, clearRanking, showConfirmDialog } = useGame();
  const [alias, setAlias] = useState('');
  const [showHowToScoreModal, setShowHowToScoreModal] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    startNewGame(alias);
  };

  const handleClearRanking = () => {
    showConfirmDialog({
      title: 'Restablecer ranking local',
      message: '¿Estás seguro de que deseas borrar todas las puntuaciones guardadas en este dispositivo?',
      warningNotice: 'Esta acción no se puede deshacer. Se borrarán todas las entradas del Top 10.',
      confirmLabel: 'Borrar ranking',
      isDanger: true,
      onConfirm: () => {
        clearRanking();
        setShowAdminMenu(false);
      },
    });
  };

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
          maxWidth: '1020px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Brand & Hero Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0078d4 0%, #004578 100%)',
            color: '#fff',
            borderRadius: '12px',
            padding: '32px 40px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ maxWidth: '640px', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  background: '#fff',
                  color: '#0078d4',
                  borderRadius: '8px',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 900,
                  fontSize: '20px',
                }}
              >
                E
              </div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                EcoOutlook
              </h1>
              <span
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                STAND DE SOSTENIBILIDAD
              </span>
            </div>

            <p style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600, color: '#e1dfdd' }}>
              «No se trata de borrar más, sino de gestionar mejor»
            </p>

            <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.6, color: '#c7e0f4' }}>
              Sumérgete en una suite corporativa con 320 correos, 120 archivos, 64 contactos y 48 eventos
              deliberadamente desorganizados. Tienes 3 minutos exactos para optimizar el entorno digital,
              evitar la duplicidad y salvaguardar la información esencial.
            </p>
          </div>

          <div
            style={{
              background: 'rgba(0, 0, 0, 0.25)',
              padding: '20px 24px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.2)',
              textAlign: 'center',
              minWidth: '170px',
              zIndex: 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#c7e0f4', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
              <Clock size={15} /> Reto activo
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>
              03:00
            </div>
            <div style={{ fontSize: '11px', color: '#e1dfdd', marginTop: '4px' }}>
              180 segundos exactos
            </div>
          </div>
        </div>

        {/* Start Game & Alias Form */}
        <div
          style={{
            background: '#fff',
            borderRadius: '10px',
            padding: '24px 30px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
          <form onSubmit={handleStart} style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 450px' }}>
            <div style={{ flex: '1 1 240px' }}>
              <label htmlFor="alias-input" style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                ALIAS DEL PARTICIPANTE (OPCIONAL)
              </label>
              <input
                id="alias-input"
                type="text"
                maxLength={16}
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Ej. CarmenS, EcoUser..."
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-default)',
                  fontSize: '14px',
                }}
              />
            </div>

            <button
              type="submit"
              className="btn primary"
              style={{
                padding: '11px 26px',
                fontSize: '15px',
                fontWeight: 700,
                borderRadius: '6px',
                marginTop: '19px',
                boxShadow: '0 4px 12px rgba(0, 120, 212, 0.3)',
              }}
            >
              <Play size={18} fill="currentColor" /> Comenzar reto · 03:00
            </button>
          </form>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '19px' }}>
            <button
              type="button"
              className="btn"
              onClick={() => setShowHowToScoreModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <HelpCircle size={15} color="var(--primary)" /> ¿Cómo se puntúa?
            </button>

            <button
              type="button"
              className="btn"
              onClick={() => setShowAdminMenu(!showAdminMenu)}
              style={{ color: 'var(--text-muted)', fontSize: '11px' }}
            >
              ⚙ Administración
            </button>
          </div>
        </div>

        {/* Administration Box if opened */}
        {showAdminMenu && (
          <div
            style={{
              background: '#fff',
              border: '1px dashed var(--border-strong)',
              borderRadius: '8px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              animation: 'fadeIn 0.15s ease',
            }}
          >
            <div>
              <strong style={{ fontSize: '13px' }}>Panel de administración local del stand</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Uso exclusivo para facilitadores: reiniciar la clasificación local del ordenador.
              </div>
            </div>
            <button className="btn danger" onClick={handleClearRanking}>
              <Trash2 size={14} /> Borrar ranking Top 10
            </button>
          </div>
        )}

        {/* 3 Key Educational Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>
              <Archive size={20} /> Archivar no libera espacio
            </div>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Archivar clasifica y despeja la vista, pero los archivos y adjuntos continúan ocupando exactamente los mismos bytes en la infraestructura de almacenamiento.
            </p>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--amber)', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>
              <Trash2 size={20} /> La Papelera sigue ocupando
            </div>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Mover a la papelera es un paso intermedio y reversible. Los datos se liberan únicamente cuando se ejecuta el borrado definitivo de elementos huérfanos.
            </p>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--green)', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>
              <Shield size={20} /> Conservar lo importante puntúa
            </div>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Borrar a ciegas penaliza duramente (-200 puntos). La gestión responsable protege documentos únicos, actas oficiales, eventos futuros y contactos clave.
            </p>
          </div>
        </div>

        {/* Modules summary & Local Ranking grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
          {/* Modules Overview */}
          <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid var(--border-light)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 700 }}>
              Cuatro módulos interconectados
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px', padding: '12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                <Mail size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '13px' }}>Correo</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    320 mensajes: boletines, justificantes, phishing y borradores con adjuntos pesados.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', padding: '12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                <FileText size={24} color="#107c41" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '13px' }}>Archivos / OneDrive</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    120 archivos en 18 carpetas: copias repetidas, versiones obsoletas y enlaces compartidos.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', padding: '12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                <Calendar size={24} color="#8764b8" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '13px' }}>Calendario</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    48 eventos: reuniones canceladas, duplicados y series recurrentes finalizadas.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', padding: '12px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                <Users size={24} color="#008272" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '13px' }}>Contactos</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    64 contactos con asistente de fusión para unificar fichas sin perder datos clave.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ranking Top 10 */}
          <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid var(--border-light)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '14px' }}>
                <Award size={18} color="#e5a903" /> Top 10 Local
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Este ordenador</span>
            </div>

            {ranking.length === 0 ? (
              <div style={{ padding: '24px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12.5px' }}>
                Aún no hay partidas registradas.<br />¡Sé la primera persona en jugar!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {ranking.slice(0, 5).map((entry, idx) => (
                  <div
                    key={entry.id + idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 8px',
                      background: idx === 0 ? '#faf6ea' : 'var(--bg-subtle)',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, width: '18px', color: idx === 0 ? '#e5a903' : 'var(--text-muted)' }}>
                        #{idx + 1}
                      </span>
                      <span style={{ fontWeight: 600 }}>{entry.alias}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 600 }}>
                        {formatBytes(entry.freedBytes)}
                      </span>
                      <strong style={{ color: 'var(--primary)' }}>{entry.score} pts</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer footer */}
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px', marginTop: '10px' }}>
          Simulación educativa independiente · No es un producto de Microsoft ni se conecta a Microsoft 365.
          <br />
          Todos los datos, nombres y archivos representados son estrictamente ficticios.
        </div>
      </div>

      {/* How To Score Modal */}
      {showHowToScoreModal && (
        <div className="modal-overlay" onClick={() => setShowHowToScoreModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3>Sistema de puntuación y aprendizaje</h3>
              <button className="btn icon-only" onClick={() => setShowHowToScoreModal(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ fontSize: '13px', lineHeight: 1.6 }}>
              <p style={{ margin: '0 0 14px 0' }}>
                Cada caso del catálogo pedagógico cuenta con una matriz de decisión explícita.
                La puntuación premia la calidad del criterio aplicado:
              </p>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-default)' }}>
                    <th style={{ padding: '8px' }}>Nivel</th>
                    <th style={{ padding: '8px' }}>Puntos</th>
                    <th style={{ padding: '8px' }}>Criterio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '8px', fontWeight: 700, color: 'var(--green)' }}>Óptima</td>
                    <td style={{ padding: '8px', fontWeight: 800 }}>+100</td>
                    <td style={{ padding: '8px' }}>Mejor práctica: elimina la copia redundante conservando la canónica o resuelve con enlace.</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '8px', fontWeight: 700, color: '#107c41' }}>Buena / Segura</td>
                    <td style={{ padding: '8px', fontWeight: 800 }}>+60</td>
                    <td style={{ padding: '8px' }}>Mejora clara (ej. archivar justificante en su carpeta oficial).</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '8px', fontWeight: 700, color: 'var(--primary)' }}>Parcial</td>
                    <td style={{ padding: '8px', fontWeight: 800 }}>+30</td>
                    <td style={{ padding: '8px' }}>Decisión segura (ej. mover a «Revisar antes de eliminar» cuando no hay certeza).</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '8px', fontWeight: 700, color: 'var(--text-muted)' }}>Neutral</td>
                    <td style={{ padding: '8px', fontWeight: 800 }}>0</td>
                    <td style={{ padding: '8px' }}>Acción rutinaria o no evaluada; mover a Papelera es un paso intermedio que no puntúa.</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '8px', fontWeight: 700, color: 'var(--amber)' }}>Perjudicial</td>
                    <td style={{ padding: '8px', fontWeight: 800 }}>-100</td>
                    <td style={{ padding: '8px' }}>Pérdida evitable, archivar spam o mala organización con riesgo.</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', fontWeight: 700, color: 'var(--red)' }}>Crítica</td>
                    <td style={{ padding: '8px', fontWeight: 800 }}>-200</td>
                    <td style={{ padding: '8px' }}>Eliminación irreversible de documentos únicos, actas firmadas o reuniones vigentes.</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ background: '#eef9f2', padding: '12px', borderRadius: '6px', border: '1px solid #c3e6cb' }}>
                <strong style={{ color: 'var(--green)' }}>Bonus de Racha consecutiva:</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
                  Cada resolución positiva consecutiva suma +10 puntos de bonificación (hasta un máximo de +50 adicionales por caso).
                  Una decisión neutral o negativa reinicia la racha a cero.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn primary" onClick={() => setShowHowToScoreModal(false)}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

