import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Edit2,
  FolderPlus,
  GitMerge,
  Mail,
  Phone,
  Plus,
  Search,
  Star,
  Tag,
  Trash2,
  User,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useGame } from '../../game/GameContext';
import { Contact } from '../../domain/types';

interface ContactsViewProps {
  filterMode: 'all' | 'favorites' | 'duplicates';
}

export const ContactsView: React.FC<ContactsViewProps> = ({ filterMode }) => {
  const {
    dataset,
    globalSearchQuery,
    editContact,
    toggleContactFavorite,
    addContactGroup,
    deleteContact,
    mergeContacts,
    showConfirmDialog,
  } = useGame();

  const [localSearch, setLocalSearch] = useState<string>('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<Partial<Contact>>({});

  // Merge Assistant State
  const [showMergeAssistant, setShowMergeAssistant] = useState<boolean>(false);
  const [mergePrimaryId, setMergePrimaryId] = useState<string>('');
  const [mergeSecondaryIds, setMergeSecondaryIds] = useState<string[]>([]);
  const [mergeConflicts, setMergeConflicts] = useState<Record<string, string>>({});

  // Filter contacts
  const contacts = useMemo(() => {
    let list = dataset.contacts.filter((c) => c.status !== 'deleted');

    if (filterMode === 'favorites') {
      list = list.filter((c) => c.favorite);
    } else if (filterMode === 'duplicates') {
      // Group by scoringCaseId or matching duplicate groups
      list = list.filter(
        (c) =>
          c.scoringCaseId &&
          ['CON-001', 'CON-002', 'CON-003', 'CON-007', 'CON-008', 'CON-010'].includes(c.scoringCaseId)
      );
    }

    const q = (localSearch || globalSearchQuery).trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.displayName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.organization && c.organization.toLowerCase().includes(q)) ||
          (c.department && c.department.toLowerCase().includes(q)) ||
          (c.role && c.role.toLowerCase().includes(q))
      );
    }

    return list;
  }, [dataset.contacts, filterMode, localSearch, globalSearchQuery]);

  // Generate 2-letter initials for avatar
  const getInitials = (c: Contact) => {
    const p = c.displayName.split(' ');
    if (p.length >= 2) return `${p[0][0]}${p[1][0]}`.toUpperCase();
    return c.displayName.slice(0, 2).toUpperCase();
  };

  const handleOpenEdit = (c: Contact) => {
    setSelectedContact(c);
    setEditForm({
      displayName: c.displayName,
      email: c.email,
      phone: c.phone || '',
      organization: c.organization || '',
      role: c.role || '',
      department: c.department || '',
      notes: c.notes || '',
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedContact) return;
    editContact(selectedContact.id, editForm);
    setIsEditing(false);
    setSelectedContact(null);
  };

  const handleDeleteContact = (c: Contact) => {
    showConfirmDialog({
      title: 'Eliminar contacto',
      message: `¿Estás seguro de que deseas eliminar a "${c.displayName}"?`,
      details: [
        `Correo: ${c.email}`,
        `Organización: ${c.organization || 'General'}`,
        'Los correos históricos asociados mantendrán el nombre y la dirección registrada.',
      ],
      warningNotice: c.scoringCaseId === 'CON-005' ? '¡PELIGRO! La Dra. Carmen Soler es un contacto clave del comité. Borrarla restará -200 puntos.' : undefined,
      confirmLabel: 'Eliminar contacto',
      isDanger: true,
      onConfirm: () => {
        deleteContact(c.id);
        if (selectedContact?.id === c.id) setSelectedContact(null);
      },
    });
  };

  // Launch Merge Assistant prefilled with a contact
  const handleOpenMerge = (c: Contact) => {
    setMergePrimaryId(c.id);
    // Find potential duplicate candidates
    const candidates = dataset.contacts.filter(
      (other) =>
        other.id !== c.id &&
        other.status === 'active' &&
        (other.scoringCaseId === c.scoringCaseId ||
          other.lastName.toLowerCase() === c.lastName.toLowerCase() ||
          other.email === c.email)
    );
    setMergeSecondaryIds(candidates.map((cand) => cand.id));
    setMergeConflicts({});
    setShowMergeAssistant(true);
  };

  // Compute merged fields preview
  const primaryContact = useMemo(
    () => dataset.contacts.find((c) => c.id === mergePrimaryId),
    [dataset.contacts, mergePrimaryId]
  );
  const secondaryContacts = useMemo(
    () => dataset.contacts.filter((c) => mergeSecondaryIds.includes(c.id)),
    [dataset.contacts, mergeSecondaryIds]
  );

  const mergedPreview = useMemo(() => {
    if (!primaryContact) return null;
    const res: Partial<Contact> = { ...primaryContact };

    // Complement empty fields from secondaries
    for (const sec of secondaryContacts) {
      if (!res.phone && sec.phone) res.phone = sec.phone;
      if (!res.role && sec.role) res.role = sec.role;
      if (!res.department && sec.department) res.department = sec.department;
      if (!res.organization && sec.organization) res.organization = sec.organization;
      if (sec.email && sec.email !== res.email) {
        res.secondaryEmails = Array.from(new Set([...(res.secondaryEmails || []), sec.email]));
      }
      if (sec.notes && sec.notes !== res.notes) {
        res.notes = res.notes ? `${res.notes} | ${sec.notes}` : sec.notes;
      }
    }

    // Apply manual conflict choices
    Object.assign(res, mergeConflicts);

    return res;
  }, [primaryContact, secondaryContacts, mergeConflicts]);

  const handleConfirmMerge = () => {
    if (!mergePrimaryId || mergeSecondaryIds.length === 0 || !mergedPreview) return;
    mergeContacts(mergePrimaryId, mergeSecondaryIds, mergedPreview);
    setShowMergeAssistant(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Top Header & Search */}
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
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
            {filterMode === 'all'
              ? 'Todos los contactos'
              : filterMode === 'favorites'
              ? 'Contactos favoritos'
              : 'Posibles duplicados detectados'}
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            ({contacts.length} contactos)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f3f2f1',
              border: '1px solid var(--border-default)',
              borderRadius: '4px',
              padding: '0 8px',
              height: '32px',
            }}
          >
            <Search size={14} color="var(--text-muted)" style={{ marginRight: '6px' }} />
            <input
              type="search"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filtrar por nombre o cargo..."
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12px' }}
            />
          </div>
        </div>
      </div>

      {/* Contacts List Grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {contacts.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No se encontraron contactos que coincidan con el filtro.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '14px' }}>
            {contacts.map((c) => {
              const initials = getInitials(c);
              const isMerged = c.status === 'merged';

              return (
                <div
                  key={c.id}
                  style={{
                    background: isMerged ? '#fafafa' : '#fff',
                    borderRadius: '8px',
                    border: `1px solid ${isMerged ? '#e1dfdd' : 'var(--border-default)'}`,
                    padding: '14px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    opacity: isMerged ? 0.65 : 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {/* Avatar */}
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: isMerged ? '#a19f9d' : '#0078d4',
                          color: '#fff',
                          display: 'grid',
                          placeItems: 'center',
                          fontWeight: 700,
                          fontSize: '14px',
                          flexShrink: 0,
                        }}
                      >
                        {initials}
                      </div>

                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-primary)' }}>
                          {c.displayName}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                          {c.role || c.organization || 'Sin cargo'}
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn icon-only"
                      onClick={() => toggleContactFavorite(c.id)}
                      style={{ border: 'none', background: 'transparent' }}
                    >
                      <Star size={16} fill={c.favorite ? '#e5a903' : 'none'} color={c.favorite ? '#e5a903' : 'var(--text-muted)'} />
                    </button>
                  </div>

                  {/* Contact details snippet */}
                  <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={13} color="var(--primary)" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.email}</span>
                    </div>

                    {c.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={13} color="var(--green)" />
                        <span>{c.phone}</span>
                      </div>
                    )}

                    {c.department && (
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Departamento: {c.department}
                      </div>
                    )}

                    {c.notes && (
                      <div style={{ fontSize: '11px', background: '#faf6ea', padding: '4px 6px', borderRadius: '3px', marginTop: '2px', borderLeft: '2px solid #e5a903' }}>
                        {c.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: 'auto', borderTop: '1px solid var(--border-light)', paddingTop: '8px' }}>
                    <button className="btn" onClick={() => handleOpenEdit(c)} style={{ fontSize: '11.5px', padding: '4px 8px' }}>
                      <Edit2 size={12} /> Editar
                    </button>

                    <button className="btn" onClick={() => handleOpenMerge(c)} style={{ fontSize: '11.5px', padding: '4px 8px' }} title="Fusionar duplicados">
                      <GitMerge size={12} /> Fusionar
                    </button>

                    <button
                      className="btn"
                      onClick={() => addContactGroup(c.id, 'Histórico')}
                      style={{ fontSize: '11px', padding: '4px 6px' }}
                      title="Clasificar en grupo Histórico"
                    >
                      +Histórico
                    </button>

                    <button className="btn danger icon-only" onClick={() => handleDeleteContact(c)} style={{ marginLeft: 'auto' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===================== EDIT CONTACT MODAL ===================== */}
      {isEditing && selectedContact && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3>Editar ficha de contacto</h3>
              <button className="btn icon-only" onClick={() => setIsEditing(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Nombre completo:</label>
                <input
                  type="text"
                  value={editForm.displayName || ''}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, displayName: e.target.value }))}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', border: '1px solid var(--border-default)', marginTop: '4px', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Correo electrónico principal:</label>
                <input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', border: '1px solid var(--border-default)', marginTop: '4px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>Teléfono:</label>
                  <input
                    type="text"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', border: '1px solid var(--border-default)', marginTop: '4px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>Cargo / Rol:</label>
                  <input
                    type="text"
                    value={editForm.role || ''}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value }))}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', border: '1px solid var(--border-default)', marginTop: '4px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Notas y comentarios:</label>
                <textarea
                  rows={3}
                  value={editForm.notes || ''}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, notes: e.target.value }))}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', border: '1px solid var(--border-default)', marginTop: '4px', fontSize: '13px' }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setIsEditing(false)}>Cancelar</button>
              <button className="btn primary" onClick={handleSaveEdit}>Guardar cambios</button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MERGE ASSISTANT MODAL ===================== */}
      {showMergeAssistant && primaryContact && (
        <div className="modal-overlay" onClick={() => setShowMergeAssistant(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '760px', maxHeight: '85vh' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GitMerge size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Asistente de fusión de contactos</h3>
              </div>
              <button className="btn icon-only" onClick={() => setShowMergeAssistant(false)}>✕</button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#eff6fc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #c7e0f4', fontSize: '12.5px', color: '#004578' }}>
                💡 <strong>Regla de fusión pedagógica:</strong> Al fusionar contactos, se conserva la ficha principal y se reasocian sus eventos e historiales de correo. Las fichas secundarias pasan a estado combinado para garantizar la trazabilidad sin pérdida de datos.
              </div>

              {/* Comparison table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-default)' }}>
                    <th style={{ padding: '8px' }}>Campo</th>
                    <th style={{ padding: '8px', color: 'var(--primary)' }}>Ficha Principal: {primaryContact.displayName}</th>
                    {secondaryContacts.map((sec) => (
                      <th key={sec.id} style={{ padding: '8px', color: 'var(--text-secondary)' }}>Secundario: {sec.displayName}</th>
                    ))}
                    <th style={{ padding: '8px', color: 'var(--green)' }}>Resultado Combinado</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Teléfono */}
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '8px', fontWeight: 700 }}>Teléfono</td>
                    <td style={{ padding: '8px' }}>
                      {primaryContact.phone ? (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="merge_phone"
                            checked={mergedPreview?.phone === primaryContact.phone}
                            onChange={() => setMergeConflicts((prev) => ({ ...prev, phone: primaryContact.phone! }))}
                          />
                          <span>{primaryContact.phone}</span>
                        </label>
                      ) : (
                        <em style={{ color: 'var(--text-muted)' }}>(vacío)</em>
                      )}
                    </td>
                    {secondaryContacts.map((sec) => (
                      <td key={sec.id} style={{ padding: '8px' }}>
                        {sec.phone ? (
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name="merge_phone"
                              checked={mergedPreview?.phone === sec.phone}
                              onChange={() => setMergeConflicts((prev) => ({ ...prev, phone: sec.phone! }))}
                            />
                            <span>{sec.phone}</span>
                          </label>
                        ) : (
                          <em style={{ color: 'var(--text-muted)' }}>(vacío)</em>
                        )}
                      </td>
                    ))}
                    <td style={{ padding: '8px', fontWeight: 700, color: 'var(--green)' }}>{mergedPreview?.phone || '—'}</td>
                  </tr>

                  {/* Cargo / Rol */}
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '8px', fontWeight: 700 }}>Cargo / Rol</td>
                    <td style={{ padding: '8px' }}>
                      {primaryContact.role ? (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="merge_role"
                            checked={mergedPreview?.role === primaryContact.role}
                            onChange={() => setMergeConflicts((prev) => ({ ...prev, role: primaryContact.role! }))}
                          />
                          <span>{primaryContact.role}</span>
                        </label>
                      ) : (
                        <em style={{ color: 'var(--text-muted)' }}>(vacío)</em>
                      )}
                    </td>
                    {secondaryContacts.map((sec) => (
                      <td key={sec.id} style={{ padding: '8px' }}>
                        {sec.role ? (
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name="merge_role"
                              checked={mergedPreview?.role === sec.role}
                              onChange={() => setMergeConflicts((prev) => ({ ...prev, role: sec.role! }))}
                            />
                            <span>{sec.role}</span>
                          </label>
                        ) : (
                          <em style={{ color: 'var(--text-muted)' }}>(vacío)</em>
                        )}
                      </td>
                    ))}
                    <td style={{ padding: '8px', fontWeight: 700, color: 'var(--green)' }}>{mergedPreview?.role || '—'}</td>
                  </tr>

                  {/* Departamento */}
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '8px', fontWeight: 700 }}>Departamento</td>
                    <td style={{ padding: '8px' }}>
                      {primaryContact.department ? (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="merge_dept"
                            checked={mergedPreview?.department === primaryContact.department}
                            onChange={() => setMergeConflicts((prev) => ({ ...prev, department: primaryContact.department! }))}
                          />
                          <span>{primaryContact.department}</span>
                        </label>
                      ) : (
                        <em style={{ color: 'var(--text-muted)' }}>(vacío)</em>
                      )}
                    </td>
                    {secondaryContacts.map((sec) => (
                      <td key={sec.id} style={{ padding: '8px' }}>
                        {sec.department ? (
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name="merge_dept"
                              checked={mergedPreview?.department === sec.department}
                              onChange={() => setMergeConflicts((prev) => ({ ...prev, department: sec.department! }))}
                            />
                            <span>{sec.department}</span>
                          </label>
                        ) : (
                          <em style={{ color: 'var(--text-muted)' }}>(vacío)</em>
                        )}
                      </td>
                    ))}
                    <td style={{ padding: '8px', fontWeight: 700, color: 'var(--green)' }}>{mergedPreview?.department || '—'}</td>
                  </tr>

                  <tr>
                    <td style={{ padding: '8px', fontWeight: 700 }}>Correos secundarios</td>
                    <td style={{ padding: '8px' }}>—</td>
                    {secondaryContacts.map((sec) => (
                      <td key={sec.id} style={{ padding: '8px' }}>{sec.email}</td>
                    ))}
                    <td style={{ padding: '8px', fontWeight: 700, color: 'var(--green)' }}>
                      {mergedPreview?.secondaryEmails?.join(', ') || '—'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="modal-footer">
              <button className="btn" onClick={() => setShowMergeAssistant(false)}>Cancelar</button>
              <button className="btn primary" onClick={handleConfirmMerge}>
                <Check size={16} /> Confirmar y fusionar fichas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

