import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Repeat,
  Trash2,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useGame } from '../../game/GameContext';
import { CalendarEvent } from '../../domain/types';

interface CalendarViewProps {
  viewMode: 'day' | 'week' | 'month' | 'agenda';
  onChangeViewMode: (mode: 'day' | 'week' | 'month' | 'agenda') => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  viewMode,
  onChangeViewMode,
}) => {
  const {
    dataset,
    globalSearchQuery,
    respondToInvitation,
    cancelOwnedEvent,
    removeEventFromPersonalCalendar,
    deleteCalendarEvent,
    showConfirmDialog,
  } = useGame();

  // Fixed scenario reference date: 2026-11-09 (Monday)
  const SCENARIO_DATE = '2026-11-09';
  const [currentDate, setCurrentDate] = useState<string>(SCENARIO_DATE);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Filter events
  const events = useMemo(() => {
    let list = dataset.calendarEvents.filter((e) => e.status !== 'deleted' && !e.removedFromPersonal);

    if (globalSearchQuery.trim()) {
      const q = globalSearchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          (e.location && e.location.toLowerCase().includes(q))
      );
    }

    return list.slice().sort((a, b) => a.startAt.localeCompare(b.startAt));
  }, [dataset.calendarEvents, globalSearchQuery]);

  // Date Navigation
  const handleNav = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentDate(SCENARIO_DATE);
      return;
    }

    const d = new Date(currentDate);
    if (viewMode === 'day') {
      d.setDate(d.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      d.setMonth(d.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(d.toISOString().slice(0, 10));
  };

  // Week days calculation around currentDate (starting Monday)
  const weekDays = useMemo(() => {
    const base = new Date(currentDate);
    const dayOfWeek = base.getDay(); // 0 is Sunday, 1 is Monday...
    const diff = base.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(base.setDate(diff));

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  }, [currentDate]);

  // Hourly slots (08:00 to 20:00)
  const hours = Array.from({ length: 13 }, (_, i) => i + 8);

  const getEventsForDay = (dateStr: string) => {
    return events.filter((e) => e.startAt.startsWith(dateStr));
  };

  const getEventsForHourAndDay = (dateStr: string, hour: number) => {
    const hourPrefix = `${dateStr}T${hour.toString().padStart(2, '0')}`;
    return events.filter((e) => e.startAt.startsWith(hourPrefix));
  };

  // Actions
  const handleCancelEvent = (ev: CalendarEvent) => {
    showConfirmDialog({
      title: 'Cancelar reunión institucional',
      message: `¿Deseas cancelar "${ev.title}" notificando a todos los convocados?`,
      details: [
        'Eres el organizador de este evento.',
        ev.recurrence ? 'Este evento forma parte de una serie recurrente.' : 'Se enviará aviso de cancelación simulado a los asistentes.',
      ],
      warningNotice: ev.scoringCaseId === 'CAL-003' ? '¡PELIGRO! Cancelar una reunión obligatoria vigente restará -200 puntos.' : undefined,
      confirmLabel: 'Cancelar reunión',
      isDanger: true,
      onConfirm: () => {
        cancelOwnedEvent(ev.id, 'series');
        setSelectedEvent(null);
      },
    });
  };

  const handleRemovePersonal = (ev: CalendarEvent) => {
    showConfirmDialog({
      title: 'Eliminar de mi calendario personal',
      message: `¿Deseas retirar "${ev.title}" de tu vista personal?`,
      details: [
        'Esta acción solo afecta a tu calendario, no cancela la reunión para los demás asistentes.',
      ],
      confirmLabel: 'Retirar de mi calendario',
      isDanger: false,
      onConfirm: () => {
        removeEventFromPersonalCalendar(ev.id, 'occurrence');
        setSelectedEvent(null);
      },
    });
  };

  const handleDeleteRecurring = (ev: CalendarEvent, scope: 'occurrence' | 'series') => {
    showConfirmDialog({
      title: scope === 'series' ? 'Eliminar toda la serie recurrente' : 'Eliminar solo esta ocurrencia',
      message: `¿Deseas eliminar ${scope === 'series' ? 'toda la serie' : 'únicamente esta ocurrencia duplicada'} de "${ev.title}"?`,
      warningNotice: scope === 'series' && ev.scoringCaseId === 'CAL-008' ? '¡PELIGRO! Esta serie está activa. Eliminar toda la serie en lugar de la ocurrencia duplicada restará -200 puntos.' : undefined,
      confirmLabel: scope === 'series' ? 'Eliminar toda la serie' : 'Eliminar ocurrencia',
      isDanger: true,
      onConfirm: () => {
        deleteCalendarEvent(ev.id, scope);
        setSelectedEvent(null);
      },
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Top Header & Navigation */}
      <div
        style={{
          padding: '10px 16px',
          borderBottom: '1px solid var(--border-default)',
          background: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button className="btn icon-only" onClick={() => handleNav('prev')} aria-label="Rango anterior">
              <ChevronLeft size={16} />
            </button>
            <button className="btn" onClick={() => handleNav('today')}>
              Hoy (9 nov)
            </button>
            <button className="btn icon-only" onClick={() => handleNav('next')} aria-label="Rango siguiente">
              <ChevronRight size={16} />
            </button>
          </div>

          <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {viewMode === 'day'
              ? `Día: ${currentDate}`
              : viewMode === 'week'
              ? `Semana del ${weekDays[0]} al ${weekDays[6]}`
              : viewMode === 'month'
              ? `Mes de noviembre 2026`
              : 'Agenda de eventos'}
          </h2>
          <span style={{ fontSize: '11px', background: '#eff6fc', color: 'var(--primary)', padding: '2px 7px', borderRadius: '4px', fontWeight: 600 }}>
            Entorno congelado: nov 2026
          </span>
        </div>

        {/* View Switcher Buttons */}
        <div style={{ display: 'flex', border: '1px solid var(--border-default)', borderRadius: '4px', overflow: 'hidden' }}>
          {(['day', 'week', 'month', 'agenda'] as const).map((mode) => (
            <button
              key={mode}
              className="btn"
              onClick={() => onChangeViewMode(mode)}
              style={{
                borderRadius: 0,
                border: 'none',
                background: viewMode === mode ? 'var(--primary-light)' : '#fff',
                color: viewMode === mode ? 'var(--primary)' : 'var(--text-primary)',
                fontWeight: viewMode === mode ? 700 : 500,
                fontSize: '12px',
                padding: '6px 12px',
              }}
            >
              {mode === 'day' ? 'Día' : mode === 'week' ? 'Semana' : mode === 'month' ? 'Mes' : 'Agenda'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Calendar View Area */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* ===================== DAY VIEW ===================== */}
        {viewMode === 'day' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-default)', fontWeight: 700 }}>
              Agenda horaria del {currentDate}
            </div>

            {hours.map((hour) => {
              const hourEvents = getEventsForHourAndDay(currentDate, hour);
              const label = `${hour.toString().padStart(2, '0')}:00`;

              return (
                <div
                  key={hour}
                  style={{
                    display: 'flex',
                    borderBottom: '1px solid var(--border-light)',
                    minHeight: '52px',
                  }}
                >
                  <div style={{ width: '70px', padding: '8px 12px', fontSize: '11.5px', color: 'var(--text-muted)', borderRight: '1px solid var(--border-light)' }}>
                    {label}
                  </div>

                  <div style={{ flex: 1, padding: '4px 8px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {hourEvents.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        style={{
                          background: ev.status === 'cancelled' ? '#fdf2f2' : '#edf5fc',
                          borderLeft: `4px solid ${ev.status === 'cancelled' ? 'var(--red)' : 'var(--primary)'}`,
                          borderRadius: '4px',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{ev.title}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {ev.location || 'Campus'} · {ev.currentUserRole === 'organizer' ? 'Organizador' : 'Asistente'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===================== WEEK VIEW ===================== */}
        {viewMode === 'week' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: '800px' }}>
            {/* Day columns header */}
            <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-default)' }}>
              <div style={{ borderRight: '1px solid var(--border-light)' }}></div>
              {weekDays.map((dateStr, idx) => {
                const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                const isScenario = dateStr === SCENARIO_DATE;

                return (
                  <div
                    key={dateStr}
                    style={{
                      padding: '8px 4px',
                      textAlign: 'center',
                      borderRight: '1px solid var(--border-light)',
                      background: isScenario ? '#edf5fc' : 'transparent',
                    }}
                  >
                    <div style={{ fontSize: '11px', color: isScenario ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700 }}>
                      {dayNames[idx]}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: isScenario ? 'var(--primary)' : 'var(--text-primary)' }}>
                      {dateStr.slice(8, 10)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hourly grid */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {hours.map((hour) => (
                <div
                  key={hour}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px repeat(7, 1fr)',
                    borderBottom: '1px solid var(--border-light)',
                    minHeight: '48px',
                  }}
                >
                  <div style={{ padding: '4px 6px', fontSize: '11px', color: 'var(--text-muted)', borderRight: '1px solid var(--border-light)', textAlign: 'right' }}>
                    {hour}:00
                  </div>

                  {weekDays.map((dateStr) => {
                    const cellEvents = getEventsForHourAndDay(dateStr, hour);
                    return (
                      <div
                        key={dateStr}
                        style={{
                          borderRight: '1px solid var(--border-light)',
                          padding: '2px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                        }}
                      >
                        {cellEvents.map((ev) => (
                          <div
                            key={ev.id}
                            onClick={() => setSelectedEvent(ev)}
                            style={{
                              background: ev.status === 'cancelled' ? '#fde7e9' : '#0078d4',
                              color: ev.status === 'cancelled' ? 'var(--red)' : '#fff',
                              borderRadius: '3px',
                              padding: '2px 5px',
                              fontSize: '10.5px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            title={`${ev.title} (${ev.startAt.slice(11, 16)})`}
                          >
                            {ev.title}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== MONTH VIEW ===================== */}
        {viewMode === 'month' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border-default)' }}>
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
              <div key={d} style={{ padding: '8px', textAlign: 'center', background: 'var(--bg-subtle)', fontWeight: 700, fontSize: '11.5px', borderRight: '1px solid var(--border-light)' }}>
                {d}
              </div>
            ))}

            {/* Days in November 2026 (Nov 1 is Sunday, so 6 leading empty cells) */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`empty-${i}`} style={{ minHeight: '90px', background: '#fafafa', borderRight: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}></div>
            ))}

            {Array.from({ length: 30 }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `2026-11-${dayNum.toString().padStart(2, '0')}`;
              const dayEvents = getEventsForDay(dateStr);
              const isToday = dateStr === SCENARIO_DATE;

              return (
                <div
                  key={dateStr}
                  style={{
                    minHeight: '90px',
                    padding: '4px 6px',
                    borderRight: '1px solid var(--border-light)',
                    borderBottom: '1px solid var(--border-light)',
                    background: isToday ? '#edf5fc' : '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontWeight: isToday ? 800 : 600, fontSize: '12px', color: isToday ? 'var(--primary)' : 'var(--text-primary)' }}>
                      {dayNum} {isToday && '(Hoy)'}
                    </span>
                    {dayEvents.length > 0 && (
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{dayEvents.length}</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
                    {dayEvents.slice(0, 3).map((ev) => (
                      <div
                        key={ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        style={{
                          background: ev.status === 'cancelled' ? '#fde7e9' : '#0078d4',
                          color: ev.status === 'cancelled' ? 'var(--red)' : '#fff',
                          borderRadius: '2px',
                          padding: '2px 4px',
                          fontSize: '10px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>+{dayEvents.length - 3} más</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===================== AGENDA VIEW ===================== */}
        {viewMode === 'agenda' && (
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {events.map((ev) => (
              <div
                key={ev.id}
                onClick={() => setSelectedEvent(ev)}
                style={{
                  background: '#fff',
                  borderRadius: '6px',
                  border: '1px solid var(--border-light)',
                  borderLeft: `4px solid ${ev.status === 'cancelled' ? 'var(--red)' : 'var(--primary)'}`,
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{ev.title}</span>
                    {ev.status === 'cancelled' && <span className="badge danger">Cancelado</span>}
                    {ev.recurrence && <span className="badge primary"><Repeat size={12} /> Recurrente</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {ev.startAt.replace('T', ' ')} — {ev.location || 'Campus'} · {ev.currentUserRole === 'organizer' ? 'Organizador' : 'Asistente'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`badge ${ev.response === 'accepted' ? 'success' : ev.response === 'declined' ? 'danger' : 'warning'}`}>
                    {ev.response === 'accepted' ? 'Aceptada' : ev.response === 'declined' ? 'Rechazada' : 'Pendiente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===================== EVENT DETAIL MODAL ===================== */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarIcon size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{selectedEvent.title}</h3>
              </div>
              <button className="btn icon-only" onClick={() => setSelectedEvent(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {selectedEvent.status === 'cancelled' && (
                <div style={{ background: '#fdf2f2', color: 'var(--red)', padding: '10px 14px', borderRadius: '4px', border: '1px solid #f5c6cb', fontSize: '12.5px', fontWeight: 600 }}>
                  ⚠️ Esta reunión ha sido formalmente cancelada. Sigue apareciendo en tu vista personal.
                </div>
              )}

              <div style={{ background: 'var(--bg-subtle)', padding: '12px 14px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><strong>Horario:</strong> {selectedEvent.startAt.replace('T', ' ')} a {selectedEvent.endAt.slice(11, 16)}</div>
                <div><strong>Ubicación:</strong> {selectedEvent.location || 'Online / Aula Central'}</div>
                <div><strong>Tu rol:</strong> {selectedEvent.currentUserRole === 'organizer' ? 'Organizador del evento' : 'Asistente invitado'}</div>
                <div><strong>Estado de tu respuesta:</strong> {selectedEvent.response}</div>
                {selectedEvent.recurrence && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 600 }}>
                    <Repeat size={14} /> Serie semanal recurrente
                  </div>
                )}
              </div>

              <div style={{ fontSize: '13px', lineHeight: 1.5 }}>
                {selectedEvent.description}
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {selectedEvent.currentUserRole === 'organizer' ? (
                  <button className="btn danger" onClick={() => handleCancelEvent(selectedEvent)}>
                    Cancelar reunión para todos
                  </button>
                ) : (
                  <>
                    <button className="btn" onClick={() => respondToInvitation(selectedEvent.id, 'accepted')}>
                      Aceptar
                    </button>
                    <button className="btn" onClick={() => respondToInvitation(selectedEvent.id, 'tentative')}>
                      Provisional
                    </button>
                    <button className="btn danger" onClick={() => respondToInvitation(selectedEvent.id, 'decline')}>
                      Rechazar
                    </button>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {selectedEvent.recurrence ? (
                  <>
                    <button className="btn danger" onClick={() => handleDeleteRecurring(selectedEvent, 'occurrence')}>
                      Borrar ocurrencia
                    </button>
                    <button className="btn danger-solid" onClick={() => handleDeleteRecurring(selectedEvent, 'series')}>
                      Borrar serie entera
                    </button>
                  </>
                ) : (
                  <button className="btn" onClick={() => handleRemovePersonal(selectedEvent)}>
                    Quitar de mi calendario
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

