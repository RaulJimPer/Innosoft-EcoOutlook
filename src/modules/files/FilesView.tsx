import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Archive,
  ArrowUpDown,
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  File,
  FileArchive,
  FileAudio,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
  FolderInput,
  FolderPlus,
  Grid,
  History,
  Info,
  LayoutGrid,
  List,
  Plus,
  RotateCcw,
  Share2,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { useGame } from '../../game/GameContext';
import { DriveFile, FileCategory, FileVersion, ShareLink } from '../../domain/types';
import { formatBytes } from '../../domain/storage';

interface FilesViewProps {
  currentFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
  filterMode: 'all' | 'recent' | 'shared' | 'trash';
}

export const FilesView: React.FC<FilesViewProps> = ({
  currentFolderId,
  onSelectFolder,
  filterMode,
}) => {
  const {
    dataset,
    globalSearchQuery,
    createDriveFolder,
    renameFile,
    moveFilesToFolder,
    moveFilesToTrash,
    restoreFiles,
    permanentlyDeleteFiles,
    deleteOldFileVersion,
    createShareLink,
    updateShareAccess,
    revokeShareLink,
    toggleFileFavorite,
    showConfirmDialog,
  } = useGame();

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [categoryFilter, setCategoryFilter] = useState<FileCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'modifiedAt' | 'size'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modals
  const [previewFile, setPreviewFile] = useState<DriveFile | null>(null);
  const [showNewFolderModal, setShowNewFolderModal] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [copiedLinkNotice, setCopiedLinkNotice] = useState<boolean>(false);
  const [showMoveDropdown, setShowMoveDropdown] = useState<boolean>(false);

  // Filter and sort files
  const files = useMemo(() => {
    let list = dataset.driveFiles;

    // Filter by mode
    if (filterMode === 'trash') {
      list = list.filter((f) => f.status === 'trash');
    } else {
      list = list.filter((f) => f.status === 'active');
      if (filterMode === 'shared') {
        list = list.filter((f) => f.shared);
      } else if (filterMode === 'recent') {
        // Last 30 days
        list = list.slice().sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
      } else if (currentFolderId) {
        list = list.filter((f) => f.folderId === currentFolderId);
      }
    }

    // Category filter
    if (categoryFilter !== 'all') {
      list = list.filter((f) => f.category === categoryFilter);
    }

    // Global text query
    if (globalSearchQuery.trim()) {
      const q = globalSearchQuery.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.extension.toLowerCase().includes(q) ||
          (f.tags && f.tags.some((t) => t.toLowerCase().includes(q))) ||
          (f.descriptionPreview && f.descriptionPreview.toLowerCase().includes(q))
      );
    }

    // Sort
    return list.slice().sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'modifiedAt') {
        comparison = a.modifiedAt.localeCompare(b.modifiedAt);
      } else if (sortBy === 'size') {
        const sizeA = a.storageUnitId ? dataset.storageUnits.find((u) => u.id === a.storageUnitId)?.sizeBytes || 0 : 0;
        const sizeB = b.storageUnitId ? dataset.storageUnits.find((u) => u.id === b.storageUnitId)?.sizeBytes || 0 : 0;
        comparison = sizeA - sizeB;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [dataset.driveFiles, dataset.storageUnits, filterMode, currentFolderId, categoryFilter, globalSearchQuery, sortBy, sortOrder]);

  const currentFolder = useMemo(() => {
    if (!currentFolderId) return null;
    return dataset.driveFolders.find((f) => f.id === currentFolderId) || null;
  }, [dataset.driveFolders, currentFolderId]);

  const getFileSize = (file: DriveFile): number => {
    if (!file.storageUnitId) return 0;
    const unit = dataset.storageUnits.find((u) => u.id === file.storageUnitId);
    return unit ? unit.sizeBytes : 0;
  };

  const getFileIcon = (category: FileCategory) => {
    switch (category) {
      case 'documents':
        return <FileText size={20} color="#0078d4" />;
      case 'images':
        return <FileImage size={20} color="#107c41" />;
      case 'videos':
        return <FileVideo size={20} color="#d83b01" />;
      case 'audio':
        return <FileAudio size={20} color="#8764b8" />;
      case 'sheets':
        return <FileSpreadsheet size={20} color="#107c41" />;
      case 'compressed':
        return <FileArchive size={20} color="#e5a903" />;
      default:
        return <File size={20} color="#605e5c" />;
    }
  };

  // Bulk handlers
  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(files.map((f) => f.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleTrashSelected = () => {
    moveFilesToTrash(Array.from(selectedIds));
    setSelectedIds(new Set());
    if (previewFile) setPreviewFile(null);
  };

  const handleRestoreSelected = () => {
    restoreFiles(Array.from(selectedIds));
    setSelectedIds(new Set());
    if (previewFile) setPreviewFile(null);
  };

  const handleDeleteForeverSelected = () => {
    const ids = Array.from(selectedIds);
    const selFiles = dataset.driveFiles.filter((f) => ids.includes(f.id));
    const totalBytes = selFiles.reduce((acc, f) => acc + getFileSize(f), 0);
    const hasCanonical = selFiles.some((f) => f.isCanonicalDuplicate || f.tags.includes('único') || f.tags.includes('no eliminar'));

    showConfirmDialog({
      title: 'Eliminar permanentemente archivos',
      message: `¿Deseas eliminar de forma definitiva ${ids.length} archivo(s)?`,
      details: [
        `Espacio a liberar: ${formatBytes(totalBytes)}`,
        'Esta acción no se puede deshacer.',
      ],
      warningNotice: hasCanonical ? '¡CUIDADO! Se han seleccionado copias canónicas o copias de seguridad únicas. Borrarlas restará hasta -200 puntos.' : undefined,
      confirmLabel: 'Eliminar permanentemente',
      isDanger: true,
      onConfirm: () => {
        permanentlyDeleteFiles(ids);
        setSelectedIds(new Set());
        if (previewFile) setPreviewFile(null);
      },
    });
  };

  const handleCopyLink = (url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedLinkNotice(true);
    setTimeout(() => setCopiedLinkNotice(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Top Header: Breadcrumbs & New Action */}
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
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
          <button
            className="btn"
            onClick={() => onSelectFolder(null)}
            style={{ padding: '4px 6px', border: 'none', background: 'transparent', fontWeight: currentFolder ? 500 : 700 }}
          >
            Archivos
          </button>
          {currentFolder && (
            <>
              <ChevronRight size={14} color="var(--text-muted)" />
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{currentFolder.name}</span>
            </>
          )}
          {filterMode !== 'all' && (
            <>
              <ChevronRight size={14} color="var(--text-muted)" />
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                {filterMode === 'trash' ? 'Papelera' : filterMode === 'shared' ? 'Compartidos' : 'Recientes'}
              </span>
            </>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn primary" onClick={() => setShowNewFolderModal(true)}>
            <FolderPlus size={15} /> Nueva carpeta
          </button>

          <div style={{ display: 'flex', border: '1px solid var(--border-default)', borderRadius: '4px', overflow: 'hidden' }}>
            <button
              className="btn icon-only"
              onClick={() => setViewMode('list')}
              style={{ borderRadius: 0, background: viewMode === 'list' ? 'var(--primary-light)' : '#fff' }}
              title="Vista de lista"
            >
              <List size={16} />
            </button>
            <button
              className="btn icon-only"
              onClick={() => setViewMode('grid')}
              style={{ borderRadius: 0, background: viewMode === 'grid' ? 'var(--primary-light)' : '#fff' }}
              title="Vista de cuadrícula"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Sort Controls */}
      <div
        style={{
          padding: '6px 16px',
          borderBottom: '1px solid var(--border-light)',
          background: 'var(--bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          fontSize: '12px',
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
          {(['all', 'documents', 'images', 'videos', 'audio', 'sheets', 'compressed', 'other'] as const).map((cat) => (
            <button
              key={cat}
              className="btn"
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '4px 8px',
                fontSize: '11.5px',
                borderRadius: '999px',
                border: categoryFilter === cat ? '1px solid var(--primary)' : '1px solid transparent',
                background: categoryFilter === cat ? 'var(--primary-light)' : 'transparent',
                color: categoryFilter === cat ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: categoryFilter === cat ? 700 : 500,
              }}
            >
              {cat === 'all'
                ? 'Todos'
                : cat === 'documents'
                ? 'Documentos'
                : cat === 'images'
                ? 'Imágenes'
                : cat === 'videos'
                ? 'Vídeos'
                : cat === 'audio'
                ? 'Audio'
                : cat === 'sheets'
                ? 'Hojas y Diapositivas'
                : cat === 'compressed'
                ? 'Comprimidos'
                : 'Otros'}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowUpDown size={14} color="var(--text-muted)" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{ padding: '3px 6px', border: '1px solid var(--border-default)', borderRadius: '3px', fontSize: '11.5px' }}
          >
            <option value="name">Nombre</option>
            <option value="modifiedAt">Fecha de modificación</option>
            <option value="size">Tamaño</option>
          </select>
          <button
            className="btn icon-only"
            onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
            title={sortOrder === 'asc' ? 'Orden ascendente' : 'Orden descendente'}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Bulk Action Bar (when selected) */}
      {selectedIds.size > 0 && (
        <div
          style={{
            padding: '6px 16px',
            background: '#edf5fc',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '12.5px',
          }}
        >
          <strong>{selectedIds.size} archivo(s) seleccionados</strong>

          {/* Move to folder */}
          <div style={{ position: 'relative' }}>
            <button className="btn" onClick={() => setShowMoveDropdown(!showMoveDropdown)}>
              <FolderInput size={14} /> Mover a carpeta
            </button>
            {showMoveDropdown && (
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
                  maxHeight: '240px',
                  overflowY: 'auto',
                  minWidth: '220px',
                }}
              >
                {dataset.driveFolders.map((df) => (
                  <button
                    key={df.id}
                    className="btn"
                    onClick={() => {
                      moveFilesToFolder(Array.from(selectedIds), df.id);
                      setShowMoveDropdown(false);
                      setSelectedIds(new Set());
                    }}
                    style={{ width: '100%', justifyContent: 'flex-start', border: 'none', borderRadius: 0, padding: '6px 12px' }}
                  >
                    {df.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filterMode === 'trash' ? (
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
        </div>
      )}

      {/* Files Content: List or Grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: viewMode === 'grid' ? '16px' : '0' }}>
        {files.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No hay archivos en esta carpeta o criterio de búsqueda.
          </div>
        ) : viewMode === 'list' ? (
          /* List View */
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-default)', fontSize: '11px', color: 'var(--text-muted)' }}>
                <th style={{ width: '36px', textAlign: 'center', padding: '6px 8px' }}>
                  <input
                    type="checkbox"
                    checked={files.length > 0 && files.every((f) => selectedIds.has(f.id))}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th style={{ width: '32px' }}></th>
                <th style={{ padding: '6px 10px' }}>Nombre</th>
                <th style={{ width: '140px', padding: '6px 10px' }}>Carpeta</th>
                <th style={{ width: '140px', padding: '6px 10px' }}>Modificado</th>
                <th style={{ width: '90px', padding: '6px 10px', textAlign: 'right' }}>Tamaño</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => {
                const isSelected = selectedIds.has(file.id);
                const size = getFileSize(file);
                const folder = dataset.driveFolders.find((df) => df.id === file.folderId);

                return (
                  <tr
                    key={file.id}
                    onClick={() => setPreviewFile(file)}
                    style={{
                      borderBottom: '1px solid var(--border-light)',
                      backgroundColor: isSelected ? 'var(--primary-light)' : '#fff',
                      cursor: 'pointer',
                      height: '42px',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#fff';
                    }}
                  >
                    <td style={{ width: '36px', textAlign: 'center', padding: '0 8px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onClick={(e) => handleToggleSelect(file.id, e)}
                        onChange={() => {}}
                      />
                    </td>
                    <td style={{ width: '32px', textAlign: 'center' }}>
                      <button
                        className="btn icon-only"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFileFavorite(file.id);
                        }}
                        style={{ border: 'none', background: 'transparent' }}
                      >
                        <Star size={15} fill={file.favorite ? '#e5a903' : 'none'} color={file.favorite ? '#e5a903' : 'var(--text-muted)'} />
                      </button>
                    </td>
                    <td style={{ padding: '0 10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getFileIcon(file.category)}
                        <span style={{ fontWeight: 600 }}>{file.name}</span>
                        {file.shared && <span className="badge primary" style={{ fontSize: '10px' }}>Compartido</span>}
                        {file.isCanonicalDuplicate && <span className="badge success" style={{ fontSize: '10px' }}>Canónico</span>}
                      </div>
                    </td>
                    <td style={{ padding: '0 10px', color: 'var(--text-secondary)', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {folder?.name || 'Raíz'}
                    </td>
                    <td style={{ padding: '0 10px', color: 'var(--text-muted)', fontSize: '11.5px' }}>
                      {file.modifiedAt.slice(0, 10)}
                    </td>
                    <td style={{ padding: '0 10px', textAlign: 'right', fontWeight: 600, fontSize: '12px', color: size > 50_000_000 ? 'var(--amber)' : 'var(--text-secondary)' }}>
                      {formatBytes(size)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          /* Grid View */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
            {files.map((file) => {
              const isSelected = selectedIds.has(file.id);
              const size = getFileSize(file);

              return (
                <div
                  key={file.id}
                  onClick={() => setPreviewFile(file)}
                  style={{
                    background: isSelected ? 'var(--primary-light)' : '#fff',
                    borderRadius: '8px',
                    border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-default)'}`,
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '6px', background: 'var(--bg-subtle)', display: 'grid', placeItems: 'center' }}>
                      {getFileIcon(file.category)}
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onClick={(e) => handleToggleSelect(file.id, e)}
                      onChange={() => {}}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '13px', lineHeight: 1.3, marginBottom: '4px', wordBreak: 'break-word' }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {formatBytes(size)} · {file.modifiedAt.slice(0, 10)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {file.shared && <span className="badge primary" style={{ fontSize: '10px' }}>Compartido</span>}
                    {file.isCanonicalDuplicate && <span className="badge success" style={{ fontSize: '10px' }}>Canónico</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===================== FILE PREVIEW & DETAILS MODAL ===================== */}
      {previewFile && (
        <div className="modal-overlay" onClick={() => setPreviewFile(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px', maxHeight: '85vh' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {getFileIcon(previewFile.category)}
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{previewFile.name}</h3>
              </div>
              <button className="btn icon-only" onClick={() => setPreviewFile(null)}>
                <X size={16} />
              </button>
            </div>

            {/* Quick action bar */}
            <div style={{ padding: '8px 20px', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {previewFile.status === 'trash' ? (
                <>
                  <button
                    className="btn"
                    onClick={() => {
                      restoreFiles([previewFile.id]);
                      setPreviewFile(null);
                    }}
                  >
                    <RotateCcw size={14} /> Restaurar de Papelera
                  </button>
                  <button
                    className="btn danger-solid"
                    onClick={() => {
                      permanentlyDeleteFiles([previewFile.id]);
                      setPreviewFile(null);
                    }}
                  >
                    <Trash2 size={14} /> Eliminar definitivamente
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn"
                    onClick={() => {
                      if (previewFile.shared) revokeShareLink(previewFile.id);
                      else createShareLink(previewFile.id);
                    }}
                  >
                    <Share2 size={14} /> {previewFile.shared ? 'Revocar enlace' : 'Crear enlace compartido'}
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => {
                      moveFilesToTrash([previewFile.id]);
                      setPreviewFile(null);
                    }}
                  >
                    <Trash2 size={14} /> Mover a Papelera
                  </button>
                </>
              )}
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Metadata */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--bg-subtle)', padding: '14px', borderRadius: '6px', fontSize: '12.5px' }}>
                <div><strong>Tamaño:</strong> {formatBytes(getFileSize(previewFile))}</div>
                <div><strong>Tipo:</strong> {previewFile.extension.toUpperCase()} ({previewFile.category})</div>
                <div><strong>Carpeta:</strong> {dataset.driveFolders.find((df) => df.id === previewFile.folderId)?.name}</div>
                <div><strong>Última modificación:</strong> {previewFile.modifiedAt.replace('T', ' ')}</div>
                {previewFile.duplicateGroupId && (
                  <div style={{ gridColumn: 'span 2', color: 'var(--primary)', fontWeight: 600 }}>
                    ℹ️ Pertenece a un grupo de duplicados ({previewFile.isCanonicalDuplicate ? 'Esta es la copia canónica' : 'Copia redundante'})
                  </div>
                )}
              </div>

              {/* Description preview */}
              {previewFile.descriptionPreview && (
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', background: '#fafafa', padding: '10px 14px', borderRadius: '4px', borderLeft: '3px solid var(--primary)' }}>
                  "{previewFile.descriptionPreview}"
                </div>
              )}

              {/* Version History */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <History size={16} color="var(--primary)" /> Historial de versiones ({previewFile.versionIds.length})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {previewFile.versionIds.map((vId) => {
                    const ver = dataset.fileVersions.find((v) => v.id === vId);
                    if (!ver || ver.status === 'deleted') return null;
                    const verSize = dataset.storageUnits.find((u) => u.id === ver.storageUnitId)?.sizeBytes || 0;

                    return (
                      <div
                        key={vId}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          background: ver.isCurrent ? '#f0f7fc' : 'var(--bg-subtle)',
                          border: `1px solid ${ver.isCurrent ? '#c7e0f4' : 'var(--border-light)'}`,
                          fontSize: '12px',
                        }}
                      >
                        <div>
                          <strong style={{ color: ver.isCurrent ? 'var(--primary)' : 'var(--text-primary)' }}>
                            Versión {ver.versionNumber} {ver.isCurrent && '(Actual)'}
                          </strong>
                          <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                            {ver.note || 'Sin nota de revisión'} · {ver.modifiedAt.slice(0, 10)}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 600 }}>{formatBytes(verSize)}</span>
                          {!ver.isCurrent && (
                            <button
                              className="btn danger"
                              onClick={() => deleteOldFileVersion(previewFile.id, ver.id)}
                              style={{ fontSize: '11px', padding: '3px 8px' }}
                              title="Eliminar esta versión intermedia obsoleta"
                            >
                              Eliminar versión
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Share link details */}
              {previewFile.shared && previewFile.shareLink && (
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Share2 size={16} color="var(--primary)" /> Enlace compartido simulado
                  </h4>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <input
                      type="text"
                      readOnly
                      value={previewFile.shareLink.url}
                      style={{ flex: 1, padding: '6px 10px', fontSize: '12px', borderRadius: '4px', border: '1px solid var(--border-default)', background: '#fafafa' }}
                    />
                    <button className="btn" onClick={() => handleCopyLink(previewFile.shareLink!.url)}>
                      <Copy size={14} /> Copiar
                    </button>
                  </div>

                  {copiedLinkNotice && (
                    <div style={{ color: 'var(--green)', fontSize: '11.5px', fontWeight: 600 }}>
                      ✓ Enlace copiado al portapapeles
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', fontSize: '12px' }}>
                    <span>Acceso del enlace:</span>
                    <select
                      value={previewFile.shareLink.access}
                      onChange={(e) => updateShareAccess(previewFile.id, e.target.value as any)}
                      style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-default)' }}
                    >
                      <option value="people-in-org">Solo personas de la organización</option>
                      <option value="anyone-with-link">Cualquiera con el enlace (Público)</option>
                      <option value="specific-people">Personas específicas</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn" onClick={() => setPreviewFile(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="modal-overlay" onClick={() => setShowNewFolderModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <h3>Crear nueva carpeta</h3>
              <button className="btn icon-only" onClick={() => setShowNewFolderModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Nombre de la carpeta:</label>
              <input
                type="text"
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Ej. Informes 2026..."
                style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--border-default)', marginTop: '6px', fontSize: '13px' }}
              />
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setShowNewFolderModal(false)}>Cancelar</button>
              <button
                className="btn primary"
                disabled={!newFolderName.trim()}
                onClick={() => {
                  createDriveFolder(newFolderName.trim(), currentFolderId || undefined);
                  setNewFolderName('');
                  setShowNewFolderModal(false);
                }}
              >
                Crear carpeta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

