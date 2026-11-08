import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  FolderInput,
  Inbox,
  Link,
  Mail,
  Paperclip,
  Plus,
  RefreshCw,
  Reply,
  RotateCcw,
  Send,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { useGame } from '../../game/GameContext';
import { MailAttachment, MailMessage, Recipient } from '../../domain/types';
import { filterMessages, parseMailSearch } from '../../domain/mailSearch';
import { formatBytes } from '../../domain/storage';

interface MailViewProps {
  currentFolderId: string;
}

export const MailView: React.FC<MailViewProps> = ({ currentFolderId }) => {
  const {
    dataset,
    globalSearchQuery,
    archiveMessages,
    moveMessagesToFolder,
    moveMessagesToTrash,
    restoreMessages,
    permanentlyDeleteMessages,
    emptyMailTrash,
    markMessagesRead,
    toggleMessageStar,
    markJunk,
    removeFromJunk,
    saveAttachmentToDrive,
    replaceDraftAttachmentWithLink,
    saveDraft,
    sendMail,
    showConfirmDialog,
  } = useGame();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 50;

  // Modals state
  const [selectedMessage, setSelectedMessage] = useState<MailMessage | null>(null);
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const [composeDraft, setComposeDraft] = useState<{
    id?: string;
    to: Recipient[];
    cc: Recipient[];
    subject: string;
    body: string;
    attachmentIds: string[];
    linkedFileIds: string[];
  }>({
    to: [],
    cc: [],
    subject: '',
    body: '',
    attachmentIds: [],
    linkedFileIds: [],
  });

  const [showFolderDropdown, setShowFolderDropdown] = useState<boolean>(false);
  const [contactSearchText, setContactSearchText] = useState<string>('');
  const [showOneDrivePicker, setShowOneDrivePicker] = useState<boolean>(false);

  // Filter messages based on folder and globalSearchQuery
  const { filteredMessages, searchError } = useMemo(() => {
    let list = dataset.mailMessages.filter((m) => m.status !== 'deleted');

    if (!globalSearchQuery.trim()) {
      list = list.filter((m) => m.folderId === currentFolderId);
      return { filteredMessages: list, searchError: null };
    }

    const { query, error } = parseMailSearch(globalSearchQuery);
    if (error) {
      return { filteredMessages: [], searchError: error };
    }

    if (query) {
      list = filterMessages(list, dataset.mailAttachments, query, currentFolderId);
    }

    return { filteredMessages: list, searchError: null };
  }, [dataset.mailMessages, dataset.mailAttachments, currentFolderId, globalSearchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / pageSize));
  const pageMessages = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMessages.slice(start, start + pageSize);
  }, [filteredMessages, currentPage]);

  // Selection handlers
  const handleSelectAllPage = (checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) {
      pageMessages.forEach((m) => next.add(m.id));
    } else {
      pageMessages.forEach((m) => next.delete(m.id));
    }
    setSelectedIds(next);
  };

  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleOpenMessage = (msg: MailMessage) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      markMessagesRead([msg.id], true);
    }
  };

  // Actions
  const handleArchiveSelected = () => {
    archiveMessages(Array.from(selectedIds));
    setSelectedIds(new Set());
    if (selectedMessage) setSelectedMessage(null);
  };

  const handleTrashSelected = () => {
    moveMessagesToTrash(Array.from(selectedIds));
    setSelectedIds(new Set());
    if (selectedMessage) setSelectedMessage(null);
  };

  const handleRestoreSelected = () => {
    restoreMessages(Array.from(selectedIds));
    setSelectedIds(new Set());
    if (selectedMessage) setSelectedMessage(null);
  };

  const handleDeleteForeverSelected = () => {
    const ids = Array.from(selectedIds);
    const msgs = dataset.mailMessages.filter((m) => ids.includes(m.id));
    const hasImportant = msgs.some((m) => m.important);

    showConfirmDialog({
      title: 'Eliminar definitivamente',
      message: `¿Estás seguro de que deseas eliminar permanentemente ${ids.length} mensaje(s)?`,
      details: [
        'Esta acción es irreversible dentro de la partida.',
        hasImportant ? '¡ADVERTENCIA! Se han detectado documentos probatorios o mensajes importantes.' : 'Se liberará el almacenamiento de los adjuntos que no tengan otras referencias.',
      ],
      warningNotice: hasImportant ? 'La eliminación irreversible de información clave restará hasta -200 puntos.' : undefined,
      confirmLabel: 'Eliminar definitivamente',
      isDanger: true,
      onConfirm: () => {
        permanentlyDeleteMessages(ids);
        setSelectedIds(new Set());
        if (selectedMessage) setSelectedMessage(null);
      },
    });
  };

  const handleEmptyTrash = () => {
    const trashMsgs = dataset.mailMessages.filter((m) => m.folderId === 'trash' && m.status !== 'deleted');
    const hasImportant = trashMsgs.some((m) => m.important);

    showConfirmDialog({
      title: 'Vaciar completamente la papelera',
      message: `Se eliminarán permanentemente los ${trashMsgs.length} mensajes de la papelera.`,
      warningNotice: hasImportant ? 'La papelera contiene justificantes únicos o actas. Vaciar todo destruirá esos documentos.' : undefined,
      confirmLabel: 'Vaciar papelera',
      isDanger: true,
      onConfirm: () => {
        emptyMailTrash();
        setSelectedIds(new Set());
        if (selectedMessage) setSelectedMessage(null);
      },
    });
  };

  // Composer opening
  const handleStartCompose = () => {
    setComposeDraft({
      to: [],
      cc: [],
      subject: '',
      body: '',
      attachmentIds: [],
      linkedFileIds: [],
    });
    setIsComposing(true);
  };

  const handleReplyMessage = (msg: MailMessage, replyAll: boolean) => {
    const senderContact = dataset.contacts.find((c) => c.id === msg.senderContactId);
    const toList: Recipient[] = [
      {
        contactId: msg.senderContactId,
        displayName: msg.senderNameSnapshot,
        email: msg.senderEmailSnapshot,
      },
    ];

    const ccList: Recipient[] = replyAll ? [...msg.cc] : [];

    setComposeDraft({
      to: toList,
      cc: ccList,
      subject: msg.subject.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`,
      body: `\n\n--- En respuesta a ${msg.senderNameSnapshot} (${msg.sentAt.slice(0, 10)}) ---\n${msg.body}`,
      attachmentIds: [],
      linkedFileIds: [],
    });
    setSelectedMessage(null);
    setIsComposing(true);
  };

  const folderTitle = useMemo(() => {
    const f = dataset.mailFolders.find((folder) => folder.id === currentFolderId);
    return f ? f.name : 'Bandeja';
  }, [dataset.mailFolders, currentFolderId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Search Error Alert */}
      {searchError && (
        <div style={{ background: '#fdf2f2', color: 'var(--red)', padding: '8px 16px', fontSize: '12px', borderBottom: '1px solid #f5c6cb', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={15} />
          <strong>Error de búsqueda:</strong> {searchError}
        </div>
      )}

      {/* View Header & Toolbar */}
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
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{folderTitle}</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            ({filteredMessages.length} mensaje{filteredMessages.length !== 1 ? 's' : ''})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn primary" onClick={handleStartCompose}>
            <Plus size={15} /> Nuevo correo
          </button>

          {currentFolderId === 'trash' && (
            <button className="btn danger" onClick={handleEmptyTrash}>
              <Trash2 size={15} /> Vaciar papelera
            </button>
          )}
        </div>
      </div>

      {/* Contextual Action Toolbar (visible when items are selected) */}
      <div
        style={{
          padding: '6px 16px',
          borderBottom: '1px solid var(--border-light)',
          background: selectedIds.size > 0 ? '#edf5fc' : 'var(--bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12.5px',
        }}
      >
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginRight: '8px' }}>
          <input
            type="checkbox"
            checked={pageMessages.length > 0 && pageMessages.every((m) => selectedIds.has(m.id))}
            onChange={(e) => handleSelectAllPage(e.target.checked)}
          />
          <span style={{ fontWeight: 600 }}>
            {selectedIds.size > 0 ? `${selectedIds.size} seleccionados` : 'Seleccionar página'}
          </span>
        </label>

        {selectedIds.size > 0 && (
          <>
            <button className="btn" onClick={() => markMessagesRead(Array.from(selectedIds), true)}>
              <Check size={14} /> Leído
            </button>
            <button className="btn" onClick={() => markMessagesRead(Array.from(selectedIds), false)}>
              No leído
            </button>

            {currentFolderId !== 'archive' && currentFolderId !== 'trash' && (
              <button className="btn" onClick={handleArchiveSelected} title="Archivar mensajes">
                <Archive size={14} /> Archivar
              </button>
            )}

            {/* Move to folder dropdown */}
            <div style={{ position: 'relative' }}>
              <button className="btn" onClick={() => setShowFolderDropdown(!showFolderDropdown)}>
                <FolderInput size={14} /> Mover a carpeta
              </button>
              {showFolderDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    zIndex: 100,
                    background: '#fff',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '4px',
                    padding: '4px 0',
                    minWidth: '200px',
                  }}
                >
                  {dataset.mailFolders.map((f) => (
                    <button
                      key={f.id}
                      className="btn"
                      onClick={() => {
                        moveMessagesToFolder(Array.from(selectedIds), f.id);
                        setShowFolderDropdown(false);
                        setSelectedIds(new Set());
                      }}
                      style={{ width: '100%', justifyContent: 'flex-start', border: 'none', borderRadius: 0, padding: '7px 12px' }}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {currentFolderId === 'trash' ? (
              <>
                <button className="btn" onClick={handleRestoreSelected}>
                  <RotateCcw size={14} /> Restaurar
                </button>
                <button className="btn danger-solid" onClick={handleDeleteForeverSelected}>
                  <Trash2 size={14} /> Eliminar definitivamente
                </button>
              </>
            ) : (
              <button className="btn danger" onClick={handleTrashSelected}>
                <Trash2 size={14} /> Mover a Papelera
              </button>
            )}

            {currentFolderId === 'junk' ? (
              <button className="btn" onClick={() => removeFromJunk(Array.from(selectedIds))}>
                No es correo no deseado
              </button>
            ) : (
              <button className="btn" onClick={() => markJunk(Array.from(selectedIds))}>
                Marcar no deseado
              </button>
            )}
          </>
        )}
      </div>

      {/* Messages List Table */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {pageMessages.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No se encontraron mensajes en esta vista.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <tbody>
              {pageMessages.map((msg) => {
                const isSelected = selectedIds.has(msg.id);
                const hasAttachment = msg.attachmentIds.length > 0;
                const isSentFolder = currentFolderId === 'sent';
                const displayContactName = isSentFolder
                  ? msg.to.map((r) => r.displayName).join(', ') || 'Destinatario'
                  : msg.senderNameSnapshot;

                return (
                  <tr
                    key={msg.id}
                    onClick={() => handleOpenMessage(msg)}
                    style={{
                      borderBottom: '1px solid var(--border-light)',
                      backgroundColor: isSelected ? 'var(--primary-light)' : msg.read ? '#fff' : '#f9fbfd',
                      cursor: 'pointer',
                      height: '46px',
                      transition: 'background-color 0.1s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = msg.read ? '#fff' : '#f9fbfd';
                    }}
                  >
                    {/* Checkbox column */}
                    <td style={{ width: '36px', textAlign: 'center', padding: '0 8px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onClick={(e) => handleToggleSelect(msg.id, e)}
                        onChange={() => {}}
                      />
                    </td>

                    {/* Star column */}
                    <td style={{ width: '32px', textAlign: 'center', padding: 0 }}>
                      <button
                        className="btn icon-only"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMessageStar(msg.id);
                        }}
                        style={{ border: 'none', background: 'transparent' }}
                      >
                        <Star size={16} fill={msg.starred ? '#e5a903' : 'none'} color={msg.starred ? '#e5a903' : 'var(--text-muted)'} />
                      </button>
                    </td>

                    {/* Sender / Recipient */}
                    <td style={{ width: '180px', padding: '0 10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: msg.read ? 400 : 700 }}>
                      {displayContactName}
                    </td>

                    {/* Subject + Preview */}
                    <td style={{ padding: '0 10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <span style={{ fontWeight: msg.read ? 600 : 700, color: 'var(--text-primary)' }}>
                        {msg.subject}
                      </span>
                      <span style={{ color: 'var(--text-muted)', marginLeft: '8px', fontSize: '12px' }}>
                        — {msg.preview}
                      </span>
                    </td>

                    {/* Attachments Indicator */}
                    <td style={{ width: '50px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      {hasAttachment && <Paperclip size={15} color="var(--primary)" />}
                    </td>

                    {/* Date */}
                    <td style={{ width: '90px', textAlign: 'right', padding: '0 14px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {msg.sentAt.slice(0, 10)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      <div
        style={{
          padding: '8px 16px',
          borderTop: '1px solid var(--border-light)',
          background: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--text-secondary)',
        }}
      >
        <span>
          Mostrando {filteredMessages.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-
          {Math.min(currentPage * pageSize, filteredMessages.length)} de {filteredMessages.length} mensajes
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            className="btn icon-only"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            aria-label="Página anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            className="btn icon-only"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            aria-label="Página siguiente"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ===================== MESSAGE DETAIL MODAL ===================== */}
      {selectedMessage && (
        <div className="modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px', height: '80vh' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{selectedMessage.subject}</h3>
              </div>
              <button className="btn icon-only" onClick={() => setSelectedMessage(null)}>
                <X size={16} />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div style={{ padding: '8px 20px', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button className="btn" onClick={() => handleReplyMessage(selectedMessage, false)}>
                <Reply size={14} /> Responder
              </button>
              <button className="btn" onClick={() => handleReplyMessage(selectedMessage, true)}>
                Responder a todos
              </button>
              {selectedMessage.folderId !== 'archive' && selectedMessage.folderId !== 'trash' && (
                <button
                  className="btn"
                  onClick={() => {
                    archiveMessages([selectedMessage.id]);
                    setSelectedMessage(null);
                  }}
                >
                  <Archive size={14} /> Archivar
                </button>
              )}
              {selectedMessage.folderId === 'trash' ? (
                <button
                  className="btn"
                  onClick={() => {
                    restoreMessages([selectedMessage.id]);
                    setSelectedMessage(null);
                  }}
                >
                  <RotateCcw size={14} /> Restaurar
                </button>
              ) : (
                <button
                  className="btn danger"
                  onClick={() => {
                    moveMessagesToTrash([selectedMessage.id]);
                    setSelectedMessage(null);
                  }}
                >
                  <Trash2 size={14} /> Papelera
                </button>
              )}
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Header details */}
              <div style={{ background: 'var(--bg-subtle)', padding: '12px 16px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '12.5px' }}>
                <div><strong>De:</strong> {selectedMessage.senderNameSnapshot} &lt;{selectedMessage.senderEmailSnapshot}&gt;</div>
                <div><strong>Para:</strong> {selectedMessage.to.map((r) => `${r.displayName} <${r.email}>`).join(', ')}</div>
                {selectedMessage.cc.length > 0 && (
                  <div><strong>CC:</strong> {selectedMessage.cc.map((r) => `${r.displayName} <${r.email}>`).join(', ')}</div>
                )}
                <div><strong>Fecha:</strong> {selectedMessage.sentAt.replace('T', ' ')}</div>
              </div>

              {/* Body */}
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--text-primary)', fontSize: '13.5px' }}>
                {selectedMessage.body}
              </div>

              {/* Attachments Section */}
              {selectedMessage.attachmentIds.length > 0 && (
                <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    ARCHIVOS ADJUNTOS ({selectedMessage.attachmentIds.length})
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                    {selectedMessage.attachmentIds.map((attId) => {
                      const att = dataset.mailAttachments.find((a) => a.id === attId);
                      if (!att) return null;

                      return (
                        <div
                          key={att.id}
                          style={{
                            border: '1px solid var(--border-default)',
                            borderRadius: '6px',
                            padding: '10px 12px',
                            background: 'var(--bg-subtle)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={18} color="var(--primary)" />
                            <div style={{ overflow: 'hidden' }}>
                              <div style={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {att.fileName}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {formatBytes(att.sizeBytes)} {att.isLink && '(Enlace de OneDrive)'}
                              </div>
                            </div>
                          </div>

                          {!att.isLink && (
                            <button
                              className="btn"
                              onClick={() => {
                                saveAttachmentToDrive(selectedMessage.id, att.id, dataset.driveFolders[0].id);
                              }}
                              style={{ fontSize: '11px', padding: '4px 8px' }}
                            >
                              <Download size={13} /> Guardar copia en OneDrive
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn" onClick={() => setSelectedMessage(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== COMPOSER MODAL ===================== */}
      {isComposing && (
        <div className="modal-overlay" onClick={() => setIsComposing(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div className="modal-header">
              <h3>Nuevo mensaje de correo</h3>
              <button className="btn icon-only" onClick={() => setIsComposing(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* To field with Autocomplete */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Para:</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <input
                    type="text"
                    value={contactSearchText}
                    onChange={(e) => setContactSearchText(e.target.value)}
                    placeholder="Buscar destinatario de contactos..."
                    style={{ flex: 1, padding: '7px 10px', borderRadius: '4px', border: '1px solid var(--border-default)', fontSize: '13px' }}
                  />
                  {contactSearchText && (
                    <button
                      className="btn"
                      onClick={() => {
                        const c = dataset.contacts.find((cnt) =>
                          cnt.displayName.toLowerCase().includes(contactSearchText.toLowerCase()) ||
                          cnt.email.toLowerCase().includes(contactSearchText.toLowerCase())
                        );
                        if (c) {
                          setComposeDraft((prev) => ({
                            ...prev,
                            to: [...prev.to, { contactId: c.id, displayName: c.displayName, email: c.email }],
                          }));
                          setContactSearchText('');
                        }
                      }}
                    >
                      Añadir
                    </button>
                  )}
                </div>
                {composeDraft.to.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {composeDraft.to.map((r, i) => (
                      <span key={i} className="badge primary" style={{ padding: '3px 8px' }}>
                        {r.displayName} &lt;{r.email}&gt;
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Subject */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Asunto:</label>
                <input
                  type="text"
                  value={composeDraft.subject}
                  onChange={(e) => setComposeDraft((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Asunto del correo"
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', border: '1px solid var(--border-default)', marginTop: '4px', fontSize: '13px' }}
                />
              </div>

              {/* Body */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Cuerpo del mensaje:</label>
                <textarea
                  rows={8}
                  value={composeDraft.body}
                  onChange={(e) => setComposeDraft((prev) => ({ ...prev, body: e.target.value }))}
                  placeholder="Escribe el contenido..."
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--border-default)', marginTop: '4px', fontSize: '13px' }}
                />
              </div>

              {/* Attachments in Draft */}
              <div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn" onClick={() => setShowOneDrivePicker(true)}>
                    <Link size={14} color="var(--primary)" /> Adjuntar enlace de OneDrive
                  </button>
                </div>

                {composeDraft.linkedFileIds.length > 0 && (
                  <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {composeDraft.linkedFileIds.map((fId) => {
                      const f = dataset.driveFiles.find((df) => df.id === fId);
                      return (
                        <span key={fId} className="badge success">
                          🔗 Enlace: {f?.name || fId}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn"
                onClick={() => {
                  saveDraft(composeDraft);
                  setIsComposing(false);
                }}
              >
                Guardar borrador
              </button>
              <button
                className="btn primary"
                onClick={() => {
                  const saved = saveDraft(composeDraft);
                  sendMail(saved.id);
                  setIsComposing(false);
                }}
              >
                <Send size={15} /> Enviar correo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OneDrive Picker Modal for Link Attachment */}
      {showOneDrivePicker && (
        <div className="modal-overlay" onClick={() => setShowOneDrivePicker(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3>Seleccionar archivo de OneDrive para enlazar</h3>
              <button className="btn icon-only" onClick={() => setShowOneDrivePicker(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {dataset.driveFiles.filter((f) => f.status === 'active').map((f) => (
                <div
                  key={f.id}
                  onClick={() => {
                    setComposeDraft((prev) => ({
                      ...prev,
                      linkedFileIds: [...prev.linkedFileIds, f.id],
                    }));
                    setShowOneDrivePicker(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid var(--border-light)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{f.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatBytes(f.storageUnitId ? dataset.storageUnits.find(u => u.id === f.storageUnitId)?.sizeBytes || 0 : 0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

