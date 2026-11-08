import React from 'react';
import {
  Archive,
  Calendar,
  Clock,
  FileText,
  Folder,
  FolderPlus,
  Inbox,
  Mail,
  Send,
  Share2,
  Star,
  Trash2,
  Users,
} from 'lucide-react';
import { useGame } from '../../game/GameContext';

interface SidebarProps {
  currentMailFolderId: string;
  onSelectMailFolder: (id: string) => void;
  currentDriveFolderId: string | null;
  onSelectDriveFolder: (id: string | null) => void;
  driveFilterMode: 'all' | 'recent' | 'shared' | 'trash';
  onSelectDriveFilterMode: (mode: 'all' | 'recent' | 'shared' | 'trash') => void;
  calendarViewMode: 'day' | 'week' | 'month' | 'agenda';
  onSelectCalendarViewMode: (mode: 'day' | 'week' | 'month' | 'agenda') => void;
  contactsFilterMode: 'all' | 'favorites' | 'duplicates';
  onSelectContactsFilterMode: (mode: 'all' | 'favorites' | 'duplicates') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentMailFolderId,
  onSelectMailFolder,
  currentDriveFolderId,
  onSelectDriveFolder,
  driveFilterMode,
  onSelectDriveFilterMode,
  calendarViewMode,
  onSelectCalendarViewMode,
  contactsFilterMode,
  onSelectContactsFilterMode,
}) => {
  const { activeModule, setActiveModule, dataset } = useGame();

  // Counts for Mail folders
  const getMailCount = (folderId: string) => {
    return dataset.mailMessages.filter((m) => m.folderId === folderId && m.status !== 'deleted').length;
  };

  const getUnreadCount = (folderId: string) => {
    return dataset.mailMessages.filter((m) => m.folderId === folderId && !m.read && m.status !== 'deleted').length;
  };

  // Counts for Drive
  const activeFilesCount = dataset.driveFiles.filter((f) => f.status === 'active').length;
  const sharedFilesCount = dataset.driveFiles.filter((f) => f.status === 'active' && f.shared).length;
  const trashFilesCount = dataset.driveFiles.filter((f) => f.status === 'trash').length;

  return (
    <nav
      style={{
        width: 'var(--sidebar-width)',
        backgroundColor: '#fff',
        borderRight: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - var(--topbar-height))',
        flexShrink: 0,
      }}
      aria-label="Navegación principal de módulos y carpetas"
    >
      {/* Primary Module Switcher */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderBottom: '1px solid var(--border-default)',
          background: 'var(--bg-subtle)',
          padding: '4px',
          gap: '2px',
        }}
      >
        <button
          className={`btn ${activeModule === 'mail' ? 'primary' : ''}`}
          onClick={() => setActiveModule('mail')}
          style={{ flexDirection: 'column', padding: '6px 2px', gap: '2px', fontSize: '10.5px' }}
          title="Correo electrónico"
        >
          <Mail size={16} />
          <span>Correo</span>
        </button>

        <button
          className={`btn ${activeModule === 'files' ? 'primary' : ''}`}
          onClick={() => setActiveModule('files')}
          style={{ flexDirection: 'column', padding: '6px 2px', gap: '2px', fontSize: '10.5px' }}
          title="Archivos y OneDrive"
        >
          <FileText size={16} />
          <span>Archivos</span>
        </button>

        <button
          className={`btn ${activeModule === 'calendar' ? 'primary' : ''}`}
          onClick={() => setActiveModule('calendar')}
          style={{ flexDirection: 'column', padding: '6px 2px', gap: '2px', fontSize: '10.5px' }}
          title="Calendario"
        >
          <Calendar size={16} />
          <span>Agenda</span>
        </button>

        <button
          className={`btn ${activeModule === 'contacts' ? 'primary' : ''}`}
          onClick={() => setActiveModule('contacts')}
          style={{ flexDirection: 'column', padding: '6px 2px', gap: '2px', fontSize: '10.5px' }}
          title="Contactos"
        >
          <Users size={16} />
          <span>Contactos</span>
        </button>
      </div>

      {/* Module-Specific Tree Navigation */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
        {/* ===================== MAIL MODULE NAVIGATION ===================== */}
        {activeModule === 'mail' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '6px 10px' }}>
              Carpetas de correo
            </div>

            <button
              className="btn"
              onClick={() => onSelectMailFolder('inbox')}
              style={{
                justifyContent: 'space-between',
                width: '100%',
                fontWeight: currentMailFolderId === 'inbox' ? 700 : 500,
                background: currentMailFolderId === 'inbox' ? 'var(--primary-light)' : 'transparent',
                color: currentMailFolderId === 'inbox' ? 'var(--primary)' : 'var(--text-primary)',
                border: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Inbox size={16} />
                <span>Bandeja de entrada</span>
              </div>
              {getUnreadCount('inbox') > 0 ? (
                <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '11px' }}>
                  {getUnreadCount('inbox')}
                </span>
              ) : (
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{getMailCount('inbox')}</span>
              )}
            </button>

            <button
              className="btn"
              onClick={() => onSelectMailFolder('sent')}
              style={{
                justifyContent: 'space-between',
                width: '100%',
                fontWeight: currentMailFolderId === 'sent' ? 700 : 500,
                background: currentMailFolderId === 'sent' ? 'var(--primary-light)' : 'transparent',
                color: currentMailFolderId === 'sent' ? 'var(--primary)' : 'var(--text-primary)',
                border: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={16} />
                <span>Elementos enviados</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{getMailCount('sent')}</span>
            </button>

            <button
              className="btn"
              onClick={() => onSelectMailFolder('drafts')}
              style={{
                justifyContent: 'space-between',
                width: '100%',
                fontWeight: currentMailFolderId === 'drafts' ? 700 : 500,
                background: currentMailFolderId === 'drafts' ? 'var(--primary-light)' : 'transparent',
                color: currentMailFolderId === 'drafts' ? 'var(--primary)' : 'var(--text-primary)',
                border: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} />
                <span>Borradores</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{getMailCount('drafts')}</span>
            </button>

            <button
              className="btn"
              onClick={() => onSelectMailFolder('archive')}
              style={{
                justifyContent: 'space-between',
                width: '100%',
                fontWeight: currentMailFolderId === 'archive' ? 700 : 500,
                background: currentMailFolderId === 'archive' ? 'var(--primary-light)' : 'transparent',
                color: currentMailFolderId === 'archive' ? 'var(--primary)' : 'var(--text-primary)',
                border: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Archive size={16} />
                <span>Archivados</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{getMailCount('archive')}</span>
            </button>

            {/* Subfolders of archive */}
            <div style={{ marginLeft: '14px', borderLeft: '1px solid var(--border-light)', paddingLeft: '6px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <button
                className="btn"
                onClick={() => onSelectMailFolder('archive_admin')}
                style={{
                  justifyContent: 'space-between',
                  width: '100%',
                  fontSize: '12px',
                  fontWeight: currentMailFolderId === 'archive_admin' ? 700 : 400,
                  background: currentMailFolderId === 'archive_admin' ? 'var(--primary-light)' : 'transparent',
                  color: currentMailFolderId === 'archive_admin' ? 'var(--primary)' : 'var(--text-secondary)',
                  border: 'none',
                }}
              >
                <span>Administración</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>{getMailCount('archive_admin')}</span>
              </button>

              <button
                className="btn"
                onClick={() => onSelectMailFolder('archive_actas')}
                style={{
                  justifyContent: 'space-between',
                  width: '100%',
                  fontSize: '12px',
                  fontWeight: currentMailFolderId === 'archive_actas' ? 700 : 400,
                  background: currentMailFolderId === 'archive_actas' ? 'var(--primary-light)' : 'transparent',
                  color: currentMailFolderId === 'archive_actas' ? 'var(--primary)' : 'var(--text-secondary)',
                  border: 'none',
                }}
              >
                <span>Actas</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>{getMailCount('archive_actas')}</span>
              </button>

              <button
                className="btn"
                onClick={() => onSelectMailFolder('archive_informes')}
                style={{
                  justifyContent: 'space-between',
                  width: '100%',
                  fontSize: '12px',
                  fontWeight: currentMailFolderId === 'archive_informes' ? 700 : 400,
                  background: currentMailFolderId === 'archive_informes' ? 'var(--primary-light)' : 'transparent',
                  color: currentMailFolderId === 'archive_informes' ? 'var(--primary)' : 'var(--text-secondary)',
                  border: 'none',
                }}
              >
                <span>Informes históricos</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>{getMailCount('archive_informes')}</span>
              </button>

              <button
                className="btn"
                onClick={() => onSelectMailFolder('archive_proyectos')}
                style={{
                  justifyContent: 'space-between',
                  width: '100%',
                  fontSize: '12px',
                  fontWeight: currentMailFolderId === 'archive_proyectos' ? 700 : 400,
                  background: currentMailFolderId === 'archive_proyectos' ? 'var(--primary-light)' : 'transparent',
                  color: currentMailFolderId === 'archive_proyectos' ? 'var(--primary)' : 'var(--text-secondary)',
                  border: 'none',
                }}
              >
                <span>Proyectos cerrados</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>{getMailCount('archive_proyectos')}</span>
              </button>

              <button
                className="btn"
                onClick={() => onSelectMailFolder('archive_revisar')}
                style={{
                  justifyContent: 'space-between',
                  width: '100%',
                  fontSize: '12px',
                  fontWeight: currentMailFolderId === 'archive_revisar' ? 700 : 400,
                  background: currentMailFolderId === 'archive_revisar' ? 'var(--primary-light)' : 'transparent',
                  color: currentMailFolderId === 'archive_revisar' ? 'var(--primary)' : 'var(--text-secondary)',
                  border: 'none',
                }}
              >
                <span>Revisar antes de eliminar</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>{getMailCount('archive_revisar')}</span>
              </button>
            </div>

            <button
              className="btn"
              onClick={() => onSelectMailFolder('junk')}
              style={{
                justifyContent: 'space-between',
                width: '100%',
                fontWeight: currentMailFolderId === 'junk' ? 700 : 500,
                background: currentMailFolderId === 'junk' ? 'var(--primary-light)' : 'transparent',
                color: currentMailFolderId === 'junk' ? 'var(--primary)' : 'var(--text-primary)',
                border: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px' }}>⚠️</span>
                <span>Correo no deseado</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{getMailCount('junk')}</span>
            </button>

            <button
              className="btn"
              onClick={() => onSelectMailFolder('trash')}
              style={{
                justifyContent: 'space-between',
                width: '100%',
                fontWeight: currentMailFolderId === 'trash' ? 700 : 500,
                background: currentMailFolderId === 'trash' ? 'var(--primary-light)' : 'transparent',
                color: currentMailFolderId === 'trash' ? 'var(--primary)' : 'var(--text-primary)',
                border: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trash2 size={16} />
                <span>Papelera</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{getMailCount('trash')}</span>
            </button>
          </div>
        )}

        {/* ===================== FILES MODULE NAVIGATION ===================== */}
        {activeModule === 'files' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '6px 10px' }}>
              OneDrive / Archivos
            </div>

            <button
              className="btn"
              onClick={() => {
                onSelectDriveFilterMode('all');
                onSelectDriveFolder(null);
              }}
              style={{
                justifyContent: 'space-between',
                width: '100%',
                fontWeight: driveFilterMode === 'all' && currentDriveFolderId === null ? 700 : 500,
                background: driveFilterMode === 'all' && currentDriveFolderId === null ? 'var(--primary-light)' : 'transparent',
                color: driveFilterMode === 'all' && currentDriveFolderId === null ? 'var(--primary)' : 'var(--text-primary)',
                border: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Folder size={16} color="var(--primary)" />
                <span>Mis archivos</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{activeFilesCount}</span>
            </button>

            <button
              className="btn"
              onClick={() => {
                onSelectDriveFilterMode('shared');
                onSelectDriveFolder(null);
              }}
              style={{
                justifyContent: 'space-between',
                width: '100%',
                fontWeight: driveFilterMode === 'shared' ? 700 : 500,
                background: driveFilterMode === 'shared' ? 'var(--primary-light)' : 'transparent',
                color: driveFilterMode === 'shared' ? 'var(--primary)' : 'var(--text-primary)',
                border: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Share2 size={16} />
                <span>Compartidos</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{sharedFilesCount}</span>
            </button>

            <button
              className="btn"
              onClick={() => {
                onSelectDriveFilterMode('trash');
                onSelectDriveFolder(null);
              }}
              style={{
                justifyContent: 'space-between',
                width: '100%',
                fontWeight: driveFilterMode === 'trash' ? 700 : 500,
                background: driveFilterMode === 'trash' ? 'var(--primary-light)' : 'transparent',
                color: driveFilterMode === 'trash' ? 'var(--primary)' : 'var(--text-primary)',
                border: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trash2 size={16} />
                <span>Papelera de archivos</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{trashFilesCount}</span>
            </button>

            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '12px 10px 4px 10px' }}>
              Carpetas de usuario (18)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {dataset.driveFolders.map((f) => {
                const count = dataset.driveFiles.filter((file) => file.folderId === f.id && file.status === 'active').length;
                const isSelected = currentDriveFolderId === f.id && driveFilterMode === 'all';

                return (
                  <button
                    key={f.id}
                    className="btn"
                    onClick={() => {
                      onSelectDriveFilterMode('all');
                      onSelectDriveFolder(f.id);
                    }}
                    style={{
                      justifyContent: 'space-between',
                      width: '100%',
                      fontSize: '12px',
                      fontWeight: isSelected ? 700 : 400,
                      background: isSelected ? 'var(--primary-light)' : 'transparent',
                      color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                      border: 'none',
                      padding: '5px 10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Folder size={14} color="#f0b400" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== CALENDAR MODULE NAVIGATION ===================== */}
        {activeModule === 'calendar' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '6px 10px' }}>
              Vistas de calendario
            </div>

            <button
              className="btn"
              onClick={() => onSelectCalendarViewMode('day')}
              style={{
                justifyContent: 'flex-start',
                width: '100%',
                fontWeight: calendarViewMode === 'day' ? 700 : 500,
                background: calendarViewMode === 'day' ? 'var(--primary-light)' : 'transparent',
                color: calendarViewMode === 'day' ? 'var(--primary)' : 'var(--text-primary)',
                border: 'none',
              }}
            >
              <span>Vista Día</span>
            </button>

            <button
              className="btn"
              onClick={() => onSelectCalendarViewMode('week')}
              style={{
                justifyContent: 'flex-start',
                width: '100%',
                fontWeight: calendarViewMode === 'week' ? 700 : 500,
                background: calendarViewMode === 'week' ? 'var(--primary-light)' : 'transparent',
                color: calendarViewMode === 'week' ? 'var(--primary)' : 'var(--text-primary)',
                border: 'none',
              }}
            >
              <span>Vista Semana</span>
            </button>

            <button
              className="btn"
              onClick={() => onSelectCalendarViewMode('month')}
              style={{
                justifyContent: 'flex-start',
                width: '100%',
                fontWeight: calendarViewMode === 'month' ? 700 : 500,
                background: calendarViewMode === 'month' ? 'var(--primary-light)' : 'transparent',
                color: calendarViewMode === 'month' ? 'var(--primary)' : 'var(--text-primary)',
                border: 'none',
              }}
            >
              <span>Vista Mes</span>
            </button>

            <button
              className="btn"
              onClick={() => onSelectCalendarViewMode('agenda')}
              style={{
                justifyContent: 'flex-start',
                width: '100%',
                fontWeight: calendarViewMode === 'agenda' ? 700 : 500,
                background: calendarViewMode === 'agenda' ? 'var(--primary-light)' : 'transparent',
                color: calendarViewMode === 'agenda' ? 'var(--primary)' : 'var(--text-primary)',
                border: 'none',
              }}
            >
              <span>Vista Agenda (Listado)</span>
            </button>

            <div style={{ marginTop: '16px', padding: '12px', background: 'var(--bg-subtle)', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Fecha ficticia del escenario
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Lunes, 9 nov 2026
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                48 eventos en el campus
              </div>
            </div>
          </div>
        )}

        {/* ===================== CONTACTS MODULE NAVIGATION ===================== */}
        {activeModule === 'contacts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '6px 10px' }}>
              Filtros de contactos
            </div>

            <button
              className="btn"
              onClick={() => onSelectContactsFilterMode('all')}
              style={{
                justifyContent: 'space-between',
                width: '100%',
                fontWeight: contactsFilterMode === 'all' ? 700 : 500,
                background: contactsFilterMode === 'all' ? 'var(--primary-light)' : 'transparent',
                color: contactsFilterMode === 'all' ? 'var(--primary)' : 'var(--text-primary)',
                border: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} />
                <span>Todos los contactos</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                {dataset.contacts.filter((c) => c.status === 'active').length}
              </span>
            </button>

            <button
              className="btn"
              onClick={() => onSelectContactsFilterMode('favorites')}
              style={{
                justifyContent: 'space-between',
                width: '100%',
                fontWeight: contactsFilterMode === 'favorites' ? 700 : 500,
                background: contactsFilterMode === 'favorites' ? 'var(--primary-light)' : 'transparent',
                color: contactsFilterMode === 'favorites' ? 'var(--primary)' : 'var(--text-primary)',
                border: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star size={16} color="#e5a903" />
                <span>Favoritos</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                {dataset.contacts.filter((c) => c.status === 'active' && c.favorite).length}
              </span>
            </button>

            <button
              className="btn"
              onClick={() => onSelectContactsFilterMode('duplicates')}
              style={{
                justifyContent: 'space-between',
                width: '100%',
                fontWeight: contactsFilterMode === 'duplicates' ? 700 : 500,
                background: contactsFilterMode === 'duplicates' ? 'var(--primary-light)' : 'transparent',
                color: contactsFilterMode === 'duplicates' ? 'var(--primary)' : 'var(--text-primary)',
                border: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} color="#d83b01" />
                <span>Posibles duplicados</span>
              </div>
              <span style={{ color: '#d83b01', fontWeight: 700, fontSize: '11px' }}>
                10 grupos
              </span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

