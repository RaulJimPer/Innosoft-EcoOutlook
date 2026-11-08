import React, { useEffect, useRef } from 'react';
import { Clock, Flame, LogOut, Search } from 'lucide-react';
import { useGame } from '../../game/GameContext';

export const TopBar: React.FC = () => {
  const {
    session,
    remainingMs,
    finishGame,
    globalSearchQuery,
    setGlobalSearchQuery,
    showConfirmDialog,
  } = useGame();

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Format mm:ss
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isUrgent = totalSeconds <= 30;

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFinishClick = () => {
    showConfirmDialog({
      title: 'Finalizar reto anticipadamente',
      message: '¿Deseas finalizar la partida actual y registrar tu resultado?',
      details: [
        `Puntuación acumulada: ${session.score} puntos`,
        `Casos resueltos: ${session.casesResolved} de 73`,
        'No se otorga bonificación adicional por terminar antes de los 3 minutos.',
      ],
      confirmLabel: 'Finalizar ahora',
      isDanger: false,
      onConfirm: () => finishGame('voluntary'),
    });
  };

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        backgroundColor: '#fff',
        borderBottom: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '180px' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            background: 'var(--primary)',
            color: '#fff',
            borderRadius: '4px',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 800,
            fontSize: '16px',
          }}
        >
          E
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 800, fontSize: '15px', letterSpacing: '-0.2px', color: 'var(--text-primary)' }}>
            EcoOutlook
          </span>
          <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
            Simulación educativa
          </span>
        </div>
      </div>

      {/* Global Search Bar with Ctrl+K */}
      <div
        style={{
          flex: '0 1 480px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f3f2f1',
          border: '1px solid var(--border-default)',
          borderRadius: '4px',
          padding: '0 10px',
          height: '34px',
        }}
      >
        <Search size={15} color="var(--text-muted)" style={{ marginRight: '8px' }} />
        <input
          ref={searchInputRef}
          type="search"
          value={globalSearchQuery}
          onChange={(e) => setGlobalSearchQuery(e.target.value)}
          placeholder="Buscar correo o archivo (ej. has:attachment larger:10M)..."
          style={{
            width: '100%',
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '12.5px',
          }}
          aria-label="Buscar en la suite con operadores"
        />
        <kbd
          style={{
            background: '#fff',
            border: '1px solid var(--border-default)',
            borderRadius: '3px',
            fontSize: '10px',
            padding: '2px 5px',
            color: 'var(--text-muted)',
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'nowrap',
          }}
        >
          Ctrl+K
        </kbd>
      </div>

      {/* Right Topbar actions: Timer, Score, Finish */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Streak Indicator */}
        {session.currentStreak > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '999px',
              background: '#fff4e5',
              color: '#d83b01',
              fontSize: '12px',
              fontWeight: 700,
              border: '1px solid #fed9cc',
            }}
            title={`Racha activa: ${session.currentStreak} casos positivos seguidos`}
          >
            <Flame size={14} fill="#d83b01" />
            <span>Racha {session.currentStreak} (+{Math.min(session.currentStreak - 1, 5) * 10} pts)</span>
          </div>
        )}

        {/* Current Score Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '4px',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-default)',
            fontWeight: 700,
            fontSize: '13px',
            color: 'var(--primary)',
          }}
        >
          <span>Puntos:</span>
          <span style={{ fontSize: '15px', fontWeight: 800 }}>{session.score}</span>
        </div>

        {/* Countdown Timer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 14px',
            borderRadius: '999px',
            backgroundColor: isUrgent ? 'var(--red)' : '#00183b',
            color: '#fff',
            fontWeight: 800,
            fontSize: '14px',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.8px',
            transition: 'background-color 0.3s ease',
          }}
          title="Tiempo restante de la partida (180 segundos sin pausa)"
        >
          <Clock size={15} />
          <span>{formattedTime}</span>
        </div>

        {/* Voluntary Finish Button */}
        <button
          className="btn"
          onClick={handleFinishClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            fontSize: '12.5px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
          }}
        >
          <LogOut size={14} /> Finalizar reto
        </button>
      </div>
    </header>
  );
};

